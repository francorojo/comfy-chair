import {Article, Poster, RegularArticle} from '@app/article'
import {User} from '@app/user'
import {
	Bids,
	Interest,
	Reception as ReceptionState,
	SessionState
} from './sessionState'
import {Review} from './review'
import {SessionSelection} from './sessionSelection'

export abstract class Session {
	protected theme: string
	protected state: SessionState
	protected maxArticlesAccept: number
	protected articles: Article[]

	// BIDDING state
	protected deadline: Date

	// SELECTION state
	protected sessionSelection: SessionSelection

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

	public addArticle(article: Article): void {
		this.state.canReceiveArticle(article)
		this.articles.push(article)
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
		selectionCriteria: SessionSelection,
		deadline: Date
	) {
		super(theme, maxArticlesAccept, selectionCriteria, deadline)
	}

	public selectPosters(): Poster[] {
		return this.selection().filter((a) => a.isPoster()) as Poster[]
	}

	public selectRegularArticles(): RegularArticle[] {
		return this.selection().filter((a) =>
			a.isRegularArticle()
		) as RegularArticle[]
	}
}
