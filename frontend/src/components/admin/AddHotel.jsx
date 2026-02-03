import React, { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const AddHotel = ({ setMessage, onSuccess }) => {
    const [hotelData, setHotelData] = useState({
        name: '', type: '', city: '', address: '', distance: '',
        title: '', description: '', cheapestPrice: 0, featured: false,
        photos: '' // Comma separated
    });

    const handleHotelChange = (e) => setHotelData({ ...hotelData, [e.target.name]: e.target.value });

    const submitHotel = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                ...hotelData,
                photos: hotelData.photos ? hotelData.photos.split(',').map(p => p.trim()).filter(p => p !== '') : []
            };
            await axios.post('http://localhost:5000/api/hotels', payload, config);
            setMessage('Hotel added successfully!');
            setHotelData({ name: '', type: '', city: '', address: '', distance: '', title: '', description: '', cheapestPrice: 0, featured: false, photos: '' });
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage('Error adding hotel: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={submitHotel} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Add New Hotel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="name" placeholder="Hotel Name" value={hotelData.name} onChange={handleHotelChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="type" placeholder="Type (e.g., Resort, Villa)" value={hotelData.type} onChange={handleHotelChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="city" placeholder="City" value={hotelData.city} onChange={handleHotelChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="address" placeholder="Address" value={hotelData.address} onChange={handleHotelChange} required />
                </div>

                <div className="space-y-4">
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="distance" placeholder="Distance from center" value={hotelData.distance} onChange={handleHotelChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="title" placeholder="Promo Title" value={hotelData.title} onChange={handleHotelChange} required />
                    <input type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="cheapestPrice" placeholder="Base Price ($)" value={hotelData.cheapestPrice} onChange={handleHotelChange} required />
                    <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors" name="photos" placeholder="Photos (comma separated URLs)" value={hotelData.photos} onChange={handleHotelChange} />
                </div>
            </div>

            <textarea className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none" name="description" placeholder="Description" value={hotelData.description} onChange={handleHotelChange} required />

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                <input type="checkbox" id="featured" name="featured" checked={hotelData.featured} onChange={(e) => setHotelData({ ...hotelData, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-slate-700" />
                <label htmlFor="featured" className="text-gray-300 font-medium cursor-pointer">Mark as Featured</label>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                <Plus size={20} /> Add Hotel
            </button>
        </form>
    );
};

export default AddHotel;
