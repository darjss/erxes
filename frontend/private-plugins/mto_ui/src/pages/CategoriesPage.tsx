import { MtoPageLayout } from '~/components/MtoPageLayout';

export function CategoriesPage() {
  return (
    <MtoPageLayout pageName="Categories">
      <div className="container mx-auto py-6 text-sm text-muted-foreground">
        Category CRUD UI is not included in this plugin build. The API must
        expose <code className="text-xs">mtoActivityCategories</code> when you
        add the full category module.
      </div>
    </MtoPageLayout>
  );
}
