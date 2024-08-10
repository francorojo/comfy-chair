import {RegularSession, Session} from '@app/session'
import {RegularArticle, Poster} from '@app/article'
import {Rol, User} from '@app/user'
import {DEFAULT_SELECTION} from '@app/selection'

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
	'pedro@utn.frba.edu.ar',
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

export const defaultDeadlineTomorrow = new Date(
	new Date().getTime() + 1000 * 60 * 60 * 24
) //1 day

export const dummyRegularSession = new RegularSession(
	'First Session',
	5,
	defaultDeadlineTomorrow,
	DEFAULT_SELECTION
)

export const dummyRegularSession2 = new RegularSession(
	'Second Session',
	5,
	defaultDeadlineTomorrow,
	DEFAULT_SELECTION
)

export const dummyBidder1 = dummyAuthor1

export const dummyBidder2 = dummyAuthor2

// DUMMY ARTICLES

const abstract =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
const title = 'Sample Article Title'
const authors = [dummyAuthor1, dummyAuthor2]
const notificationAuthor = dummyAuthor1
const fileURL = 'https://example.com/sample-article.pdf'

export const regularArticleDummy = new RegularArticle(
	abstract,
	title,
	authors,
	notificationAuthor,
	fileURL
)

const posterTitle = 'Sample Poster Title'
const sourceURL = 'https://example.com/sample-poster.pdf'

export const posterArticleDummy = new Poster(
	posterTitle,
	authors,
	notificationAuthor,
	fileURL,
	sourceURL
)

export const dummyArticle = new RegularArticle(
	'First article: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim',
	'First Sample Article Title',
	[dummyAuthor1, dummyAuthor2],
	dummyAuthor1,
	'https://first-example.com/sample-article.pdf'
)

export const dummyArticle2 = new RegularArticle(
	'Second article: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim',
	'Second Sample Article Title',
	[dummyAuthor3],
	dummyAuthor1,
	'https://second-example.com/sample-article.pdf'
)
