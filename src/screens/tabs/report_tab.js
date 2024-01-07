import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar, Rectangle } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';



const originalData = [
    {
        date: '12.23.2023',
        totalOrders: 100,
        successfulOrders: 80,
        failedOrders: 20,
        totalProductWeight: 2000, // in kg
        totalProductCount: 500,
        totalDistanceCovered: 1000, // in km
        totalEnergyConsumed: 500, // in kWh
        totalDrivingTime: 50, // in hours
        totalChargingTime: 10, // in hours
    },
    {
        date: '12.31.2023',
        totalOrders: 100,
        successfulOrders: 80,
        failedOrders: 20,
        totalProductWeight: 2000, // in kg
        totalProductCount: 500,
        totalDistanceCovered: 1000, // in km
        totalEnergyConsumed: 500, // in kWh
        totalDrivingTime: 50, // in hours
        totalChargingTime: 10, // in hours
    },
    {
        date: '01.01.2024',
        totalOrders: 100,
        successfulOrders: 80,
        failedOrders: 20,
        totalProductWeight: 2000, // in kg
        totalProductCount: 500,
        totalDistanceCovered: 1000, // in km
        totalEnergyConsumed: 500, // in kWh
        totalDrivingTime: 50, // in hours
        totalChargingTime: 10, // in hours
    },
    {
        date: '01.02.2024',
        totalOrders: 100,
        successfulOrders: 80,
        failedOrders: 20,
        totalProductWeight: 2000, // in kg
        totalProductCount: 500,
        totalDistanceCovered: 1000, // in km
        totalEnergyConsumed: 500, // in kWh
        totalDrivingTime: 50, // in hours
        totalChargingTime: 10, // in hours
    },
];

const ReportTab = () => {
    const [timePeriod, setTimePeriod] = useState('day');
    const [data, setFilteredData] = useState([]);
    const [barData, setFilteredBarData] = useState([]);
    const [[startingDate, endingDate], setDates] = useState([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]);

    useEffect(() => {
        const filterData = () => {
            const groupedData = {};

            const filteredData = originalData.filter(item => {
                const itemDate = dayjs(item.date, 'MM.DD.YYYY').toDate();
                return itemDate >= startingDate && itemDate <= endingDate;
            });

            filteredData.forEach(item => {
                const date = new Date(item.date);
                let key;
                let period;

                if (timePeriod === 'week') {
                    // Get the first day of the week (Monday)
                    const startDate = new Date(date.setDate(date.getDate() - ((date.getDay() + 6) % 7)));
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 6);

                    key = dayjs(startDate).format('DD.MM.YYYY');
                    period = `${dayjs(startDate).format('DD.MM.YYYY')} - ${dayjs(endDate).format('DD.MM.YYYY')}`;
                } else if (timePeriod === 'month') {
                    // Get the first day of the month
                    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);

                    key = startDate.toDateString();
                    period = `${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
                } else if (timePeriod === 'day') {
                    key = dayjs(date).format('DD.MM.YYYY');
                    period = dayjs(date).format('DD.MM.YYYY');
                } else {
                    return;
                }

                if (!groupedData[key]) {
                    groupedData[key] = { ...item, date: period };
                } else {
                    // Sum up the values
                    for (let prop in item) {
                        if (prop !== 'date' && typeof item[prop] === 'number') {
                            groupedData[key][prop] += item[prop];
                        }
                    }
                }
            });
            setFilteredBarData(Object.values(groupedData));
            setFilteredData(filteredData);
        };
        filterData();
    }, [startingDate, endingDate, timePeriod]);

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const handleStartingDateChange = (newDate) => {
        const startDate = new Date(newDate);
        setDates([startDate, endingDate]);
    }

    const handleEndingDateChange = (newDate) => {
        const endDate = new Date(newDate);
        setDates([startingDate, endDate]);
    }

    return (
        <>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <DatePicker label="Rapor Başlangıç Zamanı" defaultValue={dayjs(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} disableFuture={true} onChange={(newDate) => handleStartingDateChange(newDate)} />
                    <Box style={{ width: '20px' }} />
                    <DatePicker label="Rapor Bitiş Zamanı" defaultValue={dayjs(new Date())} disableFuture={true} onChange={(newDate) => handleEndingDateChange(newDate)} />
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
            </Grid>
            <Box height={20} />
            <Grid container spacing={2}>
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
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={barData}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="totalOrders" name='Toplam Sipariş' fill="#8884d8" activeBar={<Rectangle fill="blue" stroke="blue" />} />
                                                <Bar dataKey="successfulOrders" name='Başarılı Sipariş' fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                                                <Bar dataKey="failedOrders" name='Başarısız Sipariş' fill="red" activeBar={<Rectangle fill="green" stroke="blue" />} />
                                            </BarChart>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Sipariş</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalOrders, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Başarılı Sipariş</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.successfulOrders, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Başarısız Sipariş</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.failedOrders, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Ürün Ağırlığı</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalProductWeight, 0)} kg</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Ürün Adedi</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalProductCount, 0)}</Typography>
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
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={barData}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="totalDistanceCovered" name='Toplam Alınan Mesafe' fill="#8884d8" activeBar={<Rectangle fill="blue" stroke="blue" />} />
                                                <Bar dataKey="totalEnergyConsumed" name='Toplam Tüketilen Enerji' fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                                                <Bar dataKey="totalDrivingTime" name='Toplam Sürüş Süresi' fill="red" activeBar={<Rectangle fill="green" stroke="blue" />} />
                                            </BarChart>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Alınan Mesafe</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalDistanceCovered, 0)} km</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Tüketilen Enerji</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalEnergyConsumed, 0)} kW</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Sürüş Süresi</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalDrivingTime, 0)} saat</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Toplam Şarj Süresi</Typography>
                                            <Typography>{data.reduce((sum, item) => sum + item.totalChargingTime, 0)} saat</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default ReportTab;