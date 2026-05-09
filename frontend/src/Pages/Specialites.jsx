import ResourceManager from "../Components/ResourceManager";

export default function Specialites() {
  return (
    <ResourceManager
      title="Specialites"
      description="Gerez les specialites associees aux filieres."
      endpoint="/api/specialites"
      fields={[
        { name: "libelle", label: "Libelle", placeholder: "Nom de la specialite", type: "text" },
        { name: "filieres_id", label: "Filiere ID", placeholder: "ID de la filiere", type: "number" },
        { name: "description", label: "Description", placeholder: "Description de la specialite", type: "textarea", fullWidth: true },
      ]}
    />
  );
}
