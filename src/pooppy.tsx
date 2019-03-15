import * as React from 'react'
import produce, { Draft } from 'immer'
import createContainer from "constate"

// types
type Recipe<S = any> = (this: Draft<S>, draftState: Draft<S>) => void | S
type Update<S = any> = (recipe: Recipe<S>) => void
type UseImmer<S = any> = (p: S) => [S, Update<S>]
type IObj = {
  [key: string]: any
}

/**
 * immer: https://github.com/mweststrate/immer
 * @param {any} initialState your initialState
*/
const useImmer: UseImmer = initialState => {
  const [state, setState] = React.useState(initialState)
  return [
    state,
    updater => {
      setState(produce(updater))
    }
  ]
}

/**
 * like recompose#nest
 * nest(MainCounter.Provider, DynamicImportedRoutePage)
 * @param {Array[React.Component]} components a collections of components
*/
const nest = (...components: any[]) => (props: any) => 
  components.reduceRight(
    (children, Current) => <Current {...props}>{children}</Current>,
    props.children
  )

/**
 * Some useful collections Hooks!
 * thanks the idea and the original code! https://twitter.com/brunolemos/status/1090377532845801473
 * @param {String} name your custom name
 * @param {any} props props you want to record
*/
const useWhyDidYouUpdate = (name: string, props: any) => {
  const previousProps: IObj = React.useRef(null)
  React.useEffect(() => {
    if(previousProps.current) {
      const allKeys = Object.keys({...previousProps.current, ...props})
      const changesObj: IObj = {}
      allKeys.forEach(key => {
        if(previousProps.current[key] !== props[key]) {
            changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          }
        }
      })

      if(Object.keys(changesObj).length){
        console.log(`[why-did-you-update]`, name, changesObj)
      }
    }

    previousProps.current = props
  })
}

export {
  createContainer,
  nest,
  useImmer,
  useWhyDidYouUpdate
}

