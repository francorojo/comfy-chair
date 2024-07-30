import { RegularArticle, Poster } from "@app/article"

describe("Regular Article tests ", () => {
    test("Regular article is valid when abstract is not empty", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Regular article is invalid when abstract is empty", () => {
        const abstract = ""
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeFalsy()
    })

    test("Regular article is valid when abstract is less than 300 words", () => {
        const abstract = Array(299).fill("a").join(" ")
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Regular article is invalid when abstract is more than 300 words", () => {
        const abstract = Array(301).fill("a").join(" ")
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2", "Author 3"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeFalsy()
    })

    test("Regular article is valid when it has at least one author", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = ["Author 1"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Regular article is invalid when it doesnt have at least one author", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors: string[] = []
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeFalsy()
    })

    test("Regular article can have more than one author", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2", "Author 3"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeTruthy()
        expect(article.authors.length).toBeGreaterThan(1)
    })

    test("Regular article is valid when it has a title", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = ["Author 1", "Author 2"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Regular article is invalid when it doesnt have a title", () => {
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = ""
        const authors = ["Author 1", "Author 2"]
        const article = new RegularArticle(abstract, title, authors)

        expect(article.validate()).toBeFalsy()
    })
})

describe("Poster Article tests ", () => {
    test("Poster article is valid when it has at least one author", () => {
        const title = "Sample Poster Title"
        const authors = ["Author 1"]
        const article = new Poster(title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Poster article is invalid when it doesnt have at least one author", () => {
        const title = "Sample Poster Title"
        const authors: string[] = []
        const article = new Poster(title, authors)

        expect(article.validate()).toBeFalsy()
    })

    test("Poster article can have more than one author", () => {
        const title = "Sample Poster Title"
        const authors = ["Author 1", "Author 2", "Author 3"]
        const article = new Poster(title, authors)

        expect(article.validate()).toBeTruthy()
        expect(article.authors.length).toBeGreaterThan(1)
    })

    test("Poster article is valid when it has a title", () => {
        const title = "Sample Poster Title"
        const authors = ["Author 1", "Author 2"]
        const article = new Poster(title, authors)

        expect(article.validate()).toBeTruthy()
    })

    test("Poster article is invalid when it doesnt have a title", () => {
        const title = ""
        const authors = ["Author 1", "Author 2"]
        const article = new Poster(title, authors)

        expect(article.validate()).toBeFalsy()
    })
})

