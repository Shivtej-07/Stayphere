import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MapPin, DollarSign, Building, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ManageHotels = ({ setMessage, refreshTrigger }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/hotels`);
            setHotels(res.data.data || []);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            setMessage('Error fetching hotels: ' + (error.response?.data?.message || error.message));
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/hotels/${id}`, config);
                setMessage('Hotel deleted successfully');
                fetchHotels();
            } catch (error) {
                setMessage('Error deleting hotel: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div className="p-1">
            <div className="flex items-center justify-between mb-6 px-4 pt-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building className="text-blue-500" size={24} />
                    Manage Hotels <span className="text-sm font-normal text-gray-500 ml-2">({hotels.length} total)</span>
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-white/5">
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">City</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {hotels.length > 0 ? (
                                hotels.map(hotel => (
                                    <tr key={hotel._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">{hotel.name}</td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-gray-500" />
                                                {hotel.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {hotel.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-green-500" />
                                                {hotel.cheapestPrice}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(hotel._id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                                title="Delete Hotel"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                        No hotels found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageHotels;
