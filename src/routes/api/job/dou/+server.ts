import puppeteer, { type CookieParam } from 'puppeteer';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const body = await request.json();
  const cookie_sessionid: CookieParam = {
    name: 'sessionid',
    value: env.DOU_SESSION_COOKIES ?? '',
    domain: '.dou.ua',
    path: '/',
    expires: new Date('2024-10-27T21:27:25.088Z').getTime(),
    priority: 'Medium',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  }


  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setCookie(cookie_sessionid);

  try {
    await page.setViewport({ width: 1440, height: 1024 })
    await page.goto(`${body.url}/reviews/`);
    await page.waitForSelector('text/404', { timeout: 1000 });

    return json(null);
  } catch (err) {
    const reviewsData = await page.evaluate(() => {
      const lastComment = document.querySelector('#commentsList .b-comment') as HTMLElement;
      const authorEl = lastComment.querySelector('.b-post-author a.avatar') as HTMLAnchorElement;
      const timeEl = lastComment.querySelector('.b-post-author a.comment-link') as HTMLAnchorElement;
      const commentEl = lastComment.querySelector('.comment .l-text.b-typo') as HTMLElement;
      const totalCommentsEl = document.querySelector('#lblCommentsCount') as HTMLElement;

      return {
        lastComment: {
          author: {
            name: authorEl?.innerText ?? 'No name el',
            link: authorEl?.href ?? 'No link el'
          },
          comment: commentEl?.innerHTML ?? 'No comment el',
          time: timeEl?.innerText ?? 'No time el'
        },
        totalComments: +totalCommentsEl?.innerText?.split(' ')[0]
      }
    });

    await page.screenshot({
      path: './static/dou/reviews.png'
    });

    await page.goto(`${body.url}/vacancies/`);

    await page.screenshot({
      path: './static/dou/vacancies.png'
    });

    try {
      await page.waitForSelector('text/Немає вакансій', { timeout: 1000 });

      return json({ reviewsData, vacanciesdData: null })
    } catch (err) {
      const vacanciesdData = await page.evaluate(() => {
        const totalVacancieEl = document.querySelector('.b-inner-page-header h1') as HTMLElement;
        const compantScoreWidgetEl = document.querySelector('.b-company-poll-widget > h3.g-h3') as HTMLElement;
        const vacanciesElList = document.querySelectorAll('li.l-vacancy');

        const vacanciesDataList: { date: string; title: string; link: string; location: string; shortDesc: string; }[] = [];

        vacanciesElList.forEach(listItem => {
          const dateEl = listItem.querySelector('.date') as HTMLElement;
          const titleContainer = listItem.querySelector('.title') as HTMLElement;
          const titleEl = titleContainer.querySelector('a.vt') as HTMLAnchorElement;
          const cityEl = titleContainer.querySelector('.cities') as HTMLElement;
          const descEl = listItem.querySelector('.sh-info') as HTMLElement;

          const vacanciesData: { date: string; title: string; link: string; location: string; shortDesc: string; } = {
            date: dateEl?.innerText ?? '',
            title: titleEl?.innerText ?? '',
            link: titleEl?.href ?? '',
            location: cityEl?.innerText ?? '',
            shortDesc: descEl?.innerHTML ?? ''
          }

          vacanciesDataList.push(vacanciesData);
        });

        return {
          vacancies: {
            totalVacancies: +totalVacancieEl?.innerText?.split(' ')[0],
            vacanciesDataList
          },
          companyScore: compantScoreWidgetEl?.innerText?.split(':')[1].trim() ?? 'No score El',
        }
      });

      return json({ reviewsData, vacanciesdData });
    }
  } finally {
    await browser.close();
  }
}