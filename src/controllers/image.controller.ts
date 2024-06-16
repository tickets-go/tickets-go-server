import { Request, Response, NextFunction } from 'express'
import tinify from 'tinify'

import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'

import firebaseAdmin from '../connections/firebase'

tinify.key = process.env.TINYPNG_API_KEY || ''
const bucket = firebaseAdmin.storage().bucket()

const USER_DIR = process.env.FIREBASE_STORAGE_USER_Path || 'users'
const EVENT_DIR = process.env.FIREBASE_STORAGE_EVENT_Path || 'events'

// upload image to firebase
const uploadImage = async (req: Request, res: Response, next: NextFunction, pathPrefix: string) => {
  try {
    const file = req.file
    if (!file) {
      return handleError(res, createError(400, '請上傳圖片'))
    }

    tinify.fromBuffer(file.buffer).toBuffer((err, resultData) => {
      if (err) {
        return handleError(res, err)
      }

      const blob = bucket.file(`${pathPrefix}/${file.originalname}`)
      const blobStream = blob.createWriteStream({
        metadata: {
          // 設定文件的 MIME 類型
          contentType: file.mimetype,
        },
      })
  
      blobStream.on('error', (err) => {
        return handleError(res, err)
      })
  
      blobStream.on('finish', () => {
        const config = {
          action: 'read',
          expires: '03-01-2500',
        }
  
        blob.getSignedUrl(config as any, (err, imgUrl) => {
          if (err) {
            return handleError(res, err)
          }
          handleSuccess(res, { imgUrl }, '上傳圖片成功')
        })
      })
  
      blobStream.end(resultData)
    })
  } catch (err) {
    return next(err)
  }
}

  // get all image urls from firebase by path
  const getImageUrlsByPath = async (req: Request, res: Response, next: NextFunction, dirPath: string) => {
    try {
      const [files] = await bucket.getFiles({ prefix: dirPath });

      if (files.length === 0) {
        return handleError(res, createError(404, '無此路徑相關圖片檔案'));
      }

      const config = {
        action: 'read',
        expires: '03-01-2500',
      };

      const urlPromises = files.map(file => file.getSignedUrl(config as any));
      const urls = await Promise.all(urlPromises);

      const imgUrls = urls.map(url => url[0]); // getSignedUrl returns an array with the URL as the first element

      if (dirPath.includes(EVENT_DIR)) {
        const eventId = dirPath.split('/')[1];

        return handleSuccess(res, {eventId, imgUrls }, '取得圖片網址成功');
      } else if (dirPath.includes(USER_DIR)) {
        const userId = dirPath.split('/')[1];
        
        return handleSuccess(res, {userId, imgUrls }, '取得圖片網址成功');
      }

    } catch (err) {
      return next(err);
    }
  }

const imageController = {

  // event image upload
  async eventImageUpload(req: Request, res: Response, next: NextFunction) {
    const eventId = req.params.eventId
    await uploadImage(req, res, next, `${EVENT_DIR}/${eventId}`)
  },

  // user image upload
  async userImageUpload(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId
    await uploadImage(req, res, next, `${USER_DIR}/${userId}`)
  },

  // image delete
  async imageDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { imgUrl } = req.body
      if (!imgUrl) {
        return handleError(res, createError(400, '請提供圖片網址'))
      }

       // 提取相對路徑
      const url = new URL(imgUrl);
      const pathname = decodeURIComponent(url.pathname);
      const relativePath = pathname.split('/').slice(2).join('/');

      const file = bucket.file(relativePath);

      file.delete()
        .then(() => {
          handleSuccess(res, {}, '刪除圖片成功');
        })
        .catch((err) => {
          return handleError(res, err);
        });

    } catch (err) {
      return next(err)
    }
  },

  // get all image urls from firebase by path of eventId
  async getAllImageUrlsByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.eventId;
      await getImageUrlsByPath(req, res, next, `${EVENT_DIR}/${eventId}`);
    } catch (err) {
      return next(err);
    }
  },

    // get all image urls from firebase by path of userId
    async getAllImageUrlsByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = req.params.userId;
        await getImageUrlsByPath(req, res, next, `${USER_DIR}/${userId}`);
      } catch (err) {
        return next(err);
      }
    },
}

export default imageController
