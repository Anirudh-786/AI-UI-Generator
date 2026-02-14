export function Modal({ title, isOpen, children }: any) {
  if (!isOpen) return null

  return (
    <>
      {title}
      {children}
    </>
  )
}
