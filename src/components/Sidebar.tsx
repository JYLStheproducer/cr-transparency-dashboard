import { Wallet, Newspaper, Users, LayoutDashboard, LogOut, Settings } from "lucide-react";
import crLogo from "@/assets/cr-logo.png";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: Wallet },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "membres", label: "Membres", icon: Users },
];

const Sidebar = ({ activeSection, onSectionChange, onLogout, isAdmin = false }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-sidebar-accent flex items-center justify-center overflow-hidden">
            <img src={crLogo} alt="CR Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-sidebar-foreground">
              Dashboard CR
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Espace Membre</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 animate-slide-in ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {isAdmin && (
          <a
            href="/admin"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Administration</span>
          </a>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
