import BlogForm from '../../BlogForm.js';

export const metadata = {
    title: 'Edit Blog Post - Admin Dashboard',
};

export default async function EditBlogPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return <BlogForm blogId={id} />;
}
