class ResponseBuilder {
    constructor(message, statusCode, data) {
      this.message = message;
      this.statusCode = statusCode;
      this.data = data;
    }
  
    static successMessage(message, statusCode, data) {
      return new ResponseBuilder(message, statusCode, data);
    }
    static errorMessage(message, statusCode, data = null) {
      return new ResponseBuilder(message, statusCode, data = null);
    }
  
    build(resp) {
      return resp.status(this.statusCode).json({
        statusCode: this.statusCode,
        message: this.message,
        data: this.data,
      });
    }
  }
  
  export default ResponseBuilder; 