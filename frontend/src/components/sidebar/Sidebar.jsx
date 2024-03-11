import axios from 'axios';
import { useContext, useEffect, useRef } from 'react';
import {
	MdOutlineClose,
	MdOutlineGridView,
	MdOutlineLogout,
	MdOutlineMessage,
	MdOutlinePeople,
	MdOutlineSettings,
} from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LIGHT_THEME } from '../../constants/themeConstants';
import { SidebarContext } from '../../context/SidebarContext';
import { ThemeContext } from '../../context/ThemeContext';
import LogoBlue from '../assets/logo_blue.svg';
import LogoWhite from '../assets/logo_white.svg';
import './Sidebar.scss';

const Sidebar = () => {
	const { theme } = useContext(ThemeContext);
	const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
	const navbarRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();

	// closing navbar when clicked outside the sidebar area
	const handleClickOutside = (event) => {
		if (
			navbarRef.current &&
			!navbarRef.current.contains(event.target) &&
			event.target.className !== 'sidebar-open-btn'
		) {
			closeSidebar();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogOut = async () => {
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		axios
			.post('http://localhost:8080/logout', {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				console.log(response.data);
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<nav
			className={`sidebar ${isSidebarOpen ? 'sidebar-show' : ''}`}
			ref={navbarRef}
		>
			<div className="sidebar-top">
				<div className="sidebar-brand">
					<img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="Logo" />
					<span className="sidebar-brand-text">tabernam.</span>
				</div>
				<button className="sidebar-close-btn" onClick={closeSidebar}>
					<MdOutlineClose size={24} />
				</button>
			</div>
			<div className="sidebar-body">
				<div className="sidebar-menu">
					<ul className="menu-list">
						<li className="menu-item">
							<Link
								to="/dashboard"
								className={`menu-link ${
									location.pathname === '/dashboard' ? 'active' : ''
								}`}
							>
								<span className="menu-link-icon">
									<MdOutlineGridView size={20} />
								</span>
								<span className="menu-link-text">Dashboard</span>
							</Link>
						</li>
						<li className="menu-item">
							<Link
								to="/manage-bots"
								className={`menu-link ${
									location.pathname === '/manage-bots' ? 'active' : ''
								}`}
							>
								<span className="menu-link-icon">
									<MdOutlinePeople size={20} />
								</span>
								<span className="menu-link-text">Manage Bots</span>
							</Link>
						</li>
						<li className="menu-item">
							<Link
								to="/notifications"
								className={`menu-link ${
									location.pathname === '/notifications' ? 'active' : ''
								}`}
							>
								<span className="menu-link-icon">
									<MdOutlineMessage size={20} />
								</span>
								<span className="menu-link-text">Notifications</span>
							</Link>
						</li>
					</ul>
				</div>

				<div className="sidebar-menu sidebar-menu2">
					<ul className="menu-list">
						<li className="menu-item">
							<Link to="/" className="menu-link">
								<span className="menu-link-icon">
									<MdOutlineSettings size={20} />
								</span>
								<span className="menu-link-text">Settings</span>
							</Link>
						</li>
						<li className="menu-item">
							<Link to="/" className="menu-link">
								<span className="menu-link-icon">
									<MdOutlineLogout size={20} />
								</span>
								<span className="menu-link-text" onClick={handleLogOut}>
									Log Out
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Sidebar;
