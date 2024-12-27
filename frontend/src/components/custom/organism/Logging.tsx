import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetLogs } from '@/api/LogApi';
import LoadingScreen from '@/components/LoadingScreen';

const Logging = () => {
  
  const {logs, isLoading} = useGetLogs();
  const logData = logs?.logs

  const [selectedDate, setSelectedDate] = useState('');
  const [filteredLogs, setFilteredLogs] = useState(logData || []);

  function handleFilterLogs () {
    const newFilteredLogs = logData.filter((log: any) => {
      if (!selectedDate) return true;
      const logDate = log.created_at.split('T')[0];
      return logDate === selectedDate;
    });
    setFilteredLogs(newFilteredLogs);
  };
  
  useEffect(() => {
    if (logData) {
      setFilteredLogs(logData)
    }
  }, [logData]);
  
  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <div className='flex flex-col gap-y-7'>
      <div className='p-3'>
        <h1 className="text-2xl font-semibold mb-2">Logging Viewer</h1>
        <div className="flex gap-x-2 mb-4">
          <div className='space-x-2'>
            <label htmlFor="caritanggal" className="text-sm font-medium text-gray-500">Cari Berdasarkan Tanggal</label>
              <input
                type="date"
                id="caritanggal"
                name="caritanggal"
                className="appearance-none border rounded-md w-fit py-2 px-3 text-gray-700 leading-tight"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
          </div>
          <div className='w-fit'>
            <Button onClick={handleFilterLogs} type='button' >Cari</Button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className='bg-gray-200'>
              <tr>
                <th className="py-2 px-4 border-b text-center text-black font-semibold">User</th>
                <th className="py-2 px-4 border-b text-center text-black font-semibold">Waktu</th>
                <th className="py-2 px-4 border-b text-center text-black font-semibold">Data</th>
                <th className="py-2 px-4 border-b text-center text-black font-semibold">Perubahan</th>
                <th className="py-2 px-4 border-b text-center text-black font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-100 truncate">
                    <td className="py-2 text-sm px-4 border-b text-gray-700 text-center">{log.email}</td>
                    <td className="py-2 text-sm px-4 border-b text-gray-700 text-center">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-2 text-sm px-4 border-b text-gray-700 text-center tracking-[1px]">{log.nama_tabel.toUpperCase()}</td>
                    <td className="py-2 text-sm px-4 border-b text-gray-700 text-left max-w-[200px] truncate">{JSON.stringify(log.perubahan)}</td>
                    <td className="py-2 text-sm px-4 border-b text-gray-700 text-center">{log.aksi.toUpperCase().substr(0, 3)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">{logData.length > 0 ? 'No logs found.' : 'No logs found for the selected date.'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logging;
