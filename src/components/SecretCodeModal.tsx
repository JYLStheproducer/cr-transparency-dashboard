import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck } from "lucide-react";
import crLogo from "@/assets/cr-logo.png";

export interface Membre {
  nom: string;
  role: string;
  password: string;
}

// Membres pré-enregistrés avec leurs mots de passe
export const MEMBRES_REGISTRES: Membre[] = [
  { nom: "Amadou Diallo", role: "Président", password: "pres2026" },
  { nom: "Fatou Ndiaye", role: "Trésorier", password: "tres2026" },
  { nom: "Ibrahima Sow", role: "Secrétaire", password: "sec2026" },
  { nom: "Mariama Ba", role: "Vice-Président", password: "vice2026" },
  { nom: "Ousmane Fall", role: "Chargé de la Com", password: "com2026" }
];

interface SecretCodeModalProps {
  isOpen: boolean;
  onSuccess: (membre: Membre) => void;
}

const SecretCodeModal = ({ isOpen, onSuccess }: SecretCodeModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const membre = MEMBRES_REGISTRES.find(m => m.password === password);
    
    if (membre) {
      localStorage.setItem("cr_access", "granted");
      localStorage.setItem("cr_membre", JSON.stringify(membre));
      onSuccess(membre);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className={`sm:max-w-md border-primary/20 bg-card ${isShaking ? 'animate-shake' : ''}`}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center items-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <img src={crLogo} alt="CR Logo" className="h-16 w-16 object-contain" />
          </div>
          <DialogTitle className="text-2xl font-display text-primary">
            Espace Privé du CR
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Veuillez entrer votre mot de passe personnel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`pl-10 h-12 text-center text-lg tracking-widest font-mono ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              Mot de passe incorrect. Veuillez réessayer.
            </p>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold gap-2">
            <ShieldCheck className="h-5 w-5" />
            Accéder au Dashboard
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Réservé aux membres autorisés du CR
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SecretCodeModal;
