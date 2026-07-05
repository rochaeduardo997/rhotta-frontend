'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, FileText, Trash2, UploadCloud } from 'lucide-react';
import { cn } from '@src/lib/utils';

export type TFileUploadValue = File;

type TProps = {
  value: TFileUploadValue | undefined;
  onChange: (file: TFileUploadValue | undefined) => void;
  isUploading?: boolean;
  labels: {
    sending: string;
    dragDrop: string;
    justAMoment: string;
    clickToSelect: string;
    readyForAnalysis: string;
    removeFile: string;
  };
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadInput({ value, onChange, isUploading = false, labels }: TProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFileUpload = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    onChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files?.[0]);
  };

  const isFileReady = !!value && !isUploading;

  return (
    <div className="w-full">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={e => handleFileUpload(e.target.files?.[0])} />

      {!isFileReady ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed bg-card px-6 py-14 text-center transition-all',
            dragging ? 'scale-[1.01] border-primary bg-accent/40' : 'border-border hover:border-primary/50 hover:bg-secondary/40'
          )}
        >
          <span className={cn('flex size-14 items-center justify-center rounded-2xl transition-colors', isUploading ? 'bg-accent' : 'bg-secondary')}>
            <UploadCloud className={cn('size-7 text-primary', isUploading && 'animate-bounce')} />
          </span>
          <span>
            <span className="block text-base font-medium text-foreground">{isUploading ? labels.sending : labels.dragDrop}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{isUploading ? labels.justAMoment : labels.clickToSelect}</span>
          </span>
        </button>
      ) : (
        <div className="animate-pop-in flex items-center gap-4 rounded-2xl border-2 border-primary bg-accent/40 p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <FileText className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-base font-medium text-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="truncate">{value.name}</span>
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {formatSize(value.size)} · {labels.readyForAnalysis}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={labels.removeFile}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
