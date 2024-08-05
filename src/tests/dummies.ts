import {RegularArticle} from '@app/article'
import {Session, SessionSelection, SessionType} from '@app/session'
import {Rol, User} from '@app/user'

// USER DUMMIES

export const dummyOrganizer = new User(
	'Jane',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.ORGANIZER
)

export const dummyOrganizer2 = new User(
	'Jeniffer',
	'UTN-FRBA',
	'jeniffer@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.ORGANIZER
)

export const dummyAuthor1 = new User(
	'Pedro',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

export const dummyAuthor2 = new User(
	'John',
	'UTN-FRBA',
	'john@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

export const dummyAuthor3 = new User(
	'Bob',
	'UTN-FRBA',
	'bob@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

// SESSION DUMMIES

export const session = new Session(
	'First Session',
	5,
	new Map([[SessionType.POSTER, SessionSelection.TOP3]])
)

export const session2 = new Session(
	'Second Session',
	5,
	new Map([[SessionType.POSTER, SessionSelection.TOP3]])
)

// ARTICLE DUMMIES

export const article = new RegularArticle(
	'First article: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim',
	'First Sample Article Title',
	[dummyAuthor1, dummyAuthor2],
	dummyAuthor1,
	'https://first-example.com/sample-article.pdf'
)

export const article2 = new RegularArticle(
	'Second article: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim',
	'Second Sample Article Title',
	[dummyAuthor3],
	dummyAuthor1,
	'https://second-example.com/sample-article.pdf'
)
