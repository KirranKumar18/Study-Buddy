import { useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { toast } from "sonner";

interface FileUploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export const FileUploadZone = ({ files, onChange }: FileUploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      const validFiles = droppedFiles.filter((file) => {
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 50MB)`);
          return false;
        }
        return true;
      });

      onChange([...files, ...validFiles]);
    },
    [files, onChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8" />;
    if (file.type.includes("pdf")) return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer"
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept=".pdf,.txt,.md,.docx,.jpg,.png"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-semibold mb-1">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground">
            PDF, TXT, DOCX, MD, JPG, PNG (max 50MB each)
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-accent/10 rounded-lg"
            >
              <div className="text-primary">{getFileIcon(file)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-smooth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
