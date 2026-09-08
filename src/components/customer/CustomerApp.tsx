import React, { useState } from 'react';
import { CustomerTab, Medicine, MedicineOffer, CartItem } from '../../types';
import { MEDICINES, PRIMARY_ORDER } from '../../data/mockData';
import { CustomerDiscovery } from './CustomerDiscovery';
import { CustomerCompare } from './CustomerCompare';
import { CustomerCheckout } from './CustomerCheckout';
import { CustomerOrderTracking } from './CustomerOrderTracking';
import { PrescriptionScannerModal } from './PrescriptionScannerModal';
import { 
  Home, 
  Layers, 
  Package, 
  Bookmark, 
  User, 
  X, 
  Upload, 
  Camera, 
  CheckCircle2, 
  FileText,
  ShieldCheck
} from 'lucide-react';

interface CustomerAppProps {
  isMobileFrame: boolean;
  onOpenClinicalVerificationModal?: () => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  isMobileFrame,
  onOpenClinicalVerificationModal,
}) => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>(MEDICINES[0]);
  const [cart, setCart] = useState<CartItem[]>([
    {
      medicine: MEDICINES[0],
      selectedStrength: '20mg',
      selectedPackSize: 10,
      selectedOffer: MEDICINES[0].offers[0],
      quantity: 2,
      prescriptionUploaded: true,
      prescriptionFile: {
        name: 'Dr_Smith_Prescription_Sept.pdf',
        uploadedAt: '10:12 AM',
        verified: true
      }
    }
  ]);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    setActiveTab('compare');
  };

  const handleAddToCartAndCheckout = (offer: MedicineOffer, strength: string, packSize: number) => {
    setCart([
      {
        medicine: selectedMedicine,
        selectedStrength: strength,
        selectedPackSize: packSize,
        selectedOffer: offer,
        quantity: 2,
        prescriptionUploaded: true,
        prescriptionFile: {
          name: 'Dr_Smith_Prescription_Sept.pdf',
          uploadedAt: '10:12 AM',
          verified: true
        }
      }
    ]);
    setActiveTab('checkout');
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const next = [...prev];
      if (next[index]) {
        const newQty = Math.max(1, next[index].quantity + delta);
        next[index] = { ...next[index], quantity: newQty };
      }
      return next;
    });
  };

  const handlePlaceOrder = () => {
    setActiveTab('orders');
  };

  const handleSimulateUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsRxModalOpen(false);
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-[#f0f4f9] flex justify-center items-start ${isMobileFrame ? 'p-4 sm:p-6' : 'p-0'}`}>
      <div 
        className={`w-full bg-[#f8f9ff] text-[#0b1c30] relative overflow-hidden transition-all ${
          isMobileFrame 
            ? 'max-w-md rounded-[32px] shadow-2xl border-4 border-slate-800 min-h-[820px]' 
            : 'max-w-xl mx-auto shadow-md min-h-screen'
        }`}
      >
        {/* Mobile Speaker/Camera Notch if in Mobile Frame mode */}
        {isMobileFrame && (
          <div className="w-full bg-[#f8f9ff] pt-2 flex justify-center items-center">
            <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
              <span className="w-6 h-1 bg-slate-700 rounded-full"></span>
            </div>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'home' && (
          <CustomerDiscovery
            onSelectMedicine={handleSelectMedicine}
            onNavigateToCart={() => setActiveTab('checkout')}
            cartCount={cartCount}
            onOpenRxUpload={() => setIsRxModalOpen(true)}
          />
        )}

        {activeTab === 'compare' && (
          <CustomerCompare
            medicine={selectedMedicine}
            onBack={() => setActiveTab('home')}
            onAddToCartAndCheckout={handleAddToCartAndCheckout}
            onNavigateToCart={() => setActiveTab('checkout')}
            cartCount={cartCount}
          />
        )}

        {activeTab === 'checkout' && (
          <CustomerCheckout
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onBack={() => setActiveTab('compare')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'orders' && (
          <CustomerOrderTracking
            onBack={() => setActiveTab('home')}
            onOpenHelp={() => alert("Connecting to genericMed 24/7 Clinical Pharmacist Help Desk...")}
          />
        )}

        {activeTab === 'saved' && (
          <div className="p-4 space-y-4 min-h-[600px]">
            <h2 className="text-lg font-bold text-[#0b1c30]">Saved Medicines & Prescriptions</h2>
            <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-[#0b1c30]">Atorvastatin Calcium 20mg</h3>
                  <p className="text-xs text-[#3d4947]">Lipitor® Equivalent • Saved from last search</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedMedicine(MEDICINES[0]);
                    setActiveTab('compare');
                  }}
                  className="px-3 py-1 bg-[#00685f] text-white rounded text-xs font-semibold"
                >
                  View Offers
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-[#0b1c30]">Metformin HCl ER 500mg</h3>
                  <p className="text-xs text-[#3d4947]">Glucophage® XR Equivalent</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedMedicine(MEDICINES[1]);
                    setActiveTab('compare');
                  }}
                  className="px-3 py-1 bg-[#00685f] text-white rounded text-xs font-semibold"
                >
                  View Offers
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 space-y-4 min-h-[600px]">
            <h2 className="text-lg font-bold text-[#0b1c30]">Patient Account & Prescriptions</h2>
            <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#00685f] flex items-center justify-center font-bold text-lg">
                  EV
                </div>
                <div>
                  <h3 className="font-bold text-[#0b1c30]">Eleanor Vance</h3>
                  <p className="text-xs text-[#3d4947]">eleanor.vance@example.com • 58 Yrs</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[#3d4947]">Primary Physician</span>
                  <span className="font-semibold text-[#0b1c30]">Dr. Robert H. Smith MD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-[#3d4947]">Known Drug Allergies</span>
                  <span className="font-semibold text-[#006948]">NKDA (No Known Allergies)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#3d4947]">Active Prescriptions</span>
                  <span className="font-semibold text-[#00685f]">2 on file</span>
                </div>
              </div>
            </div>

            {/* Link to Pharmacist clinical modal for convenience */}
            {onOpenClinicalVerificationModal && (
              <button
                onClick={onOpenClinicalVerificationModal}
                className="w-full py-2.5 px-3 bg-[#eff4ff] border border-[#6bd8cb] text-[#00685f] rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#dce9ff]"
              >
                <ShieldCheck className="w-4 h-4" />
                Inspect Licensed Pharmacist Verification Modal
              </button>
            )}
          </div>
        )}

        {/* Docked Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 max-w-md w-full mx-auto bg-white border-t border-[#bcc9c6] z-30 flex justify-around items-center h-14 shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'home' ? 'text-[#00685f]' : 'text-[#3d4947] hover:text-[#0b1c30]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'compare' ? 'text-[#00685f]' : 'text-[#3d4947] hover:text-[#0b1c30]'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Compare</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
              activeTab === 'orders' ? 'text-[#00685f]' : 'text-[#3d4947] hover:text-[#0b1c30]'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Orders</span>
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'saved' ? 'text-[#00685f]' : 'text-[#3d4947] hover:text-[#0b1c30]'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Saved</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'profile' ? 'text-[#00685f]' : 'text-[#3d4947] hover:text-[#0b1c30]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Profile</span>
          </button>
        </nav>

        {/* AI Optical Prescription Scanner Modal */}
        <PrescriptionScannerModal
          isOpen={isRxModalOpen}
          onClose={() => setIsRxModalOpen(false)}
          onSelectMatchedMedicine={(matched) => {
            setSelectedMedicine(matched);
            setActiveTab('compare');
          }}
        />
      </div>
    </div>
  );
};
