import {Rol, User} from '@app/user'
import {Article, ArticleType} from './article'
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
			.slice(0, this.limit)
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

export class MultiSelection implements SessionSelection {
	selectionCriterias: Map<ArticleType, SessionSelection>

	constructor(selectionCriterias: Map<ArticleType, SessionSelection>) {
		this.selectionCriterias = selectionCriterias
	}

	public selection(articles: Article[]): Article[] {
		return Array.from(this.selectionCriterias.entries()).flatMap(
			([type, selectionCriteria]) =>
				selectionCriteria.selection(
					articles.filter((article) => article.getType() === type)
				)
		)
	}
}
