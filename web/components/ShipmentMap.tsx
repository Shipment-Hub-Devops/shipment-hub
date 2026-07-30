'use client';

import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { defaultMarkerIcon } from './leafletIcon';

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string | null;
}

interface ShipmentMapProps {
  pickup: MapPoint;
  dropoff: MapPoint;
  current?: MapPoint | null;
  trail?: MapPoint[];
  height?: number;
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 9);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function ShipmentMap({
  pickup,
  dropoff,
  current,
  trail = [],
  height = 360,
}: ShipmentMapProps) {
  const allPoints: MapPoint[] = [
    pickup,
    ...trail,
    ...(current ? [current] : []),
    dropoff,
  ].filter((p) => p && typeof p.lat === 'number' && typeof p.lng === 'number');

  const routeLine: [number, number][] = [
    pickup,
    ...trail,
    ...(current ? [current] : []),
  ].map((p) => [p.lat, p.lng]);

  const center: [number, number] = current
    ? [current.lat, current.lng]
    : [(pickup.lat + dropoff.lat) / 2, (pickup.lng + dropoff.lng) / 2];

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-xl border border-slate-200"
    >
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={allPoints} />

        <Marker position={[pickup.lat, pickup.lng]} icon={defaultMarkerIcon}>
          <Popup>Pickup{pickup.label ? `: ${pickup.label}` : ''}</Popup>
        </Marker>
        <Marker position={[dropoff.lat, dropoff.lng]} icon={defaultMarkerIcon}>
          <Popup>Drop-off{dropoff.label ? `: ${dropoff.label}` : ''}</Popup>
        </Marker>

        {routeLine.length > 1 && (
          <Polyline
            positions={routeLine}
            pathOptions={{ color: '#2563eb', weight: 3, dashArray: '6 8' }}
          />
        )}

        {current && (
          <CircleMarker
            center={[current.lat, current.lng]}
            radius={9}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: '#16a34a',
              fillOpacity: 1,
            }}
          >
            <Popup>
              Current location{current.label ? `: ${current.label}` : ''}
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}