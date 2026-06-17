import React, { useState } from 'react';
import {
    LayoutDashboard,
    Hotel,
    Car,
    MapPin,
    Activity,
    Plus,
    X,
    Search,
    Bell,
    LogOut,
    Menu,
    Home as HomeIcon
} from 'lucide-react';
import AddHotel from '../components/admin/AddHotel';
import AddTransport from '../components/admin/AddTransport';
import AddDestination from '../components/admin/AddDestination';
import UserActivity from '../components/admin/UserActivity';
import ManageHotels from '../components/admin/ManageHotels';
import ManageTransports from '../components/admin/ManageTransports';
import ManageDestinations from '../components/admin/ManageDestinations';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('hotel');
    const [message, setMessage] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Clear message when switching tabs
    const handleTabClick = (tab) => {
        if (tab === activeTab && tab === 'activity') {
            setRefreshTrigger(prev => prev + 1);
        } else {
            setActiveTab(tab);
            setShowAddForm(false);
        }
        setMessage('');
    };

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        setShowAddForm(false);
    };

    const menuItems = [
        { id: 'hotel', label: 'Hotels', icon: Hotel },
        { id: 'transport', label: 'Transport', icon: Car },
        { id: 'destination', label: 'Destinations', icon: MapPin },
        { id: 'activity', label: 'User Activity', icon: Activity },
    ];

    return (
        <div className="flex h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-white/5 transition-all duration-300 flex flex-col z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AdminPanel
                        </h2>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"></div>
                    )}
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors mb-4 border border-dashed border-emerald-500/20"
                    >
                        <HomeIcon size={20} />
                        <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Back to Home</span>
                    </button>

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
                                <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
                {/* Header */}
                <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-white capitalize">
                            {activeTab} Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {activeTab !== 'activity' && (
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('Toggled add form. Current state:', !showAddForm);
                                    setShowAddForm(!showAddForm);
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95 ${showAddForm
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                                    }`}
                            >
                                {showAddForm ? <X size={18} /> : <Plus size={18} />}
                                <span>{showAddForm ? 'Cancel' : 'Add New'}</span>
                            </button>
                        )}
                        <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-2 border-white/10"></div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-0">
                        {/* Messages */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${message.includes('Error')
                                ? 'bg-red-500/10 border-red-500/20 text-red-200'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                                }`}>
                                <div className={`p-1 rounded-full ${message.includes('Error') ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                                    {message.includes('Error') ? <X size={14} /> : <Plus size={14} className="rotate-45" />}
                                </div>
                                <p className="text-sm font-medium pt-0.5">{message}</p>
                            </div>
                        )}

                        {/* Expandable Add Form Section */}
                        {showAddForm && activeTab !== 'activity' && (
                            <div className="mb-8 animate-fade-in-up">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
                                    {activeTab === 'hotel' && <AddHotel setMessage={setMessage} onSuccess={triggerRefresh} />}
                                    {activeTab === 'transport' && <AddTransport setMessage={setMessage} onSuccess={triggerRefresh} />}
                                    {activeTab === 'destination' && <AddDestination setMessage={setMessage} onSuccess={triggerRefresh} />}
                                </div>
                            </div>
                        )}

                        {/* Main Tab Content */}
                        <div className="space-y-6">
                            {/* Stats/Overview Cards could go here */}

                            {/* Management Tables */}
                            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[500px]">
                                {activeTab === 'hotel' && <ManageHotels setMessage={setMessage} refreshTrigger={refreshTrigger} />}
                                {activeTab === 'transport' && <ManageTransports setMessage={setMessage} refreshTrigger={refreshTrigger} />}
                                {activeTab === 'destination' && <ManageDestinations setMessage={setMessage} refreshTrigger={refreshTrigger} />}
                                {activeTab === 'activity' && <UserActivity setMessage={setMessage} refreshTrigger={refreshTrigger} />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
