import {Poster} from '@app/article'
import {Session} from '@app/session'
import {
	dummyArticle,
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	dummyBidder4,
	dummyTop3SelectionForm,
	posterArticleDummy,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/dummies'
import {generateRegularArticle} from './articleGenerator'
import {Review} from '@app/review'
import {User} from '@app/user'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

const defaultDeadlineYesterday = new Date(
	new Date().getTime() - 1000 * 60 * 60 * 24
) //1 day ago

describe('tests session case use', () => {
	test('Create a new session correctly', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect('Test').toEqual(session.getTheme())
		expect(session.isReceptionState()).toEqual(true)
		expect(2).toEqual(session.getMaxArticlesAccept())
		expect(1).toEqual(session.getArticles().length)
	})

	test('Create a new session with more articles allowed', () => {
		const session = new Session(
			'Test',
			0,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('The number of items exceeds the maximum allowed'))
	})

	test('Create a new session, update state and try add new article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.startBidding()
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})
})

// BIDDING TESTS

describe('Session BIDDING state tests', () => {
	test('Session can be updated to BIDDING if state is RECEPTION', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toEqual(true)

		session.startBidding()

		expect(session.isBiddingState()).toEqual(true)
	})

	test('Session cannot be updated to BIDDING if state is ASIGMENTANDREVIEW', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
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
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is SELECTION', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
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
		session.startSelection()
		expect(() => {
			session.startBidding()
		}).toThrow(new Error('This session can not be updated to BIDDING'))
	})

	test('Session cannot be updated to BIDDING if state is BIDDING', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		session.startBidding()
		expect(() => {
			session.startBidding()
		}).toThrow(new Error('Cant start bidding in BIDDING state'))
	})

	test("Session must return all users's bids in BIDDING state", () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
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
				[user1, new Map([[article, 'INTERESTED']])],
				[user2, new Map([[article, 'NOT INTERESTED']])]
			])
		)
	})

	test('Session bidsState should be CLOSED before being in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)

		expect(session.areBidsOpen()).toBe(false)

		session.startBidding()

		expect(session.areBidsOpen()).toBe(true)
	})

	test('Session bidsState should be CLOSED after being closed', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
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
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()

		session.addArticle(article1)
		session.addArticle(article2)

		session.startBidding()

		expect(session.getArticles()).toEqual([article1, article2])
	})

	test('User can bid an existing article', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid on more than one article', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
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

		expect('INTERESTED').toBe(session.getBid(user, article1))
		expect('NOT INTERESTED').toBe(session.getBid(user, article2))
	})

	test('Many users can bid on more than one article in BIDDING state', () => {
		const session = new Session(
			'Test',
			2,
			dummyTop3SelectionForm,
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
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.startBidding()

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('User can change bid on a bidded article', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
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
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		expect('NONE').toBe(session.getBid(user, article))
	})

	test('User can bid as INTERESTED in an article', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'INTERESTED')
		expect('INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as NOT INTERESTED in an article', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'NOT INTERESTED')
		expect('NOT INTERESTED').toBe(session.getBid(user, article))
	})

	test('User can bid as MAYBE interested in an article', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		const user = dummyBidder1

		session.bid(user, article, 'MAYBE')
		expect('MAYBE').toBe(session.getBid(user, article))
	})

	test('User cant bid on an article if bidsState is CLOSED', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()
		session.closeBids()

		expect(() => {
			session.bid(dummyBidder1, article, 'INTERESTED')
		}).toThrow(new Error('The bids are closed, you can not bid anymore'))
	})

	test('User can bid if BidsState is OPENED', () => {
		const session = new Session(
			'Test',
			1,
			dummyTop3SelectionForm,
			defaultDeadlineTomorrow
		)
		const article = generateRegularArticle()
		session.addArticle(article)
		session.startBidding()

		expect(session.areBidsOpen()).toBe(true)

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
		session.startBidding()
		const user1 = dummyAuthor1
		expect(() => {
			session.bid(user1, article, 'INTERESTED')
		}).toThrow(new Error('User must be a reviewer'))
	})
})

// RECEPTION tests

