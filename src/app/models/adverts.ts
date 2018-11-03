import { User } from "./user";
import { InstanceFinder } from "./instance.finder";

export class Advert {
    ID: number;
    Text: string;
    User: User;
    AddDate: string;
    EndDate: string;

	constructor(ID: number, Text: string, User: User, AddDate: string, EndDate: string) {
        this.ID = ID;
        this.Text=Text;
		this.User = User;
		this.AddDate = AddDate;
		this.EndDate = EndDate;
	}
}

export class DalAdvert {
    ID: number;
    Text: string;
    Added: number;
    AddDate: string;
    EndDate: string;

	constructor(id: number, text: string, userID: number, addDate: string, endDate: string) {
		this.ID = id;
        this.Added = userID;
        this.Text=text;
		this.AddDate = addDate;
		this.EndDate = endDate;
	}
}

export class AdvertMapper {
	static ConvertToEntity(dal: DalAdvert, users: User[]): Advert {
		return new Advert(dal.ID, dal.Text, InstanceFinder.getUserByID(users, dal.Added), dal.AddDate, dal.EndDate);
	}

	static ConvertToDal(entity: Advert): DalAdvert {
		return new DalAdvert(entity.ID, entity.Text, entity.User.ID, entity.AddDate, entity.EndDate);
	}

	static ConvertToDalFromJson(data: any): DalAdvert {
		return new DalAdvert(Number(data.ID), data.Text, Number(data.Added), data.AddDate, data.EndDate);
	}

	static ConvertToJSONFromDAL(dal: DalAdvert): string {
		return JSON.stringify(dal);
	}
}