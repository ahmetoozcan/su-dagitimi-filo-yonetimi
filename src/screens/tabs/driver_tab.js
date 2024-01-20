import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Box, Divider, Card, CardContent, CardHeader, FormControl, Button } from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const Status = {
    0: 'Dağıtıma Hazır',
    1: 'Dağıtımda',
    2: 'İzinli',
};

const DriverTab = () => {
    const [drivers, setDrivers] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [[startingDate, endingDate], setDates] = useState([new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()]);
    const [timePeriod, setTimePeriod] = useState('day');
    const [responseStatus, setResponseStatus] = useState(false);

    const handleDriverChange = (event) => {
        setSelectedDriverId(event.target.value);
    };

    useEffect(() => {
        axios
            .get('http://localhost:5000/driver')
            .then((response) => {
                setDrivers(response.data);
                if (response.data.length > 0) {
                    setSelectedDriverId(response.data[0].sürücü_id);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (selectedDriverId && startingDate && endingDate) {
            const url = `http://localhost:5000/driver/report/${timePeriod}`;
            const params = {
                driver_id: selectedDriverId,
                starting_date: startingDate.toISOString().split('T')[0],
                ending_date: endingDate.toISOString().split('T')[0]
            };

            axios.get(url, { params })
                .then((response) => {
                    response.data[0].forEach((data) => {
                        data.Gün = dayjs(data.Gün).format('DD.MM.YYYY');
                        data.AY = dayjs(data.Ay).format('MM.YYYY');
                        data.Hafta = dayjs(data.Hafta).format('DD.MM.YYYY');
                    });
                    setDriverData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        setResponseStatus(true);
    }, [selectedDriverId, startingDate, endingDate, timePeriod]);



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

    const selectedDriver = drivers.find(driver => driver.sürücü_id === selectedDriverId);

    const handleDriverExport = async () => {
        try {
            const workbook = XLSX.utils.book_new();

            const worksheet = XLSX.utils.json_to_sheet(driverData[0]);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sürücü Verisi");

            XLSX.writeFile(workbook, "sürücü.xlsx");


        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };


    return (
        <>
            {responseStatus && <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
                        <CardHeader title={<Typography variant="h5">Sürücü Bilgisi</Typography>} />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Bir Sürücü Seçiniz</Typography>
                                    <Select
                                        value={selectedDriverId}
                                        onChange={handleDriverChange}
                                        style={{ width: '100%' }}
                                    >
                                        {drivers.map((driver) => (
                                            <MenuItem key={driver.sürücü_id} value={driver.sürücü_id}>
                                                {driver.isim}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                {selectedDriver && <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Sürücü Detayları</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>Ad:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2" >{selectedDriver.isim}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>Soyad:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">{selectedDriver.soyisim}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>Yaş:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">{selectedDriver.yaş}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>T.C. Kimlik Numarası:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">{selectedDriver.TC}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>İşe Başlama Tarihi:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">{selectedDriver.işe_giriş_tarihi.substring(0, 10)}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight={700}>Durum:</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2">{Status[selectedDriver.durum]}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Paper>
                                <Box p={2}>
                                    <Typography variant="h6">Peformans Analizi</Typography>
                                    {
                                        driverData && <BarChart width={1200} height={300} data={driverData[0]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={timePeriod === "day" ? "Gün" : timePeriod === "week" ? "Hafta" : "AY"} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="ToplamSiparis" fill="#73a986" name='Toplam Sipariş' />
                                            <Bar dataKey="ZamanındaUlaştırılanSipariş" fill="#8884d8" name='Başarılı Sipariş' />
                                            <Bar dataKey="ZamanındaUlaştırılamayanSipariş" fill="#d559ca" name='Başarısız Sipariş' />
                                            <Bar dataKey="ToplamÇalışmaSaati" fill="#82ca9d" name='Çalışma Saati' />
                                            <Bar dataKey="OrtalamaHız" fill="#72f276" name='Averaj Hız' />
                                        </BarChart>
                                    }
                                </Box>
                                <Grid container justifyContent="center">
                                    <DatePicker
                                        label="Rapor Başlangıç Zamanı"
                                        defaultValue={dayjs(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
                                        disableFuture={true}
                                        onChange={(newDate) => handleStartingDateChange(newDate)}
                                        format="DD.MM.YYYY"
                                    />
                                    <Box style={{ width: '20px' }} />
                                    <DatePicker
                                        label="Rapor Bitiş Zamanı"
                                        defaultValue={dayjs(new Date())}
                                        disableFuture={true}
                                        onChange={(newDate) => handleEndingDateChange(newDate)}
                                        format="DD.MM.YYYY"
                                    />
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
                                        <Button variant="contained" color="primary" onClick={handleDriverExport}>Dışarıya Aktar</Button>
                                    </Box>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>}
        </>
    );
};

export default DriverTab;