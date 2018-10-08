export class Payment {
    Id: number;
    User1Id: number;
    User2Id: number;
    Name: String;
    Value: number;
    IsReturn: number;

    constructor(Id: number, User1Id:number, User2Id:number, Name: string, Value: number, IsReturn: number){
        this.Id = Id;
        this.User1Id=User1Id;
        this.User2Id=User2Id;
        this.Name=Name;
        this.Value=Value;
        this.IsReturn=IsReturn;
    }
}
