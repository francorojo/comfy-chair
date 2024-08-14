import {User, Rol} from '@app/user'

describe('test user case use', () => {
	test('Create a new author user correctly', () => {
		const user = new User(
			'Jane',
			'UTN-FRBA',
			'jane@utn.frba.edu.ar',
			'test-2024-UTN',
			Rol.AUTHOR
		)
		expect(user.getName()).toEqual('Jane')
		expect(user.getMembership()).toEqual('UTN-FRBA')
		expect(user.getEmail()).toEqual('jane@utn.frba.edu.ar')
		expect(user.getPassword()).toEqual('test-2024-UTN')
		expect(user.getRol()).toEqual(Rol.AUTHOR)
	})

	test('Create a new organizer user correctly', () => {
		const user = new User(
			'Jane',
			'UTN-FRBA',
			'jane@utn.frba.edu.ar',
			'test-2024-UTN',
			Rol.ORGANIZER
		)
		expect(user.getName()).toEqual('Jane')
		expect(user.getMembership()).toEqual('UTN-FRBA')
		expect(user.getEmail()).toEqual('jane@utn.frba.edu.ar')
		expect(user.getPassword()).toEqual('test-2024-UTN')
		expect(user.getRol()).toEqual(Rol.ORGANIZER)
	})

	test('Create a new reviewer user correctly', () => {
		const user = new User(
			'Jane',
			'UTN-FRBA',
			'jane@utn.frba.edu.ar',
			'test-2024-UTN',
			Rol.REVIEWER
		)
		expect(user.getName()).toEqual('Jane')
		expect(user.getMembership()).toEqual('UTN-FRBA')
		expect(user.getEmail()).toEqual('jane@utn.frba.edu.ar')
		expect(user.getPassword()).toEqual('test-2024-UTN')
		expect(user.getRol()).toEqual(Rol.REVIEWER)
	})

	test('Create a new author user with a short password', () => {
		expect(() => {
			new User(
				'Jane',
				'UTN-FRBA',
				'jane@utn.frba.edu.ar',
				'test',
				Rol.REVIEWER
			)
		}).toThrow(
			new Error('This value is required and must be greater 8 characters')
		)
	})
})
