import { Routes, Route } from 'react-router-dom';
import Buatlaporan from './BuatLaporanPage';

const IndexLaporan = () => {
  return (
      <Routes>
        <Route path="buatlaporan" element={<Buatlaporan/>} />
        {/* <Route path="logging" element={<LoggingLayout />} /> */}
      </Routes>
  );
};

export default IndexLaporan;
