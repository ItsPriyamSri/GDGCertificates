import { motion } from 'framer-motion';

function Home() {
	return (
		<motion.div
			key={1}
			initial={{ y: '-200px', opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: '-200px', opacity: 0 }}
			transition={{ type: 'spring', stiffness: 120 }}
			className='home'
		>
			<motion.img
				initial={{ y: '-100px' }}
				src='/logo-gdg.svg'
				alt='GDG Logo'
				className='home-logo'
			/>
			<h1 className='gradient-text'>Congratulations!</h1>
			<motion.p
				initial={{ y: '100px', opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: '100px', opacity: 0 }}
				transition={{ type: 'spring', stiffness: 180 }}
				className='home-description'
			>
				Your dedication to mastering Google Cloud technologies has paid off.<br />
				Celebrate your achievement with an official certificate recognizing your expertise.
			</motion.p>
			<motion.a
				href='/certificate'
				className='cta-button'
				initial={{ y: '100px', opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: '100px', opacity: 0 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				transition={{ type: 'spring', stiffness: 180 }}
			>
				🎓 Generate Your Certificate
			</motion.a>
		</motion.div>
	);
}

export default Home;
