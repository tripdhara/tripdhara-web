'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getRole, removeToken } from '@/app/utils/authUtils.js';
import api from '@/core/Api/index.js';

export default function withAuth(Component, allowedRoles = []) {
    return function ProtectedRoute(props) {
        const router = useRouter();
        const [auth, setAuth] = useState(false);

        useEffect(() => {
            let isMounted = true;

            const verifySession = async () => {
                const token = getToken();
                const userRole = getRole();

                // 1. अगर टोकन नहीं है तो ब्राउज़र हिस्ट्री रिप्लेस करके सीधे लॉगिन पर भेजें
                if (!token) {
                    router.replace('/login');
                    return;
                }

                // 2. क्लाइंट-साइड रोल वैलिडेशन
                if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                    redirectToDashboard(userRole);
                    return;
                }

                // 3. सर्वर-साइड सेशन वेरिफिकेशन वाया Redis & Core API
                try {
                    const res = await api.auth.verify();
                    const verifiedRole = res?.data?.role || userRole;

                    if (allowedRoles.length > 0 && !allowedRoles.includes(verifiedRole)) {
                        redirectToDashboard(verifiedRole);
                        return;
                    }

                    if (isMounted) setAuth(true);
                } catch (error) {
                    // अगर टोकन इनवैलिड या ब्लैकलिस्टेड (Redis) है
                    if (error?.status === 401 || error?.status === 403) {
                        removeToken();
                        router.replace('/login');
                        return;
                    }
                    // नेटवर्क ग्लिच होने पर लोकल ऑथ पर जाने दें
                    if (isMounted) setAuth(true);
                }
            };

            const redirectToDashboard = (role) => {
                if (role === 'admin') router.replace('/admin');
                else if (role === 'vendor') router.replace('/vendor');
                else router.replace('/login');
            };

            verifySession();

            return () => {
                isMounted = false;
            };
        }, [router]);

        if (!auth) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <div className="text-xs font-mono tracking-[0.2em] text-indigo-400 capitalize animate-pulse">Verifying Session State...</div>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
}
