import {RegularSession, Session} from '@app/session'
import {
	dummyAuthor1,
	dummyAuthor2,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/utils/dummies'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

const defaultDeadlineYesterday = new Date(
	new Date().getTime() - 1000 * 60 * 60 * 24
) //1 day ago

describe('tests session case use', () => {
	test('Create a new session correctly', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(regularArticleDummy)
		expect('Test').toEqual(session.getTheme())
		expect(session.isReceptionState()).toBeTruthy()
		expect(2).toEqual(session.getMaxArticlesAccept())
		expect(1).toEqual(session.getArticles().length)
	})

	test('Create a new session with more articles allowed', () => {
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

	test('Create a new session, update state and try add new article', () => {
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
