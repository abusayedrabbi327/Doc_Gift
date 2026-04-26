import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowLeft, ShoppingCart, Star, Package, Check, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useApp } from '../../context/AppContext';

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addToCart, cart, currentUser } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <DashboardLayout navItems={doctorNavItems}>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/doctor/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const cartItem = cart.find(i => i.productId === product.id);
  const inCart = !!cartItem;
  const totalCost = product.credits * quantity;
  const canAfford = doctor.credits >= totalCost;
  const remaining = doctor.credits - totalCost;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <button
          onClick={() => navigate('/doctor/products')}
          className="flex items-center gap-2 text-muted-foreground hover:text-[#1E3A8A] mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Image */}
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 capitalize">{product.category}</p>
              <h1 className="text-2xl md:text-3xl mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} rating</span>
              </div>
            </div>

            {/* Credit cost card */}
            <Card className="border-2 border-[#14B8A6]/30 bg-gradient-to-br from-[#14B8A6]/5 to-transparent">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Credit Cost</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-[#14B8A6]">{product.credits}</span>
                      <span className="text-muted-foreground text-sm">credits each</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">In Stock</p>
                    <p className={`text-sm ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-[#22C55E]'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm">Quantity:</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-border hover:bg-[#f1f5f9] flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg border border-border hover:bg-[#f1f5f9] flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-[#14B8A6]">{totalCost} credits</p>
                  </div>
                </div>

                {/* Credit check */}
                {!canAfford && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    You need {totalCost - doctor.credits} more credits for this order.
                  </div>
                )}
                {canAfford && (
                  <p className="text-xs text-muted-foreground">
                    After purchase: <span className="text-[#22C55E]">{remaining.toLocaleString()} credits</span> remaining
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant={added ? 'primary' : canAfford ? 'primary' : 'outline'}
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                    disabled={!canAfford}
                  >
                    {added ? (
                      <><Check className="w-4 h-4" /> Added to Cart!</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </Button>
                  {inCart && (
                    <Button variant="outline" size="lg" onClick={() => navigate('/doctor/cart')}>
                      View Cart
                    </Button>
                  )}
                </div>
              </div>
            )}

            {product.stock === 0 && (
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-muted-foreground text-sm">This item is currently out of stock</p>
              </div>
            )}

            {/* Your balance */}
            <div className="flex items-center justify-between p-3 bg-[#1E3A8A]/5 rounded-xl border border-[#1E3A8A]/10">
              <span className="text-sm text-muted-foreground">Your balance</span>
              <span className="text-[#1E3A8A] text-sm">{doctor.credits.toLocaleString()} credits</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}