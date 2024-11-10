import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Mail, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  company: string;
  date: string;
  title: string;
  preview: string;
  content: string;
  sender: string;
  time: string;
}

const InboxComponent: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  const messages: Message[] = [
    {
      id: 1,
      company: "PT. Bangun Negeri Selalu",
      date: "27/09/2024",
      title: "Perubahan Privacy Policy",
      preview: "Saya tidak bisa upload foto pada buat lapor...",
      content: "feugiat justo montes mattis velit donec. Egestas dapibus vitae vitae dis at finibus...",
      sender: "admincpm@telkomproperty.co.id",
      time: "07:45",
    },
  ];

  const recipients = ["PT. Bangun Negeri Selalu", "PT. Maju Jaya Sejahtera", "PT. Sukses Bersama"];

  const filteredRecipients =
    query === ''
      ? recipients
      : recipients.filter((recipient) =>
          recipient.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-gray-700">9 Percakapan Aktif</h2>
        </div>
        <div className="divide-y">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 cursor-pointer transition-all duration-200 
                ${selectedMessage === message ? 'bg-gray-200 border-l-4 border-blue-500' : ''} 
                hover:bg-gray-100 hover:bg-opacity-75 hover:shadow-md hover:border-l-4 hover:border-blue-500`}
              onClick={() => {
                setSelectedMessage(message);
                setShowNewMessage(false);
                setShowReply(false);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-black text-sm">
                  BNS
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{message.company}</h3>
                  <p className="text-sm text-gray-500">{message.title}</p>
                  <p className="text-xs text-gray-400">{message.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="font-bold text-lg">
            {showNewMessage ? "KIRIM PESAN BARU" : selectedMessage ? selectedMessage.title : "Inbox"}
          </h2>
          <button
            onClick={() => {
              setShowNewMessage(true);
              setSelectedMessage(null);
              setShowReply(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Pesan Baru +
          </button>
        </div>

        {showNewMessage ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Dari: admincpm@telkomproperty.co.id</p>
              <div className="flex items-center space-x-2 relative">
                <p className="text-sm text-gray-600">Kepada:</p>
                <Combobox value={selectedRecipient} onChange={setSelectedRecipient}>
                  <div className="relative w-full">
                    <div className="relative">
                      <Combobox.Input
                        className="w-full p-2 border rounded-lg text-sm pr-10"
                        placeholder="Pilih penerima"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                        displayValue={(recipient: string) => recipient}
                      />
                      {/* Menambahkan Combobox.Button untuk membuat ikon panah yang dapat diklik */}
                      <Combobox.Button className="absolute inset-y-0 right-2 flex items-center text-gray-500">
                        <ChevronDown size={20} />
                      </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                      {filteredRecipients.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">Tidak ada hasil</div>
                      ) : (
                        filteredRecipients.map((recipient) => (
                          <Combobox.Option
                            key={recipient}
                            value={recipient}
                            className={({ active }: { active: boolean }) =>
                              `cursor-pointer select-none relative px-4 py-2 ${
                                active ? 'bg-blue-500 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {recipient}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>
            </div>
            <textarea
              className="w-full p-3 border rounded-lg text-sm mb-4"
              rows={6}
              placeholder="Tulis pesan..."
            />
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Kirim
              </button>
            </div>
          </div>
        ) : (
          selectedMessage && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg">{selectedMessage.title}</h3>
                <p className="text-xs text-gray-400">{selectedMessage.time}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">{selectedMessage.content}</p>
              <div className="flex justify-start space-x-2">
                <button
                  onClick={() => setShowReply(true)}
                  className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg space-x-2 hover:bg-red-50"
                >
                  <Mail size={16} />
                  <span>Balas</span>
                </button>
              </div>

              {showReply && (
                <div className="mt-4 bg-white p-4 border rounded-lg">
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm mb-4"
                    rows={4}
                    placeholder="Tulis balasan..."
                  />
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Kirim Balasan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
