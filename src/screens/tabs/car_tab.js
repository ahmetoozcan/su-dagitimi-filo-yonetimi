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
const data = [
    { id: 1, plate: '34 ABC 123', maxLoadCapacity: 1000, maxEnginePower: 200, maxSpeed: 120, batteryCapacity: 500, weight: 1500, nextMaintenanceDate: "06.01.2024" },
    { id: 2, plate: '34 DEF 456', maxLoadCapacity: 1200, maxEnginePower: 220, maxSpeed: 130, batteryCapacity: 550, weight: 1600, nextMaintenanceDate: "06.01.2024" },
    // Add more cars as needed
];

const maintenanceData = [
    { id: 1, plate: '34 ABC 123', date: '01.10.2023', cost: 315 },
    { id: 1, plate: '34 ABC 123', date: '01.11.2023', cost: 461 },
    { id: 1, plate: '34 ABC 123', date: '01.12.2023', cost: 400 },
    { id: 1, plate: '34 ABC 123', date: '01.01.2024', cost: 786 },
    { id: 2, plate: '34 DEF 456', date: '01.12.2023', cost: 221 },
    { id: 2, plate: '34 DEF 456', date: '01.10.2023', cost: 322 },
    { id: 2, plate: '34 DEF 456', date: '01.11.2023', cost: 540 },
    { id: 2, plate: '34 DEF 456', date: '01.09.2023', cost: 380 },
    { id: 2, plate: '34 DEF 456', date: '01.01.2024', cost: 417 },
    // Add more maintenance records as needed
];


const CarTab = () => {
    const [data, setData] = useState([]);

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
                                                    return maintenance.id === car.id;
                                                })}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date">
                                                        <Label value="Tarih" offset={-3} position="insideBottom" />
                                                    </XAxis>
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Line dataKey="cost" fill="#8884d8" name="Ücret" />
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