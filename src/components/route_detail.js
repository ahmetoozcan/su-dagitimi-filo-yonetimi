import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);


    return hours === 0 ? `${minutes.toString().padStart(2, '0')} Dakika ${remainingSeconds.toString().padStart(2, '0')} Saniye` :
        minutes === 0 ? `${remainingSeconds.toString().padStart(2, '0')} Saniye` :
            `${hours.toString().padStart(2, '0')} Saat ${minutes.toString().padStart(2, '0')} Dakika ${remainingSeconds.toString().padStart(2, '0')} Saniye`;
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
                                        Rota Özeti
                                    </Typography>
                                    <Typography variant="body1">
                                        Mesafe: {route[0].summary.totalDistance / 1000} km
                                    </Typography>
                                    <Typography variant="body1">
                                        Süre: {formatTime(route[0].summary.totalTime)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Dağıtımdaki Araç: {route[1][0].araç_id}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3">
                                    Nokta Konumları
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div>
                                        {route[1].map((waypoint, index) => {
                                            return (
                                                <Typography key={index} variant="body1" component="li">
                                                    {index + 1}. {waypoint.isim === "EGITIM_FAK" ? "Depo" : waypoint.isim.startsWith("CS") ? "Şarj Noktası" : "Sipariş -> " + (orderInfo[index] ? orderInfo[index] !== null ? "Marka: " + orderInfo[index][0].marka_adı + ", Adet: " + orderInfo[index][0].ürün_sayısı + ", Teslim Penceresi: " + orderInfo[index][0].teslim_aralık_baş + "-" + orderInfo[index][0].teslim_aralık_son : "" : "")}
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
