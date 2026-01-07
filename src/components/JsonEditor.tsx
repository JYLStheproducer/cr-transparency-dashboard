import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save, RotateCcw } from "lucide-react";

const JsonEditor = () => {
  const [jsonData, setJsonData] = useState("");
  const [originalData, setOriginalData] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      setJsonData(jsonString);
      setOriginalData(jsonString);
      setError("");
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des données: " + err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Vérifier que le JSON est valide
      JSON.parse(jsonData);
      
      // Envoyer les données vers une API temporaire (à remplacer par une vraie solution)
      // Pour le moment, on affiche juste un message d'information
      setSuccess("Données mises à jour avec succès ! Pour que les changements soient permanents, vous devez modifier le fichier public/data.json dans votre dépôt GitHub.");
      setError("");
    } catch (err) {
      setError("Format JSON invalide: " + err.message);
      setSuccess("");
    }
  };

  const handleReset = () => {
    setJsonData(originalData);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Éditeur de données</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Modifiez les données du dashboard (Attention: sauvegardez vos modifications dans le dépôt GitHub pour qu'elles soient permanentes)
        </p>
      </CardHeader>
      <CardContent>
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
        
        <div className="space-y-4">
          <Textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="font-mono text-sm min-h-[400px]"
            placeholder="Données JSON..."
          />
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
            
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions :</h4>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
            <li>Modifiez les données dans le champ ci-dessus</li>
            <li>Cliquez sur "Sauvegarder" pour valider vos modifications</li>
            <li>Pour que les changements soient permanents, allez dans votre dépôt GitHub et modifiez le fichier <code className="bg-blue-100 px-1 rounded">public/data.json</code></li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonEditor;