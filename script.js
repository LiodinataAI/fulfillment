// script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ========= 0. VAR GLOBAL ========= */
  let currentSearchMarker = null;      // simpan marker terakhir

const clusters = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50
});

let sitesLayer = null;
const toggleSites = document.getElementById("toggle-sites");
toggleSites.addEventListener("change", () => {
  if (!sitesLayer) return;            // belum selesai load
  if (toggleSites.checked) {
    clusters.addLayer(sitesLayer);    // tampilkan
  } else {
    clusters.removeLayer(sitesLayer); // sembunyikan
  }
});

  /* ========= 1. SIDEBAR ========= */
  const sidebarBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  sidebarBtn.addEventListener("click", () =>
    sidebar.classList.toggle("-translate-x-full")
  );

  /* ========= 2. USER DROPDOWN ========= */
  const userBtn = document.getElementById("user-menu");
  const userDropdown = document.getElementById("user-dropdown");
  userBtn.addEventListener("click", () =>
    userDropdown.classList.toggle("hidden")
  );
  window.addEventListener("click", (e) => {
    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
  });

  /* ========= 3. LEAFLET MAP ========= */
  const map = L.map("map").setView([-0.0263, 109.3426], 10); // Pontianak
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
  }).addTo(map);

  /* ========= 4. CONTOH MARKER & KABEL LAUT ========= */
  L.marker([-0.0263, 109.3426]).addTo(map).bindPopup("Pontianak").openPopup();

  const kabelLaut = L.polyline(
    
    { color: "blue", weight: 4, opacity: 0.6, dashArray: "6, 6" }
  )
    .addTo(map)
    .bindPopup("Kabel Laut: Pontianak - Palembang");

  /* ========= 5. CLUSTER SITES GEOJSON ========= */
fetch("sites4.geojson")
  .then(r => r.json())
  .then(data => {
    // ── SIMPAN layer di variabel global sitesLayer ──
    sitesLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
             const props = feature.properties;
      const popup = `
        <strong>${props["Site ID"] || "Tanpa ID"}</strong><br/>
        Site Name: ${props["Site Name"] || "-"}<br/>
        IP: ${props["Ip Adress"] || "-"}<br/>
        Distric: ${props["Dept"] || "-"}<br/>
        Tipe: ${props["Type"] || "-"}<br/>
        Uplink: ${props["Uplink"] || "-"}<br/>
        Port: ${props["Slot Port"] || "-"}
      `;
       return L.marker(latlng).bindPopup(popup);
        }
    });
     clusters.addLayer(sitesLayer);
      map.addLayer(clusters);
      map.fitBounds(clusters.getBounds());
    // ── Masukkan ke klaster ──
    clusters.addLayer(sitesLayer);
    map.addLayer(clusters);

    // map.fitBounds(clusters.getBounds()); // opsional zoom ke semua titik
  })
  .catch(err => console.error("Gagal memuat GeoJSON:", err));
  console.log("Jumlah titik:", sitesLayer.getLayers().length);



  /* ========= 6. SEARCH BAR ========= */
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");

  button.addEventListener("click", () => {
    const value = input.value.trim();
    const [latStr, lngStr] = value.split(",");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (!isNaN(lat) && !isNaN(lng)) {
      // hapus marker sebelumnya
      if (currentSearchMarker) map.removeLayer(currentSearchMarker);

      // buat marker baru
      currentSearchMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lokasi: ${lat}, ${lng}`)
        .openPopup();

      map.setView([lat, lng], 13);
    } else {
      alert("Koordinat tidak valid. Gunakan format: lat,lng");
    }
  });
});
