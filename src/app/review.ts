export class Review {
	private note: number | undefined
	private text: string | undefined

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
