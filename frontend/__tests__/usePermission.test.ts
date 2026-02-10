import { usePermission, getUserPermissions } from '@/presentation/hooks/usePermission';

const mockUseAppSelector = jest.fn();

jest.mock('@/shared/store/hooks', () => ({
  useAppSelector: () => mockUseAppSelector(),
}));

describe('usePermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when user is not authenticated', () => {
    mockUseAppSelector.mockReturnValue({ user: null });

    const result = usePermission('event:view');
    expect(result).toBe(false);
  });

  it('should return true when user has event:view permission', () => {
    mockUseAppSelector.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
    });

    const result = usePermission('event:view');
    expect(result).toBe(true);
  });

  it('should return true for reservation:create permission', () => {
    mockUseAppSelector.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
    });

    const result = usePermission('reservation:create');
    expect(result).toBe(true);
  });

  it('should return false for unknown permission', () => {
    mockUseAppSelector.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
    });

    const result = usePermission('unknown:permission');
    expect(result).toBe(false);
  });
});

describe('getUserPermissions', () => {
  it('should return base permissions for any user', () => {
    const user = { id: '1', email: 'test@test.com' };
    const permissions = getUserPermissions(user);
    
    expect(permissions).toEqual(['event:view', 'reservation:create']);
    expect(permissions).toHaveLength(2);
  });
});
