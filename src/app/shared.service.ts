import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable()
export class SharedService {
    static users: User[] = [];
    static usersFilters: string[] = []
}
