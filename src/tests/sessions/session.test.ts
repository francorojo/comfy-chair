import {Poster} from '@app/article'
import {Session, SessionState} from '@app/session'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyBidder1,
	dummyBidder2,
	dummyBidder3,
	dummyBidder4,
	posterArticleDummy,
	regularArticleDummy,
	top3SelectionDummy
} from '@tests/utils/dummies'
import {generateRegularArticle} from '../utils/articleGenerator'
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
		expect(SessionState.RECEPTION).toEqual(session.getState())
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
		session.updateState(SessionState.BIDDING)
		expect(() => {
			session.addArticle(regularArticleDummy)
		}).toThrow(new Error('This session can not recive more articles'))
	})
})
