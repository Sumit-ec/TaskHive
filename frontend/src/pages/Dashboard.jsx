import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckCircle, Clock, List, FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({
        'To Do': 0,
        'In Progress': 0,
        'Done': 0,
        'Review': 0
    });
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'To Do', count: stats['To Do'], icon: List, color: '#94a3b8' },
        { label: 'In Progress', count: stats['In Progress'], icon: Clock, color: '#f59e0b' },
        { label: 'Done', count: stats['Done'], icon: CheckCircle, color: '#10b981' },
        { label: 'Review', count: stats['Review'], icon: FileSearch, color: '#6366f1' },
    ];

    const maxCount = Math.max(...statCards.map(c => c.count), 1);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-y-auto h-screen">
                <header className="mb-10">
                    <h1 className="text-[1.8rem] lg:text-[2rem] font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-text-muted">Here's an overview of your projects and tasks.</p>
                </header>

                <div className="grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-6 mb-10">
                    {statCards.map((card, index) => (
                        <motion.div 
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 rounded-xl" style={{ background: `${card.color}20` }}>
                                    <card.icon color={card.color} size={24} />
                                </div>
                                <span className="text-[2rem] font-bold">{card.count}</span>
                            </div>
                            <p className="text-text-muted font-medium">{card.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="glass-card p-[30px] overflow-hidden">
                    <h3 className="mb-8 text-lg font-semibold">Quick Stats</h3>
                    <div className="overflow-x-auto custom-scrollbar pb-4">
                        <div className="h-[250px] flex items-end gap-8 px-5 min-w-[500px]">
                            {statCards.map(card => {
                                const barHeight = (card.count / maxCount) * 100;
                                return (
                                    <div key={card.label} className="flex-1 flex flex-col items-center group">
                                        <div className="text-sm font-bold mb-2 transition-all duration-300" style={{ color: card.color }}>
                                            {card.count}
                                        </div>
                                        
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(barHeight, 8)}%` }}
                                            className="w-full max-w-[60px] rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                                            style={{ 
                                                background: `linear-gradient(to top, ${card.color}40, ${card.color})`,
                                                boxShadow: `0 0 30px ${card.color}20`,
                                                border: `1px solid ${card.color}40`
                                            }}
                                        ></motion.div>
                                        
                                        <span className="text-[0.85rem] font-medium text-text-muted mt-4 whitespace-nowrap">
                                            {card.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
