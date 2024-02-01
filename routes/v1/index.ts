import express from 'express';

import email from './email';
const router = express.Router();

/**
 * @swagger
 * /notification-service/v1/health-check:
 *   get:
 *     summary: Basic health check endpoint
 *     description: Returns a 200 OK response to indicate the health of the API.
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health-check', function (req, res) {
  res.status(200).json({ message: 'healthy' });
});
router.use(`/emails`, email);
export default router;
