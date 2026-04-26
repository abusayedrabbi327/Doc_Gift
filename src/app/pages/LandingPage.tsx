import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../components/Card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  CreditCard,
  ShoppingCart,
  TrendingUp,
  Bell,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl mb-6 leading-tight">
                Smart Credit-Based Gift Exchange for Doctors
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Seamlessly connect doctors with pharmaceutical
                companies through an innovative credit system.
                Browse products, redeem gifts, and manage orders
                effortlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/login")}
                >
                  Sign In Now <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/30 hover:text-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1576669801945-7a346954da5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NzA1MTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Doctor consultation"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage a modern
              credit-based gift exchange platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CreditCard,
                title: "Credit-Based Ordering",
                description:
                  "Doctors can redeem gifts using assigned credits seamlessly",
              },
              {
                icon: ShoppingCart,
                title: "Easy Product Browsing",
                description:
                  "Browse and search through a wide catalog of available gifts",
              },
              {
                icon: Users,
                title: "Sales Rep Management",
                description:
                  "Efficient tools for sales representatives to manage doctor relationships",
              },
              {
                icon: Bell,
                title: "Real-Time Tracking",
                description:
                  "Track orders from placement to delivery in real-time",
              },
            ].map((feature, index) => (
              <Card key={index} hover>
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four simple steps to start redeeming gifts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Get Credits",
                description:
                  "Sales representatives assign credits to your account based on your engagement",
              },
              {
                step: "02",
                title: "Browse Gifts",
                description:
                  "Explore our extensive catalog and find gifts that match your preferences",
              },
              {
                step: "03",
                title: "Place Order",
                description:
                  "Select items and checkout using your available credit balance",
              },
              {
                step: "04",
                title: "Receive Delivery",
                description:
                  "Track your order and receive your gifts at your doorstep",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl text-white">
                      {item.step}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-secondary opacity-20" />
                  )}
                </div>
                <h3 className="mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A platform that creates value across the
              healthcare ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="mb-4">For Doctors</h3>
                <ul className="space-y-3">
                  {[
                    "Easy access to quality gifts",
                    "Transparent credit system",
                    "No upfront payments required",
                    "Fast order processing",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="mb-4">
                  For Sales Representatives
                </h3>
                <ul className="space-y-3">
                  {[
                    "Streamlined doctor management",
                    "Real-time order tracking",
                    "Flexible credit allocation",
                    "Performance insights",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-accent" />
                </div>
                <h3 className="mb-4">For Companies</h3>
                <ul className="space-y-3">
                  {[
                    "Centralized platform management",
                    "Complete order visibility",
                    "Automated credit system",
                    "Detailed analytics & reports",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of doctors and sales
              representatives using Gift Exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "General Practitioner",
                image:
                  "https://images.unsplash.com/photo-1640909386733-e5260a325c26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NzA1MTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
                quote:
                  "The platform is incredibly user-friendly. I can browse and order gifts using credits without any hassle.",
              },
              {
                name: "Michael Chen",
                role: "Sales Executive",
                image:
                  "https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NzA1MTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
                quote:
                  "Managing my doctor relationships has never been easier. The dashboard gives me everything I need in one place.",
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Specialist Physician",
                image:
                  "https://images.unsplash.com/photo-1643297654397-97b3201abc7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NzA1MTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
                quote:
                  "The credit system is transparent and fair. I always know my balance and can track my orders in real-time.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join the modern healthcare gift exchange platform
            today
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/login")}
            >
              Sign In Now <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/login")}
            >
              Contact Admin
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}