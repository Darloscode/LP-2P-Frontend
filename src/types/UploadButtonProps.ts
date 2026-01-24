import { FileData } from "./FileData";

// SÍ SE USA NUEVO
export interface UploadButtonProps {
  onFileSelected?: (fileData: FileData) => void;
  accept?: string;
  label?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
}
