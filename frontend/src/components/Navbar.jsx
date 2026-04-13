import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Heart } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <img src="/logo.png" alt="Dharam Yatra" className="h-12 w-auto mr-2" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
                    <Link to="/stays" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Stays</Link>
                    <Link to="/transport" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Transport</Link>
                    <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">About</Link>
                    <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact</Link>
                    {user && user.isAdmin && (
                        <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">Dashboard</Link>
                    )}

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/favorites" className="text-gray-300 hover:text-white transition-colors" title="Favorites">
                                <Heart size={20} />
                            </Link>
                            <div className="flex items-center space-x-2 group relative">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    {user.avatar && user.avatar !== 'https://res.cloudinary.com/dswtemx8x/image/upload/v1/stayphere/default_avatar.png' ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
                                            <User size={16} className="text-primary" />
                                        </div>
                                    )}
                                    <span className="text-white text-sm font-medium">{user.username || user.name}</span>
                                </div>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-dark border border-white/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all text-sm font-medium text-white border border-white/10">
                            <User size={16} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
                    <div className="px-6 py-4 flex flex-col space-y-4">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block">Home</Link>
                        <Link to="/stays" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block">Stays</Link>
                        <Link to="/transport" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block">Transport</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block">About</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block">Contact</Link>
                        {user && user.isAdmin && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary hover:text-primary/80 block">Dashboard</Link>
                        )}
                        {user ? (
                            <div className="pt-4 border-t border-white/10 mt-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
                                            <User size={20} className="text-primary" />
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-white block font-medium">{user.username || user.name}</span>
                                        <span className="text-gray-400 text-xs">{user.email}</span>
                                    </div>
                                </div>
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full text-left text-gray-300 py-2 hover:bg-white/5 rounded-lg px-2 transition-colors block">
                                    Profile
                                </Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-red-400 py-2 hover:bg-white/5 rounded-lg px-2 transition-colors mt-1">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-primary font-medium block">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
