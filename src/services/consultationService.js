const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5072/api";

export async function getConsultationsByPatientId(patientId) {
  const response = await fetch(`${API_URL}/consultation/patient/${patientId}`);

  if (!response.ok) {
    throw new Error(`Error al obtener consultas: ${response.status}`);
  }

  return await response.json();
}