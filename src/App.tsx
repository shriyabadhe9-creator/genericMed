import React, { useState } from 'react';
import { PortalView } from './types';
import { TopPortalNav } from './components/TopPortalNav';
import { CustomerApp } from './components/customer/CustomerApp';
import { PartnerConsole } from './components/partner/PartnerConsole';
import { AdminConsole } from './components/admin/AdminConsole';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { PrescriptionVerificationModal } from './components/partner/PrescriptionVerificationModal';
import { ClinicalExceptionModal } from './components/partner/ClinicalExceptionModal';

export default function App() {
  const [currentView, setCurrentView] = useState<PortalView>('customer');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isRxModalOpen, setIsRxModalOpen] = useState<boolean>(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState<boolean>(false);

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
      />

      {/* Primary Portal Workspace */}
      <main className="flex-1 w-full">
        {currentView === 'customer' && (
          <CustomerApp 
            isMobileFrame={isMobileFrame} 
            onOpenClinicalVerificationModal={handleOpenRxModal}
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

      {/* Global Clinical Verification Modal (Quick access from any view) */}
      <PrescriptionVerificationModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onApprove={() => {
          setIsRxModalOpen(false);
          alert("Prescription verified and digitally signed! Order approved for dispensing.");
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
          alert(`Clinical exception logged: ${details.category} via ${details.routing}. Patient transparency notice dispatched.`);
        }}
      />
    </div>
  );
}
