import { User } from "@app/user"

interface Session {}

export class Conference {
    organizers: User[]
    comitees: User[]
    authors: User[]
    sessions: Session[]

    constructor(organizers: User[], comitees: User[], authors: User[]) {
        this.organizers = organizers
        this.comitees = comitees
        this.authors = authors
        this.sessions = []
    }

    createSession(theme: string) {}
}

