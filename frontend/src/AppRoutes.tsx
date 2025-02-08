import { Route, Routes } from "react-router-dom"
import {Suspense, lazy} from "react"
import useDetection from "@/hooks/useDetection"
import LoadingScreen from "./components/LoadingScreen"
const Home = lazy(() => import("@/pages/LoginPage"))
const Dashboard = lazy(() => import("@/pages/DashboardPage"))
const CekLaporan = lazy(() => import("@/pages/CekLaporanPage"))
const Inbox = lazy(() => import("@/pages/InboxPage"))
const NotFound = lazy(() => import("@/pages/NotFoundPage"))
const ForgotPassword = lazy(() => import("@/pages/ForgotPasswordPage"))
const Layout = lazy(() => import("@/components/custom/layout/Layout"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))
const MobilePage = lazy(() => import("@/pages/MobilePage"))
const DaftarPekerjaan = lazy(() => import("@/pages/Mitra/buatlaporan/DaftarPekerjaanPage"))
const TambahMitraPage = lazy(() => import("@/pages/CPM/tambahmitra/TambahMitraPage"))
const ProtectedRoute = lazy(() => import("@/auth/ProtectedRoute"))
const DaftarMitraPage = lazy(() => import("@/pages/CPM/tambahmitra/DaftarMitraPage"))
const MitraDetailPage = lazy(() => import("@/pages/CPM/detailmitra/MitraDetailPage"))
const BuatLaporanPage = lazy(() => import("@/pages/Mitra/buatlaporan/BuatLaporanPage"))

function AppRoutes() {
  const isMobile = useDetection(620)

  if (isMobile) {
    return (
      <Suspense fallback={<LoadingScreen/>}>
        <Routes>
          <Route path="*" element={<MobilePage />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Shared Routes (Admin & Mitra) */}
        <Route element={<ProtectedRoute roles={["admin", "mitra"]} />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/ceklaporan"
            element={
              <Layout>
                <CekLaporan />
              </Layout>
            }
          />
          <Route
            path="/inbox"
            element={
              <Layout>
                <Inbox />
              </Layout>
            }
          />
          <Route path="/settings/*" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route
            path="/daftarmitra"
            element={
              <Layout>
                <DaftarMitraPage />
              </Layout>
            }
          />
          <Route
            path="/daftarmitra/detailmitra/:nama_mitra"
            element={
              <Layout>
                <MitraDetailPage />
              </Layout>
            }
          />
          <Route
            path="daftarmitra/tambahmitra"
            element={
              <Layout>
                <TambahMitraPage />
              </Layout>
            }
          />
        </Route>

        {/* Mitra Routes */}
        <Route element={<ProtectedRoute roles={["mitra"]} />}>
          <Route
            path="/daftarpekerjaan"
            element={
              <Layout>
                <DaftarPekerjaan />
              </Layout>
            }
          />
          <Route
            path="/daftarpekerjaan/buatlaporan"
            element={
              <Layout>
                <BuatLaporanPage />
              </Layout>
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
