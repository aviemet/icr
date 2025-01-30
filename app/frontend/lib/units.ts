import { px } from "@mantine/core"

export { rem } from "@mantine/core"

const fixedPx = (val: string) => {
	return + px(val)
}

export { fixedPx as px }
