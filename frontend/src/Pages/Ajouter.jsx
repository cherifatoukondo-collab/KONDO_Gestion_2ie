import { useEffect, useState } from "react";

export default function Ajouter() {
  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [paysId, setPaysId] = useState("");
  const [civiliteId, setCiviliteId] = useState("");
  const [pays, setPays] = useState([]);
  const [civilites, setCivilites] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [paysRes, civilitesRes] = await Promise.all([
          fetch("/api/pays"),
          fetch("/api/civilites"),
        ]);

        if (!paysRes.ok || !civilitesRes.ok) {
          throw new Error("Impossible de charger les listes.");
        }

        setPays(await paysRes.json());
        setCivilites(await civilitesRes.json());
      } catch (loadError) {
        console.error(loadError);
        setError("Impossible de charger les données de référence.");
      }
    };

    loadMetadata();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/etudiants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          prenoms: prenoms.trim(),
          email: email.trim() || null,
          telephone: telephone.trim() || null,
          pays_id: Number(paysId),
          civilites_id: Number(civiliteId),
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Erreur lors de la création.");
      }

      setMessage("Étudiant créé avec succès.");
      setNom("");
      setPrenoms("");
      setEmail("");
      setTelephone("");
      setPaysId("");
      setCiviliteId("");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un étudiant</h2>
      

      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nom</label>
            <input
              className="form-control"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
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
              {civilites.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.libelle}
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
              {pays.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.libelle}
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
          <div className="col-md-6">
            <label className="form-label">Téléphone</label>
            <input
              className="form-control"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary">Créer</button>
          </div>

          {message && <div className="alert alert-success col-12">{message}</div>}
          {error && <div className="alert alert-danger col-12">{error}</div>}
        </form>
      </div>
    </div>
  );
}
