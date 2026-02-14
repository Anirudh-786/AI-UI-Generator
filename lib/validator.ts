const allowed = [
  "Button",
  "Card",
  "Input",
  "Table",
  "Modal",
  "Sidebar",
  "Navbar",
  "Chart"
]

export function validateCode(code: string) {
  const matches = code.match(/<([A-Z][A-Za-z.]*)/g) || []

  for (let tag of matches) {
    const name = tag.replace("<", "")

    // Ignore React.Fragment
    if (name === "React.Fragment") continue

    if (!allowed.includes(name)) {
      throw new Error("Unauthorized component used: " + name)
    }
  }
}
