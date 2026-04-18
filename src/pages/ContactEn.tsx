import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { 
  ArrowLeft, Send, User, Mail, Phone, MapPin, MessageSquare, CheckCircle2,
  ArrowUpRight, X, Info, Layers, Gem, Home as HomeIcon, LayoutGrid,
  Instagram, Facebook, Languages, MessageCircle
} from "lucide-react";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { contactSchemaEn, sanitizeContact } from "../lib/security";
import { z } from "zod";

export default function ContactEn() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ["rgba(5, 5, 5, 0)", "rgba(15, 15, 15, 0.8)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]);
  const navBlurValue = useTransform(scrollY, [0, 50], [0, 16]);
  const navBackdropFilter = useMotionTemplate`blur(${navBlurValue}px)`;
  const navShadow = useTransform(scrollY, [0, 50], ["none", "0 10px 30px -10px rgba(0,0,0,0.5)"]);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'contact') {
      navigate('/contact');
    } else if (id === 'join') {
      navigate('/join');
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Honeypot check
    if (formData.get('website')) {
      console.warn("Bot submission detected");
      setIsSubmitting(false);
      return;
    }

    const rawData = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      // 1. Validate data
      const validatedData = contactSchemaEn.parse(rawData);
      
      // 2. Sanitize data
      const sanitizedData = sanitizeContact({
        ...validatedData,
        created_at: new Date().toISOString()
      });

      // 3. Submit to Supabase (assuming a 'contacts' table exists or using a generic approach)
      const { error } = await supabase
        .from('contacts')
        .insert([sanitizedData]);

      if (error) throw error;
      
      setShowSuccess(true);
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      if (error?.issues?.[0]?.message) {
        setShowError(error.issues[0].message);
      } else {
        setShowError(error.message || "An error occurred while sending the message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white font-english selection:bg-accent selection:text-black overflow-x-hidden" dir="ltr">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

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
            onClick={() => navigate('/ar/contact')}
            className="flex w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-[10px] md:text-xs"
            title="Change Language"
          >
            AR
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div onClick={() => navigate('/')} className="cursor-pointer hover:scale-105 transition-transform flex items-center">
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
          <button onClick={() => navigate('/')} className="bg-white text-black px-4 py-2 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group">
            <span>Home</span>
            <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
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
                        return (
                          <motion.button
                            key={item.name}
                            variants={{
                              hidden: { x: 20, opacity: 0 },
                              visible: { x: 0, opacity: 1 }
                            }}
                            onClick={() => {
                              handleNavClick(item.id);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-4 p-3 w-full rounded-2xl transition-all duration-300 group relative hover:bg-white/5 border border-transparent"
                          >
                            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white">
                              {item.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-sm transition-colors text-white/70 group-hover:text-white">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-white/40 font-medium mt-0.5">{item.desc}</div>
                            </div>
                            <ArrowUpRight size={16} className="ml-auto transition-all duration-500 text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-[4px]" />
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
                      <button onClick={() => navigate('/ar/contact')} className="px-3 py-1.5 rounded-md bg-transparent text-white/40 font-bold text-xs flex items-center justify-center hover:text-white transition-all">
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

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-4 md:pt-36 md:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              />
            </div>
            <span className="section-subtitle mb-0">Contact Us</span>
            <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              />
            </div>
          </div>
          <h1 className="section-title">We are here <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">to listen</span></h1>
          <p className="text-white/50 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">Do you have an inquiry or want to start a new project? Fill out the form below and our team will get back to you shortly.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 hover:bg-white/5 hover:border-white/10"
        >
          {/* Contact Info Section */}
          <div className="flex flex-col gap-6">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <User size={18} />
                </span>
                Contact Information
              </h2>
              <p className="text-xs text-white/40 ml-11">Enter your details so we can reply to your message.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input type="text" name="full_name" required placeholder="Enter your full name" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input type="email" name="email" required placeholder="Enter your email address" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input type="tel" name="phone" required placeholder="Enter your phone number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Subject</label>
                <div className="relative group">
                  <Info size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input type="text" name="subject" required placeholder="What is the subject of your message?" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <MessageSquare size={18} />
                </span>
                Message
              </h2>
              <p className="text-xs text-white/40 ml-11">Write the details of your inquiry or project here.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Message Body</label>
              <div className="relative group">
                <MessageSquare size={18} className="absolute left-4 top-4 text-white/20 group-focus-within:text-accent transition-colors" />
                <textarea name="message" required placeholder="How can we help you?" rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-accent-light transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 group"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </motion.form>
      </main>

      {/* Footer */}
      <footer className="bg-deep-black text-white pt-8 md:pt-10 pb-6 px-4 sm:px-8 md:px-12 lg:px-20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10">
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              <img referrerPolicy="no-referrer"
                src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
                alt="Site Logo" 
                className="h-12 md:h-16 w-auto object-contain self-start"
                loading="lazy"
              />
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm font-light">
                We are a creative agency specializing in turning ideas into inspiring digital experiences. We combine strategy and design to achieve tangible results for your business growth.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {[
                  { icon: <Instagram size={18} />, label: "Instagram", color: "hover:text-accent hover:border-accent/50 hover:bg-accent/10", href: "https://www.instagram.com/effect_media_?igsh=OXVyMGg2OTNnMXg3&utm_source=qr" },
                  { icon: <Facebook size={18} />, label: "Facebook", color: "hover:text-accent hover:border-accent/50 hover:bg-accent/10", href: "https://www.facebook.com/share/1DywgUR5gC/?mibextid=wwXIfr" },
                  { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", color: "hover:text-accent hover:border-accent/50 hover:bg-accent/10", href: "https://wa.me/201027226917" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 transition-all bg-white/5 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-accent font-bold text-xs uppercase">Sitemap</span>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "Home", path: "/" },
                    { name: "Join Us", path: "/join" },
                    { name: "Contact Us", path: "/contact" }
                  ].map(link => (
                    <button 
                      key={link.name} 
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(link.path);
                      }} 
                      className="text-sm md:text-base font-medium text-white/60 hover:text-white hover:translate-x-[4px] transition-all w-fit text-left"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-accent font-bold text-xs uppercase">Our Services</span>
                </div>
                <div className="flex flex-col gap-4">
                  {["Digital Marketing", "Social Media Management", "Creative Design", "Web Development"].map(link => (
                    <button key={link} onClick={() => navigate('/')} className="text-sm md:text-base font-medium text-white/60 hover:text-white hover:translate-x-[4px] transition-all w-fit text-left">{link}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex justify-center items-center gap-6 text-[10px] md:text-xs text-white/30 uppercase">
            <span>© 2026 Effect Media. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSuccess(false);
                window.scrollTo(0, 0);
                navigate("/");
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 md:p-12 rounded-3xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">Submitted Successfully!</h2>
              <p className="text-white/50 mb-8 leading-relaxed">Thank you for contacting Effect Media. We have received your message and our team will reply as soon as possible.</p>
              <button 
                onClick={() => {
                  setShowSuccess(false);
                  window.scrollTo(0, 0);
                  navigate("/");
                }}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowError(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 md:p-12 rounded-3xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <X size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">Sorry, an error occurred</h2>
              <p className="text-white/50 mb-8 leading-relaxed">{showError}</p>
              <button 
                onClick={() => setShowError(null)}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
