import React from 'react';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
} from '@mui/material';

const VehicleName = {
    "veh_0": 'Vehicle 1',
    "veh_1": 'Vehicle 2',
    "veh_2": 'Vehicle 3',
    "veh_3": 'Vehicle 4',
    "veh_4": 'Vehicle 5',
};

const BoxedComponent = (props) => {
    const { order } = props;

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'rgba(245, 166, 35, 0.7)'; // Requested - Orange with opacity
            case 1:
                return 'rgba(74, 144, 226, 0.7)'; // On the way - Blue with opacity
            case 2:
                return 'rgba(80, 227, 194, 0.7)'; // Delivered - Green with opacity
            case 3:
                return 'rgba(255, 59, 48, 0.7)'; // Cancelled - Red with opacity
            default:
                return 'rgba(255, 255, 255, 0.7)'; // Default - White with opacity
        }
    };

    return (
        <Box padding={"6px"}>
            <Card sx={{ maxWidth: 600, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
                <CardContent>
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(order.durum),
                            }}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>Order Location</Typography>
                            <Typography variant="body2">{order.teslimat_adresi}</Typography>
                            <Typography variant="body2" fontWeight={600}>Time Window</Typography>
                            <Typography variant="body2">{order.teslim_aralık_baş + " " + order.teslim_aralık_son}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>Brand</Typography>
                            <Typography variant="body2">{order.marka_adı}</Typography>
                            <Typography variant="body2" fontWeight={600}>Count</Typography>
                            <Typography variant="body2">{order.ürün_sayısı}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>Order Date</Typography>
                            <Typography variant="body2">{new Date(order.sipariş_tarihi).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Typography>
                            <Typography variant="body2" fontWeight={600}>Delivery Vehicle</Typography>
                            <Typography variant="body2">{order.araç_id === null ? "Not Yet Assigned" : VehicleName[order.araç_id]}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BoxedComponent;