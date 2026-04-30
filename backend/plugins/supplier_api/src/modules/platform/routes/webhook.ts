import { Router, Request, Response } from 'express';
import { generateModels } from '~/connectionResolvers';
import { SubmissionPlatform } from '@/platform/@types/submission';
import { SUBMISSION_PLATFORMS } from '@/platform/db/definitions/submission';
import { SUPPLIER_VERIFICATION_STATUS } from '~/constants';

const router: Router = Router();

// Routes are mounted at /webhook/:platform/...
// e.g. POST /webhook/mushop/submission
//      POST /webhook/blockadmin/submission

router.post('/:platform/submission', async (req: Request, res: Response) => {
  try {
    const platform = req.params.platform as SubmissionPlatform;

    if (!SUBMISSION_PLATFORMS.ALL.includes(platform)) {
      return res.status(400).json({ error: `Unknown platform: ${platform}` });
    }

    const { subdomain, payload } = req.body || {};
    const { entityId, data } = payload || {};
    const { status, note } = data || {};

    if (!subdomain)
      return res.status(400).json({ error: 'subdomain is required' });
    if (!entityId)
      return res.status(400).json({ error: 'payload.entityId is required' });
    if (!status)
      return res.status(400).json({ error: 'payload.data.status is required' });

    const models = await generateModels(subdomain);
    await models.Submission.receiveDecision(platform, entityId, status, note);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/:platform/product', async (req: Request, res: Response) => {
  try {
    const platform = req.params.platform as SubmissionPlatform;

    if (!SUBMISSION_PLATFORMS.ALL.includes(platform)) {
      return res.status(400).json({ error: `Unknown platform: ${platform}` });
    }

    const { subdomain, payload } = req.body || {};
    const { entityId, data } = payload || {};
    const { action } = data || {};

    if (!subdomain)
      return res.status(400).json({ error: 'subdomain is required' });
    if (!entityId)
      return res.status(400).json({ error: 'payload.entityId is required' });
    if (!action)
      return res.status(400).json({ error: 'payload.data.action is required' });

    const models = await generateModels(subdomain);
    await models.Submission.receiveProductUpdate(entityId, action);

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/:platform/supplier', async (req: Request, res: Response) => {
  try {
    const platform = req.params.platform as SubmissionPlatform;

    console.log('platform', platform)

    if (!SUBMISSION_PLATFORMS.ALL.includes(platform)) {
      return res.status(400).json({ error: `Unknown platform: ${platform}` });
    }

    const { subdomain, payload } = req.body || {};
    const { entityId, data } = payload || {};
    const { verificationStatus, note } = data || {};

    console.log('payload', JSON.stringify(payload))

    if (!subdomain)
      return res.status(400).json({ error: 'subdomain is required' });
    if (!entityId)
      return res.status(400).json({ error: 'payload.entityId is required' });
    if (!verificationStatus)
      return res
        .status(400)
        .json({ error: 'payload.data.verificationStatus is required' });
    if (!SUPPLIER_VERIFICATION_STATUS.ALL.includes(verificationStatus)) {
      return res
        .status(400)
        .json({ error: `Invalid verificationStatus: ${verificationStatus}` });
    }

    const models = await generateModels(subdomain);
    await models.Supplier.updateVerificationStatus(
      entityId,
      verificationStatus,
      note,
    );

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

export { router };
