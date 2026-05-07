import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[radial-gradient(circle_at_top_right,_#1e293b,_#0f172a)]">
            <div className="glass-card fade-in w-[400px] p-10">
                <div className="text-center mb-[30px]">
                    <div className="inline-flex p-3 bg-primary rounded-xl mb-4">
                        <Layout size={32} color="white" />
                    </div>
                    <h2 className="text-[1.8rem] font-bold">TaskHive</h2>
                    <p className="text-text-muted">Welcome back! Please login.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="pl-10" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full justify-center mt-2.5">
                        <LogIn size={20} /> Sign In
                    </button>
                </form>

                <p className="text-center mt-5 text-text-muted">
                    Don't have an account? <Link to="/signup" className="text-primary no-underline font-semibold">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
