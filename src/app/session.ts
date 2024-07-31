import { Article } from '@app/article';

export class Session {
	private theme: string;
	private state: SessionState;
	private maxArticlesAccept: number;
	private selectionForm: Map<SessionType, SessionSelection>;
	private articles: Article[];
	private deadline: Date;

	public constructor(
		theme: string,
		maxArticlesAccept: number,
		selectionForm: Map<SessionType, SessionSelection>,
		deadline: Date
	) {
		this.theme = theme;
		this.maxArticlesAccept = maxArticlesAccept;
		this.selectionForm = selectionForm;
		this.deadline = deadline;

		//Init default
		this.state = SessionState.RECEPTION;
		this.articles = [];
	}

	public getTheme(): string {
		return this.theme;
	}

	public getState(): SessionState {
		return this.state;
	}

	public getMaxArticlesAccept(): number {
		return this.maxArticlesAccept;
	}

	public getSelectionForm(): Map<SessionType, SessionSelection> {
		return this.selectionForm;
	}

	public getDeadline(): Date {
		return this.deadline;
	}

	public addArticle(article: Article) {
		this.canReceiveArticle();
		return this.articles.push(article);
	}

	private canReceiveArticle(): void {
		//Validations to add a new article
		this.validateMaxAllowed();
		this.validateReceptionState();
		this.validateDeadline();
	}

	private validateMaxAllowed(): void {
		if (this.articles.length == this.maxArticlesAccept)
			throw new Error('The number of items exceeds the maximum allowed');
	}

	private validateReceptionState(): void {
		if (this.state != SessionState.RECEPTION)
			throw new Error('This session can not recive more articles');
	}

	private validateDeadline(): void {
		if (this.deadline < new Date())
			throw new Error('This session has passed its deadline');
	}

	public getArticles() {
		return this.articles;
	}

	public updateState(state: SessionState) {
		return (this.state = state);
	}
}

export enum SessionSelection {
	TOP3,
	MINVALUE,
}

export enum SessionType {
	REGULAR,
	POSTER,
}

//Maybe in future this enum can be a state pattern for delegate logic
export enum SessionState {
	RECEPTION,
	BIDDING,
	ASIGMENTANDREVIEW,
	SELECTION,
}
