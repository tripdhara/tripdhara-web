import AdminLayoutClient from './AdminLayoutClient.js';
import { getServerToken } from '@/app/utils/authUtils.js';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
    const token = await getServerToken();
    if (!token) {
        redirect('/login');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
