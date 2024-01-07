import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './routing_machine';
import { useEffect, useRef, useState } from 'react';
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
    const routingMachineRef = useRef(null);
    const [waypoints, setWaypoints] = useState([
        { lat: 39.752948, lng: 30.493067 },
        { lat: 39.752964, lng: 30.484890 },
        { lat: 39.751001, lng: 30.481541 },
        { lat: 39.748394, lng: 30.474888 },
    ]);

    const updateRoute = (newWaypoints) => {
        setWaypoints(newWaypoints);

        if (routingMachineRef.current) {
            routingMachineRef.current.setWaypoints(newWaypoints.map(wp => L.latLng(wp.lat, wp.lng)));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newWaypoints = waypoints.map((waypoint, index) => {
                if (index === 0) {
                    return {
                        lat: waypoint.lat + (Math.random() - 0.5) * 0.001,
                        lng: waypoint.lng + (Math.random() - 0.5) * 0.001,
                    };
                }
                return waypoint;
            });
            updateRoute(newWaypoints);
        }, 3000);

        return () => clearInterval(interval);
    }, [waypoints]);

    return (
        <MapContainer center={[39.75074524577661, 30.482254032492538]} zoom={16} style={{ height: "75vh" }} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <RoutingMachine
                ref={routingMachineRef}
                color={colorSet[0]}
                waypoints={waypoints}
            />
            <RoutingMachine
                color={colorSet[1]}
                waypoints={[
                    { lat: 39.752948 + Math.random() * 0.001, lng: 30.493067 + Math.random() * 0.001 },
                    { lat: 39.752964 + Math.random() * 0.001, lng: 30.484890 + Math.random() * 0.001 },
                    { lat: 39.751001 + Math.random() * 0.001, lng: 30.481541 + Math.random() * 0.001 },
                    { lat: 39.748394 + Math.random() * 0.001, lng: 30.474888 + Math.random() * 0.001 },
                ]}
            />
            <RoutingMachine
                color={colorSet[2]}
                waypoints={[
                    { lat: 39.752948 + Math.random() * 0.001, lng: 30.493067 + Math.random() * 0.001 },
                    { lat: 39.752964 + Math.random() * 0.001, lng: 30.484890 + Math.random() * 0.001 },
                    { lat: 39.751001 + Math.random() * 0.001, lng: 30.481541 + Math.random() * 0.001 },
                    { lat: 39.748394 + Math.random() * 0.001, lng: 30.474888 + Math.random() * 0.001 },
                ]}
            />
        </MapContainer>
    );
}

export default Map;
