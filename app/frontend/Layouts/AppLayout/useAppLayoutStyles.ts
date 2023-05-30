import { createStyles } from '@mantine/core'

const sidebarAnimationDelay = '0.5s'

export default createStyles((theme) => ({
	page: {
	},

	header: {
		transition: `left ${sidebarAnimationDelay}, width ${sidebarAnimationDelay}`,
	},

	navbar: {
		transition: `width ${sidebarAnimationDelay}, min-width ${sidebarAnimationDelay}`,
	},

	wrapper: {
		minHeight: '100vh',
		width: '100%',
		display: 'grid',
		gap: '0px',
		gridTemplateRows: '1fr 35px',
		gridTemplateAreas: '"content" "footer"',

		'#content': {
			gridArea: 'content',
			height: '100%',
		},
		'#footer': {
			gridArea: 'footer',
		},
	},

	content: {
		height: '100%',
	},
}))
