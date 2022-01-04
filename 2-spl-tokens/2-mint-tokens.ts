import * as splToken from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import base58 from 'bs58';

import config from '../shared/config';

// import uploadMetadata from './0-arweave';

async function main() {
	const connection = new web3.Connection(config.cluster, 'processed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(config.keypair));
      // Generate a new wallet to receive newly minted token
  const toWallet = web3.Keypair.generate();
    const mint = await splToken.Token.createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        9,
        splToken.TOKEN_PROGRAM_ID,
      );

       // Get the token account of the fromWallet Solana address, if it does not exist, create it
      const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    keypair.publicKey,
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    keypair.publicKey,
  );

    // Minting 1 new token to the "fromTokenAccount" account we just returned/created
    await mint.mintTo(
        fromTokenAccount.address,
        keypair.publicKey,
        [],
        1000000000,
      );
        // Add token transfer instructions to transaction
  const transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
    {commitment: 'confirmed'},
  );
  console.log('SOL Explorer SIGNATURE', signature);
  console.log("Transaction ID",transaction);
  console.log("program ID ",splToken.TOKEN_PROGRAM_ID);
  console.log("from account ",fromTokenAccount.address);
	// let meta = new metaplex.programs.metadata.CreateMetadata({}, {});

	// let metadata = { };

	// await uploadMetadata('').then((txid) => {
	// 	console.log('uploaded json metadata to: https://arweave.net/%s', txid);
	// });
	
	// let wallet = new metaplex.NodeWallet(keypair)
	// await metaplex.actions.initStore({ connection, wallet });
	// let { txId, mint, metadata, edition } = await metaplex.actions.mintNFT({
	// 	connection,
	// 	wallet: new metaplex.NodeWallet(keypair),
	// 	uri: 'https://arweave.net/fzqHw6a8gi5tyR2LAS2DZ6Z55v9y6Nt3eBAlJNwFub0',
	// 	maxSupply: 10,
	// });

	// console.log({ txId, mint, metadata, edition });
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
