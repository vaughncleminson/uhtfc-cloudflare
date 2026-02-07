export type NavigationType = {
  title: string
  link?: string
  children?: {
    title: string
    link?: string
    children?: {
      title: string
      link?: string
    }[]
  }[]
}[]
