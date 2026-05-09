import { useEffect, useMemo, useState } from "react";
import "./Ecoles.css";

function Ecoles() {
  const [ecoles, setEcoles] = useState([]);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [libelle, setLibelle] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchEcoles = async () => {
    try {
      const res = await fetch("/api/ecoles");
      if (!res.ok) {
        throw new Error("Impossible de charger les écoles.");
      }
      const data = await res.json();
      setEcoles(data);
    } catch (fetchError) {
      console.error("Erreur chargement :", fetchError);
      setError("Erreur lors du chargement des écoles.");
    }
  };

  const fetchStudentsByEcole = async (ecole) => {
    setSelectedEcole(ecole);
    setSelectedStudents([]);
    setStudentsError("");
    setStudentsLoading(true);

    try {
      const res = await fetch(`/api/ecoles/${ecole.id}/etudiants`);
      if (!res.ok) {
        throw new Error("Impossible de charger les étudiants inscrits.");
      }
      const data = await res.json();
      setSelectedStudents(data);
    } catch (fetchError) {
      console.error("Erreur chargement étudiants :", fetchError);
      setStudentsError(fetchError.message);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchEcoles();
  }, []);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFilteredEcoles(ecoles);
      return;
    }

    const filtered = ecoles.filter((ecole) => {
      const label = ecole.libelle?.toLowerCase() || "";
      const address = ecole.adresse?.toLowerCase() || "";
      const contact = `${ecole.email || ""} ${ecole.telephone || ""}`.toLowerCase();
      return label.includes(term) || address.includes(term) || contact.includes(term);
    });

    setFilteredEcoles(filtered);
  }, [ecoles, search]);

  const displayedEcoles = useMemo(() => filteredEcoles, [filteredEcoles]);

  const resetForm = () => {
    setLibelle("");
    setAdresse("");
    setTelephone("");
    setEmail("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      libelle: libelle.trim(),
      adresse: adresse.trim() || null,
      telephone: telephone.trim() || null,
      email: email.trim() || null,
    };

    try {
      const response = await fetch(editingId ? `/api/ecoles/${editingId}` : "/api/ecoles", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Erreur lors de l'enregistrement.");
      }

      resetForm();
      fetchEcoles();
    } catch (submitError) {
      console.error("Erreur ajout/mise à jour :", submitError);
      setError(submitError.message);
    }
  };

  const handleEdit = (ecole) => {
    setEditingId(ecole.id);
    setLibelle(ecole.libelle || "");
    setAdresse(ecole.adresse || "");
    setTelephone(ecole.telephone || "");
    setEmail(ecole.email || "");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("⚠️ ATTENTION: Cette action est irréversible !\n\nVoulez-vous vraiment supprimer cette école ?\nTous les étudiants associés pourraient être affectés.");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/ecoles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Impossible de supprimer cette école.");
      }

      if (editingId === id) {
        resetForm();
      }
      if (selectedEcole?.id === id) {
        setSelectedEcole(null);
        setSelectedStudents([]);
      }
      fetchEcoles();
    } catch (deleteError) {
      console.error("Erreur suppression :", deleteError);
      setError(deleteError.message);
    }
  };

  return (
    <div className="ecoles-page">
      <div className="ecoles-header">
        <div>
          <h2>Gestion des écoles</h2>
          <p>Recherchez des écoles, consultez les étudiants inscrits et gérez les établissements.</p>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-lg-4">
          <div className="ecoles-card p-4 mb-4 rounded-4 shadow-sm bg-white">
            <h5 className="mb-3">Ajouter / Modifier une école</h5>
            <form onSubmit={handleSubmit} className="ecoles-form">
              <div className="mb-3">
                <label htmlFor="libelle" className="form-label">Nom de l'école</label>
                <input
                  id="libelle"
                  type="text"
                  value={libelle}
                  onChange={(e) => setLibelle(e.target.value)}
                  className="form-control"
                  placeholder="Libelle de l'école"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="adresse" className="form-label">Adresse</label>
                <textarea
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="form-control"
                  placeholder="Adresse complète"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telephone" className="form-label">Téléphone</label>
                <input
                  id="telephone"
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="form-control"
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="contact@ecole.exemple"
                />
              </div>
              <div className="d-flex gap-2 mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={resetForm}>
                    Annuler
                  </button>
                )}
              </div>
              {error && <p className="text-danger">{error}</p>}
            </form>
          </div>

          <div className="ecoles-card p-4 rounded-4 shadow-sm bg-white">
            <h5 className="mb-3">Recherche</h5>
            <input
              type="search"
              className="form-control"
              placeholder="Rechercher écoles, étudiants ou filières..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="text-muted small mt-3 mb-0">
              Cliquez sur une école pour afficher ses étudiants inscrits.
            </p>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
            {displayedEcoles.map((ecole) => (
              <div key={ecole.id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title mb-2">{ecole.libelle}</h5>
                      <p className="card-text text-muted mb-2">{ecole.adresse || "Adresse non renseignée"}</p>
                      <p className="mb-2">
                        <span className="badge bg-secondary me-2">ID {ecole.id}</span>
                        <span className="badge bg-info text-dark">Contact</span>
                      </p>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => fetchStudentsByEcole(ecole)}
                      >
                        <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                          <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                        Voir étudiants
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEdit(ecole)}
                      >
                        <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(ecole.id)}
                      >
                        <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {displayedEcoles.length === 0 && (
              <div className="col">
                <div className="alert alert-info">Aucune école ne correspond à cette recherche.</div>
              </div>
            )}
          </div>

          {selectedEcole && (
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">Étudiants inscrits à {selectedEcole.libelle}</h5>
                    <p className="text-muted mb-0">{selectedStudents.length} étudiant(s) trouvé(s).</p>
                  </div>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedEcole(null)}>
                    Fermer
                  </button>
                </div>

                {studentsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                ) : studentsError ? (
                  <div className="alert alert-danger">{studentsError}</div>
                ) : selectedStudents.length === 0 ? (
                  <div className="alert alert-info">Aucun étudiant inscrit trouvé pour cette école.</div>
                ) : (
                  <div className="row g-3">
                    {selectedStudents.map((student) => (
                      <div className="col-12 col-md-6" key={student.etudiantId}>
                        <div className="card shadow-sm border-0 rounded-4 h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="fw-bold mb-1">{student.nom} {student.prenoms}</h6>
                                <p className="text-muted small mb-0">{student.email || "-"}</p>
                              </div>
                              <span className="badge bg-success py-2 px-3">Inscrit</span>
                            </div>
                            <p className="mb-1"><strong>Parcours :</strong> {student.parcours || "-"}</p>
                            <p className="mb-1"><strong>Filière :</strong> {student.filiere || "-"}</p>
                            <p className="mb-1"><strong>Mention :</strong> {student.mention || "-"}</p>
                            <p className="mb-1"><strong>Moyenne :</strong> {student.moyenne ? `${student.moyenne}/20` : "-"}</p>
                            <p className="text-muted small mb-0">Publication : {student.datePublication || "-"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ecoles;
