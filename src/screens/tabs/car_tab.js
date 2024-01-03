import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
const data = [
    { id: 1, plate: '34 ABC 123', maxLoadCapacity: 1000, maxEnginePower: 200, maxSpeed: 120, batteryCapacity: 500, weight: 1500, maintenanceCost: 1000 },
    { id: 2, plate: '34 DEF 456', maxLoadCapacity: 1200, maxEnginePower: 220, maxSpeed: 130, batteryCapacity: 550, weight: 1600, maintenanceCost: 1100 },
    // Add more cars as needed
];

const CarTab = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
                            <TableCell>Bakım Maliyeti</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((car) => (
                            <React.Fragment key={car.id}>
                                <TableRow onClick={() => handleRowClick(car.id)}>
                                    <TableCell>{car.id}</TableCell>
                                    <TableCell>{car.plate}</TableCell>
                                    <TableCell>{car.maxLoadCapacity} kg</TableCell>
                                    <TableCell>{car.maxEnginePower} hp</TableCell>
                                    <TableCell>{car.maxSpeed} km/h</TableCell>
                                    <TableCell>{car.batteryCapacity} kWh</TableCell>
                                    <TableCell>{car.weight} kg</TableCell>
                                    <TableCell>${car.maintenanceCost}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={expandedRow === car.id} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <BarChart width={400} height={300} data={[car]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="plate" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="maxLoadCapacity" fill="#8884d8" name='Maksimum Yük Kapasitesi' />
                                                    <Bar dataKey="maxEnginePower" fill="#82ca9d" name='Maksimum Motor Gücü' />
                                                    <Bar dataKey="maxSpeed" fill="#ffc658" name='Maksimum Hız' />
                                                </BarChart>
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