export default {
  _user: null,
  set user(data) {
    this._user = data;
    localStorage.setItem('user', JSON.stringify(data));
  },
  get user() {
    return this._user || JSON.parse(localStorage.getItem('user'));
  }
}
