import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { 
  ArrowLeft, LogIn, User, Mail, Lock, Settings, X, Info, Layers, Gem, Home as HomeIcon, LayoutGrid,
  Instagram, Facebook, Languages, AlertCircle, ArrowUpRight, MessageCircle
} from "lucide-react";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const user = api.getUser();
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

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
      navigate('/ar/contact');
    } else if (id === 'join') {
      navigate('/ar/join');
    } else {
      navigate(`/ar#${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setShowError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white font-sans selection:bg-accent selection:text-black overflow-x-hidden" dir="rtl">
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
        dir="rtl"
      >
        {/* Right (Start in RTL) - Action Button */}
        <div className="flex items-center z-10">
          <button onClick={() => navigate('/ar')} className="bg-white text-black px-4 py-2 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group">
            <span>الرئيسية</span>
            <ArrowLeft size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div onClick={() => navigate('/ar')} className="cursor-pointer hover:scale-105 transition-transform flex items-center">
            <img referrerPolicy="no-referrer"
              src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
              alt="شعار الموقع" 
              className="h-9 md:h-16 w-auto object-contain"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        
        {/* Left (End in RTL) - Menu & Language */}
        <div className="flex items-center gap-2 md:gap-3 z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-[10px] md:text-xs"
            title="تغيير اللغة"
          >
            EN
          </button>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 md:gap-4 text-white hover:text-accent transition-all group bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 md:px-8 md:py-4 rounded-full"
          >
            <span className="hidden md:block text-xs md:text-sm font-bold uppercase">القائمة</span>
            <div className="flex flex-col items-end justify-center gap-1 md:gap-2">
              <span className="w-4 md:w-6 h-[2px] bg-current transition-all group-hover:w-7"></span>
              <span className="w-2 md:w-4 h-[2px] bg-current transition-all group-hover:w-7"></span>
            </div>
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
              dir="rtl"
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
                    aria-label="إغلاق القائمة"
                  >
                    <X size={20} className="text-white/70 group-hover:text-white" />
                  </button>
                </div>

                {/* Main Navigation Section */}
                <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 custom-scrollbar flex flex-col">
                  <div className="flex-1">
                    <span className="text-white/30 font-bold text-[10px] uppercase block mb-6">التنقل السريع</span>
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.05 } }
                      }}
                      className="space-y-2"
                    >
                      {[
                        { name: "الرئيسية", id: "home", icon: <HomeIcon size={18} />, desc: "العودة للبداية" },
                        { name: "من نحن", id: "about", icon: <Info size={18} />, desc: "تعرف على قصتنا" },
                        { name: "خدماتنا", id: "services", icon: <Layers size={18} />, desc: "ماذا نقدم لك" },
                        { name: "مستويات الخدمة", id: "pricing", icon: <Gem size={18} />, desc: "خطط تناسب طموحك" },
                        { name: "اتصل بنا", id: "contact", icon: <LayoutGrid size={18} />, desc: "نحن هنا لسماعك" },
                        { name: "انضم إلينا", id: "join", icon: <LayoutGrid size={18} />, desc: "كن جزءاً من فريقنا" },
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
                            <div className="text-right">
                              <div className="font-bold text-sm transition-colors text-white/70 group-hover:text-white">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-white/40 font-medium mt-0.5">{item.desc}</div>
                            </div>
                            <ArrowUpRight size={16} className="mr-auto transition-all duration-500 text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>

                  {/* Socials */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <span className="text-white/30 font-bold text-[10px] uppercase block mb-4 text-center">تابعنا على</span>
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
                      <span>لغة الموقع:</span>
                    </div>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                      <button className="px-3 py-1.5 rounded-md bg-accent text-white font-bold text-xs flex items-center justify-center transition-all">
                        العربية
                      </button>
                      <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-md bg-transparent text-white/40 font-bold text-xs flex items-center justify-center hover:text-white transition-all">
                        EN
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
            <span className="section-subtitle mb-0">لوحة التحكم</span>
            <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              />
            </div>
          </div>
          <h1 className="section-title">تسجيل دخول <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">الإدارة</span></h1>
          <p className="text-white/50 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">أدخل البريد الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم وإدارة محتوى الموقع.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 hover:bg-white/5 hover:border-white/10 max-w-2xl mx-auto"
        >
          {/* Contact Info Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <User size={18} />
                </span>
                بيانات الدخول
              </h2>
              <p className="text-xs text-white/40 mr-11">أدخل بيانات الاعتماد الخاصة بك للمتابعة.</p>
            </div>
            

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={isSubmitting}
                    placeholder="admin@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all disabled:opacity-50" 
                    dir="ltr" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/60 uppercase mr-1">كلمة المرور</label>
                <div className="relative group">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isSubmitting}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all disabled:opacity-50" 
                    dir="ltr" 
                  />
                </div>
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
                <LogIn size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </motion.form>
      </main>

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
              <h2 className="text-2xl md:text-3xl font-black mb-4">عذراً، حدث خطأ</h2>
              <p className="text-white/50 mb-8 leading-relaxed">{showError}</p>
              <button 
                onClick={() => setShowError(null)}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

