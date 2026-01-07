import { useState } from "react";
import { Wallet, Newspaper, Users, LayoutDashboard, LogOut, Settings, Menu } from "lucide-react";
import crLogo from "@/assets/cr-logo.png";
import { Membre } from "@/types/data";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  currentMembre?: Membre;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: Wallet },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "membres", label: "Membres", icon: Users },
];

const Sidebar = ({ activeSection, onSectionChange, onLogout, isAdmin = false, currentMembre }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Bouton de menu mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar - Desktop et Mobile */}
      <aside className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0 md:w-64"
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center overflow-hidden">
              <img src={crLogo} alt="CR Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-sidebar-foreground">
                Dashboard CR
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Espace Membre</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileMenuOpen(false); // Fermer le menu sur mobile après sélection
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {(isAdmin || (currentMembre?.nom?.includes("MIGOLET") && currentMembre?.nom?.includes("JEAN YVES"))) && (
            <a
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)} // Fermer le menu sur mobile après sélection
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Administration</span>
            </a>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
