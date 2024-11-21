import Accordion from '@/components/custom/atom/Accordion'
import ShadowContainer from '@/components/custom/atom/ShadowContainer'
import DialogCustom from '@/forms/buat-laporan-form/DialogCustom'
export default function CuacaSection() {
  return (
    <Accordion title='Tahap 3: Cuaca'>
       <ShadowContainer title="Cuaca"
          buttonName="Tambah Data Cuaca"
          Dialogtitle="Setting Cuaca"
          DialogDesc={
            <DialogCustom
              type="weather"
              onSubmit={() => console.log("Data saved")}
            />
          }>
          <table className="min-w-full text-sm text-center  mb-6 border rounded-md">
            <thead className='bg-slate-200'>
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Cuaca</th>
                <th className="p-4">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">Pagi</td>
                <td className="p-4">Tidak Hujan</td>
                <td className="p-4">-</td>
              </tr>
              <tr>
                <td className="p-4">Siang</td>
                <td className="p-4">Tidak Hujan</td>
                <td className="p-4">-</td>
              </tr>
              <tr>
                <td className="p-4">Sore</td>
                <td className="p-4">Hujan</td>
                <td className="p-4">15:15 - 17:50</td>
              </tr>
              <tr>
                <td className="p-4">Malam</td>
                <td className="p-4">Gerimis</td>
                <td className="p-4">17:59 - 22:00 </td>
              </tr>
            </tbody>
          </table>

          <table className="min-w-full text-sm text-center  border rounded-md">
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
  )
}
