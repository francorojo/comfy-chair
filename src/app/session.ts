import {Article} from '@app/article'
import {User} from '@app/user'
import {Bids, Reception, SessionState} from './sessionState'
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
		this.state = new Reception(this)
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
		this.state.addReview(article, review)
	}

	public getReview(article: Article, user: User): Review {
		return article.getReview(user)
	}

	public closeBids(): void {
		this.state.closeBids()
	}

	public bid(user: User, article: Article, interest: Interest): void {
		this.state.bid(user, article, interest)
	}

	//SELECTION STAGE
	public selection(): Article[] {
		return this.sessionSelection.selection(this.getArticles())
	}
}

export type Interest = 'INTERESTED' | 'NOT INTERESTED' | 'MAYBE' | 'NONE'
