import angular from 'angular';
import FirebaseFactory from './firebaseFactory.service';

const MESSAGES = {
  ELABORANDO: {
    AUTOR: 'Em elaboração',
    REVISOR: 'Em elaboração pelo aluno',
  },
  ELABORADO: {
    AUTOR: 'Pronto para enviar para correção',
    REVISOR: 'Elaborado, mas não enviado',
  },
  ENVIADO_REVISAO: {
    AUTOR: 'Aguardando revisão',
    REVISOR: 'A ser revisado'
  },
  REVISANDO: {
    AUTOR: 'Em revisão',
    REVISOR: 'Revisão em andamento'
  },
  REVISADO: {
    AUTOR: 'Revisado',
    REVISOR: 'Revisado'
  }
};

const FLOW = {
  ELABORANDO: 'ELABORADO',
  ELABORADO: 'ENVIADO_REVISAO',
  ENVIADO_REVISAO: 'REVISANDO',
  REVISANDO: 'REVISADO',
  REVISADO: ''
};

const STATUSES = {
  ELABORANDO: 'ELABORANDO',
  ELABORADO: 'ELABORADO',
  ENVIADO_REVISAO: 'ENVIADO_REVISAO',
  REVISANDO: 'REVISANDO',
  REVISADO: 'REVISADO',
};

const AGENTS = {  
  AUTOR: 'AUTOR',
  REVISOR: 'REVISOR'
};

class PlanoStatus {

  constructor(FirebaseFactory) {
    Object.assign(this, {STATUSES, AGENTS, FirebaseFactory});
  }

  getStatus(status, agent) {
    if (!status) return;

    return MESSAGES[status][agent];
  }

  setStatus(projeto, uid, status) {
    let path = `/planos/${projeto}/${uid}/status`;
    
    return this.FirebaseFactory.get(path)
    .then((res) => res.json())
    .then((statusAtual) => {
      if (this.getNextStatus(statusAtual) !== status && status !== statusAtual) {
        throw 'Nâo permitido';
      } else {
        return status;
      }
    })
    .then((status) => {
      this.FirebaseFactory.set(path, status);
    })
  }

  getStatuses(agent) {
    return Object.keys(STATUSES).map((obj) => {
      return {key: obj, value: this.getStatus(obj, agent)};
    });
  }

  getNextStatus(status) {
    return FLOW[status];
  }

}

export default angular.module('services.PlanoStatus', [FirebaseFactory])
  .service('PlanoStatus', PlanoStatus)
  .name;
