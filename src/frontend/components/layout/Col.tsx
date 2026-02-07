type ColProps = {
  children: React.ReactNode
}
export default function Col(props: ColProps) {
  return <div className="flex flex-col w-full h-full gap-2">{props.children}</div>
}
