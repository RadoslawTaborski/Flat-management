import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class Balance {
    ID: number;
    User1: User;
    User2: User;
    Value: number;

    constructor(ID: number, User1:User, User2:User, Value: number){
        this.ID = ID;
        this.User1=User1;
        this.User2=User2;
        this.Value=Value;
    }
}

export class DalBalance{
	ID: number;
	User1ID: number;
	User2ID : number;
	Value :number;
	
	constructor(id: number, user1ID: number, user2ID: number, value: number){
		this.ID = id;
		this.User1ID = user1ID;
		this.User2ID = user2ID;
		this.Value = value;
	}
}

export class BalanceMapper{
	static ConvertToEntity(dal: DalBalance, users: User[]): Balance{
		return new Balance(dal.ID, InstanceFinder.getUserByID(users, dal.User1ID), InstanceFinder.getUserByID(users, dal.User2ID), dal.Value);
	}
	
	static ConvertToDal(entity: Balance): DalBalance{
		return new DalBalance(entity.ID, entity.User1.ID, entity.User2.ID, entity.Value);
	}
	
	static ConvertToDalFromJson(data: any): DalBalance{
		return new DalBalance(Number(data.ID), Number(data.User1ID), Number(data.User2ID), Number(data.Value));
	}
	
	static ConvertToJSONFromDAL(dal: DalBalance): string{
		return JSON.stringify(dal);
	}
}