import { useState, useEffect } from "react";
import SecretCodeModal from "@/components/SecretCodeModal";
import Sidebar from "@/components/Sidebar";
import BalanceCard from "@/components/BalanceCard";
import TransactionsTable from "@/components/TransactionsTable";
import NewsFeed from "@/components/NewsFeed";
import MembersTable from "@/components/MembersTable";
import { DashboardData } from "@/types/data";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const access = localStorage.getItem("cr_access");
    if (access === "granted") {
      setIsAuthenticated(true);
      setShowModal(false);
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

  const handleAccessGranted = () => {
    setIsAuthenticated(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cr_access");
    setIsAuthenticated(false);
    setShowModal(true);
    setData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SecretCodeModal isOpen={showModal} onSuccess={handleAccessGranted} />
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
          {/* Header */}
          <header className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Bienvenue sur le Dashboard
            </h1>
            <p className="text-muted-foreground">
              Gérez et suivez les activités du Comité en toute transparence
            </p>
          </header>

          {/* Dashboard View */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              <BalanceCard data={data?.infos_caisse || null} />
              
              <div className="grid lg:grid-cols-2 gap-8">
                <TransactionsTable transactions={data?.transactions.slice(0, 3) || []} />
                <NewsFeed news={data?.news.slice(0, 2) || []} />
              </div>
              
              <MembersTable membres={data?.membres || []} />
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
            <MembersTable membres={data?.membres || []} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
