var http = require('http');
const PORT=7000;

function handleRequest(request, response){
    response.end(JSON.stringify({manager: 'Ms ' + request.url.substring(1)}));
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});