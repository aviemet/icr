export function sumRecordValues(values: Record<string, number>): number {
	return Object.values(values).reduce((total, value) => total + value, 0)
}

export function countClientsWithPending(
	clients: Array<{ id: string }>,
	pendingShiftCountByClient: Record<string, number>,
): number {
	return clients.filter(client => (pendingShiftCountByClient[client.id] ?? 0) > 0).length
}

export function countFullyReviewedClients(
	clients: Array<{ id: string }>,
	pendingShiftCountByClient: Record<string, number>,
	totalShiftCountByClient: Record<string, number>,
): number {
	return clients.filter(client => {
		const total = totalShiftCountByClient[client.id] ?? 0
		const pending = pendingShiftCountByClient[client.id] ?? 0
		return total > 0 && pending === 0
	}).length
}

export function sumAuthorizedHours(
	clients: Array<{ ihss_authorized_hours?: string | number | null }>,
): number {
	return clients.reduce((total, client) => total + Number(client.ihss_authorized_hours ?? 0), 0)
}
