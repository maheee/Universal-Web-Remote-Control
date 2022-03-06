
var createUWRC = (function () {
  var ctx = {
    conns: {},
    onReady: null,
    onConn: null,
    onData: null
  };

  ctx.createLink = function (remote) {
    return remote + "?peerId=" + ctx.peerId;
  };

  ctx.init = function () {
    var peer = new Peer();

    peer.on('open', function (id) {
      ctx.peerId = id;
      if (ctx.onReady) {
        ctx.onReady(id);
      }
    });

    peer.on('connection', function (conn) {
      ctx.conns[conn.peer] = conn;

      if (ctx.onConn) {
        ctx.onConn(conn.peer);
      }

      conn.on('data', function (data) {
        if (ctx.onData) {
          ctx.onData(conn.peer, data);
        }
      });
    });
  };

  ctx.send = function (peer, data) {
    if (ctx.conns[peer]) {
      ctx.conns[peer].send(data);
    }
  };

  ctx.broadcast = function (data) {
    for (var peer in ctx.conns) {
      ctx.send(peer, data);
    }
  };

  return function () {
    return ctx;
  };

})();
