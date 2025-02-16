// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      4.1.7
// @author       festoney8
// @description  净化 B站/哔哩哔哩 页面，支持「精简功能、播放器净化、过滤视频、过滤评论、全站黑白名单」，提供 300+ 功能，定制自己的 B 站
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/festoney8/bilibili-cleaner
// @supportURL   https://github.com/festoney8/bilibili-cleaner
// @downloadURL  https://cdn.jsdelivr.net/gh/festoney8/bilibili-cleaner@release/bilibili-cleaner.jsdelivr.user.js
// @updateURL    https://cdn.jsdelivr.net/gh/festoney8/bilibili-cleaner@release/bilibili-cleaner.jsdelivr.user.js
// @match        *://*.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://message.bilibili.com/pages/nav/index_new_pc_sync
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://link.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @exclude      *://api.bilibili.com/*
// @exclude      *://api.*.bilibili.com/*
// @exclude      *://*.chat.bilibili.com/*
// @exclude      *://member.bilibili.com/*
// @exclude      *://www.bilibili.com/tensou/*
// @exclude      *://www.bilibili.com/correspond/*
// @exclude      *://live.bilibili.com/p/html/*
// @exclude      *://live.bilibili.com/live-room-play-game-together
// @exclude      *://www.bilibili.com/blackboard/comment-detail.html*
// @exclude      *://www.bilibili.com/blackboard/newplayer.html*
// @require      https://registry.npmmirror.com/vue/3.5.13/files/dist/vue.global.prod.js
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function (e$1) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const e$1__namespace = /*#__PURE__*/_interopNamespaceDefault(e$1);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  /*!
   * pinia v2.3.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o2) {
    return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = e$1.effectScope(true);
    const state = scope.run(() => e$1.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = e$1.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && true) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && e$1.getCurrentScope()) {
      e$1.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn2) => fn2();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !e$1.isRef(subPatch) && !e$1.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o2) {
    return !!(e$1.isRef(o2) && o2.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = e$1.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = e$1.markRaw(e$1.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia.state.value[$id] = {};
      }
    }
    e$1.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      e$1.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop$1
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    const action = (fn2, name = "") => {
      if (ACTION_MARKER in fn2) {
        fn2[ACTION_NAME] = name;
        return fn2;
      }
      const wrappedAction = function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn2.apply(this && this.$id === $id ? this : store, args);
        } catch (error2) {
          triggerSubscriptions(onErrorCallbackList, error2);
          throw error2;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error2) => {
            triggerSubscriptions(onErrorCallbackList, error2);
            return Promise.reject(error2);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => e$1.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = e$1.reactive(partialStore);
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = e$1.effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (e$1.isRef(prop) && !isComputed(prop) || e$1.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (e$1.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    {
      assign(store, setupStore);
      assign(e$1.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia, hot) {
      const hasContext = e$1.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? e$1.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function d$2(u2, e2, r2) {
    let i2 = e$1.ref(r2 == null ? void 0 : r2.value), f2 = e$1.computed(() => u2.value !== void 0);
    return [e$1.computed(() => f2.value ? u2.value : i2.value), function(t2) {
      return f2.value || (i2.value = t2), e2 == null ? void 0 : e2(t2);
    }];
  }
  var r$2;
  let n$3 = Symbol("headlessui.useid"), o$4 = 0;
  const i$4 = (r$2 = e$1__namespace.useId) != null ? r$2 : function() {
    return e$1__namespace.inject(n$3, () => `${++o$4}`)();
  };
  function o$3(e2) {
    var l2;
    if (e2 == null || e2.value == null) return null;
    let n2 = (l2 = e2.value.$el) != null ? l2 : e2.value;
    return n2 instanceof Node ? n2 : null;
  }
  function u$5(r2, n2, ...a2) {
    if (r2 in n2) {
      let e2 = n2[r2];
      return typeof e2 == "function" ? e2(...a2) : e2;
    }
    let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, u$5), t2;
  }
  var i$3 = Object.defineProperty;
  var d$1 = (t2, e2, r2) => e2 in t2 ? i$3(t2, e2, { enumerable: true, configurable: true, writable: true, value: r2 }) : t2[e2] = r2;
  var n$2 = (t2, e2, r2) => (d$1(t2, typeof e2 != "symbol" ? e2 + "" : e2, r2), r2);
  let s$1 = class s {
    constructor() {
      n$2(this, "current", this.detect());
      n$2(this, "currentId", 0);
    }
    set(e2) {
      this.current !== e2 && (this.currentId = 0, this.current = e2);
    }
    reset() {
      this.set(this.detect());
    }
    nextId() {
      return ++this.currentId;
    }
    get isServer() {
      return this.current === "server";
    }
    get isClient() {
      return this.current === "client";
    }
    detect() {
      return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
    }
  };
  let c$2 = new s$1();
  function i$2(r2) {
    if (c$2.isServer) return null;
    if (r2 instanceof Node) return r2.ownerDocument;
    if (r2 != null && r2.hasOwnProperty("value")) {
      let n2 = o$3(r2);
      if (n2) return n2.ownerDocument;
    }
    return document;
  }
  let c$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
  var N$2 = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(N$2 || {}), T$2 = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(T$2 || {}), F = ((t2) => (t2[t2.Previous = -1] = "Previous", t2[t2.Next = 1] = "Next", t2))(F || {});
  var h = ((t2) => (t2[t2.Strict = 0] = "Strict", t2[t2.Loose = 1] = "Loose", t2))(h || {});
  function w$3(e2, r2 = 0) {
    var t2;
    return e2 === ((t2 = i$2(e2)) == null ? void 0 : t2.body) ? false : u$5(r2, { [0]() {
      return e2.matches(c$1);
    }, [1]() {
      let l2 = e2;
      for (; l2 !== null; ) {
        if (l2.matches(c$1)) return true;
        l2 = l2.parentElement;
      }
      return false;
    } });
  }
  var y$1 = ((t2) => (t2[t2.Keyboard = 0] = "Keyboard", t2[t2.Mouse = 1] = "Mouse", t2))(y$1 || {});
  typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e2) => {
    e2.metaKey || e2.altKey || e2.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
  }, true), document.addEventListener("click", (e2) => {
    e2.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e2.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
  }, true));
  function O$1(e2, r2 = (t2) => t2) {
    return e2.slice().sort((t2, l2) => {
      let o2 = r2(t2), i2 = r2(l2);
      if (o2 === null || i2 === null) return 0;
      let n2 = o2.compareDocumentPosition(i2);
      return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
  }
  function t$1() {
    return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
  }
  function i$1() {
    return /Android/gi.test(window.navigator.userAgent);
  }
  function n$1() {
    return t$1() || i$1();
  }
  function u$4(e2, t2, n2) {
    c$2.isServer || e$1.watchEffect((o2) => {
      document.addEventListener(e2, t2, n2), o2(() => document.removeEventListener(e2, t2, n2));
    });
  }
  function w$2(e2, n2, t2) {
    c$2.isServer || e$1.watchEffect((o2) => {
      window.addEventListener(e2, n2, t2), o2(() => window.removeEventListener(e2, n2, t2));
    });
  }
  function w$1(f2, m, l2 = e$1.computed(() => true)) {
    function a2(e2, r2) {
      if (!l2.value || e2.defaultPrevented) return;
      let t2 = r2(e2);
      if (t2 === null || !t2.getRootNode().contains(t2)) return;
      let c2 = function o2(n2) {
        return typeof n2 == "function" ? o2(n2()) : Array.isArray(n2) || n2 instanceof Set ? n2 : [n2];
      }(f2);
      for (let o2 of c2) {
        if (o2 === null) continue;
        let n2 = o2 instanceof HTMLElement ? o2 : o$3(o2);
        if (n2 != null && n2.contains(t2) || e2.composed && e2.composedPath().includes(n2)) return;
      }
      return !w$3(t2, h.Loose) && t2.tabIndex !== -1 && e2.preventDefault(), m(e2, t2);
    }
    let u2 = e$1.ref(null);
    u$4("pointerdown", (e2) => {
      var r2, t2;
      l2.value && (u2.value = ((t2 = (r2 = e2.composedPath) == null ? void 0 : r2.call(e2)) == null ? void 0 : t2[0]) || e2.target);
    }, true), u$4("mousedown", (e2) => {
      var r2, t2;
      l2.value && (u2.value = ((t2 = (r2 = e2.composedPath) == null ? void 0 : r2.call(e2)) == null ? void 0 : t2[0]) || e2.target);
    }, true), u$4("click", (e2) => {
      n$1() || u2.value && (a2(e2, () => u2.value), u2.value = null);
    }, true), u$4("touchend", (e2) => a2(e2, () => e2.target instanceof HTMLElement ? e2.target : null), true), w$2("blur", (e2) => a2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
  }
  function r$1(t2, e2) {
    if (t2) return t2;
    let n2 = e2 != null ? e2 : "button";
    if (typeof n2 == "string" && n2.toLowerCase() === "button") return "button";
  }
  function s2(t2, e2) {
    let n2 = e$1.ref(r$1(t2.value.type, t2.value.as));
    return e$1.onMounted(() => {
      n2.value = r$1(t2.value.type, t2.value.as);
    }), e$1.watchEffect(() => {
      var u2;
      n2.value || o$3(e2) && o$3(e2) instanceof HTMLButtonElement && !((u2 = o$3(e2)) != null && u2.hasAttribute("type")) && (n2.value = "button");
    }), n2;
  }
  function r(e2) {
    return [e2.screenX, e2.screenY];
  }
  function u$3() {
    let e2 = e$1.ref([-1, -1]);
    return { wasMoved(n2) {
      let t2 = r(n2);
      return e2.value[0] === t2[0] && e2.value[1] === t2[1] ? false : (e2.value = t2, true);
    }, update(n2) {
      e2.value = r(n2);
    } };
  }
  var N$1 = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(N$1 || {}), S = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(S || {});
  function A$1({ visible: r2 = true, features: t2 = 0, ourProps: e2, theirProps: o2, ...i2 }) {
    var a2;
    let n2 = j(o2, e2), l2 = Object.assign(i2, { props: n2 });
    if (r2 || t2 & 2 && n2.static) return y(l2);
    if (t2 & 1) {
      let d2 = (a2 = n2.unmount) == null || a2 ? 0 : 1;
      return u$5(d2, { [0]() {
        return null;
      }, [1]() {
        return y({ ...i2, props: { ...n2, hidden: true, style: { display: "none" } } });
      } });
    }
    return y(l2);
  }
  function y({ props: r2, attrs: t2, slots: e2, slot: o2, name: i2 }) {
    var m, h2;
    let { as: n2, ...l2 } = T$1(r2, ["unmount", "static"]), a2 = (m = e2.default) == null ? void 0 : m.call(e2, o2), d2 = {};
    if (o2) {
      let u2 = false, c2 = [];
      for (let [p2, f2] of Object.entries(o2)) typeof f2 == "boolean" && (u2 = true), f2 === true && c2.push(p2);
      u2 && (d2["data-headlessui-state"] = c2.join(" "));
    }
    if (n2 === "template") {
      if (a2 = b(a2 != null ? a2 : []), Object.keys(l2).length > 0 || Object.keys(t2).length > 0) {
        let [u2, ...c2] = a2 != null ? a2 : [];
        if (!v(u2) || c2.length > 0) throw new Error(['Passing props on "template"!', "", `The current component <${i2} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(l2).concat(Object.keys(t2)).map((s3) => s3.trim()).filter((s3, g2, R) => R.indexOf(s3) === g2).sort((s3, g2) => s3.localeCompare(g2)).map((s3) => `  - ${s3}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((s3) => `  - ${s3}`).join(`
`)].join(`
`));
        let p2 = j((h2 = u2.props) != null ? h2 : {}, l2, d2), f2 = e$1.cloneVNode(u2, p2, true);
        for (let s3 in p2) s3.startsWith("on") && (f2.props || (f2.props = {}), f2.props[s3] = p2[s3]);
        return f2;
      }
      return Array.isArray(a2) && a2.length === 1 ? a2[0] : a2;
    }
    return e$1.h(n2, Object.assign({}, l2, d2), { default: () => a2 });
  }
  function b(r2) {
    return r2.flatMap((t2) => t2.type === e$1.Fragment ? b(t2.children) : [t2]);
  }
  function j(...r2) {
    if (r2.length === 0) return {};
    if (r2.length === 1) return r2[0];
    let t2 = {}, e2 = {};
    for (let i2 of r2) for (let n2 in i2) n2.startsWith("on") && typeof i2[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i2[n2])) : t2[n2] = i2[n2];
    if (t2.disabled || t2["aria-disabled"]) return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((i2) => [i2, void 0])));
    for (let i2 in e2) Object.assign(t2, { [i2](n2, ...l2) {
      let a2 = e2[i2];
      for (let d2 of a2) {
        if (n2 instanceof Event && n2.defaultPrevented) return;
        d2(n2, ...l2);
      }
    } });
    return t2;
  }
  function E$1(r2) {
    let t2 = Object.assign({}, r2);
    for (let e2 in t2) t2[e2] === void 0 && delete t2[e2];
    return t2;
  }
  function T$1(r2, t2 = []) {
    let e2 = Object.assign({}, r2);
    for (let o2 of t2) o2 in e2 && delete e2[o2];
    return e2;
  }
  function v(r2) {
    return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
  }
  var u$2 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(u$2 || {});
  let f$2 = e$1.defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(t2, { slots: n2, attrs: i2 }) {
    return () => {
      var r2;
      let { features: e2, ...d2 } = t2, o2 = { "aria-hidden": (e2 & 2) === 2 ? true : (r2 = d2["aria-hidden"]) != null ? r2 : void 0, hidden: (e2 & 4) === 4 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
      return A$1({ ourProps: o2, theirProps: d2, slot: {}, attrs: i2, slots: n2, name: "Hidden" });
    };
  } });
  let n = Symbol("Context");
  var i = ((e2) => (e2[e2.Open = 1] = "Open", e2[e2.Closed = 2] = "Closed", e2[e2.Closing = 4] = "Closing", e2[e2.Opening = 8] = "Opening", e2))(i || {});
  function l() {
    return e$1.inject(n, null);
  }
  function t(o2) {
    e$1.provide(n, o2);
  }
  var o$2 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$2 || {});
  function u$1(l2) {
    throw new Error("Unexpected object: " + l2);
  }
  var c = ((i2) => (i2[i2.First = 0] = "First", i2[i2.Previous = 1] = "Previous", i2[i2.Next = 2] = "Next", i2[i2.Last = 3] = "Last", i2[i2.Specific = 4] = "Specific", i2[i2.Nothing = 5] = "Nothing", i2))(c || {});
  function f$1(l2, n2) {
    let t2 = n2.resolveItems();
    if (t2.length <= 0) return null;
    let r2 = n2.resolveActiveIndex(), s3 = r2 != null ? r2 : -1;
    switch (l2.focus) {
      case 0: {
        for (let e2 = 0; e2 < t2.length; ++e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
        return r2;
      }
      case 1: {
        s3 === -1 && (s3 = t2.length);
        for (let e2 = s3 - 1; e2 >= 0; --e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
        return r2;
      }
      case 2: {
        for (let e2 = s3 + 1; e2 < t2.length; ++e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
        return r2;
      }
      case 3: {
        for (let e2 = t2.length - 1; e2 >= 0; --e2) if (!n2.resolveDisabled(t2[e2], e2, t2)) return e2;
        return r2;
      }
      case 4: {
        for (let e2 = 0; e2 < t2.length; ++e2) if (n2.resolveId(t2[e2], e2, t2) === l2.id) return e2;
        return r2;
      }
      case 5:
        return null;
      default:
        u$1(l2);
    }
  }
  function e(i2 = {}, s3 = null, t2 = []) {
    for (let [r2, n2] of Object.entries(i2)) o$1(t2, f(s3, r2), n2);
    return t2;
  }
  function f(i2, s3) {
    return i2 ? i2 + "[" + s3 + "]" : s3;
  }
  function o$1(i2, s3, t2) {
    if (Array.isArray(t2)) for (let [r2, n2] of t2.entries()) o$1(i2, f(s3, r2.toString()), n2);
    else t2 instanceof Date ? i2.push([s3, t2.toISOString()]) : typeof t2 == "boolean" ? i2.push([s3, t2 ? "1" : "0"]) : typeof t2 == "string" ? i2.push([s3, t2]) : typeof t2 == "number" ? i2.push([s3, `${t2}`]) : t2 == null ? i2.push([s3, ""]) : e(t2, s3, i2);
  }
  function p$1(i2) {
    var t2, r2;
    let s3 = (t2 = i2 == null ? void 0 : i2.form) != null ? t2 : i2.closest("form");
    if (s3) {
      for (let n2 of s3.elements) if (n2 !== i2 && (n2.tagName === "INPUT" && n2.type === "submit" || n2.tagName === "BUTTON" && n2.type === "submit" || n2.nodeName === "INPUT" && n2.type === "image")) {
        n2.click();
        return;
      }
      (r2 = s3.requestSubmit) == null || r2.call(s3);
    }
  }
  let u = Symbol("DescriptionContext");
  function w() {
    let t2 = e$1.inject(u, null);
    if (t2 === null) throw new Error("Missing parent");
    return t2;
  }
  function k$1({ slot: t2 = e$1.ref({}), name: o2 = "Description", props: s3 = {} } = {}) {
    let e2 = e$1.ref([]);
    function r2(n2) {
      return e2.value.push(n2), () => {
        let i2 = e2.value.indexOf(n2);
        i2 !== -1 && e2.value.splice(i2, 1);
      };
    }
    return e$1.provide(u, { register: r2, slot: t2, name: o2, props: s3 }), e$1.computed(() => e2.value.length > 0 ? e2.value.join(" ") : void 0);
  }
  e$1.defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" }, id: { type: String, default: null } }, setup(t2, { attrs: o2, slots: s3 }) {
    var n2;
    let e2 = (n2 = t2.id) != null ? n2 : `headlessui-description-${i$4()}`, r2 = w();
    return e$1.onMounted(() => e$1.onUnmounted(r2.register(e2))), () => {
      let { name: i2 = "Description", slot: l2 = e$1.ref({}), props: d2 = {} } = r2, { ...c2 } = t2, f2 = { ...Object.entries(d2).reduce((a2, [g2, m]) => Object.assign(a2, { [g2]: e$1.unref(m) }), {}), id: e2 };
      return A$1({ ourProps: f2, theirProps: c2, slot: l2.value, attrs: o2, slots: s3, name: i2 });
    };
  } });
  var $$1 = ((o2) => (o2[o2.Open = 0] = "Open", o2[o2.Closed = 1] = "Closed", o2))($$1 || {});
  let T = Symbol("DisclosureContext");
  function O(t2) {
    let r2 = e$1.inject(T, null);
    if (r2 === null) {
      let o2 = new Error(`<${t2} /> is missing a parent <Disclosure /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(o2, O), o2;
    }
    return r2;
  }
  let k = Symbol("DisclosurePanelContext");
  function U() {
    return e$1.inject(k, null);
  }
  let N = e$1.defineComponent({ name: "Disclosure", props: { as: { type: [Object, String], default: "template" }, defaultOpen: { type: [Boolean], default: false } }, setup(t$12, { slots: r2, attrs: o2 }) {
    let s3 = e$1.ref(t$12.defaultOpen ? 0 : 1), e2 = e$1.ref(null), i$12 = e$1.ref(null), n2 = { buttonId: e$1.ref(`headlessui-disclosure-button-${i$4()}`), panelId: e$1.ref(`headlessui-disclosure-panel-${i$4()}`), disclosureState: s3, panel: e2, button: i$12, toggleDisclosure() {
      s3.value = u$5(s3.value, { [0]: 1, [1]: 0 });
    }, closeDisclosure() {
      s3.value !== 1 && (s3.value = 1);
    }, close(l2) {
      n2.closeDisclosure();
      let a2 = (() => l2 ? l2 instanceof HTMLElement ? l2 : l2.value instanceof HTMLElement ? o$3(l2) : o$3(n2.button) : o$3(n2.button))();
      a2 == null || a2.focus();
    } };
    return e$1.provide(T, n2), t(e$1.computed(() => u$5(s3.value, { [0]: i.Open, [1]: i.Closed }))), () => {
      let { defaultOpen: l2, ...a2 } = t$12, c2 = { open: s3.value === 0, close: n2.close };
      return A$1({ theirProps: a2, ourProps: {}, slot: c2, slots: r2, attrs: o2, name: "Disclosure" });
    };
  } }), Q = e$1.defineComponent({ name: "DisclosureButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false }, id: { type: String, default: null } }, setup(t2, { attrs: r2, slots: o2, expose: s$12 }) {
    let e2 = O("DisclosureButton"), i2 = U(), n2 = e$1.computed(() => i2 === null ? false : i2.value === e2.panelId.value);
    e$1.onMounted(() => {
      n2.value || t2.id !== null && (e2.buttonId.value = t2.id);
    }), e$1.onUnmounted(() => {
      n2.value || (e2.buttonId.value = null);
    });
    let l2 = e$1.ref(null);
    s$12({ el: l2, $el: l2 }), n2.value || e$1.watchEffect(() => {
      e2.button.value = l2.value;
    });
    let a2 = s2(e$1.computed(() => ({ as: t2.as, type: r2.type })), l2);
    function c2() {
      var u2;
      t2.disabled || (n2.value ? (e2.toggleDisclosure(), (u2 = o$3(e2.button)) == null || u2.focus()) : e2.toggleDisclosure());
    }
    function D(u2) {
      var S2;
      if (!t2.disabled) if (n2.value) switch (u2.key) {
        case o$2.Space:
        case o$2.Enter:
          u2.preventDefault(), u2.stopPropagation(), e2.toggleDisclosure(), (S2 = o$3(e2.button)) == null || S2.focus();
          break;
      }
      else switch (u2.key) {
        case o$2.Space:
        case o$2.Enter:
          u2.preventDefault(), u2.stopPropagation(), e2.toggleDisclosure();
          break;
      }
    }
    function v2(u2) {
      switch (u2.key) {
        case o$2.Space:
          u2.preventDefault();
          break;
      }
    }
    return () => {
      var C2;
      let u2 = { open: e2.disclosureState.value === 0 }, { id: S2, ...K2 } = t2, M = n2.value ? { ref: l2, type: a2.value, onClick: c2, onKeydown: D } : { id: (C2 = e2.buttonId.value) != null ? C2 : S2, ref: l2, type: a2.value, "aria-expanded": e2.disclosureState.value === 0, "aria-controls": e2.disclosureState.value === 0 || o$3(e2.panel) ? e2.panelId.value : void 0, disabled: t2.disabled ? true : void 0, onClick: c2, onKeydown: D, onKeyup: v2 };
      return A$1({ ourProps: M, theirProps: K2, slot: u2, attrs: r2, slots: o2, name: "DisclosureButton" });
    };
  } }), V = e$1.defineComponent({ name: "DisclosurePanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: null } }, setup(t2, { attrs: r2, slots: o2, expose: s3 }) {
    let e2 = O("DisclosurePanel");
    e$1.onMounted(() => {
      t2.id !== null && (e2.panelId.value = t2.id);
    }), e$1.onUnmounted(() => {
      e2.panelId.value = null;
    }), s3({ el: e2.panel, $el: e2.panel }), e$1.provide(k, e2.panelId);
    let i$12 = l(), n2 = e$1.computed(() => i$12 !== null ? (i$12.value & i.Open) === i.Open : e2.disclosureState.value === 0);
    return () => {
      var v2;
      let l2 = { open: e2.disclosureState.value === 0, close: e2.close }, { id: a2, ...c2 } = t2, D = { id: (v2 = e2.panelId.value) != null ? v2 : a2, ref: e2.panel };
      return A$1({ ourProps: D, theirProps: c2, slot: l2, attrs: r2, slots: o2, features: N$1.RenderStrategy | N$1.Static, visible: n2.value, name: "DisclosurePanel" });
    };
  } });
  let a$1 = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  function o(e2) {
    var r2, i2;
    let n2 = (r2 = e2.innerText) != null ? r2 : "", t2 = e2.cloneNode(true);
    if (!(t2 instanceof HTMLElement)) return n2;
    let u2 = false;
    for (let f2 of t2.querySelectorAll('[hidden],[aria-hidden],[role="img"]')) f2.remove(), u2 = true;
    let l2 = u2 ? (i2 = t2.innerText) != null ? i2 : "" : n2;
    return a$1.test(l2) && (l2 = l2.replace(a$1, "")), l2;
  }
  function g(e2) {
    let n2 = e2.getAttribute("aria-label");
    if (typeof n2 == "string") return n2.trim();
    let t2 = e2.getAttribute("aria-labelledby");
    if (t2) {
      let u2 = t2.split(" ").map((l2) => {
        let r2 = document.getElementById(l2);
        if (r2) {
          let i2 = r2.getAttribute("aria-label");
          return typeof i2 == "string" ? i2.trim() : o(r2).trim();
        }
        return null;
      }).filter(Boolean);
      if (u2.length > 0) return u2.join(", ");
    }
    return o(e2).trim();
  }
  function p(a2) {
    let t2 = e$1.ref(""), r2 = e$1.ref("");
    return () => {
      let e2 = o$3(a2);
      if (!e2) return "";
      let l2 = e2.innerText;
      if (t2.value === l2) return r2.value;
      let u2 = g(e2).trim().toLowerCase();
      return t2.value = l2, r2.value = u2, u2;
    };
  }
  function pe(o2, b2) {
    return o2 === b2;
  }
  var ce = ((r2) => (r2[r2.Open = 0] = "Open", r2[r2.Closed = 1] = "Closed", r2))(ce || {}), ve = ((r2) => (r2[r2.Single = 0] = "Single", r2[r2.Multi = 1] = "Multi", r2))(ve || {}), be = ((r2) => (r2[r2.Pointer = 0] = "Pointer", r2[r2.Other = 1] = "Other", r2))(be || {});
  function me(o2) {
    requestAnimationFrame(() => requestAnimationFrame(o2));
  }
  let $ = Symbol("ListboxContext");
  function A(o2) {
    let b2 = e$1.inject($, null);
    if (b2 === null) {
      let r2 = new Error(`<${o2} /> is missing a parent <Listbox /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, A), r2;
    }
    return b2;
  }
  let Ie = e$1.defineComponent({ name: "Listbox", emits: { "update:modelValue": (o2) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, by: { type: [String, Function], default: () => pe }, horizontal: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean], default: void 0 }, defaultValue: { type: [Object, String, Number, Boolean], default: void 0 }, form: { type: String, optional: true }, name: { type: String, optional: true }, multiple: { type: [Boolean], default: false } }, inheritAttrs: false, setup(o2, { slots: b2, attrs: r2, emit: w2 }) {
    let n2 = e$1.ref(1), e$12 = e$1.ref(null), f2 = e$1.ref(null), v2 = e$1.ref(null), s3 = e$1.ref([]), m = e$1.ref(""), p2 = e$1.ref(null), a2 = e$1.ref(1);
    function u2(t2 = (i2) => i2) {
      let i2 = p2.value !== null ? s3.value[p2.value] : null, l2 = O$1(t2(s3.value.slice()), (O2) => o$3(O2.dataRef.domRef)), d2 = i2 ? l2.indexOf(i2) : null;
      return d2 === -1 && (d2 = null), { options: l2, activeOptionIndex: d2 };
    }
    let D = e$1.computed(() => o2.multiple ? 1 : 0), [y2, L] = d$2(e$1.computed(() => o2.modelValue), (t2) => w2("update:modelValue", t2), e$1.computed(() => o2.defaultValue)), M = e$1.computed(() => y2.value === void 0 ? u$5(D.value, { [1]: [], [0]: void 0 }) : y2.value), k2 = { listboxState: n2, value: M, mode: D, compare(t2, i2) {
      if (typeof o2.by == "string") {
        let l2 = o2.by;
        return (t2 == null ? void 0 : t2[l2]) === (i2 == null ? void 0 : i2[l2]);
      }
      return o2.by(t2, i2);
    }, orientation: e$1.computed(() => o2.horizontal ? "horizontal" : "vertical"), labelRef: e$12, buttonRef: f2, optionsRef: v2, disabled: e$1.computed(() => o2.disabled), options: s3, searchQuery: m, activeOptionIndex: p2, activationTrigger: a2, closeListbox() {
      o2.disabled || n2.value !== 1 && (n2.value = 1, p2.value = null);
    }, openListbox() {
      o2.disabled || n2.value !== 0 && (n2.value = 0);
    }, goToOption(t2, i2, l2) {
      if (o2.disabled || n2.value === 1) return;
      let d2 = u2(), O2 = f$1(t2 === c.Specific ? { focus: c.Specific, id: i2 } : { focus: t2 }, { resolveItems: () => d2.options, resolveActiveIndex: () => d2.activeOptionIndex, resolveId: (h2) => h2.id, resolveDisabled: (h2) => h2.dataRef.disabled });
      m.value = "", p2.value = O2, a2.value = l2 != null ? l2 : 1, s3.value = d2.options;
    }, search(t2) {
      if (o2.disabled || n2.value === 1) return;
      let l2 = m.value !== "" ? 0 : 1;
      m.value += t2.toLowerCase();
      let O2 = (p2.value !== null ? s3.value.slice(p2.value + l2).concat(s3.value.slice(0, p2.value + l2)) : s3.value).find((I) => I.dataRef.textValue.startsWith(m.value) && !I.dataRef.disabled), h2 = O2 ? s3.value.indexOf(O2) : -1;
      h2 === -1 || h2 === p2.value || (p2.value = h2, a2.value = 1);
    }, clearSearch() {
      o2.disabled || n2.value !== 1 && m.value !== "" && (m.value = "");
    }, registerOption(t2, i2) {
      let l2 = u2((d2) => [...d2, { id: t2, dataRef: i2 }]);
      s3.value = l2.options, p2.value = l2.activeOptionIndex;
    }, unregisterOption(t2) {
      let i2 = u2((l2) => {
        let d2 = l2.findIndex((O2) => O2.id === t2);
        return d2 !== -1 && l2.splice(d2, 1), l2;
      });
      s3.value = i2.options, p2.value = i2.activeOptionIndex, a2.value = 1;
    }, theirOnChange(t2) {
      o2.disabled || L(t2);
    }, select(t2) {
      o2.disabled || L(u$5(D.value, { [0]: () => t2, [1]: () => {
        let i2 = e$1.toRaw(k2.value.value).slice(), l2 = e$1.toRaw(t2), d2 = i2.findIndex((O2) => k2.compare(l2, e$1.toRaw(O2)));
        return d2 === -1 ? i2.push(l2) : i2.splice(d2, 1), i2;
      } }));
    } };
    w$1([f2, v2], (t2, i2) => {
      var l2;
      k2.closeListbox(), w$3(i2, h.Loose) || (t2.preventDefault(), (l2 = o$3(f2)) == null || l2.focus());
    }, e$1.computed(() => n2.value === 0)), e$1.provide($, k2), t(e$1.computed(() => u$5(n2.value, { [0]: i.Open, [1]: i.Closed })));
    let C2 = e$1.computed(() => {
      var t2;
      return (t2 = o$3(f2)) == null ? void 0 : t2.closest("form");
    });
    return e$1.onMounted(() => {
      e$1.watch([C2], () => {
        if (!C2.value || o2.defaultValue === void 0) return;
        function t2() {
          k2.theirOnChange(o2.defaultValue);
        }
        return C2.value.addEventListener("reset", t2), () => {
          var i2;
          (i2 = C2.value) == null || i2.removeEventListener("reset", t2);
        };
      }, { immediate: true });
    }), () => {
      let { name: t2, modelValue: i2, disabled: l2, form: d2, ...O2 } = o2, h2 = { open: n2.value === 0, disabled: l2, value: M.value };
      return e$1.h(e$1.Fragment, [...t2 != null && M.value != null ? e({ [t2]: M.value }).map(([I, Q2]) => e$1.h(f$2, E$1({ features: u$2.Hidden, key: I, as: "input", type: "hidden", hidden: true, readOnly: true, form: d2, disabled: l2, name: I, value: Q2 }))) : [], A$1({ ourProps: {}, theirProps: { ...r2, ...T$1(O2, ["defaultValue", "onUpdate:modelValue", "horizontal", "multiple", "by"]) }, slot: h2, slots: b2, attrs: r2, name: "Listbox" })]);
    };
  } });
  e$1.defineComponent({ name: "ListboxLabel", props: { as: { type: [Object, String], default: "label" }, id: { type: String, default: null } }, setup(o2, { attrs: b2, slots: r2 }) {
    var f2;
    let w2 = (f2 = o2.id) != null ? f2 : `headlessui-listbox-label-${i$4()}`, n2 = A("ListboxLabel");
    function e2() {
      var v2;
      (v2 = o$3(n2.buttonRef)) == null || v2.focus({ preventScroll: true });
    }
    return () => {
      let v2 = { open: n2.listboxState.value === 0, disabled: n2.disabled.value }, { ...s3 } = o2, m = { id: w2, ref: n2.labelRef, onClick: e2 };
      return A$1({ ourProps: m, theirProps: s3, slot: v2, attrs: b2, slots: r2, name: "ListboxLabel" });
    };
  } });
  let je = e$1.defineComponent({ name: "ListboxButton", props: { as: { type: [Object, String], default: "button" }, id: { type: String, default: null } }, setup(o2, { attrs: b2, slots: r2, expose: w2 }) {
    var p2;
    let n2 = (p2 = o2.id) != null ? p2 : `headlessui-listbox-button-${i$4()}`, e2 = A("ListboxButton");
    w2({ el: e2.buttonRef, $el: e2.buttonRef });
    function f2(a2) {
      switch (a2.key) {
        case o$2.Space:
        case o$2.Enter:
        case o$2.ArrowDown:
          a2.preventDefault(), e2.openListbox(), e$1.nextTick(() => {
            var u2;
            (u2 = o$3(e2.optionsRef)) == null || u2.focus({ preventScroll: true }), e2.value.value || e2.goToOption(c.First);
          });
          break;
        case o$2.ArrowUp:
          a2.preventDefault(), e2.openListbox(), e$1.nextTick(() => {
            var u2;
            (u2 = o$3(e2.optionsRef)) == null || u2.focus({ preventScroll: true }), e2.value.value || e2.goToOption(c.Last);
          });
          break;
      }
    }
    function v2(a2) {
      switch (a2.key) {
        case o$2.Space:
          a2.preventDefault();
          break;
      }
    }
    function s$12(a2) {
      e2.disabled.value || (e2.listboxState.value === 0 ? (e2.closeListbox(), e$1.nextTick(() => {
        var u2;
        return (u2 = o$3(e2.buttonRef)) == null ? void 0 : u2.focus({ preventScroll: true });
      })) : (a2.preventDefault(), e2.openListbox(), me(() => {
        var u2;
        return (u2 = o$3(e2.optionsRef)) == null ? void 0 : u2.focus({ preventScroll: true });
      })));
    }
    let m = s2(e$1.computed(() => ({ as: o2.as, type: b2.type })), e2.buttonRef);
    return () => {
      var y2, L;
      let a2 = { open: e2.listboxState.value === 0, disabled: e2.disabled.value, value: e2.value.value }, { ...u2 } = o2, D = { ref: e2.buttonRef, id: n2, type: m.value, "aria-haspopup": "listbox", "aria-controls": (y2 = o$3(e2.optionsRef)) == null ? void 0 : y2.id, "aria-expanded": e2.listboxState.value === 0, "aria-labelledby": e2.labelRef.value ? [(L = o$3(e2.labelRef)) == null ? void 0 : L.id, n2].join(" ") : void 0, disabled: e2.disabled.value === true ? true : void 0, onKeydown: f2, onKeyup: v2, onClick: s$12 };
      return A$1({ ourProps: D, theirProps: u2, slot: a2, attrs: b2, slots: r2, name: "ListboxButton" });
    };
  } }), Ae = e$1.defineComponent({ name: "ListboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, id: { type: String, default: null } }, setup(o2, { attrs: b2, slots: r2, expose: w2 }) {
    var p2;
    let n2 = (p2 = o2.id) != null ? p2 : `headlessui-listbox-options-${i$4()}`, e2 = A("ListboxOptions"), f2 = e$1.ref(null);
    w2({ el: e2.optionsRef, $el: e2.optionsRef });
    function v2(a2) {
      switch (f2.value && clearTimeout(f2.value), a2.key) {
        case o$2.Space:
          if (e2.searchQuery.value !== "") return a2.preventDefault(), a2.stopPropagation(), e2.search(a2.key);
        case o$2.Enter:
          if (a2.preventDefault(), a2.stopPropagation(), e2.activeOptionIndex.value !== null) {
            let u2 = e2.options.value[e2.activeOptionIndex.value];
            e2.select(u2.dataRef.value);
          }
          e2.mode.value === 0 && (e2.closeListbox(), e$1.nextTick(() => {
            var u2;
            return (u2 = o$3(e2.buttonRef)) == null ? void 0 : u2.focus({ preventScroll: true });
          }));
          break;
        case u$5(e2.orientation.value, { vertical: o$2.ArrowDown, horizontal: o$2.ArrowRight }):
          return a2.preventDefault(), a2.stopPropagation(), e2.goToOption(c.Next);
        case u$5(e2.orientation.value, { vertical: o$2.ArrowUp, horizontal: o$2.ArrowLeft }):
          return a2.preventDefault(), a2.stopPropagation(), e2.goToOption(c.Previous);
        case o$2.Home:
        case o$2.PageUp:
          return a2.preventDefault(), a2.stopPropagation(), e2.goToOption(c.First);
        case o$2.End:
        case o$2.PageDown:
          return a2.preventDefault(), a2.stopPropagation(), e2.goToOption(c.Last);
        case o$2.Escape:
          a2.preventDefault(), a2.stopPropagation(), e2.closeListbox(), e$1.nextTick(() => {
            var u2;
            return (u2 = o$3(e2.buttonRef)) == null ? void 0 : u2.focus({ preventScroll: true });
          });
          break;
        case o$2.Tab:
          a2.preventDefault(), a2.stopPropagation();
          break;
        default:
          a2.key.length === 1 && (e2.search(a2.key), f2.value = setTimeout(() => e2.clearSearch(), 350));
          break;
      }
    }
    let s3 = l(), m = e$1.computed(() => s3 !== null ? (s3.value & i.Open) === i.Open : e2.listboxState.value === 0);
    return () => {
      var y2, L;
      let a2 = { open: e2.listboxState.value === 0 }, { ...u2 } = o2, D = { "aria-activedescendant": e2.activeOptionIndex.value === null || (y2 = e2.options.value[e2.activeOptionIndex.value]) == null ? void 0 : y2.id, "aria-multiselectable": e2.mode.value === 1 ? true : void 0, "aria-labelledby": (L = o$3(e2.buttonRef)) == null ? void 0 : L.id, "aria-orientation": e2.orientation.value, id: n2, onKeydown: v2, role: "listbox", tabIndex: 0, ref: e2.optionsRef };
      return A$1({ ourProps: D, theirProps: u2, slot: a2, attrs: b2, slots: r2, features: N$1.RenderStrategy | N$1.Static, visible: m.value, name: "ListboxOptions" });
    };
  } }), Fe = e$1.defineComponent({ name: "ListboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false }, id: { type: String, default: null } }, setup(o2, { slots: b2, attrs: r2, expose: w2 }) {
    var C2;
    let n2 = (C2 = o2.id) != null ? C2 : `headlessui-listbox-option-${i$4()}`, e2 = A("ListboxOption"), f2 = e$1.ref(null);
    w2({ el: f2, $el: f2 });
    let v2 = e$1.computed(() => e2.activeOptionIndex.value !== null ? e2.options.value[e2.activeOptionIndex.value].id === n2 : false), s3 = e$1.computed(() => u$5(e2.mode.value, { [0]: () => e2.compare(e$1.toRaw(e2.value.value), e$1.toRaw(o2.value)), [1]: () => e$1.toRaw(e2.value.value).some((t2) => e2.compare(e$1.toRaw(t2), e$1.toRaw(o2.value))) })), m = e$1.computed(() => u$5(e2.mode.value, { [1]: () => {
      var i2;
      let t2 = e$1.toRaw(e2.value.value);
      return ((i2 = e2.options.value.find((l2) => t2.some((d2) => e2.compare(e$1.toRaw(d2), e$1.toRaw(l2.dataRef.value))))) == null ? void 0 : i2.id) === n2;
    }, [0]: () => s3.value })), p$12 = p(f2), a2 = e$1.computed(() => ({ disabled: o2.disabled, value: o2.value, get textValue() {
      return p$12();
    }, domRef: f2 }));
    e$1.onMounted(() => e2.registerOption(n2, a2)), e$1.onUnmounted(() => e2.unregisterOption(n2)), e$1.onMounted(() => {
      e$1.watch([e2.listboxState, s3], () => {
        e2.listboxState.value === 0 && s3.value && u$5(e2.mode.value, { [1]: () => {
          m.value && e2.goToOption(c.Specific, n2);
        }, [0]: () => {
          e2.goToOption(c.Specific, n2);
        } });
      }, { immediate: true });
    }), e$1.watchEffect(() => {
      e2.listboxState.value === 0 && v2.value && e2.activationTrigger.value !== 0 && e$1.nextTick(() => {
        var t2, i2;
        return (i2 = (t2 = o$3(f2)) == null ? void 0 : t2.scrollIntoView) == null ? void 0 : i2.call(t2, { block: "nearest" });
      });
    });
    function u2(t2) {
      if (o2.disabled) return t2.preventDefault();
      e2.select(o2.value), e2.mode.value === 0 && (e2.closeListbox(), e$1.nextTick(() => {
        var i2;
        return (i2 = o$3(e2.buttonRef)) == null ? void 0 : i2.focus({ preventScroll: true });
      }));
    }
    function D() {
      if (o2.disabled) return e2.goToOption(c.Nothing);
      e2.goToOption(c.Specific, n2);
    }
    let y2 = u$3();
    function L(t2) {
      y2.update(t2);
    }
    function M(t2) {
      y2.wasMoved(t2) && (o2.disabled || v2.value || e2.goToOption(c.Specific, n2, 0));
    }
    function k2(t2) {
      y2.wasMoved(t2) && (o2.disabled || v2.value && e2.goToOption(c.Nothing));
    }
    return () => {
      let { disabled: t2 } = o2, i2 = { active: v2.value, selected: s3.value, disabled: t2 }, { value: l2, disabled: d2, ...O2 } = o2, h2 = { id: n2, ref: f2, role: "option", tabIndex: t2 === true ? void 0 : -1, "aria-disabled": t2 === true ? true : void 0, "aria-selected": s3.value, disabled: void 0, onClick: u2, onFocus: D, onPointerenter: L, onMouseenter: L, onPointermove: M, onMousemove: M, onPointerleave: k2, onMouseleave: k2 };
      return A$1({ ourProps: h2, theirProps: O2, slot: i2, attrs: r2, slots: b2, name: "ListboxOption" });
    };
  } });
  let a = Symbol("LabelContext");
  function d() {
    let t2 = e$1.inject(a, null);
    if (t2 === null) {
      let n2 = new Error("You used a <Label /> component, but it is not inside a parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(n2, d), n2;
    }
    return t2;
  }
  function E({ slot: t2 = {}, name: n2 = "Label", props: i2 = {} } = {}) {
    let e2 = e$1.ref([]);
    function o2(r2) {
      return e2.value.push(r2), () => {
        let l2 = e2.value.indexOf(r2);
        l2 !== -1 && e2.value.splice(l2, 1);
      };
    }
    return e$1.provide(a, { register: o2, slot: t2, name: n2, props: i2 }), e$1.computed(() => e2.value.length > 0 ? e2.value.join(" ") : void 0);
  }
  let K = e$1.defineComponent({ name: "Label", props: { as: { type: [Object, String], default: "label" }, passive: { type: [Boolean], default: false }, id: { type: String, default: null } }, setup(t2, { slots: n2, attrs: i2 }) {
    var r2;
    let e2 = (r2 = t2.id) != null ? r2 : `headlessui-label-${i$4()}`, o2 = d();
    return e$1.onMounted(() => e$1.onUnmounted(o2.register(e2))), () => {
      let { name: l2 = "Label", slot: p2 = {}, props: c2 = {} } = o2, { passive: f2, ...s3 } = t2, u2 = { ...Object.entries(c2).reduce((b2, [g2, m]) => Object.assign(b2, { [g2]: e$1.unref(m) }), {}), id: e2 };
      return f2 && (delete u2.onClick, delete u2.htmlFor, delete s3.onClick), A$1({ ourProps: u2, theirProps: s3, slot: p2, attrs: i2, slots: n2, name: l2 });
    };
  } });
  let C = Symbol("GroupContext"), oe = e$1.defineComponent({ name: "SwitchGroup", props: { as: { type: [Object, String], default: "template" } }, setup(l2, { slots: c2, attrs: i2 }) {
    let r2 = e$1.ref(null), f2 = E({ name: "SwitchLabel", props: { htmlFor: e$1.computed(() => {
      var t2;
      return (t2 = r2.value) == null ? void 0 : t2.id;
    }), onClick(t2) {
      r2.value && (t2.currentTarget.tagName === "LABEL" && t2.preventDefault(), r2.value.click(), r2.value.focus({ preventScroll: true }));
    } } }), p2 = k$1({ name: "SwitchDescription" });
    return e$1.provide(C, { switchRef: r2, labelledby: f2, describedby: p2 }), () => A$1({ theirProps: l2, ourProps: {}, slot: {}, slots: c2, attrs: i2, name: "SwitchGroup" });
  } }), ue = e$1.defineComponent({ name: "Switch", emits: { "update:modelValue": (l2) => true }, props: { as: { type: [Object, String], default: "button" }, modelValue: { type: Boolean, default: void 0 }, defaultChecked: { type: Boolean, optional: true }, form: { type: String, optional: true }, name: { type: String, optional: true }, value: { type: String, optional: true }, id: { type: String, default: null }, disabled: { type: Boolean, default: false }, tabIndex: { type: Number, default: 0 } }, inheritAttrs: false, setup(l2, { emit: c2, attrs: i2, slots: r2, expose: f2 }) {
    var h2;
    let p2 = (h2 = l2.id) != null ? h2 : `headlessui-switch-${i$4()}`, n2 = e$1.inject(C, null), [t2, s$12] = d$2(e$1.computed(() => l2.modelValue), (e2) => c2("update:modelValue", e2), e$1.computed(() => l2.defaultChecked));
    function m() {
      s$12(!t2.value);
    }
    let E2 = e$1.ref(null), o2 = n2 === null ? E2 : n2.switchRef, L = s2(e$1.computed(() => ({ as: l2.as, type: i2.type })), o2);
    f2({ el: o2, $el: o2 });
    function D(e2) {
      e2.preventDefault(), m();
    }
    function R(e2) {
      e2.key === o$2.Space ? (e2.preventDefault(), m()) : e2.key === o$2.Enter && p$1(e2.currentTarget);
    }
    function x(e2) {
      e2.preventDefault();
    }
    let d2 = e$1.computed(() => {
      var e2, a2;
      return (a2 = (e2 = o$3(o2)) == null ? void 0 : e2.closest) == null ? void 0 : a2.call(e2, "form");
    });
    return e$1.onMounted(() => {
      e$1.watch([d2], () => {
        if (!d2.value || l2.defaultChecked === void 0) return;
        function e2() {
          s$12(l2.defaultChecked);
        }
        return d2.value.addEventListener("reset", e2), () => {
          var a2;
          (a2 = d2.value) == null || a2.removeEventListener("reset", e2);
        };
      }, { immediate: true });
    }), () => {
      let { name: e2, value: a2, form: K2, tabIndex: y2, ...b2 } = l2, T2 = { checked: t2.value }, B = { id: p2, ref: o2, role: "switch", type: L.value, tabIndex: y2 === -1 ? 0 : y2, "aria-checked": t2.value, "aria-labelledby": n2 == null ? void 0 : n2.labelledby.value, "aria-describedby": n2 == null ? void 0 : n2.describedby.value, onClick: D, onKeyup: R, onKeypress: x };
      return e$1.h(e$1.Fragment, [e2 != null && t2.value != null ? e$1.h(f$2, E$1({ features: u$2.Hidden, as: "input", type: "checkbox", hidden: true, readOnly: true, checked: t2.value, form: K2, disabled: b2.disabled, name: e2, value: a2 })) : null, A$1({ ourProps: B, theirProps: { ...i2, ...T$1(b2, ["modelValue", "defaultChecked"]) }, slot: T2, attrs: i2, slots: r2, name: "Switch" })]);
    };
  } }), de = K;
  function render$2(_ctx, _cache) {
    return e$1.openBlock(), e$1.createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon"
    }, [
      e$1.createElementVNode("path", {
        "fill-rule": "evenodd",
        d: "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
        "clip-rule": "evenodd"
      })
    ]);
  }
  function render$1(_ctx, _cache) {
    return e$1.openBlock(), e$1.createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon"
    }, [
      e$1.createElementVNode("path", {
        "fill-rule": "evenodd",
        d: "M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z",
        "clip-rule": "evenodd"
      })
    ]);
  }
  function render(_ctx, _cache) {
    return e$1.openBlock(), e$1.createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon"
    }, [
      e$1.createElementVNode("path", {
        "fill-rule": "evenodd",
        d: "M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z",
        "clip-rule": "evenodd"
      })
    ]);
  }
  const _hoisted_1$9 = { class: "mx-auto w-full bg-white p-1.5" };
  const _sfc_main$e = /* @__PURE__ */ e$1.defineComponent({
    __name: "DisclosureComp",
    props: {
      title: {},
      isFold: { type: Boolean },
      isSpecial: { type: Boolean }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return e$1.openBlock(), e$1.createElementBlock("div", _hoisted_1$9, [
          e$1.createVNode(e$1.unref(N), {
            "default-open": !_ctx.isFold
          }, {
            default: e$1.withCtx(({ open }) => [
              e$1.createVNode(e$1.unref(Q), {
                class: e$1.normalizeClass(["flex w-full justify-between rounded-lg px-4 py-1.5 text-left font-bold outline-none", {
                  "bg-blue-100/60 text-blue-900 hover:bg-blue-100": !_ctx.isSpecial,
                  "bg-purple-100/60 text-purple-900 hover:bg-purple-100": _ctx.isSpecial
                }])
              }, {
                default: e$1.withCtx(() => [
                  e$1.createElementVNode("span", null, e$1.toDisplayString(_ctx.title || "Disclosure Title"), 1),
                  e$1.createVNode(e$1.unref(render), {
                    class: e$1.normalizeClass([{
                      "rotate-180": open,
                      "rotate-90": !open,
                      "text-blue-500": !_ctx.isSpecial,
                      "text-purple-500": _ctx.isSpecial
                    }, "h-6 w-6"])
                  }, null, 8, ["class"])
                ]),
                _: 2
              }, 1032, ["class"]),
              e$1.createVNode(e$1.unref(V), {
                unmount: false,
                class: "pl-3 pr-2 pt-2 text-gray-500"
              }, {
                default: e$1.withCtx(() => [
                  e$1.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })
            ]),
            _: 3
          }, 8, ["default-open"])
        ]);
      };
    }
  });
  const BiliCleanerStorage = {
    get: (key, defaultValue) => {
      return _GM_getValue(`BILICLEANER_${key}`, defaultValue);
    },
    set: (key, value) => {
      _GM_setValue(`BILICLEANER_${key}`, value);
    }
  };
  const settings = {
    enableDebugRules: !!BiliCleanerStorage.get("debug-rules"),
    enableDebugFilter: !!BiliCleanerStorage.get("debug-filters"),
    filterSign: "bili-cleaner-filtered"
    // 标记视频过滤器检测过的视频
  };
  const startTime = performance.now();
  let lastTime = startTime;
  let currTime = startTime;
  const wrapper = (loggingFunc, isEnable) => {
    if (isEnable) {
      return (...innerArgs) => {
        currTime = performance.now();
        const during = (currTime - lastTime).toFixed(1);
        loggingFunc(`[bili-cleaner] ${during} / ${currTime.toFixed(0)} ms |`, ...innerArgs);
        lastTime = currTime;
      };
    }
    return (..._args) => {
    };
  };
  const log = wrapper(console.log, true);
  const error = wrapper(console.error, true);
  const debugFilter = wrapper(console.log, settings.enableDebugFilter);
  const bvidPattern = /(BV[1-9A-HJ-NP-Za-km-z]+)/;
  const matchBvid = (s3) => {
    var _a;
    return ((_a = bvidPattern.exec(s3)) == null ? void 0 : _a[1]) ?? null;
  };
  const avidbvidPattern = /(av\d+|BV[1-9A-HJ-NP-Za-km-z]+)/;
  const matchAvidBvid = (s3) => {
    var _a;
    return ((_a = avidbvidPattern.exec(s3)) == null ? void 0 : _a[1]) ?? null;
  };
  const convertTimeToSec = (timeStr) => {
    timeStr = timeStr.trim();
    if (/^\d+:\d\d:\d\d$/.test(timeStr)) {
      const parts = timeStr.split(":");
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    if (/^\d\d:\d\d$/.test(timeStr)) {
      const parts = timeStr.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return Infinity;
  };
  const convertDateToDays = (dateStr) => {
    if (dateStr.includes("小时前")) {
      return 0;
    }
    dateStr = dateStr.replace("·", "").trim();
    if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
      const [month, day] = dateStr.split("-").map(Number);
      let target = new Date((/* @__PURE__ */ new Date()).getFullYear(), month - 1, day).getTime();
      const today = (/* @__PURE__ */ new Date()).getTime();
      if (target > today) {
        target = new Date((/* @__PURE__ */ new Date()).getFullYear() - 1, month - 1, day).getTime();
      }
      return (today - target) / 864e5;
    }
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-").map(Number);
      const target = new Date(year, month - 1, day).getTime();
      const today = (/* @__PURE__ */ new Date()).getTime();
      return (today - target) / 864e5;
    }
    return 0;
  };
  const calcQuality = (ratio) => {
    const A2 = -9.881;
    const B = 0.6463;
    const C2 = 0.3829;
    const D = 168.6;
    const ans2 = (A2 - D) / (1 + Math.pow(ratio / C2, B)) + D;
    return ans2 > 0 ? ans2 : 0;
  };
  const hideEle = (ele) => {
    ele.style.setProperty("display", "none", "important");
  };
  const showEle = (ele) => {
    if (ele.style.display === "none") {
      ele.style.removeProperty("display");
    }
  };
  const isEleHide = (ele) => {
    return ele.style.display === "none";
  };
  const waitForEle = async (watchEle, selector, isTargetNode) => {
    if (!selector) {
      return null;
    }
    let ele = watchEle.querySelector(selector);
    if (ele) {
      return ele;
    }
    return await new Promise((resolve) => {
      const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement && isTargetNode(node)) {
                observer.disconnect();
                ele = watchEle.querySelector(selector);
                resolve(ele);
              }
            });
          }
        });
      });
      observer.observe(watchEle, { childList: true, subtree: true });
    });
  };
  const orderedUniq = (arr) => {
    return Array.from(new Set(arr));
  };
  function tryOnScopeDispose(fn2) {
    if (e$1.getCurrentScope()) {
      e$1.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  const localProvidedStateMap = /* @__PURE__ */ new WeakMap();
  const injectLocal = (...args) => {
    var _a;
    const key = args[0];
    const instance = (_a = e$1.getCurrentInstance()) == null ? void 0 : _a.proxy;
    if (instance == null && !e$1.hasInjectionContext())
      throw new Error("injectLocal must be called in setup");
    if (instance && localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance))
      return localProvidedStateMap.get(instance)[key];
    return e$1.inject(...args);
  };
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const notNullish = (val) => val != null;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createFilterWrapper(filter, fn2) {
    function wrapper2(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper2;
  }
  const bypassFilter = (invoke) => {
    return invoke();
  };
  function throttleFilter(...args) {
    let lastExec = 0;
    let timer;
    let isLeading = true;
    let lastRejector = noop;
    let lastValue;
    let ms;
    let trailing;
    let leading;
    let rejectOnCancel;
    if (!e$1.isRef(args[0]) && typeof args[0] === "object")
      ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0]);
    else
      [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
        lastRejector();
        lastRejector = noop;
      }
    };
    const filter = (_invoke) => {
      const duration = e$1.toValue(ms);
      const elapsed = Date.now() - lastExec;
      const invoke = () => {
        return lastValue = _invoke();
      };
      clear();
      if (duration <= 0) {
        lastExec = Date.now();
        return invoke();
      }
      if (elapsed > duration && (leading || !isLeading)) {
        lastExec = Date.now();
        invoke();
      } else if (trailing) {
        lastValue = new Promise((resolve, reject) => {
          lastRejector = rejectOnCancel ? reject : resolve;
          timer = setTimeout(() => {
            lastExec = Date.now();
            isLeading = true;
            resolve(invoke());
            clear();
          }, Math.max(0, duration - elapsed));
        });
      }
      if (!leading && !timer)
        timer = setTimeout(() => isLeading = true, duration);
      isLeading = false;
      return lastValue;
    };
    return filter;
  }
  function pausableFilter(extendFilter = bypassFilter, options = {}) {
    const {
      initialState = "active"
    } = options;
    const isActive = toRef(initialState === "active");
    function pause() {
      isActive.value = false;
    }
    function resume() {
      isActive.value = true;
    }
    const eventFilter = (...args) => {
      if (isActive.value)
        extendFilter(...args);
    };
    return { isActive: e$1.readonly(isActive), pause, resume, eventFilter };
  }
  function pxValue(px) {
    return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
  }
  function getLifeCycleTarget(target) {
    return e$1.getCurrentInstance();
  }
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function toRef(...args) {
    if (args.length !== 1)
      return e$1.toRef(...args);
    const r2 = args[0];
    return typeof r2 === "function" ? e$1.readonly(e$1.customRef(() => ({ get: r2, set: noop }))) : e$1.ref(r2);
  }
  function watchWithFilter(source, cb, options = {}) {
    const {
      eventFilter = bypassFilter,
      ...watchOptions
    } = options;
    return e$1.watch(
      source,
      createFilterWrapper(
        eventFilter,
        cb
      ),
      watchOptions
    );
  }
  function watchPausable(source, cb, options = {}) {
    const {
      eventFilter: filter,
      initialState = "active",
      ...watchOptions
    } = options;
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
    const stop = watchWithFilter(
      source,
      cb,
      {
        ...watchOptions,
        eventFilter
      }
    );
    return { stop, pause, resume, isActive };
  }
  function toRefs(objectRef, options = {}) {
    if (!e$1.isRef(objectRef))
      return e$1.toRefs(objectRef);
    const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
    for (const key in objectRef.value) {
      result[key] = e$1.customRef(() => ({
        get() {
          return objectRef.value[key];
        },
        set(v2) {
          var _a;
          const replaceRef = (_a = e$1.toValue(options.replaceRef)) != null ? _a : true;
          if (replaceRef) {
            if (Array.isArray(objectRef.value)) {
              const copy = [...objectRef.value];
              copy[key] = v2;
              objectRef.value = copy;
            } else {
              const newObject = { ...objectRef.value, [key]: v2 };
              Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
              objectRef.value = newObject;
            }
          } else {
            objectRef.value[key] = v2;
          }
        }
      }));
    }
    return result;
  }
  function tryOnMounted(fn2, sync = true, target) {
    const instance = getLifeCycleTarget();
    if (instance)
      e$1.onMounted(fn2, target);
    else if (sync)
      fn2();
    else
      e$1.nextTick(fn2);
  }
  function watchImmediate(source, cb, options) {
    return e$1.watch(
      source,
      cb,
      {
        ...options,
        immediate: true
      }
    );
  }
  function watchThrottled(source, cb, options = {}) {
    const {
      throttle = 0,
      trailing = true,
      leading = true,
      ...watchOptions
    } = options;
    return watchWithFilter(
      source,
      cb,
      {
        ...watchOptions,
        eventFilter: throttleFilter(throttle, trailing, leading)
      }
    );
  }
  const defaultWindow = isClient ? window : void 0;
  function unrefElement(elRef) {
    var _a;
    const plain = e$1.toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  function useEventListener(...args) {
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options) => {
      el.addEventListener(event, listener, options);
      return () => el.removeEventListener(event, listener, options);
    };
    const firstParamTargets = e$1.computed(() => {
      const test = toArray(e$1.toValue(args[0])).filter((e2) => e2 != null);
      return test.every((e2) => typeof e2 !== "string") ? test : void 0;
    });
    const stopWatch = watchImmediate(
      () => {
        var _a, _b;
        return [
          (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e2) => unrefElement(e2))) != null ? _b : [defaultWindow].filter((e2) => e2 != null),
          toArray(e$1.toValue(firstParamTargets.value ? args[1] : args[0])),
          toArray(e$1.unref(firstParamTargets.value ? args[2] : args[1])),
          // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
          e$1.toValue(firstParamTargets.value ? args[3] : args[2])
        ];
      },
      ([raw_targets, raw_events, raw_listeners, raw_options]) => {
        cleanup();
        if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
          return;
        const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
        cleanups.push(
          ...raw_targets.flatMap(
            (el) => raw_events.flatMap(
              (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
            )
          )
        );
      },
      { flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(cleanup);
    return stop;
  }
  function useMounted() {
    const isMounted = e$1.shallowRef(false);
    const instance = e$1.getCurrentInstance();
    if (instance) {
      e$1.onMounted(() => {
        isMounted.value = true;
      }, instance);
    }
    return isMounted;
  }
  function useSupported(callback) {
    const isMounted = useMounted();
    return e$1.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
  function useMutationObserver(target, callback, options = {}) {
    const { window: window2 = defaultWindow, ...mutationOptions } = options;
    let observer;
    const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const targets = e$1.computed(() => {
      const value = e$1.toValue(target);
      const items = toArray(value).map(unrefElement).filter(notNullish);
      return new Set(items);
    });
    const stopWatch = e$1.watch(
      () => targets.value,
      (targets2) => {
        cleanup();
        if (isSupported.value && targets2.size) {
          observer = new MutationObserver(callback);
          targets2.forEach((el) => observer.observe(el, mutationOptions));
        }
      },
      { immediate: true, flush: "post" }
    );
    const takeRecords = () => {
      return observer == null ? void 0 : observer.takeRecords();
    };
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop,
      takeRecords
    };
  }
  const ssrWidthSymbol = Symbol("vueuse-ssr-width");
  function useSSRWidth() {
    const ssrWidth = e$1.hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
    return typeof ssrWidth === "number" ? ssrWidth : void 0;
  }
  function useMediaQuery(query, options = {}) {
    const { window: window2 = defaultWindow, ssrWidth = useSSRWidth() } = options;
    const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
    const ssrSupport = e$1.ref(typeof ssrWidth === "number");
    const mediaQuery = e$1.shallowRef();
    const matches = e$1.shallowRef(false);
    const handler = (event) => {
      matches.value = event.matches;
    };
    e$1.watchEffect(() => {
      if (ssrSupport.value) {
        ssrSupport.value = !isSupported.value;
        const queryStrings = e$1.toValue(query).split(",");
        matches.value = queryStrings.some((queryString) => {
          const not = queryString.includes("not all");
          const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
          const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
          let res = Boolean(minWidth || maxWidth);
          if (minWidth && res) {
            res = ssrWidth >= pxValue(minWidth[1]);
          }
          if (maxWidth && res) {
            res = ssrWidth <= pxValue(maxWidth[1]);
          }
          return not ? !res : res;
        });
        return;
      }
      if (!isSupported.value)
        return;
      mediaQuery.value = window2.matchMedia(e$1.toValue(query));
      matches.value = mediaQuery.value.matches;
    });
    useEventListener(mediaQuery, "change", handler, { passive: true });
    return e$1.computed(() => matches.value);
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = /* @__PURE__ */ getHandlers();
  function getHandlers() {
    if (!(globalKey in _global))
      _global[globalKey] = _global[globalKey] || {};
    return _global[globalKey];
  }
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  const StorageSerializers = {
    boolean: {
      read: (v2) => v2 === "true",
      write: (v2) => String(v2)
    },
    object: {
      read: (v2) => JSON.parse(v2),
      write: (v2) => JSON.stringify(v2)
    },
    number: {
      read: (v2) => Number.parseFloat(v2),
      write: (v2) => String(v2)
    },
    any: {
      read: (v2) => v2,
      write: (v2) => String(v2)
    },
    string: {
      read: (v2) => v2,
      write: (v2) => String(v2)
    },
    map: {
      read: (v2) => new Map(JSON.parse(v2)),
      write: (v2) => JSON.stringify(Array.from(v2.entries()))
    },
    set: {
      read: (v2) => new Set(JSON.parse(v2)),
      write: (v2) => JSON.stringify(Array.from(v2))
    },
    date: {
      read: (v2) => new Date(v2),
      write: (v2) => v2.toISOString()
    }
  };
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults2, storage, options = {}) {
    var _a;
    const {
      flush = "pre",
      deep = true,
      listenToStorageChanges = true,
      writeDefaults = true,
      mergeDefaults = false,
      shallow,
      window: window2 = defaultWindow,
      eventFilter,
      onError = (e2) => {
        console.error(e2);
      },
      initOnMounted
    } = options;
    const data = (shallow ? e$1.shallowRef : e$1.ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
    const keyComputed = e$1.computed(() => e$1.toValue(key));
    if (!storage) {
      try {
        storage = getSSRHandler("getDefaultStorage", () => {
          var _a2;
          return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
        })();
      } catch (e2) {
        onError(e2);
      }
    }
    if (!storage)
      return data;
    const rawInit = e$1.toValue(defaults2);
    const type = guessSerializerType(rawInit);
    const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
      data,
      () => write(data.value),
      { flush, deep, eventFilter }
    );
    e$1.watch(keyComputed, () => update(), { flush });
    if (window2 && listenToStorageChanges) {
      tryOnMounted(() => {
        if (storage instanceof Storage)
          useEventListener(window2, "storage", update, { passive: true });
        else
          useEventListener(window2, customStorageEventName, updateFromCustomEvent);
        if (initOnMounted)
          update();
      });
    }
    if (!initOnMounted)
      update();
    function dispatchWriteEvent(oldValue, newValue) {
      if (window2) {
        const payload = {
          key: keyComputed.value,
          oldValue,
          newValue,
          storageArea: storage
        };
        window2.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, {
          detail: payload
        }));
      }
    }
    function write(v2) {
      try {
        const oldValue = storage.getItem(keyComputed.value);
        if (v2 == null) {
          dispatchWriteEvent(oldValue, null);
          storage.removeItem(keyComputed.value);
        } else {
          const serialized = serializer.write(v2);
          if (oldValue !== serialized) {
            storage.setItem(keyComputed.value, serialized);
            dispatchWriteEvent(oldValue, serialized);
          }
        }
      } catch (e2) {
        onError(e2);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
      if (rawValue == null) {
        if (writeDefaults && rawInit != null)
          storage.setItem(keyComputed.value, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (typeof mergeDefaults === "function")
          return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value))
          return { ...rawInit, ...value };
        return value;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    }
    function update(event) {
      if (event && event.storageArea !== storage)
        return;
      if (event && event.key == null) {
        data.value = rawInit;
        return;
      }
      if (event && event.key !== keyComputed.value)
        return;
      pauseWatch();
      try {
        if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
          data.value = read(event);
      } catch (e2) {
        onError(e2);
      } finally {
        if (event)
          e$1.nextTick(resumeWatch);
        else
          resumeWatch();
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    return data;
  }
  function useDraggable(target, options = {}) {
    var _a;
    const {
      pointerTypes,
      preventDefault: preventDefault2,
      stopPropagation,
      exact,
      onMove,
      onEnd,
      onStart,
      initialValue,
      axis = "both",
      draggingElement = defaultWindow,
      containerElement,
      handle: draggingHandle = target,
      buttons = [0]
    } = options;
    const position = e$1.ref(
      (_a = e$1.toValue(initialValue)) != null ? _a : { x: 0, y: 0 }
    );
    const pressedDelta = e$1.ref();
    const filterEvent = (e2) => {
      if (pointerTypes)
        return pointerTypes.includes(e2.pointerType);
      return true;
    };
    const handleEvent = (e2) => {
      if (e$1.toValue(preventDefault2))
        e2.preventDefault();
      if (e$1.toValue(stopPropagation))
        e2.stopPropagation();
    };
    const start = (e2) => {
      var _a2;
      if (!e$1.toValue(buttons).includes(e2.button))
        return;
      if (e$1.toValue(options.disabled) || !filterEvent(e2))
        return;
      if (e$1.toValue(exact) && e2.target !== e$1.toValue(target))
        return;
      const container = e$1.toValue(containerElement);
      const containerRect = (_a2 = container == null ? void 0 : container.getBoundingClientRect) == null ? void 0 : _a2.call(container);
      const targetRect = e$1.toValue(target).getBoundingClientRect();
      const pos = {
        x: e2.clientX - (container ? targetRect.left - containerRect.left + container.scrollLeft : targetRect.left),
        y: e2.clientY - (container ? targetRect.top - containerRect.top + container.scrollTop : targetRect.top)
      };
      if ((onStart == null ? void 0 : onStart(pos, e2)) === false)
        return;
      pressedDelta.value = pos;
      handleEvent(e2);
    };
    const move = (e2) => {
      if (e$1.toValue(options.disabled) || !filterEvent(e2))
        return;
      if (!pressedDelta.value)
        return;
      const container = e$1.toValue(containerElement);
      const targetRect = e$1.toValue(target).getBoundingClientRect();
      let { x, y: y2 } = position.value;
      if (axis === "x" || axis === "both") {
        x = e2.clientX - pressedDelta.value.x;
        if (container)
          x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
      }
      if (axis === "y" || axis === "both") {
        y2 = e2.clientY - pressedDelta.value.y;
        if (container)
          y2 = Math.min(Math.max(0, y2), container.scrollHeight - targetRect.height);
      }
      position.value = {
        x,
        y: y2
      };
      onMove == null ? void 0 : onMove(position.value, e2);
      handleEvent(e2);
    };
    const end = (e2) => {
      if (e$1.toValue(options.disabled) || !filterEvent(e2))
        return;
      if (!pressedDelta.value)
        return;
      pressedDelta.value = void 0;
      onEnd == null ? void 0 : onEnd(position.value, e2);
      handleEvent(e2);
    };
    if (isClient) {
      const config = () => {
        var _a2;
        return {
          capture: (_a2 = options.capture) != null ? _a2 : true,
          passive: !e$1.toValue(preventDefault2)
        };
      };
      useEventListener(draggingHandle, "pointerdown", start, config);
      useEventListener(draggingElement, "pointermove", move, config);
      useEventListener(draggingElement, "pointerup", end, config);
    }
    return {
      ...toRefs(position),
      position,
      isDragging: e$1.computed(() => !!pressedDelta.value),
      style: e$1.computed(
        () => `left:${position.value.x}px;top:${position.value.y}px;`
      )
    };
  }
  function useResizeObserver(target, callback, options = {}) {
    const { window: window2 = defaultWindow, ...observerOptions } = options;
    let observer;
    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const targets = e$1.computed(() => {
      const _targets = e$1.toValue(target);
      return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
    });
    const stopWatch = e$1.watch(
      targets,
      (els) => {
        cleanup();
        if (isSupported.value && window2) {
          observer = new ResizeObserver(callback);
          for (const _el of els) {
            if (_el)
              observer.observe(_el, observerOptions);
          }
        }
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  function useElementBounding(target, options = {}) {
    const {
      reset = true,
      windowResize = true,
      windowScroll = true,
      immediate = true,
      updateTiming = "sync"
    } = options;
    const height = e$1.shallowRef(0);
    const bottom = e$1.shallowRef(0);
    const left = e$1.shallowRef(0);
    const right = e$1.shallowRef(0);
    const top2 = e$1.shallowRef(0);
    const width = e$1.shallowRef(0);
    const x = e$1.shallowRef(0);
    const y2 = e$1.shallowRef(0);
    function recalculate() {
      const el = unrefElement(target);
      if (!el) {
        if (reset) {
          height.value = 0;
          bottom.value = 0;
          left.value = 0;
          right.value = 0;
          top2.value = 0;
          width.value = 0;
          x.value = 0;
          y2.value = 0;
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      height.value = rect.height;
      bottom.value = rect.bottom;
      left.value = rect.left;
      right.value = rect.right;
      top2.value = rect.top;
      width.value = rect.width;
      x.value = rect.x;
      y2.value = rect.y;
    }
    function update() {
      if (updateTiming === "sync")
        recalculate();
      else if (updateTiming === "next-frame")
        requestAnimationFrame(() => recalculate());
    }
    useResizeObserver(target, update);
    e$1.watch(() => unrefElement(target), (ele) => !ele && update());
    useMutationObserver(target, update, {
      attributeFilter: ["style", "class"]
    });
    if (windowScroll)
      useEventListener("scroll", update, { capture: true, passive: true });
    if (windowResize)
      useEventListener("resize", update, { passive: true });
    tryOnMounted(() => {
      if (immediate)
        update();
    });
    return {
      height,
      bottom,
      left,
      right,
      top: top2,
      width,
      x,
      y: y2,
      update
    };
  }
  const DefaultMagicKeysAliasMap = {
    ctrl: "control",
    command: "meta",
    cmd: "meta",
    option: "alt",
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright"
  };
  function useMagicKeys(options = {}) {
    const {
      reactive: useReactive = false,
      target = defaultWindow,
      aliasMap = DefaultMagicKeysAliasMap,
      passive = true,
      onEventFired = noop
    } = options;
    const current = e$1.reactive(/* @__PURE__ */ new Set());
    const obj = {
      toJSON() {
        return {};
      },
      current
    };
    const refs = useReactive ? e$1.reactive(obj) : obj;
    const metaDeps = /* @__PURE__ */ new Set();
    const usedKeys = /* @__PURE__ */ new Set();
    function setRefs(key, value) {
      if (key in refs) {
        if (useReactive)
          refs[key] = value;
        else
          refs[key].value = value;
      }
    }
    function reset() {
      current.clear();
      for (const key of usedKeys)
        setRefs(key, false);
    }
    function updateRefs(e2, value) {
      var _a, _b;
      const key = (_a = e2.key) == null ? void 0 : _a.toLowerCase();
      const code = (_b = e2.code) == null ? void 0 : _b.toLowerCase();
      const values = [code, key].filter(Boolean);
      if (key) {
        if (value)
          current.add(key);
        else
          current.delete(key);
      }
      for (const key2 of values) {
        usedKeys.add(key2);
        setRefs(key2, value);
      }
      if (key === "meta" && !value) {
        metaDeps.forEach((key2) => {
          current.delete(key2);
          setRefs(key2, false);
        });
        metaDeps.clear();
      } else if (typeof e2.getModifierState === "function" && e2.getModifierState("Meta") && value) {
        [...current, ...values].forEach((key2) => metaDeps.add(key2));
      }
    }
    useEventListener(target, "keydown", (e2) => {
      updateRefs(e2, true);
      return onEventFired(e2);
    }, { passive });
    useEventListener(target, "keyup", (e2) => {
      updateRefs(e2, false);
      return onEventFired(e2);
    }, { passive });
    useEventListener("blur", reset, { passive });
    useEventListener("focus", reset, { passive });
    const proxy = new Proxy(
      refs,
      {
        get(target2, prop, rec) {
          if (typeof prop !== "string")
            return Reflect.get(target2, prop, rec);
          prop = prop.toLowerCase();
          if (prop in aliasMap)
            prop = aliasMap[prop];
          if (!(prop in refs)) {
            if (/[+_-]/.test(prop)) {
              const keys2 = prop.split(/[+_-]/g).map((i2) => i2.trim());
              refs[prop] = e$1.computed(() => keys2.map((key) => e$1.toValue(proxy[key])).every(Boolean));
            } else {
              refs[prop] = e$1.shallowRef(false);
            }
          }
          const r2 = Reflect.get(target2, prop, rec);
          return useReactive ? e$1.toValue(r2) : r2;
        }
      }
    );
    return proxy;
  }
  function useWindowSize(options = {}) {
    const {
      window: window2 = defaultWindow,
      initialWidth = Number.POSITIVE_INFINITY,
      initialHeight = Number.POSITIVE_INFINITY,
      listenOrientation = true,
      includeScrollbar = true,
      type = "inner"
    } = options;
    const width = e$1.ref(initialWidth);
    const height = e$1.ref(initialHeight);
    const update = () => {
      if (window2) {
        if (type === "outer") {
          width.value = window2.outerWidth;
          height.value = window2.outerHeight;
        } else if (type === "visual" && window2.visualViewport) {
          const { width: visualViewportWidth, height: visualViewportHeight, scale } = window2.visualViewport;
          width.value = Math.round(visualViewportWidth * scale);
          height.value = Math.round(visualViewportHeight * scale);
        } else if (includeScrollbar) {
          width.value = window2.innerWidth;
          height.value = window2.innerHeight;
        } else {
          width.value = window2.document.documentElement.clientWidth;
          height.value = window2.document.documentElement.clientHeight;
        }
      }
    };
    update();
    tryOnMounted(update);
    const listenerOptions = { passive: true };
    useEventListener("resize", update, listenerOptions);
    if (window2 && type === "visual" && window2.visualViewport) {
      useEventListener(window2.visualViewport, "resize", update, listenerOptions);
    }
    if (listenOrientation) {
      const matches = useMediaQuery("(orientation: portrait)");
      e$1.watch(matches, () => update());
    }
    return { width, height };
  }
  const _hoisted_1$8 = { class: "text-xl font-black text-white" };
  const _hoisted_2$6 = { class: "no-scrollbar flex min-h-[calc(100%-2.5rem)] flex-1 flex-col p-2" };
  const _sfc_main$d = /* @__PURE__ */ e$1.defineComponent({
    __name: "PanelComp",
    props: {
      title: {},
      widthPercent: {},
      heightPercent: {},
      minWidth: {},
      minHeight: {}
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const props = __props;
      const panel = e$1.ref(null);
      const bar = e$1.ref(null);
      const windowSize = useWindowSize({ includeScrollbar: false });
      const { width, height } = useElementBounding(bar, { windowScroll: false });
      const maxPos = e$1.computed(() => {
        return {
          x: windowSize.width.value - width.value,
          y: windowSize.height.value - height.value
        };
      });
      let rAF = 0;
      const { style } = useDraggable(panel, {
        initialValue: {
          x: windowSize.width.value / 2 - Math.max(windowSize.width.value * props.widthPercent / 100, props.minWidth) / 2,
          y: windowSize.height.value / 2 - Math.max(windowSize.height.value * props.heightPercent / 100, props.minHeight) / 2
        },
        handle: e$1.computed(() => bar.value),
        preventDefault: true,
        // 限制拖拽范围
        onMove: (pos) => {
          cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => {
            if (pos.x < 0) {
              pos.x = 0;
            }
            if (pos.y < 0) {
              pos.y = 0;
            }
            if (pos.x > maxPos.value.x) {
              pos.x = maxPos.value.x;
            }
            if (pos.y > maxPos.value.y) {
              pos.y = maxPos.value.y;
            }
          });
        }
      });
      const panelStyle = e$1.computed(() => {
        return {
          width: props.widthPercent + "vw",
          height: props.heightPercent + "vh",
          minWidth: props.minWidth + "px",
          minHeight: props.minHeight + "px"
        };
      });
      return (_ctx, _cache) => {
        return e$1.openBlock(), e$1.createElementBlock("div", {
          ref_key: "panel",
          ref: panel,
          style: e$1.normalizeStyle([panelStyle.value, e$1.unref(style)]),
          class: "no-scrollbar fixed z-[10000000] select-none overflow-auto overscroll-none rounded-xl bg-white shadow-lg will-change-[top,left]"
        }, [
          e$1.createElementVNode("div", {
            ref_key: "bar",
            ref: bar,
            class: "sticky top-0 z-10 w-full cursor-move bg-[#00AEEC] py-1.5 text-center"
          }, [
            e$1.createElementVNode("div", _hoisted_1$8, e$1.toDisplayString(_ctx.title), 1),
            e$1.createElementVNode("i", {
              class: "absolute right-0 top-0 m-1 cursor-pointer text-white hover:rounded-full hover:bg-white hover:bg-opacity-40",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
            }, _cache[1] || (_cache[1] = [
              e$1.createElementVNode("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "2.5",
                stroke: "currentColor",
                class: "size-8"
              }, [
                e$1.createElementVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M6 18 18 6M6 6l12 12"
                })
              ], -1)
            ]))
          ], 512),
          e$1.createElementVNode("div", _hoisted_2$6, [
            e$1.renderSlot(_ctx.$slots, "default")
          ])
        ], 4);
      };
    }
  });
  const _hoisted_1$7 = {
    key: 0,
    class: "mb-1.5"
  };
  const _hoisted_2$5 = { class: "text-sm leading-6 text-orange-900" };
  const _sfc_main$c = /* @__PURE__ */ e$1.defineComponent({
    __name: "DescriptionComp",
    props: {
      description: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        var _a;
        return ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createElementBlock("div", _hoisted_1$7, [
          e$1.createElementVNode("div", _hoisted_2$5, [
            (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(_ctx.description, (line, index) => {
              return e$1.openBlock(), e$1.createElementBlock("div", { key: index }, [
                e$1.createElementVNode("p", null, [
                  _cache[0] || (_cache[0] = e$1.createElementVNode("span", { class: "mr-1" }, "•", -1)),
                  e$1.createTextVNode(e$1.toDisplayString(line), 1)
                ])
              ]);
            }), 128))
          ])
        ])) : e$1.createCommentVNode("", true);
      };
    }
  });
  const _hoisted_1$6 = { class: "flex w-full py-1 hover:bg-blue-50 hover:bg-opacity-50" };
  const _hoisted_2$4 = { class: "ml-2 self-center text-black" };
  const _hoisted_3$2 = { class: "mx-2 mb-2 flex flex-1 flex-col p-1 text-black" };
  const _hoisted_4$1 = { class: "mt-4 flex justify-around" };
  const _sfc_main$b = /* @__PURE__ */ e$1.defineComponent({
    __name: "EditorComp",
    props: {
      type: {},
      id: {},
      name: {},
      description: {},
      editorTitle: {},
      editorDescription: {},
      saveFn: { type: Function }
    },
    setup(__props) {
      const item = __props;
      const panel = e$1.ref(null);
      const isEditorShow = e$1.ref(false);
      const saveSuccess = e$1.ref(false);
      const editorData = e$1.ref("");
      const updateData = () => {
        const val = BiliCleanerStorage.get(item.id, []).join("\n");
        editorData.value = val ? val + "\n" : val;
      };
      const saveData = () => {
        try {
          const data = editorData.value.split("\n").filter((v2) => v2.trim() !== "");
          BiliCleanerStorage.set(item.id, orderedUniq(data));
          saveSuccess.value = true;
          item.saveFn();
          setTimeout(() => {
            saveSuccess.value = false;
          }, 1500);
        } catch (err) {
          error(`EditorComp ${item.id} saveData error`, err);
        }
      };
      return (_ctx, _cache) => {
        var _a;
        return e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, [
          e$1.createElementVNode("label", _hoisted_1$6, [
            e$1.createElementVNode("button", {
              type: "button",
              class: "inline-flex justify-center rounded-md border border-transparent bg-white px-2 py-1 text-sm text-blue-900 outline-none ring-1 ring-gray-300 hover:ring-blue-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-1",
              onClick: _cache[0] || (_cache[0] = () => {
                isEditorShow.value = true;
                updateData();
              })
            }, " 编辑 "),
            e$1.createElementVNode("span", _hoisted_2$4, e$1.toDisplayString(_ctx.name), 1)
          ]),
          ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
            key: 0,
            class: "pl-9",
            description: _ctx.description
          }, null, 8, ["description"])) : e$1.createCommentVNode("", true),
          isEditorShow.value ? (e$1.openBlock(), e$1.createBlock(_sfc_main$d, e$1.mergeProps({
            key: 1,
            ref_key: "panel",
            ref: panel
          }, {
            title: _ctx.editorTitle,
            widthPercent: 28,
            heightPercent: 85,
            minWidth: 360,
            minHeight: 600
          }, {
            onClose: _cache[4] || (_cache[4] = ($event) => isEditorShow.value = false)
          }), {
            default: e$1.withCtx(() => {
              var _a2;
              return [
                e$1.createElementVNode("div", _hoisted_3$2, [
                  ((_a2 = _ctx.editorDescription) == null ? void 0 : _a2.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
                    key: 0,
                    class: "mb-3",
                    description: _ctx.editorDescription
                  }, null, 8, ["description"])) : e$1.createCommentVNode("", true),
                  e$1.withDirectives(e$1.createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => editorData.value = $event),
                    onKeydown: _cache[2] || (_cache[2] = e$1.withModifiers(() => {
                    }, ["stop"])),
                    class: "flex-1 resize-none overscroll-none rounded-md border-2 border-gray-300 p-2 text-[15px] outline-none focus:border-gray-400",
                    style: { "scrollbar-width": "thin", "scrollbar-color": "#999 #00000000" },
                    spellcheck: "false",
                    placeholder: "请输入内容..."
                  }, null, 544), [
                    [e$1.vModelText, editorData.value]
                  ]),
                  e$1.createElementVNode("div", _hoisted_4$1, [
                    e$1.createElementVNode("button", {
                      class: e$1.normalizeClass(["w-24 self-center rounded-md border-2 border-gray-300 bg-white py-0.5 text-center text-lg hover:border-blue-400 hover:bg-blue-50", saveSuccess.value ? "border-green-400 bg-green-50 hover:border-green-400 hover:bg-green-50" : ""]),
                      onClick: saveData
                    }, " 保存 ", 2),
                    e$1.createElementVNode("button", {
                      class: "w-24 self-center rounded-md border-2 border-gray-300 bg-white py-0.5 text-center text-lg hover:border-red-300 hover:bg-red-50",
                      onClick: _cache[3] || (_cache[3] = ($event) => isEditorShow.value = false)
                    }, " 关闭 ")
                  ])
                ])
              ];
            }),
            _: 1
          }, 16)) : e$1.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _hoisted_1$5 = { class: "flex items-center justify-between py-1" };
  const _hoisted_2$3 = { class: "text-black" };
  const _hoisted_3$1 = { class: "relative w-2/5" };
  const _hoisted_4 = { class: "block truncate text-gray-800" };
  const _hoisted_5 = { class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2" };
  const _hoisted_6 = {
    key: 0,
    class: "absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"
  };
  const _sfc_main$a = /* @__PURE__ */ e$1.defineComponent({
    __name: "ListComp",
    props: {
      type: {},
      id: {},
      name: {},
      description: {},
      defaultValue: {},
      disableValue: {},
      options: {}
    },
    setup(__props) {
      const item = __props;
      const options = item.options;
      const currValue = BiliCleanerStorage.get(item.id, item.defaultValue);
      const currOption = options.find((v2) => v2.id === currValue);
      const selectedOption = e$1.ref(currOption ?? options[0]);
      e$1.watch(selectedOption, (newSelected) => {
        try {
          for (const option of options) {
            if (option.id === newSelected.id && newSelected.id !== item.disableValue) {
              document.documentElement.setAttribute(option.id, "");
            } else {
              document.documentElement.removeAttribute(option.id);
            }
          }
          BiliCleanerStorage.set(item.id, newSelected.id);
        } catch (err) {
          error(`ListComp ${item.id} error`, err);
        }
      });
      return (_ctx, _cache) => {
        var _a;
        return e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, [
          e$1.createElementVNode("div", _hoisted_1$5, [
            e$1.createElementVNode("div", _hoisted_2$3, e$1.toDisplayString(_ctx.name), 1),
            e$1.createVNode(e$1.unref(Ie), {
              modelValue: selectedOption.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedOption.value = $event)
            }, {
              default: e$1.withCtx(() => [
                e$1.createElementVNode("div", _hoisted_3$1, [
                  e$1.createVNode(e$1.unref(je), { class: "relative w-full cursor-pointer rounded-lg bg-white px-3 py-1.5 text-left ring-1 ring-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-white/75 sm:text-sm" }, {
                    default: e$1.withCtx(() => [
                      e$1.createElementVNode("span", _hoisted_4, e$1.toDisplayString(selectedOption.value.name), 1),
                      e$1.createElementVNode("span", _hoisted_5, [
                        e$1.createVNode(e$1.unref(render$1), {
                          class: "h-5 w-5 text-gray-400",
                          "aria-hidden": "true"
                        })
                      ])
                    ]),
                    _: 1
                  }),
                  e$1.createVNode(e$1.Transition, {
                    "leave-active-class": "transition duration-100 ease-in",
                    "leave-from-class": "opacity-100",
                    "leave-to-class": "opacity-0"
                  }, {
                    default: e$1.withCtx(() => [
                      e$1.createVNode(e$1.unref(Ae), { class: "no-scrollbar absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm" }, {
                        default: e$1.withCtx(() => [
                          (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(e$1.unref(options), (option, index) => {
                            return e$1.openBlock(), e$1.createBlock(e$1.unref(Fe), {
                              key: index,
                              value: option,
                              as: "template"
                            }, {
                              default: e$1.withCtx(({ active, selected }) => [
                                e$1.createElementVNode("li", {
                                  class: e$1.normalizeClass([
                                    active ? "bg-purple-100 text-black" : "text-gray-900",
                                    "relative cursor-default py-2 pl-10 pr-4 transition-colors duration-200"
                                  ])
                                }, [
                                  e$1.createElementVNode("span", {
                                    class: e$1.normalizeClass([selected ? "font-medium" : "font-normal", "block truncate"])
                                  }, e$1.toDisplayString(option.name), 3),
                                  selected ? (e$1.openBlock(), e$1.createElementBlock("span", _hoisted_6, [
                                    e$1.createVNode(e$1.unref(render$2), {
                                      class: "h-5 w-5",
                                      "aria-hidden": "true"
                                    })
                                  ])) : e$1.createCommentVNode("", true)
                                ], 2)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
            key: 0,
            class: "pl-1",
            description: _ctx.description
          }, null, 8, ["description"])) : e$1.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _hoisted_1$4 = { class: "my-1 flex items-center py-1 text-black" };
  const _hoisted_2$2 = ["step"];
  const _hoisted_3 = {
    key: 0,
    class: "ml-2"
  };
  const _sfc_main$9 = /* @__PURE__ */ e$1.defineComponent({
    __name: "NumberComp",
    props: {
      type: {},
      id: {},
      name: {},
      description: {},
      minValue: {},
      maxValue: {},
      step: {},
      defaultValue: {},
      disableValue: {},
      addonText: {},
      noStyle: { type: Boolean },
      attrName: {},
      fn: { type: Function }
    },
    setup(__props) {
      const item = __props;
      const currValue = e$1.ref(BiliCleanerStorage.get(item.id, item.defaultValue));
      watchThrottled(
        currValue,
        (newValue, oldValue) => {
          var _a;
          try {
            if (newValue > item.maxValue) {
              currValue.value = item.maxValue;
            }
            if (newValue < item.minValue) {
              currValue.value = item.minValue;
            }
            if (oldValue === item.disableValue) {
              if (!item.noStyle) {
                document.documentElement.setAttribute(item.attrName ?? item.id, "");
              }
            }
            if (newValue === item.disableValue) {
              if (!item.noStyle) {
                document.documentElement.removeAttribute(item.attrName ?? item.id);
              }
            } else if (currValue.value !== oldValue) {
              (_a = item.fn(currValue.value)) == null ? void 0 : _a.then().catch((err) => {
                throw err;
              });
            }
            BiliCleanerStorage.set(item.id, currValue.value);
          } catch (err) {
            error(`NumberComp ${item.id} error`, err);
          }
        },
        { throttle: 250, trailing: true }
      );
      return (_ctx, _cache) => {
        var _a;
        return e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, [
          e$1.createElementVNode("div", _hoisted_1$4, [
            e$1.createElementVNode("div", null, e$1.toDisplayString(_ctx.name), 1),
            e$1.withDirectives(e$1.createElementVNode("input", {
              type: "number",
              step: _ctx.step,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currValue.value = $event),
              onKeydown: _cache[1] || (_cache[1] = e$1.withModifiers(() => {
              }, ["stop"])),
              class: "ml-auto block w-1/5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-none invalid:border-2 invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
            }, null, 40, _hoisted_2$2), [
              [e$1.vModelText, currValue.value]
            ]),
            _ctx.addonText ? (e$1.openBlock(), e$1.createElementBlock("div", _hoisted_3, e$1.toDisplayString(_ctx.addonText), 1)) : e$1.createCommentVNode("", true)
          ]),
          ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
            key: 0,
            class: "pl-1",
            description: _ctx.description
          }, null, 8, ["description"])) : e$1.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _hoisted_1$3 = { class: "mb-0.5 mt-1 flex items-center py-1 text-black" };
  const _sfc_main$8 = /* @__PURE__ */ e$1.defineComponent({
    __name: "StringComp",
    props: {
      type: {},
      id: {},
      name: {},
      description: {},
      defaultValue: {},
      disableValue: {},
      noStyle: { type: Boolean },
      attrName: {},
      fn: { type: Function }
    },
    setup(__props) {
      const item = __props;
      const currValue = e$1.ref(BiliCleanerStorage.get(item.id, item.defaultValue));
      watchThrottled(
        currValue,
        (newValue, oldValue) => {
          var _a;
          try {
            if (oldValue === item.disableValue) {
              if (!item.noStyle) {
                document.documentElement.setAttribute(item.attrName ?? item.id, "");
              }
            }
            if (newValue === item.disableValue) {
              if (!item.noStyle) {
                document.documentElement.removeAttribute(item.attrName ?? item.id);
              }
            } else if (currValue.value !== oldValue) {
              (_a = item.fn(currValue.value)) == null ? void 0 : _a.then().catch((err) => {
                throw err;
              });
            }
            BiliCleanerStorage.set(item.id, currValue.value);
          } catch (err) {
            error(`StringComp ${item.id} error`, err);
          }
        },
        { throttle: 250, trailing: true }
      );
      return (_ctx, _cache) => {
        var _a;
        return e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, [
          e$1.createElementVNode("div", _hoisted_1$3, [
            e$1.createElementVNode("div", null, e$1.toDisplayString(_ctx.name), 1),
            e$1.withDirectives(e$1.createElementVNode("input", {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currValue.value = $event),
              onKeydown: _cache[1] || (_cache[1] = e$1.withModifiers(() => {
              }, ["stop"])),
              class: "ml-4 block flex-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm outline-none invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
            }, null, 544), [
              [e$1.vModelText, currValue.value]
            ])
          ]),
          ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
            key: 0,
            description: _ctx.description
          }, null, 8, ["description"])) : e$1.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const _hoisted_1$2 = { class: "flex items-center" };
  const _hoisted_2$1 = { class: "ml-2 flex-1" };
  const _sfc_main$7 = /* @__PURE__ */ e$1.defineComponent({
    __name: "SwitchComp",
    props: {
      type: {},
      id: {},
      name: {},
      description: {},
      defaultEnable: { type: Boolean },
      noStyle: { type: Boolean },
      attrName: {},
      enableFn: { type: Function },
      disableFn: { type: Function },
      enableFnRunAt: {}
    },
    setup(__props) {
      const item = __props;
      const enabled = e$1.ref(BiliCleanerStorage.get(item.id, item.defaultEnable));
      e$1.watch(enabled, () => {
        var _a, _b;
        try {
          if (enabled.value) {
            if (!item.noStyle) {
              document.documentElement.setAttribute(item.attrName ?? item.id, "");
            }
            if (item.enableFn) {
              (_a = item.enableFn()) == null ? void 0 : _a.then().catch();
            }
            BiliCleanerStorage.set(item.id, true);
          } else {
            if (!item.noStyle) {
              document.documentElement.removeAttribute(item.attrName ?? item.id);
            }
            if (item.disableFn) {
              (_b = item.disableFn()) == null ? void 0 : _b.then().catch((err) => {
                throw err;
              });
            }
            BiliCleanerStorage.set(item.id, false);
          }
        } catch (err) {
          error(`SwitchComp ${item.id} error`, err);
        }
      });
      return (_ctx, _cache) => {
        var _a;
        return e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, [
          e$1.createVNode(e$1.unref(oe), { class: "m-0.5 h-fit w-full rounded-lg py-1 hover:bg-blue-50 hover:bg-opacity-50" }, {
            default: e$1.withCtx(() => [
              e$1.createElementVNode("div", _hoisted_1$2, [
                e$1.createVNode(e$1.unref(de), { class: "flex flex-1 flex-row text-black" }, {
                  default: e$1.withCtx(() => [
                    e$1.createVNode(e$1.unref(ue), {
                      modelValue: enabled.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
                      class: e$1.normalizeClass([enabled.value ? "bg-[#00AEEC]" : "bg-gray-200", "relative inline-flex h-6 w-11 items-center rounded-full outline-none transition-colors"])
                    }, {
                      default: e$1.withCtx(() => [
                        e$1.createElementVNode("span", {
                          class: e$1.normalizeClass([enabled.value ? "translate-x-6" : "translate-x-1", "inline-block h-4 w-4 transform rounded-full bg-white transition-transform"])
                        }, null, 2)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "class"]),
                    e$1.createElementVNode("p", _hoisted_2$1, e$1.toDisplayString(_ctx.name), 1)
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }),
          ((_a = _ctx.description) == null ? void 0 : _a.length) ? (e$1.openBlock(), e$1.createBlock(_sfc_main$c, {
            key: 0,
            class: "pl-9",
            description: _ctx.description
          }, null, 8, ["description"])) : e$1.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const href = location.href;
  const host = location.host;
  const pathname = location.pathname;
  const currPage = () => {
    if (href.startsWith("https://www.bilibili.com") && ["/index.html", "/"].includes(pathname)) {
      return "homepage";
    }
    if (href.includes("bilibili.com/video/")) {
      return "video";
    }
    if (href.includes("bilibili.com/v/popular/")) {
      return "popular";
    }
    if (host === "search.bilibili.com") {
      return "search";
    }
    if (host === "t.bilibili.com" || href.includes("bilibili.com/opus/") || href.includes("bilibili.com/v/topic/detail")) {
      return "dynamic";
    }
    if (host === "live.bilibili.com") {
      return "live";
    }
    if (href.includes("bilibili.com/bangumi/play/")) {
      return "bangumi";
    }
    if (href.includes("bilibili.com/list/")) {
      return "playlist";
    }
    if (host === "space.bilibili.com") {
      return "space";
    }
    if (host === "message.bilibili.com") {
      return "message";
    }
    if (!href.includes("bilibili.com/v/popular/") && href.includes("bilibili.com/v/")) {
      return "channel";
    }
    if (/www\.bilibili\.com\/festival\/.*bvid/.test(href)) {
      return "festival";
    }
    if (href.includes("bilibili.com/watchlater")) {
      return "watchlater";
    }
    return "";
  };
  const ans = currPage();
  const isPageHomepage = () => ans === "homepage";
  const isPageVideo = () => ans === "video";
  const isPagePopular = () => ans === "popular";
  const isPageSearch = () => ans === "search";
  const isPageDynamic = () => ans === "dynamic";
  const isPageLive = () => ans === "live";
  const isPageBangumi = () => ans === "bangumi";
  const isPagePlaylist = () => ans === "playlist";
  const isPageFestival = () => ans === "festival";
  const isPageChannel = () => ans === "channel";
  const isPageSpace = () => ans === "space";
  const isPageWatchlater = () => ans === "watchlater";
  const coreCheck = async (elements, sign = true, blackPairs, whitePairs) => {
    let blackCnt = 0;
    try {
      for (const el of elements) {
        const blackTasks = [];
        blackPairs.forEach((pair) => {
          blackTasks.push(pair[0].check(el, pair[1]));
        });
        await Promise.all(blackTasks).then(() => {
          showEle(el);
        }).catch(() => {
          const whiteTasks = [];
          whitePairs == null ? void 0 : whitePairs.forEach((pair) => {
            whiteTasks.push(pair[0].check(el, pair[1]));
          });
          if (whiteTasks.length) {
            Promise.all(whiteTasks).then(() => {
              hideEle(el);
              blackCnt++;
            }).catch(() => {
              showEle(el);
            });
          } else {
            hideEle(el);
            blackCnt++;
          }
        });
        if (sign) {
          el.setAttribute(settings.filterSign, "");
        }
      }
    } catch (err) {
      error("coreCheck error", err);
    }
    return blackCnt;
  };
  const _FetchHook = class _FetchHook {
    constructor() {
      // 根据input和init对input进行预处理
      __publicField(this, "preFnArr", []);
      // 根据input,init,resp做返回resp前的后处理, 如克隆resp
      __publicField(this, "postFnArr", []);
      try {
        this.hook();
      } catch (err) {
        error("hook fetch error", err);
      }
    }
    static getInstance() {
      if (!_FetchHook.instance) {
        _FetchHook.instance = new _FetchHook();
      }
      return _FetchHook.instance;
    }
    addPreFn(fn2) {
      this.preFnArr.push(fn2);
    }
    addPostFn(fn2) {
      this.postFnArr.push(fn2);
    }
    hook() {
      const origFetch = _unsafeWindow.fetch;
      _unsafeWindow.fetch = async (input, init) => {
        try {
          this.preFnArr.forEach((fn2) => {
            input = fn2(input, init);
          });
        } catch {
          return origFetch(input, init);
        }
        let resp = await origFetch(input, init);
        const origResp = resp.clone();
        try {
          for (const fn2 of this.postFnArr) {
            const ans2 = await fn2(input, init, resp);
            if (ans2) {
              resp = ans2;
            }
          }
        } catch (err) {
          error("fetch hook postFnArr", err);
          return origResp;
        }
        return resp;
      };
    }
  };
  __publicField(_FetchHook, "instance");
  let FetchHook = _FetchHook;
  const fetchHook = FetchHook.getInstance();
  const _Shadow = class _Shadow {
    constructor() {
      /**
       * 记录全部shadowRoot节点
       * key: tagName, value: ShadowRoot Set
       */
      __publicField(this, "shadowStore", /* @__PURE__ */ new Map());
      /**
       * 记录需注入的样式
       * key: tagName, value: css+className set
       */
      __publicField(this, "cssStore", /* @__PURE__ */ new Map());
      /**
       * ShadowRoot内的MutationObserver
       * key: tagName, value: MutationObserver set
       */
      __publicField(this, "observerStore", /* @__PURE__ */ new Map());
      try {
        if (isPageVideo() || isPageBangumi() || isPageSpace() || isPageDynamic() || isPagePlaylist()) {
          this.hook();
        }
      } catch (err) {
        error("hook shadow failed", err);
      }
    }
    static getInstance() {
      if (!_Shadow.instance) {
        _Shadow.instance = new _Shadow();
      }
      return _Shadow.instance;
    }
    /**
     * hook attachShadow，创建shadowRoot时注入自定义样式，启用自定义监听
     * 重载ShadowRoot.innerHTML，被调用时注入自定义样式
     */
    hook() {
      const self2 = this;
      const origAttachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(init) {
        const shadowRoot = origAttachShadow.call(this, init);
        const tag = this.tagName;
        const styles = self2.cssStore.get(tag);
        styles == null ? void 0 : styles.forEach((v2) => {
          const style = document.createElement("style");
          style.textContent = v2.css;
          style.setAttribute("bili-cleaner-css", v2.className);
          shadowRoot.appendChild(style);
        });
        if (self2.shadowStore.has(tag)) {
          self2.shadowStore.get(tag).add(shadowRoot);
        } else {
          self2.shadowStore.set(tag, /* @__PURE__ */ new Set([shadowRoot]));
        }
        if (self2.observerStore.has(tag)) {
          for (const [observer, config] of self2.observerStore.get(tag)) {
            observer.observe(shadowRoot, config);
          }
        }
        return shadowRoot;
      };
      const origShadowInnerHTML = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "innerHTML");
      Object.defineProperty(ShadowRoot.prototype, "innerHTML", {
        get() {
          return origShadowInnerHTML.get.call(this);
        },
        set(value) {
          const tagName = this.host.tagName;
          if (tagName && self2.cssStore.has(tagName)) {
            const shadowStyles = self2.cssStore.get(tagName);
            shadowStyles == null ? void 0 : shadowStyles.forEach((v2) => {
              value += `<style bili-cleaner-css="${v2.className}">${v2.css}</style>`;
            });
          }
          origShadowInnerHTML.set.call(this, value);
        }
      });
    }
    /**
     * 新增需要在shadowDOM内注入的样式
     * @param tag tagName
     * @param className css类名
     * @param css 样式
     */
    addShadowStyle(tag, className, css2) {
      tag = tag.toUpperCase();
      const curr = this.cssStore.get(tag);
      if (curr) {
        curr.add({ className, css: css2 });
      } else {
        this.cssStore.set(tag, /* @__PURE__ */ new Set([{ className, css: css2 }]));
      }
      if (this.shadowStore.size) {
        const nodes = this.shadowStore.get(tag);
        nodes == null ? void 0 : nodes.forEach((node) => {
          const style = document.createElement("style");
          style.textContent = css2;
          style.setAttribute("bili-cleaner-css", className);
          node.appendChild(style);
        });
      }
    }
    /**
     * 移除需要在shadowDOM内注入的样式
     * @param tag tagName
     * @param className css类名
     */
    removeShadowStyle(tag, className) {
      tag = tag.toUpperCase();
      const curr = this.cssStore.get(tag);
      if (curr) {
        for (const value of curr) {
          if (value.className === className) {
            curr.delete(value);
            break;
          }
        }
      }
      if (this.shadowStore.size) {
        const nodes = this.shadowStore.get(tag);
        nodes == null ? void 0 : nodes.forEach((node) => {
          node.querySelectorAll(`style[bili-cleaner-css="${className}"]`).forEach((v2) => v2.remove());
        });
      }
    }
    /**
     * 新增shadowRoot内MutationObserver
     * @param tag tagName
     * @param observer MutationObserver
     * @param config Observer配置
     */
    addShadowObserver(tag, observer, config) {
      tag = tag.toUpperCase();
      const curr = this.observerStore.get(tag);
      if (curr) {
        curr.add([observer, config]);
      } else {
        this.observerStore.set(tag, /* @__PURE__ */ new Set([[observer, config]]));
      }
      if (this.shadowStore.size) {
        const nodes = this.shadowStore.get(tag);
        nodes == null ? void 0 : nodes.forEach((node) => {
          observer.observe(node, config);
        });
      }
    }
  };
  /**
   * 单例
   */
  __publicField(_Shadow, "instance");
  let Shadow = _Shadow;
  const ShadowInstance = Shadow.getInstance();
  const bots = [
    "机器工具人",
    // 8455326
    "有趣的程序员",
    // 234978716
    "AI视频小助理",
    // 1141159409
    "AI视频小助理总结一下",
    // 437175450
    "AI笔记侠",
    // 1692825065
    "AI视频助手",
    // 690155730
    "哔哩哔理点赞姬",
    // 689670224
    "课代表猫",
    // 3494380876859618
    "AI课代表呀",
    // 1168527940
    "木几萌Moe",
    // 439438614
    "星崽丨StarZai",
    // 1358327273
    "AI沈阳美食家",
    // 3546376048741135
    "AI头脑风暴",
    // 9868463
    "GPT_5",
    // 358243654
    "Juice_AI",
    // 393788832
    "AI全文总结",
    // 91394217
    "AI视频总结",
    // 473018527
    "AI总结视频",
    // 3546639035795567
    "AI工具集",
    // 605801219
    "Ai的评论",
    // 3546740500204293
    "AI识片酱",
    // 1835753760
    "AI知识总结",
    // 3546765074630961
    "AI小精灵呀"
    // 13339272
  ];
  const botsSet = new Set(bots);
  class BooleanFilter {
    constructor() {
      __publicField(this, "isEnable", false);
    }
    enable() {
      this.isEnable = true;
    }
    disable() {
      this.isEnable = false;
    }
    check(el, selectorFn) {
      return new Promise((resolve, reject) => {
        if (this.isEnable && selectorFn(el) === true) {
          reject();
          return;
        }
        resolve();
      });
    }
  }
  class KeywordFilter {
    constructor() {
      __publicField(this, "isEnable", false);
      __publicField(this, "keywordSet", /* @__PURE__ */ new Set());
      __publicField(this, "mergedRegExp", []);
    }
    enable() {
      this.isEnable = true;
    }
    disable() {
      this.isEnable = false;
    }
    /** 将关键词或正则列表合并为正则 */
    buildRegExp() {
      this.mergedRegExp = [];
      const validNormalParts = [];
      const validBackrefParts = [];
      for (let word of this.keywordSet) {
        word = word.trim();
        if (word === "" || word === "//") {
          continue;
        }
        if (word.startsWith("/") && word.endsWith("/")) {
          word = word.slice(1, -1);
        } else {
          word = word.replace(/[*+?^${}().|[\]\\]/g, "\\$&");
        }
        try {
          new RegExp(word, "ius");
          if (/\\\d|\\k</.test(word.replaceAll("\\\\", ""))) {
            validBackrefParts.push(word);
          } else {
            validNormalParts.push(word);
          }
        } catch {
        }
      }
      try {
        if (validNormalParts.length) {
          this.mergedRegExp.push(new RegExp(validNormalParts.join("|"), "ius"));
        }
        for (const regex of validBackrefParts) {
          this.mergedRegExp.push(new RegExp(regex, "ius"));
        }
      } catch (err) {
        error("keyword filter build RegExp error", err);
      }
    }
    addParam(value) {
      value = value.trim();
      value && this.keywordSet.add(value);
      this.buildRegExp();
    }
    setParam(value) {
      this.keywordSet = new Set(value.map((v2) => v2.trim()).filter((v2) => v2));
      this.buildRegExp();
    }
    check(el, selectorFn) {
      return new Promise((resolve, reject) => {
        if (this.isEnable) {
          let value = selectorFn(el);
          if (typeof value === "string") {
            value = value.trim();
            for (const regex of this.mergedRegExp) {
              if (regex.test(value)) {
                reject();
                return;
              }
            }
          }
        }
        resolve();
      });
    }
  }
  class NumberMinFilter {
    constructor() {
      __publicField(this, "isEnable", false);
      __publicField(this, "threshold", 0);
    }
    enable() {
      this.isEnable = true;
    }
    disable() {
      this.isEnable = false;
    }
    setParam(value) {
      this.threshold = value;
    }
    check(el, selectorFn) {
      return new Promise((resolve, reject) => {
        if (this.isEnable) {
          const value = selectorFn(el);
          if (typeof value === "number" && value < this.threshold) {
            reject();
            return;
          }
        }
        resolve();
      });
    }
  }
  class StringFilter {
    constructor() {
      __publicField(this, "isEnable", false);
      __publicField(this, "strSet", /* @__PURE__ */ new Set());
    }
    enable() {
      this.isEnable = true;
    }
    disable() {
      this.isEnable = false;
    }
    addParam(value) {
      value = value.trim();
      value && this.strSet.add(value);
    }
    setParam(value) {
      this.strSet = new Set(value.map((v2) => v2.trim()).filter((v2) => v2));
    }
    check(el, selectorFn) {
      return new Promise((resolve, reject) => {
        if (this.isEnable) {
          const value = selectorFn(el);
          if (typeof value === "string" && this.strSet.has(value.trim())) {
            reject();
            return;
          }
        }
        resolve();
      });
    }
  }
  class CommentUsernameFilter extends StringFilter {
  }
  class CommentContentFilter extends KeywordFilter {
  }
  class CommentLevelFilter extends NumberMinFilter {
  }
  class CommentBotFilter extends StringFilter {
  }
  class CommentCallBotFilter extends BooleanFilter {
  }
  class CommentCallUserFilter extends BooleanFilter {
  }
  class CommentCallUserNoReplyFilter extends BooleanFilter {
  }
  class CommentCallUserOnlyFilter extends BooleanFilter {
  }
  class CommentCallUserOnlyNoReplyFilter extends BooleanFilter {
  }
  class CommentIsUpFilter extends BooleanFilter {
  }
  class CommentIsPinFilter extends BooleanFilter {
  }
  class CommentIsNoteFilter extends BooleanFilter {
  }
  class CommentIsLinkFilter extends BooleanFilter {
  }
  class CommentIsMeFilter extends BooleanFilter {
  }
  const GM_KEYS$7 = {
    black: {
      username: {
        statusKey: "video-comment-username-filter-status",
        valueKey: "global-comment-username-filter-value"
      },
      content: {
        statusKey: "video-comment-content-filter-status",
        valueKey: "global-comment-content-filter-value"
      },
      level: {
        statusKey: "video-comment-level-filter-status",
        valueKey: "global-comment-level-filter-value"
      },
      bot: {
        statusKey: "video-comment-bot-filter-status"
      },
      callBot: {
        statusKey: "video-comment-call-bot-filter-status"
      },
      callUser: {
        statusKey: "video-comment-call-user-filter-status"
      },
      callUserNoReply: {
        statusKey: "video-comment-call-user-noreply-filter-status"
      },
      callUserOnly: {
        statusKey: "video-comment-call-user-only-filter-status"
      },
      callUserOnlyNoReply: {
        statusKey: "video-comment-call-user-only-noreply-filter-status"
      },
      isAD: {
        statusKey: "video-comment-ad-filter-status"
      }
    },
    white: {
      root: {
        statusKey: "video-comment-root-whitelist-status"
      },
      sub: {
        statusKey: "video-comment-sub-whitelist-status"
      },
      isUp: {
        statusKey: "video-comment-uploader-whitelist-status"
      },
      isPin: {
        statusKey: "video-comment-pinned-whitelist-status"
      },
      isNote: {
        statusKey: "video-comment-note-whitelist-status"
      },
      isLink: {
        statusKey: "video-comment-link-whitelist-status"
      }
    }
  };
  const selectorFns$7 = {
    root: {
      username: (comment) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.member) == null ? void 0 : _b.uname) == null ? void 0 : _c.trim();
      },
      content: (comment) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.replace(/@[^@\s]+/g, " ").trim();
      },
      callBot: (comment) => {
        var _a, _b;
        const members = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.members;
        if (members == null ? void 0 : members.length) {
          return members.some((v2) => botsSet.has(v2.uname));
        }
        return false;
      },
      callUser: (comment) => {
        var _a, _b, _c;
        return !!((_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.members) == null ? void 0 : _c[0]);
      },
      callUserNoReply: (comment) => {
        var _a, _b, _c, _d;
        if (((_a = comment.__data) == null ? void 0 : _a.rcount) !== 0) {
          return false;
        }
        return !!((_d = (_c = (_b = comment.__data) == null ? void 0 : _b.content) == null ? void 0 : _c.members) == null ? void 0 : _d[0]);
      },
      callUserOnly: (comment) => {
        var _a, _b, _c;
        return ((_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.replace(/@[^@\s]+/g, " ").trim()) === "";
      },
      callUserOnlyNoReply: (comment) => {
        var _a, _b, _c, _d;
        if (((_a = comment.__data) == null ? void 0 : _a.rcount) !== 0) {
          return false;
        }
        return ((_d = (_c = (_b = comment.__data) == null ? void 0 : _b.content) == null ? void 0 : _c.message) == null ? void 0 : _d.replace(/@[^@\s]+/g, " ").trim()) === "";
      },
      level: (comment) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.member) == null ? void 0 : _b.level_info) == null ? void 0 : _c.current_level;
      },
      isUp: (comment) => {
        var _a;
        const mid = (_a = comment.__data) == null ? void 0 : _a.mid;
        const upMid = comment.__upMid;
        return typeof mid === "number" && mid === upMid;
      },
      isPin: (comment) => {
        var _a, _b;
        return !!((_b = (_a = comment.__data) == null ? void 0 : _a.reply_control) == null ? void 0 : _b.is_up_top);
      },
      isNote: (comment) => {
        var _a, _b;
        return !!((_b = (_a = comment.__data) == null ? void 0 : _a.reply_control) == null ? void 0 : _b.is_note_v2);
      },
      isLink: (comment) => {
        var _a, _b, _c, _d;
        const jump_url = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.jump_url;
        if (jump_url) {
          for (const k2 of Object.keys(jump_url)) {
            if (!((_d = (_c = jump_url[k2]) == null ? void 0 : _c.pc_url) == null ? void 0 : _d.includes("search.bilibili.com"))) {
              return true;
            }
          }
        }
        return false;
      },
      // 自己发布 or @自己 的评论
      isMe: (comment) => {
        var _a, _b, _c, _d, _e, _f;
        const me2 = (_a = comment.__user) == null ? void 0 : _a.uname;
        if (!me2) {
          return false;
        }
        if (((_c = (_b = comment.__data) == null ? void 0 : _b.member) == null ? void 0 : _c.uname) === me2 || ((_f = (_e = (_d = comment.__data) == null ? void 0 : _d.content) == null ? void 0 : _e.message) == null ? void 0 : _f.includes(`@${me2}`))) {
          return true;
        }
        return false;
      }
    },
    sub: {
      username: (comment) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.member) == null ? void 0 : _b.uname) == null ? void 0 : _c.trim();
      },
      content: (comment) => {
        var _a, _b, _c, _d, _e;
        return (_e = (_d = (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.trim()) == null ? void 0 : _d.replace(/^回复\s?@[^@\s]+\s?:/, "")) == null ? void 0 : _e.replace(/@[^@\s]+/g, " ").trim();
      },
      callBot: (comment) => {
        var _a, _b;
        const members = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.members;
        if (members.length) {
          return members.some((v2) => botsSet.has(v2.uname));
        }
        return false;
      },
      callUser: (comment) => {
        var _a, _b, _c, _d, _e;
        return !!((_e = (_d = (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.trim()) == null ? void 0 : _d.replace(/^回复\s?@[^@\s]+\s?:/, "")) == null ? void 0 : _e.match(/@[^@\s]+/));
      },
      callUserNoReply: (comment) => {
        var _a, _b, _c, _d, _e;
        return !!((_e = (_d = (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.trim()) == null ? void 0 : _d.replace(/^回复\s?@[^@\s]+\s?:/, "")) == null ? void 0 : _e.match(/@[^@\s]+/));
      },
      callUserOnly: (comment) => {
        var _a, _b, _c, _d, _e;
        return ((_e = (_d = (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.trim()) == null ? void 0 : _d.replace(/^回复\s?@[^@\s]+\s?:/, "")) == null ? void 0 : _e.replace(/@[^@\s]+/g, " ").trim()) === "";
      },
      callUserOnlyNoReply: (comment) => {
        var _a, _b, _c, _d, _e;
        return ((_e = (_d = (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.message) == null ? void 0 : _c.trim()) == null ? void 0 : _d.replace(/^回复\s?@[^@\s]+\s?:/, "")) == null ? void 0 : _e.replace(/@[^@\s]+/g, " ").trim()) === "";
      },
      level: (comment) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = comment.__data) == null ? void 0 : _a.member) == null ? void 0 : _b.level_info) == null ? void 0 : _c.current_level;
      },
      isUp: (comment) => {
        var _a;
        const mid = (_a = comment.__data) == null ? void 0 : _a.mid;
        const upMid = comment.__upMid;
        return typeof mid === "number" && mid === upMid;
      },
      isLink: (comment) => {
        var _a, _b, _c, _d;
        const urls = (_b = (_a = comment.__data) == null ? void 0 : _a.content) == null ? void 0 : _b.jump_url;
        if (urls) {
          for (const k2 of Object.keys(urls)) {
            if (!((_d = (_c = urls[k2]) == null ? void 0 : _c.pc_url) == null ? void 0 : _d.includes("search.bilibili.com"))) {
              return true;
            }
          }
        }
        return false;
      },
      // 自己发布 or @自己 的评论
      isMe: (comment) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const me2 = (_a = comment.__user) == null ? void 0 : _a.uname;
        if (!me2) {
          return false;
        }
        if (((_c = (_b = comment.__data) == null ? void 0 : _b.member) == null ? void 0 : _c.uname) === me2 || ((_g = (_f = (_e = (_d = comment.__data) == null ? void 0 : _d.content) == null ? void 0 : _e.message) == null ? void 0 : _f.trim()) == null ? void 0 : _g.replace(/^回复\s?@[^@\s]+\s?:/, "").includes(`@${me2}`))) {
          return true;
        }
        return false;
      }
    }
  };
  let isRootWhite = false;
  let isSubWhite = false;
  class CommentFilterCommon {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "commentUsernameFilter", new CommentUsernameFilter());
      __publicField(this, "commentContentFilter", new CommentContentFilter());
      __publicField(this, "commentLevelFilter", new CommentLevelFilter());
      __publicField(this, "commentBotFilter", new CommentBotFilter());
      __publicField(this, "commentCallBotFilter", new CommentCallBotFilter());
      __publicField(this, "commentCallUserFilter", new CommentCallUserFilter());
      __publicField(this, "commentCallUserNoReplyFilter", new CommentCallUserNoReplyFilter());
      __publicField(this, "commentCallUserOnlyFilter", new CommentCallUserOnlyFilter());
      __publicField(this, "commentCallUserOnlyNoReplyFilter", new CommentCallUserOnlyNoReplyFilter());
      // 白名单
      __publicField(this, "commentIsUpFilter", new CommentIsUpFilter());
      __publicField(this, "commentIsPinFilter", new CommentIsPinFilter());
      __publicField(this, "commentIsNoteFilter", new CommentIsNoteFilter());
      __publicField(this, "commentIsLinkFilter", new CommentIsLinkFilter());
      __publicField(this, "commentIsMeFilter", new CommentIsMeFilter());
    }
    init() {
      this.commentUsernameFilter.setParam(BiliCleanerStorage.get(GM_KEYS$7.black.username.valueKey, []));
      this.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS$7.black.content.valueKey, []));
      this.commentLevelFilter.setParam(BiliCleanerStorage.get(GM_KEYS$7.black.level.valueKey, 0));
      this.commentBotFilter.setParam(bots);
    }
    /**
     * 检测一级评论
     * @param mode full全量，incr增量
     * @returns
     */
    async checkRoot(mode) {
      const timer = performance.now();
      let revertAll = false;
      if (!(this.commentUsernameFilter.isEnable || this.commentContentFilter.isEnable || this.commentLevelFilter.isEnable || this.commentBotFilter.isEnable || this.commentCallBotFilter.isEnable || this.commentCallUserFilter.isEnable || this.commentCallUserNoReplyFilter.isEnable || this.commentCallUserOnlyFilter.isEnable || this.commentCallUserOnlyNoReplyFilter.isEnable)) {
        revertAll = true;
      }
      let rootComments = [];
      if (ShadowInstance.shadowStore.has("BILI-COMMENT-THREAD-RENDERER")) {
        rootComments = Array.from(ShadowInstance.shadowStore.get("BILI-COMMENT-THREAD-RENDERER")).map(
          (v2) => v2.host
        );
        if (mode === "incr") {
          rootComments = rootComments.filter((v2) => !v2.hasAttribute(settings.filterSign));
        }
      }
      if (!rootComments.length) {
        return;
      }
      if (settings.enableDebugFilter) {
        rootComments.forEach((v2) => {
          debugFilter(
            [
              `CommentFilterCommon rootComments`,
              `username: ${selectorFns$7.root.username(v2)}`,
              `content: ${selectorFns$7.root.content(v2)}`,
              `callUser: ${selectorFns$7.root.callUser(v2)}`,
              `callUserNoReply: ${selectorFns$7.root.callUserNoReply(v2)}`,
              `callUserOnly: ${selectorFns$7.root.callUserOnly(v2)}`,
              `callUserOnlyNoReply: ${selectorFns$7.root.callUserOnlyNoReply(v2)}`,
              `level: ${selectorFns$7.root.level(v2)}`,
              `isUp: ${selectorFns$7.root.isUp(v2)}`,
              `isPin: ${selectorFns$7.root.isPin(v2)}`,
              `isNote: ${selectorFns$7.root.isNote(v2)}`,
              `isLink: ${selectorFns$7.root.isLink(v2)}`,
              `isMe: ${selectorFns$7.root.isMe(v2)}`
            ].join("\n")
          );
        });
      }
      if (isRootWhite || revertAll) {
        rootComments.forEach((el) => showEle(el));
        return;
      }
      const blackPairs = [];
      this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns$7.root.username]);
      this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns$7.root.content]);
      this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns$7.root.level]);
      this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns$7.root.username]);
      this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns$7.root.callBot]);
      this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns$7.root.callUser]);
      this.commentCallUserNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns$7.root.callUserNoReply]);
      this.commentCallUserOnlyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyFilter, selectorFns$7.root.callUserOnly]);
      this.commentCallUserOnlyNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns$7.root.callUserOnlyNoReply]);
      const whitePairs = [];
      this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns$7.root.isUp]);
      this.commentIsPinFilter.isEnable && whitePairs.push([this.commentIsPinFilter, selectorFns$7.root.isPin]);
      this.commentIsNoteFilter.isEnable && whitePairs.push([this.commentIsNoteFilter, selectorFns$7.root.isNote]);
      this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns$7.root.isLink]);
      this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns$7.root.isMe]);
      const rootBlackCnt = await coreCheck(rootComments, true, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(
        `CommentFilterCommon hide ${rootBlackCnt} in ${rootComments.length} root comments, mode=${mode}, time=${time}`
      );
    }
    /**
     * 检测二级评论
     * @param mode full全量，incr增量
     * @returns
     */
    async checkSub(mode) {
      const timer = performance.now();
      let revertAll = false;
      if (!(this.commentUsernameFilter.isEnable || this.commentContentFilter.isEnable || this.commentLevelFilter.isEnable || this.commentBotFilter.isEnable || this.commentCallBotFilter.isEnable || this.commentCallUserFilter.isEnable || this.commentCallUserNoReplyFilter.isEnable || this.commentCallUserOnlyFilter.isEnable || this.commentCallUserOnlyNoReplyFilter.isEnable)) {
        revertAll = true;
      }
      let subComments = [];
      if (ShadowInstance.shadowStore.has("BILI-COMMENT-REPLY-RENDERER")) {
        subComments = Array.from(ShadowInstance.shadowStore.get("BILI-COMMENT-REPLY-RENDERER")).map(
          (v2) => v2.host
        );
        if (mode === "incr") {
          subComments = subComments.filter((v2) => !v2.hasAttribute(settings.filterSign));
        }
      }
      if (!subComments.length) {
        return;
      }
      if (settings.enableDebugFilter) {
        subComments.forEach((v2) => {
          debugFilter(
            [
              `CommentFilterCommon subComments`,
              `username: ${selectorFns$7.sub.username(v2)}`,
              `content: ${selectorFns$7.sub.content(v2)}`,
              `callUser: ${selectorFns$7.sub.callUser(v2)}`,
              `callUserNoReply: ${selectorFns$7.sub.callUserNoReply(v2)}`,
              `callUserOnly: ${selectorFns$7.sub.callUserOnly(v2)}`,
              `callUserOnlyNoReply: ${selectorFns$7.sub.callUserOnlyNoReply(v2)}`,
              `level: ${selectorFns$7.sub.level(v2)}`,
              `isUp: ${selectorFns$7.sub.isUp(v2)}`,
              `isLink: ${selectorFns$7.sub.isLink(v2)}`,
              `isMe: ${selectorFns$7.sub.isMe(v2)}`
            ].join("\n")
          );
        });
      }
      if (isSubWhite || revertAll) {
        subComments.forEach((el) => showEle(el));
        return;
      }
      const blackPairs = [];
      this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns$7.sub.username]);
      this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns$7.sub.content]);
      this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns$7.sub.level]);
      this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns$7.sub.username]);
      this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns$7.sub.callBot]);
      this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns$7.sub.callUser]);
      this.commentCallUserNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns$7.sub.callUserNoReply]);
      this.commentCallUserOnlyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyFilter, selectorFns$7.sub.callUserOnly]);
      this.commentCallUserOnlyNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns$7.sub.callUserOnlyNoReply]);
      const whitePairs = [];
      this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns$7.sub.isUp]);
      this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns$7.sub.isLink]);
      this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns$7.sub.isMe]);
      const subBlackCnt = await coreCheck(subComments, false, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(
        `CommentFilterCommon hide ${subBlackCnt} in ${subComments.length} sub comments, mode=${mode}, time=${time}`
      );
    }
    check(mode) {
      this.checkRoot(mode).then().catch((err) => {
        error(`CommentFilterCommon checkRoot mode=${mode} error`, err);
      });
      this.checkSub(mode).then().catch((err) => {
        error(`CommentFilterCommon checkSub mode=${mode} error`, err);
      });
    }
    /**
     * 监听一级/二级评论container
     * 使用同一Observer监视所有二级评论上级节点，所有变化只触发一次回调
     */
    observe() {
      ShadowInstance.addShadowObserver(
        "BILI-COMMENTS",
        new MutationObserver(() => {
          this.checkRoot("incr").then().catch();
        }),
        {
          subtree: true,
          childList: true
        }
      );
      ShadowInstance.addShadowObserver(
        "BILI-COMMENT-REPLIES-RENDERER",
        new MutationObserver(() => {
          this.checkSub("full").then().catch();
        }),
        {
          subtree: true,
          childList: true
        }
      );
    }
  }
  const mainFilter$7 = new CommentFilterCommon();
  const commentFilterCommonEntry = async () => {
    mainFilter$7.init();
    mainFilter$7.commentIsMeFilter.enable();
    mainFilter$7.observe();
  };
  const commentFilterCommonGroups = [
    {
      name: "评论用户过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$7.black.username.statusKey,
          name: "启用 评论用户过滤 (右键单击用户名)",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentUsernameFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentUsernameFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "editor",
          id: GM_KEYS$7.black.username.valueKey,
          name: "编辑 评论用户黑名单",
          description: ["本黑名单与UP主黑名单互不影响", "右键屏蔽的用户会出现在首行"],
          editorTitle: "评论区 用户黑名单",
          editorDescription: ["每行一个用户名，保存时自动去重"],
          saveFn: async () => {
            mainFilter$7.commentUsernameFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$7.black.username.valueKey, [])
            );
            mainFilter$7.check("full");
          }
        }
      ]
    },
    {
      name: "评论内容过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$7.black.content.statusKey,
          name: "启用 评论关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentContentFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentContentFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "editor",
          id: GM_KEYS$7.black.content.valueKey,
          name: "编辑 评论关键词黑名单",
          editorTitle: "评论关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$7.commentContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS$7.black.content.valueKey, []));
            mainFilter$7.check("full");
          }
        }
      ]
    },
    {
      name: "按类型过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$7.black.callBot.statusKey,
          name: "过滤 召唤AI的评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentCallBotFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentCallBotFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.bot.statusKey,
          name: "过滤 AI发布的评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentBotFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentBotFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.isAD.statusKey,
          name: "过滤 带货评论 (实验功能)",
          noStyle: true,
          enableFn: () => {
            fetchHook.addPostFn(
              async (input, init, resp) => {
                var _a, _b, _c, _d, _e;
                if (!resp) {
                  return;
                }
                if (typeof input === "string" && ((_a = init == null ? void 0 : init.method) == null ? void 0 : _a.toUpperCase()) === "GET" && input.includes("api.bilibili.com/x/v2/reply/wbi/main")) {
                  try {
                    const respData = await resp.clone().json();
                    const msg = (_e = (_d = (_c = (_b = respData == null ? void 0 : respData.data) == null ? void 0 : _b.top) == null ? void 0 : _c.upper) == null ? void 0 : _d.content) == null ? void 0 : _e.message;
                    if (msg && /(bili2233\.cn|b23\.tv)\/(mall-|cm-)|领券|gaoneng\.bilibili\.com/.test(msg)) {
                      respData.data.top = null;
                      respData.data.top_replies = null;
                      return new Response(JSON.stringify(respData), {
                        status: resp.status,
                        statusText: resp.statusText,
                        headers: resp.headers
                      });
                    }
                  } catch {
                    return resp;
                  }
                  return resp;
                }
              }
            );
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.callUserOnly.statusKey,
          name: "过滤 只含 @其他用户 的全部评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentCallUserOnlyFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentCallUserOnlyFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.callUserOnlyNoReply.statusKey,
          name: "过滤 只含 @其他用户 的无回复评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentCallUserOnlyNoReplyFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentCallUserOnlyNoReplyFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.callUser.statusKey,
          name: "过滤 包含 @其他用户 的全部评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentCallUserFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentCallUserFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.black.callUserNoReply.statusKey,
          name: "过滤 包含 @其他用户 的无回复评论",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentCallUserNoReplyFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentCallUserNoReplyFilter.disable();
            mainFilter$7.check("full");
          }
        }
      ]
    },
    {
      name: "等级过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$7.black.level.statusKey,
          name: "启用 用户等级过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentLevelFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentLevelFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "number",
          id: GM_KEYS$7.black.level.valueKey,
          name: "设定最低等级 (0~6)",
          minValue: 0,
          maxValue: 6,
          step: 1,
          defaultValue: 0,
          disableValue: 0,
          fn: (value) => {
            mainFilter$7.commentLevelFilter.setParam(value);
            mainFilter$7.check("full");
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$7.white.root.statusKey,
          name: "一级评论(主评论) 免过滤",
          noStyle: true,
          enableFn: () => {
            isRootWhite = true;
            mainFilter$7.check("full");
          },
          disableFn: () => {
            isRootWhite = false;
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.white.sub.statusKey,
          name: "二级评论(回复) 免过滤",
          noStyle: true,
          enableFn: () => {
            isSubWhite = true;
            mainFilter$7.check("full");
          },
          disableFn: () => {
            isSubWhite = false;
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.white.isUp.statusKey,
          name: "UP主的评论 免过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentIsUpFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentIsUpFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.white.isPin.statusKey,
          name: "置顶评论 免过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentIsPinFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentIsPinFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.white.isNote.statusKey,
          name: "笔记/图片评论 免过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentIsNoteFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentIsNoteFilter.disable();
            mainFilter$7.check("full");
          }
        },
        {
          type: "switch",
          id: GM_KEYS$7.white.isLink.statusKey,
          name: "含超链接的评论 免过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$7.commentIsLinkFilter.enable();
            mainFilter$7.check("full");
          },
          disableFn: () => {
            mainFilter$7.commentIsLinkFilter.disable();
            mainFilter$7.check("full");
          }
        }
      ]
    }
  ];
  const commentFilterCommonHandler = (target) => {
    var _a, _b;
    if (!(isPageVideo() || isPagePlaylist() || isPageBangumi() || isPageDynamic() || isPageSpace())) {
      return [];
    }
    const menus = [];
    if (((_a = target.parentElement) == null ? void 0 : _a.id) === "user-name" || target.classList.contains("user-name") || target.classList.contains("sub-user-name")) {
      const username = (_b = target.textContent) == null ? void 0 : _b.trim();
      if (username && mainFilter$7.commentUsernameFilter.isEnable) {
        menus.push({
          name: `屏蔽用户：${username}`,
          fn: async () => {
            try {
              mainFilter$7.commentUsernameFilter.addParam(username);
              mainFilter$7.check("full");
              const arr = BiliCleanerStorage.get(GM_KEYS$7.black.username.valueKey, []);
              arr.unshift(username);
              BiliCleanerStorage.set(GM_KEYS$7.black.username.valueKey, orderedUniq(arr));
            } catch (err) {
              error(`commentFilterCommonHandler add username ${username} failed`, err);
            }
          }
        });
      }
    }
    return menus;
  };
  class DynUploaderFilter extends StringFilter {
  }
  class DynDurationFilter extends NumberMinFilter {
  }
  class DynVideoTitleFilter extends KeywordFilter {
  }
  class DynContentFilter extends KeywordFilter {
  }
  const GM_KEYS$6 = {
    black: {
      uploader: {
        statusKey: "dyn-uploader-filter-status",
        valueKey: "dyn-uploader-filter-value"
      },
      duration: {
        statusKey: "dyn-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      title: {
        statusKey: "dyn-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      },
      content: {
        statusKey: "dyn-content-keyword-filter-status",
        valueKey: "global-content-keyword-filter-value"
      }
    }
  };
  let isAllDyn = true;
  const selectorFns$6 = {
    uploader: (dyn) => {
      var _a, _b;
      if (!isAllDyn) {
        return void 0;
      }
      return (_b = (_a = dyn.querySelector(".bili-dyn-title__text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    duration: (dyn) => {
      var _a, _b;
      const time = (_b = (_a = dyn.querySelector(".bili-dyn-card-video__cover-shadow .duration-time")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return time ? convertTimeToSec(time) : void 0;
    },
    title: (dyn) => {
      var _a, _b;
      return (_b = (_a = dyn.querySelector(".bili-dyn-card-video__title")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    content: (dyn) => {
      return Array.from(
        dyn.querySelectorAll(
          ".bili-dyn-content :is(.dyn-card-opus__title, .bili-rich-text__content > span:not(.bili-rich-text-module.at))"
        )
      ).map((v2) => {
        var _a;
        return (_a = v2 == null ? void 0 : v2.textContent) == null ? void 0 : _a.trim();
      }).filter((v2) => v2 == null ? void 0 : v2.trim()).join(" ");
    }
  };
  class DynamicFilterDynamic {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "dynUploaderFilter", new DynUploaderFilter());
      __publicField(this, "dynDurationFilter", new DynDurationFilter());
      __publicField(this, "dynVideoTitleFilter", new DynVideoTitleFilter());
      __publicField(this, "dynContentFilter", new DynContentFilter());
    }
    init() {
      this.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.uploader.valueKey, []));
      this.dynDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.duration.valueKey, 0));
      this.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.title.valueKey, []));
      this.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.content.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.dynUploaderFilter.isEnable || this.dynDurationFilter.isEnable || this.dynVideoTitleFilter.isEnable || this.dynContentFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      isAllDyn = !!this.target.querySelector(".bili-dyn-list-tabs");
      let selector = `.bili-dyn-list__item`;
      if (mode === "incr") {
        selector += `:not([${settings.filterSign}])`;
      }
      const dyns = Array.from(this.target.querySelectorAll(selector));
      if (!dyns.length) {
        return;
      }
      if (revertAll) {
        dyns.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        dyns.forEach((v2) => {
          debugFilter(
            [
              `DynamicFilterDynamic`,
              `uploader: ${selectorFns$6.uploader(v2)}`,
              `title: ${selectorFns$6.title(v2)}`,
              `duration: ${selectorFns$6.duration(v2)}`,
              `content: ${selectorFns$6.content(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns$6.uploader]);
      this.dynDurationFilter.isEnable && blackPairs.push([this.dynDurationFilter, selectorFns$6.duration]);
      this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns$6.title]);
      this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns$6.content]);
      const blackCnt = await coreCheck(dyns, true, blackPairs, []);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`DynamicFilterDynamic hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("DynamicFilterDynamic check full error", err);
      });
    }
    checkIncr() {
      this.check("incr").then().catch((err) => {
        error("DynamicFilterDynamic check incr error", err);
      });
    }
    observe() {
      waitForEle(
        document,
        ".bili-dyn-home--member",
        (node) => node.className === "bili-dyn-home--member"
      ).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("DynamicFilterDynamic target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkIncr();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter$6 = new DynamicFilterDynamic();
  const dynamicFilterDynamicEntry = async () => {
    mainFilter$6.init();
    mainFilter$6.observe();
  };
  const dynamicFilterDynamicGroups = [
    {
      name: "动态发布人过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$6.black.uploader.statusKey,
          name: "启用 动态发布人过滤 (右键单击用户名)",
          noStyle: true,
          enableFn: () => {
            mainFilter$6.dynUploaderFilter.enable();
            mainFilter$6.checkFull();
          },
          disableFn: () => {
            mainFilter$6.dynUploaderFilter.disable();
            mainFilter$6.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$6.black.uploader.valueKey,
          name: "编辑 动态发布用户黑名单",
          editorTitle: "动态发布用户 黑名单",
          description: ["右键屏蔽的用户会出现在首行"],
          editorDescription: ["一行一个用户名，保存时自动去重"],
          saveFn: async () => {
            mainFilter$6.dynUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.uploader.valueKey, []));
            mainFilter$6.checkFull();
          }
        }
      ]
    },
    {
      name: "动态内视频时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$6.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$6.dynDurationFilter.enable();
            mainFilter$6.checkFull();
          },
          disableFn: () => {
            mainFilter$6.dynDurationFilter.disable();
            mainFilter$6.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$6.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$6.dynDurationFilter.setParam(value);
            mainFilter$6.checkFull();
          }
        }
      ]
    },
    {
      name: "动态内视频标题过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$6.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$6.dynVideoTitleFilter.enable();
            mainFilter$6.checkFull();
          },
          disableFn: () => {
            mainFilter$6.dynVideoTitleFilter.disable();
            mainFilter$6.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$6.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$6.dynVideoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.title.valueKey, []));
            mainFilter$6.checkFull();
          }
        }
      ]
    },
    {
      name: "动态内容过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$6.black.content.statusKey,
          name: "启用 动态内容关键词过滤",
          description: ["包含被转发动态内容", "不含动态内视频信息"],
          noStyle: true,
          enableFn: () => {
            mainFilter$6.dynContentFilter.enable();
            mainFilter$6.checkFull();
          },
          disableFn: () => {
            mainFilter$6.dynContentFilter.disable();
            mainFilter$6.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$6.black.content.valueKey,
          name: "编辑 动态内容关键词黑名单",
          editorTitle: "动态内容关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$6.dynContentFilter.setParam(BiliCleanerStorage.get(GM_KEYS$6.black.content.valueKey, []));
            mainFilter$6.checkFull();
          }
        }
      ]
    }
  ];
  const dynamicFilterDynamicHandler = (target) => {
    var _a;
    if (!isPageDynamic()) {
      return [];
    }
    const menus = [];
    if (target.classList.contains("bili-dyn-title__text")) {
      const uploader = (_a = target.textContent) == null ? void 0 : _a.trim();
      if (uploader && mainFilter$6.dynUploaderFilter.isEnable) {
        menus.push({
          name: `隐藏用户动态：${uploader}`,
          fn: async () => {
            try {
              mainFilter$6.dynUploaderFilter.addParam(uploader);
              mainFilter$6.checkFull();
              const arr = BiliCleanerStorage.get(GM_KEYS$6.black.uploader.valueKey, []);
              arr.unshift(uploader);
              BiliCleanerStorage.set(GM_KEYS$6.black.uploader.valueKey, orderedUniq(arr));
            } catch (err) {
              error(`dynamicFilterDynamicHandler add uploader ${uploader} failed`, err);
            }
          }
        });
      }
    }
    return menus;
  };
  class NumberMaxFilter {
    constructor() {
      __publicField(this, "isEnable", false);
      __publicField(this, "threshold", 0);
    }
    enable() {
      this.isEnable = true;
    }
    disable() {
      this.isEnable = false;
    }
    setParam(value) {
      this.threshold = value;
    }
    check(el, selectorFn) {
      return new Promise((resolve, reject) => {
        if (this.isEnable) {
          const value = selectorFn(el);
          if (typeof value === "number" && value > this.threshold) {
            reject();
            return;
          }
        }
        resolve();
      });
    }
  }
  class VideoBvidFilter extends StringFilter {
  }
  class VideoDimensionFilter extends BooleanFilter {
  }
  class VideoDurationFilter extends NumberMinFilter {
  }
  class VideoQualityFilter extends NumberMinFilter {
  }
  class VideoTitleFilter extends KeywordFilter {
  }
  class VideoPubdateFilter extends NumberMaxFilter {
  }
  class VideoUploaderFilter extends StringFilter {
  }
  class VideoUploaderKeywordFilter extends KeywordFilter {
  }
  class VideoViewsFilter extends NumberMinFilter {
  }
  class VideoUploaderWhiteFilter extends StringFilter {
  }
  class VideoTitleWhiteFilter extends KeywordFilter {
  }
  class VideoIsFollowWhiteFilter extends BooleanFilter {
  }
  const GM_KEYS$5 = {
    black: {
      duration: {
        statusKey: "channel-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      uploader: {
        statusKey: "channel-uploader-filter-status",
        valueKey: "global-uploader-filter-value"
      },
      uploaderKeyword: {
        statusKey: "channel-uploader-keyword-filter-status",
        valueKey: "global-uploader-keyword-filter-value"
      },
      bvid: {
        statusKey: "channel-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      pubdate: {
        statusKey: "channel-pubdate-filter-status",
        valueKey: "global-pubdate-filter-value"
      },
      title: {
        statusKey: "channel-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      }
    },
    white: {
      uploader: {
        statusKey: "channel-uploader-whitelist-filter-status",
        valueKey: "global-uploader-whitelist-filter-value"
      },
      title: {
        statusKey: "channel-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      }
    }
  };
  const selectorFns$5 = {
    duration: (video) => {
      var _a, _b;
      const duration = (_b = (_a = video.querySelector(".bili-video-card__stats__duration")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return (duration && convertTimeToSec(duration)) ?? void 0;
    },
    title: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--tit a")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    pubdate: (video) => {
      var _a, _b;
      const pubdate = (_b = (_a = video.querySelector(".bili-video-card__info--date")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return pubdate && convertDateToDays(pubdate);
    },
    bvid: (video) => {
      var _a, _b;
      const href2 = ((_a = video.querySelector(".bili-video-card__info--tit a")) == null ? void 0 : _a.getAttribute("href")) || ((_b = video.querySelector(".bili-video-card__image--link")) == null ? void 0 : _b.getAttribute("href"));
      return (href2 && matchBvid(href2)) ?? void 0;
    },
    uploader: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--author")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    }
  };
  class VideoFilterChannel {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      __publicField(this, "videoPubdateFilter", new VideoPubdateFilter());
      __publicField(this, "videoUploaderFilter", new VideoUploaderFilter());
      __publicField(this, "videoUploaderKeywordFilter", new VideoUploaderKeywordFilter());
      // 白名单
      __publicField(this, "videoUploaderWhiteFilter", new VideoUploaderWhiteFilter());
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.duration.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.title.valueKey, []));
      this.videoPubdateFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.pubdate.valueKey, 0));
      this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.uploader.valueKey, []));
      this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.uploaderKeyword.valueKey, []));
      this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.white.uploader.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.white.title.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoPubdateFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      let selector = `.bili-video-card[data-report*='.']`;
      if (mode === "incr") {
        selector += `:not([${settings.filterSign}])`;
      }
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterChannel`,
              `bvid: ${selectorFns$5.bvid(v2)}`,
              `duration: ${selectorFns$5.duration(v2)}`,
              `title: ${selectorFns$5.title(v2)}`,
              `uploader: ${selectorFns$5.uploader(v2)}`,
              `pubdate: ${selectorFns$5.pubdate(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns$5.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$5.duration]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$5.title]);
      this.videoPubdateFilter.isEnable && blackPairs.push([this.videoPubdateFilter, selectorFns$5.pubdate]);
      this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$5.uploader]);
      this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$5.uploader]);
      const whitePairs = [];
      this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$5.uploader]);
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$5.title]);
      const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterChannel hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterChannel check full error", err);
      });
    }
    checkIncr() {
      this.check("incr").then().catch((err) => {
        error("VideoFilterChannel check incr error", err);
      });
    }
    observe() {
      waitForEle(document, "main", (node) => {
        return node.tagName === "MAIN";
      }).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterChannel target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkIncr();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter$5 = new VideoFilterChannel();
  const videoFilterChannelEntry = async () => {
    mainFilter$5.init();
    mainFilter$5.observe();
  };
  const videoFilterChannelGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoDurationFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoDurationFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$5.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          step: 1,
          maxValue: 300,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$5.videoDurationFilter.setParam(value);
            mainFilter$5.checkFull();
          }
        }
      ]
    },
    {
      name: "UP主过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.black.uploader.statusKey,
          name: "启用 UP主过滤 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoUploaderFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoUploaderFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.black.uploader.valueKey,
          name: "编辑 UP主黑名单",
          description: ["右键屏蔽的UP主会出现在首行"],
          editorTitle: "UP主 黑名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$5.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.uploader.valueKey, []));
            mainFilter$5.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$5.black.uploaderKeyword.statusKey,
          name: "启用 UP主昵称关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoUploaderKeywordFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoUploaderKeywordFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.black.uploaderKeyword.valueKey,
          name: "编辑 UP主昵称关键词黑名单",
          editorTitle: "UP主昵称关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$5.videoUploaderKeywordFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$5.black.uploaderKeyword.valueKey, [])
            );
            mainFilter$5.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoTitleFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoTitleFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$5.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.title.valueKey, []));
            mainFilter$5.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoBvidFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoBvidFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter$5.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.black.bvid.valueKey, []));
            mainFilter$5.checkFull();
          }
        }
      ]
    },
    {
      name: "发布日期过滤",
      fold: true,
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.black.pubdate.statusKey,
          name: "启用 发布日期过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoPubdateFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoPubdateFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$5.black.pubdate.valueKey,
          name: "视频发布日 距今不超过",
          noStyle: true,
          minValue: 0,
          maxValue: 500,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "天",
          fn: (value) => {
            mainFilter$5.videoPubdateFilter.setParam(value);
            mainFilter$5.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$5.white.uploader.statusKey,
          name: "启用 UP主白名单 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoUploaderWhiteFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoUploaderWhiteFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.white.uploader.valueKey,
          name: "编辑 UP主白名单",
          editorTitle: "UP主 白名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$5.videoUploaderWhiteFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$5.white.uploader.valueKey, [])
            );
            mainFilter$5.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$5.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter$5.videoTitleWhiteFilter.enable();
            mainFilter$5.checkFull();
          },
          disableFn: () => {
            mainFilter$5.videoTitleWhiteFilter.disable();
            mainFilter$5.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$5.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$5.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$5.white.title.valueKey, []));
            mainFilter$5.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterChannelHandler = (target) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!isPageChannel()) {
      return [];
    }
    const menus = [];
    if (target.closest(".bili-video-card__info--owner")) {
      const uploader = (_c = (_b = (_a = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _a.querySelector(".bili-video-card__info--author")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim();
      const url = (_d = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _d.href.trim();
      const spaceUrl = (_e = url == null ? void 0 : url.match(/space\.bilibili\.com\/\d+/)) == null ? void 0 : _e[0];
      if (uploader) {
        if (mainFilter$5.videoUploaderFilter.isEnable) {
          menus.push({
            name: `屏蔽UP主：${uploader}`,
            fn: async () => {
              try {
                mainFilter$5.videoUploaderFilter.addParam(uploader);
                mainFilter$5.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$5.black.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$5.black.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterChannelHandler add uploader ${uploader} failed`, err);
              }
            }
          });
        }
        if (mainFilter$5.videoUploaderWhiteFilter.isEnable) {
          menus.push({
            name: `将UP主加入白名单`,
            fn: async () => {
              try {
                mainFilter$5.videoUploaderWhiteFilter.addParam(uploader);
                mainFilter$5.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$5.white.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$5.white.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterChannelHandler add white uploader ${uploader} failed`, err);
              }
            }
          });
        }
      }
      if (spaceUrl && (mainFilter$5.videoUploaderFilter.isEnable || mainFilter$5.videoUploaderWhiteFilter.isEnable)) {
        menus.push({
          name: `复制主页链接`,
          fn: async () => {
            navigator.clipboard.writeText(`https://${spaceUrl}`).then().catch();
          }
        });
      }
    }
    if (target instanceof HTMLAnchorElement && target.closest(".bili-video-card__info--tit")) {
      const url = (_g = (_f = target.closest(".bili-video-card__info--tit")) == null ? void 0 : _f.querySelector("a")) == null ? void 0 : _g.href;
      if (url && mainFilter$5.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter$5.videoBvidFilter.addParam(bvid);
                mainFilter$5.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$5.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS$5.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterChannelHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: async () => {
              navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch();
            }
          });
        }
      }
    }
    return menus;
  };
  const GM_KEYS$4 = {
    black: {
      duration: {
        statusKey: "homepage-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      views: {
        statusKey: "homepage-views-filter-status",
        valueKey: "global-views-filter-value"
      },
      uploader: {
        statusKey: "homepage-uploader-filter-status",
        valueKey: "global-uploader-filter-value"
      },
      uploaderKeyword: {
        statusKey: "homepage-uploader-keyword-filter-status",
        valueKey: "global-uploader-keyword-filter-value"
      },
      bvid: {
        statusKey: "homepage-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      pubdate: {
        statusKey: "homepage-pubdate-filter-status",
        valueKey: "global-pubdate-filter-value"
      },
      title: {
        statusKey: "homepage-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      }
    },
    white: {
      uploader: {
        statusKey: "homepage-uploader-whitelist-filter-status",
        valueKey: "global-uploader-whitelist-filter-value"
      },
      title: {
        statusKey: "homepage-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      },
      isFollow: {
        statusKey: "homepage-following-whitelist-filter-status"
      }
    }
  };
  const selectorFns$4 = {
    duration: (video) => {
      var _a, _b;
      const duration = (_b = (_a = video.querySelector(".bili-video-card__stats__duration")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return duration && convertTimeToSec(duration);
    },
    views: (video) => {
      var _a, _b;
      const text = (_b = (_a = video.querySelector(".bili-video-card__stats--text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      if (text) {
        if (/\d+(?:\.\d+)?万/.test(text)) {
          return parseFloat(text.replace("万", "")) * 1e4;
        }
        if (/^\d+$/.test(text)) {
          return parseFloat(text);
        }
      }
      return void 0;
    },
    title: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--tit a")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    pubdate: (video) => {
      var _a, _b;
      const pubdate = (_b = (_a = video.querySelector(".bili-video-card__info--date")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return pubdate && convertDateToDays(pubdate);
    },
    bvid: (video) => {
      var _a, _b;
      const href2 = ((_a = video.querySelector(".bili-video-card__info--tit a")) == null ? void 0 : _a.getAttribute("href")) || ((_b = video.querySelector(".bili-video-card__image--link")) == null ? void 0 : _b.getAttribute("href"));
      return (href2 && matchBvid(href2)) ?? void 0;
    },
    uploader: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--author")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    isFollow: (video) => {
      var _a, _b;
      return ((_b = (_a = video.querySelector(".bili-video-card__info--icon-text")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) === "已关注";
    }
  };
  class VideoFilterHomepage {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoViewsFilter", new VideoViewsFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      __publicField(this, "videoPubdateFilter", new VideoPubdateFilter());
      __publicField(this, "videoUploaderFilter", new VideoUploaderFilter());
      __publicField(this, "videoUploaderKeywordFilter", new VideoUploaderKeywordFilter());
      // 白名单
      __publicField(this, "videoUploaderWhiteFilter", new VideoUploaderWhiteFilter());
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
      __publicField(this, "videoIsFollowWhiteFilter", new VideoIsFollowWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.duration.valueKey, 0));
      this.videoViewsFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.views.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.title.valueKey, []));
      this.videoPubdateFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.pubdate.valueKey, 0));
      this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.uploader.valueKey, []));
      this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.uploaderKeyword.valueKey, []));
      this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.white.uploader.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.white.title.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoViewsFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoPubdateFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      let selector = `:scope > :is(.feed-card, .bili-video-card.is-rcmd)`;
      if (mode === "incr") {
        selector += `:not([${settings.filterSign}])`;
      }
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterHomepage`,
              `bvid: ${selectorFns$4.bvid(v2)}`,
              `duration: ${selectorFns$4.duration(v2)}`,
              `views: ${selectorFns$4.views(v2)}`,
              `title: ${selectorFns$4.title(v2)}`,
              `uploader: ${selectorFns$4.uploader(v2)}`,
              `pubdate: ${selectorFns$4.pubdate(v2)}`,
              `isFollow: ${selectorFns$4.isFollow(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns$4.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$4.duration]);
      this.videoViewsFilter.isEnable && blackPairs.push([this.videoViewsFilter, selectorFns$4.views]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$4.title]);
      this.videoPubdateFilter.isEnable && blackPairs.push([this.videoPubdateFilter, selectorFns$4.pubdate]);
      this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$4.uploader]);
      this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$4.uploader]);
      const whitePairs = [];
      this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$4.uploader]);
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$4.title]);
      this.videoIsFollowWhiteFilter.isEnable && whitePairs.push([this.videoIsFollowWhiteFilter, selectorFns$4.isFollow]);
      const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterHomepage hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterHomepage check full error", err);
      });
    }
    checkIncr() {
      this.check("incr").then().catch((err) => {
        error("VideoFilterHomepage check incr error", err);
      });
    }
    observe() {
      waitForEle(document, ".container", (node) => {
        return node.classList.contains("container");
      }).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterHomepage target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkIncr();
        }).observe(this.target, { childList: true });
      });
    }
  }
  const mainFilter$4 = new VideoFilterHomepage();
  const videoFilterHomepageEntry = async () => {
    mainFilter$4.init();
    mainFilter$4.observe();
  };
  const videoFilterHomepageGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoDurationFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoDurationFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$4.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$4.videoDurationFilter.setParam(value);
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "UP主过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.uploader.statusKey,
          name: "启用 UP主过滤 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoUploaderFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoUploaderFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.black.uploader.valueKey,
          name: "编辑 UP主黑名单",
          description: ["右键屏蔽的UP主会出现在首行"],
          editorTitle: "UP主 黑名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$4.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.uploader.valueKey, []));
            mainFilter$4.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$4.black.uploaderKeyword.statusKey,
          name: "启用 UP主昵称关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoUploaderKeywordFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoUploaderKeywordFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.black.uploaderKeyword.valueKey,
          name: "编辑 UP主昵称关键词黑名单",
          editorTitle: "UP主昵称关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$4.videoUploaderKeywordFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$4.black.uploaderKeyword.valueKey, [])
            );
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoTitleFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoTitleFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$4.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.title.valueKey, []));
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoBvidFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoBvidFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter$4.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.black.bvid.valueKey, []));
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "发布日期过滤",
      fold: true,
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.pubdate.statusKey,
          name: "启用 发布日期过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoPubdateFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoPubdateFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$4.black.pubdate.valueKey,
          name: "视频发布日 距今不超过",
          noStyle: true,
          minValue: 0,
          maxValue: 500,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "天",
          fn: (value) => {
            mainFilter$4.videoPubdateFilter.setParam(value);
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "播放量过滤",
      fold: true,
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.black.views.statusKey,
          name: "启用 播放量过滤",
          description: ["不推荐启用", "会导致刚发布的优质视频被过滤"],
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoViewsFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoViewsFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$4.black.views.valueKey,
          name: "设定最低播放量（0~10万）",
          noStyle: true,
          minValue: 0,
          maxValue: 1e5,
          step: 1,
          defaultValue: 0,
          disableValue: 0,
          addonText: "次",
          fn: (value) => {
            mainFilter$4.videoViewsFilter.setParam(value);
            mainFilter$4.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$4.white.isFollow.statusKey,
          name: "标有 [已关注] 的视频免过滤",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoIsFollowWhiteFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoIsFollowWhiteFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$4.white.uploader.statusKey,
          name: "启用 UP主白名单 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoUploaderWhiteFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoUploaderWhiteFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.white.uploader.valueKey,
          name: "编辑 UP主白名单",
          editorTitle: "UP主 白名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$4.videoUploaderWhiteFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$4.white.uploader.valueKey, [])
            );
            mainFilter$4.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$4.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter$4.videoTitleWhiteFilter.enable();
            mainFilter$4.checkFull();
          },
          disableFn: () => {
            mainFilter$4.videoTitleWhiteFilter.disable();
            mainFilter$4.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$4.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$4.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$4.white.title.valueKey, []));
            mainFilter$4.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterHomepageHandler = (target) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!isPageHomepage()) {
      return [];
    }
    const menus = [];
    if (target.closest(".bili-video-card__info--owner")) {
      const uploader = (_c = (_b = (_a = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _a.querySelector(".bili-video-card__info--author")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim();
      const url = (_d = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _d.href.trim();
      const spaceUrl = (_e = url == null ? void 0 : url.match(/space\.bilibili\.com\/\d+/)) == null ? void 0 : _e[0];
      if (uploader) {
        if (mainFilter$4.videoUploaderFilter.isEnable) {
          menus.push({
            name: `屏蔽UP主：${uploader}`,
            fn: async () => {
              try {
                mainFilter$4.videoUploaderFilter.addParam(uploader);
                mainFilter$4.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$4.black.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$4.black.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterHomepageHandler add uploader ${uploader} failed`, err);
              }
            }
          });
        }
        if (mainFilter$4.videoUploaderWhiteFilter.isEnable) {
          menus.push({
            name: `将UP主加入白名单`,
            fn: async () => {
              try {
                mainFilter$4.videoUploaderWhiteFilter.addParam(uploader);
                mainFilter$4.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$4.white.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$4.white.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterHomepageHandler add white uploader ${uploader} failed`, err);
              }
            }
          });
        }
      }
      if (spaceUrl && (mainFilter$4.videoUploaderFilter.isEnable || mainFilter$4.videoUploaderWhiteFilter.isEnable)) {
        menus.push({
          name: `复制主页链接`,
          fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`).then().catch()
        });
      }
    }
    if (target instanceof HTMLAnchorElement && target.closest(".bili-video-card__info--tit")) {
      const url = (_g = (_f = target.closest(".bili-video-card__info--tit")) == null ? void 0 : _f.querySelector("a")) == null ? void 0 : _g.href;
      if (url && mainFilter$4.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter$4.videoBvidFilter.addParam(bvid);
                mainFilter$4.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$4.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS$4.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterHomepageHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
          });
        }
      }
    }
    return menus;
  };
  const GM_KEYS$3 = {
    black: {
      duration: {
        statusKey: "popular-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      uploader: {
        statusKey: "popular-uploader-filter-status",
        valueKey: "global-uploader-filter-value"
      },
      uploaderKeyword: {
        statusKey: "popular-uploader-keyword-filter-status",
        valueKey: "global-uploader-keyword-filter-value"
      },
      bvid: {
        statusKey: "popular-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      title: {
        statusKey: "popular-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      },
      quality: {
        statusKey: "popular-quality-filter-status",
        valueKey: "global-quality-filter-value"
      },
      dimension: {
        statusKey: "popular-dimension-filter-status"
      }
    },
    white: {
      uploader: {
        statusKey: "popular-uploader-whitelist-filter-status",
        valueKey: "global-uploader-whitelist-filter-value"
      },
      title: {
        statusKey: "popular-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      }
    }
  };
  const getVideoData = (video) => {
    var _a, _b, _c, _d;
    let videoData;
    if (!video.classList.contains("rank-item")) {
      return (_a = video.__vue__) == null ? void 0 : _a.videoData;
    }
    const rank = video.getAttribute("data-rank");
    if (rank && parseInt(rank) > 0) {
      videoData = (_d = (_c = (_b = video.closest(".rank-list-wrap")) == null ? void 0 : _b.__vue__) == null ? void 0 : _c.list) == null ? void 0 : _d[parseInt(rank) - 1];
    }
    return videoData;
  };
  const selectorFns$3 = {
    title: (video) => {
      var _a;
      return (_a = getVideoData(video)) == null ? void 0 : _a.title;
    },
    bvid: (video) => {
      var _a;
      return (_a = getVideoData(video)) == null ? void 0 : _a.bvid;
    },
    uploader: (video) => {
      var _a, _b;
      return (_b = (_a = getVideoData(video)) == null ? void 0 : _a.owner) == null ? void 0 : _b.name;
    },
    duration: (video) => {
      var _a;
      return (_a = getVideoData(video)) == null ? void 0 : _a.duration;
    },
    quality: (video) => {
      var _a;
      const stat = (_a = getVideoData(video)) == null ? void 0 : _a.stat;
      if (stat && typeof stat.coin === "number" && typeof stat.like === "number") {
        return calcQuality(stat.coin / stat.like);
      }
      return void 0;
    },
    // true竖屏, false横屏
    dimension: (video) => {
      var _a;
      const dimension = (_a = getVideoData(video)) == null ? void 0 : _a.dimension;
      if (dimension && typeof dimension.height === "number" && typeof dimension.width === "number") {
        return (dimension == null ? void 0 : dimension.height) > (dimension == null ? void 0 : dimension.width);
      }
      return void 0;
    }
  };
  class VideoFilterPopular {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      __publicField(this, "videoPubdateFilter", new VideoPubdateFilter());
      __publicField(this, "videoUploaderFilter", new VideoUploaderFilter());
      __publicField(this, "videoUploaderKeywordFilter", new VideoUploaderKeywordFilter());
      __publicField(this, "videoQualityFilter", new VideoQualityFilter());
      __publicField(this, "videoDimensionFilter", new VideoDimensionFilter());
      // 白名单
      __publicField(this, "videoUploaderWhiteFilter", new VideoUploaderWhiteFilter());
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.duration.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.title.valueKey, []));
      this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.uploader.valueKey, []));
      this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.uploaderKeyword.valueKey, []));
      this.videoQualityFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.quality.valueKey, 0));
      this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.white.uploader.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.white.title.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoDimensionFilter.isEnable || this.videoQualityFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      const selector = `.card-list .video-card, .video-list .video-card, .rank-list .rank-item`;
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterPopular`,
              `bvid: ${selectorFns$3.bvid(v2)}`,
              `duration: ${selectorFns$3.duration(v2)}`,
              `title: ${selectorFns$3.title(v2)}`,
              `uploader: ${selectorFns$3.uploader(v2)}`,
              `quality: ${selectorFns$3.quality(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns$3.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$3.duration]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$3.title]);
      this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$3.uploader]);
      this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$3.uploader]);
      this.videoDimensionFilter.isEnable && blackPairs.push([this.videoDimensionFilter, selectorFns$3.dimension]);
      this.videoQualityFilter.isEnable && blackPairs.push([this.videoQualityFilter, selectorFns$3.quality]);
      const whitePairs = [];
      this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$3.uploader]);
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$3.title]);
      const blackCnt = await coreCheck(videos, true, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterPopular hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterPopular check full error", err);
      });
    }
    // checkIncr() {
    //     this.check('incr')
    //         .then()
    //         .catch((err) => {
    //             error('VideoFilterPopular check incr error', err)
    //         })
    // }
    observe() {
      waitForEle(document, "#app", (node) => {
        return node.id === "app";
      }).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterPopular target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkFull();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter$3 = new VideoFilterPopular();
  const videoFilterPopularEntry = async () => {
    mainFilter$3.init();
    mainFilter$3.observe();
  };
  const videoFilterPopularGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoDurationFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoDurationFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$3.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$3.videoDurationFilter.setParam(value);
            mainFilter$3.checkFull();
          }
        }
      ]
    },
    {
      name: "UP主过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.black.uploader.statusKey,
          name: "启用 UP主过滤 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoUploaderFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoUploaderFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.black.uploader.valueKey,
          name: "编辑 UP主黑名单",
          description: ["右键屏蔽的UP主会出现在首行"],
          editorTitle: "UP主 黑名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$3.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.uploader.valueKey, []));
            mainFilter$3.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$3.black.uploaderKeyword.statusKey,
          name: "启用 UP主昵称关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoUploaderKeywordFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoUploaderKeywordFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.black.uploaderKeyword.valueKey,
          name: "编辑 UP主昵称关键词黑名单",
          editorTitle: "UP主昵称关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$3.videoUploaderKeywordFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$3.black.uploaderKeyword.valueKey, [])
            );
            mainFilter$3.checkFull();
          }
        }
      ]
    },
    {
      name: "视频质量过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.black.dimension.statusKey,
          name: "启用 竖屏视频过滤",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoDimensionFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoDimensionFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$3.black.quality.statusKey,
          name: "启用 劣质视频过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoQualityFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoQualityFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$3.black.quality.valueKey,
          name: "劣质视频过滤百分比 (0~80%)",
          noStyle: true,
          minValue: 0,
          maxValue: 80,
          step: 0.1,
          defaultValue: 25,
          disableValue: 0,
          addonText: "%",
          fn: (value) => {
            mainFilter$3.videoQualityFilter.setParam(value);
            mainFilter$3.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoTitleFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoTitleFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$3.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.title.valueKey, []));
            mainFilter$3.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoBvidFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoBvidFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter$3.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.black.bvid.valueKey, []));
            mainFilter$3.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$3.white.uploader.statusKey,
          name: "启用 UP主白名单 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoUploaderWhiteFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoUploaderWhiteFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.white.uploader.valueKey,
          name: "编辑 UP主白名单",
          editorTitle: "UP主 白名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$3.videoUploaderWhiteFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$3.white.uploader.valueKey, [])
            );
            mainFilter$3.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$3.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter$3.videoTitleWhiteFilter.enable();
            mainFilter$3.checkFull();
          },
          disableFn: () => {
            mainFilter$3.videoTitleWhiteFilter.disable();
            mainFilter$3.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$3.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$3.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$3.white.title.valueKey, []));
            mainFilter$3.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterPopularHandler = (target) => {
    var _a, _b, _c, _d;
    if (!isPagePopular()) {
      return [];
    }
    const menus = [];
    if (target.closest(".up-name")) {
      const uploader = (_a = target.textContent) == null ? void 0 : _a.trim();
      if (uploader) {
        if (mainFilter$3.videoUploaderFilter.isEnable) {
          menus.push({
            name: `屏蔽UP主：${uploader}`,
            fn: async () => {
              try {
                mainFilter$3.videoUploaderFilter.addParam(uploader);
                mainFilter$3.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$3.black.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$3.black.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterPopularHandler add uploader ${uploader} failed`, err);
              }
            }
          });
        }
        if (mainFilter$3.videoUploaderWhiteFilter.isEnable) {
          menus.push({
            name: `将UP主加入白名单`,
            fn: async () => {
              try {
                mainFilter$3.videoUploaderWhiteFilter.addParam(uploader);
                mainFilter$3.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$3.white.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$3.white.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterPopularHandler add white uploader ${uploader} failed`, err);
              }
            }
          });
        }
      }
    }
    if (target.classList.contains("title") && target.closest(".info a") || target.classList.contains("video-name") || target.classList.contains("lazy-image")) {
      let url = target.getAttribute("href") || ((_b = target.parentElement) == null ? void 0 : _b.getAttribute("href"));
      if (!url) {
        url = (_d = (_c = target.closest(".video-card")) == null ? void 0 : _c.querySelector(".video-card__content > a")) == null ? void 0 : _d.getAttribute("href");
      }
      if (url && mainFilter$3.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter$3.videoBvidFilter.addParam(bvid);
                mainFilter$3.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$3.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS$3.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterPopularHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
          });
        }
      }
    }
    return menus;
  };
  const GM_KEYS$2 = {
    black: {
      duration: {
        statusKey: "search-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      uploader: {
        statusKey: "search-uploader-filter-status",
        valueKey: "global-uploader-filter-value"
      },
      uploaderKeyword: {
        statusKey: "search-uploader-keyword-filter-status",
        valueKey: "global-uploader-keyword-filter-value"
      },
      bvid: {
        statusKey: "search-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      title: {
        statusKey: "search-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      }
    },
    white: {
      uploader: {
        statusKey: "search-uploader-whitelist-filter-status",
        valueKey: "global-uploader-whitelist-filter-value"
      },
      title: {
        statusKey: "search-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      }
    }
  };
  const selectorFns$2 = {
    duration: (video) => {
      var _a, _b;
      const duration = (_b = (_a = video.querySelector(".bili-video-card__stats__duration")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      return (duration && convertTimeToSec(duration)) ?? void 0;
    },
    title: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--tit")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    bvid: (video) => {
      var _a, _b;
      const href2 = ((_a = video.querySelector(".bili-video-card__wrap > a")) == null ? void 0 : _a.getAttribute("href")) || ((_b = video.querySelector(".bili-video-card__info--right > a")) == null ? void 0 : _b.getAttribute("href"));
      return (href2 && matchBvid(href2)) ?? void 0;
    },
    uploader: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".bili-video-card__info--author")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    }
  };
  class VideoFilterSearch {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      __publicField(this, "videoUploaderFilter", new VideoUploaderFilter());
      __publicField(this, "videoUploaderKeywordFilter", new VideoUploaderKeywordFilter());
      // 白名单
      __publicField(this, "videoUploaderWhiteFilter", new VideoUploaderWhiteFilter());
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.duration.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.title.valueKey, []));
      this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.uploader.valueKey, []));
      this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.uploaderKeyword.valueKey, []));
      this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.white.uploader.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.white.title.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      const selector = `:where(.video.search-all-list, .search-page-video) .video-list > div`;
      decodeURIComponent(new URL(location.href).searchParams.get("keyword") ?? "").toLowerCase();
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterSearch`,
              `bvid: ${selectorFns$2.bvid(v2)}`,
              `duration: ${selectorFns$2.duration(v2)}`,
              `title: ${selectorFns$2.title(v2)}`,
              `uploader: ${selectorFns$2.uploader(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns$2.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$2.duration]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$2.title]);
      this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$2.uploader]);
      this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$2.uploader]);
      const whitePairs = [];
      this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$2.uploader]);
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$2.title]);
      const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterSearch hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterSearch check full error", err);
      });
    }
    // checkIncr() {
    //     this.check('incr')
    //         .then()
    //         .catch((err) => {
    //             error('VideoFilterSearch check incr error', err)
    //         })
    // }
    observe() {
      waitForEle(document, ".search-layout", (node) => {
        return node.className.includes("search-layout");
      }).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterSearch target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkFull();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter$2 = new VideoFilterSearch();
  const videoFilterSearchEntry = async () => {
    mainFilter$2.init();
    mainFilter$2.observe();
  };
  const videoFilterSearchGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$2.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoDurationFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoDurationFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$2.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$2.videoDurationFilter.setParam(value);
            mainFilter$2.checkFull();
          }
        }
      ]
    },
    {
      name: "UP主过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$2.black.uploader.statusKey,
          name: "启用 UP主过滤 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoUploaderFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoUploaderFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.black.uploader.valueKey,
          name: "编辑 UP主黑名单",
          description: ["右键屏蔽的UP主会出现在首行"],
          editorTitle: "UP主 黑名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$2.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.uploader.valueKey, []));
            mainFilter$2.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$2.black.uploaderKeyword.statusKey,
          name: "启用 UP主昵称关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoUploaderKeywordFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoUploaderKeywordFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.black.uploaderKeyword.valueKey,
          name: "编辑 UP主昵称关键词黑名单",
          editorTitle: "UP主昵称关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$2.videoUploaderKeywordFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$2.black.uploaderKeyword.valueKey, [])
            );
            mainFilter$2.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$2.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoTitleFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoTitleFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$2.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.title.valueKey, []));
            mainFilter$2.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$2.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoBvidFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoBvidFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter$2.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.black.bvid.valueKey, []));
            mainFilter$2.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$2.white.uploader.statusKey,
          name: "启用 UP主白名单 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoUploaderWhiteFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoUploaderWhiteFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.white.uploader.valueKey,
          name: "编辑 UP主白名单",
          editorTitle: "UP主 白名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter$2.videoUploaderWhiteFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS$2.white.uploader.valueKey, [])
            );
            mainFilter$2.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS$2.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter$2.videoTitleWhiteFilter.enable();
            mainFilter$2.checkFull();
          },
          disableFn: () => {
            mainFilter$2.videoTitleWhiteFilter.disable();
            mainFilter$2.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$2.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$2.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$2.white.title.valueKey, []));
            mainFilter$2.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterSearchHandler = (target) => {
    var _a, _b, _c, _d, _e, _f;
    if (!isPageSearch()) {
      return [];
    }
    const menus = [];
    if (target.closest(".bili-video-card__info--owner")) {
      const uploader = (_c = (_b = (_a = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _a.querySelector(".bili-video-card__info--author")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim();
      const url = (_d = target.closest(".bili-video-card__info--owner")) == null ? void 0 : _d.href.trim();
      const spaceUrl = (_e = url == null ? void 0 : url.match(/space\.bilibili\.com\/\d+/)) == null ? void 0 : _e[0];
      if (uploader) {
        if (mainFilter$2.videoUploaderFilter.isEnable) {
          menus.push({
            name: `屏蔽UP主：${uploader}`,
            fn: async () => {
              try {
                mainFilter$2.videoUploaderFilter.addParam(uploader);
                mainFilter$2.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$2.black.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$2.black.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterSearchHandler add uploader ${uploader} failed`, err);
              }
            }
          });
        }
        if (mainFilter$2.videoUploaderWhiteFilter.isEnable) {
          menus.push({
            name: `将UP主加入白名单`,
            fn: async () => {
              try {
                mainFilter$2.videoUploaderWhiteFilter.addParam(uploader);
                mainFilter$2.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$2.white.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS$2.white.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterSearchHandler add white uploader ${uploader} failed`, err);
              }
            }
          });
        }
      }
      if (spaceUrl && (mainFilter$2.videoUploaderFilter.isEnable || mainFilter$2.videoUploaderWhiteFilter.isEnable)) {
        menus.push({
          name: `复制主页链接`,
          fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`)
        });
      }
    }
    if (target.classList.contains("bili-video-card__info--tit")) {
      const url = (_f = target.parentNode) == null ? void 0 : _f.href;
      if (url && mainFilter$2.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter$2.videoBvidFilter.addParam(bvid);
                mainFilter$2.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$2.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS$2.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterSearchHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
          });
        }
      }
    }
    return menus;
  };
  const GM_KEYS$1 = {
    black: {
      duration: {
        statusKey: "space-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      bvid: {
        statusKey: "space-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      title: {
        statusKey: "space-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      }
    },
    white: {
      title: {
        statusKey: "space-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      }
    }
  };
  const selectorFns$1 = {
    duration: (video) => {
      var _a, _b, _c, _d;
      const duration = ((_b = (_a = video.querySelector("span.length")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || ((_d = (_c = video.querySelector(".bili-cover-card__stats .bili-cover-card__stat:nth-last-child(1)")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim());
      return (duration && convertTimeToSec(duration)) ?? void 0;
    },
    title: (video) => {
      var _a, _b, _c, _d;
      return ((_b = (_a = video.querySelector("a.title")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || ((_d = (_c = video.querySelector(".bili-video-card__title a")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim());
    },
    bvid: (video) => {
      var _a, _b, _c, _d;
      const href2 = ((_b = (_a = video.querySelector("a.title")) == null ? void 0 : _a.getAttribute("href")) == null ? void 0 : _b.trim()) || ((_d = (_c = video.querySelector(".bili-video-card__title a")) == null ? void 0 : _c.getAttribute("href")) == null ? void 0 : _d.trim());
      return (href2 && matchBvid(href2)) ?? void 0;
    }
  };
  class VideoFilterSpace {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      // 白名单
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.black.duration.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.black.title.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.white.title.valueKey, []));
    }
    async check(mode) {
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      let selector;
      if (/^\/\d+$/.test(location.pathname)) {
        selector = `#page-index .small-item, .section-wrap.video-section .items__item, .section-wrap.lists-section .video-list__item`;
      }
      if (/^\/\d+\/(?:upload\/)?video$/.test(location.pathname)) {
        selector = `#submit-video :is(.small-item,.list-item), .video-list .upload-video-card`;
      }
      if (/^\/\d+\/channel\/(collectiondetail|seriesdetail)/.test(location.pathname)) {
        selector = `:is(#page-collection-detail,#page-series-detail) li.small-item`;
      }
      if (/^\/\d+\/lists/.test(location.pathname)) {
        selector = `.space-lists .video-list .video-list__item, .space-list-details .list-video-item`;
      }
      if (!selector) {
        return;
      }
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterSpace`,
              `bvid: ${selectorFns$1.bvid(v2)}`,
              `duration: ${selectorFns$1.duration(v2)}`,
              `title: ${selectorFns$1.title(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns$1.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$1.duration]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$1.title]);
      const whitePairs = [];
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$1.title]);
      const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs);
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterSpace hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterSpace check full error", err);
      });
    }
    // checkIncr() {
    //     this.check('incr')
    //         .then()
    //         .catch((err) => {
    //             error('VideoFilterSpace check incr error', err)
    //         })
    // }
    observe() {
      waitForEle(document, "#app", (node) => {
        return node.id === "app";
      }).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterSpace target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkFull();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter$1 = new VideoFilterSpace();
  const videoFilterSpaceEntry = async () => {
    mainFilter$1.init();
    mainFilter$1.observe();
  };
  const videoFilterSpaceGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$1.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$1.videoDurationFilter.enable();
            mainFilter$1.checkFull();
          },
          disableFn: () => {
            mainFilter$1.videoDurationFilter.disable();
            mainFilter$1.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS$1.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter$1.videoDurationFilter.setParam(value);
            mainFilter$1.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$1.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter$1.videoTitleFilter.enable();
            mainFilter$1.checkFull();
          },
          disableFn: () => {
            mainFilter$1.videoTitleFilter.disable();
            mainFilter$1.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$1.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$1.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.black.title.valueKey, []));
            mainFilter$1.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$1.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter$1.videoBvidFilter.enable();
            mainFilter$1.checkFull();
          },
          disableFn: () => {
            mainFilter$1.videoBvidFilter.disable();
            mainFilter$1.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$1.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter$1.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.black.bvid.valueKey, []));
            mainFilter$1.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS$1.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter$1.videoTitleWhiteFilter.enable();
            mainFilter$1.checkFull();
          },
          disableFn: () => {
            mainFilter$1.videoTitleWhiteFilter.disable();
            mainFilter$1.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS$1.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter$1.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS$1.white.title.valueKey, []));
            mainFilter$1.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterSpaceHandler = (target) => {
    if (!isPageSpace()) {
      return [];
    }
    const menus = [];
    if (target.closest(".bili-video-card__title")) {
      const url = target.href;
      if (url && mainFilter$1.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter$1.videoBvidFilter.addParam(bvid);
                mainFilter$1.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS$1.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS$1.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterSearchHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
          });
        }
      }
    }
    return menus;
  };
  const GM_KEYS = {
    black: {
      duration: {
        statusKey: "video-duration-filter-status",
        valueKey: "global-duration-filter-value"
      },
      uploader: {
        statusKey: "video-uploader-filter-status",
        valueKey: "global-uploader-filter-value"
      },
      uploaderKeyword: {
        statusKey: "video-uploader-keyword-filter-status",
        valueKey: "global-uploader-keyword-filter-value"
      },
      bvid: {
        statusKey: "video-bvid-filter-status",
        valueKey: "global-bvid-filter-value"
      },
      title: {
        statusKey: "video-title-keyword-filter-status",
        valueKey: "global-title-keyword-filter-value"
      },
      related: {
        statusKey: "video-related-filter-status"
      }
    },
    white: {
      uploader: {
        statusKey: "video-uploader-whitelist-filter-status",
        valueKey: "global-uploader-whitelist-filter-value"
      },
      title: {
        statusKey: "video-title-keyword-whitelist-filter-status",
        valueKey: "global-title-keyword-whitelist-filter-value"
      }
    }
  };
  const selectorFns = {
    duration: (video) => {
      var _a;
      const duration = (_a = video.querySelector(".pic-box span.duration")) == null ? void 0 : _a.textContent;
      return duration ? convertTimeToSec(duration) : void 0;
    },
    title: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".info > a p")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    },
    bvid: (video) => {
      var _a, _b;
      const href2 = ((_a = video.querySelector(".info > a")) == null ? void 0 : _a.getAttribute("href")) || ((_b = video.querySelector(".pic-box .framepreview-box > a")) == null ? void 0 : _b.getAttribute("href"));
      return (href2 && matchBvid(href2)) ?? void 0;
    },
    uploader: (video) => {
      var _a, _b;
      return (_b = (_a = video.querySelector(".info > .upname .name")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    }
  };
  let enableRelatedCheck = false;
  class VideoFilterVideo {
    constructor() {
      __publicField(this, "target");
      // 黑名单
      __publicField(this, "videoBvidFilter", new VideoBvidFilter());
      __publicField(this, "videoDurationFilter", new VideoDurationFilter());
      __publicField(this, "videoTitleFilter", new VideoTitleFilter());
      __publicField(this, "videoUploaderFilter", new VideoUploaderFilter());
      __publicField(this, "videoUploaderKeywordFilter", new VideoUploaderKeywordFilter());
      // 白名单
      __publicField(this, "videoUploaderWhiteFilter", new VideoUploaderWhiteFilter());
      __publicField(this, "videoTitleWhiteFilter", new VideoTitleWhiteFilter());
    }
    init() {
      this.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []));
      this.videoDurationFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.duration.valueKey, 0));
      this.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []));
      this.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []));
      this.videoUploaderKeywordFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploaderKeyword.valueKey, []));
      this.videoUploaderWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, []));
      this.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []));
    }
    async check(mode) {
      var _a, _b;
      if (!this.target) {
        return;
      }
      let revertAll = false;
      if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable)) {
        revertAll = true;
      }
      const timer = performance.now();
      const selector = `.next-play :is(.video-page-card-small, .video-page-operator-card-small),
            .rec-list :is(.video-page-card-small, .video-page-operator-card-small), .recommend-video-card`;
      const videos = Array.from(this.target.querySelectorAll(selector));
      if (!videos.length) {
        return;
      }
      if (revertAll) {
        videos.forEach((v2) => showEle(v2));
        return;
      }
      if (settings.enableDebugFilter) {
        videos.forEach((v2) => {
          debugFilter(
            [
              `VideoFilterVideo`,
              `bvid: ${selectorFns.bvid(v2)}`,
              `duration: ${selectorFns.duration(v2)}`,
              `title: ${selectorFns.title(v2)}`,
              `uploader: ${selectorFns.uploader(v2)}`
            ].join("\n")
          );
        });
      }
      const blackPairs = [];
      this.videoBvidFilter.isEnable && blackPairs.push([this.videoBvidFilter, selectorFns.bvid]);
      this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration]);
      this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title]);
      this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns.uploader]);
      this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns.uploader]);
      const whitePairs = [];
      this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns.uploader]);
      this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title]);
      const blackCnt = await coreCheck(videos, false, blackPairs, whitePairs);
      if (enableRelatedCheck && blackCnt) {
        const blackBvids = /* @__PURE__ */ new Set();
        for (const video of videos) {
          if (isEleHide(video)) {
            const url = (_a = video.querySelector(".info > a")) == null ? void 0 : _a.getAttribute("href");
            if (url) {
              const bvid = matchBvid(url);
              bvid && blackBvids.add(bvid);
            }
          }
        }
        const rel = (_b = _unsafeWindow.__INITIAL_STATE__) == null ? void 0 : _b.related;
        if ((rel == null ? void 0 : rel.length) && blackBvids.size) {
          _unsafeWindow.__INITIAL_STATE__.related = rel.filter((v2) => !(v2.bvid && blackBvids.has(v2.bvid)));
        }
      }
      const time = (performance.now() - timer).toFixed(1);
      debugFilter(`VideoFilterVideo hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
    }
    checkFull() {
      this.check("full").then().catch((err) => {
        error("VideoFilterVideo check full error", err);
      });
    }
    // checkIncr() {
    //     this.check('incr')
    //         .then()
    //         .catch((err) => {
    //             error('VideoFilterVideo check incr error', err)
    //         })
    // }
    observe() {
      waitForEle(
        document,
        "#reco_list, .recommend-list-v1, .recommend-list-container",
        (node) => {
          return node.id === "reco_list" || ["recommend-list-v1", "recommend-list-container"].includes(node.className);
        }
      ).then((ele) => {
        if (!ele) {
          return;
        }
        debugFilter("VideoFilterVideo target appear");
        this.target = ele;
        this.checkFull();
        new MutationObserver(() => {
          this.checkFull();
        }).observe(this.target, { childList: true, subtree: true });
      });
    }
  }
  const mainFilter = new VideoFilterVideo();
  const videoFilterVideoEntry = async () => {
    mainFilter.init();
    mainFilter.observe();
  };
  const videoFilterVideoGroups = [
    {
      name: "时长过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.black.duration.statusKey,
          name: "启用 时长过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter.videoDurationFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoDurationFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "number",
          id: GM_KEYS.black.duration.valueKey,
          name: "设定最低时长（0~300s）",
          noStyle: true,
          minValue: 0,
          maxValue: 300,
          step: 1,
          defaultValue: 60,
          disableValue: 0,
          addonText: "秒",
          fn: (value) => {
            mainFilter.videoDurationFilter.setParam(value);
            mainFilter.checkFull();
          }
        }
      ]
    },
    {
      name: "UP主过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.black.uploader.statusKey,
          name: "启用 UP主过滤 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter.videoUploaderFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoUploaderFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.black.uploader.valueKey,
          name: "编辑 UP主黑名单",
          description: ["右键屏蔽的UP主会出现在首行"],
          editorTitle: "UP主 黑名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter.videoUploaderFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []));
            mainFilter.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS.black.uploaderKeyword.statusKey,
          name: "启用 UP主昵称关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter.videoUploaderKeywordFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoUploaderKeywordFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.black.uploaderKeyword.valueKey,
          name: "编辑 UP主昵称关键词黑名单",
          editorTitle: "UP主昵称关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter.videoUploaderKeywordFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS.black.uploaderKeyword.valueKey, [])
            );
            mainFilter.checkFull();
          }
        }
      ]
    },
    {
      name: "标题关键词过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.black.title.statusKey,
          name: "启用 标题关键词过滤",
          noStyle: true,
          enableFn: () => {
            mainFilter.videoTitleFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoTitleFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.black.title.valueKey,
          name: "编辑 标题关键词黑名单",
          editorTitle: "标题关键词 黑名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter.videoTitleFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.title.valueKey, []));
            mainFilter.checkFull();
          }
        }
      ]
    },
    {
      name: "BV号过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.black.bvid.statusKey,
          name: "启用 BV号过滤 (右键单击标题)",
          noStyle: true,
          enableFn: () => {
            mainFilter.videoBvidFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoBvidFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.black.bvid.valueKey,
          name: "编辑 BV号黑名单",
          description: ["右键屏蔽的BV号会出现在首行"],
          editorTitle: "BV号 黑名单",
          editorDescription: ["每行一个BV号，保存时自动去重"],
          saveFn: async () => {
            mainFilter.videoBvidFilter.setParam(BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []));
            mainFilter.checkFull();
          }
        }
      ]
    },
    {
      name: "其他过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.black.related.statusKey,
          name: "启用 相关视频数据过滤 (实验功能)",
          description: [
            '过滤当前视频的"相关视频"缓存数据',
            "自动替换接下来播放、播放结束相关视频",
            "启用后，变动其他过滤功能需刷新页面"
          ],
          noStyle: true,
          enableFn: () => {
            enableRelatedCheck = true;
            mainFilter.checkFull();
          },
          disableFn: () => {
            enableRelatedCheck = false;
            mainFilter.checkFull();
          }
        }
      ]
    },
    {
      name: "白名单 免过滤",
      items: [
        {
          type: "switch",
          id: GM_KEYS.white.uploader.statusKey,
          name: "启用 UP主白名单 (右键单击UP主)",
          defaultEnable: true,
          noStyle: true,
          enableFn: () => {
            mainFilter.videoUploaderWhiteFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoUploaderWhiteFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.white.uploader.valueKey,
          name: "编辑 UP主白名单",
          editorTitle: "UP主 白名单",
          editorDescription: ["每行一个UP主昵称，保存时自动去重"],
          saveFn: async () => {
            mainFilter.videoUploaderWhiteFilter.setParam(
              BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, [])
            );
            mainFilter.checkFull();
          }
        },
        {
          type: "switch",
          id: GM_KEYS.white.title.statusKey,
          name: "启用 标题关键词白名单",
          noStyle: true,
          enableFn: () => {
            mainFilter.videoTitleWhiteFilter.enable();
            mainFilter.checkFull();
          },
          disableFn: () => {
            mainFilter.videoTitleWhiteFilter.disable();
            mainFilter.checkFull();
          }
        },
        {
          type: "editor",
          id: GM_KEYS.white.title.valueKey,
          name: "编辑 标题关键词白名单",
          editorTitle: "标题关键词 白名单",
          editorDescription: [
            "每行一个关键词或正则，不区分大小写",
            "请勿使用过于激进的关键词或正则",
            "正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
          ],
          saveFn: async () => {
            mainFilter.videoTitleWhiteFilter.setParam(BiliCleanerStorage.get(GM_KEYS.white.title.valueKey, []));
            mainFilter.checkFull();
          }
        }
      ]
    }
  ];
  const videoFilterVideoHandler = (target) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (!(isPageVideo() || isPagePlaylist() || isPageBangumi())) {
      return [];
    }
    const menus = [];
    if (target.classList.contains("name") || target.classList.contains("up-name") || ((_a = target.parentElement) == null ? void 0 : _a.classList.contains("up-name")) || target.closest(".staff-info")) {
      const uploader = ((_d = (_c = (_b = target.closest(".staff-info")) == null ? void 0 : _b.querySelector(".staff-name")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim()) || ((_e = target.textContent) == null ? void 0 : _e.trim()) || ((_g = (_f = target.parentElement) == null ? void 0 : _f.textContent) == null ? void 0 : _g.trim());
      const url = (_i = (_h = target.closest(".upname")) == null ? void 0 : _h.querySelector(":scope a")) == null ? void 0 : _i.getAttribute("href");
      const spaceUrl = (_j = url == null ? void 0 : url.match(/space\.bilibili\.com\/\d+/)) == null ? void 0 : _j[0];
      if (uploader) {
        if (mainFilter.videoUploaderFilter.isEnable) {
          menus.push({
            name: `屏蔽UP主：${uploader}`,
            fn: async () => {
              try {
                mainFilter.videoUploaderFilter.addParam(uploader);
                mainFilter.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS.black.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS.black.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterVideoHandler add uploader ${uploader} failed`, err);
              }
            }
          });
        }
        if (mainFilter.videoUploaderWhiteFilter.isEnable) {
          menus.push({
            name: `将UP主加入白名单`,
            fn: async () => {
              try {
                mainFilter.videoUploaderWhiteFilter.addParam(uploader);
                mainFilter.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS.white.uploader.valueKey, []);
                arr.unshift(uploader);
                BiliCleanerStorage.set(GM_KEYS.white.uploader.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterVideoHandler add white uploader ${uploader} failed`, err);
              }
            }
          });
        }
      }
      if (spaceUrl && (mainFilter.videoUploaderFilter.isEnable || mainFilter.videoUploaderWhiteFilter.isEnable)) {
        menus.push({
          name: `复制主页链接`,
          fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`)
        });
      }
    }
    if (target.classList.contains("title")) {
      const url = (_k = target.parentElement) == null ? void 0 : _k.getAttribute("href");
      if (url && mainFilter.videoBvidFilter.isEnable) {
        const bvid = matchBvid(url);
        if (bvid) {
          menus.push({
            name: `屏蔽视频 ${bvid}`,
            fn: async () => {
              try {
                mainFilter.videoBvidFilter.addParam(bvid);
                mainFilter.checkFull();
                const arr = BiliCleanerStorage.get(GM_KEYS.black.bvid.valueKey, []);
                arr.unshift(bvid);
                BiliCleanerStorage.set(GM_KEYS.black.bvid.valueKey, orderedUniq(arr));
              } catch (err) {
                error(`videoFilterVideoHandler add bvid ${bvid} failed`, err);
              }
            }
          });
          menus.push({
            name: "复制视频链接",
            fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).then().catch()
          });
        }
      }
    }
    return menus;
  };
  const videoFilters = [
    {
      name: "首页 视频过滤",
      groups: videoFilterHomepageGroups,
      entry: videoFilterHomepageEntry,
      checkFn: isPageHomepage
    },
    {
      name: "播放页 视频过滤",
      groups: videoFilterVideoGroups,
      entry: videoFilterVideoEntry,
      checkFn: () => isPageVideo() || isPagePlaylist()
    },
    {
      name: "热门页 视频过滤",
      groups: videoFilterPopularGroups,
      entry: videoFilterPopularEntry,
      checkFn: isPagePopular
    },
    {
      name: "分区页 视频过滤",
      groups: videoFilterChannelGroups,
      entry: videoFilterChannelEntry,
      checkFn: isPageChannel
    },
    {
      name: "搜索页 视频过滤",
      groups: videoFilterSearchGroups,
      entry: videoFilterSearchEntry,
      checkFn: isPageSearch
    },
    {
      name: "空间页 视频过滤",
      groups: videoFilterSpaceGroups,
      entry: videoFilterSpaceEntry,
      checkFn: isPageSpace
    }
  ];
  const commentFilters = [
    {
      name: "视频页/番剧页/动态页/空间页 视频评论过滤",
      groups: commentFilterCommonGroups,
      entry: commentFilterCommonEntry,
      checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist() || isPageDynamic() || isPageSpace()
    }
  ];
  const dynamicFilters = [
    {
      name: "动态页 动态过滤",
      groups: dynamicFilterDynamicGroups,
      entry: dynamicFilterDynamicEntry,
      checkFn: isPageDynamic
    }
  ];
  const loadFilters = () => {
    const filters = [...videoFilters, ...commentFilters, ...dynamicFilters];
    for (const filter of filters) {
      if (filter.checkFn()) {
        try {
          filter.entry();
          for (const group of filter.groups) {
            for (const item of group.items) {
              switch (item.type) {
                case "switch":
                  loadSwitchItem$1(item);
                  break;
                case "number":
                  loadNumberItem$1(item);
                  break;
              }
            }
          }
        } catch (err) {
          error(`loadFilters filter ${filter.name} error`, err);
        }
      }
    }
  };
  const loadSwitchItem$1 = (item) => {
    var _a;
    const enable = BiliCleanerStorage.get(item.id, item.defaultEnable);
    if (enable) {
      if (item.enableFn) {
        if (item.enableFnRunAt === "document-end" && document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            var _a2;
            (_a2 = item.enableFn()) == null ? void 0 : _a2.then().catch();
          });
        } else {
          (_a = item.enableFn()) == null ? void 0 : _a.then().catch();
        }
      }
    }
  };
  const loadNumberItem$1 = (item) => {
    var _a;
    const value = BiliCleanerStorage.get(item.id, item.defaultValue);
    if (value !== item.disableValue) {
      (_a = item.fn(value)) == null ? void 0 : _a.then().catch();
    }
  };
  const filterContextMenuHandlers = [
    videoFilterVideoHandler,
    videoFilterSearchHandler,
    videoFilterChannelHandler,
    videoFilterPopularHandler,
    videoFilterHomepageHandler,
    videoFilterSpaceHandler,
    dynamicFilterDynamicHandler,
    commentFilterCommonHandler
  ];
  const useRulePanelStore = /* @__PURE__ */ defineStore("RulePanel", () => {
    const isShow = e$1.ref(false);
    const show = () => {
      isShow.value = true;
    };
    const hide = () => {
      isShow.value = false;
    };
    return { isShow, show, hide };
  });
  const useVideoFilterPanelStore = /* @__PURE__ */ defineStore("VideoFilterPanel", () => {
    const isShow = e$1.ref(false);
    const show = () => {
      isShow.value = true;
    };
    const hide = () => {
      isShow.value = false;
    };
    return { isShow, show, hide };
  });
  const useCommentFilterPanelStore = /* @__PURE__ */ defineStore("CommentFilterPanel", () => {
    const isShow = e$1.ref(false);
    const show = () => {
      isShow.value = true;
    };
    const hide = () => {
      isShow.value = false;
    };
    return { isShow, show, hide };
  });
  const useDynamicFilterPanelStore = /* @__PURE__ */ defineStore("DynamicFilterPanel", () => {
    const isShow = e$1.ref(false);
    const show = () => {
      isShow.value = true;
    };
    const hide = () => {
      isShow.value = false;
    };
    return { isShow, show, hide };
  });
  const useSideBtnStore = /* @__PURE__ */ defineStore("SideBtn", () => {
    const isShow = useStorage("bili-cleaner-side-btn-show", false, localStorage);
    const show = () => {
      isShow.value = true;
    };
    const hide = () => {
      isShow.value = false;
    };
    return { isShow, show, hide };
  });
  const _sfc_main$6 = /* @__PURE__ */ e$1.defineComponent({
    __name: "CommentFilterPanelView",
    setup(__props) {
      const store = useCommentFilterPanelStore();
      let currPageGroups = [];
      for (const commentFilter of commentFilters) {
        if (commentFilter.checkFn()) {
          currPageGroups = [...currPageGroups, ...commentFilter.groups];
        }
      }
      return (_ctx, _cache) => {
        return e$1.withDirectives((e$1.openBlock(), e$1.createBlock(_sfc_main$d, e$1.mergeProps({
          title: "评论过滤（全站通用）",
          widthPercent: 28,
          heightPercent: 85,
          minWidth: 360,
          minHeight: 600
        }, {
          onClose: e$1.unref(store).hide
        }), {
          default: e$1.withCtx(() => [
            (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(e$1.unref(currPageGroups), (group, index) => {
              return e$1.openBlock(), e$1.createElementBlock("div", { key: index }, [
                e$1.createVNode(_sfc_main$e, e$1.mergeProps({ ref_for: true }, { title: group.name, isFold: group.fold }), {
                  default: e$1.withCtx(() => [
                    (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(group.items, (item, innerIndex) => {
                      return e$1.openBlock(), e$1.createElementBlock("div", { key: innerIndex }, [
                        item.type === "switch" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$7, e$1.mergeProps({
                          key: 0,
                          ref_for: true
                        }, item), null, 16)) : item.type === "number" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$9, e$1.mergeProps({
                          key: 1,
                          ref_for: true
                        }, item), null, 16)) : item.type === "string" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$8, e$1.mergeProps({
                          key: 2,
                          ref_for: true
                        }, item), null, 16)) : item.type === "editor" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$b, e$1.mergeProps({
                          key: 3,
                          ref_for: true
                        }, item), null, 16)) : item.type === "list" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$a, e$1.mergeProps({
                          key: 4,
                          ref_for: true
                        }, item), null, 16)) : e$1.createCommentVNode("", true)
                      ]);
                    }), 128))
                  ]),
                  _: 2
                }, 1040)
              ]);
            }), 128))
          ]),
          _: 1
        }, 16, ["onClose"])), [
          [e$1.vShow, e$1.unref(store).isShow]
        ]);
      };
    }
  });
  const _hoisted_1$1 = ["onClick"];
  const _hoisted_2 = { key: 0 };
  const _sfc_main$5 = /* @__PURE__ */ e$1.defineComponent({
    __name: "ContextMenuView",
    setup(__props) {
      const show = e$1.ref(false);
      const pos = e$1.reactive({
        left: -9999,
        top: -9999
      });
      const menuList = e$1.ref([]);
      useEventListener(window, "contextmenu", (e2) => {
        var _a;
        if (e2.target instanceof HTMLElement) {
          const target = (_a = e2.composedPath()) == null ? void 0 : _a[0];
          if (!target.closest(".bilibili-app-recommend-root")) {
            handleTarget(target);
          }
        }
        if (menuList.value.length) {
          e2.preventDefault();
          show.value = true;
          if (show.value) {
            pos.left = e2.x;
            pos.top = e2.y;
          }
          useEventListener(window, "wheel", () => {
            show.value = false;
          });
          useEventListener(document, "click", () => {
            show.value = false;
          });
        }
      });
      const handleTarget = (target) => {
        menuList.value = [];
        for (const handler of filterContextMenuHandlers) {
          try {
            menuList.value = menuList.value.concat(handler(target));
          } catch (err) {
            error("ContextMenuVuew handleTarget failed", err);
          }
        }
      };
      return (_ctx, _cache) => {
        return show.value ? (e$1.openBlock(), e$1.createElementBlock("div", {
          key: 0,
          class: "fixed z-[100000] block cursor-pointer overflow-hidden rounded-md bg-white text-[15px] text-black shadow-lg shadow-black/20",
          style: e$1.normalizeStyle({ left: pos.left + "px", top: pos.top + "px" })
        }, [
          (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(menuList.value, (menu2, index) => {
            return e$1.openBlock(), e$1.createElementBlock("div", { key: index }, [
              e$1.createElementVNode("div", {
                onClick: ($event) => {
                  var _a;
                  return (_a = menu2.fn()) == null ? void 0 : _a.then().catch();
                },
                class: "px-2.5 py-1 hover:bg-[#00aeec] hover:text-white"
              }, [
                _cache[0] || (_cache[0] = e$1.createElementVNode("span", { class: "mr-0.5" }, "◎", -1)),
                e$1.createTextVNode(" " + e$1.toDisplayString(menu2.name), 1)
              ], 8, _hoisted_1$1),
              index < menuList.value.length - 1 ? (e$1.openBlock(), e$1.createElementBlock("hr", _hoisted_2)) : e$1.createCommentVNode("", true)
            ]);
          }), 128))
        ], 4)) : e$1.createCommentVNode("", true);
      };
    }
  });
  const _sfc_main$4 = /* @__PURE__ */ e$1.defineComponent({
    __name: "DynamicFilterPanelView",
    setup(__props) {
      const store = useDynamicFilterPanelStore();
      let currPageGroups = [];
      for (const dynamicFilter of dynamicFilters) {
        if (dynamicFilter.checkFn()) {
          currPageGroups = [...currPageGroups, ...dynamicFilter.groups];
        }
      }
      return (_ctx, _cache) => {
        return e$1.withDirectives((e$1.openBlock(), e$1.createBlock(_sfc_main$d, e$1.mergeProps({
          title: "动态过滤",
          widthPercent: 28,
          heightPercent: 85,
          minWidth: 360,
          minHeight: 600
        }, {
          onClose: e$1.unref(store).hide
        }), {
          default: e$1.withCtx(() => [
            (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(e$1.unref(currPageGroups), (group, index) => {
              return e$1.openBlock(), e$1.createElementBlock("div", { key: index }, [
                e$1.createVNode(_sfc_main$e, e$1.mergeProps({ ref_for: true }, { title: group.name, isFold: group.fold }), {
                  default: e$1.withCtx(() => [
                    (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(group.items, (item, innerIndex) => {
                      return e$1.openBlock(), e$1.createElementBlock("div", { key: innerIndex }, [
                        item.type === "switch" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$7, e$1.mergeProps({
                          key: 0,
                          ref_for: true
                        }, item), null, 16)) : item.type === "number" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$9, e$1.mergeProps({
                          key: 1,
                          ref_for: true
                        }, item), null, 16)) : item.type === "string" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$8, e$1.mergeProps({
                          key: 2,
                          ref_for: true
                        }, item), null, 16)) : item.type === "editor" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$b, e$1.mergeProps({
                          key: 3,
                          ref_for: true
                        }, item), null, 16)) : item.type === "list" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$a, e$1.mergeProps({
                          key: 4,
                          ref_for: true
                        }, item), null, 16)) : e$1.createCommentVNode("", true)
                      ]);
                    }), 128))
                  ]),
                  _: 2
                }, 1040)
              ]);
            }), 128))
          ]),
          _: 1
        }, 16, ["onClose"])), [
          [e$1.vShow, e$1.unref(store).isShow]
        ]);
      };
    }
  });
  const bangumiBasicItems = [
    {
      type: "switch",
      id: "video-page-simple-share",
      name: "净化分享功能",
      defaultEnable: true,
      description: ["点击分享按钮时，复制纯净链接"],
      enableFn: async () => {
        let counter = 0;
        const id = setInterval(() => {
          counter++;
          const shareBtn = document.getElementById("share-container-id");
          if (shareBtn) {
            clearInterval(id);
            shareBtn.addEventListener("click", () => {
              var _a, _b;
              const mainTitle = (_a = document.querySelector("[class^='mediainfo_mediaTitle']")) == null ? void 0 : _a.textContent;
              const subTitle = (_b = document.getElementById("player-title")) == null ? void 0 : _b.textContent;
              const shareText = `《${mainTitle}》${subTitle} 
https://www.bilibili.com${location.pathname}`;
              navigator.clipboard.writeText(shareText).then().catch();
            });
          } else if (counter > 50) {
            clearInterval(id);
          }
        }, 200);
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "video-page-hide-fixed-header",
      name: "顶栏 滚动页面后 不再吸附顶部"
    }
  ];
  const bangumiDanmakuItems = [
    {
      type: "string",
      id: "video-page-danmaku-font-family",
      name: "弹幕字体",
      description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
      defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-family",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-danmaku-font-weight",
      name: "弹幕字重",
      description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-weight",
          value.trim().replace(/;$/, "")
        );
      }
    }
  ];
  const bangumiDanmakuControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-online",
      name: "隐藏 同时在看人数"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-dm",
      name: "隐藏 装填弹幕数量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-switch",
      name: "隐藏 弹幕开关"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-setting",
      name: "隐藏 弹幕显示设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-btn-dm",
      name: "隐藏 弹幕样式"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-input",
      name: "隐藏 占位文字",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-hint",
      name: "隐藏 弹幕礼仪",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-btn-send",
      name: "隐藏 发送按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-sending-area",
      name: "非全屏下 关闭弹幕栏",
      description: ["字母 D 是弹幕开关快捷键"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-inputbar",
      name: "全屏下 关闭弹幕输入框"
    }
  ];
  const bangumiMiniPlayerItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-mini-mode-process",
      name: "隐藏底边进度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-mini-mode-danmaku",
      name: "隐藏弹幕"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-mini-mode-wheel-adjust",
      name: "滚轮调节大小",
      enableFn: async () => {
        try {
          const zoom = useStorage("bili-cleaner-mini-player-zoom", 1, localStorage);
          document.documentElement.style.setProperty("--mini-player-zoom", zoom.value + "");
          let cnt = 0;
          const interval = setInterval(() => {
            const player = document.querySelector(".bpx-player-container");
            if (player) {
              clearInterval(interval);
              let flag = false;
              player.addEventListener("mouseenter", () => {
                if (player.getAttribute("data-screen") === "mini") {
                  flag = true;
                }
              });
              player.addEventListener("mouseleave", () => {
                flag = false;
              });
              player.addEventListener("wheel", (e2) => {
                if (flag) {
                  e2.stopPropagation();
                  e2.preventDefault();
                  const scaleSpeed = 5;
                  let newZoom = zoom.value - Math.sign(e2.deltaY) * scaleSpeed / 100;
                  newZoom = newZoom < 0.5 ? 0.5 : newZoom;
                  newZoom = newZoom > 3 ? 3 : newZoom;
                  if (newZoom !== zoom.value) {
                    zoom.value = newZoom;
                    document.documentElement.style.setProperty("--mini-player-zoom", newZoom + "");
                  }
                }
              });
            } else {
              cnt++;
              if (cnt > 20) {
                clearInterval(interval);
              }
            }
          }, 500);
        } catch (err) {
          error("adjust mini player size error", err);
        }
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-mini-mode-position-record",
      name: "记录小窗位置",
      enableFn: async () => {
        const pos = useStorage("bili-cleaner-mini-player-pos", { tx: 0, ty: 0 }, localStorage);
        document.documentElement.style.setProperty("--mini-player-translate-x", pos.value.tx + "px");
        document.documentElement.style.setProperty("--mini-player-translate-y", pos.value.ty + "px");
        waitForEle(document.body, `#bilibili-player [class^="bpx-player-video"]`, (node) => {
          return node.className.startsWith("bpx-player-video");
        }).then(() => {
          const player = document.querySelector(".bpx-player-container");
          if (player) {
            player.addEventListener("mouseup", () => {
              if (player.getAttribute("data-screen") === "mini") {
                const rect = player.getBoundingClientRect();
                pos.value.tx = 84 - (document.documentElement.clientWidth - rect.right);
                pos.value.ty = 48 - (document.documentElement.clientHeight - rect.bottom);
              }
            });
          }
        });
      },
      enableFnRunAt: "document-end"
    }
  ];
  const bangumiPlayerItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-title",
      name: "隐藏 全屏下 播放器内标题"
    },
    {
      type: "switch",
      id: "bangumi-page-hide-bpx-player-top-follow",
      name: "隐藏 追番/追剧按钮 ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-issue",
      name: "隐藏 反馈按钮",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-state-wrap",
      name: "隐藏 视频暂停时大Logo"
    },
    {
      type: "switch",
      id: "bangumi-page-hide-bpx-player-record-item-wrap",
      name: "隐藏 视频内封审核号(非内嵌) ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dialog-wrap",
      name: "隐藏 弹幕悬停 点赞/复制/举报"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-high-icon",
      name: "隐藏 高赞弹幕前点赞按钮"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-dm-vip-white",
      name: "彩色渐变弹幕 变成白色"
    }
  ];
  const bangumiPlayerControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-prev",
      name: "隐藏 上一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-play",
      name: "隐藏 播放/暂停"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-next",
      name: "隐藏 下一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-flac",
      name: "隐藏 Hi-Res无损"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-quality",
      name: "隐藏 清晰度"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-eplist",
      name: "隐藏 选集"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-playbackrate",
      name: "隐藏 倍速"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-subtitle",
      name: "隐藏 字幕"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-volume",
      name: "隐藏 音量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-setting",
      name: "隐藏 视频设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-pip",
      name: "隐藏 画中画",
      description: ["Chrome / Edge 浏览器可用", "Firefox 可在浏览器设置中关闭"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-wide",
      name: "隐藏 宽屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-web",
      name: "隐藏 网页全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-full",
      name: "隐藏 全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-pbp-pin",
      name: "隐藏 高能进度条 图钉按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-shadow-progress-area",
      name: "隐藏 底边mini视频进度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-show-bpx-player-pbp",
      name: "控制栏收起时 显示高能进度条"
    }
  ];
  let webScroll$1 = false;
  let fullScroll$1 = false;
  const fn$1 = (event) => event.stopImmediatePropagation();
  const disableTuneVolume$1 = () => {
    if (!webScroll$1 && !fullScroll$1) {
      window.addEventListener("mousewheel", fn$1, { capture: true });
      window.addEventListener("DOMMouseScroll", fn$1, { capture: true });
    }
  };
  const enableTuneVolume$1 = () => {
    if (!(webScroll$1 && fullScroll$1)) {
      window.removeEventListener("mousewheel", fn$1, { capture: true });
      window.removeEventListener("DOMMouseScroll", fn$1, { capture: true });
    }
  };
  const bangumiPlayerLayoutItems = [
    {
      type: "switch",
      id: "default-widescreen",
      name: "默认宽屏播放 刷新生效",
      noStyle: true,
      enableFn: () => {
        var _a, _b, _c, _d, _e, _f, _g;
        let origNextData = _unsafeWindow.__NEXT_DATA__;
        if ((_g = (_f = (_e = (_d = (_c = (_b = (_a = origNextData == null ? void 0 : origNextData.props) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.dehydratedState) == null ? void 0 : _c.queries) == null ? void 0 : _d[1]) == null ? void 0 : _e.state) == null ? void 0 : _f.data) == null ? void 0 : _g.show) {
          origNextData.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1;
        }
        Object.defineProperty(_unsafeWindow, "__NEXT_DATA__", {
          get() {
            return origNextData;
          },
          set(value) {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
            if ((_g2 = (_f2 = (_e2 = (_d2 = (_c2 = (_b2 = (_a2 = value.props) == null ? void 0 : _a2.pageProps) == null ? void 0 : _b2.dehydratedState) == null ? void 0 : _c2.queries) == null ? void 0 : _d2[1]) == null ? void 0 : _e2.state) == null ? void 0 : _f2.data) == null ? void 0 : _g2.show) {
              value.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1;
            }
            origNextData = value;
          }
        });
      }
    },
    {
      type: "switch",
      id: "webscreen-scrollable",
      name: "网页全屏时 页面可滚动",
      description: ["播放器内滚轮调节音量失效"],
      enableFn: async () => {
        disableTuneVolume$1();
        webScroll$1 = true;
        waitForEle(document.body, ".bpx-player-ctrl-web", (node) => {
          return node.className.includes("bpx-player-ctrl-web");
        }).then((webBtn) => {
          if (webBtn) {
            webBtn.addEventListener("click", () => {
              if (webBtn.classList.contains("bpx-state-entered")) {
                window.scrollTo(0, 0);
              }
            });
          }
        });
      },
      disableFn: () => {
        enableTuneVolume$1();
        webScroll$1 = false;
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "fullscreen-scrollable",
      name: "全屏时 页面可滚动 (实验功能)",
      description: ["播放器内滚轮调节音量失效", "点击全屏按钮生效，双击全屏无效"],
      enableFn: async () => {
        disableTuneVolume$1();
        fullScroll$1 = true;
        let cnt = 0;
        const id = setInterval(() => {
          var _a;
          const webBtn = document.body.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web");
          const fullBtn = document.body.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-full");
          if (webBtn && fullBtn) {
            clearInterval(id);
            const isFullScreen = () => {
              if (document.fullscreenElement) {
                return "ele";
              } else if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
                return "f11";
              } else {
                return "not";
              }
            };
            const isWebScreen = () => {
              return webBtn.classList.contains("bpx-state-entered");
            };
            const newFullBtn = fullBtn.cloneNode(true);
            newFullBtn.addEventListener("click", () => {
              switch (isFullScreen()) {
                case "ele":
                  if (isWebScreen()) {
                    webBtn.click();
                  } else {
                    document.exitFullscreen().then().catch();
                  }
                  break;
                case "f11":
                  webBtn.click();
                  break;
                case "not":
                  document.documentElement.requestFullscreen().then().catch();
                  if (!isWebScreen()) {
                    webBtn.click();
                  }
                  window.scrollTo(0, 0);
                  break;
              }
            });
            (_a = fullBtn.parentElement) == null ? void 0 : _a.replaceChild(newFullBtn, fullBtn);
          } else {
            cnt++;
            cnt > 50 && clearInterval(id);
          }
        }, 200);
      },
      disableFn: () => {
        enableTuneVolume$1();
        fullScroll$1 = false;
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "number",
      id: "normalscreen-width",
      name: "普通播放 视频宽度调节（-1禁用）",
      minValue: -1,
      maxValue: 100,
      step: 0.1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "vw",
      fn: (value) => {
        document.documentElement.style.setProperty("--normalscreen-width", `${value}vw`);
      }
    }
  ];
  const bangumiRightItems = [
    {
      type: "switch",
      id: "bangumi-page-hide-right-container-section-height",
      name: "隐藏 大会员按钮 ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-danmaku",
      name: "隐藏 弹幕列表"
    },
    {
      type: "switch",
      id: "bangumi-page-hide-eplist-badge",
      name: "隐藏 视频列表 会员/限免标记 ★"
    },
    {
      type: "switch",
      id: "bangumi-page-hide-recommend",
      name: "隐藏 相关作品推荐 ★"
    }
  ];
  const bangumiSidebarItems = [
    {
      type: "switch",
      id: "bangumi-page-hide-sidenav-issue",
      name: "隐藏 新版反馈 ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-sidenav-mini",
      name: "隐藏 小窗播放开关"
    },
    {
      type: "switch",
      id: "video-page-hide-sidenav-customer-service",
      name: "隐藏 客服",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-sidenav-back-to-top",
      name: "隐藏 回顶部"
    }
  ];
  const bangumiToolbarItems = [
    {
      type: "switch",
      id: "video-page-coin-disable-auto-like",
      name: "投币时不自动点赞",
      noStyle: true,
      enableFn: async () => {
        const disableAutoLike = () => {
          let counter = 0;
          const timer = setInterval(() => {
            const checkbox = document.querySelector(
              '.main-container [class^="dialogcoin_like_checkbox"] input'
            );
            if (checkbox) {
              checkbox.checked && checkbox.click();
              clearInterval(timer);
            } else {
              counter++;
              if (counter > 100) {
                clearInterval(timer);
              }
            }
          }, 20);
        };
        const coinBtn = document.querySelector("#ogv_weslie_tool_coin_info");
        if (coinBtn) {
          coinBtn.addEventListener("click", disableAutoLike);
        } else {
          document.addEventListener("DOMContentLoaded", () => {
            const coinBtn2 = document.querySelector("#ogv_weslie_tool_coin_info");
            coinBtn2 == null ? void 0 : coinBtn2.addEventListener("click", disableAutoLike);
          });
        }
      }
    },
    {
      type: "switch",
      id: "video-page-hide-video-share-popover",
      name: "隐藏 分享按钮弹出菜单",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "bangumi-page-hide-watch-together",
      name: "隐藏 一起看 ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "bangumi-page-hide-toolbar",
      name: "隐藏 整个工具栏(赞币转) ★"
    },
    {
      type: "switch",
      id: "bangumi-page-hide-media-info",
      name: "隐藏 作品介绍 ★"
    },
    {
      type: "switch",
      id: "bangumi-page-simple-media-info",
      name: "精简 作品介绍 ★",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "bangumi-page-hide-sponsor-module",
      name: "隐藏 承包榜 ★"
    }
  ];
  const bangumiGroups = [
    {
      name: "基本功能",
      fold: true,
      items: bangumiBasicItems
    },
    {
      name: "播放设定",
      fold: true,
      items: bangumiPlayerLayoutItems
    },
    {
      name: "播放器（标★是番剧页独有项）",
      fold: true,
      items: bangumiPlayerItems
    },
    {
      name: "播放控制栏",
      fold: true,
      items: bangumiPlayerControlItems
    },
    {
      name: "弹幕栏",
      fold: true,
      items: bangumiDanmakuControlItems
    },
    {
      name: "弹幕样式",
      fold: true,
      items: bangumiDanmakuItems
    },
    {
      name: "视频下方 工具栏/作品信息",
      fold: true,
      items: bangumiToolbarItems
    },
    {
      name: "右栏 作品选集/其他推荐",
      fold: true,
      items: bangumiRightItems
    },
    {
      name: "小窗播放器",
      fold: true,
      items: bangumiMiniPlayerItems
    },
    {
      name: "页面右下角 小按钮",
      fold: true,
      items: bangumiSidebarItems
    }
  ];
  const channelBasicItems = [
    {
      type: "switch",
      id: "homepage-hide-banner",
      name: "隐藏 横幅banner",
      description: ["同步生效：首页、分区页、热门页"]
    },
    {
      type: "switch",
      id: "channel-hide-subarea",
      name: "隐藏 全站分区栏"
    },
    {
      type: "switch",
      id: "channel-hide-carousel",
      name: "隐藏 大图轮播"
    },
    {
      type: "switch",
      id: "channel-hide-sticky-subchannel",
      name: "隐藏 滚动页面时 顶部吸附分区栏"
    },
    {
      type: "switch",
      id: "channel-hide-sticky-header",
      name: "隐藏 滚动页面时 顶部吸附顶栏"
    },
    {
      type: "number",
      id: "channel-layout-padding",
      name: "修改 页面两侧边距 (-1禁用)",
      minValue: -1,
      maxValue: 500,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--channel-layout-padding", `${value}px`);
      }
    }
  ];
  const channelRcmdItems = [
    {
      type: "switch",
      id: "channel-hide-high-energy-topic",
      name: "隐藏 前方高能右侧 话题精选"
    },
    {
      type: "switch",
      id: "channel-hide-high-energy",
      name: "隐藏 前方高能栏目"
    },
    {
      type: "switch",
      id: "channel-hide-rank-list",
      name: "隐藏 视频栏目右侧 热门列表"
    },
    {
      type: "switch",
      id: "channel-hide-ad-banner",
      name: "隐藏 广告banner",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "channel-hide-video-info-date",
      name: "隐藏 发布时间"
    },
    {
      type: "switch",
      id: "channel-hide-danmaku-count",
      name: "隐藏 弹幕数",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "channel-feed-card-body-grid-gap",
      name: "优化 近期投稿栏目 视频行距",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "channel-increase-rcmd-list-font-size",
      name: "增大 视频信息字号"
    }
  ];
  const channelSidebarItems = [
    {
      type: "switch",
      id: "channel-hide-feedback",
      name: "隐藏 新版反馈",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "channel-hide-top-btn",
      name: "隐藏 回顶部"
    }
  ];
  const channelGroups = [
    {
      name: "分区页 基础功能",
      items: channelBasicItems
    },
    {
      name: "视频列表",
      items: channelRcmdItems
    },
    {
      name: "页面右下角 小按钮",
      items: channelSidebarItems
    }
  ];
  const commentBasicItems = [
    {
      type: "switch",
      id: "video-page-hide-reply-notice",
      name: "隐藏 活动通知",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comments-header-renderer",
          "video-page-hide-reply-notice",
          `#notice {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comments-header-renderer", "video-page-hide-reply-notice");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-main-reply-box",
      name: "隐藏 评论编辑器",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comments-header-renderer",
          "video-page-hide-main-reply-box",
          `#commentbox bili-comment-box {display: none !important;}
                    #navbar {margin-bottom: 0 !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comments-header-renderer", "video-page-hide-main-reply-box");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-reply-box-textarea-placeholder",
      name: "隐藏 评论编辑器内占位文字",
      description: ["同时会隐藏回复评论时的文字提示"],
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-textarea",
          "video-page-hide-reply-box-textarea-placeholder",
          `textarea:not([placeholder^="回复"])::placeholder {color: transparent !important; user-select: none;}`
        );
        ShadowInstance.addShadowStyle(
          "bili-comment-rich-textarea",
          "video-page-hide-reply-box-textarea-placeholder",
          `.brt-placeholder {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-textarea", "video-page-hide-reply-box-textarea-placeholder");
        ShadowInstance.removeShadowStyle("bili-comment-rich-textarea", "video-page-hide-reply-box-textarea-placeholder");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-fixed-reply-box",
      name: "隐藏 页面底部 吸附评论框",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comments-header-renderer",
          "video-page-hide-fixed-reply-box",
          `.bili-comments-bottom-fixed-wrapper {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comments-header-renderer", "video-page-hide-fixed-reply-box");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-top-vote-card",
      name: "隐藏 投票栏 (红方/蓝方)",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comments-header-renderer",
          "video-page-hide-top-vote-card",
          `#vote {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comments-header-renderer", "video-page-hide-top-vote-card");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-comment-user-card",
      name: "隐藏 用户卡片",
      description: ["鼠标放在用户名上时不显示卡片"],
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-user-profile",
          "video-page-hide-comment-user-card",
          `#wrap {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-user-profile", "video-page-hide-comment-user-card");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-reply-decorate",
      name: "隐藏 评论右侧装饰",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-renderer",
          "video-page-hide-reply-decorate",
          `#ornament {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-reply-decorate");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-fan-badge",
      name: "隐藏 粉丝牌",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-user-medal",
          "video-page-hide-fan-badge",
          `#fans {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-user-medal", "video-page-hide-fan-badge");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-contractor-box",
      name: "隐藏 老粉、原始粉丝Tag",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-user-medal",
          "video-page-hide-contractor-box",
          `#contractor {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-user-medal", "video-page-hide-contractor-box");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-user-level",
      name: "隐藏 用户等级",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-user-info",
          "video-page-hide-user-level",
          `#user-level {display: none !important;}
                #user-name {margin-right: 5px;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-hide-user-level");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-bili-avatar-pendent-dom",
      name: "隐藏 用户头像饰品",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-avatar",
          "video-page-hide-bili-avatar-pendent-dom",
          `picture:has(img[src*="/bfs/garb/"]) {display: none !important;}
                .layer-res[style*="bfs/garb/"] {display: none !important;}
                .layer.center[style^="width: 66px"] {display: none !important;}
                /* 统一头像大小 */
                .layer.center {width: 48px !important; height: 48px !important;}
                `
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-avatar", "video-page-hide-bili-avatar-pendent-dom");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-bili-avatar-nft-icon",
      name: "隐藏 用户头像徽章",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-avatar",
          "video-page-hide-bili-avatar-nft-icon",
          `.layer:not(.center) {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-avatar", "video-page-hide-bili-avatar-nft-icon");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-vote-info",
      name: "隐藏 用户投票 (红方/蓝方)",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-renderer",
          "video-page-hide-vote-info",
          `bili-comment-vote-option {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-vote-info");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-reply-tag-list",
      name: "隐藏 评论内容下Tag",
      description: ["如：热评、UP主觉得很赞"],
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-renderer",
          "video-page-hide-reply-tag-list",
          `#tags {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-reply-tag-list");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-note-prefix",
      name: "隐藏 笔记评论前的小Logo",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-renderer",
          "video-page-hide-note-prefix",
          `#note {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-note-prefix");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-jump-link-search-word",
      name: "禁用 评论内容搜索关键词高亮",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-rich-text",
          "video-page-hide-jump-link-search-word",
          `#contents a[href*="search.bilibili.com"] {color: inherit !important;}
                #contents a[href*="search.bilibili.com"]:hover {color: #008AC5 !important;}
                #contents a[href*="search.bilibili.com"] img {display: none !important;}
                `
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-jump-link-search-word");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-reply-content-user-highlight",
      name: "禁用 评论中的@高亮",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-rich-text",
          "video-page-hide-reply-content-user-highlight",
          `#contents a[href*="space.bilibili.com"] {color: inherit !important;}
                #contents a[href*="space.bilibili.com"]:hover {color: #008AC5 !important;}
                `
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-reply-content-user-highlight");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-reply-dislike-reply-btn",
      name: "隐藏 踩/回复 只在hover时显示",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-renderer",
          // 一级评论
          "video-page-hide-root-reply-dislike-reply-btn",
          `#body {
                    --bili-comment-hover-more-display: 0 !important;
                }
                #body:hover {
                    --bili-comment-hover-more-display: 1 !important;
                }`
        );
        ShadowInstance.addShadowStyle(
          "bili-comment-reply-renderer",
          // 二级评论
          "video-page-hide-sub-reply-dislike-reply-btn",
          `
                #body {
                    --bili-comment-hover-more-display: 0 !important;
                }
                #body:hover {
                    --bili-comment-hover-more-display: 1 !important;
                }`
        );
        ShadowInstance.addShadowStyle(
          "bili-comment-action-buttons-renderer",
          "video-page-hide-root-reply-dislike-reply-btn",
          `#dislike button, #reply button, #more button {
                    display: block !important;
                    opacity: var(--bili-comment-action-buttons-more-display);
                    transition: opacity 0.2s 0.3s;
                }`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-root-reply-dislike-reply-btn");
        ShadowInstance.removeShadowStyle(
          "bili-comment-action-buttons-renderer",
          "video-page-hide-root-reply-dislike-reply-btn"
        );
      }
    },
    {
      type: "switch",
      id: "video-page-hide-emoji-large",
      name: "隐藏 大表情",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-rich-text",
          "video-page-hide-emoji-large",
          `#contents img:is(.emoji-large, [style^="width:50px"]) {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-emoji-large");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-emoji-large-zoom",
      name: "大表情变成小表情",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-rich-text",
          "video-page-hide-emoji-large-zoom",
          `#contents img:is(.emoji-large, [style^="width:50px"]) {zoom: 0.5 !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-emoji-large-zoom");
      }
    },
    {
      type: "switch",
      id: "video-page-reply-user-name-color-pink",
      name: "用户名 全部大会员色",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-user-info",
          "video-page-reply-user-name-color-pink",
          `#user-name {color: #FB7299 !important;}
                #user-name a {color: #FB7299 !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-pink");
      }
    },
    {
      type: "switch",
      id: "video-page-reply-user-name-color-default",
      name: "用户名 全部恢复默认色",
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-comment-user-info",
          "video-page-reply-user-name-color-default",
          `#user-name {color: #61666d !important;}
                #user-name a {color: #61666d !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-default");
      }
    },
    {
      type: "switch",
      id: "video-page-reply-view-image-optimize",
      name: "笔记图片 查看大图优化",
      defaultEnable: true,
      enableFn: () => {
        ShadowInstance.addShadowStyle(
          "bili-photoswipe",
          "video-page-reply-view-image-optimize",
          `#wrap:has(#thumb:empty) :is(#prev, #next) {display: none !important;}
                #prev, #next {zoom: 1.3;}
                #thumb {display: none !important;}`
        );
      },
      disableFn: () => {
        ShadowInstance.removeShadowStyle("bili-photoswipe", "video-page-reply-view-image-optimize");
      }
    },
    {
      type: "switch",
      id: "video-page-hide-comment",
      name: "隐藏 视频评论区 (播放页/番剧页)"
    },
    {
      type: "switch",
      id: "dynamic-page-hide-all-comment",
      name: "隐藏 动态评论区 (动态页/空间页)"
    }
  ];
  const commentGroups = [
    {
      name: "全站通用 - 评论区",
      fold: true,
      items: commentBasicItems
    }
  ];
  const _URLCleaner = class _URLCleaner {
    constructor() {
      __publicField(this, "origReplaceState", _unsafeWindow.history.replaceState);
      __publicField(this, "origPushState", _unsafeWindow.history.pushState);
      // URL清理函数
      __publicField(this, "cleanFnArr", []);
      try {
        this.hijack();
      } catch (err) {
        error("init URLCleaner error", err);
      }
    }
    static getInstance() {
      if (!_URLCleaner.instance) {
        _URLCleaner.instance = new _URLCleaner();
      }
      return _URLCleaner.instance;
    }
    hijack() {
      _unsafeWindow.history.replaceState = (data, unused, url) => {
        try {
          if (typeof url === "string") {
            if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) {
              url = `${location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
            }
            const cleanURL = this.cleanFnArr.reduce((curr, fn2) => fn2(curr), url);
            if (location.href.endsWith(cleanURL)) {
              return;
            }
            return this.origReplaceState.apply(_unsafeWindow.history, [data, unused, cleanURL]);
          }
          return this.origReplaceState.apply(_unsafeWindow.history, [data, unused, url]);
        } catch (err) {
          error("URLCleaner replaceState error", err);
          return this.origReplaceState.apply(_unsafeWindow.history, [data, unused, url]);
        }
      };
      _unsafeWindow.history.pushState = (data, unused, url) => {
        try {
          if (typeof url === "string") {
            if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) {
              url = `${location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
            }
            const cleanURL = this.cleanFnArr.reduce((curr, fn2) => fn2(curr), url);
            if (location.href.endsWith(cleanURL)) {
              return;
            }
            return this.origPushState.apply(_unsafeWindow.history, [data, unused, cleanURL]);
          }
          return this.origPushState.apply(_unsafeWindow.history, [data, unused, url]);
        } catch (err) {
          error("URLCleaner pushState error", err);
          return this.origReplaceState.apply(_unsafeWindow.history, [data, unused, url]);
        }
      };
    }
    clean() {
      try {
        const cleanURL = this.cleanFnArr.reduce((curr, fn2) => fn2(curr), location.href);
        if (location.href !== cleanURL) {
          this.origReplaceState.apply(_unsafeWindow.history, [null, "", cleanURL]);
        }
      } catch (err) {
        error("init URLCleaner error", err);
      }
    }
  };
  __publicField(_URLCleaner, "instance");
  let URLCleaner = _URLCleaner;
  const URLCleanerInstance = URLCleaner.getInstance();
  const commonBasicItems = [
    {
      type: "switch",
      id: "border-radius",
      name: "页面直角化，去除圆角",
      // 根据当前页面选定attribute name
      attrName: (() => {
        if (isPageDynamic()) {
          return "border-radius-dynamic";
        }
        if (isPageLive()) {
          return "border-radius-live";
        }
        if (isPageSearch()) {
          return "border-radius-search";
        }
        if (isPageVideo() || isPagePlaylist()) {
          return "border-radius-video";
        }
        if (isPageBangumi()) {
          return "border-radius-bangumi";
        }
        if (isPageHomepage()) {
          return "border-radius-homepage";
        }
        if (isPagePopular()) {
          return "border-radius-popular";
        }
        if (isPageSpace()) {
          return "border-radius-space";
        }
        if (isPageChannel()) {
          return "border-radius-channel";
        }
        return void 0;
      })()
    },
    {
      type: "switch",
      id: "beauty-scrollbar",
      name: "美化页面滚动条",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-watchlater-button",
      name: "隐藏 视频卡片 稍后再看按钮"
    },
    {
      type: "switch",
      id: "url-cleaner",
      name: "URL参数净化",
      description: ["给 UP 充电时若报错，尝试关闭本功能并刷新"],
      defaultEnable: true,
      noStyle: true,
      /**
       * URL净化，移除query string中的跟踪参数/无用参数
       * 净化掉vd_source参数会导致充电窗口载入失败
       */
      enableFn: async () => {
        const cleanParams = (url) => {
          try {
            if (url.match(/live\.bilibili\.com\/(p\/html|activity|blackboard)/)) {
              return url;
            }
            const keysToRemove = /* @__PURE__ */ new Set([
              "from_source",
              "spm_id_from",
              "search_source",
              "vd_source",
              "unique_k",
              "is_story_h5",
              "from_spmid",
              "share_plat",
              "share_medium",
              "share_from",
              "share_source",
              "share_tag",
              "up_id",
              "timestamp",
              "mid",
              "live_from",
              "launch_id",
              "session_id",
              "share_session_id",
              "broadcast_type",
              "is_room_feed",
              "spmid",
              "plat_id",
              "goto",
              "report_flow_data",
              "trackid",
              "live_form",
              "track_id",
              "from",
              "visit_id",
              "extra_jump_from"
            ]);
            if (isPageSearch()) {
              keysToRemove.add("vt");
            }
            if (isPageLive()) {
              keysToRemove.add("bbid");
              keysToRemove.add("ts");
              keysToRemove.add("hotRank");
              keysToRemove.add("popular_rank");
            }
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const temp = [];
            for (const k2 of params.keys()) {
              keysToRemove.has(k2) && temp.push(k2);
            }
            for (const k2 of temp) {
              params.delete(k2);
            }
            params.get("p") === "1" && params.delete("p");
            urlObj.search = params.toString().replace(/\/$/, "");
            return urlObj.toString();
          } catch (err) {
            return url;
          }
        };
        URLCleanerInstance.cleanFnArr.push(cleanParams);
        URLCleanerInstance.clean();
      }
    },
    {
      type: "switch",
      id: "hide-footer",
      name: "隐藏 页底footer"
    },
    {
      type: "switch",
      id: "hide-footer",
      name: "修复字体 (实验功能)",
      defaultEnable: true,
      // 根据当前页面选定attribute name
      attrName: (() => {
        if (isPageLive()) {
          return "font-patch-live";
        }
        if (isPageDynamic()) {
          return "font-patch-dynamic";
        }
        if (isPagePopular()) {
          return "font-patch-popular";
        }
        if (isPageWatchlater()) {
          return "font-patch-watchlater";
        }
        if (isPageSpace()) {
          return "font-patch-space";
        }
        return void 0;
      })(),
      description: ["让全站字体与首页字体一致", "生效页面：动态、直播、热门、稍后再看"]
    }
  ];
  const commonHeaderCenterItems = [
    {
      type: "switch",
      id: "common-hide-nav-search-rcmd",
      name: "隐藏 推荐搜索"
    },
    {
      type: "switch",
      id: "common-hide-nav-search-history",
      name: "隐藏 搜索历史"
    },
    {
      type: "switch",
      id: "common-hide-nav-search-trending",
      name: "隐藏 bilibili热搜"
    },
    {
      type: "switch",
      id: "common-nav-search-middle-justify",
      name: "修复 搜索框居中"
    }
  ];
  const commonHeaderLeftItems = [
    {
      type: "switch",
      id: "common-hide-nav-homepage-logo",
      name: "隐藏 主站Logo"
    },
    {
      type: "switch",
      id: "common-hide-nav-homepage",
      name: "隐藏 首页"
    },
    {
      type: "switch",
      id: "common-hide-nav-anime",
      name: "隐藏 番剧"
    },
    {
      type: "switch",
      id: "common-hide-nav-live",
      name: "隐藏 直播"
    },
    {
      type: "switch",
      id: "common-hide-nav-game",
      name: "隐藏 游戏中心"
    },
    {
      type: "switch",
      id: "common-hide-nav-vipshop",
      name: "隐藏 会员购"
    },
    {
      type: "switch",
      id: "common-hide-nav-manga",
      name: "隐藏 漫画"
    },
    {
      type: "switch",
      id: "common-hide-nav-match",
      name: "隐藏 赛事"
    },
    {
      type: "switch",
      id: "common-hide-nav-bdu",
      name: "隐藏 百大评选"
    },
    {
      type: "switch",
      id: "common-hide-nav-bml",
      name: "隐藏 BML"
    },
    {
      type: "switch",
      id: "common-hide-nav-download-app",
      name: "隐藏 下载客户端",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "common-hide-nav-blackboard",
      name: "隐藏 所有官方活动/活动直播"
    },
    {
      type: "switch",
      id: "common-hide-nav-channel-panel-popover",
      name: "隐藏 首页弹出框"
    },
    {
      type: "switch",
      id: "common-hide-nav-anime-popover",
      name: "隐藏 番剧弹出框"
    },
    {
      type: "switch",
      id: "common-hide-nav-live-popover",
      name: "隐藏 直播弹出框"
    },
    {
      type: "switch",
      id: "common-hide-nav-game-popover",
      name: "隐藏 游戏中心弹出框"
    },
    {
      type: "switch",
      id: "common-hide-nav-manga-popover",
      name: "隐藏 漫画弹出框"
    }
  ];
  const commonHeaderRightItems = [
    {
      type: "switch",
      id: "common-hide-nav-avatar",
      name: "隐藏 头像"
    },
    {
      type: "switch",
      id: "common-hide-nav-vip",
      name: "隐藏 大会员",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "common-hide-nav-message",
      name: "隐藏 消息"
    },
    {
      type: "switch",
      id: "common-hide-nav-message-red-num",
      name: "隐藏 消息小红点"
    },
    {
      type: "switch",
      id: "common-hide-nav-dynamic",
      name: "隐藏 动态"
    },
    {
      type: "switch",
      id: "common-hide-nav-dynamic-red-num",
      name: "隐藏 动态小红点"
    },
    {
      type: "switch",
      id: "common-hide-nav-favorite",
      name: "隐藏 收藏"
    },
    {
      type: "switch",
      id: "common-nav-favorite-select-watchlater",
      name: "收藏弹出框 自动选中稍后再看",
      noStyle: true,
      enableFn: async () => {
        if (!CSS.supports("selector(:has(*))")) {
          return;
        }
        let cnt = 0;
        const id = setInterval(() => {
          const ele = document.querySelector(
            `.right-entry .v-popover-wrap:has(.right-entry__outside[href$="/favlist"]),
                        .nav-user-center .user-con .item:has(.mini-favorite)`
          );
          if (ele) {
            clearInterval(id);
            ele.addEventListener("mouseenter", () => {
              let innerCnt = 0;
              const watchLaterId = setInterval(() => {
                const watchlater = document.querySelector(
                  `:is(.favorite-panel-popover, .vp-container .tabs-panel) .tab-item:nth-child(2)`
                );
                if (watchlater) {
                  watchlater.click();
                  clearInterval(watchLaterId);
                } else {
                  innerCnt++;
                  innerCnt > 250 && clearInterval(watchLaterId);
                }
              }, 20);
            });
          } else {
            cnt++;
            cnt > 100 && clearInterval(id);
          }
        }, 200);
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "common-hide-nav-history",
      name: "隐藏 历史"
    },
    {
      type: "switch",
      id: "common-hide-nav-member",
      name: "隐藏 创作中心"
    },
    {
      type: "switch",
      id: "common-hide-nav-upload",
      name: "隐藏 投稿"
    }
  ];
  const commonHeaderWidthItems = [
    {
      type: "number",
      id: "common-header-bar-padding-left",
      name: "左边界距离（-1禁用）",
      minValue: -1,
      maxValue: 2e3,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--common-header-bar-padding-left", `${value}px`);
      }
    },
    {
      type: "number",
      id: "common-header-bar-search-width",
      name: "搜索框宽度（-1禁用）",
      minValue: -1,
      maxValue: 2e3,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--common-header-bar-search-width", `${value}px`);
      }
    },
    {
      type: "number",
      id: "common-header-bar-search-margin-left",
      name: "搜索框与左侧距离（-1禁用）",
      minValue: -1,
      maxValue: 2e3,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--common-header-bar-search-margin-left", `${value}px`);
      }
    },
    {
      type: "number",
      id: "common-header-bar-padding-right",
      name: "右边界距离（-1禁用）",
      minValue: -1,
      maxValue: 2e3,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--common-header-bar-padding-right", `${value}px`);
      }
    }
  ];
  const commonGroups = [
    {
      name: "全站通用 - 基本功能",
      fold: true,
      items: commonBasicItems
    },
    {
      name: "全站通用 - 顶栏 左侧",
      fold: true,
      items: commonHeaderLeftItems
    },
    {
      name: "全站通用 - 顶栏 搜索框",
      fold: true,
      items: commonHeaderCenterItems
    },
    {
      name: "全站通用 - 顶栏 右侧",
      fold: true,
      items: commonHeaderRightItems
    },
    {
      name: "全站通用 - 顶栏 数值设定",
      fold: true,
      items: commonHeaderWidthItems
    }
  ];
  const debugBasicItems = [
    {
      type: "switch",
      id: "debug-rules",
      name: "Debug Rules"
    },
    {
      type: "switch",
      id: "debug-filters",
      name: "Debug Filters",
      description: ["严重影响过滤性能"]
    }
  ];
  const debugGroups = [
    {
      name: "日志输出",
      fold: true,
      items: debugBasicItems
    }
  ];
  const dynamicBasicItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-fixed-header",
      name: "顶栏 不再吸附顶部"
    },
    {
      type: "switch",
      id: "exchange-dynamic-page-left-right-aside",
      name: "交换 左栏与右栏位置"
    }
  ];
  const dynamicCenterDynItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-avatar-pendent",
      name: "隐藏 头像框"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-avatar-icon",
      name: "隐藏 头像徽章"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-ornament",
      name: "隐藏 动态右侧饰品"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-dispute",
      name: "隐藏 警告notice",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-official-topic",
      name: "隐藏 官方话题Tag"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-text-topic",
      name: "禁用 普通话题#Tag#高亮"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-item-interaction",
      name: "隐藏 动态精选互动 XXX赞了/XXX回复"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-card-reserve",
      name: "隐藏 视频预约/直播预约动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-card-goods",
      name: "隐藏 带货动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-lottery",
      name: "隐藏 抽奖动态 (含转发)"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-forward",
      name: "隐藏 转发的动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-vote",
      name: "隐藏 投票动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-live",
      name: "隐藏 直播通知动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-blocked",
      name: "隐藏 被block的充电动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-charge-video",
      name: "隐藏 全部充电视频 (含已充电)"
    },
    {
      type: "switch",
      id: "dynamic-page-unfold-dynamic",
      name: "自动展开 相同UP主被折叠的动态",
      noStyle: true,
      enableFn: async () => {
        const unfold = () => {
          const dynFoldNodes = document.querySelectorAll("main .bili-dyn-list__item .bili-dyn-item-fold");
          if (dynFoldNodes.length) {
            dynFoldNodes.forEach((e2) => {
              e2 instanceof HTMLDivElement && e2.click();
            });
          }
        };
        setInterval(unfold, 500);
      }
    }
  ];
  const dynamicCenterTopItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-publishing",
      name: "隐藏 动态发布框",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "dynamic-page-up-list-dual-line-mode",
      name: "双行显示 UP 主列表"
    },
    {
      type: "switch",
      id: "dynamic-page-up-list-checked-item-opacity",
      name: "淡化 UP 主列表 已查看项"
    },
    {
      type: "switch",
      id: "dynamic-page-up-list-checked-item-hide",
      name: "隐藏 UP 主列表 已查看项"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-list-tabs",
      name: "隐藏 动态分类Tab bar"
    }
  ];
  const dynamicLayoutItems = [
    {
      type: "number",
      id: "dynamic-list-width",
      name: "动态列表 中栏宽度 (0禁用)",
      minValue: 0,
      maxValue: 100,
      step: 1,
      defaultValue: 0,
      disableValue: 0,
      addonText: "vw",
      fn: (value) => {
        document.documentElement.style.setProperty("--dynamic-list-width", value + "vw");
      }
    },
    {
      type: "number",
      id: "dynamic-detail-width",
      name: "动态详情 中栏宽度 (0禁用)",
      minValue: 0,
      maxValue: 100,
      step: 1,
      defaultValue: 0,
      disableValue: 0,
      addonText: "vw",
      fn: (value) => {
        document.documentElement.style.setProperty("--dynamic-detail-width", value + "vw");
      }
    }
  ];
  const dynamicLeftItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-my-info",
      name: "隐藏 个人信息框"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-live-users__item__living",
      name: "隐藏 直播中Logo"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-aside-left",
      name: "隐藏 整个左栏"
    }
  ];
  const dynamicRightItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-banner",
      name: "隐藏 社区中心",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-ads",
      name: "隐藏 广告",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-topic-box",
      name: "隐藏 话题列表"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-aside-right",
      name: "隐藏 整个右栏"
    }
  ];
  const dynamicSidebar = [
    {
      type: "switch",
      id: "hide-dynamic-page-sidebar-old-version",
      name: "隐藏 回到旧版",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-dynamic-page-sidebar-back-to-top",
      name: "隐藏 回顶部"
    }
  ];
  const dynamicGroups = [
    {
      name: "基本功能",
      fold: true,
      items: dynamicBasicItems
    },
    {
      name: "左栏 个人信息/正在直播",
      fold: true,
      items: dynamicLeftItems
    },
    {
      name: "右栏 热门话题",
      fold: true,
      items: dynamicRightItems
    },
    {
      name: "中栏 顶部功能",
      fold: true,
      items: dynamicCenterTopItems
    },
    {
      name: "中栏 动态列表",
      fold: true,
      items: dynamicCenterDynItems
    },
    {
      name: "动态宽度调节",
      fold: true,
      items: dynamicLayoutItems
    },
    {
      name: "页面右下角 小按钮",
      fold: true,
      items: dynamicSidebar
    }
  ];
  const festivalDanmakuItems = [
    {
      type: "string",
      id: "video-page-danmaku-font-family",
      name: "弹幕字体",
      description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
      defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-family",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-danmaku-font-weight",
      name: "弹幕字重",
      description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-weight",
          value.trim().replace(/;$/, "")
        );
      }
    }
  ];
  const festivalDanmakuControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-online",
      name: "隐藏 同时在看人数"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-dm",
      name: "隐藏 装填弹幕数量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-switch",
      name: "隐藏 弹幕开关"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-setting",
      name: "隐藏 弹幕显示设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-btn-dm",
      name: "隐藏 弹幕样式"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-input",
      name: "隐藏 占位文字",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-hint",
      name: "隐藏 弹幕礼仪",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-btn-send",
      name: "隐藏 发送按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-postpanel",
      name: "隐藏 智能弹幕/广告弹幕"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-sending-area",
      name: "非全屏下 关闭弹幕栏",
      description: ["字母 D 是弹幕开关快捷键"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-inputbar",
      name: "全屏下 关闭弹幕输入框"
    }
  ];
  const festivalPlayerItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-guide-all",
      name: "隐藏 一键三连"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-vote",
      name: "隐藏 投票"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-qoe-feedback",
      name: "隐藏 播放效果调查",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-score",
      name: "隐藏 评分"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-score-sum",
      name: "隐藏 评分总结"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-clock",
      name: "隐藏 打卡"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-cmtime",
      name: "隐藏 心动"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-cmd-shrink",
      name: "隐藏 迷你弹窗"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-reserve",
      name: "隐藏 视频预告"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-link",
      name: "隐藏 视频链接"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-cmd-dm-wrap",
      name: "隐藏 播放器内所有弹窗 (强制)",
      description: ["启用本项时 无需开启上述功能"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-title",
      name: "隐藏 全屏下 播放器内标题"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-music",
      name: "隐藏 视频音乐链接"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-follow",
      name: "隐藏 左上角 关注UP主",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-issue",
      name: "隐藏 右上角 反馈按钮",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-state-wrap",
      name: "隐藏 视频暂停时大Logo"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ending-related",
      name: "隐藏 播放结束后视频推荐"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dialog-wrap",
      name: "隐藏 弹幕悬停点赞/复制/举报"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-high-icon",
      name: "隐藏 高赞弹幕前点赞按钮"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-dm-vip-white",
      name: "彩色渐变弹幕 变成白色"
    }
  ];
  const festivalPlayerControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-prev",
      name: "隐藏 上一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-play",
      name: "隐藏 播放/暂停"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-next",
      name: "隐藏 下一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-viewpoint",
      name: "隐藏 章节列表"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-flac",
      name: "隐藏 Hi-Res无损"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-quality",
      name: "隐藏 清晰度"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-eplist",
      name: "隐藏 选集"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-playbackrate",
      name: "隐藏 倍速"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-subtitle",
      name: "隐藏 字幕"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-volume",
      name: "隐藏 音量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-setting",
      name: "隐藏 视频设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-pip",
      name: "隐藏 画中画",
      description: ["Chrome / Edge 浏览器可用", "Firefox 可在浏览器设置中关闭"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-wide",
      name: "隐藏 宽屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-web",
      name: "隐藏 网页全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-full",
      name: "隐藏 全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-pbp-pin",
      name: "隐藏 高能进度条 图钉按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-shadow-progress-area",
      name: "隐藏 底边mini视频进度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-show-bpx-player-pbp",
      name: "控制栏收起时 显示高能进度条"
    }
  ];
  const festivalSubtitleItems = [
    {
      type: "string",
      id: "video-page-subtitle-font-color",
      name: "字幕颜色",
      description: ["遵循 CSS color 语法，留空为禁用"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-color",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-font-family",
      name: "字幕字体",
      description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
      defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-family",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-font-weight",
      name: "字幕字重",
      description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-weight",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-text-stroke-color",
      name: "描边颜色",
      description: ["遵循 CSS color 语法，留空为禁用", '官方字幕设定需选择 "无描边"'],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-text-stroke-color",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "number",
      id: "video-page-subtitle-text-stroke-width",
      name: "描边宽度 (0为禁用)",
      minValue: 0,
      maxValue: 10,
      step: 0.01,
      defaultValue: 3.5,
      disableValue: 0,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-width", `${value}px`);
      }
    }
  ];
  const festivalGroups = [
    {
      name: "播放器",
      fold: true,
      items: festivalPlayerItems
    },
    {
      name: "播放控制栏",
      fold: true,
      items: festivalPlayerControlItems
    },
    {
      name: "弹幕控制栏",
      fold: true,
      items: festivalDanmakuControlItems
    },
    {
      name: "弹幕样式",
      fold: true,
      items: festivalDanmakuItems
    },
    {
      name: "字幕样式",
      fold: true,
      items: festivalSubtitleItems
    }
  ];
  const homepageBasicItems = [
    {
      type: "switch",
      id: "homepage-hide-banner",
      name: "隐藏 横幅banner",
      description: ["同步生效：首页、分区页、热门页"]
    },
    {
      type: "switch",
      id: "homepage-hide-recommend-swipe",
      name: "隐藏 大图活动轮播",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-subarea",
      name: "隐藏 整个分区栏"
    },
    {
      type: "switch",
      id: "homepage-hide-sticky-header",
      name: "隐藏 滚动页面时 顶部吸附顶栏"
    },
    {
      type: "switch",
      id: "homepage-hide-sticky-subarea",
      name: "隐藏 滚动页面时 顶部吸附分区栏",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-adblock-tips",
      name: "隐藏 顶部adblock提示",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-revert-channel-dynamic-icon",
      name: "恢复 原始动态按钮"
    }
  ];
  const homepageLayoutItems = [
    {
      type: "list",
      id: "homepage-layout",
      name: "修改 视频列表列数",
      description: ["未启用时，B 站自动判断列数"],
      defaultValue: "homepage-layout-disable",
      disableValue: "homepage-layout-disable",
      options: [
        {
          id: "homepage-layout-disable",
          name: "未启用"
        },
        {
          id: "homepage-layout-4-column",
          name: "4 列布局"
        },
        {
          id: "homepage-layout-5-column",
          name: "5 列布局"
        },
        {
          id: "homepage-layout-6-column",
          name: "6 列布局"
        }
      ]
    },
    {
      type: "number",
      id: "homepage-layout-padding",
      name: "修改 页面两侧边距 (-1禁用)",
      minValue: -1,
      maxValue: 500,
      step: 1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--homepage-layout-padding", `${value}px`);
      }
    }
  ];
  const homepageRcmdItems = [
    {
      type: "switch",
      id: "homepage-increase-rcmd-list-font-size",
      name: "增大 视频信息字号"
    },
    {
      type: "switch",
      id: "homepage-move-no-interest",
      name: "移动 负反馈按钮 恢复标题宽度",
      description: ["负反馈报文可能被其他插件阻断而失效", "可 F12 检查负反馈时有无报错"]
    },
    {
      type: "switch",
      id: "homepage-hide-no-interest",
      name: "隐藏 负反馈按钮 恢复标题宽度"
    },
    {
      type: "switch",
      id: "homepage-hide-up-info-icon",
      name: "隐藏 视频tag (已关注/1万点赞)"
    },
    {
      type: "switch",
      id: "homepage-hide-video-info-date",
      name: "隐藏 发布时间"
    },
    {
      type: "switch",
      id: "homepage-hide-danmaku-count",
      name: "隐藏 弹幕数",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-bili-watch-later-tip",
      name: "隐藏 稍后再看提示语"
    },
    {
      type: "switch",
      id: "homepage-hide-inline-player-danmaku",
      name: "隐藏 视频预览中的弹幕"
    },
    {
      type: "switch",
      id: "homepage-hide-ad-card",
      name: "隐藏 广告",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-live-card-recommend",
      name: "隐藏 直播间推荐",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-simple-sub-area-card-recommend",
      name: "简化 分区视频推荐",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-sub-area-card-recommend",
      name: "隐藏 分区视频推荐"
    },
    {
      type: "switch",
      id: "homepage-hide-skeleton-animation",
      name: "关闭 视频载入 骨架动效"
    },
    {
      type: "switch",
      id: "homepage-hide-skeleton-before-anchor",
      name: "隐藏 加载锚点之前的骨架",
      defaultEnable: true,
      description: ["推荐，会让视频列表加载更早一些"]
    },
    {
      type: "switch",
      id: "homepage-hide-skeleton",
      name: "隐藏 全部加载骨架"
    },
    {
      type: "switch",
      id: "homepage-increase-rcmd-load-size",
      name: "增大 视频载入 视频数量 (实验功能)",
      enableFn: () => {
        fetchHook.addPreFn((input, init) => {
          var _a;
          if (typeof input === "string" && input.includes("api.bilibili.com") && input.includes("feed/rcmd") && ((_a = init == null ? void 0 : init.method) == null ? void 0 : _a.toUpperCase()) === "GET") {
            input = input.replace("&ps=12&", "&ps=24&");
          }
          return input;
        });
      }
    },
    {
      type: "switch",
      id: "homepage-rcmd-video-preload",
      name: "启用 视频列表预加载 (不稳定功能)",
      description: ["会默认隐藏分区视频", '建议开启 "增大视频载入数量"', "若影响视频载入或造成卡顿，请关闭本功能"],
      enableFn: async () => {
        let cnt = 0;
        const id = setInterval(() => {
          const anchor = document.querySelector(".load-more-anchor");
          if (anchor) {
            clearInterval(id);
            let lastScrollTop = 0;
            let isPreload = false;
            window.addEventListener("scroll", function() {
              const scrollTop = window.scrollY || document.documentElement.scrollTop;
              if (scrollTop > lastScrollTop) {
                const gap = innerHeight - anchor.getBoundingClientRect().top;
                if (gap > -innerHeight * 0.75 && !isPreload) {
                  anchor.classList.add("preload");
                  isPreload = true;
                } else {
                  isPreload && anchor.classList.remove("preload");
                  isPreload = false;
                }
              } else {
                isPreload && anchor.classList.remove("preload");
                isPreload = false;
              }
              lastScrollTop = scrollTop;
            });
          }
          if (++cnt > 80) {
            clearInterval(id);
          }
        }, 250);
      },
      enableFnRunAt: "document-end"
    }
  ];
  const homepageSidebarItems = [
    {
      type: "switch",
      id: "homepage-hide-desktop-download-tip",
      name: "隐藏 下载桌面端弹窗",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-trial-feed-wrap",
      name: "隐藏 下滑浏览推荐提示",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-feed-roll-btn",
      name: "隐藏 换一换"
    },
    {
      type: "switch",
      id: "homepage-hide-watchlater-pip-button",
      name: "隐藏 稍后再看"
    },
    {
      type: "switch",
      id: "homepage-hide-adcard-button",
      defaultEnable: true,
      name: "隐藏 广告"
    },
    {
      type: "switch",
      id: "homepage-hide-flexible-roll-btn-text",
      name: "隐藏 刷新按钮 文字提示"
    },
    {
      type: "switch",
      id: "homepage-hide-flexible-roll-btn",
      name: "隐藏 刷新按钮"
    },
    {
      type: "switch",
      id: "homepage-hide-feedback",
      name: "隐藏 客服和反馈",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "homepage-hide-top-btn",
      name: "隐藏 回顶部"
    }
  ];
  const homepageGroups = [
    {
      name: "基本功能",
      items: homepageBasicItems
    },
    {
      name: "页面布局",
      items: homepageLayoutItems
    },
    {
      name: "视频列表",
      items: homepageRcmdItems
    },
    {
      name: "页面侧栏 小组件",
      items: homepageSidebarItems
    }
  ];
  const waitForHead = () => {
    return new Promise((resolve) => {
      if (document.head) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.head) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
  };
  const waitForBody = () => {
    return new Promise((resolve) => {
      if (document.body) {
        resolve();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
  };
  const liveBasicItems = [
    {
      type: "switch",
      id: "live-page-sidebar-vm",
      name: "隐藏 页面右侧按钮 实验室/关注",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-default-skin",
      name: "禁用 播放器皮肤"
    },
    {
      type: "switch",
      id: "live-page-remove-wallpaper",
      name: "禁用 直播背景"
    },
    {
      type: "switch",
      id: "activity-live-auto-jump",
      name: "活动直播自动跳转普通直播",
      noStyle: true,
      enableFn: async () => {
        if (!/\/\d+/.test(location.pathname)) {
          return;
        }
        if (self !== top) {
          return;
        }
        let cnt = 0;
        const id = setInterval(() => {
          if (document.querySelector(
            '.rendererRoot, #main.live-activity-full-main, #internationalHeader, iframe[src*="live.bilibili.com/blanc/"]'
          )) {
            location.href = location.href.replace("live.bilibili.com/", "live.bilibili.com/blanc/");
            clearInterval(id);
          }
          ++cnt > 50 && clearInterval(id);
        }, 200);
      }
    },
    {
      type: "switch",
      id: "live-page-default-webscreen",
      name: "默认网页全屏播放",
      description: ["实验功能，偶尔会失效"],
      noStyle: true,
      enableFn: async () => {
        if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) {
          return;
        }
        if (self !== top) {
          return;
        }
        waitForBody().then(() => {
          requestAnimationFrame(() => {
            document.body.classList.add("player-full-win");
            document.body.classList.add("over-hidden");
          });
        });
        document.addEventListener("DOMContentLoaded", () => {
          let cnt = 0;
          const id = setInterval(() => {
            var _a, _b;
            const player = _unsafeWindow.livePlayer || ((_a = _unsafeWindow.EmbedPlayer) == null ? void 0 : _a.instance);
            const status = (_b = player == null ? void 0 : player.getPlayerInfo()) == null ? void 0 : _b.playerStatus;
            if (player && status === 0) {
              requestAnimationFrame(() => {
                document.body.classList.remove("player-full-win");
                document.body.classList.remove("over-hidden");
                if (!document.querySelector('iframe[src*="live.bilibili.com/blanc"]')) {
                  player.setFullscreenStatus(1);
                }
              });
              clearInterval(id);
            }
            ++cnt > 20 && clearInterval(id);
          }, 500);
        });
      }
    },
    {
      type: "switch",
      id: "auto-best-quality",
      name: "自动切换最高画质 (实验功能)",
      description: ["自动画质时也会切换，但仍显示[自动]"],
      noStyle: true,
      enableFn: async () => {
        if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) {
          return;
        }
        if (self !== top) {
          return;
        }
        const qualityFn = () => {
          var _a;
          const player = _unsafeWindow.livePlayer || ((_a = _unsafeWindow.EmbedPlayer) == null ? void 0 : _a.instance);
          if (player) {
            try {
              const info = player == null ? void 0 : player.getPlayerInfo();
              const arr = player == null ? void 0 : player.getPlayerInfo().qualityCandidates;
              if (info && arr && arr.length) {
                let maxQn = 0;
                arr.forEach((v2) => {
                  if (v2.qn && parseInt(v2.qn) > maxQn) {
                    maxQn = parseInt(v2.qn);
                  }
                });
                if (maxQn && info.quality && maxQn > parseInt(info.quality)) {
                  player.switchQuality(`${maxQn}`);
                }
              }
            } catch (err) {
              error("auto-best-quality error", err);
            }
          }
        };
        setTimeout(qualityFn, 2e3);
      },
      enableFnRunAt: "document-end"
    }
  ];
  const liveBelowItems = [
    {
      type: "switch",
      id: "live-page-flip-view",
      name: "隐藏 活动海报",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-room-info-ctnr",
      name: "隐藏 直播间推荐/直播间介绍"
    },
    {
      type: "switch",
      id: "live-page-room-feed",
      name: "隐藏 主播动态"
    },
    {
      type: "switch",
      id: "live-page-announcement-cntr",
      name: "隐藏 主播公告"
    },
    {
      type: "switch",
      id: "live-page-sections-vm",
      name: "隐藏 直播下方全部内容"
    }
  ];
  const liveHeaderCenterItems = [
    {
      type: "switch",
      id: "live-page-nav-search-rcmd",
      name: "隐藏 推荐搜索"
    },
    {
      type: "switch",
      id: "live-page-nav-search-history",
      name: "隐藏 搜索历史"
    },
    {
      type: "switch",
      id: "live-page-nav-search-trending",
      name: "隐藏 bilibili热搜"
    },
    {
      type: "switch",
      id: "live-page-header-search-block",
      name: "隐藏 搜索框"
    }
  ];
  const liveHeaderLeftItems = [
    {
      type: "switch",
      id: "live-page-header-entry-logo",
      name: "隐藏 直播LOGO"
    },
    {
      type: "switch",
      id: "live-page-header-entry-title",
      name: "隐藏 首页"
    },
    {
      type: "switch",
      id: "live-page-header-live",
      name: "隐藏 直播"
    },
    {
      type: "switch",
      id: "live-page-header-net-game",
      name: "隐藏 网游"
    },
    {
      type: "switch",
      id: "live-page-header-mobile-game",
      name: "隐藏 手游"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-game",
      name: "隐藏 单机游戏"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-vtuber",
      name: "隐藏 虚拟主播"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-entertainment",
      name: "隐藏 娱乐"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-radio",
      name: "隐藏 电台"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-match",
      name: "隐藏 赛事"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-chatroom",
      name: "隐藏 聊天室"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-living",
      name: "隐藏 生活"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-knowledge",
      name: "隐藏 知识"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-helpmeplay",
      name: "隐藏 帮我玩"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-interact",
      name: "隐藏 互动玩法"
    },
    {
      type: "switch",
      id: "live-page-header-standalone-shopping",
      name: "隐藏 购物"
    },
    {
      type: "switch",
      id: "live-page-header-showmore-link",
      name: "隐藏 更多",
      defaultEnable: true
    }
  ];
  const liveHeaderRightItems = [
    {
      type: "switch",
      id: "live-page-header-avatar",
      name: "隐藏 头像"
    },
    {
      type: "switch",
      id: "live-page-header-follow-panel",
      name: "隐藏 关注"
    },
    {
      type: "switch",
      id: "live-page-header-recharge",
      name: "隐藏 购买电池"
    },
    {
      type: "switch",
      id: "live-page-header-bili-download-panel",
      name: "隐藏 下载客户端",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-header-go-live",
      name: "隐藏 我要开播",
      defaultEnable: true
    }
  ];
  const liveInfoItems = [
    {
      type: "switch",
      id: "live-page-head-info-avatar-pendant",
      name: "隐藏 头像饰品"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-follow-ctnr",
      name: "隐藏 粉丝团"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-visited",
      name: "隐藏 xx人看过"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-popular",
      name: "隐藏 人气"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-like",
      name: "隐藏 点赞"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-report",
      name: "隐藏 举报",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-upper-row-share",
      name: "隐藏 分享",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-lower-row-hot-rank",
      name: "隐藏 人气榜",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-lower-row-gift-planet-entry",
      name: "隐藏 礼物"
    },
    {
      type: "switch",
      id: "live-page-head-info-vm-lower-row-activity-gather-entry",
      name: "隐藏 活动",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-info-vm",
      name: "隐藏 整个信息栏"
    }
  ];
  const livePlayerItems = [
    {
      type: "switch",
      id: "live-page-head-web-player-icon-feedback",
      name: "隐藏 反馈按钮",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-web-player-shop-popover-vm",
      name: "隐藏 购物小橙车提示",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-web-player-awesome-pk-vm",
      name: "隐藏 直播PK特效"
    },
    {
      type: "switch",
      id: "live-page-web-player-watermark",
      name: "隐藏 直播水印",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-web-player-announcement-wrapper",
      name: "隐藏 滚动礼物通告"
    },
    {
      type: "switch",
      id: "live-page-head-web-player-game-id",
      name: "隐藏 幻星互动游戏",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-web-player-research-container",
      name: "隐藏 直播卡顿打分",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-head-web-player-live-lottery",
      name: "隐藏 天选时刻"
    },
    {
      type: "switch",
      id: "live-page-combo-danmaku",
      name: "隐藏 播放器顶部变动计数弹幕"
    },
    {
      type: "switch",
      id: "live-page-clean-all-danmaku-small-emoji",
      name: "隐藏 弹幕中的小表情"
    },
    {
      type: "switch",
      id: "live-page-clean-all-danmaku-big-emoji",
      name: "隐藏 弹幕中的大表情"
    },
    {
      type: "switch",
      id: "live-page-gift-control-vm",
      name: "隐藏 礼物栏"
    },
    {
      type: "switch",
      id: "live-page-fullscreen-danmaku-vm",
      name: "全屏下 隐藏弹幕发送框"
    }
  ];
  const liveRightItems = [
    {
      type: "switch",
      id: "live-page-rank-list-vm-fold",
      name: "折叠 排行榜/大航海",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-rank-list-vm",
      name: "隐藏 排行榜/大航海"
    },
    {
      type: "switch",
      id: "live-page-compact-danmaku",
      name: "使弹幕列表紧凑",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-convention-msg",
      name: "隐藏 系统提示",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-rank-icon",
      name: "隐藏 用户排名"
    },
    {
      type: "switch",
      id: "live-page-title-label",
      name: "隐藏 头衔装扮"
    },
    {
      type: "switch",
      id: "live-page-wealth-medal-ctnr",
      name: "隐藏 用户等级",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-group-medal-ctnr",
      name: "隐藏 团体勋章"
    },
    {
      type: "switch",
      id: "live-page-fans-medal-item-ctnr",
      name: "隐藏 粉丝牌"
    },
    {
      type: "switch",
      id: "live-page-chat-item-background-color",
      name: "隐藏 弹幕高亮底色"
    },
    {
      type: "switch",
      id: "live-page-gift-item",
      name: "隐藏 礼物弹幕"
    },
    {
      type: "switch",
      id: "live-page-chat-item-top3-notice",
      name: "隐藏 高能用户提示"
    },
    {
      type: "switch",
      id: "live-page-brush-prompt",
      name: "隐藏 底部滚动提示",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-combo-card-countdown",
      name: "隐藏 互动框 (倒计时互动)",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-combo-card",
      name: "隐藏 互动框 (他们都在说)",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-service-card-container",
      name: "隐藏 互动框 (找TA玩)",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-vote-card",
      name: "隐藏 互动框 投票",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "live-page-control-panel-icon-row",
      name: "隐藏 发送框 功能按钮"
    },
    {
      type: "switch",
      id: "live-page-chat-input-ctnr-medal-section",
      name: "隐藏 发送框 粉丝勋章"
    },
    {
      type: "switch",
      id: "live-page-chat-input-ctnr-send-btn",
      name: "隐藏 发送框 发送按钮 (回车发送)"
    },
    {
      type: "switch",
      id: "live-page-chat-input-ctnr",
      name: "隐藏 发送框"
    },
    {
      type: "switch",
      id: "live-page-chat-control-panel",
      name: "隐藏 弹幕栏底部全部功能"
    }
  ];
  const liveGroups = [
    {
      name: "基本功能",
      fold: true,
      items: liveBasicItems
    },
    {
      name: "直播信息栏",
      fold: true,
      items: liveInfoItems
    },
    {
      name: "播放器",
      fold: true,
      items: livePlayerItems
    },
    {
      name: "右栏 弹幕列表",
      fold: true,
      items: liveRightItems
    },
    {
      name: "下方页面（动态/公告）",
      fold: true,
      items: liveBelowItems
    },
    {
      name: "顶栏 左侧",
      fold: true,
      items: liveHeaderLeftItems
    },
    {
      name: "顶栏 搜索框",
      fold: true,
      items: liveHeaderCenterItems
    },
    {
      name: "顶栏 右侧",
      fold: true,
      items: liveHeaderRightItems
    }
  ];
  const popularBasicItems = [
    {
      type: "switch",
      id: "homepage-hide-banner",
      name: "隐藏 横幅banner",
      description: ["同步生效：首页、分区页、热门页"]
    },
    {
      type: "switch",
      id: "homepage-hide-sticky-header",
      name: "隐藏 滚动页面时 顶部吸附顶栏"
    },
    {
      type: "switch",
      id: "popular-hide-tips",
      name: "隐藏 tips",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "popular-hide-danmaku-count",
      name: "隐藏 弹幕数"
    }
  ];
  const popularLayoutItems = [
    {
      type: "list",
      id: "popular-layout",
      name: "强制修改视频列数",
      defaultValue: "popular-layout-2-column",
      disableValue: "popular-layout-disable",
      description: [
        "默认隐藏视频简介、标签",
        "对 综合热门/每周必看/入站必刷/排行榜 生效",
        '使用 5 列或 6 列布局时，建议开启 "隐藏 弹幕数"'
      ],
      options: [
        {
          id: "popular-layout-2-column",
          name: "未启用"
        },
        {
          id: "popular-layout-4-column",
          name: "4 列布局"
        },
        {
          id: "popular-layout-5-column",
          name: "5 列布局"
        },
        {
          id: "popular-layout-6-column",
          name: "6 列布局"
        }
      ]
    }
  ];
  const popularOtherItems = [
    {
      type: "switch",
      id: "popular-hot-hide-tag",
      name: "隐藏 综合热门 视频tag"
    },
    {
      type: "switch",
      id: "popular-weekly-hide-hint",
      name: "隐藏 每周必看 一句话简介"
    },
    {
      type: "switch",
      id: "popular-history-hide-hint",
      name: "隐藏 入站必刷 一句话简介"
    }
  ];
  const popularGroups = [
    {
      name: "基本功能",
      items: popularBasicItems
    },
    {
      name: "页面强制布局",
      items: popularLayoutItems
    },
    {
      name: "其他功能",
      items: popularOtherItems,
      fold: true
    }
  ];
  const searchBasicItems = [
    {
      type: "switch",
      id: "hide-search-page-search-sticky-header",
      name: "顶栏 滚动页面后 不再吸附顶部"
    },
    {
      type: "switch",
      id: "hide-search-page-bangumi-pgc-list",
      name: "隐藏 搜索结果顶部 版权作品"
    },
    {
      type: "switch",
      id: "hide-search-page-activity-game-list",
      name: "隐藏 搜索结果顶部 游戏、热搜话题"
    },
    {
      type: "switch",
      id: "hide-search-page-ad",
      name: "隐藏 搜索结果中的广告",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-search-page-live-room-result",
      name: "隐藏 搜索结果中的直播"
    },
    {
      type: "switch",
      id: "hide-search-page-danmaku-count",
      name: "隐藏 弹幕数量",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-search-page-date",
      name: "隐藏 视频日期"
    }
  ];
  const searchSidebarItems = [
    {
      type: "switch",
      id: "hide-search-page-customer-service",
      name: "隐藏 客服",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "hide-search-page-btn-to-top",
      name: "隐藏 回顶部"
    }
  ];
  const searchGroups = [
    {
      name: "基本功能",
      items: searchBasicItems
    },
    {
      name: "页面右下角 小按钮",
      items: searchSidebarItems
    }
  ];
  const spaceBasicItems = [
    {
      type: "switch",
      id: "space-page-redirect-to-video",
      name: "打开用户主页 自动跳转到投稿",
      noStyle: true,
      enableFn: () => {
        var _a;
        if (/\/\d+\/?($|\?)/.test(location.pathname)) {
          const userid = (_a = location.pathname.match(/\d+/)) == null ? void 0 : _a[0];
          if (userid) {
            location.href = `https://space.bilibili.com/${userid}/upload/video`;
          }
        }
      }
    },
    {
      type: "switch",
      id: "hide-space-page-video-card-danmaku-count",
      name: "隐藏 视频信息 弹幕数",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "increase-space-page-video-card-font-size",
      name: "增大 视频信息 字号"
    }
  ];
  const spaceDynamicItems = [
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-avatar-pendent",
      name: "隐藏 头像框"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-avatar-icon",
      name: "隐藏 头像徽章"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-ornament",
      name: "隐藏 动态右侧饰品"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-dispute",
      name: "隐藏 警告notice"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-official-topic",
      name: "隐藏 官方话题Tag"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-text-topic",
      name: "禁用 普通话题#Tag#高亮"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-item-interaction",
      name: "隐藏 动态精选互动 XXX赞了/XXX回复"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-card-reserve",
      name: "隐藏 视频预约/直播预约动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-card-goods",
      name: "隐藏 带货动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-lottery",
      name: "隐藏 抽奖动态(含转发)"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-forward",
      name: "隐藏 转发的动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-vote",
      name: "隐藏 投票动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-live",
      name: "隐藏 直播通知动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-blocked",
      name: "隐藏 被block的充电动态"
    },
    {
      type: "switch",
      id: "hide-dynamic-page-bili-dyn-charge-video",
      name: "隐藏 全部充电视频(含已充电)"
    }
  ];
  const spaceSidebarItems = [
    {
      type: "switch",
      id: "hide-space-page-sidebar-feedback",
      name: "隐藏 新版反馈"
    },
    {
      type: "switch",
      id: "hide-space-page-sidebar-revert",
      name: "隐藏 返回旧版"
    }
  ];
  const spaceGroups = [
    {
      name: "基本功能",
      items: spaceBasicItems
    },
    {
      name: "页面侧栏",
      items: spaceSidebarItems
    },
    {
      name: "动态列表 (与动态页同步)",
      items: spaceDynamicItems,
      fold: true
    }
  ];
  const videoBasicItems = [
    {
      type: "switch",
      id: "video-page-bv2av",
      name: "BV号转AV号",
      noStyle: true,
      enableFn: async () => {
        const bv2av = (url) => {
          const XOR_CODE = 23442827791579n;
          const MASK_CODE = 2251799813685247n;
          const BASE = 58n;
          const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
          const dec = (bvid) => {
            const bvidArr = Array.from(bvid);
            [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
            [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
            bvidArr.splice(0, 3);
            const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
            return Number(tmp & MASK_CODE ^ XOR_CODE);
          };
          try {
            if (url.includes("bilibili.com/video/BV")) {
              const bvid = matchBvid(url);
              if (bvid) {
                const urlObj = new URL(url);
                const params = new URLSearchParams(urlObj.search);
                let partNum = "";
                if (params.has("p")) {
                  partNum += `?p=${params.get("p")}`;
                }
                const aid = dec(bvid);
                if (partNum || urlObj.hash) {
                  return `https://www.bilibili.com/video/av${aid}/${partNum}${urlObj.hash}`;
                }
                return `https://www.bilibili.com/video/av${aid}`;
              }
            }
            return url;
          } catch (err) {
            return url;
          }
        };
        URLCleanerInstance.cleanFnArr.push(bv2av);
        URLCleanerInstance.clean();
      }
    },
    {
      type: "switch",
      id: "video-page-hide-fixed-header",
      name: "顶栏 滚动页面后 不再吸附顶部"
    },
    {
      type: "switch",
      id: "video-page-simple-share",
      name: "净化分享功能",
      description: ["点击分享按钮时，复制纯净链接"],
      // 净化分享按钮写入剪贴板内容
      enableFn: async () => {
        let counter = 0;
        const id = setInterval(() => {
          counter++;
          const shareBtn = document.getElementById("share-btn-outer");
          if (shareBtn) {
            shareBtn.addEventListener("click", () => {
              var _a;
              let title = (_a = document.querySelector(
                ".video-info-title .video-title, #viewbox_report > h1, .video-title-href"
              )) == null ? void 0 : _a.textContent;
              if (title && !title.match(/^[（【［《「＜｛〔〖〈『].*|.*[）】］》」＞｝〕〗〉』]$/)) {
                title = `【${title}】`;
              }
              const avbv = matchAvidBvid(location.href);
              let domain = BiliCleanerStorage.get("video-page-simple-share-domain");
              if (!domain || domain === "disable") {
                domain = "www.bilibili.com/video";
              }
              let shareText = title ? `${title} 
https://${domain}/${avbv}` : `https://${domain}/${avbv}`;
              const urlObj = new URL(location.href);
              const params = new URLSearchParams(urlObj.search);
              if (params.has("p")) {
                shareText += `?p=${params.get("p")}`;
              }
              navigator.clipboard.writeText(shareText).then().catch();
            });
            clearInterval(id);
          } else if (counter > 50) {
            clearInterval(id);
          }
        }, 200);
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "list",
      id: "video-page-simple-share-domain",
      name: "使用短域名分享",
      defaultValue: "disable",
      disableValue: "disable",
      options: [
        {
          id: "disable",
          name: "不使用"
        },
        {
          id: "b23.tv",
          name: "b23.tv"
        },
        {
          id: "bili22.cn",
          name: "bili22.cn"
        },
        {
          id: "bili33.cn",
          name: "bili33.cn"
        },
        {
          id: "bili23.cn",
          name: "bili23.cn"
        },
        {
          id: "bili2233.cn",
          name: "bili2233.cn"
        },
        {
          id: "bilibili.com",
          name: "bilibili.com"
        }
      ]
    }
  ];
  const videoDanmakuItems = [
    {
      type: "string",
      id: "video-page-danmaku-font-family",
      name: "弹幕字体",
      description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
      defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-family",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-danmaku-font-weight",
      name: "弹幕字重",
      description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-danmaku-font-weight",
          value.trim().replace(/;$/, "")
        );
      }
    }
  ];
  const videoDanmakuControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-online",
      name: "隐藏 同时在看人数"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-info-dm",
      name: "隐藏 装填弹幕数量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-switch",
      name: "隐藏 弹幕开关"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-setting",
      name: "隐藏 弹幕显示设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-btn-dm",
      name: "隐藏 弹幕样式"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-input",
      name: "隐藏 占位文字",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-hint",
      name: "隐藏 弹幕礼仪",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dm-btn-send",
      name: "隐藏 发送按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-postpanel",
      name: "隐藏 智能弹幕/广告弹幕"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-sending-area",
      name: "非全屏下 关闭弹幕栏",
      description: ["字母 D 是弹幕开关快捷键"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-video-inputbar",
      name: "全屏下 关闭弹幕输入框"
    }
  ];
  const videoInfoItems = [
    {
      type: "switch",
      id: "video-page-unfold-video-info-title",
      name: "展开 多行视频标题"
    },
    {
      type: "switch",
      id: "video-page-hide-video-info-danmaku-count",
      name: "隐藏 弹幕数"
    },
    {
      type: "switch",
      id: "video-page-hide-video-info-pubdate",
      name: "隐藏 发布日期"
    },
    {
      type: "switch",
      id: "video-page-hide-video-info-copyright",
      name: "隐藏 版权声明"
    },
    {
      type: "switch",
      id: "video-page-hide-video-info-honor",
      name: "隐藏 视频荣誉 (排行榜/每周必看)"
    },
    {
      type: "switch",
      id: "video-page-hide-video-info-argue",
      name: "隐藏 温馨提示 (饮酒/危险/AI生成)",
      defaultEnable: true
    }
  ];
  const videoMiniPlayerItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-mini-mode-process",
      name: "隐藏底边进度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-mini-mode-danmaku",
      name: "隐藏弹幕"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-mini-mode-wheel-adjust",
      name: "滚轮调节大小",
      enableFn: async () => {
        try {
          const zoom = useStorage("bili-cleaner-mini-player-zoom", 1, localStorage);
          document.documentElement.style.setProperty("--mini-player-zoom", zoom.value + "");
          let cnt = 0;
          const interval = setInterval(() => {
            const player = document.querySelector(".bpx-player-container");
            if (player) {
              clearInterval(interval);
              let flag = false;
              player.addEventListener("mouseenter", () => {
                if (player.getAttribute("data-screen") === "mini") {
                  flag = true;
                }
              });
              player.addEventListener("mouseleave", () => {
                flag = false;
              });
              player.addEventListener("wheel", (e2) => {
                if (flag) {
                  e2.stopPropagation();
                  e2.preventDefault();
                  const scaleSpeed = 5;
                  let newZoom = zoom.value - Math.sign(e2.deltaY) * scaleSpeed / 100;
                  newZoom = newZoom < 0.5 ? 0.5 : newZoom;
                  newZoom = newZoom > 3 ? 3 : newZoom;
                  if (newZoom !== zoom.value) {
                    zoom.value = newZoom;
                    document.documentElement.style.setProperty("--mini-player-zoom", newZoom + "");
                  }
                }
              });
            } else {
              cnt++;
              if (cnt > 20) {
                clearInterval(interval);
              }
            }
          }, 500);
        } catch (err) {
          error("adjust mini player size error", err);
        }
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-mini-mode-position-record",
      name: "记录小窗位置",
      enableFn: async () => {
        const pos = useStorage("bili-cleaner-mini-player-pos", { tx: 0, ty: 0 }, localStorage);
        document.documentElement.style.setProperty("--mini-player-translate-x", pos.value.tx + "px");
        document.documentElement.style.setProperty("--mini-player-translate-y", pos.value.ty + "px");
        waitForEle(document, "#bilibili-player .bpx-player-container", (node) => {
          return node.className.startsWith("bpx-player-container");
        }).then((player) => {
          if (player) {
            player.addEventListener("mouseup", () => {
              if (player.getAttribute("data-screen") === "mini") {
                const rect = player.getBoundingClientRect();
                pos.value.tx = 84 - (document.documentElement.clientWidth - rect.right);
                pos.value.ty = 48 - (document.documentElement.clientHeight - rect.bottom);
              }
            });
          }
        });
      },
      enableFnRunAt: "document-end"
    }
  ];
  const videoPlayerItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-guide-all",
      name: "隐藏 一键三连"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-vote",
      name: "隐藏 投票"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-qoe-feedback",
      name: "隐藏 播放效果调查",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-score",
      name: "隐藏 评分"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-score-sum",
      name: "隐藏 评分总结"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-clock",
      name: "隐藏 打卡"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-cmtime",
      name: "隐藏 心动"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-cmd-shrink",
      name: "隐藏 迷你弹窗"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-reserve",
      name: "隐藏 视频预告"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-bili-link",
      name: "隐藏 视频链接"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-cmd-dm-wrap",
      name: "隐藏 播放器内所有弹窗 (强制)",
      description: ["启用本项时 无需开启上述功能"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-title",
      name: "隐藏 全屏下 播放器内标题"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-music",
      name: "隐藏 视频音乐链接"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-left-follow",
      name: "隐藏 左上角 关注UP主",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-top-issue",
      name: "隐藏 右上角 反馈按钮",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-state-wrap",
      name: "隐藏 视频暂停时大Logo"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ending-related",
      name: "隐藏 播放结束后视频推荐"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-dialog-wrap",
      name: "隐藏 弹幕悬停点赞/复制/举报"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-high-icon",
      name: "隐藏 高赞弹幕前点赞按钮"
    },
    {
      type: "switch",
      id: "video-page-bpx-player-bili-dm-vip-white",
      name: "彩色渐变弹幕 变成白色"
    }
  ];
  const videoPlayerControlItems = [
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-prev",
      name: "隐藏 上一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-play",
      name: "隐藏 播放/暂停"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-next",
      name: "隐藏 下一个视频"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-viewpoint",
      name: "隐藏 章节列表"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-flac",
      name: "隐藏 Hi-Res无损"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-quality",
      name: "隐藏 清晰度"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-eplist",
      name: "隐藏 选集"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-playbackrate",
      name: "隐藏 倍速"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-subtitle",
      name: "隐藏 字幕"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-volume",
      name: "隐藏 音量"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-setting",
      name: "隐藏 视频设置"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-pip",
      name: "隐藏 画中画",
      description: ["Chrome / Edge 浏览器可用", "Firefox 可在浏览器设置中关闭"]
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-wide",
      name: "隐藏 宽屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-web",
      name: "隐藏 网页全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-ctrl-full",
      name: "隐藏 全屏"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-pbp-pin",
      name: "隐藏 高能进度条 图钉按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-bpx-player-shadow-progress-area",
      name: "隐藏 底边mini视频进度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-show-bpx-player-pbp",
      name: "控制栏收起时 显示高能进度条"
    }
  ];
  const _WideScreenManager = class _WideScreenManager {
    constructor() {
      __publicField(this, "wideScreenLock", false);
      if (isPageVideo() || isPagePlaylist()) {
        let _isWide = _unsafeWindow.isWide;
        Object.defineProperty(_unsafeWindow, "isWide", {
          get: () => _isWide,
          set: (value) => {
            var _a, _b;
            _isWide = value || this.wideScreenLock;
            if (_isWide) {
              (_a = document.documentElement) == null ? void 0 : _a.setAttribute("player-is-wide", "");
            } else {
              (_b = document.documentElement) == null ? void 0 : _b.removeAttribute("player-is-wide");
            }
          }
        });
      }
    }
    static getInstance() {
      if (!_WideScreenManager.instance) {
        _WideScreenManager.instance = new _WideScreenManager();
      }
      return _WideScreenManager.instance;
    }
    lock() {
      this.wideScreenLock = true;
    }
    unlock() {
      this.wideScreenLock = false;
    }
  };
  __publicField(_WideScreenManager, "instance");
  let WideScreenManager = _WideScreenManager;
  const wideScreenManager = WideScreenManager.getInstance();
  let webScroll = false;
  let fullScroll = false;
  const fn = (event) => event.stopImmediatePropagation();
  const disableTuneVolume = () => {
    if (!webScroll && !fullScroll) {
      window.addEventListener("mousewheel", fn, { capture: true });
      window.addEventListener("DOMMouseScroll", fn, { capture: true });
    }
  };
  const enableTuneVolume = () => {
    if (!(webScroll && fullScroll)) {
      window.removeEventListener("mousewheel", fn, { capture: true });
      window.removeEventListener("DOMMouseScroll", fn, { capture: true });
    }
  };
  const videoPlayerLayoutItems = [
    {
      type: "switch",
      id: "default-widescreen",
      name: "默认宽屏播放 刷新生效",
      enableFn: async () => {
        _unsafeWindow.isWide = true;
        wideScreenManager.lock();
        const listener = () => {
          window.scrollTo(0, 64);
          waitForEle(document.body, ".bpx-player-ctrl-wide", (node) => {
            return node.className.includes("bpx-player-ctrl-wide");
          }).then((wideBtn) => {
            if (wideBtn) {
              wideBtn.click();
              wideScreenManager.unlock();
            }
          });
        };
        document.readyState !== "loading" ? listener() : document.addEventListener("DOMContentLoaded", listener);
      }
    },
    {
      type: "switch",
      id: "webscreen-scrollable",
      name: "网页全屏时 页面可滚动",
      description: ["播放器内滚轮调节音量失效"],
      enableFn: async () => {
        disableTuneVolume();
        webScroll = true;
        waitForEle(document.body, ".bpx-player-ctrl-web", (node) => {
          return node.className.includes("bpx-player-ctrl-web");
        }).then((webBtn) => {
          if (webBtn) {
            webBtn.addEventListener("click", () => {
              if (webBtn.classList.contains("bpx-state-entered")) {
                window.scrollTo(0, 0);
              }
            });
          }
        });
      },
      disableFn: () => {
        enableTuneVolume();
        webScroll = false;
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "fullscreen-scrollable",
      name: "全屏时 页面可滚动 (实验功能)",
      description: ["播放器内滚轮调节音量失效", "点击全屏按钮时生效，双击全屏无效"],
      enableFn: async () => {
        disableTuneVolume();
        fullScroll = true;
        let cnt = 0;
        const id = setInterval(() => {
          var _a;
          const webBtn = document.body.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-web");
          const fullBtn = document.body.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-full");
          if (webBtn && fullBtn) {
            clearInterval(id);
            const isFullScreen = () => {
              if (document.fullscreenElement) {
                return "ele";
              } else if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
                return "f11";
              } else {
                return "not";
              }
            };
            const isWebScreen = () => {
              return webBtn.classList.contains("bpx-state-entered");
            };
            const newFullBtn = fullBtn.cloneNode(true);
            newFullBtn.addEventListener("click", () => {
              switch (isFullScreen()) {
                case "ele":
                  if (isWebScreen()) {
                    webBtn.click();
                  } else {
                    document.exitFullscreen().then().catch();
                  }
                  break;
                case "f11":
                  webBtn.click();
                  break;
                case "not":
                  document.documentElement.requestFullscreen().then().catch();
                  if (!isWebScreen()) {
                    webBtn.click();
                  }
                  window.scrollTo(0, 0);
                  break;
              }
            });
            (_a = fullBtn.parentElement) == null ? void 0 : _a.replaceChild(newFullBtn, fullBtn);
          } else {
            cnt++;
            cnt > 50 && clearInterval(id);
          }
        }, 200);
      },
      disableFn: () => {
        enableTuneVolume();
        fullScroll = false;
      },
      enableFnRunAt: "document-end"
    },
    {
      type: "switch",
      id: "video-page-exchange-player-position",
      name: "播放器和视频信息 交换位置"
    },
    {
      type: "number",
      id: "normalscreen-width",
      name: "普通播放 视频宽度调节（-1禁用）",
      minValue: -1,
      maxValue: 100,
      step: 0.1,
      defaultValue: -1,
      disableValue: -1,
      addonText: "vw",
      fn: (value) => {
        document.documentElement.style.setProperty("--normalscreen-width", `${value}vw`);
      }
    }
  ];
  const videoRightItems = [
    {
      type: "switch",
      id: "video-page-right-container-sticky-optimize",
      name: "优化 右栏底部吸附"
    },
    {
      type: "switch",
      id: "video-page-right-container-sticky-disable",
      name: "禁用 右栏底部吸附"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-ad",
      name: "隐藏 广告",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-video-page-game-card-small",
      name: "隐藏 游戏推荐"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-danmaku",
      name: "隐藏 弹幕列表"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-next-play-next-button",
      name: "隐藏 自动连播开关"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-next-play",
      name: "隐藏 接下来播放"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-multi-page-add-counter",
      name: "恢复 分P视频 编号",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-right-container-section-unfold-title",
      name: "展开 视频合集 第二行标题"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-section-height",
      name: "优化 视频合集 列表高度",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-section-next-btn",
      name: "隐藏 视频合集 自动连播开关"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-section-play-num",
      name: "隐藏 视频合集 播放量"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-section-abstract",
      name: "隐藏 视频合集 简介",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-section-subscribe",
      name: "隐藏 视频合集 订阅合集"
    },
    {
      type: "switch",
      id: "video-page-right-container-set-info-bottom",
      name: "相关视频 视频信息置底",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-duration",
      name: "隐藏 相关视频 视频时长"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-rec-list-info-up",
      name: "隐藏 相关视频 UP主"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-rec-list-info-plays",
      name: "隐藏 相关视频 播放和弹幕"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-rec-footer",
      name: "隐藏 展开按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-reco-list-rec-list",
      name: "隐藏 全部相关视频"
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-right-bottom-banner",
      name: "隐藏 活动banner",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container-live",
      name: "隐藏 直播间推荐",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-right-container",
      name: "隐藏 整个右栏 (宽屏模式不适用)"
    }
  ];
  const videoSidebarItems = [
    {
      type: "switch",
      id: "video-page-hide-sidenav-right-container-live",
      name: "隐藏 小窗播放开关"
    },
    {
      type: "switch",
      id: "video-page-hide-sidenav-customer-service",
      name: "隐藏 客服",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-sidenav-back-to-top",
      name: "隐藏 回顶部"
    }
  ];
  const videoSubtitleItems = [
    {
      type: "string",
      id: "video-page-subtitle-font-color",
      name: "字幕颜色",
      description: ["遵循 CSS color 语法，留空为禁用"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-color",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-font-family",
      name: "字幕字体",
      description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
      defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-family",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-font-weight",
      name: "字幕字重",
      description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-font-weight",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "string",
      id: "video-page-subtitle-text-stroke-color",
      name: "描边颜色",
      description: ["遵循 CSS color 语法，留空为禁用", '官方字幕设定需选择 "无描边"'],
      defaultValue: "",
      disableValue: "",
      fn: (value) => {
        document.documentElement.style.setProperty(
          "--video-page-subtitle-text-stroke-color",
          value.trim().replace(/;$/, "")
        );
      }
    },
    {
      type: "number",
      id: "video-page-subtitle-text-stroke-width",
      name: "描边宽度 (0为禁用)",
      minValue: 0,
      maxValue: 10,
      step: 0.01,
      defaultValue: 3.5,
      disableValue: 0,
      addonText: "px",
      fn: (value) => {
        document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-width", `${value}px`);
      }
    }
  ];
  const videoToolbarItems = [
    {
      type: "switch",
      id: "video-page-coin-disable-auto-like",
      name: "投币时不自动点赞",
      noStyle: true,
      enableFn: async () => {
        const disableAutoLike = () => {
          let counter = 0;
          const timer = setInterval(() => {
            const checkbox = document.querySelector(
              "body > .bili-dialog-m .bili-dialog-bomb .like-checkbox input"
            );
            if (checkbox) {
              checkbox.checked && checkbox.click();
              clearInterval(timer);
            } else {
              counter++;
              if (counter > 100) {
                clearInterval(timer);
              }
            }
          }, 20);
        };
        const coinBtn = document.querySelector(
          "#arc_toolbar_report .video-coin.video-toolbar-left-item"
        );
        if (coinBtn) {
          coinBtn.addEventListener("click", disableAutoLike);
        } else {
          document.addEventListener("DOMContentLoaded", () => {
            const coinBtn2 = document.querySelector(
              "#arc_toolbar_report .video-coin.video-toolbar-left-item"
            );
            coinBtn2 == null ? void 0 : coinBtn2.addEventListener("click", disableAutoLike);
          });
        }
      }
    },
    {
      type: "switch",
      id: "video-page-hide-video-share-popover",
      name: "隐藏 分享按钮弹出菜单",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-triple-oldfan-entry",
      name: "隐藏 成为老粉按钮"
    },
    {
      type: "switch",
      id: "video-page-hide-below-info-video-ai-assistant",
      name: "隐藏 官方AI总结"
    },
    {
      type: "switch",
      id: "video-page-hide-below-info-video-note",
      name: "隐藏 记笔记"
    },
    {
      type: "switch",
      id: "video-page-hide-below-info-video-report-menu",
      name: "隐藏 折叠菜单"
    },
    {
      type: "switch",
      id: "video-page-unfold-below-info-desc",
      name: "展开 视频简介",
      description: ["自动隐藏 [展开/收起] 按钮"]
    },
    {
      type: "switch",
      id: "video-page-hide-below-info-desc",
      name: "隐藏 视频简介"
    },
    {
      type: "switch",
      id: "video-page-hide-below-info-tag",
      name: "隐藏 标签列表"
    },
    {
      type: "switch",
      id: "video-page-hide-below-activity-vote",
      name: "隐藏 活动宣传",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-below-bannerAd",
      name: "隐藏 广告banner",
      defaultEnable: true
    }
  ];
  const videoUpInfoItems = [
    {
      type: "switch",
      id: "video-page-hide-up-sendmsg",
      name: "隐藏 发消息",
      defaultEnable: true
    },
    {
      type: "switch",
      id: "video-page-hide-up-description",
      name: "隐藏 UP主简介"
    },
    {
      type: "switch",
      id: "video-page-hide-up-charge",
      name: "隐藏 充电"
    },
    {
      type: "switch",
      id: "video-page-hide-up-bili-avatar-pendent-dom",
      name: "隐藏 UP主头像外饰品"
    },
    {
      type: "switch",
      id: "video-page-hide-up-bili-avatar-icon",
      name: "隐藏 UP主头像icon"
    },
    {
      type: "switch",
      id: "video-page-hide-up-membersinfo-normal-header",
      name: "隐藏 创作团队header",
      defaultEnable: true
    }
  ];
  const videoGroups = [
    {
      name: "基本功能",
      fold: true,
      items: videoBasicItems
    },
    {
      name: "播放设定",
      fold: true,
      items: videoPlayerLayoutItems
    },
    {
      name: "视频信息",
      fold: true,
      items: videoInfoItems
    },
    {
      name: "播放器",
      fold: true,
      items: videoPlayerItems
    },
    {
      name: "播放控制栏",
      fold: true,
      items: videoPlayerControlItems
    },
    {
      name: "弹幕控制栏",
      fold: true,
      items: videoDanmakuControlItems
    },
    {
      name: "弹幕样式",
      fold: true,
      items: videoDanmakuItems
    },
    {
      name: "字幕样式",
      fold: true,
      items: videoSubtitleItems
    },
    {
      name: "视频下方信息",
      fold: true,
      items: videoToolbarItems
    },
    {
      name: "右侧 UP主信息",
      fold: true,
      items: videoUpInfoItems
    },
    {
      name: "右侧 视频栏",
      fold: true,
      items: videoRightItems
    },
    {
      name: "小窗播放器",
      fold: true,
      items: videoMiniPlayerItems
    },
    {
      name: "页面右下角 小按钮",
      fold: true,
      items: videoSidebarItems
    }
  ];
  const watchlaterBasicItems = [
    {
      type: "list",
      id: "watchlater-layout",
      name: "修改 视频列表列数",
      description: ["未启用时，B 站自动判断列数"],
      defaultValue: "watchlater-layout-disable",
      disableValue: "watchlater-layout-disable",
      options: [
        {
          id: "watchlater-layout-disable",
          name: "未启用"
        },
        {
          id: "watchlater-layout-4-column",
          name: "4 列布局"
        },
        {
          id: "watchlater-layout-5-column",
          name: "5 列布局"
        }
      ]
    },
    {
      type: "switch",
      id: "watchlater-increase-font-size",
      name: "增大 视频信息字号"
    }
  ];
  const watchlaterGroups = [
    {
      name: "基本功能",
      items: watchlaterBasicItems
    }
  ];
  const bangumiStyle = '@charset "UTF-8";html[video-page-simple-share] #share-container-id [class^=Share_boxBottom]{display:none!important}html[video-page-simple-share] #share-container-id [class^=Share_boxTop]{padding:15px!important}html[video-page-simple-share] #share-container-id [class^=Share_boxTopRight]{display:none!important}html[video-page-simple-share] #share-container-id [class^=Share_boxTopLeft]{padding:0!important}html[video-page-hide-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[video-page-danmaku-font-family] .bili-danmaku-x-dm{--fontFamily: var(--video-page-danmaku-font-family) !important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm{--fontWeight: var(--video-page-danmaku-font-weight) !important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::-moz-placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area{display:none!important}html[video-page-hide-bpx-player-sending-area] #bilibili-player-wrap[class^=video_playerNormal]{height:calc(var(--video-width) * .5625)}html[video-page-hide-bpx-player-sending-area] #bilibili-player-wrap[class^=video_playerWide]{height:calc(var(--containerWidth) * .5625)}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:-moz-fit-content!important;width:fit-content!important}html[video-page-hide-bpx-player-mini-mode-process] .bpx-player-container[data-screen=mini]:not(:hover) .bpx-player-mini-progress{display:none}html[video-page-hide-bpx-player-mini-mode-danmaku] .bpx-player-container[data-screen=mini] .bpx-player-row-dm-wrap{visibility:hidden!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-screen=mini]{height:calc(225px * var(--mini-player-zoom, 1))!important;width:calc(400px * var(--mini-player-zoom, 1))!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="1"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="2"][data-screen=mini]{height:calc(180px * var(--mini-player-zoom, 1))!important;width:calc(320px * var(--mini-player-zoom, 1))!important}@media screen and (width >= 1681px){html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="1"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="2"][data-screen=mini]{height:calc(203px * var(--mini-player-zoom, 1))!important;width:calc(360px * var(--mini-player-zoom, 1))!important}}html[video-page-bpx-player-mini-mode-position-record] .bpx-player-container[data-screen=mini]{transform:translate(var(--mini-player-translate-x)) translateY(var(--mini-player-translate-y))}html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[bangumi-page-hide-bpx-player-top-follow] .bpx-player-top-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[bangumi-page-hide-bpx-player-record-item-wrap] .bpx-player-record-item-wrap,html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:none!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){overflow:auto!important;position:relative!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #bilibili-player-wrap{position:absolute!important;width:100vw!important;height:100vh!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .main-container{position:static!important;margin:0 auto!important;padding-top:calc(100vh + 15px)!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen])::-webkit-scrollbar{display:none!important}html[webscreen-scrollable] .bili-msg{z-index:100001!important}@supports (-moz-appearance: none){html[webscreen-scrollable]:has(#bilibili-player-wrap[class^=video_playerFullScreen]),html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){overflow:auto!important;position:relative!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .home-container{background-color:#fff}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #bilibili-player-wrap{position:absolute!important;width:100vw!important;height:100vh!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .main-container{position:static!important;margin:0 auto!important;padding-top:calc(100vh + 15px)!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen])::-webkit-scrollbar{display:none!important}html[fullscreen-scrollable] .bili-msg{z-index:100001!important}@supports (-moz-appearance: none){html[fullscreen-scrollable]:has(#bilibili-player-wrap[class^=video_playerFullScreen]),html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}}html[normalscreen-width] .home-container:not(.wide){--video-width: var(--normalscreen-width)}html[bangumi-page-hide-right-container-section-height] .plp-r [class^=vipPaybar_],html[bangumi-page-hide-right-container-section-height] .plp-r [class^=paybar_],html[video-page-hide-right-container-danmaku] #danmukuBox{display:none!important}html[bangumi-page-hide-eplist-badge] [class^=eplist_ep_list_wrapper] [class^=imageListItem_badge]:not([style*="#00C0FF"]){display:none!important}html[bangumi-page-hide-eplist-badge] [class^=eplist_ep_list_wrapper] [class^=numberListItem_badge]:not([style*="#00C0FF"]){display:none!important}html[bangumi-page-hide-recommend] .plp-r [class^=recommend_wrap],html[bangumi-page-hide-sidenav-issue] [class^=navTools_navMenu] [title=新版反馈],html[video-page-hide-sidenav-mini] [class^=navTools_navMenu] [title=点击打开迷你播放器],html[video-page-hide-sidenav-customer-service] [class^=navTools_navMenu] [title=帮助反馈],html[video-page-hide-sidenav-back-to-top] [class^=navTools_navMenu] [title=返回顶部],html[video-page-hide-video-share-popover] #share-container-id [class^=Share_share]{display:none!important}html[bangumi-page-hide-watch-together] .toolbar span:has(>#watch_together_tab){display:none!important}html[bangumi-page-hide-toolbar] .player-left-components .toolbar,html[bangumi-page-hide-media-info] [class^=mediainfo_mediaInfo],html[bangumi-page-simple-media-info] [class^=mediainfo_btnHome],html[bangumi-page-simple-media-info] [class^=upinfo_upInfoCard]{display:none!important}html[bangumi-page-simple-media-info] [class^=mediainfo_score]{font-size:25px!important}html[bangumi-page-simple-media-info] [class^=mediainfo_mediaDesc]:has(+[class^=mediainfo_media_desc_section]){visibility:hidden!important;height:0!important;margin-bottom:8px!important}html[bangumi-page-simple-media-info] [class^=mediainfo_media_desc_section]{height:60px!important}html[bangumi-page-hide-sponsor-module] #sponsor_module{display:none!important}';
  const channelStyle = 'html[homepage-hide-banner] .bili-header__banner{min-height:unset!important;height:64px!important;background:var(--bg1)!important}html[homepage-hide-banner] .bili-header__banner>*{display:none!important}html[homepage-hide-banner] .bili-header__bar{box-shadow:0 2px 4px #00000014!important}html[homepage-hide-banner] html{background-color:var(--bg1)}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-icon,html[homepage-hide-banner] .bili-header .left-entry .entry-title,html[homepage-hide-banner] .bili-header .left-entry .download-entry,html[homepage-hide-banner] .bili-header .left-entry .default-entry,html[homepage-hide-banner] .bili-header .left-entry .loc-entry{color:var(--text1, #18191c)!important}html[homepage-hide-banner] .bili-header .left-entry .entry-title .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-text{color:var(--text2, #61666d)!important}html[homepage-hide-banner] #biliMainHeader{min-height:unset!important}html[homepage-hide-banner] .v-popover.is-top{padding-top:5px;padding-bottom:unset!important;bottom:unset!important}@media (width >= 2200px){html[homepage-hide-banner] .v-popover.is-top{top:32px}}@media (width >= 1701px) and (width <= 2199.9px){html[homepage-hide-banner] .v-popover.is-top{top:32px}}@media (width >= 1367px) and (width <= 1700.9px){html[homepage-hide-banner] .v-popover.is-top{top:28px}}@media (width >= 1100px) and (width <= 1366.9px){html[homepage-hide-banner] .v-popover.is-top{top:28px}}@media (width <= 1099.9px){html[homepage-hide-banner] .v-popover.is-top{top:24px}}html[channel-hide-subarea] #i_cecream .bili-header__channel,html[channel-hide-carousel] .channel-swiper,html[channel-hide-carousel] .channel-swiper-client,html[channel-hide-sticky-subchannel] .fixed-header-nav-sticky{display:none!important}html[channel-hide-sticky-subchannel] .fixed-wrapper-shown{box-shadow:unset!important}html[channel-hide-sticky-header] .bili-header__bar.slide-down{display:none!important}html[channel-layout-padding] .go-back-btn,html[channel-layout-padding] .channel-layout,html[channel-layout-padding] .channel-outer-nav{padding:0 var(--channel-layout-padding)!important}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]){grid-template-columns:unset!important;margin-top:0!important;margin-bottom:20px!important}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) aside[data-report="topic.card"]{display:none!important}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list,html[channel-hide-high-energy-topic] .video-double-full{min-height:unset!important}@media (width <= 1099.9px){html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body{grid-column:span 4;grid-template-columns:repeat(4,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body>*:nth-of-type(n+7){display:unset!important}}@media (width >= 1100px) and (width <= 1366.9px){html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body{grid-column:span 5;grid-template-columns:repeat(5,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body>*:nth-of-type(n+9){display:unset!important}}@media (width >= 1367px) and (width <= 1700.9px){html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body{grid-column:span 5;grid-template-columns:repeat(5,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body>*:nth-of-type(n+9){display:unset!important}}@media (width >= 1701px) and (width <= 2199.9px){html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body{grid-column:span 6;grid-template-columns:repeat(6,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body>*:nth-of-type(n+11){display:unset!important}}@media (width >= 2200px){html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body{grid-column:span 6;grid-template-columns:repeat(6,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-high-energy-topic] .bili-grid:has([data-report="high_energy.content"]) .video-card-list .video-card-body>*:nth-of-type(n+13){display:unset!important}}html[channel-hide-high-energy] .bili-grid:has([data-report="high_energy.content"]){display:none!important}html[channel-hide-rank-list] .bili-grid:has(.rank-list){grid-template-columns:unset!important;margin-top:0!important;margin-bottom:20px!important}html[channel-hide-rank-list] .bili-grid:has(.rank-list) aside{display:none!important}html[channel-hide-rank-list] .bili-grid.sub-dynamic:has(.rank-list),html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list{min-height:unset!important}@media (width <= 1099.9px){html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body{grid-column:span 4;grid-template-columns:repeat(4,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body>*:nth-of-type(n+7){display:unset!important}}@media (width >= 1100px) and (width <= 1366.9px){html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body{grid-column:span 5;grid-template-columns:repeat(5,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body>*:nth-of-type(n+9){display:unset!important}}@media (width >= 1367px) and (width <= 1700.9px){html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body{grid-column:span 5;grid-template-columns:repeat(5,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body>*:nth-of-type(n+9){display:unset!important}}@media (width >= 1701px) and (width <= 2199.9px){html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body{grid-column:span 6;grid-template-columns:repeat(6,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body>*:nth-of-type(n+11){display:unset!important}}@media (width >= 2200px){html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body{grid-column:span 6;grid-template-columns:repeat(6,1fr);overflow:hidden;grid-template-rows:1fr auto;grid-auto-rows:0}html[channel-hide-rank-list] .bili-grid:has(.rank-list) .video-card-list .video-card-body>*:nth-of-type(n+13){display:unset!important}}html[channel-hide-ad-banner] .eva-banner{display:none!important}html[channel-hide-ad-banner] .bili-grid{margin-bottom:20px!important}html[channel-hide-video-info-date] .bili-video-card__info--date{display:none!important}html[channel-hide-danmaku-count] .bili-video-card__stats--item:nth-child(2){visibility:hidden}html[channel-feed-card-body-grid-gap] .feed-card-body{grid-gap:20px 12px!important}html[channel-increase-rcmd-list-font-size] .bili-video-card .bili-video-card__info--tit,html[channel-increase-rcmd-list-font-size] .bili-live-card .bili-live-card__info--tit,html[channel-increase-rcmd-list-font-size] .single-card.floor-card .title{font-size:16px!important}html[channel-increase-rcmd-list-font-size] .bili-video-card .bili-video-card__info--bottom,html[channel-increase-rcmd-list-font-size] .floor-card .sub-title.sub-title,html[channel-increase-rcmd-list-font-size] .bili-video-card__stats,html[channel-increase-rcmd-list-font-size] .bili-video-card__stats .bili-video-card__stats--left,html[channel-increase-rcmd-list-font-size] .bili-video-card__stats .bili-video-card__stats--right{font-size:14px!important}html[channel-hide-feedback] .palette-button-wrap .feedback,html[channel-hide-top-btn] .palette-button-wrap .top-btn-wrap{display:none!important}';
  const commentStyle = "html[video-page-hide-reply-notice] .reply-header .reply-notice{display:none!important}html[video-page-hide-main-reply-box] .main-reply-box{height:0!important;visibility:hidden!important}html[video-page-hide-main-reply-box] .comment-container .reply-list{margin-top:-20px!important}html[video-page-hide-reply-box-textarea-placeholder] .main-reply-box .reply-box-textarea::-moz-placeholder{color:transparent!important;-moz-user-select:none;-webkit-user-select:none;user-select:none}html[video-page-hide-reply-box-textarea-placeholder] .main-reply-box .reply-box-textarea::placeholder{color:transparent!important;-webkit-user-select:none;-moz-user-select:none;user-select:none}html[video-page-hide-reply-box-textarea-placeholder] .fixed-reply-box .reply-box-textarea::-moz-placeholder{color:transparent!important;-moz-user-select:none;-webkit-user-select:none;user-select:none}html[video-page-hide-reply-box-textarea-placeholder] .fixed-reply-box .reply-box-textarea::placeholder{color:transparent!important;-webkit-user-select:none;-moz-user-select:none;user-select:none}html[video-page-hide-fixed-reply-box] .fixed-reply-box,html[video-page-hide-top-vote-card] .top-vote-card,html[video-page-hide-comment-user-card] .user-card,html[video-page-hide-reply-decorate] .reply-decorate,html[video-page-hide-fan-badge] .fan-badge,html[video-page-hide-contractor-box] .contractor-box,html[video-page-hide-user-level] .user-level,html[video-page-hide-user-level] .sub-user-level,html[video-page-hide-bili-avatar-pendent-dom] .root-reply-avatar .bili-avatar-pendent-dom{display:none!important}html[video-page-hide-bili-avatar-pendent-dom] .comment-container .root-reply-avatar .bili-avatar{width:48px!important;height:48px!important}html[video-page-hide-bili-avatar-nft-icon] .bili-avatar-nft-icon,html[video-page-hide-bili-avatar-nft-icon] .comment-container .bili-avatar-icon,html[video-page-hide-vote-info] .vote-info,html[video-page-hide-reply-tag-list] .reply-tag-list,html[video-page-hide-note-prefix] .note-prefix{display:none!important}html[video-page-hide-jump-link-search-word] .reply-content .jump-link.search-word{color:inherit!important}html[video-page-hide-jump-link-search-word] .comment-container .reply-content .jump-link.search-word:hover{color:#008ac5!important}html[video-page-hide-jump-link-search-word] .comment-container .reply-content .icon.search-word{display:none!important}html[video-page-hide-reply-content-user-highlight] .sub-reply-container .reply-content .jump-link.user{color:inherit!important}html[video-page-hide-reply-content-user-highlight] .comment-container .sub-reply-container .reply-content .jump-link.user:hover{color:#40c5f1!important}@keyframes appear{0%{opacity:0}to{opacity:1}}html[video-page-hide-reply-dislike-reply-btn] .reply-item:not(:has(i.disliked)) :is(.reply-btn,.reply-dislike){opacity:0}html[video-page-hide-reply-dislike-reply-btn] .reply-item:hover :is(.reply-btn,.reply-dislike){animation:appear;animation-duration:.2s;animation-delay:.3s;animation-fill-mode:forwards}html[video-page-hide-reply-dislike-reply-btn] .sub-reply-item:not(:has(i.disliked)) :is(.sub-reply-btn,.sub-reply-dislike){opacity:0}html[video-page-hide-reply-dislike-reply-btn] .sub-reply-item:hover :is(.sub-reply-btn,.sub-reply-dislike){animation:appear;animation-duration:.2s;animation-delay:.3s;animation-fill-mode:forwards}html[video-page-hide-emoji-large] .emoji-large{display:none!important}html[video-page-hide-emoji-large-zoom] .emoji-large{zoom:.5}html[video-page-reply-user-name-color-pink] .reply-item .user-name,html[video-page-reply-user-name-color-pink] .comment-container .reply-item .sub-user-name{color:#fb7299!important}html[video-page-reply-user-name-color-default] .reply-item .user-name,html[video-page-reply-user-name-color-default] .comment-container .reply-item .sub-user-name{color:#61666d!important}html[video-page-reply-view-image-optimize] .reply-view-image .last-image,html[video-page-reply-view-image-optimize] .reply-view-image .next-image{zoom:1.4}html[video-page-reply-view-image-optimize] .reply-view-image:has(.preview-item-box:only-child) .last-image{display:none!important}html[video-page-reply-view-image-optimize] .reply-view-image:has(.preview-item-box:only-child) .next-image{display:none!important}html[video-page-reply-view-image-optimize] .reply-view-image .preview-list{display:none!important}html[video-page-hide-comment] #commentapp bili-comments,html[video-page-hide-comment] #comment-module{display:none!important}html[dynamic-page-hide-all-comment] .bili-comment-container,html[dynamic-page-hide-all-comment] .comment-wrap bili-comments{display:none!important}html[dynamic-page-hide-all-comment] .bili-opus-view{border-radius:6px!important}html[dynamic-page-hide-all-comment] .opus-detail{margin-bottom:10px!important;min-height:unset!important}html[dynamic-page-hide-all-comment] #app .content .dyn-tabs{display:none!important}html[dynamic-page-hide-all-comment] #app .content .card{padding-bottom:30px!important}";
  const commonStyle = 'html[border-radius-dynamic] #nav-searchform,html[border-radius-dynamic] .nav-search-content,html[border-radius-dynamic] .header-upload-entry,html[border-radius-dynamic] .v-popover-content,html[border-radius-dynamic] .van-popover,html[border-radius-dynamic] .v-popover-wrap,html[border-radius-dynamic] .v-popover,html[border-radius-dynamic] .topic-panel,html[border-radius-dynamic] .bili-header .header-upload-entry,html[border-radius-dynamic] .bili-dyn-up-list,html[border-radius-dynamic] .bili-dyn-publishing,html[border-radius-dynamic] .bili-dyn-publishing__action,html[border-radius-dynamic] .bili-dyn-sidebar *,html[border-radius-dynamic] .bili-dyn-up-list__window,html[border-radius-dynamic] .bili-dyn-live-users,html[border-radius-dynamic] .bili-dyn-topic-box,html[border-radius-dynamic] .bili-dyn-list-notification,html[border-radius-dynamic] .bili-dyn-item,html[border-radius-dynamic] .bili-dyn-banner,html[border-radius-dynamic] .bili-dyn-banner__img,html[border-radius-dynamic] .bili-dyn-my-info,html[border-radius-dynamic] .bili-dyn-card-video,html[border-radius-dynamic] .bili-dyn-list-tabs,html[border-radius-dynamic] .bili-album__preview__picture__gif,html[border-radius-dynamic] .bili-album__preview__picture__img{border-radius:3px!important}html[border-radius-dynamic] .bili-dyn-card-video__cover__mask,html[border-radius-dynamic] .bili-dyn-card-video__cover{border-radius:3px 0 0 3px!important}html[border-radius-dynamic] .bili-dyn-card-video__body{border-radius:0 3px 3px 0!important}html[border-radius-live] .live-player-ctnr.minimal,html[border-radius-live] .card-box .card-list .card-item,html[border-radius-live] .room-info-cntr,html[border-radius-live] #nav-searchform,html[border-radius-live] #player-ctnr,html[border-radius-live] .nav-search-content,html[border-radius-live] .header-upload-entry,html[border-radius-live] .v-popover-content,html[border-radius-live] .van-popover,html[border-radius-live] .v-popover-wrap,html[border-radius-live] .v-popover,html[border-radius-live] .aside-area,html[border-radius-live] .lower-row .right-ctnr *,html[border-radius-live] .panel-main-ctnr,html[border-radius-live] .startlive-btn,html[border-radius-live] .flip-view,html[border-radius-live] .content-wrapper,html[border-radius-live] .chat-input-ctnr,html[border-radius-live] .announcement-cntr,html[border-radius-live] .bl-button--primary{border-radius:3px!important}html[border-radius-live] #rank-list-vm,html[border-radius-live] .head-info-section{border-radius:3px 3px 0 0!important}html[border-radius-live] .gift-control-section{border-radius:0 0 3px 3px!important}html[border-radius-live] .follow-ctnr .right-part{border-radius:0 3px 3px 0!important}html[border-radius-live] .chat-control-panel{border-radius:0 0 3px 3px!important}html[border-radius-live] .follow-ctnr .left-part,html[border-radius-live] #rank-list-ctnr-box.bgStyle{border-radius:3px 0 0 3px!important}html[border-radius-search] #nav-searchform,html[border-radius-search] .nav-search-content,html[border-radius-search] .v-popover-content,html[border-radius-search] .van-popover,html[border-radius-search] .v-popover-wrap,html[border-radius-search] .v-popover,html[border-radius-search] .search-sticky-header *,html[border-radius-search] .vui_button,html[border-radius-search] .header-upload-entry,html[border-radius-search] .search-input-wrap *,html[border-radius-search] .search-input-container .search-input-wrap,html[border-radius-search] .bili-video-card__cover{border-radius:3px!important}html[border-radius-video] #nav-searchform,html[border-radius-video] .nav-search-content,html[border-radius-video] .v-popover-content,html[border-radius-video] .van-popover,html[border-radius-video] .v-popover,html[border-radius-video] .pic-box,html[border-radius-video] .action-list-container,html[border-radius-video] .actionlist-item-inner .main .cover,html[border-radius-video] .recommend-video-card .card-box .pic-box,html[border-radius-video] .recommend-video-card .card-box .pic-box .rcmd-cover .rcmd-cover-img .b-img__inner img,html[border-radius-video] .actionlist-item-inner .main .cover .cover-img .b-img__inner img,html[border-radius-video] .card-box .pic-box .pic,html[border-radius-video] .bui-collapse-header,html[border-radius-video] .base-video-sections-v1,html[border-radius-video] .bili-header .search-panel,html[border-radius-video] .bili-header .header-upload-entry,html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,html[border-radius-video] .video-tag-container .tag-panel .tag-link,html[border-radius-video] .video-tag-container .tag-panel .show-more-btn,html[border-radius-video] .vcd .cover img,html[border-radius-video] .vcd *,html[border-radius-video] .upinfo-btn-panel *,html[border-radius-video] .fixed-sidenav-storage div,html[border-radius-video] .fixed-sidenav-storage a,html[border-radius-video] .reply-box-textarea,html[border-radius-video] .reply-box-send,html[border-radius-video] .reply-box-send:after{border-radius:3px!important}html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap{border-radius:0 3px 3px 0!important}html[border-radius-video] .bpx-player-dm-btn-send .bui-button{border-radius:3px 0 0 3px!important}html[border-radius-bangumi] a[class^=mediainfo_mediaCover],html[border-radius-bangumi] a[class^=mediainfo_btnHome],html[border-radius-bangumi] [class^=follow_btnFollow],html[border-radius-bangumi] [class^=vipPaybar_textWrap__QARKv],html[border-radius-bangumi] [class^=eplist_ep_list_wrapper],html[border-radius-bangumi] [class^=RecommendItem_cover],html[border-radius-bangumi] [class^=imageListItem_wrap] [class^=imageListItem_coverWrap],html[border-radius-bangumi] [class^=navTools_navMenu]>*,html[border-radius-bangumi] [class^=navTools_item],html[border-radius-bangumi] #nav-searchform,html[border-radius-bangumi] .nav-search-content,html[border-radius-bangumi] .v-popover-content,html[border-radius-bangumi] .van-popover,html[border-radius-bangumi] .v-popover,html[border-radius-bangumi] .pic-box,html[border-radius-bangumi] .card-box .pic-box .pic,html[border-radius-bangumi] .bui-collapse-header,html[border-radius-bangumi] .base-video-sections-v1,html[border-radius-bangumi] .bili-header .search-panel,html[border-radius-bangumi] .bili-header .header-upload-entry,html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,html[border-radius-bangumi] .video-tag-container .tag-panel .tag-link,html[border-radius-bangumi] .video-tag-container .tag-panel .show-more-btn,html[border-radius-bangumi] .vcd .cover img,html[border-radius-bangumi] .vcd *,html[border-radius-bangumi] .upinfo-btn-panel *,html[border-radius-bangumi] .fixed-sidenav-storage div,html[border-radius-bangumi] .reply-box-textarea,html[border-radius-bangumi] .reply-box-send,html[border-radius-bangumi] .reply-box-send:after{border-radius:3px!important}html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap{border-radius:0 3px 3px 0!important}html[border-radius-bangumi] .bpx-player-dm-btn-send .bui-button{border-radius:3px 0 0 3px!important}html[border-radius-homepage] #nav-searchform,html[border-radius-homepage] .nav-search-content,html[border-radius-homepage] .history-item,html[border-radius-homepage] .header-upload-entry,html[border-radius-homepage] .bili-header .search-panel,html[border-radius-homepage] .bili-header .header-upload-entry,html[border-radius-homepage] .bili-header__channel .channel-link,html[border-radius-homepage] .channel-entry-more__link,html[border-radius-homepage] .header-channel-fixed-right-item,html[border-radius-homepage] .recommended-swipe-body,html[border-radius-homepage] .bili-video-card .bili-video-card__cover,html[border-radius-homepage] .bili-video-card .bili-video-card__image,html[border-radius-homepage] .bili-video-card .bili-video-card__info--icon-text,html[border-radius-homepage] .bili-live-card,html[border-radius-homepage] .floor-card,html[border-radius-homepage] .floor-card .badge,html[border-radius-homepage] .single-card.floor-card .floor-card-inner,html[border-radius-homepage] .single-card.floor-card .cover-container,html[border-radius-homepage] .primary-btn,html[border-radius-homepage] .flexible-roll-btn,html[border-radius-homepage] .palette-button-wrap .flexible-roll-btn-inner,html[border-radius-homepage] .palette-button-wrap .storage-box,html[border-radius-homepage] .palette-button-wrap,html[border-radius-homepage] .v-popover-content{border-radius:3px!important}html[border-radius-homepage] .bili-video-card__stats{border-bottom-left-radius:3px!important;border-bottom-right-radius:3px!important}html[border-radius-homepage] .floor-card .layer{display:none!important}html[border-radius-homepage] .single-card.floor-card{border:none!important}html[border-radius-popular] #nav-searchform,html[border-radius-popular] .nav-search-content,html[border-radius-popular] .v-popover-content,html[border-radius-popular] .van-popover,html[border-radius-popular] .v-popover,html[border-radius-popular] .bili-header .search-panel,html[border-radius-popular] .bili-header .header-upload-entry,html[border-radius-popular] .upinfo-btn-panel *,html[border-radius-popular] .rank-list .rank-item>.content>.img,html[border-radius-popular] .card-list .video-card .video-card__content,html[border-radius-popular] .video-list .video-card .video-card__content,html[border-radius-popular] .fixed-sidenav-storage div,html[border-radius-popular] .fixed-sidenav-storage a{border-radius:3px!important}html[border-radius-space] #nav-searchform,html[border-radius-space] .home-aside-section>*,html[border-radius-space] .living-section__follow,html[border-radius-space] .side-nav__item,html[border-radius-space] .radio-filter__item,html[border-radius-space] .vui_button,html[border-radius-space] .space-follow-btn,html[border-radius-space] .message-btn,html[border-radius-space] .more-actions__trigger,html[border-radius-space] .bili-cover-card *,html[border-radius-space] .bili-video-card *{border-radius:3px!important}html[border-radius-channel] #nav-searchform,html[border-radius-channel] .nav-search-content,html[border-radius-channel] .history-item,html[border-radius-channel] .header-upload-entry,html[border-radius-channel] .bili-header .search-panel,html[border-radius-channel] .bili-header .header-upload-entry,html[border-radius-channel] .bili-header__channel .channel-link,html[border-radius-channel] .channel-entry-more__link,html[border-radius-channel] .header-channel-fixed-right-item,html[border-radius-channel] .recommended-swipe-body,html[border-radius-channel] .bili-video-card .bili-video-card__cover,html[border-radius-channel] .bili-video-card .bili-video-card__image,html[border-radius-channel] .bili-video-card .bili-video-card__info--icon-text,html[border-radius-channel] .bili-live-card,html[border-radius-channel] .floor-card,html[border-radius-channel] .floor-card .badge,html[border-radius-channel] .single-card.floor-card .floor-card-inner,html[border-radius-channel] .single-card.floor-card .cover-container,html[border-radius-channel] .primary-btn,html[border-radius-channel] .flexible-roll-btn,html[border-radius-channel] .palette-button-wrap .flexible-roll-btn-inner,html[border-radius-channel] .palette-button-wrap .storage-box,html[border-radius-channel] .palette-button-wrap,html[border-radius-channel] .v-popover-content{border-radius:3px!important}html[border-radius-channel] .bili-video-card__stats{border-bottom-left-radius:3px!important;border-bottom-right-radius:3px!important}html[border-radius-channel] .floor-card .layer{display:none!important}html[border-radius-channel] .single-card.floor-card{border:none!important}html[beauty-scrollbar] ::-webkit-scrollbar{width:8px!important;height:8px!important;background:transparent!important}html[beauty-scrollbar] ::-webkit-scrollbar:hover{background:#80808066!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb{border:1px solid rgba(255,255,255,.4)!important;background-color:#0006!important;z-index:2147483647;border-radius:8px!important;background-clip:content-box!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb:hover{background-color:#000c!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb:active{background-color:#0009!important}@supports (-moz-appearance: none){html[beauty-scrollbar],html[beauty-scrollbar] *{scrollbar-color:#cdcdcd transparent!important;scrollbar-width:thin}}html[hide-watchlater-button] .bili-watch-later,html[hide-watchlater-button] .bili-dyn-card-video__mark,html[hide-watchlater-button] .right-container .watch-later-video,html[hide-watchlater-button] .recommend-list-container .watch-later-video,html[hide-watchlater-button] .rank-container .rank-item .van-watchlater,html[hide-watchlater-button] .history-list .video-card .van-watchlater,html[hide-watchlater-button] .history-list .video-card .watch-later,html[hide-watchlater-button] .weekly-list .video-card .van-watchlater,html[hide-watchlater-button] .weekly-list .video-card .watch-later,html[hide-watchlater-button] .popular-list .video-card .van-watchlater,html[hide-watchlater-button] .popular-list .video-card .watch-later,html[hide-watchlater-button] .i-watchlater,html[hide-watchlater-button] .bili-card-watch-later,html[hide-footer] .footer.bili-footer,html[hide-footer] .international-footer,html[hide-footer] #biliMainFooter,html[hide-footer] .biliMainFooterWrapper,html[hide-footer] .link-footer-ctnr{display:none!important}html[font-patch-live] body,html[font-patch-live] .gift-item,html[font-patch-live] .feed-card,html[font-patch-live] .bb-comment,html[font-patch-live] .comment-bilibili-fold{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:400}html[font-patch-dynamic] .reply-item .root-reply-container .content-warp .user-info .user-name{font-family:PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:500!important;font-size:14px!important}html[font-patch-dynamic] body{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:400}html[font-patch-popular] #internationalHeader,html[font-patch-popular] .international-header,html[font-patch-popular] .suggest-wrap,html[font-patch-popular] .van-popover{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:400!important}html[font-patch-popular] #app,html[font-patch-popular] .video-card .video-name{font-family:PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:500!important}html[font-patch-watchlater] body,html[font-patch-space] body,html[font-patch-space] .h .h-sign,html[font-patch-space] .reply-item .root-reply-container .content-warp .user-info .user-name,html[font-patch-space] .bili-comment.browser-pc *{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:400}html[font-patch-space] body,html[font-patch-space] .n .n-text{font-size:14px}html[font-patch-space] #page-index .channel .channel-item .small-item,html[font-patch-space] #page-video .page-head__left .be-tab-item,html[font-patch-space] .n .n-data .n-data-k,html[font-patch-space] .n .n-data .n-data-v{font-size:13px}html[common-hide-nav-search-rcmd] #nav-searchform .nav-search-input::-moz-placeholder{color:transparent}html[common-hide-nav-search-rcmd] #nav-searchform .nav-search-input::placeholder{color:transparent}html[common-hide-nav-search-rcmd] #nav-searchform .nav-search-input{-webkit-user-select:none;-moz-user-select:none;user-select:none}html[common-hide-nav-search-rcmd] #internationalHeader #nav_searchform input::-moz-placeholder{color:transparent}html[common-hide-nav-search-rcmd] #internationalHeader #nav_searchform input::placeholder{color:transparent}html[common-hide-nav-search-rcmd] #internationalHeader #nav_searchform input{-webkit-user-select:none;-moz-user-select:none;user-select:none}html[common-hide-nav-search-history] .search-panel .history{display:none}html[common-hide-nav-search-history] #internationalHeader .nav-search-box .history{display:none!important}html[common-hide-nav-search-trending] .search-panel .trending{display:none}html[common-hide-nav-search-trending] #internationalHeader .nav-search-box .trending{display:none!important}html[common-nav-search-middle-justify] .center-search__bar{margin:0 auto!important}html[common-hide-nav-homepage-logo] .left-entry .left-entry__title>svg{display:none!important}html[common-hide-nav-homepage-logo] .left-entry .zhuzhan-icon,html[common-hide-nav-homepage-logo] [class^=BiliHeaderV3_miniHeaderLogo],html[common-hide-nav-homepage] .left-entry .mini-header__title{display:none!important}html[common-hide-nav-homepage] .left-entry .left-entry__title{margin-right:0!important}html[common-hide-nav-homepage] .left-entry .zhuzhan-icon+span{display:none!important}html[common-hide-nav-homepage] [class^=BiliHeaderV3_leftEntryTitle]>div{display:none!important}html[common-hide-nav-anime] .left-entry li>a[href="//www.bilibili.com/anime/"],html[common-hide-nav-anime] .left-entry li>a[href="https://www.bilibili.com/anime/"],html[common-hide-nav-anime] [class^=BiliHeaderV3_leftEntry__] li>a[href="//www.bilibili.com/anime/"],html[common-hide-nav-anime] [class^=BiliHeaderV3_leftEntry__] li>a[href="https://www.bilibili.com/anime/"]{display:none!important}html[common-hide-nav-live] .left-entry li>a[href^="//live.bilibili.com"],html[common-hide-nav-live] .left-entry li>a[href="https://live.bilibili.com/"],html[common-hide-nav-live] [class^=BiliHeaderV3_leftEntry__] li>a[href^="//live.bilibili.com"],html[common-hide-nav-live] [class^=BiliHeaderV3_leftEntry__] li>a[href="https://live.bilibili.com/"]{display:none!important}html[common-hide-nav-game] .left-entry li>a[href^="//game.bilibili.com"],html[common-hide-nav-game] .left-entry li>a[href^="https://game.bilibili.com"],html[common-hide-nav-game] [class^=BiliHeaderV3_leftEntry__] li>a[href^="//game.bilibili.com"],html[common-hide-nav-game] [class^=BiliHeaderV3_leftEntry__] li>a[href^="https://game.bilibili.com"]{display:none!important}html[common-hide-nav-vipshop] .left-entry li>a[href^="//show.bilibili.com"],html[common-hide-nav-vipshop] .left-entry li>a[href^="https://show.bilibili.com"],html[common-hide-nav-vipshop] [class^=BiliHeaderV3_leftEntry__] li>a[href^="//show.bilibili.com"],html[common-hide-nav-vipshop] [class^=BiliHeaderV3_leftEntry__] li>a[href^="https://show.bilibili.com"]{display:none!important}html[common-hide-nav-manga] .left-entry li>a[href^="//manga.bilibili.com"],html[common-hide-nav-manga] .left-entry li>a[href^="https://manga.bilibili.com"],html[common-hide-nav-manga] [class^=BiliHeaderV3_leftEntry__] li>a[href^="//manga.bilibili.com"],html[common-hide-nav-manga] [class^=BiliHeaderV3_leftEntry__] li>a[href^="https://manga.bilibili.com"]{display:none!important}html[common-hide-nav-match] .left-entry li>a[href="//www.bilibili.com/v/game/match/"],html[common-hide-nav-match] .left-entry li>a[href^="//www.bilibili.com/match/home/"],html[common-hide-nav-match] .left-entry li>a[href^="https://www.bilibili.com/match/home/"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href="//www.bilibili.com/v/game/match/"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href^="//www.bilibili.com/match/home/"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href^="https://www.bilibili.com/match/home/"]{display:none!important}html[common-hide-nav-download-app] .left-entry .download-entry,html[common-hide-nav-download-app] .left-entry .download-client-trigger,html[common-hide-nav-blackboard] .left-entry .v-popover-wrap.left-loc-entry,html[common-hide-nav-blackboard] .left-entry .loc-entry,html[common-hide-nav-blackboard] .left-entry .v-popover-wrap a[href^="https://www.bilibili.com/video/"],html[common-hide-nav-blackboard] .left-entry .v-popover-wrap a[href^="https://www.bilibili.com/blackboard/"],html[common-hide-nav-channel-panel-popover] .left-entry .bili-header-channel-panel,html[common-hide-nav-channel-panel-popover] .left-entry .mini-header__arrow{display:none!important}html[common-hide-nav-anime-popover] .left-entry li>a[href="//www.bilibili.com/anime/"]+div,html[common-hide-nav-anime-popover] .left-entry li>a[href="https://www.bilibili.com/anime/"]+div{display:none!important}html[common-hide-nav-live-popover] .left-entry li>a[href^="//live.bilibili.com"]+div,html[common-hide-nav-live-popover] .left-entry li>a[href="https://live.bilibili.com"]+div{display:none!important}html[common-hide-nav-game-popover] .left-entry li>a[href^="//game.bilibili.com"]+div,html[common-hide-nav-game-popover] .left-entry li>a[href^="https://game.bilibili.com"]+div{display:none!important}html[common-hide-nav-manga-popover] .left-entry li>a[href^="//manga.bilibili.com"]+div,html[common-hide-nav-manga-popover] .left-entry li>a[href^="https://manga.bilibili.com"]+div{display:none!important}html[common-hide-nav-avatar] .right-entry li.header-avatar-wrap,html[common-hide-nav-vip] .right-entry .vip-wrap{display:none!important}html[common-hide-nav-message] .right-entry>:nth-child(3),html[common-hide-nav-message] .right-entry li.right-entry--message{display:none!important}html[common-hide-nav-message-red-num] .right-entry>:nth-child(3) .red-num--message,html[common-hide-nav-message-red-num] .right-entry>:nth-child(3) .red-point--message,html[common-hide-nav-message-red-num] .right-entry li.right-entry--message .red-num--message,html[common-hide-nav-message-red-num] .right-entry li.right-entry--message .red-point--message{display:none!important}html[common-hide-nav-dynamic] .right-entry>:nth-child(4){display:none!important}html[common-hide-nav-dynamic-red-num] .right-entry>:nth-child(4) .red-num--dynamic{display:none!important}html[common-hide-nav-favorite] .right-entry>:nth-child(5){display:none!important}html[common-hide-nav-history] .right-entry>:nth-child(6){display:none!important}html[common-hide-nav-member] .right-entry>:nth-child(7){display:none!important}html[common-hide-nav-upload] .right-entry li.right-entry-item--upload,html[common-hide-nav-upload] [class^=BiliHeaderV3_headerUploadEntry]{visibility:hidden!important}html[common-header-bar-padding-left] .bili-header .bili-header__bar,html[common-header-bar-padding-left] .mini-header__content,html[common-header-bar-padding-left] [class^=BiliHeaderV3_biliHeaderBar]{padding-left:var(--common-header-bar-padding-left)!important}html[common-header-bar-search-width] .bili-header .center-search-container .center-search__bar,html[common-header-bar-search-width] .bili-header-m .nav-search-box,html[common-header-bar-search-width] .international-header .nav-search-box{width:var(--common-header-bar-search-width)!important;max-width:var(--common-header-bar-search-width)!important;min-width:0!important}html[common-header-bar-search-width] .center-search__bar{margin:0 auto}html[common-header-bar-search-margin-left] .center-search__bar{margin-left:var(--common-header-bar-search-margin-left)!important}html[common-header-bar-padding-right] .bili-header .bili-header__bar,html[common-header-bar-padding-right] .mini-header__content,html[common-header-bar-padding-right] [class^=BiliHeaderV3_biliHeaderBar]{padding-right:var(--common-header-bar-padding-right)!important}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a.woff2) format("woff2");unicode-range:U+9aa2-ffe5}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.b.woff2) format("woff2");unicode-range:U+8983-9aa0}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.c.woff2) format("woff2");unicode-range:U+78f2-897b}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.d.woff2) format("woff2");unicode-range:U+646d-78d9}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.e.woff2) format("woff2");unicode-range:U+30e0-6445}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.f.woff2) format("woff2");unicode-range:U+101-30df}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.g.woff2) format("woff2");unicode-range:U+9aa8,U+9ab8,U+9ad3,U+9ad8,U+9b03,U+9b3c,U+9b41-9b42,U+9b44,U+9b4f,U+9b54,U+9c7c,U+9c81,U+9c8d,U+9c9c,U+9ca4,U+9cb8,U+9cc3,U+9cd6,U+9cde,U+9e1f,U+9e21,U+9e23,U+9e25-9e26,U+9e2d,U+9e2f,U+9e33,U+9e35,U+9e3d,U+9e3f,U+9e43,U+9e45,U+9e4a,U+9e4f,U+9e64,U+9e70,U+9e7f,U+9e93,U+9ea6,U+9ebb,U+9ec4,U+9ecd-9ece,U+9ed1,U+9ed4,U+9ed8,U+9f0e,U+9f13,U+9f20,U+9f3b,U+9f50,U+9f7f,U+9f84,U+9f8b,U+9f99-9f9a,U+9f9f,U+ff01,U+ff08-ff09,U+ff0c,U+ff1a-ff1b,U+ff1f}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.h.woff2) format("woff2");unicode-range:U+975b,U+975e,U+9760-9762,U+9769,U+9773-9774,U+9776,U+978b,U+978d,U+9798,U+97a0,U+97ad,U+97e6-97e7,U+97e9,U+97ed,U+97f3,U+97f5-97f6,U+9875-9877,U+9879-987b,U+987d-987f,U+9881-9882,U+9884-9888,U+988a,U+9890-9891,U+9893,U+9896-9898,U+989c-989d,U+98a0,U+98a4,U+98a7,U+98ce,U+98d8,U+98de-98df,U+9910,U+9965,U+996d-9972,U+9975-9976,U+997a,U+997c,U+997f,U+9981,U+9985-9986,U+9988,U+998b,U+998f,U+9992,U+9996,U+9999,U+9a6c-9a71,U+9a73-9a74,U+9a76,U+9a79,U+9a7b-9a7c,U+9a7e,U+9a82,U+9a84,U+9a86-9a87,U+9a8b-9a8c,U+9a8f,U+9a91,U+9a97,U+9a9a,U+9aa1,U+9aa4}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.i.woff2) format("woff2");unicode-range:U+9570,U+9576,U+957f,U+95e8,U+95ea,U+95ed-95f0,U+95f2,U+95f4,U+95f7-95fb,U+95fd,U+9600-9602,U+9605,U+9609,U+960e,U+9610-9611,U+9614,U+961c,U+961f,U+962e,U+9632-9636,U+963b,U+963f-9640,U+9644-9648,U+964b-964d,U+9650,U+9655,U+965b,U+9661-9662,U+9664,U+9668-966a,U+9675-9677,U+9685-9686,U+968b,U+968f-9690,U+9694,U+9698-9699,U+969c,U+96a7,U+96b6,U+96be,U+96c0-96c1,U+96c4-96c7,U+96cc-96cd,U+96cf,U+96d5,U+96e8,U+96ea,U+96f6-96f7,U+96f9,U+96fe,U+9700,U+9704,U+9707,U+9709,U+970d,U+9713,U+9716,U+971c,U+971e,U+9732,U+9738-9739,U+9752,U+9756,U+9759}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.j.woff2) format("woff2");unicode-range:U+9179,U+917f,U+9187,U+9189,U+918b,U+918d,U+9190,U+9192,U+919a-919b,U+91ba,U+91c7,U+91c9-91ca,U+91cc-91cf,U+91d1,U+91dc,U+9274,U+93d6,U+9488-9489,U+948e,U+9492-9493,U+9497,U+9499,U+949d-94a3,U+94a5-94a9,U+94ae,U+94b1,U+94b3,U+94b5,U+94bb,U+94be,U+94c0-94c3,U+94c5-94c6,U+94dc-94dd,U+94e1,U+94e3,U+94ec-94ed,U+94f0-94f2,U+94f6,U+94f8,U+94fa,U+94fe,U+9500-9501,U+9504-9505,U+9508,U+950b-950c,U+9510-9511,U+9517,U+9519-951a,U+9521,U+9523-9526,U+9528,U+952d-9530,U+9539,U+953b,U+9540-9541,U+9547,U+954a,U+954d,U+9550-9551,U+955c,U+9563,U+956d}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.k.woff2) format("woff2");unicode-range:U+9001-9003,U+9005-9006,U+9009-900a,U+900d,U+900f-9012,U+9014,U+9017,U+901a-901b,U+901d-9022,U+902e,U+9038,U+903b-903c,U+903e,U+9041-9042,U+9044,U+9047,U+904d,U+904f-9053,U+9057,U+905b,U+9062-9063,U+9065,U+9068,U+906d-906e,U+9075,U+907d,U+907f-9080,U+9082-9083,U+908b,U+9091,U+9093,U+9099,U+90a2-90a3,U+90a6,U+90aa,U+90ae-90af,U+90b1,U+90b5,U+90b8-90b9,U+90bb,U+90c1,U+90ca,U+90ce,U+90d1,U+90dd,U+90e1,U+90e7-90e8,U+90ed,U+90f4,U+90f8,U+90fd,U+9102,U+9119,U+9149,U+914b-914d,U+9152,U+9157,U+915a,U+915d-915e,U+9161,U+9163,U+9165,U+916a,U+916c,U+916e,U+9171,U+9175-9178}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.l.woff2) format("woff2");unicode-range:U+8e44,U+8e47-8e48,U+8e4a-8e4b,U+8e51,U+8e59,U+8e66,U+8e6c-8e6d,U+8e6f,U+8e72,U+8e74,U+8e76,U+8e7f,U+8e81,U+8e87,U+8e8f,U+8eab-8eac,U+8eaf,U+8eb2,U+8eba,U+8f66-8f69,U+8f6c,U+8f6e-8f72,U+8f74,U+8f7b,U+8f7d,U+8f7f,U+8f83-8f8a,U+8f8d-8f8e,U+8f90-8f91,U+8f93,U+8f95-8f99,U+8f9b-8f9c,U+8f9e-8f9f,U+8fa3,U+8fa8-8fa9,U+8fab,U+8fb0-8fb1,U+8fb9,U+8fbd-8fbe,U+8fc1-8fc2,U+8fc4-8fc5,U+8fc7-8fc8,U+8fce,U+8fd0-8fd1,U+8fd3-8fd5,U+8fd8-8fd9,U+8fdb-8fdf,U+8fe2,U+8fe6,U+8fe8,U+8fea-8feb,U+8fed,U+8ff0,U+8ff3,U+8ff7-8ff9,U+8ffd,U+9000}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.m.woff2) format("woff2");unicode-range:U+8d24-8d31,U+8d34-8d35,U+8d37-8d3f,U+8d41-8d45,U+8d48,U+8d4a-8d4c,U+8d4e-8d50,U+8d54,U+8d56,U+8d58,U+8d5a-8d5b,U+8d5d-8d5e,U+8d60-8d64,U+8d66-8d67,U+8d6b,U+8d70,U+8d74-8d77,U+8d81,U+8d85,U+8d8a-8d8b,U+8d9f,U+8da3,U+8db3-8db4,U+8db8,U+8dbe-8dbf,U+8dc3-8dc4,U+8dcb-8dcc,U+8dd1,U+8dd7,U+8ddb,U+8ddd,U+8ddf,U+8de4,U+8de8,U+8dea,U+8def,U+8df3,U+8df5,U+8df7,U+8dfa-8dfb,U+8e09-8e0a,U+8e0c,U+8e0f,U+8e1d-8e1e,U+8e22,U+8e29-8e2a,U+8e2e,U+8e31,U+8e35,U+8e39,U+8e42}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.n.woff2) format("woff2");unicode-range:U+8bc9-8bcd,U+8bcf,U+8bd1,U+8bd3,U+8bd5,U+8bd7-8bd8,U+8bda-8bdb,U+8bdd-8bde,U+8be0-8be9,U+8beb-8bf5,U+8bf7-8bf8,U+8bfa-8bfb,U+8bfd-8c01,U+8c03-8c06,U+8c08,U+8c0a-8c0b,U+8c0d-8c13,U+8c15,U+8c17,U+8c19-8c1c,U+8c22-8c24,U+8c26-8c2a,U+8c2c-8c2d,U+8c30-8c35,U+8c37,U+8c41,U+8c46,U+8c4c,U+8c61-8c62,U+8c6a-8c6b,U+8c79-8c7a,U+8c82,U+8c89,U+8c8c,U+8d1d-8d1f,U+8d21-8d23}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.o.woff2) format("woff2");unicode-range:U+889c,U+88a4,U+88ab,U+88ad,U+88b1,U+88c1-88c2,U+88c5-88c6,U+88c9,U+88d4-88d5,U+88d8-88d9,U+88df,U+88e3-88e4,U+88e8,U+88f1,U+88f3-88f4,U+88f8-88f9,U+88fe,U+8902,U+8910,U+8912-8913,U+891a-891b,U+8921,U+8925,U+892a-892b,U+8934,U+8936,U+8941,U+8944,U+895e-895f,U+8966,U+897f,U+8981,U+8986,U+89c1-89c2,U+89c4-89c6,U+89c8-89cb,U+89ce,U+89d0-89d2,U+89e3,U+89e5-89e6,U+8a00,U+8a07,U+8a79,U+8a89-8a8a,U+8a93,U+8b66,U+8b6c,U+8ba1-8bab,U+8bad-8bb0,U+8bb2-8bb3,U+8bb6-8bba,U+8bbc-8bc1,U+8bc4-8bc6,U+8bc8}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.p.woff2) format("woff2");unicode-range:U+8695,U+869c,U+86a3-86a4,U+86a7,U+86aa,U+86af,U+86b1,U+86c0,U+86c6-86c7,U+86ca-86cb,U+86d0,U+86d4,U+86d9,U+86db,U+86df,U+86e4,U+86ee,U+86f0,U+86f9,U+86fe,U+8700,U+8702-8703,U+8708-8709,U+870d,U+8712-8713,U+8715,U+8717-8718,U+871a,U+871c,U+8721,U+8725,U+8734,U+8737,U+873b,U+873f,U+8747,U+8749,U+874c,U+874e,U+8757,U+8759,U+8760,U+8763,U+8774,U+8776,U+877c,U+8782-8783,U+8785,U+878d,U+8793,U+879f,U+87af,U+87b3,U+87ba,U+87c6,U+87ca,U+87d1-87d2,U+87e0,U+87e5,U+87f9,U+87fe,U+8815,U+8822,U+8839,U+8840,U+8845,U+884c-884d,U+8854,U+8857,U+8859,U+8861,U+8863,U+8865,U+8868,U+886b-886c,U+8870,U+8877,U+887d-887f,U+8881-8882,U+8884-8885,U+8888,U+888b,U+888d,U+8892,U+8896}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.q.woff2) format("woff2");unicode-range:U+83dc-83dd,U+83e0,U+83e9,U+83f1-83f2,U+8403-8404,U+840b-840e,U+841d,U+8424-8428,U+843d,U+8451,U+8457,U+8459,U+845b,U+8461,U+8463,U+8469,U+846b-846c,U+8471,U+8475,U+847a,U+8482,U+848b,U+8499,U+849c,U+84b2,U+84b8,U+84bf,U+84c4,U+84c9,U+84d1,U+84d6,U+84dd,U+84df,U+84e6,U+84ec,U+8511,U+8513,U+8517,U+851a,U+851f,U+8521,U+852b-852c,U+8537,U+853b-853d,U+8549-854a,U+8559,U+8574,U+857e,U+8584,U+8587,U+858f,U+859b,U+85aa,U+85af-85b0,U+85c9,U+85cf-85d0,U+85d3,U+85d5,U+85e4,U+85e9,U+85fb,U+8611,U+8638,U+864e-8651,U+8654,U+865a,U+865e,U+866b-866c,U+8671,U+8679,U+867d-867e,U+8680-8682,U+868a,U+868c-868d,U+8693}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.r.woff2) format("woff2");unicode-range:U+8273,U+827a,U+827e,U+8282,U+828a-828b,U+828d,U+8292,U+8299,U+829c-829d,U+82a5-82a6,U+82a9,U+82ab-82ad,U+82af,U+82b1,U+82b3,U+82b7-82b9,U+82bd,U+82c7,U+82cd,U+82cf,U+82d1,U+82d3-82d4,U+82d7,U+82db,U+82de-82df,U+82e3,U+82e5-82e6,U+82eb,U+82ef,U+82f1,U+82f9,U+82fb,U+8301-8305,U+8309,U+830e,U+8314,U+8317,U+8327-8328,U+832b-832c,U+832f,U+8335-8336,U+8338-8339,U+8340,U+8346-8347,U+8349,U+834f-8352,U+8354,U+835a,U+835c,U+8361,U+8363-8364,U+8367,U+836b,U+836f,U+8377,U+837c,U+8386,U+8389,U+838e,U+8393,U+839e,U+83a0,U+83ab,U+83b1-83b4,U+83b7,U+83b9-83ba,U+83bd,U+83c1,U+83c5,U+83c7,U+83ca,U+83cc,U+83cf}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.s.woff2) format("woff2");unicode-range:U+80de,U+80e1,U+80e7,U+80ea-80eb,U+80ed,U+80ef-80f0,U+80f3-80f4,U+80f6,U+80f8,U+80fa,U+80fd,U+8102,U+8106,U+8109-810a,U+810d,U+810f-8111,U+8113-8114,U+8116,U+8118,U+811a,U+812f,U+8131,U+8138,U+813e,U+8146,U+814a-814c,U+8150-8151,U+8154-8155,U+8165,U+816e,U+8170,U+8174,U+8179-817c,U+817e-8180,U+818a,U+818f,U+8198,U+819b-819d,U+81a8,U+81b3,U+81ba-81bb,U+81c0,U+81c2-81c3,U+81c6,U+81ca,U+81e3,U+81ea,U+81ec-81ed,U+81f3-81f4,U+81fb-81fc,U+81fe,U+8200,U+8205-8206,U+820c-820d,U+8210,U+8212,U+8214,U+821c,U+821e-821f,U+822a-822c,U+8230-8231,U+8235-8239,U+8247,U+8258,U+826f-8270,U+8272}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.t.woff2) format("woff2");unicode-range:U+7f72,U+7f81,U+7f8a,U+7f8c,U+7f8e,U+7f94,U+7f9a,U+7f9e,U+7fa1,U+7fa4,U+7fb2,U+7fb8-7fb9,U+7fbd,U+7fc1,U+7fc5,U+7fcc,U+7fce,U+7fd4-7fd5,U+7fd8,U+7fdf-7fe1,U+7fe6,U+7fe9,U+7ff0-7ff1,U+7ff3,U+7ffb-7ffc,U+8000-8001,U+8003,U+8005,U+800c-800d,U+8010,U+8012,U+8015,U+8017-8019,U+8027,U+802a,U+8033,U+8036-8038,U+803b,U+803d,U+803f,U+8042,U+8046,U+804a-804c,U+8052,U+8054,U+8058,U+805a,U+806a,U+807f,U+8083-8084,U+8086-8087,U+8089,U+808b-808c,U+8096,U+8098,U+809a-809b,U+809d,U+80a0-80a2,U+80a4-80a5,U+80a9-80aa,U+80ae-80af,U+80b2,U+80b4,U+80ba,U+80be-80c1,U+80c3-80c4,U+80c6,U+80cc,U+80ce,U+80d6,U+80da-80dc}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.u.woff2) format("woff2");unicode-range:U+7eb5-7eba,U+7ebd,U+7ebf,U+7ec2-7eca,U+7ecd-7ed5,U+7ed8-7edf,U+7ee1-7ee3,U+7ee5-7ee7,U+7ee9-7eeb,U+7eed,U+7eef-7ef0,U+7ef3-7ef8,U+7efc-7efd,U+7eff-7f00,U+7f04-7f09,U+7f0e-7f0f,U+7f13-7f16,U+7f18,U+7f1a,U+7f1c-7f1d,U+7f1f-7f22,U+7f24-7f26,U+7f28-7f2a,U+7f2d-7f2e,U+7f30,U+7f34,U+7f38,U+7f3a,U+7f42,U+7f50-7f51,U+7f54-7f55,U+7f57,U+7f5a,U+7f61-7f62,U+7f69-7f6a,U+7f6e}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.v.woff2) format("woff2");unicode-range:U+7b4c,U+7b4f-7b52,U+7b54,U+7b56,U+7b5b,U+7b5d,U+7b75,U+7b77,U+7b79,U+7b7e,U+7b80,U+7b8d,U+7b94-7b95,U+7b97,U+7ba1,U+7ba9-7bab,U+7bad,U+7bb1,U+7bb8,U+7bc6-7bc7,U+7bd1,U+7bd3,U+7bd9,U+7bdd,U+7be1,U+7bee,U+7bf1,U+7bf7,U+7bfe,U+7c07,U+7c0c,U+7c27,U+7c2a,U+7c38,U+7c3f,U+7c41,U+7c4d,U+7c73,U+7c7b,U+7c7d,U+7c89,U+7c92,U+7c95,U+7c97-7c98,U+7c9f,U+7ca4-7ca5,U+7caa,U+7cae,U+7cb1,U+7cb3,U+7cb9,U+7cbc-7cbe,U+7cc5,U+7cca,U+7cd5-7cd7,U+7cd9,U+7cdc,U+7cdf-7ce0,U+7cef,U+7cfb,U+7d0a,U+7d20,U+7d22,U+7d27,U+7d2b,U+7d2f,U+7d6e,U+7e41,U+7e82,U+7ea0-7ea4,U+7ea6-7ea8,U+7eaa-7ead,U+7eaf-7eb3}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.w.woff2) format("woff2");unicode-range:U+7981,U+7984-7985,U+798f,U+79b9,U+79bb,U+79bd-79be,U+79c0-79c1,U+79c3,U+79c6,U+79c9,U+79cb,U+79cd,U+79d1-79d2,U+79d8,U+79df,U+79e3-79e4,U+79e6-79e7,U+79e9,U+79ef-79f0,U+79f8,U+79fb,U+79fd,U+7a00,U+7a0b,U+7a0d-7a0e,U+7a14,U+7a17,U+7a1a,U+7a20,U+7a33,U+7a37,U+7a39,U+7a3b-7a3d,U+7a3f,U+7a46,U+7a51,U+7a57,U+7a74,U+7a76-7a77,U+7a79-7a7a,U+7a7f,U+7a81,U+7a83-7a84,U+7a88,U+7a8d,U+7a91-7a92,U+7a95-7a98,U+7a9c-7a9d,U+7a9f,U+7aa5-7aa6,U+7abf,U+7acb,U+7ad6,U+7ad9,U+7ade-7ae0,U+7ae3,U+7ae5-7ae6,U+7aed,U+7aef,U+7af9,U+7afd,U+7aff,U+7b03,U+7b06,U+7b08,U+7b0b,U+7b11,U+7b14,U+7b19,U+7b1b,U+7b20,U+7b26,U+7b28,U+7b2c,U+7b3a,U+7b3c,U+7b49,U+7b4b}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.x.woff2) format("woff2");unicode-range:U+77aa,U+77ac,U+77b0,U+77b3,U+77b5,U+77bb,U+77bf,U+77d7,U+77db-77dc,U+77e2-77e3,U+77e5,U+77e9,U+77eb,U+77ed-77ee,U+77f3,U+77fd-77ff,U+7801-7802,U+780c-780d,U+7812,U+7814,U+7816,U+781a,U+781d,U+7823,U+7825,U+7827,U+7830,U+7834,U+7837-7838,U+783a,U+783e,U+7840,U+7845,U+784c,U+7852,U+7855,U+785d,U+786b-786c,U+786e,U+787c,U+7887,U+7889,U+788c-788e,U+7891,U+7897-7898,U+789c,U+789f,U+78a5,U+78a7,U+78b0-78b1,U+78b3-78b4,U+78be,U+78c1,U+78c5,U+78ca-78cb,U+78d0,U+78d5,U+78e8,U+78ec,U+78f7,U+78fa,U+7901,U+7934,U+793a,U+793c,U+793e,U+7940-7941,U+7948,U+7956-7957,U+795a-795b,U+795d-7960,U+7965,U+7968,U+796d,U+796f,U+7977-7978,U+797a,U+7980}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.y.woff2) format("woff2");unicode-range:U+761f,U+7624,U+7626,U+7629-762b,U+7634-7635,U+7638,U+763e,U+764c,U+7656,U+765e,U+7663,U+766b,U+7678,U+767b,U+767d-767e,U+7682,U+7684,U+7686-7688,U+768b,U+768e,U+7691,U+7693,U+7696,U+7699,U+76ae,U+76b1,U+76b4,U+76bf,U+76c2,U+76c5-76c6,U+76c8,U+76ca,U+76ce-76d2,U+76d4,U+76d6-76d8,U+76db,U+76df,U+76ee-76ef,U+76f2,U+76f4,U+76f8-76f9,U+76fc,U+76fe,U+7701,U+7708-7709,U+770b,U+771f-7720,U+7726,U+7728-7729,U+772f,U+7736-7738,U+773a,U+773c,U+7740-7741,U+7750-7751,U+775a-775b,U+7761,U+7763,U+7765-7766,U+7768,U+776b-776c,U+7779,U+777d,U+777f,U+7784-7785,U+778c,U+778e,U+7791-7792,U+779f-77a0,U+77a5,U+77a7,U+77a9}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.z.woff2) format("woff2");unicode-range:U+7435-7436,U+743c,U+7455,U+7459-745a,U+745c,U+745e-745f,U+7470,U+7476,U+7480,U+7483,U+7487,U+749c,U+749e,U+74a7-74a8,U+74dc,U+74e2-74e4,U+74e6,U+74ee,U+74f6-74f7,U+7504,U+7518,U+751a,U+751c,U+751f,U+7525,U+7528-7529,U+752b-752d,U+7530-7533,U+7535,U+7537-7538,U+753b,U+7545,U+754c,U+754f,U+7554,U+7559,U+755c,U+7565-7566,U+756a,U+7574,U+7578,U+7583,U+7586,U+758f,U+7591,U+7597,U+7599-759a,U+759f,U+75a1,U+75a4-75a5,U+75ab,U+75ae-75b2,U+75b4-75b5,U+75b9,U+75bc-75be,U+75c5,U+75c7-75ca,U+75cd,U+75d2,U+75d4-75d5,U+75d8,U+75db,U+75de,U+75e2-75e3,U+75e8,U+75ea,U+75f0,U+75f4,U+75f9,U+7600-7601}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aa.woff2) format("woff2");unicode-range:U+725f,U+7261-7262,U+7267,U+7269,U+7272,U+7275,U+7279-727a,U+7280-7281,U+7284,U+728a,U+7292,U+729f,U+72ac,U+72af,U+72b6-72b9,U+72c1-72c2,U+72c4,U+72c8,U+72ce,U+72d0,U+72d2,U+72d7,U+72d9,U+72de,U+72e0-72e1,U+72e9,U+72ec-72f2,U+72f7-72f8,U+72fc,U+730a,U+730e,U+7316,U+731b-731d,U+7322,U+7325,U+7329-732c,U+732e,U+7334,U+733e-733f,U+7350,U+7357,U+7360,U+736d,U+7384,U+7387,U+7389,U+738b,U+7396,U+739b,U+73a9,U+73ab,U+73af-73b0,U+73b2,U+73b7,U+73ba-73bb,U+73c0,U+73c8,U+73ca,U+73cd,U+73d0-73d1,U+73d9,U+73e0,U+73ed,U+7403,U+7405-7406,U+7409-740a,U+740f-7410,U+741a,U+7422,U+7425,U+742a,U+7433-7434}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ab.woff2) format("woff2");unicode-range:U+706d,U+706f-7070,U+7075-7076,U+7078,U+707c,U+707e-707f,U+7089-708a,U+708e,U+7092,U+7094-7096,U+7099,U+70ab-70af,U+70b1,U+70b3,U+70b8-70b9,U+70bc-70bd,U+70c1-70c3,U+70c8,U+70ca,U+70d8-70d9,U+70db,U+70df,U+70e4,U+70e6-70e7,U+70e9,U+70eb-70ed,U+70ef,U+70f7,U+70f9,U+70fd,U+7109-710a,U+7115,U+7119-711a,U+7126,U+7130-7131,U+7136,U+714c,U+714e,U+715e,U+7164,U+7166-7168,U+716e,U+7172-7173,U+717d,U+7184,U+718a,U+718f,U+7194,U+7198-7199,U+719f-71a0,U+71a8,U+71ac,U+71b9,U+71c3,U+71ce,U+71d5,U+71e5,U+7206,U+722a,U+722c,U+7231,U+7235-7239,U+723d,U+7247-7248,U+724c-724d,U+7252,U+7259,U+725b}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ac.woff2) format("woff2");unicode-range:U+6df7,U+6df9,U+6dfb,U+6e05,U+6e0a,U+6e0d-6e0e,U+6e10,U+6e14,U+6e17,U+6e1a,U+6e1d,U+6e20-6e21,U+6e23-6e25,U+6e29,U+6e2d,U+6e2f,U+6e32,U+6e34,U+6e38,U+6e3a,U+6e43,U+6e4d,U+6e56,U+6e58,U+6e5b,U+6e6e,U+6e7e-6e7f,U+6e83,U+6e85,U+6e89,U+6e90,U+6e9c,U+6ea2,U+6ea5,U+6eaa,U+6eaf,U+6eb6,U+6eba,U+6ec1,U+6ec7,U+6ecb,U+6ed1,U+6ed3-6ed5,U+6eda,U+6ede,U+6ee1,U+6ee4-6ee6,U+6ee8-6ee9,U+6ef4,U+6f02,U+6f06,U+6f09,U+6f0f,U+6f13-6f15,U+6f20,U+6f29-6f2b,U+6f31,U+6f33,U+6f3e,U+6f46-6f47,U+6f4d,U+6f58,U+6f5c,U+6f5e,U+6f62,U+6f66,U+6f6d-6f6e,U+6f84,U+6f88-6f89,U+6f8e,U+6f9c,U+6fa1,U+6fb3,U+6fb9,U+6fc0,U+6fd1-6fd2,U+6fe1,U+7011,U+701a,U+7023,U+704c,U+706b}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ad.woff2) format("woff2");unicode-range:U+6ccc,U+6cd3,U+6cd5,U+6cdb,U+6cde,U+6ce1-6ce3,U+6ce5,U+6ce8,U+6cea-6ceb,U+6cef-6cf1,U+6cf3,U+6cf5,U+6cfb-6cfe,U+6d01,U+6d0b,U+6d12,U+6d17,U+6d1b,U+6d1e,U+6d25,U+6d27,U+6d2a,U+6d31-6d32,U+6d3b-6d3e,U+6d41,U+6d43,U+6d45-6d47,U+6d4a-6d4b,U+6d4e-6d4f,U+6d51,U+6d53,U+6d59-6d5a,U+6d63,U+6d66,U+6d69-6d6a,U+6d6e,U+6d74,U+6d77-6d78,U+6d82,U+6d85,U+6d88-6d89,U+6d8c,U+6d8e,U+6d93,U+6d95,U+6d9b,U+6d9d,U+6d9f-6da1,U+6da3-6da4,U+6da6-6daa,U+6dae-6daf,U+6db2,U+6db5,U+6db8,U+6dc0,U+6dc4-6dc7,U+6dcb-6dcc,U+6dd1,U+6dd6,U+6dd8-6dd9,U+6de1,U+6de4,U+6deb-6dec,U+6dee,U+6df1,U+6df3}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ae.woff2) format("woff2");unicode-range:U+6b92,U+6b96,U+6b9a,U+6ba1,U+6bb4-6bb5,U+6bb7,U+6bbf,U+6bc1,U+6bc5,U+6bcb,U+6bcd,U+6bcf,U+6bd2,U+6bd4-6bd7,U+6bd9,U+6bdb,U+6be1,U+6beb,U+6bef,U+6c05,U+6c0f,U+6c11,U+6c13-6c14,U+6c16,U+6c1b,U+6c1f,U+6c22,U+6c24,U+6c26-6c28,U+6c2e-6c30,U+6c32,U+6c34,U+6c38,U+6c3d,U+6c40-6c42,U+6c47,U+6c49,U+6c50,U+6c55,U+6c57,U+6c5b,U+6c5d-6c61,U+6c64,U+6c68-6c6a,U+6c70,U+6c72,U+6c76,U+6c79,U+6c7d-6c7e,U+6c81-6c83,U+6c86,U+6c88-6c89,U+6c8c,U+6c8f-6c90,U+6c93,U+6c99,U+6c9b,U+6c9f,U+6ca1,U+6ca4-6ca7,U+6caa-6cab,U+6cae,U+6cb3,U+6cb8-6cb9,U+6cbb-6cbf,U+6cc4-6cc5,U+6cc9-6cca}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.af.woff2) format("woff2");unicode-range:U+68ad,U+68af-68b0,U+68b3,U+68b5,U+68c0,U+68c2,U+68c9,U+68cb,U+68cd,U+68d2,U+68d5,U+68d8,U+68da,U+68e0,U+68ee,U+68f1,U+68f5,U+68fa,U+6905,U+690d-690e,U+6912,U+692d,U+6930,U+693d,U+693f,U+6942,U+6954,U+6957,U+695a,U+695e,U+6963,U+696b,U+6977-6978,U+697c,U+6982,U+6984,U+6986,U+6994,U+699c,U+69a8,U+69ad,U+69b4,U+69b7,U+69bb,U+69c1,U+69cc,U+69d0,U+69db,U+69fd,U+69ff,U+6a0a,U+6a1f,U+6a21,U+6a2a,U+6a31,U+6a35,U+6a3d,U+6a44,U+6a47,U+6a58-6a59,U+6a61,U+6a71,U+6a80,U+6a84,U+6a8e,U+6a90,U+6aac,U+6b20-6b23,U+6b27,U+6b32,U+6b3a,U+6b3e,U+6b47,U+6b49,U+6b4c,U+6b62-6b67,U+6b6a,U+6b79,U+6b7b-6b7c,U+6b81,U+6b83-6b84,U+6b86-6b87,U+6b89-6b8b}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ag.woff2) format("woff2");unicode-range:U+6756,U+675c,U+675e-6761,U+6765,U+6768,U+676d,U+676f-6770,U+6773,U+6775,U+6777,U+677c,U+677e-677f,U+6781,U+6784,U+6787,U+6789,U+6790,U+6795,U+6797,U+679a,U+679c-679d,U+67a2-67a3,U+67aa-67ab,U+67ad,U+67af-67b0,U+67b6-67b7,U+67c4,U+67cf-67d4,U+67d9-67da,U+67dc,U+67de,U+67e0,U+67e5,U+67e9,U+67ec,U+67ef,U+67f1,U+67f3-67f4,U+67ff-6800,U+6805,U+6807-6808,U+680b,U+680f,U+6811,U+6813,U+6816-6817,U+6821,U+6829-682a,U+6837-6839,U+683c-683d,U+6840,U+6842-6843,U+6845-6846,U+6848,U+684c,U+6850-6851,U+6853-6854,U+6863,U+6865,U+6868-6869,U+6874,U+6876,U+6881,U+6885-6886,U+6893,U+6897,U+68a2,U+68a6-68a8}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ah.woff2) format("woff2");unicode-range:U+65f7,U+65fa,U+6602,U+6606,U+660a,U+660c,U+660e-660f,U+6613-6614,U+6619,U+661d,U+661f-6620,U+6625,U+6627-6628,U+662d,U+662f,U+6631,U+6635,U+663c,U+663e,U+6643,U+664b-664c,U+664f,U+6652-6653,U+6655-6657,U+665a,U+6664,U+6666,U+6668,U+666e-6670,U+6674,U+6676-6677,U+667a,U+667e,U+6682,U+6684,U+6687,U+668c,U+6691,U+6696-6697,U+669d,U+66a7,U+66ae,U+66b4,U+66d9,U+66dc-66dd,U+66e6,U+66f0,U+66f2-66f4,U+66f9,U+66fc,U+66fe-6700,U+6708-6709,U+670b,U+670d,U+6714-6715,U+6717,U+671b,U+671d,U+671f,U+6726,U+6728,U+672a-672d,U+672f,U+6731,U+6734-6735,U+673a,U+673d,U+6740,U+6742-6743,U+6746,U+6748-6749,U+674e-6751}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ai.woff2) format("woff2");unicode-range:U+6467,U+6469,U+6478-6479,U+6482,U+6485,U+6487,U+6491-6492,U+6495,U+649e,U+64a4,U+64a9,U+64ac-64ae,U+64b0,U+64b5,U+64b8,U+64ba,U+64bc,U+64c2,U+64c5,U+64cd-64ce,U+64d2,U+64d8,U+64de,U+64e2,U+64e6,U+6500,U+6512,U+6518,U+6525,U+652b,U+652f,U+6536,U+6538-6539,U+653b,U+653e-653f,U+6545,U+6548,U+654c,U+654f,U+6551,U+6555-6556,U+6559,U+655b,U+655d-655e,U+6562-6563,U+6566,U+656c,U+6570,U+6572,U+6574,U+6577,U+6587,U+658b-658c,U+6590-6591,U+6593,U+6597,U+6599,U+659c,U+659f,U+65a1,U+65a4-65a5,U+65a7,U+65a9,U+65ab,U+65ad,U+65af-65b0,U+65b9,U+65bd,U+65c1,U+65c4-65c5,U+65cb-65cc,U+65cf,U+65d7,U+65e0,U+65e2,U+65e5-65e9,U+65ec-65ed,U+65f1,U+65f6}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aj.woff2) format("woff2");unicode-range:U+6323-6325,U+6328,U+632a-632b,U+632f,U+6332,U+633a,U+633d,U+6342,U+6345-6346,U+6349,U+634b-6350,U+6355,U+635e-635f,U+6361-6363,U+6367,U+636e,U+6371,U+6376-6377,U+637a-637b,U+6380,U+6382,U+6387-6389,U+638c,U+638f-6390,U+6392,U+6396,U+6398,U+63a0,U+63a2-63a3,U+63a5,U+63a7-63aa,U+63ac,U+63b0,U+63b3-63b4,U+63b7-63b8,U+63ba,U+63c4,U+63c9,U+63cd,U+63cf-63d0,U+63d2,U+63d6,U+63e1,U+63e3,U+63e9-63ea,U+63ed,U+63f4,U+63f6,U+63fd,U+6400-6402,U+6405,U+640f-6410,U+6413-6414,U+641c,U+641e,U+6421,U+642a,U+642c-642d,U+643a,U+643d,U+6441,U+6444,U+6446-6448,U+644a,U+6452,U+6454,U+6458,U+645e}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ak.woff2) format("woff2");unicode-range:U+6258,U+625b,U+6263,U+6266-6267,U+6269-6270,U+6273,U+6276,U+6279,U+627c,U+627e-6280,U+6284,U+6289-628a,U+6291-6293,U+6295-6298,U+629a-629b,U+62a0-62a2,U+62a4-62a5,U+62a8,U+62ab-62ac,U+62b1,U+62b5,U+62b9,U+62bc-62bd,U+62bf,U+62c2,U+62c4-62ca,U+62cc-62ce,U+62d0,U+62d2-62d4,U+62d6-62d9,U+62db-62dc,U+62df,U+62e2-62e3,U+62e5-62e9,U+62ec-62ed,U+62ef,U+62f1,U+62f3-62f4,U+62f7,U+62fc-62ff,U+6301-6302,U+6307,U+6309,U+630e,U+6311,U+6316,U+631a-631b,U+631d-6321}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.al.woff2) format("woff2");unicode-range:U+60cb,U+60d1,U+60d5,U+60d8,U+60da,U+60dc,U+60df-60e0,U+60e6-60e9,U+60eb-60f0,U+60f3-60f4,U+60f6,U+60f9-60fa,U+6101,U+6108-6109,U+610e-610f,U+6115,U+611a,U+611f-6120,U+6123-6124,U+6127,U+612b,U+613f,U+6148,U+614a,U+614c,U+614e,U+6151,U+6155,U+6162,U+6167-6168,U+6170,U+6175,U+6177,U+618b,U+618e,U+6194,U+61a7-61a9,U+61ac,U+61be,U+61c2,U+61c8,U+61ca,U+61d1-61d2,U+61d4,U+61e6,U+61f5,U+61ff,U+6208,U+620a,U+620c-6212,U+6216,U+6218,U+621a-621b,U+621f,U+622a,U+622c,U+622e,U+6233-6234,U+6237,U+623e-6241,U+6247-6249,U+624b,U+624d-624e,U+6251-6254}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.am.woff2) format("woff2");unicode-range:U+5fcc-5fcd,U+5fcf-5fd2,U+5fd6-5fd9,U+5fdd,U+5fe0-5fe1,U+5fe4,U+5fe7,U+5fea-5feb,U+5ff1,U+5ff5,U+5ffb,U+5ffd-6002,U+6005-6006,U+600d-600f,U+6012,U+6014-6016,U+6019,U+601c-601d,U+6020-6021,U+6025-6028,U+602a,U+602f,U+6035,U+603b-603c,U+6041,U+6043,U+604b,U+604d,U+6050,U+6052,U+6055,U+6059-605a,U+6062-6064,U+6068-606d,U+606f-6070,U+6073,U+6076,U+6078-607c,U+607f,U+6084,U+6089,U+608c-608d,U+6094,U+6096,U+609a,U+609f-60a0,U+60a3,U+60a6,U+60a8,U+60ac,U+60af,U+60b1-60b2,U+60b4,U+60b8,U+60bb-60bc,U+60c5-60c6,U+60ca}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.an.woff2) format("woff2");unicode-range:U+5e7f,U+5e84,U+5e86-5e87,U+5e8a,U+5e8f-5e90,U+5e93-5e97,U+5e99-5e9a,U+5e9c,U+5e9e-5e9f,U+5ea6-5ea7,U+5ead,U+5eb5-5eb8,U+5ec9-5eca,U+5ed1,U+5ed3,U+5ed6,U+5ef6-5ef7,U+5efa,U+5f00,U+5f02-5f04,U+5f08,U+5f0a-5f0b,U+5f0f,U+5f11,U+5f13,U+5f15,U+5f17-5f18,U+5f1b,U+5f1f-5f20,U+5f25-5f27,U+5f29,U+5f2f,U+5f31,U+5f39-5f3a,U+5f52-5f53,U+5f55,U+5f57,U+5f5d,U+5f62,U+5f64,U+5f66,U+5f69-5f6a,U+5f6c-5f6d,U+5f70-5f71,U+5f77,U+5f79,U+5f7b-5f7c,U+5f80-5f81,U+5f84-5f85,U+5f87-5f8b,U+5f90,U+5f92,U+5f95,U+5f97-5f98,U+5fa1,U+5fa8,U+5faa,U+5fad-5fae,U+5fb5,U+5fb7,U+5fbc-5fbd,U+5fc3,U+5fc5-5fc6}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ao.woff2) format("woff2");unicode-range:U+5c7f,U+5c81-5c82,U+5c8c,U+5c94,U+5c96-5c97,U+5c9a-5c9b,U+5ca9,U+5cad,U+5cb3,U+5cb8,U+5cbf,U+5ccb,U+5cd9,U+5ce1,U+5ce5-5ce6,U+5ce8,U+5cea,U+5ced,U+5cf0,U+5cfb,U+5d02,U+5d07,U+5d0e,U+5d14,U+5d16,U+5d1b,U+5d24,U+5d29,U+5d2d,U+5d34,U+5d3d,U+5d4c,U+5d58,U+5d6c,U+5d82,U+5d99,U+5dc5,U+5dcd,U+5ddd-5dde,U+5de1-5de2,U+5de5-5de9,U+5deb,U+5dee,U+5df1-5df4,U+5df7,U+5dfe,U+5e01-5e03,U+5e05-5e06,U+5e08,U+5e0c,U+5e10-5e11,U+5e15-5e16,U+5e18,U+5e1a-5e1d,U+5e26-5e27,U+5e2d-5e2e,U+5e37-5e38,U+5e3c-5e3d,U+5e42,U+5e44-5e45,U+5e4c,U+5e54-5e55,U+5e61-5e62,U+5e72-5e74,U+5e76,U+5e78,U+5e7a-5e7d}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ap.woff2) format("woff2");unicode-range:U+5b85,U+5b87-5b89,U+5b8b-5b8c,U+5b8f,U+5b95,U+5b97-5b9e,U+5ba0-5ba4,U+5ba6,U+5baa-5bab,U+5bb0,U+5bb3-5bb6,U+5bb9,U+5bbd-5bbf,U+5bc2,U+5bc4-5bc7,U+5bcc,U+5bd0,U+5bd2-5bd3,U+5bdd-5bdf,U+5be1,U+5be4-5be5,U+5be8,U+5bf0,U+5bf8-5bfc,U+5bff,U+5c01,U+5c04,U+5c06,U+5c09-5c0a,U+5c0f,U+5c11,U+5c14,U+5c16,U+5c18,U+5c1a,U+5c1d,U+5c24,U+5c27,U+5c2c,U+5c31,U+5c34,U+5c38-5c3a,U+5c3c-5c42,U+5c45,U+5c48-5c4b,U+5c4e-5c51,U+5c55,U+5c5e,U+5c60-5c61,U+5c65,U+5c6f,U+5c71,U+5c79}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aq.woff2) format("woff2");unicode-range:U+5996,U+5999,U+599e,U+59a5,U+59a8-59aa,U+59ae,U+59b2,U+59b9,U+59bb,U+59be,U+59c6,U+59cb,U+59d0-59d1,U+59d3-59d4,U+59d7-59d8,U+59da,U+59dc-59dd,U+59e3,U+59e5,U+59e8,U+59ec,U+59f9,U+59fb,U+59ff,U+5a01,U+5a03-5a04,U+5a06-5a07,U+5a11,U+5a13,U+5a18,U+5a1c,U+5a1f-5a20,U+5a25,U+5a29,U+5a31-5a32,U+5a34,U+5a36,U+5a3c,U+5a40,U+5a46,U+5a49-5a4a,U+5a5a,U+5a62,U+5a6a,U+5a74,U+5a76-5a77,U+5a7f,U+5a92,U+5a9a-5a9b,U+5ab2-5ab3,U+5ac1-5ac2,U+5ac9,U+5acc,U+5ad4,U+5ad6,U+5ae1,U+5ae3,U+5ae6,U+5ae9,U+5b09,U+5b34,U+5b37,U+5b40,U+5b50,U+5b54-5b55,U+5b57-5b59,U+5b5c-5b5d,U+5b5f,U+5b63-5b64,U+5b66,U+5b69-5b6a,U+5b6c,U+5b70-5b71,U+5b75,U+5b7a,U+5b7d,U+5b81,U+5b83}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ar.woff2) format("woff2");unicode-range:U+57ce,U+57d4,U+57df-57e0,U+57f9-57fa,U+5800,U+5802,U+5806,U+5811,U+5815,U+5821,U+5824,U+582a,U+5830,U+5835,U+584c,U+5851,U+5854,U+5858,U+585e,U+586b,U+587e,U+5883,U+5885,U+5892-5893,U+5899,U+589e-589f,U+58a8-58a9,U+58c1,U+58d1,U+58d5,U+58e4,U+58eb-58ec,U+58ee,U+58f0,U+58f3,U+58f6,U+58f9,U+5904,U+5907,U+590d,U+590f,U+5915-5916,U+5919-591a,U+591c,U+591f,U+5927,U+5929-592b,U+592d-592f,U+5931,U+5934,U+5937-593a,U+5942,U+5944,U+5947-5949,U+594b,U+594e-594f,U+5951,U+5954-5957,U+595a,U+5960,U+5962,U+5965,U+5973-5974,U+5976,U+5978-5979,U+597d,U+5981-5984,U+5986-5988,U+598a,U+598d,U+5992-5993}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.as.woff2) format("woff2");unicode-range:U+561b,U+561e-561f,U+5624,U+562d,U+5631-5632,U+5634,U+5636,U+5639,U+563b,U+563f,U+564c,U+564e,U+5654,U+5657,U+5659,U+565c,U+5662,U+5664,U+5668-566c,U+5676,U+567c,U+5685,U+568e-568f,U+5693,U+56a3,U+56b7,U+56bc,U+56ca,U+56d4,U+56da-56db,U+56de,U+56e0,U+56e2,U+56e4,U+56ed,U+56f0-56f1,U+56f4,U+56f9-56fa,U+56fd-56ff,U+5703,U+5706,U+5708-5709,U+571f,U+5723,U+5728,U+572d,U+5730,U+573a,U+573e,U+5740,U+5747,U+574a,U+574d-5751,U+5757,U+575a-575b,U+575d-5761,U+5764,U+5766,U+5768,U+576a,U+576f,U+5773,U+5777,U+5782-5784,U+578b,U+5792,U+579b,U+57a0,U+57a2-57a3,U+57a6,U+57ab,U+57ae,U+57c2-57c3,U+57cb}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.at.woff2) format("woff2");unicode-range:U+54e5-54ea,U+54ed-54ee,U+54f2,U+54fa,U+54fc-54fd,U+5501,U+5506-5507,U+5509,U+550f-5510,U+5514,U+5520,U+5522,U+5524,U+5527,U+552c,U+552e-5531,U+5533,U+553e-553f,U+5543-5544,U+5546,U+554a,U+5550,U+5555-5556,U+555c,U+5561,U+5564-5567,U+556a,U+556c,U+556e,U+5575,U+5577-5578,U+557b-557c,U+557e,U+5580,U+5582-5584,U+5587,U+5589-558b,U+558f,U+5591,U+5594,U+5598-5599,U+559c-559d,U+559f,U+55a7,U+55b3,U+55b7,U+55bb,U+55bd,U+55c5,U+55d1-55d4,U+55d6,U+55dc-55dd,U+55df,U+55e1,U+55e3-55e6,U+55e8,U+55eb-55ec,U+55ef,U+55f7,U+55fd,U+5600-5601,U+5608-5609,U+560e,U+5618}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.au.woff2) format("woff2");unicode-range:U+5411,U+5413,U+5415,U+5417,U+541b,U+541d-5420,U+5426-5429,U+542b-542f,U+5431,U+5434-5435,U+5438-5439,U+543b-543c,U+543e,U+5440,U+5443,U+5446,U+5448,U+544a,U+5450,U+5453,U+5455,U+5457-5458,U+545b-545c,U+5462,U+5464,U+5466,U+5468,U+5471-5473,U+5475,U+5478,U+547b-547d,U+5480,U+5482,U+5484,U+5486,U+548b-548c,U+548e-5490,U+5492,U+5494-5496,U+5499-549b,U+54a4,U+54a6-54ad,U+54af,U+54b1,U+54b3,U+54b8,U+54bb,U+54bd,U+54bf-54c2,U+54c4,U+54c6-54c9,U+54cd-54ce,U+54d0-54d2,U+54d5,U+54d7,U+54da,U+54dd,U+54df}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.av.woff2) format("woff2");unicode-range:U+5348-534a,U+534e-534f,U+5351-5353,U+5355-5357,U+535a,U+535c,U+535e-5362,U+5364,U+5366-5367,U+536b,U+536f-5371,U+5373-5375,U+5377-5378,U+537f,U+5382,U+5384-5386,U+5389,U+538b-538c,U+5395,U+5398,U+539a,U+539f,U+53a2,U+53a5-53a6,U+53a8-53a9,U+53ae,U+53bb,U+53bf,U+53c1-53c2,U+53c8-53cd,U+53d1,U+53d4,U+53d6-53d9,U+53db,U+53df-53e0,U+53e3-53e6,U+53e8-53f3,U+53f6-53f9,U+53fc-53fd,U+5401,U+5403-5404,U+5408-540a,U+540c-5410}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aw.woff2) format("woff2");unicode-range:U+5207,U+520a,U+520d-520e,U+5211-5212,U+5217-521b,U+521d,U+5220,U+5224,U+5228-5229,U+522b,U+522d-522e,U+5230,U+5236-523b,U+523d,U+5241-5243,U+524a,U+524c-524d,U+5250-5251,U+5254,U+5256,U+525c,U+5265,U+5267,U+5269-526a,U+526f,U+5272,U+527d,U+527f,U+5288,U+529b,U+529d-52a1,U+52a3,U+52a8-52ab,U+52ad,U+52b1-52b3,U+52be-52bf,U+52c3,U+52c7,U+52c9,U+52cb,U+52d0,U+52d2,U+52d8,U+52df,U+52e4,U+52fa,U+52fe-5300,U+5305-5306,U+5308,U+530d,U+5310,U+5315-5317,U+5319,U+531d,U+5320-5321,U+5323,U+532a,U+532e,U+5339-533b,U+533e-533f,U+5341,U+5343,U+5347}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ax.woff2) format("woff2");unicode-range:U+50cf,U+50d6,U+50da,U+50e7,U+50ee,U+50f3,U+50f5,U+50fb,U+5106,U+510b,U+5112,U+5121,U+513f-5141,U+5143-5146,U+5148-5149,U+514b,U+514d,U+5151,U+5154,U+515a,U+515c,U+5162,U+5165,U+5168,U+516b-516e,U+5170-5171,U+5173-5179,U+517b-517d,U+5180,U+5185,U+5188-5189,U+518c-518d,U+5192,U+5195,U+5197,U+5199,U+519b-519c,U+51a0,U+51a2,U+51a4-51a5,U+51ac,U+51af-51b0,U+51b2-51b3,U+51b5-51b7,U+51bb,U+51bd,U+51c0,U+51c4,U+51c6,U+51c9,U+51cb-51cc,U+51cf,U+51d1,U+51db,U+51dd,U+51e0-51e1,U+51e4,U+51ed,U+51ef-51f0,U+51f3,U+51f6,U+51f8-51fb,U+51fd,U+51ff-5201,U+5203,U+5206}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ay.woff2) format("woff2");unicode-range:U+4f60,U+4f63,U+4f65,U+4f69,U+4f6c,U+4f6f-4f70,U+4f73-4f74,U+4f7b-4f7c,U+4f7f,U+4f83-4f84,U+4f88,U+4f8b,U+4f8d,U+4f97,U+4f9b,U+4f9d,U+4fa0,U+4fa3,U+4fa5-4faa,U+4fac,U+4fae-4faf,U+4fb5,U+4fbf,U+4fc3-4fc5,U+4fca,U+4fce-4fd1,U+4fd7-4fd8,U+4fda,U+4fdd-4fde,U+4fe1,U+4fe6,U+4fe8-4fe9,U+4fed-4fef,U+4ff1,U+4ff8,U+4ffa,U+4ffe,U+500c-500d,U+500f,U+5012,U+5014,U+5018-501a,U+501c,U+501f,U+5021,U+5026,U+5028-502a,U+502d,U+503a,U+503c,U+503e,U+5043,U+5047-5048,U+504c,U+504e-504f,U+5055,U+505a,U+505c,U+5065,U+5076-5077,U+507b,U+507f-5080,U+5085,U+5088,U+508d,U+50a3,U+50a5,U+50a8,U+50ac,U+50b2,U+50bb}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.az.woff2) format("woff2");unicode-range:U+4e94-4e95,U+4e98,U+4e9a-4e9b,U+4e9f,U+4ea1-4ea2,U+4ea4-4ea9,U+4eab-4eae,U+4eb2,U+4eb5,U+4eba,U+4ebf-4ec1,U+4ec3-4ec7,U+4eca-4ecb,U+4ecd-4ece,U+4ed1,U+4ed3-4ed9,U+4ede-4edf,U+4ee3-4ee5,U+4ee8,U+4eea,U+4eec,U+4ef0,U+4ef2,U+4ef5-4ef7,U+4efb,U+4efd,U+4eff,U+4f01,U+4f0a,U+4f0d-4f11,U+4f17-4f1a,U+4f1e-4f20,U+4f22,U+4f24-4f26,U+4f2a-4f2b,U+4f2f-4f30,U+4f34,U+4f36,U+4f38,U+4f3a,U+4f3c-4f3d,U+4f43,U+4f46,U+4f4d-4f51,U+4f53,U+4f55,U+4f58-4f59,U+4f5b-4f5e}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a0.woff2) format("woff2");unicode-range:U+d7,U+e0-e1,U+e8-ea,U+ec-ed,U+f2-f3,U+f7,U+f9-fa,U+fc,U+2014,U+2018-2019,U+201c-201d,U+3001-3002,U+300a-300b,U+3010-3011,U+4e00-4e01,U+4e03,U+4e07-4e0b,U+4e0d-4e0e,U+4e10-4e11,U+4e13-4e14,U+4e16,U+4e18-4e1e,U+4e22,U+4e24-4e25,U+4e27,U+4e2a-4e2b,U+4e2d,U+4e30,U+4e32,U+4e34,U+4e38-4e3b,U+4e3d-4e3e,U+4e43,U+4e45,U+4e48-4e49,U+4e4b-4e50,U+4e52-4e54,U+4e56,U+4e58-4e59,U+4e5c-4e61,U+4e66,U+4e70-4e71,U+4e73,U+4e7e,U+4e86,U+4e88-4e89,U+4e8b-4e8c,U+4e8e-4e8f,U+4e91-4e93}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a1.woff2) format("woff2");unicode-range:U+21-7e,U+a4,U+a7-a8,U+b0-b1,U+b7}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a.woff2) format("woff2");unicode-range:U+9aa2-ffe5}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.b.woff2) format("woff2");unicode-range:U+8983-9aa0}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.c.woff2) format("woff2");unicode-range:U+78f2-897b}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.d.woff2) format("woff2");unicode-range:U+646d-78d9}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.e.woff2) format("woff2");unicode-range:U+30e0-6445}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.f.woff2) format("woff2");unicode-range:U+101-30df}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.g.woff2) format("woff2");unicode-range:U+9aa8,U+9ab8,U+9ad3,U+9ad8,U+9b03,U+9b3c,U+9b41-9b42,U+9b44,U+9b4f,U+9b54,U+9c7c,U+9c81,U+9c8d,U+9c9c,U+9ca4,U+9cb8,U+9cc3,U+9cd6,U+9cde,U+9e1f,U+9e21,U+9e23,U+9e25-9e26,U+9e2d,U+9e2f,U+9e33,U+9e35,U+9e3d,U+9e3f,U+9e43,U+9e45,U+9e4a,U+9e4f,U+9e64,U+9e70,U+9e7f,U+9e93,U+9ea6,U+9ebb,U+9ec4,U+9ecd-9ece,U+9ed1,U+9ed4,U+9ed8,U+9f0e,U+9f13,U+9f20,U+9f3b,U+9f50,U+9f7f,U+9f84,U+9f8b,U+9f99-9f9a,U+9f9f,U+ff01,U+ff08-ff09,U+ff0c,U+ff1a-ff1b,U+ff1f}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.h.woff2) format("woff2");unicode-range:U+975b,U+975e,U+9760-9762,U+9769,U+9773-9774,U+9776,U+978b,U+978d,U+9798,U+97a0,U+97ad,U+97e6-97e7,U+97e9,U+97ed,U+97f3,U+97f5-97f6,U+9875-9877,U+9879-987b,U+987d-987f,U+9881-9882,U+9884-9888,U+988a,U+9890-9891,U+9893,U+9896-9898,U+989c-989d,U+98a0,U+98a4,U+98a7,U+98ce,U+98d8,U+98de-98df,U+9910,U+9965,U+996d-9972,U+9975-9976,U+997a,U+997c,U+997f,U+9981,U+9985-9986,U+9988,U+998b,U+998f,U+9992,U+9996,U+9999,U+9a6c-9a71,U+9a73-9a74,U+9a76,U+9a79,U+9a7b-9a7c,U+9a7e,U+9a82,U+9a84,U+9a86-9a87,U+9a8b-9a8c,U+9a8f,U+9a91,U+9a97,U+9a9a,U+9aa1,U+9aa4}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.i.woff2) format("woff2");unicode-range:U+9570,U+9576,U+957f,U+95e8,U+95ea,U+95ed-95f0,U+95f2,U+95f4,U+95f7-95fb,U+95fd,U+9600-9602,U+9605,U+9609,U+960e,U+9610-9611,U+9614,U+961c,U+961f,U+962e,U+9632-9636,U+963b,U+963f-9640,U+9644-9648,U+964b-964d,U+9650,U+9655,U+965b,U+9661-9662,U+9664,U+9668-966a,U+9675-9677,U+9685-9686,U+968b,U+968f-9690,U+9694,U+9698-9699,U+969c,U+96a7,U+96b6,U+96be,U+96c0-96c1,U+96c4-96c7,U+96cc-96cd,U+96cf,U+96d5,U+96e8,U+96ea,U+96f6-96f7,U+96f9,U+96fe,U+9700,U+9704,U+9707,U+9709,U+970d,U+9713,U+9716,U+971c,U+971e,U+9732,U+9738-9739,U+9752,U+9756,U+9759}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.j.woff2) format("woff2");unicode-range:U+9179,U+917f,U+9187,U+9189,U+918b,U+918d,U+9190,U+9192,U+919a-919b,U+91ba,U+91c7,U+91c9-91ca,U+91cc-91cf,U+91d1,U+91dc,U+9274,U+93d6,U+9488-9489,U+948e,U+9492-9493,U+9497,U+9499,U+949d-94a3,U+94a5-94a9,U+94ae,U+94b1,U+94b3,U+94b5,U+94bb,U+94be,U+94c0-94c3,U+94c5-94c6,U+94dc-94dd,U+94e1,U+94e3,U+94ec-94ed,U+94f0-94f2,U+94f6,U+94f8,U+94fa,U+94fe,U+9500-9501,U+9504-9505,U+9508,U+950b-950c,U+9510-9511,U+9517,U+9519-951a,U+9521,U+9523-9526,U+9528,U+952d-9530,U+9539,U+953b,U+9540-9541,U+9547,U+954a,U+954d,U+9550-9551,U+955c,U+9563,U+956d}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.k.woff2) format("woff2");unicode-range:U+9001-9003,U+9005-9006,U+9009-900a,U+900d,U+900f-9012,U+9014,U+9017,U+901a-901b,U+901d-9022,U+902e,U+9038,U+903b-903c,U+903e,U+9041-9042,U+9044,U+9047,U+904d,U+904f-9053,U+9057,U+905b,U+9062-9063,U+9065,U+9068,U+906d-906e,U+9075,U+907d,U+907f-9080,U+9082-9083,U+908b,U+9091,U+9093,U+9099,U+90a2-90a3,U+90a6,U+90aa,U+90ae-90af,U+90b1,U+90b5,U+90b8-90b9,U+90bb,U+90c1,U+90ca,U+90ce,U+90d1,U+90dd,U+90e1,U+90e7-90e8,U+90ed,U+90f4,U+90f8,U+90fd,U+9102,U+9119,U+9149,U+914b-914d,U+9152,U+9157,U+915a,U+915d-915e,U+9161,U+9163,U+9165,U+916a,U+916c,U+916e,U+9171,U+9175-9178}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.l.woff2) format("woff2");unicode-range:U+8e44,U+8e47-8e48,U+8e4a-8e4b,U+8e51,U+8e59,U+8e66,U+8e6c-8e6d,U+8e6f,U+8e72,U+8e74,U+8e76,U+8e7f,U+8e81,U+8e87,U+8e8f,U+8eab-8eac,U+8eaf,U+8eb2,U+8eba,U+8f66-8f69,U+8f6c,U+8f6e-8f72,U+8f74,U+8f7b,U+8f7d,U+8f7f,U+8f83-8f8a,U+8f8d-8f8e,U+8f90-8f91,U+8f93,U+8f95-8f99,U+8f9b-8f9c,U+8f9e-8f9f,U+8fa3,U+8fa8-8fa9,U+8fab,U+8fb0-8fb1,U+8fb9,U+8fbd-8fbe,U+8fc1-8fc2,U+8fc4-8fc5,U+8fc7-8fc8,U+8fce,U+8fd0-8fd1,U+8fd3-8fd5,U+8fd8-8fd9,U+8fdb-8fdf,U+8fe2,U+8fe6,U+8fe8,U+8fea-8feb,U+8fed,U+8ff0,U+8ff3,U+8ff7-8ff9,U+8ffd,U+9000}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.m.woff2) format("woff2");unicode-range:U+8d24-8d31,U+8d34-8d35,U+8d37-8d3f,U+8d41-8d45,U+8d48,U+8d4a-8d4c,U+8d4e-8d50,U+8d54,U+8d56,U+8d58,U+8d5a-8d5b,U+8d5d-8d5e,U+8d60-8d64,U+8d66-8d67,U+8d6b,U+8d70,U+8d74-8d77,U+8d81,U+8d85,U+8d8a-8d8b,U+8d9f,U+8da3,U+8db3-8db4,U+8db8,U+8dbe-8dbf,U+8dc3-8dc4,U+8dcb-8dcc,U+8dd1,U+8dd7,U+8ddb,U+8ddd,U+8ddf,U+8de4,U+8de8,U+8dea,U+8def,U+8df3,U+8df5,U+8df7,U+8dfa-8dfb,U+8e09-8e0a,U+8e0c,U+8e0f,U+8e1d-8e1e,U+8e22,U+8e29-8e2a,U+8e2e,U+8e31,U+8e35,U+8e39,U+8e42}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.n.woff2) format("woff2");unicode-range:U+8bc9-8bcd,U+8bcf,U+8bd1,U+8bd3,U+8bd5,U+8bd7-8bd8,U+8bda-8bdb,U+8bdd-8bde,U+8be0-8be9,U+8beb-8bf5,U+8bf7-8bf8,U+8bfa-8bfb,U+8bfd-8c01,U+8c03-8c06,U+8c08,U+8c0a-8c0b,U+8c0d-8c13,U+8c15,U+8c17,U+8c19-8c1c,U+8c22-8c24,U+8c26-8c2a,U+8c2c-8c2d,U+8c30-8c35,U+8c37,U+8c41,U+8c46,U+8c4c,U+8c61-8c62,U+8c6a-8c6b,U+8c79-8c7a,U+8c82,U+8c89,U+8c8c,U+8d1d-8d1f,U+8d21-8d23}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.o.woff2) format("woff2");unicode-range:U+889c,U+88a4,U+88ab,U+88ad,U+88b1,U+88c1-88c2,U+88c5-88c6,U+88c9,U+88d4-88d5,U+88d8-88d9,U+88df,U+88e3-88e4,U+88e8,U+88f1,U+88f3-88f4,U+88f8-88f9,U+88fe,U+8902,U+8910,U+8912-8913,U+891a-891b,U+8921,U+8925,U+892a-892b,U+8934,U+8936,U+8941,U+8944,U+895e-895f,U+8966,U+897f,U+8981,U+8986,U+89c1-89c2,U+89c4-89c6,U+89c8-89cb,U+89ce,U+89d0-89d2,U+89e3,U+89e5-89e6,U+8a00,U+8a07,U+8a79,U+8a89-8a8a,U+8a93,U+8b66,U+8b6c,U+8ba1-8bab,U+8bad-8bb0,U+8bb2-8bb3,U+8bb6-8bba,U+8bbc-8bc1,U+8bc4-8bc6,U+8bc8}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.p.woff2) format("woff2");unicode-range:U+8695,U+869c,U+86a3-86a4,U+86a7,U+86aa,U+86af,U+86b1,U+86c0,U+86c6-86c7,U+86ca-86cb,U+86d0,U+86d4,U+86d9,U+86db,U+86df,U+86e4,U+86ee,U+86f0,U+86f9,U+86fe,U+8700,U+8702-8703,U+8708-8709,U+870d,U+8712-8713,U+8715,U+8717-8718,U+871a,U+871c,U+8721,U+8725,U+8734,U+8737,U+873b,U+873f,U+8747,U+8749,U+874c,U+874e,U+8757,U+8759,U+8760,U+8763,U+8774,U+8776,U+877c,U+8782-8783,U+8785,U+878d,U+8793,U+879f,U+87af,U+87b3,U+87ba,U+87c6,U+87ca,U+87d1-87d2,U+87e0,U+87e5,U+87f9,U+87fe,U+8815,U+8822,U+8839,U+8840,U+8845,U+884c-884d,U+8854,U+8857,U+8859,U+8861,U+8863,U+8865,U+8868,U+886b-886c,U+8870,U+8877,U+887d-887f,U+8881-8882,U+8884-8885,U+8888,U+888b,U+888d,U+8892,U+8896}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.q.woff2) format("woff2");unicode-range:U+83dc-83dd,U+83e0,U+83e9,U+83f1-83f2,U+8403-8404,U+840b-840e,U+841d,U+8424-8428,U+843d,U+8451,U+8457,U+8459,U+845b,U+8461,U+8463,U+8469,U+846b-846c,U+8471,U+8475,U+847a,U+8482,U+848b,U+8499,U+849c,U+84b2,U+84b8,U+84bf,U+84c4,U+84c9,U+84d1,U+84d6,U+84dd,U+84df,U+84e6,U+84ec,U+8511,U+8513,U+8517,U+851a,U+851f,U+8521,U+852b-852c,U+8537,U+853b-853d,U+8549-854a,U+8559,U+8574,U+857e,U+8584,U+8587,U+858f,U+859b,U+85aa,U+85af-85b0,U+85c9,U+85cf-85d0,U+85d3,U+85d5,U+85e4,U+85e9,U+85fb,U+8611,U+8638,U+864e-8651,U+8654,U+865a,U+865e,U+866b-866c,U+8671,U+8679,U+867d-867e,U+8680-8682,U+868a,U+868c-868d,U+8693}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.r.woff2) format("woff2");unicode-range:U+8273,U+827a,U+827e,U+8282,U+828a-828b,U+828d,U+8292,U+8299,U+829c-829d,U+82a5-82a6,U+82a9,U+82ab-82ad,U+82af,U+82b1,U+82b3,U+82b7-82b9,U+82bd,U+82c7,U+82cd,U+82cf,U+82d1,U+82d3-82d4,U+82d7,U+82db,U+82de-82df,U+82e3,U+82e5-82e6,U+82eb,U+82ef,U+82f1,U+82f9,U+82fb,U+8301-8305,U+8309,U+830e,U+8314,U+8317,U+8327-8328,U+832b-832c,U+832f,U+8335-8336,U+8338-8339,U+8340,U+8346-8347,U+8349,U+834f-8352,U+8354,U+835a,U+835c,U+8361,U+8363-8364,U+8367,U+836b,U+836f,U+8377,U+837c,U+8386,U+8389,U+838e,U+8393,U+839e,U+83a0,U+83ab,U+83b1-83b4,U+83b7,U+83b9-83ba,U+83bd,U+83c1,U+83c5,U+83c7,U+83ca,U+83cc,U+83cf}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.s.woff2) format("woff2");unicode-range:U+80de,U+80e1,U+80e7,U+80ea-80eb,U+80ed,U+80ef-80f0,U+80f3-80f4,U+80f6,U+80f8,U+80fa,U+80fd,U+8102,U+8106,U+8109-810a,U+810d,U+810f-8111,U+8113-8114,U+8116,U+8118,U+811a,U+812f,U+8131,U+8138,U+813e,U+8146,U+814a-814c,U+8150-8151,U+8154-8155,U+8165,U+816e,U+8170,U+8174,U+8179-817c,U+817e-8180,U+818a,U+818f,U+8198,U+819b-819d,U+81a8,U+81b3,U+81ba-81bb,U+81c0,U+81c2-81c3,U+81c6,U+81ca,U+81e3,U+81ea,U+81ec-81ed,U+81f3-81f4,U+81fb-81fc,U+81fe,U+8200,U+8205-8206,U+820c-820d,U+8210,U+8212,U+8214,U+821c,U+821e-821f,U+822a-822c,U+8230-8231,U+8235-8239,U+8247,U+8258,U+826f-8270,U+8272}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.t.woff2) format("woff2");unicode-range:U+7f72,U+7f81,U+7f8a,U+7f8c,U+7f8e,U+7f94,U+7f9a,U+7f9e,U+7fa1,U+7fa4,U+7fb2,U+7fb8-7fb9,U+7fbd,U+7fc1,U+7fc5,U+7fcc,U+7fce,U+7fd4-7fd5,U+7fd8,U+7fdf-7fe1,U+7fe6,U+7fe9,U+7ff0-7ff1,U+7ff3,U+7ffb-7ffc,U+8000-8001,U+8003,U+8005,U+800c-800d,U+8010,U+8012,U+8015,U+8017-8019,U+8027,U+802a,U+8033,U+8036-8038,U+803b,U+803d,U+803f,U+8042,U+8046,U+804a-804c,U+8052,U+8054,U+8058,U+805a,U+806a,U+807f,U+8083-8084,U+8086-8087,U+8089,U+808b-808c,U+8096,U+8098,U+809a-809b,U+809d,U+80a0-80a2,U+80a4-80a5,U+80a9-80aa,U+80ae-80af,U+80b2,U+80b4,U+80ba,U+80be-80c1,U+80c3-80c4,U+80c6,U+80cc,U+80ce,U+80d6,U+80da-80dc}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.u.woff2) format("woff2");unicode-range:U+7eb5-7eba,U+7ebd,U+7ebf,U+7ec2-7eca,U+7ecd-7ed5,U+7ed8-7edf,U+7ee1-7ee3,U+7ee5-7ee7,U+7ee9-7eeb,U+7eed,U+7eef-7ef0,U+7ef3-7ef8,U+7efc-7efd,U+7eff-7f00,U+7f04-7f09,U+7f0e-7f0f,U+7f13-7f16,U+7f18,U+7f1a,U+7f1c-7f1d,U+7f1f-7f22,U+7f24-7f26,U+7f28-7f2a,U+7f2d-7f2e,U+7f30,U+7f34,U+7f38,U+7f3a,U+7f42,U+7f50-7f51,U+7f54-7f55,U+7f57,U+7f5a,U+7f61-7f62,U+7f69-7f6a,U+7f6e}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.v.woff2) format("woff2");unicode-range:U+7b4c,U+7b4f-7b52,U+7b54,U+7b56,U+7b5b,U+7b5d,U+7b75,U+7b77,U+7b79,U+7b7e,U+7b80,U+7b8d,U+7b94-7b95,U+7b97,U+7ba1,U+7ba9-7bab,U+7bad,U+7bb1,U+7bb8,U+7bc6-7bc7,U+7bd1,U+7bd3,U+7bd9,U+7bdd,U+7be1,U+7bee,U+7bf1,U+7bf7,U+7bfe,U+7c07,U+7c0c,U+7c27,U+7c2a,U+7c38,U+7c3f,U+7c41,U+7c4d,U+7c73,U+7c7b,U+7c7d,U+7c89,U+7c92,U+7c95,U+7c97-7c98,U+7c9f,U+7ca4-7ca5,U+7caa,U+7cae,U+7cb1,U+7cb3,U+7cb9,U+7cbc-7cbe,U+7cc5,U+7cca,U+7cd5-7cd7,U+7cd9,U+7cdc,U+7cdf-7ce0,U+7cef,U+7cfb,U+7d0a,U+7d20,U+7d22,U+7d27,U+7d2b,U+7d2f,U+7d6e,U+7e41,U+7e82,U+7ea0-7ea4,U+7ea6-7ea8,U+7eaa-7ead,U+7eaf-7eb3}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.w.woff2) format("woff2");unicode-range:U+7981,U+7984-7985,U+798f,U+79b9,U+79bb,U+79bd-79be,U+79c0-79c1,U+79c3,U+79c6,U+79c9,U+79cb,U+79cd,U+79d1-79d2,U+79d8,U+79df,U+79e3-79e4,U+79e6-79e7,U+79e9,U+79ef-79f0,U+79f8,U+79fb,U+79fd,U+7a00,U+7a0b,U+7a0d-7a0e,U+7a14,U+7a17,U+7a1a,U+7a20,U+7a33,U+7a37,U+7a39,U+7a3b-7a3d,U+7a3f,U+7a46,U+7a51,U+7a57,U+7a74,U+7a76-7a77,U+7a79-7a7a,U+7a7f,U+7a81,U+7a83-7a84,U+7a88,U+7a8d,U+7a91-7a92,U+7a95-7a98,U+7a9c-7a9d,U+7a9f,U+7aa5-7aa6,U+7abf,U+7acb,U+7ad6,U+7ad9,U+7ade-7ae0,U+7ae3,U+7ae5-7ae6,U+7aed,U+7aef,U+7af9,U+7afd,U+7aff,U+7b03,U+7b06,U+7b08,U+7b0b,U+7b11,U+7b14,U+7b19,U+7b1b,U+7b20,U+7b26,U+7b28,U+7b2c,U+7b3a,U+7b3c,U+7b49,U+7b4b}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.x.woff2) format("woff2");unicode-range:U+77aa,U+77ac,U+77b0,U+77b3,U+77b5,U+77bb,U+77bf,U+77d7,U+77db-77dc,U+77e2-77e3,U+77e5,U+77e9,U+77eb,U+77ed-77ee,U+77f3,U+77fd-77ff,U+7801-7802,U+780c-780d,U+7812,U+7814,U+7816,U+781a,U+781d,U+7823,U+7825,U+7827,U+7830,U+7834,U+7837-7838,U+783a,U+783e,U+7840,U+7845,U+784c,U+7852,U+7855,U+785d,U+786b-786c,U+786e,U+787c,U+7887,U+7889,U+788c-788e,U+7891,U+7897-7898,U+789c,U+789f,U+78a5,U+78a7,U+78b0-78b1,U+78b3-78b4,U+78be,U+78c1,U+78c5,U+78ca-78cb,U+78d0,U+78d5,U+78e8,U+78ec,U+78f7,U+78fa,U+7901,U+7934,U+793a,U+793c,U+793e,U+7940-7941,U+7948,U+7956-7957,U+795a-795b,U+795d-7960,U+7965,U+7968,U+796d,U+796f,U+7977-7978,U+797a,U+7980}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.y.woff2) format("woff2");unicode-range:U+761f,U+7624,U+7626,U+7629-762b,U+7634-7635,U+7638,U+763e,U+764c,U+7656,U+765e,U+7663,U+766b,U+7678,U+767b,U+767d-767e,U+7682,U+7684,U+7686-7688,U+768b,U+768e,U+7691,U+7693,U+7696,U+7699,U+76ae,U+76b1,U+76b4,U+76bf,U+76c2,U+76c5-76c6,U+76c8,U+76ca,U+76ce-76d2,U+76d4,U+76d6-76d8,U+76db,U+76df,U+76ee-76ef,U+76f2,U+76f4,U+76f8-76f9,U+76fc,U+76fe,U+7701,U+7708-7709,U+770b,U+771f-7720,U+7726,U+7728-7729,U+772f,U+7736-7738,U+773a,U+773c,U+7740-7741,U+7750-7751,U+775a-775b,U+7761,U+7763,U+7765-7766,U+7768,U+776b-776c,U+7779,U+777d,U+777f,U+7784-7785,U+778c,U+778e,U+7791-7792,U+779f-77a0,U+77a5,U+77a7,U+77a9}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.z.woff2) format("woff2");unicode-range:U+7435-7436,U+743c,U+7455,U+7459-745a,U+745c,U+745e-745f,U+7470,U+7476,U+7480,U+7483,U+7487,U+749c,U+749e,U+74a7-74a8,U+74dc,U+74e2-74e4,U+74e6,U+74ee,U+74f6-74f7,U+7504,U+7518,U+751a,U+751c,U+751f,U+7525,U+7528-7529,U+752b-752d,U+7530-7533,U+7535,U+7537-7538,U+753b,U+7545,U+754c,U+754f,U+7554,U+7559,U+755c,U+7565-7566,U+756a,U+7574,U+7578,U+7583,U+7586,U+758f,U+7591,U+7597,U+7599-759a,U+759f,U+75a1,U+75a4-75a5,U+75ab,U+75ae-75b2,U+75b4-75b5,U+75b9,U+75bc-75be,U+75c5,U+75c7-75ca,U+75cd,U+75d2,U+75d4-75d5,U+75d8,U+75db,U+75de,U+75e2-75e3,U+75e8,U+75ea,U+75f0,U+75f4,U+75f9,U+7600-7601}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aa.woff2) format("woff2");unicode-range:U+725f,U+7261-7262,U+7267,U+7269,U+7272,U+7275,U+7279-727a,U+7280-7281,U+7284,U+728a,U+7292,U+729f,U+72ac,U+72af,U+72b6-72b9,U+72c1-72c2,U+72c4,U+72c8,U+72ce,U+72d0,U+72d2,U+72d7,U+72d9,U+72de,U+72e0-72e1,U+72e9,U+72ec-72f2,U+72f7-72f8,U+72fc,U+730a,U+730e,U+7316,U+731b-731d,U+7322,U+7325,U+7329-732c,U+732e,U+7334,U+733e-733f,U+7350,U+7357,U+7360,U+736d,U+7384,U+7387,U+7389,U+738b,U+7396,U+739b,U+73a9,U+73ab,U+73af-73b0,U+73b2,U+73b7,U+73ba-73bb,U+73c0,U+73c8,U+73ca,U+73cd,U+73d0-73d1,U+73d9,U+73e0,U+73ed,U+7403,U+7405-7406,U+7409-740a,U+740f-7410,U+741a,U+7422,U+7425,U+742a,U+7433-7434}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ab.woff2) format("woff2");unicode-range:U+706d,U+706f-7070,U+7075-7076,U+7078,U+707c,U+707e-707f,U+7089-708a,U+708e,U+7092,U+7094-7096,U+7099,U+70ab-70af,U+70b1,U+70b3,U+70b8-70b9,U+70bc-70bd,U+70c1-70c3,U+70c8,U+70ca,U+70d8-70d9,U+70db,U+70df,U+70e4,U+70e6-70e7,U+70e9,U+70eb-70ed,U+70ef,U+70f7,U+70f9,U+70fd,U+7109-710a,U+7115,U+7119-711a,U+7126,U+7130-7131,U+7136,U+714c,U+714e,U+715e,U+7164,U+7166-7168,U+716e,U+7172-7173,U+717d,U+7184,U+718a,U+718f,U+7194,U+7198-7199,U+719f-71a0,U+71a8,U+71ac,U+71b9,U+71c3,U+71ce,U+71d5,U+71e5,U+7206,U+722a,U+722c,U+7231,U+7235-7239,U+723d,U+7247-7248,U+724c-724d,U+7252,U+7259,U+725b}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ac.woff2) format("woff2");unicode-range:U+6df7,U+6df9,U+6dfb,U+6e05,U+6e0a,U+6e0d-6e0e,U+6e10,U+6e14,U+6e17,U+6e1a,U+6e1d,U+6e20-6e21,U+6e23-6e25,U+6e29,U+6e2d,U+6e2f,U+6e32,U+6e34,U+6e38,U+6e3a,U+6e43,U+6e4d,U+6e56,U+6e58,U+6e5b,U+6e6e,U+6e7e-6e7f,U+6e83,U+6e85,U+6e89,U+6e90,U+6e9c,U+6ea2,U+6ea5,U+6eaa,U+6eaf,U+6eb6,U+6eba,U+6ec1,U+6ec7,U+6ecb,U+6ed1,U+6ed3-6ed5,U+6eda,U+6ede,U+6ee1,U+6ee4-6ee6,U+6ee8-6ee9,U+6ef4,U+6f02,U+6f06,U+6f09,U+6f0f,U+6f13-6f15,U+6f20,U+6f29-6f2b,U+6f31,U+6f33,U+6f3e,U+6f46-6f47,U+6f4d,U+6f58,U+6f5c,U+6f5e,U+6f62,U+6f66,U+6f6d-6f6e,U+6f84,U+6f88-6f89,U+6f8e,U+6f9c,U+6fa1,U+6fb3,U+6fb9,U+6fc0,U+6fd1-6fd2,U+6fe1,U+7011,U+701a,U+7023,U+704c,U+706b}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ad.woff2) format("woff2");unicode-range:U+6ccc,U+6cd3,U+6cd5,U+6cdb,U+6cde,U+6ce1-6ce3,U+6ce5,U+6ce8,U+6cea-6ceb,U+6cef-6cf1,U+6cf3,U+6cf5,U+6cfb-6cfe,U+6d01,U+6d0b,U+6d12,U+6d17,U+6d1b,U+6d1e,U+6d25,U+6d27,U+6d2a,U+6d31-6d32,U+6d3b-6d3e,U+6d41,U+6d43,U+6d45-6d47,U+6d4a-6d4b,U+6d4e-6d4f,U+6d51,U+6d53,U+6d59-6d5a,U+6d63,U+6d66,U+6d69-6d6a,U+6d6e,U+6d74,U+6d77-6d78,U+6d82,U+6d85,U+6d88-6d89,U+6d8c,U+6d8e,U+6d93,U+6d95,U+6d9b,U+6d9d,U+6d9f-6da1,U+6da3-6da4,U+6da6-6daa,U+6dae-6daf,U+6db2,U+6db5,U+6db8,U+6dc0,U+6dc4-6dc7,U+6dcb-6dcc,U+6dd1,U+6dd6,U+6dd8-6dd9,U+6de1,U+6de4,U+6deb-6dec,U+6dee,U+6df1,U+6df3}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ae.woff2) format("woff2");unicode-range:U+6b92,U+6b96,U+6b9a,U+6ba1,U+6bb4-6bb5,U+6bb7,U+6bbf,U+6bc1,U+6bc5,U+6bcb,U+6bcd,U+6bcf,U+6bd2,U+6bd4-6bd7,U+6bd9,U+6bdb,U+6be1,U+6beb,U+6bef,U+6c05,U+6c0f,U+6c11,U+6c13-6c14,U+6c16,U+6c1b,U+6c1f,U+6c22,U+6c24,U+6c26-6c28,U+6c2e-6c30,U+6c32,U+6c34,U+6c38,U+6c3d,U+6c40-6c42,U+6c47,U+6c49,U+6c50,U+6c55,U+6c57,U+6c5b,U+6c5d-6c61,U+6c64,U+6c68-6c6a,U+6c70,U+6c72,U+6c76,U+6c79,U+6c7d-6c7e,U+6c81-6c83,U+6c86,U+6c88-6c89,U+6c8c,U+6c8f-6c90,U+6c93,U+6c99,U+6c9b,U+6c9f,U+6ca1,U+6ca4-6ca7,U+6caa-6cab,U+6cae,U+6cb3,U+6cb8-6cb9,U+6cbb-6cbf,U+6cc4-6cc5,U+6cc9-6cca}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.af.woff2) format("woff2");unicode-range:U+68ad,U+68af-68b0,U+68b3,U+68b5,U+68c0,U+68c2,U+68c9,U+68cb,U+68cd,U+68d2,U+68d5,U+68d8,U+68da,U+68e0,U+68ee,U+68f1,U+68f5,U+68fa,U+6905,U+690d-690e,U+6912,U+692d,U+6930,U+693d,U+693f,U+6942,U+6954,U+6957,U+695a,U+695e,U+6963,U+696b,U+6977-6978,U+697c,U+6982,U+6984,U+6986,U+6994,U+699c,U+69a8,U+69ad,U+69b4,U+69b7,U+69bb,U+69c1,U+69cc,U+69d0,U+69db,U+69fd,U+69ff,U+6a0a,U+6a1f,U+6a21,U+6a2a,U+6a31,U+6a35,U+6a3d,U+6a44,U+6a47,U+6a58-6a59,U+6a61,U+6a71,U+6a80,U+6a84,U+6a8e,U+6a90,U+6aac,U+6b20-6b23,U+6b27,U+6b32,U+6b3a,U+6b3e,U+6b47,U+6b49,U+6b4c,U+6b62-6b67,U+6b6a,U+6b79,U+6b7b-6b7c,U+6b81,U+6b83-6b84,U+6b86-6b87,U+6b89-6b8b}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ag.woff2) format("woff2");unicode-range:U+6756,U+675c,U+675e-6761,U+6765,U+6768,U+676d,U+676f-6770,U+6773,U+6775,U+6777,U+677c,U+677e-677f,U+6781,U+6784,U+6787,U+6789,U+6790,U+6795,U+6797,U+679a,U+679c-679d,U+67a2-67a3,U+67aa-67ab,U+67ad,U+67af-67b0,U+67b6-67b7,U+67c4,U+67cf-67d4,U+67d9-67da,U+67dc,U+67de,U+67e0,U+67e5,U+67e9,U+67ec,U+67ef,U+67f1,U+67f3-67f4,U+67ff-6800,U+6805,U+6807-6808,U+680b,U+680f,U+6811,U+6813,U+6816-6817,U+6821,U+6829-682a,U+6837-6839,U+683c-683d,U+6840,U+6842-6843,U+6845-6846,U+6848,U+684c,U+6850-6851,U+6853-6854,U+6863,U+6865,U+6868-6869,U+6874,U+6876,U+6881,U+6885-6886,U+6893,U+6897,U+68a2,U+68a6-68a8}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ah.woff2) format("woff2");unicode-range:U+65f7,U+65fa,U+6602,U+6606,U+660a,U+660c,U+660e-660f,U+6613-6614,U+6619,U+661d,U+661f-6620,U+6625,U+6627-6628,U+662d,U+662f,U+6631,U+6635,U+663c,U+663e,U+6643,U+664b-664c,U+664f,U+6652-6653,U+6655-6657,U+665a,U+6664,U+6666,U+6668,U+666e-6670,U+6674,U+6676-6677,U+667a,U+667e,U+6682,U+6684,U+6687,U+668c,U+6691,U+6696-6697,U+669d,U+66a7,U+66ae,U+66b4,U+66d9,U+66dc-66dd,U+66e6,U+66f0,U+66f2-66f4,U+66f9,U+66fc,U+66fe-6700,U+6708-6709,U+670b,U+670d,U+6714-6715,U+6717,U+671b,U+671d,U+671f,U+6726,U+6728,U+672a-672d,U+672f,U+6731,U+6734-6735,U+673a,U+673d,U+6740,U+6742-6743,U+6746,U+6748-6749,U+674e-6751}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ai.woff2) format("woff2");unicode-range:U+6467,U+6469,U+6478-6479,U+6482,U+6485,U+6487,U+6491-6492,U+6495,U+649e,U+64a4,U+64a9,U+64ac-64ae,U+64b0,U+64b5,U+64b8,U+64ba,U+64bc,U+64c2,U+64c5,U+64cd-64ce,U+64d2,U+64d8,U+64de,U+64e2,U+64e6,U+6500,U+6512,U+6518,U+6525,U+652b,U+652f,U+6536,U+6538-6539,U+653b,U+653e-653f,U+6545,U+6548,U+654c,U+654f,U+6551,U+6555-6556,U+6559,U+655b,U+655d-655e,U+6562-6563,U+6566,U+656c,U+6570,U+6572,U+6574,U+6577,U+6587,U+658b-658c,U+6590-6591,U+6593,U+6597,U+6599,U+659c,U+659f,U+65a1,U+65a4-65a5,U+65a7,U+65a9,U+65ab,U+65ad,U+65af-65b0,U+65b9,U+65bd,U+65c1,U+65c4-65c5,U+65cb-65cc,U+65cf,U+65d7,U+65e0,U+65e2,U+65e5-65e9,U+65ec-65ed,U+65f1,U+65f6}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aj.woff2) format("woff2");unicode-range:U+6323-6325,U+6328,U+632a-632b,U+632f,U+6332,U+633a,U+633d,U+6342,U+6345-6346,U+6349,U+634b-6350,U+6355,U+635e-635f,U+6361-6363,U+6367,U+636e,U+6371,U+6376-6377,U+637a-637b,U+6380,U+6382,U+6387-6389,U+638c,U+638f-6390,U+6392,U+6396,U+6398,U+63a0,U+63a2-63a3,U+63a5,U+63a7-63aa,U+63ac,U+63b0,U+63b3-63b4,U+63b7-63b8,U+63ba,U+63c4,U+63c9,U+63cd,U+63cf-63d0,U+63d2,U+63d6,U+63e1,U+63e3,U+63e9-63ea,U+63ed,U+63f4,U+63f6,U+63fd,U+6400-6402,U+6405,U+640f-6410,U+6413-6414,U+641c,U+641e,U+6421,U+642a,U+642c-642d,U+643a,U+643d,U+6441,U+6444,U+6446-6448,U+644a,U+6452,U+6454,U+6458,U+645e}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ak.woff2) format("woff2");unicode-range:U+6258,U+625b,U+6263,U+6266-6267,U+6269-6270,U+6273,U+6276,U+6279,U+627c,U+627e-6280,U+6284,U+6289-628a,U+6291-6293,U+6295-6298,U+629a-629b,U+62a0-62a2,U+62a4-62a5,U+62a8,U+62ab-62ac,U+62b1,U+62b5,U+62b9,U+62bc-62bd,U+62bf,U+62c2,U+62c4-62ca,U+62cc-62ce,U+62d0,U+62d2-62d4,U+62d6-62d9,U+62db-62dc,U+62df,U+62e2-62e3,U+62e5-62e9,U+62ec-62ed,U+62ef,U+62f1,U+62f3-62f4,U+62f7,U+62fc-62ff,U+6301-6302,U+6307,U+6309,U+630e,U+6311,U+6316,U+631a-631b,U+631d-6321}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.al.woff2) format("woff2");unicode-range:U+60cb,U+60d1,U+60d5,U+60d8,U+60da,U+60dc,U+60df-60e0,U+60e6-60e9,U+60eb-60f0,U+60f3-60f4,U+60f6,U+60f9-60fa,U+6101,U+6108-6109,U+610e-610f,U+6115,U+611a,U+611f-6120,U+6123-6124,U+6127,U+612b,U+613f,U+6148,U+614a,U+614c,U+614e,U+6151,U+6155,U+6162,U+6167-6168,U+6170,U+6175,U+6177,U+618b,U+618e,U+6194,U+61a7-61a9,U+61ac,U+61be,U+61c2,U+61c8,U+61ca,U+61d1-61d2,U+61d4,U+61e6,U+61f5,U+61ff,U+6208,U+620a,U+620c-6212,U+6216,U+6218,U+621a-621b,U+621f,U+622a,U+622c,U+622e,U+6233-6234,U+6237,U+623e-6241,U+6247-6249,U+624b,U+624d-624e,U+6251-6254}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.am.woff2) format("woff2");unicode-range:U+5fcc-5fcd,U+5fcf-5fd2,U+5fd6-5fd9,U+5fdd,U+5fe0-5fe1,U+5fe4,U+5fe7,U+5fea-5feb,U+5ff1,U+5ff5,U+5ffb,U+5ffd-6002,U+6005-6006,U+600d-600f,U+6012,U+6014-6016,U+6019,U+601c-601d,U+6020-6021,U+6025-6028,U+602a,U+602f,U+6035,U+603b-603c,U+6041,U+6043,U+604b,U+604d,U+6050,U+6052,U+6055,U+6059-605a,U+6062-6064,U+6068-606d,U+606f-6070,U+6073,U+6076,U+6078-607c,U+607f,U+6084,U+6089,U+608c-608d,U+6094,U+6096,U+609a,U+609f-60a0,U+60a3,U+60a6,U+60a8,U+60ac,U+60af,U+60b1-60b2,U+60b4,U+60b8,U+60bb-60bc,U+60c5-60c6,U+60ca}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.an.woff2) format("woff2");unicode-range:U+5e7f,U+5e84,U+5e86-5e87,U+5e8a,U+5e8f-5e90,U+5e93-5e97,U+5e99-5e9a,U+5e9c,U+5e9e-5e9f,U+5ea6-5ea7,U+5ead,U+5eb5-5eb8,U+5ec9-5eca,U+5ed1,U+5ed3,U+5ed6,U+5ef6-5ef7,U+5efa,U+5f00,U+5f02-5f04,U+5f08,U+5f0a-5f0b,U+5f0f,U+5f11,U+5f13,U+5f15,U+5f17-5f18,U+5f1b,U+5f1f-5f20,U+5f25-5f27,U+5f29,U+5f2f,U+5f31,U+5f39-5f3a,U+5f52-5f53,U+5f55,U+5f57,U+5f5d,U+5f62,U+5f64,U+5f66,U+5f69-5f6a,U+5f6c-5f6d,U+5f70-5f71,U+5f77,U+5f79,U+5f7b-5f7c,U+5f80-5f81,U+5f84-5f85,U+5f87-5f8b,U+5f90,U+5f92,U+5f95,U+5f97-5f98,U+5fa1,U+5fa8,U+5faa,U+5fad-5fae,U+5fb5,U+5fb7,U+5fbc-5fbd,U+5fc3,U+5fc5-5fc6}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ao.woff2) format("woff2");unicode-range:U+5c7f,U+5c81-5c82,U+5c8c,U+5c94,U+5c96-5c97,U+5c9a-5c9b,U+5ca9,U+5cad,U+5cb3,U+5cb8,U+5cbf,U+5ccb,U+5cd9,U+5ce1,U+5ce5-5ce6,U+5ce8,U+5cea,U+5ced,U+5cf0,U+5cfb,U+5d02,U+5d07,U+5d0e,U+5d14,U+5d16,U+5d1b,U+5d24,U+5d29,U+5d2d,U+5d34,U+5d3d,U+5d4c,U+5d58,U+5d6c,U+5d82,U+5d99,U+5dc5,U+5dcd,U+5ddd-5dde,U+5de1-5de2,U+5de5-5de9,U+5deb,U+5dee,U+5df1-5df4,U+5df7,U+5dfe,U+5e01-5e03,U+5e05-5e06,U+5e08,U+5e0c,U+5e10-5e11,U+5e15-5e16,U+5e18,U+5e1a-5e1d,U+5e26-5e27,U+5e2d-5e2e,U+5e37-5e38,U+5e3c-5e3d,U+5e42,U+5e44-5e45,U+5e4c,U+5e54-5e55,U+5e61-5e62,U+5e72-5e74,U+5e76,U+5e78,U+5e7a-5e7d}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ap.woff2) format("woff2");unicode-range:U+5b85,U+5b87-5b89,U+5b8b-5b8c,U+5b8f,U+5b95,U+5b97-5b9e,U+5ba0-5ba4,U+5ba6,U+5baa-5bab,U+5bb0,U+5bb3-5bb6,U+5bb9,U+5bbd-5bbf,U+5bc2,U+5bc4-5bc7,U+5bcc,U+5bd0,U+5bd2-5bd3,U+5bdd-5bdf,U+5be1,U+5be4-5be5,U+5be8,U+5bf0,U+5bf8-5bfc,U+5bff,U+5c01,U+5c04,U+5c06,U+5c09-5c0a,U+5c0f,U+5c11,U+5c14,U+5c16,U+5c18,U+5c1a,U+5c1d,U+5c24,U+5c27,U+5c2c,U+5c31,U+5c34,U+5c38-5c3a,U+5c3c-5c42,U+5c45,U+5c48-5c4b,U+5c4e-5c51,U+5c55,U+5c5e,U+5c60-5c61,U+5c65,U+5c6f,U+5c71,U+5c79}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aq.woff2) format("woff2");unicode-range:U+5996,U+5999,U+599e,U+59a5,U+59a8-59aa,U+59ae,U+59b2,U+59b9,U+59bb,U+59be,U+59c6,U+59cb,U+59d0-59d1,U+59d3-59d4,U+59d7-59d8,U+59da,U+59dc-59dd,U+59e3,U+59e5,U+59e8,U+59ec,U+59f9,U+59fb,U+59ff,U+5a01,U+5a03-5a04,U+5a06-5a07,U+5a11,U+5a13,U+5a18,U+5a1c,U+5a1f-5a20,U+5a25,U+5a29,U+5a31-5a32,U+5a34,U+5a36,U+5a3c,U+5a40,U+5a46,U+5a49-5a4a,U+5a5a,U+5a62,U+5a6a,U+5a74,U+5a76-5a77,U+5a7f,U+5a92,U+5a9a-5a9b,U+5ab2-5ab3,U+5ac1-5ac2,U+5ac9,U+5acc,U+5ad4,U+5ad6,U+5ae1,U+5ae3,U+5ae6,U+5ae9,U+5b09,U+5b34,U+5b37,U+5b40,U+5b50,U+5b54-5b55,U+5b57-5b59,U+5b5c-5b5d,U+5b5f,U+5b63-5b64,U+5b66,U+5b69-5b6a,U+5b6c,U+5b70-5b71,U+5b75,U+5b7a,U+5b7d,U+5b81,U+5b83}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ar.woff2) format("woff2");unicode-range:U+57ce,U+57d4,U+57df-57e0,U+57f9-57fa,U+5800,U+5802,U+5806,U+5811,U+5815,U+5821,U+5824,U+582a,U+5830,U+5835,U+584c,U+5851,U+5854,U+5858,U+585e,U+586b,U+587e,U+5883,U+5885,U+5892-5893,U+5899,U+589e-589f,U+58a8-58a9,U+58c1,U+58d1,U+58d5,U+58e4,U+58eb-58ec,U+58ee,U+58f0,U+58f3,U+58f6,U+58f9,U+5904,U+5907,U+590d,U+590f,U+5915-5916,U+5919-591a,U+591c,U+591f,U+5927,U+5929-592b,U+592d-592f,U+5931,U+5934,U+5937-593a,U+5942,U+5944,U+5947-5949,U+594b,U+594e-594f,U+5951,U+5954-5957,U+595a,U+5960,U+5962,U+5965,U+5973-5974,U+5976,U+5978-5979,U+597d,U+5981-5984,U+5986-5988,U+598a,U+598d,U+5992-5993}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.as.woff2) format("woff2");unicode-range:U+561b,U+561e-561f,U+5624,U+562d,U+5631-5632,U+5634,U+5636,U+5639,U+563b,U+563f,U+564c,U+564e,U+5654,U+5657,U+5659,U+565c,U+5662,U+5664,U+5668-566c,U+5676,U+567c,U+5685,U+568e-568f,U+5693,U+56a3,U+56b7,U+56bc,U+56ca,U+56d4,U+56da-56db,U+56de,U+56e0,U+56e2,U+56e4,U+56ed,U+56f0-56f1,U+56f4,U+56f9-56fa,U+56fd-56ff,U+5703,U+5706,U+5708-5709,U+571f,U+5723,U+5728,U+572d,U+5730,U+573a,U+573e,U+5740,U+5747,U+574a,U+574d-5751,U+5757,U+575a-575b,U+575d-5761,U+5764,U+5766,U+5768,U+576a,U+576f,U+5773,U+5777,U+5782-5784,U+578b,U+5792,U+579b,U+57a0,U+57a2-57a3,U+57a6,U+57ab,U+57ae,U+57c2-57c3,U+57cb}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.at.woff2) format("woff2");unicode-range:U+54e5-54ea,U+54ed-54ee,U+54f2,U+54fa,U+54fc-54fd,U+5501,U+5506-5507,U+5509,U+550f-5510,U+5514,U+5520,U+5522,U+5524,U+5527,U+552c,U+552e-5531,U+5533,U+553e-553f,U+5543-5544,U+5546,U+554a,U+5550,U+5555-5556,U+555c,U+5561,U+5564-5567,U+556a,U+556c,U+556e,U+5575,U+5577-5578,U+557b-557c,U+557e,U+5580,U+5582-5584,U+5587,U+5589-558b,U+558f,U+5591,U+5594,U+5598-5599,U+559c-559d,U+559f,U+55a7,U+55b3,U+55b7,U+55bb,U+55bd,U+55c5,U+55d1-55d4,U+55d6,U+55dc-55dd,U+55df,U+55e1,U+55e3-55e6,U+55e8,U+55eb-55ec,U+55ef,U+55f7,U+55fd,U+5600-5601,U+5608-5609,U+560e,U+5618}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.au.woff2) format("woff2");unicode-range:U+5411,U+5413,U+5415,U+5417,U+541b,U+541d-5420,U+5426-5429,U+542b-542f,U+5431,U+5434-5435,U+5438-5439,U+543b-543c,U+543e,U+5440,U+5443,U+5446,U+5448,U+544a,U+5450,U+5453,U+5455,U+5457-5458,U+545b-545c,U+5462,U+5464,U+5466,U+5468,U+5471-5473,U+5475,U+5478,U+547b-547d,U+5480,U+5482,U+5484,U+5486,U+548b-548c,U+548e-5490,U+5492,U+5494-5496,U+5499-549b,U+54a4,U+54a6-54ad,U+54af,U+54b1,U+54b3,U+54b8,U+54bb,U+54bd,U+54bf-54c2,U+54c4,U+54c6-54c9,U+54cd-54ce,U+54d0-54d2,U+54d5,U+54d7,U+54da,U+54dd,U+54df}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.av.woff2) format("woff2");unicode-range:U+5348-534a,U+534e-534f,U+5351-5353,U+5355-5357,U+535a,U+535c,U+535e-5362,U+5364,U+5366-5367,U+536b,U+536f-5371,U+5373-5375,U+5377-5378,U+537f,U+5382,U+5384-5386,U+5389,U+538b-538c,U+5395,U+5398,U+539a,U+539f,U+53a2,U+53a5-53a6,U+53a8-53a9,U+53ae,U+53bb,U+53bf,U+53c1-53c2,U+53c8-53cd,U+53d1,U+53d4,U+53d6-53d9,U+53db,U+53df-53e0,U+53e3-53e6,U+53e8-53f3,U+53f6-53f9,U+53fc-53fd,U+5401,U+5403-5404,U+5408-540a,U+540c-5410}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aw.woff2) format("woff2");unicode-range:U+5207,U+520a,U+520d-520e,U+5211-5212,U+5217-521b,U+521d,U+5220,U+5224,U+5228-5229,U+522b,U+522d-522e,U+5230,U+5236-523b,U+523d,U+5241-5243,U+524a,U+524c-524d,U+5250-5251,U+5254,U+5256,U+525c,U+5265,U+5267,U+5269-526a,U+526f,U+5272,U+527d,U+527f,U+5288,U+529b,U+529d-52a1,U+52a3,U+52a8-52ab,U+52ad,U+52b1-52b3,U+52be-52bf,U+52c3,U+52c7,U+52c9,U+52cb,U+52d0,U+52d2,U+52d8,U+52df,U+52e4,U+52fa,U+52fe-5300,U+5305-5306,U+5308,U+530d,U+5310,U+5315-5317,U+5319,U+531d,U+5320-5321,U+5323,U+532a,U+532e,U+5339-533b,U+533e-533f,U+5341,U+5343,U+5347}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ax.woff2) format("woff2");unicode-range:U+50cf,U+50d6,U+50da,U+50e7,U+50ee,U+50f3,U+50f5,U+50fb,U+5106,U+510b,U+5112,U+5121,U+513f-5141,U+5143-5146,U+5148-5149,U+514b,U+514d,U+5151,U+5154,U+515a,U+515c,U+5162,U+5165,U+5168,U+516b-516e,U+5170-5171,U+5173-5179,U+517b-517d,U+5180,U+5185,U+5188-5189,U+518c-518d,U+5192,U+5195,U+5197,U+5199,U+519b-519c,U+51a0,U+51a2,U+51a4-51a5,U+51ac,U+51af-51b0,U+51b2-51b3,U+51b5-51b7,U+51bb,U+51bd,U+51c0,U+51c4,U+51c6,U+51c9,U+51cb-51cc,U+51cf,U+51d1,U+51db,U+51dd,U+51e0-51e1,U+51e4,U+51ed,U+51ef-51f0,U+51f3,U+51f6,U+51f8-51fb,U+51fd,U+51ff-5201,U+5203,U+5206}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ay.woff2) format("woff2");unicode-range:U+4f60,U+4f63,U+4f65,U+4f69,U+4f6c,U+4f6f-4f70,U+4f73-4f74,U+4f7b-4f7c,U+4f7f,U+4f83-4f84,U+4f88,U+4f8b,U+4f8d,U+4f97,U+4f9b,U+4f9d,U+4fa0,U+4fa3,U+4fa5-4faa,U+4fac,U+4fae-4faf,U+4fb5,U+4fbf,U+4fc3-4fc5,U+4fca,U+4fce-4fd1,U+4fd7-4fd8,U+4fda,U+4fdd-4fde,U+4fe1,U+4fe6,U+4fe8-4fe9,U+4fed-4fef,U+4ff1,U+4ff8,U+4ffa,U+4ffe,U+500c-500d,U+500f,U+5012,U+5014,U+5018-501a,U+501c,U+501f,U+5021,U+5026,U+5028-502a,U+502d,U+503a,U+503c,U+503e,U+5043,U+5047-5048,U+504c,U+504e-504f,U+5055,U+505a,U+505c,U+5065,U+5076-5077,U+507b,U+507f-5080,U+5085,U+5088,U+508d,U+50a3,U+50a5,U+50a8,U+50ac,U+50b2,U+50bb}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.az.woff2) format("woff2");unicode-range:U+4e94-4e95,U+4e98,U+4e9a-4e9b,U+4e9f,U+4ea1-4ea2,U+4ea4-4ea9,U+4eab-4eae,U+4eb2,U+4eb5,U+4eba,U+4ebf-4ec1,U+4ec3-4ec7,U+4eca-4ecb,U+4ecd-4ece,U+4ed1,U+4ed3-4ed9,U+4ede-4edf,U+4ee3-4ee5,U+4ee8,U+4eea,U+4eec,U+4ef0,U+4ef2,U+4ef5-4ef7,U+4efb,U+4efd,U+4eff,U+4f01,U+4f0a,U+4f0d-4f11,U+4f17-4f1a,U+4f1e-4f20,U+4f22,U+4f24-4f26,U+4f2a-4f2b,U+4f2f-4f30,U+4f34,U+4f36,U+4f38,U+4f3a,U+4f3c-4f3d,U+4f43,U+4f46,U+4f4d-4f51,U+4f53,U+4f55,U+4f58-4f59,U+4f5b-4f5e}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a0.woff2) format("woff2");unicode-range:U+d7,U+e0-e1,U+e8-ea,U+ec-ed,U+f2-f3,U+f7,U+f9-fa,U+fc,U+2014,U+2018-2019,U+201c-201d,U+3001-3002,U+300a-300b,U+3010-3011,U+4e00-4e01,U+4e03,U+4e07-4e0b,U+4e0d-4e0e,U+4e10-4e11,U+4e13-4e14,U+4e16,U+4e18-4e1e,U+4e22,U+4e24-4e25,U+4e27,U+4e2a-4e2b,U+4e2d,U+4e30,U+4e32,U+4e34,U+4e38-4e3b,U+4e3d-4e3e,U+4e43,U+4e45,U+4e48-4e49,U+4e4b-4e50,U+4e52-4e54,U+4e56,U+4e58-4e59,U+4e5c-4e61,U+4e66,U+4e70-4e71,U+4e73,U+4e7e,U+4e86,U+4e88-4e89,U+4e8b-4e8c,U+4e8e-4e8f,U+4e91-4e93}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a1.woff2) format("woff2");unicode-range:U+21-7e,U+a4,U+a7-a8,U+b0-b1,U+b7}';
  const dynamicStyle = "html[hide-dynamic-page-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[hide-dynamic-page-fixed-header] aside.right section.sticky{top:15px!important}html[exchange-dynamic-page-left-right-aside] aside.left{order:3;margin-right:0!important}html[exchange-dynamic-page-left-right-aside] main{order:2}html[exchange-dynamic-page-left-right-aside] aside.right{order:1;margin-right:12px!important}html[exchange-dynamic-page-left-right-aside] .bili-dyn-sidebar{order:4}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layer.center{width:48px!important;height:48px!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:nth-child(2) picture{display:none!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers:has(.b-avatar__layer__res[style^=background]){display:none!important}html[hide-dynamic-page-bili-dyn-avatar-icon] .bili-dyn-list .b-avatar__layers .b-avatar__layer:last-child:not(.center){display:none!important}html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-ornament,html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-item__ornament,html[hide-dynamic-page-bili-dyn-dispute] .bili-dyn-content__dispute,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__orig__topic,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__forw__topic{display:none!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic{color:inherit!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic:hover{color:var(--brand_blue)!important}html[hide-dynamic-page-bili-dyn-item-interaction] .bili-dyn-item__interaction{display:none!important}html[hide-dynamic-page-bili-dyn-card-reserve] .bili-dyn-list__item:has(.bili-dyn-card-reserve){display:none!important}html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-dyn-card-goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-rich-text-module.goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has([data-type=goods]){visibility:hidden!important;height:0!important;margin:0!important}html[hide-dynamic-page-bili-dyn-lottery] .bili-dyn-list__item:has([data-type=lottery]){display:none!important}html[hide-dynamic-page-bili-dyn-forward] .bili-dyn-list__item:has(.bili-dyn-content__orig.reference){display:none!important}html[hide-dynamic-page-bili-dyn-vote] .bili-dyn-list__item:has(.bili-dyn-card-vote){display:none!important}html[hide-dynamic-page-bili-dyn-live] .bili-dyn-list__item:has(.bili-dyn-card-live){display:none!important}html[hide-dynamic-page-bili-dyn-blocked] .bili-dyn-list__item:has(.dyn-blocked-mask){display:none!important}html[hide-dynamic-page-bili-dyn-charge-video] .bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*=qcRJ6sJU91]){display:none!important}html[hide-dynamic-page-bili-dyn-publishing] .bili-dyn-publishing{display:none!important}html[hide-dynamic-page-bili-dyn-publishing] main section:nth-child(1){margin-bottom:0!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__content{display:grid!important;grid-auto-flow:column!important;grid-template-rows:auto auto!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__content .shim{display:none!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__item{height:auto!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__window{padding:10px!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__nav__btn{zoom:1.4;transition:background-color .1s linear}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__nav__btn:hover{background-color:#00aeec!important;color:#fff!important}html[dynamic-page-up-list-checked-item-opacity] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){transition:opacity .2s ease-out;opacity:.25}html[dynamic-page-up-list-checked-item-opacity] .bili-dyn-up-list__item:hover{transition:opacity .1s linear!important;opacity:1!important}@keyframes disappear{0%{opacity:1;width:68px;margin-right:6px}99%{opacity:0;width:0;margin-right:0}to{opacity:0;width:0;margin-right:0;display:none}}html[dynamic-page-up-list-checked-item-hide] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){animation:disappear;animation-duration:.5s;animation-delay:1s;animation-fill-mode:forwards}@supports (-moz-appearance: none){html[dynamic-page-up-list-checked-item-hide] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){display:none}}html[hide-dynamic-page-bili-dyn-list-tabs] .bili-dyn-list-tabs{display:none!important}html[hide-dynamic-page-bili-dyn-my-info] aside.left section{display:none!important}html[hide-dynamic-page-bili-dyn-my-info] .bili-dyn-live-users{top:15px!important}html[hide-dynamic-page-bili-dyn-live-users__item__living] .bili-dyn-live-users__item__living{display:none!important}html[hide-dynamic-page-aside-left] aside.left{display:none!important}html[hide-dynamic-page-bili-dyn-banner] .bili-dyn-banner{display:none!important}html[hide-dynamic-page-bili-dyn-ads] section:has(.bili-dyn-ads){display:none!important}html[hide-dynamic-page-bili-dyn-ads] aside.right section{margin-bottom:0!important}html[hide-dynamic-page-bili-dyn-ads] aside.right section.sticky{top:72px}html[hide-dynamic-page-bili-dyn-topic-box] .bili-dyn-topic-box,html[hide-dynamic-page-bili-dyn-topic-box] .topic-panel{display:none!important}html[hide-dynamic-page-aside-right] aside.right{display:none!important}html[dynamic-list-width] main{width:var(--dynamic-list-width)!important}html[dynamic-list-width] .bili-album__watch__content img{max-height:80vh!important}html[dynamic-detail-width] .opus-detail{width:var(--dynamic-detail-width)!important}html[dynamic-detail-width] .opus-detail .right-sidebar-wrap{margin-left:calc(var(--dynamic-detail-width) + 10px)!important}html[dynamic-detail-width] .content:has(.card .bili-dyn-item){width:var(--dynamic-detail-width)!important}html[hide-dynamic-page-sidebar-old-version] .bili-dyn-sidebar .bili-dyn-sidebar__btn:first-child{visibility:hidden!important}html[hide-dynamic-page-sidebar-old-version] .opus-detail .side-toolbar__bottom .side-toolbar__btn:not(.backtop){display:none!important}html[hide-dynamic-page-sidebar-back-to-top] .bili-dyn-sidebar .bili-dyn-sidebar__btn:last-child{visibility:hidden!important}";
  const festivalStyle = '@charset "UTF-8";html[video-page-danmaku-font-family] .bili-danmaku-x-dm,html[video-page-danmaku-font-family] .bili-dm,html[video-page-danmaku-font-family] .bili-dm *{font-family:var(--video-page-danmaku-font-family)!important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm,html[video-page-danmaku-font-weight] .bili-dm,html[video-page-danmaku-font-weight] .bili-dm *{font-weight:var(--video-page-danmaku-font-weight)!important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::-moz-placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-sug,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-carousel,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-popup,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area,html[video-page-hide-bpx-player-sending-area] #bilibili-player-placeholder-bottom{display:none!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])){height:unset!important;aspect-ratio:16/9}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])) #bilibili-player{height:unset!important;aspect-ratio:16/9}html[video-page-hide-bpx-player-sending-area] .page-main-content:has(.festival-video-player) .video-player-box{height:-moz-fit-content!important;height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player{height:-moz-fit-content!important;height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player #bilibili-player:not(.mode-webscreen){height:calc(100% - 46px)!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:-moz-fit-content!important;width:fit-content!important}html[video-page-hide-bpx-player-bili-guide-all] .bili-follow-to-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-animate,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-cyc,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-followed,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-gray,html[video-page-hide-bpx-player-bili-vote] .bili-vote,html[video-page-hide-bpx-player-bili-vote] .bili-danmaku-x-vote,html[video-page-hide-bpx-player-bili-qoe-feedback] .bpx-player-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-score,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-vote,html[video-page-hide-bpx-player-bili-score] .bili-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-superRating,html[video-page-hide-bpx-player-bili-score-sum] .bili-scoreSum,html[video-page-hide-bpx-player-bili-score-sum] .bili-danmaku-x-scoreSum,html[video-page-hide-bpx-player-bili-clock] .bili-clock,html[video-page-hide-bpx-player-bili-clock] .bili-danmaku-x-clock,html[video-page-hide-bpx-player-bili-cmtime] .bili-cmtime,html[video-page-hide-bpx-player-bili-cmtime] .bili-danmaku-x-cmtime,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-cmd-shrink,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-danmaku-x-cmd-shrink,html[video-page-hide-bpx-player-bili-reserve] .bili-reserve,html[video-page-hide-bpx-player-bili-reserve] .bili-danmaku-x-reserve,html[video-page-hide-bpx-player-bili-link] .bili-link,html[video-page-hide-bpx-player-bili-link] .bili-danmaku-x-link,html[video-page-hide-bpx-player-cmd-dm-wrap] .bpx-player-cmd-dm-wrap,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-left-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[video-page-hide-bpx-player-top-left-music] .bpx-player-top-left-music,html[video-page-hide-bpx-player-top-left-follow] .bpx-player-top-left-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-related{display:none!important}html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-content{display:flex!important;align-items:center!important}html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-dm .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-image:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:none!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-subtitle-font-color] .bpx-player-subtitle-panel-text{color:var(--video-page-subtitle-font-color)!important}html[video-page-subtitle-font-family] .bpx-player-subtitle-panel-text{font-family:var(--video-page-subtitle-font-family)!important}html[video-page-subtitle-font-weight] .bpx-player-subtitle-panel-text{font-weight:var(--video-page-subtitle-font-weight)!important}html[video-page-subtitle-text-stroke-color] .bpx-player-subtitle-panel-text{background:unset!important;background-color:var(--video-page-subtitle-text-stroke-color)!important;-webkit-background-clip:text!important;background-clip:text!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=normal],[data-screen=wide]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-moz-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-ms-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=web],[data-screen=full]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-moz-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-ms-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-viewpoint] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}';
  const homepageStyle = `html[homepage-hide-banner] .bili-header__banner{min-height:unset!important;height:64px!important;background:var(--bg1, white)!important}html[homepage-hide-banner] .bili-header__banner>*{display:none!important}html[homepage-hide-banner] .bili-header__bar,html[homepage-hide-banner] .bili-feed4 .bili-header .slide-down{box-shadow:0 2px 4px #00000014!important}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-icon,html[homepage-hide-banner] .bili-header .left-entry .entry-title,html[homepage-hide-banner] .bili-header .left-entry .download-entry,html[homepage-hide-banner] .bili-header .left-entry .default-entry,html[homepage-hide-banner] .bili-header .left-entry .loc-entry{color:var(--text1, #18191c)!important}html[homepage-hide-banner] .bili-header .left-entry .entry-title .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-text{color:var(--text2, #61666d)!important}html[homepage-hide-banner] .bili-feed4 .bili-header .slide-down{animation:headerSlideDown .3s linear forwards!important}html[homepage-hide-banner] .v-popover.is-top{padding-top:5px;padding-bottom:unset!important;bottom:unset!important}@media (width >= 2200px){html[homepage-hide-banner] .v-popover.is-top{top:32px}}@media (width >= 1701px) and (width <= 2199.9px){html[homepage-hide-banner] .v-popover.is-top{top:32px}}@media (width >= 1367px) and (width <= 1700.9px){html[homepage-hide-banner] .v-popover.is-top{top:28px}}@media (width >= 1100px) and (width <= 1366.9px){html[homepage-hide-banner] .v-popover.is-top{top:28px}}@media (width <= 1099.9px){html[homepage-hide-banner] .v-popover.is-top{top:24px}}html[homepage-hide-recommend-swipe] .recommended-swipe{display:none!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>*:nth-of-type(5){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>*:nth-of-type(6){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>*:nth-of-type(7){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>*:nth-of-type(n+8){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .feed-card:nth-of-type(n+9){display:inherit!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n+13){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .feed-card:nth-of-type(n+12){display:inherit!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .floor-single-card:first-of-type{margin-top:0!important}@media (width <= 1099.9px){html[homepage-hide-recommend-swipe] .bili-header .bili-header__channel{height:84px!important}}@media (width >= 1100px) and (width <= 1366.9px){html[homepage-hide-recommend-swipe] .bili-header .bili-header__channel{height:84px!important}}@media (width >= 1367px) and (width <= 1700.9px){html[homepage-hide-recommend-swipe] .bili-header .bili-header__channel{height:94px!important}}@media (width >= 1701px) and (width <= 2199.9px){html[homepage-hide-recommend-swipe] .bili-header .bili-header__channel{height:104px!important}}@media (width >= 2200px){html[homepage-hide-recommend-swipe] .bili-header .bili-header__channel{height:114px!important}}html[homepage-hide-subarea] #i_cecream .bili-header__channel .channel-icons,html[homepage-hide-subarea] #i_cecream .bili-header__channel .right-channel-container{display:none!important}html[homepage-hide-subarea] #i_cecream .bili-header__channel{height:0!important}html[homepage-hide-subarea] #i_cecream main.bili-feed4-layout:not(:has(.bilibili-app-recommend-root)){margin-top:20px!important}html[homepage-hide-sticky-header] .bili-header .left-entry__title svg{display:none!important}html[homepage-hide-sticky-header] #i_cecream .bili-feed4 .bili-header .slide-down{box-shadow:unset!important}html[homepage-hide-sticky-header] #nav-searchform.is-actived:before,html[homepage-hide-sticky-header] #nav-searchform.is-exper:before,html[homepage-hide-sticky-header] #nav-searchform.is-exper:hover:before,html[homepage-hide-sticky-header] #nav-searchform.is-focus:before,html[homepage-hide-sticky-header] .bili-header .slide-down{background:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down{position:absolute!important;top:0;animation:unset!important;box-shadow:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry{margin-right:30px!important}html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .default-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .download-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .entry-title,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .entry-title .zhuzhan-icon,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .loc-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .loc-mc-box__text,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .mini-header__title,html[homepage-hide-sticky-header] .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,html[homepage-hide-sticky-header] .bili-header .slide-down .right-entry .right-entry__outside .right-entry-text{color:#fff!important}html[homepage-hide-sticky-header] .bili-header .slide-down .download-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .loc-entry{display:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down .center-search-container,html[homepage-hide-sticky-header] .bili-header .slide-down .center-search-container .center-search__bar{margin:0 auto!important}html[homepage-hide-sticky-header] #nav-searchform{background:#f1f2f3}html[homepage-hide-sticky-header] #nav-searchform:hover{background-color:var(--bg1)!important;opacity:1}html[homepage-hide-sticky-header] #nav-searchform.is-focus{border:1px solid var(--line_regular)!important;border-bottom:none!important;background:var(--bg1)!important}html[homepage-hide-sticky-header] #nav-searchform.is-actived.is-exper4-actived,html[homepage-hide-sticky-header] #nav-searchform.is-focus.is-exper4-actived{border-bottom:unset!important}html[homepage-hide-sticky-header] #i_cecream .header-channel,html[homepage-hide-sticky-header] .area-header-wrapper{top:0!important}html[homepage-hide-sticky-subarea] #i_cecream .header-channel{display:none!important}html[homepage-hide-sticky-subarea] .bili-feed4 .bili-header .slide-down{animation:headerSlideDown .3s linear forwards!important}html[homepage-hide-sticky-subarea] #i_cecream .bili-header__bar:not(.slide-down){transition:background-color .2s linear}html[homepage-hide-adblock-tips] .adblock-tips{display:none!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic picture{display:none!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic svg{display:none!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic:after{content:"";width:25px;height:25px;background-image:url('data:image/svg+xml,<svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-bg--icon" data-v-674f5b07=""> <path d="M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>');background-size:contain;background-repeat:no-repeat;background-position:center}html[homepage-layout-4-column] #i_cecream .recommended-container_floor-aside .container{grid-template-columns:repeat(4,1fr)!important}html[homepage-layout-5-column] #i_cecream .recommended-container_floor-aside .container{grid-template-columns:repeat(5,1fr)!important}html[homepage-layout-6-column] #i_cecream .recommended-container_floor-aside .container{grid-template-columns:repeat(6,1fr)!important}html[homepage-layout-padding] .bili-feed4-layout,html[homepage-layout-padding] .bili-feed4 .bili-header .bili-header__channel{padding:0 var(--homepage-layout-padding, initial)!important;width:100%!important}html[homepage-increase-rcmd-list-font-size] main .bili-video-card .bili-video-card__info--tit,html[homepage-increase-rcmd-list-font-size] main .bili-live-card .bili-live-card__info--tit,html[homepage-increase-rcmd-list-font-size] main .single-card.floor-card .title{font-size:16px!important}html[homepage-increase-rcmd-list-font-size] main .bili-video-card .bili-video-card__info--bottom,html[homepage-increase-rcmd-list-font-size] main .floor-card .sub-title.sub-title{font-size:14px!important}html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats,html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats .bili-video-card__stats--left,html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats .bili-video-card__stats--right{font-size:14px!important}html[homepage-move-no-interest] main .bili-video-card__info--no-interest{top:unset!important;bottom:0!important}html[homepage-move-no-interest] main .bili-video-card__info--bottom{padding-right:20px!important}html[homepage-move-no-interest] main .bili-video-card.enable-no-interest,html[homepage-move-no-interest] main .bili-live-card.enable-no-interest{--title-padding-right: 0}html[homepage-hide-no-interest] main .bili-video-card.enable-no-interest,html[homepage-hide-no-interest] main .bili-live-card.enable-no-interest{--title-padding-right: 0}html[homepage-hide-no-interest] main .bili-video-card__info--no-interest,html[homepage-hide-no-interest] main .bili-live-card__info--no-interest{display:none!important}html[homepage-hide-up-info-icon] main .bili-video-card .bili-video-card__info--icon-text{width:17px;height:17px;color:transparent!important;background-color:unset!important;border-radius:unset!important;margin:0 2px 0 0!important;font-size:0!important;line-height:unset!important;padding:unset!important;-webkit-user-select:none!important;-moz-user-select:none!important;user-select:none!important}html[homepage-hide-up-info-icon] main .bili-video-card .bili-video-card__info--icon-text:before{content:"";display:inline-block;width:100%;height:100%;background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="bili-video-card__info--owner__up"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="rgb(148, 153, 160)"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="rgb(148, 153, 160)"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="rgb(148, 153, 160)"></path><!--]--></svg>');background-size:contain;background-repeat:no-repeat;background-position:center}html[homepage-hide-video-info-date] main .bili-video-card__info--date{display:none!important}html[homepage-hide-danmaku-count] main .bili-video-card__stats--item:nth-child(2){display:none!important}html[homepage-hide-bili-watch-later-tip] main .bili-watch-later__tip--lab{display:none!important}html[homepage-hide-inline-player-danmaku] main .bpx-player-row-dm-wrap,html[homepage-hide-inline-player-danmaku] main .bpx-player-cmd-dm-wrap{display:none!important}html[homepage-hide-ad-card] main :is(.feed-card,.bili-video-card):has(.bili-video-card__info--ad,[href*="cm.bilibili.com"],.bili-video-card__info--creative-ad){display:none!important}html[homepage-hide-ad-card] main :is(.feed-card,.bili-video-card):not(:has(.bili-video-card__wrap,.bili-video-card__skeleton)){display:none!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>*:nth-of-type(5){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>*:nth-of-type(6){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>*:nth-of-type(7){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>*:nth-of-type(n+8){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .feed-card:nth-of-type(n+9){display:inherit!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n+13){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .feed-card:nth-of-type(n+12){display:inherit!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .floor-single-card:first-of-type{margin-top:0!important}html[homepage-hide-live-card-recommend] main .bili-live-card,html[homepage-hide-live-card-recommend] main .floor-single-card:has(use[*|href$="#channel-live"]){display:none!important}html[homepage-simple-sub-area-card-recommend] main .floor-single-card .layer{display:none!important}html[homepage-simple-sub-area-card-recommend] main .floor-single-card .floor-card{box-shadow:unset!important;border:none!important}html[homepage-simple-sub-area-card-recommend] main .single-card.floor-card .floor-card-inner:hover{background:none!important}html[homepage-hide-sub-area-card-recommend] main .floor-single-card:not(:has(.skeleton,.skeleton-item)){display:none!important}html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--light,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--text,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--face,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--cover{animation:none!important}html[homepage-hide-skeleton-animation] main .skeleton .skeleton-item{animation:none!important}html[homepage-hide-skeleton-animation] main .floor-skeleton .skeleton-item{animation:none!important}html[homepage-hide-skeleton-before-anchor] main .bili-video-card:not(.is-rcmd):has(~.load-more-anchor){display:none!important}html[homepage-hide-skeleton] main .load-more-anchor{visibility:hidden}html[homepage-hide-skeleton] main .bili-video-card:not(.is-rcmd),html[homepage-hide-skeleton] main .floor-single-card:has(.skeleton,.skeleton-item){display:none}html[homepage-increase-rcmd-load-size] main .container.is-version8>.floor-single-card:has(.skeleton,.skeleton-item,.floor-skeleton){display:none}html[homepage-rcmd-video-preload] main .bili-video-card:not(.is-rcmd):has(~.load-more-anchor){display:none!important}html[homepage-rcmd-video-preload] main .floor-single-card:not(:has(.skeleton,.skeleton-item)){display:none!important}html[homepage-rcmd-video-preload] main .load-more-anchor.preload{position:fixed;top:-100px;left:-100px;opacity:0}html[homepage-hide-desktop-download-tip] .desktop-download-tip,html[homepage-hide-trial-feed-wrap] .trial-feed-wrap,html[homepage-hide-feed-roll-btn] .feed-roll-btn,html[homepage-hide-watchlater-pip-button] .watchlater-pip-button,html[homepage-hide-adcard-button] .adcard,html[homepage-hide-adcard-button] .palette-button-wrap .adcard-content,html[homepage-hide-flexible-roll-btn-text] .palette-button-wrap .flexible-roll-btn .btn-text,html[homepage-hide-flexible-roll-btn] .palette-button-wrap .flexible-roll-btn,html[homepage-hide-feedback] .palette-button-wrap .storage-box,html[homepage-hide-top-btn] .palette-button-wrap .top-btn-wrap{display:none!important}`;
  const liveStyle = '@charset "UTF-8";html[live-page-sidebar-vm] #sidebar-vm{display:none!important}html[live-page-default-skin]:not([lab-style*=dark]) #head-info-vm{background-image:unset!important;background-color:#fff}html[live-page-default-skin]:not([lab-style*=dark]) .live-title .text{color:#61666d!important}html[live-page-default-skin]:not([lab-style*=dark]) .header-info-ctnr .rows-ctnr .upper-row .room-owner-username{color:var(--text1, #18191c)!important}html[live-page-default-skin]:not([lab-style*=dark]) #head-info-vm .live-skin-coloration-area .live-skin-normal-a-text{color:unset!important}html[live-page-default-skin]:not([lab-style*=dark]) #head-info-vm .live-skin-coloration-area .live-skin-main-text{color:#61666d!important;fill:#61666d!important}html[live-page-default-skin]:not([lab-style*=dark]) #gift-control-vm{background-image:unset!important}html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-vm,html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box{background-image:unset!important;background-color:#efefef}html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box *:not(.fans-medal-content),html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box .tabs .pilot .hasOne .text-style,html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box .tabs .pilot .hasNot .text-style,html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box .live-skin-coloration-area .live-skin-main-text,html[live-page-default-skin]:not([lab-style*=dark]) #rank-list-ctnr-box .guard-skin .nameBox a{color:#000!important}html[live-page-default-skin]:not([lab-style*=dark]) #chat-control-panel-vm .live-skin-coloration-area .live-skin-main-text{color:#c9ccd0!important;fill:#c9ccd0!important}html[live-page-default-skin]:not([lab-style*=dark]) #chat-control-panel-vm{background-image:unset!important;background-color:#f6f7f8}html[live-page-default-skin]:not([lab-style*=dark]) #chat-control-panel-vm .bl-button--primary{background-color:#23ade5}html[live-page-default-skin]:not([lab-style*=dark]) #chat-control-panel-vm .icon-left-part svg>path{fill:#c9ccd0}html[live-page-default-skin]:not([lab-style*=dark]) #chat-control-panel-vm .icon-left-part>div:hover svg>path{fill:#00aeec}html[live-page-remove-wallpaper] .room-bg{background-image:unset!important}html[live-page-remove-wallpaper] #player-ctnr{box-shadow:0 0 12px #0003;border-radius:12px}html[live-page-remove-wallpaper] #aside-area-vm{box-shadow:0 0 12px #0003}html[live-page-flip-view] .flip-view,html[live-page-room-info-ctnr] #sections-vm .room-info-ctnr,html[live-page-room-feed] #sections-vm .room-feed,html[live-page-announcement-cntr] #sections-vm .room-detail-box,html[live-page-sections-vm] #sections-vm{display:none!important}html[live-page-nav-search-rcmd] #nav-searchform input::-moz-placeholder{visibility:hidden;opacity:0!important}html[live-page-nav-search-rcmd] #nav-searchform input::placeholder{visibility:hidden;opacity:0!important}html[live-page-nav-search-history] #nav-searchform .history,html[live-page-nav-search-trending] #nav-searchform .trending,html[live-page-header-search-block] #nav-searchform,html[live-page-header-entry-logo] #main-ctnr a.entry_logo[href="//live.bilibili.com"]{display:none!important}html[live-page-header-entry-logo] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-entry-logo] .pre-hold-nav-logo,html[live-page-header-entry-title] #main-ctnr a.entry-title[href="//www.bilibili.com"]{display:none!important}html[live-page-header-entry-title] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-entry-title] #prehold-nav-vm .nav-item:has(a[href="//www.bilibili.com"]){display:none!important}html[live-page-header-live] #main-ctnr .dp-table-cell a[name=live]{display:none!important}html[live-page-header-live] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-live] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com"]){display:none!important}html[live-page-header-net-game] #main-ctnr .dp-table-cell a[name=网游]{display:none!important}html[live-page-header-net-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-net-game] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=2&areaId=0"]){display:none!important}html[live-page-header-mobile-game] #main-ctnr .dp-table-cell a[name=手游]{display:none!important}html[live-page-header-mobile-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-mobile-game] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=3&areaId=0"]){display:none!important}html[live-page-header-standalone-game] #main-ctnr .dp-table-cell a[name=单机游戏]{display:none!important}html[live-page-header-standalone-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-game] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=6&areaId=0"]){display:none!important}html[live-page-header-standalone-vtuber] #main-ctnr .dp-table-cell a[name=虚拟主播]{display:none!important}html[live-page-header-standalone-vtuber] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-vtuber] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=9&areaId=0"]){display:none!important}html[live-page-header-standalone-entertainment] #main-ctnr .dp-table-cell a[name=娱乐]{display:none!important}html[live-page-header-standalone-entertainment] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-entertainment] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=1&areaId=0"]){display:none!important}html[live-page-header-standalone-radio] #main-ctnr .dp-table-cell a[name=电台]{display:none!important}html[live-page-header-standalone-radio] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-radio] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=5&areaId=0"]){display:none!important}html[live-page-header-standalone-match] #main-ctnr .dp-table-cell a[name=赛事]{display:none!important}html[live-page-header-standalone-match] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-match] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=13&areaId=0"]){display:none!important}html[live-page-header-standalone-chatroom] #main-ctnr .dp-table-cell a[name=聊天室]{display:none!important}html[live-page-header-standalone-chatroom] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-chatroom] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=14&areaId=0"]){display:none!important}html[live-page-header-standalone-living] #main-ctnr .dp-table-cell a[name=生活]{display:none!important}html[live-page-header-standalone-living] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-living] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=10&areaId=0"]){display:none!important}html[live-page-header-standalone-knowledge] #main-ctnr .dp-table-cell a[name=知识]{display:none!important}html[live-page-header-standalone-knowledge] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-knowledge] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=11&areaId=0"]){display:none!important}html[live-page-header-standalone-helpmeplay] #main-ctnr .dp-table-cell a[name=帮我玩]{display:none!important}html[live-page-header-standalone-helpmeplay] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-helpmeplay] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=301&areaId=0"]){display:none!important}html[live-page-header-standalone-interact] #main-ctnr .dp-table-cell a[name=互动玩法]{display:none!important}html[live-page-header-standalone-interact] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-interact] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=15&areaId=0"]){display:none!important}html[live-page-header-standalone-shopping] #main-ctnr .dp-table-cell a[name=购物]{display:none!important}html[live-page-header-standalone-shopping] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-shopping] #prehold-nav-vm .nav-item:has(a[href="//live.bilibili.com/p/eden/area-tags?parentAreaId=300&areaId=0"]){display:none!important}html[live-page-header-showmore-link] #main-ctnr .showmore-link{display:none!important}html[live-page-header-showmore-link] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-showmore-link] #prehold-nav-vm .nav-item:last-child{display:none!important}html[live-page-header-avatar] #right-part .user-panel{display:none!important}html[live-page-header-follow-panel] #right-part .shortcut-item:has(.follow-panel-set){display:none}html[live-page-header-recharge] #right-part .shortcut-item:has(.item-icon-recharge){display:none}html[live-page-header-bili-download-panel] #right-part .shortcut-item:has(.bili-download-panel){display:none}html[live-page-header-go-live] #right-part .shortcut-item:has(.download-panel-ctnr){visibility:hidden}html[live-page-head-info-avatar-pendant] .blive-avatar :is(.blive-avatar-pendant,.blive-avatar-icons){display:none!important}html[live-page-head-info-vm-upper-row-follow-ctnr] #head-info-vm .upper-row .follow-ctnr{display:none!important}html[live-page-head-info-vm-upper-row-visited] #head-info-vm .upper-row .right-ctnr div:has(.watched-icon){display:none!important}html[live-page-head-info-vm-upper-row-popular] #head-info-vm .upper-row .right-ctnr div:has(.icon-popular),html[live-page-head-info-vm-upper-row-popular] #LiveRoomHotrankEntries{display:none!important}html[live-page-head-info-vm-upper-row-like] #head-info-vm .upper-row .right-ctnr div:has(.like-icon){display:none!important}html[live-page-head-info-vm-upper-row-report] #head-info-vm .upper-row .right-ctnr div:has(.icon-report,[src*="img/report"]){display:none!important}html[live-page-head-info-vm-upper-row-share] #head-info-vm .upper-row .right-ctnr div:has(.icon-share,[src*="img/share"]){display:none!important}html[live-page-head-info-vm-upper-row-share] #head-info-vm .header-info-ctnr .rows-ctnr .upper-row .more,html[live-page-head-info-vm-lower-row-hot-rank] #head-info-vm .lower-row .right-ctnr .popular-and-hot-rank,html[live-page-head-info-vm-lower-row-gift-planet-entry] #head-info-vm .lower-row .right-ctnr .gift-planet-entry,html[live-page-head-info-vm-lower-row-activity-gather-entry] #head-info-vm .lower-row .right-ctnr .activity-gather-entry,html[live-page-head-info-vm] #head-info-vm{display:none!important}html[live-page-head-info-vm] #room-background-vm{min-height:calc(100vh - 64px)!important}html[live-page-head-info-vm] #player-ctnr{border-top-left-radius:12px;border-top-right-radius:12px;overflow:hidden}html[live-page-head-web-player-icon-feedback] .web-player-icon-feedback,html[live-page-head-web-player-shop-popover-vm] #shop-popover-vm,html[live-page-head-web-player-awesome-pk-vm] #pk-vm,html[live-page-head-web-player-awesome-pk-vm] #awesome-pk-vm,html[live-page-head-web-player-awesome-pk-vm] #universal-pk-vm,html[live-page-web-player-watermark] .web-player-icon-roomStatus,html[live-page-web-player-watermark] .blur-edges-ctnr{display:none!important}html[live-page-web-player-watermark] .web-player-module-area-mask{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}html[live-page-head-web-player-announcement-wrapper] #live-player .announcement-wrapper,html[live-page-head-web-player-game-id] #game-id,html[live-page-head-web-player-research-container] .research-container,html[live-page-head-web-player-live-lottery] #anchor-guest-box-id{display:none!important}html[live-page-combo-danmaku] .danmaku-item-container>div.combo{display:none!important}html[live-page-combo-danmaku] .bilibili-combo-danmaku-container,html[live-page-clean-all-danmaku-small-emoji] .danmaku-item-container .bili-dm .bili-dm-emoji,html[live-page-clean-all-danmaku-big-emoji] .danmaku-item-container .bili-dm img[style*="width:45px"],html[live-page-gift-control-vm] #gift-control-vm{display:none!important}html[live-page-gift-control-vm] #room-background-vm .room-bg{min-height:99vh!important}html[live-page-gift-control-vm] #player-ctnr{border-bottom-left-radius:12px;border-bottom-right-radius:12px;overflow:hidden}html[live-page-fullscreen-danmaku-vm] #fullscreen-danmaku-vm{display:none!important}html[live-page-rank-list-vm-fold] #rank-list-vm{max-height:32px;transition:max-height .3s linear;overflow:hidden}html[live-page-rank-list-vm-fold] .player-full-win #rank-list-vm{border-radius:0}html[live-page-rank-list-vm-fold] #rank-list-vm:hover{max-height:178px;overflow:unset}html[live-page-rank-list-vm-fold] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-rank-list-vm-fold] .chat-history-panel{flex:1}html[live-page-rank-list-vm-fold] .chat-history-panel .danmaku-at-prompt{bottom:160px}html[live-page-rank-list-vm] #rank-list-vm{display:none!important}html[live-page-rank-list-vm] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-rank-list-vm] .chat-history-panel{flex:1}html[live-page-rank-list-vm] .chat-history-panel .danmaku-at-prompt{bottom:160px}html[live-page-compact-danmaku] .chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble{margin:2px 0!important}html[live-page-compact-danmaku] .chat-history-panel .chat-history-list .chat-item{padding:3px 5px!important;font-size:15px!important}html[live-page-compact-danmaku] .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-name,html[live-page-compact-danmaku] .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname,html[live-page-compact-danmaku] .chat-history-panel .chat-history-list .chat-item.danmaku-item .reply-uname .common-nickname-wrapper{font-size:15px!important}html[live-page-convention-msg] .convention-msg.border-box,html[live-page-convention-msg] .new-video-pk-item-dm,html[live-page-rank-icon] .chat-item .rank-icon,html[live-page-title-label] .chat-item .title-label,html[live-page-wealth-medal-ctnr] .chat-item .wealth-medal-ctnr,html[live-page-group-medal-ctnr] .chat-item .group-medal-ctnr,html[live-page-fans-medal-item-ctnr] .chat-item .fans-medal-item-ctnr{display:none!important}html[live-page-chat-item-background-color] .chat-item{background-color:unset!important;border-image-source:unset!important}html[live-page-gift-item] .chat-item.gift-item,html[live-page-gift-item] .chat-item.common-danmuku-msg,html[live-page-chat-item-top3-notice] .chat-item.top3-notice,html[live-page-brush-prompt] #brush-prompt{display:none!important}html[live-page-brush-prompt] .chat-history-panel .chat-history-list.with-brush-prompt{height:100%!important}html[live-page-combo-card-countdown] #combo-card:has(.countDownBtn),html[live-page-combo-card-countdown] .gift-wish-card-root{display:none!important}html[live-page-combo-card-countdown] .chat-history-panel{padding-bottom:0!important}html[live-page-combo-card] #combo-card:has(.combo-tips){display:none!important}html[live-page-service-card-container] .play-together-service-card-container,html[live-page-vote-card] .vote-card,html[live-page-control-panel-icon-row] .control-panel-icon-row{display:none!important}html[live-page-control-panel-icon-row] #chat-control-panel-vm{height:115px;min-height:unset!important}html[live-page-control-panel-icon-row] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-control-panel-icon-row] .chat-history-panel{flex:1}html[live-page-control-panel-icon-row] .chat-history-panel .danmaku-at-prompt{bottom:100px}html[live-page-chat-input-ctnr-medal-section] .medal-section{display:none!important}html[live-page-chat-input-ctnr-medal-section] .chat-input-new{padding:10px 5px!important}html[live-page-chat-input-ctnr-send-btn] .bottom-actions{display:none!important}html[live-page-chat-input-ctnr-send-btn] #chat-control-panel-vm{height:-moz-fit-content!important;height:fit-content!important;min-height:unset!important}html[live-page-chat-input-ctnr-send-btn] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-chat-input-ctnr-send-btn] .chat-history-panel{flex:1}html[live-page-chat-input-ctnr-send-btn] .chat-history-panel .danmaku-at-prompt{bottom:120px}html[live-page-chat-input-ctnr] .chat-input-ctnr,html[live-page-chat-input-ctnr] .bottom-actions{display:none!important}html[live-page-chat-input-ctnr] #chat-control-panel-vm{height:-moz-fit-content!important;height:fit-content!important;min-height:unset!important}html[live-page-chat-input-ctnr] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-chat-input-ctnr] .chat-history-panel{flex:1}html[live-page-chat-input-ctnr] .chat-history-panel .danmaku-at-prompt{bottom:70px}html[live-page-chat-control-panel] #chat-control-panel-vm{display:none!important;min-height:unset!important}html[live-page-chat-control-panel] body:not(.hide-aside-area.player-full-win) #aside-area-vm{display:flex;flex-direction:column}html[live-page-chat-control-panel] .chat-history-panel{flex:1;border-bottom-left-radius:12px;border-bottom-right-radius:12px}html[live-page-chat-control-panel] .chat-history-panel .danmaku-at-prompt{bottom:20px!important}';
  const popularStyle = "html[homepage-hide-banner] .header-banner__inner,html[homepage-hide-banner] .bili-header__banner{display:none!important}html[homepage-hide-banner] .bili-header .bili-header__bar:not(.slide-down){position:relative!important;box-shadow:0 2px 4px #00000014}html[homepage-hide-banner] .bili-header__channel{margin-top:5px!important}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-icon,html[homepage-hide-banner] .bili-header .left-entry .entry-title,html[homepage-hide-banner] .bili-header .left-entry .download-entry,html[homepage-hide-banner] .bili-header .left-entry .default-entry,html[homepage-hide-banner] .bili-header .left-entry .loc-entry{color:var(--text1, #18191c)!important}html[homepage-hide-banner] .bili-header .left-entry .entry-title .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] .bili-header .right-entry__outside .right-entry-text{color:var(--text2, #61666d)!important}html[homepage-hide-banner] #i_cecream .bili-header__bar.slide-down{transition:background-color .3s ease-out,box-shadow .3s ease-out!important}html[homepage-hide-banner] #i_cecream .bili-header__bar:not(.slide-down){transition:background-color .3s ease-out!important}html[homepage-hide-banner] #biliMainHeader{min-height:unset!important}html[homepage-hide-banner] #internationalHeader .bili-banner{display:none}html[homepage-hide-banner] .mini-header__content{box-shadow:0 2px 4px #00000014}html[homepage-hide-banner] .bili-icon_dingdao_zhuzhan:before{color:#00aeec}html[homepage-hide-banner] .mini-header__content .nav-link .nav-link-ul .nav-link-item .link{color:#000;text-shadow:unset}html[homepage-hide-banner] .mini-header__content .nav-search-box{border:1px solid #e3e5e7}html[homepage-hide-banner] #nav_searchform{background-color:#f2f3f4!important}html[homepage-hide-banner] .bili-header-m .nav-search .nav-search-btn,html[homepage-hide-banner] .international-header .nav-search .nav-search-btn{background-color:#f2f3f4}html[homepage-hide-banner] .mini-header__content .nav-user-center .user-con .item .name{color:#000;text-shadow:unset}html[homepage-hide-sticky-header] .bili-header .left-entry__title svg{display:none!important}html[homepage-hide-sticky-header] #i_cecream .bili-feed4 .bili-header .slide-down{box-shadow:unset!important}html[homepage-hide-sticky-header] #nav-searchform.is-actived:before,html[homepage-hide-sticky-header] #nav-searchform.is-exper:before,html[homepage-hide-sticky-header] #nav-searchform.is-exper:hover:before,html[homepage-hide-sticky-header] #nav-searchform.is-focus:before,html[homepage-hide-sticky-header] .bili-header .slide-down{background:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down{position:absolute!important;top:0;animation:unset!important;box-shadow:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry{margin-right:30px!important}html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .default-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .download-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .entry-title,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .entry-title .zhuzhan-icon,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .loc-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .loc-mc-box__text,html[homepage-hide-sticky-header] .bili-header .slide-down .left-entry .mini-header__title,html[homepage-hide-sticky-header] .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,html[homepage-hide-sticky-header] .bili-header .slide-down .right-entry .right-entry__outside .right-entry-text{color:#fff!important}html[homepage-hide-sticky-header] .bili-header .slide-down .download-entry,html[homepage-hide-sticky-header] .bili-header .slide-down .loc-entry{display:unset!important}html[homepage-hide-sticky-header] .bili-header .slide-down .center-search-container,html[homepage-hide-sticky-header] .bili-header .slide-down .center-search-container .center-search__bar{margin:0 auto!important}html[homepage-hide-sticky-header] #nav-searchform{background:#f1f2f3}html[homepage-hide-sticky-header] #nav-searchform:hover{background-color:var(--bg1)!important;opacity:1}html[homepage-hide-sticky-header] #nav-searchform.is-focus{border:1px solid var(--line_regular)!important;border-bottom:none!important;background:var(--bg1)!important}html[homepage-hide-sticky-header] #nav-searchform.is-actived.is-exper4-actived,html[homepage-hide-sticky-header] #nav-searchform.is-focus.is-exper4-actived{border-bottom:unset!important}html[popular-hide-tips] .popular-list .popular-tips,html[popular-hide-tips] .rank-container .rank-tips,html[popular-hide-tips] .history-list .history-tips{display:none!important}html[popular-hide-tips] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-hide-danmaku-count] .popular-list .video-stat .like-text,html[popular-hide-danmaku-count] .weekly-list .video-stat .like-text,html[popular-hide-danmaku-count] .history-list .video-stat .like-text,html[popular-hide-danmaku-count] .rank-list .rank-item .detail-state .data-box:nth-child(2){display:none!important}html[popular-hide-danmaku-count] .rank-list .rank-item .detail-state .data-box:nth-child(1){margin:0!important}html[popular-hide-danmaku-count] .video-card .video-stat .play-text{margin-right:0!important}html[popular-layout-2-column] .cm-module{display:none!important}html[popular-layout-2-column] .video-list,html[popular-layout-2-column] .popular-list .card-list,html[popular-layout-2-column] .history-list .card-list{display:grid!important;grid-template-columns:auto auto}html[popular-layout-2-column] .popular-list .card-list .video-card,html[popular-layout-2-column] .video-list .video-card,html[popular-layout-2-column] .history-list .card-list .video-card{width:unset!important}html[popular-layout-4-column] .cm-module{display:none!important}@media (width >= 1300px) and (width <= 1399.9px){html[popular-layout-4-column] .popular-container{max-width:1180px!important}}@media (width <= 1139.9px){html[popular-layout-4-column] .popular-container{max-width:1020px!important}}html[popular-layout-4-column] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout-4-column] .nav-tabs{height:70px!important}html[popular-layout-4-column] .popular-list{padding:10px 0 0!important}html[popular-layout-4-column] .video-list{margin-top:15px!important}html[popular-layout-4-column] .popular-list .popular-tips,html[popular-layout-4-column] .rank-container .rank-tips,html[popular-layout-4-column] .history-list .history-tips,html[popular-layout-4-column] .weekly-list .weekly-hint,html[popular-layout-4-column] .history-list .history-hint{display:none!important}html[popular-layout-4-column] .card-list,html[popular-layout-4-column] .video-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 4!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}html[popular-layout-4-column] .card-list .video-card,html[popular-layout-4-column] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-4-column] .card-list .video-card .video-card__content,html[popular-layout-4-column] .video-list .video-card .video-card__content{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-4-column] .card-list .video-card .video-card__info,html[popular-layout-4-column] .video-list .video-card .video-card__info{margin-top:8px!important;font-size:14px;padding:0!important}html[popular-layout-4-column] .card-list .video-card .video-card__info .rcmd-tag,html[popular-layout-4-column] .video-list .video-card .video-card__info .rcmd-tag{display:none!important}html[popular-layout-4-column] .card-list .video-card .video-card__info .video-name,html[popular-layout-4-column] .video-list .video-card .video-card__info .video-name{font-weight:400!important;margin-bottom:8px!important;font-size:15px!important;line-height:22px!important;height:44px!important;overflow:hidden!important}html[popular-layout-4-column] .card-list .video-card .video-card__info .up-name,html[popular-layout-4-column] .video-list .video-card .video-card__info .up-name{margin:unset!important;font-size:14px!important;text-wrap:nowrap!important}html[popular-layout-4-column] .card-list .video-card .video-card__info>div,html[popular-layout-4-column] .video-list .video-card .video-card__info>div{display:flex!important;justify-content:space-between!important}html[popular-layout-4-column] .card-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-4-column] .video-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-4-column] .card-list .video-card .video-card__info .video-stat .like-text,html[popular-layout-4-column] .video-list .video-card .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout-4-column] .rank-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 4!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}html[popular-layout-4-column] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-4-column] .rank-list .rank-item>.content{display:unset!important;padding:unset!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.img{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.img .num{font-size:18px;zoom:1.2}html[popular-layout-4-column] .rank-list .rank-item>.content>.info{margin-top:8px!important;margin-left:unset!important;padding:0!important;font-size:14px;height:unset!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.info .title{height:44px!important;line-height:22px!important;font-weight:500!important;font-size:15px!important;overflow:hidden!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.info .detail{display:flex!important;justify-content:space-between!important;align-items:center!important;margin-top:8px!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.info .detail>a .up-name{margin:unset!important;font-size:14px;text-wrap:nowrap!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box{line-height:unset!important;margin:0 12px 0 0;text-wrap:nowrap!important}html[popular-layout-4-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box:nth-child(2){margin:0!important}html[popular-layout-4-column] .rank-list .rank-item>.content .more-data{display:none!important}html[popular-layout-5-column] .cm-module{display:none!important}@media (width >= 1300px) and (width <= 1399.9px){html[popular-layout-5-column] .popular-container{max-width:1180px!important}}@media (width <= 1139.9px){html[popular-layout-5-column] .popular-container{max-width:1020px!important}}html[popular-layout-5-column] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout-5-column] .nav-tabs{height:70px!important}html[popular-layout-5-column] .popular-list{padding:10px 0 0!important}html[popular-layout-5-column] .video-list{margin-top:15px!important}html[popular-layout-5-column] .popular-list .popular-tips,html[popular-layout-5-column] .rank-container .rank-tips,html[popular-layout-5-column] .history-list .history-tips,html[popular-layout-5-column] .weekly-list .weekly-hint,html[popular-layout-5-column] .history-list .history-hint{display:none!important}html[popular-layout-5-column] .card-list,html[popular-layout-5-column] .video-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 5!important;grid-template-columns:repeat(5,minmax(0,1fr))!important}html[popular-layout-5-column] .card-list .video-card,html[popular-layout-5-column] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-5-column] .card-list .video-card .video-card__content,html[popular-layout-5-column] .video-list .video-card .video-card__content{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-5-column] .card-list .video-card .video-card__info,html[popular-layout-5-column] .video-list .video-card .video-card__info{margin-top:8px!important;font-size:14px;padding:0!important}html[popular-layout-5-column] .card-list .video-card .video-card__info .rcmd-tag,html[popular-layout-5-column] .video-list .video-card .video-card__info .rcmd-tag{display:none!important}html[popular-layout-5-column] .card-list .video-card .video-card__info .video-name,html[popular-layout-5-column] .video-list .video-card .video-card__info .video-name{font-weight:400!important;margin-bottom:8px!important;font-size:15px!important;line-height:22px!important;height:44px!important;overflow:hidden!important}html[popular-layout-5-column] .card-list .video-card .video-card__info .up-name,html[popular-layout-5-column] .video-list .video-card .video-card__info .up-name{margin:unset!important;font-size:14px!important;text-wrap:nowrap!important}html[popular-layout-5-column] .card-list .video-card .video-card__info>div,html[popular-layout-5-column] .video-list .video-card .video-card__info>div{display:flex!important;justify-content:space-between!important}html[popular-layout-5-column] .card-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-5-column] .video-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-5-column] .card-list .video-card .video-card__info .video-stat .like-text,html[popular-layout-5-column] .video-list .video-card .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout-5-column] .rank-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 5!important;grid-template-columns:repeat(5,minmax(0,1fr))!important}html[popular-layout-5-column] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-5-column] .rank-list .rank-item>.content{display:unset!important;padding:unset!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.img{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.img .num{font-size:18px;zoom:1.2}html[popular-layout-5-column] .rank-list .rank-item>.content>.info{margin-top:8px!important;margin-left:unset!important;padding:0!important;font-size:14px;height:unset!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.info .title{height:44px!important;line-height:22px!important;font-weight:500!important;font-size:15px!important;overflow:hidden!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.info .detail{display:flex!important;justify-content:space-between!important;align-items:center!important;margin-top:8px!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.info .detail>a .up-name{margin:unset!important;font-size:14px;text-wrap:nowrap!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box{line-height:unset!important;margin:0 12px 0 0;text-wrap:nowrap!important}html[popular-layout-5-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box:nth-child(2){margin:0!important}html[popular-layout-5-column] .rank-list .rank-item>.content .more-data{display:none!important}html[popular-layout-6-column] .cm-module{display:none!important}@media (width >= 1300px) and (width <= 1399.9px){html[popular-layout-6-column] .popular-container{max-width:1180px!important}}@media (width <= 1139.9px){html[popular-layout-6-column] .popular-container{max-width:1020px!important}}html[popular-layout-6-column] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout-6-column] .nav-tabs{height:70px!important}html[popular-layout-6-column] .popular-list{padding:10px 0 0!important}html[popular-layout-6-column] .video-list{margin-top:15px!important}html[popular-layout-6-column] .popular-list .popular-tips,html[popular-layout-6-column] .rank-container .rank-tips,html[popular-layout-6-column] .history-list .history-tips,html[popular-layout-6-column] .weekly-list .weekly-hint,html[popular-layout-6-column] .history-list .history-hint{display:none!important}html[popular-layout-6-column] .card-list,html[popular-layout-6-column] .video-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 6!important;grid-template-columns:repeat(6,minmax(0,1fr))!important}html[popular-layout-6-column] .card-list .video-card,html[popular-layout-6-column] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-6-column] .card-list .video-card .video-card__content,html[popular-layout-6-column] .video-list .video-card .video-card__content{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-6-column] .card-list .video-card .video-card__info,html[popular-layout-6-column] .video-list .video-card .video-card__info{margin-top:8px!important;font-size:14px;padding:0!important}html[popular-layout-6-column] .card-list .video-card .video-card__info .rcmd-tag,html[popular-layout-6-column] .video-list .video-card .video-card__info .rcmd-tag{display:none!important}html[popular-layout-6-column] .card-list .video-card .video-card__info .video-name,html[popular-layout-6-column] .video-list .video-card .video-card__info .video-name{font-weight:400!important;margin-bottom:8px!important;font-size:15px!important;line-height:22px!important;height:44px!important;overflow:hidden!important}html[popular-layout-6-column] .card-list .video-card .video-card__info .up-name,html[popular-layout-6-column] .video-list .video-card .video-card__info .up-name{margin:unset!important;font-size:14px!important;text-wrap:nowrap!important}html[popular-layout-6-column] .card-list .video-card .video-card__info>div,html[popular-layout-6-column] .video-list .video-card .video-card__info>div{display:flex!important;justify-content:space-between!important}html[popular-layout-6-column] .card-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-6-column] .video-list .video-card .video-card__info .video-stat .play-text,html[popular-layout-6-column] .card-list .video-card .video-card__info .video-stat .like-text,html[popular-layout-6-column] .video-list .video-card .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout-6-column] .rank-list{width:100%!important;display:grid!important;grid-gap:20px!important;grid-column:span 6!important;grid-template-columns:repeat(6,minmax(0,1fr))!important}html[popular-layout-6-column] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout-6-column] .rank-list .rank-item>.content{display:unset!important;padding:unset!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.img{background:none;width:unset!important;height:unset!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.img .num{font-size:18px;zoom:1.1}html[popular-layout-6-column] .rank-list .rank-item>.content>.info{margin-top:8px!important;margin-left:unset!important;padding:0!important;font-size:14px;height:unset!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.info .title{height:44px!important;line-height:22px!important;font-weight:500!important;font-size:15px!important;overflow:hidden!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.info .detail{display:flex!important;justify-content:space-between!important;align-items:center!important;margin-top:8px!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.info .detail>a .up-name{margin:unset!important;font-size:14px;text-wrap:nowrap!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box{line-height:unset!important;margin:0 12px 0 0;text-wrap:nowrap!important}html[popular-layout-6-column] .rank-list .rank-item>.content>.info .detail>.detail-state .data-box:nth-child(2){margin:0!important}html[popular-layout-6-column] .rank-list .rank-item>.content .more-data{display:none!important}html[popular-hot-hide-tag] .popular-list .rcmd-tag,html[popular-weekly-hide-hint] .weekly-list .weekly-hint,html[popular-history-hide-hint] .history-list .history-hint{display:none!important}";
  const searchStyle = 'html[hide-search-page-search-sticky-header] .search-sticky-header,html[hide-search-page-bangumi-pgc-list] .bangumi-pgc-list,html[hide-search-page-activity-game-list] .activity-game-list{display:none!important}html[hide-search-page-ad] .video-list.row>div:has([href*="cm.bilibili.com"],.bili-video-card__info--ad,.bili-video-card__info--ad-creative){display:none!important}html[hide-search-page-live-room-result] .video-list>div:has([href*="live.bilibili.com"]){display:none!important}html[hide-search-page-danmaku-count] .bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2){display:none!important}html[hide-search-page-date] .bili-video-card .bili-video-card__info--date{display:none!important}html[hide-search-page-customer-service] .side-buttons div:has(>a[href*=customer-service]){display:none!important}html[hide-search-page-btn-to-top] .side-buttons .btn-to-top-wrap{display:none!important}';
  const spaceStyle = "html[hide-space-page-video-card-danmaku-count] .bili-video-card .bili-cover-card__stats .bili-cover-card__stat:nth-child(2):not(:last-child){display:none!important}html[increase-space-page-video-card-font-size] .bili-cover-card{--bili-cover-card-stat-icon-size: 16px !important;--bili-cover-card-stat-font-size: 13px !important}html[increase-space-page-video-card-font-size] .bili-video-card{--bili-video-card-title-font-size: 15px !important;--bili-video-card-title-line-height: 23px !important;--bili-video-card-subtitle-font-size: 14px !important;--bili-video-card-subtitle-line-height: 16px !important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layer.center{width:48px!important;height:48px!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:nth-child(2) picture{display:none!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers:has(.b-avatar__layer__res[style^=background]){display:none!important}html[hide-dynamic-page-bili-dyn-avatar-icon] .bili-dyn-list .b-avatar__layers .b-avatar__layer:last-child:not(.center){display:none!important}html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-ornament,html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-item__ornament,html[hide-dynamic-page-bili-dyn-dispute] .bili-dyn-content__dispute,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__orig__topic,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__forw__topic{display:none!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic{color:inherit!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic:hover{color:var(--brand_blue)!important}html[hide-dynamic-page-bili-dyn-item-interaction] .bili-dyn-item__interaction{display:none!important}html[hide-dynamic-page-bili-dyn-card-reserve] .bili-dyn-list__item:has(.bili-dyn-card-reserve){display:none!important}html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-dyn-card-goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-rich-text-module.goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has([data-type=goods]){visibility:hidden!important;height:0!important;margin:0!important}html[hide-dynamic-page-bili-dyn-lottery] .bili-dyn-list__item:has([data-type=lottery]){display:none!important}html[hide-dynamic-page-bili-dyn-forward] .bili-dyn-list__item:has(.bili-dyn-content__orig.reference){display:none!important}html[hide-dynamic-page-bili-dyn-vote] .bili-dyn-list__item:has(.bili-dyn-card-vote){display:none!important}html[hide-dynamic-page-bili-dyn-live] .bili-dyn-list__item:has(.bili-dyn-card-live){display:none!important}html[hide-dynamic-page-bili-dyn-blocked] .bili-dyn-list__item:has(.dyn-blocked-mask){display:none!important}html[hide-dynamic-page-bili-dyn-charge-video] .bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*=qcRJ6sJU91]){display:none!important}html[hide-space-page-sidebar-feedback] #app .space-float{height:-moz-fit-content!important;height:fit-content!important}html[hide-space-page-sidebar-feedback] #app .space-float .float-button:nth-last-child(3){display:none!important}html[hide-space-page-sidebar-revert] #app .space-float{height:-moz-fit-content!important;height:fit-content!important}html[hide-space-page-sidebar-revert] #app .space-float .float-button:nth-last-child(2){display:none!important}";
  const videoStyle = '@charset "UTF-8";html[video-page-simple-share] .video-share-popover .video-share-dropdown .dropdown-bottom{display:none!important}html[video-page-simple-share] .video-share-popover .video-share-dropdown .dropdown-top{padding:15px!important}html[video-page-simple-share] .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right{display:none!important}html[video-page-simple-share] .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left{padding-right:0!important}html[video-page-hide-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[video-page-danmaku-font-family] .bili-danmaku-x-dm{--fontFamily: var(--video-page-danmaku-font-family) !important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm{--fontWeight: var(--video-page-danmaku-font-weight) !important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::-moz-placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:transparent!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-sug,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-carousel,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-popup,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area,html[video-page-hide-bpx-player-sending-area] #bilibili-player-placeholder-bottom{display:none!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])){height:unset!important;aspect-ratio:16/9}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])) #bilibili-player{height:unset!important;aspect-ratio:16/9}html[video-page-hide-bpx-player-sending-area] .page-main-content:has(.festival-video-player) .video-player-box{height:-moz-fit-content!important;height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player{height:-moz-fit-content!important;height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player #bilibili-player:not(.mode-webscreen){height:calc(100% - 46px)!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:-moz-fit-content!important;width:fit-content!important}html[video-page-unfold-video-info-title] .video-info-container:has(.show-more){height:-moz-fit-content!important;height:fit-content!important;margin-bottom:12px}html[video-page-unfold-video-info-title] .video-info-container .video-info-title-inner-overflow .video-title{margin-right:unset!important;text-wrap:wrap!important}html[video-page-unfold-video-info-title] .video-info-container .video-info-title-inner .video-title .video-title-href{text-wrap:wrap!important}html[video-page-unfold-video-info-title] .video-info-container .show-more,html[video-page-hide-video-info-danmaku-count] .video-info-detail .dm,html[video-page-hide-video-info-danmaku-count] .video-info-meta .dm,html[video-page-hide-video-info-pubdate] .video-info-detail .pubdate-ip,html[video-page-hide-video-info-pubdate] .video-info-meta .pubdate-ip,html[video-page-hide-video-info-copyright] .video-info-detail .copyright,html[video-page-hide-video-info-copyright] .video-info-meta .copyright,html[video-page-hide-video-info-honor] .video-info-detail .honor-rank,html[video-page-hide-video-info-honor] .video-info-detail .honor-weekly,html[video-page-hide-video-info-honor] .video-info-detail .honor-history,html[video-page-hide-video-info-honor] .video-info-meta .honor-rank,html[video-page-hide-video-info-honor] .video-info-meta .honor-weekly,html[video-page-hide-video-info-honor] .video-info-meta .honor-history,html[video-page-hide-video-info-argue] .video-info-detail .argue,html[video-page-hide-video-info-argue] .video-info-detail .video-argue,html[video-page-hide-video-info-argue] .video-info-meta .argue,html[video-page-hide-video-info-argue] .video-info-meta .video-argue{display:none!important}html[video-page-hide-bpx-player-mini-mode-process] .bpx-player-container[data-screen=mini]:not(:hover) .bpx-player-mini-progress{display:none}html[video-page-hide-bpx-player-mini-mode-danmaku] .bpx-player-container[data-screen=mini] .bpx-player-row-dm-wrap{visibility:hidden!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-screen=mini]{height:calc(225px * var(--mini-player-zoom, 1))!important;width:calc(400px * var(--mini-player-zoom, 1))!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="1"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="2"][data-screen=mini]{height:calc(180px * var(--mini-player-zoom, 1))!important;width:calc(320px * var(--mini-player-zoom, 1))!important}@media screen and (width >= 1681px){html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="1"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision="2"][data-screen=mini]{height:calc(203px * var(--mini-player-zoom, 1))!important;width:calc(360px * var(--mini-player-zoom, 1))!important}}html[video-page-bpx-player-mini-mode-position-record] .bpx-player-container[data-screen=mini]{transform:translate(var(--mini-player-translate-x, 1)) translateY(var(--mini-player-translate-y, 1))}html[video-page-hide-bpx-player-bili-guide-all] .bili-follow-to-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-animate,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-cyc,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-followed,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-gray,html[video-page-hide-bpx-player-bili-vote] .bili-vote,html[video-page-hide-bpx-player-bili-vote] .bili-danmaku-x-vote,html[video-page-hide-bpx-player-bili-qoe-feedback] .bpx-player-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-score,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-vote,html[video-page-hide-bpx-player-bili-score] .bili-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-superRating,html[video-page-hide-bpx-player-bili-score-sum] .bili-scoreSum,html[video-page-hide-bpx-player-bili-score-sum] .bili-danmaku-x-scoreSum,html[video-page-hide-bpx-player-bili-clock] .bili-clock,html[video-page-hide-bpx-player-bili-clock] .bili-danmaku-x-clock,html[video-page-hide-bpx-player-bili-cmtime] .bili-cmtime,html[video-page-hide-bpx-player-bili-cmtime] .bili-danmaku-x-cmtime,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-cmd-shrink,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-danmaku-x-cmd-shrink,html[video-page-hide-bpx-player-bili-reserve] .bili-reserve,html[video-page-hide-bpx-player-bili-reserve] .bili-danmaku-x-reserve,html[video-page-hide-bpx-player-bili-link] .bili-link,html[video-page-hide-bpx-player-bili-link] .bili-danmaku-x-link,html[video-page-hide-bpx-player-cmd-dm-wrap] .bpx-player-cmd-dm-wrap,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-left-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[video-page-hide-bpx-player-top-left-music] .bpx-player-top-left-music,html[video-page-hide-bpx-player-top-left-follow] .bpx-player-top-left-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-related{display:none!important}html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-content{display:flex!important;align-items:center!important}html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-dm .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-image:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:none!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-subtitle-font-color] .bpx-player-subtitle-panel-text{color:var(--video-page-subtitle-font-color)!important}html[video-page-subtitle-font-family] .bpx-player-subtitle-panel-text{font-family:var(--video-page-subtitle-font-family)!important}html[video-page-subtitle-font-weight] .bpx-player-subtitle-panel-text{font-weight:var(--video-page-subtitle-font-weight)!important}html[video-page-subtitle-text-stroke-color] .bpx-player-subtitle-panel-text{background:unset!important;background-color:var(--video-page-subtitle-text-stroke-color)!important;-webkit-background-clip:text!important;background-clip:text!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=normal],[data-screen=wide]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-moz-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-ms-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=web],[data-screen=full]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-moz-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-ms-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-viewpoint] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}html[default-widescreen][player-is-wide] #playerWrap:has(.bpx-player-container[data-screen=mini]){width:-moz-fit-content;width:fit-content}html[webscreen-scrollable] .webscreen-fix{position:unset;top:unset;left:unset;margin:unset;padding:unset;width:unset;height:unset}html[webscreen-scrollable] .webscreen-fix #biliMainHeader{display:none}html[webscreen-scrollable] .webscreen-fix #mirror-vdcon{box-sizing:content-box;position:relative}html[webscreen-scrollable] .webscreen-fix #danmukuBox{margin-top:0!important}html[webscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left){position:static!important;padding-top:100vh}html[webscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) .video-info-container{height:-moz-fit-content;height:fit-content}html[webscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) #bilibili-player.mode-webscreen{position:static;border-radius:unset;z-index:unset;left:unset;top:unset;width:100%;height:100%}html[webscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) #playerWrap{position:absolute;left:0;right:0;top:0;height:100vh;width:100vw;padding-right:0}html[webscreen-scrollable] .webscreen-fix :is(.right-container,.playlist-container--right){padding-top:100vh}html[webscreen-scrollable] .webscreen-fix .float-nav-exp .nav-menu .item.mini,html[webscreen-scrollable] .webscreen-fix .fixed-sidenav-storage .mini-player-window{display:none!important}html[webscreen-scrollable] .webscreen-fix .bili-dialog-m{z-index:100000!important}html[webscreen-scrollable] .webscreen-fix::-webkit-scrollbar{display:none!important}@supports (-moz-appearance: none){html[webscreen-scrollable]:has(.webscreen-fix){scrollbar-width:none!important}}html[fullscreen-scrollable] .webscreen-fix{position:unset;top:unset;left:unset;margin:unset;padding:unset;width:unset;height:unset}html[fullscreen-scrollable] .webscreen-fix #biliMainHeader{display:none}html[fullscreen-scrollable] .webscreen-fix #mirror-vdcon{box-sizing:content-box;position:relative}html[fullscreen-scrollable] .webscreen-fix #danmukuBox{margin-top:0!important}html[fullscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left){position:static!important;padding-top:100vh}html[fullscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) .video-info-container{height:-moz-fit-content;height:fit-content}html[fullscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) #bilibili-player.mode-webscreen{position:static;border-radius:unset;z-index:unset;left:unset;top:unset;width:100%;height:100%}html[fullscreen-scrollable] .webscreen-fix :is(.left-container,.playlist-container--left) #playerWrap{position:absolute;left:0;right:0;top:0;height:100vh;width:100vw;padding-right:0}html[fullscreen-scrollable] .webscreen-fix :is(.right-container,.playlist-container--right){padding-top:100vh}html[fullscreen-scrollable] .webscreen-fix .float-nav-exp .nav-menu .item.mini,html[fullscreen-scrollable] .webscreen-fix .fixed-sidenav-storage .mini-player-window{display:none!important}html[fullscreen-scrollable] .webscreen-fix .bili-dialog-m{z-index:100000!important}html[fullscreen-scrollable] .webscreen-fix::-webkit-scrollbar{display:none!important}html[fullscreen-scrollable] .bili-msg{z-index:100001!important}@supports (-moz-appearance: none){html[fullscreen-scrollable]:has(.webscreen-fix){scrollbar-width:none!important}}html[video-page-exchange-player-position] body:not(.webscreen-fix) :is(.left-container,.playlist-container--left){display:flex!important;flex-direction:column!important;padding-top:30px!important}html[video-page-exchange-player-position] body:not(.webscreen-fix) :is(.left-container,.playlist-container--left)>*{order:1}html[video-page-exchange-player-position] body:not(.webscreen-fix) #playerWrap{order:0!important;z-index:1}html[video-page-exchange-player-position] body:not(.webscreen-fix) .video-info-container{height:auto!important;padding-top:16px!important;margin-bottom:0!important}html[video-page-exchange-player-position][player-is-wide] body:not(.webscreen-fix) .up-panel-container{position:relative!important;margin-top:calc(max(min(96.23vw - 359.514px,2010px),923px)*.5625 + 81px)}html[video-page-exchange-player-position][player-is-wide] body:not(.webscreen-fix) #danmukuBox{margin-top:0!important}html[video-page-exchange-player-position] .bili-msg{z-index:100001!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap{height:-moz-fit-content!important;height:fit-content!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player-placeholder-top{width:min(100vw - 400px,var(--normalscreen-width))!important;aspect-ratio:16/9!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player{width:min(100vw - 400px,var(--normalscreen-width))!important;height:-moz-fit-content;height:fit-content}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player .bpx-player-video-area{width:min(100vw - 400px,var(--normalscreen-width))!important;aspect-ratio:16/9!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) .left-container,html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) .playlist-container--left{width:min(100vw - 400px,var(--normalscreen-width))!important}html[normalscreen-width] .webscreen-fix .left-container,html[normalscreen-width] .webscreen-fix .playlist-container--left{width:min(100vw - 400px,var(--normalscreen-width))!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) .left-container,html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) .playlist-container--left{width:min(100vw - 400px,var(--normalscreen-width))!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap{width:min(100vw - 400px,var(--normalscreen-width))!important;height:-moz-fit-content!important;height:fit-content!important;display:flex!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player-placeholder{position:static;width:min(100vw - 400px,var(--normalscreen-width))!important;height:-moz-fit-content!important;height:fit-content!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player-placeholder #bilibili-player-placeholder-top{width:min(100vw - 400px,var(--normalscreen-width))!important;aspect-ratio:16/9!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player{width:min(100vw - 400px,var(--normalscreen-width))!important;height:-moz-fit-content!important;height:fit-content!important}html[normalscreen-width][player-is-wide]:has(.bpx-player-container[data-screen=mini]) #bilibili-player{background-color:#000!important}html[video-page-right-container-sticky-optimize] .right-container{display:flex!important}html[video-page-right-container-sticky-optimize] .right-container .right-container-inner{width:100%!important;position:sticky!important;top:unset!important;align-self:flex-end!important;min-height:calc(100vh - 64px)!important;max-width:100%!important;padding-bottom:0!important}html[video-page-right-container-sticky-optimize] .right-container-inner{min-height:calc(100vh - 304px)!important;bottom:240px!important}html[video-page-right-container-sticky-optimize] body:has(.mini-player-window:not(.on)) .right-container-inner{min-height:calc(100vh - 74px)!important;bottom:10px!important}html[video-page-right-container-sticky-disable] .right-container-inner{position:static!important}html[video-page-hide-right-container-ad] .right-container #slide_ad,html[video-page-hide-right-container-ad] .right-container .video-card-ad-small,html[video-page-hide-right-container-ad] .right-container .video-card-ad-small-inner,html[video-page-hide-right-container-ad] .right-container .video-page-special-card-small{display:none!important}html[video-page-hide-right-container-ad] .right-container #reco_list,html[video-page-hide-right-container-ad] .right-container .recommend-list-v1{margin-top:0!important}html[video-page-hide-right-container-video-page-game-card-small] .right-container .video-page-game-card-small{display:none!important}html[video-page-hide-right-container-danmaku] #danmukuBox{visibility:hidden!important;height:0!important;margin-bottom:0!important}html[video-page-hide-right-container-reco-list-next-play-next-button] .right-container .next-play .next-button,html[video-page-hide-right-container-reco-list-next-play-next-button] .right-container .next-play .continuous-btn,html[video-page-hide-right-container-reco-list-next-play] .right-container .next-play{display:none!important}html[video-page-hide-right-container-reco-list-next-play] .right-container .rec-list{margin-top:0!important}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list{counter-reset:section-counter}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item:before{counter-increment:section-counter;content:"P" counter(section-counter);font-size:15px;margin-right:10px;transition:color .2s}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item.active:before,html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item:hover:before{color:var(--brand_blue)}html[video-page-right-container-section-unfold-title] .video-pod.video-pod .section .video-pod__item .title{height:-moz-fit-content!important;height:fit-content!important}html[video-page-right-container-section-unfold-title] .video-pod.video-pod .section .video-pod__item .title-txt{-webkit-line-clamp:2!important;line-height:21px!important;margin-top:4px!important;margin-bottom:4px!important}html[video-page-hide-right-container-section-height] .video-sections-content-list,html[video-page-hide-right-container-section-height] .video-pod__body{height:-moz-fit-content!important;height:fit-content!important;max-height:340px!important}html[video-page-hide-right-container-section-next-btn] .base-video-sections-v1 .next-button{display:none!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-left{max-width:100%!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-title{max-width:unset!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-right,html[video-page-hide-right-container-section-next-btn] .video-pod__header .auto-play,html[video-page-hide-right-container-section-play-num] .base-video-sections-v1 .play-num,html[video-page-hide-right-container-section-play-num] .video-sections-head_second-line .play-num,html[video-page-hide-right-container-section-play-num] .video-pod__header .total-view,html[video-page-hide-right-container-section-abstract] .base-video-sections-v1 .abstract,html[video-page-hide-right-container-section-abstract] .base-video-sections-v1 .second-line_left img,html[video-page-hide-right-container-section-abstract] .video-sections-head_second-line .abstract,html[video-page-hide-right-container-section-abstract] .video-sections-head_second-line .second-line_left img,html[video-page-hide-right-container-section-abstract] .video-pod__header .pod-description-reference,html[video-page-hide-right-container-section-subscribe] .base-video-sections-v1 .second-line_right,html[video-page-hide-right-container-section-subscribe] .video-sections-head_second-line .second-line_right,html[video-page-hide-right-container-section-subscribe] .video-pod__header .subscribe-btn{display:none!important}html[video-page-right-container-set-info-bottom] :is(.video-page-card-small,.video-page-operator-card-small) .card-box .info{display:flex!important;flex-direction:column!important}html[video-page-right-container-set-info-bottom] :is(.video-page-card-small,.video-page-operator-card-small) .card-box .info .upname{margin-top:auto!important}html[video-page-hide-right-container-duration] .right-container .card-box .duration,html[video-page-hide-right-container-duration] .recommend-list-container .duration{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-up] .right-container .info{display:flex;flex-direction:column;justify-content:space-between}html[video-page-hide-right-container-reco-list-rec-list-info-up] .right-container .info .upname{visibility:hidden!important}html[video-page-hide-right-container-reco-list-rec-list-info-up] .recommend-list-container .info{display:flex;flex-direction:column;justify-content:space-between}html[video-page-hide-right-container-reco-list-rec-list-info-up] .recommend-list-container .info .upname{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .right-container .info{display:flex;flex-direction:column;justify-content:space-between}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .right-container .info .playinfo,html[video-page-hide-right-container-reco-list-rec-list-info-plays] .recommend-list-container .info .playinfo{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .recommend-list-container .info{display:flex;flex-direction:column;justify-content:space-between}html[video-page-hide-right-container-reco-list-rec-footer] .right-container .rec-footer,html[video-page-hide-right-container-reco-list-rec-footer] .playlist-container--right .rec-footer,html[video-page-hide-right-container-reco-list-rec-list] .right-container .rec-list,html[video-page-hide-right-container-reco-list-rec-list] .right-container .rec-footer,html[video-page-hide-right-container-reco-list-rec-list] .playlist-container--right .recommend-list-container,html[video-page-hide-right-container-right-bottom-banner] #right-bottom-banner,html[video-page-hide-right-container-right-bottom-banner] .right-bottom-banner{display:none!important}html[video-page-hide-right-container-right-bottom-banner] body:has(.mini-player-window:not(.on)) .right-container-inner{padding-bottom:10px!important}html[video-page-hide-right-container-live] .right-container .pop-live-small-mode{display:none!important}html[video-page-hide-right-container-live] body:has(.mini-player-window:not(.on)) .right-container-inner{padding-bottom:10px!important}html[video-page-hide-right-container]:not([player-is-wide]) .right-container{display:none!important}html[video-page-hide-sidenav-right-container-live] .fixed-sidenav-storage .mini-player-window,html[video-page-hide-sidenav-right-container-live] .float-nav-exp .nav-menu .item.mini,html[video-page-hide-sidenav-customer-service] .fixed-sidenav-storage .customer-service{display:none!important}html[video-page-hide-sidenav-customer-service] .float-nav-exp .nav-menu a:has(>.item.help){display:none!important}html[video-page-hide-sidenav-back-to-top] .fixed-sidenav-storage .back-to-top,html[video-page-hide-sidenav-back-to-top] .float-nav-exp .nav-menu .item.backup,html[video-page-hide-video-share-popover] .video-share-popover,html[video-page-hide-triple-oldfan-entry] .triple-oldfan-entry,html[video-page-hide-below-info-video-ai-assistant] .video-toolbar-right .video-ai-assistant,html[video-page-hide-below-info-video-note] .video-toolbar-right .video-note,html[video-page-hide-below-info-video-report-menu] .video-toolbar-right .video-tool-more{display:none!important}html[video-page-unfold-below-info-desc] #v_desc,html[video-page-unfold-below-info-desc] .video-desc-container{margin-bottom:0!important}html[video-page-unfold-below-info-desc] #v_desc .basic-desc-info,html[video-page-unfold-below-info-desc] .video-desc-container .basic-desc-info{height:auto!important}html[video-page-unfold-below-info-desc] #v_desc .toggle-btn,html[video-page-unfold-below-info-desc] .video-desc-container .toggle-btn,html[video-page-hide-below-info-desc] #v_desc,html[video-page-hide-below-info-desc] .video-desc-container{display:none!important}html[video-page-hide-below-info-tag] #v_tag,html[video-page-hide-below-info-tag] .video-tag-container{visibility:hidden!important;height:0!important;margin:0 0 10px!important}html[video-page-hide-below-activity-vote] #activity_vote,html[video-page-hide-below-activity-vote] .activity-m-v1,html[video-page-hide-below-bannerAd] #bannerAd,html[video-page-hide-below-bannerAd] .left-container .left-banner,html[video-page-hide-up-sendmsg] .up-detail .send-msg,html[video-page-hide-up-description] .up-detail .up-description,html[video-page-hide-up-charge] .upinfo-btn-panel .new-charge-btn,html[video-page-hide-up-charge] .upinfo-btn-panel .old-charge-btn,html[video-page-hide-up-bili-avatar-pendent-dom] .up-info-container .bili-avatar-pendent-dom{display:none!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap{width:48px!important;height:48px!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap .up-avatar{background-color:transparent!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap .bili-avatar{width:48px!important;height:48px!important;transform:unset!important}html[video-page-hide-up-bili-avatar-icon] .up-info-container .bili-avatar-icon,html[video-page-hide-up-bili-avatar-icon] .up-info-container .bili-avatar-nft-icon,html[video-page-hide-up-membersinfo-normal-header] .membersinfo-normal .header{display:none!important}';
  const watchlaterStyle = "html[watchlater-layout-4-column] .watchlater-list-container:not(.watchlater-list-container--list){grid-template-columns:repeat(4,1fr)!important;gap:25px 16px!important}html[watchlater-layout-5-column] .watchlater-list-container:not(.watchlater-list-container--list){grid-template-columns:repeat(5,1fr)!important;gap:25px 16px!important}html[watchlater-increase-font-size] .bili-video-card{--bili-video-card-title-padding-right: 0;--bili-video-card-title-font-size: 16px;--bili-video-card-subtitle-font-size: 14px}html[watchlater-increase-font-size] .bili-cover-card__stat{--bili-cover-card-stat-font-size: 14px}html[watchlater-increase-font-size] .bili-cover-card__progress{--bili-cover-card-progress-height: 3.5px}";
  const rules = [
    {
      name: "homepage",
      groups: homepageGroups,
      style: homepageStyle,
      checkFn: isPageHomepage
    },
    {
      name: "video",
      groups: videoGroups,
      style: videoStyle,
      checkFn: () => isPageVideo() || isPagePlaylist()
    },
    {
      name: "festival",
      groups: festivalGroups,
      style: festivalStyle,
      checkFn: isPageFestival
    },
    {
      name: "bangumi",
      groups: bangumiGroups,
      style: bangumiStyle,
      checkFn: isPageBangumi
    },
    {
      name: "dynamic",
      groups: dynamicGroups,
      style: dynamicStyle,
      checkFn: isPageDynamic
    },
    {
      name: "live",
      groups: liveGroups,
      style: liveStyle,
      checkFn: isPageLive
    },
    {
      name: "popular",
      groups: popularGroups,
      style: popularStyle,
      checkFn: isPagePopular
    },
    {
      name: "channel",
      groups: channelGroups,
      style: channelStyle,
      checkFn: isPageChannel
    },
    {
      name: "space",
      groups: spaceGroups,
      style: spaceStyle,
      checkFn: isPageSpace
    },
    {
      name: "search",
      groups: searchGroups,
      style: searchStyle,
      checkFn: isPageSearch
    },
    {
      name: "watchlater",
      groups: watchlaterGroups,
      style: watchlaterStyle,
      checkFn: isPageWatchlater
    },
    {
      name: "comment",
      groups: commentGroups,
      style: commentStyle,
      isSpecial: true,
      checkFn: () => isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist()
    },
    {
      name: "common",
      groups: commonGroups,
      style: commonStyle,
      isSpecial: true,
      checkFn: () => true
    },
    {
      name: "debug",
      groups: debugGroups,
      style: void 0,
      checkFn: isPageSpace
    }
  ];
  const loadRules = () => {
    for (const rule of rules) {
      if (rule.checkFn()) {
        for (const group of rule.groups) {
          for (const item of group.items) {
            try {
              switch (item.type) {
                case "switch":
                  loadSwitchItem(item);
                  break;
                case "number":
                  loadNumberItem(item);
                  break;
                case "list":
                  loadListItem(item);
                  break;
                case "string":
                  loadStringItem(item);
                  break;
              }
            } catch (err) {
              error(`loadRules load item failed, id=${item.id}, name=${item.name}, type=${item.type}`, err);
            }
          }
        }
      }
    }
  };
  const loadStyles = () => {
    var _a;
    for (const rule of rules) {
      if (rule.checkFn() && rule.style) {
        try {
          const style = document.createElement("style");
          style.className = `bili-cleaner-css ${rule.name}`;
          style.textContent = rule.style;
          (_a = document.documentElement) == null ? void 0 : _a.appendChild(style);
        } catch (err) {
          error(`loadStyles error, name=${rule.name}`, err);
        }
      }
    }
  };
  const loadSwitchItem = (item) => {
    var _a;
    const enable = BiliCleanerStorage.get(item.id, item.defaultEnable);
    if (enable) {
      if (!item.noStyle) {
        document.documentElement.setAttribute(item.attrName ?? item.id, "");
      }
      if (item.enableFn) {
        if (item.enableFnRunAt === "document-end" && document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            var _a2;
            (_a2 = item.enableFn()) == null ? void 0 : _a2.then().catch();
          });
        } else {
          (_a = item.enableFn()) == null ? void 0 : _a.then().catch();
        }
      }
    }
  };
  const loadNumberItem = (item) => {
    var _a;
    const value = BiliCleanerStorage.get(item.id, item.defaultValue);
    if (value !== item.disableValue) {
      if (!item.noStyle) {
        document.documentElement.setAttribute(item.attrName ?? item.id, "");
      }
      (_a = item.fn(value)) == null ? void 0 : _a.then().catch();
    }
  };
  const loadStringItem = (item) => {
    var _a;
    const value = BiliCleanerStorage.get(item.id, item.defaultValue);
    if (value !== item.disableValue) {
      if (!item.noStyle) {
        document.documentElement.setAttribute(item.attrName ?? item.id, "");
      }
      (_a = item.fn(value)) == null ? void 0 : _a.then().catch();
    }
  };
  const loadListItem = (item) => {
    const value = BiliCleanerStorage.get(item.id, item.defaultValue);
    if (value !== item.disableValue) {
      document.documentElement.setAttribute(value, "");
    }
  };
  const loadRulesHotKey = () => {
    try {
      const availableItemIds = /* @__PURE__ */ new Set();
      for (const rule of rules) {
        if (!rule.checkFn()) {
          continue;
        }
        for (const group of rule.groups) {
          for (const item of group.items) {
            switch (item.type) {
              case "switch":
                if (!item.enableFn) {
                  availableItemIds.add(item.id);
                }
                break;
              case "number":
              case "string":
                availableItemIds.add(item.id);
                break;
              case "list":
                item.options.forEach((v2) => {
                  availableItemIds.add(v2.id);
                });
                break;
            }
          }
        }
      }
      let isOn = false;
      const disableSign = "_bili_cleaner_disable_";
      const toggle = () => {
        if (!isOn) {
          const attrs = [];
          for (const attr of document.documentElement.attributes) {
            if (availableItemIds.has(attr.name)) {
              attrs.push(attr.name);
            }
          }
          for (const attr of attrs) {
            document.documentElement.removeAttribute(attr);
            document.documentElement.setAttribute(disableSign + attr, "");
          }
        } else {
          const attrs = [];
          for (const attr of document.documentElement.attributes) {
            if (attr.name.includes(disableSign)) {
              attrs.push(attr.name);
            }
          }
          for (const attr of attrs) {
            document.documentElement.removeAttribute(attr);
            document.documentElement.setAttribute(attr.replace(disableSign, ""), "");
          }
        }
        isOn = !isOn;
      };
      useMagicKeys({
        passive: false,
        onEventFired(e2) {
          if (e2.type === "keydown" && e2.altKey && e2.key.toLocaleLowerCase() === "b") {
            e2.preventDefault();
            toggle();
          }
        }
      });
    } catch (err) {
      error(`loadRulesHotKey error`, err);
    }
  };
  const _sfc_main$3 = /* @__PURE__ */ e$1.defineComponent({
    __name: "RulePanelView",
    setup(__props) {
      const store = useRulePanelStore();
      const currRules = [];
      for (const rule of rules) {
        if (rule.checkFn()) {
          currRules.push(rule);
        }
      }
      return (_ctx, _cache) => {
        return e$1.withDirectives((e$1.openBlock(), e$1.createBlock(_sfc_main$d, e$1.mergeProps({ title: "bilibili 页面净化大师", widthPercent: 28, heightPercent: 85, minWidth: 360, minHeight: 600 }, {
          onClose: e$1.unref(store).hide
        }), {
          default: e$1.withCtx(() => [
            (e$1.openBlock(), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(currRules, (rule, i2) => {
              return e$1.createElementVNode("div", { key: i2 }, [
                (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(rule.groups, (group, j2) => {
                  return e$1.openBlock(), e$1.createElementBlock("div", { key: j2 }, [
                    e$1.createVNode(_sfc_main$e, e$1.mergeProps({ ref_for: true }, { title: group.name, isFold: group.fold, isSpecial: rule.isSpecial }), {
                      default: e$1.withCtx(() => [
                        (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(group.items, (item, innerIndex) => {
                          return e$1.openBlock(), e$1.createElementBlock("div", { key: innerIndex }, [
                            item.type === "switch" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$7, e$1.mergeProps({
                              key: 0,
                              ref_for: true
                            }, item), null, 16)) : item.type === "number" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$9, e$1.mergeProps({
                              key: 1,
                              ref_for: true
                            }, item), null, 16)) : item.type === "string" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$8, e$1.mergeProps({
                              key: 2,
                              ref_for: true
                            }, item), null, 16)) : item.type === "editor" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$b, e$1.mergeProps({
                              key: 3,
                              ref_for: true
                            }, item), null, 16)) : item.type === "list" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$a, e$1.mergeProps({
                              key: 4,
                              ref_for: true
                            }, item), null, 16)) : e$1.createCommentVNode("", true)
                          ]);
                        }), 128))
                      ]),
                      _: 2
                    }, 1040)
                  ]);
                }), 128))
              ]);
            }), 64))
          ]),
          _: 1
        }, 16, ["onClose"])), [
          [e$1.vShow, e$1.unref(store).isShow]
        ]);
      };
    }
  });
  const _sfc_main$2 = /* @__PURE__ */ e$1.defineComponent({
    __name: "SideBtnView",
    setup(__props) {
      const ruleStore = useRulePanelStore();
      const videoStore = useVideoFilterPanelStore();
      const commentStore = useCommentFilterPanelStore();
      const dynamicStore = useDynamicFilterPanelStore();
      const sideBtnStore = useSideBtnStore();
      const target = e$1.ref(null);
      const { width, height } = useElementBounding(target, { windowScroll: false });
      const btnPos = useStorage("bili-cleaner-side-btn-pos", { right: 10, bottom: 180 }, localStorage);
      const isDragging = e$1.ref(false);
      const windowSize = useWindowSize({ includeScrollbar: false });
      const maxPos = e$1.computed(() => {
        return {
          x: windowSize.width.value - width.value,
          y: windowSize.height.value - height.value
        };
      });
      let rAF = 0;
      useDraggable(target, {
        initialValue: {
          x: windowSize.width.value - btnPos.value.right,
          y: windowSize.height.value - btnPos.value.bottom
        },
        preventDefault: true,
        handle: e$1.computed(() => target.value),
        onMove: (pos) => {
          isDragging.value = true;
          btnPos.value.right = maxPos.value.x - pos.x;
          btnPos.value.bottom = maxPos.value.y - pos.y;
          cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => {
            if (btnPos.value.right < 0) {
              btnPos.value.right = 0;
            }
            if (btnPos.value.bottom < 0) {
              btnPos.value.bottom = 0;
            }
            if (btnPos.value.bottom > maxPos.value.y) {
              btnPos.value.bottom = maxPos.value.y;
            }
            if (btnPos.value.right > maxPos.value.x) {
              btnPos.value.right = maxPos.value.x;
            }
          });
        },
        onEnd: () => {
          setTimeout(() => {
            isDragging.value = false;
          }, 50);
        }
      });
      return (_ctx, _cache) => {
        return e$1.unref(sideBtnStore).isShow ? (e$1.openBlock(), e$1.createElementBlock("div", {
          key: 0,
          style: e$1.normalizeStyle({ right: e$1.unref(btnPos).right + "px", bottom: e$1.unref(btnPos).bottom + "px" }),
          class: e$1.normalizeClass(["group fixed flex flex-col justify-end text-black text-opacity-50 will-change-[right,bottom] hover:text-opacity-100", {
            "z-[100]": !e$1.unref(isPageLive)(),
            "z-[1000]": e$1.unref(isPageLive)()
          }])
        }, [
          e$1.unref(isPageDynamic)() ? (e$1.openBlock(), e$1.createElementBlock("div", {
            key: 0,
            class: "mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex",
            onClick: _cache[0] || (_cache[0] = ($event) => e$1.unref(dynamicStore).isShow ? e$1.unref(dynamicStore).hide() : e$1.unref(dynamicStore).show())
          }, _cache[4] || (_cache[4] = [
            e$1.createElementVNode("div", null, [
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "动态"),
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "过滤")
            ], -1)
          ]))) : e$1.createCommentVNode("", true),
          e$1.unref(isPageVideo)() || e$1.unref(isPageBangumi)() || e$1.unref(isPagePlaylist)() || e$1.unref(isPageDynamic)() || e$1.unref(isPageSpace)() ? (e$1.openBlock(), e$1.createElementBlock("div", {
            key: 1,
            class: "mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex",
            onClick: _cache[1] || (_cache[1] = ($event) => e$1.unref(commentStore).isShow ? e$1.unref(commentStore).hide() : e$1.unref(commentStore).show())
          }, _cache[5] || (_cache[5] = [
            e$1.createElementVNode("div", null, [
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "评论"),
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "过滤")
            ], -1)
          ]))) : e$1.createCommentVNode("", true),
          e$1.unref(isPageVideo)() || e$1.unref(isPageChannel)() || e$1.unref(isPageHomepage)() || e$1.unref(isPagePlaylist)() || e$1.unref(isPageSearch)() || e$1.unref(isPagePopular)() ? (e$1.openBlock(), e$1.createElementBlock("div", {
            key: 2,
            class: "mt-1 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white group-hover:flex",
            onClick: _cache[2] || (_cache[2] = ($event) => e$1.unref(videoStore).isShow ? e$1.unref(videoStore).hide() : e$1.unref(videoStore).show())
          }, _cache[6] || (_cache[6] = [
            e$1.createElementVNode("div", null, [
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "视频"),
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "过滤")
            ], -1)
          ]))) : e$1.createCommentVNode("", true),
          e$1.createElementVNode("div", {
            ref_key: "target",
            ref: target,
            class: "mt-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white",
            onClick: _cache[3] || (_cache[3] = ($event) => !isDragging.value && (e$1.unref(ruleStore).isShow ? e$1.unref(ruleStore).hide() : e$1.unref(ruleStore).show()))
          }, _cache[7] || (_cache[7] = [
            e$1.createElementVNode("div", null, [
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "页面"),
              e$1.createElementVNode("p", { class: "select-none text-center text-[13px] leading-4" }, "净化")
            ], -1)
          ]), 512)
        ], 6)) : e$1.createCommentVNode("", true);
      };
    }
  });
  const _sfc_main$1 = /* @__PURE__ */ e$1.defineComponent({
    __name: "VideoFilterPanelView",
    setup(__props) {
      const store = useVideoFilterPanelStore();
      let currPageGroups = [];
      for (const videoFilter of videoFilters) {
        if (videoFilter.checkFn()) {
          currPageGroups = [...currPageGroups, ...videoFilter.groups];
        }
      }
      return (_ctx, _cache) => {
        return e$1.withDirectives((e$1.openBlock(), e$1.createBlock(_sfc_main$d, e$1.mergeProps({
          title: "视频过滤",
          widthPercent: 28,
          heightPercent: 85,
          minWidth: 360,
          minHeight: 600
        }, {
          onClose: e$1.unref(store).hide
        }), {
          default: e$1.withCtx(() => [
            (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(e$1.unref(currPageGroups), (group, index) => {
              return e$1.openBlock(), e$1.createElementBlock("div", { key: index }, [
                e$1.createVNode(_sfc_main$e, e$1.mergeProps({ ref_for: true }, { title: group.name, isFold: group.fold }), {
                  default: e$1.withCtx(() => [
                    (e$1.openBlock(true), e$1.createElementBlock(e$1.Fragment, null, e$1.renderList(group.items, (item, innerIndex) => {
                      return e$1.openBlock(), e$1.createElementBlock("div", { key: innerIndex }, [
                        item.type === "switch" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$7, e$1.mergeProps({
                          key: 0,
                          ref_for: true
                        }, item), null, 16)) : item.type === "number" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$9, e$1.mergeProps({
                          key: 1,
                          ref_for: true
                        }, item), null, 16)) : item.type === "string" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$8, e$1.mergeProps({
                          key: 2,
                          ref_for: true
                        }, item), null, 16)) : item.type === "editor" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$b, e$1.mergeProps({
                          key: 3,
                          ref_for: true
                        }, item), null, 16)) : item.type === "list" ? (e$1.openBlock(), e$1.createBlock(_sfc_main$a, e$1.mergeProps({
                          key: 4,
                          ref_for: true
                        }, item), null, 16)) : e$1.createCommentVNode("", true)
                      ]);
                    }), 128))
                  ]),
                  _: 2
                }, 1040)
              ]);
            }), 128))
          ]),
          _: 1
        }, 16, ["onClose"])), [
          [e$1.vShow, e$1.unref(store).isShow]
        ]);
      };
    }
  });
  const _hoisted_1 = { class: "text-base" };
  const _sfc_main = /* @__PURE__ */ e$1.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return e$1.openBlock(), e$1.createElementBlock("div", _hoisted_1, [
          e$1.createVNode(_sfc_main$3),
          e$1.createVNode(_sfc_main$1),
          e$1.createVNode(_sfc_main$6),
          e$1.createVNode(_sfc_main$4),
          e$1.createVNode(_sfc_main$5),
          e$1.createVNode(_sfc_main$2)
        ]);
      };
    }
  });
  const loadModules = () => {
    waitForHead().then(() => {
      loadStyles();
      log("loadStyles done");
    });
    loadRules();
    loadRulesHotKey();
    log("loadRules done");
    loadFilters();
    log("loadFilters done");
  };
  const css = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:host{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1536px){.container{max-width:1536px}}.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-y-0{top:0;bottom:0}.left-0{left:0}.right-0{right:0}.top-0{top:0}.z-10{z-index:10}.z-\\[10000000\\]{z-index:10000000}.z-\\[100000\\]{z-index:100000}.z-\\[1000\\]{z-index:1000}.z-\\[100\\]{z-index:100}.m-0\\.5{margin:2px}.m-1{margin:4px}.mx-2{margin-left:8px;margin-right:8px}.mx-auto{margin-left:auto;margin-right:auto}.my-1{margin-top:4px;margin-bottom:4px}.mb-0\\.5{margin-bottom:2px}.mb-1\\.5{margin-bottom:6px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.ml-2{margin-left:8px}.ml-4{margin-left:16px}.ml-auto{margin-left:auto}.mr-0\\.5{margin-right:2px}.mr-1{margin-right:4px}.mt-1{margin-top:4px}.mt-4{margin-top:16px}.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.contents{display:contents}.list-item{display:list-item}.hidden{display:none}.size-8{width:32px;height:32px}.h-10{height:40px}.h-4{height:16px}.h-5{height:20px}.h-6{height:24px}.h-fit{height:-moz-fit-content;height:fit-content}.max-h-60{max-height:240px}.min-h-\\[calc\\(100\\%-2\\.5rem\\)\\]{min-height:calc(100% - 40px)}.w-1\\/5{width:20%}.w-10{width:40px}.w-11{width:44px}.w-2\\/5{width:40%}.w-24{width:96px}.w-4{width:16px}.w-5{width:20px}.w-6{width:24px}.w-full{width:100%}.flex-1{flex:1 1 0%}.translate-x-1{--tw-translate-x: 4px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-6{--tw-translate-x: 24px;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-180{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-90{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-default{cursor:default}.cursor-move{cursor:move}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.resize-none{resize:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.self-center{align-self:center}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overscroll-none{overscroll-behavior:none}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:8px}.rounded-md{border-radius:6px}.rounded-xl{border-radius:12px}.border{border-width:1px}.border-2{border-width:2px}.border-gray-200{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity, 1))}.border-green-400{--tw-border-opacity: 1;border-color:rgb(74 222 128 / var(--tw-border-opacity, 1))}.border-transparent{border-color:transparent}.bg-\\[\\#00AEEC\\]{--tw-bg-opacity: 1;background-color:rgb(0 174 236 / var(--tw-bg-opacity, 1))}.bg-blue-100{--tw-bg-opacity: 1;background-color:rgb(219 234 254 / var(--tw-bg-opacity, 1))}.bg-blue-100\\/60{background-color:#dbeafe99}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity, 1))}.bg-green-50{--tw-bg-opacity: 1;background-color:rgb(240 253 244 / var(--tw-bg-opacity, 1))}.bg-purple-100{--tw-bg-opacity: 1;background-color:rgb(243 232 255 / var(--tw-bg-opacity, 1))}.bg-purple-100\\/60{background-color:#f3e8ff99}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-1{padding:4px}.p-1\\.5{padding:6px}.p-2{padding:8px}.px-2{padding-left:8px;padding-right:8px}.px-2\\.5{padding-left:10px;padding-right:10px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.py-0\\.5{padding-top:2px;padding-bottom:2px}.py-1{padding-top:4px;padding-bottom:4px}.py-1\\.5{padding-top:6px;padding-bottom:6px}.py-2{padding-top:8px;padding-bottom:8px}.pl-1{padding-left:4px}.pl-10{padding-left:40px}.pl-3{padding-left:12px}.pl-9{padding-left:36px}.pr-2{padding-right:8px}.pr-4{padding-right:16px}.pt-2{padding-top:8px}.text-left{text-align:left}.text-center{text-align:center}.text-\\[13px\\]{font-size:13px}.text-\\[15px\\]{font-size:15px}.text-base{font-size:16px;line-height:24px}.text-lg{font-size:18px;line-height:28px}.text-sm{font-size:14px;line-height:20px}.text-xl{font-size:20px;line-height:28px}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.leading-4{line-height:16px}.leading-6{line-height:24px}.text-black{--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity, 1))}.text-blue-500{--tw-text-opacity: 1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.text-blue-900{--tw-text-opacity: 1;color:rgb(30 58 138 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.text-orange-900{--tw-text-opacity: 1;color:rgb(124 45 18 / var(--tw-text-opacity, 1))}.text-purple-500{--tw-text-opacity: 1;color:rgb(168 85 247 / var(--tw-text-opacity, 1))}.text-purple-600{--tw-text-opacity: 1;color:rgb(147 51 234 / var(--tw-text-opacity, 1))}.text-purple-900{--tw-text-opacity: 1;color:rgb(88 28 135 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.text-opacity-50{--tw-text-opacity: .5}.opacity-0{opacity:0}.opacity-100{opacity:1}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-black\\/20{--tw-shadow-color: rgb(0 0 0 / .2);--tw-shadow: var(--tw-shadow-colored)}.outline-none{outline:2px solid transparent;outline-offset:2px}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-black\\/5{--tw-ring-color: rgb(0 0 0 / .05)}.ring-gray-300{--tw-ring-opacity: 1;--tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity, 1))}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-100{transition-duration:.1s}.duration-200{transition-duration:.2s}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.will-change-\\[right\\,bottom\\]{will-change:right,bottom}.will-change-\\[top\\,left\\]{will-change:top,left}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.invalid\\:border-2:invalid{border-width:2px}.invalid\\:border-red-500:invalid{--tw-border-opacity: 1;border-color:rgb(239 68 68 / var(--tw-border-opacity, 1))}.hover\\:rounded-full:hover{border-radius:9999px}.hover\\:border-none:hover{border-style:none}.hover\\:border-blue-400:hover{--tw-border-opacity: 1;border-color:rgb(96 165 250 / var(--tw-border-opacity, 1))}.hover\\:border-green-400:hover{--tw-border-opacity: 1;border-color:rgb(74 222 128 / var(--tw-border-opacity, 1))}.hover\\:border-red-300:hover{--tw-border-opacity: 1;border-color:rgb(252 165 165 / var(--tw-border-opacity, 1))}.hover\\:bg-\\[\\#00AEEC\\]:hover,.hover\\:bg-\\[\\#00aeec\\]:hover{--tw-bg-opacity: 1;background-color:rgb(0 174 236 / var(--tw-bg-opacity, 1))}.hover\\:bg-blue-100:hover{--tw-bg-opacity: 1;background-color:rgb(219 234 254 / var(--tw-bg-opacity, 1))}.hover\\:bg-blue-50:hover{--tw-bg-opacity: 1;background-color:rgb(239 246 255 / var(--tw-bg-opacity, 1))}.hover\\:bg-green-50:hover{--tw-bg-opacity: 1;background-color:rgb(240 253 244 / var(--tw-bg-opacity, 1))}.hover\\:bg-purple-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 232 255 / var(--tw-bg-opacity, 1))}.hover\\:bg-red-50:hover{--tw-bg-opacity: 1;background-color:rgb(254 242 242 / var(--tw-bg-opacity, 1))}.hover\\:bg-white:hover{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.hover\\:bg-opacity-40:hover{--tw-bg-opacity: .4}.hover\\:bg-opacity-50:hover{--tw-bg-opacity: .5}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.hover\\:text-opacity-100:hover{--tw-text-opacity: 1}.hover\\:ring-blue-500:hover{--tw-ring-opacity: 1;--tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1))}.focus\\:border-gray-400:focus{--tw-border-opacity: 1;border-color:rgb(156 163 175 / var(--tw-border-opacity, 1))}.focus\\:border-gray-500:focus{--tw-border-opacity: 1;border-color:rgb(107 114 128 / var(--tw-border-opacity, 1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:invalid\\:border-red-500:invalid:focus{--tw-border-opacity: 1;border-color:rgb(239 68 68 / var(--tw-border-opacity, 1))}.focus-visible\\:border-indigo-500:focus-visible{--tw-border-opacity: 1;border-color:rgb(99 102 241 / var(--tw-border-opacity, 1))}.focus-visible\\:ring-1:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus-visible\\:ring-gray-500:focus-visible{--tw-ring-opacity: 1;--tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity, 1))}.focus-visible\\:ring-white\\/75:focus-visible{--tw-ring-color: rgb(255 255 255 / .75)}.focus-visible\\:ring-offset-1:focus-visible{--tw-ring-offset-width: 1px}.group:hover .group-hover\\:flex{display:flex}@media (min-width: 640px){.sm\\:text-sm{font-size:14px;line-height:20px}}';
  const main = () => {
    const wrap = document.createElement("div");
    wrap.id = "bili-cleaner";
    const root = wrap.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = css;
    root.appendChild(style);
    waitForBody().then(() => document.body.appendChild(wrap));
    const app = e$1.createApp(_sfc_main);
    app.config.errorHandler = (err, vm, info) => {
      error("Vue:", err);
      error("Component:", vm);
      error("Info:", info);
    };
    const pinia = createPinia();
    app.use(pinia);
    app.mount(
      (() => {
        const node = document.createElement("div");
        root.appendChild(node);
        return node;
      })()
    );
  };
  const menu = () => {
    if (!isPageHomepage() && self !== top) {
      return;
    }
    const ruleStore = useRulePanelStore();
    const videoStore = useVideoFilterPanelStore();
    const commentStore = useCommentFilterPanelStore();
    const dynamicStore = useDynamicFilterPanelStore();
    const sideBtnStore = useSideBtnStore();
    _GM_registerMenuCommand("✅ 页面净化优化", () => {
      ruleStore.isShow ? ruleStore.hide() : ruleStore.show();
    });
    if (isPageHomepage() || isPageVideo() || isPagePlaylist() || isPagePopular() || isPageChannel() || isPageSearch() || isPageSpace()) {
      _GM_registerMenuCommand("✅ 视频过滤设置", () => {
        videoStore.isShow ? videoStore.hide() : videoStore.show();
      });
    } else {
      _GM_registerMenuCommand("🚫 视频过滤设置", () => {
        alert("[bilibili-cleaner] 本页面不支持视频过滤");
      });
    }
    if (isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist()) {
      _GM_registerMenuCommand("✅ 评论过滤设置", () => {
        commentStore.isShow ? commentStore.hide() : commentStore.show();
      });
    } else {
      _GM_registerMenuCommand("🚫 评论过滤设置", () => {
        alert("[bilibili-cleaner] 本页面不支持评论过滤");
      });
    }
    if (isPageDynamic()) {
      _GM_registerMenuCommand("✅ 动态过滤设置", () => {
        dynamicStore.isShow ? dynamicStore.hide() : dynamicStore.show();
      });
    } else {
      _GM_registerMenuCommand("🚫 动态过滤设置", () => {
        alert("[bilibili-cleaner] 本页面不支持动态过滤");
      });
    }
    _GM_registerMenuCommand("⚡ 快捷按钮开关", () => {
      sideBtnStore.isShow ? sideBtnStore.hide() : sideBtnStore.show();
    });
  };
  try {
    log(`script start, mode: ${"production"}, url: ${location.href}`);
    loadModules();
    main();
    menu();
    log(`script end`);
  } catch (err) {
    error("main.ts error", err);
  }

})(Vue);