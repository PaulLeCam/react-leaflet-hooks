import { Evented, LeafletEventHandlerFnMap } from 'leaflet'
import { useEffect, useRef } from 'react'

import { ILeafletElement } from './element'

const EVENTS_RE = /^on(.+)$/i

export const extractLeafletEvents = (props: {
  [key: string]: any
}): LeafletEventHandlerFnMap => {
  return Object.keys(props).reduce(
    (res, prop) => {
      if (EVENTS_RE.test(prop)) {
        if (props[prop] != null) {
          const key = prop.replace(EVENTS_RE, (_, p) => p.toLowerCase())
          res[key] = props[prop]
        }
      }
      return res
    },
    {} as LeafletEventHandlerFnMap,
  )
}

export const setLeafletEvents = (
  el: Evented,
  next: LeafletEventHandlerFnMap = {},
  prev: LeafletEventHandlerFnMap = {},
): LeafletEventHandlerFnMap => {
  const diff = { ...prev }

  Object.keys(prev).forEach((ev: string) => {
    const cb = prev[ev]
    if (next[ev] == null || cb !== next[ev]) {
      delete diff[ev]
      el.off(ev, cb)
    }
  })

  Object.keys(next).forEach((ev: string) => {
    const cb = next[ev]
    if (prev[ev] == null || cb !== prev[ev]) {
      diff[ev] = cb
      el.on(ev, cb)
    }
  })

  return diff
}

export const useLeafletEvents = (
  element: ILeafletElement<Evented> | null,
  props: Object,
) => {
  const events = extractLeafletEvents(props)
  const eventsRef = useRef<LeafletEventHandlerFnMap>(events)

  useEffect(() => {
    if (element === null) {
      return
    }

    if (events === eventsRef.current) {
      // First call
      setLeafletEvents(element.el, events)
    } else {
      eventsRef.current = setLeafletEvents(
        element.el,
        events,
        eventsRef.current,
      )
    }

    return () => {
      Object.keys(eventsRef.current).forEach((ev: string) => {
        element.el.off(ev, eventsRef.current[ev])
      })
    }
  })
}
