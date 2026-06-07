import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  LayoutDashboard,
  Settings,
  Upload,
  LogOut,
  Lock,
  Activity,
  Eye,
  MessageSquare
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";

export function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, analyticsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/analytics/stats')
      ]);
      const fetchedProducts = productsRes.data.map((p: any) => ({
        id: p._id,
        name: p.name,
        category: p.category?.slug || p.category,
        categoryName: p.category?.name || 'Category',
        description: p.description,
        brand: p.brand || '',
        specs: p.specifications?.map((s: any) => `${s.key}: ${s.value}`) || [],
        image: p.images?.[0] || 'placeholder',
        featured: p.isFeatured
      }));
      setProducts(fetchedProducts);
      setCategories(categoriesRes.data.map((c: any) => ({ id: c.slug, name: c.name, description: c.description })));
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    specs: "",
    image: "",
    featured: false,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  const handleAdd = async () => {
    try {
      const specsArray = formData.specs.split("\n").filter((s) => s.trim()).map(s => {
        const parts = s.split(':');
        return { key: parts[0]?.trim() || 'Spec', value: parts[1]?.trim() || s.trim() };
      });
      await api.post('/products', {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        specifications: specsArray,
        images: [formData.image],
        isFeatured: formData.featured,
      });
      toast.success("Product added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleAddCategory = async () => {
    try {
      await api.post('/categories', categoryFormData);
      toast.success("Category added successfully!");
      setIsAddCategoryDialogOpen(false);
      setCategoryFormData({ name: "", description: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;
    try {
      const specsArray = formData.specs.split("\n").filter((s) => s.trim()).map(s => {
        const parts = s.split(':');
        return { key: parts[0]?.trim() || 'Spec', value: parts[1]?.trim() || s.trim() };
      });
      await api.put(`/products/${selectedProduct.id}`, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        specifications: specsArray,
        images: [formData.image],
        isFeatured: formData.featured,
      });
      toast.success("Product updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || "",
      description: product.description,
      specs: product.specs.join("\n"),
      image: product.image,
      featured: product.featured || false,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      brand: "",
      description: "",
      specs: "",
      image: "",
      featured: false,
    });
  };

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
    },
    {
      label: "Categories",
      value: categories.length,
      icon: LayoutDashboard,
    },
    {
      label: "Featured",
      value: products.filter((p) => p.featured).length,
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen py-16 lg:py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your products and content
              </p>
            </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new product to the catalog
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleAdd}
                    submitLabel="Add Product"
                    categories={categories}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <Card className="border-border/50">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">All Products</h3>
                  <div className="space-y-3">
                    {products.map((product) => {
                      const category = categories.find(
                        (c) => c.id === product.category
                      );
                      return (
                        <Card
                          key={product.id}
                          className="p-4 border-border/50 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/50 shrink-0">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold truncate">
                                  {product.name}
                                </h4>
                                {product.featured && (
                                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {category?.name}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <Card className="p-6 border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Product Categories</h3>
                  <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                          Create a new product category
                        </DialogDescription>
                      </DialogHeader>
                      <CategoryForm
                        formData={categoryFormData}
                        setFormData={setCategoryFormData}
                        onSubmit={handleAddCategory}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {categories.map((category) => {
                    const count = products.filter(
                      (p) => p.category === category.id
                    ).length;
                    return (
                      <Card
                        key={category.id}
                        className="p-4 border-border/50 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold">{category.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2">
                          {count} product{count !== 1 ? "s" : ""}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Visits</p>
                      <p className="text-3xl font-semibold">{analytics?.totalVisits || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Inquiries</p>
                      <p className="text-3xl font-semibold">{analytics?.totalInquiries || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Top Product</p>
                      <p className="text-xl font-semibold line-clamp-1" title={analytics?.mostInquiredProduct?.name}>
                        {analytics?.mostInquiredProduct?.name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analytics?.mostInquiredProduct?.count ? `${analytics.mostInquiredProduct.count} inquiries` : "No data"}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Activity className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 border-border/50">
                <h3 className="font-semibold text-lg mb-6">Traffic & Inquiries (Last 7 Days)</h3>
                <div className="h-[400px] w-full">
                  {analytics?.graphData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.graphData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Line type="monotone" dataKey="visits" name="Visits" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="inquiries" name="Inquiries" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEdit}
              submitLabel="Update Product"
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ProductForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  categories,
}: {
  formData: any;
  setFormData: any;
  onSubmit: () => void;
  submitLabel: string;
  categories: any[];
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev: any) => ({ ...prev, image: res.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., 15.6 FHD LCD Display"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="e.g., Samsung, LG, Generic"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev: any) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Brief description of the product"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specs">Specifications (one per line) *</Label>
        <Textarea
          id="specs"
          name="specs"
          value={formData.specs}
          onChange={handleChange}
          required
          placeholder="1920x1080 Resolution&#10;IPS Panel&#10;60Hz Refresh Rate"
          rows={5}
        />
      </div>

      <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-secondary/10">
        <div>
          <Label htmlFor="imageFile">Upload Image File</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-px bg-border/50 flex-1"></div>
          <span className="text-xs text-muted-foreground uppercase font-medium">OR</span>
          <div className="h-px bg-border/50 flex-1"></div>
        </div>
        <div>
          <Label htmlFor="image">Direct Image URL</Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Provide a direct link to an image if you aren't uploading a file.
          </p>
        </div>
        {formData.image && (
          <div className="mt-4 aspect-video bg-secondary/50 rounded-md overflow-hidden flex items-center justify-center border border-border/50 p-2">
            <ImageWithFallback src={formData.image} alt="Preview" className="max-h-full object-contain" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="rounded border-border"
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Mark as Featured Product
        </Label>
      </div>

      <Button type="submit" size="lg" className="w-full">
        <Upload className="mr-2 h-5 w-5" />
        {submitLabel}
      </Button>
    </form>
  );
}

function CategoryForm({
  formData,
  setFormData,
  onSubmit,
}: {
  formData: any;
  setFormData: any;
  onSubmit: () => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cat-name">Category Name *</Label>
        <Input
          id="cat-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Gaming Accessories"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cat-description">Description</Label>
        <Textarea
          id="cat-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the category"
          rows={3}
        />
      </div>
      <Button type="submit" size="lg" className="w-full">
        <Upload className="mr-2 h-5 w-5" />
        Add Category
      </Button>
    </form>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success("Login successful");
      onLogin();
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-border/50 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Admin Access</h2>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Enter your credentials to securely manage the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@magnifyingsolutions.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
