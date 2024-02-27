import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { useContext } from "react";
import { RouteContext } from "../../contexts/route_context";

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

const CreateRoutineMachineLayer = (props) => {

    const { color, routeInfo } = props;
    const { setRoute } = useContext(RouteContext);
    const waypoints = routeInfo.map(r => ({ lat: r.boylam, lng: r.enlem }))
    const onRouteClick = (route) => {
        // Update the selected route when a route is clicked

        setRoute([route, routeInfo]);
    };

    const instance = L.Routing.control({
        waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
        createMarker: function (i, wp, nWps) {
            var iconUrl = createNumberedIcon(i, color);

            var icon = L.icon({
                iconUrl: iconUrl,
                iconSize: [24, 24], // Adjust icon size as needed
                iconAnchor: [12, 12], // Adjust icon anchor as needed
            });

            var marker = L.marker(wp.latLng, {
                icon: icon,
                draggable: false,
            });

            return marker;
        },
        routeLine: function (route, options) {
            var line = L.Routing.line(route, {
                styles: [{ color: color, weight: 4 }],
                extendToWaypoints: false,
                addWaypoints: false,
                smoothFactor: 0,
            });
            line.eachLayer((l) => {
                l.on('click', (e) => {
                    onRouteClick(route);
                });
            });
            return line;
        },
        router: L.Routing.osrmv1({
            routingOptions: {
                profile: 'driving',
                continue_straight: false,
            },
            suppressDemoServerWarning: true,
            language: 'tr',
        }),
        lineOptions: {
            styles: [{ color: color, weight: 4 }],
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
    });

    return instance;
};

const RoutingMachine = createControlComponent(CreateRoutineMachineLayer);

export default RoutingMachine;