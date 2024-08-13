import {Article} from '@app/article'
import {Review} from '@app/review'
import {TopN, MinimumValue} from '@app/sessionSelection'
import {User} from '@app/user'
import {generateRegularArticle} from '../utils/articleGenerator'
import {dummyBidder1, dummyBidder2, dummyBidder3} from '../utils/dummies'

describe('test sessionSelection case use', () => {
	test('TopN selection should return the first N articles ordered by its reviews', () => {
		const sessionSelectionTop3 = new TopN(3)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		//Add article1 reviews -> Best article -> 1
		const article1 = generateRegularArticle()
		article1.setReviewers([user1, user2, user3])
		article1.addReview(new Review(user1, 3, 'Excelent'))
		article1.addReview(new Review(user2, 3, 'Excelent'))
		article1.addReview(new Review(user3, 3, 'Excelent'))

		//Add article2 reviews -> Worst article -> 3
		const article2 = generateRegularArticle()
		article2.setReviewers([user1, user2, user3])
		article2.addReview(new Review(user1, -3, 'Bad'))
		article2.addReview(new Review(user2, -3, 'Bad'))
		article2.addReview(new Review(user3, -3, 'Bad'))

		//Add article3 reviews -> Normal article -> 2
		const article3 = generateRegularArticle()
		article3.setReviewers([user1, user2, user3])
		article3.addReview(new Review(user1, 0, 'Normal'))
		article3.addReview(new Review(user2, 0, 'Normal'))
		article3.addReview(new Review(user3, 0, 'Normal'))

		// article1 -- 1
		// article3 -- 3
		// article2 -- 2

		expect([article1, article3, article2]).toEqual(
			sessionSelectionTop3.selection([article1, article2, article3])
		)
	})

	test('MinimumValue N selection should return only articles whose values are over the N value', () => {
		const sessionSelectionMinimum0 = new MinimumValue(0)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		//Add article1 reviews -> Best article
		const article1 = generateRegularArticle()
		article1.setReviewers([user1, user2, user3])
		article1.addReview(new Review(user1, 3, 'Excelent'))
		article1.addReview(new Review(user2, 3, 'Excelent'))
		article1.addReview(new Review(user3, 3, 'Excelent'))

		//Add article2 reviews -> Worst article -> 3
		const article2 = generateRegularArticle()
		article2.setReviewers([user1, user2, user3])
		article2.addReview(new Review(user1, -3, 'Bad'))
		article2.addReview(new Review(user2, -3, 'Bad'))
		article2.addReview(new Review(user3, -3, 'Bad'))

		//Add article3 reviews -> Normal article -> 2
		const article3 = generateRegularArticle()
		article3.setReviewers([user1, user2, user3])
		article3.addReview(new Review(user1, 0, 'Normal'))
		article3.addReview(new Review(user2, 0, 'Normal'))
		article3.addReview(new Review(user3, 0, 'Normal'))

		// article1
		// article3 -- Out
		// article2

		expect([article1, article3]).toEqual(
			sessionSelectionMinimum0.selection([article1, article2, article3])
		)
	})
})
