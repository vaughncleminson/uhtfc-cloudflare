import { Crimson_Pro, Gilda_Display, Oswald, Parisienne, Roboto } from 'next/font/google'

export const gilda = Gilda_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-gilda',
})

export const crimson = Crimson_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
})

export const charm = Parisienne({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-charm',
  display: 'swap',
})

export const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const oswald = Oswald({
  weight: ['200', '400'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})
