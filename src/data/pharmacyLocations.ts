import { PickupPharmacyLocation, Coordinates } from '../types';

export const DEFAULT_USER_COORDINATES: Coordinates = {
  lat: 40.7505,
  lng: -73.9934, // 34th St & 8th Ave, Midtown West, Manhattan NY 10001
};

export const PHARMACY_PICKUP_LOCATIONS: PickupPharmacyLocation[] = [
  {
    id: 'pickup-apex',
    name: 'Apex Central Pharmacy',
    address: '362 W 34th St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    coordinates: {
      lat: 40.7529,
      lng: -73.9942,
    },
    estimatedReadyMins: 15,
    openHours: 'Open 24 Hours',
    isOpenNow: true,
    phone: '(212) 555-0142',
    licenseNumber: 'LIC-NY-984210',
    rating: 4.9,
    reviewCount: 382,
    hasDriveThru: false,
    has24HourService: true,
    hasExpressCounter: true,
    inStockGenericCount: 248,
    badge: 'PREFERRED HUB • FASTEST PICKUP',
  },
  {
    id: 'pickup-metro',
    name: 'Metro Health Pharmacy & Wellness',
    address: '14 W 32nd St (Near 5th Ave)',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    coordinates: {
      lat: 40.7479,
      lng: -73.9870,
    },
    estimatedReadyMins: 20,
    openHours: '8:00 AM - 10:00 PM',
    isOpenNow: true,
    phone: '(212) 555-0198',
    licenseNumber: 'LIC-NY-847291',
    rating: 4.8,
    reviewCount: 219,
    hasDriveThru: true,
    has24HourService: false,
    hasExpressCounter: true,
    inStockGenericCount: 195,
    badge: 'DRIVE-THRU WINDOW',
  },
  {
    id: 'pickup-hudson',
    name: 'Hudson Yards Community Care Rx',
    address: '450 10th Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    coordinates: {
      lat: 40.7548,
      lng: -74.0008,
    },
    estimatedReadyMins: 15,
    openHours: '8:30 AM - 9:00 PM',
    isOpenNow: true,
    phone: '(212) 555-0273',
    licenseNumber: 'LIC-NY-761924',
    rating: 4.7,
    reviewCount: 164,
    hasDriveThru: false,
    has24HourService: false,
    hasExpressCounter: true,
    inStockGenericCount: 210,
    badge: 'CURBSIDE PICKUP',
  },
  {
    id: 'pickup-chelsea',
    name: 'Chelsea Square Licensed Apothecary',
    address: '198 8th Ave (at W 20th St)',
    city: 'New York',
    state: 'NY',
    zipCode: '10011',
    coordinates: {
      lat: 40.7441,
      lng: -73.9995,
    },
    estimatedReadyMins: 25,
    openHours: 'Open 24 Hours',
    isOpenNow: true,
    phone: '(212) 555-0315',
    licenseNumber: 'LIC-NY-619283',
    rating: 4.9,
    reviewCount: 290,
    hasDriveThru: false,
    has24HourService: true,
    hasExpressCounter: true,
    inStockGenericCount: 232,
    badge: 'OPEN 24/7',
  },
  {
    id: 'pickup-timessquare',
    name: 'Times Square Express Generic Hub',
    address: '1500 Broadway (at 43rd St)',
    city: 'New York',
    state: 'NY',
    zipCode: '10036',
    coordinates: {
      lat: 40.7571,
      lng: -73.9859,
    },
    estimatedReadyMins: 15,
    openHours: '7:00 AM - 11:00 PM',
    isOpenNow: true,
    phone: '(212) 555-0450',
    licenseNumber: 'LIC-NY-418290',
    rating: 4.6,
    reviewCount: 412,
    hasDriveThru: false,
    has24HourService: false,
    hasExpressCounter: true,
    inStockGenericCount: 275,
    badge: 'SMART LOCKER PICKUP',
  },
  {
    id: 'pickup-gramercy',
    name: 'Gramercy Compound & Clinical Care',
    address: '310 2nd Ave (at 18th St)',
    city: 'New York',
    state: 'NY',
    zipCode: '10003',
    coordinates: {
      lat: 40.7348,
      lng: -73.9818,
    },
    estimatedReadyMins: 30,
    openHours: '9:00 AM - 8:00 PM',
    isOpenNow: true,
    phone: '(212) 555-0589',
    licenseNumber: 'LIC-NY-529103',
    rating: 4.8,
    reviewCount: 145,
    hasDriveThru: false,
    has24HourService: false,
    hasExpressCounter: false,
    inStockGenericCount: 180,
  },
];

/**
 * Calculates accurate great-circle distance between two GPS coordinates using Haversine formula (in miles)
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 1 decimal place (or 2 if < 0.2 miles)
  return distance < 0.2 ? Math.round(distance * 100) / 100 : Math.round(distance * 10) / 10;
}

/**
 * Returns pharmacies enriched with real distance relative to current user coordinates, sorted closest first
 */
export function getSortedPharmaciesByDistance(
  origin: Coordinates,
  pharmacies: PickupPharmacyLocation[] = PHARMACY_PICKUP_LOCATIONS
): PickupPharmacyLocation[] {
  return pharmacies
    .map((pharmacy) => ({
      ...pharmacy,
      distanceMiles: calculateHaversineDistance(origin, pharmacy.coordinates),
    }))
    .sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0));
}

/**
 * Formats coordinates for clean display (e.g. 40.7505° N, 73.9934° W)
 */
export function formatCoordinates(coord: Coordinates): string {
  const latDir = coord.lat >= 0 ? 'N' : 'S';
  const lngDir = coord.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(coord.lat).toFixed(4)}° ${latDir}, ${Math.abs(coord.lng).toFixed(4)}° ${lngDir}`;
}
