import { useMemo, useState } from 'react'
import { AlertCircle, ArrowRight, Battery, Check, CheckCircle2, ChevronDown, Clock3, Disc3, Droplets, Gauge, MapPin, Menu, MessageCircle, Phone, Radio, Settings, ShieldCheck, Star, Wrench, X } from 'lucide-react'
import './App.css'
import TyreFinder from './sections/TyreFinder'
import { buildLeadPayload, submitLead as sendLead } from './lib/lead'
import { businessAddress, businessEmail, formSubmitEndpoint, googleBusinessUrl, googleMapsEmbedUrl, phone, phoneLink, whatsapp } from './lib/site'

const services = [
  { icon: Disc3, title: 'Tyre Replacement', text: 'New tyre fitting, balancing and valve replacement for a safe, smooth drive at our Al Quoz 3 workshop.' },
  { icon: Radio, title: 'TPMS Service', text: 'Tyre pressure sensor diagnostics, programming and battery replacement to keep your TPMS alerts working.' },
  { icon: Settings, title: 'Steering Repair', text: 'Steering rack, column and linkage inspection and repair for precise, safe handling.' },
  { icon: Droplets, title: 'Oil & Lubrication', text: 'Engine oil and filter replacement with lubrication checks to keep your vehicle running smoothly.' },
  { icon: Wrench, title: 'Car Denting Painting', text: 'Professional denting, panel repair and painting for a smooth, factory-style finish.' },
  { icon: Disc3, title: 'Puncture repair', text: 'Puncture inspection and repair at our Al Quoz 3 workshop when the damage is safe to fix.' },
  { icon: Battery, title: 'Battery testing & replacement', text: 'Battery testing, diagnostics and replacement at our Al Quoz 3 workshop.' },
  { icon: Gauge, title: '3D wheel alignment & balancing', text: 'Precision alignment and balancing for a smoother, straighter drive.' },
  { icon: Disc3, title: 'Brake pads & rotor skimming', text: 'Brake inspections, pad replacement and disc skimming at our workshop.' },
  { icon: Wrench, title: 'Mechanical & engine repair', text: 'Diagnostics and dependable mechanical repairs at our Al Quoz 3 workshop.' },
  { icon: Disc3, title: 'Suspension & shock absorbers', text: 'Inspection and repair for worn shocks, suspension and steering components.' },
  { icon: Gauge, title: 'Lubrication service & AC repair', text: 'Oil and filter service, AC checks, repair and gas recharge.' },
]
const brands = ['MICHELIN', 'BRIDGESTONE', 'Continental', 'PIRELLI', 'DUNLOP', 'GOODYEAR', 'YOKOHAMA', 'Hankook', 'KUMHO', 'NEXEN', 'TOYO TIRES', 'BFGoodrich']
const priceRows = [
  ['Compact & sedan', '185/65 R15 · 205/55 R16', 'Michelin · Bridgestone · Nexen', 'AED 180–650'],
  ['Crossover & SUV', '225/65 R17 · 235/60 R18', 'Continental · Yokohama · Hankook', 'AED 280–950'],
  ['Premium SUV', '255/55 R19 · 275/45 R20', 'Pirelli · Michelin · Goodyear', 'AED 450–1,600'],
  ['4×4 & off-road', '265/65 R17 · 275/55 R20', 'BFGoodrich · Dunlop · Toyo', 'AED 350–1,350'],
]
const vehicles = [
  { name: 'Mercedes-Benz tyres', size: 'Popular fitments: 225/45 R18 · 245/40 R19', pick: 'Michelin Primacy · Continental PremiumContact', price: 'From AED 420 / tyre', logo: '/images/logos/mercedes-benz.png', alt: 'Mercedes-Benz logo' },
  { name: 'BMW tyres', size: 'Popular fitments: 225/45 R18 · 255/40 R19', pick: 'Bridgestone Potenza · Pirelli P Zero', price: 'From AED 390 / tyre', logo: '/images/logos/bmw.png', alt: 'BMW logo' },
  { name: 'Audi tyres', size: 'Popular fitments: 245/40 R18 · 255/35 R19', pick: 'Continental SportContact · Michelin Pilot Sport', price: 'From AED 410 / tyre', logo: '/images/logos/audi.png', alt: 'Audi logo' },
  { name: 'Range Rover tyres', size: 'Popular fitments: 255/55 R20 · 275/45 R21', pick: 'Pirelli Scorpion · Goodyear Eagle F1', price: 'From AED 690 / tyre', logo: '/images/logos/range-rover.png', alt: 'Land Rover Range Rover logo' },
  { name: 'Porsche tyres', size: 'Popular fitments: 235/40 R19 · 295/35 R20', pick: 'Michelin Pilot Sport · Pirelli P Zero', price: 'From AED 780 / tyre', logo: '/images/logos/porsche.png', alt: 'Porsche logo' },
  { name: 'Toyota Land Cruiser tyres', size: 'Popular fitments: 265/65 R17 · 275/55 R20', pick: 'Dunlop Grandtrek · Bridgestone Dueler', price: 'From AED 460 / tyre', logo: '/images/logos/toyota.png', alt: 'Toyota logo' },
]
const repairs = ['Engine diagnostics & computer scanning', 'Brake pads & disc skimming', 'Car AC repair & gas recharge', 'Suspension repair', 'Minor & major car service packages', 'Gearbox & transmission service']
const faqs = [
  ['How do I arrange a workshop visit?', 'Call or WhatsApp before bringing your vehicle to our Al Quoz 3 workshop so we can confirm availability, required tyres or parts, and the next step.'],
  ['Where should I bring my vehicle for tyre replacement?', 'Please bring your vehicle to our workshop at 3 Umm Suqeim St, Al Quoz 3, Dubai. Call or WhatsApp ahead to confirm parts availability and workshop capacity.'],
  ['Are the tyres 100% genuine and under official warranty?', 'We supply genuine tyres from established brands. Available warranty terms vary by brand and product; ask us to confirm the exact coverage for your selected tyre before fitting.'],
  ['What if my puncture cannot be safely repaired?', 'If damage is near the sidewall, too large, or otherwise unsafe to repair, we’ll explain why and quote a suitable replacement instead. Your safety comes first.'],
  ['What payment methods do you accept at the workshop?', 'Accepted methods may vary by service. Please confirm cash, card or digital payment availability when you book so there are no surprises.'],
  ['Where is your workshop located?', 'Our workshop is at 3 Umm Suqeim St, Al Quoz 3, Dubai. Call or WhatsApp before visiting for directions, opening hours and workshop availability.'],
]
const estimateBases: Record<string, number> = { 'Tyre replacement': 180, 'Puncture repair': 75, 'Battery service': 150, 'Wheel alignment': 180, 'Brake service': 250, 'AC / oil service': 220 }

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [service, setService] = useState('Tyre replacement')
  const [category, setCategory] = useState('Sedan')
  const [tyres, setTyres] = useState('4')
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const estimate = useMemo(() => {
    const multiplier = category === 'Premium SUV' ? 2.8 : category === 'SUV / 4×4' ? 1.8 : 1
    const count = service === 'Tyre replacement' ? Number(tyres) : 1
    return Math.round((estimateBases[service] ?? 180) * multiplier * count)
  }, [category, service, tyres])

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = buildLeadPayload({
      _honey: String(data.get('_honey') ?? ''),
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      service: String(data.get('service') ?? '').trim(),
      lead_source: 'Callback form',
    })
    setLeadStatus('submitting')

    try {
      await sendLead(payload)
      form.reset()
      setLeadStatus('success')
    } catch {
      setLeadStatus('error')
    }
  }

  return <>
    <div className="topline"><span><MapPin size={14} /> Al Quoz 3, Dubai · Tyre & auto repair workshop</span><a href={phoneLink}><Phone size={14} /> {phone}</a><span className="hours"><Clock3 size={14} /> Daily, 8:30 AM – 7:30 PM [Sunday Off]</span></div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="F and T Auto Services home"><img className="brand-logo" src="/images/logos/ftlogonew.webp" alt="F&T Auto Services" /></a>
      <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
        <a onClick={() => setMobileOpen(false)} href="#services">Services</a><a onClick={() => setMobileOpen(false)} href="#tyre-finder">Find tyre size</a><a onClick={() => setMobileOpen(false)} href="#tyres">Tyres & prices</a><a onClick={() => setMobileOpen(false)} href="#vehicles">By vehicle</a><a onClick={() => setMobileOpen(false)} href="#workshop">Workshop</a><a onClick={() => setMobileOpen(false)} href="#faq">FAQs</a>
        <a className="nav-call" href={phoneLink}><Phone size={15} /> Call now</a>
      </nav>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-inner">
          <div className="hero-copy"><span className="eyebrow"><span className="live-dot" /> Tyre Shop & Auto Service in Dubai</span>
            <h1>Dubai’s tyre shop.<br /><em>Workshop care in Al Quoz 3.</em></h1>
            <p>Need new tyres or reliable car repairs? Visit F&T Auto Services in Al Quoz 3 for professional tyre fitting, car repairs, and trusted automotive care at our fully equipped workshop. Drive in today and let our experts take care of your vehicle!</p>
            <div className="hero-actions"><a className="btn btn-lime" href={phoneLink}><Phone size={17} /> Call {phone}</a><a className="btn btn-glass" href={whatsapp} target="_blank" rel="noreferrer"><svg className="whatsapp-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.16 1.6 5.97L.08 24l6.29-1.65a11.87 11.87 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.78h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.73.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.95 9.9Z"/><path fill="currentColor" d="M17.55 14.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg> WhatsApp us</a></div>
            <div className="proof-row"><span><Check size={15} /> Visit Our Workshop in Al Quoz 3</span><span><Check size={15} /> Genuine tyre brands</span><span><Check size={15} /> Upfront quotes</span></div>
          </div>
          <form className="hero-form" id="callback" action={formSubmitEndpoint} method="POST" onSubmit={submitLead}>
            <div className="form-kicker">NEED OUR HELP?</div><h2>Request a callback</h2><p>Tell us what you need and we’ll confirm the next step.</p>
            <input type="hidden" name="_subject" value="New website lead — F&T Auto Services" readOnly />
            <input type="hidden" name="_template" value="table" readOnly />
            <input type="hidden" name="_url" value={window.location.href} readOnly />
            <input type="hidden" name="page_url" value={window.location.href} readOnly />
            <input className="form-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="form-grid">
              <label>Your name<input required name="name" placeholder="e.g. Ahmed" autoComplete="name" /></label>
              <label>Phone number<input required name="phone" type="tel" placeholder="+971 5X XXX XXXX" autoComplete="tel" /></label>
              <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" /></label>
              <label>Service needed<select required name="service"><option value="">Select a service</option><option>Puncture repair</option><option>Battery testing & replacement</option><option>Wheel alignment</option><option>Brake service</option><option>Mechanical & engine repair</option><option>Car Denting Painting</option><option>Electrical Repair</option></select></label>
            </div>
            <button className="btn btn-dark form-submit" type="submit" disabled={leadStatus === 'submitting'}>{leadStatus === 'submitting' ? 'Sending request…' : leadStatus === 'success' ? 'Send another request' : 'Request a callback'} <ArrowRight size={17} /></button>
            {leadStatus === 'success' && <p className="form-status success" role="status"><CheckCircle2 size={17} /> Thanks—your request has been received. We’ll call you shortly.</p>}
            {leadStatus === 'error' && <p className="form-status error" role="alert"><AlertCircle size={17} /> We couldn’t send your request. Please call or WhatsApp us instead.</p>}
            <span className="form-note"><ShieldCheck size={14} /> No obligation. Your details stay private.</span>
          </form>
        </div>
      </section>

      <section className="trust-strip"><div><strong>12+</strong><span>Premium Tyre Brands</span></div><i /><div><strong>Full-Service</strong><span>Auto Repair Workshop</span></div><i /><div><strong>Expert Technicians</strong><span>Skilled Vehicle Care</span></div><i /><div><strong>Al Quoz 3</strong><span>Convenient Location</span></div></section>

      <div className="tf-divider" aria-hidden="true" />

      <TyreFinder />

      <section className="section services-section" id="services"><div className="section-heading"><div><span className="eyebrow dark-eyebrow">WHAT WE CAN DO FOR YOU</span><h2>Top requested <em>services</em></h2></div><p>From tyre fitting and puncture repairs to scheduled maintenance, our Al Quoz 3 workshop looks after your vehicle.</p></div>
        <div className="service-grid">{services.map(({ icon: Icon, title, text }, i) => <a className="service-card" key={title} href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Ask about ${title}`}><div className="service-icon"><Icon size={22} /></div><span className="service-index">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p><span className="service-arrow"><ArrowRight size={17} /></span></a>)}</div>
      </section>

      <section className="services-cta"><div className="services-cta-copy"><span className="eyebrow">TYRE & CAR CARE AT OUR WORKSHOP</span><h2>We’re ready when you need us.</h2><p>Visit our Al Quoz 3 workshop for tyre fitting and professional car repairs.</p></div><div className="services-cta-actions"><a className="btn services-call" href={phoneLink}><Phone size={17} /> Call us</a><a className="btn services-whatsapp" href={whatsapp} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.16 1.6 5.97L.08 24l6.29-1.65a11.87 11.87 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.78h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.73.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.95 9.9Z"/><path fill="currentColor" d="M17.55 14.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg> WhatsApp</a><a className="btn services-form" href="#callback"><ArrowRight size={17} /> Request a callback</a></div></section>

      <section className="brand-section" id="tyres"><div className="section-heading"><div><span className="eyebrow dark-eyebrow">GENUINE BRANDS · RIGHT FIT</span><h2>Tyres for every <em>journey</em></h2></div><p>Choose from renowned global tyre makers. Exact availability depends on your size and vehicle.</p></div><div className="brand-grid">{brands.map((brand, i) => <div className={`brand-tile brand-${i}`} key={brand}>{brand}</div>)}</div></section>

      <section className="price-section"><div className="price-copy"><span className="eyebrow">CLEAR GUIDANCE BEFORE YOU BUY</span><h2>Dubai tyre<br /><em>price guide</em></h2><p>Tyre prices vary by size, model, load rating and stock. Use these indicative per-tyre ranges as a guide; ask us for a fitted quote for your exact vehicle.</p><a className="btn btn-lime" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Get exact tyre quote</a><span className="price-footnote">Indicative AED ranges only. Fitting, balancing, valves and VAT inclusions should be confirmed in your quote.</span></div>
        <div className="table-wrap"><table><thead><tr><th>Vehicle category</th><th>Popular sizes</th><th>Suggested brands</th><th>Price / tyre</th><th>Ask</th></tr></thead><tbody>{priceRows.map((row) => <tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td className="price-cell">{row[3]}</td><td><a className="table-link" href={`${whatsapp}&text=Hi%2C%20please%20quote%20tyres%20for%20${encodeURIComponent(row[0])}.`} target="_blank" rel="noreferrer">Quote <ArrowRight size={14} /></a></td></tr>)}</tbody></table></div>
      </section>

      <section className="section vehicle-section" id="vehicles"><div className="section-heading"><div><span className="eyebrow dark-eyebrow">TYRE FITMENT BY VEHICLE</span><h2>Find tyres for your <em>car</em></h2></div><p>Specifications shown are common fitments, not a substitute for your vehicle placard. We verify size, load and speed rating before fitting.</p></div><div className="vehicle-grid">{vehicles.map((car, i) => <article className="vehicle-card" key={car.name}><div className="vehicle-top"><span className="vehicle-number">0{i + 1} / FITMENT GUIDE</span>{car.logo ? <span className="vehicle-logo-box"><img className="vehicle-logo" src={car.logo} alt={car.alt || car.name.replace(' tyres', '')} loading="lazy" /></span> : <span className="vehicle-wheel"><Disc3 size={21} /></span>}</div><h3>{car.name}</h3><p className="fitment">{car.size}</p><div className="vehicle-reco"><span>POPULAR PICKS</span><p>{car.pick}</p></div><div className="vehicle-bottom"><strong>{car.price}</strong><a href={`${whatsapp}&text=${encodeURIComponent(`Hi, I need tyres for ${car.name.replace(' tyres', '')}. Please advise available sizes and a fitted quote.`)}`} target="_blank" rel="noreferrer">Ask for fitment <ArrowRight size={15} /></a></div></article>)}</div><p className="fine-print">Starting prices are illustrative estimates for common sizes and can change with stock, specification and fitting requirements. Confirm your registration or current tyre size for an exact quote.</p></section>

      <section className="estimator-section" id="estimator"><div className="estimator-intro"><span className="eyebrow">A QUICK STARTING POINT</span><h2>Estimate your<br /><em>service cost</em></h2><p>Adjust the options to see an indicative starting price. We’ll confirm the final quote after inspecting your vehicle and checking the parts needed.</p><div className="estimate-note"><Clock3 size={19} /><span><strong>Workshop turnaround</strong><br />Timing depends on inspection, parts availability and the workshop queue.</span></div></div><div className="estimator-card"><div className="estimator-head"><span>INSTANT ESTIMATOR</span><span className="estimator-status"><i /> LIVE ESTIMATE</span></div><label>Vehicle category<select value={category} onChange={(e) => setCategory(e.target.value)}><option>Sedan</option><option>SUV / 4×4</option><option>Premium SUV</option></select></label><label>Required service<select value={service} onChange={(e) => setService(e.target.value)}><option>Tyre replacement</option><option>Puncture repair</option><option>Battery service</option><option>Wheel alignment</option><option>Brake service</option><option>AC / oil service</option></select></label>{service === 'Tyre replacement' && <label>Number of tyres<select value={tyres} onChange={(e) => setTyres(e.target.value)}><option value="1">1 tyre</option><option value="2">2 tyres</option><option value="4">4 tyres</option></select></label>}<div className="estimate-result"><span>ESTIMATED STARTING PRICE</span><strong>AED {estimate.toLocaleString()}<small>+</small></strong><small>Final quote confirmed before work begins.</small></div><a className="btn btn-dark" href={`${whatsapp}&text=${encodeURIComponent(`Hi, I'd like a quote: ${category}, ${service}${service === 'Tyre replacement' ? `, ${tyres} tyres` : ''}. Estimated starting price shown: AED ${estimate}.`)}`} target="_blank" rel="noreferrer">Get my confirmed quote <ArrowRight size={17} /></a></div></section>

      <section className="why-section"><div className="why-image" role="img" aria-label="Technician changing a car tyre in a workshop"/><div className="why-copy"><span className="eyebrow">THE F&T DIFFERENCE</span><h2>Good service.<br /><em>Zero guesswork.</em></h2><div className="why-points"><div><span><Wrench size={20} /></span><p><strong>Experienced workshop technicians</strong><small>Skilled technicians handle fitting, diagnostics and repairs using our workshop equipment.</small></p></div><div><span><ShieldCheck size={20} /></span><p><strong>Genuine tyres and parts</strong><small>Options from trusted brands, with product warranty details explained.</small></p></div><div><span><Check size={20} /></span><p><strong>Transparent upfront pricing</strong><small>Approve the quote before we start. No surprise add-ons.</small></p></div><div><span><Wrench size={20} /></span><p><strong>Full-service auto repair workshop in Al Quoz 3</strong><small>Professional tyre and automotive repairs at our Al Quoz 3 location.</small></p></div></div><a className="text-link" href={phoneLink}>Speak to our team <ArrowRight size={16} /></a></div></section>

      <section className="repair-section"><div className="section-heading"><div><span className="eyebrow dark-eyebrow">MORE THAN TYRES</span><h2>Additional car repair <em>services</em></h2></div><p>Book practical repairs and scheduled maintenance with our Al Quoz workshop team.</p></div><div className="repair-grid">{repairs.map((item, i) => <a href={`${whatsapp}&text=${encodeURIComponent(`Hi, I'd like to ask about ${item}.`)}`} className="repair-item" key={item} target="_blank" rel="noreferrer"><span>0{i + 1}</span><strong>{item}</strong><ArrowRight size={18} /></a>)}</div></section>

      <section className="comparison-section"><div className="section-heading"><div><span className="eyebrow dark-eyebrow">PICK THE RIGHT SERVICE</span><h2>Service <em>comparison</em></h2></div><p>Not sure what you need? Tell us what you’re experiencing and we’ll recommend the right next step.</p></div><div className="table-wrap comparison-wrap"><table><thead><tr><th>Service</th><th>Best for</th><th>Typical workshop time*</th><th>Book</th></tr></thead><tbody><tr><td><strong>Tyre replacement</strong></td><td>Worn, damaged or flat tyres</td><td>30–60 min</td><td><a href={whatsapp} target="_blank" rel="noreferrer">Book <ArrowRight size={14} /></a></td></tr><tr><td><strong>Puncture repair</strong></td><td>Repairable tread punctures</td><td>30–45 min</td><td><a href={whatsapp} target="_blank" rel="noreferrer">Book <ArrowRight size={14} /></a></td></tr><tr><td><strong>Wheel alignment</strong></td><td>Uneven wear or pulling</td><td>45–90 min</td><td><a href={whatsapp} target="_blank" rel="noreferrer">Book <ArrowRight size={14} /></a></td></tr><tr><td><strong>Car AC / mechanical repair</strong></td><td>Warning signs, weak AC, noises</td><td>Inspection first</td><td><a href={whatsapp} target="_blank" rel="noreferrer">Book <ArrowRight size={14} /></a></td></tr></tbody></table></div><p className="fine-print">*Indicative workshop service durations; inspection, queue and parts availability affect completion time.</p></section>

      <section className="areas-section" id="workshop"><div className="areas-copy"><span className="eyebrow">OUR WORKSHOP</span><h2>Visit us in<br /><em>Al Quoz 3, Dubai.</em></h2><p>Find F&T Auto Services at 3 Umm Suqeim St, Al Quoz 3, Dubai. Call ahead to confirm workshop availability, opening hours and the right service for your vehicle.</p><a className="btn btn-lime" href={googleBusinessUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> Get directions</a></div><div className="area-chips">{['Tyre Fitting', 'Wheel Alignment', 'Brake Service', 'Battery Service', 'Denting & Painting', 'Electrical Repair', 'AC Repair', 'Engine Diagnostics'].map(service => <span key={service}><Check size={13} /> {service}</span>)}</div></section>

      <section className="reviews-section" id="reviews"><div className="reviews-layout"><div className="reviews-copy"><span className="google-kicker"><span className="google-g">G</span> GOOGLE BUSINESS PROFILE</span><h2>Dubai drivers.<br /><em>Real experiences.</em></h2><p>Explore the latest customer feedback for F&T Auto Services on Google. Reviews open on our Google listing so you can read the original comments and see the full context.</p><a className="btn btn-dark" href={googleBusinessUrl} target="_blank" rel="noreferrer"><Star size={17} /> Read reviews on Google <ArrowRight size={16} /></a><small>Google Maps · F&T Auto Services · Al Quoz 3, Dubai</small></div><a className="google-profile-card" href={googleBusinessUrl} target="_blank" rel="noreferrer"><div className="google-card-head"><span className="google-g">G</span><span><strong>F&T Auto Services</strong><small>Google Business Profile</small></span><ArrowRight size={18} /></div><div className="google-card-body"><span className="review-badge">CUSTOMER FEEDBACK · LIVE ON GOOGLE</span><strong>Customer reviews</strong><p>See current ratings, recent feedback and review details directly on Google.</p><span className="google-card-link">View profile & reviews <ArrowRight size={15} /></span></div><div className="google-card-foot"><MapPin size={14} /> 3 Umm Suqeim St · Al Quoz 3 · Dubai <span>Open in Google Maps ↗</span></div></a></div></section>

      <section className="faq-section" id="faq"><div className="faq-side"><span className="eyebrow dark-eyebrow">GOOD TO KNOW</span><h2>Questions? <em>Answered.</em></h2><p>Need something else? Our team can help you choose tyres, understand fitment and arrange a visit to our Al Quoz 3 workshop.</p><a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Ask us on WhatsApp <ArrowRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${faqOpen === index ? 'active' : ''}`} key={question}><button onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index}><span>{question}</span><ChevronDown size={19} /></button>{faqOpen === index && <p>{answer}</p>}</article>)}</div></section>

      <section className="contact-section" id="contact"><div><span className="eyebrow">COME BY OR CALL US</span><h2>F&T Auto Services<br /><em>Dubai workshop</em></h2><p>Tyre fitting and car repair workshop in Al Quoz 3, Dubai.</p><div className="contact-details"><span><MapPin size={18} /><span><strong>Workshop</strong><br />{businessAddress}</span></span><span><Clock3 size={18} /><span><strong>Opening hours</strong><br />Daily, 8:30 AM – 7:30 PM [Sunday Off] · Please call ahead</span></span><span><Phone size={18} /><span><strong>Phone</strong><br /><a href={phoneLink}>{phone}</a></span></span><span><MessageCircle size={18} /><span><strong>Email</strong><br /><a href={`mailto:${businessEmail}`}>{businessEmail}</a></span></span></div><div className="hero-actions"><a className="btn btn-lime" href={phoneLink}><Phone size={17} /> Call the workshop</a><a className="btn btn-glass" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></div></div><div className="map-card"><iframe src={googleMapsEmbedUrl} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="F&T Auto Services location map" /><div className="map-label"><MapPin size={18} /><div><strong>F&T Auto Services</strong><span>Al Quoz 3 · Dubai</span></div><a href={googleBusinessUrl} target="_blank" rel="noreferrer">Directions <ArrowRight size={14} /></a></div></div></section>
    </main>

    <footer className="footer"><a className="brand footer-brand" href="#home"><img className="brand-logo" src="/images/logos/ftlogonew.webp" alt="F&T Auto Services" /></a><p>Tyre fitting and car repair services at our Al Quoz 3 workshop.</p><div><a href={phoneLink}><Phone size={15} /> Call</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a><a href={`mailto:${businessEmail}`}>{businessEmail}</a><a href="#faq">FAQs</a><a href="#contact">Contact</a></div><small>© {new Date().getFullYear()} F&T Auto Services · Dubai, UAE. Prices shown are indicative; confirm exact specifications and availability before booking.</small></footer>
    <div className="mobile-sticky"><a href={phoneLink}><Phone size={17} /> Call now</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'AutoRepair', name: 'F&T Auto Services', telephone: phone, email: businessEmail, address: { '@type': 'PostalAddress', streetAddress: businessAddress, addressLocality: 'Dubai', addressCountry: 'AE' }, openingHours: 'Mo-Sa 08:30-19:30', priceRange: 'AED 75+' }) }} />
  </>
}

export default App
