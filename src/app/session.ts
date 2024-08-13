import {Article} from '@app/article'
import {Rol, User} from '@app/user'
import {Reception as ReceptionState, SessionState} from './sessionState'
import {Review} from './review'
import {SessionSelection} from './sessionSelection'
import {compareInterests} from './utils'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private sessionSelection: SessionSelection
	private articles: Article[]

	// BIDDING state
	private interestInArticles: Map<Article, Map<User, Interest>>
	private deadline: Date

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
		this.state = new ReceptionState(this)
		this.articles = []
		this.interestInArticles = new Map()
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

	public getSelectionForm(): SessionSelection {
		return this.sessionSelection
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

	public getBids(): Map<User, Map<Article, Interest>> {
		return this.state.getBids()
	}

	public getBid(user: User, article: Article): Interest {
		const userBids = this.interestInArticles.get(article)
		if (!userBids) return 'NONE'
		return userBids.get(user) || 'NONE'
	}

	public getBidders(): User[] {
		return Array.from(this.interestInArticles).flatMap(([_, b]) =>
			Array.from(b.keys())
		)
	}

	public areBidsOpen(): boolean {
		return this.state.areBidsOpen()
	}

	//ASIGMENTANDREVIEW STAGE
	public createAssignment(): void {
		if (this.getBidders().length < 3) {
			throw new Error('This session must have 3 reviewers minimum')
		}

		for (let article of this.articles) {
			let users: User[] = this.getOrderedInteresteds(article).slice(0, 3)
			article.setReviewers(users)
		}
	}

	public getOrderedInteresteds(article: Article): User[] {
		const interests = this.interestInArticles.get(article)

		if (!interests)
			throw new Error('The article has not enough interesteds')

		return Array.from(interests.entries())
			.sort(([userA, iA], [userB, iB]) => compareInterests(iA, iB))
			.map(([user, i]) => user)
	}

	public addReview(article: Article, review: Review): void {
		if (this.isAssignmentAndReviewState())
			throw new Error(
				'The review must be added in ASIGMENTANDREVIEW state'
			)
		if (Math.abs(review.getNote() || 4) > 3)
			throw new Error('The note must be greater -3 and lower 3')
		if (!this.articles.includes(article))
			throw new Error('The article is not part of this session')
		if (!article.isReviewer(review.getReviewer()))
			throw new Error('The user is not part of this article review')

		article.addReview(review)
	}

	public closeBids(): void {
		this.state.closeBids()
	}

	public bid(user: User, article: Article, interest: Interest) {
		this.state.bid(user, article, interest)
		return article.getReview(user)
	}

	//SELECTION STAGE
	public selection(): Article[] {
		return this.sessionSelection.selection(this.getArticles())
	}
}

export type Interest = 'INTERESTED' | 'NOT INTERESTED' | 'MAYBE' | 'NONE'

export type BidsState = 'OPENED' | 'CLOSED'
