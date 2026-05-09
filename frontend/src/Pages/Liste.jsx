import { useEffect, useState } from "react";

export default function Liste() {
  const [etudiants, setEtudiants] = useState([]);
  const [pays, setPays] = useState([]);
  const [civilites, setCivilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEtudiant, setEditingEtudiant] = useState(null);
  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [paysId, setPaysId] = useState("");
  const [civiliteId, setCiviliteId] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState(null);

  const fetchEtudiants = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/etudiants?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Impossible de charger les étudiants.");
      }
      const result = await response.json();
      setEtudiants(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferences = async () => {
    try {
      const [paysRes, civRes] = await Promise.all([
        fetch("/api/pays"),
        fetch("/api/civilites"),
      ]);

      if (!paysRes.ok || !civRes.ok) {
        throw new Error("Impossible de charger les listes de référence.");
      }

      setPays(await paysRes.json());
      setCivilites(await civRes.json());
    } catch (refError) {
      console.error(refError);
      setError(refError.message);
    }
  };

  useEffect(() => {
    fetchReferences();
    fetchEtudiants();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEtudiants(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchEtudiants(1, newPageSize);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        nom: nom.trim(),
        prenoms: prenoms.trim(),
        email: email.trim() || null,
        telephone: telephone.trim() || null,
        pays_id: Number(paysId),
        civilites_id: Number(civiliteId),
      };

      const response = await fetch(
        editingEtudiant ? `/api/etudiants/${editingEtudiant.id}` : "/api/etudiants",
        {
          method: editingEtudiant ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Erreur lors de l'enregistrement.");
      }

      resetForm();
      fetchEtudiants();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message);
    }
  };

  const handleEdit = (etudiant) => {
    setEditingEtudiant(etudiant);
    setNom(etudiant.nom || "");
    setPrenoms(etudiant.prenoms || "");
    setEmail(etudiant.email || "");
    setTelephone(etudiant.telephone || "");
    setPaysId(etudiant.pays_id || "");
    setCiviliteId(etudiant.civilites_id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ ATTENTION: Cette action est irréversible !\n\nVoulez-vous vraiment supprimer cet étudiant ?\nToutes les données associées (inscriptions, résultats) seront perdues.")) {
      return;
    }

    try {
      const response = await fetch(`/api/etudiants/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Impossible de supprimer l'étudiant.");
      }
      fetchEtudiants();
      if (editingEtudiant?.id === id) resetForm();
    } catch (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Liste des étudiants</h2>

      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nom</label>
            <input
              className="form-control"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Prénoms</label>
            <input
              className="form-control"
              value={prenoms}
              onChange={(e) => setPrenoms(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Civilité</label>
            <select
              className="form-select"
              value={civiliteId}
              onChange={(e) => setCiviliteId(e.target.value)}
              required
            >
              <option value="">Choisir...</option>
              {civilites.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.libelle}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Pays</label>
            <select
              className="form-select"
              value={paysId}
              onChange={(e) => setPaysId(e.target.value)}
              required
            >
              <option value="">Choisir...</option>
              {pays.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.libelle}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Téléphone</label>
            <input
              className="form-control"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary me-2" type="submit">
              {editingEtudiant ? "Mettre à jour" : "Ajouter étudiant"}
            </button>
            {editingEtudiant && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Annuler
              </button>
            )}
          </div>
          {error && <div className="alert alert-danger col-12">{error}</div>}
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénoms</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : etudiants.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Aucun étudiant trouvé.
                </td>
              </tr>
            ) : (
              etudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>{etudiant.id}</td>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.prenoms}</td>
                  <td>{etudiant.email || "-"}</td>
                  <td>{etudiant.telephone || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      type="button"
                      onClick={() => handleEdit(etudiant)}
                    >
                      <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                      </svg>
                      Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(etudiant.id)}
                    >
                      <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center">
            <label className="form-label me-2 mb-0">Éléments par page:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="d-flex align-items-center">
            <span className="me-3">
              Page {pagination.page} sur {pagination.totalPages} ({pagination.total} éléments)
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Précédent
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <li key={pageNum} className={`page-item ${pageNum === pagination.page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
