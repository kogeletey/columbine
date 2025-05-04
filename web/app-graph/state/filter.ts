import { satisfies } from 'semver'
import type { PackageModuleType } from '../types/node.ts'

export interface PackageNodeLike {
  name: string
  version: string
}

export interface FilterOptions {
  search: string
  modules: null | PackageModuleType[]
  focus: null | string[]
  why: null | string[]
  sourceType: null | 'prod' | 'dev'
  depths: null | (number | string)[]
  clusters: null | string[]
  clustersMode: 'and' | 'or'

  excludes: null | string[]
  excludeDts: boolean
  excludeOptional: boolean
  excludePrivate: boolean
  excludeWorkspace: boolean

  compareA: null | string[]
  compareB: null | string[]
}

export interface FilterSchema<Type> {
  type: StringConstructor | ArrayConstructor | BooleanConstructor
  default: Type
  category: 'select' | 'exclude' | 'compare' | 'option'
}

export const FILTERS_SCHEMA: {
  [x in keyof FilterOptions]: FilterSchema<FilterOptions[x]>
} = {
  search: { type: String, default: '', category: 'select' },
  modules: { type: Array, default: null, category: 'select' },
  focus: { type: Array, default: null, category: 'select' },
  why: { type: Array, default: null, category: 'select' },
  sourceType: { type: String, default: null, category: 'select' },
  depths: { type: Array, default: null, category: 'select' },
  clusters: { type: Array, default: null, category: 'select' },

  clustersMode: { type: String, default: 'or', category: 'option' },

  // Compare
  compareA: { type: Array, default: [], category: 'compare' },
  compareB: { type: Array, default: [], category: 'compare' },

  // Excludes
  excludes: { type: Array, default: null, category: 'exclude' },
  excludeDts: { type: Boolean, default: true, category: 'exclude' },
  excludeOptional: { type: Boolean, default: true, category: 'exclude' },
  excludePrivate: { type: Boolean, default: false, category: 'exclude' },
  excludeWorkspace: { type: Boolean, default: import.meta.env.BACKEND === 'webcontainer', category: 'exclude' },
}


/**
 * Construct a filter to match a package name
 *
 * - @foo/bar@1.0.0 or foobar@1.0.0 -> Exact match
 * - @foo/bar@* or @foo/bar -> Any version of the package
 * - @foo/bar@^1.0.0 -> Any version that matches the semver range
 * - bar-* -> Any version that matches the prefix
 * - *eslint* -> Any version that matches the wildcard
 */
export function constructPackageFilter(range: string): (pkg: PackageNodeLike) => boolean {
  const [name, version = '*'] = range.split(/\b@/)
  const hasWildcard = name?.includes('*')
  const nameMatch = hasWildcard
    ? new RegExp(`^${Array.from(name).map(char => char === '*' ? '.*' : char === '.' ? '\\.' : char).join('')}$`)
    : name

  return (pkg) => {
    const isNameMatch = nameMatch instanceof RegExp ? nameMatch.test(pkg.name) : pkg.name === name
    const isVersionMatch = version === '*' || pkg.version === version || satisfies(pkg.version, version)
    return isNameMatch && isVersionMatch
  }
}

export function constructPackageFilters<Node extends PackageNodeLike = PackageNodeLike>(
  ranges: (string | ((pkg: Node) => boolean)) [],
  mode: 'some' | 'every',
): (pkg: Node) => boolean {
  const filters = ranges.map(x => typeof x === 'string' ? constructPackageFilter(x) : x)
  return pkg => mode === 'some'
    ? filters.some(filter => filter(pkg))
    : filters.every(filter => filter(pkg))
}

