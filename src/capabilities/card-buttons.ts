import type { TrelloContext } from '../types';

const CONTACT_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%2342526e'%3E%3Cpath d='M384 48c8.8 0 16 7.2 16 16l0 384c0 8.8-7.2 16-16 16L96 464c-8.8 0-16-7.2-16-16L80 64c0-8.8 7.2-16 16-16l288 0zM96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM240 248a56 56 0 1 0 0-112 56 56 0 1 0 0 112zm-32 40c-44.2 0-80 35.8-80 80 0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16 0-44.2-35.8-80-80-80l-64 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z'/%3E%3C/svg%3E";

const PROJECT_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='%2342526e'%3E%3Cpath d='M384 80c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16L64 176c-8.8 0-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16l320 0zM64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l8 0 0 96c0 48.6 39.4 88 88 88l32 0 0 8c0 35.3 28.7 64 64 64l128 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64l-128 0c-35.3 0-64 28.7-64 64l0 8-32 0c-22.1 0-40-17.9-40-40l0-96 264 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zM384 336c8.8 0 16 7.2 16 16l0 64c0 8.8-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16l128 0z'/%3E%3C/svg%3E";

export function getCardButtons(t: unknown, icon: string) {
  return [
    {
      icon: CONTACT_ICON,
      text: 'Vincular cliente',
      callback: (ctx: TrelloContext) => {
        ctx.popup({
          title: 'Buscar cliente en Holded',
          url: './src/popups/search-contact.html',
          height: 400,
        });
      },
    },
    {
      icon: PROJECT_ICON,
      text: 'Vincular proyecto',
      callback: (ctx: TrelloContext) => {
        ctx.popup({
          title: 'Buscar proyecto en Holded',
          url: './src/popups/search-project.html',
          height: 400,
        });
      },
    },
  ];
}
