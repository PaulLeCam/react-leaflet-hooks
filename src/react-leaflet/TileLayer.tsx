import { TileLayer, TileLayerOptions } from 'leaflet'

import { createLeafComponent } from './component'
import { createUseLeafletElement } from './element'
import { createUseLeafletLayer } from './layer'

export interface TileLayerProps extends TileLayerOptions {
  url: string
}

const useTileLayerElement = createUseLeafletElement<TileLayer, TileLayerProps>(
  (props, context) => {
    const { url, ...options } = props
    const el = new TileLayer(url, options)
    if (context !== null) {
      el.addTo(context.map)
    }
    return { el }
  },
)

const useLeafletTileLayer = createUseLeafletLayer(useTileLayerElement)

const LeafletTitleLayer = createLeafComponent(useLeafletTileLayer)

export default LeafletTitleLayer
