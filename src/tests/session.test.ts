import {Poster} from '@app/article'
import {Session, SessionState} from '@app/session'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	posterArticleDummy,
	regularArticleDummy
} from '@tests/dummies'
import {generateRegularArticle} from './articleGenerator'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

const defaultDeadlineYesterday = new Date(
	new Date().getTime() - 1000 * 60 * 60 * 24
) //1 day ago

describe('test session case use', () => {
	test('Create a new session correctly', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
		session.addArticle(regularArticleDummy)
		expect('Test').toEqual(session.getTheme())
		expect(SessionState.RECEPTION).toEqual(session.getState())
		expect(2).toEqual(session.getMaxArticlesAccept())
		expect(1).toEqual(session.getArticles().length)
	})

	test('Create a new session with more articles allowed', () => {
		const session = new Session('Test', 0, defaultDeadlineTomorrow)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('The number of items exceeds the maximum allowed'))
	})

	test('Create a new session, update state and try add new article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.BIDDING)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})
})

// BIDDING TESTS

describe('Session BIDDING state tests', () => {
	test('Session can be updated to BIDDING if state is RECEPTION', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
		expect(SessionState.RECEPTION).toEqual(session.getState())

		session.updateState(SessionState.BIDDING)

		expect(SessionState.BIDDING).toEqual(session.getState())
	})

	test('Session cannot be updated to BIDDING if state is ASIGMENTANDREVIEW', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)

		session.updateState(SessionState.ASIGMENTANDREVIEW)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is SELECTION', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
		session.updateState(SessionState.SELECTION)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is BIDDING', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
		session.updateState(SessionState.BIDDING)

		expect(() => {
			session.updateState(SessionState.BIDDING)
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test("Session must return all users's bids in BIDDING state", () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user1 = dummyBidder1
		const user2 = dummyAuthor2

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
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)

		expect(session.getBidsState()).toBe('CLOSED')

		session.updateState(SessionState.BIDDING)

		expect(session.getBidsState()).toBe('OPENED')
	})

	test('Session bidsState should be CLOSED after being closed', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		session.closeBids()

		expect(session.getBidsState()).toBe('CLOSED')
	})
})

describe('Session User role in BIDDING state', () => {
	test('Submmited articles can be viewed by an user in BIDDING state', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()

		session.addArticle(article1)
		session.addArticle(article2)

		session.updateState(SessionState.BIDDING)

		expect(session.getArticles()).toEqual([article1, article2])
	})

	test('User can bid an existing article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid on more than one article', () => {
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
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
		const session = new Session('Test', 2, defaultDeadlineTomorrow)
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
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.updateState(SessionState.BIDDING)

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('User can change bid on a bidded article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
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
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		expect('NONE').toBe(session.getBid(user, article))
	})

	test('User can bid as INTERESTED in an article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as NOT INTERESTED in an article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'NOT INTERESTED')
		expect('NOT INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as MAYBE interested in an article', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user = dummyBidder1

		session.bid(user, article, 'MAYBE')
		expect('MAYBE').toBe(session.getBid(user, article))
	})

	test('User cant bid on an article if bidsState is CLOSED', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		session.closeBids()

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The bids are closed, you can not bid anymore'))
	})

	test('User can bid if BidsState is OPENED', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)

		expect(session.getBidsState()).toBe('OPENED')

		session.bid(dummyBidder1, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(dummyBidder1, article))
	})
})

// RECEPTION tests

describe('RECEPTION state suite', () => {
	test('Session should start with RECEPTION state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		expect(SessionState.RECEPTION).toEqual(session.getState())
	})

	test('Session should be able to receive a RegularArticle in RECEPTION state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.RECEPTION)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should not be able to receive a RegularArticle in BIDDING state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.BIDDING)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in SELECTION state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.SELECTION)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.ASIGMENTANDREVIEW)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should be able to receive a PosterArticle in RECEPTION state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.RECEPTION)
		session.addArticle(posterArticleDummy)

		expect(1).toEqual(session.getArticles().length)
		expect(Poster).toEqual(session.getArticles()[0].constructor)
	})

	test('Session should not be able to receive a PosterArticle in BIDDING state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.BIDDING)
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in SELECTION state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.SELECTION)
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.updateState(SessionState.ASIGMENTANDREVIEW)
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})

	test('Session should not be able to receive a RegularArticle when the deadline is reached', () => {
		const session = new Session('Test', 1, defaultDeadlineYesterday)

		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session has passed its deadline'))
	})

	test('Session should not be able to receive a PosterArticle when the deadline is reached', () => {
		const session = new Session('Test', 1, defaultDeadlineYesterday)

		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session has passed its deadline'))
	})

	test('Session should be able to receive a RegularArticle when the deadline is not reached', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should be able to receive a PosterArticle when the deadline is not reached', () => {
		const session = new Session('Test', 1, defaultDeadlineTomorrow)
		session.addArticle(posterArticleDummy)
		expect(1).toEqual(session.getArticles().length)
		expect(Poster).toEqual(session.getArticles()[0].constructor)
	})
})
