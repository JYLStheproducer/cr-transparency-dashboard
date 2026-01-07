import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck } from "lucide-react";
import crLogo from "@/assets/cr-logo.png";
import { signInWithPassword, signInWithMagicLink } from "@/services/supabaseAuthService";

export interface Membre {
  nom: string;
  role: string;
  password: string;
}

interface SecretCodeModalProps {
  isOpen: boolean;
  onSuccess: (membre: Membre) => void;
}

const SecretCodeModal = ({ isOpen, onSuccess }: SecretCodeModalProps) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [useEmail, setUseEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (useEmail) {
        // Connexion par email avec mot de passe
        await signInWithMagicLink(email);
        alert("Un lien de connexion vous a été envoyé par email");
      } else {
        // Connexion avec mot de passe basé sur le nom
        // Pour le moment, on simule une connexion réussie
        // Dans une vraie implémentation, vous devriez vérifier le mot de passe
        console.log("Tentative de connexion avec le mot de passe:", password);

        // Pour l'instant, on suppose que la connexion est réussie
        // Vous devrez implémenter la logique de vérification du mot de passe
        onSuccess({ nom: "Membre", role: "Membre", password });
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
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
            {useEmail
              ? "Entrez votre email pour recevoir un lien de connexion"
              : "Veuillez entrer votre mot de passe personnel"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {useEmail ? (
            <div className="relative">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                className="h-12 text-center"
                autoFocus
              />
            </div>
          ) : (
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
          )}

          {error && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              {useEmail
                ? "Erreur d'envoi de l'email. Veuillez réessayer."
                : "Mot de passe incorrect. Veuillez réessayer."}
            </p>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold gap-2">
            <ShieldCheck className="h-5 w-5" />
            {useEmail ? "Envoyer le lien" : "Accéder au Dashboard"}
          </Button>
        </form>

        <div className="text-center mt-2">
          <button
            onClick={() => setUseEmail(!useEmail)}
            className="text-sm text-primary hover:underline"
          >
            {useEmail
              ? "Se connecter avec un mot de passe"
              : "Se connecter avec un email"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Réservé aux membres autorisés du CR
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SecretCodeModal;