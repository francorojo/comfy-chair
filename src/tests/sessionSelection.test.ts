import {Article} from '@app/article'
import {Review} from '@app/review'
import {TopN, MinimumValue} from '@app/sessionSelection'
import {User} from '@app/user'
import {generateRegularArticle} from './articleGenerator'
import {dummyBidder1, dummyBidder2, dummyBidder3} from './dummies'

describe('test sessionSelection case use', () => {
	test('Create a new sessionSelection TopN and validate the selection', () => {
		const sessionSelectionTop3 = new TopN(3)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		let articlesReviews: Map<Article, Map<User, Review>> = new Map()

		//Add article1 reviews -> Best article -> 1
		const article1 = generateRegularArticle()
		let reviewsArticle1: Map<User, Review> = new Map()
		reviewsArticle1.set(user1, new Review(3, 'Excelent'))
		reviewsArticle1.set(user2, new Review(3, 'Excelent'))
		reviewsArticle1.set(user3, new Review(3, 'Excelent'))

		//Add article2 reviews -> Worst article -> 3
		const article2 = generateRegularArticle()
		let reviewsArticle2: Map<User, Review> = new Map()
		reviewsArticle2.set(user1, new Review(-3, 'Bad'))
		reviewsArticle2.set(user2, new Review(-3, 'Bad'))
		reviewsArticle2.set(user3, new Review(-3, 'Bad'))

		//Add article3 reviews -> Normal article -> 2
		const article3 = generateRegularArticle()
		let reviewsArticle3: Map<User, Review> = new Map()
		reviewsArticle3.set(user1, new Review(0, 'Normal'))
		reviewsArticle3.set(user2, new Review(0, 'Normal'))
		reviewsArticle3.set(user3, new Review(0, 'Normal'))

		articlesReviews.set(article1, reviewsArticle1) //1
		articlesReviews.set(article3, reviewsArticle3) //3
		articlesReviews.set(article2, reviewsArticle2) //2

		expect([article1, article3, article2]).toEqual(
			sessionSelectionTop3.selection(articlesReviews)
		)
	})

	test('Create a new sessionSelection MinimiumValue and validate the selection', () => {
		const sessionSelectionTop3 = new MinimumValue(0)
		const user1 = dummyBidder1
		const user2 = dummyBidder2
		const user3 = dummyBidder3
		let articlesReviews: Map<Article, Map<User, Review>> = new Map()

		//Add article1 reviews -> Best article
		const article1 = generateRegularArticle()
		let reviewsArticle1: Map<User, Review> = new Map()
		reviewsArticle1.set(user1, new Review(3, 'Excelent'))
		reviewsArticle1.set(user2, new Review(3, 'Excelent'))
		reviewsArticle1.set(user3, new Review(3, 'Excelent'))

		//Add article2 reviews -> Worst article -> 3
		const article2 = generateRegularArticle()
		let reviewsArticle2: Map<User, Review> = new Map()
		reviewsArticle2.set(user1, new Review(-3, 'Bad'))
		reviewsArticle2.set(user2, new Review(-3, 'Bad'))
		reviewsArticle2.set(user3, new Review(-3, 'Bad'))

		//Add article3 reviews -> Normal article -> 2
		const article3 = generateRegularArticle()
		let reviewsArticle3: Map<User, Review> = new Map()
		reviewsArticle3.set(user1, new Review(0, 'Normal'))
		reviewsArticle3.set(user2, new Review(0, 'Normal'))
		reviewsArticle3.set(user3, new Review(0, 'Normal'))

		articlesReviews.set(article1, reviewsArticle1)
		articlesReviews.set(article3, reviewsArticle3) //Out
		articlesReviews.set(article2, reviewsArticle2)

		expect([article1, article3]).toEqual(
			sessionSelectionTop3.selection(articlesReviews)
		)
	})
})
