import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, ArrowRight, Home, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../config';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                                <span className="text-xl font-bold text-white">{booking.price}</span>
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm mb-4">
                                                <MapPin size={14} className="mr-1" />
                                                {booking.location}
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
                                            <button className="text-primary text-sm font-bold hover:underline flex items-center">
                                                View Details <ArrowRight size={16} className="ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
