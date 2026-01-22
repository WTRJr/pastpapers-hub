import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Upload, Calendar, Clock, BookOpen, FileText, UploadCloud } from 'lucide-react';

function UploadModal({ onClose, fetchQuestions }) {
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    subject: '',
    examType: '',
    file: null,
    fileName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert('Please select a file!');
      return;
    }

    if (formData.file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB!');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await addDoc(collection(db, 'questions'), {
          year: formData.year,
          semester: formData.semester,
          subject: formData.subject,
          examType: formData.examType,
          fileName: formData.file.name,
          fileUrl: reader.result,
          fileType: formData.file.type,
          uploadedAt: new Date().toISOString()
        });
        alert('Question uploaded successfully!');
        fetchQuestions();
        onClose();
      } catch (error) {
        alert('Error uploading question: ' + error.message);
      }
    };
    reader.readAsDataURL(formData.file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Upload size={28} />
            Upload Past Question
          </h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <Calendar size={18} />
                Academic Year
              </label>
              <input
                type="text"
                placeholder="e.g., 2023/2024"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Clock size={18} />
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <BookOpen size={18} />
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FileText size={18} />
                Exam Type
              </label>
              <input
                type="text"
                placeholder="e.g., Final Exam"
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <UploadCloud size={18} />
                Upload File (Max 10MB)
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
                <div className="file-input-content">
                  <UploadCloud size={40} />
                  <p><strong>{formData.file ? formData.file.name : 'Click to select file'}</strong></p>
                  <p style={{fontSize: '0.85rem', color: '#64748b'}}>PDF, DOC, DOCX, JPG, PNG</p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              <Upload size={20} />
              Upload Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;