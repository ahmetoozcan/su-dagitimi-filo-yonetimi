import React, { useState, useContext } from 'react';
import {
    Button,
    TextField,
    Link,
    Typography,
    Container,
    CssBaseline,
    Grid,

} from '@mui/material';
import { styled } from '@mui/system';
import GoogleLogo from '../assets/googlelogo.png';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { UserContext } from '../contexts/user_context';


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

const SignIn = () => {
    const [values, setValues] = useState({
        username: '',
        password: '',
        showPassword: false,
    });
    const [googleUser, setGoogleUser] = useState([]);
    const { user, setUser } = useContext(UserContext);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setUser({
            firstName: "test",
            lastName: "test",
            email: "test",
            type: "fleetManager"
        });
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setGoogleUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (googleUser) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${googleUser.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log(googleUser.access_token);
                        console.log(res.data.given_name);
                        console.log(res.data.family_name);
                        console.log(res.data.email);
                        setUser({
                            firstName: res.data.given_name,
                            lastName: res.data.family_name,
                            email: res.data.email,
                            type: "customer"
                        });
                    })
                    .catch((err) => console.log(err))
            }
        },
        [googleUser, setUser]
    );

    return (
        <>
            {user && (
                <Navigate to="/" replace={true} />
            )}
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid item xs={12} sm={8} md={6} elevation={6} square>
                    <StyledContainer component="main" maxWidth="xs">
                        <CssBaseline />
                        <Typography component="h1" variant="h4" align="center" fontWeight={600} fontSize={56}>
                            Giriş Yap
                        </Typography>
                        <StyledForm onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Kullanıcı Adı"
                                value={values.username}
                                onChange={handleChange('username')}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Şifre"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => user == null ? console.log("user is null ") : console.log(user.firstName)}>
                                Giriş Yap
                            </Button>
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Typography variant="body2" fontWeight={600} fontSize={14}>
                                        Ya da şununla devam et
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={() => login()}>
                                        <img src={GoogleLogo} width={32} alt="Google Logo" style={{}} />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                                <Grid item>
                                    <Typography variant="body2" fontWeight={600} fontSize={14}>
                                        Hesabın yok mu?{' '}
                                        <Link href="/signup" variant="body2">
                                            Kaydol
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
        </>
    );
};

export default SignIn;