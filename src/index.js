import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import SidebarTabs from './components/sidebar';
import Login from './screens/login_screen';
import SignUp from './screens/signup_screen';
import ErrorScreen from './screens/error_screen';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
const GoogleClientKey = require("./google_client_key.json");

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorScreen />,
        children: [
            {
                path: "/",
                element: <SidebarTabs />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
        ]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={GoogleClientKey.GoogleClientKey}>
        <RouterProvider router={router} />
    </GoogleOAuthProvider>
);