import React, { useContext, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Divider,
    TextField,
    Button,
    Select,
    MenuItem,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../contexts/user_context';
import { TimePicker } from '@mui/x-date-pickers';

const OrderCard = () => {
    const [selectedProduct, setSelectedProduct] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [timeWindowStart, setTimeWindowStart] = useState(null);
    const [timeWindowEnd, setTimeWindowEnd] = useState(null);
    const [productOptions, setProductOptions] = useState([]);

    const { user } = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:5000/product')
            .then((response) => {
                console.log(response.data);
                setProductOptions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    const handleOrder = async () => {
        if (timeWindowStart > timeWindowEnd) {
            alert("Start time cannot be greater than end time!");
            return;
        } else if (timeWindowStart === null || timeWindowEnd === null) {
            alert("Please select a time window!");
            return;
        }
        console.log(timeWindowStart, timeWindowEnd)
        axios.get('http://localhost:5000/product/create', {
            params: {
                user_id: user.id,
                product_id: selectedProduct,
                order_date: new Date().toISOString().split('T')[0],
                quantity: quantity,
                timewindow_start: timeWindowStart,
                timewindow_end: timeWindowEnd
            }
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
            return;
        });

        try {
            const formattedStartDate = new Date(timeWindowStart).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + " " + new Date(timeWindowStart).toLocaleTimeString()
            const formattedEndDate = new Date(timeWindowEnd).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + " " + new Date(timeWindowEnd).toLocaleTimeString()

            const response = await axios.post('http://localhost:4000/send-order-email', {
                // Send order details and user email to the backend
                product: productOptions.find((product) => product.ürün_id === selectedProduct).marka_adı,
                quantity: quantity,
                timeWindowStart: formattedStartDate,
                timeWindowEnd: formattedEndDate,
                userEmail: user.email,
                name: user.firstName,
                surname: user.lastName
            });

            console.log('Email sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <Card sx={{ maxWidth: 480, borderRadius: 4, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardHeader title={<Typography variant="h5">Order</Typography>} />
            <Divider />
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TimePicker
                            ampm={false}
                            label="Starting Time"
                            onChange={(newValue) => {
                                const time = new Date(newValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                setTimeWindowStart(time);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TimePicker
                            ampm={false}
                            label="Ending Time"
                            onChange={(newValue) => {
                                const time = new Date(newValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                setTimeWindowEnd(time);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Select
                            fullWidth
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            {productOptions.map((option) => (
                                <MenuItem key={option.ürün_id} value={option.ürün_id}>
                                    {option.marka_adı}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Count"
                            type="number"
                            value={quantity}
                            onChange={(e) => { e.target.value < 1 ? setQuantity(1) : setQuantity(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button variant="contained" onClick={handleOrder}>
                            Order
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
