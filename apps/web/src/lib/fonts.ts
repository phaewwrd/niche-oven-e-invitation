import { Playfair_Display, Cormorant_Garamond, Great_Vibes, Montserrat, Lora } from 'next/font/google';

export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
export const cormorant = Cormorant_Garamond({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-cormorant' });
export const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' });
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
export const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const fontVariables = `${playfair.variable} ${cormorant.variable} ${greatVibes.variable} ${montserrat.variable} ${lora.variable}`;
