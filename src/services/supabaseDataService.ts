// src/services/supabaseDataService.ts
import { supabase } from '@/lib/supabaseClient';
import { DashboardData } from '@/types/data';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log('Début du chargement des données depuis Supabase...');

    // Récupérer les données depuis Supabase
    console.log('Requête en cours: caisse');
    const { data: caisseData, error: caisseError } = await supabase
      .from('caisse')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (caisseError) {
      console.error('Erreur lors du chargement de la caisse:', caisseError);
    } else {
      console.log('Données de caisse récupérées:', caisseData);
    }

    console.log('Requête en cours: membres');
    const { data: membresData, error: membresError } = await supabase
      .from('membres')
      .select('*')
      .order('created_at', { ascending: true });

    if (membresError) {
      console.error('Erreur lors du chargement des membres:', membresError);
    } else {
      console.log('Données des membres récupérées:', membresData);
    }

    console.log('Requête en cours: transactions');
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (transactionsError) {
      console.error('Erreur lors du chargement des transactions:', transactionsError);
    } else {
      console.log('Données des transactions récupérées:', transactionsData);
    }

    console.log('Requête en cours: news');
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (newsError) {
      console.error('Erreur lors du chargement des news:', newsError);
    } else {
      console.log('Données des news récupérées:', newsData);
    }

    const result: DashboardData = {
      infos_caisse: caisseData?.[0] || { solde: '0', devise: 'FCFA' },
      membres: membresData || [],
      transactions: transactionsData || [],
      news: newsData || []
    };

    console.log('Toutes les données combinées:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    throw error;
  }
};

export const addMember = async (membre: any) => {
  const { data, error } = await supabase
    .from('membres')
    .insert([membre]);

  if (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    throw error;
  }
  console.log('Membre ajouté avec succès:', data);
  return data;
};

export const addTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction]);

  if (error) {
    console.error('Erreur lors de l\'ajout de la transaction:', error);
    throw error;
  }
  console.log('Transaction ajoutée avec succès:', data);
  return data;
};

export const addNews = async (news: any) => {
  const { data, error } = await supabase
    .from('news')
    .insert([news]);

  if (error) {
    console.error('Erreur lors de l\'ajout de l\'actualité:', error);
    throw error;
  }
  console.log('Actualité ajoutée avec succès:', data);
  return data;
};

export const updateMember = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('membres')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    throw error;
  }
  console.log('Membre mis à jour avec succès:', data);
  return data;
};

export const updateTransaction = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    throw error;
  }
  console.log('Transaction mise à jour avec succès:', data);
  return data;
};

export const updateNews = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'actualité:', error);
    throw error;
  }
  console.log('Actualité mise à jour avec succès:', data);
  return data;
};

export const deleteMember = async (id: string) => {
  const { data, error } = await supabase
    .from('membres')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    throw error;
  }
  console.log('Membre supprimé avec succès:', data);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression de la transaction:', error);
    throw error;
  }
  console.log('Transaction supprimée avec succès:', data);
  return data;
};

export const deleteNews = async (id: string) => {
  const { data, error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression de l\'actualité:', error);
    throw error;
  }
  console.log('Actualité supprimée avec succès:', data);
  return data;
};