'use client';

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface SingleImageDropzoneProps {
  width?: number;
  height?: number;
  className?: string;
  disabled?: boolean;
  onChange: (file?: File) => void;
  value?: File;
}

export function SingleImageDropzone({
  width,
  height,
  className,
  disabled,
  onChange,
  value
}: SingleImageDropzoneProps) {
  const [preview, setPreview] = useState<string>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    onChange(acceptedFiles[0]);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
  });

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-center",
        isDragActive && "bg-blue-50",
        disabled && "cursor-default opacity-60",
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative aspect-video w-full">
          <Image
            src={preview}
            alt="Preview"
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          Drop your image here, or click to select
        </div>
      )}
    </div>
  );
}