import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, ArrowRight, Home, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { formatPriceForCountry } from '../utils/currencyUtil';
import MapComponent from '../components/MapComponent';
import L from 'leaflet';

const CITY_COORDINATES = {
    'new york': [40.7128, -74.0060],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'berlin': [52.5200, 13.4050],
    'manchester': [53.4808, -2.2426],
    'downtown': [48.8566, 2.3522],
    'airport': [49.0097, 2.5479],
    'los angeles': [34.0522, -118.2437],
    'sydney': [-33.8688, 151.2093],
    'mumbai': [19.0760, 72.8777],
    'delhi': [28.6139, 77.2090],
    'goa': [15.2993, 74.1240]
};

const getCoordinatesForCity = (city) => {
    if (!city) return [48.8566, 2.3522]; // Paris default fallback
    const clean = city.toLowerCase().trim();
    if (CITY_COORDINATES[clean]) {
        return CITY_COORDINATES[clean];
    }
    // Substring lookup fallback
    for (const key of Object.keys(CITY_COORDINATES)) {
        if (clean.includes(key) || key.includes(clean)) {
            return CITY_COORDINATES[key];
        }
    }
    // Deterministic fallback coordinates to prevent crashes
    let hash1 = 0;
    let hash2 = 0;
    for (let i = 0; i < city.length; i++) {
        hash1 = city.charCodeAt(i) + ((hash1 << 5) - hash1);
        hash2 = city.charCodeAt(i) + ((hash2 << 7) - hash2);
    }
    const lat = 20.0 + (Math.abs(hash1) % 30);
    const lng = 70.0 + (Math.abs(hash2) % 50);
    return [lat, lng];
};

const getLivePosition = (departure, arrival, originCoords, destCoords) => {
    const now = new Date();
    const start = new Date(departure);
    const end = new Date(arrival);
    
    if (now < start) {
        return { coords: originCoords, progress: 0, status: 'Scheduled' };
    }
    if (now > end) {
        return { coords: destCoords, progress: 100, status: 'Completed' };
    }
    
    const total = end - start;
    const elapsed = now - start;
    const fraction = elapsed / total;
    
    const lat = originCoords[0] + (destCoords[0] - originCoords[0]) * fraction;
    const lng = originCoords[1] + (destCoords[1] - originCoords[1]) * fraction;
    
    return {
        coords: [lat, lng],
        progress: Math.round(fraction * 100),
        status: 'In Transit'
    };
};

