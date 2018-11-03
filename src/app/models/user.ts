export class User {
	ID: number;
	Login: string;
	ShortName: string;
	FullName: string;
	BankAccount: string;
	BankPage: string;

	constructor(id: number, login: string, shortName: string, fullName: string, bankAccount: string, bankPage: string) {
		this.ID = id;
		this.Login = login;
		this.ShortName = shortName;
		this.FullName = fullName;
		this.BankAccount = bankAccount;
		this.BankPage = bankPage;
	}
}

export class DalUser {
	ID: number;
	Login: string;
	ShortName: string;
	FullName: string;
	BankAccount: string;
	BankPage: string;

	constructor(id: number, login: string, shortName: string, fullName: string, bankAccount: string, bankPage: string) {
		this.ID = id;
		this.Login = login;
		this.ShortName = shortName;
		this.FullName = fullName;
		this.BankAccount = bankAccount;
		this.BankPage = bankPage;
	}
}

export class UserMapper {
	static ConvertToEntity(dal: DalUser): User {
		return new User(dal.ID, dal.Login, dal.ShortName, dal.FullName, dal.BankAccount, dal.BankPage);
	}

	static ConvertToDal(entity: User): DalUser {
		return new DalUser(entity.ID, entity.Login, entity.ShortName, entity.FullName, entity.BankAccount, entity.BankPage);
	}

	static ConvertToDalFromJson(data: any): DalUser {
		return new DalUser(Number(data.ID), data.Login, data.ShortName, data.FullName, data.BankAccount, data.BankPage);
	}

	static ConvertToJSONFromDAL(dal: DalUser): string {
		return JSON.stringify(dal);
	}
}
