import React, { useState, useMemo,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const DaftarPekerjaan: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    // Ambil nilai awal dari localStorage atau gunakan default 1
    const savedItemsPerPage = localStorage.getItem('itemsPerPagePekerjaan');
    return savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 1;
  });
  const navigate = useNavigate();

  const jobData = [
    { id: "P-001", name: "Pasang Plafon", location: "Batam Centrum", contract: "Pekerjaan MEP", lastUpdate: "25/10/2024" },
    { id: "P-002", name: "Instalasi Listrik", location: "Jakarta Selatan", contract: "Pekerjaan Elektro", lastUpdate: "15/09/2024" },
    { id: "P-003", name: "Pengecatan Dinding", location: "Surabaya Timur", contract: "Pekerjaan Interior", lastUpdate: "02/10/2024" },
    { id: "P-004", name: "Pemasangan AC", location: "Bandung Kota", contract: "Pekerjaan HVAC", lastUpdate: "08/11/2024" },
    { id: "P-005", name: "Perbaikan Pipa", location: "Medan Barat", contract: "Pekerjaan Plumbing", lastUpdate: "20/08/2024" }
  ];

  useEffect(() => {
    // Simpan itemsPerPage ke localStorage setiap kali berubah
    localStorage.setItem('itemsPerPagePekerjaan', itemsPerPage.toString());
  }, [itemsPerPage])

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return jobData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, jobData]);

  const totalPages = Math.ceil(jobData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRow(null); // Reset selection when changing pages
    }
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleBuatLaporanClick = () => {
    if (selectedRow !== null) {
      navigate('/daftarpekerjaan/buatlaporan', { state: jobData[selectedRow] });
    }
  };

  return (
    <div className="py-8 lg:p-8 flex-1 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan</h1>
      
      <div className="bg-white p-6 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Pilih Pekerjaan</h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm mr-2">Tampilkan</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm mr-6"
              >
                <option value="1   ">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>
            
            <button
              onClick={handleBuatLaporanClick}
              disabled={selectedRow === null}
              className={`px-12 py-1 rounded font-semibold ${
                selectedRow !== null ? 'bg-primary text-white' : 'bg-gray-300 text-black cursor-not-allowed'
              }`}
            >
              Buat Laporan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-separate border-spacing-0">
            <thead className='bg-slate-200 text-left'>
              <tr className="text-left bg-slate-200">
                <th className="p-4 font-medium border-b"></th>
                <th className="p-4 font-medium border-b">ID Pekerjaan</th>
                <th className="p-4 font-medium border-b">Nama Pekerjaan</th>
                <th className="p-4 font-medium border-b">Lokasi Pekerjaan</th>
                <th className="p-4 font-medium border-b">Asal Kontrak</th>
                <th className="p-4 font-medium border-b">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((job, index) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedRow === index}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="p-4 text-sm font-normal border-b">{job.id}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.name}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.location}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.contract}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shadcn Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 w-52">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default DaftarPekerjaan;