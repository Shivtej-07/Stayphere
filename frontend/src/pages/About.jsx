import React from 'react';
import { Shield, Globe, Users, Target, ArrowRight, Zap, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex items-center justify-center min-h-[70vh]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[130px] mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">Redefining Travel Experiences</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            Journey Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient-x">
              The Ordinary
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Stayphere is more than a booking platform. We're your gateway to extraordinary destinations, seamlessly connecting you with curated stays and effortless transport worldwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/stays" className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Exploring <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10 -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Happy Travelers', value: '50K+' },
              { label: 'Curated Stays', value: '10K+' },
              { label: 'Destinations', value: '120+' },
              { label: 'User Rating', value: '4.9/5' },
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors group">
                <div className="text-3xl md:text-5xl font-black text-white mb-2 group-hover:text-primary transition-colors">{stat.value}</div>
                <div className="text-sm md:text-base text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Values Section */}
      <section className="py-24 relative z-10 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-primary">Stayphere</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We've built our platform on a foundation of trust, innovation, and an unwavering commitment to exceptional travel experiences.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="text-green-400" size={32} />, title: 'Secure & Verified', desc: 'Every stay on our platform is rigorously vetted to ensure safety, quality, and peace of mind for our travelers.' },
              { icon: <Globe className="text-blue-400" size={32} />, title: 'Global Reach', desc: 'From hidden gems to iconic landmarks, access a world of curated properties across diverse destinations.' },
              { icon: <Zap className="text-amber-400" size={32} />, title: 'Seamless Booking', desc: 'Experience a frictionless journey from discovery to checkout with our state-of-the-art booking engine.' },
              { icon: <Heart className="text-pink-400" size={32} />, title: 'User-Centric Design', desc: 'Our intuitive interface ensures that finding your dream stay is as delightful as the journey itself.' },
              { icon: <Users className="text-purple-400" size={32} />, title: 'Community Driven', desc: 'Join a vibrant community of explorers sharing authentic reviews, tips, and unforgettable experiences.' },
              { icon: <Target className="text-primary" size={32} />, title: 'Personalized Journeys', desc: 'Tailored recommendations powered by smart algorithms to match your unique travel style and preferences.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 border-t border-white/10 pt-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden relative shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] border border-white/10">
                <img src="/src/assets/about-hero.jpg" alt="Our Story" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl mix-blend-screen"></div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Story</span></h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p>
                  Founded with a passion for connecting people to awe-inspiring places, Stayphere began with a simple idea: travel should be effortless, secure, and profoundly enriching.
                </p>
                <p>
                  We recognized a gap in the market for a platform that not only offered exceptional stays but also integrated seamless transportation options, providing an end-to-end journey solution. 
                </p>
                <p>
                  Today, we're proud to serve a global community of modern explorers, continuously innovating our technology to ensure every trip booked through Stayphere is a gateway to unforgettable memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-white/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to start your next adventure?</h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg relative z-10">Join thousands of travelers who have already discovered their perfect getaways. The world is waiting.</p>
            
            <Link to="/login" className="px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl shadow-white/10 relative z-10 inline-block">
              Create an Account Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default About;
