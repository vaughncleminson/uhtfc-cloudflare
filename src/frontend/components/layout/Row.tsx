type RowProps = {
  children: React.ReactNode
  className?: string
}
export default function Row(props: RowProps) {
  return (
    <div
      className={`flex flex-col w-full px-5 gap-5 lg:flex-row lg:px-40 ${props.className || ''}`}
    >
      {props.children}
    </div>
  )
}
