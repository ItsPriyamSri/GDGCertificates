import { motion } from 'framer-motion';

function Error() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ type: 'spring', bounceStiffness: 50 }}
			className='certificate'
		>
			<motion.h1
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ type: 'spring', stiffness: 50 }}
			>
				You might have entered an invalid or wrong URL
			</motion.h1>
			<motion.a
				initial={{ y: 100 }}
				animate={{ y: 0 }}
				transition={{ type: 'spring', stiffness: 50 }}
				href='/certificate'
			>
				<h3>Click This link to head back to try again</h3>
			</motion.a>
		</motion.div>
	);
}

export default Error;
