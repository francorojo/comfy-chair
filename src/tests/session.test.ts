import {
	Session,
	SessionType,
	SessionSelection,
	SessionState,
} from '@app/session';
import { RegularArticle } from '@app/article';

describe('test session case use', () => {
	test('Create a new session correctly', () => {
		let map = new Map();
		map.set(SessionType.POSTER, SessionSelection.TOP3);
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim';
		const title = 'Sample Article Title';
		const authors = ['Author 1', 'Author 2'];
		const article = new RegularArticle(abstract, title, authors);
		const session = new Session('Test', 2, map);
		session.addArticle(article);
		expect('Test').toEqual(session.getTheme());
		expect(SessionState.RECEPTION).toEqual(session.getState());
		expect(2).toEqual(session.getMaxArticlesAccept());
		expect(1).toEqual(session.getArticles().length);
	});

	test('Create a new session with more articles allowed', () => {
		let map = new Map();
		map.set(SessionType.POSTER, SessionSelection.TOP3);
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim';
		const title = 'Sample Article Title';
		const authors = ['Author 1', 'Author 2'];
		const article = new RegularArticle(abstract, title, authors);
		const session = new Session('Test', 0, map);
		expect(() => {
			session.addArticle(article);
		}).toThrow(
			new Error('The number of items exceeds the maximum allowed')
		);
	});

	test('Create a new session, update state and try add new article', () => {
		let map = new Map();
		map.set(SessionType.POSTER, SessionSelection.TOP3);
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim';
		const title = 'Sample Article Title';
		const authors = ['Author 1', 'Author 2'];
		const article = new RegularArticle(abstract, title, authors);
		const session = new Session('Test', 1, map);
		session.updateState(SessionState.BIDDING);
		expect(() => {
			session.addArticle(article);
		}).toThrow(new Error('This session can not recive more articles'));
	});
});
