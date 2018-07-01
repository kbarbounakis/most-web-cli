import {httpController,httpGet, httpAction} from '@themost/web/decorators';
import {HttpDataModelController} from "@themost/web";

@httpController()
class DataController extends HttpDataModelController {
    
    constructor() {
        super();
    }
}

export = DataController;