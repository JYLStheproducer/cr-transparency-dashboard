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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [currentMembre, setCurrentMembre] = useState<Membre | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const canEdit = currentMembre?.role === "Chargé de la Com";

  // Fonction pour générer un mot de passe à partir du nom
  const generatePasswordFromName = (nom: string): string => {
    // Prendre les deux premières lettres du prénom et les deux dernières lettres du nom
    const nomParts = nom.trim().split(' ');
    if (nomParts.length < 2) {
      return nom.substring(0, 4).toLowerCase() + '2026';
    }
    const firstName = nomParts[0];
    const lastName = nomParts[nomParts.length - 1];
    return firstName.substring(0, 2).toLowerCase() + lastName.substring(lastName.length - 2).toLowerCase() + '2026';
  };

  useEffect(() => {
    const access = localStorage.getItem("cr_access");
    const membreStored = localStorage.getItem("cr_membre");

    if (access === "granted" && membreStored) {
      try {
        const membre = JSON.parse(membreStored);
        setCurrentMembre(membre);
        setIsAuthenticated(true);
        setShowModal(false);
      } catch {
        localStorage.removeItem("cr_access");
        localStorage.removeItem("cr_membre");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      const jsonData: DashboardData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessGranted = (membre: Membre) => {
    setCurrentMembre(membre);
    setIsAuthenticated(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cr_access");
    localStorage.removeItem("cr_membre");
    setCurrentMembre(null);
    setIsAuthenticated(false);
    setShowModal(true);
    setData(null);
  };

  const handleAddMember = (membre: Membre) => {
    if (!data) return;

    // Mettre à jour les données locales
    const newData = {
      ...data,
      membres: [...data.membres, membre]
    };

    setData(newData);

    // Afficher un message à l'utilisateur pour lui indiquer de modifier le fichier data.json
    alert("Membre ajouté avec succès ! Pour que le changement soit permanent, veuillez ajouter ce membre au fichier public/data.json sur votre serveur.");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SecretCodeModal
          isOpen={showModal}
          onSuccess={handleAccessGranted}
          membres={data?.membres.map(m => ({
            nom: m.nom,
            role: m.role,
            password: generatePasswordFromName(m.nom)
          })) || []}
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
          <Button onClick={fetchData} variant="outline" className="gap-2">
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
      />

      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header avec infos membre */}
          <header className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Bienvenue, {currentMembre?.nom.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground">
                  Gérez et suivez les activités du Comité en toute transparence
                </p>
              </div>
              <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-card">
                <UserCircle className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{currentMembre?.nom}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentMembre?.role}
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
                Vous avez les droits d'édition. Pour modifier les données, éditez le fichier <code className="bg-emerald-100 px-1 rounded">public/data.json</code>
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