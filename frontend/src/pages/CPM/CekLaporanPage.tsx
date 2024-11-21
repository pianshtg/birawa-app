import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Combobox } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PDFViewer } from '@react-pdf/renderer';
import ReportTemplate from './ReportTemplate';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Options dropdown
const options = ['Perusahaan A', 'Perusahaan B', 'Perusahaan C'];

const CekLaporan: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedMitra, setSelectedMitra] = useState<string>('');
  const [selectedKontrak, setSelectedKontrak] = useState<string>('');
  const [selectedPekerjaan, setSelectedPekerjaan] = useState<string>('');
  const [showPDF, setShowPDF] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate all dates in the current month
  const getDaysInMonth = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  const handleShowPDF = () => {
    setShowPDF(true);
  };

  // Navigation for previous and next month
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-black mb-6">Cek Laporan</h1>

      <div className="bg-white p-4 mb-6 border rounded-md">
        <div className="flex items-center justify-between">
          {/* Pop-up Calendar */}
          <div className="flex items-center text-red-600 font-semibold mb-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-start"
              popperClassName="react-datepicker-popper"
              customInput={
                <button className="flex items-center space-x-2 text-red-600 font-semibold">
                  <FaCalendarAlt className="mr-2" />
                  <span>{format(currentMonth, 'MMMM yyyy')}</span>
                </button>
              }
            />
          </div>
          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <TooltipProvider>
              {/* Button for Previous Month */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={prevMonth} className="px-2 py-2 text-xl text-red-600 hover:text-red-700">
                    <FaChevronLeft className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bulan Sebelumnya</p>
                </TooltipContent>
              </Tooltip>

              {/* Button for Next Month */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={nextMonth} className="px-2 py-2 text-xl text-red-600 hover:text-red-700">
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bulan Selanjutnya</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Horizontal Date Navigation */}
        <div className="flex overflow-x-auto gap-x-4 pt-4 custom-scrollbar">
          {daysInMonth.map((day) => {
            const isSelected =
              format(day, 'yyyy-MM-dd') === format(selectedDate || new Date(), 'yyyy-MM-dd');
            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-lg cursor-pointer text-center duration-200 ease-in-out mb-2 ${
                  isSelected
                    ? 'bg-red-200 text-red-600 font-semibold -translate-y-1'
                    : 'text-gray-500 hover:bg-gray-200 font-medium'
                }`}
                style={{ minWidth: '40px' }}
              >
                <div>{format(day, 'd')}</div>
                <div className={`text-xs ${isSelected ? 'text-red-600 font-semibold' : 'text-gray-500 font-medium'}`}>
                  {format(day, 'EEE').slice(0, 3)}
                </div>
              </div>
            );
          })}
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
          <button
            onClick={handleShowPDF}
            className="bg-red-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition"
          >
            Tampilkan Laporan
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDF && (
        <div className="pdf-viewer mt-6">
          <PDFViewer width="100%" height="900">
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
              <div className="cursor-default select-none py-2 px-4 text-gray-700">No results found.</div>
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