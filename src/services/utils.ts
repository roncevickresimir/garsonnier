import { default as urlMetadata } from 'url-metadata';

export const getUrlMetaData = async (
    url: string
): Promise<{ title: string; image: string }> => {
    const metadata = await urlMetadata(url, {
        includeResponseBody: false,
    });

    return {
        title: metadata['og:title'] as string,
        image: metadata['og:image'] as string,
    };
};
