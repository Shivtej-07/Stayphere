/**
 * Utility to format prices based on the destination's country.
 * Assumes a base price roughly scaled to INR for calculation purposes.
 */

export const getCurrencyForCountry = (country) => {
    const defaultCurrency = { symbol: '₹', code: 'INR', exchangeRate: 1 };
    
    if (!country) return defaultCurrency;

    // Simple fixed exchange rate mapping (relative to INR)
    const currencyMap = {
        'India': { symbol: '₹', code: 'INR', exchangeRate: 1 },
        'USA': { symbol: '$', code: 'USD', exchangeRate: 0.012 },
        'US': { symbol: '$', code: 'USD', exchangeRate: 0.012 },
        'UK': { symbol: '£', code: 'GBP', exchangeRate: 0.0095 },
        'United Kingdom': { symbol: '£', code: 'GBP', exchangeRate: 0.0095 },
        'France': { symbol: '€', code: 'EUR', exchangeRate: 0.011 },
        'Germany': { symbol: '€', code: 'EUR', exchangeRate: 0.011 },
        'Italy': { symbol: '€', code: 'EUR', exchangeRate: 0.011 },
        'Spain': { symbol: '€', code: 'EUR', exchangeRate: 0.011 },
        'Japan': { symbol: '¥', code: 'JPY', exchangeRate: 1.8 },
        'Australia': { symbol: 'A$', code: 'AUD', exchangeRate: 0.018 },
        'Canada': { symbol: 'C$', code: 'CAD', exchangeRate: 0.016 },
        'UAE': { symbol: 'د.إ', code: 'AED', exchangeRate: 0.044 },
        'Dubai': { symbol: 'د.إ', code: 'AED', exchangeRate: 0.044 },
        'Switzerland': { symbol: 'CHF', code: 'CHF', exchangeRate: 0.010 },
        'Singapore': { symbol: 'S$', code: 'SGD', exchangeRate: 0.016 },
    };

    // Try an exact match, or iterate through keys to find a substring match
    const exactMatch = currencyMap[country] || currencyMap[country.trim()];
    if (exactMatch) return exactMatch;

    for (const [key, currency] of Object.entries(currencyMap)) {
        if (country.toLowerCase().includes(key.toLowerCase())) {
            return currency;
        }
    }

    return defaultCurrency; // Fallback to INR if country not found
};

export const formatPriceForCountry = (basePriceInINR, country) => {
    // Ensure base price is a number
    const numericPrice = typeof basePriceInINR === 'string' 
        ? parseFloat(basePriceInINR.replace(/[^0-9.]/g, '')) 
        : Number(basePriceInINR);
        
    if (isNaN(numericPrice)) return basePriceInINR; // Return as is if it's not a valid number
    
    const currency = getCurrencyForCountry(country);
    // Calculate and round to a clean number depending on the currency scale
    // e.g., INR rounding to tens, USD rounding to whole or generic
    const convertedPrice = numericPrice * currency.exchangeRate;
    
    // For smaller units like Euro/USD, maybe don't want decimals for mock data
    const roundedPrice = currency.exchangeRate < 0.1 
        ? Math.ceil(convertedPrice) 
        : Math.ceil(convertedPrice / 10) * 10;

    return `${currency.symbol}${roundedPrice.toLocaleString()}`;
};
