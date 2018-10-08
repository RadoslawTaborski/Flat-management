export class Balance {
    Id: number;
    User1Id: number;
    User2Id: number;
    Value: number;

    constructor(Id: number, User1Id:number, User2Id:number, Value: number){
        this.Id = Id;
        this.User1Id=User1Id;
        this.User2Id=User2Id;
        this.Value=Value;
    }
}