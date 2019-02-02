import { Map, MapOptions } from 'leaflet'
import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import { LeafletProvider } from './context'

export interface MapProps extends MapOptions {
  children?: ReactNode
}

const useMapElement = (
  mapRef: MutableRefObject<HTMLElement | null>,
  options: MapOptions,
): Map | null => {
  const optionsRef = useRef<MapOptions>(options)
  const [map, setMap] = useState<Map | null>(null)

  useEffect(() => {
    if (mapRef.current === null) {
      // Wait for map container to be rendered
      return
    }
    if (map === null) {
      const el = new Map(mapRef.current)
      if (options.center != null && options.zoom != null) {
        el.setView(options.center, options.zoom)
      }
      setMap(el)
    } else if (optionsRef.current !== null) {
      if (
        options.center != null &&
        options.zoom != null &&
        (options.center !== optionsRef.current.center ||
          options.zoom !== optionsRef.current.zoom)
      ) {
        map.setView(options.center, options.zoom)
      }
    }
    optionsRef.current = options
  })

  return map
}

const LeafletMap = ({ children, ...options }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const map = useMapElement(mapRef, options)

  const contents = map ? (
    <LeafletProvider value={{ map }}>{children}</LeafletProvider>
  ) : null
  return <div ref={mapRef}>{contents}</div>
}

export default LeafletMap
