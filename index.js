//INICIO
import express from 'express';

const app = express();
app.use(express.json());
app.use("/veterinaria");



//DADOS MALIGNOS
let ultimoId = 3;
let pets = [
    {idPet: 1, desNome: "Rex", dsEspecie: "cachorro", nuIdade: 3, fgAdotado: false},
    {idPet: 2, desNome: "Negoney", dsEspecie: "humano", nuIdade: 9, fgAdotado: false},
    {idPet: 3, desNome: "Manga", dsEspecie: "fruta", nuIdade: 1, fgAdotado: false}
];



//FUNCOES DO CONTROLLERS SÓ QUE NAO NO CONTROLLERS
export function findAll(res) {
    /*let todosOsLivros = livros; // (res -> router -> controller -> router -> res) controller nao conhece o res
    return todosOsLivros*/

    //res.json(livros); // triangulo (res -> router -> controller -> res), controller conhece o res

    return livros;
};

export function findOne(id) {
    let livro = livros.find(livro => livro.idLivro === id);

    return livro;
};

export function criarLivro(titulo, autor) {
    let novoId = ultimoId + 1;
    ultimoId++;

    let novoLivro = {
        idLivro: novoId,
        stTitutlo: titulo,
        stAutor: autor,
        blDisponivel: true
    };

    livros.push(novoLivro);
    return novoLivro;
};

export function deletarLivro(id) {
    let indexLivro = livros.findIndex(livro => livro.idLivro === id);

    livros.splice(indexLivro, 1);
};

export function editarLivro(id, titulo, autor, disp) {
    let indexLivro = livros.findIndex(livro => livro.idLivro === id);

    if (indexLivro === -1) {
        return null; 
    }

    const livroAtual = livros[indexLivro];

    const livroEdit = {
        idLivro: id,
        stTitulo: titulo ?? livroAtual.stTitulo,
        stAutor: autor ?? livroAtual.stAutor,
        blDisponivel: disp ?? livroAtual.blDisponivel
    };

    livros.splice(indexLivro, 1, livroEdit);

    return livroEdit;
};



//ROTAS
router.get("/", cLog, (req, res) => {
    /*const todosOsLivros = findAll(); //controller nao conhece o res
    console.log(todosOsLivros);*/

    //findAll(res); // triangulo, controller conhece o res

    const todosOsLivros = findAll();
    res.json(todosOsLivros);
});

router.get("/:id", cLog, (req, res) => {
    const idLivro = parseInt(req.params.id);

    if(isNaN(idLivro)) {
        return res
            .status(400) //requisicao mal formada
            .json({mensagem: "o parametro precisa ser um numero valido"});
    }

    let livro = findOne(idLivro);

    if(!livro) {
        res.status(404).send();
    }

    res.json(livro);
});

router.post("/", cLog, (req, res) => {
    let tituloEnviado = req.body.stTitulo;
    let autorEnviado = req.body.stAutor;

    if (!autorEnviado || !tituloEnviado) {
        return res
            .status(400)
            .json({ mensagem: "dados faltando, verifique autor e titulo" });
    }

    let livroCriado = criarLivro(tituloEnviado, autorEnviado);
    if(!livroCriado) {
        return res.status(500).json({ mensagem: "algo deu errado" });
    }

    return res.status(201).json(livroCriado);
});

router.delete("/:id", cLog, (req, res) => {
    const idLivro = parseInt(req.params.id);

    if(isNaN(idLivro)) {
        res.status(400).json({ mensagem: "identificador deve ser um numero" });
    }

    let livro = findOne(idLivro);
    if(!livro) {
        res.status(404).send();
    }

    deletarLivro(idLivro);
    res.sendStatus(204);
});

router.patch("/:id", cLog, (req, res) => {
    const idLivro = parseInt(req.params.id);

    const novoTitulo = req.body.stTitulo;
    const novoAutor = req.body.stAutor;
    const novoDisponivel = req.body.blDisponivel;
    
    if(isNaN(idLivro)) {
        return res
            .status(400)
            .json({ mensagem: "identificador precisa ser um numero valido" });
    }

    let livroAtt = [editarLivro(idLivro, novoTitulo, novoAutor, novoDisponivel)];

    if(!livroAtt) {
        return res.status(500).json({ mensagem: "algo deu errado" });
    }

    res.sendStatus(204);
});



//FINAL
app.listen(3000);