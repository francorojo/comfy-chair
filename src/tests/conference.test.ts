import {Conference} from '@app/conference'
import {
	dummyOrganizer,
	dummyOrganizer2,
	dummyAuthor1,
	session,
	session2,
	article,
	article2
} from '@tests/dummies'

describe('Test conferences use cases', () => {
	test('Create a new conference and add Chair and Session correctly', () => {
		session.addArticle(article)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		conference.addChair(dummyOrganizer2)
		conference.addSession(session2)
		expect(2).toEqual(conference.getSessions().length)
		expect('Pedro').toEqual(conference.getAuthors()[0].getName())
	})

	test('Get authors from a conference', () => {
		session.addArticle(article)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		conference.addChair(dummyOrganizer2)
		session2.addArticle(article2)
		conference.addSession(session2)
		expect(2).toEqual(conference.getSessions().length)
		expect(['Pedro', 'John', 'Bob']).toEqual(
			conference.getAuthors().map((author) => author.getName())
		)
	})

	test('Create a new conference with a user not organizer', () => {
		session.addArticle(article)
		const sessions = [session]
		const chairs = [dummyAuthor1]
		expect(() => {
			new Conference(chairs, sessions)
		}).toThrow(new Error('All chairs must to be organizers'))
	})

	test('Create a new conference and add user not organizer', () => {
		session.addArticle(article)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		expect(() => {
			conference.addChair(dummyAuthor1)
		}).toThrow(new Error('The user must to be organizer'))
	})
})
