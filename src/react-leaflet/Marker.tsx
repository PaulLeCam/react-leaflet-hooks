import { LatLngExpression, Marker, MarkerOptions } from 'leaflet'
import { ReactNode } from 'react'

import { createContextComponent } from './component'
import { createUseLeafletElement } from './element'
import { createUseLeafletLayer } from './layer'

export interface MarkerProps extends MarkerOptions {
  children?: ReactNode
  position: LatLngExpression
}

const useMarkerElement = createUseLeafletElement<Marker, MarkerProps>(
  (props, context) => {
    const { position, ...options } = props
    const el = new Marker(position, options)
    return {
      el,
      context: context === null ? null : { ...context, overlayContainer: el },
    }
  },
  (el, props, prevProps) => {
    if (props.position !== prevProps.position) {
      el.setLatLng(props.position)
    }
  },
)

const useLeafletMarker = createUseLeafletLayer(useMarkerElement)

const LeafletMarker = createContextComponent(useLeafletMarker)

export default LeafletMarker
