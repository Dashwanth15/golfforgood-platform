import { NavLink, useNavigate } from 'react-router-dom';

import {
  Trophy, LayoutDashboard, Target, Heart, Ticket, Award,
  Users, Gift, Settings, BarChart3, LogOut, X, Shield, User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const subscriberLinks = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Target, label: 'My Scores', href: '/dashboard/scores' },
    { icon: Heart, label: 'My Charity', href: '/dashboard/charity' },
    { icon: Gift, label: 'Donations', href: '/dashboard/donations' },
    { icon: Ticket, label: 'Draws', href: '/dashboard/draws' },
    { icon: Award, label: 'Winnings', href: '/dashboard/winnings' },
    { icon: User, label: 'Profile Settings', href: '/dashboard/profile' },
  ];

  const adminLinks = [
    { icon: BarChart3, label: 'Analytics', href: '/admin' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Subscriptions', href: '/admin/subscriptions' },
    { icon: Heart, label: 'Charities', href: '/admin/charities' },
    { icon: Ticket, label: 'Draws', href: '/admin/draws' },
    { icon: Gift, label: 'Winners', href: '/admin/winners' },
    { icon: User, label: 'Profile Settings', href: '/dashboard/profile' },
  ];

  const links = isAdmin ? adminLinks : subscriberLinks;

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-ink">Golf<span className="text-brand">ForGood</span></span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface">
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 mx-3 mt-3 rounded-xl bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-brand/20">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-brand">{user?.full_name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-ink truncate">{user?.full_name}</p>
            <div className="flex items-center gap-1">
              {isAdmin && <Shield className="w-3 h-3 text-[#2563EB]" />}
              <p className="text-xs text-ink-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
        {links.map(({ icon: Icon, label, href }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/dashboard' || href === '/admin'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button onClick={handleLogout} className="sidebar-link w-full text-danger hover:bg-red-50 hover:text-danger">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
