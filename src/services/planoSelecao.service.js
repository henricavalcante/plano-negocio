import angular from 'angular';
import FirebaseFactory from './firebaseFactory.service';

const STATUSES = {
  NAO_SELECIONADO: 'Não selecionado',
  SELECIONADO_CREDITO: 'Selecionado para crédito',
  SELECIONADO_PREMIO: 'Selecionado para premiação',
  PREMIADO: 'Premiado'
};

class PlanoSelecao {
  constructor(FirebaseFactory) {
    Object.assign(this, {STATUSES, FirebaseFactory});
  }

  setStatus(projeto, uid, status, selected) {
    if (!projeto) projeto = "semprojeto";

    let path = `/planos/${projeto}/${uid}/${status}`;
    return this.FirebaseFactory.set(path, selected);
  }

  getStatuses(agent) {
    return Object.keys(STATUSES).map((obj) => {
      return {key: obj, value: this.getStatus(obj, agent)};
    });
  }
}

export default angular.module('services.PlanoSelecao', [FirebaseFactory])
  .service('PlanoSelecao', PlanoSelecao)
  .name;
