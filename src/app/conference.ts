import {Session} from './session'
import {Rol, User} from './user'
import {flatMap} from './utils'

export class Conference {
	private sessions: Session[]
	private chairs: User[]

	public constructor(chairs: User[], sessions: Session[]) {
		if (!chairs.every((user) => user.getRol() == Rol.ORGANIZER))
			throw new Error('All chairs must to be organizers')

		this.chairs = chairs
		this.sessions = sessions
	}

	public getChairs(): User[] {
		return this.chairs
	}

	public addChair(user: User) {
		if (user.getRol() != Rol.ORGANIZER)
			throw new Error('The user must to be organizer')

		this.chairs.push(user)
	}

	public getSessions(): Session[] {
		return this.sessions
	}

	public addSession(session: Session) {
		this.sessions.push(session)
	}

	public getAuthors(): User[] {
		return Array.from(
			new Set(
				this.sessions
					.flatMap((session) => session.getArticles())
					.flatMap((article) => article.getAuthors())
			)
		)
	}

	public getReviewers(): User[] {
		//TODO add tests
		return this.sessions.flatMap((session) =>
			flatMap(
				session.getArticlesReviews().entries(),
				([article, reviews]) => reviews.keys()
			)
		)
	}
}
