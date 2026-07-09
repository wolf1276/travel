// Custom Google Maps JSON styling tuned to the app's warm, editorial "coquette
// scrapbook" palette — hides default POI/business clutter so pins stay the
// visual focus, and keeps land/water tones close to the cream + rose theme.
export const romanticMapStyleLight: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#fdf3ee' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7a6355' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fffdf9' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f8e2df' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f6d9d9' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f0c9cd' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#e8c7c2' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#dba9a9' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#f6ece2' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e3c9d6' }] },
];

export const romanticMapStyleDark: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#241a1c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#d9bfc2' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1315' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3a2529' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4a2c30' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#4a3236' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#2c2022' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#2a1c22' }] },
];
