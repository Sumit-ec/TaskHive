import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Plus, Briefcase, Users, Calendar, MoreVertical, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchProjects();
        const interval = setInterval(fetchProjects, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project._id);
        setFormData({ name: project.name, description: project.description });
        setShowModal(true);
        setActiveMenu(null);
    };

    const handleDeleteClick = (id) => {
        setProjectToDelete(id);
        setShowDeleteModal(true);
        setActiveMenu(null);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/projects/${projectToDelete}`);
            setShowDeleteModal(false);
            setProjectToDelete(null);
            fetchProjects();
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            handleModalClose();
            fetchProjects();
        } catch (err) {
            alert('Failed to save project');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen" onClick={() => setActiveMenu(null)}>
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-y-auto h-screen">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-[1.8rem] lg:text-[2rem] font-bold mb-2">Projects</h1>
                        <p className="text-text-muted">Manage and track your team's projects.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={20} /> Create Project
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-6">
                    {projects.map((project, index) => (
                        <motion.div 
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 relative"
                        >
                            <div className="flex justify-between mb-4">
                                <div className="bg-primary/10 p-2.5 rounded-xl">
                                    <Briefcase className="text-primary" size={24} />
                                </div>
                                <div className="relative">
                                    <button 
                                        className="bg-transparent border-none text-text-muted cursor-pointer hover:text-white transition-colors p-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === project._id ? null : project._id);
                                        }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    <AnimatePresence>
                                        {activeMenu === project._id && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="absolute right-0 mt-2 w-36 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                <button 
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                                                    onClick={() => handleEditClick(project)}
                                                >
                                                    <Edit2 size={14} /> Edit Project
                                                </button>
                                                <button 
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                                    onClick={() => handleDeleteClick(project._id)}
                                                >
                                                    <Trash2 size={14} /> Delete Project
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <h3 className="mb-2">{project.name}</h3>
                            <p className="text-text-muted text-[0.9rem] mb-6 line-clamp-2">
                                {project.description || 'No description provided.'}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-text-muted text-[0.85rem]">
                                    <Users size={16} className="text-primary/70" />
                                    <span>{project.memberCount || 0} Members</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-muted text-[0.85rem]">
                                    <Calendar size={16} className="text-primary/70" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card w-full max-w-[500px] p-10"
                        >
                            <h2 className="mb-6">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Project Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Description</label>
                                    <textarea 
                                        rows="4" 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 justify-end mt-8">
                                    <button type="button" className="btn bg-white/5 hover:bg-white/10" onClick={handleModalClose}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingProject ? 'Update Project' : 'Create Project'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                <AnimatePresence>
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[110] p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card w-full max-w-[400px] p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertTriangle className="text-red-500" size={32} />
                                </div>
                                <h2 className="text-xl font-bold mb-4">Delete Project?</h2>
                                <p className="text-text-muted mb-8 leading-relaxed">
                                    Are you sure you want to delete this project? <strong>All associated tasks will be permanently deleted</strong> along with the project. This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button 
                                        className="btn bg-white/5 hover:bg-white/10 flex-1 py-3" 
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn bg-red-600 hover:bg-red-700 text-white flex-1 py-3" 
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Projects;
