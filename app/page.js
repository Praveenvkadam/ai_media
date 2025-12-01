'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { features, socialProofStats, testimonials, platformTabs } from '@/lib/data';
import { 
  Users, 
  PenTool, 
  Eye, 
  Shield, 
  ChevronRight, 
  Check, 
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';


function Home() {
    const canvasRef = useRef(null);
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const animationRef = useRef(null);
    const particles = useRef([]);
    const mouseParticle = useRef({ x: 0, y: 0, size: 0 });

    const cursorRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
    const cursorAnimRef = useRef(null);

    useEffect(() => {
        const update = () =>
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });

        window.addEventListener('resize', update);
        update();
        return () => window.removeEventListener('resize', update);
    }, []);

    useEffect(() => {
        // Only add cursor effect on non-touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (!isTouchDevice) {
            const moveCursor = (e) => {
                setTargetPos({ x: e.clientX, y: e.clientY });
                mouseParticle.current = { x: e.clientX, y: e.clientY, size: 100 };
            };

            window.addEventListener('mousemove', moveCursor);
            return () => window.removeEventListener('mousemove', moveCursor);
        }
    }, []);

    const animateCursor = useCallback(() => {
        setCursorPos((prev) => ({
            x: prev.x + (targetPos.x - prev.x) * 0.15,
            y: prev.y + (targetPos.y - prev.y) * 0.15,
        }));
        cursorAnimRef.current = requestAnimationFrame(animateCursor);
    }, [targetPos.x, targetPos.y]);

    useEffect(() => {
        cursorAnimRef.current = requestAnimationFrame(animateCursor);
        return () => {
            if (cursorAnimRef.current) {
                cancelAnimationFrame(cursorAnimRef.current);
            }
        };
    }, [animateCursor]);

    useEffect(() => {
        particles.current = [];
    }, [isDarkMode]);

    const initParticles = (count = 40) => {
        return Array.from({ length: count }).map(() => ({
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,

            color: isDarkMode
                ? [
                      'rgba(220,220,220,1)',
                      'rgba(200,200,200,1)',
                      'rgba(170,170,170,1)',
                  ][Math.floor(Math.random() * 3)]
                : `rgba(0,0,0,${0.7 + Math.random() * 0.3})`,
        }));
    };

    const updateParticles = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (particles.current.length === 0) {
            particles.current = initParticles(40);
        }

        particles.current.forEach((p) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        particles.current.forEach((p) => {
            const dx = mouseParticle.current.x - p.x;
            const dy = mouseParticle.current.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 220) {
                ctx.beginPath();
                ctx.strokeStyle = isDarkMode
                    ? `rgba(220,220,220,${0.9 - dist / 260})`
                    : `rgba(0,0,0,${0.8 - dist / 280})`;

                ctx.lineWidth = 1.4;
                ctx.moveTo(mouseParticle.current.x, mouseParticle.current.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        });

        mouseParticle.current.size = Math.max(0, mouseParticle.current.size - 2);
    };

    useEffect(() => {
        if (!dimensions.width) return;

        const animate = () => {
            updateParticles();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationRef.current);
    }, [dimensions, isDarkMode]);

    return (
        <div className="min-h-screen w-full relative">
            <div className="w-full flex items-start justify-start px-3 sm:px-6 py-4 sm:py-8 lg:items-center lg:justify-center min-h-[calc(100vh-5rem)]">
                <div className="w-full max-w-7xl mx-0 lg:mx-auto">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-12">
                        <div className="w-full lg:max-w-xl text-left">
                                {/* Inspire.
                                Create.
                                Expand. */}
                    <div className="space-y-2 sm:space-y-3">
    <div className="text-4xl sm:text-[60px] font-bold text-foreground leading-[1.1]">
        Inspire,
    </div>

    <div className="text-2xl sm:text-4xl text-green-600 dark:text-green-400 font-medium italic leading-tight">
        Create.
    </div>

    <div className="text-4xl sm:text-5xl font-bold leading-tight mb-2">
        <span className="bg-gradient-to-r from-purple-600 to-yellow-600 dark:from-purple-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Expand.
        </span>
    </div>

    <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mb-6">
        The AI engine that turns raw ideas into high-impact content and accelerates your creator growth.
    </div>

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition w-full sm:w-auto text-center">
            Get Start 
        </Button>
        <Button variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground font-medium text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition w-full sm:w-auto text-center">
           Explore
        </Button>
    </div>

    <div className="flex items-center gap-2">
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <span className="text-sm text-gray-400">Rated 4.9/5 by 500+ creators</span>
    </div>
</div>



                        </div>

                        <div className="w-full max-w-xl flex justify-start lg:justify-end mt-4 sm:mt-0">
                            <div className="relative w-full h-[250px] xs:h-[370px] sm:h-[430px] md:h-[500px] rounded-xl overflow-hidden shadow-xl sm:shadow-2xl">
                                <Image
                                    src="/banner.jpg"
                                    alt="Banner"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 425px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: cursorPos.y,
                    left: cursorPos.x,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, #ffffff 0%, #d2d2d2 50%, #9e9e9e 100%)',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'screen',
                    boxShadow:
                        '0 0 20px rgba(255,255,255,1), 0 0 45px rgba(255,255,255,0.5)',
                    zIndex: 50,
                    opacity: 1,
                }}
            />

            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full -z-10 opacity-100"
            />
            
            {/* Add the new components */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
                  {socialProofStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="flex-1 min-w-[200px] max-w-[300px] flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
                          <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.metric}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <FeaturesSection />
            <Testimonials />
            <PlatformTabs />
        </div>
    );
}


    const FeaturesSection = () => {
      const { theme } = useTheme();
      const isDark = theme === 'dark';

      return (
        <section id="features" className="py-16 sm:py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Everything you need to create amazing content
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and features to help you create, manage, and grow your content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 ${
                      isDark ? 'bg-card/80' : 'bg-card'
                    }`}
                  >
                    <CardHeader className="space-y-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isDark 
                          ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                          : 'bg-primary/5'
                      }`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${feature.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {feature.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="group-hover:underline text-primary/80 hover:text-primary transition-colors"
                      >
                        Learn more
                        <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      );
    };

const Testimonials = () => (
  <section id="testimonials" className="py-16 sm:py-24 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-foreground mb-12">
        Loved by content creators worldwide
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://i.pravatar.cc/150?img=${testimonial.imageId}`}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PlatformTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500'
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block mb-3 px-4 py-2 text-base font-bold bg-primary/10 text-primary rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Transform Your Content Creation
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover powerful tools designed to elevate your content strategy and grow your audience
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-1/3 bg-gradient-to-b from-card to-card/80 p-1">
              <div className="space-y-1 p-2">
                {platformTabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-start gap-3 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary shadow-md' 
                          : 'hover:bg-muted/50 border-l-4 border-transparent hover:border-muted-foreground/20'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${
                        isActive 
                          ? 'bg-gradient-to-br ' + tabColors[index] + ' text-white shadow-lg' 
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isActive ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'
                        }`}>
                          {tab.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isActive ? 'text-muted-foreground' : 'text-muted-foreground/70 group-hover:text-muted-foreground'
                        }`}>
                          {tab.description.split('.').slice(0, 1)}.
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-2/3 p-8 bg-gradient-to-br from-card to-card/90">
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/5 text-primary text-sm font-medium rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {platformTabs[activeTab].title}
                  </div>
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-4">
                    {platformTabs[activeTab].title} Features
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {platformTabs[activeTab].description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <ul className="space-y-4">
                    {platformTabs[activeTab].features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="group flex items-start gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          i % 2 === 0 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{feature}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50">
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden px-8 py-6 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    No credit card required · 7-day free trial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
