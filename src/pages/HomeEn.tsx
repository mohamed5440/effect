import { motion, useScroll, useTransform, AnimatePresence, useMotionTemplate } from "motion/react";
import { 
  ArrowUpRight, Menu, X, Info, Layers, Crown, MessageSquare, 
  Megaphone, Smartphone, PenTool, Clapperboard, MonitorSmartphone, Terminal, 
  Gem, Rocket, Home as HomeIcon, LayoutGrid, Instagram, Facebook,
  CheckCircle2, Users, TrendingUp, Lock, Languages, Mail, MessageCircle
} from "lucide-react";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeEn() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for active section
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'about', 'services', 'pricing', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'contact') {
      navigate('/contact');
      return;
    }
    if (id === 'join') {
      navigate('/join');
      return;
    }
    setIsMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { scrollY, scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const navBg = useTransform(scrollY, [0, 50], ["rgba(5, 5, 5, 0)", "rgba(15, 15, 15, 0.8)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]);
  const navBlurValue = useTransform(scrollY, [0, 50], [0, 16]);
  const navBackdropFilter = useMotionTemplate`blur(${navBlurValue}px)`;
  const navShadow = useTransform(scrollY, [0, 50], ["none", "0 10px 30px -10px rgba(0,0,0,0.5)"]);

  const services = [
    { id: "01", title: "Digital Marketing", desc: "Google Ads and all platforms for maximum reach.", icon: <Megaphone size={24} /> },
    { id: "02", title: "Social Media Management & Strategy", desc: "Content and engagement strategies to build a community around your brand.", icon: <Smartphone size={24} /> },
    { id: "03", title: "Creative Design", desc: "Building visual identities that express the core of your project.", icon: <PenTool size={24} /> },
    { id: "04", title: "Video Production & Editing", desc: "Engaging visual content that tells your story cinematically.", icon: <Clapperboard size={24} /> },
    { id: "05", title: "Web Design & Development", desc: "Designing and developing fast, responsive websites that enhance user experience.", icon: <MonitorSmartphone size={24} /> },
    { id: "06", title: "Custom Programming & Tech Solutions", desc: "Custom programming and smart tech solutions to develop your business.", icon: <Terminal size={24} /> },
  ];

  const levels = [
    { 
      level: "Level 1", 
      name: "Premium", 
      desc: "High-level execution for brands seeking the best. Advanced strategies, highly experienced team, and full focus on maximum results.",
      icon: <Crown size={32} />
    },
    { 
      level: "Level 2", 
      name: "Basic", 
      desc: "Smart solutions at an affordable cost without sacrificing quality. Suitable for startups and growing projects.",
      icon: <Rocket size={32} />
    }
  ];

  return (
    <div className="min-h-screen font-english selection:bg-accent selection:text-black text-left bg-deep-black overflow-x-hidden" dir="ltr">
      {/* Navigation */}
      <motion.nav 
        style={{ 
          backgroundColor: navBg,
          borderColor: navBorder,
          backdropFilter: navBackdropFilter,
          boxShadow: navShadow
        }}
        className="fixed top-4 left-4 right-4 md:top-6 md:left-12 md:right-12 z-50 flex justify-between items-center px-4 py-3 md:px-10 md:py-6 rounded-full border transition-all duration-300" 
        dir="ltr"
      >
        {/* Left (Start in LTR) - Menu & Language */}
        <div className="flex items-center gap-2 md:gap-3 z-10">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 md:gap-4 text-white hover:text-accent transition-all group bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 md:px-8 md:py-4 rounded-full"
          >
            <div className="flex flex-col items-start justify-center gap-1 md:gap-2">
              <span className="w-4 md:w-6 h-[2px] bg-current transition-all group-hover:w-7"></span>
              <span className="w-2 md:w-4 h-[2px] bg-current transition-all group-hover:w-7"></span>
            </div>
            <span className="hidden md:block text-xs md:text-sm font-bold uppercase tracking-widest">Menu</span>
          </button>

          <button 
            onClick={() => navigate('/ar')}
            className="flex w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-[10px] md:text-xs"
            title="Change Language"
          >
            AR
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div onClick={() => scrollToSection('home')} className="cursor-pointer hover:scale-105 transition-transform flex items-center">
            <img referrerPolicy="no-referrer"
              src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
              alt="Site Logo" 
              className="h-9 md:h-16 w-auto object-contain"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        
        {/* Right (End in LTR) - Actions */}
        <div className="flex items-center z-10">
          <button onClick={() => scrollToSection('contact')} className="bg-white text-black px-4 py-2 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group">
            <span className="hidden sm:block">Contact Us</span>
            <span className="sm:hidden">Contact</span>
            <ArrowUpRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Side Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />
        )}
        
        {isMenuOpen && (
            <motion.div 
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] sm:w-[400px] z-[70] bg-[#050505]/90 backdrop-blur-3xl border-l border-white/10 text-white overflow-hidden flex flex-col"
              dir="ltr"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-accent/20 blur-[120px] rounded-full"></div>
                  <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[30%] bg-accent/10 blur-[100px] rounded-full"></div>
                </div>

                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10">
                  <div className="flex items-center">
                    <img referrerPolicy="no-referrer"
                      src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
                      alt="Logo" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-90 transition-all duration-500 group"
                    aria-label="Close Menu"
                  >
                    <X size={20} className="text-white/70 group-hover:text-white" />
                  </button>
                </div>

                {/* Main Navigation Section */}
                <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 custom-scrollbar flex flex-col">
                  <div className="flex-1">
                    <span className="text-white/30 font-bold text-[10px] uppercase tracking-[0.2em] block mb-6">Quick Navigation</span>
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.05 } }
                      }}
                      className="space-y-2"
                    >
                      {[
                        { name: "Home", id: "home", icon: <HomeIcon size={18} />, desc: "Back to top" },
                        { name: "About Us", id: "about", icon: <Info size={18} />, desc: "Discover our story" },
                        { name: "Our Services", id: "services", icon: <Layers size={18} />, desc: "What we offer" },
                        { name: "Pricing", id: "pricing", icon: <Gem size={18} />, desc: "Plans for your ambition" },
                        { name: "Contact Us", id: "contact", icon: <MessageSquare size={18} />, desc: "We are here to listen" },
                        { name: "Join Us", id: "join", icon: <LayoutGrid size={18} />, desc: "Be part of our team" },
                      ].map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <motion.button
                            key={item.name}
                            variants={{
                              hidden: { x: 20, opacity: 0 },
                              visible: { x: 0, opacity: 1 }
                            }}
                            onClick={() => {
                              scrollToSection(item.id);
                              setIsMenuOpen(false);
                            }}
                            className={`flex items-center gap-4 p-3 w-full rounded-2xl transition-all duration-300 group relative ${
                              isActive ? "bg-accent/10 border border-accent/20" : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              isActive ? "bg-accent text-white" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                            }`}>
                              {item.icon}
                            </div>
                            <div className="text-left">
                              <div className={`font-bold text-sm transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                                {item.name}
                              </div>
                              <div className="text-[10px] text-white/40 font-medium mt-0.5">{item.desc}</div>
                            </div>
                            <ArrowUpRight size={16} className={`ml-auto transition-all duration-500 ${isActive ? "text-accent opacity-100" : "text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-[4px]"}`} />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>

                  {/* Socials */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <span className="text-white/30 font-bold text-[10px] uppercase tracking-[0.2em] block mb-4 text-center">Follow Us</span>
                    <div className="flex justify-center gap-4">
                      {[
                        { icon: <Instagram size={18} />, color: "hover:bg-accent/20 hover:text-accent hover:border-accent/50", href: "https://www.instagram.com/effect_media_?igsh=OXVyMGg2OTNnMXg3&utm_source=qr" },
                        { icon: <Facebook size={18} />, color: "hover:bg-accent/20 hover:text-accent hover:border-accent/50", href: "https://www.facebook.com/share/1DywgUR5gC/?mibextid=wwXIfr" },
                        { icon: <WhatsAppIcon size={18} />, color: "hover:bg-accent/20 hover:text-accent hover:border-accent/50", href: "https://wa.me/201027226917" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-all duration-300 bg-white/5 ${social.color}`}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Section */}
                <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-20 flex flex-col gap-5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                      <Languages size={14} />
                      <span>Language:</span>
                    </div>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                      <button onClick={() => navigate('/ar')} className="px-3 py-1.5 rounded-md bg-transparent text-white/40 font-bold text-xs flex items-center justify-center hover:text-white transition-all">
                        AR
                      </button>
                      <button className="px-3 py-1.5 rounded-md bg-accent text-white font-bold text-xs flex items-center justify-center transition-all">
                        English
                      </button>
                    </div>
                  </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-20 overflow-hidden bg-deep-black">
        {/* Full Screen Background Image */}
        <div className="absolute inset-0 z-0">
          <img referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 grayscale"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black/90 via-deep-black/60 to-deep-black"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center pt-6 px-4">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-white leading-[1.2] lg:leading-[1.1] mb-6 max-w-4xl tracking-tight">
              Turn your ideas&nbsp;into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Digital Success</span> with us!
            </h1>

            <p className="text-base md:text-xl text-white/80 max-w-2xl mb-6 leading-relaxed font-light">
              We are your partner in product design, web development, and brand building for every stage of your business.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full sm:w-auto">
              <motion.button 
                onClick={() => scrollToSection('services')}
                className="btn-primary w-full sm:w-auto text-base md:text-lg"
              >
                Start Your Project
              </motion.button>
              
              <motion.button 
                onClick={() => scrollToSection('contact')}
                className="btn-secondary w-full sm:w-auto text-base md:text-lg backdrop-blur-sm"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 cursor-pointer group"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-accent transition-colors duration-300">Scroll</span>
          <div className="w-[2px] h-16 bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 sm:px-6 md:px-20 py-8 md:py-12 bg-deep-black overflow-hidden relative">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex flex-col items-center">
            
            {/* Content (Text) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-8 items-center"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                  />
                </div>
                <span className="section-subtitle mb-0">About Us</span>
                <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                  />
                </div>
              </div>
              
              <h2 className="section-title leading-[1.2] text-center">
                We don't just keep up with the future, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">We create it.</span>
              </h2>
              
              <div className="flex flex-col gap-6 text-base md:text-lg text-white/70 leading-relaxed font-light text-center">
                <p>
                  <strong className="text-white font-bold">Effect Media</strong> is an integrated digital agency aiming to achieve real, measurable growth. We blend strategy, creativity, and technology to help brands scale faster.
                </p>
                
                {/* Features List */}
                <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-6 mt-4">
                  {[
                    "Data-driven decisions",
                    "Eye-catching creative execution",
                    "Long-term partnerships"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="text-accent shrink-0">
                        <CheckCircle2 size={18} />
                      </div>
                      <span className="text-white/90 font-medium text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12 bg-deep-black text-white overflow-hidden relative border-t border-white/5">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-6 gap-4 md:gap-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                  />
                </div>
                <span className="section-subtitle mb-0">Our Services</span>
              </div>
              <h2 className="section-title">What <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">we offer?</span></h2>
            </div>
            <p className="max-w-sm text-white/50 text-sm md:text-base font-light leading-relaxed">
              Integrated digital solutions tailored to grow your business and maximize your digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -5 }}
                className="glass-card p-8 md:p-10 group"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-black transition-all duration-500">
                  {service.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{service.title}</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed font-light group-hover:text-white/70 transition-colors">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Levels Section */}
      <section id="pricing" className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12 bg-deep-black text-white overflow-hidden relative border-t border-white/5">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,127,0.05),transparent_50%)]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-4 md:mb-6 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                />
              </div>
              <span className="section-subtitle mb-0">Packages</span>
              <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                />
              </div>
            </div>
            <h2 className="section-title"><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Service</span> Levels</h2>
            <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto font-light">We offer flexible solutions that fit your budget and project stage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {levels.map((level, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent/20"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 transition-all duration-500 group-hover:bg-accent group-hover:text-black group-hover:border-accent">
                    {level.icon}
                  </div>
                  <span className="text-accent font-bold text-xs md:text-sm tracking-widest uppercase bg-accent/10 px-4 py-2 rounded-2xl border border-accent/20 group-hover:bg-accent group-hover:text-black transition-colors">{level.level}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black relative z-10 text-white">{level.name}</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed font-light relative z-10 group-hover:text-white/70 transition-colors">
                  {level.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-deep-black text-white pt-8 md:pt-10 pb-6 px-4 sm:px-8 md:px-12 lg:px-20 border-t border-white/5 relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.02] z-0">
          <span className="text-[35vw] font-black uppercase whitespace-nowrap leading-none text-white">
            EFFECT
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Middle Section: Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10">
            {/* Brand Column */}
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              <img referrerPolicy="no-referrer"
                src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
                alt="Site Logo" 
                className="h-12 md:h-16 w-auto object-contain self-start"
                loading="lazy"
                decoding="async"
              />
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm font-light">
                We are a creative agency specializing in turning ideas into inspiring digital experiences. We combine strategy and design to achieve tangible results for your business growth.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {[
                  { icon: <Instagram size={18} />, label: "Instagram", href: "https://www.instagram.com/effect_media_?igsh=OXVyMGg2OTNnMXg3&utm_source=qr" },
                  { icon: <Facebook size={18} />, label: "Facebook", href: "https://www.facebook.com/share/1DywgUR5gC/?mibextid=wwXIfr" },
                  { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", href: "https://wa.me/201027226917" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all bg-white/5 hover:scale-110"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-8">
              {/* Column 1 */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                    />
                  </div>
                  <span className="text-accent font-bold text-xs uppercase tracking-widest">Sitemap</span>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "Home", id: "home" },
                    { name: "About Us", id: "about" },
                    { name: "Our Services", id: "services" },
                    { name: "Pricing", id: "pricing" },
                    { name: "Join Us", id: "/join", isRoute: true }
                  ].map(link => (
                    <button 
                      key={link.name} 
                      onClick={() => link.isRoute ? navigate(link.id) : scrollToSection(link.id)} 
                      className="text-sm md:text-base font-medium text-white/60 hover:text-white hover:translate-x-[4px] transition-all w-fit text-left"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                    />
                  </div>
                  <span className="text-accent font-bold text-xs uppercase tracking-widest">Our Services</span>
                </div>
                <div className="flex flex-col gap-4">
                  {["Digital Marketing", "Social Media Management", "Creative Design", "Web Development"].map(link => (
                    <button key={link} onClick={() => scrollToSection('services')} className="text-sm md:text-base font-medium text-white/60 hover:text-white hover:translate-x-[4px] transition-all w-fit text-left">{link}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Copyright */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex justify-center items-center gap-6 text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span>© 2026 Effect Media. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
