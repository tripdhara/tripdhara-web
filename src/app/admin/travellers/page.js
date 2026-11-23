import TravellersClientWrapper from './TravellersClientWrapper.js';

export const metadata = {
    title: 'Travellers | Admin Dashboard',
    description: 'Manage platform users and travellers.'
};

export default function TravellersPage() {
    return (
        <main>
            <TravellersClientWrapper />
        </main>
    );
}
