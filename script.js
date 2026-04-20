document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Parallax Effect on Hero Background
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.05)`;
        }

        // Navbar blur effect enhance on scroll
        const nav = document.querySelector('.glass-nav');
        if (scrolled > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.85)';
            nav.style.boxShadow = 'none';
        }
    });

    // 3. Initialize Leaflet Map
    if (document.getElementById('trip-map')) {
        // Center of the trip (roughly Dalmatian coast)
        const map = L.map('trip-map').setView([43.5, 16.5], 7);

        // Add nice light map tiles (CartoDB Positron for aesthetic)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Define custom icon logic (optional but nice)
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: var(--primary); width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(12, 192, 223, 0.8);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Locations data
        const locations = [
            { name: "Zadar", coords: [44.1194, 15.2314], desc: "Días 1-4: Llegada, visitas y barco." },
            { name: "Lagos Plitvice", coords: [44.8654, 15.5820], desc: "Día 2: Excursión al Parque Nacional." },
            { name: "Split", coords: [43.5081, 16.4402], desc: "Días 4-6: Visitas y excursiones." },
            { name: "Isla de Hvar", coords: [43.1729, 16.4411], desc: "Días 6-8: Ferry, relax y Boat Party." },
            { name: "Dubrovnik", coords: [42.6507, 18.0944], desc: "Días 8-9 & 11-12: Visitas turísticas y base." },
            { name: "Kotor (Montenegro)", coords: [42.4247, 18.7712], desc: "Día 10: Ruta en coche y playas." },
            { name: "Budva (Montenegro)", coords: [42.2911, 18.8403], desc: "Día 10: Alojamientos y ruta costa." }
        ];

        // Draw specific line segments for the itinerary
        const routes = [
            { path: [[44.1194, 15.2314], [44.8654, 15.5820]], type: 'car' }, // Zadar -> Plitvice
            { path: [[44.8654, 15.5820], [44.1194, 15.2314]], type: 'car' }, // Plitvice -> Zadar
            { path: [[44.1194, 15.2314], [43.5081, 16.4402]], type: 'bus' }, // Zadar -> Split
            { path: [[43.5081, 16.4402], [43.1729, 16.4411]], type: 'ferry' }, // Split -> Hvar
            { path: [[43.1729, 16.4411], [42.6507, 18.0944]], type: 'ferry' }, // Hvar -> Dubrovnik
            { path: [[42.6507, 18.0944], [42.4247, 18.7712]], type: 'car' }, // Dubrovnik -> Kotor
            { path: [[42.4247, 18.7712], [42.2911, 18.8403]], type: 'car' }, // Kotor -> Budva
            { path: [[42.2911, 18.8403], [42.6507, 18.0944]], type: 'car' }  // Budva -> Dubrovnik
        ];

        routes.forEach(route => {
            const isFerry = route.type === 'ferry';
            L.polyline(route.path, {
                color: isFerry ? '#ff7e67' : '#00a5cf',
                weight: 3,
                opacity: 0.8,
                dashArray: isFerry ? '10, 10' : ''
            }).addTo(map);

            // Add an icon in the middle of each route segment
            const midLat = (route.path[0][0] + route.path[1][0]) / 2;
            const midLng = (route.path[0][1] + route.path[1][1]) / 2;

            let emoji = '🚗';
            if (route.type === 'ferry') emoji = '⛴️';
            if (route.type === 'bus') emoji = '🚍';

            const routeIcon = L.divIcon({
                className: 'route-emoji-icon',
                html: `<div style="font-size: 16px; text-shadow: 0 0 5px rgba(255,255,255,0.8); background: rgba(255,255,255,0.8); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(0,165,207,0.3); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${emoji}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            L.marker([midLat, midLng], { icon: routeIcon, interactive: false }).addTo(map);
        });

        // Add Markers
        locations.forEach(loc => {
            L.marker(loc.coords, { icon: customIcon })
                .addTo(map)
                .bindPopup(`<strong style="color: #0d1117;">${loc.name}</strong><br><span style="color: #666; font-size:12px;">${loc.desc}</span>`);
        });
    }

    // 4. Reveal animations on scroll
    const scrollReveal = () => {
        const elements = document.querySelectorAll('.timeline-item, .lodging-card');
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollReveal);
    scrollReveal(); // Run once on load

    // 5. Trip Countdown Timer
    const countdownDate = new Date("July 1, 2026 00:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
        if (minsEl) minsEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        if (secsEl) secsEl.innerText = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(timerInterval);
            const countdownEl = document.getElementById("hero-countdown");
            if (countdownEl) countdownEl.innerHTML = "<h3 style='color: var(--primary)'>¡El viaje ha comenzado!</h3>";
        }
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run once to prevent delay
});
