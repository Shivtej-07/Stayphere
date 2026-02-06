import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, ArrowRight, Eye, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { API_BASE_URL } from '../config';

const categories = ["All", "Beach", "Mountain", "City", "Countryside", "Luxury"];

const Stays = () => {
    const navigate = useNavigate();
    const [selectedStay, setSelectedStay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");




    const [stays, setStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data (Old Hotels)
    const mockStays = [
        {
            id: "mock-1",
            name: "The Royal Paradise",
            city: "Bali, Indonesia",
            price: "$120",
            rating: 4.8,
            category: "Beach",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
            viewers: 12,
            roomsLeft: 3,
            isHot: true
        },
        {
            id: "mock-2",
            name: "Ocean View Resort",
            city: "Maldives",
            price: "$250",
            rating: 4.9,
            category: "Beach",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            viewers: 24,
            roomsLeft: 1,
            isHot: true
        },
        {
            id: "mock-3",
            name: "Mountain Retreat",
            city: "Swiss Alps",
            price: "$180",
            rating: 4.7,
            category: "Mountain",
            image: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            viewers: 8,
            roomsLeft: 5,
            isHot: false
        }
    ];

    const fallbackImages = [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    const getFallbackImage = (id) => {
        if (!id) return fallbackImages[0];
        const charCode = id.toString().charCodeAt(id.toString().length - 1);
        return fallbackImages[charCode % fallbackImages.length];
    };

    // Fetch stays from API
    React.useEffect(() => {
        const fetchStays = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/hotels`);
                if (!response.ok) throw new Error('Failed to fetch hotels');
                const json = await response.json();

                // Add simulated real-time props to fetched data
                const apiStays = (json.data || []).map(stay => {
                    const hasValidPhoto = stay.photos && stay.photos.length > 0 &&
                        !stay.photos[0].includes('share.google') &&
                        (stay.photos[0].startsWith('http') || stay.photos[0].startsWith('/'));

                    return {
                        ...stay,
                        id: stay._id, // Ensure ID compatibility
                        image: hasValidPhoto ? stay.photos[0] : getFallbackImage(stay._id),
                        viewers: Math.floor(Math.random() * 20) + 5,
                        roomsLeft: Math.floor(Math.random() * 5) + 1,
                        isHot: Math.random() > 0.7
                    };
                });

                // Merge Mock Data (Old) + API Data (New)
                setStays([...mockStays, ...apiStays]);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stays:", err);
                // If API fails, at least show mock data
                setStays(mockStays);
                setLoading(false);
            }
        };

        fetchStays();
    }, []);

    // Simulate real-time updates
    React.useEffect(() => {
        if (loading || stays.length === 0) return;

        const interval = setInterval(() => {
            setStays(currentStays => currentStays.map(stay => ({
                ...stay,
                viewers: Math.max(3, stay.viewers + Math.floor(Math.random() * 5) - 2),
                roomsLeft: stay.roomsLeft <= 1 && Math.random() > 0.8 ? 5 : stay.roomsLeft // Occasionally restock
            })));
        }, 4000);

        return () => clearInterval(interval);
    }, [loading]);

    const [sortBy, setSortBy] = useState("recommended");

    // ... (existing code)

    const filteredStays = stays.filter(stay => {
        const matchesCategory = activeCategory === "All" || stay.category === activeCategory;
        const matchesSearch = stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stay.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (sortBy === "priceLow") {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            return priceA - priceB;
        } else if (sortBy === "priceHigh") {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            return priceB - priceA;
        } else if (sortBy === "rating") {
            return b.rating - a.rating;
        }
        return 0; // "recommended" or default
    });

    const handleBookClick = (stay) => {
        setSelectedStay(stay);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="min-h-screen bg-dark pt-24 pb-12 px-6">
                {/* Background decoration */}
                <div className="fixed top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/3"></div>
                <div className="fixed bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3"></div>

                <div className="container mx-auto relative z-10">

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Live Availability</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Stay</h1>
                            <p className="text-gray-400">Browse through our handpicked collection of properties.</p>
                        </div>

                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search location or property..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        </div>
                    </div>

                    {/* Filters & Sort */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-4 border-b border-white/10 gap-4">
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStays.map((stay) => (
                            <div
                                key={stay.id}
                                onClick={() => navigate(`/stays/${stay.id}`)}
                                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={stay.image}
                                        alt={stay.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getFallbackImage(stay.id);
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-medium text-white">{stay.rating}</span>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-lg z-10">
                                        {stay.category}
                                    </div>
                                    {stay.isHot && (
                                        <div className="absolute bottom-4 left-4 bg-red-500/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-lg flex items-center animate-bounce-slow z-10">
                                            <Clock size={12} className="mr-1" />
                                            Selling Fast
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{stay.name}</h3>
                                    <div className="flex items-center text-gray-400 text-sm mb-3">
                                        <MapPin size={14} className="mr-1" />
                                        {stay.city}
                                    </div>

                                    {/* Real-time Stats */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                            <Eye size={12} className="mr-1 animate-pulse" />
                                            {stay.viewers} viewing
                                        </div>
                                        {stay.roomsLeft <= 3 && (
                                            <div className="flex items-center text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                                                <Zap size={12} className="mr-1" />
                                                Only {stay.roomsLeft} left
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div>
                                            <span className="text-xl font-bold text-white">{stay.price}</span>
                                            <span className="text-gray-500 text-xs"> / night</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookClick(stay);
                                            }}
                                            className="px-4 py-2 bg-white/10 hover:bg-primary text-white text-sm font-medium rounded-lg transition-colors border border-white/10 hover:border-primary flex items-center gap-1 group/btn"
                                        >
                                            <span>Book</span>
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredStays.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-white/5 inline-flex p-4 rounded-full mb-4">
                                <Filter size={24} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No properties found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
                            <button
                                onClick={() => setActiveCategory("All")}
                                className="mt-4 text-primary hover:underline"
                            >
                                View all properties
                            </button>
                        </div>
                    )}

                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={selectedStay}
            />
        </>
    );
};

export default Stays;
