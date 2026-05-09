import { useEffect, useState } from "react";

export default function Inscriptions() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const fetchEtudiants = async (page = 1, limit = 12) => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/etudiants?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Impossible de charger les étudiants.");
      }
      const result = await response.json();
      setEtudiants(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      });
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEtudiants(newPage, pagination.limit);
    }
  };

  const handleLimitChange = (newLimit) => {
    fetchEtudiants(1, newLimit);
  };

  const renderPagination = () => {
    const { page, totalPages } = pagination;
    const pages = [];

    // Calculer les pages à afficher
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    // Ajuster si on est près du début ou de la fin
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav aria-label="Pagination des étudiants">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
              </li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {pages.map(p => (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(p)}>{p}</button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </li>
            </>
          )}

          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Gestion des inscriptions</h2>
          <p className="text-muted mb-0">Liste des étudiants inscrits avec un statut clair et un accès rapide à chaque fiche.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0">Éléments par page:</label>
          <select
            className="form-select form-select-sm"
            value={pagination.limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            style={{ width: 'auto' }}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 mb-0">Chargement des étudiants inscrits...</p>
        </div>
      ) : etudiants.length === 0 ? (
        <div className="alert alert-info">Aucun étudiant trouvé.</div>
      ) : (
        <>
          <div className="mb-3 text-muted">
            Affichage de {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} étudiants
          </div>

          <div className="row g-4">
            {etudiants.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{item.nom} {item.prenoms}</h5>
                        <p className="text-muted small mb-0">Nom inscrit</p>
                      </div>
                      <span className="badge bg-success py-2 px-3">Inscrit</span>
                    </div>
                    <p className="mb-2"><strong>Email :</strong> {item.email || "-"}</p>
                    <p className="mb-2"><strong>Téléphone :</strong> {item.telephone || "-"}</p>
                    <p className="mb-2"><strong>Civilité :</strong> {item.civilite || "-"}</p>
                    <p className="mb-2"><strong>Pays :</strong> {item.pays || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4">
              {renderPagination()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
