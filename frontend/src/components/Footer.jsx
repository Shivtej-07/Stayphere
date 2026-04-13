import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Footer = () => {
    const [visitorCount, setVisitorCount] = useState(null);

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const hasVisited = sessionStorage.getItem('hasVisited');

                if (!hasVisited) {
                    const res = await fetch(`${API_BASE_URL}/stats/visit`, { method: 'POST' });
                    const data = await res.json();
                    if (data.success) {
                        setVisitorCount(data.count);
                        sessionStorage.setItem('hasVisited', 'true');
                    }
                } else {
                    const res = await fetch(`${API_BASE_URL}/stats`);
                    const data = await res.json();
                    if (data.success) {
                        setVisitorCount(data.count);
                    }
                }
            } catch (error) {
                console.error("Error fetching visitor count:", error);
            }
        };

        fetchVisitorCount();
    }, []);
    return (
        <footer className="bg-slate-900 border-t border-white/10 pt-16 pb-8 text-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center mb-6">
                            <img src="/logo.png" alt="Dharam Yatra" className="h-14 w-auto rounded-lg bg-white p-1" />
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Experience the world's most luxurious stays and unforgettable journeys. We curate comfort and style for your perfect getaway.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link to="/stays" className="text-gray-400 hover:text-primary transition-colors">Stays</Link></li>
                            <li><Link to="/fligths" className="text-gray-400 hover:text-primary transition-colors">Flights</Link></li>
                            <li><Link to="/transport" className="text-gray-400 hover:text-primary transition-colors">Transport</Link></li>
                            <li><Link to="/destinations" className="text-gray-400 hover:text-primary transition-colors">Destinations</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="text-gray-400 hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest travel updates and deals.</p>
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 focus-within:border-primary/50 transition-colors">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-none outline-none text-white w-full px-4 py-2 placeholder-gray-500"
                            />
                            <button className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                        <p>&copy; {new Date().getFullYear()} Dharam Yatra. All rights reserved.</p>
                        {visitorCount !== null && (
                            <div className="flex items-center space-x-1 text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                <Users size={14} />
                                <span className="font-semibold text-xs tracking-wide">{visitorCount.toLocaleString()} Visitors</span>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
