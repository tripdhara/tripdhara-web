import adminApi from '@/core/Api/index.js';
import DashboardClientWrapper from './DashboardClientWrapper.js';

export const metadata = {
    title: 'Admin Dashboard | Tripdhara',
    description: 'System telemetry and analytics.'
};

export default async function AdminDashboard() {

    let rawStats = null;
    let rawPackages = null;

    // 1. Fetch initial data via adminApi client
    try {
        const stats = adminApi.admin?.stats?.getStats;
        const packages = adminApi.admin?.packages?.getAll;
        const [statsRes, packagesRes] = await Promise.all([
            stats(),
            packages()
        ]);
        rawStats = statsRes?.data?.stats ?? statsRes?.data ?? statsRes;
        rawPackages = packagesRes?.data?.packages ?? packagesRes?.data ?? packagesRes;
    } catch (error) {
        console.error('error', error);
    }

    // // 3. Serialize to safely pass to Client Component (App Router requirement for Date/ObjectId)
    const initialStats = JSON.parse(JSON.stringify(rawStats || {}));
    const initialPackages = JSON.parse(JSON.stringify(rawPackages || []));

    // 4. Render Pure UI Shell wrapper
    return (
        <main>
            <DashboardClientWrapper
                initialStats={initialStats}
                initialPackages={initialPackages}
            />
        </main>
    );
}
