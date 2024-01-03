import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Divider,
    Chip,
    Box,
} from '@mui/material';

const BoxedComponent = () => {
    const order = {
        address: '123 Sokak',
        location: '40.7128° N, 74.0060° W',
        orderTime: '2022-01-01 12:00:00',
        deliveryWindow: '2022-01-01 13:00:00 - 14:00:00',
        productName: 'Ürün Adı',
        productQuantity: 1,
        deliveryTime: '2022-01-01 13:30:00',
        deliveryVehicle: 'Araç 1',
        orderStatus: 'Dağıtımda',
    };

    return (
        <Box padding={"12px"}>
            <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }} >
                <CardHeader
                    title={<Typography variant="h5">{order.customerName}</Typography>}
                    subheader={<Typography variant="body2">{order.address}</Typography>}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Sipariş Detayları</Typography>
                            <Chip label={order.orderStatus} sx={{ mr: 1 }} />
                            <Typography variant="body2">{order.orderTime}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Ürün</Typography>
                            <Typography variant="body2">{order.productName}</Typography>
                            <Typography variant="body2">Adet: {order.productQuantity}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Teslimat</Typography>
                            <Typography variant="body2">{order.deliveryTime}</Typography>
                            <Typography variant="body2">{order.deliveryVehicle}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>

    );
};

export default BoxedComponent;