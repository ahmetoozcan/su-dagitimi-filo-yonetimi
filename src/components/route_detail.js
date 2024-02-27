import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);


    return hours === 0 ? `${minutes.toString().padStart(2, '0')} Minute ${remainingSeconds.toString().padStart(2, '0')} Second` :
        minutes === 0 ? `${remainingSeconds.toString().padStart(2, '0')} Second` :
            `${hours.toString().padStart(2, '0')} Hour ${minutes.toString().padStart(2, '0')} Minute ${remainingSeconds.toString().padStart(2, '0')} Second`;
}



const RouteDetails = ({ route }) => {

    const [orderInfo, setOrderInfo] = useState([]);



    useEffect(() => {
        const orderInfoArray = []; // Create an array to store the order info

        route[1].map(async (point, index) => {
            if (point.sipariş_id !== null) {
                try {
                    const response = await axios.get('http://localhost:5000/route/order/info', {
                        params: {
                            order_id: point.sipariş_id
                        }
                    });
                    orderInfoArray[index] = response.data[0]; // Store the response in the array
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                orderInfoArray[index] = null; // If the point is not an order, store null in the array
            }
        });

        setOrderInfo(orderInfoArray); // Set the order info state with the array
    }, [route]);


    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Route Detail
                                    </Typography>
                                    <Typography variant="body1">
                                        Planned Distance: {route[0].summary.totalDistance / 1000} km
                                    </Typography>
                                    <Typography variant="body1">
                                        Planned Time: {formatTime(route[0].summary.totalTime)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Vehicle in Distribution: {route[1][0].araç_id}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3">
                                    Point Details
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div>
                                        {route[1].map((waypoint, index) => {
                                            return (
                                                <Typography key={index} variant="body1" component="li">
                                                    {index + 1}. {waypoint.isim === "EGITIM_FAK" ?
                                                        "Depot" : waypoint.isim.startsWith("CS") ?
                                                            "Charging Point" : "Order -> " + (orderInfo[index] ? orderInfo[index] !== null ?
                                                                "Brand: " + orderInfo[index][0].marka_adı +
                                                                ", Count: " + orderInfo[index][0].ürün_sayısı +
                                                                ", Time Window: " + orderInfo[index][0].teslim_aralık_baş +
                                                                "-" + orderInfo[index][0].teslim_aralık_son : "" : "")}
                                                </Typography>
                                            )
                                        })}
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default RouteDetails;
