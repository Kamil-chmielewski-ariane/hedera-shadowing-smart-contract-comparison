import { writeLogFile } from '@/utils/helpers/write-log-file';
import { TransactionStatusResponse } from '@/utils/types';

export async function transactionStatusAccuracyChecker(
	transactionData: TransactionStatusResponse
) {
	console.log(`Checking transaction ${transactionData.hederaTransactionHash}`);
	const { status } = transactionData;

	if (transactionData) {
		const transactionArray: TransactionStatusResponse[] = Object.values(transactionData)
		await writeLogFile(
			`logs/transaction-checker.csv`,
			`${transactionArray.map((elem) => elem)} \r\n`
		);
		console.log(`Finished checking transaction - result: ${status}`);
	}
}
