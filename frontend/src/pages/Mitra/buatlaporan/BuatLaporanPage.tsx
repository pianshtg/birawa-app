import { useLocation, useNavigate } from "react-router-dom";
import { useCreateLaporan } from "@/api/LaporanApi";
import BuatLaporanForm from "@/forms/buat-laporan-form/BuatLaporanForm";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function BuatLaporanPage() {
  const {toast} = useToast()
  const { createLaporan, isLoading, isSuccess, error } = useCreateLaporan();
  const location = useLocation();
  const navigate = useNavigate();

  const { nama_mitra, nomor_kontrak, nama_pekerjaan } = location.state || {};

  // Redirect to another page if required location state is missing
  if (!nama_mitra || !nomor_kontrak || !nama_pekerjaan) {
    return (
      <div>
        <p>Data tidak tersedia. Silakan kembali ke halaman sebelumnya.</p>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => navigate("/daftarpekerjaan")}
        >
          Kembali
        </button>
      </div>
    );
  }
  
  async function handleSubmit (formData: FormData) {
    try {

      // Trigger API call
      await createLaporan(formData);

      navigate("/daftarpekerjaan")

    } catch (error) {
      return
    }
  };
  
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Successfully created laporan!",
        variant: 'success'
      })
    }
  }, [isSuccess])
  
  useEffect(() => {
    if (error) {
      toast({
        title: error.toString(),
        variant: 'danger'
      })
    }
  }, [error])
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan</h1>
      <BuatLaporanForm 
        nama_mitra={nama_mitra} 
        nomor_kontrak={nomor_kontrak} 
        nama_pekerjaan={nama_pekerjaan}
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
