import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { KETTLE_IMAGE } from '../data/devices'
import {
  MORPH_MS,
  POPUP_IMAGE_RECT,
  POPUP_SHEET,
  type Rect,
} from './popupGeometry'
import './DeviceFoundPopup.css'

type Phase = 'closed' | 'opening' | 'open' | 'closing'

type Props = {
  open: boolean
  sourceRect: Rect | null
  onConnect?: () => void
  onSearchAgain: () => void
  onCloseComplete?: () => void
}

const CLOSE_MS = 320

export default function DeviceFoundPopup({
  open,
  sourceRect,
  onConnect,
  onSearchAgain,
  onCloseComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [heroRect, setHeroRect] = useState<Rect | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [heroPinned, setHeroPinned] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const openLock = useRef(false)

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (open && sourceRect && !openLock.current && phase === 'closed') {
      openLock.current = true
      setHeroRect(sourceRect)
      setHeroPinned(true)
      setExpanded(false)
      setPhase('opening')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeroRect(POPUP_IMAGE_RECT)
          setExpanded(true)
        })
      })
      window.setTimeout(() => {
        // Keep hero pinned as the visible kettle — avoids blink on handoff
        setPhase('open')
      }, MORPH_MS)
      return
    }

    // Close → return to search screen (fade out, no reverse morph)
    if (!open && openLock.current && (phase === 'open' || phase === 'opening')) {
      openLock.current = false
      setPhase('closing')
      setExpanded(false)
      // Keep hero at destination while sheet fades so kettle doesn't flash
      setHeroRect(POPUP_IMAGE_RECT)
      setHeroPinned(true)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
      closeTimer.current = window.setTimeout(() => {
        setPhase('closed')
        setHeroRect(null)
        setHeroPinned(false)
        onCloseComplete?.()
      }, CLOSE_MS)
    }
  }, [open, sourceRect, phase, onCloseComplete])

  const originX =
    sourceRect != null
      ? sourceRect.left + sourceRect.width / 2 - POPUP_SHEET.left
      : POPUP_SHEET.width / 2
  const originY =
    sourceRect != null
      ? sourceRect.top + sourceRect.height / 2 - POPUP_SHEET.top
      : POPUP_SHEET.height / 2

  const visible = phase !== 'closed'
  const settled = phase === 'open'
  // Hero stays for the whole open/close cycle — static img is only a fallback under it
  const showHero = visible && heroRect != null && heroPinned

  return (
    <div
      className={[
        'device-found',
        visible ? 'is-visible' : '',
        expanded ? 'is-expanded' : '',
        settled ? 'is-settled' : '',
        phase === 'closing' ? 'is-closing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!settled}
      style={
        {
          '--origin-x': `${originX}px`,
          '--origin-y': `${originY}px`,
        } as CSSProperties
      }
    >
      <div className="device-found__backdrop" />

      <div
        className="device-found__sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-found-title"
      >
        <div className="device-found__content">
          <h2 id="device-found-title" className="device-found__title">
            Устройство
            <br />
            найдено
          </h2>

          <div className="device-found__image-wrap">
            <img
              className={`device-found__image${
                (settled || phase === 'closing') && !heroPinned ? ' is-shown' : ''
              }`}
              src={KETTLE_IMAGE}
              alt="Чайник Tuvio Semble"
              draggable={false}
            />
          </div>

          <div className="device-found__name">
            <p className="device-found__name-title">Чайник Tuvio Semble</p>
            <p className="device-found__name-model">TKP1717S</p>
          </div>

          <button
            type="button"
            className="device-found__connect"
            onClick={onConnect}
          >
            Подключить
          </button>

          <button
            type="button"
            className="device-found__again"
            onClick={onSearchAgain}
          >
            Искать заново
          </button>
        </div>
      </div>

      {showHero && heroRect && (
        <img
          className="device-found__hero"
          src={KETTLE_IMAGE}
          alt=""
          draggable={false}
          style={{
            left: heroRect.left,
            top: heroRect.top,
            width: heroRect.width,
            height: heroRect.height,
          }}
        />
      )}
    </div>
  )
}
