import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Box, Divider, Card, CardContent, CardHeader, Button } from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const Status = {
    0: 'Ready for Delivery',
    1: 'In Delivery',
    2: 'Off Duty',
};

const DriverTab = (props) => {
    const { startingDate, endingDate, timePeriod } = props;
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


    const selectedDriver = drivers.find(driver => driver.sürücü_id === selectedDriverId);

    const handleDriverExport = async () => {
        try {
            const workbook = XLSX.utils.book_new();

            const worksheet = XLSX.utils.json_to_sheet(driverData[0]);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

            XLSX.writeFile(workbook, "driver.xlsx");


        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };


    return (
        <>
            {responseStatus && <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <Typography variant="h5">Driver</Typography>
                            </Grid>
                            <Grid item xs>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="primary" onClick={handleDriverExport}>Export</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box height={20} />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
                                    <CardHeader title={<Typography variant="h5">Driver Information</Typography>} />
                                    <Divider />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6">Please Select a Driver</Typography>
                                                <Select
                                                    value={selectedDriverId}
                                                    onChange={handleDriverChange}
                                                    style={{ width: '100%' }}
                                                >
                                                    {drivers.map((driver) => (
                                                        <MenuItem key={driver.sürücü_id} value={driver.sürücü_id}>
                                                            {driver.isim + " " + driver.soyisim}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                            {selectedDriver && <Grid item xs={12}>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Driver Details</Typography>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body1" fontWeight={700}>First Name:</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2" >{selectedDriver.isim}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body1" fontWeight={700}>Last Name:</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2">{selectedDriver.soyisim}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body1" fontWeight={700}>Age:</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2">{selectedDriver.yaş}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body1" fontWeight={700}>Starting Date:</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant="body2">{selectedDriver.işe_giriş_tarihi.substring(0, 10)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body1" fontWeight={700}>Status:</Typography>
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
                                                <Typography variant="h6">Performance Analysis</Typography>
                                                {
                                                    driverData && <BarChart width={1200} height={300} data={driverData[0]}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey={timePeriod === "day" ? "Gün" : timePeriod === "week" ? "Hafta" : "AY"} />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="ToplamSiparis" fill="#73a986" name='Total Orders' />
                                                        <Bar dataKey="ZamanındaUlaştırılanSipariş" fill="#8884d8" name='Successful Order' />
                                                        <Bar dataKey="ZamanındaUlaştırılamayanSipariş" fill="#d559ca" name='Failed Order' />
                                                        <Bar dataKey="ToplamÇalışmaSaati" fill="#82ca9d" name='Working Hours' />
                                                        <Bar dataKey="OrtalamaHız" fill="#72f276" name='Average Speed' />
                                                    </BarChart>
                                                }
                                            </Box>

                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>}
        </>
    );
};

export default DriverTab;