// import { Inter, Lusitana } from 'next/font/google';

// export const inter = Inter({ subsets: ['latin'] });

// export const lusitana = Lusitana({
//   weight: ['400', '700'],
//   subsets: ['latin'],
// });

import { Inter, Lusitana } from 'next/font/google';

// Configure Inter font with all weights and subsets
export const inter = Inter({
  subsets: ['latin'], // Specify the subsets you need
  display: 'swap', // Ensure text is visible while the font is loading
  variable: '--font-inter', // Optional: Define a CSS variable for the font
});

// Configure Lusitana font with specific weights and subsets
export const lusitana = Lusitana({
  subsets: ['latin'], // Specify the subsets you need
  weight: ['400', '700'], // Specify the required weights
  display: 'swap', // Ensure text is visible while the font is loading
  variable: '--font-lusitana', // Optional: Define a CSS variable for the font
});
