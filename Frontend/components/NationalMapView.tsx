'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet to fix icon issues

// This is a common fix for a known issue with react-leaflet and bundlers like Webpack
// It ensures that the marker icons are loaded correctly.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Define the props for our map component
interface NationalMapViewProps {
    states: {
        name: string;
        score: number;
    }[];
}

const NationalMapView: React.FC<NationalMapViewProps> = ({ states }) => {
    // A simple function to generate pseudo-random coordinates for the mockup
    const getCoords = (index: number): [number, number] => {
        const baseLat = 22.9734;
        const baseLng = 78.6569;
        const lat = baseLat + (Math.sin(index * 0.5) * 5);
        const lng = baseLng + (Math.cos(index * 0.7) * 5);
        return [lat, lng];
    }

    return (
        <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {states.map((s, index) => (
                <Marker key={s.name} position={getCoords(index)}>
                    <Popup>{s.name} (Score: {s.score}%)</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default NationalMapView;