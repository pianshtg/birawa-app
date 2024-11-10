import { Route, Routes } from "react-router-dom";
import Home from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Ceklaporan from "./pages/CPM/CekLaporanPage";
import Inbox from "./pages/InboxPage";
import Buatlaporan from "./pages/Mitra/buatlaporan/BuatLaporanPage";
import NotFound from "./pages/NotFoundPage";
import Profile from "./components/custom/organism/Profile";
import Forgotpassword from "./pages/ForgotPasswordPage";
import Layout from "./components/custom/layout/Layout";
import SettingsPage from "@/pages/SettingsPage";
import MobilePage from "@/pages/mobilepage"; // Halaman khusus mobile
import useDetection from "@/hooks/useDetection"; // Import custom hook
import DaftarPekerjaan from "./pages/Mitra/buatlaporan/daftarpekerjaan";

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


  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path='/ceklaporan' element={<Layout><Ceklaporan /></Layout>} />
      <Route path='/inbox/' element={<Layout><Inbox /></Layout>} />
      <Route path='/buatlaporan' element={<Layout><Buatlaporan /></Layout>} />
      <Route path='/profile' element={<Layout><Profile /></Layout>} />
      <Route path='/forgotpassword' element={<Forgotpassword />} />
      <Route path='/settings/*' element={<SettingsPage />} />
      <Route path='/daftarpekerjaan' element={<Layout> <DaftarPekerjaan/></Layout>} />


      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
