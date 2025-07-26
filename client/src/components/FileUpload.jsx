import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile, onFileRemove }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFile && validFile.size <= 50 * 1024 * 1024) { // 50MB limit
      onFileSelect(validFile);
    } else {
      alert('Please select a valid image or video file under 50MB');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024 * 1024) {
      onFileSelect(file);
    } else {
      alert('Please select a file under 50MB');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!selectedFile && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Images and videos up to 50MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>
      )}

      {selectedFile && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedFile.type.startsWith('image/') ? (
                <Image className="h-8 w-8 text-green-500" />
              ) : (
                <Video className="h-8 w-8 text-blue-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onFileRemove}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {selectedFile.type.startsWith('image/') && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;