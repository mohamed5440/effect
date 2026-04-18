import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, Clock, CheckCircle, XCircle, FileText, ChevronDown, Trash2, Search, Filter, Download, ArrowUpDown, Languages, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { sanitize } from '../lib/security';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  expertise: string;
  experience: string;
  portfolio?: string;
  skills?: string;
  min_rate?: string;
  max_rate?: string;
  bio?: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  created_at: string;
}

type FilterStatus = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'applications' | 'contacts'>('applications');
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // New state for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/admin/login');
        return;
      }
    };
    checkAuth();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      }
    });

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsLoading(true);
      setFetchError(null);
      
      try {
        // Fetch Applications
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);
        
        if (appError) throw appError;
        if (appData) setApplications(appData as Application[]);

        // Fetch Contacts
        const { data: contactData, error: contactError } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);
        
        if (contactError) throw contactError;
        if (contactData) setContacts(contactData as Contact[]);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setFetchError(err.message || "حدث خطأ أثناء تحميل البيانات من قاعدة البيانات.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const appSubscription = supabase
      .channel('applications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setApplications(prev => [payload.new as Application, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setApplications(prev => prev.map(app => app.id === payload.new.id ? payload.new as Application : app));
        } else if (payload.eventType === 'DELETE') {
          setApplications(prev => prev.filter(app => app.id !== payload.old.id));
        }
      })
      .subscribe();

    const contactSubscription = supabase
      .channel('contacts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContacts(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setContacts(prev => prev.map(contact => contact.id === payload.new.id ? payload.new : contact));
        } else if (payload.eventType === 'DELETE') {
          setContacts(prev => prev.filter(contact => contact.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(appSubscription);
      supabase.removeChannel(contactSubscription);
    };
  }, [navigate]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const updateStatus = async (id: string, newStatus: Application['status']) => {
    setIsUpdating(id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      showToast('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error("Error updating status:", error);
      showToast('حدث خطأ أثناء تحديث الحالة', 'error');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteItem = async (id: string) => {
    const table = activeTab === 'applications' ? 'applications' : 'contacts';
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      showToast('تم الحذف بنجاح');
      setIsDeleting(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'reviewed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'reviewed': return 'تمت المراجعة';
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    const dataToFilter = activeTab === 'applications' ? applications : contacts;
    
    let result = dataToFilter.filter(item => {
      const searchStr = activeTab === 'applications' 
        ? `${item.full_name} ${item.email} ${item.expertise}`
        : `${item.full_name} ${item.email} ${item.subject} ${item.message}`;
        
      const matchesSearch = searchStr.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'applications') {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }
      
      return matchesSearch;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [applications, contacts, searchTerm, statusFilter, sortOrder, activeTab]);

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      showToast('لا توجد بيانات لتصديرها', 'error');
      return;
    }

    let headers: string[] = [];
    let csvData: any[][] = [];

    if (activeTab === 'applications') {
      headers = ['الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الموقع', 'التخصص', 'الخبرة', 'المهارات', 'الحد الأدنى للأجر', 'الحد الأقصى للأجر', 'الحالة', 'تاريخ التقديم'];
      csvData = filteredData.map(app => [
        app.full_name,
        app.email,
        app.phone,
        app.location,
        app.expertise,
        app.experience,
        app.skills || '',
        app.min_rate || '',
        app.max_rate || '',
        getStatusText(app.status),
        new Date(app.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      ]);
    } else {
      headers = ['الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الموضوع', 'الرسالة', 'تاريخ الإرسال'];
      csvData = filteredData.map(contact => [
        contact.full_name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        new Date(contact.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير البيانات بنجاح');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-4 md:p-8 flex flex-col gap-8">
        <div className="max-w-6xl mx-auto w-full h-20 bg-white/5 rounded-2xl animate-pulse"></div>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="max-w-6xl mx-auto w-full h-12 bg-white/5 rounded-full animate-pulse max-w-md"></div>
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white p-4 md:p-8" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full  border backdrop-blur-md font-medium text-sm flex items-center gap-2 ${
              toastMessage.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">حذف الطلب؟</h2>
              <p className="text-white/50 mb-8 text-sm">هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => deleteItem(isDeleting)}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'جاري الحذف...' : 'حذف'}
                </button>
                <button 
                  onClick={() => setIsDeleting(null)}
                  disabled={isLoading}
                  className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 glass-card p-4 md:p-6 hover:bg-white/5 hover:border-white/10">
        <div className="flex items-center gap-4">
          <img referrerPolicy="no-referrer"
            src="https://i.postimg.cc/76ZDDX0v/IMG-20260408-195530-117-(2).png" 
            alt="شعار الموقع" 
            className="h-10 w-auto object-contain"
          />
          <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
          <h1 className="text-xl font-bold">لوحة تحكم المسؤولين</h1>
          <button 
            onClick={() => navigate('/')}
            className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-white/60 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-xs ml-2"
            title="تغيير اللغة"
          >
            EN
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-sm font-medium bg-white/5 px-4 py-2 rounded-xl hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
          >
            <span>تسجيل الخروج</span>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-8 flex gap-4">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border ${activeTab === 'applications' ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Users size={20} />
          طلبات الانضمام
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border ${activeTab === 'contacts' ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <FileText size={20} />
          رسائل التواصل
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-white/50 text-xs font-bold uppercase mb-1">إجمالي الطلبات</p>
            <p className="text-2xl font-black">{applications.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-white/50 text-xs font-bold uppercase mb-1">قيد الانتظار</p>
            <p className="text-2xl font-black">{applications.filter(a => a.status === 'pending').length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-green-400/10 text-green-400 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-white/50 text-xs font-bold uppercase mb-1">مقبولة</p>
            <p className="text-2xl font-black">{applications.filter(a => a.status === 'accepted').length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-red-400/10 text-red-400 flex items-center justify-center shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-white/50 text-xs font-bold uppercase mb-1">مرفوضة</p>
            <p className="text-2xl font-black">{applications.filter(a => a.status === 'rejected').length}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeTab === 'applications' && (
            <>
              <Filter size={18} className="text-white/40 ml-2 shrink-0 hidden sm:block" />
              {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2.5 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    statusFilter === status 
                      ? 'bg-accent text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'الكل' : getStatusText(status)}
                </button>
              ))}
            </>
          )}
          {activeTab === 'contacts' && (
            <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
              <MessageSquare size={18} />
              <span>رسائل التواصل الواردة ({contacts.length})</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 sm:py-2.5 px-4 text-sm text-white transition-all w-full sm:w-auto"
              title={sortOrder === 'newest' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
            >
              <ArrowUpDown size={16} className="text-white/60" />
              <span className="sm:hidden">{sortOrder === 'newest' ? 'الأحدث' : 'الأقدم'}</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 sm:py-2.5 px-4 text-sm text-white transition-all w-full sm:w-auto"
              title="تصدير إلى CSV"
            >
              <Download size={16} className="text-white/60" />
              <span className="sm:hidden">تصدير</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64 lg:w-72 shrink-0">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم، البريد..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 sm:py-2.5 pr-11 pl-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Applications/Contacts List */}
      <div className="max-w-6xl mx-auto">
        {fetchError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">خطأ في الاتصال</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto">{fetchError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all border border-white/10"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-white/80 mb-2">لا توجد نتائج</h3>
            <p className="text-white/40 text-sm">لم نتمكن من العثور على أي {activeTab === 'applications' ? 'طلبات' : 'رسائل'} تطابق بحثك أو الفلتر المحدد.</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="mt-6 text-accent hover:text-accent-light text-sm font-medium transition-colors"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {filteredData.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  {/* Item Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedApp(expandedApp === item.id ? null : item.id)}
                    className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                        {item.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-accent transition-colors truncate">{sanitize(item.full_name || '')}</h3>
                        <p className="text-white/50 text-xs sm:text-sm mt-0.5 truncate">
                          {activeTab === 'applications' ? sanitize(item.expertise || '') : sanitize(item.subject || '')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                      <div className="text-xs sm:text-sm text-white/60 flex items-center gap-1.5 sm:gap-2">
                        <Clock size={14} />
                        <span className="whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : 'غير معروف'}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {activeTab === 'applications' && (
                          <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border backdrop-blur-sm whitespace-nowrap ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        )}
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform shrink-0 ${expandedApp === item.id ? 'rotate-180 bg-white/10' : ''}`}>
                          <ChevronDown size={16} className="text-white/70" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedApp === item.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-black/40"
                      >
                        <div className="p-4 md:p-6">
                          {activeTab === 'applications' ? (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="space-y-5">
                                  <div>
                                    <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">البريد الإلكتروني</span>
                                    <a href={`mailto:${item.email}`} className="text-sm text-white/90 hover:text-accent transition-colors block truncate">{sanitize(item.email || '')}</a>
                                  </div>
                                  <div>
                                    <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">رقم الهاتف</span>
                                    <a href={`tel:${item.phone}`} className="text-sm text-white/90 hover:text-accent transition-colors block" dir="ltr">{sanitize(item.phone || '')}</a>
                                  </div>
                                  <div>
                                    <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">الموقع</span>
                                    <p className="text-sm text-white/90">{sanitize(item.location || '')}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-5">
                                  <div>
                                    <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">سنوات الخبرة</span>
                                    <p className="text-sm text-white/90">{sanitize(item.experience || '')}</p>
                                  </div>
                                  {(item.min_rate || item.max_rate) && (
                                    <div>
                                      <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">معدل الأجر بالساعة (EGP)</span>
                                      <p className="text-sm text-white/90" dir="ltr">{sanitize(item.min_rate || '0')} - {sanitize(item.max_rate || '0')}</p>
                                    </div>
                                  )}
                                  {item.portfolio && (
                                    <div>
                                      <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">رابط الأعمال (Portfolio)</span>
                                      <a href={sanitize(item.portfolio || '')} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 hover:underline break-all line-clamp-2">
                                        {sanitize(item.portfolio || '')}
                                      </a>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-5 lg:col-span-1 md:col-span-2">
                                  {item.skills && (
                                    <div>
                                      <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">المهارات والأدوات</span>
                                      <div className="flex flex-wrap gap-2">
                                        {item.skills?.split(',').map((skill: string, i: number) => (
                                          <span key={i} className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-md border border-white/5">
                                            {sanitize(skill.trim() || '')}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {item.bio && (
                                <div className="mb-8">
                                  <span className="text-accent/80 text-xs font-bold uppercase block mb-2">نبذة عن المتقدم</span>
                                  <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-5 rounded-xl border border-white/10">{sanitize(item.bio || '')}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                              <div className="md:col-span-1 space-y-5">
                                <div>
                                  <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">البريد الإلكتروني</span>
                                  <a href={`mailto:${item.email}`} className="text-sm text-white/90 hover:text-accent transition-colors block truncate">{sanitize(item.email || '')}</a>
                                </div>
                                <div>
                                  <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">رقم الهاتف</span>
                                  <a href={`tel:${item.phone}`} className="text-sm text-white/90 hover:text-accent transition-colors block" dir="ltr">{sanitize(item.phone || '')}</a>
                                </div>
                                <div>
                                  <span className="text-accent/80 text-xs font-bold uppercase block mb-1.5">الموضوع</span>
                                  <p className="text-sm text-white/90 font-bold">{sanitize(item.subject || '')}</p>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-accent/80 text-xs font-bold uppercase block mb-2">نص الرسالة</span>
                                <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-5 rounded-xl border border-white/10 min-h-[120px]">{sanitize(item.message || '')}</p>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-white/10">
                            {activeTab === 'applications' && (
                              <div className="w-full sm:w-auto">
                                <span className="text-sm font-medium text-white/60 block mb-3 sm:inline sm:mb-0 sm:ml-3">تحديث الحالة:</span>
                                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                                  <button 
                                    onClick={() => updateStatus(item.id, 'pending')}
                                    className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${item.status === 'pending' ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    قيد الانتظار
                                  </button>
                                  <button 
                                    onClick={() => updateStatus(item.id, 'reviewed')}
                                    className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${item.status === 'reviewed' ? 'bg-blue-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    مراجعة
                                  </button>
                                  <button 
                                    onClick={() => updateStatus(item.id, 'accepted')}
                                    className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${item.status === 'accepted' ? 'bg-green-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    قبول
                                  </button>
                                  <button 
                                    onClick={() => updateStatus(item.id, 'rejected')}
                                    className={`px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${item.status === 'rejected' ? 'bg-red-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    رفض
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex-grow hidden sm:block"></div>
                            
                            <button 
                              onClick={() => setIsDeleting(item.id)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl text-xs font-bold text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white transition-all border border-red-400/20 hover:border-red-500 mt-2 sm:mt-0"
                            >
                              <Trash2 size={14} />
                              <span>حذف نهائي</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
