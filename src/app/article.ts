abstract class Article {
    title: string
    authors: string[]

    constructor(title: string, authors: string[]) {
        this.title = title
        this.authors = authors
    }

    abstract validate(): boolean
}

export class RegularArticle extends Article {
    abstract: string

    constructor(abstract: string, title: string, authors: string[]) {
        super(title, authors)
        this.abstract = abstract
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

export class Poster extends Article {
    validate(): boolean {
        if (this.authors.length === 0) {
            return false
        }

        if (this.title.trim().length === 0) {
            return false
        }

        return true
    }
}

