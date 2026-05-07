import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Plus, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        project: '', 
        priority: 'Medium',
        assignedTo: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchTasks();
        if (user?.role === 'Admin') {
            fetchProjects();
            fetchUsers();
        }
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        const res = await api.get('/projects');
        setProjects(res.data);
    };

    const fetchUsers = async () => {
        const res = await api.get('/auth/users');
        setUsers(res.data);
    };

    const handleEditClick = (task) => {
        setEditingTask(task._id);
        setFormData({
            title: task.title,
            description: task.description,
            project: task.project?._id || '',
            priority: task.priority,
            assignedTo: task.assignedTo?._id || ''
        });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', project: '', priority: 'Medium', assignedTo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            handleModalClose();
            fetchTasks();
        } catch (err) {
            alert('Failed to save task');
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-y-auto h-screen">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-[1.8rem] lg:text-[2rem] font-bold mb-2">Tasks</h1>
                        <p className="text-text-muted">Track and manage project tasks.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={20} /> New Task
                        </button>
                    )}
                </header>

                <div className="glass-card p-0 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse text-left min-w-[700px]">
                            <thead>
                                <tr className="bg-white/[0.03] text-text-muted text-[0.9rem]">
                                    <th className="p-5">Task Name</th>
                                    <th className="p-5">Priority</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5">Assigned To</th>
                                    <th className="p-5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id} className="border-b border-white/10 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-5">
                                            <div className="font-semibold">{task.title}</div>
                                            <div className="text-[0.8rem] text-text-muted">{task.project?.name}</div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-md text-[0.8rem] font-medium ${
                                                task.priority === 'High' 
                                                ? 'bg-red-500/15 text-red-500' 
                                                : task.priority === 'Medium' 
                                                ? 'bg-amber-500/15 text-amber-500'
                                                : 'bg-blue-500/15 text-blue-500'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    task.status === 'Done' ? 'bg-emerald-500' : 
                                                    task.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`}></div>
                                                {task.status}
                                            </div>
                                        </td>
                                        <td className="p-5 text-text-muted">{task.assignedTo?.name || 'Unassigned'}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <select 
                                                    className="bg-transparent border border-white/10 text-white p-1 rounded cursor-pointer outline-none focus:border-primary"
                                                    defaultValue={task.status}
                                                    onChange={(e) => updateStatus(task._id, e.target.value)}
                                                >
                                                    <option value="To Do" className="bg-slate-800">To Do</option>
                                                    <option value="In Progress" className="bg-slate-800">In Progress</option>
                                                    <option value="Done" className="bg-slate-800">Done</option>
                                                    <option value="Review" className="bg-slate-800">Review</option>
                                                </select>
                                                {user?.role === 'Admin' && (
                                                    <button 
                                                        onClick={() => handleEditClick(task)}
                                                        className="text-text-muted hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100]">
                        <div className="glass-card fade-in w-[500px] p-10">
                            <h2 className="mb-6">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Task Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Project</label>
                                    <select 
                                        required
                                        value={formData.project}
                                        onChange={(e) => setFormData({...formData, project: e.target.value})}
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(p => (
                                            <option key={p._id} value={p._id} className="text-black">{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Assign To (Optional)</label>
                                    <select 
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id} className="text-black">{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Priority</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="Low" className="text-black">Low</option>
                                        <option value="Medium" className="text-black">Medium</option>
                                        <option value="High" className="text-black">High</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Description</label>
                                    <textarea 
                                        rows="3" 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button type="button" className="btn bg-white/5 hover:bg-white/10" onClick={handleModalClose}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingTask ? 'Update Task' : 'Create Task'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tasks;
