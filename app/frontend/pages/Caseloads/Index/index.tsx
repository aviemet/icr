import { Page } from "@/components"
import { CaseloadsBoard, type CaseloadsBoardProps } from "@/domains/Caseloads"

export default function CaseloadsIndex(props: CaseloadsBoardProps) {
	return (
		<Page title="Caseloads">
			<CaseloadsBoard { ...props } />
		</Page>
	)
}
