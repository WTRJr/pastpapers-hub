import React, { useEffect } from 'react';

function FilterBar({ filters, setFilters, questions, setFilteredQuestions }) {
  useEffect(() => {
    let filtered = questions;

    if (filters.year) {
      filtered = filtered.filter(q => q.year === filters.year);
    }
    if (filters.semester) {
      filtered = filtered.filter(q => q.semester === filters.semester);
    }
    if (filters.subject) {
      filtered = filtered.filter(q => q.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }
    if (filters.examType) {
      filtered = filtered.filter(q => q.examType.toLowerCase().includes(filters.examType.toLowerCase()));
    }

    setFilteredQuestions(filtered);
  }, [filters, questions, setFilteredQuestions]);

  const uniqueYears = [...new Set(questions.map(q => q.year))];
  const uniqueSemesters = [...new Set(questions.map(q => q.semester))];

  return (
    <div className="filter-bar">
      <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
        <option value="">All Years</option>
        {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
      </select>
      <select value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
        <option value="">All Semesters</option>
        {uniqueSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
      </select>
      <input
        type="text"
        placeholder="Search by subject..."
        value={filters.subject}
        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
      />
      <input
        type="text"
        placeholder="Search by exam type..."
        value={filters.examType}
        onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
      />
      <button onClick={() => setFilters({ year: '', semester: '', subject: '', examType: '' })} className="btn-clear">
        Clear Filters
      </button>
    </div>
  );
}

export default FilterBar;