import { Subject } from 'rxjs';

// Create a shared RxJS service
const myService = new Subject();

// Expose the service globally
window.myService = myService;

export { myService };