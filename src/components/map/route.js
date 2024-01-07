import { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { RouteContext } from "../../contexts/route_context";
import L from "leaflet";

function Route(props) {
    const map = useMap();
    const [routeSelected, setRouteSelected] = useState(false);
    const { color, waypoints } = props;
    const { setRoute } = useContext(RouteContext);

    const createNumberedIcon = (number, color) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set the canvas size
        canvas.width = 24;
        canvas.height = 24;

        // Draw a circle
        context.beginPath();
        context.arc(12, 12, 10, 0, 2 * Math.PI);
        context.fillStyle = color
        context.fill();

        // Draw the number
        context.font = '12px Arial';
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(number.toString(), 12, 12);

        // Convert the canvas to a data URL
        const iconUrl = canvas.toDataURL();

        return iconUrl;
    };

    const onRouteClick = (route) => {
        // Update the selected route when a route is clicked
        setRoute(route);
    };

    useEffect(() => {
        if (!map) return;

        const instance = L.Routing.control({
            waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
            createMarker: function (i, wp, nWps) {
                if (i === 0) {
                    var driverMarker = L.marker(wp.latLng,
                        {
                            icon: L.icon({
                                iconUrl: "https://img.icons8.com/color/48/000000/car--v1.png",
                                iconSize: [24, 24],
                                iconAnchor: [12, 12],
                            }),
                            draggable: true,
                        });

                    driverMarker.bindPopup('Driver');

                    return driverMarker;
                }
                var iconUrl = createNumberedIcon(i, color);

                var icon = L.icon({
                    iconUrl: iconUrl,
                    iconSize: [24, 24], // Adjust icon size as needed
                    iconAnchor: [12, 12], // Adjust icon anchor as needed
                });

                var marker = L.marker(wp.latLng, {
                    icon: icon,
                    draggable: true
                });

                // Add a popup to the marker
                marker.bindPopup('Marker ' + i);

                return marker;
            },
            routeLine: function (route, options) {
                var line = L.Routing.line(route, {
                    styles: [{ color: color, weight: 4 }],
                    extendToWaypoints: false,
                    missingRouteTolerance: 0,
                    addWaypoints: false
                });
                line.eachLayer((l) => {
                    l.on('click', (e) => {
                        onRouteClick(route);
                    });
                });
                return line;
            },
            lineOptions: {
                styles: [{ color: color, weight: 4 }],
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: true,
            fitSelectedRoutes: false,
            showAlternatives: false,
        }).addTo(map);

        instance.on('routeselected', function (e) {
            setRouteSelected(true);
        });

        return () => {
            if (routeSelected) {
                setRouteSelected(false);
                map.removeControl(instance);
            }
        }
    });

    return null;
}

export default Route;