import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './routing_machine';
import { createRef, useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';

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

function Map() {
    const [routingMachineRefs, setRoutingMachineRefs] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [carLocations, setCarLocations] = useState([]);



    useEffect(() => {
        setInterval(() => {
            axios
                .get('http://localhost:5000/vehicle/tracking')
                .then(response => {
                    setCarLocations(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }, 1000);

        axios
            .get('http://localhost:5000/route')
            .then(response => {
                const routes = response.data;
                const uniqueRoutes = Array.from(new Set(routes.map(route => route.rota_id)));
                setRoutingMachineRefs(uniqueRoutes.map(route => createRef()));

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
    }, []); // Empty dependency array

    useEffect(() => {
        const setCarLocation = (carLocation, index) => {
            // Update the car location when the carLocations state changes
        }

        // Update the car location when the carLocations state changes
        carLocations.forEach((carLocation, index) => {
            if (routingMachineRefs[index].current) {
                setCarLocation(carLocation, index);
            }
        });
    }, [carLocations, routingMachineRefs, routes]);

    return (
        <MapContainer center={[39.75074524577661, 30.482254032492538]} zoom={16} style={{ height: "75vh" }} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {
                carLocations.map((carLocation, index) => {
                    return (
                        <Marker
                            key={index}
                            position={[carLocation.boylam, carLocation.enlem]}
                            icon={
                                L.icon({
                                    iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12],
                                })}
                        />
                    )
                })
            }
            {routingMachineRefs.map((ref, index) => {
                return (
                    <RoutingMachine
                        key={index} // Use a unique key for each component
                        ref={ref}
                        color={colorSet[index]} // Assign colors dynamically
                        route={routes[index]}
                        carLocation={carLocations[index]}
                    />
                )
            })}
        </MapContainer>
    );
}

export default Map;
