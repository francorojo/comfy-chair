import {Poster} from '@app/article'
import {PosterSession, RegularSession, Session} from '@app/session'
import {
	defaultDeadlineTomorrow,
	defaultDeadlineYesterday,
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	posterArticleDummy,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generatePoster, generateRegularArticle} from '../utils/articleGenerator'
import {Review} from '@app/review'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('RECEPTION state suite', () => {
	test('Session should start with RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toBeTruthy()
	})

	test('Session should be able to receive a RegularArticle in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should not be able to receive a RegularArticle in BIDDING state', () => {
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
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in SELECTION state', () => {
		const session = new PosterSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		session.addArticle(posterArticleDummy)
		session.startBidding()
		session.bid(dummyBidder1, posterArticleDummy, 'INTERESTED')
		session.bid(dummyBidder2, posterArticleDummy, 'NOT INTERESTED')
		session.bid(dummyBidder3, posterArticleDummy, 'NOT INTERESTED')

		session.startReviewAndAssignment()
		session.startSelection()
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle in ASIGMENTANDREVIEW state', () => {
		const session = new RegularSession(
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
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should be able to receive a PosterArticle in RECEPTION state', () => {
		const session = new PosterSession(
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
		const session = new PosterSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generatePoster()
		session.addArticle(article)

		session.startBidding()
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in SELECTION state', () => {
		const session = new PosterSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		session.addArticle(posterArticleDummy)
		session.startBidding()
		session.bid(dummyBidder1, posterArticleDummy, 'INTERESTED')
		session.bid(dummyBidder2, posterArticleDummy, 'NOT INTERESTED')
		session.bid(dummyBidder3, posterArticleDummy, 'NOT INTERESTED')

		session.startReviewAndAssignment()

		session.startSelection()
		expect(() => {
			session.addArticle(posterArticleDummy)
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should not be able to receive a PosterArticle in ASIGMENTANDREVIEW state', () => {
		const session = new PosterSession(
			'Test',
			4,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generatePoster()
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
		}).toThrow(new Error('This session cannot receive more articles'))
	})

	test('Session should not be able to receive a RegularArticle when the deadline is reached', () => {
		const session = new RegularSession(
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
		const session = new PosterSession(
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
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect(1).toEqual(session.getArticles().length)
	})

	test('Session should be able to receive a PosterArticle when the deadline is not reached', () => {
		const session = new PosterSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(posterArticleDummy)
		expect(1).toEqual(session.getArticles().length)
		expect(Poster).toEqual(session.getArticles()[0].constructor)
	})

	test('Session should not be able to get bidders in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.getBidders()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to get bids in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.getBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to get bid in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.getBid(dummyBidder1, regularArticleDummy)
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to bid in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.bid(dummyBidder1, regularArticleDummy, 'INTERESTED')
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to close bids in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.closeBids()
		}).toThrow(new Error('This session is not in BIDDING state'))
	})

	test('Session should not be able to add a review in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.addReview(
				regularArticleDummy,
				new Review(dummyAuthor1, 2, 'Excelente')
			)
		}).toThrow(
			new Error('The review must be added in ASIGMENTANDREVIEW state')
		)
	})

	test('Session should not be able to start selection in RECEPTION state', () => {
		const session = new RegularSession(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.startSelection()
		}).toThrow(
			new Error('This session is not in ASSIGNMENTANDREVIEW state')
		)
	})
})
