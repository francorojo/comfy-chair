import {Poster} from '@app/article'
import {Session, SessionState} from '@app/session'
import {
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
import {User} from '@app/user'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

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
		session.updateState(SessionState.BIDDING)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.updateState(SessionState.ASIGMENTANDREVIEW)

		const asigments: Map<User, Review> =
			session.getArticlesReviews().get(article) || new Map()
		expect([user1, user4, user3]).toEqual(Array.from(asigments.keys()))
	})

	test('Session can add one review and ask for your reviews in ASIGMENTANDREVIEW state', () => {
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
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.updateState(SessionState.ASIGMENTANDREVIEW)

		session.addReview(article, user1, new Review(3, 'Excelent'))
		expect(3).toEqual(session.getReview(article, user1)?.getNote())
		expect('Excelent').toEqual(session.getReview(article, user1)?.getText())
	})

	test('Session can add two reviews and ask for your reviews in ASIGMENTANDREVIEW state', () => {
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

		session.updateState(SessionState.ASIGMENTANDREVIEW)

		session.addReview(article1, user4, new Review(3, 'Excelent'))
		session.addReview(article2, user3, new Review(-3, 'Bad'))

		expect(3).toEqual(session.getReview(article1, user4)?.getNote())
		expect('Excelent').toEqual(
			session.getReview(article1, user4)?.getText()
		)
		expect(-3).toEqual(session.getReview(article2, user3)?.getNote())
		expect('Bad').toEqual(session.getReview(article2, user3)?.getText())
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with a note out of permitted range', () => {
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
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 This user is discarded, last in sorting, max 3
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.updateState(SessionState.ASIGMENTANDREVIEW)

		expect(() => {
			session.addReview(article, user1, new Review(-5, 'Excelent'))
		}).toThrow(new Error('The note must be greater -3 and lower 3'))
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with an article without session', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)

		const article = generateRegularArticle()
		const article2 = generateRegularArticle()
		session.addArticle(article)
		session.updateState(SessionState.BIDDING)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.updateState(SessionState.ASIGMENTANDREVIEW)

		expect(() => {
			session.addReview(article2, user1, new Review(3, 'Excelent'))
		}).toThrow(new Error('The article is not part of this session'))
	})

	test('Should throw an exception when session in ASIGMENTANDREVIEW state add review with a user that doesnt belongs to this session', () => {
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
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		session.bid(user1, article, 'INTERESTED') //1
		session.bid(user2, article, 'NOT INTERESTED') //4 OUT
		session.bid(user3, article, 'NONE') //3
		session.bid(user4, article, 'MAYBE') //2
		session.updateState(SessionState.ASIGMENTANDREVIEW)

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
			session.updateState(SessionState.ASIGMENTANDREVIEW)
		}).toThrow(
			new Error('This session can not be updated to ASIGMENTANDREVIEW')
		)
	})
})
