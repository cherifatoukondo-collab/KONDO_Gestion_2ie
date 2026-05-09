import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function Certificat() {
  const [email, setEmail] = useState("");
  const [etudiants, setEtudiants] = useState([]);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch("/api/etudiants");
        if (!response.ok) {
          throw new Error("Impossible de charger les étudiants.");
        }
        const result = await response.json();
        setEtudiants(result.data || result);
      } catch (loadError) {
        console.error(loadError);
        setError("Impossible de charger la liste des étudiants.");
      }
    };

    loadStudents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    const found = etudiants.find((item) => item.email?.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setStudent(null);
      setError("Aucun étudiant trouvé avec cet email.");
      return;
    }
    setStudent(found);
  };

  const handleDownloadPdf = () => {
    if (!student) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 40;
    let currentHeight = 80;

    doc.setFontSize(22);
    doc.text("Certificat de scolarité", pageWidth / 2, currentHeight, { align: "center" });
    currentHeight += 40;

    doc.setFontSize(12);
    doc.text("Ce document atteste que l'étudiant(e) suivant(e) est inscrit(e) pour l'année scolaire actuelle.", leftMargin, currentHeight);
    currentHeight += 30;

    doc.setFontSize(14);
    doc.text("Détails de l'étudiant :", leftMargin, currentHeight);
    currentHeight += 25;

    doc.setFontSize(12);
    doc.text(`Nom : ${student.nom || "-"}`, leftMargin, currentHeight);
    currentHeight += 20;
    doc.text(`Prénoms : ${student.prenoms || "-"}`, leftMargin, currentHeight);
    currentHeight += 20;
    doc.text(`Email : ${student.email || "-"}`, leftMargin, currentHeight);
    currentHeight += 20;
    doc.text(`Téléphone : ${student.telephone || "-"}`, leftMargin, currentHeight);
    currentHeight += 20;
    doc.text(`Date de génération : ${new Date().toLocaleDateString()}`, leftMargin, currentHeight);
    currentHeight += 40;

    doc.setFontSize(12);
    doc.text("Signature :", leftMargin, currentHeight);
    currentHeight += 30;
    doc.text("__________________________", leftMargin, currentHeight);

    const fileName = `${student.nom || "certificat"}_${student.prenoms || "etudiant"}_certificat.pdf`;
    doc.save(fileName.replace(/\s+/g, "_"));
  };

  return (
    <div className="container mt-4">
      <h2>Certificat</h2>
      <p>Recherchez un étudiant pour générer un certificat.</p>

      <div className="card p-4 mb-4">
        <form className="row g-3" onSubmit={handleSearch}>
          <div className="col-md-8">
            <input
              type="email"
              className="form-control"
              placeholder="Entrez l'email de l'étudiant"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100">Rechercher</button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {student && (
        <div className="card p-4">
          <h5>Certificat de scolarité</h5>
          <p><strong>Étudiant :</strong> {student.nom} {student.prenoms}</p>
          <p><strong>Email :</strong> {student.email || "-"}</p>
          <p><strong>Téléphone :</strong> {student.telephone || "-"}</p>
          <div className="alert alert-secondary">Le certificat est prêt à être généré.</div>
          <button className="btn btn-success mt-3" onClick={handleDownloadPdf}>
            Télécharger le certificat en PDF
          </button>
        </div>
      )}
    </div>
  );
}
