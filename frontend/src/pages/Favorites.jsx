import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState({
        Destination: [],
        Hotel: [],
        Transport: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Group by type
                    const grouped = {
                        Destination: [],
                        Hotel: [],
                        Transport: []
                    };

                    data.forEach(fav => {
                        if (grouped[fav.onModel] && fav.item) {
                            grouped[fav.onModel].push(fav.item);
                        }
                    });

                    setFavorites(grouped);
                } else {
                    console.error('Failed to fetch favorites');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [navigate]);

    const handleItemClick = (item, type) => {
        if (type === 'Destination') navigate(`/destinations/${item._id}`);
        if (type === 'Hotel') navigate(`/stays/${item._id}`);
        // Transports don't have a standalone details page in the current routing
    };

    const EmptyState = () => (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 mt-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">Start exploring and save your favorite places and rides!</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/destinations')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Explore Destinations
                </button>
            </div>
        </div>
    );

    const renderItems = (items, type) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">{type}s</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div
                            key={item._id}
                            onClick={() => handleItemClick(item, type)}
                            className="bg-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300 border border-white/5 hover:border-primary/50 shadow-lg"
                        >
                            <div className="relative h-48">
                                <img
                                    src={(item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
                                    alt={item.name || item.company}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md">
                                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-lg font-bold text-white mb-1">{item.name || item.company}</h4>
                                <p className="text-sm text-gray-400">{item.city || item.country || `${item.from} to ${item.to}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-28 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalFavorites = favorites.Destination.length + favorites.Hotel.length + favorites.Transport.length;

    return (
        <div className="min-h-screen bg-dark pt-28 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex items-center space-x-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
                </div>

                {totalFavorites === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="flex gap-4 mb-8">
                            {['All', 'Destinations', 'Hotels', 'Transports'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === tab
                                            ? 'bg-primary text-white'
                                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {(activeTab === 'All' || activeTab === 'Destinations') && renderItems(favorites.Destination, 'Destination')}
                        {(activeTab === 'All' || activeTab === 'Hotels') && renderItems(favorites.Hotel, 'Hotel')}
                        {(activeTab === 'All' || activeTab === 'Transports') && renderItems(favorites.Transport, 'Transport')}
                    </>
                )}
            </div>
        </div>
    );
};

export default Favorites;
