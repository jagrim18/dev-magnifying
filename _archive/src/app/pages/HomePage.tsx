import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Monitor,
  MonitorSpeaker,
  Camera,
  Cctv,
  Wind,
  Cpu,
  Check,
  ShoppingBag,
  Headphones,
  DollarSign,
  Shield,
  ArrowRight,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import api from "../../api";

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        const fetchedFeatured = productsRes.data
          .filter((p: any) => p.isFeatured)
          .slice(0, 6)
          .map((p: any) => {
            let image = 'placeholder';
            if (p.images && p.images.length > 0) {
              image = p.images[0];
            } else if (p.image) {
              image = p.image;
            } else if (p.imageUrl) {
              image = p.imageUrl;
            }

            const categorySlug = p.category?.slug || (typeof p.category === 'string' ? p.category : '');
            const categoryName = p.category?.name || (typeof p.category === 'string' ? p.category : 'Category');

            return {
              id: p._id || p.id,
              name: p.name,
              category: categorySlug,
              categoryName: categoryName,
              description: p.description,
              image: image
            };
          });
        
        const fetchedCategories = categoriesRes.data.map((c: any) => ({
          id: c.slug,
          name: c.name,
          description: c.description,
          icon: 'Monitor'
        }));

        const allCategoriesMap = new Map();
        
        fetchedCategories.forEach((c: any) => {
          allCategoriesMap.set(c.name.toLowerCase(), c);
        });

        productsRes.data.forEach((p: any) => {
          const catName = p.category?.name || (typeof p.category === 'string' ? p.category : null);
          if (catName && catName !== 'Category' && !allCategoriesMap.has(catName.toLowerCase())) {
            const generatedSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            allCategoriesMap.set(catName.toLowerCase(), {
              id: generatedSlug,
              name: catName,
              description: `${catName} products`,
              icon: 'Monitor'
            });
          }
        });

        setFeaturedProducts(fetchedFeatured);
        setCategories(Array.from(allCategoriesMap.values()));
      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Genuine Products",
      description: "100% authentic parts with manufacturer warranty",
    },
    {
      icon: ShoppingBag,
      title: "Bulk Supply",
      description: "Large inventory for wholesale and retail orders",
    },
    {
      icon: Headphones,
      title: "Fast Support",
      description: "24/7 technical support for all your queries",
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Best market rates with volume discounts",
    },
  ];

  const services = [
    {
      title: "Wholesale Supply",
      description:
        "Large-scale distribution of electronic components to businesses worldwide",
    },
    {
      title: "Product Sourcing",
      description:
        "Custom sourcing solutions for hard-to-find parts and components",
    },
    {
      title: "Technical Support",
      description:
        "Expert guidance on product selection and installation",
    },
    {
      title: "Bulk Orders",
      description:
        "Special pricing and dedicated support for high-volume purchases",
    },
  ];

  const iconMap = {
    Monitor,
    MonitorSpeaker,
    Camera,
    Cctv,
    Wind,
    Cpu,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                  Trusted Components.
                  <br />
                  <span className="text-muted-foreground">Reliable Solutions.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Premium supplier of laptop screens, monitor parts, CCTV
                  components, and electronic spare parts.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-base px-8">
                  <Link to="/products">
                    View Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-semibold">500+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-semibold">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-semibold">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzY3JlZW4lMjBkaXNwbGF5JTIwbW9uaXRvcnxlbnwxfHx8fDE3ODA3NzE2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Laptop Screens"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1562408590-e32931084e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwY2lyY3VpdCUyMGNvbXBvbmVudHN8ZW58MXx8fHwxNzgwNzcxNjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Electronic Components"
                      className="w-full h-56 object-cover"
                    />
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1589935447067-5531094415d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGNhbWVyYSUyMHN1cnZlaWxsYW5jZXxlbnwxfHx8fDE3ODA3MTY4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="CCTV Cameras"
                      className="w-full h-56 object-cover"
                    />
                  </Card>
                  <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc4MDcyMDc2OXww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Technology"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Product Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive range of electronic components for all your technical needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/products?category=${category.id}`}>
                    <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
                      <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex items-center text-sm font-medium text-primary pt-2">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular and trusted components
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for quality electronic components
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full text-center border-border/50 hover:border-primary/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold tracking-tight">
                  About Magnifying Solutions
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With over a decade of experience in the electronics industry,
                  we've built our reputation on quality, reliability, and
                  exceptional customer service.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Quality Assurance</h4>
                    <p className="text-sm text-muted-foreground">
                      Every product undergoes rigorous testing before delivery
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Global Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast and secure delivery worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Expert Team</h4>
                    <p className="text-sm text-muted-foreground">
                      Dedicated professionals ready to assist you
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-12 border-border/50 bg-secondary/30">
                <div className="space-y-8">
                  <div>
                    <div className="text-5xl font-semibold mb-2">10+</div>
                    <div className="text-muted-foreground">Years in Business</div>
                  </div>
                  <div className="w-full h-px bg-border" />
                  <div>
                    <div className="text-5xl font-semibold mb-2">50+</div>
                    <div className="text-muted-foreground">Countries Served</div>
                  </div>
                  <div className="w-full h-px bg-border" />
                  <div>
                    <div className="text-5xl font-semibold mb-2">99%</div>
                    <div className="text-muted-foreground">Customer Satisfaction</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-semibold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Contact us today for quotes, technical support, or bulk order inquiries
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-base px-8"
              >
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="mailto:info@magnifyingsolutions.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="tel:+15551234567">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
        <div className="aspect-square bg-secondary/50 overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.categoryName || product.category}
          </div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </div>
      </Card>
    </Link>
  );
}
