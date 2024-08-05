import {RegularArticle} from './article'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private selectionForm: Map<SessionType, SessionSelection>
	private articles: RegularArticle[]

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		selectionForm: Map<SessionType, SessionSelection>
	) {
		this.theme = theme
		this.maxArticlesAccept = maxArticlesAccept
		this.selectionForm = selectionForm

		//Init default
		this.state = SessionState.RECEPTION
		this.articles = []
	}

	public getTheme(): string {
		return this.theme
	}

	public getState(): SessionState {
		return this.state
	}

	public getMaxArticlesAccept(): number {
		return this.maxArticlesAccept
	}

	public getSelectionForm(): Map<SessionType, SessionSelection> {
		return this.selectionForm
	}

	public addArticle(article: RegularArticle) {
		//Validations to add a new article
		if (this.articles.length == this.maxArticlesAccept)
			throw new Error('The number of items exceeds the maximum allowed')
		if (this.state != SessionState.RECEPTION)
			throw new Error('This session can not recive more articles')

		return this.articles.push(article)
	}

	public getArticles() {
		return this.articles
	}

	public updateState(state: SessionState) {
		return (this.state = state)
	}
}

export enum SessionSelection {
	TOP3,
	MINVALUE
}

export enum SessionType {
	REGULAR,
	POSTER
}

//Maybe in future this enum can be a state pattern for delegate logic
export enum SessionState {
	RECEPTION,
	BIDDING,
	ASIGMENTANDREVIEW,
	SELECTION
}
