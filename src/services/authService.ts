import { Membre } from "@/types/data";

export const generatePasswordFromName = (nom: string): string => {
  // Prendre les deux premières lettres du prénom et les deux dernières lettres du nom
  const nomParts = nom.trim().split(' ');
  if (nomParts.length < 2) {
    return nom.substring(0, 4).toLowerCase() + '2026';
  }
  const firstName = nomParts[0];
  const lastName = nomParts[nomParts.length - 1];
  return firstName.substring(0, 2).toLowerCase() + lastName.substring(lastName.length - 2).toLowerCase() + '2026';
};

export const findMembreByPassword = (membres: Membre[], password: string): Membre | undefined => {
  return membres.find(m => {
    const generatedPassword = generatePasswordFromName(m.nom);
    return generatedPassword === password;
  });
};

export const authenticateMembre = (membre: Membre): void => {
  localStorage.setItem("cr_access", "granted");
  localStorage.setItem("cr_membre", JSON.stringify(membre));
};

export const getAuthenticatedMembre = (): Membre | null => {
  const membreStored = localStorage.getItem("cr_membre");
  if (membreStored) {
    try {
      return JSON.parse(membreStored);
    } catch {
      localStorage.removeItem("cr_membre");
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("cr_access") === "granted";
};

export const logout = (): void => {
  localStorage.removeItem("cr_access");
  localStorage.removeItem("cr_membre");
};