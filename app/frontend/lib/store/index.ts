import { create } from "zustand"

import { createContrastingColorSlice, type ContrastingColorSlice } from "./contrastingColorSlice"
import { createDefaultsSlice, type DefaultsSlice } from "./defaultsSlice"
import { createLayoutSlice, type LayoutSlice } from "./layoutSlice"

type GlobalStore = ContrastingColorSlice & LayoutSlice & DefaultsSlice

export const useStore = create<GlobalStore>((...args) => ({
	...createContrastingColorSlice(...args),
	...createLayoutSlice(...args),
	...createDefaultsSlice(...args),
}))
