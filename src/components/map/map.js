import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './routing_machine';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { UserContext } from '../../contexts/user_context';
import ReactLeafletDriftMarker from "react-leaflet-drift-marker"

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

function Map({ height, vehicles }) {
    const [routes, setRoutes] = useState([null, null, null, null, null]);
    const [carLocations, setCarLocations] = useState([null, null, null, null, null]);
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
        const setNewVehicleLocations = (newCarLocations) => {
            const updatedVehicleLocations = [null, null, null, null, null];
            newCarLocations.forEach((carLocation, index) => {
                const vehicleLocationIndex = parseInt(carLocation['araç_id'][4]);
                if (vehicleLocationIndex !== -1) {
                    updatedVehicleLocations[vehicleLocationIndex] = carLocation;
                }
            });
            setCarLocations(updatedVehicleLocations);
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
                            setNewVehicleLocations(response.data[0]);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    break;
                case "filoyöneticisi":
                    axios
                        .get('http://localhost:5000/vehicle/tracking')
                        .then(response => {
                            setNewVehicleLocations(response.data);
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
                            setNewVehicleLocations(response.data[0]);
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
                if (carLocation !== null && vehicles[index] !== false) {
                    return (
                        <ReactLeafletDriftMarker
                            key={index}
                            position={[carLocation.boylam, carLocation.enlem]}
                            zIndexOffset={1000}
                            icon={
                                L.icon({
                                    iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12],
                                })}
                            duration={500}
                        >
                            <Popup>
                                <div>
                                    <p>Araç ID: {carLocation.araç_id}</p>
                                </div>
                            </Popup>
                        </ReactLeafletDriftMarker>
                    )
                } else {
                    return null;
                }
            })
            }
            {routes.length !== 0 && routes.map((ref, index) => {
                if (ref !== null) {
                    return (<>
                        <RoutingMachine
                            key={index} // Use a unique key for each component
                            color={colorSet[index]} // Assign colors dynamically
                            routeInfo={routes[index]}
                        />
                    </>
                    )
                } else {
                    return null;
                }
            })}
        </MapContainer>
    );
}

export default Map;
