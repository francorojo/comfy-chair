import {Review} from '@app/review'
import {dummyAuthor1, dummyBidder1} from '@tests/utils/dummies'

describe('test review case use', () => {
	test('Create a new review correctly', () => {
		const review = new Review(dummyBidder1, 10, 'good')
		expect(10).toEqual(review.getNote())
		expect('good').toEqual(review.getText())
	})
})
