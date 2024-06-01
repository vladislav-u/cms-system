import { useContext } from 'react';
import { MdOutlineMenu } from 'react-icons/md';
import { SidebarContext } from '../../../context/SidebarContext';
import './AreaTop.scss';

const AreaTop = () => {
	const { openSidebar } = useContext(SidebarContext);

	return (
		<section className="content-area-top">
			<div className="area-top-l">
				<button
					className="sidebar-open-btn"
					type="button"
					onClick={openSidebar}
				>
					<MdOutlineMenu size={24} />
				</button>
				<h2 className="area-top-title">Dashboard</h2>
			</div>
		</section>
	);
};

export default AreaTop;
