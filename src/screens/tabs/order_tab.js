import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


const originalData = [
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
    {
        id: 2,
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
    {
        id: 3,
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
    {
        id: 4,
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
    const [[startingDate, endingDate], setDates] = useState([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]);
    const [data, setFilteredData] = useState([]);

    useEffect(() => {
        const filterData = () => {
            const filteredData = originalData.filter(item => {
                const itemDate = dayjs(item.date, 'MM.DD.YYYY').toDate();
                return itemDate >= startingDate && itemDate <= endingDate;
            });

            setFilteredData(filteredData);
        };
        filterData();
    }, [startingDate, endingDate]);

    const handleStartingDateChange = (newDate) => {
        setDates([new Date(newDate).toLocaleDateString(), endingDate]);
    }

    const handleEndingDateChange = (newDate) => {
        setDates([startingDate, new Date(newDate).toLocaleDateString()]);
    }



    return (
        <>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <DatePicker label="Başlangıç Zamanı" defaultValue={dayjs(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} disableFuture={true} onChange={(newDate) => handleStartingDateChange(newDate)} />
                    <Box style={{ width: '20px' }} />
                    <DatePicker label="Bitiş Zamanı" defaultValue={dayjs(new Date())} disableFuture={true} onChange={(newDate) => handleEndingDateChange(newDate)} />
                    <Box style={{ width: '20px' }} />
                    <Box style={{ width: '20px' }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary">Dışarıya Aktar</Button>
                    </Box>
                </Grid>
            </Grid>
            <Box height={20} />
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
                                <TableRow>
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
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8} />
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