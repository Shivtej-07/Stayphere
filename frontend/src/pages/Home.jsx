import React from 'react';
import Hero from '../components/Hero';
import FeaturedStays from '../components/FeaturedStays';
import Destinations from '../components/Destinations';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
    return (
        <div className="bg-dark min-h-screen selection:bg-primary selection:text-white">
            <Hero />

            {/* Main Content Sections */}
            <div className="space-y-0 relative z-10">
                <Destinations />
                <FeaturedStays />
                <WhyChooseUs />
                <Testimonials />
                <Newsletter />
            </div>
        </div>
    );
};

export default Home;
