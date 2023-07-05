const uuid = require("uuid");
const express = require("express");

const app = express();
app.use(express.json());

const pedidos = [];


const CheckPedidoID = (request, response, next) => {
    const { id } = request.params;
    const index = pedidos.findIndex((pedido) => pedido.id === id);

    if(index < 0) {
        return response.status(404).json({ error: "id de pedido nao encontrado" });
    }

    request.userIndex = index
    next()
};

const logs = (request, response, next) => {
    console.log(`Método: ${request.method}`);
    console.log(`URL: ${request.originalUrl}`);
    next();
  };

// lista pedidos
app.get("/order",logs, (request, response) => {
    return response.status(200).json(pedidos);
  });

//rota que deleta um pedido de um id espec'ifico
app.delete("/order/:id", CheckPedidoID, logs, (request, response) => {
  const { pedidoIndex } = request; // Usar pedidoIndex ao invés de index
  pedidos.splice(pedidoIndex, 1);
  return response.status(204).json();
});

//retorna pedido especifico
app.get("/order/:id",CheckPedidoID, logs, (request, response) => {

    const index = request.userIndex
   // console.log(pedidos[index])
    return response.status(200).json(pedidos[index])
})

// atualiza status do pedido
app.patch("/order/:id", CheckPedidoID, logs, (request, response) => {
    
    const index = request.userIndex
    
    const NewStatus = request.body;

    
    pedidos[index].status = NewStatus.status;
    return response.status(200).json(pedidos[index]);

});


//rota que edita uma informacao especifica do pedido
app.put("/order/:id", CheckPedidoID, logs, (request, response) => {
  const { order, clientName, price, status } = request.body;

  const index = request.userIndex


  // Atualizar as propriedades fornecidas no corpo da requisição
  if (order) {
    pedidos[index].order = order;
  }
  if (clientName) {
    pedidos[index].clientName = clientName;
  }
  if (price) {
    pedidos[index].price = price;
  }
  if (status) {
    pedidos[index].status = status;
  }

  return response.status(200).json(pedidos[index]);
});

//rota que cria o pedido
app.post("/order", logs, (request, response) => {
  const { order, clientName, price } = request.body;

  const pedido = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    status: "preparando",
  };
  pedidos.push(pedido);
  return response.status(201).json(pedidos);
});

app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
