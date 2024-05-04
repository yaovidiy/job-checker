import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";

export async function load({ url }: PageServerLoadEvent) {
  try {
    const page = url.searchParams.get('page');

    return {
      page,
    }
  } catch (err) {
    error(400, 'Error while loading');
  }
}