// ==UserScript==
// @name         bilibili 页面净化大师
// @namespace    http://tampermonkey.net/
// @version      4.5.0
// @author       festoney8
// @description  净化 B站/哔哩哔哩 页面，支持「精简功能、播放器净化、过滤视频、过滤评论、全站黑白名单」，提供 300+ 功能，定制自己的 B 站
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/festoney8/bilibili-cleaner
// @supportURL   https://github.com/festoney8/bilibili-cleaner
// @downloadURL  https://raw.githubusercontent.com/festoney8/bilibili-cleaner/release/bilibili-cleaner.github.user.js
// @updateURL    https://raw.githubusercontent.com/festoney8/bilibili-cleaner/release/bilibili-cleaner.github.user.js
// @match        *://*.bilibili.com/*
// @exclude      *://message.bilibili.com/pages/nav/header_sync
// @exclude      *://message.bilibili.com/pages/nav/index_new_pc_sync
// @exclude      *://data.bilibili.com/*
// @exclude      *://cm.bilibili.com/*
// @exclude      *://shop.bilibili.com/*
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
// @exclude      *://www.bilibili.com/appeal/*
// @require      https://registry.npmmirror.com/vue/3.5.34/files/dist/vue.global.prod.js
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(async function(vue) {
  'use strict';
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	vue = __toESM(vue);
	var _GM_addValueChangeListener = typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0;
	var _GM_deleteValue = typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0;
	var _GM_getValue = typeof GM_getValue != "undefined" ? GM_getValue : void 0;
	var _GM_listValues = typeof GM_listValues != "undefined" ? GM_listValues : void 0;
	var _GM_registerMenuCommand = typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0;
	var _GM_removeValueChangeListener = typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0;
	var _GM_setValue = typeof GM_setValue != "undefined" ? GM_setValue : void 0;
	var _unsafeWindow = typeof unsafeWindow != "undefined" ? unsafeWindow : void 0;
	var IS_CLIENT = typeof window !== "undefined";
	var activePinia;
	var setActivePinia = (pinia) => activePinia = pinia;
	var piniaSymbol = Symbol();
	function isPlainObject(o) {
		return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
	}
	var MutationType;
	(function(MutationType) {
		MutationType["direct"] = "direct";
		MutationType["patchObject"] = "patch object";
		MutationType["patchFunction"] = "patch function";
	})(MutationType || (MutationType = {}));
	var _global$1 = typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null };
	function bom(blob, { autoBom = false } = {}) {
		if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
		return blob;
	}
	function download(url, name, opts) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.responseType = "blob";
		xhr.onload = function() {
			saveAs(xhr.response, name, opts);
		};
		xhr.onerror = function() {
			console.error("could not download file");
		};
		xhr.send();
	}
	function corsEnabled(url) {
		const xhr = new XMLHttpRequest();
		xhr.open("HEAD", url, false);
		try {
			xhr.send();
		} catch (e) {}
		return xhr.status >= 200 && xhr.status <= 299;
	}
	function click(node) {
		try {
			node.dispatchEvent(new MouseEvent("click"));
		} catch (e) {
			const evt = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window,
				detail: 0,
				screenX: 80,
				screenY: 20,
				clientX: 80,
				clientY: 20,
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
				metaKey: false,
				button: 0,
				relatedTarget: null
			});
			node.dispatchEvent(evt);
		}
	}
	var _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
	var isMacOSWebView = /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent);
	var saveAs = !IS_CLIENT ? () => {} : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
	function downloadSaveAs(blob, name = "download", opts) {
		const a = document.createElement("a");
		a.download = name;
		a.rel = "noopener";
		if (typeof blob === "string") {
			a.href = blob;
			if (a.origin !== location.origin) if (corsEnabled(a.href)) download(blob, name, opts);
			else {
				a.target = "_blank";
				click(a);
			}
			else click(a);
		} else {
			a.href = URL.createObjectURL(blob);
			setTimeout(function() {
				URL.revokeObjectURL(a.href);
			}, 4e4);
			setTimeout(function() {
				click(a);
			}, 0);
		}
	}
	function msSaveAs(blob, name = "download", opts) {
		if (typeof blob === "string") if (corsEnabled(blob)) download(blob, name, opts);
		else {
			const a = document.createElement("a");
			a.href = blob;
			a.target = "_blank";
			setTimeout(function() {
				click(a);
			});
		}
		else navigator.msSaveOrOpenBlob(bom(blob, opts), name);
	}
	function fileSaverSaveAs(blob, name, opts, popup) {
		popup = popup || open("", "_blank");
		if (popup) popup.document.title = popup.document.body.innerText = "downloading...";
		if (typeof blob === "string") return download(blob, name, opts);
		const force = blob.type === "application/octet-stream";
		const isSafari = /constructor/i.test(String(_global$1.HTMLElement)) || "safari" in _global$1;
		const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
		if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
			const reader = new FileReader();
			reader.onloadend = function() {
				let url = reader.result;
				if (typeof url !== "string") {
					popup = null;
					throw new Error("Wrong reader.result type");
				}
				url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
				if (popup) popup.location.href = url;
				else location.assign(url);
				popup = null;
			};
			reader.readAsDataURL(blob);
		} else {
			const url = URL.createObjectURL(blob);
			if (popup) popup.location.assign(url);
			else location.href = url;
			popup = null;
			setTimeout(function() {
				URL.revokeObjectURL(url);
			}, 4e4);
		}
	}
	var { assign: assign$1 } = Object;
	function createPinia() {
		const scope = (0, vue.effectScope)(true);
		const state = scope.run(() => (0, vue.ref)({}));
		let _p = [];
		let toBeInstalled = [];
		const pinia = (0, vue.markRaw)({
			install(app) {
				setActivePinia(pinia);
				pinia._a = app;
				app.provide(piniaSymbol, pinia);
				app.config.globalProperties.$pinia = pinia;
				toBeInstalled.forEach((plugin) => _p.push(plugin));
				toBeInstalled = [];
			},
			use(plugin) {
				if (!this._a) toBeInstalled.push(plugin);
				else _p.push(plugin);
				return this;
			},
			_p,
			_a: null,
			_e: scope,
			_s: new Map(),
			state
		});
		return pinia;
	}
	var noop$1 = () => {};
	function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
		subscriptions.add(callback);
		const removeSubscription = () => {
			subscriptions.delete(callback) && onCleanup();
		};
		if (!detached && (0, vue.getCurrentScope)()) (0, vue.onScopeDispose)(removeSubscription);
		return removeSubscription;
	}
	function triggerSubscriptions(subscriptions, ...args) {
		subscriptions.forEach((callback) => {
			callback(...args);
		});
	}
	var fallbackRunWithContext = (fn) => fn();
	var ACTION_MARKER = Symbol();
	var ACTION_NAME = Symbol();
	function mergeReactiveObjects(target, patchToApply) {
		if (target instanceof Map && patchToApply instanceof Map) patchToApply.forEach((value, key) => target.set(key, value));
		else if (target instanceof Set && patchToApply instanceof Set) patchToApply.forEach(target.add, target);
		for (const key in patchToApply) {
			if (!patchToApply.hasOwnProperty(key)) continue;
			const subPatch = patchToApply[key];
			const targetValue = target[key];
			if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !(0, vue.isRef)(subPatch) && !(0, vue.isReactive)(subPatch)) target[key] = mergeReactiveObjects(targetValue, subPatch);
			else target[key] = subPatch;
		}
		return target;
	}
	var skipHydrateSymbol = Symbol();
	function shouldHydrate(obj) {
		return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
	}
	var { assign } = Object;
	function isComputed(o) {
		return !!((0, vue.isRef)(o) && o.effect);
	}
	function createOptionsStore(id, options, pinia, hot) {
		const { state, actions, getters } = options;
		const initialState = pinia.state.value[id];
		let store;
		function setup() {
			if (!initialState && true) pinia.state.value[id] = state ? state() : {};
			return assign((0, vue.toRefs)(pinia.state.value[id]), actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
				computedGetters[name] = (0, vue.markRaw)((0, vue.computed)(() => {
					setActivePinia(pinia);
					const store = pinia._s.get(id);
					return getters[name].call(store, store);
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
		let subscriptions = new Set();
		let actionSubscriptions = new Set();
		let debuggerEvents;
		const initialState = pinia.state.value[$id];
		if (!isOptionsStore && !initialState && true) pinia.state.value[$id] = {};
		(0, vue.ref)({});
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
			(0, vue.nextTick)().then(() => {
				if (activeListener === myListenerId) isListening = true;
			});
			isSyncListening = true;
			triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
		}
		const $reset = isOptionsStore ? function $reset() {
			const { state } = options;
			const newState = state ? state() : {};
			this.$patch(($state) => {
				assign($state, newState);
			});
		} : noop$1;
		function $dispose() {
			scope.stop();
			subscriptions.clear();
			actionSubscriptions.clear();
			pinia._s.delete($id);
		}
		const action = (fn, name = "") => {
			if (ACTION_MARKER in fn) {
				fn[ACTION_NAME] = name;
				return fn;
			}
			const wrappedAction = function() {
				setActivePinia(pinia);
				const args = Array.from(arguments);
				const afterCallbackSet = new Set();
				const onErrorCallbackSet = new Set();
				function after(callback) {
					afterCallbackSet.add(callback);
				}
				function onError(callback) {
					onErrorCallbackSet.add(callback);
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
					ret = fn.apply(this && this.$id === $id ? this : store, args);
				} catch (error) {
					triggerSubscriptions(onErrorCallbackSet, error);
					throw error;
				}
				if (ret instanceof Promise) return ret.then((value) => {
					triggerSubscriptions(afterCallbackSet, value);
					return value;
				}).catch((error) => {
					triggerSubscriptions(onErrorCallbackSet, error);
					return Promise.reject(error);
				});
				triggerSubscriptions(afterCallbackSet, ret);
				return ret;
			};
			wrappedAction[ACTION_MARKER] = true;
			wrappedAction[ACTION_NAME] = name;
			return wrappedAction;
		};
		const store = (0, vue.reactive)({
			_p: pinia,
			$id,
			$onAction: addSubscription.bind(null, actionSubscriptions),
			$patch,
			$reset,
			$subscribe(callback, options = {}) {
				const removeSubscription = addSubscription(subscriptions, callback, options.detached, () => stopWatcher());
				const stopWatcher = scope.run(() => (0, vue.watch)(() => pinia.state.value[$id], (state) => {
					if (options.flush === "sync" ? isSyncListening : isListening) callback({
						storeId: $id,
						type: MutationType.direct,
						events: debuggerEvents
					}, state);
				}, assign({}, $subscribeOptions, options)));
				return removeSubscription;
			},
			$dispose
		});
		pinia._s.set($id, store);
		const setupStore = (pinia._a && pinia._a.runWithContext || fallbackRunWithContext)(() => pinia._e.run(() => (scope = (0, vue.effectScope)()).run(() => setup({ action }))));
		for (const key in setupStore) {
			const prop = setupStore[key];
			if ((0, vue.isRef)(prop) && !isComputed(prop) || (0, vue.isReactive)(prop)) {
				if (!isOptionsStore) {
					if (initialState && shouldHydrate(prop)) if ((0, vue.isRef)(prop)) prop.value = initialState[key];
					else mergeReactiveObjects(prop, initialState[key]);
					pinia.state.value[$id][key] = prop;
				}
			} else if (typeof prop === "function") {
				setupStore[key] = action(prop, key);
				optionsForPlugin.actions[key] = prop;
			}
		}
		assign(store, setupStore);
		assign((0, vue.toRaw)(store), setupStore);
		Object.defineProperty(store, "$state", {
			get: () => pinia.state.value[$id],
			set: (state) => {
				$patch(($state) => {
					assign($state, state);
				});
			}
		});
		pinia._p.forEach((extender) => {
			assign(store, scope.run(() => extender({
				store,
				app: pinia._a,
				pinia,
				options: optionsForPlugin
			})));
		});
		if (initialState && isOptionsStore && options.hydrate) options.hydrate(store.$state, initialState);
		isListening = true;
		isSyncListening = true;
		return store;
	}
	function defineStore(id, setup, setupOptions) {
		let options;
		const isSetupStore = typeof setup === "function";
		options = isSetupStore ? setupOptions : setup;
		function useStore(pinia, hot) {
			const hasContext = (0, vue.hasInjectionContext)();
			pinia = pinia || (hasContext ? (0, vue.inject)(piniaSymbol, null) : null);
			if (pinia) setActivePinia(pinia);
			pinia = activePinia;
			if (!pinia._s.has(id)) if (isSetupStore) createSetupStore(id, setup, options, pinia);
			else createOptionsStore(id, options, pinia);
			return pinia._s.get(id);
		}
		useStore.$id = id;
		return useStore;
	}
	function d$2(u, e, r) {
		let i = (0, vue.ref)(r == null ? void 0 : r.value), f = (0, vue.computed)(() => u.value !== void 0);
		return [(0, vue.computed)(() => f.value ? u.value : i.value), function(t) {
			return f.value || (i.value = t), e == null ? void 0 : e(t);
		}];
	}
	var r$3;
	var n$3 = Symbol("headlessui.useid"), o$4 = 0;
	var i$4 = (r$3 = vue.useId) != null ? r$3 : function() {
		return vue.inject(n$3, () => `${++o$4}`)();
	};
	function o$3(e) {
		var l;
		if (e == null || e.value == null) return null;
		let n = (l = e.value.$el) != null ? l : e.value;
		return n instanceof Node ? n : null;
	}
	function u$5(r, n, ...a) {
		if (r in n) {
			let e = n[r];
			return typeof e == "function" ? e(...a) : e;
		}
		let t = new Error(`Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map((e) => `"${e}"`).join(", ")}.`);
		throw Error.captureStackTrace && Error.captureStackTrace(t, u$5), t;
	}
	var i$3 = Object.defineProperty;
	var d$1 = (t, e, r) => e in t ? i$3(t, e, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: r
	}) : t[e] = r;
	var n$2 = (t, e, r) => (d$1(t, typeof e != "symbol" ? e + "" : e, r), r);
	var s$1 = class {
		constructor() {
			n$2(this, "current", this.detect());
			n$2(this, "currentId", 0);
		}
		set(e) {
			this.current !== e && (this.currentId = 0, this.current = e);
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
	var c$2 = new s$1();
	function i$2(r) {
		if (c$2.isServer) return null;
		if (r instanceof Node) return r.ownerDocument;
		if (r != null && r.hasOwnProperty("value")) {
			let n = o$3(r);
			if (n) return n.ownerDocument;
		}
		return document;
	}
	var c$1 = [
		"[contentEditable=true]",
		"[tabindex]",
		"a[href]",
		"area[href]",
		"button:not([disabled])",
		"iframe",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])"
	].map((e) => `${e}:not([tabindex='-1'])`).join(",");
	var N$2 = ((n) => (n[n.First = 1] = "First", n[n.Previous = 2] = "Previous", n[n.Next = 4] = "Next", n[n.Last = 8] = "Last", n[n.WrapAround = 16] = "WrapAround", n[n.NoScroll = 32] = "NoScroll", n))(N$2 || {}), T$2 = ((o) => (o[o.Error = 0] = "Error", o[o.Overflow = 1] = "Overflow", o[o.Success = 2] = "Success", o[o.Underflow = 3] = "Underflow", o))(T$2 || {}), F = ((t) => (t[t.Previous = -1] = "Previous", t[t.Next = 1] = "Next", t))(F || {});
	var h$1 = ((t) => (t[t.Strict = 0] = "Strict", t[t.Loose = 1] = "Loose", t))(h$1 || {});
	function w$3(e, r = 0) {
		var t;
		return e === ((t = i$2(e)) == null ? void 0 : t.body) ? !1 : u$5(r, {
			[0]() {
				return e.matches(c$1);
			},
			[1]() {
				let l = e;
				for (; l !== null;) {
					if (l.matches(c$1)) return !0;
					l = l.parentElement;
				}
				return !1;
			}
		});
	}
	var y$1 = ((t) => (t[t.Keyboard = 0] = "Keyboard", t[t.Mouse = 1] = "Mouse", t))(y$1 || {});
	typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e) => {
		e.metaKey || e.altKey || e.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
	}, !0), document.addEventListener("click", (e) => {
		e.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
	}, !0));
	["textarea", "input"].join(",");
	function O$1(e, r = (t) => t) {
		return e.slice().sort((t, l) => {
			let o = r(t), i = r(l);
			if (o === null || i === null) return 0;
			let n = o.compareDocumentPosition(i);
			return n & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
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
	function u$4(e, t, n) {
		c$2.isServer || (0, vue.watchEffect)((o) => {
			document.addEventListener(e, t, n), o(() => document.removeEventListener(e, t, n));
		});
	}
	function w$2(e, n, t) {
		c$2.isServer || (0, vue.watchEffect)((o) => {
			window.addEventListener(e, n, t), o(() => window.removeEventListener(e, n, t));
		});
	}
	function w$1(f, m, l = (0, vue.computed)(() => !0)) {
		function a(e, r) {
			if (!l.value || e.defaultPrevented) return;
			let t = r(e);
			if (t === null || !t.getRootNode().contains(t)) return;
			let c = function o(n) {
				return typeof n == "function" ? o(n()) : Array.isArray(n) || n instanceof Set ? n : [n];
			}(f);
			for (let o of c) {
				if (o === null) continue;
				let n = o instanceof HTMLElement ? o : o$3(o);
				if (n != null && n.contains(t) || e.composed && e.composedPath().includes(n)) return;
			}
			return !w$3(t, h$1.Loose) && t.tabIndex !== -1 && e.preventDefault(), m(e, t);
		}
		let u = (0, vue.ref)(null);
		u$4("pointerdown", (e) => {
			var r, t;
			l.value && (u.value = ((t = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : t[0]) || e.target);
		}, !0), u$4("mousedown", (e) => {
			var r, t;
			l.value && (u.value = ((t = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : t[0]) || e.target);
		}, !0), u$4("click", (e) => {
			n$1() || u.value && (a(e, () => u.value), u.value = null);
		}, !0), u$4("touchend", (e) => a(e, () => e.target instanceof HTMLElement ? e.target : null), !0), w$2("blur", (e) => a(e, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), !0);
	}
	function r$2(t, e) {
		if (t) return t;
		let n = e != null ? e : "button";
		if (typeof n == "string" && n.toLowerCase() === "button") return "button";
	}
	function s(t, e) {
		let n = (0, vue.ref)(r$2(t.value.type, t.value.as));
		return (0, vue.onMounted)(() => {
			n.value = r$2(t.value.type, t.value.as);
		}), (0, vue.watchEffect)(() => {
			var u;
			n.value || o$3(e) && o$3(e) instanceof HTMLButtonElement && !((u = o$3(e)) != null && u.hasAttribute("type")) && (n.value = "button");
		}), n;
	}
	function r$1(e) {
		return [e.screenX, e.screenY];
	}
	function u$3() {
		let e = (0, vue.ref)([-1, -1]);
		return {
			wasMoved(n) {
				let t = r$1(n);
				return e.value[0] === t[0] && e.value[1] === t[1] ? !1 : (e.value = t, !0);
			},
			update(n) {
				e.value = r$1(n);
			}
		};
	}
	var N$1 = ((o) => (o[o.None = 0] = "None", o[o.RenderStrategy = 1] = "RenderStrategy", o[o.Static = 2] = "Static", o))(N$1 || {}), S = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(S || {});
	function A$1({ visible: r = !0, features: t = 0, ourProps: e, theirProps: o, ...i }) {
		var a;
		let n = j(o, e), l = Object.assign(i, { props: n });
		if (r || t & 2 && n.static) return y(l);
		if (t & 1) return u$5((a = n.unmount) == null || a ? 0 : 1, {
			[0]() {
				return null;
			},
			[1]() {
				return y({
					...i,
					props: {
						...n,
						hidden: !0,
						style: { display: "none" }
					}
				});
			}
		});
		return y(l);
	}
	function y({ props: r, attrs: t, slots: e, slot: o, name: i }) {
		var m, h$4;
		let { as: n, ...l } = T$1(r, ["unmount", "static"]), a = (m = e.default) == null ? void 0 : m.call(e, o), d = {};
		if (o) {
			let u = !1, c = [];
			for (let [p, f] of Object.entries(o)) typeof f == "boolean" && (u = !0), f === !0 && c.push(p);
			u && (d["data-headlessui-state"] = c.join(" "));
		}
		if (n === "template") {
			if (a = b(a != null ? a : []), Object.keys(l).length > 0 || Object.keys(t).length > 0) {
				let [u, ...c] = a != null ? a : [];
				if (!v(u) || c.length > 0) throw new Error([
					"Passing props on \"template\"!",
					"",
					`The current component <${i} /> is rendering a "template".`,
					"However we need to passthrough the following props:",
					Object.keys(l).concat(Object.keys(t)).map((s) => s.trim()).filter((s, g, R) => R.indexOf(s) === g).sort((s, g) => s.localeCompare(g)).map((s) => `  - ${s}`).join(`
`),
					"",
					"You can apply a few solutions:",
					["Add an `as=\"...\"` prop, to ensure that we render an actual element instead of a \"template\".", "Render a single element as the child so that we can forward the props onto that element."].map((s) => `  - ${s}`).join(`
`)
				].join(`
`));
				let p = j((h$4 = u.props) != null ? h$4 : {}, l, d), f = (0, vue.cloneVNode)(u, p, !0);
				for (let s in p) s.startsWith("on") && (f.props || (f.props = {}), f.props[s] = p[s]);
				return f;
			}
			return Array.isArray(a) && a.length === 1 ? a[0] : a;
		}
		return (0, vue.h)(n, Object.assign({}, l, d), { default: () => a });
	}
	function b(r) {
		return r.flatMap((t) => t.type === vue.Fragment ? b(t.children) : [t]);
	}
	function j(...r) {
		if (r.length === 0) return {};
		if (r.length === 1) return r[0];
		let t = {}, e = {};
		for (let i of r) for (let n in i) n.startsWith("on") && typeof i[n] == "function" ? (e[n] ?? (e[n] = []), e[n].push(i[n])) : t[n] = i[n];
		if (t.disabled || t["aria-disabled"]) return Object.assign(t, Object.fromEntries(Object.keys(e).map((i) => [i, void 0])));
		for (let i in e) Object.assign(t, { [i](n, ...l) {
			let a = e[i];
			for (let d of a) {
				if (n instanceof Event && n.defaultPrevented) return;
				d(n, ...l);
			}
		} });
		return t;
	}
	function E$1(r) {
		let t = Object.assign({}, r);
		for (let e in t) t[e] === void 0 && delete t[e];
		return t;
	}
	function T$1(r, t = []) {
		let e = Object.assign({}, r);
		for (let o of t) o in e && delete e[o];
		return e;
	}
	function v(r) {
		return r == null ? !1 : typeof r.type == "string" || typeof r.type == "object" || typeof r.type == "function";
	}
	var u$2 = ((e) => (e[e.None = 1] = "None", e[e.Focusable = 2] = "Focusable", e[e.Hidden = 4] = "Hidden", e))(u$2 || {});
	var f$2 = (0, vue.defineComponent)({
		name: "Hidden",
		props: {
			as: {
				type: [Object, String],
				default: "div"
			},
			features: {
				type: Number,
				default: 1
			}
		},
		setup(t, { slots: n, attrs: i }) {
			return () => {
				var r;
				let { features: e, ...d } = t;
				return A$1({
					ourProps: {
						"aria-hidden": (e & 2) === 2 ? !0 : (r = d["aria-hidden"]) != null ? r : void 0,
						hidden: (e & 4) === 4 ? !0 : void 0,
						style: {
							position: "fixed",
							top: 1,
							left: 1,
							width: 1,
							height: 0,
							padding: 0,
							margin: -1,
							overflow: "hidden",
							clip: "rect(0, 0, 0, 0)",
							whiteSpace: "nowrap",
							borderWidth: "0",
							...(e & 4) === 4 && (e & 2) !== 2 && { display: "none" }
						}
					},
					theirProps: d,
					slot: {},
					attrs: i,
					slots: n,
					name: "Hidden"
				});
			};
		}
	});
	var n = Symbol("Context");
	var i = ((e) => (e[e.Open = 1] = "Open", e[e.Closed = 2] = "Closed", e[e.Closing = 4] = "Closing", e[e.Opening = 8] = "Opening", e))(i || {});
	function l() {
		return (0, vue.inject)(n, null);
	}
	function t(o) {
		(0, vue.provide)(n, o);
	}
	var o$2 = ((r) => (r.Space = " ", r.Enter = "Enter", r.Escape = "Escape", r.Backspace = "Backspace", r.Delete = "Delete", r.ArrowLeft = "ArrowLeft", r.ArrowUp = "ArrowUp", r.ArrowRight = "ArrowRight", r.ArrowDown = "ArrowDown", r.Home = "Home", r.End = "End", r.PageUp = "PageUp", r.PageDown = "PageDown", r.Tab = "Tab", r))(o$2 || {});
	function u$1(l) {
		throw new Error("Unexpected object: " + l);
	}
	var c = ((i) => (i[i.First = 0] = "First", i[i.Previous = 1] = "Previous", i[i.Next = 2] = "Next", i[i.Last = 3] = "Last", i[i.Specific = 4] = "Specific", i[i.Nothing = 5] = "Nothing", i))(c || {});
	function f$1(l, n) {
		let t = n.resolveItems();
		if (t.length <= 0) return null;
		let r = n.resolveActiveIndex(), s = r != null ? r : -1;
		switch (l.focus) {
			case 0:
				for (let e = 0; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
				return r;
			case 1:
				s === -1 && (s = t.length);
				for (let e = s - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
				return r;
			case 2:
				for (let e = s + 1; e < t.length; ++e) if (!n.resolveDisabled(t[e], e, t)) return e;
				return r;
			case 3:
				for (let e = t.length - 1; e >= 0; --e) if (!n.resolveDisabled(t[e], e, t)) return e;
				return r;
			case 4:
				for (let e = 0; e < t.length; ++e) if (n.resolveId(t[e], e, t) === l.id) return e;
				return r;
			case 5: return null;
			default: u$1(l);
		}
	}
	function e$1(i = {}, s = null, t = []) {
		for (let [r, n] of Object.entries(i)) o$1(t, f(s, r), n);
		return t;
	}
	function f(i, s) {
		return i ? i + "[" + s + "]" : s;
	}
	function o$1(i, s, t) {
		if (Array.isArray(t)) for (let [r, n] of t.entries()) o$1(i, f(s, r.toString()), n);
		else t instanceof Date ? i.push([s, t.toISOString()]) : typeof t == "boolean" ? i.push([s, t ? "1" : "0"]) : typeof t == "string" ? i.push([s, t]) : typeof t == "number" ? i.push([s, `${t}`]) : t == null ? i.push([s, ""]) : e$1(t, s, i);
	}
	function p$1(i) {
		var t, r;
		let s = (t = i == null ? void 0 : i.form) != null ? t : i.closest("form");
		if (s) {
			for (let n of s.elements) if (n !== i && (n.tagName === "INPUT" && n.type === "submit" || n.tagName === "BUTTON" && n.type === "submit" || n.nodeName === "INPUT" && n.type === "image")) {
				n.click();
				return;
			}
			(r = s.requestSubmit) == null || r.call(s);
		}
	}
	var u = Symbol("DescriptionContext");
	function w() {
		let t = (0, vue.inject)(u, null);
		if (t === null) throw new Error("Missing parent");
		return t;
	}
	function k$1({ slot: t = (0, vue.ref)({}), name: o = "Description", props: s = {} } = {}) {
		let e = (0, vue.ref)([]);
		function r(n) {
			return e.value.push(n), () => {
				let i = e.value.indexOf(n);
				i !== -1 && e.value.splice(i, 1);
			};
		}
		return (0, vue.provide)(u, {
			register: r,
			slot: t,
			name: o,
			props: s
		}), (0, vue.computed)(() => e.value.length > 0 ? e.value.join(" ") : void 0);
	}
	(0, vue.defineComponent)({
		name: "Description",
		props: {
			as: {
				type: [Object, String],
				default: "p"
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(t, { attrs: o, slots: s }) {
			var n;
			let e = (n = t.id) != null ? n : `headlessui-description-${i$4()}`, r = w();
			return (0, vue.onMounted)(() => (0, vue.onUnmounted)(r.register(e))), () => {
				let { name: i = "Description", slot: l = (0, vue.ref)({}), props: d = {} } = r, { ...c } = t;
				return A$1({
					ourProps: {
						...Object.entries(d).reduce((a, [g, m]) => Object.assign(a, { [g]: (0, vue.unref)(m) }), {}),
						id: e
					},
					theirProps: c,
					slot: l.value,
					attrs: o,
					slots: s,
					name: i
				});
			};
		}
	});
	var $$1 = ((o) => (o[o.Open = 0] = "Open", o[o.Closed = 1] = "Closed", o))($$1 || {});
	var T = Symbol("DisclosureContext");
	function O(t) {
		let r = (0, vue.inject)(T, null);
		if (r === null) {
			let o = new Error(`<${t} /> is missing a parent <Disclosure /> component.`);
			throw Error.captureStackTrace && Error.captureStackTrace(o, O), o;
		}
		return r;
	}
	var k = Symbol("DisclosurePanelContext");
	function U() {
		return (0, vue.inject)(k, null);
	}
	var N = (0, vue.defineComponent)({
		name: "Disclosure",
		props: {
			as: {
				type: [Object, String],
				default: "template"
			},
			defaultOpen: {
				type: [Boolean],
				default: !1
			}
		},
		setup(t$2, { slots: r, attrs: o }) {
			let s = (0, vue.ref)(t$2.defaultOpen ? 0 : 1), e = (0, vue.ref)(null), i$5 = (0, vue.ref)(null), n = {
				buttonId: (0, vue.ref)(`headlessui-disclosure-button-${i$4()}`),
				panelId: (0, vue.ref)(`headlessui-disclosure-panel-${i$4()}`),
				disclosureState: s,
				panel: e,
				button: i$5,
				toggleDisclosure() {
					s.value = u$5(s.value, {
						[0]: 1,
						[1]: 0
					});
				},
				closeDisclosure() {
					s.value !== 1 && (s.value = 1);
				},
				close(l) {
					n.closeDisclosure();
					(l ? l instanceof HTMLElement ? l : l.value instanceof HTMLElement ? o$3(l) : o$3(n.button) : o$3(n.button))?.focus();
				}
			};
			return (0, vue.provide)(T, n), t((0, vue.computed)(() => u$5(s.value, {
				[0]: i.Open,
				[1]: i.Closed
			}))), () => {
				let { defaultOpen: l, ...a } = t$2;
				return A$1({
					theirProps: a,
					ourProps: {},
					slot: {
						open: s.value === 0,
						close: n.close
					},
					slots: r,
					attrs: o,
					name: "Disclosure"
				});
			};
		}
	}), Q = (0, vue.defineComponent)({
		name: "DisclosureButton",
		props: {
			as: {
				type: [Object, String],
				default: "button"
			},
			disabled: {
				type: [Boolean],
				default: !1
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(t, { attrs: r, slots: o, expose: s$4 }) {
			let e = O("DisclosureButton"), i = U(), n = (0, vue.computed)(() => i === null ? !1 : i.value === e.panelId.value);
			(0, vue.onMounted)(() => {
				n.value || t.id !== null && (e.buttonId.value = t.id);
			}), (0, vue.onUnmounted)(() => {
				n.value || (e.buttonId.value = null);
			});
			let l = (0, vue.ref)(null);
			s$4({
				el: l,
				$el: l
			}), n.value || (0, vue.watchEffect)(() => {
				e.button.value = l.value;
			});
			let a = s((0, vue.computed)(() => ({
				as: t.as,
				type: r.type
			})), l);
			function c() {
				var u;
				t.disabled || (n.value ? (e.toggleDisclosure(), (u = o$3(e.button)) == null || u.focus()) : e.toggleDisclosure());
			}
			function D(u) {
				var S;
				if (!t.disabled) if (n.value) switch (u.key) {
					case o$2.Space:
					case o$2.Enter:
						u.preventDefault(), u.stopPropagation(), e.toggleDisclosure(), (S = o$3(e.button)) == null || S.focus();
						break;
				}
				else switch (u.key) {
					case o$2.Space:
					case o$2.Enter:
						u.preventDefault(), u.stopPropagation(), e.toggleDisclosure();
						break;
				}
			}
			function v(u) {
				switch (u.key) {
					case o$2.Space:
						u.preventDefault();
						break;
				}
			}
			return () => {
				var C;
				let u = { open: e.disclosureState.value === 0 }, { id: S, ...K } = t;
				return A$1({
					ourProps: n.value ? {
						ref: l,
						type: a.value,
						onClick: c,
						onKeydown: D
					} : {
						id: (C = e.buttonId.value) != null ? C : S,
						ref: l,
						type: a.value,
						"aria-expanded": e.disclosureState.value === 0,
						"aria-controls": e.disclosureState.value === 0 || o$3(e.panel) ? e.panelId.value : void 0,
						disabled: t.disabled ? !0 : void 0,
						onClick: c,
						onKeydown: D,
						onKeyup: v
					},
					theirProps: K,
					slot: u,
					attrs: r,
					slots: o,
					name: "DisclosureButton"
				});
			};
		}
	}), V = (0, vue.defineComponent)({
		name: "DisclosurePanel",
		props: {
			as: {
				type: [Object, String],
				default: "div"
			},
			static: {
				type: Boolean,
				default: !1
			},
			unmount: {
				type: Boolean,
				default: !0
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(t, { attrs: r, slots: o, expose: s }) {
			let e = O("DisclosurePanel");
			(0, vue.onMounted)(() => {
				t.id !== null && (e.panelId.value = t.id);
			}), (0, vue.onUnmounted)(() => {
				e.panelId.value = null;
			}), s({
				el: e.panel,
				$el: e.panel
			}), (0, vue.provide)(k, e.panelId);
			let i$6 = l(), n = (0, vue.computed)(() => i$6 !== null ? (i$6.value & i.Open) === i.Open : e.disclosureState.value === 0);
			return () => {
				var v;
				let l = {
					open: e.disclosureState.value === 0,
					close: e.close
				}, { id: a, ...c } = t;
				return A$1({
					ourProps: {
						id: (v = e.panelId.value) != null ? v : a,
						ref: e.panel
					},
					theirProps: c,
					slot: l,
					attrs: r,
					slots: o,
					features: N$1.RenderStrategy | N$1.Static,
					visible: n.value,
					name: "DisclosurePanel"
				});
			};
		}
	});
	var a$2 = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
	function o(e) {
		var r, i;
		let n = (r = e.innerText) != null ? r : "", t = e.cloneNode(!0);
		if (!(t instanceof HTMLElement)) return n;
		let u = !1;
		for (let f of t.querySelectorAll("[hidden],[aria-hidden],[role=\"img\"]")) f.remove(), u = !0;
		let l = u ? (i = t.innerText) != null ? i : "" : n;
		return a$2.test(l) && (l = l.replace(a$2, "")), l;
	}
	function g(e) {
		let n = e.getAttribute("aria-label");
		if (typeof n == "string") return n.trim();
		let t = e.getAttribute("aria-labelledby");
		if (t) {
			let u = t.split(" ").map((l) => {
				let r = document.getElementById(l);
				if (r) {
					let i = r.getAttribute("aria-label");
					return typeof i == "string" ? i.trim() : o(r).trim();
				}
				return null;
			}).filter(Boolean);
			if (u.length > 0) return u.join(", ");
		}
		return o(e).trim();
	}
	function p(a) {
		let t = (0, vue.ref)(""), r = (0, vue.ref)("");
		return () => {
			let e = o$3(a);
			if (!e) return "";
			let l = e.innerText;
			if (t.value === l) return r.value;
			let u = g(e).trim().toLowerCase();
			return t.value = l, r.value = u, u;
		};
	}
	function pe(o, b) {
		return o === b;
	}
	var ce$1 = ((r) => (r[r.Open = 0] = "Open", r[r.Closed = 1] = "Closed", r))(ce$1 || {}), ve = ((r) => (r[r.Single = 0] = "Single", r[r.Multi = 1] = "Multi", r))(ve || {}), be = ((r) => (r[r.Pointer = 0] = "Pointer", r[r.Other = 1] = "Other", r))(be || {});
	function me(o) {
		requestAnimationFrame(() => requestAnimationFrame(o));
	}
	var $ = Symbol("ListboxContext");
	function A(o) {
		let b = (0, vue.inject)($, null);
		if (b === null) {
			let r = new Error(`<${o} /> is missing a parent <Listbox /> component.`);
			throw Error.captureStackTrace && Error.captureStackTrace(r, A), r;
		}
		return b;
	}
	var Ie = (0, vue.defineComponent)({
		name: "Listbox",
		emits: { "update:modelValue": (o) => !0 },
		props: {
			as: {
				type: [Object, String],
				default: "template"
			},
			disabled: {
				type: [Boolean],
				default: !1
			},
			by: {
				type: [String, Function],
				default: () => pe
			},
			horizontal: {
				type: [Boolean],
				default: !1
			},
			modelValue: {
				type: [
					Object,
					String,
					Number,
					Boolean
				],
				default: void 0
			},
			defaultValue: {
				type: [
					Object,
					String,
					Number,
					Boolean
				],
				default: void 0
			},
			form: {
				type: String,
				optional: !0
			},
			name: {
				type: String,
				optional: !0
			},
			multiple: {
				type: [Boolean],
				default: !1
			}
		},
		inheritAttrs: !1,
		setup(o, { slots: b, attrs: r, emit: w }) {
			let n = (0, vue.ref)(1), e = (0, vue.ref)(null), f = (0, vue.ref)(null), v = (0, vue.ref)(null), s = (0, vue.ref)([]), m = (0, vue.ref)(""), p = (0, vue.ref)(null), a = (0, vue.ref)(1);
			function u(t = (i) => i) {
				let i = p.value !== null ? s.value[p.value] : null, l = O$1(t(s.value.slice()), (O) => o$3(O.dataRef.domRef)), d = i ? l.indexOf(i) : null;
				return d === -1 && (d = null), {
					options: l,
					activeOptionIndex: d
				};
			}
			let D = (0, vue.computed)(() => o.multiple ? 1 : 0), [y, L] = d$2((0, vue.computed)(() => o.modelValue), (t) => w("update:modelValue", t), (0, vue.computed)(() => o.defaultValue)), M = (0, vue.computed)(() => y.value === void 0 ? u$5(D.value, {
				[1]: [],
				[0]: void 0
			}) : y.value), k = {
				listboxState: n,
				value: M,
				mode: D,
				compare(t, i) {
					if (typeof o.by == "string") {
						let l = o.by;
						return (t == null ? void 0 : t[l]) === (i == null ? void 0 : i[l]);
					}
					return o.by(t, i);
				},
				orientation: (0, vue.computed)(() => o.horizontal ? "horizontal" : "vertical"),
				labelRef: e,
				buttonRef: f,
				optionsRef: v,
				disabled: (0, vue.computed)(() => o.disabled),
				options: s,
				searchQuery: m,
				activeOptionIndex: p,
				activationTrigger: a,
				closeListbox() {
					o.disabled || n.value !== 1 && (n.value = 1, p.value = null);
				},
				openListbox() {
					o.disabled || n.value !== 0 && (n.value = 0);
				},
				goToOption(t, i, l) {
					if (o.disabled || n.value === 1) return;
					let d = u(), O = f$1(t === c.Specific ? {
						focus: c.Specific,
						id: i
					} : { focus: t }, {
						resolveItems: () => d.options,
						resolveActiveIndex: () => d.activeOptionIndex,
						resolveId: (h) => h.id,
						resolveDisabled: (h) => h.dataRef.disabled
					});
					m.value = "", p.value = O, a.value = l != null ? l : 1, s.value = d.options;
				},
				search(t) {
					if (o.disabled || n.value === 1) return;
					let l = m.value !== "" ? 0 : 1;
					m.value += t.toLowerCase();
					let O = (p.value !== null ? s.value.slice(p.value + l).concat(s.value.slice(0, p.value + l)) : s.value).find((I) => I.dataRef.textValue.startsWith(m.value) && !I.dataRef.disabled), h = O ? s.value.indexOf(O) : -1;
					h === -1 || h === p.value || (p.value = h, a.value = 1);
				},
				clearSearch() {
					o.disabled || n.value !== 1 && m.value !== "" && (m.value = "");
				},
				registerOption(t, i) {
					let l = u((d) => [...d, {
						id: t,
						dataRef: i
					}]);
					s.value = l.options, p.value = l.activeOptionIndex;
				},
				unregisterOption(t) {
					let i = u((l) => {
						let d = l.findIndex((O) => O.id === t);
						return d !== -1 && l.splice(d, 1), l;
					});
					s.value = i.options, p.value = i.activeOptionIndex, a.value = 1;
				},
				theirOnChange(t) {
					o.disabled || L(t);
				},
				select(t) {
					o.disabled || L(u$5(D.value, {
						[0]: () => t,
						[1]: () => {
							let i = (0, vue.toRaw)(k.value.value).slice(), l = (0, vue.toRaw)(t), d = i.findIndex((O) => k.compare(l, (0, vue.toRaw)(O)));
							return d === -1 ? i.push(l) : i.splice(d, 1), i;
						}
					}));
				}
			};
			w$1([f, v], (t, i) => {
				var l;
				k.closeListbox(), w$3(i, h$1.Loose) || (t.preventDefault(), (l = o$3(f)) == null || l.focus());
			}, (0, vue.computed)(() => n.value === 0)), (0, vue.provide)($, k), t((0, vue.computed)(() => u$5(n.value, {
				[0]: i.Open,
				[1]: i.Closed
			})));
			let C = (0, vue.computed)(() => {
				var t;
				return (t = o$3(f)) == null ? void 0 : t.closest("form");
			});
			return (0, vue.onMounted)(() => {
				(0, vue.watch)([C], () => {
					if (!C.value || o.defaultValue === void 0) return;
					function t() {
						k.theirOnChange(o.defaultValue);
					}
					return C.value.addEventListener("reset", t), () => {
						var i;
						(i = C.value) == null || i.removeEventListener("reset", t);
					};
				}, { immediate: !0 });
			}), () => {
				let { name: t, modelValue: i, disabled: l, form: d, ...O } = o, h$3 = {
					open: n.value === 0,
					disabled: l,
					value: M.value
				};
				return (0, vue.h)(vue.Fragment, [...t != null && M.value != null ? e$1({ [t]: M.value }).map(([I, Q]) => (0, vue.h)(f$2, E$1({
					features: u$2.Hidden,
					key: I,
					as: "input",
					type: "hidden",
					hidden: !0,
					readOnly: !0,
					form: d,
					disabled: l,
					name: I,
					value: Q
				}))) : [], A$1({
					ourProps: {},
					theirProps: {
						...r,
						...T$1(O, [
							"defaultValue",
							"onUpdate:modelValue",
							"horizontal",
							"multiple",
							"by"
						])
					},
					slot: h$3,
					slots: b,
					attrs: r,
					name: "Listbox"
				})]);
			};
		}
	});
	(0, vue.defineComponent)({
		name: "ListboxLabel",
		props: {
			as: {
				type: [Object, String],
				default: "label"
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(o, { attrs: b, slots: r }) {
			var f;
			let w = (f = o.id) != null ? f : `headlessui-listbox-label-${i$4()}`, n = A("ListboxLabel");
			function e() {
				var v;
				(v = o$3(n.buttonRef)) == null || v.focus({ preventScroll: !0 });
			}
			return () => {
				let v = {
					open: n.listboxState.value === 0,
					disabled: n.disabled.value
				}, { ...s } = o;
				return A$1({
					ourProps: {
						id: w,
						ref: n.labelRef,
						onClick: e
					},
					theirProps: s,
					slot: v,
					attrs: b,
					slots: r,
					name: "ListboxLabel"
				});
			};
		}
	});
	var je = (0, vue.defineComponent)({
		name: "ListboxButton",
		props: {
			as: {
				type: [Object, String],
				default: "button"
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(o, { attrs: b, slots: r, expose: w }) {
			var p;
			let n = (p = o.id) != null ? p : `headlessui-listbox-button-${i$4()}`, e = A("ListboxButton");
			w({
				el: e.buttonRef,
				$el: e.buttonRef
			});
			function f(a) {
				switch (a.key) {
					case o$2.Space:
					case o$2.Enter:
					case o$2.ArrowDown:
						a.preventDefault(), e.openListbox(), (0, vue.nextTick)(() => {
							var u;
							(u = o$3(e.optionsRef)) == null || u.focus({ preventScroll: !0 }), e.value.value || e.goToOption(c.First);
						});
						break;
					case o$2.ArrowUp:
						a.preventDefault(), e.openListbox(), (0, vue.nextTick)(() => {
							var u;
							(u = o$3(e.optionsRef)) == null || u.focus({ preventScroll: !0 }), e.value.value || e.goToOption(c.Last);
						});
						break;
				}
			}
			function v(a) {
				switch (a.key) {
					case o$2.Space:
						a.preventDefault();
						break;
				}
			}
			function s$3(a) {
				e.disabled.value || (e.listboxState.value === 0 ? (e.closeListbox(), (0, vue.nextTick)(() => {
					var u;
					return (u = o$3(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: !0 });
				})) : (a.preventDefault(), e.openListbox(), me(() => {
					var u;
					return (u = o$3(e.optionsRef)) == null ? void 0 : u.focus({ preventScroll: !0 });
				})));
			}
			let m = s((0, vue.computed)(() => ({
				as: o.as,
				type: b.type
			})), e.buttonRef);
			return () => {
				var y, L;
				let a = {
					open: e.listboxState.value === 0,
					disabled: e.disabled.value,
					value: e.value.value
				}, { ...u } = o;
				return A$1({
					ourProps: {
						ref: e.buttonRef,
						id: n,
						type: m.value,
						"aria-haspopup": "listbox",
						"aria-controls": (y = o$3(e.optionsRef)) == null ? void 0 : y.id,
						"aria-expanded": e.listboxState.value === 0,
						"aria-labelledby": e.labelRef.value ? [(L = o$3(e.labelRef)) == null ? void 0 : L.id, n].join(" ") : void 0,
						disabled: e.disabled.value === !0 ? !0 : void 0,
						onKeydown: f,
						onKeyup: v,
						onClick: s$3
					},
					theirProps: u,
					slot: a,
					attrs: b,
					slots: r,
					name: "ListboxButton"
				});
			};
		}
	}), Ae = (0, vue.defineComponent)({
		name: "ListboxOptions",
		props: {
			as: {
				type: [Object, String],
				default: "ul"
			},
			static: {
				type: Boolean,
				default: !1
			},
			unmount: {
				type: Boolean,
				default: !0
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(o, { attrs: b, slots: r, expose: w }) {
			var p;
			let n = (p = o.id) != null ? p : `headlessui-listbox-options-${i$4()}`, e = A("ListboxOptions"), f = (0, vue.ref)(null);
			w({
				el: e.optionsRef,
				$el: e.optionsRef
			});
			function v(a) {
				switch (f.value && clearTimeout(f.value), a.key) {
					case o$2.Space: if (e.searchQuery.value !== "") return a.preventDefault(), a.stopPropagation(), e.search(a.key);
					case o$2.Enter:
						if (a.preventDefault(), a.stopPropagation(), e.activeOptionIndex.value !== null) {
							let u = e.options.value[e.activeOptionIndex.value];
							e.select(u.dataRef.value);
						}
						e.mode.value === 0 && (e.closeListbox(), (0, vue.nextTick)(() => {
							var u;
							return (u = o$3(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: !0 });
						}));
						break;
					case u$5(e.orientation.value, {
						vertical: o$2.ArrowDown,
						horizontal: o$2.ArrowRight
					}): return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Next);
					case u$5(e.orientation.value, {
						vertical: o$2.ArrowUp,
						horizontal: o$2.ArrowLeft
					}): return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Previous);
					case o$2.Home:
					case o$2.PageUp: return a.preventDefault(), a.stopPropagation(), e.goToOption(c.First);
					case o$2.End:
					case o$2.PageDown: return a.preventDefault(), a.stopPropagation(), e.goToOption(c.Last);
					case o$2.Escape:
						a.preventDefault(), a.stopPropagation(), e.closeListbox(), (0, vue.nextTick)(() => {
							var u;
							return (u = o$3(e.buttonRef)) == null ? void 0 : u.focus({ preventScroll: !0 });
						});
						break;
					case o$2.Tab:
						a.preventDefault(), a.stopPropagation();
						break;
					default:
						a.key.length === 1 && (e.search(a.key), f.value = setTimeout(() => e.clearSearch(), 350));
						break;
				}
			}
			let s = l(), m = (0, vue.computed)(() => s !== null ? (s.value & i.Open) === i.Open : e.listboxState.value === 0);
			return () => {
				var y, L;
				let a = { open: e.listboxState.value === 0 }, { ...u } = o;
				return A$1({
					ourProps: {
						"aria-activedescendant": e.activeOptionIndex.value === null || (y = e.options.value[e.activeOptionIndex.value]) == null ? void 0 : y.id,
						"aria-multiselectable": e.mode.value === 1 ? !0 : void 0,
						"aria-labelledby": (L = o$3(e.buttonRef)) == null ? void 0 : L.id,
						"aria-orientation": e.orientation.value,
						id: n,
						onKeydown: v,
						role: "listbox",
						tabIndex: 0,
						ref: e.optionsRef
					},
					theirProps: u,
					slot: a,
					attrs: b,
					slots: r,
					features: N$1.RenderStrategy | N$1.Static,
					visible: m.value,
					name: "ListboxOptions"
				});
			};
		}
	}), Fe = (0, vue.defineComponent)({
		name: "ListboxOption",
		props: {
			as: {
				type: [Object, String],
				default: "li"
			},
			value: { type: [
				Object,
				String,
				Number,
				Boolean
			] },
			disabled: {
				type: Boolean,
				default: !1
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(o, { slots: b, attrs: r, expose: w }) {
			var C;
			let n = (C = o.id) != null ? C : `headlessui-listbox-option-${i$4()}`, e = A("ListboxOption"), f = (0, vue.ref)(null);
			w({
				el: f,
				$el: f
			});
			let v = (0, vue.computed)(() => e.activeOptionIndex.value !== null ? e.options.value[e.activeOptionIndex.value].id === n : !1), s = (0, vue.computed)(() => u$5(e.mode.value, {
				[0]: () => e.compare((0, vue.toRaw)(e.value.value), (0, vue.toRaw)(o.value)),
				[1]: () => (0, vue.toRaw)(e.value.value).some((t) => e.compare((0, vue.toRaw)(t), (0, vue.toRaw)(o.value)))
			})), m = (0, vue.computed)(() => u$5(e.mode.value, {
				[1]: () => {
					var i;
					let t = (0, vue.toRaw)(e.value.value);
					return ((i = e.options.value.find((l) => t.some((d) => e.compare((0, vue.toRaw)(d), (0, vue.toRaw)(l.dataRef.value))))) == null ? void 0 : i.id) === n;
				},
				[0]: () => s.value
			})), p$2 = p(f), a = (0, vue.computed)(() => ({
				disabled: o.disabled,
				value: o.value,
				get textValue() {
					return p$2();
				},
				domRef: f
			}));
			(0, vue.onMounted)(() => e.registerOption(n, a)), (0, vue.onUnmounted)(() => e.unregisterOption(n)), (0, vue.onMounted)(() => {
				(0, vue.watch)([e.listboxState, s], () => {
					e.listboxState.value === 0 && s.value && u$5(e.mode.value, {
						[1]: () => {
							m.value && e.goToOption(c.Specific, n);
						},
						[0]: () => {
							e.goToOption(c.Specific, n);
						}
					});
				}, { immediate: !0 });
			}), (0, vue.watchEffect)(() => {
				e.listboxState.value === 0 && v.value && e.activationTrigger.value !== 0 && (0, vue.nextTick)(() => {
					var t, i;
					return (i = (t = o$3(f)) == null ? void 0 : t.scrollIntoView) == null ? void 0 : i.call(t, { block: "nearest" });
				});
			});
			function u(t) {
				if (o.disabled) return t.preventDefault();
				e.select(o.value), e.mode.value === 0 && (e.closeListbox(), (0, vue.nextTick)(() => {
					var i;
					return (i = o$3(e.buttonRef)) == null ? void 0 : i.focus({ preventScroll: !0 });
				}));
			}
			function D() {
				if (o.disabled) return e.goToOption(c.Nothing);
				e.goToOption(c.Specific, n);
			}
			let y = u$3();
			function L(t) {
				y.update(t);
			}
			function M(t) {
				y.wasMoved(t) && (o.disabled || v.value || e.goToOption(c.Specific, n, 0));
			}
			function k(t) {
				y.wasMoved(t) && (o.disabled || v.value && e.goToOption(c.Nothing));
			}
			return () => {
				let { disabled: t } = o, i = {
					active: v.value,
					selected: s.value,
					disabled: t
				}, { value: l, disabled: d, ...O } = o;
				return A$1({
					ourProps: {
						id: n,
						ref: f,
						role: "option",
						tabIndex: t === !0 ? void 0 : -1,
						"aria-disabled": t === !0 ? !0 : void 0,
						"aria-selected": s.value,
						disabled: void 0,
						onClick: u,
						onFocus: D,
						onPointerenter: L,
						onMouseenter: L,
						onPointermove: M,
						onMousemove: M,
						onPointerleave: k,
						onMouseleave: k
					},
					theirProps: O,
					slot: i,
					attrs: r,
					slots: b,
					name: "ListboxOption"
				});
			};
		}
	});
	var a$1 = Symbol("LabelContext");
	function d() {
		let t = (0, vue.inject)(a$1, null);
		if (t === null) {
			let n = new Error("You used a <Label /> component, but it is not inside a parent.");
			throw Error.captureStackTrace && Error.captureStackTrace(n, d), n;
		}
		return t;
	}
	function E({ slot: t = {}, name: n = "Label", props: i = {} } = {}) {
		let e = (0, vue.ref)([]);
		function o(r) {
			return e.value.push(r), () => {
				let l = e.value.indexOf(r);
				l !== -1 && e.value.splice(l, 1);
			};
		}
		return (0, vue.provide)(a$1, {
			register: o,
			slot: t,
			name: n,
			props: i
		}), (0, vue.computed)(() => e.value.length > 0 ? e.value.join(" ") : void 0);
	}
	var K = (0, vue.defineComponent)({
		name: "Label",
		props: {
			as: {
				type: [Object, String],
				default: "label"
			},
			passive: {
				type: [Boolean],
				default: !1
			},
			id: {
				type: String,
				default: null
			}
		},
		setup(t, { slots: n, attrs: i }) {
			var r;
			let e = (r = t.id) != null ? r : `headlessui-label-${i$4()}`, o = d();
			return (0, vue.onMounted)(() => (0, vue.onUnmounted)(o.register(e))), () => {
				let { name: l = "Label", slot: p = {}, props: c = {} } = o, { passive: f, ...s } = t, u = {
					...Object.entries(c).reduce((b, [g, m]) => Object.assign(b, { [g]: (0, vue.unref)(m) }), {}),
					id: e
				};
				return f && (delete u.onClick, delete u.htmlFor, delete s.onClick), A$1({
					ourProps: u,
					theirProps: s,
					slot: p,
					attrs: i,
					slots: n,
					name: l
				});
			};
		}
	}), C = Symbol("GroupContext"), oe = (0, vue.defineComponent)({
		name: "SwitchGroup",
		props: { as: {
			type: [Object, String],
			default: "template"
		} },
		setup(l, { slots: c, attrs: i }) {
			let r = (0, vue.ref)(null);
			return (0, vue.provide)(C, {
				switchRef: r,
				labelledby: E({
					name: "SwitchLabel",
					props: {
						htmlFor: (0, vue.computed)(() => {
							var t;
							return (t = r.value) == null ? void 0 : t.id;
						}),
						onClick(t) {
							r.value && (t.currentTarget.tagName === "LABEL" && t.preventDefault(), r.value.click(), r.value.focus({ preventScroll: !0 }));
						}
					}
				}),
				describedby: k$1({ name: "SwitchDescription" })
			}), () => A$1({
				theirProps: l,
				ourProps: {},
				slot: {},
				slots: c,
				attrs: i,
				name: "SwitchGroup"
			});
		}
	}), ue = (0, vue.defineComponent)({
		name: "Switch",
		emits: { "update:modelValue": (l) => !0 },
		props: {
			as: {
				type: [Object, String],
				default: "button"
			},
			modelValue: {
				type: Boolean,
				default: void 0
			},
			defaultChecked: {
				type: Boolean,
				optional: !0
			},
			form: {
				type: String,
				optional: !0
			},
			name: {
				type: String,
				optional: !0
			},
			value: {
				type: String,
				optional: !0
			},
			id: {
				type: String,
				default: null
			},
			disabled: {
				type: Boolean,
				default: !1
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		inheritAttrs: !1,
		setup(l, { emit: c, attrs: i, slots: r, expose: f }) {
			var h$2;
			let p = (h$2 = l.id) != null ? h$2 : `headlessui-switch-${i$4()}`, n = (0, vue.inject)(C, null), [t, s$2] = d$2((0, vue.computed)(() => l.modelValue), (e) => c("update:modelValue", e), (0, vue.computed)(() => l.defaultChecked));
			function m() {
				s$2(!t.value);
			}
			let E = (0, vue.ref)(null), o = n === null ? E : n.switchRef, L = s((0, vue.computed)(() => ({
				as: l.as,
				type: i.type
			})), o);
			f({
				el: o,
				$el: o
			});
			function D(e) {
				e.preventDefault(), m();
			}
			function R(e) {
				e.key === o$2.Space ? (e.preventDefault(), m()) : e.key === o$2.Enter && p$1(e.currentTarget);
			}
			function x(e) {
				e.preventDefault();
			}
			let d = (0, vue.computed)(() => {
				var e, a;
				return (a = (e = o$3(o)) == null ? void 0 : e.closest) == null ? void 0 : a.call(e, "form");
			});
			return (0, vue.onMounted)(() => {
				(0, vue.watch)([d], () => {
					if (!d.value || l.defaultChecked === void 0) return;
					function e() {
						s$2(l.defaultChecked);
					}
					return d.value.addEventListener("reset", e), () => {
						var a;
						(a = d.value) == null || a.removeEventListener("reset", e);
					};
				}, { immediate: !0 });
			}), () => {
				let { name: e, value: a, form: K, tabIndex: y, ...b } = l, T = { checked: t.value }, B = {
					id: p,
					ref: o,
					role: "switch",
					type: L.value,
					tabIndex: y === -1 ? 0 : y,
					"aria-checked": t.value,
					"aria-labelledby": n == null ? void 0 : n.labelledby.value,
					"aria-describedby": n == null ? void 0 : n.describedby.value,
					onClick: D,
					onKeyup: R,
					onKeypress: x
				};
				return (0, vue.h)(vue.Fragment, [e != null && t.value != null ? (0, vue.h)(f$2, E$1({
					features: u$2.Hidden,
					as: "input",
					type: "checkbox",
					hidden: !0,
					readOnly: !0,
					checked: t.value,
					form: K,
					disabled: b.disabled,
					name: e,
					value: a
				})) : null, A$1({
					ourProps: B,
					theirProps: {
						...i,
						...T$1(b, ["modelValue", "defaultChecked"])
					},
					slot: T,
					attrs: i,
					slots: r,
					name: "Switch"
				})]);
			};
		}
	}), de = K;
	function render$2(_ctx, _cache) {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			"aria-hidden": "true",
			"data-slot": "icon"
		}, [(0, vue.createElementVNode)("path", {
			"fill-rule": "evenodd",
			d: "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
			"clip-rule": "evenodd"
		})]);
	}
	function render$1(_ctx, _cache) {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			"aria-hidden": "true",
			"data-slot": "icon"
		}, [(0, vue.createElementVNode)("path", {
			"fill-rule": "evenodd",
			d: "M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z",
			"clip-rule": "evenodd"
		})]);
	}
	function render(_ctx, _cache) {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			"aria-hidden": "true",
			"data-slot": "icon"
		}, [(0, vue.createElementVNode)("path", {
			"fill-rule": "evenodd",
			d: "M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z",
			"clip-rule": "evenodd"
		})]);
	}
	var _hoisted_1$11 = { class: "mx-auto w-full bg-white p-1.5" };
	var DisclosureComp_default = (0, vue.defineComponent)({
		__name: "DisclosureComp",
		props: {
			title: {},
			isFold: { type: Boolean },
			isSpecial: { type: Boolean }
		},
		setup(__props) {
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$11, [(0, vue.createVNode)((0, vue.unref)(N), { "default-open": !__props.isFold }, {
					default: (0, vue.withCtx)(({ open }) => [(0, vue.createVNode)((0, vue.unref)(Q), { class: (0, vue.normalizeClass)(["flex w-full justify-between rounded-lg px-4 py-1.5 text-left font-bold outline-hidden", {
						"bg-blue-100/60 text-blue-900 hover:bg-blue-100": !__props.isSpecial,
						"bg-purple-100/60 text-purple-900 hover:bg-purple-100": __props.isSpecial
					}]) }, {
						default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(__props.title || "Disclosure Title"), 1), (0, vue.createVNode)((0, vue.unref)(render), { class: (0, vue.normalizeClass)([{
							"rotate-180 transition-transform": open,
							"rotate-90 transition-transform": !open,
							"text-blue-500": !__props.isSpecial,
							"text-purple-500": __props.isSpecial
						}, "h-6 w-6"]) }, null, 8, ["class"])]),
						_: 2
					}, 1032, ["class"]), (0, vue.createVNode)((0, vue.unref)(V), {
						unmount: false,
						class: "pt-2 pr-2 pl-3 text-gray-500"
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.renderSlot)(_ctx.$slots, "default")]),
						_: 3
					})]),
					_: 3
				}, 8, ["default-open"])]);
			};
		}
	});
	var config_default = {
		isDebugMode: _GM_getValue("debug-mode") === true || false,
		filterVisitSign: "bili-cleaner-filtered",
		filterHideSign: "bili-cleaner-hide"
	};
	var startTime = performance.now();
	var lastTime = startTime;
	var currTime = startTime;
	var wrapper = (loggingFunc) => {
		return (...innerArgs) => {
			currTime = performance.now();
			loggingFunc(`[bili-cleaner] ${(currTime - lastTime).toFixed(1)} / ${currTime.toFixed(0)} ms |`, ...innerArgs);
			lastTime = currTime;
		};
	};
	var logger = {
		log: wrapper(console.log),
		info: wrapper(console.info),
		error: wrapper(console.error),
		debug: config_default.isDebugMode ? wrapper(console.debug) : () => {}
	};
	var bvidPattern = /(BV[1-9A-HJ-NP-Za-km-z]+)/;
	var matchBvid = (s) => {
		return bvidPattern.exec(s)?.[1] ?? null;
	};
	var avidbvidPattern = /(av\d+|BV[1-9A-HJ-NP-Za-km-z]+)/;
	var matchAvidBvid = (s) => {
		return avidbvidPattern.exec(s)?.[1] ?? null;
	};
	var convertTimeToSec = (timeStr) => {
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
	var convertDateToDays = (dateStr) => {
		if (dateStr.includes("小时前")) return 0;
		dateStr = dateStr.replace("·", "").trim();
		if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
			const [month, day] = dateStr.split("-").map(Number);
			let target = new Date(new Date().getFullYear(), month - 1, day).getTime();
			const today = new Date().getTime();
			if (target > today) target = new Date(new Date().getFullYear() - 1, month - 1, day).getTime();
			return (today - target) / 864e5;
		}
		if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
			const [year, month, day] = dateStr.split("-").map(Number);
			const target = new Date(year, month - 1, day).getTime();
			return (new Date().getTime() - target) / 864e5;
		}
		return 0;
	};
	var calcQuality = (ratio) => {
		const A = -9.881;
		const B = .6463;
		const C = .3829;
		const D = 168.6;
		const ans = (A - D) / (1 + Math.pow(ratio / C, B)) + D;
		return ans > 0 ? ans : 0;
	};
	var hideEle = (ele, hideMode) => {
		if (hideMode === "sign") ele.setAttribute(config_default.filterHideSign, "");
		else ele.style.setProperty("display", "none", "important");
	};
	var showEle = (ele, hideMode) => {
		if (hideMode === "sign") ele.removeAttribute(config_default.filterHideSign);
		else ele.style.removeProperty("display");
	};
	var isEleHide = (ele, hideMode) => {
		if (hideMode === "sign") return ele.hasAttribute(config_default.filterHideSign);
		return ele.style.display === "none";
	};
	var waitForEle = async (watchEle, selector, isTargetNode) => {
		if (!selector) return null;
		let ele = watchEle.querySelector(selector);
		if (ele) return ele;
		return await new Promise((resolve) => {
			const observer = new MutationObserver((mutationList) => {
				mutationList.forEach((mutation) => {
					if (mutation.addedNodes) mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && isTargetNode(node)) {
							observer.disconnect();
							ele = watchEle.querySelector(selector);
							resolve(ele);
						}
					});
				});
			});
			observer.observe(watchEle, {
				childList: true,
				subtree: true
			});
		});
	};
	var orderedUniq = (arr) => {
		return Array.from(new Set(arr));
	};
	var toHalfWidth = (s) => {
		return s.replace(/\u3000/g, " ").replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248));
	};
	var playerGoTo = (mode) => {
		const map = {
			normal: 0,
			wide: 1,
			web: 2,
			mini: 3,
			full: 4,
			pip: 5
		};
		if (typeof _unsafeWindow.player?.requestStatue === "function") _unsafeWindow.player.requestStatue(map[mode]).catch((err) => {
			logger.error(`Failed to switch player mode to ${mode}:`, err);
		});
	};
	function tryOnScopeDispose(fn, failSilently) {
		if ((0, vue.getCurrentScope)()) {
			(0, vue.onScopeDispose)(fn, failSilently);
			return true;
		}
		return false;
	}
	var localProvidedStateMap = new WeakMap();
	var injectLocal = (...args) => {
		var _getCurrentInstance;
		const key = args[0];
		const instance = (_getCurrentInstance = (0, vue.getCurrentInstance)()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
		const owner = instance !== null && instance !== void 0 ? instance : (0, vue.getCurrentScope)();
		if (owner == null && !(0, vue.hasInjectionContext)()) throw new Error("injectLocal must be called in setup");
		if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
		return (0, vue.inject)(...args);
	};
	var isClient = typeof window !== "undefined" && typeof document !== "undefined";
	typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
	var notNullish = (val) => val != null;
	var toString = Object.prototype.toString;
	var isObject = (val) => toString.call(val) === "[object Object]";
	var noop = () => {};
	function toRef$1(...args) {
		if (args.length !== 1) return (0, vue.toRef)(...args);
		const r = args[0];
		return typeof r === "function" ? (0, vue.readonly)((0, vue.customRef)(() => ({
			get: r,
			set: noop
		}))) : (0, vue.ref)(r);
	}
	function createFilterWrapper(filter, fn) {
		function wrapper(...args) {
			return new Promise((resolve, reject) => {
				Promise.resolve(filter(() => fn.apply(this, args), {
					fn,
					thisArg: this,
					args
				})).then(resolve).catch(reject);
			});
		}
		return wrapper;
	}
	var bypassFilter = (invoke) => {
		return invoke();
	};
	function debounceFilter(ms, options = {}) {
		let timer;
		let maxTimer;
		let lastRejector = noop;
		const _clearTimeout = (timer) => {
			clearTimeout(timer);
			lastRejector();
			lastRejector = noop;
		};
		let lastInvoker;
		const filter = (invoke) => {
			const duration = (0, vue.toValue)(ms);
			const maxDuration = (0, vue.toValue)(options.maxWait);
			if (timer) _clearTimeout(timer);
			if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
				if (maxTimer) {
					_clearTimeout(maxTimer);
					maxTimer = void 0;
				}
				return Promise.resolve(invoke());
			}
			return new Promise((resolve, reject) => {
				lastRejector = options.rejectOnCancel ? reject : resolve;
				lastInvoker = invoke;
				if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
					if (timer) _clearTimeout(timer);
					maxTimer = void 0;
					resolve(lastInvoker());
				}, maxDuration);
				timer = setTimeout(() => {
					if (maxTimer) _clearTimeout(maxTimer);
					maxTimer = void 0;
					resolve(invoke());
				}, duration);
			});
		};
		return filter;
	}
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
		if (!(0, vue.isRef)(args[0]) && typeof args[0] === "object") ({delay: ms, trailing = true, leading = true, rejectOnCancel = false} = args[0]);
		else [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
		const clear = () => {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
				lastRejector();
				lastRejector = noop;
			}
		};
		const filter = (_invoke) => {
			const duration = (0, vue.toValue)(ms);
			const elapsed = Date.now() - lastExec;
			const invoke = () => {
				return lastValue = _invoke();
			};
			clear();
			if (duration <= 0) {
				lastExec = Date.now();
				return invoke();
			}
			if (elapsed > duration) {
				lastExec = Date.now();
				if (leading || !isLeading) invoke();
			} else if (trailing) lastValue = new Promise((resolve, reject) => {
				lastRejector = rejectOnCancel ? reject : resolve;
				timer = setTimeout(() => {
					lastExec = Date.now();
					isLeading = true;
					resolve(invoke());
					clear();
				}, Math.max(0, duration - elapsed));
			});
			if (!leading && !timer) timer = setTimeout(() => isLeading = true, duration);
			isLeading = false;
			return lastValue;
		};
		return filter;
	}
	function pausableFilter(extendFilter = bypassFilter, options = {}) {
		const { initialState = "active" } = options;
		const isActive = toRef$1(initialState === "active");
		function pause() {
			isActive.value = false;
		}
		function resume() {
			isActive.value = true;
		}
		const eventFilter = (...args) => {
			if (isActive.value) extendFilter(...args);
		};
		return {
			isActive: (0, vue.shallowReadonly)(isActive),
			pause,
			resume,
			eventFilter
		};
	}
	function pxValue(px) {
		return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
	}
	function toArray(value) {
		return Array.isArray(value) ? value : [value];
	}
	function getLifeCycleTarget(target) {
		return target || (0, vue.getCurrentInstance)();
	}
	function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
		return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
	}
	function watchWithFilter(source, cb, options = {}) {
		const { eventFilter = bypassFilter, ...watchOptions } = options;
		return (0, vue.watch)(source, createFilterWrapper(eventFilter, cb), watchOptions);
	}
	function watchPausable(source, cb, options = {}) {
		const { eventFilter: filter, initialState = "active", ...watchOptions } = options;
		const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
		return {
			stop: watchWithFilter(source, cb, {
				...watchOptions,
				eventFilter
			}),
			pause,
			resume,
			isActive
		};
	}
	function toRefs$1(objectRef, options = {}) {
		if (!(0, vue.isRef)(objectRef)) return (0, vue.toRefs)(objectRef);
		const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
		for (const key in objectRef.value) result[key] = (0, vue.customRef)(() => ({
			get() {
				return objectRef.value[key];
			},
			set(v) {
				var _toValue;
				if ((_toValue = (0, vue.toValue)(options.replaceRef)) !== null && _toValue !== void 0 ? _toValue : true) if (Array.isArray(objectRef.value)) {
					const copy = [...objectRef.value];
					copy[key] = v;
					objectRef.value = copy;
				} else {
					const newObject = {
						...objectRef.value,
						[key]: v
					};
					Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
					objectRef.value = newObject;
				}
				else objectRef.value[key] = v;
			}
		}));
		return result;
	}
	function tryOnMounted(fn, sync = true, target) {
		if (getLifeCycleTarget(target)) (0, vue.onMounted)(fn, target);
		else if (sync) fn();
		else (0, vue.nextTick)(fn);
	}
	function watchDebounced(source, cb, options = {}) {
		const { debounce = 0, maxWait = void 0, ...watchOptions } = options;
		return watchWithFilter(source, cb, {
			...watchOptions,
			eventFilter: debounceFilter(debounce, { maxWait })
		});
	}
	function watchImmediate(source, cb, options) {
		return (0, vue.watch)(source, cb, {
			...options,
			immediate: true
		});
	}
	function watchThrottled(source, cb, options = {}) {
		const { throttle = 0, trailing = true, leading = true, ...watchOptions } = options;
		return watchWithFilter(source, cb, {
			...watchOptions,
			eventFilter: throttleFilter(throttle, trailing, leading)
		});
	}
	var defaultWindow = isClient ? window : void 0;
	isClient && window.document;
	isClient && window.navigator;
	isClient && window.location;
	function unrefElement(elRef) {
		var _$el;
		const plain = (0, vue.toValue)(elRef);
		return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
	}
	function useEventListener(...args) {
		const register = (el, event, listener, options) => {
			el.addEventListener(event, listener, options);
			return () => el.removeEventListener(event, listener, options);
		};
		const firstParamTargets = (0, vue.computed)(() => {
			const test = toArray((0, vue.toValue)(args[0])).filter((e) => e != null);
			return test.every((e) => typeof e !== "string") ? test : void 0;
		});
		return watchImmediate(() => {
			var _firstParamTargets$va, _firstParamTargets$va2;
			return [
				(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
				toArray((0, vue.toValue)(firstParamTargets.value ? args[1] : args[0])),
				toArray((0, vue.unref)(firstParamTargets.value ? args[2] : args[1])),
				(0, vue.toValue)(firstParamTargets.value ? args[3] : args[2])
			];
		}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
			if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
			const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
			const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
			onCleanup(() => {
				cleanups.forEach((fn) => fn());
			});
		}, { flush: "post" });
	}
	function useMounted() {
		const isMounted = (0, vue.shallowRef)(false);
		const instance = (0, vue.getCurrentInstance)();
		if (instance) (0, vue.onMounted)(() => {
			isMounted.value = true;
		}, instance);
		return isMounted;
	}
	function useSupported(callback) {
		const isMounted = useMounted();
		return (0, vue.computed)(() => {
			isMounted.value;
			return Boolean(callback());
		});
	}
	function useMutationObserver(target, callback, options = {}) {
		const { window = defaultWindow, ...mutationOptions } = options;
		let observer;
		const isSupported = useSupported(() => window && "MutationObserver" in window);
		const cleanup = () => {
			if (observer) {
				observer.disconnect();
				observer = void 0;
			}
		};
		const stopWatch = (0, vue.watch)((0, vue.computed)(() => {
			const items = toArray((0, vue.toValue)(target)).map(unrefElement).filter(notNullish);
			return new Set(items);
		}), (newTargets) => {
			cleanup();
			if (isSupported.value && newTargets.size) {
				observer = new MutationObserver(callback);
				newTargets.forEach((el) => observer.observe(el, mutationOptions));
			}
		}, {
			immediate: true,
			flush: "post"
		});
		const takeRecords = () => {
			return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
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
	var ssrWidthSymbol = Symbol("vueuse-ssr-width");
	function useSSRWidth() {
		const ssrWidth = (0, vue.hasInjectionContext)() ? injectLocal(ssrWidthSymbol, null) : null;
		return typeof ssrWidth === "number" ? ssrWidth : void 0;
	}
	function useMediaQuery(query, options = {}) {
		const { window = defaultWindow, ssrWidth = useSSRWidth() } = options;
		const isSupported = useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
		const ssrSupport = (0, vue.shallowRef)(typeof ssrWidth === "number");
		const mediaQuery = (0, vue.shallowRef)();
		const matches = (0, vue.shallowRef)(false);
		const handler = (event) => {
			matches.value = event.matches;
		};
		(0, vue.watchEffect)(() => {
			if (ssrSupport.value) {
				ssrSupport.value = !isSupported.value;
				matches.value = (0, vue.toValue)(query).split(",").some((queryString) => {
					const not = queryString.includes("not all");
					const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
					const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
					let res = Boolean(minWidth || maxWidth);
					if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
					if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
					return not ? !res : res;
				});
				return;
			}
			if (!isSupported.value) return;
			mediaQuery.value = window.matchMedia((0, vue.toValue)(query));
			matches.value = mediaQuery.value.matches;
		});
		useEventListener(mediaQuery, "change", handler, { passive: true });
		return (0, vue.computed)(() => matches.value);
	}
	var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
	var globalKey = "__vueuse_ssr_handlers__";
	var handlers = getHandlers();
	function getHandlers() {
		if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
		return _global[globalKey];
	}
	function getSSRHandler(key, fallback) {
		return handlers[key] || fallback;
	}
	function usePreferredDark(options) {
		return useMediaQuery("(prefers-color-scheme: dark)", options);
	}
	function guessSerializerType(rawInit) {
		return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
	}
	var StorageSerializers = {
		boolean: {
			read: (v) => v === "true",
			write: (v) => String(v)
		},
		object: {
			read: (v) => JSON.parse(v),
			write: (v) => JSON.stringify(v)
		},
		number: {
			read: (v) => Number.parseFloat(v),
			write: (v) => String(v)
		},
		any: {
			read: (v) => v,
			write: (v) => String(v)
		},
		string: {
			read: (v) => v,
			write: (v) => String(v)
		},
		map: {
			read: (v) => new Map(JSON.parse(v)),
			write: (v) => JSON.stringify(Array.from(v.entries()))
		},
		set: {
			read: (v) => new Set(JSON.parse(v)),
			write: (v) => JSON.stringify(Array.from(v))
		},
		date: {
			read: (v) => new Date(v),
			write: (v) => v.toISOString()
		}
	};
	var customStorageEventName = "vueuse-storage";
	function useStorage(key, defaults, storage, options = {}) {
		var _options$serializer;
		const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window = defaultWindow, eventFilter, onError = (e) => {
			console.error(e);
		}, initOnMounted } = options;
		const data = (shallow ? vue.shallowRef : vue.ref)(typeof defaults === "function" ? defaults() : defaults);
		const keyComputed = (0, vue.computed)(() => (0, vue.toValue)(key));
		if (!storage) try {
			storage = getSSRHandler("getDefaultStorage", () => defaultWindow === null || defaultWindow === void 0 ? void 0 : defaultWindow.localStorage)();
		} catch (e) {
			onError(e);
		}
		if (!storage) return data;
		const rawInit = (0, vue.toValue)(defaults);
		const type = guessSerializerType(rawInit);
		const serializer = (_options$serializer = options.serializer) !== null && _options$serializer !== void 0 ? _options$serializer : StorageSerializers[type];
		const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, (newValue) => write(newValue), {
			flush,
			deep,
			eventFilter
		});
		(0, vue.watch)(keyComputed, () => update(), { flush });
		let firstMounted = false;
		const onStorageEvent = (ev) => {
			if (initOnMounted && !firstMounted) return;
			update(ev);
		};
		const onStorageCustomEvent = (ev) => {
			if (initOnMounted && !firstMounted) return;
			updateFromCustomEvent(ev);
		};
		if (window && listenToStorageChanges) if (storage instanceof Storage) useEventListener(window, "storage", onStorageEvent, { passive: true });
		else useEventListener(window, customStorageEventName, onStorageCustomEvent);
		if (initOnMounted) tryOnMounted(() => {
			firstMounted = true;
			update();
		});
		else update();
		function dispatchWriteEvent(oldValue, newValue) {
			if (window) {
				const payload = {
					key: keyComputed.value,
					oldValue,
					newValue,
					storageArea: storage
				};
				window.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, { detail: payload }));
			}
		}
		function write(v) {
			try {
				const oldValue = storage.getItem(keyComputed.value);
				if (v == null) {
					dispatchWriteEvent(oldValue, null);
					storage.removeItem(keyComputed.value);
				} else {
					const serialized = serializer.write(v);
					if (oldValue !== serialized) {
						storage.setItem(keyComputed.value, serialized);
						dispatchWriteEvent(oldValue, serialized);
					}
				}
			} catch (e) {
				onError(e);
			}
		}
		function read(event) {
			const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
			if (rawValue == null) {
				if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
				return rawInit;
			} else if (!event && mergeDefaults) {
				const value = serializer.read(rawValue);
				if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
				else if (type === "object" && !Array.isArray(value)) return {
					...rawInit,
					...value
				};
				return value;
			} else if (typeof rawValue !== "string") return rawValue;
			else return serializer.read(rawValue);
		}
		function update(event) {
			if (event && event.storageArea !== storage) return;
			if (event && event.key == null) {
				data.value = rawInit;
				return;
			}
			if (event && event.key !== keyComputed.value) return;
			pauseWatch();
			try {
				const serializedData = serializer.write(data.value);
				if (event === void 0 || (event === null || event === void 0 ? void 0 : event.newValue) !== serializedData) data.value = read(event);
			} catch (e) {
				onError(e);
			} finally {
				if (event) (0, vue.nextTick)(resumeWatch);
				else resumeWatch();
			}
		}
		function updateFromCustomEvent(event) {
			update(event.detail);
		}
		return data;
	}
	var defaultScrollConfig = {
		speed: 2,
		margin: 30,
		direction: "both"
	};
	function clampContainerScroll(container) {
		if (container.scrollLeft > container.scrollWidth - container.clientWidth) container.scrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
		if (container.scrollTop > container.scrollHeight - container.clientHeight) container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
	}
	function useDraggable(target, options = {}) {
		var _toValue, _toValue2, _toValue3, _scrollConfig$directi;
		const { pointerTypes, preventDefault, stopPropagation, exact, onMove, onEnd, onStart, initialValue, axis = "both", draggingElement = defaultWindow, containerElement, handle: draggingHandle = target, buttons = [0], restrictInView, autoScroll = false } = options;
		const position = (0, vue.ref)((_toValue = (0, vue.toValue)(initialValue)) !== null && _toValue !== void 0 ? _toValue : {
			x: 0,
			y: 0
		});
		const pressedDelta = (0, vue.ref)();
		const filterEvent = (e) => {
			if (pointerTypes) return pointerTypes.includes(e.pointerType);
			return true;
		};
		const handleEvent = (e) => {
			if ((0, vue.toValue)(preventDefault)) e.preventDefault();
			if ((0, vue.toValue)(stopPropagation)) e.stopPropagation();
		};
		const scrollConfig = (0, vue.toValue)(autoScroll);
		const scrollSettings = typeof scrollConfig === "object" ? {
			speed: (_toValue2 = (0, vue.toValue)(scrollConfig.speed)) !== null && _toValue2 !== void 0 ? _toValue2 : defaultScrollConfig.speed,
			margin: (_toValue3 = (0, vue.toValue)(scrollConfig.margin)) !== null && _toValue3 !== void 0 ? _toValue3 : defaultScrollConfig.margin,
			direction: (_scrollConfig$directi = scrollConfig.direction) !== null && _scrollConfig$directi !== void 0 ? _scrollConfig$directi : defaultScrollConfig.direction
		} : defaultScrollConfig;
		const getScrollAxisValues = (value) => typeof value === "number" ? [value, value] : [value.x, value.y];
		const handleAutoScroll = (container, targetRect, position) => {
			const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollWidth, scrollHeight } = container;
			const [marginX, marginY] = getScrollAxisValues(scrollSettings.margin);
			const [speedX, speedY] = getScrollAxisValues(scrollSettings.speed);
			let deltaX = 0;
			let deltaY = 0;
			if (scrollSettings.direction === "x" || scrollSettings.direction === "both") {
				if (position.x < marginX && scrollLeft > 0) deltaX = -speedX;
				else if (position.x + targetRect.width > clientWidth - marginX && scrollLeft < scrollWidth - clientWidth) deltaX = speedX;
			}
			if (scrollSettings.direction === "y" || scrollSettings.direction === "both") {
				if (position.y < marginY && scrollTop > 0) deltaY = -speedY;
				else if (position.y + targetRect.height > clientHeight - marginY && scrollTop < scrollHeight - clientHeight) deltaY = speedY;
			}
			if (deltaX || deltaY) container.scrollBy({
				left: deltaX,
				top: deltaY,
				behavior: "auto"
			});
		};
		let autoScrollInterval = null;
		const startAutoScroll = () => {
			const container = (0, vue.toValue)(containerElement);
			if (container && !autoScrollInterval) autoScrollInterval = setInterval(() => {
				const targetRect = (0, vue.toValue)(target).getBoundingClientRect();
				const { x, y } = position.value;
				const relativePosition = {
					x: x - container.scrollLeft,
					y: y - container.scrollTop
				};
				if (relativePosition.x >= 0 && relativePosition.y >= 0) {
					handleAutoScroll(container, targetRect, relativePosition);
					relativePosition.x += container.scrollLeft;
					relativePosition.y += container.scrollTop;
					position.value = relativePosition;
				}
			}, 1e3 / 60);
		};
		const stopAutoScroll = () => {
			if (autoScrollInterval) {
				clearInterval(autoScrollInterval);
				autoScrollInterval = null;
			}
		};
		const isPointerNearEdge = (pointer, container, margin, targetRect) => {
			const [marginX, marginY] = typeof margin === "number" ? [margin, margin] : [margin.x, margin.y];
			const { clientWidth, clientHeight } = container;
			return pointer.x < marginX || pointer.x + targetRect.width > clientWidth - marginX || pointer.y < marginY || pointer.y + targetRect.height > clientHeight - marginY;
		};
		const checkAutoScroll = () => {
			if ((0, vue.toValue)(options.disabled) || !pressedDelta.value) return;
			const container = (0, vue.toValue)(containerElement);
			if (!container) return;
			const targetRect = (0, vue.toValue)(target).getBoundingClientRect();
			const { x, y } = position.value;
			if (isPointerNearEdge({
				x: x - container.scrollLeft,
				y: y - container.scrollTop
			}, container, scrollSettings.margin, targetRect)) startAutoScroll();
			else stopAutoScroll();
		};
		if ((0, vue.toValue)(autoScroll)) (0, vue.watch)(position, checkAutoScroll);
		const start = (e) => {
			var _container$getBoundin;
			if (!(0, vue.toValue)(buttons).includes(e.button)) return;
			if ((0, vue.toValue)(options.disabled) || !filterEvent(e)) return;
			if ((0, vue.toValue)(exact) && e.target !== (0, vue.toValue)(target)) return;
			const container = (0, vue.toValue)(containerElement);
			const containerRect = container === null || container === void 0 || (_container$getBoundin = container.getBoundingClientRect) === null || _container$getBoundin === void 0 ? void 0 : _container$getBoundin.call(container);
			const targetRect = (0, vue.toValue)(target).getBoundingClientRect();
			const pos = {
				x: e.clientX - (container ? targetRect.left - containerRect.left + (autoScroll ? 0 : container.scrollLeft) : targetRect.left),
				y: e.clientY - (container ? targetRect.top - containerRect.top + (autoScroll ? 0 : container.scrollTop) : targetRect.top)
			};
			if ((onStart === null || onStart === void 0 ? void 0 : onStart(pos, e)) === false) return;
			pressedDelta.value = pos;
			handleEvent(e);
		};
		const move = (e) => {
			if ((0, vue.toValue)(options.disabled) || !filterEvent(e)) return;
			if (!pressedDelta.value) return;
			const container = (0, vue.toValue)(containerElement);
			if (container instanceof HTMLElement) clampContainerScroll(container);
			const targetRect = (0, vue.toValue)(target).getBoundingClientRect();
			let { x, y } = position.value;
			if (axis === "x" || axis === "both") {
				x = e.clientX - pressedDelta.value.x;
				if (container) x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
			}
			if (axis === "y" || axis === "both") {
				y = e.clientY - pressedDelta.value.y;
				if (container) y = Math.min(Math.max(0, y), container.scrollHeight - targetRect.height);
			}
			if ((0, vue.toValue)(autoScroll) && container) {
				if (autoScrollInterval === null) handleAutoScroll(container, targetRect, {
					x,
					y
				});
				x += container.scrollLeft;
				y += container.scrollTop;
			}
			if (container && (restrictInView || autoScroll)) {
				if (axis !== "y") {
					const relativeX = x - container.scrollLeft;
					if (relativeX < 0) x = container.scrollLeft;
					else if (relativeX > container.clientWidth - targetRect.width) x = container.clientWidth - targetRect.width + container.scrollLeft;
				}
				if (axis !== "x") {
					const relativeY = y - container.scrollTop;
					if (relativeY < 0) y = container.scrollTop;
					else if (relativeY > container.clientHeight - targetRect.height) y = container.clientHeight - targetRect.height + container.scrollTop;
				}
			}
			position.value = {
				x,
				y
			};
			onMove === null || onMove === void 0 || onMove(position.value, e);
			handleEvent(e);
		};
		const end = (e) => {
			if ((0, vue.toValue)(options.disabled) || !filterEvent(e)) return;
			if (!pressedDelta.value) return;
			pressedDelta.value = void 0;
			if (autoScroll) stopAutoScroll();
			onEnd === null || onEnd === void 0 || onEnd(position.value, e);
			handleEvent(e);
		};
		if (isClient) {
			const config = () => {
				var _options$capture;
				return {
					capture: (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : true,
					passive: !(0, vue.toValue)(preventDefault)
				};
			};
			useEventListener(draggingHandle, "pointerdown", start, config);
			useEventListener(draggingElement, "pointermove", move, config);
			useEventListener(draggingElement, "pointerup", end, config);
		}
		return {
			...toRefs$1(position),
			position,
			isDragging: (0, vue.computed)(() => !!pressedDelta.value),
			style: (0, vue.computed)(() => `
      left: ${position.value.x}px;
      top: ${position.value.y}px;
      ${autoScroll ? "text-wrap: nowrap;" : ""}
    `)
		};
	}
	function useResizeObserver(target, callback, options = {}) {
		const { window = defaultWindow, ...observerOptions } = options;
		let observer;
		const isSupported = useSupported(() => window && "ResizeObserver" in window);
		const cleanup = () => {
			if (observer) {
				observer.disconnect();
				observer = void 0;
			}
		};
		const stopWatch = (0, vue.watch)((0, vue.computed)(() => {
			const _targets = (0, vue.toValue)(target);
			return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
		}), (els) => {
			cleanup();
			if (isSupported.value && window) {
				observer = new ResizeObserver(callback);
				for (const _el of els) if (_el) observer.observe(_el, observerOptions);
			}
		}, {
			immediate: true,
			flush: "post"
		});
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
		const { reset = true, windowResize = true, windowScroll = true, immediate = true, updateTiming = "sync" } = options;
		const height = (0, vue.shallowRef)(0);
		const bottom = (0, vue.shallowRef)(0);
		const left = (0, vue.shallowRef)(0);
		const right = (0, vue.shallowRef)(0);
		const top = (0, vue.shallowRef)(0);
		const width = (0, vue.shallowRef)(0);
		const x = (0, vue.shallowRef)(0);
		const y = (0, vue.shallowRef)(0);
		function recalculate() {
			const el = unrefElement(target);
			if (!el) {
				if (reset) {
					height.value = 0;
					bottom.value = 0;
					left.value = 0;
					right.value = 0;
					top.value = 0;
					width.value = 0;
					x.value = 0;
					y.value = 0;
				}
				return;
			}
			const rect = el.getBoundingClientRect();
			height.value = rect.height;
			bottom.value = rect.bottom;
			left.value = rect.left;
			right.value = rect.right;
			top.value = rect.top;
			width.value = rect.width;
			x.value = rect.x;
			y.value = rect.y;
		}
		function update() {
			if (updateTiming === "sync") recalculate();
			else if (updateTiming === "next-frame") requestAnimationFrame(() => recalculate());
		}
		useResizeObserver(target, update);
		(0, vue.watch)(() => unrefElement(target), (ele) => !ele && update());
		useMutationObserver(target, update, { attributeFilter: ["style", "class"] });
		if (windowScroll) useEventListener("scroll", update, {
			capture: true,
			passive: true
		});
		if (windowResize) useEventListener("resize", update, { passive: true });
		tryOnMounted(() => {
			if (immediate) update();
		});
		return {
			height,
			bottom,
			left,
			right,
			top,
			width,
			x,
			y,
			update
		};
	}
	var DefaultMagicKeysAliasMap = {
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
		const { reactive: useReactive = false, target = defaultWindow, aliasMap = DefaultMagicKeysAliasMap, passive = true, onEventFired = noop } = options;
		const current = (0, vue.reactive)(new Set());
		const obj = {
			toJSON() {
				return {};
			},
			current
		};
		const refs = useReactive ? (0, vue.reactive)(obj) : obj;
		const metaDeps = new Set();
		const depsMap = new Map([
			["Meta", metaDeps],
			["Shift", new Set()],
			["Alt", new Set()]
		]);
		const usedKeys = new Set();
		function setRefs(key, value) {
			if (key in refs) if (useReactive) refs[key] = value;
			else refs[key].value = value;
		}
		function reset() {
			current.clear();
			for (const key of usedKeys) setRefs(key, false);
		}
		function updateDeps(value, e, keys) {
			if (!value || typeof e.getModifierState !== "function") return;
			for (const [modifier, depsSet] of depsMap) if (e.getModifierState(modifier)) {
				keys.forEach((key) => depsSet.add(key));
				break;
			}
		}
		function clearDeps(value, key) {
			if (value) return;
			const depsMapKey = `${key[0].toUpperCase()}${key.slice(1)}`;
			const deps = depsMap.get(depsMapKey);
			if (!["shift", "alt"].includes(key) || !deps) return;
			const depsArray = Array.from(deps);
			const depsIndex = depsArray.indexOf(key);
			depsArray.forEach((key, index) => {
				if (index >= depsIndex) {
					current.delete(key);
					setRefs(key, false);
				}
			});
			deps.clear();
		}
		function updateRefs(e, value) {
			var _e$key, _e$code;
			const key = (_e$key = e.key) === null || _e$key === void 0 ? void 0 : _e$key.toLowerCase();
			const values = [(_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.toLowerCase(), key].filter(Boolean);
			if (!key) return;
			if (key) if (value) current.add(key);
			else current.delete(key);
			for (const key of values) {
				usedKeys.add(key);
				setRefs(key, value);
			}
			updateDeps(value, e, [...current, ...values]);
			clearDeps(value, key);
			if (key === "meta" && !value) {
				metaDeps.forEach((key) => {
					current.delete(key);
					setRefs(key, false);
				});
				metaDeps.clear();
			}
		}
		useEventListener(target, "keydown", (e) => {
			updateRefs(e, true);
			return onEventFired(e);
		}, { passive });
		useEventListener(target, "keyup", (e) => {
			updateRefs(e, false);
			return onEventFired(e);
		}, { passive });
		useEventListener("blur", reset, { passive });
		useEventListener("focus", reset, { passive });
		const proxy = new Proxy(refs, { get(target, prop, rec) {
			if (typeof prop !== "string") return Reflect.get(target, prop, rec);
			prop = prop.toLowerCase();
			if (prop in aliasMap) prop = aliasMap[prop];
			if (!(prop in refs)) if (/[+_-]/.test(prop)) {
				const keys = prop.split(/[+_-]/g).map((i) => i.trim());
				refs[prop] = (0, vue.computed)(() => keys.map((key) => (0, vue.toValue)(proxy[key])).every(Boolean));
			} else refs[prop] = (0, vue.shallowRef)(false);
			const r = Reflect.get(target, prop, rec);
			return useReactive ? (0, vue.toValue)(r) : r;
		} });
		return proxy;
	}
	Number.POSITIVE_INFINITY;
	function useWindowSize(options = {}) {
		const { window = defaultWindow, initialWidth = Number.POSITIVE_INFINITY, initialHeight = Number.POSITIVE_INFINITY, listenOrientation = true, includeScrollbar = true, type = "inner" } = options;
		const width = (0, vue.shallowRef)(initialWidth);
		const height = (0, vue.shallowRef)(initialHeight);
		const update = () => {
			if (window) if (type === "outer") {
				width.value = window.outerWidth;
				height.value = window.outerHeight;
			} else if (type === "visual" && window.visualViewport) {
				const { width: visualViewportWidth, height: visualViewportHeight, scale } = window.visualViewport;
				width.value = Math.round(visualViewportWidth * scale);
				height.value = Math.round(visualViewportHeight * scale);
			} else if (includeScrollbar) {
				width.value = window.innerWidth;
				height.value = window.innerHeight;
			} else {
				width.value = window.document.documentElement.clientWidth;
				height.value = window.document.documentElement.clientHeight;
			}
		};
		update();
		tryOnMounted(update);
		const listenerOptions = { passive: true };
		useEventListener("resize", update, listenerOptions);
		if (window && type === "visual" && window.visualViewport) useEventListener(window.visualViewport, "resize", update, listenerOptions);
		if (listenOrientation) (0, vue.watch)(useMediaQuery("(orientation: portrait)"), () => update());
		return {
			width,
			height
		};
	}
	var _hoisted_1$10 = { class: "text-xl font-black text-white" };
	var _hoisted_2$7 = { class: "no-scrollbar flex min-h-[calc(100%-2.5rem)] flex-1 flex-col p-2" };
	var PanelComp_default = (0, vue.defineComponent)({
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
			const panel = (0, vue.ref)(null);
			const bar = (0, vue.ref)(null);
			const windowSize = useWindowSize({ includeScrollbar: false });
			const { width, height } = useElementBounding(bar, { windowScroll: false });
			const maxPos = (0, vue.computed)(() => {
				return {
					x: windowSize.width.value - width.value,
					y: windowSize.height.value - height.value
				};
			});
			let rAF = 0;
			const { style } = useDraggable(panel, {
				initialValue: {
					x: Math.max(windowSize.width.value / 2 - Math.max(windowSize.width.value * props.widthPercent / 100, props.minWidth) / 2, 0),
					y: Math.max(windowSize.height.value / 2 - Math.max(windowSize.height.value * props.heightPercent / 100, props.minHeight) / 2, 0)
				},
				handle: (0, vue.computed)(() => bar.value),
				preventDefault: true,
				onMove: (pos) => {
					cancelAnimationFrame(rAF);
					rAF = requestAnimationFrame(() => {
						if (pos.x < 0) pos.x = 0;
						if (pos.y < 0) pos.y = 0;
						if (pos.x > maxPos.value.x) pos.x = maxPos.value.x;
						if (pos.y > maxPos.value.y) pos.y = maxPos.value.y;
					});
				}
			});
			const panelStyle = (0, vue.computed)(() => {
				return {
					width: props.widthPercent + "vw",
					height: props.heightPercent + "vh",
					minWidth: props.minWidth + "px",
					minHeight: props.minHeight + "px"
				};
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref_key: "panel",
					ref: panel,
					style: (0, vue.normalizeStyle)([panelStyle.value, (0, vue.unref)(style)]),
					class: "no-scrollbar fixed z-10000000 overflow-auto overscroll-none rounded-xl bg-white shadow-lg will-change-[top,left] select-none"
				}, [(0, vue.createElementVNode)("div", {
					ref_key: "bar",
					ref: bar,
					class: "sticky top-0 z-10 w-full cursor-move bg-[#00AEEC] py-1.5 text-center"
				}, [(0, vue.createElementVNode)("div", _hoisted_1$10, (0, vue.toDisplayString)(__props.title), 1), (0, vue.createElementVNode)("i", {
					class: "absolute top-0 right-0 m-1 cursor-pointer text-white hover:rounded-full hover:bg-white/40",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
				}, [..._cache[1] || (_cache[1] = [(0, vue.createElementVNode)("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					fill: "none",
					viewBox: "0 0 24 24",
					"stroke-width": "2.5",
					stroke: "currentColor",
					class: "size-8"
				}, [(0, vue.createElementVNode)("path", {
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					d: "M6 18 18 6M6 6l12 12"
				})], -1)])])], 512), (0, vue.createElementVNode)("div", _hoisted_2$7, [(0, vue.renderSlot)(_ctx.$slots, "default")])], 4);
			};
		}
	});
	var _hoisted_1$9 = {
		key: 0,
		class: "mb-1.5"
	};
	var _hoisted_2$6 = { class: "text-sm leading-6 text-orange-900" };
	var DescriptionComp_default = (0, vue.defineComponent)({
		__name: "DescriptionComp",
		props: { description: {} },
		setup(__props) {
			return (_ctx, _cache) => {
				return __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$9, [(0, vue.createElementVNode)("div", _hoisted_2$6, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(__props.description, (line, index) => {
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: index }, [(0, vue.createElementVNode)("p", null, [_cache[0] || (_cache[0] = (0, vue.createElementVNode)("span", { class: "mr-1" }, "•", -1)), (0, vue.createTextVNode)((0, vue.toDisplayString)(line), 1)])]);
				}), 128))])])) : (0, vue.createCommentVNode)("", true);
			};
		}
	});
	var _hoisted_1$8 = { class: "mx-2 mb-2 flex flex-1 flex-col p-1 text-black" };
	var EditorDialog_default = (0, vue.defineComponent)({
		__name: "EditorDialog",
		setup(__props, { expose: __expose }) {
			const isEditorShow = (0, vue.ref)(false);
			const editorData = (0, vue.ref)("");
			const currentItem = (0, vue.ref)(null);
			let stopWatch = null;
			const openEditor = (item) => {
				currentItem.value = item;
				const val = _GM_getValue(item.id, []).join("\n");
				editorData.value = val ? val + "\n" : val;
				stopWatch = watchDebounced(editorData, (value) => {
					if (!currentItem.value) return;
					try {
						const data = orderedUniq(value.split("\n").filter((v) => v.trim() !== ""));
						_GM_setValue(currentItem.value.id, data);
						currentItem.value.saveFn();
					} catch (err) {
						logger.error(`EditorDialog ${currentItem.value.id} saveData error`, err);
					}
				}, { debounce: 1e3 });
				isEditorShow.value = true;
			};
			const closeEditor = () => {
				if (currentItem.value) try {
					const data = orderedUniq(editorData.value.split("\n").filter((v) => v.trim() !== ""));
					_GM_setValue(currentItem.value.id, data);
					currentItem.value.saveFn();
				} catch (err) {
					logger.error(`EditorDialog ${currentItem.value.id} closeEditor error`, err);
				}
				isEditorShow.value = false;
			};
			(0, vue.onUnmounted)(() => {
				if (stopWatch) stopWatch();
			});
			__expose({ openEditor });
			return (_ctx, _cache) => {
				return isEditorShow.value ? ((0, vue.openBlock)(), (0, vue.createBlock)(PanelComp_default, (0, vue.mergeProps)({ key: 0 }, {
					title: currentItem.value?.editorTitle ?? "",
					widthPercent: 28,
					heightPercent: 85,
					minWidth: 360,
					minHeight: 600
				}, { onClose: closeEditor }), {
					default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_1$8, [currentItem.value?.editorDescription?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
						key: 0,
						class: "mb-3",
						description: currentItem.value.editorDescription
					}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true), (0, vue.withDirectives)((0, vue.createElementVNode)("textarea", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => editorData.value = $event),
						onKeydown: _cache[1] || (_cache[1] = (0, vue.withModifiers)(() => {}, ["stop"])),
						class: "flex-1 resize-none overscroll-none rounded-md border-2 border-gray-300 bg-white p-2 text-[15px] outline-hidden focus:border-gray-400",
						style: {
							"scrollbar-width": "thin",
							"scrollbar-color": "#999 #00000000"
						},
						spellcheck: "false",
						placeholder: "请输入内容..."
					}, null, 544), [[vue.vModelText, editorData.value]])])]),
					_: 1
				}, 16)) : (0, vue.createCommentVNode)("", true);
			};
		}
	});
	var _hoisted_1$7 = { class: "flex w-full py-1 hover:bg-blue-50/50" };
	var _hoisted_2$5 = { class: "ml-2 self-center text-black" };
	var EditorComp_default = (0, vue.defineComponent)({
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
		emits: ["edit"],
		setup(__props, { emit: __emit }) {
			const item = __props;
			const emit = __emit;
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("label", _hoisted_1$7, [(0, vue.createElementVNode)("button", {
					type: "button",
					class: "inline-flex justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-blue-900 outline-hidden",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("edit", item))
				}, " 编辑 "), (0, vue.createElementVNode)("span", _hoisted_2$5, (0, vue.toDisplayString)(__props.name), 1)]), __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
					key: 0,
					class: "pl-9",
					description: __props.description
				}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true)], 64);
			};
		}
	});
	var _hoisted_1$6 = { class: "flex items-center justify-between py-1" };
	var _hoisted_2$4 = { class: "text-black" };
	var _hoisted_3$2 = { class: "relative w-2/5" };
	var _hoisted_4 = { class: "block truncate text-gray-800" };
	var _hoisted_5 = { class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2" };
	var _hoisted_6 = {
		key: 0,
		class: "absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"
	};
	var ListComp_default = (0, vue.defineComponent)({
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
			const currValue = _GM_getValue(item.id, item.defaultValue);
			const selectedOption = (0, vue.ref)(options.find((v) => v.value === currValue) ?? options[0]);
			(0, vue.watch)(selectedOption, (newSelected) => {
				const value = newSelected.value;
				if (value !== item.disableValue) {
					document.documentElement.setAttribute(item.id, value);
					for (const option of item.options) if (option.value === value && option.fn) option.fn()?.catch(() => {});
				} else document.documentElement.removeAttribute(item.id);
				_GM_setValue(item.id, value);
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("div", _hoisted_1$6, [(0, vue.createElementVNode)("div", _hoisted_2$4, (0, vue.toDisplayString)(__props.name), 1), (0, vue.createVNode)((0, vue.unref)(Ie), {
					modelValue: selectedOption.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedOption.value = $event)
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_3$2, [(0, vue.createVNode)((0, vue.unref)(je), { class: "relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-left outline-hidden focus-visible:border-indigo-500 sm:text-sm" }, {
						default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", _hoisted_4, (0, vue.toDisplayString)(selectedOption.value.name), 1), (0, vue.createElementVNode)("span", _hoisted_5, [(0, vue.createVNode)((0, vue.unref)(render$1), {
							class: "h-5 w-5 text-gray-400",
							"aria-hidden": "true"
						})])]),
						_: 1
					}), (0, vue.createVNode)(vue.Transition, {
						"leave-active-class": "transition duration-100 ease-in",
						"leave-from-class": "opacity-100",
						"leave-to-class": "opacity-0"
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Ae), { class: "no-scrollbar absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm" }, {
							default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(options), (option, index) => {
								return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Fe), {
									key: index,
									value: option,
									as: "template"
								}, {
									default: (0, vue.withCtx)(({ active, selected }) => [(0, vue.createElementVNode)("li", { class: (0, vue.normalizeClass)([active ? "bg-purple-100 text-black" : "text-gray-900", "relative cursor-default py-2 pr-4 pl-10 transition-colors duration-200"]) }, [(0, vue.createElementVNode)("span", { class: (0, vue.normalizeClass)([selected ? "font-medium" : "font-normal", "block truncate"]) }, (0, vue.toDisplayString)(option.name), 3), selected ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_6, [(0, vue.createVNode)((0, vue.unref)(render$2), {
										class: "h-5 w-5",
										"aria-hidden": "true"
									})])) : (0, vue.createCommentVNode)("", true)], 2)]),
									_: 2
								}, 1032, ["value"]);
							}), 128))]),
							_: 1
						})]),
						_: 1
					})])]),
					_: 1
				}, 8, ["modelValue"])]), __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
					key: 0,
					class: "pl-1",
					description: __props.description
				}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true)], 64);
			};
		}
	});
	var _hoisted_1$5 = { class: "my-1 flex items-center py-1 text-black" };
	var _hoisted_2$3 = ["step"];
	var _hoisted_3$1 = {
		key: 0,
		class: "ml-2"
	};
	var NumberComp_default = (0, vue.defineComponent)({
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
			const currValue = (0, vue.ref)(_GM_getValue(item.id, item.defaultValue));
			watchThrottled(currValue, (newValue, oldValue) => {
				try {
					if (newValue > item.maxValue) currValue.value = item.maxValue;
					if (newValue < item.minValue) currValue.value = item.minValue;
					if (oldValue === item.disableValue) {
						if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
					}
					if (newValue === item.disableValue) {
						if (!item.noStyle) document.documentElement.removeAttribute(item.attrName ?? item.id);
					} else if (currValue.value !== oldValue) item.fn(currValue.value)?.catch((err) => {
						throw err;
					});
					_GM_setValue(item.id, currValue.value);
				} catch (err) {
					logger.error(`NumberComp ${item.id} error`, err);
				}
			}, {
				throttle: 250,
				trailing: true
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("div", _hoisted_1$5, [
					(0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(__props.name), 1),
					(0, vue.withDirectives)((0, vue.createElementVNode)("input", {
						type: "number",
						step: __props.step,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currValue.value = $event),
						onKeydown: _cache[1] || (_cache[1] = (0, vue.withModifiers)(() => {}, ["stop"])),
						class: "ml-auto block w-1/5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm outline-hidden invalid:border-2 invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
					}, null, 40, _hoisted_2$3), [[vue.vModelText, currValue.value]]),
					__props.addonText ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_3$1, (0, vue.toDisplayString)(__props.addonText), 1)) : (0, vue.createCommentVNode)("", true)
				]), __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
					key: 0,
					class: "pl-1",
					description: __props.description
				}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true)], 64);
			};
		}
	});
	var _hoisted_1$4 = { class: "mt-1 mb-0.5 flex items-center py-1 text-black" };
	var StringComp_default = (0, vue.defineComponent)({
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
			const currValue = (0, vue.ref)(_GM_getValue(item.id, item.defaultValue));
			watchThrottled(currValue, (newValue, oldValue) => {
				try {
					if (oldValue === item.disableValue) {
						if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
					}
					if (newValue === item.disableValue) {
						if (!item.noStyle) document.documentElement.removeAttribute(item.attrName ?? item.id);
					} else if (currValue.value !== oldValue) item.fn(currValue.value)?.catch((err) => {
						throw err;
					});
					_GM_setValue(item.id, currValue.value);
				} catch (err) {
					logger.error(`StringComp ${item.id} error`, err);
				}
			}, {
				throttle: 250,
				trailing: true
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("div", _hoisted_1$4, [(0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(__props.name), 1), (0, vue.withDirectives)((0, vue.createElementVNode)("input", {
					type: "text",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => currValue.value = $event),
					onKeydown: _cache[1] || (_cache[1] = (0, vue.withModifiers)(() => {}, ["stop"])),
					class: "ml-4 block flex-1 rounded-md border border-gray-300 bg-white p-1.5 text-sm outline-hidden invalid:border-red-500 focus:border-gray-500 focus:invalid:border-red-500"
				}, null, 544), [[vue.vModelText, currValue.value]])]), __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
					key: 0,
					description: __props.description
				}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true)], 64);
			};
		}
	});
	var _hoisted_1$3 = { class: "flex items-center" };
	var _hoisted_2$2 = { class: "ml-2 flex-1" };
	var SwitchComp_default = (0, vue.defineComponent)({
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
			const enabled = (0, vue.ref)(_GM_getValue(item.id, item.defaultEnable));
			(0, vue.watch)(enabled, () => {
				try {
					if (enabled.value) {
						if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
						if (item.enableFn) item.enableFn()?.catch(() => {});
						_GM_setValue(item.id, true);
					} else {
						if (!item.noStyle) document.documentElement.removeAttribute(item.attrName ?? item.id);
						if (item.disableFn) item.disableFn()?.catch((err) => {
							throw err;
						});
						_GM_setValue(item.id, false);
					}
				} catch (err) {
					logger.error(`SwitchComp ${item.id} error`, err);
				}
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createVNode)((0, vue.unref)(oe), { class: "m-0.5 h-fit w-full rounded-lg py-1 hover:bg-blue-50/50" }, {
					default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_1$3, [(0, vue.createVNode)((0, vue.unref)(de), { class: "flex flex-1 flex-row text-black" }, {
						default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(ue), {
							modelValue: enabled.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => enabled.value = $event),
							class: (0, vue.normalizeClass)([enabled.value ? "bg-[#00AEEC]" : "bg-gray-200", "relative inline-flex h-6 w-11 items-center rounded-full outline-hidden transition-colors"])
						}, {
							default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", { class: (0, vue.normalizeClass)([enabled.value ? "translate-x-6" : "translate-x-1", "inline-block h-4 w-4 transform rounded-full bg-white transition-transform"]) }, null, 2)]),
							_: 1
						}, 8, ["modelValue", "class"]), (0, vue.createElementVNode)("p", _hoisted_2$2, (0, vue.toDisplayString)(__props.name), 1)]),
						_: 1
					})])]),
					_: 1
				}), __props.description?.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(DescriptionComp_default, {
					key: 0,
					class: "pl-9",
					description: __props.description
				}, null, 8, ["description"])) : (0, vue.createCommentVNode)("", true)], 64);
			};
		}
	});
	var href = location.href;
	var host = location.host;
	var pathname = location.pathname;
	var currPage = () => {
		if (href.startsWith("https://www.bilibili.com") && ["/index.html", "/"].includes(pathname)) return "homepage";
		if (href.includes("bilibili.com/video/")) return "video";
		if (href.includes("bilibili.com/v/popular/")) return "popular";
		if (host === "search.bilibili.com") return "search";
		if (host === "t.bilibili.com" || href.includes("bilibili.com/opus/") || href.includes("bilibili.com/v/topic/detail")) return "dynamic";
		if (host === "live.bilibili.com") return "live";
		if (href.includes("bilibili.com/bangumi/play/")) return "bangumi";
		if (href.includes("bilibili.com/list/")) return "playlist";
		if (host === "space.bilibili.com") return "space";
		if (host === "message.bilibili.com") return "message";
		if (href.includes("bilibili.com/c/")) return "channel";
		if (/www\.bilibili\.com\/festival\//.test(href)) return "festival";
		if (href.includes("bilibili.com/watchlater")) return "watchlater";
		return "";
	};
	var ans = currPage();
	var isPageHomepage = () => ans === "homepage";
	var isPageVideo = () => ans === "video";
	var isPagePopular = () => ans === "popular";
	var isPageSearch = () => ans === "search";
	var isPageDynamic = () => ans === "dynamic";
	var isPageLive = () => ans === "live";
	var isPageBangumi = () => ans === "bangumi";
	var isPagePlaylist = () => ans === "playlist";
	var isPageFestival = () => ans === "festival";
	var isPageChannel = () => ans === "channel";
	var isPageSpace = () => ans === "space";
	var isPageWatchlater = () => ans === "watchlater";
	var isPageMessage = () => ans === "message";
	var Node$1 = class {
		value;
		next;
		constructor(value) {
			this.value = value;
		}
	};
	var Queue = class {
		#head;
		#tail;
		#size;
		constructor() {
			this.clear();
		}
		enqueue(value) {
			const node = new Node$1(value);
			if (this.#head) {
				this.#tail.next = node;
				this.#tail = node;
			} else {
				this.#head = node;
				this.#tail = node;
			}
			this.#size++;
		}
		dequeue() {
			const current = this.#head;
			if (!current) return;
			this.#head = this.#head.next;
			this.#size--;
			if (!this.#head) this.#tail = void 0;
			return current.value;
		}
		peek() {
			if (!this.#head) return;
			return this.#head.value;
		}
		clear() {
			this.#head = void 0;
			this.#tail = void 0;
			this.#size = 0;
		}
		get size() {
			return this.#size;
		}
		*[Symbol.iterator]() {
			let current = this.#head;
			while (current) {
				yield current.value;
				current = current.next;
			}
		}
		*drain() {
			while (this.#head) yield this.dequeue();
		}
	};
	function pLimit(concurrency) {
		let rejectOnClear = false;
		if (typeof concurrency === "object") ({concurrency, rejectOnClear = false} = concurrency);
		validateConcurrency(concurrency);
		if (typeof rejectOnClear !== "boolean") throw new TypeError("Expected `rejectOnClear` to be a boolean");
		const queue = new Queue();
		let activeCount = 0;
		const resumeNext = () => {
			if (activeCount < concurrency && queue.size > 0) {
				activeCount++;
				queue.dequeue().run();
			}
		};
		const next = () => {
			activeCount--;
			resumeNext();
		};
		const run = async (function_, resolve, arguments_) => {
			const result = (async () => function_(...arguments_))();
			resolve(result);
			try {
				await result;
			} catch {}
			next();
		};
		const enqueue = (function_, resolve, reject, arguments_) => {
			const queueItem = { reject };
			new Promise((internalResolve) => {
				queueItem.run = internalResolve;
				queue.enqueue(queueItem);
			}).then(run.bind(void 0, function_, resolve, arguments_));
			if (activeCount < concurrency) resumeNext();
		};
		const generator = (function_, ...arguments_) => new Promise((resolve, reject) => {
			enqueue(function_, resolve, reject, arguments_);
		});
		Object.defineProperties(generator, {
			activeCount: { get: () => activeCount },
			pendingCount: { get: () => queue.size },
			clearQueue: { value() {
				if (!rejectOnClear) {
					queue.clear();
					return;
				}
				const abortError = AbortSignal.abort().reason;
				while (queue.size > 0) queue.dequeue().reject(abortError);
			} },
			concurrency: {
				get: () => concurrency,
				set(newConcurrency) {
					validateConcurrency(newConcurrency);
					concurrency = newConcurrency;
					queueMicrotask(() => {
						while (activeCount < concurrency && queue.size > 0) resumeNext();
					});
				}
			},
			map: { async value(iterable, function_) {
				const promises = Array.from(iterable, (value, index) => this(function_, value, index));
				return Promise.all(promises);
			} }
		});
		return generator;
	}
	function validateConcurrency(concurrency) {
		if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) throw new TypeError("Expected `concurrency` to be a number from 1 and up");
	}
	var limit = pLimit(10);
	var rawCheck = async (elements, enableFilterVisitSign = true, hideMode, blackPairs, whitePairs, forceBlackPairs) => {
		const toHideIdx = new Set();
		const tasks = elements.map((el, idx) => limit(async () => {
			const blackTasks = [];
			blackPairs.forEach((pair) => {
				blackTasks.push(pair[0].check(el, pair[1]));
			});
			const forceBlackTasks = [];
			forceBlackPairs?.forEach((pair) => {
				forceBlackTasks.push(pair[0].check(el, pair[1]));
			});
			await Promise.all(blackTasks).catch(async () => {
				const whiteTasks = [];
				whitePairs?.forEach((pair) => {
					whiteTasks.push(pair[0].check(el, pair[1]));
				});
				await Promise.all(whiteTasks).then(() => {
					toHideIdx.add(idx);
				}).catch(() => {});
			});
			await Promise.all(forceBlackTasks).catch(() => {
				toHideIdx.add(idx);
			});
		}));
		await Promise.all(tasks).catch(() => {}).finally(() => {
			requestAnimationFrame(() => {
				for (let i = 0; i < elements.length; i++) {
					toHideIdx.has(i) ? hideEle(elements[i], hideMode) : showEle(elements[i], hideMode);
					enableFilterVisitSign && elements[i].setAttribute(config_default.filterVisitSign, "");
				}
			});
		});
		return toHideIdx.size;
	};
	var throttledCheck = useThrottleFn(rawCheck, 100, true);
	var coreCheck = async (elements, enableFilterVisitSign = true, hideMode, blackPairs, whitePairs, forceBlackPairs, noThrottle) => {
		if (noThrottle) return rawCheck(elements, enableFilterVisitSign, hideMode, blackPairs, whitePairs, forceBlackPairs);
		return throttledCheck(elements, enableFilterVisitSign, hideMode, blackPairs, whitePairs, forceBlackPairs);
	};
	var r = String.raw, e = r`\p{Emoji}(?:\p{EMod}|[\u{E0020}-\u{E007E}]+\u{E007F}|\uFE0F?\u20E3?)`;
	var emoji_regex_xs_default = () => new RegExp(r`\p{RI}{2}|(?![#*\d](?!\uFE0F?\u20E3))${e}(?:\u200D${e})*`, "gu");
	var ShadowInstance = class Shadow {
		static instance;
		shadowStore = new Map();
		cssStore = new Map();
		observerStore = new Map();
		constructor() {
			try {
				if (isPageVideo() || isPageBangumi() || isPageSpace() || isPageDynamic() || isPagePlaylist()) this.hook();
			} catch (err) {
				logger.error("hook shadow failed", err);
			}
		}
		static getInstance() {
			if (!Shadow.instance) Shadow.instance = new Shadow();
			return Shadow.instance;
		}
		hook() {
			const self = this;
			const origAttachShadow = Element.prototype.attachShadow;
			Element.prototype.attachShadow = function(init) {
				const shadowRoot = origAttachShadow.call(this, init);
				const tag = this.tagName;
				self.cssStore.get(tag)?.forEach((v) => {
					const style = document.createElement("style");
					style.textContent = v.css;
					style.setAttribute("bili-cleaner-css", v.className);
					shadowRoot.appendChild(style);
				});
				if (self.shadowStore.has(tag)) self.shadowStore.get(tag).add(shadowRoot);
				else self.shadowStore.set(tag, new Set([shadowRoot]));
				if (self.observerStore.has(tag)) for (const [observer, config] of self.observerStore.get(tag)) observer.observe(shadowRoot, config);
				return shadowRoot;
			};
			const origShadowInnerHTML = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "innerHTML");
			Object.defineProperty(ShadowRoot.prototype, "innerHTML", {
				get() {
					return origShadowInnerHTML.get.call(this);
				},
				set(value) {
					const tagName = this.host.tagName;
					if (tagName && self.cssStore.has(tagName)) self.cssStore.get(tagName)?.forEach((v) => {
						value += `<style bili-cleaner-css="${v.className}">${v.css}</style>`;
					});
					origShadowInnerHTML.set.call(this, value);
				}
			});
		}
		addShadowStyle(tag, className, css) {
			tag = tag.toUpperCase();
			const curr = this.cssStore.get(tag);
			if (curr) curr.add({
				className,
				css
			});
			else this.cssStore.set(tag, new Set([{
				className,
				css
			}]));
			if (this.shadowStore.size) this.shadowStore.get(tag)?.forEach((node) => {
				const style = document.createElement("style");
				style.textContent = css;
				style.setAttribute("bili-cleaner-css", className);
				node.appendChild(style);
			});
		}
		removeShadowStyle(tag, className) {
			tag = tag.toUpperCase();
			const curr = this.cssStore.get(tag);
			if (curr) {
				for (const value of curr) if (value.className === className) {
					curr.delete(value);
					break;
				}
			}
			if (this.shadowStore.size) this.shadowStore.get(tag)?.forEach((node) => {
				node.querySelectorAll(`style[bili-cleaner-css="${className}"]`).forEach((v) => v.remove());
			});
		}
		addShadowObserver(tag, observer, config) {
			tag = tag.toUpperCase();
			const curr = this.observerStore.get(tag);
			if (curr) curr.add([observer, config]);
			else this.observerStore.set(tag, new Set([[observer, config]]));
			if (this.shadowStore.size) this.shadowStore.get(tag)?.forEach((node) => {
				observer.observe(node, config);
			});
		}
	}.getInstance();
	var bots = [
		"机器工具人",
		"有趣的程序员",
		"AI视频小助理",
		"AI视频小助理总结一下",
		"AI笔记侠",
		"AI视频助手",
		"哔哩哔理点赞姬",
		"课代表猫",
		"AI课代表呀",
		"木几萌Moe",
		"星崽丨StarZai",
		"AI沈阳美食家",
		"AI头脑风暴",
		"GPT_5",
		"Juice_AI",
		"AI全文总结",
		"AI视频总结",
		"AI总结视频",
		"AI工具集",
		"Ai的评论",
		"AI识片酱",
		"AI知识总结",
		"AI小精灵呀",
		"AI课程教学",
		"Ai好记",
		"MilkyAi"
	];
	var botsSet = new Set(bots);
	var BooleanFilter = class {
		isEnable = false;
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
	};
	var KeywordFilter = class {
		isEnable = false;
		keywordSet = new Set();
		mergedRegExp = [];
		enable() {
			this.isEnable = true;
		}
		disable() {
			this.isEnable = false;
		}
		buildRegExp() {
			this.mergedRegExp = [];
			const validNormalParts = [];
			const validBackrefParts = [];
			for (let word of this.keywordSet) {
				word = toHalfWidth(word).trim();
				if (word === "" || word === "//" || word === "/") continue;
				if (word.startsWith("/") && word.endsWith("/")) word = word.slice(1, -1);
				else word = word.replace(/[*+?^${}().|[\]\\]/g, "\\$&");
				if (word.trim() === "") continue;
				try {
					new RegExp(word, "ius");
					if (/\\\d|\\k</.test(word.replaceAll("\\\\", ""))) validBackrefParts.push(word);
					else validNormalParts.push(word);
				} catch {}
			}
			try {
				if (validNormalParts.length) this.mergedRegExp.push(new RegExp(validNormalParts.join("|"), "ius"));
				for (const regex of validBackrefParts) this.mergedRegExp.push(new RegExp(regex, "ius"));
			} catch (err) {
				logger.error("keyword filter build RegExp error", err);
			}
		}
		addParam(value) {
			value = value.trim();
			value && this.keywordSet.add(value);
			this.buildRegExp();
		}
		setParam(value) {
			this.keywordSet = new Set(value.map((v) => v.trim()).filter((v) => v));
			this.buildRegExp();
		}
		check(el, selectorFn) {
			return new Promise((resolve, reject) => {
				if (this.isEnable) {
					let value = selectorFn(el);
					if (typeof value === "string") {
						value = toHalfWidth(value).trim();
						for (const regex of this.mergedRegExp) if (regex.test(value)) {
							reject();
							return;
						}
					}
				}
				resolve();
			});
		}
	};
	var NumberMinFilter = class {
		isEnable = false;
		threshold = 0;
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
	};
	var StringFilter = class {
		isEnable = false;
		strSet = new Set();
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
			this.strSet = new Set(value.map((v) => v.trim()).filter((v) => v));
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
	};
	var CommentUsernameFilter = class extends StringFilter {};
	var CommentUsernameKeywordFilter = class extends KeywordFilter {};
	var CommentContentFilter = class extends KeywordFilter {};
	var CommentAdFilter = class extends KeywordFilter {};
	var CommentLevelFilter = class extends NumberMinFilter {};
	var CommentNoFaceFilter = class extends BooleanFilter {};
	var CommentBotFilter = class extends StringFilter {};
	var CommentCallBotFilter = class extends BooleanFilter {};
	var CommentCallUserFilter = class extends BooleanFilter {};
	var CommentCallUserNoReplyFilter = class extends BooleanFilter {};
	var CommentCallUserOnlyFilter = class extends BooleanFilter {};
	var CommentCallUserOnlyNoReplyFilter = class extends BooleanFilter {};
	var CommentEmojiOnlyFilter = class extends BooleanFilter {};
	var CommentIsUpFilter = class extends BooleanFilter {};
	var CommentIsPinFilter = class extends BooleanFilter {};
	var CommentIsNoteFilter = class extends BooleanFilter {};
	var CommentIsLinkFilter = class extends BooleanFilter {};
	var CommentIsMeFilter = class extends BooleanFilter {};
	var GM_KEYS$9 = {
		black: {
			username: {
				statusKey: "video-comment-username-filter-status",
				valueKey: "global-comment-username-filter-value"
			},
			usernameKeyword: {
				statusKey: "video-comment-username-keyword-filter-status",
				valueKey: "global-comment-username-keyword-filter-value"
			},
			content: {
				statusKey: "video-comment-content-filter-status",
				valueKey: "global-comment-content-filter-value"
			},
			level: {
				statusKey: "video-comment-level-filter-status",
				valueKey: "global-comment-level-filter-value"
			},
			noface: { statusKey: "video-comment-noface-filter-status" },
			bot: { statusKey: "video-comment-bot-filter-status" },
			callBot: { statusKey: "video-comment-call-bot-filter-status" },
			callUser: { statusKey: "video-comment-call-user-filter-status" },
			callUserNoReply: { statusKey: "video-comment-call-user-noreply-filter-status" },
			callUserOnly: { statusKey: "video-comment-call-user-only-filter-status" },
			callUserOnlyNoReply: { statusKey: "video-comment-call-user-only-noreply-filter-status" },
			isAD: { statusKey: "video-comment-ad-filter-status" },
			emojiOnly: { statusKey: "video-comment-emoji-only-filter-status" }
		},
		white: {
			root: { statusKey: "video-comment-root-whitelist-status" },
			sub: { statusKey: "video-comment-sub-whitelist-status" },
			isUp: { statusKey: "video-comment-uploader-whitelist-status" },
			isPin: { statusKey: "video-comment-pinned-whitelist-status" },
			isNote: { statusKey: "video-comment-note-whitelist-status" },
			isLink: { statusKey: "video-comment-link-whitelist-status" }
		}
	};
	var emojiPattern = emoji_regex_xs_default();
	var selectorFns$9 = {
		root: {
			username: (comment) => {
				return comment.__data?.member?.uname?.trim();
			},
			content: (comment) => {
				return comment.__data?.content?.message?.replace(/@[^@\s]+/g, " ")?.replace(/(\[[^[\]]+\])+/g, " ").trim();
			},
			noface: (comment) => {
				return comment.__data?.member?.avatar?.endsWith("noface.jpg") && comment.__data?.member?.vip?.vipStatus === 0;
			},
			callBot: (comment) => {
				const members = comment.__data?.content?.members;
				if (members?.length) return members.some((v) => botsSet.has(v.uname));
				return false;
			},
			callUser: (comment) => {
				return !!comment.__data?.content?.members?.[0];
			},
			callUserNoReply: (comment) => {
				if (comment.__data?.rcount !== 0) return false;
				return !!comment.__data?.content?.members?.[0];
			},
			callUserOnly: (comment) => {
				return comment.__data?.content?.message?.replace(/@[^@\s]+/g, " ").trim() === "";
			},
			callUserOnlyNoReply: (comment) => {
				if (comment.__data?.rcount !== 0) return false;
				return comment.__data?.content?.message?.replace(/@[^@\s]+/g, " ").trim() === "";
			},
			level: (comment) => {
				return comment.__data?.member?.level_info?.current_level;
			},
			emojiOnly: (comment) => {
				return comment.__data?.content?.message?.replace(/@[^@\s]+/g, " ")?.replace(/(\[[^[\]]+\])+/g, " ")?.replace(emojiPattern, " ").trim() === "";
			},
			isUp: (comment) => {
				const mid = comment.__data?.mid;
				const upMid = comment.__upMid;
				return typeof mid === "number" && mid === upMid;
			},
			isPin: (comment) => {
				return !!comment.__data?.reply_control?.is_up_top;
			},
			isNote: (comment) => {
				return !!comment.__data?.reply_control?.is_note_v2;
			},
			isLink: (comment) => {
				const jump_url = comment.__data?.content?.jump_url;
				if (jump_url) {
					for (const k of Object.keys(jump_url)) if (!jump_url[k]?.pc_url?.includes("search.bilibili.com")) return true;
				}
				return false;
			},
			isMe: (comment) => {
				const me = comment.__user?.uname;
				if (!me) return false;
				if (comment.__data?.member?.uname === me || comment.__data?.content?.message?.includes(`@${me}`)) return true;
				return false;
			}
		},
		sub: {
			username: (comment) => {
				return comment.__data?.member?.uname?.trim();
			},
			content: (comment) => {
				return comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.replace(/@[^@\s]+/g, " ")?.replace(/(\[[^[\]]+\])+/g, " ").trim();
			},
			noface: (comment) => {
				return comment.__data?.member?.avatar?.endsWith("noface.jpg") && comment.__data?.member?.vip?.vipStatus === 0;
			},
			callBot: (comment) => {
				const members = comment.__data?.content?.members;
				if (members.length) return members.some((v) => botsSet.has(v.uname));
				return false;
			},
			callUser: (comment) => {
				return !!comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.match(/@[^@\s]+/);
			},
			callUserNoReply: (comment) => {
				return !!comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.match(/@[^@\s]+/);
			},
			callUserOnly: (comment) => {
				return comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.replace(/@[^@\s]+/g, " ").trim() === "";
			},
			callUserOnlyNoReply: (comment) => {
				return comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.replace(/@[^@\s]+/g, " ").trim() === "";
			},
			level: (comment) => {
				return comment.__data?.member?.level_info?.current_level;
			},
			emojiOnly: (comment) => {
				return comment.__data?.content?.message?.replace(/^回复\s?@[^@\s]+\s?:/, "")?.replace(/@[^@\s]+/g, " ")?.replace(/(\[[^[\]]+\])+/g, " ")?.replace(emojiPattern, " ").trim() === "";
			},
			isUp: (comment) => {
				const mid = comment.__data?.mid;
				const upMid = comment.__upMid;
				return typeof mid === "number" && mid === upMid;
			},
			isLink: (comment) => {
				const urls = comment.__data?.content?.jump_url;
				if (urls) {
					for (const k of Object.keys(urls)) if (!urls[k]?.pc_url?.includes("search.bilibili.com")) return true;
				}
				return false;
			},
			isMe: (comment) => {
				const me = comment.__user?.uname;
				if (!me) return false;
				if (comment.__data?.member?.uname === me || comment.__data?.content?.message?.trim()?.replace(/^回复\s?@[^@\s]+\s?:/, "").includes(`@${me}`)) return true;
				return false;
			}
		}
	};
	var isRootWhite = false;
	var isSubWhite = false;
	var CommentFilterCommon = class {
		target;
		commentUsernameFilter = new CommentUsernameFilter();
		commentUsernameKeywordFilter = new CommentUsernameKeywordFilter();
		commentContentFilter = new CommentContentFilter();
		commentAdFilter = new CommentAdFilter();
		commentLevelFilter = new CommentLevelFilter();
		commentNoFaceFilter = new CommentNoFaceFilter();
		commentBotFilter = new CommentBotFilter();
		commentCallBotFilter = new CommentCallBotFilter();
		commentCallUserFilter = new CommentCallUserFilter();
		commentCallUserNoReplyFilter = new CommentCallUserNoReplyFilter();
		commentCallUserOnlyFilter = new CommentCallUserOnlyFilter();
		commentCallUserOnlyNoReplyFilter = new CommentCallUserOnlyNoReplyFilter();
		commentEmojiOnlyFilter = new CommentEmojiOnlyFilter();
		commentIsUpFilter = new CommentIsUpFilter();
		commentIsPinFilter = new CommentIsPinFilter();
		commentIsNoteFilter = new CommentIsNoteFilter();
		commentIsLinkFilter = new CommentIsLinkFilter();
		commentIsMeFilter = new CommentIsMeFilter();
		init() {
			this.commentUsernameFilter.setParam(_GM_getValue(GM_KEYS$9.black.username.valueKey, []));
			this.commentUsernameKeywordFilter.setParam(_GM_getValue(GM_KEYS$9.black.usernameKeyword.valueKey, []));
			this.commentContentFilter.setParam(_GM_getValue(GM_KEYS$9.black.content.valueKey, []));
			this.commentLevelFilter.setParam(_GM_getValue(GM_KEYS$9.black.level.valueKey, 0));
			this.commentBotFilter.setParam(bots);
			this.commentAdFilter.setParam([`/(bili2233\\.cn|b23\\.tv)\\/(mall-|cm-)|领券|gaoneng\\.bilibili\\.com/`]);
		}
		async checkRoot(mode) {
			const timer = performance.now();
			let revertAll = false;
			if (!(this.commentUsernameFilter.isEnable || this.commentUsernameKeywordFilter.isEnable || this.commentContentFilter.isEnable || this.commentAdFilter.isEnable || this.commentLevelFilter.isEnable || this.commentNoFaceFilter.isEnable || this.commentBotFilter.isEnable || this.commentCallBotFilter.isEnable || this.commentCallUserFilter.isEnable || this.commentCallUserNoReplyFilter.isEnable || this.commentCallUserOnlyFilter.isEnable || this.commentCallUserOnlyNoReplyFilter.isEnable || this.commentEmojiOnlyFilter.isEnable)) revertAll = true;
			let rootComments = [];
			if (ShadowInstance.shadowStore.has("BILI-COMMENT-THREAD-RENDERER")) {
				rootComments = Array.from(ShadowInstance.shadowStore.get("BILI-COMMENT-THREAD-RENDERER")).map((v) => v.host);
				if (mode === "incr") rootComments = rootComments.filter((v) => !v.hasAttribute(config_default.filterVisitSign));
			}
			if (!rootComments.length) return;
			if (config_default.isDebugMode) rootComments.forEach((v) => {
				logger.debug([
					`CommentFilterCommon rootComments`,
					`username: ${selectorFns$9.root.username(v)}`,
					`content: ${selectorFns$9.root.content(v)}`,
					`callUser: ${selectorFns$9.root.callUser(v)}`,
					`callUserNoReply: ${selectorFns$9.root.callUserNoReply(v)}`,
					`callUserOnly: ${selectorFns$9.root.callUserOnly(v)}`,
					`callUserOnlyNoReply: ${selectorFns$9.root.callUserOnlyNoReply(v)}`,
					`level: ${selectorFns$9.root.level(v)}`,
					`noface: ${selectorFns$9.root.noface(v)}`,
					`isUp: ${selectorFns$9.root.isUp(v)}`,
					`isPin: ${selectorFns$9.root.isPin(v)}`,
					`isNote: ${selectorFns$9.root.isNote(v)}`,
					`isLink: ${selectorFns$9.root.isLink(v)}`,
					`isMe: ${selectorFns$9.root.isMe(v)}`,
					`emojiOnly: ${selectorFns$9.root.emojiOnly(v)}`
				].join("\n"));
			});
			if (isRootWhite || revertAll) {
				rootComments.forEach((el) => showEle(el, "style"));
				return;
			}
			const blackPairs = [];
			this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns$9.root.username]);
			this.commentUsernameKeywordFilter.isEnable && blackPairs.push([this.commentUsernameKeywordFilter, selectorFns$9.root.username]);
			this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns$9.root.content]);
			this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns$9.root.level]);
			this.commentNoFaceFilter.isEnable && blackPairs.push([this.commentNoFaceFilter, selectorFns$9.root.noface]);
			this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns$9.root.username]);
			this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns$9.root.callBot]);
			this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns$9.root.callUser]);
			this.commentCallUserNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns$9.root.callUserNoReply]);
			this.commentCallUserOnlyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyFilter, selectorFns$9.root.callUserOnly]);
			this.commentCallUserOnlyNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns$9.root.callUserOnlyNoReply]);
			this.commentEmojiOnlyFilter.isEnable && blackPairs.push([this.commentEmojiOnlyFilter, selectorFns$9.root.emojiOnly]);
			const whitePairs = [];
			this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns$9.root.isUp]);
			this.commentIsPinFilter.isEnable && whitePairs.push([this.commentIsPinFilter, selectorFns$9.root.isPin]);
			this.commentIsNoteFilter.isEnable && whitePairs.push([this.commentIsNoteFilter, selectorFns$9.root.isNote]);
			this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns$9.root.isLink]);
			this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns$9.root.isMe]);
			const forceBlackPairs = [];
			this.commentAdFilter.isEnable && forceBlackPairs.push([this.commentAdFilter, selectorFns$9.root.content]);
			const rootBlackCnt = await coreCheck(rootComments, true, "style", blackPairs, whitePairs, forceBlackPairs, true);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`CommentFilterCommon hide ${rootBlackCnt} in ${rootComments.length} root comments, mode=${mode}, time=${time}`);
		}
		async checkSub(mode) {
			const timer = performance.now();
			let revertAll = false;
			if (!(this.commentUsernameFilter.isEnable || this.commentUsernameKeywordFilter.isEnable || this.commentContentFilter.isEnable || this.commentAdFilter.isEnable || this.commentLevelFilter.isEnable || this.commentNoFaceFilter.isEnable || this.commentBotFilter.isEnable || this.commentCallBotFilter.isEnable || this.commentCallUserFilter.isEnable || this.commentCallUserNoReplyFilter.isEnable || this.commentCallUserOnlyFilter.isEnable || this.commentCallUserOnlyNoReplyFilter.isEnable || this.commentEmojiOnlyFilter.isEnable)) revertAll = true;
			let subComments = [];
			if (ShadowInstance.shadowStore.has("BILI-COMMENT-REPLY-RENDERER")) {
				subComments = Array.from(ShadowInstance.shadowStore.get("BILI-COMMENT-REPLY-RENDERER")).map((v) => v.host);
				if (mode === "incr") subComments = subComments.filter((v) => !v.hasAttribute(config_default.filterVisitSign));
			}
			if (!subComments.length) return;
			if (config_default.isDebugMode) subComments.forEach((v) => {
				logger.debug([
					`CommentFilterCommon subComments`,
					`username: ${selectorFns$9.sub.username(v)}`,
					`content: ${selectorFns$9.sub.content(v)}`,
					`callUser: ${selectorFns$9.sub.callUser(v)}`,
					`callUserNoReply: ${selectorFns$9.sub.callUserNoReply(v)}`,
					`callUserOnly: ${selectorFns$9.sub.callUserOnly(v)}`,
					`callUserOnlyNoReply: ${selectorFns$9.sub.callUserOnlyNoReply(v)}`,
					`level: ${selectorFns$9.sub.level(v)}`,
					`noface: ${selectorFns$9.sub.noface(v)}`,
					`isUp: ${selectorFns$9.sub.isUp(v)}`,
					`isLink: ${selectorFns$9.sub.isLink(v)}`,
					`isMe: ${selectorFns$9.sub.isMe(v)}`,
					`emojiOnly: ${selectorFns$9.sub.emojiOnly(v)}`
				].join("\n"));
			});
			if (isSubWhite || revertAll) {
				subComments.forEach((el) => showEle(el, "style"));
				return;
			}
			const blackPairs = [];
			this.commentUsernameFilter.isEnable && blackPairs.push([this.commentUsernameFilter, selectorFns$9.sub.username]);
			this.commentUsernameKeywordFilter.isEnable && blackPairs.push([this.commentUsernameKeywordFilter, selectorFns$9.sub.username]);
			this.commentContentFilter.isEnable && blackPairs.push([this.commentContentFilter, selectorFns$9.sub.content]);
			this.commentLevelFilter.isEnable && blackPairs.push([this.commentLevelFilter, selectorFns$9.sub.level]);
			this.commentNoFaceFilter.isEnable && blackPairs.push([this.commentNoFaceFilter, selectorFns$9.sub.noface]);
			this.commentBotFilter.isEnable && blackPairs.push([this.commentBotFilter, selectorFns$9.sub.username]);
			this.commentCallBotFilter.isEnable && blackPairs.push([this.commentCallBotFilter, selectorFns$9.sub.callBot]);
			this.commentCallUserFilter.isEnable && blackPairs.push([this.commentCallUserFilter, selectorFns$9.sub.callUser]);
			this.commentCallUserNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserNoReplyFilter, selectorFns$9.sub.callUserNoReply]);
			this.commentCallUserOnlyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyFilter, selectorFns$9.sub.callUserOnly]);
			this.commentCallUserOnlyNoReplyFilter.isEnable && blackPairs.push([this.commentCallUserOnlyNoReplyFilter, selectorFns$9.sub.callUserOnlyNoReply]);
			this.commentEmojiOnlyFilter.isEnable && blackPairs.push([this.commentEmojiOnlyFilter, selectorFns$9.sub.emojiOnly]);
			const whitePairs = [];
			this.commentIsUpFilter.isEnable && whitePairs.push([this.commentIsUpFilter, selectorFns$9.sub.isUp]);
			this.commentIsLinkFilter.isEnable && whitePairs.push([this.commentIsLinkFilter, selectorFns$9.sub.isLink]);
			this.commentIsMeFilter.isEnable && whitePairs.push([this.commentIsMeFilter, selectorFns$9.sub.isMe]);
			const forceBlackPairs = [];
			this.commentAdFilter.isEnable && forceBlackPairs.push([this.commentAdFilter, selectorFns$9.sub.content]);
			const subBlackCnt = await coreCheck(subComments, false, "style", blackPairs, whitePairs, forceBlackPairs, true);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`CommentFilterCommon hide ${subBlackCnt} in ${subComments.length} sub comments, mode=${mode}, time=${time}`);
		}
		check(mode) {
			this.checkRoot(mode).catch((err) => {
				logger.error(`CommentFilterCommon checkRoot mode=${mode} error`, err);
			});
			this.checkSub(mode).catch((err) => {
				logger.error(`CommentFilterCommon checkSub mode=${mode} error`, err);
			});
		}
		observe() {
			ShadowInstance.addShadowObserver("BILI-COMMENTS", new MutationObserver(() => {
				this.checkRoot("incr").catch(() => {});
			}), {
				subtree: true,
				childList: true
			});
			ShadowInstance.addShadowObserver("BILI-COMMENT-REPLIES-RENDERER", new MutationObserver(() => {
				this.checkSub("full").catch(() => {});
			}), {
				subtree: true,
				childList: true
			});
		}
	};
	var mainFilter$9 = new CommentFilterCommon();
	var commentFilterCommonEntry = async () => {
		mainFilter$9.init();
		mainFilter$9.commentIsMeFilter.enable();
		mainFilter$9.observe();
	};
	var commentFilterCommonGroups = [
		{
			name: "评论用户过滤",
			items: [
				{
					type: "switch",
					id: GM_KEYS$9.black.username.statusKey,
					name: "启用 评论用户过滤 (右键单击用户名)",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentUsernameFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentUsernameFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "editor",
					id: GM_KEYS$9.black.username.valueKey,
					name: "编辑 评论用户黑名单",
					description: ["本黑名单与UP主黑名单互不影响", "右键屏蔽的用户会出现在首行"],
					editorTitle: "评论区 用户黑名单",
					editorDescription: ["每行一个用户名，保存时自动去重"],
					saveFn: async () => {
						mainFilter$9.commentUsernameFilter.setParam(_GM_getValue(GM_KEYS$9.black.username.valueKey, []));
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.usernameKeyword.statusKey,
					name: "启用 评论用户昵称关键词过滤",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentUsernameKeywordFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentUsernameKeywordFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "editor",
					id: GM_KEYS$9.black.usernameKeyword.valueKey,
					name: "编辑 评论用户昵称关键词黑名单",
					editorTitle: "评论区 用户黑名单",
					editorDescription: [
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$9.commentUsernameKeywordFilter.setParam(_GM_getValue(GM_KEYS$9.black.usernameKeyword.valueKey, []));
						mainFilter$9.check("full");
					}
				}
			]
		},
		{
			name: "评论内容过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$9.black.content.statusKey,
				name: "启用 评论关键词过滤",
				noStyle: true,
				enableFn: () => {
					mainFilter$9.commentContentFilter.enable();
					mainFilter$9.check("full");
				},
				disableFn: () => {
					mainFilter$9.commentContentFilter.disable();
					mainFilter$9.check("full");
				}
			}, {
				type: "editor",
				id: GM_KEYS$9.black.content.valueKey,
				name: "编辑 评论关键词黑名单",
				editorTitle: "评论关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$9.commentContentFilter.setParam(_GM_getValue(GM_KEYS$9.black.content.valueKey, []));
					mainFilter$9.check("full");
				}
			}]
		},
		{
			name: "按类型过滤",
			items: [
				{
					type: "switch",
					id: GM_KEYS$9.black.callBot.statusKey,
					name: "过滤 召唤AI的评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentCallBotFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentCallBotFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.bot.statusKey,
					name: "过滤 AI发布的评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentBotFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentBotFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.isAD.statusKey,
					name: "过滤 带货评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentAdFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentAdFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.emojiOnly.statusKey,
					name: "过滤 只有表情的评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentEmojiOnlyFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentEmojiOnlyFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.noface.statusKey,
					name: "过滤 默认头像非会员用户评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentNoFaceFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentNoFaceFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.callUserOnly.statusKey,
					name: "过滤 只含 @其他用户 的全部评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentCallUserOnlyFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentCallUserOnlyFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.callUserOnlyNoReply.statusKey,
					name: "过滤 只含 @其他用户 的无回复评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentCallUserOnlyNoReplyFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentCallUserOnlyNoReplyFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.callUser.statusKey,
					name: "过滤 包含 @其他用户 的全部评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentCallUserFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentCallUserFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.black.callUserNoReply.statusKey,
					name: "过滤 包含 @其他用户 的无回复评论",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentCallUserNoReplyFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentCallUserNoReplyFilter.disable();
						mainFilter$9.check("full");
					}
				}
			]
		},
		{
			name: "等级过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$9.black.level.statusKey,
				name: "启用 用户等级过滤",
				noStyle: true,
				enableFn: () => {
					mainFilter$9.commentLevelFilter.enable();
					mainFilter$9.check("full");
				},
				disableFn: () => {
					mainFilter$9.commentLevelFilter.disable();
					mainFilter$9.check("full");
				}
			}, {
				type: "number",
				id: GM_KEYS$9.black.level.valueKey,
				noStyle: true,
				name: "设定最低等级 (0~6)",
				minValue: 0,
				maxValue: 6,
				step: 1,
				defaultValue: 0,
				disableValue: 0,
				fn: (value) => {
					mainFilter$9.commentLevelFilter.setParam(value);
					mainFilter$9.check("full");
				}
			}]
		},
		{
			name: "白名单 免过滤",
			items: [
				{
					type: "switch",
					id: GM_KEYS$9.white.root.statusKey,
					name: "一级评论(主评论) 免过滤",
					noStyle: true,
					enableFn: () => {
						isRootWhite = true;
						mainFilter$9.check("full");
					},
					disableFn: () => {
						isRootWhite = false;
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.white.sub.statusKey,
					name: "二级评论(回复) 免过滤",
					noStyle: true,
					enableFn: () => {
						isSubWhite = true;
						mainFilter$9.check("full");
					},
					disableFn: () => {
						isSubWhite = false;
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.white.isUp.statusKey,
					name: "UP主的评论 免过滤",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentIsUpFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentIsUpFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.white.isPin.statusKey,
					name: "置顶评论 免过滤",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentIsPinFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentIsPinFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.white.isNote.statusKey,
					name: "笔记/图片评论 免过滤",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentIsNoteFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentIsNoteFilter.disable();
						mainFilter$9.check("full");
					}
				},
				{
					type: "switch",
					id: GM_KEYS$9.white.isLink.statusKey,
					name: "含超链接的评论 免过滤",
					noStyle: true,
					enableFn: () => {
						mainFilter$9.commentIsLinkFilter.enable();
						mainFilter$9.check("full");
					},
					disableFn: () => {
						mainFilter$9.commentIsLinkFilter.disable();
						mainFilter$9.check("full");
					}
				}
			]
		}
	];
	var commentFilterCommonHandler = (target) => {
		if (!(isPageVideo() || isPagePlaylist() || isPageBangumi() || isPageDynamic() || isPageSpace())) return [];
		const menus = [];
		if (target.parentElement?.id === "user-name" || target.classList.contains("user-name") || target.classList.contains("sub-user-name")) {
			const username = target.textContent?.trim();
			if (username && mainFilter$9.commentUsernameFilter.isEnable) menus.push({
				name: `屏蔽用户：${username}`,
				fn: async () => {
					try {
						mainFilter$9.commentUsernameFilter.addParam(username);
						mainFilter$9.check("full");
						const arr = _GM_getValue(GM_KEYS$9.black.username.valueKey, []);
						arr.unshift(username);
						_GM_setValue(GM_KEYS$9.black.username.valueKey, orderedUniq(arr));
					} catch (err) {
						logger.error(`commentFilterCommonHandler add username ${username} failed`, err);
					}
				}
			});
		}
		return menus;
	};
	var DynUploaderFilter = class extends StringFilter {};
	var DynDurationFilter = class extends NumberMinFilter {};
	var DynVideoTitleFilter = class extends KeywordFilter {};
	var DynContentFilter = class extends KeywordFilter {};
	var DynDynVideoFilter = class extends BooleanFilter {};
	var DynPlaybackFilter = class extends BooleanFilter {};
	var DynVideoTitleWhiteFilter = class extends KeywordFilter {};
	var DynContentWhiteFilter = class extends KeywordFilter {};
	var GM_KEYS$8 = {
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
			},
			dynVideo: { statusKey: "dyn-dyn-video-filter-status" },
			playback: { statusKey: "dyn-playback-filter-status" }
		},
		white: {
			title: {
				statusKey: "dyn-video-title-white-filter-status",
				valueKey: "global-title-keyword-whitelist-filter-value"
			},
			content: {
				statusKey: "dyn-content-white-filter-status",
				valueKey: "global-content-keyword-whitelist-filter-value"
			}
		}
	};
	var isAllDyn = true;
	var selectorFns$8 = {
		uploader: (dyn) => {
			if (!isAllDyn) return;
			return dyn.querySelector(".bili-dyn-title__text")?.textContent?.trim();
		},
		duration: (dyn) => {
			const time = dyn.querySelector(".bili-dyn-card-video__cover-shadow .duration-time, .bili-dyn-card-video__duration")?.textContent?.trim();
			return time ? convertTimeToSec(time) : void 0;
		},
		title: (dyn) => {
			return dyn.querySelector(".bili-dyn-card-video__title")?.textContent?.trim();
		},
		content: (dyn) => {
			return Array.from(dyn.querySelectorAll(`.bili-dyn-content :is(
                    .dyn-card-opus__title,
                    .bili-rich-text__content > span:not(.bili-rich-text-module.at),
                    .dyn-card-opus__summary span
                )`)).map((v) => v?.textContent?.trim()).filter((v) => v?.trim()).join("\n");
		},
		dynVideo: (dyn) => {
			return !!dyn.querySelector(".bili-dyn-time")?.textContent?.includes("动态视频");
		},
		playback: (dyn) => {
			return !!dyn.querySelector(".bili-dyn-time")?.textContent?.includes("直播回放");
		}
	};
	var DynamicFilterDynamic = class {
		target;
		dynUploaderFilter = new DynUploaderFilter();
		dynDurationFilter = new DynDurationFilter();
		dynVideoTitleFilter = new DynVideoTitleFilter();
		dynContentFilter = new DynContentFilter();
		dynDynVideoFilter = new DynDynVideoFilter();
		dynPlaybackFilter = new DynPlaybackFilter();
		dynVideoTitleWhiteFilter = new DynVideoTitleWhiteFilter();
		dynContentWhiteFilter = new DynContentWhiteFilter();
		init() {
			this.dynUploaderFilter.setParam(_GM_getValue(GM_KEYS$8.black.uploader.valueKey, []));
			this.dynDurationFilter.setParam(_GM_getValue(GM_KEYS$8.black.duration.valueKey, 0));
			this.dynVideoTitleFilter.setParam(_GM_getValue(GM_KEYS$8.black.title.valueKey, []));
			this.dynContentFilter.setParam(_GM_getValue(GM_KEYS$8.black.content.valueKey, []));
			this.dynVideoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$8.white.title.valueKey, []));
			this.dynContentWhiteFilter.setParam(_GM_getValue(GM_KEYS$8.white.content.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.dynUploaderFilter.isEnable || this.dynDurationFilter.isEnable || this.dynVideoTitleFilter.isEnable || this.dynContentFilter.isEnable || this.dynDynVideoFilter.isEnable || this.dynPlaybackFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			isAllDyn = !!this.target.querySelector(".bili-dyn-list-tabs");
			let selector = `.bili-dyn-list__item`;
			if (mode === "incr") selector += `:not([${config_default.filterVisitSign}])`;
			const dyns = Array.from(this.target.querySelectorAll(selector));
			if (!dyns.length) return;
			if (revertAll) {
				dyns.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) dyns.forEach((v) => {
				logger.debug([
					`DynamicFilterDynamic`,
					`uploader: ${selectorFns$8.uploader(v)}`,
					`title: ${selectorFns$8.title(v)}`,
					`duration: ${selectorFns$8.duration(v)}`,
					`content: ${selectorFns$8.content(v)}`,
					`shortVideo: ${selectorFns$8.dynVideo(v)}`,
					`playback: ${selectorFns$8.playback(v)}`
				].join("\n"));
			});
			const filteredDyns = dyns.filter((dyn) => !!dyn.querySelector(".bili-dyn-item__body, .bili-dyn-item__header"));
			const blackPairs = [];
			this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns$8.uploader]);
			this.dynDurationFilter.isEnable && blackPairs.push([this.dynDurationFilter, selectorFns$8.duration]);
			this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns$8.title]);
			this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns$8.content]);
			this.dynDynVideoFilter.isEnable && blackPairs.push([this.dynDynVideoFilter, selectorFns$8.dynVideo]);
			this.dynPlaybackFilter.isEnable && blackPairs.push([this.dynPlaybackFilter, selectorFns$8.playback]);
			const whitePairs = [];
			this.dynVideoTitleWhiteFilter.isEnable && whitePairs.push([this.dynVideoTitleWhiteFilter, selectorFns$8.title]);
			this.dynContentWhiteFilter.isEnable && whitePairs.push([this.dynContentWhiteFilter, selectorFns$8.content]);
			const blackCnt = await coreCheck(filteredDyns, true, "sign", blackPairs, whitePairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`DynamicFilterDynamic hide ${blackCnt} in ${filteredDyns.length} dyns, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("DynamicFilterDynamic check full error", err);
			});
		}
		checkIncr() {
			this.check("incr").catch((err) => {
				logger.error("DynamicFilterDynamic check incr error", err);
			});
		}
		observe() {
			waitForEle(document, ".bili-dyn-home--member", (node) => node.className === "bili-dyn-home--member").then((ele) => {
				if (!ele) return;
				logger.debug("DynamicFilterDynamic target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkIncr();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$8 = new DynamicFilterDynamic();
	var dynamicFilterDynamicEntry = async () => {
		mainFilter$8.init();
		mainFilter$8.observe();
	};
	var dynamicFilterDynamicGroups = [
		{
			name: "动态发布人过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$8.black.uploader.statusKey,
				name: "启用 动态发布人过滤 (右键单击用户名)",
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynUploaderFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynUploaderFilter.disable();
					mainFilter$8.checkFull();
				}
			}, {
				type: "editor",
				id: GM_KEYS$8.black.uploader.valueKey,
				name: "编辑 动态发布用户黑名单",
				editorTitle: "动态发布用户 黑名单",
				description: ["右键屏蔽的用户会出现在首行"],
				editorDescription: ["一行一个用户名，保存时自动去重"],
				saveFn: async () => {
					mainFilter$8.dynUploaderFilter.setParam(_GM_getValue(GM_KEYS$8.black.uploader.valueKey, []));
					mainFilter$8.checkFull();
				}
			}]
		},
		{
			name: "动态内视频时长过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$8.black.duration.statusKey,
				name: "启用 时长过滤",
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynDurationFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynDurationFilter.disable();
					mainFilter$8.checkFull();
				}
			}, {
				type: "number",
				id: GM_KEYS$8.black.duration.valueKey,
				name: "设定最低时长（0~300s）",
				noStyle: true,
				minValue: 0,
				maxValue: 300,
				step: 1,
				defaultValue: 60,
				disableValue: 0,
				addonText: "秒",
				fn: (value) => {
					mainFilter$8.dynDurationFilter.setParam(value);
					mainFilter$8.checkFull();
				}
			}]
		},
		{
			name: "动态内视频标题过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$8.black.title.statusKey,
				name: "启用 视频标题关键词过滤",
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynVideoTitleFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynVideoTitleFilter.disable();
					mainFilter$8.checkFull();
				}
			}, {
				type: "editor",
				id: GM_KEYS$8.black.title.valueKey,
				name: "编辑 视频标题关键词黑名单",
				editorTitle: "视频标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$8.dynVideoTitleFilter.setParam(_GM_getValue(GM_KEYS$8.black.title.valueKey, []));
					mainFilter$8.checkFull();
				}
			}]
		},
		{
			name: "动态内容过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$8.black.content.statusKey,
				name: "启用 动态内容关键词过滤",
				description: ["不覆盖动态内视频标题"],
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynContentFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynContentFilter.disable();
					mainFilter$8.checkFull();
				}
			}, {
				type: "editor",
				id: GM_KEYS$8.black.content.valueKey,
				name: "编辑 动态内容关键词黑名单",
				editorTitle: "动态内容关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$8.dynContentFilter.setParam(_GM_getValue(GM_KEYS$8.black.content.valueKey, []));
					mainFilter$8.checkFull();
				}
			}]
		},
		{
			name: "按类型过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$8.black.dynVideo.statusKey,
				name: "过滤 动态视频",
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynDynVideoFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynDynVideoFilter.disable();
					mainFilter$8.checkFull();
				}
			}, {
				type: "switch",
				id: GM_KEYS$8.black.playback.statusKey,
				name: "过滤 直播回放",
				noStyle: true,
				enableFn: () => {
					mainFilter$8.dynPlaybackFilter.enable();
					mainFilter$8.checkFull();
				},
				disableFn: () => {
					mainFilter$8.dynPlaybackFilter.disable();
					mainFilter$8.checkFull();
				}
			}]
		},
		{
			name: "白名单 免过滤",
			items: [
				{
					type: "switch",
					id: GM_KEYS$8.white.title.statusKey,
					name: "启用 标题关键词白名单",
					noStyle: true,
					enableFn: () => {
						mainFilter$8.dynVideoTitleWhiteFilter.enable();
						mainFilter$8.checkFull();
					},
					disableFn: () => {
						mainFilter$8.dynVideoTitleWhiteFilter.disable();
						mainFilter$8.checkFull();
					}
				},
				{
					type: "editor",
					id: GM_KEYS$8.white.title.valueKey,
					name: "编辑 标题关键词白名单",
					editorTitle: "标题关键词 白名单",
					editorDescription: [
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$8.dynVideoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$8.white.title.valueKey, []));
						mainFilter$8.checkFull();
					}
				},
				{
					type: "switch",
					id: GM_KEYS$8.white.content.statusKey,
					name: "启用 动态内容关键词白名单",
					description: ["不覆盖动态内视频标题"],
					noStyle: true,
					enableFn: () => {
						mainFilter$8.dynContentWhiteFilter.enable();
						mainFilter$8.checkFull();
					},
					disableFn: () => {
						mainFilter$8.dynContentWhiteFilter.disable();
						mainFilter$8.checkFull();
					}
				},
				{
					type: "editor",
					id: GM_KEYS$8.white.content.valueKey,
					name: "编辑 动态内容关键词白名单",
					editorTitle: "动态内容关键词 白名单",
					editorDescription: [
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$8.dynContentWhiteFilter.setParam(_GM_getValue(GM_KEYS$8.white.content.valueKey, []));
						mainFilter$8.checkFull();
					}
				}
			]
		}
	];
	var dynamicFilterDynamicHandler = (target) => {
		if (!isPageDynamic()) return [];
		const menus = [];
		if (target.classList.contains("bili-dyn-title__text")) {
			const uploader = target.textContent?.trim();
			if (uploader && mainFilter$8.dynUploaderFilter.isEnable) menus.push({
				name: `隐藏用户动态：${uploader}`,
				fn: async () => {
					try {
						mainFilter$8.dynUploaderFilter.addParam(uploader);
						mainFilter$8.checkFull();
						const arr = _GM_getValue(GM_KEYS$8.black.uploader.valueKey, []);
						arr.unshift(uploader);
						_GM_setValue(GM_KEYS$8.black.uploader.valueKey, orderedUniq(arr));
					} catch (err) {
						logger.error(`dynamicFilterDynamicHandler add uploader ${uploader} failed`, err);
					}
				}
			});
		}
		return menus;
	};
	var GM_KEYS$7 = {
		black: {
			uploader: {
				statusKey: "dyn-uploader-filter-status",
				valueKey: "dyn-uploader-filter-value"
			},
			title: {
				statusKey: "dyn-title-keyword-filter-status",
				valueKey: "global-title-keyword-filter-value"
			},
			content: {
				statusKey: "dyn-content-keyword-filter-status",
				valueKey: "global-content-keyword-filter-value"
			}
		},
		white: {
			title: {
				statusKey: "dyn-video-title-white-filter-status",
				valueKey: "global-title-keyword-whitelist-filter-value"
			},
			content: {
				statusKey: "dyn-content-white-filter-status",
				valueKey: "global-content-keyword-whitelist-filter-value"
			}
		}
	};
	var selectorFns$7 = {
		uploader: (dyn) => {
			return dyn.querySelector(".user-name")?.textContent?.trim();
		},
		title: (dyn) => {
			return dyn.querySelector(".all-in-one-article-title:not(:has(.article-tag))")?.textContent?.trim();
		},
		content: (dyn) => {
			return dyn.querySelector(".all-in-one-article-title:has(.article-tag)")?.textContent?.replace("专栏", "").trim();
		}
	};
	var DynamicFilterHeader = class {
		target;
		dynUploaderFilter = new DynUploaderFilter();
		dynVideoTitleFilter = new DynVideoTitleFilter();
		dynContentFilter = new DynContentFilter();
		dynVideoTitleWhiteFilter = new DynVideoTitleWhiteFilter();
		dynContentWhiteFilter = new DynContentWhiteFilter();
		init() {
			this.dynUploaderFilter.setParam(_GM_getValue(GM_KEYS$7.black.uploader.valueKey, []));
			this.dynVideoTitleFilter.setParam(_GM_getValue(GM_KEYS$7.black.title.valueKey, []));
			this.dynContentFilter.setParam(_GM_getValue(GM_KEYS$7.black.content.valueKey, []));
			this.dynVideoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$7.white.title.valueKey, []));
			this.dynContentWhiteFilter.setParam(_GM_getValue(GM_KEYS$7.white.content.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			const timer = performance.now();
			let selector = `#biliHeaderDynScrollCon .dynamic-all > a`;
			if (mode === "incr") selector += `:not([${config_default.filterVisitSign}])`;
			const dyns = Array.from(this.target.querySelectorAll(selector));
			if (!dyns.length) return;
			if (config_default.isDebugMode) dyns.forEach((v) => {
				logger.debug([
					`DynamicFilterHeader`,
					`uploader: ${selectorFns$7.uploader(v)}`,
					`title: ${selectorFns$7.title(v)}`,
					`content: ${selectorFns$7.content(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.dynUploaderFilter.isEnable && blackPairs.push([this.dynUploaderFilter, selectorFns$7.uploader]);
			this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns$7.title]);
			this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns$7.content]);
			const whitePairs = [];
			this.dynVideoTitleWhiteFilter.isEnable && whitePairs.push([this.dynVideoTitleWhiteFilter, selectorFns$7.title]);
			this.dynContentWhiteFilter.isEnable && whitePairs.push([this.dynContentWhiteFilter, selectorFns$7.content]);
			const blackCnt = await coreCheck(dyns, true, "style", blackPairs, whitePairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`DynamicFilterHeader hide ${blackCnt} in ${dyns.length} dyns, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("DynamicFilterHeader check full error", err);
			});
		}
		observe() {
			let cnt = 0;
			const id = setInterval(() => {
				const ele = document.querySelector(".right-entry");
				if (ele) {
					clearInterval(id);
					logger.debug("DynamicFilterHeader target appear");
					this.target = ele;
					this.checkFull();
					new MutationObserver(() => {
						this.checkFull();
					}).observe(this.target, {
						childList: true,
						subtree: true
					});
				}
				++cnt > 10 && clearInterval(id);
			}, 1e3);
		}
	};
	var mainFilter$7 = new DynamicFilterHeader();
	var dynamicFilterHeaderEntry = async () => {
		mainFilter$7.init();
		mainFilter$7.observe();
		if (_GM_getValue(GM_KEYS$7.black.uploader.statusKey)) mainFilter$7.dynUploaderFilter.enable();
		if (_GM_getValue(GM_KEYS$7.black.title.statusKey)) mainFilter$7.dynVideoTitleFilter.enable();
		if (_GM_getValue(GM_KEYS$7.black.content.statusKey)) mainFilter$7.dynContentFilter.enable();
		if (_GM_getValue(GM_KEYS$7.white.title.statusKey)) mainFilter$7.dynVideoTitleWhiteFilter.enable();
		if (_GM_getValue(GM_KEYS$7.white.content.statusKey)) mainFilter$7.dynContentWhiteFilter.enable();
	};
	var GM_KEYS$6 = {
		black: {
			duration: {
				statusKey: "space-dyn-duration-filter-status",
				valueKey: "global-duration-filter-value"
			},
			title: {
				statusKey: "space-dyn-title-keyword-filter-status",
				valueKey: "global-title-keyword-filter-value"
			},
			content: {
				statusKey: "space-dyn-content-keyword-filter-status",
				valueKey: "global-content-keyword-filter-value"
			},
			dynVideo: { statusKey: "space-dyn-video-filter-status" },
			playback: { statusKey: "space-playback-filter-status" }
		},
		white: {
			title: {
				statusKey: "space-dyn-video-title-white-filter-status",
				valueKey: "global-title-keyword-whitelist-filter-value"
			},
			content: {
				statusKey: "space-dyn-content-white-filter-status",
				valueKey: "global-content-keyword-whitelist-filter-value"
			}
		}
	};
	var selectorFns$6 = {
		duration: (dyn) => {
			const time = dyn.querySelector(".bili-dyn-card-video__cover-shadow .duration-time")?.textContent?.trim();
			return time ? convertTimeToSec(time) : void 0;
		},
		title: (dyn) => {
			return dyn.querySelector(".bili-dyn-card-video__title")?.textContent?.trim();
		},
		content: (dyn) => {
			return Array.from(dyn.querySelectorAll(`.bili-dyn-content :is(
                    .dyn-card-opus__title,
                    .bili-rich-text__content > span:not(.bili-rich-text-module.at),
                    .dyn-card-opus__summary span
                )`)).map((v) => v?.textContent?.trim()).filter((v) => v?.trim()).join("\n");
		},
		dynVideo: (dyn) => {
			return !!dyn.querySelector(".bili-dyn-time")?.textContent?.includes("动态视频");
		},
		playback: (dyn) => {
			return !!dyn.querySelector(".bili-dyn-time")?.textContent?.includes("直播回放");
		}
	};
	var DynamicFilterSpace = class {
		target;
		dynDurationFilter = new DynDurationFilter();
		dynVideoTitleFilter = new DynVideoTitleFilter();
		dynContentFilter = new DynContentFilter();
		dynDynVideoFilter = new DynDynVideoFilter();
		dynPlaybackFilter = new DynPlaybackFilter();
		dynVideoTitleWhiteFilter = new DynVideoTitleWhiteFilter();
		dynContentWhiteFilter = new DynContentWhiteFilter();
		init() {
			this.dynDurationFilter.setParam(_GM_getValue(GM_KEYS$6.black.duration.valueKey, 0));
			this.dynVideoTitleFilter.setParam(_GM_getValue(GM_KEYS$6.black.title.valueKey, []));
			this.dynContentFilter.setParam(_GM_getValue(GM_KEYS$6.black.content.valueKey, []));
			this.dynVideoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$6.white.title.valueKey, []));
			this.dynContentWhiteFilter.setParam(_GM_getValue(GM_KEYS$6.white.content.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			if (!/https:\/\/space.bilibili.com\/\d+\/dynamic/.test(location.href)) return;
			let revertAll = false;
			if (!(this.dynDurationFilter.isEnable || this.dynVideoTitleFilter.isEnable || this.dynContentFilter.isEnable || this.dynDynVideoFilter.isEnable || this.dynPlaybackFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			let selector = `.bili-dyn-list__item`;
			if (mode === "incr") selector += `:not([${config_default.filterVisitSign}])`;
			const dyns = Array.from(this.target.querySelectorAll(selector));
			if (!dyns.length) return;
			if (revertAll) {
				dyns.forEach((v) => showEle(v, "sign"));
				return;
			}
			const filteredDyns = dyns.filter((dyn) => !!dyn.querySelector(".bili-dyn-item__body, .bili-dyn-item__header"));
			if (config_default.isDebugMode) dyns.forEach((v) => {
				logger.debug([
					`DynamicFilterSpace`,
					`title: ${selectorFns$6.title(v)}`,
					`duration: ${selectorFns$6.duration(v)}`,
					`content: ${selectorFns$6.content(v)}`,
					`shortVideo: ${selectorFns$6.dynVideo(v)}`,
					`playback: ${selectorFns$6.playback(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.dynDurationFilter.isEnable && blackPairs.push([this.dynDurationFilter, selectorFns$6.duration]);
			this.dynVideoTitleFilter.isEnable && blackPairs.push([this.dynVideoTitleFilter, selectorFns$6.title]);
			this.dynContentFilter.isEnable && blackPairs.push([this.dynContentFilter, selectorFns$6.content]);
			this.dynDynVideoFilter.isEnable && blackPairs.push([this.dynDynVideoFilter, selectorFns$6.dynVideo]);
			this.dynPlaybackFilter.isEnable && blackPairs.push([this.dynPlaybackFilter, selectorFns$6.playback]);
			const whitePairs = [];
			this.dynVideoTitleWhiteFilter.isEnable && whitePairs.push([this.dynVideoTitleWhiteFilter, selectorFns$6.title]);
			this.dynContentWhiteFilter.isEnable && whitePairs.push([this.dynContentWhiteFilter, selectorFns$6.content]);
			const blackCnt = await coreCheck(filteredDyns, true, "sign", blackPairs, whitePairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`DynamicFilterSpace hide ${blackCnt} in ${filteredDyns.length} dyns, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("DynamicFilterSpace check full error", err);
			});
		}
		checkIncr() {
			this.check("incr").catch((err) => {
				logger.error("DynamicFilterSpace check incr error", err);
			});
		}
		observe() {
			waitForEle(document, "#app", (node) => node.id === "app").then((ele) => {
				if (!ele) return;
				logger.debug("DynamicFilterSpace target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkIncr();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$6 = new DynamicFilterSpace();
	var dynamicFilterSpaceEntry = async () => {
		mainFilter$6.init();
		mainFilter$6.observe();
	};
	var dynamicFilterSpaceGroups = [
		{
			name: "动态内视频时长过滤",
			items: [{
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
			}, {
				type: "number",
				id: GM_KEYS$6.black.duration.valueKey,
				name: "设定最低时长（0~300s）",
				noStyle: true,
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
			}]
		},
		{
			name: "动态内视频标题过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$6.black.title.statusKey,
				name: "启用 视频标题关键词过滤",
				noStyle: true,
				enableFn: () => {
					mainFilter$6.dynVideoTitleFilter.enable();
					mainFilter$6.checkFull();
				},
				disableFn: () => {
					mainFilter$6.dynVideoTitleFilter.disable();
					mainFilter$6.checkFull();
				}
			}, {
				type: "editor",
				id: GM_KEYS$6.black.title.valueKey,
				name: "编辑 视频标题关键词黑名单",
				editorTitle: "视频标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$6.dynVideoTitleFilter.setParam(_GM_getValue(GM_KEYS$6.black.title.valueKey, []));
					mainFilter$6.checkFull();
				}
			}]
		},
		{
			name: "动态内容过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$6.black.content.statusKey,
				name: "启用 动态内容关键词过滤",
				description: ["不覆盖动态内视频标题"],
				noStyle: true,
				enableFn: () => {
					mainFilter$6.dynContentFilter.enable();
					mainFilter$6.checkFull();
				},
				disableFn: () => {
					mainFilter$6.dynContentFilter.disable();
					mainFilter$6.checkFull();
				}
			}, {
				type: "editor",
				id: GM_KEYS$6.black.content.valueKey,
				name: "编辑 动态内容关键词黑名单",
				editorTitle: "动态内容关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$6.dynContentFilter.setParam(_GM_getValue(GM_KEYS$6.black.content.valueKey, []));
					mainFilter$6.checkFull();
				}
			}]
		},
		{
			name: "按类型过滤",
			items: [{
				type: "switch",
				id: GM_KEYS$6.black.dynVideo.statusKey,
				name: "过滤 动态视频",
				noStyle: true,
				enableFn: () => {
					mainFilter$6.dynDynVideoFilter.enable();
					mainFilter$6.checkFull();
				},
				disableFn: () => {
					mainFilter$6.dynDynVideoFilter.disable();
					mainFilter$6.checkFull();
				}
			}, {
				type: "switch",
				id: GM_KEYS$6.black.playback.statusKey,
				name: "过滤 直播回放",
				noStyle: true,
				enableFn: () => {
					mainFilter$6.dynPlaybackFilter.enable();
					mainFilter$6.checkFull();
				},
				disableFn: () => {
					mainFilter$6.dynPlaybackFilter.disable();
					mainFilter$6.checkFull();
				}
			}]
		},
		{
			name: "白名单 免过滤",
			items: [
				{
					type: "switch",
					id: GM_KEYS$6.white.title.statusKey,
					name: "启用 标题关键词白名单",
					noStyle: true,
					enableFn: () => {
						mainFilter$6.dynVideoTitleWhiteFilter.enable();
						mainFilter$6.checkFull();
					},
					disableFn: () => {
						mainFilter$6.dynVideoTitleWhiteFilter.disable();
						mainFilter$6.checkFull();
					}
				},
				{
					type: "editor",
					id: GM_KEYS$6.white.title.valueKey,
					name: "编辑 标题关键词白名单",
					editorTitle: "标题关键词 白名单",
					editorDescription: [
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$6.dynVideoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$6.white.title.valueKey, []));
						mainFilter$6.checkFull();
					}
				},
				{
					type: "switch",
					id: GM_KEYS$6.white.content.statusKey,
					name: "启用 动态内容关键词白名单",
					description: ["不覆盖动态内视频标题"],
					noStyle: true,
					enableFn: () => {
						mainFilter$6.dynContentWhiteFilter.enable();
						mainFilter$6.checkFull();
					},
					disableFn: () => {
						mainFilter$6.dynContentWhiteFilter.disable();
						mainFilter$6.checkFull();
					}
				},
				{
					type: "editor",
					id: GM_KEYS$6.white.content.valueKey,
					name: "编辑 动态内容关键词白名单",
					editorTitle: "动态内容关键词 白名单",
					editorDescription: [
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$6.dynContentWhiteFilter.setParam(_GM_getValue(GM_KEYS$6.white.content.valueKey, []));
						mainFilter$6.checkFull();
					}
				}
			]
		}
	];
	var NumberMaxFilter = class {
		isEnable = false;
		threshold = 0;
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
	};
	var VideoBvidFilter = class extends StringFilter {};
	var VideoDimensionFilter = class extends BooleanFilter {};
	var VideoDurationFilter = class extends NumberMinFilter {};
	var VideoQualityFilter = class extends NumberMinFilter {};
	var VideoTitleFilter = class extends KeywordFilter {};
	var VideoPubdateFilter = class extends NumberMaxFilter {};
	var VideoUploaderFilter = class extends StringFilter {};
	var VideoUploaderKeywordFilter = class extends KeywordFilter {};
	var VideoViewsFilter = class extends NumberMinFilter {};
	var VideoUploaderWhiteFilter = class extends StringFilter {};
	var VideoTitleWhiteFilter = class extends KeywordFilter {};
	var VideoIsFollowWhiteFilter = class extends BooleanFilter {};
	var GM_KEYS$5 = {
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
	var selectorFns$5 = {
		duration: (video) => {
			const duration = video.querySelector(".bili-cover-card__stats .bili-cover-card__stat:last-child span")?.textContent?.trim();
			return (duration && convertTimeToSec(duration)) ?? void 0;
		},
		title: (video) => {
			return video.querySelector(".bili-video-card__title a")?.textContent?.trim();
		},
		pubdate: (video) => {
			const text = video.querySelector(".bili-video-card__author .bili-video-card__text:nth-child(2)")?.textContent?.trim();
			if (text) {
				const pubdate = text.split(" · ")[1]?.trim();
				if (pubdate) return convertDateToDays(pubdate);
			}
		},
		bvid: (video) => {
			const href = video.querySelector(".bili-video-card__title a")?.getAttribute("href") || video.querySelector(".bili-cover-card")?.getAttribute("href");
			return (href && matchBvid(href)) ?? void 0;
		},
		uploader: (video) => {
			const text = video.querySelector(".bili-video-card__author .bili-video-card__text:nth-child(2)")?.textContent?.trim();
			if (text) return text.split(" · ")[0].trim();
		}
	};
	var VideoFilterChannel = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoPubdateFilter = new VideoPubdateFilter();
		videoUploaderFilter = new VideoUploaderFilter();
		videoUploaderKeywordFilter = new VideoUploaderKeywordFilter();
		videoUploaderWhiteFilter = new VideoUploaderWhiteFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$5.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS$5.black.duration.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$5.black.title.valueKey, []));
			this.videoPubdateFilter.setParam(_GM_getValue(GM_KEYS$5.black.pubdate.valueKey, 0));
			this.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$5.black.uploader.valueKey, []));
			this.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$5.black.uploaderKeyword.valueKey, []));
			this.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$5.white.uploader.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$5.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoPubdateFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			let selector = `.feed-card`;
			if (mode === "incr") selector += `:not([${config_default.filterVisitSign}])`;
			const videos = Array.from(this.target.querySelectorAll(selector));
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterChannel`,
					`bvid: ${selectorFns$5.bvid(v)}`,
					`duration: ${selectorFns$5.duration(v)}`,
					`title: ${selectorFns$5.title(v)}`,
					`uploader: ${selectorFns$5.uploader(v)}`,
					`pubdate: ${selectorFns$5.pubdate(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$5.duration]);
			this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$5.title]);
			this.videoPubdateFilter.isEnable && blackPairs.push([this.videoPubdateFilter, selectorFns$5.pubdate]);
			this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$5.uploader]);
			this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$5.uploader]);
			const whitePairs = [];
			this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$5.uploader]);
			this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$5.title]);
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns$5.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterChannel hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("VideoFilterChannel check full error", err);
			});
		}
		checkIncr() {
			this.check("incr").catch((err) => {
				logger.error("VideoFilterChannel check incr error", err);
			});
		}
		observe() {
			waitForEle(document, "#app", (node) => {
				return node.id === "app";
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterChannel target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkIncr();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$5 = new VideoFilterChannel();
	var videoFilterChannelEntry = async () => {
		mainFilter$5.init();
		mainFilter$5.observe();
	};
	var videoFilterChannelGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
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
						mainFilter$5.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$5.black.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$5.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$5.black.uploaderKeyword.valueKey, []));
						mainFilter$5.checkFull();
					}
				}
			]
		},
		{
			name: "标题关键词过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$5.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$5.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$5.black.title.valueKey, []));
					mainFilter$5.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$5.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter$5.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$5.black.bvid.valueKey, []));
					mainFilter$5.checkFull();
				}
			}]
		},
		{
			name: "发布日期过滤",
			fold: true,
			items: [{
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
			}, {
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
			}]
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
						mainFilter$5.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$5.white.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$5.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$5.white.title.valueKey, []));
						mainFilter$5.checkFull();
					}
				}
			]
		}
	];
	var videoFilterChannelHandler = (target) => {
		if (!isPageChannel()) return [];
		const menus = [];
		if (target.closest(".bili-video-card__author")) {
			const uploader = target.closest(".bili-video-card__author")?.querySelector(".bili-video-card__text:last-child")?.textContent?.split(" · ")[0].trim();
			const spaceUrl = (target.closest(".bili-video-card__author")?.href.trim())?.match(/space\.bilibili\.com\/\d+/)?.[0];
			if (uploader) {
				if (mainFilter$5.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter$5.videoUploaderFilter.addParam(uploader);
							mainFilter$5.checkFull();
							const arr = _GM_getValue(GM_KEYS$5.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$5.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterChannelHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter$5.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter$5.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter$5.checkFull();
							const arr = _GM_getValue(GM_KEYS$5.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$5.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterChannelHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
			if (spaceUrl && (mainFilter$5.videoUploaderFilter.isEnable || mainFilter$5.videoUploaderWhiteFilter.isEnable)) menus.push({
				name: `复制主页链接`,
				fn: async () => {
					navigator.clipboard.writeText(`https://${spaceUrl}`).catch(() => {});
				}
			});
		}
		if (target instanceof HTMLAnchorElement && target.closest(".bili-video-card__title")) {
			const url = target.closest(".bili-video-card__title")?.querySelector("a")?.href;
			if (url && mainFilter$5.videoBvidFilter.isEnable) {
				const bvid = matchBvid(url);
				if (bvid) {
					menus.push({
						name: `屏蔽视频 ${bvid}`,
						fn: async () => {
							try {
								mainFilter$5.videoBvidFilter.addParam(bvid);
								mainFilter$5.checkFull();
								const arr = _GM_getValue(GM_KEYS$5.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS$5.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterChannelHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: async () => {
							navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {});
						}
					});
				}
			}
		}
		return menus;
	};
	var GM_KEYS$4 = {
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
			isFollow: { statusKey: "homepage-following-whitelist-filter-status" }
		}
	};
	var selectorFns$4 = {
		duration: (video) => {
			const duration = video.querySelector(".bili-video-card__stats__duration")?.textContent?.trim();
			return duration && convertTimeToSec(duration);
		},
		views: (video) => {
			const text = video.querySelector(".bili-video-card__stats--text")?.textContent?.trim();
			if (text) {
				if (/\d+(?:\.\d+)?万/.test(text)) return parseFloat(text.replace("万", "")) * 1e4;
				if (/^\d+$/.test(text)) return parseFloat(text);
			}
		},
		title: (video) => {
			return video.querySelector(".bili-video-card__info--tit a")?.textContent?.trim();
		},
		pubdate: (video) => {
			const pubdate = video.querySelector(".bili-video-card__info--date")?.textContent?.trim();
			return pubdate && convertDateToDays(pubdate);
		},
		bvid: (video) => {
			const href = video.querySelector(".bili-video-card__info--tit a")?.getAttribute("href") || video.querySelector(".bili-video-card__image--link")?.getAttribute("href");
			return (href && matchBvid(href)) ?? void 0;
		},
		uploader: (video) => {
			return video.querySelector(".bili-video-card__info--author")?.textContent?.trim();
		},
		isFollow: (video) => {
			return video.querySelector(".bili-video-card__info--icon-text")?.textContent?.trim() === "已关注";
		}
	};
	var VideoFilterHomepage = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoViewsFilter = new VideoViewsFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoPubdateFilter = new VideoPubdateFilter();
		videoUploaderFilter = new VideoUploaderFilter();
		videoUploaderKeywordFilter = new VideoUploaderKeywordFilter();
		videoUploaderWhiteFilter = new VideoUploaderWhiteFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		videoIsFollowWhiteFilter = new VideoIsFollowWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$4.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS$4.black.duration.valueKey, 0));
			this.videoViewsFilter.setParam(_GM_getValue(GM_KEYS$4.black.views.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$4.black.title.valueKey, []));
			this.videoPubdateFilter.setParam(_GM_getValue(GM_KEYS$4.black.pubdate.valueKey, 0));
			this.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$4.black.uploader.valueKey, []));
			this.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$4.black.uploaderKeyword.valueKey, []));
			this.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$4.white.uploader.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$4.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoViewsFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoPubdateFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			let selector = `:scope > :is(.feed-card, .bili-video-card.is-rcmd, .bili-feed-card)`;
			if (mode === "incr") selector += `:not([${config_default.filterVisitSign}])`;
			const videos = Array.from(this.target.querySelectorAll(selector));
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterHomepage`,
					`bvid: ${selectorFns$4.bvid(v)}`,
					`duration: ${selectorFns$4.duration(v)}`,
					`views: ${selectorFns$4.views(v)}`,
					`title: ${selectorFns$4.title(v)}`,
					`uploader: ${selectorFns$4.uploader(v)}`,
					`pubdate: ${selectorFns$4.pubdate(v)}`,
					`isFollow: ${selectorFns$4.isFollow(v)}`
				].join("\n"));
			});
			const blackPairs = [];
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
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns$4.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterHomepage hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("VideoFilterHomepage check full error", err);
			});
		}
		checkIncr() {
			this.check("incr").catch((err) => {
				logger.error("VideoFilterHomepage check incr error", err);
			});
		}
		observe() {
			waitForEle(document, ".container", (node) => {
				return node.classList.contains("container");
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterHomepage target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkIncr();
				}).observe(this.target, { childList: true });
			});
		}
	};
	var mainFilter$4 = new VideoFilterHomepage();
	var videoFilterHomepageEntry = async () => {
		mainFilter$4.init();
		mainFilter$4.observe();
	};
	var videoFilterHomepageGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
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
						mainFilter$4.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$4.black.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$4.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$4.black.uploaderKeyword.valueKey, []));
						mainFilter$4.checkFull();
					}
				}
			]
		},
		{
			name: "标题关键词过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$4.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$4.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$4.black.title.valueKey, []));
					mainFilter$4.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$4.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter$4.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$4.black.bvid.valueKey, []));
					mainFilter$4.checkFull();
				}
			}]
		},
		{
			name: "发布日期过滤",
			fold: true,
			items: [{
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
			}, {
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
			}]
		},
		{
			name: "播放量过滤",
			fold: true,
			items: [{
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
			}, {
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
			}]
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
						mainFilter$4.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$4.white.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$4.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$4.white.title.valueKey, []));
						mainFilter$4.checkFull();
					}
				}
			]
		}
	];
	var videoFilterHomepageHandler = (target) => {
		if (!isPageHomepage()) return [];
		const menus = [];
		if (target.closest(".bili-video-card__info--owner")) {
			const uploader = target.closest(".bili-video-card__info--owner")?.querySelector(".bili-video-card__info--author")?.textContent?.trim();
			const spaceUrl = (target.closest(".bili-video-card__info--owner")?.href.trim())?.match(/space\.bilibili\.com\/\d+/)?.[0];
			if (uploader) {
				if (mainFilter$4.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter$4.videoUploaderFilter.addParam(uploader);
							mainFilter$4.checkFull();
							const arr = _GM_getValue(GM_KEYS$4.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$4.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterHomepageHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter$4.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter$4.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter$4.checkFull();
							const arr = _GM_getValue(GM_KEYS$4.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$4.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterHomepageHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
			if (spaceUrl && (mainFilter$4.videoUploaderFilter.isEnable || mainFilter$4.videoUploaderWhiteFilter.isEnable)) menus.push({
				name: `复制主页链接`,
				fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`).catch(() => {})
			});
		}
		if (target instanceof HTMLAnchorElement && target.closest(".bili-video-card__info--tit")) {
			const url = target.closest(".bili-video-card__info--tit")?.querySelector("a")?.href;
			if (url && mainFilter$4.videoBvidFilter.isEnable) {
				const bvid = matchBvid(url);
				if (bvid) {
					menus.push({
						name: `屏蔽视频 ${bvid}`,
						fn: async () => {
							try {
								mainFilter$4.videoBvidFilter.addParam(bvid);
								mainFilter$4.checkFull();
								const arr = _GM_getValue(GM_KEYS$4.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS$4.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterHomepageHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {})
					});
				}
			}
		}
		return menus;
	};
	var GM_KEYS$3 = {
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
			dimension: { statusKey: "popular-dimension-filter-status" }
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
	var getVideoData = (video) => {
		let videoData;
		if (!video.classList.contains("rank-item")) return video.__vue__?.videoData;
		const rank = video.getAttribute("data-rank");
		if (rank && parseInt(rank) > 0) videoData = video.closest(".rank-list-wrap")?.__vue__?.list?.[parseInt(rank) - 1];
		return videoData;
	};
	var selectorFns$3 = {
		title: (video) => {
			return getVideoData(video)?.title;
		},
		bvid: (video) => {
			return getVideoData(video)?.bvid;
		},
		uploader: (video) => {
			return getVideoData(video)?.owner?.name;
		},
		duration: (video) => {
			return getVideoData(video)?.duration;
		},
		quality: (video) => {
			const stat = getVideoData(video)?.stat;
			if (stat && typeof stat.coin === "number" && typeof stat.like === "number") return calcQuality(stat.coin / stat.like);
		},
		dimension: (video) => {
			const dimension = getVideoData(video)?.dimension;
			if (dimension && typeof dimension.height === "number" && typeof dimension.width === "number") return dimension?.height > dimension?.width;
		}
	};
	var VideoFilterPopular = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoUploaderFilter = new VideoUploaderFilter();
		videoUploaderKeywordFilter = new VideoUploaderKeywordFilter();
		videoQualityFilter = new VideoQualityFilter();
		videoDimensionFilter = new VideoDimensionFilter();
		videoUploaderWhiteFilter = new VideoUploaderWhiteFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$3.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS$3.black.duration.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$3.black.title.valueKey, []));
			this.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$3.black.uploader.valueKey, []));
			this.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$3.black.uploaderKeyword.valueKey, []));
			this.videoQualityFilter.setParam(_GM_getValue(GM_KEYS$3.black.quality.valueKey, 0));
			this.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$3.white.uploader.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$3.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable || this.videoDimensionFilter.isEnable || this.videoQualityFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			const videos = Array.from(this.target.querySelectorAll(`.card-list .video-card, .video-list .video-card, .rank-list:not(.pgc-list) .rank-item`));
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterPopular`,
					`bvid: ${selectorFns$3.bvid(v)}`,
					`duration: ${selectorFns$3.duration(v)}`,
					`title: ${selectorFns$3.title(v)}`,
					`uploader: ${selectorFns$3.uploader(v)}`,
					`quality: ${selectorFns$3.quality(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$3.duration]);
			this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$3.title]);
			this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$3.uploader]);
			this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$3.uploader]);
			this.videoDimensionFilter.isEnable && blackPairs.push([this.videoDimensionFilter, selectorFns$3.dimension]);
			this.videoQualityFilter.isEnable && blackPairs.push([this.videoQualityFilter, selectorFns$3.quality]);
			const whitePairs = [];
			this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$3.uploader]);
			this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$3.title]);
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns$3.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterPopular hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("VideoFilterPopular check full error", err);
			});
		}
		observe() {
			waitForEle(document, "#app", (node) => {
				return node.id === "app";
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterPopular target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkFull();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$3 = new VideoFilterPopular();
	var videoFilterPopularEntry = async () => {
		mainFilter$3.init();
		mainFilter$3.observe();
	};
	var videoFilterPopularGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
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
						mainFilter$3.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$3.black.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$3.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$3.black.uploaderKeyword.valueKey, []));
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
					step: .1,
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
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$3.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$3.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$3.black.title.valueKey, []));
					mainFilter$3.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$3.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter$3.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$3.black.bvid.valueKey, []));
					mainFilter$3.checkFull();
				}
			}]
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
						mainFilter$3.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$3.white.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$3.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$3.white.title.valueKey, []));
						mainFilter$3.checkFull();
					}
				}
			]
		}
	];
	var videoFilterPopularHandler = (target) => {
		if (!isPagePopular()) return [];
		const menus = [];
		if (target.closest(".up-name")) {
			const uploader = target.textContent?.trim();
			if (uploader) {
				if (mainFilter$3.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter$3.videoUploaderFilter.addParam(uploader);
							mainFilter$3.checkFull();
							const arr = _GM_getValue(GM_KEYS$3.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$3.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterPopularHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter$3.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter$3.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter$3.checkFull();
							const arr = _GM_getValue(GM_KEYS$3.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$3.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterPopularHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
		}
		if (target.classList.contains("title") && target.closest(".info a") || target.classList.contains("video-name") || target.classList.contains("lazy-image")) {
			let url = target.getAttribute("href") || target.parentElement?.getAttribute("href");
			if (!url) url = target.closest(".video-card")?.querySelector(".video-card__content > a")?.getAttribute("href");
			if (url && mainFilter$3.videoBvidFilter.isEnable) {
				const bvid = matchBvid(url);
				if (bvid) {
					menus.push({
						name: `屏蔽视频 ${bvid}`,
						fn: async () => {
							try {
								mainFilter$3.videoBvidFilter.addParam(bvid);
								mainFilter$3.checkFull();
								const arr = _GM_getValue(GM_KEYS$3.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS$3.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterPopularHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {})
					});
				}
			}
		}
		return menus;
	};
	var GM_KEYS$2 = {
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
	var selectorFns$2 = {
		duration: (video) => {
			const duration = video.querySelector(".bili-video-card__stats__duration")?.textContent?.trim();
			return (duration && convertTimeToSec(duration)) ?? void 0;
		},
		title: (video) => {
			return video.querySelector(".bili-video-card__info--tit")?.textContent?.trim();
		},
		bvid: (video) => {
			const href = video.querySelector(".bili-video-card__wrap > a")?.getAttribute("href") || video.querySelector(".bili-video-card__info--right > a")?.getAttribute("href");
			return (href && matchBvid(href)) ?? void 0;
		},
		uploader: (video) => {
			return video.querySelector(".bili-video-card__info--author")?.textContent?.trim() || video.closest(".user-list")?.querySelector(".user-name")?.textContent?.trim();
		},
		uploaderCard: (userCard) => {
			return userCard.querySelector(".user-name")?.textContent?.trim();
		}
	};
	var VideoFilterSearch = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoUploaderFilter = new VideoUploaderFilter();
		videoUploaderKeywordFilter = new VideoUploaderKeywordFilter();
		videoUploaderWhiteFilter = new VideoUploaderWhiteFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$2.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS$2.black.duration.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$2.black.title.valueKey, []));
			this.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$2.black.uploader.valueKey, []));
			this.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$2.black.uploaderKeyword.valueKey, []));
			this.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$2.white.uploader.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$2.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			const selector = `:where(.video.search-all-list, .search-page-video) .video-list > div`;
			const cardSelector = `.user-list .video-list-item`;
			const videos = [...this.target.querySelectorAll(selector), ...document.querySelectorAll(cardSelector)];
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterSearch`,
					`bvid: ${selectorFns$2.bvid(v)}`,
					`duration: ${selectorFns$2.duration(v)}`,
					`title: ${selectorFns$2.title(v)}`,
					`uploader: ${selectorFns$2.uploader(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$2.duration]);
			this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$2.title]);
			this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$2.uploader]);
			this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$2.uploader]);
			const whitePairs = [];
			this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$2.uploader]);
			this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$2.title]);
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns$2.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterSearch hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		async checkUserCards(mode) {
			if (!this.target) return;
			const timer = performance.now();
			const userList = this.target.querySelector(".user-list");
			if (!userList) return;
			const userName = userList.querySelector("a.user-name")?.textContent?.trim();
			if (!userName) return;
			if (!this.videoUploaderFilter.isEnable && !this.videoUploaderKeywordFilter.isEnable && !this.videoUploaderWhiteFilter.isEnable) {
				showEle(userList, "sign");
				return;
			}
			if (config_default.isDebugMode) logger.debug([`VideoFilterSearchUserCard`, `uploader: ${userName}`].join("\n"));
			const blackPairs = [];
			this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns$2.uploaderCard]);
			this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns$2.uploaderCard]);
			const whitePairs = [];
			this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns$2.uploaderCard]);
			const blackCnt = await coreCheck([userList], true, "sign", blackPairs, whitePairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterSearchUserCard hide ${blackCnt} in user-list, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.checkUserCards("full").catch((err) => {
				logger.error("VideoFilterSearch checkUserList error", err);
			});
			this.check("full").catch((err) => {
				logger.error("VideoFilterSearch check full error", err);
			});
		}
		observe() {
			waitForEle(document, ".search-layout", (node) => {
				return node.className.includes("search-layout");
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterSearch target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkFull();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$2 = new VideoFilterSearch();
	var videoFilterSearchEntry = async () => {
		mainFilter$2.init();
		mainFilter$2.observe();
	};
	var videoFilterSearchGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
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
						mainFilter$2.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS$2.black.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$2.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS$2.black.uploaderKeyword.valueKey, []));
						mainFilter$2.checkFull();
					}
				}
			]
		},
		{
			name: "标题关键词过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$2.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$2.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$2.black.title.valueKey, []));
					mainFilter$2.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$2.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter$2.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$2.black.bvid.valueKey, []));
					mainFilter$2.checkFull();
				}
			}]
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
						mainFilter$2.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS$2.white.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter$2.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$2.white.title.valueKey, []));
						mainFilter$2.checkFull();
					}
				}
			]
		}
	];
	var videoFilterSearchHandler = (target) => {
		if (!isPageSearch()) return [];
		const menus = [];
		if (target.closest(".bili-video-card__info--owner")) {
			const uploader = target.closest(".bili-video-card__info--owner")?.querySelector(".bili-video-card__info--author")?.textContent?.trim();
			const spaceUrl = (target.closest(".bili-video-card__info--owner")?.href.trim())?.match(/space\.bilibili\.com\/\d+/)?.[0];
			if (uploader) {
				if (mainFilter$2.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter$2.videoUploaderFilter.addParam(uploader);
							mainFilter$2.checkFull();
							const arr = _GM_getValue(GM_KEYS$2.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$2.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterSearchHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter$2.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter$2.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter$2.checkFull();
							const arr = _GM_getValue(GM_KEYS$2.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$2.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterSearchHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
			if (spaceUrl && (mainFilter$2.videoUploaderFilter.isEnable || mainFilter$2.videoUploaderWhiteFilter.isEnable)) menus.push({
				name: `复制主页链接`,
				fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`)
			});
		}
		if (target.closest("div.user-list .info-card")) {
			const userAnchor = target.closest("div.user-list")?.querySelector("a.user-name");
			const uploader = userAnchor?.textContent?.trim();
			const spaceUrl = (userAnchor?.href.trim())?.match(/space\.bilibili\.com\/\d+/)?.[0];
			if (uploader) {
				if (mainFilter$2.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter$2.videoUploaderFilter.addParam(uploader);
							mainFilter$2.checkFull();
							const arr = _GM_getValue(GM_KEYS$2.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$2.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterSearchHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter$2.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter$2.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter$2.checkFull();
							const arr = _GM_getValue(GM_KEYS$2.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS$2.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterSearchHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
			if (spaceUrl && (mainFilter$2.videoUploaderFilter.isEnable || mainFilter$2.videoUploaderWhiteFilter.isEnable)) menus.push({
				name: `复制主页链接`,
				fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`)
			});
		}
		if (target.classList.contains("bili-video-card__info--tit") || target.closest(".bili-video-card__info--tit")) {
			const url = target.closest("a")?.href;
			if (url && mainFilter$2.videoBvidFilter.isEnable) {
				const bvid = matchBvid(url);
				if (bvid) {
					menus.push({
						name: `屏蔽视频 ${bvid}`,
						fn: async () => {
							try {
								mainFilter$2.videoBvidFilter.addParam(bvid);
								mainFilter$2.checkFull();
								const arr = _GM_getValue(GM_KEYS$2.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS$2.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterSearchHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {})
					});
				}
			}
		}
		return menus;
	};
	var GM_KEYS$1 = {
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
		white: { title: {
			statusKey: "space-title-keyword-whitelist-filter-status",
			valueKey: "global-title-keyword-whitelist-filter-value"
		} }
	};
	var selectorFns$1 = {
		duration: (video) => {
			const duration = video.querySelector("span.length")?.textContent?.trim() || video.querySelector(".bili-cover-card__stats .bili-cover-card__stat:nth-last-child(1)")?.textContent?.trim();
			return (duration && convertTimeToSec(duration)) ?? void 0;
		},
		title: (video) => {
			return video.querySelector("a.title")?.textContent?.trim() || video.querySelector(".bili-video-card__title a")?.textContent?.trim();
		},
		bvid: (video) => {
			const href = video.querySelector("a.title")?.getAttribute("href")?.trim() || video.querySelector(".bili-video-card__title a")?.getAttribute("href")?.trim();
			return (href && matchBvid(href)) ?? void 0;
		}
	};
	var VideoFilterSpace = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$1.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS$1.black.duration.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$1.black.title.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$1.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			let selector;
			if (/^\/\d+$/.test(location.pathname)) selector = `#page-index .small-item, .section-wrap.video-section .items__item, .section-wrap.lists-section .video-list__item`;
			if (/^\/\d+\/(?:upload\/)?video$/.test(location.pathname)) selector = `#submit-video :is(.small-item,.list-item), .video-list .upload-video-card`;
			if (/^\/\d+\/channel\/(collectiondetail|seriesdetail)/.test(location.pathname)) selector = `:is(#page-collection-detail,#page-series-detail) li.small-item`;
			if (/^\/\d+\/lists/.test(location.pathname)) selector = `.space-lists .video-list .video-list__item, .space-list-details .list-video-item`;
			if (!selector) return;
			const videos = Array.from(this.target.querySelectorAll(selector));
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterSpace`,
					`bvid: ${selectorFns$1.bvid(v)}`,
					`duration: ${selectorFns$1.duration(v)}`,
					`title: ${selectorFns$1.title(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns$1.duration]);
			this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns$1.title]);
			const whitePairs = [];
			this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns$1.title]);
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns$1.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterSpace hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("VideoFilterSpace check full error", err);
			});
		}
		observe() {
			waitForEle(document, "#app", (node) => {
				return node.id === "app";
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterSpace target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkFull();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter$1 = new VideoFilterSpace();
	var videoFilterSpaceEntry = async () => {
		mainFilter$1.init();
		mainFilter$1.observe();
	};
	var videoFilterSpaceGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
		},
		{
			name: "标题关键词过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$1.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$1.videoTitleFilter.setParam(_GM_getValue(GM_KEYS$1.black.title.valueKey, []));
					mainFilter$1.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$1.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter$1.videoBvidFilter.setParam(_GM_getValue(GM_KEYS$1.black.bvid.valueKey, []));
					mainFilter$1.checkFull();
				}
			}]
		},
		{
			name: "白名单 免过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS$1.white.title.valueKey,
				name: "编辑 标题关键词白名单",
				editorTitle: "标题关键词 白名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter$1.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS$1.white.title.valueKey, []));
					mainFilter$1.checkFull();
				}
			}]
		}
	];
	var videoFilterSpaceHandler = (target) => {
		if (!isPageSpace()) return [];
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
								const arr = _GM_getValue(GM_KEYS$1.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS$1.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterSearchHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {})
					});
				}
			}
		}
		return menus;
	};
	var GM_KEYS = {
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
			related: { statusKey: "video-related-filter-status" }
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
	var selectorFns = {
		duration: (video) => {
			const duration = video.querySelector(".pic-box span.duration")?.textContent;
			return duration ? convertTimeToSec(duration) : void 0;
		},
		title: (video) => {
			return video.querySelector(".info > a p")?.textContent?.trim();
		},
		bvid: (video) => {
			const href = video.querySelector(".info > a")?.getAttribute("href") || video.querySelector(".pic-box .framepreview-box > a")?.getAttribute("href");
			return (href && matchBvid(href)) ?? void 0;
		},
		uploader: (video) => {
			return video.querySelector(".info > .upname .name")?.textContent?.trim();
		}
	};
	var enableRelatedCheck = false;
	var VideoFilterVideo = class {
		target;
		videoBvidFilter = new VideoBvidFilter();
		videoDurationFilter = new VideoDurationFilter();
		videoTitleFilter = new VideoTitleFilter();
		videoUploaderFilter = new VideoUploaderFilter();
		videoUploaderKeywordFilter = new VideoUploaderKeywordFilter();
		videoUploaderWhiteFilter = new VideoUploaderWhiteFilter();
		videoTitleWhiteFilter = new VideoTitleWhiteFilter();
		init() {
			this.videoBvidFilter.setParam(_GM_getValue(GM_KEYS.black.bvid.valueKey, []));
			this.videoDurationFilter.setParam(_GM_getValue(GM_KEYS.black.duration.valueKey, 0));
			this.videoTitleFilter.setParam(_GM_getValue(GM_KEYS.black.title.valueKey, []));
			this.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS.black.uploader.valueKey, []));
			this.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []));
			this.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS.white.uploader.valueKey, []));
			this.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS.white.title.valueKey, []));
		}
		async check(mode) {
			if (!this.target) return;
			let revertAll = false;
			if (!(this.videoBvidFilter.isEnable || this.videoDurationFilter.isEnable || this.videoTitleFilter.isEnable || this.videoUploaderFilter.isEnable || this.videoUploaderKeywordFilter.isEnable)) revertAll = true;
			const timer = performance.now();
			const videos = Array.from(this.target.querySelectorAll(`.next-play :is(.video-page-card-small, .video-page-operator-card-small),
            .rec-list :is(.video-page-card-small, .video-page-operator-card-small), .recommend-video-card`));
			if (!videos.length) return;
			if (revertAll) {
				videos.forEach((v) => showEle(v, "sign"));
				return;
			}
			if (config_default.isDebugMode) videos.forEach((v) => {
				logger.debug([
					`VideoFilterVideo`,
					`bvid: ${selectorFns.bvid(v)}`,
					`duration: ${selectorFns.duration(v)}`,
					`title: ${selectorFns.title(v)}`,
					`uploader: ${selectorFns.uploader(v)}`
				].join("\n"));
			});
			const blackPairs = [];
			this.videoDurationFilter.isEnable && blackPairs.push([this.videoDurationFilter, selectorFns.duration]);
			this.videoTitleFilter.isEnable && blackPairs.push([this.videoTitleFilter, selectorFns.title]);
			this.videoUploaderFilter.isEnable && blackPairs.push([this.videoUploaderFilter, selectorFns.uploader]);
			this.videoUploaderKeywordFilter.isEnable && blackPairs.push([this.videoUploaderKeywordFilter, selectorFns.uploader]);
			const whitePairs = [];
			this.videoUploaderWhiteFilter.isEnable && whitePairs.push([this.videoUploaderWhiteFilter, selectorFns.uploader]);
			this.videoTitleWhiteFilter.isEnable && whitePairs.push([this.videoTitleWhiteFilter, selectorFns.title]);
			const forceBlackPairs = [];
			this.videoBvidFilter.isEnable && forceBlackPairs.push([this.videoBvidFilter, selectorFns.bvid]);
			const blackCnt = await coreCheck(videos, true, "sign", blackPairs, whitePairs, forceBlackPairs);
			if (enableRelatedCheck && blackCnt) {
				const blackBvids = new Set();
				for (const video of videos) if (isEleHide(video, "sign")) {
					const url = video.querySelector(".info > a")?.getAttribute("href");
					if (url) {
						const bvid = matchBvid(url);
						bvid && blackBvids.add(bvid);
					}
				}
				const rel = _unsafeWindow.__INITIAL_STATE__?.related;
				if (rel?.length && blackBvids.size) _unsafeWindow.__INITIAL_STATE__.related = rel.filter((v) => !(v.bvid && blackBvids.has(v.bvid)));
			}
			const time = (performance.now() - timer).toFixed(1);
			logger.debug(`VideoFilterVideo hide ${blackCnt} in ${videos.length} videos, mode=${mode}, time=${time}`);
		}
		checkFull() {
			this.check("full").catch((err) => {
				logger.error("VideoFilterVideo check full error", err);
			});
		}
		observe() {
			waitForEle(document, "#reco_list, .recommend-list-v1, .recommend-list-container", (node) => {
				return node.id === "reco_list" || ["recommend-list-v1", "recommend-list-container"].includes(node.className);
			}).then((ele) => {
				if (!ele) return;
				logger.debug("VideoFilterVideo target appear");
				this.target = ele;
				this.checkFull();
				new MutationObserver(() => {
					this.checkFull();
				}).observe(this.target, {
					childList: true,
					subtree: true
				});
			});
		}
	};
	var mainFilter = new VideoFilterVideo();
	var videoFilterVideoEntry = async () => {
		mainFilter.init();
		mainFilter.observe();
	};
	var videoFilterVideoGroups = [
		{
			name: "时长过滤",
			items: [{
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
			}, {
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
			}]
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
						mainFilter.videoUploaderFilter.setParam(_GM_getValue(GM_KEYS.black.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter.videoUploaderKeywordFilter.setParam(_GM_getValue(GM_KEYS.black.uploaderKeyword.valueKey, []));
						mainFilter.checkFull();
					}
				}
			]
		},
		{
			name: "标题关键词过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS.black.title.valueKey,
				name: "编辑 标题关键词黑名单",
				editorTitle: "标题关键词 黑名单",
				editorDescription: [
					"每行一个关键词或正则，不区分大小写、全半角",
					"请勿使用过于激进的关键词或正则",
					"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
				],
				saveFn: async () => {
					mainFilter.videoTitleFilter.setParam(_GM_getValue(GM_KEYS.black.title.valueKey, []));
					mainFilter.checkFull();
				}
			}]
		},
		{
			name: "BV号过滤",
			items: [{
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
			}, {
				type: "editor",
				id: GM_KEYS.black.bvid.valueKey,
				name: "编辑 BV号黑名单",
				description: ["右键屏蔽的BV号会出现在首行"],
				editorTitle: "BV号 黑名单",
				editorDescription: ["每行一个BV号，保存时自动去重"],
				saveFn: async () => {
					mainFilter.videoBvidFilter.setParam(_GM_getValue(GM_KEYS.black.bvid.valueKey, []));
					mainFilter.checkFull();
				}
			}]
		},
		{
			name: "其他过滤",
			items: [{
				type: "switch",
				id: GM_KEYS.black.related.statusKey,
				name: "启用 相关视频数据过滤 (实验功能)",
				description: [
					"过滤当前视频的\"相关视频\"缓存数据",
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
			}]
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
						mainFilter.videoUploaderWhiteFilter.setParam(_GM_getValue(GM_KEYS.white.uploader.valueKey, []));
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
						"每行一个关键词或正则，不区分大小写、全半角",
						"请勿使用过于激进的关键词或正则",
						"正则默认 ius 模式，无需 flag，语法：/abc|\\d+/"
					],
					saveFn: async () => {
						mainFilter.videoTitleWhiteFilter.setParam(_GM_getValue(GM_KEYS.white.title.valueKey, []));
						mainFilter.checkFull();
					}
				}
			]
		}
	];
	var videoFilterVideoHandler = (target) => {
		if (!(isPageVideo() || isPagePlaylist() || isPageBangumi())) return [];
		const menus = [];
		if (target.closest(".right-container, .recommend-list-container, .up-panel-container") && (target.classList.contains("name") || target.classList.contains("up-name") || target.parentElement?.classList.contains("up-name") || target.closest(".staff-info"))) {
			const uploader = target.closest(".staff-info")?.querySelector(".staff-name")?.textContent?.trim() || target.textContent?.trim() || target.parentElement?.textContent?.trim();
			const spaceUrl = (target.closest(".upname")?.querySelector(":scope a")?.getAttribute("href"))?.match(/space\.bilibili\.com\/\d+/)?.[0];
			if (uploader) {
				if (mainFilter.videoUploaderFilter.isEnable) menus.push({
					name: `屏蔽UP主：${uploader}`,
					fn: async () => {
						try {
							mainFilter.videoUploaderFilter.addParam(uploader);
							mainFilter.checkFull();
							const arr = _GM_getValue(GM_KEYS.black.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS.black.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterVideoHandler add uploader ${uploader} failed`, err);
						}
					}
				});
				if (mainFilter.videoUploaderWhiteFilter.isEnable) menus.push({
					name: `将UP主加入白名单`,
					fn: async () => {
						try {
							mainFilter.videoUploaderWhiteFilter.addParam(uploader);
							mainFilter.checkFull();
							const arr = _GM_getValue(GM_KEYS.white.uploader.valueKey, []);
							arr.unshift(uploader);
							_GM_setValue(GM_KEYS.white.uploader.valueKey, orderedUniq(arr));
						} catch (err) {
							logger.error(`videoFilterVideoHandler add white uploader ${uploader} failed`, err);
						}
					}
				});
			}
			if (spaceUrl && (mainFilter.videoUploaderFilter.isEnable || mainFilter.videoUploaderWhiteFilter.isEnable)) menus.push({
				name: `复制主页链接`,
				fn: () => navigator.clipboard.writeText(`https://${spaceUrl}`)
			});
		}
		if (target.closest(".right-container, .recommend-list-container") && target.classList.contains("title")) {
			const url = target.parentElement?.getAttribute("href");
			if (url && mainFilter.videoBvidFilter.isEnable) {
				const bvid = matchBvid(url);
				if (bvid) {
					menus.push({
						name: `屏蔽视频 ${bvid}`,
						fn: async () => {
							try {
								mainFilter.videoBvidFilter.addParam(bvid);
								mainFilter.checkFull();
								const arr = _GM_getValue(GM_KEYS.black.bvid.valueKey, []);
								arr.unshift(bvid);
								_GM_setValue(GM_KEYS.black.bvid.valueKey, orderedUniq(arr));
							} catch (err) {
								logger.error(`videoFilterVideoHandler add bvid ${bvid} failed`, err);
							}
						}
					});
					menus.push({
						name: "复制视频链接",
						fn: () => navigator.clipboard.writeText(`https://www.bilibili.com/video/${bvid}`).catch(() => {})
					});
				}
			}
		}
		return menus;
	};
	var videoFilters = [
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
			name: "新版分区页 视频过滤",
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
	var commentFilters = [{
		name: "视频页/番剧页/动态页/空间页 视频评论过滤",
		groups: commentFilterCommonGroups,
		entry: commentFilterCommonEntry,
		checkFn: () => isPageVideo() || isPageBangumi() || isPagePlaylist() || isPageDynamic() || isPageSpace()
	}];
	var dynamicFilters = [
		{
			name: "动态页 动态过滤",
			groups: dynamicFilterDynamicGroups,
			entry: dynamicFilterDynamicEntry,
			checkFn: isPageDynamic
		},
		{
			name: "空间页 动态过滤",
			groups: dynamicFilterSpaceGroups,
			entry: dynamicFilterSpaceEntry,
			checkFn: isPageSpace
		},
		{
			name: "顶栏 动态过滤",
			groups: [],
			entry: dynamicFilterHeaderEntry,
			checkFn: () => !isPageLive()
		}
	];
	var loadFilterStyle = () => {
		const style = document.createElement("style");
		style.className = `bili-cleaner-css filter`;
		style.textContent = `:is(body, #app, #i_cecream) [${config_default.filterHideSign}] {display: none !important;}`;
		document.documentElement?.appendChild(style);
	};
	var filterContextMenuHandlers = [
		videoFilterVideoHandler,
		videoFilterSearchHandler,
		videoFilterChannelHandler,
		videoFilterPopularHandler,
		videoFilterHomepageHandler,
		videoFilterSpaceHandler,
		dynamicFilterDynamicHandler,
		commentFilterCommonHandler
	];
	var useRulePanelStore = defineStore("RulePanel", () => {
		const isShow = (0, vue.ref)(false);
		const show = () => {
			isShow.value = true;
		};
		const hide = () => {
			isShow.value = false;
		};
		const toggle = () => {
			isShow.value = !isShow.value;
		};
		const isPageValid = () => true;
		return {
			isShow,
			show,
			hide,
			toggle,
			isPageValid
		};
	});
	var useVideoFilterPanelStore = defineStore("VideoFilterPanel", () => {
		const isShow = (0, vue.ref)(false);
		const show = () => {
			isShow.value = true;
		};
		const hide = () => {
			isShow.value = false;
		};
		const toggle = () => {
			isShow.value = !isShow.value;
		};
		const isPageValid = () => {
			return isPageHomepage() || isPageVideo() || isPagePlaylist() || isPagePopular() || isPageChannel() || isPageSearch() || isPageSpace();
		};
		return {
			isShow,
			show,
			hide,
			toggle,
			isPageValid
		};
	});
	var useCommentFilterPanelStore = defineStore("CommentFilterPanel", () => {
		const isShow = (0, vue.ref)(false);
		const show = () => {
			isShow.value = true;
		};
		const hide = () => {
			isShow.value = false;
		};
		const toggle = () => {
			isShow.value = !isShow.value;
		};
		const isPageValid = () => {
			return isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist();
		};
		return {
			isShow,
			show,
			hide,
			toggle,
			isPageValid
		};
	});
	var useDynamicFilterPanelStore = defineStore("DynamicFilterPanel", () => {
		const isShow = (0, vue.ref)(false);
		const show = () => {
			isShow.value = true;
		};
		const hide = () => {
			isShow.value = false;
		};
		const toggle = () => {
			isShow.value = !isShow.value;
		};
		const isPageValid = () => {
			return isPageDynamic() || isPageSpace();
		};
		return {
			isShow,
			show,
			hide,
			toggle,
			isPageValid
		};
	});
	var useSideBtnStore = defineStore("SideBtn", () => {
		const isShow = useStorage("bili-cleaner-side-btn-show", false, localStorage);
		const show = () => {
			isShow.value = true;
		};
		const hide = () => {
			isShow.value = false;
		};
		const toggle = () => {
			isShow.value = !isShow.value;
		};
		return {
			isShow,
			show,
			hide,
			toggle
		};
	});
	var CommentFilterPanelView_default = (0, vue.defineComponent)({
		__name: "CommentFilterPanelView",
		setup(__props) {
			const store = useCommentFilterPanelStore();
			const editorDialogRef = (0, vue.ref)(null);
			const handleEdit = (item) => {
				editorDialogRef.value?.openEditor(item);
			};
			let currPageGroups = [];
			for (const commentFilter of commentFilters) if (commentFilter.checkFn()) currPageGroups = [...currPageGroups, ...commentFilter.groups];
			return (_ctx, _cache) => {
				return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(PanelComp_default, (0, vue.mergeProps)({
					title: "评论过滤（全站通用）",
					widthPercent: 28,
					heightPercent: 85,
					minWidth: 360,
					minHeight: 600
				}, { onClose: (0, vue.unref)(store).hide }), {
					default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(currPageGroups), (group, index) => {
						return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: index }, [(0, vue.createVNode)(DisclosureComp_default, (0, vue.mergeProps)({ ref_for: true }, {
							title: group.name,
							isFold: group.fold
						}), {
							default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(group.items, (item, innerIndex) => {
								return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: innerIndex }, [item.type === "switch" ? ((0, vue.openBlock)(), (0, vue.createBlock)(SwitchComp_default, (0, vue.mergeProps)({
									key: 0,
									ref_for: true
								}, item), null, 16)) : item.type === "number" ? ((0, vue.openBlock)(), (0, vue.createBlock)(NumberComp_default, (0, vue.mergeProps)({
									key: 1,
									ref_for: true
								}, item), null, 16)) : item.type === "string" ? ((0, vue.openBlock)(), (0, vue.createBlock)(StringComp_default, (0, vue.mergeProps)({
									key: 2,
									ref_for: true
								}, item), null, 16)) : item.type === "editor" ? ((0, vue.openBlock)(), (0, vue.createBlock)(EditorComp_default, (0, vue.mergeProps)({
									key: 3,
									ref_for: true
								}, item, { onEdit: handleEdit }), null, 16)) : item.type === "list" ? ((0, vue.openBlock)(), (0, vue.createBlock)(ListComp_default, (0, vue.mergeProps)({
									key: 4,
									ref_for: true
								}, item), null, 16)) : (0, vue.createCommentVNode)("", true)]);
							}), 128))]),
							_: 2
						}, 1040)]);
					}), 128)), (0, vue.createVNode)(EditorDialog_default, {
						ref_key: "editorDialogRef",
						ref: editorDialogRef
					}, null, 512)]),
					_: 1
				}, 16, ["onClose"])), [[vue.vShow, (0, vue.unref)(store).isShow]]);
			};
		}
	});
	var _hoisted_1$2 = ["onClick"];
	var _hoisted_2$1 = {
		key: 0,
		class: "border-gray-300"
	};
	var ContextMenuView_default = (0, vue.defineComponent)({
		__name: "ContextMenuView",
		setup(__props) {
			const show = (0, vue.ref)(false);
			const pos = (0, vue.reactive)({
				left: -9999,
				top: -9999
			});
			const menuList = (0, vue.ref)([]);
			useEventListener(window, "contextmenu", (e) => {
				if (e.target instanceof HTMLElement) {
					const target = e.composedPath()?.[0];
					if (!target.closest(".bilibili-app-recommend-root")) handleTarget(target);
				}
				if (menuList.value.length) {
					e.preventDefault();
					show.value = true;
					if (show.value) {
						pos.left = e.x;
						pos.top = e.y;
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
				for (const handler of filterContextMenuHandlers) try {
					menuList.value = menuList.value.concat(handler(target));
				} catch (err) {
					logger.error("ContextMenuVuew handleTarget failed", err);
				}
			};
			return (_ctx, _cache) => {
				return show.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: "fixed z-100000 block cursor-pointer overflow-hidden rounded-md bg-white text-[15px] text-black shadow-lg shadow-black/20",
					style: (0, vue.normalizeStyle)({
						left: pos.left + "px",
						top: pos.top + "px"
					})
				}, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(menuList.value, (menu, index) => {
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: index }, [(0, vue.createElementVNode)("div", {
						onClick: ($event) => menu.fn()?.catch(() => {}),
						class: "px-2.5 py-1 hover:bg-[#00aeec] hover:text-white"
					}, [_cache[0] || (_cache[0] = (0, vue.createElementVNode)("span", { class: "mr-0.5" }, "◎", -1)), (0, vue.createTextVNode)(" " + (0, vue.toDisplayString)(menu.name), 1)], 8, _hoisted_1$2), index < menuList.value.length - 1 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("hr", _hoisted_2$1)) : (0, vue.createCommentVNode)("", true)]);
				}), 128))], 4)) : (0, vue.createCommentVNode)("", true);
			};
		}
	});
	var DynamicFilterPanelView_default = (0, vue.defineComponent)({
		__name: "DynamicFilterPanelView",
		setup(__props) {
			const store = useDynamicFilterPanelStore();
			const editorDialogRef = (0, vue.ref)(null);
			const handleEdit = (item) => {
				editorDialogRef.value?.openEditor(item);
			};
			let currPageGroups = [];
			for (const dynamicFilter of dynamicFilters) if (dynamicFilter.checkFn()) currPageGroups = [...currPageGroups, ...dynamicFilter.groups];
			return (_ctx, _cache) => {
				return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(PanelComp_default, (0, vue.mergeProps)({
					title: "动态过滤",
					widthPercent: 28,
					heightPercent: 85,
					minWidth: 360,
					minHeight: 600
				}, { onClose: (0, vue.unref)(store).hide }), {
					default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(currPageGroups), (group, index) => {
						return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: index }, [(0, vue.createVNode)(DisclosureComp_default, (0, vue.mergeProps)({ ref_for: true }, {
							title: group.name,
							isFold: group.fold
						}), {
							default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(group.items, (item, innerIndex) => {
								return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: innerIndex }, [item.type === "switch" ? ((0, vue.openBlock)(), (0, vue.createBlock)(SwitchComp_default, (0, vue.mergeProps)({
									key: 0,
									ref_for: true
								}, item), null, 16)) : item.type === "number" ? ((0, vue.openBlock)(), (0, vue.createBlock)(NumberComp_default, (0, vue.mergeProps)({
									key: 1,
									ref_for: true
								}, item), null, 16)) : item.type === "string" ? ((0, vue.openBlock)(), (0, vue.createBlock)(StringComp_default, (0, vue.mergeProps)({
									key: 2,
									ref_for: true
								}, item), null, 16)) : item.type === "editor" ? ((0, vue.openBlock)(), (0, vue.createBlock)(EditorComp_default, (0, vue.mergeProps)({
									key: 3,
									ref_for: true
								}, item, { onEdit: handleEdit }), null, 16)) : item.type === "list" ? ((0, vue.openBlock)(), (0, vue.createBlock)(ListComp_default, (0, vue.mergeProps)({
									key: 4,
									ref_for: true
								}, item), null, 16)) : (0, vue.createCommentVNode)("", true)]);
							}), 128))]),
							_: 2
						}, 1040)]);
					}), 128)), (0, vue.createVNode)(EditorDialog_default, {
						ref_key: "editorDialogRef",
						ref: editorDialogRef
					}, null, 512)]),
					_: 1
				}, 16, ["onClose"])), [[vue.vShow, (0, vue.unref)(store).isShow]]);
			};
		}
	});
	var bangumiBasicItems = [{
		type: "switch",
		id: "video-page-simple-share",
		name: "净化分享功能",
		defaultEnable: true,
		description: ["点击分享按钮时，复制纯净链接"],
		noStyle: true,
		enableFn: async () => {
			let counter = 0;
			const id = setInterval(() => {
				counter++;
				const shareBtn = document.getElementById("share-container-id");
				if (shareBtn) {
					clearInterval(id);
					shareBtn.addEventListener("click", () => {
						const shareText = `《${document.querySelector("[class^='mediainfo_mediaTitle']")?.textContent}》${document.getElementById("player-title")?.textContent} \nhttps://www.bilibili.com${location.pathname}`;
						navigator.clipboard.writeText(shareText).catch(() => {});
					});
				} else if (counter > 50) clearInterval(id);
			}, 200);
		},
		enableFnRunAt: "document-end"
	}, {
		type: "switch",
		id: "video-page-hide-fixed-header",
		name: "顶栏 滚动页面后 不再吸附顶部"
	}];
	var bangumiDanmakuItems = [{
		type: "string",
		id: "video-page-danmaku-font-family",
		name: "弹幕字体",
		description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
		defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
		disableValue: "",
		fn: (value) => {
			document.documentElement.style.setProperty("--video-page-danmaku-font-family", value.trim().replace(/;$/, ""));
		}
	}, {
		type: "string",
		id: "video-page-danmaku-font-weight",
		name: "弹幕字重",
		description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
		defaultValue: "",
		disableValue: "",
		fn: (value) => {
			document.documentElement.style.setProperty("--video-page-danmaku-font-weight", value.trim().replace(/;$/, ""));
		}
	}];
	var bangumiDanmakuControlItems = [
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
			name: "非全屏时 关闭弹幕栏",
			description: ["字母 D 是弹幕开关快捷键"]
		},
		{
			type: "switch",
			id: "video-page-hide-bpx-player-video-inputbar",
			name: "全屏时 关闭弹幕输入框"
		},
		{
			type: "switch",
			id: "video-page-show-fullscreen-bpx-player-video-info-online",
			name: "全屏时 显示同时在看人数"
		}
	];
	var bangumiMiniPlayerItems = [
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
					waitForEle(document.body, `#bilibili-player [class^="bpx-player-video"]`, (node) => {
						return node.className.startsWith("bpx-player-video");
					}).then(() => {
						const player = document.querySelector("#bilibili-player .bpx-player-container");
						if (!player) return;
						let flag = false;
						player.addEventListener("mouseenter", () => {
							if (player.getAttribute("data-screen") === "mini") flag = true;
						});
						player.addEventListener("mouseleave", () => {
							flag = false;
						});
						player.addEventListener("wheel", (e) => {
							if (flag) {
								e.stopPropagation();
								e.preventDefault();
								let newZoom = zoom.value - Math.sign(e.deltaY) * 5 / 100;
								newZoom = newZoom < .5 ? .5 : newZoom;
								newZoom = newZoom > 3 ? 3 : newZoom;
								if (newZoom !== zoom.value) {
									zoom.value = newZoom;
									document.documentElement.style.setProperty("--mini-player-zoom", newZoom + "");
								}
							}
						});
					});
					let cnt = 0;
					const interval = setInterval(() => {
						if (document.querySelector(".bpx-player-container")) clearInterval(interval);
						else {
							cnt++;
							if (cnt > 20) clearInterval(interval);
						}
					}, 500);
				} catch (err) {
					logger.error("adjust mini player size error", err);
				}
			},
			enableFnRunAt: "document-end"
		},
		{
			type: "switch",
			id: "video-page-bpx-player-mini-mode-position-record",
			name: "记录小窗位置",
			enableFn: async () => {
				const pos = useStorage("bili-cleaner-mini-player-pos", {
					tx: 0,
					ty: 0
				}, localStorage);
				document.documentElement.style.setProperty("--mini-player-translate-x", pos.value.tx + "px");
				document.documentElement.style.setProperty("--mini-player-translate-y", pos.value.ty + "px");
				waitForEle(document.body, `#bilibili-player [class^="bpx-player-video"]`, (node) => {
					return node.className.startsWith("bpx-player-video");
				}).then(() => {
					const player = document.querySelector(".bpx-player-container");
					if (player) player.addEventListener("mouseup", () => {
						if (player.getAttribute("data-screen") === "mini") {
							const rect = player.getBoundingClientRect();
							pos.value.tx = 84 - (document.documentElement.clientWidth - rect.right);
							pos.value.ty = 48 - (document.documentElement.clientHeight - rect.bottom);
						}
					});
				});
			},
			enableFnRunAt: "document-end"
		}
	];
	var bangumiPlayerItems = [
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
			name: "隐藏 全屏时 播放器内标题"
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
		},
		{
			type: "switch",
			id: "video-page-bpx-player-bili-dm-normal-white",
			name: "普通彩色弹幕 变成白色"
		}
	];
	var bangumiPlayerControlItems = [
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
			id: "video-page-show-bpx-player-shadow-progress-area-fullscreen",
			name: "全屏时 显示底边mini视频进度"
		},
		{
			type: "switch",
			id: "video-page-show-bpx-player-pbp",
			name: "控制栏收起时 显示高能进度条"
		}
	];
	var preventVolumeTune$1 = false;
	var cleanUp$1 = () => {};
	var isWebScreen$1 = () => {
		if (_unsafeWindow.player?.getManifest()?.screenKind === 2) return true;
		return !!document.querySelector("#bilibili-player-wrap[class^=video_playerFullScreen]");
	};
	var isMiniScreen$1 = () => {
		return _unsafeWindow.player?.getManifest()?.screenKind === 3;
	};
	for (const eventName of [
		"mousewheel",
		"DOMMouseScroll",
		"wheel"
	]) useEventListener(window, eventName, (e) => {
		if (preventVolumeTune$1 && isWebScreen$1() && !isMiniScreen$1()) e.stopImmediatePropagation();
	}, {
		capture: true,
		passive: true
	});
	var toggleFullScreen$1 = () => {
		const fullScreenStatus = () => {
			if (document.fullscreenElement) return "ele";
			if (window.innerWidth === screen.width && window.innerHeight === screen.height) return "f11";
			return "not";
		};
		switch (fullScreenStatus()) {
			case "ele":
				document.exitFullscreen().catch(() => {});
				if (isWebScreen$1()) playerGoTo("normal");
				break;
			case "f11":
				playerGoTo("normal");
				break;
			case "not":
				document.documentElement.requestFullscreen().catch(() => {});
				if (!isWebScreen$1()) playerGoTo("web");
				window.scrollTo(0, 0);
				break;
		}
	};
	var handleFullScreenClick$1 = (e) => {
		const target = e.target;
		if (target.closest("#bilibili-player .bpx-player-ctrl-full") || target.classList.contains("bpx-player-ctrl-full") && target.classList.contains("#bilibili-player")) {
			e.stopImmediatePropagation();
			toggleFullScreen$1();
		}
	};
	var handleFullScreenDblClick$1 = (e) => {
		const target = e.target;
		if (target.closest("#bilibili-player .bpx-player-video-perch") || target.classList.contains("bpx-player-video-perch") && target.closest("#bilibili-player")) {
			e.stopImmediatePropagation();
			document.querySelector("#bilibili-player video")?.pause();
			toggleFullScreen$1();
		}
	};
	var bangumiGroups = [
		{
			name: "基本功能",
			fold: true,
			items: bangumiBasicItems
		},
		{
			name: "布局设定",
			fold: true,
			items: [
				{
					type: "switch",
					id: "default-widescreen",
					name: "自动宽屏播放",
					noStyle: true,
					enableFn: () => {
						let origNextData = _unsafeWindow.__NEXT_DATA__;
						if (origNextData?.props?.pageProps?.dehydratedState?.queries?.[1]?.state?.data?.show) origNextData.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1;
						Object.defineProperty(_unsafeWindow, "__NEXT_DATA__", {
							get() {
								return origNextData;
							},
							set(value) {
								if (value.props?.pageProps?.dehydratedState?.queries?.[1]?.state?.data?.show) value.props.pageProps.dehydratedState.queries[1].state.data.show.wide_screen = 1;
								origNextData = value;
							}
						});
					}
				},
				{
					type: "switch",
					id: "webscreen-scrollable",
					name: "网页全屏时 页面可滚动",
					description: ["启用后滚轮无法调节音量，刷新生效"],
					enableFn: () => {
						preventVolumeTune$1 = true;
					},
					disableFn: () => {
						preventVolumeTune$1 = false;
					},
					enableFnRunAt: "document-end"
				},
				{
					type: "switch",
					id: "fullscreen-scrollable",
					name: "网页全屏/真全屏时 页面可滚动",
					description: ["启用后滚轮无法调节音量，刷新生效"],
					enableFn: () => {
						preventVolumeTune$1 = true;
						document.addEventListener("click", handleFullScreenClick$1, true);
						document.addEventListener("dblclick", handleFullScreenDblClick$1, true);
					},
					disableFn: () => {
						preventVolumeTune$1 = false;
						document.removeEventListener("click", handleFullScreenClick$1, true);
						document.removeEventListener("dblclick", handleFullScreenDblClick$1, true);
					}
				},
				{
					type: "switch",
					id: "screen-scrollable-enable-mini-player",
					name: "网页全屏滚动时 启用小窗播放器",
					description: ["实验功能，不支持真全屏"],
					enableFn: () => {
						cleanUp$1 = useEventListener(window, "scroll", (e) => {
							if (document.fullscreenElement) e.stopImmediatePropagation();
						}, {
							capture: true,
							passive: true
						});
					},
					disableFn: () => {
						cleanUp$1();
					}
				},
				{
					type: "switch",
					id: "screen-scrollable-move-header-bottom",
					name: "全屏滚动时 在视频底部显示顶栏",
					description: ["网页全屏/真全屏滚动时生效"]
				},
				{
					type: "number",
					id: "normalscreen-width",
					name: "普通播放宽度调节（-1禁用）",
					minValue: -1,
					maxValue: 100,
					step: .1,
					defaultValue: -1,
					disableValue: -1,
					addonText: "vw",
					fn: (value) => {
						document.documentElement.style.setProperty("--normalscreen-width", `${value}vw`);
					}
				}
			]
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
			name: "弹幕控制栏",
			fold: true,
			items: bangumiDanmakuControlItems
		},
		{
			name: "弹幕样式",
			fold: true,
			items: bangumiDanmakuItems
		},
		{
			name: "工具栏/作品信息",
			fold: true,
			items: [
				{
					type: "switch",
					id: "video-page-coin-disable-auto-like",
					name: "投币时不自动点赞",
					noStyle: true,
					enableFn: async () => {
						const disableAutoLike = () => {
							let counter = 0;
							const timer = setInterval(() => {
								const checkbox = document.querySelector(".main-container [class^=\"dialogcoin_like_checkbox\"] input");
								if (checkbox) {
									checkbox.checked && checkbox.click();
									clearInterval(timer);
								} else {
									counter++;
									if (counter > 100) clearInterval(timer);
								}
							}, 20);
						};
						const coinBtn = document.querySelector("#ogv_weslie_tool_coin_info");
						if (coinBtn) coinBtn.addEventListener("click", disableAutoLike);
						else document.addEventListener("DOMContentLoaded", () => {
							document.querySelector("#ogv_weslie_tool_coin_info")?.addEventListener("click", disableAutoLike);
						});
					}
				},
				{
					type: "switch",
					id: "video-page-simple-video-share-popover",
					name: "精简 分享按钮弹出菜单",
					defaultEnable: true
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
					name: "隐藏 工具栏(赞币转) ★"
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
			]
		},
		{
			name: "右栏",
			fold: true,
			items: [
				{
					type: "switch",
					id: "bangumi-page-hide-right-container-section-height",
					name: "隐藏 大会员按钮 ★",
					defaultEnable: true
				},
				{
					type: "switch",
					id: "video-page-unfold-right-container-danmaku",
					name: "自动展开 弹幕列表",
					enableFn: () => {
						let cnt = 0;
						const id = setInterval(() => {
							const collapseHeader = document.querySelector("#danmukuBox .bui-collapse-wrap-folded .bui-collapse-header");
							if (collapseHeader) {
								collapseHeader.click();
								clearInterval(id);
							}
							++cnt > 20 && clearInterval(id);
						}, 500);
					},
					enableFnRunAt: "document-end"
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
			]
		},
		{
			name: "小窗播放器",
			fold: true,
			items: bangumiMiniPlayerItems
		},
		{
			name: "页面右下角 小按钮",
			fold: true,
			items: [
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
			]
		}
	];
	var channelGroups = [
		{
			name: "分区页 基础功能",
			items: [
				{
					type: "switch",
					id: "homepage-hide-banner",
					name: "隐藏 横幅banner",
					description: ["同步生效：首页、分区页、热门页"]
				},
				{
					type: "switch",
					id: "channel-hide-sticky-header",
					name: "隐藏 滚动页面时 顶部吸附顶栏"
				},
				{
					type: "switch",
					id: "channel-hide-subarea",
					name: "隐藏 分区栏"
				},
				{
					type: "switch",
					id: "channel-hide-carousel",
					name: "隐藏 大图轮播"
				},
				{
					type: "switch",
					id: "homepage-revert-channel-dynamic-icon",
					name: "恢复 原始动态按钮",
					description: ["同步生效：首页、分区页"]
				}
			]
		},
		{
			name: "页面布局",
			items: [{
				type: "list",
				id: "channel-layout",
				name: "修改 视频列表列数",
				description: ["未启用时，B 站自动判断列数", "分区页与首页统一视频间距"],
				defaultValue: "0",
				disableValue: "0",
				options: [
					{
						value: "0",
						name: "未启用"
					},
					{
						value: "2",
						name: "2 列布局"
					},
					{
						value: "3",
						name: "3 列布局"
					},
					{
						value: "4",
						name: "4 列布局"
					},
					{
						value: "5",
						name: "5 列布局"
					},
					{
						value: "6",
						name: "6 列布局"
					}
				]
			}, {
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
			}]
		},
		{
			name: "视频列表",
			items: [{
				type: "switch",
				id: "channel-hide-danmaku-count",
				name: "隐藏 弹幕数",
				defaultEnable: true
			}, {
				type: "switch",
				id: "channel-increase-rcmd-list-font-size",
				name: "增大 视频信息字号"
			}]
		}
	];
	var commentGroups = [{
		name: "全站通用 - 评论区",
		fold: true,
		items: [
			{
				type: "switch",
				id: "video-page-hide-reply-notice",
				name: "隐藏 活动通知",
				defaultEnable: true,
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comments-header-renderer", "video-page-hide-reply-notice", `#notice {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comments-header-renderer", "video-page-hide-reply-notice");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-main-reply-box",
				name: "隐藏 评论编辑器",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comments-header-renderer", "video-page-hide-main-reply-box", `#commentbox bili-comment-box {display: none !important;}
                    #navbar {margin-bottom: 0 !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-textarea", "video-page-hide-reply-box-textarea-placeholder", `textarea:not([placeholder^="回复"])::placeholder {color: transparent !important; user-select: none;}`);
					ShadowInstance.addShadowStyle("bili-comment-rich-textarea", "video-page-hide-reply-box-textarea-placeholder", `.brt-placeholder {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comments-header-renderer", "video-page-hide-fixed-reply-box", `.bili-comments-bottom-fixed-wrapper {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comments-header-renderer", "video-page-hide-top-vote-card", `#vote {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-user-profile", "video-page-hide-comment-user-card", `#wrap {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-user-profile", "video-page-hide-comment-user-card");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-reply-decorate",
				name: "隐藏 评论右侧装饰",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-renderer", "video-page-hide-reply-decorate", `#ornament {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-reply-decorate");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-fan-badge",
				name: "隐藏 粉丝牌",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-user-medal", "video-page-hide-fan-badge", `#fans {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-user-medal", "video-page-hide-fan-badge");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-contractor-box",
				name: "隐藏 老粉、原始粉丝Tag",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-user-medal", "video-page-hide-contractor-box", `#contractor {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-user-medal", "video-page-hide-contractor-box");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-user-level",
				name: "隐藏 用户等级",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-user-info", "video-page-hide-user-level", `#user-level {display: none !important;}
                #user-name {margin-right: 5px;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-hide-user-level");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-bili-avatar-pendent-dom",
				name: "隐藏 用户头像饰品",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-avatar", "video-page-hide-bili-avatar-pendent-dom", `picture:has(img[src*="/bfs/garb/"]) {display: none !important;}
                .layer-res[style*="bfs/garb/"] {display: none !important;}
                .layer.center[style^="width: 66px"] {display: none !important;}
                /* 统一头像大小 */
                .layer.center {width: 48px !important; height: 48px !important;}
                `);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-avatar", "video-page-hide-bili-avatar-pendent-dom");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-bili-avatar-nft-icon",
				name: "隐藏 用户头像徽章",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-avatar", "video-page-hide-bili-avatar-nft-icon", `.layer:not(.center) {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-renderer", "video-page-hide-vote-info", `bili-comment-vote-option {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-renderer", "video-page-hide-reply-tag-list", `#tags {display: none !important;}`);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-renderer", "video-page-hide-note-prefix", `#note {display: none !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-note-prefix");
				}
			},
			{
				type: "switch",
				id: "video-page-fix-note-thumbnail-scale",
				name: "优化 笔记评论缩略图比例",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-pictures-renderer", "video-page-fix-note-thumbnail-scale", `#content img:only-child {width: auto !important;}
                #content {zoom: 1.1;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-pictures-renderer", "video-page-fix-note-thumbnail-scale");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-jump-link-search-word",
				name: "禁用 评论内容搜索关键词高亮",
				defaultEnable: true,
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-rich-text", "video-page-hide-jump-link-search-word", `#contents a[href*="search.bilibili.com"] {
                    color: inherit !important;
                    pointer-events: none !important;
                    cursor: text !important;
                }
                #contents a[href*="search.bilibili.com"]:hover {color: inherit !important;}
                #contents a[href*="search.bilibili.com"] img {display: none !important;}
                `);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-jump-link-search-word");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-reply-content-user-highlight",
				name: "禁用 评论中的@高亮",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-rich-text", "video-page-hide-reply-content-user-highlight", `#contents a[href*="space.bilibili.com"] {color: inherit !important;}
                #contents a[href*="space.bilibili.com"]:hover {color: #008AC5 !important;}
                `);
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
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-renderer", "video-page-hide-root-reply-dislike-reply-btn", `#body {
                    --bili-comment-hover-more-display: 0 !important;
                }
                #body:hover {
                    --bili-comment-hover-more-display: 1 !important;
                }`);
					ShadowInstance.addShadowStyle("bili-comment-reply-renderer", "video-page-hide-sub-reply-dislike-reply-btn", `
                #body {
                    --bili-comment-hover-more-display: 0 !important;
                }
                #body:hover {
                    --bili-comment-hover-more-display: 1 !important;
                }`);
					ShadowInstance.addShadowStyle("bili-comment-action-buttons-renderer", "video-page-hide-root-reply-dislike-reply-btn", `#dislike button:not(:has(bili-icon[icon="BDC/hand_thumbsdown_fill/2"])), #reply button, #more button {
                    display: block !important;
                    opacity: var(--bili-comment-action-buttons-more-display);
                    transition: opacity 0.2s 0.3s;
                }`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-renderer", "video-page-hide-root-reply-dislike-reply-btn");
					ShadowInstance.removeShadowStyle("bili-comment-reply-renderer", "video-page-hide-sub-reply-dislike-reply-btn");
					ShadowInstance.removeShadowStyle("bili-comment-action-buttons-renderer", "video-page-hide-root-reply-dislike-reply-btn");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-emoji-popover",
				name: "隐藏 大表情弹框",
				defaultEnable: true
			},
			{
				type: "switch",
				id: "video-page-hide-emoji-small",
				name: "隐藏 小表情",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-rich-text", "video-page-hide-emoji-small", `#contents img[style^="width:1.4em"] { display: none !important; }
                #contents img[style^="width:1.4em"]:not(:first-child) + span { margin-left: 0.5em; }
                `);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-emoji-small");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-emoji-large",
				name: "隐藏 大表情",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-rich-text", "video-page-hide-emoji-large", `#contents img[style^="width:50px"] {display: none !important; }
                #contents img[style^="width:50px"] + span {margin-left: 0.5em; }
                `);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-emoji-large");
				}
			},
			{
				type: "switch",
				id: "video-page-hide-emoji-large-zoom",
				name: "大表情变成小表情",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-rich-text", "video-page-hide-emoji-large-zoom", `#contents img[style^="width:50px"] {zoom: 0.5 !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-rich-text", "video-page-hide-emoji-large-zoom");
				}
			},
			{
				type: "switch",
				id: "video-page-reply-user-name-color-pink",
				name: "用户名 全部大会员色",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-pink", `#user-name {color: #FB7299 !important;}
                #user-name a {color: #FB7299 !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-pink");
				}
			},
			{
				type: "switch",
				id: "video-page-reply-user-name-color-default",
				name: "用户名 全部恢复默认色",
				noStyle: true,
				enableFn: () => {
					ShadowInstance.addShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-default", `#user-name {color: #61666d !important;}
                #user-name a {color: #61666d !important;}`);
				},
				disableFn: () => {
					ShadowInstance.removeShadowStyle("bili-comment-user-info", "video-page-reply-user-name-color-default");
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
		]
	}];
	var useGMValue = (key, initialValue, options = {}) => {
		const { deep = true, syncFromStorage = true, debounce = 1e3 } = options;
		const state = (0, vue.ref)(_GM_getValue(key, initialValue));
		watchDebounced(state, (value) => {
			_GM_setValue(key, value);
		}, {
			deep,
			debounce: debounce > 200 ? debounce : 200
		});
		let listenerId;
		if (syncFromStorage) listenerId = _GM_addValueChangeListener(key, (_name, _oldValue, newValue) => {
			state.value = newValue;
		});
		(0, vue.onScopeDispose)(() => {
			if (listenerId != null) _GM_removeValueChangeListener(listenerId);
		});
		return state;
	};
	var dist = {};
	var hasRequiredDist;
	function requireDist() {
		if (hasRequiredDist) return dist;
		hasRequiredDist = 1;
		Object.defineProperty(dist, "__esModule", { value: true });
		dist.parseCookie = parseCookie;
		dist.parse = parseCookie;
		dist.stringifyCookie = stringifyCookie;
		dist.stringifySetCookie = stringifySetCookie;
		dist.serialize = stringifySetCookie;
		dist.parseSetCookie = parseSetCookie;
		dist.stringifySetCookie = stringifySetCookie;
		dist.serialize = stringifySetCookie;
		const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
		const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
		const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
		const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
		const maxAgeRegExp = /^-?\d+$/;
		const __toString = Object.prototype.toString;
		const NullObject = (() => {
			const C = function() {};
			C.prototype = Object.create(null);
			return C;
		})();
		function parseCookie(str, options) {
			const obj = new NullObject();
			const len = str.length;
			if (len < 2) return obj;
			const dec = options?.decode || decode;
			let index = 0;
			do {
				const eqIdx = eqIndex(str, index, len);
				if (eqIdx === -1) break;
				const endIdx = endIndex(str, index, len);
				if (eqIdx > endIdx) {
					index = str.lastIndexOf(";", eqIdx - 1) + 1;
					continue;
				}
				const key = valueSlice(str, index, eqIdx);
				if (obj[key] === void 0) obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
				index = endIdx + 1;
			} while (index < len);
			return obj;
		}
		function stringifyCookie(cookie, options) {
			const enc = options?.encode || encodeURIComponent;
			const cookieStrings = [];
			for (const name of Object.keys(cookie)) {
				const val = cookie[name];
				if (val === void 0) continue;
				if (!cookieNameRegExp.test(name)) throw new TypeError(`cookie name is invalid: ${name}`);
				const value = enc(val);
				if (!cookieValueRegExp.test(value)) throw new TypeError(`cookie val is invalid: ${val}`);
				cookieStrings.push(`${name}=${value}`);
			}
			return cookieStrings.join("; ");
		}
		function stringifySetCookie(_name, _val, _opts) {
			const cookie = typeof _name === "object" ? _name : {
				..._opts,
				name: _name,
				value: String(_val)
			};
			const enc = (typeof _val === "object" ? _val : _opts)?.encode || encodeURIComponent;
			if (!cookieNameRegExp.test(cookie.name)) throw new TypeError(`argument name is invalid: ${cookie.name}`);
			const value = cookie.value ? enc(cookie.value) : "";
			if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${cookie.value}`);
			let str = cookie.name + "=" + value;
			if (cookie.maxAge !== void 0) {
				if (!Number.isInteger(cookie.maxAge)) throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
				str += "; Max-Age=" + cookie.maxAge;
			}
			if (cookie.domain) {
				if (!domainValueRegExp.test(cookie.domain)) throw new TypeError(`option domain is invalid: ${cookie.domain}`);
				str += "; Domain=" + cookie.domain;
			}
			if (cookie.path) {
				if (!pathValueRegExp.test(cookie.path)) throw new TypeError(`option path is invalid: ${cookie.path}`);
				str += "; Path=" + cookie.path;
			}
			if (cookie.expires) {
				if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) throw new TypeError(`option expires is invalid: ${cookie.expires}`);
				str += "; Expires=" + cookie.expires.toUTCString();
			}
			if (cookie.httpOnly) str += "; HttpOnly";
			if (cookie.secure) str += "; Secure";
			if (cookie.partitioned) str += "; Partitioned";
			if (cookie.priority) switch (typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0) {
				case "low":
					str += "; Priority=Low";
					break;
				case "medium":
					str += "; Priority=Medium";
					break;
				case "high":
					str += "; Priority=High";
					break;
				default: throw new TypeError(`option priority is invalid: ${cookie.priority}`);
			}
			if (cookie.sameSite) switch (typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite) {
				case true:
				case "strict":
					str += "; SameSite=Strict";
					break;
				case "lax":
					str += "; SameSite=Lax";
					break;
				case "none":
					str += "; SameSite=None";
					break;
				default: throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
			}
			return str;
		}
		function parseSetCookie(str, options) {
			const dec = options?.decode || decode;
			const len = str.length;
			const endIdx = endIndex(str, 0, len);
			const eqIdx = eqIndex(str, 0, endIdx);
			const setCookie = eqIdx === -1 ? {
				name: "",
				value: dec(valueSlice(str, 0, endIdx))
			} : {
				name: valueSlice(str, 0, eqIdx),
				value: dec(valueSlice(str, eqIdx + 1, endIdx))
			};
			let index = endIdx + 1;
			while (index < len) {
				const endIdx = endIndex(str, index, len);
				const eqIdx = eqIndex(str, index, endIdx);
				const attr = eqIdx === -1 ? valueSlice(str, index, endIdx) : valueSlice(str, index, eqIdx);
				const val = eqIdx === -1 ? void 0 : valueSlice(str, eqIdx + 1, endIdx);
				switch (attr.toLowerCase()) {
					case "httponly":
						setCookie.httpOnly = true;
						break;
					case "secure":
						setCookie.secure = true;
						break;
					case "partitioned":
						setCookie.partitioned = true;
						break;
					case "domain":
						setCookie.domain = val;
						break;
					case "path":
						setCookie.path = val;
						break;
					case "max-age":
						if (val && maxAgeRegExp.test(val)) setCookie.maxAge = Number(val);
						break;
					case "expires":
						if (!val) break;
						const date = new Date(val);
						if (Number.isFinite(date.valueOf())) setCookie.expires = date;
						break;
					case "priority":
						if (!val) break;
						const priority = val.toLowerCase();
						if (priority === "low" || priority === "medium" || priority === "high") setCookie.priority = priority;
						break;
					case "samesite":
						if (!val) break;
						const sameSite = val.toLowerCase();
						if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") setCookie.sameSite = sameSite;
						break;
				}
				index = endIdx + 1;
			}
			return setCookie;
		}
		function endIndex(str, min, len) {
			const index = str.indexOf(";", min);
			return index === -1 ? len : index;
		}
		function eqIndex(str, min, max) {
			const index = str.indexOf("=", min);
			return index < max ? index : -1;
		}
		function valueSlice(str, min, max) {
			let start = min;
			let end = max;
			do {
				const code = str.charCodeAt(start);
				if (code !== 32 && code !== 9) break;
			} while (++start < end);
			while (end > start) {
				const code = str.charCodeAt(end - 1);
				if (code !== 32 && code !== 9) break;
				end--;
			}
			return str.slice(start, end);
		}
		function decode(str) {
			if (str.indexOf("%") === -1) return str;
			try {
				return decodeURIComponent(str);
			} catch (e) {
				return str;
			}
		}
		function isDate(val) {
			return __toString.call(val) === "[object Date]";
		}
		return dist;
	}
	var distExports = requireDist();
	function hasDocumentCookie() {
		const testingValue = typeof globalThis === "undefined" ? void 0 : globalThis.TEST_HAS_DOCUMENT_COOKIE;
		if (typeof testingValue === "boolean") return testingValue;
		return typeof document === "object" && typeof document.cookie === "string";
	}
	function parseCookies(cookies) {
		if (typeof cookies === "string") return distExports.parse(cookies);
		else if (typeof cookies === "object" && cookies !== null) return cookies;
		else return {};
	}
	function readCookie(value, options = {}) {
		const cleanValue = cleanupCookieValue(value);
		if (!options.doNotParse) try {
			return JSON.parse(cleanValue);
		} catch (e) {}
		return value;
	}
	function cleanupCookieValue(value) {
		if (value && value[0] === "j" && value[1] === ":") return value.substr(2);
		return value;
	}
	var Cookies = class {
		constructor(cookies, defaultSetOptions = {}) {
			this.changeListeners = [];
			this.HAS_DOCUMENT_COOKIE = false;
			this.update = () => {
				if (!this.HAS_DOCUMENT_COOKIE) return;
				const previousCookies = this.cookies;
				this.cookies = distExports.parse(document.cookie);
				this._checkChanges(previousCookies);
			};
			const domCookies = typeof document === "undefined" ? "" : document.cookie;
			this.cookies = parseCookies(cookies || domCookies);
			this.defaultSetOptions = defaultSetOptions;
			this.HAS_DOCUMENT_COOKIE = hasDocumentCookie();
		}
		_emitChange(params) {
			for (let i = 0; i < this.changeListeners.length; ++i) this.changeListeners[i](params);
		}
		_checkChanges(previousCookies) {
			new Set(Object.keys(previousCookies).concat(Object.keys(this.cookies))).forEach((name) => {
				if (previousCookies[name] !== this.cookies[name]) this._emitChange({
					name,
					value: readCookie(this.cookies[name])
				});
			});
		}
		_startPolling() {
			this.pollingInterval = setInterval(this.update, 300);
		}
		_stopPolling() {
			if (this.pollingInterval) clearInterval(this.pollingInterval);
		}
		get(name, options = {}) {
			if (!options.doNotUpdate) this.update();
			return readCookie(this.cookies[name], options);
		}
		getAll(options = {}) {
			if (!options.doNotUpdate) this.update();
			const result = {};
			for (let name in this.cookies) result[name] = readCookie(this.cookies[name], options);
			return result;
		}
		set(name, value, options) {
			if (options) options = Object.assign(Object.assign({}, this.defaultSetOptions), options);
			else options = this.defaultSetOptions;
			const stringValue = typeof value === "string" ? value : JSON.stringify(value);
			this.cookies = Object.assign(Object.assign({}, this.cookies), { [name]: stringValue });
			if (this.HAS_DOCUMENT_COOKIE) document.cookie = distExports.serialize(name, stringValue, options);
			this._emitChange({
				name,
				value,
				options
			});
		}
		remove(name, options) {
			const finalOptions = options = Object.assign(Object.assign(Object.assign({}, this.defaultSetOptions), options), {
				expires: new Date(1970, 1, 1, 0, 0, 1),
				maxAge: 0
			});
			this.cookies = Object.assign({}, this.cookies);
			delete this.cookies[name];
			if (this.HAS_DOCUMENT_COOKIE) document.cookie = distExports.serialize(name, "", finalOptions);
			this._emitChange({
				name,
				value: void 0,
				options
			});
		}
		addChangeListener(callback) {
			this.changeListeners.push(callback);
			if (this.HAS_DOCUMENT_COOKIE && this.changeListeners.length === 1) if (typeof window === "object" && "cookieStore" in window) window.cookieStore.addEventListener("change", this.update);
			else this._startPolling();
		}
		removeChangeListener(callback) {
			const idx = this.changeListeners.indexOf(callback);
			if (idx >= 0) this.changeListeners.splice(idx, 1);
			if (this.HAS_DOCUMENT_COOKIE && this.changeListeners.length === 0) if (typeof window === "object" && "cookieStore" in window) window.cookieStore.removeEventListener("change", this.update);
			else this._stopPolling();
		}
		removeAllChangeListeners() {
			while (this.changeListeners.length > 0) this.removeChangeListener(this.changeListeners[0]);
		}
	};
	function useCookies(dependencies, { doNotParse = false, autoUpdateDependencies = false } = {}, cookies = new Cookies()) {
		const watchingDependencies = autoUpdateDependencies ? [...dependencies || []] : dependencies;
		let previousCookies = cookies.getAll({ doNotParse: true });
		const touches = (0, vue.shallowRef)(0);
		const onChange = () => {
			const newCookies = cookies.getAll({ doNotParse: true });
			if (shouldUpdate(watchingDependencies || null, newCookies, previousCookies)) touches.value++;
			previousCookies = newCookies;
		};
		cookies.addChangeListener(onChange);
		tryOnScopeDispose(() => {
			cookies.removeChangeListener(onChange);
		});
		return {
			get: (...args) => {
				if (autoUpdateDependencies && watchingDependencies && !watchingDependencies.includes(args[0])) watchingDependencies.push(args[0]);
				touches.value;
				return cookies.get(args[0], {
					doNotParse,
					...args[1]
				});
			},
			getAll: (...args) => {
				touches.value;
				return cookies.getAll({
					doNotParse,
					...args[0]
				});
			},
			set: (...args) => cookies.set(...args),
			remove: (...args) => cookies.remove(...args),
			addChangeListener: (...args) => cookies.addChangeListener(...args),
			removeChangeListener: (...args) => cookies.removeChangeListener(...args)
		};
	}
	function shouldUpdate(dependencies, newCookies, oldCookies) {
		if (!dependencies) return true;
		for (const dependency of dependencies) if (newCookies[dependency] !== oldCookies[dependency]) return true;
		return false;
	}
	var isDarkMode = (0, vue.ref)(false);
	var themeState = useGMValue("common-theme-dark", "off", {
		deep: false,
		debounce: 1e3
	});
	var toggleDarkMode = () => {
		if (isDarkMode.value) {
			disableDarkMode();
			themeState.value = "off";
		} else {
			enableDarkMode();
			themeState.value = "on";
		}
	};
	var labStyleLock = false;
	var enableDarkMode = () => {
		isDarkMode.value = true;
		if (isPageLive()) {
			document.documentElement.setAttribute("common-theme-dark-page", "live");
			document.documentElement.setAttribute("lab-style", "dark");
			labStyleLock = true;
			const origSetAttribute = Element.prototype.setAttribute;
			Element.prototype.setAttribute = function(attr, value) {
				if (labStyleLock && this === document.documentElement && attr === "lab-style") return origSetAttribute.call(this, attr, "dark");
				return origSetAttribute.call(this, attr, value);
			};
		} else if (isPageDynamic()) {
			document.documentElement.setAttribute("common-theme-dark-page", "dynamic");
			document.documentElement.classList.add("bili_dark");
		} else if (isPageMessage()) {
			document.documentElement.setAttribute("common-theme-dark-page", "message");
			document.documentElement.classList.add("bili_dark");
		} else if (isPageSpace()) document.documentElement.setAttribute("common-theme-dark-page", "space");
		else if (isPageHomepage()) document.documentElement.classList.add("bili_dark");
		else document.documentElement.setAttribute("common-theme-dark-page", "common");
		const style = document.querySelector("head link#__css-map__");
		if (style?.href.includes("light.css")) style.href = style.href.replace("light.css", "dark.css");
		const cookies = useCookies();
		if (cookies.get("theme_style") === "dark") return;
		const expires = new Date();
		expires.setDate(expires.getDate() + 3650);
		cookies.set("theme_style", "dark", {
			path: "/",
			domain: ".bilibili.com",
			expires
		});
	};
	var disableDarkMode = () => {
		isDarkMode.value = false;
		document.documentElement.removeAttribute("common-theme-dark-page");
		if (isPageLive()) {
			labStyleLock = false;
			document.documentElement.setAttribute("lab-style", "");
		}
		if (isPageDynamic() || isPageMessage() || isPageHomepage()) document.documentElement.classList.remove("bili_dark");
		const style = document.querySelector("head link#__css-map__");
		if (style?.href.includes("dark.css")) style.href = style.href.replace("dark.css", "light.css");
		const cookies = useCookies();
		if (cookies.get("theme_style") === "light") return;
		const expires = new Date();
		expires.setDate(expires.getDate() + 3650);
		cookies.set("theme_style", "light", {
			path: "/",
			domain: ".bilibili.com",
			expires
		});
	};
	(0, vue.watch)(themeState, (value) => {
		if (value === "on" && !isDarkMode.value) {
			isDarkMode.value = true;
			enableDarkMode();
		}
		if (value === "off" && isDarkMode.value) {
			isDarkMode.value = false;
			disableDarkMode();
		}
	});
	var commonThemeItems = [{
		type: "list",
		id: "common-theme-dark",
		name: "夜间模式",
		description: [
			"实验功能，仅对常用页面生效",
			"插件会接管夜间模式，官方默认时不接管",
			"官方模式在顶栏头像菜单中设定"
		],
		defaultValue: "default",
		disableValue: "default",
		options: [
			{
				value: "off",
				name: "日间",
				fn: disableDarkMode
			},
			{
				value: "on",
				name: "夜间",
				fn: enableDarkMode
			},
			{
				value: "auto",
				name: "跟随系统",
				fn: () => {
					(0, vue.watch)(usePreferredDark(), (v) => {
						if (v) enableDarkMode();
						else disableDarkMode();
					}, { immediate: true });
				}
			},
			{
				value: "default",
				name: "官方默认"
			}
		]
	}];
	var URLHandlerInstance = class URLHandler {
		static instance;
		origReplaceState = _unsafeWindow.history.replaceState;
		origPushState = _unsafeWindow.history.pushState;
		cleanFnArr = [];
		constructor() {
			try {
				this.hijack();
			} catch (err) {
				logger.error("init URLHandler error", err);
			}
		}
		static getInstance() {
			if (!URLHandler.instance) URLHandler.instance = new URLHandler();
			return URLHandler.instance;
		}
		hijack() {
			_unsafeWindow.history.replaceState = (data, unused, url) => {
				try {
					if (typeof url === "string") {
						if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) url = `${location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
						const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), url);
						if (location.href.endsWith(cleanURL)) return;
						return this.origReplaceState.apply(_unsafeWindow.history, [
							data,
							unused,
							cleanURL
						]);
					}
					return this.origReplaceState.apply(_unsafeWindow.history, [
						data,
						unused,
						url
					]);
				} catch (err) {
					logger.error("URLHandler replaceState error", err);
					return this.origReplaceState.apply(_unsafeWindow.history, [
						data,
						unused,
						url
					]);
				}
			};
			_unsafeWindow.history.pushState = (data, unused, url) => {
				try {
					if (typeof url === "string") {
						if (!url.startsWith(location.origin) && !url.startsWith(location.hostname)) url = `${location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
						const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), url);
						if (location.href.endsWith(cleanURL)) return;
						return this.origPushState.apply(_unsafeWindow.history, [
							data,
							unused,
							cleanURL
						]);
					}
					return this.origPushState.apply(_unsafeWindow.history, [
						data,
						unused,
						url
					]);
				} catch (err) {
					logger.error("URLHandler pushState error", err);
					return this.origReplaceState.apply(_unsafeWindow.history, [
						data,
						unused,
						url
					]);
				}
			};
		}
		clean() {
			try {
				const cleanURL = this.cleanFnArr.reduce((curr, fn) => fn(curr), location.href);
				if (location.href !== cleanURL) this.origReplaceState.apply(_unsafeWindow.history, [
					null,
					"",
					cleanURL
				]);
			} catch (err) {
				logger.error("init URLHandler error", err);
			}
		}
	}.getInstance();
	var commonGroups = [
		{
			name: "全站通用 - 基本功能",
			fold: true,
			items: [
				{
					type: "switch",
					id: "border-radius",
					name: "页面直角化，去除圆角",
					attrName: (() => {
						if (isPageDynamic()) return "border-radius-dynamic";
						if (isPageLive()) return "border-radius-live";
						if (isPageSearch()) return "border-radius-search";
						if (isPageVideo() || isPagePlaylist()) return "border-radius-video";
						if (isPageBangumi()) return "border-radius-bangumi";
						if (isPageHomepage()) return "border-radius-homepage";
						if (isPagePopular()) return "border-radius-popular";
						if (isPageSpace()) return "border-radius-space";
						if (isPageChannel()) return "border-radius-channel";
					})()
				},
				{
					type: "switch",
					id: "beauty-scrollbar",
					name: "美化页面滚动条",
					description: ["适用于旧版本浏览器"]
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
					enableFn: async () => {
						const cleanParams = (url) => {
							try {
								if (url.match(/live\.bilibili\.com\/(p\/html|activity|blackboard)/)) return url;
								if (url.match(/bilibili\.com\/pc\/community\/copyright/)) return url;
								const keysToRemove = new Set([
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
									"extra_jump_from",
									"buvid"
								]);
								if (isPageVideo()) {
									keysToRemove.add("image_material_id");
									keysToRemove.add("creative_id");
									keysToRemove.add("biz_extra");
									keysToRemove.add("title_encode");
									keysToRemove.add("caid");
									keysToRemove.add("resource_id");
									keysToRemove.add("source_id");
									keysToRemove.add("request_id");
									keysToRemove.add("title_material_id");
									keysToRemove.add("linked_creative_id");
									keysToRemove.add("bbid");
									keysToRemove.add("ts");
								}
								if (isPageWatchlater()) keysToRemove.add("watchlater_cfg");
								if (isPageSearch()) keysToRemove.add("vt");
								if (isPageLive()) {
									keysToRemove.add("bbid");
									keysToRemove.add("ts");
									keysToRemove.add("hotRank");
									keysToRemove.add("popular_rank");
								}
								const urlObj = new URL(url);
								const params = new URLSearchParams(urlObj.search);
								const temp = [];
								for (const k of params.keys()) keysToRemove.has(k) && temp.push(k);
								for (const k of temp) params.delete(k);
								params.get("p") === "1" && params.delete("p");
								urlObj.search = params.toString().replace(/\/$/, "");
								return urlObj.toString();
							} catch {
								return url;
							}
						};
						URLHandlerInstance.cleanFnArr.push(cleanParams);
						URLHandlerInstance.clean();
					}
				},
				{
					type: "switch",
					id: "hide-footer",
					name: "隐藏 页底footer"
				},
				{
					type: "switch",
					id: "common-unify-font",
					name: "统一全站字体",
					defaultEnable: true,
					attrName: (() => {
						if (isPageLive()) return "common-unify-font-live";
						if (isPageDynamic()) return "common-unify-font-dynamic";
						if (isPagePopular()) return "common-unify-font-popular";
						if (isPageWatchlater()) return "common-unify-font-watchlater";
						if (isPageSpace()) return "common-unify-font-space";
					})(),
					description: ["让全站字体与首页字体一致", "生效页面：动态、直播、热门、稍后再看"]
				}
			]
		},
		{
			name: "全站通用 - 夜间模式",
			fold: true,
			items: commonThemeItems
		},
		{
			name: "全站通用 - 顶栏 左侧",
			fold: true,
			items: [
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
			]
		},
		{
			name: "全站通用 - 顶栏 搜索框",
			fold: true,
			items: [
				{
					type: "switch",
					id: "common-hide-nav-search-btn",
					name: "隐藏 搜索按钮"
				},
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
			]
		},
		{
			name: "全站通用 - 顶栏 右侧",
			fold: true,
			items: [
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
						if (!CSS.supports("selector(:has(*))")) return;
						let cnt = 0;
						const id = setInterval(() => {
							const ele = document.querySelector(`.right-entry .v-popover-wrap:has(.right-entry__outside[href$="/favlist"]),
                        .nav-user-center .user-con .item:has(.mini-favorite)`);
							if (ele) {
								clearInterval(id);
								ele.addEventListener("mouseenter", () => {
									let innerCnt = 0;
									const watchLaterId = setInterval(() => {
										const watchlater = document.querySelector(`:is(.favorite-panel-popover, .vp-container .tabs-panel) .tab-item:nth-child(2)`);
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
			]
		},
		{
			name: "全站通用 - 顶栏 数值设定",
			fold: true,
			items: [
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
			]
		}
	];
	var debugGroups = [{
		name: "日志输出",
		fold: true,
		items: [{
			type: "switch",
			id: "debug-mode",
			name: "Debug 模式",
			description: ["严重影响过滤性能"]
		}]
	}];
	var dynamicGroups = [
		{
			name: "基本功能",
			fold: true,
			items: [{
				type: "switch",
				id: "hide-dynamic-page-fixed-header",
				name: "顶栏 不再吸附顶部"
			}, {
				type: "switch",
				id: "exchange-dynamic-page-left-right-aside",
				name: "交换 左栏与右栏位置"
			}]
		},
		{
			name: "左栏 个人信息/正在直播",
			fold: true,
			items: [
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
					name: "隐藏 左栏"
				}
			]
		},
		{
			name: "右栏 热门话题",
			fold: true,
			items: [
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
					name: "隐藏 热搜"
				},
				{
					type: "switch",
					id: "hide-dynamic-page-aside-right",
					name: "隐藏 右栏"
				}
			]
		},
		{
			name: "中栏 顶部功能",
			fold: true,
			items: [
				{
					type: "switch",
					id: "hide-dynamic-page-bili-dyn-publishing",
					name: "隐藏 动态发布框",
					defaultEnable: true
				},
				{
					type: "switch",
					id: "hide-dynamic-page-up-list",
					name: "隐藏 UP 主列表"
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
			]
		},
		{
			name: "中栏 动态列表",
			fold: true,
			items: [
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
					name: "隐藏 充电动态/问答动态"
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
							if (dynFoldNodes.length) dynFoldNodes.forEach((e) => {
								e instanceof HTMLDivElement && e.click();
							});
						};
						setInterval(unfold, 500);
					}
				},
				{
					type: "switch",
					id: "dynamic-page-unfold-dynamic-content",
					name: "自动展开 动态文字内容",
					description: ["自动隐藏 展开 按钮", "对专栏文章不生效"]
				}
			]
		},
		{
			name: "动态宽度调节",
			fold: true,
			items: [{
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
			}, {
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
			}]
		},
		{
			name: "页面右下角 小按钮",
			fold: true,
			items: [{
				type: "switch",
				id: "hide-dynamic-page-sidebar-old-version",
				name: "隐藏 回到旧版",
				defaultEnable: true
			}, {
				type: "switch",
				id: "hide-dynamic-page-sidebar-back-to-top",
				name: "隐藏 回顶部"
			}]
		}
	];
	var festivalGroups = [
		{
			name: "播放器",
			fold: true,
			items: [
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
					name: "隐藏 全屏时 播放器内标题"
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
				},
				{
					type: "switch",
					id: "video-page-bpx-player-bili-dm-normal-white",
					name: "普通彩色弹幕 变成白色"
				}
			]
		},
		{
			name: "播放控制栏",
			fold: true,
			items: [
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
					id: "video-page-show-bpx-player-shadow-progress-area-fullscreen",
					name: "全屏时 显示底边mini视频进度"
				},
				{
					type: "switch",
					id: "video-page-show-bpx-player-pbp",
					name: "控制栏收起时 显示高能进度条"
				}
			]
		},
		{
			name: "弹幕控制栏",
			fold: true,
			items: [
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
					name: "非全屏时 关闭弹幕栏",
					description: ["字母 D 是弹幕开关快捷键"]
				},
				{
					type: "switch",
					id: "video-page-hide-bpx-player-video-inputbar",
					name: "全屏时 关闭弹幕输入框"
				},
				{
					type: "switch",
					id: "video-page-show-fullscreen-bpx-player-video-info-online",
					name: "全屏时 显示同时在看人数"
				}
			]
		},
		{
			name: "弹幕样式",
			fold: true,
			items: [{
				type: "string",
				id: "video-page-danmaku-font-family",
				name: "弹幕字体",
				description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
				defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
				disableValue: "",
				fn: (value) => {
					document.documentElement.style.setProperty("--video-page-danmaku-font-family", value.trim().replace(/;$/, ""));
				}
			}, {
				type: "string",
				id: "video-page-danmaku-font-weight",
				name: "弹幕字重",
				description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
				defaultValue: "",
				disableValue: "",
				fn: (value) => {
					document.documentElement.style.setProperty("--video-page-danmaku-font-weight", value.trim().replace(/;$/, ""));
				}
			}]
		},
		{
			name: "字幕样式",
			fold: true,
			items: [
				{
					type: "string",
					id: "video-page-subtitle-font-color",
					name: "字幕颜色",
					description: ["遵循 CSS color 语法，留空为禁用"],
					defaultValue: "",
					disableValue: "",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-font-color", value.trim().replace(/;$/, ""));
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
						document.documentElement.style.setProperty("--video-page-subtitle-font-family", value.trim().replace(/;$/, ""));
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
						document.documentElement.style.setProperty("--video-page-subtitle-font-weight", value.trim().replace(/;$/, ""));
					}
				},
				{
					type: "string",
					id: "video-page-subtitle-text-stroke-color",
					name: "描边颜色",
					description: ["遵循 CSS color 语法，留空为禁用", "官方字幕设定需选择 \"无描边\""],
					defaultValue: "",
					disableValue: "",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-color", value.trim().replace(/;$/, ""));
					}
				},
				{
					type: "number",
					id: "video-page-subtitle-text-stroke-width",
					name: "描边宽度 (0为禁用)",
					minValue: 0,
					maxValue: 10,
					step: .01,
					defaultValue: 3.5,
					disableValue: 0,
					addonText: "px",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-width", `${value}px`);
					}
				}
			]
		}
	];
	var homepageBasicItems = [
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
			name: "隐藏 分区栏"
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
			name: "恢复 原始动态按钮",
			description: ["同步生效：首页、分区页"]
		}
	];
	var homepageLayoutItems = [{
		type: "list",
		id: "homepage-layout",
		name: "修改 视频列表列数",
		description: ["未启用时，B 站自动判断列数"],
		defaultValue: "0",
		disableValue: "0",
		options: [
			{
				value: "0",
				name: "未启用"
			},
			{
				value: "2",
				name: "2 列布局"
			},
			{
				value: "3",
				name: "3 列布局"
			},
			{
				value: "4",
				name: "4 列布局"
			},
			{
				value: "5",
				name: "5 列布局"
			},
			{
				value: "6",
				name: "6 列布局"
			}
		]
	}, {
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
	}];
	var fetchHook = class FetchHook {
		static instance;
		preFnArr = [];
		postFnArr = [];
		constructor() {
			try {
				this.hook();
			} catch (err) {
				logger.error("hook fetch error", err);
			}
		}
		static getInstance() {
			if (!FetchHook.instance) FetchHook.instance = new FetchHook();
			return FetchHook.instance;
		}
		addPreFn(fn) {
			this.preFnArr.push(fn);
		}
		addPostFn(fn) {
			this.postFnArr.push(fn);
		}
		hook() {
			const origFetch = _unsafeWindow.fetch;
			_unsafeWindow.fetch = async (input, init) => {
				try {
					this.preFnArr.forEach((fn) => {
						input = fn(input, init);
					});
				} catch {
					return origFetch(input, init);
				}
				let resp = await origFetch(input, init);
				const origResp = resp.clone();
				try {
					for (const fn of this.postFnArr) {
						const ans = await fn(input, init, resp);
						if (ans) resp = ans;
					}
				} catch (err) {
					logger.error("fetch hook postFnArr", err);
					return origResp;
				}
				return resp;
			};
		}
	}.getInstance();
	var homepageGroups = [
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
			items: [
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
					name: "增大 视频载入 视频数量",
					enableFn: () => {
						fetchHook.addPreFn((input, init) => {
							if (typeof input === "string" && input.includes("api.bilibili.com") && input.includes("feed/rcmd") && init?.method?.toUpperCase() === "GET") input = input.replace("&ps=12&", "&ps=24&");
							return input;
						});
					}
				},
				{
					type: "switch",
					id: "homepage-rcmd-video-preload",
					name: "启用 视频列表预加载 (不稳定功能)",
					description: [
						"会默认隐藏分区视频",
						"建议开启 \"增大视频载入数量\"",
						"若影响视频载入或造成卡顿，请关闭本功能"
					],
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
									if (scrollTop > lastScrollTop) if (innerHeight - anchor.getBoundingClientRect().top > -innerHeight * .75 && !isPreload) {
										anchor.classList.add("preload");
										isPreload = true;
									} else {
										isPreload && anchor.classList.remove("preload");
										isPreload = false;
									}
									else {
										isPreload && anchor.classList.remove("preload");
										isPreload = false;
									}
									lastScrollTop = scrollTop;
								});
							}
							if (++cnt > 80) clearInterval(id);
						}, 250);
					},
					enableFnRunAt: "document-end"
				}
			]
		},
		{
			name: "页面侧栏 小组件",
			items: [
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
			]
		}
	];
	var origAppendChild = Element.prototype.appendChild;
	var liveGroups = [
		{
			name: "基本功能",
			fold: true,
			items: [
				{
					type: "switch",
					id: "live-page-sidebar-vm",
					name: "隐藏 页面右侧按钮 实验室/关注",
					defaultEnable: true
				},
				{
					type: "switch",
					id: "live-page-default-skin",
					name: "禁用 播放器皮肤",
					noStyle: true,
					enableFn: () => {
						const node = document.querySelector("head #skin-css");
						if (node) node.remove();
						Element.prototype.appendChild = function(node) {
							if (this === document.head && node instanceof HTMLStyleElement && node.id === "skin-css") return node;
							return origAppendChild.call(this, node);
						};
					},
					disableFn: () => {
						Element.prototype.appendChild = origAppendChild;
					}
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
						if (!/\/\d+/.test(location.pathname)) return;
						if (self !== top) return;
						let cnt = 0;
						const id = setInterval(() => {
							if (document.querySelector(".rendererRoot, #main.live-activity-full-main, #internationalHeader, iframe[src*=\"live.bilibili.com/blanc/\"]")) {
								location.href = location.href.replace("live.bilibili.com/", "live.bilibili.com/blanc/");
								clearInterval(id);
							}
							++cnt > 50 && clearInterval(id);
						}, 200);
					}
				},
				{
					type: "switch",
					id: "auto-best-quality",
					name: "自动切换最高画质 (实验功能)",
					description: ["自动画质时也会切换，但仍显示[自动]"],
					noStyle: true,
					enableFn: async () => {
						if (!/\/\d+|\/blanc\/\d+/.test(location.pathname)) return;
						if (self !== top) return;
						const qualityFn = () => {
							const player = _unsafeWindow.livePlayer || _unsafeWindow.EmbedPlayer?.instance;
							if (player) try {
								const info = player?.getPlayerInfo();
								const arr = player?.getPlayerInfo().qualityCandidates;
								if (info && arr && arr.length) {
									let maxQn = 0;
									arr.forEach((v) => {
										if (v.qn && parseInt(v.qn) > maxQn) maxQn = parseInt(v.qn);
									});
									if (maxQn && info.quality && maxQn > parseInt(info.quality)) player.switchQuality(`${maxQn}`);
								}
							} catch (err) {
								logger.error("auto-best-quality error", err);
							}
						};
						setTimeout(qualityFn, 2e3);
					},
					enableFnRunAt: "document-end"
				},
				{
					type: "number",
					id: "live-page-width",
					name: "修改 页面宽度占比 (0禁用)",
					description: ["推荐范围 85~95"],
					minValue: 0,
					maxValue: 100,
					step: 1,
					defaultValue: 0,
					disableValue: 0,
					addonText: "vw",
					fn: (value) => {
						document.documentElement.style.setProperty("--live-page-width", `${value}vw`);
					}
				}
			]
		},
		{
			name: "直播信息栏",
			fold: true,
			items: [
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
					id: "live-page-head-info-vm-upper-row-hotrank",
					name: "隐藏 榜单"
				},
				{
					type: "switch",
					id: "live-page-head-info-vm-upper-row-activity",
					name: "隐藏 活动"
				},
				{
					type: "switch",
					id: "live-page-head-info-vm",
					name: "隐藏 信息栏"
				}
			]
		},
		{
			name: "播放器",
			fold: true,
			items: [
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
					id: "live-page-hide-web-player-background",
					name: "隐藏 播放器背景图",
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
					id: "live-page-gift-control-vm-show-lottery",
					name: "隐藏 礼物栏 显示天选"
				},
				{
					type: "switch",
					id: "live-page-fullscreen-danmaku-vm",
					name: "全屏时 隐藏弹幕发送框"
				}
			]
		},
		{
			name: "右栏 弹幕列表",
			fold: true,
			items: [
				{
					type: "number",
					id: "live-page-danmaku-font-size",
					name: "调整 弹幕列表字号",
					description: ["设为 0 禁用，推荐范围 13~17"],
					minValue: 0,
					maxValue: 20,
					step: 1,
					defaultValue: 15,
					disableValue: 0,
					addonText: "px",
					fn: (value) => {
						document.documentElement.style.setProperty("--live-page-danmaku-font-size", `${value}px`);
					}
				},
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
					id: "live-page-convention-msg",
					name: "隐藏 系统提示",
					defaultEnable: true
				},
				{
					type: "switch",
					id: "live-page-welcome-msg",
					name: "隐藏 XXX来了",
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
					id: "live-page-bulge-danmaku",
					name: "隐藏 大表情弹幕"
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
					id: "live-page-combo-card",
					name: "隐藏 互动框",
					description: ["包含倒计时、投票、找TA玩等"],
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
			]
		},
		{
			name: "下方页面（动态/公告）",
			fold: true,
			items: [
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
			]
		},
		{
			name: "顶栏 左侧",
			fold: true,
			items: [
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
			]
		},
		{
			name: "顶栏 搜索框",
			fold: true,
			items: [
				{
					type: "switch",
					id: "live-page-header-search-btn",
					name: "隐藏 搜索按钮"
				},
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
			]
		},
		{
			name: "顶栏 右侧",
			fold: true,
			items: [
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
			]
		}
	];
	var popularGroups = [
		{
			name: "基本功能",
			items: [
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
			]
		},
		{
			name: "页面强制布局",
			items: [{
				type: "list",
				id: "popular-layout",
				name: "强制修改视频列数",
				defaultValue: "2",
				disableValue: "0",
				description: ["默认隐藏视频简介、标签", "对 全站音乐榜 不生效"],
				options: [
					{
						value: "2",
						name: "未启用"
					},
					{
						value: "3",
						name: "3 列布局"
					},
					{
						value: "4",
						name: "4 列布局"
					},
					{
						value: "5",
						name: "5 列布局"
					},
					{
						value: "6",
						name: "6 列布局"
					}
				]
			}]
		},
		{
			name: "其他功能",
			items: [
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
			],
			fold: true
		}
	];
	var searchGroups = [{
		name: "基本功能",
		items: [
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
				name: "隐藏 搜索结果顶部 游戏、热搜"
			},
			{
				type: "switch",
				id: "hide-search-page-ad",
				name: "隐藏 广告",
				defaultEnable: true
			},
			{
				type: "switch",
				id: "hide-search-page-live-room-result",
				name: "隐藏 直播"
			},
			{
				type: "switch",
				id: "hide-search-page-cheese-result",
				name: "隐藏 课堂"
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
		]
	}, {
		name: "页面右下角 小按钮",
		items: [{
			type: "switch",
			id: "hide-search-page-customer-service",
			name: "隐藏 客服",
			defaultEnable: true
		}, {
			type: "switch",
			id: "hide-search-page-btn-to-top",
			name: "隐藏 回顶部"
		}]
	}];
	var spaceGroups = [
		{
			name: "基本功能",
			items: [
				{
					type: "switch",
					id: "space-page-redirect-to-video",
					name: "打开用户主页 自动跳转到投稿",
					noStyle: true,
					enableFn: () => {
						if (/\/\d+\/?($|\?)/.test(location.pathname)) {
							const userid = location.pathname.match(/\d+/)?.[0];
							if (userid) location.href = `https://space.bilibili.com/${userid}/upload/video`;
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
			]
		},
		{
			name: "页面侧栏",
			items: [{
				type: "switch",
				id: "hide-space-page-sidebar-feedback",
				name: "隐藏 新版反馈"
			}, {
				type: "switch",
				id: "hide-space-page-sidebar-revert",
				name: "隐藏 返回旧版"
			}]
		},
		{
			name: "动态列表 (与动态页同步)",
			items: [
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
					name: "隐藏 充电动态/问答动态"
				},
				{
					type: "switch",
					id: "hide-dynamic-page-bili-dyn-charge-video",
					name: "隐藏 全部充电视频(含已充电)"
				},
				{
					type: "switch",
					id: "dynamic-page-unfold-dynamic-content",
					name: "自动展开 动态文字内容",
					description: ["自动隐藏 展开 按钮", "对专栏文章不生效"]
				}
			],
			fold: true
		}
	];
	var videoBasicItems = [
		{
			type: "switch",
			id: "video-page-hide-fixed-header",
			name: "顶栏 滚动页面后 不再吸附顶部"
		},
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
								if (params.has("p")) partNum += `?p=${params.get("p")}`;
								const aid = dec(bvid);
								if (partNum || urlObj.hash) return `https://www.bilibili.com/video/av${aid}/${partNum}${urlObj.hash}`;
								return `https://www.bilibili.com/video/av${aid}`;
							}
						}
						return url;
					} catch {
						return url;
					}
				};
				URLHandlerInstance.cleanFnArr.push(bv2av);
				URLHandlerInstance.clean();
			}
		},
		{
			type: "switch",
			id: "video-page-simple-share",
			name: "净化分享功能",
			description: ["点击分享按钮时，复制纯净链接"],
			noStyle: true,
			enableFn: async () => {
				let counter = 0;
				const id = setInterval(() => {
					counter++;
					const shareBtn = document.getElementById("share-btn-outer");
					if (shareBtn) {
						shareBtn.addEventListener("click", () => {
							let title = document.querySelector(".video-info-title .video-title, #viewbox_report > h1, .video-title-href")?.textContent;
							const prefix = document.querySelector("#categoryPill")?.textContent;
							if (prefix && title && title.startsWith(prefix)) title = title.slice(prefix.length).trim();
							if (title && !title.match(/^[（【［《「＜｛〔〖〈『].*|.*[）】］》」＞｝〕〗〉』]$/)) title = `【${title}】`;
							const avbv = matchAvidBvid(location.href);
							let domain = _GM_getValue("video-page-simple-share-domain");
							if (!domain || domain === "disable") domain = "www.bilibili.com/video";
							let shareText = title ? `${title} \nhttps://${domain}/${avbv}` : `https://${domain}/${avbv}`;
							const urlObj = new URL(location.href);
							const params = new URLSearchParams(urlObj.search);
							if (params.has("p")) shareText += `?p=${params.get("p")}`;
							navigator.clipboard.writeText(shareText).catch(() => {});
						});
						clearInterval(id);
					} else if (counter > 50) clearInterval(id);
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
					value: "disable",
					name: "不使用"
				},
				{
					value: "b23.tv",
					name: "b23.tv"
				},
				{
					value: "bili22.cn",
					name: "bili22.cn"
				},
				{
					value: "bili33.cn",
					name: "bili33.cn"
				},
				{
					value: "bili23.cn",
					name: "bili23.cn"
				},
				{
					value: "bili2233.cn",
					name: "bili2233.cn"
				},
				{
					value: "bilibili.com",
					name: "bilibili.com"
				}
			]
		}
	];
	var videoDanmakuItems = [{
		type: "string",
		id: "video-page-danmaku-font-family",
		name: "弹幕字体",
		description: ["遵循 CSS font-family 语法，留空为禁用", "确保本地已安装该字体，检查家族名是否正确"],
		defaultValue: "PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif",
		disableValue: "",
		fn: (value) => {
			document.documentElement.style.setProperty("--video-page-danmaku-font-family", value.trim().replace(/;$/, ""));
		}
	}, {
		type: "string",
		id: "video-page-danmaku-font-weight",
		name: "弹幕字重",
		description: ["遵循 CSS font-weight 语法，留空为禁用", "确保本地字体支持该字重"],
		defaultValue: "",
		disableValue: "",
		fn: (value) => {
			document.documentElement.style.setProperty("--video-page-danmaku-font-weight", value.trim().replace(/;$/, ""));
		}
	}];
	var videoDanmakuControlItems = [
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
			name: "非全屏时 关闭弹幕栏",
			description: ["字母 D 是弹幕开关快捷键"]
		},
		{
			type: "switch",
			id: "video-page-hide-bpx-player-video-inputbar",
			name: "全屏时 关闭弹幕输入框"
		},
		{
			type: "switch",
			id: "video-page-show-fullscreen-bpx-player-video-info-online",
			name: "全屏时 显示同时在看人数"
		}
	];
	var videoInfoItems = [
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
	var videoMiniPlayerItems = [
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
					waitForEle(document, "#bilibili-player .bpx-player-container", (node) => {
						return node.className.startsWith("bpx-player-container");
					}).then(() => {
						const player = document.querySelector("#bilibili-player .bpx-player-container");
						if (!player) return;
						let flag = false;
						player.addEventListener("mouseenter", () => {
							if (player.getAttribute("data-screen") === "mini") flag = true;
						});
						player.addEventListener("mouseleave", () => {
							flag = false;
						});
						player.addEventListener("wheel", (e) => {
							if (flag) {
								e.stopPropagation();
								e.preventDefault();
								let newZoom = zoom.value - Math.sign(e.deltaY) * 5 / 100;
								newZoom = newZoom < .5 ? .5 : newZoom;
								newZoom = newZoom > 3 ? 3 : newZoom;
								if (newZoom !== zoom.value) {
									zoom.value = newZoom;
									document.documentElement.style.setProperty("--mini-player-zoom", newZoom + "");
								}
							}
						});
					});
				} catch (err) {
					logger.error("adjust mini player size error", err);
				}
			},
			enableFnRunAt: "document-end"
		},
		{
			type: "switch",
			id: "video-page-bpx-player-mini-mode-position-record",
			name: "记录小窗位置",
			enableFn: async () => {
				const pos = useStorage("bili-cleaner-mini-player-pos", {
					tx: 0,
					ty: 0
				}, localStorage);
				document.documentElement.style.setProperty("--mini-player-translate-x", pos.value.tx + "px");
				document.documentElement.style.setProperty("--mini-player-translate-y", pos.value.ty + "px");
				waitForEle(document, "#bilibili-player .bpx-player-container", (node) => {
					return node.className.startsWith("bpx-player-container");
				}).then((player) => {
					if (player) player.addEventListener("mouseup", () => {
						if (player.getAttribute("data-screen") === "mini") {
							const rect = player.getBoundingClientRect();
							pos.value.tx = 84 - (document.documentElement.clientWidth - rect.right);
							pos.value.ty = 48 - (document.documentElement.clientHeight - rect.bottom);
						}
					});
				});
			},
			enableFnRunAt: "document-end"
		}
	];
	var videoPlayerItems = [
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
			name: "隐藏 全屏时 播放器内标题"
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
		},
		{
			type: "switch",
			id: "video-page-bpx-player-bili-dm-normal-white",
			name: "普通彩色弹幕 变成白色"
		}
	];
	var videoPlayerControlItems = [
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
			id: "video-page-show-bpx-player-shadow-progress-area-fullscreen",
			name: "全屏时 显示底边mini视频进度"
		},
		{
			type: "switch",
			id: "video-page-show-bpx-player-pbp",
			name: "控制栏收起时 显示高能进度条"
		}
	];
	var wideScreenManager = class WideScreenManager {
		static instance;
		wideScreenLock = false;
		constructor() {
			if (isPageVideo() || isPagePlaylist()) {
				let _isWide = _unsafeWindow.isWide;
				Object.defineProperty(_unsafeWindow, "isWide", {
					get: () => _isWide,
					set: (value) => {
						_isWide = value || this.wideScreenLock;
						if (_isWide) document.documentElement?.setAttribute("player-is-wide", "");
						else document.documentElement?.removeAttribute("player-is-wide");
					}
				});
			}
		}
		static getInstance() {
			if (!WideScreenManager.instance) WideScreenManager.instance = new WideScreenManager();
			return WideScreenManager.instance;
		}
		lock() {
			this.wideScreenLock = true;
		}
		unlock() {
			this.wideScreenLock = false;
		}
	}.getInstance();
	var preventVolumeTune = false;
	var origGetBoundingClientRect = Element.prototype.getBoundingClientRect;
	var cleanUp = () => {};
	var isWebScreen = () => {
		if (_unsafeWindow.player?.getManifest()?.screenKind === 2) return true;
		return document.body?.classList.contains("webscreen-fix");
	};
	var isMiniScreen = () => {
		return _unsafeWindow.player?.getManifest()?.screenKind === 3;
	};
	for (const eventName of [
		"mousewheel",
		"DOMMouseScroll",
		"wheel"
	]) useEventListener(window, eventName, (e) => {
		if (preventVolumeTune && isWebScreen() && !isMiniScreen()) e.stopImmediatePropagation();
	}, {
		capture: true,
		passive: true
	});
	var toggleFullScreen = () => {
		const fullScreenStatus = () => {
			if (document.fullscreenElement) return "ele";
			if (window.innerWidth === screen.width && window.innerHeight === screen.height) return "f11";
			return "not";
		};
		switch (fullScreenStatus()) {
			case "ele":
				document.exitFullscreen().catch(() => {});
				if (isWebScreen()) playerGoTo("normal");
				break;
			case "f11":
				playerGoTo("normal");
				break;
			case "not":
				document.documentElement.requestFullscreen().catch(() => {});
				if (!isWebScreen()) playerGoTo("web");
				window.scrollTo(0, 0);
				break;
		}
	};
	var handleFullScreenClick = (e) => {
		const target = e.target;
		if (target.closest("#bilibili-player .bpx-player-ctrl-full") || target.classList.contains("bpx-player-ctrl-full") && target.classList.contains("#bilibili-player")) {
			e.stopImmediatePropagation();
			toggleFullScreen();
		}
	};
	var handleFullScreenDblClick = (e) => {
		const target = e.target;
		if (target.closest("#bilibili-player .bpx-player-video-perch") || target.classList.contains("bpx-player-video-perch") && target.closest("#bilibili-player")) {
			e.stopImmediatePropagation();
			document.querySelector("#bilibili-player video")?.pause();
			toggleFullScreen();
		}
	};
	var videoGroups = [
		{
			name: "基本功能",
			fold: true,
			items: videoBasicItems
		},
		{
			name: "布局设定",
			fold: true,
			items: [
				{
					type: "switch",
					id: "default-widescreen",
					name: "自动宽屏播放",
					enableFn: () => {
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
					id: "default-webscreen",
					name: "自动网页全屏播放",
					description: ["实验功能，不要与自动宽屏同时启用", "偶尔会出现载入时闪屏"],
					enableFn: () => {
						const id = setInterval(() => {
							if (typeof _unsafeWindow.player?.requestStatue === "function") _unsafeWindow.player.requestStatue(2).then(() => {
								clearInterval(id);
								const id2 = setInterval(() => {
									const container = document.querySelector("#bilibili-player .bpx-player-container");
									const video = document.querySelector("#bilibili-player video");
									if (container && video && container.getAttribute("data-screen") === "web") {
										const a = container.offsetHeight / innerHeight;
										const b = container.offsetWidth / innerWidth;
										const c = video.offsetHeight / innerHeight;
										if (a > .9 && a < 1.1 && b > .9 && b < 1.1 && c > .9 && c < 1.1) {
											clearInterval(id2);
											setTimeout(() => {
												document.documentElement.classList.add("webscreen-loaded");
											}, 1e3);
										}
									}
								}, 200);
							}).catch(() => {});
						}, 100);
					}
				},
				{
					type: "switch",
					id: "webscreen-scrollable",
					name: "网页全屏时 页面可滚动",
					description: ["启用后滚轮无法调节音量，刷新生效"],
					enableFn: () => {
						preventVolumeTune = true;
					},
					disableFn: () => {
						preventVolumeTune = false;
					},
					enableFnRunAt: "document-end"
				},
				{
					type: "switch",
					id: "fullscreen-scrollable",
					name: "网页全屏/真全屏时 页面可滚动",
					description: ["启用后滚轮无法调节音量，刷新生效"],
					enableFn: () => {
						preventVolumeTune = true;
						document.addEventListener("click", handleFullScreenClick, true);
						document.addEventListener("dblclick", handleFullScreenDblClick, true);
					},
					disableFn: () => {
						preventVolumeTune = false;
						document.removeEventListener("click", handleFullScreenClick, true);
						document.removeEventListener("dblclick", handleFullScreenDblClick, true);
					}
				},
				{
					type: "switch",
					id: "screen-scrollable-enable-mini-player",
					name: "网页全屏滚动时 启用小窗播放器",
					description: ["实验功能，不支持真全屏"],
					enableFn: () => {
						Element.prototype.getBoundingClientRect = function() {
							if (!document.fullscreenElement && isWebScreen() && (this.id === "arc_toolbar_report" || this.id === "playlistToolbar")) return {
								...origGetBoundingClientRect.call(this),
								top: 999999
							};
							return origGetBoundingClientRect.call(this);
						};
						cleanUp = useEventListener(window, "scroll", () => {
							if (!document.fullscreenElement && isWebScreen()) {
								const currIsMiniScreen = isMiniScreen();
								if (!currIsMiniScreen && scrollY >= innerHeight * 1.05) playerGoTo("mini");
								else if (currIsMiniScreen && scrollY < innerHeight * 1.05) playerGoTo("web");
							}
						});
					},
					disableFn: () => {
						Element.prototype.getBoundingClientRect = origGetBoundingClientRect;
						cleanUp();
					}
				},
				{
					type: "switch",
					id: "screen-scrollable-move-header-bottom",
					name: "全屏滚动时 在视频底部显示顶栏",
					description: ["网页全屏/真全屏滚动时生效"]
				},
				{
					type: "switch",
					id: "video-page-exchange-player-position",
					name: "播放器和视频信息 交换位置"
				},
				{
					type: "number",
					id: "normalscreen-width",
					name: "普通播放宽度调节（-1禁用）",
					minValue: -1,
					maxValue: 100,
					step: .1,
					defaultValue: -1,
					disableValue: -1,
					addonText: "vw",
					fn: (value) => {
						document.documentElement.style.setProperty("--normalscreen-width", `${value}vw`);
					}
				}
			]
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
			items: [
				{
					type: "string",
					id: "video-page-subtitle-font-color",
					name: "字幕颜色",
					description: ["遵循 CSS color 语法，留空为禁用"],
					defaultValue: "",
					disableValue: "",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-font-color", value.trim().replace(/;$/, ""));
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
						document.documentElement.style.setProperty("--video-page-subtitle-font-family", value.trim().replace(/;$/, ""));
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
						document.documentElement.style.setProperty("--video-page-subtitle-font-weight", value.trim().replace(/;$/, ""));
					}
				},
				{
					type: "string",
					id: "video-page-subtitle-text-stroke-color",
					name: "描边颜色",
					description: ["遵循 CSS color 语法，留空为禁用", "官方字幕设定需选择 \"无描边\""],
					defaultValue: "",
					disableValue: "",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-color", value.trim().replace(/;$/, ""));
					}
				},
				{
					type: "number",
					id: "video-page-subtitle-text-stroke-width",
					name: "描边宽度 (0为禁用)",
					minValue: 0,
					maxValue: 10,
					step: .01,
					defaultValue: 3.5,
					disableValue: 0,
					addonText: "px",
					fn: (value) => {
						document.documentElement.style.setProperty("--video-page-subtitle-text-stroke-width", `${value}px`);
					}
				}
			]
		},
		{
			name: "工具栏",
			fold: true,
			items: [
				{
					type: "switch",
					id: "video-page-coin-disable-auto-like",
					name: "投币时不自动点赞",
					noStyle: true,
					enableFn: async () => {
						const disableAutoLike = () => {
							let counter = 0;
							const timer = setInterval(() => {
								const checkbox = document.querySelector("body > .bili-dialog-m .bili-dialog-bomb .like-checkbox input");
								if (checkbox) {
									checkbox.checked && checkbox.click();
									clearInterval(timer);
								} else {
									counter++;
									if (counter > 100) clearInterval(timer);
								}
							}, 20);
						};
						const coinBtn = document.querySelector("#arc_toolbar_report .video-coin.video-toolbar-left-item");
						if (coinBtn) coinBtn.addEventListener("click", disableAutoLike);
						else document.addEventListener("DOMContentLoaded", () => {
							document.querySelector("#arc_toolbar_report .video-coin.video-toolbar-left-item")?.addEventListener("click", disableAutoLike);
						});
					}
				},
				{
					type: "switch",
					id: "video-page-simple-video-share-popover",
					name: "精简 分享按钮弹出菜单",
					defaultEnable: true
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
					id: "video-page-hide-below-info-video-complaint",
					name: "隐藏 举报按钮"
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
			]
		},
		{
			name: "右侧 UP主信息",
			fold: true,
			items: [
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
				},
				{
					type: "switch",
					id: "video-page-hide-up-usercard",
					name: "隐藏 UP主用户卡片"
				}
			]
		},
		{
			name: "右侧 视频栏",
			fold: true,
			items: [
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
					id: "video-page-unfold-right-container-danmaku",
					name: "自动展开 弹幕列表",
					enableFn: () => {
						let cnt = 0;
						const id = setInterval(() => {
							const collapseHeader = document.querySelector("#danmukuBox .bui-collapse-wrap-folded .bui-collapse-header");
							if (collapseHeader) {
								collapseHeader.click();
								clearInterval(id);
							}
							++cnt > 20 && clearInterval(id);
						}, 500);
					},
					enableFnRunAt: "document-end"
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
					id: "video-page-unfold-right-container-reco-list",
					name: "自动展开 相关视频",
					enableFn: () => {
						const fn = () => {
							let cnt = 0;
							const id = setInterval(() => {
								const btn = document.querySelector(".rec-footer");
								if (btn) {
									if (btn.innerText.includes("展开")) btn.click();
									if (btn.innerText.includes("收起")) clearInterval(id);
								}
								++cnt > 10 && clearInterval(id);
							}, 1e3);
						};
						fn();
						waitForEle(document, ".recommend-list-v1, .recommend-list-container", (node) => ["recommend-list-v1", "recommend-list-container"].includes(node.className)).then((ele) => {
							if (ele) {
								let lastURL = location.href;
								new MutationObserver(() => {
									if (lastURL !== location.href) {
										lastURL = location.href;
										fn();
									}
								}).observe(ele, {
									childList: true,
									subtree: true
								});
							}
						});
					},
					enableFnRunAt: "document-end"
				},
				{
					type: "switch",
					id: "video-page-hide-right-container-reco-list-rec-footer",
					name: "隐藏 展开/收起 按钮"
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
					name: "隐藏 右栏 (宽屏模式不适用)"
				}
			]
		},
		{
			name: "小窗播放器",
			fold: true,
			items: videoMiniPlayerItems
		},
		{
			name: "页面右下角 小按钮",
			fold: true,
			items: [
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
			]
		}
	];
	var watchlaterGroups = [{
		name: "基本功能",
		items: [
			{
				type: "list",
				id: "watchlater-layout",
				name: "修改 视频列表列数",
				description: ["未启用时，B 站自动判断列数"],
				defaultValue: "0",
				disableValue: "0",
				options: [
					{
						value: "0",
						name: "未启用"
					},
					{
						value: "4",
						name: "4 列布局"
					},
					{
						value: "5",
						name: "5 列布局"
					}
				]
			},
			{
				type: "switch",
				id: "watchlater-increase-font-size",
				name: "增大 视频信息字号"
			},
			{
				type: "switch",
				id: "watchlater-hide-feedback",
				name: "隐藏 新版反馈",
				defaultEnable: true
			}
		]
	}];
	var bangumi_default = "html[video-page-hide-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[video-page-danmaku-font-family] .bili-danmaku-x-dm{--fontFamily:var(--video-page-danmaku-font-family)!important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm{--fontWeight:var(--video-page-danmaku-font-weight)!important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:#0000!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area{display:none!important}html[video-page-hide-bpx-player-sending-area] #bilibili-player-wrap[class^=video_playerNormal]{height:calc(var(--video-width) * .5625)}html[video-page-hide-bpx-player-sending-area] #bilibili-player-wrap[class^=video_playerWide]{height:calc(var(--containerWidth) * .5625)}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info{color:#fffc!important;margin-bottom:1px!important;margin-right:16px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-online,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-online{font-size:14px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-divide,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-divide{display:none}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 16px!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-hide-bpx-player-mini-mode-process] .bpx-player-container[data-screen=mini]:not(:hover) .bpx-player-mini-progress{display:none}html[video-page-hide-bpx-player-mini-mode-danmaku] .bpx-player-container[data-screen=mini] .bpx-player-row-dm-wrap{visibility:hidden!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-screen=mini]{height:calc(225px * var(--mini-player-zoom,1))!important;width:calc(400px * var(--mini-player-zoom,1))!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"1\"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"2\"][data-screen=mini]{height:calc(180px * var(--mini-player-zoom,1))!important;width:calc(320px * var(--mini-player-zoom,1))!important}@media screen and (width>=1681px){html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"1\"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"2\"][data-screen=mini]{height:calc(203px * var(--mini-player-zoom,1))!important;width:calc(360px * var(--mini-player-zoom,1))!important}}html[video-page-bpx-player-mini-mode-position-record] .bpx-player-container[data-screen=mini]{transform:translateX(var(--mini-player-translate-x)) translateY(var(--mini-player-translate-y))}html[video-page-hide-bpx-player-bili-guide-all] .bili-follow-to-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-animate,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-cyc,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-followed,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-gray,html[video-page-hide-bpx-player-bili-vote] .bili-vote,html[video-page-hide-bpx-player-bili-vote] .bili-danmaku-x-vote,html[video-page-hide-bpx-player-bili-qoe-feedback] .bpx-player-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-score,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-vote,html[video-page-hide-bpx-player-bili-score] .bili-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-superRating,html[video-page-hide-bpx-player-bili-score-sum] .bili-scoreSum,html[video-page-hide-bpx-player-bili-score-sum] .bili-danmaku-x-scoreSum,html[video-page-hide-bpx-player-bili-clock] .bili-clock,html[video-page-hide-bpx-player-bili-clock] .bili-danmaku-x-clock,html[video-page-hide-bpx-player-bili-cmtime] .bili-cmtime,html[video-page-hide-bpx-player-bili-cmtime] .bili-danmaku-x-cmtime,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-cmd-shrink,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-danmaku-x-cmd-shrink,html[video-page-hide-bpx-player-bili-reserve] .bili-reserve,html[video-page-hide-bpx-player-bili-reserve] .bili-danmaku-x-reserve,html[video-page-hide-bpx-player-bili-link] .bili-link,html[video-page-hide-bpx-player-bili-link] .bili-danmaku-x-link,html[video-page-hide-bpx-player-cmd-dm-wrap] .bpx-player-cmd-dm-wrap,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[bangumi-page-hide-bpx-player-top-follow] .bpx-player-top-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[bangumi-page-hide-bpx-player-record-item-wrap] .bpx-player-record-item-wrap,html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-colorful,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:unset!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-bpx-player-bili-dm-normal-white] .bili-danmaku-x-dm,html[video-page-bpx-player-bili-dm-normal-white] .bili-dm{--color:white!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-shadow-progress-area-fullscreen] #bilibili-player [data-screen=full][data-ctrl-hidden=true] .bpx-player-shadow-progress-area{opacity:1!important;visibility:visible!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){position:relative!important;overflow:auto!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #bilibili-player-wrap{width:100vw!important;height:100vh!important;position:absolute!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .main-container{margin:0 auto!important;padding-top:calc(100vh + 15px)!important;position:static!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen])::-webkit-scrollbar{display:none!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist{max-height:calc(50vh + 75px)!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap{max-height:50vh!important}html[webscreen-scrollable] .bili-msg{z-index:100001!important}@supports ((-moz-appearance:none)){html[webscreen-scrollable]:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}html[webscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){position:relative!important;overflow:auto!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #bilibili-player-wrap{width:100vw!important;height:100vh!important;position:absolute!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .main-container{margin:0 auto!important;padding-top:calc(100vh + 15px)!important;position:static!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen])::-webkit-scrollbar{display:none!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist{max-height:calc(50vh + 75px)!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap{max-height:50vh!important}html[fullscreen-scrollable] .bili-msg{z-index:100001!important}@supports ((-moz-appearance:none)){html[fullscreen-scrollable]:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}html[fullscreen-scrollable] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]){scrollbar-width:none!important}}html[screen-scrollable-enable-mini-player] #bilibili-player-wrap[class^=video_playerFullScreen] .bpx-player-mini-close{display:none!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) #biliMainHeader{width:100%!important;display:block!important;position:absolute!important;top:100vh!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .fixed-header .bili-header__bar{position:relative!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .home-container{padding-top:64px!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .custom-navbar[role=navigation]{z-index:1000!important;top:100vh!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]) .custom-navbar[role=navigation] .custom-navbar-item .popup{top:100%!important}html[screen-scrollable-move-header-bottom] body:has(#bilibili-player-wrap[class^=video_playerFullScreen]).fixed-navbar .custom-navbar[role=navigation]{position:absolute!important}html[screen-scrollable-move-header-bottom] .custom-navbar[role=navigation]{transition:unset!important}html[normalscreen-width] .home-container:not(.wide){--video-width:var(--normalscreen-width)}html[bangumi-page-hide-right-container-section-height] .plp-r [class^=vipPaybar_],html[bangumi-page-hide-right-container-section-height] .plp-r [class^=paybar_]{display:none!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded){max-height:fit-content!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-collapse-body{height:fit-content!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-filter-wrap,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-container,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-area,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-long-list-wrap{max-height:fit-content!important}html[video-page-hide-right-container-danmaku] #danmukuBox,html[bangumi-page-hide-eplist-badge] [class^=eplist_ep_list_wrapper] [class^=imageListItem_badge]:not([style*=\\#00C0FF]),html[bangumi-page-hide-eplist-badge] [class^=eplist_ep_list_wrapper] [class^=numberListItem_badge]:not([style*=\\#00C0FF]),html[bangumi-page-hide-recommend] .plp-r [class^=recommend_wrap],html[bangumi-page-hide-sidenav-issue] [class^=navTools_navMenu] [title=新版反馈],html[video-page-hide-sidenav-mini] [class^=navTools_navMenu] [title=点击打开迷你播放器],html[video-page-hide-sidenav-customer-service] [class^=navTools_navMenu] [title=帮助反馈],html[video-page-hide-sidenav-back-to-top] [class^=navTools_navMenu] [title=返回顶部],html[video-page-simple-video-share-popover] #share-container-id [class^=Share_boxBottom]{display:none!important}html[video-page-simple-video-share-popover] #share-container-id [class^=Share_boxTop]{padding:15px!important}html[video-page-simple-video-share-popover] #share-container-id [class^=Share_boxTopRight]{display:none!important}html[video-page-simple-video-share-popover] #share-container-id [class^=Share_boxTopLeft]{padding:0!important}html[video-page-hide-video-share-popover] #share-container-id [class^=Share_share]{display:none!important}html[bangumi-page-hide-watch-together] .toolbar span:has(>#watch_together_tab){display:none!important}html[bangumi-page-hide-toolbar] .player-left-components .toolbar,html[bangumi-page-hide-media-info] [class^=mediainfo_mediaInfo],html[bangumi-page-simple-media-info] [class^=mediainfo_btnHome],html[bangumi-page-simple-media-info] [class^=upinfo_upInfoCard]{display:none!important}html[bangumi-page-simple-media-info] [class^=mediainfo_score]{font-size:25px!important}html[bangumi-page-simple-media-info] [class^=mediainfo_mediaDesc]:has(+[class^=mediainfo_media_desc_section]){visibility:hidden!important;height:0!important;margin-bottom:8px!important}html[bangumi-page-simple-media-info] [class^=mediainfo_media_desc_section]{height:60px!important}html[bangumi-page-hide-sponsor-module] #sponsor_module{display:none!important}";
	var a;
	var _virtual_monkey_style_tools_default = (b) => (a = document.createElement("style"), a.append(b), a);
	var index_scss_default$12 = _virtual_monkey_style_tools_default(bangumi_default);
	var index_scss_default$11 = _virtual_monkey_style_tools_default("html[homepage-hide-banner] #biliMainHeader{min-height:unset!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar{position:fixed;background:var(--bg1,white)!important;transition:unset!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar.slide-down{animation:none!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry){color:var(--text1,#18191c)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .left-entry .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon{color:var(--text1,#18191c)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:var(--text2,#61666d)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__banner{min-height:unset!important;background:var(--bg1,white)!important;height:64px!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__banner>*{display:none!important}html[channel-hide-sticky-header] .bili-header .bili-header__bar{background:0 0;transition:none!important;position:absolute!important}html[channel-hide-sticky-header] .bili-header .bili-header__bar.slide-down{box-shadow:none!important;animation:none!important}html[channel-hide-sticky-header] .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry,.zhuzhan-icon),html[channel-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon,html[channel-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:#fff}html[channel-hide-subarea] #biliMainHeader{height:fit-content!important;min-height:fit-content!important;margin-bottom:20px!important}html[channel-hide-subarea] #biliMainHeader .bili-header .bili-header__channel,html[channel-hide-carousel] .banner-carousel,html[channel-hide-carousel] .channel-carousel{display:none!important}html[channel-hide-carousel] .channel-page .channel-page__body .head-cards .head-card{display:block!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic picture,html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic svg{display:none!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic:after{content:\"\";background-image:url(\"data:image/svg+xml,<svg width=\\\"22\\\" height=\\\"23\\\" viewBox=\\\"0 0 22 23\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" class=\\\"icon-bg--icon\\\" data-v-674f5b07=\\\"\\\"> <path d=\\\"M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path></svg>\");background-position:50%;background-repeat:no-repeat;background-size:contain;width:25px;height:25px}html[channel-layout=\"2\"] .channel-page .channel-page__body .head-cards,html[channel-layout=\"2\"] .channel-page .channel-page__body .feed-cards,html[channel-layout=\"2\"] .channel-page .channel-page__body .loading-cards{--row-gap:20px!important;--column-gap:20px!important;grid-template-columns:repeat(2,1fr)!important}html[channel-layout=\"2\"] .bili-video-card{--bili-video-card-title-padding-right:0!important}html[channel-layout=\"3\"] .channel-page .channel-page__body .head-cards,html[channel-layout=\"3\"] .channel-page .channel-page__body .feed-cards,html[channel-layout=\"3\"] .channel-page .channel-page__body .loading-cards{--row-gap:20px!important;--column-gap:20px!important;grid-template-columns:repeat(3,1fr)!important}html[channel-layout=\"3\"] .bili-video-card{--bili-video-card-title-padding-right:0!important}html[channel-layout=\"4\"] .channel-page .channel-page__body .head-cards,html[channel-layout=\"4\"] .channel-page .channel-page__body .feed-cards,html[channel-layout=\"4\"] .channel-page .channel-page__body .loading-cards{--row-gap:20px!important;--column-gap:20px!important;grid-template-columns:repeat(4,1fr)!important}html[channel-layout=\"4\"] .bili-video-card{--bili-video-card-title-padding-right:0!important}html[channel-layout=\"5\"] .channel-page .channel-page__body .head-cards,html[channel-layout=\"5\"] .channel-page .channel-page__body .feed-cards,html[channel-layout=\"5\"] .channel-page .channel-page__body .loading-cards{--row-gap:20px!important;--column-gap:20px!important;grid-template-columns:repeat(5,1fr)!important}html[channel-layout=\"5\"] .bili-video-card{--bili-video-card-title-padding-right:0!important}html[channel-layout=\"6\"] .channel-page .channel-page__body .head-cards,html[channel-layout=\"6\"] .channel-page .channel-page__body .feed-cards,html[channel-layout=\"6\"] .channel-page .channel-page__body .loading-cards{--row-gap:20px!important;--column-gap:20px!important;grid-template-columns:repeat(6,1fr)!important}html[channel-layout=\"6\"] .bili-video-card{--bili-video-card-title-padding-right:0!important}html[channel-layout-padding] .feedchannel .feedchannel-main{--layout-padding:var(--channel-layout-padding)!important}html[channel-layout-padding] .bili-header .bili-header__channel{padding:0 var(--channel-layout-padding)!important}html[channel-hide-danmaku-count] .bili-cover-card__stat:nth-child(2){display:none!important}html[channel-increase-rcmd-list-font-size] .bili-video-card{--bili-video-card-title-font-size:16px!important;--bili-video-card-subtitle-font-size:14px!important}html[channel-increase-rcmd-list-font-size] .bili-video-card.video-card .bili-cover-card{--bili-cover-card-stat-font-size:14px!important}");
	var index_scss_default$10 = _virtual_monkey_style_tools_default("html[video-page-hide-emoji-popover] bili-emoji-popover,html[video-page-hide-comment] #commentapp bili-comments,html[video-page-hide-comment] #comment-module,html[dynamic-page-hide-all-comment] .bili-comment-container,html[dynamic-page-hide-all-comment] .comment-wrap bili-comments{display:none!important}html[dynamic-page-hide-all-comment] .bili-opus-view{border-radius:6px!important}html[dynamic-page-hide-all-comment] .opus-detail{min-height:unset!important;margin-bottom:10px!important}html[dynamic-page-hide-all-comment] #app .content .dyn-tabs{display:none!important}html[dynamic-page-hide-all-comment] #app .content .card{padding-bottom:30px!important}");
	var index_scss_default$9 = _virtual_monkey_style_tools_default("html[border-radius-dynamic] #nav-searchform,html[border-radius-dynamic] .nav-search-content,html[border-radius-dynamic] .header-upload-entry,html[border-radius-dynamic] .v-popover-content,html[border-radius-dynamic] .van-popover,html[border-radius-dynamic] .v-popover-wrap,html[border-radius-dynamic] .v-popover,html[border-radius-dynamic] .topic-panel,html[border-radius-dynamic] .bili-header .header-upload-entry,html[border-radius-dynamic] .bili-dyn-up-list,html[border-radius-dynamic] .bili-dyn-publishing,html[border-radius-dynamic] .bili-dyn-publishing__action,html[border-radius-dynamic] .bili-dyn-sidebar *,html[border-radius-dynamic] .bili-dyn-up-list__window,html[border-radius-dynamic] .bili-dyn-live-users,html[border-radius-dynamic] .bili-dyn-topic-box,html[border-radius-dynamic] .bili-dyn-search-trendings,html[border-radius-dynamic] .bili-dyn-list-notification,html[border-radius-dynamic] .bili-dyn-item,html[border-radius-dynamic] .bili-dyn-banner,html[border-radius-dynamic] .bili-dyn-banner__img,html[border-radius-dynamic] .bili-dyn-my-info,html[border-radius-dynamic] .bili-dyn-card-video,html[border-radius-dynamic] .bili-dyn-list-tabs,html[border-radius-dynamic] .bili-album__preview__picture__gif,html[border-radius-dynamic] .bili-album__preview__picture__img{border-radius:3px!important}html[border-radius-dynamic] .bili-dyn-card-video__cover__mask,html[border-radius-dynamic] .bili-dyn-card-video__cover{border-radius:3px 0 0 3px!important}html[border-radius-dynamic] .bili-dyn-card-video__body{border-radius:0 3px 3px 0!important}html[border-radius-live] .live-player-ctnr.minimal,html[border-radius-live] .card-box .card-list .card-item,html[border-radius-live] .room-info-cntr,html[border-radius-live] #nav-searchform,html[border-radius-live] #player-ctnr,html[border-radius-live] .nav-search-content,html[border-radius-live] .header-upload-entry,html[border-radius-live] .v-popover-content,html[border-radius-live] .van-popover,html[border-radius-live] .v-popover-wrap,html[border-radius-live] .v-popover,html[border-radius-live] .aside-area,html[border-radius-live] .lower-row .right-ctnr *,html[border-radius-live] .panel-main-ctnr,html[border-radius-live] .startlive-btn,html[border-radius-live] .flip-view,html[border-radius-live] .content-wrapper,html[border-radius-live] .chat-input-ctnr,html[border-radius-live] .announcement-cntr,html[border-radius-live] .bl-button--primary{border-radius:3px!important}html[border-radius-live] #rank-list-vm,html[border-radius-live] .head-info-section{border-radius:3px 3px 0 0!important}html[border-radius-live] .gift-control-section{border-radius:0 0 3px 3px!important}html[border-radius-live] .follow-ctnr .right-part{border-radius:0 3px 3px 0!important}html[border-radius-live] .chat-control-panel{border-radius:0 0 3px 3px!important}html[border-radius-live] .follow-ctnr .left-part,html[border-radius-live] #rank-list-ctnr-box.bgStyle{border-radius:3px 0 0 3px!important}html[border-radius-search] #nav-searchform,html[border-radius-search] .nav-search-content,html[border-radius-search] .v-popover-content,html[border-radius-search] .van-popover,html[border-radius-search] .v-popover-wrap,html[border-radius-search] .v-popover,html[border-radius-search] .search-sticky-header *,html[border-radius-search] .vui_button,html[border-radius-search] .header-upload-entry,html[border-radius-search] .search-input-wrap *,html[border-radius-search] .search-input-container .search-input-wrap,html[border-radius-search] .bili-video-card__cover,html[border-radius-video] #nav-searchform,html[border-radius-video] .nav-search-content,html[border-radius-video] .v-popover-content,html[border-radius-video] .van-popover,html[border-radius-video] .v-popover,html[border-radius-video] .pic-box,html[border-radius-video] .action-list-container,html[border-radius-video] .actionlist-item-inner .main .cover,html[border-radius-video] .recommend-video-card .card-box .pic-box,html[border-radius-video] .recommend-video-card .card-box .pic-box .rcmd-cover .rcmd-cover-img .b-img__inner img,html[border-radius-video] .actionlist-item-inner .main .cover .cover-img .b-img__inner img,html[border-radius-video] .card-box .pic-box .pic,html[border-radius-video] .bui-collapse-header,html[border-radius-video] .base-video-sections-v1,html[border-radius-video] .bili-header .search-panel,html[border-radius-video] .bili-header .header-upload-entry,html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,html[border-radius-video] .video-tag-container .tag-panel .tag-link,html[border-radius-video] .video-tag-container .tag-panel .show-more-btn,html[border-radius-video] .vcd .cover img,html[border-radius-video] .vcd *,html[border-radius-video] .upinfo-btn-panel *,html[border-radius-video] .video-pod,html[border-radius-video] .fixed-sidenav-storage div,html[border-radius-video] .fixed-sidenav-storage a,html[border-radius-video] .reply-box-textarea,html[border-radius-video] .reply-box-send,html[border-radius-video] .reply-box-send:after{border-radius:3px!important}html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,html[border-radius-video] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap{border-radius:0 3px 3px 0!important}html[border-radius-video] .bpx-player-dm-btn-send .bui-button{border-radius:3px 0 0 3px!important}html[border-radius-bangumi] a[class^=mediainfo_mediaCover],html[border-radius-bangumi] a[class^=mediainfo_btnHome],html[border-radius-bangumi] [class^=follow_btnFollow],html[border-radius-bangumi] [class^=vipPaybar_textWrap__QARKv],html[border-radius-bangumi] [class^=eplist_ep_list_wrapper],html[border-radius-bangumi] [class^=RecommendItem_cover],html[border-radius-bangumi] [class^=imageListItem_wrap] [class^=imageListItem_coverWrap],html[border-radius-bangumi] [class^=navTools_navMenu]>*,html[border-radius-bangumi] [class^=navTools_item],html[border-radius-bangumi] #nav-searchform,html[border-radius-bangumi] .nav-search-content,html[border-radius-bangumi] .v-popover-content,html[border-radius-bangumi] .van-popover,html[border-radius-bangumi] .v-popover,html[border-radius-bangumi] .pic-box,html[border-radius-bangumi] .card-box .pic-box .pic,html[border-radius-bangumi] .bui-collapse-header,html[border-radius-bangumi] .base-video-sections-v1,html[border-radius-bangumi] .bili-header .search-panel,html[border-radius-bangumi] .bili-header .header-upload-entry,html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar,html[border-radius-bangumi] .video-tag-container .tag-panel .tag-link,html[border-radius-bangumi] .video-tag-container .tag-panel .show-more-btn,html[border-radius-bangumi] .vcd .cover img,html[border-radius-bangumi] .vcd *,html[border-radius-bangumi] .upinfo-btn-panel *,html[border-radius-bangumi] .fixed-sidenav-storage div,html[border-radius-bangumi] .reply-box-textarea,html[border-radius-bangumi] .reply-box-send,html[border-radius-bangumi] .reply-box-send:after{border-radius:3px!important}html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar .bpx-player-dm-btn-send,html[border-radius-bangumi] .bpx-player-container .bpx-player-sending-bar .bpx-player-video-inputbar-wrap{border-radius:0 3px 3px 0!important}html[border-radius-bangumi] .bpx-player-dm-btn-send .bui-button{border-radius:3px 0 0 3px!important}html[border-radius-homepage] #nav-searchform,html[border-radius-homepage] .nav-search-content,html[border-radius-homepage] .history-item,html[border-radius-homepage] .header-upload-entry,html[border-radius-homepage] .bili-header .search-panel,html[border-radius-homepage] .bili-header .header-upload-entry,html[border-radius-homepage] .bili-header__channel .channel-link,html[border-radius-homepage] .channel-entry-more__link,html[border-radius-homepage] .header-channel-fixed-right-item,html[border-radius-homepage] .recommended-swipe-body,html[border-radius-homepage] .bili-video-card .bili-video-card__cover,html[border-radius-homepage] .bili-video-card .bili-video-card__image,html[border-radius-homepage] .bili-video-card .bili-video-card__info--icon-text,html[border-radius-homepage] .bili-live-card,html[border-radius-homepage] .floor-card,html[border-radius-homepage] .floor-card .badge,html[border-radius-homepage] .single-card.floor-card .floor-card-inner,html[border-radius-homepage] .single-card.floor-card .cover-container,html[border-radius-homepage] .primary-btn,html[border-radius-homepage] .flexible-roll-btn,html[border-radius-homepage] .palette-button-wrap .flexible-roll-btn-inner,html[border-radius-homepage] .palette-button-wrap .storage-box,html[border-radius-homepage] .palette-button-wrap,html[border-radius-homepage] .v-popover-content{border-radius:3px!important}html[border-radius-homepage] .bili-video-card__stats{border-bottom-right-radius:3px!important;border-bottom-left-radius:3px!important}html[border-radius-homepage] .floor-card .layer{display:none!important}html[border-radius-homepage] .single-card.floor-card{border:none!important}html[border-radius-popular] #nav-searchform,html[border-radius-popular] .nav-search-content,html[border-radius-popular] .v-popover-content,html[border-radius-popular] .van-popover,html[border-radius-popular] .v-popover,html[border-radius-popular] .bili-header .search-panel,html[border-radius-popular] .bili-header .header-upload-entry,html[border-radius-popular] .upinfo-btn-panel *,html[border-radius-popular] .rank-list .rank-item>.content>.img,html[border-radius-popular] .card-list .video-card .video-card__content,html[border-radius-popular] .video-list .video-card .video-card__content,html[border-radius-popular] .fixed-sidenav-storage div,html[border-radius-popular] .fixed-sidenav-storage a,html[border-radius-space] #nav-searchform,html[border-radius-space] .home-aside-section>*,html[border-radius-space] .living-section__follow,html[border-radius-space] .side-nav__item,html[border-radius-space] .radio-filter__item,html[border-radius-space] .vui_button,html[border-radius-space] .space-follow-btn,html[border-radius-space] .message-btn,html[border-radius-space] .more-actions__trigger,html[border-radius-space] .bili-cover-card *,html[border-radius-space] .bili-video-card *,html[border-radius-channel] #nav-searchform,html[border-radius-channel] .nav-search-content,html[border-radius-channel] .message-entry-popover,html[border-radius-channel] .v-popover-content,html[border-radius-channel] .bili-header .bili-header__channel .channel-entry-more__link,html[border-radius-channel] .bili-header .bili-header__channel .channel-link,html[border-radius-channel] .banner-carousel,html[border-radius-channel] .float-button{border-radius:3px!important}html[border-radius-channel] .bili-cover-card__stats{border-bottom-right-radius:3px!important;border-bottom-left-radius:3px!important}html[border-radius-channel] .bili-cover-card{--bili-cover-card-border-radius:3px!important}html[border-radius-channel] .bili-video-card{--bili-video-card-border-radius:3px!important}html[border-radius-channel] .search-panel{border-radius:0 0 3px 3px!important}html[beauty-scrollbar] ::-webkit-scrollbar{background:0 0!important;width:8px!important;height:8px!important}html[beauty-scrollbar] ::-webkit-scrollbar:hover{background:#80808066!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb{z-index:2147483647;background-color:#0006!important;background-clip:content-box!important;border:1px solid #fff6!important;border-radius:8px!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb:hover{background-color:#000c!important}html[beauty-scrollbar] ::-webkit-scrollbar-thumb:active{background-color:#0009!important}@supports ((-moz-appearance:none)){html[beauty-scrollbar],html[beauty-scrollbar] *{scrollbar-width:thin}}html[hide-watchlater-button] .bili-watch-later,html[hide-watchlater-button] .bili-dyn-card-video__mark,html[hide-watchlater-button] .right-container .watch-later-video,html[hide-watchlater-button] .recommend-list-container .watch-later-video,html[hide-watchlater-button] .rank-container .rank-item .van-watchlater,html[hide-watchlater-button] .history-list .video-card .van-watchlater,html[hide-watchlater-button] .history-list .video-card .watch-later,html[hide-watchlater-button] .weekly-list .video-card .van-watchlater,html[hide-watchlater-button] .weekly-list .video-card .watch-later,html[hide-watchlater-button] .popular-list .video-card .van-watchlater,html[hide-watchlater-button] .popular-list .video-card .watch-later,html[hide-watchlater-button] .i-watchlater,html[hide-watchlater-button] .bili-card-watch-later,html[hide-footer] .footer.bili-footer,html[hide-footer] .international-footer,html[hide-footer] #biliMainFooter,html[hide-footer] .biliMainFooterWrapper,html[hide-footer] .link-footer-ctnr,html[hide-footer] .live-room-app .link-footer{display:none!important}html[common-unify-font-live] body,html[common-unify-font-live] .gift-item,html[common-unify-font-live] .feed-card,html[common-unify-font-live] .bb-comment,html[common-unify-font-live] .comment-bilibili-fold{font-weight:400;font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important}html[common-unify-font-dynamic] .reply-item .root-reply-container .content-warp .user-info .user-name{font-family:PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-size:14px!important;font-weight:500!important}html[common-unify-font-dynamic] body{font-weight:400;font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important}html[common-unify-font-popular] #internationalHeader,html[common-unify-font-popular] .international-header,html[common-unify-font-popular] .suggest-wrap,html[common-unify-font-popular] .van-popover{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:400!important}html[common-unify-font-popular] #app,html[common-unify-font-popular] .video-card .video-name{font-family:PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif!important;font-weight:500!important}html[common-unify-font-watchlater] body,html[common-unify-font-space] body,html[common-unify-font-space] .h .h-sign,html[common-unify-font-space] .reply-item .root-reply-container .content-warp .user-info .user-name,html[common-unify-font-space] .bili-comment.browser-pc *{font-weight:400;font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important}html[common-unify-font-space] body,html[common-unify-font-space] .n .n-text{font-size:14px}html[common-unify-font-space] #page-index .channel .channel-item .small-item,html[common-unify-font-space] #page-video .page-head__left .be-tab-item,html[common-unify-font-space] .n .n-data .n-data-k,html[common-unify-font-space] .n .n-data .n-data-v{font-size:13px}html[common-hide-nav-search-btn] #nav-searchform{padding:0 4px!important}html[common-hide-nav-search-btn] #nav-searchform .nav-search-btn{display:none!important}html[common-hide-nav-search-rcmd] #nav-searchform .nav-search-input::placeholder{color:#0000}html[common-hide-nav-search-rcmd] #nav-searchform .nav-search-input{-webkit-user-select:none;user-select:none}html[common-hide-nav-search-rcmd] #internationalHeader #nav_searchform input::placeholder{color:#0000}html[common-hide-nav-search-rcmd] #internationalHeader #nav_searchform input{-webkit-user-select:none;user-select:none}html[common-hide-nav-search-history] .search-panel .history{display:none}html[common-hide-nav-search-history] #internationalHeader .nav-search-box .history{display:none!important}html[common-hide-nav-search-trending] .search-panel{padding:13px 0 4px!important}html[common-hide-nav-search-trending] .search-panel .trending{display:none}html[common-hide-nav-search-trending] .search-panel .histories-wrap{max-height:unset!important}html[common-hide-nav-search-trending] .search-panel .history-fold-wrap,html[common-hide-nav-search-trending] #internationalHeader .nav-search-box .trending{display:none!important}html[common-nav-search-middle-justify] .center-search__bar{margin:0 auto!important}html[common-hide-nav-homepage-logo] .left-entry .left-entry__title>svg,html[common-hide-nav-homepage-logo] [class^=BiliHeaderV3_miniHeaderLogo],html[common-hide-nav-homepage-logo] .zhuzhan-icon{display:none!important}html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry{margin-right:30px!important}html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry .left-entry__title .mini-header__title>span{margin-right:0}html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry .left-entry__title .mini-header__title>svg{display:none!important}@media (width<=1366.9px){html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry .left-entry__title{margin-right:10px}html[common-hide-nav-homepage-logo][common-hide-nav-homepage] .bili-header__bar .left-entry>li:first-child{display:none}}@media (width>=1367px) and (width<=1700.9px){html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry .left-entry__title{margin-right:15px}html[common-hide-nav-homepage-logo][common-hide-nav-homepage] .bili-header__bar .left-entry>li:first-child{display:none}}@media (width>=1701px){html[common-hide-nav-homepage-logo] .bili-header__bar.slide-down .left-entry .left-entry__title{margin-right:20px}html[common-hide-nav-homepage-logo][common-hide-nav-homepage] .bili-header__bar .left-entry>li:first-child{display:none}}html[common-hide-nav-homepage] .left-entry .mini-header__title{display:none!important}html[common-hide-nav-homepage] .left-entry .left-entry__title{margin-right:0!important}html[common-hide-nav-homepage] .left-entry .zhuzhan-icon+span,html[common-hide-nav-homepage] [class^=BiliHeaderV3_leftEntryTitle]>div,html[common-hide-nav-anime] .left-entry li>a[href=\"//www.bilibili.com/anime/\"],html[common-hide-nav-anime] .left-entry li>a[href=\"https://www.bilibili.com/anime/\"],html[common-hide-nav-anime] [class^=BiliHeaderV3_leftEntry__] li>a[href=\"//www.bilibili.com/anime/\"],html[common-hide-nav-anime] [class^=BiliHeaderV3_leftEntry__] li>a[href=\"https://www.bilibili.com/anime/\"],html[common-hide-nav-live] .left-entry li>a[href^=\"//live.bilibili.com\"],html[common-hide-nav-live] .left-entry li>a[href=\"https://live.bilibili.com/\"],html[common-hide-nav-live] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"//live.bilibili.com\"],html[common-hide-nav-live] [class^=BiliHeaderV3_leftEntry__] li>a[href=\"https://live.bilibili.com/\"],html[common-hide-nav-game] .left-entry li>a[href^=\"//game.bilibili.com\"],html[common-hide-nav-game] .left-entry li>a[href^=\"https://game.bilibili.com\"],html[common-hide-nav-game] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"//game.bilibili.com\"],html[common-hide-nav-game] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"https://game.bilibili.com\"],html[common-hide-nav-vipshop] .left-entry li>a[href^=\"//show.bilibili.com\"],html[common-hide-nav-vipshop] .left-entry li>a[href^=\"https://show.bilibili.com\"],html[common-hide-nav-vipshop] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"//show.bilibili.com\"],html[common-hide-nav-vipshop] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"https://show.bilibili.com\"],html[common-hide-nav-manga] .left-entry li>a[href^=\"//manga.bilibili.com\"],html[common-hide-nav-manga] .left-entry li>a[href^=\"https://manga.bilibili.com\"],html[common-hide-nav-manga] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"//manga.bilibili.com\"],html[common-hide-nav-manga] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"https://manga.bilibili.com\"],html[common-hide-nav-match] .left-entry li>a[href=\"//www.bilibili.com/v/game/match/\"],html[common-hide-nav-match] .left-entry li>a[href^=\"//www.bilibili.com/match/home/\"],html[common-hide-nav-match] .left-entry li>a[href^=\"https://www.bilibili.com/match/home/\"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href=\"//www.bilibili.com/v/game/match/\"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"//www.bilibili.com/match/home/\"],html[common-hide-nav-match] [class^=BiliHeaderV3_leftEntry__] li>a[href^=\"https://www.bilibili.com/match/home/\"],html[common-hide-nav-download-app] #i_cecream .left-entry .download-entry,html[common-hide-nav-download-app] #i_cecream .left-entry .download-client-trigger,html[common-hide-nav-download-app] #app .left-entry .download-entry,html[common-hide-nav-download-app] #app .left-entry .download-client-trigger,html[common-hide-nav-download-app] .left-entry .download-entry,html[common-hide-nav-download-app] .left-entry .download-client-trigger,html[common-hide-nav-blackboard] .left-entry .v-popover-wrap.left-loc-entry,html[common-hide-nav-blackboard] .left-entry .loc-entry,html[common-hide-nav-blackboard] .left-entry .v-popover-wrap a[href^=\"https://www.bilibili.com/video/\"],html[common-hide-nav-blackboard] .left-entry .v-popover-wrap a[href^=\"https://www.bilibili.com/blackboard/\"],html[common-hide-nav-channel-panel-popover] .left-entry .bili-header-channel-panel,html[common-hide-nav-channel-panel-popover] .left-entry .mini-header__arrow,html[common-hide-nav-anime-popover] .left-entry li>a[href=\"//www.bilibili.com/anime/\"]+div,html[common-hide-nav-anime-popover] .left-entry li>a[href=\"https://www.bilibili.com/anime/\"]+div,html[common-hide-nav-live-popover] .left-entry li>a[href^=\"//live.bilibili.com\"]+div,html[common-hide-nav-live-popover] .left-entry li>a[href=\"https://live.bilibili.com\"]+div,html[common-hide-nav-game-popover] .left-entry li>a[href^=\"//game.bilibili.com\"]+div,html[common-hide-nav-game-popover] .left-entry li>a[href^=\"https://game.bilibili.com\"]+div,html[common-hide-nav-manga-popover] .left-entry li>a[href^=\"//manga.bilibili.com\"]+div,html[common-hide-nav-manga-popover] .left-entry li>a[href^=\"https://manga.bilibili.com\"]+div,html[common-hide-nav-avatar] .right-entry li.header-avatar-wrap,html[common-hide-nav-vip] .right-entry .vip-wrap,html[common-hide-nav-message] .right-entry>:nth-child(3),html[common-hide-nav-message] .right-entry li.right-entry--message,html[common-hide-nav-message-red-num] .right-entry>:nth-child(3) .red-num--message,html[common-hide-nav-message-red-num] .right-entry>:nth-child(3) .red-point--message,html[common-hide-nav-message-red-num] .right-entry li.right-entry--message .red-num--message,html[common-hide-nav-message-red-num] .right-entry li.right-entry--message .red-point--message,html[common-hide-nav-dynamic] .right-entry>:nth-child(4),html[common-hide-nav-dynamic-red-num] .right-entry>:nth-child(4) .red-num--dynamic,html[common-hide-nav-dynamic-red-num] .right-entry>:nth-child(4) .red-point--dynamic,html[common-hide-nav-favorite] .right-entry>:nth-child(5),html[common-hide-nav-history] .right-entry>:nth-child(6),html[common-hide-nav-member] .right-entry>:nth-child(7){display:none!important}html[common-hide-nav-upload] .right-entry li.right-entry-item--upload,html[common-hide-nav-upload] [class^=BiliHeaderV3_headerUploadEntry]{visibility:hidden!important}html[common-header-bar-padding-left] .bili-header .bili-header__bar,html[common-header-bar-padding-left] .mini-header__content,html[common-header-bar-padding-left] [class^=BiliHeaderV3_biliHeaderBar]{padding-left:var(--common-header-bar-padding-left)!important}html[common-header-bar-search-width] .bili-header .center-search-container .center-search__bar,html[common-header-bar-search-width] .bili-header-m .nav-search-box,html[common-header-bar-search-width] .international-header .nav-search-box{width:var(--common-header-bar-search-width)!important;max-width:var(--common-header-bar-search-width)!important;min-width:0!important}html[common-header-bar-search-width] .center-search__bar{margin:0 auto}html[common-header-bar-search-margin-left] .center-search__bar{margin-left:var(--common-header-bar-search-margin-left)!important}html[common-header-bar-padding-right] .bili-header .bili-header__bar,html[common-header-bar-padding-right] .mini-header__content,html[common-header-bar-padding-right] [class^=BiliHeaderV3_biliHeaderBar]{padding-right:var(--common-header-bar-padding-right)!important}:root[common-theme-dark-page=common],:root[common-theme-dark-page=live]{--Ga0:#101011;--Ga0_s:#1e2022;--Ga0_t:#1e2022;--Ga1:#0a0b0c;--Ga1_s:#232527;--Ga1_t:#232527;--Ga1_e:#232527;--Ga2:#2f3134;--Ga2_t:#2f3134;--Ga3:#46494d;--Ga3_t:#46494d;--Ga4:#5e6267;--Ga4_t:#5e6267;--Ga5:#757a81;--Ga5_t:#757a81;--Ga6:#8b9097;--Ga6_t:#8b9097;--Ga7:#a2a7ae;--Ga7_t:#a2a7ae;--Ga8:#b9bdc2;--Ga8_t:#b9bdc2;--Ga9:#d0d3d7;--Ga9_t:#d0d3d7;--Ga10:#e7e9eb;--Ga10_t:#e7e9eb;--Ga11:#242628;--Ga12:#1f2022;--Ga12_s:#2b2c2f;--Ga13:#1a1b1d;--Ga13_s:#2f3134;--Wh0:#17181a;--Wh0_s:#2f3134;--Wh0_t:#17181a;--Ba0:#000;--Ba0_s:#fff;--Ba0_t:#000;--Pi0:#26161c;--Pi1:#2f1a22;--Pi2:#472030;--Pi3:#76304b;--Pi4:#a73e65;--Pi5:#d44e7d;--Pi5_t:#d44e7d;--Pi6:#dc6d94;--Pi7:#e38caa;--Pi8:#ebabc1;--Pi9:#f2cad8;--Pi10:#fae9ef;--Ma0:#261525;--Ma1:#2e182d;--Ma2:#461c43;--Ma3:#72296c;--Ma4:#a13396;--Ma5:#cb41bb;--Ma6:#d462c7;--Ma7:#dd83d3;--Ma8:#e6a4de;--Ma9:#efc5ea;--Ma10:#f8e6f6;--Re0:#261314;--Re1:#2e1617;--Re2:#471a1c;--Re3:#742728;--Re4:#a63131;--Re5:#d1403e;--Re6:#d9615f;--Re7:#e18281;--Re8:#e9a3a2;--Re9:#f1c5c4;--Re10:#f9e5e5;--Or0:#28180f;--Or1:#301b10;--Or2:#4a230e;--Or3:#783610;--Or4:#a9490d;--Or5:#d66011;--Or6:#dd7c3a;--Or7:#e49764;--Or8:#ebb38d;--Or9:#f2ceb6;--Or10:#faeadf;--Ye0:#2a1e0f;--Ye1:#342410;--Ye2:#4d300b;--Ye3:#7c4c08;--Ye4:#ad6800;--Ye5:#db8700;--Ye6:#e19c2c;--Ye7:#e7b158;--Ye8:#eec584;--Ye9:#f4dab1;--Ye10:#faefdd;--Ly0:#2a2310;--Ly1:#332a11;--Ly2:#49390c;--Ly3:#745909;--Ly4:#a27c00;--Ly5:#cca000;--Ly6:#d5b02c;--Ly7:#dec158;--Ly8:#e7d184;--Ly9:#efe2b1;--Ly10:#f8f2dd;--Lg0:#19220f;--Lg1:#1e2911;--Lg2:#273c0e;--Lg3:#3c600f;--Lg4:#50840b;--Lg5:#67a70e;--Lg6:#81b638;--Lg7:#9cc562;--Lg8:#b6d58b;--Lg9:#d0e4b5;--Lg10:#ebf3df;--Gr0:#102017;--Gr1:#11271b;--Gr2:#123923;--Gr3:#175c34;--Gr4:#198042;--Gr5:#1fa251;--Gr6:#46b26f;--Gr7:#6dc28d;--Gr8:#93d2ab;--Gr9:#bae2c9;--Gr10:#e1f3e8;--Cy0:#0c1f20;--Cy1:#0d2627;--Cy2:#093739;--Cy3:#085b5c;--Cy4:#028080;--Cy5:#03a29f;--Cy6:#2fb2b0;--Cy7:#5ac2c0;--Cy8:#86d2d1;--Cy9:#b2e2e1;--Cy10:#ddf3f3;--Lb0:#0a1b23;--Lb1:#0b202a;--Lb2:#082d40;--Lb3:#064a69;--Lb4:#006996;--Lb5:#0087bd;--Lb6:#2c9cc8;--Lb7:#58b1d4;--Lb8:#84c5df;--Lb9:#b1dbeb;--Lb10:#ddeff6;--Bl0:#151826;--Bl1:#181c2f;--Bl2:#1f2748;--Bl3:#2e3c76;--Bl4:#3b53a8;--Bl5:#4b6bd4;--Bl6:#6a85db;--Bl7:#899ee3;--Bl8:#a9b8ea;--Bl9:#c8d2f2;--Bl10:#e7ebf9;--Pu0:#1d1628;--Pu1:#221a31;--Pu2:#31214c;--Pu3:#4e317d;--Pu4:#6d3fb1;--Pu5:#8c50e0;--Pu6:#a06ee5;--Pu7:#b48deb;--Pu8:#c8abf0;--Pu9:#dbc9f5;--Pu10:#f0e8fb;--Br0:#211d1b;--Br1:#282320;--Br2:#382f2a;--Br3:#59483f;--Br4:#7a6154;--Br5:#9a7c6a;--Br6:#ac9384;--Br7:#bda99e;--Br8:#cebfb7;--Br9:#e0d7d1;--Br10:#f2eeeb;--Si0:#212325;--Si1:#27292c;--Si2:#36393f;--Si3:#535962;--Si4:#6f7987;--Si5:#8c99aa;--Si6:#a0abb9;--Si7:#b4bcc7;--Si8:#c8ced6;--Si9:#dce0e5;--Si10:#f0f2f4;--Ga0_rgb:16, 16, 17;--Ga0_s_rgb:30, 32, 34;--Ga1_rgb:10, 11, 12;--Ga1_s_rgb:35, 37, 39;--Ga2_rgb:47, 49, 52;--Ga3_rgb:70, 73, 77;--Ga5_rgb:117, 122, 129;--Ga7_rgb:162, 167, 174;--Ga10_rgb:231, 233, 235;--Ga11_rgb:36, 38, 40;--Ga12_rgb:31, 32, 34;--Ga12_s_rgb:43, 44, 47;--Ga13_rgb:26, 27, 29;--Ga13_s_rgb:47, 49, 52;--Wh0_rgb:23, 24, 26;--Wh0_s_rgb:47, 49, 52;--Ba0_rgb:0, 0, 0;--Pi1_rgb:47, 26, 34;--Pi5_rgb:212, 78, 125;--Re1_rgb:46, 22, 23;--Re5_rgb:209, 64, 62;--Or1_rgb:48, 27, 16;--Or5_rgb:214, 96, 17;--Ye1_rgb:52, 36, 16;--Ye5_rgb:219, 135, 0;--Ye6_rgb:225, 156, 44;--Gr1_rgb:17, 39, 27;--Gr5_rgb:31, 162, 81;--Lb1_rgb:11, 32, 42;--Lb5_rgb:0, 135, 189;--Lb7_rgb:88, 177, 212}:root[common-theme-dark-page=dynamic],:root[common-theme-dark-page=message]{--Ga0:#0d0d0e;--Ga0_s:#1e2022;--Ga0_t:#1e2022;--Ga1:#000;--Ga1_s:#232527;--Ga1_t:#232527;--Ga1_e:#232527;--Ga2:#2f3134;--Ga2_t:#2f3134;--Ga3:#46494d;--Ga3_t:#46494d;--Ga4:#5e6267;--Ga4_t:#5e6267;--Ga5:#757a81;--Ga5_t:#757a81;--Ga6:#8b9097;--Ga6_t:#8b9097;--Ga7:#a2a7ae;--Ga7_t:#a2a7ae;--Ga8:#b9bdc2;--Ga8_t:#b9bdc2;--Ga9:#d0d3d7;--Ga9_t:#d0d3d7;--Ga10:#e7e9eb;--Ga10_t:#e7e9eb;--Ga11:#242628;--Ga12:#1f2022;--Wh0:#17181a;--Wh0_t:#17181a;--Ba0:#000;--Ba0_s:#fff;--Ba0_t:#000;--Pi0:#26161c;--Pi1:#2f1a22;--Pi2:#472030;--Pi3:#76304b;--Pi4:#a73e65;--Pi5:#d44e7d;--Pi5_t:#d44e7d;--Pi6:#dc6d94;--Pi7:#e38caa;--Pi8:#ebabc1;--Pi9:#f2cad8;--Pi10:#fae9ef;--Ma0:#261525;--Ma1:#2e182d;--Ma2:#461c43;--Ma3:#72296c;--Ma4:#a13396;--Ma5:#cb41bb;--Ma6:#d462c7;--Ma7:#dd83d3;--Ma8:#e6a4de;--Ma9:#efc5ea;--Ma10:#f8e6f6;--Re0:#261314;--Re1:#2e1617;--Re2:#471a1c;--Re3:#742728;--Re4:#a63131;--Re5:#d1403e;--Re6:#d9615f;--Re7:#e18281;--Re8:#e9a3a2;--Re9:#f1c5c4;--Re10:#f9e5e5;--Or0:#28180f;--Or1:#301b10;--Or2:#4a230e;--Or3:#783610;--Or4:#a9490d;--Or5:#d66011;--Or6:#dd7c3a;--Or7:#e49764;--Or8:#ebb38d;--Or9:#f2ceb6;--Or10:#faeadf;--Ye0:#2a1e0f;--Ye1:#342410;--Ye2:#4d300b;--Ye3:#7c4c08;--Ye4:#ad6800;--Ye5:#db8700;--Ye6:#e19c2c;--Ye7:#e7b158;--Ye8:#eec584;--Ye9:#f4dab1;--Ye10:#faefdd;--Ly0:#2a2310;--Ly1:#332a11;--Ly2:#49390c;--Ly3:#745909;--Ly4:#a27c00;--Ly5:#cca000;--Ly6:#d5b02c;--Ly7:#dec158;--Ly8:#e7d184;--Ly9:#efe2b1;--Ly10:#f8f2dd;--Lg0:#19220f;--Lg1:#1e2911;--Lg2:#273c0e;--Lg3:#3c600f;--Lg4:#50840b;--Lg5:#67a70e;--Lg6:#81b638;--Lg7:#9cc562;--Lg8:#b6d58b;--Lg9:#d0e4b5;--Lg10:#ebf3df;--Gr0:#102017;--Gr1:#11271b;--Gr2:#123923;--Gr3:#175c34;--Gr4:#198042;--Gr5:#1fa251;--Gr6:#46b26f;--Gr7:#6dc28d;--Gr8:#93d2ab;--Gr9:#bae2c9;--Gr10:#e1f3e8;--Cy0:#0c1f20;--Cy1:#0d2627;--Cy2:#093739;--Cy3:#085b5c;--Cy4:#028080;--Cy5:#03a29f;--Cy6:#2fb2b0;--Cy7:#5ac2c0;--Cy8:#86d2d1;--Cy9:#b2e2e1;--Cy10:#ddf3f3;--Lb0:#0a1b23;--Lb1:#0b202a;--Lb2:#082d40;--Lb3:#064a69;--Lb4:#006996;--Lb5:#0087bd;--Lb6:#2c9cc8;--Lb7:#58b1d4;--Lb8:#84c5df;--Lb9:#b1dbeb;--Lb10:#ddeff6;--Bl0:#151826;--Bl1:#181c2f;--Bl2:#1f2748;--Bl3:#2e3c76;--Bl4:#3b53a8;--Bl5:#4b6bd4;--Bl6:#6a85db;--Bl7:#899ee3;--Bl8:#a9b8ea;--Bl9:#c8d2f2;--Bl10:#e7ebf9;--Pu0:#1d1628;--Pu1:#221a31;--Pu2:#31214c;--Pu3:#4e317d;--Pu4:#6d3fb1;--Pu5:#8c50e0;--Pu6:#a06ee5;--Pu7:#b48deb;--Pu8:#c8abf0;--Pu9:#dbc9f5;--Pu10:#f0e8fb;--Br0:#211d1b;--Br1:#282320;--Br2:#382f2a;--Br3:#59483f;--Br4:#7a6154;--Br5:#9a7c6a;--Br6:#ac9384;--Br7:#bda99e;--Br8:#cebfb7;--Br9:#e0d7d1;--Br10:#f2eeeb;--Si0:#212325;--Si1:#27292c;--Si2:#36393f;--Si3:#535962;--Si4:#6f7987;--Si5:#8c99aa;--Si6:#a0abb9;--Si7:#b4bcc7;--Si8:#c8ced6;--Si9:#dce0e5;--Si10:#f0f2f4;--Pi5_rgb:212, 78, 125;--Pi1_rgb:47, 26, 34;--Lb5_rgb:0, 135, 189;--Lb1_rgb:11, 32, 42;--Re5_rgb:209, 64, 62;--Re1_rgb:46, 22, 23;--Gr5_rgb:31, 162, 81;--Gr1_rgb:17, 39, 27;--Or5_rgb:214, 96, 17;--Or1_rgb:48, 27, 16;--Ye5_rgb:219, 135, 0;--Ye1_rgb:52, 36, 16;--Wh0_rgb:23, 24, 26;--Ga0_rgb:13, 13, 14;--Ga1_rgb:0, 0, 0;--Ga11_rgb:36, 38, 40;--Ga12_rgb:31, 32, 34;--Wh0_u_rgb:255, 255, 255;--Ga10_rgb:231, 233, 235;--Ga7_rgb:162, 167, 174;--Ga5_rgb:117, 122, 129;--Ga3_rgb:70, 73, 77;--Lb6_rgb:44, 156, 200;--Ye6_rgb:225, 156, 44;--Ga1_s_rgb:35, 37, 39;--Ga2_rgb:47, 49, 52;--Ga0_s_rgb:30, 32, 34;--Ba0_rgb:0, 0, 0}html[common-theme-dark-page=common]{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}html[common-theme-dark-page=common] ::selection{color:#fff;background-color:#51b1ff80}html[common-theme-dark-page=common],html[common-theme-dark-page=common] body{background-color:#17181a}html[common-theme-dark-page=common] .bili-header__banner{filter:brightness(90%)}html[common-theme-dark-page=common] #bilibili-player .bpx-player-sending-area:before{background-color:#17181a!important}html[common-theme-dark-page=dynamic]{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark;--bg1:var(--Ga12)!important;--bg2:var(--Ga12)!important}html[common-theme-dark-page=dynamic] ::selection{color:#fff;background-color:#51b1ff80}html[common-theme-dark-page=dynamic],html[common-theme-dark-page=dynamic] body{background-color:#17181a}html[common-theme-dark-page=dynamic] #app>.bg,html[common-theme-dark-page=dynamic] #app>.bgc{background-color:var(--Wh0)!important;background-image:url(https://i2.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg_dark.png@1c.webp)!important}html[common-theme-dark-page=dynamic] .bili-dyn-up-list__item .bili-dyn-up-list__item__name{color:var(--text1,var(--Ga10))!important}html[common-theme-dark-page=dynamic] .bili-dyn-up-list__item.active .bili-dyn-up-list__item__name{color:var(--brand_blue,var(--Lb5))!important}html[common-theme-dark-page=live]{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}html[common-theme-dark-page=live] ::selection{color:#fff;background-color:#51b1ff80}html[common-theme-dark-page=live],html[common-theme-dark-page=live] body{background-color:#17181a}html[common-theme-dark-page=live] .link-navbar-ctnr,html[common-theme-dark-page=live] .link-navbar-wrap,html[common-theme-dark-page=live] .prehold-nav{background-color:var(--Ga0,#101011)!important;box-shadow:unset!important}html[common-theme-dark-page=live] .prehold-nav .nav-item .jump-link{color:#fff!important}html[common-theme-dark-page=live] #observerTarget .switch-btn img{filter:invert()}html[common-theme-dark-page=message]{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}html[common-theme-dark-page=message] ::selection{color:#fff;background-color:#51b1ff80}html[common-theme-dark-page=message] .message-bg{background-image:url(https://s1.hdslb.com/bfs/seed/jinkela/short/message/img/dark_bg.png@1c.webp)!important}html[common-theme-dark-page=message] .message-box-shadow,html[common-theme-dark-page=message] .im-box-shadow{box-shadow:unset!important}html[common-theme-dark-page=space]{--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}html[common-theme-dark-page=space] ::selection{color:#fff;background-color:#51b1ff80}html[common-theme-dark-page=space],html[common-theme-dark-page=space] body{background-color:#17181a}html[common-theme-dark-page=space] .header .toutu{z-index:1;filter:brightness(80%)}html[common-theme-dark-page=space] .header .header-upinfo-bg-shadow{z-index:2}html[common-theme-dark-page=space] .header .upinfo{z-index:3}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a.woff2)format(\"woff2\");unicode-range:U+9AA2-FFE5}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.b.woff2)format(\"woff2\");unicode-range:U+8983-9AA0}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.c.woff2)format(\"woff2\");unicode-range:U+78F2-897B}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.d.woff2)format(\"woff2\");unicode-range:U+646D-78D9}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.e.woff2)format(\"woff2\");unicode-range:U+30E0-6445}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.f.woff2)format(\"woff2\");unicode-range:U+101-30DF}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.g.woff2)format(\"woff2\");unicode-range:U+9AA8,U+9AB8,U+9AD3,U+9AD8,U+9B03,U+9B3C,U+9B41-9B42,U+9B44,U+9B4F,U+9B54,U+9C7C,U+9C81,U+9C8D,U+9C9C,U+9CA4,U+9CB8,U+9CC3,U+9CD6,U+9CDE,U+9E1F,U+9E21,U+9E23,U+9E25-9E26,U+9E2D,U+9E2F,U+9E33,U+9E35,U+9E3D,U+9E3F,U+9E43,U+9E45,U+9E4A,U+9E4F,U+9E64,U+9E70,U+9E7F,U+9E93,U+9EA6,U+9EBB,U+9EC4,U+9ECD-9ECE,U+9ED1,U+9ED4,U+9ED8,U+9F0E,U+9F13,U+9F20,U+9F3B,U+9F50,U+9F7F,U+9F84,U+9F8B,U+9F99-9F9A,U+9F9F,U+FF01,U+FF08-FF09,U+FF0C,U+FF1A-FF1B,U+FF1F}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.h.woff2)format(\"woff2\");unicode-range:U+975B,U+975E,U+9760-9762,U+9769,U+9773-9774,U+9776,U+978B,U+978D,U+9798,U+97A0,U+97AD,U+97E6-97E7,U+97E9,U+97ED,U+97F3,U+97F5-97F6,U+9875-9877,U+9879-987B,U+987D-987F,U+9881-9882,U+9884-9888,U+988A,U+9890-9891,U+9893,U+9896-9898,U+989C-989D,U+98A0,U+98A4,U+98A7,U+98CE,U+98D8,U+98DE-98DF,U+9910,U+9965,U+996D-9972,U+9975-9976,U+997A,U+997C,U+997F,U+9981,U+9985-9986,U+9988,U+998B,U+998F,U+9992,U+9996,U+9999,U+9A6C-9A71,U+9A73-9A74,U+9A76,U+9A79,U+9A7B-9A7C,U+9A7E,U+9A82,U+9A84,U+9A86-9A87,U+9A8B-9A8C,U+9A8F,U+9A91,U+9A97,U+9A9A,U+9AA1,U+9AA4}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.i.woff2)format(\"woff2\");unicode-range:U+9570,U+9576,U+957F,U+95E8,U+95EA,U+95ED-95F0,U+95F2,U+95F4,U+95F7-95FB,U+95FD,U+9600-9602,U+9605,U+9609,U+960E,U+9610-9611,U+9614,U+961C,U+961F,U+962E,U+9632-9636,U+963B,U+963F-9640,U+9644-9648,U+964B-964D,U+9650,U+9655,U+965B,U+9661-9662,U+9664,U+9668-966A,U+9675-9677,U+9685-9686,U+968B,U+968F-9690,U+9694,U+9698-9699,U+969C,U+96A7,U+96B6,U+96BE,U+96C0-96C1,U+96C4-96C7,U+96CC-96CD,U+96CF,U+96D5,U+96E8,U+96EA,U+96F6-96F7,U+96F9,U+96FE,U+9700,U+9704,U+9707,U+9709,U+970D,U+9713,U+9716,U+971C,U+971E,U+9732,U+9738-9739,U+9752,U+9756,U+9759}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.j.woff2)format(\"woff2\");unicode-range:U+9179,U+917F,U+9187,U+9189,U+918B,U+918D,U+9190,U+9192,U+919A-919B,U+91BA,U+91C7,U+91C9-91CA,U+91CC-91CF,U+91D1,U+91DC,U+9274,U+93D6,U+9488-9489,U+948E,U+9492-9493,U+9497,U+9499,U+949D-94A3,U+94A5-94A9,U+94AE,U+94B1,U+94B3,U+94B5,U+94BB,U+94BE,U+94C0-94C3,U+94C5-94C6,U+94DC-94DD,U+94E1,U+94E3,U+94EC-94ED,U+94F0-94F2,U+94F6,U+94F8,U+94FA,U+94FE,U+9500-9501,U+9504-9505,U+9508,U+950B-950C,U+9510-9511,U+9517,U+9519-951A,U+9521,U+9523-9526,U+9528,U+952D-9530,U+9539,U+953B,U+9540-9541,U+9547,U+954A,U+954D,U+9550-9551,U+955C,U+9563,U+956D}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.k.woff2)format(\"woff2\");unicode-range:U+9001-9003,U+9005-9006,U+9009-900A,U+900D,U+900F-9012,U+9014,U+9017,U+901A-901B,U+901D-9022,U+902E,U+9038,U+903B-903C,U+903E,U+9041-9042,U+9044,U+9047,U+904D,U+904F-9053,U+9057,U+905B,U+9062-9063,U+9065,U+9068,U+906D-906E,U+9075,U+907D,U+907F-9080,U+9082-9083,U+908B,U+9091,U+9093,U+9099,U+90A2-90A3,U+90A6,U+90AA,U+90AE-90AF,U+90B1,U+90B5,U+90B8-90B9,U+90BB,U+90C1,U+90CA,U+90CE,U+90D1,U+90DD,U+90E1,U+90E7-90E8,U+90ED,U+90F4,U+90F8,U+90FD,U+9102,U+9119,U+9149,U+914B-914D,U+9152,U+9157,U+915A,U+915D-915E,U+9161,U+9163,U+9165,U+916A,U+916C,U+916E,U+9171,U+9175-9178}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.l.woff2)format(\"woff2\");unicode-range:U+8E44,U+8E47-8E48,U+8E4A-8E4B,U+8E51,U+8E59,U+8E66,U+8E6C-8E6D,U+8E6F,U+8E72,U+8E74,U+8E76,U+8E7F,U+8E81,U+8E87,U+8E8F,U+8EAB-8EAC,U+8EAF,U+8EB2,U+8EBA,U+8F66-8F69,U+8F6C,U+8F6E-8F72,U+8F74,U+8F7B,U+8F7D,U+8F7F,U+8F83-8F8A,U+8F8D-8F8E,U+8F90-8F91,U+8F93,U+8F95-8F99,U+8F9B-8F9C,U+8F9E-8F9F,U+8FA3,U+8FA8-8FA9,U+8FAB,U+8FB0-8FB1,U+8FB9,U+8FBD-8FBE,U+8FC1-8FC2,U+8FC4-8FC5,U+8FC7-8FC8,U+8FCE,U+8FD0-8FD1,U+8FD3-8FD5,U+8FD8-8FD9,U+8FDB-8FDF,U+8FE2,U+8FE6,U+8FE8,U+8FEA-8FEB,U+8FED,U+8FF0,U+8FF3,U+8FF7-8FF9,U+8FFD,U+9000}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.m.woff2)format(\"woff2\");unicode-range:U+8D24-8D31,U+8D34-8D35,U+8D37-8D3F,U+8D41-8D45,U+8D48,U+8D4A-8D4C,U+8D4E-8D50,U+8D54,U+8D56,U+8D58,U+8D5A-8D5B,U+8D5D-8D5E,U+8D60-8D64,U+8D66-8D67,U+8D6B,U+8D70,U+8D74-8D77,U+8D81,U+8D85,U+8D8A-8D8B,U+8D9F,U+8DA3,U+8DB3-8DB4,U+8DB8,U+8DBE-8DBF,U+8DC3-8DC4,U+8DCB-8DCC,U+8DD1,U+8DD7,U+8DDB,U+8DDD,U+8DDF,U+8DE4,U+8DE8,U+8DEA,U+8DEF,U+8DF3,U+8DF5,U+8DF7,U+8DFA-8DFB,U+8E09-8E0A,U+8E0C,U+8E0F,U+8E1D-8E1E,U+8E22,U+8E29-8E2A,U+8E2E,U+8E31,U+8E35,U+8E39,U+8E42}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.n.woff2)format(\"woff2\");unicode-range:U+8BC9-8BCD,U+8BCF,U+8BD1,U+8BD3,U+8BD5,U+8BD7-8BD8,U+8BDA-8BDB,U+8BDD-8BDE,U+8BE0-8BE9,U+8BEB-8BF5,U+8BF7-8BF8,U+8BFA-8BFB,U+8BFD-8C01,U+8C03-8C06,U+8C08,U+8C0A-8C0B,U+8C0D-8C13,U+8C15,U+8C17,U+8C19-8C1C,U+8C22-8C24,U+8C26-8C2A,U+8C2C-8C2D,U+8C30-8C35,U+8C37,U+8C41,U+8C46,U+8C4C,U+8C61-8C62,U+8C6A-8C6B,U+8C79-8C7A,U+8C82,U+8C89,U+8C8C,U+8D1D-8D1F,U+8D21-8D23}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.o.woff2)format(\"woff2\");unicode-range:U+889C,U+88A4,U+88AB,U+88AD,U+88B1,U+88C1-88C2,U+88C5-88C6,U+88C9,U+88D4-88D5,U+88D8-88D9,U+88DF,U+88E3-88E4,U+88E8,U+88F1,U+88F3-88F4,U+88F8-88F9,U+88FE,U+8902,U+8910,U+8912-8913,U+891A-891B,U+8921,U+8925,U+892A-892B,U+8934,U+8936,U+8941,U+8944,U+895E-895F,U+8966,U+897F,U+8981,U+8986,U+89C1-89C2,U+89C4-89C6,U+89C8-89CB,U+89CE,U+89D0-89D2,U+89E3,U+89E5-89E6,U+8A00,U+8A07,U+8A79,U+8A89-8A8A,U+8A93,U+8B66,U+8B6C,U+8BA1-8BAB,U+8BAD-8BB0,U+8BB2-8BB3,U+8BB6-8BBA,U+8BBC-8BC1,U+8BC4-8BC6,U+8BC8}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.p.woff2)format(\"woff2\");unicode-range:U+8695,U+869C,U+86A3-86A4,U+86A7,U+86AA,U+86AF,U+86B1,U+86C0,U+86C6-86C7,U+86CA-86CB,U+86D0,U+86D4,U+86D9,U+86DB,U+86DF,U+86E4,U+86EE,U+86F0,U+86F9,U+86FE,U+8700,U+8702-8703,U+8708-8709,U+870D,U+8712-8713,U+8715,U+8717-8718,U+871A,U+871C,U+8721,U+8725,U+8734,U+8737,U+873B,U+873F,U+8747,U+8749,U+874C,U+874E,U+8757,U+8759,U+8760,U+8763,U+8774,U+8776,U+877C,U+8782-8783,U+8785,U+878D,U+8793,U+879F,U+87AF,U+87B3,U+87BA,U+87C6,U+87CA,U+87D1-87D2,U+87E0,U+87E5,U+87F9,U+87FE,U+8815,U+8822,U+8839,U+8840,U+8845,U+884C-884D,U+8854,U+8857,U+8859,U+8861,U+8863,U+8865,U+8868,U+886B-886C,U+8870,U+8877,U+887D-887F,U+8881-8882,U+8884-8885,U+8888,U+888B,U+888D,U+8892,U+8896}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.q.woff2)format(\"woff2\");unicode-range:U+83DC-83DD,U+83E0,U+83E9,U+83F1-83F2,U+8403-8404,U+840B-840E,U+841D,U+8424-8428,U+843D,U+8451,U+8457,U+8459,U+845B,U+8461,U+8463,U+8469,U+846B-846C,U+8471,U+8475,U+847A,U+8482,U+848B,U+8499,U+849C,U+84B2,U+84B8,U+84BF,U+84C4,U+84C9,U+84D1,U+84D6,U+84DD,U+84DF,U+84E6,U+84EC,U+8511,U+8513,U+8517,U+851A,U+851F,U+8521,U+852B-852C,U+8537,U+853B-853D,U+8549-854A,U+8559,U+8574,U+857E,U+8584,U+8587,U+858F,U+859B,U+85AA,U+85AF-85B0,U+85C9,U+85CF-85D0,U+85D3,U+85D5,U+85E4,U+85E9,U+85FB,U+8611,U+8638,U+864E-8651,U+8654,U+865A,U+865E,U+866B-866C,U+8671,U+8679,U+867D-867E,U+8680-8682,U+868A,U+868C-868D,U+8693}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.r.woff2)format(\"woff2\");unicode-range:U+8273,U+827A,U+827E,U+8282,U+828A-828B,U+828D,U+8292,U+8299,U+829C-829D,U+82A5-82A6,U+82A9,U+82AB-82AD,U+82AF,U+82B1,U+82B3,U+82B7-82B9,U+82BD,U+82C7,U+82CD,U+82CF,U+82D1,U+82D3-82D4,U+82D7,U+82DB,U+82DE-82DF,U+82E3,U+82E5-82E6,U+82EB,U+82EF,U+82F1,U+82F9,U+82FB,U+8301-8305,U+8309,U+830E,U+8314,U+8317,U+8327-8328,U+832B-832C,U+832F,U+8335-8336,U+8338-8339,U+8340,U+8346-8347,U+8349,U+834F-8352,U+8354,U+835A,U+835C,U+8361,U+8363-8364,U+8367,U+836B,U+836F,U+8377,U+837C,U+8386,U+8389,U+838E,U+8393,U+839E,U+83A0,U+83AB,U+83B1-83B4,U+83B7,U+83B9-83BA,U+83BD,U+83C1,U+83C5,U+83C7,U+83CA,U+83CC,U+83CF}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.s.woff2)format(\"woff2\");unicode-range:U+80DE,U+80E1,U+80E7,U+80EA-80EB,U+80ED,U+80EF-80F0,U+80F3-80F4,U+80F6,U+80F8,U+80FA,U+80FD,U+8102,U+8106,U+8109-810A,U+810D,U+810F-8111,U+8113-8114,U+8116,U+8118,U+811A,U+812F,U+8131,U+8138,U+813E,U+8146,U+814A-814C,U+8150-8151,U+8154-8155,U+8165,U+816E,U+8170,U+8174,U+8179-817C,U+817E-8180,U+818A,U+818F,U+8198,U+819B-819D,U+81A8,U+81B3,U+81BA-81BB,U+81C0,U+81C2-81C3,U+81C6,U+81CA,U+81E3,U+81EA,U+81EC-81ED,U+81F3-81F4,U+81FB-81FC,U+81FE,U+8200,U+8205-8206,U+820C-820D,U+8210,U+8212,U+8214,U+821C,U+821E-821F,U+822A-822C,U+8230-8231,U+8235-8239,U+8247,U+8258,U+826F-8270,U+8272}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.t.woff2)format(\"woff2\");unicode-range:U+7F72,U+7F81,U+7F8A,U+7F8C,U+7F8E,U+7F94,U+7F9A,U+7F9E,U+7FA1,U+7FA4,U+7FB2,U+7FB8-7FB9,U+7FBD,U+7FC1,U+7FC5,U+7FCC,U+7FCE,U+7FD4-7FD5,U+7FD8,U+7FDF-7FE1,U+7FE6,U+7FE9,U+7FF0-7FF1,U+7FF3,U+7FFB-7FFC,U+8000-8001,U+8003,U+8005,U+800C-800D,U+8010,U+8012,U+8015,U+8017-8019,U+8027,U+802A,U+8033,U+8036-8038,U+803B,U+803D,U+803F,U+8042,U+8046,U+804A-804C,U+8052,U+8054,U+8058,U+805A,U+806A,U+807F,U+8083-8084,U+8086-8087,U+8089,U+808B-808C,U+8096,U+8098,U+809A-809B,U+809D,U+80A0-80A2,U+80A4-80A5,U+80A9-80AA,U+80AE-80AF,U+80B2,U+80B4,U+80BA,U+80BE-80C1,U+80C3-80C4,U+80C6,U+80CC,U+80CE,U+80D6,U+80DA-80DC}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.u.woff2)format(\"woff2\");unicode-range:U+7EB5-7EBA,U+7EBD,U+7EBF,U+7EC2-7ECA,U+7ECD-7ED5,U+7ED8-7EDF,U+7EE1-7EE3,U+7EE5-7EE7,U+7EE9-7EEB,U+7EED,U+7EEF-7EF0,U+7EF3-7EF8,U+7EFC-7EFD,U+7EFF-7F00,U+7F04-7F09,U+7F0E-7F0F,U+7F13-7F16,U+7F18,U+7F1A,U+7F1C-7F1D,U+7F1F-7F22,U+7F24-7F26,U+7F28-7F2A,U+7F2D-7F2E,U+7F30,U+7F34,U+7F38,U+7F3A,U+7F42,U+7F50-7F51,U+7F54-7F55,U+7F57,U+7F5A,U+7F61-7F62,U+7F69-7F6A,U+7F6E}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.v.woff2)format(\"woff2\");unicode-range:U+7B4C,U+7B4F-7B52,U+7B54,U+7B56,U+7B5B,U+7B5D,U+7B75,U+7B77,U+7B79,U+7B7E,U+7B80,U+7B8D,U+7B94-7B95,U+7B97,U+7BA1,U+7BA9-7BAB,U+7BAD,U+7BB1,U+7BB8,U+7BC6-7BC7,U+7BD1,U+7BD3,U+7BD9,U+7BDD,U+7BE1,U+7BEE,U+7BF1,U+7BF7,U+7BFE,U+7C07,U+7C0C,U+7C27,U+7C2A,U+7C38,U+7C3F,U+7C41,U+7C4D,U+7C73,U+7C7B,U+7C7D,U+7C89,U+7C92,U+7C95,U+7C97-7C98,U+7C9F,U+7CA4-7CA5,U+7CAA,U+7CAE,U+7CB1,U+7CB3,U+7CB9,U+7CBC-7CBE,U+7CC5,U+7CCA,U+7CD5-7CD7,U+7CD9,U+7CDC,U+7CDF-7CE0,U+7CEF,U+7CFB,U+7D0A,U+7D20,U+7D22,U+7D27,U+7D2B,U+7D2F,U+7D6E,U+7E41,U+7E82,U+7EA0-7EA4,U+7EA6-7EA8,U+7EAA-7EAD,U+7EAF-7EB3}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.w.woff2)format(\"woff2\");unicode-range:U+7981,U+7984-7985,U+798F,U+79B9,U+79BB,U+79BD-79BE,U+79C0-79C1,U+79C3,U+79C6,U+79C9,U+79CB,U+79CD,U+79D1-79D2,U+79D8,U+79DF,U+79E3-79E4,U+79E6-79E7,U+79E9,U+79EF-79F0,U+79F8,U+79FB,U+79FD,U+7A00,U+7A0B,U+7A0D-7A0E,U+7A14,U+7A17,U+7A1A,U+7A20,U+7A33,U+7A37,U+7A39,U+7A3B-7A3D,U+7A3F,U+7A46,U+7A51,U+7A57,U+7A74,U+7A76-7A77,U+7A79-7A7A,U+7A7F,U+7A81,U+7A83-7A84,U+7A88,U+7A8D,U+7A91-7A92,U+7A95-7A98,U+7A9C-7A9D,U+7A9F,U+7AA5-7AA6,U+7ABF,U+7ACB,U+7AD6,U+7AD9,U+7ADE-7AE0,U+7AE3,U+7AE5-7AE6,U+7AED,U+7AEF,U+7AF9,U+7AFD,U+7AFF,U+7B03,U+7B06,U+7B08,U+7B0B,U+7B11,U+7B14,U+7B19,U+7B1B,U+7B20,U+7B26,U+7B28,U+7B2C,U+7B3A,U+7B3C,U+7B49,U+7B4B}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.x.woff2)format(\"woff2\");unicode-range:U+77AA,U+77AC,U+77B0,U+77B3,U+77B5,U+77BB,U+77BF,U+77D7,U+77DB-77DC,U+77E2-77E3,U+77E5,U+77E9,U+77EB,U+77ED-77EE,U+77F3,U+77FD-77FF,U+7801-7802,U+780C-780D,U+7812,U+7814,U+7816,U+781A,U+781D,U+7823,U+7825,U+7827,U+7830,U+7834,U+7837-7838,U+783A,U+783E,U+7840,U+7845,U+784C,U+7852,U+7855,U+785D,U+786B-786C,U+786E,U+787C,U+7887,U+7889,U+788C-788E,U+7891,U+7897-7898,U+789C,U+789F,U+78A5,U+78A7,U+78B0-78B1,U+78B3-78B4,U+78BE,U+78C1,U+78C5,U+78CA-78CB,U+78D0,U+78D5,U+78E8,U+78EC,U+78F7,U+78FA,U+7901,U+7934,U+793A,U+793C,U+793E,U+7940-7941,U+7948,U+7956-7957,U+795A-795B,U+795D-7960,U+7965,U+7968,U+796D,U+796F,U+7977-7978,U+797A,U+7980}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.y.woff2)format(\"woff2\");unicode-range:U+761F,U+7624,U+7626,U+7629-762B,U+7634-7635,U+7638,U+763E,U+764C,U+7656,U+765E,U+7663,U+766B,U+7678,U+767B,U+767D-767E,U+7682,U+7684,U+7686-7688,U+768B,U+768E,U+7691,U+7693,U+7696,U+7699,U+76AE,U+76B1,U+76B4,U+76BF,U+76C2,U+76C5-76C6,U+76C8,U+76CA,U+76CE-76D2,U+76D4,U+76D6-76D8,U+76DB,U+76DF,U+76EE-76EF,U+76F2,U+76F4,U+76F8-76F9,U+76FC,U+76FE,U+7701,U+7708-7709,U+770B,U+771F-7720,U+7726,U+7728-7729,U+772F,U+7736-7738,U+773A,U+773C,U+7740-7741,U+7750-7751,U+775A-775B,U+7761,U+7763,U+7765-7766,U+7768,U+776B-776C,U+7779,U+777D,U+777F,U+7784-7785,U+778C,U+778E,U+7791-7792,U+779F-77A0,U+77A5,U+77A7,U+77A9}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.z.woff2)format(\"woff2\");unicode-range:U+7435-7436,U+743C,U+7455,U+7459-745A,U+745C,U+745E-745F,U+7470,U+7476,U+7480,U+7483,U+7487,U+749C,U+749E,U+74A7-74A8,U+74DC,U+74E2-74E4,U+74E6,U+74EE,U+74F6-74F7,U+7504,U+7518,U+751A,U+751C,U+751F,U+7525,U+7528-7529,U+752B-752D,U+7530-7533,U+7535,U+7537-7538,U+753B,U+7545,U+754C,U+754F,U+7554,U+7559,U+755C,U+7565-7566,U+756A,U+7574,U+7578,U+7583,U+7586,U+758F,U+7591,U+7597,U+7599-759A,U+759F,U+75A1,U+75A4-75A5,U+75AB,U+75AE-75B2,U+75B4-75B5,U+75B9,U+75BC-75BE,U+75C5,U+75C7-75CA,U+75CD,U+75D2,U+75D4-75D5,U+75D8,U+75DB,U+75DE,U+75E2-75E3,U+75E8,U+75EA,U+75F0,U+75F4,U+75F9,U+7600-7601}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aa.woff2)format(\"woff2\");unicode-range:U+725F,U+7261-7262,U+7267,U+7269,U+7272,U+7275,U+7279-727A,U+7280-7281,U+7284,U+728A,U+7292,U+729F,U+72AC,U+72AF,U+72B6-72B9,U+72C1-72C2,U+72C4,U+72C8,U+72CE,U+72D0,U+72D2,U+72D7,U+72D9,U+72DE,U+72E0-72E1,U+72E9,U+72EC-72F2,U+72F7-72F8,U+72FC,U+730A,U+730E,U+7316,U+731B-731D,U+7322,U+7325,U+7329-732C,U+732E,U+7334,U+733E-733F,U+7350,U+7357,U+7360,U+736D,U+7384,U+7387,U+7389,U+738B,U+7396,U+739B,U+73A9,U+73AB,U+73AF-73B0,U+73B2,U+73B7,U+73BA-73BB,U+73C0,U+73C8,U+73CA,U+73CD,U+73D0-73D1,U+73D9,U+73E0,U+73ED,U+7403,U+7405-7406,U+7409-740A,U+740F-7410,U+741A,U+7422,U+7425,U+742A,U+7433-7434}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ab.woff2)format(\"woff2\");unicode-range:U+706D,U+706F-7070,U+7075-7076,U+7078,U+707C,U+707E-707F,U+7089-708A,U+708E,U+7092,U+7094-7096,U+7099,U+70AB-70AF,U+70B1,U+70B3,U+70B8-70B9,U+70BC-70BD,U+70C1-70C3,U+70C8,U+70CA,U+70D8-70D9,U+70DB,U+70DF,U+70E4,U+70E6-70E7,U+70E9,U+70EB-70ED,U+70EF,U+70F7,U+70F9,U+70FD,U+7109-710A,U+7115,U+7119-711A,U+7126,U+7130-7131,U+7136,U+714C,U+714E,U+715E,U+7164,U+7166-7168,U+716E,U+7172-7173,U+717D,U+7184,U+718A,U+718F,U+7194,U+7198-7199,U+719F-71A0,U+71A8,U+71AC,U+71B9,U+71C3,U+71CE,U+71D5,U+71E5,U+7206,U+722A,U+722C,U+7231,U+7235-7239,U+723D,U+7247-7248,U+724C-724D,U+7252,U+7259,U+725B}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ac.woff2)format(\"woff2\");unicode-range:U+6DF7,U+6DF9,U+6DFB,U+6E05,U+6E0A,U+6E0D-6E0E,U+6E10,U+6E14,U+6E17,U+6E1A,U+6E1D,U+6E20-6E21,U+6E23-6E25,U+6E29,U+6E2D,U+6E2F,U+6E32,U+6E34,U+6E38,U+6E3A,U+6E43,U+6E4D,U+6E56,U+6E58,U+6E5B,U+6E6E,U+6E7E-6E7F,U+6E83,U+6E85,U+6E89,U+6E90,U+6E9C,U+6EA2,U+6EA5,U+6EAA,U+6EAF,U+6EB6,U+6EBA,U+6EC1,U+6EC7,U+6ECB,U+6ED1,U+6ED3-6ED5,U+6EDA,U+6EDE,U+6EE1,U+6EE4-6EE6,U+6EE8-6EE9,U+6EF4,U+6F02,U+6F06,U+6F09,U+6F0F,U+6F13-6F15,U+6F20,U+6F29-6F2B,U+6F31,U+6F33,U+6F3E,U+6F46-6F47,U+6F4D,U+6F58,U+6F5C,U+6F5E,U+6F62,U+6F66,U+6F6D-6F6E,U+6F84,U+6F88-6F89,U+6F8E,U+6F9C,U+6FA1,U+6FB3,U+6FB9,U+6FC0,U+6FD1-6FD2,U+6FE1,U+7011,U+701A,U+7023,U+704C,U+706B}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ad.woff2)format(\"woff2\");unicode-range:U+6CCC,U+6CD3,U+6CD5,U+6CDB,U+6CDE,U+6CE1-6CE3,U+6CE5,U+6CE8,U+6CEA-6CEB,U+6CEF-6CF1,U+6CF3,U+6CF5,U+6CFB-6CFE,U+6D01,U+6D0B,U+6D12,U+6D17,U+6D1B,U+6D1E,U+6D25,U+6D27,U+6D2A,U+6D31-6D32,U+6D3B-6D3E,U+6D41,U+6D43,U+6D45-6D47,U+6D4A-6D4B,U+6D4E-6D4F,U+6D51,U+6D53,U+6D59-6D5A,U+6D63,U+6D66,U+6D69-6D6A,U+6D6E,U+6D74,U+6D77-6D78,U+6D82,U+6D85,U+6D88-6D89,U+6D8C,U+6D8E,U+6D93,U+6D95,U+6D9B,U+6D9D,U+6D9F-6DA1,U+6DA3-6DA4,U+6DA6-6DAA,U+6DAE-6DAF,U+6DB2,U+6DB5,U+6DB8,U+6DC0,U+6DC4-6DC7,U+6DCB-6DCC,U+6DD1,U+6DD6,U+6DD8-6DD9,U+6DE1,U+6DE4,U+6DEB-6DEC,U+6DEE,U+6DF1,U+6DF3}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ae.woff2)format(\"woff2\");unicode-range:U+6B92,U+6B96,U+6B9A,U+6BA1,U+6BB4-6BB5,U+6BB7,U+6BBF,U+6BC1,U+6BC5,U+6BCB,U+6BCD,U+6BCF,U+6BD2,U+6BD4-6BD7,U+6BD9,U+6BDB,U+6BE1,U+6BEB,U+6BEF,U+6C05,U+6C0F,U+6C11,U+6C13-6C14,U+6C16,U+6C1B,U+6C1F,U+6C22,U+6C24,U+6C26-6C28,U+6C2E-6C30,U+6C32,U+6C34,U+6C38,U+6C3D,U+6C40-6C42,U+6C47,U+6C49,U+6C50,U+6C55,U+6C57,U+6C5B,U+6C5D-6C61,U+6C64,U+6C68-6C6A,U+6C70,U+6C72,U+6C76,U+6C79,U+6C7D-6C7E,U+6C81-6C83,U+6C86,U+6C88-6C89,U+6C8C,U+6C8F-6C90,U+6C93,U+6C99,U+6C9B,U+6C9F,U+6CA1,U+6CA4-6CA7,U+6CAA-6CAB,U+6CAE,U+6CB3,U+6CB8-6CB9,U+6CBB-6CBF,U+6CC4-6CC5,U+6CC9-6CCA}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.af.woff2)format(\"woff2\");unicode-range:U+68AD,U+68AF-68B0,U+68B3,U+68B5,U+68C0,U+68C2,U+68C9,U+68CB,U+68CD,U+68D2,U+68D5,U+68D8,U+68DA,U+68E0,U+68EE,U+68F1,U+68F5,U+68FA,U+6905,U+690D-690E,U+6912,U+692D,U+6930,U+693D,U+693F,U+6942,U+6954,U+6957,U+695A,U+695E,U+6963,U+696B,U+6977-6978,U+697C,U+6982,U+6984,U+6986,U+6994,U+699C,U+69A8,U+69AD,U+69B4,U+69B7,U+69BB,U+69C1,U+69CC,U+69D0,U+69DB,U+69FD,U+69FF,U+6A0A,U+6A1F,U+6A21,U+6A2A,U+6A31,U+6A35,U+6A3D,U+6A44,U+6A47,U+6A58-6A59,U+6A61,U+6A71,U+6A80,U+6A84,U+6A8E,U+6A90,U+6AAC,U+6B20-6B23,U+6B27,U+6B32,U+6B3A,U+6B3E,U+6B47,U+6B49,U+6B4C,U+6B62-6B67,U+6B6A,U+6B79,U+6B7B-6B7C,U+6B81,U+6B83-6B84,U+6B86-6B87,U+6B89-6B8B}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ag.woff2)format(\"woff2\");unicode-range:U+6756,U+675C,U+675E-6761,U+6765,U+6768,U+676D,U+676F-6770,U+6773,U+6775,U+6777,U+677C,U+677E-677F,U+6781,U+6784,U+6787,U+6789,U+6790,U+6795,U+6797,U+679A,U+679C-679D,U+67A2-67A3,U+67AA-67AB,U+67AD,U+67AF-67B0,U+67B6-67B7,U+67C4,U+67CF-67D4,U+67D9-67DA,U+67DC,U+67DE,U+67E0,U+67E5,U+67E9,U+67EC,U+67EF,U+67F1,U+67F3-67F4,U+67FF-6800,U+6805,U+6807-6808,U+680B,U+680F,U+6811,U+6813,U+6816-6817,U+6821,U+6829-682A,U+6837-6839,U+683C-683D,U+6840,U+6842-6843,U+6845-6846,U+6848,U+684C,U+6850-6851,U+6853-6854,U+6863,U+6865,U+6868-6869,U+6874,U+6876,U+6881,U+6885-6886,U+6893,U+6897,U+68A2,U+68A6-68A8}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ah.woff2)format(\"woff2\");unicode-range:U+65F7,U+65FA,U+6602,U+6606,U+660A,U+660C,U+660E-660F,U+6613-6614,U+6619,U+661D,U+661F-6620,U+6625,U+6627-6628,U+662D,U+662F,U+6631,U+6635,U+663C,U+663E,U+6643,U+664B-664C,U+664F,U+6652-6653,U+6655-6657,U+665A,U+6664,U+6666,U+6668,U+666E-6670,U+6674,U+6676-6677,U+667A,U+667E,U+6682,U+6684,U+6687,U+668C,U+6691,U+6696-6697,U+669D,U+66A7,U+66AE,U+66B4,U+66D9,U+66DC-66DD,U+66E6,U+66F0,U+66F2-66F4,U+66F9,U+66FC,U+66FE-6700,U+6708-6709,U+670B,U+670D,U+6714-6715,U+6717,U+671B,U+671D,U+671F,U+6726,U+6728,U+672A-672D,U+672F,U+6731,U+6734-6735,U+673A,U+673D,U+6740,U+6742-6743,U+6746,U+6748-6749,U+674E-6751}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ai.woff2)format(\"woff2\");unicode-range:U+6467,U+6469,U+6478-6479,U+6482,U+6485,U+6487,U+6491-6492,U+6495,U+649E,U+64A4,U+64A9,U+64AC-64AE,U+64B0,U+64B5,U+64B8,U+64BA,U+64BC,U+64C2,U+64C5,U+64CD-64CE,U+64D2,U+64D8,U+64DE,U+64E2,U+64E6,U+6500,U+6512,U+6518,U+6525,U+652B,U+652F,U+6536,U+6538-6539,U+653B,U+653E-653F,U+6545,U+6548,U+654C,U+654F,U+6551,U+6555-6556,U+6559,U+655B,U+655D-655E,U+6562-6563,U+6566,U+656C,U+6570,U+6572,U+6574,U+6577,U+6587,U+658B-658C,U+6590-6591,U+6593,U+6597,U+6599,U+659C,U+659F,U+65A1,U+65A4-65A5,U+65A7,U+65A9,U+65AB,U+65AD,U+65AF-65B0,U+65B9,U+65BD,U+65C1,U+65C4-65C5,U+65CB-65CC,U+65CF,U+65D7,U+65E0,U+65E2,U+65E5-65E9,U+65EC-65ED,U+65F1,U+65F6}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aj.woff2)format(\"woff2\");unicode-range:U+6323-6325,U+6328,U+632A-632B,U+632F,U+6332,U+633A,U+633D,U+6342,U+6345-6346,U+6349,U+634B-6350,U+6355,U+635E-635F,U+6361-6363,U+6367,U+636E,U+6371,U+6376-6377,U+637A-637B,U+6380,U+6382,U+6387-6389,U+638C,U+638F-6390,U+6392,U+6396,U+6398,U+63A0,U+63A2-63A3,U+63A5,U+63A7-63AA,U+63AC,U+63B0,U+63B3-63B4,U+63B7-63B8,U+63BA,U+63C4,U+63C9,U+63CD,U+63CF-63D0,U+63D2,U+63D6,U+63E1,U+63E3,U+63E9-63EA,U+63ED,U+63F4,U+63F6,U+63FD,U+6400-6402,U+6405,U+640F-6410,U+6413-6414,U+641C,U+641E,U+6421,U+642A,U+642C-642D,U+643A,U+643D,U+6441,U+6444,U+6446-6448,U+644A,U+6452,U+6454,U+6458,U+645E}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ak.woff2)format(\"woff2\");unicode-range:U+6258,U+625B,U+6263,U+6266-6267,U+6269-6270,U+6273,U+6276,U+6279,U+627C,U+627E-6280,U+6284,U+6289-628A,U+6291-6293,U+6295-6298,U+629A-629B,U+62A0-62A2,U+62A4-62A5,U+62A8,U+62AB-62AC,U+62B1,U+62B5,U+62B9,U+62BC-62BD,U+62BF,U+62C2,U+62C4-62CA,U+62CC-62CE,U+62D0,U+62D2-62D4,U+62D6-62D9,U+62DB-62DC,U+62DF,U+62E2-62E3,U+62E5-62E9,U+62EC-62ED,U+62EF,U+62F1,U+62F3-62F4,U+62F7,U+62FC-62FF,U+6301-6302,U+6307,U+6309,U+630E,U+6311,U+6316,U+631A-631B,U+631D-6321}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.al.woff2)format(\"woff2\");unicode-range:U+60CB,U+60D1,U+60D5,U+60D8,U+60DA,U+60DC,U+60DF-60E0,U+60E6-60E9,U+60EB-60F0,U+60F3-60F4,U+60F6,U+60F9-60FA,U+6101,U+6108-6109,U+610E-610F,U+6115,U+611A,U+611F-6120,U+6123-6124,U+6127,U+612B,U+613F,U+6148,U+614A,U+614C,U+614E,U+6151,U+6155,U+6162,U+6167-6168,U+6170,U+6175,U+6177,U+618B,U+618E,U+6194,U+61A7-61A9,U+61AC,U+61BE,U+61C2,U+61C8,U+61CA,U+61D1-61D2,U+61D4,U+61E6,U+61F5,U+61FF,U+6208,U+620A,U+620C-6212,U+6216,U+6218,U+621A-621B,U+621F,U+622A,U+622C,U+622E,U+6233-6234,U+6237,U+623E-6241,U+6247-6249,U+624B,U+624D-624E,U+6251-6254}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.am.woff2)format(\"woff2\");unicode-range:U+5FCC-5FCD,U+5FCF-5FD2,U+5FD6-5FD9,U+5FDD,U+5FE0-5FE1,U+5FE4,U+5FE7,U+5FEA-5FEB,U+5FF1,U+5FF5,U+5FFB,U+5FFD-6002,U+6005-6006,U+600D-600F,U+6012,U+6014-6016,U+6019,U+601C-601D,U+6020-6021,U+6025-6028,U+602A,U+602F,U+6035,U+603B-603C,U+6041,U+6043,U+604B,U+604D,U+6050,U+6052,U+6055,U+6059-605A,U+6062-6064,U+6068-606D,U+606F-6070,U+6073,U+6076,U+6078-607C,U+607F,U+6084,U+6089,U+608C-608D,U+6094,U+6096,U+609A,U+609F-60A0,U+60A3,U+60A6,U+60A8,U+60AC,U+60AF,U+60B1-60B2,U+60B4,U+60B8,U+60BB-60BC,U+60C5-60C6,U+60CA}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.an.woff2)format(\"woff2\");unicode-range:U+5E7F,U+5E84,U+5E86-5E87,U+5E8A,U+5E8F-5E90,U+5E93-5E97,U+5E99-5E9A,U+5E9C,U+5E9E-5E9F,U+5EA6-5EA7,U+5EAD,U+5EB5-5EB8,U+5EC9-5ECA,U+5ED1,U+5ED3,U+5ED6,U+5EF6-5EF7,U+5EFA,U+5F00,U+5F02-5F04,U+5F08,U+5F0A-5F0B,U+5F0F,U+5F11,U+5F13,U+5F15,U+5F17-5F18,U+5F1B,U+5F1F-5F20,U+5F25-5F27,U+5F29,U+5F2F,U+5F31,U+5F39-5F3A,U+5F52-5F53,U+5F55,U+5F57,U+5F5D,U+5F62,U+5F64,U+5F66,U+5F69-5F6A,U+5F6C-5F6D,U+5F70-5F71,U+5F77,U+5F79,U+5F7B-5F7C,U+5F80-5F81,U+5F84-5F85,U+5F87-5F8B,U+5F90,U+5F92,U+5F95,U+5F97-5F98,U+5FA1,U+5FA8,U+5FAA,U+5FAD-5FAE,U+5FB5,U+5FB7,U+5FBC-5FBD,U+5FC3,U+5FC5-5FC6}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ao.woff2)format(\"woff2\");unicode-range:U+5C7F,U+5C81-5C82,U+5C8C,U+5C94,U+5C96-5C97,U+5C9A-5C9B,U+5CA9,U+5CAD,U+5CB3,U+5CB8,U+5CBF,U+5CCB,U+5CD9,U+5CE1,U+5CE5-5CE6,U+5CE8,U+5CEA,U+5CED,U+5CF0,U+5CFB,U+5D02,U+5D07,U+5D0E,U+5D14,U+5D16,U+5D1B,U+5D24,U+5D29,U+5D2D,U+5D34,U+5D3D,U+5D4C,U+5D58,U+5D6C,U+5D82,U+5D99,U+5DC5,U+5DCD,U+5DDD-5DDE,U+5DE1-5DE2,U+5DE5-5DE9,U+5DEB,U+5DEE,U+5DF1-5DF4,U+5DF7,U+5DFE,U+5E01-5E03,U+5E05-5E06,U+5E08,U+5E0C,U+5E10-5E11,U+5E15-5E16,U+5E18,U+5E1A-5E1D,U+5E26-5E27,U+5E2D-5E2E,U+5E37-5E38,U+5E3C-5E3D,U+5E42,U+5E44-5E45,U+5E4C,U+5E54-5E55,U+5E61-5E62,U+5E72-5E74,U+5E76,U+5E78,U+5E7A-5E7D}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ap.woff2)format(\"woff2\");unicode-range:U+5B85,U+5B87-5B89,U+5B8B-5B8C,U+5B8F,U+5B95,U+5B97-5B9E,U+5BA0-5BA4,U+5BA6,U+5BAA-5BAB,U+5BB0,U+5BB3-5BB6,U+5BB9,U+5BBD-5BBF,U+5BC2,U+5BC4-5BC7,U+5BCC,U+5BD0,U+5BD2-5BD3,U+5BDD-5BDF,U+5BE1,U+5BE4-5BE5,U+5BE8,U+5BF0,U+5BF8-5BFC,U+5BFF,U+5C01,U+5C04,U+5C06,U+5C09-5C0A,U+5C0F,U+5C11,U+5C14,U+5C16,U+5C18,U+5C1A,U+5C1D,U+5C24,U+5C27,U+5C2C,U+5C31,U+5C34,U+5C38-5C3A,U+5C3C-5C42,U+5C45,U+5C48-5C4B,U+5C4E-5C51,U+5C55,U+5C5E,U+5C60-5C61,U+5C65,U+5C6F,U+5C71,U+5C79}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aq.woff2)format(\"woff2\");unicode-range:U+5996,U+5999,U+599E,U+59A5,U+59A8-59AA,U+59AE,U+59B2,U+59B9,U+59BB,U+59BE,U+59C6,U+59CB,U+59D0-59D1,U+59D3-59D4,U+59D7-59D8,U+59DA,U+59DC-59DD,U+59E3,U+59E5,U+59E8,U+59EC,U+59F9,U+59FB,U+59FF,U+5A01,U+5A03-5A04,U+5A06-5A07,U+5A11,U+5A13,U+5A18,U+5A1C,U+5A1F-5A20,U+5A25,U+5A29,U+5A31-5A32,U+5A34,U+5A36,U+5A3C,U+5A40,U+5A46,U+5A49-5A4A,U+5A5A,U+5A62,U+5A6A,U+5A74,U+5A76-5A77,U+5A7F,U+5A92,U+5A9A-5A9B,U+5AB2-5AB3,U+5AC1-5AC2,U+5AC9,U+5ACC,U+5AD4,U+5AD6,U+5AE1,U+5AE3,U+5AE6,U+5AE9,U+5B09,U+5B34,U+5B37,U+5B40,U+5B50,U+5B54-5B55,U+5B57-5B59,U+5B5C-5B5D,U+5B5F,U+5B63-5B64,U+5B66,U+5B69-5B6A,U+5B6C,U+5B70-5B71,U+5B75,U+5B7A,U+5B7D,U+5B81,U+5B83}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ar.woff2)format(\"woff2\");unicode-range:U+57CE,U+57D4,U+57DF-57E0,U+57F9-57FA,U+5800,U+5802,U+5806,U+5811,U+5815,U+5821,U+5824,U+582A,U+5830,U+5835,U+584C,U+5851,U+5854,U+5858,U+585E,U+586B,U+587E,U+5883,U+5885,U+5892-5893,U+5899,U+589E-589F,U+58A8-58A9,U+58C1,U+58D1,U+58D5,U+58E4,U+58EB-58EC,U+58EE,U+58F0,U+58F3,U+58F6,U+58F9,U+5904,U+5907,U+590D,U+590F,U+5915-5916,U+5919-591A,U+591C,U+591F,U+5927,U+5929-592B,U+592D-592F,U+5931,U+5934,U+5937-593A,U+5942,U+5944,U+5947-5949,U+594B,U+594E-594F,U+5951,U+5954-5957,U+595A,U+5960,U+5962,U+5965,U+5973-5974,U+5976,U+5978-5979,U+597D,U+5981-5984,U+5986-5988,U+598A,U+598D,U+5992-5993}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.as.woff2)format(\"woff2\");unicode-range:U+561B,U+561E-561F,U+5624,U+562D,U+5631-5632,U+5634,U+5636,U+5639,U+563B,U+563F,U+564C,U+564E,U+5654,U+5657,U+5659,U+565C,U+5662,U+5664,U+5668-566C,U+5676,U+567C,U+5685,U+568E-568F,U+5693,U+56A3,U+56B7,U+56BC,U+56CA,U+56D4,U+56DA-56DB,U+56DE,U+56E0,U+56E2,U+56E4,U+56ED,U+56F0-56F1,U+56F4,U+56F9-56FA,U+56FD-56FF,U+5703,U+5706,U+5708-5709,U+571F,U+5723,U+5728,U+572D,U+5730,U+573A,U+573E,U+5740,U+5747,U+574A,U+574D-5751,U+5757,U+575A-575B,U+575D-5761,U+5764,U+5766,U+5768,U+576A,U+576F,U+5773,U+5777,U+5782-5784,U+578B,U+5792,U+579B,U+57A0,U+57A2-57A3,U+57A6,U+57AB,U+57AE,U+57C2-57C3,U+57CB}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.at.woff2)format(\"woff2\");unicode-range:U+54E5-54EA,U+54ED-54EE,U+54F2,U+54FA,U+54FC-54FD,U+5501,U+5506-5507,U+5509,U+550F-5510,U+5514,U+5520,U+5522,U+5524,U+5527,U+552C,U+552E-5531,U+5533,U+553E-553F,U+5543-5544,U+5546,U+554A,U+5550,U+5555-5556,U+555C,U+5561,U+5564-5567,U+556A,U+556C,U+556E,U+5575,U+5577-5578,U+557B-557C,U+557E,U+5580,U+5582-5584,U+5587,U+5589-558B,U+558F,U+5591,U+5594,U+5598-5599,U+559C-559D,U+559F,U+55A7,U+55B3,U+55B7,U+55BB,U+55BD,U+55C5,U+55D1-55D4,U+55D6,U+55DC-55DD,U+55DF,U+55E1,U+55E3-55E6,U+55E8,U+55EB-55EC,U+55EF,U+55F7,U+55FD,U+5600-5601,U+5608-5609,U+560E,U+5618}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.au.woff2)format(\"woff2\");unicode-range:U+5411,U+5413,U+5415,U+5417,U+541B,U+541D-5420,U+5426-5429,U+542B-542F,U+5431,U+5434-5435,U+5438-5439,U+543B-543C,U+543E,U+5440,U+5443,U+5446,U+5448,U+544A,U+5450,U+5453,U+5455,U+5457-5458,U+545B-545C,U+5462,U+5464,U+5466,U+5468,U+5471-5473,U+5475,U+5478,U+547B-547D,U+5480,U+5482,U+5484,U+5486,U+548B-548C,U+548E-5490,U+5492,U+5494-5496,U+5499-549B,U+54A4,U+54A6-54AD,U+54AF,U+54B1,U+54B3,U+54B8,U+54BB,U+54BD,U+54BF-54C2,U+54C4,U+54C6-54C9,U+54CD-54CE,U+54D0-54D2,U+54D5,U+54D7,U+54DA,U+54DD,U+54DF}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.av.woff2)format(\"woff2\");unicode-range:U+5348-534A,U+534E-534F,U+5351-5353,U+5355-5357,U+535A,U+535C,U+535E-5362,U+5364,U+5366-5367,U+536B,U+536F-5371,U+5373-5375,U+5377-5378,U+537F,U+5382,U+5384-5386,U+5389,U+538B-538C,U+5395,U+5398,U+539A,U+539F,U+53A2,U+53A5-53A6,U+53A8-53A9,U+53AE,U+53BB,U+53BF,U+53C1-53C2,U+53C8-53CD,U+53D1,U+53D4,U+53D6-53D9,U+53DB,U+53DF-53E0,U+53E3-53E6,U+53E8-53F3,U+53F6-53F9,U+53FC-53FD,U+5401,U+5403-5404,U+5408-540A,U+540C-5410}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.aw.woff2)format(\"woff2\");unicode-range:U+5207,U+520A,U+520D-520E,U+5211-5212,U+5217-521B,U+521D,U+5220,U+5224,U+5228-5229,U+522B,U+522D-522E,U+5230,U+5236-523B,U+523D,U+5241-5243,U+524A,U+524C-524D,U+5250-5251,U+5254,U+5256,U+525C,U+5265,U+5267,U+5269-526A,U+526F,U+5272,U+527D,U+527F,U+5288,U+529B,U+529D-52A1,U+52A3,U+52A8-52AB,U+52AD,U+52B1-52B3,U+52BE-52BF,U+52C3,U+52C7,U+52C9,U+52CB,U+52D0,U+52D2,U+52D8,U+52DF,U+52E4,U+52FA,U+52FE-5300,U+5305-5306,U+5308,U+530D,U+5310,U+5315-5317,U+5319,U+531D,U+5320-5321,U+5323,U+532A,U+532E,U+5339-533B,U+533E-533F,U+5341,U+5343,U+5347}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ax.woff2)format(\"woff2\");unicode-range:U+50CF,U+50D6,U+50DA,U+50E7,U+50EE,U+50F3,U+50F5,U+50FB,U+5106,U+510B,U+5112,U+5121,U+513F-5141,U+5143-5146,U+5148-5149,U+514B,U+514D,U+5151,U+5154,U+515A,U+515C,U+5162,U+5165,U+5168,U+516B-516E,U+5170-5171,U+5173-5179,U+517B-517D,U+5180,U+5185,U+5188-5189,U+518C-518D,U+5192,U+5195,U+5197,U+5199,U+519B-519C,U+51A0,U+51A2,U+51A4-51A5,U+51AC,U+51AF-51B0,U+51B2-51B3,U+51B5-51B7,U+51BB,U+51BD,U+51C0,U+51C4,U+51C6,U+51C9,U+51CB-51CC,U+51CF,U+51D1,U+51DB,U+51DD,U+51E0-51E1,U+51E4,U+51ED,U+51EF-51F0,U+51F3,U+51F6,U+51F8-51FB,U+51FD,U+51FF-5201,U+5203,U+5206}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.ay.woff2)format(\"woff2\");unicode-range:U+4F60,U+4F63,U+4F65,U+4F69,U+4F6C,U+4F6F-4F70,U+4F73-4F74,U+4F7B-4F7C,U+4F7F,U+4F83-4F84,U+4F88,U+4F8B,U+4F8D,U+4F97,U+4F9B,U+4F9D,U+4FA0,U+4FA3,U+4FA5-4FAA,U+4FAC,U+4FAE-4FAF,U+4FB5,U+4FBF,U+4FC3-4FC5,U+4FCA,U+4FCE-4FD1,U+4FD7-4FD8,U+4FDA,U+4FDD-4FDE,U+4FE1,U+4FE6,U+4FE8-4FE9,U+4FED-4FEF,U+4FF1,U+4FF8,U+4FFA,U+4FFE,U+500C-500D,U+500F,U+5012,U+5014,U+5018-501A,U+501C,U+501F,U+5021,U+5026,U+5028-502A,U+502D,U+503A,U+503C,U+503E,U+5043,U+5047-5048,U+504C,U+504E-504F,U+5055,U+505A,U+505C,U+5065,U+5076-5077,U+507B,U+507F-5080,U+5085,U+5088,U+508D,U+50A3,U+50A5,U+50A8,U+50AC,U+50B2,U+50BB}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.az.woff2)format(\"woff2\");unicode-range:U+4E94-4E95,U+4E98,U+4E9A-4E9B,U+4E9F,U+4EA1-4EA2,U+4EA4-4EA9,U+4EAB-4EAE,U+4EB2,U+4EB5,U+4EBA,U+4EBF-4EC1,U+4EC3-4EC7,U+4ECA-4ECB,U+4ECD-4ECE,U+4ED1,U+4ED3-4ED9,U+4EDE-4EDF,U+4EE3-4EE5,U+4EE8,U+4EEA,U+4EEC,U+4EF0,U+4EF2,U+4EF5-4EF7,U+4EFB,U+4EFD,U+4EFF,U+4F01,U+4F0A,U+4F0D-4F11,U+4F17-4F1A,U+4F1E-4F20,U+4F22,U+4F24-4F26,U+4F2A-4F2B,U+4F2F-4F30,U+4F34,U+4F36,U+4F38,U+4F3A,U+4F3C-4F3D,U+4F43,U+4F46,U+4F4D-4F51,U+4F53,U+4F55,U+4F58-4F59,U+4F5B-4F5E}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a0.woff2)format(\"woff2\");unicode-range:U+D7,U+E0-E1,U+E8-EA,U+EC-ED,U+F2-F3,U+F7,U+F9-FA,U+FC,U+2014,U+2018-2019,U+201C-201D,U+3001-3002,U+300A-300B,U+3010-3011,U+4E00-4E01,U+4E03,U+4E07-4E0B,U+4E0D-4E0E,U+4E10-4E11,U+4E13-4E14,U+4E16,U+4E18-4E1E,U+4E22,U+4E24-4E25,U+4E27,U+4E2A-4E2B,U+4E2D,U+4E30,U+4E32,U+4E34,U+4E38-4E3B,U+4E3D-4E3E,U+4E43,U+4E45,U+4E48-4E49,U+4E4B-4E50,U+4E52-4E54,U+4E56,U+4E58-4E59,U+4E5C-4E61,U+4E66,U+4E70-4E71,U+4E73,U+4E7E,U+4E86,U+4E88-4E89,U+4E8B-4E8C,U+4E8E-4E8F,U+4E91-4E93}@font-face{font-family:HarmonyOS_Regular;font-style:normal;font-weight:400;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Regular.a1.woff2)format(\"woff2\");unicode-range:U+21-7E,U+A4,U+A7-A8,U+B0-B1,U+B7}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a.woff2)format(\"woff2\");unicode-range:U+9AA2-FFE5}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.b.woff2)format(\"woff2\");unicode-range:U+8983-9AA0}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.c.woff2)format(\"woff2\");unicode-range:U+78F2-897B}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.d.woff2)format(\"woff2\");unicode-range:U+646D-78D9}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.e.woff2)format(\"woff2\");unicode-range:U+30E0-6445}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.f.woff2)format(\"woff2\");unicode-range:U+101-30DF}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.g.woff2)format(\"woff2\");unicode-range:U+9AA8,U+9AB8,U+9AD3,U+9AD8,U+9B03,U+9B3C,U+9B41-9B42,U+9B44,U+9B4F,U+9B54,U+9C7C,U+9C81,U+9C8D,U+9C9C,U+9CA4,U+9CB8,U+9CC3,U+9CD6,U+9CDE,U+9E1F,U+9E21,U+9E23,U+9E25-9E26,U+9E2D,U+9E2F,U+9E33,U+9E35,U+9E3D,U+9E3F,U+9E43,U+9E45,U+9E4A,U+9E4F,U+9E64,U+9E70,U+9E7F,U+9E93,U+9EA6,U+9EBB,U+9EC4,U+9ECD-9ECE,U+9ED1,U+9ED4,U+9ED8,U+9F0E,U+9F13,U+9F20,U+9F3B,U+9F50,U+9F7F,U+9F84,U+9F8B,U+9F99-9F9A,U+9F9F,U+FF01,U+FF08-FF09,U+FF0C,U+FF1A-FF1B,U+FF1F}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.h.woff2)format(\"woff2\");unicode-range:U+975B,U+975E,U+9760-9762,U+9769,U+9773-9774,U+9776,U+978B,U+978D,U+9798,U+97A0,U+97AD,U+97E6-97E7,U+97E9,U+97ED,U+97F3,U+97F5-97F6,U+9875-9877,U+9879-987B,U+987D-987F,U+9881-9882,U+9884-9888,U+988A,U+9890-9891,U+9893,U+9896-9898,U+989C-989D,U+98A0,U+98A4,U+98A7,U+98CE,U+98D8,U+98DE-98DF,U+9910,U+9965,U+996D-9972,U+9975-9976,U+997A,U+997C,U+997F,U+9981,U+9985-9986,U+9988,U+998B,U+998F,U+9992,U+9996,U+9999,U+9A6C-9A71,U+9A73-9A74,U+9A76,U+9A79,U+9A7B-9A7C,U+9A7E,U+9A82,U+9A84,U+9A86-9A87,U+9A8B-9A8C,U+9A8F,U+9A91,U+9A97,U+9A9A,U+9AA1,U+9AA4}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.i.woff2)format(\"woff2\");unicode-range:U+9570,U+9576,U+957F,U+95E8,U+95EA,U+95ED-95F0,U+95F2,U+95F4,U+95F7-95FB,U+95FD,U+9600-9602,U+9605,U+9609,U+960E,U+9610-9611,U+9614,U+961C,U+961F,U+962E,U+9632-9636,U+963B,U+963F-9640,U+9644-9648,U+964B-964D,U+9650,U+9655,U+965B,U+9661-9662,U+9664,U+9668-966A,U+9675-9677,U+9685-9686,U+968B,U+968F-9690,U+9694,U+9698-9699,U+969C,U+96A7,U+96B6,U+96BE,U+96C0-96C1,U+96C4-96C7,U+96CC-96CD,U+96CF,U+96D5,U+96E8,U+96EA,U+96F6-96F7,U+96F9,U+96FE,U+9700,U+9704,U+9707,U+9709,U+970D,U+9713,U+9716,U+971C,U+971E,U+9732,U+9738-9739,U+9752,U+9756,U+9759}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.j.woff2)format(\"woff2\");unicode-range:U+9179,U+917F,U+9187,U+9189,U+918B,U+918D,U+9190,U+9192,U+919A-919B,U+91BA,U+91C7,U+91C9-91CA,U+91CC-91CF,U+91D1,U+91DC,U+9274,U+93D6,U+9488-9489,U+948E,U+9492-9493,U+9497,U+9499,U+949D-94A3,U+94A5-94A9,U+94AE,U+94B1,U+94B3,U+94B5,U+94BB,U+94BE,U+94C0-94C3,U+94C5-94C6,U+94DC-94DD,U+94E1,U+94E3,U+94EC-94ED,U+94F0-94F2,U+94F6,U+94F8,U+94FA,U+94FE,U+9500-9501,U+9504-9505,U+9508,U+950B-950C,U+9510-9511,U+9517,U+9519-951A,U+9521,U+9523-9526,U+9528,U+952D-9530,U+9539,U+953B,U+9540-9541,U+9547,U+954A,U+954D,U+9550-9551,U+955C,U+9563,U+956D}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.k.woff2)format(\"woff2\");unicode-range:U+9001-9003,U+9005-9006,U+9009-900A,U+900D,U+900F-9012,U+9014,U+9017,U+901A-901B,U+901D-9022,U+902E,U+9038,U+903B-903C,U+903E,U+9041-9042,U+9044,U+9047,U+904D,U+904F-9053,U+9057,U+905B,U+9062-9063,U+9065,U+9068,U+906D-906E,U+9075,U+907D,U+907F-9080,U+9082-9083,U+908B,U+9091,U+9093,U+9099,U+90A2-90A3,U+90A6,U+90AA,U+90AE-90AF,U+90B1,U+90B5,U+90B8-90B9,U+90BB,U+90C1,U+90CA,U+90CE,U+90D1,U+90DD,U+90E1,U+90E7-90E8,U+90ED,U+90F4,U+90F8,U+90FD,U+9102,U+9119,U+9149,U+914B-914D,U+9152,U+9157,U+915A,U+915D-915E,U+9161,U+9163,U+9165,U+916A,U+916C,U+916E,U+9171,U+9175-9178}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.l.woff2)format(\"woff2\");unicode-range:U+8E44,U+8E47-8E48,U+8E4A-8E4B,U+8E51,U+8E59,U+8E66,U+8E6C-8E6D,U+8E6F,U+8E72,U+8E74,U+8E76,U+8E7F,U+8E81,U+8E87,U+8E8F,U+8EAB-8EAC,U+8EAF,U+8EB2,U+8EBA,U+8F66-8F69,U+8F6C,U+8F6E-8F72,U+8F74,U+8F7B,U+8F7D,U+8F7F,U+8F83-8F8A,U+8F8D-8F8E,U+8F90-8F91,U+8F93,U+8F95-8F99,U+8F9B-8F9C,U+8F9E-8F9F,U+8FA3,U+8FA8-8FA9,U+8FAB,U+8FB0-8FB1,U+8FB9,U+8FBD-8FBE,U+8FC1-8FC2,U+8FC4-8FC5,U+8FC7-8FC8,U+8FCE,U+8FD0-8FD1,U+8FD3-8FD5,U+8FD8-8FD9,U+8FDB-8FDF,U+8FE2,U+8FE6,U+8FE8,U+8FEA-8FEB,U+8FED,U+8FF0,U+8FF3,U+8FF7-8FF9,U+8FFD,U+9000}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.m.woff2)format(\"woff2\");unicode-range:U+8D24-8D31,U+8D34-8D35,U+8D37-8D3F,U+8D41-8D45,U+8D48,U+8D4A-8D4C,U+8D4E-8D50,U+8D54,U+8D56,U+8D58,U+8D5A-8D5B,U+8D5D-8D5E,U+8D60-8D64,U+8D66-8D67,U+8D6B,U+8D70,U+8D74-8D77,U+8D81,U+8D85,U+8D8A-8D8B,U+8D9F,U+8DA3,U+8DB3-8DB4,U+8DB8,U+8DBE-8DBF,U+8DC3-8DC4,U+8DCB-8DCC,U+8DD1,U+8DD7,U+8DDB,U+8DDD,U+8DDF,U+8DE4,U+8DE8,U+8DEA,U+8DEF,U+8DF3,U+8DF5,U+8DF7,U+8DFA-8DFB,U+8E09-8E0A,U+8E0C,U+8E0F,U+8E1D-8E1E,U+8E22,U+8E29-8E2A,U+8E2E,U+8E31,U+8E35,U+8E39,U+8E42}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.n.woff2)format(\"woff2\");unicode-range:U+8BC9-8BCD,U+8BCF,U+8BD1,U+8BD3,U+8BD5,U+8BD7-8BD8,U+8BDA-8BDB,U+8BDD-8BDE,U+8BE0-8BE9,U+8BEB-8BF5,U+8BF7-8BF8,U+8BFA-8BFB,U+8BFD-8C01,U+8C03-8C06,U+8C08,U+8C0A-8C0B,U+8C0D-8C13,U+8C15,U+8C17,U+8C19-8C1C,U+8C22-8C24,U+8C26-8C2A,U+8C2C-8C2D,U+8C30-8C35,U+8C37,U+8C41,U+8C46,U+8C4C,U+8C61-8C62,U+8C6A-8C6B,U+8C79-8C7A,U+8C82,U+8C89,U+8C8C,U+8D1D-8D1F,U+8D21-8D23}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.o.woff2)format(\"woff2\");unicode-range:U+889C,U+88A4,U+88AB,U+88AD,U+88B1,U+88C1-88C2,U+88C5-88C6,U+88C9,U+88D4-88D5,U+88D8-88D9,U+88DF,U+88E3-88E4,U+88E8,U+88F1,U+88F3-88F4,U+88F8-88F9,U+88FE,U+8902,U+8910,U+8912-8913,U+891A-891B,U+8921,U+8925,U+892A-892B,U+8934,U+8936,U+8941,U+8944,U+895E-895F,U+8966,U+897F,U+8981,U+8986,U+89C1-89C2,U+89C4-89C6,U+89C8-89CB,U+89CE,U+89D0-89D2,U+89E3,U+89E5-89E6,U+8A00,U+8A07,U+8A79,U+8A89-8A8A,U+8A93,U+8B66,U+8B6C,U+8BA1-8BAB,U+8BAD-8BB0,U+8BB2-8BB3,U+8BB6-8BBA,U+8BBC-8BC1,U+8BC4-8BC6,U+8BC8}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.p.woff2)format(\"woff2\");unicode-range:U+8695,U+869C,U+86A3-86A4,U+86A7,U+86AA,U+86AF,U+86B1,U+86C0,U+86C6-86C7,U+86CA-86CB,U+86D0,U+86D4,U+86D9,U+86DB,U+86DF,U+86E4,U+86EE,U+86F0,U+86F9,U+86FE,U+8700,U+8702-8703,U+8708-8709,U+870D,U+8712-8713,U+8715,U+8717-8718,U+871A,U+871C,U+8721,U+8725,U+8734,U+8737,U+873B,U+873F,U+8747,U+8749,U+874C,U+874E,U+8757,U+8759,U+8760,U+8763,U+8774,U+8776,U+877C,U+8782-8783,U+8785,U+878D,U+8793,U+879F,U+87AF,U+87B3,U+87BA,U+87C6,U+87CA,U+87D1-87D2,U+87E0,U+87E5,U+87F9,U+87FE,U+8815,U+8822,U+8839,U+8840,U+8845,U+884C-884D,U+8854,U+8857,U+8859,U+8861,U+8863,U+8865,U+8868,U+886B-886C,U+8870,U+8877,U+887D-887F,U+8881-8882,U+8884-8885,U+8888,U+888B,U+888D,U+8892,U+8896}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.q.woff2)format(\"woff2\");unicode-range:U+83DC-83DD,U+83E0,U+83E9,U+83F1-83F2,U+8403-8404,U+840B-840E,U+841D,U+8424-8428,U+843D,U+8451,U+8457,U+8459,U+845B,U+8461,U+8463,U+8469,U+846B-846C,U+8471,U+8475,U+847A,U+8482,U+848B,U+8499,U+849C,U+84B2,U+84B8,U+84BF,U+84C4,U+84C9,U+84D1,U+84D6,U+84DD,U+84DF,U+84E6,U+84EC,U+8511,U+8513,U+8517,U+851A,U+851F,U+8521,U+852B-852C,U+8537,U+853B-853D,U+8549-854A,U+8559,U+8574,U+857E,U+8584,U+8587,U+858F,U+859B,U+85AA,U+85AF-85B0,U+85C9,U+85CF-85D0,U+85D3,U+85D5,U+85E4,U+85E9,U+85FB,U+8611,U+8638,U+864E-8651,U+8654,U+865A,U+865E,U+866B-866C,U+8671,U+8679,U+867D-867E,U+8680-8682,U+868A,U+868C-868D,U+8693}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.r.woff2)format(\"woff2\");unicode-range:U+8273,U+827A,U+827E,U+8282,U+828A-828B,U+828D,U+8292,U+8299,U+829C-829D,U+82A5-82A6,U+82A9,U+82AB-82AD,U+82AF,U+82B1,U+82B3,U+82B7-82B9,U+82BD,U+82C7,U+82CD,U+82CF,U+82D1,U+82D3-82D4,U+82D7,U+82DB,U+82DE-82DF,U+82E3,U+82E5-82E6,U+82EB,U+82EF,U+82F1,U+82F9,U+82FB,U+8301-8305,U+8309,U+830E,U+8314,U+8317,U+8327-8328,U+832B-832C,U+832F,U+8335-8336,U+8338-8339,U+8340,U+8346-8347,U+8349,U+834F-8352,U+8354,U+835A,U+835C,U+8361,U+8363-8364,U+8367,U+836B,U+836F,U+8377,U+837C,U+8386,U+8389,U+838E,U+8393,U+839E,U+83A0,U+83AB,U+83B1-83B4,U+83B7,U+83B9-83BA,U+83BD,U+83C1,U+83C5,U+83C7,U+83CA,U+83CC,U+83CF}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.s.woff2)format(\"woff2\");unicode-range:U+80DE,U+80E1,U+80E7,U+80EA-80EB,U+80ED,U+80EF-80F0,U+80F3-80F4,U+80F6,U+80F8,U+80FA,U+80FD,U+8102,U+8106,U+8109-810A,U+810D,U+810F-8111,U+8113-8114,U+8116,U+8118,U+811A,U+812F,U+8131,U+8138,U+813E,U+8146,U+814A-814C,U+8150-8151,U+8154-8155,U+8165,U+816E,U+8170,U+8174,U+8179-817C,U+817E-8180,U+818A,U+818F,U+8198,U+819B-819D,U+81A8,U+81B3,U+81BA-81BB,U+81C0,U+81C2-81C3,U+81C6,U+81CA,U+81E3,U+81EA,U+81EC-81ED,U+81F3-81F4,U+81FB-81FC,U+81FE,U+8200,U+8205-8206,U+820C-820D,U+8210,U+8212,U+8214,U+821C,U+821E-821F,U+822A-822C,U+8230-8231,U+8235-8239,U+8247,U+8258,U+826F-8270,U+8272}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.t.woff2)format(\"woff2\");unicode-range:U+7F72,U+7F81,U+7F8A,U+7F8C,U+7F8E,U+7F94,U+7F9A,U+7F9E,U+7FA1,U+7FA4,U+7FB2,U+7FB8-7FB9,U+7FBD,U+7FC1,U+7FC5,U+7FCC,U+7FCE,U+7FD4-7FD5,U+7FD8,U+7FDF-7FE1,U+7FE6,U+7FE9,U+7FF0-7FF1,U+7FF3,U+7FFB-7FFC,U+8000-8001,U+8003,U+8005,U+800C-800D,U+8010,U+8012,U+8015,U+8017-8019,U+8027,U+802A,U+8033,U+8036-8038,U+803B,U+803D,U+803F,U+8042,U+8046,U+804A-804C,U+8052,U+8054,U+8058,U+805A,U+806A,U+807F,U+8083-8084,U+8086-8087,U+8089,U+808B-808C,U+8096,U+8098,U+809A-809B,U+809D,U+80A0-80A2,U+80A4-80A5,U+80A9-80AA,U+80AE-80AF,U+80B2,U+80B4,U+80BA,U+80BE-80C1,U+80C3-80C4,U+80C6,U+80CC,U+80CE,U+80D6,U+80DA-80DC}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.u.woff2)format(\"woff2\");unicode-range:U+7EB5-7EBA,U+7EBD,U+7EBF,U+7EC2-7ECA,U+7ECD-7ED5,U+7ED8-7EDF,U+7EE1-7EE3,U+7EE5-7EE7,U+7EE9-7EEB,U+7EED,U+7EEF-7EF0,U+7EF3-7EF8,U+7EFC-7EFD,U+7EFF-7F00,U+7F04-7F09,U+7F0E-7F0F,U+7F13-7F16,U+7F18,U+7F1A,U+7F1C-7F1D,U+7F1F-7F22,U+7F24-7F26,U+7F28-7F2A,U+7F2D-7F2E,U+7F30,U+7F34,U+7F38,U+7F3A,U+7F42,U+7F50-7F51,U+7F54-7F55,U+7F57,U+7F5A,U+7F61-7F62,U+7F69-7F6A,U+7F6E}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.v.woff2)format(\"woff2\");unicode-range:U+7B4C,U+7B4F-7B52,U+7B54,U+7B56,U+7B5B,U+7B5D,U+7B75,U+7B77,U+7B79,U+7B7E,U+7B80,U+7B8D,U+7B94-7B95,U+7B97,U+7BA1,U+7BA9-7BAB,U+7BAD,U+7BB1,U+7BB8,U+7BC6-7BC7,U+7BD1,U+7BD3,U+7BD9,U+7BDD,U+7BE1,U+7BEE,U+7BF1,U+7BF7,U+7BFE,U+7C07,U+7C0C,U+7C27,U+7C2A,U+7C38,U+7C3F,U+7C41,U+7C4D,U+7C73,U+7C7B,U+7C7D,U+7C89,U+7C92,U+7C95,U+7C97-7C98,U+7C9F,U+7CA4-7CA5,U+7CAA,U+7CAE,U+7CB1,U+7CB3,U+7CB9,U+7CBC-7CBE,U+7CC5,U+7CCA,U+7CD5-7CD7,U+7CD9,U+7CDC,U+7CDF-7CE0,U+7CEF,U+7CFB,U+7D0A,U+7D20,U+7D22,U+7D27,U+7D2B,U+7D2F,U+7D6E,U+7E41,U+7E82,U+7EA0-7EA4,U+7EA6-7EA8,U+7EAA-7EAD,U+7EAF-7EB3}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.w.woff2)format(\"woff2\");unicode-range:U+7981,U+7984-7985,U+798F,U+79B9,U+79BB,U+79BD-79BE,U+79C0-79C1,U+79C3,U+79C6,U+79C9,U+79CB,U+79CD,U+79D1-79D2,U+79D8,U+79DF,U+79E3-79E4,U+79E6-79E7,U+79E9,U+79EF-79F0,U+79F8,U+79FB,U+79FD,U+7A00,U+7A0B,U+7A0D-7A0E,U+7A14,U+7A17,U+7A1A,U+7A20,U+7A33,U+7A37,U+7A39,U+7A3B-7A3D,U+7A3F,U+7A46,U+7A51,U+7A57,U+7A74,U+7A76-7A77,U+7A79-7A7A,U+7A7F,U+7A81,U+7A83-7A84,U+7A88,U+7A8D,U+7A91-7A92,U+7A95-7A98,U+7A9C-7A9D,U+7A9F,U+7AA5-7AA6,U+7ABF,U+7ACB,U+7AD6,U+7AD9,U+7ADE-7AE0,U+7AE3,U+7AE5-7AE6,U+7AED,U+7AEF,U+7AF9,U+7AFD,U+7AFF,U+7B03,U+7B06,U+7B08,U+7B0B,U+7B11,U+7B14,U+7B19,U+7B1B,U+7B20,U+7B26,U+7B28,U+7B2C,U+7B3A,U+7B3C,U+7B49,U+7B4B}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.x.woff2)format(\"woff2\");unicode-range:U+77AA,U+77AC,U+77B0,U+77B3,U+77B5,U+77BB,U+77BF,U+77D7,U+77DB-77DC,U+77E2-77E3,U+77E5,U+77E9,U+77EB,U+77ED-77EE,U+77F3,U+77FD-77FF,U+7801-7802,U+780C-780D,U+7812,U+7814,U+7816,U+781A,U+781D,U+7823,U+7825,U+7827,U+7830,U+7834,U+7837-7838,U+783A,U+783E,U+7840,U+7845,U+784C,U+7852,U+7855,U+785D,U+786B-786C,U+786E,U+787C,U+7887,U+7889,U+788C-788E,U+7891,U+7897-7898,U+789C,U+789F,U+78A5,U+78A7,U+78B0-78B1,U+78B3-78B4,U+78BE,U+78C1,U+78C5,U+78CA-78CB,U+78D0,U+78D5,U+78E8,U+78EC,U+78F7,U+78FA,U+7901,U+7934,U+793A,U+793C,U+793E,U+7940-7941,U+7948,U+7956-7957,U+795A-795B,U+795D-7960,U+7965,U+7968,U+796D,U+796F,U+7977-7978,U+797A,U+7980}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.y.woff2)format(\"woff2\");unicode-range:U+761F,U+7624,U+7626,U+7629-762B,U+7634-7635,U+7638,U+763E,U+764C,U+7656,U+765E,U+7663,U+766B,U+7678,U+767B,U+767D-767E,U+7682,U+7684,U+7686-7688,U+768B,U+768E,U+7691,U+7693,U+7696,U+7699,U+76AE,U+76B1,U+76B4,U+76BF,U+76C2,U+76C5-76C6,U+76C8,U+76CA,U+76CE-76D2,U+76D4,U+76D6-76D8,U+76DB,U+76DF,U+76EE-76EF,U+76F2,U+76F4,U+76F8-76F9,U+76FC,U+76FE,U+7701,U+7708-7709,U+770B,U+771F-7720,U+7726,U+7728-7729,U+772F,U+7736-7738,U+773A,U+773C,U+7740-7741,U+7750-7751,U+775A-775B,U+7761,U+7763,U+7765-7766,U+7768,U+776B-776C,U+7779,U+777D,U+777F,U+7784-7785,U+778C,U+778E,U+7791-7792,U+779F-77A0,U+77A5,U+77A7,U+77A9}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.z.woff2)format(\"woff2\");unicode-range:U+7435-7436,U+743C,U+7455,U+7459-745A,U+745C,U+745E-745F,U+7470,U+7476,U+7480,U+7483,U+7487,U+749C,U+749E,U+74A7-74A8,U+74DC,U+74E2-74E4,U+74E6,U+74EE,U+74F6-74F7,U+7504,U+7518,U+751A,U+751C,U+751F,U+7525,U+7528-7529,U+752B-752D,U+7530-7533,U+7535,U+7537-7538,U+753B,U+7545,U+754C,U+754F,U+7554,U+7559,U+755C,U+7565-7566,U+756A,U+7574,U+7578,U+7583,U+7586,U+758F,U+7591,U+7597,U+7599-759A,U+759F,U+75A1,U+75A4-75A5,U+75AB,U+75AE-75B2,U+75B4-75B5,U+75B9,U+75BC-75BE,U+75C5,U+75C7-75CA,U+75CD,U+75D2,U+75D4-75D5,U+75D8,U+75DB,U+75DE,U+75E2-75E3,U+75E8,U+75EA,U+75F0,U+75F4,U+75F9,U+7600-7601}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aa.woff2)format(\"woff2\");unicode-range:U+725F,U+7261-7262,U+7267,U+7269,U+7272,U+7275,U+7279-727A,U+7280-7281,U+7284,U+728A,U+7292,U+729F,U+72AC,U+72AF,U+72B6-72B9,U+72C1-72C2,U+72C4,U+72C8,U+72CE,U+72D0,U+72D2,U+72D7,U+72D9,U+72DE,U+72E0-72E1,U+72E9,U+72EC-72F2,U+72F7-72F8,U+72FC,U+730A,U+730E,U+7316,U+731B-731D,U+7322,U+7325,U+7329-732C,U+732E,U+7334,U+733E-733F,U+7350,U+7357,U+7360,U+736D,U+7384,U+7387,U+7389,U+738B,U+7396,U+739B,U+73A9,U+73AB,U+73AF-73B0,U+73B2,U+73B7,U+73BA-73BB,U+73C0,U+73C8,U+73CA,U+73CD,U+73D0-73D1,U+73D9,U+73E0,U+73ED,U+7403,U+7405-7406,U+7409-740A,U+740F-7410,U+741A,U+7422,U+7425,U+742A,U+7433-7434}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ab.woff2)format(\"woff2\");unicode-range:U+706D,U+706F-7070,U+7075-7076,U+7078,U+707C,U+707E-707F,U+7089-708A,U+708E,U+7092,U+7094-7096,U+7099,U+70AB-70AF,U+70B1,U+70B3,U+70B8-70B9,U+70BC-70BD,U+70C1-70C3,U+70C8,U+70CA,U+70D8-70D9,U+70DB,U+70DF,U+70E4,U+70E6-70E7,U+70E9,U+70EB-70ED,U+70EF,U+70F7,U+70F9,U+70FD,U+7109-710A,U+7115,U+7119-711A,U+7126,U+7130-7131,U+7136,U+714C,U+714E,U+715E,U+7164,U+7166-7168,U+716E,U+7172-7173,U+717D,U+7184,U+718A,U+718F,U+7194,U+7198-7199,U+719F-71A0,U+71A8,U+71AC,U+71B9,U+71C3,U+71CE,U+71D5,U+71E5,U+7206,U+722A,U+722C,U+7231,U+7235-7239,U+723D,U+7247-7248,U+724C-724D,U+7252,U+7259,U+725B}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ac.woff2)format(\"woff2\");unicode-range:U+6DF7,U+6DF9,U+6DFB,U+6E05,U+6E0A,U+6E0D-6E0E,U+6E10,U+6E14,U+6E17,U+6E1A,U+6E1D,U+6E20-6E21,U+6E23-6E25,U+6E29,U+6E2D,U+6E2F,U+6E32,U+6E34,U+6E38,U+6E3A,U+6E43,U+6E4D,U+6E56,U+6E58,U+6E5B,U+6E6E,U+6E7E-6E7F,U+6E83,U+6E85,U+6E89,U+6E90,U+6E9C,U+6EA2,U+6EA5,U+6EAA,U+6EAF,U+6EB6,U+6EBA,U+6EC1,U+6EC7,U+6ECB,U+6ED1,U+6ED3-6ED5,U+6EDA,U+6EDE,U+6EE1,U+6EE4-6EE6,U+6EE8-6EE9,U+6EF4,U+6F02,U+6F06,U+6F09,U+6F0F,U+6F13-6F15,U+6F20,U+6F29-6F2B,U+6F31,U+6F33,U+6F3E,U+6F46-6F47,U+6F4D,U+6F58,U+6F5C,U+6F5E,U+6F62,U+6F66,U+6F6D-6F6E,U+6F84,U+6F88-6F89,U+6F8E,U+6F9C,U+6FA1,U+6FB3,U+6FB9,U+6FC0,U+6FD1-6FD2,U+6FE1,U+7011,U+701A,U+7023,U+704C,U+706B}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ad.woff2)format(\"woff2\");unicode-range:U+6CCC,U+6CD3,U+6CD5,U+6CDB,U+6CDE,U+6CE1-6CE3,U+6CE5,U+6CE8,U+6CEA-6CEB,U+6CEF-6CF1,U+6CF3,U+6CF5,U+6CFB-6CFE,U+6D01,U+6D0B,U+6D12,U+6D17,U+6D1B,U+6D1E,U+6D25,U+6D27,U+6D2A,U+6D31-6D32,U+6D3B-6D3E,U+6D41,U+6D43,U+6D45-6D47,U+6D4A-6D4B,U+6D4E-6D4F,U+6D51,U+6D53,U+6D59-6D5A,U+6D63,U+6D66,U+6D69-6D6A,U+6D6E,U+6D74,U+6D77-6D78,U+6D82,U+6D85,U+6D88-6D89,U+6D8C,U+6D8E,U+6D93,U+6D95,U+6D9B,U+6D9D,U+6D9F-6DA1,U+6DA3-6DA4,U+6DA6-6DAA,U+6DAE-6DAF,U+6DB2,U+6DB5,U+6DB8,U+6DC0,U+6DC4-6DC7,U+6DCB-6DCC,U+6DD1,U+6DD6,U+6DD8-6DD9,U+6DE1,U+6DE4,U+6DEB-6DEC,U+6DEE,U+6DF1,U+6DF3}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ae.woff2)format(\"woff2\");unicode-range:U+6B92,U+6B96,U+6B9A,U+6BA1,U+6BB4-6BB5,U+6BB7,U+6BBF,U+6BC1,U+6BC5,U+6BCB,U+6BCD,U+6BCF,U+6BD2,U+6BD4-6BD7,U+6BD9,U+6BDB,U+6BE1,U+6BEB,U+6BEF,U+6C05,U+6C0F,U+6C11,U+6C13-6C14,U+6C16,U+6C1B,U+6C1F,U+6C22,U+6C24,U+6C26-6C28,U+6C2E-6C30,U+6C32,U+6C34,U+6C38,U+6C3D,U+6C40-6C42,U+6C47,U+6C49,U+6C50,U+6C55,U+6C57,U+6C5B,U+6C5D-6C61,U+6C64,U+6C68-6C6A,U+6C70,U+6C72,U+6C76,U+6C79,U+6C7D-6C7E,U+6C81-6C83,U+6C86,U+6C88-6C89,U+6C8C,U+6C8F-6C90,U+6C93,U+6C99,U+6C9B,U+6C9F,U+6CA1,U+6CA4-6CA7,U+6CAA-6CAB,U+6CAE,U+6CB3,U+6CB8-6CB9,U+6CBB-6CBF,U+6CC4-6CC5,U+6CC9-6CCA}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.af.woff2)format(\"woff2\");unicode-range:U+68AD,U+68AF-68B0,U+68B3,U+68B5,U+68C0,U+68C2,U+68C9,U+68CB,U+68CD,U+68D2,U+68D5,U+68D8,U+68DA,U+68E0,U+68EE,U+68F1,U+68F5,U+68FA,U+6905,U+690D-690E,U+6912,U+692D,U+6930,U+693D,U+693F,U+6942,U+6954,U+6957,U+695A,U+695E,U+6963,U+696B,U+6977-6978,U+697C,U+6982,U+6984,U+6986,U+6994,U+699C,U+69A8,U+69AD,U+69B4,U+69B7,U+69BB,U+69C1,U+69CC,U+69D0,U+69DB,U+69FD,U+69FF,U+6A0A,U+6A1F,U+6A21,U+6A2A,U+6A31,U+6A35,U+6A3D,U+6A44,U+6A47,U+6A58-6A59,U+6A61,U+6A71,U+6A80,U+6A84,U+6A8E,U+6A90,U+6AAC,U+6B20-6B23,U+6B27,U+6B32,U+6B3A,U+6B3E,U+6B47,U+6B49,U+6B4C,U+6B62-6B67,U+6B6A,U+6B79,U+6B7B-6B7C,U+6B81,U+6B83-6B84,U+6B86-6B87,U+6B89-6B8B}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ag.woff2)format(\"woff2\");unicode-range:U+6756,U+675C,U+675E-6761,U+6765,U+6768,U+676D,U+676F-6770,U+6773,U+6775,U+6777,U+677C,U+677E-677F,U+6781,U+6784,U+6787,U+6789,U+6790,U+6795,U+6797,U+679A,U+679C-679D,U+67A2-67A3,U+67AA-67AB,U+67AD,U+67AF-67B0,U+67B6-67B7,U+67C4,U+67CF-67D4,U+67D9-67DA,U+67DC,U+67DE,U+67E0,U+67E5,U+67E9,U+67EC,U+67EF,U+67F1,U+67F3-67F4,U+67FF-6800,U+6805,U+6807-6808,U+680B,U+680F,U+6811,U+6813,U+6816-6817,U+6821,U+6829-682A,U+6837-6839,U+683C-683D,U+6840,U+6842-6843,U+6845-6846,U+6848,U+684C,U+6850-6851,U+6853-6854,U+6863,U+6865,U+6868-6869,U+6874,U+6876,U+6881,U+6885-6886,U+6893,U+6897,U+68A2,U+68A6-68A8}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ah.woff2)format(\"woff2\");unicode-range:U+65F7,U+65FA,U+6602,U+6606,U+660A,U+660C,U+660E-660F,U+6613-6614,U+6619,U+661D,U+661F-6620,U+6625,U+6627-6628,U+662D,U+662F,U+6631,U+6635,U+663C,U+663E,U+6643,U+664B-664C,U+664F,U+6652-6653,U+6655-6657,U+665A,U+6664,U+6666,U+6668,U+666E-6670,U+6674,U+6676-6677,U+667A,U+667E,U+6682,U+6684,U+6687,U+668C,U+6691,U+6696-6697,U+669D,U+66A7,U+66AE,U+66B4,U+66D9,U+66DC-66DD,U+66E6,U+66F0,U+66F2-66F4,U+66F9,U+66FC,U+66FE-6700,U+6708-6709,U+670B,U+670D,U+6714-6715,U+6717,U+671B,U+671D,U+671F,U+6726,U+6728,U+672A-672D,U+672F,U+6731,U+6734-6735,U+673A,U+673D,U+6740,U+6742-6743,U+6746,U+6748-6749,U+674E-6751}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ai.woff2)format(\"woff2\");unicode-range:U+6467,U+6469,U+6478-6479,U+6482,U+6485,U+6487,U+6491-6492,U+6495,U+649E,U+64A4,U+64A9,U+64AC-64AE,U+64B0,U+64B5,U+64B8,U+64BA,U+64BC,U+64C2,U+64C5,U+64CD-64CE,U+64D2,U+64D8,U+64DE,U+64E2,U+64E6,U+6500,U+6512,U+6518,U+6525,U+652B,U+652F,U+6536,U+6538-6539,U+653B,U+653E-653F,U+6545,U+6548,U+654C,U+654F,U+6551,U+6555-6556,U+6559,U+655B,U+655D-655E,U+6562-6563,U+6566,U+656C,U+6570,U+6572,U+6574,U+6577,U+6587,U+658B-658C,U+6590-6591,U+6593,U+6597,U+6599,U+659C,U+659F,U+65A1,U+65A4-65A5,U+65A7,U+65A9,U+65AB,U+65AD,U+65AF-65B0,U+65B9,U+65BD,U+65C1,U+65C4-65C5,U+65CB-65CC,U+65CF,U+65D7,U+65E0,U+65E2,U+65E5-65E9,U+65EC-65ED,U+65F1,U+65F6}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aj.woff2)format(\"woff2\");unicode-range:U+6323-6325,U+6328,U+632A-632B,U+632F,U+6332,U+633A,U+633D,U+6342,U+6345-6346,U+6349,U+634B-6350,U+6355,U+635E-635F,U+6361-6363,U+6367,U+636E,U+6371,U+6376-6377,U+637A-637B,U+6380,U+6382,U+6387-6389,U+638C,U+638F-6390,U+6392,U+6396,U+6398,U+63A0,U+63A2-63A3,U+63A5,U+63A7-63AA,U+63AC,U+63B0,U+63B3-63B4,U+63B7-63B8,U+63BA,U+63C4,U+63C9,U+63CD,U+63CF-63D0,U+63D2,U+63D6,U+63E1,U+63E3,U+63E9-63EA,U+63ED,U+63F4,U+63F6,U+63FD,U+6400-6402,U+6405,U+640F-6410,U+6413-6414,U+641C,U+641E,U+6421,U+642A,U+642C-642D,U+643A,U+643D,U+6441,U+6444,U+6446-6448,U+644A,U+6452,U+6454,U+6458,U+645E}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ak.woff2)format(\"woff2\");unicode-range:U+6258,U+625B,U+6263,U+6266-6267,U+6269-6270,U+6273,U+6276,U+6279,U+627C,U+627E-6280,U+6284,U+6289-628A,U+6291-6293,U+6295-6298,U+629A-629B,U+62A0-62A2,U+62A4-62A5,U+62A8,U+62AB-62AC,U+62B1,U+62B5,U+62B9,U+62BC-62BD,U+62BF,U+62C2,U+62C4-62CA,U+62CC-62CE,U+62D0,U+62D2-62D4,U+62D6-62D9,U+62DB-62DC,U+62DF,U+62E2-62E3,U+62E5-62E9,U+62EC-62ED,U+62EF,U+62F1,U+62F3-62F4,U+62F7,U+62FC-62FF,U+6301-6302,U+6307,U+6309,U+630E,U+6311,U+6316,U+631A-631B,U+631D-6321}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.al.woff2)format(\"woff2\");unicode-range:U+60CB,U+60D1,U+60D5,U+60D8,U+60DA,U+60DC,U+60DF-60E0,U+60E6-60E9,U+60EB-60F0,U+60F3-60F4,U+60F6,U+60F9-60FA,U+6101,U+6108-6109,U+610E-610F,U+6115,U+611A,U+611F-6120,U+6123-6124,U+6127,U+612B,U+613F,U+6148,U+614A,U+614C,U+614E,U+6151,U+6155,U+6162,U+6167-6168,U+6170,U+6175,U+6177,U+618B,U+618E,U+6194,U+61A7-61A9,U+61AC,U+61BE,U+61C2,U+61C8,U+61CA,U+61D1-61D2,U+61D4,U+61E6,U+61F5,U+61FF,U+6208,U+620A,U+620C-6212,U+6216,U+6218,U+621A-621B,U+621F,U+622A,U+622C,U+622E,U+6233-6234,U+6237,U+623E-6241,U+6247-6249,U+624B,U+624D-624E,U+6251-6254}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.am.woff2)format(\"woff2\");unicode-range:U+5FCC-5FCD,U+5FCF-5FD2,U+5FD6-5FD9,U+5FDD,U+5FE0-5FE1,U+5FE4,U+5FE7,U+5FEA-5FEB,U+5FF1,U+5FF5,U+5FFB,U+5FFD-6002,U+6005-6006,U+600D-600F,U+6012,U+6014-6016,U+6019,U+601C-601D,U+6020-6021,U+6025-6028,U+602A,U+602F,U+6035,U+603B-603C,U+6041,U+6043,U+604B,U+604D,U+6050,U+6052,U+6055,U+6059-605A,U+6062-6064,U+6068-606D,U+606F-6070,U+6073,U+6076,U+6078-607C,U+607F,U+6084,U+6089,U+608C-608D,U+6094,U+6096,U+609A,U+609F-60A0,U+60A3,U+60A6,U+60A8,U+60AC,U+60AF,U+60B1-60B2,U+60B4,U+60B8,U+60BB-60BC,U+60C5-60C6,U+60CA}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.an.woff2)format(\"woff2\");unicode-range:U+5E7F,U+5E84,U+5E86-5E87,U+5E8A,U+5E8F-5E90,U+5E93-5E97,U+5E99-5E9A,U+5E9C,U+5E9E-5E9F,U+5EA6-5EA7,U+5EAD,U+5EB5-5EB8,U+5EC9-5ECA,U+5ED1,U+5ED3,U+5ED6,U+5EF6-5EF7,U+5EFA,U+5F00,U+5F02-5F04,U+5F08,U+5F0A-5F0B,U+5F0F,U+5F11,U+5F13,U+5F15,U+5F17-5F18,U+5F1B,U+5F1F-5F20,U+5F25-5F27,U+5F29,U+5F2F,U+5F31,U+5F39-5F3A,U+5F52-5F53,U+5F55,U+5F57,U+5F5D,U+5F62,U+5F64,U+5F66,U+5F69-5F6A,U+5F6C-5F6D,U+5F70-5F71,U+5F77,U+5F79,U+5F7B-5F7C,U+5F80-5F81,U+5F84-5F85,U+5F87-5F8B,U+5F90,U+5F92,U+5F95,U+5F97-5F98,U+5FA1,U+5FA8,U+5FAA,U+5FAD-5FAE,U+5FB5,U+5FB7,U+5FBC-5FBD,U+5FC3,U+5FC5-5FC6}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ao.woff2)format(\"woff2\");unicode-range:U+5C7F,U+5C81-5C82,U+5C8C,U+5C94,U+5C96-5C97,U+5C9A-5C9B,U+5CA9,U+5CAD,U+5CB3,U+5CB8,U+5CBF,U+5CCB,U+5CD9,U+5CE1,U+5CE5-5CE6,U+5CE8,U+5CEA,U+5CED,U+5CF0,U+5CFB,U+5D02,U+5D07,U+5D0E,U+5D14,U+5D16,U+5D1B,U+5D24,U+5D29,U+5D2D,U+5D34,U+5D3D,U+5D4C,U+5D58,U+5D6C,U+5D82,U+5D99,U+5DC5,U+5DCD,U+5DDD-5DDE,U+5DE1-5DE2,U+5DE5-5DE9,U+5DEB,U+5DEE,U+5DF1-5DF4,U+5DF7,U+5DFE,U+5E01-5E03,U+5E05-5E06,U+5E08,U+5E0C,U+5E10-5E11,U+5E15-5E16,U+5E18,U+5E1A-5E1D,U+5E26-5E27,U+5E2D-5E2E,U+5E37-5E38,U+5E3C-5E3D,U+5E42,U+5E44-5E45,U+5E4C,U+5E54-5E55,U+5E61-5E62,U+5E72-5E74,U+5E76,U+5E78,U+5E7A-5E7D}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ap.woff2)format(\"woff2\");unicode-range:U+5B85,U+5B87-5B89,U+5B8B-5B8C,U+5B8F,U+5B95,U+5B97-5B9E,U+5BA0-5BA4,U+5BA6,U+5BAA-5BAB,U+5BB0,U+5BB3-5BB6,U+5BB9,U+5BBD-5BBF,U+5BC2,U+5BC4-5BC7,U+5BCC,U+5BD0,U+5BD2-5BD3,U+5BDD-5BDF,U+5BE1,U+5BE4-5BE5,U+5BE8,U+5BF0,U+5BF8-5BFC,U+5BFF,U+5C01,U+5C04,U+5C06,U+5C09-5C0A,U+5C0F,U+5C11,U+5C14,U+5C16,U+5C18,U+5C1A,U+5C1D,U+5C24,U+5C27,U+5C2C,U+5C31,U+5C34,U+5C38-5C3A,U+5C3C-5C42,U+5C45,U+5C48-5C4B,U+5C4E-5C51,U+5C55,U+5C5E,U+5C60-5C61,U+5C65,U+5C6F,U+5C71,U+5C79}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aq.woff2)format(\"woff2\");unicode-range:U+5996,U+5999,U+599E,U+59A5,U+59A8-59AA,U+59AE,U+59B2,U+59B9,U+59BB,U+59BE,U+59C6,U+59CB,U+59D0-59D1,U+59D3-59D4,U+59D7-59D8,U+59DA,U+59DC-59DD,U+59E3,U+59E5,U+59E8,U+59EC,U+59F9,U+59FB,U+59FF,U+5A01,U+5A03-5A04,U+5A06-5A07,U+5A11,U+5A13,U+5A18,U+5A1C,U+5A1F-5A20,U+5A25,U+5A29,U+5A31-5A32,U+5A34,U+5A36,U+5A3C,U+5A40,U+5A46,U+5A49-5A4A,U+5A5A,U+5A62,U+5A6A,U+5A74,U+5A76-5A77,U+5A7F,U+5A92,U+5A9A-5A9B,U+5AB2-5AB3,U+5AC1-5AC2,U+5AC9,U+5ACC,U+5AD4,U+5AD6,U+5AE1,U+5AE3,U+5AE6,U+5AE9,U+5B09,U+5B34,U+5B37,U+5B40,U+5B50,U+5B54-5B55,U+5B57-5B59,U+5B5C-5B5D,U+5B5F,U+5B63-5B64,U+5B66,U+5B69-5B6A,U+5B6C,U+5B70-5B71,U+5B75,U+5B7A,U+5B7D,U+5B81,U+5B83}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ar.woff2)format(\"woff2\");unicode-range:U+57CE,U+57D4,U+57DF-57E0,U+57F9-57FA,U+5800,U+5802,U+5806,U+5811,U+5815,U+5821,U+5824,U+582A,U+5830,U+5835,U+584C,U+5851,U+5854,U+5858,U+585E,U+586B,U+587E,U+5883,U+5885,U+5892-5893,U+5899,U+589E-589F,U+58A8-58A9,U+58C1,U+58D1,U+58D5,U+58E4,U+58EB-58EC,U+58EE,U+58F0,U+58F3,U+58F6,U+58F9,U+5904,U+5907,U+590D,U+590F,U+5915-5916,U+5919-591A,U+591C,U+591F,U+5927,U+5929-592B,U+592D-592F,U+5931,U+5934,U+5937-593A,U+5942,U+5944,U+5947-5949,U+594B,U+594E-594F,U+5951,U+5954-5957,U+595A,U+5960,U+5962,U+5965,U+5973-5974,U+5976,U+5978-5979,U+597D,U+5981-5984,U+5986-5988,U+598A,U+598D,U+5992-5993}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.as.woff2)format(\"woff2\");unicode-range:U+561B,U+561E-561F,U+5624,U+562D,U+5631-5632,U+5634,U+5636,U+5639,U+563B,U+563F,U+564C,U+564E,U+5654,U+5657,U+5659,U+565C,U+5662,U+5664,U+5668-566C,U+5676,U+567C,U+5685,U+568E-568F,U+5693,U+56A3,U+56B7,U+56BC,U+56CA,U+56D4,U+56DA-56DB,U+56DE,U+56E0,U+56E2,U+56E4,U+56ED,U+56F0-56F1,U+56F4,U+56F9-56FA,U+56FD-56FF,U+5703,U+5706,U+5708-5709,U+571F,U+5723,U+5728,U+572D,U+5730,U+573A,U+573E,U+5740,U+5747,U+574A,U+574D-5751,U+5757,U+575A-575B,U+575D-5761,U+5764,U+5766,U+5768,U+576A,U+576F,U+5773,U+5777,U+5782-5784,U+578B,U+5792,U+579B,U+57A0,U+57A2-57A3,U+57A6,U+57AB,U+57AE,U+57C2-57C3,U+57CB}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.at.woff2)format(\"woff2\");unicode-range:U+54E5-54EA,U+54ED-54EE,U+54F2,U+54FA,U+54FC-54FD,U+5501,U+5506-5507,U+5509,U+550F-5510,U+5514,U+5520,U+5522,U+5524,U+5527,U+552C,U+552E-5531,U+5533,U+553E-553F,U+5543-5544,U+5546,U+554A,U+5550,U+5555-5556,U+555C,U+5561,U+5564-5567,U+556A,U+556C,U+556E,U+5575,U+5577-5578,U+557B-557C,U+557E,U+5580,U+5582-5584,U+5587,U+5589-558B,U+558F,U+5591,U+5594,U+5598-5599,U+559C-559D,U+559F,U+55A7,U+55B3,U+55B7,U+55BB,U+55BD,U+55C5,U+55D1-55D4,U+55D6,U+55DC-55DD,U+55DF,U+55E1,U+55E3-55E6,U+55E8,U+55EB-55EC,U+55EF,U+55F7,U+55FD,U+5600-5601,U+5608-5609,U+560E,U+5618}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.au.woff2)format(\"woff2\");unicode-range:U+5411,U+5413,U+5415,U+5417,U+541B,U+541D-5420,U+5426-5429,U+542B-542F,U+5431,U+5434-5435,U+5438-5439,U+543B-543C,U+543E,U+5440,U+5443,U+5446,U+5448,U+544A,U+5450,U+5453,U+5455,U+5457-5458,U+545B-545C,U+5462,U+5464,U+5466,U+5468,U+5471-5473,U+5475,U+5478,U+547B-547D,U+5480,U+5482,U+5484,U+5486,U+548B-548C,U+548E-5490,U+5492,U+5494-5496,U+5499-549B,U+54A4,U+54A6-54AD,U+54AF,U+54B1,U+54B3,U+54B8,U+54BB,U+54BD,U+54BF-54C2,U+54C4,U+54C6-54C9,U+54CD-54CE,U+54D0-54D2,U+54D5,U+54D7,U+54DA,U+54DD,U+54DF}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.av.woff2)format(\"woff2\");unicode-range:U+5348-534A,U+534E-534F,U+5351-5353,U+5355-5357,U+535A,U+535C,U+535E-5362,U+5364,U+5366-5367,U+536B,U+536F-5371,U+5373-5375,U+5377-5378,U+537F,U+5382,U+5384-5386,U+5389,U+538B-538C,U+5395,U+5398,U+539A,U+539F,U+53A2,U+53A5-53A6,U+53A8-53A9,U+53AE,U+53BB,U+53BF,U+53C1-53C2,U+53C8-53CD,U+53D1,U+53D4,U+53D6-53D9,U+53DB,U+53DF-53E0,U+53E3-53E6,U+53E8-53F3,U+53F6-53F9,U+53FC-53FD,U+5401,U+5403-5404,U+5408-540A,U+540C-5410}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.aw.woff2)format(\"woff2\");unicode-range:U+5207,U+520A,U+520D-520E,U+5211-5212,U+5217-521B,U+521D,U+5220,U+5224,U+5228-5229,U+522B,U+522D-522E,U+5230,U+5236-523B,U+523D,U+5241-5243,U+524A,U+524C-524D,U+5250-5251,U+5254,U+5256,U+525C,U+5265,U+5267,U+5269-526A,U+526F,U+5272,U+527D,U+527F,U+5288,U+529B,U+529D-52A1,U+52A3,U+52A8-52AB,U+52AD,U+52B1-52B3,U+52BE-52BF,U+52C3,U+52C7,U+52C9,U+52CB,U+52D0,U+52D2,U+52D8,U+52DF,U+52E4,U+52FA,U+52FE-5300,U+5305-5306,U+5308,U+530D,U+5310,U+5315-5317,U+5319,U+531D,U+5320-5321,U+5323,U+532A,U+532E,U+5339-533B,U+533E-533F,U+5341,U+5343,U+5347}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ax.woff2)format(\"woff2\");unicode-range:U+50CF,U+50D6,U+50DA,U+50E7,U+50EE,U+50F3,U+50F5,U+50FB,U+5106,U+510B,U+5112,U+5121,U+513F-5141,U+5143-5146,U+5148-5149,U+514B,U+514D,U+5151,U+5154,U+515A,U+515C,U+5162,U+5165,U+5168,U+516B-516E,U+5170-5171,U+5173-5179,U+517B-517D,U+5180,U+5185,U+5188-5189,U+518C-518D,U+5192,U+5195,U+5197,U+5199,U+519B-519C,U+51A0,U+51A2,U+51A4-51A5,U+51AC,U+51AF-51B0,U+51B2-51B3,U+51B5-51B7,U+51BB,U+51BD,U+51C0,U+51C4,U+51C6,U+51C9,U+51CB-51CC,U+51CF,U+51D1,U+51DB,U+51DD,U+51E0-51E1,U+51E4,U+51ED,U+51EF-51F0,U+51F3,U+51F6,U+51F8-51FB,U+51FD,U+51FF-5201,U+5203,U+5206}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.ay.woff2)format(\"woff2\");unicode-range:U+4F60,U+4F63,U+4F65,U+4F69,U+4F6C,U+4F6F-4F70,U+4F73-4F74,U+4F7B-4F7C,U+4F7F,U+4F83-4F84,U+4F88,U+4F8B,U+4F8D,U+4F97,U+4F9B,U+4F9D,U+4FA0,U+4FA3,U+4FA5-4FAA,U+4FAC,U+4FAE-4FAF,U+4FB5,U+4FBF,U+4FC3-4FC5,U+4FCA,U+4FCE-4FD1,U+4FD7-4FD8,U+4FDA,U+4FDD-4FDE,U+4FE1,U+4FE6,U+4FE8-4FE9,U+4FED-4FEF,U+4FF1,U+4FF8,U+4FFA,U+4FFE,U+500C-500D,U+500F,U+5012,U+5014,U+5018-501A,U+501C,U+501F,U+5021,U+5026,U+5028-502A,U+502D,U+503A,U+503C,U+503E,U+5043,U+5047-5048,U+504C,U+504E-504F,U+5055,U+505A,U+505C,U+5065,U+5076-5077,U+507B,U+507F-5080,U+5085,U+5088,U+508D,U+50A3,U+50A5,U+50A8,U+50AC,U+50B2,U+50BB}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.az.woff2)format(\"woff2\");unicode-range:U+4E94-4E95,U+4E98,U+4E9A-4E9B,U+4E9F,U+4EA1-4EA2,U+4EA4-4EA9,U+4EAB-4EAE,U+4EB2,U+4EB5,U+4EBA,U+4EBF-4EC1,U+4EC3-4EC7,U+4ECA-4ECB,U+4ECD-4ECE,U+4ED1,U+4ED3-4ED9,U+4EDE-4EDF,U+4EE3-4EE5,U+4EE8,U+4EEA,U+4EEC,U+4EF0,U+4EF2,U+4EF5-4EF7,U+4EFB,U+4EFD,U+4EFF,U+4F01,U+4F0A,U+4F0D-4F11,U+4F17-4F1A,U+4F1E-4F20,U+4F22,U+4F24-4F26,U+4F2A-4F2B,U+4F2F-4F30,U+4F34,U+4F36,U+4F38,U+4F3A,U+4F3C-4F3D,U+4F43,U+4F46,U+4F4D-4F51,U+4F53,U+4F55,U+4F58-4F59,U+4F5B-4F5E}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a0.woff2)format(\"woff2\");unicode-range:U+D7,U+E0-E1,U+E8-EA,U+EC-ED,U+F2-F3,U+F7,U+F9-FA,U+FC,U+2014,U+2018-2019,U+201C-201D,U+3001-3002,U+300A-300B,U+3010-3011,U+4E00-4E01,U+4E03,U+4E07-4E0B,U+4E0D-4E0E,U+4E10-4E11,U+4E13-4E14,U+4E16,U+4E18-4E1E,U+4E22,U+4E24-4E25,U+4E27,U+4E2A-4E2B,U+4E2D,U+4E30,U+4E32,U+4E34,U+4E38-4E3B,U+4E3D-4E3E,U+4E43,U+4E45,U+4E48-4E49,U+4E4B-4E50,U+4E52-4E54,U+4E56,U+4E58-4E59,U+4E5C-4E61,U+4E66,U+4E70-4E71,U+4E73,U+4E7E,U+4E86,U+4E88-4E89,U+4E8B-4E8C,U+4E8E-4E8F,U+4E91-4E93}@font-face{font-family:HarmonyOS_Medium;font-style:normal;font-weight:500;font-display:swap;src:url(//s1.hdslb.com/bfs/static/jinkela/long/font/HarmonyOS_Medium.a1.woff2)format(\"woff2\");unicode-range:U+21-7E,U+A4,U+A7-A8,U+B0-B1,U+B7}");
	var index_scss_default$8 = _virtual_monkey_style_tools_default("html[hide-dynamic-page-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[hide-dynamic-page-fixed-header] aside.right section.sticky{top:15px!important}html[exchange-dynamic-page-left-right-aside] aside.left{order:3;margin-right:0!important}html[exchange-dynamic-page-left-right-aside] main{order:2}html[exchange-dynamic-page-left-right-aside] aside.right{order:1;margin-right:12px!important}html[exchange-dynamic-page-left-right-aside] .bili-dyn-sidebar{order:4}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:first-child{width:48px!important;height:48px!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:nth-child(2),html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers:nth-child(2) .b-avatar__layer.center,html[hide-dynamic-page-bili-dyn-avatar-icon] .bili-dyn-list .b-avatar__layer:not(.center),html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-ornament,html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-item__ornament,html[hide-dynamic-page-bili-dyn-dispute] .bili-dyn-content__dispute,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__orig__topic,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__forw__topic{display:none!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic{color:inherit!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic:hover{color:var(--brand_blue)!important}html[hide-dynamic-page-bili-dyn-item-interaction] .bili-dyn-item__interaction{display:none!important}html[hide-dynamic-page-bili-dyn-card-reserve] .bili-dyn-list__item:has(.bili-dyn-card-reserve){display:none!important}:is(html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-dyn-card-goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-rich-text-module.goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has([data-type=goods])){display:none!important}html[hide-dynamic-page-bili-dyn-lottery] .bili-dyn-list__item:has([data-type=lottery]){display:none!important}html[hide-dynamic-page-bili-dyn-forward] .bili-dyn-list__item:has(.bili-dyn-content__orig.reference){display:none!important}html[hide-dynamic-page-bili-dyn-vote] .bili-dyn-list__item:has(.bili-dyn-card-vote){display:none!important}html[hide-dynamic-page-bili-dyn-live] .bili-dyn-list__item:has(.bili-dyn-card-live){display:none!important}html[hide-dynamic-page-bili-dyn-blocked] .bili-dyn-list__item:has(.dyn-blocked-mask,.bili-dyn-upower-common){display:none!important}html[hide-dynamic-page-bili-dyn-charge-video] .bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*=qcRJ6sJU91]){display:none!important}html[dynamic-page-unfold-dynamic-content] .bili-dyn-list__item:not(:has(.dyn-card-opus__title)) .bili-rich-text .bili-rich-text__content{max-height:unset!important;-webkit-line-clamp:unset!important}html[dynamic-page-unfold-dynamic-content] .bili-dyn-list__item:not(:has(.dyn-card-opus__title)) .bili-rich-text .bili-rich-text__action{display:none!important}html[hide-dynamic-page-bili-dyn-publishing] .bili-dyn-publishing{display:none!important}html[hide-dynamic-page-bili-dyn-publishing] main section:first-child{margin-bottom:0!important}html[hide-dynamic-page-up-list] section:has(.bili-dyn-up-list){display:none!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__content{grid-template-rows:auto auto!important;grid-auto-flow:column!important;display:grid!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__content .shim{display:none!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__item{height:auto!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__window{padding:10px!important}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__nav__btn{zoom:1.4;transition:background-color .1s linear}html[dynamic-page-up-list-dual-line-mode] .bili-dyn-up-list__nav__btn:hover{color:#fff!important;background-color:#00aeec!important}html[dynamic-page-up-list-checked-item-opacity] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){opacity:.25;transition:opacity .2s ease-out}html[dynamic-page-up-list-checked-item-opacity] .bili-dyn-up-list__item:hover{opacity:1!important;transition:opacity .1s linear!important}@keyframes disappear{0%{opacity:1;width:68px;margin-right:6px}99%{opacity:0;width:0;margin-right:0}to{opacity:0;width:0;margin-right:0;display:none}}html[dynamic-page-up-list-checked-item-hide] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){animation:.5s 1s forwards disappear}@supports ((-moz-appearance:none)){html[dynamic-page-up-list-checked-item-hide] .bili-dyn-up-list__item:not(.active):has(.bili-dyn-up-list__item__face .bili-dyn-up-list__item__face__img:only-child){display:none}}html[hide-dynamic-page-bili-dyn-list-tabs] .bili-dyn-list-tabs{display:none!important}html[hide-dynamic-page-bili-dyn-list-tabs] .bili-dyn-list{margin-top:0!important}html[hide-dynamic-page-bili-dyn-my-info] aside.left section,html[hide-dynamic-page-bili-dyn-live-users__item__living] .bili-dyn-live-users__item__living,html[hide-dynamic-page-aside-left] aside.left{display:none!important}html[hide-dynamic-page-aside-left] .bili-dyn-home--member{justify-content:center!important}html[hide-dynamic-page-aside-left] #app:has(.bili-dyn-home--member){min-width:fit-content}html[hide-dynamic-page-bili-dyn-banner] .bili-dyn-banner{display:none!important}html[hide-dynamic-page-bili-dyn-ads] section:has(.bili-dyn-ads){display:none!important}html[hide-dynamic-page-bili-dyn-ads] aside.right section{margin-bottom:0!important}html[hide-dynamic-page-bili-dyn-ads] aside.right section.sticky{top:72px}html[hide-dynamic-page-bili-dyn-topic-box] .bili-dyn-topic-box,html[hide-dynamic-page-bili-dyn-topic-box] .bili-dyn-search-trendings,html[hide-dynamic-page-bili-dyn-topic-box] .topic-panel,html[hide-dynamic-page-aside-right] aside.right{display:none!important}html[hide-dynamic-page-aside-right] .bili-dyn-home--member{justify-content:center!important}html[hide-dynamic-page-aside-right] #app:has(.bili-dyn-home--member){min-width:fit-content}html[dynamic-list-width] #app:has(.bili-dyn-home--member){min-width:fit-content!important}html[dynamic-list-width] #app:has(.bili-dyn-home--member) main{width:max(556px, var(--dynamic-list-width))!important}html[dynamic-detail-width] #app:has(.opus-detail){min-width:fit-content!important}html[dynamic-detail-width] #app:has(.opus-detail) .opus-detail{width:max(708px, var(--dynamic-detail-width))!important}html[dynamic-detail-width] #app:has(.opus-detail) .opus-detail .right-sidebar-wrap{margin-left:calc(max(708px, var(--dynamic-detail-width)) + 10px)!important}html[dynamic-detail-width] #app:has(.card .bili-dyn-item){min-width:fit-content!important}html[dynamic-detail-width] #app:has(.card .bili-dyn-item) .content{width:max(556px, var(--dynamic-detail-width))!important}html[hide-dynamic-page-sidebar-old-version] .bili-dyn-sidebar .bili-dyn-sidebar__btn:first-child{visibility:hidden!important}html[hide-dynamic-page-sidebar-old-version] .opus-detail .side-toolbar__bottom .side-toolbar__btn:not(.backtop){display:none!important}html[hide-dynamic-page-sidebar-back-to-top] .bili-dyn-sidebar .bili-dyn-sidebar__btn:last-child{visibility:hidden!important}");
	var index_scss_default$7 = _virtual_monkey_style_tools_default("html[video-page-danmaku-font-family] .bili-danmaku-x-dm,html[video-page-danmaku-font-family] .bili-dm,html[video-page-danmaku-font-family] .bili-dm *{font-family:var(--video-page-danmaku-font-family)!important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm,html[video-page-danmaku-font-weight] .bili-dm,html[video-page-danmaku-font-weight] .bili-dm *{font-weight:var(--video-page-danmaku-font-weight)!important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:#0000!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-sug,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-carousel,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-popup,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area,html[video-page-hide-bpx-player-sending-area] #bilibili-player-placeholder-bottom{display:none!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])){aspect-ratio:16/9;height:unset!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])) #bilibili-player{aspect-ratio:16/9;height:unset!important}html[video-page-hide-bpx-player-sending-area] .page-main-content:has(.festival-video-player) .video-player-box{height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player{height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player #bilibili-player:not(.mode-webscreen){height:calc(100% - 46px)!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info{color:#fffc!important;width:unset!important;margin-bottom:1px!important;margin-right:16px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-online,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-online{font-size:14px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-divide,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-divide{display:none}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 16px!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-hide-bpx-player-bili-guide-all] .bili-follow-to-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-animate,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-cyc,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-followed,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-gray,html[video-page-hide-bpx-player-bili-vote] .bili-vote,html[video-page-hide-bpx-player-bili-vote] .bili-danmaku-x-vote,html[video-page-hide-bpx-player-bili-qoe-feedback] .bpx-player-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-score,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-vote,html[video-page-hide-bpx-player-bili-score] .bili-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-superRating,html[video-page-hide-bpx-player-bili-score-sum] .bili-scoreSum,html[video-page-hide-bpx-player-bili-score-sum] .bili-danmaku-x-scoreSum,html[video-page-hide-bpx-player-bili-clock] .bili-clock,html[video-page-hide-bpx-player-bili-clock] .bili-danmaku-x-clock,html[video-page-hide-bpx-player-bili-cmtime] .bili-cmtime,html[video-page-hide-bpx-player-bili-cmtime] .bili-danmaku-x-cmtime,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-cmd-shrink,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-danmaku-x-cmd-shrink,html[video-page-hide-bpx-player-bili-reserve] .bili-reserve,html[video-page-hide-bpx-player-bili-reserve] .bili-danmaku-x-reserve,html[video-page-hide-bpx-player-bili-link] .bili-link,html[video-page-hide-bpx-player-bili-link] .bili-danmaku-x-link,html[video-page-hide-bpx-player-cmd-dm-wrap] .bpx-player-cmd-dm-wrap,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-left-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[video-page-hide-bpx-player-top-left-music] .bpx-player-top-left-music,html[video-page-hide-bpx-player-top-left-follow] .bpx-player-top-left-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-related{display:none!important}html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-content{align-items:center!important;display:flex!important}html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-dm .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-image:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:unset!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-bpx-player-bili-dm-normal-white] .bili-danmaku-x-dm,html[video-page-bpx-player-bili-dm-normal-white] .bili-dm{--color:white!important}html[video-page-subtitle-font-color] .bpx-player-subtitle-panel-text{color:var(--video-page-subtitle-font-color)!important}html[video-page-subtitle-font-family] .bpx-player-subtitle-panel-text{font-family:var(--video-page-subtitle-font-family)!important}html[video-page-subtitle-font-weight] .bpx-player-subtitle-panel-text{font-weight:var(--video-page-subtitle-font-weight)!important}html[video-page-subtitle-text-stroke-color] .bpx-player-subtitle-panel-text{background:unset!important;background-color:var(--video-page-subtitle-text-stroke-color)!important;-webkit-background-clip:text!important;background-clip:text!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=normal],[data-screen=wide]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-moz-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-ms-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=web],[data-screen=full]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-moz-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-ms-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-viewpoint] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-shadow-progress-area-fullscreen] #bilibili-player [data-screen=full][data-ctrl-hidden=true] .bpx-player-shadow-progress-area{opacity:1!important;visibility:visible!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}");
	var index_scss_default$6 = _virtual_monkey_style_tools_default("html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar,html[homepage-hide-banner] #app .bili-header .bili-header__bar{position:fixed;background:var(--bg1,white)!important;transition:unset!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar.slide-down,html[homepage-hide-banner] #app .bili-header .bili-header__bar.slide-down{animation:none!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry),html[homepage-hide-banner] #app .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry){color:var(--text1,#18191c)!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar .left-entry .zhuzhan-icon,html[homepage-hide-banner] #app .bili-header .bili-header__bar .left-entry .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon,html[homepage-hide-banner] #app .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon{color:var(--text1,#18191c)!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text,html[homepage-hide-banner] #app .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:var(--text2,#61666d)!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__banner,html[homepage-hide-banner] #app .bili-header .bili-header__banner{min-height:unset!important;background:var(--bg1,white)!important;height:64px!important}html[homepage-hide-banner] #i_cecream .bili-header .bili-header__banner>*,html[homepage-hide-banner] #app .bili-header .bili-header__banner>*{display:none!important}html[homepage-hide-recommend-swipe] .recommended-swipe{visibility:hidden!important;pointer-events:none!important;opacity:0!important;width:0!important;height:0!important;position:absolute!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>:nth-of-type(n+5){margin-top:0!important}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .feed-card:nth-of-type(n+9),html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .feed-card:nth-of-type(n+12){display:initial}html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container>:nth-of-type(n+13),html[homepage-hide-recommend-swipe] .recommended-container_floor-aside .container .floor-single-card:first-of-type{margin-top:0!important}html[homepage-hide-subarea] .bili-header{margin-bottom:20px!important}html[homepage-hide-subarea] .bili-header .bili-header__channel{display:none!important}html[homepage-hide-subarea] body:has(.bilibili-gate-root) .bili-header{margin-bottom:15px!important}html[homepage-hide-subarea] body:has(.bilibili-gate-root) .bili-header .bili-header__channel{display:none!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar{background:0 0;transition:none!important;position:absolute!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar.slide-down{box-shadow:none!important;animation:none!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry,.zhuzhan-icon),html[homepage-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon,html[homepage-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:#fff}html[homepage-hide-sticky-header] #i_cecream .header-channel,html[homepage-hide-sticky-header] #app .header-channel,html[homepage-hide-sticky-header] .bilibili-gate-root [data-role=tab-bar-wrapper]{top:0!important}html[homepage-hide-sticky-subarea] #i_cecream .header-channel,html[homepage-hide-sticky-subarea] #app .header-channel{display:none!important}html[homepage-hide-sticky-subarea] #i_cecream .bili-header__bar:not(.slide-down),html[homepage-hide-sticky-subarea] #app .bili-header__bar:not(.slide-down){transition:background-color .2s linear}html[homepage-hide-sticky-subarea] #i_cecream .bili-feed4 .bili-header .slide-down,html[homepage-hide-sticky-subarea] #app .bili-feed4 .bili-header .slide-down{animation:.3s linear forwards headerSlideDown!important}html[homepage-hide-adblock-tips] .adblock-tips,html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic svg,html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic picture{display:none!important}html[homepage-revert-channel-dynamic-icon] .bili-header__channel .channel-icons .icon-bg__dynamic:after{content:\"\";background-image:url(\"data:image/svg+xml,<svg width=\\\"22\\\" height=\\\"23\\\" viewBox=\\\"0 0 22 23\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" class=\\\"icon-bg--icon\\\" data-v-674f5b07=\\\"\\\"> <path d=\\\"M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path> <path d=\\\"M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z\\\" stroke=\\\"white\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"></path></svg>\");background-position:50%;background-repeat:no-repeat;background-size:contain;width:25px;height:25px}html[homepage-layout=\"2\"] #i_cecream .recommended-container_floor-aside .container,html[homepage-layout=\"2\"] #app .recommended-container_floor-aside .container{grid-template-columns:repeat(2,1fr)!important}html[homepage-layout=\"3\"] #i_cecream .recommended-container_floor-aside .container,html[homepage-layout=\"3\"] #app .recommended-container_floor-aside .container{grid-template-columns:repeat(3,1fr)!important}html[homepage-layout=\"4\"] #i_cecream .recommended-container_floor-aside .container,html[homepage-layout=\"4\"] #app .recommended-container_floor-aside .container{grid-template-columns:repeat(4,1fr)!important}html[homepage-layout=\"5\"] #i_cecream .recommended-container_floor-aside .container,html[homepage-layout=\"5\"] #app .recommended-container_floor-aside .container{grid-template-columns:repeat(5,1fr)!important}html[homepage-layout=\"6\"] #i_cecream .recommended-container_floor-aside .container,html[homepage-layout=\"6\"] #app .recommended-container_floor-aside .container{grid-template-columns:repeat(6,1fr)!important}html[homepage-layout-padding] .bili-feed4-layout,html[homepage-layout-padding] .bili-feed4 .bili-header .bili-header__channel{padding:0 var(--homepage-layout-padding,initial)!important;width:100%!important}html[homepage-increase-rcmd-list-font-size] main .bili-video-card .bili-video-card__info--tit,html[homepage-increase-rcmd-list-font-size] main .bili-live-card .bili-live-card__info--tit,html[homepage-increase-rcmd-list-font-size] main .single-card.floor-card .title{font-size:16px!important}html[homepage-increase-rcmd-list-font-size] main .bili-video-card .bili-video-card__info--bottom,html[homepage-increase-rcmd-list-font-size] main .floor-card .sub-title.sub-title,html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats,html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats .bili-video-card__stats--left,html[homepage-increase-rcmd-list-font-size] main .bili-video-card__stats .bili-video-card__stats--right{font-size:14px!important}html[homepage-move-no-interest] main .bili-video-card__info--no-interest{top:unset!important;bottom:0!important}html[homepage-move-no-interest] main .bili-video-card__info--bottom{padding-right:20px!important}html[homepage-move-no-interest] main .bili-video-card.enable-no-interest,html[homepage-move-no-interest] main .bili-live-card.enable-no-interest,html[homepage-hide-no-interest] main .bili-video-card.enable-no-interest,html[homepage-hide-no-interest] main .bili-live-card.enable-no-interest{--title-padding-right:0}html[homepage-hide-no-interest] main .bili-video-card__info--no-interest,html[homepage-hide-no-interest] main .bili-live-card__info--no-interest{display:none!important}html[homepage-hide-up-info-icon] main .bili-video-card .bili-video-card__info--icon-text{width:17px;height:17px;color:#0000!important;background-color:unset!important;border-radius:unset!important;font-size:0!important;line-height:unset!important;padding:unset!important;-webkit-user-select:none!important;user-select:none!important;margin:0 2px 0 0!important}html[homepage-hide-up-info-icon] main .bili-video-card .bili-video-card__info--icon-text:before{content:\"\";background-image:url(\"data:image/svg+xml,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" xmlns:xlink=\\\"http://www.w3.org/1999/xlink\\\" viewBox=\\\"0 0 24 24\\\" width=\\\"24\\\" height=\\\"24\\\" fill=\\\"currentColor\\\" class=\\\"bili-video-card__info--owner__up\\\"><!--[--><path d=\\\"M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z\\\" fill=\\\"rgb(148, 153, 160)\\\"></path><path d=\\\"M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z\\\" fill=\\\"rgb(148, 153, 160)\\\"></path><path d=\\\"M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z\\\" fill=\\\"rgb(148, 153, 160)\\\"></path><!--]--></svg>\");background-position:50%;background-repeat:no-repeat;background-size:contain;width:100%;height:100%;display:inline-block}html[homepage-hide-video-info-date] main .bili-video-card__info--date,html[homepage-hide-danmaku-count] main .bili-video-card__stats--item:nth-child(2),html[homepage-hide-bili-watch-later-tip] main .bili-watch-later__tip--lab,html[homepage-hide-inline-player-danmaku] main .bpx-player-row-dm-wrap,html[homepage-hide-inline-player-danmaku] main .bpx-player-cmd-dm-wrap{display:none!important}html[homepage-hide-ad-card] main :is(.feed-card,.bili-video-card,.bili-feed-card):not(.bilibili-gate-video-card):has(.bili-video-card__info--ad,[href*=\"cm.bilibili.com\"],.bili-video-card__info--creative-ad,.vui_icon.bili-video-card__stats--icon,.bili-video-card__info--owner:not([href*=\"space.bilibili.com\"])){display:none!important}html[homepage-hide-ad-card] main :is(.feed-card,.bili-video-card,.bili-feed-card):not(:has(.bili-video-card__wrap,.bili-video-card__skeleton)){display:none!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>:nth-of-type(n+5){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .feed-card:nth-of-type(n+9){display:initial}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container>:nth-of-type(n+13){margin-top:0!important}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .feed-card:nth-of-type(n+12){display:initial}html[homepage-hide-ad-card] main .recommended-container_floor-aside .container .floor-single-card:first-of-type{margin-top:0!important}:is(html[homepage-hide-live-card-recommend] main .bili-live-card,html[homepage-hide-live-card-recommend] main .bili-feed-card:has(.bili-live-card),html[homepage-hide-live-card-recommend] main .floor-single-card:has([href^=\"//live.bilibili.com\"],[href^=\"live.bilibili.com\"],[href^=\"https://live.bilibili.com\"])),html[homepage-simple-sub-area-card-recommend] main .floor-single-card .layer{display:none!important}html[homepage-simple-sub-area-card-recommend] main .floor-single-card .floor-card{box-shadow:unset!important;border:none!important}html[homepage-simple-sub-area-card-recommend] main .floor-single-card .floor-card .info-container{padding:0!important}html[homepage-simple-sub-area-card-recommend] main .single-card.floor-card .floor-card-inner,html[homepage-simple-sub-area-card-recommend] main .single-card.floor-card .floor-card-inner:hover{background:0 0!important}html[homepage-hide-sub-area-card-recommend] main .floor-single-card:not(:has(.skeleton,.skeleton-item)){display:none!important}html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--light,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--light:after,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--text,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--text:after,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--face,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--face:after,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--cover,html[homepage-hide-skeleton-animation] main .bili-video-card .loading_animation .bili-video-card__skeleton--cover:after,html[homepage-hide-skeleton-animation] main :where(.floor-skeleton,.skeleton) .skeleton-item,html[homepage-hide-skeleton-animation] main :where(.floor-skeleton,.skeleton) .skeleton-item:after{animation:none!important}html[homepage-hide-skeleton-before-anchor] main .bili-video-card:not(.is-rcmd):has(~.load-more-anchor){display:none!important}html[homepage-hide-skeleton] main .load-more-anchor{visibility:hidden}html[homepage-hide-skeleton] main .container>.bili-video-card:not(.is-rcmd){display:none}html[homepage-hide-skeleton] main .container>.floor-single-card:has(.skeleton,.skeleton-item){display:none}html[homepage-increase-rcmd-load-size] main .container>.floor-single-card:has(.skeleton,.skeleton-item,.floor-skeleton){display:none}html[homepage-rcmd-video-preload] main .bili-video-card:not(.is-rcmd):has(~.load-more-anchor){display:none!important}html[homepage-rcmd-video-preload] main .floor-single-card:not(:has(.skeleton,.skeleton-item)){display:none!important}html[homepage-rcmd-video-preload] main .load-more-anchor.preload{opacity:0;position:fixed;top:-100px;left:-100px}html[homepage-hide-desktop-download-tip] .desktop-download-tip,html[homepage-hide-trial-feed-wrap] .trial-feed-wrap,html[homepage-hide-feed-roll-btn] .feed-roll-btn,html[homepage-hide-watchlater-pip-button] .watchlater-pip-button,html[homepage-hide-adcard-button] .adcard,html[homepage-hide-adcard-button] .fixed-card .btn-ad,html[homepage-hide-adcard-button] .palette-button-adcard,html[homepage-hide-adcard-button] .palette-button-wrap .adcard-content,html[homepage-hide-flexible-roll-btn-text] .palette-button-wrap .flexible-roll-btn .btn-text,html[homepage-hide-flexible-roll-btn] .palette-button-wrap .flexible-roll-btn,html[homepage-hide-feedback] .palette-button-wrap .storage-box,html[homepage-hide-top-btn] .palette-button-wrap .top-btn-wrap{display:none!important}");
	var index_scss_default$5 = _virtual_monkey_style_tools_default("html[live-page-sidebar-vm] #sidebar-vm{display:none!important}html[live-page-remove-wallpaper] .room-bg{background-image:unset!important}html[live-page-remove-wallpaper] #player-ctnr{border-radius:12px;box-shadow:0 0 12px #0003}html[live-page-remove-wallpaper] #aside-area-vm{box-shadow:0 0 12px #0003}html[live-page-width] body:not(.pure_room_root,.player-full-win) .live-room-app .app-content .app-body{width:var(--live-page-width,clamp(980px, min((100vh - 136px - 78px - 64px) * 16 / 9 + 320px + 12px + 100px, 100vw - 100px), 3420px))!important}html[live-page-flip-view] .flip-view,html[live-page-room-info-ctnr] #sections-vm .room-info-ctnr,html[live-page-room-feed] #sections-vm .room-feed,html[live-page-announcement-cntr] #sections-vm .room-detail-box,html[live-page-sections-vm] #sections-vm{display:none!important}html[live-page-sections-vm] .room-bg{min-height:99vh!important}html[live-page-header-search-btn] #nav-searchform .search-bar input{margin-right:0!important}html[live-page-header-search-btn] #nav-searchform .search-bar{padding:0 3px!important}html[live-page-header-search-btn] #nav-searchform .search-bar .nav-search-clean{right:0!important}html[live-page-header-search-btn] #nav-searchform .search-btn{display:none!important}html[live-page-nav-search-rcmd] #nav-searchform input::placeholder{visibility:hidden;opacity:0!important}html[live-page-nav-search-history] #nav-searchform .history{display:none!important}html[live-page-nav-search-trending] .search-pannel{padding:13px 0 4px!important}html[live-page-nav-search-trending] .search-pannel .trending{display:none!important}html[live-page-nav-search-trending] .search-pannel .histories-wrap{max-height:unset!important}html[live-page-nav-search-trending] .search-pannel .history-fold-wrap,html[live-page-header-search-block] #nav-searchform,html[live-page-header-entry-logo] #main-ctnr a.entry_logo[href=\"//live.bilibili.com\"]{display:none!important}html[live-page-header-entry-logo] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-entry-logo] .pre-hold-nav-logo,html[live-page-header-entry-title] #main-ctnr a.entry-title[href=\"//www.bilibili.com\"]{display:none!important}html[live-page-header-entry-title] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-entry-title] #prehold-nav-vm .nav-item:has(a[href=\"//www.bilibili.com\"]){display:none!important}html[live-page-header-live] #main-ctnr .dp-table-cell a[name=live]{display:none!important}html[live-page-header-live] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-live] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com\"]){display:none!important}html[live-page-header-net-game] #main-ctnr .dp-table-cell a[name=网游]{display:none!important}html[live-page-header-net-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-net-game] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=2&areaId=0\"]){display:none!important}html[live-page-header-mobile-game] #main-ctnr .dp-table-cell a[name=手游]{display:none!important}html[live-page-header-mobile-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-mobile-game] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=3&areaId=0\"]){display:none!important}html[live-page-header-standalone-game] #main-ctnr .dp-table-cell a[name=单机游戏]{display:none!important}html[live-page-header-standalone-game] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-game] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=6&areaId=0\"]){display:none!important}html[live-page-header-standalone-vtuber] #main-ctnr .dp-table-cell a[name=虚拟主播]{display:none!important}html[live-page-header-standalone-vtuber] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-vtuber] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=9&areaId=0\"]){display:none!important}html[live-page-header-standalone-entertainment] #main-ctnr .dp-table-cell a[name=娱乐]{display:none!important}html[live-page-header-standalone-entertainment] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-entertainment] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=1&areaId=0\"]){display:none!important}html[live-page-header-standalone-radio] #main-ctnr .dp-table-cell a[name=电台]{display:none!important}html[live-page-header-standalone-radio] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-radio] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=5&areaId=0\"]){display:none!important}html[live-page-header-standalone-match] #main-ctnr .dp-table-cell a[name=赛事]{display:none!important}html[live-page-header-standalone-match] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-match] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=13&areaId=0\"]){display:none!important}html[live-page-header-standalone-chatroom] #main-ctnr .dp-table-cell a[name=聊天室]{display:none!important}html[live-page-header-standalone-chatroom] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-chatroom] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=14&areaId=0\"]){display:none!important}html[live-page-header-standalone-living] #main-ctnr .dp-table-cell a[name=生活]{display:none!important}html[live-page-header-standalone-living] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-living] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=10&areaId=0\"]){display:none!important}html[live-page-header-standalone-knowledge] #main-ctnr .dp-table-cell a[name=知识]{display:none!important}html[live-page-header-standalone-knowledge] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-knowledge] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=11&areaId=0\"]){display:none!important}html[live-page-header-standalone-helpmeplay] #main-ctnr .dp-table-cell a[name=帮我玩]{display:none!important}html[live-page-header-standalone-helpmeplay] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-helpmeplay] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=301&areaId=0\"],a[href^=\"//live.bilibili.com/p/html/play-together-area/\"]){display:none!important}html[live-page-header-standalone-interact] #main-ctnr .dp-table-cell a[name=互动玩法]{display:none!important}html[live-page-header-standalone-interact] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-interact] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=15&areaId=0\"]){display:none!important}html[live-page-header-standalone-shopping] #main-ctnr .dp-table-cell a[name=购物]{display:none!important}html[live-page-header-standalone-shopping] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-standalone-shopping] #prehold-nav-vm .nav-item:has(a[href=\"//live.bilibili.com/p/eden/area-tags?parentAreaId=300&areaId=0\"]){display:none!important}html[live-page-header-showmore-link] #main-ctnr .showmore-link{display:none!important}html[live-page-header-showmore-link] .link-navbar-more .search-bar-ctnr{margin:0 auto!important}html[live-page-header-showmore-link] #prehold-nav-vm .nav-item:last-child,html[live-page-header-avatar] #right-part .user-panel{display:none!important}html[live-page-header-follow-panel] #right-part .shortcut-item:has(.follow-panel-set){display:none}html[live-page-header-recharge] #right-part .shortcut-item:has(.item-icon-recharge){display:none}html[live-page-header-bili-download-panel] #right-part .shortcut-item:has(.bili-download-panel,.item-icon-electronDownload){display:none}html[live-page-header-go-live] #right-part .shortcut-item:has(.download-panel-ctnr,.startlive-btn){visibility:hidden}html[live-page-head-info-avatar-pendant] #head-info-vm :is(.blive-avatar-pendant,.blive-avatar-icons),html[live-page-head-info-vm-upper-row-follow-ctnr] #head-info-vm .left-anchor-section .follow-ctnr,html[live-page-head-info-vm-upper-row-hotrank] #head-info-vm #LiveRoomHotrankEntries,html[live-page-head-info-vm-upper-row-activity] #head-info-vm .activity-entry,html[live-page-head-info-vm] #head-info-vm{display:none!important}html[live-page-head-info-vm] #player-ctnr{border-top-left-radius:12px;border-top-right-radius:12px;overflow:hidden}html[live-page-head-web-player-icon-feedback] .web-player-icon-feedback,html[live-page-head-web-player-shop-popover-vm] #shop-popover-vm,html[live-page-head-web-player-awesome-pk-vm] #pk-vm,html[live-page-head-web-player-awesome-pk-vm] #awesome-pk-vm,html[live-page-head-web-player-awesome-pk-vm] #universal-pk-vm,html[live-page-web-player-watermark] .web-player-icon-roomStatus,html[live-page-web-player-watermark] .blur-edges-ctnr{display:none!important}html[live-page-web-player-watermark] .web-player-module-area-mask{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}html[live-page-hide-web-player-background] #fullscreen-container{--first-frame-bg:unset!important}html[live-page-head-web-player-announcement-wrapper] #live-player .announcement-wrapper,html[live-page-head-web-player-game-id] #game-id,html[live-page-head-web-player-research-container] .research-container,html[live-page-head-web-player-live-lottery] #anchor-guest-box-id{display:none!important}html[live-page-head-web-player-live-lottery] .m-nobar__popup-container:has(iframe[src^=\"https://live.bilibili.com/p/html/live-lottery/lottery-user.html\"]){display:none!important}html[live-page-combo-danmaku] .danmaku-item-container>div.combo,html[live-page-combo-danmaku] .bilibili-combo-danmaku-container,html[live-page-clean-all-danmaku-small-emoji] .danmaku-item-container .bili-dm-emoji,html[live-page-clean-all-danmaku-small-emoji] .danmaku-item-container .bili-danmaku-x-dm-emoji,html[live-page-clean-all-danmaku-big-emoji] .danmaku-item-container .bili-danmaku-x-dm img[style*=width\\:45px],html[live-page-gift-control-vm] #gift-control-vm{display:none!important}html[live-page-gift-control-vm] body:not(.pure_room_root,.player-full-win) .fullscreen-container-paddingbox{border-bottom-right-radius:12px;border-bottom-left-radius:12px;overflow:hidden;height:0!important}html[live-page-gift-control-vm] body:not(.pure_room_root,.player-full-win) .fullscreen-container-paddingbox #fullscreen-container{grid-template-rows:minmax(0,1fr) auto!important}html[live-page-gift-control-vm] body:not(.pure_room_root,.player-full-win) .fullscreen-container-paddingbox #fullscreen-container .gift-control-section{display:none!important}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) #gift-control-vm:not(:has(.anchor-lottery-entry,.gift-lottery)){display:none!important}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) #gift-control-vm:has(.anchor-lottery-entry,.gift-lottery){height:0!important}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) #gift-control-vm:has(.anchor-lottery-entry,.gift-lottery) .gift-panel{display:none}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) #gift-control-vm:has(.anchor-lottery-entry,.gift-lottery) .out-part{position:fixed;top:calc(100vh - 120px);left:0;padding-right:10px!important}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) .fullscreen-container-paddingbox{border-bottom-right-radius:12px;border-bottom-left-radius:12px;overflow:hidden;height:0!important}html[live-page-gift-control-vm-show-lottery] body:not(.pure_room_root,.player-full-win) .fullscreen-container-paddingbox #fullscreen-container{grid-template-rows:minmax(0,1fr) auto!important}html[live-page-fullscreen-danmaku-vm] #fullscreen-danmaku-vm{display:none!important}html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item{padding:calc(var(--live-page-danmaku-font-size,15px) / 5) 5px!important;font-size:var(--live-page-danmaku-font-size,15px)!important}html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item .danmaku-item-right{line-height:1.3!important}html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item.chat-colorful-bubble,html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item.has-bubble{margin:2px 0!important}html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item .user-name,html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item .reply-uname,html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item .reply-uname .common-nickname-wrapper{font-size:var(--live-page-danmaku-font-size,15px)!important}html[live-page-danmaku-font-size] .chat-history-panel .chat-history-list .chat-item .card-item-middle-bottom .text,html[live-page-danmaku-font-size] #pay-note-panel-vm .card-item-middle-bottom .text{font-size:calc(var(--live-page-danmaku-font-size,15px) - 1px)!important}html[live-page-rank-list-vm-fold] #rank-list-vm{max-height:32px;transition:max-height .3s linear;overflow:hidden}html[live-page-rank-list-vm-fold] .player-full-win #rank-list-vm{border-radius:0}html[live-page-rank-list-vm-fold] #rank-list-vm:hover{max-height:178px;overflow:unset}html[live-page-rank-list-vm-fold] #rank-list-vm .tab-list .tab-item{font-size:14px!important}html[live-page-rank-list-vm-fold] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-rank-list-vm-fold] .chat-history-panel{flex:1}html[live-page-rank-list-vm-fold] .chat-history-panel .danmaku-at-prompt{bottom:160px}html[live-page-rank-list-vm] #rank-list-vm{display:none!important}html[live-page-rank-list-vm] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-rank-list-vm] .chat-history-panel{flex:1}html[live-page-rank-list-vm] .chat-history-panel .danmaku-at-prompt{bottom:160px}html[live-page-convention-msg] .convention-msg.border-box,html[live-page-convention-msg] .new-video-pk-item-dm{display:none!important}html[live-page-welcome-msg] .welcome-section-bottom{display:none}html[live-page-rank-icon] .chat-item .rank-icon,html[live-page-title-label] .chat-item .title-label,html[live-page-wealth-medal-ctnr] .chat-item .wealth-medal-ctnr,html[live-page-group-medal-ctnr] .chat-item .group-medal-ctnr,html[live-page-fans-medal-item-ctnr] .chat-item .fans-medal-item-ctnr{display:none!important}html[live-page-chat-item-background-color] .chat-item{background-color:unset!important;border-image-source:unset!important}html[live-page-chat-item-background-color] .chat-item>div[style*=\"height: 62px\"]:has(+.danmaku-item-left){display:none!important}html[live-page-chat-item-background-color] .chat-item .danmaku-item-left br,html[live-page-gift-item] .chat-item.gift-item,html[live-page-gift-item] .chat-item.common-danmuku-msg,html[live-page-bulge-danmaku] .chat-item.bulge-emoticon,html[live-page-bulge-danmaku] .chat-item.chat-emoticon,html[live-page-chat-item-top3-notice] .chat-item.top3-notice,html[live-page-brush-prompt] #brush-prompt{display:none!important}html[live-page-brush-prompt] .chat-history-panel .chat-history-list.with-brush-prompt{height:100%!important}html[live-page-combo-card] .gift-wish-card-root{display:none!important}html[live-page-combo-card] #combo-card:has(.countDownBtn){display:none!important}html[live-page-combo-card] .chat-history-panel{padding-bottom:0!important}html[live-page-combo-card] #combo-card:has(.combo-tips){display:none!important}html[live-page-combo-card] .play-together-service-card-container,html[live-page-combo-card] .vote-card,html[live-page-control-panel-icon-row] .control-panel-icon-row{display:none!important}html[live-page-control-panel-icon-row] #chat-control-panel-vm{min-height:unset!important}html[live-page-control-panel-icon-row] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-control-panel-icon-row] .chat-history-panel{flex:1}html[live-page-control-panel-icon-row] .chat-history-panel .danmaku-at-prompt{bottom:100px}html[live-page-chat-input-ctnr-medal-section] .medal-section{display:none!important}html[live-page-chat-input-ctnr-medal-section] .chat-input-new{padding:10px 5px!important}html[live-page-chat-input-ctnr-send-btn] .bottom-actions,html[live-page-chat-input-ctnr-send-btn] .send-btn-wrapper{display:none!important}html[live-page-chat-input-ctnr-send-btn] #chat-control-panel-vm{height:fit-content!important;min-height:unset!important}html[live-page-chat-input-ctnr-send-btn] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-chat-input-ctnr-send-btn] .chat-history-panel{flex:1}html[live-page-chat-input-ctnr-send-btn] .chat-history-panel .danmaku-at-prompt{bottom:120px}html[live-page-chat-input-ctnr] .chat-input-ctnr,html[live-page-chat-input-ctnr] .bottom-actions{display:none!important}html[live-page-chat-input-ctnr] #chat-control-panel-vm{height:fit-content!important;min-height:unset!important}html[live-page-chat-input-ctnr] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-chat-input-ctnr] .chat-history-panel{flex:1}html[live-page-chat-input-ctnr] .chat-history-panel .danmaku-at-prompt{bottom:70px}html[live-page-chat-control-panel] #chat-control-panel-vm{min-height:unset!important;display:none!important}html[live-page-chat-control-panel] body:not(.hide-aside-area.player-full-win) #aside-area-vm{flex-direction:column;display:flex}html[live-page-chat-control-panel] .chat-history-panel{border-bottom-right-radius:12px;border-bottom-left-radius:12px;flex:1}html[live-page-chat-control-panel] .chat-history-panel .danmaku-at-prompt{bottom:20px!important}");
	var index_scss_default$4 = _virtual_monkey_style_tools_default("html[homepage-hide-banner] #biliMainHeader{min-height:unset!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar{position:fixed;background:var(--bg1,white)!important;transition:unset!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar.slide-down{animation:none!important;box-shadow:0 2px 4px #80808026!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry){color:var(--text1,#18191c)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .left-entry .zhuzhan-icon{color:#00aeec!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon{color:var(--text1,#18191c)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:var(--text2,#61666d)!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__banner{min-height:unset!important;background:var(--bg1,white)!important;height:64px!important}html[homepage-hide-banner] #biliMainHeader .bili-header .bili-header__banner>*{display:none!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar{background:0 0;transition:none!important;position:absolute!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar.slide-down{box-shadow:none!important;animation:none!important}html[homepage-hide-sticky-header] .bili-header .bili-header__bar .left-entry :is(.entry-title,.download-entry,.default-entry,.loc-entry,.zhuzhan-icon),html[homepage-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-icon,html[homepage-hide-sticky-header] .bili-header .bili-header__bar .right-entry .right-entry__outside .right-entry-text{color:#fff}html[popular-hide-tips] .popular-list .popular-tips,html[popular-hide-tips] .rank-container .rank-tips,html[popular-hide-tips] .history-list .history-tips{display:none!important}html[popular-hide-tips] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-hide-danmaku-count] .popular-list .video-stat .like-text,html[popular-hide-danmaku-count] .weekly-list .video-stat .like-text,html[popular-hide-danmaku-count] .history-list .video-stat .like-text,html[popular-hide-danmaku-count] .rank-list .rank-item .detail-state .data-box:nth-child(2){display:none!important}html[popular-hide-danmaku-count] .rank-list .rank-item .detail-state .data-box:first-child{margin:0!important}html[popular-hide-danmaku-count] .video-card .video-stat .play-text{margin-right:0!important}html[popular-layout=\"2\"] .cm-module{display:none!important}html[popular-layout=\"2\"] .video-list,html[popular-layout=\"2\"] .popular-list .card-list,html[popular-layout=\"2\"] .history-list .card-list{grid-template-columns:auto auto;display:grid!important}html[popular-layout=\"2\"] .popular-list .card-list .video-card,html[popular-layout=\"2\"] .video-list .video-card,html[popular-layout=\"2\"] .history-list .card-list .video-card{width:unset!important}html[popular-layout=\"3\"] .cm-module{display:none!important}@media (width>=1300px) and (width<=1399.9px){html[popular-layout=\"3\"] .popular-container{max-width:1180px!important}}@media (width<=1139.9px){html[popular-layout=\"3\"] .popular-container{max-width:1020px!important}}html[popular-layout=\"3\"] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout=\"3\"] .nav-tabs{height:70px!important}html[popular-layout=\"3\"] .popular-list{padding:10px 0 0!important}html[popular-layout=\"3\"] .video-list{margin-top:15px!important}html[popular-layout=\"3\"] .popular-list .popular-tips,html[popular-layout=\"3\"] .rank-container .rank-tips,html[popular-layout=\"3\"] .history-list .history-tips,html[popular-layout=\"3\"] .popular-list .popular-tips,html[popular-layout=\"3\"] .weekly-list .weekly-hint,html[popular-layout=\"3\"] .history-list .history-hint{display:none!important}html[popular-layout=\"3\"] .card-list,html[popular-layout=\"3\"] .video-list{grid-gap:20px!important;grid-column:span 3!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"3\"] .card-list .video-card,html[popular-layout=\"3\"] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"3\"] .card-list .video-card__content,html[popular-layout=\"3\"] .video-list .video-card__content{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;aspect-ratio:16/9!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"3\"] .card-list .video-card__info,html[popular-layout=\"3\"] .video-list .video-card__info{font-size:14px;margin-top:8px!important;padding:0!important}html[popular-layout=\"3\"] .card-list .video-card__info>div,html[popular-layout=\"3\"] .video-list .video-card__info>div{justify-content:space-between!important;display:flex!important}html[popular-layout=\"3\"] .card-list .video-card__info .rcmd-tag,html[popular-layout=\"3\"] .video-list .video-card__info .rcmd-tag{display:none!important}html[popular-layout=\"3\"] .card-list .video-card__info .video-name,html[popular-layout=\"3\"] .video-list .video-card__info .video-name{height:44px!important;margin-bottom:8px!important;font-size:15px!important;font-weight:400!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"3\"] .card-list .video-card__info .up-name,html[popular-layout=\"3\"] .video-list .video-card__info .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"3\"] .card-list .video-card__info .video-stat .play-text,html[popular-layout=\"3\"] .card-list .video-card__info .video-stat .like-text,html[popular-layout=\"3\"] .video-list .video-card__info .video-stat .play-text,html[popular-layout=\"3\"] .video-list .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout=\"3\"] .rank-list{grid-gap:20px!important;grid-column:span 3!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"3\"] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"3\"] .rank-list .rank-item .content{display:unset!important;padding:unset!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .more-data{display:none!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .img{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .img .num{zoom:1.2;font-size:18px}html[popular-layout=\"3\"] .rank-list .rank-item .content .info{font-size:14px;margin-top:8px!important;margin-left:unset!important;height:unset!important;padding:0!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .info .title{height:44px!important;font-size:15px!important;font-weight:500!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .info .detail{justify-content:space-between!important;align-items:center!important;margin-top:8px!important;display:flex!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .info .detail .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .info .detail .detail-state .data-box{line-height:unset!important;margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"3\"] .rank-list .rank-item .content .info .detail .detail-state .data-box:nth-child(2){margin-left:12px!important}html[popular-layout=\"3\"] .rank-list:not(.pgc-list) .content .img{aspect-ratio:16/9!important}html[popular-layout=\"3\"] .rank-list.pgc-list .content .img{aspect-ratio:220/296!important}html[popular-layout=\"3\"] .rank-list.pgc-list .rank-item .content .info .title{margin-top:.2em;font-size:17px!important}html[popular-layout=\"3\"] .rank-list.pgc-list .rank-item .content .info .data-box{margin-top:unset!important;font-size:14px!important}html[popular-layout=\"3\"] .no-more,html[popular-layout=\"4\"] .cm-module{display:none!important}@media (width>=1300px) and (width<=1399.9px){html[popular-layout=\"4\"] .popular-container{max-width:1180px!important}}@media (width<=1139.9px){html[popular-layout=\"4\"] .popular-container{max-width:1020px!important}}html[popular-layout=\"4\"] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout=\"4\"] .nav-tabs{height:70px!important}html[popular-layout=\"4\"] .popular-list{padding:10px 0 0!important}html[popular-layout=\"4\"] .video-list{margin-top:15px!important}html[popular-layout=\"4\"] .popular-list .popular-tips,html[popular-layout=\"4\"] .rank-container .rank-tips,html[popular-layout=\"4\"] .history-list .history-tips,html[popular-layout=\"4\"] .popular-list .popular-tips,html[popular-layout=\"4\"] .weekly-list .weekly-hint,html[popular-layout=\"4\"] .history-list .history-hint{display:none!important}html[popular-layout=\"4\"] .card-list,html[popular-layout=\"4\"] .video-list{grid-gap:20px!important;grid-column:span 4!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"4\"] .card-list .video-card,html[popular-layout=\"4\"] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"4\"] .card-list .video-card__content,html[popular-layout=\"4\"] .video-list .video-card__content{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;aspect-ratio:16/9!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"4\"] .card-list .video-card__info,html[popular-layout=\"4\"] .video-list .video-card__info{font-size:14px;margin-top:8px!important;padding:0!important}html[popular-layout=\"4\"] .card-list .video-card__info>div,html[popular-layout=\"4\"] .video-list .video-card__info>div{justify-content:space-between!important;display:flex!important}html[popular-layout=\"4\"] .card-list .video-card__info .rcmd-tag,html[popular-layout=\"4\"] .video-list .video-card__info .rcmd-tag{display:none!important}html[popular-layout=\"4\"] .card-list .video-card__info .video-name,html[popular-layout=\"4\"] .video-list .video-card__info .video-name{height:44px!important;margin-bottom:8px!important;font-size:15px!important;font-weight:400!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"4\"] .card-list .video-card__info .up-name,html[popular-layout=\"4\"] .video-list .video-card__info .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"4\"] .card-list .video-card__info .video-stat .play-text,html[popular-layout=\"4\"] .card-list .video-card__info .video-stat .like-text,html[popular-layout=\"4\"] .video-list .video-card__info .video-stat .play-text,html[popular-layout=\"4\"] .video-list .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout=\"4\"] .rank-list{grid-gap:20px!important;grid-column:span 4!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"4\"] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"4\"] .rank-list .rank-item .content{display:unset!important;padding:unset!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .more-data{display:none!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .img{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .img .num{zoom:1.2;font-size:18px}html[popular-layout=\"4\"] .rank-list .rank-item .content .info{font-size:14px;margin-top:8px!important;margin-left:unset!important;height:unset!important;padding:0!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .info .title{height:44px!important;font-size:15px!important;font-weight:500!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .info .detail{justify-content:space-between!important;align-items:center!important;margin-top:8px!important;display:flex!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .info .detail .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .info .detail .detail-state .data-box{line-height:unset!important;margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"4\"] .rank-list .rank-item .content .info .detail .detail-state .data-box:nth-child(2){margin-left:12px!important}html[popular-layout=\"4\"] .rank-list:not(.pgc-list) .content .img{aspect-ratio:16/9!important}html[popular-layout=\"4\"] .rank-list.pgc-list .content .img{aspect-ratio:220/296!important}html[popular-layout=\"4\"] .rank-list.pgc-list .rank-item .content .info .title{margin-top:.2em;font-size:17px!important}html[popular-layout=\"4\"] .rank-list.pgc-list .rank-item .content .info .data-box{margin-top:unset!important;font-size:14px!important}html[popular-layout=\"4\"] .no-more,html[popular-layout=\"5\"] .cm-module{display:none!important}@media (width>=1300px) and (width<=1399.9px){html[popular-layout=\"5\"] .popular-container{max-width:1180px!important}}@media (width<=1139.9px){html[popular-layout=\"5\"] .popular-container{max-width:1020px!important}}html[popular-layout=\"5\"] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout=\"5\"] .nav-tabs{height:70px!important}html[popular-layout=\"5\"] .popular-list{padding:10px 0 0!important}html[popular-layout=\"5\"] .video-list{margin-top:15px!important}html[popular-layout=\"5\"] .popular-list .popular-tips,html[popular-layout=\"5\"] .rank-container .rank-tips,html[popular-layout=\"5\"] .history-list .history-tips,html[popular-layout=\"5\"] .popular-list .popular-tips,html[popular-layout=\"5\"] .weekly-list .weekly-hint,html[popular-layout=\"5\"] .history-list .history-hint{display:none!important}html[popular-layout=\"5\"] .card-list,html[popular-layout=\"5\"] .video-list{grid-gap:20px!important;grid-column:span 5!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"5\"] .card-list .video-card,html[popular-layout=\"5\"] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"5\"] .card-list .video-card__content,html[popular-layout=\"5\"] .video-list .video-card__content{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;aspect-ratio:16/9!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"5\"] .card-list .video-card__info,html[popular-layout=\"5\"] .video-list .video-card__info{font-size:14px;margin-top:8px!important;padding:0!important}html[popular-layout=\"5\"] .card-list .video-card__info>div,html[popular-layout=\"5\"] .video-list .video-card__info>div{justify-content:space-between!important;display:flex!important}html[popular-layout=\"5\"] .card-list .video-card__info .rcmd-tag,html[popular-layout=\"5\"] .video-list .video-card__info .rcmd-tag{display:none!important}html[popular-layout=\"5\"] .card-list .video-card__info .video-name,html[popular-layout=\"5\"] .video-list .video-card__info .video-name{height:44px!important;margin-bottom:8px!important;font-size:15px!important;font-weight:400!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"5\"] .card-list .video-card__info .up-name,html[popular-layout=\"5\"] .video-list .video-card__info .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"5\"] .card-list .video-card__info .video-stat .play-text,html[popular-layout=\"5\"] .card-list .video-card__info .video-stat .like-text,html[popular-layout=\"5\"] .video-list .video-card__info .video-stat .play-text,html[popular-layout=\"5\"] .video-list .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout=\"5\"] .rank-list{grid-gap:20px!important;grid-column:span 5!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"5\"] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"5\"] .rank-list .rank-item .content{display:unset!important;padding:unset!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .more-data{display:none!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .img{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .img .num{zoom:1.2;font-size:18px}html[popular-layout=\"5\"] .rank-list .rank-item .content .info{font-size:14px;margin-top:8px!important;margin-left:unset!important;height:unset!important;padding:0!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .info .title{height:44px!important;font-size:15px!important;font-weight:500!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .info .detail{justify-content:space-between!important;align-items:center!important;margin-top:8px!important;display:flex!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .info .detail .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .info .detail .detail-state .data-box{line-height:unset!important;margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"5\"] .rank-list .rank-item .content .info .detail .detail-state .data-box:nth-child(2){margin-left:12px!important}html[popular-layout=\"5\"] .rank-list:not(.pgc-list) .content .img{aspect-ratio:16/9!important}html[popular-layout=\"5\"] .rank-list.pgc-list .content .img{aspect-ratio:220/296!important}html[popular-layout=\"5\"] .rank-list.pgc-list .rank-item .content .info .title{margin-top:.2em;font-size:17px!important}html[popular-layout=\"5\"] .rank-list.pgc-list .rank-item .content .info .data-box{margin-top:unset!important;font-size:14px!important}html[popular-layout=\"5\"] .no-more,html[popular-layout=\"5\"] .video-stat .like-text,html[popular-layout=\"5\"] .rank-list .rank-item .detail-state .data-box:nth-child(2){display:none!important}html[popular-layout=\"5\"] .rank-list .rank-item .detail-state .data-box:first-child{margin:0!important}html[popular-layout=\"5\"] .video-card .video-stat .play-text{margin-right:0!important}html[popular-layout=\"6\"] .cm-module{display:none!important}@media (width>=1300px) and (width<=1399.9px){html[popular-layout=\"6\"] .popular-container{max-width:1180px!important}}@media (width<=1139.9px){html[popular-layout=\"6\"] .popular-container{max-width:1020px!important}}html[popular-layout=\"6\"] .rank-container .rank-tab-wrap{margin-bottom:0!important;padding:10px 0!important}html[popular-layout=\"6\"] .nav-tabs{height:70px!important}html[popular-layout=\"6\"] .popular-list{padding:10px 0 0!important}html[popular-layout=\"6\"] .video-list{margin-top:15px!important}html[popular-layout=\"6\"] .popular-list .popular-tips,html[popular-layout=\"6\"] .rank-container .rank-tips,html[popular-layout=\"6\"] .history-list .history-tips,html[popular-layout=\"6\"] .popular-list .popular-tips,html[popular-layout=\"6\"] .weekly-list .weekly-hint,html[popular-layout=\"6\"] .history-list .history-hint{display:none!important}html[popular-layout=\"6\"] .card-list,html[popular-layout=\"6\"] .video-list{grid-gap:20px!important;grid-column:span 6!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"6\"] .card-list .video-card,html[popular-layout=\"6\"] .video-list .video-card{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"6\"] .card-list .video-card__content,html[popular-layout=\"6\"] .video-list .video-card__content{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;aspect-ratio:16/9!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"6\"] .card-list .video-card__info,html[popular-layout=\"6\"] .video-list .video-card__info{font-size:14px;margin-top:8px!important;padding:0!important}html[popular-layout=\"6\"] .card-list .video-card__info>div,html[popular-layout=\"6\"] .video-list .video-card__info>div{justify-content:space-between!important;display:flex!important}html[popular-layout=\"6\"] .card-list .video-card__info .rcmd-tag,html[popular-layout=\"6\"] .video-list .video-card__info .rcmd-tag{display:none!important}html[popular-layout=\"6\"] .card-list .video-card__info .video-name,html[popular-layout=\"6\"] .video-list .video-card__info .video-name{height:44px!important;margin-bottom:8px!important;font-size:15px!important;font-weight:400!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"6\"] .card-list .video-card__info .up-name,html[popular-layout=\"6\"] .video-list .video-card__info .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"6\"] .card-list .video-card__info .video-stat .play-text,html[popular-layout=\"6\"] .card-list .video-card__info .video-stat .like-text,html[popular-layout=\"6\"] .video-list .video-card__info .video-stat .play-text,html[popular-layout=\"6\"] .video-list .video-card__info .video-stat .like-text{text-wrap:nowrap!important}html[popular-layout=\"6\"] .rank-list{grid-gap:20px!important;grid-column:span 6!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;width:100%!important;display:grid!important}html[popular-layout=\"6\"] .rank-list .rank-item{display:unset!important;width:unset!important;height:unset!important;margin-right:unset!important;margin-bottom:unset!important}html[popular-layout=\"6\"] .rank-list .rank-item .content{display:unset!important;padding:unset!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .more-data{display:none!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .img{background-color:var(--Ga2,#e3e5e7)!important;width:unset!important;height:unset!important;border-radius:6px!important;margin:0!important;overflow:hidden!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .img .num{zoom:1.2;font-size:18px}html[popular-layout=\"6\"] .rank-list .rank-item .content .info{font-size:14px;margin-top:8px!important;margin-left:unset!important;height:unset!important;padding:0!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .info .title{height:44px!important;font-size:15px!important;font-weight:500!important;line-height:22px!important;overflow:hidden!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .info .detail{justify-content:space-between!important;align-items:center!important;margin-top:8px!important;display:flex!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .info .detail .up-name{margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .info .detail .detail-state .data-box{line-height:unset!important;margin:unset!important;text-wrap:nowrap!important;font-size:14px!important}html[popular-layout=\"6\"] .rank-list .rank-item .content .info .detail .detail-state .data-box:nth-child(2){margin-left:12px!important}html[popular-layout=\"6\"] .rank-list:not(.pgc-list) .content .img{aspect-ratio:16/9!important}html[popular-layout=\"6\"] .rank-list.pgc-list .content .img{aspect-ratio:220/296!important}html[popular-layout=\"6\"] .rank-list.pgc-list .rank-item .content .info .title{margin-top:.2em;font-size:17px!important}html[popular-layout=\"6\"] .rank-list.pgc-list .rank-item .content .info .data-box{margin-top:unset!important;font-size:14px!important}html[popular-layout=\"6\"] .no-more,html[popular-layout=\"6\"] .video-stat .like-text,html[popular-layout=\"6\"] .rank-list .rank-item .detail-state .data-box:nth-child(2){display:none!important}html[popular-layout=\"6\"] .rank-list .rank-item .detail-state .data-box:first-child{margin:0!important}html[popular-layout=\"6\"] .video-card .video-stat .play-text{margin-right:0!important}html[popular-hot-hide-tag] .popular-list .rcmd-tag,html[popular-weekly-hide-hint] .weekly-list .weekly-hint,html[popular-history-hide-hint] .history-list .history-hint{display:none!important}");
	var index_scss_default$3 = _virtual_monkey_style_tools_default("html[hide-search-page-search-sticky-header] .search-sticky-header,html[hide-search-page-bangumi-pgc-list] .bangumi-pgc-list,html[hide-search-page-activity-game-list] .activity-game-list{display:none!important}html[hide-search-page-ad] .video-list.row>div:has([href*=\"cm.bilibili.com\"],.bili-video-card__info--ad,.bili-video-card__info--ad-creative){display:none!important}html[hide-search-page-live-room-result] .video-list>div:has([href*=\"live.bilibili.com\"]){display:none!important}html[hide-search-page-cheese-result] .video-list>div:has(.bili-video-card__info--cheese){display:none!important}html[hide-search-page-danmaku-count] .bili-video-card .bili-video-card__stats--left .bili-video-card__stats--item:nth-child(2),html[hide-search-page-date] .bili-video-card .bili-video-card__info--date{display:none!important}html[hide-search-page-customer-service] .side-buttons div:has(>a[href*=customer-service]){display:none!important}html[hide-search-page-btn-to-top] .side-buttons .btn-to-top-wrap{display:none!important}");
	var index_scss_default$2 = _virtual_monkey_style_tools_default("html[hide-space-page-video-card-danmaku-count] .bili-video-card .bili-cover-card__stats .bili-cover-card__stat:nth-child(2):not(:last-child){display:none!important}html[increase-space-page-video-card-font-size] .bili-cover-card{--bili-cover-card-stat-icon-size:16px!important;--bili-cover-card-stat-font-size:13px!important}html[increase-space-page-video-card-font-size] .bili-video-card{--bili-video-card-title-font-size:15px!important;--bili-video-card-title-line-height:23px!important;--bili-video-card-subtitle-font-size:14px!important;--bili-video-card-subtitle-line-height:16px!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:first-child{width:48px!important;height:48px!important}html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers .b-avatar__layer.center:nth-child(2),html[hide-dynamic-page-bili-dyn-avatar-pendent] .bili-dyn-list .b-avatar__layers:nth-child(2) .b-avatar__layer.center,html[hide-dynamic-page-bili-dyn-avatar-icon] .bili-dyn-list .b-avatar__layer:not(.center),html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-ornament,html[hide-dynamic-page-bili-dyn-ornament] .bili-dyn-item__ornament,html[hide-dynamic-page-bili-dyn-dispute] .bili-dyn-content__dispute,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__orig__topic,html[hide-dynamic-page-bili-dyn-official-topic] .bili-dyn-content__forw__topic{display:none!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic{color:inherit!important}html[hide-dynamic-page-bili-dyn-text-topic] .bili-rich-text-topic:hover{color:var(--brand_blue)!important}html[hide-dynamic-page-bili-dyn-item-interaction] .bili-dyn-item__interaction{display:none!important}html[hide-dynamic-page-bili-dyn-card-reserve] .bili-dyn-list__item:has(.bili-dyn-card-reserve){display:none!important}:is(html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-dyn-card-goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has(.bili-rich-text-module.goods),html[hide-dynamic-page-bili-dyn-card-goods] .bili-dyn-list__item:has([data-type=goods])){display:none!important}html[hide-dynamic-page-bili-dyn-lottery] .bili-dyn-list__item:has([data-type=lottery]){display:none!important}html[hide-dynamic-page-bili-dyn-forward] .bili-dyn-list__item:has(.bili-dyn-content__orig.reference){display:none!important}html[hide-dynamic-page-bili-dyn-vote] .bili-dyn-list__item:has(.bili-dyn-card-vote){display:none!important}html[hide-dynamic-page-bili-dyn-live] .bili-dyn-list__item:has(.bili-dyn-card-live){display:none!important}html[hide-dynamic-page-bili-dyn-blocked] .bili-dyn-list__item:has(.dyn-blocked-mask,.bili-dyn-upower-common){display:none!important}html[hide-dynamic-page-bili-dyn-charge-video] .bili-dyn-list__item:has(.bili-dyn-card-video__badge [src*=qcRJ6sJU91]){display:none!important}html[dynamic-page-unfold-dynamic-content] .bili-dyn-list__item:not(:has(.dyn-card-opus__title)) .bili-rich-text .bili-rich-text__content{max-height:unset!important;-webkit-line-clamp:unset!important}html[dynamic-page-unfold-dynamic-content] .bili-dyn-list__item:not(:has(.dyn-card-opus__title)) .bili-rich-text .bili-rich-text__action{display:none!important}html[hide-space-page-sidebar-feedback] #app .space-float{height:fit-content!important}html[hide-space-page-sidebar-feedback] #app .space-float .float-button:nth-last-child(3){display:none!important}html[hide-space-page-sidebar-revert] #app .space-float{height:fit-content!important}html[hide-space-page-sidebar-revert] #app .space-float .float-button:nth-last-child(2){display:none!important}");
	var index_scss_default$1 = _virtual_monkey_style_tools_default("html[video-page-hide-fixed-header] .fixed-header .bili-header__bar{position:relative!important}html[video-page-danmaku-font-family] .bili-danmaku-x-dm{--fontFamily:var(--video-page-danmaku-font-family)!important}html[video-page-danmaku-font-weight] .bili-danmaku-x-dm{--fontWeight:var(--video-page-danmaku-font-weight)!important}html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-online,html[video-page-hide-bpx-player-video-info-online] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-dm,html[video-page-hide-bpx-player-video-info-dm] .bpx-player-video-info-divide,html[video-page-hide-bpx-player-dm-switch] .bpx-player-dm-switch,html[video-page-hide-bpx-player-dm-setting] .bpx-player-dm-setting,html[video-page-hide-bpx-player-video-btn-dm] .bpx-player-video-btn-dm{display:none!important}html[video-page-hide-bpx-player-dm-input] .bpx-player-dm-input::placeholder{color:#0000!important}html[video-page-hide-bpx-player-dm-hint] .bpx-player-dm-hint,html[video-page-hide-bpx-player-dm-btn-send] .bpx-player-dm-btn-send,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-sug,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-carousel,html[video-page-hide-bpx-player-postpanel] .bpx-player-postpanel-popup,html[video-page-hide-bpx-player-sending-area] .bpx-player-sending-area,html[video-page-hide-bpx-player-sending-area] #bilibili-player-placeholder-bottom{display:none!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])){aspect-ratio:16/9;height:unset!important}html[video-page-hide-bpx-player-sending-area] #playerWrap:has(.bpx-player-container:not([data-screen=web],[data-screen=full])) #bilibili-player{aspect-ratio:16/9;height:unset!important}html[video-page-hide-bpx-player-sending-area] .page-main-content:has(.festival-video-player) .video-player-box{height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player{height:fit-content!important}html[video-page-hide-bpx-player-sending-area] .festival-video-player #bilibili-player:not(.mode-webscreen){height:calc(100% - 46px)!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center .bpx-player-video-inputbar,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center .bpx-player-video-inputbar{display:none!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 15px!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-left,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-left{min-width:unset!important}html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-video-inputbar] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info{color:#fffc!important;margin-bottom:1px!important;margin-right:16px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-online,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-online{font-size:14px!important;display:flex!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-video-info-divide,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-dm,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-video-info-divide{display:none}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-control-bottom-center,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-control-bottom-center{padding:0 16px!important}html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=full] .bpx-player-ctrl-viewpoint,html[video-page-show-fullscreen-bpx-player-video-info-online] .bpx-player-container[data-screen=web] .bpx-player-ctrl-viewpoint{width:fit-content!important}html[video-page-unfold-video-info-title] .video-info-container:has(.show-more){margin-bottom:12px;height:fit-content!important}html[video-page-unfold-video-info-title] .video-info-container .video-info-title-inner-overflow .video-title{margin-right:unset!important;text-wrap:wrap!important}html[video-page-unfold-video-info-title] .video-info-container .video-info-title-inner .video-title .video-title-href{text-wrap:wrap!important}html[video-page-unfold-video-info-title] .video-info-container .show-more,html[video-page-hide-video-info-danmaku-count] .video-info-detail .dm,html[video-page-hide-video-info-danmaku-count] .video-info-meta .dm,html[video-page-hide-video-info-pubdate] .video-info-detail .pubdate-ip,html[video-page-hide-video-info-pubdate] .video-info-meta .pubdate-ip,html[video-page-hide-video-info-copyright] .video-info-detail .copyright,html[video-page-hide-video-info-copyright] .video-info-meta .copyright,html[video-page-hide-video-info-honor] .video-info-detail .honor-rank,html[video-page-hide-video-info-honor] .video-info-detail .honor-weekly,html[video-page-hide-video-info-honor] .video-info-detail .honor-history,html[video-page-hide-video-info-honor] .video-info-meta .honor-rank,html[video-page-hide-video-info-honor] .video-info-meta .honor-weekly,html[video-page-hide-video-info-honor] .video-info-meta .honor-history,html[video-page-hide-video-info-argue] .video-info-detail .argue,html[video-page-hide-video-info-argue] .video-info-detail .video-argue,html[video-page-hide-video-info-argue] .video-info-meta .argue,html[video-page-hide-video-info-argue] .video-info-meta .video-argue{display:none!important}html[video-page-hide-bpx-player-mini-mode-process] .bpx-player-container[data-screen=mini]:not(:hover) .bpx-player-mini-progress{display:none}html[video-page-hide-bpx-player-mini-mode-danmaku] .bpx-player-container[data-screen=mini] .bpx-player-row-dm-wrap{visibility:hidden!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-screen=mini]{height:calc(225px * var(--mini-player-zoom,1))!important;width:calc(400px * var(--mini-player-zoom,1))!important}html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"1\"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"2\"][data-screen=mini]{height:calc(180px * var(--mini-player-zoom,1))!important;width:calc(320px * var(--mini-player-zoom,1))!important}@media screen and (width>=1681px){html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"1\"][data-screen=mini],html[video-page-bpx-player-mini-mode-wheel-adjust] .bpx-player-container[data-revision=\"2\"][data-screen=mini]{height:calc(203px * var(--mini-player-zoom,1))!important;width:calc(360px * var(--mini-player-zoom,1))!important}}html[video-page-bpx-player-mini-mode-position-record] .bpx-player-container[data-screen=mini]{transform:translateX(var(--mini-player-translate-x,1)) translateY(var(--mini-player-translate-y,1))}html[video-page-hide-bpx-player-bili-guide-all] .bili-follow-to-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-animate,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-cyc,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-electric,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-guide-followed,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-all,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-follow,html[video-page-hide-bpx-player-bili-guide-all] .bili-danmaku-x-guide-gray,html[video-page-hide-bpx-player-bili-vote] .bili-vote,html[video-page-hide-bpx-player-bili-vote] .bili-danmaku-x-vote,html[video-page-hide-bpx-player-bili-qoe-feedback] .bpx-player-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-score,html[video-page-hide-bpx-player-bili-qoe-feedback] .bili-qoeFeedback-vote,html[video-page-hide-bpx-player-bili-score] .bili-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-score,html[video-page-hide-bpx-player-bili-score] .bili-danmaku-x-superRating,html[video-page-hide-bpx-player-bili-score-sum] .bili-scoreSum,html[video-page-hide-bpx-player-bili-score-sum] .bili-danmaku-x-scoreSum,html[video-page-hide-bpx-player-bili-clock] .bili-clock,html[video-page-hide-bpx-player-bili-clock] .bili-danmaku-x-clock,html[video-page-hide-bpx-player-bili-cmtime] .bili-cmtime,html[video-page-hide-bpx-player-bili-cmtime] .bili-danmaku-x-cmtime,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-cmd-shrink,html[video-page-hide-bpx-player-bili-cmd-shrink] .bili-danmaku-x-cmd-shrink,html[video-page-hide-bpx-player-bili-reserve] .bili-reserve,html[video-page-hide-bpx-player-bili-reserve] .bili-danmaku-x-reserve,html[video-page-hide-bpx-player-bili-link] .bili-link,html[video-page-hide-bpx-player-bili-link] .bili-danmaku-x-link,html[video-page-hide-bpx-player-cmd-dm-wrap] .bpx-player-cmd-dm-wrap,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-left-title,html[video-page-hide-bpx-player-top-left-title] .bpx-player-top-mask,html[video-page-hide-bpx-player-top-left-music] .bpx-player-top-left-music,html[video-page-hide-bpx-player-top-left-follow] .bpx-player-top-left-follow,html[video-page-hide-bpx-player-top-issue] .bpx-player-top-issue,html[video-page-hide-bpx-player-state-wrap] .bpx-player-state-wrap,html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-related{display:none!important}html[video-page-hide-bpx-player-ending-related] .bpx-player-ending-content{align-items:center!important;display:flex!important}html[video-page-hide-bpx-player-dialog-wrap] .bpx-player-dialog-wrap,html[video-page-bpx-player-bili-high-icon] .bili-dm .bili-high-icon,html[video-page-bpx-player-bili-high-icon] .bili-danmaku-x-high-icon{display:none!important}html[video-page-bpx-player-bili-dm-vip-white] .bili-dm>.bili-dm-vip,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-colorful,html[video-page-bpx-player-bili-dm-vip-white] .bili-danmaku-x-dm-vip{background:unset!important;background-image:unset!important;background-size:unset!important;text-shadow:1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000!important;-webkit-text-stroke:unset!important;-moz-text-stroke:none!important;-ms-text-stroke:none!important}html[video-page-bpx-player-bili-dm-normal-white] .bili-danmaku-x-dm,html[video-page-bpx-player-bili-dm-normal-white] .bili-dm{--color:white!important}html[video-page-subtitle-font-color] .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-font-color] .bpx-player-subtitle-panel-text{color:var(--video-page-subtitle-font-color)!important}html[video-page-subtitle-font-family] .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-font-family] .bpx-player-subtitle-panel-text{font-family:var(--video-page-subtitle-font-family)!important}html[video-page-subtitle-font-weight] .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-font-weight] .bpx-player-subtitle-panel-text{font-weight:var(--video-page-subtitle-font-weight)!important}html[video-page-subtitle-text-stroke-color] .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-text-stroke-color] .bpx-player-subtitle-panel-text{background:unset!important;background-color:var(--video-page-subtitle-text-stroke-color)!important;-webkit-background-clip:text!important;background-clip:text!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=normal],[data-screen=wide]) .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=normal],[data-screen=wide]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-moz-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important;-ms-text-stroke:calc(.6 * var(--video-page-subtitle-text-stroke-width)) transparent!important}html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=web],[data-screen=full]) .bili-subtitle-x-subtitle-panel-text,html[video-page-subtitle-text-stroke-width] .bpx-player-container:where([data-screen=web],[data-screen=full]) .bpx-player-subtitle-panel-text{-webkit-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-moz-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important;-ms-text-stroke:var(--video-page-subtitle-text-stroke-width) transparent!important}html[video-page-hide-bpx-player-ctrl-prev] .bpx-player-ctrl-prev,html[video-page-hide-bpx-player-ctrl-play] .bpx-player-ctrl-play,html[video-page-hide-bpx-player-ctrl-next] .bpx-player-ctrl-next,html[video-page-hide-bpx-player-ctrl-viewpoint] .bpx-player-ctrl-viewpoint,html[video-page-hide-bpx-player-ctrl-flac] .bpx-player-ctrl-flac,html[video-page-hide-bpx-player-ctrl-quality] .bpx-player-ctrl-quality,html[video-page-hide-bpx-player-ctrl-eplist] .bpx-player-ctrl-eplist,html[video-page-hide-bpx-player-ctrl-playbackrate] .bpx-player-ctrl-playbackrate,html[video-page-hide-bpx-player-ctrl-subtitle] .bpx-player-ctrl-subtitle,html[video-page-hide-bpx-player-ctrl-volume] .bpx-player-ctrl-volume,html[video-page-hide-bpx-player-ctrl-setting] .bpx-player-ctrl-setting,html[video-page-hide-bpx-player-ctrl-pip] .bpx-player-ctrl-pip,html[video-page-hide-bpx-player-ctrl-wide] .bpx-player-ctrl-wide,html[video-page-hide-bpx-player-ctrl-web] .bpx-player-ctrl-web,html[video-page-hide-bpx-player-ctrl-full] .bpx-player-ctrl-full,html[video-page-hide-bpx-player-pbp-pin] .bpx-player-pbp-pin,html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-shadow-progress-area{display:none!important}html[video-page-hide-bpx-player-shadow-progress-area] .bpx-player-pbp:not(.show){bottom:0!important}html[video-page-show-bpx-player-shadow-progress-area-fullscreen] #bilibili-player [data-screen=full][data-ctrl-hidden=true] .bpx-player-shadow-progress-area{opacity:1!important;visibility:visible!important}html[video-page-show-bpx-player-pbp] .bpx-player-pbp:not(.show){opacity:1!important}html[default-widescreen][player-is-wide] #playerWrap:has(.bpx-player-container[data-screen=mini]){width:fit-content}html[default-webscreen]:not(.webscreen-loaded){scrollbar-width:none!important}html[default-webscreen]:not(.webscreen-loaded)::-webkit-scrollbar{display:none!important}html[default-webscreen]:not(.webscreen-loaded) body{width:100%!important;height:100%!important;margin:0!important;padding:0!important;position:fixed!important;top:0!important;left:0!important}html[default-webscreen]:not(.webscreen-loaded) #app #biliMainHeader,html[default-webscreen]:not(.webscreen-loaded) #app .right-container,html[default-webscreen]:not(.webscreen-loaded) #app .fixed-sidenav-storage,html[default-webscreen]:not(.webscreen-loaded) #app .left-container>:not(#playerWrap){visibility:hidden}html[default-webscreen]:not(.webscreen-loaded) #app .left-container{width:100vw!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap{width:100vw!important;height:100vh!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player-placeholder{display:none!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player{z-index:100000!important;border-radius:0!important;width:100vw!important;height:100vh!important;position:fixed!important;top:0!important;left:0!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player video{aspect-ratio:16/9!important;width:fit-content!important;height:100vh!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player .bpx-player-sending-area{display:none!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player .bpx-player-video-area{width:100vw!important;height:100vh!important}html[default-webscreen]:not(.webscreen-loaded) #app #playerWrap #bilibili-player .bpx-player-sending-bar{background-color:#0000!important}html[webscreen-scrollable] .webscreen-fix{position:unset;top:unset;left:unset;margin:unset;padding:unset;width:unset;height:unset}html[webscreen-scrollable] .webscreen-fix #biliMainHeader{display:none}html[webscreen-scrollable] .webscreen-fix #mirror-vdcon{box-sizing:content-box;position:relative}html[webscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded){margin-top:0!important}html[webscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist{max-height:calc(50vh + 75px)!important}html[webscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap{max-height:50vh!important}html[webscreen-scrollable] .webscreen-fix .left-container,html[webscreen-scrollable] .webscreen-fix .playlist-container--left{padding-top:100vh;position:static!important}html[webscreen-scrollable] .webscreen-fix .left-container .video-info-container,html[webscreen-scrollable] .webscreen-fix .playlist-container--left .video-info-container{height:fit-content}html[webscreen-scrollable] .webscreen-fix .left-container #bilibili-player.mode-webscreen,html[webscreen-scrollable] .webscreen-fix .playlist-container--left #bilibili-player.mode-webscreen{border-radius:unset;z-index:unset;left:unset;top:unset;width:100%;height:100%;position:static}html[webscreen-scrollable] .webscreen-fix .left-container #playerWrap,html[webscreen-scrollable] .webscreen-fix .playlist-container--left #playerWrap{width:100vw;height:100vh;padding-right:0;position:absolute;top:0;left:0;right:0}html[webscreen-scrollable] .webscreen-fix .right-container,html[webscreen-scrollable] .webscreen-fix .playlist-container--right{padding-top:100vh}html[webscreen-scrollable] .webscreen-fix .float-nav-exp .nav-menu .item.mini,html[webscreen-scrollable] .webscreen-fix .fixed-sidenav-storage .mini-player-window{display:none!important}html[webscreen-scrollable] .webscreen-fix .bili-dialog-m{z-index:100000!important}html[webscreen-scrollable] .webscreen-fix::-webkit-scrollbar{display:none!important}html[webscreen-scrollable] .bili-msg{z-index:100001!important}@supports ((-moz-appearance:none)){html[webscreen-scrollable]:has(.webscreen-fix){scrollbar-width:none!important}}html[fullscreen-scrollable] .webscreen-fix{position:unset;top:unset;left:unset;margin:unset;padding:unset;width:unset;height:unset}html[fullscreen-scrollable] .webscreen-fix #biliMainHeader{display:none}html[fullscreen-scrollable] .webscreen-fix #mirror-vdcon{box-sizing:content-box;position:relative}html[fullscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded){margin-top:0!important}html[fullscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist{max-height:calc(50vh + 75px)!important}html[fullscreen-scrollable] .webscreen-fix #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap{max-height:50vh!important}html[fullscreen-scrollable] .webscreen-fix .left-container,html[fullscreen-scrollable] .webscreen-fix .playlist-container--left{padding-top:100vh;position:static!important}html[fullscreen-scrollable] .webscreen-fix .left-container .video-info-container,html[fullscreen-scrollable] .webscreen-fix .playlist-container--left .video-info-container{height:fit-content}html[fullscreen-scrollable] .webscreen-fix .left-container #bilibili-player.mode-webscreen,html[fullscreen-scrollable] .webscreen-fix .playlist-container--left #bilibili-player.mode-webscreen{border-radius:unset;z-index:unset;left:unset;top:unset;width:100%;height:100%;position:static}html[fullscreen-scrollable] .webscreen-fix .left-container #playerWrap,html[fullscreen-scrollable] .webscreen-fix .playlist-container--left #playerWrap{width:100vw;height:100vh;padding-right:0;position:absolute;top:0;left:0;right:0}html[fullscreen-scrollable] .webscreen-fix .right-container,html[fullscreen-scrollable] .webscreen-fix .playlist-container--right{padding-top:100vh}html[fullscreen-scrollable] .webscreen-fix .float-nav-exp .nav-menu .item.mini,html[fullscreen-scrollable] .webscreen-fix .fixed-sidenav-storage .mini-player-window{display:none!important}html[fullscreen-scrollable] .webscreen-fix .bili-dialog-m{z-index:100000!important}html[fullscreen-scrollable] .webscreen-fix::-webkit-scrollbar{display:none!important}html[fullscreen-scrollable] .bili-msg{z-index:100001!important}@supports ((-moz-appearance:none)){html[fullscreen-scrollable]:has(.webscreen-fix){scrollbar-width:none!important}}html[screen-scrollable-enable-mini-player] .webscreen-fix .bpx-player-mini-close{display:none!important}html[screen-scrollable-move-header-bottom] .webscreen-fix #biliMainHeader{width:100%!important;display:block!important;position:absolute!important;top:100vh!important}html[screen-scrollable-move-header-bottom] .webscreen-fix .fixed-header .bili-header__bar{position:relative!important}html[screen-scrollable-move-header-bottom] .webscreen-fix #mirror-vdcon{padding-top:64px!important}html[screen-scrollable-move-header-bottom] .webscreen-fix .custom-navbar[role=navigation]{z-index:1000!important;top:100vh!important}html[screen-scrollable-move-header-bottom] .webscreen-fix .custom-navbar[role=navigation] .custom-navbar-item .popup{top:100%!important}html[screen-scrollable-move-header-bottom] .webscreen-fix.fixed-navbar .custom-navbar[role=navigation]{position:absolute!important}html[screen-scrollable-move-header-bottom] .custom-navbar[role=navigation]{transition:unset!important}html[video-page-exchange-player-position] body:not(.webscreen-fix) :is(.left-container,.playlist-container--left){flex-direction:column!important;padding-top:30px!important;display:flex!important}html[video-page-exchange-player-position] body:not(.webscreen-fix) :is(.left-container,.playlist-container--left)>*{order:1}html[video-page-exchange-player-position] body:not(.webscreen-fix) #playerWrap{z-index:1;order:0!important}html[video-page-exchange-player-position] body:not(.webscreen-fix) .video-info-container{height:auto!important;margin-bottom:0!important;padding-top:16px!important}html[video-page-exchange-player-position][player-is-wide] body:not(.webscreen-fix) .up-panel-container{margin-top:calc(max(min(96.23vw - 359.514px,2010px),923px)/1.77778 + 81px);position:relative!important}html[video-page-exchange-player-position][player-is-wide] body:not(.webscreen-fix) #danmukuBox{margin-top:0!important}html[video-page-exchange-player-position] .bili-msg{z-index:100001!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap{height:fit-content!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player-placeholder-top{width:min(100vw - 400px, var(--normalscreen-width))!important;aspect-ratio:16/9!important}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player{width:min(100vw - 400px, var(--normalscreen-width));height:fit-content}html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) #playerWrap #bilibili-player .bpx-player-video-area{width:min(100vw - 400px, var(--normalscreen-width));aspect-ratio:16/9}:is(html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) .left-container,html[normalscreen-width]:not([player-is-wide]):has(#bilibili-player .bpx-player-container[data-screen=normal],#bilibili-player .bpx-player-container:not([data-screen])) .playlist-container--left),html[normalscreen-width] .webscreen-fix .left-container,html[normalscreen-width] .webscreen-fix .playlist-container--left,:is(html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) .left-container,html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) .playlist-container--left){width:min(100vw - 400px, var(--normalscreen-width))!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap{width:min(100vw - 400px, var(--normalscreen-width))!important;height:fit-content!important;display:flex!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player-placeholder{position:static;width:min(100vw - 400px, var(--normalscreen-width))!important;height:fit-content!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player-placeholder #bilibili-player-placeholder-top{width:min(100vw - 400px, var(--normalscreen-width))!important;aspect-ratio:16/9!important}html[normalscreen-width]:not([player-is-wide]):has(.bpx-player-container[data-screen=mini]) #playerWrap #bilibili-player{width:min(100vw - 400px, var(--normalscreen-width))!important;height:fit-content!important}html[normalscreen-width][player-is-wide]:has(.bpx-player-container[data-screen=mini]) #bilibili-player{background-color:#000!important}html[video-page-right-container-sticky-optimize] .right-container{display:flex!important}html[video-page-right-container-sticky-optimize] .right-container .right-container-inner{width:100%!important;top:unset!important;align-self:flex-end!important;max-width:100%!important;min-height:calc(100vh - 64px)!important;padding-bottom:0!important;position:sticky!important}html[video-page-right-container-sticky-optimize] .right-container-inner{min-height:calc(100vh - 304px)!important;bottom:240px!important}html[video-page-right-container-sticky-optimize] body:has(.mini-player-window:not(.on)) .right-container-inner{min-height:calc(100vh - 74px)!important;bottom:10px!important}html[video-page-right-container-sticky-disable] .right-container-inner{position:static!important}html[video-page-hide-right-container-ad] .right-container #slide_ad,html[video-page-hide-right-container-ad] .right-container .video-card-ad-small,html[video-page-hide-right-container-ad] .right-container .video-card-ad-small-inner,html[video-page-hide-right-container-ad] .right-container .video-page-special-card-small{display:none!important}html[video-page-hide-right-container-ad] .right-container #reco_list,html[video-page-hide-right-container-ad] .right-container .recommend-list-v1{margin-top:0!important}html[video-page-hide-right-container-video-page-game-card-small] .right-container .video-page-game-card-small{display:none!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded){max-height:fit-content!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-collapse-body{height:fit-content!important}html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-wraplist,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-filter-wrap,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-wrap,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bpx-player-dm-container,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-area,html[video-page-unfold-right-container-danmaku] #danmukuBox .bui-collapse-wrap:not(.bui-collapse-wrap-folded) .bui-long-list-wrap{max-height:fit-content!important}html[video-page-hide-right-container-danmaku] #danmukuBox{visibility:hidden!important;height:0!important;margin-bottom:0!important}html[video-page-hide-right-container-reco-list-next-play-next-button] .right-container .next-play .next-button,html[video-page-hide-right-container-reco-list-next-play-next-button] .right-container .next-play .continuous-btn,html[video-page-hide-right-container-reco-list-next-play] .right-container .next-play{display:none!important}html[video-page-hide-right-container-reco-list-next-play] .right-container .rec-list{margin-top:0!important}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list{counter-reset:section-counter}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item:before{counter-increment:section-counter;content:\"P\" counter(section-counter);margin-right:10px;font-size:15px;transition:color .2s}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item.active:before,html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list .video-pod__item:hover:before{color:var(--brand_blue)}html[video-page-hide-right-container-multi-page-add-counter] .video-pod__list.multip.list:has(.video-pod__item:nth-child(10)) .video-pod__item:nth-child(-n+9):before{content:\"P0\" counter(section-counter)!important}html[video-page-right-container-section-unfold-title] .video-pod.video-pod .section .video-pod__item .title{height:fit-content!important}html[video-page-right-container-section-unfold-title] .video-pod.video-pod .section .video-pod__item .title-txt{-webkit-line-clamp:2!important;margin-top:4px!important;margin-bottom:4px!important;line-height:21px!important}html[video-page-hide-right-container-section-height] .video-sections-content-list,html[video-page-hide-right-container-section-height] .video-pod__body{height:fit-content!important;max-height:340px!important}html[video-page-hide-right-container-section-next-btn] .base-video-sections-v1 .next-button{display:none!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-left{max-width:100%!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-title{max-width:unset!important}html[video-page-hide-right-container-section-next-btn] .video-sections-head_first-line .first-line-right,html[video-page-hide-right-container-section-next-btn] .video-pod__header .auto-play,html[video-page-hide-right-container-section-play-num] .base-video-sections-v1 .play-num,html[video-page-hide-right-container-section-play-num] .video-sections-head_second-line .play-num,html[video-page-hide-right-container-section-play-num] .video-pod__header .total-view,html[video-page-hide-right-container-section-abstract] .base-video-sections-v1 .abstract,html[video-page-hide-right-container-section-abstract] .base-video-sections-v1 .second-line_left img,html[video-page-hide-right-container-section-abstract] .video-sections-head_second-line .abstract,html[video-page-hide-right-container-section-abstract] .video-sections-head_second-line .second-line_left img,html[video-page-hide-right-container-section-abstract] .video-pod__header .pod-description-reference,html[video-page-hide-right-container-section-subscribe] .base-video-sections-v1 .second-line_right,html[video-page-hide-right-container-section-subscribe] .video-sections-head_second-line .second-line_right,html[video-page-hide-right-container-section-subscribe] .video-pod__header .subscribe-btn{display:none!important}html[video-page-right-container-set-info-bottom] :is(.video-page-card-small,.video-page-operator-card-small,.recommend-list-container .video-card) .card-box .info{flex-direction:column!important;display:flex!important}html[video-page-right-container-set-info-bottom] :is(.video-page-card-small,.video-page-operator-card-small,.recommend-list-container .video-card) .card-box .info .upname{margin-top:auto!important}html[video-page-hide-right-container-duration] .right-container .card-box .duration,html[video-page-hide-right-container-duration] .recommend-list-container .duration{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-up] .right-container .info .upname{visibility:hidden!important}html[video-page-hide-right-container-reco-list-rec-list-info-up] .right-container .info{flex-direction:column;justify-content:space-between;display:flex}html[video-page-hide-right-container-reco-list-rec-list-info-up] .recommend-list-container .info .upname{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-up] .recommend-list-container .info{flex-direction:column;justify-content:space-between;display:flex}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .right-container .info .playinfo{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .right-container .info{flex-direction:column;justify-content:space-between;display:flex}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .recommend-list-container .info .playinfo{display:none!important}html[video-page-hide-right-container-reco-list-rec-list-info-plays] .recommend-list-container .info{flex-direction:column;justify-content:space-between;display:flex}html[video-page-hide-right-container-reco-list-rec-footer] .right-container .rec-footer,html[video-page-hide-right-container-reco-list-rec-footer] .playlist-container--right .rec-footer,html[video-page-hide-right-container-reco-list-rec-list] .right-container .rec-list,html[video-page-hide-right-container-reco-list-rec-list] .right-container .rec-footer,html[video-page-hide-right-container-reco-list-rec-list] .playlist-container--right .recommend-list-container,html[video-page-hide-right-container-right-bottom-banner] #right-bottom-banner,html[video-page-hide-right-container-right-bottom-banner] .right-bottom-banner{display:none!important}html[video-page-hide-right-container-right-bottom-banner] body:has(.mini-player-window:not(.on)) .right-container-inner{padding-bottom:10px!important}html[video-page-hide-right-container-live] .right-container .pop-live-small-mode{display:none!important}html[video-page-hide-right-container-live] body:has(.mini-player-window:not(.on)) .right-container-inner{padding-bottom:10px!important}html[video-page-hide-right-container]:not([player-is-wide]) .right-container,html[video-page-hide-sidenav-right-container-live] .fixed-sidenav-storage .mini-player-window,html[video-page-hide-sidenav-right-container-live] .float-nav-exp .nav-menu .item.mini,html[video-page-hide-sidenav-customer-service] .fixed-sidenav-storage .customer-service{display:none!important}html[video-page-hide-sidenav-customer-service] .float-nav-exp .nav-menu a:has(>.item.help){display:none!important}html[video-page-hide-sidenav-back-to-top] .fixed-sidenav-storage .back-to-top,html[video-page-hide-sidenav-back-to-top] .float-nav-exp .nav-menu .item.backup,html[video-page-simple-video-share-popover] .video-share-popover .video-share-dropdown .dropdown-bottom{display:none!important}html[video-page-simple-video-share-popover] .video-share-popover .video-share-dropdown .dropdown-top{padding:15px!important}html[video-page-simple-video-share-popover] .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-right{display:none!important}html[video-page-simple-video-share-popover] .video-share-popover .video-share-dropdown .dropdown-top .dropdown-top-left{padding-right:0!important}html[video-page-hide-video-share-popover] .video-share-popover,html[video-page-hide-triple-oldfan-entry] .triple-oldfan-entry,html[video-page-hide-below-info-video-ai-assistant] .video-toolbar-right .video-ai-assistant,html[video-page-hide-below-info-video-complaint] .video-toolbar-right .video-complaint,html[video-page-hide-below-info-video-note] .video-toolbar-right .video-note,html[video-page-hide-below-info-video-report-menu] .video-toolbar-right .video-tool-more{display:none!important}html[video-page-unfold-below-info-desc] #v_desc,html[video-page-unfold-below-info-desc] .video-desc-container{margin-bottom:0!important}html[video-page-unfold-below-info-desc] #v_desc .basic-desc-info,html[video-page-unfold-below-info-desc] .video-desc-container .basic-desc-info{height:auto!important}html[video-page-unfold-below-info-desc] #v_desc .toggle-btn,html[video-page-unfold-below-info-desc] .video-desc-container .toggle-btn,html[video-page-hide-below-info-desc] #v_desc,html[video-page-hide-below-info-desc] .video-desc-container{display:none!important}html[video-page-hide-below-info-tag] #v_tag,html[video-page-hide-below-info-tag] .video-tag-container{visibility:hidden!important;height:0!important;margin:0 0 10px!important}html[video-page-hide-below-activity-vote] #activity_vote,html[video-page-hide-below-activity-vote] .activity-m-v1,html[video-page-hide-below-bannerAd] #bannerAd,html[video-page-hide-below-bannerAd] .left-container .left-banner,html[video-page-hide-up-sendmsg] .up-detail .send-msg,html[video-page-hide-up-description] .up-detail .up-description,html[video-page-hide-up-charge] .upinfo-btn-panel .new-charge-btn,html[video-page-hide-up-charge] .upinfo-btn-panel .old-charge-btn,html[video-page-hide-up-bili-avatar-pendent-dom] .up-info-container .bili-avatar-pendent-dom{display:none!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap{width:48px!important;height:48px!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap .up-avatar{background-color:#0000!important}html[video-page-hide-up-bili-avatar-pendent-dom] .up-avatar-wrap .bili-avatar{width:48px!important;height:48px!important;transform:unset!important}html[video-page-hide-up-bili-avatar-icon] .up-info-container .bili-avatar-icon,html[video-page-hide-up-bili-avatar-icon] .up-info-container .bili-avatar-nft-icon,html[video-page-hide-up-membersinfo-normal-header] .membersinfo-normal .header,html[video-page-hide-up-usercard] .usercard-wrap{display:none!important}");
	var index_scss_default = _virtual_monkey_style_tools_default("html[watchlater-layout=\"4\"] main:not(.watchlater-list--vertical) .watchlater-list-container{grid-template-columns:repeat(4,1fr)!important;gap:25px 16px!important}html[watchlater-layout=\"5\"] main:not(.watchlater-list--vertical) .watchlater-list-container{grid-template-columns:repeat(5,1fr)!important;gap:25px 16px!important}html[watchlater-increase-font-size] .bili-video-card{--bili-video-card-title-padding-right:0;--bili-video-card-title-font-size:16px;--bili-video-card-subtitle-font-size:14px}html[watchlater-increase-font-size] .bili-cover-card__stat{--bili-cover-card-stat-font-size:14px}html[watchlater-increase-font-size] .bili-cover-card__progress{--bili-cover-card-progress-height:3.5px}html[watchlater-hide-feedback] .right-side .feed_back{display:none!important}");
	var rules = [
		{
			name: "homepage",
			groups: homepageGroups,
			style: index_scss_default$6,
			checkFn: isPageHomepage
		},
		{
			name: "video",
			groups: videoGroups,
			style: index_scss_default$1,
			checkFn: () => isPageVideo() || isPagePlaylist()
		},
		{
			name: "festival",
			groups: festivalGroups,
			style: index_scss_default$7,
			checkFn: isPageFestival
		},
		{
			name: "bangumi",
			groups: bangumiGroups,
			style: index_scss_default$12,
			checkFn: isPageBangumi
		},
		{
			name: "dynamic",
			groups: dynamicGroups,
			style: index_scss_default$8,
			checkFn: isPageDynamic
		},
		{
			name: "live",
			groups: liveGroups,
			style: index_scss_default$5,
			checkFn: isPageLive
		},
		{
			name: "popular",
			groups: popularGroups,
			style: index_scss_default$4,
			checkFn: isPagePopular
		},
		{
			name: "channel",
			groups: channelGroups,
			style: index_scss_default$11,
			checkFn: isPageChannel
		},
		{
			name: "space",
			groups: spaceGroups,
			style: index_scss_default$2,
			checkFn: isPageSpace
		},
		{
			name: "search",
			groups: searchGroups,
			style: index_scss_default$3,
			checkFn: isPageSearch
		},
		{
			name: "watchlater",
			groups: watchlaterGroups,
			style: index_scss_default,
			checkFn: isPageWatchlater
		},
		{
			name: "comment",
			groups: commentGroups,
			style: index_scss_default$10,
			isSpecial: true,
			checkFn: () => isPageVideo() || isPageBangumi() || isPageDynamic() || isPageSpace() || isPagePlaylist()
		},
		{
			name: "common",
			groups: commonGroups,
			style: index_scss_default$9,
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
	var loadRuleStyle = () => {
		for (const rule of rules) if (rule.checkFn() && rule.style) try {
			rule.style.classList.add("bili-cleaner-css", rule.name);
			document.documentElement?.appendChild(rule.style);
		} catch (err) {
			logger.error(`loadRuleStyle error, name=${rule.name}`, err);
		}
	};
	var RulePanelView_default = (0, vue.defineComponent)({
		__name: "RulePanelView",
		setup(__props) {
			const store = useRulePanelStore();
			const editorDialogRef = (0, vue.ref)(null);
			const handleEdit = (item) => {
				editorDialogRef.value?.openEditor(item);
			};
			const currRules = [];
			for (const rule of rules) if (rule.checkFn()) currRules.push(rule);
			return (_ctx, _cache) => {
				return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(PanelComp_default, (0, vue.mergeProps)({
					title: "bilibili 页面净化大师",
					widthPercent: 28,
					heightPercent: 85,
					minWidth: 360,
					minHeight: 600
				}, { onClose: (0, vue.unref)(store).hide }), {
					default: (0, vue.withCtx)(() => [((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(currRules, (rule, i) => {
						return (0, vue.createElementVNode)("div", { key: i }, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(rule.groups, (group, j) => {
							return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: j }, [(0, vue.createVNode)(DisclosureComp_default, (0, vue.mergeProps)({ ref_for: true }, {
								title: group.name,
								isFold: group.fold,
								isSpecial: rule.isSpecial
							}), {
								default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(group.items, (item, innerIndex) => {
									return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: innerIndex }, [item.type === "switch" ? ((0, vue.openBlock)(), (0, vue.createBlock)(SwitchComp_default, (0, vue.mergeProps)({
										key: 0,
										ref_for: true
									}, item), null, 16)) : item.type === "number" ? ((0, vue.openBlock)(), (0, vue.createBlock)(NumberComp_default, (0, vue.mergeProps)({
										key: 1,
										ref_for: true
									}, item), null, 16)) : item.type === "string" ? ((0, vue.openBlock)(), (0, vue.createBlock)(StringComp_default, (0, vue.mergeProps)({
										key: 2,
										ref_for: true
									}, item), null, 16)) : item.type === "editor" ? ((0, vue.openBlock)(), (0, vue.createBlock)(EditorComp_default, (0, vue.mergeProps)({
										key: 3,
										ref_for: true
									}, item, { onEdit: handleEdit }), null, 16)) : item.type === "list" ? ((0, vue.openBlock)(), (0, vue.createBlock)(ListComp_default, (0, vue.mergeProps)({
										key: 4,
										ref_for: true
									}, item), null, 16)) : (0, vue.createCommentVNode)("", true)]);
								}), 128))]),
								_: 2
							}, 1040)]);
						}), 128))]);
					}), 64)), (0, vue.createVNode)(EditorDialog_default, {
						ref_key: "editorDialogRef",
						ref: editorDialogRef
					}, null, 512)]),
					_: 1
				}, 16, ["onClose"])), [[vue.vShow, (0, vue.unref)(store).isShow]]);
			};
		}
	});
	var _hoisted_1$1 = ["onClick"];
	var _hoisted_2 = { class: "text-center text-[13px] leading-4 select-none" };
	var _hoisted_3 = { class: "text-center text-[13px] leading-4 select-none" };
	var SideBtnView_default = (0, vue.defineComponent)({
		__name: "SideBtnView",
		setup(__props) {
			const ruleStore = useRulePanelStore();
			const videoStore = useVideoFilterPanelStore();
			const commentStore = useCommentFilterPanelStore();
			const dynamicStore = useDynamicFilterPanelStore();
			const sideBtnStore = useSideBtnStore();
			const target = (0, vue.ref)(null);
			const { width, height } = useElementBounding(target, { windowScroll: false });
			const btnPos = useStorage("bili-cleaner-side-btn-pos", {
				right: 10,
				bottom: 180
			}, localStorage);
			const isDragging = (0, vue.ref)(false);
			const windowSize = useWindowSize({ includeScrollbar: false });
			const maxPos = (0, vue.computed)(() => {
				return {
					x: windowSize.width.value - width.value,
					y: windowSize.height.value - height.value
				};
			});
			const buttons = [
				{
					text: (0, vue.computed)(() => isDarkMode.value ? "日间模式" : "夜间模式"),
					defaultHidden: true,
					isValid: true,
					click: toggleDarkMode
				},
				{
					text: (0, vue.ref)("动态过滤"),
					defaultHidden: true,
					isValid: dynamicStore.isPageValid(),
					click: () => dynamicStore.toggle()
				},
				{
					text: (0, vue.ref)("评论过滤"),
					defaultHidden: true,
					isValid: commentStore.isPageValid(),
					click: () => commentStore.toggle()
				},
				{
					text: (0, vue.ref)("视频过滤"),
					defaultHidden: true,
					isValid: videoStore.isPageValid(),
					click: () => videoStore.toggle()
				},
				{
					text: (0, vue.ref)("页面净化"),
					defaultHidden: false,
					isValid: ruleStore.isPageValid(),
					click: () => {
						if (!isDragging.value) ruleStore.toggle();
					}
				}
			];
			let rAF = 0;
			useDraggable(target, {
				initialValue: {
					x: windowSize.width.value - btnPos.value.right,
					y: windowSize.height.value - btnPos.value.bottom
				},
				preventDefault: true,
				handle: (0, vue.computed)(() => target.value),
				onMove: (pos) => {
					isDragging.value = true;
					btnPos.value.right = maxPos.value.x - pos.x;
					btnPos.value.bottom = maxPos.value.y - pos.y;
					cancelAnimationFrame(rAF);
					rAF = requestAnimationFrame(() => {
						if (btnPos.value.right < 0) btnPos.value.right = 0;
						if (btnPos.value.bottom < 0) btnPos.value.bottom = 0;
						if (btnPos.value.bottom > maxPos.value.y) btnPos.value.bottom = maxPos.value.y;
						if (btnPos.value.right > maxPos.value.x) btnPos.value.right = maxPos.value.x;
					});
				},
				onEnd: () => {
					setTimeout(() => {
						isDragging.value = false;
					}, 50);
				}
			});
			return (_ctx, _cache) => {
				return (0, vue.unref)(sideBtnStore).isShow ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: (0, vue.normalizeClass)(["group fixed flex flex-col justify-end will-change-[right,bottom]", [(0, vue.unref)(isDarkMode) ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black", (0, vue.unref)(isPageBangumi)() || (0, vue.unref)(isPageVideo)() ? "z-100" : "z-2000"]]),
					ref_key: "target",
					ref: target,
					style: (0, vue.normalizeStyle)({
						right: (0, vue.unref)(btnPos).right + "px",
						bottom: (0, vue.unref)(btnPos).bottom + "px"
					})
				}, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(buttons.filter((btn) => btn.isValid), (btn, index) => {
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: (0, vue.normalizeClass)(["mt-1 h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:border-none hover:bg-[#00AEEC] hover:text-white", [(0, vue.unref)(isDarkMode) ? "border-[#2f3134] bg-[#242628]" : "border-gray-200 bg-white", btn.defaultHidden && !isDragging.value ? "hidden group-hover:flex" : "flex"]]),
						key: index,
						onClick: ($event) => btn.click()
					}, [(0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("p", _hoisted_2, (0, vue.toDisplayString)(btn.text.value.substring(0, 2)), 1), (0, vue.createElementVNode)("p", _hoisted_3, (0, vue.toDisplayString)(btn.text.value.substring(2, 4)), 1)])], 10, _hoisted_1$1);
				}), 128))], 6)) : (0, vue.createCommentVNode)("", true);
			};
		}
	});
	var VideoFilterPanelView_default = (0, vue.defineComponent)({
		__name: "VideoFilterPanelView",
		setup(__props) {
			const store = useVideoFilterPanelStore();
			const editorDialogRef = (0, vue.ref)(null);
			const handleEdit = (item) => {
				editorDialogRef.value?.openEditor(item);
			};
			let currPageGroups = [];
			for (const videoFilter of videoFilters) if (videoFilter.checkFn()) currPageGroups = [...currPageGroups, ...videoFilter.groups];
			return (_ctx, _cache) => {
				return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(PanelComp_default, (0, vue.mergeProps)({
					title: "视频过滤",
					widthPercent: 28,
					heightPercent: 85,
					minWidth: 360,
					minHeight: 600
				}, { onClose: (0, vue.unref)(store).hide }), {
					default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(currPageGroups), (group, index) => {
						return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: index }, [(0, vue.createVNode)(DisclosureComp_default, (0, vue.mergeProps)({ ref_for: true }, {
							title: group.name,
							isFold: group.fold
						}), {
							default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(group.items, (item, innerIndex) => {
								return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: innerIndex }, [item.type === "switch" ? ((0, vue.openBlock)(), (0, vue.createBlock)(SwitchComp_default, (0, vue.mergeProps)({
									key: 0,
									ref_for: true
								}, item), null, 16)) : item.type === "number" ? ((0, vue.openBlock)(), (0, vue.createBlock)(NumberComp_default, (0, vue.mergeProps)({
									key: 1,
									ref_for: true
								}, item), null, 16)) : item.type === "string" ? ((0, vue.openBlock)(), (0, vue.createBlock)(StringComp_default, (0, vue.mergeProps)({
									key: 2,
									ref_for: true
								}, item), null, 16)) : item.type === "editor" ? ((0, vue.openBlock)(), (0, vue.createBlock)(EditorComp_default, (0, vue.mergeProps)({
									key: 3,
									ref_for: true
								}, item, { onEdit: handleEdit }), null, 16)) : item.type === "list" ? ((0, vue.openBlock)(), (0, vue.createBlock)(ListComp_default, (0, vue.mergeProps)({
									key: 4,
									ref_for: true
								}, item), null, 16)) : (0, vue.createCommentVNode)("", true)]);
							}), 128))]),
							_: 2
						}, 1040)]);
					}), 128)), (0, vue.createVNode)(EditorDialog_default, {
						ref_key: "editorDialogRef",
						ref: editorDialogRef
					}, null, 512)]),
					_: 1
				}, 16, ["onClose"])), [[vue.vShow, (0, vue.unref)(store).isShow]]);
			};
		}
	});
	var _hoisted_1 = { class: "text-base" };
	var App_default = (0, vue.defineComponent)({
		__name: "App",
		setup(__props) {
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1, [
					(0, vue.createVNode)(RulePanelView_default),
					(0, vue.createVNode)(VideoFilterPanelView_default),
					(0, vue.createVNode)(CommentFilterPanelView_default),
					(0, vue.createVNode)(DynamicFilterPanelView_default),
					(0, vue.createVNode)(ContextMenuView_default),
					(0, vue.createVNode)(SideBtnView_default)
				]);
			};
		}
	});
	var waitForHead = () => {
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
			observer.observe(document, {
				childList: true,
				subtree: true
			});
		});
	};
	var waitForBody = () => {
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
			observer.observe(document, {
				childList: true,
				subtree: true
			});
		});
	};
	var loadSwitchItem = (item) => {
		if (_GM_getValue(item.id, item.defaultEnable)) {
			if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
			if (item.enableFn) if (item.enableFnRunAt === "document-end" && document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => {
				item.enableFn()?.catch(() => {});
			});
			else item.enableFn()?.catch(() => {});
		}
	};
	var loadNumberItem = (item) => {
		const value = _GM_getValue(item.id, item.defaultValue);
		if (value !== item.disableValue) {
			if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
			item.fn(value)?.catch(() => {});
		}
	};
	var loadStringItem = (item) => {
		const value = _GM_getValue(item.id, item.defaultValue);
		if (value !== item.disableValue) {
			if (!item.noStyle) document.documentElement.setAttribute(item.attrName ?? item.id, "");
			item.fn(value)?.catch(() => {});
		}
	};
	var loadListItem = (item) => {
		const value = _GM_getValue(item.id, item.defaultValue);
		for (const option of item.options) if (option.value === value && option.fn) option.fn()?.catch(() => {});
		if (value !== item.disableValue) document.documentElement.setAttribute(item.id, value);
	};
	var loadRules = () => {
		for (const rule of rules) if (rule.checkFn()) for (const group of rule.groups) for (const item of group.items) try {
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
			logger.error(`loadRules load item failed, id=${item.id}, name=${item.name}, type=${item.type}`, err);
		}
	};
	var loadFilters = () => {
		const filters = [
			...videoFilters,
			...commentFilters,
			...dynamicFilters
		];
		for (const filter of filters) if (filter.checkFn()) try {
			filter.entry();
			for (const group of filter.groups) for (const item of group.items) switch (item.type) {
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
			logger.error(`loadFilters filter ${filter.name} error`, err);
		}
	};
	var loadRulesHotKey = () => {
		try {
			let isEnable = true;
			const toggle = () => {
				const cssNodes = document.querySelectorAll("style.bili-cleaner-css");
				if (isEnable) for (const node of cssNodes) node.innerHTML = "/*" + node.innerHTML + "*/";
				else for (const node of cssNodes) node.innerHTML = node.innerHTML.replace(/^\/\*[\s\n]*|[\s\n]*\*\/$/g, "");
				isEnable = !isEnable;
			};
			useMagicKeys({
				passive: false,
				onEventFired(e) {
					if (e.type === "keydown" && e.altKey && e.key.toLocaleLowerCase() === "b") {
						e.preventDefault();
						toggle();
					}
				}
			});
		} catch (err) {
			logger.error(`loadRulesHotKey error`, err);
		}
	};
	var loadModules = () => {
		waitForHead().then(() => {
			loadRuleStyle();
			loadFilterStyle();
			logger.info("load style done");
		});
		loadRules();
		loadRulesHotKey();
		logger.info("loadRules done");
		loadFilters();
		logger.info("loadFilters done");
	};
	var style_css_default = _virtual_monkey_style_tools_default("/*! tailwindcss v4.3.0 | MIT License | https://tailwindcss.com */\n@layer properties{*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-duration:initial;--tw-ease:initial}}@layer theme{:host,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-red-500:oklch(63.7% .237 25.331);--color-orange-900:oklch(40.8% .123 38.172);--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-900:oklch(37.9% .146 265.522);--color-indigo-500:oklch(58.5% .233 277.117);--color-purple-100:oklch(94.6% .033 307.174);--color-purple-500:oklch(62.7% .265 303.9);--color-purple-600:oklch(55.8% .288 302.321);--color-purple-900:oklch(38.1% .176 304.987);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-black:#000;--color-white:#fff;--spacing:4px;--text-sm:14px;--text-sm--line-height:calc(1.25 / .875);--text-base:16px;--text-base--line-height:calc(1.5 / 1);--text-xl:20px;--text-xl--line-height:calc(1.75 / 1.25);--font-weight-normal:400;--font-weight-medium:500;--font-weight-bold:700;--font-weight-black:900;--radius-md:6px;--radius-lg:8px;--radius-xl:12px;--ease-in:cubic-bezier(.4, 0, 1, 1);--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}:host{font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important}input[type=number]::-webkit-inner-spin-button{appearance:none;margin:0}input[type=number]::-webkit-outer-spin-button{appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-y-0{inset-block:calc(var(--spacing) * 0)}.top-0{top:calc(var(--spacing) * 0)}.right-0{right:calc(var(--spacing) * 0)}.left-0{left:calc(var(--spacing) * 0)}.z-10{z-index:10}.z-100{z-index:100}.z-2000{z-index:2000}.z-100000{z-index:100000}.z-10000000{z-index:10000000}.container{width:100%}@media (width>=40rem){.container{max-width:640px}}@media (width>=48rem){.container{max-width:768px}}@media (width>=64rem){.container{max-width:1024px}}@media (width>=80rem){.container{max-width:1280px}}@media (width>=96rem){.container{max-width:1536px}}.m-0\\.5{margin:calc(var(--spacing) * .5)}.m-1{margin:calc(var(--spacing) * 1)}.mx-2{margin-inline:calc(var(--spacing) * 2)}.mx-auto{margin-inline:auto}.my-1{margin-block:calc(var(--spacing) * 1)}.mt-1{margin-top:calc(var(--spacing) * 1)}.mr-0\\.5{margin-right:calc(var(--spacing) * .5)}.mr-1{margin-right:calc(var(--spacing) * 1)}.mb-0\\.5{margin-bottom:calc(var(--spacing) * .5)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-4{margin-left:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.block{display:block}.contents{display:contents}.flex{display:flex}.hidden{display:none}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-10{height:calc(var(--spacing) * 10)}.h-fit{height:fit-content}.max-h-60{max-height:calc(var(--spacing) * 60)}.min-h-\\[calc\\(100\\%-2\\.5rem\\)\\]{min-height:calc(100% - 40px)}.w-1\\/5{width:20%}.w-2\\/5{width:40%}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-10{width:calc(var(--spacing) * 10)}.w-11{width:calc(var(--spacing) * 11)}.w-full{width:100%}.flex-1{flex:1}.translate-x-1{--tw-translate-x:calc(var(--spacing) * 1);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-6{--tw-translate-x:calc(var(--spacing) * 6);translate:var(--tw-translate-x) var(--tw-translate-y)}.rotate-90{rotate:90deg}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.cursor-default{cursor:default}.cursor-move{cursor:move}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.self-center{align-self:center}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overscroll-none{overscroll-behavior:none}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-\\[\\#2f3134\\]{border-color:#2f3134}.border-gray-200{border-color:var(--color-gray-200)}.border-gray-300{border-color:var(--color-gray-300)}.bg-\\[\\#00AEEC\\]{background-color:#00aeec}.bg-\\[\\#242628\\]{background-color:#242628}.bg-blue-100\\/60{background-color:#dbeafe99}@supports (color:color-mix(in lab, red, red)){.bg-blue-100\\/60{background-color:color-mix(in oklab, var(--color-blue-100) 60%, transparent)}}.bg-gray-200{background-color:var(--color-gray-200)}.bg-purple-100{background-color:var(--color-purple-100)}.bg-purple-100\\/60{background-color:#f3e8ff99}@supports (color:color-mix(in lab, red, red)){.bg-purple-100\\/60{background-color:color-mix(in oklab, var(--color-purple-100) 60%, transparent)}}.bg-white{background-color:var(--color-white)}.p-1{padding:calc(var(--spacing) * 1)}.p-1\\.5{padding:calc(var(--spacing) * 1.5)}.p-2{padding:calc(var(--spacing) * 2)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-4{padding-inline:calc(var(--spacing) * 4)}.py-1{padding-block:calc(var(--spacing) * 1)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pr-2{padding-right:calc(var(--spacing) * 2)}.pr-4{padding-right:calc(var(--spacing) * 4)}.pl-1{padding-left:calc(var(--spacing) * 1)}.pl-3{padding-left:calc(var(--spacing) * 3)}.pl-9{padding-left:calc(var(--spacing) * 9)}.pl-10{padding-left:calc(var(--spacing) * 10)}.text-center{text-align:center}.text-left{text-align:left}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-\\[13px\\]{font-size:13px}.text-\\[15px\\]{font-size:15px}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.leading-6{--tw-leading:calc(var(--spacing) * 6);line-height:calc(var(--spacing) * 6)}.font-black{--tw-font-weight:var(--font-weight-black);font-weight:var(--font-weight-black)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.text-black{color:var(--color-black)}.text-black\\/50{color:#00000080}@supports (color:color-mix(in lab, red, red)){.text-black\\/50{color:color-mix(in oklab, var(--color-black) 50%, transparent)}}.text-blue-500{color:var(--color-blue-500)}.text-blue-900{color:var(--color-blue-900)}.text-gray-400{color:var(--color-gray-400)}.text-gray-500{color:var(--color-gray-500)}.text-gray-800{color:var(--color-gray-800)}.text-gray-900{color:var(--color-gray-900)}.text-orange-900{color:var(--color-orange-900)}.text-purple-500{color:var(--color-purple-500)}.text-purple-600{color:var(--color-purple-600)}.text-purple-900{color:var(--color-purple-900)}.text-white{color:var(--color-white)}.text-white\\/50{color:#ffffff80}@supports (color:color-mix(in lab, red, red)){.text-white\\/50{color:color-mix(in oklab, var(--color-white) 50%, transparent)}}.opacity-0{opacity:0}.opacity-100{opacity:1}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.ring-1{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.shadow-black\\/20{--tw-shadow-color:#0003}@supports (color:color-mix(in lab, red, red)){.shadow-black\\/20{--tw-shadow-color:color-mix(in oklab, color-mix(in oklab, var(--color-black) 20%, transparent) var(--tw-shadow-alpha), transparent)}}.ring-black\\/5{--tw-ring-color:#0000000d}@supports (color:color-mix(in lab, red, red)){.ring-black\\/5{--tw-ring-color:color-mix(in oklab, var(--color-black) 5%, transparent)}}.outline-hidden{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.outline-hidden{outline-offset:2px;outline:2px solid #0000}}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-100{--tw-duration:.1s;transition-duration:.1s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.will-change-\\[right\\,bottom\\]{will-change:right,bottom}.will-change-\\[top\\,left\\]{will-change:top,left}.select-none{-webkit-user-select:none;user-select:none}@media (hover:hover){.group-hover\\:flex:is(:where(.group):hover *){display:flex}}.invalid\\:border-2:invalid{border-style:var(--tw-border-style);border-width:2px}.invalid\\:border-red-500:invalid{border-color:var(--color-red-500)}@media (hover:hover){.hover\\:rounded-full:hover{border-radius:3.40282e38px}.hover\\:border-none:hover{--tw-border-style:none;border-style:none}.hover\\:bg-\\[\\#00AEEC\\]:hover,.hover\\:bg-\\[\\#00aeec\\]:hover{background-color:#00aeec}.hover\\:bg-blue-50\\/50:hover{background-color:#eff6ff80}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-blue-50\\/50:hover{background-color:color-mix(in oklab, var(--color-blue-50) 50%, transparent)}}.hover\\:bg-blue-100:hover{background-color:var(--color-blue-100)}.hover\\:bg-purple-100:hover{background-color:var(--color-purple-100)}.hover\\:bg-white\\/40:hover{background-color:#fff6}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-white\\/40:hover{background-color:color-mix(in oklab, var(--color-white) 40%, transparent)}}.hover\\:text-black:hover{color:var(--color-black)}.hover\\:text-white:hover{color:var(--color-white)}}.focus\\:border-gray-400:focus{border-color:var(--color-gray-400)}.focus\\:border-gray-500:focus{border-color:var(--color-gray-500)}.focus\\:outline-hidden:focus{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.focus\\:outline-hidden:focus{outline-offset:2px;outline:2px solid #0000}}.focus\\:invalid\\:border-red-500:focus:invalid{border-color:var(--color-red-500)}.focus-visible\\:border-indigo-500:focus-visible{border-color:var(--color-indigo-500)}@media (width>=40rem){.sm\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}}}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@property --tw-ease{syntax:\"*\";inherits:false}");
	var migrate = async () => {
		if (_GM_getValue("__MIGRATED__") === "4.4.0") return;
		const prefix = "BILICLEANER_";
		const keys = _GM_listValues().filter((key) => key.startsWith(prefix));
		for (const key of keys) _GM_setValue(key.slice(12), _GM_getValue(key));
		keys.forEach((key) => _GM_deleteValue(key));
		logger.info(`Migrate ${keys.length} storage keys`);
		for (const [key, valueMap] of Object.entries({
			"channel-layout": {
				"channel-layout-disable": "0",
				"channel-layout-2-column": "2",
				"channel-layout-3-column": "3",
				"channel-layout-4-column": "4",
				"channel-layout-5-column": "5",
				"channel-layout-6-column": "6"
			},
			"homepage-layout": {
				"homepage-layout-disable": "0",
				"homepage-layout-2-column": "2",
				"homepage-layout-3-column": "3",
				"homepage-layout-4-column": "4",
				"homepage-layout-5-column": "5",
				"homepage-layout-6-column": "6"
			},
			"popular-layout": {
				"popular-layout-disable": "0",
				"popular-layout-2-column": "2",
				"popular-layout-3-column": "3",
				"popular-layout-4-column": "4",
				"popular-layout-5-column": "5",
				"popular-layout-6-column": "6"
			},
			"watchlater-layout": {
				"watchlater-layout-disable": "0",
				"watchlater-layout-4-column": "4",
				"watchlater-layout-5-column": "5"
			},
			"common-theme-dark": {
				"common-theme-dark-off": "off",
				"common-theme-dark-on": "on",
				"common-theme-dark-auto": "auto",
				"common-theme-dark-default": "default"
			}
		})) {
			const value = _GM_getValue(key);
			if (value in valueMap) _GM_setValue(key, valueMap[value]);
		}
		logger.info(`Convert storage values complete`);
		_GM_setValue("__MIGRATED__", "4.4.0");
		logger.info(`Migrate storage complete`);
	};
	var main = () => {
		const wrap = document.createElement("div");
		wrap.id = "bili-cleaner";
		const root = wrap.attachShadow({ mode: "open" });
		root.append(style_css_default);
		waitForBody().then(() => document.body.appendChild(wrap));
		const app = (0, vue.createApp)(App_default);
		app.config.errorHandler = (err, vm, info) => {
			logger.error("Vue:", err);
			logger.error("Component:", vm);
			logger.error("Info:", info);
		};
		const pinia = createPinia();
		app.use(pinia);
		app.mount((() => {
			const node = document.createElement("div");
			root.appendChild(node);
			return node;
		})());
	};
	var menu = () => {
		if (isPageLive() && self !== top) return;
		const ruleStore = useRulePanelStore();
		const videoStore = useVideoFilterPanelStore();
		const commentStore = useCommentFilterPanelStore();
		const dynamicStore = useDynamicFilterPanelStore();
		const sideBtnStore = useSideBtnStore();
		_GM_registerMenuCommand("✅ 页面净化优化", () => {
			ruleStore.toggle();
		});
		if (videoStore.isPageValid()) _GM_registerMenuCommand("✅ 视频过滤设置", () => {
			videoStore.toggle();
		});
		else _GM_registerMenuCommand("🚫 视频过滤设置", () => {
			alert("[bilibili-cleaner] 本页面不支持视频过滤");
		});
		if (commentStore.isPageValid()) _GM_registerMenuCommand("✅ 评论过滤设置", () => {
			commentStore.toggle();
		});
		else _GM_registerMenuCommand("🚫 评论过滤设置", () => {
			alert("[bilibili-cleaner] 本页面不支持评论过滤");
		});
		if (dynamicStore.isPageValid()) _GM_registerMenuCommand("✅ 动态过滤设置", () => {
			dynamicStore.toggle();
		});
		else _GM_registerMenuCommand("🚫 动态过滤设置", () => {
			alert("[bilibili-cleaner] 本页面不支持动态过滤");
		});
		_GM_registerMenuCommand("⚡ 夜间模式开关", () => {
			toggleDarkMode();
		});
		_GM_registerMenuCommand("⚡ 快捷按钮开关", () => {
			sideBtnStore.toggle();
		});
	};
	logger.info(`mode: production, url: ${location.href}`);
	await(migrate().catch((err) => {
		logger.error("Storage key migration failed", err);
	}));
	for (const fn of [
		loadModules,
		main,
		menu
	]) try {
		fn();
	} catch (err) {
		logger.error(`main.ts ${fn.name} error`, err);
	}
})(Vue);
