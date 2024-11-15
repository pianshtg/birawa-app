import React from 'react';
import { IoAdd } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ShadowProps {
  title?: string;
  buttonName?: string;
  buttonNeeded? : boolean;
  titleNeeded? :boolean;
  Dialogtitle? : string;
  DialogDesc?:React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void; // Correct type for an onClick function
}

export const ShadowContainer: React.FC<ShadowProps> = ({ title, children, buttonName, buttonNeeded =true, titleNeeded=true, onClick ,Dialogtitle,DialogDesc }) => {
  return (
    <div className="m-3 border rounded-md">
      <div className={`flex px-4  justify-between  w-full ${titleNeeded ? "border-b py-2" : ""}`}>
        <h3 className="text-lg font-semibold">{title}</h3>
         {buttonNeeded ? 
           <Dialog>
           <DialogTrigger className="hover:text-primary duration-200 ease-in-out flex items-center gap-x-2 text-xs font-semibold">{buttonName} <IoAdd size={18} /></DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>{Dialogtitle}</DialogTitle>
               <DialogDescription>
                {DialogDesc}
               </DialogDescription>
             </DialogHeader>
           </DialogContent>
         </Dialog>
          :
          <></>
        }
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default ShadowContainer;
