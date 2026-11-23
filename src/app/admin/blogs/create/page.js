import BlogForm from '../BlogForm.js';

export const metadata = {
    title: 'Compose Publication - Admin Dashboard',
    description: 'Compose and publish new travel stories, destination guides, and platform editorials.'
};

export default function CreateBlogPage() {
    return (
        <main>
            <BlogForm />
        </main>
    );
}
