import {Rol, User} from '@app/user'
import {Article} from './article'
import {Review} from './review'

export interface SessionSelection {
	selection(articles: Article[]): Article[]
}

export class TopN implements SessionSelection {
	limit: number

	constructor(limit: number) {
		this.limit = limit
	}

	public selection(articles: Article[]): Article[] {
		return articles
			.sort((a, b) => b.getReviewsTotalNote() - a.getReviewsTotalNote())
			.slice(0, 3)
	}
}

export class MinimumValue implements SessionSelection {
	minimumValue: number

	constructor(minimumValue: number) {
		this.minimumValue = minimumValue
	}

	public selection(articles: Article[]): Article[] {
		return articles.filter(
			(article) => article.getReviewsTotalNote() >= this.minimumValue
		)
	}
}
