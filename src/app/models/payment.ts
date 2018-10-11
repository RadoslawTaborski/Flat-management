import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class Payment {
	ID: number;
	User1: User;
	User2: User;
	Name: string;
	Value: number;
	IsReturn: number;
	Action: number;
	AddDate: string

	constructor(ID: number, User1: User, User2: User, Name: string, Value: number, IsReturn: number, Action: number, AddDate: string) {
		this.ID = ID;
		this.User1 = User1;
		this.User2 = User2;
		this.Name = Name;
		this.Value = Value;
		this.IsReturn = IsReturn;
		this.Action = Action;
		this.AddDate = AddDate;
	}
}

export class DalPayment {
	ID: number;
	Name: string;
	User1ID: number;
	User2ID: number;
	Amount: number;
	Action: number;
	IsReturn: number;
	Date: string;

	constructor(id: number, name: string, user1ID: number, user2ID: number, amount: number, action: number, isReturn: number, date: string) {
		this.ID = id;
		this.User1ID = user1ID;
		this.User2ID = user2ID;
		this.Amount = amount;
		this.Action = action;
		this.IsReturn = isReturn;
		this.Date = date;
		this.Name = name;
	}
}

export class PaymentMapper {
	static ConvertToEntity(dal: DalPayment, users: User[]): Payment {
		return new Payment(dal.ID, InstanceFinder.getUserByID(users, dal.User1ID), InstanceFinder.getUserByID(users, dal.User2ID), dal.Name, dal.Amount, dal.IsReturn, dal.Action, dal.Date);
	}

	static ConvertToDal(entity: Payment): DalPayment {
		return new DalPayment(entity.ID, entity.Name, entity.User1.ID, entity.User2.ID, entity.Value, entity.Action, entity.IsReturn, entity.AddDate);
	}

	static ConvertToDalFromJson(data: any): DalPayment {
		return new DalPayment(Number(data.ID), data.Name, Number(data.User1ID), Number(data.User2ID), Number(data.Amount), Number(data.Action), Number(data.IsReturn), data.Date);
	}

	static ConvertToJSONFromDAL(dal: DalPayment): string {
		return JSON.stringify(dal);
	}
}
