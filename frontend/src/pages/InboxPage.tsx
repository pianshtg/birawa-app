import { useState, useRef, useEffect,useMemo} from 'react';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/Combobox';
import { formatDate, formatMitraInitials, getAccessToken } from "@/lib/utils"
import { CustomJwtPayload, Inbox, Mitra } from "@/types"
import { jwtDecode } from "jwt-decode"
import { Search } from 'lucide-react';
import { useCreateInbox, useGetInbox, useGetInboxes } from '@/api/InboxApi';
import { useGetMitras } from '@/api/MitraApi';
import LoadingButton from '@/components/LoadingButton';
import LoadingScreen from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';
import { HiOutlineInbox } from "react-icons/hi"
import { useGetUser } from '@/api/UserApi';

const InboxComponent = () => {
  
  const {toast} = useToast()
  
  const accessToken = getAccessToken()
  let metaData: CustomJwtPayload = { user_id: '', permissions: [] };

  if (typeof accessToken === 'string' && accessToken.trim() !== '') {
    try {
      metaData = jwtDecode<CustomJwtPayload>(accessToken)
    } catch (error) {
      return
    }
  } else {
    return
  }
  
  const isAdmin = metaData.nama_mitra ? false : true
  
  
  const messageFormSchema = z.object({
    nama_mitra: isAdmin ? z.string().min(1, "Nama mitra wajib diisi").max(50, "Nama mitra terlalu panjang") : z.string().max(50, "Nama mitra terlalu panjang").optional(),
    email_receiver: isAdmin ? z.string().optional() : z.string().email("Email tidak valid"),
    subject:  z.string().min(1, "Judul wajib diisi").max(50, "Judul terlalu panjang"),
    content: z.string().min(1, "Pesan wajib diisi").max(256, "Pesan terlalu panjang"),
  })
  
  const {createInbox, isLoading: isCreateInboxLoading, isSuccess: isSuccessCreatingInbox, error: isErrorCreatingInbox} = useCreateInbox()
  
  const [selectedInbox, setSelectedInbox] = useState<string>("");
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedMitra, setSelectedMitra] = useState<string>("")
  const [isChatOpened, setIsChatOpened] = useState<boolean>(false)
  
  const messageForm = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      nama_mitra: isAdmin ? selectedMitra : undefined,
      email_receiver: isAdmin ? undefined : 'birawaprj@gmail.com',
      subject: "",
      content: ""
    }
  })
  
  const {allMitra, isLoading: isMitraLoading} = useGetMitras({enabled: isAdmin})
  const mitra_options = allMitra?.mitras?.map((mitra: Mitra) => ({value: mitra.nama, label: mitra.nama}));
  
  const {inboxes, isLoading: isInboxesLoading, refetch: refetchInboxes} = useGetInboxes(isAdmin ? selectedMitra : metaData.nama_mitra, {enabled: isAdmin ? !!selectedMitra : true})
  const mitraInboxes = inboxes?.inboxes

  const {inboxMessages, isLoading: isInboxMessagesLoading, refetch: refetchInboxMessages} = useGetInbox({nama_mitra: isAdmin ? selectedMitra : metaData.nama_mitra, subject: selectedInbox}, {enabled: isAdmin ? !!selectedMitra && !!selectedInbox : !!selectedInbox})
  const mitraInboxMessages = inboxMessages?.inboxMessages
  
  const {user} = useGetUser()
  const currentUser = user?.user

  const repliesContainerRef = useRef<HTMLDivElement>(null);

  // Ref for the reply section
  const replyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isCreateInboxLoading) {
      <LoadingScreen/>
    }
  }, [isCreateInboxLoading])
  
  useEffect(() => {
    if (isSuccessCreatingInbox) {
      toast({
        title: "Inbox berhasil dikirim!",
        variant: "success",
      });
      refetchInboxes()
      if (!showReply) {
        setSelectedInbox('')
        setIsChatOpened(false)
      } else {
        refetchInboxMessages()
      }
    }
  }, [isSuccessCreatingInbox]);
  
  useEffect(() => {
    if (isErrorCreatingInbox) {
      toast({
        title: isErrorCreatingInbox.toString(),
        variant: "danger",
      });
    }
  }, [isErrorCreatingInbox]);
  
  useEffect(() => {
    messageForm.setValue('nama_mitra', selectedMitra)
    setSelectedInbox('')
  }, [selectedMitra])
  
  useEffect(() => {
    if (showNewMessage) {
      messageForm.setValue('subject', '')
    }
  }, [showNewMessage])
  
  useEffect(() => {
    if (selectedInbox) {
      messageForm.setValue('subject', selectedInbox)
    }
  }, [selectedInbox])
  
  useEffect(() => {
    if (repliesContainerRef.current) {
      repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
    }
  }, [mitraInboxMessages, showReply]);
  

   // Ensure filteredInboxes is always an array
   const filteredInboxes = useMemo(() => {
    if (!mitraInboxes || mitraInboxes.length === 0) return [];
    
    return mitraInboxes.filter((inbox: Inbox) => 
      inbox.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mitraInboxes]);
  
  function handleOpenChat(subject: string) {
    if (selectedInbox === subject) {
      // If the same inbox is clicked again, close the chat
      setIsChatOpened(false);
      setSelectedInbox('');
    } else {
      // If a different inbox is clicked, open the chat and set the new subject
      setSelectedInbox(subject);
      setIsChatOpened(true);
    }
    setShowNewMessage(false);
  }

  function handleReplyClick () {
    setShowReply(true);
    // Scroll to the reply section
    setTimeout(() => {
      replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  async function onSubmitReply(data: {content: string}) {
    try {
      const payload = {
        nama_mitra: isAdmin ? selectedMitra : undefined,
        email_receiver: isAdmin ? undefined : 'birawaprj@gmail.com',
        subject: selectedInbox,
        content: data.content
      }
      await createInbox(payload)
      messageForm.setValue('content', '');
    } catch (error) {
      return
    }
  }
  
  async function onSubmitNewMessage (data: {subject: string, content: string}) {
    try {
      
      const inbox_subjects = mitraInboxes.map((inbox: Inbox) => inbox.subject)
      
      if (inbox_subjects.includes(data.subject)) {
        toast({
          title: "Subject already exists!",
          variant: 'danger'
        })
        return
      }
      
      const datafull = await createInbox({
        ...data,
        nama_mitra: isAdmin ? selectedMitra : undefined,
        email_receiver: isAdmin ? undefined : 'birawaprj@gmail.com'
      })
      messageForm.reset()
    } catch (error) {
      return
    }
  };
  
  function getDateLabel(date: string): string {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (messageDate.toDateString() === today.toDateString()) {
      return "Hari Ini";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return messageDate.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }  
  
  if (isInboxesLoading || isInboxMessagesLoading) {
    return <LoadingScreen/>
  }
  
  return (
    <div className="relative flex h-[93vh]">
      {/* Inbox Bar */}
      <div className="w-1/3 border-r bg-white rounded-l-md">
        <div className="p-4 border-b space-y-4">
          <div className='flex w-full items-center justify-between'>
            <h2  className="font-bold text-lg">{mitraInboxes?.length} Percakapan </h2>
            <button
              onClick={() => {
                setShowNewMessage(true)
                setIsChatOpened(false)
                setShowReply(false)
              }}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 ${showNewMessage && 'hidden'}`}
            >
              Buat Pesan Baru 
            </button>
          </div>
          {isAdmin ? (  
            <div className='flex flex-col-reverse items-center gap-4'>
              <div className='w-full'>
                <div className="relative w-full">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={selectedMitra ? "Cari judul inbox" : "Silahkan pilih mitra terlebih dahulu"}
                    className="border p-2 placeholder:text-sm rounded-md pl-8 w-full"
                  />
                  <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className='w-full'>
                <Combobox
                    placeholder="Pilih Mitra..."
                    options={mitra_options || []}
                    selected={selectedMitra || ""}
                    setSelected={setSelectedMitra}
                    isLoading={isMitraLoading}
                  />
              </div>
            </div>
          ) : (
            <div className='w-full'>
              <div className="relative w-full">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Subjudul..."
                  className="border p-2 placeholder:text-sm rounded-md pl-8 w-full"
                  />
                  <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div> 
          )
          }
        </div>
        <div className={`divide-y overflow-y-auto max-h-[35em] custom-scrollbar ${ filteredInboxes.length === 0 && "flex flex=c items-center justify-center h-[50vh]"}`}>
        {(!selectedMitra && isAdmin ) ? (
          <div className="text-center text-gray-500 p-4">
            Pilih Mitra Dahulu...
          </div>
        ) : (
          filteredInboxes && filteredInboxes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <HiOutlineInbox size={36} color='grey'/>
              <h2 className="text-xl font-semibold text-gray-600">
                Inbox Kosong
              </h2>
              <p className="text-gray-500 text-sm">
                Tidak ada pesan untuk mitra yang dipilih
              </p>
            </div>
          ) : (
            filteredInboxes?.map((inbox: Inbox) => (
              <div
                key={inbox.subject}
                className={`p-4 cursor-pointer transition-all duration-100 ease-in-out 
                  ${selectedInbox === inbox.subject && isChatOpened ? 'bg-gray-200 border-l-4 border-l-red-500' : ''} 
                  hover:bg-gray-100 hover:border-l-4 hover:border-l-red-500`}
                onClick={() => handleOpenChat(inbox.subject)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1 truncate">
                    <h3 className="font-medium text-sm">{inbox.subject}</h3>
                    <p className="text-sm text-gray-500 truncate">{inbox.last_message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(inbox.created_at!)}</p>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
      </div>
      {/* Inbox Messages */}
      <div className="relative w-2/3 p-6 bg-white rounded-r-md overflow-y-auto">
        {/* Chat */}
        {selectedInbox && isChatOpened && mitraInboxMessages && (
          <div className="flex flex-col h-full"> {/* Parent container */}
            {/* Header Section */}
            <div className="flex-none h-auto px-4 py-2 border-b">
              <h2 className="text-lg font-bold text-black">
                {selectedInbox.toLocaleUpperCase()}
              </h2>
            </div>

            {/* Chat Messages Section */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-2"
              ref={repliesContainerRef}
            >
              {mitraInboxMessages.map((message: Inbox, index: number) => {
                const isOutgoing = message.sender_email === currentUser.email;
                const prevMessage = mitraInboxMessages[index - 1];

                const currentDate = new Date(message.created_at!).toDateString();
                const prevDate = prevMessage ? new Date(prevMessage.created_at!).toDateString() : null;
                const isFirstMessageOfDay = currentDate !== prevDate;

                const isFirstFromUser =
                  !prevMessage || prevMessage.sender_email !== message.sender_email;

                return (
                  <div key={message.created_at}>
                    {/* Date Capsule */}
                    {isFirstMessageOfDay && (
                      <div className="flex justify-center items-center my-4">
                        <span className="px-4 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                          {getDateLabel(message.created_at!)}
                        </span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex ${isOutgoing ? 'justify-end' : ''} items-start`}>
                      <div className={`flex items-start ${isFirstFromUser && 'mt-3'}`}>
                        {/* Avatar */}
                        {!isOutgoing && (
                          <div
                            className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm border border-gray-400 flex-shrink-0 mr-3 ${
                              !isFirstFromUser && 'opacity-0'
                            }`}
                          >
                            {formatMitraInitials(message.sender_nama_lengkap!)}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`relative rounded-md p-2 shadow-md max-w-xs overflow-visible min-w-[200px] ${
                            isOutgoing
                              ? 'bg-red-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {!isOutgoing && isFirstFromUser && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">
                                {message.sender_nama_lengkap}{' '}
                              </p>
                              <p className="font-regular text-[10px] mt-[-4px]">
                                {message.sender_nama_mitra || 'Admin CPM'}
                              </p>
                            </div>
                          )}
                          <p className={`text-sm break-words ${isFirstFromUser && !isOutgoing && 'mt-2'}`}>
                            {message.content}
                          </p>
                          <p
                            className={`text-xs text-gray-400 mt-0 text-right`}
                          >
                            {new Date(message.created_at!).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {/* Tail */}
                          {isFirstFromUser && (
                            <div
                              className={`absolute w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] rounded-full ${
                                isOutgoing
                                  ? 'border-l-transparent border-r-red-200 border-b-red-100 top-[0px] right-[-8px] rotate-[315deg]'
                                  : 'border-l-gra-100 border-r-transparent border-b-gray-100 top-[0px] left-[-8px] rotate-[45deg]'
                              }`}
                              style={{
                                borderTop: 'none', // Ensure the top border is removed
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Section */}
            <div
              className={`flex-none transition-all duration-300 h-auto py-2`}
            >
              {!showReply ? (
                <div className="flex justify-end px-4">
                  <button
                    onClick={handleReplyClick}
                    className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg space-x-2 bg-white hover:bg-red-50"
                  >
                    <span>Balas</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600 rotate-180 mt-[1px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border">
                  <Form {...messageForm}>
                    <form onSubmit={messageForm.handleSubmit(onSubmitReply)}>
                      <FormField
                        control={messageForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pesan Balasan Anda</FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                placeholder="Tulis pesan..."
                                rows={3}
                                className="appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 min-h-[40px] max-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => setShowReply(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-sm text-sm hover:bg-red-400"
                        >
                          Batalkan
                        </button>
                        {isCreateInboxLoading ? (
                          <LoadingButton />
                        ) : (
                          <Button type="submit" variant="destructive" className="w-fit">
                            Kirim
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </div>
        )}

        
        {/* Form Pesan Baru */}
        {showNewMessage && (
          <div className="p-6 border rounded-lg ">
            <div className="mb-4">
              <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onSubmitNewMessage)} className="space-y-4">
                  {isAdmin && (
                    <FormField
                      control={messageForm.control}
                      name="nama_mitra"
                      render={() => (
                        <FormItem>
                          <FormLabel>Kepada:</FormLabel>
                          <Combobox
                            placeholder="Pilih Mitra..."
                            options={mitra_options || []}
                            selected={selectedMitra || ""}
                            setSelected={setSelectedMitra}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={messageForm.control}
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
                    control={messageForm.control}
                    name="content"
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
                    
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowNewMessage(false)}
                      className={`px-4 py-2 bg-red-500 text-white rounded-sm text-sm hover:bg-red-400 ${!showNewMessage && 'hidden'}`}
                    >
                      Batalkan 
                    </button>
                    {isCreateInboxLoading ? <div className="w-1/3"><LoadingButton/></div> : (  
                      <Button type="submit" variant="destructive" className='w-fit'>
                        Kirim
                      </Button>
                    )}
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