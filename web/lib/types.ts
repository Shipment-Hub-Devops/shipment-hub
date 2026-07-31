export type Role = 'client' | 'operator';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type ShipmentStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface ShipmentEvent {
  id?: number;
  type: string;
  status?: string | null;
  description?: string | null;
  locationLabel?: string | null;
  lat?: number | null;
  lng?: number | null;
  createdAt: string;
}

export interface ShipmentClient {
  id: number;
  name: string;
  email: string;
}

export interface Shipment {
  id: number;
  referenceCode: string;
  trackingToken: string;
  status: ShipmentStatus;
  clientId?: number;
  client?: ShipmentClient;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupContact?: string | null;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffContact?: string | null;
  cargoDescription: string;
  weightKg?: number | null;
  quantity?: number | null;
  notes?: string | null;
  currentLat?: number | null;
  currentLng?: number | null;
  currentLocationLabel?: string | null;
  createdAt: string;
  updatedAt: string;
  events?: ShipmentEvent[];
}

export interface PublicShipment {
  referenceCode: string;
  status: ShipmentStatus;
  cargoDescription: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  currentLat?: number | null;
  currentLng?: number | null;
  currentLocationLabel?: string | null;
  createdAt: string;
  updatedAt: string;
  events: ShipmentEvent[];
}

export interface CreateShipmentInput {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupContact?: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffContact?: string;
  cargoDescription: string;
  weightKg?: number;
  quantity?: number;
  notes?: string;
}