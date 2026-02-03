import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the payment
                return_url: window.location.origin,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setIsLoading(false);
            onSuccess(paymentIntent.id);
        } else {
            setMessage("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <PaymentElement
                    options={{
                        layout: "tabs",
                        appearance: {
                            theme: 'night',
                            variables: {
                                colorPrimary: '#9333ea',
                                colorBackground: '#1e1e1e',
                                colorText: '#ffffff',
                                colorDanger: '#ff4d4f',
                                fontFamily: 'ui-sans-serif, system-ui'
                            }
                        }
                    }}
                />
            </div>

            {message && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{message}</div>}

            <button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" /> Processing...
                    </>
                ) : (
                    <>
                        <Lock size={18} /> Pay Now
                    </>
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;
