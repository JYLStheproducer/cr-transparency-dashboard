export interface Transaction {
  date: string;
  motif: string;
  montant: string;
}

export interface News {
  date: string;
  titre: string;
  texte: string;
}

export interface Membre {
  nom: string;
  role: string;
}

export interface InfosCaisse {
  solde: string;
  devise: string;
}

export interface DashboardData {
  infos_caisse: InfosCaisse;
  transactions: Transaction[];
  news: News[];
  membres: Membre[];
}
