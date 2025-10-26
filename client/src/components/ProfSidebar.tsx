import React from 'react';
import '../assets/css/ProfSidebar.css';

interface ProfSidebarProps {
  sidebarActive: boolean;
  toggleSidebar: () => void;
}

function ProfSidebar({ sidebarActive, toggleSidebar }: ProfSidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <div id="sidebar" className={sidebarActive ? 'active' : ''}>
        <h4>
            <br /><br />
        </h4>

        <ul className="nav flex-column mt-2">
          <li className="nav-item">
            <a className="nav-link" href="/ProfHome"><i className="fas fa-home"></i>Home</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#"><i className="fas fa-user"></i>Profile</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#"><i className="fas fa-envelope"></i>Messages</a>
          </li>
        </ul>

        <ul className="nav flex-column logout">
          <li className="nav-item">
            <a className="nav-link" href="#"><i className="fas fa-sign-out-alt"></i>Logout</a>
          </li>
        </ul>
      </div>

      {/* Sidebar overlay for mobile */}
      <div id="sidebar-overlay" style={{ display: sidebarActive ? 'block' : 'none' }} onClick={toggleSidebar}></div>
    </>
  );
}

export default ProfSidebar;
