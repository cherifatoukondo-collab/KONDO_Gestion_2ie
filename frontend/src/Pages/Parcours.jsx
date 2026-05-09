import ResourceManager from "../Components/ResourceManager";

export default function Parcours() {
  return (
    <ResourceManager
      title="Parcours"
      description="Créez des parcours en associant cycle, niveau et spécialité."
      endpoint="/api/parcours"
      fields={[
        { name: "libelle", label: "Libellé", placeholder: "Nom du parcours", type: "text" },
        { name: "specialites_id", label: "Spécialité ID", placeholder: "ID de la spécialité", type: "number" },
        { name: "niveaux_id", label: "Niveau ID", placeholder: "ID du niveau", type: "number" },
        { name: "cycles_id", label: "Cycle ID", placeholder: "ID du cycle", type: "number" },
      ]}
    />
  );
}
