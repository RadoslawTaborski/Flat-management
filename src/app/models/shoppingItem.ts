import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class ShoppingItem {
    ID: number;
    User: User;
    Name: string;
    Category: string;
    IsBought: number;
    AddDate: string;
    BoughtDate: string;
    
    constructor(ID: number, User:User, Name: string, Category: string, IsBought: number, AddDate: string, BoughtDate: string){
        this.ID = ID;
        this.User=User;
        this.Name=Name;
        this.Category=Category;
        this.IsBought=IsBought;
        this.AddDate=AddDate;
        this.BoughtDate=BoughtDate;
    }
}

export class DalShoppingItem{
	ID: number;
	Added: number;
	Name: string;
	Category: string;
	IsBought: number;
	AddDate: string;
	BoughtDate: string;
	
	constructor(id: number, userID: number, name: string, category: string, isBought: number, addDate: string, boughtDate: string){
		this.ID = id;
		this.Added=userID;
		this.Name=name;
		this.Category=category;
		this.IsBought=isBought;
		this.AddDate=addDate;
		this.BoughtDate=boughtDate;
	}
}

export class ShoppingItemMapper{
	static ConvertToEntity(dal: DalShoppingItem, users: User[]): ShoppingItem{
		//console.log(dal)
		return new ShoppingItem(dal.ID, InstanceFinder.getUserByID(users, dal.Added), dal.Name, dal.Category, dal.IsBought, dal.AddDate, dal.BoughtDate);
	}
	
	static ConvertToDal(entity: ShoppingItem): DalShoppingItem{
		//console.log(entity)
		return new DalShoppingItem(entity.ID, entity.User.ID, entity.Name, entity.Category, entity.IsBought, entity.AddDate, entity.BoughtDate);
	}
	
	static ConvertToDalFromJson(data: any): DalShoppingItem{
		return new DalShoppingItem(Number(data.ID), Number(data.Added), data.Name, data.Category, Number(data.IsBought), data.AddDate, data.BoughtDate);
	}
	
	static ConvertToJSONFromDAL(dal: DalShoppingItem): string{
		return JSON.stringify(dal);
	}
}
