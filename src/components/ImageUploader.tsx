"use client";

import { useState } from "react";

type ImageUploaderProps = {
  onChange: (file: File | null, previewUrl: string | null) => void;
  children?: React.ReactNode;
};

export default function ImageUploader({ onChange, children }: ImageUploaderProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(file, reader.result as string);
        // Reset the input value so selecting the same file later triggers onChange again
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null, null);
    }
  };

  return (
    <div>
      {/* Custom label to trigger file selection */}
      <label
        htmlFor="image-upload"
        className="cursor-pointer"
      >
        {children ? children : "Upload image"}
      </label>
      {/* Hidden file input */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
