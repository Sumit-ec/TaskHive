import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Shield, UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[radial-gradient(circle_at_bottom_left,_#1e293b,_#0f172a)]">
            <div className="glass-card fade-in w-[450px] p-10">
                <div className="text-center mb-[25px]">
                    <h2 className="text-[1.8rem] font-bold">Create Account</h2>
                    <p className="text-text-muted">Join TaskHive to manage your projects.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                className="pl-10" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="pl-10" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Role</label>
                        <div className="relative">
                            <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <select 
                                className="pl-10" 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full justify-center mt-2.5">
                        <UserPlus size={20} /> Create Account
                    </button>
                </form>

                <p className="text-center mt-5 text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary no-underline font-semibold">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
