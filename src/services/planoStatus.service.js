import angular from 'angular';

const MESSAGES = {
  ELABORANDO: {
    AUTOR: 'Em elaboração',
    REVISOR: 'Em elaboração pelo aluno',
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
  ELABORANDO: ['ENVIADO_REVISAO'],
  ENVIADO_REVISAO: ['REVISANDO'],
  REVISANDO: ['REVISADO'],
  REVISADO: []
};

class PlanoStatus {

  constructor() {
    const constantes = {
      ELABORANDO: 'ELABORANDO',
      ENVIADO_REVISAO: 'ENVIADO_REVISAO',
      REVISANDO: 'REVISANDO',
      REVISADO: 'REVISADO',
      AUTOR: 'AUTOR',
      REVISOR: 'REVISOR'
    };

    Object.assign(this, constantes);
  }

  getMessage(status, agent) {
    return MESSAGES[status][agent];
  }

  getNextStatuses(status) {
    return FLOW[status];
  }

}

export default angular.module('services.PlanoStatus', [])
  .service('PlanoStatus', PlanoStatus)
  .name;
