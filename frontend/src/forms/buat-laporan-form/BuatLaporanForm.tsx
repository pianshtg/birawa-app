import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
// import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TenagaKerjaSection from "./TenagaKerjaSection";
import AktivitasSection from "./AktivitasSection";
import CuacaSection from "./CuacaSection";

const formSchema = z.object ({

    tenaga_kerja_arr : z.array(
        z.object({
            tipe: z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
            peran: z.string().min(1, "Peran wajib diisi").max(50, "Peran wajib dipilih"),
            jumlah: z.coerce.number().min(1, "Jumlah wajib diisi").max(50, "Jumlah maksimal 50")
        })
    ),

    aktivitas_arr: z.array(
        z.object({
            tipe: z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
            nama: z.string().min(1,"Nama Aktivitas wajib diisi").max(50,"Lokasi pekerjaan terlalu panjang"),
            dokumentasi : z.array(
                z.object({
                    deskripsi:z.string().min(1,"Nama Aktivitas wajib diisi").max(50,"Lokasi pekerjaan terlalu panjang"),
                })
            )
        })
    ).nonempty("Tolong masukkan minimal 1 aktivitas."),

    cuaca_arr : z.array(
        z.object({
            waktu:z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
            tipe:z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
            waktu_mulai:z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
            waktu_berakhir:z.string().min(1,"Nama Pekerjaan wajib diisi").max(50,"Nama pekerjaan terlalu panjang"),
        })
    )
})

type buatLaporanFormData = z.infer<typeof formSchema>

export default function BuatLaporanForm() {

    const form = useForm<buatLaporanFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            tenaga_kerja_arr:[
                {
                    tipe:"manajemen",
                    peran:"project manager",
                    jumlah: 0                
                },  
                {
                    tipe:"manajemen",
                    peran:"site engineer",
                    jumlah: 0                
                },  
                {
                    tipe:"manajemen",
                    peran:"admin project",
                    jumlah: 0                
                },  
                {
                    tipe:"manajemen",
                    peran:"drafter",
                    jumlah: 0                
                },  
                {
                    tipe:"manajemen",
                    peran:"site manager",
                    jumlah: 0                
                },   
                {
                    tipe:"lapangan",
                    peran:"pekerja sipil",
                    jumlah: 0                
                },
                {
                    tipe:"lapangan",
                    peran:"pekerja arsitektur",
                    jumlah: 0                
                },
                {
                    tipe:"lapangan",
                    peran:"pekerja furniture",
                    jumlah: 0                
                },
                {
                    tipe:"lapangan",
                    peran:"pekerja mekanikal",
                    jumlah: 0                
                }
            ],
            aktivitas_arr:[],
            cuaca_arr:[]
        }
    })

    const handlesubmit = (formdata:buatLaporanFormData) => {
        console.log(formdata);
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(handlesubmit)}>
            <TenagaKerjaSection/>
            <AktivitasSection/>
            <CuacaSection/>

            <div className='w-full flex items-center gap-x-3 '>
                    <Button type='reset' className='w-1/3' variant="outline" asChild >
                        <Link to="/daftarmitra">Back</Link>
                    </Button>
                    {/* {isLoading ? 
                            <div className="w-1/3"><LoadingButton/></div> 
                        : 
                            <Button type='submit' className='w-2/3'>Submit</Button>
                    } */}
                    <Button type='submit' className='w-2/3'>Submit</Button>
            </div>
        </form>
    </Form>
  )
}
