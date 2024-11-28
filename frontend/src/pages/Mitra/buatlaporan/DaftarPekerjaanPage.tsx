import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useGetMitraKontraks } from '@/api/MitraApi'
import { getAccessToken } from '@/lib/utils'
import { jwtDecode } from 'jwt-decode'
import { Kontrak } from '@/types'

type TableFormattedPekerjaan = {
  nama_kontrak: string
  nomor_kontrak: string
  nama_pekerjaan: string
  lokasi_pekerjaan: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const DaftarPekerjaan = () => {
  const accessToken = getAccessToken()
  let metaData: { nama_mitra?: string } = {}
  if (typeof accessToken === 'string' && accessToken.trim() !== '') {
    try {
      metaData = jwtDecode(accessToken)
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }

  const navigate = useNavigate()
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(5)
  const [tableData, setTableData] = useState<TableFormattedPekerjaan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { mitraKontraks, isLoading: isMitraKontraksLoading } = useGetMitraKontraks(metaData.nama_mitra, {
    enabled: !!metaData.nama_mitra,
  })

  const fetchKontrakPekerjaans = async (namaMitra: string, nomorKontrak: string) => {
    const response = await fetch(`${API_BASE_URL}/api/kontrak/pekerjaans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web',
      },
      body: JSON.stringify({ nama_mitra: namaMitra, nomor_kontrak: nomorKontrak }),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch pekerjaan for kontrak.')
    }
    return response.json()
  }

  useEffect(() => {
    const fetchData = async () => {
      if (mitraKontraks?.mitra_kontraks?.length) {
        setIsLoading(true)
        const allData: TableFormattedPekerjaan[] = []

        await Promise.all(
          mitraKontraks.mitra_kontraks.map(async (kontrak: Kontrak) => {
            try {
              const { kontrak_pekerjaans } = await fetchKontrakPekerjaans(metaData.nama_mitra!, kontrak.nomor)
              kontrak_pekerjaans.forEach((pekerjaan: any) => {
                allData.push({
                  nama_kontrak: kontrak.nama,
                  nomor_kontrak: kontrak.nomor,
                  nama_pekerjaan: pekerjaan.nama,
                  lokasi_pekerjaan: pekerjaan.lokasi,
                })
              })
            } catch (error) {
              console.error(`Error fetching pekerjaan for kontrak ${kontrak.nomor}:`, error)
            }
          })
        )

        setTableData(allData)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [mitraKontraks, metaData.nama_mitra])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return tableData.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, itemsPerPage, tableData])

  const totalPages = Math.ceil(tableData.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setSelectedRow(null) // Reset selection when changing pages
    }
  }

  const handleCheckboxChange = (index: number) => {
    setSelectedRow(index === selectedRow ? null : index)
  }

  const handleBuatLaporanClick = () => {
    if (selectedRow !== null) {
      const selectedJob = paginatedData[selectedRow]
      navigate('/daftarpekerjaan/buatlaporan', {
        state: {
          nama_kontrak: selectedJob.nama_kontrak,
          nomor_kontrak: selectedJob.nomor_kontrak,
          nama_pekerjaan: selectedJob.nama_pekerjaan,
        },
      })
    }
  }

  return (
    <div className="py-8 lg:p-8 flex-1 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Buat Laporan</h1>

      <div className="bg-white p-6 border rounded-lg">
        {isLoading || isMitraKontraksLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Pilih Pekerjaan</h2>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="text-sm mr-2">Tampilkan</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1) // Reset to first page
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm mr-6"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>

                <button
                  onClick={handleBuatLaporanClick}
                  disabled={selectedRow === null}
                  className={`px-12 py-1 rounded font-semibold ${
                    selectedRow !== null ? 'bg-primary text-white' : 'bg-gray-300 text-black cursor-not-allowed'
                  }`}
                >
                  Buat Laporan
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-separate border-spacing-0">
                <thead className="bg-slate-200 text-left">
                  <tr className="text-left bg-slate-200">
                    <th className="p-4 font-medium border-b"></th>
                    <th className="p-4 font-medium border-b">Nama Kontrak</th>
                    <th className="p-4 font-medium border-b">Nomor Kontrak</th>
                    <th className="p-4 font-medium border-b">Nama Pekerjaan</th>
                    <th className="p-4 font-medium border-b">Lokasi Pekerjaan</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((pekerjaan, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border-b">
                        <input
                          type="checkbox"
                          checked={selectedRow === index}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td className="p-4 text-sm font-normal border-b">{pekerjaan.nama_kontrak}</td>
                      <td className="p-4 text-sm font-normal border-b">{pekerjaan.nomor_kontrak}</td>
                      <td className="p-4 text-sm font-normal border-b">{pekerjaan.nama_pekerjaan}</td>
                      <td className="p-4 text-sm font-normal border-b">{pekerjaan.lokasi_pekerjaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600 w-52">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DaftarPekerjaan
