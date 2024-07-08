import { Router } from 'express'
import newebpayController from '../controllers/newebpay.controller'
import { handleErrorAsync } from '../service/handleErrorAsync'


const router = Router();
// checkout
router.post('/checkout', handleErrorAsync(newebpayController.checkout));

// return
router.post('/newebpay_return', handleErrorAsync(newebpayController.newebpayReturn));

// notify
router.post('/newebpay_notify', handleErrorAsync(newebpayController.newebpayNotify));




export default router
