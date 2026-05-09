import ResourceManager from "../Components/ResourceManager";

export default function Decisions() {
  return (
    <ResourceManager
      title="Décisions"
      description="Gérez les décisions possibles pour les inscriptions et résultats."
      endpoint="/api/decisions"
      fields={[
        { name: "libelle", label: "Libellé", placeholder: "Ex: Admis", type: "text" },
        { name: "description", label: "Description", placeholder: "Description de la décision", type: "textarea", fullWidth: true },
      ]}
    />
  );
}
