import {Article, ArticleType, Poster, RegularArticle} from '@app/article'
import {User} from '@app/user'
import {DEFAULT_SELECTION, Selection} from './selection'

export abstract class Session {
	protected theme: string
	protected state: SessionState
	protected maxArticlesAccept: number
	protected articles: Article[]

	// BIDDING state
	protected interestInArticles: Map<User, Map<Article, Interest>>
	protected bidsState: BidsState
	protected deadline: Date

	// SELECTION state
	protected selection: Selection

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		deadline: Date,
		selection: Selection = DEFAULT_SELECTION
	) {
		this.theme = theme
		this.maxArticlesAccept = maxArticlesAccept
		this.deadline = deadline
		this.selection = selection

		//Init default
		this.state = SessionState.RECEPTION
		this.articles = []
		this.interestInArticles = new Map()
		this.bidsState = 'CLOSED'
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

	public getDeadline(): Date {
		return this.deadline
	}

	public addArticle(article: Article): void {
		this.canReceiveArticle()
		this.articles.push(article)
	}

	private canReceiveArticle(): void {
		//Validations to add a new article
		this.validateMaxAllowed()
		this.validateReceptionState()
		this.validateDeadline()
	}

	private validateMaxAllowed(): void {
		if (this.articles.length == this.maxArticlesAccept)
			throw new Error('The number of items exceeds the maximum allowed')
	}

	private validateReceptionState(): void {
		if (this.state != SessionState.RECEPTION)
			throw new Error('This session can not recive more articles')
	}

	private validateDeadline(): void {
		if (this.deadline < new Date())
			throw new Error('This session has passed its deadline')
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
		else {
			this.bidsState = 'OPENED'
			this.interestInArticles.clear()
		}

		return (this.state = state)
	}

	public getBidsState(): BidsState {
		return this.bidsState
	}

	public closeBids(): void {
		this.bidsState = 'CLOSED'
	}

	public bid(user: User, article: Article, interest: Interest) {
		// cant accept bids in closed state
		if (this.bidsState == 'CLOSED')
			throw new Error('The bids are closed, you can not bid anymore')

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

export class RegularSession extends Session {
	public addArticle(article: RegularArticle): void {
		super.addArticle(article)
		return
	}
}

export class PosterSession extends Session {
	public addArticle(article: Poster): void {
		super.addArticle(article)
		return
	}
}

export class WorkshopSession extends Session {
	private selectionCriteria: Map<ArticleType, Selection>

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		deadline: Date,
		selectionCriteria: Map<ArticleType, Selection>
	) {
		super(theme, maxArticlesAccept, deadline)
		this.selectionCriteria = selectionCriteria
	}
}

export type Interest = 'INTERESTED' | 'NOT INTERESTED' | 'MAYBE' | 'NONE'

//Maybe in future this enum can be a state pattern for delegate logic
export enum SessionState {
	RECEPTION,
	BIDDING,
	ASIGMENTANDREVIEW,
	SELECTION
}

export type BidsState = 'OPENED' | 'CLOSED'
