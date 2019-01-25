import * as React from 'react'
import produce, { Draft } from 'immer'
import createContainer from "constate"

// types
type Recipe<S = any> = (this: Draft<S>, draftState: Draft<S>) => void | S
type Update<S = any> = (recipe: Recipe<S>) => void
type UseImmer<S = any> = (p: S) => [S, Update<S>]


/**
 * immer: https://github.com/mweststrate/immer
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
*/
const nest = (...components: any[]) => (props: any) => 
  components.reduceRight(
    (children, Current) => <Current {...props}>{children}</Current>,
    props.children
  )


export {
  createContainer,
  nest,
  useImmer
}

