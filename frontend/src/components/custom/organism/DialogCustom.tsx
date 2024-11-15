

interface DialogCustomProps {
  type: 'shift' | 'role' | 'weather' | 'activity';
  onSubmit: () => void;
}

export default function DialogCustom({ type, onSubmit }: DialogCustomProps) {
  return (
    <div>
      <div>
        {type === 'shift' && (
          <div className="flex space-x-10">
            <div>
              <label className="block text-sm font-semibold mb-2">Shift</label>
              <div className="flex space-x-4 mb-4">
                {/* Shift buttons with static styles, no state for selection */}
                <button className="px-4 py-2 rounded border  bg-opacitynav text-black  hover:bg-primary hover:text-white">
                  Shift 1
                </button>
                <button className="px-4 py-2 rounded border  bg-opacitynav text-black  hover:bg-primary hover:text-white">
                  Shift 2
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Pukul</label>
              <div className="flex space-x-4">
                <div>
                  <label className="text-xs text-gray-600">Mulai</label>
                  <div className="flex items-center space-x-3 mt-1">
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-center  bg-opacitynav"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Berakhir</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-center  bg-opacitynav"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'role' && (
          <div>
            <label className="block text-sm font-medium mb-2">Nama Pekerjaan</label>
            <input type="text" placeholder="Masukkan nama Pekerjaan" className="w-full border rounded p-2 mb-4" />
          </div>
        )}

        {type === 'weather' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Pilih Cuaca</label>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-opacitynav text-primary hover:bg-indigo-200">
                  Gerimis
                </button>
                <button className="px-4 py-2 bg-opacitynav text-primary hover:bg-indigo-200">
                  Hujan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Pilih Waktu</label>
              <div className="flex space-x-4">
                <div>
                  <label className="text-xs text-gray-600">Mulai</label>
                  <input
                    type="time"
                    className="border p-2 rounded w-full text-center  mt-1 bg-opacitynav"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Berakhir</label>
                  <input
                    type="time"
                    className="border p-2 rounded w-full text-center  mt-1 bg-opacitynav"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'activity' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Kategori Pekerjaan</label>
                <select className="border p-2 rounded w-full">
                  <option>Pilih Kategori Pekerjaan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Deskripsi Pekerjaan</label>
                <input type="text" placeholder="Masukan Detail Pekerjaan" className="border p-2 rounded w-full" />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm">Foto Sebelum</label>
                <input type="file" className="border p-2 rounded w-full" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">Foto Sesudah</label>
                <input type="file" className="border p-2 rounded w-full" />
              </div>
            </div>
          </div>
        )}
        
      </div>

      

      <button onClick={onSubmit} className="w-full mt-6 bg-Merah2 text-white font-semibold py-2 rounded">
        Simpan
      </button>
    </div>
  );
}
