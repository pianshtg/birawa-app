import React, { useState } from 'react';
import { Accordion } from '@/components/custom/atom/Accordion';
import { ShadowContainer } from '@/components/custom/atom/ShadowContainer';
import { Button } from '@/components/ui/button';

export default function TambahMitraPage() {
  // State to manage the list of jobs


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tambah Mitra</h1>

      <Accordion title='Informasi Mitra'>
        <ShadowContainer 
          titleNeeded={false}
          buttonNeeded={false}>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Perusahaan</label>
                <input type="text" placeholder='Nama Perusahaan' className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Perusahaan</label>
                <input type="text" placeholder='Alamat Perusahaan' className="w-full border rounded p-2 " />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon Perusahaan</label>
                <input type="text" placeholder='Ketik Disini' className="w-full border rounded p-2 " />
              </div>
            </div>
          </div>
        </ShadowContainer>
      </Accordion>

      <Accordion title='Detail Kontrak'>
        <ShadowContainer 
          titleNeeded={false}
          buttonNeeded={false}>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Kontrak</label>
                <input type="text" placeholder='Ketik di sini' className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Kontrak</label>
                <input type="text" placeholder='Ketik di sini' className="w-full border rounded p-2 " />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nilai Kontrak</label>
                <input type="text" placeholder='Ketik di sini' className="w-full border rounded p-2 " />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Kontrak</label>
                <input type="text" placeholder="DD/MM/YYYY" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jangka Waktu</label>
                <input type="text" placeholder='Ketik di sini' className="w-full border rounded p-2" />
              </div>
            </div>

            {/* Button for adding a new job */}
            <div className="w-full flex justify-end mt-4">
              <Button
                className="bg-red-600 text-white p-2 rounded">
                Tambah Pekerjaan
              </Button>
            </div>

            {/* Table for Pekerjaan and Lokasi */}
            <div className="w-full mt-4 border-t">
              <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm  m-3 border rounded-md">
                  <thead>
                    <tr className='bg-slate-200'>
                      <th className="p-4">Pekerjaan</th>
                      <th className="p-4">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr >
                      <td className=" p-4">Belum ada pekerjaan yang ditambah</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ShadowContainer>
      </Accordion>

      <Accordion title='Akun Mitra'>
        <ShadowContainer 
          titleNeeded={false}
          buttonNeeded={false}>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input type="text" placeholder='Ketik Disini' className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                <div className="flex border rounded">
                  <span className="flex items-center px-2 border-r">+62</span>
                  <input type="text" placeholder="Nomor Telepon" className="w-full p-2 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="text" placeholder='Ketik Disini' className="w-full border rounded p-2 " />
              </div>         
            </div>
          </div>
        </ShadowContainer>
      </Accordion>
    </div>
  );
}
