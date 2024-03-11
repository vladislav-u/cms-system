import { useContext } from "react";
import { MdOutlineClose, MdOutlineGridView, MdOutlineLogout, MdOutlineMessage, MdOutlinePeople, MdOutlineSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { LIGHT_THEME } from "../../constants/themeConstants";
import { ThemeContext } from '../../context/ThemeContext';
import LogoBlue from '../assets/logo_blue.svg';
import LogoWhite from '../assets/logo_white.svg';
import './Sidebar.scss';

const Sidebar = () => {
    const {theme} = useContext(ThemeContext);

    return (
        <nav className={`sidebar`}>
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="Logo" />
                    <span className="sidebar-brand-text">tabernam.</span>
                </div>
                <button className="sidebar-close-btn">
                    <MdOutlineClose size={24} />
                </button>
            </div>
            <div className="sidebar-body">
                <div className="sidebar-menu">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link to="/test" className="menu-link active">
                                <span className="menu-link-icon">
                                    <MdOutlineGridView size={20}/>
                                </span>
                                <span className="menu-link-text">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/test" className="menu-link">
                                <span className="menu-link-icon">
                                    <MdOutlinePeople size={20}/>
                                </span>
                                <span className="menu-link-text">
                                    Manage Bots
                                </span>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/test" className="menu-link">
                                <span className="menu-link-icon">
                                    <MdOutlineMessage size={20}/>
                                </span>
                                <span className="menu-link-text">
                                    Notifications
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-menu sidebar-menu2">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link to="/" className="menu-link">
                                <span className="menu-link-icon">
                                    <MdOutlineSettings size={20}/>
                                </span>
                                <span className="menu-link-text">
                                    Settings
                                </span>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/" className="menu-link">
                                <span className="menu-link-icon">
                                    <MdOutlineLogout size={20}/>
                                </span>
                                <span className="menu-link-text">
                                    Log Out
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar