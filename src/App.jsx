import { useEffect, useRef, useState } from 'react';

const modules = [
  { id: 'projects', icon: '⌁', name: 'Projects', line: 'Plan the work. See the whole picture.', image: '/assets/screenshots/Projects timelie .png', title: 'Project timeline', signal: 'Shared delivery view', detail: 'See deadlines, dependencies, and ownership in one shared view.' },
  { id: 'manufacturing', icon: '◇', name: 'Manufacturing', line: 'From materials to movement, in sync.', image: '/assets/screenshots/manufacturing 1 .png', title: 'Manufacturing overview', signal: 'Material flow', detail: 'Keep procurement, bills of materials, work orders, and production context close to the work.' },
  { id: 'inventory', icon: '▣', name: 'Inventory', line: 'Know what is moving, before it moves.', image: '/assets/screenshots/Inv 1.png', title: 'Inventory management', signal: 'Live stock view', detail: 'Track stock health, warehouses, orders, and movements without the guesswork.' },
  { id: 'crm', icon: '◎', name: 'CRM', line: 'Turn relationships into repeatable growth.', image: '/assets/screenshots/leads.png', title: 'CRM leads', signal: 'One workspace', detail: 'Give every team a shared operational context for customer work and repeatable growth.' },
  { id: 'finance', icon: '৳', name: 'Finance', line: 'Make every taka accountable.', image: '/assets/screenshots/Accounting.png', title: 'Accounting & Invoices', signal: 'Connected records', detail: 'Keep every invoice and commercial activity connected to the operational record.' },
  { id: 'people', icon: '◉', name: 'People & HR', line: 'Build systems people trust.', image: '/assets/screenshots/Hr .png', title: 'HR management', signal: 'People workflows', detail: 'Manage employees, attendance, leave, and the workflows that keep your organization moving.' },
  { id: 'operations', icon: '⌘', name: 'Operations', line: 'Your business, connected end to end.', image: '/assets/screenshots/Trackers.png', title: 'Operations trackers', signal: 'Custom trackers', detail: 'Shape the workspace, records, and views around how your business actually works.' },
];

const gallery = [
  { image: '/assets/screenshots/Projects timelie .png', label: 'Project timeline', className: 'wide' },
  { image: '/assets/screenshots/BOMs.png', label: 'Bills of materials' },
  { image: '/assets/screenshots/projects kanban .png', label: 'Projects Kanban' },
];

const screenRail = [
  ['/assets/screenshots/manufacturing 1 .png', 'Manufacturing'],
  ['/assets/screenshots/Order management .png', 'Orders'],
  ['/assets/screenshots/sales order .png', 'Sales orders'],
  ['/assets/screenshots/Accounting.png', 'Accounting'],
  ['/assets/screenshots/leads.png', 'CRM leads'],
  ['/assets/screenshots/support tickets .png', 'Support tickets'],
];

function Brand() {
  return <a className="brand" href="#top" aria-label="Mayhem ERP home"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 4c1.6 8.4 4 14.4 16 16-12 1.6-14.4 7.6-16 16-1.6-8.4-4-14.4-16-16 12-1.6 14.4-7.6 16-16Z"/><path d="M20 11c.8 4.8 2.2 8.2 9 9-6.8.8-8.2 4.2-9 9-.8-4.8-2.2-8.2-9-9 6.8-.8 8.2-4.2 9-9Z" className="mark-cut"/></svg></span><span><strong>MAYHEM</strong><small>ERP / BANGLADESH</small></span></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const close = () => setMenuOpen(false);
  return <header className={`site-header${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
    <div className="shell nav-shell"><Brand/><nav className="desktop-nav" aria-label="Primary navigation"><a href="#platform">Platform</a><a href="#why-mayhem">Why Mayhem</a><a href="#demo">Product tour</a></nav><div className="nav-actions"><a className="text-link" href="#contact">Contact us <span>↗</span></a><a className="button button-primary button-small" href="#contact">Request a demo <span>↗</span></a></div><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><span/><span/></button></div>
    <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation"><a href="#platform" onClick={close}>Platform</a><a href="#why-mayhem" onClick={close}>Why Mayhem</a><a href="#demo" onClick={close}>Product tour</a><a href="#contact" onClick={close}>Contact us</a></nav>
  </header>;
}

function Hero({ onVideo, onImage }) {
  return <><section className="hero section-grid" id="top"><div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/><div className="shell hero-layout"><div className="hero-copy reveal"><p className="eyebrow-pill"><span>✦</span> Operations, without the gaps</p><h1>The work is<br/><span className="gradient-text">connected now.</span></h1><p className="hero-lede">Mayhem ERP gives ambitious teams one calm control center for projects, production, inventory, people, customers, and the numbers that keep the lights on.</p><div className="button-row"><a className="button button-primary" href="#contact">See Mayhem in action <span>↗</span></a><button className="button button-outline" type="button" onClick={onVideo}><span className="play-icon">▶</span> Watch the product tour</button></div><div className="trust-row"><span className="avatar violet">MD</span><span className="avatar cyan">BK</span><span className="avatar amber">+</span><p>Built for the pace of<br/><strong>growing businesses</strong></p></div></div><div className="hero-product reveal delay-one"><div className="product-glow"/><button className="product-frame" onClick={() => onImage('/assets/screenshots/war room .png', 'Mayhem ERP executive war room')} type="button"><div className="frame-bar"><span>Executive war room</span><span className="live"><i/> Live workspace</span></div><img src="/assets/screenshots/war room .png" alt="Mayhem ERP executive war room dashboard"/><span className="expand-chip">⌗ View larger</span></button><div className="pulse-card"><div><span>Workspace pulse</span><i/></div><strong>+28.4<small>%</small></strong><p>operations visibility</p><div className="bars"><i/><i/><i/><i/><i/><i/><i/></div></div></div></div><a className="scroll-cue" href="#platform"><span>Scroll to explore</span><b>↓</b></a></section><section className="discipline-strip"><div className="shell"><span className="mono-label">One operating language</span><div><span>Projects</span><span>Manufacturing</span><span>Inventory</span><span>Finance</span><span>People</span><span>Customers</span></div></div></section></>;
}

function Platform({ onImage }) {
  const hrViews = [
    ['/assets/screenshots/Hr .png', 'HR Overview', 'Employee records, profiles, and departmental status'],
    ['/assets/screenshots/Org 1.png', 'Organization Tree', 'Company structure, divisions, and departments'],
    ['/assets/screenshots/org 2.png', 'Team Architecture', 'Reporting lines and unit hierarchy'],
    ['/assets/screenshots/asset.png', 'Asset Allocation', 'Assigned equipment and device inventory'],
  ];
  return <section className="platform section-pad" id="platform"><div className="shell">
    <div className="platform-intro">
      <div className="platform-overview reveal"><div><p className="section-kicker">01 / The platform</p><h2>A clearer view of the moving parts.</h2></div><div className="platform-summary"><p>Mayhem brings every team into the same room — without asking them to work the same way. Select any discipline to see its real product workspace.</p><div className="line-note"><i/> Seven connected disciplines</div></div></div>
      <div className="module-grid">{modules.map(item => <button key={item.id} className="module-card" onClick={() => onImage(item.image, `${item.name} — ${item.title}`)} type="button" aria-label={`Open ${item.name} screenshot`}><img className="module-thumb" src={item.image} alt="" aria-hidden="true"/><span className="module-icon">{item.icon}</span><b>↗</b><h3>{item.name}</h3><p>{item.line}</p><span className="module-action">View screenshot</span></button>)}</div>
    </div>
    <div className="hr-showcase reveal"><div className="hr-heading"><div><p className="section-kicker">People &amp; HR</p><h3>Every people workflow, in one place.</h3></div><p>From employee records and company structure to team hierarchy and asset allocations. Select any screen to open the full view.</p></div><div className="hr-grid">{hrViews.map(([image,title,copy]) => <button key={title} className="hr-card" onClick={() => onImage(image,title)} type="button"><img src={image} alt={`Mayhem ERP ${title}`}/><span><strong>{title}</strong><small>{copy}</small></span></button>)}</div></div>
  </div></section>;
}
function GalleryButton({ image, label, className = '', onImage }) {
  return <button className={`gallery-item ${className}`} onClick={() => onImage(image, label)} type="button"><img src={image} alt={`Mayhem ${label}`}/><span>{label} <b>⌗ Expand</b></span></button>;
}

function Workspace({ onImage }) {
  return <section className="workspace section-pad" id="demo"><div className="shell">
    <div className="workspace-head reveal"><div><p className="section-kicker">02 / Inside the workspace</p><h2>Real work.<br/><span>No theater.</span></h2></div><p>Every frame below is from the Mayhem ERP product — not a concept, not a mockup. Tap any screen to explore it.</p></div>
    <div className="video-showcase reveal"><div className="video-copy"><p className="section-kicker">Product demo</p><h3>See Mayhem at work.</h3><p>Watch the supplied product walkthrough to see connected operations, records, and workflows in action.</p></div><div className="video-frame"><video controls playsInline preload="metadata" poster="/assets/screenshots/war room .png" src="/assets/Mayhem_ERP_Product_Demo.mp4">Your browser does not support HTML video.</video></div></div>
    <div className="gallery gallery-top"><GalleryButton {...gallery[0]} onImage={onImage}/><div className="gallery-stack"><GalleryButton {...gallery[1]} onImage={onImage}/><GalleryButton {...gallery[2]} onImage={onImage}/></div></div>
    <div className="gallery gallery-bottom"><GalleryButton image="/assets/screenshots/Asset register .png" label="Asset register" onImage={onImage}/><article className="difference-card"><span>The difference</span><h3>When information moves at the speed of the business, decisions get lighter.</h3><p>✦ Designed for momentum</p></article></div>
    <div className="more-screens reveal"><div><div><p className="section-kicker">More of Mayhem</p><h3>One system. Every angle.</h3></div></div><div className="screenrail">{screenRail.map(([image,label]) => <button key={label} className="screen-thumb" onClick={() => onImage(image,label)} type="button"><img src={image} alt={label}/><span>{label}</span></button>)}</div></div>
  </div></section>;
}
function Why() {
  const principles = [['01','One source of truth','A project update should not require a meeting, a spreadsheet, and a message thread to verify.'],['02','Built around your rhythm','Configure the tables, views, approvals, and roles your business actually uses.'],['03','Ready for the next chapter','Start focused. Connect more as you grow. Your operating system should grow with you.']];
  return <><section className="why section-pad section-grid" id="why-mayhem"><div className="shell why-grid"><div className="reveal"><p className="section-kicker">03 / Why Mayhem</p><h2>Less chasing.<br/><span className="gradient-text">More knowing.</span></h2><p>Most businesses do not need more software. They need fewer blind spots. Mayhem was built in Bangladesh for teams who are growing fast, carrying complexity, and done piecing together the truth.</p><a className="under-link" href="#contact">Explore the Mayhem approach <span>↗</span></a></div><div className="principles">{principles.map(([num,title,copy]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section><section className="stats"><div className="shell"><article><span>◫</span><h3>1 workspace</h3><p>for the work that keeps your business moving.</p></article><article><span>⌾</span><h3>1 context</h3><p>from Dhaka to wherever your next chapter starts.</p></article><article><span>◇</span><h3>0 guesswork</h3><p>when the right people can see the right signal.</p></article></div></section></>;
}

function Contact() {
  return <section className="contact section-pad" id="contact"><div className="contact-backdrop"/><div className="shell reveal"><p className="section-kicker">04 / Start here</p><h2>Your next clear<br/><span className="gradient-text">decision starts here.</span></h2><p>Tell us where the work gets stuck. We will show you how Mayhem can connect it.</p><div className="button-row"><a className="button button-primary" href="mailto:info@mayhembangladesh.com?subject=Mayhem%20ERP%20demo">Contact us for a demo <span>↗</span></a><a className="button button-outline" href="mailto:info@mayhembangladesh.com">info@mayhembangladesh.com</a></div></div></section>;
}

function Footer() {
  return <footer><div className="shell"><div><Brand/><p>A connected operations platform from Mayhem Softwares Bangladesh.</p><a className="footer-site" href="https://mayhembangladesh.com" target="_blank" rel="noreferrer">Visit Mayhem Bangladesh ↗</a></div><nav><a href="#platform">Platform</a><a href="#demo">Product tour</a><a href="#contact">Contact us</a><span>© 2026 Mayhem Softwares</span></nav></div></footer>;
}

function VideoModal({ open, onClose }) {
  const videoRef = useRef(null);
  useEffect(() => { if (open) videoRef.current?.play().catch(() => {}); else videoRef.current?.pause(); }, [open]);
  if (!open) return null;
  return <div className="modal" role="dialog" aria-modal="true" aria-label="Mayhem ERP product tour"><button className="modal-backdrop" onClick={onClose} aria-label="Close video"/><div className="video-dialog"><button className="modal-close" onClick={onClose} type="button" aria-label="Close video">×</button><video ref={videoRef} controls playsInline preload="metadata" src="/assets/Mayhem_ERP_Product_Demo.mp4"/></div></div>;
}

function ImageModal({ image, onClose }) {
  if (!image) return null;
  return <div className="modal" role="dialog" aria-modal="true" aria-label="Product screenshot"><button className="modal-backdrop" onClick={onClose} aria-label="Close image"/><div className="image-dialog"><div><strong>{image.label}</strong><button className="modal-close" onClick={onClose} type="button" aria-label="Close image">×</button></div><img src={image.src} alt={`Mayhem ERP — ${image.label}`}/></div></div>;
}

export default function App() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const modalOpen = videoOpen || Boolean(modalImage);
  useEffect(() => { document.body.classList.toggle('modal-open', modalOpen); return () => document.body.classList.remove('modal-open'); }, [modalOpen]);
  useEffect(() => { const close = event => { if (event.key === 'Escape') { setVideoOpen(false); setModalImage(null); } }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, []);
  useEffect(() => { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .14 }); document.querySelectorAll('.reveal').forEach(element => observer.observe(element)); return () => observer.disconnect(); }, []);
  const openImage = (src, label) => setModalImage({ src, label });
  return <><Header/><main><Hero onVideo={() => setVideoOpen(true)} onImage={openImage}/><Platform onImage={openImage}/><Workspace onImage={openImage}/><Why/><Contact/></main><Footer/><VideoModal open={videoOpen} onClose={() => setVideoOpen(false)}/><ImageModal image={modalImage} onClose={() => setModalImage(null)}/></>;
}