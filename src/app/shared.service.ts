import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable()
export class SharedService {
    static users: User[] = [];
    static usersFilters: string[] = []

    static isNullOrWhiteSpace(str): boolean {
        if (str == null) return true;
        return str.replace(/\s/g, '').length == 0;
    }

    static str2Int(x: string): number {
        console.log(x);
        if (!this.isNullOrWhiteSpace(x)) {
            x = x.replace(",", ".");
            console.log(x);
            let result = Number(x);
            if (isNaN(result)) {
                return 0;
            }
            return result;
        }
        return 0;
    }
}
