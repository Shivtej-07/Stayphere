import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Camera, Save, Edit2, X, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { API_BASE_URL } from '../config';
import PageTransition from '../components/PageTransition';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatarUrl: '' // for URL input if they don't want to upload file
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setUser(data.user);
                    setFormData({
                        username: data.user.username || '',
                        email: data.user.email || '',
                        avatarUrl: data.user.avatar || ''
                    });
                    setAvatarPreview(data.user.avatar);
                } else {
                    setError(data.message || 'Failed to fetch profile');
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError('Connection error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setFormData({ ...formData, avatarUrl: '' }); // Clear URL if file selected
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
            data.append('username', formData.username);
            data.append('email', formData.email);
            
            if (avatarFile) {
                data.append('avatar', avatarFile);
            } else if (formData.avatarUrl && formData.avatarUrl !== user.avatar) {
                 data.append('avatarUrl', formData.avatarUrl);
            }

            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();

            if (res.ok) {
                setSuccess('Profile updated successfully!');
                setUser(result.user);
                
                // Update local storage so navbar updates
                localStorage.setItem('user', JSON.stringify(result.user));
                
                setIsEditing(false);
                setAvatarFile(null); // Clear file after successful upload
                // Update specific navbar event if you use custom events, otherwise relies on page reload or react context
                window.dispatchEvent(new Event('storage'));
            } else {
                setError(result.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            username: user.username || '',
            email: user.email || '',
            avatarUrl: user.avatar || ''
        });
        setAvatarPreview(user.avatar);
        setAvatarFile(null);
        setError('');
        setSuccess('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
         return (
             <div className="min-h-screen bg-dark pt-24 pb-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
                    <p className="text-gray-400">Please try logging in again.</p>
                </div>
            </div>
         );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-dark pt-28 pb-12 px-6">
                <div className="container mx-auto max-w-3xl">
                
                {/* Header Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-gray-400">Manage your account details and preferences</p>
                    </div>
                    
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="mt-4 md:mt-0 flex items-center space-x-2 bg-primary/20 hover:bg-primary/30 text-primary px-5 py-2.5 rounded-xl font-medium transition-all"
                        >
                            <Edit2 size={18} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl flex items-center">
                        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                        <p className="text-sm">{success}</p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm relative">
                    
                    {/* Cover Background */}
                    <div className="h-32 bg-gradient-to-r from-primary/40 to-secondary/40 relative">
                        <div className="absolute inset-0 bg-dark/20"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar Section */}
                        <div className="relative -mt-16 flex justify-between items-end mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl border-4 border-dark overflow-hidden bg-dark flex items-center justify-center shadow-lg relative">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt={user.username} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                setAvatarPreview(null);
                                            }}
                                        />
                                    ) : (
                                        <User size={48} className="text-gray-500" />
                                    )}
                                    
                                    {isEditing && (
                                        <div 
                                            onClick={triggerFileInput}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                                        >
                                            <Camera size={24} className="text-white mb-1" />
                                            <span className="text-xs text-white font-medium">Change Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            
                            {!isEditing && (
                                <div className="pb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isAdmin ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/10 text-gray-300'}`}>
                                        {user.isAdmin ? 'Administrator' : 'Explorer'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                                placeholder="Enter username"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 md:col-span-2">
                                         <label className="text-sm font-medium text-gray-400 ml-1">Avatar Image URL (Optional)</label>
                                         <p className="text-xs text-gray-500 ml-1 mb-2">Paste a URL to an image or click the profile picture above to upload a file.</p>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Camera size={18} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                name="avatarUrl"
                                                value={formData.avatarUrl}
                                                onChange={handleInputChange}
                                                disabled={!!avatarFile}
                                                className={`w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${avatarFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10 mt-8">
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        disabled={saving}
                                        className="px-6 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-70"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                                        <p className="text-lg font-medium text-white flex items-center">
                                            <User size={18} className="mr-3 text-gray-400" />
                                            {user.username}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                                        <p className="text-lg font-medium text-white flex items-center">
                                            <Mail size={18} className="mr-3 text-gray-400" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                     <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Account Created</h3>
                                        <p className="text-lg font-medium text-white flex items-center">
                                            <Navigation size={18} className="mr-3 text-gray-400" />
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    );
};

export default Profile;
