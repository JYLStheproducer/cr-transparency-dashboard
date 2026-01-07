// src/services/supabaseDataService.ts
import { supabase } from '@/lib/supabaseClient';
import { DashboardData } from '@/types/data';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log('Début du chargement des données depuis Supabase...');

    // Récupérer les données depuis Supabase
    const { data: caisseData, error: caisseError } = await supabase
      .from('caisse')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (caisseError) {
      console.error('Erreur lors du chargement de la caisse:', caisseError);
    }

    console.log('Données de caisse chargées:', caisseData);

    const { data: membresData, error: membresError } = await supabase
      .from('membres')
      .select('*')
      .order('created_at', { ascending: true });

    if (membresError) {
      console.error('Erreur lors du chargement des membres:', membresError);
    }

    console.log('Données des membres chargées:', membresData);

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (transactionsError) {
      console.error('Erreur lors du chargement des transactions:', transactionsError);
    }

    console.log('Données des transactions chargées:', transactionsData);

    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (newsError) {
      console.error('Erreur lors du chargement des news:', newsError);
    }

    console.log('Données des news chargées:', newsData);

    const result: DashboardData = {
      infos_caisse: caisseData?.[0] || { solde: '0', devise: 'FCFA' },
      membres: membresData || [],
      transactions: transactionsData || [],
      news: newsData || []
    };

    console.log('Données complètes chargées:', result);
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
  
  if (error) throw error;
  return data;
};

export const addTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction]);
  
  if (error) throw error;
  return data;
};

export const addNews = async (news: any) => {
  const { data, error } = await supabase
    .from('news')
    .insert([news]);
  
  if (error) throw error;
  return data;
};