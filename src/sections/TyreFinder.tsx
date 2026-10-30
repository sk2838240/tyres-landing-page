import { useMemo, useState } from 'react'
import { ArrowRight, Check, Info, MessageCircle } from 'lucide-react'
import { formatSize, heightsForWidth, parseSize, rimsFor, TYRE_WIDTHS, type TyreSize } from '../data/tyreSizes'
import { whatsappLink } from '../lib/site'
import './TyreFinder.css'

type Step = 1 | 2 | 3

const STEP_LABELS: Record<Step, string> = {
  1: 'Width',
  2: 'Aspect ratio',
  3: 'Rim size',
}

const STEP_HINTS: Record<Step, string> = {
  1: 'Pick the first number of your tyre size, e.g. 225.',
  2: 'Pick the second number, e.g. 55.',
  3: 'Pick the rim diameter, e.g. 16.',
}

const quantities = [
  { value: '1', label: '1 tyre' },
  { value: '2', label: '2 tyres' },
  { value: '4', label: '4 tyres' },
]

export default function TyreFinder() {
  const [activeStep, setActiveStep] = useState<Step>(1)
  const [width, setWidth] = useState<number | null>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [rim, setRim] = useState<number | null>(null)
  const [manualMode, setManualMode] = useState(false)
  const [manualSize, setManualSize] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [qty, setQty] = useState('4')
  const [handoff, setHandoff] = useState(false)

  const heightOptions = useMemo(() => (width === null ? [] : heightsForWidth(width)), [width])
  const rimOptions = useMemo(() => (width === null || height === null ? [] : rimsFor(width, height)), [width, height])

  const selectedSize: TyreSize | null =
    width !== null && height !== null && rim !== null ? { width, height, rim } : null
  const sizeLabel = manualMode ? manualSize.trim() : selectedSize ? formatSize(selectedSize) : ''
  const sizeReady = manualMode ? manualSize.trim().length > 0 : selectedSize !== null

  const quantityLabel = qty === '1' ? '1 tyre' : `${qty} tyres`
  const quoteHref = whatsappLink(
    `Hi F&T Auto Services, I need ${quantityLabel} of size ${sizeLabel}. Please advise availability and a fitted quote.`,
  )

  function chooseWidth(next: number) {
    setWidth(next)
    setHeight(null)
    setRim(null)
    setActiveStep(2)
  }

  function chooseHeight(next: number) {
    setHeight(next)
    setRim(null)
    setActiveStep(3)
  }

  function chooseRim(next: number) {
    setRim(next)
  }

  function goToStep(step: Step) {
    if (step === 1) {
      setActiveStep(1)
      return
    }
    if (step === 2 && width !== null) {
      setActiveStep(2)
      return
    }
    if (step === 3 && width !== null && height !== null) {
      setActiveStep(3)
    }
  }

  function startManual() {
    setManualMode(true)
    setShowHelp(false)
    setHandoff(false)
  }

  function useSizePicker() {
    setManualMode(false)
    setManualSize('')
    setHandoff(false)
  }

  const statusMessage = sizeReady
    ? `Tyre size ${sizeLabel} selected for ${quantityLabel}. Activate Get my quote to continue on WhatsApp.`
    : `Step ${activeStep} of 3: choose ${STEP_LABELS[activeStep].toLowerCase()}.`

  return (
    <section className="section tf-section" id="tyre-finder">
      <div className="tf-layout">
        <div className="tf-copy">
          <span className="eyebrow dark-eyebrow">FIND YOUR TYRE SIZE</span>
          <h2>
            Know your size? <em>Get a fitted quote.</em>
          </h2>
          <p>
            Pick the three numbers printed on the sidewall of your current tyre and we will check availability,
            stock and a fitted price for your exact size at our Al Quoz 3 workshop.
          </p>
          <ul className="tf-points">
            <li>
              <Check size={15} />
              <span>
                <strong>Live stock check</strong>We confirm what we can fit today before you drive over.
              </span>
            </li>
            <li>
              <Check size={15} />
              <span>
                <strong>Fitted price, no surprises</strong>Tyres, balancing, valves and VAT included in your quote.
              </span>
            </li>
            <li>
              <Check size={15} />
              <span>
                <strong>Genuine brands</strong>Michelin, Bridgestone, Continental, Pirelli, Dunlop and more.
              </span>
            </li>
          </ul>
          <p className="tf-fineprint">
            Not sure of your size? Find it on the sidewall of your tyre — it looks like 195 / 55 R16 95V. We verify
            load and speed rating against your vehicle before fitting.
          </p>
        </div>

        <div className="tf-card">
          <div className="tf-card-head">
            <span className="tf-card-kicker">TYRE SIZE FINDER</span>
            <button
              type="button"
              className="tf-help-toggle"
              onClick={() => setShowHelp(!showHelp)}
              aria-expanded={showHelp}
              aria-controls="tf-help-panel"
            >
              <Info size={15} />
              How do I find my size?
            </button>
          </div>

          {showHelp && (
            <div className="tf-help" id="tf-help-panel">
              <div className="tf-help-grid">
                <div>
                  <span>1</span>
                  <strong>Width</strong>
                  <small>Three digits — 195</small>
                </div>
                <div>
                  <span>2</span>
                  <strong>Height</strong>
                  <small>Two digits — 55</small>
                </div>
                <div>
                  <span>3</span>
                  <strong>Rim size</strong>
                  <small>After the R — 16</small>
                </div>
                <div>
                  <span>4</span>
                  <strong>Speed</strong>
                  <small>Final letter — V</small>
                </div>
              </div>
              <p className="tf-help-example">
                A full tyre size looks like <strong>195 / 55 R16 95V</strong> — you only need the first three.
              </p>
            </div>
          )}

          <p className="tf-sr-status" role="status" aria-live="polite">
            {statusMessage}
          </p>

          {!manualMode && (
            <>
              <ol className="tf-steps">
                {([1, 2, 3] as Step[]).map((step) => {
                  const value =
                    step === 1 ? width : step === 2 ? height : step === 3 ? rim : null
                  const enabled = step === 1 || (step === 2 && width !== null) || (step === 3 && width !== null && height !== null)
                  const complete = value !== null
                  return (
                    <li key={step}>
                      <button
                        type="button"
                        className={`tf-step${activeStep === step ? ' active' : ''}${complete ? ' complete' : ''}`}
                        onClick={() => goToStep(step)}
                        disabled={!enabled}
                        aria-current={activeStep === step ? 'step' : undefined}
                      >
                        <span className="tf-step-index">{complete ? <Check size={13} /> : step}</span>
                        <span className="tf-step-text">
                          <small>{STEP_LABELS[step]}</small>
                          <strong>{complete ? value : '—'}</strong>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              <div className="tf-panel">
                <p className="tf-panel-hint">{STEP_HINTS[activeStep]}</p>

                {activeStep === 1 && (
                  <div className="tf-options" role="radiogroup" aria-label="Tyre width">
                    {TYRE_WIDTHS.map((option) => (
                      <label className={`tf-option${width === option ? ' selected' : ''}`} key={option}>
                        <input
                          type="radio"
                          name="tf-width"
                          value={option}
                          checked={width === option}
                          onChange={() => chooseWidth(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="tf-options" role="radiogroup" aria-label="Tyre aspect ratio">
                    {heightOptions.map((option) => (
                      <label className={`tf-option${height === option ? ' selected' : ''}`} key={option}>
                        <input
                          type="radio"
                          name="tf-height"
                          value={option}
                          checked={height === option}
                          onChange={() => chooseHeight(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="tf-options" role="radiogroup" aria-label="Rim size">
                    {rimOptions.map((option) => (
                      <label className={`tf-option${rim === option ? ' selected' : ''}`} key={option}>
                        <input
                          type="radio"
                          name="tf-rim"
                          value={option}
                          checked={rim === option}
                          onChange={() => chooseRim(option)}
                        />
                        <span>R{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" className="tf-escape" onClick={startManual}>
                My size isn&apos;t listed — enter it manually
              </button>
            </>
          )}

          {manualMode && (
            <div className="tf-manual">
              <p className="tf-panel-hint">Type the full size printed on your tyre, for example 225 / 45 R18 95V.</p>
              <label className="tf-field">
                <span>Your tyre size</span>
                <input
                  type="text"
                  value={manualSize}
                  onChange={(event) => setManualSize(event.target.value)}
                  placeholder="225 / 45 R18 95V"
                  autoComplete="off"
                />
              </label>
              {manualSize.trim() && !parseSize(manualSize) && (
                <p className="tf-field-note">
                  We could not read that as a standard size — we will still check it for you.
                </p>
              )}
              <div className="tf-manual-actions">
                <button type="button" className="tf-escape inline" onClick={useSizePicker}>
                  Choose from the list instead
                </button>
              </div>
            </div>
          )}

          {sizeReady && (
            <div className="tf-actions">
              <fieldset className="tf-fieldset">
                <legend>How many tyres do you need?</legend>
                <div className="tf-quantity">
                  {quantities.map((option) => (
                    <label className={`tf-quantity-option${qty === option.value ? ' selected' : ''}`} key={option.value}>
                      <input
                        type="radio"
                        name="tyre_qty"
                        value={option.value}
                        checked={qty === option.value}
                        onChange={() => setQty(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="tf-ready">
                <div className="tf-current">
                  <span>Current selection</span>
                  <strong>{sizeLabel}</strong>
                </div>
                <a
                  className="btn btn-dark tf-next"
                  href={quoteHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setHandoff(true)}
                >
                  <MessageCircle size={16} /> Get my quote <ArrowRight size={16} />
                </a>
              </div>

              <p className="tf-handoff-note">
                Opens WhatsApp with your tyre size and quantity ready to send — no form needed.
              </p>

              {handoff && (
                <p className="tf-handoff" role="status">
                  WhatsApp should be opening in a new tab with your request ready to send. Did not open?{' '}
                  <a href={quoteHref} target="_blank" rel="noreferrer">
                    Open the chat again
                  </a>
                  .
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
