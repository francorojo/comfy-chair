export class User {
    private name: string;
    private membership: string;
    private email: string;
    private password: string;
    private rol: Rol;

    public constructor(name: string, membership: string, email: string, password: string, rol: Rol) {
        if( password.length < 8)
            throw new Error('This value is required and must to be greater 8 caracters');
        this.name = name;
        this.membership =  membership;
        this.email = email;
        this.password = password;
        this.rol = rol;
      }

    public getName(): string {
        return this.name;
    }

    public getMembership(): string {
        return this.membership;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRol(): Rol {
        return this.rol;
    }

    public serRol(rol: Rol): Rol {
        return this.rol=rol;
    }
    
}

export enum Rol {
    ORGANIZER,
    REVIEWER,
    AUTHOR
}