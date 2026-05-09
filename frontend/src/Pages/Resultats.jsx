import { useEffect, useState } from "react";

export default function Resultats() {
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResultats = async () => {
      setError("");

      try {
        const response = await fetch("/api/resultats");

        if (!response.ok) {
          throw new Error("Impossible de charger les résultats.");
        }

        const data = await response.json();
        setResultats(Array.isArray(data) ? data : data?.resultats || data?.data || []);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchResultats();
  }, []);

  const badgeClass = (decision) => {
    if (decision === "Admis") return "bg-success";
    if (decision === "Ajourné") return "bg-danger";
    return "bg-warning text-dark";
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Résultats Académiques</h2>
          <p className="text-muted mb-0">Consultez les notes, mentions et décisions des étudiants.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des résultats...</p>
        </div>
      ) : resultats.length === 0 ? (
        <div className="alert alert-info">Aucun résultat trouvé.</div>
      ) : (
        <div className="row g-4">
          {resultats.map((item) => (
            <div className="col-12 col-md-6 col-xl-4" key={item.id || `${item.nom}-${item.prenoms}-${item.parcours}`}>
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                    <div>
                      <h5 className="fw-bold mb-1">{item.nom} {item.prenoms}</h5>
                      <p className="text-muted small mb-1">{item.email || "-"}</p>
                      <p className="text-muted small mb-0">{item.parcours || "Parcours non renseigné"}</p>
                    </div>
                    <span className={`badge ${badgeClass(item.decision)}`}>{item.decision || "En attente"}</span>
                  </div>

                  <hr />

                  <div className="mb-2">
                    <span className="text-secondary">Moyenne</span>
                    <div className="mt-1">
                      <span className="badge bg-primary py-2 px-3">{typeof item.moyenne === "number" ? item.moyenne.toFixed(2) : item.moyenne || "-"}/20</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-secondary">Mention</span>
                    <div className="mt-1">
                      <span className="badge bg-info text-dark py-2 px-3">{item.mention || "-"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-secondary">Date de publication</span>
                    <div className="mt-1 text-muted small">{item.datePublication || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
