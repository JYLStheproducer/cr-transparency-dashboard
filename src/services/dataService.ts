import { DashboardData } from "@/types/data";

export const fetchDataFromJson = async (): Promise<DashboardData> => {
  try {
    console.log("Tentative de chargement des données depuis /data.json");
    const response = await fetch("/data.json");
    console.log("Réponse reçue:", response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des données: ${response.status} ${response.statusText}`);
    }
    
    const jsonData: DashboardData = await response.json();
    console.log("Données chargées avec succès:", jsonData);
    return jsonData;
  } catch (err) {
    console.error("Erreur lors du chargement des données:", err);
    throw err;
  }
};

export const updateMembersInData = (data: DashboardData, newMembre: any): DashboardData => {
  return {
    ...data,
    membres: [...data.membres, newMembre]
  };
};