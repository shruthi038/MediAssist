import React, { useState, useEffect } from 'react';
import { getDocuments, uploadDocument, getDocument, deleteDocument } from '../services/api';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentUploadModal from '../components/documents/DocumentUploadModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SkeletonCard from '../components/common/SkeletonCard';
import { FilePlus, Search, Files } from 'lucide-react';

export default function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load medical documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (formData) => {
    await uploadDocument(formData);
    // Refresh the list after successful upload
    fetchDocuments();
  };

  const handleView = async (documentId) => {
    try {
      const response = await getDocument(documentId);
      if (response.download_url) {
        // Open the signed URL in a new secure tab
        window.open(response.download_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert("Failed to securely open the document.");
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to permanently delete this document?")) {
      try {
        await deleteDocument(documentId);
        // Refresh the list
        fetchDocuments();
      } catch (err) {
        alert("Failed to delete the document.");
      }
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.document_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Documents</h2>
          <p className="text-gray-500 text-sm mt-1">Securely manage and view your medical records.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={FilePlus}>
          Upload Document
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by title, filename, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <DocumentCard 
              key={doc.document_id} 
              document={doc} 
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Files}
          title={searchQuery ? "No matching documents found" : "No documents yet"}
          description={searchQuery ? "Try adjusting your search terms." : "You haven't uploaded any medical documents. Click the button above to get started."}
        />
      )}

      <DocumentUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
