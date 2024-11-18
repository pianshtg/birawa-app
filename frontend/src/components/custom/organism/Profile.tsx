import React, { useState } from 'react';
import FormField from '../moleculs/FormField';
import { Button } from '@/components/ui/button';

const Profile = () => {
    // State untuk Profil Anda
    const [fullName, setFullName] = useState<string>('John Doe');
    const [personalEmail, setPersonalEmail] = useState<string>('john.doe@example.com');
    const [personalPhone, setPersonalPhone] = useState<string>('081234567890');
  
    const [tempFullName, setTempFullName] = useState<string>(fullName);
    const [tempPersonalEmail, setTempPersonalEmail] = useState<string>(personalEmail);
    const [tempPersonalPhone, setTempPersonalPhone] = useState<string>(personalPhone);
  
    const [isEditingPersonal, setIsEditingPersonal] = useState<boolean>(false);

  // State untuk Profil Perusahaan
  const [email, setEmail] = useState<string>('example@company.com');
  const [address, setAddress] = useState<string>('Jl. Sabar Raya Aselole Kutilang No. 3');
  const [phone, setPhone] = useState<string>('087214812485');

  const [tempEmail, setTempEmail] = useState<string>(email);
  const [tempAddress, setTempAddress] = useState<string>(address);
  const [tempPhone, setTempPhone] = useState<string>(phone);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditCompany = () => {
    if (isEditing) {
      setTempEmail(email);
      setTempAddress(address);
      setTempPhone(phone);
    }
    setIsEditing((prev) => !prev);
  };

  const handleEditPersonal = () => {
    if (isEditingPersonal) {
      setTempFullName(fullName);
      setTempPersonalEmail(personalEmail);
      setTempPersonalPhone(personalPhone);
    }
    setIsEditingPersonal((prev) => !prev);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail(tempEmail);
    setAddress(tempAddress);
    setPhone(tempPhone);
    setIsEditing(false);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setFullName(tempFullName);
    setPersonalEmail(tempPersonalEmail);
    setPersonalPhone(tempPersonalPhone);
    setIsEditingPersonal(false);
  };

  return (
    <div className='flex flex-col gap-y-7'>
      {/* Profil Anda */}
      <div className='border-b-2 flex justify-between border-gray-200 p-3'>
        <div>
          {isEditingPersonal ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Edit Profil Anda</h1>
              <p className='text-sm font-medium text-gray-500'>Perbarui data pribadi anda disini</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">Profil Anda</h1>
              <p className='text-sm font-medium text-gray-500'>Data pribadi anda</p>
            </>
          )}
        </div>
        <div className='w-fit flex items-center'>
          <Button type='button' onClick={handleEditPersonal}>
            {isEditingPersonal ? "Batal" : "Edit"}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSavePersonal} className='space-y-4'>
        <div className="p-3 border-b-2 border-gray-200">
          <FormField
            label="Nama Lengkap"
            type="text"
            id="full-name"
            value={isEditingPersonal ? tempFullName : fullName}
            IsHorizontal={true}
            onChange={(e) => setTempFullName(e.target.value)}
            placeholder="John Doe"
            readonly={!isEditingPersonal}
          />
        </div>
        <div className='p-3 border-b-2 border-gray-200'>
          <FormField
            label="Email"
            type="text"
            id="personal-email"
            value={isEditingPersonal ? tempPersonalEmail : personalEmail}
            IsHorizontal={true}
            onChange={(e) => setTempPersonalEmail(e.target.value)}
            placeholder="john.doe@example.com"
            readonly={!isEditingPersonal}
          />
        </div>
        <div className='p-3 border-b-2 border-gray-200'>
          <FormField
            label="Nomor Telephone"
            type="text"
            id="personal-phone"
            value={isEditingPersonal ? tempPersonalPhone : personalPhone}
            IsHorizontal={true}
            onChange={(e) => setTempPersonalPhone(e.target.value)}
            placeholder="081234567890"
            readonly={!isEditingPersonal}
          />
        </div>
        <div className='flex justify-end p-3 w-fit'>
          <Button type='submit'>Simpan</Button>
        </div>
      </form>

      {/* Profil Perusahaan */}
      <div className='border-b-2 flex justify-between border-gray-200 p-3'>
        <div>
          {isEditing ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Edit Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Perbarui data perusahaan anda disini</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Data perusahaan anda</p>
            </>
          )}
        </div>
        <div className='w-fit flex items-center'>
          <Button type='button' onClick={handleEditCompany}>
            {isEditing ? "Batal" : "Edit"}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSaveCompany} className='space-y-4'>
        <div className="p-3 border-b-2 border-gray-200">
          <FormField
            label="Nama Perusahaan"
            type="text"
            id="company-name"
            value={isEditing ? tempEmail : email}
            IsHorizontal={true}
            onChange={(e) => setTempEmail(e.target.value)}
            placeholder="PT Ayam Bongkar Sejahtera"
            readonly={!isEditing}
          />
        </div>
        <div className='p-3 border-b-2 border-gray-200'>
          <FormField
            label="Alamat Perusahaan"
            type="text"
            id="company-address"
            value={isEditing ? tempAddress : address}
            IsHorizontal={true}
            onChange={(e) => setTempAddress(e.target.value)}
            placeholder="Jl. Sabar Raya Aselole Kutilang No. 3"
            readonly={!isEditing}
          />
        </div>
        <div className='p-3 border-b-2 border-gray-200'>
          <FormField
            label="Nomor Telephone"
            type="text"
            id="company-phone"
            value={isEditing ? tempPhone : phone}
            IsHorizontal={true}
            onChange={(e) => setTempPhone(e.target.value)}
            placeholder="087214812485"
            readonly={!isEditing}
          />
        </div>
        <div className='flex justify-end p-3 w-fit'>
          <Button type='submit'>Simpan</Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
