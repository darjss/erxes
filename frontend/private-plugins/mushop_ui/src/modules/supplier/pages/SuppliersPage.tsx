import { IconBuildingStore } from '@tabler/icons-react';
import { Breadcrumb, Button, PageContainer, PageSubHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { SuppliersFilter } from '../components/SuppliersFilter';
import { SuppliersTable } from '../components/SuppliersTable';
import { SupplierDetailSheet } from '../components/SupplierDetailSheet';

export const SuppliersPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/mushop/suppliers">
                    <IconBuildingStore />
                    Suppliers
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>

      <PageSubHeader>
        <SuppliersFilter />
      </PageSubHeader>

      <SuppliersTable />

      <SupplierDetailSheet />
    </PageContainer>
  );
};

export default SuppliersPage;
