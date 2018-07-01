import {EdmMapping,EdmType} from '@themost/data/odata';
import Thing = require('./thing-model');

/**
 * @class
 */
@EdmMapping.entityType('Account')
class Account extends Thing {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    public id?: number; 
}

export = Account;
