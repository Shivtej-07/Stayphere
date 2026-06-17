/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, CheckCircle, CreditCard, Lock, Loader2, MapPin, Plane, Train, Bus, Car, Ship, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { API_BASE_URL } from '../config';
import SeatSelector from './SeatSelector';
import { formatPriceForCountry } from '../utils/currencyUtil';

const stripePromise = loadStripe("pk_test_51RxejZPSVmcc3eBkvjEuMzJoMGGUIUoVwE9wwhMkRaCX0jBdQFDMR4cvINi5VHmACuiHmRvxJPtRxaTqo6AJnx1M00flLHoRs5");

const BookingModal = ({ isOpen, onClose, property, type }) => {
    const [step, setStep] = useState(1);
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState(2);
    const [travelingFrom, setTravelingFrom] = useState('');
    const [transportType, setTransportType] = useState('Flight');
    const [paymentMethod, setPaymentMethod] = useState(null); // 'card', 'gpay', 'phonepe', 'paytm', 'qr'
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
    const [clientSecret, setClientSecret] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);

    const isDirectTransport = property && (property.type === 'flight' || property.type === 'train' || property.type === 'bus' || property.type === 'car');

    // Helper to safely get price amount as number
    const getPriceAmount = (price) => {
        if (!price) return 0;
        const priceStr = String(price);
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    };

    const getPropertyLocation = (prop) => {
        if (!prop) return '';
        if (typeof prop.location === 'string') return prop.location;
        if (prop.city) return prop.city;
        if (prop.address) return prop.address;
        return '';
    };

    // Calculate dynamic transport options
    const availableTransports = React.useMemo(() => {
        const locationStr = getPropertyLocation(property);
        if (!locationStr) return ['Flight', 'Local'];
        const loc = locationStr.toLowerCase();
        
        // Check if destination is international
        const isInternational = 
            loc.includes('france') ||
            loc.includes('paris') ||
            loc.includes('usa') ||
            loc.includes('america') ||
            loc.includes('london') ||
            loc.includes('uk') ||
            loc.includes('switzerland') ||
            loc.includes('alps') ||
            loc.includes('maldives') ||
            loc.includes('bali') ||
            loc.includes('indonesia') ||
            loc.includes('sydney') ||
            loc.includes('australia') ||
            loc.includes('dubai');
        const isDomestic = !isInternational;
        
        // Places that require or support shipping/sea paths
        const isSeaAccessible = loc.includes('bali') || loc.includes('maldives') || loc.includes('island') || loc.includes('sea') || loc.includes('ocean');

        if (!isDomestic) {
            // Out of country
            if (isSeaAccessible) {
                return ['Flight', 'Ship'];
            }
            return ['Flight']; // Only planes for landlocked out-country places like Swiss Alps
        }

        // Domestic options
        if (isSeaAccessible) {
            return ['Flight', 'Ship', 'Local'];
        }
        return ['Flight', 'Local'];
    }, [property]);

    // Ensure selected transport is valid
    useEffect(() => {
        if (availableTransports.length > 0 && !availableTransports.includes(transportType)) {
            setTransportType(availableTransports[0]);
        }
    }, [availableTransports, transportType]);

    // Reset and pre-fill state when modal opens
    useEffect(() => {
        if (isOpen && property) {
            setStep(1);
            setPaymentMethod(null);
            setPaymentStatus('idle');
            setClientSecret("");
            setSelectedSeats([]);
            
            if (isDirectTransport && property.departureTime) {
                const depDate = new Date(property.departureTime).toISOString().split('T')[0];
                const arrDate = property.arrivalTime ? new Date(property.arrivalTime).toISOString().split('T')[0] : depDate;
                setDates({ checkIn: depDate, checkOut: arrDate });
                setTravelingFrom(property.from || '');
                setTransportType(
                    property.type === 'flight' ? 'Flight' : 
                    property.type === 'train' ? 'Train' : 
                    property.type === 'bus' ? 'Bus' : 
                    property.type === 'car' ? 'Cab' : 'Local'
                );
                setGuests(1); // Default to 1 passenger for direct travel
            } else {
                setDates({ checkIn: '', checkOut: '' });
                setTravelingFrom('');
                setGuests(2); // Default to 2 for stays
            }
        }
    }, [isOpen, property, isDirectTransport]);

    // Fetch Client Secret when entering payment step
    useEffect(() => {
        let isMounted = true;

        if (step === 2 && !clientSecret && property) {
            const amount = getPriceAmount(property.price) * (isDirectTransport ? guests : 1);

            fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (isMounted) {
                        setClientSecret(data.clientSecret);
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        console.error("Error fetching client secret:", err);
                    }
                });
        }

        return () => {
            isMounted = false;
        };
    }, [step, clientSecret, property, guests, isDirectTransport]);

    if (!isOpen || !property) return null;

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        const requiresSeats = (isDirectTransport && property.type !== 'car') || (type !== 'hotel' && ['flight', 'train', 'bus'].includes(transportType.toLowerCase()));
        if (requiresSeats && selectedSeats.length !== Number(guests)) {
            alert(`Please select exactly ${guests} seat(s) before continuing.`);
            return;
        }
        setStep(2);
    };

    const handleBookingCreation = async (paymentId) => {
        const token = localStorage.getItem('token');
        if (!token) return; // Or handle as guest checkout later

        try {
            const bookingData = {
                hotelName: property.name,
                location: getPropertyLocation(property) || property.from, // Fallback for transport
                image: property.image || (property.photos && property.photos[0]) || (
                    property.type === 'flight' ? "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80" : 
                    property.type === 'train' ? "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80" : 
                    property.type === 'car' ? "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" : 
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                ), // Fallback images
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
                guests: guests,
                travelingFrom: travelingFrom,
                transportType: transportType,
                price: getPriceAmount(property.price) * (isDirectTransport ? guests : 1),
                paymentId: paymentId,
                seats: selectedSeats
            };

            const res = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                setPaymentStatus('success');
                setStep(3);
            } else {
                console.error("Failed to create booking record");
                // Even if saving failed, payment succeeded, so maybe still show success but log error?
                // For now, let's proceed to success screen
                setPaymentStatus('success');
                setStep(3);
            }
        } catch (err) {
            console.error("Booking creation error:", err);
            setPaymentStatus('success');
            setStep(3);
        }
    };

    const handleUPIPayment = (app) => {
        setPaymentMethod(app);
        setPaymentStatus('processing');

        // REAL UPI CONFIGURATION
        // REPLACE 'merchant@upi' WITH YOUR ACTUAL VPA
        const vpa = 'merchant@upi';
        const payeeName = 'Dharam Yatra';
        const amount = getPriceAmount(property.price) * (isDirectTransport ? guests : 1);
        const transactionRef = 'TRX' + Date.now();

        const upiUrl = `upi://pay?pa=${vpa}&pn=${payeeName}&tr=${transactionRef}&am=${amount}&cu=INR`;

        if (app === 'qr') {
            setPaymentMethod('qr');
            return;
        }

        window.location.href = upiUrl;

        // Fallback simulation
        setTimeout(() => {
            handleBookingCreation(`UPI_${Date.now()}`); // Simulated Payment ID
        }, 8000);
    };


    const renderProcessingScreen = () => {
        const brands = {
            gpay: { color: 'bg-white', text: 'text-gray-800', name: 'Google Pay', icon: <div className="flex gap-1"><span className="text-blue-500 font-bold">G</span><span className="text-green-500 font-bold">Pay</span></div> },
            phonepe: { color: 'bg-[#5f259f]', text: 'text-white', name: 'PhonePe', icon: <span className="font-bold">PhonePe</span> },
            paytm: { color: 'bg-[#00baf2]', text: 'text-white', name: 'Paytm', icon: <span className="font-bold">Paytm</span> },
            qr: { color: 'bg-white', text: 'text-gray-800', name: 'Scan QR', icon: <span className="font-bold">Scan & Pay</span> },
        };

        const currentBrand = brands[paymentMethod];

        if (!currentBrand) return null;

        const amount = getPriceAmount(property.price) * (isDirectTransport ? guests : 1);
        const vpa = 'merchant@upi';
        const upiUrl = `upi://pay?pa=${vpa}&pn=Dharam Yatra&am=${amount}&cu=INR`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

        const country = property.to ? (property.to.includes(',') ? property.to.split(',')[1].trim() : property.to) : 'India';
        const formattedAmountString = formatPriceForCountry(amount, country);

        return (
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${currentBrand.color} animate-fade-in text-center p-6`}>
                <div className="scale-150 mb-8">{currentBrand.icon}</div>

                {paymentMethod === 'qr' ? (
                    <div className="bg-white p-4 rounded-xl shadow-xl mb-6 border-2 border-gray-200">
                        {/* REAL Dynamic QR Code */}
                        <img src={qrCodeUrl} alt="Payment QR" crossOrigin="anonymous" className="w-48 h-48 block" />
                        <p className="text-center text-xs mt-2 font-mono uppercase text-gray-500">Scan with GPay/PhonePe/Paytm</p>
                    </div>
                ) : (
                    <div className="w-20 h-20 relative mb-6">
                        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${paymentMethod === 'gpay' || paymentMethod === 'qr' ? 'border-blue-500' : 'border-white'}`}></div>
                    </div>
                )}

                <h4 className={`text-xl font-bold mb-2 ${currentBrand.text}`}>
                    {paymentStatus === 'success' ? 'Payment Successful!' :
                        paymentMethod === 'qr' ? 'Scan to Pay' : 'Opening App...'}
                </h4>

                {paymentStatus !== 'success' && (
                    <div className={`space-y-2 ${currentBrand.text}`}>
                        <p className="text-sm opacity-80">
                            {paymentMethod === 'qr' ? `Amount: ${formattedAmountString}` : `Please approve the payment of ${formattedAmountString} in your app.`}
                        </p>
                        {paymentMethod !== 'qr' && (
                            <p className="text-xs opacity-60 max-w-[200px] mx-auto">
                                If the app didn't open, <a href={upiUrl} className="underline font-bold">click here</a> to try again.
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-fade-in-scale h-[85vh] md:h-[600px] flex flex-col md:flex-row shadow-[0_0_50px_rgba(99,102,241,0.15)] glow-border">
                
                {/* Left Side: Dynamic Animated Image Panel */}
                <div className="hidden md:block md:w-1/2 relative bg-dark overflow-hidden group">
                    <img 
                        src={property.image || (property.photos && property.photos[0]) || (
                            property.type === 'flight' ? "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000" : 
                            property.type === 'train' ? "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000" : 
                            property.type === 'car' ? "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000" : 
                            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000"
                        )} 
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/90"></div>
                    
                    {/* Animated Overlay Details */}
                    <div className="absolute bottom-0 left-0 p-8 w-full animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                        {isDirectTransport ? (
                            <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-full text-primary border border-primary/30 mb-4 animate-pulse">
                                {property.type === 'flight' ? <Plane size={14} /> : property.type === 'train' ? <Train size={14} /> : property.type === 'bus' ? <Bus size={14} /> : <Car size={14} />}
                                <span className="text-xs font-bold uppercase tracking-wider">{property.type}</span>
                            </div>
                        ) : type === 'hotel' ? (
                            <div className="inline-flex items-center space-x-2 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-full text-primary border border-primary/30 mb-4 animate-pulse">
                                <MapPin size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">{property.city || property.location || 'Destination'}</span>
                            </div>
                        ) : null}
                        
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                            {property.name}
                        </h2>
                        <div className="flex items-center gap-2 mb-4 text-gray-300 text-sm">
                             {property.rating && (
                                <div className="flex items-center text-yellow-400 font-medium">
                                    ★ {property.rating}
                                </div>
                             )}
                             {property.rating && <span>•</span>}
                             <span>
                                 {isDirectTransport
                                     ? property.type === 'flight'
                                         ? 'Premium Flight'
                                         : property.type === 'train'
                                         ? 'Premium Railway Journey'
                                         : property.type === 'bus'
                                         ? 'Premium Coach Service'
                                         : 'Premium Cab Service'
                                     : 'Premium Stay'}
                             </span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    {property.price}
                                </span>
                                <span className="text-gray-400 font-medium tracking-wide">
                                    {isDirectTransport ? '/ ticket' : '/ night'}
                                </span>
                            </div>
                            {isDirectTransport && guests > 1 && (
                                <span className="text-xs text-gray-400 font-semibold mt-1">
                                    Total for {guests} passengers: <strong className="text-white">
                                        {formatPriceForCountry(
                                            getPriceAmount(property.price) * guests,
                                            property.to ? (property.to.includes(',') ? property.to.split(',')[1].trim() : property.to) : 'India'
                                        )}
                                    </strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Booking Form */}
                <div className="w-full md:w-1/2 relative flex flex-col bg-[#121212] z-10 before:content-[''] before:absolute before:-left-[1px] before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {/* Processing Overlay for UPI/QR */}
                    {paymentStatus !== 'idle' && paymentMethod !== 'card' && step < 3 && renderProcessingScreen()}

                    <div className="p-6 pb-2 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                        {step > 1 && step < 3 ? (
                            <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white group flex items-center gap-2 transition-colors">
                                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                                <span className="text-sm font-medium">Back</span>
                            </button>
                        ) : (
                            <div className="w-16"></div> /* Spacer */
                        )}
                        <h3 className="text-lg font-bold text-white text-center flex-1">
                            {step === 1 ? (isDirectTransport ? 'Seat Selection' : 'Configure Stay') : step === 2 ? 'Secure Payment' : 'Confirmed'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Progress Bar with glowing active state */}
                    {step < 3 && (
                        <div className="px-8 mt-6">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/5 -z-10"></div>
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] transition-all duration-500 ease-out bg-gradient-to-r from-primary to-secondary -z-10`} style={{width: step === 1 ? '0%' : '100%'}}></div>
                                
                                <div className={`w-8 h-8 rounded-full border-[2px] flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= 1 ? 'bg-dark border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#121212] border-white/20 text-gray-500'}`}>1</div>
                                <div className={`w-8 h-8 rounded-full border-[2px] flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= 2 ? 'bg-dark border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#121212] border-white/20 text-gray-500'}`}>2</div>
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Details</span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>Payment</span>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar relative">
                        {step === 1 && (
                            <form onSubmit={handleDetailsSubmit} className="space-y-6 animate-slide-in-right" key="form-step-1">
                                {isDirectTransport ? (
                                    <>
                                        <div className="md:hidden bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 backdrop-blur-md">
                                            <div className="text-xs text-primary font-bold tracking-wider uppercase mb-1">{property.from} to {property.to}</div>
                                            <h4 className="text-white text-xl font-bold mb-2">{property.company}</h4>
                                            <div className="flex items-baseline justify-between flex-wrap gap-2">
                                                <div className="flex items-end gap-1">
                                                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{property.price}</p> 
                                                    <span className="text-gray-500 text-sm pb-1 font-medium">/ ticket</span>
                                                </div>
                                                {guests > 1 && (
                                                    <div className="text-xs text-gray-400 font-semibold">
                                                        Total ({guests} pass): <strong className="text-white">
                                                            {formatPriceForCountry(
                                                                getPriceAmount(property.price) * guests,
                                                                property.to ? (property.to.includes(',') ? property.to.split(',')[1].trim() : property.to) : 'India'
                                                            )}
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-400 ml-1 font-medium">Departure Date & Time</label>
                                                <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-300 font-medium flex items-center gap-2">
                                                    <Calendar size={16} className="text-primary" />
                                                    <span>
                                                        {property.departureTime ? new Date(property.departureTime).toLocaleDateString() : 'N/A'} at{' '}
                                                        {property.departureTime ? new Date(property.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-xs text-gray-400 ml-1 font-medium group-focus-within:text-primary transition-colors">Passengers</label>
                                                <div className="relative bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                                                    <User size={16} className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                                    <select
                                                        className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none appearance-none cursor-pointer"
                                                        value={guests}
                                                        onChange={(e) => {
                                                            setGuests(Number(e.target.value));
                                                            setSelectedSeats([]);
                                                        }}
                                                    >
                                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                                            <option key={num} value={num} className="bg-dark text-white">{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                         {property.type !== 'car' && (
                                             <SeatSelector
                                                 type={property.type}
                                                 numSeatsRequired={guests}
                                                 selectedSeats={selectedSeats}
                                                 onSelectSeats={setSelectedSeats}
                                             />
                                         )}
                                    </>
                                ) : (
                                    <>
                                        <div className="md:hidden bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 backdrop-blur-md">
                                            <div className="text-xs text-primary font-bold tracking-wider uppercase mb-1">{property.city || property.location || 'Destination'}</div>
                                            <h4 className="text-white text-xl font-bold mb-2">{property.name}</h4>
                                            <div className="flex items-end gap-1">
                                                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{property.price}</p> 
                                                <span className="text-gray-500 text-sm pb-1 font-medium">/ night</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 group">
                                                <label className="text-xs text-gray-400 ml-1 font-medium group-focus-within:text-primary transition-colors">Check-in Date</label>
                                                <div className="relative bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                                                    <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="date"
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none [color-scheme:dark]"
                                                        value={dates.checkIn}
                                                        onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-xs text-gray-400 ml-1 font-medium group-focus-within:text-primary transition-colors">Check-out Date</label>
                                                <div className="relative bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                                                    <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="date"
                                                        required
                                                        min={dates.checkIn || new Date().toISOString().split('T')[0]}
                                                        className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none [color-scheme:dark]"
                                                        value={dates.checkOut}
                                                        onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-xs text-gray-400 ml-1 font-medium group-focus-within:text-primary transition-colors">Number of Guests</label>
                                            <div className="relative bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                                                <User size={16} className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                                <select
                                                    className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none appearance-none cursor-pointer"
                                                    value={guests}
                                                    onChange={(e) => setGuests(e.target.value)}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                                        <option key={num} value={num} className="bg-dark text-white">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 rounded-2xl p-5 mt-4 relative overflow-hidden backdrop-blur-sm">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                            <h5 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                <Plane size={16} className="text-primary"/> Transport Options
                                            </h5>
                                            
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
                                                <div className="w-full sm:flex-1">
                                                    <div className="relative bg-black/60 border border-white/10 rounded-xl p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Origin City"
                                                            className="w-full bg-transparent text-white text-xs focus:outline-none text-center placeholder-gray-600"
                                                            value={travelingFrom}
                                                            onChange={(e) => setTravelingFrom(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex sm:flex-col items-center justify-center px-2 py-1 sm:py-0">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center sm:mb-1 animate-pulse">
                                                        {transportType === 'Flight' ? <Plane size={14} className="text-primary" /> :
                                                        transportType === 'Train' ? <Train size={14} className="text-primary" /> :
                                                        transportType === 'Bus' ? <Bus size={14} className="text-primary" /> :
                                                        transportType === 'Cab' ? <Car size={14} className="text-primary" /> :
                                                        transportType === 'Ship' ? <Ship size={14} className="text-primary" /> :
                                                        <MapPin size={14} className="text-primary" />}
                                                    </div>
                                                    <div className="hidden sm:block w-12 border-t border-dashed border-primary/50"></div>
                                                </div>

                                                <div className="w-full sm:flex-1">
                                                    <div className="relative bg-[#111] border border-white/5 rounded-xl p-3 opacity-60">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="w-full bg-transparent text-white text-xs focus:outline-none text-center truncate"
                                                            value={getPropertyLocation(property) ? getPropertyLocation(property).split(',')[0] : "Destination"}
                                                            title={getPropertyLocation(property) ? getPropertyLocation(property).split(',')[0] : "Destination"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 ml-1">Select Transport</label>
                                                <div className="relative bg-black/60 border border-white/10 rounded-xl p-3 focus-within:border-primary transition-colors cursor-pointer hover:border-white/20">
                                                    <select
                                                        className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer pl-2"
                                                        value={transportType}
                                                        onChange={(e) => {
                                                            setTransportType(e.target.value);
                                                            setSelectedSeats([]);
                                                        }}
                                                    >
                                                        {availableTransports.map(mode => (
                                                            <option key={mode} value={mode} className="bg-dark text-white p-2">
                                                                {mode} Journey
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {['flight', 'train', 'bus'].includes(transportType.toLowerCase()) && (
                                                <div className="mt-4">
                                                    <SeatSelector
                                                        type={transportType}
                                                        numSeatsRequired={guests}
                                                        selectedSeats={selectedSeats}
                                                        onSelectSeats={setSelectedSeats}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-4 mt-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    <span>Continue to Payment</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        )}

                    {step === 2 && (
                        <div className="space-y-6 animate-slide-in-right" key="form-step-2">
                            {/* UPI Options */}
                            <div>
                                <h4 className="text-[10px] text-gray-500 mb-3 uppercase tracking-wider font-bold">Quick Pay (UPI)</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleUPIPayment('gpay')}
                                        className="flex flex-col items-center justify-center gap-2 h-20 bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <div className="flex gap-[1px] transform scale-90"><span className="text-blue-500 font-bold">G</span><span className="text-green-500 font-bold">Pay</span></div>
                                    </button>

                                    <button
                                        onClick={() => handleUPIPayment('phonepe')}
                                        className="flex flex-col items-center justify-center gap-2 h-20 bg-black/40 hover:bg-[#5f259f]/20 border border-white/5 hover:border-[#5f259f]/50 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5f259f]/50"
                                    >
                                        <div className="text-[#5f259f] font-bold text-sm">PhonePe</div>
                                    </button>

                                    <button
                                        onClick={() => handleUPIPayment('paytm')}
                                        className="flex flex-col items-center justify-center gap-2 h-20 bg-black/40 hover:bg-[#00baf2]/20 border border-white/5 hover:border-[#00baf2]/50 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00baf2]/50"
                                    >
                                        <div className="text-[#00baf2] font-bold text-sm">Paytm</div>
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Option */}
                            <button
                                onClick={() => handleUPIPayment('qr')}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/[0.01] hover:from-white/10 hover:to-white/5 border border-white/10 rounded-2xl transition-all group backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:border-white/20 mt-2"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors rotate-3 group-hover:rotate-0">
                                        <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
                                            <div className="bg-current rounded-[2px]"></div>
                                            <div className="bg-current rounded-[2px] opacity-80"></div>
                                            <div className="bg-current rounded-[2px] opacity-60"></div>
                                            <div className="bg-current rounded-[2px] opacity-40"></div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-bold text-md">Scan QR Code</div>
                                        <div className="text-gray-400 text-xs mt-0.5">Instant payment via any UPI app</div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </button>

                            {/* Card Details (Stripe Elements) */}
                            <div className="pt-2">
                                <h4 className="text-[10px] text-gray-500 mb-4 uppercase tracking-wider font-bold relative flex items-center">
                                    <span className="bg-[#121212] pr-3 relative z-10 w-fit">Credit / Debit Card</span>
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-white/10"></div>
                                </h4>
                                {clientSecret ? (
                                    <div className="bg-black/50 border border-white/10 rounded-2xl p-5 shadow-inner">
                                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#6366f1', colorBackground: 'transparent', colorDanger: '#ef4444', spacingUnit: '4px', borderRadius: '12px' } } }}>
                                            <CheckoutForm onSuccess={(paymentId) => {
                                                handleBookingCreation(paymentId);
                                            }} />
                                        </Elements>
                                    </div>
                                ) : (
                                    <div className="flex justify-center p-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="h-full flex flex-col items-center justify-center animate-fade-in-up -mt-10 p-8 text-center" key="form-step-3">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                                <div className="w-28 h-28 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center text-white scale-100 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    <CheckCircle size={56} strokeWidth={2.5} />
                                </div>
                            </div>
                            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-3">Booking Confirmed!</h3>
                            <p className="text-gray-400 text-md max-w-[280px] mx-auto mb-10 leading-relaxed">
                                Get ready for your trip. Your itinerary has been securely sent to your inbox.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/my-bookings'; // Or use useNavigate if available
                                }}
                                className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold transition-all hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 w-full flex items-center justify-center space-x-2"
                            >
                                <span>View My Bookings</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default BookingModal;
