import { User } from "./user";
import { Cleaner } from "./cleaner";

export class InstanceFinder{
	static getUserById(users: User[], id:number): User{
		let user = users.filter(x=>x.Id==id);
		if(user.length>0){
			return user[0];
		}else{
			return null;
		}
	}
	
	static getCleanerById(cleaners: Cleaner[], id:number): Cleaner{
		let cleaner = cleaners.filter(x=>x.Id==id);
		if(cleaner.length>0){
			return cleaner[0];
		}else{
			return null;
		}
	}
}