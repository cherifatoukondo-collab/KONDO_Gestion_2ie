import { useAuth } from '../Context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    etudiants: 0,
    ecoles: 0,
    pays: 0,
    filieres: 0,
    specialites: 0,
    cycles: 0,
    parcours: 0,
    annees_academiques: 0,
    total_inscriptions: 0,
    inscriptions_validees: 0,
    inscriptions_non_validees: 0,
    reussites: 0,
    echecs: 0,
    filles: 0,
    garcons: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = {
          ecoles: '/api/ecoles',
          pays: '/api/pays',
          filieres: '/api/filieres',
          specialites: '/api/specialites',
          cycles: '/api/cycles',
          parcours: '/api/parcours',
          annees_academiques: '/api/annees-academiques',
        };

        const results = {};

        // Récupération du nombre total d'étudiants via l'endpoint de stats
        const etudiantRes = await fetch('/api/etudiants/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (etudiantRes.ok) {
          const etudiantData = await etudiantRes.json();
          // Récupérer toutes les propriétés de stats et convertir en nombres
          results.etudiants = etudiantData.total ?? 0;
          results.filles = parseInt(etudiantData.filles) || 0;
          results.garcons = parseInt(etudiantData.garcons) || 0;
          results.total_inscriptions = etudiantData.total_inscriptions ?? 0;
          results.inscriptions_validees = etudiantData.inscriptions_validees ?? 0;
          results.inscriptions_non_validees = etudiantData.inscriptions_non_validees ?? 0;
          results.reussites = etudiantData.reussites ?? 0;
          results.echecs = etudiantData.echecs ?? 0;
        } else {
          results.etudiants = 0;
          results.filles = 0;
          results.garcons = 0;
          results.total_inscriptions = 0;
          results.inscriptions_validees = 0;
          results.inscriptions_non_validees = 0;
          results.reussites = 0;
          results.echecs = 0;
        }

        for (const [key, endpoint] of Object.entries(endpoints)) {
          const res = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            results[key] = Array.isArray(data) ? data.length : 0;
          } else {
            results[key] = 0;
          }
        }

        setStats(results);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const StatCard = ({ icon, label, value, color }) => (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`card stat-card stat-card-${color} h-100 shadow-sm`}>
        <div className="card-body d-flex align-items-center">
          <div className={`stat-icon stat-icon-${color} me-3`}>
            <i className={`bi ${icon}`}></i>
          </div>
          <div>
            <p className="stat-label mb-1">{label}</p>
            <h3 className="stat-value mb-0">{loading ? '-' : value}</h3>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="mb-1" style={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Tableau de bord
          </h2>
          <p className="text-muted mb-0">Bienvenue, {user?.nom}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="user-info d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light">
            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem', color: '#3498db' }}></i>
            <span style={{ fontWeight: '500' }}>{user?.nom}</span>
          </div>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={logout}
            style={{ borderRadius: '20px' }}
          >
            <i className="bi bi-box-arrow-right me-1" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Welcome Alert */}
      <div className="mb-5">
        <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle me-3" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <h5 className="mb-1">Bienvenue au système de gestion 2IE</h5>
              <p className="mb-0">Consultez ci-dessous un aperçu des informations principales de votre plateforme.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mb-5">
        <h4 className="mb-4" style={{ fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="bi bi-graph-up me-2" style={{ color: '#3498db' }}></i>
          Statistiques générales
        </h4>

        <div className="row">
          <StatCard 
            icon="bi-people-fill" 
            label="Étudiants" 
            value={stats.etudiants}
            color="blue"
          />
          <StatCard 
            icon="bi-building" 
            label="Écoles" 
            value={stats.ecoles}
            color="green"
          />
          <StatCard 
            icon="bi-globe2" 
            label="Pays" 
            value={stats.pays}
            color="purple"
          />
          <StatCard 
            icon="bi-diagram-3" 
            label="Filières" 
            value={stats.filieres}
            color="orange"
          />
          <StatCard 
            icon="bi-bookmark-fill" 
            label="Spécialités" 
            value={stats.specialites}
            color="red"
          />
          <StatCard 
            icon="bi-circle-fill" 
            label="Cycles" 
            value={stats.cycles}
            color="teal"
          />
          <StatCard 
            icon="bi-path-fill" 
            label="Parcours" 
            value={stats.parcours}
            color="indigo"
          />
          <StatCard 
            icon="bi-calendar-event" 
            label="Années académiques" 
            value={stats.annees_academiques}
            color="pink"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <h4 className="mb-4" style={{ fontWeight: 'bold', color: '#2c3e50' }}>
          <i className="bi bi-lightning-fill me-2" style={{ color: '#f39c12' }}></i>
          Actions rapides
        </h4>
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-3">
            <button
              className="btn btn-light border-1 w-100 py-3 rounded-lg shadow-sm hover-lift"
              style={{ transition: 'all 0.3s ease' }}
              type="button"
              onClick={() => navigate('/etudiants/ajouter')}
            >
              <i className="bi bi-plus-circle me-2" style={{ color: '#27ae60', fontSize: '1.3rem' }}></i>
              <div>Ajouter un étudiant</div>
            </button>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <button
              className="btn btn-light border-1 w-100 py-3 rounded-lg shadow-sm hover-lift"
              style={{ transition: 'all 0.3s ease' }}
              type="button"
              onClick={() => navigate('/ressources/ecoles')}
            >
              <i className="bi bi-plus-circle me-2" style={{ color: '#3498db', fontSize: '1.3rem' }}></i>
              <div>Ajouter une école</div>
            </button>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <button
              className="btn btn-light border-1 w-100 py-3 rounded-lg shadow-sm hover-lift"
              style={{ transition: 'all 0.3s ease' }}
              type="button"
              onClick={() => navigate('/etudiants/inscriptions')}
            >
              <i className="bi bi-file-earmark-text me-2" style={{ color: '#e74c3c', fontSize: '1.3rem' }}></i>
              <div>Voir les inscriptions</div>
            </button>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <button
              className="btn btn-light border-1 w-100 py-3 rounded-lg shadow-sm hover-lift"
              style={{ transition: 'all 0.3s ease' }}
              type="button"
              onClick={() => navigate('/etudiants/inscriptions')}
            >
              <i className="bi bi-people-fill me-2" style={{ color: '#2ecc71', fontSize: '1.3rem' }}></i>
              <div>Voir les inscriptions</div>
            </button>
          </div>
        </div>
      </div>

      {/* Student Performance Cards */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm rounded-lg h-100">
            <div className="card-body">
              <h5 className="card-title mb-3" style={{ fontWeight: 'bold' }}>
                <i className="bi bi-bar-chart-line-fill me-2" style={{ color: '#3498db' }}></i>
                Performance des étudiants
              </h5>
              <p className="card-text text-muted mb-4">
                Aperçu des inscriptions et des résultats pour mieux piloter les capacités d'admission et les flux d'étudiants.
              </p>
              <div className="dashboard-stat-row">
                <div>
                  <span className="dashboard-stat-label">Taux de réussite</span>
                  <h3 className="dashboard-stat-value">{loading ? '-' : `${Math.round(stats.reussites / Math.max(stats.reussites + stats.echecs, 1) * 100)}%`}</h3>
                </div>
                <div className="dashboard-stat-chip bg-success">{stats.reussites}</div>
              </div>
              <div className="dashboard-stat-row">
                <div>
                  <span className="dashboard-stat-label">Taux d'échec</span>
                  <h3 className="dashboard-stat-value">{loading ? '-' : `${Math.round(stats.echecs / Math.max(stats.reussites + stats.echecs, 1) * 100)}%`}</h3>
                </div>
                <div className="dashboard-stat-chip bg-danger">{stats.echecs}</div>
              </div>
              <div className="dashboard-stat-row">
                <div>
                  <span className="dashboard-stat-label">Inscriptions validées</span>
                  <h3 className="dashboard-stat-value">{loading ? '-' : `${Math.round(stats.inscriptions_validees / Math.max(stats.total_inscriptions, 1) * 100)}%`}</h3>
                </div>
                <div className="dashboard-stat-chip bg-primary">{stats.inscriptions_validees}</div>
              </div>
              <div className="dashboard-stat-row">
                <div>
                  <span className="dashboard-stat-label">Inscriptions en attente / refus</span>
                  <h3 className="dashboard-stat-value">{loading ? '-' : `${Math.round(stats.inscriptions_non_validees / Math.max(stats.total_inscriptions, 1) * 100)}%`}</h3>
                </div>
                <div className="dashboard-stat-chip bg-warning">{stats.inscriptions_non_validees}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm rounded-lg h-100">
            <div className="card-body">
              <h5 className="card-title mb-3" style={{ fontWeight: 'bold' }}>
                <i className="bi bi-person-lines-fill me-2" style={{ color: '#9b59b6' }}></i>
                Vue rapide des étudiants
              </h5>
              <div className="dashboard-summary-list">
                <div className="dashboard-summary-item">
                  <div>
                    <p className="text-muted mb-1">Étudiants totaux</p>
                    <h4>{loading ? '-' : stats.etudiants}</h4>
                  </div>
                  <div className="dashboard-summary-badge bg-info">Total</div>
                </div>
                <div className="dashboard-summary-item">
                  <div>
                    <p className="text-muted mb-1">Pays représentés</p>
                    <h4>{loading ? '-' : stats.pays}</h4>
                  </div>
                  <div className="dashboard-summary-badge bg-success">Diversité</div>
                </div>
                <div className="dashboard-summary-item">
                  <div>
                    <p className="text-muted mb-1">Filles</p>
                    <h4>{loading ? '-' : stats.filles}</h4>
                  </div>
                  <div className="dashboard-summary-badge bg-warning">Genre</div>
                </div>
                <div className="dashboard-summary-item">
                  <div>
                    <p className="text-muted mb-1">Garçons</p>
                    <h4>{loading ? '-' : stats.garcons}</h4>
                  </div>
                  <div className="dashboard-summary-badge bg-danger">Genre</div>
                </div>
              </div>
              <p className="text-muted mt-3 small">
                Ces indicateurs vous permettent de suivre rapidement l'équilibre des inscriptions et la performance globale des cohorts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
