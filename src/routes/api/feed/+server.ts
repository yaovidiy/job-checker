import { json } from '@sveltejs/kit';
import puppeteer, { type CookieParam } from 'puppeteer';
import { type jobItem } from '$lib/types';

export async function GET() {
  const cookie_sessionid: CookieParam = {
    name: 'sessionid',
    value: '.eJyVUl1P2zAU_StTHngZaex8OHEktCFAKysDWtENoUmWYzupIYkj20GqEP99dmgFfUHaQ25O7sdxfM95CZgae6u3QRmsnzSVvQiO9znCFBe-sFi5JO1VH5QvgeQuJWoucIoAYjROGROYZTxjCOAKg7rAE4kW1ArfHIM4CUEexvkdhGWalkk2KzKMcfYVgBIA11y3tDGO_fXVYa06N2VoS7UUxlUbZYkeW4fLmrZGHAdGNv04EKOYpC2ho924iVb2T4LL3k3sYah8LSbGun9xLT_y84WcP5zVeLyIu8tbnp6eXd8MgP-W1RV8vHOjB5wvQUXZk-j5B_od53srp5b61p52_oy_I0jj2scU-JiICcMJV1N8y8df_AuKt48ppj5maMLY70VqY8l_E_sN0MPBT48ZJLOjFmTUrWvfWDuYMoo6d1s6ayXj_YypLuKdiWRHGxGdpecgOV3O5-0FQQsxkvtlNGhVy1aEXJqhpdtho6wKzUa7rZECAP9EIIIZgrjASRJDUHwTJxDhzHkhBuDo-aQSlh7Zk3yhYwbnq9WvYVg93t4_2yz8OSdrZDdAcnn95_I2XMCHNVguA2-YSSsyGqHJZE6IMcRpcFB4l3EnGlNazHZZM9trO7vagZvTncYfODbUeJtlFCCKamf4HCMkqlzETORpUmOIipwKVBR5XYgYFEXBEGZJ4W6TM6cdpnnN4aHHyCRUqxrZk8-8NozO-MSMlWFaVl7VLVXPXG6_Nx2VrRdoIh4180XbkErZ4PUfZ5Y74A:1s2y4p:Rq02i9-ZV4laP6MIhFuzUzHbxvdFDWD_Y38L34vM2so',
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
  await page.goto('https://djinni.co/jobs/?primary_keyword=JavaScript', {
    waitUntil: 'networkidle2',
  });
  const pageData = await page.evaluate(() => {
    function calculateScore(job: jobItem) {
      let score = 0;
      const isRemote = job.additionalInfo.typeOfJob.toLowerCase().includes('remote') || job.additionalInfo.typeOfJob.toLowerCase().includes('віддалено')
      const isOffice = job.additionalInfo.typeOfJob.toLowerCase().includes('тільки офіс') || job.additionalInfo.typeOfJob.toLowerCase().includes('гібридна робота');
      const isReact = job.generalInfo.title.toLowerCase().includes('react');
      const isVue = job.generalInfo.title.toLowerCase().includes('vue');
      const isSvelte = job.generalInfo.title.toLowerCase().includes('svelte');
      const isMiddle = job.generalInfo.title.toLowerCase().includes('middle');
      const isSenior = job.generalInfo.title.toLowerCase().includes('senior');
      const isFrontEnd = job.generalInfo.title.toLowerCase().includes('front');
      const isFullStack = job.generalInfo.title.toLowerCase().includes('fullstack');
      const expNumber = job.additionalInfo.experience.match(/\d/);
      const isExperience = parseInt(expNumber ? expNumber[0] : '0') >= 3;
      const isAngular = job.generalInfo.title.toLowerCase().includes('angular');
      const isSalary = job.generalInfo?.pubSalary?.max ? parseInt(job.generalInfo.pubSalary.max) >= 3500 : false;

      score += isRemote ? 11 : 0;
      score += isReact ? 5 : 0;
      score += isVue ? 9 : 0;
      score += isSvelte ? 12 : 0;
      score += isMiddle ? 4 : 0;
      score += isSenior ? 11 : 0;
      score += isFrontEnd ? 11 : 0;
      score += isFullStack ? 4 : 0;
      score += isExperience ? 9 : 0;
      score += isSalary ? 9 : 0;

      score = isAngular ? 0 : score;
      score = isOffice ? 0 : score;
      return score;
    }
    const totalAmountEl = document.querySelector('header.page-header div h1 .text-muted') as HTMLElement;
    const jobsElements = document.querySelectorAll('.list-jobs .list-jobs__item');
    const jobsDataArray: jobItem[] = [];

    jobsElements.forEach(el => {
      const header = el.querySelector('header') as HTMLElement;
      const countsEl = el.querySelector('.job-list-item__counts') as HTMLElement;
      const countsEls = countsEl.querySelectorAll('[data-original-title]');
      const postDateEl = countsEls[0] as HTMLElement;
      const reviewsEl = countsEls[1] as HTMLElement;
      const appliesEl = countsEls[2] as HTMLElement;
      const infoEl = header.querySelector('.job-list-item__job-info') as HTMLElement;
      const locationEl = infoEl.querySelector('.location-text') as HTMLElement;
      const appliedEl = infoEl.querySelector('a.text-success');
      const infoNobrEls = infoEl.querySelectorAll('span.nobr');
      const typeOfJobEl = infoNobrEls.length === 4 ? infoNobrEls[1] as HTMLElement : infoNobrEls[0] as HTMLElement;
      const experienceEl = infoNobrEls.length === 4 ? infoNobrEls[2] as HTMLElement : infoNobrEls[1] as HTMLElement;
      const englishEl = infoEl.querySelector('span.nobr:last-child') as HTMLElement;
      const companyEl = header.querySelector('div.align-items-center > div > a.mr-2') as HTMLElement;
      const titleLink = el.querySelector('.job-list-item__title a.job-list-item__link') as HTMLAnchorElement;
      const descriptionElement = el.querySelector('.job-list-item__description span') as HTMLElement;
      const pubSalaryEl = el.querySelector('.public-salary-item') as HTMLElement;

      const generalInfo = {
        title: titleLink?.innerText,
        link: titleLink?.href,
        companyName: companyEl?.innerText,
        shortDescription: descriptionElement?.dataset?.truncatedText ?? '',
        description: descriptionElement?.dataset?.originalText ?? '',
        postDate: postDateEl?.dataset?.originalTitle ?? '',
        pubSalary: {
          min: pubSalaryEl?.innerText?.split('-')[0] ?? 0,
          max: pubSalaryEl?.innerText?.split('-')[1] ?? 0
        },
      }
      const reviewsReg = reviewsEl?.dataset?.originalTitle?.match(/\d*/);
      const appliesReg = appliesEl?.dataset?.originalTitle?.match(/\d*/);
      const analitics = {
        reviews: reviewsReg ? reviewsReg[0] : '',
        applies: appliesReg ? appliesReg[0] : '',
        isApplied: appliedEl !== null,
      }
      const additionalInfo = {
        location: locationEl?.innerText,
        typeOfJob: typeOfJobEl?.innerText,
        experience: experienceEl?.innerText,
        english: englishEl?.innerText,
      }

      const item: jobItem = {
        generalInfo,
        analitics,
        additionalInfo,
        score: 0
      }
      const score = calculateScore(item);
      item.score = score;

      jobsDataArray.push(item);
    })

    return {
      totalAmount: totalAmountEl.innerText,
      jobsDataArray,
    }
  });
  await browser.close();

  return json(pageData);
}