export function Card({ title, children }: any) {
  return (
    <div className="border rounded-lg p-6 shadow-md bg-white w-full max-w-md mx-auto">
      {title && (
        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  )
}
