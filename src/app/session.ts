import {Article, ArticleType, Poster, RegularArticle} from '@app/article'
import {Rol, User} from '@app/user'
import {Selection} from './selection'
import {Review} from './review'
import {SessionSelection} from './sessionSelection'
import {iterableIncludes} from './utils'

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
	protected sessionSelection: SessionSelection

	// ASIGMENTANDREVIEW state
	private articlesReviews: Map<Article, Map<User, Review>>

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		selection: SessionSelection,
		deadline: Date
	) {
		this.theme = theme
		this.maxArticlesAccept = maxArticlesAccept
		this.sessionSelection = selection
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
			throw new Error('This session must to be 3 reviewers minimum')
		}

		for (let i = 0; i < this.articles.length; i++) {
			let users: User[] = this.getReviewsForArticle(this.articles[i])
			let assignment = new Map()
			for (let y = 0; y < 3; y++) {
				assignment.set(users[y], new Review())
			}
			this.articlesReviews.set(this.articles[i], assignment)
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

	public getReviewsForArticle(article: Article): User[] {
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

	public addReview(article: Article, user: User, review: Review): void {
		if (this.state != SessionState.ASIGMENTANDREVIEW)
			throw new Error(
				'The review must be added in ASIGMENTANDREVIEW state'
			)
		if (Math.abs(review.getNote() || 4) > 3)
			throw new Error('The note must be greater -3 and lower 3')
		if (!iterableIncludes(this.articlesReviews.keys(), article))
			throw new Error('The article is not part of this session')
		if (!this.articlesReviews.get(article)?.has(user))
			throw new Error('The user is not part of this article review')

		let userReviews: Map<User, Review> =
			this.articlesReviews.get(article) ?? new Map()

		userReviews?.set(user, review)
	}

	public getReview(article: Article, user: User): Review | undefined {
		if (!this.articlesReviews.has(article))
			throw new Error('The article is not part of this sesion')
		let userReviews = this.articlesReviews.get(article)

		if (!userReviews?.has(user))
			throw new Error('The user is not part of this article review')

		return userReviews.get(user)
	}

	public getArticlesReviews(): Map<Article, Map<User, Review>> {
		return this.articlesReviews
	}

	//SELECTION STAGE
	public selection(): Article[] {
		return this.sessionSelection.selection(this.articlesReviews)
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
	public constructor(
		theme: string,
		maxArticlesAccept: number,
		deadline: Date,
		selectionCriteria: SessionSelection
	) {
		super(theme, maxArticlesAccept, selectionCriteria, deadline)
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
