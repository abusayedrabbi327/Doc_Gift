import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="tracking-tight">Gift Exchange</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Smart credit-based gift exchange platform connecting doctors with pharmaceutical companies.
            </p>
          </div>

          <div>
            <h3 className="mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">For Doctors</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">For Sales Reps</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">For Companies</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>support@giftexchange.com</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2026 Gift Exchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
