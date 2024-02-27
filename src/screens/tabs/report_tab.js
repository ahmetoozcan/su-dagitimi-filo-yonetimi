import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar, Rectangle } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import axios from 'axios';
import DriverTab from './driver_tab';

const ReportTab = () => {
    const [timePeriod, setTimePeriod] = useState('day');
    const [data, setData] = useState([]);
    const [chargeData, setChargeData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [routeData, setRouteData] = useState([]);
    const [[startingDate, endingDate], setDates] = useState([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');

    const handleExportClick = async () => {
        try {
            const workbook = XLSX.utils.book_new();


            const routeSheet = XLSX.utils.json_to_sheet(routeData);
            XLSX.utils.book_append_sheet(workbook, routeSheet, "Route Data");

            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Data");

            const orderSheet = XLSX.utils.json_to_sheet(orderData);
            XLSX.utils.book_append_sheet(workbook, orderSheet, "Order Duration");

            const chargeSheet = XLSX.utils.json_to_sheet(chargeData);
            XLSX.utils.book_append_sheet(workbook, chargeSheet, "Charge Duration");


            XLSX.writeFile(workbook, "all.xlsx");

        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const handleRouteExportClick = async () => {
        try {
            const workbook = XLSX.utils.book_new();

            // Create individual sheets with spacing
            const routeSheet = XLSX.utils.json_to_sheet(routeData);
            XLSX.utils.book_append_sheet(workbook, routeSheet, "Route Data");

            const orderSheet = XLSX.utils.json_to_sheet(orderData);
            XLSX.utils.book_append_sheet(workbook, orderSheet, "Order Duration");

            const chargeSheet = XLSX.utils.json_to_sheet(chargeData);
            XLSX.utils.book_append_sheet(workbook, chargeSheet, "Charge Duration");

            XLSX.writeFile(workbook, "route.xlsx");

        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };



    const handleAraçExportClick = async () => {
        try {
            const workbook = XLSX.utils.book_new();

            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Data");

            XLSX.writeFile(workbook, "vehicle.xlsx");


        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const handleVehicleChange = (event) => {
        setSelectedVehicleId(event.target.value);
        console.log(event.target.value)
    };

    useEffect(() => {
        axios
            .get('http://localhost:5000/vehicle')
            .then((response) => {
                if (response.data.length > 0) {
                    setVehicles(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (startingDate && endingDate) {
            const chargeUrl = `http://localhost:5000/charge/time/${timePeriod}`;
            const orderUrl = `http://localhost:5000/order/time/${timePeriod}`;
            const routeUrl = `http://localhost:5000/route/report/${timePeriod}`;
            const timeParams = {
                starting_date: startingDate.toISOString().split('T')[0],
                ending_date: endingDate.toISOString().split('T')[0]
            };

            axios.get(chargeUrl, { params: timeParams })
                .then((response) => {
                    console.log(response.data)
                    response.data[0].forEach((data) => {
                        if (data.Gün) {
                            data.Gün = dayjs(data.Gün).format('DD.MM.YYYY');
                        }
                        if (data.Ay) {
                            data.AY = dayjs(data.Ay).format('MM.YYYY');
                        }
                        if (data.Hafta) {
                            data.Hafta = dayjs(data.Hafta).format('DD.MM.YYYY');
                        }
                    });
                    response.data[0].forEach((data) => {
                        data.ŞarjİstasyonundaToplamHarcananSüre = parseFloat(data.ŞarjİstasyonundaToplamHarcananSüre);
                    });

                    setChargeData(response.data[0]);
                })
                .catch((error) => {
                    console.error(error);
                });
            axios.get(orderUrl, { params: timeParams })
                .then((response) => {
                    console.log(response.data)
                    response.data[0].forEach((data) => {
                        if (data.Gün) {
                            data.Gün = dayjs(data.Gün).format('DD.MM.YYYY');
                        }
                        if (data.Ay) {
                            data.AY = dayjs(data.Ay).format('MM.YYYY');
                        }
                        if (data.Hafta) {
                            data.Hafta = dayjs(data.Hafta).format('DD.MM.YYYY');
                        }
                    });
                    response.data[0].forEach((data) => {
                        data.SiparişToplamHarcananSüre = parseFloat(data.SiparişToplamHarcananSüre);
                    });
                    setOrderData(response.data[0]);
                })
                .catch((error) => {
                    console.error(error);
                });
            axios.get(routeUrl, { params: timeParams })
                .then((response) => {
                    console.log(response.data)
                    response.data[0].forEach((data) => {
                        if (data.Gün) {
                            data.Gün = dayjs(data.Gün).format('DD.MM.YYYY');
                        }
                        if (data.Ay) {
                            data.AY = dayjs(data.Ay).format('MM.YYYY');
                        }
                        if (data.Hafta) {
                            data.Hafta = dayjs(data.Hafta).format('DD.MM.YYYY');
                        }
                    });
                    response.data[0].forEach((data) => {
                        data.TeslimEdilenToplamÜrünSayısı = parseInt(data.TeslimEdilenToplamÜrünSayısı);
                        data.ToplamSipariş = parseInt(data.ToplamSipariş);
                        data.ToplamÇalışmaSaati = parseFloat(data.ToplamÇalışmaSaati);
                        data.ZamanındaUlaştırılamayanSipariş = parseInt(data.ZamanındaUlaştırılamayanSipariş);
                        data.ZamanındaUlaştırılanSipariş = parseInt(data.ZamanındaUlaştırılanSipariş);
                    });
                    setRouteData(response.data[0]);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [startingDate, endingDate, timePeriod]);


    useEffect(() => {
        if (selectedVehicleId && startingDate && endingDate) {
            const url = `http://localhost:5000/vehicle/report/${timePeriod}`;

            const params = {
                vehicle_id: selectedVehicleId,
                starting_date: startingDate.toISOString().split('T')[0],
                ending_date: endingDate.toISOString().split('T')[0]
            };

            axios.get(url, { params: params })
                .then((response) => {
                    console.log(response.data)
                    response.data[0].forEach((data) => {
                        if (data.Gün) {
                            data.Gün = dayjs(data.Gün).format('DD.MM.YYYY');
                        }
                        if (data.Ay) {
                            data.AY = dayjs(data.Ay).format('MM.YYYY');
                        }
                        if (data.Hafta) {
                            data.Hafta = dayjs(data.Hafta).format('DD.MM.YYYY');
                        }
                    });

                    setData(response.data[0]);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [startingDate, endingDate, timePeriod, selectedVehicleId]);

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
                    <DatePicker label="Report Starting Date" defaultValue={dayjs(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} disableFuture={true} onChange={(newDate) => handleStartingDateChange(newDate)} />
                    <Box style={{ width: '20px' }} />
                    <DatePicker label="Report Ending Date" defaultValue={dayjs(new Date())} disableFuture={true} onChange={(newDate) => handleEndingDateChange(newDate)} />
                    <Box style={{ width: '20px' }} />
                    <FormControl>
                        <Select value={timePeriod} onChange={handleTimePeriodChange}>
                            <MenuItem value="day">Daily</MenuItem>
                            <MenuItem value="week">Weekly</MenuItem>
                            <MenuItem value="month">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                    <Box style={{ width: '20px' }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleExportClick}>Export All</Button>
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
                                    <Typography variant="h5">Route</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" onClick={handleRouteExportClick}>Export</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box style={{ height: '20px' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <BarChart
                                                width={1600}
                                                height={300}
                                                data={routeData}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey={timePeriod === "day" ? "Gün" : timePeriod === "week" ? "Hafta" : "AY"} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="ToplamSipariş" name='Total Orders' fill="#8884d8" activeBar={<Rectangle fill="blue" stroke="blue" />} />
                                                <Bar dataKey="ZamanındaUlaştırılanSipariş" name='Successful Orders' fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                                                <Bar dataKey="ZamanındaUlaştırılamayanSipariş" name='Failed Orders' fill="red" activeBar={<Rectangle fill="green" stroke="blue" />} />
                                            </BarChart>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Orders</Typography>
                                            <Typography>{routeData.reduce((sum, item) => sum + item.ToplamSipariş, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Successful Orders</Typography>
                                            <Typography>{routeData.reduce((sum, item) => sum + item.ZamanındaUlaştırılanSipariş, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Failed Orders</Typography>
                                            <Typography>{routeData.reduce((sum, item) => sum + item.ZamanındaUlaştırılamayanSipariş, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Order Mass</Typography>
                                            <Typography>{routeData.reduce((sum, item) => sum + item.ZamanındaUlaştırılamayanSipariş, 0)} kg</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Product Count</Typography>
                                            <Typography>{routeData.reduce((sum, item) => sum + item.TeslimEdilenToplamÜrünSayısı, 0)}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Time Spent on Orders</Typography>
                                            <Typography>{(orderData.reduce((sum, item) => sum + item.SiparişToplamHarcananSüre, 0) / 60).toFixed(2)} Hour </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Time Spent at Charging Stations</Typography>
                                            <Typography>{(chargeData.reduce((sum, item) => sum + item.ŞarjİstasyonundaToplamHarcananSüre, 0) / 60).toFixed(2)} Hour</Typography>
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
                                <Grid item xs>
                                    <Typography variant="h5">Vehicle</Typography>
                                </Grid>
                                <Grid item xs>
                                    <Box display="flex" justifyContent="center">
                                        <Select
                                            value={selectedVehicleId}
                                            onChange={handleVehicleChange}
                                            style={{ width: '50%' }}
                                        >
                                            {vehicles.map((vehicle) => (
                                                <MenuItem key={vehicle.araç_id} value={vehicle.araç_id}>
                                                    {vehicle.araç_id}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item xs>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" onClick={handleAraçExportClick}>Export</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box style={{ height: '20px' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <Card>
                                        <CardContent>
                                            <BarChart
                                                width={1600}
                                                height={300}
                                                data={data}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey={timePeriod === "day" ? "Gün" : timePeriod === "week" ? "Hafta" : "AY"} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="KatedilenToplamYol" name='Total Distance Traveled' fill="#8884d8" activeBar={<Rectangle fill="blue" stroke="blue" />} />
                                                <Bar dataKey="ToplamÇalışmaSaati" name='Total Driving Time' fill="red" activeBar={<Rectangle fill="green" stroke="blue" />} />
                                            </BarChart>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Distance Traveled</Typography>
                                            <Typography>{((data.reduce((sum, item) => sum + item.KatedilenToplamYol, 0)) / 1000).toFixed(2)} km</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Energy Consumption</Typography>
                                            <Typography>{((data.reduce((sum, item) => sum + item.ToplamEnerjiTüketimi, 0)) / 1000).toFixed(2)} kW</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Driving Time</Typography>
                                            <Typography>{parseFloat(data.reduce((sum, item) => sum + parseFloat(item.ToplamÇalışmaSaati), 0)).toFixed(2)} Hour</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Total Charging Time</Typography>
                                            <Typography>{(parseFloat(data.reduce((sum, item) => sum + parseFloat(item.ToplamŞarjSüresi), 0)) / 60).toFixed(2)} Hour</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box height={20} />
            <DriverTab
                startingDate={startingDate}
                endingDate={endingDate}
                timePeriod={timePeriod}
            />
        </>
    );
};

export default ReportTab;