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
        axios.get('http://localhost:5000/user/validate', {
            params: {
                username: values.username,
                password: values.password,
            }
        }).then(response => {
            // Handle successful response
            const validate = response.data[0]["KullanıcıKontrol('" + values.username + "' , '" + values.password + "' )"];
            switch (validate) {
                case -1:
                    alert("Invalid username or password!");
                    break;
                case 0:
                    alert("Invalid password!");
                    break;
                case 1:
                    axios.get('http://localhost:5000/user/getuserdata', {
                        params: {
                            username: values.username,
                        }
                    }).then(response => {
                        // Handle successful response
                        const userData = response.data[0][0];
                        switch (userData.tipi) {
                            case "müşteri":
                                setUser({
                                    id: userData.kullanıcı_id,
                                    firstName: userData.isim,
                                    lastName: userData.soyisim,
                                    email: userData.e_mail,
                                    address: userData.teslimat_adresi,
                                    type: userData.tipi
                                });
                                break;
                            case "sürücü":
                                setUser({
                                    id: userData.kullanıcı_id,
                                    firstName: userData.isim,
                                    lastName: userData.soyisim,
                                    type: userData.tipi
                                });
                                break;
                            case "filoyöneticisi":
                                setUser({
                                    id: userData.kullanıcı_id,
                                    firstName: userData.isim,
                                    lastName: userData.soyisim,
                                    type: userData.tipi
                                });
                                break;
                            default:
                                alert("An unknown error occured!");
                                break;
                        }
                    }).catch(error => {
                        // Handle error
                        console.error('Error:', error);
                    });
                    break;
                default:
                    alert("An unknown error occured!");
                    break;
            }

        }).catch(error => {
            // Handle error
            console.error('Error:', error);
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
                        axios.get('http://localhost:5000/user/validate', {
                            params: {
                                username: res.data.id,
                                password: res.data.id,
                            }
                        }).then(response => {
                            // Handle successful response
                            const validate = response.data[0]["KullanıcıKontrol('" + res.data.id + "' , '" + res.data.id + "' )"];
                            switch (validate) {
                                case -1:
                                    axios.get('http://localhost:5000/user/create', {
                                        params: {
                                            firstName: res.data.given_name,
                                            lastName: res.data.family_name,
                                            username: res.data.id,
                                            password: res.data.id,
                                            email: res.data.email,
                                            address: null,
                                        }
                                    }).then(response => {
                                        setUser({
                                            id: res.data.id,
                                            firstName: res.data.given_name,
                                            lastName: res.data.family_name,
                                            email: res.data.email,
                                            address: null,
                                            type: "müşteri"
                                        });
                                    }).catch(error => {
                                        console.error('Error:', error);
                                    });
                                    break;
                                case 1:
                                    axios.get('http://localhost:5000/user/getuserdata', {
                                        params: {
                                            username: res.data.id,
                                        }
                                    }).then(response => {
                                        // Handle successful response
                                        const userData = response.data[0][0];
                                        setUser({
                                            id: userData.kullanıcı_id,
                                            firstName: userData.isim,
                                            lastName: userData.soyisim,
                                            email: userData.e_mail,
                                            address: userData.teslimat_adresi,
                                            type: userData.tipi,
                                        });
                                    }).catch(error => {
                                        // Handle error
                                        console.error('Error:', error);
                                    });
                                    break;
                                default:
                                    alert("An unknown error occured!");
                                    break;
                            }
                        }).catch(error => {
                            // Handle error
                            console.error('Error:', error);
                        });
                    }).catch((error) => {
                        console.error(error);
                    });
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
                            Login In
                        </Typography>
                        <StyledForm onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                value={values.username}
                                onChange={handleChange('username')}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => user == null ? console.log("user is null ") : console.log(user.firstName)}>
                                Login In
                            </Button>
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Typography variant="body2" fontWeight={600} fontSize={14}>
                                        Or Continue With
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
                                        Don't have an account?{' '}
                                        <Link href="/signup" variant="body2">
                                            Sign Up
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
                        Water Delivery Fleet Management
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};

export default SignIn;