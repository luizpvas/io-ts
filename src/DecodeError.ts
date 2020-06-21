/**
 * @since 2.2.7
 */
import { Semigroup } from 'fp-ts/lib/Semigroup'
import * as FS from './FreeSemigroup'

/**
 * @category model
 * @since 2.2.7
 */
export interface Leaf<E> {
  readonly _tag: 'Leaf'
  readonly actual: unknown
  readonly error: E
}

/**
 * @category model
 * @since 2.2.7
 */
export const required: 'required' = 'required'

/**
 * @category model
 * @since 2.2.7
 */
export const optional: 'optional' = 'optional'

/**
 * @category model
 * @since 2.2.7
 */
export type Kind = 'required' | 'optional'

/**
 * @category model
 * @since 2.2.7
 */
export interface Key<E> {
  readonly _tag: 'Key'
  readonly key: string
  readonly kind: Kind
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}

/**
 * @category model
 * @since 2.2.7
 */
export interface Index<E> {
  readonly _tag: 'Index'
  readonly index: number
  readonly kind: Kind
  readonly errors: FS.FreeSemigroup<DecodeError<E>>
}

/**
 * @category model
 * @since 2.2.7
 */
export type DecodeError<E> = Leaf<E> | Key<E> | Index<E>

/**
 * @category constructors
 * @since 2.2.7
 */
export const leaf = <E>(actual: unknown, error: E): DecodeError<E> => ({ _tag: 'Leaf', actual, error })

/**
 * @category constructors
 * @since 2.2.7
 */
export const key = <E>(key: string, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>): DecodeError<E> => ({
  _tag: 'Key',
  key,
  kind,
  errors
})

/**
 * @category constructors
 * @since 2.2.7
 */
export const index = <E>(index: number, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>): DecodeError<E> => ({
  _tag: 'Index',
  index,
  kind,
  errors
})

/**
 * @category destructors
 * @since 2.2.7
 */
export const fold = <E, R>(patterns: {
  Leaf: (input: unknown, error: E) => R
  Key: (key: string, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => R
  Index: (index: number, kind: Kind, errors: FS.FreeSemigroup<DecodeError<E>>) => R
}): ((e: DecodeError<E>) => R) => {
  const f = (e: DecodeError<E>): R => {
    switch (e._tag) {
      case 'Leaf':
        return patterns.Leaf(e.actual, e.error)
      case 'Key':
        return patterns.Key(e.key, e.kind, e.errors)
      case 'Index':
        return patterns.Index(e.index, e.kind, e.errors)
    }
  }
  return f
}

/**
 * @category instances
 * @since 2.2.7
 */
export function getSemigroup<E = never>(): Semigroup<FS.FreeSemigroup<DecodeError<E>>> {
  return FS.getSemigroup()
}
