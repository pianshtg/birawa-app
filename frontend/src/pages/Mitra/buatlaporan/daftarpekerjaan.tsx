import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DaftarPekerjaan: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const navigate = useNavigate();

  const jobData = [
    { id: "P-001", name: "Pasang Plafon", location: "Batam Centrum", contract: "Pekerjaan MEP", lastUpdate: "25/10/2024" },
    { id: "P-002", name: "Instalasi Listrik", location: "Jakarta Selatan", contract: "Pekerjaan Elektro", lastUpdate: "15/09/2024" },
    { id: "P-003", name: "Pengecatan Dinding", location: "Surabaya Timur", contract: "Pekerjaan Interior", lastUpdate: "02/10/2024" },
    { id: "P-004", name: "Pemasangan AC", location: "Bandung Kota", contract: "Pekerjaan HVAC", lastUpdate: "08/11/2024" },
    { id: "P-005", name: "Perbaikan Pipa", location: "Medan Barat", contract: "Pekerjaan Plumbing", lastUpdate: "20/08/2024" }
  ];
  
  const handleCheckboxChange = (index: number) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleBuatLaporanClick = () => {
    if (selectedRow !== null) {
      // Navigate with the selected job data as state
      navigate('/buatlaporan', { state: jobData[selectedRow] });
    }
  };

  return (
    <div className="p-8 flex-1 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Pilih Pekerjaan</h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm mr-2">Tampilkan</label>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm mr-6">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <button
              onClick={handleBuatLaporanClick}
              disabled={selectedRow === null}
              className={`px-12 py-1 rounded font-semibold ${
                selectedRow !== null ? 'bg-indigo-700 text-white' : 'bg-gray-300 text-black cursor-not-allowed'
              }`}
            >
              Buat Laporan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-4 border-b"></th>
                <th className="p-4 border-b">ID Pekerjaan</th>
                <th className="p-4 border-b">Nama Pekerjaan</th>
                <th className="p-4 border-b">Lokasi Pekerjaan</th>
                <th className="p-4 border-b">Asal Kontrak</th>
                <th className="p-4 border-b">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {jobData.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedRow === index}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="p-4 border-b">{job.id}</td>
                  <td className="p-4 border-b">{job.name}</td>
                  <td className="p-4 border-b">{job.location}</td>
                  <td className="p-4 border-b">{job.contract}</td>
                  <td className="p-4 border-b">{job.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarPekerjaan;
