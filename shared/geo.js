// Utility functions for geographic calculations.
// Currently only provides a Haversine distance calculator.
// The function returns the great‑circle distance between two points
// on the Earth in kilometres.

/**
 * Convert degrees to radians.
 * @param {number} deg
 * @returns {number}
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate the Haversine distance between two latitude/longitude pairs.
 *
 * @param {number} lat1 Latitude of point 1 in decimal degrees.
 * @param {number} lng1 Longitude of point 1 in decimal degrees.
 * @param {number} lat2 Latitude of point 2 in decimal degrees.
 * @param {number} lng2 Longitude of point 2 in decimal degrees.
 * @returns {number} Distance in kilometres.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Export a default object for convenience if needed.
export default { haversine };
