import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box, Button } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';


const Status = {
    0: 'Preparing',
    1: 'On the way',
    2: 'Delivered',
    3: 'Cancelled',
};

const OrderTab = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/order/ordertab')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleExportClick = async () => {
        try {
            const workbook = XLSX.utils.book_new();
            const newData = data.map((order) => {
                return {
                    ...order,
                    "durum": Status[order.durum],
                }
            });
            const worksheet = XLSX.utils.json_to_sheet(newData);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

            XLSX.writeFile(workbook, "orders.xlsx");


        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };


    return (
        <>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleExportClick}>Export</Button>
                    </Box>
                </Grid>
            </Grid>
            <Box height={20} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Delivery Time Window</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Delivery Time</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((order) => (
                            <React.Fragment key={order.sipariş_id}>
                                <TableRow>
                                    <TableCell>{order.sipariş_id}</TableCell>
                                    <TableCell>{order.kullanıcı_ismi + " " + order.soyisim}</TableCell>
                                    <TableCell>{new Date(order.sipariş_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                                    <TableCell>{`${order.teslim_aralık_baş} - ${order.teslim_aralık_son}`}</TableCell>
                                    <TableCell>{order.marka_adı}</TableCell>
                                    <TableCell>{order.ürün_sayısı}</TableCell>
                                    <TableCell>{order.teslim_zamanı}</TableCell>
                                    <TableCell>{Status[order.durum]}</TableCell>
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