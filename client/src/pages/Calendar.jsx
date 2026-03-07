import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import api from '../api';

const eventColors = {
  test: '#e03131',
  quiz: '#f08c00',
  homework: '#1c7ed6',
  exam: '#7950f2',
};

const eventLabels = {
  test: '📝 Test',
  quiz: '❓ Quiz',
  homework: '📚 Homework',
  exam: '🎓 Exam',
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subject: '', event_date: '', event_type: 'test', notes: ''
  });

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/calendar');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.event_date === dateStr);
  };

  const openNewEvent = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData({ title: '', subject: '', event_date: dateStr, event_type: 'test', notes: '' });
    setEditingEvent(null);
    setShowForm(true);
  };

  const openEditEvent = (event) => {
    setFormData({
      title: event.title,
      subject: event.subject || '',
      event_date: event.event_date,
      event_type: event.event_type,
      notes: event.notes || '',
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const saveEvent = async () => {
    if (!formData.title.trim() || !formData.event_date) return;
    try {
      if (editingEvent) {
        await api.patch(`/calendar/${editingEvent.id}`, formData);
      } else {
        await api.post('/calendar', formData);
      }
      await fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/calendar/${id}`);
      await fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="page calendar-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Calendar</h1>
        <button className="add-btn" onClick={() => {
          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setFormData({ title: '', subject: '', event_date: dateStr, event_type: 'test', notes: '' });
          setEditingEvent(null);
          setShowForm(true);
        }}>
          <Plus size={20} />
        </button>
      </header>

      <div className="calendar-nav">
        <button onClick={prevMonth}><ChevronLeft size={24} /></button>
        <span className="calendar-month">{monthNames[month]} {year}</span>
        <button onClick={nextMonth}><ChevronRight size={24} /></button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="calendar-cell empty" />;
          }
          const dayEvents = getEventsForDay(day);
          const isToday = new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={day}
              className={`calendar-cell ${isToday ? 'today' : ''}`}
              onClick={() => openNewEvent(day)}
            >
              <span className="calendar-day-num">{day}</span>
              {dayEvents.map(ev => (
                <div
                  key={ev.id}
                  className="calendar-event"
                  style={{ backgroundColor: eventColors[ev.event_type] }}
                  onClick={(e) => { e.stopPropagation(); openEditEvent(ev); }}
                  title={ev.title}
                >
                  {ev.title.length > 8 ? ev.title.substring(0, 8) + '…' : ev.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        {Object.entries(eventLabels).map(([type, label]) => (
          <span key={type} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: eventColors[type] }} />
            {label}
          </span>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal event-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'New Event'}</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title..."
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-input"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject (optional)"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.event_date}
                onChange={e => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <div className="type-selector">
                {Object.entries(eventLabels).map(([type, label]) => (
                  <button
                    key={type}
                    className={`type-btn ${formData.event_type === type ? 'active' : ''}`}
                    style={formData.event_type === type ? { backgroundColor: eventColors[type], color: 'white' } : {}}
                    onClick={() => setFormData({ ...formData, event_type: type })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-input form-textarea"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes (optional)"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              {editingEvent && (
                <button className="btn-danger" onClick={() => deleteEvent(editingEvent.id)}>Delete</button>
              )}
              <button className="btn-primary" onClick={saveEvent}>
                {editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
