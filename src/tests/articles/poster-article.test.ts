import {RegularArticle, Poster} from '@app/article'
import {User} from '@app/user'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyAuthor3,
	dummyOrganizer
} from '@tests/utils/dummies'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('Poster Article tests ', () => {
	test('Poster article is valid when it has at least one author', () => {
		const title = 'Sample Poster Title'
		const authors = [dummyAuthor1]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-poster.pdf'
		const sourceURL = 'https://example.com/sample-poster.pdf'
		const article = new Poster(
			title,
			authors,
			notificationAuthor,
			fileURL,
			sourceURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Poster article is invalid when it doesnt have at least one author', () => {
		const title = 'Sample Poster Title'
		const authors: User[] = []
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-poster.pdf'
		const sourceURL = 'https://example.com/sample-poster.pdf'
		const article = new Poster(
			title,
			authors,
			notificationAuthor,
			fileURL,
			sourceURL
		)

		expect(article.validate()).toBeFalsy()
	})

	test('Poster article can have more than one author', () => {
		const title = 'Sample Poster Title'
		const authors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-poster.pdf'
		const sourceURL = 'https://example.com/sample-poster.pdf'
		const article = new Poster(
			title,
			authors,
			notificationAuthor,
			fileURL,
			sourceURL
		)

		expect(article.validate()).toBeTruthy()
		expect(article.getAuthors().length).toBeGreaterThan(1)
	})

	test('Poster article is valid when it has a title', () => {
		const title = 'Sample Poster Title'
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-poster.pdf'
		const sourceURL = 'https://example.com/sample-poster.pdf'
		const article = new Poster(
			title,
			authors,
			notificationAuthor,
			fileURL,
			sourceURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Poster article is invalid when it doesnt have a title', () => {
		const title = ''
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-poster.pdf'
		const sourceURL = 'https://example.com/sample-poster.pdf'
		const article = new Poster(
			title,
			authors,
			notificationAuthor,
			fileURL,
			sourceURL
		)

		expect(article.validate()).toBeFalsy()
	})
})
