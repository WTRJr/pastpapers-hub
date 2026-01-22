import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Upload, Menu, LogOut } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import UploadModal from './components/UploadModal';
import FilterBar from './components/FilterBar';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({ year: '', semester: '', subject: '', examType: '' });

  // Fetch questions from Firestore
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuestions(questionsData);
    setFilteredQuestions(questionsData);
  };

  // Admin login handler
  const handleAdminLogin = () => {
    const username = prompt('Enter admin username:');
    const password = prompt('Enter admin password:');
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      alert('Admin login successful!');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>PastPapers Hub</h1>
        <div className="header-actions">
          {!isAdmin ? (
            <button onClick={handleAdminLogin} className="btn-admin">
              <Menu size={20} /> Log as Admin
            </button>
          ) : (
            <>
              <button onClick={() => setShowUploadModal(true)} className="btn-upload">
                <Upload size={20} /> Upload Question
              </button>
              <button onClick={() => setIsAdmin(false)} className="btn-logout">
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      </header>

      <FilterBar filters={filters} setFilters={setFilters} questions={questions} setFilteredQuestions={setFilteredQuestions} />

      <main className="main-content">
        {filteredQuestions.length === 0 ? (
          <p className="empty-state">No past questions available yet. Check back soon!</p>
        ) : (
          <div className="questions-grid">
            {filteredQuestions.map(question => (
              <QuestionCard key={question.id} question={question} isAdmin={isAdmin} fetchQuestions={fetchQuestions} />
            ))}
          </div>
        )}
      </main>

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} fetchQuestions={fetchQuestions} />
      )}
    </div>
  );
}

export default App;