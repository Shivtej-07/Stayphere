import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const FavoriteButton = ({ itemId, onModel }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Fetch initial status on mount
    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                // Since there is no single item check endpoint, we fetch all and check if ID is present
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const found = data.some(fav => fav.item?._id === itemId || fav.item === itemId);
                    setIsFavorited(found);
                }
            } catch (error) {
                console.error('Error fetching favorites', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, [itemId, token]);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            alert('Please login to save to favorites.');
            return;
        }

        // Optimistic UI update
        setIsFavorited(!isFavorited);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemId, onModel })
            });

            if (!response.ok) {
                // Revert on failure
                setIsFavorited(isFavorited);
                console.error('Failed to toggle favorite');
            }
        } catch (error) {
            // Revert on error
            setIsFavorited(isFavorited);
            console.error('Error toggling favorite', error);
        }
    };

    if (isLoading && token) return null; // Or a tiny spinner

    return (
        <button
            onClick={handleToggle}
            className={`absolute top-4 right-4 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300 z-10 ${isAnimating ? 'scale-125' : 'scale-100'}`}
            aria-label="Add to favorites"
        >
            <Heart
                className={`w-5 h-5 transition-colors duration-300 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
        </button>
    );
};

export default FavoriteButton;
