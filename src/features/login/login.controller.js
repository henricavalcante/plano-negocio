export default class LoginController {
    constructor($scope, $rootScope, FirebaseFactory) {
        Object.assign(this, { FirebaseFactory, $rootScope });
    }

    facebook() {
        this.FirebaseFactory.authFacebook().then((result) => {

            this.$rootScope.currentUser = result.user;

        }).catch((error) => {
            this.$rootScope.currentUser = {fail:true};
        });
    }

    twiter() {
        this.FirebaseFactory.authTwitter();
    }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory'];
