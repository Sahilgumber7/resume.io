"use client";

import { useState } from "react";

type Props = {
  onFileUrlChange: (fileUrl: string) => void;
};

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({ onFileUrlChange }: Props) => {
  const [file, setFile] = useState(defaultFileState);
  const [error, setError] = useState("");

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (!newFile.name.endsWith(".pdf")) {
      setError("Only PDF files are supported");
      return;
    }
    setError("");
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name: newFile.name, size: newFile.size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile) setNewFile(newFile);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setNewFile(event.target.files[0]);
  };

  const onRemove = () => {
    if (file.fileUrl) URL.revokeObjectURL(file.fileUrl);
    setFile(defaultFileState);
    onFileUrlChange("");
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {!hasFile ? (
        <>
          <p className="mb-2 text-gray-700 font-medium">
            Drag & drop a PDF here, or click to select
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={onInputChange}
            className="cursor-pointer"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="font-semibold text-gray-800">
            {file.name} - {getFileSizeString(file.size)}
          </p>
          <button
            type="button"
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toFixed(1) + " KB";
  } else {
    return fileSizeMB.toFixed(1) + " MB";
  }
};
