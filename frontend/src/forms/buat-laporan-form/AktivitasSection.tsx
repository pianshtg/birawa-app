// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
import { useFormContext } from 'react-hook-form'
import Accordion from '@/components/custom/atom/Accordion'
import { EditIcon,DeleteIcon } from 'lucide-react'
import DialogCustom from '@/forms/buat-laporan-form/DialogCustom'
import ShadowContainer from '@/components/custom/atom/ShadowContainer'

export default function AktivitasSection() {
  const {control} = useFormContext()
  return (
    <Accordion title="Tahap 2 : Aktivitas">
        <ShadowContainer 
          title="Aktivitas" 
          buttonName="Tambah Aktivitas Baru"
          Dialogtitle='Tambah Aktivitas Baru'
          DialogDesc={
            <DialogCustom
              type="activity"
              onSubmit={() => console.log("Data saved")}
            />
          }>
          <table className="min-w-full text-center text-sm  m-3 border rounded-md">
            <thead>
              <tr className='bg-slate-200'>
                <th className="p-4">Tipe Pekerjaan</th>
                <th className="p-4">Nama Aktivitas</th>
                <th className="p-4">Bukti</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">Pekerjaan Sipil</td>
                <td className="p-4">Ciptakan Semen</td>
                <td className="p-4">Bukti</td>
                <td className="p-4 flex items-center justify-center">
                    <div className="flex gap-x-2" >
                        <div className="flex justify-center items-center p-1.5  cursor-pointer rounded-full hover:bg-gray-200">
                          <EditIcon color="blue" size={18} className=" " />
                        </div>
                        <div className="flex justify-center items-center p-1.5  cursor-pointer rounded-full hover:bg-gray-200">
                          <DeleteIcon color="red" size={18} />
                        </div>
                    </div>
                </td>
              </tr>
            </tbody>
          </table>
        </ShadowContainer>
    </Accordion>
  )
}
