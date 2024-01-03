import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './routing_machine';

let hue = Math.random();
const usedColors = new Set();

function getRandomColor() {
    let color;
    do {
        hue += 0.618033988749895; // Add the golden ratio
        hue %= 1; // Keep hue within [0, 1]

        const r = Math.round(Math.sin(hue * 2 * Math.PI) * 127.5 + 127.5);
        const g = Math.round(Math.sin((hue + 1 / 3) * 2 * Math.PI) * 127.5 + 127.5);
        const b = Math.round(Math.sin((hue + 2 / 3) * 2 * Math.PI) * 127.5 + 127.5);
        color = `rgb(${r},${g},${b})`;
    } while (usedColors.has(color));

    usedColors.add(color);
    return color;
}

function Map() {

    return (
        <div className="Map">
            <MapContainer center={[39.75074524577661, 30.482254032492538]} zoom={16} style={{ height: "75vh" }} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <RoutingMachine
                    color={getRandomColor()}
                    waypoints={[
                        { lat: 39.752948, lng: 30.493067 },
                        { lat: 39.752964, lng: 30.484890 },
                        { lat: 39.751001, lng: 30.481541 },
                        { lat: 39.748394, lng: 30.474888 },
                    ]}
                />
                <RoutingMachine
                    color={getRandomColor()}
                    waypoints={[
                        { lat: 39.752948 + Math.random() * 0.001, lng: 30.493067 + Math.random() * 0.001 },
                        { lat: 39.752964 + Math.random() * 0.001, lng: 30.484890 + Math.random() * 0.001 },
                        { lat: 39.751001 + Math.random() * 0.001, lng: 30.481541 + Math.random() * 0.001 },
                        { lat: 39.748394 + Math.random() * 0.001, lng: 30.474888 + Math.random() * 0.001 },
                    ]}
                />
                <RoutingMachine
                    color={getRandomColor()}
                    waypoints={[
                        { lat: 39.752948 + Math.random() * 0.001, lng: 30.493067 + Math.random() * 0.001 },
                        { lat: 39.752964 + Math.random() * 0.001, lng: 30.484890 + Math.random() * 0.001 },
                        { lat: 39.751001 + Math.random() * 0.001, lng: 30.481541 + Math.random() * 0.001 },
                        { lat: 39.748394 + Math.random() * 0.001, lng: 30.474888 + Math.random() * 0.001 },
                    ]}
                />
            </MapContainer>
        </div>
    );
}

export default Map;
