import { useState, useEffect } from "react";
import SecretCodeModal, { Membre } from "@/components/SecretCodeModal";
import Sidebar from "@/components/Sidebar";
import BalanceCard from "@/components/BalanceCard";
import TransactionsTable from "@/components/TransactionsTable";
import NewsFeed from "@/components/NewsFeed";
import MembersTable from "@/components/MembersTable";
import { DashboardData } from "@/types/data";
import { Loader2, RefreshCw, UserCircle, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  signInWithPassword,
  signInWithMagicLink,
  getCurrentUser,
  onAuthStateChange,
  generateTempPassword
} from "@/services/supabaseAuthService";
import { fetchDashboardData, addMember } from "@/services/supabaseDataService";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [currentMembre, setCurrentMembre] = useState<any>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initialisé à false
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // État spécifique pour le chargement de l'auth
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const canEdit = currentMembre?.role === "Chargé de la Com";

  useEffect(() => {
    // Vérifier l'état d'authentification
    const checkAuth = async () => {
      console.log("Vérification de l'état d'authentification...");
      try {
        const user = await getCurrentUser();
        console.log("Utilisateur récupéré:", user);
        if (user) {
          setCurrentMembre(user);
          setIsAuthenticated(true);
          setShowModal(false);
          console.log("Utilisateur connecté, modal fermé");
        } else {
          console.log("Aucun utilisateur connecté, affichage du modal");
        }
      } catch (err) {
        console.error("Erreur d'authentification:", err);
      }
      setIsLoadingAuth(false); // Terminer le chargement de l'authentification
    };

    checkAuth();

    // Écouter les changements d'authentification
    const authSubscription = onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", event);
      if (event === 'SIGNED_IN') {
        console.log("Utilisateur connecté via Supabase");
        setIsAuthenticated(true);
        setShowModal(false);
      } else if (event === 'SIGNED_OUT') {
        console.log("Utilisateur déconnecté via Supabase");
        setIsAuthenticated(false);
        setShowModal(true);
      }
    });

    return () => {
      if (authSubscription && authSubscription.data && authSubscription.data.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    console.log('Début du chargement des données du dashboard...');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Appel de fetchDashboardData...');
      const dashboardData = await fetchDashboardData();
      console.log('Données récupérées, mise à jour du state:', dashboardData);
      setData(dashboardData);
      console.log('State mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : "Erreur de chargement des données");
    } finally {
      setIsLoading(false);
      console.log('Fin du chargement des données, isLoading:', false);
    }
  };

  const handleAccessGranted = (membre: Membre) => {
    setCurrentMembre(membre);
    setIsAuthenticated(true);
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      // Déconnexion de Supabase
      // (Vous devrez implémenter cette fonction dans supabaseAuthService.ts)
      // await signOut();
      setCurrentMembre(null);
      setIsAuthenticated(false);
      setShowModal(true);
      setData(null);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const handleAddMember = async (membre: Membre) => {
    if (!data) return;

    try {
      // Ajouter le membre à la base de données Supabase
      await addMember(membre);

      // Recharger les données
      await loadDashboardData();

      alert("Membre ajouté avec succès dans la base de données !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre:", error);
      alert("Erreur lors de l'ajout du membre");
    }
  };

  if (!isAuthenticated) {
    // Afficher un loader pendant le chargement de l'authentification
    if (isLoadingAuth) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
            <p>Vérification de l'état de connexion...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SecretCodeModal
          isOpen={showModal}
          onSuccess={handleAccessGranted}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadDashboardData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        isAdmin={canEdit}
        currentMembre={currentMembre}
      />

      <main className="md:ml-64 min-h-screen p-4 md:p-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header avec infos membre */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Bienvenue, {currentMembre?.email || currentMembre?.nom?.split(' ')[0] || 'Membre'}
                </h1>
                <p className="text-muted-foreground">
                  Gérez et suivez les activités du Comité en toute transparence
                </p>
              </div>
              <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-card">
                <UserCircle className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{currentMembre?.email || currentMembre?.nom || 'Membre'}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentMembre?.role || 'Membre'}
                    </Badge>
                    {canEdit && (
                      <Badge className="text-xs bg-emerald-600 text-white gap-1">
                        <Shield className="h-3 w-3" />
                        Éditeur
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 text-sm">
                <Shield className="h-4 w-4 inline mr-2" />
                Vous avez les droits d'édition. Les modifications sont sauvegardées dans la base de données.
              </div>
            )}
          </header>

          {/* Dashboard View */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              <BalanceCard data={data?.infos_caisse || null} />

              <div className="grid lg:grid-cols-2 gap-8">
                <TransactionsTable transactions={data?.transactions.slice(0, 3) || []} />
                <NewsFeed news={data?.news.slice(0, 2) || []} />
              </div>

              <MembersTable
                membres={data?.membres || []}
                canEdit={canEdit}
                onAddMember={handleAddMember}
              />
            </div>
          )}

          {/* Transactions View */}
          {activeSection === "transactions" && (
            <div className="space-y-6">
              <BalanceCard data={data?.infos_caisse || null} />
              <TransactionsTable transactions={data?.transactions || []} />
            </div>
          )}

          {/* News View */}
          {activeSection === "news" && (
            <NewsFeed news={data?.news || []} />
          )}

          {/* Members View */}
          {activeSection === "membres" && (
            <MembersTable
              membres={data?.membres || []}
              canEdit={canEdit}
              onAddMember={handleAddMember}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;