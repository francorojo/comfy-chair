import {Rol, User} from '@app/user'
import {Review} from './review'

export abstract class Article {
	private title: string
	private authors: User[]
	private notificationAuthor: User
	private fileURL: string

	private reviewers: User[]
	private reviews: Review[]

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

		this.reviewers = []
		this.reviews = []
	}

	getAuthors(): User[] {
		return this.authors
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

	public getReviewers(): User[] {
		return this.reviewers
	}

	public setReviewers(reviewers: User[]): void {
		this.reviewers = reviewers
	}

	public isReviewer(reviewer: User): boolean {
		return this.reviewers.includes(reviewer)
	}

	public addReview(review: Review): void {
		// validate reviewer is in the reviewers list
		this.validateReviewer(review.getReviewer())
		this.reviews.push(review)
	}

	private validateReviewer(reviewer: User): void {
		if (!this.reviewers.includes(reviewer)) {
			throw new Error('The reviewer is not part of the reviewers list')
		}
	}

	public getReview(reviewer: User): Review {
		return this.reviews.filter(
			(review) => review.getReviewer() === reviewer
		)[0]
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
