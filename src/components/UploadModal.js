import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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

  const [existingSubjects, setExistingSubjects] = useState([]);
  const [existingExamTypes, setExistingExamTypes] = useState([]);
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [showNewExamType, setShowNewExamType] = useState(false);

  // Fetch existing subjects and exam types from Firestore
  useEffect(() => {
    const fetchExistingData = async () => {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questions = querySnapshot.docs.map(doc => doc.data());
      
      // Get unique subjects and exam types
      const subjects = [...new Set(questions.map(q => q.subject))].filter(Boolean);
      const examTypes = [...new Set(questions.map(q => q.examType))].filter(Boolean);
      
      setExistingSubjects(subjects);
      setExistingExamTypes(examTypes);
    };
    
    fetchExistingData();
  }, []);

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    if (value === '__ADD_NEW__') {
      setShowNewSubject(true);
      setFormData({ ...formData, subject: '' });
    } else {
      setShowNewSubject(false);
      setFormData({ ...formData, subject: value });
    }
  };

  const handleExamTypeChange = (e) => {
    const value = e.target.value;
    if (value === '__ADD_NEW__') {
      setShowNewExamType(true);
      setFormData({ ...formData, examType: '' });
    } else {
      setShowNewExamType(false);
      setFormData({ ...formData, examType: value });
    }
  };

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
              {!showNewSubject ? (
                <select
                  value={formData.subject}
                  onChange={handleSubjectChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {existingSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                  <option value="__ADD_NEW__">➕ Add New Subject</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter new subject (e.g., Mathematics)"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewSubject(false);
                      setFormData({ ...formData, subject: '' });
                    }}
                    style={{
                      padding: '0.875rem 1rem',
                      background: '#e0e7ff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: '#4f46e5'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                <FileText size={18} />
                Exam Type
              </label>
              {!showNewExamType ? (
                <select
                  value={formData.examType}
                  onChange={handleExamTypeChange}
                  required
                >
                  <option value="">Select Exam Type</option>
                  {existingExamTypes.map(examType => (
                    <option key={examType} value={examType}>{examType}</option>
                  ))}
                  <option value="__ADD_NEW__">➕ Add New Exam Type</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter new exam type (e.g., Final Exam)"
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewExamType(false);
                      setFormData({ ...formData, examType: '' });
                    }}
                    style={{
                      padding: '0.875rem 1rem',
                      background: '#e0e7ff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: '#4f46e5'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
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