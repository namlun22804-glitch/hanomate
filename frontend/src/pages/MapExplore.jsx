import React, { useEffect, useRef, useState, useCallback } from 'react';
import vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

const HANOI_CENTER = [105.8342, 21.0278];

const HANOI_LANDMARKS = [
  { id: 1, name: 'Hồ Hoàn Kiếm', coords: [105.8529, 21.0288], category: 'landmark', emoji: '🏛️', description: 'Biểu tượng trung tâm Hà Nội.', tips: 'Đẹp nhất vào buổi sáng sớm và chiều tối cuối tuần.' },
  { id: 2, name: 'Văn Miếu - Quốc Tử Giám', coords: [105.8355, 21.0275], category: 'landmark', emoji: '📜', description: 'Trường đại học đầu tiên của Việt Nam.', tips: 'Vé: 30.000 VND. Nên đến trước 9h sáng.' },
  { id: 3, name: 'Lăng Chủ tịch Hồ Chí Minh', coords: [105.8344, 21.0369], category: 'landmark', emoji: '🏛️', description: 'Công trình lịch sử tại quảng trường Ba Đình.', tips: 'Mở cửa T3-T5 sáng. Ăn mặc lịch sự.' },
  { id: 4, name: 'Phở Thìn Bờ Hồ', coords: [105.8525, 21.0310], category: 'food', emoji: '🍜', description: 'Quán phở bò huyền thoại ngay cạnh Hồ Gươm.', tips: 'Giá ~50.000 VND. Đến trước 8h sáng.' },
  { id: 5, name: 'Bún chả Hương Liên', coords: [105.8395, 21.0130], category: 'food', emoji: '🥢', description: 'Quán bún chả Obama từng ghé thăm năm 2016.', tips: 'Combo Obama: 85.000 VND. Đông nhất 11h-13h.' },
  { id: 6, name: 'Cà phê Giảng', coords: [105.8530, 21.0335], category: 'food', emoji: '☕', description: 'Nơi khai sinh cà phê trứng Hà Nội từ năm 1946.', tips: 'Cà phê trứng: 35.000 VND.' },
  { id: 7, name: 'Phố cổ 36 phố phường', coords: [105.8520, 21.0340], category: 'explore', emoji: '🏮', description: 'Khu phố cổ sầm uất với kiến trúc truyền thống.', tips: 'Đi bộ buổi tối T6-CN.' },
  { id: 8, name: 'Chùa Trấn Quốc', coords: [105.8368, 21.0480], category: 'landmark', emoji: '🛕', description: 'Ngôi chùa cổ nhất Hà Nội, hơn 1.500 năm tuổi.', tips: 'Miễn phí. Đẹp lúc hoàng hôn bên Hồ Tây.' },
  { id: 9, name: 'Kem Tràng Tiền', coords: [105.8540, 21.0245], category: 'food', emoji: '🍦', description: 'Thương hiệu kem huyền thoại từ năm 1958.', tips: 'Kem que: 8.000 - 15.000 VND.' },
  { id: 10, name: 'Hoàng Thành Thăng Long', coords: [105.8400, 21.0355], category: 'landmark', emoji: '🏰', description: 'Di sản văn hóa thế giới UNESCO.', tips: 'Vé: 30.000 VND. Tour có hướng dẫn rất hay.' },
  { id: 11, name: 'Hồ Tây', coords: [105.8225, 21.0540], category: 'explore', emoji: '🌅', description: 'Hồ lớn nhất Hà Nội, lý tưởng dạo bộ ngắm hoàng hôn.', tips: 'Thuê xe đạp ~50.000 VND/giờ.' },
  { id: 12, name: 'Phố Tàu (Train Street)', coords: [105.8470, 21.0290], category: 'explore', emoji: '🚂', description: 'Phố nổi tiếng nơi tàu hỏa chạy sát nhà dân.', tips: 'Tàu qua ~15h30 và ~19h hàng ngày.' },
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
  const userMarkerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const filteredLandmarks = HANOI_LANDMARKS.filter(
    l => activeCategory === 'all' || l.category === activeCategory
  );

  // Thêm marker vị trí người dùng với vòng sóng
  const addUserMarker = useCallback((coords) => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;width:52px;height:52px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:52px;height:52px;border-radius:50%;background:rgba(212,160,23,0.2);animation:userPulse 2s ease-out infinite;"></div>
        <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(212,160,23,0.4);animation:userPulse 2s ease-out infinite 0.6s;"></div>
        <div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#D4A017,#FF8C00);border:3px solid #fff;box-shadow:0 0 16px rgba(212,160,23,0.8);position:relative;z-index:2;"></div>
      </div>`;
    const marker = new vietmapgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(coords)
      .setPopup(new vietmapgl.Popup({ offset: 32, closeButton: false }).setHTML(
        `<div style="font-family:Inter,sans-serif;padding:8px 4px;">
          <strong style="color:#1a1a2e;">📍 Vị trí của bạn</strong>
          <p style="margin:4px 0 0;font-size:.8rem;color:#555;">
            ${coords[1].toFixed(5)}°N, ${coords[0].toFixed(5)}°E
          </p>
        </div>`
      ))
      .addTo(mapRef.current);
    marker.togglePopup();
    userMarkerRef.current = marker;
  }, []);

  // ✅ FIX GPS: không dùng useCallback để tránh vòng lặp deps
  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocError('Trình duyệt không hỗ trợ GPS.');
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        setLocating(false);
        if (mapRef.current) {
          mapRef.current.flyTo({ center: coords, zoom: 15, pitch: 40, duration: 2000 });
          addUserMarker(coords);
        }
      },
      (err) => {
        setLocating(false);
        const msg = {
          1: 'Bạn đã từ chối quyền GPS. Vào Settings > Site Permissions để cho phép.',
          2: 'Không lấy được tín hiệu GPS. Vui lòng thử lại.',
          3: 'GPS timeout. Hãy thử lại.',
        };
        setLocError(msg[err.code] || 'Lỗi GPS không xác định.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Init bản đồ — deps rỗng, chỉ chạy 1 lần
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new vietmapgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: HANOI_CENTER,
      zoom: 13,
    });
    map.addControl(new vietmapgl.NavigationControl(), 'bottom-right');
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []); // ✅ KHÔNG có locateUser trong deps → không còn vòng lặp

  // Cập nhật markers khi category thay đổi
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    filteredLandmarks.forEach(place => {
      const el = document.createElement('div');
      el.innerHTML = `<span style="font-size:1.4rem;display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:rgba(8,12,28,0.9);border:2px solid rgba(212,160,23,0.75);border-radius:50%;cursor:pointer;box-shadow:0 4px 12px rgba(212,160,23,0.3);transition:transform .2s,box-shadow .2s;">${place.emoji}</span>`;
      el.addEventListener('mouseenter', () => { el.firstChild.style.transform = 'scale(1.25)'; el.firstChild.style.boxShadow = '0 6px 20px rgba(212,160,23,0.65)'; });
      el.addEventListener('mouseleave', () => { el.firstChild.style.transform = 'scale(1)'; el.firstChild.style.boxShadow = '0 4px 12px rgba(212,160,23,0.3)'; });
      const popup = new vietmapgl.Popup({ offset: 28, closeButton: true, maxWidth: '280px' }).setHTML(`
        <div style="font-family:Inter,sans-serif;padding:4px;">
          <h3 style="margin:0 0 6px;font-size:.95rem;font-weight:700;color:#1a1a2e;">${place.emoji} ${place.name}</h3>
          <p style="margin:0 0 8px;font-size:.83rem;color:#555;line-height:1.5;">${place.description}</p>
          <div style="background:#fff8e8;border-radius:8px;padding:8px;font-size:.78rem;color:#7a5000;">💡 <strong>Tip:</strong> ${place.tips}</div>
        </div>`);
      const marker = new vietmapgl.Marker({ element: el }).setLngLat(place.coords).setPopup(popup).addTo(mapRef.current);
      el.addEventListener('click', () => setSelectedPlace(place));
      markersRef.current.push(marker);
    });
  }, [activeCategory]);

  const flyToPlace = useCallback((place) => {
    if (!mapRef.current) return;
    setSelectedPlace(place);
    mapRef.current.flyTo({ center: place.coords, zoom: 16, pitch: 45, duration: 1500 });
    const idx = filteredLandmarks.findIndex(l => l.id === place.id);
    if (idx >= 0 && markersRef.current[idx]) markersRef.current[idx].togglePopup();
  }, [filteredLandmarks]);

  // ✅ FIX SEARCH: dùng Nominatim (OpenStreetMap) — không cần API key, không bị CORS
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const q = encodeURIComponent(searchQuery + ', Hà Nội, Việt Nam');
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&accept-language=vi&countrycodes=vn`;
      const res = await fetch(url, { headers: { 'User-Agent': 'HanoMate App' } });
      const data = await res.json();
      if (data.length > 0) {
        setSearchResults(data.map(d => ({
          name: d.display_name.split(',')[0],
          address: d.display_name.split(',').slice(1, 3).join(',').trim(),
          coords: [parseFloat(d.lon), parseFloat(d.lat)],
        })));
      } else {
        setSearchResults([{ name: 'Không tìm thấy địa điểm', address: 'Thử từ khóa khác', coords: null }]);
      }
    } catch {
      setSearchResults([{ name: 'Lỗi kết nối mạng', address: 'Kiểm tra internet và thử lại', coords: null }]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const flyToSearchResult = useCallback((result) => {
    if (!result.coords || !mapRef.current) return;
    setSelectedPlace({ name: result.name, description: result.address, emoji: '📍', tips: '', coords: result.coords, category: 'search' });
    setSearchResults([]);
    setSearchQuery('');
    mapRef.current.flyTo({ center: result.coords, zoom: 16, pitch: 45, duration: 1500 });
    new vietmapgl.Marker({ color: '#D4A017' })
      .setLngLat(result.coords)
      .setPopup(new vietmapgl.Popup({ offset: 28 }).setHTML(
        `<div style="font-family:Inter,sans-serif;padding:4px;"><h3 style="margin:0 0 4px;font-size:.95rem;color:#1a1a2e;">📍 ${result.name}</h3><p style="margin:0;font-size:.82rem;color:#555;">${result.address}</p></div>`
      ))
      .addTo(mapRef.current).togglePopup();
  }, []);

  // ---- Render ----
  const S = {
    sidebar: {
      position: 'absolute', top: 0, left: 0, width: 360, height: '100%',
      background: 'rgba(8,12,28,0.95)', backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(212,160,23,0.15)', zIndex: 10,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform .3s ease',
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 70px)', marginTop: 70, display: 'flex', overflow: 'hidden' }}>
      <style>{`
        @keyframes userPulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Sidebar */}
      <div style={S.sidebar}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 14px', borderBottom: '1px solid rgba(212,160,23,0.12)' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFD700', margin: 0 }}>🗺️ Khám Phá Hà Nội</h2>
            <p style={{ margin: '3px 0 0', fontSize: '.73rem', color: 'rgba(255,255,255,.4)' }}>{filteredLandmarks.length} địa điểm</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)', color: '#D4A017', borderRadius: 8, width: 32, height: 32, cursor: 'pointer' }}>✕</button>
        </div>

        {/* GPS Button */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(212,160,23,0.08)' }}>
          <button onClick={locateUser} disabled={locating} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: locating ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg,#D4A017,#FF8C00)',
            color: '#fff', fontWeight: 700, fontSize: '.88rem', cursor: locating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: locating ? 'none' : '0 4px 16px rgba(212,160,23,0.4)', fontFamily: 'Inter,sans-serif',
          }}>
            {locating ? '⏳ Đang xác định...' : '📍 Xác Định Vị Trí GPS Của Tôi'}
          </button>
          {userLocation && (
            <div style={{ marginTop: 8, fontSize: '.75rem', color: '#10B981', textAlign: 'center' }}>
              ✓ {userLocation[1].toFixed(5)}°N, {userLocation[0].toFixed(5)}°E
            </div>
          )}
          {locError && <div style={{ marginTop: 8, fontSize: '.73rem', color: '#FCA5A5', textAlign: 'center', lineHeight: 1.5 }}>{locError}</div>}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 20px 8px' }}>
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm địa điểm tại Hà Nội..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(212,160,23,0.2)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: '.88rem', fontFamily: 'Inter,sans-serif', outline: 'none' }}
          />
          <button onClick={handleSearch} disabled={isSearching} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#D4A017,#FF8C00)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
            {isSearching ? '⏳' : '🔍'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ padding: '4px 20px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {searchResults.map((r, i) => (
              <div key={i} onClick={() => flyToSearchResult(r)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: r.coords ? 'rgba(212,160,23,0.07)' : 'rgba(255,0,0,0.05)', borderRadius: 10, cursor: r.coords ? 'pointer' : 'default', border: '1px solid rgba(212,160,23,0.12)' }}>
                <span>{r.coords ? '📍' : '⚠️'}</span>
                <div>
                  <div style={{ fontSize: '.84rem', fontWeight: 600, color: '#fff' }}>{r.name}</div>
                  <div style={{ fontSize: '.73rem', color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{r.address}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 20px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
              padding: '7px 13px', borderRadius: 20, fontFamily: 'Inter,sans-serif',
              border: `1px solid ${activeCategory === cat.key ? '#D4A017' : 'rgba(212,160,23,.15)'}`,
              background: activeCategory === cat.key ? 'rgba(212,160,23,.15)' : 'rgba(255,255,255,.04)',
              color: activeCategory === cat.key ? '#FFD700' : 'rgba(255,255,255,.55)',
              fontSize: '.78rem', fontWeight: 600, cursor: 'pointer',
            }}>{cat.emoji} {cat.label}</button>
          ))}
        </div>

        {/* Places List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredLandmarks.map(place => (
            <div key={place.id} onClick={() => flyToPlace(place)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, cursor: 'pointer',
              background: selectedPlace?.id === place.id ? 'rgba(212,160,23,.12)' : 'rgba(255,255,255,.04)',
              border: `1px solid ${selectedPlace?.id === place.id ? 'rgba(212,160,23,.45)' : 'rgba(255,255,255,.06)'}`,
              transition: 'all .2s ease',
            }}>
              <div style={{ fontSize: '1.3rem', flexShrink: 0, width: 32, textAlign: 'center' }}>{place.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.87rem', fontWeight: 600, color: '#fff', marginBottom: 3 }}>{place.name}</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.42)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{place.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          padding: '10px 18px', borderRadius: 12,
          border: '1px solid rgba(212,160,23,.3)', background: 'rgba(8,12,28,.92)',
          backdropFilter: 'blur(12px)', color: '#FFD700', fontSize: '.9rem',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
        }}>☰ Danh Sách</button>
      )}

      {/* Map container */}
      <div ref={mapContainerRef} style={{ flex: 1, width: '100%', height: '100%' }} />

      {/* Detail Panel */}
      {selectedPlace && (
        <div style={{
          position: 'absolute', bottom: 20, right: 20, width: 290,
          background: 'rgba(8,12,28,.95)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212,160,23,.25)', borderRadius: 18, padding: 20,
          zIndex: 10, boxShadow: '0 8px 40px rgba(0,0,0,.55)', animation: 'slideUp .3s ease',
        }}>
          <button onClick={() => setSelectedPlace(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(212,160,23,.1)', border: '1px solid rgba(212,160,23,.2)', color: '#D4A017', borderRadius: 8, width: 28, height: 28, cursor: 'pointer' }}>✕</button>
          <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{selectedPlace.emoji}</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 7px' }}>{selectedPlace.name}</h3>
          <p style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.55, margin: '0 0 10px' }}>{selectedPlace.description}</p>
          {selectedPlace.tips && (
            <div style={{ background: 'rgba(212,160,23,.1)', border: '1px solid rgba(212,160,23,.2)', borderRadius: 9, padding: '9px 12px', fontSize: '.78rem', color: '#FFD700', lineHeight: 1.5 }}>
              💡 {selectedPlace.tips}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapExplore;
