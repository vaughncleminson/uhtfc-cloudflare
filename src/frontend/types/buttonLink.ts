export type ButtonLink = {
  link?: {
    type?: ('reference' | 'custom') | null
    newTab?: boolean | null
    internalLink?: string | null
    url?: string | null
    label?: string | null
    show?: 'always' | 'auth' | 'no-auth' | null
  }
  id?: string | null
}
