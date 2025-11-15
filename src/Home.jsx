import { AnimatePresence, motion } from 'framer-motion';

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
				alt=''
			/>
			<h1>Congratulations</h1>
			<motion.p
				initial={{ y: '100px', opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: '100px', opacity: 0 }}
				transition={{ type: 'spring', stiffness: 180 }}
			>
				A huge round of applause for your achievements. You have successfully
				completed the challenges and earned the badges. Keep up the good work.
			</motion.p>
			<motion.a
				href='/certificate'
				// /certificate
				initial={{ y: '100px', opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: '100px', opacity: 0 }}
				whileHover={{ x: '20px' }}
				transition={{ type: 'spring', stiffness: 180 }}
			>
				Follow This Link to enter your Google Cloud's Skillboost id
			</motion.a>
		</motion.div>
	);
}

export default Home;
