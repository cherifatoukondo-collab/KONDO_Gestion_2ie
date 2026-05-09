import { useEffect, useState } from "react";

export default function ResourceManager({ title, endpoint, fields, description }) {
  const initialForm = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : "";
    return acc;
  }, {});

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeValue = (field, value) => {
    if (field.type === "number") {
      return value === "" ? null : Number(value);
    }
    if (field.type === "checkbox") {
      return !!value;
    }
    return value === "" ? null : value;
  };

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Impossible de charger les données.");
      }
      setItems(await response.json());
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = fields.reduce((acc, field) => {
      acc[field.name] = normalizeValue(field, form[field.name]);
      return acc;
    }, {});

    try {
      const response = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Erreur lors de l'enregistrement.");
      }

      resetForm();
      fetchItems();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const nextForm = fields.reduce((acc, field) => {
      acc[field.name] = item[field.name] ?? (field.type === "checkbox" ? false : "");
      return acc;
    }, {});
    setForm(nextForm);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ ATTENTION: Cette action est irréversible !\n\nVoulez-vous vraiment supprimer cet élément ?\nToutes les données associées pourraient être affectées.")) {
      return;
    }

    try {
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Impossible de supprimer cet élément.");
      }
      if (editingId === id) resetForm();
      fetchItems();
    } catch (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>{title}</h2>
          {description && <p className="text-muted">{description}</p>}
        </div>
        <div>
          <button className="btn btn-secondary" type="button" onClick={resetForm}>
            Nouveau
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {fields.map((field) => (
              <div className={field.fullWidth ? "col-12" : "col-12 col-md-6"} key={field.name}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    value={form[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="form-control"
                    placeholder={field.placeholder || ""}
                  />
                ) : field.type === "checkbox" ? (
                  <div className="form-check">
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={!!form[field.name]}
                      className="form-check-input"
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={field.name}>
                      {field.placeholder || field.label}
                    </label>
                  </div>
                ) : (
                  <input
                    id={field.name}
                    type={field.type || "text"}
                    value={form[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="form-control"
                    placeholder={field.placeholder || ""}
                  />
                )}
              </div>
            ))}

            <div className="col-12">
              <button type="submit" className="btn btn-primary me-2">
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
            {error && (
              <div className="col-12">
                <div className="alert alert-danger mb-0">{error}</div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    {fields.filter((field) => field.table !== false).map((field) => (
                      <th key={field.name}>{field.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={fields.filter((field) => field.table !== false).length + 2} className="text-center py-4">
                        Aucune donnée trouvée.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        {fields.filter((field) => field.table !== false).map((field) => (
                          <td key={field.name}>
                            {field.type === "checkbox"
                              ? item[field.name]
                                ? "Oui"
                                : "Non"
                              : item[field.name] ?? "-"}
                          </td>
                        ))}
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => handleEdit(item)}>
                            <svg width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                            Modifier
                          </button>
                          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(item.id)}>
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
          )}
        </div>
      </div>
    </div>
  );
}
