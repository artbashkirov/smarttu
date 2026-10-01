import { useEffect, useRef } from 'react'
import { DEVICES, KETTLE_DEVICE_ID } from '../data/devices'
import type { Rect } from './popupGeometry'
import './DeviceCarousel.css'

type Device = (typeof DEVICES)[number]

function DeviceImage({
  device,
  hidden,
}: {
  device: Device
  hidden?: boolean
}) {
  return (
    <div
      className={`device-carousel__item${hidden ? ' is-ghost' : ''}`}
      data-device-id={device.id}
    >
      <img
        className="device-carousel__img"
        src={device.src}
        alt={device.name}
        draggable={false}
      />
    </div>
  )
}

const BASE_SPEED_PX_PER_SEC = 60
const SCALE_EDGE = 0.88
const SCALE_CENTER = 1
const OPACITY_EDGE = 0.5
const OPACITY_CENTER = 1
const CENTER_SPEED_FACTOR = 0.62
/** Start settle only once kettle is well on-screen (later than edge) */
const SETTLE_ZONE_PX = 78
/** Soft glide into center */
const SETTLE_DURATION_MS = 1100

export const PAUSE_BEFORE_POPUP_MS = 1000

function easeInOut(t: number) {
  return t * t * (3 - 2 * t)
}

/** Soft ease-out only — no ease-in halt when settle starts */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

type Props = {
  paused: boolean
  hideKettle: boolean
  screenRef: React.RefObject<HTMLElement | null>
  onKettleCentered: (rect: Rect) => void
}

