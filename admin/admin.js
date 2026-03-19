/**
 * Admin Panel Logic - Travel Designer CMS
 */

let globalSettings = null;
let pageList = [];
let siteContent = null; // Currently selected translation (page or home)
let currentPageId = 'home';
let currentSection = 'site';
let currentLang = 'en';
let imagesList = [];
let currentImageInput = null;

// ---------- UI TRANSLATIONS ----------
const translations = {
    en: {
        admin_panel: "ADMIN PANEL",
        general: "General",
        site_config: "Site Configuration",
        nav_header: "Navigation",
        footer_header: "Footer",
        home_sections: "Home Page Sections",
        hero_header: "Hero Section",
        about_section: "About Us",
        specialist_section: "Specialist",
        selection_header: "Our Selection",
        themes_header: "Themes",
        dest_header: "Destinations",
        values_header: "Values",
        reviews_header: "Reviews",
        pages_header: "Destination Pages",
        contact_header: "Contact Bar",
        media_account: "Media & Account",
        media_manager: "Media Manager",
        change_password: "Change Password",
        logout: "Logout",
        open_site: "Open site ↗",
        save_changes: "Save Changes",
        select_image: "Select image",
        drag_drop: "Click or drag image here",
        site_title: "Site Title (SEO)",
        site_desc: "Description (SEO)",
        site_logo: "Logo Text",
        hero_title: "Main Title (H1)",
        btn_text: "Button Text",
        bg_image: "Background Image",
        title: "Title",
        text_html: "Text / Description (HTML allowed)",
        link_text: "Link Text",
        image: "Image",
        image_illustration: "Illustration Image",
        checklist: "Highlights",
        add_point: "+ Add point",
        subtitle: "Subtitle",
        cards: "Cards",
        add_card: "+ Add card",
        card_num: "Card",
        link_url: "Link URL",
        tall_format: "Vertical format (Tall)",
        add_theme: "+ Add theme",
        dest_add: "+ Add destination",
        name: "Name",
        gradient: "Gradient (if no image)",
        icon: "Icon",
        desc: "Description",
        rating: "Rating",
        rating_label: "Rating Label",
        btn_link: "Button Link",
        phone_disp: "Phone (Display)",
        phone_link: "Phone Link",
        email: "Email",
        form_text: "Form Text",
        copyright: "Copyright",
        social_links: "Social Media",
        no_image: "No image selected",
        browse: "Browse",
        delete: "Delete",
        add_page: "+ Create Page",
        edit_page: "Edit Page",
        page_slug: "Slug (URL)"
    },
    fr: {
        admin_panel: "PANNEAU D'ADMINISTRATION",
        general: "Général",
        site_config: "Configuration du Site",
        nav_header: "Navigation",
        footer_header: "Pied de page",
        home_sections: "Sections Page d'Accueil",
        hero_header: "Section Hero",
        about_section: "À Propos",
        specialist_section: "Spécialiste",
        selection_header: "Notre Sélection",
        themes_header: "Thèmes",
        dest_header: "Destinations",
        values_header: "Valeurs",
        reviews_header: "Avis",
        pages_header: "Pages de Destination",
        contact_header: "Barre de Contact",
        media_account: "Médias & Compte",
        media_manager: "Gestionnaire d'Images",
        change_password: "Changer le mot de passe",
        logout: "Déconnexion",
        open_site: "Ouvrir le site ↗",
        save_changes: "Enregistrer",
        select_image: "Choisir une image",
        drag_drop: "Cliquez ou glissez une image ici",
        site_title: "Titre du site (SEO)",
        site_desc: "Description (SEO)",
        site_logo: "Texte du Logo",
        hero_title: "Titre Principal (H1)",
        btn_text: "Texte du Bouton",
        bg_image: "Image de fond",
        title: "Titre",
        text_html: "Texte / Description (HTML autorisé)",
        link_text: "Texte du lien",
        image: "Image",
        image_illustration: "Image Illustrative",
        checklist: "Points Forts",
        add_point: "+ Ajouter un point",
        subtitle: "Sous-titre",
        cards: "Cartes",
        add_card: "+ Ajouter une carte",
        card_num: "Carte",
        link_url: "Lien URL",
        tall_format: "Format Vertical (Grand)",
        add_theme: "+ Ajouter un thème",
        dest_add: "+ Ajouter une destination",
        name: "Nom",
        gradient: "Dégradé (si pas d'image)",
        icon: "Icône",
        desc: "Description",
        rating: "Note",
        rating_label: "Libellé Note",
        btn_link: "Lien du bouton",
        phone_disp: "Téléphone (Affichage)",
        phone_link: "Lien Téléphone",
        email: "E-mail",
        form_text: "Texte du Formulaire",
        copyright: "Copyright",
        social_links: "Réseaux Sociaux",
        no_image: "Aucune image sélectionnée",
        browse: "Parcourir",
        delete: "Supprimer",
        add_page: "+ Créer une Page",
        edit_page: "Modifier la Page",
        page_slug: "Slug (URL)"
    },
    id: {
        admin_panel: "PANEL ADMIN",
        general: "Umum",
        site_config: "Konfigurasi Situs",
        nav_header: "Navigasi",
        footer_header: "Footer",
        home_sections: "Bagian Beranda",
        hero_header: "Bagian Hero",
        about_section: "Tentang Kami",
        specialist_section: "Spesialis",
        selection_header: "Pilihan Kami",
        themes_header: "Tema",
        dest_header: "Destinasi",
        values_header: "Nilai (Kelebihan)",
        reviews_header: "Ulasan",
        pages_header: "Halaman Destinasi",
        contact_header: "Baris Kontak",
        media_account: "Media & Akun",
        media_manager: "Manajer Gambar",
        change_password: "Ubah Kata Sandi",
        logout: "Keluar",
        open_site: "Buka Situs ↗",
        save_changes: "Simpan Perubahan",
        select_image: "Pilih gambar",
        drag_drop: "Klik atau tarik gambar ke sini",
        site_title: "Judul Situs (SEO)",
        site_desc: "Deskripsi (SEO)",
        site_logo: "Teks Logo",
        hero_title: "Judul Utama (H1)",
        btn_text: "Teks Tombol",
        bg_image: "Gambar Latar",
        title: "Judul",
        text_html: "Teks / Deskripsi (HTML dibolehkan)",
        link_text: "Teks Link",
        image: "Gambar",
        image_illustration: "Gambar Ilustrasi",
        checklist: "Sorotan (Checklist)",
        add_point: "+ Tambah poin",
        subtitle: "Sub-judul",
        cards: "Kartu",
        add_card: "+ Tambah kartu",
        card_num: "Kartu",
        link_url: "Link URL",
        tall_format: "Format Vertikal (Tinggi)",
        add_theme: "+ Tambah tema",
        dest_add: "+ Tambah destinasi",
        name: "Nama",
        gradient: "Gradien (jika tanpa gambar)",
        icon: "Ikon",
        desc: "Deskripsi",
        rating: "Nilai",
        rating_label: "Label Nilai",
        btn_link: "Link Tombol",
        phone_disp: "Telepon (Tampilan)",
        phone_link: "Link Telepon",
        email: "Email",
        form_text: "Teks Formulir",
        copyright: "Hak Cipta",
        social_links: "Media Sosial",
        no_image: "Tidak ada gambar",
        browse: "Cari",
        delete: "Hapus",
        add_page: "+ Buat Halaman",
        edit_page: "Edit Halaman",
        page_slug: "Slug (URL)"
    }
};

function _t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

function translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = _t(el.dataset.i18n);
    });
}

// DOM Elements
const contentPanels = document.getElementById('contentPanels');
const btnSaveGlobal = document.getElementById('btnSaveGlobal');
const pageTitle = document.getElementById('pageTitle');
const toastEl = document.getElementById('toast');
const mobileToggle = document.getElementById('mobileToggle');
const sidebar = document.getElementById('sidebar');

// Modal Elements
const imageModal = document.getElementById('imageModal');
const modalImageGrid = document.getElementById('modalImageGrid');
const quickUploadZone = document.getElementById('quickUploadZone');
const quickUploadInput = document.getElementById('quickUploadInput');

// ---------- INIT ----------
async function init() {
    try {
        await fetchData();
        await fetchImages();
        setupNavigation();
        setupMobileMenu();
        setupImageModal();
        translateDOM();

        // Logout
        document.getElementById('btnLogout').addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        });

        // Language Switcher
        const langSwitcher = document.getElementById('langSwitcher');
        const btnPreviewSite = document.getElementById('btnPreviewSite');
        if (langSwitcher) {
            langSwitcher.addEventListener('change', async (e) => {
                currentLang = e.target.value;
                if (btnPreviewSite) btnPreviewSite.href = `/${currentLang}`;
                translateDOM();
                await fetchTranslation(currentPageId);
                await fetchImages(); // Refresh images on lang change
                showToast(`Language changed: ${currentLang.toUpperCase()}`, 'success');
            });
        }

        // Global Save
        btnSaveGlobal.addEventListener('click', saveCurrentSection);

    } catch (err) {
        showToast('Error loading data', 'error');
        console.error(err);
    }
}

// ---------- API CALLS ----------
async function fetchData() {
    // 1. Fetch Global Settings
    const resG = await fetch('/api/global-settings');
    if (resG.ok) globalSettings = await resG.json();

    // 2. Fetch Pages (Structure)
    const resP = await fetch(`/api/pages?lang=${currentLang}`);
    if (resP.ok) pageList = await resP.json();

    // 3. Fetch Initial Translation (Home)
    await fetchTranslation('home');

    // 4. Fetch Images for Media Manager
    await fetchImages();
}

async function fetchTranslation(id) {
    currentPageId = id;
    const res = await fetch(`/api/translations/${currentLang}/${id}`);
    if (!res.ok) {
        if (res.status === 401) window.location.href = '/admin/login';
        throw new Error('Failed to load translation');
    }
    siteContent = await res.json();
    renderAllPanels();
    showPanel(currentSection);
}

async function fetchImages() {
    const res = await fetch('/api/images');
    if (res.ok) {
        imagesList = await res.json();
        renderImageGrid();
    }
}

async function saveCurrentSection() {
    btnSaveGlobal.disabled = true;
    const oldText = btnSaveGlobal.innerHTML;
    btnSaveGlobal.innerHTML = '<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px"></span> Saving...';

    updateDataFromForm(currentSection);

    try {
        let url = '';
        let body = null;

        // Determine which API to call based on currentSection
        const globalSections = ['site', 'nav', 'footer', 'contact'];
        if (globalSections.includes(currentSection)) {
            url = '/api/global-settings';
            body = globalSettings;
        } else {
            // Translation save
            url = `/api/translations/${currentLang}/${currentPageId}`;
            body = siteContent;
        }

        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            showToast('Changes saved successfully', 'success');
        } else {
            throw new Error('Save error');
        }
    } catch (err) {
        showToast("Error during saving", 'error');
    } finally {
        btnSaveGlobal.disabled = false;
        btnSaveGlobal.innerHTML = oldText;
    }
}

// ---------- NAVIGATION ----------
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;

            // Handle special tabs
            if (target === 'images') {
                renderImagesTab();
            } else if (target === 'settings') {
                renderSettingsTab();
            } else if (target === 'pages') {
                renderPagesTab();
            }

            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            currentSection = target;
            showPanel(target);
            pageTitle.textContent = e.currentTarget.textContent.trim();

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

