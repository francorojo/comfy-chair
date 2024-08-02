import {SessionType, SessionSelection} from '@app/session'
import {Rol, User} from '@app/user'

// USER DUMMIES

export const dummyOrganizer = new User(
	'Jane',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.ORGANIZER
)

export const dummyAuthor1 = new User(
	'Jane',
	'UTN-FRBA',
	'jane@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

export const dummyAuthor2 = new User(
	'John',
	'UTN-FRBA',
	'john@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

export const dummyAuthor3 = new User(
	'Bob',
	'UTN-FRBA',
	'bob@utn.frba.edu.ar',
	'test-2024-UTN',
	Rol.AUTHOR
)

export const dummyBidder1 = dummyAuthor1

export const dummyBidder2 = dummyAuthor2

// FORM SELECTION DUMMIES

export const dummyTop3SelectionForm = new Map<SessionType, SessionSelection>([
	[SessionType.REGULAR, SessionSelection.TOP3]
])
