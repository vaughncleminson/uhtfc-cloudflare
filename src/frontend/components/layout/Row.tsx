type RowProps = {
  children: React.ReactNode
  className?: string
}
export default function Row(props: RowProps) {
  return (
    <div
      className={`flex flex-col w-full px-5 gap-5 lg:flex-row lg:px-32 lg:gap-12 ${props.className || ''}`}
    >
      {props.children}
    </div>
  )
}
