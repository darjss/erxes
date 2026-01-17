import { Router, Request, Response } from 'express';
import * as formidable from 'formidable';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { getSubdomain, getEnv } from 'erxes-api-shared/utils';
import { contextMiddleware } from '~/middlewares/contextMiddleware';
import { validationMiddleware } from '~/middlewares/validationMiddleware';
import {
  isSlaveMode,
  getOneFitInstanceId,
  getOneFitSecret,
} from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { filterXSS } from 'xss';
// import { modifierMiddleware } from '~/middlewares/modifierMiddleware';

const router: Router = Router();

router.use('/webhook', [validationMiddleware, contextMiddleware], []);

const DOMAIN = getEnv({ name: 'DOMAIN' });

const isValidPath = (filepath: string): boolean => {
  const resolved = path.resolve(filepath);
  const tempDir = path.resolve(os.tmpdir());
  return resolved.startsWith(tempDir);
};

router.post('/upload-file', async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  const maxHeight = Number(req.query.maxHeight) || 0;
  const maxWidth = Number(req.query.maxWidth) || 0;
  const kind = (req.query.kind as string) || 'main';

  const form = new formidable.IncomingForm({
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (error, _fields, files) => {
    if (error) {
      return res
        .status(400)
        .send(`File upload parsing error: ${error.message}`);
    }

    const uploaded = files.file || files.upload;
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file?.filepath || !isValidPath(file.filepath)) {
      return res.status(400).send('Invalid or unsafe file path');
    }

    const mimetype = file?.mimetype;

    if (!mimetype) {
      return res
        .status(400)
        .send('One or more files have unrecognized MIME type');
    }

    try {
      // If in slave mode, forward to master
      if (isSlaveMode()) {
        try {
          const masterClient = getMasterClient();
          const instanceId = getOneFitInstanceId();
          const onefitSecret = getOneFitSecret();

          // Build headers for master request
          const headers: Record<string, string> = {};
          if (subdomain) {
            headers['x-subdomain'] = subdomain;
          }
          if (instanceId) {
            headers['x-onefit-instance-id'] = instanceId;
          }
          if (req.headers.authorization) {
            headers['authorization'] = req.headers.authorization as string;
          }
          if (onefitSecret) {
            headers['cookie'] = `auth-token=${onefitSecret}`;
          }
          if (req.headers.cookie) {
            const existingCookies = headers['cookie'] || '';
            headers['cookie'] = existingCookies
              ? `${existingCookies}; ${req.headers.cookie}`
              : (req.headers.cookie as string);
          }

          // Upload to master
          const result = await masterClient.uploadFile(
            {
              filePath: file.filepath,
              fileName:
                file.originalFilename || file.originalFilename || 'file',
              mimetype: file.mimetype || mimetype,
              maxHeight: maxHeight || undefined,
              maxWidth: maxWidth || undefined,
              kind,
            },
            headers,
          );

          return res.send(result);
        } catch (masterError: any) {
          console.error('Master upload error:', masterError);
          return res
            .status(500)
            .send(
              filterXSS(
                `Failed to upload file to master: ${masterError.message}`,
              ),
            );
        }
      }

      // Master mode: forward to core-api upload endpoint
      const domain = DOMAIN.replace('<subdomain>', subdomain);
      const coreUploadUrl = `${domain}/gateway/pl:core/upload-file`;

      const queryParams = new URLSearchParams();
      if (kind) {
        queryParams.append('kind', kind);
      }
      if (maxHeight) {
        queryParams.append('maxHeight', maxHeight.toString());
      }
      if (maxWidth) {
        queryParams.append('maxWidth', maxWidth.toString());
      }

      const uploadUrl = `${coreUploadUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      // Forward file to core-api
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.filepath), {
        filename: file.originalFilename || 'file',
        contentType: mimetype,
      });

      const headers: Record<string, string> = {
        ...formData.getHeaders(),
      };

      // Forward relevant headers
      if (req.headers.authorization) {
        headers['authorization'] = req.headers.authorization as string;
      }
      if (req.headers.cookie) {
        headers['cookie'] = req.headers.cookie as string;
      }
      if (subdomain) {
        headers['x-subdomain'] = subdomain;
      }
      if (req.headers.source) {
        headers['source'] = req.headers.source as string;
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .send(
            filterXSS(
              `Core API upload failed: ${response.status} ${response.statusText} - ${errorText}`,
            ),
          );
      }

      const result = await response.text();
      return res.send(result);
    } catch (e: any) {
      console.error('Upload error:', e);
      return res.status(500).send(filterXSS(e.message || 'Upload failed'));
    }
  });
});

export { router };
