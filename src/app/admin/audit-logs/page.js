import AuditLogsClientWrapper from './AuditLogsClientWrapper.js';

export const metadata = {
    title: 'Security Telemetry | Admin Dashboard',
    description: 'Monitor system audit logs and telemetry.'
};

export default function AuditLogsPage() {
    return (
        <main>
            <AuditLogsClientWrapper />
        </main>
    );
}
