import {Conference} from '@app/conference'
import {
	dummyOrganizer,
	dummyOrganizer2,
	session,
	session2,
	article,
	article2
} from '@tests/dummies'

describe('test conferences case use', () => {
	test('Create a new conference and add Chair and Session correctly', () => {
		session.addArticle(article)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		conference.addChair(dummyOrganizer2)
		conference.addSession(session2)
		expect(2).toEqual(conference.getSessions().length)
		expect('Jane').toEqual(conference.getAuthors()[0].getName())
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
		expect(["Jane", "John", "Bob"]).toEqual(conference.getAuthors().map(author => author.getName()))
	})
})
