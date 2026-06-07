import { motion } from "motion/react";
import { Target, Eye, Award, Users, Globe, Shield } from "lucide-react";
import { Card } from "../components/ui/card";

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Quality First",
      description:
        "We never compromise on quality. Every product is thoroughly tested and verified.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your satisfaction is our priority. We go above and beyond to meet your needs.",
    },
    {
      icon: Award,
      title: "Industry Expertise",
      description:
        "Years of experience in sourcing and supplying premium electronic components.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Serving customers worldwide with reliable shipping and local support.",
    },
  ];

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            About Magnifying Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in premium electronic components and technical solutions
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <Card className="p-12 lg:p-16 border-border/50">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded over a decade ago, Magnifying Solutions began with a
                simple mission: to provide businesses and individuals with
                access to high-quality electronic components at competitive
                prices. What started as a small operation has grown into a
                trusted supplier serving customers across 50+ countries.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our expertise spans multiple product categories, including
                laptop screens, monitor components, CCTV systems, AC spare
                parts, and a comprehensive range of electronic components. We've
                built lasting relationships with manufacturers and suppliers
                worldwide to ensure our customers receive only genuine,
                certified products.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to serve thousands of satisfied customers,
                from individual technicians to large-scale enterprises, with the
                same commitment to quality and service that defined our founding
                principles.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-10 h-full border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the most reliable source of premium electronic components
                by delivering exceptional quality, competitive pricing, and
                outstanding customer service. We strive to empower businesses
                and technicians with the tools they need to succeed.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-10 h-full border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the global leader in electronic component distribution,
                known for innovation, reliability, and customer satisfaction. We
                envision a future where quality components are accessible to
                everyone, everywhere.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 h-full text-center border-border/50 hover:border-primary/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-12 lg:p-16 border-border/50 bg-secondary/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="text-5xl font-semibold mb-3">10+</div>
                <div className="text-muted-foreground">Years in Business</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-semibold mb-3">50+</div>
                <div className="text-muted-foreground">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-semibold mb-3">500+</div>
                <div className="text-muted-foreground">Product Range</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-semibold mb-3">99%</div>
                <div className="text-muted-foreground">
                  Customer Satisfaction
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Why Customers Trust Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The reasons our customers choose to partner with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Certified Products",
                description:
                  "All our products come with manufacturer certifications and warranties",
              },
              {
                title: "Fast Delivery",
                description:
                  "Quick processing and shipping to get products to you when you need them",
              },
              {
                title: "Technical Expertise",
                description:
                  "Our team provides expert guidance for product selection and usage",
              },
              {
                title: "Competitive Pricing",
                description:
                  "Best market rates with special discounts for bulk orders",
              },
              {
                title: "Quality Assurance",
                description:
                  "Rigorous testing and inspection of every product before dispatch",
              },
              {
                title: "After-Sales Support",
                description:
                  "Comprehensive support even after your purchase is complete",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-border/50">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
