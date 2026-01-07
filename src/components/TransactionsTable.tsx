import { ArrowUpCircle, ArrowDownCircle, Calendar, FileText } from "lucide-react";
import { Transaction } from "@/types/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const formatMontant = (montant: string) => {
    const isPositive = montant.startsWith("+");
    const value = montant.replace(/[+-]/, "");
    const formatted = new Intl.NumberFormat("fr-FR").format(parseInt(value));
    
    return {
      isPositive,
      display: `${isPositive ? "+" : "-"} ${formatted}`,
    };
  };

  return (
    <div className="bg-card rounded-2xl border shadow-card overflow-hidden animate-fade-in">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              Transactions
            </h2>
            <p className="text-sm text-muted-foreground">
              Historique des mouvements de caisse
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead className="font-semibold">Motif</TableHead>
              <TableHead className="text-right font-semibold">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => {
              const { isPositive, display } = formatMontant(transaction.montant);
              
              return (
                <TableRow 
                  key={index} 
                  className="hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <ArrowUpCircle className="h-4 w-4 text-positive flex-shrink-0" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-negative flex-shrink-0" />
                      )}
                      <span className="font-medium">{transaction.motif}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${
                    isPositive ? "text-positive" : "text-negative"
                  }`}>
                    {display} FCFA
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;
