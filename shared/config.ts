require('dotenv').config();

export const config = {
	cluster: process.env.SOLANA_CLUSTER_URL ?? 'https://api.testnet.solana.com',
	keypair: process.env.SOLANA_KEYPAIR as string,
	otherwallet_keypair: process.env.OTHER_WALLET as string

};

export default config;
