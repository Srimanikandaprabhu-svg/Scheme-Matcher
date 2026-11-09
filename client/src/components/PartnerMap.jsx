import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default leaflet marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PartnerMap = ({ partners = [], userLocation = null, selectedRadius = 50 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered on India (default ~20.5937, 78.9629)
      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles with full attribution
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const bounds = [];

    // Add user marker if provided
    if (userLocation && userLocation.lat && userLocation.lng) {
      const uLat = Number(userLocation.lat);
      const uLng = Number(userLocation.lng);

      if (!isNaN(uLat) && !isNaN(uLng)) {
        bounds.push([uLat, uLng]);

        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="background:#d32f2f;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        const userMarker = L.marker([uLat, uLng], { icon: userIcon }).addTo(markersLayer);
        userMarker.bindPopup(`
          <div style="font-family:sans-serif;font-size:13px;line-height:1.4;">
            <strong style="color:#d32f2f;">Your Selected Location</strong>
            <p style="margin:4px 0 0 0;color:#666;">Source: ${userLocation.source || 'PIN code / Coordinates'}</p>
          </div>
        `);

        // Radius circle
        if (selectedRadius) {
          L.circle([uLat, uLng], {
            radius: Number(selectedRadius) * 1000,
            color: '#1565c0',
            fillColor: '#1565c0',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 4',
          }).addTo(markersLayer);
        }
      }
    }

    // Add partner markers
    partners.forEach((p) => {
      if (p.latitude && p.longitude) {
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.push([lat, lng]);

          const typeColor =
            p.type === 'SCA' ? '#1565c0' : p.type === 'PSB' ? '#2e7d32' : p.type === 'RRB' ? '#e65100' : '#6a1b9a';

          const partnerIcon = L.divIcon({
            className: 'custom-partner-marker',
            html: `<div style="background:${typeColor};color:#fff;padding:2px 6px;border-radius:12px;font-size:11px;font-weight:700;border:1.5px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.3);white-space:nowrap;">${p.type || 'BANK'}</div>`,
            iconSize: [40, 20],
            iconAnchor: [20, 10],
          });

          const marker = L.marker([lat, lng], { icon: partnerIcon }).addTo(markersLayer);

          const popupContent = `
            <div style="font-family:sans-serif;font-size:13px;max-width:240px;line-height:1.4;">
              <strong style="color:#0d47a1;font-size:14px;">${p.name}</strong>
              <div style="margin:4px 0;display:inline-block;padding:2px 6px;background:#e3f2fd;color:#0d47a1;border-radius:4px;font-size:11px;font-weight:600;">
                ${p.type || 'Channel Partner'}
              </div>
              <p style="margin:4px 0;color:#444;">${p.address || p.state || ''}</p>
              ${p.distance_km != null ? `<p style="margin:4px 0;font-weight:700;color:#2e7d32;">📍 ${p.distance_km} km away</p>` : ''}
              ${
                p.status
                  ? `<div style="background:#fff3e0;padding:6px;border-radius:4px;margin-top:6px;border:1px solid #ffe082;font-size:11px;">
                      <div><strong>NPA Level:</strong> ${p.status.npa_level} | <strong>Fund Util:</strong> ${p.status.fund_utilisation_pct}%</div>
                      <div style="color:#c62828;margin-top:2px;font-style:italic;">* ${p.status.disclaimer}</div>
                    </div>`
                  : ''
              }
            </div>
          `;
          marker.bindPopup(popupContent);
        }
      }
    });

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 11);
      } else {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }
    }
  }, [partners, userLocation, selectedRadius]);

  return (
    <div className="map-wrapper" style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '420px', minHeight: '350px' }} />
      <div
        className="map-attribution-note"
        style={{
          fontSize: '11px',
          color: '#666',
          padding: '4px 8px',
          background: '#f9f9f9',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'right',
        }}
      >
        Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Locality-level centroids
      </div>
    </div>
  );
};

export default PartnerMap;
