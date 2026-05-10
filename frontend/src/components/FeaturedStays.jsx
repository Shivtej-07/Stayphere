import React, { useState, useRef } from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal';
import { API_BASE_URL } from '../config';
import { formatPriceForCountry } from '../utils/currencyUtil';

const TiltCard = ({ children, onClick }) => {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glow, setGlow] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        setRotation({ x: rotateX, y: rotateY });
        setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
            className="relative glass-card rounded-3xl overflow-hidden cursor-pointer group hover:z-10"
        >
            {/* Glow Effect */}
            <div
                className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.1), transparent 60%)`
                }}
            />
            {children}
        </div>
    );
};

const FeaturedStays = () => {
    const [selectedStay, setSelectedStay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [stays, setStays] = useState([]);

    React.useEffect(() => {
        const fetchFeaturedStays = async () => {
            try {
                // Fetch all hotels and take the first 3 (or filter by featured if API supported it)
                const response = await fetch(`${API_BASE_URL}/hotels`);
                if (!response.ok) throw new Error('Failed to fetch hotels');
                const json = await response.json();

                const featured = (json.data || []).slice(0, 3).map(stay => {
                    const hasValidPhoto = stay.photos && stay.photos.length > 0 &&
                        !stay.photos[0].includes('share.google') &&
                        (stay.photos[0].startsWith('http') || stay.photos[0].startsWith('/'));

                    return {
                        ...stay,
                        id: stay._id,
                        image: hasValidPhoto ? stay.photos[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                        price: formatPriceForCountry(stay.price || (Math.floor(Math.random() * 5000) + 3000), stay.city || stay.address),
                        rating: stay.rating || 4.8 // Fallback rating if not in DB
                    };
                });

                setStays(featured);
            } catch (err) {
                console.error("Error fetching featured stays:", err);
            }
        };

        fetchFeaturedStays();
    }, []);

    const handleBookClick = (stay) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue booking.');
            window.location.href = '/login';
            return;
        }
        setSelectedStay(stay);
        setIsModalOpen(true);
    };

    return (
        <>
            <section className="py-20 bg-dark text-white relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float-smooth"></div>
                    <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-float-smooth" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="absolute inset-0 bg-mesh-dark opacity-10 mix-blend-screen pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Featured Stays</h2>
                            <p className="text-gray-400 text-lg">Discover our most popular properties</p>
                        </div>
                        <button className="hidden md:flex items-center justify-center space-x-2 text-primary hover:text-white transition-colors group">
                            <span>View All</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stays.map((stay, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={stay.id} 
                            >
                                <TiltCard onClick={() => handleBookClick(stay)}>
                                    <div className="h-64 overflow-hidden">
                                        <img
                                            src={stay.image}
                                            alt={stay.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{stay.name}</h3>
                                            <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                                                <Star size={12} className="mr-1 fill-yellow-400" />
                                                {stay.rating}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-400 mb-4 text-sm">
                                            <MapPin size={14} className="mr-1.5" />
                                            <span>{stay.city}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div>
                                                <span className="text-xl font-bold text-white">{stay.price}</span>
                                                <span className="text-gray-500 text-xs"> / night</span>
                                            </div>
                                            <button className="px-4 py-2 bg-white/10 hover:bg-primary text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary/25">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <button className="flex items-center justify-center space-x-2 mx-auto text-primary hover:text-white transition-colors">
                            <span>View All</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    property={selectedStay}
                    type="hotel"
                />
            )}
        </>
    );
};

export default FeaturedStays;
