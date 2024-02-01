import { Router } from 'express';

import v1 from './v1/';
import config from '../resources/config';
const router = Router();
router.use(`${config.baseUrl}/v1`, v1);

export default router;
