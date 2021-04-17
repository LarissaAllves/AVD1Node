const express = require("express"); //carrega o express e armazena na variável

const server = express();

server.use(express.json());

//Crie um array com dois objetos contendo, o id, dia da semana, data da avd,
//disciplina, horário e professor.
const dataProva = [
  {
    id: 10,
    diaSemana: "Segunda",
    dateProva: "19/04/2021",
    disciplina: "Português",
    hora: "13h30",
    nomeProf: "Juliana",
  },
  {
    id: 11,
    diaSemana: "Terça",
    dateProva: "21/04/2021",
    disciplina: "Matemática",
    hora: "16h00",
    nomeProf: "Denise",
  },
];

const checkId = (req, res, next) => {
  const { id } = req.params;
  const exist = dataProva.some((prova) => prova.id == id);
  if (!exist) {
    return res
      .status(400)
      .json({ error: "Não existe data da prova com esse ID" });
  }
  return next();
};

const dateExists = (req, res, next) => {
  if (
    !req.body.diaSemana ||
    !req.body.dateProva ||
    !req.body.disciplina ||
    !req.body.hora ||
    !req.body.nomeProf
  )
    return res.status(400).json({
      Error:
        "O campo dia da semana ou data da avd ou disciplina ou horário ou professor não existe no corpo da requisição",
    });
  return next();
};

//Crie uma rota para listar todos as datas das provas (exibir o id, dia da semana, data
//da avd, disciplina, horário de professor).

server.get("/provas", (req, res) => {
  return res.json(dataProva);
});

//c)Crie uma rota para listar a data de prova pelo id. Se o id não existir deverá
//retornar a mensagem: Não existe data da prova com este id.

server.get("/provas/:id", checkId, (req, res) => {
  const { id } = req.params;
  const prova = dataProva.find((prova) => prova.id == id);

  return res.json(prova);
});

//Crie uma rota para incluir a data da prova no array. Deverá ser enviado um json com
//a dia da semana, data da avd, disciplina, horário e professor. Se um destes campos
//não for enviado a aplicação exibirá a mensagem: O campo dia da semana ou data da
//avd ou disciplina ou horário ou professor não existe no corpo da requisição.

server.post("/provas", dateExists, (req, res) => {
  const { diaSemana, dateProva, disciplina, hora, nomeProf } = req.body;

  const novoId = dataProva[dataProva.length - 1].id + 1;
  const prova = {
    id: novoId,
    diaSemana,
    dateProva,
    disciplina,
    hora,
    nomeProf,
  };

  dataProva.push(prova);
  return res.json(prova);
});

//e)Crie uma rota para alterar a data da prova. Deverá ser enviada o dia da semana, data
//da avd, disciplina, horário e professor. Se um destes campos não for enviado a
//aplicação exibirá a mensagem: O campo dia da semana ou data da avd ou disciplina
//ou horário ou professor não existe no corpo da requisição. Se o id que está sendo
//alterado não existir, deverá ser exibida a mensagem. Não existe data da prova com
//este íd.
server.put("/provas/:id", checkId, dateExists, (req, res) => {
  const { id } = req.params;
  const index = dataProva.findIndex((prova) => prova.id == id);

  const { diaSemana, dateProva, disciplina, hora, nomeProf } = req.body;

  const prova = {
    id: dataProva[index].id,
    diaSemana,
    dateProva,
    disciplina,
    hora,
    nomeProf,
  };

  dataProva[index] = prova;
  return res.json(prova);
});

//f) Crie uma rota para excluir uma data de prova pelo id. Se id da data da prova que está
//sendo excluído não existir, deverá ser exibida a mensagem. Não existe data da
//prova com este id. Exiba no console os dados da avd antes de ser excluído.
server.delete("/provas/:id", checkId, (req, res) => {
  const { id } = req.params;
  const index = dataProva.findIndex((prova) => prova.id == id);

  console.log(dataProva[index]);
  dataProva.splice(index, 1);
  return res.json(dataProva);
});

//Crie uma rota que se informar o nome do professor deverá ser exibido todas as
//disciplinas que ele irá aplicar avd. ((dia da semana, data da avd, horário e professor).
//Se não existir o professor deverá ser retornado a mensagem Não existe data da avd
//para este professor.

server.get("/professor/:nome", (req, res) => {
  const exists = dataProva.some((prova) => prova.nomeProf == req.params.nome);

  if (!exists) {
    res.status(400).json({ erro: "Professor nao existe" });
    return;
  }
  const provas = dataProva
    .filter((prova) => prova.nomeProf == req.params.nome)
    .map((prova) => {
      return {
        diaSemana: prova.diaSemana,
        dateProva: prova.dateProva,
        hora: prova.hora,
        nomeProf: prova.nomeProf,
      };
    });

  return res.json(provas);
});

//h) Crie uma rota que se informar o nome da disciplina deverá ser exibido as
//informações do dia da prova (dia da semana, data da avd, horário e professor). Se
//não existir o nome da disciplina deverá ser retornado a mensagem Não existe data
//da avd para esta disciplina.
server.get("/disciplinas/:disciplina", (req, res) => {
  const exists = dataProva.some(
    (prova) => prova.disciplina == req.params.disciplina
  );
  if (!exists) {
    res
      .status(400)
      .json({ erro: "Não existe data da avd para esta disciplina." });
    return;
  }
  const prova = dataProva.find(
    (prova) => prova.disciplina == req.params.disciplina
  );
  return res.json(prova);
});

server.listen(3333, () => {
  console.log("Servidor Rodando");
});
