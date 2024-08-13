import {Article} from './article'
import {Review} from './review'
import {Interest, Session} from './session'
import {Rol, User} from './user'
import {compareInterests} from './utils'

export type ValidState =
	| 'RECEPTION'
	| 'BIDDING'
	| 'ASSIGNMENTANDREVIEW'
	| 'SELECTION'

export type BidsState = 'OPENED' | 'CLOSED'

export type Bids = Map<Article, Map<User, Interest>>

export abstract class SessionState {
	protected session: Session

	public constructor(session: Session) {
		this.session = session
	}

	public isReceptionState(): boolean {
		return this instanceof Reception
	}
	public isBiddingState(): boolean {
		return this instanceof Bidding
	}
	public isAssignmentAndReviewState(): boolean {
		return this instanceof AssignmentAndReview
	}
	public isSelectionState(): boolean {
		return this instanceof Selection
	}

	public abstract canReceiveArticle(article: Article): void

	public abstract startBidding(): void

	public abstract startReviewAndAssignment(): void

	public abstract startSelection(): void

	public abstract getBidders(): User[]

	public abstract getBids(): Bids

	public abstract getBid(user: User, article: Article): Interest

	public abstract bid(user: User, article: Article, interest: Interest): void

	public abstract areBidsOpen(): boolean

	public abstract closeBids(): void

	public abstract addReview(article: Article, review: Review): void
}

export class Reception extends SessionState {
	public constructor(session: Session) {
		super(session)
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

	public getBidders(): User[] {
		throw new Error('This session is not in BIDDING state')
	}

	public getBids(): Bids {
		throw new Error('This session is not in BIDDING state')
	}

	public getBid(user: User, article: Article): Interest {
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

	public startReviewAndAssignment(): void {
		throw new Error('This session is not in BIDDING state')
	}

	public addReview(article: Article, review: Review): void {
		throw new Error('The review must be added in ASIGMENTANDREVIEW state')
	}

	public startSelection(): void {
		throw new Error('This session is not in ASSIGNMENTANDREVIEW state')
	}
}

export class Bidding extends SessionState {
	private bids: Bids
	private bidsState: BidsState

	public constructor(session: Session) {
		super(session)
		this.bids = new Map()
		this.bidsState = 'OPENED'
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBidders(): User[] {
		return Array.from(this.bids).flatMap(([_, b]) => Array.from(b.keys()))
	}

	public getBids(): Bids {
		return this.bids
	}

	public getBid(user: User, article: Article): Interest {
		return this.bids.get(article)?.get(user) || 'NONE'
	}

	public bid(user: User, article: Article, interest: Interest): void {
		// cant accept bids in closed state
		if (!this.areBidsOpen())
			throw new Error('The bids are closed, you can not bid anymore')

		// validate article is in the session
		if (!this.session.isArticlePresent(article))
			throw new Error('The article is not part of this session')

		// validate user has rol reviewer
		if (user.getRol() != Rol.REVIEWER)
			throw new Error('User must be a reviewer')

		// add bid to the article
		const userBids: Map<User, Interest> =
			this.bids.get(article) || new Map()
		userBids.set(user, interest)
		this.bids.set(article, userBids)
	}

	public areBidsOpen(): boolean {
		return this.bidsState == 'OPENED'
	}

	public closeBids(): void {
		this.bidsState = 'CLOSED'
	}

	public startBidding(): void {
		throw new Error('This session can not be updated to BIDDING')
	}
	public startReviewAndAssignment(): void {
		this.session.setState(new AssignmentAndReview(this.session, this.bids))
	}

	public addReview(article: Article, review: Review): void {
		throw new Error('The review must be added in ASIGMENTANDREVIEW state')
	}

	public startSelection(): void {
		throw new Error('Cant start selection in BIDDING state')
	}
}

export class AssignmentAndReview extends SessionState {
	private bids: Bids

	public constructor(session: Session, bids: Bids) {
		super(session)
		this.bids = bids
		this.createAssignment()
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBidders(): User[] {
		return Array.from(this.bids).flatMap(([_, b]) => Array.from(b.keys()))
	}

	public getBids(): Bids {
		throw new Error('This session is not in BIDDING state')
	}

	public getBid(user: User, article: Article): Interest {
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

	public createAssignment(): void {
		if (this.getBidders().length < 3) {
			throw new Error('This session must have 3 reviewers minimum')
		}

		for (let article of this.session.getArticles()) {
			let users: User[] = this.getOrderedInteresteds(article).slice(0, 3)
			article.setReviewers(users)
		}
	}

	private getOrderedInteresteds(article: Article): User[] {
		const interests = this.bids.get(article)

		if (!interests)
			throw new Error('The article has not enough interesteds')

		return Array.from(interests.entries())
			.sort(([_, iA], [__, iB]) => compareInterests(iA, iB))
			.map(([user, _]) => user)
	}

	public addReview(article: Article, review: Review): void {
		if (Math.abs(review.getNote() || 4) > 3)
			throw new Error('The note must be greater -3 and lower 3')
		if (!this.session.isArticlePresent(article))
			throw new Error('The article is not part of this session')
		if (!article.isReviewer(review.getReviewer()))
			throw new Error('The user is not part of this article review')

		article.addReview(review)
	}

	public startSelection(): void {
		this.session.setState(new Selection(this.session))
	}
}

export class Selection extends SessionState {
	public constructor(session: Session) {
		super(session)
	}

	public canReceiveArticle(): void {
		throw new Error('This session can not receive more articles')
	}

	public getBidders(): User[] {
		throw new Error('This session is not in BIDDING state')
	}

	public getBids(): Bids {
		throw new Error('This session is not in BIDDING state')
	}

	public getBid(user: User, article: Article): Interest {
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

	public addReview(article: Article, review: Review): void {
		throw new Error('The review must be added in ASIGMENTANDREVIEW state')
	}

	public startSelection(): void {
		throw new Error('This session can not be updated to SELECTION')
	}
}
