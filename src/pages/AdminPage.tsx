import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save, Plus, Trash2 } from "lucide-react";
import { DashboardData } from "@/types/data";
import { fetchDashboardData, addMember, addTransaction, addNews, updateMember, updateTransaction, updateNews } from "@/services/supabaseDataService";

const AdminPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // États pour les formulaires
  const [newMember, setNewMember] = useState({ nom: "", role: "" });
  const [newTransaction, setNewTransaction] = useState({ date: "", motif: "", montant: "", type: "cotisation" });
  const [newNews, setNewNews] = useState({ date: "", titre: "", texte: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchDashboardData();
      setData(result);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des données: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember(newMember);
      setSuccess("Membre ajouté avec succès !");
      setNewMember({ nom: "", role: "" });
      loadData(); // Recharger les données
    } catch (err) {
      setError("Erreur lors de l'ajout du membre: " + (err as Error).message);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction(newTransaction);
      setSuccess("Transaction ajoutée avec succès !");
      setNewTransaction({ date: "", motif: "", montant: "", type: "cotisation" });
      loadData(); // Recharger les données
    } catch (err) {
      setError("Erreur lors de l'ajout de la transaction: " + (err as Error).message);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNews(newNews);
      setSuccess("Actualité ajoutée avec succès !");
      setNewNews({ date: "", titre: "", texte: "" });
      loadData(); // Recharger les données
    } catch (err) {
      setError("Erreur lors de l'ajout de l'actualité: " + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p>Chargement de l'interface d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Interface d'Administration</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4">
            <Save className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="membres" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="membres">Membres</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="news">Actualités</TabsTrigger>
            <TabsTrigger value="caisse">Caisse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="membres" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un membre</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={newMember.nom}
                        onChange={(e) => setNewMember({...newMember, nom: e.target.value})}
                        placeholder="Nom complet"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Input
                        id="role"
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                        placeholder="Rôle"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter le membre
                  </Button>
                </form>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Membres existants</h3>
                  <div className="space-y-2">
                    {data?.membres.map((membre, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <span className="font-medium">{membre.nom}</span> - {membre.role}
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="cotisation">Cotisation</option>
                        <option value="depense">Dépense</option>
                        <option value="revenu">Revenu</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="motif">Motif</Label>
                    <Input
                      id="motif"
                      value={newTransaction.motif}
                      onChange={(e) => setNewTransaction({...newTransaction, motif: e.target.value})}
                      placeholder="Motif de la transaction"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="montant">Montant</Label>
                    <Input
                      id="montant"
                      value={newTransaction.montant}
                      onChange={(e) => setNewTransaction({...newTransaction, montant: e.target.value})}
                      placeholder="+10000 ou -5000"
                      required
                    />
                  </div>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter la transaction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une actualité</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <div>
                    <Label htmlFor="news_date">Date</Label>
                    <Input
                      id="news_date"
                      type="date"
                      value={newNews.date}
                      onChange={(e) => setNewNews({...newNews, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      value={newNews.titre}
                      onChange={(e) => setNewNews({...newNews, titre: e.target.value})}
                      placeholder="Titre de l'actualité"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="texte">Texte</Label>
                    <Textarea
                      id="texte"
                      value={newNews.texte}
                      onChange={(e) => setNewNews({...newNews, texte: e.target.value})}
                      placeholder="Contenu de l'actualité"
                      required
                    />
                  </div>
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter l'actualité
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="caisse" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la caisse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Solde actuel</Label>
                      <div className="text-2xl font-bold text-green-600">
                        {data?.infos_caisse.solde} {data?.infos_caisse.devise}
                      </div>
                    </div>
                    <div>
                      <Label>Devise</Label>
                      <div className="text-xl font-semibold">
                        {data?.infos_caisse.devise}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Modifier le solde</Label>
                    <Input
                      placeholder="Nouveau solde"
                      // Ici, vous implémenteriez la fonctionnalité de mise à jour
                    />
                    <Button className="mt-2 gap-2">
                      <Save className="h-4 w-4" />
                      Mettre à jour
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;