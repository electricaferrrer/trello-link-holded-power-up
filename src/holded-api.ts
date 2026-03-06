import type { HoldedContact, HoldedProject } from './types';

const PROXY_BASE = 'https://holded-proxy.mferrer.workers.dev';

async function fetchHolded<T>(apiKey: string, url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { 'X-Holded-Key': apiKey },
  });
  if (!response.ok) {
    throw new Error(`Holded API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function searchContacts(apiKey: string, query: string): Promise<HoldedContact[]> {
  const contacts = await fetchHolded<HoldedContact[]>(apiKey, `${PROXY_BASE}/api/invoicing/v1/contacts`);
  if (!query) return contacts;
  const q = query.toLowerCase();
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.vatnumber && c.vatnumber.toLowerCase().includes(q))
  );
}

export async function getProjects(apiKey: string): Promise<HoldedProject[]> {
  return fetchHolded<HoldedProject[]>(apiKey, `${PROXY_BASE}/api/projects/v1/projects`);
}
