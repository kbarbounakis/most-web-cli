import {EdmMapping, EdmType} from '@themost/data/odata';
import Account = require('./account-model');
import Group = require('./group-model');

/**
 * @class
 */
@EdmMapping.entityType('User')
class User extends Account {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    public lockoutTime?: Date; 
    public logonCount?: number; 
    public enabled?: boolean; 
    public lastLogon?: Date; 
    public groups?: Array<Group|any>; 
    public userFlags?: number; 
    public id?: number; 
    
    @EdmMapping.func('me', 'User')
    static async getMe(context) {
        return await context.model('User').where('name').equal(context.user.name).getItem();
    }
    
}

export = User;
