/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ed6d4d3190294fcfd03f"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/app.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
// Needed for redux-saga es6 generator support
__webpack_require__("./node_modules/babel-polyfill/lib/index.js");
// Import all the third party stuff
var React = __webpack_require__("./node_modules/react/index.js");
var ReactDOM = __webpack_require__("./node_modules/react-dom/index.js");
__webpack_require__("./node_modules/sanitize.css/sanitize.css");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
// Import root app
var App_1 = __webpack_require__("./app/containers/App/index.ts");
// Import Language Provider
var LanguageProvider_1 = __webpack_require__("./app/containers/LanguageProvider/index.ts");
// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/favicon.ico");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-72x72.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-96x96.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-128x128.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-144x144.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-152x152.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-192x192.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-384x384.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-512x512.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/manifest.json");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/.htaccess");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/clinwiki-50.png");
__webpack_require__("./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/heading.png");
__webpack_require__("./node_modules/react-toggle/style.css");
__webpack_require__("./node_modules/react-bootstrap-typeahead/css/Typeahead.css");
/* eslint-enable import/no-unresolved, import/extensions */
var configureApollo_1 = __webpack_require__("./app/configureApollo.ts");
// Import i18n messages
var i18n_1 = __webpack_require__("./app/i18n.ts");
// Import CSS reset and Global Styles
__webpack_require__("./app/global-styles.ts");
var MOUNT_NODE = document.getElementById('app');
var alertOptions = {
    position: 'top right',
    theme: 'light',
    transition: 'scale',
    timeout: 5000,
    offset: '14',
};
var render = function (messages) {
    ReactDOM.render(React.createElement(LanguageProvider_1.default, { messages: messages, locale: "en" },
        React.createElement(react_router_dom_1.BrowserRouter, null,
            React.createElement(react_apollo_1.ApolloProvider, { client: configureApollo_1.default },
                React.createElement(App_1.default, null)))), MOUNT_NODE);
};
// @ts-ignore
if (true) {
    // @ts-ignore
    module.hot.accept(["./app/i18n.ts", "./app/containers/App/index.ts"], function () {
        // @ts-ignore
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render(i18n_1.translationMessages);
    });
}
// Chunked polyfill for browsers without Intl support
// @ts-ignore
if (window && !window.Intl) {
    new Promise(function (resolve) {
        resolve(Promise.resolve().then(function () { return __webpack_require__("./node_modules/intl/index.js"); }));
    })
        .then(function () { return Promise.all([Promise.resolve().then(function () { return __webpack_require__("./node_modules/intl/locale-data/jsonp/en.js"); })]); })
        .then(function () { return render(i18n_1.translationMessages); })
        .catch(function (err) {
        throw err;
    });
}
else {
    render(i18n_1.translationMessages);
}
// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   require('offline-plugin/runtime').install(); // eslint-disable-line global-require
// }
// Explicitly uninstall serviceworker
if (false) {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            var e_1, _a;
            try {
                for (var registrations_1 = __values(registrations), registrations_1_1 = registrations_1.next(); !registrations_1_1.done; registrations_1_1 = registrations_1.next()) {
                    var reg = registrations_1_1.value;
                    console.log('Unregistering service worker');
                    reg.unregister();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (registrations_1_1 && !registrations_1_1.done && (_a = registrations_1.return)) _a.call(registrations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}


/***/ }),

/***/ "./app/components/AuthButton/AuthButton.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var auth_1 = __webpack_require__("./app/utils/auth.ts");
var ButtonWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 7px;\n"], ["\n  margin-top: 7px;\n"])));
var AuthButton = /** @class */ (function (_super) {
    __extends(AuthButton, _super);
    function AuthButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSitesClick = function () {
            _this.props.history.push('/sites');
        };
        _this.handleProfileClick = function () {
            _this.props.history.push('/profile');
        };
        _this.handleWorkflowsClick = function () {
            _this.props.history.push('/workflows');
        };
        _this.handleSignOutClick = function () {
            auth_1.logout(_this.props.history);
        };
        return _this;
    }
    AuthButton.prototype.render = function () {
        if (!this.props.user) {
            return (React.createElement("li", null,
                React.createElement("p", { className: "navbar-btn" },
                    React.createElement("a", { href: "/sign_in", className: "btn btn-default" }, "Sign in"))));
        }
        return (React.createElement(ButtonWrapper, { className: "pull-right" },
            React.createElement(react_bootstrap_1.DropdownButton, { title: (this.props.user && this.props.user.email) || '', id: "loggedIn" },
                React.createElement(react_bootstrap_1.MenuItem, { onClick: this.handleSitesClick }, "Sites"),
                this.props.user && this.props.user.roles.includes('admin') && (React.createElement(react_bootstrap_1.MenuItem, { onClick: this.handleWorkflowsClick }, "Workflows")),
                React.createElement(react_bootstrap_1.MenuItem, { onClick: this.handleProfileClick }, "Profile"),
                React.createElement(react_bootstrap_1.MenuItem, { onClick: this.handleSignOutClick }, "Log Out"))));
    };
    return AuthButton;
}(React.PureComponent));
exports.default = AuthButton;
var templateObject_1;


/***/ }),

/***/ "./app/components/AuthButton/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AuthButton_1 = __webpack_require__("./app/components/AuthButton/AuthButton.tsx");
exports.default = AuthButton_1.default;


/***/ }),

/***/ "./app/components/AuthHeader/AuthHeader.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var AuthButton_1 = __webpack_require__("./app/components/AuthButton/index.ts");
var StyledWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  nav.navbar {\n    background: #1b2a38;\n    margin-bottom: 0px;\n    border: 0px;\n    border-radius: 0px;\n  }\n\n  nav.navbar a.logo {\n    color: #fff;\n  }\n  a:hover {\n    color: #fff !important;\n  }\n\n  a#logo {\n    background: url(\"/clinwiki-50.png\") center left no-repeat;\n    background-size: 25px 25px;\n    margin-left: 1px;\n    padding-left: 30px;\n    color: #fff;\n  }\n  span#small {\n    font-size: 14px;\n    opacity: 0.75;\n  }\n"], ["\n  nav.navbar {\n    background: #1b2a38;\n    margin-bottom: 0px;\n    border: 0px;\n    border-radius: 0px;\n  }\n\n  nav.navbar a.logo {\n    color: #fff;\n  }\n  a:hover {\n    color: #fff !important;\n  }\n\n  a#logo {\n    background: url(\"/clinwiki-50.png\") center left no-repeat;\n    background-size: 25px 25px;\n    margin-left: 1px;\n    padding-left: 30px;\n    color: #fff;\n  }\n  span#small {\n    font-size: 14px;\n    opacity: 0.75;\n  }\n"])));
var AuthHeader = /** @class */ (function (_super) {
    __extends(AuthHeader, _super);
    function AuthHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthHeader.prototype.render = function () {
        return (React.createElement(StyledWrapper, null,
            React.createElement(react_bootstrap_1.Navbar, { collapseOnSelect: true, fluid: true, className: "navbar-fixed-top", style: { paddingLeft: "15px", paddingRight: "15px" } },
                React.createElement(react_bootstrap_1.Navbar.Header, null,
                    React.createElement(react_bootstrap_1.Navbar.Brand, null,
                        React.createElement(react_router_dom_1.Link, { id: "logo", to: "/search/default" },
                            "ClinWiki ",
                            React.createElement("span", { id: "small" }, "(beta)"))),
                    React.createElement(react_bootstrap_1.Navbar.Toggle, null)),
                React.createElement(react_bootstrap_1.Navbar.Collapse, null,
                    React.createElement(react_bootstrap_1.Nav, { pullRight: true },
                        true ? null : (React.createElement(react_bootstrap_1.NavItem, { eventKey: 1, href: "/search/default" }, "Search")),
                        React.createElement(react_bootstrap_1.NavItem, { eventKey: 1, href: "/about" }, "About"),
                        React.createElement(AuthButton_1.default, { user: this.props.user, history: this.props.history }))))));
    };
    return AuthHeader;
}(React.PureComponent));
exports.AuthHeader = AuthHeader;
exports.default = AuthHeader;
var templateObject_1;


/***/ }),

/***/ "./app/components/AuthHeader/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AuthHeader_1 = __webpack_require__("./app/components/AuthHeader/AuthHeader.tsx");
exports.default = AuthHeader_1.default;


/***/ }),

/***/ "./app/components/CollapsiblePanel/CollapsiblePanel.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var react_transition_group_1 = __webpack_require__("./node_modules/react-transition-group/index.js");
var StyleWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .panel-heading {\n    cursor: pointer;\n    ", "\n  }\n"], ["\n  .panel-heading {\n    cursor: pointer;\n    ",
    "\n  }\n"])), function (props) {
    return props.dropdown
        ? 'background: #f5f5f5 !important; padding: 10px 15px !important; color: #333 !important'
        : '';
});
var StyledPanelBody = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  transition: all 0.2s ease-in;\n  overflow: hidden;\n  max-height: 0;\n  &.transition-enter {\n    max-height: 0;\n  }\n  &.transition-enter-active {\n    max-height: 400px;\n  }\n  &.transition-enter-done {\n    max-height: none;\n  }\n  &.transition-exit {\n    max-height: 400px;\n  }\n  &.transition-exit-active {\n    max-height: 0;\n  }\n  &.transition-exit-done {\n    max-height: 0;\n  }\n"], ["\n  transition: all 0.2s ease-in;\n  overflow: hidden;\n  max-height: 0;\n  &.transition-enter {\n    max-height: 0;\n  }\n  &.transition-enter-active {\n    max-height: 400px;\n  }\n  &.transition-enter-done {\n    max-height: none;\n  }\n  &.transition-exit {\n    max-height: 400px;\n  }\n  &.transition-exit-active {\n    max-height: 0;\n  }\n  &.transition-exit-done {\n    max-height: 0;\n  }\n"])));
var CollapsiblePanel = /** @class */ (function (_super) {
    __extends(CollapsiblePanel, _super);
    function CollapsiblePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            summaryVisible: true,
            prevCollapsed: false,
        };
        return _this;
    }
    CollapsiblePanel.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyleWrapper, __assign({}, this.props),
            React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, { onClick: function () {
                        return _this.setState({ summaryVisible: !_this.state.summaryVisible });
                    }, title: this.state.summaryVisible
                        ? 'Click to hide details'
                        : 'Click to show details' },
                    React.createElement(react_bootstrap_1.Panel.Title, { componentClass: "h3", className: "pull-left", style: { fontSize: '18px' } },
                        React.createElement(FontAwesome, { name: this.state.summaryVisible ? 'chevron-up' : 'chevron-down', className: "pull-left", style: { fontSize: '14px' } }),
                        this.props.header),
                    "\u00A0"),
                React.createElement(react_transition_group_1.CSSTransition, { in: this.state.summaryVisible, timeout: 200, appear: true, classNames: "transition" },
                    React.createElement(StyledPanelBody, null,
                        React.createElement(react_bootstrap_1.Panel.Body, null, this.props.children))))));
    };
    CollapsiblePanel.getDerivedStateFromProps = function (props, state) {
        if (props.collapsed !== undefined &&
            props.collapsed !== state.prevCollapsed) {
            return {
                summaryVisible: !props.collapsed,
                prevCollapsed: !!props.collapsed,
            };
        }
        return null;
    };
    return CollapsiblePanel;
}(React.Component));
exports.default = CollapsiblePanel;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/CollapsiblePanel/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/CollapsiblePanel.tsx");
exports.default = CollapsiblePanel_1.default;


/***/ }),

/***/ "./app/components/Edits/Edits.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
// these are the styles provided by diffy, btw
var StyleWrapper = styled_components_1.default(react_bootstrap_1.Table)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .diff {\n    overflow: auto;\n  }\n  .diff ul {\n    background: none;\n    overflow: auto;\n    font-size: 13px;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    display: table;\n    width: 100%;\n  }\n  .diff del,\n  .diff ins {\n    display: block;\n    text-decoration: none;\n  }\n  .diff li {\n    padding: 0;\n    display: table-row;\n    margin: 0;\n    height: 1em;\n  }\n  .diff li.ins {\n    background: #dfd;\n    color: #080;\n  }\n  .diff li.del {\n    background: #fee;\n    color: #b00;\n  }\n  .diff li:hover {\n    background: #ffc;\n  }\n  /* try 'whitespace:pre;' if you don't want lines to wrap */\n  .diff del,\n  .diff ins,\n  .diff span {\n    white-space: pre-wrap;\n    font-family: courier;\n  }\n  .diff del strong {\n    font-weight: normal;\n    background: #fcc;\n  }\n  .diff ins strong {\n    font-weight: normal;\n    background: #9f9;\n  }\n  .diff li.diff-comment {\n    display: none;\n  }\n  .diff li.diff-block-info {\n    background: none repeat scroll 0 0 gray;\n  }\n"], ["\n  .diff {\n    overflow: auto;\n  }\n  .diff ul {\n    background: none;\n    overflow: auto;\n    font-size: 13px;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    display: table;\n    width: 100%;\n  }\n  .diff del,\n  .diff ins {\n    display: block;\n    text-decoration: none;\n  }\n  .diff li {\n    padding: 0;\n    display: table-row;\n    margin: 0;\n    height: 1em;\n  }\n  .diff li.ins {\n    background: #dfd;\n    color: #080;\n  }\n  .diff li.del {\n    background: #fee;\n    color: #b00;\n  }\n  .diff li:hover {\n    background: #ffc;\n  }\n  /* try 'whitespace:pre;' if you don't want lines to wrap */\n  .diff del,\n  .diff ins,\n  .diff span {\n    white-space: pre-wrap;\n    font-family: courier;\n  }\n  .diff del strong {\n    font-weight: normal;\n    background: #fcc;\n  }\n  .diff ins strong {\n    font-weight: normal;\n    background: #9f9;\n  }\n  .diff li.diff-comment {\n    display: none;\n  }\n  .diff li.diff-block-info {\n    background: none repeat scroll 0 0 gray;\n  }\n"])));
var Edits = /** @class */ (function (_super) {
    __extends(Edits, _super);
    function Edits() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getName = function (user) {
            if (!user)
                return 'Anonymous';
            if (user.firstName) {
                return user.firstName + " " + (user.lastName && user.lastName[0]);
            }
            return user.email;
        };
        return _this;
    }
    Edits.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyleWrapper, { striped: true, bordered: true },
            React.createElement("tbody", null, this.props.edits.map(function (edit) { return (React.createElement("tr", { key: edit.id, style: { padding: '10px' } },
                React.createElement("td", null,
                    React.createElement(react_bootstrap_1.Row, { style: { marginBottom: '10px', padding: '10px' } },
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement("b", null, _this.getName(edit.user)),
                            React.createElement("br", null)),
                        React.createElement(react_bootstrap_1.Col, { md: 4 }, edit.comment),
                        React.createElement(react_bootstrap_1.Col, { md: 2, className: "text-right" },
                            React.createElement("small", null, new Date(edit.createdAt).toLocaleDateString('en-US')))),
                    React.createElement(react_bootstrap_1.Row, { style: { padding: '10px', marginBottom: '10px' } },
                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                            React.createElement("div", { dangerouslySetInnerHTML: {
                                    __html: edit.diffHtml || '<p></p>',
                                } })))))); }))));
    };
    Edits.fragment = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    fragment WikiPageEditFragment on WikiPageEdit {\n      user {\n        id\n        firstName\n        lastName\n        email\n      }\n      createdAt\n      id\n      comment\n      diff\n      diffHtml\n    }\n  "], ["\n    fragment WikiPageEditFragment on WikiPageEdit {\n      user {\n        id\n        firstName\n        lastName\n        email\n      }\n      createdAt\n      id\n      comment\n      diff\n      diffHtml\n    }\n  "])));
    return Edits;
}(React.PureComponent));
exports.default = Edits;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/Edits/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Edits_1 = __webpack_require__("./app/components/Edits/Edits.tsx");
exports.default = Edits_1.default;


/***/ }),

/***/ "./app/components/Error/Error.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var Error = /** @class */ (function (_super) {
    __extends(Error, _super);
    function Error() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Error.prototype.render = function () {
        return React.createElement("div", null, this.props.message);
    };
    return Error;
}(React.PureComponent));
exports.default = Error;


/***/ }),

/***/ "./app/components/Error/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Error_1 = __webpack_require__("./app/components/Error/Error.tsx");
exports.default = Error_1.default;


/***/ }),

/***/ "./app/components/Heading/Heading.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var Heading = styled_components_1.default(react_bootstrap_1.Row)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 100px;\n  background: url(heading.png) center center no-repeat scroll;\n  background-size: 400px 120px;\n  padding: 120px;\n"], ["\n  height: 100px;\n  background: url(heading.png) center center no-repeat scroll;\n  background-size: 400px 120px;\n  padding: 120px;\n"])));
exports.default = Heading;
var templateObject_1;


/***/ }),

/***/ "./app/components/Heading/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Heading_1 = __webpack_require__("./app/components/Heading/Heading.ts");
exports.default = Heading_1.default;


/***/ }),

/***/ "./app/components/Intervention/Intervention.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var StyleWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 10px;\n  // color: white;\n  background: #eaedf4;\n  border-radius: 2px;\n  margin-top: 16px;\n  margin-bottom: 16px;\n"], ["\n  padding: 10px;\n  // color: white;\n  background: #eaedf4;\n  border-radius: 2px;\n  margin-top: 16px;\n  margin-bottom: 16px;\n"])));
var Intervention = /** @class */ (function (_super) {
    __extends(Intervention, _super);
    function Intervention() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Intervention.prototype.renderInterventionText = function (name, wikipediaArticle) {
        if (wikipediaArticle) {
            return (React.createElement("div", null,
                React.createElement("h4", null,
                    "Wikipedia entry for",
                    ' ',
                    React.createElement("a", { href: wikipediaArticle.url, target: "_blank" }, wikipediaArticle.title)),
                React.createElement("div", null, wikipediaArticle.description)));
        }
        return (React.createElement("p", null,
            React.createElement("a", { href: "https://en.wikipedia.org/wiki/" + name, target: "_blank" }, "View on Wikipedia")));
    };
    Intervention.prototype.render = function () {
        var _a = this.props.intervention, name = _a.name, description = _a.description, kind = _a.type, wikipediaArticle = _a.wikipediaArticle;
        return (React.createElement(StyleWrapper, null,
            React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 12 },
                    React.createElement("h1", null, helpers_1.capitalize(name || 'No name') + " (" + kind + ")"),
                    description && React.createElement("p", null, description),
                    this.renderInterventionText(name, wikipediaArticle)))));
    };
    Intervention.fragment = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    fragment InterventionFragment on Intervention {\n      id\n      description\n      name\n      type\n      wikipediaArticle {\n        id\n        title\n        description\n        url\n      }\n    }\n  "], ["\n    fragment InterventionFragment on Intervention {\n      id\n      description\n      name\n      type\n      wikipediaArticle {\n        id\n        title\n        description\n        url\n      }\n    }\n  "])));
    return Intervention;
}(React.PureComponent));
exports.default = Intervention;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/Intervention/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Intervention_1 = __webpack_require__("./app/components/Intervention/Intervention.tsx");
exports.default = Intervention_1.default;


/***/ }),

/***/ "./app/components/LoadingPane/LoadingPane.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var LoaderWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 50px 20px;\n\n  text-align: center;\n\n  .well {\n    padding: 50px;\n  }\n"], ["\n  margin: 50px 20px;\n\n  text-align: center;\n\n  .well {\n    padding: 50px;\n  }\n"])));
exports.default = (function () { return (React.createElement(LoaderWrapper, null,
    React.createElement(react_bootstrap_1.Well, null,
        React.createElement(react_spinners_1.BeatLoader, { color: "#cccccc" })))); });
var templateObject_1;


/***/ }),

/***/ "./app/components/LoadingPane/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LoadingPane_1 = __webpack_require__("./app/components/LoadingPane/LoadingPane.tsx");
exports.default = LoadingPane_1.default;


/***/ }),

/***/ "./app/components/MultiCrumb/MultiCrumb.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var crumbKeyframe = styled_components_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  0% {\n    border-color: 4px solid silver;\n    background-color: #66dda9; \n  }\n\n  50% {\n    border-color: 2px solid silver;\n    background-color: #5fce9d;\n  }\n\n  100% {\n    border: 2px solid #55b88d;\n    background-color: #55b88d;\n  }\n"], ["\n  0% {\n    border-color: 4px solid silver;\n    background-color: #66dda9; \n  }\n\n  50% {\n    border-color: 2px solid silver;\n    background-color: #5fce9d;\n  }\n\n  100% {\n    border: 2px solid #55b88d;\n    background-color: #55b88d;\n  }\n"])));
var MultiCrumb = /** @class */ (function (_super) {
    __extends(MultiCrumb, _super);
    function MultiCrumb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showValue: false,
        };
        _this.toggleShowValue = function () {
            var showValue = _this.state.showValue;
            _this.setState({ showValue: !showValue });
        };
        return _this;
    }
    MultiCrumb.prototype.render = function () {
        var _this = this;
        var MultiCrumb = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      .filter-values {\n        background-color: transparent;\n        border: none;\n      }\n      .crumb-container {\n        border: 2px solid #55b88d;\n        border-radius: 4px;\n        padding: 0 5px 0 5px;\n        color: #55b88d;\n        margin: 1px;\n        background: #55b88d;\n        color: #fff !important;\n        line-height: 1.85em;\n        animation: ", " 2s ease-in-out;\n      }\n      .crumb-icon {\n        cursor: pointer;\n        color: #fff;\n        margin: 0 0 0 3px;\n      }\n      .shorten-crumb {\n        background: #55b88d;\n        padding: 3px 6px 3px 1px;\n        border-radius: 4px;\n      }\n    "], ["\n      .filter-values {\n        background-color: transparent;\n        border: none;\n      }\n      .crumb-container {\n        border: 2px solid #55b88d;\n        border-radius: 4px;\n        padding: 0 5px 0 5px;\n        color: #55b88d;\n        margin: 1px;\n        background: #55b88d;\n        color: #fff !important;\n        line-height: 1.85em;\n        animation: ", " 2s ease-in-out;\n      }\n      .crumb-icon {\n        cursor: pointer;\n        color: #fff;\n        margin: 0 0 0 3px;\n      }\n      .shorten-crumb {\n        background: #55b88d;\n        padding: 3px 6px 3px 1px;\n        border-radius: 4px;\n      }\n    "])), crumbKeyframe);
        if (this.props.values.length > 4 && this.state.showValue == false) {
            var addVals = this.props.values.length - 4;
            return (React.createElement(MultiCrumb, null,
                React.createElement(react_bootstrap_1.ListGroupItem, { className: "filter-values" },
                    this.props.category && React.createElement("i", null,
                        this.props.category,
                        ":"),
                    this.props.values.slice(0, 4).map(function (v, i) {
                        var label = _this.props.labels ? _this.props.labels[i] : v;
                        return (React.createElement("b", { key: v },
                            React.createElement("span", { className: "crumb-container" },
                                label,
                                React.createElement(FontAwesome, { className: "remove crumb-icon", name: "remove", onClick: function () { return _this.props.onClick(v); } }))));
                    }),
                    React.createElement("b", null,
                        React.createElement("span", { className: "crumb-container" }, "..." + addVals + " others",
                            React.createElement(FontAwesome, { className: "chevron-right crumb-icon", name: "chevron-right", onClick: function () { return _this.toggleShowValue(); } }))))));
        }
        else if (this.props.values.length > 4 && this.state.showValue == true) {
            return (React.createElement(MultiCrumb, null,
                React.createElement(react_bootstrap_1.ListGroupItem, { className: "filter-values" },
                    this.props.category && React.createElement("i", null,
                        this.props.category,
                        ":"),
                    this.props.values.map(function (v, i) {
                        var label = _this.props.labels ? _this.props.labels[i] : v;
                        return (React.createElement("b", { key: v },
                            React.createElement("span", { className: "crumb-container" },
                                label,
                                React.createElement(FontAwesome, { className: "remove crumb-icon", name: "remove", onClick: function () { return _this.props.onClick(v); } }))));
                    }),
                    React.createElement("b", null,
                        React.createElement("span", { className: "shorten-crumb" },
                            React.createElement(FontAwesome, { className: "chevron-left crumb-icon", name: "chevron-left", onClick: function () { return _this.toggleShowValue(); } }))))));
        }
        else {
            return (React.createElement(MultiCrumb, null,
                React.createElement(react_bootstrap_1.ListGroupItem, { className: "filter-values" },
                    this.props.category && React.createElement("i", null,
                        this.props.category,
                        ":"),
                    this.props.values.map(function (v, i) {
                        var label = _this.props.labels ? _this.props.labels[i] : v;
                        return (React.createElement("b", { key: v },
                            React.createElement("span", { className: "crumb-container" },
                                label,
                                React.createElement(FontAwesome, { className: "remove crumb-icon", name: "remove", onClick: function () { return _this.props.onClick(v); } }))));
                    }))));
        }
    };
    return MultiCrumb;
}(React.Component));
exports.default = MultiCrumb;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/MultiCrumb/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MultiCrumb_1 = __webpack_require__("./app/components/MultiCrumb/MultiCrumb.tsx");
exports.default = MultiCrumb_1.default;


/***/ }),

/***/ "./app/components/MultiInput/MultiInput.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var reject_1 = __webpack_require__("./node_modules/ramda/es/reject.js");
var equals_1 = __webpack_require__("./node_modules/ramda/es/equals.js");
var react_bootstrap_typeahead_1 = __webpack_require__("./node_modules/react-bootstrap-typeahead/lib/index.js");
var MultiCrumb_1 = __webpack_require__("./app/components/MultiCrumb/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var CrumbsContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n"])));
var CrumbContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 15px;\n  span.label {\n    background: #55b88d;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n  }\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n\n  ", "\n"], ["\n  margin-bottom: 15px;\n  span.label {\n    background: #55b88d;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n  }\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n\n  ", "\n"])), function (props) { return (props.draggable ? 'cursor: pointer' : ''); });
var Dropzone = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 15px;\n  ", "\n"], ["\n  width: 15px;\n  ", "\n"])), function (_a) {
    var active = _a.active;
    return (active ? 'width: 70px' : '');
});
var AddContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ul > li > a {\n    color: #333 !important;\n  }\n"], ["\n  ul > li > a {\n    color: #333 !important;\n  }\n"])));
var MultiInput = /** @class */ (function (_super) {
    __extends(MultiInput, _super);
    function MultiInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            dragging: null,
            dropping: null,
        };
        _this.typeahead = React.createRef();
        _this.getLabel = function (id) {
            var option = ramda_1.find(ramda_1.propEq('id', id), _this.props.options || []);
            // fallback
            if (!option)
                return id;
            return option.label;
        };
        _this.handleDelete = function (value) {
            _this.props.onChange({
                currentTarget: {
                    name: _this.props.name,
                    value: reject_1.default(equals_1.default(value), _this.props.value),
                },
            });
        };
        _this.handleChange = function (values) {
            // @ts-ignore
            var newValues = ramda_1.pipe(ramda_1.map(ramda_1.prop('id')), ramda_1.difference(ramda_1.__, _this.props.value)
            // @ts-ignore
            )(values);
            _this.props.onChange({
                currentTarget: {
                    name: _this.props.name,
                    value: __spread(_this.props.value, newValues),
                },
            });
            _this.typeahead.current && _this.typeahead.current.getInstance().clear();
        };
        _this.handleInputChange = function (value) {
            _this.props.onInputChange && _this.props.onInputChange(value);
        };
        _this.handleDragStart = function (e) {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.dataTransfer.dropEffect = 'move';
            _this.setState({ dragging: e.target.id });
        };
        _this.handleDragOver = function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (_this.state.dropping !== e.target.id) {
                _this.setState({ dropping: e.target.id });
            }
        };
        _this.handleDragEnd = function (e) {
            e.preventDefault();
            _this.setState({ dragging: null, dropping: null });
        };
        _this.handleDrop = function (e) {
            e.preventDefault();
            var newValues = _this.props.value.filter(function (value) { return value !== _this.state.dragging; });
            var droppableIndex = ramda_1.findIndex(equals_1.default(_this.state.dropping), newValues);
            _this.state.dragging &&
                newValues.splice(droppableIndex, 0, _this.state.dragging);
            _this.props.onChange({
                currentTarget: { name: _this.props.name, value: newValues },
            });
            _this.setState({ dragging: null, dropping: null });
        };
        return _this;
    }
    MultiInput.prototype.render = function () {
        var _this = this;
        var options = reject_1.default(function (option) { return _this.props.value.includes(option.id); }, this.props.options || []);
        return (React.createElement("div", null,
            React.createElement(CrumbsContainer, null, this.props.value.map(function (value, i) { return (React.createElement(React.Fragment, { key: value },
                (_this.state.dragging || i > 0) && (React.createElement(Dropzone, { id: value, active: _this.state.dropping === value, onDragOver: _this.handleDragOver, onDrop: _this.handleDrop })),
                React.createElement(CrumbContainer, { id: value, key: value, draggable: _this.props.draggable, onDragStart: _this.handleDragStart, onDragEnd: _this.handleDragEnd },
                    React.createElement(MultiCrumb_1.default, { values: [value], labels: [_this.getLabel(value)], onClick: _this.handleDelete })))); })),
            React.createElement(AddContainer, null,
                React.createElement(react_bootstrap_typeahead_1.Typeahead, { id: name, ref: this.typeahead, options: options, type: "text", name: "newValue", open: this.props.options ? undefined : false, placeholder: this.props.placeholder, onInputChange: this.handleInputChange, onChange: this.handleChange }))));
    };
    return MultiInput;
}(React.Component));
exports.default = MultiInput;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;


/***/ }),

/***/ "./app/components/MultiInput/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MultiInput_1 = __webpack_require__("./app/components/MultiInput/MultiInput.tsx");
exports.default = MultiInput_1.default;


/***/ }),

/***/ "./app/components/SearchFieldName/SearchFieldName.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
var messages_1 = __webpack_require__("./app/components/SearchFieldName/messages.ts");
var SearchFieldName = function (props) {
    return messages_1.default[props.field] ? (React.createElement(react_intl_1.FormattedMessage, __assign({}, messages_1.default[props.field]))) : (props.field);
};
exports.default = SearchFieldName;


/***/ }),

/***/ "./app/components/SearchFieldName/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SearchFieldName_1 = __webpack_require__("./app/components/SearchFieldName/SearchFieldName.tsx");
exports.default = SearchFieldName_1.default;


/***/ }),

/***/ "./app/components/SearchFieldName/messages.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * SearchPage Messages
 *
 * This contains all the text for the SearchPage component.
 */
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
exports.default = react_intl_1.defineMessages({
    header: {
        id: 'app.containers.SearchPage.header',
        defaultMessage: 'This is SearchPage container !',
    },
    overall_status: {
        id: 'app.containers.SearchPage.status',
        defaultMessage: 'status',
    },
    start_date: {
        id: 'app.containers.SearchPage.start_date',
        defaultMessage: 'started',
    },
    completion_date: {
        id: 'app.containers.SearchPage.completed',
        defaultMessage: 'completed',
    },
    average_rating: {
        id: 'app.containers.SearchPage.average_rating',
        defaultMessage: 'overall rating',
    },
});


/***/ }),

/***/ "./app/components/SiteForm/AggField.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var aggToField_1 = __webpack_require__("./app/utils/aggs/aggToField.ts");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var AggDropDown_1 = __webpack_require__("./app/containers/AggDropDown/index.tsx");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var react_bootstrap_2 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var MultiCrumb_1 = __webpack_require__("./app/components/MultiCrumb/index.ts");
var FiltersContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var ContainerRow = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n"])));
var CrumbsContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  margin: 5px 0 15px 0;\n  span.label {\n    background: #55b88d;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    margin-bottom: 15px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n  }\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  margin: 5px 0 15px 0;\n  span.label {\n    background: #55b88d;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    margin-bottom: 15px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n  }\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n"])));
var FilterContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex: 3 1 0;\n  .panel-heading {\n    padding: 4px 15px;\n  }\n"], ["\n  flex: 3 1 0;\n  .panel-heading {\n    padding: 4px 15px;\n  }\n"])));
var StyledKind = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  flex: 1 1 0;\n  margin-left: 15px;\n"], ["\n  flex: 1 1 0;\n  margin-left: 15px;\n"])));
var StyledCheckbox = styled_components_1.default(react_bootstrap_2.Checkbox)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  margin-left: 5px;\n  marign-top: 7px;\n"], ["\n  display: flex;\n  align-items: center;\n  margin-left: 5px;\n  marign-top: 7px;\n"])));
var StyledLabel = styled_components_1.default.label(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: white;\n"], ["\n  color: white;\n"])));
var Container = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  background: rgba(255, 255, 255, 0.2);\n  padding: 10px;\n"], ["\n  background: rgba(255, 255, 255, 0.2);\n  padding: 10px;\n"])));
var StyledFormControl = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin-bottom: 20px;\n"], ["\n  margin-bottom: 20px;\n"])));
var AggField = /** @class */ (function (_super) {
    __extends(AggField, _super);
    function AggField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isValuesOpen: false,
            isVisibleOptionsOpen: false,
            isChecked: false,
        };
        _this.getPath = function (configType) {
            if (configType == 'presearch') {
                return "search.presearch." + _this.props.kind + ".fields." + _this.props.field.name;
            }
            else if (configType == 'autosuggest') {
                return "search.autoSuggest." + _this.props.kind + ".fields." + _this.props.field.name;
            }
            return "search." + _this.props.kind + ".fields." + _this.props.field.name;
        };
        _this.handleAddFilter = function (kind) { return function (aggName, aggValue, isCrowd) {
            _this.props.onAddMutation({
                currentTarget: {
                    name: "set:" + _this.getPath(_this.props.configType) + "." + kind + ".values",
                    value: __spread(_this.props.field[kind].values, [aggValue]),
                },
            }, _this.props.view);
        }; };
        _this.handleSelectAll = function (kind) { return function (aggName, newParams, isCrowd) {
            _this.props.onAddMutation({
                currentTarget: {
                    name: "set:" + _this.getPath(_this.props.configType) + "." + kind + ".values",
                    value: newParams,
                },
            }, _this.props.view);
        }; };
        _this.handleDeSelectAll = function (kind) { return function (aggName, newParams, isCrowd) {
            var targetValue = function () {
                if (kind == 'preselected') {
                    var newArray_1 = _this.props.field.preselected.values;
                    newParams.map(function (key) {
                        newArray_1 = ramda_1.reject(ramda_1.equals(key), newArray_1);
                    });
                    return newArray_1;
                }
                else {
                    var newArray_2 = _this.props.field.visibleOptions.values;
                    newParams.map(function (key) {
                        newArray_2 = ramda_1.reject(ramda_1.equals(key), newArray_2);
                    });
                    console.log("Final Array hope", newArray_2);
                    return newArray_2;
                }
            };
            _this.props.onAddMutation({
                currentTarget: {
                    name: "set:" + _this.getPath(_this.props.configType) + "." + kind + ".values",
                    value: targetValue(),
                },
            }, _this.props.view);
        }; };
        _this.handleRemoveFilter = function (kind) { return function (aggName, aggValue, isCrowd) {
            var targetValue = function () {
                if (kind == 'preselected') {
                    return ramda_1.reject(ramda_1.equals(aggValue), _this.props.field.preselected.values);
                }
                else {
                    return ramda_1.reject(ramda_1.equals(aggValue), _this.props.field.visibleOptions.values);
                }
            };
            _this.props.onAddMutation({
                currentTarget: {
                    name: "set:" + _this.getPath(_this.props.configType) + "." + kind + ".values",
                    value: targetValue(),
                },
            }, _this.props.view);
        }; };
        _this.handleOpen = function (kind) { return function (agg, aggKind) {
            if (kind === 'preselected') {
                _this.setState({ isValuesOpen: !_this.state.isValuesOpen });
            }
            else {
                _this.setState({ isVisibleOptionsOpen: !_this.state.isVisibleOptionsOpen });
            }
        }; };
        return _this;
    }
    AggField.prototype.render = function () {
        var _this = this;
        var configType = this.props.configType;
        var selected = new Set(this.props.field.preselected.values);
        var visibleOptions = new Set(this.props.field.visibleOptions.values);
        return (React.createElement(React.Fragment, null,
            React.createElement("h4", null, aggToField_1.default(this.props.field.name)
                .split('_')
                .map(helpers_1.capitalize)
                .join(' ')),
            React.createElement(Container, null,
                React.createElement(StyledLabel, null, "Preselected values"),
                React.createElement(CrumbsContainer, null, Array.from(selected).map(function (value) { return (React.createElement(MultiCrumb_1.default, { key: value, values: [value], onClick: function (value) {
                        return _this.handleRemoveFilter('preselected')('', value, false);
                    } })); })),
                React.createElement(FiltersContainer, null,
                    React.createElement(FilterContainer, null,
                        React.createElement(AggDropDown_1.default, { agg: this.props.field.name, aggKind: this.props.kind, searchParams: {
                                q: { key: 'AND', children: [] },
                                page: 0,
                                pageSize: 25,
                                aggFilters: [],
                                crowdAggFilters: [],
                                sorts: [],
                            }, display: this.props.field.display, isOpen: this.state.isValuesOpen, selectedKeys: selected, addFilter: this.handleAddFilter('preselected'), addAllFilters: this.handleSelectAll('preselected'), removeFilter: this.handleRemoveFilter('preselected'), removeAllFilters: this.handleDeSelectAll('preselected'), onOpen: this.handleOpen('preselected'), currentSiteView: this.props.view, configType: this.props.configType, returnAll: this.props.returnAll }))),
                React.createElement(StyledLabel, null, "Visible options"),
                React.createElement(CrumbsContainer, null, Array.from(visibleOptions).map(function (value) { return (React.createElement(MultiCrumb_1.default, { key: value, values: [value], onClick: function (value) {
                        return _this.handleRemoveFilter('visibleOptions')('', value, false);
                    } })); })),
                React.createElement(FiltersContainer, null,
                    React.createElement(FilterContainer, null,
                        React.createElement(AggDropDown_1.default, { agg: this.props.field.name, aggKind: this.props.kind, searchParams: {
                                q: { key: 'AND', children: [] },
                                page: 0,
                                pageSize: 25,
                                aggFilters: [],
                                crowdAggFilters: [],
                                sorts: [],
                            }, display: this.props.field.display, isOpen: this.state.isVisibleOptionsOpen, selectedKeys: visibleOptions, addFilter: this.handleAddFilter('visibleOptions'), addAllFilters: this.handleSelectAll('visibleOptions'), removeFilter: this.handleRemoveFilter('visibleOptions'), removeAllFilters: this.handleDeSelectAll('visibleOptions'), onOpen: this.handleOpen('visibleOptions'), currentSiteView: this.props.view, configType: this.props.configType, returnAll: this.props.returnAll }))),
                React.createElement("div", null,
                    React.createElement(StyledLabel, null, "Order"),
                    React.createElement(StyledFormControl, { name: "set:" + this.getPath(configType) + ".rank", placeholder: "Order", value: this.props.field.rank, onChange: this.props.onAddMutation }),
                    React.createElement(StyledLabel, null, "Display"),
                    React.createElement(StyledFormControl, { name: "set:" + this.getPath(configType) + ".display", componentClass: "select", onChange: function (e) { return _this.props.onAddMutation(e, _this.props.view); }, defaultValue: this.props.field.display },
                        React.createElement("option", { value: "STRING" }, "Text"),
                        React.createElement("option", { value: "STAR" }, "Stars"),
                        React.createElement("option", { value: "DATE" }, "Date"))))));
    };
    return AggField;
}(React.Component));
exports.default = AggField;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;


/***/ }),

/***/ "./app/components/SiteForm/MainForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var Styled_1 = __webpack_require__("./app/components/SiteForm/Styled.tsx");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var StyledFormControl_1 = __webpack_require__("./app/containers/LoginPage/StyledFormControl.tsx");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
exports.AddEditorContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n\n  button {\n    margin: 15px 0 15px 10px;\n  }\n"], ["\n  display: flex;\n\n  button {\n    margin: 15px 0 15px 10px;\n  }\n"])));
exports.EditorActions = styled_components_1.default.td(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var MainForm = /** @class */ (function (_super) {
    __extends(MainForm, _super);
    function MainForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            addEditorEmail: '',
        };
        _this.handleAddEditor = function () {
            if (!_this.state.addEditorEmail)
                return;
            var editorsLens = ramda_1.lensPath([
                'editorEmails',
                (_this.props.form.editorEmails || []).length,
            ]);
            var newForm = ramda_1.set(editorsLens, _this.state.addEditorEmail, _this.props.form);
            _this.props.onFormChange(newForm);
            _this.setState({ addEditorEmail: '' });
        };
        _this.handleDeleteEditor = function (email) { return function () {
            var editorsLens = ramda_1.lensPath(['editorEmails']);
            var newForm = ramda_1.over(editorsLens, ramda_1.reject(ramda_1.equals(email)), _this.props.form);
            _this.props.onFormChange(newForm);
        }; };
        _this.handleInputChange = function (e) {
            var _a;
            var _b = e.currentTarget, name = _b.name, value = _b.value;
            _this.props.onFormChange(__assign(__assign({}, _this.props.form), (_a = {}, _a[name] = value, _a)));
        };
        _this.handleCheckboxChange = function (e) {
            var _a;
            var _b = e.currentTarget, name = _b.name, checked = _b.checked;
            _this.props.onFormChange(__assign(__assign({}, _this.props.form), (_a = {}, _a[name] = checked, _a)));
        };
        _this.handleEditorEmailChange = function (e) {
            _this.setState({ addEditorEmail: e.currentTarget.value });
        };
        return _this;
    }
    MainForm.prototype.componentDidMount = function () {
        this.props.handleForm();
    };
    MainForm.prototype.render = function () {
        var _this = this;
        var noEditors = !this.props.form.editorEmails || !this.props.form.editorEmails.length;
        return (React.createElement(Styled_1.StyledContainer, null,
            React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 6 },
                    React.createElement("h3", null, "Site params"),
                    React.createElement(Styled_1.StyledLabel, { htmlFor: "name" }, "Name"),
                    React.createElement(StyledFormControl_1.default, { id: "name", name: "name", type: "text", placeholder: "Name", value: this.props.form.name, onChange: this.handleInputChange }),
                    React.createElement(Styled_1.StyledLabel, { htmlFor: "subdomain" }, "Subdomain"),
                    React.createElement(StyledFormControl_1.default, { id: "subdomain", name: "subdomain", type: "text", placeholder: "Subdomain", value: this.props.form.subdomain, onChange: this.handleInputChange }),
                    React.createElement(Styled_1.StyledLabel, { htmlFor: "subdomain" }, "Skip landing page"),
                    React.createElement(react_bootstrap_1.Checkbox, { id: "skipLanding", name: "skipLanding", type: "checkbox", checked: this.props.form.skipLanding, onClick: this.handleCheckboxChange }),
                    React.createElement("div", null,
                        React.createElement("h3", null, "Editors"),
                        noEditors && React.createElement("h5", null, "No editors"),
                        !noEditors && (React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, "Email"),
                                    React.createElement("th", { style: { width: '20%' } }))),
                            React.createElement("tbody", null, (this.props.form.editorEmails || []).map(function (email) { return (React.createElement("tr", { key: email },
                                React.createElement("td", null, email),
                                React.createElement(exports.EditorActions, null,
                                    React.createElement(react_bootstrap_1.Button, { onClick: _this.handleDeleteEditor(email) }, "Delete")))); })))),
                        React.createElement(exports.AddEditorContainer, null,
                            React.createElement(StyledFormControl_1.default, { name: "editor", type: "text", placeholder: "Editor email", value: this.state.addEditorEmail, onChange: this.handleEditorEmailChange }),
                            React.createElement(react_bootstrap_1.Button, { onClick: this.handleAddEditor }, "Add")))))));
    };
    return MainForm;
}(React.Component));
exports.default = MainForm;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/SiteForm/SearchForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var Styled_1 = __webpack_require__("./app/components/SiteForm/Styled.tsx");
var MultiInput_1 = __webpack_require__("./app/components/MultiInput/index.ts");
var AggField_1 = __webpack_require__("./app/components/SiteForm/AggField.tsx");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var aggToField_1 = __webpack_require__("./app/utils/aggs/aggToField.ts");
var globalTypes_1 = __webpack_require__("./app/types/globalTypes.ts");
var react_bootstrap_2 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var UpdateSiteViewMutation_1 = __webpack_require__("./app/mutations/UpdateSiteViewMutation.tsx");
var siteViewUpdater_1 = __webpack_require__("./app/utils/siteViewUpdater.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var SEARCH_FIELDS = constants_1.studyFields.map(function (option) { return ({
    id: option,
    label: helpers_1.sentanceCase(option),
}); });
var AGGS_OPTIONS = constants_1.aggsOrdered.map(function (option) { return ({
    id: option,
    label: helpers_1.sentanceCase(aggToField_1.default(option)),
}); });
var AggsHeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  color: white;\n  align-items: center;\n  justify-content: space-between;\n  margin: 25px 0 10px 0;\n\n  h3 {\n    margin: 0;\n  }\n"], ["\n  display: flex;\n  color: white;\n  align-items: center;\n  justify-content: space-between;\n  margin: 25px 0 10px 0;\n\n  h3 {\n    margin: 0;\n  }\n"])));
var StyledButton = styled_components_1.default(react_bootstrap_2.Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 15px;\n"], ["\n  margin-right: 15px;\n"])));
var StyledCheckbox = styled_components_1.default(react_bootstrap_2.Checkbox)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n"], ["\n  display: flex;\n  align-items: center;\n"])));
var StyledPanelHeading = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display:flex;\n"], ["\n  display:flex;\n"])));
var StyledShowContainer = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display:flex;\n  font-size:16px;\n  margin-left:auto;\n  .checkbox{\n    margin:0;\n    padding-left:1em;\n  }\n  "], ["\n  display:flex;\n  font-size:16px;\n  margin-left:auto;\n  .checkbox{\n    margin:0;\n    padding-left:1em;\n  }\n  "])));
var StyledButtonGroup = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 1em 1em 1em 0;\n\n  ul li a{\n    color:black !important;\n  }\n"], ["\n  margin: 1em 1em 1em 0;\n\n  ul li a{\n    color:black !important;\n  }\n"])));
var StyledFormInput = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\nmargin-bottom: 20px;\nbackground: white;\nborder: none;\nbox-shadow: none;\ncolor: #333;\nfont-size: 2em;\npadding-left: 5px;\n"], ["\nmargin-bottom: 20px;\nbackground: white;\nborder: none;\nbox-shadow: none;\ncolor: #333;\nfont-size: 2em;\npadding-left: 5px;\n"])));
// const styledToggleButton = styled(ToggleButtonGroup)`
//   diplay: flex;
//   flex-direction: row;
//   `
var SearchForm = /** @class */ (function (_super) {
    __extends(SearchForm, _super);
    function SearchForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showAllAggs: false,
            showAllCrowdAggs: false,
            mutations: [],
            showFacetBar: false,
            showFacetBarConfig: false,
            showAllAggsPresearch: false,
            showAllCrowdAggsPresearch: false,
            showAllAggsAutoSuggest: false,
            showAllCrowdAggsAutoSuggest: false,
            resultsButtonsArray: []
        };
        _this.handleSave = function (updateSiteView, view) { return function (mutations) {
            console.log('save', view);
            updateSiteView({
                variables: {
                    input: {
                        mutations: _this.state.mutations.map(siteViewUpdater_1.serializeMutation),
                        id: view.id,
                        name: view.name,
                        url: view.url,
                        default: view.default,
                    },
                },
            });
        }; };
        _this.handleAddMutation = function (e, siteView) {
            var _a = e.currentTarget, name = _a.name, value = _a.value;
            var mutation = siteViewUpdater_1.createMutation(name, value);
            var view = siteViewUpdater_1.updateView(siteView, _this.state.mutations);
            var currentValue = siteViewUpdater_1.getViewValueByPath(mutation.path, view);
            if (ramda_1.equals(value, currentValue))
                return;
            _this.setState({ mutations: __spread(_this.state.mutations, [mutation]) }, function () {
                console.log('MUTATIONS', _this.state.mutations);
            });
        };
        _this.handleAddMutationForDeleteButton = function (e, siteView) {
            var _a = e.currentTarget, name = _a.name, value = _a.value;
            var mutation = siteViewUpdater_1.createMutation(name, value);
            _this.setState({ mutations: __spread(_this.state.mutations, [mutation]) }, function () {
                console.log('MUTATIONS', _this.state.mutations);
            });
        };
        _this.handleDeleteButton = function (view, index) {
            var name = "set:search.results.buttons.items";
            var items = view.search.results.buttons.items;
            items.splice(index, 1);
            _this.handleAddMutationForDeleteButton({ currentTarget: { name: name, value: items } }, view);
        };
        _this.getCrowdFields = function (view) {
            return view.search.crowdAggs.fields.map(function (field) { return ({
                id: field.name,
                label: helpers_1.sentanceCase(field.name),
            }); });
        };
        _this.handleShowAllToggle = function (kind) { return function () {
            if (kind == 'aggs') {
                _this.setState({ showAllAggs: !_this.state.showAllAggs });
            }
            else if (kind == 'crowdAggs') {
                _this.setState({ showAllCrowdAggs: !_this.state.showAllCrowdAggs });
            }
            else if (kind == 'aggsPresearch') {
                _this.setState({ showAllAggsPresearch: !_this.state.showAllAggsPresearch });
            }
            else {
                _this.setState({ showAllCrowdAggsPresearch: !_this.state.showAllCrowdAggsPresearch });
            }
        }; };
        _this.handleCheckboxToggle = function (value) { return function (e) {
            console.log("this.props view", _this.props);
            var siteViewId = _this.props.match.params.id;
            var thisSiteView = _this.props.siteViews.find(function (siteview) { return siteview.id == siteViewId; });
            _this.handleAddMutation({
                currentTarget: { name: e.currentTarget.name, value: !value }
            }, thisSiteView);
        }; };
        _this.handleFieldsOrderChange = function () { };
        _this.handleShowFacetBar = function (x, view, name) {
            // this.setState({showFacetBar: x})
            var e = { currentTarget: { name: name, value: x } };
            _this.handleAddMutation(e, view);
        };
        _this.handleAddButton = function (view) {
            var name = "set:search.results.buttons.items";
            var items = view.search.results.buttons.items;
            var newItem = { icon: "", target: "", __typename: "ResultButtonItems" };
            var newItems = __spread(items, [newItem]);
            _this.handleAddMutation({ currentTarget: { name: name, value: newItems } }, view);
        };
        _this.handlePresearchButtonTarget = function (e, siteView, value) {
            // let items = this.state.resultsButtonsArray
            // let newItem = {... items[position],
            //     target: value
            // }
            // let newArray : any[]=[]  
            // items.map((val, index)=>{
            //   if(index==position){
            //     newArray.push(newItem)
            //   }else{
            //     newArray.push(val)
            //   }
            // })
            _this.handleAddMutation({ currentTarget: { name: e.currentTarget.name, value: value } }, siteView);
            // this.setState({resultsButtonsArray: newArray })
        };
        _this.handleButtonTarget = function (e, siteView, position, value) {
            var items = _this.state.resultsButtonsArray;
            var newItem = __assign(__assign({}, items[position]), { target: value });
            var newArray = [];
            items.map(function (val, index) {
                if (index == position) {
                    newArray.push(newItem);
                }
                else {
                    newArray.push(val);
                }
            });
            if (newArray.length == position) {
                newArray.push(newItem);
            }
            _this.handleAddMutation({ currentTarget: { name: e.currentTarget.name, value: newArray } }, siteView);
            _this.setState({ resultsButtonsArray: newArray });
        };
        _this.handleButtonIcon = function (e, siteView, position, value) {
            var items = _this.state.resultsButtonsArray;
            var newItem = __assign(__assign({}, items[position]), { icon: value });
            var newArray = [];
            items.map(function (val, index) {
                if (index == position) {
                    newArray.push(newItem);
                }
                else {
                    newArray.push(val);
                }
            });
            _this.handleAddMutation({ currentTarget: { name: e.currentTarget.name, value: newArray } }, siteView);
            _this.setState({ resultsButtonsArray: newArray });
        };
        _this.renderResultsButtons = function (view) {
            var ICONS = ['table', 'card'];
            var buttonsArray = view.search.results.buttons.items;
            var siteViewNames = [];
            var siteViewUrls = [];
            var siteViews = _this.props.siteViews;
            var thisSiteView = siteViews.find(function (siteview) { return siteview.url == view.url; }) ||
                view.siteView;
            return (buttonsArray.map(function (value, index) { return (React.createElement(react_bootstrap_1.Panel, { key: index + value },
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true },
                            "Button ",
                            index + 1,
                            " "),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", { onClick: function () { return _this.handleDeleteButton(thisSiteView, index); } }, "X")))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                    React.createElement("h3", null,
                        "Target: ",
                        buttonsArray[index].target),
                    React.createElement("h3", null,
                        "Icon: ",
                        buttonsArray[index].icon),
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(StyledButtonGroup, null,
                            React.createElement(react_bootstrap_1.DropdownButton, { bsStyle: "default", title: "Button Target", key: "default", id: "dropdown-basic-default", style: { margin: "1em 1em 1em 0" } }, siteViews.map(function (site) { return (React.createElement(react_bootstrap_1.MenuItem, { key: site.name, name: "set:search.results.buttons.items", onClick: function (e) { return _this.handleButtonTarget(e, thisSiteView, index, site.url); } }, site.name)); }))),
                        React.createElement(StyledButtonGroup, null,
                            React.createElement(react_bootstrap_1.DropdownButton, { bsStyle: "default", title: "Button Icon", key: "default", id: "dropdown-basic-default", style: { margin: "1em 1em 1em 0" } }, ICONS.map(function (icon) { return (React.createElement(react_bootstrap_1.MenuItem, { key: icon, name: "set:search.results.buttons.items", onClick: function (e) { return _this.handleButtonIcon(e, thisSiteView, index, icon); } }, icon)); }))))))); }));
        };
        _this.renderFacetBarConfig = function (showFacetBar, view, fields, crowdFields, updateSiteView) {
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Facet Bar"),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", null, "Show"),
                            React.createElement(StyledCheckbox, { name: "set:search.config.fields.showFacetBar", checked: showFacetBar, onChange: _this.handleCheckboxToggle(showFacetBar) })))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Aggs visibility"),
                                React.createElement(StyledCheckbox, { checked: _this.state.showAllAggs, onChange: _this.handleShowAllToggle('aggs') }, "Show all")),
                            React.createElement(Styled_1.StyledLabel, null, "Filter"),
                            React.createElement(Styled_1.StyledFormControl, { name: "set:search.aggs.selected.kind", componentClass: "select", onChange: function (e) { return _this.handleAddMutation(e, view); }, value: view.search.aggs.selected.kind },
                                React.createElement("option", { value: "BLACKLIST" }, "All except"),
                                React.createElement("option", { value: "WHITELIST" }, "Only")),
                            React.createElement(MultiInput_1.default, { name: "set:search.aggs.selected.values", options: AGGS_OPTIONS, placeholder: "Add facet", value: view.search.aggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Aggs settings"),
                            fields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "aggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "facetbar", returnAll: true })); })),
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Crowd aggs visibility"),
                                React.createElement(StyledCheckbox, { checked: _this.state.showAllCrowdAggs, onChange: _this.handleShowAllToggle('crowdAggs') }, "Show all")),
                            React.createElement(Styled_1.StyledLabel, null, "Filter"),
                            React.createElement(Styled_1.StyledFormControl, { name: "set:search.crowdAggs.selected.kind", componentClass: "select", onChange: function (e) { return _this.handleAddMutation(e, view); }, v: view.search.crowdAggs.selected.kind },
                                React.createElement("option", { value: "BLACKLIST" }, "All except"),
                                React.createElement("option", { value: "WHITELIST" }, "Only")),
                            React.createElement(MultiInput_1.default, { name: "set:search.crowdAggs.selected.values", options: _this.getCrowdFields(view), placeholder: "Add facet", value: view.search.crowdAggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Crowd aggs settings"),
                            crowdFields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "crowdAggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "facetbar", returnAll: true })); }))))));
        };
        _this.renderAutoSuggestConfig = function (showAutoSuggest, view, fields, crowdFields, updateSiteView) {
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Auto Suggest"),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", null, "Show"),
                            React.createElement(StyledCheckbox, { name: "set:search.config.fields.showAutoSuggest", checked: showAutoSuggest, onChange: _this.handleCheckboxToggle(showAutoSuggest) })))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Aggs visibility")),
                            React.createElement(Styled_1.StyledLabel, null, "Add to Autosuggest"),
                            React.createElement(MultiInput_1.default, { name: "set:search.autoSuggest.aggs.selected.values", options: AGGS_OPTIONS, placeholder: "Add facet", value: view.search.autoSuggest.aggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Aggs settings"),
                            fields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "aggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "autosuggest", returnAll: true })); })),
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Crowd aggs visibility")),
                            React.createElement(Styled_1.StyledLabel, null, "Add to Autosuggest"),
                            React.createElement(MultiInput_1.default, { name: "set:search.autoSuggest.crowdAggs.selected.values", options: _this.getCrowdFields(view), placeholder: "Add facet", value: view.search.autoSuggest.crowdAggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Crowd aggs settings"),
                            crowdFields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "crowdAggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "autosuggest", returnAll: true })); }))))));
        };
        _this.renderPreSearchConfig = function (showPresearch, view, fields, crowdFields, updateSiteView) {
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Pre-Search"),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", null, "Show"),
                            React.createElement(StyledCheckbox, { name: "set:search.config.fields.showPresearch", checked: showPresearch, onChange: _this.handleCheckboxToggle(showPresearch) })))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Aggs visibility")),
                            React.createElement(MultiInput_1.default, { name: "set:search.presearch.aggs.selected.values", options: AGGS_OPTIONS, placeholder: "Add facet", value: view.search.presearch.aggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Aggs settings"),
                            fields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "aggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "presearch", returnAll: true })); })),
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(AggsHeaderContainer, null,
                                React.createElement("h3", null, "Crowd aggs visibility")),
                            React.createElement(MultiInput_1.default, { name: "set:search.presearch.crowdAggs.selected.values", options: _this.getCrowdFields(view), placeholder: "Add facet", value: view.search.presearch.crowdAggs.selected.values, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null, "Crowd aggs settings"),
                            crowdFields.map(function (field) { return (React.createElement(AggField_1.default, { kind: "crowdAggs", key: field.name, 
                                //@ts-ignore
                                field: field, onAddMutation: _this.handleAddMutation, view: view, configType: "presearch", returnAll: true })); }))),
                    React.createElement(react_bootstrap_1.Panel, null,
                        React.createElement(react_bootstrap_1.Panel.Heading, null,
                            React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Presearch Instructions")),
                        React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                            React.createElement("h3", null, "Instructions:"),
                            React.createElement(StyledFormInput, { name: "set:search.presearch.instructions", placeholder: view.search.presearch.instructions, value: view.search.presearch.instructions, onChange: function (e) { return _this.handleAddMutation(e, view); } }))),
                    React.createElement(react_bootstrap_1.Panel, null,
                        React.createElement(react_bootstrap_1.Panel.Heading, null,
                            React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Presearch Button"),
                            React.createElement(StyledShowContainer, null)),
                        React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                            React.createElement("h3", null, "Text:"),
                            React.createElement(StyledFormInput, { name: "set:search.presearch.button.name", placeholder: view.search.presearch.button.name, value: view.search.presearch.button.name, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                            React.createElement("h3", null,
                                "Target: ",
                                view.search.presearch.button.target),
                            React.createElement(StyledPanelHeading, null,
                                React.createElement(StyledButtonGroup, null,
                                    React.createElement(react_bootstrap_1.DropdownButton, { bsStyle: "default", title: "Button Target", key: "default", id: "dropdown-basic-default", style: { margin: '1em 1em 1em 0' } }, _this.props.siteViews.map(function (view) { return (React.createElement(react_bootstrap_1.MenuItem, { name: "set:search.presearch.button.target", onClick: function (e) {
                                            return _this.handlePresearchButtonTarget(e, view, view.url);
                                        } }, view.name)); })))))))));
        };
        _this.renderResultsConfig = function (showResults, view, fields, crowdFields, updateSiteView) {
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Results"),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", null, "Show"),
                            React.createElement(StyledCheckbox, { name: "set:search.config.fields.showResults", checked: showResults, onChange: _this.handleCheckboxToggle(showResults) })))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true },
                    React.createElement("h3", null, "Fields"),
                    React.createElement(MultiInput_1.default, { name: "set:search.fields", options: SEARCH_FIELDS, placeholder: "Add field", draggable: true, value: view.search.fields, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
                    React.createElement(StyledButtonGroup, null,
                        React.createElement(react_bootstrap_1.DropdownButton, { bsStyle: "default", title: "Result View", key: "default", id: "dropdown-basic-default", style: { margin: "1em 1em 1em 0" } },
                            React.createElement(react_bootstrap_1.MenuItem, { onClick: function (e) { return _this.handleShowFacetBar('card', view, 'set:search.results.type'); } }, "Card View"),
                            React.createElement(react_bootstrap_1.MenuItem, { onClick: function (e) { return _this.handleShowFacetBar('table', view, 'set:search.results.type'); } }, "Table View"),
                            React.createElement(react_bootstrap_1.MenuItem, { divider: true }),
                            React.createElement(react_bootstrap_1.MenuItem, { onClick: function (e) { return _this.handleShowFacetBar('map', view, 'set:search.results.type'); } }, "Map View")),
                        React.createElement(react_bootstrap_1.PanelGroup, { id: "accordion-uncontrolled" },
                            _this.renderResultsButtons(view),
                            React.createElement(StyledButton, { style: { marginTop: "1em" }, onClick: function () { return _this.handleAddButton(view); } }, "Add Button"))))));
        };
        _this.renderBreadCrumbsConfig = function (showBreadCrumbs, view, fields, crowdFields, updateSiteView) {
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Heading, null,
                    React.createElement(StyledPanelHeading, null,
                        React.createElement(react_bootstrap_1.Panel.Title, { toggle: true }, "Bread Crumbs Bar"),
                        React.createElement(StyledShowContainer, null,
                            React.createElement("span", null, "Show"),
                            React.createElement(StyledCheckbox, { name: "set:search.config.fields.showBreadCrumbs", checked: showBreadCrumbs, onChange: _this.handleCheckboxToggle(showBreadCrumbs) })))),
                React.createElement(react_bootstrap_1.Panel.Body, { collapsible: true })));
        };
        return _this;
    }
    SearchForm.prototype.componentDidMount = function () {
        this.props.handleSiteViewEdit();
        var siteviewId = this.props.match.params.id;
        var view = this.props.siteViews.find(function (view) { return siteviewId == view.id; });
        this.setState({ resultsButtonsArray: view.search.results.buttons.items });
    };
    SearchForm.prototype.render = function () {
        var _this = this;
        var siteviewId = this.props.match.params.id;
        var view = this.props.siteViews.find(function (view) { return siteviewId == view.id; });
        view = siteViewUpdater_1.updateView(view, this.state.mutations);
        var site = this.props.site;
        var fields = siteViewHelpers_1.displayFields(this.state.showAllAggs
            ? globalTypes_1.FilterKind.BLACKLIST
            : view.search.aggs.selected.kind, this.state.showAllAggs ? [] : view.search.aggs.selected.values, view.search.aggs.fields);
        var crowdFields = siteViewHelpers_1.displayFields(this.state.showAllCrowdAggs
            ? globalTypes_1.FilterKind.BLACKLIST
            : view.search.crowdAggs.selected.kind, this.state.showAllCrowdAggs ? [] : view.search.crowdAggs.selected.values, view.search.crowdAggs.fields);
        var fieldsPresearch = siteViewHelpers_1.displayFields(this.state.showAllAggsPresearch
            ? globalTypes_1.FilterKind.BLACKLIST
            : globalTypes_1.FilterKind.WHITELIST, this.state.showAllAggsPresearch ? [] : view.search.presearch.aggs.selected.values, view.search.presearch.aggs.fields);
        var crowdFieldsPresearch = siteViewHelpers_1.displayFields(this.state.showAllCrowdAggsPresearch
            ? globalTypes_1.FilterKind.BLACKLIST
            : globalTypes_1.FilterKind.WHITELIST, this.state.showAllCrowdAggsPresearch ? [] : view.search.presearch.crowdAggs.selected.values, view.search.presearch.crowdAggs.fields);
        var fieldsAutoSuggest = siteViewHelpers_1.displayFields(this.state.showAllAggsAutoSuggest
            ? globalTypes_1.FilterKind.BLACKLIST
            : globalTypes_1.FilterKind.WHITELIST, this.state.showAllAggsAutoSuggest ? [] : view.search.autoSuggest.aggs.selected.values, view.search.autoSuggest.aggs.fields);
        var crowdFieldsAutoSuggest = siteViewHelpers_1.displayFields(this.state.showAllCrowdAggsAutoSuggest
            ? globalTypes_1.FilterKind.BLACKLIST
            : globalTypes_1.FilterKind.WHITELIST, this.state.showAllCrowdAggsAutoSuggest ? [] : view.search.autoSuggest.crowdAggs.selected.values, view.search.autoSuggest.crowdAggs.fields);
        var showFacetBar = view.search.config.fields.showFacetBar;
        var showBreadCrumbs = view.search.config.fields.showBreadCrumbs;
        var showAutoSuggest = view.search.config.fields.showAutoSuggest;
        var showResults = view.search.config.fields.showResults;
        var showPresearch = view.search.config.fields.showPresearch;
        return (React.createElement(UpdateSiteViewMutation_1.default, { onCompleted: function () {
                return _this.props.history.push("/sites/" + site.id + "/edit/siteviews");
            } }, function (updateSiteView) { return (React.createElement(Styled_1.StyledContainer, null,
            React.createElement("span", { style: {
                    display: "inline",
                    width: "8em",
                    fontSize: "2em"
                } }, "Site Name: "),
            React.createElement(StyledFormInput, { name: "set:name", placeholder: view.name, value: view.name, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
            React.createElement("span", { style: {
                    display: "inline",
                    width: "16em",
                    fontSize: "2em"
                } }, "URL: clinwiki.org/search/"),
            React.createElement(StyledFormInput, { name: "set:url", placeholder: view.url, value: view.url, onChange: function (e) { return _this.handleAddMutation(e, view); } }),
            React.createElement("h3", null, "Search Sections"),
            React.createElement(react_bootstrap_1.PanelGroup, { id: "accordion-uncontrolled" },
                _this.renderFacetBarConfig(showFacetBar, view, fields, crowdFields, updateSiteView),
                _this.renderAutoSuggestConfig(showAutoSuggest, view, fieldsAutoSuggest, crowdFieldsAutoSuggest, updateSiteView),
                _this.renderPreSearchConfig(showPresearch, view, fieldsPresearch, crowdFieldsPresearch, updateSiteView),
                _this.renderResultsConfig(showResults, view, fields, crowdFields, updateSiteView),
                _this.renderBreadCrumbsConfig(showBreadCrumbs, view, fields, crowdFields, updateSiteView)),
            React.createElement(StyledButton, { onClick: _this.handleSave(updateSiteView, view) }, "Save Site View"))); }));
    };
    return SearchForm;
}(React.Component));
exports.default = SearchForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;


/***/ }),

/***/ "./app/components/SiteForm/SiteForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var Styled_1 = __webpack_require__("./app/components/SiteForm/Styled.tsx");
var siteViewUpdater_1 = __webpack_require__("./app/utils/siteViewUpdater.ts");
var react_router_1 = __webpack_require__("./node_modules/react-router/index.js");
var MainForm_1 = __webpack_require__("./app/components/SiteForm/MainForm.tsx");
var SiteViewsRouter_1 = __webpack_require__("./app/components/SiteForm/SiteViewsRouter.tsx");
var StudyForm_1 = __webpack_require__("./app/components/SiteForm/StudyForm.tsx");
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ul > li > a {\n    color: white;\n\n    &:hover {\n      color: #333;\n    }\n  }\n"], ["\n  ul > li > a {\n    color: white;\n\n    &:hover {\n      color: #333;\n    }\n  }\n"])));
var StyledNav = styled_components_1.default(react_bootstrap_1.Nav)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 15px;\n"], ["\n  margin: 15px;\n"])));
var SiteForm = /** @class */ (function (_super) {
    __extends(SiteForm, _super);
    function SiteForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                name: '',
                subdomain: '',
                skipLanding: false,
                editorEmails: [],
            },
            mutations: [],
            addEditorEmail: '',
            prevForm: null,
            inSiteViewEdit: false,
        };
        _this.toggleSiteViewEdit = function () {
            _this.setState({ inSiteViewEdit: true });
        };
        _this.toggleEditFalse = function () {
            _this.setState({ inSiteViewEdit: false });
        };
        _this.handleSave = function () {
            _this.props.onSave(_this.state.form);
        };
        _this.handleAddMutation = function (e) {
            var _a = e.currentTarget, name = _a.name, value = _a.value;
            var mutation = siteViewUpdater_1.createMutation(name, value);
            var view = siteViewUpdater_1.updateView(_this.props.site.siteViews[0], _this.state.mutations);
            var currentValue = siteViewUpdater_1.getViewValueByPath(mutation.path, view);
            if (ramda_1.equals(value, currentValue))
                return;
            _this.setState({ mutations: __spread(_this.state.mutations, [mutation]) }, function () {
                return console.log('handleadd', mutation, view, currentValue);
            });
        };
        _this.handleFormChange = function (form) {
            _this.setState({ form: form });
        };
        _this.renderTabs = function () {
            var path = helpers_1.trimPath(_this.props.match.url);
            var sections;
            if (path === '/sites/new') {
                sections = [
                    { path: '/main', value: 'Main' },
                    { path: '/study', value: 'Study' },
                ];
            }
            else
                sections = [
                    { path: '/main', value: 'Main' },
                    { path: '/siteviews', value: 'Search Views' },
                    { path: '/study', value: 'Study' },
                ];
            var locationComponents = _this.props.location.pathname.split('/');
            var activeKey = ramda_1.last(locationComponents);
            if (locationComponents[locationComponents.length - 2] === 'study') {
                activeKey = 'study';
            }
            activeKey = "/" + activeKey;
            return (React.createElement(StyledNav, { bsStyle: "pills", activeKey: activeKey, onSelect: function (key) { return _this.props.history.push("" + path + key); } }, sections.map(function (section) { return (React.createElement(react_bootstrap_1.NavItem, { key: "" + section.path, eventKey: "" + section.path }, section.value)); })));
        };
        return _this;
    }
    SiteForm.prototype.render = function () {
        var _this = this;
        var view = siteViewUpdater_1.updateView(this.props.site.siteView, this.state.mutations);
        var path = helpers_1.trimPath(this.props.match.path);
        return (React.createElement(Container, null,
            React.createElement("h3", { style: { color: 'white', marginLeft: 15 } }, this.props.site.name),
            this.renderTabs(),
            React.createElement(react_router_1.Switch, null,
                React.createElement(react_router_1.Route, { path: path + "/main", render: function () { return (React.createElement(MainForm_1.default, { form: _this.state.form, onFormChange: _this.handleFormChange, handleForm: _this.toggleEditFalse })); } }),
                React.createElement(react_router_1.Route, { path: path + "/siteviews", render: function (props) { return (
                    //@ts-ignore
                    React.createElement(SiteViewsRouter_1.default, __assign({}, props, { siteViews: _this.props.site.siteViews, refresh: _this.props.refresh, site: _this.props.site, handleSiteViewEdit: _this.toggleSiteViewEdit, handleForm: _this.toggleEditFalse }))); } }),
                React.createElement(react_router_1.Route, { path: path + "/study", render: function (routeProps) { return (React.createElement(StudyForm_1.default, __assign({}, routeProps, { view: view, onAddMutation: _this.handleAddMutation, handleForm: _this.toggleEditFalse }))); } }),
                React.createElement(react_router_1.Redirect, { to: path + "/main" })),
            this.state.inSiteViewEdit ? (null) :
                React.createElement(Styled_1.StyledContainer, null,
                    React.createElement(react_bootstrap_1.Button, { onClick: function () { return _this.handleSave(); } }, "Save"))));
    };
    SiteForm.fragment = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    fragment SiteFormFragment on Site {\n      name\n      subdomain\n      skipLanding\n      editors {\n        email\n      }\n    }\n  "], ["\n    fragment SiteFormFragment on Site {\n      name\n      subdomain\n      skipLanding\n      editors {\n        email\n      }\n    }\n  "])));
    SiteForm.getDerivedStateFromProps = function (props, state) {
        var _a = props.site, name = _a.name, subdomain = _a.subdomain, skipLanding = _a.skipLanding, editors = _a.editors;
        var editorEmails = editors.map(ramda_1.prop('email'));
        var form = {
            name: name,
            subdomain: subdomain,
            skipLanding: skipLanding,
            editorEmails: editorEmails,
        };
        if (form && !ramda_1.equals(form, state.prevForm)) {
            return __assign(__assign({}, state), { form: form, prevForm: form });
        }
        return null;
    };
    return SiteForm;
}(React.Component));
exports.default = SiteForm;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/components/SiteForm/SiteViewsForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var SiteItem_1 = __webpack_require__("./app/components/SiteItem/index.ts");
var CreateSiteViewMutation_1 = __webpack_require__("./app/mutations/CreateSiteViewMutation.tsx");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var StyledButton_1 = __webpack_require__("./app/containers/LoginPage/StyledButton.tsx");
var StyledContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  h3,\n  h4,\n  h5 {\n    color: white;\n  }\n"], ["\n  padding: 20px;\n  h3,\n  h4,\n  h5 {\n    color: white;\n  }\n"])));
var SiteViewsTable = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var SiteViewsForm = /** @class */ (function (_super) {
    __extends(SiteViewsForm, _super);
    function SiteViewsForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                siteViewName: '',
                siteViewPath: '',
            },
            id: undefined,
            textToCopy: '',
        };
        _this.handleSave = function (createSiteView) {
            var form = _this.state.form;
            if (form.siteViewPath === 'default') {
                alert("Only the default site can have the url 'default'");
                _this.setState({
                    form: {
                        siteViewName: '',
                        siteViewPath: '',
                    },
                });
                return null;
            }
            else if (form.siteViewName == '' || form.siteViewPath == '') {
                alert("Name and URL are both required, please try again");
                _this.setState({
                    form: {
                        siteViewName: '',
                        siteViewPath: '',
                    },
                });
                return null;
            }
            createSiteView({
                variables: {
                    input: {
                        name: form.siteViewName,
                        url: form.siteViewPath,
                        description: 'description',
                        default: false,
                        mutations: [],
                        siteId: _this.props.site.id,
                    },
                },
            }).then(function (res) {
                _this.setState({
                    form: {
                        siteViewName: '',
                        siteViewPath: '',
                    },
                }, function () {
                    _this.props.refresh();
                });
            });
        };
        _this.handleInputChange = function (e) {
            var _a;
            _this.setState({
                form: __assign(__assign({}, _this.state.form), (_a = {}, _a[e.target.name] = e.target.value, _a)),
            });
        };
        return _this;
    }
    SiteViewsForm.prototype.componentDidMount = function () {
        this.props.handleForm();
    };
    SiteViewsForm.prototype.render = function () {
        var _this = this;
        var siteViews = this.props.siteViews;
        return (React.createElement(CreateSiteViewMutation_1.default, null, function (createSiteView) { return (React.createElement(StyledContainer, null,
            React.createElement(CollapsiblePanel_1.default, { header: "My Site Views" }, siteViews.length > 0 && (React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Site Name"),
                        React.createElement("th", null, "URL"),
                        React.createElement("th", null, "Default?"),
                        React.createElement("th", null, "URL Preview"),
                        React.createElement("th", null))),
                React.createElement("tbody", null,
                    React.createElement(React.Fragment, null, siteViews.map(function (view) { return (React.createElement(SiteItem_1.SiteViewItem, { key: view.id, siteView: view, refresh: _this.props.refresh, site: _this.props.site })); })),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(react_bootstrap_1.FormControl, { name: "siteViewName", placeholder: "Site Name", value: _this.state.form.siteViewName, onChange: _this.handleInputChange })),
                        React.createElement("td", null,
                            React.createElement(react_bootstrap_1.FormControl, { name: "siteViewPath", placeholder: "Site View Path", value: _this.state.form.siteViewPath, onChange: _this.handleInputChange })),
                        React.createElement("td", null,
                            React.createElement(react_bootstrap_1.Checkbox, null)),
                        React.createElement("td", null,
                            React.createElement(StyledButton_1.default, { onClick: function () {
                                    _this.handleSave(createSiteView);
                                } }, "+ Add Site View"))))))))); }));
    };
    return SiteViewsForm;
}(React.Component));
exports.default = SiteViewsForm;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/SiteForm/SiteViewsRouter.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_router_1 = __webpack_require__("./node_modules/react-router/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var siteViewUpdater_1 = __webpack_require__("./app/utils/siteViewUpdater.ts");
var SearchForm_1 = __webpack_require__("./app/components/SiteForm/SearchForm.tsx");
var SiteViewsForm_1 = __webpack_require__("./app/components/SiteForm/SiteViewsForm.tsx");
var SiteViewRouter = /** @class */ (function (_super) {
    __extends(SiteViewRouter, _super);
    function SiteViewRouter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                name: '',
                subdomain: '',
                skipLanding: false,
                editorEmails: [],
            },
            mutations: [],
            addEditorEmail: '',
            prevForm: null,
        };
        _this.handleSave = function (updateSiteView) { return function (mutations, siteView) {
            updateSiteView({
                variables: {
                    input: {
                        mutations: mutations.map(siteViewUpdater_1.serializeMutation),
                        id: siteView.id,
                        name: siteView.name,
                        url: siteView.url,
                    },
                },
            });
        }; };
        _this.handleAddMutation = function (e, siteView) {
            // console.log(e);
            var _a = e.currentTarget, name = _a.name, value = _a.value;
            var mutation = siteViewUpdater_1.createMutation(name, value);
            var view = siteViewUpdater_1.updateView(siteView, _this.state.mutations);
            var currentValue = siteViewUpdater_1.getViewValueByPath(mutation.path, view);
            if (ramda_1.equals(value, currentValue))
                return;
            _this.setState({ mutations: __spread(_this.state.mutations, [mutation]) }, function () {
                return console.log('handleadd', mutation, view, currentValue);
            });
        };
        _this.handleFormChange = function (form) {
            _this.setState({ form: form });
        };
        return _this;
    }
    SiteViewRouter.prototype.render = function () {
        var _this = this;
        var view = siteViewUpdater_1.updateView(this.props.site.siteView, this.state.mutations);
        var path = helpers_1.trimPath(this.props.match.path);
        var allViews = this.props.siteViews;
        var site = this.props.site;
        return (React.createElement(react_router_1.Switch, null,
            React.createElement(react_router_1.Route, { path: path + "/:id/edit", render: function (props) { return (React.createElement(SearchForm_1.default, __assign({}, props, { siteViews: allViews, site: site, view: view, siteViewId: _this.props.location, handleSiteViewEdit: _this.props.handleSiteViewEdit }))); } }),
            React.createElement(react_router_1.Route, { path: "" + path, render: function () { return (React.createElement(SiteViewsForm_1.default, { siteViews: _this.props.siteViews, site: site, refresh: _this.props.refresh, handleForm: _this.props.handleForm })); } })));
    };
    SiteViewRouter.fragment = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    fragment SiteFormFragment on Site {\n      name\n      subdomain\n      skipLanding\n      editors {\n        email\n      }\n    }\n  "], ["\n    fragment SiteFormFragment on Site {\n      name\n      subdomain\n      skipLanding\n      editors {\n        email\n      }\n    }\n  "])));
    return SiteViewRouter;
}(React.Component));
exports.default = SiteViewRouter;
var templateObject_1;


/***/ }),

/***/ "./app/components/SiteForm/StudyForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_router_1 = __webpack_require__("./node_modules/react-router/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var MultiInput_1 = __webpack_require__("./app/components/MultiInput/index.ts");
var StyledCheckbox = styled_components_1.default(react_bootstrap_1.Checkbox)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n"], ["\n  display: flex;\n  align-items: center;\n"])));
var StyledFormControl = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 15px;\n"], ["\n  margin-bottom: 15px;\n"])));
var FormContainer = styled_components_1.default(react_bootstrap_1.Panel)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 15px;\n  min-height: 420px;\n"], ["\n  padding: 15px;\n  min-height: 420px;\n"])));
var SectionForm = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 15px 0 15px 15px;\n"], ["\n  padding: 15px 0 15px 15px;\n"])));
var StudyForm = /** @class */ (function (_super) {
    __extends(StudyForm, _super);
    function StudyForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            newSectionName: '',
        };
        _this.handleCheckboxToggle = function (value) { return function (e) {
            _this.props.onAddMutation({
                currentTarget: { name: e.currentTarget.name, value: !value },
            });
        }; };
        _this.renderBasicSection = function (section, data) {
            return (React.createElement("div", null,
                React.createElement(StyledCheckbox, { name: "set:study.basicSections." + section.name + ".hide", checked: data.hide, onChange: _this.handleCheckboxToggle(data.hide) }, "Hide Section")));
        };
        _this.renderExtendedSection = function (section, data) {
            var fields = data.fields || _this.props.view.study.allFields;
            return (React.createElement("div", null,
                React.createElement(StyledCheckbox, { name: "set:study.extendedSections." + section.name + ".hide", checked: data.hide, onChange: _this.handleCheckboxToggle(data.hide) }, "Hide Section"),
                React.createElement("label", null, "Section name"),
                React.createElement(StyledFormControl, { name: "set:study." + section.name + ".title", placeholder: "Add facet", value: data.title, onChange: _this.props.onAddMutation }),
                React.createElement("label", null, "Order"),
                React.createElement(StyledFormControl, { name: "set:study." + section.name + ".order", placeholder: "Order", value: data.order || '', onChange: _this.props.onAddMutation }),
                React.createElement("label", null, "Fields filter"),
                React.createElement(StyledFormControl, { name: "set:study." + section.name + ".selected.kind", componentClass: "select", onChange: _this.props.onAddMutation, value: data.selected.kind },
                    React.createElement("option", { value: "BLACKLIST" }, "All except"),
                    React.createElement("option", { value: "WHITELIST" }, "Only")),
                React.createElement(MultiInput_1.default, { name: "set:study.extendedSections." + section.name + ".selected.values", options: fields.map(function (field) { return ({ id: field, label: field }); }), placeholder: "Add field", draggable: true, value: data.selected.values, onChange: _this.props.onAddMutation })));
        };
        _this.handleSelect = function (key) {
            _this.props.history.push("" + helpers_1.trimPath(_this.props.match.url) + key);
        };
        _this.handleNewSectionNameChange = function (e) {
            _this.setState({ newSectionName: e.currentTarget.value });
        };
        _this.handleAddSection = function () {
            var section = {
                hide: false,
                title: _this.state.newSectionName,
                name: _this.state.newSectionName.toLowerCase(),
                order: null,
                selected: {
                    kind: 'WHITELIST',
                    values: [],
                },
            };
            _this.props.onAddMutation({
                currentTarget: {
                    name: "push:study.extendedSections",
                    value: JSON.stringify(section),
                },
            });
            _this.setState({ newSectionName: '' });
        };
        _this.getSections = function () {
            var _a = _this.props.view.study, basicSectionsRaw = _a.basicSections, extendedSectionsRaw = _a.extendedSections;
            var basicSections = basicSectionsRaw.map(function (section) { return ({
                name: section.title.toLowerCase(),
                path: "/" + section.title.toLowerCase(),
                displayName: section.title,
                kind: 'basic',
            }); });
            var extendedSections = extendedSectionsRaw.map(function (section) { return ({
                name: section.title.toLowerCase(),
                path: "/" + section.title.toLowerCase(),
                displayName: section.title,
                kind: 'extended',
                order: section.order,
            }); });
            // @ts-ignore
            var sortedExtendedSections = ramda_1.sortBy(ramda_1.pipe(ramda_1.prop('order'), parseInt), extendedSections);
            return __spread(basicSections, sortedExtendedSections);
        };
        _this.getCurrentSectionPath = function () {
            var e_1, _a;
            var pathComponents = ramda_1.pipe(ramda_1.split('/'), ramda_1.reject(ramda_1.isEmpty), ramda_1.map(function (x) { return "/" + x; }), 
            // @ts-ignore
            ramda_1.reverse)(helpers_1.trimPath(_this.props.location.pathname));
            try {
                for (var pathComponents_1 = __values(pathComponents), pathComponents_1_1 = pathComponents_1.next(); !pathComponents_1_1.done; pathComponents_1_1 = pathComponents_1.next()) {
                    var component = pathComponents_1_1.value;
                    if (ramda_1.findIndex(ramda_1.propEq('path', component), _this.getSections()) >= 0) {
                        return component;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (pathComponents_1_1 && !pathComponents_1_1.done && (_a = pathComponents_1.return)) _a.call(pathComponents_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return '/';
        };
        return _this;
    }
    StudyForm.prototype.componentDidMount = function () {
        this.props.handleForm();
    };
    StudyForm.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 2 },
                    React.createElement(react_bootstrap_1.Nav, { bsStyle: "pills", stacked: true, activeKey: this.getCurrentSectionPath(), onSelect: this.handleSelect }, this.getSections().map(function (section) { return (React.createElement(react_bootstrap_1.NavItem, { key: section.path, eventKey: section.path }, section.displayName)); })),
                    React.createElement(SectionForm, null,
                        React.createElement(StyledFormControl, { placeholder: "Add a section", value: this.state.newSectionName, onChange: this.handleNewSectionNameChange }),
                        React.createElement(react_bootstrap_1.Button, { onClick: this.handleAddSection }, "Add"))),
                React.createElement(react_bootstrap_1.Col, { md: 10 },
                    React.createElement(FormContainer, null,
                        React.createElement(react_router_1.Switch, null,
                            this.getSections().map(function (section) { return (React.createElement(react_router_1.Route, { key: "" + helpers_1.trimPath(_this.props.match.url) + section.path, path: "" + helpers_1.trimPath(_this.props.match.url) + section.path, render: function () {
                                    return section.kind === 'basic'
                                        ? _this.renderBasicSection(section, 
                                        // @ts-ignore
                                        ramda_1.find(ramda_1.propEq('title', section.displayName), _this.props.view.study.basicSections))
                                        : _this.renderExtendedSection(section, 
                                        // @ts-ignore
                                        ramda_1.find(ramda_1.propEq('title', section.displayName), _this.props.view.study.extendedSections));
                                } })); }),
                            React.createElement(react_router_1.Redirect, { to: helpers_1.trimPath(this.props.match.url) + "/wiki" })))))));
    };
    return StudyForm;
}(React.Component));
exports.default = StudyForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;


/***/ }),

/***/ "./app/components/SiteForm/Styled.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
exports.StyledContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  h3,\n  h4,\n  h5 {\n    color: white;\n  }\n\n  .panel-group .panel{\n    margin-bottom: 0;\n    border-radius: 4px;\n    background: bottom;\n  }\n"], ["\n  padding: 20px;\n  h3,\n  h4,\n  h5 {\n    color: white;\n  }\n\n  .panel-group .panel{\n    margin-bottom: 0;\n    border-radius: 4px;\n    background: bottom;\n  }\n"])));
exports.StyledFormControl = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 20px;\n"], ["\n  margin-bottom: 20px;\n"])));
exports.StyledLabel = styled_components_1.default.label(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: white;\n"], ["\n  color: white;\n"])));
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/components/SiteItem/SiteItem.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var StyledButton = styled_components_1.default(react_bootstrap_1.Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-right: 15px;\n"], ["\n  margin-right: 15px;\n"])));
var SiteItem = /** @class */ (function (_super) {
    __extends(SiteItem, _super);
    function SiteItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleEditClick = function () {
            _this.props.onEdit(_this.props.site.id);
        };
        _this.handleDeleteClick = function () {
            if (!window)
                return;
            if (!_this.props.onDelete)
                return;
            if (window.confirm('Are you sure?')) {
                _this.props.onDelete(_this.props.site.id);
            }
        };
        return _this;
    }
    SiteItem.prototype.render = function () {
        return (React.createElement("tr", null,
            React.createElement("td", null, this.props.site.name),
            React.createElement("td", null, this.props.site.subdomain),
            React.createElement("td", null,
                React.createElement(StyledButton, { onClick: this.handleEditClick }, "Edit"),
                this.props.onDelete && (React.createElement(StyledButton, { onClick: this.handleDeleteClick }, "Delete")))));
    };
    SiteItem.fragment = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    fragment SiteItemFragment on Site {\n      id\n      name\n      subdomain\n    }\n  "], ["\n    fragment SiteItemFragment on Site {\n      id\n      name\n      subdomain\n    }\n  "])));
    return SiteItem;
}(React.PureComponent));
exports.default = SiteItem;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/components/SiteItem/SiteViewItem.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var DeleteSiteViewMutation_1 = __webpack_require__("./app/mutations/DeleteSiteViewMutation.tsx");
var UpdateSiteViewMutation_1 = __webpack_require__("./app/mutations/UpdateSiteViewMutation.tsx");
var CopySiteViewMutation_1 = __webpack_require__("./app/mutations/CopySiteViewMutation.tsx");
var StyledButton = styled_components_1.default(react_bootstrap_1.Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-right: 15px;\n"], ["\n  margin-right: 15px;\n"])));
// const PreviewText;
var SiteViewItem = /** @class */ (function (_super) {
    __extends(SiteViewItem, _super);
    function SiteViewItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleEditClick = function () {
            var siteViewId = _this.props.siteView.id;
            var siteId = _this.props.match.params.id;
            _this.props.history.push("/sites/" + siteId + "/edit/siteviews/" + siteViewId + "/edit");
        };
        _this.handleCheckbox = function (updateSiteView) {
            var siteView = _this.props.siteView;
            if (siteView.default) {
                alert('There must be a default site view.');
                return null;
            }
            updateSiteView({
                variables: {
                    input: {
                        default: true,
                        id: siteView.id,
                        mutations: [],
                        name: siteView.name,
                    },
                },
            }).then(function () {
                _this.props.refresh();
            });
        };
        _this.handleDelete = function (deleteSiteView) {
            var siteView = _this.props.siteView;
            if (siteView.default) {
                alert('There must be a default site.');
                return null;
            }
            if (!window)
                return;
            if (window.confirm('Are you sure?')) {
                deleteSiteView({
                    variables: {
                        input: {
                            id: siteView.id,
                        },
                    },
                }).then(function (res) {
                    // console.log(res);
                    _this.props.refresh();
                });
            }
        };
        _this.handleCopy = function (copySiteView) {
            var _a = _this.props, siteView = _a.siteView, site = _a.site;
            var copiedName = siteView.name + "copy";
            var copiedUrl = siteView.url + "copy";
            copySiteView({
                variables: {
                    input: {
                        name: copiedName,
                        url: copiedUrl,
                        default: false,
                        siteId: site.id,
                        siteViewId: siteView.id,
                    },
                },
            }).then(function (res) {
                _this.props.refresh();
            });
        };
        return _this;
    }
    SiteViewItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, siteView = _a.siteView, site = _a.site;
        console.log(this.props.site);
        var urlString = "https://" + site.subdomain + ".clinwiki.org/search/" + siteView.url;
        return (React.createElement("tr", null,
            React.createElement("td", null, siteView.name),
            React.createElement("td", null, siteView.url),
            React.createElement("td", null,
                React.createElement(UpdateSiteViewMutation_1.default, null, function (updateSiteView) { return (React.createElement(react_bootstrap_1.Checkbox, { checked: siteView.default, onChange: function () { return _this.handleCheckbox(updateSiteView); } })); })),
            React.createElement("td", null,
                React.createElement("a", { target: "_blank", href: urlString }, urlString)),
            React.createElement("td", null,
                React.createElement(StyledButton, { onClick: this.handleEditClick }, "Edit"),
                React.createElement(CopySiteViewMutation_1.default, null, function (copySiteView) { return (React.createElement(StyledButton, { onClick: function () { return _this.handleCopy(copySiteView); } }, "Copy")); }),
                React.createElement(DeleteSiteViewMutation_1.default, null, function (deleteSiteView) { return (React.createElement(StyledButton, { onClick: function () { return _this.handleDelete(deleteSiteView); } }, "Delete")); }))));
    };
    return SiteViewItem;
}(React.PureComponent));
//@ts-ignore
exports.default = react_router_dom_1.withRouter(SiteViewItem);
var templateObject_1;


/***/ }),

/***/ "./app/components/SiteItem/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SiteItem_1 = __webpack_require__("./app/components/SiteItem/SiteItem.tsx");
exports.SiteItem = SiteItem_1.default;
var SiteViewItem_1 = __webpack_require__("./app/components/SiteItem/SiteViewItem.tsx");
exports.SiteViewItem = SiteViewItem_1.default;


/***/ }),

/***/ "./app/components/StudySummary/StudySummary.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_helmet_1 = __webpack_require__("./node_modules/react-helmet/lib/Helmet.js");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var StudySummary = /** @class */ (function (_super) {
    __extends(StudySummary, _super);
    function StudySummary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StudySummary.prototype.render = function () {
        var _this = this;
        var allowedFields = this.props.workflow
            ? siteViewHelpers_1.displayFields(this.props.workflow.summaryFieldsFilter.kind, this.props.workflow.summaryFieldsFilter.values, this.props.workflow.allSummaryFields.map(function (name) { return ({
                name: name,
                rank: null,
            }); })).map(ramda_1.prop('name'))
            : [
                'nctId',
                'type',
                'overallStatus',
                'completionDate',
                'enrollment',
                'source',
            ];
        return (React.createElement("div", { className: "container" },
            React.createElement(react_helmet_1.Helmet, null,
                React.createElement("title", null, "Wiki - " + this.props.study.briefTitle)),
            React.createElement(CollapsiblePanel_1.default, { header: this.props.study.briefTitle || '' },
                React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                    React.createElement("tbody", null, allowedFields.map(function (name) {
                        return name == 'nctId' ? (
                        // Special case nctID to include a link
                        React.createElement("tr", { key: name },
                            React.createElement("th", null, "NCT ID"),
                            React.createElement("td", null,
                                React.createElement("a", { href: "https://clinicaltrials.gov/ct2/show/" + _this.props.study.nctId, target: "_blank" }, _this.props.study.nctId)))) : (React.createElement("tr", { key: name },
                            React.createElement("th", null, helpers_1.sentanceCaseFromCamelCase(name)),
                            React.createElement("td", null, _this.props.study[name])));
                    }))))));
    };
    StudySummary.fragment = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    fragment StudySummaryFragment on Study {\n      acronym\n      ages\n      averageRating\n      baselinePopulation\n      biospecDescription\n      biospecRetention\n      briefSummary\n      briefTitle\n      collaborators\n      completionDate\n      completionDateType\n      completionMonthYear\n      conditions\n      contacts\n      createdAt\n      design\n      detailedDescription\n      dispositionFirstPostedDate\n      dispositionFirstPostedDateType\n      dispositionFirstSubmittedDate\n      dispositionFirstSubmittedQcDate\n      eligibilityCriteria\n      eligibilityGender\n      eligibilityHealthyVolunteers\n      enrollment\n      enrollmentType\n      expandedAccessTypeIndividual\n      expandedAccessTypeIntermediate\n      expandedAccessTypeTreatment\n      firstReceivedDate\n      hasDataMonitoringCommittee\n      hasDmc\n      hasExpandedAccess\n      investigators\n      ipdAccessCriteria\n      ipdTimeFrame\n      ipdUrl\n      isFdaRegulated\n      isFdaRegulatedDevice\n      isFdaRegulatedDrug\n      isPpsd\n      isUnapprovedDevice\n      isUsExport\n      lastChangedDate\n      lastKnownStatus\n      lastUpdatePostedDate\n      lastUpdatePostedDateType\n      lastUpdateSubmittedDate\n      lastUpdateSubmittedQcDate\n      limitationsAndCaveats\n      listedLocationCountries\n      nctId\n      nlmDownloadDateDescription\n      numberOfArms\n      numberOfGroups\n      officialTitle\n      otherStudyIds\n      overallStatus\n      phase\n      planToShareIpd\n      planToShareIpdDescription\n      primaryCompletionDate\n      primaryCompletionDateType\n      primaryCompletionMonthYear\n      primaryMeasures\n      publications\n      removedLocationCountries\n      responsibleParty\n      resultsFirstPostedDate\n      resultsFirstPostedDateType\n      resultsFirstSubmittedDate\n      resultsFirstSubmittedQcDate\n      reviewsCount\n      secondaryMeasures\n      source\n      sponsor\n      startDate\n      startDateType\n      startMonthYear\n      studyArms\n      studyFirstPostedDate\n      studyFirstPostedDateType\n      studyFirstSubmittedDate\n      studyFirstSubmittedQcDate\n      studyType\n      targetDuration\n      type\n      updatedAt\n      verificationDate\n      verificationMonthYear\n      whyStopped\n    }\n  "], ["\n    fragment StudySummaryFragment on Study {\n      acronym\n      ages\n      averageRating\n      baselinePopulation\n      biospecDescription\n      biospecRetention\n      briefSummary\n      briefTitle\n      collaborators\n      completionDate\n      completionDateType\n      completionMonthYear\n      conditions\n      contacts\n      createdAt\n      design\n      detailedDescription\n      dispositionFirstPostedDate\n      dispositionFirstPostedDateType\n      dispositionFirstSubmittedDate\n      dispositionFirstSubmittedQcDate\n      eligibilityCriteria\n      eligibilityGender\n      eligibilityHealthyVolunteers\n      enrollment\n      enrollmentType\n      expandedAccessTypeIndividual\n      expandedAccessTypeIntermediate\n      expandedAccessTypeTreatment\n      firstReceivedDate\n      hasDataMonitoringCommittee\n      hasDmc\n      hasExpandedAccess\n      investigators\n      ipdAccessCriteria\n      ipdTimeFrame\n      ipdUrl\n      isFdaRegulated\n      isFdaRegulatedDevice\n      isFdaRegulatedDrug\n      isPpsd\n      isUnapprovedDevice\n      isUsExport\n      lastChangedDate\n      lastKnownStatus\n      lastUpdatePostedDate\n      lastUpdatePostedDateType\n      lastUpdateSubmittedDate\n      lastUpdateSubmittedQcDate\n      limitationsAndCaveats\n      listedLocationCountries\n      nctId\n      nlmDownloadDateDescription\n      numberOfArms\n      numberOfGroups\n      officialTitle\n      otherStudyIds\n      overallStatus\n      phase\n      planToShareIpd\n      planToShareIpdDescription\n      primaryCompletionDate\n      primaryCompletionDateType\n      primaryCompletionMonthYear\n      primaryMeasures\n      publications\n      removedLocationCountries\n      responsibleParty\n      resultsFirstPostedDate\n      resultsFirstPostedDateType\n      resultsFirstSubmittedDate\n      resultsFirstSubmittedQcDate\n      reviewsCount\n      secondaryMeasures\n      source\n      sponsor\n      startDate\n      startDateType\n      startMonthYear\n      studyArms\n      studyFirstPostedDate\n      studyFirstPostedDateType\n      studyFirstSubmittedDate\n      studyFirstSubmittedQcDate\n      studyType\n      targetDuration\n      type\n      updatedAt\n      verificationDate\n      verificationMonthYear\n      whyStopped\n    }\n  "])));
    return StudySummary;
}(React.PureComponent));
exports.default = StudySummary;
var templateObject_1;


/***/ }),

/***/ "./app/components/StudySummary/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/StudySummary.tsx");
exports.default = StudySummary_1.default;


/***/ }),

/***/ "./app/components/Toast/Toast.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var Toast = /** @class */ (function (_super) {
    __extends(Toast, _super);
    function Toast() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Toast.prototype.render = function () {
        var _a = this.props, message = _a.message, buttons = _a.buttons;
        return (React.createElement(react_bootstrap_1.Alert, null,
            React.createElement(Container, null,
                React.createElement(Text, null, message),
                buttons.map(function (_a) {
                    var label = _a.label, onClick = _a.onClick;
                    return (React.createElement(react_bootstrap_1.Button, { onClick: onClick }, label));
                }))));
    };
    Toast.fragment = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    fragment ToastFragment on Site {\n      id\n      name\n      subdomain\n    }\n  "], ["\n    fragment ToastFragment on Site {\n      id\n      name\n      subdomain\n    }\n  "])));
    return Toast;
}(React.PureComponent));
var Text = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var Container = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n"], ["\n  display: flex;\n  justify-content: space-between;\n"])));
exports.default = Toast;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/components/Toast/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Toast_1 = __webpack_require__("./app/components/Toast/Toast.tsx");
exports.default = Toast_1.default;


/***/ }),

/***/ "./app/configureApollo.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var apollo_client_1 = __webpack_require__("./node_modules/apollo-client/bundle.umd.js");
var apollo_cache_inmemory_1 = __webpack_require__("./node_modules/apollo-cache-inmemory/lib/bundle.cjs.js");
var apollo_link_context_1 = __webpack_require__("./node_modules/apollo-link-context/lib/index.js");
var localStorage_1 = __webpack_require__("./app/utils/localStorage.ts");
var apollo_link_http_1 = __webpack_require__("./node_modules/apollo-link-http/lib/index.js");
// import { persistCache } from 'apollo-cache-persist';
exports.dataIdFromObject = function (object) {
    var id = object['id'] || object['_id'] || object['nctId'] || null;
    if (!id)
        return null;
    if (!object.__typename)
        return id;
    return object.__typename + ":" + id;
};
var cache = new apollo_cache_inmemory_1.InMemoryCache({
    dataIdFromObject: exports.dataIdFromObject,
});
// persistCache({
//   cache,
//   storage: window.localStorage,
//   maxSize: (2 * 1048576), // 2 MB
// });
console.log('Apollo cache', cache);
function get_gql_url() {
    if (typeof window === 'undefined' ||
        window.location.hostname.includes('localhost')) {
        return "http://" + window.location.hostname + ":3000/graphql";
    }
    return '/graphql';
}
var typeDefs = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  extend type Query {\n    searchQuery: [String!]!\n  }\n"], ["\n  extend type Query {\n    searchQuery: [String!]!\n  }\n"])));
var httpLink = apollo_link_http_1.createHttpLink({ uri: get_gql_url(), credentials: 'include' });
var authLink = apollo_link_context_1.setContext(function (_, _a) {
    var headers = _a.headers;
    // get the authentication token from local storage if it exists
    var token = localStorage_1.getLocalJwt();
    // return the headers to the context so httpLink can read them
    return {
        headers: __assign(__assign({}, headers), { Authorization: token ? "Bearer " + token : '' }),
    };
});
var client = new apollo_client_1.ApolloClient({
    typeDefs: typeDefs,
    cache: cache,
    link: authLink.concat(httpLink),
    resolvers: {},
});
var data = {
    searchParams: null,
    searchQuery: [],
};
cache.writeData({ data: data });
client.onResetStore(function () { return Promise.resolve(cache.writeData({ data: data })); });
exports.default = client;
var templateObject_1;


/***/ }),

/***/ "./app/containers/AboutPage/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var Heading_1 = __webpack_require__("./app/components/Heading/index.ts");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var MainContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #eaedf4;\n  min-height: 95vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n"], ["\n  background-color: #eaedf4;\n  min-height: 95vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n"])));
var AboutPage = /** @class */ (function (_super) {
    __extends(AboutPage, _super);
    function AboutPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AboutPage.prototype.render = function () {
        return (React.createElement(MainContainer, null,
            React.createElement(Heading_1.default, null, " "),
            React.createElement("div", { className: "container" },
                React.createElement("p", null, "ClinWiki allows the crowd to contribute their collective knowledge to improve clinical trial information for everyone."),
                React.createElement("p", null, "Contributors include patients, family members, doctors, scientists or anyone with insights to share."),
                React.createElement("p", null,
                    "We work with patient groups to curate the trials of interest to their disease. Anyone can contribute from patients, caregivers, friends to advisory board mem bers. Partner, Contribute, Code, Document, Donate.",
                    ' '),
                React.createElement("p", null, "ClinWiki is a 501(c)(3) focused on making clinical trials more transparent and approachable, driving participation and ultimately improved trials and faster progress against serious dis eases."),
                React.createElement("p", null,
                    "Special thanks to our supporters,",
                    React.createElement("a", { href: "https://www.cancercommon s.org", target: "_blank" },
                        ' ',
                        "Cancer Commons"),
                    ' ',
                    "and",
                    React.createElement("a", { href: "http://www.orangecountync.gov/departments/outside_agency_non-profit_funding/funding_process.php", target: "_blank" },
                        ' ',
                        "Orange County")),
                React.createElement("p", null, "Contact: clinwiki at clinwiki.org"))));
    };
    return AboutPage;
}(React.PureComponent));
exports.default = AboutPage;
var templateObject_1;


/***/ }),

/***/ "./app/containers/AggDropDown/AggDropDown.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var InfiniteScroll = __webpack_require__("./node_modules/react-infinite-scroller/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var Sorter_1 = __webpack_require__("./app/containers/AggDropDown/Sorter.tsx");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var Types_1 = __webpack_require__("./app/containers/SearchPage/Types.ts");
var graphql_tag_1 = __webpack_require__("./node_modules/graphql-tag/src/index.js");
var aggToField_1 = __webpack_require__("./app/utils/aggs/aggToField.ts");
var globalTypes_1 = __webpack_require__("./app/types/globalTypes.ts");
__webpack_require__("./app/containers/AggDropDown/AggDropDownStyle.css");
var PAGE_SIZE = 25;
var QUERY_AGG_BUCKETS = graphql_tag_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SearchPageAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $aggOptionsSort: [SortInput!]\n    $url: String\n    $configType: String\n    $returnAll: Boolean\n  ) {\n    aggBuckets(\n      url: $url\n      configType: $configType\n      returnAll: $ returnAll\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        aggOptionsSort: $aggOptionsSort\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n  }\n"], ["\n  query SearchPageAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $aggOptionsSort: [SortInput!]\n    $url: String\n    $configType: String\n    $returnAll: Boolean\n  ) {\n    aggBuckets(\n      url: $url\n      configType: $configType\n      returnAll: $ returnAll\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        aggOptionsSort: $aggOptionsSort\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n  }\n"])));
var QUERY_CROWD_AGG_BUCKETS = graphql_tag_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query SearchPageCrowdAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $url: String\n    $configType: String\n    $returnAll: Boolean    \n  ) {\n    aggBuckets: crowdAggBuckets(\n      url: $url\n      configType: $configType\n      returnAll: $ returnAll\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      aggs {\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n  }\n"], ["\n  query SearchPageCrowdAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $url: String\n    $configType: String\n    $returnAll: Boolean    \n  ) {\n    aggBuckets: crowdAggBuckets(\n      url: $url\n      configType: $configType\n      returnAll: $ returnAll\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      aggs {\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n  }\n"])));
var PanelWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  .flex {\n    display:flex;\n    justify-content: space-between;\n  }\n  .checkbox {\n    margin: 3px 0px;\n  }\n  .panel-body {\n    padding: 5px;\n    overflow-x: auto;\n    max-height: 400px;\n  }\n"], ["\n  .flex {\n    display:flex;\n    justify-content: space-between;\n  }\n  .checkbox {\n    margin: 3px 0px;\n  }\n  .panel-body {\n    padding: 5px;\n    overflow-x: auto;\n    max-height: 400px;\n  }\n"])));
var PresearchCard = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  border: 1px solid green;\n  border-radius: 12px;\n  margin: 10px;\n  flex: 1;\n  height: 310px;\n  width: 420px;\n"], ["\n  display: flex;\n  flex-direction: column;\n  border: 1px solid green;\n  border-radius: 12px;\n  margin: 10px;\n  flex: 1;\n  height: 310px;\n  width: 420px;\n"])));
var PresearchHeader = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background-color: #55b88d;\n  padding: 5px;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  height: 50px;\n"], ["\n  background-color: #55b88d;\n  padding: 5px;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  height: 50px;\n"])));
var PresearchTitle = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: white;\n  font-size: 25px;\n  font-weight: 400;\n  margin-left: 5px;\n"], ["\n  color: white;\n  font-size: 25px;\n  font-weight: 400;\n  margin-left: 5px;\n"])));
var PresearchFilter = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-left: 5px;\n  max-height: 30px;\n"], ["\n  margin-left: 5px;\n  max-height: 30px;\n"])));
var PresearchPanel = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  overflow-x: auto;\n  max-height: 200px;\n  min-height: 200px;\n  margin-left: 5px;\n  margin-top: 30px;\n"], ["\n  overflow-x: auto;\n  max-height: 200px;\n  min-height: 200px;\n  margin-left: 5px;\n  margin-top: 30px;\n"])));
var PresearchContent = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding-left: 5px;\n  padding-right: 5px;\n  border-bottom-left-radius: 12px;\n  border-bottom-right-radius: 12px; \n  background-color: white;\n  max-height: 260px;\n"], ["\n  padding-left: 5px;\n  padding-right: 5px;\n  border-bottom-left-radius: 12px;\n  border-bottom-right-radius: 12px; \n  background-color: white;\n  max-height: 260px;\n"])));
var SelectAllSpan = styled_components_1.default.span(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n  border: 1px solid #ccc;\n  padding: 5px;\n  position: absolute;\n  left: 1em;\n  width: 6em;\n  color: black;\n  background: white;\n  border-radius: 4px;\n  font-size: 0.85em;\n"], ["\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n  border: 1px solid #ccc;\n  padding: 5px;\n  position: absolute;\n  left: 1em;\n  width: 6em;\n  color: black;\n  background: white;\n  border-radius: 4px;\n  font-size: 0.85em;\n"])));
var SortKind;
(function (SortKind) {
    SortKind[SortKind["Alpha"] = 0] = "Alpha";
    SortKind[SortKind["Number"] = 1] = "Number";
})(SortKind = exports.SortKind || (exports.SortKind = {}));
var AggDropDown = /** @class */ (function (_super) {
    __extends(AggDropDown, _super);
    function AggDropDown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasMore: true,
            loading: false,
            buckets: [],
            filter: '',
            isOpen: false,
            prevParams: null,
            sortKind: SortKind.Alpha,
            desc: true,
            checkboxValue: false,
            showLabel: false,
            selectedKeys: [],
        };
        _this.isSelected = function (key) {
            return _this.props.selectedKeys && _this.props.selectedKeys.has(key);
        };
        _this.toggleAgg = function (agg, key) {
            if (!_this.props.addFilter || !_this.props.removeFilter)
                return;
            return _this.isSelected(key)
                ? _this.props.removeFilter(agg, key)
                : _this.props.addFilter(agg, key);
        };
        _this.selectAll = function (agg) {
            var buckets = _this.state.buckets;
            var newParams = [];
            buckets.map(function (_a) {
                var key = _a.key;
                newParams.push(key);
            });
            if (_this.props.removeSelectAll) {
                _this.setState({
                    checkboxValue: false,
                });
            }
            if (_this.isAllSelected() != true) {
                if (!_this.props.addFilters) {
                    _this.props.addAllFilters(agg, newParams, false);
                    _this.setState({
                        checkboxValue: true,
                    });
                    return;
                }
                _this.props.addFilters(agg, newParams, false);
                _this.setState({
                    checkboxValue: true,
                });
            }
            else {
                if (!_this.props.removeFilters) {
                    _this.props.removeAllFilters(agg, newParams, false);
                    _this.setState({
                        checkboxValue: false,
                    });
                    return;
                }
                _this.setState({
                    checkboxValue: false,
                });
                _this.props.removeFilters(agg, newParams, false);
            }
        };
        _this.isAllSelected = function () {
            var buckets = _this.state.buckets;
            var i = 0;
            var newParams = [];
            buckets.map(function (_a) {
                var key = _a.key;
                if (_this.isSelected(key)) {
                    i++;
                }
            });
            if (buckets.length == i) {
                return true;
            }
            return false;
        };
        _this.getFullPagesCount = function (buckets) { return Math.floor(ramda_1.length(buckets) / PAGE_SIZE); };
        _this.handleFilterChange = function (e) {
            var value = e.currentTarget.value;
            _this.setState({ filter: value, buckets: [], hasMore: true });
        };
        _this.handleToggle = function () {
            _this.props.onOpen && _this.props.onOpen(_this.props.agg, _this.props.aggKind);
        };
        _this.handleSort = function (desc, sortKind) {
            var aggSort;
            if (!desc && sortKind === SortKind.Alpha) {
                aggSort = [{ id: 'key', desc: true }];
            }
            if (desc && sortKind === SortKind.Number) {
                aggSort = [{ id: 'count', desc: false }];
            }
            if (!desc && sortKind === SortKind.Number) {
                aggSort = [{ id: 'count', desc: true }];
            }
            if (desc && sortKind === SortKind.Alpha) {
                aggSort = [{ id: 'key', desc: false }];
            }
            return aggSort;
        };
        _this.handleLoadMore = function (apolloClient) { return __awaiter(_this, void 0, void 0, function () {
            var _a, desc, sortKind, buckets, filter, _b, agg, searchParams, presearch, currentSiteView, configType, returnAll, _c, query, filterType, aggSort, variables, response, responseBuckets, newBuckets, hasMore;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.state, desc = _a.desc, sortKind = _a.sortKind, buckets = _a.buckets, filter = _a.filter;
                        _b = this.props, agg = _b.agg, searchParams = _b.searchParams, presearch = _b.presearch, currentSiteView = _b.currentSiteView, configType = _b.configType, returnAll = _b.returnAll;
                        _c = __read(this.props.aggKind === 'crowdAggs'
                            ? [QUERY_CROWD_AGG_BUCKETS, 'crowdAggFilters']
                            : [QUERY_AGG_BUCKETS, 'aggFilters'], 2), query = _c[0], filterType = _c[1];
                        aggSort = this.handleSort(desc, sortKind);
                        variables = __assign(__assign({ url: currentSiteView.url, configType: configType, returnAll: returnAll }, searchParams), { aggFilters: Types_1.maskAgg(searchParams.aggFilters, this.props.agg), crowdAggFilters: Types_1.maskAgg(searchParams.crowdAggFilters, agg), agg: agg, pageSize: PAGE_SIZE, page: this.getFullPagesCount(buckets), aggOptionsFilter: filter, aggOptionsSort: aggSort });
                        return [4 /*yield*/, apolloClient.query({
                                query: query,
                                variables: variables,
                            })];
                    case 1:
                        response = _d.sent();
                        responseBuckets = ramda_1.pathOr([], ['data', 'aggBuckets', 'aggs', 0, 'buckets'], response);
                        newBuckets = ramda_1.pipe(ramda_1.concat(responseBuckets), ramda_1.uniqBy(ramda_1.prop('key')), ramda_1.sortBy(ramda_1.prop('key')))(buckets);
                        if (!desc && sortKind === SortKind.Alpha) {
                            newBuckets = ramda_1.pipe(ramda_1.concat(responseBuckets), ramda_1.uniqBy(ramda_1.prop('key')), ramda_1.sortBy(ramda_1.prop('key')), ramda_1.reverse())(buckets);
                        }
                        if (desc && sortKind === SortKind.Number) {
                            newBuckets = ramda_1.pipe(ramda_1.concat(responseBuckets), ramda_1.uniqBy(ramda_1.prop('key')), ramda_1.sortBy(ramda_1.prop('docCount')))(buckets);
                        }
                        if (!desc && sortKind === SortKind.Number) {
                            newBuckets = ramda_1.pipe(ramda_1.concat(responseBuckets), ramda_1.uniqBy(ramda_1.prop('key')), ramda_1.sortBy(ramda_1.prop('docCount')), ramda_1.reverse())(buckets);
                        }
                        hasMore = ramda_1.length(buckets) !== ramda_1.length(newBuckets);
                        this.setState({ buckets: newBuckets, hasMore: hasMore });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.renderBucket = function (value, display, docCount) {
            var text = '';
            switch (display) {
                case globalTypes_1.FieldDisplay.STAR:
                    text = {
                        0: '☆☆☆☆☆',
                        1: '★☆☆☆☆',
                        2: '★★☆☆☆',
                        3: '★★★☆☆',
                        4: '★★★★☆',
                        5: '★★★★★',
                    }[value];
                    break;
                case globalTypes_1.FieldDisplay.DATE:
                    text = new Date(parseInt(value.toString(), 10))
                        .getFullYear()
                        .toString();
                    break;
                default:
                    text = value.toString();
            }
            return text + " (" + docCount + ")";
        };
        _this.renderBuckets = function (_a) {
            var display = _a.display, site = _a.site, field = _a.field;
            var _b = _this.props, agg = _b.agg, _c = _b.visibleOptions, visibleOptions = _c === void 0 ? [] : _c;
            var _d = _this.state.buckets, buckets = _d === void 0 ? [] : _d;
            // if (buckets.length === 0) {
            //   return <div>no results</div>;
            // }
            return ramda_1.pipe(ramda_1.filter(function (_a) {
                var key = _a.key;
                return visibleOptions.length ? visibleOptions.includes(key) : true;
            }), ramda_1.map(function (_a) {
                var key = _a.key, docCount = _a.docCount;
                return (React.createElement(react_bootstrap_1.Checkbox, { key: "key-" + key + "-" + docCount, checked: _this.isSelected(key), onChange: function () { return _this.toggleAgg(agg, key); } }, _this.renderBucket(key, display, docCount)));
            }))(buckets);
        };
        _this.renderBucketsPanel = function (apolloClient, site, isPresearch) {
            var display = _this.props.display;
            var presearch = _this.props.presearch;
            var fieldsArray = function () {
                if (isPresearch) {
                    return __spread(site.search.presearch.aggs.fields, site.search.presearch.crowdAggs.fields);
                }
                return __spread(site.search.aggs.fields, site.search.crowdAggs.fields);
            };
            var field = ramda_1.find(
            //@ts-ignore
            ramda_1.propEq('name', _this.props.agg), fieldsArray());
            if (!display) {
                display = (field && field.display) || globalTypes_1.FieldDisplay.STRING;
            }
            return (React.createElement(InfiniteScroll, { pageStart: 0, loadMore: function () { return _this.handleLoadMore(apolloClient); }, hasMore: _this.state.hasMore, useWindow: false, loader: React.createElement("div", { key: 0, style: { display: 'flex', justifyContent: 'center' } },
                    React.createElement(react_spinners_1.BeatLoader, { key: "loader", color: presearch ? '#000' : '#fff' })) }, _this.renderBuckets({ display: display, site: site, field: field })));
        };
        _this.renderFilter = function () {
            var _a = _this.state, _b = _a.buckets, buckets = _b === void 0 ? [] : _b, filter = _a.filter, desc = _a.desc, sortKind = _a.sortKind;
            var agg = _this.props.agg;
            return (React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: 'solid 1px #ddd',
                } },
                React.createElement("div", { style: { marginTop: '1em' } },
                    React.createElement(react_bootstrap_1.Checkbox, { checked: _this.props.removeSelectAll
                            ? _this.checkSelect()
                            : _this.state.checkboxValue, onChange: function () { return _this.selectAll(agg); }, onMouseEnter: function () { return _this.setState({ showLabel: true }); }, onMouseLeave: function () { return _this.setState({ showLabel: false }); } }, _this.state.showLabel ? (React.createElement(SelectAllSpan, null, "Select All")) : null)),
                React.createElement("div", { style: {
                        flex: 2,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        display: 'flex',
                    } },
                    React.createElement(Sorter_1.default, { type: "alpha", desc: desc, active: sortKind === SortKind.Alpha, toggle: _this.toggleAlphaSort }),
                    React.createElement(Sorter_1.default, { type: "number", desc: desc, active: sortKind === SortKind.Number, toggle: _this.toggleNumericSort })),
                React.createElement(react_bootstrap_1.FormControl, { type: "text", placeholder: "filter...", value: _this.state.filter, onChange: _this.handleFilterChange, style: { flex: 4, marginTop: '4px' } })));
        };
        _this.toggleAlphaSort = function () {
            _this.setState({
                desc: !_this.state.desc,
                sortKind: SortKind.Alpha,
                buckets: [],
                hasMore: true,
            });
        };
        _this.toggleNumericSort = function () {
            _this.setState({
                desc: !_this.state.desc,
                sortKind: SortKind.Number,
                buckets: [],
                hasMore: true,
            });
        };
        _this.checkSelect = function () {
            if (_this.props.removeSelectAll) {
                _this.setState({
                    checkboxValue: false,
                }, function () {
                    if (_this.props.resetSelectAll != null) {
                        _this.props.resetSelectAll();
                    }
                });
            }
        };
        _this.renderPresearchFilter = function (apolloClient, siteView) {
            var _a = _this.state, _b = _a.buckets, buckets = _b === void 0 ? [] : _b, filter = _a.filter;
            return (React.createElement(PresearchContent, null,
                React.createElement(PresearchFilter, null, _this.renderFilter()),
                React.createElement(PresearchPanel, null, _this.renderBucketsPanel(apolloClient, siteView, true))));
        };
        return _this;
    }
    AggDropDown.getDerivedStateFromProps = function (props, state) {
        if (props.isOpen !== state.isOpen) {
            if (props.isOpen) {
                return {
                    hasMore: true,
                    loading: false,
                    buckets: [],
                    filter: '',
                    isOpen: props.isOpen,
                    prevParams: props.searchParams,
                };
            }
            return {
                hasMore: true,
                loading: false,
                buckets: props.buckets,
                filter: '',
                isOpen: props.isOpen,
                prevParams: props.searchParams,
            };
        }
        var findAgg = function (searchParams) {
            if (!searchParams)
                return null;
            var key = props.aggKind === 'aggs' ? 'aggFilters' : 'crowdAggFilters';
            return ramda_1.find(function (agg) { return agg.field === props.agg; }, searchParams[key]);
        };
        if (props.presearch && !ramda_1.equals(state.prevParams, props.searchParams)) {
            return {
                hasMore: true,
                loading: false,
                buckets: [],
                prevParams: props.searchParams,
            };
        }
        var prevAggValue = findAgg(state.prevParams);
        var nextAggValue = findAgg(props.searchParams);
        if (state.isOpen &&
            !ramda_1.equals(state.prevParams, props.searchParams) &&
            ramda_1.equals(prevAggValue, nextAggValue)) {
            return {
                hasMore: true,
                loading: false,
                buckets: props.buckets,
                filter: '',
                isOpen: props.isOpen,
                prevParams: props.searchParams,
            };
        }
        // console.log("returning null")
        return null;
    };
    AggDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, agg = _a.agg, presearch = _a.presearch;
        var isOpen = this.state.isOpen;
        var title = aggToField_1.default(agg);
        var icon = "chevron" + (isOpen ? '-up' : '-down');
        if (presearch) {
            return (React.createElement(react_apollo_1.ApolloConsumer, null, function (apolloClient) { return (React.createElement(PresearchCard, null,
                React.createElement(PresearchHeader, null,
                    React.createElement(PresearchTitle, null, helpers_1.capitalize(title))),
                React.createElement(PresearchContent, null, _this.renderPresearchFilter(apolloClient, _this.props.currentSiteView)))); }));
        }
        return (React.createElement(react_apollo_1.ApolloConsumer, null, function (apolloClient) { return (React.createElement(PanelWrapper, null,
            React.createElement(react_bootstrap_1.Panel, { onToggle: _this.handleToggle, expanded: isOpen, className: "bm-panel-default" },
                React.createElement(react_bootstrap_1.Panel.Heading, { className: "bm-panel-heading" },
                    React.createElement(react_bootstrap_1.Panel.Title, { className: "bm-panel-title", toggle: true },
                        React.createElement("div", { className: "flex" },
                            React.createElement("span", null, title),
                            React.createElement("span", null,
                                React.createElement(FontAwesome, { name: icon }),
                                ' ')))),
                isOpen && (React.createElement(react_bootstrap_1.Panel.Collapse, { className: "bm-panel-collapse" },
                    React.createElement(react_bootstrap_1.Panel.Body, null, _this.renderFilter()),
                    React.createElement(react_bootstrap_1.Panel.Body, null, _this.renderBucketsPanel(apolloClient, _this.props.currentSiteView, false))))))); }));
    };
    return AggDropDown;
}(React.Component));
exports.default = AggDropDown;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;


/***/ }),

/***/ "./app/containers/AggDropDown/AggDropDownStyle.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./app/containers/AggDropDown/AggDropDownStyle.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js!./app/containers/AggDropDown/AggDropDownStyle.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js!./app/containers/AggDropDown/AggDropDownStyle.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./app/containers/AggDropDown/Sorter.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var Sorter = /** @class */ (function (_super) {
    __extends(Sorter, _super);
    function Sorter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            icon: '',
        };
        _this.componentDidMount = function () {
            var type = _this.props.type;
            var iconStr;
            if (type === 'number') {
                iconStr = 'sort-numeric-desc';
            }
            if (type === 'alpha') {
                iconStr = 'sort-alpha-desc';
            }
            _this.setState({
                icon: iconStr,
            });
        };
        _this.componentDidUpdate = function () {
            var _a = _this.props, type = _a.type, desc = _a.desc, active = _a.active;
            if (type === 'number' && active) {
                _this.setState({
                    icon: "sort-numeric-" + (desc ? 'asc' : 'desc'),
                });
            }
            if (type === 'alpha' && active) {
                _this.setState({
                    icon: "sort-alpha-" + (desc ? 'asc' : 'desc'),
                });
            }
            else {
                _this.setState(function (prevState) {
                    icon: prevState.icon;
                });
            }
        };
        return _this;
    }
    Sorter.prototype.render = function () {
        var _a = this.props, toggle = _a.toggle, active = _a.active;
        var icon = this.state.icon;
        return (React.createElement("div", { onClick: toggle },
            React.createElement(FontAwesome, { name: icon, style: active
                    ? { color: '#55b88d', fontSize: '26px' }
                    : { color: '#c0c3c5', fontSize: '26px' } })));
    };
    return Sorter;
}(React.PureComponent));
exports.default = Sorter;


/***/ }),

/***/ "./app/containers/AggDropDown/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AggDropDown_1 = __webpack_require__("./app/containers/AggDropDown/AggDropDown.tsx");
exports.default = AggDropDown_1.default;


/***/ }),

/***/ "./app/containers/App/App.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var NotFoundPage_1 = __webpack_require__("./app/containers/NotFoundPage/index.ts");
var NotConfiguredPage_1 = __webpack_require__("./app/containers/NotConfiguredPage/index.ts");
var SearchPage_1 = __webpack_require__("./app/containers/SearchPage/index.ts");
var LandingPage_1 = __webpack_require__("./app/containers/LandingPage/index.ts");
var AboutPage_1 = __webpack_require__("./app/containers/AboutPage/index.tsx");
var ReleaseNotes_1 = __webpack_require__("./app/containers/ReleaseNotes/index.tsx");
var StudyPage_1 = __webpack_require__("./app/containers/StudyPage/index.ts");
var InterventionPage_1 = __webpack_require__("./app/containers/InterventionPage/index.ts");
var LoginPage_1 = __webpack_require__("./app/containers/LoginPage/index.ts");
var AuthHeader_1 = __webpack_require__("./app/components/AuthHeader/index.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var SitesPage_1 = __webpack_require__("./app/containers/SitesPage/index.ts");
var SitesNewPage_1 = __webpack_require__("./app/containers/SitesNewPage/index.ts");
var SitesEditPage_1 = __webpack_require__("./app/containers/SitesEditPage/index.ts");
var EditWorkflowsPage_1 = __webpack_require__("./app/containers/EditWorkflowsPage/index.ts");
var AppWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #4d5863;\n  min-height: 100vh;\n  min-width: 100%;\n"], ["\n  background-color: #4d5863;\n  min-height: 100vh;\n  min-width: 100%;\n"])));
var MainWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        var _this = this;
        return (React.createElement(AppWrapper, null,
            React.createElement(CurrentUser_1.default, null, function (user) { return React.createElement(AuthHeader_1.default, { user: user, history: _this.props.history }); }),
            React.createElement(MainWrapper, { className: "main container-fluid", style: { paddingTop: '50px' } },
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: LandingPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/about", component: AboutPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/version", component: ReleaseNotes_1.default }),
                    React.createElement(react_router_dom_1.Redirect, { exact: true, from: "/search/", to: "/search/default" }),
                    React.createElement(react_router_dom_1.Route, { path: "/search/:siteviewUrl/:searchId", component: SearchPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/search/:siteviewUrl", component: SearchPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/study/:nctId/review/:reviewId/edit", component: StudyPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/study/:nctId", component: StudyPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/intervention/:id", component: InterventionPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/profile", component: LoginPage_1.EditProfilePage }),
                    React.createElement(react_router_dom_1.Route, { path: "/workflows", component: EditWorkflowsPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/sites/:id/edit", component: SitesEditPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/sites/new", component: SitesNewPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/sites", component: SitesPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/reset_password", component: LoginPage_1.ResetPasswordPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/sign_in", component: LoginPage_1.SignInPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/sign_up", component: LoginPage_1.SignUpPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/not-configured", component: NotConfiguredPage_1.default }),
                    React.createElement(react_router_dom_1.Route, { component: NotFoundPage_1.default })))));
    };
    return App;
}(React.PureComponent));
// @ts-ignore
exports.default = react_router_dom_1.withRouter(App);
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/App/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __webpack_require__("./app/containers/App/App.tsx");
exports.default = App_1.default;


/***/ }),

/***/ "./app/containers/BulkEditPage/BulkEditPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/index.ts");
var BulkEditView_1 = __webpack_require__("./app/containers/BulkEditPage/BulkEditView.tsx");
var PARAMS_QUERY_1 = __webpack_require__("./app/containers/SearchPage/PARAMS_QUERY.tsx");
var BULK_QUERY_UPDATE_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation BulkQueryUpdateMutation($input: BulkQueryUpdateInput!) {\n    bulkQueryUpdate(input: $input) {\n      clientMutationId\n      undoActions {\n        nctId\n        state {\n          enable\n          name\n          value\n        }\n      }\n    }\n  }\n"], ["\n  mutation BulkQueryUpdateMutation($input: BulkQueryUpdateInput!) {\n    bulkQueryUpdate(input: $input) {\n      clientMutationId\n      undoActions {\n        nctId\n        state {\n          enable\n          name\n          value\n        }\n      }\n    }\n  }\n"])));
var BULK_LIST_UPDATE_MUTATION = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation BulkListUpdateMutation($input: BulkListUpdateInput!) {\n    bulkListUpdate(input: $input) {\n      clientMutationId\n    }\n  }\n"], ["\n  mutation BulkListUpdateMutation($input: BulkListUpdateInput!) {\n    bulkListUpdate(input: $input) {\n      clientMutationId\n    }\n  }\n"])));
var LABELS_QUERY = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  query BulkLabelsQuery($searchHash: String!, $params: SearchInput!) {\n    myCrowdAggs: aggBuckets(searchHash: $searchHash, params: $params) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    allCrowdAggs: aggBuckets(\n      params: { page: 0, q: { key: \"*\" }, agg: \"front_matter_keys\" }\n    ) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    search(searchHash: $searchHash) {\n      recordsTotal\n    }\n  }\n"], ["\n  query BulkLabelsQuery($searchHash: String!, $params: SearchInput!) {\n    myCrowdAggs: aggBuckets(searchHash: $searchHash, params: $params) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    allCrowdAggs: aggBuckets(\n      params: { page: 0, q: { key: \"*\" }, agg: \"front_matter_keys\" }\n    ) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    search(searchHash: $searchHash) {\n      recordsTotal\n    }\n  }\n"])));
// escape label
var el = function (label) { return label.replace(/ /g, '').replace('|', '_'); };
var buildParams = function (labels) {
    return labels.reduce(function (s, label) { return "$" + el(label) + "Params: SearchInput! " + s; }, '');
};
var variablesForLabels = function (labels, params) {
    return labels.reduce(function (variables, label) {
        var _a;
        return (__assign(__assign({}, variables), (_a = {}, _a[el(label) + "Params"] = __assign(__assign({}, params), { agg: label }), _a)));
    }, {});
};
var bucketsForLabels = function (labels) {
    var query = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  query BucketsForLabelsQuery (", ") {\n    ", "\n  }\n  "], ["\n  query BucketsForLabelsQuery (", ") {\n    ",
        "\n  }\n  "])), buildParams(labels), labels.reduce(function (s, l) { return "\n      " + s + "\n      " + el(l) + "Selected: crowdAggBuckets(\n        params:   $" + el(l) + "Params\n      ) {\n        aggs {\n          name\n          buckets {\n            key\n            docCount\n          }\n        }\n      }\n      " + el(l) + "All: crowdAggBuckets(\n        params: { agg: \"" + l + "\", q: { key: \"*\" }, page: 0, pageSize: 25 }\n      ) {\n        aggs {\n          name\n          buckets {\n            key\n            docCount\n          }\n        }\n      }\n    "; }, ''));
    return query;
};
var extractBucketKeys = ramda_1.pipe(ramda_1.pathOr([], ['aggs', 0, 'buckets']), ramda_1.map(ramda_1.prop('key')));
var groupBucketsByLabel = function (_a) {
    var data = _a.data, labels = _a.labels;
    return labels.reduce(function (accum, label) {
        var _a;
        return (__assign(__assign({}, accum), (_a = {}, _a[label] = {
            all: extractBucketKeys(data[el(label) + "All"]),
            selected: extractBucketKeys(data[el(label) + "Selected"]),
        }, _a)));
    }, {});
};
var getParsedSearchParams = function (searchParams) {
    var q = searchParams.q, _a = searchParams.aggFilters, aggFilters = _a === void 0 ? [] : _a, _b = searchParams.crowdAggFilters, crowdAggFilters = _b === void 0 ? [] : _b;
    var parsedSearchParams = {
        q: q ? JSON.parse(q) : {},
        aggFilters: aggFilters.map(ramda_1.omit(['__typename'])),
        crowdAggFilters: crowdAggFilters.map(ramda_1.omit(['__typename'])),
        page: 0,
    };
    return parsedSearchParams;
};
var BulkEditPage = /** @class */ (function (_super) {
    __extends(BulkEditPage, _super);
    function BulkEditPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            undoHistory: [],
        };
        return _this;
    }
    BulkEditPage.prototype.renderWorkflow = function (workflow) {
        var _this = this;
        var allowedSuggestedLabels = !workflow
            ? []
            : siteViewHelpers_1.displayFields(workflow.suggestedLabelsFilter.kind, workflow.suggestedLabelsFilter.values, workflow.allSuggestedLabels.map(function (name) { return ({ name: name, rank: null }); })).map(ramda_1.prop('name'));
        var hash = ramda_1.path(['match', 'params', 'searchId'], this.props);
        return (React.createElement(react_apollo_1.Query, { query: PARAMS_QUERY_1.default, variables: { hash: hash } }, function (queryParams) {
            var searchParams = ramda_1.pathOr({}, ['data', 'searchParams'], queryParams);
            var parsedSearchParams = getParsedSearchParams(searchParams);
            return (React.createElement(react_apollo_1.Query, { query: LABELS_QUERY, variables: {
                    searchHash: hash,
                    params: __assign(__assign({}, parsedSearchParams), { agg: 'front_matter_keys' }),
                } }, function (_a) {
                var _b = _a.data, data = _b === void 0 ? {} : _b, loading = _a.loading, error = _a.error;
                var allCrowdAggs = data.allCrowdAggs, myCrowdAggs = data.myCrowdAggs;
                var recordsTotal = ramda_1.pathOr(0, ['search', 'recordsTotal'], data);
                var labels = ramda_1.uniq(__spread(new Set(__spread(extractBucketKeys(allCrowdAggs), extractBucketKeys(myCrowdAggs)))).filter(function (x) { return !FILTERED_LABELS.includes(x); })
                    .filter(function (x) { return !workflow || allowedSuggestedLabels.includes(x); }));
                if (!labels.length)
                    return null;
                return (React.createElement(react_apollo_1.Query, { query: bucketsForLabels(labels), variables: variablesForLabels(labels, parsedSearchParams) }, function (_a) {
                    var _b = _a.data, data = _b === void 0 ? {} : _b, loading = _a.loading, error = _a.error;
                    if (error) {
                        console.log(error);
                        console.log(labels);
                    }
                    var aggBucketsByLabel = groupBucketsByLabel({
                        data: data,
                        labels: labels,
                    });
                    // console.log('BUCKETS', { labels, aggBucketsByLabel });
                    return (React.createElement(react_apollo_1.Mutation, { mutation: BULK_LIST_UPDATE_MUTATION }, function (bulkListUpdate, bulkListUpdateResult) { return (React.createElement(react_apollo_1.Mutation, { mutation: BULK_QUERY_UPDATE_MUTATION }, function (bulkQueryUpdate, _a) {
                        var data = _a.data, loading = _a.loading;
                        return (React.createElement(BulkEditView_1.default, { labels: labels, aggBucketsByLabel: aggBucketsByLabel, recordsTotal: recordsTotal, loading: loading, undoHistory: _this.state.undoHistory, handleUndo: function (undoActions, idx) {
                                bulkListUpdate({
                                    variables: {
                                        input: {
                                            updates: undoActions.map(function (a) { return (__assign(__assign({}, ramda_1.omit(['__typename'], a)), { state: a.state.map(ramda_1.omit(['__typename'])) })); }),
                                        },
                                    },
                                }).then(function () {
                                    _this.setState(function (state) { return ({
                                        undoHistory: state.undoHistory.filter(function (x, i) { return idx != i; }),
                                    }); });
                                });
                            }, commit: function (toAdd, toRemove, description) {
                                return bulkQueryUpdate({
                                    variables: {
                                        input: {
                                            searchParams: __assign(__assign({}, parsedSearchParams), { pageSize: recordsTotal }),
                                            aggState: __spread(toAdd.map(function (_a) {
                                                var name = _a.name, value = _a.value;
                                                return ({
                                                    name: name,
                                                    value: value,
                                                    enable: true,
                                                });
                                            }), toRemove.map(function (_a) {
                                                var name = _a.name, value = _a.value;
                                                return ({
                                                    name: name,
                                                    value: value,
                                                    enable: false,
                                                });
                                            })),
                                        },
                                    },
                                }).then(function (result) {
                                    _this.setState(function (state) { return ({
                                        undoHistory: __spread(state.undoHistory, [
                                            {
                                                description: description,
                                                undoActions: result.data.bulkQueryUpdate
                                                    .undoActions,
                                            },
                                        ]),
                                    }); });
                                });
                            } }));
                    })); }));
                }));
            }));
        }));
    };
    BulkEditPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(WorkflowsViewProvider_1.default, null, function (workflowsView) {
            var workflow = ramda_1.pipe(ramda_1.prop('workflows'), ramda_1.find(ramda_1.propEq('name', 'wf_bulk')))(workflowsView);
            return _this.renderWorkflow(workflow);
        }));
    };
    return BulkEditPage;
}(React.PureComponent));
var FILTERED_LABELS = [
    'browse_condition_mesh_terms',
    'overall_status',
    'phase',
];
exports.default = BulkEditPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;


/***/ }),

/***/ "./app/containers/BulkEditPage/BulkEditView.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var Toast_1 = __webpack_require__("./app/components/Toast/index.ts");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var MultiCrumb_1 = __webpack_require__("./app/components/MultiCrumb/index.ts");
var groupByLabel = function (labels) {
    return labels.reduce(function (accum, x) {
        var _a;
        return (__assign(__assign({}, accum), (_a = {}, _a[x.name] = __spread((accum[x.name] || []), [x.value]), _a)));
    }, {});
};
var isSelected = function (_a) {
    var label = _a.label, value = _a.value;
    return function (x) {
        return x.name != label || x.value != value;
    };
};
var BulkEditView = /** @class */ (function (_super) {
    __extends(BulkEditView, _super);
    function BulkEditView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            labelsToAdd: [],
            labelsToRemove: [],
        };
        _this.handleSelect = function (label, value, checked) {
            if (checked) {
                _this.setState(function (state) { return ({
                    labelsToRemove: __spread(state.labelsToRemove, [{ name: label, value: value }]),
                    labelsToAdd: state.labelsToAdd.filter(isSelected({ label: label, value: value })),
                }); });
            }
            else {
                _this.setState(function (state) { return ({
                    labelsToAdd: __spread(state.labelsToAdd, [{ name: label, value: value }]),
                    labelsToRemove: state.labelsToRemove.filter(isSelected({ label: label, value: value })),
                }); });
            }
        };
        _this.handleRemoveCrumb = function (label, value, fromAdd) {
            if (fromAdd === void 0) { fromAdd = false; }
            if (fromAdd) {
                _this.setState(function (state) { return ({
                    labelsToAdd: state.labelsToAdd.filter(isSelected({ label: label, value: value })),
                }); });
            }
            else {
                _this.setState(function (state) { return ({
                    labelsToRemove: state.labelsToRemove.filter(isSelected({ label: label, value: value })),
                }); });
            }
        };
        return _this;
    }
    BulkEditView.prototype.render = function () {
        var _this = this;
        var _a = this.props, commit = _a.commit, handleUndo = _a.handleUndo, loading = _a.loading, labels = _a.labels, aggBucketsByLabel = _a.aggBucketsByLabel, recordsTotal = _a.recordsTotal, undoHistory = _a.undoHistory;
        var _b = this.state, labelsToAdd = _b.labelsToAdd, labelsToRemove = _b.labelsToRemove;
        var groupedByLabel = {
            toAdd: groupByLabel(labelsToAdd),
            toRemove: groupByLabel(labelsToRemove),
        };
        return (React.createElement(MainContainer, null,
            React.createElement(PanelContainer, null,
                React.createElement(Loading, { show: loading }),
                React.createElement(Title, null, "Crowd Labels"),
                React.createElement(Container, null, labels.map(function (label) {
                    return !aggBucketsByLabel[label].all.length ? null : (React.createElement(StyledPanel, { key: label, header: label, dropdown: true }, aggBucketsByLabel[label].all.map(function (value) {
                        var indeterminate = aggBucketsByLabel[label].selected.includes(value);
                        var isToAdd = groupedByLabel.toAdd[label] &&
                            groupedByLabel.toAdd[label].includes(value);
                        var isToRemove = groupedByLabel.toRemove[label] &&
                            groupedByLabel.toRemove[label].includes(value);
                        return (React.createElement(react_bootstrap_1.Checkbox, { key: label + "-" + value, checked: (indeterminate || isToAdd) && !isToRemove, inputRef: function (el) {
                                return el &&
                                    (el.indeterminate =
                                        indeterminate && !isToAdd && !isToRemove);
                            }, onChange: function () {
                                return _this.handleSelect(label, value, isToAdd);
                            } }, value));
                    })));
                })),
                !labelsToAdd.length && !labelsToRemove.length
                    ? "Select labels to update " + recordsTotal + " studies"
                    : '',
                React.createElement(CrumbsBarStyleWrapper, { className: "crumbs-bar" },
                    labelsToAdd.length ? ' Add: ' : '',
                    labelsToAdd.length
                        ? Object.keys(groupedByLabel.toAdd).map(function (label) { return (React.createElement(MultiCrumb_1.default, { key: label, category: label, values: groupedByLabel.toAdd[label], onClick: function (value) {
                                return _this.handleRemoveCrumb(label, value, true);
                            } })); })
                        : null,
                    labelsToRemove.length ? ' Remove: ' : '',
                    labelsToRemove.length
                        ? Object.keys(groupedByLabel.toRemove).map(function (label) { return (React.createElement(MultiCrumb_1.default, { key: label, category: label, values: groupedByLabel.toRemove[label], onClick: function (value) {
                                return _this.handleRemoveCrumb(label, value, false);
                            } })); })
                        : null,
                    labelsToAdd.length || labelsToRemove.length
                        ? "on " + recordsTotal + " studies"
                        : ''),
                React.createElement(react_bootstrap_1.ButtonToolbar, null,
                    React.createElement(react_bootstrap_1.Button, { onClick: function () {
                            return commit(labelsToAdd, labelsToRemove, buildDescription({
                                groupedByLabel: groupedByLabel,
                                recordsTotal: recordsTotal,
                            })).then(function () {
                                return _this.setState({ labelsToRemove: [], labelsToAdd: [] });
                            });
                        } }, "Save"),
                    labelsToAdd.length || labelsToRemove.length ? (React.createElement(react_bootstrap_1.Button, { bsStyle: "danger", onClick: function () {
                            return _this.setState({ labelsToAdd: [], labelsToRemove: [] });
                        } }, "Clear")) : null)),
            React.createElement(ToastContainer, null, undoHistory.length
                ? undoHistory.map(function (_a, idx) {
                    var description = _a.description, undoActions = _a.undoActions;
                    return (React.createElement(Toast_1.default, { message: description, buttons: [
                            {
                                label: 'UNDO',
                                onClick: function () {
                                    handleUndo(undoActions, idx);
                                },
                            },
                        ] }));
                })
                : null)));
    };
    return BulkEditView;
}(React.Component));
var CrumbsBarStyleWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 8px;\n  .container {\n    background: #d9deea;\n    border: 0px;\n\n    color: #394149;\n  }\n\n  i {\n    font-style: normal;\n    margin-right: 3px;\n    text-transform: capitalize;\n  }\n\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n\n  input.form-control {\n    border: 0px;\n    box-shadow: none;\n    margin-right: 10px;\n    margin-left: 10px;\n  }\n\n  span.label {\n    background: none;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n\n    b {\n      padding-right: 5px;\n    }\n\n    b:last-of-type {\n      padding-right: 0px;\n    }\n  }\n\n  .right-align {\n    text-align: right;\n  }\n\n  div.row > div {\n    padding-left: 0px;\n  }\n\n  .searchInput {\n    padding-bottom: 10px;\n  }\n"], ["\n  margin-bottom: 8px;\n  .container {\n    background: #d9deea;\n    border: 0px;\n\n    color: #394149;\n  }\n\n  i {\n    font-style: normal;\n    margin-right: 3px;\n    text-transform: capitalize;\n  }\n\n  span.label.label-default {\n    padding: 7px !important;\n    border-radius: 2px !important;\n  }\n\n  input.form-control {\n    border: 0px;\n    box-shadow: none;\n    margin-right: 10px;\n    margin-left: 10px;\n  }\n\n  span.label {\n    background: none;\n    padding: 5px;\n    font-size: 12px;\n    border-radius: 4px;\n    margin-right: 5px;\n    text-transform: capitalize;\n\n    span.fa-remove {\n      color: #fff !important;\n      opacity: 0.5;\n      margin-left: 5px !important;\n    }\n\n    span.fa-remove:hover {\n      opacity: 1;\n    }\n\n    b {\n      padding-right: 5px;\n    }\n\n    b:last-of-type {\n      padding-right: 0px;\n    }\n  }\n\n  .right-align {\n    text-align: right;\n  }\n\n  div.row > div {\n    padding-left: 0px;\n  }\n\n  .searchInput {\n    padding-bottom: 10px;\n  }\n"])));
var Loading = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.7);\n  transition: 0.3s;\n  opacity: 0;\n  pointer-events: none;\n  ", "\n  z-index: 999999;\n"], ["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.7);\n  transition: 0.3s;\n  opacity: 0;\n  pointer-events: none;\n  ",
    "\n  z-index: 999999;\n"])), function (props) {
    return props.show
        ? "\n      opacity:1;\n      pointer-events: initial;\n  "
        : '';
});
var ToastContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  padding: 20px;\n"], ["\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  padding: 20px;\n"])));
var buildDescription = function (_a) {
    var groupedByLabel = _a.groupedByLabel, recordsTotal = _a.recordsTotal;
    var desc = '';
    if (Object.keys(groupedByLabel.toAdd).length) {
        desc += "Added: ";
        desc += "" + Object.entries(groupedByLabel.toAdd)
            .map(function (_a) {
            var _b = __read(_a, 2), label = _b[0], values = _b[1];
            return label + ": " + values;
        })
            .join('. ');
    }
    if (Object.keys(groupedByLabel.toRemove).length) {
        desc += "Removed: ";
        desc += "" + Object.entries(groupedByLabel.toRemove)
            .map(function (_a) {
            var _b = __read(_a, 2), label = _b[0], values = _b[1];
            return label + ": " + values;
        })
            .join('. ');
    }
    if (desc != '')
        desc += " on " + recordsTotal + " studies.";
    return desc;
};
var MainContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding: 20px;\n"], ["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding: 20px;\n"])));
var PanelContainer = styled_components_1.default(react_bootstrap_1.Panel)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 16px;\n  position: relative;\n"], ["\n  padding: 16px;\n  position: relative;\n"])));
var Container = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n"])));
var Title = styled_components_1.default.h3(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-bottom: 20px;\n"], ["\n  margin-bottom: 20px;\n"])));
var StyledPanel = styled_components_1.default(CollapsiblePanel_1.default)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  margin: 0 10px 10px 0;\n  width: 250px;\n  .panel-heading h3 {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    position: absolute;\n    max-width: 200px;\n  }\n  .panel-body {\n    height: 150px !important;\n    overflow: scroll;\n  }\n"], ["\n  margin: 0 10px 10px 0;\n  width: 250px;\n  .panel-heading h3 {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    position: absolute;\n    max-width: 200px;\n  }\n  .panel-body {\n    height: 150px !important;\n    overflow: scroll;\n  }\n"])));
exports.default = BulkEditView;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;


/***/ }),

/***/ "./app/containers/BulkEditPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/BulkEditPage/BulkEditPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/CrowdPage/AddCrowdLabel.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var ButtonCell_1 = __webpack_require__("./app/containers/CrowdPage/ButtonCell.tsx");
var defaultState = {
    inAddMode: false,
    key: '',
    value: '',
    prevForceAddLabel: null,
};
var StyleWrapper = styled_components_1.default.tr(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  input,\n  textarea {\n    width: '100%';\n    border: '1px solid #ccc';\n  }\n"], ["\n  input,\n  textarea {\n    width: '100%';\n    border: '1px solid #ccc';\n  }\n"])));
var AddCrowdLabel = /** @class */ (function (_super) {
    __extends(AddCrowdLabel, _super);
    function AddCrowdLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = defaultState;
        _this.handleKeyChange = function (e) {
            _this.setState({ key: e.currentTarget.value });
        };
        _this.handleValueChange = function (e) {
            _this.setState({ value: e.currentTarget.value });
        };
        _this.handleSubmit = function () {
            _this.props.onAddLabel(_this.state.key, _this.state.value);
            _this.setState(defaultState);
        };
        _this.handleAddClick = function () {
            _this.setState({ inAddMode: true });
        };
        return _this;
    }
    AddCrowdLabel.prototype.render = function () {
        return (React.createElement(StyleWrapper, null,
            React.createElement("td", { style: { verticalAlign: 'middle', width: '20%' } }, this.state.inAddMode && (React.createElement(react_bootstrap_1.FormControl, { type: "text", placeholder: "Add a label", value: this.state.key, onChange: this.handleKeyChange }))),
            React.createElement("td", { style: { borderRight: 'none', width: '50%' } }, this.state.inAddMode && (React.createElement(react_bootstrap_1.FormControl, { componentClass: "textarea", placeholder: "Add a description", value: this.state.value, onChange: this.handleValueChange }))),
            React.createElement(ButtonCell_1.default, null,
                React.createElement("div", null)),
            React.createElement(ButtonCell_1.default, null,
                React.createElement("div", null)),
            React.createElement(ButtonCell_1.default, null,
                React.createElement("div", null,
                    this.state.inAddMode && (React.createElement(react_bootstrap_1.Button, { onClick: this.handleSubmit }, "Submit")),
                    !this.state.inAddMode && (React.createElement(react_bootstrap_1.Button, { onClick: this.handleAddClick }, this.props.name || 'Add'))))));
    };
    AddCrowdLabel.getDerivedStateFromProps = function (props, state) {
        var key = props.forceAddLabel && props.forceAddLabel.key;
        if (key && state.prevForceAddLabel !== props.forceAddLabel) {
            return __assign(__assign({}, state), { key: key, inAddMode: true, value: defaultState.value, prevForceAddLabel: props.forceAddLabel });
        }
        return __assign(__assign({}, state), { prevForceAddLabel: props.forceAddLabel });
    };
    return AddCrowdLabel;
}(React.Component));
exports.default = AddCrowdLabel;
var templateObject_1;


/***/ }),

/***/ "./app/containers/CrowdPage/ButtonCell.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
exports.default = styled_components_1.default.td(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-left: none !important;\n  border-right: none !important;\n  div {\n    display: flex;\n    justify-content: flex-end;\n    flex-direction: row;\n  }\n"], ["\n  border-left: none !important;\n  border-right: none !important;\n  div {\n    display: flex;\n    justify-content: flex-end;\n    flex-direction: row;\n  }\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/containers/CrowdPage/CrowdLabel.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var ButtonCell_1 = __webpack_require__("./app/containers/CrowdPage/ButtonCell.tsx");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var CrowdLabel = /** @class */ (function (_super) {
    __extends(CrowdLabel, _super);
    function CrowdLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            inEditMode: false,
            value: null,
            prevPropsValue: null,
        };
        _this.handleDescriptionChange = function (e) {
            _this.setState({ value: e.currentTarget.value });
        };
        _this.handleAddClick = function () {
            _this.props.onAddClick && _this.props.onAddClick(_this.props.name);
        };
        _this.handleDeleteClick = function () {
            _this.props.onDeleteClick &&
                _this.props.onDeleteClick(_this.props.name, _this.props.value);
        };
        _this.handleSubmitClick = function () {
            _this.props.onSubmitClick &&
                _this.props.onSubmitClick(_this.props.name, _this.props.value, _this.state.value || '');
            _this.setState({ inEditMode: false });
        };
        _this.handleEditClick = function () {
            _this.setState({ inEditMode: true });
        };
        return _this;
    }
    CrowdLabel.prototype.render = function () {
        var _this = this;
        var _a = this.props, name = _a.name, value = _a.value;
        return (React.createElement("tr", { key: name + "-" + value },
            React.createElement("td", null, name),
            React.createElement("td", { style: { borderRight: 0 } }, this.state.inEditMode ? (React.createElement(react_bootstrap_1.FormControl, { componentClass: "textarea", placeholder: "Add a description", value: this.state.value, onChange: this.handleDescriptionChange })) : (value)),
            React.createElement(CurrentUser_1.default, null, function (user) {
                if (!user) {
                    return (React.createElement(React.Fragment, null,
                        React.createElement(ButtonCell_1.default, null),
                        React.createElement(ButtonCell_1.default, null),
                        React.createElement(ButtonCell_1.default, null)));
                }
                return (React.createElement(React.Fragment, null,
                    React.createElement(ButtonCell_1.default, null,
                        React.createElement("div", null,
                            React.createElement(react_bootstrap_1.Button, { onClick: _this.handleAddClick }, "Add"))),
                    _this.state.inEditMode && (React.createElement(ButtonCell_1.default, null,
                        React.createElement("div", null,
                            React.createElement(react_bootstrap_1.Button, { onClick: _this.handleSubmitClick }, "Submit")))),
                    !_this.state.inEditMode && (React.createElement(ButtonCell_1.default, null,
                        React.createElement("div", null,
                            React.createElement(react_bootstrap_1.Button, { onClick: _this.handleEditClick }, "Edit")))),
                    React.createElement(ButtonCell_1.default, null,
                        React.createElement("div", null,
                            React.createElement(react_bootstrap_1.Button, { onClick: _this.handleDeleteClick }, "Delete")))));
            })));
    };
    CrowdLabel.getDerivedStateFromProps = function (props, state) {
        if (state.value == null) {
            return __assign(__assign({}, state), { value: props.value, prevPropsValue: props.value });
        }
        if (state.prevPropsValue !== props.value) {
            return __assign(__assign({}, state), { value: props.value, prevPropsValue: props.value });
        }
        return state;
    };
    return CrowdLabel;
}(React.Component));
exports.default = CrowdLabel;


/***/ }),

/***/ "./app/containers/CrowdPage/CrowdPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_helmet_1 = __webpack_require__("./node_modules/react-helmet/lib/Helmet.js");
var LoadingPane_1 = __webpack_require__("./app/components/LoadingPane/index.ts");
var Error_1 = __webpack_require__("./app/components/Error/index.ts");
var Edits_1 = __webpack_require__("./app/components/Edits/index.ts");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var CrowdLabel_1 = __webpack_require__("./app/containers/CrowdPage/CrowdLabel.tsx");
var AddCrowdLabel_1 = __webpack_require__("./app/containers/CrowdPage/AddCrowdLabel.tsx");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment CrowdPageFragment on WikiPage {\n    nctId\n    meta\n  }\n"], ["\n  fragment CrowdPageFragment on WikiPage {\n    nctId\n    meta\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query CrowdPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...CrowdPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query CrowdPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...CrowdPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, FRAGMENT);
exports.UPSERT_LABEL_MUTATION = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  mutation CrowdPageUpsertWikiLabelMutation(\n    $nctId: String!\n    $key: String!\n    $value: String!\n  ) {\n    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {\n      wikiPage {\n        ...CrowdPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  mutation CrowdPageUpsertWikiLabelMutation(\n    $nctId: String!\n    $key: String!\n    $value: String!\n  ) {\n    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {\n      wikiPage {\n        ...CrowdPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"])), FRAGMENT, Edits_1.default.fragment);
exports.DELETE_LABEL_MUTATION = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  mutation CrowdPageDeleteWikiLabelMutation($nctId: String!, $key: String!) {\n    deleteWikiLabel(input: { nctId: $nctId, key: $key }) {\n      wikiPage {\n        ...CrowdPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  mutation CrowdPageDeleteWikiLabelMutation($nctId: String!, $key: String!) {\n    deleteWikiLabel(input: { nctId: $nctId, key: $key }) {\n      wikiPage {\n        ...CrowdPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"])), FRAGMENT, Edits_1.default.fragment);
var TableWrapper = styled_components_1.default(react_bootstrap_1.Table)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  td {\n    vertical-align: middle !important;\n  }\n"], ["\n  td {\n    vertical-align: middle !important;\n  }\n"])));
var UpsertMutationComponent = /** @class */ (function (_super) {
    __extends(UpsertMutationComponent, _super);
    function UpsertMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpsertMutationComponent;
}(react_apollo_1.Mutation));
exports.UpsertMutationComponent = UpsertMutationComponent;
var DeleteMutationComponent = /** @class */ (function (_super) {
    __extends(DeleteMutationComponent, _super);
    function DeleteMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeleteMutationComponent;
}(react_apollo_1.Mutation));
exports.DeleteMutationComponent = DeleteMutationComponent;
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var Crowd = /** @class */ (function (_super) {
    __extends(Crowd, _super);
    function Crowd() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            forceAddLabel: null,
            prevForceAddLabel: null,
        };
        _this.handleAddLabel = function (key, value, meta, upsertLabelMutation) {
            Crowd.addLabel(key, value, meta, _this.props.match.params.nctId, upsertLabelMutation);
            _this.setState({ forceAddLabel: null });
        };
        _this.handleDeleteLabel = function (meta, upsertLabelMutation, deleteLabelMutation) { return function (key, value) {
            Crowd.deleteLabel(key, value, meta, _this.props.match.params.nctId, upsertLabelMutation, deleteLabelMutation);
        }; };
        _this.handleSubmitLabel = function (meta, upsertLabelMutation) { return function (key, oldValue, value) {
            Crowd.updateLabel(key, oldValue, value, meta, _this.props.match.params.nctId, upsertLabelMutation);
        }; };
        _this.handleAddInsideLabelClick = function (key) {
            _this.setState({ forceAddLabel: { key: key, value: '' } });
        };
        _this.handleLoaded = function () {
            _this.props.onLoaded && _this.props.onLoaded();
        };
        _this.renderLabels = function (meta, upsertLabelMutation, deleteLabelMutation) {
            var labels = ramda_1.pipe(ramda_1.keys, ramda_1.map(function (key) {
                return meta[key].split('|').map(function (value) { return ({ key: key, value: value }); });
            }), 
            // @ts-ignore
            ramda_1.flatten)(meta);
            var content = (React.createElement(TableWrapper, { striped: true, condensed: true, bordered: true },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: { width: '20%' } }, "Label"),
                        React.createElement("th", { style: { width: '50%', borderRight: 'none' } }, "Description"),
                        React.createElement("th", { style: {
                                width: '10%',
                                borderLeft: 'none',
                                borderRight: 'none',
                            } }),
                        React.createElement("th", { style: {
                                width: '10%',
                                borderLeft: 'none',
                                borderRight: 'none',
                            } }),
                        React.createElement("th", { style: {
                                width: '10%',
                                borderLeft: 'none',
                                borderRight: 'none',
                            } }))),
                React.createElement("tbody", null,
                    labels.map(function (label) { return (React.createElement(CrowdLabel_1.default, { key: label.key + " - " + label.value, name: label.key, value: label.value, onSubmitClick: _this.handleSubmitLabel(meta, upsertLabelMutation), onDeleteClick: _this.handleDeleteLabel(meta, upsertLabelMutation, deleteLabelMutation), onAddClick: _this.handleAddInsideLabelClick })); }),
                    React.createElement(CurrentUser_1.default, null, function (user) {
                        return user &&
                            !_this.props.workflowView && (React.createElement(AddCrowdLabel_1.default, { onAddLabel: function (key, value) {
                                return _this.handleAddLabel(key, value, meta, upsertLabelMutation);
                            }, forceAddLabel: _this.state.forceAddLabel }));
                    }))));
            if (_this.props.workflowView) {
                content = (React.createElement(CollapsiblePanel_1.default, { header: "All Crowd Labels", collapsed: true }, content));
            }
            return (React.createElement("div", null,
                React.createElement(react_helmet_1.default, null,
                    React.createElement("title", null, "Crowd Annotations")),
                content));
        };
        return _this;
    }
    Crowd.getDerivedStateFromProps = function (props, state) {
        if (props.forceAddLabel &&
            !ramda_1.equals(props.forceAddLabel, state.prevForceAddLabel)) {
            return __assign(__assign({}, state), { forceAddLabel: props.forceAddLabel, prevForceAddLabel: props.forceAddLabel });
        }
        return null;
    };
    Crowd.prototype.render = function () {
        var _this = this;
        return (React.createElement(UpsertMutationComponent, { mutation: exports.UPSERT_LABEL_MUTATION }, function (upsertLabelMutation) { return (React.createElement(DeleteMutationComponent, { mutation: exports.DELETE_LABEL_MUTATION }, function (deleteLabelMutation) { return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: _this.props.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading) {
                return React.createElement(LoadingPane_1.default, null);
            }
            if (error) {
                return React.createElement(Error_1.default, { message: error.message });
            }
            _this.handleLoaded();
            if (!data || !data.study || !data.study.wikiPage)
                return null;
            var meta;
            try {
                meta = JSON.parse(data.study.wikiPage.meta || '{}');
            }
            catch (e) {
                console.error("Error on parsing meta '" + data.study.wikiPage.meta + "' for nctId: " + _this.props.match.params.nctId, e);
                return null;
            }
            return _this.renderLabels(meta, upsertLabelMutation, deleteLabelMutation);
        })); })); }));
    };
    Crowd.fragment = FRAGMENT;
    Crowd.updateLabel = function (key, oldValue, value, meta, nctId, upsertLabelMutation) {
        var _a;
        if (!value)
            return;
        var currentValue = meta[key];
        if (currentValue == null)
            return;
        var parts = currentValue.split('|');
        var idx = ramda_1.findIndex(ramda_1.equals(oldValue), parts);
        if (idx === -1)
            return;
        parts[idx] = value;
        var newValue = ramda_1.uniq(parts).join('|');
        upsertLabelMutation({
            variables: { nctId: nctId, key: key, value: newValue },
            optimisticResponse: {
                upsertWikiLabel: {
                    __typename: 'UpsertWikiLabelPayload',
                    wikiPage: {
                        nctId: nctId,
                        __typename: 'WikiPage',
                        meta: JSON.stringify(__assign(__assign({}, meta), (_a = {}, _a[key] = newValue, _a))),
                        edits: [],
                    },
                    errors: null,
                },
            },
        });
    };
    Crowd.deleteLabel = function (key, value, meta, nctId, upsertLabelMutation, deleteLabelMutation) {
        var _a;
        var currentValue = meta[key];
        if (!currentValue)
            return null;
        var newValue = ramda_1.uniq(currentValue.split('|').filter(function (x) { return x !== value; })).join('|');
        if (newValue.length === 0) {
            var newMeta = ramda_1.dissoc(key, meta);
            deleteLabelMutation({
                variables: { key: key, nctId: nctId },
                optimisticResponse: {
                    deleteWikiLabel: {
                        __typename: 'DeleteWikiLabelPayload',
                        wikiPage: {
                            nctId: nctId,
                            __typename: 'WikiPage',
                            meta: JSON.stringify(newMeta),
                            edits: [],
                        },
                        errors: null,
                    },
                },
            });
        }
        else {
            upsertLabelMutation({
                variables: {
                    nctId: nctId,
                    key: key,
                    value: newValue,
                },
                optimisticResponse: {
                    upsertWikiLabel: {
                        __typename: 'UpsertWikiLabelPayload',
                        wikiPage: {
                            nctId: nctId,
                            __typename: 'WikiPage',
                            meta: JSON.stringify(__assign(__assign({}, meta), (_a = {}, _a[key] = newValue, _a))),
                            edits: [],
                        },
                        errors: null,
                    },
                },
            });
        }
    };
    Crowd.addLabel = function (key, value, meta, nctId, upsertLabelMutation) {
        var _a;
        if (!value)
            return;
        var val = value;
        if (meta[key]) {
            var oldVal = meta[key];
            var entries = oldVal.split('|').filter(function (x) { return x !== val; });
            entries.push(value);
            val = ramda_1.uniq(entries).join('|');
        }
        upsertLabelMutation({
            variables: { nctId: nctId, key: key, value: val },
            optimisticResponse: {
                upsertWikiLabel: {
                    __typename: 'UpsertWikiLabelPayload',
                    wikiPage: {
                        nctId: nctId,
                        __typename: 'WikiPage',
                        meta: JSON.stringify(__assign(__assign({}, meta), (_a = {}, _a[key] = val, _a))),
                        edits: [],
                    },
                    errors: null,
                },
            },
        });
    };
    return Crowd;
}(React.Component));
exports.default = Crowd;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;


/***/ }),

/***/ "./app/containers/CrowdPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CrowdPage_1 = __webpack_require__("./app/containers/CrowdPage/CrowdPage.tsx");
exports.default = CrowdPage_1.default;
var CrowdPage_2 = __webpack_require__("./app/containers/CrowdPage/CrowdPage.tsx");
exports.UpsertMutationComponent = CrowdPage_2.UpsertMutationComponent;
exports.DeleteMutationComponent = CrowdPage_2.DeleteMutationComponent;
exports.UPSERT_LABEL_MUTATION = CrowdPage_2.UPSERT_LABEL_MUTATION;
exports.DELETE_LABEL_MUTATION = CrowdPage_2.DELETE_LABEL_MUTATION;


/***/ }),

/***/ "./app/containers/CurrentUser/CurrentUser.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment UserFragment on User {\n    id\n    email\n    firstName\n    lastName\n    defaultQueryString\n    roles\n  }\n"], ["\n  fragment UserFragment on User {\n    id\n    email\n    firstName\n    lastName\n    defaultQueryString\n    roles\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query CurrentUserQuery {\n    me {\n      ...UserFragment\n    }\n  }\n\n  ", "\n"], ["\n  query CurrentUserQuery {\n    me {\n      ...UserFragment\n    }\n  }\n\n  ", "\n"])), FRAGMENT);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var CurrentUser = /** @class */ (function (_super) {
    __extends(CurrentUser, _super);
    function CurrentUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CurrentUser.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data) {
                return _this.props.children(null);
            }
            return _this.props.children(data.me);
        }));
    };
    CurrentUser.fragment = FRAGMENT;
    CurrentUser.query = QUERY;
    return CurrentUser;
}(React.PureComponent));
exports.default = CurrentUser;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/CurrentUser/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/CurrentUser.tsx");
exports.default = CurrentUser_1.default;


/***/ }),

/***/ "./app/containers/EditWorkflowsPage/EditWorkflowsPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/WorkflowsViewProvider.tsx");
var WorkflowForm_1 = __webpack_require__("./app/containers/EditWorkflowsPage/WorkflowForm.tsx");
var siteViewUpdater_1 = __webpack_require__("./app/utils/siteViewUpdater.ts");
var UpdateWorflowsViewMutation_1 = __webpack_require__("./app/mutations/UpdateWorflowsViewMutation.tsx");
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 15px;\n"], ["\n  padding: 15px;\n"])));
var StyledPanel = styled_components_1.default(react_bootstrap_1.Panel)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 15px;\n"], ["\n  padding: 15px;\n"])));
var EditWorkflowsPage = /** @class */ (function (_super) {
    __extends(EditWorkflowsPage, _super);
    function EditWorkflowsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { currentWorkflowName: null, mutations: [] };
        _this.applyMutations = function (workflowsView) {
            // @ts-ignore
            return siteViewUpdater_1.updateView(workflowsView, _this.state.mutations);
        };
        _this.handleSave = function (updateWorkflowsView) { return function () {
            updateWorkflowsView({
                variables: {
                    input: { mutations: _this.state.mutations.map(siteViewUpdater_1.serializeMutation) },
                },
            });
        }; };
        _this.handleWorkflowSelect = function (workflow) {
            _this.setState({ currentWorkflowName: workflow });
        };
        _this.handleAddMutation = function (workflowView) { return function (e) {
            var _a = e.currentTarget, name = _a.name, value = _a.value;
            var mutation = siteViewUpdater_1.createMutation(name, value);
            var view = _this.applyMutations(workflowView);
            // @ts-ignore
            var currentValue = siteViewUpdater_1.getViewValueByPath(mutation.path, view);
            if (ramda_1.equals(value, currentValue))
                return;
            _this.setState({ mutations: __spread(_this.state.mutations, [mutation]) });
        }; };
        return _this;
    }
    EditWorkflowsPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(WorkflowsViewProvider_1.default, null, function (rawWorkflowsView) {
            if (!_this.state.currentWorkflowName &&
                rawWorkflowsView.workflows &&
                rawWorkflowsView.workflows.length > 0) {
                _this.setState({
                    currentWorkflowName: rawWorkflowsView.workflows[0].name,
                });
                return null;
            }
            var workflowsView = _this.applyMutations(rawWorkflowsView);
            var workflow = ramda_1.find(ramda_1.propEq('name', _this.state.currentWorkflowName), workflowsView.workflows);
            if (workflow == null)
                return (React.createElement(Container, null,
                    React.createElement(react_bootstrap_1.Row, null, "No Workflows")));
            else
                return (React.createElement(Container, null,
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { md: 2 },
                            React.createElement(react_bootstrap_1.Nav, { bsStyle: "pills", stacked: true, activeKey: _this.state.currentWorkflowName, onSelect: _this.handleWorkflowSelect }, workflowsView.workflows.map(function (workflow) { return (React.createElement(react_bootstrap_1.NavItem, { key: workflow.name, eventKey: workflow.name }, workflow.name)); }))),
                        React.createElement(react_bootstrap_1.Col, { md: 10 },
                            React.createElement(StyledPanel, null,
                                React.createElement(WorkflowForm_1.default, { workflow: workflow, onAddMutation: _this.handleAddMutation(workflowsView) }),
                                React.createElement(UpdateWorflowsViewMutation_1.default, null, function (updateWorflowsView) { return (React.createElement(react_bootstrap_1.Button, { style: { marginTop: 15 }, onClick: _this.handleSave(updateWorflowsView) }, "Save")); }))))));
        }));
    };
    return EditWorkflowsPage;
}(React.Component));
exports.default = EditWorkflowsPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/EditWorkflowsPage/WorkflowForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var MultiInput_1 = __webpack_require__("./app/components/MultiInput/index.ts");
var StyledFormControl = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 15px;\n"], ["\n  margin-bottom: 15px;\n"])));
var StyledLabel = styled_components_1.default.label(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 15px;\n"], ["\n  margin-top: 15px;\n"])));
var StyledCheckbox = styled_components_1.default(react_bootstrap_1.Checkbox)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n"], ["\n  display: flex;\n  align-items: center;\n"])));
var WorkflowForm = /** @class */ (function (_super) {
    __extends(WorkflowForm, _super);
    function WorkflowForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleCheckboxToggle = function (value) { return function (e) {
            _this.props.onAddMutation({
                currentTarget: { name: e.currentTarget.name, value: !value },
            });
        }; };
        return _this;
    }
    WorkflowForm.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("h3", null, this.props.workflow.name),
            React.createElement(StyledLabel, null, "Facets"),
            React.createElement(StyledFormControl, { name: "set:workflows." + this.props.workflow.name + ".suggestedLabelsFilter.kind", componentClass: "select", onChange: this.props.onAddMutation, value: this.props.workflow.suggestedLabelsFilter.kind },
                React.createElement("option", { value: "BLACKLIST" }, "All except"),
                React.createElement("option", { value: "WHITELIST" }, "Only")),
            React.createElement(MultiInput_1.default, { name: "set:workflows." + this.props.workflow.name + ".suggestedLabelsFilter.values", options: this.props.workflow.allSuggestedLabels.map(function (field) { return ({
                    id: field,
                    label: field,
                }); }), placeholder: "Add field", value: this.props.workflow.suggestedLabelsFilter.values, onChange: this.props.onAddMutation }),
            React.createElement(StyledLabel, null, "Reviews"),
            React.createElement(StyledCheckbox, { name: "set:workflows." + this.props.workflow.name + ".hideReviews", checked: this.props.workflow.hideReviews, onChange: this.handleCheckboxToggle(this.props.workflow.hideReviews) }, "Hide Reviews section"),
            React.createElement(StyledCheckbox, { name: "set:workflows." + this.props.workflow.name + ".disableAddRating", checked: this.props.workflow.disableAddRating, onChange: this.handleCheckboxToggle(this.props.workflow.disableAddRating) }, "Disable add rating"),
            React.createElement(StyledLabel, null, "Wiki sections"),
            React.createElement(StyledFormControl, { name: "set:workflows." + this.props.workflow.name + ".wikiSectionsFilter.kind", componentClass: "select", onChange: this.props.onAddMutation, value: this.props.workflow.wikiSectionsFilter.kind },
                React.createElement("option", { value: "BLACKLIST" }, "All except"),
                React.createElement("option", { value: "WHITELIST" }, "Only")),
            React.createElement(MultiInput_1.default, { name: "set:workflows." + this.props.workflow.name + ".wikiSectionsFilter.values", options: this.props.workflow.allWikiSections.map(function (field) { return ({
                    id: field,
                    label: field,
                }); }), placeholder: "Add field", value: this.props.workflow.wikiSectionsFilter.values, onChange: this.props.onAddMutation }),
            React.createElement(StyledLabel, null, "Summary fields"),
            React.createElement(StyledFormControl, { name: "set:workflows." + this.props.workflow.name + ".summaryFieldsFilter.kind", componentClass: "select", onChange: this.props.onAddMutation, value: this.props.workflow.summaryFieldsFilter.kind },
                React.createElement("option", { value: "BLACKLIST" }, "All except"),
                React.createElement("option", { value: "WHITELIST" }, "Only")),
            React.createElement(MultiInput_1.default, { name: "set:workflows." + this.props.workflow.name + ".summaryFieldsFilter.values", options: this.props.workflow.allSummaryFields.map(function (field) { return ({
                    id: field,
                    label: field,
                }); }), placeholder: "Add field", value: this.props.workflow.summaryFieldsFilter.values, onChange: this.props.onAddMutation })));
    };
    return WorkflowForm;
}(React.PureComponent));
exports.default = WorkflowForm;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/containers/EditWorkflowsPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditWorkflowsPage_1 = __webpack_require__("./app/containers/EditWorkflowsPage/EditWorkflowsPage.tsx");
exports.default = EditWorkflowsPage_1.default;


/***/ }),

/***/ "./app/containers/FacilitiesPage/FacilitiesPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var google_map_react_1 = __webpack_require__("./node_modules/google-map-react/lib/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var MapMarker_1 = __webpack_require__("./app/containers/FacilitiesPage/MapMarker.tsx");
var FacilityCard_1 = __webpack_require__("./app/containers/FacilitiesPage/FacilityCard.tsx");
var MappingContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  height: 700px;\n  @media (max-width: 991px) {\n    flex-direction: column-reverse;\n    max-height: 1400px;\n  }\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  height: 700px;\n  @media (max-width: 991px) {\n    flex-direction: column-reverse;\n    max-height: 1400px;\n  }\n"])));
var ScrollCardContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 45%;\n  overflow-y: scroll;\n  padding-right: 15px;\n  margin-bottom: 15px;\n  @media (max-width: 991px) {\n    min-height: 250px;\n    width: 100%;\n    margin: 10px;\n    max-height: 700px;\n  }\n"], ["\n  width: 45%;\n  overflow-y: scroll;\n  padding-right: 15px;\n  margin-bottom: 15px;\n  @media (max-width: 991px) {\n    min-height: 250px;\n    width: 100%;\n    margin: 10px;\n    max-height: 700px;\n  }\n"])));
var MapContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  height: 700px;\n  width: 55%;\n  padding-bottom: 20px;\n  margin-left: 3px;\n  @media (max-width: 991px) {\n    width: 100%;\n  }\n"], ["\n  height: 700px;\n  width: 55%;\n  padding-bottom: 20px;\n  margin-left: 3px;\n  @media (max-width: 991px) {\n    width: 100%;\n  }\n"])));
var FRAGMENT = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  fragment FacilityFragment on Facility {\n    city\n    country\n    id\n    name\n    nctId\n    state\n    status\n    location {\n      latitude\n      longitude\n      status\n    }\n    zip\n    contacts {\n      contactType\n      email\n      id\n      name\n      nctId\n      phone\n    }\n  }\n"], ["\n  fragment FacilityFragment on Facility {\n    city\n    country\n    id\n    name\n    nctId\n    state\n    status\n    location {\n      latitude\n      longitude\n      status\n    }\n    zip\n    contacts {\n      contactType\n      email\n      id\n      name\n      nctId\n      phone\n    }\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  query FacilitiesPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      facilities {\n        ...FacilityFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query FacilitiesPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      facilities {\n        ...FacilityFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, FRAGMENT);
var MAPOPTIONS = {
    minZoom: 0,
};
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var FacilitiesPage = /** @class */ (function (_super) {
    __extends(FacilitiesPage, _super);
    function FacilitiesPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            facilities: [],
            markerClicked: false,
            facilityExpanded: false,
            mapCenter: { lat: 39.5, lng: -98.35 },
            mapZoom: 4,
        };
        _this.componentDidMount = function () {
            _this.setState({
                mapZoom: 4,
                mapCenter: {
                    lat: 39.5,
                    lng: -98.35,
                },
            });
        };
        _this.componentDidUpdate = function (prevProps) {
            if (prevProps.match.params.nctId !== _this.props.match.params.nctId) {
                _this.setState({
                    mapZoom: 4,
                    mapCenter: {
                        lat: 39.5,
                        lng: -98.35,
                    },
                });
            }
        };
        _this.processFacility = function (facility, i) {
            var _a, _b, _c, _d, _e, _f;
            var res = [];
            var name = facility.name, country = facility.country, city = facility.city, state = facility.state, zip = facility.zip, contacts = facility.contacts, location = facility.location;
            var latitude = (_b = (_a = location) === null || _a === void 0 ? void 0 : _a.latitude, (_b !== null && _b !== void 0 ? _b : null));
            var longitude = (_d = (_c = location) === null || _c === void 0 ? void 0 : _c.longitude, (_d !== null && _d !== void 0 ? _d : null));
            var geoStatus = (_f = (_e = location) === null || _e === void 0 ? void 0 : _e.status, (_f !== null && _f !== void 0 ? _f : null));
            var newStatus = ramda_1.isEmpty(facility.status)
                ? 'Status Unknown'
                : facility.status;
            var newLocation = ramda_1.isEmpty(facility.state)
                ? city + ", " + country
                : city + ", " + state + " " + zip + ", " + country;
            var uid = city + "-" + state + "-" + zip + "-" + country;
            res.push({
                name: name,
                key: uid,
                location: newLocation,
                index: i + 1,
                status: newStatus,
                contacts: contacts,
                latitude: latitude,
                longitude: longitude,
                geoStatus: geoStatus,
            });
            return res;
        };
        _this.renderFacilityCards = function (_a) {
            var key = _a.key, location = _a.location, index = _a.index, status = _a.status, contacts = _a.contacts, latitude = _a.latitude, longitude = _a.longitude, geoStatus = _a.geoStatus, name = _a.name;
            return (React.createElement("div", null,
                React.createElement(FacilityCard_1.default, { key: key + "-" + index, name: name, title: key, index: index, status: status, location: location, contacts: contacts, latitude: latitude, longitude: longitude, geoStatus: geoStatus, numberClick: _this.onCardNumberClick })));
        };
        _this.onMarkerClick = function () {
            _this.setState({
                markerClicked: !_this.state.markerClicked,
            });
        };
        _this.onCardNumberClick = function (lat, long, status) {
            if (status === 'bad') {
                return null;
            }
            else
                _this.setState({
                    mapCenter: {
                        lat: lat,
                        lng: long,
                    },
                    mapZoom: 8,
                });
        };
        return _this;
    }
    FacilitiesPage.prototype.render = function () {
        var _this = this;
        var _a = this.state, mapCenter = _a.mapCenter, mapZoom = _a.mapZoom;
        var K_HOVER_DISTANCE = 30;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading ||
                error ||
                !data ||
                !data.study ||
                !data.study.facilities) {
                return null;
            }
            _this.props.onLoaded && _this.props.onLoaded();
            var facilities = data.study.facilities;
            var items = ramda_1.pipe(ramda_1.addIndex(ramda_1.map)(_this.processFacility), 
            // @ts-ignore
            ramda_1.flatten)(facilities);
            return (React.createElement(MappingContainer, null,
                React.createElement(ScrollCardContainer, null, items.map(_this.renderFacilityCards)),
                React.createElement(MapContainer, null,
                    React.createElement(google_map_react_1.default, { bootstrapURLKeys: {
                            key: 'AIzaSyBfU6SDxHb6b_ZYtMWngKj8zyeRgcrhM5M',
                        }, defaultCenter: { lat: 39.5, lng: -98.35 }, center: mapCenter, defaultZoom: 4, zoom: mapZoom, hoverDistance: K_HOVER_DISTANCE, options: MAPOPTIONS, key: _this.props }, facilities.map(function (item, index) {
                        var _a, _b, _c, _d, _e, _f;
                        if ((_b = (_a = item.location) === null || _a === void 0 ? void 0 : _a.status, (_b !== null && _b !== void 0 ? _b : 'bad')) === 'bad') {
                            return null;
                        }
                        else
                            return (React.createElement(MapMarker_1.default, { onClick: _this.onMarkerClick, clicked: _this.state.markerClicked, key: "" + item.name + ((_c = item.location) === null || _c === void 0 ? void 0 : _c.latitude), lat: (_d = item.location) === null || _d === void 0 ? void 0 : _d.latitude, lng: (_e = item.location) === null || _e === void 0 ? void 0 : _e.longitude, geoStatus: (_f = item.location) === null || _f === void 0 ? void 0 : _f.status, 
                                // location={item.location}
                                contacts: item.contacts, text: index + 1, name: item.name, address: item.city + ", " + item.state + " " + item.zip }));
                    })))));
        }));
    };
    FacilitiesPage.fragment = FRAGMENT;
    return FacilitiesPage;
}(React.PureComponent));
exports.default = FacilitiesPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;


/***/ }),

/***/ "./app/containers/FacilitiesPage/FacilityCard.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var FacilityCardWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: white;\n  margin-bottom: 15px;\n  padding: 10px;\n  box-shadow: 6px 7px 5px -1px rgba(0, 0, 0, 0.36);\n"], ["\n  background-color: white;\n  margin-bottom: 15px;\n  padding: 10px;\n  box-shadow: 6px 7px 5px -1px rgba(0, 0, 0, 0.36);\n"])));
var FacilityHeader = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n"], ["\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n"])));
var FacilityNumber = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid #324870;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: #55b88d;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n"], ["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid #324870;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: #55b88d;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n"])));
var WarningNumber = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid #ffcc00;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: #f6a202;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n"], ["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid #ffcc00;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: #f6a202;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n"])));
var ErrorNumber = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid red;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: red;\n  font-size: 16px;\n  font-weight: bold;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n  cursor: pointer;\n"], ["\n  position: relative;\n  width: 28px;\n  height: 22px;\n  border: 3px solid red;\n  border-radius: 22px;\n  background-color: white;\n  text-align: center;\n  color: red;\n  font-size: 16px;\n  font-weight: bold;\n  box-shadow: 0 0 0 1px white;\n  align-self: flex-end;\n  margin: 0;\n  padding-bottom: 22px;\n  cursor: pointer;\n"])));
var WarningHover = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 200px;\n  height: 30px;\n  background-color: #ffcc00;\n  color: white;\n  font-size: 14px;\n  position: absolute;\n  top: 30px;\n  right: -5px;\n  padding-top: 5px;\n  visibility: hidden;\n  border-radius: 1px;\n  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);\n"], ["\n  width: 200px;\n  height: 30px;\n  background-color: #ffcc00;\n  color: white;\n  font-size: 14px;\n  position: absolute;\n  top: 30px;\n  right: -5px;\n  padding-top: 5px;\n  visibility: hidden;\n  border-radius: 1px;\n  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);\n"])));
var ErrorHover = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 200px;\n  height: 30px;\n  background-color: red;\n  color: white;\n  font-size: 14px;\n  position: absolute;\n  top: 30px;\n  right: -5px;\n  padding-top: 5px;\n  visibility: hidden;\n  border-radius: 1px;\n  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);\n"], ["\n  width: 200px;\n  height: 30px;\n  background-color: red;\n  color: white;\n  font-size: 14px;\n  position: absolute;\n  top: 30px;\n  right: -5px;\n  padding-top: 5px;\n  visibility: hidden;\n  border-radius: 1px;\n  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);\n"])));
var FacilityTitle = styled_components_1.default.h2(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  width: 92%;\n  font-weight: 600;\n  color: #55b88d;\n  font-size: 20px;\n  margin: 0;\n"], ["\n  width: 92%;\n  font-weight: 600;\n  color: #55b88d;\n  font-size: 20px;\n  margin: 0;\n"])));
var FacilityBody = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding-top: 4px;\n  width: 100%;\n"], ["\n  padding-top: 4px;\n  width: 100%;\n"])));
var FacilitySubHead = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  font-weight: 600;\n  color: #324870;\n  font-size: 16px;\n  margin-right: 7px;\n"], ["\n  font-weight: 600;\n  color: #324870;\n  font-size: 16px;\n  margin-right: 7px;\n"])));
var Row = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  flex-direction: row;\n  display: flex;\n"], ["\n  flex-direction: row;\n  display: flex;\n"])));
var Col = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  flex-direction: column;\n  display: flex;\n"], ["\n  flex-direction: column;\n  display: flex;\n"])));
var ContactHead = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  font-weight: 600;\n  color: #324870;\n  font-size: 16px;\n  text-decoration: underline;\n"], ["\n  font-weight: 600;\n  color: #324870;\n  font-size: 16px;\n  text-decoration: underline;\n"])));
var FacilityWarning = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  font-weight: 400;\n  color: #ff6d36;\n  font-size: 14px;\n  margin-top: 2px;\n  margin-right: 3px;\n"], ["\n  font-weight: 400;\n  color: #ff6d36;\n  font-size: 14px;\n  margin-top: 2px;\n  margin-right: 3px;\n"])));
var FacilityError = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  font-weight: 400;\n  color: red;\n  font-size: 14px;\n  margin-top: 2px;\n"], ["\n  font-weight: 400;\n  color: red;\n  font-size: 14px;\n  margin-top: 2px;\n"])));
var FacilitySubText = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #333;\n  font-weight: 400;\n  margin-top: 2px;\n"], ["\n  font-size: 14px;\n  color: #333;\n  font-weight: 400;\n  margin-top: 2px;\n"])));
var FacilityFooter = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  font-size: 18px;\n  color: #c0c3c5;\n  padding-top: 5px;\n"], ["\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  font-size: 18px;\n  color: #c0c3c5;\n  padding-top: 5px;\n"])));
var WarningPointer = styled_components_1.default.div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid #ffcc00;\n  position: relative;\n  bottom: -3px;\n  right: -1px;\n  visibility: hidden;\n"], ["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid #ffcc00;\n  position: relative;\n  bottom: -3px;\n  right: -1px;\n  visibility: hidden;\n"])));
var ErrorPointer = styled_components_1.default.div(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid red;\n  position: relative;\n  bottom: -3px;\n  right: -1px;\n  visibility: hidden;\n"], ["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid red;\n  position: relative;\n  bottom: -3px;\n  right: -1px;\n  visibility: hidden;\n"])));
var FacilityCard = /** @class */ (function (_super) {
    __extends(FacilityCard, _super);
    function FacilityCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            facilityExpanded: false,
            warningHover: false,
            errorHover: false,
        };
        _this.toggleExpand = function () {
            _this.setState({
                facilityExpanded: !_this.state.facilityExpanded,
            });
        };
        _this.toggleWarning = function (bool) {
            _this.setState({
                warningHover: bool,
            });
        };
        _this.toggleError = function (bool) {
            _this.setState({
                errorHover: bool,
            });
        };
        _this.truncateString = function (str, n, useWordBoundary) {
            if (str.length <= n) {
                return str;
            }
            var shortStr = str.substr(0, n);
            return ((useWordBoundary
                ? shortStr.substr(0, shortStr.lastIndexOf(' '))
                : shortStr) + '...');
        };
        _this.capitalize = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        _this.renderContactList = function (contacts) {
            return (React.createElement("div", null,
                React.createElement(FacilitySubHead, null, "Contact Info:"),
                React.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '20px',
                    } }, contacts.map(function (item, index) { return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                    React.createElement(ContactHead, null, _this.capitalize(item.contactType)),
                    React.createElement("div", { style: { marginLeft: '20px' } },
                        React.createElement(Row, null,
                            React.createElement(FacilitySubHead, null, "Phone:"),
                            React.createElement(FacilitySubText, null, item.phone)),
                        React.createElement(Row, null,
                            React.createElement(FacilitySubHead, null, "Email:"),
                            React.createElement(FacilitySubText, null, item.email)),
                        React.createElement(Row, null,
                            React.createElement(FacilitySubHead, null, "Name:"),
                            React.createElement(FacilitySubText, null, item.name))))); }))));
        };
        _this.renderContacts = function (contacts) {
            if (contacts.length > 0) {
                return _this.renderContactList(contacts);
            }
            else
                return (React.createElement(Row, null,
                    React.createElement(FacilitySubHead, null, "Contact Info:"),
                    React.createElement(FacilitySubText, null, "No Contact Info Available")));
        };
        _this.renderNumber = function (geoStatus, index, latitude, longitude, numberClick) {
            if (geoStatus === 'good') {
                return (React.createElement(FacilityNumber, { onClick: function () { return numberClick(latitude, longitude, geoStatus); } }, index));
            }
            if (geoStatus === 'zip') {
                return (React.createElement(WarningNumber, { onClick: function () { return numberClick(latitude, longitude, geoStatus); }, onMouseEnter: function () { return _this.toggleWarning(true); }, onMouseOut: function () { return _this.toggleWarning(false); } },
                    React.createElement(WarningHover, { style: _this.state.warningHover
                            ? { visibility: 'visible' }
                            : { visibility: 'hidden' } }, "Partial Address Mapped"),
                    index,
                    React.createElement(WarningPointer, { style: _this.state.warningHover
                            ? { visibility: 'visible' }
                            : { visibility: 'hidden' } })));
            }
            if (geoStatus === 'bad') {
                return (React.createElement(ErrorNumber, { onMouseEnter: function () { return _this.toggleError(true); }, onMouseOut: function () { return _this.toggleError(false); } },
                    React.createElement(ErrorHover, { style: _this.state.errorHover
                            ? { visibility: 'visible' }
                            : { visibility: 'hidden' } }, "No Address Mapped"),
                    "!",
                    React.createElement(ErrorPointer, { style: _this.state.errorHover
                            ? { visibility: 'visible' }
                            : { visibility: 'hidden' } })));
            }
        };
        _this.renderLocation = function (geoStatus, location) {
            if (geoStatus === 'bad') {
                return (React.createElement(Row, null,
                    React.createElement(FacilitySubHead, null, "Location:"),
                    React.createElement(FacilityError, null, location)));
            }
            if (geoStatus === 'zip') {
                return (React.createElement(Row, null,
                    React.createElement(FacilitySubHead, null, "Location:"),
                    React.createElement(FacilityWarning, null, location)));
            }
            if (geoStatus === 'good') {
                return (React.createElement(Row, null,
                    React.createElement(FacilitySubHead, null, "Location"),
                    React.createElement(FacilitySubText, null, location)));
            }
        };
        return _this;
    }
    FacilityCard.prototype.render = function () {
        var facilityExpanded = this.state.facilityExpanded;
        var _a = this.props, title = _a.title, index = _a.index, status = _a.status, location = _a.location, contacts = _a.contacts, numberClick = _a.numberClick, latitude = _a.latitude, longitude = _a.longitude, geoStatus = _a.geoStatus, name = _a.name;
        var newTitle;
        if (name) {
            newTitle = facilityExpanded ? name : this.truncateString(name, 33, true);
        }
        else
            newTitle = title;
        return (React.createElement(FacilityCardWrapper, { key: title },
            React.createElement(FacilityHeader, null,
                React.createElement(FacilityTitle, null, newTitle || ''),
                React.createElement("div", { style: { width: '8%' } }, this.renderNumber(geoStatus, index, latitude, longitude, numberClick))),
            React.createElement(FacilityBody, null,
                React.createElement(Row, null,
                    React.createElement(FacilitySubHead, null, "Status:"),
                    React.createElement(FacilitySubText, null, status)),
                this.renderLocation(geoStatus, location),
                facilityExpanded ? this.renderContacts(contacts) : null),
            React.createElement(FacilityFooter, null, React.createElement(FontAwesome, { name: facilityExpanded ? 'chevron-up' : 'chevron-down', onClick: this.toggleExpand }))));
    };
    return FacilityCard;
}(React.PureComponent));
exports.default = FacilityCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19;


/***/ }),

/***/ "./app/containers/FacilitiesPage/FacilityInfoCard.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var CardContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-width: 250px;\n  background-color: #55b88d;\n  min-height: 75px;\n  position: relative;\n  bottom: 85px;\n  right: 20px;\n  padding: 10px;\n  z-index: 5000;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  cursor: text;\n"], ["\n  min-width: 250px;\n  background-color: #55b88d;\n  min-height: 75px;\n  position: relative;\n  bottom: 85px;\n  right: 20px;\n  padding: 10px;\n  z-index: 5000;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  cursor: text;\n"])));
var TitleText = styled_components_1.default.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"], ["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"])));
var SubTitle = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"], ["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"])));
var Pointer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #55b88d;\n  position: relative;\n  bottom: 85px;\n  right: -5px;\n"], ["\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-top: 10px solid #55b88d;\n  position: relative;\n  bottom: 85px;\n  right: -5px;\n"])));
var ContactInfo = styled_components_1.default.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"], ["\n  color: white;\n  font-size: 14px;\n  margin: 0;\n"])));
var FacilityInfoCard = /** @class */ (function (_super) {
    __extends(FacilityInfoCard, _super);
    function FacilityInfoCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.truncateString = function (str, n, useWordBoundary) {
            if (str.length <= n) {
                return str;
            }
            var shortStr = str.substr(0, n);
            return ((useWordBoundary
                ? shortStr.substr(0, shortStr.lastIndexOf(' '))
                : shortStr) + '...');
        };
        return _this;
    }
    FacilityInfoCard.prototype.render = function () {
        var _a = this.props, name = _a.name, address = _a.address, hover = _a.hover;
        return (React.createElement("div", null,
            React.createElement(CardContainer, { style: hover ? { visibility: 'visible' } : { visibility: 'hidden' } },
                React.createElement(TitleText, null, this.truncateString(name, 60, true)),
                React.createElement(SubTitle, null, address)),
            React.createElement(Pointer, { style: hover ? { visibility: 'visible' } : { visibility: 'hidden' } })));
    };
    return FacilityInfoCard;
}(React.PureComponent));
exports.default = FacilityInfoCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;


/***/ }),

/***/ "./app/containers/FacilitiesPage/MapMarker.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var FacilityInfoCard_1 = __webpack_require__("./app/containers/FacilitiesPage/FacilityInfoCard.tsx");
var K_CIRCLE_SIZE = 30;
var K_STICK_SIZE = 10;
var K_STICK_WIDTH = 3;
var MarkerContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  width: ", "px;\n  height: calc(", "px + ", "px);\n  left: calc((", "px / 2) * -1);\n  top: calc((", "px + ", "px) * -1);\n"], ["\n  position: absolute;\n  width: ", "px;\n  height: calc(", "px + ", "px);\n  left: calc((", "px / 2) * -1);\n  top: calc((", "px + ", "px) * -1);\n"])), K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_STICK_SIZE, K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_STICK_SIZE);
var MarkerCircle = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #324870;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #55b88d;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"], ["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #324870;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #55b88d;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"])), K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_CIRCLE_SIZE);
var WarningCircle = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #ffcc00;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #f6a202;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"], ["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #ffcc00;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #f6a202;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"])), K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_CIRCLE_SIZE);
var HoverCircle = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #55b88d;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #324870;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"], ["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #55b88d;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #324870;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"])), K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_CIRCLE_SIZE);
var WarningHoverCircle = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #f6a202;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #ffcc00;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"], ["\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: ", "px;\n  height: ", "px;\n  border: 3px solid #f6a202;\n  border-radius: ", "px;\n  background-color: white;\n  text-align: center;\n  color: #ffcc00;\n  font-size: 21px;\n  font-weight: bold;\n  padding: 0;\n  cursor: pointer;\n  box-shadow: 0 0 0 1px white;\n"])), K_CIRCLE_SIZE, K_CIRCLE_SIZE, K_CIRCLE_SIZE);
var MarkerStick = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #324870;\n"], ["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #324870;\n"])), K_CIRCLE_SIZE, K_STICK_WIDTH, K_CIRCLE_SIZE, K_STICK_WIDTH, K_STICK_SIZE);
var HoverStick = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #55b88d;\n"], ["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #55b88d;\n"])), K_CIRCLE_SIZE, K_STICK_WIDTH, K_CIRCLE_SIZE, K_STICK_WIDTH, K_STICK_SIZE);
var WarningStick = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #ffcc00;\n"], ["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #ffcc00;\n"])), K_CIRCLE_SIZE, K_STICK_WIDTH, K_CIRCLE_SIZE, K_STICK_WIDTH, K_STICK_SIZE);
var WarningHoverStick = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #f6a202;\n"], ["\n  position: absolute;\n  left: calc(", "px / 2 - ", "px / 2);\n  top: ", "px;\n  width: ", "px;\n  height: ", "px;\n  background-color: #f6a202;\n"])), K_CIRCLE_SIZE, K_STICK_WIDTH, K_CIRCLE_SIZE, K_STICK_WIDTH, K_STICK_SIZE);
var MapMarker = /** @class */ (function (_super) {
    __extends(MapMarker, _super);
    function MapMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            clicked: false,
        };
        _this.markerClicked = function () {
            _this.setState({
                clicked: !_this.state.clicked,
            });
        };
        return _this;
    }
    MapMarker.prototype.render = function () {
        var _this = this;
        if (this.props.geoStatus === 'good') {
            return (React.createElement(MarkerContainer, { onClick: function () { return _this.markerClicked(); } },
                this.props.$hover || this.state.clicked ? (React.createElement("div", null,
                    React.createElement(HoverCircle, { onClick: this.props.onClick }, this.props.text),
                    React.createElement(HoverStick, null))) : (React.createElement("div", null,
                    React.createElement(MarkerCircle, { onClick: this.props.onClick }, this.props.text),
                    React.createElement(MarkerStick, null))),
                this.state.clicked ? (React.createElement(FacilityInfoCard_1.default, { hover: true, address: this.props.address, name: this.props.name, contacts: this.props.contacts, clicked: this.state.clicked })) : (React.createElement(FacilityInfoCard_1.default, { hover: this.props.$hover, address: this.props.address, name: this.props.name, contacts: this.props.contacts, clicked: this.state.clicked }))));
        }
        if (this.props.geoStatus === 'zip') {
            return (React.createElement(MarkerContainer, { onClick: function () { return _this.markerClicked(); } },
                this.props.$hover || this.state.clicked ? (React.createElement("div", null,
                    React.createElement(WarningHoverCircle, { onClick: this.props.onClick }, this.props.text),
                    React.createElement(WarningHoverStick, null))) : (React.createElement("div", null,
                    React.createElement(WarningCircle, { onClick: this.props.onClick }, this.props.text),
                    React.createElement(WarningStick, null))),
                this.state.clicked ? (React.createElement(FacilityInfoCard_1.default, { hover: true, address: this.props.address, name: this.props.name, contacts: this.props.contacts, clicked: this.state.clicked })) : (React.createElement(FacilityInfoCard_1.default, { hover: this.props.$hover, address: this.props.address, name: this.props.name, contacts: this.props.contacts, clicked: this.state.clicked }))));
        }
    };
    return MapMarker;
}(React.PureComponent));
exports.default = MapMarker;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;


/***/ }),

/***/ "./app/containers/FacilitiesPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FacilitiesPage_1 = __webpack_require__("./app/containers/FacilitiesPage/FacilitiesPage.tsx");
exports.default = FacilitiesPage_1.default;


/***/ }),

/***/ "./app/containers/GenericStudySectionPage/GenericStudySectionPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GenericStudySectionPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n"], ["\n  query GenericStudySectionPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n"])), StudySummary_1.default.fragment);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var GenericStudySectionPage = /** @class */ (function (_super) {
    __extends(GenericStudySectionPage, _super);
    function GenericStudySectionPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderItem = function (key, value) {
            var name = ramda_1.pipe(helpers_1.snakeCase, ramda_1.split('_'), ramda_1.map(helpers_1.capitalize), ramda_1.join(' '))(key);
            // the value has line breaks inserted at a specific distance
            // paragraph splits have multiple line breaks
            // this recombines each sentence and wraps paragraphs in <p>
            var text = ramda_1.pipe(function (value) { return value.toString(); }, ramda_1.split(/\n{2,}/), function (arr) {
                return arr.map(function (paragraph, i) { return (React.createElement("p", { key: i, style: { margin: '.5em 0' } }, paragraph)); });
            })(value || '');
            return (React.createElement("tr", { key: key },
                React.createElement("td", { style: { width: '30%', verticalAlign: 'middle' } },
                    React.createElement("b", null, name)),
                React.createElement("td", null, text)));
        };
        return _this;
    }
    GenericStudySectionPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.study) {
                return null;
            }
            var fields = siteViewHelpers_1.displayFields(_this.props.metaData.selected.kind, _this.props.metaData.selected.values, _this.props.metaData.fields.map(function (name) { return ({ name: name, rank: null }); }), true).map(ramda_1.prop('name'));
            _this.props.onLoaded && _this.props.onLoaded();
            return (React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                React.createElement("tbody", null, fields.map(function (field) {
                    return _this.renderItem(field, data.study[field]);
                }))));
        }));
    };
    return GenericStudySectionPage;
}(React.PureComponent));
exports.default = GenericStudySectionPage;
var templateObject_1;


/***/ }),

/***/ "./app/containers/GenericStudySectionPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GenericStudySectionPage_1 = __webpack_require__("./app/containers/GenericStudySectionPage/GenericStudySectionPage.tsx");
exports.default = GenericStudySectionPage_1.default;


/***/ }),

/***/ "./app/containers/InterventionPage/InterventionPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var Intervention_1 = __webpack_require__("./app/components/Intervention/index.ts");
var index_1 = __webpack_require__("./app/containers/SearchPage/index.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query InterventionPageQuery($id: Int!) {\n    intervention(id: $id) {\n      ...InterventionFragment\n    }\n  }\n\n  ", "\n"], ["\n  query InterventionPageQuery($id: Int!) {\n    intervention(id: $id) {\n      ...InterventionFragment\n    }\n  }\n\n  ", "\n"])), Intervention_1.default.fragment);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var InterventionPage = /** @class */ (function (_super) {
    __extends(InterventionPage, _super);
    function InterventionPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getInterventionsId = function () {
            return ramda_1.pipe(ramda_1.path(['match', 'params', 'id']), function (x) {
                return x ? parseInt(x, 10) : null;
            })(_this.props);
        };
        _this.setInterventionTerm = function (name) {
            var searchQuery = {
                a: [
                    {
                        field: 'interventions_mesh_terms',
                        values: [name],
                    },
                ],
            };
        };
        return _this;
    }
    InterventionPage.prototype.render = function () {
        var _this = this;
        var id = this.getInterventionsId();
        if (ramda_1.isNil(id))
            return null;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { id: id } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.intervention)
                return null;
            var searchParams = {
                q: { key: '*' },
                sorts: [],
                aggFilters: [
                    {
                        field: 'interventions_mesh_terms',
                        values: [data.intervention.name],
                    },
                ],
                crowdAggFilters: [],
                page: 0,
                pageSize: 25,
            };
            return (React.createElement(InteventionContainer, null,
                React.createElement(Intervention_1.default, { intervention: data.intervention }),
                React.createElement(index_1.default, { match: _this.props.match, history: _this.props.history, ignoreUrlHash: true, searchParams: searchParams })));
        }));
    };
    return InterventionPage;
}(React.PureComponent));
var InteventionContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
exports.default = InterventionPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/InterventionPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/InterventionPage/InterventionPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/InterventionsPage/InterventionItem.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var TrWithPointer = styled_components_1.default.tr(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  cursor: pointer;\n"], ["\n  cursor: pointer;\n"])));
var Tr = styled_components_1.default.tr(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var InterventionItem = /** @class */ (function (_super) {
    __extends(InterventionItem, _super);
    function InterventionItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function () {
            _this.props.onClick && _this.props.onClick(_this.props.interventionItem.id);
        };
        return _this;
    }
    InterventionItem.prototype.render = function () {
        if (!this.props.interventionItem)
            return null;
        var Wrapper = this.props.onClick ? TrWithPointer : Tr;
        return (React.createElement(Wrapper, { onClick: this.handleClick },
            this.props.fields.includes('name') && (React.createElement("td", null, this.props.interventionItem.name || 'No name provided')),
            this.props.fields.includes('type') && (React.createElement("td", null, this.props.interventionItem.type || 'No type provided')),
            this.props.fields.includes('description') && (React.createElement("td", null, this.props.interventionItem.description ||
                'No description provided'))));
    };
    InterventionItem.fragment = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    fragment InterventionItemFragment on Intervention {\n      id\n      description\n      name\n      type\n    }\n  "], ["\n    fragment InterventionItemFragment on Intervention {\n      id\n      description\n      name\n      type\n    }\n  "])));
    return InterventionItem;
}(React.PureComponent));
exports.default = InterventionItem;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/containers/InterventionsPage/InterventionsPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var InterventionItem_1 = __webpack_require__("./app/containers/InterventionsPage/InterventionItem.tsx");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query InterventionsPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      interventions {\n        ...InterventionItemFragment\n      }\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query InterventionsPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      interventions {\n        ...InterventionItemFragment\n      }\n    }\n  }\n\n  ", "\n  ", "\n"])), InterventionItem_1.default.fragment, StudySummary_1.default.fragment);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var InterventionsPage = /** @class */ (function (_super) {
    __extends(InterventionsPage, _super);
    function InterventionsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleItemClick = function (id) {
            _this.props.history.push("/intervention/" + id);
        };
        return _this;
    }
    InterventionsPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.match.params.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.study)
                return null;
            _this.props.onLoaded && _this.props.onLoaded();
            var fields = siteViewHelpers_1.displayFields(_this.props.metaData.selected.kind, _this.props.metaData.selected.values, _this.props.metaData.fields.map(function (name) { return ({ name: name, rank: null }); })).map(ramda_1.prop('name'));
            return (React.createElement("div", null,
                React.createElement(react_bootstrap_1.Table, { striped: true },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            fields.includes('name') && (React.createElement("th", { style: { width: '25%' } }, "Name")),
                            fields.includes('type') && (React.createElement("th", { style: { width: '25%' } }, "Kind")),
                            fields.includes('description') && (React.createElement("th", { style: { width: '50%' } }, "Description")))),
                    React.createElement("tbody", null, data.study.interventions.map(function (intervention) { return (React.createElement(InterventionItem_1.default, { fields: fields, key: intervention.id, interventionItem: intervention, onClick: _this.handleItemClick })); })))));
        }));
    };
    InterventionsPage.fragment = InterventionItem_1.default.fragment;
    return InterventionsPage;
}(React.PureComponent));
exports.default = InterventionsPage;
var templateObject_1;


/***/ }),

/***/ "./app/containers/InterventionsPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InterventionsPage_1 = __webpack_require__("./app/containers/InterventionsPage/InterventionsPage.tsx");
exports.default = InterventionsPage_1.default;


/***/ }),

/***/ "./app/containers/LandingPage/LandingPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var Heading_1 = __webpack_require__("./app/components/Heading/index.ts");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var MainContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 50px;\n  padding-bottom: 00px;\n  .center {\n    text-align: center;\n  }\n  #query {\n    box-shadow: 0px 2px 25px rgba(0, 0, 0, 0.25);\n    border: none;\n    font-size: 12pt;\n    max-width: 120em;\n  }\n"], ["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 50px;\n  padding-bottom: 00px;\n  .center {\n    text-align: center;\n  }\n  #query {\n    box-shadow: 0px 2px 25px rgba(0, 0, 0, 0.25);\n    border: none;\n    font-size: 12pt;\n    max-width: 120em;\n  }\n"])));
var HASH_QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query LandingSearchPageHashQuery($q: SearchQueryInput!) {\n    searchHash(params: { q: $q, page: 0, pageSize: 25 })\n  }\n"], ["\n  query LandingSearchPageHashQuery($q: SearchQueryInput!) {\n    searchHash(params: { q: $q, page: 0, pageSize: 25 })\n  }\n"])));
var LandingPage = /** @class */ (function (_super) {
    __extends(LandingPage, _super);
    function LandingPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            searchTerm: '',
        };
        _this.onSubmit = function (e, client) { return __awaiter(_this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        params = {};
                        if (this.state.searchTerm.replace(/\s/g, '').length) {
                            params = {
                                q: { key: 'AND', children: [{ key: this.state.searchTerm }] },
                            };
                        }
                        else {
                            params = { q: { key: 'AND', children: [] } };
                        }
                        return [4 /*yield*/, client.query({ query: HASH_QUERY, variables: params })];
                    case 1:
                        data = (_a.sent()).data;
                        this.props.history.push("/search/default/" + data.searchHash);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.searchChanged = function (e) {
            _this.setState({ searchTerm: e.target.value });
        };
        _this.renderMain = function (client) { return (React.createElement(MainContainer, null,
            React.createElement(Heading_1.default, null, " "),
            React.createElement("div", { className: "container" },
                React.createElement(react_bootstrap_1.Row, { className: "justify-content-md-center" },
                    React.createElement(react_bootstrap_1.Col, { md: 3 }),
                    React.createElement(react_bootstrap_1.Col, { md: 6 },
                        React.createElement(react_bootstrap_1.Form, { className: "center", onSubmit: function (e) { return _this.onSubmit(e, client); } },
                            React.createElement(react_bootstrap_1.FormControl, { id: "query", onChange: _this.searchChanged, placeholder: "Enter a Search: ex) 'Glioblastoma or Musella Foundation'" }))))))); };
        return _this;
    }
    LandingPage.prototype.render = function () {
        var _this = this;
        return React.createElement(react_apollo_1.ApolloConsumer, null, function (client) { return _this.renderMain(client); });
    };
    return LandingPage;
}(React.PureComponent));
exports.default = LandingPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/LandingPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/LandingPage/LandingPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/LanguageProvider/LanguageProvider.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
var LanguageProvider = /** @class */ (function (_super) {
    __extends(LanguageProvider, _super);
    function LanguageProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LanguageProvider.prototype.render = function () {
        return (React.createElement(react_intl_1.IntlProvider, { locale: this.props.locale, key: this.props.locale, messages: this.props.messages[this.props.locale] }, React.Children.only(this.props.children)));
    };
    return LanguageProvider;
}(React.PureComponent));
exports.LanguageProvider = LanguageProvider;
exports.default = LanguageProvider;


/***/ }),

/***/ "./app/containers/LanguageProvider/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LanguageProvider_1 = __webpack_require__("./app/containers/LanguageProvider/LanguageProvider.tsx");
exports.default = LanguageProvider_1.default;


/***/ }),

/***/ "./app/containers/LoginPage/EditProfilePage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StyledFormControl_1 = __webpack_require__("./app/containers/LoginPage/StyledFormControl.tsx");
var StyledContainer_1 = __webpack_require__("./app/containers/LoginPage/StyledContainer.tsx");
var StyledButton_1 = __webpack_require__("./app/containers/LoginPage/StyledButton.tsx");
var StyledError_1 = __webpack_require__("./app/containers/LoginPage/StyledError.tsx");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var StyledWrapper_1 = __webpack_require__("./app/containers/LoginPage/StyledWrapper.tsx");
var EDIT_PROFILE_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation EditProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      errors\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"], ["\n  mutation EditProfileMutation($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      errors\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"])), CurrentUser_1.default.fragment);
var EditProfileMutationComponent = /** @class */ (function (_super) {
    __extends(EditProfileMutationComponent, _super);
    function EditProfileMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EditProfileMutationComponent;
}(react_apollo_1.Mutation));
var EditProfilePage = /** @class */ (function (_super) {
    __extends(EditProfilePage, _super);
    function EditProfilePage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                firstName: null,
                lastName: null,
                defaultQueryString: null,
            },
            prevUser: null,
            errors: [],
        };
        _this.handleInputChange = function (e) {
            var _a;
            _this.setState({
                form: __assign(__assign({}, _this.state.form), (_a = {}, _a[e.target.name] = e.target.value, _a)),
            });
        };
        _this.handleEditProfile = function (editProfile) { return function () {
            editProfile({ variables: { input: _this.state.form } });
        }; };
        _this.renderErrors = function () {
            return (React.createElement("div", { style: { marginTop: 20 } }, _this.state.errors.map(function (error) { return (React.createElement(StyledError_1.default, { key: error }, error)); })));
        };
        return _this;
    }
    EditProfilePage.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyledWrapper_1.default, null,
            React.createElement(react_bootstrap_1.Col, { md: 12 },
                React.createElement(StyledContainer_1.default, null,
                    React.createElement(StyledFormControl_1.default, { name: "firstName", placeholder: "First name", value: this.state.form.firstName, onChange: this.handleInputChange }),
                    React.createElement(StyledFormControl_1.default, { name: "lastName", placeholder: "Last name", value: this.state.form.lastName, onChange: this.handleInputChange }),
                    React.createElement(StyledFormControl_1.default, { name: "defaultQueryString", placeholder: "Default query string", value: this.state.form.defaultQueryString, onChange: this.handleInputChange }),
                    React.createElement(EditProfileMutationComponent, { mutation: EDIT_PROFILE_MUTATION, update: function (cache, _a) {
                            var data = _a.data;
                            var user = data && data.updateProfile && data.updateProfile.user;
                            if (user) {
                                cache.writeQuery({
                                    query: CurrentUser_1.default.query,
                                    data: {
                                        me: user,
                                    },
                                });
                                return;
                            }
                            _this.setState({
                                errors: (data && data.updateProfile && data.updateProfile.errors) ||
                                    [],
                            });
                        } }, function (editProfile) { return (React.createElement(StyledButton_1.default, { onClick: _this.handleEditProfile(editProfile) }, "Save")); }),
                    this.renderErrors()))));
    };
    EditProfilePage.getDerivedStateFromProps = function (props, state) {
        if (!ramda_1.equals(state.prevUser, props.user) && props.user != null) {
            return __assign(__assign({}, state), { form: __assign(__assign({}, state.form), ramda_1.pick(['firstName', 'lastName', 'defaultQueryString'], props.user)), prevUser: props.user });
        }
        return null;
    };
    return EditProfilePage;
}(React.Component));
var CurrentUserWrapper = function (props) { return (React.createElement(CurrentUser_1.default, null, function (user) { return React.createElement(EditProfilePage, __assign({}, props, { user: user })); })); };
exports.default = CurrentUserWrapper;
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/ResetPasswordPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StyledFormControl_1 = __webpack_require__("./app/containers/LoginPage/StyledFormControl.tsx");
var StyledContainer_1 = __webpack_require__("./app/containers/LoginPage/StyledContainer.tsx");
var StyledButton_1 = __webpack_require__("./app/containers/LoginPage/StyledButton.tsx");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var StyledError_1 = __webpack_require__("./app/containers/LoginPage/StyledError.tsx");
var StyledWrapper_1 = __webpack_require__("./app/containers/LoginPage/StyledWrapper.tsx");
var RESET_PASSWORD_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation ResetPasswordMutation($input: ResetPasswordInput!) {\n    resetPassword(input: $input) {\n      success\n    }\n  }\n"], ["\n  mutation ResetPasswordMutation($input: ResetPasswordInput!) {\n    resetPassword(input: $input) {\n      success\n    }\n  }\n"])));
var ResetPasswordMutationComponent = /** @class */ (function (_super) {
    __extends(ResetPasswordMutationComponent, _super);
    function ResetPasswordMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResetPasswordMutationComponent;
}(react_apollo_1.Mutation));
var LinkContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"], ["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"])));
var ResetPasswordPage = /** @class */ (function (_super) {
    __extends(ResetPasswordPage, _super);
    function ResetPasswordPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                email: '',
            },
            errors: [],
        };
        _this.handleInputChange = function (e) {
            var _a;
            _this.setState({
                form: __assign(__assign({}, _this.state.form), (_a = {}, _a[e.target.name] = e.target.value, _a)),
            });
        };
        _this.handleResetPassword = function (resetPassword) { return function () {
            resetPassword({ variables: { input: _this.state.form } }).then(function () {
                return _this.setState({
                    errors: ['Password reset instructions have been sent to your email.'],
                });
            });
        }; };
        _this.renderErrors = function () {
            return (React.createElement("div", { style: { marginTop: 20 } }, _this.state.errors.map(function (error) { return (React.createElement(StyledError_1.default, { key: error }, error)); })));
        };
        return _this;
    }
    ResetPasswordPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyledWrapper_1.default, null,
            React.createElement(react_bootstrap_1.Col, { md: 12 },
                React.createElement(StyledContainer_1.default, null,
                    React.createElement(StyledFormControl_1.default, { name: "email", type: "email", placeholder: "Email", value: this.state.form.email, onChange: this.handleInputChange }),
                    React.createElement(ResetPasswordMutationComponent, { mutation: RESET_PASSWORD_MUTATION, update: function (cache, _a) {
                            var data = _a.data;
                            if (data && data.resetPassword && data.resetPassword.success) {
                                _this.setState({
                                    errors: ['Instructions have been sent to your email'],
                                });
                            }
                        } }, function (resetPassword) { return (React.createElement(StyledButton_1.default, { onClick: _this.handleResetPassword(resetPassword) }, "Send Instructions")); }),
                    this.renderErrors(),
                    React.createElement(LinkContainer, null,
                        React.createElement(react_router_dom_1.Link, { to: "/sign_in" }, "Sign in"),
                        React.createElement(react_router_dom_1.Link, { to: "/sign_up" }, "Sign up"))))));
    };
    return ResetPasswordPage;
}(React.Component));
exports.default = ResetPasswordPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/LoginPage/SignInPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StyledFormControl_1 = __webpack_require__("./app/containers/LoginPage/StyledFormControl.tsx");
var StyledContainer_1 = __webpack_require__("./app/containers/LoginPage/StyledContainer.tsx");
var StyledButton_1 = __webpack_require__("./app/containers/LoginPage/StyledButton.tsx");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var localStorage_1 = __webpack_require__("./app/utils/localStorage.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var StyledError_1 = __webpack_require__("./app/containers/LoginPage/StyledError.tsx");
var StyledWrapper_1 = __webpack_require__("./app/containers/LoginPage/StyledWrapper.tsx");
var SIGN_IN_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation SignInMutation($input: SignInInput!) {\n    signIn(input: $input) {\n      jwt\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"], ["\n  mutation SignInMutation($input: SignInInput!) {\n    signIn(input: $input) {\n      jwt\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"])), CurrentUser_1.default.fragment);
var SignInMutationComponent = /** @class */ (function (_super) {
    __extends(SignInMutationComponent, _super);
    function SignInMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SignInMutationComponent;
}(react_apollo_1.Mutation));
var LinkContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"], ["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"])));
var SignInPage = /** @class */ (function (_super) {
    __extends(SignInPage, _super);
    function SignInPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                email: '',
                password: '',
            },
            errors: [],
        };
        _this.handleInputChange = function (e) {
            var _a;
            _this.setState({
                form: __assign(__assign({}, _this.state.form), (_a = {}, _a[e.target.name] = e.target.value, _a)),
            });
        };
        _this.handleSignIn = function (signIn) { return function () {
            signIn({ variables: { input: _this.state.form } });
        }; };
        _this.handleSignInCompleted = function (data) {
            var jwt = data && data.signIn && data.signIn.jwt;
            if (!jwt)
                return;
            localStorage_1.setLocalJwt(jwt);
            _this.props.history.push('/');
        };
        _this.renderErrors = function () {
            return (React.createElement("div", { style: { marginTop: 20 } }, _this.state.errors.map(function (error) { return (React.createElement(StyledError_1.default, { key: error }, error)); })));
        };
        return _this;
    }
    SignInPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyledWrapper_1.default, null,
            React.createElement(react_bootstrap_1.Col, { md: 12 },
                React.createElement(StyledContainer_1.default, null,
                    React.createElement(StyledFormControl_1.default, { name: "email", type: "email", placeholder: "Email", value: this.state.form.email, onChange: this.handleInputChange }),
                    React.createElement(StyledFormControl_1.default, { name: "password", type: "password", placeholder: "Password", value: this.state.form.password, onChange: this.handleInputChange }),
                    React.createElement(SignInMutationComponent, { mutation: SIGN_IN_MUTATION, onCompleted: this.handleSignInCompleted, update: function (cache, _a) {
                            var data = _a.data;
                            var user = data && data.signIn && data.signIn.user;
                            if (user) {
                                cache.writeQuery({
                                    query: CurrentUser_1.default.query,
                                    data: {
                                        me: user,
                                    },
                                });
                                return;
                            }
                            _this.setState({ errors: ['Invalid email or password'] });
                        } }, function (signIn) { return (React.createElement(StyledButton_1.default, { onClick: _this.handleSignIn(signIn) }, "Sign In")); }),
                    this.renderErrors(),
                    React.createElement(LinkContainer, null,
                        React.createElement(react_router_dom_1.Link, { to: "/sign_up" }, "Sign up"),
                        React.createElement(react_router_dom_1.Link, { to: "/reset_password" }, "Reset password"))))));
    };
    return SignInPage;
}(React.Component));
exports.default = SignInPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/LoginPage/SignUpPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StyledFormControl_1 = __webpack_require__("./app/containers/LoginPage/StyledFormControl.tsx");
var StyledContainer_1 = __webpack_require__("./app/containers/LoginPage/StyledContainer.tsx");
var StyledButton_1 = __webpack_require__("./app/containers/LoginPage/StyledButton.tsx");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var localStorage_1 = __webpack_require__("./app/utils/localStorage.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var StyledError_1 = __webpack_require__("./app/containers/LoginPage/StyledError.tsx");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var StyledWrapper_1 = __webpack_require__("./app/containers/LoginPage/StyledWrapper.tsx");
var SIGN_UP_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation SignUpMutation($input: SignUpInput!) {\n    signUp(input: $input) {\n      jwt\n      errors\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"], ["\n  mutation SignUpMutation($input: SignUpInput!) {\n    signUp(input: $input) {\n      jwt\n      errors\n      user {\n        ...UserFragment\n      }\n    }\n  }\n\n  ", "\n"])), CurrentUser_1.default.fragment);
var SignUpMutationComponent = /** @class */ (function (_super) {
    __extends(SignUpMutationComponent, _super);
    function SignUpMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SignUpMutationComponent;
}(react_apollo_1.Mutation));
var LinkContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"], ["\n  position: absolute;\n  bottom: 30px;\n  a {\n    color: white;\n    margin-right: 15px;\n  }\n"])));
var SignUpPage = /** @class */ (function (_super) {
    __extends(SignUpPage, _super);
    function SignUpPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            form: {
                email: '',
                password: '',
                passwordConfirmation: '',
            },
            errors: [],
        };
        _this.handleInputChange = function (e) {
            var _a;
            _this.setState({
                form: __assign(__assign({}, _this.state.form), (_a = {}, _a[e.target.name] = e.target.value, _a)),
            });
        };
        _this.handleSignUp = function (signUp) { return function () {
            if (_this.state.form.password === _this.state.form.passwordConfirmation) {
                var input = ramda_1.omit(['passwordConfirmation'], _this.state.form);
                signUp({ variables: { input: input } });
            }
            _this.setState({ errors: ["Password confirmation doesn't match"] });
        }; };
        _this.handleSignUpCompleted = function (data) {
            var jwt = data && data.signUp && data.signUp.jwt;
            if (!jwt)
                return;
            localStorage_1.setLocalJwt(jwt);
            _this.props.history.push('/');
        };
        _this.renderErrors = function () {
            return (React.createElement("div", { style: { marginTop: 20 } }, _this.state.errors.map(function (error) { return (React.createElement(StyledError_1.default, { key: error }, error)); })));
        };
        return _this;
    }
    SignUpPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyledWrapper_1.default, null,
            React.createElement(react_bootstrap_1.Col, { md: 12 },
                React.createElement(StyledContainer_1.default, null,
                    React.createElement(StyledFormControl_1.default, { name: "email", type: "email", placeholder: "Email", value: this.state.form.email, onChange: this.handleInputChange }),
                    React.createElement(StyledFormControl_1.default, { name: "password", type: "password", placeholder: "Password", value: this.state.form.password, onChange: this.handleInputChange }),
                    React.createElement(StyledFormControl_1.default, { name: "passwordConfirmation", type: "password", placeholder: "Password confirmation", value: this.state.form.passwordConfirmation, onChange: this.handleInputChange }),
                    React.createElement(SignUpMutationComponent, { mutation: SIGN_UP_MUTATION, onCompleted: this.handleSignUpCompleted, update: function (cache, _a) {
                            var data = _a.data;
                            var user = data && data.signUp && data.signUp.user;
                            if (user) {
                                cache.writeQuery({
                                    query: CurrentUser_1.default.query,
                                    data: {
                                        me: user,
                                    },
                                });
                                return;
                            }
                            _this.setState({
                                errors: (data && data.signUp && data.signUp.errors) || [],
                            });
                        } }, function (signUp) { return (React.createElement(StyledButton_1.default, { onClick: _this.handleSignUp(signUp) }, "Sign Up")); }),
                    this.renderErrors(),
                    React.createElement(LinkContainer, null,
                        React.createElement(react_router_dom_1.Link, { to: "/sign_in" }, "Sign In"),
                        React.createElement(react_router_dom_1.Link, { to: "/reset_password" }, "Reset password"))))));
    };
    return SignUpPage;
}(React.Component));
exports.default = SignUpPage;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/LoginPage/StyledButton.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
exports.default = styled_components_1.default(react_bootstrap_1.Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 10px 15px;\n"], ["\n  padding: 10px 15px;\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/StyledContainer.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var StyledWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  border: 0px none;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.1) none repeat scroll 0% 0%;\n  margin: 40px auto;\n  padding: 20px;\n  max-width: 500px;\n  width: 500px;\n  height: 450px;\n  perspective: 1000px;\n  color: rgb(255, 255, 255);\n\n  & > div {\n    width: 350px;\n  }\n"], ["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  border: 0px none;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.1) none repeat scroll 0% 0%;\n  margin: 40px auto;\n  padding: 20px;\n  max-width: 500px;\n  width: 500px;\n  height: 450px;\n  perspective: 1000px;\n  color: rgb(255, 255, 255);\n\n  & > div {\n    width: 350px;\n  }\n"])));
exports.default = (function (_a) {
    var children = _a.children;
    return (React.createElement(StyledWrapper, null,
        React.createElement("h1", null, "Clinwiki"),
        React.createElement("div", null, children)));
});
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/StyledError.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
exports.default = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: #ffa5a5;\n"], ["\n  color: #ffa5a5;\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/StyledFormControl.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
exports.default = styled_components_1.default(react_bootstrap_1.FormControl)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  border-radius: 4px;\n  padding: 10px 15px;\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  margin: 15px 0 15px 0;\n  height: 40px;\n  box-shadow: none !important;\n  color: white;\n\n  &::placeholder {\n    color: rgba(255, 255, 255, 0.6);\n    opacity: 1;\n  }\n"], ["\n  background: rgba(255, 255, 255, 0.2);\n  border: none;\n  border-radius: 4px;\n  padding: 10px 15px;\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  margin: 15px 0 15px 0;\n  height: 40px;\n  box-shadow: none !important;\n  color: white;\n\n  &::placeholder {\n    color: rgba(255, 255, 255, 0.6);\n    opacity: 1;\n  }\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/StyledWrapper.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
exports.default = styled_components_1.default(react_bootstrap_1.Row)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-height: 100vh;\n"], ["\n  min-height: 100vh;\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/containers/LoginPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SignInPage_1 = __webpack_require__("./app/containers/LoginPage/SignInPage.tsx");
exports.SignInPage = SignInPage_1.default;
var SignUpPage_1 = __webpack_require__("./app/containers/LoginPage/SignUpPage.tsx");
exports.SignUpPage = SignUpPage_1.default;
var ResetPasswordPage_1 = __webpack_require__("./app/containers/LoginPage/ResetPasswordPage.tsx");
exports.ResetPasswordPage = ResetPasswordPage_1.default;
var EditProfilePage_1 = __webpack_require__("./app/containers/LoginPage/EditProfilePage.tsx");
exports.EditProfilePage = EditProfilePage_1.default;


/***/ }),

/***/ "./app/containers/NotConfiguredPage/NotConfiguredPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
var queryString = __webpack_require__("./node_modules/query-string/index.js");
var messages_1 = __webpack_require__("./app/containers/NotConfiguredPage/messages.ts");
var NotConfiguredPage = /** @class */ (function (_super) {
    __extends(NotConfiguredPage, _super);
    function NotConfiguredPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotConfiguredPage.prototype.render = function () {
        var subdomain = queryString.parse(this.props.location.search).subdomain;
        return (React.createElement("h1", null,
            React.createElement(react_intl_1.FormattedMessage, __assign({}, messages_1.default.header, { values: { subdomain: subdomain } }))));
    };
    return NotConfiguredPage;
}(React.PureComponent));
exports.default = NotConfiguredPage;


/***/ }),

/***/ "./app/containers/NotConfiguredPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NotConfiguredPage_1 = __webpack_require__("./app/containers/NotConfiguredPage/NotConfiguredPage.tsx");
exports.default = NotConfiguredPage_1.default;


/***/ }),

/***/ "./app/containers/NotConfiguredPage/messages.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
exports.default = react_intl_1.defineMessages({
    header: {
        id: 'app.components.NotFoundPage.header',
        message: ' TEST',
        defaultMessage: 'The subdomain "{subdomain}" is not configured!',
    },
});


/***/ }),

/***/ "./app/containers/NotFoundPage/NotFoundPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
var messages_1 = __webpack_require__("./app/containers/NotFoundPage/messages.ts");
var NotFound = /** @class */ (function (_super) {
    __extends(NotFound, _super);
    function NotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotFound.prototype.render = function () {
        return (React.createElement("h1", null,
            React.createElement(react_intl_1.FormattedMessage, __assign({}, messages_1.default.header))));
    };
    return NotFound;
}(React.PureComponent));
exports.default = NotFound;


/***/ }),

/***/ "./app/containers/NotFoundPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NotFoundPage_1 = __webpack_require__("./app/containers/NotFoundPage/NotFoundPage.tsx");
exports.default = NotFoundPage_1.default;


/***/ }),

/***/ "./app/containers/NotFoundPage/messages.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
exports.default = react_intl_1.defineMessages({
    header: {
        id: 'app.components.NotFoundPage.header',
        defaultMessage: 'The page you requested could not be found',
    },
});


/***/ }),

/***/ "./app/containers/ReleaseNotes/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var version_1 = __webpack_require__("./app/containers/ReleaseNotes/version.tsx");
exports.default = version_1.default;


/***/ }),

/***/ "./app/containers/ReleaseNotes/version.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_rte_yt_1 = __webpack_require__("./node_modules/react-rte-yt/dist/react-rte.js");
var notes = react_rte_yt_1.default.createValueFromString("\n\n# ClinWiki Version History\n\n### Version 11\n- Bugfixes\n- #156 missing facets\n\n### Version 10\n- #156 - visible crowd aggs\n- Select all in facets\n- loading for autocomplete\n- Interventions page\n- Fix crowd aggs in type ahead\n\n### Version 9\n- Facility maps\n- Upgraded to typescript 3.7\n\n### Version 8\n- Type ahead search based on facet values [#207](https://github.com/clinwiki-org/clinwiki/issues/207)\n- Link autosuggest to site config [#223](https://github.com/clinwiki-org/clinwiki/issues/223)\n\n### Version 7\n- Fix [#222](https://github.com/clinwiki-org/clinwiki/issues/222) - Study summary\n\n### Version 6\n- Merge Owera changes\n    - New \"Card View\" search result option\n    - New Mobile friendly study page\n\n### Version 5\n- Bugfix for mistyped subdomains\n- update puma minor version\n\n### Version 4\n- Github dependency upgrade bot\n\n### Version 3\n- Bulk edit feature\n- Handle returns in extra data of studies #173\n- Bugfix #189 unable to 'hide section' on study page configuration\n- Bugfix #164 crowd facets not filtering with selections properly\n- Feature ##171 Enable subsites config to start on search page\n- Reduce sidekick timer to 5 seconds\n- Fixed source maps\n- Bugfix #160 facet filter list for subsite/workflow not displaying all options\n- CTG: facet sorting\n\n### Version 2\n- Add /voyager to debug builds for exploring graphql schema\n- Add link to NCT ID to address issue #162 - thanks rarbuthnot\n\n### Version 1\n- Filter facet values in site config\n- Beta added to logo\n- Dynamic study sections\n- Country facet\n- Release notes added\n- Show record count on study page\n- First/Last buttons on study page\n\n### Version 0\n- Everything else\n", 'markdown');
var ReleaseNotes = /** @class */ (function (_super) {
    __extends(ReleaseNotes, _super);
    function ReleaseNotes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReleaseNotes.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(react_rte_yt_1.default, { readOnly: true, value: notes })));
    };
    return ReleaseNotes;
}(React.PureComponent));
exports.default = ReleaseNotes;


/***/ }),

/***/ "./app/containers/ReviewForm/ReviewForm.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var react_stars_1 = __webpack_require__("./node_modules/react-stars/dist/react-stars.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var react_rte_yt_1 = __webpack_require__("./node_modules/react-rte-yt/dist/react-rte.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var configureApollo_1 = __webpack_require__("./app/configureApollo.ts");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment ReviewFragment on Review {\n    id\n    meta\n    content\n    createdAt\n    user {\n      id\n      firstName\n      lastName\n      email\n    }\n  }\n"], ["\n  fragment ReviewFragment on Review {\n    id\n    meta\n    content\n    createdAt\n    user {\n      id\n      firstName\n      lastName\n      email\n    }\n  }\n"])));
var MUTATION = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation ReviewFormMutation(\n    $id: Int\n    $nctId: String!\n    $meta: String!\n    $content: String!\n  ) {\n    upsertReview(\n      input: { id: $id, nctId: $nctId, meta: $meta, content: $content }\n    ) {\n      review {\n        ...ReviewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation ReviewFormMutation(\n    $id: Int\n    $nctId: String!\n    $meta: String!\n    $content: String!\n  ) {\n    upsertReview(\n      input: { id: $id, nctId: $nctId, meta: $meta, content: $content }\n    ) {\n      review {\n        ...ReviewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), FRAGMENT);
var STUDY_FRAGMENT = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment ReviewFormStudyFragment on Study {\n    nctId\n    reviews {\n      ...ReviewFragment\n    }\n  }\n\n  ", "\n"], ["\n  fragment ReviewFormStudyFragment on Study {\n    nctId\n    reviews {\n      ...ReviewFragment\n    }\n  }\n\n  ", "\n"])), FRAGMENT);
var defaultState = {
    meta: { 'Overall Rating': 0, Safety: 0, Efficacy: 0 },
    newRating: '',
    content: react_rte_yt_1.default.createValueFromString('Write your review here!', 'markdown'),
    prevReview: null,
};
var MetaRow = styled_components_1.default(react_bootstrap_1.Row)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding-bottom: 10px;\n"], ["\n  padding-bottom: 10px;\n"])));
var AddRatingWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  padding-bottom: 10px;\n  button {\n    margin-left: 10px;\n  }\n"], ["\n  display: flex;\n  padding-bottom: 10px;\n  button {\n    margin-left: 10px;\n  }\n"])));
var ReviewFormMutationComponent = /** @class */ (function (_super) {
    __extends(ReviewFormMutationComponent, _super);
    function ReviewFormMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ReviewFormMutationComponent;
}(react_apollo_1.Mutation));
var ReviewForm = /** @class */ (function (_super) {
    __extends(ReviewForm, _super);
    function ReviewForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = defaultState;
        // Use this hook to trigger submit using ref from parent
        _this.submitReview = function () { };
        _this.handleRatingChange = function (key, value) {
            var lens = ramda_1.lensPath(['meta', key]);
            _this.setState(ramda_1.set(lens, value, _this.state));
        };
        _this.handleRatingDelete = function (key) {
            var newState = ramda_1.dissocPath(['meta', key], _this.state);
            _this.setState(newState);
        };
        _this.handleAddRatingChange = function (e) {
            _this.setState({ newRating: e.currentTarget.value });
        };
        _this.handleAddRating = function () {
            if (_this.state.newRating.replace(/\s/g, '').length) {
                var lens = ramda_1.lensPath(['meta', _this.state.newRating]);
                // @ts-ignore
                _this.setState(__assign(__assign({}, ramda_1.set(lens, 0, _this.state)), { newRating: '' }));
            }
        };
        _this.handleContentChange = function (value) {
            _this.setState({ content: value });
        };
        _this.handleSubmitReview = function (upsertReview) { return function () {
            var id = (_this.props.review && _this.props.review.id) || undefined;
            upsertReview({
                variables: {
                    id: id,
                    meta: JSON.stringify(_this.state.meta),
                    content: _this.state.content.toString('markdown'),
                    nctId: _this.props.nctId,
                },
            });
            _this.setState(defaultState);
        }; };
        _this.renderMeta = function () {
            if (_this.props.hideMeta)
                return null;
            return (React.createElement("div", null,
                ramda_1.keys(_this.state.meta).map(function (key) { return (React.createElement(MetaRow, { key: key },
                    React.createElement(react_bootstrap_1.Col, { md: 4 },
                        React.createElement("b", null, key)),
                    React.createElement(react_bootstrap_1.Col, { md: 6 },
                        React.createElement(react_stars_1.default, { count: 5, color2: constants_1.starColor, half: false, value: _this.state.meta[key], onChange: function (value) { return _this.handleRatingChange(key, value); } })),
                    React.createElement(react_bootstrap_1.Col, { md: 2, style: { textAlign: 'right' } }, key !== 'Overall Rating' && (React.createElement(react_bootstrap_1.Button, { bsSize: "xsmall", onClick: function () { return _this.handleRatingDelete(key); } },
                        React.createElement(FontAwesome, { name: "minus" })))))); }),
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Col, { md: 8 }),
                    React.createElement(react_bootstrap_1.Col, { md: 4 },
                        React.createElement(AddRatingWrapper, null,
                            React.createElement(react_bootstrap_1.FormControl, { type: "text", placeholder: "Your Rating", value: _this.state.newRating, onChange: _this.handleAddRatingChange }),
                            React.createElement(react_bootstrap_1.Button, { onClick: _this.handleAddRating }, "Add Rating"))))));
        };
        return _this;
    }
    ReviewForm.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            this.renderMeta(),
            React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Body, null,
                    React.createElement(react_rte_yt_1.default, { onChange: this.handleContentChange, value: this.state.content }),
                    React.createElement(ReviewFormMutationComponent, { mutation: MUTATION, update: function (cache, _a) {
                            var data = _a.data;
                            var review = data && data.upsertReview && data.upsertReview.review;
                            if (!review)
                                return;
                            var id = configureApollo_1.dataIdFromObject({
                                id: _this.props.nctId,
                                __typename: 'Study',
                            });
                            var study = cache.readFragment({
                                id: id,
                                fragment: STUDY_FRAGMENT,
                                fragmentName: 'ReviewFormStudyFragment',
                            });
                            var reviews = (study && study.reviews) || [];
                            var idx = ramda_1.findIndex(ramda_1.propEq('id', review.id), reviews);
                            var newStudy;
                            if (idx === -1) {
                                var reviewsLens = ramda_1.lensPath(['reviews']);
                                newStudy = ramda_1.over(reviewsLens, function (reviews) { return __spread([review], reviews); }, study);
                            }
                            else {
                                var reviewLens = ramda_1.lensPath(['reviews', idx]);
                                newStudy = ramda_1.set(reviewLens, review, study);
                            }
                            cache.writeFragment({
                                id: id,
                                fragment: STUDY_FRAGMENT,
                                fragmentName: 'ReviewFormStudyFragment',
                                data: newStudy,
                            });
                            _this.props.afterSave && _this.props.afterSave(review);
                        } }, function (upsertReview) {
                        _this.submitReview = _this.handleSubmitReview(upsertReview);
                        return (!_this.props.hideSaveButton && (React.createElement(react_bootstrap_1.Button, { style: { marginTop: 10 }, onClick: _this.handleSubmitReview(upsertReview) }, "Submit")));
                    })))));
    };
    ReviewForm.fragment = FRAGMENT;
    ReviewForm.getDerivedStateFromProps = function (props, state) {
        if (props.review != null && !ramda_1.equals(props.review, state.prevReview)) {
            var meta = defaultState.meta;
            try {
                meta = JSON.parse(props.review.meta);
            }
            catch (e) {
                console.error("Error parsing review meta: " + meta, e);
            }
            return __assign(__assign({}, state), { meta: meta, prevReview: props.review, content: react_rte_yt_1.default.createValueFromString(props.review.content, 'markdown') });
        }
        return null;
    };
    return ReviewForm;
}(React.Component));
exports.default = ReviewForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;


/***/ }),

/***/ "./app/containers/ReviewForm/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReviewForm_1 = __webpack_require__("./app/containers/ReviewForm/ReviewForm.tsx");
exports.default = ReviewForm_1.default;


/***/ }),

/***/ "./app/containers/ReviewsPage/EditReview.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var ReviewForm_1 = __webpack_require__("./app/containers/ReviewForm/index.ts");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query EditReviewQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      reviews {\n        ...ReviewFragment\n      }\n      nctId\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query EditReviewQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      reviews {\n        ...ReviewFragment\n      }\n      nctId\n    }\n  }\n\n  ", "\n  ", "\n"])), ReviewForm_1.default.fragment, StudySummary_1.default.fragment);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var EditReview = /** @class */ (function (_super) {
    __extends(EditReview, _super);
    function EditReview() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleReviewSave = function () {
            var redirectPath = ramda_1.pipe(helpers_1.trimPath, ramda_1.split('/'), ramda_1.dropLast(1), ramda_1.join('/'))(_this.props.match.url);
            _this.props.history.push(redirectPath);
        };
        return _this;
    }
    EditReview.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.match.params.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.study || !data.study.reviews) {
                return null;
            }
            if (!_this.props.match.params.id) {
                return null;
            }
            var id = parseInt(_this.props.match.params.id, 10);
            var review = ramda_1.find(ramda_1.propEq('id', id), data.study.reviews);
            if (!review)
                return null;
            _this.props.onLoaded && _this.props.onLoaded();
            return (React.createElement(ReviewForm_1.default, { review: review, nctId: _this.props.match.params.nctId, afterSave: _this.handleReviewSave }));
        }));
    };
    return EditReview;
}(React.PureComponent));
exports.default = EditReview;
var templateObject_1;


/***/ }),

/***/ "./app/containers/ReviewsPage/ReviewsPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var react_stars_1 = __webpack_require__("./node_modules/react-stars/dist/react-stars.js");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var ReviewForm_1 = __webpack_require__("./app/containers/ReviewForm/index.ts");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var react_rte_yt_1 = __webpack_require__("./node_modules/react-rte-yt/dist/react-rte.js");
var EditReview_1 = __webpack_require__("./app/containers/ReviewsPage/EditReview.tsx");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var configureApollo_1 = __webpack_require__("./app/configureApollo.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment ReviewsPageFragment on Review {\n    id\n    meta\n    content\n    createdAt\n    user {\n      id\n      firstName\n      lastName\n      email\n    }\n  }\n"], ["\n  fragment ReviewsPageFragment on Review {\n    id\n    meta\n    content\n    createdAt\n    user {\n      id\n      firstName\n      lastName\n      email\n    }\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query ReviewPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      reviews {\n        ...ReviewsPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query ReviewPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      reviews {\n        ...ReviewsPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, FRAGMENT);
var STUDY_FRAGMENT = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment ReviewsPageStudyFragment on Study {\n    nctId\n    reviews {\n      ...ReviewsPageFragment\n    }\n  }\n\n  ", "\n"], ["\n  fragment ReviewsPageStudyFragment on Study {\n    nctId\n    reviews {\n      ...ReviewsPageFragment\n    }\n  }\n\n  ", "\n"])), FRAGMENT);
var DELETE_REVIEW_MUTATION = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  mutation ReviewsPageDeleteReviewMutation($id: Int!) {\n    deleteReview(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"], ["\n  mutation ReviewsPageDeleteReviewMutation($id: Int!) {\n    deleteReview(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"])));
var RatingsWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var RatingWrapper = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 10px;\n"], ["\n  margin: 10px;\n"])));
var WriteReviewButton = styled_components_1.default(react_bootstrap_1.Button)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-left: auto;\n  display: flex;\n  margin-bottom: 10px;\n"], ["\n  margin-left: auto;\n  display: flex;\n  margin-bottom: 10px;\n"])));
var ButtonsWrapper = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var DeleteReviewMutationComponent = /** @class */ (function (_super) {
    __extends(DeleteReviewMutationComponent, _super);
    function DeleteReviewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeleteReviewMutationComponent;
}(react_apollo_1.Mutation));
var ReviewsPage = /** @class */ (function (_super) {
    __extends(ReviewsPage, _super);
    function ReviewsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getName = function (user) {
            if (user.firstName) {
                return user.firstName + " " + (user.lastName && user.lastName[0]);
            }
            return user.email;
        };
        _this.handleWriteReview = function () {
            _this.props.history.push(helpers_1.trimPath(_this.props.match.url) + "/new");
        };
        _this.handleEditReview = function (id) {
            _this.props.history.push(helpers_1.trimPath(_this.props.match.url) + "/" + id + "/edit");
        };
        _this.handleDeleteReview = function (deleteReview, id) { return function () {
            deleteReview({ variables: { id: id } });
        }; };
        _this.renderRating = function (key, value) {
            return (React.createElement(RatingWrapper, { key: key },
                React.createElement(react_stars_1.default, { edit: false, color2: constants_1.starColor, count: 5, half: false, value: value }),
                React.createElement(react_bootstrap_1.Label, null, key)));
        };
        _this.renderReview = function (user) { return function (review) {
            var meta = {};
            try {
                meta = JSON.parse(review.meta);
            }
            catch (e) {
                console.error("Error parsing meta " + review.meta, e);
            }
            var authorized = user && user.email === review.user.email;
            return (React.createElement("tr", { key: review.id },
                React.createElement("td", null,
                    React.createElement(react_bootstrap_1.Row, { style: { marginBottom: '10px', padding: '10px' } },
                        React.createElement(react_bootstrap_1.Col, { md: 10 },
                            React.createElement("b", null, _this.getName(review.user)),
                            React.createElement("br", null)),
                        React.createElement(react_bootstrap_1.Col, { md: 2, className: "text-right" },
                            React.createElement("small", null, new Date(review.createdAt).toLocaleDateString('en-US')))),
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(react_bootstrap_1.Col, { md: 6 },
                            React.createElement(react_rte_yt_1.default, { readOnly: true, value: react_rte_yt_1.EditorValue.createFromString(review.content, 'markdown') })),
                        React.createElement(react_bootstrap_1.Col, { md: 4 }),
                        authorized && (React.createElement(react_bootstrap_1.Col, { md: 2 },
                            React.createElement(ButtonsWrapper, null,
                                React.createElement(react_bootstrap_1.Button, { style: { marginRight: 10 }, onClick: function () { return _this.handleEditReview(review.id); } }, "Edit"),
                                React.createElement(DeleteReviewMutationComponent, { mutation: DELETE_REVIEW_MUTATION, update: function (cache) {
                                        var id = configureApollo_1.dataIdFromObject({
                                            id: _this.props.match.params.nctId,
                                            __typename: 'Study',
                                        });
                                        var study = cache.readFragment({
                                            id: id,
                                            fragment: STUDY_FRAGMENT,
                                            fragmentName: 'ReviewsPageStudyFragment',
                                        });
                                        var reviewsLens = ramda_1.lensPath(['reviews']);
                                        var newStudy = ramda_1.over(reviewsLens, ramda_1.reject(ramda_1.propEq('id', review.id)), study);
                                        cache.writeFragment({
                                            id: id,
                                            fragment: STUDY_FRAGMENT,
                                            fragmentName: 'ReviewsPageStudyFragment',
                                            data: newStudy,
                                        });
                                    } }, function (deleteReview) { return (React.createElement(react_bootstrap_1.Button, { onClick: _this.handleDeleteReview(deleteReview, review.id) }, "Delete")); }))))),
                    React.createElement(RatingsWrapper, null, ramda_1.keys(meta).map(function (key) { return _this.renderRating(key, meta[key]); })))));
        }; };
        _this.renderReviews = function (reviews) {
            return (React.createElement(CurrentUser_1.default, null, function (user) { return (React.createElement(React.Fragment, null,
                user && (React.createElement(WriteReviewButton, { onClick: _this.handleWriteReview }, "Write a review")),
                React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true },
                    React.createElement("tbody", null, reviews.map(_this.renderReview(user)))))); }));
        };
        return _this;
    }
    ReviewsPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.study || !data.study.reviews) {
                return null;
            }
            _this.props.onLoaded && _this.props.onLoaded();
            return (React.createElement(react_router_dom_1.Switch, null,
                React.createElement(react_router_dom_1.Route, { path: _this.props.match.path + "/new", render: function (props) {
                        _this.props.onLoaded && _this.props.onLoaded();
                        return React.createElement(ReviewForm_1.default, { nctId: _this.props.nctId });
                    } }),
                React.createElement(react_router_dom_1.Route, { path: _this.props.match.path + "/:id/edit", render: function (props) {
                        return (React.createElement(EditReview_1.default, __assign({}, props, { onLoaded: _this.props.onLoaded })));
                    } }),
                React.createElement(react_router_dom_1.Route, { render: function () { return _this.renderReviews(data.study.reviews); } })));
        }));
    };
    ReviewsPage.fragment = FRAGMENT;
    return ReviewsPage;
}(React.PureComponent));
exports.default = ReviewsPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;


/***/ }),

/***/ "./app/containers/ReviewsPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReviewsPage_1 = __webpack_require__("./app/containers/ReviewsPage/ReviewsPage.tsx");
exports.default = ReviewsPage_1.default;


/***/ }),

/***/ "./app/containers/SearchPage/PARAMS_QUERY.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var PARAMS_QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SearchPageParamsQuery($hash: String) {\n    searchParams(hash: $hash) {\n      q\n      sorts {\n        id\n        desc\n      }\n      aggFilters {\n        field\n        values\n      }\n      crowdAggFilters {\n        field\n        values\n      }\n      page\n      pageSize\n    }\n  }\n"], ["\n  query SearchPageParamsQuery($hash: String) {\n    searchParams(hash: $hash) {\n      q\n      sorts {\n        id\n        desc\n      }\n      aggFilters {\n        field\n        values\n      }\n      crowdAggFilters {\n        field\n        values\n      }\n      page\n      pageSize\n    }\n  }\n"])));
exports.default = PARAMS_QUERY;
var templateObject_1;


/***/ }),

/***/ "./app/containers/SearchPage/SearchPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var SearchStudyPage_1 = __webpack_require__("./app/containers/SearchStudyPage/index.ts");
var BulkEditPage_1 = __webpack_require__("./app/containers/BulkEditPage/index.ts");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var SearchView_1 = __webpack_require__("./app/containers/SearchPage/SearchView.tsx");
var CrumbsBar_1 = __webpack_require__("./app/containers/SearchPage/components/CrumbsBar.tsx");
var Aggs_1 = __webpack_require__("./app/containers/SearchPage/components/Aggs.tsx");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var HASH_QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SearchPageHashQuery(\n    $q: SearchQueryInput!\n    $sorts: [SortInput!]\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int\n    $pageSize: Int\n  ) {\n    searchHash(\n      params: {\n        q: $q\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        page: $page\n        pageSize: $pageSize\n      }\n    )\n  }\n"], ["\n  query SearchPageHashQuery(\n    $q: SearchQueryInput!\n    $sorts: [SortInput!]\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int\n    $pageSize: Int\n  ) {\n    searchHash(\n      params: {\n        q: $q\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        page: $page\n        pageSize: $pageSize\n      }\n    )\n  }\n"])));
exports.PARAMS_QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query SearchSearchPageParamsQuery($hash: String) {\n    searchParams(hash: $hash) {\n      q\n      sorts {\n        id\n        desc\n      }\n      aggFilters {\n        field\n        values\n      }\n      crowdAggFilters {\n        field\n        values\n      }\n      page\n      pageSize\n    }\n  }\n"], ["\n  query SearchSearchPageParamsQuery($hash: String) {\n    searchParams(hash: $hash) {\n      q\n      sorts {\n        id\n        desc\n      }\n      aggFilters {\n        field\n        values\n      }\n      crowdAggFilters {\n        field\n        values\n      }\n      page\n      pageSize\n    }\n  }\n"])));
var HashQueryComponent = /** @class */ (function (_super) {
    __extends(HashQueryComponent, _super);
    function HashQueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HashQueryComponent;
}(react_apollo_1.Query));
var ParamsQueryComponent = /** @class */ (function (_super) {
    __extends(ParamsQueryComponent, _super);
    function ParamsQueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ParamsQueryComponent;
}(react_apollo_1.Query));
var MainContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  float: left;\n  width: 100%;\n\n  .rt-th {\n    text-transform: capitalize;\n    padding: 15px !important;\n    background: #8bb7a4 !important;\n    color: #fff;\n  }\n\n  .rt-table {\n  }\n"], ["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  float: left;\n  width: 100%;\n\n  .rt-th {\n    text-transform: capitalize;\n    padding: 15px !important;\n    background: #8bb7a4 !important;\n    color: #fff;\n  }\n\n  .rt-table {\n  }\n"])));
var SidebarContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding-right: 0px !important;\n  padding-top: 10px;\n  box-sizing: border-box;\n  .panel-title {\n    a:hover {\n      text-decoration: none;\n      color: #fff;\n    }\n  }\n  .panel-default {\n    box-shadow: 0px;\n    border: 0px;\n    background: none;\n    color: #fff;\n    text-transform: capitalize;\n    .panel-heading {\n      box-shadow: 0px;\n      border: 0px;\n      background: none;\n      color: #fff;\n      text-transform: capitalize;\n    }\n    .panel-collapse {\n      background: #394149;\n      .panel-body {\n        padding-left: 10px;\n        color: rgba(255, 255, 255, 0.7);\n      }\n    }\n    .panel-title {\n      font-size: 16px;\n      color: #bac5d0;\n      padding: 0px 10px;\n    }\n  }\n"], ["\n  padding-right: 0px !important;\n  padding-top: 10px;\n  box-sizing: border-box;\n  .panel-title {\n    a:hover {\n      text-decoration: none;\n      color: #fff;\n    }\n  }\n  .panel-default {\n    box-shadow: 0px;\n    border: 0px;\n    background: none;\n    color: #fff;\n    text-transform: capitalize;\n    .panel-heading {\n      box-shadow: 0px;\n      border: 0px;\n      background: none;\n      color: #fff;\n      text-transform: capitalize;\n    }\n    .panel-collapse {\n      background: #394149;\n      .panel-body {\n        padding-left: 10px;\n        color: rgba(255, 255, 255, 0.7);\n      }\n    }\n    .panel-title {\n      font-size: 16px;\n      color: #bac5d0;\n      padding: 0px 10px;\n    }\n  }\n"])));
var SearchContainer = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  border: solid white 1px;\n  background-color: #f2f2f2;\n  color: black;\n  margin-bottom: 1em;\n  margin-left: 15px;\n  margin-right: 15px;\n  display: flex;\n  flex-direction: column;\n  padding: 10px;\n"], ["\n  border: solid white 1px;\n  background-color: #f2f2f2;\n  color: black;\n  margin-bottom: 1em;\n  margin-left: 15px;\n  margin-right: 15px;\n  display: flex;\n  flex-direction: column;\n  padding: 10px;\n"])));
var InstructionsContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0 20px;\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0 20px;\n"])));
var Instructions = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n"])));
var changeFilter = function (add) { return function (aggName, key, isCrowd) { return function (params) {
    var propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    var lens = ramda_1.lensPath([propName]);
    return ramda_1.over(lens, function (aggs) {
        var index = ramda_1.findIndex(ramda_1.propEq('field', aggName), aggs);
        if (index === -1 && add) {
            return __spread(aggs, [{ field: aggName, values: [key] }]);
        }
        var aggLens = ramda_1.lensPath([index, 'values']);
        var updater = function (values) {
            return add ? __spread(values, [key]) : ramda_1.reject(function (x) { return x === key; }, values);
        };
        var res = ramda_1.over(aggLens, updater, aggs);
        // Drop filter if no values left
        if (ramda_1.isEmpty(ramda_1.view(aggLens, res))) {
            res = ramda_1.remove(index, 1, res);
        }
        return res;
    }, __assign(__assign({}, params), { page: 0 }));
}; }; };
var addFilter = changeFilter(true);
var removeFilter = changeFilter(false);
var addFilters = function (aggName, keys, isCrowd) {
    return function (params) {
        keys.forEach(function (k) {
            (params = addFilter(aggName, k, isCrowd)(params)),
                console.log(k);
        });
        // changeFilter(true);
        return params;
    };
};
var removeFilters = function (aggName, keys, isCrowd) {
    return function (params) {
        keys.forEach(function (k) {
            params = removeFilter(aggName, k, isCrowd)(params);
        });
        // changeFilter(true);
        return params;
    };
};
var addSearchTerm = function (term) { return function (params) {
    // have to check for empty string because if you press return two times it ends up putting it in the terms
    if (!term.replace(/\s/g, '').length) {
        return params;
    }
    // recycled code for removing repeated terms. might be a better way but I'm not sure.
    var children = ramda_1.reject(ramda_1.propEq('key', term), params.q.children || []);
    return __assign(__assign({}, params), { q: __assign(__assign({}, params.q), { children: __spread((children || []), [{ key: term }]) }), page: 0 });
}; };
var removeSearchTerm = function (term) { return function (params) {
    var children = ramda_1.reject(ramda_1.propEq('key', term), params.q.children || []);
    return __assign(__assign({}, params), { q: __assign(__assign({}, params.q), { children: children }), page: 0 });
}; };
var changePage = function (pageNumber) { return function (params) { return (__assign(__assign({}, params), { page: Math.min(pageNumber, Math.ceil(constants_1.MAX_WINDOW_SIZE / params.pageSize) - 1) })); }; };
var DEFAULT_PARAMS = {
    q: { key: 'AND', children: [] },
    aggFilters: [],
    crowdAggFilters: [],
    sorts: [],
    page: 0,
    pageSize: 25,
};
var SearchPage = /** @class */ (function (_super) {
    __extends(SearchPage, _super);
    function SearchPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            params: null,
            openedAgg: null,
            searchAggs: {},
            searchCrowdAggs: {},
            showCards: localStorage.getItem('showCards') === 'true' ? true : false,
            removeSelectAll: false,
            totalRecords: 0,
        };
        _this.numberOfPages = 0;
        _this.returnNumberOfPages = function (numberOfPg) {
            _this.numberOfPages = numberOfPg;
        };
        _this.toggledShowCards = function (showCards) {
            localStorage.setItem('showCards', showCards.toString());
            var params = __assign(__assign({}, _this.state.params), { page: 0 });
            _this.previousSearchData = [];
            _this.setState({ showCards: showCards, params: params });
            // console.log('ToggleShowParams', params);
            // console.log('LocalStorage', localStorage.getItem('showCards'));
        };
        _this.previousSearchData = [];
        _this.returnPreviousSearchData = function (previousSearchData) {
            _this.previousSearchData = previousSearchData;
        };
        _this.getDefaultParams = function (view) {
            return __assign(__assign({}, DEFAULT_PARAMS), siteViewHelpers_1.preselectedFilters(view));
        };
        _this.searchParamsFromQuery = function (view, params) {
            var defaultParams = _this.getDefaultParams(view);
            if (!params)
                return defaultParams;
            var q = params.q
                ? JSON.parse(params.q)
                : defaultParams.q;
            var aggFilters = ramda_1.map(ramda_1.dissoc('__typename'), params.aggFilters || []);
            var crowdAggFilters = ramda_1.map(ramda_1.dissoc('__typename'), params.crowdAggFilters || []);
            var sorts = ramda_1.map(ramda_1.dissoc('__typename'), params.sorts || []);
            return {
                aggFilters: aggFilters,
                crowdAggFilters: crowdAggFilters,
                sorts: sorts,
                q: q,
                page: params.page || 0,
                pageSize: params.pageSize || 25,
            };
        };
        _this.transformFilters = function (filters) {
            return ramda_1.pipe(ramda_1.groupBy(ramda_1.prop('field')), ramda_1.map(ramda_1.head), ramda_1.map(ramda_1.propOr([], 'values')), ramda_1.map(function (arr) { return new Set(arr); }))(filters);
        };
        _this.transformAggs = function (aggs) {
            return ramda_1.pipe(ramda_1.groupBy(ramda_1.prop('name')), ramda_1.map(ramda_1.head), ramda_1.map(ramda_1.prop('buckets')))(aggs);
        };
        _this.transformCrowdAggs = function (aggs) {
            // @ts-ignore
            return ramda_1.pipe(ramda_1.head, ramda_1.prop('buckets'), ramda_1.groupBy(ramda_1.prop('key')))(aggs);
        };
        _this.handleResetFilters = function (view) { return function () {
            _this.setState({
                params: _this.getDefaultParams(view),
                removeSelectAll: true,
            });
        }; };
        _this.handleClearFilters = function () {
            _this.setState({
                params: DEFAULT_PARAMS,
                removeSelectAll: true,
            });
        };
        _this.resetSelectAll = function () {
            _this.setState({
                removeSelectAll: false,
            });
        };
        _this.handleUpdateParams = function (updater) {
            var params = updater(_this.state.params);
            console.log('updatedParams', params);
            _this.previousSearchData = [];
            if (!ramda_1.equals(params.q, _this.state.params && _this.state.params.q)) {
                // For now search doesn't work well with args list
                // Therefore we close it to refresh later on open
                _this.setState({ openedAgg: null });
            }
            _this.setState({ params: params });
        };
        _this.isWorkflow = function () {
            return ramda_1.pipe(ramda_1.pathOr([], ['params', 'crowdAggFilters']), ramda_1.map(ramda_1.prop('field')), 
            // @ts-ignore
            ramda_1.any(function (x) { return x.toLowerCase().includes('wf_'); }))(_this.state);
        };
        _this.handleRowClick = function (nctId) {
            var suffix = _this.isWorkflow() && !_this.props.ignoreUrlHash ? '/workflow' : '';
            var prefix = _this.props.ignoreUrlHash ? '' : _this.props.match.url;
            _this.props.history.push(prefix + "/study/" + nctId + suffix);
        };
        _this.handleBulkUpdateClick = function () {
            _this.props.history.push(_this.props.match.url + "/bulk");
        };
        _this.handleOpenAgg = function (name, kind) {
            if (!_this.state.openedAgg) {
                _this.setState({ openedAgg: { name: name, kind: kind } });
                return;
            }
            // @ts-ignore
            var _a = _this.state.openedAgg, currentName = _a.name, currentKind = _a.kind;
            if (name === currentName && kind === currentKind) {
                _this.setState({ openedAgg: null });
                return;
            }
            _this.setState({ openedAgg: { name: name, kind: kind } });
        };
        _this.handleAggsUpdate = function (searchAggs, searchCrowdAggs) {
            if (!ramda_1.equals(searchAggs, _this.state.searchAggs) ||
                !ramda_1.equals(searchCrowdAggs, _this.state.searchCrowdAggs)) {
                _this.setState({ searchAggs: searchAggs, searchCrowdAggs: searchCrowdAggs });
            }
        };
        _this.renderAggs = function (siteView) {
            var opened = _this.state.openedAgg && _this.state.openedAgg.name;
            var openedKind = _this.state.openedAgg && _this.state.openedAgg.kind;
            var _a = _this.state.params || {}, _b = _a.aggFilters, aggFilters = _b === void 0 ? [] : _b, _c = _a.crowdAggFilters, crowdAggFilters = _c === void 0 ? [] : _c;
            // this.searchParamsFromQuery();
            return (React.createElement(Aggs_1.default, { aggs: _this.state.searchAggs, crowdAggs: _this.state.searchCrowdAggs, filters: _this.transformFilters(aggFilters), crowdFilters: _this.transformFilters(crowdAggFilters), addFilter: ramda_1.pipe(addFilter, _this.handleUpdateParams), addFilters: ramda_1.pipe(addFilters, _this.handleUpdateParams), removeFilter: ramda_1.pipe(removeFilter, _this.handleUpdateParams), removeFilters: ramda_1.pipe(removeFilters, _this.handleUpdateParams), updateParams: _this.handleUpdateParams, removeSelectAll: _this.state.removeSelectAll, resetSelectAll: _this.resetSelectAll, 
                // @ts-ignore
                searchParams: _this.state.params, opened: opened, openedKind: openedKind, onOpen: _this.handleOpenAgg, currentSiteView: siteView }));
        };
        _this.renderSearch = function (hash, view, siteViews) {
            return (React.createElement(ParamsQueryComponent, { query: exports.PARAMS_QUERY, variables: { hash: hash }, onCompleted: function (data) {
                    if (!_this.state.params) {
                        var params = _this.searchParamsFromQuery(view, data && data.searchParams);
                        _this.setState({
                            params: __assign(__assign({}, params), { page: 0, pageSize: 25 }),
                        });
                        return null;
                    }
                } }, function (_a) {
                var data = _a.data, loading = _a.loading, error = _a.error;
                if (error || loading)
                    return null;
                var params = _this.searchParamsFromQuery(view, data && data.searchParams);
                // hydrate state params from hash
                if (!_this.state.params) {
                    _this.setState({ params: params });
                    return null;
                }
                var opened = _this.state.openedAgg && _this.state.openedAgg.name;
                var openedKind = _this.state.openedAgg && _this.state.openedAgg.kind;
                var _b = _this.state.params || {}, _c = _b.aggFilters, aggFilters = _c === void 0 ? [] : _c, _d = _b.crowdAggFilters, crowdAggFilters = _d === void 0 ? [] : _d;
                // current site view url should match w/one of the site views url
                var checkUrls = ramda_1.filter(function (siteViews) { return siteViews.url === _this.props.match.params.siteviewUrl; }, siteViews);
                var siteViewUrl = checkUrls.length === 1 // not sure if I should be checking for duplicates
                    ? _this.props.match.params.siteviewUrl
                    : 'default';
                return (React.createElement(HashQueryComponent, { query: HASH_QUERY, variables: _this.state.params || undefined }, function (_a) {
                    var data = _a.data, loading = _a.loading, error = _a.error;
                    if (error || loading || !data)
                        return null;
                    // We have a mismatch between url and params in state
                    if (data.searchHash !== hash) {
                        return (React.createElement(react_router_dom_1.Redirect, { to: "/search/" + siteViewUrl + "/" + data.searchHash }));
                    }
                    return (React.createElement(SearchView_1.default, { params: params, onBulkUpdate: _this.handleBulkUpdateClick, openedAgg: _this.state.openedAgg, onUpdateParams: _this.handleUpdateParams, onRowClick: _this.handleRowClick, onOpenAgg: _this.handleOpenAgg, onAggsUpdate: _this.handleAggsUpdate, onResetFilters: _this.handleResetFilters(view), onClearFilters: _this.handleClearFilters, previousSearchData: _this.previousSearchData, returnPreviousSearchData: _this.returnPreviousSearchData, searchHash: data.searchHash, showCards: _this.state.showCards, toggledShowCards: _this.toggledShowCards, returnNumberOfPages: _this.returnNumberOfPages, siteViewUrl: siteViewUrl, searchAggs: _this.state.searchAggs, crowdAggs: _this.state.searchCrowdAggs, transformFilters: _this.transformFilters, removeSelectAll: _this.state.removeSelectAll, resetSelectAll: _this.resetSelectAll, searchParams: _this.state.params, opened: opened, openedKind: openedKind, onOpen: _this.handleOpenAgg, currentSiteView: view, getTotalResults: _this.getTotalResults }));
                }));
            }));
        };
        _this.handleScroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
                _this.state.params.page < _this.numberOfPages - 1 &&
                _this.state.showCards) {
                window.removeEventListener('scroll', _this.handleScroll);
                var params = __assign(__assign({}, _this.state.params), { page: _this.state.params.page + 1 });
                _this.setState({ params: params });
                setTimeout(function () {
                    window.addEventListener('scroll', _this.handleScroll);
                }, 1000);
                return null;
            }
        };
        _this.getTotalResults = function (total) {
            if (total) {
                _this.setState({
                    totalRecords: total,
                });
            }
            return null;
        };
        _this.renderPresearch = function (hash) {
            var _a = _this.state.params || {}, _b = _a.aggFilters, aggFilters = _b === void 0 ? [] : _b, _c = _a.crowdAggFilters, crowdAggFilters = _c === void 0 ? [] : _c;
            return (React.createElement(SiteProvider_1.default, null, function (site) {
                var siteViewUrl = _this.props.match.params.siteviewUrl;
                var siteViews = site.siteViews;
                var thisSiteView = siteViews.find(function (siteview) { return siteview.url == siteViewUrl; }) ||
                    site.siteView;
                var preSearchAggs = thisSiteView.search.presearch.aggs.selected.values;
                var preSearchCrowdAggs = thisSiteView.search.presearch.crowdAggs.selected.values;
                var presearchButton = thisSiteView.search.presearch.button;
                var presearchInstructions = thisSiteView.search.presearch.instructions;
                var presearchText = thisSiteView.search.presearch.instructions;
                return (React.createElement(SearchContainer, null,
                    React.createElement(InstructionsContainer, null, presearchText && (React.createElement(Instructions, null,
                        React.createElement("h5", null, presearchText)))),
                    React.createElement(Aggs_1.default, { aggs: _this.state.searchAggs, crowdAggs: _this.state.searchCrowdAggs, filters: _this.transformFilters(aggFilters), crowdFilters: _this.transformFilters(crowdAggFilters), addFilter: ramda_1.pipe(addFilter, _this.handleUpdateParams), addFilters: ramda_1.pipe(addFilters, _this.handleUpdateParams), removeFilter: ramda_1.pipe(removeFilter, _this.handleUpdateParams), removeFilters: ramda_1.pipe(removeFilters, _this.handleUpdateParams), updateParams: _this.handleUpdateParams, removeSelectAll: _this.state.removeSelectAll, resetSelectAll: _this.resetSelectAll, 
                        // @ts-ignore
                        searchParams: _this.state.params, presearch: true, preSearchAggs: preSearchAggs, preSearchCrowdAggs: preSearchCrowdAggs, currentSiteView: thisSiteView }),
                    presearchButton.name && (React.createElement(react_bootstrap_1.Button, { style: { width: 200, marginLeft: 13 }, href: "/search/" + presearchButton.target + "/" + hash }, presearchButton.name))));
            }));
        };
        _this.renderCrumbs = function () {
            var _a, _b;
            var _c = _this.state, params = _c.params, totalRecords = _c.totalRecords;
            var q = ((_a = _this.state.params) === null || _a === void 0 ? void 0 : _a.q.key) === '*'
                ? []
                : (((_b = _this.state.params) === null || _b === void 0 ? void 0 : _b.q.children) || []).map(ramda_1.prop('key'));
            return (React.createElement(SiteProvider_1.default, null, function (site) {
                var _a;
                var siteViewUrl = _this.props.match.params.siteviewUrl;
                var siteViews = site.siteViews;
                var currentSiteView = siteViews.find(function (siteview) { return siteview.url == siteViewUrl; }) ||
                    site.siteView;
                return (React.createElement(CrumbsBar_1.default, { siteViewUrl: siteViewUrl, 
                    //@ts-ignore
                    searchParams: __assign(__assign({}, _this.state.params), { q: q }), onBulkUpdate: _this.handleBulkUpdateClick, removeFilter: ramda_1.pipe(removeFilter, _this.handleUpdateParams), addSearchTerm: ramda_1.pipe(addSearchTerm, _this.handleUpdateParams), removeSearchTerm: ramda_1.pipe(removeSearchTerm, _this.handleUpdateParams), pageSize: ((_a = params) === null || _a === void 0 ? void 0 : _a.pageSize) || 25, update: {
                        page: ramda_1.pipe(changePage, _this.handleUpdateParams),
                    }, data: site, onReset: _this.handleResetFilters(currentSiteView), onClear: _this.handleClearFilters, showCards: _this.state.showCards, addFilter: ramda_1.pipe(addFilter, _this.handleUpdateParams), currentSiteView: currentSiteView, totalResults: _this.state.totalRecords }));
            }));
        };
        return _this;
    }
    SearchPage.getDerivedStateFromProps = function (props, state) {
        if (state.params == null && props.ignoreUrlHash) {
            return {
                params: props.searchParams || DEFAULT_PARAMS,
                openedAgg: null,
            };
        }
        return null;
    };
    SearchPage.prototype.componentDidMount = function () {
        if (this.state.showCards) {
            window.addEventListener('scroll', this.handleScroll);
        }
        else {
            window.removeEventListener('scroll', this.handleScroll);
        }
    };
    SearchPage.prototype.componentWillUnmount = function () {
        window.removeEventListener('scroll', this.handleScroll);
    };
    SearchPage.prototype.componentDidUpdate = function () {
        if (this.state.showCards) {
            window.addEventListener('scroll', this.handleScroll);
        }
        else {
            window.removeEventListener('scroll', this.handleScroll);
        }
    };
    SearchPage.prototype.render = function () {
        var _this = this;
        var opened = this.state.openedAgg && this.state.openedAgg.name;
        var openedKind = this.state.openedAgg && this.state.openedAgg.kind;
        if (this.props.ignoreUrlHash) {
            return (React.createElement(SiteProvider_1.default, null, function (site) {
                var siteViewUrl = _this.props.match.params.siteviewUrl;
                var siteViews = site.siteViews;
                var thisSiteView = siteViews.find(function (siteview) { return siteview.url == siteViewUrl; }) ||
                    site.siteView;
                if (siteViewUrl === 'default') {
                    thisSiteView = site.siteView;
                }
                // console.log(thisSiteView);
                return (React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(SidebarContainer, { md: 2 }, _this.renderAggs(thisSiteView)),
                    React.createElement(MainContainer, { md: 10 },
                        _this.renderPresearch(null),
                        React.createElement(SearchView_1.default, { params: _this.state.params, onBulkUpdate: _this.handleBulkUpdateClick, openedAgg: _this.state.openedAgg, onUpdateParams: _this.handleUpdateParams, onRowClick: _this.handleRowClick, onOpenAgg: _this.handleOpenAgg, onAggsUpdate: _this.handleAggsUpdate, onResetFilters: _this.handleResetFilters(thisSiteView), onClearFilters: _this.handleClearFilters, previousSearchData: _this.previousSearchData, returnPreviousSearchData: function () {
                                return _this.returnPreviousSearchData;
                            }, searchHash: '', showCards: _this.state.showCards, toggledShowCards: _this.toggledShowCards, returnNumberOfPages: _this.returnNumberOfPages, siteViewUrl: siteViewUrl, searchAggs: _this.state.searchAggs, crowdAggs: _this.state.searchCrowdAggs, transformFilters: _this.transformFilters, removeSelectAll: _this.state.removeSelectAll, resetSelectAll: _this.resetSelectAll, searchParams: _this.state.params, opened: opened, openedKind: openedKind, onOpen: _this.handleOpenAgg, currentSiteView: thisSiteView, getTotalResults: _this.getTotalResults }))));
            }));
        }
        var hash = ramda_1.path(['match', 'params', 'searchId'], this.props);
        return (React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { path: this.props.match.path + "/study/:nctId", component: SearchStudyPage_1.default }),
            React.createElement(react_router_dom_1.Route, { path: this.props.match.path + "/bulk/", component: BulkEditPage_1.default }),
            React.createElement(react_router_dom_1.Route, { render: function () { return (React.createElement(SiteProvider_1.default, null, function (site) {
                    var siteViewUrl = _this.props.match.params.siteviewUrl;
                    var siteViews = site.siteViews;
                    var currentSiteView = 
                    //@ts-ignore
                    siteViews.find(function (siteview) {
                        //@ts-ignore
                        return siteview.url.toLowerCase() == siteViewUrl.toLowerCase();
                    }) || site.siteView;
                    if (siteViewUrl === 'default') {
                        currentSiteView = site.siteView;
                    }
                    if (!currentSiteView) {
                        return React.createElement("div", null, "Error loading data.");
                    }
                    var _a = currentSiteView.search.config.fields, showPresearch = _a.showPresearch, showFacetBar = _a.showFacetBar, showBreadCrumbs = _a.showBreadCrumbs;
                    return (React.createElement(react_bootstrap_1.Row, null,
                        showFacetBar && (React.createElement(SidebarContainer, { md: 2 }, _this.renderAggs(currentSiteView))),
                        React.createElement("div", { id: "main_search", style: { overflowY: 'auto' } },
                            React.createElement(MainContainer, { style: { width: '100%' } },
                                showBreadCrumbs && _this.renderCrumbs(),
                                showPresearch && _this.renderPresearch(hash),
                                _this.renderSearch(hash, currentSiteView, site.siteViews)))));
                })); } })));
    };
    return SearchPage;
}(React.Component));
exports.default = SearchPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;


/***/ }),

/***/ "./app/containers/SearchPage/SearchView.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_table_1 = __webpack_require__("./node_modules/react-table/lib/index.js");
var react_stars_1 = __webpack_require__("./node_modules/react-stars/dist/react-stars.js");
var SearchFieldName_1 = __webpack_require__("./app/components/SearchFieldName/index.ts");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var Icons_1 = __webpack_require__("./app/containers/SearchPage/components/Icons.tsx");
var react_helmet_1 = __webpack_require__("./node_modules/react-helmet/lib/Helmet.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
__webpack_require__("./node_modules/react-table/react-table.css");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var Cards_1 = __webpack_require__("./app/containers/SearchPage/components/Cards.tsx");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SearchPageSearchQuery(\n    $q: SearchQueryInput!\n    $page: Int\n    $pageSize: Int\n    $sorts: [SortInput!]\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n  ) {\n    crowdAggs: aggBuckets(\n      params: {\n        q: $q\n        page: 0\n        pageSize: 100000\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        agg: \"front_matter_keys\"\n      }\n    ) {\n      aggs {\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    search(\n      params: {\n        q: $q\n        page: $page\n        pageSize: $pageSize\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n      }\n    ) {\n      recordsTotal\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n      studies {\n        ...StudyItemFragment\n      }\n    }\n  }\n\n  fragment StudyItemFragment on Study {\n    averageRating\n    completionDate\n    nctId\n    overallStatus\n    startDate\n    briefTitle\n    reviewsCount\n    nlmDownloadDateDescription\n    studyFirstSubmittedDate\n    resultsFirstSubmittedDate\n    dispositionFirstSubmittedDate\n    lastUpdateSubmittedDate\n    studyFirstSubmittedQcDate\n    studyFirstPostedDate\n    studyFirstPostedDateType\n    resultsFirstSubmittedQcDate\n    resultsFirstPostedDate\n    resultsFirstPostedDateType\n    dispositionFirstSubmittedQcDate\n    dispositionFirstPostedDate\n    dispositionFirstPostedDateType\n    lastUpdateSubmittedQcDate\n    lastUpdatePostedDate\n    lastUpdatePostedDateType\n    startMonthYear\n    startDateType\n    verificationMonthYear\n    verificationDate\n    completionMonthYear\n    completionDateType\n    primaryCompletionMonthYear\n    primaryCompletionDateType\n    primaryCompletionDate\n    targetDuration\n    studyType\n    acronym\n    baselinePopulation\n    officialTitle\n    lastKnownStatus\n    phase\n    enrollment\n    enrollmentType\n    source\n    limitationsAndCaveats\n    numberOfArms\n    numberOfGroups\n    whyStopped\n    hasExpandedAccess\n    expandedAccessTypeIndividual\n    expandedAccessTypeIntermediate\n    expandedAccessTypeTreatment\n    hasDmc\n    isFdaRegulatedDrug\n    isFdaRegulatedDevice\n    isUnapprovedDevice\n    isPpsd\n    isUsExport\n    biospecRetention\n    biospecDescription\n    ipdTimeFrame\n    ipdAccessCriteria\n    ipdUrl\n    planToShareIpd\n    planToShareIpdDescription\n  }\n"], ["\n  query SearchPageSearchQuery(\n    $q: SearchQueryInput!\n    $page: Int\n    $pageSize: Int\n    $sorts: [SortInput!]\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n  ) {\n    crowdAggs: aggBuckets(\n      params: {\n        q: $q\n        page: 0\n        pageSize: 100000\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        agg: \"front_matter_keys\"\n      }\n    ) {\n      aggs {\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    search(\n      params: {\n        q: $q\n        page: $page\n        pageSize: $pageSize\n        sorts: $sorts\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n      }\n    ) {\n      recordsTotal\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n      studies {\n        ...StudyItemFragment\n      }\n    }\n  }\n\n  fragment StudyItemFragment on Study {\n    averageRating\n    completionDate\n    nctId\n    overallStatus\n    startDate\n    briefTitle\n    reviewsCount\n    nlmDownloadDateDescription\n    studyFirstSubmittedDate\n    resultsFirstSubmittedDate\n    dispositionFirstSubmittedDate\n    lastUpdateSubmittedDate\n    studyFirstSubmittedQcDate\n    studyFirstPostedDate\n    studyFirstPostedDateType\n    resultsFirstSubmittedQcDate\n    resultsFirstPostedDate\n    resultsFirstPostedDateType\n    dispositionFirstSubmittedQcDate\n    dispositionFirstPostedDate\n    dispositionFirstPostedDateType\n    lastUpdateSubmittedQcDate\n    lastUpdatePostedDate\n    lastUpdatePostedDateType\n    startMonthYear\n    startDateType\n    verificationMonthYear\n    verificationDate\n    completionMonthYear\n    completionDateType\n    primaryCompletionMonthYear\n    primaryCompletionDateType\n    primaryCompletionDate\n    targetDuration\n    studyType\n    acronym\n    baselinePopulation\n    officialTitle\n    lastKnownStatus\n    phase\n    enrollment\n    enrollmentType\n    source\n    limitationsAndCaveats\n    numberOfArms\n    numberOfGroups\n    whyStopped\n    hasExpandedAccess\n    expandedAccessTypeIndividual\n    expandedAccessTypeIntermediate\n    expandedAccessTypeTreatment\n    hasDmc\n    isFdaRegulatedDrug\n    isFdaRegulatedDevice\n    isUnapprovedDevice\n    isPpsd\n    isUsExport\n    biospecRetention\n    biospecDescription\n    ipdTimeFrame\n    ipdAccessCriteria\n    ipdUrl\n    planToShareIpd\n    planToShareIpdDescription\n  }\n"])));
var COLUMNS = constants_1.studyFields;
var COLUMN_NAMES = ramda_1.fromPairs(
// @ts-ignore
COLUMNS.map(function (field) { return [
    field,
    field
        .split('_')
        .map(helpers_1.capitalize)
        .join(' '),
]; }));
var changePage = function (pageNumber) { return function (params) { return (__assign(__assign({}, params), { page: Math.min(pageNumber, Math.ceil(constants_1.MAX_WINDOW_SIZE / params.pageSize) - 1) })); }; };
var changePageSize = function (pageSize) { return function (params) { return (__assign(__assign({}, params), { pageSize: pageSize, page: 0 })); }; };
var changeSorted = function (sorts) { return function (params) {
    var idSortedLens = ramda_1.lensProp('id');
    var snakeSorts = ramda_1.map(ramda_1.over(idSortedLens, helpers_1.snakeCase), sorts);
    return __assign(__assign({}, params), { sorts: snakeSorts, page: 0 });
}; };
var changeFilter = function (add) { return function (aggName, key, isCrowd) { return function (params) {
    var propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    var lens = ramda_1.lensPath([propName]);
    return ramda_1.over(lens, function (aggs) {
        var index = ramda_1.findIndex(ramda_1.propEq('field', aggName), aggs);
        if (index === -1 && add) {
            return __spread(aggs, [{ field: aggName, values: [key] }]);
        }
        var aggLens = ramda_1.lensPath([index, 'values']);
        var updater = function (values) {
            return add ? __spread(values, [key]) : ramda_1.reject(function (x) { return x === key; }, values);
        };
        var res = ramda_1.over(aggLens, updater, aggs);
        // Drop filter if no values left
        if (ramda_1.isEmpty(ramda_1.view(aggLens, res))) {
            res = ramda_1.remove(index, 1, res);
        }
        return res;
    }, __assign(__assign({}, params), { page: 0 }));
}; }; };
var addFilter = changeFilter(true);
var removeFilter = changeFilter(false);
var addFilters = function (aggName, keys, isCrowd) {
    return function (params) {
        keys.forEach(function (k) {
            (params = addFilter(aggName, k, isCrowd)(params)),
                console.log(k);
        });
        // changeFilter(true);
        return params;
    };
};
var removeFilters = function (aggName, keys, isCrowd) {
    return function (params) {
        keys.forEach(function (k) {
            params = removeFilter(aggName, k, isCrowd)(params);
        });
        // changeFilter(true);
        return params;
    };
};
var addSearchTerm = function (term) { return function (params) {
    // have to check for empty string because if you press return two times it ends up putting it in the terms
    if (!term.replace(/\s/g, '').length) {
        return params;
    }
    // recycled code for removing repeated terms. might be a better way but I'm not sure.
    var children = ramda_1.reject(ramda_1.propEq('key', term), params.q.children || []);
    return __assign(__assign({}, params), { q: __assign(__assign({}, params.q), { children: __spread((children || []), [{ key: term }]) }), page: 0 });
}; };
var removeSearchTerm = function (term) { return function (params) {
    var children = ramda_1.reject(ramda_1.propEq('key', term), params.q.children || []);
    return __assign(__assign({}, params), { q: __assign(__assign({}, params.q), { children: children }), page: 0 });
}; };
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var SearchWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  .rt-tr {\n    cursor: pointer;\n  }\n  #search-sidebar {\n    padding-right: 0;\n  }\n"], ["\n  .rt-tr {\n    cursor: pointer;\n  }\n  #search-sidebar {\n    padding-right: 0;\n  }\n"])));
var SearchContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 10px 30px;\n  border: solid white 1px;\n  background-color: #f2f2f2;\n  color: black;\n  margin-bottom: 1em;\n  display: flex;\n  flex-direction: column;\n"], ["\n  padding: 10px 30px;\n  border: solid white 1px;\n  background-color: #f2f2f2;\n  color: black;\n  margin-bottom: 1em;\n  display: flex;\n  flex-direction: column;\n"])));
var InstructionsContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0 20px;\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0 20px;\n"])));
var Instructions = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n"])));
var SearchView = /** @class */ (function (_super) {
    __extends(SearchView, _super);
    function SearchView(props) {
        var _this = _super.call(this, props) || this;
        _this.searchTable = 0;
        _this.isStarColumn = function (name) {
            return name === 'average_rating';
        };
        _this.toggledShowCards = function (showCards) {
            _this.props.toggledShowCards(showCards);
            console.log('Params', _this.props.params);
            ramda_1.pipe(changePage, _this.props.onUpdateParams);
        };
        // this is for the column widths. currently, some tags are making it way too wide
        _this.isStatusColumn = function (name) {
            return name === 'overall_status';
        };
        _this.rowProps = function (_, rowInfo) {
            return {
                onClick: function (_, handleOriginal) {
                    _this.props.onRowClick(rowInfo.row.nctId);
                    return handleOriginal();
                },
            };
        };
        _this.renderColumn = function (name, data) {
            // INPUT: col name
            // OUTPUT render a react-table column with given header, accessor, style,
            // and value determined by studyfragment of that column.
            // also renders stars
            var camelCaseName = helpers_1.camelCase(name);
            var lowerCaseSpacing = 8;
            var upperCaseSpacing = 10;
            var maxWidth = 400;
            var totalPadding = 17;
            var getColumnWidth = function () {
                if (data.length < 1) {
                    return calcWidth(headerName.split('')) + totalPadding;
                }
                var max = headerName;
                for (var i = 0; i < data.length; i += 1) {
                    var elem = data[i][camelCaseName];
                    if (data[i] !== undefined && elem !== null) {
                        var str = elem.toString();
                        if (str.length > max.length) {
                            max = str;
                        }
                    }
                }
                var maxArray = max.split('');
                var maxSize = Math.max(calcWidth(maxArray), calcWidth(headerName.split('')) + totalPadding);
                return Math.min(maxWidth, maxSize);
            };
            var calcWidth = function (array) {
                return array.reduce(function (acc, letter) {
                    return letter === letter.toUpperCase() && letter !== ' '
                        ? acc + upperCaseSpacing
                        : acc + lowerCaseSpacing;
                }, 0);
            };
            var headerName = COLUMN_NAMES[name];
            return {
                Header: React.createElement(SearchFieldName_1.default, { field: headerName }),
                accessor: camelCaseName,
                style: {
                    overflowWrap: 'break-word',
                    overflow: 'hidden',
                    whiteSpace: 'normal',
                    textAlign: _this.isStarColumn(name) ? 'center' : null,
                },
                Cell: !_this.isStarColumn(name)
                    ? null
                    : // the stars and the number of reviews. css in global-styles.ts makes it so they're on one line
                        function (// the stars and the number of reviews. css in global-styles.ts makes it so they're on one line
                        props) { return (React.createElement("div", null,
                            React.createElement("div", { id: "divsononeline" },
                                React.createElement(react_stars_1.default, { count: 5, color2: constants_1.starColor, edit: false, value: Number(props.original.averageRating) })),
                            React.createElement("div", { id: "divsononeline" },
                                "\u00A0(",
                                props.original.reviewsCount,
                                ")"))); },
                width: getColumnWidth(),
            };
        };
        _this.transformAggs = function (aggs) {
            return ramda_1.pipe(ramda_1.groupBy(ramda_1.prop('name')), ramda_1.map(ramda_1.head), ramda_1.map(ramda_1.prop('buckets')))(aggs);
        };
        _this.transformCrowdAggs = function (aggs) {
            return ramda_1.pipe(ramda_1.head, ramda_1.prop('buckets'), ramda_1.groupBy(ramda_1.prop('key')), ramda_1.map(function () { return []; })
            // @ts-ignore
            )(aggs);
        };
        _this.updateState = function () {
            if (!_this.props.showCards) {
                _this.setState({
                    tableWidth: document.getElementsByClassName('ReactTable')[0]
                        .clientWidth,
                });
            }
        };
        _this.cardPressed = function (card) {
            _this.props.onRowClick(card.nctId);
        };
        _this.mobileAndTabletcheck = function () {
            var check = false;
            (function (a) {
                // tslint:disable-next-line: max-line-length
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                    check = true;
                }
            })(navigator.userAgent || navigator.vendor);
            return check;
        };
        _this.handleOpenAgg = function (name, kind) {
            if (!_this.state.openedAgg) {
                _this.setState({ openedAgg: { name: name, kind: kind } });
                return;
            }
            // @ts-ignore
            var _a = _this.state.openedAgg, currentName = _a.name, currentKind = _a.kind;
            if (name === currentName && kind === currentKind) {
                _this.setState({ openedAgg: null });
                return;
            }
            _this.setState({ openedAgg: { name: name, kind: kind } });
        };
        _this.loadPaginator = function (recordsTotal, loading, page, pagesTotal) {
            if (_this.props.showCards) {
                return (React.createElement("div", { className: "right-align" },
                    React.createElement("div", null,
                        recordsTotal,
                        " results"),
                    React.createElement("div", null, recordsTotal > constants_1.MAX_WINDOW_SIZE
                        ? "(showing first " + constants_1.MAX_WINDOW_SIZE + ")"
                        : null)));
            }
            return (React.createElement("div", { className: "right-align" },
                page > 0 && !loading ? (React.createElement(FontAwesome, { className: "arrow-left", name: "arrow-left", style: { cursor: 'pointer', margin: '5px' }, onClick: function () {
                        return ramda_1.pipe(changePage, _this.props.onUpdateParams)(page - 1);
                    } })) : (React.createElement(FontAwesome, { className: "arrow-left", name: "arrow-left", style: { margin: '5px', color: 'gray' } })),
                "page",
                ' ',
                React.createElement("b", null,
                    loading ? (React.createElement("div", { id: "divsononeline" },
                        React.createElement(react_spinners_1.PulseLoader, { color: "#cccccc", size: 8 }))) : (Math.min(page + 1, pagesTotal) + "/" + pagesTotal),
                    ' '),
                page + 1 < pagesTotal && !loading ? (React.createElement(FontAwesome, { className: "arrow-right", name: "arrow-right", style: { cursor: 'pointer', margin: '5px' }, onClick: function () {
                        ramda_1.pipe(changePage, _this.props.onUpdateParams)(page + 1);
                    } })) : (React.createElement(FontAwesome, { className: "arrow-right", name: "arrow-right", style: { margin: '5px', color: 'gray' } })),
                React.createElement("div", null,
                    recordsTotal,
                    " results"),
                React.createElement("div", null, recordsTotal > constants_1.MAX_WINDOW_SIZE
                    ? "(showing first " + constants_1.MAX_WINDOW_SIZE + ")"
                    : null)));
        };
        _this.renderSearch = function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            var _b = _this.props.params, page = _b.page, pageSize = _b.pageSize, sorts = _b.sorts;
            if (error) {
                return React.createElement("div", null, error.message);
            }
            if (!data) {
                return null;
            }
            var totalRecords = ramda_1.pathOr(0, ['search', 'recordsTotal'], data);
            var totalPages = Math.min(Math.ceil(totalRecords / _this.props.params.pageSize), Math.ceil(constants_1.MAX_WINDOW_SIZE / _this.props.params.pageSize));
            _this.props.returnNumberOfPages(totalPages);
            var idSortedLens = ramda_1.lensProp('id');
            var camelizedSorts = ramda_1.map(ramda_1.over(idSortedLens, helpers_1.camelCase), sorts);
            // NOTE: If we upgrade typescript we can use data?.search?.studies;
            var searchData = ramda_1.path(['search', 'studies'], data);
            var tableWidth = 1175;
            //OWERA: high computational complexity here for little return
            searchData = Array.from(new Set(_this.props.previousSearchData.concat(searchData)));
            // Eliminates undefined items from the searchData array
            searchData = searchData.filter(function (el) {
                return el != null;
            });
            // Returns the new searchData to the SearchPage component
            _this.props.returnPreviousSearchData(searchData);
            var isMobile = _this.mobileAndTabletcheck();
            return (React.createElement(SiteProvider_1.default, null, function (site) {
                var pagesTotal = 1;
                var recordsTotal = 0;
                if (data &&
                    data.search &&
                    data.search.recordsTotal &&
                    _this.props.params.pageSize) {
                    recordsTotal = data.search.recordsTotal;
                    pagesTotal = Math.min(Math.ceil(data.search.recordsTotal / _this.props.params.pageSize), Math.ceil(constants_1.MAX_WINDOW_SIZE / _this.props.params.pageSize));
                }
                if (recordsTotal != _this.state.totalResults) {
                    _this.setState({
                        totalResults: recordsTotal,
                    });
                }
                var thisSiteView = site.siteViews.find(function (siteview) { return siteview.url == _this.props.siteViewUrl; }) || site.siteView;
                var showResults = thisSiteView.search.config.fields.showResults;
                var columns = ramda_1.map(function (x) { return _this.renderColumn(x, ''); }, site.siteView.search.fields);
                var totalWidth = columns.reduce(function (acc, col) { return acc + col.width; }, 0);
                var leftover = isMobile
                    ? tableWidth - totalWidth
                    : _this.state.tableWidth - totalWidth;
                var additionalWidth = leftover / columns.length;
                columns.map(function (x) { return (x.width += additionalWidth); }, columns);
                if (_this.props.showCards) {
                    return showResults ? (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                        React.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 'auto',
                            } }, _this.renderViewDropdown()),
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                            React.createElement(Cards_1.default, { columns: columns, data: searchData, onPress: _this.cardPressed, loading: loading })))) : null;
                }
                else {
                    return showResults ? (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                        React.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            } },
                            _this.loadPaginator(recordsTotal, loading, page, pagesTotal),
                            _this.renderViewDropdown()),
                        React.createElement(react_table_1.default, { ref: _this.searchTable, className: "-striped -highlight", columns: columns, manual: true, minRows: searchData[0] !== undefined ? 1 : 3, page: page, pageSize: pageSize, defaultSorted: camelizedSorts, onPageChange: ramda_1.pipe(changePage, _this.props.onUpdateParams), onPageSizeChange: ramda_1.pipe(changePageSize, _this.props.onUpdateParams), onSortedChange: ramda_1.pipe(changeSorted, _this.props.onUpdateParams), data: searchData, pages: totalPages, loading: loading, defaultPageSize: pageSize, getTdProps: _this.rowProps, defaultSortDesc: true, noDataText: 'No studies found' }))) : null;
                }
            }));
        };
        _this.renderViewDropdown = function () {
            var currentSiteView = _this.props.currentSiteView;
            return (React.createElement(SiteProvider_1.default, null, function (site) {
                if (site.siteViews.length > 0) {
                    return (React.createElement(react_bootstrap_1.ButtonGroup, null, currentSiteView.search.results.buttons.items.map(function (button, index) { return (React.createElement(react_bootstrap_1.Button, { href: "/search/" + button.target + "/" + _this.props.searchHash, key: button.target + index }, button.icon == 'card' ? React.createElement(Icons_1.CardIcon, null) : React.createElement(Icons_1.TableIcon, null))); })));
                }
            }));
        };
        _this.searchTable = React.createRef();
        _this.state = {
            tableWidth: 0,
            openedAgg: null,
            totalResults: 0,
            firstRender: true,
        };
        return _this;
    }
    SearchView.prototype.componentDidMount = function () {
        var defaultViewStyle = this.props.currentSiteView.search.results.type;
        var showResults = this.props.currentSiteView.search.config.fields
            .showResults;
        if (defaultViewStyle == 'table' && this.props.showCards == true) {
            this.toggledShowCards(false);
        }
        else if (defaultViewStyle == 'card' && this.props.showCards == false) {
            this.toggledShowCards(true);
        }
        if (!this.props.showCards && showResults) {
            this.setState({
                tableWidth: document.getElementsByClassName('ReactTable')[0]
                    .clientWidth,
            });
            window.addEventListener('resize', this.updateState);
        }
    };
    SearchView.prototype.componentDidUpdate = function () {
        if (!this.props.showCards) {
            if (document.getElementsByClassName('ReactTable')[0] &&
                this.state.tableWidth !==
                    document.getElementsByClassName('ReactTable')[0].clientWidth) {
                window.addEventListener('resize', this.updateState);
                this.setState({
                    tableWidth: document.getElementsByClassName('ReactTable')[0]
                        .clientWidth,
                });
            }
        }
        else {
            if (!this.props.showCards)
                window.removeEventListener('resize', this.updateState);
        }
        if (this.state.totalResults) {
        }
    };
    SearchView.prototype.componentWillUnmount = function () {
        if (!this.props.showCards)
            window.removeEventListener('resize', this.updateState);
    };
    SearchView.prototype.render = function () {
        var _this = this;
        return (React.createElement(SiteProvider_1.default, null, function (site) {
            var thisSiteView = site.siteViews.find(function (siteview) { return siteview.url == _this.props.siteViewUrl; }) || site.siteView;
            return (React.createElement(SearchWrapper, null,
                React.createElement(react_helmet_1.Helmet, null,
                    React.createElement("title", null, "Search"),
                    React.createElement("meta", { name: "description", content: "Description of SearchPage" })),
                React.createElement(react_bootstrap_1.Col, { md: 12 },
                    React.createElement(QueryComponent, { query: QUERY, variables: _this.props.params, onCompleted: function (data) {
                            if (data && data.search) {
                                _this.props.onAggsUpdate(_this.transformAggs(data.search.aggs || []), _this.transformCrowdAggs(data.crowdAggs.aggs || []));
                            }
                            var totalRecords = ramda_1.pathOr(0, ['search', 'recordsTotal'], data);
                            if (_this.state.firstRender) {
                                _this.setState({
                                    totalResults: totalRecords,
                                    firstRender: false,
                                }, function () {
                                    return _this.props.getTotalResults(_this.state.totalResults);
                                });
                            }
                        } }, function (_a) {
                        var data = _a.data, loading = _a.loading, error = _a.error;
                        return (React.createElement(SearchContainer, null, _this.renderSearch({ data: data, loading: loading, error: error })));
                    }))));
        }));
    };
    return SearchView;
}(React.Component));
exports.default = SearchView;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;


/***/ }),

/***/ "./app/containers/SearchPage/Types.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
exports.defaultPageSize = 25;
function flattenAggs(aggs) {
    if (!aggs)
        return [];
    var result = Object.keys(aggs)
        .filter(function (k) { return aggs[k].size > 0; })
        .map(function (k) { return ({ field: k, values: __spread(aggs[k].values()) }); });
    if (result.length === 0)
        return [];
    return result;
}
exports.flattenAggs = flattenAggs;
function expandAggs(aggs) {
    if (aggs) {
        return aggs.reduce(function (acc, agg) {
            acc[agg.field] = new Set(agg.values);
            return acc;
        }, {});
    }
    return null;
}
exports.expandAggs = expandAggs;
function maskAgg(aggs, toRemove) {
    return ramda_1.filter(function (a) { return a.field != toRemove; }, aggs);
}
exports.maskAgg = maskAgg;


/***/ }),

/***/ "./app/containers/SearchPage/components/Aggs.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var AggDropDown_1 = __webpack_require__("./app/containers/AggDropDown/index.tsx");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var getVisibleOptionsByName = ramda_1.compose(ramda_1.reduce(function (byName, _a) {
    var _b;
    var name = _a.name, visibleOptions = _a.visibleOptions;
    return (__assign(__assign({}, byName), (_b = {}, _b[name] = visibleOptions.values, _b)));
}, {}), ramda_1.pathOr([], ['search', 'crowdAggs', 'fields']));
var getVisibleOptionsByNamePresearch = ramda_1.compose(ramda_1.reduce(function (byName, _a) {
    var _b;
    var name = _a.name, visibleOptions = _a.visibleOptions;
    return (__assign(__assign({}, byName), (_b = {}, _b[name] = visibleOptions.values, _b)));
}, {}), ramda_1.pathOr([], ['search', 'presearch', 'crowdAggs', 'fields']));
var PresearchContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  max-height: 350px;\n  @media (max-width: 1250px) {\n    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n    max-height: 1500px;\n  }\n  @media (max-width: 768px) {\n    display: flex;\n    flex-direction: column;\n    max-height: 1500px;\n  }\n  span{\n    display: contents\n  }\n"], ["\n  display: flex;\n  max-height: 350px;\n  @media (max-width: 1250px) {\n    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n    max-height: 1500px;\n  }\n  @media (max-width: 768px) {\n    display: flex;\n    flex-direction: column;\n    max-height: 1500px;\n  }\n  span{\n    display: contents\n  }\n"])));
var Aggs = /** @class */ (function (_super) {
    __extends(Aggs, _super);
    function Aggs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getAggs = function (siteView) {
            return siteViewHelpers_1.displayFields(siteView.search.aggs.selected.kind, siteView.search.aggs.selected.values, siteView.search.aggs.fields).map(ramda_1.prop('name'));
        };
        _this.getCrowdAggs = function (site, crowdAggs) {
            var displayed = siteViewHelpers_1.displayFields(_this.props.currentSiteView.search.crowdAggs.selected.kind, _this.props.currentSiteView.search.crowdAggs.selected.values, _this.props.currentSiteView.search.crowdAggs.fields).map(ramda_1.prop('name'));
            return ramda_1.filter(function (x) { return crowdAggs.includes(x); }, displayed);
        };
        return _this;
    }
    Aggs.prototype.render = function () {
        var _this = this;
        var _a = this.props, aggs = _a.aggs, crowdAggs = _a.crowdAggs, filters = _a.filters, crowdFilters = _a.crowdFilters, addFilter = _a.addFilter, addFilters = _a.addFilters, removeFilter = _a.removeFilter, removeFilters = _a.removeFilters, searchParams = _a.searchParams, presearch = _a.presearch, currentSiteView = _a.currentSiteView, preSearchAggs = _a.preSearchAggs, preSearchCrowdAggs = _a.preSearchCrowdAggs;
        var crowdAggDropdowns = null;
        var crowdAggPresearch = null;
        var emptySet = new Set();
        if (preSearchCrowdAggs && crowdAggs) {
            var visibleOptionsByName_1 = getVisibleOptionsByNamePresearch(currentSiteView);
            crowdAggPresearch = (React.createElement("span", null, preSearchCrowdAggs.map(function (k) {
                return crowdAggs[k] ? (React.createElement(AggDropDown_1.default, { key: k, agg: k, selectedKeys: crowdFilters[k] || emptySet, buckets: preSearchCrowdAggs[k], isOpen: true, aggKind: "crowdAggs", addFilter: function (agg, item) { return addFilter(agg, item, true); }, addFilters: function (agg, items) {
                        return addFilters(agg, items, true);
                    }, removeFilter: function (agg, item) {
                        return removeFilter && removeFilter(agg, item, true);
                    }, removeFilters: function (agg, items) {
                        return removeFilters(agg, items, true);
                    }, searchParams: searchParams, resetSelectAll: _this.props.resetSelectAll, removeSelectAll: _this.props.removeSelectAll, presearch: true, currentSiteView: _this.props.currentSiteView, configType: "presearch", visibleOptions: visibleOptionsByName_1[k] })) : (React.createElement("div", { key: k, style: { display: 'flex', justifyContent: 'center' } },
                    React.createElement(react_spinners_1.BeatLoader, { key: "loader", color: "#fff" })));
            })));
        }
        if (presearch && preSearchAggs) {
            return (React.createElement(PresearchContainer, null,
                preSearchAggs.map(function (k) {
                    return aggs[k] ? (React.createElement(AggDropDown_1.default, { key: k, agg: k, selectedKeys: filters[k] || emptySet, buckets: aggs[k], isOpen: true, aggKind: "aggs", addFilter: addFilter, addFilters: addFilters, removeFilter: removeFilter, removeFilters: removeFilters, searchParams: searchParams, resetSelectAll: _this.props.resetSelectAll, removeSelectAll: _this.props.removeSelectAll, presearch: true, currentSiteView: _this.props.currentSiteView, configType: "presearch" })) : (React.createElement("div", { key: k, style: { display: 'flex', justifyContent: 'center' } },
                        React.createElement(react_spinners_1.BeatLoader, { key: "loader", color: "#fff" })));
                }),
                crowdAggPresearch));
        }
        if (!ramda_1.isEmpty(crowdAggs) && !ramda_1.isNil(crowdAggs)) {
            var visibleOptionsByName_2 = getVisibleOptionsByName(currentSiteView);
            crowdAggDropdowns = (React.createElement("div", null,
                React.createElement("h4", { style: {
                        color: 'white',
                        position: 'relative',
                        left: '20px',
                    } }, "Crowd Facets"),
                this.getCrowdAggs(currentSiteView, Object.keys(crowdAggs)).map(function (k) { return (React.createElement(AggDropDown_1.default, { key: k, agg: k, removeSelectAll: _this.props.removeSelectAll, selectedKeys: crowdFilters[k] || emptySet, buckets: crowdAggs[k], isOpen: _this.props.opened === k &&
                        _this.props.openedKind === 'crowdAggs', onOpen: _this.props.onOpen, aggKind: "crowdAggs", addFilter: function (agg, item) { return addFilter(agg, item, true); }, addFilters: function (agg, items) { return addFilters(agg, items, true); }, removeFilter: function (agg, item) {
                        return removeFilter && removeFilter(agg, item, true);
                    }, removeFilters: function (agg, items) {
                        return removeFilters(agg, items, true);
                    }, searchParams: searchParams, visibleOptions: visibleOptionsByName_2[k], currentSiteView: _this.props.currentSiteView, configType: "facetbar" })); })));
        }
        if (!ramda_1.isEmpty(aggs) && !ramda_1.isNil(aggs)) {
            return (React.createElement("div", null,
                React.createElement("div", null, this.getAggs(this.props.currentSiteView).map(function (k) {
                    return aggs[k] ? (React.createElement(AggDropDown_1.default, { key: k, agg: k, selectedKeys: filters[k] || emptySet, buckets: aggs[k], isOpen: _this.props.opened === k &&
                            _this.props.openedKind === 'aggs', onOpen: _this.props.onOpen, aggKind: "aggs", addFilter: addFilter, addFilters: addFilters, removeFilter: removeFilter, removeFilters: removeFilters, searchParams: searchParams, resetSelectAll: _this.props.resetSelectAll, removeSelectAll: _this.props.removeSelectAll, currentSiteView: _this.props.currentSiteView, configType: "facetbar" })) : null;
                })),
                crowdAggDropdowns));
        }
        return null;
    };
    return Aggs;
}(React.PureComponent));
exports.default = Aggs;
var templateObject_1;


/***/ }),

/***/ "./app/containers/SearchPage/components/Cards.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var Cards = /** @class */ (function (_super) {
    __extends(Cards, _super);
    function Cards(props) {
        var _this = _super.call(this, props) || this;
        _this.cardStyle = {
            borderWidth: 2,
            borderColor: 'rgb(85, 184, 141)',
            borderStyle: 'solid',
            borderRadius: '5px',
            background: '#ffffff',
            cursor: 'pointer',
            height: '100%',
            overflow: 'scroll',
        };
        _this.contentStyle = {
            padding: '10px',
        };
        _this.clicked = function (d) {
            _this.props.onPress(d);
        };
        _this.state = { loading: _this.props.loading };
        return _this;
    }
    Cards.prototype.componentDidUpdate = function () {
        if (this.state.loading !== this.props.loading) {
            this.setState({ loading: this.props.loading });
        }
    };
    Cards.prototype.render = function () {
        var _this = this;
        var listItems = this.props.data.map(function (d) {
            return (React.createElement(react_bootstrap_1.Col, { key: d.nctId, lg: 3, md: 4, sm: 6, xs: 12, style: { padding: '10px', height: '500px' }, onClick: function () { return _this.clicked(d); } },
                React.createElement("div", { style: _this.cardStyle }, _this.props.columns.map(function (c, index) {
                    if (index === 0) {
                        if (c.Cell) {
                            var props = {
                                original: {
                                    averageRating: d.averageRating,
                                    reviewsCount: d.reviewsCount,
                                },
                            };
                            return (React.createElement("div", { key: d.nctId + "_" + c.accessor, style: __assign({ width: '100%', backgroundColor: '#55b88d80' }, _this.contentStyle) },
                                React.createElement("div", { style: { width: '100%' } },
                                    React.createElement("label", { style: { marginBottom: '0px' } }, c.Header.props.field)),
                                React.createElement("div", { style: { width: '100%' } }, c.Cell(props))));
                        }
                        return (React.createElement("div", { key: d.nctId + "_" + c.accessor, style: __assign({ width: '100%', backgroundColor: '#55b88d80' }, _this.contentStyle) },
                            React.createElement("div", { style: { width: '100%' } },
                                React.createElement("label", { style: { marginBottom: '0px' } }, c.Header.props.field)),
                            React.createElement("div", { style: { width: '100%' } },
                                React.createElement("label", { style: { fontSize: '20px', marginBottom: '0px' } }, d[c.accessor]))));
                    }
                    if (c.Cell) {
                        var props = {
                            original: {
                                averageRating: d.averageRating,
                                reviewsCount: d.reviewsCount,
                            },
                        };
                        return (React.createElement("div", { key: d.nctId + "_" + c.accessor, style: __assign({ width: '100%' }, _this.contentStyle) },
                            React.createElement("div", { style: { width: '100%' } },
                                React.createElement("label", null, c.Header.props.field)),
                            React.createElement("div", { style: { width: '100%' } }, c.Cell(props))));
                    }
                    return (React.createElement("div", { key: d.nctId + "_" + c.accessor, style: __assign({ width: '100%' }, _this.contentStyle) },
                        React.createElement("div", { style: { width: '100%' } },
                            React.createElement("label", null, c.Header.props.field)),
                        React.createElement("div", { style: { width: '100%' } }, d[c.accessor])));
                }))));
        });
        return (React.createElement("div", null,
            React.createElement("div", { style: { width: '100%' } }, listItems),
            React.createElement(react_spinners_1.PulseLoader, { size: 15, color: '#aed7ca', loading: this.state.loading })));
    };
    return Cards;
}(React.Component));
exports.default = Cards;


/***/ }),

/***/ "./app/containers/SearchPage/components/CrumbsBar.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var graphql_tag_1 = __webpack_require__("./node_modules/graphql-tag/src/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var Autosuggest = __webpack_require__("./node_modules/react-autosuggest/dist/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var aggToField_1 = __webpack_require__("./app/utils/aggs/aggToField.ts");
var MultiCrumb_1 = __webpack_require__("./app/components/MultiCrumb/index.ts");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var AUTOSUGGEST_QUERY = graphql_tag_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query CrumbsSearchPageAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $aggFields: [String!]!\n    $crowdAggFields: [String!]!\n    $url: String\n  ) {\n    autocomplete(\n      aggFields: $aggFields\n      crowdAggFields: $crowdAggFields\n      url: $url\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        aggOptionsSort: [{ id: \"count\", desc: true }]\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      autocomplete {\n        name\n        isCrowd\n        results {\n          key\n          docCount\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n"], ["\n  query CrumbsSearchPageAggBucketsQuery(\n    $agg: String!\n    $q: SearchQueryInput!\n    $aggFilters: [AggFilterInput!]\n    $crowdAggFilters: [AggFilterInput!]\n    $page: Int!\n    $pageSize: Int!\n    $aggOptionsFilter: String\n    $aggFields: [String!]!\n    $crowdAggFields: [String!]!\n    $url: String\n  ) {\n    autocomplete(\n      aggFields: $aggFields\n      crowdAggFields: $crowdAggFields\n      url: $url\n      params: {\n        agg: $agg\n        q: $q\n        sorts: []\n        aggFilters: $aggFilters\n        crowdAggFilters: $crowdAggFilters\n        aggOptionsFilter: $aggOptionsFilter\n        aggOptionsSort: [{ id: \"count\", desc: true }]\n        page: $page\n        pageSize: $pageSize\n      }\n    ) {\n      autocomplete {\n        name\n        isCrowd\n        results {\n          key\n          docCount\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n"])));
var CrumbsBarStyleWrappper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  .crumbs-bar {\n    padding: 10px 30px;\n    border: solid white 1px;\n    background-color: #f2f2f2;\n    color: black;\n    margin-bottom: 1em;\n    width: 100%;\n\n    .container {\n      background: #d9deea;\n      border: 0px;\n      margin-top: 5px;\n      color: #394149;\n    }\n\n    i {\n      font-style: normal;\n      margin-right: 3px;\n      text-transform: capitalize;\n    }\n\n    span.label.label-default {\n      padding: 7px !important;\n      border-radius: 4px !important;\n      display: flex;\n      flex-wrap: wrap;\n    }\n\n    input.form-control {\n      border: 0px;\n      box-shadow: none;\n      margin-right: 10px;\n      margin-left: 10px;\n    }\n\n    span.label {\n      background: #55b88d;\n      padding: 5px;\n      font-size: 12px;\n      border-radius: 4px;\n      margin-right: 5px;\n      text-transform: capitalize;\n\n      span.fa-remove {\n        color: #fff !important;\n        opacity: 0.5;\n        margin-left: 5px !important;\n      }\n\n      span.fa-remove:hover {\n        opacity: 1;\n      }\n\n      b {\n        padding: 5px 1px 5px 1px;\n      }\n\n      b:last-of-type {\n        padding-right: 0px;\n      }\n    }\n  }\n  .right-align {\n    text-align: right;\n  }\n\n  div.row > div {\n    padding-left: 0px;\n  }\n\n  .searchInput {\n    padding-bottom: 10px;\n  }\n"], ["\n  .crumbs-bar {\n    padding: 10px 30px;\n    border: solid white 1px;\n    background-color: #f2f2f2;\n    color: black;\n    margin-bottom: 1em;\n    width: 100%;\n\n    .container {\n      background: #d9deea;\n      border: 0px;\n      margin-top: 5px;\n      color: #394149;\n    }\n\n    i {\n      font-style: normal;\n      margin-right: 3px;\n      text-transform: capitalize;\n    }\n\n    span.label.label-default {\n      padding: 7px !important;\n      border-radius: 4px !important;\n      display: flex;\n      flex-wrap: wrap;\n    }\n\n    input.form-control {\n      border: 0px;\n      box-shadow: none;\n      margin-right: 10px;\n      margin-left: 10px;\n    }\n\n    span.label {\n      background: #55b88d;\n      padding: 5px;\n      font-size: 12px;\n      border-radius: 4px;\n      margin-right: 5px;\n      text-transform: capitalize;\n\n      span.fa-remove {\n        color: #fff !important;\n        opacity: 0.5;\n        margin-left: 5px !important;\n      }\n\n      span.fa-remove:hover {\n        opacity: 1;\n      }\n\n      b {\n        padding: 5px 1px 5px 1px;\n      }\n\n      b:last-of-type {\n        padding-right: 0px;\n      }\n    }\n  }\n  .right-align {\n    text-align: right;\n  }\n\n  div.row > div {\n    padding-left: 0px;\n  }\n\n  .searchInput {\n    padding-bottom: 10px;\n  }\n"])));
var LoaderWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 20px 20px;\n\n  text-align: center;\n"], ["\n  margin: 20px 20px;\n\n  text-align: center;\n"])));
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var Crumb = function (_a) {
    var category = _a.category, value = _a.value, onClick = _a.onClick;
    return (React.createElement(react_bootstrap_1.Label, null,
        React.createElement("i", null,
            category,
            ":"),
        " ",
        React.createElement("b", null, value),
        React.createElement(FontAwesome, { className: "remove", name: "remove", style: { cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px' }, onClick: onClick })));
};
var CrumbsBar = /** @class */ (function (_super) {
    __extends(CrumbsBar, _super);
    function CrumbsBar(props) {
        var _this = _super.call(this, props) || this;
        _this.getAggFieldsFromSubsiteConfig = function (aggs) {
            var aggFields = [];
            if (aggs.length > 0) {
                aggs.map(function (i) {
                    if (i.autoSuggest) {
                        aggFields.push(i.name);
                    }
                });
            }
            if (aggFields.length <= 0) {
                aggFields = [
                    'browse_condition_mesh_terms',
                    'browse_interventions_mesh_terms',
                    'facility_countries',
                ];
            }
            return aggFields;
        };
        _this.getCrowdAggAutoSuggest = function () {
            var crowdAggFields = siteViewHelpers_1.displayFields(_this.props.currentSiteView.search.autoSuggest.crowdAggs.selected.kind, _this.props.currentSiteView.search.autoSuggest.crowdAggs.selected.values, _this.props.currentSiteView.search.autoSuggest.crowdAggs.fields);
            var fieldsToReturn = [];
            crowdAggFields.map(function (field) {
                fieldsToReturn.push(field.name);
            });
            return fieldsToReturn;
        };
        _this.getAutoSuggestFields = function () {
            var aggFields = siteViewHelpers_1.displayFields(_this.props.currentSiteView.search.autoSuggest.aggs.selected.kind, _this.props.currentSiteView.search.autoSuggest.aggs.selected.values, _this.props.currentSiteView.search.autoSuggest.aggs.fields);
            var fieldsToReturn = [];
            aggFields.map(function (field) {
                fieldsToReturn.push(field.name);
            });
            return fieldsToReturn;
        };
        _this.queryAutoSuggest = function (apolloClient) { return __awaiter(_this, void 0, void 0, function () {
            var searchTerm, _a, searchParams, data, currentSiteView, newParams, aggFields, crowdAggFields, query, variables, response, array;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchTerm = this.state.searchTerm;
                        _a = this.props, searchParams = _a.searchParams, data = _a.data, currentSiteView = _a.currentSiteView;
                        newParams = searchParams.q.map(function (i) {
                            return { children: [], key: i };
                        });
                        aggFields = this.getAutoSuggestFields();
                        crowdAggFields = this.getCrowdAggAutoSuggest();
                        query = AUTOSUGGEST_QUERY;
                        variables = {
                            agg: 'browse_condition_mesh_terms',
                            aggFilters: searchParams.aggFilters,
                            aggOptionsFilter: searchTerm,
                            crowdAggFilters: searchParams.crowdAggFilters,
                            page: 0,
                            pageSize: 5,
                            url: currentSiteView.url,
                            q: {
                                children: newParams,
                                key: 'AND',
                            },
                            sorts: [],
                            aggFields: aggFields,
                            crowdAggFields: crowdAggFields,
                        };
                        return [4 /*yield*/, apolloClient.query({
                                query: query,
                                variables: variables,
                            })];
                    case 1:
                        response = _b.sent();
                        array = response.data.autocomplete.autocomplete;
                        this.setState({
                            suggestions: array,
                            isSuggestionLoading: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onSuggestionsFetchRequested = function () {
            _this.setState({
                isSuggestionLoading: true,
            });
        };
        _this.onSuggestionsClearRequested = function () {
            _this.setState({
                suggestions: [],
                isSuggestionLoading: true,
            });
        };
        _this.getSuggestionValue = function (suggestion) {
            return suggestion.key;
        };
        _this.renderLoadingAutoSuggest = function (suggestions, searchTerm, apolloClient, showAutoSuggest) {
            if (showAutoSuggest == true) {
                return (React.createElement("div", { style: { display: 'inline' } },
                    React.createElement(react_bootstrap_1.FormGroup, null,
                        React.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'row',
                            } },
                            React.createElement("b", { style: {
                                    marginRight: '8px',
                                    marginTop: '4px',
                                } },
                                React.createElement(react_bootstrap_1.ControlLabel, null, "Search Within: "),
                                ' '),
                            React.createElement(Autosuggest, { multiSection: true, suggestions: suggestions, inputProps: {
                                    value: searchTerm,
                                    onChange: function (e, searchTerm) {
                                        return _this.onChange(e, searchTerm, apolloClient);
                                    },
                                }, renderSuggestion: _this.renderSuggestion, renderSuggestionsContainer: _this.renderSuggestionsContainer, renderSectionTitle: _this.renderSectionTitle, getSectionSuggestions: _this.getSectionSuggestions, onSuggestionSelected: _this.onSuggestionSelected, onSuggestionsFetchRequested: _this.onSuggestionsFetchRequested, onSuggestionsClearRequested: _this.onSuggestionsClearRequested, getSuggestionValue: _this.getSuggestionValue }))),
                    React.createElement(react_bootstrap_1.Button, { type: "submit" },
                        React.createElement(FontAwesome, { name: "search" }))));
            }
            else if (showAutoSuggest == false) {
                return null;
            }
        };
        _this.renderAutoSuggest = function (suggestions, searchTerm, apolloClient, showAutoSuggest) {
            if (showAutoSuggest == true) {
                return (React.createElement("div", { style: { display: 'inline' } },
                    React.createElement(react_bootstrap_1.FormGroup, null,
                        React.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'row',
                            } },
                            React.createElement("b", { style: {
                                    marginRight: '8px',
                                    marginTop: '4px',
                                } },
                                React.createElement(react_bootstrap_1.ControlLabel, null, "Search Within: "),
                                ' '),
                            React.createElement(Autosuggest, { multiSection: true, suggestions: suggestions, inputProps: {
                                    value: searchTerm,
                                    onChange: function (e, searchTerm) {
                                        return _this.onChange(e, searchTerm, apolloClient);
                                    },
                                }, renderSuggestion: _this.renderSuggestion, renderSectionTitle: _this.renderSectionTitle, getSectionSuggestions: _this.getSectionSuggestions, onSuggestionSelected: _this.onSuggestionSelected, onSuggestionsFetchRequested: _this.onSuggestionsFetchRequested, onSuggestionsClearRequested: _this.onSuggestionsClearRequested, getSuggestionValue: _this.getSuggestionValue }))),
                    React.createElement(react_bootstrap_1.Button, { type: "submit" },
                        React.createElement(FontAwesome, { name: "search" }))));
            }
            else if (showAutoSuggest == false) {
                return null;
            }
        };
        _this.renderSuggestion = function (suggestion) {
            var capitalized = _this.capitalize(suggestion.key);
            return React.createElement("span", null, capitalized + " (" + suggestion.docCount + ")");
        };
        _this.renderSuggestionsContainer = function () {
            var _a = _this.state, isSuggestionLoading = _a.isSuggestionLoading, suggestions = _a.suggestions;
            if (isSuggestionLoading == true) {
                if (suggestions.length == 0) {
                    return null;
                }
                else {
                    return (React.createElement("div", { className: "react-autosuggest__suggestions-container--open" },
                        React.createElement(LoaderWrapper, null,
                            React.createElement(react_spinners_1.BeatLoader, { color: "#cccccc" }))));
                }
            }
        };
        _this.getSectionSuggestions = function (section) {
            return section.results;
        };
        _this.capitalize = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        _this.onSuggestionSelected = function (event, _a) {
            var suggestion = _a.suggestion, suggestionValue = _a.suggestionValue, suggestionIndex = _a.suggestionIndex, sectionIndex = _a.sectionIndex, method = _a.method;
            var section = _this.state.suggestions[sectionIndex];
            if (section.isCrowd) {
                _this.props.addFilter(section.name, suggestionValue, true);
            }
            else
                _this.props.addFilter(section.name, suggestionValue);
        };
        _this.renderSectionTitle = function (section) {
            if (section.results.length > 0) {
                var newName = aggToField_1.default(section.name);
                newName = _this.capitalize(newName);
                return React.createElement("strong", null, newName);
            }
            else
                return null;
        };
        _this.onChange = function (e, _a, apolloClient) {
            var newValue = _a.newValue;
            _this.setState({
                searchTerm: newValue,
            }, function () {
                _this.queryAutoSuggest(apolloClient);
            });
        };
        _this.clearPrimarySearch = function () {
            _this.props.removeSearchTerm('', true);
        };
        _this.onSubmit = function (e) {
            e.preventDefault();
            _this.props.addSearchTerm(_this.state.searchTerm);
            _this.setState({ searchTerm: '' });
        };
        _this.toggleShowFilters = function () {
            _this.setState({ showFilters: !_this.state.showFilters });
        };
        var cardsColor = '';
        var tableColor = '';
        if (window.localStorage.getItem('showCards') === 'true') {
            cardsColor = '#55B88D';
            tableColor = '#90a79d';
        }
        else {
            cardsColor = '#90a79d';
            tableColor = '#55B88D';
        }
        _this.state = {
            searchTerm: '',
            suggestions: [],
            isSuggestionLoading: true,
            cardsBtnColor: cardsColor,
            tableBtnColor: tableColor,
            showFilters: true,
        };
        return _this;
    }
    CrumbsBar.prototype.mkCrumbs = function (searchParams, removeFilter) {
        var _loop_1, _a, _b, _i, key, _loop_2, _c, _d, _e, key, totalLength;
        var _this = this;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (!!ramda_1.isEmpty(searchParams.q)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (React.createElement(MultiCrumb_1.default, { key: "Search", category: "search", values: searchParams.q, onClick: function (term) { return _this.props.removeSearchTerm(term); } }))];
                case 1:
                    _j.sent();
                    _j.label = 2;
                case 2:
                    _loop_1 = function (key) {
                        var agg, cat;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    agg = searchParams.aggFilters[key];
                                    cat = aggToField_1.default(agg.field);
                                    return [4 /*yield*/, (React.createElement(MultiCrumb_1.default, { category: cat, values: agg.values, onClick: function (val) { return removeFilter(agg.field, val); }, key: cat + agg.values.join() }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = [];
                    for (_b in searchParams.aggFilters)
                        _a.push(_b);
                    _i = 0;
                    _j.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    key = _a[_i];
                    return [5 /*yield**/, _loop_1(key)];
                case 4:
                    _j.sent();
                    _j.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    _loop_2 = function (key) {
                        var agg, cat;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    agg = searchParams.crowdAggFilters[key];
                                    cat = aggToField_1.default(agg.field);
                                    return [4 /*yield*/, (React.createElement(MultiCrumb_1.default, { category: cat, values: agg.values, onClick: function (val) { return removeFilter(agg.field, val, true); }, key: cat + agg.values.join('') }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _c = [];
                    for (_d in searchParams.crowdAggFilters)
                        _c.push(_d);
                    _e = 0;
                    _j.label = 7;
                case 7:
                    if (!(_e < _c.length)) return [3 /*break*/, 10];
                    key = _c[_e];
                    return [5 /*yield**/, _loop_2(key)];
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9:
                    _e++;
                    return [3 /*break*/, 7];
                case 10:
                    totalLength = ((_f = searchParams.q) === null || _f === void 0 ? void 0 : _f.length) + ((_g = searchParams.crowdAggFilters) === null || _g === void 0 ? void 0 : _g.length) + ((_h = searchParams.aggFilters) === null || _h === void 0 ? void 0 : _h.length);
                    if (!(totalLength > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (React.createElement("span", null,
                            React.createElement(react_bootstrap_1.Button, { bsSize: "small", key: "defaul", onClick: this.props.onReset, style: { margin: '5px 0px 5px 10px' } }, "Default"),
                            React.createElement(react_bootstrap_1.Button, { bsSize: "small", key: "reset", onClick: this.props.onClear, style: { margin: '5px 0px 5px 10px' } }, "Clear")))];
                case 11:
                    _j.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, (React.createElement(react_bootstrap_1.Button, { bsSize: "small", key: "defaul", onClick: this.props.onReset, style: { margin: '5px 0px 5px 10px' } }, "Default"))];
                case 13:
                    _j.sent();
                    _j.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    };
    // loadPaginator = () => {
    //   return (
    //     <div className="right-align">
    //       <div>{this.props.recordsTotal} results</div>
    //       <div>
    //         {this.props.recordsTotal > MAX_WINDOW_SIZE
    //           ? `(showing first ${MAX_WINDOW_SIZE})`
    //           : null}
    //       </div>
    //     </div>
    //   );
    // };
    CrumbsBar.prototype.render = function () {
        var _this = this;
        var _a = this.state, searchTerm = _a.searchTerm, suggestions = _a.suggestions, isSuggestionLoading = _a.isSuggestionLoading;
        var _b = this.props, data = _b.data, siteViewUrl = _b.siteViewUrl;
        var thisSiteView = data.siteViews.find(function (siteview) { return siteview.url == siteViewUrl; }) ||
            data.siteView;
        var showCrumbsBar = thisSiteView.search.config.fields.showBreadCrumbs;
        var showAutoSuggest = thisSiteView.search.config.fields.showAutoSuggest;
        return (React.createElement(CrumbsBarStyleWrappper, null,
            React.createElement(react_apollo_1.ApolloConsumer, null, function (apolloClient) { return (React.createElement(react_bootstrap_1.Grid, { className: "crumbs-bar" },
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Col, { xs: 8, md: 8 },
                        React.createElement(react_bootstrap_1.Form, { inline: true, className: "searchInput", onSubmit: _this.onSubmit },
                            isSuggestionLoading
                                ? _this.renderLoadingAutoSuggest(suggestions, searchTerm, apolloClient, showAutoSuggest)
                                : _this.renderAutoSuggest(suggestions, searchTerm, apolloClient, showAutoSuggest),
                            "\u00A0",
                            React.createElement(CurrentUser_1.default, null, function (user) {
                                return user && user.roles.includes('admin') ? (React.createElement(react_bootstrap_1.Button, { onClick: _this.props.onBulkUpdate },
                                    "Bulk Update ",
                                    React.createElement(FontAwesome, { name: "truck" }))) : null;
                            }))),
                    React.createElement("div", null,
                        React.createElement("b", null, "Total Results:"),
                        " ",
                        _this.props.totalResults,
                        " studies")),
                showCrumbsBar ? (React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Col, { md: 12, style: {
                            padding: '10px 0px',
                            display: 'flex',
                            flexWrap: 'wrap',
                        } },
                        React.createElement(react_bootstrap_1.ListGroup, { style: {
                                display: 'flex',
                                flexWrap: 'wrap',
                                border: '1px solid #ddd',
                                borderRadius: ' 5px',
                                background: '#fff',
                                width: '100%',
                            } },
                            React.createElement(react_bootstrap_1.ListGroupItem, { style: {
                                    minWidth: '100%',
                                    backgroundColor: 'rgba(85, 184, 141, 0.5)',
                                }, onClick: _this.toggleShowFilters },
                                ' ',
                                "Filters:",
                                ' ',
                                _this.state.showFilters ? (React.createElement("b", null,
                                    React.createElement(FontAwesome, { className: "chevron-up", name: "chevron-up", style: {
                                            cursor: 'pointer',
                                            color: '#555',
                                            margin: '0 0 0 3px',
                                            float: 'right',
                                        } }))) : (React.createElement("b", null,
                                    React.createElement(FontAwesome, { className: "chevron-down", name: "chevron-down", style: {
                                            cursor: 'pointer',
                                            color: '#555',
                                            margin: '0 0 0 3px',
                                            float: 'right',
                                        } })))),
                            _this.state.showFilters
                                ? Array.from(_this.mkCrumbs(_this.props.searchParams, _this.props.removeFilter))
                                : null,
                            ' ')))) : null)); })));
    };
    return CrumbsBar;
}(React.Component));
exports.default = CrumbsBar;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/containers/SearchPage/components/Icons.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var CardIcon = function () { return (React.createElement("svg", { "aria-hidden": "true", focusable: "false", "data-prefix": "far", "data-icon": "th", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "svg-inline--fa fa-th fa-w-16 fa-lg", style: { width: '17px' } },
    React.createElement("path", { fill: "currentColor", d: "M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM197.3 72h117.3v96H197.3zm0 136h117.3v96H197.3zm-40 232H52c-6.6 0-12-5.4-12-12v-84h117.3zm0-136H40v-96h117.3zm0-136H40V84c0-6.6 5.4-12 12-12h105.3zm157.4 272H197.3v-96h117.3v96zm157.3 0H354.7v-96H472zm0-136H354.7v-96H472zm0-136H354.7V72H472z", className: "" }))); };
exports.CardIcon = CardIcon;
var TableIcon = function () { return (React.createElement("svg", { "aria-hidden": "true", focusable: "false", "data-prefix": "far", "data-icon": "th-list", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "svg-inline--fa fa-th-list fa-w-16 fa-lg", style: { width: '17px' } },
    React.createElement("path", { fill: "currentColor", d: "M0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80zm472 224H197.333v-96H472v96zm0 40v84c0 6.627-5.373 12-12 12H197.333v-96H472zM40 208h117.333v96H40v-96zm157.333-40V72H460c6.627 0 12 5.373 12 12v84H197.333zm-40-96v96H40V84c0-6.627 5.373-12 12-12h105.333zM40 344h117.333v96H52c-6.627 0-12-5.373-12-12v-84z", className: "" }))); };
exports.TableIcon = TableIcon;


/***/ }),

/***/ "./app/containers/SearchPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/SearchPage/SearchPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/SearchStudyPage/SearchStudyPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var StudyPage_1 = __webpack_require__("./app/containers/StudyPage/index.ts");
var react_spinners_1 = __webpack_require__("./node_modules/react-spinners/index.js");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SearchStudyPageQuery($hash: String!, $id: String!) {\n    search(searchHash: $hash) {\n      studyEdge(id: $id) {\n        nextId\n        prevId\n        firstId\n        lastId\n        isWorkflow\n        workflowName\n        study {\n          nctId\n        }\n        recordsTotal\n        counterIndex\n        firstId\n        lastId\n      }\n    }\n  }\n"], ["\n  query SearchStudyPageQuery($hash: String!, $id: String!) {\n    search(searchHash: $hash) {\n      studyEdge(id: $id) {\n        nextId\n        prevId\n        firstId\n        lastId\n        isWorkflow\n        workflowName\n        study {\n          nctId\n        }\n        recordsTotal\n        counterIndex\n        firstId\n        lastId\n      }\n    }\n  }\n"])));
var SearchStudyPageQueryComponent = /** @class */ (function (_super) {
    __extends(SearchStudyPageQueryComponent, _super);
    function SearchStudyPageQueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SearchStudyPageQueryComponent;
}(react_apollo_1.Query));
var StudySearchPage = /** @class */ (function (_super) {
    __extends(StudySearchPage, _super);
    function StudySearchPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StudySearchPage.prototype.render = function () {
        var _this = this;
        var variables = {
            hash: this.props.match.params.searchId,
            id: this.props.match.params.nctId,
        };
        return (React.createElement(SearchStudyPageQueryComponent, { query: QUERY, variables: variables }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            var prevLink = null;
            var nextLink = null;
            var firstLink = null;
            var lastLink = null;
            var isWorkflow = false;
            var recordsTotal = (React.createElement("div", { id: "divsononeline" },
                React.createElement(react_spinners_1.PulseLoader, { color: "#cccccc", size: 8 })));
            var counterIndex = null;
            var workflowName = null;
            if (data && !loading) {
                var prevId = ramda_1.path(['search', 'studyEdge', 'prevId'], data);
                var nextId = ramda_1.path(['search', 'studyEdge', 'nextId'], data);
                var firstId = ramda_1.path(['search', 'studyEdge', 'firstId'], data);
                var lastId = ramda_1.path(['search', 'studyEdge', 'lastId'], data);
                isWorkflow = ramda_1.pathOr(false, ['search', 'studyEdge', 'isWorkflow'], data);
                workflowName = ramda_1.pathOr(false, ['search', 'studyEdge', 'workflowName'], data);
                // counterIndex will remain null if it's >200 or whatever we set the max page size to
                counterIndex = ramda_1.path(['search', 'studyEdge', 'counterIndex'], data);
                recordsTotal =
                    counterIndex &&
                        ramda_1.pathOr(1, ['search', 'studyEdge', 'recordsTotal'], data);
                nextLink = nextId && "/search/" + variables.hash + "/study/" + nextId;
                prevLink = prevId && "/search/" + variables.hash + "/study/" + prevId;
                // just so that there isn't a first button if there isn't a prev button
                // likewise for the last button
                if (prevLink != null) {
                    firstLink =
                        firstId && "/search/" + variables.hash + "/study/" + firstId;
                }
                if (nextLink != null && counterIndex != null) {
                    lastLink = lastId && "/search/" + variables.hash + "/study/" + lastId;
                }
            }
            return (React.createElement(StudyPage_1.default, { history: _this.props.history, location: _this.props.location, match: _this.props.match, prevLink: prevLink, nextLink: nextLink, firstLink: firstLink, lastLink: lastLink, isWorkflow: isWorkflow, recordsTotal: recordsTotal, counterIndex: counterIndex, workflowName: workflowName }));
        }));
    };
    return StudySearchPage;
}(React.PureComponent));
exports.default = StudySearchPage;
var templateObject_1;


/***/ }),

/***/ "./app/containers/SearchStudyPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/SearchStudyPage/SearchStudyPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/SiteProvider/SiteProvider.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment SiteStudyExtendedGenericSectionFragment on SiteStudyExtendedGenericSection {\n    fields\n    hide\n    order\n    selected {\n      kind\n      values\n    }\n    title\n    name\n  }\n"], ["\n  fragment SiteStudyExtendedGenericSectionFragment on SiteStudyExtendedGenericSection {\n    fields\n    hide\n    order\n    selected {\n      kind\n      values\n    }\n    title\n    name\n  }\n"])));
var SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  fragment SiteStudyBasicGenericSectionFragment on SiteStudyBasicGenericSection {\n    hide\n    title\n    name\n  }\n"], ["\n  fragment SiteStudyBasicGenericSectionFragment on SiteStudyBasicGenericSection {\n    hide\n    title\n    name\n  }\n"])));
var SITE_STUDY_PAGE_FRAGMENT = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment SiteStudyPageFragment on SiteStudyPage {\n    allFields\n    basicSections {\n      ...SiteStudyBasicGenericSectionFragment\n    }\n    extendedSections {\n      ...SiteStudyExtendedGenericSectionFragment\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  fragment SiteStudyPageFragment on SiteStudyPage {\n    allFields\n    basicSections {\n      ...SiteStudyBasicGenericSectionFragment\n    }\n    extendedSections {\n      ...SiteStudyExtendedGenericSectionFragment\n    }\n  }\n\n  ", "\n  ", "\n"])), SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT, SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT);
var SITE_VIEW_FRAGMENT = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  fragment SiteViewFragment on SiteView {\n    name\n    url\n    id\n    default\n    description\n    study {\n      ...SiteStudyPageFragment\n    }\n    search {\n      autoSuggest {\n        aggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            autoSuggest\n            rank\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        crowdAggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            rank\n            autoSuggest\n          }\n          selected {\n            kind\n            values\n          }\n        }\n      }\n      results {\n        type\n        buttons {\n          items {\n            icon\n            target\n          }\n          location\n        }\n      }\n      presearch {\n        aggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            autoSuggest\n            rank\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        crowdAggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            rank\n            autoSuggest\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        button {\n          name\n          target\n        }\n        instructions\n      }\n\n      fields\n      config {\n        fields {\n          showPresearch\n          showFacetBar\n          showAutoSuggest\n          showBreadCrumbs\n          showResults\n        }\n      }\n\n      aggs {\n        fields {\n          name\n          display\n          preselected {\n            kind\n            values\n          }\n          visibleOptions {\n            kind\n            values\n          }\n          autoSuggest\n          rank\n        }\n        selected {\n          kind\n          values\n        }\n      }\n      crowdAggs {\n        fields {\n          name\n          display\n          preselected {\n            kind\n            values\n          }\n          visibleOptions {\n            kind\n            values\n          }\n          rank\n          autoSuggest\n        }\n        selected {\n          kind\n          values\n        }\n      }\n    }\n  }\n\n  ", "\n"], ["\n  fragment SiteViewFragment on SiteView {\n    name\n    url\n    id\n    default\n    description\n    study {\n      ...SiteStudyPageFragment\n    }\n    search {\n      autoSuggest {\n        aggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            autoSuggest\n            rank\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        crowdAggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            rank\n            autoSuggest\n          }\n          selected {\n            kind\n            values\n          }\n        }\n      }\n      results {\n        type\n        buttons {\n          items {\n            icon\n            target\n          }\n          location\n        }\n      }\n      presearch {\n        aggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            autoSuggest\n            rank\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        crowdAggs {\n          fields {\n            name\n            display\n            preselected {\n              kind\n              values\n            }\n            visibleOptions {\n              kind\n              values\n            }\n            rank\n            autoSuggest\n          }\n          selected {\n            kind\n            values\n          }\n        }\n        button {\n          name\n          target\n        }\n        instructions\n      }\n\n      fields\n      config {\n        fields {\n          showPresearch\n          showFacetBar\n          showAutoSuggest\n          showBreadCrumbs\n          showResults\n        }\n      }\n\n      aggs {\n        fields {\n          name\n          display\n          preselected {\n            kind\n            values\n          }\n          visibleOptions {\n            kind\n            values\n          }\n          autoSuggest\n          rank\n        }\n        selected {\n          kind\n          values\n        }\n      }\n      crowdAggs {\n        fields {\n          name\n          display\n          preselected {\n            kind\n            values\n          }\n          visibleOptions {\n            kind\n            values\n          }\n          rank\n          autoSuggest\n        }\n        selected {\n          kind\n          values\n        }\n      }\n    }\n  }\n\n  ", "\n"])), SITE_STUDY_PAGE_FRAGMENT);
var SITE_FRAGMENT = apollo_boost_1.gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  fragment SiteFragment on Site {\n    id\n    editors {\n      email\n    }\n    name\n    skipLanding\n    subdomain\n    owners {\n      email\n    }\n    siteView(url: $url) {\n      ...SiteViewFragment\n    }\n    siteViews {\n      ...SiteViewFragment\n    }\n  }\n\n  ", "\n"], ["\n  fragment SiteFragment on Site {\n    id\n    editors {\n      email\n    }\n    name\n    skipLanding\n    subdomain\n    owners {\n      email\n    }\n    siteView(url: $url) {\n      ...SiteViewFragment\n    }\n    siteViews {\n      ...SiteViewFragment\n    }\n  }\n\n  ", "\n"])), SITE_VIEW_FRAGMENT);
var QUERY = apollo_boost_1.gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  query SiteProviderQuery($id: Int, $url: String) {\n    site(id: $id) {\n      ...SiteFragment\n    }\n  }\n\n  ", "\n"], ["\n  query SiteProviderQuery($id: Int, $url: String) {\n    site(id: $id) {\n      ...SiteFragment\n    }\n  }\n\n  ", "\n"])), SITE_FRAGMENT);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var SiteProvider = /** @class */ (function (_super) {
    __extends(SiteProvider, _super);
    function SiteProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SiteProvider.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { id: this.props.id } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error, refetch = _a.refetch;
            console.log(data);
            if (loading || error)
                return null;
            return _this.props.children(data.site, refetch);
        }));
    };
    SiteProvider.fragment = SITE_FRAGMENT;
    SiteProvider.siteViewFragment = SITE_VIEW_FRAGMENT;
    return SiteProvider;
}(React.PureComponent));
exports.default = SiteProvider;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;


/***/ }),

/***/ "./app/containers/SiteProvider/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/SiteProvider.tsx");
exports.default = SiteProvider_1.default;


/***/ }),

/***/ "./app/containers/SitesEditPage/SitesEditPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var SiteForm_1 = __webpack_require__("./app/components/SiteForm/SiteForm.tsx");
var UpdateSiteMutation_1 = __webpack_require__("./app/mutations/UpdateSiteMutation.tsx");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var SitesEditPage = /** @class */ (function (_super) {
    __extends(SitesEditPage, _super);
    function SitesEditPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSave = function (updateSite) { return function (input) {
            updateSite({
                variables: {
                    input: __assign(__assign({}, input), { id: parseInt(_this.props.match.params.id, 10) })
                }
            });
        }; };
        return _this;
    }
    SitesEditPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(SiteProvider_1.default, { id: parseInt(this.props.match.params.id, 10) }, function (site, refetch) { return (React.createElement(UpdateSiteMutation_1.default, { onCompleted: function () { return _this.props.history.push("/sites"); } }, function (updateSite) { return (React.createElement(SiteForm_1.default, { match: _this.props.match, history: _this.props.history, location: _this.props.location, refresh: refetch, site: site, onSave: _this.handleSave(updateSite) })); })); }));
    };
    return SitesEditPage;
}(React.PureComponent));
exports.default = SitesEditPage;


/***/ }),

/***/ "./app/containers/SitesEditPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SitesEditPage_1 = __webpack_require__("./app/containers/SitesEditPage/SitesEditPage.tsx");
exports.default = SitesEditPage_1.default;


/***/ }),

/***/ "./app/containers/SitesNewPage/SitesNewPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var SiteForm_1 = __webpack_require__("./app/components/SiteForm/SiteForm.tsx");
var CreateSiteMutation_1 = __webpack_require__("./app/mutations/CreateSiteMutation.tsx");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var SitesNewPage = /** @class */ (function (_super) {
    __extends(SitesNewPage, _super);
    function SitesNewPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSave = function (createSite) { return function (input) {
            createSite({ variables: { input: input } }).then(function (res) {
                if (!res)
                    return;
                var id = ramda_1.pathOr(null, ['data', 'createSite', 'site', 'siteView', 'id'], res);
                if (!id)
                    return;
            });
        }; };
        return _this;
    }
    SitesNewPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(SiteProvider_1.default, { id: 0 }, function (site) { return (React.createElement(CreateSiteMutation_1.default, { onCompleted: function () { return _this.props.history.push('/sites'); } }, function (createSite) { return (React.createElement(SiteForm_1.default, { history: _this.props.history, location: _this.props.location, match: _this.props.match, site: __assign(__assign({}, site), { name: '' }), refresh: null, onSave: _this.handleSave(createSite) })); })); }));
    };
    return SitesNewPage;
}(React.PureComponent));
exports.default = SitesNewPage;


/***/ }),

/***/ "./app/containers/SitesNewPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SitesNewPage_1 = __webpack_require__("./app/containers/SitesNewPage/SitesNewPage.tsx");
exports.default = SitesNewPage_1.default;


/***/ }),

/***/ "./app/containers/SitesPage/SitesPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var SiteItem_1 = __webpack_require__("./app/components/SiteItem/index.ts");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var DeleteSiteMutations_1 = __webpack_require__("./app/mutations/DeleteSiteMutations.tsx");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SitesPageQuery {\n    me {\n      id\n      ownSites {\n        ...SiteItemFragment\n      }\n      editorSites {\n        ...SiteItemFragment\n      }\n    }\n  }\n\n  ", "\n"], ["\n  query SitesPageQuery {\n    me {\n      id\n      ownSites {\n        ...SiteItemFragment\n      }\n      editorSites {\n        ...SiteItemFragment\n      }\n    }\n  }\n\n  ", "\n"])), SiteItem_1.SiteItem.fragment);
var Container = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 20px;\n"], ["\n  padding: 20px;\n"])));
var ButtonsContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 20px;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 20px;\n"])));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var SitesPage = /** @class */ (function (_super) {
    __extends(SitesPage, _super);
    function SitesPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleCreateSite = function () {
            _this.props.history.push("/sites/new");
        };
        _this.handleSiteEdit = function (id) {
            _this.props.history.push("/sites/" + id + "/edit");
        };
        _this.handleSiteDelete = function (deleteSite) { return function (id) {
            deleteSite({ variables: { input: { id: id } } });
        }; };
        return _this;
    }
    SitesPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data || !data.me) {
                return null;
            }
            return (React.createElement(Container, null,
                React.createElement(CollapsiblePanel_1.default, { header: "My Sites" },
                    data.me.ownSites.length > 0 && (React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Name"),
                                React.createElement("th", null, "Subdomain"),
                                React.createElement("th", null))),
                        React.createElement("tbody", null,
                            React.createElement(DeleteSiteMutations_1.default, null, function (deleteSite) { return (React.createElement(React.Fragment, null, data.me.ownSites.map(function (site) { return (React.createElement(SiteItem_1.SiteItem, { site: site, key: site.subdomain, onEdit: _this.handleSiteEdit, onDelete: _this.handleSiteDelete(deleteSite) })); }))); })))),
                    data.me.ownSites.length === 0 && "No sites yet"),
                React.createElement(ButtonsContainer, null,
                    React.createElement(react_bootstrap_1.Button, { onClick: _this.handleCreateSite }, "Create Site")),
                React.createElement(CollapsiblePanel_1.default, { header: "Editable Sites" },
                    data.me.editorSites.length > 0 && (React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Name"),
                                React.createElement("th", null, "Subdomain"))),
                        React.createElement("tbody", null, data.me.editorSites.map(function (site) { return (React.createElement(SiteItem_1.SiteItem, { site: site, key: site.subdomain, onEdit: _this.handleSiteEdit })); })))),
                    data.me.editorSites.length === 0 && "No sites yet")));
        }));
    };
    return SitesPage;
}(React.PureComponent));
exports.default = SitesPage;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/containers/SitesPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SitesPage_1 = __webpack_require__("./app/containers/SitesPage/SitesPage.tsx");
exports.default = SitesPage_1.default;


/***/ }),

/***/ "./app/containers/StudyPage/StudyPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_stars_1 = __webpack_require__("./node_modules/react-stars/dist/react-stars.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var StudyPageSections_1 = __webpack_require__("./app/containers/StudyPage/components/StudyPageSections/index.ts");
var WikiPage_1 = __webpack_require__("./app/containers/WikiPage/index.ts");
var CrowdPage_1 = __webpack_require__("./app/containers/CrowdPage/index.ts");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var ReviewsPage_1 = __webpack_require__("./app/containers/ReviewsPage/index.ts");
var InterventionsPage_1 = __webpack_require__("./app/containers/InterventionsPage/index.ts");
var FacilitiesPage_1 = __webpack_require__("./app/containers/FacilitiesPage/index.ts");
var TagsPage_1 = __webpack_require__("./app/containers/TagsPage/index.ts");
var WorkflowPage_1 = __webpack_require__("./app/containers/WorkflowPage/index.tsx");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/index.ts");
var constants_1 = __webpack_require__("./app/utils/constants.ts");
var StudyPageCounter_1 = __webpack_require__("./app/containers/StudyPage/components/StudyPageCounter/index.ts");
var GenericStudySectionPage_1 = __webpack_require__("./app/containers/GenericStudySectionPage/index.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query StudyPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      nctId\n    }\n  }\n\n  ", "\n"], ["\n  query StudyPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      nctId\n    }\n  }\n\n  ", "\n"])), StudySummary_1.default.fragment);
// Prefetch all sections for study
var PREFETCH_QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query StudyPagePrefetchQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...WikiPageFragment\n        ...CrowdPageFragment\n        ...TagsPageFragment\n      }\n      reviews {\n        ...ReviewsPageFragment\n      }\n      interventions {\n        ...InterventionItemFragment\n      }\n      facilities {\n        ...FacilityFragment\n      }\n      nctId\n    }\n    me {\n      id\n      email\n      firstName\n      lastName\n      defaultQueryString\n    }\n  }\n\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n"], ["\n  query StudyPagePrefetchQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...WikiPageFragment\n        ...CrowdPageFragment\n        ...TagsPageFragment\n      }\n      reviews {\n        ...ReviewsPageFragment\n      }\n      interventions {\n        ...InterventionItemFragment\n      }\n      facilities {\n        ...FacilityFragment\n      }\n      nctId\n    }\n    me {\n      id\n      email\n      firstName\n      lastName\n      defaultQueryString\n    }\n  }\n\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, WikiPage_1.default.fragment, CrowdPage_1.default.fragment, ReviewsPage_1.default.fragment, InterventionsPage_1.default.fragment, FacilitiesPage_1.default.fragment, TagsPage_1.default.fragment);
var StudyWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""])));
var ReviewsWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n  margin-right: 10px;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n  margin-right: 10px;\n"])));
var MainContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n\n  .panel-heading {\n    background: #8bb7a4;\n    color: #fff;\n    padding: 15px;\n  }\n"], ["\n  background-color: #eaedf4;\n  min-height: 100vh;\n  padding-top: 20px;\n  padding-bottom: 20px;\n\n  .panel-heading {\n    background: #8bb7a4;\n    color: #fff;\n    padding: 15px;\n  }\n"])));
var SidebarContainer = styled_components_1.default(react_bootstrap_1.Col)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding-right: 0px;\n  color: rgba(255, 255, 255, 0.5);\n  padding-top: 10px !important;\n\n  li {\n    a {\n      font-size: 16px;\n      color: #bac5d0;\n      border-bottom: 1px solid #4c545e;\n      text-align: left;\n    }\n\n    a:hover {\n      background: #394149;\n      border-radius: 0px;\n      color: #fff;\n    }\n  }\n"], ["\n  padding-right: 0px;\n  color: rgba(255, 255, 255, 0.5);\n  padding-top: 10px !important;\n\n  li {\n    a {\n      font-size: 16px;\n      color: #bac5d0;\n      border-bottom: 1px solid #4c545e;\n      text-align: left;\n    }\n\n    a:hover {\n      background: #394149;\n      border-radius: 0px;\n      color: #fff;\n    }\n  }\n"])));
var StudySummaryContainer = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  .container {\n    div {\n      .panel-default {\n        background: none;\n        border: none;\n        borderradius: 0;\n        boxshadow: none;\n\n        .panel-heading {\n          cursor: pointer;\n          background: none;\n          color: black;\n          border-bottom: 2px solid;\n          border-color: #8bb7a4;\n        }\n      }\n    }\n  }\n"], ["\n  .container {\n    div {\n      .panel-default {\n        background: none;\n        border: none;\n        borderradius: 0;\n        boxshadow: none;\n\n        .panel-heading {\n          cursor: pointer;\n          background: none;\n          color: black;\n          border-bottom: 2px solid;\n          border-color: #8bb7a4;\n        }\n      }\n    }\n  }\n"])));
var BackButtonWrapper = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  width: 90%;\n  margin: auto;\n  padding: 5px;\n  padding-bottom: 10px;\n"], ["\n  width: 90%;\n  margin: auto;\n  padding: 5px;\n  padding-bottom: 10px;\n"])));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var PrefetchQueryComponent = /** @class */ (function (_super) {
    __extends(PrefetchQueryComponent, _super);
    function PrefetchQueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PrefetchQueryComponent;
}(react_apollo_1.Query));
var StudyPage = /** @class */ (function (_super) {
    __extends(StudyPage, _super);
    function StudyPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            triggerPrefetch: false,
            wikiToggleValue: true,
        };
        _this.getCurrentSectionPath = function (view) {
            var e_1, _a;
            var pathComponents = ramda_1.pipe(ramda_1.split('/'), ramda_1.reject(ramda_1.isEmpty), ramda_1.map(function (x) { return "/" + x; }))(helpers_1.trimPath(_this.props.location.pathname));
            try {
                for (var pathComponents_1 = __values(pathComponents), pathComponents_1_1 = pathComponents_1.next(); !pathComponents_1_1.done; pathComponents_1_1 = pathComponents_1.next()) {
                    var component = pathComponents_1_1.value;
                    if (ramda_1.findIndex(ramda_1.propEq('path', component), _this.getSections(view)) >= 0) {
                        return component;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (pathComponents_1_1 && !pathComponents_1_1.done && (_a = pathComponents_1.return)) _a.call(pathComponents_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return '/';
        };
        _this.getCurrentSectionFullPath = function (view) {
            var e_2, _a;
            var pathComponents = ramda_1.pipe(ramda_1.split('/'), ramda_1.reject(ramda_1.isEmpty), ramda_1.map(function (x) { return "/" + x; }))(helpers_1.trimPath(_this.props.location.pathname));
            try {
                for (var pathComponents_2 = __values(pathComponents), pathComponents_2_1 = pathComponents_2.next(); !pathComponents_2_1.done; pathComponents_2_1 = pathComponents_2.next()) {
                    var component = pathComponents_2_1.value;
                    if (ramda_1.findIndex(ramda_1.propEq('path', component), _this.getSections(view)) >= 0) {
                        var idx = ramda_1.findIndex(ramda_1.equals(component), pathComponents);
                        return ramda_1.pipe(ramda_1.drop(idx), 
                        // @ts-ignore
                        ramda_1.join(''))(pathComponents);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (pathComponents_2_1 && !pathComponents_2_1.done && (_a = pathComponents_2.return)) _a.call(pathComponents_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return '/';
        };
        _this.getSectionsForRoutes = function (view) {
            var sections = _this.getSections(view);
            var noWikiSections = ramda_1.reject(ramda_1.propEq('name', 'wiki'), sections);
            var wiki = ramda_1.find(ramda_1.propEq('name', 'wiki'), sections);
            var retVar = !wiki || wiki.hidden
                ? noWikiSections
                : __spread(noWikiSections, [wiki]);
            console.log('getSectionsForRoutes: ');
            console.log(retVar);
            // @ts-ignore
            return retVar;
        };
        _this.getComponent = function (name) {
            switch (name) {
                case 'wiki':
                    return WikiPage_1.default;
                case 'crowd':
                    return CrowdPage_1.default;
                case 'reviews':
                    return ReviewsPage_1.default;
                case 'facilities':
                    return FacilitiesPage_1.default;
                case 'tags':
                    return TagsPage_1.default;
                case 'interventions':
                    return InterventionsPage_1.default;
                default:
                    return GenericStudySectionPage_1.default;
            }
        };
        _this.getSections = function (view) {
            var _a = view.study, basicSectionsRaw = _a.basicSections, extendedSectionsRaw = _a.extendedSections;
            var basicSections = __spread([
                {
                    name: 'workflow',
                    path: '/workflow',
                    displayName: 'Workflow',
                    kind: 'basic',
                    component: WorkflowPage_1.default,
                    hidden: !_this.props.isWorkflow,
                    metaData: { hide: !_this.props.isWorkflow },
                }
            ], basicSectionsRaw.map(function (section) { return ({
                name: section.title.toLowerCase(),
                path: section.title.toLowerCase() === 'wiki'
                    ? '/'
                    : "/" + section.title.toLowerCase(),
                displayName: section.title,
                kind: 'basic',
                component: _this.getComponent(section.title.toLowerCase()),
                hidden: section.hide,
                metaData: section,
            }); }));
            var extendedSections = extendedSectionsRaw.map(function (section) { return ({
                name: section.title.toLowerCase(),
                path: "/" + section.title.toLowerCase(),
                displayName: section.title,
                kind: 'extended',
                order: section.order,
                component: _this.getComponent(section.title.toLowerCase()),
                hidden: section.hide,
                metaData: section,
            }); });
            // @ts-ignore
            var processedExtendedSections = ramda_1.sortBy(ramda_1.pipe(ramda_1.prop('order'), parseInt), extendedSections);
            var res = __spread(basicSections, processedExtendedSections);
            return ramda_1.reject(ramda_1.propEq('hidden', true), res);
        };
        _this.handleSelect = function (key) {
            _this.props.history.push("" + helpers_1.trimPath(_this.props.match.url) + key);
        };
        _this.handleLoaded = function () {
            if (!_this.state.triggerPrefetch) {
                _this.setState({ triggerPrefetch: true });
            }
        };
        _this.handleWikiToggleChange = function () {
            _this.setState({ wikiToggleValue: !_this.state.wikiToggleValue });
        };
        _this.handleNavButtonClick = function (link, view) { return function () {
            _this.props.history.push("" + helpers_1.trimPath(link) + _this.getCurrentSectionFullPath(view));
        }; };
        _this.renderNavButton = function (view, name, link) {
            if (link === undefined)
                return null;
            return (React.createElement(react_bootstrap_1.Button, { style: { marginRight: 10, marginBottom: 10 }, onClick: _this.handleNavButtonClick(link, view), disabled: link === null }, name));
        };
        _this.renderBackButton = function (view, name, link) {
            if (link === undefined)
                return null;
            return (React.createElement("div", { style: { paddingTop: '10px' } },
                React.createElement(react_bootstrap_1.Button, { style: { margin: 'auto', float: 'left' }, onClick: _this.handleNavButtonClick(link, view), disabled: link === null }, name)));
        };
        _this.renderReviewsSummary = function (data) {
            if (!data || !data.study) {
                return (React.createElement(ReviewsWrapper, { style: { float: 'left' } },
                    React.createElement("div", null,
                        React.createElement(react_stars_1.default, { count: 5, color2: constants_1.starColor, edit: false, value: 0 }),
                        React.createElement("div", null, '0 Reviews'))));
            }
            return (React.createElement(ReviewsWrapper, null,
                React.createElement("div", null,
                    React.createElement(react_stars_1.default, { count: 5, color2: constants_1.starColor, edit: false, value: data.study.averageRating }),
                    React.createElement("div", { style: {
                            color: 'rgba(255, 255, 255, 0.5)',
                        } }, data.study.reviewsCount + " Reviews"))));
        };
        return _this;
    }
    StudyPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(SiteProvider_1.default, null, function (site) { return (React.createElement(WorkflowsViewProvider_1.default, null, function (workflowsView) {
            var workflow = ramda_1.pipe(ramda_1.prop('workflows'), ramda_1.find(ramda_1.propEq('name', _this.props.workflowName)))(workflowsView);
            return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: _this.props.match.params.nctId }, fetchPolicy: "cache-only" }, function (_a) {
                var data = _a.data, loading = _a.loading, error = _a.error;
                return (React.createElement(StudyWrapper, null,
                    React.createElement(react_bootstrap_1.Row, { md: 12 },
                        React.createElement(BackButtonWrapper, null,
                            _this.renderBackButton(site.siteView, '⤺︎ Back', "/search/" + _this.props.match.params.searchId),
                            _this.renderReviewsSummary(data))),
                    React.createElement(react_bootstrap_1.Row, null,
                        React.createElement(MainContainer, { md: 12 },
                            React.createElement("div", { className: "container" },
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, '❮❮ First', _this.props.firstLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, '❮ Previous', _this.props.prevLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" },
                                    React.createElement(StudyPageCounter_1.default, { counter: _this.props.counterIndex, recordsTotal: _this.props.recordsTotal })),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, 'Next ❯', _this.props.nextLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, 'Last ❯❯', _this.props.lastLink))),
                            data && data.study && (React.createElement(StudySummaryContainer, null,
                                React.createElement(StudySummary_1.default, { study: data.study, workflow: workflow, workflowsView: workflowsView }))),
                            React.createElement("div", { className: "container" },
                                React.createElement(StudyPageSections_1.default, { history: _this.props.history, location: _this.props.location, nctId: _this.props.match.params.nctId, sections: _this.getSections(site.siteView), isWorkflow: _this.props.isWorkflow, nextLink: _this.props.nextLink, workflowName: _this.props.workflowName, onLoad: _this.handleLoaded, workflowsView: workflowsView, match: _this.props.match })),
                            React.createElement("div", { className: "container" },
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, '❮❮ First', _this.props.firstLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, '❮ Previous', _this.props.prevLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" },
                                    React.createElement(StudyPageCounter_1.default, { counter: _this.props.counterIndex, recordsTotal: _this.props.recordsTotal })),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, 'Next ❯', _this.props.nextLink)),
                                React.createElement("div", { id: "navbuttonsonstudypage" }, _this.renderNavButton(site.siteView, 'Last ❯❯', _this.props.lastLink))))),
                    _this.state.triggerPrefetch && (React.createElement(PrefetchQueryComponent, { query: PREFETCH_QUERY, variables: { nctId: _this.props.match.params.nctId } }, function () { return null; }))));
            }));
        })); }));
    };
    return StudyPage;
}(React.Component));
exports.default = StudyPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;


/***/ }),

/***/ "./app/containers/StudyPage/components/StudyPageCounter/StudyPageCounter.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
// interface StudyPageCounterState {
// }
var StudyPageCounterWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
// A simple counter that displays which study you're on on the study page, in the middle of the prev and next buttons
var StudyPageCounter = /** @class */ (function (_super) {
    __extends(StudyPageCounter, _super);
    function StudyPageCounter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StudyPageCounter.prototype.render = function () {
        return (
        // There is an error complaining about PropTypes, but none of the other components have this. Weird.
        React.createElement(StudyPageCounterWrapper, null,
            React.createElement("div", { id: "navbuttonsonstudypage" },
                this.props.counter === null ? null : 'record ',
                React.createElement("b", null,
                    this.props.counter,
                    typeof this.props.recordsTotal === 'number' ? '/' : null,
                    this.props.recordsTotal,
                    " \u00A0"))));
    };
    return StudyPageCounter;
}(React.PureComponent));
exports.default = StudyPageCounter;
var templateObject_1;


/***/ }),

/***/ "./app/containers/StudyPage/components/StudyPageCounter/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StudyPageCounter_1 = __webpack_require__("./app/containers/StudyPage/components/StudyPageCounter/StudyPageCounter.tsx");
exports.default = StudyPageCounter_1.default;


/***/ }),

/***/ "./app/containers/StudyPage/components/StudyPageSections/StudyPageSection.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var react_transition_group_1 = __webpack_require__("./node_modules/react-transition-group/index.js");
var StyleWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .panel-heading {\n    cursor: pointer;\n    ", "\n  }\n  .panel-toggle {\n    margin-top: 2px;\n  }\n"], ["\n  .panel-heading {\n    cursor: pointer;\n    ", "\n  }\n  .panel-toggle {\n    margin-top: 2px;\n  }\n"])), function (props) { return (props.dropdown ? '' : ''); });
var StyledPanelBody = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  transition: all 0.2s ease-in;\n  overflow: hidden;\n  max-height: 0;\n  &.transition-enter {\n    max-height: 0;\n  }\n  &.transition-enter-active {\n    max-height: 400px;\n  }\n  &.transition-enter-done {\n    max-height: none;\n  }\n  &.transition-exit {\n    max-height: 400px;\n  }\n  &.transition-exit-active {\n    max-height: 0;\n  }\n  &.transition-exit-done {\n    max-height: 0;\n  }\n"], ["\n  transition: all 0.2s ease-in;\n  overflow: hidden;\n  max-height: 0;\n  &.transition-enter {\n    max-height: 0;\n  }\n  &.transition-enter-active {\n    max-height: 400px;\n  }\n  &.transition-enter-done {\n    max-height: none;\n  }\n  &.transition-exit {\n    max-height: 400px;\n  }\n  &.transition-exit-active {\n    max-height: 0;\n  }\n  &.transition-exit-done {\n    max-height: 0;\n  }\n"])));
var StudyPageSection = /** @class */ (function (_super) {
    __extends(StudyPageSection, _super);
    function StudyPageSection(props) {
        var _this = _super.call(this, props) || this;
        _this.changeTab = function () {
            _this.setState({ visible: !_this.state.visible });
        };
        _this.state = { visible: !(window.innerWidth <= 500) };
        return _this;
    }
    StudyPageSection.prototype.render = function () {
        var _this = this;
        return (React.createElement(StyleWrapper, { dropdown: this.state.visible },
            React.createElement(react_bootstrap_1.Panel, { key: this.props.section.name, style: {
                    background: 'none',
                    border: 'none',
                    borderRadius: '0',
                    boxShadow: 'none',
                } },
                React.createElement(react_bootstrap_1.Panel.Heading, { style: {
                        cursor: 'pointer',
                        background: 'none',
                        color: 'black',
                        borderBottom: '2px solid',
                        borderColor: '#8bb7a4',
                    }, onClick: function () { return _this.changeTab(); } },
                    React.createElement(FontAwesome, { name: this.state.visible ? 'chevron-up' : 'chevron-down', className: "panel-toggle", style: { float: 'left', paddingRight: '5px' } }),
                    React.createElement(react_bootstrap_1.Panel.Title, { componentClass: "h3", style: { fontSize: '18px' } }, this.props.section.displayName)),
                React.createElement(react_transition_group_1.CSSTransition, { in: this.state.visible, timeout: 200, appear: true, classNames: "transition" }, function () {
                    var Component = _this.props.section.component;
                    return (React.createElement(StyledPanelBody, null,
                        React.createElement(react_bootstrap_1.Panel.Body, null,
                            React.createElement(Component, { nctId: _this.props.nctId, workflowName: _this.props.workflowName, metaData: _this.props.section.metaData, onLoaded: _this.props.onLoad, isWorkflow: _this.props.isWorkflow, history: _this.props.history, match: _this.props.match, location: _this.props.location }))));
                }))));
    };
    return StudyPageSection;
}(React.Component));
exports.default = StudyPageSection;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/StudyPage/components/StudyPageSections/StudyPageSections.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var StudyPageSection_1 = __webpack_require__("./app/containers/StudyPage/components/StudyPageSections/StudyPageSection.tsx");
var StudyPageSections = /** @class */ (function (_super) {
    __extends(StudyPageSections, _super);
    function StudyPageSections() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StudyPageSections.prototype.render = function () {
        var _this = this;
        var sectionsComponents = this.props.sections.map(function (section) {
            return (React.createElement(StudyPageSection_1.default, { key: section.name, nctId: _this.props.nctId, section: section, isWorkflow: _this.props.isWorkflow, nextLink: _this.props.nextLink, workflowName: _this.props.workflowName, onLoad: _this.props.onLoad, workflowsView: _this.props.workflowsView, history: _this.props.history, location: _this.props.location, match: _this.props.match }));
        });
        return React.createElement("div", null, sectionsComponents);
    };
    return StudyPageSections;
}(React.Component));
exports.default = StudyPageSections;


/***/ }),

/***/ "./app/containers/StudyPage/components/StudyPageSections/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StudyPageSections_1 = __webpack_require__("./app/containers/StudyPage/components/StudyPageSections/StudyPageSections.tsx");
exports.default = StudyPageSections_1.default;


/***/ }),

/***/ "./app/containers/StudyPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loadable = __webpack_require__("./node_modules/react-loadable/lib/index.js");
exports.default = Loadable({
    loader: function () { return Promise.resolve().then(function () { return __webpack_require__("./app/containers/StudyPage/StudyPage.tsx"); }); },
    loading: function () { return null; },
});


/***/ }),

/***/ "./app/containers/TagsPage/TagsPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var Edits_1 = __webpack_require__("./app/components/Edits/index.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var DeleteWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  cursor: pointer;\n  color: #cc1111;\n  margin-left: auto;\n"], ["\n  cursor: pointer;\n  color: #cc1111;\n  margin-left: auto;\n"])));
var AddWrapper = styled_components_1.default(react_bootstrap_1.Col)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var FRAGMENT = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment TagsPageFragment on WikiPage {\n    nctId\n    meta\n  }\n"], ["\n  fragment TagsPageFragment on WikiPage {\n    nctId\n    meta\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  query TagsPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...TagsPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query TagsPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...TagsPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, FRAGMENT);
var DELETE_TAG_MUTATION = apollo_boost_1.gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  mutation TagsPageDeleteWikiTagMutation($nctId: String!, $value: String!) {\n    deleteWikiTag(input: { nctId: $nctId, value: $value }) {\n      wikiPage {\n        ...TagsPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  mutation TagsPageDeleteWikiTagMutation($nctId: String!, $value: String!) {\n    deleteWikiTag(input: { nctId: $nctId, value: $value }) {\n      wikiPage {\n        ...TagsPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"])), FRAGMENT, Edits_1.default.fragment);
var ADD_TAG_MUTATION = apollo_boost_1.gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  mutation TagsPageAddWikiTagMutation($nctId: String!, $value: String!) {\n    upsertWikiTag(input: { nctId: $nctId, value: $value }) {\n      wikiPage {\n        ...TagsPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  mutation TagsPageAddWikiTagMutation($nctId: String!, $value: String!) {\n    upsertWikiTag(input: { nctId: $nctId, value: $value }) {\n      wikiPage {\n        ...TagsPageFragment\n        edits {\n          ...WikiPageEditFragment\n        }\n      }\n      errors\n    }\n  }\n\n  ", "\n  ", "\n"])), FRAGMENT, Edits_1.default.fragment);
var AddTagMutationComponent = /** @class */ (function (_super) {
    __extends(AddTagMutationComponent, _super);
    function AddTagMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AddTagMutationComponent;
}(react_apollo_1.Mutation));
var DeleteTagMutationComponent = /** @class */ (function (_super) {
    __extends(DeleteTagMutationComponent, _super);
    function DeleteTagMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeleteTagMutationComponent;
}(react_apollo_1.Mutation));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var TagsPage = /** @class */ (function (_super) {
    __extends(TagsPage, _super);
    function TagsPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            newTag: '',
        };
        _this.getTagsFromMeta = function (meta) {
            var tagsString = JSON.parse(meta).tags;
            return tagsString ? tagsString.split('|') : [];
        };
        _this.updateMetaTags = function (updater, meta) {
            var tags = _this.getTagsFromMeta(meta);
            var parsedMeta = JSON.parse(meta);
            parsedMeta.tags = updater(tags).join('|');
            return JSON.stringify(parsedMeta);
        };
        _this.handleAddTag = function (meta, addTag) { return function () {
            addTag({
                optimisticResponse: {
                    upsertWikiTag: {
                        __typename: 'UpsertWikiTagPayload',
                        wikiPage: {
                            __typename: 'WikiPage',
                            nctId: _this.props.nctId,
                            meta: _this.updateMetaTags(function (tags) {
                                return ramda_1.contains(_this.state.newTag, tags)
                                    ? tags
                                    : __spread(tags, [_this.state.newTag]);
                            }, meta),
                            edits: [],
                        },
                        errors: null,
                    },
                },
                variables: {
                    nctId: _this.props.nctId,
                    value: _this.state.newTag,
                },
            });
            _this.setState({ newTag: '' });
        }; };
        _this.handleDeleteTag = function (meta, deleteTag, value) { return function () {
            deleteTag({
                variables: { value: value, nctId: _this.props.nctId },
                optimisticResponse: {
                    deleteWikiTag: {
                        __typename: 'DeleteWikiTagPayload',
                        wikiPage: {
                            __typename: 'WikiPage',
                            nctId: _this.props.nctId,
                            meta: _this.updateMetaTags(ramda_1.reject(ramda_1.equals(value)), meta),
                            edits: [],
                        },
                        errors: null,
                    },
                },
            });
        }; };
        _this.handleNewTagChange = function (e) {
            _this.setState({ newTag: e.currentTarget.value });
        };
        _this.renderTag = function (meta, value, user) {
            return (React.createElement("tr", { key: value },
                React.createElement("td", { style: { display: 'flex' } },
                    React.createElement("b", null, value),
                    user && (React.createElement(DeleteTagMutationComponent, { mutation: DELETE_TAG_MUTATION }, function (deleteTag) { return (React.createElement(DeleteWrapper, null,
                        React.createElement(FontAwesome, { name: "remove", onClick: _this.handleDeleteTag(meta, deleteTag, value) }))); })))));
        };
        return _this;
    }
    TagsPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.nctId } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading ||
                error ||
                !data ||
                !data.study ||
                !data.study.wikiPage) {
                return null;
            }
            _this.props.onLoaded && _this.props.onLoaded();
            var meta = data.study.wikiPage.meta;
            var tags = _this.getTagsFromMeta(meta);
            return (React.createElement(CurrentUser_1.default, null, function (user) { return (React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 6 },
                    React.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, condensed: true },
                        React.createElement("tbody", null, tags.map(function (tag) { return _this.renderTag(meta, tag, user); })))),
                user && (React.createElement(AddWrapper, { md: 6 },
                    React.createElement(react_bootstrap_1.FormControl, { type: "text", placeholder: "Your Tag", value: _this.state.newTag, onChange: _this.handleNewTagChange }),
                    React.createElement(AddTagMutationComponent, { mutation: ADD_TAG_MUTATION }, function (addTag) { return (React.createElement(react_bootstrap_1.Button, { onClick: _this.handleAddTag(meta, addTag), style: { marginLeft: 10 } }, "Add Tag")); }))))); }));
        }));
    };
    TagsPage.fragment = FRAGMENT;
    return TagsPage;
}(React.Component));
exports.default = TagsPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;


/***/ }),

/***/ "./app/containers/TagsPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TagsPage_1 = __webpack_require__("./app/containers/TagsPage/TagsPage.tsx");
exports.default = TagsPage_1.default;


/***/ }),

/***/ "./app/containers/WikiPage/WikiPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_rte_yt_1 = __webpack_require__("./node_modules/react-rte-yt/dist/react-rte.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var StudySummary_1 = __webpack_require__("./app/components/StudySummary/index.ts");
var react_router_1 = __webpack_require__("./node_modules/react-router/index.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var FontAwesome = __webpack_require__("./node_modules/react-fontawesome/lib/index.js");
var LoadingPane_1 = __webpack_require__("./app/components/LoadingPane/index.ts");
var Error_1 = __webpack_require__("./app/components/Error/index.ts");
var Edits_1 = __webpack_require__("./app/components/Edits/index.ts");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment WikiPageFragment on WikiPage {\n    content\n    edits {\n      ...WikiPageEditFragment\n    }\n    nctId\n    meta\n  }\n\n  ", "\n"], ["\n  fragment WikiPageFragment on WikiPage {\n    content\n    edits {\n      ...WikiPageEditFragment\n    }\n    nctId\n    meta\n  }\n\n  ", "\n"])), Edits_1.default.fragment);
var QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query WikiPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...WikiPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"], ["\n  query WikiPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      ...StudySummaryFragment\n      wikiPage {\n        ...WikiPageFragment\n      }\n      nctId\n    }\n    me {\n      id\n    }\n  }\n\n  ", "\n  ", "\n"])), StudySummary_1.default.fragment, FRAGMENT);
var UPDATE_CONTENT_MUTATION = apollo_boost_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  mutation WikiPageUpdateContentMutation($nctId: String!, $content: String!) {\n    updateWikiContent(input: { nctId: $nctId, content: $content }) {\n      wikiPage {\n        ...WikiPageFragment\n      }\n      errors\n    }\n  }\n  ", "\n"], ["\n  mutation WikiPageUpdateContentMutation($nctId: String!, $content: String!) {\n    updateWikiContent(input: { nctId: $nctId, content: $content }) {\n      wikiPage {\n        ...WikiPageFragment\n      }\n      errors\n    }\n  }\n  ", "\n"])), FRAGMENT);
var Toolbar = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n  padding: 10px;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n  padding: 10px;\n"])));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var UpdateContentMutation = /** @class */ (function (_super) {
    __extends(UpdateContentMutation, _super);
    function UpdateContentMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateContentMutation;
}(react_apollo_1.Mutation));
var WikiPage = /** @class */ (function (_super) {
    __extends(WikiPage, _super);
    function WikiPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            editorState: 'rich',
            richEditorText: null,
            plainEditorText: null,
        };
        _this.editPath = function () { return helpers_1.trimPath(_this.props.match.path) + "/wiki/edit"; };
        _this.historyPath = function () { return helpers_1.trimPath(_this.props.match.path) + "/wiki/history"; };
        _this.getEditorText = function () {
            if (_this.state.editorState === 'rich') {
                return (_this.state.richEditorText &&
                    _this.state.richEditorText.toString('markdown'));
            }
            return _this.state.plainEditorText;
        };
        _this.handleLoaded = function () {
            _this.props.onLoaded && _this.props.onLoaded();
        };
        _this.handleHistory = function () {
            _this.props.history.push(helpers_1.trimPath(_this.props.match.url) + "/wiki/history");
        };
        _this.handleEdit = function () {
            _this.props.history.push(helpers_1.trimPath(_this.props.match.url) + "/wiki/edit");
        };
        _this.handleView = function () {
            _this.props.history.push(helpers_1.trimPath(_this.props.match.url));
        };
        _this.handlePreview = function () {
            if (_this.state.editorState === 'plain') {
                var text = _this.getEditorText() || '';
                _this.setState({
                    editorState: 'rich',
                    richEditorText: react_rte_yt_1.default.createValueFromString(text, 'markdown'),
                });
            }
            _this.props.history.push(_this.props.match.url);
        };
        _this.handleMarkdownToggle = function () {
            var text = _this.getEditorText() || '';
            var editorState = _this.state.editorState === 'rich' ? 'plain' : 'rich';
            _this.setState({
                editorState: editorState,
                plainEditorText: text,
                richEditorText: react_rte_yt_1.default.createValueFromString(text, 'markdown'),
            });
        };
        _this.handleEditSubmit = function (updateWikiContent) {
            updateWikiContent({
                variables: {
                    nctId: _this.props.nctId,
                    content: _this.getEditorText() || '',
                },
            });
        };
        _this.handleRichEditorChange = function (richEditorText) {
            _this.setState({ richEditorText: richEditorText });
        };
        _this.handlePlainEditorChange = function (e) {
            _this.setState({ plainEditorText: e.currentTarget.value });
        };
        _this.handleQueryCompleted = function (data) {
            var text = data && data.study && data.study.wikiPage && data.study.wikiPage.content;
            if (!text || text === _this.state.plainEditorText)
                return;
            _this.setState({
                plainEditorText: text,
                richEditorText: react_rte_yt_1.default.createValueFromString(text, 'markdown'),
            });
        };
        _this.renderMarkdownButton = function () {
            if (_this.state.editorState === 'plain') {
                return (React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handleMarkdownToggle },
                    "Editor ",
                    React.createElement(FontAwesome, { name: "newspaper-o" })));
            }
            return (React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handleMarkdownToggle },
                "Markdown ",
                React.createElement(FontAwesome, { name: "code" })));
        };
        _this.renderEditButton = function (isAuthenticated) {
            if (!isAuthenticated)
                return null;
            return (React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handleEdit, style: { marginLeft: '10px' } },
                "Edit ",
                React.createElement(FontAwesome, { name: "edit" })));
        };
        _this.renderSubmitButton = function (data, isAuthenticated) {
            if (!isAuthenticated)
                return false;
            var editorTextState = _this.getEditorText();
            var editorTextData = data.study && data.study.wikiPage && data.study.wikiPage.content;
            return (React.createElement(UpdateContentMutation, { mutation: UPDATE_CONTENT_MUTATION }, function (updateWikiContent) { return (React.createElement(react_bootstrap_1.Button, { onClick: function () { return _this.handleEditSubmit(updateWikiContent); }, disabled: editorTextState === editorTextData, style: { marginLeft: '10px' } },
                "Submit ",
                React.createElement(FontAwesome, { name: "pencil" }))); }));
        };
        _this.renderToolbar = function (data, user) {
            var isAuthenticated = user !== null;
            return (React.createElement(Toolbar, null,
                React.createElement(react_router_1.Switch, null,
                    React.createElement(react_router_1.Route, { path: _this.editPath(), render: function () { return (React.createElement(React.Fragment, null,
                            _this.renderMarkdownButton(),
                            ' ',
                            React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handlePreview, style: { marginLeft: '10px' } },
                                "Preview ",
                                React.createElement(FontAwesome, { name: "photo" })),
                            _this.renderSubmitButton(data, isAuthenticated))); } }),
                    React.createElement(react_router_1.Route, { path: _this.historyPath(), render: function () { return (React.createElement(React.Fragment, null,
                            _this.renderEditButton(isAuthenticated),
                            ' ',
                            React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handleView, style: { marginLeft: '10px' } },
                                "View ",
                                React.createElement(FontAwesome, { name: "photo" })))); } }),
                    React.createElement(react_router_1.Route, { render: function () { return (React.createElement(React.Fragment, null,
                            React.createElement(react_bootstrap_1.Button, { type: "button", onClick: _this.handleHistory },
                                "History ",
                                React.createElement(FontAwesome, { name: "history" })),
                            _this.renderEditButton(isAuthenticated),
                            _this.renderSubmitButton(data, isAuthenticated))); } }))));
        };
        _this.renderEditor = function (data) {
            if (!data || !data.study || !data.study.wikiPage)
                return null;
            var text = _this.getEditorText();
            if (text !== data.study.wikiPage.content && !text) {
                if (_this.state.editorState === 'rich') {
                    var richEditorText = react_rte_yt_1.default.createValueFromString(data.study.wikiPage.content || '', 'markdown');
                    _this.setState({ richEditorText: richEditorText });
                }
                else {
                    _this.setState({ plainEditorText: text });
                }
            }
            var readOnly = !_this.props.location.pathname.includes('/wiki/edit');
            if (_this.state.editorState === 'rich') {
                return (React.createElement(react_bootstrap_1.Panel, null,
                    React.createElement(react_bootstrap_1.Panel.Body, null,
                        React.createElement(react_rte_yt_1.default, { readOnly: readOnly, onChange: _this.handleRichEditorChange, value: _this.state.richEditorText || react_rte_yt_1.default.createEmptyValue() }))));
            }
            return (React.createElement(react_bootstrap_1.Panel, null,
                React.createElement(react_bootstrap_1.Panel.Body, null,
                    React.createElement(react_bootstrap_1.FormControl, { style: { minHeight: '200px' }, componentClass: "textarea", defaultValue: _this.state.plainEditorText || '', onChange: _this.handlePlainEditorChange }))));
        };
        _this.renderHistory = function (data) {
            return null;
        };
        return _this;
    }
    WikiPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY, variables: { nctId: this.props.nctId }, onCompleted: this.handleQueryCompleted }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading) {
                return React.createElement(LoadingPane_1.default, null);
            }
            if (error) {
                return React.createElement(Error_1.default, { message: error.message });
            }
            _this.handleLoaded();
            if (!data || !data.study)
                return null;
            return (React.createElement(CurrentUser_1.default, null, function (user) { return (React.createElement("div", null,
                React.createElement(react_router_1.Switch, null,
                    React.createElement(react_router_1.Route, { path: _this.historyPath(), render: function () { return (React.createElement(Edits_1.default, { edits: (data.study &&
                                data.study.wikiPage &&
                                data.study.wikiPage.edits) ||
                                [] })); } }),
                    React.createElement(react_router_1.Route, { render: function () { return _this.renderEditor(data); } })),
                _this.renderToolbar(data, user))); }));
        }));
    };
    WikiPage.fragment = FRAGMENT;
    return WikiPage;
}(React.Component));
exports.default = WikiPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;


/***/ }),

/***/ "./app/containers/WikiPage/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WikiPage_1 = __webpack_require__("./app/containers/WikiPage/WikiPage.tsx");
exports.default = WikiPage_1.default;


/***/ }),

/***/ "./app/containers/WorkflowPage/SuggestedLabels.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var CollapsiblePanel_1 = __webpack_require__("./app/components/CollapsiblePanel/index.ts");
var QUERY = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query SuggestedLabelsQuery($nctId: String!) {\n    search(params: { page: 0, q: { key: \"*\" } }) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    crowdAggFacets {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    study(nctId: $nctId) {\n      nctId\n      wikiPage {\n        nctId\n        meta\n      }\n    }\n  }\n"], ["\n  query SuggestedLabelsQuery($nctId: String!) {\n    search(params: { page: 0, q: { key: \"*\" } }) {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    crowdAggFacets {\n      aggs {\n        name\n        buckets {\n          key\n          docCount\n        }\n      }\n    }\n    study(nctId: $nctId) {\n      nctId\n      wikiPage {\n        nctId\n        meta\n      }\n    }\n  }\n"])));
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var LabelsContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n"])));
var StyledPanel = styled_components_1.default(CollapsiblePanel_1.default)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0 10px 10px 0;\n  width: 250px;\n  .panel-heading h3 {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    max-width: 200px;\n  }\n  .panel-body {\n    height: 150px !important;\n    overflow: scroll;\n  }\n"], ["\n  margin: 0 10px 10px 0;\n  width: 250px;\n  .panel-heading h3 {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    max-width: 200px;\n  }\n  .panel-body {\n    height: 150px !important;\n    overflow: scroll;\n  }\n"])));
var SuggestedLabels = /** @class */ (function (_super) {
    __extends(SuggestedLabels, _super);
    function SuggestedLabels() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSelect = function (key, value) { return function (e) {
            _this.props.onSelect(key, value, e.currentTarget.checked);
        }; };
        _this.renderAgg = function (key, values) {
            return (React.createElement(StyledPanel, { key: key, header: key, dropdown: true }, values.map(function (_a) {
                var _b = __read(_a, 2), value = _b[0], checked = _b[1];
                return (React.createElement(react_bootstrap_1.Checkbox, { key: value, checked: checked, disabled: _this.props.disabled, onChange: _this.handleSelect(key, value) }, value));
            })));
        };
        return _this;
    }
    SuggestedLabels.prototype.render = function () {
        var _this = this;
        if (!this.props.searchHash)
            return null;
        return (React.createElement(QueryComponent, { query: QUERY, variables: {
                nctId: this.props.nctId,
            } }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data)
                return null;
            var meta = {};
            try {
                meta = JSON.parse((data.study && data.study.wikiPage && data.study.wikiPage.meta) ||
                    '{}');
            }
            catch (e) {
                console.log("Error parsing meta: " + meta);
            }
            var labels = ramda_1.pipe(ramda_1.keys, ramda_1.map(function (key) { return [key, meta[key].split('|')]; }), 
            // @ts-ignore
            ramda_1.fromPairs)(meta);
            var aggs = ramda_1.pipe(ramda_1.pathOr([], ['crowdAggFacets', 'aggs']), 
            // filter((agg: any) => agg.name.startsWith('fm_')),
            ramda_1.map(function (agg) {
                var name = agg.name.substring(3, 1000);
                var existingLabels = labels[name] || [];
                return [
                    name,
                    agg.buckets.map(function (bucket) { return [
                        bucket.key,
                        existingLabels.includes(bucket.key),
                    ]; }),
                ];
            }), 
            // @ts-ignore
            ramda_1.fromPairs)(data);
            var aggNames = ramda_1.pipe(ramda_1.keys, ramda_1.filter(function (name) { return _this.props.allowedSuggestedLabels.includes(name); }))(aggs);
            return (React.createElement(LabelsContainer, null, aggNames.map(function (key) { return _this.renderAgg(key, aggs[key]); })));
        }));
    };
    return SuggestedLabels;
}(React.PureComponent));
exports.default = SuggestedLabels;
var templateObject_1, templateObject_2, templateObject_3;


/***/ }),

/***/ "./app/containers/WorkflowPage/WikiSections.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var UpdateWikiSectionsMutation_1 = __webpack_require__("./app/mutations/UpdateWikiSectionsMutation.tsx");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var ButtonContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var StyledPanel = styled_components_1.default(react_bootstrap_1.Panel)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 16px;\n"], ["\n  padding: 16px;\n"])));
var WikiSections = /** @class */ (function (_super) {
    __extends(WikiSections, _super);
    function WikiSections() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { updatedSections: {}, prevSections: null };
        _this.handleSectionChange = function (name) { return function (e) {
            var _a;
            _this.setState({
                updatedSections: __assign(__assign({}, _this.state.updatedSections), (_a = {}, _a[name] = e.currentTarget.value, _a)),
            });
        }; };
        _this.handleSectionsSave = function (updateWikiSections) { return function () {
            updateWikiSections({
                variables: {
                    input: {
                        nctId: _this.props.nctId,
                        sections: ramda_1.keys(_this.state.updatedSections).map(function (key) { return ({
                            name: key,
                            content: _this.state.updatedSections[key],
                        }); }),
                    },
                },
            }).then(function () { return _this.setState({ updatedSections: {} }); });
        }; };
        _this.renderWikiSection = function (section, sections, disabled) {
            var value = _this.state.updatedSections[section.name];
            if (ramda_1.isNil(value)) {
                var foundSection = ramda_1.find(ramda_1.propEq('name', section.name), sections);
                value = foundSection.content;
            }
            return (React.createElement(React.Fragment, { key: section.name },
                React.createElement("h3", null, section.name),
                !disabled && (React.createElement(react_bootstrap_1.FormControl, { componentClass: "textarea", placeholder: "Add a description", rows: 5, value: value, onChange: _this.handleSectionChange(section.name) })),
                disabled && React.createElement(StyledPanel, null, value)));
        };
        return _this;
    }
    WikiSections.prototype.render = function () {
        var _this = this;
        if (this.props.sections.length == 0)
            return null;
        return (React.createElement(React.Fragment, null,
            ramda_1.addIndex(ramda_1.map)(function (section, _, sections) {
                return _this.renderWikiSection(section, sections, _this.props.disabled);
            })(this.props.sections),
            !this.props.disabled && (React.createElement(ButtonContainer, null,
                React.createElement(UpdateWikiSectionsMutation_1.default, null, function (mutate) { return (React.createElement(react_bootstrap_1.Button, { onClick: _this.handleSectionsSave(mutate), style: { marginTop: 15 }, disabled: ramda_1.isEmpty(_this.state.updatedSections) }, "Save Sections")); })))));
    };
    return WikiSections;
}(React.Component));
exports.default = WikiSections;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/WorkflowPage/WorkflowPage.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_rte_yt_1 = __webpack_require__("./node_modules/react-rte-yt/dist/react-rte.js");
var ReviewForm_1 = __webpack_require__("./app/containers/ReviewForm/index.ts");
var CrowdPage_1 = __webpack_require__("./app/containers/CrowdPage/index.ts");
var SuggestedLabels_1 = __webpack_require__("./app/containers/WorkflowPage/SuggestedLabels.tsx");
var graphql_tag_1 = __webpack_require__("./node_modules/graphql-tag/src/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var helpers_1 = __webpack_require__("./app/utils/helpers.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var CurrentUser_1 = __webpack_require__("./app/containers/CurrentUser/index.ts");
var WikiSections_1 = __webpack_require__("./app/containers/WorkflowPage/WikiSections.tsx");
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/index.ts");
var siteViewHelpers_1 = __webpack_require__("./app/utils/siteViewHelpers.ts");
var QUERY = graphql_tag_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query WorkflowPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      wikiPage {\n        nctId\n        meta\n        content\n      }\n      nctId\n    }\n  }\n"], ["\n  query WorkflowPageQuery($nctId: String!) {\n    study(nctId: $nctId) {\n      wikiPage {\n        nctId\n        meta\n        content\n      }\n      nctId\n    }\n  }\n"])));
var WorkflowPageQueryComponent = /** @class */ (function (_super) {
    __extends(WorkflowPageQueryComponent, _super);
    function WorkflowPageQueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WorkflowPageQueryComponent;
}(react_apollo_1.Query));
var ButtonContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var RichTextEditorContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 16px;\n"], ["\n  margin-bottom: 16px;\n"])));
var StyledPanel = styled_components_1.default(react_bootstrap_1.Panel)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 16px;\n"], ["\n  padding: 16px;\n"])));
var WorkflowPage = /** @class */ (function (_super) {
    __extends(WorkflowPage, _super);
    function WorkflowPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            selectedLabel: null,
            review: null,
            editReviewMode: true,
            updatedSections: {},
        };
        _this.reviewFormRef = null;
        _this.handleSelect = function (meta, upsertLabel, deleteLabel) { return function (key, value, checked) {
            if (checked) {
                CrowdPage_1.default.addLabel(key, value, meta, _this.props.match.params.nctId, upsertLabel);
            }
            else {
                CrowdPage_1.default.deleteLabel(key, value, meta, _this.props.match.params.nctId, upsertLabel, deleteLabel);
            }
        }; };
        _this.handleReviewSave = function () {
            _this.reviewFormRef && _this.reviewFormRef.submitReview();
        };
        _this.handleReviewEdit = function () {
            _this.setState({ editReviewMode: true });
        };
        _this.handleReviewAfterSave = function (review) {
            _this.setState({ review: review, editReviewMode: false });
        };
        _this.renderReview = function (hideMeta) {
            if (_this.state.editReviewMode) {
                return (React.createElement(ReviewForm_1.default, { ref: function (ref) {
                        _this.reviewFormRef = ref;
                    }, nctId: _this.props.match.params.nctId, hideSaveButton: true, hideMeta: hideMeta, review: _this.state.review || undefined, afterSave: _this.handleReviewAfterSave }));
            }
            var content = (_this.state.review && _this.state.review.content) || '';
            return (React.createElement(React.Fragment, null,
                React.createElement(RichTextEditorContainer, null,
                    React.createElement(react_rte_yt_1.default, { readOnly: true, value: react_rte_yt_1.EditorValue.createFromString(content, 'markdown') })),
                React.createElement(ButtonContainer, null,
                    React.createElement(react_bootstrap_1.Button, { onClick: _this.handleReviewEdit }, "Edit"))));
        };
        return _this;
    }
    WorkflowPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(WorkflowsViewProvider_1.default, null, function (workflowsView) { return (React.createElement(CurrentUser_1.default, null, function (user) {
            var workflow = ramda_1.pipe(ramda_1.prop('workflows'), ramda_1.find(ramda_1.propEq('name', _this.props.workflowName)))(workflowsView);
            var allowedWikiSections = siteViewHelpers_1.displayFields(workflow.wikiSectionsFilter.kind, workflow.wikiSectionsFilter.values, workflow.allWikiSections.map(function (name) { return ({ name: name, rank: null }); })).map(ramda_1.prop('name'));
            var allowedSuggestedLabels = siteViewHelpers_1.displayFields(workflow.suggestedLabelsFilter.kind, workflow.suggestedLabelsFilter.values, workflow.allSuggestedLabels.map(function (name) { return ({ name: name, rank: null }); })).map(ramda_1.prop('name'));
            return (React.createElement("div", null,
                user && !workflow.hideReviews && (React.createElement(React.Fragment, null,
                    React.createElement("h3", null,
                        _this.state.editReviewMode
                            ? 'Add Review'
                            : 'Added Review',
                        ' '),
                    React.createElement(StyledPanel, null, _this.renderReview(workflow.disableAddRating)),
                    React.createElement(ButtonContainer, null,
                        React.createElement(react_bootstrap_1.Button, { disabled: !_this.state.editReviewMode, onClick: _this.handleReviewSave, style: { marginTop: 15 } }, "Save Review")))),
                React.createElement("h3", null, "Crowd Labels"),
                React.createElement(WorkflowPageQueryComponent, { query: QUERY, variables: { nctId: _this.props.match.params.nctId } }, function (_a) {
                    var data = _a.data, loading = _a.loading, error = _a.error;
                    var sections = ramda_1.pipe(ramda_1.drop(1), ramda_1.filter(function (section) {
                        return allowedWikiSections.includes(section.name);
                    }))(helpers_1.extractWikiSections((data &&
                        data.study &&
                        data.study.wikiPage &&
                        data.study.wikiPage.content) ||
                        ''));
                    return (React.createElement(React.Fragment, null,
                        React.createElement(CrowdPage_1.UpsertMutationComponent, { mutation: CrowdPage_1.UPSERT_LABEL_MUTATION }, function (upsertMutation) { return (React.createElement(CrowdPage_1.DeleteMutationComponent, { mutation: CrowdPage_1.DELETE_LABEL_MUTATION }, function (deleteMutation) { return (React.createElement(StyledPanel, null,
                            React.createElement(SuggestedLabels_1.default, { nctId: _this.props.match.params.nctId, searchHash: _this.props.match.params.searchId || null, onSelect: _this.handleSelect((data &&
                                    data.study &&
                                    data.study.wikiPage &&
                                    JSON.parse(data.study.wikiPage.meta)) ||
                                    {}, upsertMutation, deleteMutation), allowedSuggestedLabels: allowedSuggestedLabels, disabled: !user }))); })); }),
                        React.createElement(CrowdPage_1.default, __assign({}, _this.props, { nctId: _this.props.nctId, workflowView: true, forceAddLabel: _this.state.selectedLabel || undefined })),
                        React.createElement(WikiSections_1.default, { sections: sections, disabled: !user, nctId: _this.props.match.params.nctId, key: _this.props.match.params.nctId })));
                })));
        })); }));
    };
    return WorkflowPage;
}(React.Component));
exports.default = WorkflowPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;


/***/ }),

/***/ "./app/containers/WorkflowPage/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WorkflowPage_1 = __webpack_require__("./app/containers/WorkflowPage/WorkflowPage.tsx");
exports.default = WorkflowPage_1.default;


/***/ }),

/***/ "./app/containers/WorkflowsViewProvider/WorkflowsViewProvider.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var FRAGMENT = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment WorkflowsViewFragment on WorkflowsView {\n    id\n    workflows {\n      ...WorkflowConfigFragment\n    }\n  }\n\n  fragment WorkflowConfigFragment on WorkflowConfig {\n    allSuggestedLabels\n    allWikiSections\n    allSummaryFields\n    disableAddRating\n    hideReviews\n    name\n    suggestedLabelsFilter {\n      kind\n      values\n    }\n    wikiSectionsFilter {\n      kind\n      values\n    }\n    summaryFieldsFilter {\n      kind\n      values\n    }\n  }\n"], ["\n  fragment WorkflowsViewFragment on WorkflowsView {\n    id\n    workflows {\n      ...WorkflowConfigFragment\n    }\n  }\n\n  fragment WorkflowConfigFragment on WorkflowConfig {\n    allSuggestedLabels\n    allWikiSections\n    allSummaryFields\n    disableAddRating\n    hideReviews\n    name\n    suggestedLabelsFilter {\n      kind\n      values\n    }\n    wikiSectionsFilter {\n      kind\n      values\n    }\n    summaryFieldsFilter {\n      kind\n      values\n    }\n  }\n"])));
var QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query WorkflowsViewProviderQuery {\n    workflowsView {\n      ...WorkflowsViewFragment\n    }\n  }\n\n  ", "\n"], ["\n  query WorkflowsViewProviderQuery {\n    workflowsView {\n      ...WorkflowsViewFragment\n    }\n  }\n\n  ", "\n"])), FRAGMENT);
var QueryComponent = /** @class */ (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueryComponent;
}(react_apollo_1.Query));
var WorkflowsViewProvider = /** @class */ (function (_super) {
    __extends(WorkflowsViewProvider, _super);
    function WorkflowsViewProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkflowsViewProvider.prototype.render = function () {
        var _this = this;
        return (React.createElement(QueryComponent, { query: QUERY }, function (_a) {
            var data = _a.data, loading = _a.loading, error = _a.error;
            if (loading || error || !data)
                return null;
            return _this.props.children(data.workflowsView);
        }));
    };
    WorkflowsViewProvider.fragment = FRAGMENT;
    return WorkflowsViewProvider;
}(React.PureComponent));
exports.default = WorkflowsViewProvider;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/containers/WorkflowsViewProvider/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/WorkflowsViewProvider.tsx");
exports.default = WorkflowsViewProvider_1.default;


/***/ }),

/***/ "./app/global-styles.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
/* eslint no-unused-expressions: 0 */
styled_components_1.injectGlobal(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\nbody {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\nbody.fontLoaded {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\np,\nlabel {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  line-height: 1.5em;\n}\n.btn, button, .-btn{\n  border: 0px;\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n  border-radius: 4px;\n}\n.btn, .-btn{\n  background: #55B88D;\n  color: #fff !important;\n}\ndiv.crumbs-bar span.label {\n  background: #55B88D !important;\n  color: #fff !important;\n}\ndiv.rt-tbody div.rt-tr:hover{\n  background: #55B88D !important;\n  color: #fff !important;\n}\n/* Pagination */\ndiv.pagination-bottom div.-pagination{\n  padding: 0px !important;\n  margin-top: 10px;\n  border: 0px;\n  box-shadow: none !important;\n}\ndiv.-previous{\n  border: 0px;\n}\n/* Tables */\ndiv.rt-td, div.ReactTable{\n  border: 0px;\n}\n.rt-table, table{\n  background: #fff;\n}\ndiv.rt-table div.rt-tr-group div.rt-tr.-odd, .table-striped tr:nth-of-type(2n+1) td{\n  background: #f1f3f6;\n}\n.table-striped tr:nth-of-type(2n-1) th{\n  background: #fff;\n}\n.table-striped tr:nth-of-type(2n) th{\n  background: #f1f3f6;\n}\n::placeholder {\n  color: rgba(255,255,255,.6);\n  opacity: 1;\n}\n:-ms-input-placeholder {\n  color: #fff;\n}\n::-ms-input-placeholder {\n  color: #fff;\n}\ndiv.DraftEditor-editorContainer{\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\n#divsononeline {\n   display: inline-block;\n   vertical-align: middle;\n}\n#navbuttonsonstudypage {\n   display: inline-block;\n   vertical-align: super;\n}\n\n/* Autosuggest */\n\n.react-autosuggest__container {\n  position: relative;\n}\n\n.react-autosuggest__input {\n  width: 240px;\n  height: 30px;\n  padding: 10px 20px;\n  font-family: Helvetica, sans-serif;\n  font-weight: 300;\n  font-size: 16px;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  margin-right: 8px;\n}\n\n.react-autosuggest__input--focused {\n  outline: none;\n}\n\n.react-autosuggest__input--open {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.react-autosuggest__suggestions-container {\n  display: none;\n}\n\n.react-autosuggest__suggestions-container--open {\n  display: block;\n  position: absolute;\n  top: 28px;\n  width: 240px;\n  border: 1px solid #aaa;\n  background-color: #fff;\n  font-family: Helvetica, sans-serif;\n  font-weight: 300;\n  font-size: 14px;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  z-index: 2;\n}\n\n.react-autosuggest__suggestions-list {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\n\n.react-autosuggest__suggestion {\n  cursor: pointer;\n  padding: 10px 20px;\n}\n\n.react-autosuggest__suggestion--highlighted {\n  background-color: #ddd;\n}\n\n.react-autosuggest__section-container {\n  border-top: 1px dashed #ccc;\n}\n\n.react-autosuggest__section-container--first {\n  border-top: 0;\n}\n\n.react-autosuggest__section-title {\n  padding: 10px 0 0 10px;\n  font-size: 12px;\n  color: #777;\n}\n\n.ReactTable .-pagination .-btn {\n  background: #55B88D !important;\n}\n"], ["\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\nbody {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\nbody.fontLoaded {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\np,\nlabel {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  line-height: 1.5em;\n}\n.btn, button, .-btn{\n  border: 0px;\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n  border-radius: 4px;\n}\n.btn, .-btn{\n  background: #55B88D;\n  color: #fff !important;\n}\ndiv.crumbs-bar span.label {\n  background: #55B88D !important;\n  color: #fff !important;\n}\ndiv.rt-tbody div.rt-tr:hover{\n  background: #55B88D !important;\n  color: #fff !important;\n}\n/* Pagination */\ndiv.pagination-bottom div.-pagination{\n  padding: 0px !important;\n  margin-top: 10px;\n  border: 0px;\n  box-shadow: none !important;\n}\ndiv.-previous{\n  border: 0px;\n}\n/* Tables */\ndiv.rt-td, div.ReactTable{\n  border: 0px;\n}\n.rt-table, table{\n  background: #fff;\n}\ndiv.rt-table div.rt-tr-group div.rt-tr.-odd, .table-striped tr:nth-of-type(2n+1) td{\n  background: #f1f3f6;\n}\n.table-striped tr:nth-of-type(2n-1) th{\n  background: #fff;\n}\n.table-striped tr:nth-of-type(2n) th{\n  background: #f1f3f6;\n}\n::placeholder {\n  color: rgba(255,255,255,.6);\n  opacity: 1;\n}\n:-ms-input-placeholder {\n  color: #fff;\n}\n::-ms-input-placeholder {\n  color: #fff;\n}\ndiv.DraftEditor-editorContainer{\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\n#divsononeline {\n   display: inline-block;\n   vertical-align: middle;\n}\n#navbuttonsonstudypage {\n   display: inline-block;\n   vertical-align: super;\n}\n\n/* Autosuggest */\n\n.react-autosuggest__container {\n  position: relative;\n}\n\n.react-autosuggest__input {\n  width: 240px;\n  height: 30px;\n  padding: 10px 20px;\n  font-family: Helvetica, sans-serif;\n  font-weight: 300;\n  font-size: 16px;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  margin-right: 8px;\n}\n\n.react-autosuggest__input--focused {\n  outline: none;\n}\n\n.react-autosuggest__input--open {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.react-autosuggest__suggestions-container {\n  display: none;\n}\n\n.react-autosuggest__suggestions-container--open {\n  display: block;\n  position: absolute;\n  top: 28px;\n  width: 240px;\n  border: 1px solid #aaa;\n  background-color: #fff;\n  font-family: Helvetica, sans-serif;\n  font-weight: 300;\n  font-size: 14px;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  z-index: 2;\n}\n\n.react-autosuggest__suggestions-list {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\n\n.react-autosuggest__suggestion {\n  cursor: pointer;\n  padding: 10px 20px;\n}\n\n.react-autosuggest__suggestion--highlighted {\n  background-color: #ddd;\n}\n\n.react-autosuggest__section-container {\n  border-top: 1px dashed #ccc;\n}\n\n.react-autosuggest__section-container--first {\n  border-top: 0;\n}\n\n.react-autosuggest__section-title {\n  padding: 10px 0 0 10px;\n  font-size: 12px;\n  color: #777;\n}\n\n.ReactTable .-pagination .-btn {\n  background: #55B88D !important;\n}\n"])));
var templateObject_1;


/***/ }),

/***/ "./app/i18n.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var react_intl_1 = __webpack_require__("./node_modules/react-intl/lib/index.es.js");
var en_1 = __webpack_require__("./node_modules/react-intl/locale-data/en.js");
var enTranslationMessages = __webpack_require__("./app/translations/en.json");
var DEFAULT_LOCALE = 'en';
exports.appLocales = ['en'];
react_intl_1.addLocaleData(en_1.default);
exports.formatTranslationMessages = function (locale, messages) {
    var defaultFormattedMessages = locale !== DEFAULT_LOCALE
        ? exports.formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
        : {};
    return Object.keys(messages).reduce(function (formattedMessages, key) {
        var _a;
        var message = messages[key];
        if (!message && locale !== DEFAULT_LOCALE) {
            message = defaultFormattedMessages[key];
        }
        return Object.assign(formattedMessages, (_a = {}, _a[key] = message, _a));
    }, {});
};
exports.translationMessages = {
    en: exports.formatTranslationMessages('en', enTranslationMessages),
};


/***/ }),

/***/ "./app/mutations/CopySiteViewMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var COPY_SITE_VIEW_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation CopySiteViewMutation($input: CopySiteViewInput!) {\n    copySiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation CopySiteViewMutation($input: CopySiteViewInput!) {\n    copySiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), SiteProvider_1.default.siteViewFragment);
var CopySiteViewMutationComponent = /** @class */ (function (_super) {
    __extends(CopySiteViewMutationComponent, _super);
    function CopySiteViewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CopySiteViewMutationComponent;
}(react_apollo_1.Mutation));
var CopySiteViewMutation = /** @class */ (function (_super) {
    __extends(CopySiteViewMutation, _super);
    function CopySiteViewMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CopySiteViewMutation.prototype.render = function () {
        return (React.createElement(CopySiteViewMutationComponent, { mutation: COPY_SITE_VIEW_MUTATION }, this.props.children));
    };
    return CopySiteViewMutation;
}(React.PureComponent));
exports.default = CopySiteViewMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/CreateSiteMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var SiteItem_1 = __webpack_require__("./app/components/SiteItem/index.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var CREATE_SITE_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation CreateSiteMutation($input: CreateSiteInput!, $url: String) {\n    createSite(input: $input) {\n      site {\n        ...SiteFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation CreateSiteMutation($input: CreateSiteInput!, $url: String) {\n    createSite(input: $input) {\n      site {\n        ...SiteFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), SiteProvider_1.default.fragment);
var CreateSiteMutationComponent = /** @class */ (function (_super) {
    __extends(CreateSiteMutationComponent, _super);
    function CreateSiteMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateSiteMutationComponent;
}(react_apollo_1.Mutation));
var OWN_SITES_QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query CreateSiteOwnSitesQuery {\n    me {\n      id\n      ownSites {\n        ...SiteItemFragment\n      }\n    }\n  }\n\n  ", "\n"], ["\n  query CreateSiteOwnSitesQuery {\n    me {\n      id\n      ownSites {\n        ...SiteItemFragment\n      }\n    }\n  }\n\n  ", "\n"])), SiteItem_1.SiteItem.fragment);
var CreateSiteMutation = /** @class */ (function (_super) {
    __extends(CreateSiteMutation, _super);
    function CreateSiteMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreateSiteMutation.prototype.render = function () {
        return (React.createElement(CreateSiteMutationComponent, { mutation: CREATE_SITE_MUTATION, onCompleted: this.props.onCompleted, update: function (cache, _a) {
                var data = _a.data;
                if (!data || !data.createSite || !data.createSite.site)
                    return;
                var currentData;
                try {
                    currentData = cache.readQuery({
                        query: OWN_SITES_QUERY
                    });
                }
                catch (_b) {
                    // This means the data for ownStores was not fetched yet
                    return;
                }
                if (!currentData || !currentData.me)
                    return;
                var ownStoresLens = ramda_1.lensPath([
                    "me",
                    "ownSites",
                    currentData.me.ownSites.length
                ]);
                var newData = ramda_1.set(ownStoresLens, data.createSite.site, currentData);
                cache.writeQuery({ query: OWN_SITES_QUERY, data: newData });
            } }, this.props.children));
    };
    return CreateSiteMutation;
}(React.PureComponent));
exports.default = CreateSiteMutation;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/mutations/CreateSiteViewMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var CREATE_SITE_VIEW_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation CreateSiteViewMutation($input: CreateSiteViewInput!) {\n    createSiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation CreateSiteViewMutation($input: CreateSiteViewInput!) {\n    createSiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), SiteProvider_1.default.siteViewFragment);
var CreateSiteViewMutationComponent = /** @class */ (function (_super) {
    __extends(CreateSiteViewMutationComponent, _super);
    function CreateSiteViewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateSiteViewMutationComponent;
}(react_apollo_1.Mutation));
var CreateSiteViewMutation = /** @class */ (function (_super) {
    __extends(CreateSiteViewMutation, _super);
    function CreateSiteViewMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreateSiteViewMutation.prototype.render = function () {
        return (React.createElement(CreateSiteViewMutationComponent, { mutation: CREATE_SITE_VIEW_MUTATION }, this.props.children));
    };
    return CreateSiteViewMutation;
}(React.PureComponent));
exports.default = CreateSiteViewMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/DeleteSiteMutations.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var DELETE_SITE_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation DeleteSiteMutation($input: DeleteSiteInput!) {\n    deleteSite(input: $input) {\n      site {\n        id\n      }\n    }\n  }\n"], ["\n  mutation DeleteSiteMutation($input: DeleteSiteInput!) {\n    deleteSite(input: $input) {\n      site {\n        id\n      }\n    }\n  }\n"])));
var SITES_QUERY = apollo_boost_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  query DeleteSiteMutationsSitesQuery {\n    me {\n      id\n      ownSites {\n        id\n      }\n      editorSites {\n        id\n      }\n    }\n  }\n"], ["\n  query DeleteSiteMutationsSitesQuery {\n    me {\n      id\n      ownSites {\n        id\n      }\n      editorSites {\n        id\n      }\n    }\n  }\n"])));
var DeleteSiteMutationComponent = /** @class */ (function (_super) {
    __extends(DeleteSiteMutationComponent, _super);
    function DeleteSiteMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeleteSiteMutationComponent;
}(react_apollo_1.Mutation));
var DeleteSiteMutation = /** @class */ (function (_super) {
    __extends(DeleteSiteMutation, _super);
    function DeleteSiteMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSiteMutation.prototype.render = function () {
        return (React.createElement(DeleteSiteMutationComponent, { mutation: DELETE_SITE_MUTATION, onCompleted: this.props.onCompleted, onError: this.props.onError, update: function (cache, _a) {
                var data = _a.data;
                var id = ramda_1.pathOr(null, ['deleteSite', 'site', 'id'], data || {});
                if (!id)
                    return;
                var currentData = cache.readQuery({
                    query: SITES_QUERY,
                });
                var _b = currentData.me, editorSites = _b.editorSites, ownSites = _b.ownSites;
                var updatedData = {
                    me: __assign(__assign({}, currentData.me), { editorSites: ramda_1.reject(ramda_1.propEq('id', id), editorSites), ownSites: ramda_1.reject(ramda_1.propEq('id', id), ownSites) }),
                };
                cache.writeQuery({
                    query: SITES_QUERY,
                    data: updatedData,
                });
            } }, this.props.children));
    };
    return DeleteSiteMutation;
}(React.PureComponent));
exports.default = DeleteSiteMutation;
var templateObject_1, templateObject_2;


/***/ }),

/***/ "./app/mutations/DeleteSiteViewMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var DELETE_SITE_VIEW_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation DeleteSiteViewMutation($input: DeleteSiteViewInput!) {\n    deleteSiteView(input: $input) {\n      siteView {\n        name\n        id\n      }\n      error\n    }\n  }\n"], ["\n  mutation DeleteSiteViewMutation($input: DeleteSiteViewInput!) {\n    deleteSiteView(input: $input) {\n      siteView {\n        name\n        id\n      }\n      error\n    }\n  }\n"])));
var DeleteSiteViewMutationComponent = /** @class */ (function (_super) {
    __extends(DeleteSiteViewMutationComponent, _super);
    function DeleteSiteViewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeleteSiteViewMutationComponent;
}(react_apollo_1.Mutation));
var DeleteSiteViewMutation = /** @class */ (function (_super) {
    __extends(DeleteSiteViewMutation, _super);
    function DeleteSiteViewMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSiteViewMutation.prototype.render = function () {
        return (React.createElement(DeleteSiteViewMutationComponent, { mutation: DELETE_SITE_VIEW_MUTATION }, this.props.children));
    };
    return DeleteSiteViewMutation;
}(React.PureComponent));
exports.default = DeleteSiteViewMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/UpdateSiteMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var UPDATE_SITE_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation UpdateSiteMutation($input: UpdateSiteInput!, $url: String) {\n    updateSite(input: $input) {\n      site {\n        ...SiteFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation UpdateSiteMutation($input: UpdateSiteInput!, $url: String) {\n    updateSite(input: $input) {\n      site {\n        ...SiteFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), SiteProvider_1.default.fragment);
var UpdateSiteMutationComponent = /** @class */ (function (_super) {
    __extends(UpdateSiteMutationComponent, _super);
    function UpdateSiteMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateSiteMutationComponent;
}(react_apollo_1.Mutation));
var UpdateSiteMutation = /** @class */ (function (_super) {
    __extends(UpdateSiteMutation, _super);
    function UpdateSiteMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateSiteMutation.prototype.render = function () {
        return (React.createElement(UpdateSiteMutationComponent, { mutation: UPDATE_SITE_MUTATION, onCompleted: this.props.onCompleted }, this.props.children));
    };
    return UpdateSiteMutation;
}(React.PureComponent));
exports.default = UpdateSiteMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/UpdateSiteViewMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var SiteProvider_1 = __webpack_require__("./app/containers/SiteProvider/index.ts");
var UPDATE_SITE_VIEW_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation UpdateSiteViewMutation($input: UpdateSiteViewInput!) {\n    updateSiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation UpdateSiteViewMutation($input: UpdateSiteViewInput!) {\n    updateSiteView(input: $input) {\n      siteView {\n        ...SiteViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), SiteProvider_1.default.siteViewFragment);
var UpdateSiteViewMutationComponent = /** @class */ (function (_super) {
    __extends(UpdateSiteViewMutationComponent, _super);
    function UpdateSiteViewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateSiteViewMutationComponent;
}(react_apollo_1.Mutation));
var UpdateSiteViewMutation = /** @class */ (function (_super) {
    __extends(UpdateSiteViewMutation, _super);
    function UpdateSiteViewMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateSiteViewMutation.prototype.render = function () {
        return (React.createElement(UpdateSiteViewMutationComponent, { mutation: UPDATE_SITE_VIEW_MUTATION, onCompleted: this.props.onCompleted, onError: this.props.onError }, this.props.children));
    };
    return UpdateSiteViewMutation;
}(React.PureComponent));
exports.default = UpdateSiteViewMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/UpdateWikiSectionsMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var UPDATE_WIKI_SECTIONS_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation UpdateWikiSectionsMutation($input: UpdateWikiSectionsInput!) {\n    updateWikiSections(input: $input) {\n      wikiPage {\n        nctId\n        content\n      }\n      errors\n    }\n  }\n"], ["\n  mutation UpdateWikiSectionsMutation($input: UpdateWikiSectionsInput!) {\n    updateWikiSections(input: $input) {\n      wikiPage {\n        nctId\n        content\n      }\n      errors\n    }\n  }\n"])));
var UpdateWikiSectionsMutationComponent = /** @class */ (function (_super) {
    __extends(UpdateWikiSectionsMutationComponent, _super);
    function UpdateWikiSectionsMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateWikiSectionsMutationComponent;
}(react_apollo_1.Mutation));
var UpdateWikiSectionsMutation = /** @class */ (function (_super) {
    __extends(UpdateWikiSectionsMutation, _super);
    function UpdateWikiSectionsMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateWikiSectionsMutation.prototype.render = function () {
        return (React.createElement(UpdateWikiSectionsMutationComponent, { mutation: UPDATE_WIKI_SECTIONS_MUTATION, onCompleted: this.props.onCompleted, onError: this.props.onError }, this.props.children));
    };
    return UpdateWikiSectionsMutation;
}(React.PureComponent));
exports.default = UpdateWikiSectionsMutation;
var templateObject_1;


/***/ }),

/***/ "./app/mutations/UpdateWorflowsViewMutation.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var apollo_boost_1 = __webpack_require__("./node_modules/apollo-boost/lib/bundle.cjs.js");
var react_apollo_1 = __webpack_require__("./node_modules/react-apollo/react-apollo.browser.umd.js");
var WorkflowsViewProvider_1 = __webpack_require__("./app/containers/WorkflowsViewProvider/index.ts");
var UPDATE_WORKFLOWS_VIEW_MUTATION = apollo_boost_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation UpdateWorkflowsViewMutation($input: UpdateWorkflowsViewInput!) {\n    updateWorkflowsView(input: $input) {\n      workflowsView {\n        ...WorkflowsViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"], ["\n  mutation UpdateWorkflowsViewMutation($input: UpdateWorkflowsViewInput!) {\n    updateWorkflowsView(input: $input) {\n      workflowsView {\n        ...WorkflowsViewFragment\n      }\n      errors\n    }\n  }\n\n  ", "\n"])), WorkflowsViewProvider_1.default.fragment);
var UpdateWorkflowsViewMutationComponent = /** @class */ (function (_super) {
    __extends(UpdateWorkflowsViewMutationComponent, _super);
    function UpdateWorkflowsViewMutationComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateWorkflowsViewMutationComponent;
}(react_apollo_1.Mutation));
var UpdateWorkflowsViewMutation = /** @class */ (function (_super) {
    __extends(UpdateWorkflowsViewMutation, _super);
    function UpdateWorkflowsViewMutation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateWorkflowsViewMutation.prototype.render = function () {
        return (React.createElement(UpdateWorkflowsViewMutationComponent, { mutation: UPDATE_WORKFLOWS_VIEW_MUTATION, onCompleted: this.props.onCompleted, onError: this.props.onError }, this.props.children));
    };
    return UpdateWorkflowsViewMutation;
}(React.PureComponent));
exports.default = UpdateWorkflowsViewMutation;
var templateObject_1;


/***/ }),

/***/ "./app/translations/en.json":
/***/ (function(module, exports) {

module.exports = []

/***/ }),

/***/ "./app/types/globalTypes.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable */
// This file was automatically generated and should not be edited.
Object.defineProperty(exports, "__esModule", { value: true });
//==============================================================
// START Enums and Input Objects
//==============================================================
var FieldDisplay;
(function (FieldDisplay) {
    FieldDisplay["DATE"] = "DATE";
    FieldDisplay["STAR"] = "STAR";
    FieldDisplay["STRING"] = "STRING";
})(FieldDisplay = exports.FieldDisplay || (exports.FieldDisplay = {}));
var FilterKind;
(function (FilterKind) {
    FilterKind["BLACKLIST"] = "BLACKLIST";
    FilterKind["WHITELIST"] = "WHITELIST";
})(FilterKind = exports.FilterKind || (exports.FilterKind = {}));
/**
 * Possible set of operations of site view
 */
var SiteViewOperation;
(function (SiteViewOperation) {
    SiteViewOperation["DELETE"] = "DELETE";
    SiteViewOperation["PUSH"] = "PUSH";
    SiteViewOperation["SET"] = "SET";
})(SiteViewOperation = exports.SiteViewOperation || (exports.SiteViewOperation = {}));
//==============================================================
// END Enums and Input Objects
//==============================================================


/***/ }),

/***/ "./app/utils/aggs/aggToField.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
// aggToField
exports.default = (function (val) {
    return ramda_1.propOr(val, val, {
        average_rating: 'average rating',
        tags: 'tags',
        overall_status: 'status',
        study_type: 'type',
        sponsors: 'sponsors',
        facility_names: 'facilities',
        facility_states: 'states',
        facility_cities: 'cities',
        facility_countries: 'countries',
        start_date: 'start date',
        completion_date: 'completion date',
        phase: 'phase',
        browse_condition_mesh_terms: 'mesh term',
        browse_interventions_mesh_terms: 'browse intervention mesh term',
        interventions_mesh_terms: 'interventions',
    });
});


/***/ }),

/***/ "./app/utils/auth.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var configureApollo_1 = __webpack_require__("./app/configureApollo.ts");
var localStorage_1 = __webpack_require__("./app/utils/localStorage.ts");
exports.getLocalEmail = function () {
    var jwt = localStorage_1.getLocalJwt();
    if (!jwt)
        return null;
    var payloadb64 = jwt.split('.')[1];
    var payloadJson = atob(payloadb64);
    var payload;
    try {
        payload = JSON.parse(payloadJson);
    }
    catch (e) {
        console.log("Failed to parse Json from jwt, jwt: " + jwt);
        return null;
    }
    return payload['email'];
};
exports.logout = function (history) {
    localStorage_1.setLocalJwt(null);
    configureApollo_1.default.resetStore().then(function () { return history.push('/'); });
};


/***/ }),

/***/ "./app/utils/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.aggsOrdered = [
    'average_rating',
    // 'tags',
    'browse_condition_mesh_terms',
    'browse_interventions_mesh_terms',
    'facility_cities',
    'facility_countries',
    'facility_names',
    'facility_states',
    'interventions_mesh_terms',
    'overall_status',
    'phase',
    'rating_dimensions',
    'sponsors',
    'study_type',
];
exports.studyFields = [
    // own fields
    'nct_id',
    'nlm_download_date_description',
    'study_first_submitted_date',
    'results_first_submitted_date',
    'disposition_first_submitted_date',
    'last_update_submitted_date',
    'study_first_submitted_qc_date',
    'study_first_posted_date',
    'study_first_posted_date_type',
    'results_first_submitted_qc_date',
    'results_first_posted_date',
    'results_first_posted_date_type',
    'disposition_first_submitted_qc_date',
    'disposition_first_posted_date',
    'disposition_first_posted_date_type',
    'last_update_submitted_qc_date',
    'last_update_posted_date',
    'last_update_posted_date_type',
    'start_month_year',
    'start_date_type',
    'start_date',
    'verification_month_year',
    'verification_date',
    'completion_month_year',
    'completion_date_type',
    'completion_date',
    'primary_completion_month_year',
    'primary_completion_date_type',
    'primary_completion_date',
    'target_duration',
    'study_type',
    'acronym',
    'baseline_population',
    'brief_title',
    'official_title',
    'overall_status',
    'last_known_status',
    'phase',
    'enrollment',
    'enrollment_type',
    'source',
    'limitations_and_caveats',
    'number_of_arms',
    'number_of_groups',
    'why_stopped',
    'has_expanded_access',
    'expanded_access_type_individual',
    'expanded_access_type_intermediate',
    'expanded_access_type_treatment',
    'has_dmc',
    'is_fda_regulated_drug',
    'is_fda_regulated_device',
    'is_unapproved_device',
    'is_ppsd',
    'is_us_export',
    'biospec_retention',
    'biospec_description',
    'ipd_time_frame',
    'ipd_access_criteria',
    'ipd_url',
    'plan_to_share_ipd',
    'plan_to_share_ipd_description',
    // derived fields
    'average_rating',
];
exports.starColor = '#7ed964';
exports.MAX_WINDOW_SIZE = 10000;
exports.DEFAULT_SEARCH_HASH = 'ANUr6Wwa';


/***/ }),

/***/ "./app/utils/helpers.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
exports.capitalize = function (x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
};
// see also aggToField for formatting aggs
exports.sentanceCase = function (x) {
    return x
        .split('_')
        .map(exports.capitalize)
        .join(' ');
};
exports.camelCase = function (text) {
    return text
        .split('_')
        .map(function (w) { return w.replace(/./, function (m) { return m.toUpperCase(); }); })
        .join('')
        .replace(/./, function (m) { return m.toLowerCase(); });
};
exports.snakeCase = function (text) {
    return text.replace(/([A-Z])/g, function (x) { return "_" + x.toLowerCase(); });
};
exports.sentanceCaseFromCamelCase = function (x) {
    return ramda_1.pipe(exports.snakeCase, ramda_1.split('_'), ramda_1.map(exports.capitalize), ramda_1.join(' '))(x);
};
exports.trimPath = function (text) {
    return text[text.length - 1] === '/'
        ? text.substr(0, text.length - 1)
        : text.substr(0, text.length);
};
exports.extractWikiSections = function (text) {
    var regex = /^\s*##?\s*([^#\s].*)/i;
    var lines = text.split('\n');
    var currentSection = {
        name: '',
        match: '',
        content: '',
    };
    var sectionContents = [];
    var result = [];
    lines.forEach(function (line) {
        var matches = regex.exec(line);
        if (matches && matches[1] && matches[1].trim()) {
            currentSection.content = sectionContents.join('\n').trim();
            result.push(currentSection);
            currentSection = {
                name: matches[1].trim(),
                match: matches[0],
                content: '',
            };
            sectionContents = [];
        }
        else {
            sectionContents.push(line);
        }
    });
    currentSection.content = sectionContents.join('\n').trim();
    result.push(currentSection);
    return result;
};


/***/ }),

/***/ "./app/utils/localStorage.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// We need cache, because localStorage is not consistent in reads / writes
var cache = {};
exports.lsGet = function (key) {
    var cachedItem = cache[key];
    if (cachedItem)
        return cachedItem;
    var lsItem = localStorage.getItem(key);
    if (lsItem != null) {
        cache[key] = lsItem;
        return lsItem;
    }
    return null;
};
exports.lsSet = function (key, value) {
    if (value == null) {
        localStorage.removeItem(key);
        delete cache[key];
    }
    else {
        cache[key] = value;
        localStorage.setItem(key, value);
    }
};
exports.getLocalJwt = function () { return exports.lsGet('jwt'); };
exports.setLocalJwt = function (jwt) { return exports.lsSet('jwt', jwt); };


/***/ }),

/***/ "./app/utils/siteViewHelpers.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var globalTypes_1 = __webpack_require__("./app/types/globalTypes.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
exports.preselectedFilters = function (view) {
    var aggFilters = ramda_1.reject(function (field) { return ramda_1.isEmpty(field.preselected.values); }, view.search.aggs.fields).map(function (field) { return ({
        field: field.name,
        values: field.preselected.values,
    }); });
    var presearchAggFilters = ramda_1.reject(function (field) { return ramda_1.isEmpty(field.preselected.values); }, view.search.presearch.aggs.fields).map(function (field) { return ({
        field: field.name,
        values: field.preselected.values,
    }); });
    // console.log("Prepre Aggs", presearchAggFilters)
    var crowdAggFilters = ramda_1.reject(function (field) { return ramda_1.isEmpty(field.preselected.values); }, view.search.crowdAggs.fields).map(function (field) { return ({
        field: field.name,
        values: field.preselected.values,
    }); });
    var presearchCrowdAggFilters = ramda_1.reject(function (field) { return ramda_1.isEmpty(field.preselected.values); }, view.search.presearch.crowdAggs.fields).map(function (field) { return ({
        field: field.name,
        values: field.preselected.values,
    }); });
    aggFilters = aggFilters.concat(presearchAggFilters);
    crowdAggFilters = crowdAggFilters.concat(presearchCrowdAggFilters);
    return {
        aggFilters: aggFilters,
        crowdAggFilters: crowdAggFilters,
    };
};
exports.displayFields = function (kind, filterValues, fields, sortByValues) {
    var fieldFilterFn = kind === globalTypes_1.FilterKind.BLACKLIST ? ramda_1.reject : ramda_1.filter;
    var filtered = fieldFilterFn(function (field) { return filterValues.includes(field.name); }, fields);
    var sortF = sortByValues ? function (x) { return ramda_1.indexOf(x.name, filterValues); } : getRank;
    return ramda_1.sortBy(sortF, filtered);
};
var getRank = function (field) {
    if (field.rank == null)
        return Number.POSITIVE_INFINITY;
    return typeof field.rank === 'number' ? field.rank : parseInt(field.rank, 10);
};


/***/ }),

/***/ "./app/utils/siteViewUpdater.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var globalTypes_1 = __webpack_require__("./app/types/globalTypes.ts");
var ramda_1 = __webpack_require__("./node_modules/ramda/src/index.js");
var apollo_utilities_1 = __webpack_require__("./node_modules/apollo-utilities/lib/bundle.cjs.js");
exports.createMutation = function (name, value) {
    var _a = __read(name.split(':'), 2), operation = _a[0], path = _a[1];
    var pathComponents = path.split('.');
    var typedOperation;
    switch (operation.toUpperCase()) {
        case 'PUSH':
            typedOperation = globalTypes_1.SiteViewOperation.PUSH;
            break;
        case 'SET':
            typedOperation = globalTypes_1.SiteViewOperation.SET;
            break;
        case 'DELETE':
            typedOperation = globalTypes_1.SiteViewOperation.DELETE;
            break;
        default:
            typedOperation = globalTypes_1.SiteViewOperation.SET;
            break;
    }
    return {
        path: pathComponents,
        operation: typedOperation,
        payload: value,
    };
};
exports.getViewValueByPath = function (path, view) {
    var _a = __read(getLastHashByPath(path, view), 2), key = _a[0], lastView = _a[1];
    return lastView[key];
};
exports.serializeMutation = function (mutation) {
    var copy = apollo_utilities_1.cloneDeep(mutation);
    if (typeof copy.payload !== 'string') {
        copy.payload = JSON.stringify(copy.payload);
    }
    return copy;
};
exports.updateView = function (view, mutations) {
    var result = apollo_utilities_1.cloneDeep(view);
    mutations.forEach(function (mutation) { return applyOne(result, mutation); });
    return result;
};
var tryParse = function (data, defaultValue) {
    try {
        return JSON.parse(data);
    }
    catch (e) { }
    return defaultValue;
};
var applyOne = function (view, mutation) {
    var _a = __read(getLastHashByPath(mutation.path, view), 2), key = _a[0], mutationView = _a[1];
    if (!mutationView)
        return false;
    var payload = tryParse(mutation.payload, mutation.payload);
    switch (mutation.operation) {
        case globalTypes_1.SiteViewOperation.SET:
            mutationView[key] = payload;
            break;
        case globalTypes_1.SiteViewOperation.PUSH:
            mutationView[key].push(payload);
            break;
        case globalTypes_1.SiteViewOperation.DELETE:
            if (typeof mutationView[key] === 'object') {
                delete mutationView[key];
            }
            if (Array.isArray(mutationView[key])) {
                mutationView[key] = ramda_1.reject(function (x) { return x === mutation.payload || x.name === mutation.payload; });
            }
            break;
        default:
            break;
    }
};
var getLastHashByPath = function (components, view) {
    var _a = __read(components), key = _a[0], currentComponents = _a.slice(1);
    var currentView = view;
    while (currentComponents.length && currentView) {
        if (Array.isArray(currentView)) {
            currentView = ramda_1.find(ramda_1.propEq('name', key), currentView);
        }
        else if (typeof currentView === 'object') {
            currentView = currentView[key];
        }
        else {
            currentView = null;
        }
        key = currentComponents[0];
        currentComponents = currentComponents.slice(1);
    }
    return [key, currentView];
};


/***/ }),

/***/ "./node_modules/ansi-html/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ "./node_modules/apollo-boost/lib/bundle.cjs.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-boost/lib/bundle.cjs.js");

/***/ }),

/***/ "./node_modules/apollo-cache-inmemory/lib/bundle.cjs.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-cache-inmemory/lib/bundle.cjs.js");

/***/ }),

/***/ "./node_modules/apollo-client/bundle.umd.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-client/bundle.umd.js");

/***/ }),

/***/ "./node_modules/apollo-link-context/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-link-context/lib/index.js");

/***/ }),

/***/ "./node_modules/apollo-link-http/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-link-http/lib/index.js");

/***/ }),

/***/ "./node_modules/apollo-utilities/lib/bundle.cjs.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/apollo-utilities/lib/bundle.cjs.js");

/***/ }),

/***/ "./node_modules/babel-polyfill/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/babel-polyfill/lib/index.js");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./app/containers/AggDropDown/AggDropDownStyle.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".bm-panel-title {\n  color: #51575d;\n}\n\n.bm-panel-title a:hover {\n    text-decoration: none;\n    color: #fff;\n}\n\n.bm-panel-default {\n  box-shadow: 0px;\n  border: 0px;\n  background: none;\n  color: #fff;\n  text-transform: capitalize;\n}\n\n.bm-panel-heading {\n  box-shadow: 0px !important;\n  border: 0px;\n  background: none !important;\n  color: #fff;\n  text-transform: capitalize;\n}\n\n.bm-panel-collapse {\n  background: #394149;\n}\n\n.bm-panel-body {\n  padding-left: 10px;\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 13px;\n}\n\n.bm-panel-title {\n  font-size: 16px;\n  color: #bac5d0;\n  padding: 0px 10px;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/react-bootstrap-typeahead/css/Typeahead.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".rbt-menu {\n  margin-bottom: 2px;\n}\n\n.rbt-menu > li a {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.rbt-menu > li a:focus {\n  outline: none;\n}\n\n.rbt-menu-pagination-option {\n  text-align: center;\n}\n\n.rbt .rbt-input-main::-ms-clear {\n  display: none;\n}\n\n.rbt-input-multi {\n  cursor: text;\n  overflow: hidden;\n  position: relative;\n  height: auto;\n}\n\n.rbt-input-multi.focus {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  border-color: #66afe9;\n  outline: 0;\n}\n\n.rbt-input-multi.form-control[disabled] {\n  background-color: #e9ecef;\n  opacity: 1;\n}\n\n.rbt-input-multi input::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.rbt-input-multi input:-ms-input-placeholder {\n  color: #999;\n}\n\n.rbt-input-multi input::-webkit-input-placeholder {\n  color: #999;\n}\n\n.rbt-input-multi .rbt-input-wrapper {\n  align-items: flex-start;\n  display: flex;\n  flex-wrap: wrap;\n  margin-bottom: -4px;\n  margin-top: -1px;\n  overflow: hidden;\n}\n\n.rbt-input-multi .rbt-input-main {\n  height: 20px;\n  margin: 1px 0 4px;\n}\n\n.rbt-input-multi.input-lg .rbt-input-main, .rbt-input-multi.form-control-lg .rbt-input-main {\n  height: 24px;\n}\n\n.rbt-input-multi.input-sm .rbt-input-main, .rbt-input-multi.form-control-sm .rbt-input-main {\n  height: 18px;\n}\n\n.rbt-close {\n  z-index: 1;\n}\n\n.rbt-close-lg {\n  font-size: 24px;\n}\n\n.rbt-token {\n  background-color: #e7f4ff;\n  border: 0;\n  border-radius: 2px;\n  color: #1f8dd6;\n  display: inline-block;\n  line-height: 1em;\n  margin: 0 3px 3px 0;\n  padding: 4px 7px;\n  position: relative;\n}\n\n.rbt-token-disabled {\n  background-color: #ddd;\n  color: #888;\n  pointer-events: none;\n}\n\n.rbt-token-removeable {\n  cursor: pointer;\n  padding-right: 21px;\n}\n\n.rbt-token-active {\n  background-color: #1f8dd6;\n  color: #fff;\n  outline: none;\n  text-decoration: none;\n}\n\n.rbt-token .rbt-token-remove-button {\n  bottom: 0;\n  color: inherit;\n  font-size: inherit;\n  font-weight: normal;\n  opacity: 1;\n  outline: none;\n  padding: 3px 7px;\n  position: absolute;\n  right: 0;\n  text-shadow: none;\n  top: -2px;\n}\n\n.rbt-loader {\n  -moz-animation: loader-animation 600ms infinite linear;\n  -webkit-animation: loader-animation 600ms infinite linear;\n  animation: loader-animation 600ms infinite linear;\n  border: 1px solid #d5d5d5;\n  border-radius: 50%;\n  border-top-color: #1f8dd6;\n  display: block;\n  height: 16px;\n  width: 16px;\n}\n\n.rbt-loader-lg {\n  height: 20px;\n  width: 20px;\n}\n\n.rbt-aux {\n  align-items: center;\n  display: flex;\n  bottom: 0;\n  justify-content: center;\n  pointer-events: none;\n  /* Don't block clicks on the input */\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 34px;\n}\n\n.rbt-aux-lg {\n  width: 46px;\n}\n\n.rbt-aux .rbt-close {\n  margin-top: -4px;\n  pointer-events: auto;\n  /* Override pointer-events: none; above */\n}\n\n.has-aux .rbt-input {\n  padding-right: 34px;\n}\n\n.rbt-highlight-text {\n  background-color: inherit;\n  color: inherit;\n  font-weight: bold;\n  padding: 0;\n}\n\n/* Input Groups */\n.input-group > .rbt {\n  flex: 1;\n}\n\n.input-group > .rbt .rbt-input-hint,\n.input-group > .rbt .rbt-aux {\n  z-index: 5;\n}\n\n.input-group > .rbt:not(:first-child) .form-control {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.input-group > .rbt:not(:last-child) .form-control {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n/* Validation States */\n.has-error .rbt-input-multi.focus {\n  border-color: #843534;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n}\n\n.has-warning .rbt-input-multi.focus {\n  border-color: #66512c;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n}\n\n.has-success .rbt-input-multi.focus {\n  border-color: #2b542c;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n}\n\n@keyframes loader-animation {\n  to {\n    transform: rotate(1turn);\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/react-table/react-table.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".ReactTable{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;border:1px solid rgba(0,0,0,0.1);}.ReactTable *{box-sizing:border-box}.ReactTable .rt-table{-webkit-box-flex:1;-ms-flex:auto 1;flex:auto 1;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;width:100%;border-collapse:collapse;overflow:auto}.ReactTable .rt-thead{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.ReactTable .rt-thead.-headerGroups{background:rgba(0,0,0,0.03);border-bottom:1px solid rgba(0,0,0,0.05)}.ReactTable .rt-thead.-filters{border-bottom:1px solid rgba(0,0,0,0.05);}.ReactTable .rt-thead.-filters input,.ReactTable .rt-thead.-filters select{border:1px solid rgba(0,0,0,0.1);background:#fff;padding:5px 7px;font-size:inherit;border-radius:3px;font-weight:normal;outline:none}.ReactTable .rt-thead.-filters .rt-th{border-right:1px solid rgba(0,0,0,0.02)}.ReactTable .rt-thead.-header{box-shadow:0 2px 15px 0 rgba(0,0,0,0.15)}.ReactTable .rt-thead .rt-tr{text-align:center}.ReactTable .rt-thead .rt-th,.ReactTable .rt-thead .rt-td{padding:5px 5px;line-height:normal;position:relative;border-right:1px solid rgba(0,0,0,0.05);transition:box-shadow .3s cubic-bezier(.175,.885,.32,1.275);box-shadow:inset 0 0 0 0 transparent;}.ReactTable .rt-thead .rt-th.-sort-asc,.ReactTable .rt-thead .rt-td.-sort-asc{box-shadow:inset 0 3px 0 0 rgba(0,0,0,0.6)}.ReactTable .rt-thead .rt-th.-sort-desc,.ReactTable .rt-thead .rt-td.-sort-desc{box-shadow:inset 0 -3px 0 0 rgba(0,0,0,0.6)}.ReactTable .rt-thead .rt-th.-cursor-pointer,.ReactTable .rt-thead .rt-td.-cursor-pointer{cursor:pointer}.ReactTable .rt-thead .rt-th:last-child,.ReactTable .rt-thead .rt-td:last-child{border-right:0}.ReactTable .rt-thead .rt-resizable-header{overflow:visible;}.ReactTable .rt-thead .rt-resizable-header:last-child{overflow:hidden}.ReactTable .rt-thead .rt-resizable-header-content{overflow:hidden;text-overflow:ellipsis}.ReactTable .rt-thead .rt-header-pivot{border-right-color:#f7f7f7}.ReactTable .rt-thead .rt-header-pivot:after,.ReactTable .rt-thead .rt-header-pivot:before{left:100%;top:50%;border:solid transparent;content:\" \";height:0;width:0;position:absolute;pointer-events:none}.ReactTable .rt-thead .rt-header-pivot:after{border-color:rgba(255,255,255,0);border-left-color:#fff;border-width:8px;margin-top:-8px}.ReactTable .rt-thead .rt-header-pivot:before{border-color:rgba(102,102,102,0);border-left-color:#f7f7f7;border-width:10px;margin-top:-10px}.ReactTable .rt-tbody{-webkit-box-flex:99999;-ms-flex:99999 1 auto;flex:99999 1 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;overflow:auto;}.ReactTable .rt-tbody .rt-tr-group{border-bottom:solid 1px rgba(0,0,0,0.05);}.ReactTable .rt-tbody .rt-tr-group:last-child{border-bottom:0}.ReactTable .rt-tbody .rt-td{border-right:1px solid rgba(0,0,0,0.02);}.ReactTable .rt-tbody .rt-td:last-child{border-right:0}.ReactTable .rt-tbody .rt-expandable{cursor:pointer;text-overflow:clip}.ReactTable .rt-tr-group{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.ReactTable .rt-tr{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.ReactTable .rt-th,.ReactTable .rt-td{-webkit-box-flex:1;-ms-flex:1 0 0px;flex:1 0 0;white-space:nowrap;text-overflow:ellipsis;padding:7px 5px;overflow:hidden;transition:.3s ease;transition-property:width,min-width,padding,opacity;}.ReactTable .rt-th.-hidden,.ReactTable .rt-td.-hidden{width:0 !important;min-width:0 !important;padding:0 !important;border:0 !important;opacity:0 !important}.ReactTable .rt-expander{display:inline-block;position:relative;margin:0;color:transparent;margin:0 10px;}.ReactTable .rt-expander:after{content:'';position:absolute;width:0;height:0;top:50%;left:50%;-webkit-transform:translate(-50%,-50%) rotate(-90deg);transform:translate(-50%,-50%) rotate(-90deg);border-left:5.04px solid transparent;border-right:5.04px solid transparent;border-top:7px solid rgba(0,0,0,0.8);transition:all .3s cubic-bezier(.175,.885,.32,1.275);cursor:pointer}.ReactTable .rt-expander.-open:after{-webkit-transform:translate(-50%,-50%) rotate(0);transform:translate(-50%,-50%) rotate(0)}.ReactTable .rt-resizer{display:inline-block;position:absolute;width:36px;top:0;bottom:0;right:-18px;cursor:col-resize;z-index:10}.ReactTable .rt-tfoot{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;box-shadow:0 0 15px 0 rgba(0,0,0,0.15);}.ReactTable .rt-tfoot .rt-td{border-right:1px solid rgba(0,0,0,0.05);}.ReactTable .rt-tfoot .rt-td:last-child{border-right:0}.ReactTable.-striped .rt-tr.-odd{background:rgba(0,0,0,0.03)}.ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover{background:rgba(0,0,0,0.05)}.ReactTable .-pagination{z-index:1;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:3px;box-shadow:0 0 15px 0 rgba(0,0,0,0.1);border-top:2px solid rgba(0,0,0,0.1);}.ReactTable .-pagination input,.ReactTable .-pagination select{border:1px solid rgba(0,0,0,0.1);background:#fff;padding:5px 7px;font-size:inherit;border-radius:3px;font-weight:normal;outline:none}.ReactTable .-pagination .-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:block;width:100%;height:100%;border:0;border-radius:3px;padding:6px;font-size:1em;color:rgba(0,0,0,0.6);background:rgba(0,0,0,0.1);transition:all .1s ease;cursor:pointer;outline:none;}.ReactTable .-pagination .-btn[disabled]{opacity:.5;cursor:default}.ReactTable .-pagination .-btn:not([disabled]):hover{background:rgba(0,0,0,0.3);color:#fff}.ReactTable .-pagination .-previous,.ReactTable .-pagination .-next{-webkit-box-flex:1;-ms-flex:1;flex:1;text-align:center}.ReactTable .-pagination .-center{-webkit-box-flex:1.5;-ms-flex:1.5;flex:1.5;text-align:center;margin-bottom:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-ms-flex-pack:distribute;justify-content:space-around}.ReactTable .-pagination .-pageInfo{display:inline-block;margin:3px 10px;white-space:nowrap}.ReactTable .-pagination .-pageJump{display:inline-block;}.ReactTable .-pagination .-pageJump input{width:70px;text-align:center}.ReactTable .-pagination .-pageSizeOptions{margin:3px 10px}.ReactTable .rt-noData{display:block;position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);transition:all .3s ease;z-index:1;pointer-events:none;padding:20px;color:rgba(0,0,0,0.5)}.ReactTable .-loading{display:block;position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,0.8);transition:all .3s ease;z-index:-1;opacity:0;pointer-events:none;}.ReactTable .-loading > div{position:absolute;display:block;text-align:center;width:100%;top:50%;left:0;font-size:15px;color:rgba(0,0,0,0.6);-webkit-transform:translateY(-52%);transform:translateY(-52%);transition:all .3s cubic-bezier(.25,.46,.45,.94)}.ReactTable .-loading.-active{opacity:1;z-index:2;pointer-events:all;}.ReactTable .-loading.-active > div{-webkit-transform:translateY(50%);transform:translateY(50%)}.ReactTable .rt-resizing .rt-th,.ReactTable .rt-resizing .rt-td{transition:none !important;cursor:col-resize;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/react-toggle/style.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".react-toggle {\n  touch-action: pan-x;\n\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  background-color: transparent;\n  border: 0;\n  padding: 0;\n\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\n  -webkit-tap-highlight-color: transparent;\n}\n\n.react-toggle-screenreader-only {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.react-toggle--disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n  -webkit-transition: opacity 0.25s;\n  transition: opacity 0.25s;\n}\n\n.react-toggle-track {\n  width: 50px;\n  height: 24px;\n  padding: 0;\n  border-radius: 30px;\n  background-color: #4D4D4D;\n  -webkit-transition: all 0.2s ease;\n  -moz-transition: all 0.2s ease;\n  transition: all 0.2s ease;\n}\n\n.react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {\n  background-color: #000000;\n}\n\n.react-toggle--checked .react-toggle-track {\n  background-color: #19AB27;\n}\n\n.react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {\n  background-color: #128D15;\n}\n\n.react-toggle-track-check {\n  position: absolute;\n  width: 14px;\n  height: 10px;\n  top: 0px;\n  bottom: 0px;\n  margin-top: auto;\n  margin-bottom: auto;\n  line-height: 0;\n  left: 8px;\n  opacity: 0;\n  -webkit-transition: opacity 0.25s ease;\n  -moz-transition: opacity 0.25s ease;\n  transition: opacity 0.25s ease;\n}\n\n.react-toggle--checked .react-toggle-track-check {\n  opacity: 1;\n  -webkit-transition: opacity 0.25s ease;\n  -moz-transition: opacity 0.25s ease;\n  transition: opacity 0.25s ease;\n}\n\n.react-toggle-track-x {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  top: 0px;\n  bottom: 0px;\n  margin-top: auto;\n  margin-bottom: auto;\n  line-height: 0;\n  right: 10px;\n  opacity: 1;\n  -webkit-transition: opacity 0.25s ease;\n  -moz-transition: opacity 0.25s ease;\n  transition: opacity 0.25s ease;\n}\n\n.react-toggle--checked .react-toggle-track-x {\n  opacity: 0;\n}\n\n.react-toggle-thumb {\n  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;\n  position: absolute;\n  top: 1px;\n  left: 1px;\n  width: 22px;\n  height: 22px;\n  border: 1px solid #4D4D4D;\n  border-radius: 50%;\n  background-color: #FAFAFA;\n\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n\n  -webkit-transition: all 0.25s ease;\n  -moz-transition: all 0.25s ease;\n  transition: all 0.25s ease;\n}\n\n.react-toggle--checked .react-toggle-thumb {\n  left: 27px;\n  border-color: #19AB27;\n}\n\n.react-toggle--focus .react-toggle-thumb {\n  -webkit-box-shadow: 0px 0px 3px 2px #0099E0;\n  -moz-box-shadow: 0px 0px 3px 2px #0099E0;\n  box-shadow: 0px 0px 2px 3px #0099E0;\n}\n\n.react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {\n  -webkit-box-shadow: 0px 0px 5px 5px #0099E0;\n  -moz-box-shadow: 0px 0px 5px 5px #0099E0;\n  box-shadow: 0px 0px 5px 5px #0099E0;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sanitize.css/sanitize.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*! sanitize.css v5.0.0 | CC0 License | github.com/jonathantneal/sanitize.css */\n\n/* Document (https://html.spec.whatwg.org/multipage/semantics.html#semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove repeating backgrounds in all browsers (opinionated).\n * 2. Add box sizing inheritence in all browsers (opinionated).\n */\n\n*,\n::before,\n::after {\n\tbackground-repeat: no-repeat; /* 1 */\n\tbox-sizing: inherit; /* 2 */\n}\n\n/**\n * 1. Add text decoration inheritance in all browsers (opinionated).\n * 2. Add vertical alignment inheritence in all browsers (opinionated).\n */\n\n::before,\n::after {\n\ttext-decoration: inherit; /* 1 */\n\tvertical-align: inherit; /* 2 */\n}\n\n/**\n * 1. Add border box sizing in all browsers (opinionated).\n * 2. Add the default cursor in all browsers (opinionated).\n * 3. Prevent font size adjustments after orientation changes in IE and iOS.\n */\n\nhtml {\n\tbox-sizing: border-box; /* 1 */\n\tcursor: default; /* 2 */\n\t-ms-text-size-adjust: 100%; /* 3 */\n\t-webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/* Sections (https://html.spec.whatwg.org/multipage/semantics.html#sections)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n\tdisplay: block;\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n\tmargin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n\tfont-size: 2em;\n\tmargin: .67em 0;\n}\n\n/* Grouping content (https://html.spec.whatwg.org/multipage/semantics.html#grouping-content)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n\tdisplay: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n\tmargin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n\tbox-sizing: content-box; /* 1 */\n\theight: 0; /* 1 */\n\toverflow: visible; /* 2 */\n}\n\n/**\n * Remove the list style on navigation lists in all browsers (opinionated).\n */\n\nnav ol,\nnav ul {\n\tlist-style: none;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/* Text-level semantics (https://html.spec.whatwg.org/multipage/semantics.html#text-level-semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n\tbackground-color: transparent; /* 1 */\n\t-webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n\tborder-bottom: none; /* 1 */\n\ttext-decoration: underline; /* 2 */\n\ttext-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n\tfont-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n\tfont-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n\tfont-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n\tbackground-color: #ffff00;\n\tcolor: #000000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n\tfont-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -.25em;\n}\n\nsup {\n\ttop: -.5em;\n}\n\n/*\n * Remove the text shadow on text selections (opinionated).\n * 1. Restore the coloring undone by defining the text shadow (opinionated).\n */\n\n::-moz-selection {\n\tbackground-color: #b3d4fc; /* 1 */\n\tcolor: #000000; /* 1 */\n\ttext-shadow: none;\n}\n\n::selection {\n\tbackground-color: #b3d4fc; /* 1 */\n\tcolor: #000000; /* 1 */\n\ttext-shadow: none;\n}\n\n/* Embedded content (https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)\n   ========================================================================== */\n\n/*\n * Change the alignment on media elements in all browers (opinionated).\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n\tvertical-align: middle;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n\tdisplay: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n\tdisplay: none;\n\theight: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n\tborder-style: none;\n}\n\n/**\n * Change the fill color to match the text color in all browsers (opinionated).\n */\n\nsvg {\n\tfill: currentColor;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n\toverflow: hidden;\n}\n\n/* Tabular data (https://html.spec.whatwg.org/multipage/tables.html#tables)\n   ========================================================================== */\n\n/**\n * Collapse border spacing\n */\n\ntable {\n\tborder-collapse: collapse;\n}\n\n/* Forms (https://html.spec.whatwg.org/multipage/forms.html#forms)\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tmargin: 0;\n}\n\n/**\n * Inherit styling in all browsers (opinionated).\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n\tbackground-color: transparent;\n\tcolor: inherit;\n\tfont-size: inherit;\n\tline-height: inherit;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n\toverflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n\ttext-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n\t-webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n\tborder-style: none;\n\tpadding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n\toutline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n\tbox-sizing: border-box; /* 1 */\n\tcolor: inherit; /* 2 */\n\tdisplay: table; /* 1 */\n\tmax-width: 100%; /* 1 */\n\tpadding: 0; /* 3 */\n\twhite-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n\tdisplay: inline-block; /* 1 */\n\tvertical-align: baseline; /* 2 */\n}\n\n/**\n * 1. Remove the default vertical scrollbar in IE.\n * 2. Change the resize direction on textareas in all browsers (opinionated).\n */\n\ntextarea {\n\toverflow: auto; /* 1 */\n\tresize: vertical; /* 2 */\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n\tbox-sizing: border-box; /* 1 */\n\tpadding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n\t-webkit-appearance: textfield; /* 1 */\n\toutline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n\t-webkit-appearance: button; /* 1 */\n\tfont: inherit; /* 2 */\n}\n\n/* Interactive elements (https://html.spec.whatwg.org/multipage/forms.html#interactive-elements)\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n\tdisplay: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n\tdisplay: list-item;\n}\n\n/* Scripting (https://html.spec.whatwg.org/multipage/scripting.html#scripting-3)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n\tdisplay: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n\tdisplay: none;\n}\n\n/* User interaction (https://html.spec.whatwg.org/multipage/interaction.html#editing)\n   ========================================================================== */\n\n/*\n * Remove the tapping delay on clickable elements (opinionated).\n * 1. Remove the tapping delay in IE 10.\n */\n\na,\narea,\nbutton,\ninput,\nlabel,\nselect,\nsummary,\ntextarea,\n[tabindex] {\n\t-ms-touch-action: manipulation; /* 1 */\n\ttouch-action: manipulation;\n}\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n\tdisplay: none;\n}\n\n/* ARIA (https://w3c.github.io/html-aria/)\n   ========================================================================== */\n\n/**\n * Change the cursor on busy elements (opinionated).\n */\n\n[aria-busy=\"true\"] {\n\tcursor: progress;\n}\n\n/*\n * Change the cursor on control elements (opinionated).\n */\n\n[aria-controls] {\n\tcursor: pointer;\n}\n\n/*\n * Change the display on visually hidden accessible elements (opinionated).\n */\n\n[aria-hidden=\"false\"][hidden]:not(:focus) {\n\tclip: rect(0, 0, 0, 0);\n\tdisplay: inherit;\n\tposition: absolute;\n}\n\n/*\n * Change the cursor on disabled, not-editable, or otherwise\n * inoperable elements (opinionated).\n */\n\n[aria-disabled] {\n\tcursor: default;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/css-loader/lib/css-base.js");

/***/ }),

/***/ "./node_modules/eventsource-polyfill/dist/browserify-eventsource.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/eventsource-polyfill/dist/browserify-eventsource.js");

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/.htaccess":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + ".htaccess.bin";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/clinwiki-50.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "clinwiki-50.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/favicon.ico":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "favicon.ico";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/heading.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "heading.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-128x128.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-128x128.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-144x144.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-144x144.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-152x152.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-152x152.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-192x192.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-192x192.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-384x384.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-384x384.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-512x512.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-512x512.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-72x72.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-72x72.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/images/icon-96x96.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "icon-96x96.png";

/***/ }),

/***/ "./node_modules/file-loader/index.js?name=[name].[ext]!./app/manifest.json":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "manifest.json";

/***/ }),

/***/ "./node_modules/google-map-react/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/google-map-react/lib/index.js");

/***/ }),

/***/ "./node_modules/graphql-tag/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/graphql-tag/src/index.js");

/***/ }),

/***/ "./node_modules/html-entities/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__("./node_modules/html-entities/lib/xml-entities.js"),
  Html4Entities: __webpack_require__("./node_modules/html-entities/lib/html4-entities.js"),
  Html5Entities: __webpack_require__("./node_modules/html-entities/lib/html5-entities.js"),
  AllHtmlEntities: __webpack_require__("./node_modules/html-entities/lib/html5-entities.js")
};


/***/ }),

/***/ "./node_modules/html-entities/lib/html4-entities.js":
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),

/***/ "./node_modules/html-entities/lib/html5-entities.js":
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),

/***/ "./node_modules/html-entities/lib/xml-entities.js":
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),

/***/ "./node_modules/intl/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/intl/index.js");

/***/ }),

/***/ "./node_modules/intl/locale-data/jsonp/en.js":
/***/ (function(module, exports) {

IntlPolyfill.__addLocaleData({locale:"en",date:{ca:["gregory","buddhist","chinese","coptic","dangi","ethioaa","ethiopic","generic","hebrew","indian","islamic","islamicc","japanese","persian","roc"],hourNo0:true,hour12:true,formats:{short:"{1}, {0}",medium:"{1}, {0}",full:"{1} 'at' {0}",long:"{1} 'at' {0}",availableFormats:{"d":"d","E":"ccc",Ed:"d E",Ehm:"E h:mm a",EHm:"E HH:mm",Ehms:"E h:mm:ss a",EHms:"E HH:mm:ss",Gy:"y G",GyMMM:"MMM y G",GyMMMd:"MMM d, y G",GyMMMEd:"E, MMM d, y G","h":"h a","H":"HH",hm:"h:mm a",Hm:"HH:mm",hms:"h:mm:ss a",Hms:"HH:mm:ss",hmsv:"h:mm:ss a v",Hmsv:"HH:mm:ss v",hmv:"h:mm a v",Hmv:"HH:mm v","M":"L",Md:"M/d",MEd:"E, M/d",MMM:"LLL",MMMd:"MMM d",MMMEd:"E, MMM d",MMMMd:"MMMM d",ms:"mm:ss","y":"y",yM:"M/y",yMd:"M/d/y",yMEd:"E, M/d/y",yMMM:"MMM y",yMMMd:"MMM d, y",yMMMEd:"E, MMM d, y",yMMMM:"MMMM y",yQQQ:"QQQ y",yQQQQ:"QQQQ y"},dateFormats:{yMMMMEEEEd:"EEEE, MMMM d, y",yMMMMd:"MMMM d, y",yMMMd:"MMM d, y",yMd:"M/d/yy"},timeFormats:{hmmsszzzz:"h:mm:ss a zzzz",hmsz:"h:mm:ss a z",hms:"h:mm:ss a",hm:"h:mm a"}},calendars:{buddhist:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["BE"],short:["BE"],long:["BE"]},dayPeriods:{am:"AM",pm:"PM"}},chinese:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},coptic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"],long:["Tout","Baba","Hator","Kiahk","Toba","Amshir","Baramhat","Baramouda","Bashans","Paona","Epep","Mesra","Nasie"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},dangi:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Mo1","Mo2","Mo3","Mo4","Mo5","Mo6","Mo7","Mo8","Mo9","Mo10","Mo11","Mo12"],long:["Month1","Month2","Month3","Month4","Month5","Month6","Month7","Month8","Month9","Month10","Month11","Month12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},dayPeriods:{am:"AM",pm:"PM"}},ethiopic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},ethioaa:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13"],short:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"],long:["Meskerem","Tekemt","Hedar","Tahsas","Ter","Yekatit","Megabit","Miazia","Genbot","Sene","Hamle","Nehasse","Pagumen"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0"],short:["ERA0"],long:["ERA0"]},dayPeriods:{am:"AM",pm:"PM"}},generic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"],long:["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["ERA0","ERA1"],short:["ERA0","ERA1"],long:["ERA0","ERA1"]},dayPeriods:{am:"AM",pm:"PM"}},gregory:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["B","A","BCE","CE"],short:["BC","AD","BCE","CE"],long:["Before Christ","Anno Domini","Before Common Era","Common Era"]},dayPeriods:{am:"AM",pm:"PM"}},hebrew:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12","13","7"],short:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"],long:["Tishri","Heshvan","Kislev","Tevet","Shevat","Adar I","Adar","Nisan","Iyar","Sivan","Tamuz","Av","Elul","Adar II"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AM"],short:["AM"],long:["AM"]},dayPeriods:{am:"AM",pm:"PM"}},indian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"],long:["Chaitra","Vaisakha","Jyaistha","Asadha","Sravana","Bhadra","Asvina","Kartika","Agrahayana","Pausa","Magha","Phalguna"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Saka"],short:["Saka"],long:["Saka"]},dayPeriods:{am:"AM",pm:"PM"}},islamic:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},islamicc:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Muh.","Saf.","Rab. I","Rab. II","Jum. I","Jum. II","Raj.","Sha.","Ram.","Shaw.","Dhuʻl-Q.","Dhuʻl-H."],long:["Muharram","Safar","Rabiʻ I","Rabiʻ II","Jumada I","Jumada II","Rajab","Shaʻban","Ramadan","Shawwal","Dhuʻl-Qiʻdah","Dhuʻl-Hijjah"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AH"],short:["AH"],long:["AH"]},dayPeriods:{am:"AM",pm:"PM"}},japanese:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","M","T","S","H"],short:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"],long:["Taika (645–650)","Hakuchi (650–671)","Hakuhō (672–686)","Shuchō (686–701)","Taihō (701–704)","Keiun (704–708)","Wadō (708–715)","Reiki (715–717)","Yōrō (717–724)","Jinki (724–729)","Tenpyō (729–749)","Tenpyō-kampō (749-749)","Tenpyō-shōhō (749-757)","Tenpyō-hōji (757-765)","Tenpyō-jingo (765-767)","Jingo-keiun (767-770)","Hōki (770–780)","Ten-ō (781-782)","Enryaku (782–806)","Daidō (806–810)","Kōnin (810–824)","Tenchō (824–834)","Jōwa (834–848)","Kajō (848–851)","Ninju (851–854)","Saikō (854–857)","Ten-an (857-859)","Jōgan (859–877)","Gangyō (877–885)","Ninna (885–889)","Kanpyō (889–898)","Shōtai (898–901)","Engi (901–923)","Enchō (923–931)","Jōhei (931–938)","Tengyō (938–947)","Tenryaku (947–957)","Tentoku (957–961)","Ōwa (961–964)","Kōhō (964–968)","Anna (968–970)","Tenroku (970–973)","Ten’en (973–976)","Jōgen (976–978)","Tengen (978–983)","Eikan (983–985)","Kanna (985–987)","Eien (987–989)","Eiso (989–990)","Shōryaku (990–995)","Chōtoku (995–999)","Chōhō (999–1004)","Kankō (1004–1012)","Chōwa (1012–1017)","Kannin (1017–1021)","Jian (1021–1024)","Manju (1024–1028)","Chōgen (1028–1037)","Chōryaku (1037–1040)","Chōkyū (1040–1044)","Kantoku (1044–1046)","Eishō (1046–1053)","Tengi (1053–1058)","Kōhei (1058–1065)","Jiryaku (1065–1069)","Enkyū (1069–1074)","Shōho (1074–1077)","Shōryaku (1077–1081)","Eihō (1081–1084)","Ōtoku (1084–1087)","Kanji (1087–1094)","Kahō (1094–1096)","Eichō (1096–1097)","Jōtoku (1097–1099)","Kōwa (1099–1104)","Chōji (1104–1106)","Kashō (1106–1108)","Tennin (1108–1110)","Ten-ei (1110-1113)","Eikyū (1113–1118)","Gen’ei (1118–1120)","Hōan (1120–1124)","Tenji (1124–1126)","Daiji (1126–1131)","Tenshō (1131–1132)","Chōshō (1132–1135)","Hōen (1135–1141)","Eiji (1141–1142)","Kōji (1142–1144)","Ten’yō (1144–1145)","Kyūan (1145–1151)","Ninpei (1151–1154)","Kyūju (1154–1156)","Hōgen (1156–1159)","Heiji (1159–1160)","Eiryaku (1160–1161)","Ōho (1161–1163)","Chōkan (1163–1165)","Eiman (1165–1166)","Nin’an (1166–1169)","Kaō (1169–1171)","Shōan (1171–1175)","Angen (1175–1177)","Jishō (1177–1181)","Yōwa (1181–1182)","Juei (1182–1184)","Genryaku (1184–1185)","Bunji (1185–1190)","Kenkyū (1190–1199)","Shōji (1199–1201)","Kennin (1201–1204)","Genkyū (1204–1206)","Ken’ei (1206–1207)","Jōgen (1207–1211)","Kenryaku (1211–1213)","Kenpō (1213–1219)","Jōkyū (1219–1222)","Jōō (1222–1224)","Gennin (1224–1225)","Karoku (1225–1227)","Antei (1227–1229)","Kanki (1229–1232)","Jōei (1232–1233)","Tenpuku (1233–1234)","Bunryaku (1234–1235)","Katei (1235–1238)","Ryakunin (1238–1239)","En’ō (1239–1240)","Ninji (1240–1243)","Kangen (1243–1247)","Hōji (1247–1249)","Kenchō (1249–1256)","Kōgen (1256–1257)","Shōka (1257–1259)","Shōgen (1259–1260)","Bun’ō (1260–1261)","Kōchō (1261–1264)","Bun’ei (1264–1275)","Kenji (1275–1278)","Kōan (1278–1288)","Shōō (1288–1293)","Einin (1293–1299)","Shōan (1299–1302)","Kengen (1302–1303)","Kagen (1303–1306)","Tokuji (1306–1308)","Enkyō (1308–1311)","Ōchō (1311–1312)","Shōwa (1312–1317)","Bunpō (1317–1319)","Genō (1319–1321)","Genkō (1321–1324)","Shōchū (1324–1326)","Karyaku (1326–1329)","Gentoku (1329–1331)","Genkō (1331–1334)","Kenmu (1334–1336)","Engen (1336–1340)","Kōkoku (1340–1346)","Shōhei (1346–1370)","Kentoku (1370–1372)","Bunchū (1372–1375)","Tenju (1375–1379)","Kōryaku (1379–1381)","Kōwa (1381–1384)","Genchū (1384–1392)","Meitoku (1384–1387)","Kakei (1387–1389)","Kōō (1389–1390)","Meitoku (1390–1394)","Ōei (1394–1428)","Shōchō (1428–1429)","Eikyō (1429–1441)","Kakitsu (1441–1444)","Bun’an (1444–1449)","Hōtoku (1449–1452)","Kyōtoku (1452–1455)","Kōshō (1455–1457)","Chōroku (1457–1460)","Kanshō (1460–1466)","Bunshō (1466–1467)","Ōnin (1467–1469)","Bunmei (1469–1487)","Chōkyō (1487–1489)","Entoku (1489–1492)","Meiō (1492–1501)","Bunki (1501–1504)","Eishō (1504–1521)","Taiei (1521–1528)","Kyōroku (1528–1532)","Tenbun (1532–1555)","Kōji (1555–1558)","Eiroku (1558–1570)","Genki (1570–1573)","Tenshō (1573–1592)","Bunroku (1592–1596)","Keichō (1596–1615)","Genna (1615–1624)","Kan’ei (1624–1644)","Shōho (1644–1648)","Keian (1648–1652)","Jōō (1652–1655)","Meireki (1655–1658)","Manji (1658–1661)","Kanbun (1661–1673)","Enpō (1673–1681)","Tenna (1681–1684)","Jōkyō (1684–1688)","Genroku (1688–1704)","Hōei (1704–1711)","Shōtoku (1711–1716)","Kyōhō (1716–1736)","Genbun (1736–1741)","Kanpō (1741–1744)","Enkyō (1744–1748)","Kan’en (1748–1751)","Hōreki (1751–1764)","Meiwa (1764–1772)","An’ei (1772–1781)","Tenmei (1781–1789)","Kansei (1789–1801)","Kyōwa (1801–1804)","Bunka (1804–1818)","Bunsei (1818–1830)","Tenpō (1830–1844)","Kōka (1844–1848)","Kaei (1848–1854)","Ansei (1854–1860)","Man’en (1860–1861)","Bunkyū (1861–1864)","Genji (1864–1865)","Keiō (1865–1868)","Meiji","Taishō","Shōwa","Heisei"]},dayPeriods:{am:"AM",pm:"PM"}},persian:{months:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],short:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"],long:["Farvardin","Ordibehesht","Khordad","Tir","Mordad","Shahrivar","Mehr","Aban","Azar","Dey","Bahman","Esfand"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["AP"],short:["AP"],long:["AP"]},dayPeriods:{am:"AM",pm:"PM"}},roc:{months:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],short:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],long:["January","February","March","April","May","June","July","August","September","October","November","December"]},days:{narrow:["S","M","T","W","T","F","S"],short:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],long:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},eras:{narrow:["Before R.O.C.","Minguo"],short:["Before R.O.C.","Minguo"],long:["Before R.O.C.","Minguo"]},dayPeriods:{am:"AM",pm:"PM"}}}},number:{nu:["latn"],patterns:{decimal:{positivePattern:"{number}",negativePattern:"{minusSign}{number}"},currency:{positivePattern:"{currency}{number}",negativePattern:"{minusSign}{currency}{number}"},percent:{positivePattern:"{number}{percentSign}",negativePattern:"{minusSign}{number}{percentSign}"}},symbols:{latn:{decimal:".",group:",",nan:"NaN",plusSign:"+",minusSign:"-",percentSign:"%",infinity:"∞"}},currencies:{AUD:"A$",BRL:"R$",CAD:"CA$",CNY:"CN¥",EUR:"€",GBP:"£",HKD:"HK$",ILS:"₪",INR:"₹",JPY:"¥",KRW:"₩",MXN:"MX$",NZD:"NZ$",TWD:"NT$",USD:"$",VND:"₫",XAF:"FCFA",XCD:"EC$",XOF:"CFA",XPF:"CFPF"}}});

/***/ }),

/***/ "./node_modules/query-string/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/query-string/index.js");

/***/ }),

/***/ "./node_modules/querystring-es3/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/querystring-es3/index.js");

/***/ }),

/***/ "./node_modules/ramda/es/bind.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_arity_js__ = __webpack_require__("./node_modules/ramda/es/internal/_arity.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_curry2_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry2.js");



/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */
var bind = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_1__internal_curry2_js__["a" /* default */])(function bind(fn, thisObj) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__internal_arity_js__["a" /* default */])(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});
/* harmony default export */ __webpack_exports__["a"] = (bind);

/***/ }),

/***/ "./node_modules/ramda/es/equals.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_curry2_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry2.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_equals_js__ = __webpack_require__("./node_modules/ramda/es/internal/_equals.js");



/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
var equals = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__internal_curry2_js__["a" /* default */])(function equals(a, b) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__internal_equals_js__["a" /* default */])(a, b, [], []);
});
/* harmony default export */ __webpack_exports__["default"] = (equals);

/***/ }),

/***/ "./node_modules/ramda/es/filter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_curry2_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry2.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_dispatchable_js__ = __webpack_require__("./node_modules/ramda/es/internal/_dispatchable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_filter_js__ = __webpack_require__("./node_modules/ramda/es/internal/_filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_isObject_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_reduce_js__ = __webpack_require__("./node_modules/ramda/es/internal/_reduce.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__internal_xfilter_js__ = __webpack_require__("./node_modules/ramda/es/internal/_xfilter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__keys_js__ = __webpack_require__("./node_modules/ramda/es/keys.js");








/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
var filter = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__internal_curry2_js__["a" /* default */])( /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_1__internal_dispatchable_js__["a" /* default */])(['filter'], __WEBPACK_IMPORTED_MODULE_5__internal_xfilter_js__["a" /* default */], function (pred, filterable) {
  return Object(__WEBPACK_IMPORTED_MODULE_3__internal_isObject_js__["a" /* default */])(filterable) ? Object(__WEBPACK_IMPORTED_MODULE_4__internal_reduce_js__["a" /* default */])(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }
    return acc;
  }, {}, Object(__WEBPACK_IMPORTED_MODULE_6__keys_js__["a" /* default */])(filterable)) :
  // else
  Object(__WEBPACK_IMPORTED_MODULE_2__internal_filter_js__["a" /* default */])(pred, filterable);
}));
/* harmony default export */ __webpack_exports__["a"] = (filter);

/***/ }),

/***/ "./node_modules/ramda/es/internal/_arity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _arity;
function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };
    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_arrayFromIterator.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _arrayFromIterator;
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_complement.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _complement;
function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_curry1.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _curry1;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isPlaceholder_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isPlaceholder.js");


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || Object(__WEBPACK_IMPORTED_MODULE_0__isPlaceholder_js__["a" /* default */])(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_curry2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _curry2;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry1_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isPlaceholder.js");



/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return Object(__WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__["a" /* default */])(a) ? f2 : Object(__WEBPACK_IMPORTED_MODULE_0__curry1_js__["a" /* default */])(function (_b) {
          return fn(a, _b);
        });
      default:
        return Object(__WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__["a" /* default */])(a) && Object(__WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__["a" /* default */])(b) ? f2 : Object(__WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__["a" /* default */])(a) ? Object(__WEBPACK_IMPORTED_MODULE_0__curry1_js__["a" /* default */])(function (_a) {
          return fn(_a, b);
        }) : Object(__WEBPACK_IMPORTED_MODULE_1__isPlaceholder_js__["a" /* default */])(b) ? Object(__WEBPACK_IMPORTED_MODULE_0__curry1_js__["a" /* default */])(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_dispatchable.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _dispatchable;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArray_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isTransformer_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isTransformer.js");



/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__isArray_js__["a" /* default */])(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (Object(__WEBPACK_IMPORTED_MODULE_1__isTransformer_js__["a" /* default */])(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_equals.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__arrayFromIterator_js__ = __webpack_require__("./node_modules/ramda/es/internal/_arrayFromIterator.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__includesWith_js__ = __webpack_require__("./node_modules/ramda/es/internal/_includesWith.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__functionName_js__ = __webpack_require__("./node_modules/ramda/es/internal/_functionName.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__has_js__ = __webpack_require__("./node_modules/ramda/es/internal/_has.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__objectIs_js__ = __webpack_require__("./node_modules/ramda/es/internal/_objectIs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__keys_js__ = __webpack_require__("./node_modules/ramda/es/keys.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__type_js__ = __webpack_require__("./node_modules/ramda/es/type.js");








/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparision of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */

function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = Object(__WEBPACK_IMPORTED_MODULE_0__arrayFromIterator_js__["a" /* default */])(aIterator);
  var b = Object(__WEBPACK_IMPORTED_MODULE_0__arrayFromIterator_js__["a" /* default */])(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }

  // if *a* array contains any element that is not included in *b*
  return !Object(__WEBPACK_IMPORTED_MODULE_1__includesWith_js__["a" /* default */])(function (b, aItem) {
    return !Object(__WEBPACK_IMPORTED_MODULE_1__includesWith_js__["a" /* default */])(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (Object(__WEBPACK_IMPORTED_MODULE_4__objectIs_js__["a" /* default */])(a, b)) {
    return true;
  }

  var typeA = Object(__WEBPACK_IMPORTED_MODULE_6__type_js__["a" /* default */])(a);

  if (typeA !== Object(__WEBPACK_IMPORTED_MODULE_6__type_js__["a" /* default */])(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && Object(__WEBPACK_IMPORTED_MODULE_2__functionName_js__["a" /* default */])(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && Object(__WEBPACK_IMPORTED_MODULE_4__objectIs_js__["a" /* default */])(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!Object(__WEBPACK_IMPORTED_MODULE_4__objectIs_js__["a" /* default */])(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = Object(__WEBPACK_IMPORTED_MODULE_5__keys_js__["a" /* default */])(a);
  if (keysA.length !== Object(__WEBPACK_IMPORTED_MODULE_5__keys_js__["a" /* default */])(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);

  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(Object(__WEBPACK_IMPORTED_MODULE_3__has_js__["a" /* default */])(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_filter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _filter;
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_functionName.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _functionName;
function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_has.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _has;
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_includesWith.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _includesWith;
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isArguments.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__has_js__ = __webpack_require__("./node_modules/ramda/es/internal/_has.js");


var toString = Object.prototype.toString;
var _isArguments = /*#__PURE__*/function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__has_js__["a" /* default */])('callee', x);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (_isArguments);

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isArray.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
/* harmony default export */ __webpack_exports__["a"] = (Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
});

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isArrayLike.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry1_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArray_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isString_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isString.js");




/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
var _isArrayLike = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__curry1_js__["a" /* default */])(function isArrayLike(x) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isArray_js__["a" /* default */])(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== 'object') {
    return false;
  }
  if (Object(__WEBPACK_IMPORTED_MODULE_2__isString_js__["a" /* default */])(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
/* harmony default export */ __webpack_exports__["a"] = (_isArrayLike);

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isObject.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _isObject;
function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isPlaceholder.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _isPlaceholder;
function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isString.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _isString;
function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_isTransformer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _isTransformer;
function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_objectIs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (typeof Object.is === 'function' ? Object.is : _objectIs);

/***/ }),

/***/ "./node_modules/ramda/es/internal/_reduce.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _reduce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isArrayLike.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__xwrap_js__ = __webpack_require__("./node_modules/ramda/es/internal/_xwrap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bind_js__ = __webpack_require__("./node_modules/ramda/es/bind.js");




function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    idx += 1;
  }
  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);
    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }
    step = iter.next();
  }
  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](Object(__WEBPACK_IMPORTED_MODULE_2__bind_js__["a" /* default */])(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = Object(__WEBPACK_IMPORTED_MODULE_1__xwrap_js__["a" /* default */])(fn);
  }
  if (Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(list)) {
    return _arrayReduce(fn, acc, list);
  }
  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }
  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }
  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }
  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

/***/ }),

/***/ "./node_modules/ramda/es/internal/_xfBase.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
});

/***/ }),

/***/ "./node_modules/ramda/es/internal/_xfilter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__curry2_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry2.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__xfBase_js__ = __webpack_require__("./node_modules/ramda/es/internal/_xfBase.js");



var XFilter = /*#__PURE__*/function () {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter.prototype['@@transducer/init'] = __WEBPACK_IMPORTED_MODULE_1__xfBase_js__["a" /* default */].init;
  XFilter.prototype['@@transducer/result'] = __WEBPACK_IMPORTED_MODULE_1__xfBase_js__["a" /* default */].result;
  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

var _xfilter = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__curry2_js__["a" /* default */])(function _xfilter(f, xf) {
  return new XFilter(f, xf);
});
/* harmony default export */ __webpack_exports__["a"] = (_xfilter);

/***/ }),

/***/ "./node_modules/ramda/es/internal/_xwrap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _xwrap;
var XWrap = /*#__PURE__*/function () {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };
  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

/***/ }),

/***/ "./node_modules/ramda/es/keys.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_curry1_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_has_js__ = __webpack_require__("./node_modules/ramda/es/internal/_has.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_isArguments_js__ = __webpack_require__("./node_modules/ramda/es/internal/_isArguments.js");




// cover IE < 9 keys issues
var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// Safari bug
var hasArgsEnumBug = /*#__PURE__*/function () {
  'use strict';

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};

/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__internal_curry1_js__["a" /* default */])(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__internal_curry1_js__["a" /* default */])(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && Object(__WEBPACK_IMPORTED_MODULE_2__internal_isArguments_js__["a" /* default */])(obj);
  for (prop in obj) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__internal_has_js__["a" /* default */])(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (Object(__WEBPACK_IMPORTED_MODULE_1__internal_has_js__["a" /* default */])(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
/* harmony default export */ __webpack_exports__["a"] = (keys);

/***/ }),

/***/ "./node_modules/ramda/es/reject.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_complement_js__ = __webpack_require__("./node_modules/ramda/es/internal/_complement.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_curry2_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry2.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__filter_js__ = __webpack_require__("./node_modules/ramda/es/filter.js");




/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      const isOdd = (n) => n % 2 === 1;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
var reject = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_1__internal_curry2_js__["a" /* default */])(function reject(pred, filterable) {
  return Object(__WEBPACK_IMPORTED_MODULE_2__filter_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__internal_complement_js__["a" /* default */])(pred), filterable);
});
/* harmony default export */ __webpack_exports__["default"] = (reject);

/***/ }),

/***/ "./node_modules/ramda/es/type.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_curry1_js__ = __webpack_require__("./node_modules/ramda/es/internal/_curry1.js");


/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */
var type = /*#__PURE__*/Object(__WEBPACK_IMPORTED_MODULE_0__internal_curry1_js__["a" /* default */])(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
/* harmony default export */ __webpack_exports__["a"] = (type);

/***/ }),

/***/ "./node_modules/ramda/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/ramda/src/index.js");

/***/ }),

/***/ "./node_modules/react-apollo/react-apollo.browser.umd.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-apollo/react-apollo.browser.umd.js");

/***/ }),

/***/ "./node_modules/react-autosuggest/dist/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-autosuggest/dist/index.js");

/***/ }),

/***/ "./node_modules/react-bootstrap-typeahead/css/Typeahead.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-bootstrap-typeahead/css/Typeahead.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js!./node_modules/react-bootstrap-typeahead/css/Typeahead.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-bootstrap-typeahead/css/Typeahead.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/react-bootstrap-typeahead/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-bootstrap-typeahead/lib/index.js");

/***/ }),

/***/ "./node_modules/react-bootstrap/es/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-bootstrap/es/index.js");

/***/ }),

/***/ "./node_modules/react-dom/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-dom/index.js");

/***/ }),

/***/ "./node_modules/react-fontawesome/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-fontawesome/lib/index.js");

/***/ }),

/***/ "./node_modules/react-helmet/lib/Helmet.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-helmet/lib/Helmet.js");

/***/ }),

/***/ "./node_modules/react-infinite-scroller/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-infinite-scroller/index.js");

/***/ }),

/***/ "./node_modules/react-intl/lib/index.es.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-intl/lib/index.es.js");

/***/ }),

/***/ "./node_modules/react-intl/locale-data/en.js":
/***/ (function(module, exports, __webpack_require__) {

!function(e,a){ true?module.exports=a():"function"==typeof define&&define.amd?define(a):(e.ReactIntlLocaleData=e.ReactIntlLocaleData||{},e.ReactIntlLocaleData.en=a())}(this,function(){"use strict";return[{locale:"en",pluralRuleFunction:function(e,a){var n=String(e).split("."),l=!n[1],o=Number(n[0])==e,t=o&&n[0].slice(-1),r=o&&n[0].slice(-2);return a?1==t&&11!=r?"one":2==t&&12!=r?"two":3==t&&13!=r?"few":"other":1==e&&l?"one":"other"},fields:{year:{displayName:"year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{one:"in {0} year",other:"in {0} years"},past:{one:"{0} year ago",other:"{0} years ago"}}},month:{displayName:"month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{one:"in {0} month",other:"in {0} months"},past:{one:"{0} month ago",other:"{0} months ago"}}},day:{displayName:"day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{one:"in {0} day",other:"in {0} days"},past:{one:"{0} day ago",other:"{0} days ago"}}},hour:{displayName:"hour",relative:{0:"this hour"},relativeTime:{future:{one:"in {0} hour",other:"in {0} hours"},past:{one:"{0} hour ago",other:"{0} hours ago"}}},minute:{displayName:"minute",relative:{0:"this minute"},relativeTime:{future:{one:"in {0} minute",other:"in {0} minutes"},past:{one:"{0} minute ago",other:"{0} minutes ago"}}},second:{displayName:"second",relative:{0:"now"},relativeTime:{future:{one:"in {0} second",other:"in {0} seconds"},past:{one:"{0} second ago",other:"{0} seconds ago"}}}}},{locale:"en-001",parentLocale:"en"},{locale:"en-150",parentLocale:"en-001"},{locale:"en-AG",parentLocale:"en-001"},{locale:"en-AI",parentLocale:"en-001"},{locale:"en-AS",parentLocale:"en"},{locale:"en-AT",parentLocale:"en-150"},{locale:"en-AU",parentLocale:"en-001"},{locale:"en-BB",parentLocale:"en-001"},{locale:"en-BE",parentLocale:"en-001"},{locale:"en-BI",parentLocale:"en"},{locale:"en-BM",parentLocale:"en-001"},{locale:"en-BS",parentLocale:"en-001"},{locale:"en-BW",parentLocale:"en-001"},{locale:"en-BZ",parentLocale:"en-001"},{locale:"en-CA",parentLocale:"en-001"},{locale:"en-CC",parentLocale:"en-001"},{locale:"en-CH",parentLocale:"en-150"},{locale:"en-CK",parentLocale:"en-001"},{locale:"en-CM",parentLocale:"en-001"},{locale:"en-CX",parentLocale:"en-001"},{locale:"en-CY",parentLocale:"en-001"},{locale:"en-DE",parentLocale:"en-150"},{locale:"en-DG",parentLocale:"en-001"},{locale:"en-DK",parentLocale:"en-150"},{locale:"en-DM",parentLocale:"en-001"},{locale:"en-Dsrt",pluralRuleFunction:function(e,a){return"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relative:{0:"this hour"},relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relative:{0:"this minute"},relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}},{locale:"en-ER",parentLocale:"en-001"},{locale:"en-FI",parentLocale:"en-150"},{locale:"en-FJ",parentLocale:"en-001"},{locale:"en-FK",parentLocale:"en-001"},{locale:"en-FM",parentLocale:"en-001"},{locale:"en-GB",parentLocale:"en-001"},{locale:"en-GD",parentLocale:"en-001"},{locale:"en-GG",parentLocale:"en-001"},{locale:"en-GH",parentLocale:"en-001"},{locale:"en-GI",parentLocale:"en-001"},{locale:"en-GM",parentLocale:"en-001"},{locale:"en-GU",parentLocale:"en"},{locale:"en-GY",parentLocale:"en-001"},{locale:"en-HK",parentLocale:"en-001"},{locale:"en-IE",parentLocale:"en-001"},{locale:"en-IL",parentLocale:"en-001"},{locale:"en-IM",parentLocale:"en-001"},{locale:"en-IN",parentLocale:"en-001"},{locale:"en-IO",parentLocale:"en-001"},{locale:"en-JE",parentLocale:"en-001"},{locale:"en-JM",parentLocale:"en-001"},{locale:"en-KE",parentLocale:"en-001"},{locale:"en-KI",parentLocale:"en-001"},{locale:"en-KN",parentLocale:"en-001"},{locale:"en-KY",parentLocale:"en-001"},{locale:"en-LC",parentLocale:"en-001"},{locale:"en-LR",parentLocale:"en-001"},{locale:"en-LS",parentLocale:"en-001"},{locale:"en-MG",parentLocale:"en-001"},{locale:"en-MH",parentLocale:"en"},{locale:"en-MO",parentLocale:"en-001"},{locale:"en-MP",parentLocale:"en"},{locale:"en-MS",parentLocale:"en-001"},{locale:"en-MT",parentLocale:"en-001"},{locale:"en-MU",parentLocale:"en-001"},{locale:"en-MW",parentLocale:"en-001"},{locale:"en-MY",parentLocale:"en-001"},{locale:"en-NA",parentLocale:"en-001"},{locale:"en-NF",parentLocale:"en-001"},{locale:"en-NG",parentLocale:"en-001"},{locale:"en-NL",parentLocale:"en-150"},{locale:"en-NR",parentLocale:"en-001"},{locale:"en-NU",parentLocale:"en-001"},{locale:"en-NZ",parentLocale:"en-001"},{locale:"en-PG",parentLocale:"en-001"},{locale:"en-PH",parentLocale:"en-001"},{locale:"en-PK",parentLocale:"en-001"},{locale:"en-PN",parentLocale:"en-001"},{locale:"en-PR",parentLocale:"en"},{locale:"en-PW",parentLocale:"en-001"},{locale:"en-RW",parentLocale:"en-001"},{locale:"en-SB",parentLocale:"en-001"},{locale:"en-SC",parentLocale:"en-001"},{locale:"en-SD",parentLocale:"en-001"},{locale:"en-SE",parentLocale:"en-150"},{locale:"en-SG",parentLocale:"en-001"},{locale:"en-SH",parentLocale:"en-001"},{locale:"en-SI",parentLocale:"en-150"},{locale:"en-SL",parentLocale:"en-001"},{locale:"en-SS",parentLocale:"en-001"},{locale:"en-SX",parentLocale:"en-001"},{locale:"en-SZ",parentLocale:"en-001"},{locale:"en-Shaw",pluralRuleFunction:function(e,a){return"other"},fields:{year:{displayName:"Year",relative:{0:"this year",1:"next year","-1":"last year"},relativeTime:{future:{other:"+{0} y"},past:{other:"-{0} y"}}},month:{displayName:"Month",relative:{0:"this month",1:"next month","-1":"last month"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Day",relative:{0:"today",1:"tomorrow","-1":"yesterday"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Hour",relative:{0:"this hour"},relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minute",relative:{0:"this minute"},relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Second",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}},{locale:"en-TC",parentLocale:"en-001"},{locale:"en-TK",parentLocale:"en-001"},{locale:"en-TO",parentLocale:"en-001"},{locale:"en-TT",parentLocale:"en-001"},{locale:"en-TV",parentLocale:"en-001"},{locale:"en-TZ",parentLocale:"en-001"},{locale:"en-UG",parentLocale:"en-001"},{locale:"en-UM",parentLocale:"en"},{locale:"en-US",parentLocale:"en"},{locale:"en-VC",parentLocale:"en-001"},{locale:"en-VG",parentLocale:"en-001"},{locale:"en-VI",parentLocale:"en"},{locale:"en-VU",parentLocale:"en-001"},{locale:"en-WS",parentLocale:"en-001"},{locale:"en-ZA",parentLocale:"en-001"},{locale:"en-ZM",parentLocale:"en-001"},{locale:"en-ZW",parentLocale:"en-001"}]});


/***/ }),

/***/ "./node_modules/react-loadable/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-loadable/lib/index.js");

/***/ }),

/***/ "./node_modules/react-router-dom/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-router-dom/index.js");

/***/ }),

/***/ "./node_modules/react-router/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-router/index.js");

/***/ }),

/***/ "./node_modules/react-rte-yt/dist/react-rte.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-rte-yt/dist/react-rte.js");

/***/ }),

/***/ "./node_modules/react-spinners/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-spinners/index.js");

/***/ }),

/***/ "./node_modules/react-stars/dist/react-stars.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-stars/dist/react-stars.js");

/***/ }),

/***/ "./node_modules/react-table/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-table/lib/index.js");

/***/ }),

/***/ "./node_modules/react-table/react-table.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-table/react-table.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js!./node_modules/react-table/react-table.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-table/react-table.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/react-toggle/style.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-toggle/style.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js!./node_modules/react-toggle/style.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/react-toggle/style.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/react-transition-group/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react-transition-group/index.js");

/***/ }),

/***/ "./node_modules/react/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/react/index.js");

/***/ }),

/***/ "./node_modules/sanitize.css/sanitize.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/sanitize.css/sanitize.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js!./node_modules/sanitize.css/sanitize.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/sanitize.css/sanitize.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/strip-ansi/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/strip-ansi/index.js");

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__("./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);

	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/styled-components/dist/styled-components.browser.es.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/styled-components/dist/styled-components.browser.es.js");

/***/ }),

/***/ "./node_modules/webpack-hot-middleware/client-overlay.js":
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__("./node_modules/ansi-html/index.js");
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__("./node_modules/html-entities/index.js").AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),

/***/ "./node_modules/webpack-hot-middleware/client.js?reload=true":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__("./node_modules/querystring-es3/index.js");
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__("./node_modules/strip-ansi/index.js");

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__("./node_modules/webpack-hot-middleware/client-overlay.js");
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__("./node_modules/webpack-hot-middleware/process-update.js");

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?reload=true", __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack-hot-middleware/process-update.js":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference reactBoilerplateDeps"))("./node_modules/webpack/buildin/module.js");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/eventsource-polyfill/dist/browserify-eventsource.js");
__webpack_require__("./node_modules/webpack-hot-middleware/client.js?reload=true");
module.exports = __webpack_require__("./app/app.tsx");


/***/ }),

/***/ "dll-reference reactBoilerplateDeps":
/***/ (function(module, exports) {

module.exports = reactBoilerplateDeps;

/***/ })

/******/ });
//# sourceMappingURL=main.js.map