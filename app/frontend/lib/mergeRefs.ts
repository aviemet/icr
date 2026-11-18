import { type Ref, type RefCallback, type RefObject } from "react"

export function mergeRefs<T>(
	refs: Array<Ref<T> | undefined | null>
): RefCallback<T> {
	return (value) => {
		refs.forEach((ref) => {
			if(typeof ref === "function") {
				ref(value)
			} else if(ref !== null && ref !== undefined) {
				const objectRef: RefObject<T | null> = ref
				objectRef.current = value
			}
		})
	}
}
