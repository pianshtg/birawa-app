import { Route, Routes } from "react-router-dom";
import Home from "./pages/login";
import Dashboard from "./pages/dashboard";
import Ceklaporan from "./pages/CPM/ceklaporan";
import Inbox from "./pages/inbox";
import Buatlaporan from "./pages/Mitra/buatlaporan";
import NotFound from "./pages/notfound";
import Profile from "./pages/profile";
import Forgotpassword from "./pages/forgotpassword";
import ResponsiveLayout from "./pages/responsivelayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/dashboard" element={<ResponsiveLayout><Dashboard /></ResponsiveLayout>} />
      <Route path='/ceklaporan' element={<ResponsiveLayout><Ceklaporan /></ResponsiveLayout>} />
      <Route path='/inbox' element={<ResponsiveLayout><Inbox /></ResponsiveLayout>} />
      <Route path='/buatlaporan' element={<ResponsiveLayout><Buatlaporan /></ResponsiveLayout>} />
      <Route path='/profile' element={<ResponsiveLayout><Profile /></ResponsiveLayout>} />
      <Route path='/forgotpassword' element={<Forgotpassword />} />

      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