function showPanel(id) {
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${id}`);
    if (panel) panel.classList.add('active');

    // Hide save button for Images and Settings as they save differently
    if (id === 'images' || id === 'settings') {
        btnSaveGlobal.style.display = 'none';
    } else {
        btnSaveGlobal.style.display = 'inline-flex';
    }
}

function setupMobileMenu() {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// ---------- TOAST ----------
function showToast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = `toast show ${type}`;
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// ---------- COMPONENTS GENERATOR ----------
function createInput(id, label, value, type = 'text') {
    return `
        <div class="form-row">
            <label for="${id}">${label}</label>
            <input type="${type}" id="${id}" name="${id}" value="${escapeHtml(value || '')}">
        </div>
    `;
}

function createTextarea(id, label, value) {
    return `
        <div class="form-row">
            <label for="${id}">${label}</label>
            <textarea id="${id}" name="${id}">${escapeHtml(value || '')}</textarea>
        </div>
    `;
}

function createImageSelect(id, label, value) {
    const previewSrc = value ? `/${value}` : '';
    const placeholder = value ? '' : '<span class="placeholder-icon">🖼️</span>';
    const imgTag = value ? `<img src="${previewSrc}" alt="Preview">` : '';

    return `
        <div class="form-row">
            <label>${label}</label>
            <div class="img-picker">
                <div class="img-picker-preview" id="preview-${id}">
                    ${imgTag}
                    ${placeholder}
                </div>
                <input type="text" id="${id}" name="${id}" class="form-control image-path-input" value="${escapeHtml(value || '')}" readonly placeholder="${_t('no_image')}">
                <button type="button" class="btn-browse" onclick="openImageSelector('${id}')">${_t('browse')}</button>
            </div>
        </div>
    `;
}

// ---------- RENDERERS ----------
function renderAllPanels() {
    if (!globalSettings || !siteContent) return;
    let html = '';

    // 1. Site (Global)
    html += `<div class="section-panel" id="panel-site">
        <div class="card">
            <div class="card-header"><h3>${_t('site_config')}</h3></div>
            <form id="form-site">
                ${createInput('site-logoText', _t('site_logo'), globalSettings.site.logoText)}
                ${createImageSelect('site-favicon', 'Favicon', globalSettings.site.favicon)}
            </form>
        </div>
    </div>`;

    // 2. Hero (Translation - Home Only)
    if (currentPageId === 'home') {
        html += `<div class="section-panel" id="panel-hero">
            <div class="card">
                <div class="card-header"><h3>${_t('hero_header')}</h3></div>
                <form id="form-hero">
                    ${createInput('hero-heading', _t('hero_title'), siteContent.hero.heading)}
                    ${createInput('hero-buttonText', _t('btn_text'), siteContent.hero.buttonText)}
                    ${createImageSelect('hero-backgroundImage', _t('bg_image'), siteContent.hero.backgroundImage)}
                </form>
            </div>
        </div>`;

        // 3. About
        const checklistHtml = (siteContent.about.checklist || []).map((item, i) => `
            <div class="checklist-item" data-index="${i}">
                <input type="text" value="${escapeHtml(item)}" class="about-check-input">
                <button type="button" class="btn-del" onclick="removeListItem(this.parentElement)">✕</button>
            </div>
        `).join('');

        html += `<div class="section-panel" id="panel-about">
            <div class="card">
                <div class="card-header"><h3>${_t('about_section')}</h3></div>
                <form id="form-about">
                    ${createInput('about-heading', _t('title'), siteContent.about.heading)}
                    ${createTextarea('about-text', _t('text_html'), siteContent.about.text)}
                    ${createInput('about-linkText', _t('link_text'), siteContent.about.linkText)}
                    ${createImageSelect('about-image', _t('image_illustration'), siteContent.about.image)}

                    <div class="form-row" style="margin-top:24px;">
                        <label>${_t('checklist')}</label>
                        <div class="item-list" id="about-checklist-container">
                            ${checklistHtml}
                        </div>
                        <button type="button" class="btn-add" onclick="addChecklistItem('about-checklist-container', 'about-check-input')">${_t('add_point')}</button>
                    </div>
                </form>
            </div>
        </div>`;

        // 4. Specialist
        html += `<div class="section-panel" id="panel-specialist">
            <div class="card">
                <div class="card-header"><h3>${_t('specialist_section')}</h3></div>
                <form id="form-specialist">
                    ${createInput('specialist-heading', _t('title'), siteContent.specialist.heading)}
                    ${createTextarea('specialist-text', _t('text_html'), siteContent.specialist.text)}
                    ${createInput('specialist-buttonText', _t('btn_text'), siteContent.specialist.buttonText)}
                    ${createImageSelect('specialist-backgroundImage', _t('bg_image'), siteContent.specialist.backgroundImage)}
                </form>
            </div>
        </div>`;

        // 5. Selection (Cards)
        const selectionCardsHtml = (siteContent.selection.cards || []).map((card, i) => `
            <div class="item-entry sel-card-entry" data-index="${i}">
                <div class="item-header"><strong>${_t('card_num')} ${i + 1}</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">${_t('delete')}</button></div>
                ${createInput(`sel-title-${i}`, _t('title'), card.title)}
                ${createInput(`sel-link-${i}`, _t('link_url'), card.link)}
                ${createImageSelect(`sel-img-${i}`, _t('image'), card.image)}
                <div class="form-row">
                    <label><input type="checkbox" id="sel-tall-${i}" ${card.tall ? 'checked' : ''}> ${_t('tall_format')}</label>
                </div>
            </div>
        `).join('');

        html += `<div class="section-panel" id="panel-selection">
            <div class="card">
                <div class="card-header"><h3>${_t('selection_header')}</h3></div>
                <form id="form-selection">
                    ${createInput('selection-heading', _t('title'), siteContent.selection.heading)}
                    ${createTextarea('selection-subtitle', _t('subtitle'), siteContent.selection.subtitle)}

                    <div class="form-row" style="margin-top:24px;">
                        <label>${_t('cards')}</label>
                        <div class="item-list" id="selection-cards-container">
                            ${selectionCardsHtml}
                        </div>
                        <button type="button" class="btn-add" onclick="addSelectionCard()">${_t('add_card')}</button>
                    </div>
                </form>
            </div>
        </div>`;

        // 6. Themes
        const themesCardsHtml = (siteContent.themes.cards || []).map((card, i) => `
            <div class="item-entry theme-card-entry" data-index="${i}">
                <div class="item-header"><strong>Thème ${i + 1}</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">${_t('delete')}</button></div>
                <div class="form-row-inline">
                    ${createInput(`theme-title-${i}`, _t('title'), card.title)}
                    ${createInput(`theme-link-${i}`, _t('link_url'), card.link)}
                </div>
                ${createImageSelect(`theme-img-${i}`, _t('image'), card.image)}
            </div>
        `).join('');

        html += `<div class="section-panel" id="panel-themes">
            <div class="card">
                <div class="card-header"><h3>${_t('themes_header')}</h3></div>
                <form id="form-themes">
                    ${createInput('themes-heading', _t('title'), siteContent.themes.heading)}
                    ${createTextarea('themes-subtitle', _t('subtitle'), siteContent.themes.subtitle)}

                    <div class="form-row" style="margin-top:24px;">
                        <label>${_t('cards')}</label>
                        <div class="item-list" id="themes-cards-container">
                            ${themesCardsHtml}
                        </div>
                        <button type="button" class="btn-add" onclick="addThemeCard()">${_t('add_theme')}</button>
                    </div>
                </form>
            </div>
        </div>`;

        // 7. Destinations
        const destCardsHtml = (siteContent.destinations.cards || []).map((card, i) => `
            <div class="item-entry dest-card-entry" data-index="${i}">
                <div class="item-header"><strong>Destination ${i + 1}</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">${_t('delete')}</button></div>
                <div class="form-row-inline">
                    ${createInput(`dest-name-${i}`, _t('name'), card.name)}
                    ${createInput(`dest-link-${i}`, _t('link_url'), card.link)}
                </div>
                ${createImageSelect(`dest-img-${i}`, _t('image'), card.image)}
                ${createInput(`dest-grad-${i}`, _t('gradient'), card.gradient || '')}
            </div>
        `).join('');

        html += `<div class="section-panel" id="panel-destinations">
            <div class="card">
                <div class="card-header"><h3>${_t('dest_header')}</h3></div>
                <form id="form-destinations">
                    ${createInput('destinations-heading', _t('title'), siteContent.destinations.heading)}
                    ${createTextarea('destinations-subtitle', _t('subtitle'), siteContent.destinations.subtitle)}

                    <div class="form-row" style="margin-top:24px;">
                        <label>Destinations</label>
                        <div class="item-list" id="dest-cards-container">
                            ${destCardsHtml}
                        </div>
                        <button type="button" class="btn-add" onclick="addDestCard()">${_t('dest_add')}</button>
                    </div>
                </form>
            </div>
        </div>`;

        // 8. Values
        const valuesHtml = (siteContent.values.cards || []).map((v, i) => `
            <div class="item-entry val-card-entry" data-index="${i}">
                <div class="item-header"><strong>Valeur ${i + 1}</strong></div>
                <div class="form-row-inline">
                    ${createInput(`val-title-${i}`, _t('title'), v.title)}
                    <div class="form-row">
                        <label>${_t('icon')}</label>
                        <select id="val-icon-${i}">
                            <option value="star" ${v.icon === 'star' ? 'selected' : ''}>Étoile (Star)</option>
                            <option value="check" ${v.icon === 'check' ? 'selected' : ''}>Coche (Check)</option>
                            <option value="shield" ${v.icon === 'shield' ? 'selected' : ''}>Bouclier (Shield)</option>
                            <option value="help" ${v.icon === 'help' ? 'selected' : ''}>Assistance (Headset)</option>
                        </select>
                    </div>
                </div>
                ${createTextarea(`val-desc-${i}`, _t('desc'), v.description)}
            </div>
        `).join('');

        html += `<div class="section-panel" id="panel-values">
            <div class="card">
                <div class="card-header"><h3>${_t('values_header')}</h3></div>
                <form id="form-values">
                    ${createInput('values-heading', _t('title'), siteContent.values.heading)}
                    <div class="form-row" style="margin-top:24px;">
                        <label>${_t('cards')} (4 max)</label>
                        <div class="item-list">
                            ${valuesHtml}
                        </div>
                    </div>
                </form>
            </div>
        </div>`;

        // 9. Reviews
        html += `<div class="section-panel" id="panel-reviews">
            <div class="card">
                <div class="card-header"><h3>${_t('reviews_header')}</h3></div>
                <form id="form-reviews">
                    ${createInput('reviews-heading', _t('title'), siteContent.reviews.heading)}
                    ${createTextarea('reviews-subtitle', _t('subtitle'), siteContent.reviews.subtitle)}
                    <div class="form-row-inline">
                        ${createInput('reviews-rating', _t('rating'), siteContent.reviews.rating)}
                        ${createInput('reviews-ratingLabel', _t('rating_label'), siteContent.reviews.ratingLabel)}
                    </div>
                    <div class="form-row-inline">
                        ${createInput('reviews-buttonText', _t('btn_text'), siteContent.reviews.buttonText)}
                        ${createInput('reviews-buttonLink', _t('btn_link'), siteContent.reviews.buttonLink)}
                    </div>
                </form>
            </div>
        </div>`;
    } else {
        // Build dynamic page editor (sections)
        html += renderDynamicPageEditor();
    }

    // 10. Contact Bar (Global)
    html += `<div class="section-panel" id="panel-contact">
        <div class="card">
            <div class="card-header"><h3>${_t('contact_header')}</h3></div>
            <form id="form-contact">
                ${createInput('contact-phone', _t('phone_disp'), globalSettings.contact.phone)}
                ${createInput('contact-phoneLink', _t('phone_link'), globalSettings.contact.phoneLink)}
                ${createInput('contact-email', _t('email'), globalSettings.contact.email)}
                <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--border);">
                    <h4>Sidebar (Contact Expert)</h4>
                    ${createInput('contact-contactExpertTitle', 'Expert Title', globalSettings.contact.contactExpertTitle)}
                    ${createTextarea('contact-contactExpertText', 'Expert Text (use %PAGE_TITLE% for dynamic name)', globalSettings.contact.contactExpertText)}
                </div>
            </form>
        </div>
    </div>`;

    // 11. Footer (Global)
    const social = globalSettings.social;
    html += `<div class="section-panel" id="panel-footer">
        <div class="card">
            <div class="card-header"><h3>${_t('footer_header')}</h3></div>
            <form id="form-footer">
                ${createInput('footer-copyright', _t('copyright'), globalSettings.footer.copyrightBase)}
                <h4 style="margin:20px 0 10px; font-size: 0.85rem; color: var(--accent);">${_t('social_links')}</h4>
                <div class="form-row-inline">
                    ${createInput('social-facebook', 'Facebook', social.facebook)}
                    ${createInput('social-youtube', 'YouTube', social.youtube)}
                </div>
                ${createInput('social-instagram', 'Instagram', social.instagram)}
            </form>
        </div>
    </div>`;

    // 12. Nav (Global)
    let navHtml = '';
    (globalSettings.navigation || []).forEach((item, i) => {
        navHtml += `
        <div class="item-entry nav-item-entry" data-index="${i}" style="border-left: 4px solid var(--accent);">
            <div class="item-header">
                <strong>Navigation Item</strong> 
                <div>
                    <button type="button" class="btn-outline" style="padding: 4px 8px; font-size: 0.8rem;" onclick="addNavSubItem(${i})">+ Sub-menu</button>
                    <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete</button>
                </div>
            </div>
            <div class="form-row-inline">
                ${createInput(`nav-id-${i}`, 'ID / Key', item.id)}
                ${createInput(`nav-link-${i}`, _t('link_url'), item.link)}
            </div>
            <div id="nav-children-container-${i}" style="margin-top: 10px; padding-left: 20px; border-left: 2px dashed rgba(255,255,255,0.1);">
        `;

        if (item.children && item.children.length > 0) {
            item.children.forEach((child, j) => {
                navHtml += `
                <div class="item-entry nav-subitem-entry" data-parent="${i}" data-subindex="${j}" style="padding: 10px; margin-bottom: 10px; background: rgba(0,0,0,0.2);">
                    <div class="item-header" style="opacity: 0.7; font-size: 0.8rem; margin-bottom: 5px;">
                        Sub-menu 
                        <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">✕</button>
                    </div>
                    <div class="form-row-inline">
                        <div class="form-col"><input type="text" id="nav-subid-${i}-${j}" class="form-control" value="${escapeHtml(child.id)}" placeholder="ID / Key"></div>
                        <div class="form-col"><input type="text" id="nav-sublink-${i}-${j}" class="form-control" value="${escapeHtml(child.link)}" placeholder="URL"></div>
                    </div>
                </div>`;
            });
        }
        navHtml += `</div></div>`;
    });

    html += `<div class="section-panel" id="panel-nav">
        <div class="card">
            <div class="card-header">
                <h3>${_t('nav_header')}</h3>
                <button type="button" class="btn-add" onclick="addNavItem()">+ Add menu</button>
            </div>
            <form id="form-nav">
                <div id="nav-items-container">
                    ${navHtml}
                </div>
            </form>
        </div>
    </div>`;

    // 13. Pages (Structure)
    html += `<div class="section-panel" id="panel-pages">
        <div class="card">
            <div class="card-header">
                <h3>${_t('pages_header')}</h3>
                <button type="button" class="btn-add" onclick="createNewPage()">+ Create Page</button>
            </div>
            <div class="page-tree-container" id="page-tree-container">
                <!-- Page tree will be rendered here -->
            </div>
        </div>
    </div>`;

    // Setup containers
    contentPanels.innerHTML = html;

    // Additional dynamic setup
    if (currentPageId !== 'home') {
        // setupDynamicPageEvents();
    }
    renderPageTree();
}

// ---------- DATA EXTRACTION ----------
function updateDataFromForm(section) {
    if (section === 'site') {
        globalSettings.site.logoText = document.getElementById('site-logoText').value;
        globalSettings.site.favicon = document.getElementById('site-favicon').value;
    }
    else if (section === 'hero') {
        siteContent.hero.heading = document.getElementById('hero-heading').value;
        siteContent.hero.buttonText = document.getElementById('hero-buttonText').value;
        siteContent.hero.backgroundImage = document.getElementById('hero-backgroundImage').value;
    }
    else if (section === 'about') {
        siteContent.about.heading = document.getElementById('about-heading').value;
        siteContent.about.text = document.getElementById('about-text').value;
        siteContent.about.linkText = document.getElementById('about-linkText').value;
        siteContent.about.image = document.getElementById('about-image').value;

        const checks = [];
        document.querySelectorAll('.about-check-input').forEach(inp => {
            if (inp.value.trim() !== '') checks.push(inp.value.trim());
        });
        siteContent.about.checklist = checks;
    }
    else if (section === 'specialist') {
        siteContent.specialist.heading = document.getElementById('specialist-heading').value;
        siteContent.specialist.text = document.getElementById('specialist-text').value;
        siteContent.specialist.buttonText = document.getElementById('specialist-buttonText').value;
        siteContent.specialist.backgroundImage = document.getElementById('specialist-backgroundImage').value;
    }
    else if (section === 'selection') {
        siteContent.selection.heading = document.getElementById('selection-heading').value;
        siteContent.selection.subtitle = document.getElementById('selection-subtitle').value;

        const cards = [];
        document.querySelectorAll('.sel-card-entry').forEach((el) => {
            const idx = el.dataset.index;
            cards.push({
                title: document.getElementById(`sel-title-${idx}`).value,
                image: document.getElementById(`sel-img-${idx}`).value,
                link: document.getElementById(`sel-link-${idx}`).value,
                tall: document.getElementById(`sel-tall-${idx}`).checked
            });
        });
        siteContent.selection.cards = cards;
    }
    else if (section === 'themes') {
        siteContent.themes.heading = document.getElementById('themes-heading').value;
        siteContent.themes.subtitle = document.getElementById('themes-subtitle').value;

        const cards = [];
        document.querySelectorAll('.theme-card-entry').forEach((el) => {
            const idx = el.dataset.index;
            cards.push({
                title: document.getElementById(`theme-title-${idx}`).value,
                image: document.getElementById(`theme-img-${idx}`).value,
                link: document.getElementById(`theme-link-${idx}`).value
            });
        });
        siteContent.themes.cards = cards;
    }
    else if (section === 'destinations') {
        siteContent.destinations.heading = document.getElementById('destinations-heading').value;
        siteContent.destinations.subtitle = document.getElementById('destinations-subtitle').value;

        const cards = [];
        document.querySelectorAll('.dest-card-entry').forEach((el) => {
            const idx = el.dataset.index;
            cards.push({
                name: document.getElementById(`dest-name-${idx}`).value,
                image: document.getElementById(`dest-img-${idx}`).value,
                link: document.getElementById(`dest-link-${idx}`).value,
                gradient: document.getElementById(`dest-grad-${idx}`)?.value || ""
            });
        });
        siteContent.destinations.cards = cards;
    }
    else if (section === 'values') {
        siteContent.values.heading = document.getElementById('values-heading').value;

        const cards = [];
        document.querySelectorAll('.val-card-entry').forEach((el) => {
            const idx = el.dataset.index;
            cards.push({
                icon: document.getElementById(`val-icon-${idx}`).value,
                title: document.getElementById(`val-title-${idx}`).value,
                description: document.getElementById(`val-desc-${idx}`).value
            });
        });
        siteContent.values.cards = cards;
    }
    else if (section === 'reviews') {
        siteContent.reviews.heading = document.getElementById('reviews-heading').value;
        siteContent.reviews.subtitle = document.getElementById('reviews-subtitle').value;
        siteContent.reviews.rating = document.getElementById('reviews-rating').value;
        siteContent.reviews.ratingLabel = document.getElementById('reviews-ratingLabel').value;
        siteContent.reviews.buttonText = document.getElementById('reviews-buttonText').value;
        siteContent.reviews.buttonLink = document.getElementById('reviews-buttonLink').value;
    }
    else if (section === 'contact') {
        globalSettings.contact.phone = document.getElementById('contact-phone').value;
        globalSettings.contact.phoneLink = document.getElementById('contact-phoneLink').value;
        globalSettings.contact.email = document.getElementById('contact-email').value;
    }
    else if (section === 'footer') {
        globalSettings.footer.copyrightBase = document.getElementById('footer-copyright').value;
        globalSettings.social.facebook = document.getElementById('social-facebook').value;
        globalSettings.social.youtube = document.getElementById('social-youtube').value;
        globalSettings.social.instagram = document.getElementById('social-instagram').value;
    }
    else if (section === 'nav') {
        const navigation = [];
        document.querySelectorAll('.nav-item-entry').forEach((el) => {
            const idx = el.dataset.index;
            const parentIdEl = document.getElementById(`nav-id-${idx}`);
            if (!parentIdEl) return;

            const item = {
                id: parentIdEl.value,
                link: document.getElementById(`nav-link-${idx}`).value,
                children: []
            };

            el.querySelectorAll('.nav-subitem-entry').forEach(subEl => {
                const pIdx = subEl.dataset.parent;
                const sIdx = subEl.dataset.subindex;
                const subIdEl = document.getElementById(`nav-subid-${pIdx}-${sIdx}`);
                if (subIdEl) {
                    item.children.push({
                        id: subIdEl.value,
                        link: document.getElementById(`nav-sublink-${pIdx}-${sIdx}`).value
                    });
                }
            });

            navigation.push(item);
        });
        globalSettings.navigation = navigation;
    }
    else if (currentPageId !== 'home') {
        updateDynamicPageData();
    }
}

// ---------- DYNAMIC UI HELPERS ----------
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createInput(id, label, value, type = 'text', extra = '') {
    return `<div class="form-row">
        <label for="${id}">${label}</label>
        <input type="${type}" id="${id}" class="form-control" value="${escapeHtml(value || '')}" ${extra}>
    </div>`;
}

function createTextarea(id, label, value, extra = '') {
    return `<div class="form-row">
        <label for="${id}">${label}</label>
        <textarea id="${id}" class="form-control" ${extra}>${escapeHtml(value || '')}</textarea>
    </div>`;
}

function createImageSelect(id, label, value) {
    return `<div class="form-row">
        <label>${label}</label>
        <div class="image-select-wrapper">
            <input type="text" id="${id}" class="form-control image-path-input" value="${escapeHtml(value || '')}" readonly>
            <button type="button" class="btn-outline" onclick="openImageSelector('${id}')">${_t('select_image')}</button>
        </div>
        <div class="image-preview" id="preview-${id}">
            ${value ? `<img src="/${value}" alt="Preview">` : `<small>${_t('no_image')}</small>`}
        </div>
    </div>`;
}

function removeListItem(el) {
    el.remove();
}

function addChecklistItem(containerId, inputClass) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'checklist-item';
    div.innerHTML = `
        <input type="text" value="" class="${inputClass}" placeholder="Nouvel élément...">
        <button type="button" class="btn-del" onclick="removeListItem(this.parentElement)">✕</button>
    `;
    container.appendChild(div);
}

// Map unique IDs
let idCounter = 99;

function addSelectionCard() {
    idCounter++;
    const container = document.getElementById('selection-cards-container');
    const div = document.createElement('div');
    div.className = 'item-entry sel-card-entry';
    div.dataset.index = idCounter;
    div.innerHTML = `
        <div class="item-header"><strong>New Card</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete</button></div>
        ${createInput(`sel-title-${idCounter}`, 'Title', 'New')}
        ${createInput(`sel-link-${idCounter}`, 'URL Link', '#')}
        ${createImageSelect(`sel-img-${idCounter}`, 'Image', '')}
        <div class="form-row">
            <label><input type="checkbox" id="sel-tall-${idCounter}"> Vertical format (Tall)</label>
        </div>
    `;
    container.appendChild(div);
}

function addThemeCard() {
    idCounter++;
    const container = document.getElementById('themes-cards-container');
    const div = document.createElement('div');
    div.className = 'item-entry theme-card-entry';
    div.dataset.index = idCounter;
    div.innerHTML = `
        <div class="item-header"><strong>New Theme</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete</button></div>
        <div class="form-row-inline">
            ${createInput(`theme-title-${idCounter}`, 'Title', 'Title')}
            ${createInput(`theme-link-${idCounter}`, 'URL Link', '#')}
        </div>
        ${createImageSelect(`theme-img-${idCounter}`, 'Image', '')}
    `;
    container.appendChild(div);
}

function addDestCard() {
    idCounter++;
    const container = document.getElementById('dest-cards-container');
    const div = document.createElement('div');
    div.className = 'item-entry dest-card-entry';
    div.dataset.index = idCounter;
    div.innerHTML = `
        <div class="item-header"><strong>New Destination</strong> <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete</button></div>
        <div class="form-row-inline">
            ${createInput(`dest-name-${idCounter}`, 'Name', 'Location')}
            ${createInput(`dest-link-${idCounter}`, 'URL Link', '#')}
        </div>
        ${createImageSelect(`dest-img-${idCounter}`, 'Image', '')}
        ${createInput(`dest-grad-${idCounter}`, 'Gradient (if no image)', 'linear-gradient(135deg, #1a5c4b, #2d8b78)')}
    `;
    container.appendChild(div);
}

function addNavItem() {
    idCounter++;
    const container = document.getElementById('nav-items-container');
    const div = document.createElement('div');
    div.className = 'item-entry nav-item-entry';
    div.dataset.index = idCounter;
    div.style.borderLeft = '4px solid var(--accent)';
    div.innerHTML = `
        <div class="item-header">
            <strong>New Menu</strong> 
            <div>
                <button type="button" class="btn-outline" style="padding: 4px 8px; font-size: 0.8rem;" onclick="addNavSubItem(${idCounter})">+ Sub-menu</button>
                <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete</button>
            </div>
        </div>
        <div class="form-row-inline">
            <div class="form-col"><label>Name</label><input type="text" id="nav-label-${idCounter}" class="form-control" value="New"></div>
            <div class="form-col"><label>URL Link</label><input type="text" id="nav-link-${idCounter}" class="form-control" value="#"></div>
        </div>
        <div id="nav-children-container-${idCounter}" style="margin-top: 10px; padding-left: 20px; border-left: 2px dashed rgba(255,255,255,0.1);"></div>
    `;
    container.appendChild(div);
}

function addNavSubItem(parentIndex) {
    idCounter++;
    const container = document.getElementById(`nav-children-container-${parentIndex}`);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'item-entry nav-subitem-entry';
    div.dataset.parent = parentIndex;
    div.dataset.subindex = idCounter;
    div.style.padding = '10px';
    div.style.marginBottom = '10px';
    div.style.background = 'rgba(0,0,0,0.2)';

    div.innerHTML = `
        <div class="item-header" style="opacity: 0.7; font-size: 0.8rem; margin-bottom: 5px;">
            New Sub-menu 
            <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">✕</button>
        </div>
        <div class="form-row-inline">
            <div class="form-col"><input type="text" id="nav-sublabel-${parentIndex}-${idCounter}" class="form-control" value="Sub-menu" placeholder="Name"></div>
            <div class="form-col"><input type="text" id="nav-sublink-${parentIndex}-${idCounter}" class="form-control" value="#" placeholder="URL"></div>
        </div>
    `;
    container.appendChild(div);
}

// ---------- IMAGE MANAGER & MODAL ----------
function setupImageModal() {
    // Quick upload click
    quickUploadZone.addEventListener('click', () => quickUploadInput.click());

    // Drag & drop
    quickUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        quickUploadZone.classList.add('dragover');
    });
    quickUploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        quickUploadZone.classList.remove('dragover');
    });
    quickUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        quickUploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleUpload(e.dataTransfer.files[0]);
        }
    });

    quickUploadInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleUpload(e.target.files[0]);
        }
    });
}

function openImageSelector(inputId) {
    currentImageInput = document.getElementById(inputId);
    renderImageGrid();
    imageModal.classList.add('open');
}

function closeImageSelector() {
    imageModal.classList.remove('open');
    currentImageInput = null;
}

function selectImage(imgPath) {
    if (currentImageInput) {
        currentImageInput.value = imgPath;
        // Update preview
        const previewEl = document.getElementById(`preview-${currentImageInput.id}`);
        if (previewEl) {
            previewEl.innerHTML = `<img src="/${imgPath}" alt="Preview">`;
        }
    }
    closeImageSelector();
}

function renderImageGrid() {
    if (!modalImageGrid) return;

    if (imagesList.length === 0) {
        modalImageGrid.innerHTML = '<p style="color:var(--text-muted); grid-column:1/-1;">Aucune image disponible.</p>';
        return;
    }

    modalImageGrid.innerHTML = imagesList.map(img => `
        <div class="image-thumb" onclick="selectImage('${img.path}')" title="${img.name}">
            <img src="/${img.path}" loading="lazy">
            <div class="img-name">${img.name}</div>
        </div>
    `).join('');
}

async function handleUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Veuillez sélectionner une image', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const prevText = quickUploadZone.innerHTML;
    quickUploadZone.innerHTML = '<p>Téléchargement en cours...</p>';

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            showToast('Image envoyée avec succès');
            await fetchImages();
            // Automatically select if opened via input
            if (currentImageInput) {
                selectImage(data.path);
            } else {
                // If just uploading from media tab
                renderImagesTab();
            }
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        showToast('Erreur lors du téléchargement: ' + err.message, 'error');
    } finally {
        quickUploadZone.innerHTML = prevText;
        quickUploadInput.value = ''; // Parse input
    }
}

// ---------- STANDALONE TABS (Images & Settings) ----------
function renderImagesTab() {
    const panel = document.getElementById('panel-images');
    if (!panel) return;

    panel.innerHTML = `
        <div class="card">
            <div class="card-header"><h3>Media Manager</h3></div>
            <div class="upload-zone" id="tabUploadZone" style="margin-bottom: 24px;">
                <div class="upload-icon">☁️</div>
                <p>Click to upload new images</p>
                <input type="file" id="tabUploadInput" accept="image/*" style="display:none">
            </div>
            <h4 style="margin-bottom: 12px; font-size: 0.9rem;">Library</h4>
            <div class="image-grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">
                ${imagesList.length ? imagesList.map(img => `
                    <div class="image-thumb" title="${img.name}">
                        <img src="/${img.path}" loading="lazy">
                        <div class="img-name">${img.name}</div>
                    </div>
                `).join('') : '<p style="color:var(--text-muted)">No images found.</p>'}
            </div>
        </div>
    `;

    // Setup tab upload
    const btn = document.getElementById('tabUploadZone');
    const inp = document.getElementById('tabUploadInput');
    if (btn && inp) {
        btn.addEventListener('click', () => inp.click());
        inp.addEventListener('change', (e) => {
            if (e.target.files.length) handleUpload(e.target.files[0]);
        });
    }
}

function renderSettingsTab() {
    const panel = document.getElementById('panel-settings');
    if (!panel) return;

    panel.innerHTML = `
        <div class="card" style="max-width: 500px">
            <div class="card-header"><h3>Update Password</h3></div>
            <form id="form-password">
                <div class="form-row">
                    <label for="currentPwd">Current Password</label>
                    <input type="password" id="currentPwd" required>
                </div>
                <div class="form-row">
                    <label for="newPwd">New Password</label>
                    <input type="password" id="newPwd" required>
                </div>
                <button type="submit" class="btn-save" style="margin-top: 10px">Update</button>
            </form>
        </div>
    `;

    document.getElementById('form-password').addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPwd').value;
        const newPassword = document.getElementById('newPwd').value;

        try {
            const res = await fetch('/api/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (data.success) {
                showToast('Password updated successfully', 'success');
                e.target.reset();
            } else {
                showToast(data.error || 'Error', 'error');
            }
        } catch (err) {
            showToast('Server error', 'error');
        }
    });
}

// ---------- PAGE MANAGEMENT (STRUCTURE) ----------
function renderPagesTab() {
    const panel = document.getElementById('panel-pages');
    if (!panel) return;

    panel.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>${_t('pages_header')}</h3>
                <button type="button" class="btn-add" onclick="showNewPageModal()">+ New Page</button>
            </div>
            <div id="page-tree-list" style="margin-top:20px">
                <!-- Hierarchical list rendered here -->
            </div>
        </div>
    `;

    renderPageTree();
}

