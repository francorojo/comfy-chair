import { Poster, RegularArticle } from '@app/article';
import { SessionType, SessionSelection } from '@app/session';
import { Rol, User } from '@app/user';

// USER DUMMIES

export const dummyOrganizer = new User(
	'Jane',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.ORGANIZER
);

export const dummyAuthor1 = new User(
	'Jane',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
);

export const dummyAuthor2 = new User(
	'John',
	'UTN-FRBA',
	'john@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
);

export const dummyAuthor3 = new User(
	'Bob',
	'UTN-FRBA',
	'bob@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
);

// SESSION SELECTION DUMMIES

export const top3SelectionDummy = new Map<SessionType, SessionSelection>([
	[SessionType.POSTER, SessionSelection.TOP3],
]);

// DUMMY ARTICLES

const abstract =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim';
const title = 'Sample Article Title';
const authors = [dummyAuthor1, dummyAuthor2];
const notificationAuthor = dummyAuthor1;
const fileURL = 'https://example.com/sample-article.pdf';

export const regularArticleDummy = new RegularArticle(
	abstract,
	title,
	authors,
	notificationAuthor,
	fileURL
);

const posterTitle = 'Sample Poster Title';
const sourceURL = 'https://example.com/sample-poster.pdf';

export const posterArticleDummy = new Poster(
	posterTitle,
	authors,
	notificationAuthor,
	fileURL,
	sourceURL
);
