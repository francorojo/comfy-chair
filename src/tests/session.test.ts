import { Session, SessionState } from '@app/session';
import {
	dummyAuthor1,
	dummyAuthor2,
	regularArticleDummy,
	top3SelectionDummy,
} from '@tests/dummies';

export const dummyAuthors = [dummyAuthor1, dummyAuthor2];

describe('test session case use', () => {
	test('Create a new session correctly', () => {
		const session = new Session('Test', 2, top3SelectionDummy);
		session.addArticle(regularArticleDummy);
		expect('Test').toEqual(session.getTheme());
		expect(SessionState.RECEPTION).toEqual(session.getState());
		expect(2).toEqual(session.getMaxArticlesAccept());
		expect(1).toEqual(session.getArticles().length);
	});

	test('Create a new session with more articles allowed', () => {
		const session = new Session('Test', 0, top3SelectionDummy);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(
			new Error('The number of items exceeds the maximum allowed')
		);
	});

	test('Create a new session, update state and try add new article', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should start with RECEPTION state', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		expect(SessionState.RECEPTION).toEqual(session.getState());
	});

	test('Session should be able to receive a RegularArticle in RECEPTION state', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		session.updateState(SessionState.RECEPTION);
		session.addArticle(regularArticleDummy);
		expect(1).toEqual(session.getArticles().length);
	});

	test('Session should not be able to receive a RegularArticle in BIDDING state', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a RegularArticle in SELECTION state', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		session.updateState(SessionState.SELECTION);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a RegularArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session('Test', 1, top3SelectionDummy);
		session.updateState(SessionState.ASIGMENTANDREVIEW);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});
});
