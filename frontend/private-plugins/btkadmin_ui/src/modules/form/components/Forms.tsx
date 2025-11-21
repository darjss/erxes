import { useForms } from '../hooks/userForms';
import { Spinner, Table, RelativeDateDisplay } from 'erxes-ui';
import { IconArrowDown } from '@tabler/icons-react';
import React from 'react';

export const Forms = () => {
  const { forms = [], loading } = useForms();

  if (loading) return <Spinner containerClassName="blk:py-32" />;

  if (forms.length === 0)
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        No submissions found.
      </div>
    );

  return (
    <div className="px-4">
      <Table>
        <Table.Header className="[&_th]:w-40">
          <Table.Row>
            <Table.Head className="w-64">Email</Table.Head>
            <Table.Head>Answers</Table.Head>
            <Table.Head className="w-36">Submitted At</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {forms.map((form, index) => (
            <React.Fragment key={index}>
              <Table.Row>
                <Table.Cell>
                  {form.name} <br />
                  <small className="text-gray-500">{form.email}</small>
                </Table.Cell>
                <Table.Cell className="overflow-x-auto">
                  <div className="space-y-1">
                    {Object.entries(form)
                      .filter(([key]) => key.startsWith('answer'))
                      .map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <RelativeDateDisplay.Value value={form.submittedAt} />
                </Table.Cell>
              </Table.Row>

              {index < forms.length - 1 && (
                <tr>
                  <td colSpan={3} className="text-center py-2">
                    <div className="flex items-center justify-center">
                      <IconArrowDown />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
