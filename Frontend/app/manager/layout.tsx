import DashboardLayout from '@/components/layout/dashboard-layout';
import { GlobalModalProvider } from '@/context/GlobalModalContext';
import ContactUsModal from '@/components/global-modals/ContactUsModal';
import HelpSupportModal from '@/components/global-modals/HelpSupportModal';
import SettingsModal from '@/components/global-modals/SettingsModal';

export default function DGPGlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalModalProvider>
      <DashboardLayout role="manager" name="Manager Dashboard">{children}</DashboardLayout>
      <ContactUsModal />
      <HelpSupportModal />
      <SettingsModal />
    </GlobalModalProvider>
  );
}
