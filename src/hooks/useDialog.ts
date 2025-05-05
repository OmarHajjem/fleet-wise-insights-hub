
import { useState } from "react";

type DialogType = 'add' | 'edit' | 'view' | 'delete' | 'confirm' | 'custom';

interface UseDialogResult {
  dialogType: DialogType | null;
  dialogData: any;
  isDialogOpen: boolean;
  openDialog: (type: DialogType, data?: any) => void;
  closeDialog: () => void;
}

export const useDialog = (): UseDialogResult => {
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  const [dialogData, setDialogData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (type: DialogType, data?: any) => {
    setDialogType(type);
    setDialogData(data);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Réinitialiser après une courte période pour permettre l'animation de fermeture
    setTimeout(() => {
      setDialogType(null);
      setDialogData(null);
    }, 300);
  };

  return {
    dialogType,
    dialogData,
    isDialogOpen,
    openDialog,
    closeDialog
  };
};
