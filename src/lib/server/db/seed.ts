import { db } from '.';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { parse } from 'csv-parse';
import { unicorns } from './schema';

// Define the interface for our unicorn data
interface UnicornData {
	company: string;
	valuation: number;
	date: Date;
	country: string;
	city: string;
	industry: string;
	investors: string;
}

export async function seed() {
	const csvFilePath = path.join(process.cwd(), 'unicorns.csv');
	console.log('Reading CSV database...', csvFilePath);

	if (!fs.existsSync(csvFilePath)) {
		console.error(`CSV file not found at ${csvFilePath}`);
		throw new Error(`CSV file not found at ${csvFilePath}`);
	}

	return new Promise<void>((resolve, reject) => {
		const unicornData: UnicornData[] = [];

		fs.createReadStream(csvFilePath)
			.pipe(parse({ delimiter: ',', from_line: 2 }))
			.on('data', function (row) {
				// Parse each row into a typed object
				const unicorn: UnicornData = {
					company: row[0].trim(),
					valuation: parseFloat(row[1].replace('$', '').trim()),
					date: new Date(row[2].trim()),
					country: row[3].trim(),
					city: row[4].trim(),
					industry: row[5].trim(),
					investors: row[6].trim()
				};
				unicornData.push(unicorn);
			})
			.on('end', async function () {
				console.log(`Parsed ${unicornData.length} unicorn companies`);

				try {
					// Begin database transaction
					await db.transaction(async (tx) => {
						// Clear existing data
						await tx.delete(unicorns).execute();

						// Insert all unicorn records
						for (const unicorn of unicornData) {
							await tx
								.insert(unicorns)
								.values({
									company: unicorn.company,
									valuation: unicorn.valuation.toString(),
									date: unicorn.date,
									country: unicorn.country,
									city: unicorn.city || null,
									industry: unicorn.industry,
									investors: unicorn.investors
								})
								.execute();
						}
					});

					console.log('Successfully inserted unicorns into database');
					resolve();
				} catch (error) {
					console.error('Error inserting into database:', error);
					reject(error);
				}
			})
			.on('error', function (error) {
				reject(error);
			});
	});
}

// Run the seed function if this file is executed directly
if (require.main === module) {
	seed()
		.then(() => {
			console.log('Successfully seeded database');
			process.exit(0);
		})
		.catch((err) => {
			console.error('Failed to seed database:', err);
			process.exit(1);
		});
}
