import React from 'react';
import PageTransition from '../components/PageTransition';
import Hero from '../components/Hero';
import FeaturedStays from '../components/FeaturedStays';
import Destinations from '../components/Destinations';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
    return (
        <PageTransition>
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
        </PageTransition>
    );
};

export default Home;
