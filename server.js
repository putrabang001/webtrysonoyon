const express = require('express');
const session = require('cookie-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');

// Handlebars Helpers
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('neq', (a, b) => a !== b);


const app = express();
const PORT = 3000;

// ---------- Paths ----------
const DATA_DIR = path.join(process.cwd(), 'data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const GLOBAL_SETTINGS_FILE = path.join(DATA_DIR, 'global_settings.json');
const TRANSLATIONS_DIR = path.join(DATA_DIR, 'translations');

const getTranslationFile = (lang, pageId) => {
    if (pageId === 'home') return path.join(DATA_DIR, `content-${lang}.json`);
    return path.join(DATA_DIR, 'pages', lang, `${pageId}.json`);
};
const getGlobalSettings = () => readJSON(GLOBAL_SETTINGS_FILE);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const IMAGES_DIR = path.join(process.cwd(), 'images');

// ---------- Middleware ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    name: 'td-session',
    keys: ['travel-designer-cms-secret-key-2026'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Static files
app.use('/images', express.static(IMAGES_DIR));
app.use('/style.css', express.static(path.join(process.cwd(), 'style.css')));
app.use('/script.js', express.static(path.join(process.cwd(), 'script.js')));
app.use('/admin', express.static(path.join(process.cwd(), 'admin'), { index: false }));

// ---------- SVG SVG_ICONS Map ----------
const SVG_ICONS = {
    star: '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-9.41l-3.29-3.3L6.3 10.7l4.7 4.71 8-8-1.41-1.42L11 12.59z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    help: '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7.5 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-3.5h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/></svg>'
};

// ---------- Helpers ----------
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    }
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.redirect('/admin/login');
}

