// Vite-resolved URLs for event imagery. Source: 2nite design system bundle.
import lalaParty from './event-lala-party.png';
import night2 from './event-night-2.jpg';
import night3 from './event-night-3.png';
import search from './event-search.png';
import card1 from './event-card-1.jpg';
import square1 from './event-square-1.jpg';
import portrait1 from './event-portrait-1.png';
import hero1 from './event-hero-1.jpg';
import cityBucuresti from './city-bucuresti.jpg';
import logo from './logo.png';

export const ASSETS = {
  lalaParty,
  night2,
  night3,
  search,
  card1,
  card2: card1, // event-card-2 missing from bundle; fall back to card1
  square1,
  portrait1,
  hero1,
  cityBucuresti,
  logo,
};
