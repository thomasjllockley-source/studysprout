import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>StudySprout</h1>
        <p>Your learning platform for success</p>
      </header>

      <main className="App-main">
        {loading && <p>Loading courses...</p>}
        {error && <p className="error">Error: {error}</p>}
        {courses.length > 0 && (
          <div className="courses">
            <h2>Available Courses</h2>
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
