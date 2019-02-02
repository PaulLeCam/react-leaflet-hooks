import { Layer, LayerGroup, Map } from 'leaflet'
import { createContext, useContext } from 'react'

export interface ILeafletContext {
  map: Map
  layerContainer?: LayerGroup
  overlayContainer?: Layer
}

export const LeafletContext = createContext<ILeafletContext | null>(null)

export const LeafletProvider = LeafletContext.Provider

export const useLeafletContext = () => useContext(LeafletContext)
