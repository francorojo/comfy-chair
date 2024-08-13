import {ArticleType} from '@app/article'
import {Review} from '@app/review'
import {PosterSession, RegularSession, WorkshopSession} from '@app/session'
import {
	MinimumValue,
	MultiSelection,
	SessionSelection,
	TopN
} from '@app/sessionSelection'
import {
	generatePoster,
	generateRegularArticle
} from '@tests/utils/articleGenerator'
import {
	top3SelectionDummy,
	defaultDeadlineTomorrow,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	dummyBidder4
} from '@tests/utils/dummies'

describe('SELECTION state test suite', () => {
	test('Session state should be SELECTION when entering SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))

		session.startSelection()

		expect(session.isSelectionState()).toBeTruthy()
	})

	test('Session should throw an error when trying to get bidders in SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))

		session.startSelection()

		expect(() => {
			session.getBidders()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should throw an error when trying to get bids in SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))

		session.startSelection()

		expect(() => {
			session.getBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should throw an error when trying to get bid in SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))
		session.startSelection()

		expect(() => {
			session.getBid(user1, article)
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should throw an error when trying to close bids in SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))
		session.startSelection()

		expect(() => {
			session.closeBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should throw an error when trying to bid in SELECTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user4, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))
		session.startSelection()

		expect(() => {
			session.bid(user1, article, 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should throw an error when trying to start selection in BIDDING state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //3
		session.bid(user3, article, 'MAYBE') //2
		session.startReviewAndAssignment()
		session.addReview(article, new Review(user1, 3, 'Excelent'))
		session.addReview(article, new Review(user2, 3, 'Excelent'))
		session.addReview(article, new Review(user3, 3, 'Excelent'))
		session.startSelection()
		expect(() => {
			session.startSelection()
		}).toThrow(new Error('This session can not be updated to SELECTION'))
	})
})

describe('Selection behaviour tests suite', () => {
	test('Regular Session should return the top 2 articles in selection', () => {
		const session = new RegularSession(
			'Test',
			3,
			new TopN(2),
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		const article3 = generateRegularArticle()
		session.addArticle(article1)
		session.addArticle(article2)
		session.addArticle(article3)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //3
		session.bid(user3, article1, 'MAYBE') //2

		session.bid(user3, article2, 'INTERESTED') //1
		session.bid(user1, article2, 'NOT INTERESTED') //3
		session.bid(user2, article2, 'MAYBE') //2

		session.bid(user2, article3, 'INTERESTED') //1
		session.bid(user3, article3, 'NOT INTERESTED') //3
		session.bid(user1, article3, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(article1, new Review(user1, 3, 'Excelent'))
		session.addReview(article1, new Review(user2, 3, 'Excelent'))
		session.addReview(article1, new Review(user3, 3, 'Excelent'))

		session.addReview(article2, new Review(user1, 2, 'Good'))
		session.addReview(article2, new Review(user2, 2, 'Good'))
		session.addReview(article2, new Review(user3, 2, 'Good'))

		session.addReview(article3, new Review(user1, 1, 'Poor'))
		session.addReview(article3, new Review(user2, 1, 'Poor'))
		session.addReview(article3, new Review(user3, 1, 'Poor'))

		session.startSelection()

		expect(session.selection()).toEqual([article1, article2])
	})

	test('Poster Session should return the top 2 posters in selection', () => {
		const session = new PosterSession(
			'Test',
			3,
			new TopN(2),
			defaultDeadlineTomorrow
		)
		const poster1 = generatePoster()
		const poster2 = generatePoster()
		const poster3 = generatePoster()
		session.addArticle(poster1)
		session.addArticle(poster2)
		session.addArticle(poster3)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, poster1, 'INTERESTED') //1
		session.bid(user2, poster1, 'NOT INTERESTED') //3
		session.bid(user3, poster1, 'MAYBE') //2

		session.bid(user3, poster2, 'INTERESTED') //1
		session.bid(user1, poster2, 'NOT INTERESTED') //3
		session.bid(user2, poster2, 'MAYBE') //2

		session.bid(user2, poster3, 'INTERESTED') //1
		session.bid(user3, poster3, 'NOT INTERESTED') //3
		session.bid(user1, poster3, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(poster1, new Review(user1, 3, 'Excelent'))
		session.addReview(poster1, new Review(user2, 3, 'Excelent'))
		session.addReview(poster1, new Review(user3, 3, 'Excelent'))

		session.addReview(poster2, new Review(user1, 2, 'Good'))
		session.addReview(poster2, new Review(user2, 2, 'Good'))
		session.addReview(poster2, new Review(user3, 2, 'Good'))

		session.addReview(poster3, new Review(user1, 1, 'Poor'))
		session.addReview(poster3, new Review(user2, 1, 'Poor'))
		session.addReview(poster3, new Review(user3, 1, 'Poor'))

		session.startSelection()

		expect(session.selection()).toEqual([poster1, poster2])
	})

	test('Regular Session should return the minimum value 8 of articles in selection', () => {
		const session = new RegularSession(
			'Test',
			3,
			new MinimumValue(8),
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		const article3 = generateRegularArticle()
		session.addArticle(article1)
		session.addArticle(article2)
		session.addArticle(article3)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //3
		session.bid(user3, article1, 'MAYBE') //2

		session.bid(user3, article2, 'INTERESTED') //1
		session.bid(user1, article2, 'NOT INTERESTED') //3
		session.bid(user2, article2, 'MAYBE') //2

		session.bid(user2, article3, 'INTERESTED') //1
		session.bid(user3, article3, 'NOT INTERESTED') //3
		session.bid(user1, article3, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(article1, new Review(user1, 3, 'Excelent'))
		session.addReview(article1, new Review(user2, 3, 'Excelent'))
		session.addReview(article1, new Review(user3, 3, 'Excelent'))

		session.addReview(article2, new Review(user1, 2, 'Good'))
		session.addReview(article2, new Review(user2, 2, 'Good'))
		session.addReview(article2, new Review(user3, 2, 'Good'))

		session.addReview(article3, new Review(user1, 1, 'Poor'))
		session.addReview(article3, new Review(user2, 1, 'Poor'))
		session.addReview(article3, new Review(user3, 1, 'Poor'))

		session.startSelection()

		expect(session.selection()).toEqual([article1])
	})

	test('Poster Session should return the minimum value 5 of posters in selection', () => {
		const session = new PosterSession(
			'Test',
			3,
			new TopN(2),
			defaultDeadlineTomorrow
		)
		const poster1 = generatePoster()
		const poster2 = generatePoster()
		const poster3 = generatePoster()
		session.addArticle(poster1)
		session.addArticle(poster2)
		session.addArticle(poster3)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, poster1, 'INTERESTED') //1
		session.bid(user2, poster1, 'NOT INTERESTED') //3
		session.bid(user3, poster1, 'MAYBE') //2

		session.bid(user3, poster2, 'INTERESTED') //1
		session.bid(user1, poster2, 'NOT INTERESTED') //3
		session.bid(user2, poster2, 'MAYBE') //2

		session.bid(user2, poster3, 'INTERESTED') //1
		session.bid(user3, poster3, 'NOT INTERESTED') //3
		session.bid(user1, poster3, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(poster1, new Review(user1, 3, 'Excelent'))
		session.addReview(poster1, new Review(user2, 3, 'Excelent'))
		session.addReview(poster1, new Review(user3, 3, 'Excelent'))

		session.addReview(poster2, new Review(user1, 2, 'Good'))
		session.addReview(poster2, new Review(user2, 2, 'Good'))
		session.addReview(poster2, new Review(user3, 2, 'Good'))

		session.addReview(poster3, new Review(user1, 1, 'Poor'))
		session.addReview(poster3, new Review(user2, 1, 'Poor'))
		session.addReview(poster3, new Review(user3, 1, 'Poor'))

		session.startSelection()

		expect(session.selection()).toEqual([poster1, poster2])
	})

	test('Workshop Session should return the top 3 regular articles and the top 2 posters in selection all in one array', () => {
		const multiSelection = new MultiSelection(
			new Map<ArticleType, SessionSelection>([
				['POSTER', new TopN(2)],
				['REGULAR', new TopN(3)]
			])
		)

		const session = new WorkshopSession(
			'Test',
			10,
			multiSelection,
			defaultDeadlineTomorrow
		)
		const poster1 = generatePoster()
		const poster2 = generatePoster()
		const poster3 = generatePoster()
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		const article3 = generateRegularArticle()
		const article4 = generateRegularArticle()
		session.addArticle(poster1)
		session.addArticle(poster2)
		session.addArticle(poster3)
		session.addArticle(article1)
		session.addArticle(article2)
		session.addArticle(article3)
		session.addArticle(article4)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, poster1, 'INTERESTED') //1
		session.bid(user2, poster1, 'NOT INTERESTED') //3
		session.bid(user3, poster1, 'MAYBE') //2

		session.bid(user3, poster2, 'INTERESTED') //1
		session.bid(user1, poster2, 'NOT INTERESTED') //3
		session.bid(user2, poster2, 'MAYBE') //2

		session.bid(user2, poster3, 'INTERESTED') //1
		session.bid(user3, poster3, 'NOT INTERESTED') //3
		session.bid(user1, poster3, 'MAYBE') //2

		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //3
		session.bid(user3, article1, 'MAYBE') //2

		session.bid(user3, article2, 'INTERESTED') //1
		session.bid(user1, article2, 'NOT INTERESTED') //3
		session.bid(user2, article2, 'MAYBE') //2

		session.bid(user2, article3, 'INTERESTED') //1
		session.bid(user3, article3, 'NOT INTERESTED') //3
		session.bid(user1, article3, 'MAYBE') //2

		session.bid(user3, article4, 'INTERESTED') //1
		session.bid(user1, article4, 'NOT INTERESTED') //3
		session.bid(user2, article4, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(poster1, new Review(user1, 3, 'Excelent'))
		session.addReview(poster1, new Review(user2, 3, 'Excelent'))
		session.addReview(poster1, new Review(user3, 3, 'Excelent'))

		session.addReview(poster2, new Review(user1, 2, 'Good'))
		session.addReview(poster2, new Review(user2, 2, 'Good'))
		session.addReview(poster2, new Review(user3, 2, 'Good'))

		session.addReview(poster3, new Review(user1, 1, 'Poor'))
		session.addReview(poster3, new Review(user2, 1, 'Poor'))
		session.addReview(poster3, new Review(user3, 1, 'Poor'))

		session.addReview(article1, new Review(user1, 3, 'Excellent'))
		session.addReview(article1, new Review(user2, 3, 'Excellent'))
		session.addReview(article1, new Review(user3, 3, 'Excellent'))

		session.addReview(article2, new Review(user1, 2, 'Good'))
		session.addReview(article2, new Review(user2, 2, 'Good'))
		session.addReview(article2, new Review(user3, 2, 'Good'))

		session.addReview(article3, new Review(user1, 1, 'Fair'))
		session.addReview(article3, new Review(user2, 1, 'Fair'))
		session.addReview(article3, new Review(user3, 1, 'Fair'))

		session.addReview(article4, new Review(user1, 0, 'Poor'))
		session.addReview(article4, new Review(user2, 0, 'Poor'))
		session.addReview(article4, new Review(user3, 0, 'Poor'))

		session.startSelection()

		const selection = session.selection()

		expect(session.selection()).toEqual([
			poster1,
			poster2,
			article1,
			article2,
			article3
		])
	})

	test('Workshop Session should return the minimum value 6 of articles and the minimum value 4 of posters in selection', () => {
		const multiSelection = new MultiSelection(
			new Map<ArticleType, SessionSelection>([
				['POSTER', new MinimumValue(6)],
				['REGULAR', new MinimumValue(4)]
			])
		)

		const session = new WorkshopSession(
			'Test',
			10,
			multiSelection,
			defaultDeadlineTomorrow
		)
		const poster1 = generatePoster()
		const poster2 = generatePoster()
		const poster3 = generatePoster()
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		const article3 = generateRegularArticle()
		const article4 = generateRegularArticle()
		session.addArticle(poster1)
		session.addArticle(poster2)
		session.addArticle(poster3)
		session.addArticle(article1)
		session.addArticle(article2)
		session.addArticle(article3)
		session.addArticle(article4)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, poster1, 'INTERESTED') //1
		session.bid(user2, poster1, 'NOT INTERESTED') //3
		session.bid(user3, poster1, 'MAYBE') //2

		session.bid(user3, poster2, 'INTERESTED') //1
		session.bid(user1, poster2, 'NOT INTERESTED') //3
		session.bid(user2, poster2, 'MAYBE') //2

		session.bid(user2, poster3, 'INTERESTED') //1
		session.bid(user3, poster3, 'NOT INTERESTED') //3
		session.bid(user1, poster3, 'MAYBE') //2

		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //3
		session.bid(user3, article1, 'MAYBE') //2

		session.bid(user3, article2, 'INTERESTED') //1
		session.bid(user1, article2, 'NOT INTERESTED') //3
		session.bid(user2, article2, 'MAYBE') //2

		session.bid(user2, article3, 'INTERESTED') //1
		session.bid(user3, article3, 'NOT INTERESTED') //3
		session.bid(user1, article3, 'MAYBE') //2

		session.bid(user3, article4, 'INTERESTED') //1
		session.bid(user1, article4, 'NOT INTERESTED') //3
		session.bid(user2, article4, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(poster1, new Review(user1, 3, 'Excelent'))
		session.addReview(poster1, new Review(user2, 3, 'Excelent'))
		session.addReview(poster1, new Review(user3, 3, 'Excelent'))

		session.addReview(poster2, new Review(user1, 2, 'Good'))
		session.addReview(poster2, new Review(user2, 2, 'Good'))
		session.addReview(poster2, new Review(user3, 2, 'Good'))

		session.addReview(poster3, new Review(user1, 1, 'Poor'))
		session.addReview(poster3, new Review(user2, 1, 'Poor'))
		session.addReview(poster3, new Review(user3, 1, 'Poor'))

		session.addReview(article1, new Review(user1, 3, 'Excellent'))
		session.addReview(article1, new Review(user2, 3, 'Excellent'))
		session.addReview(article1, new Review(user3, 3, 'Excellent'))

		session.addReview(article2, new Review(user1, 2, 'Good'))
		session.addReview(article2, new Review(user2, 2, 'Good'))
		session.addReview(article2, new Review(user3, 2, 'Good'))

		session.addReview(article3, new Review(user1, 1, 'Fair'))
		session.addReview(article3, new Review(user2, 1, 'Fair'))
		session.addReview(article3, new Review(user3, 1, 'Fair'))

		session.addReview(article4, new Review(user1, 0, 'Poor'))
		session.addReview(article4, new Review(user2, 0, 'Poor'))
		session.addReview(article4, new Review(user3, 0, 'Poor'))

		session.startSelection()

		const selection = session.selection()

		expect(session.selection()).toEqual([
			poster1,
			poster2,
			article1,
			article2
		])
	})

	test('Workshop Session should return an array of only the top 2 articles and top 2 posters in separate ways during selection', () => {
		const multiSelection = new MultiSelection(
			new Map<ArticleType, SessionSelection>([
				['POSTER', new TopN(2)],
				['REGULAR', new TopN(2)]
			])
		)

		const session = new WorkshopSession(
			'Test',
			10,
			multiSelection,
			defaultDeadlineTomorrow
		)
		const poster1 = generatePoster()
		const poster2 = generatePoster()
		const poster3 = generatePoster()
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		const article3 = generateRegularArticle()
		const article4 = generateRegularArticle()
		session.addArticle(poster1)
		session.addArticle(poster2)
		session.addArticle(poster3)
		session.addArticle(article1)
		session.addArticle(article2)
		session.addArticle(article3)
		session.addArticle(article4)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, poster1, 'INTERESTED') //1
		session.bid(user2, poster1, 'NOT INTERESTED') //3
		session.bid(user3, poster1, 'MAYBE') //2

		session.bid(user3, poster2, 'INTERESTED') //1
		session.bid(user1, poster2, 'NOT INTERESTED') //3
		session.bid(user2, poster2, 'MAYBE') //2

		session.bid(user2, poster3, 'INTERESTED') //1
		session.bid(user3, poster3, 'NOT INTERESTED') //3
		session.bid(user1, poster3, 'MAYBE') //2

		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //3
		session.bid(user3, article1, 'MAYBE') //2

		session.bid(user3, article2, 'INTERESTED') //1
		session.bid(user1, article2, 'NOT INTERESTED') //3
		session.bid(user2, article2, 'MAYBE') //2

		session.bid(user2, article3, 'INTERESTED') //1
		session.bid(user3, article3, 'NOT INTERESTED') //3
		session.bid(user1, article3, 'MAYBE') //2

		session.bid(user3, article4, 'INTERESTED') //1
		session.bid(user1, article4, 'NOT INTERESTED') //3
		session.bid(user2, article4, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(poster1, new Review(user1, 3, 'Excelent'))
		session.addReview(poster1, new Review(user2, 3, 'Excelent'))
		session.addReview(poster1, new Review(user3, 3, 'Excelent'))

		session.addReview(poster2, new Review(user1, 2, 'Good'))
		session.addReview(poster2, new Review(user2, 2, 'Good'))
		session.addReview(poster2, new Review(user3, 2, 'Good'))

		session.addReview(poster3, new Review(user1, 1, 'Poor'))
		session.addReview(poster3, new Review(user2, 1, 'Poor'))
		session.addReview(poster3, new Review(user3, 1, 'Poor'))

		session.addReview(article1, new Review(user1, 3, 'Excellent'))
		session.addReview(article1, new Review(user2, 3, 'Excellent'))
		session.addReview(article1, new Review(user3, 3, 'Excellent'))

		session.addReview(article2, new Review(user1, 2, 'Good'))
		session.addReview(article2, new Review(user2, 2, 'Good'))
		session.addReview(article2, new Review(user3, 2, 'Good'))

		session.addReview(article3, new Review(user1, 1, 'Fair'))
		session.addReview(article3, new Review(user2, 1, 'Fair'))
		session.addReview(article3, new Review(user3, 1, 'Fair'))

		session.addReview(article4, new Review(user1, 0, 'Poor'))
		session.addReview(article4, new Review(user2, 0, 'Poor'))
		session.addReview(article4, new Review(user3, 0, 'Poor'))

		session.startSelection()

		expect(session.selection()).toEqual([
			poster1,
			poster2,
			article1,
			article2
		])

		expect(session.selectPosters()).toEqual([poster1, poster2])
		expect(session.selectRegularArticles()).toEqual([article1, article2])
	})

	test('Workshop Session should return an array of only the top 2 posters in selection', () => {})
})
