import { useMemo } from "react"

import { monthEvent } from "./components/Event/Event.css"
import { monthView } from "./MonthView.css"

const useDynamicHoverStyles = (hoverId: string) => {
	// Generate dynamic hover styles
	return useMemo(() => {
		if(!hoverId) return ""
		const safeHoverId = String(hoverId).replace(/"/g, '\\"')

		return `
      .${monthView} [data-id="${safeHoverId}"] .${monthEvent} {
        background-color: var(--hover-color);
        outline: 1px solid color-mix(in srgb, white 50%, var(--event-color));
      }
      /* Apply to pseudo-elements for continued events */
      .${monthView} [data-id="${safeHoverId}"] .${monthEvent}.continues-on::after {
        border-left-color: var(--hover-color);
      }
      .${monthView} [data-id="${safeHoverId}"] .${monthEvent}.continued-from::before {
        border-top-color: var(--hover-color);
        border-bottom-color: var(--hover-color);
      }
    `
	}, [hoverId])
}

export { useDynamicHoverStyles }
