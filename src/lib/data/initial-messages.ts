import type { Message } from '@ai-sdk/svelte';

export const initialMessages: Message[] = [
	{
		id: 'tBWGC71aIl2KBwAz',
		content: 'Which cities have with most SaaS unicorns',
		role: 'user',
		createdAt: new Date('2024-11-22T16:14:18.818Z')
	},
	{
		id: 'AHATaXrQHPabRv6M',
		role: 'assistant',
		content: '',
		createdAt: new Date('2024-11-22T16:14:19.564Z'),
		toolInvocations: [
			{
				state: 'result',
				toolCallId: 'call_hL7MQj01YHUytC13kX9pV83m',
				toolName: 'databaseTool',
				args: {
					question: 'Which cities have the most SaaS unicorns?'
				},
				result: {
					question: 'Which cities have the most SaaS unicorns?',
					query:
						"SELECT LOWER(city) AS city, COUNT(*) AS unicorn_count FROM unicorns WHERE LOWER(industry) ILIKE LOWER('%enterprise tech%') GROUP BY LOWER(city) ORDER BY unicorn_count DESC;",
					data: [
						{
							city: 'san francisco',
							unicorn_count: '88'
						},
						{
							city: 'new york',
							unicorn_count: '39'
						},
						{
							city: 'beijing',
							unicorn_count: '15'
						},
						{
							city: 'palo alto',
							unicorn_count: '14'
						},
						{
							city: 'london',
							unicorn_count: '11'
						},
						{
							city: 'tel aviv',
							unicorn_count: '10'
						},
						{
							city: 'boston',
							unicorn_count: '10'
						},
						{
							city: 'mountain view',
							unicorn_count: '8'
						},
						{
							city: 'sunnyvale',
							unicorn_count: '6'
						},
						{
							city: 'chicago',
							unicorn_count: '6'
						},
						{
							city: 'paris',
							unicorn_count: '6'
						},
						{
							city: 'redwood city',
							unicorn_count: '6'
						},
						{
							city: 'toronto',
							unicorn_count: '6'
						},
						{
							city: 'shanghai',
							unicorn_count: '6'
						},
						{
							city: 'san mateo',
							unicorn_count: '5'
						},
						{
							city: 'santa clara',
							unicorn_count: '5'
						},
						{
							city: 'bengaluru',
							unicorn_count: '5'
						},
						{
							city: 'seattle',
							unicorn_count: '5'
						},
						{
							city: 'san jose',
							unicorn_count: '5'
						},
						{
							city: 'austin',
							unicorn_count: '4'
						},
						{
							city: 'san diego',
							unicorn_count: '4'
						},
						{
							city: 'amsterdam',
							unicorn_count: '4'
						},
						{
							city: 'oakland',
							unicorn_count: '4'
						},
						{
							city: 'los altos',
							unicorn_count: '3'
						},
						{
							city: 'atlanta',
							unicorn_count: '3'
						},
						{
							city: 'munich',
							unicorn_count: '3'
						},
						{
							city: 'hangzhou',
							unicorn_count: '3'
						},
						{
							city: 'bellevue',
							unicorn_count: '3'
						},
						{
							city: 'seoul',
							unicorn_count: '2'
						},
						{
							city: 'scottsdale',
							unicorn_count: '2'
						},
						{
							city: 'mumbai',
							unicorn_count: '2'
						},
						{
							city: 'tokyo',
							unicorn_count: '2'
						},
						{
							city: 'santa barbara',
							unicorn_count: '2'
						},
						{
							city: 'hoboken',
							unicorn_count: '2'
						},
						{
							city: 'sacramento',
							unicorn_count: '2'
						},
						{
							city: 'guangzhou',
							unicorn_count: '2'
						},
						{
							city: 'dallas',
							unicorn_count: '2'
						},
						{
							city: 'burlingame',
							unicorn_count: '2'
						},
						{
							city: 'barcelona',
							unicorn_count: '2'
						},
						{
							city: 'waterloo',
							unicorn_count: '2'
						},
						{
							city: 'kirkland',
							unicorn_count: '2'
						},
						{
							city: 'dublin',
							unicorn_count: '2'
						},
						{
							city: 'cambridge',
							unicorn_count: '2'
						},
						{
							city: 'los angeles',
							unicorn_count: '2'
						},
						{
							city: 'orlando',
							unicorn_count: '1'
						},
						{
							city: 'oslo',
							unicorn_count: '1'
						},
						{
							city: 'petah tikva',
							unicorn_count: '1'
						},
						{
							city: 'philadelphia',
							unicorn_count: '1'
						},
						{
							city: 'plantation',
							unicorn_count: '1'
						},
						{
							city: 'pleasanton',
							unicorn_count: '1'
						},
						{
							city: 'portland',
							unicorn_count: '1'
						},
						{
							city: 'portola valley',
							unicorn_count: '1'
						},
						{
							city: 'prilly',
							unicorn_count: '1'
						},
						{
							city: 'princeton',
							unicorn_count: '1'
						},
						{
							city: "ra'anana",
							unicorn_count: '1'
						},
						{
							city: 'raleigh',
							unicorn_count: '1'
						},
						{
							city: 'ramat gan',
							unicorn_count: '1'
						},
						{
							city: 'richmond',
							unicorn_count: '1'
						},
						{
							city: 'roseland',
							unicorn_count: '1'
						},
						{
							city: 'roubaix',
							unicorn_count: '1'
						},
						{
							city: 'san fransisco',
							unicorn_count: '1'
						},
						{
							city: 'santiago',
							unicorn_count: '1'
						},
						{
							city: 'sao paulo',
							unicorn_count: '1'
						},
						{
							city: 'shenzhen',
							unicorn_count: '1'
						},
						{
							city: 'south jordan',
							unicorn_count: '1'
						},
						{
							city: 'stanford',
							unicorn_count: '1'
						},
						{
							city: 'surry hills',
							unicorn_count: '1'
						},
						{
							city: 'sydney',
							unicorn_count: '1'
						},
						{
							city: 'tallinn',
							unicorn_count: '1'
						},
						{
							city: 'tampa',
							unicorn_count: '1'
						},
						{
							city: 'vaduz',
							unicorn_count: '1'
						},
						{
							city: 'vancouver',
							unicorn_count: '1'
						},
						{
							city: 'vilnius',
							unicorn_count: '1'
						},
						{
							city: 'vodnjan',
							unicorn_count: '1'
						},
						{
							city: 'waltham',
							unicorn_count: '1'
						},
						{
							city: 'washington dc',
							unicorn_count: '1'
						},
						{
							city: 'wilmington',
							unicorn_count: '1'
						},
						{
							city: 'wuxi',
							unicorn_count: '1'
						},
						{
							city: 'zurich',
							unicorn_count: '1'
						},
						{
							city: 'abu dhabi',
							unicorn_count: '1'
						},
						{
							city: null,
							unicorn_count: '1'
						},
						{
							city: 'altrincham',
							unicorn_count: '1'
						},
						{
							city: 'ambler',
							unicorn_count: '1'
						},
						{
							city: 'athens',
							unicorn_count: '1'
						},
						{
							city: 'berkeley',
							unicorn_count: '1'
						},
						{
							city: 'berkeley heights',
							unicorn_count: '1'
						},
						{
							city: 'berlin',
							unicorn_count: '1'
						},
						{
							city: 'boise',
							unicorn_count: '1'
						},
						{
							city: 'brisbane',
							unicorn_count: '1'
						},
						{
							city: 'brookline',
							unicorn_count: '1'
						},
						{
							city: 'brussels',
							unicorn_count: '1'
						},
						{
							city: 'burnaby',
							unicorn_count: '1'
						},
						{
							city: 'campbell',
							unicorn_count: '1'
						},
						{
							city: 'chemnitz',
							unicorn_count: '1'
						},
						{
							city: 'chongqing',
							unicorn_count: '1'
						},
						{
							city: 'cologne',
							unicorn_count: '1'
						},
						{
							city: 'colorado springs',
							unicorn_count: '1'
						},
						{
							city: 'copenhagen',
							unicorn_count: '1'
						},
						{
							city: 'covina',
							unicorn_count: '1'
						},
						{
							city: 'dc',
							unicorn_count: '1'
						},
						{
							city: 'denver',
							unicorn_count: '1'
						},
						{
							city: 'eden prairie',
							unicorn_count: '1'
						},
						{
							city: 'ellicott city',
							unicorn_count: '1'
						},
						{
							city: 'geneva',
							unicorn_count: '1'
						},
						{
							city: 'grand cayman',
							unicorn_count: '1'
						},
						{
							city: 'greenwood village',
							unicorn_count: '1'
						},
						{
							city: 'haidian',
							unicorn_count: '1'
						},
						{
							city: 'hamilton',
							unicorn_count: '1'
						},
						{
							city: 'helsinki',
							unicorn_count: '1'
						},
						{
							city: 'herndon',
							unicorn_count: '1'
						},
						{
							city: 'hyderabad',
							unicorn_count: '1'
						},
						{
							city: 'independence',
							unicorn_count: '1'
						},
						{
							city: 'istanbul',
							unicorn_count: '1'
						},
						{
							city: 'lehi',
							unicorn_count: '1'
						},
						{
							city: 'louisville',
							unicorn_count: '1'
						},
						{
							city: 'louvain-la-neuve',
							unicorn_count: '1'
						},
						{
							city: 'madrid',
							unicorn_count: '1'
						},
						{
							city: 'menlo park',
							unicorn_count: '1'
						},
						{
							city: 'miami',
							unicorn_count: '1'
						},
						{
							city: 'montpellier',
							unicorn_count: '1'
						},
						{
							city: 'morrisville',
							unicorn_count: '1'
						},
						{
							city: 'munchen',
							unicorn_count: '1'
						},
						{
							city: 'netanya',
							unicorn_count: '1'
						},
						{
							city: 'northbrook',
							unicorn_count: '1'
						}
					]
				}
			}
		]
	},
	{
		id: 'l0FCM3eafvIZKK6a',
		role: 'assistant',
		content:
			'The cities with the most SaaS unicorns are:\n\n1. **San Francisco** - 88 unicorns\n2. **New York** - 39 unicorns\n3. **Beijing** - 15 unicorns\n4. **Palo Alto** - 14 unicorns\n5. **London** - 11 unicorns\n6. **Tel Aviv** - 10 unicorns\n7. **Boston** - 10 unicorns\n8. **Mountain View** - 8 unicorns\n9. **Sunnyvale** - 6 unicorns\n10. **Chicago** - 6 unicorns\n\nThese cities are leading in the number of SaaS unicorns, with San Francisco being the top city by a significant margin.',
		createdAt: new Date('2024-11-22T16:14:21.071Z')
	},
	{
		id: 'l0FCM3eafvIZKK6a',
		role: 'assistant',
		content:
			'# Markdown Examples\n\n' +
			'## Table Example\n' +
			'| Framework | Language | Stars |\n' +
			'|-----------|----------|-------|\n' +
			'| SvelteKit | TypeScript | ⭐️⭐️⭐️⭐️⭐️ |\n' +
			'| Next.js | JavaScript | ⭐️⭐️⭐️⭐️ |\n' +
			'| Nuxt | Vue | ⭐️⭐️⭐️ |\n\n' +
			'## Code Block Example\n' +
			'```typescript\n' +
			'interface User {\n' +
			'  id: string;\n' +
			'  name: string;\n' +
			'  email: string;\n' +
			'}\n' +
			'```\n\n' +
			'## Other Markdown Features\n' +
			'> This is a blockquote with some *italic* and **bold** text\n\n' +
			'- List item with `inline code`\n' +
			'- Item with a [link](https://example.com)\n' +
			'- Item with ~~strikethrough~~\n\n' +
			'---\n' +
			'<kbd>Ctrl</kbd> + <kbd>C</kbd> to copy',
		createdAt: new Date('2024-11-22T16:14:21.071Z')
	}
];