function renderPageTree() {
    const container = document.getElementById('page-tree-list');
    if (!container) return;

    // Use pageList which contains hierarchical info from getPageTree API
    function buildTreeHtml(nodes, level = 0) {
        let html = '';
        nodes.forEach(node => {
            html += `
                <div class="tree-item" style="margin-left: ${level * 20}px; border-left: 2px solid var(--accent-light); padding: 10px; margin-bottom: 5px; background: rgba(255,255,255,0.02); border-radius: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 600; color: var(--accent);">${escapeHtml(node.id)}</span>
                            <small style="color: grey; margin-left: 10px;">/${node.fullPath}</small>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="editPageContent('${node.id}')">Edit Content</button>
                            <button class="btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="editPageStructure('${node.id}')">Settings</button>
                            <button class="btn-del" style="padding: 2px 8px; font-size: 0.75rem;" onclick="deletePage('${node.id}')">×</button>
                        </div>
                    </div>
                </div>
            `;
            if (node.children && node.children.length > 0) {
                html += buildTreeHtml(node.children, level + 1);
            }
        });
        return html;
    }

    // We need to fetch the tree structure
    fetch(`/api/pages?lang=${currentLang}`).then(r => r.json()).then(data => {
        // pageList from server is already a tree if getPageTree works as expected
        container.innerHTML = buildTreeHtml(data);
    });
}

