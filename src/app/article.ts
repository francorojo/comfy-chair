interface IArticle {
    validate(): boolean
}

class RegularArticle implements IArticle {
    abstract: string
    title: string
    authors: string[]

    constructor(abstract: string, title: string, authors: string[]) {
        this.abstract = abstract
        this.title = title
        this.authors = authors
    }

    validate(): boolean {
        throw new Error("Method not implemented.")
    }
}

