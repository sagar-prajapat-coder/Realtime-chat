class ResponseBuilder {
  constructor(status) {
    this.status = status;
    this.message = null;
    this.data = null;
    this.httpCode = 200;
    this.meta = null;
    this.link = null;
    this.authToken = null;
  }

  static success(data = null, message = null, httpCode = 200) {
    return this.asSuccess()
      .withData(data)
      .withMessage(message)
      .withHttpCode(httpCode);
  }

  static successWithPagination(
    query,
    data = null,
    message = null,
    httpCode = 200
  ) {
    return this.asSuccess()
      .withData(data)
      .withMessage(message)
      .withHttpCode(httpCode)
      .withPagination(query);
  }

  static successWithToken(token, data = null, message = null, httpCode = 200) {
    return this.asSuccess()
      .withAuthToken(token)
      .withData(data)
      .withMessage(message)
      .withHttpCode(httpCode);
  }

  static error(message, httpCode = 400, data = null) {
    return this.asError()
      .withData(data)
      .withMessage(message)
      .withHttpCode(httpCode);
  }

  static successMessage(message, httpCode = 200, data = null) {
    return this.asSuccess()
      .withData(data)
      .withMessage(message)
      .withHttpCode(httpCode);
  }

  static asSuccess() {
    return new this(true);
  }

  static asError() {
    return new this(false);
  }

  withMessage(message = null) {
    this.message = message;
    return this;
  }

  withData(data = null) {
    this.data = data;
    return this;
  }

  withHttpCode(httpCode = 200) {
    this.httpCode = httpCode;
    return this;
  }

  withPagination(query) {
    this.meta = {
      total_page: query.lastPage || 0,
      current_page: query.currentPage || 0,
      total_item: query.total || 0,
      per_page: query.perPage || 0,
    };

    this.link = {
      next: query.hasMorePages || false,
      prev: Boolean(query.previousPageUrl),
    };

    return this;
  }

  withAuthToken(token = null) {
    this.authToken = token;
    return this;
  }

  build(res = null) {
    const response = { status: this.status };

    if (this.message !== null) response.message = this.message;
    if (this.authToken !== null) response.token = this.authToken;
    if (this.data !== null) response.data = this.data;
    if (this.meta !== null) response.meta = this.meta;
    if (this.link !== null) response.link = this.link;

    if (res) {
      return res.status(this.httpCode).json(response);
    }

    return { httpCode: this.httpCode, response };
  }

  static json(
    message = "",
    data = {},
    httpCode = 200,
    errors = null,
    headers = {}
  ) {
    if (Object.keys(data).length === 0) data = {};
    if (!errors) errors = {};

    const body = {
      message: message,
      errors: errors,
      data: data,
    };

    return {
      statusCode: httpCode,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
}

export default ResponseBuilder;
