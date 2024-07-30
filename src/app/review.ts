export class Review {
    private note: number;
    private text: string;

    public constructor(note: number, text: string){
        this.note = note;
        this.text = text;
    }

    public getNote(): number{
        return this.note;
    }

    public getText(): string{
        return this.text;
    }
}