import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Label, LineChart, Line } from 'recharts';
import {
    Grid,
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Collapse,
    Box,
} from '@mui/material';
import axios from 'axios';
import CustomTooltip from '../../components/car_tool_tip';


const CarTab = () => {
    const [data, setData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        axios
            .get('http://localhost:5000/vehicle')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get('http://localhost:5000/vehicle/maintenance')
            .then((response) => {
                response.data.forEach((maintenance) => {
                    maintenance.tarih = maintenance.tarih.substring(0, 10);
                });
                setMaintenanceData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Araç Filosu
                </Typography>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Plaka</TableCell>
                            <TableCell>Maksimum Yük Kapasitesi</TableCell>
                            <TableCell>Maksimum Motor Gücü</TableCell>
                            <TableCell>Maksimum Hız</TableCell>
                            <TableCell>Batarya Kapasitesi</TableCell>
                            <TableCell>Ağırlık</TableCell>
                            <TableCell>Sonraki Bakım Tarihi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((car) => (
                            <React.Fragment key={car.araç_id}>
                                <TableRow onClick={() => handleRowClick(car.araç_id)}>
                                    <TableCell>{car.araç_id}</TableCell>
                                    <TableCell>{car.plaka}</TableCell>
                                    <TableCell>{car.yük_kapasitesi} kg</TableCell>
                                    <TableCell>{car.maksimum_güç} hp</TableCell>
                                    <TableCell>{car.maksimum_hız} km/h</TableCell>
                                    <TableCell>{car.batarya_kapasitesi} kWh</TableCell>
                                    <TableCell>{car.ağırlık} kg</TableCell>
                                    <TableCell>{car.sonraki_bakım_tarihi.substring(0, 10)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={expandedRow === car.araç_id} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <LineChart width={800} height={300} data={maintenanceData.filter((maintenance) => {
                                                    return maintenance.araç_id === car.araç_id;
                                                })}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="tarih">
                                                        <Label value="Tarih" offset={-3} position="insideBottom" />
                                                    </XAxis>
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Line dataKey="maliyet" fill="#8884d8" name="Maliyet" />
                                                </LineChart>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default CarTab;