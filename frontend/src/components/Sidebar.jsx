import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Briefcase, CheckSquare, BarChart2, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    ];

    const sidebarContent = (
        <div className="h-full flex flex-col p-8 bg-[#0f172a] lg:bg-transparent border-r border-white/10">
            <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                        <Layout size={24} color="white" />
                    </div>
                    <h2 className="text-[1.5rem] font-bold tracking-tight">TaskHive</h2>
                </div>
                {isMobile && (
                    <button onClick={() => setIsOpen(false)} className="p-1 text-text-muted hover:text-white">
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => isMobile && setIsOpen(false)}
                        className={`group flex items-center gap-3.5 p-3.5 rounded-xl no-underline transition-all duration-200 ${
                            location.pathname === item.path 
                            ? 'text-white bg-primary/20 border border-primary/20 shadow-inner' 
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <item.icon size={20} className={location.pathname === item.path ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="glass-card p-4 mt-auto flex items-center gap-3 border border-white/5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                    <UserIcon size={22} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] font-bold truncate text-white">{user?.name}</p>
                    <p className="text-[0.7rem] text-text-muted uppercase tracking-wider font-semibold">{user?.role}</p>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all text-text-muted"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-6 left-6 z-[90] p-2 bg-primary/20 hover:bg-primary/30 border border-white/10 rounded-lg text-white transition-all backdrop-blur-md"
            >
                <Menu size={24} />
            </button>

            <aside className="hidden lg:block w-[280px] h-screen sticky top-0 shrink-0">
                {sidebarContent}
            </aside>

            <AnimatePresence>
                {isOpen && isMobile && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] z-[110]"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
