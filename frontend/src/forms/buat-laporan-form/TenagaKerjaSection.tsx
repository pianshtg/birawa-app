// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
import { useFormContext } from 'react-hook-form'
import Accordion from '@/components/custom/atom/Accordion'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import DialogCustom from '@/forms/buat-laporan-form/DialogCustom'
import ShadowContainer from '@/components/custom/atom/ShadowContainer'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
// const tenagaKerjaSchema = z.object({
//     tipe: z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
//     peran: z.string().min(1, "Peran wajib diisi").max(50, "Peran wajib dipilih"),
//     jumlah: z.coerce.number().min(1, "Jumlah wajib diisi").max(50, "Jumlah maksimal 50")
//   });


type shiftProps = {
  nama:string,
  waktu_mulai:string,
  waktu_berakhir:string,
}
export default function TenagaKerjaSection() {
  const [shiftInfo, setShiftInfo] = useState("Tentukan Shift"); // Default button name

  const handleAddShift = (shift: shiftProps): void => {
    // Perbarui buttonName dengan data shift
    setShiftInfo(`${shift.nama} ${shift.waktu_mulai} - ${shift.waktu_berakhir}`);
  };

  const {control} = useFormContext()
  return (
    <Accordion title="Tahap 1: Tenaga Kerja">
       
        <div className='space-y-6'>
            {/* Manajemen Section */}
            <ShadowContainer 
              title="Manajemen"  
              buttonName={shiftInfo} // Gunakan state sebagai buttonName 
              Dialogtitle="Tambah Shift"
              DialogDesc={
                <DialogCustom
                  type="shift"
                  onSubmit={handleAddShift} // Kirim fungsi handler ke dialog
                /> 
              }
              >

              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">

                  <FormField
                    control={control}
                    name="tenaga_kerja_arr."
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Project Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="tenaga_kerja_arr."
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Site Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="tenaga_kerja_arr."
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Admin Project</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="tenaga_kerja_arr."
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Drafter</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="tenaga_kerja_arr."
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Site Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                </div>
              </div>
            </ShadowContainer>

            {/* Lapangan Section */}       
            <ShadowContainer 
              title='Lapangan' 
              buttonName='Tambah Pekerjaan Baru'
              Dialogtitle='Role Pekerjaan Baru' 
              DialogDesc={
                <DialogCustom
                  type="role"
                  onSubmit={() => console.log("Data saved")}
                />
              }
            >
              
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={control}
                  name="tenaga_kerja_arr."
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Pekerjaan Sipil</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="tenaga_kerja_arr."
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Pekerjaan Arsitektur</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="tenaga_kerja_arr."
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Pekerjaan Furniture</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="tenaga_kerja_arr."
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Pekerjaan Mekanikal</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan Nama Kontrak" {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>
            </div>
            </ShadowContainer>
        </div>
        
      {/* Button for remember and gave to activity */}
       <div className='flex justify-end my-4 px-3'>
          <Button className='w-1/12'>
            Simpan 
          </Button>
       </div>
    </Accordion>
  )
}
