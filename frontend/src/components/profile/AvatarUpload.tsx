import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toastManager } from '../../utils/toast-manager';
import { ImageCropper } from './ImageCropper';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<boolean>;
}

export function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleCroppedImage = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);
      const file = new File([croppedBlob], 'avatar.png', { type: 'image/png' });
      const success = await onUpload(file);
      if (success) {
        toastManager.success('头像上传成功');
      }
    } catch (error) {
      toastManager.error(error instanceof Error ? error.message : '头像上传失败');
    } finally {
      setIsUploading(false);
      setCropperOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div {...getRootProps()} className="flex-1">
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="relative"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isDragActive ? (
              '松开上传图片'
            ) : (
              '更换头像'
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
      </p>

      {cropperOpen && cropImage && (
        <ImageCropper
          image={cropImage}
          onCancel={() => {
            setCropperOpen(false);
            setCropImage(null);
          }}
          onCrop={handleCroppedImage}
        />
      )}
    </div>
  );
}