import {Rol, User} from '@app/user'

abstract class Article {
	title: string
	authors: User[]
	notificationAuthor: User
	fileURL: string

	constructor(
		title: string,
		authors: User[],
		fileURL: string,
		notificationAuthor: User
	) {
		this.title = title

		// validate authors have author role
		authors.forEach((author) => {
			if (author.getRol() !== Rol.AUTHOR) {
				throw new Error('Authors must have the Author role')
			}
		})
		this.authors = authors
		this.fileURL = fileURL
		this.notificationAuthor = notificationAuthor
	}

	validate(): boolean {
		if (this.authors.length === 0) {
			return false
		}

		if (this.title.trim().length === 0) {
			return false
		}

		return true
	}
}

export class RegularArticle extends Article {
	abstract: string

	constructor(
		abstract: string,
		title: string,
		authors: User[],
		notificationAuthor: User,
		fileURL: string
	) {
		super(title, authors, fileURL, notificationAuthor)
		this.abstract = abstract
	}

	validate(): boolean {
		if (this.abstract.trim().length === 0) {
			return false
		}

		if (this.abstract.split(' ').length > 300) {
			return false
		}

		return super.validate()
	}
}

export class Poster extends Article {
	sourceURL: string

	constructor(
		title: string,
		authors: User[],
		notificationAuthor: User,
		fileURL: string,
		sourceURL: string
	) {
		super(title, authors, fileURL, notificationAuthor)
		this.sourceURL = sourceURL
	}
}
