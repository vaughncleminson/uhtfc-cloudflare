import { Gilda_Display, Parisienne, Roboto } from 'next/font/google'

export const gilda = Gilda_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-gilda',
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
