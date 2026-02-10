import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Calendar, Users, Star, Share2, Heart, Grid, X } from 'lucide-react';
import { API_BASE_URL } from '../config';
import BookingModal from '../components/BookingModal'; // Assuming BookingModal is in components

const DestinationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // For image lightbox/explorer
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch destination details');
                }
                const data = await response.json();

                // Enhance data with mock pricing/viewers if not present, similar to Destinations.jsx
                const enhancedData = {
                    ...data,
                    price: data.price || `₹${Math.floor(Math.random() * 5000) + 3000}`,
                    rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
                    reviews: Math.floor(Math.random() * 500) + 50,
                    locationName: data.name.includes(',') ? data.name.split(',')[0].trim() : data.name,
                    country: data.name.includes(',') ? data.name.split(',')[1].trim() : "India",
                };

                setDestination(enhancedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDestination();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !destination) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary rounded-full hover:bg-primary/80 transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
                <img
                    src={destination.photos?.[0] || "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1920&q=80"}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>

                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 bg-black/30 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-sm md:text-base text-primary font-medium tracking-wider uppercase">
                                    <MapPin size={16} />
                                    {destination.country}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2 drop-shadow-lg">
                                    {destination.locationName}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        {destination.rating} ({destination.reviews} reviews)
                                    </span>
                                    <span>•</span>
                                    <span>{destination.featured ? 'Featured Destination' : 'Popular Choice'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10">
                                    <Share2 size={20} />
                                </button>
                                <button className="p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10">
                                    <Heart size={20} />
                                </button>
                                <button
                                    onClick={() => setIsBookingModalOpen(true)}
                                    className="px-8 py-3 md:py-4 bg-primary text-white font-bold rounded-full uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                                >
                                    Book This Trip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                About {destination.locationName}
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {destination.description}
                            </p>
                        </section>

                        {/* Image Explorer / Gallery */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Grid size={24} />
                                Explore Gallery
                            </h2>
                            {destination.photos && destination.photos.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] md:h-[600px] auto-rows-[minmax(0,_1fr)]">
                                    {/* First image is large */}
                                    <div
                                        className="col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer group relative"
                                        onClick={() => setSelectedImage(destination.photos[0])}
                                    >
                                        <img
                                            src={destination.photos[0]}
                                            alt="Gallery 1"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>

                                    {/* Other images */}
                                    {destination.photos.slice(1, 4).map((photo, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl overflow-hidden cursor-pointer group relative h-full"
                                            onClick={() => setSelectedImage(photo)}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Gallery ${index + 2}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    ))}

                                    {/* View more overlay if more than 4 images */}
                                    {destination.photos.length > 4 && (
                                        <div
                                            className="rounded-2xl overflow-hidden cursor-pointer group relative h-full"
                                            onClick={() => setSelectedImage(destination.photos[4])}
                                        >
                                            <img
                                                src={destination.photos[4]}
                                                alt="Gallery 5"
                                                className="w-full h-full object-cover blur-sm opacity-50 transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-xl">
                                                +{destination.photos.length - 4} More
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 text-gray-400">
                                    No images available for this destination.
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Starting from</p>
                                        <div className="text-3xl font-bold text-white">
                                            {destination.price}
                                            <span className="text-base font-normal text-gray-400"> / person</span>
                                        </div>
                                    </div>
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Available
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBookingModalOpen(true)}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 mb-4"
                                >
                                    Book Now
                                </button>

                                <p className="text-xs text-center text-gray-500">
                                    Fast & Secure booking powered by Stripe & UPI
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <h3 className="font-bold mb-4">Why Book With Us?</h3>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex gap-3">
                                        <span className="bg-white/10 p-1 rounded-full text-primary">✓</span>
                                        Best Price Guarantee
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="bg-white/10 p-1 rounded-full text-primary">✓</span>
                                        Verified Local Guides
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="bg-white/10 p-1 rounded-full text-primary">✓</span>
                                        24/7 Customer Support
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full View"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    />

                    {/* Simple navigation - could be enhanced */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full p-2">
                        {destination.photos.map((photo, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(photo)}
                                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === photo ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img src={photo} alt="Thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {isBookingModalOpen && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    property={{
                        name: `Trip to ${destination.locationName}`,
                        price: destination.price,
                        image: destination.photos?.[0],
                        location: destination.locationName,
                        from: destination.locationName // fallback for transport logic if reused
                    }}
                />
            )}
        </div>
    );
};

export default DestinationDetails;
