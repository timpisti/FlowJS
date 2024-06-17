import { BehaviorSubject } from 'rxjs';

class FlowUser {
  constructor() {
    this.userSubject = new BehaviorSubject(false);
  }

  setUser(user) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }
}

// Expose the FlowUser service globally
window.flowUser = new FlowUser();

export default window.flowUser;
