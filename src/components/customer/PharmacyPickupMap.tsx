import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Store, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  Sparkles, 
  Crosshair, 
  SlidersHorizontal,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Bike,
  Package,
  ZoomIn,
  ZoomOut,
  Compass
} from 'lucide-react';
import { Coordinates, PickupPharmacyLocation, FulfillmentMode } from '../../types';
import { 
  PHARMACY_PICKUP_LOCATIONS, 
  DEFAULT_USER_COORDINATES, 
  getSortedPharmaciesByDistance, 
  formatCoordinates,
  calculateHaversineDistance 
} from '../../data/pharmacyLocations';

interface PharmacyPickupMapProps {
  fulfillmentMode: FulfillmentMode;
  onFulfillmentModeChange: (mode: FulfillmentMode) => void;
  selectedPharmacy: PickupPharmacyLocation;
  onSelectPharmacy: (pharmacy: PickupPharmacyLocation) => void;
  onCoordinatesChange?: (coords: Coordinates) => void;
  onShowToast?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
}

export const PharmacyPickupMap: React.FC<PharmacyPickupMapProps> = ({
  fulfillmentMode,
  onFulfillmentModeChange,
  selectedPharmacy,
  onSelectPharmacy,
  onCoordinatesChange,
  onShowToast,
}) => {
  // User coordinate center
  const [userCoords, setUserCoords] = useState<Coordinates>(DEFAULT_USER_COORDINATES);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [activeRadius, setActiveRadius] = useState<number>(3.0); // in miles
  const [filter24h, setFilter24h] = useState<boolean>(false);
  const [filterDriveThru, setFilterDriveThru] = useState<boolean>(false);
  const [filterExpress, setFilterExpress] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [hoveredPharmacyId, setHoveredPharmacyId] = useState<string | null>(null);

  // Recalculate sorted pharmacies based on current coordinates
  const sortedPharmacies = useMemo(() => {
    return getSortedPharmaciesByDistance(userCoords, PHARMACY_PICKUP_LOCATIONS);
  }, [userCoords]);

  // Filtered pharmacies
  const filteredPharmacies = useMemo(() => {
    return sortedPharmacies.filter((pharm) => {
      const dist = pharm.distanceMiles ?? 0;
      if (dist > activeRadius) return false;
      if (filter24h && !pharm.has24HourService) return false;
      if (filterDriveThru && !pharm.hasDriveThru) return false;
      if (filterExpress && !pharm.hasExpressCounter) return false;
      return true;
    });
  }, [sortedPharmacies, activeRadius, filter24h, filterDriveThru, filterExpress]);

  // Request real device GPS coordinates
  const handleAcquireGPS = () => {
    if (!navigator.geolocation) {
      if (onShowToast) {
        onShowToast('warning', 'Geolocation Unavailable', 'Your browser does not support GPS coordinate detection. Using Midtown NY demo coordinates.');
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setIsLocating(false);
        if (onCoordinatesChange) onCoordinatesChange(coords);
        if (onShowToast) {
          onShowToast('success', 'GPS Coordinates Synced', `Located at ${formatCoordinates(coords)}. Distances recalculated!`);
        }
      },
      (error) => {
        setIsLocating(false);
        // Fallback gracefully with descriptive toast
        if (onShowToast) {
          onShowToast(
            'info', 
            'Using Demo Coordinates', 
            'Location access was not granted. Showing Midtown Manhattan (10001) partner network.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Convert geographic lat/lng coordinates to SVG map viewBox (400x300)
  // Center is userCoords at (200, 150)
  const mapCenter = userCoords;
  // Scale factor: 1 degree latitude is ~69 miles. In 400px width for ~2-3 miles, delta is small.
  const latSpan = 0.035 / mapZoom;
  const lngSpan = 0.045 / mapZoom;

  const projectToMap = (coords: Coordinates) => {
    const x = 200 + ((coords.lng - mapCenter.lng) / lngSpan) * 180;
    const y = 150 - ((coords.lat - mapCenter.lat) / latSpan) * 120;
    return { x: Math.max(25, Math.min(375, x)), y: Math.max(25, Math.min(275, y)) };
  };

  const userSvgPos = { x: 200, y: 150 };
  const selectedSvgPos = projectToMap(selectedPharmacy.coordinates);

  return (
    <section className="bg-white border border-[#bcc9c6] rounded-2xl p-4 shadow-sm space-y-4">
      {/* Top Fulfillment Switcher (Doorstep Delivery vs Pharmacy Pickup) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d4947]">Fulfillment Choice</span>
            <span className="px-1.5 py-0.2 bg-[#eff4ff] text-[#00685f] rounded text-[10px] font-bold">
              Select Mode
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#006948] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Licensed Pharmacy Guarantee
          </span>
        </div>

        {/* Big Dual Toggle Pills */}
        <div className="grid grid-cols-2 p-1 bg-[#eff4ff] rounded-xl border border-[#bcc9c6]/60">
          <button
            type="button"
            onClick={() => onFulfillmentModeChange('delivery')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              fulfillmentMode === 'delivery'
                ? 'bg-[#00685f] text-white shadow-md'
                : 'text-[#3d4947] hover:text-[#0b1c30] hover:bg-white/50'
            }`}
          >
            <Bike className="w-4 h-4" />
            <div className="text-left leading-tight">
              <div>Doorstep Delivery</div>
              <div className={`text-[10px] font-normal ${fulfillmentMode === 'delivery' ? 'text-teal-100' : 'text-[#6d7a77]'}`}>
                45 mins • Temp-Controlled
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onFulfillmentModeChange('pickup')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all relative ${
              fulfillmentMode === 'pickup'
                ? 'bg-[#00685f] text-white shadow-md'
                : 'text-[#3d4947] hover:text-[#0b1c30] hover:bg-white/50'
            }`}
          >
            <Store className="w-4 h-4" />
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1">
                <span>Pharmacy Pickup</span>
                <span className="bg-[#ba1a1a] text-white text-[9px] px-1 rounded-full font-bold">FREE</span>
              </div>
              <div className={`text-[10px] font-normal ${fulfillmentMode === 'pickup' ? 'text-teal-100' : 'text-[#6d7a77]'}`}>
                Ready in 15m • $0 Fee
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* When Doorstep Delivery is selected, show concise delivery info banner + switch teaser */}
      {fulfillmentMode === 'delivery' ? (
        <div className="bg-[#f8f9ff] border border-slate-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
                <Package className="w-4 h-4 text-[#00685f]" />
                <span>Standard Doorstep Courier</span>
              </div>
              <p className="text-xs text-[#3d4947]">
                Dispatched in insulated, tamper-evident cold-chain packaging with live GPS courier tracking.
              </p>
            </div>
            <span className="text-xs font-bold text-[#00685f] bg-[#eff4ff] px-2 py-1 rounded-md border border-[#6bd8cb]/40">
              $1.50 Fee
            </span>
          </div>

          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs">
            <span className="text-[#3d4947] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00685f]" />
              Estimated delivery: <strong>45 mins</strong>
            </span>
            <button
              onClick={() => onFulfillmentModeChange('pickup')}
              className="text-[#00685f] font-bold hover:underline flex items-center gap-1"
            >
              <span>Switch to Free 15-min Pickup</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Coordinates-based Pharmacy Pickup Explorer */
        <div className="space-y-3 pt-1">
          {/* Coordinates Header & GPS Action */}
          <div className="bg-[#eff4ff] border border-[#6bd8cb]/40 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#00685f] text-white flex items-center justify-center flex-shrink-0">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#00685f] tracking-wider">
                  Origin GPS Coordinates
                </div>
                <div className="text-xs font-mono font-bold text-[#0b1c30]">
                  {formatCoordinates(userCoords)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleAcquireGPS}
                disabled={isLocating}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#00685f] border border-[#bcc9c6] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                title="Detect live browser GPS coordinates"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
              </button>

              <div className="flex bg-white rounded-lg border border-[#bcc9c6] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    viewMode === 'map' ? 'bg-[#00685f] text-white' : 'text-[#3d4947] hover:text-[#0b1c30]'
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    viewMode === 'list' ? 'bg-[#00685f] text-white' : 'text-[#3d4947] hover:text-[#0b1c30]'
                  }`}
                >
                  List ({filteredPharmacies.length})
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills (Radius & Amenities) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
            <span className="text-[10px] font-bold text-[#3d4947] uppercase tracking-wider whitespace-nowrap">Radius:</span>
            {[0.5, 1.0, 3.0, 5.0].map((radius) => (
              <button
                key={radius}
                onClick={() => setActiveRadius(radius)}
                className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeRadius === radius
                    ? 'bg-[#00685f] text-white shadow-2xs'
                    : 'bg-white border border-[#bcc9c6] text-[#3d4947] hover:bg-slate-50'
                }`}
              >
                ≤ {radius} mi
              </button>
            ))}

            <span className="text-slate-300">|</span>

            <button
              onClick={() => setFilter24h(!filter24h)}
              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter24h
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-[#bcc9c6] text-[#3d4947] hover:bg-slate-50'
              }`}
            >
              24/7 Open
            </button>

            <button
              onClick={() => setFilterDriveThru(!filterDriveThru)}
              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterDriveThru
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-[#bcc9c6] text-[#3d4947] hover:bg-slate-50'
              }`}
            >
              Drive-Thru
            </button>

            <button
              onClick={() => setFilterExpress(!filterExpress)}
              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterExpress
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-[#bcc9c6] text-[#3d4947] hover:bg-slate-50'
              }`}
            >
              Express Counter
            </button>
          </div>

          {/* Visual Vector Coordinate Map Canvas */}
          {viewMode === 'map' ? (
            <div className="relative w-full h-64 sm:h-72 bg-[#131b2e] rounded-xl overflow-hidden border border-slate-700 shadow-inner select-none">
              {/* SVG Vector Map Rendering */}
              <svg 
                className="w-full h-full" 
                viewBox="0 0 400 300" 
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Grid Pattern representing city streets and avenues */}
                  <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#213145" strokeWidth="1" />
                    <circle cx="20" cy="20" r="0.75" fill="#334760" />
                  </pattern>

                  {/* Main Avenues */}
                  <pattern id="major-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#2d425c" strokeWidth="1.5" />
                  </pattern>

                  {/* Radar Gradient */}
                  <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#89f5e7" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#00685f" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#00685f" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base Background */}
                <rect width="400" height="300" fill="#0f172a" />
                <rect width="400" height="300" fill="url(#city-grid)" opacity="0.8" />
                <rect width="400" height="300" fill="url(#major-grid)" opacity="0.6" />

                {/* City Blocks Architectural Polygons */}
                <rect x="30" y="30" width="70" height="45" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="120" y="25" width="60" height="50" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="230" y="35" width="80" height="40" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="40" y="100" width="60" height="70" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="240" y="110" width="70" height="60" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="50" y="200" width="80" height="60" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="150" y="220" width="90" height="50" rx="3" fill="#1e293b" opacity="0.7" />
                <rect x="260" y="200" width="80" height="70" rx="3" fill="#1e293b" opacity="0.7" />

                {/* Street Names Subtle Labels */}
                <text x="110" y="16" fill="#475569" fontSize="7" fontFamily="monospace">W 34TH ST (CROSS-TOWN)</text>
                <text x="110" y="136" fill="#475569" fontSize="7" fontFamily="monospace">W 32ND ST</text>
                <text x="110" y="216" fill="#475569" fontSize="7" fontFamily="monospace">W 23RD ST</text>
                <text x="12" y="150" fill="#475569" fontSize="7" fontFamily="monospace" transform="rotate(-90 12,150)">8TH AVE</text>
                <text x="215" y="150" fill="#475569" fontSize="7" fontFamily="monospace" transform="rotate(-90 215,150)">7TH AVE</text>
                <text x="325" y="150" fill="#475569" fontSize="7" fontFamily="monospace" transform="rotate(-90 325,150)">6TH AVE</text>

                {/* Radar Sweep Circle Around User Coordinates */}
                <circle cx={userSvgPos.x} cy={userSvgPos.y} r="120" fill="url(#radar-glow)" />
                <circle 
                  cx={userSvgPos.x} 
                  cy={userSvgPos.y} 
                  r="60" 
                  fill="none" 
                  stroke="#00685f" 
                  strokeWidth="1" 
                  strokeDasharray="3 3"
                  opacity="0.6" 
                />
                <circle 
                  cx={userSvgPos.x} 
                  cy={userSvgPos.y} 
                  r="110" 
                  fill="none" 
                  stroke="#00685f" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  opacity="0.4" 
                />

                {/* Radius Rings Label */}
                <text x={userSvgPos.x + 65} y={userSvgPos.y - 5} fill="#6bd8cb" fontSize="7" opacity="0.7">1.0 mi</text>
                <text x={userSvgPos.x + 115} y={userSvgPos.y - 5} fill="#6bd8cb" fontSize="7" opacity="0.7">2.5 mi</text>

                {/* Active Route Line from User Coordinates to Selected Pharmacy */}
                <line
                  x1={userSvgPos.x}
                  y1={userSvgPos.y}
                  x2={selectedSvgPos.x}
                  y2={selectedSvgPos.y}
                  stroke="#89f5e7"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  className="animate-pulse"
                />

                {/* Distance Badge Along the Route Line */}
                <g transform={`translate(${(userSvgPos.x + selectedSvgPos.x) / 2}, ${(userSvgPos.y + selectedSvgPos.y) / 2})`}>
                  <rect x="-24" y="-9" width="48" height="18" rx="9" fill="#0b1c30" stroke="#89f5e7" strokeWidth="1" />
                  <text x="0" y="3" fill="#89f5e7" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {selectedPharmacy.distanceMiles ?? 0.4} mi
                  </text>
                </g>

                {/* Pharmacy Pins rendered using their coordinates */}
                {filteredPharmacies.map((pharm) => {
                  const pos = projectToMap(pharm.coordinates);
                  const isSelected = selectedPharmacy.id === pharm.id;
                  const isHovered = hoveredPharmacyId === pharm.id;

                  return (
                    <g 
                      key={pharm.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      onClick={() => onSelectPharmacy(pharm)}
                      onMouseEnter={() => setHoveredPharmacyId(pharm.id)}
                      onMouseLeave={() => setHoveredPharmacyId(null)}
                    >
                      {/* Selection Pulse Ring */}
                      {isSelected && (
                        <circle cx="0" cy="0" r="16" fill="#89f5e7" opacity="0.25" className="animate-ping" />
                      )}

                      {/* Pin Drop Base */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? "11" : "8"}
                        fill={isSelected ? "#00685f" : "#1e293b"}
                        stroke={isSelected ? "#89f5e7" : "#4ade80"}
                        strokeWidth={isSelected ? "2" : "1.5"}
                      />

                      {/* Store Icon Glyph */}
                      <text
                        x="0"
                        y="3"
                        fill="#ffffff"
                        fontSize={isSelected ? "9" : "7"}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        Rx
                      </text>

                      {/* Distance Pill under pin */}
                      <rect
                        x="-16"
                        y="12"
                        width="32"
                        height="12"
                        rx="6"
                        fill={isSelected ? "#00685f" : "#0f172a"}
                        stroke={isSelected ? "#89f5e7" : "#334155"}
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="21"
                        fill={isSelected ? "#ffffff" : "#94a3b8"}
                        fontSize="7"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {pharm.distanceMiles ?? 0.5}m
                      </text>

                      {/* Interactive Hover Tooltip */}
                      {(isHovered || isSelected) && (
                        <g transform="translate(0, -22)">
                          <rect
                            x="-45"
                            y="-14"
                            width="90"
                            height="15"
                            rx="4"
                            fill="#0b1c30"
                            stroke="#89f5e7"
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="-4"
                            fill="#ffffff"
                            fontSize="7.5"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {pharm.name.length > 15 ? pharm.name.slice(0, 15) + '...' : pharm.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* User Origin GPS Pin */}
                <g transform={`translate(${userSvgPos.x}, ${userSvgPos.y})`}>
                  <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.25" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                  
                  {/* Origin Tag */}
                  <rect x="-24" y="-22" width="48" height="13" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.8" />
                  <text x="0" y="-13" fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="bold">
                    YOUR GPS
                  </text>
                </g>
              </svg>

              {/* Map Floating HUD Controls */}
              <div className="absolute top-2.5 right-2.5 flex flex-col space-y-1.5 z-10">
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 0.3, 2.2))}
                  className="w-7 h-7 rounded-md bg-slate-800/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-700 shadow-sm"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 0.3, 0.7))}
                  className="w-7 h-7 rounded-md bg-slate-800/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-700 shadow-sm"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords(DEFAULT_USER_COORDINATES);
                    setMapZoom(1);
                  }}
                  className="w-7 h-7 rounded-md bg-slate-800/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-700 shadow-sm"
                  title="Reset Coordinates to Midtown NY"
                >
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>

              {/* Bottom Map Info Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] text-slate-200">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-mono text-xs text-teal-300">
                    {selectedPharmacy.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[10px]">
                  <span className="text-slate-400">{selectedPharmacy.distanceMiles ?? 0.4} mi away</span>
                  <span className="text-emerald-400 font-bold">Ready in {selectedPharmacy.estimatedReadyMins}m</span>
                </div>
              </div>
            </div>
          ) : (
            /* List View Alternative */
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredPharmacies.map((pharm) => {
                const isSelected = selectedPharmacy.id === pharm.id;
                return (
                  <div
                    key={pharm.id}
                    onClick={() => onSelectPharmacy(pharm)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#00685f] ring-1 ring-[#00685f]'
                        : 'bg-white border-[#bcc9c6] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-xs text-[#0b1c30]">{pharm.name}</h4>
                          {pharm.badge && (
                            <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[9px] font-bold rounded">
                              {pharm.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#3d4947]">{pharm.address}, {pharm.zipCode}</p>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Coordinates: {formatCoordinates(pharm.coordinates)}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold text-[#00685f] block">
                          {pharm.distanceMiles ?? 0.4} mi
                        </span>
                        <span className="text-[10px] text-[#006948] font-semibold block">
                          Ready in {pharm.estimatedReadyMins} mins
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">{pharm.openHours}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPharmacy(pharm);
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isSelected
                            ? 'bg-[#00685f] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-[#00685f] hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ Selected Pickup' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Pickup Hub Detail Card */}
          <div className="bg-[#f8f9ff] border-2 border-[#6bd8cb] rounded-xl p-3 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-[#0b1c30]">
                    Active Pickup Location: {selectedPharmacy.name}
                  </span>
                </div>
                <p className="text-xs text-[#3d4947] pl-6.5">
                  {selectedPharmacy.address} • Phone: {selectedPharmacy.phone}
                </p>
                <div className="text-[10px] font-mono text-[#00685f] pl-6.5">
                  GPS: {formatCoordinates(selectedPharmacy.coordinates)} (Lic: {selectedPharmacy.licenseNumber})
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold block">
                  $0.00 PICKUP FEE
                </span>
                <span className="text-[10px] text-[#006948] font-bold block mt-1">
                  Ready in {selectedPharmacy.estimatedReadyMins} mins
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#bcc9c6]/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-[11px] text-[#3d4947]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Generic inventory synced
                </span>
                <span>•</span>
                <span>{selectedPharmacy.openHours}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onShowToast) {
                    onShowToast(
                      'success', 
                      'Pickup Confirmed', 
                      `Selected ${selectedPharmacy.name} for 15-minute in-store pickup! Zero fulfillment fees applied.`
                    );
                  }
                }}
                className="px-3 py-1 bg-[#00685f] text-white rounded-lg text-xs font-bold hover:bg-[#008378] transition-colors active:scale-95 shadow-2xs"
              >
                Confirm Pickup Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
