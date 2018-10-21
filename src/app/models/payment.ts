import { User } from "./user";
import { InstanceFinder } from "./instance.finder";
import { PaymentType } from "./payment.type";

export class PaymentGroup {
	IDs: number[];
	User1: User;
	Users: User[];
	Name: string;
	Value: number;
	Action: number;
	AddDate: string;
	Payments: Payment[];

	constructor(payments: Payment[]) {
		this.Payments = payments;
		if (payments.length > 0) {
			this.Users = [];
			this.IDs = [];
			this.Value = 0;
			this.User1 = payments[0].User1;
			this.Name = payments[0].Name;
			this.Action = payments[0].Action;
			this.AddDate = payments[0].AddDate;
			payments.forEach(item => {
				this.IDs.push(item.ID);
				this.Users.push(item.User2);
				this.Value += item.Value;
			});
		}
	}

	getInitials(): string {
		let results: string[] = [];
		let result = "";
		this.Users.forEach(item => {
			results.push(item.ShortName);
		});
		results.forEach(item => {
			result += item + ", ";
		});
		return result.substring(0, result.length - 2);
	}
}

export class Payment {
	ID: number;
	User1: User;
	User2: User;
	Name: string;
	Value: number;
	Type: PaymentType;
	Action: number;
	AddDate: string

	constructor(ID: number, User1: User, User2: User, Name: string, Value: number, type: PaymentType, Action: number, AddDate: string) {
		this.ID = ID;
		this.User1 = User1;
		this.User2 = User2;
		this.Name = Name;
		this.Value = Value;
		this.Type = type;
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
	Type: string;
	Date: string;

	constructor(id: number, name: string, user1ID: number, user2ID: number, amount: number, action: number, type: string, date: string) {
		this.ID = id;
		this.User1ID = user1ID;
		this.User2ID = user2ID;
		this.Amount = amount;
		this.Action = action;
		this.Type = type;
		this.Date = date;
		this.Name = name;
	}
}

export class PaymentMapper {
	static ConvertToEntity(dal: DalPayment, users: User[]): Payment {
		return new Payment(dal.ID, InstanceFinder.getUserByID(users, dal.User1ID), InstanceFinder.getUserByID(users, dal.User2ID), dal.Name, dal.Amount, PaymentType[dal.Type], dal.Action, dal.Date);
	}

	static ConvertToDal(entity: Payment): DalPayment {
		return new DalPayment(entity.ID, entity.Name, entity.User1.ID, entity.User2.ID, entity.Value, entity.Action, PaymentType[entity.Type], entity.AddDate);
	}

	static ConvertToDalFromJson(data: any): DalPayment {
		return new DalPayment(Number(data.ID), data.Name, Number(data.User1ID), Number(data.User2ID), Number(data.Amount), Number(data.Action), data.Type, data.Date);
	}

	static ConvertToJSONFromDAL(dal: DalPayment): string {
		return JSON.stringify(dal);
	}
}
