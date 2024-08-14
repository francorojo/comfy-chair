import {Article, ArticleType} from '@app/article'
import {Review} from '@app/review'
import {
	TopN,
	MinimumValue,
	SessionSelection,
	MultiSelection
} from '@app/sessionSelection'
import {User} from '@app/user'
import {generatePoster, generateRegularArticle} from '../utils/articleGenerator'
import {dummyBidder1, dummyBidder2, dummyBidder3} from '../utils/dummies'

describe('test sessionSelection case use', () => {
	test('TopN selection should return the first 3 articles ordered by its reviews', () => {
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

		expect(
			sessionSelectionTop3.selection([article1, article2, article3])
		).toEqual([article1, article3, article2])
	})

	test('TopN selection should return the first 5 articles ordered by its reviews', () => {
		const sessionSelectionTop3 = new TopN(5)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		//Add article1 reviews -> Best article -> 1
		const article1 = generateRegularArticle()
		article1.setReviewers([user1, user2, user3])
		article1.addReview(new Review(user1, 3, 'Excellent'))
		article1.addReview(new Review(user2, 3, 'Excellent'))
		article1.addReview(new Review(user3, 3, 'Excellent'))

		//Add article2 reviews -> Worst article -> 3
		const article2 = generateRegularArticle()
		article2.setReviewers([user1, user2, user3])
		article2.addReview(new Review(user1, -3, 'Terrible'))
		article2.addReview(new Review(user2, -3, 'Terrible'))
		article2.addReview(new Review(user3, -3, 'Terrible'))

		//Add article3 reviews -> Mixed feedback -> 2
		const article3 = generateRegularArticle()
		article3.setReviewers([user1, user2, user3])
		article3.addReview(new Review(user1, 1, 'Good'))
		article3.addReview(new Review(user2, 0, 'Normal'))
		article3.addReview(new Review(user3, -1, 'Fair'))

		//Add article4 reviews -> Neutral to positive -> 2
		const article4 = generateRegularArticle()
		article4.setReviewers([user1, user2, user3])
		article4.addReview(new Review(user1, 2, 'Very Good'))
		article4.addReview(new Review(user2, 1, 'Good'))
		article4.addReview(new Review(user3, 0, 'Average'))

		//Add article5 reviews -> Mostly positive -> 1
		const article5 = generateRegularArticle()
		article5.setReviewers([user1, user2, user3])
		article5.addReview(new Review(user1, 2, 'Very Good'))
		article5.addReview(new Review(user2, 2, 'Very Good'))
		article5.addReview(new Review(user3, 1, 'Good'))

		//Add article6 reviews -> Mostly negative -> 3
		const article6 = generateRegularArticle()
		article6.setReviewers([user1, user2, user3])
		article6.addReview(new Review(user1, -2, 'Poor'))
		article6.addReview(new Review(user2, -2, 'Poor'))
		article6.addReview(new Review(user3, -3, 'Terrible'))

		expect(
			sessionSelectionTop3.selection([
				article1,
				article2,
				article3,
				article4,
				article5,
				article6
			])
		).toEqual([article1, article5, article4, article3, article6])
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

		expect(
			sessionSelectionMinimum0.selection([article1, article2, article3])
		).toEqual([article1, article3])
	})

	test('MinimumValue N selection should return only articles whose values are over the N value', () => {
		const sessionSelectionMinimum0 = new MinimumValue(2)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		//Add article1 reviews -> Best article -> 9
		const article1 = generateRegularArticle()
		article1.setReviewers([user1, user2, user3])
		article1.addReview(new Review(user1, 3, 'Excellent'))
		article1.addReview(new Review(user2, 3, 'Excellent'))
		article1.addReview(new Review(user3, 3, 'Excellent'))

		//Add article2 reviews -> Worst article -> -9
		const article2 = generateRegularArticle()
		article2.setReviewers([user1, user2, user3])
		article2.addReview(new Review(user1, -3, 'Terrible'))
		article2.addReview(new Review(user2, -3, 'Terrible'))
		article2.addReview(new Review(user3, -3, 'Terrible'))

		//Add article3 reviews -> Mixed feedback -> 0
		const article3 = generateRegularArticle()
		article3.setReviewers([user1, user2, user3])
		article3.addReview(new Review(user1, 1, 'Good'))
		article3.addReview(new Review(user2, 0, 'Normal'))
		article3.addReview(new Review(user3, -1, 'Fair'))

		//Add article4 reviews -> Neutral to positive -> 3
		const article4 = generateRegularArticle()
		article4.setReviewers([user1, user2, user3])
		article4.addReview(new Review(user1, 2, 'Very Good'))
		article4.addReview(new Review(user2, 1, 'Good'))
		article4.addReview(new Review(user3, 0, 'Average'))

		//Add article5 reviews -> Mostly positive -> 5
		const article5 = generateRegularArticle()
		article5.setReviewers([user1, user2, user3])
		article5.addReview(new Review(user1, 2, 'Very Good'))
		article5.addReview(new Review(user2, 2, 'Very Good'))
		article5.addReview(new Review(user3, 1, 'Good'))

		//Add article6 reviews -> Mostly negative -> -7
		const article6 = generateRegularArticle()
		article6.setReviewers([user1, user2, user3])
		article6.addReview(new Review(user1, -2, 'Poor'))
		article6.addReview(new Review(user2, -2, 'Poor'))
		article6.addReview(new Review(user3, -3, 'Terrible'))

		expect(
			sessionSelectionMinimum0.selection([
				article1,
				article2,
				article3,
				article4,
				article5,
				article6
			])
		).toEqual([article1, article4, article5])
	})

	test('MultiSelection should return top 2 articles and top 3 posters', () => {
		const top2Selection = new TopN(2)
		const top3Selection = new TopN(3)

		const selectionsMap: Map<ArticleType, SessionSelection> = new Map([
			['POSTER', top3Selection],
			['REGULAR', top2Selection]
		])

		const multiSelection = new MultiSelection(selectionsMap)

		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		//Add article1 reviews -> Best article -> 9
		const article1 = generateRegularArticle()
		article1.setReviewers([user1, user2, user3])
		article1.addReview(new Review(user1, 3, 'Excellent'))
		article1.addReview(new Review(user2, 3, 'Excellent'))
		article1.addReview(new Review(user3, 3, 'Excellent'))

		//Add article2 reviews -> Worst article -> -9
		const article2 = generateRegularArticle()
		article2.setReviewers([user1, user2, user3])
		article2.addReview(new Review(user1, -3, 'Terrible'))
		article2.addReview(new Review(user2, -3, 'Terrible'))
		article2.addReview(new Review(user3, -3, 'Terrible'))

		//Add article3 reviews -> Mixed feedback -> 0
		const article3 = generateRegularArticle()
		article3.setReviewers([user1, user2, user3])
		article3.addReview(new Review(user1, 1, 'Good'))
		article3.addReview(new Review(user2, 0, 'Normal'))
		article3.addReview(new Review(user3, -1, 'Fair'))

		//Add poster1 reviews -> Neutral to positive -> 3
		const poster1 = generatePoster()
		poster1.setReviewers([user1, user2, user3])
		poster1.addReview(new Review(user1, 2, 'Very Good'))
		poster1.addReview(new Review(user2, 1, 'Good'))
		poster1.addReview(new Review(user3, 0, 'Average'))

		//Add poster2 reviews -> Mostly positive -> 5
		const poster2 = generatePoster()
		poster2.setReviewers([user1, user2, user3])
		poster2.addReview(new Review(user1, 2, 'Very Good'))
		poster2.addReview(new Review(user2, 2, 'Very Good'))
		poster2.addReview(new Review(user3, 1, 'Good'))

		//Add poster3 reviews -> Mostly negative -> -7
		const poster3 = generatePoster()
		poster3.setReviewers([user1, user2, user3])
		poster3.addReview(new Review(user1, -2, 'Poor'))
		poster3.addReview(new Review(user2, -2, 'Poor'))
		poster3.addReview(new Review(user3, -3, 'Terrible'))

		expect(
			multiSelection.selection([
				article1,
				article2,
				article3,
				poster1,
				poster2,
				poster3
			])
		).toEqual([poster2, poster1, poster3, article1, article3])
	})
})
