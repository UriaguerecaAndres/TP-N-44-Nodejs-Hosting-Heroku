const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');
const { freemem } = require('os');
const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
console.log('Listening on port %d', server_port);
});

function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var vec=[' '];
    var x= parseInt(formulario['num']);
    var A=x, B=0;
    for (var i = 0; i < x; i++) {
        if(A>0){
            for (var j = 0; j <= A; j++) {
                vec.push(" ");
            }
        }
        for(var y=0; y<=i; y++){
            vec.push("*");
            if (B>0 ){
                vec.push("o");
            }           
        }
        if (A==x) vec.shift();
        if(A!=x) vec.pop();
        vec.push("<br>");
        A--; B++;
    }
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    var pagina=
      `<!doctype html>
        <html>
          <head>
            <meta charset="UTF-8">
            <link href="./css/bootstrap.min.css" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@1,300&display=swap" rel="stylesheet">
          </head><body class="bg-dark">
      <div class="container pt-3">
            <div class="display-4 text-left text-warning font-italic">
                Graficar figura:
            </div>
            <div class="row justify-content-center pt-4">
                <div class="col-md-10">
                  <div class="row justify-content-center">
                    <div class="col-xl">  
                      <pre class="text-light">`;
    for (var i=0; i<vec.length; i++){
        if(vec[i]!=','){
            pagina+=vec[i];
        }
    }
    pagina+=`</pre></div></div></div></div></body></html>`;
    respuesta.end(pagina);
  });	
}
console.log('Servidor web iniciado');