const createCustomIcon = (type) => {
    const color = '#ec4899'; // secondary color
    let html = '';
    
    if (type === 'flight') {
        html = `<div style="color: ${color}; transform: rotate(90deg); filter: drop-shadow(0 0 5px rgba(236,72,153,0.5));"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.8.1-2.4.8l-.2.2c-.4.4-.5 1.1-.2 1.6l4.6 4.6L3 18.1V19c0 .6.4 1 1 1h.9l4.2-4.1 4.6 4.6c.5.3 1.2.2 1.6-.2l.2-.2c.7-.6 1-1.5.8-2.4Z"/></svg></div>`;
    } else if (type === 'train') {
        html = `<div style="color: ${color}; filter: drop-shadow(0 0 5px rgba(236,72,153,0.5));"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/><path d="M18 21H6"/></svg></div>`;
    } else if (type === 'bus') {
        html = `<div style="color: ${color}; filter: drop-shadow(0 0 5px rgba(236,72,153,0.5));"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M4 14h16"/><path d="M4 18h16"/><circle cx="7.5" cy="20.5" r="1.5"/><circle cx="16.5" cy="20.5" r="1.5"/></svg></div>`;
    } else {
        html = `<div style="color: ${color}; filter: drop-shadow(0 0 5px rgba(236,72,153,0.5));"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
    }

    return L.divIcon({
        html: html,
        className: 'custom-live-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMapId, setExpandedMapId] = useState(null);

    useEffect(() => {
        // Fetch bookings from API
        // For now, we'll need to implement the fetch logic once authentication context is ready
        // Using sample data structure that matches our backend model
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (res.ok) {
                    setBookings(data);
                }
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? You will receive a full refund if applicable.")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                alert("Booking cancelled successfully!");
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
            } else {
                alert(data.error || "Failed to cancel booking");
            }
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
                        <p className="text-gray-400">Manage your upcoming and past trips</p>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <div className="bg-white/10 inline-flex p-4 rounded-full mb-4">
                            <Home size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                        <p className="text-gray-400 mb-6">Time to plan your next adventure!</p>
                        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                            Explore Stays
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64 h-48 md:h-auto relative">
                                        <img
                                            src={booking.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1064"}
                                            alt={booking.hotelName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                                            {booking.status}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{booking.hotelName}</h3>
                                                <span className="text-xl font-bold text-white">
                                                    {formatPriceForCountry(booking.price, booking.location ? (booking.location.includes(',') ? booking.location.split(',')[1].trim() : booking.location) : 'India')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <MapPin size={14} className="mr-1" />
                                                    {booking.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(booking.travelingFrom && booking.travelingFrom !== 'Not specified') && (
                                                        <div className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-400 border border-white/10">
                                                            From <strong>{booking.travelingFrom}</strong> via {booking.transportType || 'None'}
                                                        </div>
                                                    )}
                                                    {booking.seats && booking.seats.length > 0 && (
                                                        <div className="text-xs px-2.5 py-1 bg-primary/10 rounded-md text-primary border border-primary/20 font-bold">
                                                            Seats: {booking.seats.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <span className="text-xs text-gray-500 block mb-1">Check-in</span>
                                                    <div className="flex items-center text-sm text-white font-medium">
                                                        <Calendar size={14} className="mr-2 text-primary" />
                                                        {new Date(booking.checkIn).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <span className="text-xs text-gray-500 block mb-1">Check-out</span>
                                                    <div className="flex items-center text-sm text-white font-medium">
                                                        <Calendar size={14} className="mr-2 text-primary" />
                                                        {new Date(booking.checkOut).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                             <span className="text-xs text-gray-500">
                                                 Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                             </span>
                                             <div className="flex items-center space-x-4">
                                                 {booking.status === 'booked' && (
                                                     <button
                                                         onClick={() => handleCancel(booking._id)}
                                                         className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors"
                                                     >
                                                         Cancel Booking
                                                     </button>
                                                 )}
                                                 <button 
                                                     onClick={() => setExpandedMapId(expandedMapId === booking._id ? null : booking._id)}
                                                     className="text-primary hover:text-primary/80 text-sm font-bold flex items-center transition-all bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg"
                                                 >
                                                     {expandedMapId === booking._id ? 'Hide Map' : 
                                                      (booking.transportId && booking.transportId !== 'undefined' ? 'Track Live Route' : 'View Location Map')}
                                                 </button>
                                             </div>
                                         </div>
                                    </div>
                                </div>

                                {expandedMapId === booking._id && (
                                    <div className="border-t border-white/10 p-5 bg-black/40 animate-fade-in space-y-4">
                                        {(() => {
                                            const isTransport = booking.transportId && booking.transportId !== 'undefined';
                                            if (isTransport) {
                                                const originCoords = getCoordinatesForCity(booking.travelingFrom);
                                                const destCoords = getCoordinatesForCity(booking.location);
                                                const departureTime = booking.checkIn;
                                                const arrivalTime = booking.checkOut;
                                                const live = getLivePosition(departureTime, arrivalTime, originCoords, destCoords);
                                                
                                                const center = [
                                                    (originCoords[0] + destCoords[0]) / 2,
                                                    (originCoords[1] + destCoords[1]) / 2
                                                ];

                                                const markers = [
                                                    {
                                                        position: originCoords,
                                                        title: `Origin: ${booking.travelingFrom}`,
                                                        description: `Departure: ${new Date(departureTime).toLocaleString()}`
                                                    },
                                                    {
                                                        position: destCoords,
                                                        title: `Destination: ${booking.location}`,
                                                        description: `Arrival: ${new Date(arrivalTime).toLocaleString()}`
                                                    }
                                                ];

                                                if (live.status === 'In Transit') {
                                                    markers.push({
                                                        position: live.coords,
                                                        title: `${booking.hotelName} (In Transit)`,
                                                        description: `Progress: ${live.progress}% | Status: In Transit`,
                                                        customIcon: createCustomIcon(booking.transportType?.toLowerCase() || 'flight')
                                                    });
                                                } else if (live.status === 'Completed') {
                                                    markers.push({
                                                        position: destCoords,
                                                        title: `${booking.hotelName} (Completed)`,
                                                        description: `Status: Completed`,
                                                        customIcon: createCustomIcon(booking.transportType?.toLowerCase() || 'flight')
                                                    });
                                                } else {
                                                    markers.push({
                                                        position: originCoords,
                                                        title: `${booking.hotelName} (Scheduled)`,
                                                        description: `Status: Scheduled`,
                                                        customIcon: createCustomIcon(booking.transportType?.toLowerCase() || 'flight')
                                                    });
                                                }

                                                return (
                                                    <>
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                                                            <span className="text-gray-300 font-medium">
                                                                Route: <strong className="text-white">{booking.travelingFrom}</strong> to <strong className="text-white">{booking.location}</strong>
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                                                                live.status === 'In Transit' ? 'bg-primary/20 text-primary border border-primary/30 animate-pulse' :
                                                                live.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                            }`}>
                                                                {live.status} {live.status === 'In Transit' && `(${live.progress}%)`}
                                                            </span>
                                                        </div>
                                                        <MapComponent 
                                                            center={center} 
                                                            zoom={window.innerWidth < 768 ? 2 : 4} 
                                                            markers={markers} 
                                                            polyline={[originCoords, destCoords]}
                                                            height="320px" 
                                                        />
                                                    </>
                                                );
                                            } else {
                                                const coords = booking.coordinates ? [booking.coordinates[1], booking.coordinates[0]] : [48.8566, 2.3522];
                                                const markers = [
                                                    {
                                                        position: coords,
                                                        title: booking.hotelName,
                                                        description: booking.location
                                                    }
                                                ];

                                                return (
                                                    <>
                                                        <div className="text-xs text-gray-300 font-medium">
                                                            Hotel Location: <strong className="text-white">{booking.hotelName}</strong> ({booking.location})
                                                        </div>
                                                        <MapComponent 
                                                            center={coords} 
                                                            zoom={14} 
                                                            markers={markers} 
                                                            height="320px" 
                                                        />
                                                    </>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
