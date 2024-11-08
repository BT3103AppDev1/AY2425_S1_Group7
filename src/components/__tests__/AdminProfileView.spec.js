import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AdminProfileView from '../AdminProfileView.vue';
import { getDoc } from 'firebase/firestore';
import { reauthenticateWithCredential } from 'firebase/auth';

vi.mock('firebase/firestore', async () => {
    const original = await vi.importActual('firebase/firestore');
    return {
        ...original,
        getFirestore: vi.fn(() => ({
            collection: vi.fn(() => ({
                doc: vi.fn().mockReturnValue({ id: 'mockDocId' }),
                getDoc: vi.fn(),
                setDoc: vi.fn(),
                addDoc: vi.fn(),
            })),
        })),
        getDoc: vi.fn(),
        setDoc: vi.fn(),
        doc: vi.fn(),
        Timestamp: {
            fromDate: vi.fn((date) => date),
        },
    };
});

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn().mockReturnValue({
        currentUser: { uid: 'testUid', email: 'test@example.com' },
        onAuthStateChanged: vi.fn(),
    }),
    reauthenticateWithCredential: vi.fn(),
    EmailAuthProvider: {
        credential: vi.fn(),
    },
}));

vi.mock('vue-router', () => ({
    useRouter: vi.fn().mockReturnValue({
        push: vi.fn(),
    }),
}));

describe('AdminProfileView', () => {
    it('renders the component', () => {
        const wrapper = mount(AdminProfileView, {
            global: {
                mocks: {
                    $router: { push: vi.fn() },
                },
            },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('Fetches user data on mount', async () => {
        const mockData = {
            role: 'Admin',
            username: 'testUser',
            email: 'test@example.com',
            fullName: 'Test User',
            dob: '2000-01-01',
            residential_address: '123 Test St',
            organisation: 'Test Org',
            department: 'Test Dept',
        };
        getDoc.mockResolvedValue({ data: () => mockData });

        const wrapper = mount(AdminProfileView, {
            global: {
                mocks: {
                    $router: { push: vi.fn() },
                },
            },
        });
        await wrapper.vm.getData();

        expect(wrapper.vm.fullName).toBe(mockData.fullName);
        expect(wrapper.vm.dateOfBirth).toBe(mockData.dob);
        expect(wrapper.vm.residentialAddress).toBe(mockData.residential_address);
        expect(wrapper.vm.organisation).toBe(mockData.organisation);
        expect(wrapper.vm.department).toBe(mockData.department);
    });

    it('Opens password modal when update button is clicked', async () => {
        const wrapper = mount(AdminProfileView, {
            global: {
                mocks: {
                    $router: { push: vi.fn() },
                },
            },
        });

        const updateButton = wrapper.find('.update-button');
        await updateButton.trigger('click');

        expect(wrapper.vm.showPasswordModal).toBe(true);
    });

    it('Reauthenticates user and enables editing mode', async () => {
        const wrapper = mount(AdminProfileView, {
            global: {
                mocks: {
                    $router: { push: vi.fn() },
                },
            },
        });

        wrapper.vm.password1 = 'testPassword';
        await wrapper.vm.reAuth();

        expect(reauthenticateWithCredential).toHaveBeenCalled();
        expect(wrapper.vm.profileEditingEnabled).toBe(true);
    });
});