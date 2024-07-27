// import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio'; // Add this line
import { type jobItem } from '$lib/types';

export async function GET({ url }) {
  const pagination = url.searchParams.get('page') ?? 1;

  const response = await gotScraping({
    url: `https://djinni.co/jobs/?primary_keyword=JavaScript&page=${pagination}`,
    headerGeneratorOptions: {
      browsers: [{ name: 'firefox', minVersion: 80 }],
      devices: ["desktop"],
      locales: ["en-US", "en"],
      operatingSystems: ["linux"],
    }
  });

  const html = response.body;
  const $ = cheerio.load(html);

  const totalAmount = $('header.page-header div h1 .text-muted').text();
  const jobsElements = $('.list-jobs .list-jobs__item').toArray();
  const jobsDataArray: jobItem[] = [];

  jobsElements.forEach((job) => {
    const header = $(job).find('header');
    const countsEl = $(job).find('.job-list-item__counts');
    const countsEls = countsEl.find('[data-original-title]');
    const postDateEl = countsEls.eq(0);
    const reviewsEl = countsEls.eq(1);
    const appliesEl = countsEls.eq(2);
    const infoEl = header.find('.job-list-item__job-info');
    const locationEl = infoEl.find('.location-text');
    const appliedEl = infoEl.find('a.text-success');
    const infoNobrEls = infoEl.find('span.nobr');
    const typeOfJobEl = infoNobrEls.length === 4 ? infoNobrEls.eq(1) : infoNobrEls.eq(0);
    const experienceEl = infoNobrEls.length === 4 ? infoNobrEls.eq(2) : infoNobrEls.eq(1);
    const englishEl = infoEl.find('span.nobr:last-child');
    const companyEl = header.find('div.align-items-center > div > a.mr-2');
    const titleLink = $(job).find('.job-list-item__title a.job-list-item__link');
    const descriptionElement = $(job).find('.job-list-item__description');
    const shortDescEl = descriptionElement.find('.js-truncated-text');
    const descEl = descriptionElement.find('.js-original-text');
    const pubSalaryEl = $(job).find('.public-salary-item');

    const generalInfo = {
      title: titleLink?.text(),
      link: titleLink?.attr('href') ?? '',
      companyName: companyEl?.text(),
      shortDescription: shortDescEl.text() || 'No short description found',
      description: descEl?.html() || 'No full description found',
      postDate: postDateEl?.attr('data-original-title') || '',
      pubSalary: {
        min: pubSalaryEl?.text()?.split('-')[0] || '0',
        max: pubSalaryEl?.text()?.split('-')[1] || '0'
      },
    }

    const reviewsReg = ($(reviewsEl).data('original-title') as string)?.match(/\d*/);
    const appliesReg = ($(appliesEl).data('original-title') as string)?.match(/\d*/);
    const exp = $(experienceEl).text().match(/\d/);

    const analitics = {
      reviews: reviewsReg ? reviewsReg[0] : '',
      applies: appliesReg ? appliesReg[0] : '',
      isApplied: appliedEl !== null,
    }

    const additionalInfo = {
      location: $(locationEl).text(),
      typeOfJob: $(typeOfJobEl).text(),
      experience: exp ? exp[0] : 'Not found',
      english: $(englishEl).text(),
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
  });

  return json({ jobsDataArray, totalAmount });
}


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
  const isReactNative = job.generalInfo.title.toLowerCase().includes('react native')
  const expNumber = job.additionalInfo.experience.match(/\d/);
  const isExperience = parseInt(expNumber ? expNumber[0] : '0') >= 3;
  const isAngular = job.generalInfo.title.toLowerCase().includes('angular');
  const isSalary = job.generalInfo?.pubSalary?.max ? parseInt(job.generalInfo.pubSalary.max) >= 3500 : false;
  const isSalaryLess = job.generalInfo?.pubSalary?.max ? parseInt(job.generalInfo.pubSalary.max) <= 3000 : false;

  score += isRemote ? 15 : 0;
  score += isReact ? 9 : 0;
  score += isVue ? 10 : 0;
  score += isSvelte ? 12 : 0;
  score += isMiddle ? 10 : 0;
  score += isSenior ? 14 : 0;
  score += isFrontEnd ? 15 : 0;
  score += isFullStack ? 9 : 0;
  score += isExperience ? 12 : 0;
  score += isSalary ? 14 : 0;

  score = isAngular ? 0 : score;
  score = isOffice ? 0 : score;
  score = isReactNative ? 0 : score;
  score = isSalaryLess ? 0 : score;
  return score;
}
