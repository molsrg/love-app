const ALLOWED_PROFILES = ["foot-walking", "driving-car"] as const;
type Profile = (typeof ALLOWED_PROFILES)[number];

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const {
        start,
        end,
        profile = "foot-walking",
    } = query as { start: string; end: string; profile?: string };

    if (!start || !end) {
        throw createError({
            statusCode: 400,
            message: "Missing start or end parameters",
        });
    }

    if (!ALLOWED_PROFILES.includes(profile as Profile)) {
        throw createError({ statusCode: 400, message: "Invalid profile" });
    }

    const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${config.leafletApiKey}&start=${start}&end=${end}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            message: "ORS API error",
        });
    }

    return response.json();
});
