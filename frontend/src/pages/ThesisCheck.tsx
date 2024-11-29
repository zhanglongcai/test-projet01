import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export default function ThesisCheck() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError('');

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('只支持PDF或Word文档格式');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('文件大小不能超过15MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    
    if (!droppedFile) return;

    if (!ALLOWED_TYPES.includes(droppedFile.type)) {
      setError('只支持PDF或Word文档格式');
      return;
    }

    if (droppedFile.size > MAX_FILE_SIZE) {
      setError('文件大小不能超过15MB');
      return;
    }

    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('thesis', file);

      const response = await fetch('/api/thesis/check', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const { reportId } = await response.json();
      navigate(`/thesis/report/${reportId}`);
    } catch (err) {
      setError('文件上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">论文查重</h1>
          <p className="mt-2 text-gray-600">
            支持PDF和Word格式，文件大小不超过15MB
          </p>
        </div>

        <div 
          className="mt-8 p-8 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="flex justify-center">
              {file ? (
                <FileText className="h-12 w-12 text-blue-500" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="mt-4">
              {file ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-700 font-medium focus:outline-none"
                  >
                    点击上传
                  </button>
                  <span className="text-gray-500"> 或拖拽文件到这里</span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center text-red-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? '正在上传...' : '开始查重'}
          </Button>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900">查重说明</h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• 支持PDF和Word格式的论文文档</li>
            <li>• 文件大小限制为15MB</li>
            <li>• 查重结果包含总体查重率和具体重复内容分析</li>
            <li>• 查重范围包括互联网公开资源和学术数据库</li>
            <li>• 预计查重时间为5-10分钟</li>
          </ul>
        </div>
      </div>
    </div>
  );
}