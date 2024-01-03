import React, { useState } from 'react';
import { Button, TextField, Link, Typography, Container, CssBaseline, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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

const SignUp = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});


    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const validate = async (event) => {
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
            newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await navigate('/login');
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid item xs={6} sm={8} md={6} elevation={6} square>
                <StyledContainer component="main" maxWidth="xs">
                    <CssBaseline />
                    <Typography component="h1" variant="h4" align="center" fontWeight={600} fontSize={56}>
                        Kayıt Ol
                    </Typography>
                    <StyledForm onSubmit={(event) => validate(event)}>
                        <TextField
                            helperText={errors.firstName}
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="Ad"
                            value={values.firstName}
                            onChange={handleChange('firstName')}
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
                        />
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
