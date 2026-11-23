import CategoryDocClientWrapper from './CategoryDocClientWrapper.js';

export const metadata = {
    title: 'Category Documents | Admin Dashboard',
    description: 'Manage validation documents for categories.'
};

export default function CategoryDocumentsPage() {
    return (
        <main>
            <CategoryDocClientWrapper />
        </main>
    );
}
