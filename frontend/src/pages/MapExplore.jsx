import React, { useEffect, useRef, useState, useCallback } from 'react';
import vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

const VIETMAP_API_KEY = '187d7f3c931b5d46a6f1b5b72992c64c24c29e0137b80e4e';
const HANOI_CENTER = [105.8342, 21.0278];

// Các địa điểm nổi tiếng Hà Nội
const HANOI_LANDMARKS = [
  {
    id: 1,
    name: 'Hồ Hoàn Kiếm',
    coords: [105.8529, 21.0288],
    category: 'landmark',
    emoji: '🏛️',
    description: 'Biểu tượng trung tâm Hà Nội, nơi giao thoa lịch sử và đời sống.',
    tips: 'Đẹp nhất vào buổi sáng sớm và chiều tối cuối tuần.',
  },
  {
    id: 2,
    name: 'Văn Miếu - Quốc Tử Giám',
    coords: [105.8355, 21.0275],
    category: 'landmark',
    emoji: '📜',
    description: 'Trường đại học đầu tiên của Việt Nam, biểu tượng tri thức.',
    tips: 'Vé vào cổng: 30.000 VND. Nên đến trước 9h sáng.',
  },
  {
    id: 3,
    name: 'Lăng Chủ tịch Hồ Chí Minh',
    coords: [105.8344, 21.0369],
    category: 'landmark',
    emoji: '🏛️',
    description: 'Công trình lịch sử quan trọng tại quảng trường Ba Đình.',
    tips: 'Mở cửa T3-T5 sáng. Ăn mặc lịch sự, không mang đồ điện tử.',
  },
  {
    id: 4,
    name: 'Phở Thìn Bờ Hồ',
    coords: [105.8525, 21.0310],
    category: 'food',
    emoji: '🍜',
    description: 'Quán phở bò huyền thoại ngay cạnh Hồ Gươm.',
    tips: 'Giá ~50.000 VND. Nên đến trước 8h sáng để tránh đông.',
  },
  {
    id: 5,
    name: 'Bún chả Hương Liên',
    coords: [105.8395, 21.0130],
    category: 'food',
    emoji: '🥢',
    description: 'Quán bún chả Obama từng ghé thăm năm 2016.',
    tips: 'Combo Obama: 85.000 VND. Đông nhất 11h-13h.',
  },
  {
    id: 6,
    name: 'Cà phê Giảng',
    coords: [105.8530, 21.0335],
    category: 'food',
    emoji: '☕',
    description: 'Nơi khai sinh cà phê trứng Hà Nội từ năm 1946.',
    tips: 'Cà phê trứng: 35.000 VND. Quán nhỏ, cầu thang hẹp.',
  },
  {
    id: 7,
    name: 'Phố cổ Hà Nội (36 phố phường)',
    coords: [105.8520, 21.0340],
    category: 'explore',
    emoji: '🏮',
    description: 'Khu phố cổ sầm uất với kiến trúc truyền thống.',
    tips: 'Đi bộ buổi tối T6-CN khi phố đi bộ mở cửa.',
  },
  {
    id: 8,
    name: 'Chùa Trấn Quốc',
    coords: [105.8368, 21.0480],
    category: 'landmark',
    emoji: '🛕',
    description: 'Ngôi chùa cổ nhất Hà Nội, hơn 1.500 năm tuổi.',
    tips: 'Miễn phí. Đẹp nhất lúc hoàng hôn bên Hồ Tây.',
  },
  {
    id: 9,
    name: 'Kem Tràng Tiền',
    coords: [105.8540, 21.0245],
    category: 'food',
    emoji: '🍦',
    description: 'Thương hiệu kem huyền thoại từ năm 1958.',
    tips: 'Kem que: 8.000 - 15.000 VND. Luôn đông vào mùa hè.',
  },
  {
    id: 10,
    name: 'Hoàng Thành Thăng Long',
    coords: [105.8400, 21.0355],
    category: 'landmark',
    emoji: '🏰',
    description: 'Di sản văn hóa thế giới UNESCO, trung tâm quyền lực cổ.',
    tips: 'Vé: 30.000 VND. Tour có hướng dẫn rất hay.',
  },
  {
    id: 11,
    name: 'Hồ Tây',
    coords: [105.8225, 21.0540],
    category: 'explore',
    emoji: '🌅',
    description: 'Hồ lớn nhất Hà Nội, nơi lý tưởng để dạo bộ và ngắm hoàng hôn.',
    tips: 'Thuê xe đạp đi quanh hồ ~50.000 VND/giờ.',
  },
  {
    id: 12,
    name: 'Train Street (Phố Tàu)',
    coords: [105.8470, 21.0290],
    category: 'explore',
    emoji: '🚂',
    description: 'Con phố nổi tiếng nơi tàu hỏa chạy qua sát nhà dân.',
    tips: 'Tàu chạy qua ~15h30 và ~19h hàng ngày.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', emoji: '📍' },
  { key: 'landmark', label: 'Di tích', emoji: '🏛️' },
  { key: 'food', label: 'Ẩm thực', emoji: '🍜' },
  { key: 'explore', label: 'Khám phá', emoji: '🧭' },
];

