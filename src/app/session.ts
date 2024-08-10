import {Article} from '@app/article'
import {Rol, User} from '@app/user'
import {Reception as ReceptionState, SessionState} from './sessionState'
import {Review} from './review'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private selectionForm: Map<SessionType, SessionSelection>
	private articles: Article[]
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
		this.state = new ReceptionState(this)
		this.articles = []
		this.articlesReviews = new Map()
	}

	public getTheme(): string {
		return this.theme
	}

	public isReceptionState(): boolean {
		return this.state.isReceptionState()
	}

	public isBiddingState(): boolean {
		return this.state.isBiddingState()
	}

	public isAssignmentAndReviewState(): boolean {
		return this.state.isAssignmentAndReviewState()
	}

	public isSelectionState(): boolean {
		return this.state.isSelectionState()
	}

	public setState(state: SessionState): void {
		this.state = state
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
		this.state.canReceiveArticle(article)
		return this.articles.push(article)
	}

	public isArticlePresent(article: Article): boolean {
		return this.articles.includes(article)
	}

	public getArticles(): Article[] {
		return this.articles
	}

	public startBidding(): void {
		this.state.startBidding()
	}

	public startReviewAndAssignment(): void {
		this.state.startReviewAndAssignment()
	}

	public startSelection(): void {
		this.state.startSelection()
	}

	public getArticlesReviews(): Map<Article, Map<User, Review>> {
		return this.articlesReviews
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		return this.state.getBids()
	}

	public getBid(user: User, article: Article): Interest {
		const userBids = this.state.getBids().get(user)
		if (!userBids) return 'NONE'
		return userBids.get(article) || 'NONE'
	}

	public areBidsOpen(): boolean {
		return this.state.areBidsOpen()
	}

	public createAssignment(): void {
		if (Array.from(this.state.getBids().keys()).length < 3) {
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
		this.state
			.getBids()
			.forEach((value: Map<Article, Interest>, key: User) => {
				if (
					(Array.from(value.keys()).includes(article) &&
						value.get(article) == interest) ||
					(interest == 'NONE' &&
						!Array.from(value.keys()).includes(article))
				)
					usersInterested.push(key)
			})
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
		if (!this.state.isAssignmentAndReviewState())
			throw new Error(
				'The review must be added in ASIGMENTANDREVIEW state'
			)
		if (Math.abs(review.getNote() || 4) > 3)
			throw new Error('The note must be greater -3 and lower 3')
		if (!Array.from(this.articlesReviews.keys()).includes(article))
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

	public closeBids(): void {
		this.state.closeBids()
	}

	public bid(user: User, article: Article, interest: Interest) {
		this.state.bid(user, article, interest)
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

export type BidsState = 'OPENED' | 'CLOSED'
