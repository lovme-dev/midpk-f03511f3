import { useState, useEffect } from "react";
import { Globe, MapPin, Flag, ChevronDown, Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHelmet from "@/components/SEO/SEOHelmet";
import { useIPDetection } from "@/hooks/useIPDetection";
import { getFlag } from "@/utils/countryFlags";

interface IPDetectorPageProps {
  onLogout: () => void;
}

interface Country {
  name: string;
  code: string;
  region: string;
  currency: string;
}

const countries: Country[] = [
  // North America
  { name: "United States", code: "us", region: "North America", currency: "USD" },
  { name: "Canada", code: "ca", region: "North America", currency: "CAD" },
  { name: "Mexico", code: "mx", region: "North America", currency: "MXN" },
  
  // Latin America & Caribbean
  { name: "Argentina", code: "ar", region: "Latin America & Caribbean", currency: "ARS" },
  { name: "Bolivia", code: "bo", region: "Latin America & Caribbean", currency: "BOB" },
  { name: "Brazil", code: "br", region: "Latin America & Caribbean", currency: "BRL" },
  { name: "Chile", code: "cl", region: "Latin America & Caribbean", currency: "CLP" },
  { name: "Colombia", code: "co", region: "Latin America & Caribbean", currency: "COP" },
  { name: "Costa Rica", code: "cr", region: "Latin America & Caribbean", currency: "CRC" },
  { name: "Cuba", code: "cu", region: "Latin America & Caribbean", currency: "CUP" },
  { name: "Dominican Republic", code: "do", region: "Latin America & Caribbean", currency: "DOP" },
  { name: "Ecuador", code: "ec", region: "Latin America & Caribbean", currency: "USD" },
  { name: "El Salvador", code: "sv", region: "Latin America & Caribbean", currency: "USD" },
  { name: "Guatemala", code: "gt", region: "Latin America & Caribbean", currency: "GTQ" },
  { name: "Haiti", code: "ht", region: "Latin America & Caribbean", currency: "HTG" },
  { name: "Honduras", code: "hn", region: "Latin America & Caribbean", currency: "HNL" },
  { name: "Jamaica", code: "jm", region: "Latin America & Caribbean", currency: "JMD" },
  { name: "Nicaragua", code: "ni", region: "Latin America & Caribbean", currency: "NIO" },
  { name: "Panama", code: "pa", region: "Latin America & Caribbean", currency: "PAB" },
  { name: "Paraguay", code: "py", region: "Latin America & Caribbean", currency: "PYG" },
  { name: "Peru", code: "pe", region: "Latin America & Caribbean", currency: "PEN" },
  { name: "Uruguay", code: "uy", region: "Latin America & Caribbean", currency: "UYU" },
  { name: "Venezuela", code: "ve", region: "Latin America & Caribbean", currency: "VES" },
  { name: "Bahamas", code: "bs", region: "Latin America & Caribbean", currency: "BSD" },
  { name: "Barbados", code: "bb", region: "Latin America & Caribbean", currency: "BBD" },
  { name: "Trinidad and Tobago", code: "tt", region: "Latin America & Caribbean", currency: "TTD" },
  
  // Europe
  { name: "United Kingdom", code: "gb", region: "Europe", currency: "GBP" },
  { name: "France", code: "fr", region: "Europe", currency: "EUR" },
  { name: "Germany", code: "de", region: "Europe", currency: "EUR" },
  { name: "Italy", code: "it", region: "Europe", currency: "EUR" },
  { name: "Spain", code: "es", region: "Europe", currency: "EUR" },
  { name: "Portugal", code: "pt", region: "Europe", currency: "EUR" },
  { name: "Netherlands", code: "nl", region: "Europe", currency: "EUR" },
  { name: "Belgium", code: "be", region: "Europe", currency: "EUR" },
  { name: "Switzerland", code: "ch", region: "Europe", currency: "CHF" },
  { name: "Austria", code: "at", region: "Europe", currency: "EUR" },
  { name: "Greece", code: "gr", region: "Europe", currency: "EUR" },
  { name: "Poland", code: "pl", region: "Europe", currency: "PLN" },
  { name: "Sweden", code: "se", region: "Europe", currency: "SEK" },
  { name: "Norway", code: "no", region: "Europe", currency: "NOK" },
  { name: "Denmark", code: "dk", region: "Europe", currency: "DKK" },
  { name: "Finland", code: "fi", region: "Europe", currency: "EUR" },
  { name: "Ireland", code: "ie", region: "Europe", currency: "EUR" },
  { name: "Czech Republic", code: "cz", region: "Europe", currency: "CZK" },
  { name: "Hungary", code: "hu", region: "Europe", currency: "HUF" },
  { name: "Romania", code: "ro", region: "Europe", currency: "RON" },
  { name: "Bulgaria", code: "bg", region: "Europe", currency: "BGN" },
  { name: "Croatia", code: "hr", region: "Europe", currency: "EUR" },
  { name: "Slovenia", code: "si", region: "Europe", currency: "EUR" },
  { name: "Slovakia", code: "sk", region: "Europe", currency: "EUR" },
  { name: "Estonia", code: "ee", region: "Europe", currency: "EUR" },
  { name: "Latvia", code: "lv", region: "Europe", currency: "EUR" },
  { name: "Lithuania", code: "lt", region: "Europe", currency: "EUR" },
  { name: "Iceland", code: "is", region: "Europe", currency: "ISK" },
  { name: "Luxembourg", code: "lu", region: "Europe", currency: "EUR" },
  { name: "Malta", code: "mt", region: "Europe", currency: "EUR" },
  { name: "Cyprus", code: "cy", region: "Europe", currency: "EUR" },
  { name: "Albania", code: "al", region: "Europe", currency: "ALL" },
  { name: "Serbia", code: "rs", region: "Europe", currency: "RSD" },
  { name: "Montenegro", code: "me", region: "Europe", currency: "EUR" },
  { name: "North Macedonia", code: "mk", region: "Europe", currency: "MKD" },
  { name: "Bosnia and Herzegovina", code: "ba", region: "Europe", currency: "BAM" },
  { name: "Ukraine", code: "ua", region: "Europe", currency: "UAH" },
  { name: "Belarus", code: "by", region: "Europe", currency: "BYN" },
  { name: "Moldova", code: "md", region: "Europe", currency: "MDL" },
  { name: "Russia", code: "ru", region: "Europe", currency: "RUB" },
  { name: "Türkiye", code: "tr", region: "Europe", currency: "TRY" },
  
  // Asia
  { name: "China", code: "cn", region: "Asia", currency: "CNY" },
  { name: "Japan", code: "jp", region: "Asia", currency: "JPY" },
  { name: "South Korea", code: "kr", region: "Asia", currency: "KRW" },
  { name: "North Korea", code: "kp", region: "Asia", currency: "KPW" },
  { name: "India", code: "in", region: "Asia", currency: "INR" },
  { name: "Pakistan", code: "pk", region: "Asia", currency: "PKR" },
  { name: "Bangladesh", code: "bd", region: "Asia", currency: "BDT" },
  { name: "Sri Lanka", code: "lk", region: "Asia", currency: "LKR" },
  { name: "Nepal", code: "np", region: "Asia", currency: "NPR" },
  { name: "Bhutan", code: "bt", region: "Asia", currency: "BTN" },
  { name: "Afghanistan", code: "af", region: "Asia", currency: "AFN" },
  { name: "Indonesia", code: "id", region: "Asia", currency: "IDR" },
  { name: "Malaysia", code: "my", region: "Asia", currency: "MYR" },
  { name: "Singapore", code: "sg", region: "Asia", currency: "SGD" },
  { name: "Thailand", code: "th", region: "Asia", currency: "THB" },
  { name: "Vietnam", code: "vn", region: "Asia", currency: "VND" },
  { name: "Philippines", code: "ph", region: "Asia", currency: "PHP" },
  { name: "Cambodia", code: "kh", region: "Asia", currency: "KHR" },
  { name: "Laos", code: "la", region: "Asia", currency: "LAK" },
  { name: "Myanmar (Burma)", code: "mm", region: "Asia", currency: "MMK" },
  { name: "Brunei", code: "bn", region: "Asia", currency: "BND" },
  { name: "Taiwan", code: "tw", region: "Asia", currency: "TWD" },
  { name: "Hong Kong", code: "hk", region: "Asia", currency: "HKD" },
  { name: "Macao", code: "mo", region: "Asia", currency: "MOP" },
  { name: "Mongolia", code: "mn", region: "Asia", currency: "MNT" },
  { name: "Kazakhstan", code: "kz", region: "Asia", currency: "KZT" },
  { name: "Uzbekistan", code: "uz", region: "Asia", currency: "UZS" },
  { name: "Turkmenistan", code: "tm", region: "Asia", currency: "TMT" },
  { name: "Kyrgyzstan", code: "kg", region: "Asia", currency: "KGS" },
  { name: "Tajikistan", code: "tj", region: "Asia", currency: "TJS" },
  { name: "Armenia", code: "am", region: "Asia", currency: "AMD" },
  { name: "Azerbaijan", code: "az", region: "Asia", currency: "AZN" },
  { name: "Georgia", code: "ge", region: "Asia", currency: "GEL" },
  { name: "Maldives", code: "mv", region: "Asia", currency: "MVR" },
  { name: "Timor-Leste", code: "tl", region: "Asia", currency: "USD" },
  
  // Middle East
  { name: "Saudi Arabia", code: "sa", region: "Middle East", currency: "SAR" },
  { name: "United Arab Emirates", code: "ae", region: "Middle East", currency: "AED" },
  { name: "Qatar", code: "qa", region: "Middle East", currency: "QAR" },
  { name: "Kuwait", code: "kw", region: "Middle East", currency: "KWD" },
  { name: "Bahrain", code: "bh", region: "Middle East", currency: "BHD" },
  { name: "Oman", code: "om", region: "Middle East", currency: "OMR" },
  { name: "Yemen", code: "ye", region: "Middle East", currency: "YER" },
  { name: "Iraq", code: "iq", region: "Middle East", currency: "IQD" },
  { name: "Iran", code: "ir", region: "Middle East", currency: "IRR" },
  { name: "Jordan", code: "jo", region: "Middle East", currency: "JOD" },
  { name: "Lebanon", code: "lb", region: "Middle East", currency: "LBP" },
  { name: "Syria", code: "sy", region: "Middle East", currency: "SYP" },
  { name: "Israel", code: "il", region: "Middle East", currency: "ILS" },
  { name: "Palestine", code: "ps", region: "Middle East", currency: "ILS" },
  
  // Africa
  { name: "Egypt", code: "eg", region: "Africa", currency: "EGP" },
  { name: "South Africa", code: "za", region: "Africa", currency: "ZAR" },
  { name: "Nigeria", code: "ng", region: "Africa", currency: "NGN" },
  { name: "Kenya", code: "ke", region: "Africa", currency: "KES" },
  { name: "Ethiopia", code: "et", region: "Africa", currency: "ETB" },
  { name: "Ghana", code: "gh", region: "Africa", currency: "GHS" },
  { name: "Morocco", code: "ma", region: "Africa", currency: "MAD" },
  { name: "Algeria", code: "dz", region: "Africa", currency: "DZD" },
  { name: "Tunisia", code: "tn", region: "Africa", currency: "TND" },
  { name: "Libya", code: "ly", region: "Africa", currency: "LYD" },
  { name: "Sudan", code: "sd", region: "Africa", currency: "SDG" },
  { name: "Tanzania", code: "tz", region: "Africa", currency: "TZS" },
  { name: "Uganda", code: "ug", region: "Africa", currency: "UGX" },
  { name: "Angola", code: "ao", region: "Africa", currency: "AOA" },
  { name: "Mozambique", code: "mz", region: "Africa", currency: "MZN" },
  { name: "Zambia", code: "zm", region: "Africa", currency: "ZMW" },
  { name: "Zimbabwe", code: "zw", region: "Africa", currency: "ZWL" },
  { name: "Botswana", code: "bw", region: "Africa", currency: "BWP" },
  { name: "Namibia", code: "na", region: "Africa", currency: "NAD" },
  { name: "Senegal", code: "sn", region: "Africa", currency: "XOF" },
  { name: "Ivory Coast", code: "ci", region: "Africa", currency: "XOF" },
  { name: "Cameroon", code: "cm", region: "Africa", currency: "XAF" },
  { name: "Mali", code: "ml", region: "Africa", currency: "XOF" },
  { name: "Niger", code: "ne", region: "Africa", currency: "XOF" },
  { name: "Burkina Faso", code: "bf", region: "Africa", currency: "XOF" },
  { name: "Madagascar", code: "mg", region: "Africa", currency: "MGA" },
  { name: "Mauritius", code: "mu", region: "Africa", currency: "MUR" },
  { name: "Rwanda", code: "rw", region: "Africa", currency: "RWF" },
  { name: "Malawi", code: "mw", region: "Africa", currency: "MWK" },
  { name: "Somalia", code: "so", region: "Africa", currency: "SOS" },
  { name: "Congo (DRC)", code: "cd", region: "Africa", currency: "CDF" },
  { name: "Congo (Republic)", code: "cg", region: "Africa", currency: "XAF" },
  { name: "Gabon", code: "ga", region: "Africa", currency: "XAF" },
  { name: "Chad", code: "td", region: "Africa", currency: "XAF" },
  { name: "Central African Republic", code: "cf", region: "Africa", currency: "XAF" },
  { name: "Benin", code: "bj", region: "Africa", currency: "XOF" },
  { name: "Togo", code: "tg", region: "Africa", currency: "XOF" },
  { name: "Sierra Leone", code: "sl", region: "Africa", currency: "SLL" },
  { name: "Liberia", code: "lr", region: "Africa", currency: "LRD" },
  { name: "Mauritania", code: "mr", region: "Africa", currency: "MRU" },
  { name: "Gambia", code: "gm", region: "Africa", currency: "GMD" },
  { name: "Guinea", code: "gn", region: "Africa", currency: "GNF" },
  { name: "Guinea-Bissau", code: "gw", region: "Africa", currency: "XOF" },
  { name: "Equatorial Guinea", code: "gq", region: "Africa", currency: "XAF" },
  { name: "Eritrea", code: "er", region: "Africa", currency: "ERN" },
  { name: "Djibouti", code: "dj", region: "Africa", currency: "DJF" },
  { name: "Seychelles", code: "sc", region: "Africa", currency: "SCR" },
  { name: "Comoros", code: "km", region: "Africa", currency: "KMF" },
  { name: "Cape Verde", code: "cv", region: "Africa", currency: "CVE" },
  { name: "São Tomé and Príncipe", code: "st", region: "Africa", currency: "STN" },
  { name: "Lesotho", code: "ls", region: "Africa", currency: "LSL" },
  { name: "Eswatini", code: "sz", region: "Africa", currency: "SZL" },
  { name: "Burundi", code: "bi", region: "Africa", currency: "BIF" },
  { name: "South Sudan", code: "ss", region: "Africa", currency: "SSP" },
  
  // Oceania
  { name: "Australia", code: "au", region: "Oceania", currency: "AUD" },
  { name: "New Zealand", code: "nz", region: "Oceania", currency: "NZD" },
  { name: "Fiji", code: "fj", region: "Oceania", currency: "FJD" },
  { name: "Papua New Guinea", code: "pg", region: "Oceania", currency: "PGK" },
  { name: "Solomon Islands", code: "sb", region: "Oceania", currency: "SBD" },
  { name: "Vanuatu", code: "vu", region: "Oceania", currency: "VUV" },
  { name: "Samoa", code: "ws", region: "Oceania", currency: "WST" },
  { name: "Tonga", code: "to", region: "Oceania", currency: "TOP" },
  { name: "Micronesia", code: "fm", region: "Oceania", currency: "USD" },
  { name: "Palau", code: "pw", region: "Oceania", currency: "USD" },
  { name: "Marshall Islands", code: "mh", region: "Oceania", currency: "USD" },
  { name: "Kiribati", code: "ki", region: "Oceania", currency: "AUD" },
  { name: "Tuvalu", code: "tv", region: "Oceania", currency: "AUD" },
  { name: "Nauru", code: "nr", region: "Oceania", currency: "AUD" },
];

const IPDetectorPage = ({ onLogout }: IPDetectorPageProps) => {
  const { detectedCountry, ipAddress, loading } = useIPDetection(countries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [showAllCountries, setShowAllCountries] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(query) || 
        country.region.toLowerCase().includes(query) ||
        country.currency.toLowerCase().includes(query)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery]);

  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-midasbuy-darkBlue via-midasbuy-navy to-midasbuy-darkBlue text-white">
      <SEOHelmet 
        title="IP Detector - Find Your Country by IP Address | Midasbuy"
        description="Free IP detector tool to automatically detect your country based on your IP address. View flags and currencies for 190+ countries worldwide."
        keywords="ip detector, ip address, country detector, flag detector, geolocation, IP location"
        canonicalUrl="/ip-detector"
        ogImage="/og-image.png"
        ogType="website"
      />
      <Header onLogout={onLogout} />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-midasbuy-blue/20 rounded-full mb-6">
              <Globe className="w-10 h-10 text-midasbuy-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-midasbuy-blue to-midasbuy-gold bg-clip-text text-transparent">
              IP Detector
            </h1>
            <p className="text-gray-400 text-lg">
              Automatically detect your country based on your IP address
            </p>
          </div>

          {/* Detected IP Section */}
          {loading ? (
            <div className="bg-midasbuy-navy/50 backdrop-blur-sm border border-midasbuy-blue/20 rounded-2xl p-8 mb-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-midasbuy-blue mx-auto mb-4"></div>
              <p className="text-gray-400">Detecting your location...</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-midasbuy-navy/80 to-midasbuy-darkBlue/80 backdrop-blur-sm border border-midasbuy-blue/30 rounded-2xl p-8 mb-8 shadow-2xl">
              <div className="flex flex-col items-center gap-6">
                {detectedCountry && (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-7xl select-none" role="img" aria-label={detectedCountry.name}>
                      {getFlag(detectedCountry.code)}
                    </span>
                    <h2 className="text-3xl font-bold text-white">{detectedCountry.name}</h2>
                    <div className="flex items-center gap-2 text-midasbuy-gold">
                      <span className="text-lg font-semibold">{detectedCountry.currency}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{detectedCountry.region}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 bg-midasbuy-darkBlue/50 px-6 py-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-midasbuy-blue" />
                  <span className="text-gray-300">Your IP: <span className="text-white font-semibold">{ipAddress}</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Browse Countries Section */}
          <div className="bg-midasbuy-navy/50 backdrop-blur-sm border border-midasbuy-blue/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Flag className="w-6 h-6 text-midasbuy-blue" />
                Browse All Countries
              </h2>
              <button
                onClick={() => setShowAllCountries(!showAllCountries)}
                className="flex items-center gap-2 px-4 py-2 bg-midasbuy-blue/20 hover:bg-midasbuy-blue/30 rounded-lg transition-colors"
              >
                {showAllCountries ? 'Hide' : 'Show'} Countries
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllCountries ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showAllCountries && (
              <>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries, regions, or currencies..."
                    className="w-full bg-midasbuy-darkBlue/70 text-white border border-midasbuy-blue/30 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-midasbuy-blue transition-colors"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Countries List */}
                <div className="max-h-[600px] overflow-y-auto space-y-6 pr-2">
                  {Object.entries(groupedCountries).map(([region, countriesList]) => (
                    <div key={region}>
                      <h3 className="text-lg font-semibold text-midasbuy-gold mb-3 sticky top-0 bg-midasbuy-navy/90 backdrop-blur-sm py-2 px-3 rounded-lg">
                        {region}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {countriesList.map((country) => (
                          <div
                            key={country.code}
                            className="flex items-center gap-3 p-3 bg-midasbuy-darkBlue/40 hover:bg-midasbuy-darkBlue/60 rounded-lg transition-colors cursor-pointer group"
                          >
                            <span className="text-2xl select-none" role="img" aria-label={country.name}>
                              {getFlag(country.code)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate group-hover:text-midasbuy-blue transition-colors">
                                {country.name}
                              </p>
                              <p className="text-xs text-gray-400">{country.currency}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {filteredCountries.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No countries found matching "{searchQuery}"
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-midasbuy-blue/20">
                  <p className="text-center text-gray-400 text-sm">
                    Total Countries: <span className="text-white font-semibold">{countries.length}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default IPDetectorPage;