async function editPageContent(id) {
    currentPageId = id;
    currentSection = 'page-editor';
    await fetchTranslation(id);
}

function renderDynamicPageEditor() {
    let sectionsHtml = (siteContent.sections || []).map((s, i) => `
        <div class="item-entry page-section-entry" data-index="${i}" data-type="${s.type}">
            <div class="item-header">
                <strong>Block: ${s.type.toUpperCase()}</strong>
                <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete Block</button>
            </div>
            ${renderSectionFields(s, i)}
        </div>
    `).join('');

    return `
        <div class="section-panel active" id="panel-page-editor">
            <div class="card">
                <div class="card-header">
                    <h3>Edit Content: ${currentPageId}</h3>
                    <button type="button" class="btn-outline" onclick="renderPagesTab()">← Back to list</button>
                </div>
                <form id="form-page-meta">
                     ${createInput('page-title', 'Title (Nav & SEO)', siteContent.title)}
                     ${createTextarea('page-description', 'Meta Description', siteContent.description)}
                     ${currentPageId !== 'home' ? `
                        <div class="form-row-inline">
                            ${createInput('page-category', 'Category Label', siteContent.category || '')}
                        </div>
                     ` : ''}
                </form>
            </div>

            ${currentPageId !== 'home' ? `
            <div class="card" style="margin-top:20px">
                <div class="card-header"><h3>Page Hero</h3></div>
                <form id="form-page-hero">
                    ${createInput('page-hero-heading', 'Hero Heading', siteContent.hero?.heading || '')}
                    ${createInput('page-hero-subtitle', 'Hero Subtitle', siteContent.hero?.subtitle || '')}
                    ${createImageSelect('page-hero-bg', 'Background Image', siteContent.hero?.image || '')}
                </form>
            </div>

            <div class="card" style="margin-top:20px">
                <div class="card-header"><h3>Sidebar (Quick Facts)</h3></div>
                <form id="form-page-sidebar">
                    <div class="form-row-inline">
                        ${createInput('page-sidebar-duration', 'Duration', siteContent.sidebar?.duration || '')}
                        ${createInput('page-sidebar-price', 'Tariff', siteContent.sidebar?.price || '')}
                        ${createInput('page-sidebar-difficulty', 'Level', siteContent.sidebar?.difficulty || '')}
                    </div>
                    ${createImageSelect('page-sidebar-map', 'Map Image', siteContent.sidebar?.mapImage || '')}
                </form>
            </div>
            ` : ''}

            <div class="card" style="margin-top:20px">
                <div class="card-header">
                    <h3>Content Blocks</h3>
                    <div>
                        <button type="button" class="btn-add" style="font-size:0.8rem;" onclick="addContentBlock('rich-text')">+ Text</button>
                        <button type="button" class="btn-add" style="font-size:0.8rem; margin-left:5px;" onclick="addContentBlock('image-text')">+ Image & Text</button>
                        <button type="button" class="btn-add" style="font-size:0.8rem; margin-left:5px;" onclick="addContentBlock('accordion')">+ Accordion</button>
                        <button type="button" class="btn-add" style="font-size:0.8rem; margin-left:5px;" onclick="addContentBlock('tour-grid')">+ Tour Grid</button>
                    </div>
                </div>
                <div id="page-blocks-container">
                    ${sectionsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderSectionFields(s, i) {
    if (s.type === 'rich-text') {
        return `<div class="form-row"><label>HTML Content</label><textarea class="form-control" style="height:200px" data-field="content">${escapeHtml(s.content)}</textarea></div>`;
    }
    if (s.type === 'image-text') {
        return `
            ${createInput(`sec-heading-${i}`, 'Heading', s.heading, 'text', 'data-field="heading"')}
            <div class="form-row"><label>Text</label><textarea class="form-control" data-field="text">${escapeHtml(s.text)}</textarea></div>
            ${createImageSelect(`sec-img-${i}`, 'Image', s.image)}
            <div class="form-row"><label><input type="checkbox" data-field="reverse" ${s.reverse ? 'checked' : ''}> Reverse layout</label></div>
        `;
    }
    if (s.type === 'accordion') {
        const items = (s.items || []).map((item, j) => `
            <div class="sub-item-entry" style="background:rgba(0,0,0,0.2); padding:10px; margin-bottom:10px; border-radius:4px;">
                <input type="text" class="form-control" data-subfield="title" value="${escapeHtml(item.title)}" placeholder="Title">
                <textarea class="form-control" data-subfield="content" placeholder="Content">${escapeHtml(item.content)}</textarea>
                <button type="button" class="btn-del" onclick="this.parentElement.remove()">Remove Item</button>
            </div>
        `).join('');
        return `
            <div class="form-row"><label>Section Heading</label><input type="text" class="form-control" data-field="heading" value="${escapeHtml(s.heading || '')}"></div>
            <div class="sub-items-container">${items}</div>
            <button type="button" class="btn-outline" onclick="addAccordionItem(this.previousElementSibling)">+ Add Item</button>
        `;
    }
    if (s.type === 'tour-grid') {
        const items = (s.items || []).map((item, j) => `
            <div class="sub-item-entry" style="background:rgba(0,0,0,0.2); padding:10px; margin-bottom:10px; border-radius:4px;">
                <input type="text" class="form-control" data-subfield="title" value="${escapeHtml(item.title)}" placeholder="Tour Name">
                <textarea class="form-control" data-subfield="description" placeholder="Description">${escapeHtml(item.description)}</textarea>
                <input type="text" class="form-control" data-subfield="link" value="${escapeHtml(item.link)}" placeholder="Link URL">
                ${createImageSelect(`tour-img-${i}-${j}`, 'Image', item.image)}
                <button type="button" class="btn-del" onclick="this.parentElement.remove()">Remove Card</button>
            </div>
        `).join('');
        return `
            <div class="form-row"><label>Section Heading</label><input type="text" class="form-control" data-field="heading" value="${escapeHtml(s.heading || '')}"></div>
            <div class="sub-items-container">${items}</div>
            <button type="button" class="btn-outline" onclick="addTourCard(this.previousElementSibling, ${i})">+ Add Card</button>
        `;
    }
    return '';
}

function updateDynamicPageData() {
    siteContent.title = document.getElementById('page-title').value;
    siteContent.description = document.getElementById('page-description').value;
    if (currentPageId !== 'home') {
        siteContent.category = document.getElementById('page-category').value;
        siteContent.hero = {
            heading: document.getElementById('page-hero-heading').value,
            subtitle: document.getElementById('page-hero-subtitle').value,
            image: document.getElementById('page-hero-bg').value
        };
        siteContent.sidebar = {
            duration: document.getElementById('page-sidebar-duration').value,
            price: document.getElementById('page-sidebar-price').value,
            difficulty: document.getElementById('page-sidebar-difficulty').value,
            mapImage: document.getElementById('page-sidebar-map').value
        };
    }

    const sections = [];
    document.querySelectorAll('.page-section-entry').forEach(el => {
        const type = el.dataset.type;
        const s = { type };
        if (type === 'rich-text') {
            s.content = el.querySelector('[data-field="content"]').value;
        } else if (type === 'image-text') {
            s.heading = el.querySelector('[data-field="heading"]')?.value || '';
            s.text = el.querySelector('[data-field="text"]').value;
            s.image = el.querySelector('.image-path-input').value;
            s.reverse = el.querySelector('[data-field="reverse"]').checked;
        } else if (type === 'accordion') {
            s.heading = el.querySelector('[data-field="heading"]').value;
            s.items = Array.from(el.querySelectorAll('.sub-item-entry')).map(sub => ({
                title: sub.querySelector('[data-subfield="title"]').value,
                content: sub.querySelector('[data-subfield="content"]').value
            }));
        } else if (type === 'tour-grid') {
            s.heading = el.querySelector('[data-field="heading"]').value;
            s.items = Array.from(el.querySelectorAll('.sub-item-entry')).map(sub => ({
                title: sub.querySelector('[data-subfield="title"]').value,
                description: sub.querySelector('[data-subfield="description"]').value,
                link: sub.querySelector('[data-subfield="link"]').value,
                image: sub.querySelector('.image-path-input').value
            }));
        }
        sections.push(s);
    });
    siteContent.sections = sections;
}

// ---------- NEW PAGE / STRUCTURE MODALS ----------
function showNewPageModal() {
    const parentOptions = pageList.map(p => `<option value="${p.id}">${p.id}</option>`).join('');
    
    confirmAction('Create New Page', `
        <div class="form-row">
            <label>Page ID (Unique ID, e.g. "bali")</label>
            <input type="text" id="modal-page-id" class="form-control" placeholder="bali">
        </div>
        <div class="form-row">
            <label>Parent Page (Optional)</label>
            <select id="modal-page-parent" class="form-control">
                <option value="">(None)</option>
                ${parentOptions}
            </select>
        </div>
        <div class="form-row">
            <label>URL Slug (e.g. "bali-luxury-travel")</label>
            <input type="text" id="modal-page-slug" class="form-control" placeholder="bali-luxury-travel">
        </div>
    `, async () => {
        const id = document.getElementById('modal-page-id').value.trim();
        const parentId = document.getElementById('modal-page-parent').value || null;
        const slug = document.getElementById('modal-page-slug').value.trim();

        if (!id || !slug) return showToast('ID and Slug are required', 'error');

        const res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, parentId, slug })
        });
        if (res.ok) {
            showToast('Page structure created!', 'success');
            await fetchData();
            renderPagesTab();
        } else {
            showToast('Failed to create page', 'error');
        }
    });
}

function editPageStructure(pageId) {
    const page = findPageInList(pageList, pageId);
    if (!page) return;

    const parentOptions = pageList
        .filter(p => p.id !== pageId)
        .map(p => `<option value="${p.id}" ${page.parentId === p.id ? 'selected' : ''}>${p.id}</option>`).join('');

    confirmAction('Edit Page Settings', `
        <div class="form-row">
            <label>Parent Page</label>
            <select id="modal-edit-parent" class="form-control">
                <option value="">(None)</option>
                ${parentOptions}
            </select>
        </div>
        <div class="form-row">
            <label>URL Slug</label>
            <input type="text" id="modal-edit-slug" class="form-control" value="${page.slug}">
        </div>
    `, async () => {
        const parentId = document.getElementById('modal-edit-parent').value || null;
        const slug = document.getElementById('modal-edit-slug').value.trim();

        if (!slug) return showToast('Slug is required', 'error');

        const res = await fetch(`/api/pages/${pageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentId, slug })
        });
        if (res.ok) {
            showToast('Page structure updated!', 'success');
            await fetchData();
            renderPagesTab();
        } else {
            showToast('Failed to update page', 'error');
        }
    });
}

