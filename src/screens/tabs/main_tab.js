import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, Typography, Button } from '@mui/material';
import Map from '../../components/map/map';
import OrderBox from '../../components/order_box';
import OrderCard from '../../components/order_card';

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
        setInterval(() => {
            switch (user.type) {
                case "müşteri":
                    axios.get('http://localhost:5000/order/customer', {
                        params: {
                            customer_id: user.id
                        }
                    }).then(response => {
                        setOrders(response.data[0]);
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                    break;
                case "filoyöneticisi":
                    axios.get('http://localhost:5000/order/prep', {
                    }).then(response => {
                        setOrders(response.data);
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                    break;
                case "sürücü":
                    axios.get('http://localhost:5000/order/driver', {
                        params: {
                            driver_id: user.id
                        }
                    }).then(response => {
                        setOrders(response.data[0]);
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                    break;
                default:
                    break;
            }
        }, 2000);
    }, [user]);


    const handleRoutes = () => {
        axios.get('http://localhost:8000/sumorouter', {
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={3} style={{ maxHeight: user.type === "filoyöneticisi" ? '78vh' : '90vh', overflow: 'auto' }}>
                    <Button onClick={handleRoutes}>
                        Rotala
                    </Button>
                    {user.type === "müşteri" &&
                        <OrderCard />
                    }
                    {orders.length === 0 ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', padding: '20px' }}>
                            Gösterilecek Sipariş Bulunmamaktadır
                        </Typography>
                    ) : (
                        <>
                            {orders.map((order, index) => <OrderBox key={index} order={order} />)}
                        </>
                    )}
                </Grid>
                <Grid item xs={9}>
                    {user.type === "filoyöneticisi" ? <Map height={"75vh"} /> : <Map height={"93vh"} />}
                </Grid>
                <Grid item xs={12}>
                    {user.type === "filoyöneticisi" && (
                        <>
                            {route == null ? (
                                <Card sx={{ textAlign: 'center', padding: '20px' }}>
                                    <Typography variant="h5">Rota bilgilerini görmek için bir rota seçiniz</Typography>
                                </Card>
                            ) : (
                                <RouteDetails route={route} />
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainTab;
