import angular from 'angular';
import PlanoStatus from './planoStatus.service';
import FirebaseFactory from './firebaseFactory.service';


class Plano {
  constructor(FirebaseFactory, PlanoStatus) {
    Object.assign(this, {FirebaseFactory, PlanoStatus});
  }

  enviarParaCorrecao(projeto, uid) {
    FirebaseFactory.set(`/planos/${projeto}/${uid}/status`, PlanoStatus.ENVIADO_REVISAO);
  }

}

export default angular.module('services.Plano', [FirebaseFactory, PlanoStatus])
  .service('Plano', Plano)
  .name;
