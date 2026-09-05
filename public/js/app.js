function openDashboard(metric) {
    const overlay = document.getElementById('dashboardOverlay');
    const frame = document.getElementById('dashboardFrame');
    
    const dashboardRoutes = {
        'asistensi': '/dashboard/asistensi',
        'pelayanan-cukai': '/dashboard/cukai',
        'pelayanan-kepabeanan': '/dashboard/kepabeanan',
        'pelayanan-tik': '/dashboard/tik'
    };

    const dashboardUrl = dashboardRoutes[metric] || '/'; 
    
    // 1. Tampilkan overlay dan kunci scroll body seketika
    overlay.style.display = 'block'; 
    document.body.style.overflow = 'hidden'; 

    // 2. Kosongkan iframe terlebih dahulu agar tidak membebani proses render animasi
    frame.src = 'about:blank';

    // 3. Picu animasi masuk (fade-in & zoom) dengan mulus selama 0.5 detik
    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });

    // 4. Muat URL iframe HANYA SETELAH animasi selesai (500ms / 0.5 detik)
    // Ini mencegah browser mengalami lag/stuck akibat beratnya chart & data di dalam iframe
    setTimeout(() => {
        frame.src = `${dashboardUrl}?metric=${metric}`; 
    }, 500); 

    frame.onload = () => {
        frame.focus(); 
        try {
            frame.contentWindow.postMessage({action: 'loadMetric', metric: metric}, '*');
        } catch(e) {}
    };
}

function closeDashboard() {
    const overlay = document.getElementById('dashboardOverlay'); 
    const frame = document.getElementById('dashboardFrame');
    
    // Jalankan animasi keluar (fade-out / menyusut)
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto'; 

    // Bersihkan iframe setelah animasi 0.5 detik selesai sepenuhnya
    setTimeout(() => {
        overlay.style.display = 'none'; 
        frame.src = '';
    }, 500);
}

// Event Listener bawaan
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDashboard();
}); 

document.getElementById('dashboardOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeDashboard();
});

// Animasi & Interaksi Umum Website
window.addEventListener('load', () => {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if(loading) loading.classList.add('hidden');
    }, 2500);
}); 

const hamburger = document.querySelector('.hamburger'); 
const navMenu = document.querySelector('.nav-menu'); 
if(hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header'); 
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 63, 135, 0.98)'; 
        header.style.backdropFilter = 'blur(20px)'; 
        header.style.padding = '0.8rem 0';
    } else {
        header.style.background = 'var(--primary-blue)'; 
        header.style.backdropFilter = 'none'; 
        header.style.padding = '1rem 0';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 
        const target = document.querySelector(this.getAttribute('href')); 
        if (target) {
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
        } 
        if(navMenu) navMenu.classList.remove('active');
    });
});

const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});
if(scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}