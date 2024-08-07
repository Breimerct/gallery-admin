import { Request } from 'express';
import { rootPath } from '@/constants';

export const editFileName = (
    request: Request,
    file: Express.Multer.File,
    callback: (message: Error, fileName: string) => void,
) => {
    callback(null, `${Date.now()}.webp`);
}

export const getUrlImg = (protocol: string, host: string, fileName: string) => {
    const fullUrl = [
        `${protocol}://`,
        host,
        `/api/v1/gallery/img/`,
        fileName
    ];

    return fullUrl.join('');
};

export const getRootPath = (fileName: string) => {
    const _rootPath = `${rootPath}/${fileName}`;

    return _rootPath;
};