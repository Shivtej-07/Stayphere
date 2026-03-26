import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, TrendingUp, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config';
import FavoriteButton from './FavoriteButton';
import { formatPriceForCountry } from '../utils/currencyUtil';

const Destinations = () => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/destinations`);
                const data = await response.json();

                const formattedData = data.map((dest) => ({
                    id: dest._id,
                    name: dest.name,
                    subtitle: dest.name.includes(',') ? "Getaways From" : "Adventure",
                    location: dest.name.includes(',') ? dest.name.split(',')[0].trim() : dest.name,
                    country: dest.name.includes(',') ? dest.name.split(',')[1].trim() : "India",
                    image: dest.photos && dest.photos.length > 0 && dest.photos[0] ? dest.photos[0] : "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
                    price: formatPriceForCountry(Math.floor(Math.random() * 5000) + 3000, dest.name.includes(',') ? dest.name.split(',')[1].trim() : "India"), // Dynamic country currency
                    viewers: Math.floor(Math.random() * 50) + 10,
                }));
                // Ensure we have at least 4 items for the grid by duplicating if needed (for demo)
                // or just use what we have.
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


    const handleCardClick = (id) => {
        navigate(`/destinations/${id}`);
    };


    return (
        <>
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
                            Explore our handpicked destinations for your next adventure.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destinations.map((dest) => (
                            <div
                                key={dest.id}
                                className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/20"
                                onClick={() => handleCardClick(dest.id)}
                            >
                                <div className="absolute inset-0">
                                    <FavoriteButton itemId={dest.id} onModel="Destination" />
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80";
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 group-hover:via-black/20 transition-all duration-500"></div>
                                </div>

                                {/* Content - Centered / Top layout as per "Poster" style */}
                                <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 p-6 text-center z-10">

                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-2 drop-shadow-md">
                                        {dest.subtitle}
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-none mb-1">
                                        {dest.location}
                                    </h3>

                                    {/* Optional Country Tag if needed, maybe below */}
                                    {/* <span className="text-sm text-white/70 font-medium mt-1">{dest.country}</span> */}

                                </div>

                                {/* Viewer Count Badge (Top Right) */}
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 z-20">
                                    <Eye size={12} className="text-green-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-white">{dest.viewers}</span>
                                </div>

                                {/* Bottom Info & CTA */}
                                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-20">
                                    <div className="flex justify-between items-end">
                                        <div className="text-left">
                                            <div className="flex items-center text-white/80 text-xs mb-1">
                                                <MapPin size={12} className="mr-1" />
                                                {dest.country}
                                            </div>
                                            <div className="text-white font-bold text-lg">
                                                {dest.price} <span className="text-xs font-normal text-white/60">/ person</span>
                                            </div>
                                        </div>

                                        <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </>
    );
};

export default Destinations;

