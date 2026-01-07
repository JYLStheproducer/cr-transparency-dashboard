import { useState } from "react";
import { Users, UserCircle, Shield, Plus } from "lucide-react";
import { Membre } from "@/types/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddMemberModal from "./AddMemberModal";

interface MembersTableProps {
  membres: Membre[];
  canEdit?: boolean;
  onAddMember?: (membre: Membre) => void;
}

const roleColors: Record<string, string> = {
  "Président": "bg-primary text-primary-foreground",
  "Vice-Président": "bg-primary/80 text-primary-foreground",
  "Trésorier": "bg-success text-success-foreground",
  "Secrétaire": "bg-accent text-accent-foreground",
};

const MembersTable = ({ membres, canEdit = false, onAddMember }: MembersTableProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddMember = (membre: Membre) => {
    if (onAddMember) {
      onAddMember(membre);
    }
    setShowAddModal(false);
  };

  return (
    <div className="bg-card rounded-2xl border shadow-card overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-semibold text-foreground">
              Membres du CR
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Équipe dirigeante
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Nom
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Rôle
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membres.map((membre, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary font-display font-semibold">
                      {membre.nom.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium">{membre.nom}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${roleColors[membre.role] || "bg-secondary text-secondary-foreground"}`}>
                    {membre.role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {canEdit && (
        <AddMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddMember={handleAddMember}
        />
      )}
    </div>
  );
};

export default MembersTable;