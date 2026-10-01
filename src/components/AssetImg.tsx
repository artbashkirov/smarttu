import { useState, type ImgHTMLAttributes } from 'react'

type AssetImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string
}

export function AssetImg({ src, fallback, onError, ...rest }: AssetImgProps) {
  const [current, setCurrent] = useState(src)

  return (
    <img
      {...rest}
      src={current}
      onError={(event) => {
        if (fallback && current !== fallback) {
          setCurrent(fallback)
        }
        onError?.(event)
      }}
    />
  )
}
