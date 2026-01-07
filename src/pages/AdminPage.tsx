import { useState } from "react";
import JsonEditor from "@/components/JsonEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";

const AdminPage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mot de passe admin simple pour l'accès à l'éditeur
    // Dans une vraie application, vous voudriez un système plus sécurisé
    if (password === "admin2026") { // Mot de passe par défaut
      setAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Accès Administrateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Mot de passe d'administration
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Entrez le mot de passe..."
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              <Button type="submit" className="w-full gap-2">
                <Shield className="h-4 w-4" />
                Accéder à l'administration
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Mot de passe par défaut: <code>admin2026</code><br />
                Pour des raisons de sécurité, changez ce mot de passe dans le code.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Interface d'Administration
          </h1>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Instructions importantes
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
            <li>Cet éditeur vous permet de modifier les données du dashboard</li>
            <li>Pour que vos modifications soient permanentes, vous devez sauvegarder les changements dans le fichier <code className="bg-blue-100 px-1 rounded">public/data.json</code> de votre dépôt GitHub</li>
            <li>Utilisez le bouton "Sauvegarder" pour valider vos modifications localement</li>
          </ul>
        </div>

        <JsonEditor />
      </div>
    </div>
  );
};

export default AdminPage;