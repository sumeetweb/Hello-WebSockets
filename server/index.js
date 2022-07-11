const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const port = 3000;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
  console.log(`Total Connections :  ${wss.clients.size}`);
  ws.on('message', function incoming(data) {
    let d = JSON.parse(data.toString());
    // let dataObj = {
    //     sender: d.sender,
    //     message: d.message,
    //     receiver: d.receiver,
    // };
    ws.id = d.sender;
    console.log(JSON.stringify(d));

    if(d.receiver === '') {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      })
    } else {
      let sentMsg = false;
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN && client.id === d.receiver) {
          client.send(data.toString());
          sentMsg = true;
        }
      })
      if(!sentMsg) {
        ws.send(JSON.stringify({  sender: "System", message: `${d.receiver} is offline...`, receiver: d.sender }));
      }

    }

  })

})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})