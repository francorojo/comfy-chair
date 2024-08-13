import {Interest} from './session'

export function compareInterests(
	interestA: Interest,
	interestB: Interest
): number {
	return (
		['NOT INTERESTED', 'NONE', 'MAYBE', 'INTERESTED'].indexOf(interestB) -
		['NOT INTERESTED', 'NONE', 'MAYBE', 'INTERESTED'].indexOf(interestA)
	)
}
