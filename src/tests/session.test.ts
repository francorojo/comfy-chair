import { Poster } from '@app/article';
import { Session, SessionState } from '@app/session';
import {
	dummyAuthor1,
	dummyAuthor2,
	posterArticleDummy,
	regularArticleDummy,
	top3SelectionDummy,
} from '@tests/dummies';

export const dummyAuthors = [dummyAuthor1, dummyAuthor2];

const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
); //1 day

const defaultDeadlineYesterday = new Date(
	new Date().getTime() - 1000 * 60 * 60 * 24
); //1 day ago

describe('test session case use', () => {
	test('Create a new session correctly', () => {
		const session = new Session(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.addArticle(regularArticleDummy);
		expect('Test').toEqual(session.getTheme());
		expect(SessionState.RECEPTION).toEqual(session.getState());
		expect(2).toEqual(session.getMaxArticlesAccept());
		expect(1).toEqual(session.getArticles().length);
	});

	test('Create a new session with more articles allowed', () => {
		const session = new Session(
			'Test',
			0,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(
			new Error('The number of items exceeds the maximum allowed')
		);
	});

	test('Create a new session, update state and try add new article', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});
});

describe('RECEPTION state suite', () => {
	test('Session should start with RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		expect(SessionState.RECEPTION).toEqual(session.getState());
	});

	test('Session should be able to receive a RegularArticle in RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.RECEPTION);
		session.addArticle(regularArticleDummy);
		expect(1).toEqual(session.getArticles().length);
	});

	test('Session should not be able to receive a RegularArticle in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a RegularArticle in SELECTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.SELECTION);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a RegularArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.ASIGMENTANDREVIEW);
		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should be able to receive a PosterArticle in RECEPTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.RECEPTION);
		session.addArticle(posterArticleDummy);

		expect(1).toEqual(session.getArticles().length);
		expect(Poster).toEqual(session.getArticles()[0].constructor);
	});

	test('Session should not be able to receive a PosterArticle in BIDDING state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(posterArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a PosterArticle in SELECTION state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.SELECTION);
		expect(() => {
			session.addArticle(posterArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a PosterArticle in ASIGMENTANDREVIEW state', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.updateState(SessionState.ASIGMENTANDREVIEW);
		expect(() => {
			session.addArticle(posterArticleDummy);
		}).toThrow(new Error('This session can not recive more articles'));
	});

	test('Session should not be able to receive a RegularArticle when the deadline is reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineYesterday
		);

		expect(() => {
			session.addArticle(regularArticleDummy);
		}).toThrow(new Error('This session has passed its deadline'));
	});

	test('Session should not be able to receive a PosterArticle when the deadline is reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineYesterday
		);

		expect(() => {
			session.addArticle(posterArticleDummy);
		}).toThrow(new Error('This session has passed its deadline'));
	});

	test('Session should be able to receive a RegularArticle when the deadline is not reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.addArticle(regularArticleDummy);
		expect(1).toEqual(session.getArticles().length);
	});

	test('Session should be able to receive a PosterArticle when the deadline is not reached', () => {
		const session = new Session(
			'Test',
			1,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		);
		session.addArticle(posterArticleDummy);
		expect(1).toEqual(session.getArticles().length);
		expect(Poster).toEqual(session.getArticles()[0].constructor);
	});
});
