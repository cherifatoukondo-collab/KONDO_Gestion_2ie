import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Sidebar.css';

const RESSOURCES = [
  { label: 'Écoles',             path: '/ressources/ecoles',             icon: 'bi-building' },
  { label: 'Filières',           path: '/ressources/filieres',           icon: 'bi-diagram-3' },
  { label: 'Cycles',             path: '/ressources/cycles',             icon: 'bi-arrow-repeat' },
  { label: 'Spécialités',        path: '/ressources/specialites',        icon: 'bi-bookmark' },
  { label: 'Civilités',          path: '/ressources/civilites',          icon: 'bi-person-badge' },
  { label: 'Pays',               path: '/ressources/pays',               icon: 'bi-globe' },
  { label: 'Décisions',          path: '/ressources/decisions',          icon: 'bi-check2-square' },
  { label: 'Années académiques', path: '/ressources/annees-academiques', icon: 'bi-calendar3' },
  { label: 'Parcours',           path: '/ressources/parcours',           icon: 'bi-signpost-split' },
];

const DASHBOARD = [
  { label: 'Tableau de bord', path: '/dashboard', icon: 'bi-speedometer2' },
];

const GESTION = [
  { label: 'Ajouter étudiant',    path: '/etudiants/ajouter',      icon: 'bi-person-plus' },
  { label: 'Résultats',           path: '/etudiants/resultats',    icon: 'bi-bar-chart' },
  { label: 'Trombinoscope',       path: '/etudiants/trombi',       icon: 'bi-grid' },
  { label: 'Liste étudiants',     path: '/etudiants/liste',        icon: 'bi-list-ul' },
  { label: 'Certificat',          path: '/etudiants/certificat',   icon: 'bi-file-earmark-text' },
  { label: 'Gestion inscription', path: '/etudiants/inscriptions', icon: 'bi-pencil-square' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [ressourcesOpen, setRessourcesOpen] = useState(false);
  const [gestionOpen, setGestionOpen]       = useState(true);

  return (
    <aside className="sidebar d-flex flex-column">
      {/* Logo / titre */}
      <div className="sidebar-brand">
        <i className="bi bi-mortarboard-fill me-2" />
        Gestion 2iE
      </div>

      <nav className="sidebar-nav flex-grow-1">
        {/* Dashboard */}
        <ul className="sidebar-submenu mb-3">
          {DASHBOARD.map(item => (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                <i className={`bi ${item.icon} me-2`} />{item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Ressources */}
        <button
          className="sidebar-group-btn"
          onClick={() => setRessourcesOpen(o => !o)}
        >
          <span><i className="bi bi-folder2 me-2" />Ressources</span>
          <i className={`bi bi-chevron-${ressourcesOpen ? 'up' : 'down'}`} />
        </button>
        {ressourcesOpen && (
          <ul className="sidebar-submenu">
            {RESSOURCES.map(item => (
              <li key={item.path}>
                <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className={`bi ${item.icon} me-2`} />{item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Gestion étudiants */}
        <button
          className="sidebar-group-btn"
          onClick={() => setGestionOpen(o => !o)}
        >
          <span><i className="bi bi-people me-2" />Gestion étudiants</span>
          <i className={`bi bi-chevron-${gestionOpen ? 'up' : 'down'}`} />
        </button>
        {gestionOpen && (
          <ul className="sidebar-submenu">
            {GESTION.map(item => (
              <li key={item.path}>
                <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className={`bi ${item.icon} me-2`} />{item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Utilisateur connecté */}
      <div className="sidebar-footer">
        <i className="bi bi-person-circle me-2" />
        <span className="flex-grow-1">{user?.nom}</span>
        <button className="btn btn-sm btn-outline-light" onClick={logout} title="Déconnexion">
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </aside>
  );
}
