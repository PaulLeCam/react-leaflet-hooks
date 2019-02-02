import React from 'react'

import Map from './react-leaflet/Map'
import Marker from './react-leaflet/Marker'
import Popup from './react-leaflet/Popup'
import TileLayer from './react-leaflet/TileLayer'

const App = ({ center }: { center: [number, number] }) => {
  return (
    <Map center={center} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>A simple popup</Popup>
      </Marker>
    </Map>
  )
}

export default App
