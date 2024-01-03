import React from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';
import Map from '../../components/map/map';
import OrderBox from '../../components/order_box';

import { useContext } from 'react';
import { RouteContext } from '../../contexts/route_context';
import RouteDetails from '../../components/route_detail';
import { UserContext } from '../../contexts/user_context';



const MainTab = () => {
    const { route } = useContext(RouteContext);
    const { user } = useContext(UserContext);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={3} style={{ maxHeight: '78vh', overflow: 'auto' }}>
                    <Typography variant="h4" gutterBottom>
                        {user == null ? 'Kullanıcı' : 'Hoşgeldin, ' + user.firstName + " " + user.lastName}
                    </Typography>
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                    <OrderBox />
                </Grid>
                <Grid item xs={9}>
                    <Map />
                </Grid>
                <Grid item xs={12}>
                    {route == null ? (
                        <Card sx={{ textAlign: 'center', padding: '20px' }}>
                            <Typography variant="h5">Rota bilgilerini görmek için bir rota seçiniz</Typography>
                        </Card>
                    ) : (
                        <RouteDetails route={route} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainTab;
