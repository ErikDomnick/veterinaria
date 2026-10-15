//INICIO
import express from 'express';

const app = express();
app.use(express.json());
app.use("/pets");



//DADOS MALIGNOS
let ultimoId = 3;
let pets = [
    {idPet: 1, dsNome: "Rex", dsEspecie: "cachorro", nuIdade: 3, fgAdotado: false},
    {idPet: 2, dsNome: "Negoney", dsEspecie: "humano", nuIdade: 9, fgAdotado: false},
    {idPet: 3, dsNome: "Manga", dsEspecie: "fruta", nuIdade: 1, fgAdotado: false}
];



//FUNCOES DO CONTROLLERS SÓ QUE NAO NO CONTROLLERS
export function findAll(res) {
    return pets;
};

export function findOne(id) {
    let pet = pets.find(pet => pet.idPet === id);

    return pet;
};

export function cadPet(nome, especie, idade) {
    let novoId = ultimoId + 1;
    ultimoId++;

    let novoPet = {
        idPet: novoId,
        dsNome: nome,
        dsEspecie: especie,
        nuIdade: idade,
        fgAdotado: false
    };

    pets.push(novoPet);
    return novoPet;
};

export function attPet(id, nome, especie, idade, adotado) {
    let indexPet = pets.findIndex(pet => pet.idPet === id);

    if (indexPet === -1) {
        return null; 
    }

    const petAtual = pets[indexPet];

    // ?? verifica se é nulo ou indefinido, entao se no body nao tem, ele permanece como tava antes
    const petEdit = {
        idPet: id,
        dsNome: nome ?? petAtual.dsNome,
        dsEspecie: especie ?? petAtual.dsEspecie,
        nuIdade: idade ?? petAtual.nuIdade,
        fgAdotado: adotado ?? petAtual.fgAdotado
    };

    pets.splice(indexPet, 1, petEdit);

    return petEdit;
};

export function removerPet(id) {
    let indexPet = pets.findIndex(pet => pet.idPet === id);

    pets.splice(indexPet, 1);
};



//ROTAS
app.get("/", (req, res) => {
    const todosOsPets = findAll();
    res.status(200).json(todosOsPets);
});

app.get("/:id", (req, res) => {
    const idPet = parseInt(req.params.id);

    if(isNaN(idPet)) {
        return res
            .status(400) //requisicao mal formada
            .json({ "mensagem": "identificador deve ser um numero" });
    }

    let pet = findOne(idPet);

    if(!pet) {
        res.sendStatus(404);
    }

    res.status(200).json(pet);
});

app.post("/", (req, res) => {
    let nomeEnviado = req.body.dsNome;
    let especieEnviada = req.body.dsEspecie;
    let idadeEnviada = req.body.nuIdade;

    if (!nomeEnviado || !especieEnviada) {
        return res
            .status(400)
            .json({ "mensagem": "dados faltando, verifique nome e especie" });
    }

    if(!nuIdade || isNaN(nuIdade) || nuIdade < 0) {
        return res
            .status(400)
            .json({ "mensagem": "verifique se idade é um número positivo, e se idade nao está vazia" });
    }

    let petCriado = cadPet(nomeEnviado, especieEnviada, idadeEnviada);
    if(!petCriado) {
        return res
        .status(500)
        .json({ "mensagem": "algo deu errado" });
    }

    return res.status(201).json(petCriado);
});

app.patch("/:id", (req, res) => {
    const idPet = parseInt(req.params.id);

    const novoNome = req.body.dsNome;
    const novaEspecie = req.body.dsEspecie;
    const novaIdade = req.body.nuIdade;
    const novoAdotado = req.body.fgAdotado;
    
    if(isNaN(idPet)) {
        return res
            .status(400)
            .json({ "mensagem": "identificador deve ser um numero" });
    }

    if(isNaN(novaIdade) || novaIdade < 0) {
        return res
            .status(400)
            .json({ "mensagem": "idade deve ser um numero positivo" });
    }

    if(novoNome.trim() === "" || novaEspecie.trim() === "" ) {
        return res
            .status(400)
            .json({ "mensagem": "nome ou especie vazios" });
    }

    if(novoAdotado !== false || novoAdotado !== true) {
        return res
            .status(400)
            .json({ "mensagem": "adotado deve ser um valor booleano, false ou true" });
    }

    let petAtt = attPet(idPet, novoNome, novaEspecie, novaIdade, novoAdotado);

    if(!petAtt) {
        return res.status(500).json({ "mensagem": "algo deu errado" });
    }

    let pet = findOne(idPet);
    if(!pet) {
        res.sendStatus(404);
    }

    res.status(200).json(petAtt);
});

app.delete("/:id", (req, res) => {
    const idPet = parseInt(req.params.id);

    if(isNaN(idPet)) {
        res
        .status(400)
        .json({ "mensagem": "identificador deve ser um numero" });
    }

    let pet = findOne(idPet);
    if(!pet) {
        res.sendStatus(404);
    }

    removerPet(idPet);
    res.sendStatus(204);
});


//FINAL
app.listen(3000);