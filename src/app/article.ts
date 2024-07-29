interface IArticle {
    validate(): boolean
}

export class RegularArticle implements IArticle {
    abstract: string
    title: string
    authors: string[]

    constructor(abstract: string, title: string, authors: string[]) {
        this.abstract = abstract
        this.title = title
        this.authors = authors
    }

    validate(): boolean {
        if (this.abstract.trim().length === 0) {
            return false
        }

        if (this.abstract.split(" ").length > 300) {
            return false
        }

        if (this.authors.length === 0) {
            return false
        }

        if (this.title.trim().length === 0) {
            return false
        }

        return true
    }
}

