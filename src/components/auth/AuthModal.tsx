import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  Stethoscope, 
  Smartphone, 
  FileBadge,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/authData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess: (user: UserProfile, isNewRegistration?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('eleanor.vance@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields - Register
  const [registerRole, setRegisterRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [deaReg, setDeaReg] = useState('');
  const [hipaaConsent, setHipaaConsent] = useState(true);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setForgotSuccess(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Quick Demo Account Switcher
  const handleQuickDemoSelect = (roleKey: string) => {
    const user = DEMO_USERS[roleKey];
    if (user) {
      setLoginIdentifier(user.email);
      setLoginPassword('Password123!');
      setErrorMessage('');
    }
  };

  const handleQuickLoginDirect = (roleKey: string) => {
    const user = DEMO_USERS[roleKey];
    if (user) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user, false);
        onClose();
      }, 350);
    }
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Find matching demo user or fallback
      const found = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === loginIdentifier.trim().toLowerCase()
      );

      if (found) {
        onLoginSuccess(found, false);
        onClose();
      } else {
        // Create authenticated profile with entered email
        const newCust: UserProfile = {
          id: `usr-cust-${Date.now().toString().slice(-5)}`,
          name: loginIdentifier.split('@')[0] || 'GenericMed User',
          email: loginIdentifier,
          phone: '+1 (555) 019-2834',
          role: 'customer',
          avatarInitials: (loginIdentifier[0] || 'U').toUpperCase(),
          memberSince: 'Today',
          isVerified: true,
          shippingAddress: '120 Broadway, New York, NY 10005',
        };
        onLoginSuccess(newCust, false);
        onClose();
      }
    }, 600);
  };

  // Submit Register -> Transitions to SMS OTP Verification
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please provide a valid medical contact email address.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Mobile phone number is required for 2FA prescription security.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (registerRole === 'partner' && (!pharmacyName.trim() || !licenseNumber.trim())) {
      setErrorMessage('Pharmacy Name and State Board License number are mandatory for pharmacy registration.');
      return;
    }
    if (!hipaaConsent) {
      setErrorMessage('You must acknowledge the HIPAA privacy terms to proceed.');
      return;
    }

    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'RX';

    const newUser: UserProfile = {
      id: `usr-${registerRole}-${Date.now().toString().slice(-5)}`,
      name: fullName,
      email: regEmail,
      phone: regPhone,
      role: registerRole,
      avatarInitials: initials,
      memberSince: 'September 2026',
      isVerified: true,
      pharmacyName: registerRole === 'partner' ? pharmacyName : undefined,
      licenseNumber: registerRole === 'partner' || registerRole === 'prescriber' ? licenseNumber : undefined,
      deaReg: registerRole === 'partner' ? deaReg : undefined,
      shippingAddress: registerRole === 'customer' ? 'Default Primary Residence' : undefined,
      allergies: registerRole === 'customer' ? 'NKDA (No Known Allergies)' : undefined,
      activeRxCount: registerRole === 'customer' ? 0 : undefined,
    };

    setPendingUser(newUser);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setMode('otp');
    }, 500);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpCode(['7', '4', '9', '2', '1', '0']);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (pendingUser) {
        onLoginSuccess(pendingUser, true);
        onClose();
      }
    }, 600);
  };

  // Password recovery submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier) {
      setErrorMessage('Please enter your email to receive recovery instructions.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSuccess(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#bcc9c6]/60 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Modal Top Header Banner */}
        <div className="bg-[#0b1c30] text-white px-5 py-4 flex items-center justify-between border-b border-[#213145]">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-md bg-[#00685f] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              gM
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm tracking-tight text-white">genericMed Portal</h3>
                <span className="text-[10px] bg-[#00685f]/30 text-[#89f5e7] border border-[#00685f]/50 px-1.5 py-0.2 rounded font-mono">
                  HIPAA Secured
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {mode === 'login' && 'Sign in to access prescriptions and savings'}
                {mode === 'register' && 'Create your verified healthcare profile'}
                {mode === 'otp' && 'Two-Factor Authentication Security Check'}
                {mode === 'forgot' && 'Reset your secure account credentials'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        {mode !== 'otp' && (
          <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                mode === 'login'
                  ? 'border-[#00685f] text-[#00685f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                mode === 'register'
                  ? 'border-[#00685f] text-[#00685f]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Register Account
            </button>
          </div>
        )}

        {/* Modal Body Scroll Area */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Quick Demo Logins Pill Bar */}
              <div className="bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0b1c30] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>Quick Demo Accounts:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Click to autofill & test</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLoginDirect('customer')}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0b1c30] text-[11px] group-hover:text-[#00685f]">Patient</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Eleanor (85% off)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLoginDirect('partner')}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0b1c30] text-[11px] group-hover:text-[#00685f]">Pharmacist</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Apex Central</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLoginDirect('admin')}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0b1c30] text-[11px] group-hover:text-[#00685f]">Admin</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Ops Center</span>
                  </button>
                </div>
              </div>

              {/* Email / Identifier Input */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block text-[11px]">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@example.com or +1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0b1c30] block text-[11px]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-[#00685f] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#00685f] focus:ring-[#00685f]"
                  />
                  <span>Trust this secure medical browser session (30 days)</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing in securely...</span>
                ) : (
                  <>
                    <span>Sign In to Healthcare Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Footer Switch */}
              <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-[#00685f] font-bold hover:underline"
                >
                  Create an Account
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: REGISTER ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Account Type Selection */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block text-[11px]">
                  Select Your Account Role:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('customer')}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      registerRole === 'customer'
                        ? 'bg-[#eff4ff] border-[#00685f] text-[#00685f]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-bold text-[11px]">Patient</span>
                    </div>
                    <span className="text-[10px] opacity-80 block">Generic Savings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('partner')}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      registerRole === 'partner'
                        ? 'bg-[#eff4ff] border-[#00685f] text-[#00685f]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="font-bold text-[11px]">Pharmacy</span>
                    </div>
                    <span className="text-[10px] opacity-80 block">Retail Partner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('prescriber')}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      registerRole === 'prescriber'
                        ? 'bg-[#eff4ff] border-[#00685f] text-[#00685f]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span className="font-bold text-[11px]">Prescriber</span>
                    </div>
                    <span className="text-[10px] opacity-80 block">e-Rx Provider</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block text-[11px]">
                  {registerRole === 'partner' ? 'Lead Pharmacist Name' : 'Full Legal Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance or Dr. Bradley Smith"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pharmacy-Specific Fields */}
              {registerRole === 'partner' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pharmacy Facility Credentials</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      placeholder="Pharmacy Store Name (e.g. Apex Rx)"
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="State Board License (LIC-NY-...)"
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded text-xs focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={deaReg}
                    onChange={(e) => setDeaReg(e.target.value)}
                    placeholder="DEA Registration Number (optional)"
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block text-[11px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block text-[11px]">
                    Mobile Phone (2FA SMS)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block text-[11px]">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block text-[11px]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                  />
                </div>
              </div>

              {/* HIPAA & Telepharmacy Consent */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hipaaConsent}
                    onChange={(e) => setHipaaConsent(e.target.checked)}
                    className="rounded border-slate-300 text-[#00685f] focus:ring-[#00685f] mt-0.5"
                  />
                  <span>
                    I accept the <strong className="text-[#0b1c30]">HIPAA Data Safeguards</strong>, genericMed Terms of Service, and authorize prescription OCR and pharmacy order routing.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Create Account & Verify Phone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#00685f] font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: OTP 2FA VERIFICATION ================= */}
          {mode === 'otp' && (
            <div className="space-y-4 py-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f4fffc] border border-[#85f8c4] text-[#006948] flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0b1c30]">Verify Your Mobile Phone</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  We sent a 6-digit authentication code to{' '}
                  <strong className="text-[#0b1c30]">{pendingUser?.phone || regPhone || '+1 (555) 234-5678'}</strong>.
                </p>
              </div>

              {/* Demo Simulated SMS Prompt */}
              <div className="bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-lg p-2.5 flex items-center justify-between text-[11px] text-[#0b1c30]">
                <span>Simulated SMS Code: <strong className="font-mono text-[#00685f]">749210</strong></span>
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="px-2 py-0.5 bg-white border border-[#00685f] text-[#00685f] rounded text-[10px] font-bold hover:bg-[#00685f] hover:text-white transition-colors"
                >
                  Auto-Fill
                </button>
              </div>

              {/* 6-box input */}
              <div className="flex justify-center gap-2 pt-2">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00685f] focus:outline-none bg-white"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otpCode.some((d) => !d)}
                className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Confirming authentication...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Verification & Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Go back to edit registration info
              </button>
            </div>
          )}

          {/* ================= MODE: FORGOT PASSWORD ================= */}
          {mode === 'forgot' && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0b1c30]">Password Recovery</h4>
                <p className="text-xs text-slate-600">
                  Enter your registered healthcare account email. We will dispatch an encrypted reset link complying with HIPAA identity verification rules.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 bg-[#f4fffc] border border-[#85f8c4] rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#006948] mx-auto" />
                  <p className="font-bold text-xs text-[#002114]">Password Reset Dispatched</p>
                  <p className="text-[11px] text-slate-600">
                    If an account matches <strong>{loginIdentifier}</strong>, a secure reset token has been delivered to your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotSuccess(false);
                    }}
                    className="mt-2 px-4 py-2 bg-[#00685f] text-white rounded-lg font-bold text-xs hover:bg-[#008378]"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#0b1c30] block text-[11px]">
                      Your Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. eleanor.vance@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    {isLoading ? <span>Sending link...</span> : <span>Dispatch Secure Reset Link</span>}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Cancel and back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Compliance Footer */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00685f]" />
            <span>256-bit TLS • 21 CFR § 1306 e-Rx Safe</span>
          </div>
          <span>SOC2 Type II Certified</span>
        </div>
      </div>
    </div>
  );
};
