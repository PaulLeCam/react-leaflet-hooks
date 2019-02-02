import {
  LatLngExpression,
  Tooltip,
  TooltipEvent,
  TooltipOptions,
} from 'leaflet'
import { ReactNode } from 'react'

import { createDivOverlayComponent } from './component'
import { ILeafletContext } from './context'
import { createUseLeafletDivOverlay, SetOpen } from './div-overlay'
import { createUseLeafletElement, ILeafletElement } from './element'

export interface TooltipProps extends TooltipOptions {
  children?: ReactNode
  position?: LatLngExpression
}

const useTooltipElement = createUseLeafletElement<Tooltip, TooltipProps>(
  (props, context) => {
    const el = new Tooltip(
      props,
      context === null ? undefined : context.overlayContainer,
    )
    return { el }
  },
)

const useTooltipLifecycle = (
  element: ILeafletElement<Tooltip>,
  context: ILeafletContext | null,
  props: TooltipProps,
  setOpen: SetOpen,
) => {
  if (element === null || context == null) {
    return
  }
  const { el } = element

  const onOpen = (event: TooltipEvent) => {
    if (event.tooltip === el) {
      el.update()
      setOpen(true)
    }
  }

  const onClose = (event: TooltipEvent) => {
    if (event.tooltip === el) {
      setOpen(false)
    }
  }

  const container = context.overlayContainer
  if (container == null) {
    return
  }

  container.on({
    // @ts-ignore emits TooltipEvent instead of LeafletEvent
    tooltipopen: onOpen,
    // @ts-ignore emits TooltipEvent instead of LeafletEvent
    tooltipclose: onClose,
  })
  container.bindTooltip(el)

  return () => {
    container.off({
      // @ts-ignore emits TooltipEvent instead of LeafletEvent
      tooltipopen: onOpen,
      // @ts-ignore emits TooltipEvent instead of LeafletEvent
      tooltipclose: onClose,
    })
    container.unbindTooltip()
  }
}

const useLeafletTooltip = createUseLeafletDivOverlay(
  useTooltipElement,
  useTooltipLifecycle,
)

const LeafletTooltip = createDivOverlayComponent(useLeafletTooltip)

export default LeafletTooltip
