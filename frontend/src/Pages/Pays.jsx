import ResourceManager from "../Components/ResourceManager";

export default function Pays() {
  return (
    <ResourceManager
      title="Pays"
      description="Gérez la liste des pays et leurs codes ISO."
      endpoint="/api/pays"
      fields={[
        { name: "libelle", label: "Nom du pays", placeholder: "Ex: Maroc", type: "text" },
        { name: "nationalite", label: "Nationalité", placeholder: "Ex: Marocaine", type: "text" },
        { name: "code", label: "Code pays", placeholder: "Ex: MAR", type: "text" },
        { name: "iso", label: "Code ISO", placeholder: "Ex: 0", type: "text" },
      ]}
    />
  );
}
