import { Route, Routes } from "react-router-dom";
import Home from "./pages/login";
import Dashboard from "./pages/dashboard";
import Ceklaporan from "./pages/CPM/ceklaporan";
import Inbox from "./pages/inbox";
import Buatlaporan from "./pages/Mitra/buatlaporan";
import NotFound from "./pages/notfound";
import Profile from "./pages/settings";
import Forgotpassword from "./pages/forgotpassword";
import ResponsiveLayout from "@/components/custom/layout/ResponsiveLayout";
import SettingsPage from "@/pages/settings";
import MobilePage from "@/pages/mobilepage"; // Halaman khusus mobile
import useDetection from "@/hooks/useDetection"; // Import custom hook

function AppRoutes() {
  const isMobile = useDetection(620); // Tentukan ukuran maksimum untuk dianggap sebagai mobile

  // Jika perangkat adalah mobile, arahkan ke halaman khusus mobile
  if (isMobile) {
    return (
      <Routes>
        <Route path="*" element={<MobilePage />} />
      </Routes>
    );
  }

  // Jika bukan perangkat mobile, tampilkan layout aplikasi penuh
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/dashboard" element={<ResponsiveLayout><Dashboard /></ResponsiveLayout>} />
      <Route path='/ceklaporan' element={<ResponsiveLayout><Ceklaporan /></ResponsiveLayout>} />
      <Route path='/inbox/' element={<ResponsiveLayout><Inbox /></ResponsiveLayout>} />
      <Route path='/buatlaporan' element={<ResponsiveLayout><Buatlaporan /></ResponsiveLayout>} />
      <Route path='/profile' element={<ResponsiveLayout><Profile /></ResponsiveLayout>} />
      <Route path='/forgotpassword' element={<Forgotpassword />} />
      <Route path='/settings/*' element={<SettingsPage />} />

      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
