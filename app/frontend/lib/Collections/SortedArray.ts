/**
 * A collection that maintains items in sorted order using lazy sorting.
 *
 * This class provides array-like functionality while ensuring items are sorted
 * according to a provided comparison function. It defers sorting until the
 * first read operation, making it efficient for batch insertions.
 *
 * @template T The type of elements in the array
 *
 * @example
 * ```typescript
 * const sorted = new SortedArray<number>((a, b) => a - b);
 * sorted.push(3);
 * sorted.push(1);
 * sorted.push(2);
 *
 * // Items are sorted only when accessed
 * for (const item of sorted) {
 *   console.log(item); // Outputs: 1, 2, 3
 * }
 * ```
 *
 * @implements {Iterable<T>}
 */
export class SortedArray<T> implements Iterable<T> {
	private items: T[] = []
	private compareFn: (a: T, b: T) => number
	private isSorted = false

	/**
	 * Creates a default comparison function for basic comparable types.
	 * Works with numbers and strings using their natural ordering.
	 *
	 * @example
	 * ```typescript
	 * // For numbers
	 * const numbers = new SortedArray(SortedArray.defaultCompare);
	 * numbers.push(3, 1, 2); // Will sort as [1, 2, 3]
	 *
	 * // For strings
	 * const strings = new SortedArray(SortedArray.defaultCompare);
	 * strings.push("c", "a", "b"); // Will sort as ["a", "b", "c"]
	 * ```
	 */
	static defaultCompare<U extends string | number>(a: U, b: U): number {
		if(a < b) return - 1
		if(a > b) return 1
		return 0
	}

	constructor(compareFn: (a: T, b: T) => number = SortedArray.defaultCompare as (a: T, b: T) => number) {
		this.compareFn = compareFn
	}

	private sort() {
		if(this.isSorted) return

		this.items.sort(this.compareFn)
		this.isSorted = true
	}

	// Make the class iterable
	[Symbol.iterator](): Iterator<T> {
		this.sort()

		return this.items[Symbol.iterator]()
	}

	// Array-like methods

	push(item: T) {
		this.items.push(item)
		this.isSorted = false

		return this.items.length
	}

	pop() {
		this.sort()

		return this.items.pop()
	}

	shift() {
		this.sort()

		return this.items.shift()
	}

	get(index: number) {
		this.sort()

		return this.items[index]
	}

	set(index: number, item: T) {
		this.isSorted = false

		this.items[index] = item

		return this.items[index]
	}

	has(index: number) {
		return index >= 0 && index < this.items.length
	}

	delete(index: number) {
		if(index < 0 || index >= this.items.length) {
			throw new Error(`Index out of bounds: ${index}`)
		}

		if(index === 0) return this.shift()
		if(index === this.items.length - 1) return this.pop()

		this.isSorted = false

		const deletedItem = this.items[index]
		this.items.splice(index, 1)
		return deletedItem
	}

	map<U>(callback: (value: T, index: number, array: T[]) => U) {
		this.sort()

		return this.items.map(callback)
	}

	get length() {
		return this.items.length
	}

	filter(predicate: (value: T, index: number, array: T[]) => boolean) {
		this.sort()

		return this.items.filter(predicate)
	}

	forEach(callback: (value: T, index: number, array: T[]) => void) {
		this.sort()

		this.items.forEach(callback)
	}

	reduce<U>(callback: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) {
		this.sort()

		return this.items.reduce(callback, initialValue)
	}
}