export default function DeviceCarousel({
  paused,
  hideKettle,
  screenRef,
  onKettleCentered,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  const triggeredRef = useRef(false)
  const onKettleCenteredRef = useRef(onKettleCentered)
  const loop = [...DEVICES, ...DEVICES]

  useEffect(() => {
    pausedRef.current = paused
    if (!paused) {
      // Allow discovering the kettle again on next pass
      triggeredRef.current = false
    }
  }, [paused])

  useEffect(() => {
    onKettleCenteredRef.current = onKettleCentered
  }, [onKettleCentered])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    let frame = 0
    let halfWidth = 0
    let offset = 0
    let lastNow: number | null = null
    let kettleWasAway = true
    let settling = false
    let settleFrom = 0
    let settleTo = 0
    let settleStart = 0
    let settleDuration = SETTLE_DURATION_MS

    const measure = () => {
      halfWidth = track.scrollWidth / 2
    }

    const getKettleRect = (): Rect | null => {
      const screen = screenRef.current
      if (!screen) return null
      const screenBox = screen.getBoundingClientRect()
      const rootBox = root.getBoundingClientRect()
      const centerX = rootBox.left + rootBox.width / 2
      let best: HTMLImageElement | null = null
      let bestDist = Infinity

      track
        .querySelectorAll<HTMLElement>(
          `.device-carousel__item[data-device-id="${KETTLE_DEVICE_ID}"]`,
        )
        .forEach((item) => {
          const img = item.querySelector('img')
          if (!img) return
          const r = img.getBoundingClientRect()
          const dist = Math.abs(r.left + r.width / 2 - centerX)
          if (dist < bestDist) {
            bestDist = dist
            best = img
          }
        })

      if (!best) return null
      const r = best.getBoundingClientRect()
      return {
        left: r.left - screenBox.left,
        top: r.top - screenBox.top,
        width: r.width,
        height: r.height,
      }
    }

    const getKettleSignedDist = (): number | null => {
      const trackRect = track.getBoundingClientRect()
      const rootBox = root.getBoundingClientRect()
      const centerX = rootBox.left + rootBox.width / 2
      let bestDist = Infinity
      let signed: number | null = null

      track.querySelectorAll<HTMLElement>('.device-carousel__item').forEach((item) => {
        if (item.dataset.deviceId !== KETTLE_DEVICE_ID) return
        const itemCenter =
          trackRect.left + item.offsetLeft + item.offsetWidth / 2
        const d = itemCenter - centerX
        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d)
          signed = d
        }
      })
      return signed
    }

    const finishSettle = () => {
      settling = false
      offset = settleTo
      if (offset <= -halfWidth) offset += halfWidth
      track.style.transform = `translate3d(${offset}px, 0, 0)`
      // Final micro-nudge to exact center
      const signed = getKettleSignedDist()
      if (signed !== null && Math.abs(signed) > 0.5) {
        offset -= signed
        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }
      triggeredRef.current = true
      kettleWasAway = false
      const rect = getKettleRect()
      if (rect) onKettleCenteredRef.current(rect)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    const tick = (now: number) => {
      if (halfWidth <= 0) {
        measure()
        frame = requestAnimationFrame(tick)
        return
      }

      if (lastNow === null) lastNow = now
      const dt = Math.min(0.05, (now - lastNow) / 1000)
      lastNow = now

      const rootRect = root.getBoundingClientRect()
      const trackRect = track.getBoundingClientRect()
      const centerX = rootRect.left + rootRect.width / 2
      const halfView = rootRect.width / 2
      const items = track.querySelectorAll<HTMLElement>('.device-carousel__item')

      let minNormDist = 1

      items.forEach((item) => {
        const itemCenter =
          trackRect.left + item.offsetLeft + item.offsetWidth / 2
        const dist = Math.abs(itemCenter - centerX)
        const t = Math.min(1, Math.max(0, dist / halfView))
        const e = easeInOut(t)

        const scale = SCALE_CENTER + (SCALE_EDGE - SCALE_CENTER) * e
        const opacity = OPACITY_CENTER + (OPACITY_EDGE - OPACITY_CENTER) * e

        item.style.transform = `scale(${scale})`
        if (!item.classList.contains('is-ghost')) {
          item.style.opacity = String(opacity)
        }

        if (t < minNormDist) minNormDist = t
      })

      const kettleSigned = getKettleSignedDist()

      if (
        kettleSigned === null ||
        Math.abs(kettleSigned) > SETTLE_ZONE_PX * 2.2
      ) {
        kettleWasAway = true
        settling = false
      }

      // Start later — only once kettle is closer to center, not at the edge
      if (
        !pausedRef.current &&
        !settling &&
        !triggeredRef.current &&
        kettleWasAway &&
        kettleSigned !== null &&
        kettleSigned > 0 &&
        kettleSigned <= SETTLE_ZONE_PX
      ) {
        settling = true
        settleFrom = offset
        settleTo = offset - kettleSigned
        settleStart = now
        // Match ease-out initial velocity to current ribbon speed (no stop/jerk)
        const speedFactor =
          CENTER_SPEED_FACTOR +
          (1 - CENTER_SPEED_FACTOR) * easeInOut(minNormDist)
        const currentSpeed = BASE_SPEED_PX_PER_SEC * speedFactor
        const distance = Math.abs(settleTo - settleFrom)
        // easeOutCubic: v(0) = 3 * distance / duration
        settleDuration = Math.max(
          600,
          Math.min(1600, (3 * distance) / Math.max(currentSpeed, 1)),
        )
      }

      if (settling && !pausedRef.current && !triggeredRef.current) {
        const u = Math.min(1, (now - settleStart) / settleDuration)
        const e = easeOutCubic(u)
        offset = settleFrom + (settleTo - settleFrom) * e
        if (offset <= -halfWidth) offset += halfWidth
        track.style.transform = `translate3d(${offset}px, 0, 0)`
        if (u >= 1) finishSettle()
      } else if (!pausedRef.current && !settling) {
        const speedFactor =
          CENTER_SPEED_FACTOR +
          (1 - CENTER_SPEED_FACTOR) * easeInOut(minNormDist)
        offset -= BASE_SPEED_PX_PER_SEC * speedFactor * dt
        if (offset <= -halfWidth) offset += halfWidth
        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
  }, [screenRef])

  return (
    <div className="device-carousel" ref={rootRef} aria-hidden="true">
      <div className="device-carousel__track" ref={trackRef}>
        {loop.map((device, index) => (
          <DeviceImage
            key={`${device.id}-${index}`}
            device={device}
            hidden={hideKettle && device.id === KETTLE_DEVICE_ID}
          />
        ))}
      </div>
    </div>
  )
}
