import React, {
  Fragment,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { LeafletProvider } from './context'
import { DivOverlay, UseLeafletDivOverlay } from './div-overlay'
import { ILeafletElement } from './element'

export type UseLeafletFunc<E, P> = (
  props: P,
) => MutableRefObject<ILeafletElement<E>>

interface PropsWithChildren {
  children?: ReactNode
}

export function createContextComponent<E, P extends PropsWithChildren>(
  useFunc: UseLeafletFunc<E, P>,
) {
  return forwardRef((props: P, ref) => {
    const elementRef = useFunc(props)

    let el: E | null = null
    let context = null
    if (elementRef.current !== null) {
      el = elementRef.current.el
      context = elementRef.current.context
    }

    useImperativeHandle(ref, () => ({ element: el }))

    if (props.children == null) {
      return null
    }

    return context == null ? (
      <Fragment>{props.children}</Fragment>
    ) : (
      <LeafletProvider value={context}>{props.children}</LeafletProvider>
    )
  })
}

export function createDivOverlayComponent<
  E extends DivOverlay,
  P extends PropsWithChildren
>(useFunc: ReturnType<UseLeafletDivOverlay<E, P>>) {
  return forwardRef((props: P, ref) => {
    const [isOpen, setOpen] = useState(false)
    const elementRef = useFunc(props, setOpen)
    const el = elementRef.current === null ? null : elementRef.current.el

    useImperativeHandle(ref, () => ({ element: el }))
    useEffect(() => {
      if (isOpen && el !== null) {
        el.update()
      }
    }, [isOpen])

    // @ts-ignore _contentNode missing in type definition
    const contentNode = el && el._contentNode
    return contentNode ? createPortal(props.children, contentNode) : null
  })
}

export function createLeafComponent<E, P>(useFunc: UseLeafletFunc<E, P>) {
  return forwardRef((props: P, ref) => {
    const elementRef = useFunc(props)
    const el = elementRef.current === null ? null : elementRef.current.el

    useImperativeHandle(ref, () => ({ element: el }))

    return null
  })
}
