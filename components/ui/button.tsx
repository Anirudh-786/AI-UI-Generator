export function Button({ label }: { label: string }) {
  return (
    <button
      className="
        w-full
        px-4 py-2
        bg-blue-600
        hover:bg-blue-700
        active:scale-95
        transition
        duration-150
        text-white
        font-medium
        rounded-md
        shadow-sm
      "
    >
      {label}
    </button>
  )
}
