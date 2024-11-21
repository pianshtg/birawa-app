import { useCreateMitra } from '@/api/MitraApi'
import TambahMitraForm from '@/forms/tambah-mitra-form/TambahMitraForm'

export default function TambahMitraPage() {
  
  const {createMitra, isLoading} = useCreateMitra()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tambah Mitra</h1>
      <TambahMitraForm
        onSubmit={createMitra}
        isLoading={isLoading}
      />
    </div>
  );
}