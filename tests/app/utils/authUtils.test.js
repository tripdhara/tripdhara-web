import { jest } from '@jest/globals';

const mockStorage = {};
const mockLocalStorage = {
    getItem: jest.fn((key) => mockStorage[key] || null),
    setItem: jest.fn((key, value) => { mockStorage[key] = String(value); }),
    removeItem: jest.fn((key) => { delete mockStorage[key]; }),
    clear: jest.fn(() => {
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    })
};

const { getToken, getRole, setToken, removeToken } = await import('@/app/utils/authUtils.js');

describe('App Utils: authUtils.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
        global.window = {
            location: {
                protocol: 'https:'
            }
        };
        global.localStorage = mockLocalStorage;
    });

    afterAll(() => {
        delete global.window;
        delete global.localStorage;
    });

    describe('getToken & getRole', () => {
        it('should retrieve token and role from localStorage in browser environment', () => {
            mockStorage.token = 'jwt_mock_token';
            mockStorage.role = 'vendor';

            expect(getToken()).toBe('jwt_mock_token');
            expect(getRole()).toBe('vendor');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('role');
        });

        it('should return null when running in server-side environment (window is undefined)', () => {
            const tempWindow = global.window;
            delete global.window;

            expect(getToken()).toBeNull();
            expect(getRole()).toBeNull();

            global.window = tempWindow;
        });
    });

    describe('setToken', () => {
        it('should set token and role into localStorage', () => {
            setToken('token_123', 'traveller');

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'token_123');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('role', 'traveller');
            expect(mockStorage.token).toBe('token_123');
            expect(mockStorage.role).toBe('traveller');
        });

        it('should do nothing when running server-side (window is undefined)', () => {
            const tempWindow = global.window;
            delete global.window;

            setToken('token_123', 'traveller');
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

            global.window = tempWindow;
        });
    });

    describe('removeToken', () => {
        it('should remove token and role from localStorage', () => {
            mockStorage.token = 'token_to_remove';
            mockStorage.role = 'admin';

            removeToken();

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('role');
            expect(mockStorage.token).toBeUndefined();
            expect(mockStorage.role).toBeUndefined();
        });

        it('should do nothing when running server-side (window is undefined)', () => {
            const tempWindow = global.window;
            delete global.window;

            removeToken();
            expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();

            global.window = tempWindow;
        });
    });
});
