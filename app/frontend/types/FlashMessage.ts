export type FlashMessage = Record<"success" | "alert" | "info" | "warning", {
	id: string
	message: string
}>
