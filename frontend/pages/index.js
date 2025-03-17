import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import Navigation from "../components/Navigation";

// Sample data for countries, states, and cities (real data can be loaded dynamically)
const countryData = {
  Belgium: { "Flanders": ["Antwerp", "Ghent", "Bruges", "Leuven", "Other"], "Wallonia": ["Liège", "Namur", "Mons", "Other"] },
  Netherlands: { "North Holland": ["Amsterdam", "Haarlem", "Other"], "South Holland": ["Rotterdam", "The Hague", "Other"] },
  Germany: { "Bavaria": ["Munich", "Nuremberg", "Other"], "NRW": ["Cologne", "Düsseldorf", "Other"] },
  India: { "Andaman and Nicobar Islands": ["Port Blair", "Other"], "Andhra Pradesh": ["Amravati", "Nellore", "Vijaywada", "Vishakhapatnam", "Kadapa", "Other"], "Arunachal Pradesh": ["Itanagar"], "Assam": ["Dispur", "Guwahati", "Other"], "Bihar": ["Ara", "Barauni", "Begusarai", "Bhagalpur", "Buxar", "Darbhanga", "Hajipur", "Jamalpur", "Muzaffarpur", "Patna", "Other"], "Chandigarh": ["Chandigarh", "Other"], "Chhattisgarh": ["Ambikapur", "Bhilai", "Bilaspur", "Dhamtari", "Durg", "Jagdalpur", "Raipur", "Rajnandgaon", "Other"], "Daman and Diu": ["Daman", "Diu", "Other"], "Delhi": ["Delhi", "New Delhi", "Other"], "Goa": ["Panaji", "Other"], "Gujarat": ["Ahmadabad", "Amreli", "Bharuch", "Bhavnagar", "Bhuj", "Dwarka", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh", "Kandla", "Khambhat", "Kheda", "Morbi", "Palanpur", "Porbandar", "Rajkot", "Surat", "Surendranagar", "Valsad", "Veraval", "Other"], "Haryana": ["Ambala", "Gurugram", "Hisar", "Karnal", "Panipat", "Rohtak", "Other"], "Himachal Pradesh": ["Shimla", "Other"], "Jammu and Kashmir": ["Jammu", "Srinagar", "Other"], "Jharkhand": ["Jamshedpur", "Ranchi", "Other"], "Karnataka": ["Bengaluru", "Mysuru", "Other"], "Kerala": ["Kochi", "Thiruvananthapuram", "Other"], "Ladakh": ["Leh", "Other"], "Madhya Pradesh": ["Bhopal", "Gwalior", "Indore", "Other"], "Maharashtra": ["Aurangabad", "Kolhapur", "Mumbai", "Nagpur", "Nashik", "Pune", "Thane", "Other"], "Manipur": ["Imphal", "Other"], "Meghalaya": ["Shillong", "Other"], "Mizoram": ["Aizawl", "Other"], "Nagaland": ["Kohima", "Other"], "Odisha": ["Bhubaneshwar", "Cuttack", "Puri", "Other"], "Puducherry": ["Puducherry", "Other"], "Punjab": ["Amritsar", "Bathinda", "Chandigarh", "Faridkot", "Firozpur", "Gurdaspur", "Ludhiana", "Patiala", "Other"], "Rajasthan": ["Ajmer", "Alwar", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Churu", "Dholpur", "Jaipur", "Jaisalmer", "Jhalawar", "Jodhpur", "Kota", "Sawai Madhopur", "Sikar", "Udaipur", "Other"], "Sikkim": ["Gangtok", "Other"], "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Vellore", "Other"], "Telangana": ["Hyderabad", "Karimnagar", "Nizamabad", "Other"], "Tripura": ["Agartala", "Other"], "Uttar Pradesh": ["Agra", "Jhansi", "Kanpur", "Lucknow", "Mathura", "Prayagraj", "Rampur", "Varanasi", "Other"], "Uttarakhand": ["Dehra Dun", "Mussoorie", "Other"], "West Bengal": ["Darjeeling", "Kolkata", "Siliguri", "Other"] },
  France: { "Île-de-France": ["Paris", "Versailles", "Other"], "Provence": ["Marseille", "Nice", "Other"] },
  Italy: { "Lazio": ["Rome", "Other"], "Lombardy": ["Milan", "Other"] }
};

