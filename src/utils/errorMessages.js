const NETWORK_ERROR_MESSAGE = 'No pudimos conectar con el servidor. Probá de nuevo en unos minutos.'

// Un error de red (fetch sin respuesta) llega como TypeError sin status: no se muestra el texto crudo del navegador
export function getErrorMessage(err) {
  if (err?.status === undefined || err instanceof TypeError || err?.message === 'Failed to fetch') {
    return NETWORK_ERROR_MESSAGE
  }
  return err.message
}
