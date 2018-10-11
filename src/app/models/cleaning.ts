import { Cleaner } from "./cleaner";
import { InstanceFinder } from "./instance.finder";

export class Cleaning {
	ID: number;
	Cleaner: Cleaner;
	Date: string;

	constructor(ID: number, cleaner: Cleaner, date: string) {
		this.ID = ID;
		this.Cleaner = cleaner;
		this.Date = date;
	}
}

export class DalCleaning {
	ID: number;
	CleanerID: number;
	Date: string;

	constructor(id: number, cleanerID: number, date: string) {
		this.ID = id;
		this.CleanerID = cleanerID;
		this.Date = date;
	}
}

export class CleaningMapper {
	static ConvertToEntity(dal: DalCleaning, cleaners: Cleaner[]): Cleaning {
		return new Cleaning(dal.ID, InstanceFinder.getCleanerByID(cleaners, dal.CleanerID), dal.Date);
	}

	static ConvertToDal(entity: Cleaning): DalCleaning {
		return new DalCleaning(entity.ID, entity.Cleaner.ID, entity.Date);
	}

	static ConvertToDalFromJson(data: any): DalCleaning {
		return new DalCleaning(Number(data.ID), Number(data.CleanerID), data.Date);
	}

	static ConvertToJSONFromDAL(dal: DalCleaning): string {
		return JSON.stringify(dal);
	}
}