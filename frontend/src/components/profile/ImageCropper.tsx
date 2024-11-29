import { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCancel: () => void;
  onCrop: (blob: Blob) => void;
}

export function ImageCropper({ image, onCancel, onCrop }: ImageCropperProps) {
  const cropperRef = useRef<Cropper>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onCrop(blob);
        }
      }, 'image/png');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">裁剪头像</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={true}
            viewMode={1}
            dragMode="move"
            autoCropArea={1}
            background={false}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleCrop}>
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}