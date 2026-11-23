import SystemHealthClientWrapper from './SystemHealthClientWrapper.js';

export const metadata = {
    title: 'System Health Matrix | Admin Dashboard',
    description: 'Monitor System Telemetry and Performance.'
};

export default function SystemHealthPage() {
    return (
        <main>
            <SystemHealthClientWrapper />
        </main>
    );
}
