import React, { useState } from 'react';
import { Search, Plane, Train, Bus, Car, MapPin, Calendar, User } from 'lucide-react';

const TransportSearch = ({ onSearch, availableLocations }) => {
    const [activeTab, setActiveTab] = useState('flight');
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: '',
        passengers: 1
    });

    const tabs = [
        { id: 'flight', label: 'Flights', icon: Plane },
        { id: 'train', label: 'Trains', icon: Train },
        { id: 'bus', label: 'Buses', icon: Bus },
        { id: 'car', label: 'Cabs', icon: Car },
    ];

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ ...searchParams, type: activeTab });
    };

    return (
        <div className="w-full max-w-5xl mx-auto -mt-24 relative z-20">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="from"
                            placeholder="From where?"
                            value={searchParams.from}
                            onChange={handleChange}
                            list="locations-list"
                            className="w-full h-14 pl-12 pr-4 bg-dark/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-dark/80 transition-all"
                        />
                        <label className="absolute -top-2.5 left-4 text-xs font-semibold bg-dark px-1 text-gray-400 group-focus-within:text-primary transition-colors">Origin</label>
                    </div>

                    <div className="hidden md:flex md:col-span-1 items-center justify-center">
                        <div className="w-8 h-[2px] bg-white/10"></div>
                    </div>

                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="to"
                            placeholder="To where?"
                            value={searchParams.to}
                            onChange={handleChange}
                            list="locations-list"
                            className="w-full h-14 pl-12 pr-4 bg-dark/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-dark/80 transition-all"
                        />
                        <label className="absolute -top-2.5 left-4 text-xs font-semibold bg-dark px-1 text-gray-400 group-focus-within:text-primary transition-colors">Destination</label>
                    </div>

                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="date"
                            name="date"
                            value={searchParams.date}
                            onChange={handleChange}
                            className="w-full h-14 pl-12 pr-4 bg-dark/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:bg-dark/80 transition-all"
                            style={{ colorScheme: 'dark' }}
                        />
                        <label className="absolute -top-2.5 left-4 text-xs font-semibold bg-dark px-1 text-gray-400 group-focus-within:text-primary transition-colors">Departure</label>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center space-x-2"
                        >
                            <Search size={20} />
                            <span>Search</span>
                        </button>
                    </div>
                </form>

                <datalist id="locations-list">
                    {availableLocations && availableLocations.map(loc => (
                        <option key={loc} value={loc} />
                    ))}
                </datalist>
            </div>
        </div>
    );
};

export default TransportSearch;
