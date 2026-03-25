import { Breadcrumb, Button, Separator } from "erxes-ui";
import { PageHeader } from "ui-modules";
import { IconCaretDownFilled, IconSettings, IconHomeSearch } from "@tabler/icons-react";
import { Link } from "react-router";

export const ListingPage = () => {
  return (

    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/blockagent">
                    <IconHomeSearch />
                    Listing
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/blockagent">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden flex-auto">
          <h1>Listing</h1>
        </div>
      </div>
    </div>
  );
};