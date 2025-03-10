import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distInKm = R * c;
  return parseFloat(distInKm.toFixed(2));
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function getPostedTimeAgo(time: Date) {
  const timeDifference = Math.abs(new Date(time).getTime() - Date.now());

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

export async function uploadFile(file: File): Promise<string> {
  // Create a unique reference for this file
  const storageRef = ref(storage, `profile-images/${Date.now()}-${file.name}`);
  
  // Start the file upload
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  // Return a promise that resolves with the download URL when the upload completes
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error("Error uploading file:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
