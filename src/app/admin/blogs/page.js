import BlogsTableClient from './BlogsTableClient.js';

export const metadata = {
    title: 'Blog Management - Admin Dashboard',
    description: 'Create, edit, and manage platform publications and travel articles.'
};

export default function BlogsPage() {
    return (
        <main>
            <BlogsTableClient />
        </main>
    );
}
