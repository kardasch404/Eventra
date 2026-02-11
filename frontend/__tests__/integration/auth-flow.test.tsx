import { renderHook } from '@testing-library/react';
import { usePermission } from '@/presentation/hooks/usePermission';
import { Provider } from 'react-redux';
import { store } from '@/shared/store';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Auth Flow Integration', () => {
  it('checks permission functionality', () => {
    const { result } = renderHook(() => usePermission('admin:access'), { wrapper });
    expect(typeof result.current).toBe('boolean');
  });

  it('returns false for non-existent permission', () => {
    const { result } = renderHook(() => usePermission('fake:permission'), { wrapper });
    expect(result.current).toBe(false);
  });
});
