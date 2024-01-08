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

const Status = {
    0: 'Hazırlanıyor',
    1: 'Yolda',
    2: 'Tamamlandı',
    3: 'İptal Edildi',
};


const BoxedComponent = (props) => {
    const { order } = props;

    return (
        <Box padding={"12px"}>
            <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }} >
                <CardHeader
                    title={<Typography variant="h5">{order.kullanıcı_adı}</Typography>}
                    subheader={<Typography variant="body2">{order.teslimat_adresi}</Typography>}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Sipariş Detayları</Typography>
                            <Chip label={Status[order.durum]} sx={{ mr: 1 }} />
                            <Typography variant="body2">{order.sipariş_tarihi}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Ürün</Typography>
                            <Typography variant="body2">{order.marka_adı}</Typography>
                            <Typography variant="body2">Adet: {order.ürün_sayısı}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Teslimat</Typography>
                            <Typography variant="body2">{order.teslim_zamanı}</Typography>
                            <Typography variant="body2">{order.araç_id}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>

    );
};

export default BoxedComponent;