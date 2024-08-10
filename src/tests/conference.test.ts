import {Conference} from '@app/conference'
import {RegularSession, Session} from '@app/session'
import {
	dummyOrganizer,
	dummyOrganizer2,
	dummyAuthor1,
	dummyArticle,
	dummyArticle2,
	defaultDeadlineTomorrow
} from '@tests/dummies'

describe('Test conferences use cases', () => {
	test('Conference sessions should match those added at first', () => {
		const session = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		const session2 = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		session.addArticle(dummyArticle)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		conference.addChair(dummyOrganizer2)
		conference.addSession(session2)
		expect(2).toEqual(conference.getSessions().length)
		expect('Pedro').toEqual(conference.getAuthors()[0].getName())
	})

	test('Get authors should match those added', () => {
		const session = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		const session2 = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		session.addArticle(dummyArticle)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		conference.addChair(dummyOrganizer2)
		session2.addArticle(dummyArticle2)
		conference.addSession(session2)
		expect(2).toEqual(conference.getSessions().length)
		expect(['Pedro', 'John', 'Bob']).toEqual(
			conference.getAuthors().map((author) => author.getName())
		)
	})

	test('An exception is expected when creating a new conference with a user that does not have the ORGANIZER role', () => {
		const session = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		session.addArticle(dummyArticle)
		const sessions = [session]
		const chairs = [dummyAuthor1]
		expect(() => {
			new Conference(chairs, sessions)
		}).toThrow(new Error('All chairs must to be organizers'))
	})

	test('An exception is expected when adding a new organizer other that does not have the ORGANIZER role', () => {
		const session = new RegularSession('Test', 2, defaultDeadlineTomorrow)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		expect(() => {
			conference.addChair(dummyAuthor1)
		}).toThrow(new Error('The user must to be organizer'))
	})
})
