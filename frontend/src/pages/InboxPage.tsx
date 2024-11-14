import React, { useState, useRef } from 'react';
import { Mail, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  company: string;
  date: string;
  title: string;
  subject: string;
  preview: string;
  content: string;
  sender: string;
  time: string;
  replies?: {
    id: number;
    sender: string;
    content: string;
    time: string;
    senderEmail: string;
    isAdmin: boolean;
  }[];
}

const InboxComponent: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Ref for the reply section
  const replyRef = useRef<HTMLDivElement>(null);

  const messages: Message[] = [
    {
      id: 1,
      company: "PT. Bangun Negeri Selalu",
      date: "27/09/2024",
      title: "Perubahan Privacy Policy",
      subject: "Tidak Bisa Upload Foto pada Form Buat Laporan",
      preview: "Saya tidak bisa upload foto pada buat lapor...",
      content: "Tidak bisa upload foto pada buat laporan. Mohon bantuan untuk kendala ini.",
      sender: "bangunnegeriselalu.co.id",
      time: "Rabu, 27 Sep",
      replies: [
        {
          id: 1,
          sender: "Admin CPM1",
          senderEmail: "admincpm@telkomproperty.co.id",
          content: "Mohon maaf kami sedang mengalami kendala teknis. Tim kami sedang bekerja untuk memperbaiki masalah ini secepatnya.",
          time: "Rabu, 27 Sep",
          isAdmin: true
        },
        {
          id: 2,
          sender: "Admin CPM1",
          senderEmail: "admincpm@telkomproperty.co.id",
          content: "Kami sedang memeriksa masalah ini lebih lanjut. Mohon menunggu update dari kami.",
          time: "Kamis, 28 Sep",
          isAdmin: true
        },
        {
          id: 3,
          sender: "Admin CPM1",
          senderEmail: "admincpm@telkomproperty.co.id",
          content: "Update: Masalah sedang dalam proses perbaikan.",
          time: "Jumat, 29 Sep",
          isAdmin: true
        },
        {
          id: 4,
          sender: "Admin CPM1",
          senderEmail: "admincpm@telkomproperty.co.id",
          content: "Update: Masalah sedang dalam proses perbaikan.",
          time: "Jumat, 29 Sep",
          isAdmin: true
        }
      ]
    }
  ];

  const recipients = ["PT. Bangun Negeri Selalu", "PT. Maju Jaya Sejahtera", "PT. Sukses Bersama"];

  const handleReplyClick = () => {
    setShowReply(true);
    // Scroll to the reply section
    setTimeout(() => {
      replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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
                ${selectedMessage?.id === message.id ? 'bg-gray-200 border-l-4 border-red-500' : ''} 
                hover:bg-gray-100 hover:border-l-4 hover:border-red-500`}
              onClick={() => {
                setSelectedMessage(message);
                setShowNewMessage(false);
                setShowReply(false);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                  BNS
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{message.company}</h3>
                  <p className="text-sm text-gray-500">{message.subject}</p>
                  <p className="text-xs text-gray-400">{message.preview}</p>
                  <p className="text-xs text-gray-400 mt-1">{message.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3 p-6">
        {selectedMessage && !showNewMessage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selectedMessage.subject}</h2>
              <button
                onClick={() => {
                  setShowNewMessage(true);
                  setSelectedMessage(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Pesan Baru +
              </button>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm flex-shrink-0">
                  BNS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{selectedMessage.company}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{selectedMessage.time}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleReplyClick}
                  className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg space-x-2 bg-white hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Balas</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto h-[505px] custom-scrollbar px-1">
              {selectedMessage.replies?.map((reply) => (
                <div key={reply.id} className="bg-opacitynav p-6 rounded-lg ml-12">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm flex-shrink-0">
                      CP1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{reply.sender}</p>
                      <p className="text-xs text-gray-500 mb-2">Kepada: {selectedMessage.sender}</p>
                      <p className="text-sm text-gray-600">{reply.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{reply.time}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Reply Section at the end of the replies */}
              {showReply && (
                <div ref={replyRef} className="bg-white p-4 rounded-lg border ml-12">
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
          </div>
        )}

        {showNewMessage && (
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="mb-4">
              <div className="flex items-center space-x-2 relative mb-4">
                <p className="text-sm text-gray-600">Kepada:</p>
                <div className="relative w-full">
                  <div 
                    className="w-full p-2 border rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span>{selectedRecipient || "Pilih penerima"}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient}
                          className="p-2 hover:bg-red-50 cursor-pointer text-sm"
                          onClick={() => {
                            setSelectedRecipient(recipient);
                            setShowDropdown(false);
                          }}
                        >
                          {recipient}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                className="w-full p-2 border rounded-lg text-sm"
                placeholder="Subjek"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
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
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
