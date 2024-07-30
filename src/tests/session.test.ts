import { Session, Tipo, Seleccion } from "@app/session";
import { RegularArticle } from "@app/article"

describe('test session case use', () => {
  

    test('Create a new session correctly', () => {
        let map = new Map();
        map.set(Tipo.POSTER, Seleccion.TOP3); 
        let articles: RegularArticle[] = [];
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim";
        const title = "Sample Article Title";
        const authors = ["Author 1", "Author 2"];
        const article = new RegularArticle(abstract, title, authors);
        articles.push(article);
        const session = new Session("Test", "Initial", 2, map, articles);
        expect("Test").toEqual(session.getTheme());
        expect("Initial").toEqual(session.getState());
        expect(2).toEqual(session.getMaxArticlesAccept());
    });

    test('Create a new session with more articles allowed', () => {
        let map = new Map();
        map.set(Tipo.POSTER, Seleccion.TOP3); 
        let articles: RegularArticle[] = [];
        const abstract =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim";
        const title = "Sample Article Title";
        const authors = ["Author 1", "Author 2"];
        const article = new RegularArticle(abstract, title, authors);
        articles.push(article);
        expect( () => { new Session("Test", "Initial", 0, map, articles)} ).toThrow(new Error("The number of items exceeds the maximum allowed"));
    });

});