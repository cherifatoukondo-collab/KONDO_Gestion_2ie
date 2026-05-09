import ResourceManager from "../Components/ResourceManager";

export default function Civilites() {
  return (
    <ResourceManager
      title="Civilités"
      description="Gérez les civilités utilisées dans l'application."
      endpoint="/api/civilites"
      fields={[
        { name: "libelle", label: "Libellé", placeholder: "Monsieur / Madame", type: "text" },
        { name: "abreviation", label: "Abréviation", placeholder: "Ex: M. / Mme", type: "text" },
      ]}
    />
  );
}
