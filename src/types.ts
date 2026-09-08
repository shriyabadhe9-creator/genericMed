export type PortalView = 'customer' | 'partner' | 'admin' | 'architecture';

export type CustomerTab = 'home' | 'compare' | 'checkout' | 'orders' | 'saved' | 'profile';

export type PartnerTab = 'orders' | 'inventory' | 'prescriptions' | 'settlements' | 'compliance';

export type AdminTab = 'operations' | 'pharmacies' | 'catalog' | 'sla' | 'compliance' | 'config';

export interface MedicineOffer {
  id: string;
  sellerId: string;
  pharmacyName: string;
  licenseNumber: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isLicensedPartner: boolean;
  price: number;
  unitPrice: number;
  deliveryEta: string;
  shippingFee: number;
  freeShippingThreshold?: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastStockCheck: string;
  rank: number;
  badge?: string;
  savingsVsBrand?: number;
}

export interface MedicineVariant {
  id: string;
  strength: string; // e.g. "20mg"
  form: string; // e.g. "Film-coated Tablet"
  packSize: number; // e.g. 10
  packUnit: string; // e.g. "Tablets"
}

export interface Medicine {
  id: string;
  genericName: string;
  brandReference: string;
  brandPrice: number;
  lowestGenericPrice: number;
  activeIngredient: string;
  category: string;
  ndc: string;
  rxRequired: boolean;
  uspVerified: boolean;
  bioequivalent: boolean;
  fdaCode: string;
  dosageStrengths: string[];
  dosageForms: string[];
  packSizes: number[];
  offers: MedicineOffer[];
}

export interface CartItem {
  medicine: Medicine;
  selectedStrength: string;
  selectedPackSize: number;
  selectedOffer: MedicineOffer;
  quantity: number;
  prescriptionUploaded?: boolean;
  prescriptionFile?: {
    name: string;
    uploadedAt: string;
    verified: boolean;
  };
}

export interface Order {
  id: string; // e.g. "GM-89241"
  placedAt: string;
  status: 'Order Placed' | 'Pharmacist Approved' | 'Packed & Sealed' | 'Out for Delivery' | 'Delivered';
  estimatedDeliveryMins: number;
  courier: {
    name: string;
    vehicle: string;
    distance: string;
    temperatureSafe: string;
    etaMins: number;
  };
  pharmacy: {
    name: string;
    license: string;
    deaReg: string;
    storeNumber: string;
  };
  item: {
    name: string;
    equivalentTo: string;
    dosage: string;
    packaging: string;
    quantity: number;
    totalUnits: number;
    price: number;
    ndc: string;
    batchNumber: string;
  };
  pricing: {
    baseCost: number;
    pharmacyFee: number;
    coldChainPackaging: number;
    copayOffset: number;
    total: number;
    brandEquivalentPrice: number;
    savingsPercent: number;
  };
  paymentMethod: string;
  paymentRef: string;
}

export interface OperationalException {
  id: string;
  moleculeName: string;
  dosageAndPack: string;
  ndc: string;
  pharmacyName: string;
  pharmacyStatus: 'Verified Seller' | 'Audit Review';
  reportedPrice: number;
  livePrice: number;
  driftDelta: string;
  driftPercent: string;
  freshness: string;
  status: 'valid' | 'breach';
  resolved: boolean;
  type: 'price_drift' | 'catalog_mapping' | 'seller_approval' | 'sla_breach';
}

export interface AuditLedgerEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
  statusPill?: {
    label: string;
    color: 'emerald' | 'amber' | 'primary' | 'red';
  };
  txHash: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}
