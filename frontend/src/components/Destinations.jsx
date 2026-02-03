import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, MapPin } from 'lucide-react';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                // Assuming API_BASE_URL is imported or using relative path if proxy is set up
                // Using full localhost URL as per other components if needed, or importing config
                const response = await fetch('http://localhost:5000/api/destinations');
                const data = await response.json();
                // Map API data to component structure if different
                // API returns: { name, description, photos, featured, ... }
                // Component expects: { name, country (maybe embedded in name or desc), image, count, size, viewers, trending, price }
                // We'll adapt the data
                const formattedData = data.map((dest, index) => ({
                    id: dest._id,
                    name: dest.name,
                    country: dest.name.includes(',') ? dest.name.split(',')[1].trim() : "India",
                    image: dest.photos && dest.photos.length > 0 && dest.photos[0] ? dest.photos[0] : "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
                    count: "Properties Available", // Static for now as we don't have count from API
                    size: index % 4 === 0 ? "large" : "small", // Grid layout logic
                    viewers: Math.floor(Math.random() * 50) + 10,
                    trending: dest.featured,
                    price: "Explore" // Placeholder
                }));
                setDestinations(formattedData);
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchDestinations();

        // Real-time viewer simulation
        const interval = setInterval(() => {
            setDestinations(prev => prev.map(dest => ({
                ...dest,
                viewers: Math.max(5, dest.viewers + Math.floor(Math.random() * 5) - 2)
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-dark relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live Updates</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Trending Destinations
                            </span>
                        </h2>
                    </div>
                    <p className="text-gray-400 text-lg max-w-md md:text-right">
                        Real-time tracking of our most popular locations right now.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className={`relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10 ${dest.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                                dest.size === 'medium' ? 'md:col-span-2' : ''
                                }`}
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80";
                                }}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                            {/* Live Badge */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {dest.trending && (
                                    <div className="bg-orange-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 w-fit shadow-lg shadow-orange-500/20">
                                        <TrendingUp size={12} className="text-white" />
                                        <span className="text-xs font-bold text-white">Trending</span>
                                    </div>
                                )}
                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 w-fit border border-white/10">
                                    <Eye size={12} className="text-primary animate-pulse" />
                                    <span className="text-xs font-medium text-white">{dest.viewers} viewing</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                                            {dest.count}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                            <span className="text-white text-xs font-bold">{dest.price}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                        {dest.name}
                                    </h3>

                                    <div className="flex items-center text-gray-300 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                        <MapPin size={14} className="mr-1" />
                                        {dest.country}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Destinations;

