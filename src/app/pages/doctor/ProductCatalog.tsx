import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Search, ShoppingCart, Star, Check, CreditCard } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useApp } from '../../context/AppContext';

export default function ProductCatalog() {
  const navigate = useNavigate();
  const { products, addToCart, cart, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedIds, setAddedIds] = useState<number[]>([]);

  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'appliances', label: 'Appliances' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isInCart = (productId: number) => cart.some(i => i.productId === productId);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart(productId, 1);
    setAddedIds(prev => [...prev, productId]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== productId)), 2000);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.credits || 0) * item.quantity;
  }, 0);

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Gift Catalog</h1>
            <p className="text-muted-foreground text-sm">Redeem your credits for premium gifts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1E3A8A]/10 px-3 py-2 rounded-xl">
              <CreditCard className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-sm text-[#1E3A8A]">{doctor.credits.toLocaleString()} credits</span>
            </div>
            {cart.length > 0 && (
              <Button variant="primary" size="sm" className="gap-2 relative" onClick={() => navigate('/doctor/cart')}>
                <ShoppingCart className="w-4 h-4" />
                Cart
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#22C55E] text-white text-xs rounded-full flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-white text-foreground hover:bg-[#f1f5f9] border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cart summary banner */}
        {cartTotal > 0 && (
          <div className="mb-6 p-3 bg-[#1E3A8A]/5 border border-[#1E3A8A]/20 rounded-xl flex items-center justify-between">
            <p className="text-sm text-[#1E3A8A]">
              <strong>{cart.reduce((s, i) => s + i.quantity, 0)} items</strong> in cart — {cartTotal} credits
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/doctor/cart')}>
              Checkout →
            </Button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const inCart = isInCart(product.id);
            const justAdded = addedIds.includes(product.id);
            const canAfford = doctor.credits >= product.credits;

            return (
              <Card
                key={product.id}
                hover
                className="cursor-pointer overflow-hidden group"
                onClick={() => navigate(`/doctor/products/${product.id}`)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#f8fafc] relative">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-foreground text-sm px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
                <CardContent className="pt-3 pb-4">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground capitalize mb-0.5">{product.category}</p>
                    <h3 className="text-sm leading-snug line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#14B8A6] text-lg">{product.credits}</span>
                      <span className="text-xs text-muted-foreground ml-1">cr</span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={product.stock === 0 || !canAfford}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        justAdded
                          ? 'bg-[#22C55E] text-white'
                          : inCart
                          ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white'
                          : !canAfford
                          ? 'bg-gray-100 text-muted-foreground cursor-not-allowed'
                          : product.stock === 0
                          ? 'bg-gray-100 text-muted-foreground cursor-not-allowed'
                          : 'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90'
                      }`}
                    >
                      {justAdded ? (
                        <><Check className="w-3 h-3" /> Added!</>
                      ) : inCart ? (
                        <><ShoppingCart className="w-3 h-3" /> In Cart</>
                      ) : !canAfford ? (
                        'Low Credits'
                      ) : (
                        <><ShoppingCart className="w-3 h-3" /> Add</>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}