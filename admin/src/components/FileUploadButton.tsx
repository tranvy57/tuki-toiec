import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/api/upload';
import { toast } from 'sonner';

interface FileUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const FileUploadButton = ({
  onUploadSuccess,
  accept = 'audio/*,image/*',
  label = 'Upload',
  variant = 'outline',
  size = 'default',
}: FileUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      console.log('Upload response:', response);
      console.log('Calling onUploadSuccess with URL:', response.url);
      onUploadSuccess(response.url);
      toast.success('Upload thành công!', {
        description: `File ${file.name} đã được tải lên.`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload thất bại', {
        description: 'Không thể tải file lên. Vui lòng thử lại.',
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Đang tải...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {label}
          </>
        )}
      </Button>
    </>
  );
};
