export type Pekerjaan = {
    nama: string,
    lokasi: string
}

export type TenagaKerja = {
    tipe: string,
    peran: string,
    jumlah: number,
}

export type Dokumentasi = {
    deskripsi: string
}

export type Aktivitas = {
    tipe: string,
    nama: string,
    dokumentasi: Dokumentasi[]
}

export type Cuaca = {
    tipe: string,
    waktu: string,
    waktu_mulai: string,
    waktu_berakhir: string,
}