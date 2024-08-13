import {Poster} from '@app/article'
import {Session} from '@app/session'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	posterArticleDummy,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generateRegularArticle} from '../utils/articleGenerator'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

const defaultDeadlineYesterday = new Date(
	new Date().getTime() - 1000 * 60 * 60 * 24
) //1 day ago

describe('RECEPTION state suite', () => {
	test('Session should start with RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(session.isReceptionState()).toBeTruthy()
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

		session.addArticle(posterArticleDummy)
		session.startBidding()
		session.bid(dummyBidder1, posterArticleDummy, 'INTERESTED')
		session.bid(dummyBidder2, posterArticleDummy, 'NOT INTERESTED')
		session.bid(dummyBidder3, posterArticleDummy, 'NOT INTERESTED')

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

		session.addArticle(posterArticleDummy)
		session.startBidding()
		session.bid(dummyBidder1, posterArticleDummy, 'INTERESTED')
		session.bid(dummyBidder2, posterArticleDummy, 'NOT INTERESTED')
		session.bid(dummyBidder3, posterArticleDummy, 'NOT INTERESTED')

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
