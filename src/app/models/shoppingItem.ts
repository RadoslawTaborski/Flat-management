import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class ShoppingItem {
    Id: number;
    User: User;
    Name: string;
    Category: string;
    IsBought: number;
    AddDate: string;
    BoughtDate: string;
    
    constructor(Id: number, User:User, Name: string, Category: string, IsBought: number, AddDate: string, BoughtDate: string){
        this.Id = Id;
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
		return new ShoppingItem(dal.ID, InstanceFinder.getUserById(users, dal.Added),  dal.Name, dal.Category, dal.IsBought, dal.AddDate, dal.BoughtDate);
	}
	
	static ConvertToDal(entity: ShoppingItem): DalShoppingItem{
		return new DalShoppingItem(entity.Id, entity.User.Id, entity.Name, entity.Category, entity.IsBought, entity.AddDate, entity.BoughtDate);
	}
	
	static ConvertToDalFromJson(data: any): DalShoppingItem{
		return new DalShoppingItem(Number(data.ID), Number(data.Added), data.Name, data.Category, Number(data.IsBought), data.AddDate, data.BoughtDate);
	}
	
	static ConvertToJSONFromDAL(dal: DalShoppingItem): string{
		return JSON.stringify(dal);
	}
}
