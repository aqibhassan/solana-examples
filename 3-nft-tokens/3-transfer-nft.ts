import * as splToken from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import config from '../shared/config';
import * as metaplex from '@metaplex/js';

// import uploadMetadata from './0-arweave';

async function main() {
	const connection = new web3.Connection(config.cluster, 'processed');
	const keypair = web3.Keypair.fromSecretKey(base58.decode(config.keypair));
	const other_keypair = web3.Keypair.fromSecretKey(base58.decode(config.otherwallet_keypair));


  const wallet=new metaplex.NodeWallet(keypair);
  const to_wallet=new metaplex.NodeWallet(other_keypair);


  const mintPublicKey = new web3.PublicKey("AvgGSi8HC2r5cLmVrDN15vKBCKcJhHYjFGRKVgFzHyK7");    
  const mintToken = new Token(
    connection,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    wallet.payer // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
  );
   

       // Get the token account of the fromWallet Solana address, if it does not exist, create it
       const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        wallet.publicKey,
      );
      const destPublicKey = new web3.PublicKey(to_wallet.publicKey);
      // / Get the derived address of the destination wallet which will hold the custom token
      const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPublicKey,
        destPublicKey
      );
     
      const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
        
      const instructions: web3.TransactionInstruction[] = [];  
    
      if (receiverAccount === null) {
    
        instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            mintToken.associatedProgramId,
            mintToken.programId,
            mintPublicKey,
            associatedDestinationTokenAddr,
            destPublicKey,
            wallet.publicKey
          )
        )
    
      }
      
      instructions.push(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          associatedDestinationTokenAddr,
          wallet.publicKey,
          [],
          1
        )
      );
    
      const transaction = new web3.Transaction().add(...instructions);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      
      // const transactionSignature = await connection.sendRawTransaction(
      //   transaction.serialize(),
      //   { skipPreflight: true }
      // );
    
      // await connection.confirmTransaction(transactionSignature);
      // console.log(transactionSignature);
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
