import { chromium } from 'playwright';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { type vacancyData, type dialogPageData } from '$lib/types/index.js';

export async function POST({ request }) {
  const body = await request.json();
  const cookie_sessionid = {
    name: 'sessionid',
    value: env.SESSION_COOKIES_VALUE ?? '',
    domain: '.djinni.co',
    path: '/',
    expires: Math.round(new Date('2025-07-08T11:40:45.085Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies([cookie_sessionid]);
  const cookies = await context.cookies();
  console.log(cookies);
  const page = await browser.newPage();

  await page.goto(body.url, {
    waitUntil: 'networkidle',
  });

  const vacancyData: vacancyData = await page.evaluate(() => {
    const aside = document.querySelector('aside') as HTMLElement;
    const asideLists = aside.querySelectorAll('ul');

    if (!asideLists.length) {
      return null;
    }

    const requrementsList = asideLists[0];
    const tagsList = asideLists[1];
    const infoList = asideLists[2];

    const isRequrementsNotMetEl = requrementsList.querySelector('.bi-x-circle');
    const isSalaryLowerEl = requrementsList.querySelector('.bi-coin');
    const mainTagEl = tagsList.querySelector('li:has(.bi-folder) div.col.pl-2') as HTMLElement;
    const tagsEl = tagsList.querySelector('li:has(.bi-tags) div.col.pl-2') as HTMLElement;
    const domainEl = infoList.querySelector('li:has(.bi-info-circle) div.col.pl-2') as HTMLElement;
    const jobLocTypeEl = infoList.querySelector('li:has(.bi-laptop) div.col.pl-2') as HTMLElement;
    const jobTypeEl = infoList.querySelector('li:has(.bi-briefcase) div.col.pl-2') as HTMLElement;
    const locationEl = infoList.querySelector('li:has(.bi-geo-alt) div.col.pl-2') as HTMLElement;

    return {
      canApply: isRequrementsNotMetEl === null,
      lowerSalary: isSalaryLowerEl !== null,
      mainTag: mainTagEl?.innerText ?? '',
      tags: tagsEl?.innerText.split(',') ?? [],
      domain: domainEl?.innerText?.split(':')[1].trim() ?? '',
      jobLocType: jobLocTypeEl?.innerText ?? '',
      jobType: jobTypeEl?.innerText ?? '',
      location: locationEl?.innerText ?? '',
    }
  });
  let salaryLevel = '';
  let expLevel = '';

  try {
    const compareButton = await page.waitForSelector('text/Порівняти мій профіль ', { timeout: 1000 });
    await compareButton?.click();


    const expLevelEl = await page.waitForSelector('text/за досвід', { timeout: 1000 });
    expLevel = await page.evaluate(el => {
      return (el as HTMLElement).innerText;
    }, expLevelEl);
    const salaryLevelEl = await page.waitForSelector('text/зарплату, ніж ви.', { timeout: 1000 });
    salaryLevel = await page.evaluate(el => {
      return (el as HTMLElement).innerText;
    }, salaryLevelEl)
  } catch (err) {
    // await page.screenshot({
    //   path: './static/djinni/error.png',
    //   fullPage: true,
    // });
  }

  let companyDouLink: string | null = null;
  let dialogData: dialogPageData = null;
  try {
    const dialogButtonEl = await page.waitForSelector('text/Відкрити діалог', { timeout: 1000 });
    const dialogLink = await page.evaluate(el => {
      return (el as HTMLAnchorElement).href;
    }, dialogButtonEl);

    await page.goto(dialogLink, {
      waitUntil: 'networkidle',
    });

    const dialogPageData: dialogPageData = await page.evaluate(() => {
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

    dialogData = dialogPageData;
    try {
      const companyDouWebSiteEl = await page.waitForSelector('text/jobs.dou.ua', { timeout: 1000 });
      const companyDouUrl = await page.evaluate(el => {
        return (el as HTMLAnchorElement | null)?.innerText ?? null
      }, companyDouWebSiteEl)

      companyDouLink = companyDouUrl;
    } catch (err) {
      // silent fail
    }

    return json({ vacancyData, expLevel, salaryLevel, dialogData, companyDouLink });
  } catch (err) {
    try {
      const companyDjinniWebSiteEl = await page.waitForSelector('.job-details--title', { timeout: 1000 });
      await companyDjinniWebSiteEl?.click();
      await page.waitForEvent('domcontentloaded');

      const companyDouWebSiteEl = await page.waitForSelector('text/jobs.dou.ua', { timeout: 1000 })
      const companyDouUrl = await page.evaluate(el => {
        return (el as HTMLAnchorElement | null)?.innerText ?? null
      }, companyDouWebSiteEl)

      companyDouLink = companyDouUrl;
    } catch (err) {
      // silent fail
    }
    return json({ vacancyData, expLevel, salaryLevel, dialogData, companyDouLink });
  } finally {
    await browser.close();
  }
}