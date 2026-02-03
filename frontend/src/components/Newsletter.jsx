import React from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="py-20 relative px-6">
            <div className="container mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-indigo-600 shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 px-6 py-16 md:py-20 text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Unlock Exclusive Travel Deals</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join 50,000+ travelers. Get insider access to secret offers, destination guides, and luxury stay discounts delivered to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 px-6 py-4 rounded-full focus:outline-none focus:bg-white/20 transition-all font-medium"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Subscribe</span>
                                <Send size={18} />
                            </button>
                        </form>

                        <p className="text-blue-200 text-xs mt-6">
                            No spam, ever. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
