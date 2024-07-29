import { User, Rol } from "../app/User";

describe('test user case use', () => {
  
    test('Create a new author user correctly', () => {
        const user = new User("Jane", "UTN-FRBA", "jane@utn.frba.edu.ar", "test-2024-UTN", Rol.AUTHOR);
        expect("Jane").toEqual(user.getName());
        expect("UTN-FRBA").toEqual(user.getMembership());
        expect("jane@utn.frba.edu.ar").toEqual(user.getEmail());
        expect("test-2024-UTN").toEqual(user.getPassword());
        expect(Rol.AUTHOR).toEqual(user.getRol());
    });

    test('Create a new organizer user correctly', () => {
        const user = new User("Jane", "UTN-FRBA", "jane@utn.frba.edu.ar", "test-2024-UTN", Rol.ORGANIZER);
        expect("Jane").toEqual(user.getName());
        expect("UTN-FRBA").toEqual(user.getMembership());
        expect("jane@utn.frba.edu.ar").toEqual(user.getEmail());
        expect("test-2024-UTN").toEqual(user.getPassword());
        expect(Rol.ORGANIZER).toEqual(user.getRol());
    });
    
    test('Create a new reviewer user correctly', () => {
        const user = new User("Jane", "UTN-FRBA", "jane@utn.frba.edu.ar", "test-2024-UTN", Rol.REVIEWER);
        expect("Jane").toEqual(user.getName());
        expect("UTN-FRBA").toEqual(user.getMembership());
        expect("jane@utn.frba.edu.ar").toEqual(user.getEmail());
        expect("test-2024-UTN").toEqual(user.getPassword());
        expect(Rol.REVIEWER).toEqual(user.getRol());
    });

    test('Create a new author user with a shor password', () => {
        expect( () => {new User("Jane", "UTN-FRBA", "jane@utn.frba.edu.ar", "test", Rol.REVIEWER)} ).toThrow(new Error("This value is required and must to be greater 8 caracters"));
    });


  });