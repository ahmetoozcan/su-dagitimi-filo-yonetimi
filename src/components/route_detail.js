import React from 'react';
import { Grid, Typography, Card, CardContent, Box } from '@mui/material';

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);


    return hours === 0 ? `${minutes.toString().padStart(2, '0')} Dakika ${remainingSeconds.toString().padStart(2, '0')} Saniye` :
        minutes === 0 ? `${remainingSeconds.toString().padStart(2, '0')} Saniye` :
            `${hours.toString().padStart(2, '0')} Saat ${minutes.toString().padStart(2, '0')} Dakika ${remainingSeconds.toString().padStart(2, '0')} Saniye`;
}


const RouteDetails = ({ route }) => {
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
                                        Mesafe: {route.summary.totalDistance / 1000} km
                                    </Typography>
                                    <Typography variant="body1">
                                        Süre: {formatTime(route.summary.totalTime)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3">
                                    Sipariş Konumları
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <div>
                                        {route.inputWaypoints.map((waypoint, index) => (
                                            <Typography key={index} variant="body1" component="li">
                                                {index + 1}. Sipariş: Enlem: {waypoint.latLng.lat}, Boylam: {waypoint.latLng.lng}
                                            </Typography>
                                        ))}
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
