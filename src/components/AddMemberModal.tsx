import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface Membre {
  nom: string;
  role: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (membre: Membre) => void;
}

const AddMemberModal = ({ isOpen, onClose, onAddMember }: AddMemberModalProps) => {
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      setError("Le nom est requis");
      return;
    }
    
    if (!role.trim()) {
      setError("Le rôle est requis");
      return;
    }
    
    onAddMember({ nom: nom.trim(), role });
    setNom("");
    setRole("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-primary flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Ajouter un membre
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un nouveau membre
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="nom" className="text-sm font-medium text-foreground mb-1 block">
              Nom complet
            </label>
            <Input
              id="nom"
              type="text"
              placeholder="Entrez le nom complet"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                setError("");
              }}
            />
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-medium text-foreground mb-1 block">
              Rôle
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Président">Président</SelectItem>
                <SelectItem value="Vice-Président">Vice-Président</SelectItem>
                <SelectItem value="Trésorier">Trésorier</SelectItem>
                <SelectItem value="Secrétaire">Secrétaire</SelectItem>
                <SelectItem value="Chargé de la Com">Chargé de la Com</SelectItem>
                <SelectItem value="Membre">Membre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;