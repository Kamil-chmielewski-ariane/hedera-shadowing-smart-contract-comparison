import { getMirrorNodeTransaction } from '@/api/hedera-mirror-node/get-mirror-node-transaction';
import { getHederaContractStatesByTimestamp } from '@/apps/smart-contract-comparison/blockchain-utils/get-hedera-contract-states-by-timestamp';
import { getStorageAt } from '@/api/erigon/get-storage-at';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { ContractDetails, ContractType } from '@/utils/types';

// Compare a smart contract slot state from hedera and ethereum net and write it in the log file if they are not equal.
export async function compareSmartContractRootState(
	contractRootData: ContractType
) {
	console.log(
		`Starting compare state contract ${contractRootData.blockNumber}`
	);

	const errorInBlock = [];
	const contractsInBlock = [];
	const transactionResponse = await getMirrorNodeTransaction(
		contractRootData.hederaTransactionHash
	);

	const createTransactionTimestamp = transactionResponse.consensus_timestamp;
	console.log(createTransactionTimestamp, 'lastTransactionTimestamp');

	if (
		contractRootData &&
		contractRootData.ethereumTransactionHash &&
		contractRootData.addressTo
	) {
		const possibleTransactionAddress = contractRootData.addressTo;
		const hederaStates = await getHederaContractStatesByTimestamp(
			possibleTransactionAddress,
			createTransactionTimestamp
		);

		if (hederaStates.length > 0) {
			contractsInBlock.push(transactionResponse.transactionHash);
		}

		for (const hederaState of hederaStates) {
			const sepoliaStateValue = await getStorageAt(
				possibleTransactionAddress,
				hederaState.slot,
				contractRootData.blockNumber.toString(16)
			);

			const contractDetails = {
				blockNumber: contractRootData.blockNumber,
				ethereumTransactionHash: contractRootData.ethereumTransactionHash,
				timestamp: hederaState.timestamp,
				contractAddress: possibleTransactionAddress,
				searchedSlot: hederaState.slot,
				hederaValue: hederaState.value,
				ethereumValue: sepoliaStateValue,
			};

			const contractDetailsValues: ContractDetails[] =
				Object.values(contractDetails);

			await writeLogFile(
				`logs/all-contracts-details`,
				`${contractDetailsValues.map((elem) => elem)} \r\n`,
				'csv'
			);

			if (sepoliaStateValue != hederaState.value) {
				errorInBlock.push(contractDetailsValues);
			}
		}
	}

	if (errorInBlock.length > 0) {
		await writeLogFile(
			`logs/state-root-compare-errors.csv`,
			`${errorInBlock.map((elem) => elem)} \r\n`,
			'csv'
		);
	}
}
