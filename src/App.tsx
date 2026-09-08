import React, { useState } from 'react';
import { PortalView, UserProfile, ToastNotification } from './types';
import { DEMO_USERS } from './data/authData';
import { TopPortalNav } from './components/TopPortalNav';
import { CustomerApp } from './components/customer/CustomerApp';
import { PartnerConsole } from './components/partner/PartnerConsole';
import { AdminConsole } from './components/admin/AdminConsole';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { PrescriptionVerificationModal } from './components/partner/PrescriptionVerificationModal';
import { ClinicalExceptionModal } from './components/partner/ClinicalExceptionModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState<PortalView>('customer');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isRxModalOpen, setIsRxModalOpen] = useState<boolean>(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState<boolean>(false);

  // Auth & Session Management
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.customer);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    if (isNewRegistration) {
      addToast(
        'success',
        'Account Registered & Verified',
        `Welcome to genericMed, ${user.name}! 2FA SMS security active.`
      );
    } else {
      addToast(
        'success',
        'Session Authenticated',
        `Signed in securely as ${user.name} (${user.role.toUpperCase()}).`
      );
    }

    // Proactively align portal view if appropriate
    if (user.role === 'partner' && currentView === 'customer') {
      setCurrentView('partner');
    } else if (user.role === 'admin' && currentView === 'customer') {
      setCurrentView('admin');
    }
  };

  const handleLogout = () => {
    const prevName = currentUser?.name || 'User';
    setCurrentUser(null);
    addToast('info', 'Signed Out', `Secure medical session for ${prevName} has ended.`);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
      addToast('success', 'Profile Updated', 'Patient records successfully saved.');
    }
  };

  const handleOpenRxModal = () => {
    setIsRxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-[#89f5e7] selection:text-[#00201d]">
      {/* Top Portal Navigation Switcher */}
      <TopPortalNav
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenVerificationModal={handleOpenRxModal}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Primary Portal Workspace */}
      <main className="flex-1 w-full">
        {currentView === 'customer' && (
          <CustomerApp 
            isMobileFrame={isMobileFrame} 
            onOpenClinicalVerificationModal={handleOpenRxModal}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onShowToast={addToast}
          />
        )}

        {currentView === 'partner' && (
          <PartnerConsole />
        )}

        {currentView === 'admin' && (
          <AdminConsole />
        )}

        {currentView === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Auth Modal (Login / Register / OTP / Password Reset) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Clinical Verification Modal (Quick access from any view) */}
      <PrescriptionVerificationModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onApprove={() => {
          setIsRxModalOpen(false);
          addToast(
            'success',
            'Prescription Approved',
            'Digitally signed with 21 CFR § 1306 compliance. Order queued for dispensing.'
          );
        }}
        onReject={() => {
          setIsRxModalOpen(false);
          setIsExceptionModalOpen(true);
        }}
      />

      {/* Clinical Exception Rejection Protocol Modal */}
      <ClinicalExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        onSubmitException={(details) => {
          addToast(
            'warning',
            'Clinical Exception Logged',
            `Category: ${details.category} via ${details.routing}. Patient notice dispatched.`
          );
        }}
      />

      {/* Global Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
