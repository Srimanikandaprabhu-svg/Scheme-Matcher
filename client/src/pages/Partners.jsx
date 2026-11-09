import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PartnerMap from '../components/PartnerMap.jsx';

const Partners = () => {
  const location = useLocation();
  const initialScheme = location.state?.schemeCode || '';

  const [searchMode, setSearchMode] = useState('pincode'); // 'pincode' | 'state'
  const [pincode, setPincode] = useState('560001'); // Sample initial PIN (Bengaluru GPO)
  const [pinInfo, setPinInfo] = useState(null);

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [partnerType, setPartnerType] = useState('');
  const [npaFilter, setNpaFilter] = useState('');
  const [radius, setRadius] = useState('50');

  const [partners, setPartners] = useState([]);
  const [unmappedPartners, setUnmappedPartners] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchMeta, setSearchMeta] = useState(null);
  const [activeView, setActiveView] = useState('map'); // 'map' | 'list'

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStates(data);
      })
      .catch(() => {});
  }, []);

  const searchPartners = () => {
    setLoading(true);

    if (searchMode === 'pincode' && pincode.trim().length === 6) {
      const url = `/api/partners/nearby?pincode=${pincode.trim()}&radius=${radius}${initialScheme ? `&scheme=${initialScheme}` : ''}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setSearchMeta(data);
          let results = data.results || [];
          if (partnerType) {
            results = results.filter((p) => p.type === partnerType);
          }
          if (npaFilter) {
            results = results.filter((p) => p.status?.npa_level === npaFilter);
          }
          setPartners(results);
          setUnmappedPartners(data.unmapped_state_partners || []);

          if (data.pin_meta) {
            setPinInfo(data.pin_meta);
            setUserCoords({
              lat: data.pin_meta.latitude,
              lng: data.pin_meta.longitude,
              source: `PIN ${data.pin_meta.pincode} (${data.pin_meta.district}, ${data.pin_meta.state})`,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      let url = `/api/partners?limit=200`;
      if (selectedState) url += `&state_id=${selectedState}`;
      if (partnerType) url += `&type_id=${partnerType}`;
      if (npaFilter) url += `&npa_level=${npaFilter}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setSearchMeta(null);
          setPartners(data.with_coordinates || []);
          setUnmappedPartners(data.without_coordinates || []);
          setUserCoords(null);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    searchPartners();
  }, [searchMode, selectedState, partnerType, npaFilter, radius]);

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    searchPartners();
  };

  return (
    <div className="container">
      <div className="card">
        <div className="results-header">
          <div>
            <h2>📍 NSFDC Channel Partners & Branch Locator</h2>
            <p className="subtitle" style={{ margin: 0 }}>
              Search accredited State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks.
            </p>
          </div>
          <div className="tab-buttons">
            <button
              type="button"
              className={activeView === 'map' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setActiveView('map')}
            >
              🗺️ Map View
            </button>
            <button
              type="button"
              className={activeView === 'list' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setActiveView('list')}
            >
              📋 Directory List
            </button>
          </div>
        </div>

        {initialScheme && (
          <div className="alert alert-info mt-sm">
            Filtering authorized channel partners for scheme: <strong>{initialScheme}</strong>
          </div>
        )}

        {/* Search Mode Controls */}
        <div className="filters-card mt-md" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div className="tab-buttons mb-sm">
            <button
              type="button"
              className={searchMode === 'pincode' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setSearchMode('pincode')}
            >
              📮 Search by Postal PIN Code
            </button>
            <button
              type="button"
              className={searchMode === 'state' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setSearchMode('state')}
            >
              🏛️ Search by State / District
            </button>
          </div>

          {searchMode === 'pincode' ? (
            <form onSubmit={handlePincodeSubmit} className="grid-3 mt-sm">
              <div className="form-group">
                <label htmlFor="pincodeInput">6-Digit PIN Code:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="pincodeInput"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 560001, 600001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button type="submit" className="btn-primary btn-sm">
                    Search
                  </button>
                </div>
                {pinInfo && (
                  <span className="helper-text" style={{ color: '#2e7d32' }}>
                    ✓ {pinInfo.district}, {pinInfo.state} (Centroid: {pinInfo.latitude?.toFixed(2)}, {pinInfo.longitude?.toFixed(2)})
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="radiusSelect">Proximity Radius (km):</label>
                <select
                  id="radiusSelect"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                >
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km (Standard)</option>
                  <option value="100">Within 100 km</option>
                  <option value="250">Within 250 km (Regional)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="partnerTypeSelect">Partner Category:</label>
                <select
                  id="partnerTypeSelect"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                >
                  <option value="">All Institutional Categories</option>
                  <option value="SCA">State Channelising Agency (SCA)</option>
                  <option value="PSB">Public Sector Bank (PSB)</option>
                  <option value="RRB">Regional Rural Bank (RRB)</option>
                  <option value="NBFC-MFI">Microfinance (NBFC-MFI)</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="grid-3 mt-sm">
              <div className="form-group">
                <label htmlFor="stateSelect">Select State / UT:</label>
                <select
                  id="stateSelect"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States and UTs</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="typeSelect">Partner Category:</label>
                <select
                  id="typeSelect"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="1">State Channelising Agency (SCA)</option>
                  <option value="2">Public Sector Bank (PSB)</option>
                  <option value="3">Regional Rural Bank (RRB)</option>
                  <option value="4">NBFC-MFI</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="npaSelect">Performance Status:</label>
                <select
                  id="npaSelect"
                  value={npaFilter}
                  onChange={(e) => setNpaFilter(e.target.value)}
                >
                  <option value="">All Availability Statuses</option>
                  <option value="LOW">Low NPA (Highly Active)</option>
                  <option value="MEDIUM">Medium NPA</option>
                  <option value="HIGH">High Overdue</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Automatic Radius Expansion Alert */}
        {searchMeta?.expanded && (
          <div className="alert alert-warning mt-md">
            ⚠️ No partner found within your original {searchMeta.original_radius_km} km radius. Automatically expanded search radius to <strong>{searchMeta.searched_radius_km} km</strong> to locate nearest authorized branches.
          </div>
        )}

        {/* Interactive Map View */}
        {activeView === 'map' && (
          <div className="mt-lg">
            <PartnerMap
              partners={partners}
              userLocation={userCoords}
              selectedRadius={searchMode === 'pincode' ? radius : null}
            />
          </div>
        )}

        {/* Mapped Partners List */}
        <div className="section mt-xl">
          <h3>
            📍 Accredited Channel Partners with Mapped Locality ({partners.length})
          </h3>

          {loading ? (
            <p className="mt-sm">Loading partners...</p>
          ) : partners.length === 0 ? (
            <div className="alert alert-warning mt-sm">
              No channel partners found matching the active filters.
            </div>
          ) : (
            <div className="schemes-grid mt-md">
              {partners.map((p) => (
                <div key={p.id} className="scheme-card">
                  <div className="scheme-card-header">
                    <div>
                      <h4>{p.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>Code: {p.code || 'SCA'}</span>
                    </div>
                    <span className="badge badge-accent">{p.type}</span>
                  </div>

                  <div className="scheme-details">
                    <div className="detail-row">
                      <span>Address / State:</span>
                      <strong>{p.address || p.state}</strong>
                    </div>
                    {p.distance_km != null && (
                      <div className="detail-row">
                        <span>Distance from PIN:</span>
                        <strong className="text-primary">{p.distance_km} km away</strong>
                      </div>
                    )}
                    {p.status && (
                      <div className="detail-row">
                        <span>Disbursement Status:</span>
                        <span style={{ fontSize: '0.85rem' }}>
                          NPA: <strong>{p.status.npa_level}</strong> | Util: <strong>{p.status.fund_utilisation_pct}%</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {p.status?.is_simulated && (
                    <div style={{ fontSize: '0.75rem', color: '#c62828', marginTop: '8px', fontStyle: 'italic' }}>
                      * {p.status.disclaimer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unmapped Fallback List */}
        {unmappedPartners.length > 0 && (
          <div className="section mt-xl">
            <h3>🏢 Additional State Partners (Office Directory Records)</h3>
            <p className="subtitle" style={{ margin: '4px 0 12px 0' }}>
              These authorized institutions are active in your state. Their exact coordinates are not mapped on the visual canvas, but applications can be submitted to their registered administrative offices.
            </p>

            <div className="schemes-grid">
              {unmappedPartners.map((u) => (
                <div key={u.id} className="scheme-card" style={{ background: '#f8fafc' }}>
                  <div className="scheme-card-header">
                    <h4>{u.name}</h4>
                    <span className="badge badge-secondary">{u.type}</span>
                  </div>
                  <div className="scheme-details">
                    <div className="detail-row">
                      <span>State:</span>
                      <strong>{u.state || u.state_name}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Address:</span>
                      <span style={{ fontSize: '0.85rem' }}>{u.address || 'District Nodal Office'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;
