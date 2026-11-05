import { packagesApi } from '@/core/Api/public/package.js';
import { servicesApi } from '@/core/Api/public/service.js';
import { RESPONSE_MESSAGES } from '@/core/Constants/index.js';

const fetcher = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (options.body instanceof FormData) delete headers['Content-Type'];
    const path = process.env.NEXT_PUBLIC_API_URL + '/' + url;
    const res = await fetch(path, { ...options, headers });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) data = await res.json();
    else if (contentType && contentType.includes('application/pdf')) data = await res.blob();
    else data = { message: RESPONSE_MESSAGES.ERROR.GENERIC };

    if (!res.ok) throw new Error(RESPONSE_MESSAGES.ERROR.GENERIC);
    return data;
};
const api = { package: packagesApi(fetcher), service: servicesApi(fetcher) };
export default api;
