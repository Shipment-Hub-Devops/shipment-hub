'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { defaultMarkerIcon } from './leafletIcon';

export interface PickerMarker {
  lat: number;
  lng: number;
  label: string;
}

interface MapPickerProps {
  markers: PickerMarker[];
  onPick: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: number;
}

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map where clicking sets a coordinate. The parent decides what each click means.
export default function MapPicker({
  markers,
  onPick,
  center = [-1.2921, 36.8219],
  zoom = 5,
  height = 320,
}: MapPickerProps) {
  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-xl border border-slate-200"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        {markers.map((m, i) => (
          <Marker
            key={`${m.lat}-${m.lng}-${i}`}
            position={[m.lat, m.lng]}
            icon={defaultMarkerIcon}
          />
        ))}
      </MapContainer>
    </div>
  );
}
