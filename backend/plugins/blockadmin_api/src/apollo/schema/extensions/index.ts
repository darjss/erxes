import { developer as developerExtension } from './developer';
import { project as projectExtension } from './project';

export const TypeExtensions = `
    enum BlockAdminDeveloperVerificationStatus {
        verified
        unverified
        pending
    }

    enum BlockAdminDeveloperVerificationStatusEnum {
        verified
        unverified
    }

    ${projectExtension}
    ${developerExtension}
`;
