import React from 'react';
import LoginForm from '@/components/custom/organism/LoginForm';
import MobilePage from './mobilepage';
import useIsMobile from '@/hooks/UseIsMobile';

const Login: React.FC = () => {
  const isMobile = useIsMobile(620);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {isMobile ? <MobilePage/> : <LoginForm />}
    </div>
  );
};

export default Login;
