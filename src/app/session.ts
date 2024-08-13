import {Article, RegularArticle} from '@app/article'
import {Rol, User} from '@app/user'
import {Review} from './review'
import {SessionSelection} from './sessionSelection'
import {iterableIncludes} from './utils'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private sessionSelection: SessionSelection
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
		sessionSelection: SessionSelection,
		deadline: Date
	) {
		this.theme = theme
		this.maxArticlesAccept = maxArticlesAccept
		this.sessionSelection = sessionSelection
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

	public getSelectionForm(): SessionSelection {
		return this.sessionSelection
	}

	public getDeadline(): Date {
		return this.deadline
	}

	public getArticles(): Article[] {
		return this.articles
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

	//RECEPTION STAGE

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

	//BIDDING STAGE

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

		// validate user´s rol
		if (user.getRol() != Rol.REVIEWER)
			throw new Error('User must be a reviewer')

		// add bid to the article
		const userBids: Map<Article, Interest> =
			this.interestInArticles.get(user) || new Map()
		userBids.set(article, interest)
		this.interestInArticles.set(user, userBids)
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		return this.interestInArticles
	}

	public getBid(user: User, article: Article): Interest {
		const userBids = this.interestInArticles.get(user)
		if (!userBids) return 'NONE'
		return userBids.get(article) || 'NONE'
	}

	//ASIGMENTANDREVIEW STAGE
	public createAssignment(): void {
		if (this.interestInArticles.size < 3) {
			throw new Error('This session must have 3 reviewers minimum')
		}

		for (let article of this.articles) {
			let users: User[] = this.getReviewersForArticle(article)
			article.setReviewers(users)
		}
	}

	public getFilterInterestTypeUser(
		article: Article,
		interest: Interest
	): User[] {
		const usersInterested: User[] = []
		this.interestInArticles.forEach(
			(value: Map<Article, Interest>, key: User) => {
				if (
					(iterableIncludes(value.keys(), article) &&
						value.get(article) == interest) ||
					(interest == 'NONE' &&
						!iterableIncludes(value.keys(), article))
				)
					usersInterested.push(key)
			}
		)
		return usersInterested
	}

	public getReviewersForArticle(article: Article): User[] {
		let usersInterested: User[] = []
		usersInterested = usersInterested.concat(
			this.getFilterInterestTypeUser(article, 'INTERESTED')
		)
		usersInterested = usersInterested.concat(
			this.getFilterInterestTypeUser(article, 'MAYBE')
		)
		usersInterested = usersInterested.concat(
			this.getFilterInterestTypeUser(article, 'NONE')
		)
		usersInterested = usersInterested.concat(
			this.getFilterInterestTypeUser(article, 'NOT INTERESTED')
		)
		return usersInterested
	}

	public addReview(article: Article, review: Review): void {
		if (this.state != SessionState.ASIGMENTANDREVIEW)
			throw new Error(
				'The review must be added in ASIGMENTANDREVIEW state'
			)
		if (Math.abs(review.getNote() || 4) > 3)
			throw new Error('The note must be greater -3 and lower 3')
		if (!iterableIncludes(this.articlesReviews.keys(), article))
			throw new Error('The article is not part of this session')
		if (!article.isReviewer(review.getReviewer()))
			throw new Error('The user is not part of this article review')

		article.addReview(review)
	}

	public getReview(article: Article, user: User): Review | undefined {
		if (!this.articlesReviews.has(article))
			throw new Error('The article is not part of this sesion')

		return article.getReview(user)
	}

	public getArticlesReviews(): Map<Article, Map<User, Review>> {
		return this.articlesReviews
	}

	//SELECTION STAGE
	public selection(): Article[] {
		return this.sessionSelection.selection(this.articlesReviews)
	}
}

export type Interest = 'INTERESTED' | 'NOT INTERESTED' | 'MAYBE' | 'NONE'

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
