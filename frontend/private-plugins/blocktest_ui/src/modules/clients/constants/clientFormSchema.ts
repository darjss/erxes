import { z } from 'zod';

export const clientFormSchema = z.object({
  bor_file: z.string().optional(),
  business_category: z.string().optional(),
  business_type: z.string().optional(),
  claim_history_file: z.string().optional(),
  client_type: z.string().optional(),
  contacts: z.array(
    z.object({
      email: z.string().optional(),
      name: z.string().optional(),
      phone_number: z.string().optional(),
      position: z.string().optional(),
    }),
  ),
  cvh_broker: z.string().optional(),
  description: z.string().optional(),
  existing_insurance_policies: z.string().optional(),
  insurance_types: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  lead_source: z.string().optional(),
  name: z.string().optional(),
  operational_address: z.string().optional(),
  registered_date: z.string().optional(),
  registration_number: z.string().optional(),
  service_agreement_file: z.string().optional(),
  status: z.string().optional(),
});

// {
//   "input": {
//     "bor_file": null,
//     "business_category": null,
//     "business_type": null,
//     "claim_history_file": null,
//     "client_type": null,
//     "contacts": [
//       {
//         "email": null,
//         "name": null,
//         "phone_number": null,
//         "position": null
//       }
//     ],
//     "cvh_broker": null,
//     "description": null,
//     "existing_insurance_policies": null,
//     "insurance_types": null,
//     "isActive": null,
//     "lead_source": null,
//     "name": null,
//     "operational_address": null,
//     "registered_date": null,
//     "registration_number": null,
//     "service_agreement_file": null,
//     "status": null
//   }
// }
