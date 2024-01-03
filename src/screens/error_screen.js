import React from 'react';
import { styled } from "@mui/system";
import { Typography, Button } from '@mui/material';

const useStyles = styled((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    message: {
        marginBottom: theme.spacing(4),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

const ErrorScreen = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" className={classes.message}>
                We apologize for the inconvenience. Please try again later.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => window.location.reload()}
            >
                Refresh
            </Button>
        </div>
    );
};

export default ErrorScreen;
