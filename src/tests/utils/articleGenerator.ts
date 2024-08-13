import {Poster, RegularArticle} from '@app/article'
import {dummyAuthor1, dummyAuthor2, dummyAuthor3} from './dummies'

const abstracts = [
	' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci metus, dignissim',
	'Sed vel orci id ex scelerisque tincidunt. Donec et libero vel massa finibus interdum.',
	'Vestibulum non est vel lectus posuere consectetur. Nulla facilisi.',
	'Proin gravida urna vel nisi tincidunt, vel fringilla ligula consectetur.',
	'Ut in ipsum vel velit faucibus ultricies.',
	'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae'
]

const titles = [
	'Sample Article 1',
	'Sample Article 2',
	'Sample Article 3',
	'Sample Article 4',
	'Sample Article 5',
	'Sample Article 6'
]

const authors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]

const notificationAuthors = [dummyAuthor1, dummyAuthor2, dummyAuthor3]

const fileURLs = [
	'https://example.com/sample-article1.pdf',
	'https://example.com/sample-article2.pdf',
	'https://example.com/sample-article3.pdf',
	'https://example.com/sample-article4.pdf',
	'https://example.com/sample-article5.pdf',
	'https://example.com/sample-article6.pdf'
]

export function generateRegularArticle(): RegularArticle {
	return new RegularArticle(
		abstracts[Math.floor(Math.random() * abstracts.length)],
		titles[Math.floor(Math.random() * titles.length)],
		authors,
		notificationAuthors[
			Math.floor(Math.random() * notificationAuthors.length)
		],
		fileURLs[Math.floor(Math.random() * fileURLs.length)]
	)
}

export function generatePoster(): Poster {
	return new Poster(
		'Sample Poster Title',
		authors,
		notificationAuthors[
			Math.floor(Math.random() * notificationAuthors.length)
		],
		'https://example.com/sample-poster.pdf',
		'https://example.com/sample-poster.pdf'
	)
}
