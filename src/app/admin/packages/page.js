import PackagesClientWrapper from './PackagesClientWrapper.js';

export const metadata = {
    title: 'Packages Inventory | Tripdhara Admin',
    description: 'Manage platform packages and inventory.'
};

export default function PackagesPage() {
    return (
        <main>
            <PackagesClientWrapper />
        </main>
    );
}
