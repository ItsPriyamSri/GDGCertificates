import './styles.css';
import { motion } from 'framer-motion';

function CertificateDetails({ setProfileURL, isLoading }) {
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
			className='certificate-form'
		>
			<motion.img
				initial={{ y: '-100px' }}
				src='/logo-gdg.svg'
				alt=''
			/>
			<h1 className='gradient-text'>Enter Certificate Details</h1>
			<p className="subtitle">Enter your Google Cloud Skills Boost profile URL to generate your certificate</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor='ProfileURL'>Profile URL</label>
				<motion.input
					autoComplete='off'
					autoCorrect='off'
					type='text'
					id='ProfileURL'
					name='ProfileURL'
					placeholder='https://www.cloudskillsboost.google/public_profiles/...'
					required
					disabled={isLoading}
				/>
				<button type='submit' disabled={isLoading} className={isLoading ? 'loading' : ''}>
					{isLoading ? (
						<>
							<span className="spinner"></span>
							Fetching Certificate...
						</>
					) : (
						'Generate Certificate'
					)}
				</button>
			</form>
		</motion.div>
	);
}

export default CertificateDetails;
