import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 创建类型安全的导航钩子
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
