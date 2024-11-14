import React, { useState } from 'react';
import { Accordion } from '@/components/custom/atom/Accordion';
import { ShadowContainer } from '@/components/custom/atom/ShadowContainer';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import DialogCustom from '@/components/custom/organism/DialogCustom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Buatlaporan() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    navigate('/daftarpekerjaan'); // Navigate to "Daftar Pekerjaan" page
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    navigate('/daftarpekerjaan'); // Navigate to "Daftar Pekerjaan" page on confirmation
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan untuk {jobData?.name}</h1>
      
      <Accordion title="Tahap 1: Tenaga Kerja">
        <ShadowContainer 
          title="Tenaga Kerja"  
          buttonName="Tentukan Shift" 
          Dialogtitle="Tambah Shift"
          DialogDesc={
            <DialogCustom
              type="shift"
              onSubmit={() => console.log("Data saved")}
            />
          }>
          {/* Manajemen Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-md mb-2">Manajemen</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Manager</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Engineer</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Project</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Drafter</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Manager</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
            </div>
          </div>
        </ShadowContainer>

        <ShadowContainer 
          title='Lapangan' 
          buttonName='Tambah Pekerjaan Baru'
          Dialogtitle='Role Pekerjaan Baru' 
          DialogDesc={
            <DialogCustom
              type="role"
              onSubmit={() => console.log("Data saved")}
            />
          }>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sipil</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Arsitektur</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Furniture</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mekanikal</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2 text-center" />
              </div>
            </div>
          </div>
        </ShadowContainer>
      </Accordion>

      <Accordion title="Tahap 2: Aktivitas">
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
          <table className="min-w-full text-center text-sm bg-content m-3 border rounded-md">
            <thead>
              <tr>
                <th className="p-4">Nama Aktivitas</th>
                <th className="p-4">Tipe Pekerjaan</th>
                <th className="p-4">Bukti</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
          </table>
        </ShadowContainer>
      </Accordion>

      <Accordion title="Tahap 3: Cuaca">
        <ShadowContainer title="Cuaca"
          buttonName="Tambah Data Cuaca"
          Dialogtitle="Setting Cuaca"
          DialogDesc={
            <DialogCustom
              type="weather"
              onSubmit={() => console.log("Data saved")}
            />
          }>
          <table className="min-w-full text-sm text-center bg-content mb-6 border rounded-md">
            <thead>
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Cuaca</th>
                <th className="p-4">Keterangan</th>
              </tr>
            </thead>
          </table>

          <table className="min-w-full text-sm text-center bg-content border rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4">Waktu</th>
                <th className="p-4">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">Pagi</td>
                <td className="p-4">06:00 - 11:59</td>
              </tr>
              <tr>
                <td className="p-4">Siang</td>
                <td className="p-4">12:00 - 14:59</td>
              </tr>
              <tr>
                <td className="p-4">Sore</td>
                <td className="p-4">15:00 - 17:59</td>
              </tr>
              <tr>
                <td className="p-4">Malam</td>
                <td className="p-4">18:00 - 22:00</td>
              </tr>
            </tbody>
          </table>
        </ShadowContainer>
      </Accordion>

      <div className="flex justify-start space-x-4 mt-6">
        
        <div className='w-1/2'>
          <Button type="button" onClick={handleCancel} className="border border-gray-400 text-black bg-white hover:bg-gray-100 px-6 ">
            Batal
          </Button>
        </div>
        <Button type="button" onClick={handleOpenDialog} className='bg-primary w-full ease-in-out duration-150 text-white hover:bg-red-700 font-semibold py-2 px-4 rounded focus:outline-none'>
          Buat Laporan
        </Button>
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-center'>Buat Laporan?</DialogTitle>
              <DialogDescription>
                <div className='py-8 text-center'>
                  <p>Apakah anda sudah yakin, bahwa laporan yang anda masukan benar?</p>
                </div>
                <div className='flex gap-x-2'>
                  <div className='w-1/2'>
                    <Button type="button" onClick={handleDialogCancel} variant="outline">
                      Batal
                    </Button>
                  </div>
                  
                  <div className='w-1/2'>
                    <Button type="button" onClick={handleConfirm} className="bg-Merah2 text-white hover:bg-primary px-6">
                      Iya, Saya Yakin
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
