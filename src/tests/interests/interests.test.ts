import {compareInterests} from '@app/utils'

describe('Utils compare suite tests', () => {
	test('Should order INTERESTED first to MAYBE', () => {
		expect(compareInterests('INTERESTED', 'MAYBE')).toBeLessThan(0)
	})

	test('Should order MAYBE first to NOT INTERESTED', () => {
		expect(compareInterests('MAYBE', 'NOT INTERESTED')).toBeLessThan(0)
	})

	test('Should order NONE first to NOT INTERESTED', () => {
		expect(compareInterests('NOT INTERESTED', 'NONE')).toBeGreaterThan(0)
	})
})
