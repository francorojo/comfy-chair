import { Session } from "./session"
import { User } from "./user"

export class Conference {
	private sessions: Session[]
	private chairs: User[]

	public constructor(chairs: User[], sessions: Session[]) {
		this.chairs = chairs //validate rol
		this.sessions = sessions
	}

	public getChairs(): User[] {
		return this.chairs
	}

	public addChair(user: User) {
		this.chairs.push(user) //pending validate rol
	}

	public getSessions(): Session[] {
		return this.sessions
	}

	public addSession(session: Session) {
		this.sessions.push(session)
	}

	public getAuthors(): User[] {
		return Array.from(new Set(this.sessions.flatMap(session => session.getArticles()).flatMap(article => article.authors)));
	}

	// public getReviewers(): User[] {
	// 	return this.sessions.flatMap(session => session.getReviews()).map(review => review.getReviewer());
	// }
}
