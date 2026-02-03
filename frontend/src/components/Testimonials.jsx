import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Travel Blogger",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Stayphere completely transformed how I travel. The curated selection of hotels is unmatched, and the booking process was seamless. Highly recommend!"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Business Traveler",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "I travel frequently for work, and finding a reliable, high-quality stay is crucial. Stayphere has never let me down. The 24/7 support is a life saver."
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "Adventure Enthusiast",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        text: "Found some hidden gems through this platform that I wouldn't have found elsewhere. The user interface is beautiful and so easy to use."
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-dark relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary font-medium tracking-wider text-sm bg-primary/10 px-4 py-2 rounded-full border border-primary/20">TESTIMONIALS</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-4">What Our Travelers Say</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Don't just take our word for it. Hear from the community of travelers who have found their perfect stays with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={item.id} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                                <Quote size={40} className="text-primary/20 absolute top-6 right-6" />

                                <div className="flex items-center space-x-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={i < item.rating ? 16 : 16} className={`${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                                    ))}
                                </div>

                                <p className="text-gray-300 mb-8 italic leading-relaxed">"{item.text}"</p>

                                <div className="flex items-center mt-auto">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                                    <div className="ml-4">
                                        <h4 className="text-white font-bold">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
