/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

const initPageTime = performance.now();

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const loadErrorLogModule = (async function () {
  const module = await import("https://scotwatson.github.io/Debug/20221107/ErrorLog.mjs");
  console.log(Object.getOwnPropertyNames(module));
  return module;
})();

Promise.all( [ loadWindow, loadErrorLogModule ] ).then(start, fail);

function start( [ evtWindow, ErrorLog ] ) {
  try {
    console.log("Load Time", performance.now() - initPageTime);
    const btnThrowException = document.createElement("button");
    btnThrowException.innerHTML = "Throw Exception";
    btnThrowException.addEventListener("click", btnThrowExceptionHandler);
    document.body.appendChild(btnThrowException);
    const inpInput1 = document.createElement("input");
    inpInput1.type = "text";
    document.body.appendChild(inpInput1);
    const inpInput2 = document.createElement("input");
    inpInput2.type = "text";
    document.body.appendChild(inpInput2);
  } catch (e) {
    // This is a top level function, therfore it cannot throw an exception.
    finalCatch({
      functionName: "start",
      error: e,
    });
  }
  function btnThrowExceptionHandler(evt) {
    try {
      throw "The \"Throw Exception\" button was clicked.";
    } catch (e) {
      rethrow({
        functionName: "btnThrowExceptionHandler",
        error: e,
      });
    });
  }
}

function fail(e) {
  console.error(e);
}
