import React, { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const AddDestination = ({ setMessage, onSuccess }) => {
    const [destinationData, setDestinationData] = useState({
        name: '', description: '', featured: false,
        photos: '' // Comma separated
    });

    const handleDestinationChange = (e) => setDestinationData({ ...destinationData, [e.target.name]: e.target.value });

    const submitDestination = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting destination:', { ...destinationData });
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                ...destinationData,
                photos: destinationData.photos ? destinationData.photos.split(',').map(p => p.trim()).filter(p => p !== '') : []
            };

            console.log('Payload:', payload);
            const res = await axios.post('http://localhost:5000/api/destinations', payload, config);
            console.log('Response:', res.data);

            setMessage('Destination added successfully!');
            setDestinationData({ name: '', description: '', featured: false, photos: '' });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Add Destination Error:', error);
            setMessage('Error adding destination: ' + (error.response?.data?.message || error.message));

            if (error.response?.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            }
        }
    };

    return (
        <form onSubmit={submitDestination} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Add New Destination</h2>

            <div className="space-y-4">
                <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors" name="name" placeholder="Destination Name" value={destinationData.name} onChange={handleDestinationChange} required />
                <textarea className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors h-32 resize-none" name="description" placeholder="Description" value={destinationData.description} onChange={handleDestinationChange} required />
                <input className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors" name="photos" placeholder="Photos (comma separated URLs)" value={destinationData.photos} onChange={handleDestinationChange} />
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                <input type="checkbox" id="dest-featured" name="featured" checked={destinationData.featured} onChange={(e) => setDestinationData({ ...destinationData, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500 bg-slate-700" />
                <label htmlFor="dest-featured" className="text-gray-300 font-medium cursor-pointer">Mark as Featured</label>
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2">
                <Plus size={20} /> Add Destination
            </button>
        </form>
    );
};

export default AddDestination;
