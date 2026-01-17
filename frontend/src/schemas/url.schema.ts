import { z } from 'zod';

export const urlSchema = z.object({
    originalUrl: z.string().min(1, 'URL is required').url('Please enter a valid URL (must start with http:// or https://)'),
});

export type UrlFormValues = z.infer<typeof urlSchema>;
