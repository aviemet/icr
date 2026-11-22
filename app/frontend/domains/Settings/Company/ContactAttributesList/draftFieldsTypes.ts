export interface DraftFieldsProps {
	draft: Record<string, string>
	setDraft: (next: Record<string, string>) => void
}
