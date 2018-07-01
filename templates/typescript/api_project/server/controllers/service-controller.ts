import {HttpServiceController} from '@themost/web';
import {httpController} from '@themost/web/decorators';

@httpController()
class ServiceController extends HttpServiceController {
    constructor() {
        super();
    }
}

export = ServiceController;