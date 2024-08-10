import {Article} from '@app/article'

export interface Selection {
	selectArticle(articles: Article[]): Article[]
}

class Top3Selection implements Selection {
	selectArticle(articles: Article[]): Article[] {
		return articles.slice(0, 3)
	}
}

export const DEFAULT_SELECTION: Selection = new Top3Selection()
