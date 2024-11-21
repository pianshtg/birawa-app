import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox, Transition } from "@headlessui/react";
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


interface Recipient {
  value: string;
  label: string;
}

const formPesanBaruSchema =  z.object({
  recipient: z.string({
    required_error: "Silakan pilih penerima"
  }),
  subject: z.string().min(1, "Subjek wajib diisi").max(42, "Subjek terlalu panjang"),
  message: z.string().min(1, "Pesan wajib diisi").max(110, "Pesan Terlalu Panjang")
});
export type PesanBaruSchema = z.infer<typeof formPesanBaruSchema>

const formPesanBalasanSchema =  z.object({
  reply: z.string().min(1, "Pesan tidak bisa kosong").max(110, "Pesan Terlalu Panjang")
});
export type PesanBalasanSchema = z.infer<typeof formPesanBalasanSchema>

const InboxComponent: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(""); 

  const formPesanBaru = useForm<PesanBaruSchema>({
    resolver: zodResolver(formPesanBaruSchema),
    defaultValues: {
      recipient: "",
      subject: "",
      message: ""
    }
  })

  const formPesanBalasan = useForm<PesanBalasanSchema>({
    resolver: zodResolver(formPesanBalasanSchema),
    defaultValues: {
      reply:""
    }
  })

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
    },
    {
      id: 2,
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

  const recipients: Recipient[] = [
    { value: "", label: "Pilih penerima" },
    ...["PT. Bangun Negeri Selalu", "PT. Maju Jaya Sejahtera", "PT. Sukses Bersama"].map(name => ({
      value: name,
      label: name
    }))
  ];

  const filteredRecipients =
  query === ""
    ? recipients
    : recipients.filter((recipient) =>
        recipient.label.toLowerCase().includes(query.toLowerCase())
      );

  const handleReplyClick = () => {
    setShowReply(true);
    // Scroll to the reply section
    setTimeout(() => {
      replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const onSubmitNewMessage = (data: PesanBaruSchema) => {
    console.log("Data Pesan Baru:", data);
  };
  
  const onSubmitReplyMessage = (data: PesanBalasanSchema) => {
    console.log("Data Balasan:", data);
  };
  return (
    <div className="flex min-h-screen ">
      <div className="w-1/3 border-r bg-white rounded-l-md">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-gray-700">9 Percakapan Aktif</h2>
        </div>
        <div className="divide-y">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 cursor-pointer transition-all duration-100 ease-in-out 
                ${selectedMessage?.id === message.id ? 'bg-gray-200 border-l-4 border-l-red-500' : ''} 
                hover:bg-gray-100 hover:border-l-4 hover:border-l-red-500 `}
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

      <div className="w-2/3 p-6 bg-white rounded-r-md">
        {selectedMessage && !showNewMessage ? (
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
                  <Form {...formPesanBalasan}>
                    <form
                      onSubmit={formPesanBalasan.handleSubmit(onSubmitReplyMessage)}>
                      <FormField
                        control={formPesanBalasan.control}
                        name="reply"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pesan Balasan Anda</FormLabel>
                            <FormControl>
                              <textarea 
                                {...field}
                                placeholder="Tulis pesan..." 
                                rows={6}
                                className= "appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-400focus:ring-4 focus:ring-red-100 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />  
                      
                      <div className="flex justify-end">
                        <Button type="submit" variant="destructive" className='w-fit'>
                          Kirim
                        </Button>
                      </div>

                    </form>
                  </Form>
                  <div className="flex justify-end">     
                </div>
                </div>
              )}
            </div>
          </div>
        )
        :
        <>
         <button
                onClick={() => {
                  setShowNewMessage(true);
                  setSelectedMessage(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 mb-3"
              >
                Pesan Baru +
              </button>
        </>}

        {/* Form Pesan Baru */}
        {showNewMessage && (
          <div className=" shadow-md bg-slate-50/80 p-6 rounded-lg">
            <div className="mb-4">
            <Form {...formPesanBaru}>
                  <form onSubmit={formPesanBaru.handleSubmit(onSubmitNewMessage)} className="space-y-4">
                  <FormField
                  control={formPesanBaru.control}
                  name="recipient"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kepada:</FormLabel>
                    <Combobox
                      value={field.value}
                      onChange={field.onChange}
                      as="div"
                      className="relative"
                    >
                <div className="relative w-full">
                  <Combobox.Input
                    className="w-full border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setShowDropdown(false)}
                    placeholder="Cari penerima..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Combobox.Button>
                </div>

                <Transition
                  show={filteredRecipients.length > 0}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 transform scale-95"
                  enterTo="opacity-100 transform scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 transform scale-100"
                  leaveTo="opacity-0 transform scale-95"
                >
                  <Combobox.Options 
                    className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
                    hidden={!showDropdown}
                    >
                    {filteredRecipients.map((recipient) => (
                      <Combobox.Option
                        key={recipient.value}
                        value={recipient.value}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 px-4 ${
                            active ? "bg-red-100 text-red-900" : "text-gray-900"
                          }`
                        }
                      >
                        {recipient.label}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </Combobox>
              <FormMessage />
            </FormItem>
          )}
        />

                    <FormField
                      control={formPesanBaru.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjek</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan subjek" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formPesanBaru.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesan</FormLabel>
                          <FormControl>
                            <textarea 
                              {...field}
                              placeholder="Tulis pesan..." 
                              rows={6}
                              className= "appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-400focus:ring-4 focus:ring-red-100 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" variant="destructive" className='w-fit'>
                        Kirim
                      </Button>
                    </div>
                  </form>
                </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
