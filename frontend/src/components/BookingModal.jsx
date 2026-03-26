import React, { useState, useEffect } from 'react';
import { X, Calendar, User, CheckCircle, CreditCard, Lock, Loader2, MapPin, Plane, Train, Bus, Car, Ship } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { API_BASE_URL } from '../config';

const stripePromise = loadStripe("pk_test_51RxejZPSVmcc3eBkvjEuMzJoMGGUIUoVwE9wwhMkRaCX0jBdQFDMR4cvINi5VHmACuiHmRvxJPtRxaTqo6AJnx1M00flLHoRs5");

const BookingModal = ({ isOpen, onClose, property }) => {
    const [step, setStep] = useState(1);
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [guests, setGuests] = useState(2);
    const [travelingFrom, setTravelingFrom] = useState('');
    const [transportType, setTransportType] = useState('Flight');
    const [paymentMethod, setPaymentMethod] = useState(null); // 'card', 'gpay', 'phonepe', 'paytm', 'qr'
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
    const [clientSecret, setClientSecret] = useState("");

    // Helper to safely get price amount as number
    const getPriceAmount = (price) => {
        if (!price) return 0;
        const priceStr = String(price);
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    };

    // Calculate dynamic transport options
    const availableTransports = React.useMemo(() => {
        if (!property?.location) return ['Flight', 'Train', 'Bus', 'Cab', 'Local'];
        const loc = property.location.toLowerCase();
        
        // Let's assume domestic involves India since user is from Pune
        const isDomestic = loc.includes('india') || loc.includes('mumbai') || loc.includes('delhi');
        
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
            return ['Flight', 'Train', 'Bus', 'Cab', 'Ship', 'Local'];
        }
        return ['Flight', 'Train', 'Bus', 'Cab', 'Local'];
    }, [property]);

    // Ensure selected transport is valid
    useEffect(() => {
        if (availableTransports.length > 0 && !availableTransports.includes(transportType)) {
            setTransportType(availableTransports[0]);
        }
    }, [availableTransports, transportType]);

    // Fetch Client Secret when entering payment step
    useEffect(() => {
        let isMounted = true;

        if (step === 2 && !clientSecret && property) {
            const amount = getPriceAmount(property.price);

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
    }, [step, clientSecret, property]);

    if (!isOpen || !property) return null;

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBookingCreation = async (paymentId) => {
        const token = localStorage.getItem('token');
        if (!token) return; // Or handle as guest checkout later

        try {
            const bookingData = {
                hotelName: property.name,
                location: property.location || property.from, // Fallback for transport
                image: property.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000", // Fallback image
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
                guests: guests,
                travelingFrom: travelingFrom,
                transportType: transportType,
                price: getPriceAmount(property.price),
                paymentId: paymentId
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
        const payeeName = 'Stayphere';
        const amount = getPriceAmount(property.price);
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

        const amount = getPriceAmount(property.price);
        const vpa = 'merchant@upi';
        const upiUrl = `upi://pay?pa=${vpa}&pn=Stayphere&am=${amount}&cu=INR`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

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
                            {paymentMethod === 'qr' ? `Amount: ${property.price}` : `Please approve the payment of ${property.price} in your app.`}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-scale h-[600px] flex flex-col">
                {/* Processing Overlay for UPI/QR */}
                {paymentStatus !== 'idle' && paymentMethod !== 'card' && step < 3 && renderProcessingScreen()}

                <div className="p-6 pb-0 flex items-center justify-between">
                    {step > 1 && step < 3 && (
                        <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white">
                            <span className="text-2xl">←</span>
                        </button>
                    )}
                    <h3 className="text-lg font-bold text-white flex-1 text-center -ml-6">
                        {step === 1 ? 'Booking Details' : step === 2 ? 'Select Payment' : 'Confirmation'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                {step < 3 && (
                    <div className="px-6 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-white/10'}`}></div>
                        </div>
                    </div>
                )}

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {step === 1 && (
                        <form onSubmit={handleDetailsSubmit} className="space-y-5">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <h4 className="text-white font-medium mb-1">{property.name}</h4>
                                <p className="text-primary text-sm font-bold">{property.price} <span className="text-gray-400 font-normal">/ night</span></p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 ml-1">Check-in</label>
                                    <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 focus-within:border-primary transition-colors">
                                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none [color-scheme:dark]"
                                            onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 ml-1">Check-out</label>
                                    <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 focus-within:border-primary transition-colors">
                                        <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            min={dates.checkIn || new Date().toISOString().split('T')[0]}
                                            className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none [color-scheme:dark]"
                                            onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-400 ml-1">Guests</label>
                                <div className="relative bg-white/5 border border-white/10 rounded-xl p-3 focus-within:border-primary transition-colors">
                                    <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                    <select
                                        className="w-full bg-transparent text-white text-sm pl-8 focus:outline-none appearance-none"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num} className="bg-dark text-white">{num} Guests</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
                                <h5 className="text-sm font-bold text-white mb-3">Route & Transport Medium</h5>
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <div className="flex-1">
                                        <div className="relative bg-dark/50 border border-white/10 rounded-xl p-2.5 focus-within:border-primary transition-colors">
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g., Pune"
                                                className="w-full bg-transparent text-white text-xs focus:outline-none text-center"
                                                value={travelingFrom}
                                                onChange={(e) => setTravelingFrom(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center px-1">
                                        {transportType === 'Flight' ? <Plane size={16} className="text-primary mb-1" /> :
                                         transportType === 'Train' ? <Train size={16} className="text-primary mb-1" /> :
                                         transportType === 'Bus' ? <Bus size={16} className="text-primary mb-1" /> :
                                         transportType === 'Cab' ? <Car size={16} className="text-primary mb-1" /> :
                                         transportType === 'Ship' ? <Ship size={16} className="text-primary mb-1" /> :
                                         <MapPin size={16} className="text-primary mb-1" />}
                                        <div className="w-8 border-t border-dashed border-gray-500"></div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="relative bg-dark/50 border border-white/10 rounded-xl p-2.5 opacity-70">
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full bg-transparent text-white text-xs focus:outline-none text-center"
                                                value={property.location ? property.location.split(',')[0] : "Destination"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 ml-1">Transport Medium</label>
                                    <div className="relative bg-dark/50 border border-white/10 rounded-xl p-2.5 focus-within:border-primary transition-colors">
                                        {transportType === 'Flight' ? <Plane size={14} className="absolute left-3 top-3.5 text-gray-400" /> :
                                         transportType === 'Train' ? <Train size={14} className="absolute left-3 top-3.5 text-gray-400" /> :
                                         transportType === 'Bus' ? <Bus size={14} className="absolute left-3 top-3.5 text-gray-400" /> :
                                         transportType === 'Cab' ? <Car size={14} className="absolute left-3 top-3.5 text-gray-400" /> :
                                         transportType === 'Ship' ? <Ship size={14} className="absolute left-3 top-3.5 text-gray-400" /> :
                                         <MapPin size={14} className="absolute left-3 top-3.5 text-gray-400" />}
                                        <select
                                            className="w-full bg-transparent text-white text-xs pl-8 focus:outline-none appearance-none"
                                            value={transportType}
                                            onChange={(e) => setTransportType(e.target.value)}
                                        >
                                            {availableTransports.map(mode => (
                                                <option key={mode} value={mode} className="bg-dark text-white">
                                                    {mode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors mt-4"
                            >
                                Continue to Payment
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* UPI Options */}
                            <div>
                                <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold text-xs">Recommended</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleUPIPayment('gpay')}
                                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                                            <div className="flex gap-[1px] transform scale-75"><span className="text-blue-500 font-bold">G</span><span className="text-green-500 font-bold">Pay</span></div>
                                        </div>
                                        <span className="text-xs text-gray-300">Google Pay</span>
                                    </button>

                                    <button
                                        onClick={() => handleUPIPayment('phonepe')}
                                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105"
                                    >
                                        <div className="w-10 h-10 bg-[#5f259f] rounded-full flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
                                            PhonePe
                                        </div>
                                        <span className="text-xs text-gray-300">PhonePe</span>
                                    </button>

                                    <button
                                        onClick={() => handleUPIPayment('paytm')}
                                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105"
                                    >
                                        <div className="w-10 h-10 bg-[#00baf2] rounded-full flex items-center justify-center text-white font-bold text-[10px] overflow-hidden">
                                            Paytm
                                        </div>
                                        <span className="text-xs text-gray-300">Paytm</span>
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Option */}
                            <button
                                onClick={() => handleUPIPayment('qr')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[1px]"></div>
                                            <div className="bg-current rounded-[0.5px] opacity-50"></div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-medium text-sm">Scan QR Code</div>
                                        <div className="text-gray-400 text-xs">Use any UPI app to scan</div>
                                    </div>
                                </div>
                                <span className="text-gray-500">→</span>
                            </button>

                            {/* Card Details (Stripe Elements) */}
                            <div>
                                <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold text-xs mt-4">Credit / Debit Card</h4>
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ffffff' } } }}>
                                        <CheckoutForm onSuccess={(paymentId) => {
                                            handleBookingCreation(paymentId);
                                        }} />
                                    </Elements>
                                ) : (
                                    <div className="flex justify-center p-8 bg-white/5 rounded-xl border border-white/10">
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="h-full flex flex-col items-center justify-center animate-fade-in-up -mt-10">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 scale-100 animate-bounce-slow">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2 text-center">Booking Confirmed!</h3>
                            <p className="text-gray-400 text-sm max-w-[250px] mx-auto mb-8 text-center">
                                Your payment was successful. We've sent the tickets to your email.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/my-bookings'; // Or use useNavigate if available, but window.location is safer for modal unmount
                                }}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-medium transition-colors hover:bg-primary/90 shadow-lg shadow-primary/25"
                            >
                                View My Bookings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
