import { Route, Routes } from "react-router-dom"
import Home from "./pages/login"
import Dashboard from "./pages/dashboard"
import Ceklaporan from "./pages/ceklaporan"
import Inbox from "./pages/inbox"
import Buatlaporan from "./pages/Mitra/buatlaporan"
import Manajemenmitra from "./pages/CPM/manajemenmitra"
import Layout from "./pages/layout"

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
      <Route path='/ceklaporan' element={<Layout><Ceklaporan/></Layout>}/>
      <Route path='/inbox' element={<Layout><Inbox/></Layout>}/>
      <Route path='/buatlaporan' element={<Layout><Buatlaporan/></Layout>}/>
      <Route path='/' element={<Layout><Manajemenmitra/></Layout>}/>
    </Routes>
  )
}

export default AppRoutes