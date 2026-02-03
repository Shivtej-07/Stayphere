import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Calendar, DollarSign, Car, Loader2, ArrowRight } from 'lucide-react';

const ManageTransports = ({ setMessage, refreshTrigger }) => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransports = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/transports');
            setTransports(res.data || []);
        } catch (error) {
            console.error('Error fetching transports:', error);
            setMessage('Error fetching transports: ' + (error.response?.data?.message || error.message));
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransports();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transport?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/transports/${id}`, config);
                setMessage('Transport deleted successfully');
                fetchTransports();
            } catch (error) {
                setMessage('Error deleting transport: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="p-1">
            <div className="flex items-center justify-between mb-6 px-4 pt-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Car className="text-purple-500" size={24} />
                    Manage Transport <span className="text-sm font-normal text-gray-500 ml-2">({transports.length} total)</span>
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-white/5">
                                <th className="px-6 py-4 font-semibold">Company</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Route</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transports.length > 0 ? (
                                transports.map(item => (
                                    <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">{item.company}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-gray-400">{item.from}</span>
                                                <ArrowRight size={12} className="text-gray-600" />
                                                <span className="text-white">{item.to}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-500" />
                                                {new Date(item.departureTime).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-green-500" />
                                                {item.price}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">
                                        No transport options found.
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

export default ManageTransports;
