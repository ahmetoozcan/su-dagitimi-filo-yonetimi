import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography, Collapse, Box } from '@mui/material';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const data = [
    {
        id: 1,
        address: '123 Main St',
        location: '40.7128° N, 74.0060° W',
        orderTime: '2022-01-01 10:00 AM',
        deliveryWindow: '10:00 AM - 12:00 PM',
        productName: 'Ürün A',
        quantity: 2,
        deliveryTime: '2022-01-01 11:30 AM',
        deliveryVehicle: 'Araç 1',
        status: 'Teslim Edildi'
    },
];

const OrderTab = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };



    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Siparişler
                </Typography>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Adres</TableCell>
                            <TableCell>Konum</TableCell>
                            <TableCell>Sipariş Zamanı</TableCell>
                            <TableCell>Teslim Zaman Penceresi</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Adet</TableCell>
                            <TableCell>Teslim Zamanı</TableCell>
                            <TableCell>Teslim Aracı</TableCell>
                            <TableCell>Durum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((order) => (
                            <React.Fragment key={order.id}>
                                <TableRow onClick={() => handleRowClick(order.id)}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.location}</TableCell>
                                    <TableCell>{order.orderTime}</TableCell>
                                    <TableCell>{order.deliveryWindow}</TableCell>
                                    <TableCell>{order.productName}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.deliveryTime}</TableCell>
                                    <TableCell>{order.deliveryVehicle}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={expandedRow === order.id} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <BarChart width={400} height={300} data={[order]}>
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
};

export default OrderTab;