import { Review } from '@app/review';

describe('test review case use', () => {
	test('Create a new review correctly', () => {
		const review = new Review(10, 'good');
		expect(10).toEqual(review.getNote());
		expect('good').toEqual(review.getText());
	});
});
