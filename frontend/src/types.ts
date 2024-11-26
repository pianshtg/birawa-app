export type Mitra = {
    id?: string,
    nama: string,
    nomor_telepon: string,
    alamat: string
}

export type Kontrak = {
    nama: string,
    nomor: string,
    tanggal: string,
    nilai: number,
    jangka_waktu: number
}

export type Pekerjaan = {
    nama: string,
    lokasi: string
}

export type User = {
    email: string,
    nama_lengkap: string,
    nomor_telepon: string ,
    is_verified:number,
    is_active:number,
}

export type Shift = {
    nama: string,
    waktu_mulai: string,
    waktu_berakhir: string
}

export type TenagaKerja = {
    tipe: string,
    peran: string,
    jumlah: number
}

export type Dokumentasi = {
    deskripsi: string
}

export type Aktivitas = {
    tipe: string,
    nama: string,
    dokumentasi: Dokumentasi[]
}

export type Laporan = {
    id: string,
    tanggal: string
}