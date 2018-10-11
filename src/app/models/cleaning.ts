import { Cleaner } from "./cleaner";
import { InstanceFinder } from "./instance.finder";

export class Cleaning{
	Id: number;
	Cleaner: Cleaner;
	Date: string;
	
	constructor(Id: number, cleaner: Cleaner, date: string){
		this.Id=Id;
		this.Cleaner=cleaner;
		this.Date=date;
	}
}

export class DalCleaning{
	ID: number;
	CleanerID: number;
	Date: string;
	
	constructor(id: number, cleanerID: number, date: string){
		this.ID = id;
		this.CleanerID=cleanerID;
		this.Date=date;
	}
}

export class CleaningMapper{
	static ConvertToEntity(dal: DalCleaning, cleaners: Cleaner[]): Cleaning{
		return new Cleaning(dal.ID, InstanceFinder.getCleanerById(cleaners, dal.CleanerID),dal.Date);
	}
	
	static ConvertToDal(entity: Cleaning): DalCleaning{
		return new DalCleaning(entity.Id, entity.Cleaner.Id, entity.Date);
	}
	
	static ConvertToDalFromJson(data: any): DalCleaning{
		return new DalCleaning(Number(data.ID),Number(data.CleanerID),data.Date);
	}
	
	static ConvertToJSONFromDAL(dal: DalCleaning): string{
		return JSON.stringify(dal);
	}
}