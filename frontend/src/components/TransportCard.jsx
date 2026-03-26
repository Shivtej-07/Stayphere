import React from 'react';
import { Plane, Train, Bus, Car, ArrowRight, Clock, Wifi, Coffee, Battery } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { formatPriceForCountry } from '../utils/currencyUtil';

const TransportCard = ({ transport, onBook }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'flight': return <Plane className="w-5 h-5" />;
            case 'train': return <Train className="w-5 h-5" />;
            case 'bus': return <Bus className="w-5 h-5" />;
            case 'car': return <Car className="w-5 h-5" />;
            default: return <Plane className="w-5 h-5" />;
        }
    };

    const getTimelineIcon = (type) => {
        const baseClass = "w-4 h-4 text-slate-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
        switch (type) {
            case 'flight': return <Plane className={`${baseClass} rotate-90`} />;
            case 'train': return <Train className={baseClass} />;
            case 'bus': return <Bus className={baseClass} />;
            case 'car': return <Car className={baseClass} />;
            default: return <Plane className={`${baseClass} rotate-90`} />;
        }
    };

    const getDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const isLowStock = transport.seatsAvailable < 10;

    return (
        <div className="group relative bg-slate-800 rounded-3xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <FavoriteButton itemId={transport._id} onModel="Transport" />
            <div className="flex flex-col md:flex-row">
                {/* Left Section: Time & Route */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-2xl ${transport.type === 'flight' ? 'bg-blue-500/20 text-blue-400' :
                                transport.type === 'train' ? 'bg-orange-500/20 text-orange-400' :
                                    transport.type === 'bus' ? 'bg-green-500/20 text-green-400' :
                                        'bg-purple-500/20 text-purple-400'
                                }`}>
                                {getIcon(transport.type)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{transport.company}</h3>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{transport.type} • Economy</div>
                            </div>
                        </div>
                        {isLowStock && (
                            <span className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded-full animate-pulse border border-red-500/20">
                                Only {transport.seatsAvailable} seats left
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {new Date(transport.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-sm font-medium text-slate-400">{transport.from}</div>
                        </div>

                        <div className="flex-1 px-8 flex flex-col items-center">
                            <div className="text-xs text-slate-500 mb-2 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {getDuration(transport.departureTime, transport.arrivalTime)}
                            </div>
                            <div className="w-full h-[2px] bg-slate-700 relative flex items-center">
                                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                <div className="flex-1"></div>
                                {getTimelineIcon(transport.type)}
                                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            </div>
                            <div className="text-xs text-slate-500 mt-2">Direct</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {new Date(transport.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-sm font-medium text-slate-400">{transport.to}</div>
                        </div>
                    </div>

                    {/* Amenities (Simulated) */}
                    <div className="flex items-center space-x-4 text-slate-500">
                        <div className="flex items-center text-xs" title="Wifi Available">
                            <Wifi size={14} className="mr-1" /> Wifi
                        </div>
                        <div className="flex items-center text-xs" title="Meals Included">
                            <Coffee size={14} className="mr-1" /> Meal
                        </div>
                        <div className="flex items-center text-xs" title="Power Outlet">
                            <Battery size={14} className="mr-1" /> Power
                        </div>
                    </div>
                </div>

                {/* Vertical Divider (dashed) */}
                <div className="hidden md:block w-[1px] border-l border-dashed border-slate-600 relative my-4">
                    <div className="absolute -top-4 -left-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                </div>

                {/* Right Section: Price & Action */}
                <div className="bg-slate-800/50 p-6 md:w-48 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 border-white/5 relative z-10">
                    <div className="text-slate-400 text-sm mb-1">Price per person</div>
                    <div className="text-3xl font-bold text-white mb-4">{formatPriceForCountry(transport.price, transport.to.includes(',') ? transport.to.split(',')[1].trim() : transport.to)}</div>

                    <button
                        onClick={() => onBook(transport)}
                        className="w-full bg-white text-slate-900 hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 group shadow-lg"
                    >
                        <span>Select</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Decorative cutouts for mobile */}
                    <div className="md:hidden absolute top-0 -left-3 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
                    <div className="md:hidden absolute bottom-0 -left-3 translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default TransportCard;
