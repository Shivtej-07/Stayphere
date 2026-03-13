import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

const LiveNotifications = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const names = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Anna"];
    const locations = ["USA", "UK", "Canada", "Germany", "France", "Australia", "Japan"];
    const actions = ["just booked a stay in", "is viewing a stay in", "left a 5-star review for"];
    const places = ["Bali", "Maldives", "Swiss Alps", "New York", "Santorini", "Paris", "Tokyo"];

    useEffect(() => {
        const showNotification = () => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const randomPlace = places[Math.floor(Math.random() * places.length)];

            setNotification({
                text: `${randomName} from ${randomLocation} ${randomAction} ${randomPlace}`,
                time: "Just now"
            });
            setIsVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Initial delay
        const initialTimeout = setTimeout(showNotification, 5000);

        // Repeat every 20-40 seconds
        const interval = setInterval(() => {
            showNotification();
        }, Math.random() * 20000 + 20000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!isVisible || !notification) return null;

    return (
        <div className="fixed bottom-24 left-6 z-40 animate-fade-in-up">
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex items-center space-x-3 max-w-sm">
                <div className="bg-green-500/20 p-2 rounded-full">
                    <Bell size={16} className="text-green-400" />
                </div>
                <div>
                    <p className="text-white text-sm font-medium">{notification.text}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{notification.time}</p>
                </div>
            </div>
        </div>
    );
};

export default LiveNotifications;
