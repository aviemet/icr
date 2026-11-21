export function plainTextFromHtml(html?: string | null) {
	if(!html) return ""
	return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}
