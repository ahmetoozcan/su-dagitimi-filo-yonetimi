import React, { useState } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Box, Divider, Card, CardContent, CardHeader } from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const drivers = [
    { id: 1, name: 'Sürücü 1', surname: 'Soyad 1', age: 30, idNumber: '12345678901', startDate: '2020-01-01', status: 'Dağıtıma Hazır' },
    { id: 2, name: 'Sürücü 2', surname: 'Soyad 2', age: 35, idNumber: '10987654321', startDate: '2019-01-01', status: 'Çalışmaya Uygun Değil' },
    // Add more drivers as needed
];

const data = [
    { name: 'Sürücü 1', successfulOrders: 80, workingHours: 8, fuelConsumed: 10, averageSpeed: 60 },
    { name: 'Sürücü 2', successfulOrders: 70, workingHours: 7, fuelConsumed: 9, averageSpeed: 55 },
    // Add more data points as needed
];


const DriverTab = () => {
    const [selectedDriver, setSelectedDriver] = useState(drivers[0]);

    const handleDriverChange = (event) => {
        setSelectedDriver(drivers.find(driver => driver.id === event.target.value));
    };

    const selectedDriverData = data.find(d => d.name === selectedDriver.name);
    return (
        <Grid container spacing={2}>

            <Grid item xs={3}>
                <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
                    <CardHeader title={<Typography variant="h5">Sürücü Bilgiisi</Typography>} />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Bir Sürücü Seçiniz</Typography>
                                <Select
                                    value={selectedDriver.id}
                                    onChange={handleDriverChange}
                                    style={{ width: '100%' }}
                                >
                                    {drivers.map((driver) => (
                                        <MenuItem key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Sürücü Detayları</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>Ad:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2" >{selectedDriver.name}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>Soyad:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">{selectedDriver.surname}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>Yaş:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">{selectedDriver.age}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>T.C. Kimlik Numarası:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">{selectedDriver.idNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>İşe Başlama Tarihi:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">{selectedDriver.startDate}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" fontWeight={700}>Durum:</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">{selectedDriver.status}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
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
                                <BarChart width={500} height={300} data={[selectedDriverData]}>
                                    <Bar dataKey="successfulOrders" fill="#8884d8" name='Başarılı Siparişler' />
                                    <Bar dataKey="workingHours" fill="#82ca9d" name='Çalışma Saati' />
                                    <Bar dataKey="fuelConsumed" fill="#ffc658" name='Tüketilen Enerji' />
                                    <Bar dataKey="averageSpeed" fill="#72f276" name='Averaj Hız' />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                </BarChart>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DriverTab;