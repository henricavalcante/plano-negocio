import angular from 'angular';

export default angular.module('factory.user', [])
  .factory('User', () => {

    function User(data) {
      if (data) {
        this.setData(data)
      }
    }

    User.prototype.setData = function (data) {
      const model = {
        agrupador: '',
        email: '',
        idalunoturmaedcmidia: '',
        key: '',
        nome: '',
        password: '',
        projeto: '',
        telefone: '',
        url_api: '',
        wmode: '',
        prof: ''
      };

      const user = {};

      for (var key in model) {
        if (data.hasOwnProperty(key)) {
          user[key] = data[key];
        }
      }

      angular.extend(this, user);
    };

    return User;
  })
  .name;
