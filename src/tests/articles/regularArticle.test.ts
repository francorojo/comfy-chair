import {RegularArticle, Poster} from '@app/article'
import {User} from '@app/user'
import {
	dummyAuthor1,
	dummyAuthor2,
	dummyAuthor3,
	dummyOrganizer
} from '@tests/utils/dummies'

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe('Regular Article tests', () => {
	test('Regular article is valid when abstract is not empty', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Regular article is invalid when abstract is empty', () => {
		const abstract = ''
		const title = 'Sample Article Title'
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeFalsy()
	})

	test('Regular article is valid when abstract is less than 300 words', () => {
		const abstract = Array(299).fill('a').join(' ')
		const title = 'Sample Article Title'
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Regular article is invalid when abstract is more than 300 words', () => {
		const abstract = Array(301).fill('a').join(' ')
		const title = 'Sample Article Title'
		const authors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeFalsy()
	})

	test('Regular article is valid when it has at least one author', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = [dummyAuthor1]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Regular article is invalid when it doesnt have at least one author', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors: User[] = []
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeFalsy()
	})

	test('Regular article can have more than one author', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
		expect(article.getAuthors().length).toBeGreaterThan(1)
	})

	test('Regular article is valid when it has a title', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
	})

	test('Regular article is invalid when it doesnt have a title', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = ''
		const authors = dummyAuthors
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeFalsy()
	})

	test('Regular article is valid when it has a user is an author', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'
		const article = new RegularArticle(
			abstract,
			title,
			authors,
			notificationAuthor,
			fileURL
		)

		expect(article.validate()).toBeTruthy()
		expect(article.getAuthors().length).toBeGreaterThan(1)
	})

	test('Regular article is invalid when it doesnt have a user is not an author', () => {
		const abstract =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim'
		const title = 'Sample Article Title'
		const authors = [dummyOrganizer]
		const notificationAuthor = dummyAuthor1
		const fileURL = 'https://example.com/sample-article.pdf'

		expect(() => {
			new RegularArticle(
				abstract,
				title,
				authors,
				notificationAuthor,
				fileURL
			)
		}).toThrow(new Error('Authors must have the Author role'))
	})
})
