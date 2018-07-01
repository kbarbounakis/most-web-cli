import {EdmMapping,EdmType} from '@themost/data/odata';
import Account = require('./account-model');

/**
 * @class
 */
@EdmMapping.entityType('Group')
class Group extends Account {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    public members?: Array<Account|any>; 
    public id?: number; 
}

export = Group;
