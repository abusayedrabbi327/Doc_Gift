import { useState } from 'react';
import { DashboardLayout, adminNavItems } from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Search, Plus, Edit, Trash2, X, CheckCircle, Save } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useApp } from '../../context/AppContext';
import { useNavigate, Navigate } from 'react-router';
import { Product } from '../../context/AppContext';

const CATEGORY_OPTIONS = ['groceries', 'electronics', 'appliances', 'other'];

export default function ProductManagement() {
  const navigate = useNavigate();
  const { currentUser, products, addProduct, updateProduct, deleteProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const emptyForm = { name: '', category: 'groceries', credits: 0, stock: 0, image: '', description: '', rating: 4.5 };
  const [form, setForm] = useState(emptyForm);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(form);
    setSaved(true);
    setTimeout(() => {
      setShowAddModal(false);
      setSaved(false);
      setForm(emptyForm);
    }, 1500);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    updateProduct(editProduct.id, form);
    setSaved(true);
    setTimeout(() => {
      setEditProduct(null);
      setSaved(false);
    }, 1500);
  };

  const handleEditOpen = (product: Product) => {
    setForm({
      name: product.name, category: product.category, credits: product.credits,
      stock: product.stock, image: product.image, description: product.description, rating: product.rating,
    });
    setEditProduct(product);
    setSaved(false);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    setConfirmDelete(null);
  };

  const inputClass = "w-full px-3 py-2.5 bg-[#f8fafc] rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm";

  const ProductForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void; title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {saved ? (
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-2" />
          <p className="text-[#22C55E]">Product saved!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1.5">Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className={inputClass} required placeholder="Product name" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className={inputClass}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Credits Cost *</label>
              <input type="number" value={form.credits} onChange={e => setForm(p => ({...p, credits: parseInt(e.target.value) || 0}))} className={inputClass} min={1} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Stock Quantity *</label>
              <input type="number" value={form.stock} onChange={e => setForm(p => ({...p, stock: parseInt(e.target.value) || 0}))} className={inputClass} min={0} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Rating (1-5)</label>
              <input type="number" value={form.rating} onChange={e => setForm(p => ({...p, rating: parseFloat(e.target.value) || 4.5}))} className={inputClass} min={1} max={5} step={0.1} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1.5">Image URL</label>
              <input type="url" value={form.image} onChange={e => setForm(p => ({...p, image: e.target.value}))} className={inputClass} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className={`${inputClass} resize-none`} rows={3} placeholder="Product description..." />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              {title}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setEditProduct(null); }}>Cancel</Button>
          </div>
        </>
      )}
    </form>
  );

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-1">Product Management</h1>
            <p className="text-muted-foreground text-sm">Manage gift catalog and inventory</p>
          </div>
          <Button variant="primary" className="gap-2 w-fit" onClick={() => { setForm(emptyForm); setSaved(false); setShowAddModal(true); }}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'In Stock', value: products.filter(p => p.stock > 0).length },
            { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length },
            { label: 'Avg Credits', value: products.length ? Math.round(products.reduce((s, p) => s + p.credits, 0) / products.length) : 0 },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-xl tabular-nums">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...CATEGORY_OPTIONS].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm capitalize transition-all border ${categoryFilter === cat ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white border-border hover:bg-[#f1f5f9]'}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-3 text-xs text-muted-foreground">Product</th>
                    <th className="text-left py-4 px-3 text-xs text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left py-4 px-3 text-xs text-muted-foreground">Credits</th>
                    <th className="text-left py-4 px-3 text-xs text-muted-foreground">Stock</th>
                    <th className="text-left py-4 px-3 text-xs text-muted-foreground hidden md:table-cell">Status</th>
                    <th className="text-right py-4 px-3 text-xs text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#f1f5f9]">
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">★ {product.rating}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm capitalize hidden md:table-cell">{product.category}</td>
                      <td className="py-3 px-3 text-[#14B8A6] text-sm">{product.credits}</td>
                      <td className="py-3 px-3 text-sm">
                        <span className={product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-[#22C55E]'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <Badge variant={product.stock > 0 ? 'approved' : 'pending'}>
                          {product.stock > 0 ? 'Active' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditOpen(product)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:bg-[#f1f5f9] text-xs transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No products found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleAddProduct} title="Add Product" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Edit Product</h3>
                <button onClick={() => setEditProduct(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleUpdateProduct} title="Save Changes" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="mb-1">Delete Product?</h3>
                  <p className="text-sm text-muted-foreground">This will remove the product from the catalog.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="danger" className="flex-1" onClick={() => handleDeleteProduct(confirmDelete)}>Delete</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}