function findPageInList(list, id) {
    for (let p of list) {
        if (p.id === id) return p;
        if (p.children) {
            const found = findPageInList(p.children, id);
            if (found) return found;
        }
    }
    return null;
}

// ---------- BLOCK HELPERS ----------
function addContentBlock(type) {
    const container = document.getElementById('page-blocks-container');
    if (!container) return;
    const i = document.querySelectorAll('.page-section-entry').length;
    const s = { type, content: '', heading: '', text: '', image: '', reverse: false, items: [] };
    
    const div = document.createElement('div');
    div.className = 'item-entry page-section-entry';
    div.dataset.index = i;
    div.dataset.type = type;
    div.innerHTML = `
        <div class="item-header">
            <strong>Block: ${type.toUpperCase()}</strong>
            <button type="button" class="btn-del" onclick="removeListItem(this.closest('.item-entry'))">Delete Block</button>
        </div>
        ${renderSectionFields(s, i)}
    `;
    container.appendChild(div);
}

function addAccordionItem(container) {
    const div = document.createElement('div');
    div.className = 'sub-item-entry';
    div.style.cssText = 'background:rgba(0,0,0,0.2); padding:10px; margin-bottom:10px; border-radius:4px;';
    div.innerHTML = `
        <input type="text" class="form-control" data-subfield="title" placeholder="Title">
        <textarea class="form-control" data-subfield="content" placeholder="Content"></textarea>
        <button type="button" class="btn-del" onclick="this.parentElement.remove()">Remove Item</button>
    `;
    container.appendChild(div);
}

