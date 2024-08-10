import {Rol, User} from '@app/user'

export abstract class Article {
	private title: string
	private authors: User[]
	private type: ArticleType
	private notificationAuthor: User
	private fileURL: string

	constructor(
		title: string,
		authors: User[],
		type: ArticleType,
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
		this.type = type
		this.fileURL = fileURL
		this.notificationAuthor = notificationAuthor
	}

	getAuthors(): User[] {
		return this.authors
	}

	getType() {
		return this.type
	}

	public validate(): boolean {
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
		super(title, authors, 'REGULAR', fileURL, notificationAuthor)
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
		super(title, authors, 'POSTER', fileURL, notificationAuthor)
		this.sourceURL = sourceURL
	}
}

export type ArticleType = 'REGULAR' | 'POSTER'
