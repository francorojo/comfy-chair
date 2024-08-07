import {Article, RegularArticle} from '@app/article'
import {Rol, User} from '@app/user'
import {Review} from './review'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private selectionForm: Map<SessionType, SessionSelection>
	private articles: Article[]

	// BIDDING state
	private interestInArticles: Map<User, Map<Article, Interest>>
	private bidsState: BidsState
	private deadline: Date

	// ASIGMENTANDREVIEW state
	private articlesReviews: Map<Article, Map<User, Review>>

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		selectionForm: Map<SessionType, SessionSelection>,
		deadline: Date
	) {
		this.theme = theme
		this.maxArticlesAccept = maxArticlesAccept
		this.selectionForm = selectionForm
		this.deadline = deadline

		//Init default
		this.state = SessionState.RECEPTION
		this.articles = []
		this.interestInArticles = new Map()
		this.bidsState = 'CLOSED'
		this.articlesReviews = new Map()
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

	public getDeadline(): Date {
		return this.deadline
	}

	public addArticle(article: Article) {
		this.canReceiveArticle()
		return this.articles.push(article)
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
		//BIDDING VALIDATION
		if (
			state == SessionState.BIDDING &&
			this.state != SessionState.RECEPTION
		)
			throw new Error('This session can not be updated to BIDDING')

		//BIDDING STAGE
		if (state == SessionState.BIDDING) {
			this.bidsState = 'OPENED'
			this.interestInArticles.clear()
		}

		//ASIGMENTANDREVIEW VALIDATION
		if (
			state == SessionState.ASIGMENTANDREVIEW &&
			this.state != SessionState.BIDDING
		)
			throw new Error(
				'This session can not be updated to ASIGMENTANDREVIEW'
			)

		//ASIGMENTANDREVIEW STAGE
		if (state == SessionState.ASIGMENTANDREVIEW) {
			this.createAssignment()
			this.bidsState = 'CLOSED'
		}
		return (this.state = state)
	}

	public createAssignment(): void {
		if (Array.from(this.interestInArticles.keys()).length < 3) {
			throw new Error('This session must to be 3 reviewers minimum')
		}

		for (let i = 0; i < this.articles.length; i++) {
			for (let i = 0; i < 3; i++) {
				let assignment = new Map()
				let review = new Map()
				assignment.set(this.getReviewsForArticle()[i], review)
				this.articlesReviews.set(this.articles[i], assignment)
			}
		}
	}

	public getReviewsForArticle(): User[] {
		return Array.from(this.interestInArticles.keys()) //PENDING FILTER INSTERESTED USERS
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

		// validate article is in the session
		if (user.getRol() != Rol.REVIEWER)
			throw new Error('User must to be a reviewer')

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

export type BidsState = 'OPENED' | 'CLOSED'
