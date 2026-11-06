import SettingsService from '@/core/Services/Admin/SettingsService.js';
import SettingsClientWrapper from './SettingsClientWrapper.js';
import { getLogger } from '@/core/Lib/logger.js';
import dbConnect from '@/core/Config/db.js';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Global Environment | Admin Dashboard',
    description: 'Manage System Variables & API Integration Nodes'
};

export default async function SettingsPage() {
    let rawSettings = {};

    try {
        await dbConnect();
        rawSettings = await SettingsService.getSettings();
    } catch (e) {
        getLogger().error({ err: e }, '[AdminSettingsPage] Failed to fetch settings');
    }

    const initialSettings = JSON.parse(JSON.stringify(rawSettings || {}));

    return <SettingsClientWrapper initialSettings={initialSettings} />;
}
