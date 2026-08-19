const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5072/api";

export async function getAllPatients() {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/patient`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener pacientes: ${response.status}`);
  }

  return await response.json();
}