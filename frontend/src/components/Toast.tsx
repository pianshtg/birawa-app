import successImage from '../assets/success.png';
import cancelImage from '../assets/BirawaLogo.png'; // Gambar untuk tipe cancel
import infoImage from '../assets/react.svg';     // Gambar untuk tipe info

type ToastProp = {
  type: 'success' | 'cancel' | 'info'; // Batasi tipe hanya pada tiga opsi ini
  title: string;
  content: string;
}

export default function Toast({ type, title, content }: ToastProp) {

  // Tentukan warna dan gambar berdasarkan tipe
  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          color: '#4147D5', // warna untuk success
          image: successImage,
        };
      case 'cancel':
        return {
          color: '#D54141', // warna untuk cancel
          image: cancelImage,
        };
      case 'info':
        return {
          color: '#41D5D5', // warna untuk info
          image: infoImage,
        };
    }
  };

  const { color, image } = getToastStyle();

  return (
    <div className='fixed top-4 right-6 w-60 h-16 rounded-[6px]'>
      <div className='relative flex items-center gap-3 w-full h-full shadow-lg overflow-hidden'>
        {/* Bagian warna berdasarkan tipe */}
        <div className='w-10 h-full rounded-l-[6px]' style={{ backgroundColor: color }}></div>
        
        {/* Bagian gambar */}
        <div className='w-14 h-full flex items-center justify-center'>
          <img src={image} alt={type} className='w-8/12' />
        </div>

        {/* Bagian teks */}
        <div className='w-full flex flex-col justify-center'>
          <div className='font-semibold text-lg'>{title}</div>
          <div className='font-medium text-xs'>{content}</div>
        </div>
      </div>
    </div>
  )
}
