export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const { start, end } = query as { start: string; end: string }

  if (!start || !end) {
    throw createError({ statusCode: 400, message: 'Missing start or end parameters' })
  }

  const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${config.leafletApiKey}&start=${start}&end=${end}`

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'ORS API error' })
  }

  return response.json()
})
