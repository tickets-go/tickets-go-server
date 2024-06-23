import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors';

import Tag from '../models/tag.model'

const tagController = {
  // get all tags
  async getAllTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await Tag.find()
      handleSuccess(res, tags, '標籤讀取成功')
    } catch (err) {
      return next(err)
    }
  },

  // get tag by id
  async getTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const tag = await Tag.findById(id)

      if (!tag) {
        return handleError(res, createError(404, '標籤不存在'))
      }
      handleSuccess(res, tag, 'success')
    } catch (err) {
      return next(err)
    }
  },

  // create tag
  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { tagName, tagStatus } = req.body
      if (!tagName) {
        return handleError(res, createError(400, '請輸入標籤名稱'))
      }

      const newTag = await Tag.create({ tagName, tagStatus})
      handleSuccess(res, newTag, '標籤新增成功')
    } catch (err) { 
      return next(err)
    }
  },

  // update tag
  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { tagName, tagStatus } = req.body

      const updatedTag = await Tag.findByIdAndUpdate(id, 
        { tagName, tagStatus, updatedAt: Date.now() },
        { new: true }
      )

      if (!updatedTag) {
        return handleError(res, createError(404, '標籤不存在'))
      }

      handleSuccess(res, updatedTag, '標籤更新成功')
    } catch (err) {
      return next(err)
    }
  },

  // delete tag by id
  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const deletedTag = await Tag.findByIdAndDelete(id)

      if (!deletedTag) {
        return handleError(res, createError(404, '標籤不存在'))
      }

      handleSuccess(res, deletedTag, '標籤刪除成功')
    } catch (err) {
      return next(err)
    }
  }
}

export default tagController