// Popular Indian cities for the simplified Major Cities section
const popularIndianCities = [
  "New Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune"
];

const jobCategories = [
  "Accounting/Tax Prep",
  "Administrative/Clerical",
  "Healthcare",
  "Transportation",
  "Non-Profit",
  "Volunteer"
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [showCustomCity, setShowCustomCity] = useState(false);

  // Handle Country Change
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState("");
    setSelectedCity("");
    setShowCustomCity(false);
  };

  // Handle State Change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity("");
    setShowCustomCity(false);
  };

  // Handle City Change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    if (e.target.value === "Other") {
      setShowCustomCity(true);
    } else {
      setShowCustomCity(false);
    }
  };

  const handleSearchClick = () => {
    if (selectedCity) {
      window.location.href = `/jobs?location=${encodeURIComponent(selectedCity)}`;
    }
  };

  return (
    <div>
      {/* Header Section - Fixed to center align the title and description */}
      <header style={{ backgroundColor: "#e6e4e0", color: "#2c2c2c", padding: "24px 0 0", marginBottom: "40px", textAlign: "center" }}>
        <div className="container mx-auto flex justify-center items-center flex-col">
          <h1 className="text-3xl font-medium mb-2">Senior Jobs</h1>
          <p style={{
            fontSize: "1.125rem",
            marginTop: "4px",
            textAlign: "center",
            marginBottom: "16px"
          }}>
            Welcome to Senior Jobs, a platform for senior citizens and retirees to find employment opportunities
            that value your experience and wisdom.
          </p>
          <Navigation />
        </div>
      </header>

      {/* Vector Illustration */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto 40px", 
        textAlign: "center" 
      }}>
        <img 
          src="/illustration.svg" 
          alt="Senior Jobs Illustration" 
            width={1000} 
            height={300} 
            style={{ maxWidth: "100%", height: "auto" }} // Maintain responsiveness
        />
      </div>

      {/* Search by Location Section */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto 40px",
        padding: "32px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #eae7e0"
      }}>
        <h2 style={{ 
          fontSize: "24px",
          fontWeight: "500",
          marginBottom: "24px",
          textAlign: "center",
          color: "#594e45"
        }}>Find Jobs by Location</h2>
        
        <div className="flex justify-center gap-4 items-center flex-wrap">
          {/* Country Dropdown */}
          <select style={{
            width: "200px",
            height: "50px",
            padding: "12px 16px",
            border: "1px solid #eae7e0",
            borderRadius: "6px",
            fontSize: "18px",
            cursor: "pointer",
            marginRight: "8px",
            backgroundColor: "#fff"
          }} value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {Object.keys(countryData).map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          
          {/* State Dropdown */}
          <select style={{
            width: "200px",
            height: "50px",
            padding: "12px 16px",
            border: "1px solid #eae7e0",
            borderRadius: "6px",
            fontSize: "18px",
            cursor: "pointer",
            marginRight: "8px",
            backgroundColor: "#fff"
          }} value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            <option value="">Select State/Region</option>
            {selectedCountry && Object.keys(countryData[selectedCountry]).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {/* City Dropdown */}
          <select style={{
            width: "200px",
            height: "50px",
            padding: "12px 16px",
            border: "1px solid #eae7e0",
            borderRadius: "6px",
            fontSize: "18px",
            cursor: "pointer",
            marginRight: "8px",
            backgroundColor: "#fff"
          }} value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
            <option value="">Select City</option>
            {selectedState && countryData[selectedCountry][selectedState].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          {/* Search Button */}
          <button
            style={{
              backgroundColor: selectedCity ? "#007fff" : "#eae7e0",
              color: selectedCity ? "white" : "#594e45",
              width: "200px",
              height: "50px",
              padding: "12px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: selectedCity ? "pointer" : "not-allowed",
              fontSize: "18px",
              transition: "background-color 0.3s"
            }}
            onClick={handleSearchClick}
            disabled={!selectedCity}
          >
            Search
          </button>
        </div>

        {/* Custom City Input (Appears when 'Other' is selected) */}
        {showCustomCity && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <input
              type="text"
              style={{
                padding: "12px 16px",
                border: "1px solid #eae7e0",
                borderRadius: "6px",
                fontSize: "18px",
                width: "400px",
                maxWidth: "100%"
              }}
              placeholder="Enter city name"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Major Cities Section - Simplified to a horizontal row of Indian cities */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto 60px",
        padding: "30px 24px",
        backgroundColor: "#f8f6f3",
        borderRadius: "8px"
      }}>
        <h2 style={{ 
          fontSize: "24px",
          fontWeight: "500",
          marginBottom: "24px",
          textAlign: "center",
          color: "#594e45"
        }}>Find Jobs in Popular Indian Cities</h2>
        
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center"
        }}>
          {popularIndianCities.map((city) => (
            <Link 
              key={city} 
              href={`/jobs?location=${encodeURIComponent(city)}`}
              style={{
                textDecoration: "none"
              }}
            >
              <div style={{
                padding: "15px 25px",
                backgroundColor: "#fff",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "18px",
                color: "#594e45",
                transition: "all 0.2s ease",
                cursor: "pointer",
                border: "1px solid #eae7e0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#007fff";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#594e45";
              }}
              >
                {city}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Job Categories Section */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto 60px",
        padding: "32px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #eae7e0"
      }}>
        <h2 style={{ 
          fontSize: "24px",
          fontWeight: "500",
          marginBottom: "24px",
          textAlign: "center",
          color: "#594e45"
        }}>Find Jobs by Category</h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px"
        }}>
          {jobCategories.map((category) => (
            <Link 
              key={category} 
              href={`/jobs?category=${encodeURIComponent(category)}`}
              style={{
                textDecoration: "none"
              }}
            >
              <div style={{
                padding: "20px",
                backgroundColor: "#eae7e0",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "18px",
                color: "#594e45",
                transition: "all 0.2s ease",
                cursor: "pointer",
                border: "1px solid transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ddd7cc";
                e.currentTarget.style.borderColor = "#c8c0b3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#eae7e0";
                e.currentTarget.style.borderColor = "transparent";
              }}
              >
                {category}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#f3f0e8", 
        color: "#2c2c2c", 
        padding: "24px 0", 
        marginTop: "40px" 
        }}>
        <div className="container mx-auto px-6">
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            {/* Company Information */}
            <div style={{ flex: "1", minWidth: "280px" }}>
            <h2 className="text-xl font-medium mb-4">Contact Us</h2>
              <h3 className="text-lg font-medium mb-2">Senior Jobs</h3>
              <p style={{ fontSize: "16px", lineHeight: "1.4" }}>Connecting experience with opportunity</p>
              <p style={{ fontSize: "16px", marginTop: "8px" }}>Phone: +91 1234567890</p>
              <p style={{ fontSize: "16px" }}>Email: example@seniorjobs.com</p>
            </div>

            {/* Social Media */}
            <div style={{ flex: "1", minWidth: "280px" }}>
              <h3 className="text-lg font-medium mb-2">Follow Us</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>📘 Facebook</span>
                <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>🐦 Twitter</span>
                <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>📷 Instagram</span>
                <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>🔗 LinkedIn</span>
              </div>
            </div>
          </div>
          
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", opacity: "0.8" }}>© 2025 Senior Jobs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}