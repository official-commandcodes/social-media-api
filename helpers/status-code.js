class Status {
  SUCCESS = 200;
  CREATED = 201;
  BAD_REQUEST = 400;
  UNAUTHORIZED = 401;
  FORBIDDEN = 403;
  NOTFOUND = 404;
  SERVER_ERROR = 500;
}

module.exports = new Status();
