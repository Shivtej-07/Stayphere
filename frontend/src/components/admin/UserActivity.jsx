import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Users, Calendar, Shield, ShieldCheck, Mail, Loader2, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const UserActivity = ({ setMessage, refreshTrigger }) => {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserActivity = async () => {
        console.log('UserActivity: Starting fetch...');
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            console.log('UserActivity: Token found?', !!token);

            if (!token) {
                setMessage('No authentication token found. Please login.');
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            console.log('UserActivity: Fetching users...');
            const usersRes = await axios.get(`${API_BASE_URL}/auth/users`, config);
            console.log('UserActivity: Users fetched:', usersRes.data.length);
            setUsers(usersRes.data);

            console.log('UserActivity: Fetching bookings...');
            const bookingsRes = await axios.get(`${API_BASE_URL}/bookings`, config);
            console.log('UserActivity: Bookings fetched:', bookingsRes.data.length);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('UserActivity: Error fetching activity:', error);
            const errMsg = error.response?.data?.message || error.message;
            setMessage('Error fetching activity: ' + errMsg);

            if (error.response?.status === 401) {
                setMessage('Session expired or unauthorized. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user'); // Optional: Clear user data if stored
                // setTimeout(() => window.location.href = '/login', 2000); // Optional: Auto redirect
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserActivity();
    }, [refreshTrigger]);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/auth/users/${id}`, config);
                fetchUserActivity(); // Refresh list
                setMessage('User deleted successfully');
            } catch (error) {
                setMessage('Error deleting user: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/bookings/${id}`, config);
                fetchUserActivity(); // Refresh list
                setMessage('Booking deleted successfully');
            } catch (error) {
                setMessage('Error deleting booking: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="p-1 space-y-8">
            <div className="flex items-center justify-between px-4 pt-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="text-emerald-500" size={24} />
                    User Activity
                </h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                </div>
            ) : (
                <>
                    {/* Users Section */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Users size={18} className="text-blue-400" /> Registered Users <span className="text-xs font-normal text-gray-500 bg-black/20 px-2 py-0.5 rounded-full">{users.length}</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-white/5">
                                        <th className="px-6 py-4 font-semibold">Username</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Joined</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold uppercase">
                                                    {user.username.charAt(0)}
                                                </div>
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                <div className="flex items-center gap-1.5 opacity-80">
                                                    <Mail size={14} />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isAdmin ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                        <ShieldCheck size={12} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                        <Shield size={12} /> User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {!user.isAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bookings Section */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <CreditCard size={18} className="text-green-400" /> Recent Bookings <span className="text-xs font-normal text-gray-500 bg-black/20 px-2 py-0.5 rounded-full">{bookings.length}</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-white/5">
                                        <th className="px-6 py-4 font-semibold">User</th>
                                        <th className="px-6 py-4 font-semibold">Item</th>
                                        <th className="px-6 py-4 font-semibold">Details</th>
                                        <th className="px-6 py-4 font-semibold">Price</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {booking.user?.username || <span className="text-gray-500 italic">Unknown</span>}
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                {booking.hotelName || 'Transport Booking'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-gray-500" />
                                                        <span>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Users size={12} className="text-gray-500" />
                                                        <span>{booking.guests || 1} Guests</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-green-400 font-medium">
                                                ${booking.price}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-80 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserActivity;
