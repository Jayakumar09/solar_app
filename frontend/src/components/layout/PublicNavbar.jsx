import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Wind, Zap, Calculator } from 'lucide-react';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/solar-calculator', label: 'Calculator' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/vision', label: 'Vision' },
    { to: '/why-choose-us', label: 'Why Us' },
    { to: '/faq', label: 'FAQ' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100' : 'bg-gradient-to-r from-primary-900/95 to-primary-800/95 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 transition-all">
                <div className="flex items-center gap-0.5">
                  <Sun className="w-5 h-5 text-white" />
                  <Wind className="w-4 h-4 text-white/90" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">Green Hybrid</span>
              <span className="block text-xs text-amber-300/80 -mt-0.5">Power Solutions</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.to ? 'text-primary-700 bg-primary-100' : scrolled ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/login" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${scrolled ? 'text-gray-600 hover:text-primary-600 border border-gray-200 hover:border-primary-300' : 'text-white/90 hover:text-white border border-white/20 hover:bg-white/10'}`}>
              Login
            </Link>
            <Link to="/quote-request" className="px-5 py-2.5 text-sm font-semibold text-primary-800 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Get Quote
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t animate-slide-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${location.pathname === link.to ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-2 border-t border-gray-100 mt-3">
              <Link to="/login" className="px-4 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg">Login</Link>
              <Link to="/quote-request" className="px-4 py-2.5 text-center text-sm font-semibold text-primary-800 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg">Get Quote</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
