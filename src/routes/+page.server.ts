import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";

export async function load({ fetch, url }: PageServerLoadEvent) {
  try {
    const page = url.searchParams.get('page');
    const fetchRSS = await fetch('https://djinni.co/jobs/rss/?primary_keyword=JavaScript');
    const RSSText = await fetchRSS.text();

    return {
      RSSText,
      page,
    }
  } catch (err) {
    error(400, 'Error while loading');
  }
}