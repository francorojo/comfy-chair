import {
    Session,
    SessionType,
    SessionSelection,
    SessionState,
} from "@app/session"
import { RegularArticle } from "@app/article"
import {
    dummyAuthor1,
    dummyAuthor2,
    dummyTop3SelectionForm,
} from "@tests/dummies"
import { generateRegularArticle } from "./articleGenerator"

export const dummyAuthors = [dummyAuthor1, dummyAuthor2]

describe("test session case use", () => {
    test("Create a new session correctly", () => {
        let map = new Map()
        map.set(SessionType.POSTER, SessionSelection.TOP3)
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = dummyAuthors
        const notificationAuthor = dummyAuthor1
        const fileURL = "https://example.com/sample-article.pdf"
        const article = new RegularArticle(
            abstract,
            title,
            authors,
            notificationAuthor,
            fileURL
        )
        const session = new Session("Test", 2, map)
        session.addArticle(article)
        expect("Test").toEqual(session.getTheme())
        expect(SessionState.RECEPTION).toEqual(session.getState())
        expect(2).toEqual(session.getMaxArticlesAccept())
        expect(1).toEqual(session.getArticles().length)
    })

    test("Create a new session with more articles allowed", () => {
        let map = new Map()
        map.set(SessionType.POSTER, SessionSelection.TOP3)
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = dummyAuthors
        const notificationAuthor = dummyAuthor1
        const fileURL = "https://example.com/sample-article.pdf"
        const article = new RegularArticle(
            abstract,
            title,
            authors,
            notificationAuthor,
            fileURL
        )
        const session = new Session("Test", 0, map)
        expect(() => {
            session.addArticle(article)
        }).toThrow(new Error("The number of items exceeds the maximum allowed"))
    })

    test("Create a new session, update state and try add new article", () => {
        let map = new Map()
        map.set(SessionType.POSTER, SessionSelection.TOP3)
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim"
        const title = "Sample Article Title"
        const authors = dummyAuthors
        const notificationAuthor = dummyAuthor1
        const fileURL = "https://example.com/sample-article.pdf"
        const article = new RegularArticle(
            abstract,
            title,
            authors,
            notificationAuthor,
            fileURL
        )
        const session = new Session("Test", 1, map)
        session.updateState(SessionState.BIDDING)
        expect(() => {
            session.addArticle(article)
        }).toThrow(new Error("This session can not recive more articles"))
    })
})

describe("Session BIDDING state tests", () => {
    test("Session can be updated to BIDDING if state is RECEPTION", () => {
        const session = new Session("Test", 2, dummyTop3SelectionForm)
        expect(SessionState.RECEPTION).toEqual(session.getState())

        session.updateState(SessionState.BIDDING)

        expect(SessionState.BIDDING).toEqual(session.getState())
    })

    test("Session cannot be updated to BIDDING if state is ASIGMENTANDREVIEW", () => {
        const session = new Session("Test", 2, dummyTop3SelectionForm)

        session.updateState(SessionState.ASIGMENTANDREVIEW)

        expect(() => {
            session.updateState(SessionState.BIDDING)
        }).toThrow(new Error("This session can not be updated to BIDDING"))
    })

    test("Session cannot be updated to BIDDING if state is SELECTION", () => {
        const session = new Session("Test", 2, dummyTop3SelectionForm)
        session.updateState(SessionState.SELECTION)

        expect(() => {
            session.updateState(SessionState.BIDDING)
        }).toThrow(new Error("This session can not be updated to BIDDING"))
    })

    test("Session cannot be updated to BIDDING if state is BIDDING", () => {
        const session = new Session("Test", 2, dummyTop3SelectionForm)
        session.updateState(SessionState.BIDDING)

        expect(() => {
            session.updateState(SessionState.BIDDING)
        }).toThrow(new Error("This session can not be updated to BIDDING"))
    })

    test("User can bid on an existing article", () => {})

    test("User cannot bid on an article that is not in the session", () => {})

    test("User can bid on a bidden article", () => {})

    test("User can bid as interested in an article", () => {})

    test("User can bid as not interested in an article", () => {})

    test("User can bid as maybe interested in an article", () => {})
})

