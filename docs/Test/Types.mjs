/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export function createStaticFunc(thisObj, func) {
  return (function (...args) {
    return func.apply(thisObj, args);
  });
}

export function createStaticAsyncFunc(thisObj, asyncFunc) {
  return (async function (...args) {
    return await asyncFunc.apply(thisObj, args);
  });
}

export function isObject(arg) {
  return ((arg !== null) && (typeof arg === "object"));
}

export function isSimpleObject(arg) {
  return (isObject(arg) && (Object.getPrototypeOf(arg) === Object.prototype));
}

export function isNumber(arg) {
  return ((typeof arg === "number") || (arg instanceof Number));
}

export function isBigInt(arg) {
  return ((typeof arg === "bigint") || (arg instanceof BigInt));
}

export function isBoolean(arg) {
  return ((typeof arg === "boolean") || (arg instanceof Boolean));
}

export function isString(arg) {
  return ((typeof arg === "string") || (arg instanceof String));
}

export function isSymbol(arg) {
  return ((typeof arg === "symbol") || (arg instanceof Symbol));
}

export function isUndefined(arg) {
  return (typeof arg === "undefined");
}

export function isNull(arg) {
  return (arg === null);
}

export function isInvocable(arg) {
  return (typeof arg === "function");
}

export function isInteger(arg) {
  if (typeof arg === "number") {
    return Number.isInteger(arg);
  } else if ((isObject(arg)) && ("toValue" in arg)) {
    const val = arg.toValue();
    if (!(isNumber(val))) {
      return false;
    }
    return Number.isInteger(arg);
  } else {
    return false;
  }
}

export function isArray(arg) {
  return Array.isArray(arg);
}
