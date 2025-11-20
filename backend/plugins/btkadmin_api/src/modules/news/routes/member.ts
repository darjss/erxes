import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/btkAddNewsMembers', async (req, res) => {
  const models = await generateModels();

  // try {
  //   const { subdomain, args } = req.body || {};

  //   const { news, memberIds } = args || {};

  //   models.NewsMember.addNewsMember(
  //     memberIds.map((memberId) => ({
  //       memberId,
  //       news,
  //       role: 'member',
  //     })),
  //   );

  //   return res.status(200).json({
  //     success: true,
  //   });
  // } catch (error) {
  //   return res.status(400).json({
  //     error: error.message,
  //   });
  // }
});

router.post('/btkUpdateNewsMember', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { role } = data || {};

    models.NewsMember.updateNewsMember(subdomain, entityId, role);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post('/btkDeleteNewsMember', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId } = payload || {};

    models.NewsMember.deleteNewsMember(subdomain, entityId);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

export { router };
