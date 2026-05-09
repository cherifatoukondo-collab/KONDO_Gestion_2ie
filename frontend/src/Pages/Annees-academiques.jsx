import ResourceManager from "../Components/ResourceManager";

export default function AnneesAcademiques() {
  return (
    <ResourceManager
      title="Années académiques"
      description="Gérez les années académiques actives et leurs périodes."
      endpoint="/api/annees-academiques"
      fields={[
        { name: "libelle", label: "Libellé", placeholder: "Ex: 2025-2026", type: "text" },
        { name: "date_debut", label: "Date de début", type: "date" },
        { name: "date_fin", label: "Date de fin", type: "date" },
        { name: "est_active", label: "Année active", type: "checkbox", placeholder: "Activer cette année" },
      ]}
    />
  );
}
