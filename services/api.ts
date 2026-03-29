// services/api.ts
export const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchData() {
  const res = await fetch(`https://maps.googleapis.com/maps/api/some_endpoint?key=${apiKey}`);
  return res.json();
}
