/**
 * @swagger
 * /notification-service/v1/emails:
 *   post:
 *     summary: Send email(s) to user(s)
 *     tags:
 *       - Email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Email data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receivers:
 *                 type: array
 *                 items:
 *                   type: string
 *               templateName:
 *                 type: string
 *               subject:
 *                 type: string
 *               details:
 *                 type: object
 *             example:
 *               receivers: [ "user1@example.com", "user2@example.com" ]
 *               templateName: "welcome_email"
 *               subject: "Welcome to our platform"
 *               details:
 *                 name: "John Doe"
 *                 age: 25
 *     responses:
 *       200:
 *         description: Email request received
 *       500:
 *         description: Failed to register send email request
 */

/**
 * @swagger
 * /notification-service/v1/emails/:
 *   get:
 *     summary: Get all emails sent to a specific user in paginated manner
 *     tags:
 *       - Email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *       - name: email
 *         in: query
 *         description: User email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Failed to fetch emails
 */

import express from 'express';
const router = express.Router();
import { EmailController } from '../../controllers/emailController';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import ParameterStoreConfig from '../../resources/config/parameterStore.config';
import emailValidator from '../../validations/custom/email.validator';

const parameterStoreValue = ParameterStoreConfig.parameterStoreValue;
router.post(
  '/',
  [AuthMiddleware.auth(parameterStoreValue.JWT_SYSTEM_ROLE)],
  emailValidator.sendEmail,
  EmailController.sendEmail,
); // Send email(s) to user(s)

router.get(
  '/',
  [AuthMiddleware.auth(parameterStoreValue.JWT_USER_ROLE)],
  emailValidator.getEmails,
  EmailController.getEmails,
); // Get all emails sent to users in paginated manner

export default router;
