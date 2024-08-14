import {Review} from '@app/review'
import {dummyAuthor1, dummyBidder1} from '@tests/utils/dummies'

describe('test review case use', () => {
	test('Review attributes should be accessible', () => {
		const review = new Review(dummyBidder1, 10, 'good')
		expect(review.getNote()).toEqual(10)
		expect(review.getText()).toEqual('good')
	})
})
