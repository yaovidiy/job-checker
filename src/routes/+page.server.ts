import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";

export async function load({ fetch }: PageServerLoadEvent) {
  try {
    const fetchRSS = await fetch('https://djinni.co/jobs/rss/?primary_keyword=JavaScript');
    const RSSText = await fetchRSS.text();

    return {
      RSSText
    }
  } catch (err) {
    error(400, 'Error while loading');
  }
}