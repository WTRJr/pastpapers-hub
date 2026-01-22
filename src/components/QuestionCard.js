import React, { useState } from 'react';
import { MoreVertical, Eye, Download, Trash2, Calendar, BookOpen, FileText, Clock } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function QuestionCard({ question, isAdmin, fetchQuestions }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleView = () => {
    // Create a blob from base64 and open in new tab
    const base64Data = question.fileUrl.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: question.fileType || 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = question.fileUrl;
    link.download = question.fileName;
    link.click();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await deleteDoc(doc(db, 'questions', question.id));
      fetchQuestions();
    }
  };

  return (
    <div className="question-card">
      <div className="card-header">
        <h3>
          <BookOpen size={24} />
          {question.subject}
        </h3>
        <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
          <MoreVertical size={20} />
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={handleView}>
              <Eye size={18} /> View
            </button>
            <button onClick={handleDownload}>
              <Download size={18} /> Download
            </button>
            {isAdmin && (
              <button onClick={handleDelete} className="delete-btn">
                <Trash2 size={18} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-info">
          <div className="info-item">
            <Calendar size={20} />
            <strong>Year:</strong>
            <span>{question.year}</span>
          </div>
          <div className="info-item">
            <Clock size={20} />
            <strong>Semester:</strong>
            <span>{question.semester}</span>
          </div>
          <div className="info-item">
            <FileText size={20} />
            <strong>Exam Type:</strong>
            <span>{question.examType}</span>
          </div>
        </div>
        <div className="file-info">
          <FileText size={18} />
          <p className="file-name">{question.fileName}</p>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;