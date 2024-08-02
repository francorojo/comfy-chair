import {Article, RegularArticle} from '@app/article'
import {User} from '@app/user'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private selectionForm: Map<SessionType, SessionSelection>
	private articles: Article[]
	private interestInArticles: Map<User, Map<Article, Interest>>

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
		this.interestInArticles = new Map()
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

	public getArticles(): Article[] {
		return this.articles
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		return this.interestInArticles
	}

	public getBid(user: User, article: Article): Interest {
		const userBids = this.interestInArticles.get(user)
		if (!userBids) return 'NONE'
		return userBids.get(article) || 'NONE'
	}

	public updateState(state: SessionState) {
		if (
			state == SessionState.BIDDING &&
			this.state != SessionState.RECEPTION
		)
			throw new Error('This session can not be updated to BIDDING')

		return (this.state = state)
	}

	public bid(user: User, article: Article, interest: Interest) {
		// validate article is in the session
		if (!this.articles.includes(article as RegularArticle))
			throw new Error('The article is not part of this session')

		// add bid to the article
		const userBids: Map<Article, Interest> =
			this.interestInArticles.get(user) || new Map()
		userBids.set(article, interest)
		this.interestInArticles.set(user, userBids)
	}
}

export type Interest = 'INTERESTED' | 'NOT INTERESTED' | 'MAYBE' | 'NONE'

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
