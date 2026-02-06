import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MapPin, Loader2, Image as ImageIcon, Star, Pencil, X, Save } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ManageDestinations = ({ setMessage, refreshTrigger }) => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/destinations`);
            setDestinations(res.data || []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            setMessage('Error fetching destinations: ' + (error.response?.data?.message || error.message));
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/destinations/${id}`, config);
                setMessage('Destination deleted successfully');
                fetchDestinations();
            } catch (error) {
                setMessage('Error deleting destination: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleEditClick = (destination) => {
        setEditingDestination({
            ...destination,
            photos: destination.photos ? destination.photos.join(', ') : ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...editingDestination,
                photos: typeof editingDestination.photos === 'string'
                    ? editingDestination.photos.split(',').map(p => p.trim()).filter(p => p !== '')
                    : editingDestination.photos
            };

            await axios.put(`${API_BASE_URL}/destinations/${editingDestination._id}`, payload, config);
            setMessage('Destination updated successfully');
            setEditingDestination(null);
            fetchDestinations();
        } catch (error) {
            setMessage('Error updating destination: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-1 relative">
            <div className="flex items-center justify-between mb-6 px-4 pt-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="text-pink-500" size={24} />
                    Manage Destinations <span className="text-sm font-normal text-gray-500 ml-2">({destinations.length} total)</span>
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-pink-500" size={32} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-white/5">
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Featured</th>
                                <th className="px-6 py-4 font-semibold">Photos</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {destinations.length > 0 ? (
                                destinations.map(item => (
                                    <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4">
                                            {item.featured ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                    <Star size={12} fill="currentColor" /> Featured
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-xs">Standard</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <ImageIcon size={14} className="text-gray-500" />
                                                {item.photos?.length || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                                    title="Edit Destination"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                        No destinations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingDestination && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white">Edit Destination</h3>
                            <button
                                onClick={() => setEditingDestination(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editingDestination.name}
                                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-pink-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={editingDestination.description}
                                    onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-pink-500 focus:outline-none transition-colors h-24 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Photos (Comma separated URLs)</label>
                                <input
                                    type="text"
                                    value={editingDestination.photos}
                                    onChange={(e) => setEditingDestination({ ...editingDestination, photos: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-pink-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                                <input
                                    type="checkbox"
                                    id="edit-featured"
                                    checked={editingDestination.featured}
                                    onChange={(e) => setEditingDestination({ ...editingDestination, featured: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500 bg-slate-700"
                                />
                                <label htmlFor="edit-featured" className="text-gray-300 font-medium cursor-pointer">Mark as Featured</label>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingDestination(null)}
                                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDestinations;
