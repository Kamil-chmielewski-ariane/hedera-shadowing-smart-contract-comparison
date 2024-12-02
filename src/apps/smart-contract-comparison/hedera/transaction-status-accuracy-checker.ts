import { writeLogFile } from '@/utils/helpers/write-log-file';
import { ContractType } from '@/utils/types';
import { getHederaTransactionById } from '@/api/hedera-mirror-node/get-hedera-transaction-by-id';

export async function transactionStatusAccuracyChecker(
	contractRootData: ContractType
) {
	console.log(`Checking transaction ${contractRootData.hederaTransactionHash}`);
	const { blockNumber, hederaTransactionHash, ethereumTransactionHash } =
		contractRootData;

	if (contractRootData && hederaTransactionHash) {
		const data = await getHederaTransactionById(hederaTransactionHash);
		const transactionStatus = data?.result;

		if (data && transactionStatus) {
			await writeLogFile(
				`logs/transaction-checker.csv`,
				`${blockNumber},${ethereumTransactionHash},${hederaTransactionHash},${transactionStatus} \r\n`
			);
		}
		console.log(`Finished checking transaction - result: ${transactionStatus}`);
	}
}
