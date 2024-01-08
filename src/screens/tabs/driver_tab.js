import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Box, Divider, Card, CardContent, CardHeader } from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const DriverTab = () => {
    const [drivers, setDrivers] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [responseStatus, setResponseStatus] = useState(false);

    const handleDriverChange = (event) => {
        setSelectedDriverId(event.target.value);
    };

    useEffect(() => {
        axios
            .get('http://localhost:5000/driver')
            .then((response) => {
                setDrivers(response.data);
                setSelectedDriverId(response.data[0].sürücü_id);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get('http://localhost:5000/driver/report')
            .then((response) => {
                setDriverData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        setResponseStatus(true);
    }, []);

    const selectedDriver = drivers.find(driver => driver.sürücü_id === selectedDriverId);

    return (
        <>
            {responseStatus && <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
                        <CardHeader title={<Typography variant="h5">Sürücü Bilgiisi</Typography>} />
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
                                            <Typography variant="body2">{selectedDriver.durum}</Typography>
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
                                    {driverData && <BarChart width={500} height={300} data={driverData.filter(driver => driver.sürücü_id === selectedDriverId)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="toplam_ulaştırılan_sipariş" fill="#73a986" name='Toplam Sipariş' />
                                        <Bar dataKey="zamanında_ulaştırılan_sipariş" fill="#8884d8" name='Başarılı Sipariş' />
                                        <Bar dataKey="zamanında_ulaştırılamayan_sipariş" fill="#d559ca" name='Başarısız Sipariş' />
                                        <Bar dataKey="toplam_çalışma_saati" fill="#82ca9d" name='Çalışma Saati' />
                                        <Bar dataKey="toplam_tüketilen_enerji" fill="#ffc658" name='Tüketilen Enerji' />
                                        <Bar dataKey="ortalama_hız" fill="#72f276" name='Averaj Hız' />
                                    </BarChart>}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>}
        </>
    );
};

export default DriverTab;