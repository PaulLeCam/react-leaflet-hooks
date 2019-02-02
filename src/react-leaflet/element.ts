import { MutableRefObject, useEffect, useRef } from 'react'

import { ILeafletContext } from './context'

export interface ILeafletElement<T> {
  el: T
  context?: ILeafletContext | null
}

export type UseLeafletElement<E, P> = (
  context: ILeafletContext | null,
  props: P,
) => MutableRefObject<ILeafletElement<E>>

export function createUseLeafletElement<E, P>(
  createElement: (
    props: P,
    context: ILeafletContext | null,
  ) => ILeafletElement<E>,
  updateElement: (el: E, props: P, prevprops: P) => void = () => {},
) {
  return function useLeafletElement(
    context: ILeafletContext | null,
    props: P,
  ): ReturnType<UseLeafletElement<E, P>> {
    const elementRef = useRef<ILeafletElement<E>>(createElement(props, context))
    const propsRef = useRef<P>(props)

    useEffect(() => {
      if (elementRef.current !== null && propsRef.current !== props) {
        updateElement(elementRef.current.el, props, propsRef.current)
        propsRef.current = props
      }
    })

    return elementRef
  }
}
