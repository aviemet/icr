export function clientHasIhss(
	client: { ihss_authorized_hours?: string | number | null },
): boolean {
	return Number(client.ihss_authorized_hours ?? 0) > 0
}
