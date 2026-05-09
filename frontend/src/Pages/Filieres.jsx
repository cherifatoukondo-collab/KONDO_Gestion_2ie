import ResourceManager from "../Components/ResourceManager";

export default function Filieres() {
  return (
    <ResourceManager
      title="Filières"
      description="Gérez les filières de votre établissement."
      endpoint="/api/filieres"
      fields={[
        { name: "code", label: "Code", placeholder: "Ex: INFO", type: "text" },
        { name: "libelle", label: "Libellé", placeholder: "Nom de la filière", type: "text" },
        { name: "description", label: "Description", placeholder: "Détails complémentaires", type: "textarea", fullWidth: true },
      ]}
    />
  );
}
