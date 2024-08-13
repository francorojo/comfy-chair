import {Review} from '@app/review'
import {Session} from '@app/session'
import {generateRegularArticle} from '@tests/utils/articleGenerator'
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
		const session = new Session(
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
		const session = new Session(
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
		const session = new Session(
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
		const session = new Session(
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
		const session = new Session(
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
		const session = new Session(
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
		const session = new Session(
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