const MapExplore = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter landmarks by category
  const filteredLandmarks = HANOI_LANDMARKS.filter(
    (l) => activeCategory === 'all' || l.category === activeCategory
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new vietmapgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: 'HanoMate Map',
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors | VietMap',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: HANOI_CENTER,
      zoom: 13,
      pitch: 0,
    });

    map.addControl(new vietmapgl.NavigationControl(), 'bottom-right');
    map.addControl(
      new vietmapgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'bottom-right'
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when category changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    filteredLandmarks.forEach((place) => {
      // Custom marker element
      const el = document.createElement('div');
      el.className = 'vietmap-custom-marker';
      el.innerHTML = `<span style="
        font-size: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: rgba(15, 15, 35, 0.9);
        border: 2px solid #e94560;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">${place.emoji}</span>`;

      el.addEventListener('mouseenter', () => {
        el.firstChild.style.transform = 'scale(1.2)';
        el.firstChild.style.boxShadow = '0 6px 25px rgba(233, 69, 96, 0.6)';
      });
      el.addEventListener('mouseleave', () => {
        el.firstChild.style.transform = 'scale(1)';
        el.firstChild.style.boxShadow = '0 4px 15px rgba(233, 69, 96, 0.4)';
      });

      // Popup content
      const popup = new vietmapgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '280px',
      }).setHTML(`
        <div style="
          font-family: 'Inter', sans-serif;
          padding: 4px;
        ">
          <h3 style="
            margin: 0 0 6px;
            font-size: 1rem;
            font-weight: 700;
            color: #1a1a2e;
          ">${place.emoji} ${place.name}</h3>
          <p style="
            margin: 0 0 8px;
            font-size: 0.85rem;
            color: #555;
            line-height: 1.5;
          ">${place.description}</p>
          <div style="
            background: #f0f4ff;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 0.8rem;
            color: #0f3460;
          ">💡 <strong>Tip:</strong> ${place.tips}</div>
        </div>
      `);

      const marker = new vietmapgl.Marker({ element: el })
        .setLngLat(place.coords)
        .setPopup(popup)
        .addTo(mapRef.current);

      el.addEventListener('click', () => {
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [activeCategory, filteredLandmarks]);

  // Fly to selected place
  const flyToPlace = useCallback((place) => {
    if (!mapRef.current) return;
    setSelectedPlace(place);
    mapRef.current.flyTo({
      center: place.coords,
      zoom: 16,
      pitch: 45,
      duration: 1500,
    });
    // Open the marker popup
    const idx = filteredLandmarks.findIndex((l) => l.id === place.id);
    if (idx >= 0 && markersRef.current[idx]) {
      markersRef.current[idx].togglePopup();
    }
  }, [filteredLandmarks]);

  // Search using VietMap Geocoding API
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://maps.vietmap.vn/api/search/v3?apikey=${VIETMAP_API_KEY}&text=${encodeURIComponent(searchQuery)}&focus=21.0278,105.8342&size=5`
      );
      const data = await res.json();
      if (data && data.data) {
        setSearchResults(data.data.map((item) => ({
          name: item.display,
          coords: [item.lng, item.lat],
          description: item.address || '',
        })));
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const flyToSearchResult = useCallback((result) => {
    if (!mapRef.current) return;
    setSelectedPlace({ ...result, emoji: '📍', tips: '', category: 'search' });
    setSearchResults([]);
    setSearchQuery('');
    mapRef.current.flyTo({
      center: result.coords,
      zoom: 16,
      pitch: 45,
      duration: 1500,
    });

    // Add temporary marker
    const popup = new vietmapgl.Popup({ offset: 30 }).setHTML(`
      <div style="font-family:'Inter',sans-serif;padding:4px;">
        <h3 style="margin:0 0 4px;font-size:1rem;color:#1a1a2e;">📍 ${result.name}</h3>
        <p style="margin:0;font-size:0.85rem;color:#555;">${result.description}</p>
      </div>
    `);
    new vietmapgl.Marker({ color: '#e94560' })
      .setLngLat(result.coords)
      .setPopup(popup)
      .addTo(mapRef.current)
      .togglePopup();
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>🗺️ Khám phá Hà Nội</h2>
          <button
            style={styles.closeSidebarBtn}
            onClick={() => setSidebarOpen(false)}
            title="Đóng sidebar"
          >✕</button>
        </div>

        {/* Search */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm địa điểm..."
            style={styles.searchInput}
          />
          <button
            onClick={handleSearch}
            style={styles.searchBtn}
            disabled={isSearching}
          >
            {isSearching ? '⏳' : '🔍'}
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div style={styles.searchResults}>
            {searchResults.map((r, i) => (
              <div
                key={i}
                style={styles.searchResultItem}
                onClick={() => flyToSearchResult(r)}
              >
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <div>
                  <div style={styles.resultName}>{r.name}</div>
                  <div style={styles.resultDesc}>{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category filter */}
        <div style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                ...styles.categoryBtn,
                ...(activeCategory === cat.key ? styles.categoryBtnActive : {}),
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Places list */}
        <div style={styles.placesList}>
          {filteredLandmarks.map((place) => (
            <div
              key={place.id}
              style={{
                ...styles.placeCard,
                ...(selectedPlace?.id === place.id ? styles.placeCardActive : {}),
              }}
              onClick={() => flyToPlace(place)}
            >
              <div style={styles.placeEmoji}>{place.emoji}</div>
              <div style={styles.placeInfo}>
                <div style={styles.placeName}>{place.name}</div>
                <div style={styles.placeDesc}>{place.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle sidebar button */}
      {!sidebarOpen && (
        <button
          style={styles.openSidebarBtn}
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Danh sách
        </button>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} style={styles.mapContainer} />

      {/* Selected place detail panel */}
      {selectedPlace && (
        <div style={styles.detailPanel}>
          <button
            style={styles.detailCloseBtn}
            onClick={() => setSelectedPlace(null)}
          >✕</button>
          <div style={styles.detailEmoji}>{selectedPlace.emoji}</div>
          <h3 style={styles.detailName}>{selectedPlace.name}</h3>
          <p style={styles.detailDescription}>{selectedPlace.description}</p>
          {selectedPlace.tips && (
            <div style={styles.detailTip}>
              💡 <strong>Tip:</strong> {selectedPlace.tips}
            </div>
          )}
          <div style={styles.detailCoords}>
            📍 {selectedPlace.coords[1].toFixed(4)}, {selectedPlace.coords[0].toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 70px)',
    marginTop: '70px',
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '380px',
    height: '100%',
    background: 'rgba(15, 15, 35, 0.95)',
    backdropFilter: 'blur(16px)',
    borderRight: '1px solid rgba(233, 69, 96, 0.15)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    overflowY: 'auto',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 12px',
    borderBottom: '1px solid rgba(233, 69, 96, 0.1)',
  },
  sidebarTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #e94560, #ff6b81)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  closeSidebarBtn: {
    background: 'rgba(233, 69, 96, 0.1)',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    gap: '8px',
    padding: '16px 20px 8px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    background: '#16213e',
    color: '#eaeaea',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  },
  searchBtn: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(233, 69, 96, 0.3)',
    background: 'linear-gradient(135deg, #e94560, #c73650)',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResults: {
    padding: '4px 20px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  searchResultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: 'rgba(22, 33, 62, 0.8)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    border: '1px solid rgba(233, 69, 96, 0.1)',
  },
  resultName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#eaeaea',
  },
  resultDesc: {
    fontSize: '0.75rem',
    color: '#a0a0b0',
    marginTop: '2px',
  },
  categoryContainer: {
    display: 'flex',
    gap: '6px',
    padding: '12px 20px',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(233, 69, 96, 0.15)',
    background: 'rgba(22, 33, 62, 0.5)',
    color: '#a0a0b0',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  },
  categoryBtnActive: {
    background: 'rgba(233, 69, 96, 0.15)',
    borderColor: '#e94560',
    color: '#e94560',
  },
  placesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  placeCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    background: 'rgba(26, 26, 46, 0.6)',
    border: '1px solid rgba(233, 69, 96, 0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  placeCardActive: {
    background: 'rgba(233, 69, 96, 0.1)',
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  placeEmoji: {
    fontSize: '1.5rem',
    flexShrink: 0,
    width: '36px',
    textAlign: 'center',
  },
  placeInfo: {
    flex: 1,
    minWidth: 0,
  },
  placeName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#eaeaea',
    marginBottom: '4px',
  },
  placeDesc: {
    fontSize: '0.78rem',
    color: '#a0a0b0',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  openSidebarBtn: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: 10,
    padding: '10px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(233, 69, 96, 0.3)',
    background: 'rgba(15, 15, 35, 0.92)',
    backdropFilter: 'blur(12px)',
    color: '#eaeaea',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  detailPanel: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '320px',
    background: 'rgba(15, 15, 35, 0.95)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    borderRadius: '16px',
    padding: '20px',
    zIndex: 10,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'fadeInUp 0.3s ease forwards',
  },
  detailCloseBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(233, 69, 96, 0.1)',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    borderRadius: '8px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailEmoji: {
    fontSize: '2rem',
    marginBottom: '8px',
  },
  detailName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#eaeaea',
    marginBottom: '8px',
    margin: '0 0 8px',
  },
  detailDescription: {
    fontSize: '0.85rem',
    color: '#a0a0b0',
    lineHeight: 1.5,
    marginBottom: '12px',
    margin: '0 0 12px',
  },
  detailTip: {
    background: 'rgba(233, 69, 96, 0.08)',
    border: '1px solid rgba(233, 69, 96, 0.15)',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '0.8rem',
    color: '#eaeaea',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  detailCoords: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '4px',
  },
};

export default MapExplore;
