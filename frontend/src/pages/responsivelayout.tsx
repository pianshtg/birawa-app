import React from 'react';
import Layout from '../pages/layout';
import MobilePage from './mobilepage';
import useIsMobile from '@/hooks/UseIsMobile';
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
