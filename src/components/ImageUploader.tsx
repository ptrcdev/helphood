"use client";

import { useState } from "react";

type ImageUploaderProps = {
  onUpload: (url: string) => void;
};

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setPreviewUrl(data.secure_url);
        onUpload(data.secure_url);
      } else {
        console.error("Upload error", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {uploading && <p>Uploading...</p>}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Uploaded Preview"
          className="h-16 w-16 rounded-full object-cover"
        />
      )}
    </div>
  );
}
