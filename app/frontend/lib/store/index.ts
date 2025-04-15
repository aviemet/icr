import { create } from "zustand"

import { createContrastingColorSlice, type ContrastingColorSlice } from "./contrastingColorSlice"
import { createDefaultsSlice, type DefaultsSlice } from "./defaultsSlice"
import { createLayoutSlice, type LayoutSlice } from "./layoutSlice"

type GlobalStore = ContrastingColorSlice & LayoutSlice & DefaultsSlice

const useStore = create<GlobalStore>((...args) => ({
	...createContrastingColorSlice(...args),
	...createLayoutSlice(...args),
	...createDefaultsSlice(...args),
}))

export default useStore
