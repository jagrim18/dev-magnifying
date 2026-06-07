import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import api from "../../api";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productRes, allProductsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products')
        ]);
        
        const p = productRes.data;
        const fetchedProduct = {
          id: p._id,
          name: p.name,
          category: p.category?.slug || p.category,
          categoryName: p.category?.name || 'Category',
          description: p.description,
          specs: p.specifications?.map((s: any) => `${s.key}: ${s.value}`) || [],
          image: p.images?.[0] || 'placeholder',
          featured: p.isFeatured
        };
        setProduct(fetchedProduct);
        
        // Find related products in the same category
        const related = allProductsRes.data
          .filter((item: any) => 
            (item.category?.slug === fetchedProduct.category || item.category === fetchedProduct.category) && 
            item._id !== fetchedProduct.id
          )
          .slice(0, 3)
          .map((item: any) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            image: item.images?.[0] || 'placeholder'
          }));
        
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleWhatsAppInquiry = () => {
    api.post("/analytics/inquiry", { productId: product.id }).catch(console.error);
    const message = `Hi, I'm interested in the ${product.name} (Product ID: ${product.id}). Can you provide pricing and availability?`;
    window.open(
      `https://wa.me/15551234567?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-border/50 shadow-lg">
              <div className="aspect-square bg-secondary/50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {product.categoryName || product.category}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">
                {product.name}
              </h1>
              {product.featured && (
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Check className="h-4 w-4" />
                  Featured Product
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {product.specs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-6 border-border/50 bg-secondary/30">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Information</h4>
                  <p className="text-sm text-muted-foreground">
                    For detailed pricing, availability, and bulk order inquiries,
                    please contact our sales team.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleWhatsAppInquiry}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Inquiry
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>Genuine Products</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                Related Products
              </h2>
              <p className="text-muted-foreground">
                Other products in the {product.categoryName || product.category} category
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/products/${relatedProduct.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
                      <div className="aspect-square bg-secondary/50 overflow-hidden">
                        <ImageWithFallback
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="font-semibold text-lg">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedProduct.description}
                        </p>
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
