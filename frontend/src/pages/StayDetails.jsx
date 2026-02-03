import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Wifi, Coffee, Car, Utensils, Camera, Map as MapIcon } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import BookingModal from '../components/BookingModal';

const StayDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stay, setStay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nearbyPoints, setNearbyPoints] = useState([]);
    const [liveViewers, setLiveViewers] = useState(12);
    const [loading, setLoading] = useState(true);

    // Mock data (Old Hotels) - Must match Stays.jsx
    const mockStays = [
        {
            id: "mock-1",
            name: "The Royal Paradise",
            city: "Bali, Indonesia",
            location: "Bali, Indonesia", // Ensure compatibility
            price: "$120",
            rating: 4.8,
            category: "Beach",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
            description: "Experience the ultimate luxury in the heart of Bali. Surrounded by lush greenery and pristine beaches, The Royal Paradise offers world-class amenities and breathtaking views.",
            amenities: ["Free Wifi", "Breakfast Included", "Airport Shuttle", "Swimming Pool"],
            coordinates: [-8.409518, 115.188919]
        },
        {
            id: "mock-2",
            name: "Ocean View Resort",
            city: "Maldives",
            location: "Maldives",
            price: "$250",
            rating: 4.9,
            category: "Beach",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            description: "Wake up to the sound of waves in our overwater bungalows. Pure bliss and relaxation await you at Ocean View Resort.",
            amenities: ["Private Beach", "Spa", "Water Sports", "Gourmet Dining"],
            coordinates: [3.2028, 73.2207]
        },
        {
            id: "mock-3",
            name: "Mountain Retreat",
            city: "Swiss Alps",
            location: "Swiss Alps",
            price: "$180",
            rating: 4.7,
            category: "Mountain",
            image: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Nestled in the heart of the Alps, this retreat offers cozy cabins and spectacular mountain views.",
            amenities: ["Ski Access", "Fireplace", "Hot Tub", "Hiking Trails"],
            coordinates: [46.8182, 8.2275]
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

    useEffect(() => {
        const fetchStay = async () => {
            setLoading(true);
            let foundStay = null;

            // Check if it's a mock stay
            if (id.startsWith('mock-')) {
                foundStay = mockStays.find(s => s.id === id);
            } else {
                // Fetch from API
                try {
                    const response = await fetch('http://localhost:5000/api/hotels');
                    if (response.ok) {
                        const json = await response.json();
                        const apiStay = (json.data || []).find(s => s._id === id);

                        if (apiStay) {
                            const hasValidPhoto = apiStay.photos && apiStay.photos.length > 0 &&
                                !apiStay.photos[0].includes('share.google') &&
                                (apiStay.photos[0].startsWith('http') || apiStay.photos[0].startsWith('/'));

                            foundStay = {
                                ...apiStay,
                                id: apiStay._id,
                                location: apiStay.city || apiStay.address, // Ensure location string
                                image: hasValidPhoto ? apiStay.photos[0] : getFallbackImage(apiStay._id),
                                amenities: ["Free Wifi", "Breakfast Included", "Pool", "Gym"], // Default amenities if missing
                                coordinates: apiStay.location && apiStay.location.coordinates
                                    ? [apiStay.location.coordinates[1], apiStay.location.coordinates[0]] // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
                                    : [0, 0]
                            };
                        }
                    }
                } catch (err) {
                    console.error("Error fetching stay details:", err);
                }
            }

            setStay(foundStay);

            // Generate nearby points
            if (foundStay && foundStay.coordinates) {
                const [lat, lng] = foundStay.coordinates;
                setNearbyPoints([
                    { title: foundStay.name, position: [lat, lng], description: "Your selected stay" },
                    { title: "Local Attraction", position: [lat + 0.01, lng + 0.01], description: "Popular spot nearby" },
                    { title: "Dining", position: [lat - 0.005, lng + 0.015], description: "Great food options" }
                ]);
            }

            setLoading(false);
        };

        fetchStay();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveViewers(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-dark pt-24 text-white text-center">Loading...</div>;
    }

    if (!stay) {
        return <div className="min-h-screen bg-dark pt-24 text-white text-center">Property not found</div>;
    }

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <button
                    onClick={() => navigate('/stays')}
                    className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Stays
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column: Image and Details */}
                    <div>
                        <div className="rounded-2xl overflow-hidden mb-8 h-96 shadow-2xl border border-white/10 relative group">
                            <img
                                src={stay.image}
                                alt={stay.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getFallbackImage(stay.id);
                                }}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1 border border-white/10">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-bold text-white">{stay.rating || 4.5}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2">{stay.name}</h1>
                        <div className="flex items-center text-gray-400 mb-6">
                            <MapPin size={18} className="mr-2 text-primary" />
                            {stay.location}
                        </div>

                        {/* Live Viewers Badge */}
                        <div className="flex items-center space-x-2 mb-6 bg-red-500/10 w-fit px-3 py-1.5 rounded-full border border-red-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-red-400 text-xs font-bold uppercase tracking-wide">
                                {liveViewers} people viewing right now
                            </span>
                        </div>

                        <p className="text-gray-300 mb-8 leading-relaxed">
                            {stay.description || "Experience a wonderful stay at this property. Enjoy top-notch amenities and a relaxing atmosphere."}
                        </p>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {stay.amenities && stay.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="mr-3 text-primary">
                                            {idx === 0 ? <Wifi size={18} /> :
                                                idx === 1 ? <Coffee size={18} /> :
                                                    idx === 2 ? <Car size={18} /> : <Utensils size={18} />}
                                        </div>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price, Booking, and Map */}
                    <div className="space-y-8">
                        {/* Booking Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-white">{stay.price || "$150"}</span>
                                    <span className="text-gray-400"> / night</span>
                                </div>
                                <div className="text-sm text-green-400 font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    Available Now
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1"
                            >
                                Book This Stay
                            </button>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <MapIcon className="text-primary mr-2" size={24} />
                                <h3 className="text-xl font-bold text-white">Explore the Area</h3>
                            </div>
                            <p className="text-gray-400 mb-4 text-sm">
                                Discover nearby attractions and points of interest.
                            </p>

                            <MapComponent
                                center={stay.coordinates}
                                markers={nearbyPoints}
                                height="350px"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
                                {nearbyPoints.slice(1).map((point, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        {point.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={stay}
            />
        </div>
    );
};

export default StayDetails;
