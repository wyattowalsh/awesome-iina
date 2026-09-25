var sp = (a) => {
  throw TypeError(a);
};
var fp = (a, r, c) => r.has(a) || sp("Cannot " + c);
var Wt = (a, r, c) => (fp(a, r, "read from private field"), c ? c.call(a) : r.get(a)), dp = (a, r, c) => r.has(a) ? sp("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(a) : r.set(a, c), Gd = (a, r, c, u) => (fp(a, r, "write to private field"), u ? u.call(a, c) : r.set(a, c), c);
function Sx(a, r) {
  for (var c = 0; c < r.length; c++) {
    const u = r[c];
    if (typeof u != "string" && !Array.isArray(u)) {
      for (const s in u)
        if (s !== "default" && !(s in a)) {
          const f = Object.getOwnPropertyDescriptor(u, s);
          f && Object.defineProperty(a, s, f.get ? f : {
            enumerable: !0,
            get: () => u[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function xx(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Yd = { exports: {} }, Ji = {};
var mp;
function Ex() {
  if (mp) return Ji;
  mp = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.fragment");
  function c(u, s, f) {
    var m = null;
    if (f !== void 0 && (m = "" + f), s.key !== void 0 && (m = "" + s.key), "key" in s) {
      f = {};
      for (var h in s)
        h !== "key" && (f[h] = s[h]);
    } else f = s;
    return s = f.ref, {
      $$typeof: a,
      type: u,
      key: m,
      ref: s !== void 0 ? s : null,
      props: f
    };
  }
  return Ji.Fragment = r, Ji.jsx = c, Ji.jsxs = c, Ji;
}
var hp;
function Cx() {
  return hp || (hp = 1, Yd.exports = Ex()), Yd.exports;
}
var E = Cx(), qd = { exports: {} }, Oe = {};
var vp;
function wx() {
  if (vp) return Oe;
  vp = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.portal"), c = /* @__PURE__ */ Symbol.for("react.fragment"), u = /* @__PURE__ */ Symbol.for("react.strict_mode"), s = /* @__PURE__ */ Symbol.for("react.profiler"), f = /* @__PURE__ */ Symbol.for("react.consumer"), m = /* @__PURE__ */ Symbol.for("react.context"), h = /* @__PURE__ */ Symbol.for("react.forward_ref"), p = /* @__PURE__ */ Symbol.for("react.suspense"), b = /* @__PURE__ */ Symbol.for("react.memo"), x = /* @__PURE__ */ Symbol.for("react.lazy"), v = /* @__PURE__ */ Symbol.for("react.activity"), S = /* @__PURE__ */ Symbol.for("react.view_transition"), A = Symbol.iterator;
  function O(R) {
    return R === null || typeof R != "object" ? null : (R = A && R[A] || R["@@iterator"], typeof R == "function" ? R : null);
  }
  var w = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, C = Object.assign, _ = {};
  function D(R, Z, oe) {
    this.props = R, this.context = Z, this.refs = _, this.updater = oe || w;
  }
  D.prototype.isReactComponent = {}, D.prototype.setState = function(R, Z) {
    if (typeof R != "object" && typeof R != "function" && R != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, R, Z, "setState");
  }, D.prototype.forceUpdate = function(R) {
    this.updater.enqueueForceUpdate(this, R, "forceUpdate");
  };
  function j() {
  }
  j.prototype = D.prototype;
  function M(R, Z, oe) {
    this.props = R, this.context = Z, this.refs = _, this.updater = oe || w;
  }
  var Y = M.prototype = new j();
  Y.constructor = M, C(Y, D.prototype), Y.isPureReactComponent = !0;
  var I = Array.isArray;
  function X() {
  }
  var L = { H: null, A: null, T: null, S: null }, F = Object.prototype.hasOwnProperty;
  function ae(R, Z, oe) {
    var se = oe.ref;
    return {
      $$typeof: a,
      type: R,
      key: Z,
      ref: se !== void 0 ? se : null,
      props: oe
    };
  }
  function ie(R, Z) {
    return ae(R.type, Z, R.props);
  }
  function ee(R) {
    return typeof R == "object" && R !== null && R.$$typeof === a;
  }
  function fe(R) {
    var Z = { "=": "=0", ":": "=2" };
    return "$" + R.replace(/[=:]/g, function(oe) {
      return Z[oe];
    });
  }
  var ge = /\/+/g;
  function he(R, Z) {
    return typeof R == "object" && R !== null && R.key != null ? fe("" + R.key) : Z.toString(36);
  }
  function Q(R) {
    switch (R.status) {
      case "fulfilled":
        return R.value;
      case "rejected":
        throw R.reason;
      default:
        switch (typeof R.status == "string" ? R.then(X, X) : (R.status = "pending", R.then(
          function(Z) {
            R.status === "pending" && (R.status = "fulfilled", R.value = Z);
          },
          function(Z) {
            R.status === "pending" && (R.status = "rejected", R.reason = Z);
          }
        )), R.status) {
          case "fulfilled":
            return R.value;
          case "rejected":
            throw R.reason;
        }
    }
    throw R;
  }
  function J(R, Z, oe, se, ne) {
    var ue = typeof R;
    (ue === "undefined" || ue === "boolean") && (R = null);
    var xe = !1;
    if (R === null) xe = !0;
    else
      switch (ue) {
        case "bigint":
        case "string":
        case "number":
          xe = !0;
          break;
        case "object":
          switch (R.$$typeof) {
            case a:
            case r:
              xe = !0;
              break;
            case x:
              return xe = R._init, J(
                xe(R._payload),
                Z,
                oe,
                se,
                ne
              );
          }
      }
    if (xe)
      return ne = ne(R), xe = se === "" ? "." + he(R, 0) : se, I(ne) ? (oe = "", xe != null && (oe = xe.replace(ge, "$&/") + "/"), J(ne, Z, oe, "", function(je) {
        return je;
      })) : ne != null && (ee(ne) && (ne = ie(
        ne,
        oe + (ne.key == null || R && R.key === ne.key ? "" : ("" + ne.key).replace(
          ge,
          "$&/"
        ) + "/") + xe
      )), Z.push(ne)), 1;
    xe = 0;
    var le = se === "" ? "." : se + ":";
    if (I(R))
      for (var re = 0; re < R.length; re++)
        se = R[re], ue = le + he(se, re), xe += J(
          se,
          Z,
          oe,
          ue,
          ne
        );
    else if (re = O(R), typeof re == "function")
      for (R = re.call(R), re = 0; !(se = R.next()).done; )
        se = se.value, ue = le + he(se, re++), xe += J(
          se,
          Z,
          oe,
          ue,
          ne
        );
    else if (ue === "object") {
      if (typeof R.then == "function")
        return J(
          Q(R),
          Z,
          oe,
          se,
          ne
        );
      throw Z = String(R), Error(
        "Objects are not valid as a React child (found: " + (Z === "[object Object]" ? "object with keys {" + Object.keys(R).join(", ") + "}" : Z) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return xe;
  }
  function te(R, Z, oe) {
    if (R == null) return R;
    var se = [], ne = 0;
    return J(R, se, "", "", function(ue) {
      return Z.call(oe, ue, ne++);
    }), se;
  }
  function de(R) {
    if (R._status === -1) {
      var Z = R._result, oe = Z();
      oe.then(
        function(se) {
          (R._status === 0 || R._status === -1) && (R._status = 1, R._result = se, oe.status === void 0 && (oe.status = "fulfilled", oe.value = se));
        },
        function(se) {
          (R._status === 0 || R._status === -1) && (R._status = 2, R._result = se, oe.status === void 0 && (oe.status = "rejected", oe.reason = se));
        }
      ), R._status === -1 && (R._status = 0, R._result = oe);
    }
    if (R._status === 1) return R._result.default;
    throw R._result;
  }
  var G = typeof reportError == "function" ? reportError : function(R) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var Z = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof R == "object" && R !== null && typeof R.message == "string" ? String(R.message) : String(R),
        error: R
      });
      if (!window.dispatchEvent(Z)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", R);
      return;
    }
    console.error(R);
  };
  function Ye(R) {
    var Z = L.T, oe = {};
    oe.types = Z !== null ? Z.types : null, L.T = oe;
    try {
      var se = R(), ne = L.S;
      ne !== null && ne(oe, se), typeof se == "object" && se !== null && typeof se.then == "function" && se.then(X, G);
    } catch (ue) {
      G(ue);
    } finally {
      Z !== null && oe.types !== null && (Z.types = oe.types), L.T = Z;
    }
  }
  function De(R) {
    var Z = L.T;
    if (Z !== null) {
      var oe = Z.types;
      oe === null ? Z.types = [R] : oe.indexOf(R) === -1 && oe.push(R);
    } else Ye(De.bind(null, R));
  }
  var qe = {
    map: te,
    forEach: function(R, Z, oe) {
      te(
        R,
        function() {
          Z.apply(this, arguments);
        },
        oe
      );
    },
    count: function(R) {
      var Z = 0;
      return te(R, function() {
        Z++;
      }), Z;
    },
    toArray: function(R) {
      return te(R, function(Z) {
        return Z;
      }) || [];
    },
    only: function(R) {
      if (!ee(R))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return R;
    }
  };
  return Oe.Activity = v, Oe.Children = qe, Oe.Component = D, Oe.Fragment = c, Oe.Profiler = s, Oe.PureComponent = M, Oe.StrictMode = u, Oe.Suspense = p, Oe.ViewTransition = S, Oe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = L, Oe.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(R) {
      return L.H.useMemoCache(R);
    }
  }, Oe.addTransitionType = De, Oe.cache = function(R) {
    return function() {
      return R.apply(null, arguments);
    };
  }, Oe.cacheSignal = function() {
    return null;
  }, Oe.cloneElement = function(R, Z, oe) {
    if (R == null)
      throw Error(
        "The argument must be a React element, but you passed " + R + "."
      );
    var se = C({}, R.props), ne = R.key;
    if (Z != null)
      for (ue in Z.key !== void 0 && (ne = "" + Z.key), Z)
        !F.call(Z, ue) || ue === "key" || ue === "__self" || ue === "__source" || ue === "ref" && Z.ref === void 0 || (se[ue] = Z[ue]);
    var ue = arguments.length - 2;
    if (ue === 1) se.children = oe;
    else if (1 < ue) {
      for (var xe = Array(ue), le = 0; le < ue; le++)
        xe[le] = arguments[le + 2];
      se.children = xe;
    }
    return ae(R.type, ne, se);
  }, Oe.createContext = function(R) {
    return R = {
      $$typeof: m,
      _currentValue: R,
      _currentValue2: R,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, R.Provider = R, R.Consumer = {
      $$typeof: f,
      _context: R
    }, R;
  }, Oe.createElement = function(R, Z, oe) {
    var se, ne = {}, ue = null;
    if (Z != null)
      for (se in Z.key !== void 0 && (ue = "" + Z.key), Z)
        F.call(Z, se) && se !== "key" && se !== "__self" && se !== "__source" && (ne[se] = Z[se]);
    var xe = arguments.length - 2;
    if (xe === 1) ne.children = oe;
    else if (1 < xe) {
      for (var le = Array(xe), re = 0; re < xe; re++)
        le[re] = arguments[re + 2];
      ne.children = le;
    }
    if (R && R.defaultProps)
      for (se in xe = R.defaultProps, xe)
        ne[se] === void 0 && (ne[se] = xe[se]);
    return ae(R, ue, ne);
  }, Oe.createRef = function() {
    return { current: null };
  }, Oe.forwardRef = function(R) {
    return { $$typeof: h, render: R };
  }, Oe.isValidElement = ee, Oe.lazy = function(R) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: R },
      _init: de
    };
  }, Oe.memo = function(R, Z) {
    return {
      $$typeof: b,
      type: R,
      compare: Z === void 0 ? null : Z
    };
  }, Oe.startTransition = Ye, Oe.unstable_useCacheRefresh = function() {
    return L.H.useCacheRefresh();
  }, Oe.use = function(R) {
    return L.H.use(R);
  }, Oe.useActionState = function(R, Z, oe) {
    return L.H.useActionState(R, Z, oe);
  }, Oe.useCallback = function(R, Z) {
    return L.H.useCallback(R, Z);
  }, Oe.useContext = function(R) {
    return L.H.useContext(R);
  }, Oe.useDebugValue = function() {
  }, Oe.useDeferredValue = function(R, Z) {
    return L.H.useDeferredValue(R, Z);
  }, Oe.useEffect = function(R, Z) {
    return L.H.useEffect(R, Z);
  }, Oe.useEffectEvent = function(R) {
    return L.H.useEffectEvent(R);
  }, Oe.useId = function() {
    return L.H.useId();
  }, Oe.useImperativeHandle = function(R, Z, oe) {
    return L.H.useImperativeHandle(R, Z, oe);
  }, Oe.useInsertionEffect = function(R, Z) {
    return L.H.useInsertionEffect(R, Z);
  }, Oe.useLayoutEffect = function(R, Z) {
    return L.H.useLayoutEffect(R, Z);
  }, Oe.useMemo = function(R, Z) {
    return L.H.useMemo(R, Z);
  }, Oe.useOptimistic = function(R, Z) {
    return L.H.useOptimistic(R, Z);
  }, Oe.useReducer = function(R, Z, oe) {
    return L.H.useReducer(R, Z, oe);
  }, Oe.useRef = function(R) {
    return L.H.useRef(R);
  }, Oe.useState = function(R) {
    return L.H.useState(R);
  }, Oe.useSyncExternalStore = function(R, Z, oe) {
    return L.H.useSyncExternalStore(
      R,
      Z,
      oe
    );
  }, Oe.useTransition = function() {
    return L.H.useTransition();
  }, Oe.version = "19.3.0", Oe;
}
var gp;
function Hm() {
  return gp || (gp = 1, qd.exports = wx()), qd.exports;
}
var y = Hm();
const Tx = /* @__PURE__ */ xx(y), Kr = /* @__PURE__ */ Sx({
  __proto__: null,
  default: Tx
}, [y]);
var kd = { exports: {} }, $i = {}, Id = { exports: {} }, Xd = {};
var pp;
function Ax() {
  return pp || (pp = 1, (function(a) {
    function r(Q, J) {
      var te = Q.length;
      Q.push(J);
      e: for (; 0 < te; ) {
        var de = te - 1 >>> 1, G = Q[de];
        if (0 < s(G, J))
          Q[de] = J, Q[te] = G, te = de;
        else break e;
      }
    }
    function c(Q) {
      return Q.length === 0 ? null : Q[0];
    }
    function u(Q) {
      if (Q.length === 0) return null;
      var J = Q[0], te = Q.pop();
      if (te !== J) {
        Q[0] = te;
        e: for (var de = 0, G = Q.length, Ye = G >>> 1; de < Ye; ) {
          var De = 2 * (de + 1) - 1, qe = Q[De], R = De + 1, Z = Q[R];
          if (0 > s(qe, te))
            R < G && 0 > s(Z, qe) ? (Q[de] = Z, Q[R] = te, de = R) : (Q[de] = qe, Q[De] = te, de = De);
          else if (R < G && 0 > s(Z, te))
            Q[de] = Z, Q[R] = te, de = R;
          else break e;
        }
      }
      return J;
    }
    function s(Q, J) {
      var te = Q.sortIndex - J.sortIndex;
      return te !== 0 ? te : Q.id - J.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      a.unstable_now = function() {
        return f.now();
      };
    } else {
      var m = Date, h = m.now();
      a.unstable_now = function() {
        return m.now() - h;
      };
    }
    var p = [], b = [], x = 1, v = null, S = 3, A = !1, O = !1, w = !1, C = !1, _ = typeof setTimeout == "function" ? setTimeout : null, D = typeof clearTimeout == "function" ? clearTimeout : null, j = typeof setImmediate < "u" ? setImmediate : null;
    function M(Q) {
      for (var J = c(b); J !== null; ) {
        if (J.callback === null) u(b);
        else if (J.startTime <= Q)
          u(b), J.sortIndex = J.expirationTime, r(p, J);
        else break;
        J = c(b);
      }
    }
    function Y(Q) {
      if (w = !1, M(Q), !O)
        if (c(p) !== null)
          O = !0, I || (I = !0, ee());
        else {
          var J = c(b);
          J !== null && he(Y, J.startTime - Q);
        }
    }
    var I = !1, X = -1, L = 5, F = -1;
    function ae() {
      return C ? !0 : !(a.unstable_now() - F < L);
    }
    function ie() {
      if (C = !1, I) {
        var Q = a.unstable_now();
        F = Q;
        var J = !0;
        try {
          e: {
            O = !1, w && (w = !1, D(X), X = -1), A = !0;
            var te = S;
            try {
              t: {
                for (M(Q), v = c(p); v !== null && !(v.expirationTime > Q && ae()); ) {
                  var de = v.callback;
                  if (typeof de == "function") {
                    v.callback = null, S = v.priorityLevel;
                    var G = de(
                      v.expirationTime <= Q
                    );
                    if (Q = a.unstable_now(), typeof G == "function") {
                      v.callback = G, M(Q), J = !0;
                      break t;
                    }
                    v === c(p) && u(p), M(Q);
                  } else u(p);
                  v = c(p);
                }
                if (v !== null) J = !0;
                else {
                  var Ye = c(b);
                  Ye !== null && he(
                    Y,
                    Ye.startTime - Q
                  ), J = !1;
                }
              }
              break e;
            } finally {
              v = null, S = te, A = !1;
            }
            J = void 0;
          }
        } finally {
          J ? ee() : I = !1;
        }
      }
    }
    var ee;
    if (typeof j == "function")
      ee = function() {
        j(ie);
      };
    else if (typeof MessageChannel < "u") {
      var fe = new MessageChannel(), ge = fe.port2;
      fe.port1.onmessage = ie, ee = function() {
        ge.postMessage(null);
      };
    } else
      ee = function() {
        _(ie, 0);
      };
    function he(Q, J) {
      X = _(function() {
        Q(a.unstable_now());
      }, J);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(Q) {
      Q.callback = null;
    }, a.unstable_forceFrameRate = function(Q) {
      0 > Q || 125 < Q ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : L = 0 < Q ? Math.floor(1e3 / Q) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, a.unstable_next = function(Q) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var J = 3;
          break;
        default:
          J = S;
      }
      var te = S;
      S = J;
      try {
        return Q();
      } finally {
        S = te;
      }
    }, a.unstable_requestPaint = function() {
      C = !0;
    }, a.unstable_runWithPriority = function(Q, J) {
      switch (Q) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Q = 3;
      }
      var te = S;
      S = Q;
      try {
        return J();
      } finally {
        S = te;
      }
    }, a.unstable_scheduleCallback = function(Q, J, te) {
      var de = a.unstable_now();
      switch (typeof te == "object" && te !== null ? (te = te.delay, te = typeof te == "number" && 0 < te ? de + te : de) : te = de, Q) {
        case 1:
          var G = -1;
          break;
        case 2:
          G = 250;
          break;
        case 5:
          G = 1073741823;
          break;
        case 4:
          G = 1e4;
          break;
        default:
          G = 5e3;
      }
      return G = te + G, Q = {
        id: x++,
        callback: J,
        priorityLevel: Q,
        startTime: te,
        expirationTime: G,
        sortIndex: -1
      }, te > de ? (Q.sortIndex = te, r(b, Q), c(p) === null && Q === c(b) && (w ? (D(X), X = -1) : w = !0, he(Y, te - de))) : (Q.sortIndex = G, r(p, Q), O || A || (O = !0, I || (I = !0, ee()))), Q;
    }, a.unstable_shouldYield = ae, a.unstable_wrapCallback = function(Q) {
      var J = S;
      return function() {
        var te = S;
        S = J;
        try {
          return Q.apply(this, arguments);
        } finally {
          S = te;
        }
      };
    };
  })(Xd)), Xd;
}
var yp;
function Ox() {
  return yp || (yp = 1, Id.exports = Ax()), Id.exports;
}
var Qd = { exports: {} }, Pt = {};
var bp;
function _x() {
  if (bp) return Pt;
  bp = 1;
  var a = Hm();
  function r(x) {
    var v = "https://react.dev/errors/" + x;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var S = 2; S < arguments.length; S++)
        v += "&args[]=" + encodeURIComponent(arguments[S]);
    }
    return "Minified React error #" + x + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c() {
  }
  var u = {
    d: {
      f: c,
      r: function() {
        throw Error(r(522));
      },
      D: c,
      C: c,
      L: c,
      m: c,
      X: c,
      S: c,
      M: c
    },
    p: 0,
    findDOMNode: null
  }, s = /* @__PURE__ */ Symbol.for("react.portal"), f = /* @__PURE__ */ Symbol.for("react.recoverable"), m = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function h(x, v, S) {
    var A = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: s,
      key: A == null ? null : A === m ? m : "" + A,
      children: x,
      containerInfo: v,
      implementation: S
    };
  }
  var p = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function b(x, v) {
    if (x === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return Pt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, Pt.browser = function(x) {
    return { $$typeof: f, _reason: x };
  }, Pt.createPortal = function(x, v) {
    var S = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(r(299));
    return h(x, v, null, S);
  }, Pt.flushSync = function(x) {
    var v = p.T, S = u.p;
    try {
      if (p.T = null, u.p = 2, x) return x();
    } finally {
      p.T = v, u.p = S, u.d.f();
    }
  }, Pt.preconnect = function(x, v) {
    typeof x == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, u.d.C(x, v));
  }, Pt.prefetchDNS = function(x) {
    typeof x == "string" && u.d.D(x);
  }, Pt.preinit = function(x, v) {
    if (typeof x == "string" && v && typeof v.as == "string") {
      var S = v.as, A = b(S, v.crossOrigin), O = typeof v.integrity == "string" ? v.integrity : void 0, w = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      S === "style" ? u.d.S(
        x,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: A,
          integrity: O,
          fetchPriority: w
        }
      ) : S === "script" && u.d.X(x, {
        crossOrigin: A,
        integrity: O,
        fetchPriority: w,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, Pt.preinitModule = function(x, v) {
    if (typeof x == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var S = b(
            v.as,
            v.crossOrigin
          );
          u.d.M(x, {
            crossOrigin: S,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0,
            fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0
          });
        }
      } else v == null && u.d.M(x);
  }, Pt.preload = function(x, v) {
    if (typeof x == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var S = v.as, A = b(S, v.crossOrigin);
      u.d.L(x, S, {
        crossOrigin: A,
        integrity: typeof v.integrity == "string" ? v.integrity : void 0,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0,
        type: typeof v.type == "string" ? v.type : void 0,
        fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
        referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
        imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
        imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
        media: typeof v.media == "string" ? v.media : void 0
      });
    }
  }, Pt.preloadModule = function(x, v) {
    if (typeof x == "string")
      if (v) {
        var S = b(v.as, v.crossOrigin);
        u.d.m(x, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: S,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0,
          nonce: typeof v.nonce == "string" ? v.nonce : void 0,
          fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0
        });
      } else u.d.m(x);
  }, Pt.requestFormReset = function(x) {
    u.d.r(x);
  }, Pt.unstable_batchedUpdates = function(x, v) {
    return x(v);
  }, Pt.useFormState = function(x, v, S) {
    return p.H.useFormState(x, v, S);
  }, Pt.useFormStatus = function() {
    return p.H.useHostTransitionStatus();
  }, Pt.version = "19.3.0", Pt;
}
var Sp;
function h2() {
  if (Sp) return Qd.exports;
  Sp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), Qd.exports = _x(), Qd.exports;
}
var xp;
function Rx() {
  if (xp) return $i;
  xp = 1;
  var a = Ox(), r = Hm(), c = h2();
  function u(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function f(e) {
    for (var t = e, n = t; n && !n.alternate; )
      t = n, (t.flags & 4098) !== 0 && (e = t.return), n = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function m(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (f(e) !== e)
      throw Error(u(188));
  }
  function b(e) {
    var t = e.alternate;
    if (!t) {
      if (t = f(e), t === null) throw Error(u(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var o = n.return;
      if (o === null) break;
      var i = o.alternate;
      if (i === null) {
        if (l = o.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (o.child === i.child) {
        for (i = o.child; i; ) {
          if (i === n) return p(o), e;
          if (i === l) return p(o), t;
          i = i.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== l.return) n = o, l = i;
      else {
        for (var d = !1, g = o.child; g; ) {
          if (g === n) {
            d = !0, n = o, l = i;
            break;
          }
          if (g === l) {
            d = !0, l = o, n = i;
            break;
          }
          g = g.sibling;
        }
        if (!d) {
          for (g = i.child; g; ) {
            if (g === n) {
              d = !0, n = i, l = o;
              break;
            }
            if (g === l) {
              d = !0, l = i, n = o;
              break;
            }
            g = g.sibling;
          }
          if (!d) throw Error(u(189));
        }
      }
      if (n.alternate !== l) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function x(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = x(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  function v(e, t, n, l, o, i) {
    for (; e !== null; ) {
      if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, l, o, i) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && v(
        e.child,
        t,
        n,
        l,
        o,
        i
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function S(e) {
    for (e = e.return; e !== null; ) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function A(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27)); )
      e = e.return;
    return t;
  }
  function O(e) {
    var t = [null, null], n = S(e);
    return n === null || w(
      t,
      e,
      n.child,
      { foundSelf: !1 }
    ), t;
  }
  function w(e, t, n, l) {
    for (; n !== null; ) {
      if (n === t) l.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (l.foundSelf) return e[1] = n, !0;
        e[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && w(
        e,
        t,
        n.child,
        l
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function C(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(u(559));
    }
  }
  var _ = null, D = null;
  function j(e, t, n) {
    return e === n ? !0 : e === t ? (_ = e, !0) : !1;
  }
  function M(e, t, n) {
    return e === n ? (D = e, !1) : e === t ? (D !== null && (_ = e), !0) : !1;
  }
  function Y(e) {
    if (e === null) return null;
    do
      e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function I(e, t, n) {
    for (var l = 0, o = e; o; o = n(o)) l++;
    o = 0;
    for (var i = t; i; i = n(i)) o++;
    for (; 0 < l - o; ) e = n(e), l--;
    for (; 0 < o - l; ) t = n(t), o--;
    for (; l--; ) {
      if (e === t || t !== null && e === t.alternate)
        return e;
      e = n(e), t = n(t);
    }
    return null;
  }
  var X = Object.assign, L = /* @__PURE__ */ Symbol.for("react.element"), F = /* @__PURE__ */ Symbol.for("react.transitional.element"), ae = /* @__PURE__ */ Symbol.for("react.portal"), ie = /* @__PURE__ */ Symbol.for("react.fragment"), ee = /* @__PURE__ */ Symbol.for("react.strict_mode"), fe = /* @__PURE__ */ Symbol.for("react.profiler"), ge = /* @__PURE__ */ Symbol.for("react.consumer"), he = /* @__PURE__ */ Symbol.for("react.context"), Q = /* @__PURE__ */ Symbol.for("react.forward_ref"), J = /* @__PURE__ */ Symbol.for("react.suspense"), te = /* @__PURE__ */ Symbol.for("react.suspense_list"), de = /* @__PURE__ */ Symbol.for("react.memo"), G = /* @__PURE__ */ Symbol.for("react.lazy"), Ye = /* @__PURE__ */ Symbol.for("react.activity"), De = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), qe = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), R = /* @__PURE__ */ Symbol.for("react.view_transition"), Z = /* @__PURE__ */ Symbol.for("react.recoverable"), oe = Symbol.iterator;
  function se(e) {
    return e === null || typeof e != "object" ? null : (e = oe && e[oe] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ne = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ue(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ne ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ie:
        return "Fragment";
      case fe:
        return "Profiler";
      case ee:
        return "StrictMode";
      case J:
        return "Suspense";
      case te:
        return "SuspenseList";
      case Ye:
        return "Activity";
      case R:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case ae:
          return "Portal";
        case he:
          return e.displayName || "Context";
        case ge:
          return (e._context.displayName || "Context") + ".Consumer";
        case Q:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case de:
          return t = e.displayName || null, t !== null ? t : ue(e.type) || "Memo";
        case G:
          t = e._payload, e = e._init;
          try {
            return ue(e(t));
          } catch {
          }
      }
    return null;
  }
  var xe = Array.isArray, le = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, re = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, je = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, pt = [], at = -1;
  function St(e) {
    return { current: e };
  }
  function st(e) {
    0 > at || (e.current = pt[at], pt[at] = null, at--);
  }
  function Xe(e, t) {
    at++, pt[at] = e.current, e.current = t;
  }
  var Dn = St(null), il = St(null), ul = St(null), Yo = St(null);
  function ta(e, t) {
    switch (Xe(ul, t), Xe(il, e), Xe(Dn, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? bg(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = bg(t), e = Sg(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    st(Dn), Xe(Dn, e);
  }
  function na() {
    st(Dn), st(il), st(ul);
  }
  function Wr(e) {
    var t = e.memoizedState;
    t !== null && (Lr._currentValue = t.memoizedState, Xe(Yo, e)), t = Dn.current;
    var n = Sg(t, e.type);
    t !== n && (Xe(il, e), Xe(Dn, n));
  }
  function qo(e) {
    il.current === e && (st(Dn), st(il)), Yo.current === e && (st(Yo), Lr._currentValue = je);
  }
  var ei, mu;
  function cl(e) {
    if (ei === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ei = t && t[1] || "", mu = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ei + e + mu;
  }
  var ko = !1;
  function Ja(e, t) {
    if (!e || ko) return "";
    ko = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var P = function() {
                throw Error();
              };
              if (Object.defineProperty(P.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(P, []);
                } catch (ce) {
                  var z = ce;
                }
                Reflect.construct(e, [], P);
              } else {
                try {
                  P.call();
                } catch (ce) {
                  z = ce;
                }
                P = !1;
                try {
                  var V = Object.getOwnPropertyDescriptor(
                    e.prototype,
                    "props"
                  );
                  Object.defineProperty(e.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), P = !0, new e();
                } finally {
                  P && (V !== void 0 ? Object.defineProperty(e.prototype, "props", V) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (ce) {
                z = ce;
              }
              (P = e()) && typeof P.catch == "function" && P.catch(function() {
              });
            }
          } catch (ce) {
            if (ce && z && typeof ce.stack == "string")
              return [ce.stack, z.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var o = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      o && o.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = l.DetermineComponentFrameRoot(), d = i[0], g = i[1];
      if (d && g) {
        var T = d.split(`
`), H = g.split(`
`);
        for (o = l = 0; l < T.length && !T[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; o < H.length && !H[o].includes(
          "DetermineComponentFrameRoot"
        ); )
          o++;
        if (l === T.length || o === H.length)
          for (l = T.length - 1, o = H.length - 1; 1 <= l && 0 <= o && T[l] !== H[o]; )
            o--;
        for (; 1 <= l && 0 <= o; l--, o--)
          if (T[l] !== H[o]) {
            if (l !== 1 || o !== 1)
              do
                if (l--, o--, 0 > o || T[l] !== H[o]) {
                  var k = `
` + T[l].replace(" at new ", " at ");
                  return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), k;
                }
              while (1 <= l && 0 <= o);
            break;
          }
      }
    } finally {
      ko = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? cl(n) : "";
  }
  function ti(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return cl(e.type);
      case 16:
        return cl("Lazy");
      case 13:
        return e.child !== t && t !== null ? cl("Suspense Fallback") : cl("Suspense");
      case 19:
        return cl("SuspenseList");
      case 0:
      case 15:
        return Ja(e.type, !1);
      case 11:
        return Ja(e.type.render, !1);
      case 1:
        return Ja(e.type, !0);
      case 31:
        return cl("Activity");
      case 30:
        return cl("ViewTransition");
      default:
        return "";
    }
  }
  function $a(e) {
    try {
      var t = "", n = null;
      do
        t += ti(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var Io = Object.prototype.hasOwnProperty, ni = a.unstable_scheduleCallback, Xo = a.unstable_cancelCallback, Qo = a.unstable_shouldYield, Es = a.unstable_requestPaint, en = a.unstable_now, hu = a.unstable_getCurrentPriorityLevel, la = a.unstable_ImmediatePriority, Zo = a.unstable_UserBlockingPriority, cn = a.unstable_NormalPriority, vu = a.unstable_LowPriority, li = a.unstable_IdlePriority, gu = a.log, pu = a.unstable_setDisableYieldValue, aa = null, Ft = null;
  function xt(e) {
    if (typeof gu == "function" && pu(e), Ft && typeof Ft.setStrictMode == "function")
      try {
        Ft.setStrictMode(aa, e);
      } catch {
      }
  }
  var zt = Math.clz32 ? Math.clz32 : ia, oa = Math.log, ra = Math.LN2;
  function ia(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (oa(e) / ra | 0) | 0;
  }
  var Nl = 256, sl = 262144, Qn = 4194304;
  function Dl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Zn(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var o = 0, i = e.suspendedLanes, d = e.pingedLanes;
    e = e.warmLanes;
    var g = l & 134217727;
    return g !== 0 ? (l = g & ~i, l !== 0 ? o = Dl(l) : (d &= g, d !== 0 ? o = Dl(d) : n || (n = g & ~e, n !== 0 && (o = Dl(n))))) : (g = l & ~i, g !== 0 ? o = Dl(g) : d !== 0 ? o = Dl(d) : n || (n = l & ~e, n !== 0 && (o = Dl(n)))), o === 0 ? 0 : t !== 0 && t !== o && (t & i) === 0 && (i = o & -o, n = t & -t, i >= n || i === 32 && (n & 4194048) !== 0) ? t : o;
  }
  function Kn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function ua(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var n = e.entangledLanes;
    if (n !== 0)
      for (e = e.entanglements, n &= t; 0 < n; ) {
        var l = 31 - zt(n), o = 1 << l;
        t |= e[l], n &= ~o;
      }
    return t;
  }
  function ai(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Pn() {
    var e = Qn;
    return Qn <<= 1, (Qn & 62914560) === 0 && (Qn = 4194304), e;
  }
  function Ko(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function zl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Po(e, t, n, l, o, i) {
    var d = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var g = e.entanglements, T = e.expirationTimes, H = e.hiddenUpdates;
    for (n = d & ~n; 0 < n; ) {
      var k = 31 - zt(n), P = 1 << k;
      g[k] = 0, T[k] = -1;
      var z = H[k];
      if (z !== null)
        for (H[k] = null, k = 0; k < z.length; k++) {
          var V = z[k];
          V !== null && (V.lane &= -536870913);
        }
      n &= ~P;
    }
    l !== 0 && Fn(e, l, 0), i !== 0 && o === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(d & ~t));
  }
  function Fn(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - zt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function Fo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - zt(n), o = 1 << l;
      o & t | e[l] & t && (e[l] |= t), n &= ~o;
    }
  }
  function Wa(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : ca(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function ca(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function zn(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function jn() {
    var e = re.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : lp(e.type));
  }
  function eo(e, t) {
    var n = re.p;
    try {
      return re.p = e, t();
    } finally {
      re.p = n;
    }
  }
  var yt = Math.random().toString(36).slice(2), dt = "__reactFiber$" + yt, Yt = "__reactProps$" + yt, pn = "__reactContainer$" + yt, oi = "__reactEvents$" + yt, Jo = "__reactListeners$" + yt, $o = "__reactHandles$" + yt, sa = "__reactResources$" + yt, to = "__reactMarker$" + yt, Wo = "__reactLoad$" + yt;
  function er(e) {
    delete e[dt], delete e[Yt], delete e[Jo], delete e[$o];
  }
  function Jn(e) {
    var t;
    if (t = e[dt]) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[pn] || n[dt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = Lg(e); e !== null; ) {
            if (n = e[dt]) return n;
            e = Lg(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function no(e) {
    if (e = e[dt] || e[pn]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function q(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(u(33));
  }
  function $(e) {
    var t = e[sa];
    return t || (t = e[sa] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function W(e) {
    e[to] = !0;
  }
  function be(e) {
    e[Wo] = void 0;
  }
  var _e = /* @__PURE__ */ new Set(), Ae = {};
  function ze(e, t) {
    et(e, t), et(e + "Capture", t);
  }
  function et(e, t) {
    for (Ae[e] = t, e = 0; e < t.length; e++)
      _e.add(t[e]);
  }
  var Ke = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), we = {}, Re = {};
  function Qe(e) {
    return Io.call(Re, e) ? !0 : Io.call(we, e) ? !1 : Ke.test(e) ? Re[e] = !0 : (we[e] = !0, !1);
  }
  var Ee = !1;
  function Rt() {
    var e = Ee;
    return Ee = !1, e;
  }
  function mt(e, t, n) {
    if (Qe(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, n);
      }
  }
  function yn(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, n);
    }
  }
  function Et(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, l);
    }
  }
  function Ct(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function tr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function ri(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var o = l.get, i = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return o.call(this);
        },
        set: function(d) {
          n = "" + d, i.call(this, d);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(d) {
          n = "" + d;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function jl(e) {
    if (!e._valueTracker) {
      var t = tr(e) ? "checked" : "value";
      e._valueTracker = ri(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function nr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = tr(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  var yu = /[\n"\\]/g;
  function ut(e) {
    return e.replace(
      yu,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Jt(e, t, n, l, o, i, d, g) {
    e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.type = d : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ct(t)) : e.value !== "" + Ct(t) && (e.value = "" + Ct(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? d === "number" && e.value == t ? lr(e, Ct(e.value)) : lr(e, Ct(t)) : n != null ? lr(e, Ct(n)) : l != null && e.removeAttribute("value"), o == null && i != null && (e.defaultChecked = !!i), o != null && (e.checked = o && typeof o != "function" && typeof o != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? e.name = "" + Ct(g) : e.removeAttribute("name");
  }
  function fa(e, t, n, l, o, i, d, g) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || n != null) {
      if (!(i !== "submit" && i !== "reset" || t != null)) {
        jl(e);
        return;
      }
      n = n != null ? "" + Ct(n) : "", t = t != null ? "" + Ct(t) : n, g || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? o, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = g ? e.checked : !!l, e.defaultChecked = !!l, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.name = d), jl(e);
  }
  function lr(e, t) {
    e.defaultValue !== "" + t && (e.defaultValue = "" + t);
  }
  function sn(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var o = 0; o < n.length; o++)
        t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++)
        o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Ct(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          e[o].selected = !0, l && (e[o].defaultSelected = !0);
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ar(e, t, n) {
    if (t != null && (t = "" + Ct(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Ct(n) : "";
  }
  function bn(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(u(92));
        if (xe(l)) {
          if (1 < l.length) throw Error(u(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = Ct(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), jl(e);
  }
  function tn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var da = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ii(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || da.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Sn(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(u(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "", Ee = !0);
      for (var o in t)
        l = t[o], t.hasOwnProperty(o) && n[o] !== l && (ii(e, o, l), Ee = !0);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && ii(e, i, t[i]);
  }
  function lo(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ui = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), ci = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function qt(e) {
    return ci.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function nn() {
  }
  var ao = null;
  function oo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ke = null, jt = null;
  function Un(e) {
    var t = no(e);
    if (t && (e = t.stateNode)) {
      var n = e[Yt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Jt(
            e,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), t = n.name, n.type === "radio" && t != null) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + ut(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var o = l[Yt] || null;
                if (!o) throw Error(u(90));
                Jt(
                  l,
                  o.value,
                  o.defaultValue,
                  o.defaultValue,
                  o.checked,
                  o.defaultChecked,
                  o.type,
                  o.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              l = n[t], l.form === e.form && nr(l);
          }
          break e;
        case "textarea":
          ar(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && sn(e, !!n.multiple, t, !1);
      }
    }
  }
  var xn = !1;
  function ro(e, t, n) {
    if (xn) return e(t, n);
    xn = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (xn = !1, (ke !== null || jt !== null) && (yc(), ke && (t = ke, e = jt, jt = ke = null, Un(t), e)))
        for (t = 0; t < e.length; t++) Un(e[t]);
    }
  }
  function Ul(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[Yt] || null;
    if (l === null) return null;
    n = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        u(231, t, typeof n)
      );
    return n;
  }
  var kt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), io = !1;
  if (kt)
    try {
      var si = {};
      Object.defineProperty(si, "passive", {
        get: function() {
          io = !0;
        }
      }), window.addEventListener("test", si, si), window.removeEventListener("test", si, si);
    } catch {
      io = !1;
    }
  var ma = null, Cs = null, bu = null;
  function v0() {
    if (bu) return bu;
    var e, t = Cs, n = t.length, l, o = "value" in ma ? ma.value : ma.textContent, i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++) ;
    var d = n - e;
    for (l = 1; l <= d && t[n - l] === o[i - l]; l++) ;
    return bu = o.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Su(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function xu() {
    return !0;
  }
  function g0() {
    return !1;
  }
  function ln(e) {
    function t(n, l, o, i, d) {
      this._reactName = n, this._targetInst = o, this.type = l, this.nativeEvent = i, this.target = d, this.currentTarget = null;
      for (var g in e)
        e.hasOwnProperty(g) && (n = e[g], this[g] = n ? n(i) : i[g]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? xu : g0, this.isPropagationStopped = g0, this;
    }
    return X(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = xu);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = xu);
      },
      persist: function() {
      },
      isPersistent: xu
    }), t;
  }
  var ha = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Eu = ln(ha), fi = X({}, ha, { view: 0, detail: 0 }), Xb = ln(fi), ws, Ts, di, Cu = X({}, fi, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Os,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== di && (di && e.type === "mousemove" ? (ws = e.screenX - di.screenX, Ts = e.screenY - di.screenY) : Ts = ws = 0, di = e), ws);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Ts;
    }
  }), p0 = ln(Cu), Qb = X({}, Cu, { dataTransfer: 0 }), Zb = ln(Qb), Kb = X({}, fi, { relatedTarget: 0 }), As = ln(Kb), Pb = X({}, ha, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Fb = ln(Pb), Jb = X({}, ha, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), $b = ln(Jb), Wb = X({}, ha, { data: 0 }), y0 = ln(Wb), e1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, t1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, n1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function l1(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = n1[e]) ? !!t[e] : !1;
  }
  function Os() {
    return l1;
  }
  var a1 = X({}, fi, {
    key: function(e) {
      if (e.key) {
        var t = e1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Su(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? t1[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Os,
    charCode: function(e) {
      return e.type === "keypress" ? Su(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Su(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), o1 = ln(a1), r1 = X({}, Cu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), b0 = ln(r1), i1 = X({}, ha, { submitter: 0 }), u1 = ln(i1), c1 = X({}, fi, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Os
  }), s1 = ln(c1), f1 = X({}, ha, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), d1 = ln(f1), m1 = X({}, Cu, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), h1 = ln(m1), v1 = X({}, ha, {
    newState: 0,
    oldState: 0,
    source: 0
  }), g1 = ln(v1), p1 = [9, 13, 27, 32], _s = kt && "CompositionEvent" in window, mi = null;
  kt && "documentMode" in document && (mi = document.documentMode);
  var y1 = kt && "TextEvent" in window && !mi, S0 = kt && (!_s || mi && 8 < mi && 11 >= mi), x0 = " ", E0 = !1;
  function C0(e, t) {
    switch (e) {
      case "keyup":
        return p1.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function w0(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var or = !1;
  function b1(e, t) {
    switch (e) {
      case "compositionend":
        return w0(t);
      case "keypress":
        return t.which !== 32 ? null : (E0 = !0, x0);
      case "textInput":
        return e = t.data, e === x0 && E0 ? null : e;
      default:
        return null;
    }
  }
  function S1(e, t) {
    if (or)
      return e === "compositionend" || !_s && C0(e, t) ? (e = v0(), bu = Cs = ma = null, or = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return S0 && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var x1 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function T0(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!x1[e.type] : t === "textarea";
  }
  function A0(e, t, n, l) {
    ke ? jt ? jt.push(l) : jt = [l] : ke = l, t = wc(t, "onChange"), 0 < t.length && (n = new Eu(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var hi = null, vi = null;
  function E1(e) {
    mg(e, 0);
  }
  function wu(e) {
    var t = q(e);
    if (nr(t)) return e;
  }
  function O0(e, t) {
    if (e === "change") return t;
  }
  var _0 = !1;
  if (kt) {
    var Rs;
    if (kt) {
      var Ms = "oninput" in document;
      if (!Ms) {
        var R0 = document.createElement("div");
        R0.setAttribute("oninput", "return;"), Ms = typeof R0.oninput == "function";
      }
      Rs = Ms;
    } else Rs = !1;
    _0 = Rs && (!document.documentMode || 9 < document.documentMode);
  }
  function M0() {
    hi && (hi.detachEvent("onpropertychange", N0), vi = hi = null);
  }
  function N0(e) {
    if (e.propertyName === "value" && wu(vi)) {
      var t = [];
      A0(
        t,
        vi,
        e,
        oo(e)
      ), ro(E1, t);
    }
  }
  function C1(e, t, n) {
    e === "focusin" ? (M0(), hi = t, vi = n, hi.attachEvent("onpropertychange", N0)) : e === "focusout" && M0();
  }
  function w1(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return wu(vi);
  }
  function T1(e, t) {
    if (e === "click") return wu(t);
  }
  function A1(e, t) {
    if (e === "input" || e === "change")
      return wu(t);
  }
  function O1(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var En = typeof Object.is == "function" ? Object.is : O1;
  function gi(e, t) {
    if (En(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var o = n[l];
      if (!Io.call(t, o) || !En(e[o], t[o]))
        return !1;
    }
    return !0;
  }
  function Ns(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function D0(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function z0(e, t) {
    var n = D0(e);
    e = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (l = e + n.textContent.length, e <= t && l >= t)
          return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = D0(n);
    }
  }
  function j0(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? j0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function U0(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ns(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ns(e.document);
    }
    return t;
  }
  function Ds(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var _1 = kt && "documentMode" in document && 11 >= document.documentMode, rr = null, zs = null, pi = null, js = !1;
  function H0(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    js || rr == null || rr !== Ns(l) || (l = rr, "selectionStart" in l && Ds(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), pi && gi(pi, l) || (pi = l, l = wc(zs, "onSelect"), 0 < l.length && (t = new Eu(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = rr)));
  }
  function uo(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var ir = {
    animationend: uo("Animation", "AnimationEnd"),
    animationiteration: uo("Animation", "AnimationIteration"),
    animationstart: uo("Animation", "AnimationStart"),
    transitionrun: uo("Transition", "TransitionRun"),
    transitionstart: uo("Transition", "TransitionStart"),
    transitioncancel: uo("Transition", "TransitionCancel"),
    transitionend: uo("Transition", "TransitionEnd")
  }, Us = {}, L0 = {};
  kt && (L0 = document.createElement("div").style, "AnimationEvent" in window || (delete ir.animationend.animation, delete ir.animationiteration.animation, delete ir.animationstart.animation), "TransitionEvent" in window || delete ir.transitionend.transition);
  function co(e) {
    if (Us[e]) return Us[e];
    if (!ir[e]) return e;
    var t = ir[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in L0)
        return Us[e] = t[n];
    return e;
  }
  var B0 = co("animationend"), V0 = co("animationiteration"), G0 = co("animationstart"), R1 = co("transitionrun"), M1 = co("transitionstart"), N1 = co("transitioncancel"), Y0 = co("transitionend"), q0 = /* @__PURE__ */ new Map(), Hs = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Hs.push("scrollEnd");
  function $n(e, t) {
    q0.set(e, t), ze(t, [e]);
  }
  var D1 = 0;
  function Hl(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = nl.identifierPrefix;
    var n = D1++;
    return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
  }
  function k0(e) {
    if (e == null || typeof e == "string")
      return e;
    var t = null, n = Or;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var o = e[n[l]];
        if (o != null) {
          if (o === "none") return "none";
          t = t == null ? o : t + (" " + o);
        }
      }
    return t ?? e.default;
  }
  function Ll(e, t) {
    return e = k0(e), t = k0(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
  }
  var Tu = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Hn = [], ur = 0, Ls = 0;
  function Au() {
    for (var e = ur, t = Ls = ur = 0; t < e; ) {
      var n = Hn[t];
      Hn[t++] = null;
      var l = Hn[t];
      Hn[t++] = null;
      var o = Hn[t];
      Hn[t++] = null;
      var i = Hn[t];
      if (Hn[t++] = null, l !== null && o !== null) {
        var d = l.pending;
        d === null ? o.next = o : (o.next = d.next, d.next = o), l.pending = o;
      }
      i !== 0 && I0(n, o, i);
    }
  }
  function Ou(e, t, n, l) {
    Hn[ur++] = e, Hn[ur++] = t, Hn[ur++] = n, Hn[ur++] = l, Ls |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Bs(e, t, n, l) {
    return Ou(e, t, n, l), _u(e);
  }
  function so(e, t) {
    return Ou(e, null, null, t), _u(e);
  }
  function I0(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var o = !1, i = e.return; i !== null; )
      i.childLanes |= n, l = i.alternate, l !== null && (l.childLanes |= n), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (o = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, o && t !== null && (o = 31 - zt(n), e = i.hiddenUpdates, l = e[o], l === null ? e[o] = [t] : l.push(t), t.lane = n | 536870912), i) : null;
  }
  function _u(e) {
    if (50 < Vi)
      throw Vi = 0, pc = null, Error(u(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var cr = {};
  function z1(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function fn(e, t, n, l) {
    return new z1(e, t, n, l);
  }
  function Vs(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Bl(e, t) {
    var n = e.alternate;
    return n === null ? (n = fn(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function X0(e, t) {
    e.flags &= 1206910978;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ru(e, t, n, l, o, i) {
    var d = 0;
    if (l = e, typeof l == "function") Vs(l) && (d = 1);
    else if (typeof l == "string")
      d = ix(
        e,
        n,
        Dn.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (l) {
        case Ye:
          return e = fn(31, n, t, o), e.elementType = Ye, e.lanes = i, e;
        case ie:
          return fo(n.children, o, i, t);
        case ee:
          d = 8, o |= 24;
          break;
        case fe:
          return e = fn(12, n, t, o | 2), e.elementType = fe, e.lanes = i, e;
        case J:
          return e = fn(13, n, t, o), e.elementType = J, e.lanes = i, e;
        case te:
          return e = fn(19, n, t, o), e.elementType = te, e.lanes = i, e;
        case De:
        case R:
          return e = o | 32, e = fn(30, n, t, e), e.elementType = R, e.lanes = i, e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, e;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case he:
                d = 10;
                break e;
              case ge:
                d = 9;
                break e;
              case Q:
                d = 11;
                break e;
              case de:
                d = 14;
                break e;
              case G:
                d = 16, l = null;
                break e;
            }
          d = 29, n = Error(
            u(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = fn(d, n, t, o), t.elementType = e, t.type = l, t.lanes = i, t;
  }
  function fo(e, t, n, l) {
    return e = fn(7, e, l, t), e.lanes = n, e;
  }
  function Gs(e, t, n) {
    return e = fn(6, e, null, t), e.lanes = n, e;
  }
  function Q0(e) {
    var t = fn(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Ys(e, t, n) {
    return t = fn(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Z0 = /* @__PURE__ */ new WeakMap();
  function Ln(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Z0.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: $a(t)
      }, Z0.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: $a(t)
    };
  }
  var sr = [], fr = 0, Mu = null, yi = 0, Bn = [], Vn = 0, va = null, fl = 1, dl = "";
  function Vl(e, t) {
    sr[fr++] = yi, sr[fr++] = Mu, Mu = e, yi = t;
  }
  function K0(e, t, n) {
    Bn[Vn++] = fl, Bn[Vn++] = dl, Bn[Vn++] = va, va = e;
    var l = fl;
    e = dl;
    var o = 32 - zt(l) - 1;
    l &= ~(1 << o), n += 1;
    var i = 32 - zt(t) + o;
    if (30 < i) {
      var d = o - o % 5;
      i = (l & (1 << d) - 1).toString(32), l >>= d, o -= d, fl = 1 << 32 - zt(t) + o | n << o | l, dl = i + e;
    } else
      fl = 1 << i | n << o | l, dl = e;
  }
  function Nu(e) {
    e.return !== null && (Vl(e, 1), K0(e, 1, 0));
  }
  function qs(e) {
    for (; e === Mu; )
      Mu = sr[--fr], sr[fr] = null, yi = sr[--fr], sr[fr] = null;
    for (; e === va; )
      va = Bn[--Vn], Bn[Vn] = null, dl = Bn[--Vn], Bn[Vn] = null, fl = Bn[--Vn], Bn[Vn] = null;
  }
  function P0(e, t) {
    Bn[Vn++] = fl, Bn[Vn++] = dl, Bn[Vn++] = va, fl = t.id, dl = t.overflow, va = e;
  }
  var Ut = null, ot = null, Ue = !1, ga = null, Gn = !1, ks = Error(u(519));
  function pa(e) {
    var t = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw bi(Ln(t, e)), ks;
  }
  function F0(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[dt] = e, t[Yt] = l, n) {
      case "dialog":
        Be("cancel", t), Be("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Be("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Yi.length; n++)
          Be(Yi[n], t);
        break;
      case "source":
        Be("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Be("error", t), Be("load", t);
        break;
      case "details":
        Be("toggle", t);
        break;
      case "input":
        Be("invalid", t), fa(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        Be("invalid", t);
        break;
      case "textarea":
        Be("invalid", t), bn(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || pg(t.textContent, n) ? (l.popover != null && (Be("beforetoggle", t), Be("toggle", t)), l.onScroll != null && Be("scroll", t), l.onScrollEnd != null && Be("scrollend", t), l.onClick != null && (t.onclick = nn), t = !0) : t = !1, t || pa(e, !0);
  }
  function Du(e) {
    for (Ut = e.return; Ut; )
      switch (Ut.tag) {
        case 5:
        case 31:
        case 13:
          Gn = !1;
          return;
        case 27:
        case 3:
          Gn = !0;
          return;
        default:
          Ut = Ut.return;
      }
  }
  function dr(e) {
    if (e !== Ut) return !1;
    if (!Ue) return Du(e), Ue = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Sd(e.type, e.memoizedProps)), n = !n), n && ot && pa(e), Du(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      ot = Hg(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      ot = Hg(e);
    } else
      t === 27 ? (t = ot, za(e.type) ? (e = Rd, Rd = null, ot = e) : ot = t) : ot = Ut ? qn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function mo() {
    ot = Ut = null, Ue = !1;
  }
  function Is() {
    var e = ga;
    return e !== null && (hn === null ? hn = e : hn.push.apply(
      hn,
      e
    ), ga = null), e;
  }
  function bi(e) {
    ga === null ? ga = [e] : ga.push(e);
  }
  var Xs = St(null), ho = null, Gl = null;
  function ya(e, t, n) {
    Xe(Xs, t._currentValue), t._currentValue = n;
  }
  function Yl(e) {
    e._currentValue = Xs.current, st(Xs);
  }
  function zu(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Qs(e, t, n, l) {
    var o = e.child;
    for (o !== null && (o.return = e); o !== null; ) {
      var i = o.dependencies;
      if (i !== null) {
        var d = o.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var g = i;
          i = o;
          for (var T = 0; T < t.length; T++)
            if (g.context === t[T]) {
              i.lanes |= n, g = i.alternate, g !== null && (g.lanes |= n), zu(
                i.return,
                n,
                e
              ), l || (d = null);
              break e;
            }
          i = g.next;
        }
      } else if (o.tag === 18) {
        if (d = o.return, d === null) throw Error(u(341));
        d.lanes |= n, i = d.alternate, i !== null && (i.lanes |= n), zu(d, n, e), d = null;
      } else
        o.tag === 13 && o.memoizedState !== null && o.memoizedState.dehydrated === null ? (o.lanes |= n, d = o.alternate, d !== null && (d.lanes |= n), zu(
          o.return,
          n,
          e
        ), d = o.child, d = d !== null ? d.sibling : null) : d = o.child;
      if (d !== null) d.return = o;
      else
        for (d = o; d !== null; ) {
          if (d === e) {
            d = null;
            break;
          }
          if (o = d.sibling, o !== null) {
            o.return = d.return, d = o;
            break;
          }
          d = d.return;
        }
      o = d;
    }
  }
  function vo(e, t, n, l) {
    e = null;
    for (var o = t, i = !1; o !== null; ) {
      if (!i) {
        if ((o.flags & 524288) !== 0) i = !0;
        else if ((o.flags & 262144) !== 0) break;
      }
      if (o.tag === 10) {
        var d = o.alternate;
        if (d === null) throw Error(u(387));
        if (d = d.memoizedProps, d !== null) {
          var g = o.type;
          En(o.pendingProps.value, d.value) || (e !== null ? e.push(g) : e = [g]);
        }
      } else if (o === Yo.current) {
        if (d = o.alternate, d === null) throw Error(u(387));
        d.memoizedState.memoizedState !== o.memoizedState.memoizedState && (e !== null ? e.push(Lr) : e = [Lr]);
      }
      o = o.return;
    }
    return e !== null && Qs(
      t,
      e,
      n,
      l
    ), t.flags |= 262144, e !== null;
  }
  function ju(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!En(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function go(e) {
    ho = e, Gl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function It(e) {
    return J0(ho, e);
  }
  function Uu(e, t) {
    return ho === null && go(e), J0(e, t);
  }
  function J0(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, Gl === null) {
      if (e === null) throw Error(u(308));
      Gl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Gl = Gl.next = t;
    return n;
  }
  var j1 = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, U1 = a.unstable_scheduleCallback, H1 = a.unstable_NormalPriority, wt = {
    $$typeof: he,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Zs() {
    return {
      controller: new j1(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Si(e) {
    e.refCount--, e.refCount === 0 && U1(H1, function() {
      e.controller.abort();
    });
  }
  function $0(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var n = e.transitionTypes;
      for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var l = t[e];
        n.indexOf(l) === -1 && n.push(l);
      }
    }
  }
  var xi = null;
  function L1(e) {
    var t = e.transitionTypes;
    return e.transitionTypes = null, t;
  }
  var Ei = null, Ks = 0, po = 0, mr = null;
  function B1(e, t) {
    if (Ei === null) {
      var n = Ei = [];
      Ks = 0, po = fd(), mr = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return Ks++, t.then(W0, W0), t;
  }
  function W0() {
    if (--Ks === 0 && (xi = null, Ei !== null)) {
      mr !== null && (mr.status = "fulfilled");
      var e = Ei;
      Ei = null, po = 0, mr = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function V1(e, t) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(o) {
        n.push(o);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var o = 0; o < n.length; o++) (0, n[o])(t);
      },
      function(o) {
        for (l.status = "rejected", l.reason = o, o = 0; o < n.length; o++)
          (0, n[o])(void 0);
      }
    ), l;
  }
  var eh = le.S;
  le.S = function(e, t) {
    if (Qv = en(), typeof t == "object" && t !== null && typeof t.then == "function" && B1(e, t), xi !== null)
      for (var n = Nr; n !== null; )
        $0(n, xi), n = n.next;
    if (n = e.types, n !== null) {
      for (var l = Nr; l !== null; )
        $0(l, n), l = l.next;
      if (po !== 0) {
        l = xi, l === null && (l = xi = []);
        for (var o = 0; o < n.length; o++) {
          var i = n[o];
          l.indexOf(i) === -1 && l.push(i);
        }
      }
    }
    eh !== null && eh(e, t);
  };
  var yo = St(null);
  function Ps() {
    var e = yo.current;
    return e !== null ? e : lt.pooledCache;
  }
  function Hu(e, t) {
    t === null ? Xe(yo, yo.current) : Xe(yo, t.pool);
  }
  function th() {
    var e = Ps();
    return e === null ? null : { parent: wt._currentValue, pool: e };
  }
  var hr = Error(u(460)), Fs = Error(u(474)), Lu = Error(u(542)), Bu = { then: function() {
  } };
  function nh(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function lh(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(nn, nn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, oh(e), e === void 0 && !("reason" in t) ? Error(u(600)) : e;
      default:
        if (typeof t.status == "string") t.then(nn, nn);
        else {
          if (e = lt, e !== null && 100 < e.shellSuspendCounter)
            throw Error(u(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var o = t;
                o.status = "fulfilled", o.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var o = t;
                o.status = "rejected", o.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, oh(e), e;
        }
        throw So = t, hr;
    }
  }
  function bo(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (So = n, hr) : n;
    }
  }
  var So = null;
  function ah() {
    if (So === null) throw Error(u(459));
    var e = So;
    return So = null, e;
  }
  function oh(e) {
    if (e === hr || e === Lu)
      throw Error(u(483));
  }
  var vr = null, Ci = 0;
  function Vu(e) {
    var t = Ci;
    return Ci += 1, vr === null && (vr = []), lh(vr, e, t);
  }
  function ba(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Gu(e, t) {
    throw t.$$typeof === L ? Error(u(525)) : (e = Object.prototype.toString.call(t), Error(
      u(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function rh(e) {
    function t(U, N) {
      if (e) {
        var B = U.deletions;
        B === null ? (U.deletions = [N], U.flags |= 16) : B.push(N);
      }
    }
    function n(U, N) {
      if (!e) return null;
      for (; N !== null; )
        t(U, N), N = N.sibling;
      return null;
    }
    function l(U) {
      for (var N = /* @__PURE__ */ new Map(); U !== null; )
        U.key === null ? N.set(U.index, U) : N.set(U.key, U), U = U.sibling;
      return N;
    }
    function o(U, N) {
      return U = Bl(U, N), U.index = 0, U.sibling = null, U;
    }
    function i(U, N, B) {
      return U.index = B, e ? (B = U.alternate, B !== null ? (B = B.index, B < N ? (U.flags |= 2, N) : B) : (U.flags |= 134217730, N)) : (U.flags |= 1048576, N);
    }
    function d(U) {
      return e && U.alternate === null && (U.flags |= 134217730), U;
    }
    function g(U, N, B, K) {
      return N === null || N.tag !== 6 ? (N = Gs(B, U.mode, K), N.return = U, N) : (N = o(N, B), N.return = U, N);
    }
    function T(U, N, B, K) {
      var me = B.type;
      return me === ie ? (U = k(
        U,
        N,
        B.props.children,
        K,
        B.key
      ), ba(U, B), U) : N !== null && (N.elementType === me || typeof me == "object" && me !== null && me.$$typeof === G && bo(me) === N.type) ? (N = o(N, B.props), ba(N, B), N.return = U, N) : (N = Ru(
        B.type,
        B.key,
        B.props,
        null,
        U.mode,
        K
      ), ba(N, B), N.return = U, N);
    }
    function H(U, N, B, K) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== B.containerInfo || N.stateNode.implementation !== B.implementation ? (N = Ys(B, U.mode, K), N.return = U, N) : (N = o(N, B.children || []), N.return = U, N);
    }
    function k(U, N, B, K, me) {
      return N === null || N.tag !== 7 ? (N = fo(
        B,
        U.mode,
        K,
        me
      ), N.return = U, N) : (N = o(N, B), N.return = U, N);
    }
    function P(U, N, B) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = Gs(
          "" + N,
          U.mode,
          B
        ), N.return = U, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case F:
            return B = Ru(
              N.type,
              N.key,
              N.props,
              null,
              U.mode,
              B
            ), ba(B, N), B.return = U, B;
          case ae:
            return N = Ys(
              N,
              U.mode,
              B
            ), N.return = U, N;
          case G:
            return N = bo(N), P(U, N, B);
        }
        if (xe(N) || se(N))
          return N = fo(
            N,
            U.mode,
            B,
            null
          ), N.return = U, N;
        if (typeof N.then == "function")
          return P(U, Vu(N), B);
        if (N.$$typeof === he)
          return P(
            U,
            Uu(U, N),
            B
          );
        Gu(U, N);
      }
      return null;
    }
    function z(U, N, B, K) {
      var me = N !== null ? N.key : null;
      if (typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint")
        return me !== null ? null : g(U, N, "" + B, K);
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case F:
            return B.key === me ? T(U, N, B, K) : null;
          case ae:
            return B.key === me ? H(U, N, B, K) : null;
          case G:
            return B = bo(B), z(U, N, B, K);
        }
        if (xe(B) || se(B))
          return me !== null ? null : k(U, N, B, K, null);
        if (typeof B.then == "function")
          return z(
            U,
            N,
            Vu(B),
            K
          );
        if (B.$$typeof === he)
          return z(
            U,
            N,
            Uu(U, B),
            K
          );
        Gu(U, B);
      }
      return null;
    }
    function V(U, N, B, K, me) {
      if (typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint")
        return U = U.get(B) || null, g(N, U, "" + K, me);
      if (typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case F:
            return U = U.get(
              K.key === null ? B : K.key
            ) || null, T(N, U, K, me);
          case ae:
            return U = U.get(
              K.key === null ? B : K.key
            ) || null, H(N, U, K, me);
          case G:
            return K = bo(K), V(
              U,
              N,
              B,
              K,
              me
            );
        }
        if (xe(K) || se(K))
          return U = U.get(B) || null, k(N, U, K, me, null);
        if (typeof K.then == "function")
          return V(
            U,
            N,
            B,
            Vu(K),
            me
          );
        if (K.$$typeof === he)
          return V(
            U,
            N,
            B,
            Uu(N, K),
            me
          );
        Gu(N, K);
      }
      return null;
    }
    function ce(U, N, B, K) {
      for (var me = null, Ge = null, Se = N, Te = N = 0, Ot = null; Se !== null && Te < B.length; Te++) {
        Se.index > Te ? (Ot = Se, Se = null) : Ot = Se.sibling;
        var Ie = z(
          U,
          Se,
          B[Te],
          K
        );
        if (Ie === null) {
          Se === null && (Se = Ot);
          break;
        }
        e && Se && Ie.alternate === null && t(U, Se), N = i(Ie, N, Te), Ge === null ? me = Ie : Ge.sibling = Ie, Ge = Ie, Se = Ot;
      }
      if (Te === B.length)
        return n(U, Se), Ue && Vl(U, Te), me;
      if (Se === null) {
        for (; Te < B.length; Te++)
          Se = P(U, B[Te], K), Se !== null && (N = i(
            Se,
            N,
            Te
          ), Ge === null ? me = Se : Ge.sibling = Se, Ge = Se);
        return Ue && Vl(U, Te), me;
      }
      for (Se = l(Se); Te < B.length; Te++)
        Ot = V(
          Se,
          U,
          Te,
          B[Te],
          K
        ), Ot !== null && (e && (Ie = Ot.alternate, Ie !== null && Se.delete(Ie.key === null ? Te : Ie.key)), N = i(
          Ot,
          N,
          Te
        ), Ge === null ? me = Ot : Ge.sibling = Ot, Ge = Ot);
      return e && Se.forEach(function(Ba) {
        return t(U, Ba);
      }), Ue && Vl(U, Te), me;
    }
    function ye(U, N, B, K) {
      if (B == null) throw Error(u(151));
      for (var me = null, Ge = null, Se = N, Te = N = 0, Ot = null, Ie = B.next(); Se !== null && !Ie.done; Te++, Ie = B.next()) {
        Se.index > Te ? (Ot = Se, Se = null) : Ot = Se.sibling;
        var Ba = z(U, Se, Ie.value, K);
        if (Ba === null) {
          Se === null && (Se = Ot);
          break;
        }
        e && Se && Ba.alternate === null && t(U, Se), N = i(Ba, N, Te), Ge === null ? me = Ba : Ge.sibling = Ba, Ge = Ba, Se = Ot;
      }
      if (Ie.done)
        return n(U, Se), Ue && Vl(U, Te), me;
      if (Se === null) {
        for (; !Ie.done; Te++, Ie = B.next())
          Ie = P(U, Ie.value, K), Ie !== null && (N = i(Ie, N, Te), Ge === null ? me = Ie : Ge.sibling = Ie, Ge = Ie);
        return Ue && Vl(U, Te), me;
      }
      for (Se = l(Se); !Ie.done; Te++, Ie = B.next())
        Ie = V(Se, U, Te, Ie.value, K), Ie !== null && (e && (Ot = Ie.alternate, Ot !== null && Se.delete(
          Ot.key === null ? Te : Ot.key
        )), N = i(Ie, N, Te), Ge === null ? me = Ie : Ge.sibling = Ie, Ge = Ie);
      return e && Se.forEach(function(bx) {
        return t(U, bx);
      }), Ue && Vl(U, Te), me;
    }
    function Ne(U, N, B, K) {
      if (typeof B == "object" && B !== null && B.type === ie && B.key === null && B.props.ref === void 0 && (B = B.props.children), typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case F:
            e: {
              for (var me = B.key; N !== null; ) {
                if (N.key === me) {
                  if (me = B.type, me === ie) {
                    if (N.tag === 7) {
                      n(
                        U,
                        N.sibling
                      ), K = o(
                        N,
                        B.props.children
                      ), ba(K, B), K.return = U, U = K;
                      break e;
                    }
                  } else if (N.elementType === me || typeof me == "object" && me !== null && me.$$typeof === G && bo(me) === N.type) {
                    n(
                      U,
                      N.sibling
                    ), K = o(N, B.props), ba(K, B), K.return = U, U = K;
                    break e;
                  }
                  n(U, N);
                  break;
                } else t(U, N);
                N = N.sibling;
              }
              B.type === ie ? (K = fo(
                B.props.children,
                U.mode,
                K,
                B.key
              ), ba(K, B), K.return = U, U = K) : (K = Ru(
                B.type,
                B.key,
                B.props,
                null,
                U.mode,
                K
              ), ba(K, B), K.return = U, U = K);
            }
            return d(U);
          case ae:
            e: {
              for (me = B.key; N !== null; ) {
                if (N.key === me)
                  if (N.tag === 4 && N.stateNode.containerInfo === B.containerInfo && N.stateNode.implementation === B.implementation) {
                    n(
                      U,
                      N.sibling
                    ), K = o(N, B.children || []), K.return = U, U = K;
                    break e;
                  } else {
                    n(U, N);
                    break;
                  }
                else t(U, N);
                N = N.sibling;
              }
              K = Ys(B, U.mode, K), K.return = U, U = K;
            }
            return d(U);
          case G:
            return B = bo(B), Ne(
              U,
              N,
              B,
              K
            );
        }
        if (xe(B))
          return ce(
            U,
            N,
            B,
            K
          );
        if (se(B)) {
          if (me = se(B), typeof me != "function") throw Error(u(150));
          return B = me.call(B), ye(
            U,
            N,
            B,
            K
          );
        }
        if (typeof B.then == "function")
          return Ne(
            U,
            N,
            Vu(B),
            K
          );
        if (B.$$typeof === he)
          return Ne(
            U,
            N,
            Uu(U, B),
            K
          );
        Gu(U, B);
      }
      return typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint" ? (B = "" + B, N !== null && N.tag === 6 ? (n(U, N.sibling), K = o(N, B), K.return = U, U = K) : (n(U, N), K = Gs(B, U.mode, K), K.return = U, U = K), d(U)) : n(U, N);
    }
    return function(U, N, B, K) {
      try {
        Ci = 0;
        var me = Ne(
          U,
          N,
          B,
          K
        );
        return vr = null, me;
      } catch (Se) {
        if (Se === hr || Se === Lu) throw Se;
        var Ge = fn(29, Se, null, U.mode);
        return Ge.lanes = K, Ge.return = U, Ge;
      }
    };
  }
  var xo = rh(!0), ih = rh(!1), Sa = !1;
  function Js(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function $s(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function xa(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Ea(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Ze & 2) !== 0) {
      var o = l.pending;
      return o === null ? t.next = t : (t.next = o.next, o.next = t), l.pending = t, t = _u(e), I0(e, null, n), t;
    }
    return Ou(e, l, t, n), _u(e);
  }
  function wi(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Fo(e, n);
    }
  }
  function Ws(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var o = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var d = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          i === null ? o = i = d : i = i.next = d, n = n.next;
        } while (n !== null);
        i === null ? o = i = t : i = i.next = t;
      } else o = i = t;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: o,
        lastBaseUpdate: i,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var ef = !1;
  function Ti() {
    if (ef) {
      var e = mr;
      if (e !== null) throw e;
    }
  }
  function Ai(e, t, n, l) {
    ef = !1;
    var o = e.updateQueue;
    Sa = !1;
    var i = o.firstBaseUpdate, d = o.lastBaseUpdate, g = o.shared.pending;
    if (g !== null) {
      o.shared.pending = null;
      var T = g, H = T.next;
      T.next = null, d === null ? i = H : d.next = H, d = T;
      var k = e.alternate;
      k !== null && (k = k.updateQueue, g = k.lastBaseUpdate, g !== d && (g === null ? k.firstBaseUpdate = H : g.next = H, k.lastBaseUpdate = T));
    }
    if (i !== null) {
      var P = o.baseState;
      d = 0, k = H = T = null, g = i;
      do {
        var z = g.lane & -536870913, V = z !== g.lane;
        if (V ? (Ve & z) === z : (l & z) === z) {
          z !== 0 && z === po && (ef = !0), k !== null && (k = k.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          e: {
            var ce = e, ye = g;
            z = t;
            var Ne = n;
            switch (ye.tag) {
              case 1:
                if (ce = ye.payload, typeof ce == "function") {
                  P = ce.call(Ne, P, z);
                  break e;
                }
                P = ce;
                break e;
              case 3:
                ce.flags = ce.flags & -65537 | 128;
              case 0:
                if (ce = ye.payload, z = typeof ce == "function" ? ce.call(Ne, P, z) : ce, z == null) break e;
                P = X({}, P, z);
                break e;
              case 2:
                Sa = !0;
            }
          }
          z = g.callback, z !== null && (e.flags |= 64, V && (e.flags |= 8192), V = o.callbacks, V === null ? o.callbacks = [z] : V.push(z));
        } else
          V = {
            lane: z,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, k === null ? (H = k = V, T = P) : k = k.next = V, d |= z;
        if (g = g.next, g === null) {
          if (g = o.shared.pending, g === null)
            break;
          V = g, g = V.next, V.next = null, o.lastBaseUpdate = V, o.shared.pending = null;
        }
      } while (!0);
      k === null && (T = P), o.baseState = T, o.firstBaseUpdate = H, o.lastBaseUpdate = k, i === null && (o.shared.lanes = 0), Ra |= d, e.lanes = d, e.memoizedState = P;
    }
  }
  function uh(e, t) {
    if (typeof e != "function")
      throw Error(u(191, e));
    e.call(t);
  }
  function ch(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        uh(n[e], t);
  }
  var Ca = St(null), Yu = St(0);
  function sh(e, t) {
    e = Ql, Xe(Yu, e), Xe(Ca, t), Ql = e | t.baseLanes;
  }
  function tf() {
    Xe(Yu, Ql), Xe(Ca, Ca.current);
  }
  function nf() {
    Ql = Yu.current, st(Ca), st(Yu);
  }
  var Xt = St(null), $t = null;
  function wa(e) {
    var t = e.alternate;
    Xe(Qt, Qt.current & 1), Xe(Xt, e), $t === null && (t === null || Ca.current !== null || t.memoizedState !== null) && ($t = e);
  }
  function lf(e) {
    Xe(Qt, Qt.current), Xe(Xt, e), $t === null && ($t = e);
  }
  function fh(e) {
    e.tag === 22 ? (Xe(Qt, Qt.current), Xe(Xt, e), $t === null && ($t = e)) : Ta();
  }
  function Ta() {
    Xe(Qt, Qt.current), Xe(Xt, Xt.current);
  }
  function Cn(e) {
    st(Xt), $t === e && ($t = null), st(Qt);
  }
  var Qt = St(0);
  function Oi(e, t) {
    Xe(Xt, Xt.current), Xe(Qt, t);
  }
  function af(e) {
    st(Qt), st(Xt), $t === e && ($t = null);
  }
  function qu(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Od(n) || _d(n)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var ql = 0, Me = null, tt = null, Tt = null, ku = !1, gr = !1, Eo = !1, Iu = 0, _i = 0, pr = null, G1 = 0;
  function vt() {
    throw Error(u(321));
  }
  function of(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!En(e[n], t[n])) return !1;
    return !0;
  }
  function rf(e, t, n, l, o, i) {
    return ql = i, Me = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, le.H = e === null || e.memoizedState === null ? Kh : Ph, Eo = !1, i = n(l, o), Eo = !1, gr && (i = mh(
      t,
      n,
      l,
      o
    )), dh(e), i;
  }
  function dh(e) {
    le.H = Ju;
    var t = tt !== null && tt.next !== null;
    if (ql = 0, Tt = tt = Me = null, ku = !1, _i = 0, pr = null, t) throw Error(u(300));
    e === null || At || (e = e.dependencies, e !== null && ju(e) && (At = !0));
  }
  function mh(e, t, n, l) {
    Me = e;
    var o = 0;
    do {
      if (gr && (pr = null), _i = 0, gr = !1, 25 <= o) throw Error(u(301));
      if (o += 1, Tt = tt = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      le.H = K1, i = t(n, l);
    } while (gr);
    return i;
  }
  function Y1() {
    var e = le.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Ri(t) : t, e = e.useState()[0], (tt !== null ? tt.memoizedState : null) !== e && (Me.flags |= 1024), t;
  }
  function uf() {
    var e = Iu !== 0;
    return Iu = 0, e;
  }
  function cf(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function sf(e) {
    if (ku) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ku = !1;
    }
    ql = 0, Tt = tt = Me = null, gr = !1, _i = Iu = 0, pr = null;
  }
  function an() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Tt === null ? Me.memoizedState = Tt = e : Tt = Tt.next = e, Tt;
  }
  function bt() {
    if (tt === null) {
      var e = Me.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = tt.next;
    var t = Tt === null ? Me.memoizedState : Tt.next;
    if (t !== null)
      Tt = t, tt = e;
    else {
      if (e === null)
        throw Me.alternate === null ? Error(u(467)) : Error(u(310));
      tt = e, e = {
        memoizedState: tt.memoizedState,
        baseState: tt.baseState,
        baseQueue: tt.baseQueue,
        queue: tt.queue,
        next: null
      }, Tt === null ? Me.memoizedState = Tt = e : Tt = Tt.next = e;
    }
    return Tt;
  }
  function Xu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ri(e) {
    var t = _i;
    return _i += 1, pr === null && (pr = []), e = lh(pr, e, t), t = Me, (Tt === null ? t.memoizedState : Tt.next) === null && (t = t.alternate, le.H = t === null || t.memoizedState === null ? Kh : Ph), e;
  }
  function Qu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Ri(e);
      if (e.$$typeof === Z) return;
      if (e.$$typeof === he) return It(e);
    }
    throw Error(u(438, String(e)));
  }
  function ff(e) {
    var t = null, n = Me.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = Me.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(o) {
          return o.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = Xu(), Me.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = qe;
    return t.index++, n;
  }
  function kl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Zu(e) {
    var t = bt();
    return df(t, tt, e);
  }
  function df(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(u(311));
    l.lastRenderedReducer = n;
    var o = e.baseQueue, i = l.pending;
    if (i !== null) {
      if (o !== null) {
        var d = o.next;
        o.next = i.next, i.next = d;
      }
      t.baseQueue = o = i, l.pending = null;
    }
    if (i = e.baseState, o === null) e.memoizedState = i;
    else {
      t = o.next;
      var g = d = null, T = null, H = t, k = !1;
      do {
        var P = H.lane & -536870913;
        if (P !== H.lane ? (Ve & P) === P : (ql & P) === P) {
          var z = H.revertLane;
          if (z === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: H.action,
              hasEagerState: H.hasEagerState,
              eagerState: H.eagerState,
              next: null
            }), P === po && (k = !0);
          else if ((ql & z) === z) {
            H = H.next, z === po && (k = !0);
            continue;
          } else
            P = {
              lane: 0,
              revertLane: H.revertLane,
              gesture: null,
              action: H.action,
              hasEagerState: H.hasEagerState,
              eagerState: H.eagerState,
              next: null
            }, T === null ? (g = T = P, d = i) : T = T.next = P, Me.lanes |= z, Ra |= z;
          P = H.action, Eo && n(i, P), i = H.hasEagerState ? H.eagerState : n(i, P);
        } else
          z = {
            lane: P,
            revertLane: H.revertLane,
            gesture: H.gesture,
            action: H.action,
            hasEagerState: H.hasEagerState,
            eagerState: H.eagerState,
            next: null
          }, T === null ? (g = T = z, d = i) : T = T.next = z, Me.lanes |= P, Ra |= P;
        H = H.next;
      } while (H !== null && H !== t);
      if (T === null ? d = i : T.next = g, !En(i, e.memoizedState) && (At = !0, k && (n = mr, n !== null)))
        throw n;
      e.memoizedState = i, e.baseState = d, e.baseQueue = T, l.lastRenderedState = i;
    }
    return o === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function mf(e) {
    var t = bt(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, o = n.pending, i = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var d = o = o.next;
      do
        i = e(i, d.action), d = d.next;
      while (d !== o);
      En(i, t.memoizedState) || (At = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, l];
  }
  function hh(e, t, n) {
    var l = Me, o = bt(), i = Ue;
    if (i) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else n = t();
    var d = !En(
      (tt || o).memoizedState,
      n
    );
    if (d && (o.memoizedState = n, At = !0), o = o.queue, gf(ph.bind(null, l, o, e), [
      e
    ]), e = o.getSnapshot !== t || d || Tt !== null && (Tt.memoizedState.tag & 1) !== 0, yr(
      e ? 9 : 8,
      { destroy: void 0 },
      gh.bind(null, l, o, n, t),
      null
    ), e) {
      if (l.flags |= 2048, lt === null) throw Error(u(349));
      i || (ql & 127) !== 0 || vh(l, t, n);
    }
    return n;
  }
  function vh(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Me.updateQueue, t === null ? (t = Xu(), Me.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function gh(e, t, n, l) {
    t.value = n, t.getSnapshot = l, yh(t) && bh(e);
  }
  function ph(e, t, n) {
    return n(function() {
      yh(t) && bh(e);
    });
  }
  function yh(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !En(e, n);
    } catch {
      return !0;
    }
  }
  function bh(e) {
    var t = so(e, 2);
    t !== null && vn(t, e, 2);
  }
  function hf(e) {
    var t = an();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Eo) {
        xt(!0);
        try {
          n();
        } finally {
          xt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: kl,
      lastRenderedState: e
    }, t;
  }
  function Sh(e, t, n, l) {
    return e.baseState = n, df(
      e,
      tt,
      typeof l == "function" ? l : kl
    );
  }
  function q1(e, t, n, l, o) {
    if (Fu(e)) throw Error(u(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: o,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(d) {
          i.listeners.push(d);
        }
      };
      le.T !== null ? n(!0) : i.isTransition = !1, l(i), n = t.pending, n === null ? (i.next = t.pending = i, xh(t, i)) : (i.next = n.next, t.pending = n.next = i);
    }
  }
  function xh(e, t) {
    var n = t.action, l = t.payload, o = e.state;
    if (t.isTransition) {
      var i = le.T, d = {};
      d.types = i !== null ? i.types : null, le.T = d;
      try {
        var g = n(o, l), T = le.S;
        T !== null && T(d, g), Eh(e, t, g);
      } catch (H) {
        vf(e, t, H);
      } finally {
        i !== null && d.types !== null && (i.types = d.types), le.T = i;
      }
    } else
      try {
        i = n(o, l), Eh(e, t, i);
      } catch (H) {
        vf(e, t, H);
      }
  }
  function Eh(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        Ch(e, t, l);
      },
      function(l) {
        return vf(e, t, l);
      }
    ) : Ch(e, t, n);
  }
  function Ch(e, t, n) {
    t.status = "fulfilled", t.value = n, wh(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, xh(e, n)));
  }
  function vf(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, wh(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function wh(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Th(e, t) {
    return t;
  }
  function Ah(e, t) {
    if (Ue) {
      var n = lt.formState;
      if (n !== null) {
        e: {
          var l = Me;
          if (Ue) {
            if (ot) {
              t: {
                for (var o = ot, i = Gn; o.nodeType !== 8; ) {
                  if (!i) {
                    o = null;
                    break t;
                  }
                  if (o = qn(
                    o.nextSibling
                  ), o === null) {
                    o = null;
                    break t;
                  }
                }
                i = o.data, o = i === "F!" || i === "F" ? o : null;
              }
              if (o) {
                ot = qn(
                  o.nextSibling
                ), l = o.data === "F!";
                break e;
              }
            }
            pa(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return n = an(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Th,
      lastRenderedState: t
    }, n.queue = l, n = Xh.bind(
      null,
      Me,
      l
    ), l.dispatch = n, l = hf(!1), i = xf.bind(
      null,
      Me,
      !1,
      l.queue
    ), l = an(), o = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = o, n = q1.bind(
      null,
      Me,
      o,
      i,
      n
    ), o.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function Oh(e) {
    var t = bt();
    return _h(t, tt, e);
  }
  function _h(e, t, n) {
    if (t = df(
      e,
      t,
      Th
    )[0], e = Zu(kl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = Ri(t);
      } catch (d) {
        throw d === hr ? Lu : d;
      }
    else l = t;
    t = bt();
    var o = t.queue, i = o.dispatch;
    return n !== t.memoizedState && (Me.flags |= 2048, yr(
      9,
      { destroy: void 0 },
      k1.bind(null, o, n),
      null
    )), [l, i, e];
  }
  function k1(e, t) {
    e.action = t;
  }
  function Rh(e) {
    var t = bt(), n = tt;
    if (n !== null)
      return _h(t, n, e);
    bt(), t = t.memoizedState, n = bt();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function yr(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = Me.updateQueue, t === null && (t = Xu(), Me.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function Mh() {
    return bt().memoizedState;
  }
  function Ku(e, t, n, l) {
    var o = an();
    Me.flags |= e, o.memoizedState = yr(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function Pu(e, t, n, l) {
    var o = bt();
    l = l === void 0 ? null : l;
    var i = o.memoizedState.inst;
    tt !== null && l !== null && of(l, tt.memoizedState.deps) ? o.memoizedState = yr(t, i, n, l) : (Me.flags |= e, o.memoizedState = yr(
      1 | t,
      i,
      n,
      l
    ));
  }
  function Nh(e, t) {
    Ku(8390656, 8, e, t);
  }
  function gf(e, t) {
    Pu(2048, 8, e, t);
  }
  function I1(e) {
    Me.flags |= 4;
    var t = Me.updateQueue;
    if (t === null)
      t = Xu(), Me.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function Dh(e) {
    var t = bt().memoizedState;
    return I1({ ref: t, nextImpl: e }), function() {
      if ((Ze & 2) !== 0) throw Error(u(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function zh(e, t) {
    return Pu(4, 2, e, t);
  }
  function jh(e, t) {
    return Pu(4, 4, e, t);
  }
  function Uh(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function() {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Hh(e, t, n) {
    n = n != null ? n.concat([e]) : null, Pu(4, 4, Uh.bind(null, t, e), n);
  }
  function pf() {
  }
  function Lh(e, t) {
    var n = bt();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && of(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function Bh(e, t) {
    var n = bt();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && of(t, l[1]))
      return l[0];
    if (l = e(), Eo) {
      xt(!0);
      try {
        e();
      } finally {
        xt(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function yf(e, t, n) {
    return n === void 0 || (ql & 1073741824) !== 0 && (Ve & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = Kv(), Me.lanes |= e, Ra |= e, n);
  }
  function Vh(e, t, n, l) {
    return En(n, t) ? n : Ca.current !== null ? (e = yf(e, n, l), En(e, t) || (At = !0), e) : (ql & 106) === 0 || (ql & 1073741824) !== 0 && (Ve & 261930) === 0 ? (At = !0, e.memoizedState = n) : (e = Kv(), Me.lanes |= e, Ra |= e, t);
  }
  function Gh(e, t, n, l, o) {
    var i = re.p;
    re.p = i !== 0 && 8 > i ? i : 8;
    var d = le.T, g = {};
    g.types = d !== null ? d.types : null, le.T = g, xf(e, !1, t, n);
    try {
      var T = o(), H = le.S;
      if (H !== null && H(g, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var k = V1(
          T,
          l
        );
        Mi(
          e,
          t,
          k,
          On(e)
        );
      } else
        Mi(
          e,
          t,
          l,
          On(e)
        );
    } catch (P) {
      Mi(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: P },
        On()
      );
    } finally {
      re.p = i, d !== null && g.types !== null && (d.types = g.types), le.T = d;
    }
  }
  function X1() {
  }
  function bf(e, t, n, l) {
    if (e.tag !== 5) throw Error(u(476));
    var o = Yh(e).queue;
    Gh(
      e,
      o,
      t,
      je,
      n === null ? X1 : function() {
        return qh(e), n(l);
      }
    );
  }
  function Yh(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: je,
      baseState: je,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: kl,
        lastRenderedState: je
      },
      next: null
    };
    var n = {};
    return t.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: kl,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function qh(e) {
    var t = Yh(e);
    t.next === null && (t = e.alternate.memoizedState), Mi(
      e,
      t.next.queue,
      {},
      On()
    );
  }
  function Sf() {
    return It(Lr);
  }
  function kh() {
    return bt().memoizedState;
  }
  function Ih() {
    return bt().memoizedState;
  }
  function Q1(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = On();
          e = xa(n);
          var l = Ea(t, e, n);
          l !== null && (vn(l, t, n), wi(l, t, n)), t = { cache: Zs() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Z1(e, t, n) {
    var l = On();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fu(e) ? Qh(t, n) : (n = Bs(e, t, n, l), n !== null && (vn(n, e, l), Zh(n, t, l)));
  }
  function Xh(e, t, n) {
    var l = On();
    Mi(e, t, n, l);
  }
  function Mi(e, t, n, l) {
    var o = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Fu(e)) Qh(t, o);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var d = t.lastRenderedState, g = i(d, n);
          if (o.hasEagerState = !0, o.eagerState = g, En(g, d))
            return Ou(e, t, o, 0), lt === null && Au(), !1;
        } catch {
        }
      if (n = Bs(e, t, o, l), n !== null)
        return vn(n, e, l), Zh(n, t, l), !0;
    }
    return !1;
  }
  function xf(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: fd(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Fu(e)) {
      if (t) throw Error(u(479));
    } else
      t = Bs(
        e,
        n,
        l,
        2
      ), t !== null && vn(t, e, 2);
  }
  function Fu(e) {
    var t = e.alternate;
    return e === Me || t !== null && t === Me;
  }
  function Qh(e, t) {
    gr = ku = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Zh(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Fo(e, n);
    }
  }
  var Ju = {
    readContext: It,
    use: Qu,
    useCallback: vt,
    useContext: vt,
    useEffect: vt,
    useImperativeHandle: vt,
    useLayoutEffect: vt,
    useInsertionEffect: vt,
    useMemo: vt,
    useReducer: vt,
    useRef: vt,
    useState: vt,
    useDebugValue: vt,
    useDeferredValue: vt,
    useTransition: vt,
    useSyncExternalStore: vt,
    useId: vt,
    useHostTransitionStatus: vt,
    useFormState: vt,
    useActionState: vt,
    useOptimistic: vt,
    useMemoCache: vt,
    useCacheRefresh: vt,
    useEffectEvent: vt
  }, Kh = {
    readContext: It,
    use: Qu,
    useCallback: function(e, t) {
      return an().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: It,
    useEffect: Nh,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, Ku(
        4194308,
        4,
        Uh.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return Ku(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Ku(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = an();
      t = t === void 0 ? null : t;
      var l = e();
      if (Eo) {
        xt(!0);
        try {
          e();
        } finally {
          xt(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = an();
      if (n !== void 0) {
        var o = n(t);
        if (Eo) {
          xt(!0);
          try {
            n(t);
          } finally {
            xt(!1);
          }
        }
      } else o = t;
      return l.memoizedState = l.baseState = o, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      }, l.queue = e, e = e.dispatch = Z1.bind(
        null,
        Me,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = an();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = hf(e);
      var t = e.queue, n = Xh.bind(null, Me, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: pf,
    useDeferredValue: function(e, t) {
      var n = an();
      return yf(n, e, t);
    },
    useTransition: function() {
      var e = hf(!1);
      return e = Gh.bind(
        null,
        Me,
        e.queue,
        !0,
        !1
      ), an().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = Me, o = an();
      if (Ue) {
        if (n === void 0)
          throw Error(u(407));
        n = n();
      } else {
        if (n = t(), lt === null)
          throw Error(u(349));
        (Ve & 127) !== 0 || vh(l, t, n);
      }
      o.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return o.queue = i, Nh(ph.bind(null, l, i, e), [
        e
      ]), l.flags |= 2048, yr(
        9,
        { destroy: void 0 },
        gh.bind(
          null,
          l,
          i,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = an(), t = lt.identifierPrefix;
      if (Ue) {
        var n = dl, l = fl;
        n = (l & ~(1 << 32 - zt(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Iu++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = G1++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Sf,
    useFormState: Ah,
    useActionState: Ah,
    useOptimistic: function(e) {
      var t = an();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = xf.bind(
        null,
        Me,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: ff,
    useCacheRefresh: function() {
      return an().memoizedState = Q1.bind(
        null,
        Me
      );
    },
    useEffectEvent: function(e) {
      var t = an(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((Ze & 2) !== 0)
          throw Error(u(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Ph = {
    readContext: It,
    use: Qu,
    useCallback: Lh,
    useContext: It,
    useEffect: gf,
    useImperativeHandle: Hh,
    useInsertionEffect: zh,
    useLayoutEffect: jh,
    useMemo: Bh,
    useReducer: Zu,
    useRef: Mh,
    useState: function() {
      return Zu(kl);
    },
    useDebugValue: pf,
    useDeferredValue: function(e, t) {
      var n = bt();
      return Vh(
        n,
        tt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Zu(kl)[0], t = bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Ri(e),
        t
      ];
    },
    useSyncExternalStore: hh,
    useId: kh,
    useHostTransitionStatus: Sf,
    useFormState: Oh,
    useActionState: Oh,
    useOptimistic: function(e, t) {
      var n = bt();
      return Sh(n, tt, e, t);
    },
    useMemoCache: ff,
    useCacheRefresh: Ih,
    useEffectEvent: Dh
  }, K1 = {
    readContext: It,
    use: Qu,
    useCallback: Lh,
    useContext: It,
    useEffect: gf,
    useImperativeHandle: Hh,
    useInsertionEffect: zh,
    useLayoutEffect: jh,
    useMemo: Bh,
    useReducer: mf,
    useRef: Mh,
    useState: function() {
      return mf(kl);
    },
    useDebugValue: pf,
    useDeferredValue: function(e, t) {
      var n = bt();
      return tt === null ? yf(n, e, t) : Vh(
        n,
        tt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = mf(kl)[0], t = bt().memoizedState;
      return [
        typeof e == "boolean" ? e : Ri(e),
        t
      ];
    },
    useSyncExternalStore: hh,
    useId: kh,
    useHostTransitionStatus: Sf,
    useFormState: Rh,
    useActionState: Rh,
    useOptimistic: function(e, t) {
      var n = bt();
      return tt !== null ? Sh(n, tt, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: ff,
    useCacheRefresh: Ih,
    useEffectEvent: Dh
  };
  function Ef(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : X({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Cf = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = On(), o = xa(l);
      o.payload = t, n != null && (o.callback = n), t = Ea(e, o, l), t !== null && (vn(t, e, l), wi(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = On(), o = xa(l);
      o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Ea(e, o, l), t !== null && (vn(t, e, l), wi(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = On(), l = xa(n);
      l.tag = 2, t != null && (l.callback = t), t = Ea(e, l, n), t !== null && (vn(t, e, n), wi(t, e, n));
    }
  };
  function Fh(e, t, n, l, o, i, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, i, d) : t.prototype && t.prototype.isPureReactComponent ? !gi(n, l) || !gi(o, i) : !0;
  }
  function Jh(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Cf.enqueueReplaceState(t, t.state, null);
  }
  function Co(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = X({}, n));
      for (var o in e)
        n[o] === void 0 && (n[o] = e[o]);
    }
    return n;
  }
  function $h(e) {
    Tu(e);
  }
  function Wh(e) {
    console.error(e);
  }
  function ev(e) {
    Tu(e);
  }
  function $u(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function tv(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  function wf(e, t, n) {
    return n = xa(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      $u(e, t);
    }, n;
  }
  function nv(e) {
    return e = xa(e), e.tag = 3, e;
  }
  function lv(e, t, n, l) {
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var i = l.value;
      e.payload = function() {
        return o(i);
      }, e.callback = function() {
        tv(t, n, l);
      };
    }
    var d = n.stateNode;
    d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
      tv(t, n, l), typeof o != "function" && (Ma === null ? Ma = /* @__PURE__ */ new Set([this]) : Ma.add(this));
      var g = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function P1(e, t, n, l, o) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && vo(
        t,
        n,
        o,
        !0
      ), n = Xt.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return $t === null ? bc() : n.alternate === null && gt === 0 && (gt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = o, l === Bu ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), ud(e, l, o)), !1;
          case 22:
            return n.flags |= 65536, l === Bu ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), ud(e, l, o)), !1;
        }
        throw Error(u(435, n.tag));
      }
      return ud(e, l, o), bc(), !1;
    }
    if (Ue)
      return t = Xt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = o, l !== ks && (e = Error(u(422), { cause: l }), bi(Ln(e, n)))) : (l !== ks && (t = Error(u(423), {
        cause: l
      }), bi(
        Ln(t, n)
      )), e = e.current.alternate, e.flags |= 65536, o &= -o, e.lanes |= o, l = Ln(l, n), o = wf(
        e.stateNode,
        l,
        o
      ), Ws(e, o), gt !== 4 && (gt = 2)), !1;
    var i = Error(u(520), { cause: l });
    if (i = Ln(i, n), Bi === null ? Bi = [i] : Bi.push(i), gt !== 4 && (gt = 2), t === null) return !0;
    l = Ln(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = o & -o, n.lanes |= e, e = wf(n.stateNode, l, e), Ws(n, e), !1;
        case 1:
          if (t = n.type, i = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (Ma === null || !Ma.has(i))))
            return n.flags |= 65536, o &= -o, n.lanes |= o, o = nv(o), lv(
              o,
              e,
              n,
              l
            ), Ws(n, o), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Tf = Error(u(461)), At = !1;
  function Mt(e, t, n, l) {
    t.child = e === null ? ih(t, null, n, l) : xo(
      t,
      e.child,
      n,
      l
    );
  }
  function av(e, t, n, l, o) {
    n = n.render;
    var i = t.ref;
    if ("ref" in l) {
      var d = {};
      for (var g in l)
        g !== "ref" && (d[g] = l[g]);
    } else d = l;
    return go(t), l = rf(
      e,
      t,
      n,
      d,
      i,
      o
    ), g = uf(), e !== null && !At ? (cf(e, t, o), Il(e, t, o)) : (Ue && g && Nu(t), t.flags |= 1, Mt(e, t, l, o), t.child);
  }
  function ov(e, t, n, l, o) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Vs(i) && i.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = i, rv(
        e,
        t,
        i,
        l,
        o
      )) : (e = Ru(
        n.type,
        null,
        l,
        t,
        t.mode,
        o
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !zf(e, o)) {
      var d = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : gi, n(d, l) && e.ref === t.ref)
        return Il(e, t, o);
    }
    return t.flags |= 1, e = Bl(i, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function rv(e, t, n, l, o) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (gi(i, l) && e.ref === t.ref)
        if (At = !1, t.pendingProps = l = i, zf(e, o))
          (e.flags & 131072) !== 0 && (At = !0);
        else
          return t.lanes = e.lanes, Il(e, t, o);
    }
    return Af(
      e,
      t,
      n,
      l,
      o
    );
  }
  function iv(e, t, n, l) {
    var o = l.children, i = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = i !== null ? i.baseLanes | n : n, e !== null) {
          for (l = t.child = e.child, o = 0; l !== null; )
            o = o | l.lanes | l.childLanes, l = l.sibling;
          l = o & ~i;
        } else l = 0, t.child = null;
        return uv(
          e,
          t,
          i,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Hu(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? sh(t, i) : tf(), fh(t);
      else
        return l = t.lanes = 536870912, uv(
          e,
          t,
          i !== null ? i.baseLanes | n : n,
          n,
          l
        );
    } else
      i !== null ? (Hu(t, i.cachePool), sh(t, i), Ta(), t.memoizedState = null) : (e !== null && Hu(t, null), tf(), Ta());
    return Mt(e, t, o, n), t.child;
  }
  function Ni(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function uv(e, t, n, l, o) {
    var i = Ps();
    return i = i === null ? null : { parent: wt._currentValue, pool: i }, t.memoizedState = {
      baseLanes: n,
      cachePool: i
    }, e !== null && Hu(t, null), tf(), fh(t), e !== null && vo(e, t, l, !0), t.childLanes = o, null;
  }
  function Wu(e, t) {
    return t = ec(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function cv(e, t, n) {
    return xo(t, e.child, null, n), e = Wu(t, t.pendingProps), e.flags |= 2, Cn(t), t.memoizedState = null, e;
  }
  function F1(e, t, n) {
    var l = t.pendingProps, o = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ue) {
        if (l.mode === "hidden")
          return e = Wu(t, l), t.lanes = 536870912, e.memoizedState = { baseLanes: 0, cachePool: null }, Ni(null, e);
        if (lf(t), (e = ot) ? (e = Ug(
          e,
          Gn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: va !== null ? { id: fl, overflow: dl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Q0(e), n.return = t, t.child = n, Ut = t, ot = null)) : e = null, e === null) throw pa(t);
        return t.lanes = 536870912, null;
      }
      return Wu(t, l);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var d = i.dehydrated;
      if (lf(t), o)
        if (t.flags & 256)
          t.flags &= -257, t = cv(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(u(558));
      else if (At || vo(e, t, n, !1), o = (n & e.childLanes) !== 0, At || o) {
        if (Ca.current === null) {
          if (l = lt, l !== null && (d = Wa(l, n), d !== 0 && d !== i.retryLane))
            throw i.retryLane = d, so(e, d), vn(l, e, d), Tf;
          bc();
        }
        t = cv(
          e,
          t,
          n
        );
      } else
        e = i.treeContext, ot = qn(d.nextSibling), Ut = t, Ue = !0, ga = null, Gn = !1, e !== null && P0(t, e), t = Wu(t, l), t.flags |= 134221824;
      return t;
    }
    return e = Bl(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function br(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(u(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Af(e, t, n, l, o) {
    return go(t), n = rf(
      e,
      t,
      n,
      l,
      void 0,
      o
    ), l = uf(), e !== null && !At ? (cf(e, t, o), Il(e, t, o)) : (Ue && l && Nu(t), t.flags |= 1, Mt(e, t, n, o), t.child);
  }
  function sv(e, t, n, l, o, i) {
    return go(t), t.updateQueue = null, n = mh(
      t,
      l,
      n,
      o
    ), dh(e), l = uf(), e !== null && !At ? (cf(e, t, i), Il(e, t, i)) : (Ue && l && Nu(t), t.flags |= 1, Mt(e, t, n, i), t.child);
  }
  function fv(e, t, n, l, o) {
    if (go(t), t.stateNode === null) {
      var i = cr, d = n.contextType;
      typeof d == "object" && d !== null && (i = It(d)), i = new n(l, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = Cf, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = l, i.state = t.memoizedState, i.refs = {}, Js(t), d = n.contextType, i.context = typeof d == "object" && d !== null ? It(d) : cr, i.state = t.memoizedState, d = n.getDerivedStateFromProps, typeof d == "function" && (Ef(
        t,
        n,
        d,
        l
      ), i.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (d = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), d !== i.state && Cf.enqueueReplaceState(i, i.state, null), Ai(t, l, i, o), Ti(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      i = t.stateNode;
      var g = t.memoizedProps, T = Co(n, g);
      i.props = T;
      var H = i.context, k = n.contextType;
      d = cr, typeof k == "object" && k !== null && (d = It(k));
      var P = n.getDerivedStateFromProps;
      k = typeof P == "function" || typeof i.getSnapshotBeforeUpdate == "function", g = t.pendingProps !== g, k || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (g || H !== d) && Jh(
        t,
        i,
        l,
        d
      ), Sa = !1;
      var z = t.memoizedState;
      i.state = z, Ai(t, l, i, o), Ti(), H = t.memoizedState, g || z !== H || Sa ? (typeof P == "function" && (Ef(
        t,
        n,
        P,
        l
      ), H = t.memoizedState), (T = Sa || Fh(
        t,
        n,
        T,
        l,
        z,
        H,
        d
      )) ? (k || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = H), i.props = l, i.state = H, i.context = d, l = T) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      i = t.stateNode, $s(e, t), d = t.memoizedProps, k = Co(n, d), i.props = k, P = t.pendingProps, z = i.context, H = n.contextType, T = cr, typeof H == "object" && H !== null && (T = It(H)), g = n.getDerivedStateFromProps, (H = typeof g == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (d !== P || z !== T) && Jh(
        t,
        i,
        l,
        T
      ), Sa = !1, z = t.memoizedState, i.state = z, Ai(t, l, i, o), Ti();
      var V = t.memoizedState;
      d !== P || z !== V || Sa || e !== null && e.dependencies !== null && ju(e.dependencies) ? (typeof g == "function" && (Ef(
        t,
        n,
        g,
        l
      ), V = t.memoizedState), (k = Sa || Fh(
        t,
        n,
        k,
        l,
        z,
        V,
        T
      ) || e !== null && e.dependencies !== null && ju(e.dependencies)) ? (H || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(l, V, T), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        l,
        V,
        T
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || d === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = V), i.props = l, i.state = V, i.context = T, l = k) : (typeof i.componentDidUpdate != "function" || d === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return i = l, br(e, t), l = (t.flags & 128) !== 0, i || l ? (i = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && l ? (t.child = xo(
      t,
      e.child,
      null,
      o
    ), t.child = xo(
      t,
      null,
      n,
      o
    )) : Mt(e, t, n, o), t.memoizedState = i.state, e = t.child) : e = Il(
      e,
      t,
      o
    ), e;
  }
  function dv(e, t, n, l) {
    return mo(), t.flags |= 256, Mt(e, t, n, l), t.child;
  }
  var Of = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function _f(e) {
    return { baseLanes: e, cachePool: th() };
  }
  function Rf(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= An), e;
  }
  function mv(e, t, n) {
    var l = t.pendingProps, o = !1, i = (t.flags & 128) !== 0, d;
    if ((d = i) || (d = e !== null && e.memoizedState === null ? !1 : (Qt.current & 2) !== 0), d && (o = !0, t.flags &= -129), d = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ue) {
        if (o ? wa(t) : Ta(), (e = ot) ? (e = Ug(
          e,
          Gn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: va !== null ? { id: fl, overflow: dl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Q0(e), n.return = t, t.child = n, Ut = t, ot = null)) : e = null, e === null) throw pa(t);
        return _d(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return i = l.children, l = l.fallback, o ? (Ta(), o = t.mode, i = ec(
        { mode: "hidden", children: i },
        o
      ), l = fo(
        l,
        o,
        n,
        null
      ), i.return = t, l.return = t, i.sibling = l, t.child = i, l = t.child, l.memoizedState = _f(n), l.childLanes = Rf(
        e,
        d,
        n
      ), t.memoizedState = Of, Ni(null, l)) : (wa(t), Mf(t, i));
    }
    var g = e.memoizedState;
    if (g !== null) {
      var T = g.dehydrated;
      if (T !== null)
        return J1(
          e,
          t,
          i,
          d,
          l,
          T,
          g,
          n
        );
    }
    return o ? (Ta(), o = l.fallback, i = t.mode, g = e.child, T = g.sibling, l = Bl(g, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = g.subtreeFlags & 1206910976, T !== null ? o = Bl(T, o) : (o = fo(
      o,
      i,
      n,
      null
    ), o.flags |= 2), o.return = t, l.return = t, l.sibling = o, t.child = l, Ni(null, l), l = t.child, o = e.child.memoizedState, o === null ? o = _f(n) : (i = o.cachePool, i !== null ? (g = wt._currentValue, i = i.parent !== g ? { parent: g, pool: g } : i) : i = th(), o = {
      baseLanes: o.baseLanes | n,
      cachePool: i
    }), l.memoizedState = o, l.childLanes = Rf(
      e,
      d,
      n
    ), t.memoizedState = Of, Ni(e.child, l)) : (wa(t), n = e.child, e = n.sibling, n = Bl(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (d = t.deletions, d === null ? (t.deletions = [e], t.flags |= 16) : d.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Mf(e, t) {
    return t = ec(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ec(e, t) {
    return e = fn(22, e, null, t), e.lanes = 0, e;
  }
  function tc(e, t, n) {
    return xo(t, e.child, null, n), e = Mf(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function J1(e, t, n, l, o, i, d, g) {
    if (n)
      return t.flags & 256 ? (wa(t), t.flags &= -257, tc(
        e,
        t,
        g
      )) : t.memoizedState !== null ? (Ta(), t.child = e.child, t.flags |= 128, null) : (Ta(), i = o.fallback, d = t.mode, o = ec(
        { mode: "visible", children: o.children },
        d
      ), i = fo(
        i,
        d,
        g,
        null
      ), i.flags |= 2, o.return = t, i.return = t, o.sibling = i, t.child = o, xo(t, e.child, null, g), o = t.child, o.memoizedState = _f(g), o.childLanes = Rf(
        e,
        l,
        g
      ), t.memoizedState = Of, Ni(null, o));
    if (wa(t), _d(i)) {
      if (l = i.nextSibling && i.nextSibling.dataset, l) var T = l.dgst;
      return l = T, l !== "" && (o = Error(u(419)), o.stack = "", o.digest = l, bi({ value: o, source: null, stack: null })), tc(
        e,
        t,
        g
      );
    }
    if (At || vo(e, t, g, !1), l = (g & e.childLanes) !== 0, At || l) {
      if (Ca.current !== null)
        return tc(
          e,
          t,
          g
        );
      if (l = lt, l !== null && (o = Wa(
        l,
        g
      ), o !== 0 && o !== d.retryLane))
        throw d.retryLane = o, so(e, o), vn(l, e, o), Tf;
      return Od(i) || bc(), tc(
        e,
        t,
        g
      );
    }
    return Od(i) ? (t.flags |= 192, t.child = e.child, null) : (e = d.treeContext, ot = qn(i.nextSibling), Ut = t, Ue = !0, ga = null, Gn = !1, e !== null && P0(t, e), t = Mf(
      t,
      o.children
    ), t.flags |= 134221824, t);
  }
  function hv(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), zu(e.return, t, n);
  }
  function vv(e) {
    for (var t = null; e !== null; ) {
      var n = e.alternate;
      n !== null && qu(n) === null && (t = e), e = e.sibling;
    }
    return t;
  }
  function nc(e, t, n, l, o, i) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: o,
      treeForkCount: i
    } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = l, d.tail = n, d.tailMode = o, d.treeForkCount = i);
  }
  function Nf(e) {
    var t = e.child;
    for (e.child = null; t !== null; ) {
      var n = t.sibling;
      t.sibling = e.child, e.child = t, t = n;
    }
  }
  function Df(e, t, n) {
    var l = t.pendingProps, o = l.revealOrder, i = l.tail;
    l = l.children;
    var d = Qt.current;
    if (t.flags & 128)
      return Oi(t, d), null;
    var g = (d & 2) !== 0;
    if (g ? (d = d & 1 | 2, t.flags |= 128) : d &= 1, Oi(t, d), o === "backwards" && e !== null ? (Nf(e), Mt(e, t, l, n), Nf(e)) : Mt(e, t, l, n), l = Ue ? yi : 0, !g && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && hv(e, n, t);
        else if (e.tag === 19)
          hv(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (o) {
      case "backwards":
        n = vv(t.child), n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null, Nf(t)), nc(
          t,
          !0,
          o,
          null,
          i,
          l
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (e = o.alternate, e !== null && qu(e) === null) {
            t.child = o;
            break;
          }
          e = o.sibling, o.sibling = n, n = o, o = e;
        }
        nc(
          t,
          !0,
          n,
          null,
          i,
          l
        );
        break;
      case "together":
        nc(
          t,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        n = vv(t.child), n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), nc(
          t,
          !1,
          o,
          n,
          i,
          l
        );
    }
    return t.child;
  }
  function gv(e, t, n) {
    var l = t.pendingProps;
    return ya(t, t.type, l.value), Mt(e, t, l.children, n), t.child;
  }
  function Il(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Ra |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (vo(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = Bl(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = Bl(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function zf(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ju(e)));
  }
  function $1(e, t, n) {
    switch (t.tag) {
      case 3:
        ta(t, t.stateNode.containerInfo), ya(t, wt, e.memoizedState.cache), mo();
        break;
      case 27:
      case 5:
        Wr(t);
        break;
      case 4:
        ta(t, t.stateNode.containerInfo);
        break;
      case 10:
        ya(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, lf(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null) {
          if (l.dehydrated !== null)
            return wa(t), t.flags |= 128, null;
          l = vo(
            e,
            t,
            n,
            !1
          );
          var o = t.child.childLanes;
          return l || (n & o) !== 0 ? mv(e, t, n) : (wa(t), e = Il(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        }
        wa(t);
        break;
      case 19:
        if (t.flags & 128)
          return Df(
            e,
            t,
            n
          );
        if (o = (e.flags & 128) !== 0, l = (n & t.childLanes) !== 0, l || (vo(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), o) {
          if (l)
            return Df(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Oi(t, Qt.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, iv(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        ya(t, wt, e.memoizedState.cache);
    }
    return Il(e, t, n);
  }
  function pv(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        At = !0;
      else {
        if (!zf(e, n) && (t.flags & 128) === 0)
          return At = !1, $1(
            e,
            t,
            n
          );
        At = (e.flags & 131072) !== 0;
      }
    else
      At = !1, Ue && (t.flags & 1048576) !== 0 && K0(t, yi, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = bo(t.elementType), t.type = e, typeof e == "function")
            Vs(e) ? (l = Co(e, l), t.tag = 1, t = fv(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = Af(
              null,
              t,
              e,
              l,
              n
            ));
          else {
            if (e != null) {
              var o = e.$$typeof;
              if (o === Q) {
                t.tag = 11, t = av(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (o === de) {
                t.tag = 14, t = ov(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (o === he) {
                t.tag = 10, t.type = e, t = gv(
                  null,
                  t,
                  n
                );
                break e;
              }
            }
            throw t = ue(e) || e, Error(u(306, t, ""));
          }
        }
        return t;
      case 0:
        return Af(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, o = Co(
          l,
          t.pendingProps
        ), fv(
          e,
          t,
          l,
          o,
          n
        );
      case 3:
        e: {
          if (ta(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(u(387));
          l = t.pendingProps;
          var i = t.memoizedState;
          o = i.element, $s(e, t), Ai(t, l, null, n);
          var d = t.memoizedState;
          if (l = d.cache, ya(t, wt, l), l !== i.cache && Qs(
            t,
            [wt],
            n,
            !0
          ), Ti(), l = d.element, i.isDehydrated)
            if (i = {
              element: l,
              isDehydrated: !1,
              cache: d.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = dv(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== o) {
              o = Ln(
                Error(u(424)),
                t
              ), bi(o), t = dv(
                e,
                t,
                l,
                n
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, ot = qn(e.firstChild), Ut = t, Ue = !0, ga = null, Gn = !0, n = ih(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
          else {
            if (mo(), l === o) {
              t = Il(
                e,
                t,
                n
              );
              break e;
            }
            Mt(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return br(e, t), e === null ? (n = qg(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ue || (t.stateNode = xg(
          t.type,
          t.pendingProps,
          ul.current,
          t
        )) : t.memoizedState = qg(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Wr(t), e === null && Ue && (l = t.stateNode = Bg(
          t.type,
          t.pendingProps,
          ul.current
        ), Ut = t, Gn = !0, o = ot, za(t.type) ? (Rd = o, ot = qn(l.firstChild)) : ot = o), Mt(
          e,
          t,
          t.pendingProps.children,
          n
        ), br(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ue && ((o = l = ot) && (l = QS(
          l,
          t.type,
          t.pendingProps,
          Gn
        ), l !== null ? (t.stateNode = l, Ut = t, ot = qn(l.firstChild), Gn = !1, o = !0) : o = !1), o || pa(t)), Wr(t), o = t.type, i = t.pendingProps, d = e !== null ? e.memoizedProps : null, l = i.children, Sd(o, i) ? l = null : d !== null && Sd(o, d) && (t.flags |= 32), t.memoizedState !== null && (o = rf(
          e,
          t,
          Y1,
          null,
          null,
          n
        ), Lr._currentValue = o), br(e, t), Mt(e, t, l, n), t.child;
      case 6:
        return e === null && Ue && ((e = n = ot) && (n = ZS(
          n,
          t.pendingProps,
          Gn
        ), n !== null ? (t.stateNode = n, Ut = t, ot = null, e = !0) : e = !1), e || pa(t)), null;
      case 13:
        return mv(e, t, n);
      case 4:
        return ta(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = xo(
          t,
          null,
          l,
          n
        ) : Mt(e, t, l, n), t.child;
      case 11:
        return av(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return l = t.pendingProps, br(e, t), Mt(e, t, l, n), t.child;
      case 8:
        return Mt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return Mt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return gv(e, t, n);
      case 9:
        return o = t.type._context, l = t.pendingProps.children, go(t), o = It(o), l = l(o), t.flags |= 1, Mt(e, t, l, n), t.child;
      case 14:
        return ov(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return rv(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Df(e, t, n);
      case 31:
        return F1(e, t, n);
      case 22:
        return iv(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return go(t), l = It(wt), e === null ? (o = Ps(), o === null && (o = lt, i = Zs(), o.pooledCache = i, i.refCount++, i !== null && (o.pooledCacheLanes |= n), o = i), t.memoizedState = { parent: l, cache: o }, Js(t), ya(t, wt, o)) : ((e.lanes & n) !== 0 && ($s(e, t), Ai(t, null, null, n), Ti()), o = e.memoizedState, i = t.memoizedState, o.parent !== l ? (o = { parent: l, cache: l }, t.memoizedState = o, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = o), ya(t, wt, l)) : (l = i.cache, ya(t, wt, l), l !== o.cache && Qs(
          t,
          [wt],
          n,
          !0
        ))), Mt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), l = t.pendingProps, l.name != null && l.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : Ue && Nu(t), e !== null && e.memoizedProps.name !== l.name ? t.flags |= 4194816 : br(e, t), Mt(e, t, l.children, n), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(u(156, t.tag));
  }
  function Xl(e) {
    e.flags |= 4;
  }
  function jf(e, t, n, l, o) {
    var i;
    if ((i = (e.mode & 32) !== 0) && (i = n === null ? Qg(t, l) : Qg(t, l) && (l.src !== n.src || l.srcSet !== n.srcSet)), i) {
      if (e.flags |= 16777216, (o & 335544128) === o)
        if (e.stateNode.complete) e.flags |= 8192;
        else if ($v()) e.flags |= 8192;
        else
          throw So = Bu, Fs;
    } else e.flags &= -16777217;
  }
  function yv(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Zg(t))
      if ($v()) e.flags |= 8192;
      else
        throw So = Bu, Fs;
  }
  function lc(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Pn() : 536870912, e.lanes |= t, wr |= t);
  }
  function Di(e, t) {
    if (!Ue)
      switch (e.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = e.tail, l = null; n !== null; )
            n.alternate !== null && (l = n), n = n.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
          break;
        default:
          for (t = e.tail, n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
      }
  }
  function rt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var o = e.child; o !== null; )
        n |= o.lanes | o.childLanes, l |= o.subtreeFlags & 1206910976, l |= o.flags & 1206910976, o.return = e, o = o.sibling;
    else
      for (o = e.child; o !== null; )
        n |= o.lanes | o.childLanes, l |= o.subtreeFlags, l |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function W1(e, t, n) {
    var l = t.pendingProps;
    switch (qs(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return rt(t), null;
      case 1:
        return rt(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Yl(wt), na(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (dr(t) ? Xl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Is())), rt(t), null;
      case 26:
        var o = t.type, i = t.memoizedState;
        return e === null ? (Xl(t), i !== null ? (rt(t), yv(t, i)) : (rt(t), jf(
          t,
          o,
          null,
          l,
          n
        ))) : i ? i !== e.memoizedState ? (Xl(t), rt(t), yv(t, i)) : (rt(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Xl(t), rt(t), jf(
          t,
          o,
          e,
          l,
          n
        )), null;
      case 27:
        if (qo(t), n = ul.current, o = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Xl(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return rt(t), t.subtreeFlags &= -33554433, null;
          }
          e = Dn.current, dr(t) ? F0(t) : (e = Bg(o, l, n), t.stateNode = e, Xl(t));
        }
        return rt(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (qo(t), o = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Xl(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return rt(t), t.subtreeFlags &= -33554433, null;
          }
          if (i = Dn.current, dr(t))
            F0(t);
          else {
            var d = ki(
              ul.current
            );
            switch (i) {
              case 1:
                i = d.createElementNS(
                  "http://www.w3.org/2000/svg",
                  o
                );
                break;
              case 2:
                i = d.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  o
                );
                break;
              default:
                switch (o) {
                  case "svg":
                    i = d.createElementNS(
                      "http://www.w3.org/2000/svg",
                      o
                    );
                    break;
                  case "math":
                    i = d.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      o
                    );
                    break;
                  case "script":
                    i = d.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(
                      i.firstChild
                    );
                    break;
                  case "select":
                    i = typeof l.is == "string" ? d.createElement("select", {
                      is: l.is
                    }) : d.createElement("select"), l.multiple ? i.multiple = !0 : l.size && (i.size = l.size);
                    break;
                  default:
                    i = typeof l.is == "string" ? d.createElement(o, { is: l.is }) : d.createElement(o);
                }
            }
            i[dt] = t, i[Yt] = l;
            e: for (d = t.child; d !== null; ) {
              if (d.tag === 5 || d.tag === 6)
                i.appendChild(d.stateNode);
              else if (d.tag !== 4 && d.tag !== 27 && d.child !== null) {
                d.child.return = d, d = d.child;
                continue;
              }
              if (d === t) break e;
              for (; d.sibling === null; ) {
                if (d.return === null || d.return === t)
                  break e;
                d = d.return;
              }
              d.sibling.return = d.return, d = d.sibling;
            }
            t.stateNode = i;
            e: switch (Kt(i, o, l), o) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && Xl(t);
          }
        }
        return rt(t), t.subtreeFlags &= -33554433, jf(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Xl(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(u(166));
          if (e = ul.current, dr(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, o = Ut, o !== null)
              switch (o.tag) {
                case 27:
                case 5:
                  l = o.memoizedProps;
              }
            e[dt] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || pg(e.nodeValue, n)), e || pa(t, !0);
          } else
            e = ki(e).createTextNode(
              l
            ), e[dt] = t, t.stateNode = e;
        }
        return rt(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = dr(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(u(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(557));
              e[dt] = t;
            } else
              mo(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            rt(t), e = !1;
          } else
            n = Is(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Cn(t), t) : (Cn(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(u(558));
        }
        return rt(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (o = dr(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[dt] = t;
            } else
              mo(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            rt(t), o = !1;
          } else
            o = Is(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = o), o = !0;
          if (!o)
            return t.flags & 256 ? (Cn(t), t) : (Cn(t), null);
        }
        return Cn(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, o = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (o = l.alternate.memoizedState.cachePool.pool), i = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (i = l.memoizedState.cachePool.pool), i !== o && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), lc(t, t.updateQueue), rt(t), null);
      case 4:
        return na(), e === null && vd(t.stateNode.containerInfo), t.flags |= 67108864, rt(t), null;
      case 10:
        return Yl(t.type), rt(t), null;
      case 19:
        if (af(t), l = t.memoizedState, l === null) return rt(t), null;
        if (o = (t.flags & 128) !== 0, i = l.rendering, i === null)
          if (o) Di(l, !1);
          else {
            if (gt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = qu(e), i !== null) {
                  for (t.flags |= 128, Di(l, !1), e = i.updateQueue, t.updateQueue = e, lc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    X0(n, e), n = n.sibling;
                  return Oi(
                    t,
                    Qt.current & 1 | 2
                  ), Ue && Vl(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && en() > vc && (t.flags |= 128, o = !0, Di(l, !1), t.lanes = 4194304);
          }
        else {
          if (!o)
            if (e = qu(i), e !== null) {
              if (t.flags |= 128, o = !0, e = e.updateQueue, t.updateQueue = e, lc(t, e), Di(l, !0), l.tail === null && l.tailMode !== "collapsed" && l.tailMode !== "visible" && !i.alternate && !Ue)
                return rt(t), null;
            } else
              2 * en() - l.renderingStartTime > vc && n !== 536870912 && (t.flags |= 128, o = !0, Di(l, !1), t.lanes = 4194304);
          l.isBackwards ? (i.sibling = t.child, t.child = i) : (e = l.last, e !== null ? e.sibling = i : t.child = i, l.last = i);
        }
        if (l.tail !== null) {
          e = l.tail;
          e: {
            for (n = e; n !== null; ) {
              if (n.alternate !== null) {
                n = !1;
                break e;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return l.rendering = e, l.tail = e.sibling, l.renderingStartTime = en(), e.sibling = null, i = Qt.current, i = o ? i & 1 | 2 : i & 1, l.tailMode === "visible" || l.tailMode === "collapsed" || !n || Ue ? Oi(t, i) : (n = i, Xe(Xt, t), Xe(Qt, n), $t === null && ($t = t)), Ue && Vl(t, l.treeForkCount), e;
        }
        return rt(t), null;
      case 22:
      case 23:
        return Cn(t), nf(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (rt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : rt(t), n = t.updateQueue, n !== null && lc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && st(yo), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Yl(wt), rt(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, rt(t), null;
    }
    throw Error(u(156, t.tag));
  }
  function eS(e, t) {
    switch (qs(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Yl(wt), na(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return qo(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Cn(t), t.alternate === null)
            throw Error(u(340));
          mo();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Cn(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(u(340));
          mo();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return af(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
      case 4:
        return na(), null;
      case 10:
        return Yl(t.type), null;
      case 22:
      case 23:
        return Cn(t), nf(), e !== null && st(yo), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Yl(wt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function bv(e, t) {
    switch (qs(t), t.tag) {
      case 3:
        Yl(wt), na();
        break;
      case 26:
      case 27:
      case 5:
        qo(t);
        break;
      case 4:
        na();
        break;
      case 31:
        t.memoizedState !== null && Cn(t);
        break;
      case 13:
        Cn(t);
        break;
      case 19:
        af(t);
        break;
      case 10:
        Yl(t.type);
        break;
      case 22:
      case 23:
        Cn(t), nf(), e !== null && st(yo);
        break;
      case 24:
        Yl(wt);
    }
  }
  function zi(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var o = l.next;
        n = o;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var i = n.create, d = n.inst;
            l = i(), d.destroy = l;
          }
          n = n.next;
        } while (n !== o);
      }
    } catch (g) {
      $e(t, t.return, g);
    }
  }
  function Aa(e, t, n) {
    try {
      var l = t.updateQueue, o = l !== null ? l.lastEffect : null;
      if (o !== null) {
        var i = o.next;
        l = i;
        do {
          if ((l.tag & e) === e) {
            var d = l.inst, g = d.destroy;
            if (g !== void 0) {
              d.destroy = void 0, o = t;
              var T = n, H = g;
              try {
                H();
              } catch (k) {
                $e(
                  o,
                  T,
                  k
                );
              }
            }
          }
          l = l.next;
        } while (l !== i);
      }
    } catch (k) {
      $e(t, t.return, k);
    }
  }
  function Sv(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        ch(t, n);
      } catch (l) {
        $e(e, e.return, l);
      }
    }
  }
  function xv(e, t, n) {
    n.props = Co(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      $e(e, t, l);
    }
  }
  function ml(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            var o = e.stateNode, i = Hl(e.memoizedProps, o);
            (o.ref === null || o.ref.name !== i) && (o.ref = _g(i)), l = o.ref;
            break;
          case 7:
            if (e.stateNode === null) {
              var d = new _n(e);
              v(
                e.child,
                !1,
                IS,
                d,
                void 0,
                void 0
              ), e.stateNode = d;
            }
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof n == "function" ? e.refCleanup = n(l) : n.current = l;
      }
    } catch (g) {
      $e(e, t, g);
    }
  }
  function Zt(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (o) {
          $e(e, t, o);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (o) {
          $e(e, t, o);
        }
      else n.current = null;
  }
  function ac(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var n = 0; n < t.length; n++)
        jg(
          e.stateNode,
          t[n]
        );
  }
  function Ev(e) {
    for (var t = e.return; t !== null && (Hf(t) && jg(e.stateNode, t.stateNode), !Uf(t)); )
      t = t.return;
  }
  function ji(e) {
    for (var t = e.return; t !== null && (Hf(t) && XS(e.stateNode, t.stateNode), !Uf(t)); )
      t = t.return;
  }
  function Uf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function Hf(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function Lf(e) {
    var t = e.type, n = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break e;
        case "img":
          n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (o) {
      $e(e, e.return, o);
    }
  }
  function Bf(e, t, n) {
    try {
      var l = e.stateNode;
      AS(l, e.type, n, t), l[Yt] = t;
    } catch (o) {
      $e(e, e.return, o);
    }
  }
  function Cv(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && za(e.type) || e.tag === 4;
  }
  function Vf(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Cv(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && za(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Gf(e, t, n, l) {
    var o = e.tag;
    if (o === 5 || o === 6)
      o = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(o, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(o), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = nn)), ac(e, l), Ee = !0;
    else if (o !== 4 && (o === 27 && (ac(e, l), l = null, za(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null))
      for (Gf(
        e,
        t,
        n,
        l
      ), e = e.sibling; e !== null; )
        Gf(
          e,
          t,
          n,
          l
        ), e = e.sibling;
  }
  function oc(e, t, n, l) {
    var o = e.tag;
    if (o === 5 || o === 6)
      o = e.stateNode, t ? n.insertBefore(o, t) : n.appendChild(o), ac(e, l), Ee = !0;
    else if (o !== 4 && (o === 27 && (ac(e, l), l = null, za(e.type) && (n = e.stateNode)), e = e.child, e !== null))
      for (oc(
        e,
        t,
        n,
        l
      ), e = e.sibling; e !== null; )
        oc(
          e,
          t,
          n,
          l
        ), e = e.sibling;
  }
  function wv(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, o = t.attributes; o.length; )
        t.removeAttributeNode(o[0]);
      Kt(t, l, n), t[dt] = e, t[Yt] = n;
    } catch (i) {
      $e(e, e.return, i);
    }
  }
  var rc = !1, wn = null;
  function Tv(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (rc = !0);
  }
  var hl = null;
  function Av() {
    var e = hl;
    return hl = null, e;
  }
  var dn = 0;
  function Sr(e, t, n, l, o) {
    return dn = 0, Ov(
      e.child,
      t,
      n,
      l,
      o
    );
  }
  function Ov(e, t, n, l, o) {
    for (var i = !1; e !== null; ) {
      if (e.tag === 5) {
        var d = e.stateNode;
        if (l !== null) {
          var g = Cd(d);
          l.push(g), g.view && (i = !0);
        } else
          i || Cd(d).view && (i = !0);
        rc = !0, Ag(
          d,
          dn === 0 ? t : t + "_" + dn,
          n
        ), dn++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && o || Ov(
        e.child,
        t,
        n,
        l,
        o
      ) && (i = !0));
      e = e.sibling;
    }
    return i;
  }
  function vl(e, t) {
    for (; e !== null; )
      e.tag === 5 ? Og(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || vl(
        e.child,
        t
      )), e = e.sibling;
  }
  function ic(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if ((e.tag !== 22 || e.memoizedState === null) && (ic(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(u(544));
          var n = t.name;
          t = Ll(t.default, t.share), t !== "none" && (Sr(
            e,
            n,
            t,
            null,
            !1
          ) || vl(e.child, !1));
        }
        e = e.sibling;
      }
  }
  function Yf(e, t) {
    if (e.tag === 30) {
      var n = e.stateNode, l = e.memoizedProps, o = Hl(l, n), i = Ll(
        l.default,
        n.paired ? l.share : l.enter
      );
      i !== "none" ? Sr(e, o, i, null, !1) ? (ic(e), n.paired || t || _r(e, l.onEnter)) : vl(e.child, !1) : ic(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Yf(e, t), e = e.sibling;
    else ic(e);
  }
  function qf(e) {
    if (wn !== null && wn.size !== 0) {
      var t = wn;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null; ) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var n = e.memoizedProps, l = n.name;
              if (l != null && l !== "auto") {
                var o = t.get(l);
                if (o !== void 0) {
                  var i = Ll(
                    n.default,
                    n.share
                  );
                  if (i !== "none" && (Sr(
                    e,
                    l,
                    i,
                    null,
                    !1
                  ) ? (i = e.stateNode, o.paired = i, i.paired = o, _r(e, n.onShare)) : vl(e.child, !1)), t.delete(l), t.size === 0) break;
                }
              }
            }
            qf(e);
          }
          e = e.sibling;
        }
    }
  }
  function kf(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps, n = Hl(t, e.stateNode), l = wn !== null ? wn.get(n) : void 0, o = Ll(
        t.default,
        l !== void 0 ? t.share : t.exit
      );
      o !== "none" && (Sr(e, n, o, null, !1) ? l !== void 0 ? (o = e.stateNode, l.paired = o, o.paired = l, wn.delete(n), _r(e, t.onShare)) : _r(e, t.onExit) : vl(e.child, !1)), wn !== null && qf(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        kf(e), e = e.sibling;
    else
      wn !== null && qf(e);
  }
  function _v(e) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var t = e.memoizedProps, n = Hl(t, e.stateNode);
        t = Ll(t.default, t.update), e.flags &= -5, t !== "none" && Sr(
          e,
          n,
          t,
          e.memoizedState = [],
          !1
        );
      } else
        (e.subtreeFlags & 33554432) !== 0 && _v(e);
      e = e.sibling;
    }
  }
  function If(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && (t.paired = null, vl(e.child, !1));
          }
          If(e);
        }
        e = e.sibling;
      }
  }
  function uc(e) {
    if (e.tag === 30)
      e.stateNode.paired = null, vl(e.child, !1), If(e);
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        uc(e), e = e.sibling;
    else If(e);
  }
  function Rv(e) {
    for (e = e.child; e !== null; )
      e.tag === 30 ? vl(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && Rv(e), e = e.sibling;
  }
  function Xf(e, t, n, l, o, i, d) {
    for (var g = !1; t !== null; ) {
      if (t.tag === 5) {
        var T = t.stateNode;
        if (i !== null && dn < i.length) {
          var H = i[dn], k = Cd(T);
          (H.view || k.view) && (g = !0);
          var P;
          if (P = (e.flags & 4) === 0)
            if (k.clip) P = !0;
            else {
              P = H.rect;
              var z = k.rect;
              P = P.y !== z.y || P.x !== z.x || P.height !== z.height || P.width !== z.width;
            }
          P && (e.flags |= 4), k.abs ? k = !H.abs : (H = H.rect, k = k.rect, k = H.height !== k.height || H.width !== k.width), k && (e.flags |= 32);
        } else e.flags |= 32;
        (e.flags & 4) !== 0 && Ag(
          T,
          dn === 0 ? n : n + "_" + dn,
          o
        ), g && (e.flags & 4) !== 0 || (hl === null && (hl = []), hl.push(
          T,
          dn === 0 ? l : l + "_" + dn,
          t.memoizedProps
        )), dn++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && d ? e.flags |= t.flags & 32 : Xf(
        e,
        t.child,
        n,
        l,
        o,
        i,
        d
      ) && (g = !0));
      t = t.sibling;
    }
    return g;
  }
  function Mv(e, t) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var n = e.memoizedProps, l = e.stateNode, o = Hl(n, l), i = Ll(n.default, n.update), d;
        d = e.memoizedState, e.memoizedState = null, l = e;
        var g = e.child;
        dn = 0, o = Xf(
          l,
          g,
          o,
          o,
          i,
          d,
          !1
        ), (e.flags & 4) !== 0 && o && _r(e, n.onUpdate);
      } else
        (e.subtreeFlags & 33554432) !== 0 && Mv(e);
      e = e.sibling;
    }
  }
  var Ht = !1, Pe = !1, gl = !1, Qf = !1, Nv = typeof WeakSet == "function" ? WeakSet : Set, Lt = null, pl = !1, Ui = !1, cc = !1, Zf = !1;
  function tS(e, t, n) {
    if (e = e.containerInfo, yd = Br, e = U0(e), Ds(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var o = l.getSelection && l.getSelection();
          if (o && o.rangeCount !== 0) {
            l = o.anchorNode;
            var i = o.anchorOffset, d = o.focusNode;
            o = o.focusOffset;
            try {
              l.nodeType, d.nodeType;
            } catch {
              l = null;
              break e;
            }
            var g = 0, T = -1, H = -1, k = 0, P = 0, z = e, V = null;
            t: for (; ; ) {
              for (var ce; z !== l || i !== 0 && z.nodeType !== 3 || (T = g + i), z !== d || o !== 0 && z.nodeType !== 3 || (H = g + o), z.nodeType === 3 && (g += z.nodeValue.length), (ce = z.firstChild) !== null; )
                V = z, z = ce;
              for (; ; ) {
                if (z === e) break t;
                if (V === l && ++k === i && (T = g), V === d && ++P === o && (H = g), (ce = z.nextSibling) !== null) break;
                z = V, V = z.parentNode;
              }
              z = ce;
            }
            l = T === -1 || H === -1 ? null : { start: T, end: H };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (bd = { focusedElem: e, selectionRange: l }, Br = !1, n = (n & 335544064) === n, Lt = t, t = n ? 9270 : 1024; Lt !== null; ) {
      if (e = Lt, n && (l = e.deletions, l !== null))
        for (i = 0; i < l.length; i++)
          n && kf(l[i]);
      if (e.alternate === null && (e.flags & 2) !== 0)
        n && Tv(e), sc(n);
      else {
        if (e.tag === 22) {
          if (l = e.alternate, e.memoizedState !== null) {
            l !== null && l.memoizedState === null && n && kf(l), sc(n);
            continue;
          } else if (l !== null && l.memoizedState !== null) {
            n && Tv(e), sc(n);
            continue;
          }
        }
        l = e.child, (e.subtreeFlags & t) !== 0 && l !== null ? (l.return = e, Lt = l) : (n && _v(e), sc(n));
      }
    }
    wn = null;
  }
  function sc(e) {
    for (; Lt !== null; ) {
      var t = Lt, n = e, l = t.alternate, o = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((o & 1024) !== 0 && l !== null) {
            n = void 0, o = l.memoizedProps, l = l.memoizedState;
            var i = t.stateNode;
            try {
              var d = Co(
                t.type,
                o
              );
              n = i.getSnapshotBeforeUpdate(
                d,
                l
              ), i.__reactInternalSnapshotBeforeUpdate = n;
            } catch (g) {
              $e(t, t.return, g);
            }
          }
          break;
        case 3:
          if ((o & 1024) !== 0) {
            if (l = t.stateNode.containerInfo, n = l.nodeType, n === 9)
              Ad(l);
            else if (n === 1)
              switch (l.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Ad(l);
                  break;
                default:
                  l.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n && l !== null && (n = Hl(
            l.memoizedProps,
            l.stateNode
          ), o = t.memoizedProps, o = Ll(o.default, o.update), o !== "none" && Sr(
            l,
            n,
            o,
            l.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((o & 1024) !== 0) throw Error(u(163));
      }
      if (l = t.sibling, l !== null) {
        l.return = t.return, Lt = l;
        break;
      }
      Lt = t.return;
    }
  }
  function Dv(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        yl(e, n), l & 4 && zi(5, n);
        break;
      case 1:
        if (yl(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (d) {
              $e(n, n.return, d);
            }
          else {
            var o = Co(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                o,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (d) {
              $e(
                n,
                n.return,
                d
              );
            }
          }
        l & 64 && Sv(n), l & 512 && ml(n, n.return);
        break;
      case 3:
        if (yl(e, n), l & 64 && (e = n.updateQueue, e !== null)) {
          if (t = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            ch(e, t);
          } catch (d) {
            $e(n, n.return, d);
          }
        }
        break;
      case 27:
        t === null && l & 4 && wv(n);
      case 26:
      case 5:
        yl(e, n), t === null && l & 4 && Lf(n), l & 512 && ml(n, n.return);
        break;
      case 12:
        yl(e, n);
        break;
      case 31:
        yl(e, n), l & 4 && Hv(e, n);
        break;
      case 13:
        yl(e, n), l & 4 && Lv(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = mS.bind(
          null,
          n
        ), KS(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || Ht, !l) {
          var i = t !== null && t.memoizedState !== null || Pe;
          t = Ht, o = Pe, Ht = l, (Pe = i) && !o ? (l = 2, (n.subtreeFlags & 8772) !== 0 && (l |= 1), tl(
            e,
            n,
            l
          )) : yl(e, n), Ht = t, Pe = o;
        }
        break;
      case 30:
        yl(e, n), l & 512 && ml(n, n.return);
        break;
      case 7:
        l & 512 && ml(n, n.return);
      default:
        yl(e, n);
    }
  }
  function Kf(e, t) {
    for (e = e.child; e !== null; )
      zv(e, t), e = e.sibling;
  }
  function zv(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var n = e.stateNode;
          if (t) {
            var l = n.style;
            typeof l.setProperty == "function" ? l.setProperty("display", "none", "important") : l.display = "none";
          } else {
            var o = e.stateNode, i = e.memoizedProps.style, d = i != null && i.hasOwnProperty("display") ? i.display : null;
            o.style.display = d == null || typeof d == "boolean" ? "" : ("" + d).trim();
          }
        } catch (T) {
          $e(e, e.return, T);
        }
        Pf(e, t);
        break;
      case 6:
        try {
          e.stateNode.nodeValue = t ? "" : e.memoizedProps, Ee = !0;
        } catch (T) {
          $e(e, e.return, T);
        }
        break;
      case 18:
        try {
          var g = e.stateNode;
          t ? Tg(g, !0) : Tg(e.stateNode, !1);
        } catch (T) {
          $e(e, e.return, T);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Kf(e, t);
        break;
      default:
        Kf(e, t);
    }
  }
  function Pf(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null; ) {
        e: {
          var n = e, l = t;
          switch (n.tag) {
            case 4:
              zv(n, l);
              break e;
            case 22:
              n.memoizedState === null && Pf(n, l);
              break e;
            default:
              Pf(n, l);
          }
        }
        e = e.sibling;
      }
  }
  function jv(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, jv(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && er(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var ft = null, mn = !1;
  function Wn(e, t, n) {
    for (n = n.child; n !== null; )
      Uv(e, t, n), n = n.sibling;
  }
  function Uv(e, t, n) {
    if (Ft && typeof Ft.onCommitFiberUnmount == "function")
      try {
        Ft.onCommitFiberUnmount(aa, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Pe || Zt(n, t), Wn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Pe && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Pe || Zt(n, t), ji(n);
        var l = ft, o = mn;
        za(n.type) && (ft = n.stateNode, mn = !1), Wn(
          e,
          t,
          n
        ), Vg(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), ft = l, mn = o;
        break;
      case 5:
        Pe || Zt(n, t), ji(n);
      case 6:
        if (n.tag === 6 && ji(n), l = ft, o = mn, ft = null, Wn(
          e,
          t,
          n
        ), ft = l, mn = o, ft !== null)
          if (mn)
            try {
              (ft.nodeType === 9 ? ft.body : ft.nodeName === "HTML" ? ft.ownerDocument.body : ft).removeChild(n.stateNode), Ee = !0;
            } catch (i) {
              $e(
                n,
                t,
                i
              );
            }
          else
            try {
              ft.removeChild(n.stateNode), Ee = !0;
            } catch (i) {
              $e(
                n,
                t,
                i
              );
            }
        break;
      case 18:
        ft !== null && (mn ? (e = ft, wg(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Vr(e)) : wg(ft, n.stateNode));
        break;
      case 4:
        l = ft, o = mn, ft = n.stateNode.containerInfo, mn = !0, Wn(
          e,
          t,
          n
        ), ft = l, mn = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Aa(2, n, t), Pe || Aa(4, n, t), Wn(
          e,
          t,
          n
        );
        break;
      case 1:
        Pe || (Zt(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && xv(
          n,
          t,
          l
        )), Wn(
          e,
          t,
          n
        );
        break;
      case 21:
        Wn(
          e,
          t,
          n
        );
        break;
      case 22:
        Pe = (l = Pe) || n.memoizedState !== null, Wn(
          e,
          t,
          n
        ), Pe = l;
        break;
      case 30:
        Zt(n, t), Wn(
          e,
          t,
          n
        );
        break;
      case 7:
        Pe || Zt(n, t), Wn(
          e,
          t,
          n
        );
        break;
      default:
        Wn(
          e,
          t,
          n
        );
    }
  }
  function Hv(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Vr(e);
      } catch (n) {
        $e(t, t.return, n);
      }
    }
  }
  function Lv(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Vr(e);
      } catch (n) {
        $e(t, t.return, n);
      }
  }
  function nS(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Nv()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Nv()), t;
      default:
        throw Error(u(435, e.tag));
    }
  }
  function fc(e, t) {
    var n = nS(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var o = hS.bind(null, e, l);
        l.then(o, o);
      }
    });
  }
  function on(e, t, n) {
    var l = t.deletions;
    if (l !== null)
      for (var o = 0; o < l.length; o++) {
        var i = l[o], d = e, g = t, T = g;
        e: for (; T !== null; ) {
          switch (T.tag) {
            case 27:
              if (za(T.type)) {
                ft = T.stateNode, mn = !1;
                break e;
              }
              break;
            case 5:
              ft = T.stateNode, mn = !1;
              break e;
            case 3:
            case 4:
              ft = T.stateNode.containerInfo, mn = !0;
              break e;
          }
          T = T.return;
        }
        if (ft === null) throw Error(u(160));
        Uv(d, g, i), ft = null, mn = !1, d = i.alternate, d !== null && (d.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Bv(t, e, n), t = t.sibling;
  }
  var el = null;
  function Bv(e, t, n) {
    var l = e.alternate, o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (o & 4 && (l = e.updateQueue, l = l !== null ? l.events : null, l !== null))
          for (var i = 0; i < l.length; i++) {
            var d = l[i];
            d.ref.impl = d.nextImpl;
          }
        on(t, e, n), rn(e), o & 4 && (Aa(3, e, e.return), zi(3, e), Aa(5, e, e.return));
        break;
      case 1:
        on(t, e, n), rn(e), o & 512 && (Pe || l === null || Zt(l, l.return)), o & 64 && Ht && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
        break;
      case 26:
        if (i = el, on(t, e, n), rn(e), o & 512 && (Pe || l === null || Zt(l, l.return)), o & 4)
          if (o = l !== null ? l.memoizedState : null, n = e.memoizedState, l === null)
            if (n === null)
              if (e.stateNode === null)
                if (Ht)
                  e.stateNode = xg(
                    e.type,
                    e.memoizedProps,
                    t.containerInfo,
                    e
                  );
                else {
                  e: {
                    t = e.type, n = e.memoizedProps, o = i.ownerDocument || i;
                    t: switch (t) {
                      case "title":
                        l = o.getElementsByTagName("title")[0], (!l || l[to] || l[dt] || l.namespaceURI === "http://www.w3.org/2000/svg" || l.hasAttribute("itemprop")) && (l = o.createElement(t), o.head.insertBefore(
                          l,
                          o.querySelector("head > title")
                        )), Kt(l, t, n), l[dt] = e, W(l), t = l;
                        break e;
                      case "link":
                        if (i = Xg(
                          "link",
                          "href",
                          o
                        ).get(t + (n.href || ""))) {
                          for (d = 0; d < i.length; d++)
                            if (l = i[d], l.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && l.getAttribute("rel") === (n.rel == null ? null : n.rel) && l.getAttribute("title") === (n.title == null ? null : n.title) && l.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              i.splice(d, 1);
                              break t;
                            }
                        }
                        l = o.createElement(t), Kt(l, t, n), o.head.appendChild(l);
                        break;
                      case "meta":
                        if (i = Xg(
                          "meta",
                          "content",
                          o
                        ).get(t + (n.content || ""))) {
                          for (d = 0; d < i.length; d++)
                            if (l = i[d], l.getAttribute("content") === (n.content == null ? null : "" + n.content) && l.getAttribute("name") === (n.name == null ? null : n.name) && l.getAttribute("property") === (n.property == null ? null : n.property) && l.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && l.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              i.splice(d, 1);
                              break t;
                            }
                        }
                        l = o.createElement(t), Kt(l, t, n), o.head.appendChild(l);
                        break;
                      default:
                        throw Error(u(468, t));
                    }
                    l[dt] = e, W(l), t = l;
                  }
                  e.stateNode = t;
                }
              else
                Ht || zd(i, e.type, e.stateNode);
            else
              e.stateNode = Ig(
                i,
                n,
                e.memoizedProps
              );
          else
            o !== n ? (o === null ? (t = l.stateNode, t === null || Pe || t.parentNode.removeChild(t)) : o.count--, n === null ? Ht || zd(i, e.type, e.stateNode) : Ig(i, n, e.memoizedProps)) : n === null && e.stateNode !== null && Bf(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        break;
      case 27:
        on(t, e, n), rn(e), o & 512 && (Pe || l === null || Zt(l, l.return)), l !== null && o & 4 && Bf(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (i = gl, gl = !1, on(t, e, n), gl = i, rn(e), o & 512 && (Pe || l === null || Zt(l, l.return)), e.flags & 32) {
          t = e.stateNode;
          try {
            tn(t, ""), Ee = !0;
          } catch (k) {
            $e(e, e.return, k);
          }
        }
        o & 4 && e.stateNode != null && (t = e.memoizedProps, Bf(
          e,
          t,
          l !== null ? l.memoizedProps : t
        )), o & 1024 && (Qf = !0);
        break;
      case 6:
        if (on(t, e, n), rn(e), o & 4) {
          if (e.stateNode === null)
            throw Error(u(162));
          t = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = t, Ee = !0;
          } catch (k) {
            $e(e, e.return, k);
          }
        }
        break;
      case 3:
        if (Ee = !1, Ac = null, i = el, el = Ii(t.containerInfo), on(t, e, n), el = i, rn(e), o & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Vr(t.containerInfo);
          } catch (k) {
            $e(e, e.return, k);
          }
        Qf && (Qf = !1, Vv(e)), Ee = !1;
        break;
      case 4:
        o = gl, gl = Ht, l = Rt(), i = el, el = Ii(
          e.stateNode.containerInfo
        ), on(t, e, n), rn(e), el = i, Ee && Ui && (cc = !0), Ee = l, gl = o;
        break;
      case 12:
        on(t, e, n), rn(e);
        break;
      case 31:
        on(t, e, n), rn(e), o & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, fc(e, t)));
        break;
      case 13:
        on(t, e, n), rn(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (hc = en()), o & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, fc(e, t)));
        break;
      case 22:
        i = e.memoizedState !== null, d = l !== null && l.memoizedState !== null;
        var g = Ht, T = Pe, H = gl;
        Ht = g || i, gl = H || i, Pe = T || d, on(t, e, n), Pe = T, gl = H, Ht = g, rn(e), o & 8192 && (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, !i || l === null || d || Ht || Pe || (t = d || Pe, n = Ht, l = Pe, Ht = i || Ht, Pe = t, Oa(e, 2), Ht = n, Pe = l), !i && gl || Kf(e, i)), o & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, fc(e, n))));
        break;
      case 19:
        on(t, e, n), rn(e), o & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, fc(e, t)));
        break;
      case 30:
        o & 512 && (Pe || l === null || Zt(l, l.return)), o = Rt(), i = Ui, d = (n & 335544064) === n, g = e.memoizedProps, Ui = d && Ll(
          g.default,
          g.update
        ) !== "none", on(t, e, n), rn(e), d && l !== null && Ee && (e.flags |= 4), Ui = i, Ee = o;
        break;
      case 21:
        break;
      case 7:
        o & 512 && (Pe || l === null || Zt(l, l.return)), l && l.stateNode !== null && (l.stateNode._fragmentFiber = e);
      default:
        on(t, e, n), rn(e);
    }
  }
  function rn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (Cv(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        l = null;
        for (var o = e.return; o !== null; ) {
          if (Hf(o)) {
            var i = o.stateNode;
            l === null ? l = [i] : l.push(i);
          }
          if (Uf(o)) break;
          o = o.return;
        }
        var d = l;
        if (n == null) throw Error(u(160));
        switch (n.tag) {
          case 27:
            var g = n.stateNode, T = Vf(e);
            oc(
              e,
              T,
              g,
              d
            );
            break;
          case 5:
            var H = n.stateNode;
            n.flags & 32 && (tn(H, ""), n.flags &= -33);
            var k = Vf(e);
            oc(
              e,
              k,
              H,
              d
            );
            break;
          case 3:
          case 4:
            var P = n.stateNode.containerInfo, z = Vf(e);
            Gf(
              e,
              z,
              P,
              d
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch (V) {
        $e(e, e.return, V);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Vv(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Vv(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, Br = !0, t.reset(), Br = !1), e = e.sibling;
      }
  }
  function xr(e, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Gv(t, e), t = t.sibling;
    else Mv(t);
  }
  function Gv(e, t) {
    var n = e.alternate;
    if (n === null) Yf(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (Zf = pl = !1, Av(), xr(t, e), !pl && !cc) {
            if (e = hl, e !== null)
              for (var l = 0; l < e.length; l += 3) {
                n = e[l];
                var o = e[l + 1];
                Og(n, e[l + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + o + ")"
                  }
                );
              }
            e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), e.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Zf = !0;
          }
          hl = null;
          break;
        case 5:
          xr(t, e);
          break;
        case 4:
          l = pl, pl = !1, xr(t, e), pl && (cc = !0), pl = l;
          break;
        case 22:
          e.memoizedState === null && (n.memoizedState !== null ? Yf(e, !1) : xr(t, e));
          break;
        case 30:
          l = pl, o = Av(), pl = !1, xr(t, e), pl && (e.flags |= 4);
          var i = e.memoizedProps, d = e.stateNode;
          t = Hl(i, d), d = Hl(n.memoizedProps, d);
          var g = Ll(i.default, i.update);
          g === "none" ? t = !1 : (i = n.memoizedState, n.memoizedState = null, n = e.child, dn = 0, t = Xf(
            e,
            n,
            t,
            d,
            g,
            i,
            !0
          ), dn !== (i === null ? 0 : i.length) && (e.flags |= 32)), (e.flags & 4) !== 0 && t ? (_r(
            e,
            e.memoizedProps.onUpdate
          ), hl = o) : o !== null && (o.push.apply(o, hl), hl = o), pl = (e.flags & 32) !== 0 ? !0 : l;
          break;
        default:
          xr(t, e);
      }
  }
  function yl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Dv(e, t.alternate, t), t = t.sibling;
  }
  function Oa(e, t) {
    for (e = e.child; e !== null; ) {
      var n = e, l = t;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Aa(4, n, n.return), Oa(
            n,
            l
          );
          break;
        case 1:
          Zt(n, n.return);
          var o = n.stateNode;
          typeof o.componentWillUnmount == "function" && xv(
            n,
            n.return,
            o
          ), Oa(
            n,
            l
          );
          break;
        case 27:
          (l & 2) !== 0 && Vg(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          Zt(n, n.return), n.tag !== 5 && n.tag !== 27 || ji(n), Oa(
            n,
            l
          );
          break;
        case 6:
          ji(n);
          break;
        case 26:
          Zt(n, n.return), o = n.stateNode, n.memoizedState !== null || o === null || Pe || o.parentNode.removeChild(o), Oa(
            n,
            l
          );
          break;
        case 22:
          n.memoizedState === null && Oa(
            n,
            l
          );
          break;
        case 30:
          Zt(n, n.return), Oa(
            n,
            l
          );
          break;
        case 7:
          Zt(n, n.return);
        default:
          Oa(
            n,
            l
          );
      }
      e = e.sibling;
    }
  }
  function tl(e, t, n) {
    for (n = (t.subtreeFlags & 8772) !== 0 ? n : n & -2, t = t.child; t !== null; ) {
      var l = t.alternate, o = e, i = t, d = i.flags, g = (n & 1) !== 0;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          tl(
            o,
            i,
            n
          ), zi(4, i);
          break;
        case 1:
          if (tl(
            o,
            i,
            n
          ), l = i, o = l.stateNode, typeof o.componentDidMount == "function")
            try {
              o.componentDidMount();
            } catch (k) {
              $e(l, l.return, k);
            }
          if (l = i, o = l.updateQueue, o !== null) {
            var T = l.stateNode;
            try {
              var H = o.shared.hiddenCallbacks;
              if (H !== null)
                for (o.shared.hiddenCallbacks = null, o = 0; o < H.length; o++)
                  uh(H[o], T);
            } catch (k) {
              $e(l, l.return, k);
            }
          }
          g && d & 64 && Sv(i), ml(i, i.return);
          break;
        case 27:
          (n & 2) !== 0 && wv(i);
        case 5:
          i.tag !== 5 && i.tag !== 27 || Ev(i), tl(
            o,
            i,
            n
          ), g && l === null && d & 4 && Lf(i), ml(i, i.return);
          break;
        case 6:
          Ev(i);
          break;
        case 26:
          T = i.stateNode, i.memoizedState !== null || T === null || Ht || zd(
            Ii(T.ownerDocument),
            i.type,
            T
          ), tl(
            o,
            i,
            n
          ), g && l === null && d & 4 && Lf(i), ml(i, i.return);
          break;
        case 12:
          tl(
            o,
            i,
            n
          );
          break;
        case 31:
          tl(
            o,
            i,
            n
          ), g && d & 4 && Hv(o, i);
          break;
        case 13:
          tl(
            o,
            i,
            n
          ), g && d & 4 && Lv(o, i);
          break;
        case 22:
          i.memoizedState === null && tl(
            o,
            i,
            n
          ), ml(i, i.return);
          break;
        case 30:
          tl(
            o,
            i,
            n
          ), ml(i, i.return);
          break;
        case 7:
          ml(i, i.return);
        default:
          tl(
            o,
            i,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Ff(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Si(n));
  }
  function Jf(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Si(e));
  }
  function Yn(e, t, n, l) {
    var o = (n & 335544064) === n;
    if (t.subtreeFlags & (o ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Yv(
          e,
          t,
          n,
          l
        ), t = t.sibling;
    else o && Rv(t);
  }
  function Yv(e, t, n, l) {
    var o = (n & 335544064) === n;
    o && t.alternate === null && t.return !== null && t.return.alternate !== null && uc(t);
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Yn(
          e,
          t,
          n,
          l
        ), i & 2048 && zi(9, t);
        break;
      case 1:
        Yn(
          e,
          t,
          n,
          l
        );
        break;
      case 3:
        Yn(
          e,
          t,
          n,
          l
        ), o && Zf && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), i & 2048 && (i = null, t.alternate !== null && (i = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== i && (t.refCount++, i != null && Si(i)));
        break;
      case 12:
        if (i & 2048) {
          Yn(
            e,
            t,
            n,
            l
          ), i = t.stateNode;
          try {
            var d = t.memoizedProps, g = d.id, T = d.onPostCommit;
            typeof T == "function" && T(
              g,
              t.alternate === null ? "mount" : "update",
              i.passiveEffectDuration,
              -0
            );
          } catch (H) {
            $e(t, t.return, H);
          }
        } else
          Yn(
            e,
            t,
            n,
            l
          );
        break;
      case 31:
        Yn(
          e,
          t,
          n,
          l
        );
        break;
      case 13:
        Yn(
          e,
          t,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        d = t.stateNode, g = t.alternate, t.memoizedState !== null ? (o && g !== null && g.memoizedState === null && uc(g), d._visibility & 2 ? Yn(
          e,
          t,
          n,
          l
        ) : Hi(
          e,
          t
        )) : (o && g !== null && g.memoizedState !== null && uc(t), d._visibility & 2 ? Yn(
          e,
          t,
          n,
          l
        ) : (d._visibility |= 2, Er(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), i & 2048 && Ff(g, t);
        break;
      case 24:
        Yn(
          e,
          t,
          n,
          l
        ), i & 2048 && Jf(t.alternate, t);
        break;
      case 30:
        o && (i = t.alternate, i !== null && (vl(i.child, !0), vl(t.child, !0))), Yn(
          e,
          t,
          n,
          l
        );
        break;
      default:
        Yn(
          e,
          t,
          n,
          l
        );
    }
  }
  function Er(e, t, n, l, o) {
    for (o = o && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var i = e, d = t, g = n, T = l, H = d.flags;
      switch (d.tag) {
        case 0:
        case 11:
        case 15:
          Er(
            i,
            d,
            g,
            T,
            o
          ), zi(8, d);
          break;
        case 23:
          break;
        case 22:
          var k = d.stateNode;
          d.memoizedState !== null ? k._visibility & 2 ? Er(
            i,
            d,
            g,
            T,
            o
          ) : Hi(
            i,
            d
          ) : (k._visibility |= 2, Er(
            i,
            d,
            g,
            T,
            o
          )), o && H & 2048 && Ff(
            d.alternate,
            d
          );
          break;
        case 24:
          Er(
            i,
            d,
            g,
            T,
            o
          ), o && H & 2048 && Jf(d.alternate, d);
          break;
        default:
          Er(
            i,
            d,
            g,
            T,
            o
          );
      }
      t = t.sibling;
    }
  }
  function Hi(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, o = l.flags;
        switch (l.tag) {
          case 22:
            Hi(n, l), o & 2048 && Ff(
              l.alternate,
              l
            );
            break;
          case 24:
            Hi(n, l), o & 2048 && Jf(l.alternate, l);
            break;
          default:
            Hi(n, l);
        }
        t = t.sibling;
      }
  }
  var wo = 8192;
  function To(e, t, n) {
    if (e.subtreeFlags & wo)
      for (e = e.child; e !== null; )
        qv(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function qv(e, t, n) {
    switch (e.tag) {
      case 26:
        To(
          e,
          t,
          n
        ), e.flags & wo && (e.memoizedState !== null ? ux(
          n,
          el,
          e.memoizedState,
          e.memoizedProps
        ) : (e = e.stateNode, (t & 335544128) === t && Pg(n, e)));
        break;
      case 5:
        To(
          e,
          t,
          n
        ), e.flags & wo && (e = e.stateNode, (t & 335544128) === t && Pg(n, e));
        break;
      case 3:
      case 4:
        var l = el;
        el = Ii(e.stateNode.containerInfo), To(
          e,
          t,
          n
        ), el = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = wo, wo = 16777216, To(
          e,
          t,
          n
        ), wo = l) : To(
          e,
          t,
          n
        ));
        break;
      case 30:
        if ((e.flags & wo) !== 0 && (l = e.memoizedProps.name, l != null && l !== "auto")) {
          var o = e.stateNode;
          o.paired = null, wn === null && (wn = /* @__PURE__ */ new Map()), wn.set(l, o);
        }
        To(
          e,
          t,
          n
        );
        break;
      default:
        To(
          e,
          t,
          n
        );
    }
  }
  function kv(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Li(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          Lt = l, Xv(
            l,
            e
          );
        }
      kv(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Iv(e), e = e.sibling;
  }
  function Iv(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Li(e), e.flags & 2048 && Aa(9, e, e.return);
        break;
      case 3:
        Li(e);
        break;
      case 12:
        Li(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, dc(e)) : Li(e);
        break;
      default:
        Li(e);
    }
  }
  function dc(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          Lt = l, Xv(
            l,
            e
          );
        }
      kv(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Aa(8, t, t.return), dc(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, dc(t));
          break;
        default:
          dc(t);
      }
      e = e.sibling;
    }
  }
  function Xv(e, t) {
    for (; Lt !== null; ) {
      var n = Lt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Aa(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Si(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, Lt = l;
      else
        e: for (n = e; Lt !== null; ) {
          l = Lt;
          var o = l.sibling, i = l.return;
          if (jv(l), l === n) {
            Lt = null;
            break e;
          }
          if (o !== null) {
            o.return = i, Lt = o;
            break e;
          }
          Lt = i;
        }
    }
  }
  var lS = {
    getCacheForType: function(e) {
      var t = It(wt), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return It(wt).controller.signal;
    }
  }, aS = typeof WeakMap == "function" ? WeakMap : Map, Ze = 0, lt = null, Le = null, Ve = 0, Je = 0, Tn = null, _a = !1, Cr = !1, $f = !1, Ql = 0, gt = 0, Ra = 0, Ao = 0, mc = 0, An = 0, wr = 0, Bi = null, hn = null, Wf = !1, hc = 0, Qv = 0, vc = 1 / 0, gc = null, Ma = null, ht = 0, nl = null, Oo = null, bl = 0, ed = 0, td = null, Zv = null, Tr = null, Ar = null, Or = null, Vi = 0, pc = null;
  function On() {
    return (Ze & 2) !== 0 && Ve !== 0 ? Ve & -Ve : le.T !== null ? fd() : jn();
  }
  function Kv() {
    if (An === 0)
      if ((Ve & 536870912) === 0 || Ue) {
        var e = sl;
        sl <<= 1, (sl & 3932160) === 0 && (sl = 262144), An = e;
      } else An = 536870912;
    return e = Xt.current, e !== null && (e.flags |= 32), An;
  }
  function _r(e, t) {
    if (t != null) {
      var n = e.stateNode, l = n.ref;
      l === null && (l = n.ref = _g(
        Hl(e.memoizedProps, n)
      )), Ar === null && (Ar = []), Ar.push(t.bind(null, l));
    }
  }
  function vn(e, t, n) {
    (e === lt && (Je === 2 || Je === 9) || e.cancelPendingCommit !== null) && (Rr(e, 0), Na(
      e,
      Ve,
      An,
      !1
    )), zl(e, n), ((Ze & 2) === 0 || e !== lt) && (e === lt && ((Ze & 2) === 0 && (Ao |= n), gt === 4 && Na(
      e,
      Ve,
      An,
      !1
    )), Sl(e));
  }
  function Pv(e, t, n) {
    if ((Ze & 6) !== 0) throw Error(u(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Kn(e, t), o = l ? iS(e, t) : ld(e, t, !0), i = l;
    do {
      if (o === 0) {
        Cr && !l && Na(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, i && !oS(n)) {
          o = ld(e, t, !1), i = !1;
          continue;
        }
        if (o === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var d = 0;
          else
            d = e.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
          if (d !== 0) {
            t = d;
            e: {
              var g = e;
              o = Bi;
              var T = g.current.memoizedState.isDehydrated;
              if (T && (Rr(g, d).flags |= 256), d = ld(
                g,
                d,
                !1
              ), d !== 2 && d !== 6) {
                if ($f && !T) {
                  g.errorRecoveryDisabledLanes |= i, Ao |= i, o = 4;
                  break e;
                }
                i = hn, hn = o, i !== null && (hn === null ? hn = i : hn.push.apply(
                  hn,
                  i
                ));
              }
              o = d;
            }
            if (i = !1, o !== 2) continue;
          }
        }
        if (o === 1) {
          Rr(e, 0), Na(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, i = o, i) {
            case 0:
            case 1:
              throw Error(u(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              Na(
                l,
                t,
                An,
                !_a
              );
              break e;
            case 2:
              hn = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((t & 62914560) === t && (o = hc + 300 - en(), 10 < o)) {
            if (Na(
              l,
              t,
              An,
              !_a
            ), Zn(l, 0, !0) !== 0) break e;
            bl = t, l.timeoutHandle = Ed(
              Fv.bind(
                null,
                l,
                n,
                hn,
                gc,
                Wf,
                t,
                An,
                Ao,
                wr,
                _a,
                i,
                "Throttled",
                -0,
                0
              ),
              o
            );
            break e;
          }
          Fv(
            l,
            n,
            hn,
            gc,
            Wf,
            t,
            An,
            Ao,
            wr,
            _a,
            i,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Sl(e);
  }
  function Fv(e, t, n, l, o, i, d, g, T, H, k, P, z, V) {
    e.timeoutHandle = -1;
    var ce = t.subtreeFlags, ye = (i & 335544064) === i;
    if (P = null, (ye || ce & 8192 || (ce & 16785408) === 16785408) && (P = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: nn
    }, wn = null, qv(
      t,
      i,
      P
    ), ye && (ce = P, ye = e.containerInfo, ye = (ye.nodeType === 9 ? ye : ye.ownerDocument).__reactViewTransition, ye != null && (ce.count++, ce.waitingForViewTransition = !0, ce = Zi.bind(ce), ye.finished.then(ce, ce))), ce = (i & 62914560) === i ? hc - en() : (i & 4194048) === i ? Qv - en() : 0, ce = cx(
      P,
      ce
    ), ce !== null)) {
      bl = i, e.cancelPendingCommit = ce(
        ag.bind(
          null,
          e,
          t,
          i,
          n,
          l,
          o,
          d,
          g,
          T,
          H,
          k,
          P,
          null,
          z,
          V
        )
      ), Na(e, i, d, !H);
      return;
    }
    ag(
      e,
      t,
      i,
      n,
      l,
      o,
      d,
      g,
      T,
      H,
      k,
      P
    );
  }
  function oS(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var o = n[l], i = o.getSnapshot;
          o = o.value;
          try {
            if (!En(i(), o)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null)
        n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Na(e, t, n, l) {
    t = ua(e, t), t &= ~mc, t &= ~Ao, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var o = t; 0 < o; ) {
      var i = 31 - zt(o), d = 1 << i;
      l[i] = -1, o &= ~d;
    }
    n !== 0 && Fn(e, n, t);
  }
  function yc() {
    return (Ze & 6) === 0 ? (Gi(0), !1) : !0;
  }
  function nd() {
    if (Le !== null) {
      if (Je === 0)
        var e = Le.return;
      else
        e = Le, Gl = ho = null, sf(e), vr = null, Ci = 0, e = Le;
      for (; e !== null; )
        bv(e.alternate, e), e = e.return;
      Le = null;
    }
  }
  function Rr(e, t) {
    var n = e.timeoutHandle;
    return n !== -1 && (e.timeoutHandle = -1, RS(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), bl = 0, nd(), lt = e, Le = n = Bl(e.current, null), Ve = t, Je = 0, Tn = null, _a = !1, Cr = Kn(e, t), $f = !1, wr = An = mc = Ao = Ra = gt = 0, hn = Bi = null, Wf = !1, Ql = ua(e, t), Au(), n;
  }
  function Jv(e, t) {
    Me = null, le.H = Ju, t === hr || t === Lu ? (t = ah(), Je = 3) : t === Fs ? (t = ah(), Je = 4) : Je = t === Tf ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Tn = t, Le === null && (gt = 1, $u(
      e,
      Ln(t, e.current)
    ));
  }
  function $v() {
    var e = Xt.current;
    return e === null ? !0 : (Ve & 4194048) === Ve ? $t === null : (Ve & 62914560) === Ve || (Ve & 536870912) !== 0 ? e === $t : !1;
  }
  function Wv() {
    var e = le.H;
    return le.H = Ju, e === null ? Ju : e;
  }
  function eg() {
    var e = le.A;
    return le.A = lS, e;
  }
  function bc() {
    gt = 4, _a || (Ve & 4194048) !== Ve && Xt.current !== null || (Cr = !0), (Ra & 134217727) === 0 && (Ao & 134217727) === 0 || lt === null || Na(
      lt,
      Ve,
      An,
      !1
    );
  }
  function ld(e, t, n) {
    var l = Ze;
    Ze |= 2;
    var o = Wv(), i = eg();
    (lt !== e || Ve !== t) && (gc = null, Rr(e, t)), t = !1;
    var d = gt;
    e: do
      try {
        if (Je !== 0 && Le !== null) {
          var g = Le, T = Tn;
          switch (Je) {
            case 8:
              nd(), d = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Xt.current === null && (t = !0);
              var H = Je;
              if (Je = 0, Tn = null, Mr(e, g, T, H), n && Cr) {
                d = 0;
                break e;
              }
              break;
            default:
              H = Je, Je = 0, Tn = null, Mr(e, g, T, H);
          }
        }
        rS(), d = gt;
        break;
      } catch (k) {
        Jv(e, k);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Gl = ho = null, Ze = l, le.H = o, le.A = i, Le === null && (lt = null, Ve = 0, Au()), d;
  }
  function rS() {
    for (; Le !== null; ) tg(Le);
  }
  function iS(e, t) {
    var n = Ze;
    Ze |= 2;
    var l = Wv(), o = eg();
    lt !== e || Ve !== t ? (gc = null, vc = en() + 500, Rr(e, t)) : Cr = Kn(
      e,
      t
    );
    e: do
      try {
        if (Je !== 0 && Le !== null) {
          t = Le;
          var i = Tn;
          t: switch (Je) {
            case 1:
              Je = 0, Tn = null, Mr(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (nh(i)) {
                Je = 0, Tn = null, ng(t);
                break;
              }
              t = function() {
                Je !== 2 && Je !== 9 || lt !== e || (Je = 7), Sl(e);
              }, i.then(t, t);
              break e;
            case 3:
              Je = 7;
              break e;
            case 4:
              Je = 5;
              break e;
            case 7:
              nh(i) ? (Je = 0, Tn = null, ng(t)) : (Je = 0, Tn = null, Mr(e, t, i, 7));
              break;
            case 5:
              var d = null;
              switch (Le.tag) {
                case 26:
                  d = Le.memoizedState;
                case 5:
                case 27:
                  var g = Le;
                  if (d ? Zg(d) : g.stateNode.complete) {
                    Je = 0, Tn = null;
                    var T = g.sibling;
                    if (T !== null) Le = T;
                    else {
                      var H = g.return;
                      H !== null ? (Le = H, Sc(H)) : Le = null;
                    }
                    break t;
                  }
              }
              Je = 0, Tn = null, Mr(e, t, i, 5);
              break;
            case 6:
              Je = 0, Tn = null, Mr(e, t, i, 6);
              break;
            case 8:
              nd(), gt = 6;
              break e;
            default:
              throw Error(u(462));
          }
        }
        uS();
        break;
      } catch (k) {
        Jv(e, k);
      }
    while (!0);
    return Gl = ho = null, le.H = l, le.A = o, Ze = n, Le !== null ? 0 : (lt = null, Ve = 0, Au(), gt);
  }
  function uS() {
    for (; Le !== null && !Qo(); )
      tg(Le);
  }
  function tg(e) {
    var t = pv(e.alternate, e, Ql);
    e.memoizedProps = e.pendingProps, t === null ? Sc(e) : Le = t;
  }
  function ng(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = sv(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Ve
        );
        break;
      case 11:
        t = sv(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Ve
        );
        break;
      case 5:
        sf(t);
        var l = t;
        l === Ut && (Ue ? (Du(l), l.tag === 5 && l.stateNode != null && (ot = l.stateNode)) : (Du(l), Ue = !0));
      default:
        bv(n, t), t = Le = X0(t, Ql), t = pv(n, t, Ql);
    }
    e.memoizedProps = e.pendingProps, t === null ? Sc(e) : Le = t;
  }
  function Mr(e, t, n, l) {
    Gl = ho = null, sf(t), vr = null, Ci = 0;
    var o = t.return;
    try {
      if (P1(
        e,
        o,
        t,
        n,
        Ve
      )) {
        gt = 1, $u(
          e,
          Ln(n, e.current)
        ), Le = null;
        return;
      }
    } catch (i) {
      if (o !== null) throw Le = o, i;
      gt = 1, $u(
        e,
        Ln(n, e.current)
      ), Le = null;
      return;
    }
    t.flags & 32768 ? (Ue || l === 1 ? e = !0 : Cr || (Ve & 536870912) !== 0 ? e = !1 : (_a = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Xt.current, l !== null && l.tag === 13 && (l.flags |= 16384))), lg(t, e)) : Sc(t);
  }
  function Sc(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        lg(
          t,
          _a
        );
        return;
      }
      e = t.return;
      var n = W1(
        t.alternate,
        t,
        Ql
      );
      if (n !== null) {
        Le = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        Le = t;
        return;
      }
      Le = t = e;
    } while (t !== null);
    gt === 0 && (gt = 5);
  }
  function lg(e, t) {
    do {
      var n = eS(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, Le = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        Le = e;
        return;
      }
      Le = e = n;
    } while (e !== null);
    gt = 6, Le = null;
  }
  function ag(e, t, n, l, o, i, d, g, T, H, k, P) {
    e.cancelPendingCommit = null;
    do
      xc();
    while (ht !== 0);
    if ((Ze & 6) !== 0) throw Error(u(327));
    if (t !== null) {
      if (t === e.current) throw Error(u(177));
      e === lt && (Le = lt = null, Ve = 0), Oo = t, nl = e, bl = n, td = o, Zv = l, cS(
        e,
        t,
        n,
        d,
        g,
        T,
        P
      );
    }
  }
  function cS(e, t, n, l, o, i, d) {
    var g = t.lanes | t.childLanes;
    if (ed = g, g |= Ls, Po(
      e,
      n,
      g,
      l,
      o,
      i
    ), Ar = null, (n & 335544064) === n ? (Or = L1(e), l = 10262) : (Or = null, l = 10256), (t.subtreeFlags & l) !== 0 || (t.flags & l) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, vS(cn, function() {
      return id(), null;
    })) : (e.callbackNode = null, e.callbackPriority = 0), rc = !1, l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
      l = le.T, le.T = null, o = re.p, re.p = 2, i = Ze, Ze |= 4;
      try {
        tS(e, t, n);
      } finally {
        Ze = i, re.p = o, le.T = l;
      }
    }
    ht = 1, rc ? Tr = US(
      d,
      e.containerInfo,
      Or,
      ad,
      od,
      fS,
      rd,
      id,
      sS
    ) : (ad(), od(), rd());
  }
  function sS(e) {
    if (ht !== 0) {
      var t = nl.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function fS() {
    ht === 3 && (ht = 0, Gv(Oo, nl), ht = 4);
  }
  function ad() {
    if (ht === 1) {
      ht = 0;
      var e = nl, t = Oo, n = bl, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = le.T, le.T = null;
        var o = re.p;
        re.p = 2;
        var i = Ze;
        Ze |= 4;
        try {
          Ui = cc = !1, Bv(t, e, n), n = bd;
          var d = U0(e.containerInfo), g = n.focusedElem, T = n.selectionRange;
          if (d !== g && g && g.ownerDocument && j0(
            g.ownerDocument.documentElement,
            g
          )) {
            if (T !== null && Ds(g)) {
              var H = T.start, k = T.end;
              if (k === void 0 && (k = H), "selectionStart" in g)
                g.selectionStart = H, g.selectionEnd = Math.min(
                  k,
                  g.value.length
                );
              else {
                var P = g.ownerDocument || document, z = P && P.defaultView || window;
                if (z.getSelection) {
                  var V = z.getSelection(), ce = g.textContent.length, ye = Math.min(T.start, ce), Ne = T.end === void 0 ? ye : Math.min(T.end, ce);
                  !V.extend && ye > Ne && (d = Ne, Ne = ye, ye = d);
                  var U = z0(
                    g,
                    ye
                  ), N = z0(
                    g,
                    Ne
                  );
                  if (U && N && (V.rangeCount !== 1 || V.anchorNode !== U.node || V.anchorOffset !== U.offset || V.focusNode !== N.node || V.focusOffset !== N.offset)) {
                    var B = P.createRange();
                    B.setStart(U.node, U.offset), V.removeAllRanges(), ye > Ne ? (V.addRange(B), V.extend(N.node, N.offset)) : (B.setEnd(N.node, N.offset), V.addRange(B));
                  }
                }
              }
            }
            for (P = [], V = g; V = V.parentNode; )
              V.nodeType === 1 && P.push({
                element: V,
                left: V.scrollLeft,
                top: V.scrollTop
              });
            for (typeof g.focus == "function" && g.focus(), g = 0; g < P.length; g++) {
              var K = P[g];
              K.element.scrollLeft = K.left, K.element.scrollTop = K.top;
            }
          }
          Br = !!yd, bd = yd = null;
        } finally {
          Ze = i, re.p = o, le.T = l;
        }
      }
      e.current = t, ht = 2;
    }
  }
  function od() {
    if (ht === 2) {
      ht = 0;
      var e = nl, t = Oo, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = le.T, le.T = null;
        var l = re.p;
        re.p = 2;
        var o = Ze;
        Ze |= 4;
        try {
          Dv(e, t.alternate, t);
        } finally {
          Ze = o, re.p = l, le.T = n;
        }
      }
      ht = 3;
    }
  }
  function rd() {
    if (ht === 4 || ht === 3) {
      ht = 0;
      var e = Tr;
      Tr = null, Es();
      var t = nl, n = Oo, l = bl, o = Zv, i = (l & 335544064) === l ? 10262 : 10256;
      if ((n.subtreeFlags & i) !== 0 || (n.flags & i) !== 0 ? ht = 5 : (ht = 0, Oo = nl = null, og(t, t.pendingLanes)), i = t.pendingLanes, i === 0 && (Ma = null), zn(l), n = n.stateNode, Ft && typeof Ft.onCommitFiberRoot == "function")
        try {
          Ft.onCommitFiberRoot(
            aa,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (o !== null) {
        n = le.T, i = re.p, re.p = 2, le.T = null;
        try {
          for (var d = t.onRecoverableError, g = 0; g < o.length; g++) {
            var T = o[g];
            d(T.value, {
              componentStack: T.stack
            });
          }
        } finally {
          le.T = n, re.p = i;
        }
      }
      if (o = Ar, d = Or, Or = null, o !== null && (Ar = null, d === null && (d = []), e !== null))
        for (T = 0; T < o.length; T++)
          n = (0, o[T])(
            d
          ), n !== void 0 && e.finished.finally(n);
      (bl & 3) !== 0 && xc(), Sl(t), i = t.pendingLanes, (l & 261930) !== 0 && (i & 42) !== 0 ? t === pc ? Vi++ : (Vi = 0, pc = t) : (Vi = 0, pc = null), Gi(0);
    }
  }
  function og(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Si(t)));
  }
  function xc() {
    return Tr !== null && (Tr.skipTransition(), Tr = null), ad(), od(), rd(), id();
  }
  function id() {
    if (ht !== 5) return !1;
    var e = nl, t = ed;
    ed = 0;
    var n = zn(bl), l = le.T, o = re.p;
    try {
      re.p = 32 > n ? 32 : n, le.T = null, n = td, td = null;
      var i = nl, d = bl;
      if (ht = 0, Oo = nl = null, bl = 0, (Ze & 6) !== 0) throw Error(u(331));
      var g = Ze;
      if (Ze |= 4, Iv(i.current), Yv(
        i,
        i.current,
        d,
        n
      ), Ze = g, Gi(0, !1), Ft && typeof Ft.onPostCommitFiberRoot == "function")
        try {
          Ft.onPostCommitFiberRoot(aa, i);
        } catch {
        }
      return !0;
    } finally {
      re.p = o, le.T = l, og(e, t);
    }
  }
  function rg(e, t, n) {
    t = Ln(n, t), t = wf(e.stateNode, t, 2), e = Ea(e, t, 2), e !== null && (zl(e, 2), Sl(e));
  }
  function $e(e, t, n) {
    if (e.tag === 3)
      rg(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          rg(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Ma === null || !Ma.has(l))) {
            e = Ln(n, e), n = nv(2), l = Ea(t, n, 2), l !== null && (lv(
              n,
              l,
              t,
              e
            ), zl(l, 2), Sl(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function ud(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new aS();
      var o = /* @__PURE__ */ new Set();
      l.set(t, o);
    } else
      o = l.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), l.set(t, o));
    o.has(n) || ($f = !0, o.add(n), e = dS.bind(null, e, t, n), t.then(e, e));
  }
  function dS(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, lt === e && (Ve & n) === n && ((gt === 4 || gt === 3 && (Ve & 62914560) === Ve && 300 > en() - hc) && (Ze & 2) === 0 ? Rr(e, 0) : mc |= n, wr === Ve && (wr = 0)), Sl(e);
  }
  function ig(e, t) {
    t === 0 && (t = Pn()), e = so(e, t), e !== null && (zl(e, t), Sl(e));
  }
  function mS(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), ig(e, n);
  }
  function hS(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, o = e.memoizedState;
        o !== null && (n = o.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(u(314));
    }
    l !== null && l.delete(t), ig(e, n);
  }
  function vS(e, t) {
    return ni(e, t);
  }
  var Nr = null, Dr = null, cd = !1, Ec = !1, sd = !1, Da = 0;
  function Sl(e) {
    e !== Dr && e.next === null && (Dr === null ? Nr = Dr = e : Dr = Dr.next = e), Ec = !0, cd || (cd = !0, pS());
  }
  function Gi(e, t) {
    if (!sd && Ec) {
      sd = !0;
      do
        for (var n = !1, l = Nr; l !== null; ) {
          if (e !== 0) {
            var o = l.pendingLanes;
            if (o === 0) var i = 0;
            else {
              var d = l.suspendedLanes, g = l.pingedLanes;
              i = (1 << 31 - zt(42 | e) + 1) - 1, i &= o & ~(d & ~g), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (n = !0, fg(l, i));
          } else
            i = Ve, i = Zn(
              l,
              l === lt ? i : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (i & 3) === 0 || Kn(l, i) || (n = !0, fg(l, i));
          l = l.next;
        }
      while (n);
      sd = !1;
    }
  }
  function gS() {
    ug();
  }
  function ug() {
    Ec = cd = !1;
    var e = 0;
    Da !== 0 && _S() && (e = Da);
    for (var t = en(), n = null, l = Nr; l !== null; ) {
      var o = l.next, i = cg(l, t);
      i === 0 ? (l.next = null, n === null ? Nr = o : n.next = o, o === null && (Dr = n)) : (n = l, (e !== 0 || (i & 3) !== 0) && (Ec = !0)), l = o;
    }
    ht !== 0 && ht !== 5 || Gi(e), Da !== 0 && (Da = 0);
  }
  function cg(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, o = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var d = 31 - zt(i), g = 1 << d, T = o[d];
      T === -1 ? ((g & n) === 0 || (g & l) !== 0) && (o[d] = ai(g, t)) : T <= t && (e.expiredLanes |= g), i &= ~g;
    }
    if (t = lt, n = Ve, n = Zn(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (Je === 2 || Je === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && Xo(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || Kn(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && Xo(l), zn(n)) {
        case 2:
        case 8:
          n = Zo;
          break;
        case 32:
          n = cn;
          break;
        case 268435456:
          n = li;
          break;
        default:
          n = cn;
      }
      return l = sg.bind(null, e), n = ni(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && Xo(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function sg(e, t) {
    if (ht !== 0 && ht !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (xc() && e.callbackNode !== n)
      return null;
    var l = Ve;
    return l = Zn(
      e,
      e === lt ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (Pv(e, l, t), cg(e, en()), e.callbackNode != null && e.callbackNode === n ? sg.bind(null, e) : null);
  }
  function fg(e, t) {
    if (xc()) return null;
    Pv(e, t, !0);
  }
  function pS() {
    MS(function() {
      (Ze & 6) !== 0 ? ni(
        la,
        gS
      ) : ug();
    });
  }
  function fd() {
    if (Da === 0) {
      var e = po;
      e === 0 && (e = Nl, Nl <<= 1, (Nl & 261888) === 0 && (Nl = 256)), Da = e;
    }
    return Da;
  }
  function dg(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : qt(e);
  }
  function yS(e, t, n, l, o) {
    if (t === "submit" && n && n.stateNode === o) {
      var i = dg(
        (o[Yt] || null).action
      ), d = l.submitter;
      d && (t = (t = d[Yt] || null) ? dg(t.formAction) : d.getAttribute("formAction"), t !== null && (i = t, d = null));
      var g = new Eu(
        "action",
        "action",
        null,
        l,
        o
      );
      e.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (Da !== 0) {
                  var T = new FormData(o, d);
                  bf(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: o.method,
                      action: i
                    },
                    null,
                    T
                  );
                }
              } else
                typeof i == "function" && (g.preventDefault(), T = new FormData(o, d), bf(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: o.method,
                    action: i
                  },
                  i,
                  T
                ));
            },
            currentTarget: o
          }
        ]
      });
    }
  }
  for (var dd = 0; dd < Hs.length; dd++) {
    var md = Hs[dd], bS = md.toLowerCase(), SS = md[0].toUpperCase() + md.slice(1);
    $n(
      bS,
      "on" + SS
    );
  }
  $n(B0, "onAnimationEnd"), $n(V0, "onAnimationIteration"), $n(G0, "onAnimationStart"), $n("dblclick", "onDoubleClick"), $n("focusin", "onFocus"), $n("focusout", "onBlur"), $n(R1, "onTransitionRun"), $n(M1, "onTransitionStart"), $n(N1, "onTransitionCancel"), $n(Y0, "onTransitionEnd"), et("onMouseEnter", ["mouseout", "mouseover"]), et("onMouseLeave", ["mouseout", "mouseover"]), et("onPointerEnter", ["pointerout", "pointerover"]), et("onPointerLeave", ["pointerout", "pointerover"]), ze(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), ze(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), ze("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), ze(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), ze(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), ze(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Yi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), xS = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Yi)
  );
  function mg(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], o = l.event;
      l = l.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var d = l.length - 1; 0 <= d; d--) {
            var g = l[d], T = g.instance, H = g.currentTarget;
            if (g = g.listener, T !== i && o.isPropagationStopped())
              break e;
            i = g, o.currentTarget = H;
            try {
              i(o);
            } catch (k) {
              Tu(k);
            }
            o.currentTarget = null, i = T;
          }
        else
          for (d = 0; d < l.length; d++) {
            if (g = l[d], T = g.instance, H = g.currentTarget, g = g.listener, T !== i && o.isPropagationStopped())
              break e;
            i = g, o.currentTarget = H;
            try {
              i(o);
            } catch (k) {
              Tu(k);
            }
            o.currentTarget = null, i = T;
          }
      }
    }
  }
  function Be(e, t) {
    var n = t[oi];
    n === void 0 && (n = t[oi] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (hg(t, e, 2, !1), n.add(l));
  }
  function hd(e, t, n) {
    var l = 0;
    t && (l |= 4), hg(
      n,
      e,
      l,
      t
    );
  }
  var Cc = "_reactListening" + Math.random().toString(36).slice(2);
  function vd(e) {
    if (!e[Cc]) {
      e[Cc] = !0, _e.forEach(function(n) {
        n !== "selectionchange" && (xS.has(n) || hd(n, !1, e), hd(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Cc] || (t[Cc] = !0, hd("selectionchange", !1, t));
    }
  }
  function hg(e, t, n, l) {
    switch (lp(t)) {
      case 2:
        var o = mx;
        break;
      case 8:
        o = hx;
        break;
      default:
        o = Ud;
    }
    n = o.bind(
      null,
      t,
      n,
      e
    ), o = void 0, !io || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), l ? o !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: o
    }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, {
      passive: o
    }) : e.addEventListener(t, n, !1);
  }
  function gd(e, t, n, l, o) {
    var i = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var d = l.tag;
        if (d === 3 || d === 4) {
          var g = l.stateNode.containerInfo;
          if (g === o) break;
          if (d === 4)
            for (d = l.return; d !== null; ) {
              var T = d.tag;
              if ((T === 3 || T === 4) && d.stateNode.containerInfo === o)
                return;
              d = d.return;
            }
          for (; g !== null; ) {
            if (d = Jn(g), d === null) return;
            if (T = d.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              l = i = d;
              continue e;
            }
            g = g.parentNode;
          }
        }
        l = l.return;
      }
    ro(function() {
      var H = i, k = oo(n), P = [];
      e: {
        var z = q0.get(e);
        if (z !== void 0) {
          var V = Eu, ce = e;
          switch (e) {
            case "keypress":
              if (Su(n) === 0) break e;
            case "keydown":
            case "keyup":
              V = o1;
              break;
            case "focusin":
              ce = "focus", V = As;
              break;
            case "focusout":
              ce = "blur", V = As;
              break;
            case "beforeblur":
            case "afterblur":
              V = As;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              V = p0;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              V = Zb;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              V = s1;
              break;
            case B0:
            case V0:
            case G0:
              V = Fb;
              break;
            case Y0:
              V = d1;
              break;
            case "scroll":
            case "scrollend":
              V = Xb;
              break;
            case "wheel":
              V = h1;
              break;
            case "copy":
            case "cut":
            case "paste":
              V = $b;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              V = b0;
              break;
            case "submit":
              V = u1;
              break;
            case "toggle":
            case "beforetoggle":
              V = g1;
          }
          var ye = (t & 4) !== 0, Ne = !ye && (e === "scroll" || e === "scrollend"), U = ye ? z !== null ? z + "Capture" : null : z;
          ye = [];
          for (var N = H, B; N !== null; ) {
            var K = N;
            if (B = K.stateNode, K = K.tag, K !== 5 && K !== 26 && K !== 27 || B === null || U === null || (K = Ul(N, U), K != null && ye.push(
              qi(N, K, B)
            )), Ne) break;
            N = N.return;
          }
          0 < ye.length && (z = new V(
            z,
            ce,
            null,
            n,
            k
          ), P.push({ event: z, listeners: ye }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (V = e === "mouseover" || e === "pointerover", z = e === "mouseout" || e === "pointerout", V && n !== ao && (ce = n.relatedTarget || n.fromElement) && (Jn(ce) || ce[pn]))
            break e;
          (z || V) && (ce = k.window === k ? k : (V = k.ownerDocument) ? V.defaultView || V.parentWindow : window, z ? (V = n.relatedTarget || n.toElement, z = H, V = V ? Jn(V) : null, V !== null && (Ne = f(V), ye = V.tag, V !== Ne || ye !== 5 && ye !== 27 && ye !== 6) && (V = null)) : (z = null, V = H), z !== V && (ye = p0, K = "onMouseLeave", U = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (ye = b0, K = "onPointerLeave", U = "onPointerEnter", N = "pointer"), Ne = z == null ? ce : q(z), B = V == null ? ce : q(V), ce = new ye(
            K,
            N + "leave",
            z,
            n,
            k
          ), ce.target = Ne, ce.relatedTarget = B, K = null, Jn(k) === H && (ye = new ye(
            U,
            N + "enter",
            V,
            n,
            k
          ), ye.target = B, ye.relatedTarget = Ne, K = ye), Ne = K, ye = z && V ? I(
            z,
            V,
            ES
          ) : null, z !== null && vg(
            P,
            ce,
            z,
            ye,
            !1
          ), V !== null && Ne !== null && vg(
            P,
            Ne,
            V,
            ye,
            !0
          )));
        }
        e: {
          if (z = H ? q(H) : window, V = z.nodeName && z.nodeName.toLowerCase(), V === "select" || V === "input" && z.type === "file")
            var me = O0;
          else if (T0(z))
            if (_0)
              me = A1;
            else {
              me = w1;
              var Ge = C1;
            }
          else
            V = z.nodeName, !V || V.toLowerCase() !== "input" || z.type !== "checkbox" && z.type !== "radio" ? H && lo(H.elementType) && (me = O0) : me = T1;
          if (me && (me = me(e, H))) {
            A0(
              P,
              me,
              n,
              k
            );
            break e;
          }
          Ge && Ge(e, z, H);
        }
        switch (Ge = H ? q(H) : window, e) {
          case "focusin":
            (T0(Ge) || Ge.contentEditable === "true") && (rr = Ge, zs = H, pi = null);
            break;
          case "focusout":
            pi = zs = rr = null;
            break;
          case "mousedown":
            js = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            js = !1, H0(P, n, k);
            break;
          case "selectionchange":
            if (_1) break;
          case "keydown":
          case "keyup":
            H0(P, n, k);
        }
        var Se;
        if (_s)
          e: {
            switch (e) {
              case "compositionstart":
                var Te = "onCompositionStart";
                break e;
              case "compositionend":
                Te = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Te = "onCompositionUpdate";
                break e;
            }
            Te = void 0;
          }
        else
          or ? C0(e, n) && (Te = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Te = "onCompositionStart");
        Te && (S0 && n.locale !== "ko" && (or || Te !== "onCompositionStart" ? Te === "onCompositionEnd" && or && (Se = v0()) : (ma = k, Cs = "value" in ma ? ma.value : ma.textContent, or = !0)), Ge = wc(H, Te), 0 < Ge.length && (Te = new y0(
          Te,
          e,
          null,
          n,
          k
        ), P.push({ event: Te, listeners: Ge }), Se ? Te.data = Se : (Se = w0(n), Se !== null && (Te.data = Se)))), (Se = y1 ? b1(e, n) : S1(e, n)) && (Te = wc(H, "onBeforeInput"), 0 < Te.length && (Ge = new y0(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          k
        ), P.push({
          event: Ge,
          listeners: Te
        }), Ge.data = Se)), yS(
          P,
          e,
          H,
          n,
          k
        );
      }
      mg(P, t);
    });
  }
  function qi(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function wc(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var o = e, i = o.stateNode;
      if (o = o.tag, o !== 5 && o !== 26 && o !== 27 || i === null || (o = Ul(e, n), o != null && l.unshift(
        qi(e, o, i)
      ), o = Ul(e, t), o != null && l.push(
        qi(e, o, i)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function ES(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function vg(e, t, n, l, o) {
    for (var i = t._reactName, d = []; n !== null && n !== l; ) {
      var g = n, T = g.alternate, H = g.stateNode;
      if (g = g.tag, T !== null && T === l) break;
      g !== 5 && g !== 26 && g !== 27 || H === null || (T = H, o ? (H = Ul(n, i), H != null && d.unshift(
        qi(n, H, T)
      )) : o || (H = Ul(n, i), H != null && d.push(
        qi(n, H, T)
      ))), n = n.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var CS = /\r\n?/g, wS = /\u0000|\uFFFD/g;
  function gg(e) {
    return (typeof e == "string" ? e : "" + e).replace(CS, `
`).replace(wS, "");
  }
  function pg(e, t) {
    return t = gg(t), gg(e) === t;
  }
  function We(e, t, n, l, o, i) {
    switch (n) {
      case "children":
        if (typeof l == "string")
          t === "body" || t === "textarea" && l === "" || tn(e, l);
        else if (typeof l == "number" || typeof l == "bigint")
          t !== "body" && tn(e, "" + l);
        else return;
        break;
      case "className":
        yn(e, "class", l);
        break;
      case "tabIndex":
        yn(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        yn(e, n, l);
        break;
      case "style":
        Sn(e, l, i);
        return;
      case "data":
        if (t !== "object") {
          yn(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = qt(l), e.setAttribute(n, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (n === "formAction" ? (t !== "input" && We(e, t, "name", o.name, o, null), We(
            e,
            t,
            "formEncType",
            o.formEncType,
            o,
            null
          ), We(
            e,
            t,
            "formMethod",
            o.formMethod,
            o,
            null
          ), We(
            e,
            t,
            "formTarget",
            o.formTarget,
            o,
            null
          )) : (We(e, t, "encType", o.encType, o, null), We(e, t, "method", o.method, o, null), We(e, t, "target", o.target, o, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = qt(l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = nn);
        return;
      case "onScroll":
        l != null && Be("scroll", e);
        return;
      case "onScrollEnd":
        l != null && Be("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(u(61));
          if (n = l.__html, n != null) {
            if (o.children != null) throw Error(u(60));
            i?.__html !== n && (e.innerHTML = n);
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = qt(l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(n) : e.setAttribute(n, l);
        break;
      case "popover":
        Be("beforetoggle", e), Be("toggle", e), mt(e, "popover", l);
        break;
      case "xlinkActuate":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Et(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Et(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Et(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Et(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        mt(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = ui.get(n) || n, mt(e, n, l);
        else return;
    }
    Ee = !0;
  }
  function pd(e, t, n, l, o, i) {
    switch (n) {
      case "style":
        Sn(e, l, i);
        return;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(u(61));
          if (n = l.__html, n != null) {
            if (o.children != null) throw Error(u(60));
            i?.__html !== n && (e.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof l == "string") tn(e, l);
        else if (typeof l == "number" || typeof l == "bigint")
          tn(e, "" + l);
        else return;
        break;
      case "onScroll":
        l != null && Be("scroll", e);
        return;
      case "onScrollEnd":
        l != null && Be("scrollend", e);
        return;
      case "onClick":
        l != null && (e.onclick = nn);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Ae.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (o = n.endsWith("Capture"), i = n.slice(2, o ? n.length - 7 : void 0), t = e[Yt] || null, t = t != null ? t[n] : null, typeof t == "function" && e.removeEventListener(i, t, o), typeof l == "function")) {
              typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(i, l, o);
              break e;
            }
            Ee = !0, n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : mt(e, n, l);
          }
        return;
    }
    Ee = !0;
  }
  function Kt(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Be("error", e), Be("load", e);
        var l = !1, o = !1, i;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var d = n[i];
            if (d != null)
              switch (i) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  o = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(u(137, t));
                default:
                  We(e, t, i, d, n, null);
              }
          }
        o && We(e, t, "srcSet", n.srcSet, n, null), l && We(e, t, "src", n.src, n, null);
        return;
      case "input":
        Be("invalid", e);
        var g = i = d = o = null, T = null, H = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var k = n[l];
            if (k != null)
              switch (l) {
                case "name":
                  o = k;
                  break;
                case "type":
                  d = k;
                  break;
                case "checked":
                  T = k;
                  break;
                case "defaultChecked":
                  H = k;
                  break;
                case "value":
                  i = k;
                  break;
                case "defaultValue":
                  g = k;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (k != null)
                    throw Error(u(137, t));
                  break;
                default:
                  We(e, t, l, k, n, null);
              }
          }
        fa(
          e,
          i,
          g,
          T,
          H,
          d,
          o,
          !1
        );
        return;
      case "select":
        Be("invalid", e), l = d = i = null;
        for (o in n)
          if (n.hasOwnProperty(o) && (g = n[o], g != null))
            switch (o) {
              case "value":
                i = g;
                break;
              case "defaultValue":
                d = g;
                break;
              case "multiple":
                l = g;
              default:
                We(e, t, o, g, n, null);
            }
        t = i, n = d, e.multiple = !!l, t != null ? sn(e, !!l, t, !1) : n != null && sn(e, !!l, n, !0);
        return;
      case "textarea":
        Be("invalid", e), i = o = l = null;
        for (d in n)
          if (n.hasOwnProperty(d) && (g = n[d], g != null))
            switch (d) {
              case "value":
                l = g;
                break;
              case "defaultValue":
                o = g;
                break;
              case "children":
                i = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(u(91));
                break;
              default:
                We(e, t, d, g, n, null);
            }
        bn(e, l, o, i);
        return;
      case "option":
        for (T in n)
          n.hasOwnProperty(T) && (l = n[T], l != null) && (T === "selected" ? e.selected = l && typeof l != "function" && typeof l != "symbol" : We(e, t, T, l, n, null));
        return;
      case "dialog":
        Be("beforetoggle", e), Be("toggle", e), Be("cancel", e), Be("close", e);
        break;
      case "iframe":
      case "object":
        Be("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Yi.length; l++)
          Be(Yi[l], e);
        break;
      case "image":
        Be("error", e), Be("load", e);
        break;
      case "details":
        Be("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Be("error", e), Be("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (H in n)
          if (n.hasOwnProperty(H) && (l = n[H], l != null))
            switch (H) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, t));
              default:
                We(e, t, H, l, n, null);
            }
        return;
      default:
        if (lo(t)) {
          for (k in n)
            n.hasOwnProperty(k) && (l = n[k], l !== void 0 && pd(
              e,
              t,
              k,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (g in n)
      n.hasOwnProperty(g) && (l = n[g], l != null && We(e, t, g, l, n, null));
  }
  var TS = {};
  function AS(e, t, n, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var o = null, i = null, d = null, g = null, T = null, H = null, k = null;
        for (V in n) {
          var P = n[V];
          if (n.hasOwnProperty(V) && P != null)
            switch (V) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = P;
              default:
                l.hasOwnProperty(V) || We(e, t, V, null, l, P);
            }
        }
        for (var z in l) {
          var V = l[z];
          if (P = n[z], l.hasOwnProperty(z) && (V != null || P != null))
            switch (z) {
              case "type":
                V !== P && (Ee = !0), i = V;
                break;
              case "name":
                V !== P && (Ee = !0), o = V;
                break;
              case "checked":
                V !== P && (Ee = !0), H = V;
                break;
              case "defaultChecked":
                V !== P && (Ee = !0), k = V;
                break;
              case "value":
                V !== P && (Ee = !0), d = V;
                break;
              case "defaultValue":
                V !== P && (Ee = !0), g = V;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(u(137, t));
                break;
              default:
                V !== P && We(
                  e,
                  t,
                  z,
                  V,
                  l,
                  P
                );
            }
        }
        Jt(
          e,
          d,
          g,
          T,
          H,
          k,
          i,
          o
        );
        return;
      case "select":
        V = d = g = z = null;
        for (i in n)
          if (T = n[i], n.hasOwnProperty(i) && T != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                V = T;
              default:
                l.hasOwnProperty(i) || We(
                  e,
                  t,
                  i,
                  null,
                  l,
                  T
                );
            }
        for (o in l)
          if (i = l[o], T = n[o], l.hasOwnProperty(o) && (i != null || T != null))
            switch (o) {
              case "value":
                i !== T && (Ee = !0), z = i;
                break;
              case "defaultValue":
                i !== T && (Ee = !0), g = i;
                break;
              case "multiple":
                i !== T && (Ee = !0), d = i;
              default:
                i !== T && We(
                  e,
                  t,
                  o,
                  i,
                  l,
                  T
                );
            }
        t = g, n = d, l = V, z != null ? sn(e, !!n, z, !1) : !!l != !!n && (t != null ? sn(e, !!n, t, !0) : sn(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        V = z = null;
        for (g in n)
          if (o = n[g], n.hasOwnProperty(g) && o != null && !l.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                We(e, t, g, null, l, o);
            }
        for (d in l)
          if (o = l[d], i = n[d], l.hasOwnProperty(d) && (o != null || i != null))
            switch (d) {
              case "value":
                o !== i && (Ee = !0), z = o;
                break;
              case "defaultValue":
                o !== i && (Ee = !0), V = o;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(u(91));
                break;
              default:
                o !== i && We(e, t, d, o, l, i);
            }
        ar(e, z, V);
        return;
      case "option":
        for (var ce in n)
          z = n[ce], n.hasOwnProperty(ce) && z != null && !l.hasOwnProperty(ce) && (ce === "selected" ? e.selected = !1 : We(
            e,
            t,
            ce,
            null,
            l,
            z
          ));
        for (T in l)
          z = l[T], V = n[T], l.hasOwnProperty(T) && z !== V && (z != null || V != null) && (T === "selected" ? (z !== V && (Ee = !0), e.selected = z && typeof z != "function" && typeof z != "symbol") : We(
            e,
            t,
            T,
            z,
            l,
            V
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ye in n)
          z = n[ye], n.hasOwnProperty(ye) && z != null && !l.hasOwnProperty(ye) && We(e, t, ye, null, l, z);
        for (H in l)
          if (z = l[H], V = n[H], l.hasOwnProperty(H) && z !== V && (z != null || V != null))
            switch (H) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null)
                  throw Error(u(137, t));
                break;
              default:
                We(
                  e,
                  t,
                  H,
                  z,
                  l,
                  V
                );
            }
        return;
      default:
        if (lo(t)) {
          for (var Ne in n)
            z = n[Ne], n.hasOwnProperty(Ne) && z !== void 0 && !l.hasOwnProperty(Ne) && pd(
              e,
              t,
              Ne,
              void 0,
              l,
              z
            );
          for (k in l)
            z = l[k], V = n[k], !l.hasOwnProperty(k) || z === V || z === void 0 && V === void 0 || pd(
              e,
              t,
              k,
              z,
              l,
              V
            );
          return;
        }
    }
    for (var U in n)
      z = n[U], n.hasOwnProperty(U) && z != null && !l.hasOwnProperty(U) && We(e, t, U, null, l, z);
    for (P in l)
      z = l[P], V = n[P], !l.hasOwnProperty(P) || z === V || z == null && V == null || We(e, t, P, z, l, V);
  }
  function yg(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function OS() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var o = n[l], i = o.transferSize, d = o.initiatorType, g = o.duration;
        if (i && g && yg(d)) {
          for (d = 0, g = o.responseEnd, l += 1; l < n.length; l++) {
            var T = n[l], H = T.startTime;
            if (H > g) break;
            var k = T.transferSize, P = T.initiatorType;
            k && yg(P) && (T = T.responseEnd, d += k * (T < g ? 1 : (g - H) / (T - H)));
          }
          if (--l, t += 8 * (i + d) / (o.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var yd = null, bd = null;
  function ki(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function bg(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Sg(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function xg(e, t, n, l) {
    return n = ki(
      n
    ).createElement(e), n[dt] = l, n[Yt] = t, Kt(n, e, t), W(n), n;
  }
  function Sd(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var xd = null;
  function _S() {
    var e = window.event;
    return e && e.type === "popstate" ? e === xd ? !1 : (xd = e, !0) : (xd = null, !1);
  }
  var Ed = typeof setTimeout == "function" ? setTimeout : void 0, RS = typeof clearTimeout == "function" ? clearTimeout : void 0, Eg = typeof Promise == "function" ? Promise : void 0, Cg = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Ed, MS = typeof queueMicrotask == "function" ? queueMicrotask : typeof Eg < "u" ? function(e) {
    return Eg.resolve(null).then(e).catch(NS);
  } : Ed;
  function NS(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function za(e) {
    return e === "head";
  }
  function wg(e, t) {
    var n = t, l = 0;
    do {
      var o = n.nextSibling;
      if (e.removeChild(n), o && o.nodeType === 8)
        if (n = o.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(o), Vr(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          Md(
            e.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = e.ownerDocument.head, Md(n);
          for (var i = n.firstChild; i; ) {
            var d = i.nextSibling, g = i.nodeName;
            i[to] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && i.rel.toLowerCase() === "stylesheet" || n.removeChild(i), i = d;
          }
        } else
          n === "body" && Md(e.ownerDocument.body);
      n = o;
    } while (n);
    Vr(t);
  }
  function Tg(e, t) {
    var n = e;
    e = 0;
    do {
      var l = n.nextSibling;
      if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), l && l.nodeType === 8)
        if (n = l.data, n === "/$") {
          if (e === 0) break;
          e--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
      n = l;
    } while (n);
  }
  function Ag(e, t, n) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
      if (t = e.getClientRects(), t.length === 1) var l = 1;
      else
        for (var o = l = 0; o < t.length; o++) {
          var i = t[o];
          0 < i.width && 0 < i.height && l++;
        }
      l === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
    }
  }
  function Og(e, t) {
    e = e.style, t = t.style;
    var n = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n != null ? e.margin = n : (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function DS(e, t, n) {
    return n = n.ownerDocument.defaultView, {
      rect: e,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
    };
  }
  function Cd(e) {
    var t = e.getBoundingClientRect(), n = getComputedStyle(e);
    return DS(t, n, e);
  }
  function zS(e) {
    return e.documentElement.clientHeight;
  }
  function jS(e) {
    this.addEventListener("load", e), this.addEventListener("error", e);
  }
  function US(e, t, n, l, o, i, d, g, T) {
    var H = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var k = H.startViewTransition({
        update: function() {
          var z = H.defaultView, V = z.navigation && z.navigation.transition, ce = H.fonts.status;
          l();
          var ye = [];
          if (ce === "loaded" && (zS(H), H.fonts.status === "loading" && ye.push(H.fonts.ready)), ce = ye.length, e !== null)
            for (var Ne = e.suspenseyImages, U = 0, N = 0; N < Ne.length; N++) {
              var B = Ne[N];
              if (!B.complete) {
                var K = B.getBoundingClientRect();
                if (0 < K.bottom && 0 < K.right && K.top < z.innerHeight && K.left < z.innerWidth) {
                  if (U += Kg(B), U > Oc) {
                    ye.length = ce;
                    break;
                  }
                  B = new Promise(
                    jS.bind(B)
                  ), ye.push(B);
                }
              }
            }
          if (0 < ye.length)
            return z = Promise.race([
              Promise.all(ye),
              new Promise(function(me) {
                return setTimeout(me, 500);
              })
            ]).then(o, o), (V ? Promise.allSettled([V.finished, z]) : z).then(i, i);
          if (o(), V)
            return V.finished.then(
              i,
              i
            );
          i();
        },
        types: n
      });
      H.__reactViewTransition = k;
      var P = [];
      return k.ready.then(
        function() {
          for (var z = H.documentElement.getAnimations({
            subtree: !0
          }), V = 0; V < z.length; V++) {
            var ce = z[V], ye = ce.effect, Ne = ye.pseudoElement;
            if (Ne != null && Ne.startsWith("::view-transition")) {
              P.push(ce), ce = ye.getKeyframes();
              for (var U = Ne = void 0, N = !0, B = 0; B < ce.length; B++) {
                var K = ce[B], me = K.width;
                if (Ne === void 0) Ne = me;
                else if (Ne !== me) {
                  N = !1;
                  break;
                }
                if (me = K.height, U === void 0) U = me;
                else if (U !== me) {
                  N = !1;
                  break;
                }
                delete K.width, delete K.height, K.transform === "none" && delete K.transform;
              }
              N && Ne !== void 0 && U !== void 0 && (ye.setKeyframes(ce), N = getComputedStyle(
                ye.target,
                ye.pseudoElement
              ), N.width !== Ne || N.height !== U) && (N = ce[0], N.width = Ne, N.height = U, N = ce[ce.length - 1], N.width = Ne, N.height = U, ye.setKeyframes(ce));
            }
          }
          d();
        },
        function(z) {
          H.__reactViewTransition === k && (H.__reactViewTransition = null);
          try {
            typeof z == "object" && z !== null && z.name === "InvalidStateError" && (z.message === "View transition was skipped because document visibility state is hidden." || z.message === "Skipping view transition because document visibility state has become hidden." || z.message === "Skipping view transition because viewport size changed." || z.message === "Transition was aborted because of invalid state") && (z = null), z !== null && T(z);
          } finally {
            l(), o(), d();
          }
        }
      ), k.finished.finally(function() {
        for (var z = 0; z < P.length; z++)
          P[z].cancel();
        H.__reactViewTransition === k && (H.__reactViewTransition = null), g();
      }), k;
    } catch {
      return l(), o(), d(), null;
    }
  }
  function _o(e, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
  }
  _o.prototype.animate = function(e, t) {
    return t = typeof t == "number" ? { duration: t } : X({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
  }, _o.prototype.getAnimations = function() {
    for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), l = [], o = 0; o < n.length; o++) {
      var i = n[o].effect;
      i !== null && i.target === e && i.pseudoElement === t && l.push(n[o]);
    }
    return l;
  }, _o.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function _g(e) {
    return {
      name: e,
      group: new _o("group", e),
      imagePair: new _o("image-pair", e),
      old: new _o("old", e),
      new: new _o("new", e)
    };
  }
  function _n(e) {
    this._fragmentFiber = e, this._observers = this._eventListeners = null;
  }
  _n.prototype.addEventListener = function(e, t, n) {
    var l = null, o = null;
    if (!(n != null && typeof n != "boolean" && (l = n.signal || null, l !== null && l.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var i = this._eventListeners;
      if (Mg(i, e, t, n) === -1) {
        var d = this, g = t;
        n != null && typeof n != "boolean" && n.once === !0 && (g = function(T) {
          d.removeEventListener(
            e,
            t,
            n
          ), typeof t == "function" ? t.call(this, T) : t.handleEvent(T);
        }), l !== null && (o = d.removeEventListener.bind(
          d,
          e,
          t,
          n
        ), l.addEventListener("abort", o, { once: !0 }), o = l.removeEventListener.bind(l, "abort", o)), l = zr(n), i.push({
          type: e,
          listener: t,
          optionsOrUseCapture: n,
          attachedListener: g,
          cleanup: o
        }), v(
          this._fragmentFiber.child,
          !1,
          HS,
          e,
          g,
          l
        );
      }
      this._eventListeners = i;
    }
  };
  function HS(e, t, n, l) {
    return C(e).addEventListener(
      t,
      n,
      l
    ), !1;
  }
  _n.prototype.removeEventListener = function(e, t, n) {
    var l = this._eventListeners;
    if (l !== null && (t = Mg(
      l,
      e,
      t,
      n
    ), t !== -1)) {
      var o = l[t];
      n = o.attachedListener;
      var i = o.cleanup;
      o = zr(o.optionsOrUseCapture), v(
        this._fragmentFiber.child,
        !1,
        LS,
        e,
        n,
        o
      ), l.splice(t, 1), i !== null && i();
    }
  };
  function LS(e, t, n, l) {
    return C(e).removeEventListener(
      t,
      n,
      l
    ), !1;
  }
  function zr(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal) ? { capture: e.capture, passive: e.passive } : e;
  }
  function Rg(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function Mg(e, t, n, l) {
    if (e.length === 0) return -1;
    l = Rg(l);
    for (var o = 0; o < e.length; o++) {
      var i = e[o];
      if (i.type === t && i.listener === n && Rg(i.optionsOrUseCapture) === l)
        return o;
    }
    return -1;
  }
  _n.prototype.dispatchEvent = function(e) {
    var t = S(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = C(t);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !e.bubbles) {
      var l = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (n)
        for (var o = 0; o < n.length; o++) {
          var i = n[o];
          l.addEventListener(
            i.type,
            i.attachedListener,
            zr(i.optionsOrUseCapture)
          );
        }
      if (t.appendChild(l), e = l.dispatchEvent(e), n)
        for (o = 0; o < n.length; o++)
          i = n[o], l.removeEventListener(
            i.type,
            i.attachedListener,
            zr(i.optionsOrUseCapture)
          );
      return t.removeChild(l), e;
    }
    return t.dispatchEvent(e);
  }, _n.prototype.focus = function(e) {
    v(
      this._fragmentFiber.child,
      !0,
      Ng,
      e,
      void 0,
      void 0
    );
  };
  function Ng(e, t) {
    return e.tag === 6 ? !1 : (e = C(e), PS(e, t));
  }
  _n.prototype.focusLast = function(e) {
    var t = [];
    v(
      this._fragmentFiber.child,
      !0,
      wd,
      t,
      void 0,
      void 0
    );
    for (var n = t.length - 1; 0 <= n && !Ng(t[n], e); n--) ;
  };
  function wd(e, t) {
    return t.push(e), !1;
  }
  _n.prototype.blur = function() {
    var e = S(
      this._fragmentFiber
    );
    e !== null && (e = C(e), e = ki(e).activeElement, e !== null && v(
      this._fragmentFiber.child,
      !1,
      BS,
      e,
      void 0,
      void 0
    ));
  };
  function BS(e, t) {
    return e.tag === 6 ? !1 : (e = C(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  _n.prototype.observeUsing = function(e) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), v(
      this._fragmentFiber.child,
      !1,
      VS,
      e,
      void 0,
      void 0
    );
  };
  function VS(e, t) {
    return e.tag === 6 || (e = C(e), t.observe(e)), !1;
  }
  _n.prototype.unobserveUsing = function(e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      t.delete(e), v(
        this._fragmentFiber.child,
        !1,
        GS,
        e,
        void 0,
        void 0
      );
      for (var n = t = 0; n < ll.length; n++) {
        var l = ll[n];
        l.fragmentInstance === this && l.observer === e ? e.unobserve(l.instance) : ll[t++] = l;
      }
      ll.length = t;
    }
  };
  function GS(e, t) {
    return e.tag === 6 || (e = C(e), t.unobserve(e)), !1;
  }
  var ll = [], Td = !1;
  function YS(e, t, n) {
    ll.push({
      fragmentInstance: e,
      observer: t,
      instance: n
    }), Td || (Td = !0, FS(function() {
      Td = !1;
      var l = ll;
      ll = [];
      for (var o = 0; o < l.length; o++) {
        var i = l[o];
        i.observer.unobserve(i.instance);
      }
    }));
  }
  _n.prototype.getClientRects = function() {
    var e = [];
    return v(
      this._fragmentFiber.child,
      !1,
      qS,
      e,
      void 0,
      void 0
    ), e;
  };
  function qS(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var n = e.ownerDocument.createRange();
      n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
    } else
      e = C(e), t.push.apply(t, e.getClientRects());
    return !1;
  }
  _n.prototype.getRootNode = function(e) {
    var t = S(
      this._fragmentFiber
    );
    return t === null ? this : C(t).getRootNode(e);
  }, _n.prototype.compareDocumentPosition = function(e) {
    var t = S(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    v(
      this._fragmentFiber.child,
      !1,
      wd,
      n,
      void 0,
      void 0
    );
    var l = C(t);
    if (n.length === 0) {
      if (n = l, A(this._fragmentFiber)) {
        e: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break e;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (n = t);
      }
      t = this._fragmentFiber;
      var o = l = n.compareDocumentPosition(e);
      return n === e ? o = Node.DOCUMENT_POSITION_CONTAINS : l & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = O(t)[1], n === null ? o = Node.DOCUMENT_POSITION_PRECEDING : (e = C(n).compareDocumentPosition(
        e
      ), o = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), o |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = C(n[0]), o = C(n[n.length - 1]);
    var i = A(this._fragmentFiber) ? t.parentElement : l;
    if (i == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    l = i.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, i = i.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var d = t.compareDocumentPosition(e), g = o.compareDocumentPosition(e), T = d & Node.DOCUMENT_POSITION_CONTAINED_BY || g & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return g = l && i && d & Node.DOCUMENT_POSITION_FOLLOWING && g & Node.DOCUMENT_POSITION_PRECEDING, t = l && t === e || i && o === e || T || g ? Node.DOCUMENT_POSITION_CONTAINED_BY : !l && t === e || !i && o === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : d, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || kS(
      t,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      e
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function kS(e, t, n, l, o) {
    var i = Jn(o);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!i)
        e: {
          for (; i !== null; ) {
            if (i.tag === 7 && (i === t || i.alternate === t)) {
              n = !0;
              break e;
            }
            i = i.return;
          }
          n = !1;
        }
      return n;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (i === null)
        return i = o.ownerDocument, o === i || o === i.documentElement || o === i.body;
      e: {
        for (i = t, t = S(t); i !== null; ) {
          if (!(i.tag !== 5 && i.tag !== 3 && i.tag !== 27 || i !== t && i.alternate !== t)) {
            i = !0;
            break e;
          }
          i = i.return;
        }
        i = !1;
      }
      return i;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!i) && !(t = i === n) && (t = I(
      n,
      i,
      Y
    ), t === null ? t = !1 : (v(
      t,
      !0,
      j,
      i,
      n
    ), i = _, _ = null, t = i !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!i) && !(t = i === l) && (t = I(
      l,
      i,
      Y
    ), t === null ? t = !1 : (v(
      t,
      !0,
      M,
      i,
      l
    ), i = _, D = _ = null, t = i !== null)), t) : !1;
  }
  function Dg(e, t) {
    var n = e.ownerDocument.createRange();
    n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + e.left,
      t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight
    );
  }
  _n.prototype.scrollIntoView = function(e) {
    if (typeof e == "object") throw Error(u(566));
    var t = [];
    v(
      this._fragmentFiber.child,
      !1,
      wd,
      t,
      void 0,
      void 0
    );
    var n = e !== !1;
    if (t.length === 0) {
      var l = O(
        this._fragmentFiber
      );
      if (l = n ? l[1] || l[0] || S(this._fragmentFiber) : l[0] || l[1], l === null) return;
      if (l.tag === 6) {
        e = C(l), Dg(e, n);
        return;
      }
      if (l = C(l), l.nodeType !== 9) {
        if (l.nodeType === 11) {
          n = "host" in l ? l.host : null, n !== null && n.scrollIntoView(e);
          return;
        }
        l.scrollIntoView(e);
      }
    }
    for (l = n ? t.length - 1 : 0; l !== (n ? -1 : t.length); ) {
      var o = t[l];
      o.tag === 6 ? (o = C(o), Dg(o, n)) : C(o).scrollIntoView(e), l += n ? -1 : 1;
    }
  };
  function IS(e, t) {
    return e = C(e), zg(e, t), !1;
  }
  function zg(e, t) {
    e.reactFragments == null && (e.reactFragments = /* @__PURE__ */ new Set()), e.reactFragments.add(t);
  }
  function jg(e, t) {
    var n = t._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var o = n[l];
        e.addEventListener(
          o.type,
          o.attachedListener,
          zr(o.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(i) {
      for (var d = 0, g = 0; g < ll.length; g++) {
        var T = ll[g];
        (T.fragmentInstance !== t || T.observer !== i || T.instance !== e) && (ll[d++] = T);
      }
      ll.length = d, i.observe(e);
    }), zg(e, t));
  }
  function XS(e, t) {
    var n = t._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var o = n[l];
        e.removeEventListener(
          o.type,
          o.attachedListener,
          zr(o.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(i) {
      typeof i.rootMargin == "string" ? YS(
        t,
        i,
        e
      ) : i.unobserve(e);
    }), e.reactFragments != null && e.reactFragments.delete(t));
  }
  function Ad(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ad(n), er(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function QS(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var o = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[to])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== o.rel || e.getAttribute("href") !== (o.href == null || o.href === "" ? null : o.href) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin) || e.getAttribute("title") !== (o.title == null ? null : o.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (o.src == null ? null : o.src) || e.getAttribute("type") !== (o.type == null ? null : o.type) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = o.name == null ? null : "" + o.name;
        if (o.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = qn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function ZS(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = qn(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ug(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = qn(e.nextSibling), e === null)) return null;
    return e;
  }
  function Od(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function _d(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function KS(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), n.removeEventListener("DOMContentLoaded", l);
      };
      n.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function qn(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Rd = null;
  function Hg(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return qn(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Lg(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else n !== "/$" && n !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function PS(e, t) {
    function n() {
      l = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var l = !1;
    try {
      e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
    } finally {
      e.ownerDocument.removeEventListener("focus", n, !0);
    }
    return l;
  }
  function FS(e) {
    Cg(function() {
      Cg(function(t) {
        return e(t);
      });
    });
  }
  function Bg(e, t, n) {
    switch (t = ki(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(u(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(u(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(u(454));
        return e;
      default:
        throw Error(u(451));
    }
  }
  function Vg(e, t, n) {
    for (var l in n) {
      var o = n[l];
      n.hasOwnProperty(l) && o != null && We(e, t, l, null, TS, o);
    }
    n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === nn && (e.onclick = null), er(e);
  }
  function Md(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    er(e);
  }
  var kn = /* @__PURE__ */ new Map(), Gg = /* @__PURE__ */ new Set();
  function Ii(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Zl = re.d;
  re.d = {
    f: JS,
    r: $S,
    D: WS,
    C: ex,
    L: tx,
    m: nx,
    X: ax,
    S: lx,
    M: ox
  };
  function JS() {
    var e = Zl.f(), t = yc();
    return e || t;
  }
  function $S(e) {
    var t = no(e);
    t !== null && t.tag === 5 && t.type === "form" ? qh(t) : Zl.r(e);
  }
  var jr = typeof document > "u" ? null : document;
  function Yg(e, t, n) {
    var l = jr;
    if (l && typeof t == "string" && t) {
      var o = ut(t);
      o = 'link[rel="' + e + '"][href="' + o + '"]', typeof n == "string" && (o += '[crossorigin="' + n + '"]'), Gg.has(o) || (Gg.add(o), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(o) === null && (t = l.createElement("link"), Kt(t, "link", e), W(t), l.head.appendChild(t)));
    }
  }
  function WS(e) {
    Zl.D(e), Yg("dns-prefetch", e, null);
  }
  function ex(e, t) {
    Zl.C(e, t), Yg("preconnect", e, t);
  }
  function tx(e, t, n) {
    Zl.L(e, t, n);
    var l = jr;
    if (l && e && t) {
      var o = 'link[rel="preload"][as="' + ut(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (o += '[imagesrcset="' + ut(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (o += '[imagesizes="' + ut(
        n.imageSizes
      ) + '"]')) : o += '[href="' + ut(e) + '"]';
      var i = o;
      switch (t) {
        case "style":
          i = Ur(e);
          break;
        case "script":
          i = Hr(e);
      }
      if (!(kn.has(i) || (e = X(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), kn.set(i, e), l.querySelector(o) !== null || t === "style" && l.querySelector(Xi(i)) || t === "script" && l.querySelector(Qi(i))))) {
        var d = l.createElement("link");
        Kt(d, "link", e), t === "style" && (d[Wo] = !0, d.onload = d.onerror = function() {
          be(d);
        }), W(d), l.head.appendChild(d);
      }
    }
  }
  function nx(e, t) {
    Zl.m(e, t);
    var n = jr;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", o = 'link[rel="modulepreload"][as="' + ut(l) + '"][href="' + ut(e) + '"]', i = o;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Hr(e);
      }
      if (!kn.has(i) && (e = X({ rel: "modulepreload", href: e }, t), kn.set(i, e), n.querySelector(o) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Qi(i)))
              return;
        }
        l = n.createElement("link"), Kt(l, "link", e), W(l), n.head.appendChild(l);
      }
    }
  }
  function lx(e, t, n) {
    Zl.S(e, t, n);
    var l = jr;
    if (l && e) {
      var o = $(l).hoistableStyles, i = Ur(e);
      t = t || "default";
      var d = o.get(i);
      if (!d) {
        var g = { loading: 0, preload: null };
        if (d = l.querySelector(
          Xi(i)
        ))
          g.loading = 5;
        else {
          e = X(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = kn.get(i)) && Nd(e, n);
          var T = d = l.createElement("link");
          W(T), Kt(T, "link", e), T._p = new Promise(function(H, k) {
            T.onload = H, T.onerror = k;
          }), T.addEventListener("load", function() {
            g.loading |= 1;
          }), T.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, Tc(d, t, l);
        }
        d = {
          type: "stylesheet",
          instance: d,
          count: 1,
          state: g
        }, o.set(i, d);
      }
    }
  }
  function ax(e, t) {
    Zl.X(e, t);
    var n = jr;
    if (n && e) {
      var l = $(n).hoistableScripts, o = Hr(e), i = l.get(o);
      i || (i = n.querySelector(Qi(o)), i || (e = X({ src: e, async: !0 }, t), (t = kn.get(o)) && Dd(e, t), i = n.createElement("script"), W(i), Kt(i, "link", e), n.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(o, i));
    }
  }
  function ox(e, t) {
    Zl.M(e, t);
    var n = jr;
    if (n && e) {
      var l = $(n).hoistableScripts, o = Hr(e), i = l.get(o);
      i || (i = n.querySelector(Qi(o)), i || (e = X({ src: e, async: !0, type: "module" }, t), (t = kn.get(o)) && Dd(e, t), i = n.createElement("script"), W(i), Kt(i, "link", e), n.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, l.set(o, i));
    }
  }
  function qg(e, t, n, l) {
    var o = (o = ul.current) ? Ii(o) : null;
    if (!o) throw Error(u(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Ur(n.href), t = $(
          o
        ).hoistableStyles, l = t.get(n), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(n, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = Ur(n.href);
          var i = $(
            o
          ).hoistableStyles, d = i.get(e);
          if (d || (o = o.ownerDocument || o, d = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, d), (i = o.querySelector(
            Xi(e)
          )) ? i._p || (d.instance = i, d.state.loading = 5) : (i = kn.get(e), i || (i = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, kn.set(e, i)), rx(
            o,
            e,
            i,
            d.state
          ))), t && l === null)
            throw Error(u(528, ""));
          return d;
        }
        if (t && l !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Hr(n), t = $(
          o
        ).hoistableScripts, l = t.get(n), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(n, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(u(444, e));
    }
  }
  function Ur(e) {
    return 'href="' + ut(e) + '"';
  }
  function Xi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function kg(e) {
    return X({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function rx(e, t, n, l) {
    if (t = e.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[Wo] !== !0) {
        l.loading = 1;
        return;
      }
    } else
      t = e.createElement("link"), t[Wo] = !0, t.onload = t.onerror = be.bind(null, t), Kt(t, "link", n), W(t), e.head.appendChild(t);
    l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    });
  }
  function Hr(e) {
    return '[src="' + ut(e) + '"]';
  }
  function Qi(e) {
    return "script[async]" + e;
  }
  function Ig(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + ut(n.href) + '"]'
          );
          if (l)
            return t.instance = l, W(l), l;
          var o = X({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), W(l), Kt(l, "style", o), Tc(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          o = Ur(n.href);
          var i = e.querySelector(
            Xi(o)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, W(i), i;
          l = kg(n), (o = kn.get(o)) && Nd(l, o), i = (e.ownerDocument || e).createElement("link"), W(i);
          var d = i;
          return d._p = new Promise(function(g, T) {
            d.onload = g, d.onerror = T;
          }), Kt(i, "link", l), t.state.loading |= 4, Tc(i, n.precedence, e), t.instance = i;
        case "script":
          return i = Hr(n.src), (o = e.querySelector(
            Qi(i)
          )) ? (t.instance = o, W(o), o) : (l = n, (o = kn.get(i)) && (l = X({}, n), Dd(l, o)), e = e.ownerDocument || e, o = e.createElement("script"), W(o), Kt(o, "link", l), e.head.appendChild(o), t.instance = o);
        case "void":
          return null;
        default:
          throw Error(u(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Tc(l, n.precedence, e));
    return t.instance;
  }
  function Tc(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), o = l.length ? l[l.length - 1] : null, i = o, d = 0; d < l.length; d++) {
      var g = l[d];
      if (g.dataset.precedence === t) i = g;
      else if (i !== o) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Nd(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Dd(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Ac = null;
  function Xg(e, t, n) {
    if (Ac === null) {
      var l = /* @__PURE__ */ new Map(), o = Ac = /* @__PURE__ */ new Map();
      o.set(n, l);
    } else
      o = Ac, l = o.get(n), l || (l = /* @__PURE__ */ new Map(), o.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), o = 0; o < n.length; o++) {
      var i = n[o];
      if (!(i[to] || i[dt] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var d = i.getAttribute(t) || "";
        d = e + d;
        var g = l.get(d);
        g ? g.push(i) : l.set(d, [i]);
      }
    }
    return l;
  }
  function zd(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function ix(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Qg(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Zg(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Kg(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Pg(e, t) {
    typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Kg(t), e.suspenseyImages.push(t)), e = sx.bind(e), t.decode().then(e, e));
  }
  function ux(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var o = Ur(l.href), i = t.querySelector(
          Xi(o)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Zi.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = i, W(i);
          return;
        }
        i = t.ownerDocument || t, l = kg(l), (o = kn.get(o)) && Nd(l, o), i = i.createElement("link"), W(i);
        var d = i;
        d._p = new Promise(function(g, T) {
          d.onload = g, d.onerror = T;
        }), Kt(i, "link", l), n.instance = i;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = Zi.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var Oc = 0;
  function cx(e, t) {
    return e.stylesheets && e.count === 0 && Rc(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && Rc(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Oc === 0 && (Oc = 62500 * OS());
      var o = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Rc(e, e.stylesheets), e.unsuspend)) {
            var i = e.unsuspend;
            e.unsuspend = null, i();
          }
        },
        (e.imgBytes > Oc ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(o);
      };
    } : null;
  }
  function Fg(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) Rc(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        e.unsuspend = null, t();
      }
    }
  }
  function Zi() {
    this.count--, Fg(this);
  }
  function sx() {
    this.imgCount--, Fg(this);
  }
  var _c = null;
  function Rc(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, _c = /* @__PURE__ */ new Map(), t.forEach(fx, e), _c = null, Zi.call(e));
  }
  function fx(e, t) {
    if (!(t.state.loading & 4)) {
      var n = _c.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), _c.set(e, n);
        for (var o = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < o.length; i++) {
          var d = o[i];
          (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (n.set(d.dataset.precedence, d), l = d);
        }
        l && n.set(null, l);
      }
      o = t.instance, d = o.getAttribute("data-precedence"), i = n.get(d) || l, i === l && n.set(null, o), n.set(d, o), this.count++, l = Zi.bind(this), o.addEventListener("load", l), o.addEventListener("error", l), i ? i.parentNode.insertBefore(o, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(o, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Lr = {
    $$typeof: he,
    Provider: null,
    Consumer: null,
    _currentValue: je,
    _currentValue2: je,
    _threadCount: 0
  };
  function dx(e, t, n, l, o, i, d, g, T) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ko(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ko(0), this.hiddenUpdates = Ko(null), this.identifierPrefix = l, this.onUncaughtError = o, this.onCaughtError = i, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Jg(e, t, n, l, o, i, d, g, T, H, k, P) {
    return e = new dx(
      e,
      t,
      n,
      d,
      T,
      H,
      k,
      P,
      g
    ), t = 1, i === !0 && (t |= 24), i = fn(3, null, null, t), e.current = i, i.stateNode = e, t = Zs(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, Js(i), e;
  }
  function $g(e) {
    return e ? (e = cr, e) : cr;
  }
  function Wg(e, t, n, l, o, i) {
    o = $g(o), l.context === null ? l.context = o : l.pendingContext = o, l = xa(t), l.payload = { element: n }, i = i === void 0 ? null : i, i !== null && (l.callback = i), n = Ea(e, l, t), n !== null && (vn(n, e, t), wi(n, e, t));
  }
  function ep(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function jd(e, t) {
    ep(e, t), (e = e.alternate) && ep(e, t);
  }
  function tp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = so(e, 67108864);
      t !== null && vn(t, e, 67108864), jd(e, 67108864);
    }
  }
  function np(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = On();
      t = ca(t);
      var n = so(e, t);
      n !== null && vn(n, e, t), jd(e, t);
    }
  }
  var Br = !0;
  function mx(e, t, n, l) {
    var o = le.T;
    le.T = null;
    var i = re.p;
    try {
      re.p = 2, Ud(e, t, n, l);
    } finally {
      re.p = i, le.T = o;
    }
  }
  function hx(e, t, n, l) {
    var o = le.T;
    le.T = null;
    var i = re.p;
    try {
      re.p = 8, Ud(e, t, n, l);
    } finally {
      re.p = i, le.T = o;
    }
  }
  function Ud(e, t, n, l) {
    if (Br) {
      var o = Hd(l);
      if (o === null)
        gd(
          e,
          t,
          l,
          Mc,
          n
        ), ap(e, l);
      else if (gx(
        o,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (ap(e, l), t & 4 && -1 < vx.indexOf(e)) {
        for (; o !== null; ) {
          var i = no(o);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var d = Dl(i.pendingLanes);
                  if (d !== 0) {
                    var g = i;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; d; ) {
                      var T = 1 << 31 - zt(d);
                      g.entanglements[1] |= T, d &= ~T;
                    }
                    Sl(i), (Ze & 6) === 0 && (vc = en() + 500, Gi(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = so(i, 2), g !== null && vn(g, i, 2), yc(), jd(i, 2);
            }
          if (i = Hd(l), i === null && gd(
            e,
            t,
            l,
            Mc,
            n
          ), i === o) break;
          o = i;
        }
        o !== null && l.stopPropagation();
      } else
        gd(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function Hd(e) {
    return e = oo(e), Ld(e);
  }
  var Mc = null;
  function Ld(e) {
    if (Mc = null, e = Jn(e), e !== null) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (n === 31) {
          if (e = h(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Mc = e, null;
  }
  function lp(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (hu()) {
          case la:
            return 2;
          case Zo:
            return 8;
          case cn:
          case vu:
            return 32;
          case li:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Bd = !1, ja = null, Ua = null, Ha = null, Ki = /* @__PURE__ */ new Map(), Pi = /* @__PURE__ */ new Map(), La = [], vx = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ap(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ja = null;
        break;
      case "dragenter":
      case "dragleave":
        Ua = null;
        break;
      case "mouseover":
      case "mouseout":
        Ha = null;
        break;
      case "pointerover":
      case "pointerout":
        Ki.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pi.delete(t.pointerId);
    }
  }
  function Fi(e, t, n, l, o, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: i,
      targetContainers: [o]
    }, t !== null && (t = no(t), t !== null && tp(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function gx(e, t, n, l, o) {
    switch (t) {
      case "focusin":
        return ja = Fi(
          ja,
          e,
          t,
          n,
          l,
          o
        ), !0;
      case "dragenter":
        return Ua = Fi(
          Ua,
          e,
          t,
          n,
          l,
          o
        ), !0;
      case "mouseover":
        return Ha = Fi(
          Ha,
          e,
          t,
          n,
          l,
          o
        ), !0;
      case "pointerover":
        var i = o.pointerId;
        return Ki.set(
          i,
          Fi(
            Ki.get(i) || null,
            e,
            t,
            n,
            l,
            o
          )
        ), !0;
      case "gotpointercapture":
        return i = o.pointerId, Pi.set(
          i,
          Fi(
            Pi.get(i) || null,
            e,
            t,
            n,
            l,
            o
          )
        ), !0;
    }
    return !1;
  }
  function op(e) {
    var t = Jn(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, eo(e.priority, function() {
              np(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = h(n), t !== null) {
            e.blockedOn = t, eo(e.priority, function() {
              np(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Nc(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Hd(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        ao = l, n.target.dispatchEvent(l), ao = null;
      } else
        return t = no(n), t !== null && tp(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function rp(e, t, n) {
    Nc(e) && n.delete(t);
  }
  function px() {
    Bd = !1, ja !== null && Nc(ja) && (ja = null), Ua !== null && Nc(Ua) && (Ua = null), Ha !== null && Nc(Ha) && (Ha = null), Ki.forEach(rp), Pi.forEach(rp);
  }
  function Dc(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Bd || (Bd = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      px
    )));
  }
  var zc = null;
  function ip(e) {
    zc !== e && (zc = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        zc === e && (zc = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], o = e[t + 2];
          if (typeof l != "function") {
            if (Ld(l || n) === null)
              continue;
            break;
          }
          var i = no(n);
          i !== null && (e.splice(t, 3), t -= 3, bf(
            i,
            {
              pending: !0,
              data: o,
              method: n.method,
              action: l
            },
            l,
            o
          ));
        }
      }
    ));
  }
  function Vr(e) {
    function t(T) {
      return Dc(T, e);
    }
    ja !== null && Dc(ja, e), Ua !== null && Dc(Ua, e), Ha !== null && Dc(Ha, e), Ki.forEach(t), Pi.forEach(t);
    for (var n = 0; n < La.length; n++) {
      var l = La[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < La.length && (n = La[0], n.blockedOn === null); )
      op(n), n.blockedOn === null && La.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var o = n[l], i = n[l + 1], d = o[Yt] || null;
        if (typeof i == "function")
          d || ip(n);
        else if (d) {
          var g = null;
          if (i && i.hasAttribute("formAction")) {
            if (o = i, d = i[Yt] || null)
              g = d.formAction;
            else if (Ld(o) !== null) continue;
          } else g = d.action;
          typeof g == "function" ? n[l + 1] = g : (n.splice(l, 3), l -= 3), ip(n);
        }
      }
  }
  function up() {
    function e(i) {
      i.canIntercept && i.info === "react-transition" && i.intercept({
        handler: function() {
          return new Promise(function(d) {
            return o = d;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      o !== null && (o(), o = null), l || setTimeout(n, 20);
    }
    function n() {
      if (!l && !navigation.transition) {
        var i = navigation.currentEntry;
        i && i.url != null && navigation.navigate(i.url, {
          state: i.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, o = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), o !== null && (o(), o = null);
      };
    }
  }
  function Vd(e) {
    this._internalRoot = e;
  }
  jc.prototype.render = Vd.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    var n = t.current, l = On();
    Wg(n, l, e, t, null, null);
  }, jc.prototype.unmount = Vd.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Wg(e.current, 2, null, e, null, null), yc(), t[pn] = null;
    }
  };
  function jc(e) {
    this._internalRoot = e;
  }
  jc.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = jn();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < La.length && t !== 0 && t < La[n].priority; n++) ;
      La.splice(n, 0, e), n === 0 && op(e);
    }
  };
  var cp = r.version;
  if (cp !== "19.3.0")
    throw Error(
      u(
        527,
        cp,
        "19.3.0"
      )
    );
  re.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = b(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var yx = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: le,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Uc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Uc.isDisabled && Uc.supportsFiber)
      try {
        aa = Uc.inject(
          yx
        ), Ft = Uc;
      } catch {
      }
  }
  return $i.createRoot = function(e, t) {
    if (!s(e)) throw Error(u(299));
    var n = !1, l = "", o = $h, i = Wh, d = ev;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError)), t = Jg(
      e,
      1,
      !1,
      null,
      null,
      n,
      l,
      null,
      o,
      i,
      d,
      up
    ), e[pn] = t.current, vd(e), new Vd(t);
  }, $i.hydrateRoot = function(e, t, n) {
    if (!s(e)) throw Error(u(299));
    var l = !1, o = "", i = $h, d = Wh, g = ev, T = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onUncaughtError !== void 0 && (i = n.onUncaughtError), n.onCaughtError !== void 0 && (d = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), t = Jg(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      o,
      T,
      i,
      d,
      g,
      up
    ), t.context = $g(null), n = t.current, l = On(), l = ca(l), o = xa(l), o.callback = null, Ea(n, o, l), n = l, t.current.lanes = n, zl(t, n), Sl(t), e[pn] = t.current, vd(e), new jc(t);
  }, $i.version = "19.3.0", $i;
}
var Ep;
function Mx() {
  if (Ep) return kd.exports;
  Ep = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), kd.exports = Rx(), kd.exports;
}
var v2 = Mx();
const Nx = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Dx = (a) => a.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (r, c, u) => u ? u.toUpperCase() : c.toLowerCase()
), Cp = (a) => {
  const r = Dx(a);
  return r.charAt(0).toUpperCase() + r.slice(1);
}, g2 = (...a) => a.filter((r, c, u) => !!r && r.trim() !== "" && u.indexOf(r) === c).join(" ").trim(), zx = (a) => {
  for (const r in a)
    if (r.startsWith("aria-") || r === "role" || r === "title")
      return !0;
};
var jx = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Ux = y.forwardRef(
  ({
    color: a = "currentColor",
    size: r = 24,
    strokeWidth: c = 2,
    absoluteStrokeWidth: u,
    className: s = "",
    children: f,
    iconNode: m,
    ...h
  }, p) => y.createElement(
    "svg",
    {
      ref: p,
      ...jx,
      width: r,
      height: r,
      stroke: a,
      strokeWidth: u ? Number(c) * 24 / Number(r) : c,
      className: g2("lucide", s),
      ...!f && !zx(h) && { "aria-hidden": "true" },
      ...h
    },
    [
      ...m.map(([b, x]) => y.createElement(b, x)),
      ...Array.isArray(f) ? f : [f]
    ]
  )
);
const Xa = (a, r) => {
  const c = y.forwardRef(
    ({ className: u, ...s }, f) => y.createElement(Ux, {
      ref: f,
      iconNode: r,
      className: g2(
        `lucide-${Nx(Cp(a))}`,
        `lucide-${a}`,
        u
      ),
      ...s
    })
  );
  return c.displayName = Cp(a), c;
};
const Hx = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Lx = Xa("check", Hx);
const Bx = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Vx = Xa("chevron-down", Bx);
const Gx = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
], Yx = Xa("funnel", Gx);
const qx = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], kx = Xa("info", qx);
const Ix = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], Xx = Xa("moon", Ix);
const Qx = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], wp = Xa("search", Qx);
const Zx = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], Kx = Xa("sun", Zx);
const Px = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], p2 = Xa("x", Px);
function y2(a) {
  var r, c, u = "";
  if (typeof a == "string" || typeof a == "number") u += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var s = a.length;
    for (r = 0; r < s; r++) a[r] && (c = y2(a[r])) && (u && (u += " "), u += c);
  } else for (c in a) a[c] && (u && (u += " "), u += c);
  return u;
}
function b2() {
  for (var a, r, c = 0, u = "", s = arguments.length; c < s; c++) (a = arguments[c]) && (r = y2(a)) && (u && (u += " "), u += r);
  return u;
}
const Tp = (a) => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a, Ap = b2, S2 = (a, r) => (c) => {
  var u;
  if (r?.variants == null) return Ap(a, c?.class, c?.className);
  const { variants: s, defaultVariants: f } = r, m = Object.keys(s).map((b) => {
    const x = c?.[b], v = f?.[b];
    if (x === null) return null;
    const S = Tp(x) || Tp(v);
    return s[b][S];
  }), h = c && Object.entries(c).reduce((b, x) => {
    let [v, S] = x;
    return S === void 0 || (b[v] = S), b;
  }, {}), p = r == null || (u = r.compoundVariants) === null || u === void 0 ? void 0 : u.reduce((b, x) => {
    let { class: v, className: S, ...A } = x;
    return Object.entries(A).every((O) => {
      let [w, C] = O;
      return Array.isArray(C) ? C.includes({
        ...f,
        ...h
      }[w]) : {
        ...f,
        ...h
      }[w] === C;
    }) ? [
      ...b,
      v,
      S
    ] : b;
  }, []);
  return Ap(a, m, p, c?.class, c?.className);
}, Fx = (a, r) => {
  const c = new Array(a.length + r.length);
  for (let u = 0; u < a.length; u++)
    c[u] = a[u];
  for (let u = 0; u < r.length; u++)
    c[a.length + u] = r[u];
  return c;
}, Jx = (a, r) => ({
  classGroupId: a,
  validator: r
}), x2 = (a = /* @__PURE__ */ new Map(), r = null, c) => ({
  nextPart: a,
  validators: r,
  classGroupId: c
}), Jc = "-", Op = [], $x = "arbitrary..", Wx = (a) => {
  const r = tE(a), {
    conflictingClassGroups: c,
    conflictingClassGroupModifiers: u
  } = a;
  return {
    getClassGroupId: (m) => {
      if (m.startsWith("[") && m.endsWith("]"))
        return eE(m);
      const h = m.split(Jc), p = h[0] === "" && h.length > 1 ? 1 : 0;
      return E2(h, p, r);
    },
    getConflictingClassGroupIds: (m, h) => {
      if (h) {
        const p = u[m], b = c[m];
        return p ? b ? Fx(b, p) : p : b || Op;
      }
      return c[m] || Op;
    }
  };
}, E2 = (a, r, c) => {
  if (a.length - r === 0)
    return c.classGroupId;
  const s = a[r], f = c.nextPart.get(s);
  if (f) {
    const b = E2(a, r + 1, f);
    if (b) return b;
  }
  const m = c.validators;
  if (m === null)
    return;
  const h = r === 0 ? a.join(Jc) : a.slice(r).join(Jc), p = m.length;
  for (let b = 0; b < p; b++) {
    const x = m[b];
    if (x.validator(h))
      return x.classGroupId;
  }
}, eE = (a) => a.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = a.slice(1, -1), c = r.indexOf(":"), u = r.slice(0, c);
  return u ? $x + u : void 0;
})(), tE = (a) => {
  const {
    theme: r,
    classGroups: c
  } = a;
  return nE(c, r);
}, nE = (a, r) => {
  const c = x2();
  for (const u in a) {
    const s = a[u];
    Lm(s, c, u, r);
  }
  return c;
}, Lm = (a, r, c, u) => {
  const s = a.length;
  for (let f = 0; f < s; f++) {
    const m = a[f];
    lE(m, r, c, u);
  }
}, lE = (a, r, c, u) => {
  if (typeof a == "string") {
    aE(a, r, c);
    return;
  }
  if (typeof a == "function") {
    oE(a, r, c, u);
    return;
  }
  rE(a, r, c, u);
}, aE = (a, r, c) => {
  const u = a === "" ? r : C2(r, a);
  u.classGroupId = c;
}, oE = (a, r, c, u) => {
  if (iE(a)) {
    Lm(a(u), r, c, u);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(Jx(c, a));
}, rE = (a, r, c, u) => {
  const s = Object.entries(a), f = s.length;
  for (let m = 0; m < f; m++) {
    const [h, p] = s[m];
    Lm(p, C2(r, h), c, u);
  }
}, C2 = (a, r) => {
  let c = a;
  const u = r.split(Jc), s = u.length;
  for (let f = 0; f < s; f++) {
    const m = u[f];
    let h = c.nextPart.get(m);
    h || (h = x2(), c.nextPart.set(m, h)), c = h;
  }
  return c;
}, iE = (a) => "isThemeGetter" in a && a.isThemeGetter === !0, uE = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, c = /* @__PURE__ */ Object.create(null), u = /* @__PURE__ */ Object.create(null);
  const s = (f, m) => {
    c[f] = m, r++, r > a && (r = 0, u = c, c = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(f) {
      let m = c[f];
      if (m !== void 0)
        return m;
      if ((m = u[f]) !== void 0)
        return s(f, m), m;
    },
    set(f, m) {
      f in c ? c[f] = m : s(f, m);
    }
  };
}, dm = "!", _p = ":", cE = [], Rp = (a, r, c, u, s) => ({
  modifiers: a,
  hasImportantModifier: r,
  baseClassName: c,
  maybePostfixModifierPosition: u,
  isExternal: s
}), sE = (a) => {
  const {
    prefix: r,
    experimentalParseClassName: c
  } = a;
  let u = (s) => {
    const f = [];
    let m = 0, h = 0, p = 0, b;
    const x = s.length;
    for (let w = 0; w < x; w++) {
      const C = s[w];
      if (m === 0 && h === 0) {
        if (C === _p) {
          f.push(s.slice(p, w)), p = w + 1;
          continue;
        }
        if (C === "/") {
          b = w;
          continue;
        }
      }
      C === "[" ? m++ : C === "]" ? m-- : C === "(" ? h++ : C === ")" && h--;
    }
    const v = f.length === 0 ? s : s.slice(p);
    let S = v, A = !1;
    v.endsWith(dm) ? (S = v.slice(0, -1), A = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      v.startsWith(dm) && (S = v.slice(1), A = !0)
    );
    const O = b && b > p ? b - p : void 0;
    return Rp(f, A, S, O);
  };
  if (r) {
    const s = r + _p, f = u;
    u = (m) => m.startsWith(s) ? f(m.slice(s.length)) : Rp(cE, !1, m, void 0, !0);
  }
  if (c) {
    const s = u;
    u = (f) => c({
      className: f,
      parseClassName: s
    });
  }
  return u;
}, fE = (a) => {
  const r = /* @__PURE__ */ new Map();
  return a.orderSensitiveModifiers.forEach((c, u) => {
    r.set(c, 1e6 + u);
  }), (c) => {
    const u = [];
    let s = [];
    for (let f = 0; f < c.length; f++) {
      const m = c[f], h = m[0] === "[", p = r.has(m);
      h || p ? (s.length > 0 && (s.sort(), u.push(...s), s = []), u.push(m)) : s.push(m);
    }
    return s.length > 0 && (s.sort(), u.push(...s)), u;
  };
}, dE = (a) => ({
  cache: uE(a.cacheSize),
  parseClassName: sE(a),
  sortModifiers: fE(a),
  postfixLookupClassGroupIds: mE(a),
  ...Wx(a)
}), mE = (a) => {
  const r = /* @__PURE__ */ Object.create(null), c = a.postfixLookupClassGroups;
  if (c)
    for (let u = 0; u < c.length; u++)
      r[c[u]] = !0;
  return r;
}, hE = /\s+/, vE = (a, r) => {
  const {
    parseClassName: c,
    getClassGroupId: u,
    getConflictingClassGroupIds: s,
    sortModifiers: f,
    postfixLookupClassGroupIds: m
  } = r, h = [], p = a.trim().split(hE);
  let b = "";
  for (let x = p.length - 1; x >= 0; x -= 1) {
    const v = p[x], {
      isExternal: S,
      modifiers: A,
      hasImportantModifier: O,
      baseClassName: w,
      maybePostfixModifierPosition: C
    } = c(v);
    if (S) {
      b = v + (b.length > 0 ? " " + b : b);
      continue;
    }
    let _ = !!C, D;
    if (_) {
      const X = w.substring(0, C);
      D = u(X);
      const L = D && m[D] ? u(w) : void 0;
      L && L !== D && (D = L, _ = !1);
    } else
      D = u(w);
    if (!D) {
      if (!_) {
        b = v + (b.length > 0 ? " " + b : b);
        continue;
      }
      if (D = u(w), !D) {
        b = v + (b.length > 0 ? " " + b : b);
        continue;
      }
      _ = !1;
    }
    const j = A.length === 0 ? "" : A.length === 1 ? A[0] : f(A).join(":"), M = O ? j + dm : j, Y = M + D;
    if (h.indexOf(Y) > -1)
      continue;
    h.push(Y);
    const I = s(D, _);
    for (let X = 0; X < I.length; ++X) {
      const L = I[X];
      h.push(M + L);
    }
    b = v + (b.length > 0 ? " " + b : b);
  }
  return b;
}, gE = (...a) => {
  let r = 0, c, u, s = "";
  for (; r < a.length; )
    (c = a[r++]) && (u = w2(c)) && (s && (s += " "), s += u);
  return s;
}, w2 = (a) => {
  if (typeof a == "string")
    return a;
  let r, c = "";
  for (let u = 0; u < a.length; u++)
    a[u] && (r = w2(a[u])) && (c && (c += " "), c += r);
  return c;
}, pE = (a, ...r) => {
  let c, u, s, f;
  const m = (p) => {
    const b = r.reduce((x, v) => v(x), a());
    return c = dE(b), u = c.cache.get, s = c.cache.set, f = h, h(p);
  }, h = (p) => {
    const b = u(p);
    if (b)
      return b;
    const x = vE(p, c);
    return s(p, x), x;
  };
  return f = m, (...p) => f(gE(...p));
}, yE = [], Nt = (a) => {
  const r = (c) => c[a] || yE;
  return r.isThemeGetter = !0, r.themeKey = a, r;
}, T2 = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, A2 = /^\((?:(\w[\w-]*):)?(.+)\)$/i, bE = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, SE = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, xE = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, EE = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, CE = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, wE = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Va = (a) => bE.test(a), He = (a) => !!a && !Number.isNaN(Number(a)), xl = (a) => !!a && Number.isInteger(Number(a)), Zd = (a) => a.endsWith("%") && He(a.slice(0, -1)), Kl = (a) => SE.test(a), O2 = () => !0, TE = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  xE.test(a) && !EE.test(a)
), Bm = () => !1, AE = (a) => CE.test(a), OE = (a) => wE.test(a), _E = (a) => !ve(a) && !pe(a), RE = (a) => a.startsWith("@container") && (a[10] === "/" && a[11] !== void 0 || a[11] === "s" && a[16] !== void 0 && a.startsWith("-size/", 10) || a[11] === "n" && a[18] !== void 0 && a.startsWith("-normal/", 10)), ME = (a) => Qa(a, M2, Bm), ve = (a) => T2.test(a), Ro = (a) => Qa(a, N2, TE), Mp = (a) => Qa(a, BE, He), NE = (a) => Qa(a, z2, O2), DE = (a) => Qa(a, D2, Bm), Np = (a) => Qa(a, _2, Bm), zE = (a) => Qa(a, R2, OE), Hc = (a) => Qa(a, j2, AE), pe = (a) => A2.test(a), Wi = (a) => Lo(a, N2), jE = (a) => Lo(a, D2), Dp = (a) => Lo(a, _2), UE = (a) => Lo(a, M2), HE = (a) => Lo(a, R2), Lc = (a) => Lo(a, j2, !0), LE = (a) => Lo(a, z2, !0), Qa = (a, r, c) => {
  const u = T2.exec(a);
  return u ? u[1] ? r(u[1]) : c(u[2]) : !1;
}, Lo = (a, r, c = !1) => {
  const u = A2.exec(a);
  return u ? u[1] ? r(u[1]) : c : !1;
}, _2 = (a) => a === "position" || a === "percentage", R2 = (a) => a === "image" || a === "url", M2 = (a) => a === "length" || a === "size" || a === "bg-size", N2 = (a) => a === "length", BE = (a) => a === "number", D2 = (a) => a === "family-name", z2 = (a) => a === "number" || a === "weight", j2 = (a) => a === "shadow", VE = () => {
  const a = Nt("color"), r = Nt("font"), c = Nt("text"), u = Nt("font-weight"), s = Nt("tracking"), f = Nt("leading"), m = Nt("breakpoint"), h = Nt("container"), p = Nt("spacing"), b = Nt("radius"), x = Nt("shadow"), v = Nt("inset-shadow"), S = Nt("text-shadow"), A = Nt("drop-shadow"), O = Nt("blur"), w = Nt("perspective"), C = Nt("aspect"), _ = Nt("ease"), D = Nt("animate"), j = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], M = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], Y = () => [...M(), pe, ve], I = () => ["auto", "hidden", "clip", "visible", "scroll"], X = () => ["auto", "contain", "none"], L = () => [pe, ve, p], F = () => [Va, "full", "auto", ...L()], ae = () => [xl, "none", "subgrid", pe, ve], ie = () => ["auto", {
    span: ["full", xl, pe, ve]
  }, xl, pe, ve], ee = () => [xl, "auto", pe, ve], fe = () => ["auto", "min", "max", "fr", pe, ve], ge = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], he = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], Q = () => ["auto", ...L()], J = () => [Va, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...L()], te = () => [h, Va, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...L()], de = () => [Va, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...L()], G = () => [a, pe, ve], Ye = () => [...M(), Dp, Np, {
    position: [pe, ve]
  }], De = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], qe = () => ["auto", "cover", "contain", UE, ME, {
    size: [pe, ve]
  }], R = () => [Zd, Wi, Ro], Z = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    b,
    pe,
    ve
  ], oe = () => ["", He, Wi, Ro], se = () => ["solid", "dashed", "dotted", "double"], ne = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ue = () => [He, Zd, Dp, Np], xe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    O,
    pe,
    ve
  ], le = () => ["none", He, pe, ve], re = () => ["none", He, pe, ve], je = () => [He, pe, ve], pt = () => [Va, "full", ...L()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Kl],
      breakpoint: [Kl],
      color: [O2],
      container: [Kl],
      "drop-shadow": [Kl],
      ease: ["in", "out", "in-out"],
      font: [_E],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Kl],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Kl],
      shadow: [Kl],
      spacing: ["px", He],
      text: [Kl],
      "text-shadow": [Kl],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Va, ve, pe, C]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", pe, ve]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [RE],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [He, "auto", ve, pe, h]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": j()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": j()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: Y()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: I()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": I()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": I()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: X()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": X()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": X()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: F()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": F()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": F()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": F(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: F()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": F(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: F()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": F()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": F()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: F()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: F()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: F()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: F()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [xl, "auto", pe, ve]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Va, "full", "auto", h, ...L()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [He, Va, "auto", "initial", "none", ve]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", He, pe, ve]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", He, pe, ve]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [xl, "first", "last", "none", pe, ve]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": ae()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ie()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ee()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ee()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": ae()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ie()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ee()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ee()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": fe()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": fe()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: L()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": L()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": L()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ge(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...he(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...he()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ge()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...he(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...he(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ge()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...he(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...he()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: L()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: L()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: L()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: L()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: L()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: L()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: L()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: L()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: L()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: L()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: L()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: Q()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: Q()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: Q()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: Q()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: Q()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: Q()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: Q()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: Q()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: Q()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: Q()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: Q()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": L()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": L()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: J()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...te()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...te()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...te()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...de()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...de()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...de()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [h, "screen", ...J()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          h,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...J()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          h,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [m]
          },
          ...J()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...J()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...J()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ...J()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", c, Wi, Ro]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [u, LE, NE]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Zd, ve]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [jE, DE, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [ve]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [s, pe, ve]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [He, "none", pe, Mp]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          f,
          ...L()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", pe, ve]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", pe, ve]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: G()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: G()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...se(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [He, "from-font", "auto", pe, Ro]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: G()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [He, "auto", pe, ve]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: L()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [xl, pe, ve]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", pe, ve]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", pe, ve]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Ye()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: De()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: qe()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, xl, pe, ve],
          radial: ["", pe, ve],
          conic: ["", xl, pe, ve]
        }, HE, zE]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: G()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: R()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: R()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: R()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: G()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: G()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: G()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: Z()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": Z()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": Z()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": Z()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": Z()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": Z()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": Z()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": Z()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": Z()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": Z()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": Z()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": Z()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": Z()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": Z()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": Z()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: oe()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": oe()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": oe()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": oe()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": oe()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": oe()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": oe()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": oe()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": oe()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": oe()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": oe()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": oe()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": oe()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...se(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...se(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: G()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": G()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": G()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": G()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": G()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": G()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": G()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": G()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": G()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": G()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": G()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: G()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...se(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [He, pe, ve]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", He, Wi, Ro]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: G()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          // Deprecated since Tailwind CSS v4.0.0
          "inner",
          "none",
          x,
          Lc,
          Hc
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: G()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", v, Lc, Hc]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": G()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: oe()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: G()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [He, Ro]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": G()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": oe()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": G()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", S, Lc, Hc]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": G()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [He, pe, ve]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ne(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ne()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [He]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ue()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ue()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": G()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": G()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ue()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ue()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": G()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": G()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ue()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ue()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": G()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": G()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ue()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ue()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": G()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": G()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ue()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ue()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": G()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": G()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ue()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ue()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": G()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": G()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ue()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ue()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": G()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": G()
      }],
      "mask-image-radial": [{
        "mask-radial": [pe, ve]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ue()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ue()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": G()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": G()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": M()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [He]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ue()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ue()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": G()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": G()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Ye()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: De()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: qe()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", pe, ve]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          pe,
          ve
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: xe()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [He, pe, ve]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [He, pe, ve]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          A,
          Lc,
          Hc
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": G()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", He, pe, ve]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [He, pe, ve]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", He, pe, ve]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [He, pe, ve]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", He, pe, ve]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          pe,
          ve
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": xe()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [He, pe, ve]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [He, pe, ve]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", He, pe, ve]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [He, pe, ve]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", He, pe, ve]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [He, pe, ve]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [He, pe, ve]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", He, pe, ve]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": L()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": L()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": L()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", pe, ve]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [He, "initial", pe, ve]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", _, pe, ve]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [He, pe, ve]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", D, pe, ve]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [w, pe, ve]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": Y()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: le()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": le()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": le()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": le()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: re()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": re()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": re()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": re()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: je()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": je()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": je()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [pe, ve, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: Y()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: pt()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": pt()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": pt()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": pt()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [xl, pe, ve]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: G()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: G()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", pe, ve]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": G()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": G()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": L()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": L()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": L()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": L()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": L()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": L()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": L()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": L()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": L()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": L()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": L()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": L()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": L()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": L()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": L()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": L()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": L()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": L()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": L()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": L()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": L()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": L()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", pe, ve]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...G()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [He, Wi, Ro, Mp]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...G()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["start", "end", "right", "left"],
      "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["ps", "pe", "pr", "pl"],
      py: ["pbs", "pbe", "pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["ms", "me", "mr", "ml"],
      my: ["mbs", "mbe", "mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
      "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-s", "border-color-e", "border-color-r", "border-color-l"],
      "border-color-y": ["border-color-bs", "border-color-be", "border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, GE = /* @__PURE__ */ pE(VE);
function Mn(...a) {
  return GE(b2(a));
}
const YE = S2(
  "inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--foreground)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--muted)]",
        outline: "bg-[var(--background)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Kd({
  className: a,
  variant: r,
  ...c
}) {
  return /* @__PURE__ */ E.jsx(
    "span",
    {
      "data-slot": "badge",
      className: Mn(YE({ variant: r, className: a })),
      ...c
    }
  );
}
const U2 = 48, Rl = (a, r = 0) => {
  const c = new Int32Array(a.length);
  for (let u = 0; u < a.length; u++) c[u] = a.charCodeAt(u) - U2 - r;
  return c;
}, as = (a) => {
  const r = new Int32Array(a.length + 1);
  for (let c = 0; c < a.length; c++) r[c + 1] = r[c] + a[c];
  return r;
}, qa = (a) => {
  const r = new Int32Array(a.length);
  let c = 0;
  for (let u = 0; u < a.length; u++) {
    const s = a.charCodeAt(u) - U2;
    c += s >>> 1 ^ -(s & 1), r[u] = c;
  }
  return r;
}, qE = 384, kE = [], Do = as(Rl("E0500002005282000000002000150000020021820000011200000003022202000300004200120000200420001200021200301200010400162000010000220021010:2192001200220012000220012000200200200400010200040000000000400200108200110100000022010313000162002000020020012020080213000228200000000082000000000120002000120020020040101020300130001001010")), IE = as(Rl(":11111111211111119311546544411119731869:671397415686432441111111111161114151214313433415:78311132233313187211117221449443411141111151152226611131111112212518142224214215421421542142424242516171151615616347111111111197911327451111111111111111111113134714133513411111311111111111111111111112444411111342312715245411117:3")), XE = "@containerabcdefghinlmoprstunderlineviawzccentlignnimatespectuto-colsrowsaglorightnessckdrop-sisbcontrastfiltergrayscalehue-rotateinvertopacityslurrightnessaturateepia-coniclinearpositionradialsizeockurrderttom-belrstxyespacing-xyaretoursorlnt-umnsendspantartainentrasteividerop-shadowurationcorationlay-xyasendillexontromlter-featuresstretchapr-xyayscaleidow-colsrowsue-rotatedentlinesetvert-beringsxyeshadoweiadingftnest-clamp-imageabein-lrstxyskx--b-coniclpositionrsizet-x-y-fromto-fromto-inearfromto-fromto-adialfromto-fromtofromtofromtofromtoblockhinlinew-screenesblockhinlinewbjectpacityrutlinederigin-offsetbelrstxyesrspective-originaceholderioghtng-offsettateundedw-xyz-belrstlreseslr-endspantartaturatecepiahizekewpace-taleroll-xyz-barmpbelrstxyesbelrstxyes-thumbrackadowrink-xyxyartrokeabextora-shadowpckingnsformitionlate-xyz-offsetill-changeoom", QE = (() => {
  const a = Do.length - 1, r = new Int32Array(a);
  for (let s = a - 1; s >= 0; s--) {
    let f = 1, m = s + 1;
    for (let h = Do[s]; h < Do[s + 1]; h++)
      f += r[m], m += r[m];
    r[s] = f;
  }
  const c = new Int32Array(Do[a]);
  let u = 0;
  for (let s = 0; s < a; s++) {
    let f = s + 1;
    for (let m = Do[s]; m < Do[s + 1]; m++)
      c[u++] = f, f += r[f];
  }
  return c;
})(), ZE = Rl("02000000000000900<=0?000B000F00F00ŏI0J0LNPRTVX0000]_a00000000000000000000000rst0000000zŏ00000000000ŏ0000000ŏ00000000000000000000000000000000000000000000000000000000000000Ë000000000000000000000Þ000000000000000000ð0000000ø0ùúûüýþÿĀāĂăĄąĆ000000000000000000000000000000000000000000ħ0ĨĪ00000000000000000000ļĽ00000Ŭ000000", 1), KE = as(Rl("123333359346463635126536711576")), PE = Rl("93203242332583253248325D>E?F@03263243255B:032523853:0325B:8GA032542H<C=12727B:0328432553;D>E?3257D>032585:0325B:;0328B:032"), FE = Rl("012113445661666666789111:5;;;;;;;;444;;;:62999<1161=62>>?61:21@ABCD4446996:64E:::;:?::64:F114GHHIHHHHIHH1HH1HH1HHHHHH::EEJ4444::EE4444441691;644444114244444:;K6666555555555555555999666664444444444444444444444226?6:66644L9M?D:111::::6DE199"), JE = qa("020200202020020020020020020020200200200200200200200002020202001003040106000200200200200200200200200200200200200200200200200200200200200200200200200200200200020020020020020020002020200202002002002002002002002002002020002002020020200220200200200200200200200200200200020020020000200020002000200200200020020020002000200200200020020202002020202000200200020022000200200020020002002000200220002002000200W0Z00020020002002020002002000200g0j0002002000200200020020002002000200200020020002000200002000002002002002002000200020000200002002002002002002002020020020200200200200200200200200202020020020020020020020020002002002020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020020002002002002002002000200200200200200200200200200020202020002000200020002002002002000020200200"), $E = (() => {
  const a = (/* @__PURE__ */ new Int32Array(319)).fill(-1), r = qa("02422242:222222242224222242442222222422222244442242226224222426222422442462222422622222222626222462242622422622422424242422222222422222222242422222222222222222622442224222222222222224424442262222222222222222222226224222424242422224422422422222"), c = qa("02222222222222222222202222222222222222222222221422222222222222222222222222222222222Y\\222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222221422222222222222222222222222222222222222Ŀł222222222222222222");
  for (let u = 0; u < r.length; u++) a[r[u]] = c[u];
  return a;
})(), WE = "container |break-after- all auto avoid avoid-page column left page right|break-before- all auto avoid avoid-page column left page right|break-inside-a uto void void-column void-page|box-decoration- clone slice|box- border content| contents flow-root hidden table table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group| not-sr-only sr-only|float- end left none right start|clear- both end left none right start|isolat e ion-auto|overflow- auto clip hidden scroll visible|overflow-x- auto clip hidden scroll visible|overflow-y- auto clip hidden scroll visible|overscroll- auto contain none|overscroll-x- auto contain none|overscroll-y- auto contain none| absolute fixed relative static sticky| collapse invisible visible|justify- around baseline between center center-safe end end-safe evenly normal start stretch|justify-items- center center-safe end end-safe normal start stretch|justify-self- auto center center-safe end end-safe start stretch|items- baseline baseline-last center center-safe end end-safe start stretch|self- auto baseline baseline-last center center-safe end end-safe start stretch|place-content- around baseline between center center-safe end end-safe evenly start stretch|place-items- baseline center center-safe end end-safe start stretch|place-self- auto center center-safe end end-safe start stretch| antialiased subpixel-antialiased| italic not-italic|normal-nums |ordinal |slashed-zero | lining-nums oldstyle-nums| proportional-nums tabular-nums| diagonal-fractions stacked-fractions| no-underline overline| capitalize lowercase normal-case uppercase|truncate |whitespace- break-spaces normal nowrap pre pre-line pre-wrap|break- all keep normal words|wrap- anywhere break-word normal|hyphens- auto manual none|mix-blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay plus-darker plus-lighter saturation screen soft-light|table- auto fixed|caption- bottom top|backface- hidden visible|appearance- auto none|scheme- dark light light-dark normal only-dark only-light|field-sizing- content fixed|pointer-events- auto none|resize  -none -x -y|snap- align-none center end start|snap- always normal|snap- both none x y|snap- mandatory proximity|touch- auto manipulation none|touch-pan- left right x|touch-pan- down up y|touch-pinch-zoom |select- all auto none text|forced-color-adjust- auto none| normal size| baseline bottom middle sub super text-bottom text-top top| bounce none ping pulse spin| auto square video| auto fr max min px|none | auto full px| fixed local scroll|clip- border content padding text|origin- border content padding| bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| no-repeat repeat repeat-round repeat-space repeat-x repeat-y| auto contain cover| gradient-to-b gradient-to-bl gradient-to-br gradient-to-l gradient-to-r gradient-to-t gradient-to-tl gradient-to-tr none|blend- color color-burn color-dodge darken difference exclusion hard-light hue lighten luminosity multiply normal overlay saturation screen soft-light|to- b bl br l r t tl tr| auto dvh fit full lh lvh max min px screen svh| dashed dotted double hidden none solid| collapse separate|px |auto |full | content none strict| inline-size size|layout |paint |style | around baseline between center center-safe end end-safe evenly normal start stretch| alias all-scroll auto cell col-resize context-menu copy crosshair default e-resize ew-resize grab grabbing help move n-resize ne-resize nesw-resize no-drop none not-allowed ns-resize nw-resize nwse-resize pointer progress row-resize s-resize se-resize sw-resize text vertical-text w-resize wait zoom-in zoom-out| dashed dotted double solid wavy| auto from-font|reverse |initial | in in-out initial linear out| col col-reverse row row-reverse| nowrap wrap wrap-reverse| auto initial none| black bold extrabold extralight light medium normal semibold thin| condensed expanded extra-condensed extra-expanded normal semi-condensed semi-expanded ultra-condensed ultra-expanded|flow- col col-dense dense row row-dense| none subgrid| auto dvh dvw fit full lh lvh lvw max min px screen svh svw| block flex grid table| auto dvw fit full lvw max min px screen svw| loose none normal px relaxed snug tight|through |item | inside outside| decimal disc none| auto px| clip-border clip-content clip-fill clip-padding clip-stroke clip-view no-clip| add exclude intersect subtract| alpha luminance match|origin- border content fill padding stroke view|type- alpha luminance| circle ellipse| closest-corner closest-side farthest-corner farthest-side|at- bottom bottom-left bottom-right center left left-bottom left-top right right-bottom right-top top top-left top-right| dvh fit full lh lvh max min none px screen svh| auto dvh dvw fit full lh lvh lvw max min none px screen svh svw| dvw fit full lvw max min none px screen svw| auto dvh dvw fit full lvh lvw max min none prose px svh svw| auto dvh dvw fit full lvh lvw max min none px screen svh svw| contain cover fill none scale-down| first last none| distant dramatic midrange near none normal|inset | full none|3d | auto smooth|gutter- auto both stable| auto none thin| inner none| auto dvh dvw fit full lvh lvw max min px svh svw|base | center end justify left right start| clip ellipsis| balance nowrap pretty wrap| normal tight tighter wide wider widest| cpu gpu none| 3d flat| all colors none opacity shadow transform| discrete normal| full px| auto dvh dvw fit full lvh lvw max min px screen svh svw| auto contents scroll transform".split("|").map((a) => {
  const r = a.split(" "), c = r.shift();
  for (let u = 0; u < r.length; u++) r[u] = c + r[u];
  return r;
}), zp = qa("0000000000000000000000000000000000000000000000000000000000000262242:6@200000006:240B428:4422400002046044222426220026642642462026224222824220022400000000\\00N222422242222222224062242222222422226264222422222222222222442804222422222222222222222222220<4<0204260002444020204224422"), eC = qa("ɠ222222222222222222222222222222222222222222222222222222222222˕4222226>ʶ22ʷʺʷ2ʸʷ42ʴ2ʓ22>621422ɶ222ɹɼɷɺɷɺ22ɱ42222ɨ2ɧ26622ɘɓ244ƸƵ222]d24242ǖǓƚÄȫ2263ȨȥȨ2222222ǣ222222222222222222ǂƽ2ƾƵ2222222422222ƜƑ22222222222222222222144Ŧţ22Ţş222222222222222222222ĸ2ı68ĦģĦɡŰ4Ġ«®ĝ822ĔđĔ2ē2222622"), tC = qa("02222222222222222222222222222222222222222222222222222222222222222202022222222222EH2200IL021042222Y\\222IL0cf2e10j2222U00X202[^2y0000120|{~22:22|22222222222G000qOVI00000}2>40000B00000I¨©000¬00000000000000021M®­00°000000000000000000000222HGHa1º222¿2À2222ÉÌ000­°2±"), H2 = /* @__PURE__ */ new Int32Array(995), L2 = /* @__PURE__ */ new Int32Array(995), B2 = /* @__PURE__ */ new Int32Array(995);
let mm = "";
const hm = /* @__PURE__ */ new Int32Array(1038);
{
  const a = /* @__PURE__ */ new Map();
  let r = 0, c = 0;
  for (let u = 0; u < zp.length; u++) for (const s of WE[tC[u]]) {
    let f = a.get(s);
    f === void 0 && (f = r++, a.set(s, f), hm[f * 2] = mm.length, hm[f * 2 + 1] = s.length, mm += s), H2[c] = zp[u], L2[c] = eC[u], B2[c] = f, c++;
  }
}
const nC = qa("0b2N:222@R>F@286¦2@H2D266226FB22B2>BD\\6N22222Z222D222p"), lC = as(Rl("1::24444432:442:44:44>222222:44:4421322511111311111114")), aC = qa("24A;33N=C@H4A;33N=C@<27;83:;8393NQ:3NQʰ222ˉºŴŽ2R2=18cƴÅŇ=cĞÛC1ƈǝȈ:ħ25=11D3A@4=<1;1DEr25;11B3?<6;:371BCn9@7=<8192>2E121@9@EHE@9>2T25511<398454131<=V25511<398454131<=ƧNž2Đå242L222290000f22500ɛ000ǘ222"), oC = Rl("ĳ"), rC = Rl(""), iC = Rl("1"), uC = "* ** after backdrop before details-content file first-letter first-line marker placeholder selection";
var cC = {
  GROUP_COUNT: qE,
  customValidatorNames: kE,
  edgeStart: Do,
  labelStart: IE,
  labelText: XE,
  edgeTarget: QE,
  nodeGroup: ZE,
  nodeVlist: $E,
  vlistPat: KE,
  vlistOps: PE,
  vlistRef: FE,
  vlistGroup: JE,
  litAnchor: H2,
  litGroup: L2,
  litPool: B2,
  poolOffsets: hm,
  poolText: mm,
  adjGid: nC,
  adjStart: lC,
  adjTgt: aC,
  patGid: oC,
  patTgt: rC,
  postfixLookupGroups: iC,
  orderSensitiveModifiers: uC
};
const sC = "line" in /* @__PURE__ */ new Error(), El = -1, Mo = -1, Pd = (a, r, c) => {
  let u = 2166136261;
  for (let s = r; s < c; s++) u = Math.imul(u ^ a.charCodeAt(s), 16777619);
  return u;
}, Qc = (a, r, c) => {
  const u = c - r;
  let s = Math.imul(u, 2654435761) ^ a.charCodeAt(r);
  if (u > 3) {
    const f = u >> 2, m = u >> 1;
    s = Math.imul(s ^ a.charCodeAt(r + 1) << 8 ^ a.charCodeAt(r + 2) << 16 ^ a.charCodeAt(r + f), 2246822507), s = Math.imul(s ^ a.charCodeAt(r + m) << 8 ^ a.charCodeAt(r + m + f) << 16 ^ a.charCodeAt(c - 3), 3266489909), s ^= a.charCodeAt(c - 2) << 8 ^ a.charCodeAt(c - 1) << 16;
    for (let h = r + 3, p = c - 4; h < r + 8 && h < p; h++, p--) s = Math.imul(s ^ a.charCodeAt(h) ^ a.charCodeAt(p) << 8, 16777619);
  }
  return s ^ s >>> 15 | 0;
}, fC = (a, r, c = {}) => {
  const { GROUP_COUNT: u, edgeStart: s, labelStart: f, labelText: m, edgeTarget: h, nodeGroup: p, nodeVlist: b, vlistPat: x, vlistOps: v, vlistRef: S, vlistGroup: A, litAnchor: O, litGroup: w, litPool: C, poolOffsets: _, poolText: D, adjGid: j, adjStart: M, adjTgt: Y, patGid: I, patTgt: X, postfixLookupGroups: L, customValidatorNames: F, orderSensitiveModifiers: ae } = a, ie = new Int32Array(u).fill(-1);
  for (let q = 0; q < j.length; q++) ie[j[q]] = q;
  let ee = 0;
  for (let q = 0; q + 1 < M.length; q++) {
    const $ = M[q + 1] - M[q];
    $ > ee && (ee = $);
  }
  let fe = 32;
  for (; fe < 2 * (1 + ee + I.length); ) fe <<= 1;
  const ge = new Int32Array(S.length + 1);
  for (let q = 0; q < S.length; q++) ge[q + 1] = ge[q] + x[S[q] + 1] - x[S[q]];
  const he = new Uint8Array(u);
  for (let q = 0; q < L.length; q++) he[L[q]] = 1;
  const Q = s.length - 1, J = new Uint8Array(Q);
  let te = 0, de = !0;
  for (let q = 0; q < O.length; q++) {
    J[O[q]] = 1;
    const $ = _[C[q] * 2 + 1];
    $ > te && (te = $);
    const W = D.charCodeAt(_[C[q] * 2]);
    (W === 91 || W === 40) && (de = !1);
  }
  let G = 1;
  for (; G < O.length * 2; ) G <<= 1;
  const Ye = new Int32Array(G).fill(-1);
  for (let q = 0; q < O.length; q++) {
    const $ = _[C[q] * 2];
    let W = (Pd(D, $, $ + _[C[q] * 2 + 1]) ^ Math.imul(O[q], 2654435761) | 0) & G - 1;
    for (; Ye[W] !== -1; ) W = W + 1 & G - 1;
    Ye[W] = q;
  }
  const De = (q, $, W, be) => {
    let _e = (Pd($, W, be) ^ Math.imul(q, 2654435761) | 0) & G - 1;
    const Ae = be - W;
    for (; ; ) {
      const ze = Ye[_e];
      if (ze === -1) return -1;
      if (O[ze] === q && _[C[ze] * 2 + 1] === Ae) {
        const et = _[C[ze] * 2];
        let Ke = !0;
        for (let we = 0; we < Ae; we++) if (D.charCodeAt(et + we) !== $.charCodeAt(W + we)) {
          Ke = !1;
          break;
        }
        if (Ke) return w[ze];
      }
      _e = _e + 1 & G - 1;
    }
  }, qe = c.cacheSize ?? 8192, R = c.prefix ?? a.prefix ?? "", Z = R === "" ? "" : R + ":", oe = Z.length, se = (F ?? []).map((q) => {
    throw new Error("cn: missing validator " + q);
  }), ne = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ue = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, xe = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, le = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  let re = 0, je = -1, pt = -1, at = -1, St = -1;
  const st = (q) => q >= 97 && q <= 122 || q >= 65 && q <= 90 || q >= 48 && q <= 57 || q === 95, Xe = (q) => /\s/.test(String.fromCharCode(q)), Dn = (q, $, W) => {
    if (re = 0, je = -1, W - $ < 3) return;
    const be = q.charCodeAt($), _e = q.charCodeAt(W - 1);
    if (be === 91 && _e === 93) re = 1;
    else if (be === 40 && _e === 41) re = 2;
    else return;
    at = $ + 1, St = W - 1;
    let Ae = $ + 1;
    if (st(q.charCodeAt(Ae))) {
      for (Ae++; Ae < W - 1; ) {
        const ze = q.charCodeAt(Ae);
        if (!st(ze) && ze !== 45) break;
        Ae++;
      }
      Ae < W - 2 && q.charCodeAt(Ae) === 58 && (je = $ + 1, pt = Ae, at = Ae + 1);
    }
  }, il = (q, $, W, be) => {
    if (W - $ !== be.length) return !1;
    for (let _e = 0; _e < be.length; _e++) if (q.charCodeAt($ + _e) !== be.charCodeAt(_e)) return !1;
    return !0;
  }, ul = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Yo = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ta = (q) => !!q && !Number.isNaN(Number(q)), na = (q, $, W) => {
    if (W - $ < 11 || !il(q, $, $ + 10, "@container")) return !1;
    if (q.charCodeAt($ + 10) === 47) return W - $ >= 12;
    const be = q.charCodeAt($ + 11);
    return be === 115 && W - $ >= 17 && il(q, $ + 10, $ + 16, "-size/") || be === 110 && W - $ >= 19 && il(q, $ + 10, $ + 18, "-normal/");
  }, Wr = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2
  ], qo = "length|number|number weight|family-name|position percentage|length size bg-size|image url|shadow|length|family-name|position percentage|length size bg-size|image url|shadow|number weight".split("|").map((q) => q.split(" ")), ei = [
    2,
    3,
    1,
    0,
    0,
    0,
    4,
    5,
    0,
    0,
    0,
    0,
    0,
    1,
    1
  ], mu = (q, $, W, be) => {
    if (q >= 10) {
      if (q >= 25) return se[q - 25]($.slice(W, be));
      const _e = q - 10;
      if (re !== Wr[_e]) return !1;
      if (je >= 0) {
        for (const Ae of qo[_e]) if (il($, je, pt, Ae)) return !0;
        return !1;
      }
      switch (ei[_e]) {
        case 0:
          return !1;
        case 1:
          return !0;
        case 2: {
          const Ae = $.slice(at, St);
          return ne.test(Ae) && !ue.test(Ae);
        }
        case 3:
          return ta($.slice(at, St));
        case 4:
          return le.test($.slice(at, St));
        default:
          return xe.test($.slice(at, St));
      }
    }
    switch (q) {
      case 0:
        return !0;
      case 1:
        return re === 0;
      case 2:
        return re === 1;
      case 3:
        return re === 2;
      case 4:
        return ul.test($.slice(W, be));
      case 5:
        return ta($.slice(W, be));
      case 6: {
        const _e = $.slice(W, be);
        return !!_e && Number.isInteger(Number(_e));
      }
      case 7:
        return be > W && $.charCodeAt(be - 1) === 37 && ta($.slice(W, be - 1));
      case 8:
        return Yo.test($.slice(W, be));
      default:
        return na($, W, be);
    }
  }, cl = new Set(typeof ae == "string" ? ae.split(" ") : ae), ko = (q, $, W, be, _e, Ae) => {
    const ze = Pd($, W, be) ^ (_e ? 2654435769 : 0) | 0;
    let et = q.get(ze);
    if (et !== void 0) e: for (let Re = 0; Re < et.length; Re++) {
      const Qe = et[Re];
      if (!(Qe.imp !== _e || Qe.k.length !== be - W)) {
        for (let Ee = 0; Ee < Qe.k.length; Ee++) if (Qe.k.charCodeAt(Ee) !== $.charCodeAt(W + Ee)) continue e;
        return Qe.id;
      }
    }
    else q.set(ze, et = []);
    const Ke = $.slice(W, be), we = Ae(Ke);
    return et.push({
      k: Ke,
      imp: _e,
      id: we
    }), we;
  };
  let Ja = /* @__PURE__ */ new Map(), ti = /* @__PURE__ */ new Map(), $a = 2;
  const Io = 4096, ni = (q, $) => {
    const W = [];
    let be = 0, _e = 0, Ae = 0;
    for (let we = 0; we < q.length; we++) {
      const Re = q.charCodeAt(we);
      be === 0 && _e === 0 && Re === 58 ? (W.push(q.slice(Ae, we)), Ae = we + 1) : Re === 91 ? be++ : Re === 93 ? be-- : Re === 40 ? _e++ : Re === 41 && _e--;
    }
    W.push(q.slice(Ae));
    let ze = W[0];
    if (W.length > 1) {
      const we = [];
      let Re = [];
      for (const Qe of W) Qe.charCodeAt(0) === 91 || cl.has(Qe) ? (Re.length && (we.push(...Re.sort()), Re = []), we.push(Qe)) : Re.push(Qe);
      Re.length && we.push(...Re.sort()), ze = we.join(":");
    }
    const et = $ ? ze + " !" : ze;
    let Ke = ti.get(et);
    return Ke === void 0 && ti.set(et, Ke = $a++), Ke;
  };
  let Xo = /* @__PURE__ */ new Map(), Qo = u;
  const Es = u + 4096, en = () => Qo++, hu = 2097152, la = 8192, Zo = new Int32Array(la), cn = new Array(la).fill(null), vu = new Int32Array(la), li = new Int32Array(la), gu = new Uint8Array(la);
  let pu = 0;
  const aa = (q, $, W, be, _e, Ae, ze, et) => {
    let Ke = q;
    if (cn[q] !== null)
      if (cn[q | 1] === null) Ke = q | 1;
      else if ((pu++ & 3) === 0) Ke = q | pu >> 2 & 1;
      else return;
    cn[Ke] = $.slice(W, be), Zo[Ke] = _e, vu[Ke] = Ae, li[Ke] = ze, gu[Ke] = et;
  }, Ft = () => cn.fill(null);
  let xt = 256, zt = [
    new Int32Array(xt),
    new Int32Array(xt),
    new Int32Array(xt),
    new Int32Array(xt)
  ], [oa, ra, ia, Nl] = zt, sl = new Uint8Array(xt), Qn = new Uint8Array(xt);
  const Dl = () => {
    xt *= 2, zt = zt.map(($) => {
      const W = new Int32Array(xt);
      return W.set($), W;
    }), [oa, ra, ia, Nl] = zt;
    const q = new Uint8Array(xt);
    q.set(sl), sl = q, Qn = new Uint8Array(xt);
  };
  let Zn = 64, Kn = new Int32Array(Zn), ua = new Int32Array(Zn);
  const ai = new Int32Array(u);
  let Pn = 2048, Ko = 21, zl = new Float64Array(Pn), Po = new Int32Array(Pn), Fn = 0;
  const Fo = (q, $) => {
    if (q === 0 && $ < u)
      return ai[$] === Fn ? 1 : (ai[$] = Fn, 0);
    const W = q * 2097152 + $ + 1;
    let be = Math.imul(W, 2654435761) >>> Ko;
    for (; Po[be] === Fn; ) {
      if (zl[be] === W) return 1;
      be = be + 1 & Pn - 1;
    }
    return zl[be] = W, Po[be] = Fn, 0;
  }, Wa = (q, $, W, be, _e) => {
    if (W - $ >= 2 && q.charCodeAt($) === 91 && q.charCodeAt(W - 1) === 93) {
      let Ae = -1;
      for (let ze = $ + 1; ze < W - 1; ze++) if (q.charCodeAt(ze) === 58) {
        Ae = ze;
        break;
      }
      return Ae === -1 || Ae === $ + 1 ? El : ko(Xo, q, $ + 1, Ae, 0, en);
    }
    if (be >= 0 && p[be] >= 0) return p[be];
    for (let Ae = _e - 1; Ae >= 0; Ae--) {
      const ze = ua[Ae];
      if (ze > W) continue;
      const et = Kn[Ae], Ke = W - ze;
      if (J[et] === 1 && Ke > 0 && Ke <= te) {
        const mt = q.charCodeAt(ze);
        if (de === !1 || mt !== 91 && mt !== 40) {
          const yn = De(et, q, ze, W);
          if (yn >= 0) return yn;
        }
      }
      const we = b[et];
      if (we < 0) continue;
      const Re = S[we], Qe = x[Re], Ee = x[Re + 1];
      if (Qe === Ee) continue;
      Dn(q, ze, W);
      const Rt = ge[we] - Qe;
      for (let mt = Qe; mt < Ee; mt++) if (mu(v[mt], q, ze, W)) return A[Rt + mt];
    }
    return El;
  }, ca = (q) => {
    const $ = q.length;
    let W = 0, be = 0, _e = !1;
    ($a > Io || Ja.size > Io) && (Ja = /* @__PURE__ */ new Map(), ti = /* @__PURE__ */ new Map(), $a = 2, Ft()), Qo > Es && (Xo = /* @__PURE__ */ new Map(), Qo = u, Ft());
    let Ae = 0;
    for (; Ae < $; ) {
      let we = q.charCodeAt(Ae);
      if (we === 32 || we >= 9 && we <= 13 || we >= 160 && Xe(we)) {
        we !== 32 && (_e = !0), Ae++;
        continue;
      }
      const Re = Ae;
      let Qe = 0;
      for (; Ae < $; ) {
        if (we = q.charCodeAt(Ae), we <= 32) {
          if (we === 32) break;
          if (we >= 9 && we <= 13) {
            _e = !0;
            break;
          }
        } else if (we >= 160 && Xe(we)) {
          _e = !0;
          break;
        }
        Qe = Math.imul(Qe ^ we, 16777619), Ae++;
      }
      const Ee = Ae, Rt = Ee - Re;
      W === xt && Dl();
      const mt = W++;
      oa[mt] = Re, ra[mt] = Ee, be += Rt, Qe ^= Math.imul(Rt, 2654435761);
      const yn = Qe ^ Qe >>> 15 | 0, Et = yn & 8190;
      {
        let ke = -1;
        if (Zo[Et] === yn && cn[Et] !== null && cn[Et].length === Rt ? ke = Et : Zo[Et | 1] === yn && cn[Et | 1] !== null && cn[Et | 1].length === Rt && (ke = Et | 1), ke >= 0) {
          const jt = cn[ke];
          let Un = !0;
          for (let xn = 0; xn < Rt; xn++) if (jt.charCodeAt(xn) !== q.charCodeAt(Re + xn)) {
            Un = !1;
            break;
          }
          if (Un) {
            ia[mt] = vu[ke], Nl[mt] = li[ke], sl[mt] = gu[ke];
            continue;
          }
        }
      }
      let Ct = Re;
      if (oe !== 0) {
        if (Ee - Re <= oe || !q.startsWith(Z, Re)) {
          ia[mt] = El, aa(Et, q, Re, Ee, yn, El, 0, 0);
          continue;
        }
        Ct = Re + oe;
      }
      let tr = 0, ri = 0, jl = -1, nr = -1;
      for (let ke = Ct; ke < Ee; ke++) {
        const jt = q.charCodeAt(ke);
        if (tr === 0 && ri === 0) {
          if (jt === 58) {
            jl = ke;
            continue;
          }
          if (jt === 47) {
            nr = ke;
            continue;
          }
        }
        jt === 91 ? tr++ : jt === 93 ? tr-- : jt === 40 ? ri++ : jt === 41 && ri--;
      }
      const yu = jl >= Ct ? jl + 1 : Ct;
      let ut = yu, Jt = Ee, fa = !1, lr = 0;
      Jt > ut && q.charCodeAt(Jt - 1) === 33 ? (fa = !0, Jt--) : Jt > ut && q.charCodeAt(ut) === 33 && (fa = !0, ut++, lr = 1);
      let sn = -1;
      nr > yu && (sn = nr + lr, sn >= Jt && (sn = -1));
      let ar = ut;
      Jt - ut > 1 && q.charCodeAt(ut) === 45 && (ar = ut + 1);
      let bn = 0, tn = 0, da = 0, ii = -1, Sn = 0;
      (b[0] >= 0 || J[0] === 1) && (Kn[0] = 0, ua[0] = ar, Sn = 1);
      let lo = Mo, ui = 0;
      for (let ke = ar; ke < Jt; ke++)
        if (ke === sn && (lo = tn < da ? Mo : bn, ui = Sn), bn !== Mo) {
          const jt = q.charCodeAt(ke);
          let Un = -1;
          if (tn < da)
            m.charCodeAt(tn) === jt ? (tn++, tn === da && (Un = bn = ii)) : bn = Mo;
          else {
            const xn = s[bn], ro = s[bn + 1];
            let Ul = Mo;
            for (let kt = xn; kt < ro; kt++) {
              const io = f[kt];
              if (m.charCodeAt(io) === jt) {
                f[kt + 1] - io === 1 ? Un = Ul = h[kt] : (tn = io + 1, da = f[kt + 1], ii = h[kt], Ul = bn);
                break;
              }
            }
            bn = Ul;
          }
          if (Un >= 0 && (b[Un] >= 0 || J[Un] === 1) && ke + 1 < Jt && q.charCodeAt(ke + 1) === 45) {
            if (Sn === Zn) {
              Zn *= 2;
              const xn = new Int32Array(Zn);
              xn.set(Kn), Kn = xn;
              const ro = new Int32Array(Zn);
              ro.set(ua), ua = ro;
            }
            Kn[Sn] = Un, ua[Sn] = ke + 2, Sn++;
          }
        }
      sn === Jt && (lo = tn < da ? Mo : bn, ui = Sn);
      const ci = tn < da ? Mo : bn;
      let qt, nn = !1;
      if (sn >= 0)
        if (nn = !0, qt = Wa(q, ut, sn, lo, ui), qt !== El && qt < u && he[qt]) {
          const ke = Wa(q, ut, Jt, ci, Sn);
          ke !== El && ke !== qt && (qt = ke, nn = !1);
        } else qt === El && (qt = Wa(q, ut, Jt, ci, Sn), nn = !1);
      else qt = Wa(q, ut, Jt, ci, Sn);
      let ao = 0, oo = 0;
      qt === El ? ia[mt] = El : (oo = nn ? 1 : 0, ao = Ct >= jl ? fa ? 1 : 0 : ko(Ja, q, Ct, jl, fa ? 1 : 0, (ke) => ni(ke, fa)), ia[mt] = qt, sl[mt] = oo, Nl[mt] = ao), aa(Et, q, Re, Ee, yn, qt, ao, oo);
    }
    if (W === 0) return "";
    if (W === 1) return oa[0] === 0 && ra[0] === $ ? q : q.slice(oa[0], ra[0]);
    if (W * fe > Pn) {
      for (; W * fe > Pn; )
        Pn <<= 1, Ko--;
      zl = new Float64Array(Pn), Po = new Int32Array(Pn);
    }
    if ($a >= hu || Qo >= hu) throw new Error("cn: too many distinct classes in one merge");
    Fn = Fn + 1 | 0, Fn === 0 && (ai.fill(0), Po.fill(0), Fn = 1);
    let ze = !1;
    for (let we = W - 1; we >= 0; we--) {
      const Re = ia[we];
      if (Re === El) {
        Qn[we] = 1;
        continue;
      }
      const Qe = Nl[we];
      if (Fo(Qe, Re) === 1) {
        Qn[we] = 0, ze = !0;
        continue;
      }
      if (Qn[we] = 1, Re < u) {
        const Ee = ie[Re];
        if (Ee >= 0) for (let Rt = M[Ee]; Rt < M[Ee + 1]; Rt++) Fo(Qe, Y[Rt]);
        if (sl[we] & 1)
          for (let Rt = 0; Rt < I.length; Rt++) I[Rt] === Re && Fo(Qe, X[Rt]);
      }
    }
    if (!ze && !_e && $ === be + W - 1) return q;
    let et = "", Ke = 0;
    for (; Ke < W; ) {
      if (!Qn[Ke]) {
        Ke++;
        continue;
      }
      const we = oa[Ke];
      let Re = ra[Ke], Qe = Ke + 1;
      for (; Qe < W && Qn[Qe] && oa[Qe] === Re + 1 && q.charCodeAt(Re) === 32; )
        Re = ra[Qe], Qe++;
      et.length > 0 && (et += " "), et += q.slice(we, Re), Ke = Qe;
    }
    return et;
  }, zn = 16384, jn = new Int32Array(zn * 2);
  let eo = 0, yt = 1, dt = /* @__PURE__ */ Object.create(null), Yt = /* @__PURE__ */ Object.create(null), pn = /* @__PURE__ */ new Map(), oi = /* @__PURE__ */ new Map(), Jo = 0, $o = 0;
  const sa = () => {
    eo ^= zn, yt = yt + 1 | 0, $o = 0;
  }, to = (q) => {
    let $ = dt[q];
    if ($ !== void 0) return $;
    const W = Qc(q, 0, q.length), be = (W & 16383) + eo, _e = jn[be] === (W ^ yt) || jn[be ^ zn] === (W ^ yt - 1);
    return _e && ($ = Yt[q], $ !== void 0) ? (dt[q] = $, $) : ($ = ca(q), _e ? (dt[q] = $, ++Jo > qe && (Jo = 0, Yt = dt, dt = /* @__PURE__ */ Object.create(null), sa())) : (jn[be] = W ^ yt, ++$o > zn && sa()), $);
  }, Wo = (q) => {
    let $ = pn.get(q);
    if ($ !== void 0) return $;
    const W = Qc(q, 0, q.length), be = (W & 16383) + eo, _e = jn[be] === (W ^ yt) || jn[be ^ zn] === (W ^ yt - 1);
    return _e && ($ = oi.get(q), $ !== void 0) ? (pn.set(q, $), $) : ($ = ca(q), _e ? (pn.set(q, $), ++Jo > qe && (Jo = 0, oi = pn, pn = /* @__PURE__ */ new Map(), sa())) : (jn[be] = W ^ yt, ++$o > zn && sa()), $);
  }, er = (q) => {
    const $ = Qc(q, 0, q.length), W = ($ & 16383) + eo;
    return jn[W] === ($ ^ yt) || jn[W ^ zn] === ($ ^ yt - 1) ? !0 : (jn[W] = $ ^ yt, ++$o > zn && sa(), !1);
  }, Jn = qe === 0 ? ca : sC ? (q) => {
    const $ = pn.get(q);
    return $ !== void 0 ? $ : Wo(q);
  } : to;
  return {
    merge: function() {
      return arguments.length === 1 && typeof arguments[0] == "string" ? Jn(arguments[0]) : Jn(mC.apply(null, arguments));
    },
    mergeString: Jn,
    seenBefore: qe === 0 ? () => !1 : er,
    mergeUncached: ca
  };
}, $c = (a, r) => {
  if (!a) return "";
  if (typeof a == "string") return a;
  let c = "";
  if (typeof a.length == "number" && (!r || Array.isArray(a))) {
    const u = a;
    for (let s = 0; s < u.length; s++) {
      const f = u[s];
      if (!f) continue;
      const m = typeof f == "string" ? f : $c(f, r);
      m && (c && (c += " "), c += m);
    }
    return c;
  }
  if (r) {
    if (typeof a == "number") return "" + a;
    if (typeof a == "object")
      for (const u in a) a[u] && (c && (c += " "), c += u);
  }
  return c;
}, dC = (a, r) => {
  let c = "";
  for (let u = 0; u < a.length; u++) {
    const s = a[u];
    if (!s) continue;
    const f = typeof s == "string" ? s : $c(s, r);
    f && (c && (c += " "), c += f);
  }
  return c;
}, mC = function() {
  return dC(arguments, !1);
}, hC = 256, jp = 16, vC = 1024, Fd = 4096, gC = (a, r) => {
  const c = r === void 0 ? () => !0 : r.seenBefore, u = r === void 0 ? a : r.mergeUncached;
  let s = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), m = 0, h = null, p = null, b = [], x = [], v = 0;
  const S = (_, D, j) => {
    p === null && (p = new Array(Fd).fill(""), b = new Array(Fd).fill(""), x = new Array(Fd).fill(""));
    const M = Qc(_, 0, _.length) & 4094;
    if (p[M] === _ && b[M] === D) return x[M];
    if (p[M | 1] === _ && b[M | 1] === D) return x[M | 1];
    const Y = a(j ? D + " " + _ : _), I = p[M] === "" ? M : M | (p[M | 1] === "" ? 1 : v++ & 1);
    return p[I] = _, b[I] = D, x[I] = Y, Y;
  }, A = (_, D, j, M) => {
    let Y = 0;
    if (D) {
      if (D !== _.a0) return !1;
      Y = 1;
    }
    if (j) {
      if (j !== (Y === 0 ? _.a0 : _.a1)) return !1;
      Y++;
    }
    if (M) {
      if (M !== (Y === 0 ? _.a0 : Y === 1 ? _.a1 : _.a2)) return !1;
      Y++;
    }
    return Y === _.t;
  }, O = (_, D) => {
    const j = _.a;
    let M = 0;
    for (let Y = 0; Y < D.length; Y++) {
      const I = D[Y];
      if (I) {
        if (I !== j[M]) return !1;
        M++;
      }
    }
    return M === _.t;
  }, w = (_, D) => {
    const j = _.length, M = h === null ? null : h.n;
    if (!D) {
      if (M !== null && O(M, _))
        return h = M, M.r;
      if (h !== null && h !== M && O(h, _)) return h.r;
    }
    let Y = "", I = -1, X = 0, L = !1;
    for (let ie = 0; ie < j; ie++) {
      let ee = _[ie];
      if (ee) {
        if (typeof ee != "string") {
          if (ee = _[ie] = $c(ee, !0), !ee) continue;
          L = !0;
        }
        I < 0 && (Y = ee, I = ie), X++;
      }
    }
    if (X === 0) return "";
    if (X === 1) return a(Y);
    if (L) {
      if (M !== null && O(M, _))
        return h = M, M.r;
      if (h !== null && h !== M && O(h, _)) return h.r;
    }
    let F = s.get(Y);
    F === void 0 && (F = f.get(Y), F !== void 0 && s.set(Y, F));
    let ae = null;
    if (F !== void 0) {
      if (F.skip > 0) {
        F.skip--, h = null;
        let ee = Y;
        for (let fe = I + 1; fe < j; fe++) {
          const ge = _[fe];
          ge && (ee += " " + ge);
        }
        return S(ee, "", !1);
      }
      const ie = F.e;
      e: for (let ee = 0; ee < ie.length; ee++) {
        const fe = ie[ee];
        if (fe.t !== X) continue;
        const ge = fe.a;
        let he = 1;
        for (let Q = I + 1; Q < j; Q++) {
          const J = _[Q];
          if (J && J !== ge[he++]) continue e;
        }
        ae = fe;
        break;
      }
      ae !== null && (F.miss = 0);
    }
    if (ae === null) {
      let ie = Y;
      const ee = [Y];
      for (let ge = I + 1; ge < j; ge++) {
        const he = _[ge];
        he && (ie += " " + he, ee.push(he));
      }
      if (!c(ie)) return u(ie);
      ae = {
        r: a(ie),
        t: ee.length,
        a0: ee[0],
        a1: ee[1],
        a2: ee[2] ?? "",
        a: ee,
        n: null
      }, F === void 0 ? s.set(Y, F = {
        e: [],
        miss: 0,
        skip: 0,
        at: 0
      }) : ++F.miss > jp && (F.miss = jp, F.skip = vC, F.e.length = 0, F.at = 0);
      const fe = F.e;
      fe.length < hC ? fe.push(ae) : (fe[F.at] = ae, F.at = F.at + 1 & 255), ++m > 1e3 && (m = 0, f = s, s = /* @__PURE__ */ new Map());
    }
    return h !== null && h !== ae && (h.n = ae), h = ae, ae.r;
  }, C = (_) => Array.isArray(_) ? w(_.slice(), !1) : a($c(_, !0));
  return function(_, D, j) {
    const M = arguments.length;
    if ((M | 1) === 3) {
      const X = h;
      if (X !== null) {
        const L = X.n;
        if (L !== null && A(L, _, D, j))
          return h = L, L.r;
        if (X !== L && A(X, _, D, j)) return X.r;
      }
      if (M === 2 && typeof D == "string" && D !== "") {
        const L = s.get(_);
        if (L !== void 0 && L.skip > 0)
          return L.skip--, h = null, S(D, _, !0);
      }
      return w([
        _,
        D,
        j
      ], !0);
    }
    if (M === 1) return typeof _ == "string" ? a(_) : C(_);
    const Y = h;
    if (Y !== null) {
      const X = Y.n;
      if (X !== null) {
        const L = X.a;
        let F = 0, ae = !0;
        for (let ie = 0; ie < M; ie++) {
          const ee = arguments[ie];
          if (ee) {
            if (ee !== L[F]) {
              ae = !1;
              break;
            }
            F++;
          }
        }
        if (ae && F === X.t)
          return h = X, X.r;
      }
      if (Y !== X) {
        const L = Y.a;
        let F = 0, ae = !0;
        for (let ie = 0; ie < M; ie++) {
          const ee = arguments[ie];
          if (ee) {
            if (ee !== L[F]) {
              ae = !1;
              break;
            }
            F++;
          }
        }
        if (ae && F === Y.t) return Y.r;
      }
    }
    const I = [];
    for (let X = 0; X < M; X++) I.push(arguments[X]);
    return w(I, !0);
  };
}, Up = /* @__PURE__ */ fC(cC), Za = /* @__PURE__ */ gC(Up.mergeString, Up);
var ou = h2(), pC = Object.defineProperty, Vm = (a, r) => pC(a, "name", { value: r, configurable: !0 });
function vm(a, r) {
  if (typeof a == "function")
    return a(r);
  a != null && (a.current = r);
}
Vm(vm, "setRef");
function V2(...a) {
  return (r) => {
    let c = !1;
    const u = a.map((s) => {
      const f = vm(s, r);
      return !c && typeof f == "function" && (c = !0), f;
    });
    if (c)
      return () => {
        for (let s = 0; s < u.length; s++) {
          const f = u[s];
          typeof f == "function" ? f() : vm(a[s], null);
        }
      };
  };
}
Vm(V2, "composeRefs");
function Fe(...a) {
  return y.useCallback(V2(...a), a);
}
Vm(Fe, "useComposedRefs");
var yC = Object.defineProperty, ol = (a, r) => yC(a, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Al(a) {
  const r = y.forwardRef((c, u) => {
    let { children: s, ...f } = c, m = null, h = !1;
    const p = [];
    gm(s) && typeof Bc == "function" && (s = Bc(s._payload)), y.Children.forEach(s, (S) => {
      if (I2(S)) {
        h = !0;
        const A = S;
        let O = "child" in A.props ? A.props.child : A.props.children;
        gm(O) && typeof Bc == "function" && (O = Bc(O._payload)), m = SC(A, O), p.push(m?.props?.children);
      } else
        p.push(S);
    }), m ? m = y.cloneElement(m, void 0, p) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !h && y.Children.count(s) === 1 && y.isValidElement(s) && (m = s)
    );
    const b = m ? k2(m) : void 0, x = Fe(u, b);
    if (!m) {
      if (s || s === 0)
        throw new Error(
          h ? CC(a) : EC(a)
        );
      return s;
    }
    const v = q2(f, m.props ?? {});
    return m.type !== y.Fragment && (v.ref = u ? x : b), y.cloneElement(m, v);
  });
  return r.displayName = `${a}.Slot`, r;
}
ol(Al, "createSlot");
var bC = /* @__PURE__ */ Al("Slot"), G2 = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Y2(a) {
  const r = /* @__PURE__ */ ol((c) => "child" in c ? c.children(c.child) : c.children, "Slottable");
  return r.displayName = `${a}.Slottable`, r.__radixId = G2, r;
}
ol(Y2, "createSlottable");
var SC = /* @__PURE__ */ ol((a, r) => {
  if ("child" in a.props) {
    const c = a.props.child;
    return y.isValidElement(c) ? y.cloneElement(c, void 0, a.props.children(c.props.children)) : null;
  }
  return y.isValidElement(r) ? r : null;
}, "getSlottableElementFromSlottable");
function q2(a, r) {
  const c = { ...r };
  for (const u in r) {
    const s = a[u], f = r[u];
    /^on[A-Z]/.test(u) ? s && f ? c[u] = (...h) => {
      const p = f(...h);
      return s(...h), p;
    } : s && (c[u] = s) : u === "style" ? c[u] = { ...s, ...f } : u === "className" && (c[u] = [s, f].filter(Boolean).join(" "));
  }
  return { ...a, ...c };
}
ol(q2, "mergeProps");
function k2(a) {
  let r = Object.getOwnPropertyDescriptor(a.props, "ref")?.get, c = r && "isReactWarning" in r && r.isReactWarning;
  return c ? a.ref : (r = Object.getOwnPropertyDescriptor(a, "ref")?.get, c = r && "isReactWarning" in r && r.isReactWarning, c ? a.props.ref : a.props.ref || a.ref);
}
ol(k2, "getElementRef");
function I2(a) {
  return y.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === G2;
}
ol(I2, "isSlottable");
var xC = /* @__PURE__ */ Symbol.for("react.lazy");
function gm(a) {
  return a != null && typeof a == "object" && "$$typeof" in a && a.$$typeof === xC && "_payload" in a && X2(a._payload);
}
ol(gm, "isLazyComponent");
function X2(a) {
  return typeof a == "object" && a !== null && "then" in a;
}
ol(X2, "isPromiseLike");
var EC = /* @__PURE__ */ ol((a) => `${a} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), CC = /* @__PURE__ */ ol((a) => `${a} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Bc = Kr[" use ".trim().toString()], wC = Object.defineProperty, TC = (a, r) => wC(a, "name", { value: r, configurable: !0 }), AC = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], it = AC.reduce((a, r) => {
  const c = /* @__PURE__ */ Al(`Primitive.${r}`), u = y.forwardRef((s, f) => {
    const { asChild: m, ...h } = s, p = m ? c : r;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ E.jsx(p, { ...h, ref: f });
  });
  return u.displayName = `Primitive.${r}`, { ...a, [r]: u };
}, {});
function Gm(a, r) {
  a && ou.flushSync(() => a.dispatchEvent(r));
}
TC(Gm, "dispatchDiscreteCustomEvent");
var OC = Object.defineProperty, _C = (a, r) => OC(a, "name", { value: r, configurable: !0 }), Q2 = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), RC = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ _C(function(r, c) {
    return /* @__PURE__ */ E.jsx(
      it.span,
      {
        ...r,
        ref: c,
        style: { ...Q2, ...r.style }
      }
    );
  }, "VisuallyHidden")
), MC = RC, NC = Object.defineProperty, In = (a, r) => NC(a, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function DC(a, r) {
  const c = y.createContext(r);
  c.displayName = a + "Context";
  const u = /* @__PURE__ */ In((f) => {
    const { children: m, ...h } = f, p = y.useMemo(() => h, Object.values(h));
    return /* @__PURE__ */ E.jsx(c.Provider, { value: p, children: m });
  }, "Provider");
  u.displayName = a + "Provider";
  function s(f, m = {}) {
    const { optional: h = !1 } = m, p = y.useContext(c);
    if (p) return p;
    if (r !== void 0) return r;
    if (!h)
      throw new Error(`\`${f}\` must be used within \`${a}\``);
  }
  return In(s, "useContext"), [u, s];
}
In(DC, "createContext");
// @__NO_SIDE_EFFECTS__
function Ml(a, r = []) {
  let c = [];
  function u(f, m) {
    const h = y.createContext(m);
    h.displayName = f + "Context";
    const p = c.length;
    c = [...c, m];
    const b = /* @__PURE__ */ In((v) => {
      const { scope: S, children: A, ...O } = v, w = S?.[a]?.[p] || h, C = y.useMemo(() => O, Object.values(O));
      return /* @__PURE__ */ E.jsx(w.Provider, { value: C, children: A });
    }, "Provider");
    b.displayName = f + "Provider";
    function x(v, S, A = {}) {
      const { optional: O = !1 } = A, w = S?.[a]?.[p] || h, C = y.useContext(w);
      if (C) return C;
      if (m !== void 0) return m;
      if (!O)
        throw new Error(`\`${v}\` must be used within \`${f}\``);
    }
    return In(x, "useContext"), [b, x];
  }
  In(u, "createContext");
  const s = /* @__PURE__ */ In(() => {
    const f = c.map((m) => y.createContext(m));
    return /* @__PURE__ */ In(function(h) {
      const p = h?.[a] || f;
      return y.useMemo(
        () => ({ [`__scope${a}`]: { ...h, [a]: p } }),
        [h, p]
      );
    }, "useScope");
  }, "createScope");
  return s.scopeName = a, [u, Z2(s, ...r)];
}
In(Ml, "createContextScope");
function Z2(...a) {
  const r = a[0];
  if (a.length === 1) return r;
  const c = /* @__PURE__ */ In(() => {
    const u = a.map((s) => ({
      useScope: s(),
      scopeName: s.scopeName
    }));
    return /* @__PURE__ */ In(function(f) {
      const m = u.reduce((h, { useScope: p, scopeName: b }) => {
        const v = p(f)[`__scope${b}`];
        return { ...h, ...v };
      }, {});
      return y.useMemo(() => ({ [`__scope${r.scopeName}`]: m }), [m]);
    }, "useComposedScopes");
  }, "createScope");
  return c.scopeName = r.scopeName, c;
}
In(Z2, "composeContextScopes");
var zC = Object.defineProperty, Vt = (a, r) => zC(a, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function os(a) {
  const r = a + "CollectionProvider", [c, u] = /* @__PURE__ */ Ml(r), [s, f] = c(
    r,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), m = /* @__PURE__ */ Vt((w) => {
    const { scope: C, children: _ } = w, D = y.useRef(null), j = y.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ E.jsx(s, { scope: C, itemMap: j, collectionRef: D, children: _ });
  }, "CollectionProvider");
  m.displayName = r;
  const h = a + "CollectionSlot", p = /* @__PURE__ */ Al(h), b = y.forwardRef(
    (w, C) => {
      const { scope: _, children: D } = w, j = f(h, _), M = Fe(C, j.collectionRef);
      return /* @__PURE__ */ E.jsx(p, { ref: M, children: D });
    }
  );
  b.displayName = h;
  const x = a + "CollectionItemSlot", v = "data-radix-collection-item", S = /* @__PURE__ */ Al(x), A = y.forwardRef(
    (w, C) => {
      const { scope: _, children: D, ...j } = w, M = y.useRef(null), Y = Fe(C, M), I = f(x, _);
      return y.useEffect(() => (I.itemMap.set(M, { ref: M, ...j }), () => {
        I.itemMap.delete(M);
      })), /* @__PURE__ */ E.jsx(S, { [v]: "", ref: Y, children: D });
    }
  );
  A.displayName = x;
  function O(w) {
    const C = f(a + "CollectionConsumer", w);
    return y.useCallback(() => {
      const D = C.collectionRef.current;
      if (!D) return [];
      const j = Array.from(D.querySelectorAll(`[${v}]`));
      return Array.from(C.itemMap.values()).sort(
        (I, X) => j.indexOf(I.ref.current) - j.indexOf(X.ref.current)
      );
    }, [C.collectionRef, C.itemMap]);
  }
  return Vt(O, "useCollection"), [
    { Provider: m, Slot: b, ItemSlot: A },
    O,
    u
  ];
}
Vt(os, "createCollection");
var Hp = /* @__PURE__ */ new WeakMap(), _t, Rn, Jd = (Rn = class extends Map {
  constructor(c) {
    super(c);
    dp(this, _t);
    Gd(this, _t, [...super.keys()]), Hp.set(this, !0);
  }
  set(c, u) {
    return Hp.get(this) && (this.has(c) ? Wt(this, _t)[Wt(this, _t).indexOf(c)] = c : Wt(this, _t).push(c)), super.set(c, u), this;
  }
  insert(c, u, s) {
    const f = this.has(u), m = Wt(this, _t).length, h = Ym(c);
    let p = h >= 0 ? h : m + h;
    const b = p < 0 || p >= m ? -1 : p;
    if (b === this.size || f && b === this.size - 1 || b === -1)
      return this.set(u, s), this;
    const x = this.size + (f ? 0 : 1);
    h < 0 && p++;
    const v = [...Wt(this, _t)];
    let S, A = !1;
    for (let O = p; O < x; O++)
      if (p === O) {
        let w = v[O];
        v[O] === u && (w = v[O + 1]), f && this.delete(u), S = this.get(w), this.set(u, s);
      } else {
        !A && v[O - 1] === u && (A = !0);
        const w = v[A ? O : O - 1], C = S;
        S = this.get(w), this.delete(w), this.set(w, C);
      }
    return this;
  }
  with(c, u, s) {
    const f = new Rn(this);
    return f.insert(c, u, s), f;
  }
  before(c) {
    const u = Wt(this, _t).indexOf(c) - 1;
    if (!(u < 0))
      return this.entryAt(u);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(c, u, s) {
    const f = Wt(this, _t).indexOf(c);
    return f === -1 ? this : this.insert(f, u, s);
  }
  after(c) {
    let u = Wt(this, _t).indexOf(c);
    if (u = u === -1 || u === this.size - 1 ? -1 : u + 1, u !== -1)
      return this.entryAt(u);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(c, u, s) {
    const f = Wt(this, _t).indexOf(c);
    return f === -1 ? this : this.insert(f + 1, u, s);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    return Gd(this, _t, []), super.clear();
  }
  delete(c) {
    const u = super.delete(c);
    return u && Wt(this, _t).splice(Wt(this, _t).indexOf(c), 1), u;
  }
  deleteAt(c) {
    const u = this.keyAt(c);
    return u !== void 0 ? this.delete(u) : !1;
  }
  at(c) {
    const u = Zc(Wt(this, _t), c);
    if (u !== void 0)
      return this.get(u);
  }
  entryAt(c) {
    const u = Zc(Wt(this, _t), c);
    if (u !== void 0)
      return [u, this.get(u)];
  }
  indexOf(c) {
    return Wt(this, _t).indexOf(c);
  }
  keyAt(c) {
    return Zc(Wt(this, _t), c);
  }
  from(c, u) {
    const s = this.indexOf(c);
    if (s === -1)
      return;
    let f = s + u;
    return f < 0 && (f = 0), f >= this.size && (f = this.size - 1), this.at(f);
  }
  keyFrom(c, u) {
    const s = this.indexOf(c);
    if (s === -1)
      return;
    let f = s + u;
    return f < 0 && (f = 0), f >= this.size && (f = this.size - 1), this.keyAt(f);
  }
  find(c, u) {
    let s = 0;
    for (const f of this) {
      if (Reflect.apply(c, u, [f, s, this]))
        return f;
      s++;
    }
  }
  findIndex(c, u) {
    let s = 0;
    for (const f of this) {
      if (Reflect.apply(c, u, [f, s, this]))
        return s;
      s++;
    }
    return -1;
  }
  filter(c, u) {
    const s = [];
    let f = 0;
    for (const m of this)
      Reflect.apply(c, u, [m, f, this]) && s.push(m), f++;
    return new Rn(s);
  }
  map(c, u) {
    const s = [];
    let f = 0;
    for (const m of this)
      s.push([m[0], Reflect.apply(c, u, [m, f, this])]), f++;
    return new Rn(s);
  }
  reduce(...c) {
    const [u, s] = c;
    let f = 0, m = s ?? this.at(0);
    for (const h of this)
      f === 0 && c.length === 1 ? m = h : m = Reflect.apply(u, this, [m, h, f, this]), f++;
    return m;
  }
  reduceRight(...c) {
    const [u, s] = c;
    let f = s ?? this.at(-1);
    for (let m = this.size - 1; m >= 0; m--) {
      const h = this.at(m);
      m === this.size - 1 && c.length === 1 ? f = h : f = Reflect.apply(u, this, [f, h, m, this]);
    }
    return f;
  }
  toSorted(c) {
    const u = [...this.entries()].sort(c);
    return new Rn(u);
  }
  toReversed() {
    const c = new Rn();
    for (let u = this.size - 1; u >= 0; u--) {
      const s = this.keyAt(u), f = this.get(s);
      c.set(s, f);
    }
    return c;
  }
  toSpliced(...c) {
    const u = [...this.entries()];
    return u.splice(...c), new Rn(u);
  }
  slice(c, u) {
    const s = new Rn();
    let f = this.size - 1;
    if (c === void 0)
      return s;
    c < 0 && (c = c + this.size), u !== void 0 && u > 0 && (f = u - 1);
    for (let m = c; m <= f; m++) {
      const h = this.keyAt(m), p = this.get(h);
      s.set(h, p);
    }
    return s;
  }
  every(c, u) {
    let s = 0;
    for (const f of this) {
      if (!Reflect.apply(c, u, [f, s, this]))
        return !1;
      s++;
    }
    return !0;
  }
  some(c, u) {
    let s = 0;
    for (const f of this) {
      if (Reflect.apply(c, u, [f, s, this]))
        return !0;
      s++;
    }
    return !1;
  }
}, _t = new WeakMap(), Vt(Rn, "OrderedDict"), Rn);
function Zc(a, r) {
  if ("at" in Array.prototype)
    return Array.prototype.at.call(a, r);
  const c = K2(a, r);
  return c === -1 ? void 0 : a[c];
}
Vt(Zc, "at");
function K2(a, r) {
  const c = a.length, u = Ym(r), s = u >= 0 ? u : c + u;
  return s < 0 || s >= c ? -1 : s;
}
Vt(K2, "toSafeIndex");
function Ym(a) {
  return a !== a || a === 0 ? 0 : Math.trunc(a);
}
Vt(Ym, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function jC(a) {
  const r = a + "CollectionProvider", [c, u] = /* @__PURE__ */ Ml(r), [s, f] = c(
    r,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new Jd(),
      setItemMap: /* @__PURE__ */ Vt(() => {
      }, "setItemMap")
    }
  ), m = /* @__PURE__ */ Vt(({ state: j, ...M }) => j ? /* @__PURE__ */ E.jsx(p, { ...M, state: j }) : /* @__PURE__ */ E.jsx(h, { ...M }), "CollectionProvider");
  m.displayName = r;
  const h = /* @__PURE__ */ Vt((j) => {
    const M = C();
    return /* @__PURE__ */ E.jsx(p, { ...j, state: M });
  }, "CollectionInit");
  h.displayName = r + "Init";
  const p = /* @__PURE__ */ Vt((j) => {
    const { scope: M, children: Y, state: I } = j, X = y.useRef(null), [L, F] = y.useState(
      null
    ), ae = Fe(X, F), [ie, ee] = I;
    return y.useEffect(() => {
      if (!L) return;
      const fe = J2(() => {
      });
      return fe.observe(L, {
        childList: !0,
        subtree: !0
      }), () => {
        fe.disconnect();
      };
    }, [L]), /* @__PURE__ */ E.jsx(
      s,
      {
        scope: M,
        itemMap: ie,
        setItemMap: ee,
        collectionRef: ae,
        collectionRefObject: X,
        collectionElement: L,
        children: Y
      }
    );
  }, "CollectionProviderImpl");
  p.displayName = r + "Impl";
  const b = a + "CollectionSlot", x = /* @__PURE__ */ Al(b), v = y.forwardRef(
    (j, M) => {
      const { scope: Y, children: I } = j, X = f(b, Y), L = Fe(M, X.collectionRef);
      return /* @__PURE__ */ E.jsx(x, { ref: L, children: I });
    }
  );
  v.displayName = b;
  const S = a + "CollectionItemSlot", A = "data-radix-collection-item", O = /* @__PURE__ */ Al(S), w = y.forwardRef(
    (j, M) => {
      const { scope: Y, children: I, ...X } = j, L = y.useRef(null), [F, ae] = y.useState(null), ie = Fe(M, L, ae), ee = f(S, Y), { setItemMap: fe } = ee, ge = y.useRef(X);
      P2(ge.current, X) || (ge.current = X);
      const he = ge.current;
      return y.useEffect(() => {
        const Q = he;
        return fe((J) => F ? J.has(F) ? J.set(F, { ...Q, element: F }).toSorted(pm) : (J.set(F, { ...Q, element: F }), J.toSorted(pm)) : J), () => {
          fe((J) => !F || !J.has(F) ? J : (J.delete(F), new Jd(J)));
        };
      }, [F, he, fe]), /* @__PURE__ */ E.jsx(O, { [A]: "", ref: ie, children: I });
    }
  );
  w.displayName = S;
  function C() {
    return y.useState(new Jd());
  }
  Vt(C, "useInitCollection");
  function _(j) {
    const { itemMap: M } = f(a + "CollectionConsumer", j);
    return M;
  }
  return Vt(_, "useCollection"), [
    { Provider: m, Slot: v, ItemSlot: w },
    {
      createCollectionScope: u,
      useCollection: _,
      useInitCollection: C
    }
  ];
}
Vt(jC, "createCollection");
function P2(a, r) {
  if (a === r) return !0;
  if (typeof a != "object" || typeof r != "object" || a == null || r == null) return !1;
  const c = Object.keys(a), u = Object.keys(r);
  if (c.length !== u.length) return !1;
  for (const s of c)
    if (!Object.prototype.hasOwnProperty.call(r, s) || a[s] !== r[s]) return !1;
  return !0;
}
Vt(P2, "shallowEqual");
function F2(a, r) {
  return !!(r.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
Vt(F2, "isElementPreceding");
function pm(a, r) {
  return !a[1].element || !r[1].element ? 0 : F2(a[1].element, r[1].element) ? -1 : 1;
}
Vt(pm, "sortByDocumentPosition");
function J2(a) {
  return new MutationObserver((c) => {
    for (const u of c)
      if (u.type === "childList") {
        a();
        return;
      }
  });
}
Vt(J2, "getChildListObserver");
var UC = Object.defineProperty, Pr = (a, r) => UC(a, "name", { value: r, configurable: !0 }), $2 = !!(typeof window < "u" && window.document && window.document.createElement);
function Ce(a, r, { checkForDefaultPrevented: c = !0 } = {}) {
  return /* @__PURE__ */ Pr(function(s) {
    if (a?.(s), c === !1 || !s || !s.defaultPrevented)
      return r?.(s);
  }, "handleEvent");
}
Pr(Ce, "composeEventHandlers");
function HC(a) {
  if (!$2)
    throw new Error("Cannot access window outside of the DOM");
  return a?.ownerDocument?.defaultView ?? window;
}
Pr(HC, "getOwnerWindow");
function ym(a) {
  if (!$2)
    throw new Error("Cannot access document outside of the DOM");
  return a?.ownerDocument ?? document;
}
Pr(ym, "getOwnerDocument");
function W2(a, r = !1) {
  const { activeElement: c } = ym(a);
  if (!c?.nodeName)
    return null;
  if (ey(c) && c.contentDocument)
    return W2(c.contentDocument.body, r);
  if (r) {
    const u = c.getAttribute("aria-activedescendant");
    if (u) {
      const s = ym(c).getElementById(u);
      if (s)
        return s;
    }
  }
  return c;
}
Pr(W2, "getActiveElement");
function ey(a) {
  return a.tagName === "IFRAME";
}
Pr(ey, "isFrame");
var Dt = globalThis?.document ? y.useLayoutEffect : () => {
}, LC = Object.defineProperty, BC = (a, r) => LC(a, "name", { value: r, configurable: !0 }), Lp = Kr[" useEffectEvent ".trim().toString()], Bp = Kr[" useInsertionEffect ".trim().toString()];
function ty(a) {
  if (typeof Lp == "function")
    return Lp(a);
  const r = y.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Bp == "function" ? Bp(() => {
    r.current = a;
  }) : Dt(() => {
    r.current = a;
  }), y.useMemo(() => ((...c) => r.current?.(...c)), []);
}
BC(ty, "useEffectEvent");
var VC = Object.defineProperty, ru = (a, r) => VC(a, "name", { value: r, configurable: !0 }), GC = Kr[" useInsertionEffect ".trim().toString()] || Dt;
function zo({
  prop: a,
  defaultProp: r,
  onChange: c = /* @__PURE__ */ ru(() => {
  }, "onChange"),
  caller: u
}) {
  const [s, f, m] = ny({
    defaultProp: r,
    onChange: c
  }), h = a !== void 0, p = h ? a : s, b = y.useCallback(
    (x) => {
      if (h) {
        const v = ly(x) ? x(a) : x;
        v !== a && m.current?.(v);
      } else
        f(x);
    },
    [h, a, f, m]
  );
  return [p, b];
}
ru(zo, "useControllableState");
function ny({
  defaultProp: a,
  onChange: r
}) {
  const [c, u] = y.useState(a), s = y.useRef(c), f = y.useRef(r);
  return GC(() => {
    f.current = r;
  }, [r]), y.useEffect(() => {
    s.current !== c && (f.current?.(c), s.current = c);
  }, [c, s]), [c, u, f];
}
ru(ny, "useUncontrolledState");
function ly(a) {
  return typeof a == "function";
}
ru(ly, "isFunction");
var Vp = /* @__PURE__ */ Symbol("RADIX:SYNC_STATE");
function YC(a, r, c, u) {
  const { prop: s, defaultProp: f, onChange: m, caller: h } = r, p = s !== void 0, b = ty(m), x = [{ ...c, state: f }];
  u && x.push(u);
  const [v, S] = y.useReducer(
    (C, _) => {
      if (_.type === Vp)
        return { ...C, state: _.state };
      const D = a(C, _);
      return p && !Object.is(D.state, C.state) && b(D.state), D;
    },
    ...x
  ), A = v.state, O = y.useRef(A);
  y.useEffect(() => {
    O.current !== A && (O.current = A, p || b(A));
  }, [A, O, p]);
  const w = y.useMemo(() => s !== void 0 ? { ...v, state: s } : v, [v, s]);
  return y.useEffect(() => {
    p && !Object.is(s, v.state) && S({ type: Vp, state: s });
  }, [s, v.state, p]), [w, S];
}
ru(YC, "useControllableStateReducer");
var qC = Object.defineProperty, $l = (a, r) => qC(a, "name", { value: r, configurable: !0 });
function ay(a, r) {
  return y.useReducer((c, u) => r[c][u] ?? c, a);
}
$l(ay, "useStateMachine");
var Ka = /* @__PURE__ */ $l((a) => {
  const { present: r, children: c } = a, u = oy(r), s = typeof c == "function" ? c({ present: u.isPresent }) : y.Children.only(c), f = ry(u.ref, iy(s));
  return typeof c == "function" || u.isPresent ? y.cloneElement(s, { ref: f }) : null;
}, "Presence");
function oy(a) {
  const [r, c] = y.useState(), u = y.useRef(null), s = y.useRef(a), f = y.useRef("none"), m = y.useRef(void 0), h = a ? "mounted" : "unmounted", [p, b] = ay(h, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return y.useEffect(() => {
    p === "mounted" ? (f.current = m.current ?? Ir(u.current), m.current = void 0) : f.current = "none";
  }, [p]), Dt(() => {
    const x = u.current, v = s.current;
    if (v !== a) {
      const A = f.current, O = Ir(x);
      a ? (m.current = O, b("MOUNT")) : O === "none" || x?.display === "none" ? b("UNMOUNT") : b(v && A !== O ? "ANIMATION_OUT" : "UNMOUNT"), s.current = a;
    }
  }, [a, b]), Dt(() => {
    if (r) {
      let x;
      const v = r.ownerDocument.defaultView ?? window, S = /* @__PURE__ */ $l((O) => {
        const C = Ir(u.current).includes(CSS.escape(O.animationName));
        if (O.target === r && C && (b("ANIMATION_END"), !s.current)) {
          const _ = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", x = v.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = _);
          });
        }
      }, "handleAnimationEnd"), A = /* @__PURE__ */ $l((O) => {
        O.target === r && (f.current = Ir(u.current));
      }, "handleAnimationStart");
      return r.addEventListener("animationstart", A), r.addEventListener("animationcancel", S), r.addEventListener("animationend", S), () => {
        v.clearTimeout(x), r.removeEventListener("animationstart", A), r.removeEventListener("animationcancel", S), r.removeEventListener("animationend", S);
      };
    } else
      b("ANIMATION_END");
  }, [r, b]), {
    isPresent: ["mounted", "unmountSuspended"].includes(p),
    ref: y.useCallback((x) => {
      if (x) {
        const v = getComputedStyle(x);
        u.current = v, m.current = Ir(v);
      } else
        u.current = null;
      c(x);
    }, [])
  };
}
$l(oy, "usePresence");
function bm(a, r) {
  if (typeof a == "function")
    return a(r);
  a != null && (a.current = r);
}
$l(bm, "setRef");
function ry(...a) {
  const r = y.useRef(a);
  return r.current = a, y.useCallback((c) => {
    const u = r.current;
    let s = !1;
    const f = u.map((m) => {
      const h = bm(m, c);
      return !s && typeof h == "function" && (s = !0), h;
    });
    if (s)
      return () => {
        for (let m = 0; m < f.length; m++) {
          const h = f[m];
          typeof h == "function" ? h() : bm(u[m], null);
        }
      };
  }, []);
}
$l(ry, "useStableComposedRefs");
function Ir(a) {
  return a?.animationName || "none";
}
$l(Ir, "getAnimationName");
function iy(a) {
  let r = Object.getOwnPropertyDescriptor(a.props, "ref")?.get, c = r && "isReactWarning" in r && r.isReactWarning;
  return c ? a.ref : (r = Object.getOwnPropertyDescriptor(a, "ref")?.get, c = r && "isReactWarning" in r && r.isReactWarning, c ? a.props.ref : a.props.ref || a.ref);
}
$l(iy, "getElementRef");
var kC = Object.defineProperty, IC = (a, r) => kC(a, "name", { value: r, configurable: !0 }), XC = Kr[" useId ".trim().toString()] || (() => {
}), QC = 0;
function Tl(a) {
  const [r, c] = y.useState(XC());
  return Dt(() => {
    a || c((u) => u ?? String(QC++));
  }, [a]), a || (r ? `radix-${r}` : "");
}
IC(Tl, "useId");
var ZC = Object.defineProperty, KC = (a, r) => ZC(a, "name", { value: r, configurable: !0 }), PC = y.createContext(void 0);
function rs(a) {
  const r = y.useContext(PC);
  return a || r || "ltr";
}
KC(rs, "useDirection");
var FC = Object.defineProperty, JC = (a, r) => FC(a, "name", { value: r, configurable: !0 });
function Xn(a) {
  const r = y.useRef(a);
  return y.useEffect(() => {
    r.current = a;
  }), y.useMemo(() => ((...c) => r.current?.(...c)), []);
}
JC(Xn, "useCallbackRef");
var $C = Object.defineProperty, Bt = (a, r) => $C(a, "name", { value: r, configurable: !0 }), Sm = "dismissableLayer.update", WC = "dismissableLayer.pointerDownOutside", ew = "dismissableLayer.focusOutside", Gp, uy = y.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), is = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Bt(function(r, c) {
    const {
      disableOutsidePointerEvents: u = !1,
      deferPointerDownOutside: s = !1,
      onEscapeKeyDown: f,
      onPointerDownOutside: m,
      onFocusOutside: h,
      onInteractOutside: p,
      onDismiss: b,
      ...x
    } = r, v = y.useContext(uy), [S, A] = y.useState(null), O = S?.ownerDocument ?? globalThis?.document, [, w] = y.useState({}), C = Fe(c, A), _ = Array.from(v.layers), [D] = [
      ...v.layersWithOutsidePointerEventsDisabled
    ].slice(-1), j = D ? _.indexOf(D) : -1, M = S ? _.indexOf(S) : -1, Y = v.layersWithOutsidePointerEventsDisabled.size > 0, I = M >= j, X = y.useRef(!1), L = sy(
      (ee) => {
        m?.(ee), p?.(ee), ee.defaultPrevented || b?.();
      },
      {
        ownerDocument: O,
        deferPointerDownOutside: s,
        isDeferredPointerDownOutsideRef: X,
        dismissableSurfaces: v.dismissableSurfaces,
        shouldHandlePointerDownOutside: y.useCallback(
          (ee) => {
            if (!(ee instanceof Node))
              return !1;
            const fe = [...v.branches].some(
              (ge) => ge.contains(ee)
            );
            return I && !fe;
          },
          [v.branches, I]
        )
      }
    ), F = fy((ee) => {
      if (s && X.current)
        return;
      const fe = ee.target;
      [...v.branches].some((he) => he.contains(fe)) || (h?.(ee), p?.(ee), ee.defaultPrevented || b?.());
    }, O), ae = S ? M === _.length - 1 : !1, ie = Xn((ee) => {
      ee.key === "Escape" && (f?.(ee), !ee.defaultPrevented && b && (ee.preventDefault(), b()));
    });
    return y.useEffect(() => {
      if (ae)
        return O.addEventListener("keydown", ie, { capture: !0 }), () => O.removeEventListener("keydown", ie, { capture: !0 });
    }, [O, ae, ie]), y.useEffect(() => {
      if (S)
        return u && (v.layersWithOutsidePointerEventsDisabled.size === 0 && (Gp = O.body.style.pointerEvents, O.body.style.pointerEvents = "none"), v.layersWithOutsidePointerEventsDisabled.add(S)), v.layers.add(S), xm(), () => {
          u && (v.layersWithOutsidePointerEventsDisabled.delete(S), v.layersWithOutsidePointerEventsDisabled.size === 0 && (O.body.style.pointerEvents = Gp));
        };
    }, [S, O, u, v]), y.useEffect(() => () => {
      S && (v.layers.delete(S), v.layersWithOutsidePointerEventsDisabled.delete(S), xm());
    }, [S, v]), y.useEffect(() => {
      const ee = /* @__PURE__ */ Bt(() => w({}), "handleUpdate");
      return document.addEventListener(Sm, ee), () => document.removeEventListener(Sm, ee);
    }, []), /* @__PURE__ */ E.jsx(
      it.div,
      {
        ...x,
        ref: C,
        style: {
          pointerEvents: Y ? I ? "auto" : "none" : void 0,
          ...r.style
        },
        onFocusCapture: Ce(r.onFocusCapture, F.onFocusCapture),
        onBlurCapture: Ce(r.onBlurCapture, F.onBlurCapture),
        onPointerDownCapture: Ce(
          r.onPointerDownCapture,
          L.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function cy() {
  const a = y.useContext(uy), [r, c] = y.useState(null);
  return y.useEffect(() => {
    if (r)
      return a.dismissableSurfaces.add(r), () => {
        a.dismissableSurfaces.delete(r);
      };
  }, [r, a.dismissableSurfaces]), c;
}
Bt(cy, "useDismissableLayerSurface");
var tw = /* @__PURE__ */ Bt(() => !0, "IS_TRUE");
function sy(a, r) {
  const {
    ownerDocument: c = globalThis?.document,
    deferPointerDownOutside: u = !1,
    isDeferredPointerDownOutsideRef: s,
    dismissableSurfaces: f,
    shouldHandlePointerDownOutside: m = tw
  } = r, h = Xn(a), p = y.useRef(!1), b = y.useRef(!1), x = y.useRef(/* @__PURE__ */ new Map()), v = y.useRef(() => {
  });
  return y.useEffect(() => {
    function S() {
      b.current = !1, s.current = !1, x.current.clear();
    }
    Bt(S, "resetOutsideInteraction");
    function A() {
      return Array.from(x.current.values()).some(Boolean);
    }
    Bt(A, "isOutsideInteractionIntercepted");
    function O(j) {
      if (!b.current)
        return;
      const M = j.target;
      M instanceof Node && [...f].some((I) => I.contains(M)) || x.current.set(j.type, !0), j.type === "click" && window.setTimeout(() => {
        b.current && v.current();
      }, 0);
    }
    Bt(O, "handleInteractionCapture");
    function w(j) {
      b.current && x.current.set(j.type, !1);
    }
    Bt(w, "handleInteractionBubble");
    const C = /* @__PURE__ */ Bt((j) => {
      if (j.target && !p.current) {
        let M = function() {
          c.removeEventListener("click", v.current);
          const I = A();
          S(), I || qm(
            WC,
            h,
            Y,
            { discrete: !0 }
          );
        };
        if (Bt(M, "handleAndDispatchPointerDownOutsideEvent"), !m(j.target)) {
          c.removeEventListener("click", v.current), S(), p.current = !1;
          return;
        }
        const Y = { originalEvent: j };
        b.current = !0, s.current = u && j.button === 0, x.current.clear(), !u || j.button !== 0 ? M() : (c.removeEventListener("click", v.current), v.current = M, c.addEventListener("click", v.current, { once: !0 }));
      } else
        c.removeEventListener("click", v.current), S();
      p.current = !1;
    }, "handlePointerDown"), _ = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const j of _)
      c.addEventListener(j, O, !0), c.addEventListener(j, w);
    const D = window.setTimeout(() => {
      c.addEventListener("pointerdown", C);
    }, 0);
    return () => {
      window.clearTimeout(D), c.removeEventListener("pointerdown", C), c.removeEventListener("click", v.current);
      for (const j of _)
        c.removeEventListener(j, O, !0), c.removeEventListener(j, w);
    };
  }, [
    c,
    h,
    u,
    s,
    f,
    m
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ Bt(() => p.current = !0, "onPointerDownCapture")
  };
}
Bt(sy, "usePointerDownOutside");
function fy(a, r = globalThis?.document) {
  const c = Xn(a), u = y.useRef(!1);
  return y.useEffect(() => {
    const s = /* @__PURE__ */ Bt((f) => {
      f.target && !u.current && qm(ew, c, { originalEvent: f }, {
        discrete: !1
      });
    }, "handleFocus");
    return r.addEventListener("focusin", s), () => r.removeEventListener("focusin", s);
  }, [r, c]), {
    onFocusCapture: /* @__PURE__ */ Bt(() => u.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ Bt(() => u.current = !1, "onBlurCapture")
  };
}
Bt(fy, "useFocusOutside");
function xm() {
  const a = new CustomEvent(Sm);
  document.dispatchEvent(a);
}
Bt(xm, "dispatchUpdate");
function qm(a, r, c, { discrete: u }) {
  const s = c.originalEvent.target, f = new CustomEvent(a, { bubbles: !1, cancelable: !0, detail: c });
  r && s.addEventListener(a, r, { once: !0 }), u ? Gm(s, f) : s.dispatchEvent(f);
}
Bt(qm, "handleAndDispatchCustomEvent");
var nw = Object.defineProperty, un = (a, r) => nw(a, "name", { value: r, configurable: !0 }), $d = "focusScope.autoFocusOnMount", Wd = "focusScope.autoFocusOnUnmount", Yp = { bubbles: !1, cancelable: !0 }, km = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ un(function(r, c) {
    const {
      loop: u = !1,
      trapped: s = !1,
      onMountAutoFocus: f,
      onUnmountAutoFocus: m,
      ...h
    } = r, [p, b] = y.useState(null), x = Xn(f), v = Xn(m), S = y.useRef(null), A = Fe(c, b), O = y.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    y.useEffect(() => {
      if (s) {
        let C = function(M) {
          if (O.paused || !p) return;
          const Y = M.target;
          p.contains(Y) ? S.current = Y : Pl(S.current, { select: !0 });
        }, _ = function(M) {
          if (O.paused || !p) return;
          const Y = M.relatedTarget;
          Y !== null && (p.contains(Y) || Pl(S.current, { select: !0 }));
        }, D = function(M) {
          if (document.activeElement === document.body)
            for (const I of M)
              I.removedNodes.length > 0 && Pl(p);
        };
        un(C, "handleFocusIn"), un(_, "handleFocusOut"), un(D, "handleMutations"), document.addEventListener("focusin", C), document.addEventListener("focusout", _);
        const j = new MutationObserver(D);
        return p && j.observe(p, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", C), document.removeEventListener("focusout", _), j.disconnect();
        };
      }
    }, [s, p, O.paused]), y.useEffect(() => {
      if (p) {
        qp.add(O);
        const C = document.activeElement;
        if (!p.contains(C)) {
          const D = new CustomEvent($d, Yp);
          p.addEventListener($d, x), p.dispatchEvent(D), D.defaultPrevented || (dy(py(Im(p)), { select: !0 }), document.activeElement === C && Pl(p));
        }
        return () => {
          p.removeEventListener($d, x), setTimeout(() => {
            const D = new CustomEvent(Wd, Yp);
            p.addEventListener(Wd, v), p.dispatchEvent(D), D.defaultPrevented || Pl(C ?? document.body, { select: !0 }), p.removeEventListener(Wd, v), qp.remove(O);
          }, 0);
        };
      }
    }, [p, x, v, O]);
    const w = y.useCallback(
      (C) => {
        if (!u && !s || O.paused) return;
        const _ = C.key === "Tab" && !C.altKey && !C.ctrlKey && !C.metaKey, D = document.activeElement;
        if (_ && D) {
          const j = C.currentTarget, [M, Y] = my(j);
          M && Y ? !C.shiftKey && D === Y ? (C.preventDefault(), u && Pl(M, { select: !0 })) : C.shiftKey && D === M && (C.preventDefault(), u && Pl(Y, { select: !0 })) : D === j && C.preventDefault();
        }
      },
      [u, s, O.paused]
    );
    return /* @__PURE__ */ E.jsx(it.div, { tabIndex: -1, ...h, ref: A, onKeyDown: w });
  }, "FocusScope")
);
function dy(a, { select: r = !1 } = {}) {
  const c = document.activeElement;
  for (const u of a)
    if (Pl(u, { select: r }), document.activeElement !== c) return;
}
un(dy, "focusFirst");
function my(a) {
  const r = Im(a), c = Em(r, a), u = Em(r.reverse(), a);
  return [c, u];
}
un(my, "getTabbableEdges");
function Im(a) {
  const r = [], c = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ un((u) => {
      const s = u.tagName === "INPUT" && u.type === "hidden";
      return u.disabled || u.hidden || s ? NodeFilter.FILTER_SKIP : u.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; c.nextNode(); ) r.push(c.currentNode);
  return r;
}
un(Im, "getTabbableCandidates");
function Em(a, r) {
  const c = typeof r.checkVisibility == "function" && r.checkVisibility({ checkVisibilityCSS: !0 });
  for (const u of a)
    if (!(c ? !u.checkVisibility({ checkVisibilityCSS: !0 }) : hy(u, { upTo: r })))
      return u;
}
un(Em, "findVisible");
function hy(a, { upTo: r }) {
  if (getComputedStyle(a).visibility === "hidden") return !0;
  for (; a; ) {
    if (r !== void 0 && a === r) return !1;
    if (getComputedStyle(a).display === "none") return !0;
    a = a.parentElement;
  }
  return !1;
}
un(hy, "isHidden");
function vy(a) {
  return a instanceof HTMLInputElement && "select" in a;
}
un(vy, "isSelectableInput");
function Pl(a, { select: r = !1 } = {}) {
  if (a && a.focus) {
    const c = document.activeElement;
    a.focus({ preventScroll: !0 }), a !== c && vy(a) && r && a.select();
  }
}
un(Pl, "focus");
var qp = gy();
function gy() {
  let a = [];
  return {
    add(r) {
      const c = a[0];
      r !== c && c?.pause(), a = Cm(a, r), a.unshift(r);
    },
    remove(r) {
      a = Cm(a, r), a[0]?.resume();
    }
  };
}
un(gy, "createFocusScopesStack");
function Cm(a, r) {
  const c = [...a], u = c.indexOf(r);
  return u !== -1 && c.splice(u, 1), c;
}
un(Cm, "arrayRemove");
function py(a) {
  return a.filter((r) => r.tagName !== "A");
}
un(py, "removeLinks");
var lw = Object.defineProperty, aw = (a, r) => lw(a, "name", { value: r, configurable: !0 }), us = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ aw(function(r, c) {
    const { container: u, ...s } = r, [f, m] = y.useState(!1);
    Dt(() => m(!0), []);
    const h = u || f && globalThis?.document?.body;
    return h ? ou.createPortal(/* @__PURE__ */ E.jsx(it.div, { ...s, ref: c }), h) : null;
  }, "Portal")
), ow = Object.defineProperty, Xm = (a, r) => ow(a, "name", { value: r, configurable: !0 }), Vc = 0, Gr = null;
function rw(a) {
  return iu(), a.children;
}
Xm(rw, "FocusGuards");
function iu() {
  y.useEffect(() => {
    Gr || (Gr = { start: wm(), end: wm() });
    const { start: a, end: r } = Gr;
    return document.body.firstElementChild !== a && document.body.insertAdjacentElement("afterbegin", a), document.body.lastElementChild !== r && document.body.insertAdjacentElement("beforeend", r), Vc++, () => {
      Vc === 1 && (Gr?.start.remove(), Gr?.end.remove(), Gr = null), Vc = Math.max(0, Vc - 1);
    };
  }, []);
}
Xm(iu, "useFocusGuards");
function wm() {
  const a = document.createElement("span");
  return a.setAttribute("data-radix-focus-guard", ""), a.tabIndex = 0, a.style.outline = "none", a.style.opacity = "0", a.style.position = "fixed", a.style.pointerEvents = "none", a;
}
Xm(wm, "createFocusGuard");
var Cl = function() {
  return Cl = Object.assign || function(r) {
    for (var c, u = 1, s = arguments.length; u < s; u++) {
      c = arguments[u];
      for (var f in c) Object.prototype.hasOwnProperty.call(c, f) && (r[f] = c[f]);
    }
    return r;
  }, Cl.apply(this, arguments);
};
function yy(a, r) {
  var c = {};
  for (var u in a) Object.prototype.hasOwnProperty.call(a, u) && r.indexOf(u) < 0 && (c[u] = a[u]);
  if (a != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, u = Object.getOwnPropertySymbols(a); s < u.length; s++)
      r.indexOf(u[s]) < 0 && Object.prototype.propertyIsEnumerable.call(a, u[s]) && (c[u[s]] = a[u[s]]);
  return c;
}
function iw(a, r, c) {
  if (c || arguments.length === 2) for (var u = 0, s = r.length, f; u < s; u++)
    (f || !(u in r)) && (f || (f = Array.prototype.slice.call(r, 0, u)), f[u] = r[u]);
  return a.concat(f || Array.prototype.slice.call(r));
}
var Kc = "right-scroll-bar-position", Pc = "width-before-scroll-bar", uw = "with-scroll-bars-hidden", cw = "--removed-body-scroll-bar-size";
function em(a, r) {
  return typeof a == "function" ? a(r) : a && (a.current = r), a;
}
function sw(a, r) {
  var c = y.useState(function() {
    return {
      // value
      value: a,
      // last callback
      callback: r,
      // "memoized" public interface
      facade: {
        get current() {
          return c.value;
        },
        set current(u) {
          var s = c.value;
          s !== u && (c.value = u, c.callback(u, s));
        }
      }
    };
  })[0];
  return c.callback = r, c.facade;
}
var fw = typeof window < "u" ? y.useLayoutEffect : y.useEffect, kp = /* @__PURE__ */ new WeakMap();
function dw(a, r) {
  var c = sw(null, function(u) {
    return a.forEach(function(s) {
      return em(s, u);
    });
  });
  return fw(function() {
    var u = kp.get(c);
    if (u) {
      var s = new Set(u), f = new Set(a), m = c.current;
      s.forEach(function(h) {
        f.has(h) || em(h, null);
      }), f.forEach(function(h) {
        s.has(h) || em(h, m);
      });
    }
    kp.set(c, a);
  }, [a]), c;
}
function mw(a) {
  return a;
}
function hw(a, r) {
  r === void 0 && (r = mw);
  var c = [], u = !1, s = {
    read: function() {
      if (u)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return c.length ? c[c.length - 1] : a;
    },
    useMedium: function(f) {
      var m = r(f, u);
      return c.push(m), function() {
        c = c.filter(function(h) {
          return h !== m;
        });
      };
    },
    assignSyncMedium: function(f) {
      for (u = !0; c.length; ) {
        var m = c;
        c = [], m.forEach(f);
      }
      c = {
        push: function(h) {
          return f(h);
        },
        filter: function() {
          return c;
        }
      };
    },
    assignMedium: function(f) {
      u = !0;
      var m = [];
      if (c.length) {
        var h = c;
        c = [], h.forEach(f), m = c;
      }
      var p = function() {
        var x = m;
        m = [], x.forEach(f);
      }, b = function() {
        return Promise.resolve().then(p);
      };
      b(), c = {
        push: function(x) {
          m.push(x), b();
        },
        filter: function(x) {
          return m = m.filter(x), c;
        }
      };
    }
  };
  return s;
}
function vw(a) {
  a === void 0 && (a = {});
  var r = hw(null);
  return r.options = Cl({ async: !0, ssr: !1 }, a), r;
}
var by = function(a) {
  var r = a.sideCar, c = yy(a, ["sideCar"]);
  if (!r)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var u = r.read();
  if (!u)
    throw new Error("Sidecar medium not found");
  return y.createElement(u, Cl({}, c));
};
by.isSideCarExport = !0;
function gw(a, r) {
  return a.useMedium(r), by;
}
var Sy = vw(), tm = function() {
}, cs = y.forwardRef(function(a, r) {
  var c = y.useRef(null), u = y.useState({
    onScrollCapture: tm,
    onWheelCapture: tm,
    onTouchMoveCapture: tm
  }), s = u[0], f = u[1], m = a.forwardProps, h = a.children, p = a.className, b = a.removeScrollBar, x = a.enabled, v = a.shards, S = a.sideCar, A = a.noRelative, O = a.noIsolation, w = a.inert, C = a.allowPinchZoom, _ = a.as, D = _ === void 0 ? "div" : _, j = a.gapMode, M = yy(a, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), Y = S, I = dw([c, r]), X = Cl(Cl({}, M), s);
  return y.createElement(
    y.Fragment,
    null,
    x && y.createElement(Y, { sideCar: Sy, removeScrollBar: b, shards: v, noRelative: A, noIsolation: O, inert: w, setCallbacks: f, allowPinchZoom: !!C, lockRef: c, gapMode: j }),
    m ? y.cloneElement(y.Children.only(h), Cl(Cl({}, X), { ref: I })) : y.createElement(D, Cl({}, X, { className: p, ref: I }), h)
  );
});
cs.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
cs.classNames = {
  fullWidth: Pc,
  zeroRight: Kc
};
var pw = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function yw() {
  if (!document)
    return null;
  var a = document.createElement("style");
  a.type = "text/css";
  var r = pw();
  return r && a.setAttribute("nonce", r), a;
}
function bw(a, r) {
  a.styleSheet ? a.styleSheet.cssText = r : a.appendChild(document.createTextNode(r));
}
function Sw(a) {
  var r = document.head || document.getElementsByTagName("head")[0];
  r.appendChild(a);
}
var xw = function() {
  var a = 0, r = null;
  return {
    add: function(c) {
      a == 0 && (r = yw()) && (bw(r, c), Sw(r)), a++;
    },
    remove: function() {
      a--, !a && r && (r.parentNode && r.parentNode.removeChild(r), r = null);
    }
  };
}, Ew = function() {
  var a = xw();
  return function(r, c) {
    y.useEffect(function() {
      return a.add(r), function() {
        a.remove();
      };
    }, [r && c]);
  };
}, xy = function() {
  var a = Ew(), r = function(c) {
    var u = c.styles, s = c.dynamic;
    return a(u, s), null;
  };
  return r;
}, Cw = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, nm = function(a) {
  return parseInt(a || "", 10) || 0;
}, ww = function(a) {
  var r = window.getComputedStyle(document.body), c = r[a === "padding" ? "paddingLeft" : "marginLeft"], u = r[a === "padding" ? "paddingTop" : "marginTop"], s = r[a === "padding" ? "paddingRight" : "marginRight"];
  return [nm(c), nm(u), nm(s)];
}, Tw = function(a) {
  if (a === void 0 && (a = "margin"), typeof window > "u")
    return Cw;
  var r = ww(a), c = document.documentElement.clientWidth, u = window.innerWidth;
  return {
    left: r[0],
    top: r[1],
    right: r[2],
    gap: Math.max(0, u - c + r[2] - r[0])
  };
}, Aw = xy(), Xr = "data-scroll-locked", Ow = function(a, r, c, u) {
  var s = a.left, f = a.top, m = a.right, h = a.gap;
  return c === void 0 && (c = "margin"), `
  .`.concat(uw, ` {
   overflow: hidden `).concat(u, `;
   padding-right: `).concat(h, "px ").concat(u, `;
  }
  body[`).concat(Xr, `] {
    overflow: hidden `).concat(u, `;
    overscroll-behavior: contain;
    `).concat([
    r && "position: relative ".concat(u, ";"),
    c === "margin" && `
    padding-left: `.concat(s, `px;
    padding-top: `).concat(f, `px;
    padding-right: `).concat(m, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(h, "px ").concat(u, `;
    `),
    c === "padding" && "padding-right: ".concat(h, "px ").concat(u, ";")
  ].filter(Boolean).join(""), `
  }

  .`).concat(Kc, ` {
    right: `).concat(h, "px ").concat(u, `;
  }

  .`).concat(Pc, ` {
    margin-right: `).concat(h, "px ").concat(u, `;
  }

  .`).concat(Kc, " .").concat(Kc, ` {
    right: 0 `).concat(u, `;
  }

  .`).concat(Pc, " .").concat(Pc, ` {
    margin-right: 0 `).concat(u, `;
  }

  body[`).concat(Xr, `] {
    `).concat(cw, ": ").concat(h, `px;
  }
`);
}, Ip = function() {
  var a = parseInt(document.body.getAttribute(Xr) || "0", 10);
  return isFinite(a) ? a : 0;
}, _w = function() {
  y.useEffect(function() {
    return document.body.setAttribute(Xr, (Ip() + 1).toString()), function() {
      var a = Ip() - 1;
      a <= 0 ? document.body.removeAttribute(Xr) : document.body.setAttribute(Xr, a.toString());
    };
  }, []);
}, Rw = function(a) {
  var r = a.noRelative, c = a.noImportant, u = a.gapMode, s = u === void 0 ? "margin" : u;
  _w();
  var f = y.useMemo(function() {
    return Tw(s);
  }, [s]);
  return y.createElement(Aw, { styles: Ow(f, !r, s, c ? "" : "!important") });
}, Tm = !1;
if (typeof window < "u")
  try {
    var Gc = Object.defineProperty({}, "passive", {
      get: function() {
        return Tm = !0, !0;
      }
    });
    window.addEventListener("test", Gc, Gc), window.removeEventListener("test", Gc, Gc);
  } catch {
    Tm = !1;
  }
var Yr = Tm ? { passive: !1 } : !1, Mw = function(a) {
  return a.tagName === "TEXTAREA";
}, Ey = function(a, r) {
  if (!(a instanceof Element))
    return !1;
  var c = window.getComputedStyle(a);
  return (
    // not-not-scrollable
    c[r] !== "hidden" && // contains scroll inside self
    !(c.overflowY === c.overflowX && !Mw(a) && c[r] === "visible")
  );
}, Nw = function(a) {
  return Ey(a, "overflowY");
}, Dw = function(a) {
  return Ey(a, "overflowX");
}, Xp = function(a, r) {
  var c = r.ownerDocument, u = r;
  do {
    typeof ShadowRoot < "u" && u instanceof ShadowRoot && (u = u.host);
    var s = Cy(a, u);
    if (s) {
      var f = wy(a, u), m = f[1], h = f[2];
      if (m > h)
        return !0;
    }
    u = u.parentNode;
  } while (u && u !== c.body);
  return !1;
}, zw = function(a) {
  var r = a.scrollTop, c = a.scrollHeight, u = a.clientHeight;
  return [
    r,
    c,
    u
  ];
}, jw = function(a) {
  var r = a.scrollLeft, c = a.scrollWidth, u = a.clientWidth;
  return [
    r,
    c,
    u
  ];
}, Cy = function(a, r) {
  return a === "v" ? Nw(r) : Dw(r);
}, wy = function(a, r) {
  return a === "v" ? zw(r) : jw(r);
}, Uw = function(a, r) {
  return a === "h" && r === "rtl" ? -1 : 1;
}, Hw = function(a, r, c, u, s) {
  var f = Uw(a, window.getComputedStyle(r).direction), m = f * u, h = c.target, p = r.contains(h), b = !1, x = m > 0, v = 0, S = 0;
  do {
    if (!h)
      break;
    var A = wy(a, h), O = A[0], w = A[1], C = A[2], _ = w - C - f * O;
    (O || _) && Cy(a, h) && (v += _, S += O);
    var D = h.parentNode;
    h = D && D.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? D.host : D;
  } while (
    // portaled content
    !p && h !== document.body || // self content
    p && (r.contains(h) || r === h)
  );
  return (x && Math.abs(v) < 1 || !x && Math.abs(S) < 1) && (b = !0), b;
}, Yc = function(a) {
  return "changedTouches" in a ? [a.changedTouches[0].clientX, a.changedTouches[0].clientY] : [0, 0];
}, Qp = function(a) {
  return [a.deltaX, a.deltaY];
}, Zp = function(a) {
  return a && "current" in a ? a.current : a;
}, Lw = function(a, r) {
  return a[0] === r[0] && a[1] === r[1];
}, Bw = function(a) {
  return `
  .block-interactivity-`.concat(a, ` {pointer-events: none;}
  .allow-interactivity-`).concat(a, ` {pointer-events: all;}
`);
}, Vw = 0, qr = [];
function Gw(a) {
  var r = y.useRef([]), c = y.useRef([0, 0]), u = y.useRef(), s = y.useState(Vw++)[0], f = y.useState(xy)[0], m = y.useRef(a);
  y.useEffect(function() {
    m.current = a;
  }, [a]), y.useEffect(function() {
    if (a.inert) {
      document.body.classList.add("block-interactivity-".concat(s));
      var w = iw([a.lockRef.current], (a.shards || []).map(Zp), !0).filter(Boolean);
      return w.forEach(function(C) {
        return C.classList.add("allow-interactivity-".concat(s));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(s)), w.forEach(function(C) {
          return C.classList.remove("allow-interactivity-".concat(s));
        });
      };
    }
  }, [a.inert, a.lockRef.current, a.shards]);
  var h = y.useCallback(function(w, C) {
    if ("touches" in w && w.touches.length === 2 || w.type === "wheel" && w.ctrlKey)
      return !m.current.allowPinchZoom;
    var _ = Yc(w), D = c.current, j = "deltaX" in w ? w.deltaX : D[0] - _[0], M = "deltaY" in w ? w.deltaY : D[1] - _[1], Y, I = w.target, X = Math.abs(j) > Math.abs(M) ? "h" : "v";
    if ("touches" in w && X === "h" && I.type === "range")
      return !1;
    var L = window.getSelection(), F = L && L.anchorNode, ae = F ? F === I || F.contains(I) : !1;
    if (ae)
      return !1;
    var ie = Xp(X, I);
    if (!ie)
      return !0;
    if (ie ? Y = X : (Y = X === "v" ? "h" : "v", ie = Xp(X, I)), !ie)
      return !1;
    if (!u.current && "changedTouches" in w && (j || M) && (u.current = Y), !Y)
      return !0;
    var ee = u.current || Y;
    return Hw(ee, C, w, ee === "h" ? j : M);
  }, []), p = y.useCallback(function(w) {
    var C = w;
    if (!(!qr.length || qr[qr.length - 1] !== f)) {
      var _ = "deltaY" in C ? Qp(C) : Yc(C), D = r.current.filter(function(Y) {
        return Y.name === C.type && (Y.target === C.target || C.target === Y.shadowParent) && Lw(Y.delta, _);
      })[0];
      if (D && D.should) {
        C.cancelable && C.preventDefault();
        return;
      }
      if (!D) {
        var j = (m.current.shards || []).map(Zp).filter(Boolean).filter(function(Y) {
          return Y.contains(C.target);
        }), M = j.length > 0 ? h(C, j[0]) : !m.current.noIsolation;
        M && C.cancelable && C.preventDefault();
      }
    }
  }, []), b = y.useCallback(function(w, C, _, D) {
    var j = { name: w, delta: C, target: _, should: D, shadowParent: Yw(_) };
    r.current.push(j), setTimeout(function() {
      r.current = r.current.filter(function(M) {
        return M !== j;
      });
    }, 1);
  }, []), x = y.useCallback(function(w) {
    c.current = Yc(w), u.current = void 0;
  }, []), v = y.useCallback(function(w) {
    b(w.type, Qp(w), w.target, h(w, a.lockRef.current));
  }, []), S = y.useCallback(function(w) {
    b(w.type, Yc(w), w.target, h(w, a.lockRef.current));
  }, []);
  y.useEffect(function() {
    return qr.push(f), a.setCallbacks({
      onScrollCapture: v,
      onWheelCapture: v,
      onTouchMoveCapture: S
    }), document.addEventListener("wheel", p, Yr), document.addEventListener("touchmove", p, Yr), document.addEventListener("touchstart", x, Yr), function() {
      qr = qr.filter(function(w) {
        return w !== f;
      }), document.removeEventListener("wheel", p, Yr), document.removeEventListener("touchmove", p, Yr), document.removeEventListener("touchstart", x, Yr);
    };
  }, []);
  var A = a.removeScrollBar, O = a.inert;
  return y.createElement(
    y.Fragment,
    null,
    O ? y.createElement(f, { styles: Bw(s) }) : null,
    A ? y.createElement(Rw, { noRelative: a.noRelative, gapMode: a.gapMode }) : null
  );
}
function Yw(a) {
  for (var r = null; a !== null; )
    a instanceof ShadowRoot && (r = a.host, a = a.host), a = a.parentNode;
  return r;
}
const qw = gw(Sy, Gw);
var ss = y.forwardRef(function(a, r) {
  return y.createElement(cs, Cl({}, a, { ref: r, sideCar: qw }));
});
ss.classNames = cs.classNames;
var kw = function(a) {
  if (typeof document > "u")
    return null;
  var r = Array.isArray(a) ? a[0] : a;
  return r.ownerDocument.body;
}, kr = /* @__PURE__ */ new WeakMap(), qc = /* @__PURE__ */ new WeakMap(), kc = {}, lm = 0, Ty = function(a) {
  return a && (a.host || Ty(a.parentNode));
}, Iw = function(a, r) {
  return r.map(function(c) {
    if (a.contains(c))
      return c;
    var u = Ty(c);
    return u && a.contains(u) ? u : (console.error("aria-hidden", c, "in not contained inside", a, ". Doing nothing"), null);
  }).filter(function(c) {
    return !!c;
  });
}, Xw = function(a, r, c, u) {
  var s = Iw(r, Array.isArray(a) ? a : [a]);
  kc[c] || (kc[c] = /* @__PURE__ */ new WeakMap());
  var f = kc[c], m = [], h = /* @__PURE__ */ new Set(), p = new Set(s), b = function(v) {
    !v || h.has(v) || (h.add(v), b(v.parentNode));
  };
  s.forEach(b);
  var x = function(v) {
    !v || p.has(v) || Array.prototype.forEach.call(v.children, function(S) {
      if (h.has(S))
        x(S);
      else
        try {
          var A = S.getAttribute(u), O = A !== null && A !== "false", w = (kr.get(S) || 0) + 1, C = (f.get(S) || 0) + 1;
          kr.set(S, w), f.set(S, C), m.push(S), w === 1 && O && qc.set(S, !0), C === 1 && S.setAttribute(c, "true"), O || S.setAttribute(u, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", S, _);
        }
    });
  };
  return x(r), h.clear(), lm++, function() {
    m.forEach(function(v) {
      var S = kr.get(v) - 1, A = f.get(v) - 1;
      kr.set(v, S), f.set(v, A), S || (qc.has(v) || v.removeAttribute(u), qc.delete(v)), A || v.removeAttribute(c);
    }), lm--, lm || (kr = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), qc = /* @__PURE__ */ new WeakMap(), kc = {});
  };
}, Qm = function(a, r, c) {
  c === void 0 && (c = "data-aria-hidden");
  var u = Array.from(Array.isArray(a) ? a : [a]), s = kw(a);
  return s ? (u.push.apply(u, Array.from(s.querySelectorAll("[aria-live], script"))), Xw(u, s, c, "aria-hidden")) : function() {
    return null;
  };
}, Qw = Object.defineProperty, Nn = (a, r) => Qw(a, "name", { value: r, configurable: !0 }), Zm = "Dialog", [Ay, f4] = /* @__PURE__ */ Ml(Zm), [Zw, rl] = Ay(Zm), Oy = /* @__PURE__ */ Nn((a) => {
  const {
    __scopeDialog: r,
    children: c,
    open: u,
    defaultOpen: s,
    onOpenChange: f,
    modal: m = !0
  } = a, h = y.useRef(null), p = y.useRef(null), [b, x] = zo({
    prop: u,
    defaultProp: s ?? !1,
    onChange: f,
    caller: Zm
  }), [v, S] = y.useState(0), [A, O] = y.useState(0);
  return /* @__PURE__ */ E.jsx(
    Zw,
    {
      scope: r,
      triggerRef: h,
      contentRef: p,
      contentId: Tl(),
      titleId: Tl(),
      descriptionId: Tl(),
      titlePresent: v > 0,
      descriptionPresent: A > 0,
      setTitleCount: S,
      setDescriptionCount: O,
      open: b,
      onOpenChange: x,
      onOpenToggle: y.useCallback(() => x((w) => !w), [x]),
      modal: m,
      children: c
    }
  );
}, "Dialog"), Kw = "DialogTrigger", _y = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, ...s } = r, f = rl(Kw, u), m = Fe(c, f.triggerRef);
    return /* @__PURE__ */ E.jsx(
      it.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": f.open,
        "aria-controls": f.open ? f.contentId : void 0,
        "data-state": fs(f.open),
        ...s,
        ref: m,
        onClick: Ce(r.onClick, f.onOpenToggle)
      }
    );
  }, "DialogTrigger")
), Ry = "DialogPortal", [Pw, My] = Ay(Ry, {
  forceMount: void 0
}), Ny = /* @__PURE__ */ Nn((a) => {
  const { __scopeDialog: r, forceMount: c, children: u, container: s } = a, f = rl(Ry, r);
  return /* @__PURE__ */ E.jsx(Pw, { scope: r, forceMount: c, children: y.Children.map(u, (m) => /* @__PURE__ */ E.jsx(Ka, { present: c || f.open, children: /* @__PURE__ */ E.jsx(us, { asChild: !0, container: s, children: m }) })) });
}, "DialogPortal"), Am = "DialogOverlay", Dy = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Nn(function(r, c) {
    const u = My(Am, r.__scopeDialog), { forceMount: s = u.forceMount, ...f } = r, m = rl(Am, r.__scopeDialog);
    return m.modal ? /* @__PURE__ */ E.jsx(Ka, { present: s || m.open, children: /* @__PURE__ */ E.jsx(Jw, { ...f, ref: c }) }) : null;
  }, "DialogOverlay")
), Fw = /* @__PURE__ */ Al("DialogOverlay.RemoveScroll"), Jw = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, ...s } = r, f = rl(Am, u), m = cy(), h = Fe(c, m);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ E.jsx(ss, { as: Fw, allowPinchZoom: !0, shards: [f.contentRef], children: /* @__PURE__ */ E.jsx(
        it.div,
        {
          "data-state": fs(f.open),
          ...s,
          ref: h,
          style: { pointerEvents: "auto", ...s.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), tu = "DialogContent", zy = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Nn(function(r, c) {
    const u = My(tu, r.__scopeDialog), { forceMount: s = u.forceMount, ...f } = r, m = rl(tu, r.__scopeDialog);
    return /* @__PURE__ */ E.jsx(Ka, { present: s || m.open, children: m.modal ? /* @__PURE__ */ E.jsx($w, { ...f, ref: c }) : /* @__PURE__ */ E.jsx(Ww, { ...f, ref: c }) });
  }, "DialogContent")
), $w = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Nn(function(r, c) {
    const u = rl(tu, r.__scopeDialog), s = y.useRef(null), f = Fe(c, u.contentRef, s);
    return y.useEffect(() => {
      const m = s.current;
      if (m) return Qm(m);
    }, []), /* @__PURE__ */ E.jsx(
      jy,
      {
        ...r,
        ref: f,
        trapFocus: u.open,
        disableOutsidePointerEvents: u.open,
        onCloseAutoFocus: Ce(r.onCloseAutoFocus, (m) => {
          m.preventDefault(), u.triggerRef.current?.focus();
        }),
        onPointerDownOutside: Ce(r.onPointerDownOutside, (m) => {
          const h = m.detail.originalEvent, p = h.button === 0 && h.ctrlKey === !0;
          (h.button === 2 || p) && m.preventDefault();
        }),
        onFocusOutside: Ce(
          r.onFocusOutside,
          (m) => m.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), Ww = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Nn(function(r, c) {
    const u = rl(tu, r.__scopeDialog), s = y.useRef(!1), f = y.useRef(!1);
    return /* @__PURE__ */ E.jsx(
      jy,
      {
        ...r,
        ref: c,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (m) => {
          r.onCloseAutoFocus?.(m), m.defaultPrevented || (s.current || u.triggerRef.current?.focus(), m.preventDefault()), s.current = !1, f.current = !1;
        },
        onInteractOutside: (m) => {
          r.onInteractOutside?.(m), m.defaultPrevented || (s.current = !0, m.detail.originalEvent.type === "pointerdown" && (f.current = !0));
          const h = m.target;
          u.triggerRef.current?.contains(h) && m.preventDefault(), m.detail.originalEvent.type === "focusin" && f.current && m.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), jy = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, trapFocus: s, onOpenAutoFocus: f, onCloseAutoFocus: m, ...h } = r, p = rl(tu, u);
    return iu(), /* @__PURE__ */ E.jsx(E.Fragment, { children: /* @__PURE__ */ E.jsx(
      km,
      {
        asChild: !0,
        loop: !0,
        trapped: s,
        onMountAutoFocus: f,
        onUnmountAutoFocus: m,
        children: /* @__PURE__ */ E.jsx(
          is,
          {
            role: "dialog",
            id: p.contentId,
            "aria-describedby": p.descriptionPresent ? p.descriptionId : void 0,
            "aria-labelledby": p.titlePresent ? p.titleId : void 0,
            "data-state": fs(p.open),
            ...h,
            ref: c,
            deferPointerDownOutside: !0,
            onDismiss: () => p.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), eT = "DialogTitle", Uy = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, ...s } = r, f = rl(eT, u), { setTitleCount: m } = f;
    return Dt(() => (m((h) => h + 1), () => m((h) => h - 1)), [m]), /* @__PURE__ */ E.jsx(it.h2, { id: f.titleId, ...s, ref: c });
  }, "DialogTitle")
), tT = "DialogDescription", Hy = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, ...s } = r, f = rl(tT, u), { setDescriptionCount: m } = f;
    return Dt(() => (m((h) => h + 1), () => m((h) => h - 1)), [m]), /* @__PURE__ */ E.jsx(it.p, { id: f.descriptionId, ...s, ref: c });
  }, "DialogDescription")
), nT = "DialogClose", Ly = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Nn(function(r, c) {
    const { __scopeDialog: u, ...s } = r, f = rl(nT, u);
    return /* @__PURE__ */ E.jsx(
      it.button,
      {
        type: "button",
        ...s,
        ref: c,
        onClick: Ce(r.onClick, () => f.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function fs(a) {
  return a ? "open" : "closed";
}
Nn(fs, "getState");
var lT = Object.defineProperty, aT = (a, r) => lT(a, "name", { value: r, configurable: !0 });
function By(a) {
  const [r, c] = y.useState(void 0);
  return Dt(() => {
    if (a) {
      c({ width: a.offsetWidth, height: a.offsetHeight });
      const u = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length)
          return;
        const f = s[0];
        let m, h;
        if ("borderBoxSize" in f) {
          const p = f.borderBoxSize, b = Array.isArray(p) ? p[0] : p;
          m = b.inlineSize, h = b.blockSize;
        } else
          m = a.offsetWidth, h = a.offsetHeight;
        c({ width: m, height: h });
      });
      return u.observe(a, { box: "border-box" }), () => u.unobserve(a);
    } else
      c(void 0);
  }, [a]), r;
}
aT(By, "useSize");
const oT = ["top", "right", "bottom", "left"], ka = Math.min, Fl = Math.max, Wc = Math.round, Ic = Math.floor, Jl = (a) => ({
  x: a,
  y: a
}), rT = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Vy(a, r, c) {
  return Fl(a, ka(r, c));
}
function Wl(a, r) {
  return typeof a == "function" ? a(r) : a;
}
function Ia(a) {
  return a.split("-")[0];
}
function Fr(a) {
  return a.split("-")[1];
}
function Km(a) {
  return a === "x" ? "y" : "x";
}
function Pm(a) {
  return a === "y" ? "height" : "width";
}
function wl(a) {
  const r = a[0];
  return r === "t" || r === "b" ? "y" : "x";
}
function Fm(a) {
  return Km(wl(a));
}
function iT(a, r, c) {
  c === void 0 && (c = !1);
  const u = Fr(a), s = Fm(a), f = Pm(s);
  let m = s === "x" ? u === (c ? "end" : "start") ? "right" : "left" : u === "start" ? "bottom" : "top";
  return r.reference[f] > r.floating[f] && (m = es(m)), [m, es(m)];
}
function uT(a) {
  const r = es(a);
  return [Om(a), r, Om(r)];
}
function Om(a) {
  return a.includes("start") ? a.replace("start", "end") : a.replace("end", "start");
}
const Kp = ["left", "right"], Pp = ["right", "left"], cT = ["top", "bottom"], sT = ["bottom", "top"];
function fT(a, r, c) {
  switch (a) {
    case "top":
    case "bottom":
      return c ? r ? Pp : Kp : r ? Kp : Pp;
    case "left":
    case "right":
      return r ? cT : sT;
    default:
      return [];
  }
}
function dT(a, r, c, u) {
  const s = Fr(a);
  let f = fT(Ia(a), c === "start", u);
  return s && (f = f.map((m) => m + "-" + s), r && (f = f.concat(f.map(Om)))), f;
}
function es(a) {
  const r = Ia(a);
  return rT[r] + a.slice(r.length);
}
function mT(a) {
  var r, c, u, s;
  return {
    top: (r = a.top) != null ? r : 0,
    right: (c = a.right) != null ? c : 0,
    bottom: (u = a.bottom) != null ? u : 0,
    left: (s = a.left) != null ? s : 0
  };
}
function Gy(a) {
  return typeof a != "number" ? mT(a) : {
    top: a,
    right: a,
    bottom: a,
    left: a
  };
}
function ts(a) {
  const {
    x: r,
    y: c,
    width: u,
    height: s
  } = a;
  return {
    width: u,
    height: s,
    top: c,
    left: r,
    right: r + u,
    bottom: c + s,
    x: r,
    y: c
  };
}
function Fp(a, r, c) {
  let {
    reference: u,
    floating: s
  } = a;
  const f = wl(r), m = Fm(r), h = Pm(m), p = Ia(r), b = f === "y", x = u.x + u.width / 2 - s.width / 2, v = u.y + u.height / 2 - s.height / 2, S = u[h] / 2 - s[h] / 2;
  let A;
  switch (p) {
    case "top":
      A = {
        x,
        y: u.y - s.height
      };
      break;
    case "bottom":
      A = {
        x,
        y: u.y + u.height
      };
      break;
    case "right":
      A = {
        x: u.x + u.width,
        y: v
      };
      break;
    case "left":
      A = {
        x: u.x - s.width,
        y: v
      };
      break;
    default:
      A = {
        x: u.x,
        y: u.y
      };
  }
  const O = Fr(r);
  return O && (A[m] += S * (O === "end" ? 1 : -1) * (c && b ? -1 : 1)), A;
}
async function hT(a, r) {
  var c;
  r === void 0 && (r = {});
  const {
    x: u,
    y: s,
    platform: f,
    rects: m,
    elements: h,
    strategy: p
  } = a, {
    boundary: b = "clippingAncestors",
    rootBoundary: x = "viewport",
    elementContext: v = "floating",
    altBoundary: S = !1,
    padding: A = 0
  } = Wl(r, a), O = Gy(A), C = h[S ? v === "floating" ? "reference" : "floating" : v], _ = ts(await f.getClippingRect({
    element: (c = await (f.isElement == null ? void 0 : f.isElement(C))) == null || c ? C : C.contextElement || await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(h.floating)),
    boundary: b,
    rootBoundary: x,
    strategy: p
  })), D = v === "floating" ? {
    x: u,
    y: s,
    width: m.floating.width,
    height: m.floating.height
  } : m.reference, j = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(h.floating)), M = await (f.isElement == null ? void 0 : f.isElement(j)) && await (f.getScale == null ? void 0 : f.getScale(j)) || {
    x: 1,
    y: 1
  }, Y = ts(f.convertOffsetParentRelativeRectToViewportRelativeRect ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: h,
    rect: D,
    offsetParent: j,
    strategy: p
  }) : D);
  return {
    top: (_.top - Y.top + O.top) / M.y,
    bottom: (Y.bottom - _.bottom + O.bottom) / M.y,
    left: (_.left - Y.left + O.left) / M.x,
    right: (Y.right - _.right + O.right) / M.x
  };
}
const vT = 50, gT = async (a, r, c) => {
  const {
    placement: u = "bottom",
    strategy: s = "absolute",
    middleware: f = [],
    platform: m
  } = c, h = m.detectOverflow ? m : {
    ...m,
    detectOverflow: hT
  }, p = await (m.isRTL == null ? void 0 : m.isRTL(r));
  let b = await m.getElementRects({
    reference: a,
    floating: r,
    strategy: s
  }), {
    x,
    y: v
  } = Fp(b, u, p), S = u, A = 0;
  const O = {};
  for (let w = 0; w < f.length; w++) {
    const C = f[w];
    if (!C)
      continue;
    const {
      name: _,
      fn: D
    } = C, {
      x: j,
      y: M,
      data: Y,
      reset: I
    } = await D({
      x,
      y: v,
      initialPlacement: u,
      placement: S,
      strategy: s,
      middlewareData: O,
      rects: b,
      platform: h,
      elements: {
        reference: a,
        floating: r
      }
    });
    x = j ?? x, v = M ?? v, O[_] = {
      ...O[_],
      ...Y
    }, I && A < vT && (A++, typeof I == "object" && (I.placement && (S = I.placement), I.rects && (b = I.rects === !0 ? await m.getElementRects({
      reference: a,
      floating: r,
      strategy: s
    }) : I.rects), {
      x,
      y: v
    } = Fp(b, S, p)), w = -1);
  }
  return {
    x,
    y: v,
    placement: S,
    strategy: s,
    middlewareData: O
  };
}, pT = (a) => ({
  name: "arrow",
  options: a,
  async fn(r) {
    const {
      x: c,
      y: u,
      placement: s,
      rects: f,
      platform: m,
      elements: h,
      middlewareData: p
    } = r, {
      element: b,
      padding: x = 0
    } = Wl(a, r) || {};
    if (b == null)
      return {};
    const v = Gy(x), S = {
      x: c,
      y: u
    }, A = Fm(s), O = Pm(A), w = await m.getDimensions(b), C = A === "y", _ = C ? "top" : "left", D = C ? "bottom" : "right", j = C ? "clientHeight" : "clientWidth", M = f.reference[O] + f.reference[A] - S[A] - f.floating[O], Y = S[A] - f.reference[A], I = await (m.getOffsetParent == null ? void 0 : m.getOffsetParent(b));
    let X = I ? I[j] : 0;
    (!X || !await (m.isElement == null ? void 0 : m.isElement(I))) && (X = h.floating[j] || f.floating[O]);
    const L = M / 2 - Y / 2, F = X / 2 - w[O] / 2 - 1, ae = ka(v[_], F), ie = ka(v[D], F), ee = X - w[O] - ie, fe = X / 2 - w[O] / 2 + L, ge = Vy(ae, fe, ee), he = !p.arrow && Fr(s) != null && fe !== ge && f.reference[O] / 2 - (fe < ae ? ae : ie) - w[O] / 2 < 0, Q = he ? fe < ae ? fe - ae : fe - ee : 0;
    return {
      [A]: S[A] + Q,
      data: {
        [A]: ge,
        centerOffset: fe - ge - Q,
        ...he && {
          alignmentOffset: Q
        }
      },
      reset: he
    };
  }
}), yT = function(a) {
  return a === void 0 && (a = {}), {
    name: "flip",
    options: a,
    async fn(r) {
      var c, u;
      const {
        placement: s,
        middlewareData: f,
        rects: m,
        initialPlacement: h,
        platform: p,
        elements: b
      } = r, {
        mainAxis: x = !0,
        crossAxis: v = !0,
        fallbackPlacements: S,
        fallbackStrategy: A = "bestFit",
        fallbackAxisSideDirection: O = "none",
        flipAlignment: w = !0,
        ...C
      } = Wl(a, r);
      if ((c = f.arrow) != null && c.alignmentOffset)
        return {};
      const _ = Ia(s), D = wl(h), j = Ia(h) === h, M = await (p.isRTL == null ? void 0 : p.isRTL(b.floating)), Y = S || (j || !w ? [es(h)] : uT(h)), I = O !== "none";
      !S && I && Y.push(...dT(h, w, O, M));
      const X = [h, ...Y], L = await p.detectOverflow(r, C), F = [];
      let ae = ((u = f.flip) == null ? void 0 : u.overflows) || [];
      if (x && F.push(L[_]), v) {
        const ge = iT(s, m, M);
        F.push(L[ge[0]], L[ge[1]]);
      }
      if (ae = [...ae, {
        placement: s,
        overflows: F
      }], !F.every((ge) => ge <= 0)) {
        var ie, ee;
        const ge = (((ie = f.flip) == null ? void 0 : ie.index) || 0) + 1, he = X[ge];
        if (he && (!(v === "alignment" ? D !== wl(he) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        ae.every((te) => wl(te.placement) === D ? te.overflows[0] > 0 : !0)))
          return {
            data: {
              index: ge,
              overflows: ae
            },
            reset: {
              placement: he
            }
          };
        let Q = (ee = ae.filter((J) => J.overflows[0] <= 0).sort((J, te) => J.overflows[1] - te.overflows[1])[0]) == null ? void 0 : ee.placement;
        if (!Q)
          switch (A) {
            case "bestFit": {
              var fe;
              const J = (fe = ae.filter((te) => {
                if (I) {
                  const de = wl(te.placement);
                  return de === D || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  de === "y";
                }
                return !0;
              }).map((te) => [te.placement, te.overflows.filter((de) => de > 0).reduce((de, G) => de + G, 0)]).sort((te, de) => te[1] - de[1])[0]) == null ? void 0 : fe[0];
              J && (Q = J);
              break;
            }
            case "initialPlacement":
              Q = h;
              break;
          }
        if (s !== Q)
          return {
            reset: {
              placement: Q
            }
          };
      }
      return {};
    }
  };
};
function Jp(a, r) {
  return {
    top: a.top - r.height,
    right: a.right - r.width,
    bottom: a.bottom - r.height,
    left: a.left - r.width
  };
}
function $p(a) {
  return oT.some((r) => a[r] >= 0);
}
const bT = function(a) {
  return a === void 0 && (a = {}), {
    name: "hide",
    options: a,
    async fn(r) {
      const {
        rects: c,
        platform: u
      } = r, {
        strategy: s = "referenceHidden",
        ...f
      } = Wl(a, r);
      switch (s) {
        case "referenceHidden": {
          const m = await u.detectOverflow(r, {
            ...f,
            elementContext: "reference"
          }), h = Jp(m, c.reference);
          return {
            data: {
              referenceHiddenOffsets: h,
              referenceHidden: $p(h)
            }
          };
        }
        case "escaped": {
          const m = await u.detectOverflow(r, {
            ...f,
            altBoundary: !0
          }), h = Jp(m, c.floating);
          return {
            data: {
              escapedOffsets: h,
              escaped: $p(h)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Yy = /* @__PURE__ */ new Set(["left", "top"]);
async function ST(a, r) {
  const {
    placement: c,
    platform: u,
    elements: s
  } = a, f = await (u.isRTL == null ? void 0 : u.isRTL(s.floating)), m = Ia(c), h = Fr(c), p = wl(c) === "y", b = Yy.has(m) ? -1 : 1, x = f && p ? -1 : 1, v = Wl(r, a);
  let {
    mainAxis: S,
    crossAxis: A,
    alignmentAxis: O
  } = typeof v == "number" ? {
    mainAxis: v,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: v.mainAxis || 0,
    crossAxis: v.crossAxis || 0,
    alignmentAxis: v.alignmentAxis
  };
  return h && typeof O == "number" && (A = h === "end" ? O * -1 : O), p ? {
    x: A * x,
    y: S * b
  } : {
    x: S * b,
    y: A * x
  };
}
const xT = function(a) {
  return a === void 0 && (a = 0), {
    name: "offset",
    options: a,
    async fn(r) {
      var c, u;
      const {
        x: s,
        y: f,
        placement: m,
        middlewareData: h
      } = r, p = await ST(r, a);
      return m === ((c = h.offset) == null ? void 0 : c.placement) && (u = h.arrow) != null && u.alignmentOffset ? {} : {
        x: s + p.x,
        y: f + p.y,
        data: {
          ...p,
          placement: m
        }
      };
    }
  };
}, ET = function(a) {
  return a === void 0 && (a = {}), {
    name: "shift",
    options: a,
    async fn(r) {
      const {
        x: c,
        y: u,
        placement: s,
        platform: f
      } = r, {
        mainAxis: m = !0,
        crossAxis: h = !1,
        limiter: p = {
          fn: (D) => {
            let {
              x: j,
              y: M
            } = D;
            return {
              x: j,
              y: M
            };
          }
        },
        ...b
      } = Wl(a, r), x = {
        x: c,
        y: u
      }, v = await f.detectOverflow(r, b), S = wl(s), A = Km(S);
      let O = x[A], w = x[S];
      const C = (D, j) => Vy(j + v[D === "y" ? "top" : "left"], j, j - v[D === "y" ? "bottom" : "right"]);
      m && (O = C(A, O)), h && (w = C(S, w));
      const _ = p.fn({
        ...r,
        [A]: O,
        [S]: w
      });
      return {
        ..._,
        data: {
          x: _.x - c,
          y: _.y - u,
          enabled: {
            [A]: m,
            [S]: h
          }
        }
      };
    }
  };
}, CT = function(a) {
  return a === void 0 && (a = {}), {
    options: a,
    fn(r) {
      var c, u;
      const {
        x: s,
        y: f,
        placement: m,
        rects: h,
        middlewareData: p
      } = r, {
        offset: b = 0,
        mainAxis: x = !0,
        crossAxis: v = !0
      } = Wl(a, r), S = {
        x: s,
        y: f
      }, A = wl(m), O = Km(A);
      let w = S[O], C = S[A];
      const _ = Wl(b, r), D = typeof _ == "number" ? {
        mainAxis: _,
        crossAxis: 0
      } : {
        mainAxis: (c = _.mainAxis) != null ? c : 0,
        crossAxis: (u = _.crossAxis) != null ? u : 0
      };
      if (x) {
        const Y = O === "y" ? "height" : "width", I = h.reference[O] - h.floating[Y] + D.mainAxis, X = h.reference[O] + h.reference[Y] - D.mainAxis;
        w < I ? w = I : w > X && (w = X);
      }
      if (v) {
        var j, M;
        const Y = O === "y" ? "width" : "height", I = Yy.has(Ia(m)), X = h.reference[A] - h.floating[Y] + (I && ((j = p.offset) == null ? void 0 : j[A]) || 0) + (I ? 0 : D.crossAxis), L = h.reference[A] + h.reference[Y] + (I ? 0 : ((M = p.offset) == null ? void 0 : M[A]) || 0) - (I ? D.crossAxis : 0);
        C < X ? C = X : C > L && (C = L);
      }
      return {
        [O]: w,
        [A]: C
      };
    }
  };
}, wT = function(a) {
  return a === void 0 && (a = {}), {
    name: "size",
    options: a,
    async fn(r) {
      const {
        placement: c,
        rects: u,
        platform: s,
        elements: f
      } = r, {
        apply: m = () => {
        },
        ...h
      } = Wl(a, r), p = await s.detectOverflow(r, h), b = Ia(c), x = Fr(c), v = wl(c) === "y", {
        width: S,
        height: A
      } = u.floating;
      let O, w;
      b === "top" || b === "bottom" ? (O = b, w = x === (await (s.isRTL == null ? void 0 : s.isRTL(f.floating)) ? "start" : "end") ? "left" : "right") : (w = b, O = x === "end" ? "top" : "bottom");
      const C = A - p.top - p.bottom, _ = S - p.left - p.right, D = ka(A - p[O], C), j = ka(S - p[w], _), M = r.middlewareData.shift, Y = !M;
      let I = D, X = j;
      M != null && M.enabled.x && (X = _), M != null && M.enabled.y && (I = C), Y && !x && (v ? X = S - 2 * Fl(p.left, p.right) : I = A - 2 * Fl(p.top, p.bottom)), await m({
        ...r,
        availableWidth: X,
        availableHeight: I
      });
      const L = await s.getDimensions(f.floating);
      return S !== L.width || A !== L.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function ds() {
  return typeof window < "u";
}
function Jr(a) {
  return qy(a) ? (a.nodeName || "").toLowerCase() : "#document";
}
function gn(a) {
  var r;
  return (a == null || (r = a.ownerDocument) == null ? void 0 : r.defaultView) || window;
}
function ea(a) {
  var r;
  return (r = (qy(a) ? a.ownerDocument : a.document) || window.document) == null ? void 0 : r.documentElement;
}
function qy(a) {
  return ds() ? a instanceof Node || a instanceof gn(a).Node : !1;
}
function Ol(a) {
  return ds() ? a instanceof Element || a instanceof gn(a).Element : !1;
}
function Pa(a) {
  return ds() ? a instanceof HTMLElement || a instanceof gn(a).HTMLElement : !1;
}
function Wp(a) {
  return !ds() || typeof ShadowRoot > "u" ? !1 : a instanceof ShadowRoot || a instanceof gn(a).ShadowRoot;
}
function ms(a) {
  const {
    overflow: r,
    overflowX: c,
    overflowY: u,
    display: s
  } = _l(a);
  return /auto|scroll|overlay|hidden|clip/.test(r + u + c) && s !== "inline" && s !== "contents";
}
function TT(a) {
  return /^(table|td|th)$/.test(Jr(a));
}
function hs(a) {
  try {
    if (a.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return a.matches(":modal");
  } catch {
    return !1;
  }
}
const AT = /transform|translate|scale|rotate|perspective|filter/, OT = /paint|layout|strict|content/, No = (a) => !!a && a !== "none";
let am;
function Jm(a) {
  const r = Ol(a) ? _l(a) : a;
  return No(r.transform) || No(r.translate) || No(r.scale) || No(r.rotate) || No(r.perspective) || !$m() && (No(r.backdropFilter) || No(r.filter)) || AT.test(r.willChange || "") || OT.test(r.contain || "");
}
function _T(a) {
  let r = jo(a);
  for (; Pa(r) && !nu(r); ) {
    if (Jm(r))
      return r;
    if (hs(r))
      return null;
    r = jo(r);
  }
  return null;
}
function $m() {
  return am == null && (am = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), am;
}
function nu(a) {
  return /^(html|body|#document)$/.test(Jr(a));
}
function _l(a) {
  return gn(a).getComputedStyle(a);
}
function vs(a) {
  return Ol(a) ? {
    scrollLeft: a.scrollLeft,
    scrollTop: a.scrollTop
  } : {
    scrollLeft: a.scrollX,
    scrollTop: a.scrollY
  };
}
function jo(a) {
  if (Jr(a) === "html")
    return a;
  const r = (
    // Step into the shadow DOM of the parent of a slotted node.
    a.assignedSlot || // DOM Element detected.
    a.parentNode || // ShadowRoot detected.
    Wp(a) && a.host || // Fallback.
    ea(a)
  );
  return Wp(r) ? r.host : r;
}
function ky(a) {
  const r = jo(a);
  return nu(r) ? (a.ownerDocument || a).body : Pa(r) && ms(r) ? r : ky(r);
}
function lu(a, r, c) {
  var u;
  r === void 0 && (r = []), c === void 0 && (c = !0);
  const s = ky(a), f = s === ((u = a.ownerDocument) == null ? void 0 : u.body), m = gn(s);
  if (f) {
    const h = _m(m);
    return r.concat(m, m.visualViewport || [], ms(s) ? s : [], h && c ? lu(h) : []);
  } else
    return r.concat(s, lu(s, [], c));
}
function _m(a) {
  return a.parent && Object.getPrototypeOf(a.parent) ? a.frameElement : null;
}
function Iy(a) {
  const r = _l(a);
  let c = parseFloat(r.width) || 0, u = parseFloat(r.height) || 0;
  const s = Pa(a), f = s ? a.offsetWidth : c, m = s ? a.offsetHeight : u, h = Wc(c) !== f || Wc(u) !== m;
  return h && (c = f, u = m), {
    width: c,
    height: u,
    $: h
  };
}
function Wm(a) {
  return Ol(a) ? a : a.contextElement;
}
function Qr(a) {
  const r = Wm(a);
  if (!Pa(r))
    return Jl(1);
  const c = r.getBoundingClientRect(), {
    width: u,
    height: s,
    $: f
  } = Iy(r);
  let m = (f ? Wc(c.width) : c.width) / u, h = (f ? Wc(c.height) : c.height) / s;
  return (!m || !Number.isFinite(m)) && (m = 1), (!h || !Number.isFinite(h)) && (h = 1), {
    x: m,
    y: h
  };
}
const RT = /* @__PURE__ */ Jl(0);
function Xy(a) {
  const r = gn(a);
  return !$m() || !r.visualViewport ? RT : {
    x: r.visualViewport.offsetLeft,
    y: r.visualViewport.offsetTop
  };
}
function MT(a, r, c) {
  return r === void 0 && (r = !1), !!c && r && c === gn(a);
}
function Uo(a, r, c, u) {
  r === void 0 && (r = !1), c === void 0 && (c = !1);
  const s = a.getBoundingClientRect(), f = Wm(a);
  let m = Jl(1);
  r && (u ? Ol(u) && (m = Qr(u)) : m = Qr(a));
  const h = MT(f, c, u) ? Xy(f) : Jl(0);
  let p = (s.left + h.x) / m.x, b = (s.top + h.y) / m.y, x = s.width / m.x, v = s.height / m.y;
  if (f && u) {
    const S = gn(f), A = Ol(u) ? gn(u) : u;
    let O = S, w = _m(O);
    for (; w && A !== O; ) {
      const C = Qr(w), _ = w.getBoundingClientRect(), D = _l(w), j = _.left + (w.clientLeft + parseFloat(D.paddingLeft)) * C.x, M = _.top + (w.clientTop + parseFloat(D.paddingTop)) * C.y;
      p *= C.x, b *= C.y, x *= C.x, v *= C.y, p += j, b += M, O = gn(w), w = _m(O);
    }
  }
  return ts({
    width: x,
    height: v,
    x: p,
    y: b
  });
}
function gs(a, r) {
  const c = vs(a).scrollLeft;
  return r ? r.left + c : Uo(ea(a)).left + c;
}
function Qy(a, r) {
  const c = a.getBoundingClientRect(), u = c.left + r.scrollLeft - gs(a, c), s = c.top + r.scrollTop;
  return {
    x: u,
    y: s
  };
}
function NT(a) {
  let {
    elements: r,
    rect: c,
    offsetParent: u,
    strategy: s
  } = a;
  const f = s === "fixed", m = ea(u), h = r ? hs(r.floating) : !1;
  if (u === m || h && f)
    return c;
  let p = {
    scrollLeft: 0,
    scrollTop: 0
  }, b = Jl(1);
  const x = Jl(0), v = Pa(u);
  if ((v || !f) && ((Jr(u) !== "body" || ms(m)) && (p = vs(u)), v)) {
    const A = Uo(u);
    b = Qr(u), x.x = A.x + u.clientLeft, x.y = A.y + u.clientTop;
  }
  const S = m && !v && !f ? Qy(m, p) : Jl(0);
  return {
    width: c.width * b.x,
    height: c.height * b.y,
    x: c.x * b.x - p.scrollLeft * b.x + x.x + S.x,
    y: c.y * b.y - p.scrollTop * b.y + x.y + S.y
  };
}
function DT(a) {
  return a.getClientRects ? Array.from(a.getClientRects()) : [];
}
function zT(a) {
  const r = vs(a), c = a.ownerDocument.body, u = Fl(a.scrollWidth, a.clientWidth, c.scrollWidth, c.clientWidth), s = Fl(a.scrollHeight, a.clientHeight, c.scrollHeight, c.clientHeight);
  let f = -r.scrollLeft + gs(a);
  const m = -r.scrollTop;
  return _l(c).direction === "rtl" && (f += Fl(a.clientWidth, c.clientWidth) - u), {
    width: u,
    height: s,
    x: f,
    y: m
  };
}
const jT = 25;
function UT(a, r, c) {
  c === void 0 && (c = "viewport");
  const u = c === "layoutViewport", s = gn(a), f = ea(a), m = s.visualViewport;
  let h = f.clientWidth, p = f.clientHeight, b = 0, x = 0;
  if (m) {
    const S = !$m() || r === "fixed";
    u ? S || (b = -m.offsetLeft, x = -m.offsetTop) : (h = m.width, p = m.height, S && (b = m.offsetLeft, x = m.offsetTop));
  }
  if (gs(f) <= 0) {
    const S = f.ownerDocument, A = S.body, O = getComputedStyle(A), w = S.compatMode === "CSS1Compat" && parseFloat(O.marginLeft) + parseFloat(O.marginRight) || 0, C = Math.abs(f.clientWidth - A.clientWidth - w), _ = getComputedStyle(f).scrollbarGutter === "stable both-edges" ? C / 2 : C;
    _ <= jT && (h -= _);
  }
  return {
    width: h,
    height: p,
    x: b,
    y: x
  };
}
function HT(a, r) {
  const c = Uo(a, !0, r === "fixed"), u = c.top + a.clientTop, s = c.left + a.clientLeft, f = Qr(a), m = a.clientWidth * f.x, h = a.clientHeight * f.y, p = s * f.x, b = u * f.y;
  return {
    width: m,
    height: h,
    x: p,
    y: b
  };
}
function e2(a, r, c) {
  let u;
  if (r === "viewport" || r === "layoutViewport")
    u = UT(a, c, r);
  else if (r === "document")
    u = zT(ea(a));
  else if (Ol(r))
    u = HT(r, c);
  else {
    const s = Xy(a);
    u = {
      x: r.x - s.x,
      y: r.y - s.y,
      width: r.width,
      height: r.height
    };
  }
  return ts(u);
}
function LT(a, r) {
  const c = r.get(a);
  if (c)
    return c;
  let u = lu(a, [], !1).filter((h) => Ol(h) && Jr(h) !== "body"), s = null;
  const f = _l(a).position === "fixed";
  let m = f ? jo(a) : a;
  for (; Ol(m) && !nu(m); ) {
    const h = _l(m), p = Jm(m), b = s ? s.position : f ? "fixed" : "";
    !p && (b === "fixed" || b === "absolute" && h.position === "static") ? u = u.filter((v) => v !== m) : s = h, m = jo(m);
  }
  return r.set(a, u), u;
}
function BT(a) {
  let {
    element: r,
    boundary: c,
    rootBoundary: u,
    strategy: s
  } = a;
  const m = [...c === "clippingAncestors" ? hs(r) ? [] : LT(r, this._c) : [].concat(c), u], h = e2(r, m[0], s);
  let p = h.top, b = h.right, x = h.bottom, v = h.left;
  for (let S = 1; S < m.length; S++) {
    const A = e2(r, m[S], s);
    p = Fl(A.top, p), b = ka(A.right, b), x = ka(A.bottom, x), v = Fl(A.left, v);
  }
  return {
    width: b - v,
    height: x - p,
    x: v,
    y: p
  };
}
function VT(a) {
  const {
    width: r,
    height: c
  } = Iy(a);
  return {
    width: r,
    height: c
  };
}
function GT(a, r, c) {
  const u = Pa(r), s = ea(r), f = c === "fixed", m = Uo(a, !0, f, r);
  let h = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const p = Jl(0);
  if ((u || !f) && ((Jr(r) !== "body" || ms(s)) && (h = vs(r)), u)) {
    const S = Uo(r, !0, f, r);
    p.x = S.x + r.clientLeft, p.y = S.y + r.clientTop;
  }
  !u && s && (p.x = gs(s));
  const b = s && !u && !f ? Qy(s, h) : Jl(0), x = m.left + h.scrollLeft - p.x - b.x, v = m.top + h.scrollTop - p.y - b.y;
  return {
    x,
    y: v,
    width: m.width,
    height: m.height
  };
}
function om(a) {
  return _l(a).position === "static";
}
function t2(a, r) {
  if (!Pa(a) || _l(a).position === "fixed")
    return null;
  if (r)
    return r(a);
  let c = a.offsetParent;
  return ea(a) === c && (c = c.ownerDocument.body), c;
}
function Zy(a, r) {
  const c = gn(a);
  if (hs(a))
    return c;
  if (!Pa(a)) {
    let s = jo(a);
    for (; s && !nu(s); ) {
      if (Ol(s) && !om(s))
        return s;
      s = jo(s);
    }
    return c;
  }
  let u = t2(a, r);
  for (; u && TT(u) && om(u); )
    u = t2(u, r);
  return u && nu(u) && om(u) && !Jm(u) ? c : u || _T(a) || c;
}
const YT = async function(a) {
  const r = this.getOffsetParent || Zy, c = this.getDimensions, u = await c(a.floating);
  return {
    reference: GT(a.reference, await r(a.floating), a.strategy),
    floating: {
      x: 0,
      y: 0,
      width: u.width,
      height: u.height
    }
  };
};
function qT(a) {
  return _l(a).direction === "rtl";
}
const kT = {
  convertOffsetParentRelativeRectToViewportRelativeRect: NT,
  getDocumentElement: ea,
  getClippingRect: BT,
  getOffsetParent: Zy,
  getElementRects: YT,
  getClientRects: DT,
  getDimensions: VT,
  getScale: Qr,
  isElement: Ol,
  isRTL: qT
};
function Ky(a, r) {
  return a.x === r.x && a.y === r.y && a.width === r.width && a.height === r.height;
}
function IT(a, r, c) {
  let u = null, s;
  const f = ea(a);
  function m() {
    var x;
    clearTimeout(s), (x = u) == null || x.disconnect(), u = null;
  }
  function h(x, v) {
    x === void 0 && (x = !1), v === void 0 && (v = 1), m();
    const S = a.getBoundingClientRect(), {
      left: A,
      top: O,
      width: w,
      height: C
    } = S;
    if (x || r(), !w || !C)
      return;
    const _ = Ic(O), D = Ic(f.clientWidth - (A + w)), j = Ic(f.clientHeight - (O + C)), M = Ic(A), I = {
      rootMargin: -_ + "px " + -D + "px " + -j + "px " + -M + "px",
      threshold: Fl(0, ka(1, v)) || 1
    };
    let X = !0;
    function L(F) {
      const ae = F[0].intersectionRatio;
      if (!Ky(S, a.getBoundingClientRect()))
        return h();
      if (ae !== v) {
        if (!X)
          return h();
        ae ? h(!1, ae) : s = setTimeout(() => {
          h(!1, 1e-7);
        }, 1e3);
      }
      X = !1;
    }
    try {
      u = new IntersectionObserver(L, {
        ...I,
        // Handle <iframe>s
        root: f.ownerDocument
      });
    } catch {
      u = new IntersectionObserver(L, I);
    }
    u.observe(a);
  }
  const p = gn(a), b = () => h(c);
  return p.addEventListener("resize", b), h(!0), () => {
    p.removeEventListener("resize", b), m();
  };
}
function XT(a, r, c, u) {
  u === void 0 && (u = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: f = !0,
    elementResize: m = typeof ResizeObserver == "function",
    layoutShift: h = typeof IntersectionObserver == "function",
    animationFrame: p = !1
  } = u, b = Wm(a), x = s || f ? [...b ? lu(b) : [], ...r ? lu(r) : []] : [];
  x.forEach((_) => {
    s && _.addEventListener("scroll", c), f && _.addEventListener("resize", c);
  });
  const v = b && h ? IT(b, c, f) : null;
  let S = -1, A = null;
  m && (A = new ResizeObserver((_) => {
    let [D] = _;
    D && D.target === b && A && r && (A.unobserve(r), cancelAnimationFrame(S), S = requestAnimationFrame(() => {
      var j;
      (j = A) == null || j.observe(r);
    })), c();
  }), b && !p && A.observe(b), r && A.observe(r));
  let O, w = p ? Uo(a) : null;
  p && C();
  function C() {
    const _ = Uo(a);
    w && !Ky(w, _) && c(), w = _, O = requestAnimationFrame(C);
  }
  return c(), () => {
    var _;
    x.forEach((D) => {
      s && D.removeEventListener("scroll", c), f && D.removeEventListener("resize", c);
    }), v?.(), (_ = A) == null || _.disconnect(), A = null, p && cancelAnimationFrame(O);
  };
}
const QT = xT, ZT = ET, KT = yT, PT = wT, FT = bT, n2 = pT, JT = CT, $T = (a, r, c) => {
  const u = /* @__PURE__ */ new Map(), s = c ?? {}, f = {
    ...kT,
    ...s.platform,
    _c: u
  };
  return gT(a, r, {
    ...s,
    platform: f
  });
};
var WT = typeof document < "u", eA = function() {
}, Fc = WT ? y.useLayoutEffect : eA;
function ns(a, r) {
  if (a === r)
    return !0;
  if (typeof a != typeof r)
    return !1;
  if (typeof a == "function" && a.toString() === r.toString())
    return !0;
  let c, u, s;
  if (a && r && typeof a == "object") {
    if (Array.isArray(a)) {
      if (c = a.length, c !== r.length) return !1;
      for (u = c; u-- !== 0; )
        if (!ns(a[u], r[u]))
          return !1;
      return !0;
    }
    if (s = Object.keys(a), c = s.length, c !== Object.keys(r).length)
      return !1;
    for (u = c; u-- !== 0; )
      if (!{}.hasOwnProperty.call(r, s[u]))
        return !1;
    for (u = c; u-- !== 0; ) {
      const f = s[u];
      if (!(f === "_owner" && a.$$typeof) && !ns(a[f], r[f]))
        return !1;
    }
    return !0;
  }
  return a !== a && r !== r;
}
function Py(a) {
  return typeof window > "u" ? 1 : (a.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function l2(a, r) {
  const c = Py(a);
  return Math.round(r * c) / c;
}
function rm(a) {
  const r = y.useRef(a);
  return Fc(() => {
    r.current = a;
  }), r;
}
function tA(a) {
  a === void 0 && (a = {});
  const {
    placement: r = "bottom",
    strategy: c = "absolute",
    middleware: u = [],
    platform: s,
    elements: {
      reference: f,
      floating: m
    } = {},
    transform: h = !0,
    whileElementsMounted: p,
    open: b
  } = a, [x, v] = y.useState({
    x: 0,
    y: 0,
    strategy: c,
    placement: r,
    middlewareData: {},
    isPositioned: !1
  }), [S, A] = y.useState(u);
  ns(S, u) || A(u);
  const [O, w] = y.useState(null), [C, _] = y.useState(null), D = y.useCallback((te) => {
    te !== I.current && (I.current = te, w(te));
  }, []), j = y.useCallback((te) => {
    te !== X.current && (X.current = te, _(te));
  }, []), M = f || O, Y = m || C, I = y.useRef(null), X = y.useRef(null), L = y.useRef(x), F = p != null, ae = rm(p), ie = rm(s), ee = rm(b), fe = y.useCallback(() => {
    if (!I.current || !X.current)
      return;
    const te = {
      placement: r,
      strategy: c,
      middleware: S
    };
    ie.current && (te.platform = ie.current), $T(I.current, X.current, te).then((de) => {
      const G = {
        ...de,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: ee.current !== !1
      };
      ge.current && !ns(L.current, G) && (L.current = G, ou.flushSync(() => {
        v(G);
      }));
    });
  }, [S, r, c, ie, ee]);
  Fc(() => {
    b === !1 && L.current.isPositioned && (L.current.isPositioned = !1, v((te) => ({
      ...te,
      isPositioned: !1
    })));
  }, [b]);
  const ge = y.useRef(!1);
  Fc(() => (ge.current = !0, () => {
    ge.current = !1;
  }), []), Fc(() => {
    if (M && (I.current = M), Y && (X.current = Y), M && Y) {
      if (ae.current)
        return ae.current(M, Y, fe);
      fe();
    }
  }, [M, Y, fe, ae, F]);
  const he = y.useMemo(() => ({
    reference: I,
    floating: X,
    setReference: D,
    setFloating: j
  }), [D, j]), Q = y.useMemo(() => ({
    reference: M,
    floating: Y
  }), [M, Y]), J = y.useMemo(() => {
    const te = {
      position: c,
      left: 0,
      top: 0
    };
    if (!Q.floating)
      return te;
    const de = l2(Q.floating, x.x), G = l2(Q.floating, x.y);
    return h ? {
      ...te,
      transform: "translate(" + de + "px, " + G + "px)",
      ...Py(Q.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: c,
      left: de,
      top: G
    };
  }, [c, h, Q.floating, x.x, x.y]);
  return y.useMemo(() => ({
    ...x,
    update: fe,
    refs: he,
    elements: Q,
    floatingStyles: J
  }), [x, fe, he, Q, J]);
}
const nA = (a) => {
  function r(c) {
    return {}.hasOwnProperty.call(c, "current");
  }
  return {
    name: "arrow",
    options: a,
    fn(c) {
      const {
        element: u,
        padding: s
      } = typeof a == "function" ? a(c) : a;
      return u && r(u) ? u.current != null ? n2({
        element: u.current,
        padding: s
      }).fn(c) : {} : u ? n2({
        element: u,
        padding: s
      }).fn(c) : {};
    }
  };
}, lA = (a, r) => {
  const c = QT(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
}, aA = (a, r) => {
  const c = ZT(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
}, oA = (a, r) => ({
  fn: JT(a).fn,
  options: [a, r]
}), rA = (a, r) => {
  const c = KT(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
}, iA = (a, r) => {
  const c = PT(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
}, uA = (a, r) => {
  const c = FT(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
}, cA = (a, r) => {
  const c = nA(a);
  return {
    name: c.name,
    fn: c.fn,
    options: [a, r]
  };
};
var sA = Object.defineProperty, Ga = (a, r) => sA(a, "name", { value: r, configurable: !0 }), Fy = "Popper", [Jy, $r] = /* @__PURE__ */ Ml(Fy), [fA, $y] = Jy(Fy), dA = /* @__PURE__ */ Ga((a) => {
  const { __scopePopper: r, children: c } = a, [u, s] = y.useState(null), [f, m] = y.useState(void 0);
  return /* @__PURE__ */ E.jsx(
    fA,
    {
      scope: r,
      anchor: u,
      onAnchorChange: s,
      placementState: f,
      setPlacementState: m,
      children: c
    }
  );
}, "Popper"), mA = "PopperAnchor", hA = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Ga(function(r, c) {
    const { __scopePopper: u, virtualRef: s, ...f } = r, m = $y(mA, u), h = y.useRef(null), p = m.onAnchorChange, b = y.useCallback(
      (w) => {
        h.current = w, w && p(w);
      },
      [p]
    ), x = Fe(c, b), v = y.useRef(null);
    y.useEffect(() => {
      if (!s)
        return;
      const w = v.current;
      v.current = s.current, w !== v.current && p(v.current);
    });
    const S = m.placementState && ps(m.placementState), A = S?.[0], O = S?.[1];
    return s ? null : /* @__PURE__ */ E.jsx(
      it.div,
      {
        "data-radix-popper-side": A,
        "data-radix-popper-align": O,
        ...f,
        ref: x
      }
    );
  }, "PopperAnchor")
), Wy = "PopperContent", [vA, d4] = Jy(Wy), gA = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Ga(function(r, c) {
    const {
      __scopePopper: u,
      side: s = "bottom",
      sideOffset: f = 0,
      align: m = "center",
      alignOffset: h = 0,
      arrowPadding: p = 0,
      avoidCollisions: b = !0,
      collisionBoundary: x = [],
      collisionPadding: v = 0,
      sticky: S = "partial",
      hideWhenDetached: A = !1,
      updatePositionStrategy: O = "optimized",
      onPlaced: w,
      ...C
    } = r, _ = $y(Wy, u), [D, j] = y.useState(null), M = Fe(c, j), [Y, I] = y.useState(null), X = By(Y), L = X?.width ?? 0, F = X?.height ?? 0, ae = s + (m !== "center" ? "-" + m : ""), ie = typeof v == "number" ? v : { top: 0, right: 0, bottom: 0, left: 0, ...v }, ee = Array.isArray(x) ? x : [x], fe = ee.length > 0, ge = {
      padding: ie,
      boundary: ee.filter(eb),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: fe
    }, { refs: he, floatingStyles: Q, placement: J, isPositioned: te, middlewareData: de } = tA({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: ae,
      whileElementsMounted: /* @__PURE__ */ Ga((...ue) => XT(...ue, {
        animationFrame: O === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: _.anchor
      },
      middleware: [
        lA({ mainAxis: f + F, alignmentAxis: h }),
        b && aA({
          mainAxis: !0,
          crossAxis: !1,
          limiter: S === "partial" ? oA() : void 0,
          ...ge
        }),
        b && rA({ ...ge }),
        iA({
          ...ge,
          apply: /* @__PURE__ */ Ga(({ elements: ue, rects: xe, availableWidth: le, availableHeight: re }) => {
            const { width: je, height: pt } = xe.reference, at = ue.floating.style;
            at.setProperty("--radix-popper-available-width", `${le}px`), at.setProperty("--radix-popper-available-height", `${re}px`), at.setProperty("--radix-popper-anchor-width", `${je}px`), at.setProperty("--radix-popper-anchor-height", `${pt}px`);
          }, "apply")
        }),
        Y && cA({ element: Y, padding: p }),
        pA({ arrowWidth: L, arrowHeight: F }),
        A && uA({
          strategy: "referenceHidden",
          ...ge,
          // `hide` detects whether the anchor (reference) is clipped, so when
          // no explicit `collisionBoundary` is set we fall back to Floating
          // UI's default clipping ancestors (e.g. a scrollable menu). This
          // lets an occluded submenu hide once its anchor scrolls out of view
          // (#3237). The collision/size middlewares deliberately keep the
          // viewport-based default to avoid clamping content rendered inside
          // transformed or overflow-clipping portal containers.
          boundary: fe ? ge.boundary : void 0
        })
      ]
    }), G = _.setPlacementState;
    Dt(() => (G(J), () => {
      G(void 0);
    }), [J, G]);
    const [Ye, De] = ps(J), qe = Xn(w);
    Dt(() => {
      te && qe?.();
    }, [te, qe]);
    const R = de.arrow?.x, Z = de.arrow?.y, oe = de.arrow?.centerOffset !== 0, [se, ne] = y.useState();
    return Dt(() => {
      D && ne(window.getComputedStyle(D).zIndex);
    }, [D]), /* @__PURE__ */ E.jsx(
      "div",
      {
        ref: he.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...Q,
          transform: te ? Q.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: se,
          "--radix-popper-transform-origin": [
            de.transformOrigin?.x,
            de.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...de.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: r.dir,
        children: /* @__PURE__ */ E.jsx(
          vA,
          {
            scope: u,
            placedSide: Ye,
            placedAlign: De,
            onArrowChange: I,
            arrowX: R,
            arrowY: Z,
            shouldHideArrow: oe,
            children: /* @__PURE__ */ E.jsx(
              it.div,
              {
                "data-side": Ye,
                "data-align": De,
                ...C,
                ref: M,
                style: {
                  ...C.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: te ? C.style?.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
);
function eb(a) {
  return a !== null;
}
Ga(eb, "isNotNull");
var pA = /* @__PURE__ */ Ga((a) => ({
  name: "transformOrigin",
  options: a,
  fn(r) {
    const { placement: c, rects: u, middlewareData: s } = r, m = s.arrow?.centerOffset !== 0, h = m ? 0 : a.arrowWidth, p = m ? 0 : a.arrowHeight, [b, x] = ps(c), v = { start: "0%", center: "50%", end: "100%" }[x], S = (s.arrow?.x ?? 0) + h / 2, A = (s.arrow?.y ?? 0) + p / 2;
    let O = "", w = "";
    return b === "bottom" ? (O = m ? v : `${S}px`, w = `${-p}px`) : b === "top" ? (O = m ? v : `${S}px`, w = `${u.floating.height + p}px`) : b === "right" ? (O = `${-p}px`, w = m ? v : `${A}px`) : b === "left" && (O = `${u.floating.width + p}px`, w = m ? v : `${A}px`), { data: { x: O, y: w } };
  }
}), "transformOrigin");
function ps(a) {
  const [r, c = "center"] = a.split("-");
  return [r, c];
}
Ga(ps, "getSideAndAlignFromPlacement");
var e0 = dA, t0 = hA, n0 = gA, yA = Object.defineProperty, l0 = (a, r) => yA(a, "name", { value: r, configurable: !0 }), im = !1;
function tb() {
  const [a, r] = y.useState(im);
  return y.useEffect(() => {
    im || (im = !0, r(!0));
  }, []), a;
}
l0(tb, "useIsHydrated");
var nb = Kr[" useSyncExternalStore ".trim().toString()];
function lb() {
  return () => {
  };
}
l0(lb, "subscribe");
function ab() {
  return nb(
    lb,
    () => !0,
    () => !1
  );
}
l0(ab, "useIsHydratedModern");
var bA = typeof nb == "function" ? ab : tb, SA = Object.defineProperty, Bo = (a, r) => SA(a, "name", { value: r, configurable: !0 }), um = "rovingFocusGroup.onEntryFocus", xA = { bubbles: !1, cancelable: !0 }, ys = "RovingFocusGroup", [Rm, ob, EA] = /* @__PURE__ */ os(ys), [CA, rb] = /* @__PURE__ */ Ml(
  ys,
  [EA]
), [wA, TA] = CA(ys), AA = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Bo(function(r, c) {
    return /* @__PURE__ */ E.jsx(Rm.Provider, { scope: r.__scopeRovingFocusGroup, children: /* @__PURE__ */ E.jsx(Rm.Slot, { scope: r.__scopeRovingFocusGroup, children: /* @__PURE__ */ E.jsx(OA, { ...r, ref: c }) }) });
  }, "RovingFocusGroup")
), OA = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ Bo(function(r, c) {
  const {
    __scopeRovingFocusGroup: u,
    orientation: s,
    loop: f = !1,
    dir: m,
    currentTabStopId: h,
    defaultCurrentTabStopId: p,
    onCurrentTabStopIdChange: b,
    onEntryFocus: x,
    preventScrollOnEntryFocus: v = !1,
    ...S
  } = r, A = y.useRef(null), O = Fe(c, A), w = rs(m), [C, _] = zo({
    prop: h,
    defaultProp: p ?? null,
    onChange: b,
    caller: ys
  }), [D, j] = y.useState(!1), M = Xn(x), Y = ob(u), I = y.useRef(!1), [X, L] = y.useState(0);
  return y.useEffect(() => {
    const F = A.current;
    if (F)
      return F.addEventListener(um, M), () => F.removeEventListener(um, M);
  }, [M]), /* @__PURE__ */ E.jsx(
    wA,
    {
      scope: u,
      orientation: s,
      dir: w,
      loop: f,
      currentTabStopId: C,
      onItemFocus: y.useCallback(
        (F) => _(F),
        [_]
      ),
      onItemShiftTab: y.useCallback(() => j(!0), []),
      onFocusableItemAdd: y.useCallback(
        () => L((F) => F + 1),
        []
      ),
      onFocusableItemRemove: y.useCallback(
        () => L((F) => F - 1),
        []
      ),
      children: /* @__PURE__ */ E.jsx(
        it.div,
        {
          tabIndex: D || X === 0 ? -1 : 0,
          "data-orientation": s,
          ...S,
          ref: O,
          style: { outline: "none", ...r.style },
          onMouseDown: Ce(r.onMouseDown, () => {
            I.current = !0;
          }),
          onFocus: Ce(r.onFocus, (F) => {
            const ae = !I.current;
            if (F.target === F.currentTarget && ae && !D) {
              const ie = new CustomEvent(um, xA);
              if (F.currentTarget.dispatchEvent(ie), !ie.defaultPrevented) {
                const ee = Y().filter((J) => J.focusable), fe = ee.find((J) => J.active), ge = ee.find((J) => J.id === C), Q = [fe, ge, ...ee].filter(
                  Boolean
                ).map((J) => J.ref.current);
                a0(Q, v);
              }
            }
            I.current = !1;
          }),
          onBlur: Ce(r.onBlur, () => j(!1))
        }
      )
    }
  );
}, "RovingFocusGroupImpl")), _A = "RovingFocusGroupItem", RA = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Bo(function(r, c) {
    const {
      __scopeRovingFocusGroup: u,
      focusable: s = !0,
      active: f = !1,
      tabStopId: m,
      children: h,
      ...p
    } = r, b = Tl(), x = m || b, v = TA(_A, u), S = v.currentTabStopId === x, A = ob(u), { onFocusableItemAdd: O, onFocusableItemRemove: w, currentTabStopId: C } = v, _ = bA();
    return Dt(() => {
      if (!(!_ || !s))
        return O(), () => w();
    }, [_, s, O, w]), y.useEffect(() => {
      if (!(_ || !s))
        return O(), () => w();
    }, [_, s, O, w]), /* @__PURE__ */ E.jsx(
      Rm.ItemSlot,
      {
        scope: u,
        id: x,
        focusable: s,
        active: f,
        children: /* @__PURE__ */ E.jsx(
          it.span,
          {
            tabIndex: S ? 0 : -1,
            "data-orientation": v.orientation,
            ...p,
            ref: c,
            onMouseDown: Ce(r.onMouseDown, (D) => {
              s ? v.onItemFocus(x) : D.preventDefault();
            }),
            onFocus: Ce(r.onFocus, () => v.onItemFocus(x)),
            onKeyDown: Ce(r.onKeyDown, (D) => {
              if (D.key === "Tab" && D.shiftKey) {
                v.onItemShiftTab();
                return;
              }
              if (D.target !== D.currentTarget) return;
              const j = ub(D, v.orientation, v.dir);
              if (j !== void 0) {
                if (D.metaKey || D.ctrlKey || D.altKey || D.shiftKey) return;
                D.preventDefault();
                let Y = A().filter((I) => I.focusable).map((I) => I.ref.current);
                if (j === "last") Y.reverse();
                else if (j === "prev" || j === "next") {
                  j === "prev" && Y.reverse();
                  const I = Y.indexOf(D.currentTarget);
                  Y = v.loop ? cb(Y, I + 1) : Y.slice(I + 1);
                }
                setTimeout(() => a0(Y));
              }
            }),
            children: typeof h == "function" ? h({ isCurrentTabStop: S, hasTabStop: C != null }) : h
          }
        )
      }
    );
  }, "RovingFocusGroupItem")
), MA = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ib(a, r) {
  return r !== "rtl" ? a : a === "ArrowLeft" ? "ArrowRight" : a === "ArrowRight" ? "ArrowLeft" : a;
}
Bo(ib, "getDirectionAwareKey");
function ub(a, r, c) {
  const u = ib(a.key, c);
  if (!(r === "vertical" && ["ArrowLeft", "ArrowRight"].includes(u)) && !(r === "horizontal" && ["ArrowUp", "ArrowDown"].includes(u)))
    return MA[u];
}
Bo(ub, "getFocusIntent");
function a0(a, r = !1) {
  const c = document.activeElement;
  for (const u of a)
    if (u === c || (u.focus({ preventScroll: r }), document.activeElement !== c)) return;
}
Bo(a0, "focusFirst");
function cb(a, r) {
  return a.map((c, u) => a[(r + u) % a.length]);
}
Bo(cb, "wrapArray");
var NA = AA, DA = RA, zA = Object.defineProperty, ct = (a, r) => zA(a, "name", { value: r, configurable: !0 }), jA = ["Enter", " "], UA = ["ArrowDown", "PageUp", "Home"], sb = ["ArrowUp", "PageDown", "End"], HA = [...UA, ...sb], bs = "Menu", [Mm, LA, BA] = /* @__PURE__ */ os(bs), [Vo, fb] = /* @__PURE__ */ Ml(bs, [
  BA,
  $r,
  rb
]), o0 = $r(), db = rb(), [VA, uu] = Vo(bs), [GA, r0] = Vo(bs), YA = /* @__PURE__ */ ct((a) => {
  const { __scopeMenu: r, open: c = !1, children: u, dir: s, onOpenChange: f, modal: m = !0 } = a, h = o0(r), [p, b] = y.useState(null), x = y.useRef(!1), v = Xn(f), S = rs(s);
  return y.useEffect(() => {
    const A = /* @__PURE__ */ ct(() => {
      x.current = !0, document.addEventListener("pointerdown", O, { capture: !0, once: !0 }), document.addEventListener("pointermove", O, { capture: !0, once: !0 });
    }, "handleKeyDown"), O = /* @__PURE__ */ ct(() => x.current = !1, "handlePointer");
    return document.addEventListener("keydown", A, { capture: !0 }), () => {
      document.removeEventListener("keydown", A, { capture: !0 }), document.removeEventListener("pointerdown", O, { capture: !0 }), document.removeEventListener("pointermove", O, { capture: !0 });
    };
  }, []), y.useEffect(() => {
    if (!c)
      return;
    const A = /* @__PURE__ */ ct(() => v(!1), "handleBlur");
    return window.addEventListener("blur", A), () => window.removeEventListener("blur", A);
  }, [c, v]), /* @__PURE__ */ E.jsx(e0, { ...h, children: /* @__PURE__ */ E.jsx(
    VA,
    {
      scope: r,
      open: c,
      onOpenChange: v,
      content: p,
      onContentChange: b,
      children: /* @__PURE__ */ E.jsx(
        GA,
        {
          scope: r,
          onClose: y.useCallback(() => v(!1), [v]),
          isUsingKeyboardRef: x,
          dir: S,
          modal: m,
          children: u
        }
      )
    }
  ) });
}, "Menu"), qA = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ ct(function(r, c) {
    const { __scopeMenu: u, ...s } = r, f = o0(u);
    return /* @__PURE__ */ E.jsx(t0, { ...f, ...s, ref: c });
  }, "MenuAnchor")
), mb = "MenuPortal", [kA, IA] = Vo(mb, {
  forceMount: void 0
}), XA = /* @__PURE__ */ ct((a) => {
  const { __scopeMenu: r, forceMount: c, children: u, container: s } = a, f = uu(mb, r);
  return /* @__PURE__ */ E.jsx(kA, { scope: r, forceMount: c, children: /* @__PURE__ */ E.jsx(Ka, { present: c || f.open, children: /* @__PURE__ */ E.jsx(us, { asChild: !0, container: s, children: u }) }) });
}, "MenuPortal"), Ya = "MenuContent", [QA, hb] = Vo(Ya), ZA = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ ct(function(r, c) {
    const u = IA(Ya, r.__scopeMenu), { forceMount: s = u.forceMount, ...f } = r, m = uu(Ya, r.__scopeMenu), h = r0(Ya, r.__scopeMenu);
    return /* @__PURE__ */ E.jsx(Mm.Provider, { scope: r.__scopeMenu, children: /* @__PURE__ */ E.jsx(Ka, { present: s || m.open, children: /* @__PURE__ */ E.jsx(Mm.Slot, { scope: r.__scopeMenu, children: h.modal ? /* @__PURE__ */ E.jsx(KA, { ...f, ref: c }) : /* @__PURE__ */ E.jsx(PA, { ...f, ref: c }) }) }) });
  }, "MenuContent")
), KA = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ct(function(r, c) {
    const u = uu(Ya, r.__scopeMenu), s = y.useRef(null), f = Fe(c, s);
    return y.useEffect(() => {
      const m = s.current;
      if (m) return Qm(m);
    }, []), /* @__PURE__ */ E.jsx(
      vb,
      {
        ...r,
        ref: f,
        trapFocus: u.open,
        disableOutsidePointerEvents: u.open,
        disableOutsideScroll: !0,
        onFocusOutside: Ce(
          r.onFocusOutside,
          (m) => m.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => u.onOpenChange(!1)
      }
    );
  }, "MenuRootContentModal")
), PA = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ ct(function(r, c) {
  const u = uu(Ya, r.__scopeMenu);
  return /* @__PURE__ */ E.jsx(
    vb,
    {
      ...r,
      ref: c,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => u.onOpenChange(!1)
    }
  );
}, "MenuRootContentNonModal")), FA = /* @__PURE__ */ Al("MenuContent.ScrollLock"), vb = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ct(function(r, c) {
    const {
      __scopeMenu: u,
      loop: s = !1,
      trapFocus: f,
      onOpenAutoFocus: m,
      onCloseAutoFocus: h,
      disableOutsidePointerEvents: p,
      onEntryFocus: b,
      onEscapeKeyDown: x,
      onPointerDownOutside: v,
      onFocusOutside: S,
      onInteractOutside: A,
      onDismiss: O,
      disableOutsideScroll: w,
      ...C
    } = r, _ = uu(Ya, u), D = r0(Ya, u), j = o0(u), M = db(u), Y = LA(u), [I, X] = y.useState(null), L = y.useRef(null), F = Fe(c, L, _.onContentChange), ae = y.useRef(0), ie = y.useRef(""), ee = y.useRef(0), fe = y.useRef(null), ge = y.useRef("right"), he = y.useRef(0), Q = w ? ss : y.Fragment, J = w ? { as: FA, allowPinchZoom: !0 } : void 0, te = /* @__PURE__ */ ct((G) => {
      const Ye = ie.current + G, De = Y().filter((ne) => !ne.disabled), qe = document.activeElement, R = De.find((ne) => ne.ref.current === qe)?.textValue, Z = De.map((ne) => ne.textValue), oe = Sb(Z, Ye, R), se = De.find((ne) => ne.textValue === oe)?.ref.current;
      (/* @__PURE__ */ ct((function ne(ue) {
        ie.current = ue, window.clearTimeout(ae.current), ue !== "" && (ae.current = window.setTimeout(() => ne(""), 1e3));
      }), "updateSearch"))(Ye), se && setTimeout(() => se.focus());
    }, "handleTypeaheadSearch");
    y.useEffect(() => () => window.clearTimeout(ae.current), []), iu();
    const de = y.useCallback((G) => ge.current === fe.current?.side && Eb(G, fe.current?.area), []);
    return /* @__PURE__ */ E.jsx(
      QA,
      {
        scope: u,
        searchRef: ie,
        onItemEnter: y.useCallback(
          (G) => {
            de(G) && G.preventDefault();
          },
          [de]
        ),
        onItemLeave: y.useCallback(
          (G) => {
            de(G) || (L.current?.focus(), X(null));
          },
          [de]
        ),
        onTriggerLeave: y.useCallback(
          (G) => {
            de(G) && G.preventDefault();
          },
          [de]
        ),
        pointerGraceTimerRef: ee,
        onPointerGraceIntentChange: y.useCallback((G) => {
          fe.current = G;
        }, []),
        children: /* @__PURE__ */ E.jsx(Q, { ...J, children: /* @__PURE__ */ E.jsx(
          km,
          {
            asChild: !0,
            trapped: f,
            onMountAutoFocus: Ce(m, (G) => {
              G.preventDefault(), L.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: h,
            children: /* @__PURE__ */ E.jsx(
              is,
              {
                asChild: !0,
                disableOutsidePointerEvents: p,
                onEscapeKeyDown: x,
                onPointerDownOutside: v,
                onFocusOutside: S,
                onInteractOutside: A,
                onDismiss: O,
                children: /* @__PURE__ */ E.jsx(
                  NA,
                  {
                    asChild: !0,
                    ...M,
                    dir: D.dir,
                    orientation: "vertical",
                    loop: s,
                    currentTabStopId: I,
                    onCurrentTabStopIdChange: X,
                    onEntryFocus: Ce(b, (G) => {
                      D.isUsingKeyboardRef.current || G.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ E.jsx(
                      n0,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": gb(_.open),
                        "data-radix-menu-content": "",
                        dir: D.dir,
                        ...j,
                        ...C,
                        ref: F,
                        style: { outline: "none", ...C.style },
                        onKeyDown: Ce(C.onKeyDown, (G) => {
                          const De = G.target.closest("[data-radix-menu-content]") === G.currentTarget, qe = G.ctrlKey || G.altKey || G.metaKey, R = G.key.length === 1;
                          De && (G.key === "Tab" && G.preventDefault(), !qe && R && te(G.key));
                          const Z = L.current;
                          if (G.target !== Z || !HA.includes(G.key)) return;
                          G.preventDefault();
                          const se = Y().filter((ne) => !ne.disabled).map((ne) => ne.ref.current);
                          sb.includes(G.key) && se.reverse(), yb(se);
                        }),
                        onBlur: Ce(r.onBlur, (G) => {
                          G.currentTarget.contains(G.target) || (window.clearTimeout(ae.current), ie.current = "");
                        }),
                        onPointerMove: Ce(
                          r.onPointerMove,
                          ls((G) => {
                            const Ye = G.target, De = he.current !== G.clientX;
                            if (G.currentTarget.contains(Ye) && De) {
                              const qe = G.clientX > he.current ? "right" : "left";
                              ge.current = qe, he.current = G.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }, "MenuContentImpl")
), Nm = "MenuItem", a2 = "menu.itemSelect", JA = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ct(function(r, c) {
    const { disabled: u = !1, onSelect: s, ...f } = r, m = y.useRef(null), h = r0(Nm, r.__scopeMenu), p = hb(Nm, r.__scopeMenu), b = Fe(c, m), x = y.useRef(!1), v = /* @__PURE__ */ ct(() => {
      const S = m.current;
      if (!u && S) {
        const A = new CustomEvent(a2, { bubbles: !0, cancelable: !0 });
        S.addEventListener(a2, (O) => s?.(O), { once: !0 }), Gm(S, A), A.defaultPrevented ? x.current = !1 : h.onClose();
      }
    }, "handleSelect");
    return /* @__PURE__ */ E.jsx(
      $A,
      {
        ...f,
        ref: b,
        disabled: u,
        onClick: Ce(r.onClick, v),
        onPointerDown: (S) => {
          r.onPointerDown?.(S), x.current = !0;
        },
        onPointerUp: Ce(r.onPointerUp, (S) => {
          x.current || S.currentTarget?.click();
        }),
        onKeyDown: Ce(r.onKeyDown, (S) => {
          u || S.target !== S.currentTarget || p.searchRef.current !== "" && S.key === " " || jA.includes(S.key) && (S.currentTarget.click(), S.preventDefault());
        })
      }
    );
  }, "MenuItem")
), $A = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ ct(function(r, c) {
    const { __scopeMenu: u, disabled: s = !1, textValue: f, ...m } = r, h = hb(Nm, u), p = db(u), b = y.useRef(null), x = Fe(c, b), [v, S] = y.useState(!1), [A, O] = y.useState("");
    return y.useEffect(() => {
      const w = b.current;
      w && O((w.textContent ?? "").trim());
    }, [m.children]), /* @__PURE__ */ E.jsx(
      Mm.ItemSlot,
      {
        scope: u,
        disabled: s,
        textValue: f ?? A,
        children: /* @__PURE__ */ E.jsx(DA, { asChild: !0, ...p, focusable: !s, children: /* @__PURE__ */ E.jsx(
          it.div,
          {
            role: "menuitem",
            "data-highlighted": v ? "" : void 0,
            "aria-disabled": s || void 0,
            "data-disabled": s ? "" : void 0,
            ...m,
            ref: x,
            onPointerMove: Ce(
              r.onPointerMove,
              ls((w) => {
                s ? h.onItemLeave(w) : (h.onItemEnter(w), w.defaultPrevented || w.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: Ce(
              r.onPointerLeave,
              ls((w) => h.onItemLeave(w))
            ),
            onFocus: Ce(r.onFocus, () => S(!0)),
            onBlur: Ce(r.onBlur, () => S(!1))
          }
        ) })
      }
    );
  }, "MenuItemImpl")
), WA = "MenuRadioGroup", [m4, h4] = Vo(
  WA,
  { value: void 0, onValueChange: /* @__PURE__ */ ct(() => {
  }, "onValueChange") }
), eO = "MenuItemIndicator", [v4, g4] = Vo(
  eO,
  { checked: !1 }
), tO = "MenuSub", [p4, y4] = Vo(tO);
function gb(a) {
  return a ? "open" : "closed";
}
ct(gb, "getOpenState");
function pb(a) {
  return a === "indeterminate";
}
ct(pb, "isIndeterminate");
function nO(a) {
  return pb(a) ? "indeterminate" : a ? "checked" : "unchecked";
}
ct(nO, "getCheckedState");
function yb(a) {
  const r = document.activeElement;
  for (const c of a)
    if (c === r || (c.focus(), document.activeElement !== r)) return;
}
ct(yb, "focusFirst");
function bb(a, r) {
  return a.map((c, u) => a[(r + u) % a.length]);
}
ct(bb, "wrapArray");
function Sb(a, r, c) {
  const s = r.length > 1 && Array.from(r).every((b) => b === r[0]) ? r[0] : r, f = c ? a.indexOf(c) : -1;
  let m = bb(a, Math.max(f, 0));
  s.length === 1 && (m = m.filter((b) => b !== c));
  const p = m.find(
    (b) => b.toLowerCase().startsWith(s.toLowerCase())
  );
  return p !== c ? p : void 0;
}
ct(Sb, "getNextMatch");
function xb(a, r) {
  const { x: c, y: u } = a;
  let s = !1;
  for (let f = 0, m = r.length - 1; f < r.length; m = f++) {
    const h = r[f], p = r[m], b = h.x, x = h.y, v = p.x, S = p.y;
    x > u != S > u && c < (v - b) * (u - x) / (S - x) + b && (s = !s);
  }
  return s;
}
ct(xb, "isPointInPolygon");
function Eb(a, r) {
  if (!r) return !1;
  const c = { x: a.clientX, y: a.clientY };
  return xb(c, r);
}
ct(Eb, "isPointerInGraceArea");
function ls(a) {
  return (r) => r.pointerType === "mouse" ? a(r) : void 0;
}
ct(ls, "whenMouse");
var lO = YA, aO = qA, oO = XA, rO = ZA, iO = JA, uO = Object.defineProperty, cu = (a, r) => uO(a, "name", { value: r, configurable: !0 }), i0 = "DropdownMenu", [cO, b4] = /* @__PURE__ */ Ml(
  i0,
  [fb]
), su = fb(), [sO, Cb] = cO(i0), fO = /* @__PURE__ */ cu((a) => {
  const {
    __scopeDropdownMenu: r,
    children: c,
    dir: u,
    open: s,
    defaultOpen: f,
    onOpenChange: m,
    modal: h = !0
  } = a, p = su(r), b = y.useRef(null), [x, v] = zo({
    prop: s,
    defaultProp: f ?? !1,
    onChange: m,
    caller: i0
  });
  return /* @__PURE__ */ E.jsx(
    sO,
    {
      scope: r,
      triggerId: Tl(),
      triggerRef: b,
      contentId: Tl(),
      open: x,
      onOpenChange: v,
      onOpenToggle: y.useCallback(() => v((S) => !S), [v]),
      modal: h,
      children: /* @__PURE__ */ E.jsx(lO, { ...p, open: x, onOpenChange: v, dir: u, modal: h, children: c })
    }
  );
}, "DropdownMenu"), dO = "DropdownMenuTrigger", mO = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ cu(function(r, c) {
    const { __scopeDropdownMenu: u, disabled: s = !1, ...f } = r, m = Cb(dO, u), h = su(u), p = Fe(c, m.triggerRef);
    return /* @__PURE__ */ E.jsx(aO, { asChild: !0, ...h, children: /* @__PURE__ */ E.jsx(
      it.button,
      {
        type: "button",
        id: m.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": m.open,
        "aria-controls": m.open ? m.contentId : void 0,
        "data-state": m.open ? "open" : "closed",
        "data-disabled": s ? "" : void 0,
        disabled: s,
        ...f,
        ref: p,
        onPointerDown: Ce(r.onPointerDown, (b) => {
          !s && b.button === 0 && b.ctrlKey === !1 && (m.onOpenToggle(), m.open || b.preventDefault());
        }),
        onKeyDown: Ce(r.onKeyDown, (b) => {
          s || (["Enter", " "].includes(b.key) && m.onOpenToggle(), b.key === "ArrowDown" && m.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(b.key) && b.preventDefault());
        })
      }
    ) });
  }, "DropdownMenuTrigger")
), hO = /* @__PURE__ */ cu((a) => {
  const { __scopeDropdownMenu: r, ...c } = a, u = su(r);
  return /* @__PURE__ */ E.jsx(oO, { ...u, ...c });
}, "DropdownMenuPortal"), vO = "DropdownMenuContent", gO = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ cu(function(r, c) {
    const { __scopeDropdownMenu: u, ...s } = r, f = Cb(vO, u), m = su(u), h = y.useRef(!1);
    return /* @__PURE__ */ E.jsx(
      rO,
      {
        id: f.contentId,
        "aria-labelledby": f.triggerId,
        ...m,
        ...s,
        ref: c,
        onCloseAutoFocus: Ce(r.onCloseAutoFocus, (p) => {
          h.current || f.triggerRef.current?.focus(), h.current = !1, p.preventDefault();
        }),
        onInteractOutside: Ce(r.onInteractOutside, (p) => {
          const b = p.detail.originalEvent, x = b.button === 0 && b.ctrlKey === !0, v = b.button === 2 || x;
          (!f.modal || v) && (h.current = !0);
        }),
        style: {
          ...r.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }, "DropdownMenuContent")
), pO = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ cu(function(r, c) {
    const { __scopeDropdownMenu: u, ...s } = r, f = su(u);
    return /* @__PURE__ */ E.jsx(iO, { ...f, ...s, ref: c });
  }, "DropdownMenuItem")
), yO = fO, bO = mO, SO = hO, xO = gO, EO = pO, CO = Object.defineProperty, wO = (a, r) => CO(a, "name", { value: r, configurable: !0 });
function wb(a) {
  const r = y.useRef({ value: a, previous: a });
  return y.useMemo(() => (r.current.value !== a && (r.current.previous = r.current.value, r.current.value = a), r.current.previous), [a]);
}
wO(wb, "usePrevious");
var TO = Object.defineProperty, AO = (a, r) => TO(a, "name", { value: r, configurable: !0 });
function Dm(a, [r, c]) {
  return Math.min(c, Math.max(r, a));
}
AO(Dm, "clamp");
var OO = Object.defineProperty, nt = (a, r) => OO(a, "name", { value: r, configurable: !0 }), _O = [" ", "Enter", "ArrowUp", "ArrowDown"], RO = [" ", "Enter"], Zr = "Select", [Ss, u0, MO] = /* @__PURE__ */ os(Zr), [Go, S4] = /* @__PURE__ */ Ml(Zr, [
  MO,
  $r
]), c0 = $r(), [NO, Fa] = Go(Zr), [DO, zO] = Go(Zr);
function Tb(a) {
  const {
    __scopeSelect: r,
    children: c,
    open: u,
    defaultOpen: s,
    onOpenChange: f,
    value: m,
    defaultValue: h,
    onValueChange: p,
    dir: b,
    name: x,
    autoComplete: v,
    disabled: S,
    required: A,
    form: O,
    // @ts-expect-error internal render prop used by `Select` to compose its default parts
    internal_do_not_use_render: w
  } = a, C = c0(r), [_, D] = y.useState(null), [j, M] = y.useState(null), [Y, I] = y.useState(!1), X = rs(b), [L, F] = zo({
    prop: u,
    defaultProp: s ?? !1,
    onChange: f,
    caller: Zr
  }), [ae, ie] = zo({
    prop: m,
    defaultProp: h,
    onChange: p,
    caller: Zr
  }), ee = y.useRef(null), fe = y.useRef(ae);
  y.useEffect(() => {
    const De = O ? _?.ownerDocument.getElementById(O) : _?.form;
    if (De instanceof HTMLFormElement) {
      const qe = /* @__PURE__ */ nt(() => ie(fe.current), "reset");
      return De.addEventListener("reset", qe), () => De.removeEventListener("reset", qe);
    }
  }, [O, _, ie]);
  const ge = _ ? !!O || !!_.closest("form") : !0, [he, Q] = y.useState(/* @__PURE__ */ new Set()), J = Tl(), te = Array.from(he).map((De) => De.props.value).join(";"), de = y.useCallback((De) => {
    Q((qe) => new Set(qe).add(De));
  }, []), G = y.useCallback((De) => {
    Q((qe) => {
      const R = new Set(qe);
      return R.delete(De), R;
    });
  }, []), Ye = {
    required: A,
    trigger: _,
    onTriggerChange: D,
    valueNode: j,
    onValueNodeChange: M,
    valueNodeHasChildren: Y,
    onValueNodeHasChildrenChange: I,
    contentId: J,
    value: ae,
    onValueChange: ie,
    open: L,
    onOpenChange: F,
    dir: X,
    triggerPointerDownPosRef: ee,
    disabled: S,
    name: x,
    autoComplete: v,
    form: O,
    nativeOptions: he,
    nativeSelectKey: te,
    isFormControl: ge
  };
  return /* @__PURE__ */ E.jsx(e0, { ...C, children: /* @__PURE__ */ E.jsx(NO, { scope: r, ...Ye, children: /* @__PURE__ */ E.jsx(Ss.Provider, { scope: r, children: /* @__PURE__ */ E.jsx(
    DO,
    {
      scope: r,
      onNativeOptionAdd: de,
      onNativeOptionRemove: G,
      children: _b(w) ? w(Ye) : c
    }
  ) }) }) });
}
nt(Tb, "SelectProvider");
var jO = /* @__PURE__ */ nt((a) => {
  const { __scopeSelect: r, children: c, ...u } = a;
  return /* @__PURE__ */ E.jsx(
    Tb,
    {
      __scopeSelect: r,
      ...u,
      internal_do_not_use_render: ({ isFormControl: s }) => /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
        c,
        s ? /* @__PURE__ */ E.jsx(
          o_,
          {
            __scopeSelect: r
          }
        ) : null
      ] })
    }
  );
}, "Select"), UO = "SelectTrigger", HO = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, disabled: s = !1, ...f } = r, m = c0(u), h = Fa(UO, u), p = h.disabled || s, b = Fe(c, h.onTriggerChange), x = u0(u), v = y.useRef("touch"), [S, A, O] = s0((C) => {
      const _ = x().filter((M) => !M.disabled), D = _.find((M) => M.value === h.value), j = f0(_, C, D);
      j !== void 0 && h.onValueChange(j.value);
    }), w = /* @__PURE__ */ nt((C) => {
      p || (h.onOpenChange(!0), O()), C && (h.triggerPointerDownPosRef.current = {
        x: Math.round(C.pageX),
        y: Math.round(C.pageY)
      });
    }, "handleOpen");
    return /* @__PURE__ */ E.jsx(t0, { asChild: !0, ...m, children: /* @__PURE__ */ E.jsx(
      it.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": h.open ? h.contentId : void 0,
        "aria-expanded": h.open,
        "aria-required": h.required,
        "aria-autocomplete": "none",
        dir: h.dir,
        "data-state": h.open ? "open" : "closed",
        disabled: p,
        "data-disabled": p ? "" : void 0,
        "data-placeholder": fu(h.value) ? "" : void 0,
        ...f,
        ref: b,
        onClick: Ce(f.onClick, (C) => {
          C.currentTarget.focus(), v.current !== "mouse" && w(C);
        }),
        onPointerDown: Ce(f.onPointerDown, (C) => {
          v.current = C.pointerType;
          const _ = C.target;
          _.hasPointerCapture(C.pointerId) && _.releasePointerCapture(C.pointerId), C.button === 0 && C.ctrlKey === !1 && C.pointerType === "mouse" && (w(C), C.preventDefault());
        }),
        onKeyDown: Ce(f.onKeyDown, (C) => {
          const _ = S.current !== "";
          !(C.ctrlKey || C.altKey || C.metaKey) && C.key.length === 1 && A(C.key), !(_ && C.key === " ") && _O.includes(C.key) && (w(), C.preventDefault());
        })
      }
    ) });
  }, "SelectTrigger")
), LO = "SelectValue", BO = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, className: s, style: f, children: m, placeholder: h = "", ...p } = r, b = Fa(LO, u), { onValueNodeHasChildrenChange: x } = b, v = m !== void 0, S = Fe(c, b.onValueNodeChange);
    Dt(() => {
      x(v);
    }, [x, v]);
    const A = fu(b.value);
    return /* @__PURE__ */ E.jsx(
      it.span,
      {
        ...p,
        asChild: A ? !1 : p.asChild,
        ref: S,
        style: { pointerEvents: "none" },
        children: /* @__PURE__ */ E.jsx(y.Fragment, { children: A ? h : m }, A ? "placeholder" : "value")
      }
    );
  }, "SelectValue")
), VO = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, children: s, ...f } = r;
    return /* @__PURE__ */ E.jsx(it.span, { "aria-hidden": !0, ...f, ref: c, children: s || "▼" });
  }, "SelectIcon")
), GO = "SelectPortal", [YO, qO] = Go(GO, {
  forceMount: void 0
}), kO = /* @__PURE__ */ nt((a) => {
  const { __scopeSelect: r, forceMount: c, ...u } = a;
  return /* @__PURE__ */ E.jsx(YO, { scope: a.__scopeSelect, forceMount: c, children: /* @__PURE__ */ E.jsx(us, { asChild: !0, ...u }) });
}, "SelectPortal"), Ho = "SelectContent", IO = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const u = qO(Ho, r.__scopeSelect), { forceMount: s = u.forceMount, ...f } = r, m = Fa(Ho, r.__scopeSelect), [h, p] = y.useState();
    return Dt(() => {
      p(new DocumentFragment());
    }, []), /* @__PURE__ */ E.jsx(Ka, { present: s || m.open, children: ({ present: b }) => b ? /* @__PURE__ */ E.jsx(ZO, { ...f, ref: c }) : /* @__PURE__ */ E.jsx(XO, { ...f, fragment: h }) });
  }, "SelectContent")
), XO = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ nt(function(r, c) {
  const { __scopeSelect: u, children: s, fragment: f } = r;
  return f ? ou.createPortal(
    /* @__PURE__ */ E.jsx(Ab, { scope: u, children: /* @__PURE__ */ E.jsx(Ss.Slot, { scope: u, children: /* @__PURE__ */ E.jsx("div", { ref: c, children: s }) }) }),
    f
  ) : null;
}, "SelectContentFragment")), al = 10, [Ab, xs] = Go(Ho), QO = /* @__PURE__ */ Al("SelectContent.RemoveScroll"), ZO = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u } = r, {
      position: s = "item-aligned",
      onCloseAutoFocus: f,
      onEscapeKeyDown: m,
      onPointerDownOutside: h,
      //
      // PopperContent props
      side: p,
      sideOffset: b,
      align: x,
      alignOffset: v,
      arrowPadding: S,
      collisionBoundary: A,
      collisionPadding: O,
      sticky: w,
      hideWhenDetached: C,
      avoidCollisions: _,
      //
      ...D
    } = r, j = Fa(Ho, u), [M, Y] = y.useState(null), [I, X] = y.useState(null), L = Fe(c, Y), [F, ae] = y.useState(null), [ie, ee] = y.useState(
      null
    ), fe = u0(u), [ge, he] = y.useState(!1), Q = y.useRef(!1);
    y.useEffect(() => {
      if (M) return Qm(M);
    }, [M]), iu();
    const J = y.useCallback(
      (ne) => {
        const [ue, ...xe] = fe().map((je) => je.ref.current), [le] = xe.slice(-1), re = document.activeElement;
        for (const je of ne)
          if (je === re || (je?.scrollIntoView({ block: "nearest" }), je === ue && I && (I.scrollTop = 0), je === le && I && (I.scrollTop = I.scrollHeight), je?.focus(), document.activeElement !== re)) return;
      },
      [fe, I]
    ), te = y.useCallback(
      () => J([F, M]),
      [J, F, M]
    );
    y.useEffect(() => {
      ge && te();
    }, [ge, te]);
    const { onOpenChange: de, triggerPointerDownPosRef: G } = j;
    y.useEffect(() => {
      if (M) {
        let ne = { x: 0, y: 0 };
        const ue = /* @__PURE__ */ nt((le) => {
          ne = {
            x: Math.abs(Math.round(le.pageX) - (G.current?.x ?? 0)),
            y: Math.abs(Math.round(le.pageY) - (G.current?.y ?? 0))
          };
        }, "handlePointerMove"), xe = /* @__PURE__ */ nt((le) => {
          ne.x <= 10 && ne.y <= 10 ? le.preventDefault() : le.composedPath().includes(M) || de(!1), document.removeEventListener("pointermove", ue), G.current = null;
        }, "handlePointerUp");
        return G.current !== null && (document.addEventListener("pointermove", ue), document.addEventListener("pointerup", xe, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", ue), document.removeEventListener("pointerup", xe, { capture: !0 });
        };
      }
    }, [M, de, G]), y.useEffect(() => {
      const ne = /* @__PURE__ */ nt(() => de(!1), "close");
      return window.addEventListener("blur", ne), window.addEventListener("resize", ne), () => {
        window.removeEventListener("blur", ne), window.removeEventListener("resize", ne);
      };
    }, [de]);
    const [Ye, De] = s0((ne) => {
      const ue = fe().filter((re) => !re.disabled), xe = ue.find((re) => re.ref.current === document.activeElement), le = f0(ue, ne, xe);
      le && setTimeout(() => le.ref.current?.focus());
    }), qe = y.useCallback(
      (ne, ue, xe) => {
        const le = !Q.current && !xe;
        (j.value !== void 0 && j.value === ue || le) && (ae(ne), le && (Q.current = !0));
      },
      [j.value]
    ), R = y.useCallback(() => M?.focus(), [M]), Z = y.useCallback(
      (ne, ue, xe) => {
        const le = !Q.current && !xe;
        (j.value !== void 0 && j.value === ue || le) && ee(ne);
      },
      [j.value]
    ), oe = s === "popper" ? o2 : KO, se = oe === o2 ? {
      side: p,
      sideOffset: b,
      align: x,
      alignOffset: v,
      arrowPadding: S,
      collisionBoundary: A,
      collisionPadding: O,
      sticky: w,
      hideWhenDetached: C,
      avoidCollisions: _
    } : {};
    return /* @__PURE__ */ E.jsx(
      Ab,
      {
        scope: u,
        content: M,
        viewport: I,
        onViewportChange: X,
        itemRefCallback: qe,
        selectedItem: F,
        onItemLeave: R,
        itemTextRefCallback: Z,
        focusSelectedItem: te,
        selectedItemText: ie,
        position: s,
        isPositioned: ge,
        searchRef: Ye,
        children: /* @__PURE__ */ E.jsx(ss, { as: QO, allowPinchZoom: !0, children: /* @__PURE__ */ E.jsx(
          km,
          {
            asChild: !0,
            trapped: j.open,
            onMountAutoFocus: (ne) => {
              ne.preventDefault();
            },
            onUnmountAutoFocus: Ce(f, (ne) => {
              j.trigger?.focus({ preventScroll: !0 }), ne.preventDefault();
            }),
            children: /* @__PURE__ */ E.jsx(
              is,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: m,
                onPointerDownOutside: h,
                onFocusOutside: (ne) => ne.preventDefault(),
                onDismiss: () => j.onOpenChange(!1),
                children: /* @__PURE__ */ E.jsx(
                  oe,
                  {
                    role: "listbox",
                    id: j.contentId,
                    "data-state": j.open ? "open" : "closed",
                    dir: j.dir,
                    onContextMenu: (ne) => ne.preventDefault(),
                    ...D,
                    ...se,
                    onPlaced: () => he(!0),
                    ref: L,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...D.style
                    },
                    onKeyDown: Ce(D.onKeyDown, (ne) => {
                      const ue = ne.ctrlKey || ne.altKey || ne.metaKey;
                      if (ne.key === "Tab" && ne.preventDefault(), !ue && ne.key.length === 1 && De(ne.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(ne.key)) {
                        let le = fe().filter((re) => !re.disabled).map((re) => re.ref.current);
                        if (["ArrowUp", "End"].includes(ne.key) && (le = le.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(ne.key)) {
                          const re = ne.target, je = le.indexOf(re);
                          le = le.slice(je + 1);
                        }
                        setTimeout(() => J(le)), ne.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }, "SelectContentImpl")
), KO = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ nt(function(r, c) {
  const { __scopeSelect: u, onPlaced: s, ...f } = r, m = Fa(Ho, u), h = xs(Ho, u), [p, b] = y.useState(null), [x, v] = y.useState(null), S = Fe(c, v), A = u0(u), O = y.useRef(!1), w = y.useRef(!0), { viewport: C, selectedItem: _, selectedItemText: D, focusSelectedItem: j } = h, M = y.useCallback(() => {
    if (m.trigger && m.valueNode && p && x && C && _ && D) {
      const L = m.trigger.getBoundingClientRect(), F = x.getBoundingClientRect(), ae = m.valueNode.getBoundingClientRect(), ie = D.getBoundingClientRect();
      if (m.dir !== "rtl") {
        const re = ie.left - F.left, je = ae.left - re, pt = L.left - je, at = L.width + pt, St = Math.max(at, F.width), st = window.innerWidth - al, Xe = Dm(je, [
          al,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(al, st - St)
        ]);
        p.style.minWidth = at + "px", p.style.left = Xe + "px";
      } else {
        const re = F.right - ie.right, je = window.innerWidth - ae.right - re, pt = window.innerWidth - L.right - je, at = L.width + pt, St = Math.max(at, F.width), st = window.innerWidth - al, Xe = Dm(je, [
          al,
          Math.max(al, st - St)
        ]);
        p.style.minWidth = at + "px", p.style.right = Xe + "px";
      }
      const ee = A(), fe = window.innerHeight - al * 2, ge = C.scrollHeight, he = window.getComputedStyle(x), Q = parseInt(he.borderTopWidth, 10), J = parseInt(he.paddingTop, 10), te = parseInt(he.borderBottomWidth, 10), de = parseInt(he.paddingBottom, 10), G = Q + J + ge + de + te, Ye = Math.min(_.offsetHeight * 5, G), De = window.getComputedStyle(C), qe = parseInt(De.paddingTop, 10), R = parseInt(De.paddingBottom, 10), Z = L.top + L.height / 2 - al, oe = fe - Z, se = _.offsetHeight / 2, ne = _.offsetTop + se, ue = Q + J + ne, xe = G - ue;
      if (ue <= Z) {
        const re = ee.length > 0 && _ === ee[ee.length - 1].ref.current;
        p.style.bottom = "0px";
        const je = x.clientHeight - C.offsetTop - C.offsetHeight, pt = Math.max(
          oe,
          se + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (re ? R : 0) + je + te
        ), at = ue + pt;
        p.style.height = at + "px";
      } else {
        const re = ee.length > 0 && _ === ee[0].ref.current;
        p.style.top = "0px";
        const pt = Math.max(
          Z,
          Q + C.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (re ? qe : 0) + se
        ) + xe;
        p.style.height = pt + "px", C.scrollTop = ue - Z + C.offsetTop;
      }
      p.style.margin = `${al}px 0`, p.style.minHeight = Ye + "px", p.style.maxHeight = fe + "px", s?.(), requestAnimationFrame(() => O.current = !0);
    }
  }, [
    A,
    m.trigger,
    m.valueNode,
    p,
    x,
    C,
    _,
    D,
    m.dir,
    s
  ]);
  Dt(() => M(), [M]);
  const [Y, I] = y.useState();
  Dt(() => {
    x && I(window.getComputedStyle(x).zIndex);
  }, [x]);
  const X = y.useCallback(
    (L) => {
      L && w.current === !0 && (M(), j?.(), w.current = !1);
    },
    [M, j]
  );
  return /* @__PURE__ */ E.jsx(
    PO,
    {
      scope: u,
      contentWrapper: p,
      shouldExpandOnScrollRef: O,
      onScrollButtonChange: X,
      children: /* @__PURE__ */ E.jsx(
        "div",
        {
          ref: b,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: Y
          },
          children: /* @__PURE__ */ E.jsx(
            it.div,
            {
              ...f,
              ref: S,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...f.style
              }
            }
          )
        }
      )
    }
  );
}, "SelectItemAlignedPosition")), o2 = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ nt(function(r, c) {
  const {
    __scopeSelect: u,
    align: s = "start",
    collisionPadding: f = al,
    ...m
  } = r, h = c0(u);
  return /* @__PURE__ */ E.jsx(
    n0,
    {
      ...h,
      ...m,
      ref: c,
      align: s,
      collisionPadding: f,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...m.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
}, "SelectPopperPosition")), [PO, FO] = Go(Ho, {}), r2 = "SelectViewport", JO = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, nonce: s, ...f } = r, m = xs(r2, u), h = FO(r2, u), p = Fe(c, m.onViewportChange), b = y.useRef(0);
    return /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
      /* @__PURE__ */ E.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: s
        }
      ),
      /* @__PURE__ */ E.jsx(Ss.Slot, { scope: u, children: /* @__PURE__ */ E.jsx(
        it.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...f,
          ref: p,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...f.style
          },
          onScroll: Ce(f.onScroll, (x) => {
            const v = x.currentTarget, { contentWrapper: S, shouldExpandOnScrollRef: A } = h;
            if (A?.current && S) {
              const O = Math.abs(b.current - v.scrollTop);
              if (O > 0) {
                const w = window.innerHeight - al * 2, C = parseFloat(S.style.minHeight), _ = parseFloat(S.style.height), D = Math.max(C, _);
                if (D < w) {
                  const j = D + O, M = Math.min(w, j), Y = j - M;
                  S.style.height = M + "px", S.style.bottom === "0px" && (v.scrollTop = Y > 0 ? Y : 0, S.style.justifyContent = "flex-end");
                }
              }
            }
            b.current = v.scrollTop;
          })
        }
      ) })
    ] });
  }, "SelectViewport")
), $O = "SelectGroup", [x4, E4] = Go($O), zm = "SelectItem", [WO, Ob] = Go(zm), e_ = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const {
      __scopeSelect: u,
      value: s,
      disabled: f = !1,
      textValue: m,
      ...h
    } = r, p = Fa(zm, u), b = xs(zm, u), x = p.value === s, [v, S] = y.useState(m ?? ""), [A, O] = y.useState(!1), w = Xn(
      (M) => b.itemRefCallback?.(M, s, f)
    ), C = Fe(c, w), _ = Tl(), D = y.useRef("touch"), j = /* @__PURE__ */ nt(() => {
      f || (p.onValueChange(s), p.onOpenChange(!1));
    }, "handleSelect");
    return /* @__PURE__ */ E.jsx(
      WO,
      {
        scope: u,
        value: s,
        disabled: f,
        textId: _,
        isSelected: x,
        onItemTextChange: y.useCallback((M) => {
          S((Y) => Y || (M?.textContent ?? "").trim());
        }, []),
        children: /* @__PURE__ */ E.jsx(
          Ss.ItemSlot,
          {
            scope: u,
            value: s,
            disabled: f,
            textValue: v,
            children: /* @__PURE__ */ E.jsx(
              it.div,
              {
                role: "option",
                "aria-labelledby": _,
                "data-highlighted": A ? "" : void 0,
                "aria-selected": x && A,
                "data-state": x ? "checked" : "unchecked",
                "aria-disabled": f || void 0,
                "data-disabled": f ? "" : void 0,
                tabIndex: f ? void 0 : -1,
                ...h,
                ref: C,
                onFocus: Ce(h.onFocus, () => O(!0)),
                onBlur: Ce(h.onBlur, () => O(!1)),
                onClick: Ce(h.onClick, () => {
                  D.current !== "mouse" && j();
                }),
                onPointerUp: Ce(h.onPointerUp, () => {
                  D.current === "mouse" && j();
                }),
                onPointerDown: Ce(h.onPointerDown, (M) => {
                  D.current = M.pointerType;
                }),
                onPointerMove: Ce(h.onPointerMove, (M) => {
                  D.current = M.pointerType, f ? b.onItemLeave?.() : D.current === "mouse" && M.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: Ce(h.onPointerLeave, (M) => {
                  M.currentTarget === document.activeElement && b.onItemLeave?.();
                }),
                onKeyDown: Ce(h.onKeyDown, (M) => {
                  f || M.target !== M.currentTarget || b.searchRef?.current !== "" && M.key === " " || (RO.includes(M.key) && j(), M.key === " " && M.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }, "SelectItem")
), Xc = "SelectItemText", t_ = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, className: s, style: f, ...m } = r, h = Fa(Xc, u), p = xs(Xc, u), b = Ob(Xc, u), x = zO(Xc, u), [v, S] = y.useState(null), A = Xn(
      (j) => p.itemTextRefCallback?.(j, b.value, b.disabled)
    ), O = Fe(
      c,
      S,
      b.onItemTextChange,
      A
    ), w = v?.textContent, C = y.useMemo(
      () => /* @__PURE__ */ E.jsx("option", { value: b.value, disabled: b.disabled, children: w }, b.value),
      [b.disabled, b.value, w]
    ), { onNativeOptionAdd: _, onNativeOptionRemove: D } = x;
    return Dt(() => (_(C), () => D(C)), [_, D, C]), /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
      /* @__PURE__ */ E.jsx(it.span, { id: b.textId, ...m, ref: O }),
      b.isSelected && h.valueNode && !h.valueNodeHasChildren && !fu(h.value) ? ou.createPortal(m.children, h.valueNode) : null
    ] });
  }, "SelectItemText")
), n_ = "SelectItemIndicator", l_ = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ nt(function(r, c) {
    const { __scopeSelect: u, ...s } = r;
    return Ob(n_, u).isSelected ? /* @__PURE__ */ E.jsx(it.span, { "aria-hidden": !0, ...s, ref: c }) : null;
  }, "SelectItemIndicator")
), a_ = "SelectBubbleInput", o_ = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ nt(function({ __scopeSelect: r, ...c }, u) {
    const s = Fa(a_, r), { value: f, onValueChange: m, required: h, disabled: p, name: b, autoComplete: x, form: v } = s, { nativeOptions: S, nativeSelectKey: A } = s, O = y.useRef(null), w = Fe(u, O), C = f ?? "", _ = wb(C), D = Array.from(S).some(
      (j) => (j.props.value ?? "") === ""
    );
    return y.useEffect(() => {
      const j = O.current;
      if (!j) return;
      const M = window.HTMLSelectElement.prototype, I = Object.getOwnPropertyDescriptor(
        M,
        "value"
      ).set;
      if (_ !== C && I) {
        const X = new Event("change", { bubbles: !0 });
        I.call(j, C), j.dispatchEvent(X);
      }
    }, [_, C]), /* @__PURE__ */ E.jsxs(
      it.select,
      {
        "aria-hidden": !0,
        required: h,
        tabIndex: -1,
        name: b,
        autoComplete: x,
        disabled: p,
        form: v,
        onChange: (j) => m(j.target.value),
        ...c,
        style: { ...Q2, ...c.style },
        ref: w,
        defaultValue: C,
        children: [
          fu(f) && !D ? /* @__PURE__ */ E.jsx("option", { value: "" }) : null,
          Array.from(S)
        ]
      },
      A
    );
  }, "SelectBubbleInput")
);
function _b(a) {
  return typeof a == "function";
}
nt(_b, "isFunction");
function fu(a) {
  return a === "" || a === void 0;
}
nt(fu, "shouldShowPlaceholder");
function s0(a) {
  const r = Xn(a), c = y.useRef(""), u = y.useRef(0), s = y.useCallback(
    (m) => {
      const h = c.current + m;
      r(h), (/* @__PURE__ */ nt((function p(b) {
        c.current = b, window.clearTimeout(u.current), b !== "" && (u.current = window.setTimeout(() => p(""), 1e3));
      }), "updateSearch"))(h);
    },
    [r]
  ), f = y.useCallback(() => {
    c.current = "", window.clearTimeout(u.current);
  }, []);
  return y.useEffect(() => () => window.clearTimeout(u.current), []), [c, s, f];
}
nt(s0, "useTypeaheadSearch");
function f0(a, r, c) {
  const s = r.length > 1 && Array.from(r).every((b) => b === r[0]) ? r[0] : r, f = c ? a.indexOf(c) : -1;
  let m = Rb(a, Math.max(f, 0));
  s.length === 1 && (m = m.filter((b) => b !== c));
  const p = m.find(
    (b) => b.textValue.toLowerCase().startsWith(s.toLowerCase())
  );
  return p !== c ? p : void 0;
}
nt(f0, "findNextItem");
function Rb(a, r) {
  return a.map((c, u) => a[(r + u) % a.length]);
}
nt(Rb, "wrapArray");
var r_ = Object.defineProperty, Mb = (a, r) => r_(a, "name", { value: r, configurable: !0 }), i2 = "horizontal", i_ = ["horizontal", "vertical"], u_ = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Mb(function(r, c) {
    const { decorative: u, orientation: s = i2, ...f } = r, m = Nb(s) ? s : i2, p = u ? { role: "none" } : { "aria-orientation": m === "vertical" ? m : void 0, role: "separator" };
    return /* @__PURE__ */ E.jsx(
      it.div,
      {
        "data-orientation": m,
        ...p,
        ...f,
        ref: c
      }
    );
  }, "Separator")
);
function Nb(a) {
  return i_.includes(a);
}
Mb(Nb, "isValidOrientation");
var c_ = u_, s_ = Object.defineProperty, Gt = (a, r) => s_(a, "name", { value: r, configurable: !0 }), [d0, C4] = /* @__PURE__ */ Ml("Tooltip", [
  $r
]), m0 = $r(), f_ = "TooltipProvider", d_ = 700, jm = "tooltip.open", [m_, h0] = d0(f_), h_ = /* @__PURE__ */ Gt((a) => {
  const {
    __scopeTooltip: r,
    delayDuration: c = d_,
    skipDelayDuration: u = 300,
    disableHoverableContent: s = !1,
    children: f
  } = a, m = y.useRef(!0), h = y.useRef(!1), p = y.useRef(0);
  return y.useEffect(() => {
    const b = p.current;
    return () => window.clearTimeout(b);
  }, []), /* @__PURE__ */ E.jsx(
    m_,
    {
      scope: r,
      isOpenDelayedRef: m,
      delayDuration: c,
      onOpen: y.useCallback(() => {
        u <= 0 || (window.clearTimeout(p.current), m.current = !1);
      }, [u]),
      onClose: y.useCallback(() => {
        u <= 0 || (window.clearTimeout(p.current), p.current = window.setTimeout(
          () => m.current = !0,
          u
        ));
      }, [u]),
      isPointerInTransitRef: h,
      onPointerInTransitChange: y.useCallback((b) => {
        h.current = b;
      }, []),
      disableHoverableContent: s,
      children: f
    }
  );
}, "TooltipProvider"), Um = "Tooltip", [v_, du] = d0(Um), g_ = /* @__PURE__ */ Gt((a) => {
  const {
    __scopeTooltip: r,
    children: c,
    open: u,
    defaultOpen: s,
    onOpenChange: f,
    disableHoverableContent: m,
    delayDuration: h
  } = a, p = h0(Um, a.__scopeTooltip), b = m0(r), [x, v] = y.useState(null), [S, A] = y.useState(void 0), O = Tl(), w = y.useRef(0), C = m ?? p.disableHoverableContent, _ = h ?? p.delayDuration, D = y.useRef(!1), [j, M] = zo({
    prop: u,
    defaultProp: s ?? !1,
    onChange: /* @__PURE__ */ Gt((ae) => {
      ae ? (p.onOpen(), document.dispatchEvent(new CustomEvent(jm))) : p.onClose(), f?.(ae);
    }, "onChange"),
    caller: Um
  }), Y = y.useMemo(() => j ? D.current ? "delayed-open" : "instant-open" : "closed", [j]), I = y.useCallback(() => {
    window.clearTimeout(w.current), w.current = 0, D.current = !1, M(!0);
  }, [M]), X = y.useCallback(() => {
    window.clearTimeout(w.current), w.current = 0, M(!1);
  }, [M]), L = y.useCallback(() => {
    window.clearTimeout(w.current), w.current = window.setTimeout(() => {
      D.current = !0, M(!0), w.current = 0;
    }, _);
  }, [_, M]);
  y.useEffect(() => () => {
    w.current && (window.clearTimeout(w.current), w.current = 0);
  }, []);
  const F = S ?? O;
  return /* @__PURE__ */ E.jsx(e0, { ...b, children: /* @__PURE__ */ E.jsx(
    v_,
    {
      scope: r,
      contentId: F,
      setContentId: A,
      open: j,
      stateAttribute: Y,
      trigger: x,
      onTriggerChange: v,
      onTriggerEnter: y.useCallback(() => {
        p.isOpenDelayedRef.current ? L() : I();
      }, [p.isOpenDelayedRef, L, I]),
      onTriggerLeave: y.useCallback(() => {
        C ? X() : (window.clearTimeout(w.current), w.current = 0);
      }, [X, C]),
      onOpen: I,
      onClose: X,
      disableHoverableContent: C,
      children: c
    }
  ) });
}, "Tooltip"), u2 = "TooltipTrigger", p_ = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Gt(function(r, c) {
    const { __scopeTooltip: u, ...s } = r, f = du(u2, u), m = h0(u2, u), h = m0(u), p = y.useRef(null), b = Fe(c, p, f.onTriggerChange), x = y.useRef(!1), v = y.useRef(!1), S = y.useCallback(() => x.current = !1, []);
    return y.useEffect(() => () => document.removeEventListener("pointerup", S), [S]), /* @__PURE__ */ E.jsx(t0, { asChild: !0, ...h, children: /* @__PURE__ */ E.jsx(
      it.button,
      {
        "aria-describedby": f.open ? f.contentId : void 0,
        "data-state": f.stateAttribute,
        ...s,
        ref: b,
        onPointerMove: Ce(r.onPointerMove, (A) => {
          A.pointerType !== "touch" && !v.current && !m.isPointerInTransitRef.current && (f.onTriggerEnter(), v.current = !0);
        }),
        onPointerLeave: Ce(r.onPointerLeave, () => {
          f.onTriggerLeave(), v.current = !1;
        }),
        onPointerDown: Ce(r.onPointerDown, () => {
          f.open && f.onClose(), x.current = !0, document.addEventListener("pointerup", S, { once: !0 });
        }),
        onFocus: Ce(r.onFocus, () => {
          x.current || f.onOpen();
        }),
        onBlur: Ce(r.onBlur, f.onClose),
        onClick: Ce(r.onClick, f.onClose)
      }
    ) });
  }, "TooltipTrigger")
), Db = "TooltipPortal", [y_, b_] = d0(Db, {
  forceMount: void 0
}), S_ = /* @__PURE__ */ Gt((a) => {
  const { __scopeTooltip: r, forceMount: c, children: u, container: s } = a, f = du(Db, r);
  return /* @__PURE__ */ E.jsx(y_, { scope: r, forceMount: c, children: /* @__PURE__ */ E.jsx(Ka, { present: c || f.open, children: /* @__PURE__ */ E.jsx(us, { asChild: !0, container: s, children: u }) }) });
}, "TooltipPortal"), au = "TooltipContent", x_ = /* @__PURE__ */ y.forwardRef(
  /* @__PURE__ */ Gt(function(r, c) {
    const u = b_(au, r.__scopeTooltip), { forceMount: s = u.forceMount, side: f = "top", ...m } = r, h = du(au, r.__scopeTooltip);
    return /* @__PURE__ */ E.jsx(Ka, { present: s || h.open, children: h.disableHoverableContent ? /* @__PURE__ */ E.jsx(zb, { side: f, ...m, ref: c }) : /* @__PURE__ */ E.jsx(E_, { side: f, ...m, ref: c }) });
  }, "TooltipContent")
), E_ = /* @__PURE__ */ y.forwardRef(/* @__PURE__ */ Gt(function(r, c) {
  const u = du(au, r.__scopeTooltip), s = h0(au, r.__scopeTooltip), f = y.useRef(null), m = Fe(c, f), [h, p] = y.useState(null), { trigger: b, onClose: x } = u, v = f.current, { onPointerInTransitChange: S } = s, A = y.useCallback(() => {
    p(null), S(!1);
  }, [S]), O = y.useCallback(
    (w, C) => {
      const _ = w.currentTarget, D = { x: w.clientX, y: w.clientY }, j = jb(D, _.getBoundingClientRect()), M = Ub(D, j), Y = Hb(C.getBoundingClientRect()), I = Bb([...M, ...Y]);
      p(I), S(!0);
    },
    [S]
  );
  return y.useEffect(() => () => A(), [A]), y.useEffect(() => {
    if (b && v) {
      const w = /* @__PURE__ */ Gt((_) => O(_, v), "handleTriggerLeave"), C = /* @__PURE__ */ Gt((_) => O(_, b), "handleContentLeave");
      return b.addEventListener("pointerleave", w), v.addEventListener("pointerleave", C), () => {
        b.removeEventListener("pointerleave", w), v.removeEventListener("pointerleave", C);
      };
    }
  }, [b, v, O, A]), y.useEffect(() => {
    if (h) {
      const w = /* @__PURE__ */ Gt((C) => {
        const _ = C.target, D = { x: C.clientX, y: C.clientY }, j = b?.contains(_) || v?.contains(_), M = !Lb(D, h);
        j ? A() : M && (A(), x());
      }, "handleTrackPointerGrace");
      return document.addEventListener("pointermove", w), () => document.removeEventListener("pointermove", w);
    }
  }, [b, v, h, x, A]), /* @__PURE__ */ E.jsx(zb, { ...r, ref: m });
}, "TooltipContentHoverable")), C_ = /* @__PURE__ */ Y2("TooltipContent"), zb = /* @__PURE__ */ y.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Gt(function(r, c) {
    const {
      __scopeTooltip: u,
      children: s,
      "aria-label": f,
      id: m,
      onEscapeKeyDown: h,
      onPointerDownOutside: p,
      ...b
    } = r, x = du(au, u), v = m0(u), { onClose: S } = x;
    y.useEffect(() => (document.addEventListener(jm, S), () => document.removeEventListener(jm, S)), [S]), y.useEffect(() => {
      if (x.trigger) {
        const O = /* @__PURE__ */ Gt((w) => {
          w.target instanceof Node && w.target.contains(x.trigger) && S();
        }, "handleScroll");
        return window.addEventListener("scroll", O, { capture: !0 }), () => window.removeEventListener("scroll", O, { capture: !0 });
      }
    }, [x.trigger, S]);
    const { setContentId: A } = x;
    return Dt(() => (A(m), () => {
      A(void 0);
    }), [m, A]), /* @__PURE__ */ E.jsx(
      is,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: h,
        onPointerDownOutside: p,
        onFocusOutside: (O) => O.preventDefault(),
        onDismiss: S,
        children: /* @__PURE__ */ E.jsxs(
          n0,
          {
            "data-state": x.stateAttribute,
            role: f ? void 0 : "tooltip",
            id: f ? void 0 : x.contentId,
            ...v,
            ...b,
            ref: c,
            style: {
              ...b.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ E.jsx(C_, { children: s }),
              f ? /* @__PURE__ */ E.jsx(MC, { id: x.contentId, role: "tooltip", children: f }) : null
            ]
          }
        )
      }
    );
  }, "TooltipContentImpl")
);
function jb(a, r) {
  const c = Math.abs(r.top - a.y), u = Math.abs(r.bottom - a.y), s = Math.abs(r.right - a.x), f = Math.abs(r.left - a.x);
  switch (Math.min(c, u, s, f)) {
    case f:
      return "left";
    case s:
      return "right";
    case c:
      return "top";
    case u:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
Gt(jb, "getExitSideFromRect");
function Ub(a, r, c = 5) {
  const u = [];
  switch (r) {
    case "top":
      u.push(
        { x: a.x - c, y: a.y + c },
        { x: a.x + c, y: a.y + c }
      );
      break;
    case "bottom":
      u.push(
        { x: a.x - c, y: a.y - c },
        { x: a.x + c, y: a.y - c }
      );
      break;
    case "left":
      u.push(
        { x: a.x + c, y: a.y - c },
        { x: a.x + c, y: a.y + c }
      );
      break;
    case "right":
      u.push(
        { x: a.x - c, y: a.y - c },
        { x: a.x - c, y: a.y + c }
      );
      break;
  }
  return u;
}
Gt(Ub, "getPaddedExitPoints");
function Hb(a) {
  const { top: r, right: c, bottom: u, left: s } = a;
  return [
    { x: s, y: r },
    { x: c, y: r },
    { x: c, y: u },
    { x: s, y: u }
  ];
}
Gt(Hb, "getPointsFromRect");
function Lb(a, r) {
  const { x: c, y: u } = a;
  let s = !1;
  for (let f = 0, m = r.length - 1; f < r.length; m = f++) {
    const h = r[f], p = r[m], b = h.x, x = h.y, v = p.x, S = p.y;
    x > u != S > u && c < (v - b) * (u - x) / (S - x) + b && (s = !s);
  }
  return s;
}
Gt(Lb, "isPointInPolygon");
function Bb(a) {
  const r = a.slice();
  return r.sort((c, u) => c.x < u.x ? -1 : c.x > u.x ? 1 : c.y < u.y ? -1 : c.y > u.y ? 1 : 0), Vb(r);
}
Gt(Bb, "getHull");
function Vb(a) {
  if (a.length <= 1) return a.slice();
  const r = [];
  for (let u = 0; u < a.length; u++) {
    const s = a[u];
    for (; r.length >= 2; ) {
      const f = r[r.length - 1], m = r[r.length - 2];
      if ((f.x - m.x) * (s.y - m.y) >= (f.y - m.y) * (s.x - m.x)) r.pop();
      else break;
    }
    r.push(s);
  }
  r.pop();
  const c = [];
  for (let u = a.length - 1; u >= 0; u--) {
    const s = a[u];
    for (; c.length >= 2; ) {
      const f = c[c.length - 1], m = c[c.length - 2];
      if ((f.x - m.x) * (s.y - m.y) >= (f.y - m.y) * (s.x - m.x)) c.pop();
      else break;
    }
    c.push(s);
  }
  return c.pop(), r.length === 1 && c.length === 1 && r[0].x === c[0].x && r[0].y === c[0].y ? r : r.concat(c);
}
Gt(Vb, "getHullPresorted");
var w_ = h_, T_ = g_, A_ = p_, O_ = S_, __ = x_;
const R_ = S2(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function eu({
  className: a,
  variant: r = "default",
  size: c = "default",
  asChild: u = !1,
  ...s
}) {
  const f = u ? bC : "button";
  return /* @__PURE__ */ E.jsx(
    f,
    {
      "data-slot": "button",
      "data-variant": r,
      "data-size": c,
      className: Za(R_({ variant: r, size: c, className: a })),
      ...s
    }
  );
}
function M_(a) {
  return /* @__PURE__ */ E.jsx(Oy, { "data-slot": "dialog", ...a });
}
function N_(a) {
  return /* @__PURE__ */ E.jsx(_y, { "data-slot": "dialog-trigger", ...a });
}
function D_(a) {
  return /* @__PURE__ */ E.jsx(Ny, { "data-slot": "dialog-portal", ...a });
}
function z_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Dy,
    {
      "data-slot": "dialog-overlay",
      className: Mn(
        "fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--brand-ink)_45%,transparent)] data-[state=open]:animate-in data-[state=closed]:animate-out",
        a
      ),
      ...r
    }
  );
}
function j_({
  className: a,
  children: r,
  ...c
}) {
  return /* @__PURE__ */ E.jsxs(D_, { children: [
    /* @__PURE__ */ E.jsx(z_, {}),
    /* @__PURE__ */ E.jsxs(
      zy,
      {
        "data-slot": "dialog-content",
        className: Mn(
          "fixed top-1/2 left-1/2 z-50 grid w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-lg outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]",
          a
        ),
        ...c,
        children: [
          r,
          /* @__PURE__ */ E.jsxs(Ly, { className: "absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-[var(--radius)] border border-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]", children: [
            /* @__PURE__ */ E.jsx(p2, { className: "size-4" }),
            /* @__PURE__ */ E.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function U_({ className: a, ...r }) {
  return /* @__PURE__ */ E.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: Mn("flex flex-col gap-1.5 pr-8", a),
      ...r
    }
  );
}
function H_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Uy,
    {
      "data-slot": "dialog-title",
      tabIndex: -1,
      className: Mn("text-lg font-semibold tracking-tight outline-none", a),
      ...r
    }
  );
}
function L_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Hy,
    {
      "data-slot": "dialog-description",
      className: Mn("text-sm text-[var(--muted-foreground)]", a),
      ...r
    }
  );
}
function c2({ className: a, type: r, ...c }) {
  return /* @__PURE__ */ E.jsx(
    "input",
    {
      type: r,
      "data-slot": "input",
      className: Mn(
        "flex w-full min-h-11 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-[border-color] duration-150 placeholder:text-[var(--muted-foreground)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]",
        a
      ),
      ...c
    }
  );
}
function B_(a) {
  return /* @__PURE__ */ E.jsx(jO, { "data-slot": "select", ...a });
}
function V_(a) {
  return /* @__PURE__ */ E.jsx(BO, { "data-slot": "select-value", ...a });
}
function G_({
  className: a,
  children: r,
  ...c
}) {
  return /* @__PURE__ */ E.jsxs(
    HO,
    {
      "data-slot": "select-trigger",
      className: Mn(
        "flex w-full min-h-11 items-center justify-between gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-[border-color] duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        a
      ),
      ...c,
      children: [
        r,
        /* @__PURE__ */ E.jsx(VO, { asChild: !0, children: /* @__PURE__ */ E.jsx(Vx, { "aria-hidden": "true" }) })
      ]
    }
  );
}
function Y_({
  className: a,
  children: r,
  position: c = "popper",
  ...u
}) {
  return /* @__PURE__ */ E.jsx(kO, { children: /* @__PURE__ */ E.jsx(
    IO,
    {
      "data-slot": "select-content",
      className: Mn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-md",
        c === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        a
      ),
      position: c,
      ...u,
      children: /* @__PURE__ */ E.jsx(
        JO,
        {
          className: Mn(
            "p-1",
            c === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children: r
        }
      )
    }
  ) });
}
function s2({
  className: a,
  children: r,
  ...c
}) {
  return /* @__PURE__ */ E.jsxs(
    e_,
    {
      "data-slot": "select-item",
      className: Mn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-[calc(var(--radius)-2px)] py-2 pr-8 pl-2 text-sm outline-none focus:bg-[var(--muted)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        a
      ),
      ...c,
      children: [
        /* @__PURE__ */ E.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ E.jsx(l_, { children: /* @__PURE__ */ E.jsx(Lx, { className: "size-4", "aria-hidden": "true" }) }) }),
        /* @__PURE__ */ E.jsx(t_, { children: r })
      ]
    }
  );
}
function q_({
  className: a,
  orientation: r = "horizontal",
  decorative: c = !0,
  ...u
}) {
  return /* @__PURE__ */ E.jsx(
    c_,
    {
      "data-slot": "separator",
      decorative: c,
      orientation: r,
      className: Mn(
        "shrink-0 bg-[var(--border)] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        a
      ),
      ...u
    }
  );
}
function k_({ ...a }) {
  return /* @__PURE__ */ E.jsx(Oy, { "data-slot": "sheet", ...a });
}
function I_({
  ...a
}) {
  return /* @__PURE__ */ E.jsx(_y, { "data-slot": "sheet-trigger", ...a });
}
function X_({
  ...a
}) {
  return /* @__PURE__ */ E.jsx(Ny, { "data-slot": "sheet-portal", ...a });
}
function Q_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Dy,
    {
      "data-slot": "sheet-overlay",
      className: Za(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        a
      ),
      ...r
    }
  );
}
function Z_({
  className: a,
  children: r,
  side: c = "right",
  showCloseButton: u = !0,
  ...s
}) {
  return /* @__PURE__ */ E.jsxs(X_, { children: [
    /* @__PURE__ */ E.jsx(Q_, {}),
    /* @__PURE__ */ E.jsxs(
      zy,
      {
        "data-slot": "sheet-content",
        className: Za(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          c === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          c === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          c === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          c === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          a
        ),
        ...s,
        children: [
          r,
          u && /* @__PURE__ */ E.jsxs(Ly, { className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ E.jsx(p2, { className: "size-4" }),
            /* @__PURE__ */ E.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function K_({ className: a, ...r }) {
  return /* @__PURE__ */ E.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: Za("flex flex-col gap-1.5 p-4", a),
      ...r
    }
  );
}
function P_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Uy,
    {
      "data-slot": "sheet-title",
      className: Za("font-semibold text-foreground", a),
      ...r
    }
  );
}
function F_({
  className: a,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    Hy,
    {
      "data-slot": "sheet-description",
      className: Za("text-sm text-muted-foreground", a),
      ...r
    }
  );
}
function Gb({
  delayDuration: a = 200,
  ...r
}) {
  return /* @__PURE__ */ E.jsx(
    w_,
    {
      "data-slot": "tooltip-provider",
      delayDuration: a,
      ...r
    }
  );
}
function Yb(a) {
  return /* @__PURE__ */ E.jsx(T_, { "data-slot": "tooltip", ...a });
}
function qb(a) {
  return /* @__PURE__ */ E.jsx(A_, { "data-slot": "tooltip-trigger", ...a });
}
function kb({
  className: a,
  sideOffset: r = 6,
  ...c
}) {
  return /* @__PURE__ */ E.jsx(O_, { children: /* @__PURE__ */ E.jsx(
    __,
    {
      "data-slot": "tooltip-content",
      sideOffset: r,
      className: Mn(
        "z-50 max-w-xs rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--foreground)] shadow-md outline-none motion-safe:animate-in motion-reduce:animate-none",
        a
      ),
      ...c
    }
  ) });
}
function f2() {
  const a = new URLSearchParams(window.location.search);
  return {
    q: a.get("q") || "",
    category: a.get("category") || "",
    kind: a.get("kind") || "",
    status: a.get("status") || ""
  };
}
function J_(a, r) {
  const c = a.q.trim().toLocaleLowerCase("en").split(/\s+/).filter(Boolean), u = !!(c.length || a.category || a.kind || a.status), s = Array.from(document.querySelectorAll(".project"));
  let f = 0;
  for (const v of s) {
    const S = (v.dataset.search || "").toLocaleLowerCase("en"), A = c.every((O) => S.includes(O)) && (!a.category || a.category === v.dataset.category) && (!a.kind || a.kind === v.dataset.kind) && (!a.status || a.status === v.dataset.status);
    v.hidden = !A, A && (f += 1);
  }
  for (const v of document.querySelectorAll(
    ".catalog-section"
  )) {
    const S = v.querySelectorAll(".project:not([hidden])").length;
    v.hidden = S === 0;
    const A = v.querySelector(".section-heading p");
    A && (A.textContent = String(S));
  }
  const m = Array.from(
    document.querySelectorAll(".start-list li")
  );
  for (const v of m) {
    const S = v.querySelector("a")?.getAttribute("href") || "", A = S.startsWith("#") ? document.getElementById(S.slice(1)) : null;
    v.hidden = u && !!A?.hidden;
  }
  const h = document.getElementById("start-here");
  h && (h.hidden = u && m.every((v) => v.hidden));
  const p = document.querySelector(
    "[data-contents-start]"
  );
  p && h && (p.hidden = h.hidden);
  for (const v of document.querySelectorAll(
    "[data-contents-section]"
  )) {
    const S = v.dataset.contentsSection || "", A = S ? document.getElementById(S) : null, O = A ? A.querySelectorAll(".project:not([hidden])").length : 0, w = v.querySelector("span");
    w && (w.textContent = String(O)), v.hidden = u && O === 0;
  }
  const b = document.getElementById("results-status");
  b && (b.textContent = `${f} of ${s.length} entries, grouped by provenance`);
  const x = document.getElementById("empty");
  x && (x.hidden = f !== 0);
  {
    const v = new URL(window.location.href), S = [
      ["q", a.q],
      ["category", a.category],
      ["kind", a.kind],
      ["status", a.status]
    ];
    for (const [A, O] of S)
      O ? v.searchParams.set(A, O) : v.searchParams.delete(A);
    history.replaceState(null, "", v);
  }
}
function $_(a) {
  const [r, c] = y.useState(
    () => typeof window < "u" ? window.matchMedia(a).matches : !0
  );
  return y.useEffect(() => {
    const u = window.matchMedia(a), s = () => c(u.matches);
    return s(), u.addEventListener("change", s), () => u.removeEventListener("change", s);
  }, [a]), r;
}
function cm({
  id: a,
  label: r,
  value: c,
  options: u,
  allLabel: s,
  onChange: f
}) {
  const m = c || "__all__";
  return /* @__PURE__ */ E.jsxs("label", { className: "grid gap-1.5 text-sm font-medium text-[var(--foreground)]", children: [
    /* @__PURE__ */ E.jsx("span", { id: `${a}-label`, children: r }),
    /* @__PURE__ */ E.jsxs(
      B_,
      {
        value: m,
        onValueChange: (h) => f(h === "__all__" ? "" : h),
        children: [
          /* @__PURE__ */ E.jsx(
            G_,
            {
              id: a,
              "aria-labelledby": `${a}-label`,
              "aria-controls": "project-list",
              className: "min-h-11",
              children: /* @__PURE__ */ E.jsx(V_, { placeholder: s })
            }
          ),
          /* @__PURE__ */ E.jsxs(Y_, { children: [
            /* @__PURE__ */ E.jsx(s2, { value: "__all__", children: s }),
            u.map((h) => /* @__PURE__ */ E.jsx(s2, { value: h.value, children: h.label }, h.value))
          ] })
        ]
      }
    )
  ] });
}
function d2({
  open: a,
  onOpenChange: r,
  trigger: c
}) {
  const u = (s) => {
    s.preventDefault(), document.getElementById("labels-dialog-title")?.focus();
  };
  return /* @__PURE__ */ E.jsxs(M_, { open: a, onOpenChange: r, children: [
    c,
    /* @__PURE__ */ E.jsxs(
      j_,
      {
        "aria-describedby": "labels-dialog-description",
        onOpenAutoFocus: u,
        className: "motion-reduce:transition-none",
        children: [
          /* @__PURE__ */ E.jsxs(U_, { children: [
            /* @__PURE__ */ E.jsx(H_, { id: "labels-dialog-title", tabIndex: -1, children: "Catalog labels" }),
            /* @__PURE__ */ E.jsx(L_, { id: "labels-dialog-description", children: "These labels are catalog fields, not a ranking or a security audit." })
          ] }),
          /* @__PURE__ */ E.jsx(q_, {}),
          /* @__PURE__ */ E.jsxs("dl", { className: "grid gap-3 text-sm", children: [
            /* @__PURE__ */ E.jsxs("div", { children: [
              /* @__PURE__ */ E.jsx("dt", { className: "font-semibold", children: "Official" }),
              /* @__PURE__ */ E.jsxs("dd", { className: "text-[var(--muted-foreground)]", children: [
                "First-party IINA software from the ",
                /* @__PURE__ */ E.jsx("code", { children: "iina/" }),
                " GitHub organization or ",
                /* @__PURE__ */ E.jsx("code", { children: "iina.io" }),
                ". Not inferred from stars, topics, or plugin-index membership."
              ] })
            ] }),
            /* @__PURE__ */ E.jsxs("div", { children: [
              /* @__PURE__ */ E.jsx("dt", { className: "font-semibold", children: "plugins.json" }),
              /* @__PURE__ */ E.jsx("dd", { className: "text-[var(--muted-foreground)]", children: "The plugin is listed in IINA’s published plugin index. That is not first-party ownership and does not set Official." })
            ] }),
            /* @__PURE__ */ E.jsxs("div", { children: [
              /* @__PURE__ */ E.jsx("dt", { className: "font-semibold", children: "Featured" }),
              /* @__PURE__ */ E.jsx("dd", { className: "text-[var(--muted-foreground)]", children: "A useful starting point for scanning the catalog. Not an objective quality ranking." })
            ] }),
            /* @__PURE__ */ E.jsxs("div", { children: [
              /* @__PURE__ */ E.jsx("dt", { className: "font-semibold", children: "Unverified" }),
              /* @__PURE__ */ E.jsx("dd", { className: "text-[var(--muted-foreground)]", children: "Relevance was reviewed; maintenance and compatibility are not confirmed. Inclusion does not mean Active." })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function W_({
  categories: a,
  kinds: r,
  statuses: c
}) {
  const [u, s] = y.useState(() => f2()), [f, m] = y.useState(!1), [h, p] = y.useState(!1), b = y.useRef(null), x = $_("(min-width: 768px)");
  y.useEffect(() => {
    J_(u);
  }, [u]), y.useEffect(() => {
    const C = () => s(f2());
    return window.addEventListener("popstate", C), () => window.removeEventListener("popstate", C);
  }, []);
  const v = (C) => {
    s((_) => ({ ..._, ...C }));
  }, S = () => {
    s({ q: "", category: "", kind: "", status: "" }), b.current?.focus();
  }, A = !!(u.q.trim() || u.category || u.kind || u.status), O = /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsx(
      cm,
      {
        id: "category",
        label: "Category",
        value: u.category,
        options: a,
        allLabel: "All categories",
        onChange: (C) => v({ category: C })
      }
    ),
    /* @__PURE__ */ E.jsx(
      cm,
      {
        id: "kind",
        label: "Type",
        value: u.kind,
        options: r,
        allLabel: "All types",
        onChange: (C) => v({ kind: C })
      }
    ),
    /* @__PURE__ */ E.jsx(
      cm,
      {
        id: "project-status",
        label: "Status",
        value: u.status,
        options: c,
        allLabel: "All statuses",
        onChange: (C) => v({ status: C })
      }
    )
  ] }), w = /* @__PURE__ */ E.jsxs(Yb, { children: [
    /* @__PURE__ */ E.jsx(qb, { asChild: !0, children: /* @__PURE__ */ E.jsx(N_, { asChild: !0, children: /* @__PURE__ */ E.jsxs(eu, { id: "labels-open", type: "button", variant: "outline", className: "min-h-11", children: [
      /* @__PURE__ */ E.jsx(kx, { className: "size-4", "aria-hidden": "true" }),
      "Catalog labels"
    ] }) }) }),
    /* @__PURE__ */ E.jsx(kb, { children: "Official, plugins.json, Featured, and Unverified are catalog fields." })
  ] });
  return /* @__PURE__ */ E.jsx(Gb, { children: /* @__PURE__ */ E.jsx("div", { id: "filters", className: "filters catalog-chrome-filters", children: x ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsxs("div", { className: "grid gap-1.5 min-w-0", children: [
      /* @__PURE__ */ E.jsx("label", { className: "text-sm font-medium", htmlFor: "search", children: "Search the catalog" }),
      /* @__PURE__ */ E.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ E.jsx(
          wp,
          {
            className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ E.jsx(
          c2,
          {
            ref: b,
            id: "search",
            type: "search",
            placeholder: "Name, status, official, type…",
            autoComplete: "off",
            "aria-controls": "project-list",
            className: "min-h-11 pl-9",
            value: u.q,
            onChange: (C) => v({ q: C.target.value })
          }
        )
      ] })
    ] }),
    O,
    /* @__PURE__ */ E.jsxs("div", { className: "flex flex-wrap items-end gap-2", children: [
      /* @__PURE__ */ E.jsx(
        eu,
        {
          id: "clear",
          type: "button",
          variant: "outline",
          className: "min-h-11",
          onClick: S,
          children: "Reset"
        }
      ),
      A ? /* @__PURE__ */ E.jsx(
        Kd,
        {
          variant: "default",
          className: "h-11 px-3 text-xs font-semibold tracking-wide",
          children: "Filtered"
        }
      ) : null
    ] }),
    /* @__PURE__ */ E.jsx(
      d2,
      {
        open: f,
        onOpenChange: m,
        trigger: w
      }
    )
  ] }) : /* @__PURE__ */ E.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "grid gap-1.5 min-w-0", children: [
      /* @__PURE__ */ E.jsx("label", { className: "text-sm font-medium", htmlFor: "search", children: "Search the catalog" }),
      /* @__PURE__ */ E.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ E.jsx(
          wp,
          {
            className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--muted-foreground)]",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ E.jsx(
          c2,
          {
            ref: b,
            id: "search",
            type: "search",
            placeholder: "Name, status, official, type…",
            autoComplete: "off",
            "aria-controls": "project-list",
            className: "min-h-11 pl-9",
            value: u.q,
            onChange: (C) => v({ q: C.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ E.jsxs(k_, { open: h, onOpenChange: p, children: [
        /* @__PURE__ */ E.jsx(I_, { asChild: !0, children: /* @__PURE__ */ E.jsxs(
          eu,
          {
            id: "filters-open",
            type: "button",
            variant: "outline",
            className: "min-h-11",
            children: [
              /* @__PURE__ */ E.jsx(Yx, { className: "size-4", "aria-hidden": "true" }),
              "Filters",
              A ? /* @__PURE__ */ E.jsx(Kd, { variant: "default", className: "ml-1 h-6 px-2 text-[11px]", children: "On" }) : null
            ]
          }
        ) }),
        /* @__PURE__ */ E.jsxs(
          Z_,
          {
            side: "bottom",
            className: "gap-4 rounded-t-[calc(var(--radius)+4px)] motion-reduce:transition-none",
            children: [
              /* @__PURE__ */ E.jsxs(K_, { children: [
                /* @__PURE__ */ E.jsx(P_, { children: "Catalog filters" }),
                /* @__PURE__ */ E.jsx(F_, { children: "Narrow the provenance-grouped list. Reset clears every control." })
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "grid gap-4 px-4 pb-6", children: [
                O,
                /* @__PURE__ */ E.jsx(
                  eu,
                  {
                    id: "clear",
                    type: "button",
                    variant: "outline",
                    className: "min-h-11",
                    onClick: () => {
                      S(), p(!1);
                    },
                    children: "Reset"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ E.jsx(
        d2,
        {
          open: f,
          onOpenChange: m,
          trigger: w
        }
      ),
      A ? /* @__PURE__ */ E.jsx(
        Kd,
        {
          variant: "default",
          className: "h-11 px-3 text-xs font-semibold tracking-wide",
          children: "Filtered"
        }
      ) : null
    ] })
  ] }) }) });
}
const e4 = {
  theme: "system",
  setTheme: () => null
}, Ib = y.createContext(e4), t4 = { light: "#F5FAFF", dark: "#080F2B" };
function m2(a) {
  const r = t4[a];
  for (const c of Array.from(
    document.querySelectorAll('meta[name="theme-color"]')
  ))
    c.hasAttribute("media") ? c.remove() : c.setAttribute("content", r);
}
function n4({
  children: a,
  defaultTheme: r = "system",
  storageKey: c = "awesome-iina-theme",
  ...u
}) {
  const [s, f] = y.useState(() => {
    try {
      const h = localStorage.getItem(c);
      if (h === "dark" || h === "light" || h === "system")
        return h;
    } catch {
    }
    return r;
  });
  y.useEffect(() => {
    const h = window.document.documentElement;
    h.classList.remove("light", "dark"), h.removeAttribute("data-theme");
    const p = s === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : s;
    h.classList.add(p), m2(p);
  }, [s]), y.useEffect(() => {
    if (s !== "system") return;
    const h = window.matchMedia("(prefers-color-scheme: dark)"), p = () => {
      const b = window.document.documentElement;
      b.classList.remove("light", "dark");
      const x = h.matches ? "dark" : "light";
      b.classList.add(x), m2(x);
    };
    return h.addEventListener("change", p), () => h.removeEventListener("change", p);
  }, [s]);
  const m = {
    theme: s,
    setTheme: (h) => {
      try {
        localStorage.setItem(c, h);
      } catch {
      }
      f(h);
    }
  };
  return /* @__PURE__ */ E.jsx(Ib.Provider, { ...u, value: m, children: a });
}
const l4 = () => {
  const a = y.useContext(Ib);
  if (a === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return a;
};
function a4({
  ...a
}) {
  return /* @__PURE__ */ E.jsx(yO, { "data-slot": "dropdown-menu", ...a });
}
function o4({
  ...a
}) {
  return /* @__PURE__ */ E.jsx(
    bO,
    {
      "data-slot": "dropdown-menu-trigger",
      ...a
    }
  );
}
function r4({
  className: a,
  sideOffset: r = 4,
  ...c
}) {
  return /* @__PURE__ */ E.jsx(SO, { children: /* @__PURE__ */ E.jsx(
    xO,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: r,
      className: Za(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        a
      ),
      ...c
    }
  ) });
}
function sm({
  className: a,
  inset: r,
  variant: c = "default",
  ...u
}) {
  return /* @__PURE__ */ E.jsx(
    EO,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": r,
      "data-variant": c,
      className: Za(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        a
      ),
      ...u
    }
  );
}
function i4() {
  const { setTheme: a } = l4();
  return /* @__PURE__ */ E.jsx(Gb, { children: /* @__PURE__ */ E.jsxs(a4, { children: [
    /* @__PURE__ */ E.jsxs(Yb, { children: [
      /* @__PURE__ */ E.jsx(qb, { asChild: !0, children: /* @__PURE__ */ E.jsx(o4, { asChild: !0, children: /* @__PURE__ */ E.jsxs(
        eu,
        {
          id: "theme-switch",
          type: "button",
          variant: "outline",
          size: "icon",
          className: "relative min-h-11 min-w-11",
          children: [
            /* @__PURE__ */ E.jsx(Kx, { className: "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all motion-reduce:transition-none dark:scale-0 dark:-rotate-90" }),
            /* @__PURE__ */ E.jsx(Xx, { className: "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all motion-reduce:transition-none dark:scale-100 dark:rotate-0" }),
            /* @__PURE__ */ E.jsx("span", { className: "sr-only", children: "Toggle theme" })
          ]
        }
      ) }) }),
      /* @__PURE__ */ E.jsx(kb, { children: "Toggle theme" })
    ] }),
    /* @__PURE__ */ E.jsxs(r4, { align: "end", className: "motion-reduce:animate-none", children: [
      /* @__PURE__ */ E.jsx(
        sm,
        {
          className: "min-h-11",
          onClick: () => a("light"),
          children: "Light"
        }
      ),
      /* @__PURE__ */ E.jsx(
        sm,
        {
          className: "min-h-11",
          onClick: () => a("dark"),
          children: "Dark"
        }
      ),
      /* @__PURE__ */ E.jsx(
        sm,
        {
          className: "min-h-11",
          onClick: () => a("system"),
          children: "System"
        }
      )
    ] })
  ] }) });
}
function fm(a) {
  if (!a) return [];
  try {
    const r = JSON.parse(a);
    return Array.isArray(r) ? r.filter(
      (c) => typeof c == "object" && c !== null && typeof c.value == "string" && typeof c.label == "string"
    ) : [];
  } catch {
    return [];
  }
}
function u4() {
  const a = document.getElementById("theme-root");
  a && v2.createRoot(a).render(
    /* @__PURE__ */ E.jsx(y.StrictMode, { children: /* @__PURE__ */ E.jsx(n4, { defaultTheme: "system", storageKey: "awesome-iina-theme", children: /* @__PURE__ */ E.jsx(i4, {}) }) })
  );
}
function c4() {
  const a = document.getElementById("catalog-chrome-root");
  if (!a) return;
  const r = {
    categories: fm(a.dataset.categories),
    kinds: fm(a.dataset.kinds),
    statuses: fm(a.dataset.statuses)
  };
  v2.createRoot(a).render(
    /* @__PURE__ */ E.jsx(y.StrictMode, { children: /* @__PURE__ */ E.jsx(W_, { ...r }) })
  );
}
u4();
c4();
