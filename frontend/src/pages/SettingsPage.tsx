import { Routes, Route } from 'react-router-dom';
import SettingsLayout from '@/components/custom/layout/SettingsLayout';
import ProfileLayout from '@/components/custom/layout/ProfileLayout';
import LoggingLayout from '@/components/custom/layout/LoggingLayout';
const SettingsPage = () => {
  return (
    <SettingsLayout>
      <Routes>
        <Route path="profile" element={<ProfileLayout/>} />
        <Route path="logging" element={<LoggingLayout />} />
      </Routes>
    </SettingsLayout>
  );
};

export default SettingsPage;
