import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';

const dailyData = {
    totalOrders: 100,
    successfulOrders: 80,
    failedOrders: 20,
    totalProductWeight: 2000, // in kg
    totalProductCount: 500,
    totalDistanceCovered: 1000, // in km
    totalEnergyConsumed: 500, // in kWh
    totalDrivingTime: 50, // in hours
    totalChargingTime: 10, // in hours
};

const weeklyData = {
    totalOrders: 700,
    successfulOrders: 560,
    failedOrders: 140,
    totalProductWeight: 14000, // in kg
    totalProductCount: 3500,
    totalDistanceCovered: 7000, // in km
    totalEnergyConsumed: 3500, // in kWh
    totalDrivingTime: 350, // in hours
    totalChargingTime: 70, // in hours
};

const monthlyData = {
    totalOrders: 3000,
    successfulOrders: 2400,
    failedOrders: 600,
    totalProductWeight: 60000, // in kg
    totalProductCount: 15000,
    totalDistanceCovered: 30000, // in km
    totalEnergyConsumed: 15000, // in kWh
    totalDrivingTime: 1500, // in hours
    totalChargingTime: 300, // in hours
};


const ReportTab = () => {
    const [timePeriod, setTimePeriod] = useState('day');
    const [data, setData] = useState(dailyData);
    const [[startingDate, endingDate], setDates] = useState([new Date().toLocaleDateString(), new Date().toLocaleDateString()]);

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
        switch (event.target.value) {
            case 'day':
                setData(dailyData);
                break;
            case 'week':
                setData(weeklyData);
                break;
            case 'month':
                setData(monthlyData);
                break;
            default:
                setData(dailyData);
        }
    };

    const handleStartingDateChange = (newDate) => {
        setDates([new Date(newDate).toLocaleDateString(), endingDate]);
    }

    const handleEndingDateChange = (newDate) => {
        setDates([startingDate, new Date(newDate).toLocaleDateString()]);
    }

    return (

        <Grid container spacing={2}>
            <Grid container justifyContent="center">
                <DatePicker label="Rapor Başlangıç Zamaı" onChange={(newDate) => handleStartingDateChange(newDate)} />
                <Box style={{ width: '20px' }} />
                <DatePicker label="Rapor Bitiş Zamaı" onChange={(newDate) => handleEndingDateChange(newDate)} />
                <Box style={{ width: '20px' }} />
                <FormControl>
                    <Select value={timePeriod} onChange={handleTimePeriodChange}>
                        <MenuItem value="day">Gün</MenuItem>
                        <MenuItem value="week">Hafta</MenuItem>
                        <MenuItem value="month">Ay</MenuItem>
                    </Select>
                </FormControl>
                <Box style={{ width: '20px' }} />
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary">Hepsini Dışarıya Aktar</Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h5">Sipariş</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="primary">Dışarıya Aktar</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ height: '20px' }} />
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <BarChart width={400} height={300} data={[data]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="plate" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalOrders" fill="#8884d8" name='Toplam Sipariş' />
                                            <Bar dataKey="successfulOrders" fill="#82ca9d" name='Başarılı Sipariş' />
                                            <Bar dataKey="failedOrders" fill="#ffc658" name='Başarısız Sipariş' />
                                        </BarChart>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Sipariş</Typography>
                                        <Typography>{data.totalOrders}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Başarılı Sipariş</Typography>
                                        <Typography>{data.successfulOrders}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Ürün Ağırlığı</Typography>
                                        <Typography>{data.totalProductWeight} kg</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Ürün Adedi</Typography>
                                        <Typography>{data.totalProductCount}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h5">Araç</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="primary">Dışarıya Aktar</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box style={{ height: '20px' }} />
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Card>
                                    <CardContent>
                                        <BarChart width={400} height={300} data={[data]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="plate" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalDistanceCovered" fill="#8884d8" name='Toplam Alınan Mesafe' />
                                            <Bar dataKey="totalEnergyConsumed" fill="#82ca9d" name='Toplam Tüketilen Enerji' />
                                            <Bar dataKey="totalDrivingTime" fill="#ffc658" name='Toplam Sürüş Süresi' />
                                        </BarChart>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Alınan Mesafe</Typography>
                                        <Typography>{data.totalDistanceCovered} km</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Tüketilen Enerji</Typography>
                                        <Typography>{data.totalEnergyConsumed} kW</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Sürüş Süresi</Typography>
                                        <Typography>{data.totalDrivingTime} saat</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Toplam Şarj Süresi</Typography>
                                        <Typography>{data.totalChargingTime} saat</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ReportTab;