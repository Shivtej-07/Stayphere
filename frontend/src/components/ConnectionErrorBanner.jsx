import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ConnectionErrorBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if we are in a deployed environment (not localhost)
        const isDeployed = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

        // Check if the API is pointing to localhost
        const isLocalApi = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

        if (isDeployed && isLocalApi) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-3 shadow-lg animate-slide-down">
            <div className="container mx-auto flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <AlertTriangle className="shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <h3 className="font-bold text-base mb-1">Configuration Error: Logic Mismatch</h3>
                        <p className="mb-2">
                            You are viewing the <strong>deployed application</strong> ({window.location.hostname}), but it is trying to connect to a <strong>local backend</strong> ({API_BASE_URL}).
                        </p>
                        <p className="mb-2">
                            Browsers block this for security (Mixed Content / CORS). Your app will not work until you fix the configuration.
                        </p>
                        <div className="bg-black/20 p-3 rounded-lg text-xs font-mono mb-2">
                            <strong>Action Required:</strong><br />
                            1. Go to Vercel Project Settings &gt; Environment Variables.<br />
                            2. Add <code>VITE_API_BASE_URL</code> = <code>https://your-deployed-backend.com/api</code><br />
                            3. Redeploy the frontend.
                        </div>
                        <p className="opacity-80 text-xs">If you are the developer, check your console for more details.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConnectionErrorBanner;
