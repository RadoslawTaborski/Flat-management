import { User } from "./user";
import { Cleaner } from "./cleaner";

export class InstanceFinder{
	static getUserByID(users: User[], id:number): User{
		//console.log(users, id)
		let user = users.filter(x=>x.ID==id);
		if(user.length>0){
			return user[0];
		}else{
			return null;
		}
	}
	
	static getCleanerByID(cleaners: Cleaner[], id:number): Cleaner{
		//console.log(cleaners, id)
		let cleaner = cleaners.filter(x=>x.ID==id);
		if(cleaner.length>0){
			return cleaner[0];
		}else{
			return null;
		}
	}
}