import React from 'react';
import { Search } from 'lucide-react';

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
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center mt-20">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium mb-6 animate-fade-in-up">
                    Luxury Stays & Unforgettable Experiences
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
                    Find Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dream Getaway</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                    Discover handpicked luxury hotels and resorts around the world. Book the perfect stay for your next adventure.
                </p>

                {/* Search Box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 animate-fade-in-up delay-300 shadow-2xl">
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
                    <div className="w-full md:w-auto p-1">
                        <button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full transition-all font-medium text-sm shadow-lg shadow-primary/25">
                            <Search size={18} />
                            <span>Search</span>
                        </button>
                    </div>
                </div>

                {/* Stats or Trust Markers */}
                <div className="mt-16 flex justify-center gap-8 md:gap-16 opacity-70 animate-fade-in-up delay-500">
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
                </div>
            </div>
        </div>
    );
};

export default Hero;
