import { vars } from "@/lib/theme"
import { css } from "@linaria/core"

import helping_tree from "@/Images/helping_tree.jpg"

export const authLayout = css`
	height: 100%;
	background: 
	radial-gradient(circle, 
		rgba(0, 0, 0, 0.9) 30%, 
		rgba(0, 0, 0, 0.5) 35%, 
		rgba(0, 0, 0, 0.05) 90%), 
	url(${helping_tree});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
`
