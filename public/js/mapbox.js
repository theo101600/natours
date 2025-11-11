/* eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidGhlbzEwMTYwMCIsImEiOiJjbWh0dzFtMXIwZXI5MmxzZGNkdTJkc3BuIn0.6YhUTyTt7RABYmbQUg65KQ";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/theo101600/cmhtx8xat00bj01subv019iyo", // style URL
    scrollZoom: false,
    // automatically position the map based on the location points of the tour
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.dat}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
