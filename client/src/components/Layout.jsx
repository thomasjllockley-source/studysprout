import { NavLink, Outlet } from 'react-router-dom';
import { Home, BookOpen, Shirt, CalendarDays } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-layout">
      <div className="page-content">
        <Outlet />
      </div>
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/start-session" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={22} />
          <span>Study</span>
        </NavLink>
        <NavLink to="/wardrobe" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Shirt size={22} />
          <span>Wardrobe</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CalendarDays size={22} />
          <span>Calendar</span>
        </NavLink>
      </nav>
    </div>
  );
}
