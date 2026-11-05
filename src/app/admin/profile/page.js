import ProfileClientWrapper from './ProfileClientWrapper.js';

export const metadata = {
    title: 'Operator Identity | Admin Dashboard',
    description: 'Manage System Authorization Credentials & Metadata'
};

export default function AdminProfilePage() {
    return <ProfileClientWrapper initialProfile={{}} />;
}
