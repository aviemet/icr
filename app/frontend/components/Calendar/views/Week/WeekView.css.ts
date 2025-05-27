import { css } from "@linaria/core"

import { eventWrapper } from "../../components/TimeGrid/components/Event/Event.css"

export const weekView = css`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  position: relative;
`

export const animationContainer = css`
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
	width: 100%;
`

export const overlap = css`
	.${ eventWrapper } {
		margin-left: 0;
		position: relative;
		z-index: 1;

		&[style*="--overlap-count: 1"] {
			width: 85%;
			margin-left: 0;
		}

		&[style*="--overlap-count: 2"] {
			width: 85%;
			margin-left: 15%;
		}

		&[style*="--overlap-count: 3"] {
			width: 100%;
			margin-left: 0;
		}

		&[style*="--overlap-count: 4"] {
			width: 85%;
			margin-left: 15%;
		}

		&[style*="--overlap-count: 5"] {
			width: 100%;
			margin-left: 0;
		}

		&[style*="--has-same-start"] {
			width: calc((100% / var(--has-same-start, 1)) - 0.5rem);
			margin-left: calc(100% / var(--has-same-start));
		}

		&:hover {
			z-index: 2;
		}
	}
`
