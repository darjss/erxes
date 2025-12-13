import {
  BlockEditorReadOnly,
  Button,
  Editor,
  InfoCard,
  Sheet,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { useClientDetail } from '../hooks/useClients';
import {
  CLIENT_BUSINESS_MAIN_TYPE_OPTIONS,
  CLIENT_TYPE_OPTIONS,
} from '../constants/clientTypes';
import { MembersInline } from 'ui-modules';

export const ClientDetailSheet = () => {
  const [activeClientId, setActiveClientId] =
    useQueryState<string>('activeClientId');
  return (
    <Sheet open={!!activeClientId} onOpenChange={() => setActiveClientId(null)}>
      <Sheet.View className="sm:max-w-5xl">
        <Sheet.Header>
          <Sheet.Title>Client Detail</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content>
          <ClientDetail />
        </Sheet.Content>
        <Sheet.Footer className="">
          <Button>Edit Client</Button>
        </Sheet.Footer>
      </Sheet.View>
    </Sheet>
  );
};

export const ClientDetail = () => {
  const [activeClientId] = useQueryState<string | null>('activeClientId');
  const { clientDetail, loading } = useClientDetail({
    id: activeClientId || '',
  });

  if (loading) return <Spinner />;

  if (!clientDetail) return <div>Client not found</div>;

  return (
    <div className="p-4 flex flex-col gap-4">
      <Table>
        <Table.Body className="bt:[&_tr:first-child_td]:border-t bt:[&_td]:p-2">
          <Table.Row>
            <Table.Cell className="bg-sidebar">Name</Table.Cell>
            <Table.Cell>{clientDetail.name}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">Client Type</Table.Cell>
            <Table.Cell>
              {
                CLIENT_TYPE_OPTIONS.find(
                  (type) => type.value === clientDetail.client_type,
                )?.label
              }
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">Business Type</Table.Cell>
            <Table.Cell>
              {
                CLIENT_BUSINESS_MAIN_TYPE_OPTIONS.find(
                  (type) => type.value === clientDetail.business_type,
                )?.label
              }
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">Business Category</Table.Cell>
            <Table.Cell>{clientDetail.business_category}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">Status</Table.Cell>
            <Table.Cell>{clientDetail.status}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">CVH Broker</Table.Cell>
            <Table.Cell className="flex items-center gap-2">
              <MembersInline memberIds={[clientDetail.cvh_broker || '']} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="bg-sidebar">Name</Table.Cell>
            <Table.Cell>{clientDetail.registered_date}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <InfoCard title="Description">
        <InfoCard.Content>
          <BlockEditorReadOnly content={clientDetail.description || ''} />
        </InfoCard.Content>
      </InfoCard>
    </div>
  );
};

// {
//     "data": {
//       "cvGetClient": {
//         "_id": "69381d7518a7f26df97fd928",
//         "name": "safd",
//         "client_type": "state_owned",
//         "lead_source": null,
//         "registration_number": "safdafd",
//         "operational_address": null,
//         "business_type": "mining_natural_resources",
//         "business_category": "asf",
//         "status": "negotiation",
//         "cvh_broker": "8eeQwVeh18MilE5vKav1q",
//         "existing_insurance_policies": "[{\"id\":\"e07d2f1e-0c15-48fa-8fb8-00218382f36c\",\"type\":\"paragraph\",\"props\":{\"textColor\":\"default\",\"backgroundColor\":\"default\",\"textAlignment\":\"left\"},\"content\":[{\"type\":\"text\",\"text\":\"afsdafsd\",\"styles\":{}}],\"children\":[]},{\"id\":\"538a6cf2-622b-4140-b505-e08bf1c740f3\",\"type\":\"paragraph\",\"props\":{\"textColor\":\"default\",\"backgroundColor\":\"default\",\"textAlignment\":\"left\"},\"content\":[],\"children\":[]}]",
//         "claim_history_file": "",
//         "description": "[{\"id\":\"d72fba32-a04a-43ff-8bc2-c6b5c7635a0f\",\"type\":\"paragraph\",\"props\":{\"textColor\":\"default\",\"backgroundColor\":\"default\",\"textAlignment\":\"left\"},\"content\":[{\"type\":\"text\",\"text\":\"asffa\",\"styles\":{}}],\"children\":[]},{\"id\":\"9bae4ad4-4476-47b8-a5a7-ec4c8c68cbbd\",\"type\":\"paragraph\",\"props\":{\"textColor\":\"default\",\"backgroundColor\":\"default\",\"textAlignment\":\"left\"},\"content\":[],\"children\":[]}]",
//         "registered_date": "2025-12-03T16:00:00.000Z",
//         "isActive": true,
//         "bor_file": null,
//         "service_agreement_file": null,
//         "insurance_types": [
//           "sad",
//           "asfafsd",
//           "asfd"
//         ],
//         "contacts": [
//           {
//             "name": "Baterdene khashbat",
//             "position": "",
//             "phone_number": "80891582",
//             "email": "hashbaterdene@gmail.com",
//             "__typename": "CVClientContact"
//           }
//         ],
//         "createdAt": "2025-12-09T13:00:37.721Z",
//         "updatedAt": "2025-12-09T13:00:37.721Z",
//         "__typename": "CVClient"
//       }
//     }
//   }
