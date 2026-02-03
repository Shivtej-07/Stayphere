import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Calendar, Clock } from 'lucide-react';

const AddTransport = ({ setMessage, onSuccess }) => {
    const [transportData, setTransportData] = useState({
        type: 'flight', company: '', from: '', to: '',
        departureTime: '', arrivalTime: '', price: 0, seatsAvailable: 0,
        photos: '' // Comma separated
    });

    const handleTransportChange = (e) => setTransportData({ ...transportData, [e.target.name]: e.target.value });

    const submitTransport = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                ...transportData,
                photos: transportData.photos ? transportData.photos.split(',').map(p => p.trim()) : []
            };
            await axios.post('http://localhost:5000/api/transports', payload, config);
            setMessage('Transport added successfully!');
            setTransportData({ type: 'flight', company: '', from: '', to: '', departureTime: '', arrivalTime: '', price: 0, seatsAvailable: 0, photos: '' });
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage('Error adding transport: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <form onSubmit={submitTransport} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Add New Transport</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type & Company */}
                <div className="space-y-4">
                    <select
                        name="type"
                        value={transportData.type}
                        onChange={handleTransportChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                        <option value="flight" className="bg-slate-800">Flight</option>
                        <option value="train" className="bg-slate-800">Train</option>
                        <option value="bus" className="bg-slate-800">Bus</option>
                        <option value="car" className="bg-slate-800">Car</option>
                    </select>
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="company" placeholder="Company / Provider" value={transportData.company} onChange={handleTransportChange} required />
                </div>

                {/* Route */}
                <div className="space-y-4">
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="from" placeholder="From (City/Location)" value={transportData.from} onChange={handleTransportChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="to" placeholder="To (City/Location)" value={transportData.to} onChange={handleTransportChange} required />
                </div>

                {/* Timings */}
                <div className="space-y-4">
                    <div className="relative">
                        <span className="text-xs text-gray-400 absolute left-3 top-[-8px] bg-[#0f172a] px-1">Departure</span>
                        <input type="datetime-local" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors [color-scheme:dark]" name="departureTime" value={transportData.departureTime} onChange={handleTransportChange} required />
                    </div>
                    <div className="relative">
                        <span className="text-xs text-gray-400 absolute left-3 top-[-8px] bg-[#0f172a] px-1">Arrival</span>
                        <input type="datetime-local" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors [color-scheme:dark]" name="arrivalTime" value={transportData.arrivalTime} onChange={handleTransportChange} required />
                    </div>
                </div>

                {/* Price & Seats */}
                <div className="space-y-4">
                    <input type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="price" placeholder="Price ($)" value={transportData.price} onChange={handleTransportChange} required />
                    <input type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="seatsAvailable" placeholder="Available Seats" value={transportData.seatsAvailable} onChange={handleTransportChange} required />
                </div>
            </div>

            <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors" name="photos" placeholder="Photos (comma separated URLs)" value={transportData.photos} onChange={handleTransportChange} />

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                <Plus size={20} /> Add Transport
            </button>
        </form>
    );
};

export default AddTransport;
