import AreaCard from './AreaCard';
import './AreaCards.scss';

const AreaCards = () => {
	return (
		<section className="content-area-cards">
			<AreaCard
				colors={['#e4e8ef', '#475be8']}
				percentFillValue={80}
				cardInfo={{
					title: 'Add Bot Token',
					value: 'Empty',
					text: 'Test Text',
				}}
			/>
			<AreaCard
				colors={['#e4e8ef', '#4ce13f']}
				percentFillValue={50}
				cardInfo={{
					title: 'Connected Bots',
					value: 'Empty',
					text: 'Test Text 2',
				}}
			/>
		</section>
	);
};

export default AreaCards;
