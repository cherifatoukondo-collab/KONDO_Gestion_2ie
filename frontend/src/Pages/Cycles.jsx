import ResourceManager from "../Components/ResourceManager";

export default function Cycles() {
  return (
    <ResourceManager
      title="Cycles"
      description="Créez et modifiez les cycles d'étude disponibles."
      endpoint="/api/cycles"
      fields={[
        { name: "libelle", label: "Libellé", placeholder: "Nom du cycle", type: "text" },
        { name: "duree_annees", label: "Durée (années)", placeholder: "Ex: 3", type: "number" },
      ]}
    />
  );
}
