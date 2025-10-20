const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // ⬅️ envía cookies automáticamente
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Error ${res.status}`)
  }

  return res.json()
}
