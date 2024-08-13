import {Session, SessionState} from '@app/session'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generateRegularArticle} from '../utils/articleGenerator'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

describe('Session BIDDING state tests', () => {
	test('Session can be updated to BIDDING if state is RECEPTION', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(SessionState.RECEPTION).toEqual(session.getState())

		session.updateState(SessionState.BIDDING)

		expect(SessionState.BIDDING).toEqual(session.getState())
	})

	test('Session cannot be updated to BIDDING if state is ASIGMENTANDREVIEW', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')

		session.updateState(SessionState.ASIGMENTANDREVIEW)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is SELECTION', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.updateState(SessionState.SELECTION)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is BIDDING', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.updateState(SessionState.BIDDING)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test("Session must return all users's bids in BIDDING state", () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user1 = dummyBidder1
		const user2 = dummyBidder2

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')

		expect(session.getBids()).toEqual(
			new Map([
				[user1, new Map([[article, 'INTERESTED']])],
				[user2, new Map([[article, 'NOT INTERESTED']])]
			])
		)
	})

	test('Session bidsState should be CLOSED before being in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)

		expect(session.getBidsState()).toBe('CLOSED')

		session.updateState(SessionState.BIDDING)

		expect(session.getBidsState()).toBe('OPENED')
	})

	test('Session bidsState should be CLOSED after being closed', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		session.closeBids()

		expect(session.getBidsState()).toBe('CLOSED')
	})
})

describe('Session User role in BIDDING state', () => {
	test('Submmited articles can be viewed by an user in BIDDING state', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()

		session.addArticle(article1)
		session.addArticle(article2)

		session.updateState(SessionState.BIDDING)

		expect(session.getArticles()).toEqual([article1, article2])
	})

	test('User can bid an existing article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid on more than one article', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()

		session.addArticle(article1)
		session.addArticle(article2)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article1, 'INTERESTED')
		session.bid(user, article2, 'NOT INTERESTED')

		expect('INTERESTED').toBe(session.getBid(user, article1))
		expect('NOT INTERESTED').toBe(session.getBid(user, article2))
	})

	test('Many users can bid on more than one article in BIDDING state', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		session.addArticle(article1)
		session.addArticle(article2)
		session.updateState(SessionState.BIDDING)
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
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.updateState(SessionState.BIDDING)

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('User can change bid on a bidded article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
		session.bid(user, article, 'NOT INTERESTED')
		expect('NOT INTERESTED').toBe(session.getBid(user, article))
	})

	test("User default bid is NONE if it's not set", () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		expect('NONE').toBe(session.getBid(user, article))
	})

	test('User can bid as INTERESTED in an article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as NOT INTERESTED in an article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'NOT INTERESTED')
		expect('NOT INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as MAYBE interested in an article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'MAYBE')
		expect('MAYBE').toBe(session.getBid(user, article))
	})

	test('User cant bid on an article if bidsState is CLOSED', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		session.closeBids()

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The bids are closed, you can not bid anymore'))
	})

	test('User can bid if BidsState is OPENED', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)

		expect(session.getBidsState()).toBe('OPENED')

		session.bid(dummyBidder1, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(dummyBidder1, article))
	})

	test('Session in BIDDING state add bid with a user that doesnt belongs to the REVIEWER rol', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user1 = dummyAuthor1
		expect(() => {
			session.bid(user1, article, 'INTERESTED')
		}).toThrow(new Error('User must be a reviewer'))
	})
})
