// import { useCreateMitra } from '@/api/MitraApi'
import BuatLaporanForm from '@/forms/buat-laporan-form/BuatLaporanForm';


export default function BuatLaporanPages() {
  
//   const {createMitra, isLoading} = useCreateMitra()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan ...</h1>
      <BuatLaporanForm
        // onSubmit={createMitra}
        // isLoading={isLoading}
      />
    </div>
  );
}