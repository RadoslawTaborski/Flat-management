export class ShoppingItem {
    Id: number;
    UserId: number;
    Name: String;
    Category: String;
    IsBought: number;
    
    constructor(Id: number, UserId:number, Name: string, Category: string, IsBought: number){
        this.Id = Id;
        this.UserId=UserId;
        this.Name=Name;
        this.Category=Category;
        this.IsBought=IsBought;
    }
}
