import { Route, Routes } from "react-router-dom"
import Home from "./pages/login"
import Dashboard from "./pages/dashboard"
import Ceklaporan from "./pages/CPM/ceklaporan"
import Inbox from "./pages/inbox"
import Buatlaporan from "./pages/Mitra/buatlaporan"
// import Manajemenmitra from "./pages/CPM/manajemenmitra"
import Layout from "./pages/layout"
import NotFound from "./pages/notfound"
import Profile from "./pages/profile"
import Forgotpassword from "./pages/forgotpassword"

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
      <Route path='/ceklaporan' element={<Layout><Ceklaporan/></Layout>}/>
      <Route path='/inbox' element={<Layout><Inbox/></Layout>}/>
      <Route path='/buatlaporan' element={<Layout><Buatlaporan/></Layout>}/>
      <Route path='/profile' element={<Layout> <Profile/> </Layout>}/>
      <Route path='/forgotpassword' element={<Forgotpassword/>}/>

      {/* 404 Not Found Page */}
      <Route path='*' element={<NotFound/>}/>
      
    </Routes>
  )
}

export default AppRoutes