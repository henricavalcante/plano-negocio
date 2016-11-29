import angular from 'angular';
import FirebaseFactory from './firebaseFactory.service';

const MESSAGES = {
  ELABORANDO: {
    AUTOR: 'Em elaboração',
    REVISOR: 'Em elaboração pelo aluno',
  },
  ELABORADO: {
    AUTOR: 'Pronto para ser enviado para correção',
    REVISOR: 'Elaborado, mas não enviado',
  },
  ENVIADO_REVISAO: {
    AUTOR: 'Enviado para correção. Aguardando revisão',
    REVISOR: 'A ser revisado'
  },
  REVISANDO: {
    AUTOR: 'Revisão em andamento',
    REVISOR: 'Revisão em andamento'
  },
  REVISADO: {
    AUTOR: 'Plano Revisado', //Seu plano foi revisado, promova as alterações necessárias e envie novamente para a correção?
    REVISOR: 'Revisado'
  }
};

const FLOW = {
  ELABORANDO: ['ELABORADO'],
  ELABORADO: ['ENVIADO_REVISAO'],
  ENVIADO_REVISAO: ['REVISANDO'],
  REVISANDO: ['REVISANDO', 'REVISADO'],
  REVISADO: ['ENVIADO_REVISAO']
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

      var isStatusAllowed = false;
      var nextStatuses = this.getNextStatuses(statusAtual);

      nextStatuses.forEach(function(nextStatus) {
        if(nextStatus === status) {
          isStatusAllowed = true;
        }
      });

      if (!isStatusAllowed) {
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

  getNextStatuses(status) {
    return FLOW[status];
  }

}

export default angular.module('services.PlanoStatus', [FirebaseFactory])
  .service('PlanoStatus', PlanoStatus)
  .name;
