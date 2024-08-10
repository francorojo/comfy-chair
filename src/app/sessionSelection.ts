import {Rol, User} from '@app/user'
import {Article} from './article'
import {Review} from './review'

export interface SessionSelection {
	selection(articlesReviews: Map<Article, Map<User, Review>>): Article[]
}

export class Top implements SessionSelection {
	limit: number

	constructor(limit: number) {
		this.limit = limit
	}

	public selection(
		articlesReviews: Map<Article, Map<User, Review>>
	): Article[] {
		let selectedArticles: Article[] =
			this.getOrderedArticles(articlesReviews)
		return selectedArticles.slice(0, 3)
	}

	private getOrderedArticles(
		articlesReviews: Map<Article, Map<User, Review>>
	): Article[] {
		// Convert the map to an array of entries
		const articlesReviewsEntries = Array.from(articlesReviews.entries())

		// Sort the array by total review (the value in each entry)
		articlesReviewsEntries.sort(
			(a, b) => this.getTotalReview(b[1]) - this.getTotalReview(a[1])
		)

		// Return the sorted array
		return articlesReviewsEntries.map((articleReview) => articleReview[0])
	}

	private getTotalReview(reviews: Map<User, Review>): number {
		const reviewsEntries = Array.from(reviews.entries()).map(
			(review) => review[1].getNote() ?? 0
		)
		return reviewsEntries.reduce(
			(accumulator, currentValue) => accumulator + currentValue
		)
	}
}

export class MinimumValue implements SessionSelection {
	minimumValue: number

	constructor(minimumValue: number) {
		this.minimumValue = minimumValue
	}

	public selection(
		articlesReviews: Map<Article, Map<User, Review>>
	): Article[] {
		// Convert the map to an array of entries
		const articlesReviewsEntries = Array.from(articlesReviews.entries())
		return articlesReviewsEntries
			.filter(
				(article) => this.getTotalReview(article[1]) > this.minimumValue
			)
			.map((articleReview) => articleReview[0])
	}

	private getTotalReview(reviews: Map<User, Review>): number {
		const reviewsEntries = Array.from(reviews.entries()).map(
			(review) => review[1].getNote() ?? 0
		)
		return reviewsEntries.reduce(
			(accumulator, currentValue) => accumulator + currentValue
		)
	}
}
