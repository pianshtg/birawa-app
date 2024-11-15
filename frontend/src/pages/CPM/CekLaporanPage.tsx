import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { FaCalendarAlt, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Combobox } from '@headlessui/react';
import { id as idLocale } from 'date-fns/locale';
import { PDFViewer } from '@react-pdf/renderer';
import ReportTemplate from './ReportTemplate';

//option dropdown
const options = ['Perusahaan A', 'Perusahaan B', 'Perusahaan C'];

const CekLaporan: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMitra, setSelectedMitra] = useState<string>('');
  const [selectedKontrak, setSelectedKontrak] = useState<string>('');
  const [selectedPekerjaan, setSelectedPekerjaan] = useState<string>('');
  const [showPDF, setShowPDF] = useState(false);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  const getDaysInMonth = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  const handleShowPDF = () => {
    setShowPDF(true);
  };

  return (
    <div className="p-6">
      <div className="text-sm text-gray-500 mb-2">Daftar Mitra / Cek Laporan</div>
      <h1 className="text-2xl font-semibold text-black mb-6">Cek Laporan</h1>

      <div className="bg-white p-4 mb-6 border rounded-md " >
        <div className="flex items-center justify-between">
          <div className="flex items-center text-red-600 font-semibold mb-2">
            <FaCalendarAlt className="mr-2" />
            <span>{format(currentMonth, 'MMMM yyyy', { locale: idLocale })}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="px-1 py-1 text-xl text-red-600 hover:text-red-700">
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button onClick={nextMonth} className="px-1 py-1 text-xl text-red-600 hover:text-red-700">
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-4 pt-4">
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-lg cursor-pointer text-center ${
                format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                  ? 'bg-red-200 text-red-600'
                  : 'text-gray-600'
              }`}
              style={{ minWidth: '40px' }}
            >
              <div>{format(day, 'd')}</div>
              <div className="text-xs text-gray-500">{format(day, 'EEE', { locale: idLocale }).slice(0, 3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form dengan Dropdown */}
      <div className="bg-white p-6 rounded-md border">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <ComboboxComponent
            label="Pilih Mitra"
            placeholder="Nama perusahaan"
            options={options}
            selected={selectedMitra}
            setSelected={setSelectedMitra}
          />
          <ComboboxComponent
            label="Pilih Kontrak"
            placeholder="Nama kontrak"
            options={options}
            selected={selectedKontrak}
            setSelected={setSelectedKontrak}
          />
          <ComboboxComponent
            label="Pilih Pekerjaan"
            placeholder="Nama pekerjaan"
            options={options}
            selected={selectedPekerjaan}
            setSelected={setSelectedPekerjaan}
          />
        </div>

        <div className="text-right">
          <button onClick={handleShowPDF} className="bg-red-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition">
            Tampilkan Laporan
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDF && (
        <div className="pdf-viewer mt-6">
          <PDFViewer width="100%" height="600">
            <ReportTemplate />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

// Komponen untuk membuat Combobox dengan fitur pencarian/filter
const ComboboxComponent: React.FC<{
  label: string;
  placeholder: string;
  options: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}> = ({ label, placeholder, options, selected, setSelected }) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
      <Combobox value={selected} onChange={(value) => value && setSelected(value)}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 text-left shadow-sm focus:outline-none focus:ring-0 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-8 text-gray-900 leading-5 focus:ring-0 focus:outline-none"
              displayValue={(option: string) => option}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown className="h-4 w-4 text-gray-500" /> 
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 ? (
              <div className="cursor-default select-none py-2 px-4 text-gray-700">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-red-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <span
                      className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                    >
                      {option}
                    </span>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};

export default CekLaporan;
