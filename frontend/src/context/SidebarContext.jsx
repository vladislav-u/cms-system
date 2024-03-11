import { PropTypes } from 'prop-types';
import { createContext, useState } from 'react';

export const SidebarContext = createContext({});

export const SidebarProvider = ({ children }) => {
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const openSidebar = () => {
		setSidebarOpen(true);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<SidebarContext.Provider
			value={{
				isSidebarOpen,
				openSidebar,
				closeSidebar,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};

SidebarProvider.propTypes = {
	children: PropTypes.node,
};
