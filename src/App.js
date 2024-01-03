import { Outlet } from 'react-router-dom';
import { RouteProvider } from './contexts/route_context';
import { UserProvider } from './contexts/user_context';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const App = () => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UserProvider>
                <RouteProvider>
                    <Outlet />
                </RouteProvider>
            </UserProvider>
        </LocalizationProvider>
    );
};

export default App;