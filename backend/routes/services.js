import Service from '../models/Service.js';
import crudRouter from './crudFactory.js';

export default crudRouter(Service, { searchFields: ['title', 'shortDescription', 'category'], label: 'Service' });
