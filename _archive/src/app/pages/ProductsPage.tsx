import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import api from "../../api";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const categoryFilter = searchParams.get("category") || "all";
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
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
        
        const fetchedCategories = categoriesRes.data.map((c: any) => ({
          id: c.slug,
          name: c.name,
          description: c.description,
          icon: 'Monitor'
        }));

        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our comprehensive catalog of premium electronic components
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <Card className="p-6 border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-border/50">
            <p className="text-muted-foreground mb-4">
              No products found matching your criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    api.post("/analytics/inquiry", { productId: product.id }).catch(console.error);
    const message = `Hi, I'm interested in the ${product.name}. Can you provide more details?`;
    window.open(
      `https://wa.me/918829975919?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
        <div className="aspect-square bg-secondary/50 overflow-hidden relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Featured
              </div>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>{product.categoryName || product.category}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span className="text-primary">{product.brand}</span>
                </>
              )}
            </div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Key Specs:
            </div>
            <ul className="space-y-1">
              {product.specs.slice(0, 2).map((spec, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" variant="outline">
              View Details
            </Button>
            <Button className="flex-1" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
