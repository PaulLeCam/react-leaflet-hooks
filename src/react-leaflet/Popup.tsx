import { LatLngExpression, Popup, PopupEvent, PopupOptions } from 'leaflet'
import { ReactNode } from 'react'

import { createDivOverlayComponent } from './component'
import { ILeafletContext } from './context'
import { createUseLeafletDivOverlay, SetOpen } from './div-overlay'
import { createUseLeafletElement, ILeafletElement } from './element'

export interface PopupProps extends PopupOptions {
  children?: ReactNode
  position?: LatLngExpression
}

const usePopupElement = createUseLeafletElement<Popup, PopupProps>(
  (props, context) => {
    const el = new Popup(
      props,
      context === null ? undefined : context.overlayContainer,
    )
    return { el }
  },
)

const usePopupLifecycle = (
  element: ILeafletElement<Popup>,
  context: ILeafletContext | null,
  props: PopupProps,
  setOpen: SetOpen,
) => {
  if (element === null || context == null) {
    return
  }
  const { el } = element

  const onOpen = (event: PopupEvent) => {
    if (event.popup === el) {
      el.update()
      setOpen(true)
    }
  }

  const onClose = (event: PopupEvent) => {
    if (event.popup === el) {
      setOpen(false)
    }
  }

  context.map.on({
    // @ts-ignore emits PopupEvent instead of LeafletEvent
    popupopen: onOpen,
    // @ts-ignore emits PopupEvent instead of LeafletEvent
    popupclose: onClose,
  })

  if (context.overlayContainer != null) {
    // Attach to container component
    context.overlayContainer.bindPopup(el)
  } else {
    // Attach to a Map
    if (props.position != null) {
      el.setLatLng(props.position)
    }
    el.openOn(context.map)
  }

  return () => {
    context.map.off({
      // @ts-ignore emits PopupEvent instead of LeafletEvent
      popupopen: onOpen,
      // @ts-ignore emits PopupEvent instead of LeafletEvent
      popupclose: onClose,
    })
    context.map.removeLayer(el)
  }
}

const useLeafletPopup = createUseLeafletDivOverlay(
  usePopupElement,
  usePopupLifecycle,
)

const LeafletPopup = createDivOverlayComponent(useLeafletPopup)

export default LeafletPopup
