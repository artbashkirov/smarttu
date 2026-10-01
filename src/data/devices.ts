import img01 from '../../assets/01@2x.png'
import img02 from '../../assets/02@2x.png'
import img03 from '../../assets/03@2x.png'
import img04 from '../../assets/04@2x.png'
import img05 from '../../assets/05@2x.png'
import img07 from '../../assets/07@2x.png'
import img08 from '../../assets/08@2x.png'
import img09 from '../../assets/09@2x.png'
import img10 from '../../assets/10@2x.png'
import img11 from '../../assets/11@2x.png'
import img12 from '../../assets/12@2x.png'

/** Gray kettle that triggers discovery popup */
export const KETTLE_DEVICE_ID = '12'

export const DEVICES = [
  { id: '10', name: '10', src: img10 },
  { id: '04', name: '04', src: img04 },
  { id: '03', name: '03', src: img03 },
  { id: '12', name: '12', src: img12 },
  { id: '07', name: '07', src: img07 },
  { id: '08', name: '08', src: img08 },
  { id: '09', name: '09', src: img09 },
  { id: '02', name: '02', src: img02 },
  { id: '11', name: '11', src: img11 },
  { id: '05', name: '05', src: img05 },
  { id: '01', name: '01', src: img01 },
] as const

export const KETTLE_IMAGE = img12

export const ICONS = {
  scan: `${import.meta.env.BASE_URL}assets/icons/scan.svg`,
  scanFallback:
    'https://www.figma.com/api/mcp/asset/8b3a79ae-4ebc-40ad-8c1e-63f32d11abf3.svg',
  info: `${import.meta.env.BASE_URL}assets/icons/info.svg`,
  infoFallback:
    'https://www.figma.com/api/mcp/asset/3270df74-aeb4-4a18-bcac-9975258d4dde.svg',
  levels: `${import.meta.env.BASE_URL}assets/icons/status-levels.svg`,
  levelsFallback:
    'https://www.figma.com/api/mcp/asset/13f1e117-2fd5-4b6e-a920-f9daba937834.svg',
  time: `${import.meta.env.BASE_URL}assets/icons/status-time.svg`,
  timeFallback:
    'https://www.figma.com/api/mcp/asset/96a902ba-5fb0-4f3c-b93e-b8dbbdc67050.svg',
} as const
