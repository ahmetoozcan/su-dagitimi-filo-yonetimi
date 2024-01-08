import React, { useEffect, useState } from 'react';
import { Button, TextField, Link, Typography, Container, CssBaseline, Grid, Select, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

const StyledForm = styled('form')({
    width: '100%',
    marginTop: '1rem',
});

const usePlaceholderStyles = styled(theme => ({
    placeholder: {
        color: "#aaa"
    }
}));

const Placeholder = ({ children }) => {
    const classes = usePlaceholderStyles();
    return <div className={classes.placeholder}>{children}</div>;
};

const SignUp = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        point: '',
        number: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [points, setPoints] = useState([]);


    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const validate = (event) => {
        event.preventDefault();
        const newErrors = {};

        if (values.firstName.length < 2) {
            newErrors.firstName = 'İsim en az 2 arakter olmalıdır';
        }

        if (values.lastName.length < 2) {
            newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
        }

        if (values.username.length < 3) {
            newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
        }

        if (values.password.length < 8) {
            newErrors.password = 'Şifre en az 8 karakter olmalıdır';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email)) {
            newErrors.email = values.email;
        }
        const numberPattern = /^5\d{9}$/;
        if (!numberPattern.test(values.number)) {
            newErrors.email = 'Lütfen geçerli bir telefon numarası giriniz giriniz';
        }

        if (values.point === '') {
            alert("Lütfen adres seçiniz");
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            axios.get('http://localhost:5000/user/create', {
                params: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    address: values.point,
                    number: values.number
                }
            }).then(response => {
                console.log(response.data);
                // create_user('asdsad', 'asdasdas', 'ahmet', 'komoro01', 'ahmet.komoro12@gmail.com', '120', NULL)
                const responseData = response.data[0];
                switch (responseData["create_user('" + values.firstName + "', '" + values.lastName + "', '" + values.username + "', '" + values.password + "', '" + values.email + "', '" + values.point + "', '" + values.number + "')"]) {
                    case 0:
                        alert("Kullanıcı adı veya E-posta zaten kullanımda");
                        break;
                    case 1:
                        navigate('/login');
                        break;
                    default:
                        alert("Bilinmeyen bir hata oluştu");
                        break;
                }

            }).catch(error => {
                console.error('Error:', error);
            });
        }
    };

    useEffect(() => {
        axios
            .get('http://localhost:5000/point')
            .then((response) => {
                setPoints(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid item xs={6} sm={8} md={6} elevation={6} square>
                <StyledContainer component="main" maxWidth="xs">
                    <CssBaseline />
                    <Typography component="h1" variant="h4" align="center" fontWeight={600} fontSize={56}>
                        Kayıt Ol
                    </Typography>
                    <StyledForm onSubmit={(event) => validate(event)} >
                        <TextField
                            helperText={errors.firstName}
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="Ad"
                            value={values.firstName}
                            onChange={handleChange('firstName')}
                            onInvalid={(e) => e.target.setCustomValidity("İsim boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <TextField
                            helperText={errors.lastName}
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Soyad"
                            value={values.lastName}
                            onChange={handleChange('lastName')}
                            onInvalid={(e) => e.target.setCustomValidity("Soyisim boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <TextField
                            helperText={errors.email}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-Posta"
                            value={values.email}
                            onChange={handleChange('email')}
                            onInvalid={(e) => e.target.setCustomValidity("E-posta boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <TextField
                            helperText={errors.email}
                            margin="normal"
                            required
                            fullWidth
                            id="number"
                            label="Telefon Numarası"
                            value={values.number}
                            onChange={handleChange('number')}
                            onInvalid={(e) => e.target.setCustomValidity("Telefon Numarası boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <TextField
                            helperText={errors.username}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Kullanıcı Adı"
                            value={values.username}
                            onChange={handleChange('username')}
                            onInvalid={(e) => e.target.setCustomValidity("Kullanıcı adı boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <TextField
                            helperText={errors.password}
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Şifre"
                            type="password"
                            value={values.password}
                            onChange={handleChange('password')}
                            onInvalid={(e) => e.target.setCustomValidity("Şifre boş olamaz.")}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                        <Box height={10} />
                        <Grid container justifyContent="center" sx={{ textAlign: 'center' }} >
                            <Select
                                value={values.point}
                                onChange={handleChange('point')}
                                renderValue={values.point !== "" ? undefined : () => <Placeholder>Adres Seçin</Placeholder>}
                                displayEmpty >
                                {points.map((point) => (
                                    <MenuItem key={point.nokta_id} value={point.nokta_id}>
                                        {point.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                            Kayıt Ol
                        </Button>
                        <Grid container justifyContent="center" sx={{ mt: 4 }}>
                            <Grid item>
                                <Typography variant="body2" fontWeight={600} fontSize={14}>
                                    Hesabın var mı?{' '}
                                    <Link href="/login" variant="body2">
                                        Giriş Yap
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </StyledForm>
                </StyledContainer>
            </Grid>
            <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) => t.white,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative', // Add this line
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center', // Add this line
                    }}
                >
                    Su Dağıtımı Filo Yönetimi
                </Typography>
            </Grid>
        </Grid>
    );
};

export default SignUp;
