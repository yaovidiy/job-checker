import puppeteer from 'puppeteer';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const body = await request.json();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(body.url);

  await browser.close();

  return json(true);
}