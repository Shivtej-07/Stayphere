import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import BookingModal from '../components/BookingModal';
import TransportSearch from '../components/TransportSearch';
import TransportCard from '../components/TransportCard';
import PopularRoutes from '../components/PopularRoutes';

const Transport = () => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial fetch trigger
    useEffect(() => {
        fetchTransports({ type: 'flight' });
    }, []);

    const fetchTransports = async (queryParams = {}) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(queryParams).toString();
            // In a real app, query params would be handled by backend
            const response = await fetch(`${API_BASE_URL}/transports?${query}`);
            const data = await response.json();

            // Client-side filtering if backend doesn't support all filters yet
            let filteredData = data;
            if (queryParams.type) {
                filteredData = filteredData.filter(t => t.type === queryParams.type);
            }
            if (queryParams.from) {
                filteredData = filteredData.filter(t => t.from.toLowerCase().includes(queryParams.from.toLowerCase()));
            }
            if (queryParams.to) {
                filteredData = filteredData.filter(t => t.to.toLowerCase().includes(queryParams.to.toLowerCase()));
            }

            setTransports(filteredData);
        } catch (error) {
            console.error('Error fetching transports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchParams) => {
        // Remove empty filters
        const activeFilters = Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v !== '')
        );
        fetchTransports(activeFilters);
    };

    const handleSelectRoute = (from, to) => {
        // Pre-fill search for popular routes
        fetchTransports({ from, to });
        // Scroll to results
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleBookClick = (transport) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue booking.');
            // we need to make sure navigate is available, but navigate is not defined in Transport.jsx! Let's just use window.location.href or add useNavigate
            window.location.href = '/login';
            return;
        }
        setSelectedTransport({
            ...transport,
            name: `${transport.company} - ${transport.from} to ${transport.to}`
        });
        setIsModalOpen(true);
    };

    // Extract unique locations for autocomplete
    const availableLocations = React.useMemo(() => {
        const locs = new Set();
        transports.forEach(t => {
            locs.add(t.from);
            locs.add(t.to);
        });
        return locs.size > 0 ? Array.from(locs).sort() : [
            'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Dehradun', 'Haridwar',
            'Rishikesh', 'Varanasi', 'Amritsar', 'Tirupati', 'Kedarnath', 'Goa', 'Hyderabad'
        ];
    }, [transports]);

    const [sortBy, setSortBy] = useState("recommended");

    const sortedTransports = [...transports].sort((a, b) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "duration") {
            const durationA = new Date(a.arrivalTime) - new Date(a.departureTime);
            const durationB = new Date(b.arrivalTime) - new Date(b.departureTime);
            return durationA - durationB;
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-dark text-white font-sans">
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
                        alt="Travel"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark"></div>
                </div>
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center pb-20">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-4 animate-fade-in-up">
                        Journeys Reimagined
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 drop-shadow-lg animate-fade-in-up delay-100">
                        Explore the World <br /> Your Way
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl animate-fade-in-up delay-200">
                        Compare and book flights, trains, and buses with our premium travel partners.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 pb-20 -mt-24 relative z-10">
                {/* Search Component */}
                <TransportSearch onSearch={handleSearch} availableLocations={availableLocations} />

                {/* Popular Routes */}
                <PopularRoutes onSelectRoute={handleSelectRoute} />

                {/* Results Section */}
                <div className="mt-12">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Available Options</h2>
                            <p className="text-gray-400">{transports.length} results found based on your preferences</p>
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
                                <option value="duration">Fastest First</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : sortedTransports.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No routes found</h3>
                            <p className="text-gray-400">Try adjusting your dates or destination.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedTransports.map((transport) => (
                                <TransportCard
                                    key={transport._id}
                                    transport={transport}
                                    onBook={handleBookClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={selectedTransport}
            />
        </div>
    );
};

export default Transport;
