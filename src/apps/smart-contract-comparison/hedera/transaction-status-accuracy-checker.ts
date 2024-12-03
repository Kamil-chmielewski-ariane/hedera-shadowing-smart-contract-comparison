import { writeLogFile } from '@/utils/helpers/write-log-file';
import { TransactionStatusResponse } from '@/utils/types';

export async function transactionStatusAccuracyChecker(
	contractRootData: TransactionStatusResponse
) {
	console.log(`Checking transaction ${contractRootData.hederaTransactionHash}`);
	const {
		blockNumber,
		hederaTransactionHash,
		ethereumTransactionHash,
		status,
	} = contractRootData;

	if (contractRootData) {
		await writeLogFile(
			`logs/transaction-checker.csv`,
			`${blockNumber},${ethereumTransactionHash},${hederaTransactionHash},${status} \r\n`
		);
		console.log(`Finished checking transaction - result: ${status}`);
	}
}
