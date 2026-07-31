import React from 'react';
import { FileText, Files, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export default function DocumentCard({ document, onView, onDelete }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FileText className="h-6 w-6" />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <ImageIcon className="h-6 w-6" />;
    return <Files className="h-6 w-6" />;
  };

  const date = new Date(document.uploaded_at);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
          {getIcon(document.original_filename)}
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {document.document_type}
        </span>
      </div>
      
      <div className="flex-1 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={document.title || document.original_filename}>
          {document.title || document.original_filename}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={document.description || "No description provided"}>
          {document.description || "No description provided"}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{date.toLocaleDateString()}</span>
          <span>{formatFileSize(document.file_size)}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 text-xs" 
            icon={ExternalLink}
            onClick={() => onView(document.document_id)}
          >
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
            onClick={() => onDelete(document.document_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
