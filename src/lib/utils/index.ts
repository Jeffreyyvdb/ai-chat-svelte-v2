import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { logger } from './logger';

export { logger };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function nanoid() {
	return crypto.randomUUID();
}
