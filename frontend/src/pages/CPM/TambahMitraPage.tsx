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

export default function TambahMitraPage() {
  return (
    <div>
       <h1 className="text-2xl font-semibold mb-6">Tambah Mitra</h1>

       <Accordion title='Informasi Mitra'>
       <ShadowContainer 
          titleNeeded={false}
          buttonNeeded={false}>
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
       </Accordion>
    </div>
  )














}
