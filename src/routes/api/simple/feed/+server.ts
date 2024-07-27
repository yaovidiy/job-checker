import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export async function POST({ url }) {
  return json({ url, env: env.DOU_SESSION_COOKIES }); 
}