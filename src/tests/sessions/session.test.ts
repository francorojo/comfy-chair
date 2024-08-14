import {RegularSession} from '@app/session'
import {
	defaultDeadlineTomorrow,
	dummyAuthor1,
	dummyAuthor2,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/utils/dummies'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('tests session case use', () => {
	test('Should be able to create a new session correctly and access its attributes', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect(session.getTheme()).toEqual('Test')
		expect(session.isReceptionState()).toBeTruthy()
		expect(session.getMaxArticlesAccept()).toEqual(2)
		expect(session.getArticles().length).toEqual(1)
	})

	test('Session should throw an exception when adding more articles than allowed', () => {
		const session = new RegularSession(
			'Test',
			0,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('The number of items exceeds the maximum allowed'))
	})

	test('Session should not be able to receive more articles when its in BIDDING state', () => {
		const session = new RegularSession(
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
