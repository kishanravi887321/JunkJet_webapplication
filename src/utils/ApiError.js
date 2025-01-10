// Custom API Error Class
class ApiError extends Error {
    /**
     * Constructs an instance of the ApiError class
     * @param {number} statuscode - The HTTP status code of the error
     * @param {string} message - A custom error message (default: "Something went wrong")
     * @param {Array} errors - Additional error details for debugging (default: [])
     * @param {string} stack - The stack trace (default: current stack trace)
     */
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call parent constructor with the error message
        this.statuscode = statuscode; // HTTP status code
        this.errors = errors; // Additional error details
        this.stack = stack || new Error().stack; // Current stack trace if not provided
    }
}

module.exports = ApiError;
