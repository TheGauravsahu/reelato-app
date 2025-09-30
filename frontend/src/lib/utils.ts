import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastErrorMessage(msg: string) {
  toast.error(msg || "Something went wrong. Please try again.");
  console.log("error occured: ", msg);
}

export function toastSuccessMessage(msg: string) {
  toast.success(msg || "Sucess");
  console.log("sucess: ", msg);
}