import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastErrorMessage(msg: string) {
  toast.error(msg || "Something went wrong. Please try again.");
  console.log("error occured: ", msg);
}

export function toastSuccessMessage(msg: string) {
  toast.success(msg || "Sucess");
  console.log("sucess: ", msg);
}

export function formatDate(date: string | Date) {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export function formatDateWithTime(date: string | Date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  const time = formatDate(d);
  return `${day} ${month} ${year}, ${time}`;
}
