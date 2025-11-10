import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

// router.post('/blockAddProjectMembers', async (req, res) => {
//   const models = await generateModels();

//   try {
//     const { subdomain, args } = req.body || {};

//     const { project, memberIds } = args || {};

//     models.ProjectMember.addProjectMember(
//       memberIds.map((memberId) => ({
//         memberId,
//         project,
//         role: 'member',
//       })),
//     );

//     return res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       error: error.message,
//     });
//   }
// });

router.post('/blockUpdateProjectMember', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { role } = data || {};

    models.ProjectMember.updateProjectMember(subdomain, entityId, role);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post('/blockDeleteProjectMember', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId } = payload || {};

    models.ProjectMember.deleteProjectMember(subdomain, entityId);

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
