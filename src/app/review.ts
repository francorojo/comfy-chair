export class Review {
	private note?: number
	private text?: string

	public constructor(note?: number, text?: string) {
		this.note = note
		this.text = text
	}

	public getNote(): number | undefined {
		return this.note
	}

	public getText(): string | undefined {
		return this.text
	}
}
