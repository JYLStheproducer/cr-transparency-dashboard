// src/services/supabaseAuthService.ts
import { supabase } from '@/lib/supabaseClient';
import { Membre } from '@/types/data';

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signInWithMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin, // Redirection après confirmation
    },
  });

  if (error) throw error;
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData // Informations supplémentaires de l'utilisateur
    }
  });

  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Fonction pour générer un mot de passe temporaire pour un membre
export const generateTempPassword = (membre: Membre): string => {
  // Générer un mot de passe basé sur le nom du membre
  const nomParts = membre.nom.trim().split(' ');
  if (nomParts.length < 2) {
    return nomParts[0].substring(0, 4).toLowerCase() + '2026';
  }
  const firstName = nomParts[0];
  const lastName = nomParts[nomParts.length - 1];
  return firstName.substring(0, 2).toLowerCase() + lastName.substring(lastName.length - 2).toLowerCase() + '2026';
};