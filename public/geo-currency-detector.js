/**
 * Geo-Currency Price Detector for Netlify
 * Automatically detects visitor's country and updates product prices
 * 
 * Usage: Include this script in your HTML and add price elements like:
 * <p class="price" data-usd="9.99" data-eur="8.99" data-gbp="7.99" data-pkr="2800" data-inr="850">$9.99</p>
 */

(function() {
    'use strict';

    // ===== CURRENCY MAPPING CONFIGURATION =====
    // Add more countries/currencies here as needed
    const CURRENCY_MAP = {
        // Europe - EUR
        'AT': 'EUR', 'BE': 'EUR', 'BG': 'EUR', 'HR': 'EUR', 'CY': 'EUR',
        'CZ': 'EUR', 'DK': 'EUR', 'EE': 'EUR', 'FI': 'EUR', 'FR': 'EUR',
        'DE': 'EUR', 'GR': 'EUR', 'HU': 'EUR', 'IE': 'EUR', 'IT': 'EUR',
        'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'NL': 'EUR',
        'PL': 'EUR', 'PT': 'EUR', 'RO': 'EUR', 'SK': 'EUR', 'SI': 'EUR',
        'ES': 'EUR', 'SE': 'EUR', 'NO': 'EUR', 'CH': 'EUR', 'IS': 'EUR',
        
        // United Kingdom - GBP
        'GB': 'GBP',
        
        // USA - USD
        'US': 'USD',
        
        // Asia - Local Currencies
        'PK': 'PKR',  // Pakistan
        'IN': 'INR',  // India
        'BD': 'BDT',  // Bangladesh
        'AE': 'AED',  // UAE
        'SA': 'SAR',  // Saudi Arabia
        'MY': 'MYR',  // Malaysia
        'SG': 'SGD',  // Singapore
        'TH': 'THB',  // Thailand
        'ID': 'IDR',  // Indonesia
        'PH': 'PHP',  // Philippines
        'VN': 'VND',  // Vietnam
        'CN': 'CNY',  // China
        'JP': 'JPY',  // Japan
        'KR': 'KRW',  // South Korea
        
        // Middle East
        'TR': 'TRY',  // Turkey
        'EG': 'EGP',  // Egypt
        'IL': 'ILS',  // Israel
        'JO': 'JOD',  // Jordan
        'LB': 'LBP',  // Lebanon
        
        // Americas
        'CA': 'CAD',  // Canada
        'MX': 'MXN',  // Mexico
        'BR': 'BRL',  // Brazil
        'AR': 'ARS',  // Argentina
        'CL': 'CLP',  // Chile
        'CO': 'COP',  // Colombia
        
        // Australia/Oceania
        'AU': 'AUD',  // Australia
        'NZ': 'NZD',  // New Zealand
        
        // Africa
        'ZA': 'ZAR',  // South Africa
        'NG': 'NGN',  // Nigeria
        'KE': 'KES',  // Kenya
        'GH': 'GHS',  // Ghana
    };

    // Default fallback currency
    const DEFAULT_CURRENCY = 'USD';

    // Currency symbols for display
    const CURRENCY_SYMBOLS = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'PKR': 'Rs',
        'INR': '₹',
        'BDT': '৳',
        'AED': 'د.إ',
        'SAR': '﷼',
        'MYR': 'RM',
        'SGD': 'S$',
        'THB': '฿',
        'IDR': 'Rp',
        'PHP': '₱',
        'VND': '₫',
        'CNY': '¥',
        'JPY': '¥',
        'KRW': '₩',
        'TRY': '₺',
        'EGP': 'E£',
        'ILS': '₪',
        'JOD': 'د.ا',
        'LBP': 'ل.ل',
        'CAD': 'C$',
        'MXN': '$',
        'BRL': 'R$',
        'ARS': '$',
        'CLP': '$',
        'COP': '$',
        'AUD': 'A$',
        'NZD': 'NZ$',
        'ZAR': 'R',
        'NGN': '₦',
        'KES': 'KSh',
        'GHS': '₵'
    };

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Get visitor's country code using free IP API
     * @returns {Promise<string>} Country code (e.g., 'US', 'GB', 'PK')
     */
    async function getVisitorCountry() {
        try {
            // Using ipapi.co (free, no API key required, 1000 requests/day)
            const response = await fetch('https://ipapi.co/country/', {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });
            
            if (response.ok) {
                const countryCode = await response.text();
                return countryCode.trim().toUpperCase();
            }
            
            throw new Error('Failed to get country from ipapi.co');
        } catch (error) {
            console.warn('Primary geo service failed, trying backup...', error);
            
            // Backup service: ipinfo.io (free, 50k requests/month)
            try {
                const backupResponse = await fetch('https://ipinfo.io/country', {
                    method: 'GET'
                });
                
                if (backupResponse.ok) {
                    const countryCode = await backupResponse.text();
                    return countryCode.trim().toUpperCase();
                }
            } catch (backupError) {
                console.warn('Backup geo service also failed:', backupError);
            }
            
            // Final fallback: return null to use default currency
            return null;
        }
    }

    /**
     * Get currency for a country code
     * @param {string} countryCode - ISO country code
     * @returns {string} Currency code
     */
    function getCurrencyForCountry(countryCode) {
        return CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
    }

    /**
     * Update all price elements on the page
     * @param {string} targetCurrency - Currency to display
     */
    function updatePrices(targetCurrency) {
        const priceElements = document.querySelectorAll('.price');
        const currencySymbol = CURRENCY_SYMBOLS[targetCurrency] || '$';
        
        priceElements.forEach(element => {
            const attributeName = `data-${targetCurrency.toLowerCase()}`;
            const price = element.getAttribute(attributeName);
            
            if (price) {
                // Update the element's text content
                element.textContent = `${currencySymbol}${price}`;
                
                // Add a data attribute to track current currency
                element.setAttribute('data-current-currency', targetCurrency);
                
                // Optional: Add a CSS class for styling
                element.classList.add('geo-updated');
            } else {
                // Fallback: if target currency not available, try USD
                const usdPrice = element.getAttribute('data-usd');
                if (usdPrice && targetCurrency !== 'USD') {
                    element.textContent = `$${usdPrice}`;
                    element.setAttribute('data-current-currency', 'USD');
                    element.classList.add('geo-updated', 'fallback-currency');
                }
            }
        });

        // Log for debugging
        console.log(`🌍 Geo-Currency: Updated ${priceElements.length} prices to ${targetCurrency}`);
    }

    /**
     * Add loading state to price elements
     */
    function showLoadingState() {
        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach(element => {
            element.classList.add('geo-loading');
        });
    }

    /**
     * Remove loading state from price elements
     */
    function hideLoadingState() {
        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach(element => {
            element.classList.remove('geo-loading');
        });
    }

    // ===== MAIN EXECUTION =====
    
    /**
     * Initialize geo-currency detection
     */
    async function initGeoCurrency() {
        // Don't run if already processed or no price elements found
        if (document.body.hasAttribute('data-geo-currency-processed')) {
            return;
        }
        
        const priceElements = document.querySelectorAll('.price');
        if (priceElements.length === 0) {
            console.log('🌍 Geo-Currency: No price elements found');
            return;
        }

        console.log('🌍 Geo-Currency: Initializing...');
        
        // Mark as processed to prevent multiple runs
        document.body.setAttribute('data-geo-currency-processed', 'true');
        
        // Show loading state
        showLoadingState();
        
        try {
            // Get visitor's country
            const countryCode = await getVisitorCountry();
            
            if (countryCode) {
                console.log(`🌍 Geo-Currency: Detected country: ${countryCode}`);
                
                // Get appropriate currency
                const targetCurrency = getCurrencyForCountry(countryCode);
                console.log(`🌍 Geo-Currency: Using currency: ${targetCurrency}`);
                
                // Update prices
                updatePrices(targetCurrency);
                
                // Store in sessionStorage for consistency across page loads
                sessionStorage.setItem('geo-currency', targetCurrency);
                sessionStorage.setItem('geo-country', countryCode);
                
            } else {
                console.log(`🌍 Geo-Currency: Could not detect country, using default: ${DEFAULT_CURRENCY}`);
                updatePrices(DEFAULT_CURRENCY);
            }
            
        } catch (error) {
            console.error('🌍 Geo-Currency: Error during initialization:', error);
            updatePrices(DEFAULT_CURRENCY);
        } finally {
            // Hide loading state
            hideLoadingState();
        }
    }

    // ===== AUTO-INITIALIZATION =====
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGeoCurrency);
    } else {
        // DOM already loaded
        initGeoCurrency();
    }

    // Also run on page show (for back/forward cache)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            initGeoCurrency();
        }
    });

    // ===== OPTIONAL: Manual trigger function =====
    // You can call window.refreshGeoCurrency() to manually update prices
    window.refreshGeoCurrency = function() {
        document.body.removeAttribute('data-geo-currency-processed');
        initGeoCurrency();
    };

    // ===== OPTIONAL: CSS for loading state =====
    // Add this CSS to your stylesheet for loading animation
    const style = document.createElement('style');
    style.textContent = `
        .price.geo-loading {
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        .price.geo-updated {
            transition: all 0.3s ease;
        }
        .price.fallback-currency {
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

})();

/**
 * USAGE EXAMPLE:
 * 
 * In your HTML, add price elements like this:
 * 
 * <p class="price" 
 *    data-usd="9.99" 
 *    data-eur="8.99" 
 *    data-gbp="7.99" 
 *    data-pkr="2800" 
 *    data-inr="850"
 *    data-aed="36.70"
 *    data-sar="37.46">
 *    $9.99
 * </p>
 * 
 * Then include this script:
 * <script src="geo-currency-detector.js"></script>
 * 
 * The script will automatically detect the visitor's location and update all prices!
 */