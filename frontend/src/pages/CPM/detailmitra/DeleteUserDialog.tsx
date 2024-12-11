import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User } from '@/types';
import LoadingButton from '@/components/LoadingButton';

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  user: User | null
  isLoading: boolean
}

const DeleteUserDialog = ({ isOpen, onClose, user, onSubmit, isLoading }: Props) => {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus User</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {user ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit(); // Call the onSubmit function with user.email
              }}
            >
              <p className="text-center">
                Apakah Anda yakin ingin menghapus: <br /><strong>{user.nama_lengkap}<br/>{user.email}</strong>
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" type="button" onClick={onClose}>
                  Batal
                </Button>
                {isLoading ? 
                  <LoadingButton/>
                  :
                  <Button className="bg-red-500 text-white" type="submit">
                    Hapus
                  </Button>
                }
              </div>
            </form>
          ) : (
            <p>User tidak ditemukan.</p>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;