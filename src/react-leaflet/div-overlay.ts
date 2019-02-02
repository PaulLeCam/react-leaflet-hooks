import { Popup, Tooltip } from 'leaflet'

import { useLeafletContext, ILeafletContext } from './context'
import { UseLeafletElement, ILeafletElement } from './element'
import { useLeafletEvents } from './events'

export type DivOverlay = Popup | Tooltip

export type SetOpen = (open: boolean) => void

export type UseLifecycle<E, P> = (
  element: ILeafletElement<E>,
  context: ILeafletContext | null,
  props: P,
  setOpen: SetOpen,
) => void

export type UseLeafletDivOverlay<E extends DivOverlay, P> = (
  useElement: UseLeafletElement<E, P>,
  useLifecycle: UseLifecycle<E, P>,
) => (props: P, setOpen: SetOpen) => ReturnType<UseLeafletElement<E, P>>

export function createUseLeafletDivOverlay<E extends DivOverlay, P>(
  useElement: UseLeafletElement<E, P>,
  useLifecycle: UseLifecycle<E, P>,
) {
  return (props: P, setOpen: SetOpen): ReturnType<UseLeafletElement<E, P>> => {
    const context = useLeafletContext()
    const elementRef = useElement(context, props)

    useLeafletEvents(elementRef.current, props)
    useLifecycle(elementRef.current, context, props, setOpen)

    return elementRef
  }
}
