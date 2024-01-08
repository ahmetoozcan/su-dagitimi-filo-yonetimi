import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';
import Map from '../../components/map/map';
import OrderBox from '../../components/order_box';

import { useContext } from 'react';
import { RouteContext } from '../../contexts/route_context';
import RouteDetails from '../../components/route_detail';
import { UserContext } from '../../contexts/user_context';
import axios from 'axios';



const MainTab = () => {
    const { route } = useContext(RouteContext);
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:5000/order', {
        }).then(response => {
            setOrders(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={3} style={{ maxHeight: '78vh', overflow: 'auto' }}>
                    <Typography variant="h4" gutterBottom>
                        {'Hoşgeldin, ' + user.firstName + " " + user.lastName + " " + user.type}
                    </Typography>
                    {orders.map((order, index) => (
                        <OrderBox key={index} order={order} />
                    ))}
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