describe('RECEPTION state suite', () => {
	test('Session should start with RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toEqual(true)
	})

	test('Session should be able to receive a RegularArticle in RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should not be able to receive a RegularArticle in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.startBidding()
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in SELECTION state', () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')
		session.startReviewAndAssignment()
		session.startSelection()
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session(
			'Test',
			4,
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
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should be able to receive a PosterArticle in RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(posterArticleDummy)

		expect(1).toEqual(session.getArticles().length)
		expect(Poster).toEqual(session.getArticles()[0].constructor)
	})

	test('Session should not be able to receive a PosterArticle in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.startBidding()
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in SELECTION state', () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')
		session.startReviewAndAssignment()
		session.startSelection()
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session(
			'Test',
			4,
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
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session can not receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle when the deadline is reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineYesterday
		)

		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session has passed its deadline'))
	})

	test('Session should not be able to receive a PosterArticle when the deadline is reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineYesterday
		)

		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session has passed its deadline'))
	})

	test('Session should be able to receive a RegularArticle when the deadline is not reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should be able to receive a PosterArticle when the deadline is not reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(posterArticleDummy)
		expect(1).toEqual(session.getArticles().length)
		expect(Poster).toEqual(session.getArticles()[0].constructor)
	})
})

describe('BIDDING state suite', () => {
	test('Session should not allow bids during RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.bid(dummyBidder1, generateRegularArticle(), 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should allow bids during BIDDING state', () => {
		const session = new Session(
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
		expect('INTERESTED').toBe(session.getBid(dummyBidder1, article))
	})

	test('Session should not allow bids during ASIGMENTANDREVIEW state', () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')
		session.startReviewAndAssignment()

		expect(() => {
			session.bid(dummyBidder1, generateRegularArticle(), 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not allow bids during SELECTION state', () => {
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

		session.bid(user1, article, 'INTERESTED')
		session.bid(user2, article, 'NOT INTERESTED')
		session.bid(user3, article, 'NOT INTERESTED')
		session.startReviewAndAssignment()
		session.startSelection()

		expect(() => {
			session.bid(dummyBidder1, generateRegularArticle(), 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})
})

// ASIGMENTANDREVIEW tests

describe('ASIGMENTANDREVIEW state suite', () => {
	test('Session assigns users for review in ASIGMENTANDREVIEW state', () => {
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

		const asigments: Map<User, Review> =
			session.getArticlesReviews().get(article) || new Map()
		expect([user1, user4, user3]).toEqual(Array.from(asigments.keys()))
	})

	test('Session in ASIGMENTANDREVIEW state add review and validate that later', () => {
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

		session.addReview(article, user1, new Review(3, 'Excelent'))
		expect(3).toEqual(session.getReview(article, user1)?.getNote())
		expect('Excelent').toEqual(session.getReview(article, user1)?.getText())
	})

	test('Session in ASIGMENTANDREVIEW state add two reviews and validate these later', () => {
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

		session.addReview(article1, user4, new Review(3, 'Excelent'))
		session.addReview(article2, user3, new Review(-3, 'Bad'))

		expect(3).toEqual(session.getReview(article1, user4)?.getNote())
		expect('Excelent').toEqual(
			session.getReview(article1, user4)?.getText()
		)
		expect(-3).toEqual(session.getReview(article2, user3)?.getNote())
		expect('Bad').toEqual(session.getReview(article2, user3)?.getText())
	})

	test('Session in ASIGMENTANDREVIEW state add review with a note out of permitted range', () => {
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

		expect(() => {
			session.addReview(article, user1, new Review(-5, 'Excelent'))
		}).toThrow(new Error('The note must be greater -3 and lower 3'))
	})

	test('Session in ASIGMENTANDREVIEW state add review with an article without session', () => {
		const session = new Session(
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
			session.addReview(article2, user1, new Review(3, 'Excelent'))
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('Session in ASIGMENTANDREVIEW state add review with a user that doesnt belongs to this session', () => {
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
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.startReviewAndAssignment()

		expect(() => {
			session.addReview(article, user2, new Review(3, 'Excelent'))
		}).toThrow(new Error('The user is not part of this article review'))
	})

	test('Should throw an exception when session in RECEPTION try update ASIGMENTANDREVIEW state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		expect(() => {
			session.startReviewAndAssignment()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})
})
