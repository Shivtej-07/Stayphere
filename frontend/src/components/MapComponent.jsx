import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported if not global, but we added it globally too.
import { MapPin } from 'lucide-react';

// Fix for default marker icon issues with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when coordinates change
function RecenterMap({ lat, lng, polyline }) {
    const map = useMap();
    useEffect(() => {
        if (!polyline || polyline.length === 0) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, polyline, map]);
    return null;
}

// Component to fit map bounds to polyline when active
function FitBounds({ polyline }) {
    const map = useMap();
    useEffect(() => {
        if (polyline && polyline.length > 0) {
            map.fitBounds(polyline, { padding: [50, 50], maxZoom: 15 });
        }
    }, [polyline, map]);
    return null;
}

const MapComponent = ({ center, zoom = 13, markers = [], polyline = null, height = "400px" }) => {
    // center prop should be [lat, lng]
    if (!center) return null;

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg z-0 relative" style={{ height }}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap lat={center[0]} lng={center[1]} polyline={polyline} />
                <FitBounds polyline={polyline} />

                {polyline && (
                    <Polyline positions={polyline} color="#3b82f6" weight={5} dashArray="2, 8" lineCap="round" />
                )}

                {markers.map((marker, index) => (
                    <Marker 
                        key={index} 
                        position={marker.position}
                        icon={marker.customIcon || DefaultIcon}
                    >
                        <Popup>
                            <div className="text-gray-900 font-sans">
                                <strong className="block text-sm mb-1">{marker.title}</strong>
                                <span className="text-xs">{marker.description}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