function addTourCard(container, sectionIndex) {
    const cardIndex = container.querySelectorAll('.sub-item-entry').length;
    const div = document.createElement('div');
    div.className = 'sub-item-entry';
    div.style.cssText = 'background:rgba(0,0,0,0.2); padding:10px; margin-bottom:10px; border-radius:4px;';
    div.innerHTML = `
        <input type="text" class="form-control" data-subfield="title" placeholder="Tour Name">
        <textarea class="form-control" data-subfield="description" placeholder="Description"></textarea>
        <input type="text" class="form-control" data-subfield="link" placeholder="Link URL">
        ${createImageSelect(`tour-img-${sectionIndex}-${cardIndex}`, 'Image', '')}
        <button type="button" class="btn-del" onclick="this.parentElement.remove()">Remove Card</button>
    `;
    container.appendChild(div);
}

function confirmAction(title, content, onConfirm) {
    // Basic modal using a temporary div or existing modal if available
    // For simplicity, let's use the Image Modal structure or similar
    const modalId = 'confirm-modal-' + Date.now();
    const modalHtml = `
        <div id="${modalId}" class="modal active">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close" onclick="document.getElementById('${modalId}').remove()">&times;</span>
                </div>
                <div style="padding: 20px;">
                    ${content}
                    <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                        <button class="btn-outline" onclick="document.getElementById('${modalId}').remove()">Cancel</button>
                        <button class="btn-save" id="btn-modal-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('btn-modal-confirm').onclick = async () => {
        await onConfirm();
        document.getElementById('${modalId}').remove();
    };
}

async function deletePage(id) {
    if (!confirm(`Are you sure you want to delete the page "${id}" and all its translations?`)) return;
    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    if (res.ok) {
        showToast('Page deleted', 'success');
        await fetchData();
        renderPagesTab();
    } else {
        showToast('Failed to delete page', 'error');
    }
}

// Start
init();
