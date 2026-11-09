import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Partners = () => {
  const location = useLocation();
  const initialScheme = location.state?.schemeCode || '';

  const [partners, setPartners] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [loading, setLoading] = useState(false);

  // Nearby geo search state
  const [useGeo, setUseGeo] = useState(false);
  const [lat, setLat] = useState('12.9716'); // Bengaluru sample default
  const [lng, setLng] = useState('77.5946');
  const [radius, setRadius] = useState('100');

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStates(data);
      })
      .catch(() => {});
  }, []);

  const fetchPartners = () => {
    setLoading(true);
    let url = '/api/partners?limit=100';

    if (useGeo) {
      url = `/api/partners/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
      if (initialScheme) url += `&scheme=${initialScheme}`;
    } else {
      if (selectedState) url += `&state_id=${selectedState}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          let list = data;
          if (partnerType && !useGeo) {
            list = list.filter((p) => p.type === partnerType);
          }
          setPartners(list);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partners:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPartners();
  }, [selectedState, partnerType, useGeo]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
          setUseGeo(true);
        },
        (err) => {
          alert('Unable to retrieve location: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📍 NSFDC Channel Partners Directory</h2>
        <p className="subtitle">
          Find authorized State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks where you can submit loan applications.
        </p>

        {initialScheme && (
          <div className="alert alert-info mt-sm">
            Showing channel partners for scheme: <strong>{initialScheme}</strong>
          </div>
        )}

        <div className="filters-card mt-md">
          <div className="tab-buttons">
            <button
              type="button"
              className={!useGeo ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setUseGeo(false)}
            >
              Filter by State & Type
            </button>
            <button
              type="button"
              className={useGeo ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setUseGeo(true)}
            >
              Search by Proximity / GPS
            </button>
          </div>

          {!useGeo ? (
            <div className="grid-2 mt-md">
              <div className="form-group">
                <label htmlFor="pState">Filter by State:</label>
                <select
                  id="pState"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States / UTs</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pType">Agency Type:</label>
                <select
                  id="pType"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="SCA">State Channelising Agency (SCA)</option>
                  <option value="PSB">Public Sector Bank (PSB)</option>
                  <option value="RRB">Regional Rural Bank (RRB)</option>
                  <option value="NBFC-MFI">NBFC - Microfinance</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="proximity-search mt-md">
              <div className="grid-3">
                <div className="form-group">
                  <label htmlFor="pLat">Latitude:</label>
                  <input
                    id="pLat"
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pLng">Longitude:</label>
                  <input
                    id="pLng"
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pRadius">Radius (km):</label>
                  <input
                    id="pRadius"
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-sm">
                <button type="button" className="btn-secondary btn-sm" onClick={handleGetLocation}>
                  📡 Use My Current Location
                </button>{' '}
                <button type="button" className="btn-primary btn-sm" onClick={fetchPartners}>
                  🔍 Search Nearby
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Partners Results Grid */}
        <div className="partners-list mt-lg">
          {loading ? (
            <p>Searching partners...</p>
          ) : partners.length === 0 ? (
            <div className="alert alert-warning">
              No channel partners found for the selected criteria.
            </div>
          ) : (
            <div className="schemes-grid">
              {partners.map((p) => (
                <div key={p.id} className="scheme-card">
                  <div className="scheme-card-header">
                    <h4>{p.name}</h4>
                    <span className="badge badge-accent">{p.type}</span>
                  </div>
                  <div className="scheme-details">
                    <div className="detail-row">
                      <span>State:</span>
                      <strong>{p.state_name || 'All India'}</strong>
                    </div>
                    {p.distance_km != null && (
                      <div className="detail-row">
                        <span>Distance:</span>
                        <strong className="text-primary">{p.distance_km} km away</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;
