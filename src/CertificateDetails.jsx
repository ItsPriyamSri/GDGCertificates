import './styles.css';
import { motion } from 'framer-motion';

function CertificateDetails({ setProfileURL }) {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const url = data.get('ProfileURL');
		setProfileURL(url);
	};
	return (
		<motion.div
			initial={{ x: '-200px', opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: '-200px', opacity: 0 }}
			transition={{ type: 'spring', stiffness: 120 }}
			className='certificate'
		>
			<motion.img
				initial={{ y: '-100px' }}
				src='/logo-gdg.svg'
				alt=''
			/>
			<h1>Enter Certificate Details</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor='ProfileURL'>Enter Profile URL</label>
				<motion.input
					autoComplete='off'
					autoCorrect='off'
					type='text'
					id='ProfileURL'
					name='ProfileURL'
					required
				/>
				<button type='submit'>Submit</button>
			</form>
		</motion.div>
	);
}

export default CertificateDetails;
