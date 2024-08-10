import {Article} from './article'
import {Interest, BidsState, Session} from './session'
import {User} from './user'

export type ValidState =
	| 'RECEPTION'
	| 'BIDDING'
	| 'ASSIGNMENTANDREVIEW'
	| 'SELECTION'

export abstract class SessionState {
	private state: ValidState
	protected session: Session

	public constructor(state: ValidState, session: Session) {
		this.state = state
		this.session = session
	}

	public isReceptionState(): boolean {
		return this.state == 'RECEPTION'
	}
	public isBiddingState(): boolean {
		return this.state == 'BIDDING'
	}
	public isAssignmentAndReviewState(): boolean {
		return this.state == 'ASSIGNMENTANDREVIEW'
	}
	public isSelectionState(): boolean {
		return this.state == 'SELECTION'
	}

	public abstract canReceiveArticle(article: Article): void

	public abstract startBidding(): void

	public abstract startReviewAndAssignment(): void

	public abstract startSelection(): void

	public abstract getBids(): Map<User, Map<Article, Interest>>

	public abstract bid(user: User, article: Article, interest: Interest): void

	public abstract areBidsOpen(): boolean

	public abstract closeBids(): void
}

export class Reception extends SessionState {
	public constructor(session: Session) {
		super('RECEPTION', session)
	}
	public startReviewAndAssignment(): void {
		throw new Error('Cant start review and assignment in RECEPTION state')
	}

	public canReceiveArticle(): void {
		//Validations to add a new article
		this.validateMaxAllowed()
		this.validateDeadline()
	}

	private validateMaxAllowed(): void {
		if (
			this.session.getArticles().length ==
			this.session.getMaxArticlesAccept()
		)
			throw new Error('The number of items exceeds the maximum allowed')
	}

	private validateDeadline(): void {
		if (this.session.getDeadline() < new Date())
			throw new Error('This session has passed its deadline')
	}

	public startBidding(): void {
		this.session.setState(new Bidding(this.session))
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		throw new Error('This session is not in BIDDING state')
	}

	public bid(user: User, article: Article, interest: Interest): void {
		throw new Error('This session is not in BIDDING state')
	}

	public areBidsOpen(): boolean {
		return false
	}

	public closeBids(): void {
		throw new Error('This session is not in BIDDING state')
	}

	public startSelection(): void {
		throw new Error('Cant start selection in RECEPTION state')
	}
}

export class Bidding extends SessionState {
	// BIDDING state
	private interestInArticles: Map<User, Map<Article, Interest>>
	private bidsState: BidsState

	public constructor(session: Session) {
		super('BIDDING', session)
		this.interestInArticles = new Map()
		this.bidsState = 'OPENED'
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		return this.interestInArticles
	}

	public bid(user: User, article: Article, interest: Interest): void {
		// cant accept bids in closed state
		if (this.bidsState == 'CLOSED')
			throw new Error('The bids are closed, you can not bid anymore')

		// validate article is in the session
		if (!this.session.isArticlePresent(article))
			throw new Error('The article is not part of this session')

		// add bid to the article
		const userBids: Map<Article, Interest> =
			this.interestInArticles.get(user) || new Map()
		userBids.set(article, interest)
		this.interestInArticles.set(user, userBids)
	}

	public areBidsOpen(): boolean {
		return this.bidsState == 'OPENED'
	}

	public closeBids(): void {
		this.bidsState = 'CLOSED'
	}

	public startBidding(): void {
		throw new Error('Cant start bidding in BIDDING state')
	}
	public startReviewAndAssignment(): void {
		this.session.setState(new AssignmentAndReview(this.session))
	}

	public startSelection(): void {
		throw new Error('Cant start selection in BIDDING state')
	}
}

export class AssignmentAndReview extends SessionState {
	public constructor(session: Session) {
		super('ASSIGNMENTANDREVIEW', session)
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		throw new Error('This session is not in BIDDING state')
	}

	public bid(user: User, article: Article, interest: Interest): void {
		throw new Error('This session is not in BIDDING state')
	}

	public areBidsOpen(): boolean {
		return false
	}

	public closeBids(): void {
		throw new Error('This session is not in BIDDING state')
	}

	public startBidding(): void {
		throw new Error('This session can not be updated to BIDDING')
	}
	public startReviewAndAssignment(): void {
		throw new Error(
			'This session can not be updated to ASSIGNMENTANDREVIEW'
		)
	}

	public startSelection(): void {
		this.session.setState(new Selection(this.session))
	}
}

export class Selection extends SessionState {
	public constructor(session: Session) {
		super('SELECTION', session)
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBids(): Map<User, Map<Article, Interest>> {
		throw new Error('This session is not in BIDDING state')
	}

	public bid(user: User, article: Article, interest: Interest): void {
		throw new Error('This session is not in BIDDING state')
	}

	public areBidsOpen(): boolean {
		return false
	}

	public closeBids(): void {
		throw new Error('This session is not in BIDDING state')
	}

	public startBidding(): void {
		throw new Error('This session can not be updated to BIDDING')
	}
	public startReviewAndAssignment(): void {
		throw new Error(
			'This session can not be updated to ASSIGNMENTANDREVIEW'
		)
	}

	public startSelection(): void {
		throw new Error('This session can not be updated to SELECTION')
	}
}
