const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();


import { Request, Response, NextFunction } from 'express'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import Event from '../models/event.model'
import Session from '../models/session.model'
import Ticket from '../models/ticket.model'
import Order from '../models/order.model'
import Place from '../models/place.model'
import User from '../models/user.model';


const orders = {};
const {
  MerchantID,
  HASHKEY,
  HASHIV,
  Version,
  PayGateWay,
  NotifyUrl,
  ReturnUrl,
} = process.env;
const RespondType = 'JSON';

const newebpayController = {
  // 組金流需要的json給前端用form表單submit
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {

      const { orderId } = req.body;
      const object = await Order.findById(orderId);
      if (object == null) {
        return handleError(res, createError(400, '找不到這張訂單!'))
      }
      console.log(object);


      const user = await User.findById(orderId.userId);
      var email = 'test@gmail.com';
      if (user != null) {
        email = user.email;
      }


      // 使用 Unix Timestamp 作為訂單編號（金流也需要加入時間戳記）
      const TimeStamp: Number = Math.round(new Date().getTime() / 1000);
      const data = {
        aesEncrypt: '',
        shaEncrypt: '',
        Email: email,
        Amt: object.price,
        ItemDesc: object.ticketName,
        TimeStamp,
        MerchantOrderNo: TimeStamp,
      };
      console.log(object);

      const order = {
        ...data,
      };

      // 進行訂單加密
      // 加密第一段字串，此段主要是提供交易內容給予藍新金流
      const aesEncrypt = createSesEncrypt(order);
      console.log('aesEncrypt:', aesEncrypt);

      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = createShaEncrypt(aesEncrypt);
      console.log('shaEncrypt:', shaEncrypt);
      order.aesEncrypt = aesEncrypt;
      order.shaEncrypt = shaEncrypt;

      const result = {
        "MerchantID": MerchantID,
        "TradeSha": order.shaEncrypt,
        "TradeInfo": order.aesEncrypt,
        "TimeStamp": TimeStamp,
        "Version": Version,
        "NotifyUrl": NotifyUrl,
        "ReturnUrl": ReturnUrl + '&orderId=' + orderId,
        "MerchantOrderNo": order.MerchantOrderNo,
        "Amt": order.Amt,
        "ItemDesc": order.ItemDesc,
        "Email": order.Email,
        "PayGateWay": PayGateWay
      }

      //@@修改訂單先藏這裡@@
      await Order.findByIdAndUpdate(
        orderId,
        {
          MerchantOrderNo: order.MerchantOrderNo,
          orderStatus: 1
        });
        
      handleSuccess(res, result, 'success')

    } catch (err) {
      return next(err)
    }
  },

  // 交易成功：Return （可直接解密，將資料呈現在畫面上）
  async newebpayReturn(req: Request, res: Response, next: NextFunction) {

    const data = await Order.find().sort({createdAt: -1 });

    var orderId = null;
    if(data!=null){
      if(data.length>0){
        var order = data[0]._id;
        orderId = order._id;
      }
    }

    var url = 'https://tickets-go-fe.vercel.app/purchase?step=4' + '&orderId=' +data[0]._id;

    // console.log('req.body return data', req.body);
    res.redirect(url);
    // res.render('http://tickets-go-fe.vercel.app', { title: 'test_pay' });
  },

  // 確認交易：Notify
  async newebpayNotify(req: Request, res: Response, next: NextFunction) {

    console.log('req.body notify data', req.body);
    const response = req.body;

    // 解密交易內容
    const data = createSesDecrypt(response.TradeInfo);
    console.log('data:', data);

    // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
    console.log(data?.Result?.MerchantOrderNo);

    //select order
    const object = await Order.findOne({ MerchantOrderNo: data?.Result?.MerchantOrderNo });
    if (object == null) {
      return handleError(res, createError(400, '找不到這張訂單!'))
    }

    // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
    const thisShaEncrypt = createShaEncrypt(response.TradeInfo);
    if (!thisShaEncrypt === response.TradeSha) {
      console.log('付款失敗：TradeSha 不一致');
      return res.end();
    }

    // 交易完成，將成功資訊儲存於資料庫
    console.log('付款完成，訂單：', data?.Result?.MerchantOrderNo);
    //update order status
    await Order.findOneAndUpdate(
      { MerchantOrderNo: data?.Result?.MerchantOrderNo },
      { orderStatus: 1 }
    );

    return res.end();
  }
}

// 對應文件 P17：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
function createSesEncrypt(order: any) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(order), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// 對應文件 P18：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
function createShaEncrypt(aesEncrypt: any) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 對應文件 21, 22 頁：將 aes 解密
function createSesDecrypt(TradeInfo: any) {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}

// 字串組合
function genDataChain(order: any) {
  return `MerchantID=${MerchantID}&TimeStamp=${order.TimeStamp
    }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${order.MerchantOrderNo
    }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
      NotifyUrl || 'otherURL',
    )}&ReturnURL=${encodeURIComponent(ReturnUrl || 'otherURL')}&ItemDesc=${encodeURIComponent(
      order.ItemDesc,
    )}&Email=${encodeURIComponent(order.Email)}`;
}

export default newebpayController;
