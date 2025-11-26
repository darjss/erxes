import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IProjectMember } from '../@types/member';

const router: Router = Router();

// router.post('/blockAddProjectMembers', async (req, res) => {
//   const { models } = res.locals as IContext;;

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

router.post(
  '/blockUpdateProjectMember',
  async (req: IRequest<IProjectMember, { role: string }>, res: IResponse) => {
    const { models } = res.locals as IContext;

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
  },
);

router.post(
  '/blockDeleteProjectMember',
  async (req: IRequest<IProjectMember>, res: IResponse) => {
    const { models } = res.locals as IContext;

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
  },
);

export { router };
