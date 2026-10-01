import { useCallback, useEffect, useRef, useState } from 'react'
import DeviceCarousel, {
  PAUSE_BEFORE_POPUP_MS,
} from '../components/DeviceCarousel'
import DeviceFoundPopup from '../components/DeviceFoundPopup'
import type { Rect } from '../components/popupGeometry'
import { AssetImg } from '../components/AssetImg'
import { ICONS } from '../data/devices'
import './DeviceSearchScreen.css'

function AnimatedDots() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((prev) => (prev % 3) + 1)
    }, 450)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className="device-search__dots" aria-hidden="true">
      {'.'.repeat(count)}
    </span>
  )
}

export default function DeviceSearchScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [hideKettle, setHideKettle] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [sourceRect, setSourceRect] = useState<Rect | null>(null)

  const handleKettleCentered = useCallback((rect: Rect) => {
    setSourceRect(rect)
    setCarouselPaused(true)
    window.setTimeout(() => {
      setHideKettle(true)
      setPopupOpen(true)
    }, PAUSE_BEFORE_POPUP_MS)
  }, [])

  const handleSearchAgain = useCallback(() => {
    setPopupOpen(false)
  }, [])

  const handleCloseComplete = useCallback(() => {
    setHideKettle(false)
    setSourceRect(null)
    setCarouselPaused(false)
  }, [])

  return (
    <div className="device-search-frame">
      <div
        className="device-search"
        data-node-id="295:9458"
        ref={screenRef}
      >
        <header className="device-search__status-bar">
          <div className="device-search__status-time">
            <AssetImg
              src={ICONS.time}
              fallback={ICONS.timeFallback}
              alt=""
              width={138}
              height={54}
            />
          </div>
          <div className="device-search__status-levels">
            <AssetImg
              src={ICONS.levels}
              fallback={ICONS.levelsFallback}
              alt=""
              width={143}
              height={54}
            />
          </div>
        </header>

        <div className="device-search__header">
          <h1 className="device-search__title">
            Добро
            <br />
            пожаловать,
            <br />
            Геннадий!
          </h1>
          <p className="device-search__subtitle">
            Уже ищем новое устройство
            <AnimatedDots />
          </p>
        </div>

        <DeviceCarousel
          paused={carouselPaused}
          hideKettle={hideKettle}
          screenRef={screenRef}
          onKettleCentered={handleKettleCentered}
        />

        <div className="device-search__pairing">
          <p className="device-search__pairing-text">
            Убедитесь, что устройтсво находится
            <br />
            в режиме сопряжения
            <AssetImg
              className="device-search__info"
              src={ICONS.info}
              fallback={ICONS.infoFallback}
              alt=""
              width={16}
              height={16}
            />
          </p>
        </div>

        <button type="button" className="device-search__catalog">
          Выбрать из каталога
        </button>

        <nav className="device-search__tabbar" aria-label="Навигация">
          <div className="device-search__tabbar-bg" aria-hidden="true" />
          <div className="device-search__tabs">
            <button type="button" className="device-search__tab is-active">
              <span className="device-search__tab-icon" aria-hidden="true">
                ◆
              </span>
              <span className="device-search__tab-label">Tab 1</span>
            </button>
            <button type="button" className="device-search__tab">
              <span className="device-search__tab-icon" aria-hidden="true">
                ●
              </span>
              <span className="device-search__tab-label">Tab 2</span>
            </button>
            <button type="button" className="device-search__tab">
              <span className="device-search__tab-icon" aria-hidden="true">
                ▲
              </span>
              <span className="device-search__tab-label">Tab 3</span>
            </button>
          </div>
        </nav>

        <DeviceFoundPopup
          open={popupOpen}
          sourceRect={sourceRect}
          onSearchAgain={handleSearchAgain}
          onCloseComplete={handleCloseComplete}
        />
      </div>
    </div>
  )
}
