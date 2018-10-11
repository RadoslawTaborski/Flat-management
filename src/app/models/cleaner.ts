import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class Cleaner{
	Id: number;
	User: User;
	Counter: number;
	LastTimeOfCleaning: string;
	
	constructor(Id: number, user: User, counter: number, date: string){
		this.Id=Id;
		this.User=user;
		this.Counter=counter;
		this.LastTimeOfCleaning=date;
	}
}

export class DalCleaner{
	ID: number;
	UserID: number;
	Counter: number;
	LastTime: string;
	
	constructor(id: number, userID: number, counter: number, lastTime: string){
		this.ID = id;
		this.UserID = userID;
		this.Counter = counter;
		this.LastTime = lastTime;
	}
}

export class CleanerMapper{
	static ConvertToEntity(dal: DalCleaner, users: User[]): Cleaner{
		return new Cleaner(dal.ID, InstanceFinder.getUserById(users, dal.UserID), dal.Counter, dal.LastTime);
	}
	
	static ConvertToDal(entity: Cleaner): DalCleaner{
		return new DalCleaner(entity.Id, entity.User.Id, entity.Counter, entity.LastTimeOfCleaning);
	}
	
	static ConvertToDalFromJson(data: any): DalCleaner{
		return new DalCleaner(Number(data.ID), Number(data.UserID), Number(data.Counter), data.LastTime);
	}
	
	static ConvertToJSONFromDAL(dal: DalCleaner): string{
		return JSON.stringify(dal);
	}
}