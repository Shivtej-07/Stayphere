import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            {/* Video Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1920&q=80"
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-tropical-island-4256-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-dark/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
                <div className="absolute inset-0 bg-mesh-dark opacity-40 mix-blend-screen animate-mesh pointer-events-none"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center mt-20">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium mb-6">
                    Luxury Stays & Unforgettable Experiences
                </motion.span>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Find Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dream Getaway</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Discover handpicked luxury hotels and resorts around the world. Book the perfect stay for your next adventure.
                </motion.p>

                {/* Search Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
                    className="glass-panel p-3 rounded-full max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative z-20">
                    <div className="w-full md:flex-1 px-4 py-2 border-b md:border-b-0 border-white/10">
                        <label className="block text-xs text-gray-400 mb-1 ml-1">Location</label>
                        <input
                            type="text"
                            placeholder="Where are you going?"
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                        />
                    </div>
                    <div className="w-full md:w-px h-8 bg-white/10 hidden md:block"></div>
                    <div className="w-full md:flex-1 px-4 py-2 border-b md:border-b-0 border-white/10">
                        <label className="block text-xs text-gray-400 mb-1 ml-1">Check in - Check out</label>
                        <input
                            type="text"
                            placeholder="Add dates"
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                        />
                    </div>
                    <div className="w-full md:w-auto p-1 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <button className="relative w-full md:w-auto flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full transition-all font-medium text-sm shadow-lg shadow-primary/25 animate-glow-pulse">
                            <Search size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Search</span>
                        </button>
                    </div>
                </motion.div>

                {/* Stats or Trust Markers */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-16 flex justify-center gap-8 md:gap-16 opacity-70">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">500+</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Hotels</div>
                    </div>
                    <div className="text-start">
                        <div className="text-2xl font-bold text-white">100+</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Cities</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">24/7</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Support</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
