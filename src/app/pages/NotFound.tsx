import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center p-4 md:p-6">
      <div className="text-center text-white max-w-lg">
        <h1 className="text-7xl md:text-9xl mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl mb-4 md:mb-6">Page Not Found</h2>
        <p className="text-lg md:text-xl text-white/80 mb-6 md:mb-8 leading-relaxed px-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center px-4">
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
