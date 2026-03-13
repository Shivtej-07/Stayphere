import React from 'react';
import { ShieldCheck, Clock, Headphones, CreditCard } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Stays",
        description: "Every stay is handpicked and verified ensuring a high standard of comfort and safety.",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10"
    },
    {
        icon: CreditCard,
        title: "Best Price Guarantee",
        description: "We price match to ensure you get the best deal on your luxury accommodation.",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Our dedicated support team is available round the clock to assist you with any needs.",
        color: "text-purple-400",
        bg: "bg-purple-400/10"
    },
    {
        icon: Clock,
        title: "Instant Booking",
        description: "Secure your stay instantly without waiting for confirmations or playing email tag.",
        color: "text-orange-400",
        bg: "bg-orange-400/10"
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-dark relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-secondary font-medium tracking-wider text-sm bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">WHY CHOOSE US</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-6 leading-tight">
                            We Make Your Travel <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-500">Experience Seamless</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            We go the extra mile to make sure your journey is as perfect as the destination. From vetted properties to round-the-clock support, we've got you covered.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className={`p-3 rounded-lg ${feature.bg} ${feature.color}`}>
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <img
                                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                                alt="Luxury Hotel Lobby"
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>

                            {/* Floating Stats Card */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl animate-fade-in-up">
                                <div className="flex justify-between items-center text-white">
                                    <div>
                                        <div className="text-3xl font-bold">98%</div>
                                        <div className="text-xs text-gray-300 uppercase tracking-wider">Customer Satisfaction</div>
                                    </div>
                                    <div className="h-10 w-px bg-white/20"></div>
                                    <div>
                                        <div className="text-3xl font-bold">12k+</div>
                                        <div className="text-xs text-gray-300 uppercase tracking-wider">Trips Booked</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
