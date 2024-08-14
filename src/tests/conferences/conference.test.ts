import {Conference} from '@app/conference'
import {RegularSession, Session} from '@app/session'
import {
	dummyOrganizer,
	dummyOrganizer2,
	dummyAuthor1,
	dummyArticle,
	dummyArticle2,
	defaultDeadlineTomorrow,
	top3SelectionDummy,
	dummyBidder2,
	dummyBidder3,
	dummyBidder1,
	dummyBidder4
} from '@tests/utils/dummies'
import {generateRegularArticle} from '../utils/articleGenerator'

describe('Test conferences use cases', () => {
	test('Conference sessions should match those added to the conference', () => {
		const session1 = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const session2 = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session1.addArticle(dummyArticle)

		const sessions: Session[] = []
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)

		conference.addChair(dummyOrganizer2)
		conference.addSession(session1)
		conference.addSession(session2)

		expect(conference.getSessions().length).toEqual(2)
		expect(conference.getAuthors()).toEqual(dummyArticle.getAuthors())
	})

	test('Get authors should match those added', () => {
		const session1 = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const session2 = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session1.addArticle(dummyArticle)
		const sessions = [session1]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)

		conference.addChair(dummyOrganizer2)
		session2.addArticle(dummyArticle2)
		conference.addSession(session2)

		expect(conference.getSessions().length).toEqual(2)
		expect(conference.getAuthors()).toEqual(
			[dummyArticle, dummyArticle2].flatMap((article) =>
				article.getAuthors()
			)
		)
	})

	test('An exception is expected when creating a new conference with a chair that does not have the ORGANIZER role', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		session.addArticle(dummyArticle)
		const sessions = [session]
		const chairs = [dummyAuthor1]
		expect(() => {
			new Conference(chairs, sessions)
		}).toThrow(new Error('All chairs must be organizers'))
	})

	test('An exception is expected when adding a new chair that does not have the ORGANIZER role', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)
		expect(() => {
			conference.addChair(dummyAuthor1)
		}).toThrow(new Error('The user must be organizer'))
	})

	test('Get reviewers from a conference should return all articles reviewers', () => {
		const session = new RegularSession(
			'Test',
			2,
			top3SelectionDummy,
			defaultDeadlineTomorrow
		)
		const sessions = [session]
		const chairs = [dummyOrganizer]
		const conference = new Conference(chairs, sessions)

		const article1 = generateRegularArticle()
		const article2 = generateRegularArticle()
		session.addArticle(article1)
		session.addArticle(article2)
		session.startBidding()
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		const user4 = dummyBidder4

		//Bids article 1
		session.bid(user1, article1, 'INTERESTED')
		session.bid(user2, article1, 'NOT INTERESTED')
		session.bid(user3, article1, 'NONE')
		session.bid(user4, article1, 'MAYBE')

		//Bids article 2
		session.bid(user1, article2, 'INTERESTED')
		session.bid(user2, article2, 'NOT INTERESTED')
		session.bid(user3, article2, 'NONE')
		session.bid(user4, article2, 'MAYBE')

		session.startReviewAndAssignment()
		const reviewers = conference.getReviewers()
		expect(reviewers).toContain(user1)
		expect(reviewers).toContain(user4)
		expect(reviewers).toContain(user3)
		expect(reviewers).not.toContain(user2)
	})
})
