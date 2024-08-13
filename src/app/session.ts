import {Article} from '@app/article'
import {User} from '@app/user'
import {Bids, Reception as ReceptionState, SessionState} from './sessionState'
import {Review} from './review'
import {SessionSelection} from './sessionSelection'

export class Session {
	private theme: string
	private state: SessionState
	private maxArticlesAccept: number
	private sessionSelection: SessionSelection
	private articles: Article[]

	// BIDDING state
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

	public getBids(): Bids {
		return this.state.getBids()
	}

	public getBid(user: User, article: Article): Interest {
		return this.state.getBid(user, article)
	}

	public getBidders(): User[] {
		return this.state.getBidders()
	}

	public areBidsOpen(): boolean {
		return this.state.areBidsOpen()
	}

	//ASIGMENTANDREVIEW STAGE

	public addReview(article: Article, review: Review): void {
		if (!this.isAssignmentAndReviewState())
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

	public getReview(article: Article, user: User): Review {
		return article.getReview(user)
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
