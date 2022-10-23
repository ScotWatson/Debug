/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Types.mjs";

export class Exception {
  #functionName;
  #description;
  #info;
  #cause;
  constructor(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Argument must be a simple object.";
      }
      if (Object.hasOwn(args, "functionName")) {
        if (!(Types.isString(args.functionName))) {
          throw "Argument \"functionName\" must be a string.";
        }
        this.#functionName = args.functionName.toString();
      } else {
        this.#functionName = "";
      }
      if (Object.hasOwn(args, "description")) {
        if (!(Types.isString(args.description))) {
          throw "Argument \"description\" must be of type string.";
        }
        this.#description = args.description.toString();
      } else {
        this.#description = "";
      }
      if (Object.hasOwn(args, "info")) {
        if (!(Types.isSimpleObject(args.info))) {
          throw "Argument \"info\" must be a simple object.";
        }
        this.#info = args.info;
      } else {
        this.#info = null;
      }
      if (Object.hasOwn(args, "cause")) {
        if (args.cause instanceof Exception) {
          this.#cause = args.cause;
        } else {
          logWarn(
            /* functionName: */ "Exception constructor",
            /* logMessage: */ "Argument \"cause\" of Exception must be of type Exception to be included in the chain.",
          );
          this.#cause = null;
        }
      } else {
        this.#cause = null;
      }
    } catch (e) {
      rethrow({
        functionName: "Exception constructor",
        error: e,
      });
    }
  }
  get functionName() {
    return this.#functionName;
  }
  get description() {
    return this.#description;
  }
  get info() {
    return this.#info;
  }
  get cause() {
    return this.#cause;
  }
  toString() {
    return "function \"" + this.#functionName + "\": " + this.#description;
  }
};

export class Log {
  #rollingLog;
  #cumulativeLog;
  #rollingLogSegment;
  #rollingLogInterval;
  #frozenLogs;
  constructor() {
    try {
      this.#rollingLog = new Array(10);
      for (let i = 0; i < 10; ++i) {
        this.#rollingLog[i] = [];
      }
      rollLog.call(this);
      this.#rollingLogInterval = self.setInterval(rollLog.bind(this), 1000);
      this.#cumulativeLog = [];
      this.#frozenLogs = [];
      function rollLog() {
        this.#rollingLogSegment = [];
        this.#rollingLog.pop();
        this.#rollingLog.unshift(this.#rollingLogSegment);
      }
    } catch (e) {
      rethrow({
        functionName: "Log constructor",
        error: e,
      });
    }
  }
  debug(args) {
    try {
      let message;
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "message"))) {
          throw "Argument \"message\" is required.";
        }
        if (!(Types.isString(args.message))) {
          throw "Argument \"message\" must be a string.";
        }
        message = args.message.toString();
      } else if (Types.isString(args.message)) {
        message = args.toString();
      } else {
        throw "Invalid Argument.";
      }
      this.#rollingLogSegment.push({
        now: new Date(),
        type: "DEBUG",
        message: message,
      });
    } catch (e) {
      rethrow({
        functionName: "Log.debug",
        error: e,
      });
    }
  }
  warning(args) {
    try {
      let message;
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "message"))) {
          throw "Argument \"message\" is required.";
        }
        if (!(Types.isString(args.message))) {
          throw "Argument \"message\" must be a string.";
        }
        message = args.message.toString();
      } else if (Types.isString(args.message)) {
        message = args.toString();
      } else {
        throw "Invalid Argument.";
      }
      this.#cumulativeLog.push({
        now: new Date(),
        type: "WARN",
        message: message,
      });
    } catch (e) {
      rethrow({
        functionName: "Log.warning",
        error: e,
      });
    }
  }
  recovery(args) {
    try {
      let error;
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "error"))) {
          throw "Argument \"error\" is required.";
        }
        if (!(args instanceof Exception)) {
          throw "Argument \"error\" must be of type Exception.";
        }
        error = args.error;
      } else if (args instanceof Exception) {
        error = args;
      } else {
        throw "Invalid Argument.";
      }
      let message = "";
      while (error !== null) {
        message += error.toString() + "\n";
        error = error.cause;
      }
      this.#cumulativeLog.push({
        now: new Date(),
        type: "RECOVER",
        message: message,
      });
    } catch (e) {
      rethrow({
        functionName: "Log.recovery",
        error: e,
      });
    }
  }
  error(args) {
    try {
      let error;
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "error"))) {
          throw "Argument \"error\" is required.";
        }
        if (!(args instanceof Exception)) {
          throw "Argument \"error\" must be of type Exception.";
        }
        error = args.error;
      } else if (args instanceof Exception) {
        error = args;
      } else {
        throw "Invalid Argument.";
      }
      let message = "";
      while (error !== null) {
        message += error.toString() + "\n";
        error = error.cause;
      }
      this.#cumulativeLog.push({
        now: new Date(),
        type: "ERROR",
        message: message,
      });
      this.#frozenLogs.push(this.#rollingLog.flat());
    } catch (e) {
      rethrow({
        functionName: "Log.error",
        error: e,
      });
    }
  }
  get frozenLogs() {
    return this.#frozenLogs;
  }
};

let currentLog = new Log();

export function getLog() {
  return currentLog;
}

export function resetLog() {
  currentLog = new Log();
}

export function recoveredFrom(error) {
  try {
    if (currentLog !== null) {
      currentLog.recovery(error);
    } else {
      self?.console?.warn?.(error);
    }
  } catch (e) {
    rethrow({
      functionName: "recoveredFrom",
      error: e,
    });
  }
}

export function finalCatch(error) {
  try {
    if (currentLog !== null) {
      currentLog.error(error);
    } else {
      self?.console?.error?.(error);
    }
  } catch (e) {
    // As this is the final catch, any error cannot be rethrown, so it is discarded.
  }
}

export function rethrow(args) {
  if (!(Types.isSimpleObject(args))) {
    throw new Exception({
      functionName: "rethrow",
      description: "Attempt to call rethrow with invalid arguments.",
    });
  }
  let functionName = "";
  if (Object.hasOwn(args, "functionName")) {
    if (Types.isString(args.functionName)) {
      functionName = args.functionName;
    }
  }
  if (!(Object.hasOwn(args, "error"))) {
    throw new Exception({
      functionName: functionName,
      description: "Note: error information is not provided",
    });
  }
  if (Types.isSimpleObject(args.error)) {
    throw new Exception({
      functionName: functionName,
      description: "Note: error information provided as an object.",
      info: args.error,
    });
  } else if (Types.isString(args.error)) {
    throw new Exception({
      functionName: functionName,
      description: args.error,
    });
  } else if (args.error instanceof Exception) {
    throw new Exception({
      functionName: functionName,
      description: "Unanticipated rethrown error.",
      cause: args.error,
    });
  } else if (args.error instanceof Error) {
    throw new Exception({
      functionName: functionName,
      description: "Unanticipated JavaScript Error.",
      info: {
        JS_Error: args.error,
      },
    });
  } else {
    // This should never occur.
    throw new Exception({
      functionName: functionName,
      description: "Unrecognized error type passed to rethrow. Indicates internal logic error.",
      info: {
        rawData: args.error,
      },
    });
  }
}