// ---------- Image Upload ----------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMAGES_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9-_]/g, '_');
        const unique = Date.now();
        cb(null, `${name}_${unique}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext && mime);
    }
});

function getPageTree(lang) {
    if (!fs.existsSync(PAGES_FILE)) return { tree: [], list: [], map: {} };

    const pages = readJSON(PAGES_FILE);
    const hydratedPages = pages.map(p => {
        try {
            const transFile = getTranslationFile(lang, p.id);
            let translation = fs.existsSync(transFile) ? readJSON(transFile) : null;

            // Fallback to English if translation is missing or incomplete
            if (!translation || (!translation.content && !translation.sections && !translation.meta && lang !== 'en')) {
                const fallbackFile = getTranslationFile('en', p.id);
                if (fs.existsSync(fallbackFile)) {
                    translation = readJSON(fallbackFile);
                } else {
                    console.log(`[DEBUG] No translation found for ${p.id} in ${lang} or en`);
                }
            }
            
            if (!translation) translation = { title: p.id };
            
            const title = translation.title || (translation.meta && translation.meta.title) || p.id;
            return {
                ...p,
                title,
                translation: translation
            };
        } catch (e) {
            console.error(`[ERROR] Failed to read translation for ${p.id} (${lang}):`, e.message);
            return { ...p, title: p.id, translation: { title: p.id, description: "", content: "" } };
        }
    });

    // Build hierarchical tree
    const map = {};
    hydratedPages.forEach(p => map[p.id] = { ...p, children: [] });
    
    // Function to calculate full path recursively (slug-based)
    function calculatePaths(nodeId, parentPath = '') {
        const node = map[nodeId];
        if (!node) return;
        node.fullPath = parentPath ? `${parentPath}/${node.slug}` : (node.slug || '');
        node.children.forEach(child => calculatePaths(child.id, node.fullPath));
    }

    const tree = [];
    hydratedPages.forEach(p => {
        if (p.parentId && map[p.parentId]) {
            map[p.parentId].children.push(map[p.id]);
        } else {
            tree.push(map[p.id]);
        }
    });

    // Calculate paths starting from roots
    tree.forEach(root => calculatePaths(root.id));

    return { tree, list: hydratedPages, map };
}



// ---------- Template Renderer ----------
function getCommonData(lang, fullPath = '') {
    const g = getGlobalSettings();
    const { tree } = getPageTree(lang);
    
    // Load home translation for common elements (footer, contact bar)
    let homeFile = getTranslationFile(lang, 'home');
    if (!fs.existsSync(homeFile) && lang !== 'en') homeFile = getTranslationFile('en', 'home');
    const common = fs.existsSync(homeFile) ? readJSON(homeFile) : {};

    // Build Nav Data (Support nested pages)
    function buildNavData(nodes) {
        return nodes.filter(p => !p.parentId || p.parentId === null).map(item => ({
            title: item.title,
            link: `/${lang}/${item.fullPath}`,
            hasChildren: item.children && item.children.length > 0,
            children: (item.children || []).map(child => ({
                title: child.title,
                link: `/${lang}/${child.fullPath}`
            }))
        }));
    }

    const navItems = buildNavData(tree.filter(n => n.id !== 'home'));
    const navHtml = navItems.map(item => {
        const dropdownHtml = item.hasChildren ? `<ul class="dropdown">${item.children.map(child => `<li><a href="${child.link}">${child.title}</a></li>`).join('')}</ul>` : '';
        return `<li class="nav-item${item.hasChildren ? ' has-dropdown' : ''}"><a href="${item.link}">${item.title}</a>${dropdownHtml}</li>`;
    }).join('');

    // Lang Switcher (Preserve current page path)
    const langsOrder = ['fr', 'en', 'id'];
    const pathSuffix = fullPath ? `/${fullPath.replace(/^\/+|\/+$/g, '')}` : '';
    const langSwitcherHtml = langsOrder.map(l => `<a href="/${l}${pathSuffix}" class="${l === lang ? 'active' : ''}">${l.toUpperCase()}</a>`).join('<span class="lang-sep">|</span>');

    // Localized Strings for UI
    const uiTranslations = {
        en: { contactUs: 'Contact Us' },
        fr: { contactUs: 'Contactez-nous' }, // Closer to "Contact Us" than "Nous Contacter"
        id: { contactUs: 'Kontak Kami' }
    };
    const t = uiTranslations[lang] || uiTranslations.en;

    return { g, common, navHtml, langSwitcherHtml, t };
}

function renderPage(templateName, data, lang, fullPath = '') {
    const { g, common, navHtml, langSwitcherHtml, t } = getCommonData(lang, fullPath);
    const templatePath = path.join(process.cwd(), templateName);
    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(source);

    // Merge page data with common data for footer/contact if missing
    const pageContent = data.content || data;
    const mergedContent = {
        ...common,
        ...pageContent,
        // Ensure footer/contact/site come from common if not specifically in pageContent
        contact: pageContent.contact || common.contact,
        footer: pageContent.footer || common.footer,
        site: pageContent.site || common.site
    };

    return template({
        ...data,
        lang,
        g,
        t, // UI Localized strings
        c: mergedContent,
        site: mergedContent.site, // Direct access for logo and meta
        page: data,
        navHtml,
        langSwitcherHtml
    });
}




// ---------- Public Routes ----------
app.get('/', (req, res) => {
    res.redirect('/en');
});

// Home Page
app.get('/:lang(en|id|fr)', (req, res) => {
    try {
        const lang = req.params.lang;
        const homeFile = getTranslationFile(lang, 'home');
        if (!fs.existsSync(homeFile)) return res.status(404).send('Home translation not found');
        const content = readJSON(homeFile);
        const html = renderPage('index.html', content, lang, '');
        res.send(html);
    } catch (err) {
        console.error('Error rendering home page:', err);
        res.status(500).send('Server error');
    }
});

// Dynamic hierarchical routing
app.get('/:lang(en|id|fr)/:path(*)', (req, res, next) => {
    try {
        const lang = req.params.lang;
        const fullPath = req.params.path.replace(/^\/+|\/+$/g, '');
        if (!fullPath) return next();

        const { tree } = getPageTree(lang);
        
        function findInTree(nodes, targetPath) {
            const searchPath = targetPath.toLowerCase();
            for (const node of nodes) {
                if (node.fullPath.toLowerCase() === searchPath) return node;
                if (node.children) {
                    const found = findInTree(node.children, targetPath);
                    if (found) return found;
                }
            }
            return null;
        }

        const page = findInTree(tree, fullPath);
        console.log(`[ROUTE DEBUG] URL: ${req.url}, lang: ${lang}, fullPath: ${fullPath}, Found: ${!!page}`);
        if (!page) {
            console.log(`[ROUTE DEBUG] Available paths in tree:`, JSON.stringify(tree.map(n => n.fullPath)));
        }

        if (page) {
            // Generate Breadcrumbs
            const segments = fullPath.split('/');
            let currentPath = '';
            const breadcrumbHtml = segments.map((seg, idx) => {
                currentPath += (currentPath ? '/' : '') + seg;
                const segmentPage = findInTree(tree, currentPath);
                const title = segmentPage ? segmentPage.title : seg;
                if (idx === segments.length - 1) return `<span>/</span> <span>${title}</span>`;
                return `<span>/</span> <a href="/${lang}/${currentPath}">${title}</a>`;
            }).join(' ');

            // Sidebar Nav (Children of current page or siblings)
            const sidebarItems = (page.children && page.children.length > 0) ? page.children : 
                               (page.parentId ? findInTree(tree, findInTree(tree, fullPath).parentId)?.children : []);
            
            const sidebarNavHtml = (sidebarItems || []).map(item => 
                `<li><a href="/${lang}/${item.fullPath}" class="${item.id === page.id ? 'active' : ''}">${item.title}</a></li>`
            ).join('');

            const pageTranslation = page.translation;
            let rawContent = pageTranslation.content || pageTranslation.sections || [];
            
            // Normalize content blocks (heading -> title, handle layouts)
            const content = rawContent.map(block => ({
                ...block,
                title: block.title || block.heading || block.name,
                layout: block.layout || (block.reverse ? 'image-right' : 'image-left')
            }));

            const title = pageTranslation.title || (pageTranslation.meta && pageTranslation.meta.title) || page.title;

            const g = getGlobalSettings();
            const contactExpertText = (g.contact.contactExpertText || "").replace("%PAGE_TITLE%", title);

            const html = renderPage('page.html', {
                pageId: page.id,
                ...pageTranslation,
                title,
                content,
                breadcrumbHtml,
                sidebarNavHtml,
                sidebar: { 
                    ...pageTranslation.sidebar,
                    showNav: sidebarItems && sidebarItems.length > 0 
                },
                contactExpertText
            }, lang, fullPath);
            return res.send(html);
        }

        next();
    } catch (err) {
        console.error('Routing error:', err);
        next();
    }
});


// ---------- Admin Routes ----------
app.get('/admin', (req, res) => {
    if (req.session && req.session.authenticated) {
        return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// ---------- Auth API ----------
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const users = readJSON(USERS_FILE);
        if (username === users.username && bcrypt.compareSync(password, users.passwordHash)) {
            req.session.authenticated = true;
            req.session.username = username;
            return res.json({ success: true });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ---------- Global Settings API ----------
app.get('/api/global-settings', requireAuth, (req, res) => {
    try {
        res.json(getGlobalSettings());
    } catch (err) {
        res.status(500).json({ error: 'Failed to read global settings' });
    }
});

app.put('/api/global-settings', requireAuth, (req, res) => {
    try {
        writeJSON(GLOBAL_SETTINGS_FILE, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error('Update global settings error:', err);
        res.status(500).json({ error: 'Failed to update global settings' });
    }
});

// ---------- Translations API ----------
app.get('/api/translations/:lang/:id', requireAuth, (req, res) => {
    try {
        const { lang, id } = req.params;
        const file = getTranslationFile(lang, id);
        if (!fs.existsSync(file)) {
            return res.json({ title: id, description: "", content: "", sections: [] });
        }
        res.json(readJSON(file));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read translation' });
    }
});

app.put('/api/translations/:lang/:id', requireAuth, (req, res) => {
    try {
        const { lang, id } = req.params;
        const file = getTranslationFile(lang, id);
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        writeJSON(file, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error('Update translation error:', err);
        res.status(500).json({ error: 'Failed to update translation' });
    }
});

// ---------- Upload API ----------
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        success: true,
        filename: req.file.filename,
        path: `images/${req.file.filename}`
    });
});

// ---------- Pages API (Structure) ----------
app.get('/api/pages', requireAuth, (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const { tree } = getPageTree(lang);
        res.json(tree);
    } catch (err) {
        console.error('List pages error:', err);
        res.status(500).json({ error: 'Failed to list pages' });
    }
});

app.post('/api/pages', requireAuth, (req, res) => {
    try {
        const { id, parentId, slug } = req.body;
        const pages = readJSON(PAGES_FILE);
        if (pages.find(p => p.id === id)) return res.status(400).json({ error: 'Page ID already exists' });
        
        pages.push({ id, parentId: parentId || null, slug });
        writeJSON(PAGES_FILE, pages);
        res.json({ success: true });
    } catch (err) {
        console.error('Create page error:', err);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

app.put('/api/pages/:id', requireAuth, (req, res) => {
    try {
        const oldId = req.params.id;
        const { id, parentId, slug } = req.body;
        const pages = readJSON(PAGES_FILE);
        const index = pages.findIndex(p => (p.id || p.slug) === oldId); // Robust match
        if (index === -1) return res.status(404).json({ error: 'Page not found' });
        
        // Ensure ID is NEVER LOST
        const newId = id || pages[index].id || oldId;
        
        pages[index] = { 
            id: newId, 
            parentId: parentId || null, 
            slug: slug || pages[index].slug 
        };
        writeJSON(PAGES_FILE, pages);

        // If ID changed, we might need to rename translation files, but let's keep it simple for now and assume ID is immutable or handled by Admin.
        
        res.json({ success: true });
    } catch (err) {
        console.error('Update page error:', err);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

app.delete('/api/pages/:id', requireAuth, (req, res) => {
    try {
        const id = req.params.id;
        let pages = readJSON(PAGES_FILE);
        pages = pages.filter(p => p.id !== id);
        writeJSON(PAGES_FILE, pages);

        // Delete translations
        const languages = ['fr', 'en', 'id'];
        for (const lang of languages) {
            const file = getTranslationFile(lang, id);
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Delete page error:', err);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

// ---------- Images List API ----------
app.get('/api/images', requireAuth, (req, res) => {
    try {
        const files = fs.readdirSync(IMAGES_DIR)
            .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            .map(f => ({
                name: f,
                path: `images/${f}`,
                size: fs.statSync(path.join(IMAGES_DIR, f)).size
            }));
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list images' });
    }
});

// ---------- Password Change API ----------
app.put('/api/password', requireAuth, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const users = readJSON(USERS_FILE);
        if (!bcrypt.compareSync(currentPassword, users.passwordHash)) {
            return res.status(403).json({ error: 'Current password is incorrect' });
        }
        users.passwordHash = bcrypt.hashSync(newPassword, 10);
        writeJSON(USERS_FILE, users);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// ---------- Start Server ----------
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n  🌴 Travel Designer CMS`);
        console.log(`  ══════════════════════════`);
        console.log(`  Website:  http://localhost:${PORT}/`);
        console.log(`  Admin:    http://localhost:${PORT}/admin`);
        console.log(`  ══════════════════════════\n`);
    });
}

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
