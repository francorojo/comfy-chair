export class Review {
	private note?: number
	private text?: string

	public constructor(note?: number, text?: string) {
		this.note = note
		this.text = text
	}

	public getNote() {
		return this.note
	}

	public getText() {
		return this.text
	}
}
