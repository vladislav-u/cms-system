import AreaCards from '../../components/dashboard/areaCards/AreaCards';
import AreaTop from '../../components/dashboard/areaTop/AreaTop';

const Dashboard = () => {
	return (
		<div className="content-area">
			<AreaTop />
			<AreaCards />
		</div>
	);
};

export default Dashboard;
