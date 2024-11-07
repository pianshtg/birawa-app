import React from 'react';
import Layout from './Layout';
import MobilePage from '../../../pages/mobilepage';
import useIsMobile from '@/hooks/useDetection';
type Props = {
  children: React.ReactNode;
};

const ResponsiveLayout = ({ children }: Props) => {
    const isMobile = useIsMobile(620);

  // Tampilan khusus untuk mobile
  if (isMobile) {
    return (
      <MobilePage/>
    );
  }

  // Jika layar bukan mobile, tampilkan layout biasa
  return <Layout>{children}</Layout>;
};

export default ResponsiveLayout;
