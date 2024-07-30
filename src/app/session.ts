import { RegularArticle } from "./article";

export class Session {
    private theme: string;
    private state: string;
    private maxArticlesAccept: number;
    private selectionForm: Map<Tipo,Seleccion>;
    private articles: RegularArticle[];

    public constructor(theme: string, state: string, maxArticlesAccept: number, selectionForm: Map<Tipo,Seleccion>, articles: RegularArticle[]) {
        if( articles.length > maxArticlesAccept)
            throw new Error('The number of items exceeds the maximum allowed');
        
        this.theme = theme;
        this.state =  state;
        this.maxArticlesAccept = maxArticlesAccept;
        this.selectionForm = selectionForm;
        this.articles = articles;
      }

    public getTheme(): string {
        return this.theme;
    }

    public getState(): string {
        return this.state;
    }

    public getMaxArticlesAccept(): number {
        return this.maxArticlesAccept;
    }

    public getSelectionForm(): Map<Tipo,Seleccion> {
        return this.selectionForm;
    }

    public addArticles(article: RegularArticle) {
        return this.articles.push(article);
    }
    
}

export enum Seleccion {
    TOP3,
    VALORMINIMO
}

export enum Tipo {
    REGULAR,
    POSTER
}
