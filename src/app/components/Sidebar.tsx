import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveMenu, toggleSidebar } from '../store/slices/appSlice';
import { MENU_ITEMS, ENDPOINT_ROUTES } from '../config/menuConfig';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.app);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleMenuClick = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
    dispatch(setActiveMenu(menuId));
  };

  const handleSubMenuClick = (endpointId: string) => {
    const route = ENDPOINT_ROUTES[endpointId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <aside
      className={`transition-all duration-300 bg-white border-r border-gray-200 shadow-sm overflow-y-auto ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white shadow-sm gap-2'>
        {sidebarOpen && (
          <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'>
            Admin
          </h1>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className='p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-900 flex-shrink-0'
          aria-label='Toggle sidebar'
        >
          ☰
        </button>
      </div>

      <nav className='px-4 py-6 space-y-2'>
        <ul className='space-y-2'>
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const isMenuExpanded = expandedMenu === item.id;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={item.label}
                >
                  <div className='flex items-center gap-4 flex-1 min-w-0'>
                    <span className='text-2xl flex-shrink-0'>{item.icon}</span>
                    {sidebarOpen && (
                      <span className='truncate text-base font-medium'>{item.label}</span>
                    )}
                  </div>
                  {sidebarOpen && hasSubmenu && (
                    <span
                      className={`text-xl transition-transform duration-200 flex-shrink-0 text-gray-400 ${isMenuExpanded ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  )}
                </button>

                {sidebarOpen && hasSubmenu && isMenuExpanded && (
                  <ul className='mt-3 ml-6 space-y-2 border-l-2 border-blue-200 pl-4'>
                    {item.submenu.map((subitem) => (
                      <li key={subitem.id}>
                        <button
                          onClick={() => handleSubMenuClick(subitem.endpointId)}
                          className='w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-150 font-medium truncate'
                          title={subitem.label}
                        >
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
