import { useNavigate } from 'react-router';
import { Button } from './Button';
import { Heart } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
            </div>
            <span className="text-sm md:text-base text-foreground tracking-tight">Gift Exchange</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#features" className="text-sm text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-foreground hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="text-sm text-foreground hover:text-primary transition-colors">Benefits</a>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="text-xs md:text-sm px-3 md:px-4">
              Login
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')} className="text-xs md:text-sm px-3 md:px-4">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
