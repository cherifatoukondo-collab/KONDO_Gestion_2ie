import { useEffect, useState } from "react";

const avatarColors = [
  "#4e73df",
  "#1cc88a",
  "#36b9cc",
  "#f6c23e",
  "#e74a3b",
  "#858796",
  "#fd7e14",
  "#20c997",
];

const getAvatarColor = (name) => {
  const normalized = name?.trim().toLowerCase() || "utilisateur";
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (nom, prenoms) => {
  const first = nom?.trim()?.charAt(0) || "U";
  const second = prenoms?.trim()?.charAt(0) || "";
  return `${first}${second}`.toUpperCase();
};

export default function Trombi() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchEtudiants = async (page = 1, limit = 9) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/etudiants?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Impossible de charger le trombinoscope.");
      }
      const result = await response.json();
      setEtudiants(result.data || []);
      setPagination(result.pagination || { total: 0, totalPages: 1 });
      setCurrentPage(page);
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="mb-1">Trombinoscope</h2>
          
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Par page :</label>
          <select className="form-select" style={{ width: 110 }} value={pageSize} onChange={handlePageSizeChange}>
            {[6, 9, 12, 15].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="alert alert-info">Chargement...</div>
      ) : (
        <>
          {etudiants.length === 0 ? (
            <div className="alert alert-info">Aucun étudiant disponible.</div>
          ) : (
            <div className="row g-4">
              {etudiants.map((etudiant) => (
                <div className="col-sm-6 col-md-4" key={etudiant.id}>
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <div
                        className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: 80,
                          height: 80,
                          backgroundColor: getAvatarColor(`${etudiant.nom} ${etudiant.prenoms}`),
                          color: "#ffffff",
                          fontSize: 28,
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(etudiant.nom, etudiant.prenoms)}
                      </div>
                      <h5 className="card-title mb-1">{etudiant.nom} {etudiant.prenoms}</h5>
                      <p className="text-muted mb-1">{etudiant.civilite || "-"}</p>
                      <p className="text-muted mb-1">{etudiant.pays || "-"}</p>
                      <p className="text-secondary mb-0">{etudiant.email || "Email non défini"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
            <div className="text-muted">
              {pagination.total > 0 ? (
                <>Page {currentPage} sur {pagination.totalPages} — {pagination.total} étudiant(s)</>
              ) : (
                <>Aucun étudiant à afficher.</>
              )}
            </div>
            <div className="btn-group" role="group" aria-label="Pagination">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Précédent
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
