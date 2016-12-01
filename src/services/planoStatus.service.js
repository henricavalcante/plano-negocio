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
    if (!projeto) projeto = "semprojeto";

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
        if (statusAtual == this.STATUSES.ELABORANDO && status == this.STATUSES.ENVIADO_REVISAO) {
          throw 'Você deve concluir todas as etapas do plano antes de enviar para correção.';
        } else if (statusAtual == this.STATUSES.ENVIADO_REVISAO && status == this.STATUSES.ENVIADO_REVISAO) {
          throw 'Seu plano de negócio já foi enviado para a revisão dos especialistas. A ferramenta continuará disponível para visualização, mas ficará bloqueada para edição até que a revisão seja finalizada. Isso poderá levar 7 dias úteis.';
        } else if (statusAtual == this.STATUSES.REVISANDO && status == this.STATUSES.ENVIADO_REVISAO) {
          throw 'Neste momento algum especialista está revisando o seu plano de negócios, aguarde a conclusão para que você possa efetuar as devidas correções.';
        } else if (statusAtual == this.STATUSES.REVISADO && status == this.STATUSES.REVISADO) {
          throw 'A revisão do plano já foi enviada para o aluno.';
        } else if (statusAtual == this.STATUSES.ENVIADO_REVISAO && status == this.STATUSES.REVISADO) {
          throw 'É necessário salvar o plano antes que ele seja enviado de volta para o aluno.';
        } else if (statusAtual == this.STATUSES.REVISADO && status == this.STATUSES.REVISANDO) {
          throw 'Não é posivel salvar alterações em um plano de negócios que já foi enviado para o aluno.';
        } else {
          throw `Não é permitido salvar este plano de negócio com o status ${status} pois o status atual do plano é ${statusAtual}`;
        }


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
