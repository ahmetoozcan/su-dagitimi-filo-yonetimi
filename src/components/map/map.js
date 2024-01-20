import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './routing_machine';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { UserContext } from '../../contexts/user_context';

const colorSet = [
    "rgb(0,183,199)",
    "rgb(228,9,146)",
    "rgb(107,247,29)",
    "rgb(58,70,255)",
    "rgb(251,93,38)",
    "rgb(15,236,132)",
    "rgb(170,2,211)",
    "rgb(178,204,1)",
    "rgb(11,140,231)"
];

function Map({ height }) {
    const [routes, setRoutes] = useState([null, null, null, null, null]);
    const [carLocations, setCarLocations] = useState([]);
    const { user } = useContext(UserContext);



    useEffect(() => {
        const setNewRoutes = (newRoutes) => {
            const updatedRoutes = [null, null, null, null, null];
            newRoutes.forEach((route, index) => {
                const routeIndex = parseInt(route[0]['araç_id'][4]);
                if (routeIndex !== -1) {
                    updatedRoutes[routeIndex] = route;
                }
            });
            setRoutes(updatedRoutes);
        }

        setInterval(() => {
            switch (user.type) {
                case "sürücü":
                    axios
                        .get('http://localhost:5000/vehicle/tracking/driver', {
                            params: {
                                driver_id: user.id
                            }
                        })
                        .then(response => {
                            if (response.data[0].length === 0) {
                                setCarLocations([]);
                                return;
                            }
                            setCarLocations(response.data[0]);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                case "filoyöneticisi":
                    axios
                        .get('http://localhost:5000/vehicle/tracking')
                        .then(response => {
                            setCarLocations(response.data);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                case "müşteri":
                    axios
                        .get('http://localhost:5000/vehicle/tracking/customer', {
                            params: {
                                customer_id: user.id
                            }
                        })
                        .then(response => {
                            setCarLocations(response.data[0]);
                        }
                        ).catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                default:
                    break;
            }
        }, 500);

        setInterval(() => {
            switch (user.type) {
                case "sürücü":
                    axios
                        .get('http://localhost:5000/route/driver', {
                            params: {
                                driver_id: user.id
                            }
                        })
                        .then(response => {
                            const routes = response.data[0];
                            const uniqueRoutes = Array.from(new Set(routes.map(route => route.rota_id)));

                            // Sort routes based on the 'sıra' variable
                            routes.sort((a, b) => a.sıra - b.sıra);

                            const newRoutes = uniqueRoutes.map(route => routes
                                .filter(r => r.rota_id === route)
                            );
                            setRoutes(newRoutes);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                case "filoyöneticisi":
                    axios
                        .get('http://localhost:5000/route')
                        .then(response => {
                            const routes = response.data;
                            const uniqueRoutes = Array.from(new Set(routes.map(route => route.rota_id)));

                            // Sort routes based on the 'sıra' variable
                            routes.sort((a, b) => a.sıra - b.sıra);

                            const newRoutes = uniqueRoutes.map(route => routes
                                .filter(r => r.rota_id === route)
                            );
                            console.log(newRoutes)
                            setNewRoutes(newRoutes);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                default:
                    break;
            }
        }, 2000);

    }, [user.id, user.type]);

    return (
        <MapContainer center={[39.75074524577661, 30.482254032492538]} zoom={16} style={{ height: height }} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {carLocations.length !== 0 && carLocations.map((carLocation, index) => {
                return (
                    <Marker
                        key={index}
                        position={[carLocation.boylam, carLocation.enlem]}
                        zIndexOffset={1000}
                        icon={
                            L.icon({
                                iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
                                iconSize: [24, 24],
                                iconAnchor: [12, 12],
                            })}

                    >
                        <Popup>
                            <div>
                                <p>Araç ID: {carLocation.araç_id}</p>
                                <p>Sürücü ID: {carLocation.sürücü_id}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            })
            }
            {routes.length !== 0 && routes.map((ref, index) => {
                if (ref !== null) {
                    return (
                        <RoutingMachine
                            key={index} // Use a unique key for each component
                            color={colorSet[index]} // Assign colors dynamically
                            routeInfo={routes[index]}
                        />
                    )
                } else {
                    return null;
                }
            })}
        </MapContainer>
    );
}

export default Map;
