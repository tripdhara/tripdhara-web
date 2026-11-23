import PackageItemClientWrapper from './PackageItemClientWrapper.js';

export const metadata = {
    title: 'Package Node Configuration | Tripdhara Admin',
    description: 'Inspect and mutate inventory package node payload.'
};

export default async function AdminPackageItemPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <main>
            <PackageItemClientWrapper itemId={id} />
        </main>
    );
}
