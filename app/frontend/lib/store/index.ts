import { create } from 'zustand'
import { createConstrastingColorSlice, type ContrastingColorSlice } from './contrastingColorSlice'
import { createLayoutSlice, type LayoutSlice } from './layoutSlice'

const useStore = create<ContrastingColorSlice & LayoutSlice>((...args) => ({
	...createConstrastingColorSlice(...args),
	...createLayoutSlice(...args),
}))

export default useStore

