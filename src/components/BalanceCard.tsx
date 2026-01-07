import { Wallet, TrendingUp } from "lucide-react";
import { InfosCaisse } from "@/types/data";

interface BalanceCardProps {
  data: InfosCaisse | null;
}

const BalanceCard = ({ data }: BalanceCardProps) => {
  if (!data) {
    return (
      <div className="bg-balance-bg border-2 border-balance-border rounded-2xl p-8 animate-pulse-soft">
        <div className="h-8 w-32 bg-muted rounded mb-4" />
        <div className="h-12 w-48 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-balance-bg border-2 border-balance-border rounded-2xl p-8 shadow-balance animate-fade-in">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-success/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
            <Wallet className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Solde Total de la Caisse</p>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>À jour</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-display font-bold text-foreground">
            {data.solde}
          </span>
          <span className="text-xl font-semibold text-muted-foreground">
            {data.devise}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
