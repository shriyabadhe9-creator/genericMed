import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Lock, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Edit3, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface CustomerProfileViewProps {
  currentUser: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenClinicalVerificationModal?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenClinicalVerificationModal,
  onUpdateUser,
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(currentUser?.shippingAddress || '742 Evergreen Terrace, Apt 4B, Springfield, NY 10001');
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [allergiesInput, setAllergiesInput] = useState(currentUser?.allergies || 'NKDA (No Known Allergies)');

  const handleSaveAddress = () => {
    if (onUpdateUser) {
      onUpdateUser({ shippingAddress: addressInput });
    }
    setIsEditingAddress(false);
  };

  const handleSaveAllergies = () => {
    if (onUpdateUser) {
      onUpdateUser({ allergies: allergiesInput });
    }
    setIsEditingAllergies(false);
  };

  return (
    <div className="p-4 space-y-4 min-h-[600px] text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0b1c30]">Patient Account & Profile</h2>
        {currentUser ? (
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 text-slate-500 hover:text-red-600 font-semibold px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="flex items-center space-x-1 text-[#00685f] hover:text-[#008378] font-bold px-2 py-1 bg-[#eff4ff] rounded border border-[#bcc9c6]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* When Logged Out: Action Hero Card */}
      {!currentUser && (
        <div className="bg-gradient-to-br from-[#eff4ff] to-[#f4fffc] border border-[#bcc9c6] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5 text-[#00685f]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#0b1c30]">Unlock Your Healthcare Benefits</h3>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Sign in or register a verified profile to sync prescription records, track live door-to-door deliveries, and save up to 85% compared to brand-name retail pricing.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onOpenAuth('login')}
              className="py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="py-2.5 bg-white hover:bg-slate-50 text-[#00685f] border border-[#00685f] rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      )}

      {/* User Info Card (When Logged In) */}
      {currentUser && (
        <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#dce9ff] text-[#00685f] flex items-center justify-center font-bold text-lg ring-2 ring-[#00685f]/20">
                {currentUser.avatarInitials}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-[#0b1c30]">{currentUser.name}</h3>
                  <span className="px-1.5 py-0.2 bg-[#f4fffc] border border-[#85f8c4] text-[#006948] rounded text-[10px] font-bold">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#3d4947]">{currentUser.email}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {currentUser.id}</p>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-2 py-1 text-[10px] text-[#00685f] bg-[#eff4ff] hover:bg-[#dce9ff] rounded font-semibold border border-[#bcc9c6]"
              title="Switch to another demo profile"
            >
              Switch Account
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2.5">
            {/* Phone & Member Since */}
            <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 block">Mobile (2FA):</span>
                <span className="font-semibold text-slate-800">{currentUser.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Member Since:</span>
                <span className="font-semibold text-slate-800">{currentUser.memberSince || '2026'}</span>
              </div>
            </div>

            {/* Primary Physician */}
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Primary Care Physician</span>
              <span className="font-semibold text-[#0b1c30]">
                {currentUser.primaryPhysician || 'Dr. Robert H. Smith MD'}
              </span>
            </div>

            {/* Known Drug Allergies */}
            <div className="py-1 border-b border-slate-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Known Drug Allergies</span>
                {!isEditingAllergies ? (
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-[#006948] bg-[#f4fffc] px-2 py-0.5 rounded border border-[#85f8c4]">
                      {currentUser.allergies || allergiesInput}
                    </span>
                    <button
                      onClick={() => setIsEditingAllergies(true)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Edit allergies"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={allergiesInput}
                      onChange={(e) => setAllergiesInput(e.target.value)}
                      className="px-2 py-1 border border-[#00685f] rounded text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleSaveAllergies}
                      className="p-1 bg-[#00685f] text-white rounded hover:bg-[#008378]"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Shipping Address */}
            <div className="py-1 border-b border-slate-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Delivery Address</span>
                </span>
                {!isEditingAddress ? (
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Edit address"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveAddress}
                    className="p-1 bg-[#00685f] text-white rounded hover:bg-[#008378]"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
              </div>
              {!isEditingAddress ? (
                <p className="text-[#0b1c30] font-medium pl-4">
                  {currentUser.shippingAddress || addressInput}
                </p>
              ) : (
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full px-2 py-1 border border-[#00685f] rounded text-xs focus:outline-none"
                />
              )}
            </div>

            {/* Active Prescriptions Badge */}
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600 flex items-center space-x-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Active Prescriptions</span>
              </span>
              <span className="font-semibold text-[#00685f] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#bcc9c6]">
                {currentUser.activeRxCount !== undefined ? `${currentUser.activeRxCount} on file` : '2 on file'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Security & HIPAA Compliance Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center space-x-2 text-[#0b1c30]">
          <ShieldCheck className="w-4 h-4 text-[#00685f]" />
          <h4 className="font-bold text-xs">Security & Regulatory Compliance</h4>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          genericMed protects patient identifying data and medical prescription transfers under 45 CFR Part 160/164 (HIPAA Security Rule) with end-to-end 256-bit encryption.
        </p>
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-slate-600">
          <div className="flex items-center space-x-1 bg-white p-1.5 rounded border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-[#006948]" />
            <span>2FA OTP Enabled</span>
          </div>
          <div className="flex items-center space-x-1 bg-white p-1.5 rounded border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-[#006948]" />
            <span>21 CFR § 1306 e-Rx</span>
          </div>
        </div>
      </div>

      {/* Link to Pharmacist clinical modal for convenience */}
      {onOpenClinicalVerificationModal && (
        <button
          onClick={onOpenClinicalVerificationModal}
          className="w-full py-2.5 px-3 bg-[#eff4ff] border border-[#6bd8cb] text-[#00685f] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#dce9ff] transition-all shadow-xs"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Inspect Licensed Pharmacist Verification Modal</span>
        </button>
      )}
    </div>
  );
};
