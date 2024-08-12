export function flatMap<T, U>(
	iterable: IterableIterator<T>,
	functionParam: (item: T) => Iterable<U>
): U[] {
	const result: U[] = []

	for (const item of iterable) {
		for (const mappedItem of functionParam(item)) {
			result.push(mappedItem)
		}
	}

	return result
}

export function iterableIncludes<T>(
	iterable: Iterable<T>,
	valueToFind: T
): boolean {
	for (const element of iterable) {
		if (
			element === valueToFind ||
			(Number.isNaN(valueToFind) && Number.isNaN(element))
		) {
			return true
		}
	}
	return false
}
