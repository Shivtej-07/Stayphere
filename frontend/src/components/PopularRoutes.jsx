import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

const popularRoutes = [
    { from: 'New Delhi', to: 'Dehradun', price: 3500, image: 'https://images.unsplash.com/photo-1626079979737-23055480746e?auto=format&fit=crop&w=400&q=80' },
    { from: 'Mumbai', to: 'Goa', price: 2800, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
    { from: 'Chennai', to: 'Tirupati', price: 2500, image: 'https://images.unsplash.com/photo-1643196889416-2495b46e387c?auto=format&fit=crop&w=400&q=80' }
];

const PopularRoutes = ({ onSelectRoute }) => {
    return (
        <div className="py-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="mr-2 text-primary" />
                Popular Routes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularRoutes.map((route, index) => (
                    <div
                        key={index}
                        className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                        onClick={() => onSelectRoute(route.from, route.to)}
                    >
                        <img
                            src={route.image}
                            alt={`${route.from} to ${route.to}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <div className="text-sm font-medium text-gray-300 mb-1">Starting from <span className="text-white font-bold text-lg">${route.price}</span></div>
                            <div className="flex items-center space-x-2 font-bold text-lg">
                                <span>{route.from}</span>
                                <ArrowRight size={16} className="text-primary" />
                                <span>{route.to}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularRoutes;
