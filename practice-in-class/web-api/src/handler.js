import { parse } from 'node:url';
import { DEFAULT_HEADER } from './util/util.js';

const allRoutes = {

  '/heroes:get': (request, response) => {
    response.write('GET: Hello World');
    response.end();
  },

  //404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write('Error not found!');
    response.end();
  }
}

function handler(request, response) {
  const {
    url,
    method
  } = request;

  const {
    pathname,
  } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  
  const chosenRoute = allRoutes[key] || allRoutes.default;
  
  return Promise.resolve(chosenRoute(request, response))
    .catch(handlerError(response))
}


function handlerError(response) {
  return error => {
    console.log('Something bad has happened**', error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({
      error: 'Internal server error!!',
    }));
    return response.end()
  }
}

export default handler;