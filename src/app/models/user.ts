export class User {
    Id: number;
    Login: string;

    constructor(Id: number, Login: string){
        this.Id = Id;
        this.Login=Login;
    }
}

export class DalUser{
	ID: number;
	Login: string;
	
	constructor(id: number, login:string){
		this.ID = id;
		this.Login = login;
	}
} 

export class UserMapper{
	static ConvertToEntity(dal: DalUser): User{
		return new User(dal.ID, dal.Login);
	}
	
	static ConvertToDal(entity: User): DalUser{
		return new DalUser(entity.Id, entity.Login);
	}
	
	static ConvertToDalFromJson(data: any): DalUser{
		return new DalUser(Number(data.ID), data.Login);
	}
	
	static ConvertToJSONFromDAL(dal: DalUser): string{
		return JSON.stringify(dal);
	}
}
