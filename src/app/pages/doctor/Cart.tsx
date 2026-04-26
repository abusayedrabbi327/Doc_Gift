import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { DashboardLayout, doctorNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Trash2, Plus, Minus, ShoppingBag, CreditCard, ArrowLeft,
  CheckCircle, MapPin, Package, AlertTriangle
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useApp } from '../../context/AppContext';

type Step = 'cart' | 'checkout' | 'success';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, products, removeFromCart, updateCartQuantity, clearCart, placeOrder, currentUser } = useApp();
  const [step, setStep] = useState<Step>('cart');
  const [address, setAddress] = useState('');
  const [orderId, setOrderId] = useState('');
  const [addressError, setAddressError] = useState('');

  if (!currentUser || currentUser.role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const doctor = currentUser.data;

  // Build cart items with product info
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const totalCredits = cartItems.reduce((sum, item) => sum + (item.product!.credits * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const canAfford = doctor.credits >= totalCredits;
  const remaining = doctor.credits - totalCredits;

  const handleCheckout = () => {
    if (!address.trim()) {
      setAddressError('Please enter a delivery address');
      return;
    }
    const id = placeOrder(address.trim());
    setOrderId(id);
    setStep('success');
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <DashboardLayout navItems={doctorNavItems}>
        <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-[#22C55E]/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-2">
              Your order <strong>{orderId}</strong> has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Remaining balance: <span className="text-[#14B8A6]">{doctor.credits.toLocaleString()} credits</span>
            </p>
            <Card className="mb-6 bg-[#22C55E]/5 border-[#22C55E]/20">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-2 text-sm text-[#22C55E]">
                  <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p>Your order is being processed. Your sales representative will contact you to confirm the delivery.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full" onClick={() => navigate('/doctor/orders')}>
                Track My Orders
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/doctor/products')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Empty Cart ──────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <DashboardLayout navItems={doctorNavItems}>
        <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <h2 className="mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm mb-6">Browse our gift catalog and add items you'd like to redeem with your credits.</p>
            <Button variant="primary" className="gap-2" onClick={() => navigate('/doctor/products')}>
              <ShoppingBag className="w-4 h-4" />
              Browse Gifts
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Checkout Step ───────────────────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <DashboardLayout navItems={doctorNavItems}>
        <div className="p-4 md:p-6 lg:p-8">
          <button
            onClick={() => setStep('cart')}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#1E3A8A] mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl mb-1">Checkout</h1>
            <p className="text-muted-foreground text-sm">Confirm your order details and delivery address</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-[#22C55E]">Cart</span>
            </div>
            <div className="flex-1 h-px bg-[#1E3A8A]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </div>
              <span className="text-sm text-[#1E3A8A]">Checkout</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-border rounded-full flex items-center justify-center">
                <span className="text-muted-foreground text-xs">3</span>
              </div>
              <span className="text-sm text-muted-foreground">Confirm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <h3 className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                    Delivery Address
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1 text-muted-foreground">Full Delivery Address *</label>
                      <textarea
                        value={address}
                        onChange={(e) => { setAddress(e.target.value); setAddressError(''); }}
                        placeholder="Enter complete delivery address..."
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm resize-none"
                      />
                      {addressError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {addressError}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setAddress(doctor.hospitalAddress);
                        setAddressError('');
                      }}
                      className="text-xs text-[#1E3A8A] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Use hospital address: {doctor.hospitalAddress}
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Summary */}
              <Card>
                <CardHeader><h3>Order Items ({totalItems})</h3></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.product!.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-[#14B8A6] text-sm flex-shrink-0">{item.product!.credits * item.quantity} cr</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader><h3>Order Summary</h3></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items ({totalItems})</span>
                      <span>{totalCredits} credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-[#22C55E]">Free</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="text-[#14B8A6] text-xl">{totalCredits} credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className={remaining >= 0 ? 'text-[#22C55E]' : 'text-red-500'}>
                        {remaining.toLocaleString()} credits
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!canAfford && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Insufficient credits. Remove some items to proceed.
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={handleCheckout}
                disabled={!canAfford}
              >
                <CreditCard className="w-4 h-4" />
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Cart Step ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout navItems={doctorNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-1">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">1</span>
            </div>
            <span className="text-sm text-[#1E3A8A]">Cart</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-border rounded-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs">2</span>
            </div>
            <span className="text-sm text-muted-foreground">Checkout</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-border rounded-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs">3</span>
            </div>
            <span className="text-sm text-muted-foreground">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <Card key={item.productId}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f8fafc]">
                      <ImageWithFallback
                        src={item.product!.image}
                        alt={item.product!.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm leading-snug">{item.product!.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize mb-3">{item.product!.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-border hover:bg-[#f1f5f9] flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, Math.min(item.product!.stock, item.quantity + 1))}
                            className="w-7 h-7 rounded-lg border border-border hover:bg-[#f1f5f9] flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[#14B8A6] text-sm">
                          {item.product!.credits * item.quantity} credits
                          <span className="text-muted-foreground text-xs ml-1">({item.product!.credits} each)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader><h3>Order Summary</h3></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">{item.product!.name} x{item.quantity}</span>
                      <span className="flex-shrink-0">{item.product!.credits * item.quantity}</span>
                    </div>
                  ))}
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-[#14B8A6] text-xl">{totalCredits}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${canAfford ? 'border-[#22C55E]/30 bg-[#22C55E]/5' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Balance</span>
                    <span>{doctor.credits.toLocaleString()} credits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Total</span>
                    <span>- {totalCredits} credits</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="text-sm">After Order</span>
                    <span className={`text-sm ${canAfford ? 'text-[#22C55E]' : 'text-red-600'}`}>
                      {remaining.toLocaleString()} credits
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!canAfford && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                You need {(totalCredits - doctor.credits).toLocaleString()} more credits. Contact your sales rep.
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={() => setStep('checkout')}
              disabled={!canAfford}
            >
              <CreditCard className="w-4 h-4" />
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/doctor/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}