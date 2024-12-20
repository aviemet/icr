import { create } from 'zustand'
import { createContrastingColorSlice, type ContrastingColorSlice } from './contrastingColorSlice'
import { createLayoutSlice, type LayoutSlice } from './layoutSlice'

const useStore = create<ContrastingColorSlice & LayoutSlice>((...args) => ({
	...createContrastingColorSlice(...args),
	...createLayoutSlice(...args),
}))

export default useStore
