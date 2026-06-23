import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Trophy, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const navLinks = [
    { label: 'Charities', href: '/charities' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-card border-b border-border"
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-ink">
              Golf<span className="text-brand">ForGood</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-ink">{user?.full_name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-border shadow-elevated py-1 z-50"
                      onMouseLeave={() => setUserMenu(false)}
                    >
                      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-surface">
                        <LayoutDashboard className="w-4 h-4 text-brand" /> Dashboard
                      </Link>
                      <hr className="my-1 border-border" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost btn-md">Log in</Link>
                <Link to="/register" className="btn-primary btn-md">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl hover:bg-surface">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border"
          >
            <div className="container-app py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} className="py-2 text-sm font-medium text-ink-muted hover:text-ink">
                  {link.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              {isAuthenticated ? (
                <>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="btn-ghost btn-md w-full justify-start">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-danger btn-md">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost btn-md">Log in</Link>
                  <Link to="/register" className="btn-primary btn-md">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
