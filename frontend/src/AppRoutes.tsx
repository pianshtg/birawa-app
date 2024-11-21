import { Route, Routes } from "react-router-dom";
import Home from "@/pages/LoginPage";
import Dashboard from "@/pages/DashboardPage";
import Ceklaporan from "@/pages/CPM/CekLaporanPage";
import Inbox from "@/pages/InboxPage";
import Buatlaporan from "@/pages/Mitra/buatlaporan/BuatLaporanPage";
import NotFound from "@/pages/NotFoundPage";
import Forgotpassword from "@/pages/ForgotPasswordPage";
import Layout from "@/components/custom/layout/Layout";
import SettingsPage from "@/pages/SettingsPage";
import MobilePage from "./pages/mobilepage";
import useDetection from "@/hooks/useDetection"; // Import custom hook
import DaftarPekerjaan from "@/pages/Mitra/buatlaporan/DaftarPekerjaanPage";
import TambahMitraPage from "@/pages/CPM/TambahMitraPage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import DaftarMitraPage from "./pages/Mitra/tambahmitra/DaftarMitraPage";

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
      <Route path='/forgotpassword' element={<Forgotpassword />} />
      
      {/* <Route element={<ProtectedRoute/>}> */}
        <Route path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout> 
          }
        />
        <Route path="/daftarmitra" 
          element={
            <Layout>
              <DaftarMitraPage />
            </Layout>
          } 
        />

        <Route path="daftarmitra/tambahmitra" 
          element={
            <Layout>
              <TambahMitraPage />
            </Layout>
          } 
        />

        {/* Buat Laporan Page */}
        <Route path='/daftarpekerjaan' 
          element={
            <Layout>
              <DaftarPekerjaan/>
            </Layout>
          } 
        /> 
        <Route path='/daftarpekerjaan/buatlaporan' 
          element={
            <Layout>
              <Buatlaporan/>
            </Layout>
          } 
        />

        <Route path='/ceklaporan' 
          element={
            <Layout>
              <Ceklaporan />
            </Layout>
          } 
        />

        <Route path='/inbox' 
          element={
            <Layout>
              <Inbox />
            </Layout>
          } 
        />
      
        <Route path='/settings/*' element={<SettingsPage />} />
        
      {/* </Route> */}
      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
