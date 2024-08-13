import {User} from './user'

export class Review {
	private reviewer: User
	private note: number
	private text: string

	public constructor(user: User, note: number, text: string) {
		this.reviewer = user
		this.note = note
		this.text = text
	}

	public getReviewer(): User {
		return this.reviewer
	}

	public getNote(): number {
		return this.note
	}

	public getText(): string {
		return this.text
	}
}
