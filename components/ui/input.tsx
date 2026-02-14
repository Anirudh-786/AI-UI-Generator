export function Input({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="
        w-full
        border
        px-3 py-2
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />
  )
}
