import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, Typography, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Map from '../../components/map/map';
import OrderBox from '../../components/order_box';

import { useContext } from 'react';
import { RouteContext } from '../../contexts/route_context';
import RouteDetails from '../../components/route_detail';
import { UserContext } from '../../contexts/user_context';
import axios from 'axios';


const LegendItem = ({ color, label }) => {
    return (
        <li key={label} style={{ display: 'flex', alignItems: 'center', marginRight: '10px', marginTop: '10px' }}>
            <span style={{ backgroundColor: color, width: 16, height: 16, borderRadius: '50%', marginRight: 5 }} />
            <Typography variant="h9" fontWeight={600} sx={{ textAlign: 'center' }}>{label}</Typography>
        </li>
    );
};


const MainTab = () => {
    const { route } = useContext(RouteContext);
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [checked, setChecked] = useState(Array(5).fill(true)); // Keep track of selected vehicles

    const handleCheckboxChange = (event) => {
        const newChecked = checked.map((c, i) => (i === parseInt(event.target.name) ? !c : c));
        setChecked(newChecked);
    };

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
        axios.get('http://localhost:8000/router', {
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const handleSimulation = () => {
        axios.get('http://localhost:8000/sumo', {
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    const downloadFile = async (url, filename) => {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };



    const statuses = [
        { status: 0, color: 'rgba(245, 166, 35, 0.7)', label: 'Requested' },
        { status: 1, color: 'rgba(74, 144, 226, 0.7)', label: 'On the way' },
        { status: 2, color: 'rgba(80, 227, 194, 0.7)', label: 'Delivered' },
        { status: 3, color: 'rgba(255, 59, 48, 0.7)', label: 'Cancelled' },
    ];


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Grid>
                        {user.type === "filoyöneticisi" &&
                            <>
                                <Box display="flex" justifyContent="center">
                                    <Box mr={1}>
                                        <Button variant="contained" color="primary" onClick={handleRoutes}>
                                            <Typography variant="h9" fontWeight={600} sx={{ textAlign: 'center' }}>
                                                PLAN ROUTES
                                            </Typography>
                                        </Button>
                                    </Box>
                                    <Box ml={1}>
                                        <Button variant="contained" color="primary" onClick={handleSimulation}>
                                            <Typography variant="h9" fontWeight={600} sx={{ textAlign: 'center' }}>
                                                DEPART FOR DISTRIBUTION
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="center" marginY={1}>
                                    <Button variant="contained" color="primary" onClick={() => {
                                        downloadFile("http://localhost:7000/algorithm-export", "algorithm.xml");
                                        downloadFile("http://localhost:7000/sumo-export", "sumo.zip");
                                    }}>
                                        <Typography variant="h9" fontWeight={600} sx={{ textAlign: 'center' }}>
                                            EXPORT SUMO AND ALGORITHM FILES
                                        </Typography>
                                    </Button>
                                </Box>
                                <Box display="flex" justifyContent="center" marginY={1}>
                                    {
                                        statuses.map(status => (
                                            <LegendItem key={status.status} color={status.color} label={status.label} />
                                        ))

                                    }
                                </Box>
                            </>
                        }
                    </Grid>
                    <Grid style={{ maxHeight: user.type === "filoyöneticisi" ? '70vh' : '90vh', overflow: 'auto' }}>
                        {orders.length === 0 ? (
                            <Typography variant="h6" sx={{ textAlign: 'center', padding: '20px' }}>
                                No orders to display
                            </Typography>
                        ) : (
                            <>
                                {orders.map((order, index) => <OrderBox key={index} order={order} />)}
                            </>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    {user.type === "filoyöneticisi" ?
                        <>
                            <Map height={"75vh"} vehicles={checked} />
                            <FormGroup row sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                {["Vehicle 1", "Vehicle 2", "Vehicle 3", "Vehicle 4", "Vehicle 5"].map(
                                    (label, index) => (
                                        <FormControlLabel
                                            key={label}
                                            control={<Checkbox checked={checked[index]} onChange={handleCheckboxChange} name={index} />}
                                            label={label}
                                        />
                                    )
                                )}
                            </FormGroup>
                        </>
                        :
                        <Map height={"93vh"} />}
                </Grid>
                <Grid item xs={12}>
                    {user.type === "filoyöneticisi" && (
                        <>
                            {route == null ? (
                                <Card sx={{ textAlign: 'center', padding: '20px' }}>
                                    <Typography variant="h5">Please click on a route to view route details</Typography>
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
