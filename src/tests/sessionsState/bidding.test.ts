import {PosterSession, RegularSession} from '@app/session'
import {
	defaultDeadlineTomorrow,
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generatePoster, generateRegularArticle} from '../utils/articleGenerator'
import {Review} from '@app/review'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('Session BIDDING state tests', () => {
	test('Session can be updated to BIDDING if state is RECEPTION', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toBeTruthy()

		const article = generateRegularArticle()
		session.addArticle(article)

		session.startBidding()

		expect(session.isBiddingState()).toBeTruthy()
	})

	test('Session cannot be updated to BIDDING if no articles have been added', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toBeTruthy()

		expect(() => {
			session.startBidding()
		}).toThrow(new Error('No articles have been added to this session'))
	})

	test('Session cannot be updated to BIDDING if state is ASIGMENTANDREVIEW', () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')

		session.startReviewAndAssignment()

		expect(() => {
			session.startBidding()
		}).toThrow(new Error('This session cannot be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is SELECTION', () => {
		const session = new PosterSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const posterArticleDummy = generatePoster()

		session.addArticle(posterArticleDummy)
		session.startBidding()
		session.bid(dummyBidder1, posterArticleDummy, 'INTERESTED')
		session.bid(dummyBidder2, posterArticleDummy, 'NOT INTERESTED')
		session.bid(dummyBidder3, posterArticleDummy, 'NOT INTERESTED')

		session.startReviewAndAssignment()
		session.startSelection()

		expect(() => {
			session.startBidding()
		}).toThrow(new Error('This session cannot be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is BIDDING', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generateRegularArticle()
		session.addArticle(article)

		session.startBidding()

		expect(() => {
			session.startBidding()
		}).toThrow(new Error('This session cannot be updated to BIDDING'))
	})

	test("Session must return all users's bids in BIDDING state", () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')

		expect(session.getBids()).toEqual(
			new Map([
				[
					article,
					new Map([
						[user2, 'NOT INTERESTED'],
						[user1, 'INTERESTED']
					])
				]
			])
		)
	})

	test('Session bidsState should be CLOSED before being in BIDDING state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)

		expect(session.areBidsOpen()).toBe(false)

		session.startBidding()

		expect(session.areBidsOpen()).toBe(true)
	})

	test('Session bidsState should be CLOSED after being closed', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		session.closeBids()

		expect(session.areBidsOpen()).toBe(false)
	})
})

describe('Session User role in BIDDING state', () => {
	test('Submmited articles can be viewed by an user in BIDDING state', () => {
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

		expect(session.getArticles()).toEqual([article1, article2])
	})

	test('User can bid on an existing article', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect(session.getBid(user, article)).toBe('INTERESTED')
	})

	test('User can bid on more than one article', () => {
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
		const user = dummyBidder1

		session.bid(user, article1, 'INTERESTED')
		session.bid(user, article2, 'NOT INTERESTED')

		expect(session.getBid(user, article1)).toBe('INTERESTED')
		expect(session.getBid(user, article2)).toBe('NOT INTERESTED')
	})

	test('Many users can bid on more than one article in BIDDING state', () => {
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
		session.bid(user1, article1, 'INTERESTED')
		session.bid(user2, article1, 'NOT INTERESTED')
		session.bid(user1, article2, 'MAYBE')
		session.bid(user2, article2, 'INTERESTED')

		expect(session.getBid(user1, article1)).toBe('INTERESTED')
		expect(session.getBid(user2, article1)).toBe('NOT INTERESTED')
		expect(session.getBid(user1, article2)).toBe('MAYBE')
		expect(session.getBid(user2, article2)).toBe('INTERESTED')
	})

	test('User cannot bid on an article that is not in the session', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const nonExistentArticle = generateRegularArticle()
		const article1 = generateRegularArticle()

		session.addArticle(article1)
		session.startBidding()

		expect(() => {
			session.bid(dummyBidder1, nonExistentArticle, 'INTERESTED')
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('User can change bid on a bidded article', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect(session.getBid(user, article)).toBe('INTERESTED')
		session.bid(user, article, 'NOT INTERESTED')
		expect(session.getBid(user, article)).toBe('NOT INTERESTED')
	})

	test("User default bid is NONE if it's not set", () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		expect(session.getBid(user, article)).toBe('NONE')
	})

	test('User can bid as INTERESTED in an article', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect(session.getBid(user, article)).toBe('INTERESTED')
	})

	test('User can bid as NOT INTERESTED in an article', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'NOT INTERESTED')
		expect(session.getBid(user, article)).toBe('NOT INTERESTED')
	})

	test('User can bid as MAYBE interested in an article', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'MAYBE')
		expect(session.getBid(user, article)).toBe('MAYBE')
	})

	test('User cant bid on an article if bidsState is CLOSED', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		session.closeBids()

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The bids are closed, you cannot bid anymore'))
	})

	test('User can bid if BidsState is OPENED', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()

		expect(session.areBidsOpen()).toBe(true)

		session.bid(dummyBidder1, article, 'INTERESTED')
		expect(session.getBid(dummyBidder1, article)).toBe('INTERESTED')
	})

	test('Session in BIDDING state add bid with a user that doesnt belongs to the REVIEWER rol', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyAuthor1
		expect(() => {
			session.bid(user1, article, 'INTERESTED')
		}).toThrow(new Error('User must be a reviewer'))
	})

	test('Session should be able to get Bidders in BIDDING state', () => {
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
		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		expect(session.isBiddingState()).toBeTruthy()
		expect(session.getBidders()).toEqual([user1, user2])
		expect(session.getBidders()).toContain(user1)
		expect(session.getBidders()).toContain(user2)
		expect(session.getBidders()).toHaveLength(2)
	})

	test('Session should not be able to add review in BIDDING state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user1 = dummyAuthor1
		expect(() => {
			session.addReview(article, new Review(user1, 5, 'Excellent work!'))
		}).toThrow(
			new Error('The review must be added in ASIGMENTANDREVIEW state')
		)
	})

	test('Session should not be able to start selection in BIDDING state', () => {
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
			session.startSelection()
		}).toThrow(new Error('Cant start selection in BIDDING state'))
	})
})
