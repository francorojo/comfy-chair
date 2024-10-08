import {RegularSession} from '@app/session'
import {
	defaultDeadlineTomorrow,
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	dummyBidder4,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generateRegularArticle} from '../utils/articleGenerator'
import {Review} from '@app/review'
import {compareInterests} from '@app/sessionState'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('ASIGMENTANDREVIEW state suite', () => {
	test('Session can be updated to ASIGNMENTANDREVIEW if state is BIDDING and state should be ASIGNMENTANDREVIEW', () => {
		const session = new RegularSession(
			'Test',
			2,
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

		expect(session.isAssignmentAndReviewState()).toBeTruthy()
	})

	test('Session assigns users for review in ASIGMENTANDREVIEW state', () => {
		const session = new RegularSession(
			'Test',
			2,
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

		expect(session.isAssignmentAndReviewState()).toBeTruthy()
	})

	test('Session assigns users for review in ASIGMENTANDREVIEW state', () => {
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

		expect(session.getArticles().flatMap((a) => a.getReviewers())).toEqual([
			user1,
			user4,
			user3
		])
	})

	test('Session can add one review and ask for your reviews in ASIGMENTANDREVIEW state', () => {
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
		expect(session.getReview(article, user1).getNote()).toEqual(3)
		expect(session.getReview(article, user1).getText()).toEqual('Excelent')
	})

	test('Session can add two reviews and ask for your reviews in ASIGMENTANDREVIEW state', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		session.addArticle(article1)
		session.addArticle(article2)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		//Bids article 1
		session.bid(user1, article1, 'INTERESTED') //1
		session.bid(user2, article1, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article1, 'NONE') //3
		session.bid(user4, article1, 'MAYBE') //2

		//Bids article 2
		session.bid(user1, article2, 'INTERESTED') //1
		session.bid(user2, article2, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article2, 'NONE') //3
		session.bid(user4, article2, 'MAYBE') //2

		session.startReviewAndAssignment()

		session.addReview(article1, new Review(user4, 3, 'Excelent'))
		session.addReview(article2, new Review(user3, -3, 'Bad'))

		expect(session.getReview(article1, user4).getNote()).toEqual(3)
		expect(session.getReview(article1, user4).getText()).toEqual('Excelent')
		expect(session.getReview(article2, user3).getNote()).toEqual(-3)
		expect(session.getReview(article2, user3).getText()).toEqual('Bad')
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with a note out of permitted range', () => {
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

		expect(() => {
			session.addReview(article, new Review(user1, -5, 'Excelent'))
		}).toThrow(new Error('The note must be greater -3 and lower 3'))
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with an article without session', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generateRegularArticle()
		const article2 = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.addReview(article2, new Review(user1, 3, 'Excelent'))
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with a user that doesnt belongs to this session', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		session.addReview(article, new Review(user1, 3, 'Excelent'))

		expect(() => {
			session.addReview(article, new Review(user2, 3, 'Excelent'))
		}).toThrow(new Error('The user is not part of this article review'))
	})

	test('Should throw an exception when session in RECEPTION try update ASIGMENTANDREVIEW state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		expect(() => {
			session.startReviewAndAssignment()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to get bids in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.getBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to get bid in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.getBid(user1, article)
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to bid in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.bid(user2, article, 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to close bids in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.closeBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should receive bids close in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(session.areBidsOpen()).toBe(false)
	})

	test('Session should not be able to start ASIGMENTANDREVIEW in ASIGMENTANDREVIEW state', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.startReviewAndAssignment()
		}).toThrow(
			new Error('This session cannot be updated to ASSIGNMENTANDREVIEW')
		)
	})

	test('Session should not be able to create assignment if there are less than 3 bidders', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()

		expect(() => {
			session.startReviewAndAssignment()
		}).toThrow(new Error('This session must have 3 reviewers minimum'))
	})
})

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
