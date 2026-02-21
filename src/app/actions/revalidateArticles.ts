'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Invalidates the articles cache. Call after admin creates/updates/deletes articles.
 */
export async function revalidateArticles(): Promise<void> {
    revalidateTag('articles');
    revalidatePath('/articles', 'layout'); // invalidates /articles and /articles/[slug]
}
