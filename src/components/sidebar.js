import React, { useState, useContext } from 'react';
import {
    Drawer,
    Tab,
    Tabs,
    Typography,
    styled,
    Toolbar,
    IconButton,
    Box
} from '@mui/material';
import { UserContext } from '../contexts/user_context';

// Tabs
import MainTab from '../screens/tabs/main_tab';
import DriverTab from '../screens/tabs/driver_tab';
import ReportTab from '../screens/tabs/report_tab';
import CarTab from '../screens/tabs/car_tab';
import OrderTab from '../screens/tabs/order_tab';

// Tab Icons
import CarIcon from '../assets/car.png';
import DriverIcon from '../assets/driver.png';
import ReportIcon from '../assets/report.png';
import OrderIcon from '../assets/order.png';
import CompassIcon from '../assets/compass.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate } from 'react-router-dom';

const drawerWidth = 100;

const Root = styled('div')({
    display: 'flex',
});

const DrawerRoot = styled('div')({
    width: drawerWidth,
    flexShrink: 0,
});

const DrawerPaper = styled('div')(({ theme }) => ({
    width: drawerWidth,
    display: 'flex', // Added property
    justifyContent: 'center', // Added property
}));

const MainContent = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
}));

const SidebarTabs = () => {
    const [tabValue, setTabValue] = useState(0);
    const { user, setUser } = useContext(UserContext);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleExit = () => {
        setTimeout(() => {
            setUser(null);
        }, 1000);
    };

    return (
        <>
            {
                user ? <Root>
                    <DrawerRoot>
                        <Drawer
                            variant="permanent"
                            anchor="left"
                            classes={{
                                root: DrawerRoot,
                                paper: DrawerPaper,
                            }}
                        >
                            <Tabs
                                orientation="vertical"
                                value={tabValue}
                                onChange={handleTabChange}
                                indicatorColor='primary'
                                className='sidebar-tabs'
                            >
                                <Tab icon={<img src={CompassIcon} height={32} alt='Compass' />} label=<Typography fontSize={12} fontWeight={700}>ANA EKRAN</Typography> />

                                {user.type === 'fleetManager' && (
                                    [
                                        <Tab key={1} icon={<img src={DriverIcon} height={32} alt='Driver' />} label={<Typography fontSize={12} fontWeight={700}>SÜRÜCÜ</Typography>} value={1} />,
                                        <Tab key={2} icon={<img src={CarIcon} height={32} alt='Car' />} label={<Typography fontSize={12} fontWeight={700}>ARAÇ</Typography>} value={2} />,
                                        <Tab key={3} icon={<img src={ReportIcon} height={32} alt='Report' />} label={<Typography fontSize={12} fontWeight={700}>RAPOR</Typography>} value={3} />,
                                        <Tab key={4} icon={<img src={OrderIcon} height={32} alt='Order' />} label={<Typography fontSize={12} fontWeight={700}>SİPARİŞ</Typography>} value={4} />
                                    ]
                                )}
                            </Tabs>
                            <Toolbar height={20} style={{ marginTop: 'auto' }}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <IconButton onClick={handleExit} size="medium">
                                        <LogoutIcon fontSize='large' color='action' />
                                    </IconButton>
                                    <Typography variant="caption" display="block" align="center" fontSize={12} fontWeight={700} color={'#676767'}>
                                        ÇIKIŞ
                                    </Typography>
                                </Box>
                            </Toolbar>
                        </Drawer>
                    </DrawerRoot>
                    <MainContent>
                        <div style={{ display: tabValue === 0 ? 'block' : 'none' }}>
                            <MainTab />
                        </div>
                        {tabValue === 1 && <DriverTab />}
                        {tabValue === 2 && <CarTab />}
                        {tabValue === 3 && <ReportTab />}
                        {tabValue === 4 && <OrderTab />}
                    </MainContent>
                </Root>
                    :
                    <Navigate to='/login' />
            }
        </>
    );
};

export default SidebarTabs;