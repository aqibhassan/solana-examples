import * as metaplex from '@metaplex/js';
import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import { Connection, Account, programs } from '@metaplex/js';
const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

import config from '../shared/config';

// import uploadMetadata from './0-arweave';

async function main() {
	const connection = new web3.Connection(config.cluster, 'processed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(config.keypair));
	let wallet = new metaplex.NodeWallet(keypair)
	// Init store
const storeId  = await metaplex.actions.initStore({
	connection,
	wallet,
  });
  
  // Get existing store id
  const StoreId = await Store.getPDA(wallet.publicKey );
  
// Load store
const store = await Store.load(connection, StoreId);

// Get all whitelisted creators
const creators = await store.getWhitelistedCreators(connection);

// Get creator PDA addresses
// const creatorPDAs = await Promise.all(
// 	creators.map((creator) =>
// 	  WhitelistedCreator.getPDA(store.pubkey, creator.data.address)
// 	)
//   );
  
//   // Filter store creators
//   const storeCreators = creators.filter(
// 	(creator, index) =>
// 	  creatorPDAs[index].toBase58() === creator.pubkey.toBase58()
//   );
  
//   // Get store metadata

	// let meta = new metaplex.programs.metadata.CreateMetadata({}, {});

	// let metadata = { };

	// await uploadMetadata('').then((txid) => {
	// 	console.log('uploaded json metadata to: https://arweave.net/%s', txid);
	// });
	
	// let wallet = new metaplex.NodeWallet(keypair)
	// await metaplex.actions.initStore({ connection, wallet });
	// console.log(creators);
	let { txId, mint, metadata, edition } = await metaplex.actions.mintNFT({
		connection,
		wallet: new metaplex.NodeWallet(keypair),
		uri: 'https://arweave.net/ineGdl0sLjzqqkjfdKzymqMMO6omKDA9pzb64kl0qDs',
		maxSupply: 1,
	});

	console.log({ txId, mint, metadata, edition });
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
