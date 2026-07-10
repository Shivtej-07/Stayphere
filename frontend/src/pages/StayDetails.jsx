import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MapPin, Star, ArrowLeft, Wifi, Coffee, Car, Utensils, Camera, Map as MapIcon,
    Compass, Navigation, CornerUpRight, CornerUpLeft, ArrowUp, CheckCircle2,
    Train, Bike, Footprints
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import BookingModal from '../components/BookingModal';
import { API_BASE_URL } from '../config';
import { formatPriceForCountry } from '../utils/currencyUtil';

// Calculate simulated route between stay coordinates and destinations
const generateMockRoute = (startCoords, destinationName, mode) => {
    const [startLat, startLng] = startCoords;
    let endLat, endLng;
    
    const destLower = destinationName.toLowerCase();
    
    if (destLower.includes('station') || destLower.includes('terminal')) {
        endLat = startLat - 0.012;
        endLng = startLng + 0.015;
    } else if (destLower.includes('airport')) {
        endLat = startLat + 0.045;
        endLng = startLng - 0.035;
    } else if (destLower.includes('city') || destLower.includes('center') || destLower.includes('town')) {
        endLat = startLat + 0.008;
        endLng = startLng - 0.02;
    } else if (destLower.includes('beach') || destLower.includes('attraction') || destLower.includes('park')) {
        endLat = startLat - 0.008;
        endLng = startLng + 0.018;
    } else {
        // Generate pseudo-random coordinate offsets based on destination name string hash
        let hash = 0;
        for (let i = 0; i < destinationName.length; i++) {
            hash = destinationName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const offsetLat = ((hash % 100) / 1000) * 0.4;
        const offsetLng = (((hash >> 8) % 100) / 1000) * 0.4;
        endLat = startLat + (offsetLat === 0 ? 0.015 : offsetLat);
        endLng = startLng + (offsetLng === 0 ? -0.015 : offsetLng);
    }

    // Generate zig-zag path coordinates to emulate real roads
    const polyline = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        let pLat = startLat + (endLat - startLat) * ratio;
        let pLng = startLng + (endLng - startLng) * ratio;
        
        if (i > 0 && i < steps) {
            if (i % 3 === 1) {
                pLat += (endLat - startLat) * 0.12;
            } else if (i % 3 === 2) {
                pLng += (endLng - startLng) * 0.12;
            }
        }
        polyline.push([pLat, pLng]);
    }

    // Haversine formula for distance, with road deviation multiplier
    const R = 6371; 
    const dLat = (endLat - startLat) * Math.PI / 180;
    const dLng = (endLng - startLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(startLat * Math.PI / 180) * Math.cos(endLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const directDist = R * c;
    const distance = Math.max(0.4, parseFloat((directDist * 1.35).toFixed(1)));

    // Speed constants by travel mode (km/h)
    let speed = 40; // driving
    if (mode === 'walking') speed = 5;
    else if (mode === 'cycling') speed = 15;
    else if (mode === 'transit') speed = 25;

    const timeHours = distance / speed;
    const totalMinutes = Math.round(timeHours * 60);
    let durationStr = '';
    if (totalMinutes >= 60) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        durationStr = `${h} hr ${m} min`;
    } else {
        durationStr = `${totalMinutes} mins`;
    }

    const instructions = [];
    instructions.push({
        text: `Depart from stay onto Main Street`,
        distance: `${Math.round(distance * 80)} m`,
        type: 'depart'
    });

    if (mode === 'transit') {
        instructions.push({
            text: `Walk to the nearest Transit Station`,
            distance: '250 m',
            type: 'walk'
        });
        instructions.push({
            text: `Board local transit heading toward ${destinationName}`,
            distance: `${(distance * 0.85).toFixed(1)} km`,
            type: 'transit'
        });
        instructions.push({
            text: `De-board transit at ${destinationName} stop`,
            distance: '100 m',
            type: 'arrive'
        });
    } else {
        const turnDirection = Math.abs(Math.floor(startLng * 1000 + endLat * 1000)) % 2 === 0 ? 'left' : 'right';
        instructions.push({
            text: `Turn ${turnDirection} onto central expressway / city route`,
            distance: `${(distance * 0.35).toFixed(1)} km`,
            type: turnDirection
        });
        
        if (distance > 2) {
            instructions.push({
                text: `Keep straight and follow signs for ${destinationName}`,
                distance: `${(distance * 0.5).toFixed(1)} km`,
                type: 'straight'
            });
        }
        
        instructions.push({
            text: `Turn ${turnDirection === 'left' ? 'right' : 'left'} into the destination approach`,
            distance: '150 m',
            type: turnDirection === 'left' ? 'right' : 'left'
        });
    }

    instructions.push({
        text: `Arrive at ${destinationName}`,
        distance: '',
        type: 'arrive'
    });

    return {
        polyline,
        distance: `${distance} km`,
        duration: durationStr,
        instructions,
        endCoords: [endLat, endLng]
    };
};

const StayDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stay, setStay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nearbyPoints, setNearbyPoints] = useState([]);
    const [liveViewers, setLiveViewers] = useState(12);
    const [loading, setLoading] = useState(true);
    
    // Routing states
    const [selectedDest, setSelectedDest] = useState('Central Station');
    const [customDest, setCustomDest] = useState('');
    const [travelMode, setTravelMode] = useState('driving');
    const [routeData, setRouteData] = useState(null);

    // Mock data (Old Hotels) - Must match Stays.jsx
    const mockStays = [
        {
            id: "mock-1",
            name: "The Royal Paradise",
            city: "Bali, Indonesia",
            location: "Bali, Indonesia", // Ensure compatibility
            price: formatPriceForCountry(10000, "Indonesia"),
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
            price: formatPriceForCountry(21000, "Maldives"),
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
            price: formatPriceForCountry(15000, "Switzerland"),
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
                    const response = await fetch(`${API_BASE_URL}/hotels/${id}`);
                    if (response.ok) {
                        const json = await response.json();
                        const apiStay = json.data;

                        if (apiStay) {
                            const hasValidPhoto = apiStay.photos && apiStay.photos.length > 0 &&
                                !apiStay.photos[0].includes('share.google') &&
                                (apiStay.photos[0].startsWith('http') || apiStay.photos[0].startsWith('/'));

                            foundStay = {
                                ...apiStay,
                                id: apiStay._id,
                                location: apiStay.city || apiStay.address, // Ensure location string
                                price: formatPriceForCountry(apiStay.price || (Math.floor(Math.random() * 5000) + 3000), apiStay.city || apiStay.address),
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
        if (stay && stay.coordinates && (stay.coordinates[0] !== 0 || stay.coordinates[1] !== 0)) {
            const destinationName = customDest.trim() !== '' ? customDest : selectedDest;
            if (destinationName) {
                const route = generateMockRoute(stay.coordinates, destinationName, travelMode);
                setRouteData(route);
                
                // Set the markers to show the stay and the target destination
                setNearbyPoints([
                    { title: stay.name, position: stay.coordinates, description: "Your stay location" },
                    { title: destinationName, position: route.endCoords, description: `Destination: ${destinationName}` }
                ]);
            }
        }
    }, [stay, selectedDest, customDest, travelMode]);

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
        return <div className="min-h-screen bg-dark pt-24 text-white text-center">Stay not found</div>;
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
                            {stay.description || "Experience a wonderful time at this stay. Enjoy top-notch amenities and a relaxing atmosphere."}
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
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        alert('Please login to continue booking.');
                                        navigate('/login');
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1"
                            >
                                Book This Stay
                            </button>
                        </div>

                        {/* Map & Directions Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <MapIcon className="text-primary mr-2" size={24} />
                                    <h3 className="text-xl font-bold text-white">Location & Directions</h3>
                                </div>
                                <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                                    Interactive Routing
                                </span>
                            </div>
                            
                            <p className="text-gray-400 mb-6 text-sm">
                                Find route directions, travel times, and distances between your stay and transit stations or custom destinations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Preset Destination Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Preset Destination</label>
                                    <select
                                        value={selectedDest}
                                        onChange={(e) => {
                                            setSelectedDest(e.target.value);
                                            setCustomDest(''); // Clear custom input when preset is selected
                                        }}
                                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                    >
                                        <option value="Central Station">Central Train Station</option>
                                        <option value="International Airport">International Airport</option>
                                        <option value="City Center">City Center</option>
                                        <option value="Nearby Beach">Nearby Beach / Attraction</option>
                                    </select>
                                </div>

                                {/* Custom Destination Search */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or Search Custom Destination</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={customDest}
                                            onChange={(e) => setCustomDest(e.target.value)}
                                            placeholder="Type any place (e.g. Metro Station, Station)..."
                                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                        />
                                        <Compass className="absolute right-3 top-3.5 text-gray-500" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Mode Selector */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Travel Mode</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { mode: 'driving', label: 'Driving', icon: <Car size={16} /> },
                                        { mode: 'transit', label: 'Transit', icon: <Train size={16} /> },
                                        { mode: 'cycling', label: 'Cycling', icon: <Bike size={16} /> },
                                        { mode: 'walking', label: 'Walking', icon: <Footprints size={16} /> }
                                    ].map((t) => (
                                        <button
                                            key={t.mode}
                                            onClick={() => setTravelMode(t.mode)}
                                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                                                travelMode === t.mode
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {t.icon}
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="relative mb-6 z-0">
                                <MapComponent
                                    center={stay.coordinates}
                                    markers={nearbyPoints}
                                    polyline={routeData?.polyline}
                                    height="350px"
                                />
                            </div>

                            {/* Route Details Panel */}
                            {routeData && (
                                <div className="bg-dark/50 border border-white/10 rounded-2xl p-5 shadow-inner">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                                        <div>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Route Summary</span>
                                            <h4 className="text-lg font-bold text-white">
                                                From {stay.name} to {customDest ? customDest : selectedDest}
                                            </h4>
                                        </div>
                                        {/* Distance & Time Badge */}
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-pink-600 px-4 py-2 rounded-xl text-white font-bold shadow-lg shadow-primary/20">
                                            <Navigation size={18} className="animate-pulse flex-shrink-0" />
                                            <div>
                                                <div className="text-[10px] text-white/80 font-normal leading-none mb-0.5">EST. TRAVEL</div>
                                                <div className="text-sm leading-none whitespace-nowrap">{routeData.duration} ({routeData.distance})</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Directions Instructions Timeline */}
                                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {routeData.instructions.map((step, idx) => {
                                            // Select icon based on step type
                                            let StepIcon = ArrowUp;
                                            if (step.type === 'depart') StepIcon = Navigation;
                                            else if (step.type === 'arrive') StepIcon = CheckCircle2;
                                            else if (step.type === 'left') StepIcon = CornerUpLeft;
                                            else if (step.type === 'right') StepIcon = CornerUpRight;
                                            else if (step.type === 'walk') StepIcon = Footprints;
                                            else if (step.type === 'transit') StepIcon = Train;

                                            return (
                                                <div key={idx} className="flex gap-4 group/step">
                                                    <div className="flex flex-col items-center flex-shrink-0">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-sm transition-colors ${
                                                            step.type === 'arrive' 
                                                                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                                                : 'bg-white/5 border-white/10 text-primary group-hover/step:bg-primary/20'
                                                        }`}>
                                                            <StepIcon size={16} />
                                                        </div>
                                                        {idx < routeData.instructions.length - 1 && (
                                                            <div className="w-[2px] h-full bg-white/10 my-1 min-h-[20px]"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 py-1 flex justify-between items-start gap-4">
                                                        <p className="text-sm text-gray-300 group-hover/step:text-white transition-colors">
                                                            {step.text}
                                                        </p>
                                                        {step.distance && (
                                                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                                {step.distance}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={stay}
                type="hotel"
            />
        </div>
    );
};

export default StayDetails;
