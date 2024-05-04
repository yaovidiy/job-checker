import puppeteer, { type CookieParam } from 'puppeteer';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const body = await request.json();
  const cookie_sessionid: CookieParam = {
    name: 'sessionid',
    value: env.SESSION_COOKIES_VALUE ?? '',
    domain: '.djinni.co',
    path: '/',
    expires: new Date('2025-05-03T17:38:44.000Z').getTime(),
    priority: 'Medium',
    httpOnly: true,
    secure: true,
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setCookie(cookie_sessionid);

  await page.goto(body.url, {
    waitUntil: 'networkidle2',
  });

  const vacancyData = await page.evaluate(() => {
    const aside = document.querySelector('aside') as HTMLElement;
    const asideLists = aside.querySelectorAll('ul');

    if (!asideLists.length) {
      return null;
    }

    const requrementsList = asideLists[0];
    const tagsList = asideLists[1];
    const infoList = asideLists[2];

    const isRequrementsNotMetEl = requrementsList.querySelector('.bi-x-circle');
    const mainTagEl = tagsList.querySelector('li:has(.bi-folder) div.col.pl-2') as HTMLElement;
    const tagsEl = tagsList.querySelector('li:has(.bi-tags) div.col.pl-2') as HTMLElement;
    const domainEl = infoList.querySelector('li:has(.bi-info-circle) div.col.pl-2') as HTMLElement;
    const jobLocTypeEl = infoList.querySelector('li:has(.bi-laptop) div.col.pl-2') as HTMLElement;
    const jobTypeEl = infoList.querySelector('li:has(.bi-briefcase) div.col.pl-2') as HTMLElement;
    const locationEl = infoList.querySelector('li:has(.bi-geo-alt) div.col.pl-2') as HTMLElement;

    return {
      canApply: isRequrementsNotMetEl === null,
      mainTag: mainTagEl?.innerText ?? '',
      tags: tagsEl?.innerText.split(',') ?? [],
      domain: domainEl?.innerText ?? '',
      jobLocType: jobLocTypeEl?.innerText ?? '',
      jobType: jobTypeEl?.innerText ?? '',
      location: locationEl?.innerText ?? '',
    }
  });

  const compareButton = await page.waitForSelector('text/Порівняти мій профіль ');
  await compareButton?.click();

  const expLevelEl = await page.waitForSelector('text/за досвідом');
  const expLevel = await page.evaluate(el => {
    return (el as HTMLElement).innerText;
  }, expLevelEl);
  const salaryLevelEl = await page.waitForSelector('text/зарплату, ніж ви.');
  const salaryLevel = await page.evaluate(el => {
    return (el as HTMLElement).innerText;
  }, salaryLevelEl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dialogData: any = {};
  try {
    const dialogButtonEl = await page.waitForSelector('text/Відкрити діалог', { timeout: 2000 });
    const dialogLink = await page.evaluate(el => {
      return (el as HTMLAnchorElement).href;
    }, dialogButtonEl);

    await page.goto(dialogLink, {
      waitUntil: 'networkidle2',
    });

    const dialogPageData = await page.evaluate(() => {
      const messageList = document.querySelector('.thread-messages-list');
      const messages = messageList?.querySelectorAll('div.thread-message');
      const lastMessage = messages ? messages[messages?.length - 1] : null;

      if (!lastMessage) {
        return null;
      }

      const threadMessageTop = lastMessage.querySelector('.thread-message--top') as HTMLElement;
      const messageReaded = threadMessageTop.querySelector('.bi-check2-all') as HTMLElement | null;
      const isYouLastWrooteEl = threadMessageTop.querySelector('div.col strong') as HTMLElement;
      const lastMessageDateEl = threadMessageTop.querySelector('small.text-secondary') as HTMLElement;
      const lastMessageDate = lastMessageDateEl?.innerText ?? '';
      const isYouLastWroote = isYouLastWrooteEl?.innerText ? isYouLastWrooteEl.innerText === 'Ви' : false;
      let readMessageData = 'Not readed';
      if (messageReaded) {
        readMessageData = messageReaded?.dataset?.originalTitle ?? '';
      }
      return { lastMessageDate, readMessageData, isYouLastWroote };
    });

    console.log(dialogPageData);
    dialogData = dialogPageData;
  } catch (err) {
    console.log(err);
  }

  await browser.close();

  return json({ vacancyData, expLevel, salaryLevel, dialogData });
}