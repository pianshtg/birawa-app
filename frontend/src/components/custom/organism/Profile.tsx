import React, { useState } from 'react';
import FormField from '../moleculs/FormField';
import Button from '../atom/Button';

const Profile = () => {
  // State untuk data final (yang sudah tersimpan)
  const [email, setEmail] = useState<string>('example@company.com');
  const [address, setAddress] = useState<string>('Jl. Sabar Raya Aselole Kutilang No. 3');
  const [phone, setPhone] = useState<string>('087214812485');

  // State untuk data sementara (saat mode edit)
  const [tempEmail, setTempEmail] = useState<string>(email);
  const [tempAddress, setTempAddress] = useState<string>(address);
  const [tempPhone, setTempPhone] = useState<string>(phone);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = () => {
    if (isEditing) {
      // Tampilkan alert jika membatalkan perubahan saat mode edit
      alert("Halaman di muat ulang. Data Di hilangkan");
      // Batalkan perubahan dan reset data sementara ke data final
      setTempEmail(email);
      setTempAddress(address);
      setTempPhone(phone);
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan perubahan dari temp ke final
    setEmail(tempEmail);
    setAddress(tempAddress);
    setPhone(tempPhone);
    setIsEditing(false);
  };

  return (
    <div className='flex flex-col gap-y-7'>
      <div className='border-b-2 flex justify-between border-gray-200 p-3'>
        <div>
          {isEditing ? 
            <>
              <h1 className="text-2xl font-semibold mb-2">Edit Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Perbarui data perusahaan anda disini</p>
            </> 
          :
            <>
              <h1 className="text-2xl font-semibold mb-2">Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Data perusahaan anda</p>
            </>
          }
        </div>
        <div className='w-fit flex items-center'>
          <Button type='button' onClick={handleEditClick}>
            {isEditing ? "Batal" : "Edit"}
          </Button>
        </div>
      </div>
      {/* Container Form Edit */}
      <form onSubmit={handleSave} className='space-y-4'>
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
          <Button type='submit' IsDisabled={!isEditing}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
