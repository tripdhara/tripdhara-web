import VendorsClientWrapper from './VendorsClientWrapper.js';

export const metadata = {
    title: 'Vendor Network | Tripdhara Admin',
    description: 'Manage supply chain nodes and vendor clearances.'
};

export default function VendorsPage() {
    return (
        <main>
            <VendorsClientWrapper />
        </main>
    );
}
